/**
 * Mutations that happen on a clock or on movement rather than on a roll.
 *
 * - **Moved 10 feet this turn** (Carnelian Depth 2, Bronze Depth 2). pf2e knows where a token is, not how far
 *   it came, so the distance is summed from each move during the creature's own turn and written as the roll
 *   option `self:moved-10-feet-this-turn` — `self:`-prefixed so rolls against it see it too, and cleared when
 *   its next turn starts.
 * - **Hematite, Depth 2**: temporary Hit Points equal to your level at the start of each encounter.
 */

import { AssimilatorDamage, depthOf as depth, suppressed } from "./damage.mjs";
import { Engine } from "./engine.mjs";
import { GulletApp } from "./gullet.mjs";
import { encounterOf } from "../lib/encounter-damage.mjs";
import { Relay } from "../riders/relay.mjs";
import { wrap } from "../lib/wrap.mjs";

const MOVED = "self:moved-10-feet-this-turn";
const DARK = "self:in-dim-light-or-darkness";
const MODULE = "isaacs-hb-pf2e";
/** Effects that ride one Strike and are spent by its damage roll. */
const ONE_STRIKE = ["effect-reservoir-primed", "effect-conductive-charge-fire", "effect-conductive-charge-electricity",
    "effect-kinetic-surge", "effect-quartz-charge"];
/** Moonstone: resistances held at once, and uses per encounter, by Depth (lexicon §13). */
const MOONSTONE_HELD = { 1: 1, 2: 1, 3: 2, 4: 3 };
const MOONSTONE_USES = { 1: 1, 2: 2, 3: 2, 4: Infinity };
const PATH = `flags.pf2e.rollOptions.all.${MOVED}`;
/**
 * "Once per encounter" on a Mutation's action. pf2e's Frequency has no encounter interval, so the sheet can
 * neither show nor spend it, and the five actions that print it were usable every turn. Keyed by use, not by
 * item: the Healing Flare is the Flare used "instead", so it spends the same one.
 */
const PER_ENCOUNTER = {
    "flare": { key: "flare" },
    "healing-flare": { key: "flare" },
    "aberrant-gland": { key: "gland" },
    "null-field": { key: "null-field" },
    // Lapis Lazuli Depth 4: "Once per encounter".
    "lay-bare": { key: "lay-bare" },
    // Pearl Depth 4: "Twice per encounter."
    "cleansing-tide": { key: "cleansing-tide", max: (actor) => (depthOf(actor, "pearl") >= 4 ? 2 : 1) },
    // The Bonds' own once-per-encounter actions.
    "ignite-the-solar-core": { key: "solar-core" },
    "imperial-strike": { key: "imperial-strike" },
};

/** Distance moved this turn, by token id, stamped with the turn it belongs to. */
const travelled = new Map();
const origins = new Map();

function isWriter() {
    return game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM;
}

function turnKey(combat) {
    return combat ? `${combat.id}:${combat.round}:${combat.turn}` : null;
}

function depthOf(actor, slug) {
    if (suppressed(actor)) return 0;
    const m = actor?.getRollOptions?.().map((o) => new RegExp(`^self:effect:substrate-${slug}:(\\d+)$`).exec(o)).find(Boolean);
    return m ? Number(m[1]) : 0;
}

const TOPAZ = "assimilatorTopaz";
const RUSH = "assimilatorFrameRush";
const BARE = "assimilatorLayBare";
const LAPIS = "assimilatorLapisInsight";
const EFFECTS_PACK = "isaacs-hb-pf2e.assimilator-effects";

async function effectDoc(slug) {
    return ((await game.packs.get(EFFECTS_PACK)?.getDocuments()) ?? []).find((d) => d.slug === slug) ?? null;
}
const MANOEUVRES = { shove: "Shove", trip: "Trip", grapple: "Grapple" };

export const Mutations = {
    /**
     * Onyx Depth 4, *Shadow Step*: "teleport between two areas of darkness within 60 feet" (#91). Darkness is a dark
     * scene or a point inside one of Foundry's darkness sources — Shadow Mantle's among them, which rides its token.
     * pf2e reads light scene-wide only, so the point test is Foundry's.
     */
    inDarkness(point) {
        if ((canvas.scene?.environment?.darknessLevel ?? 0) >= 0.5) return true;
        const test = canvas.effects?.testInsideDarkness;
        return typeof test === "function" ? !!canvas.effects.testInsideDarkness({ x: point.x, y: point.y, elevation: 0 }) : false;
    },

    async shadowStep(actor, destination) {
        const token = actor?.getActiveTokens?.(true, false)?.[0];
        if (!token || !destination) return false;
        const refuse = (why) => { ui.notifications.warn(`Shadow Step: ${why}`); return false; };
        const size = canvas.grid.size;
        const snapped = { x: Math.floor(destination.x / size) * size, y: Math.floor(destination.y / size) * size };
        const centre = { x: snapped.x + (token.document.width * size) / 2, y: snapped.y + (token.document.height * size) / 2 };
        if (canvas.grid.measurePath([token.center, centre]).distance > 60) return refuse("the destination is beyond 60 feet.");
        if (!Mutations.inDarkness(token.center)) return refuse("you are not standing in darkness.");
        if (!Mutations.inDarkness(centre)) return refuse("the destination is not in darkness.");
        await token.document.update({ x: snapped.x, y: snapped.y }, { animate: false, teleport: true });
        await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }),
            content: `<p><strong>Shadow Step</strong>: ${actor.name} steps from one darkness into another.</p>` });
        return true;
    },

    /** The use card: the next click on the board is where the step lands. */
    pickShadowStep(actor) {
        ui.notifications.info("Shadow Step: click the square in darkness to step to.");
        canvas.stage.once("pointerdown", (event) => {
            const point = event.getLocalPosition?.(canvas.stage) ?? canvas.mousePosition;
            Mutations.shadowStep(actor, point).catch((e) => console.error("Isaac's Homebrew | Shadow Step", e));
        });
    },

    /**
     * Lapis Lazuli Depth 2: *"When you succeed at Recall Knowledge about a creature, allies gain +1 circumstance to
     * attacks against it for 1 round"* (#88). pf2e gives no roll option for alliance, so the bonus goes to the allies
     * rather than onto the creature: each creature on the scene of the Assimilator's alliance, not the Assimilator,
     * gets *Lapis Insight* aimed at the creature's signature.
     */
    async lapisInsight(message) {
        const context = message.flags?.pf2e?.context;
        const actor = message.actor;
        if (context?.type !== "skill-check" || !["success", "criticalSuccess"].includes(context.outcome)) return null;
        if (!(context.options ?? []).includes("action:recall-knowledge") || depth(actor, "lapis-lazuli") < 2) return null;
        const creature = (context.target?.actor ? fromUuidSync(context.target.actor) : null) ?? [...game.user.targets][0]?.actor ?? null;
        if (!creature || creature.id === actor.id) return null;
        return Relay.request({ action: LAPIS, origin: actor.uuid, creature: creature.uuid });
    },

    /** The GM gives each ally on the scene Lapis Insight aimed at the creature. */
    async grantInsight({ origin, creature: creatureUuid }) {
        const actor = await fromUuid(origin);
        const creature = await fromUuid(creatureUuid);
        const alliance = actor?.system?.details?.alliance;
        if (!actor || !creature || !alliance) return null;
        const doc = await effectDoc("effect-lapis-insight");
        if (!doc) return null;
        const allies = [...new Set(canvas.scene.tokens.map((t) => t.actor).filter((a) => a && a.id !== actor.id
            && a.id !== creature.id && a.system?.details?.alliance === alliance))];
        for (const ally of allies) {
            const source = foundry.utils.deepClone(doc.toObject());
            source.name = `Effect: Lapis Insight (${creature.name})`;
            foundry.utils.setProperty(source, `flags.${MODULE}.assimilator.lapis`, creature.signature);
            await ally.createEmbeddedDocuments("Item", [source]);
        }
        return allies.length;
    },

    /** Lapis Lazuli Depth 4, *Lay Bare*: the target's strongest and weakest saves, marked for this Assimilator. */
    async layBare(actor) {
        const target = [...game.user.targets][0]?.actor ?? null;
        if (!target) {
            ui.notifications.warn("Lay Bare: target the creature first.");
            return null;
        }
        return Relay.request({ action: BARE, origin: actor.uuid, target: target.uuid });
    },

    async markBare({ origin, target }) {
        const actor = await fromUuid(origin);
        const creature = await fromUuid(target);
        const saves = ["fortitude", "reflex", "will"].map((s) => [s, creature?.saves?.[s]?.mod ?? null]).filter(([, m]) => m !== null);
        if (!actor || saves.length < 2) return null;
        const strongest = saves.reduce((a, b) => (b[1] > a[1] ? b : a))[0];
        const weakest = saves.reduce((a, b) => (b[1] < a[1] ? b : a))[0];
        const doc = await effectDoc("effect-laid-bare");
        if (!doc) return null;
        for (const old of creature.itemTypes.effect.filter((e) => e.flags?.[MODULE]?.laidBare?.origin === origin)) await old.delete();
        const source = foundry.utils.deepClone(doc.toObject());
        source.name = `Effect: Laid Bare (${strongest} → ${weakest})`;
        foundry.utils.setProperty(source, `flags.${MODULE}.laidBare`, { origin, strongest, weakest });
        await creature.createEmbeddedDocuments("Item", [source]);
        await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }),
            content: `<p><strong>Lay Bare</strong>: ${creature.name}'s strongest save is <strong>${strongest}</strong>; `
                + `for 1 minute ${actor.name}'s Mutations target its <strong>${weakest}</strong> instead.</p>` });
        return { strongest, weakest };
    },

    /**
     * Bronze Depth 3, *Frame Rush*: "make a Strike and then a Shove, Trip or Grapple as a single action" (#87). The
     * Carapace Strike is rolled against the target — followed through to damage, as every scripted Strike is — and a
     * card asks which manoeuvre follows. pf2e counts no attacks, so the Strike takes no multiple attack penalty and
     * the manoeuvre takes the next step: the combo as the turn's first attacks.
     */
    async frameRush(actor) {
        const target = [...game.user.targets][0] ?? null;
        const strike = actor.system.actions?.find((s) => s.slug === "carapace-strike" || s.label === "Carapace Strike");
        if (!target || !strike) {
            ui.notifications.warn("Frame Rush: target the creature first.");
            return null;
        }
        await strike.variants[0].roll({ target, options: ["frame-rush"], createMessage: true });
        const outcome = [...game.messages].reverse().find((m) => m.flags?.pf2e?.context?.type === "attack-roll")?.flags?.pf2e?.context?.outcome;
        if (outcome === "criticalSuccess") await strike.critical({ target, options: ["frame-rush"], createMessage: true });
        else if (outcome === "success") await strike.damage({ target, options: ["frame-rush"], createMessage: true });
        const buttons = Object.entries(MANOEUVRES).map(([slug, label]) =>
            `<button type="button" data-action="isaacs-hb-rush" data-value="${slug}">${label}</button>`).join("");
        return ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            flags: { [MODULE]: { [RUSH]: { origin: actor.uuid, target: target.document.uuid } } },
            content: `<p><strong>Frame Rush</strong>: and then — against ${target.name}, at the next multiple attack penalty.</p>${buttons}`,
        });
    },

    bindRush(message, html) {
        const card = message?.flags?.[MODULE]?.[RUSH];
        if (!card || !html?.querySelectorAll || html.dataset?.isaacsHbRushBound) return;
        html.dataset.isaacsHbRushBound = "1";
        const buttons = [...html.querySelectorAll(`[data-action="isaacs-hb-rush"]`)];
        for (const button of buttons) {
            if (card.used || !message.isOwner) button.disabled = true;
            button.addEventListener("click", async () => {
                for (const b of buttons) b.disabled = true;
                await Mutations.rushManoeuvre(message, button.dataset.value);
            });
        }
    },

    /** The manoeuvre, rolled by the owner through pf2e's own action — a Shove still gets its Push card. */
    async rushManoeuvre(message, slug) {
        const card = message.flags?.[MODULE]?.[RUSH];
        if (!card || card.used || !(slug in MANOEUVRES)) return null;
        await message.update({ [`flags.${MODULE}.${RUSH}.used`]: slug });
        const actor = await fromUuid(card.origin);
        const target = (await fromUuid(card.target))?.object;
        if (target && !target.isTargeted) target.setTarget(true, { user: game.user, releaseOthers: true });
        return game.pf2e.actions.get(slug).use({ actors: [actor], multipleAttackPenalty: 1 });
    },

    /**
     * Topaz Depth 4: *"When you critically hit, one other bound Substrate counts as Depth 4 for that Strike"* (#86).
     * The card lists the others; the pick is the GM's to apply, through the relay, and only once.
     */
    async topazCritical(message) {
        const context = message.flags?.pf2e?.context;
        const actor = message.actor;
        if (context?.type !== "attack-roll" || context.outcome !== "criticalSuccess" || depth(actor, "topaz") < 4) return null;
        if (actor.itemTypes.effect.some((e) => e.slug === "effect-carapace-broken")) return null;
        const catalogue = await Engine.catalogue();
        const others = Object.keys(Engine.state(actor).substrates).filter((slug) => slug !== "topaz");
        if (!others.length) return null;
        const buttons = others.map((slug) => `<button type="button" data-action="isaacs-hb-topaz" data-value="${slug}">`
            + `${catalogue[slug]?.name?.replace(/^Substrate:\s*/, "") ?? slug}</button>`).join("");
        return ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            flags: { [MODULE]: { [TOPAZ]: { origin: actor.uuid, madeBy: message.id, options: others } } },
            content: `<p><strong>Topaz</strong>: a critical hit — one other Substrate counts as <strong>Depth 4</strong> for this Strike.</p>${buttons}`,
        });
    },

    bindTopaz(message, html) {
        const card = message?.flags?.[MODULE]?.[TOPAZ];
        if (!card || !html?.querySelectorAll || html.dataset?.isaacsHbTopazBound) return;
        html.dataset.isaacsHbTopazBound = "1";
        const buttons = [...html.querySelectorAll(`[data-action="isaacs-hb-topaz"]`)];
        for (const button of buttons) {
            if (card.used || !message.isOwner) button.disabled = true;
            button.addEventListener("click", async () => {
                for (const b of buttons) b.disabled = true;
                await Relay.request({ action: TOPAZ, messageId: message.id, value: button.dataset.value });
            });
        }
    },

    async topazPick({ messageId, value }) {
        const message = game.messages.get(messageId);
        const card = message?.flags?.[MODULE]?.[TOPAZ];
        if (!card || card.used || !card.options?.includes(value)) return null;
        await message.update({ [`flags.${MODULE}.${TOPAZ}.used`]: value });
        const actor = await fromUuid(card.origin);
        const raised = await Engine.depthFour(actor, [value], { madeBy: card.madeBy, why: "topaz" });
        if (raised) await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }),
            content: `<p><strong>Topaz</strong>: ${raised.join(", ")} counts as <strong>Depth 4</strong> for this Strike.</p>` });
        return raised;
    },

    /** Returns false — cancelling the card — when this encounter's uses of the action are spent. */
    gateEncounterUse(data) {
        const uuid = data?.flags?.pf2e?.origin?.uuid;
        if (!uuid || data?.flags?.pf2e?.context) return undefined;
        const item = fromUuidSync(uuid);
        const rule = PER_ENCOUNTER[item?.slug];
        const actor = item?.actor;
        const combat = actor && encounterOf(actor);
        // Outside an encounter there is nothing to count against.
        if (!rule || !combat?.started) return undefined;
        const max = rule.max?.(actor) ?? 1;
        const ledger = actor.flags?.[MODULE]?.assimilator?.encounterUses?.[rule.key];
        const used = ledger?.combat === combat.id ? ledger.n : 0;
        if (used >= max) {
            ui.notifications.warn(`${item.name}: already used ${max === 1 ? "once" : `${max} times`} this encounter.`);
            return false;
        }
        actor.update({ [`flags.${MODULE}.assimilator.encounterUses.${rule.key}`]: { combat: combat.id, n: used + 1 } });
        return undefined;
    },

    registerHooks() {
        // The use card is the use: refusing to post it is refusing the action, before any rider can fire.
        Hooks.on("preCreateChatMessage", (message, data) => Mutations.gateEncounterUse(data));
        // Topaz Depth 4: a critical hit asks which other Substrate counts as Depth 4 for the Strike.
        Relay.register?.(TOPAZ, (payload) => Mutations.topazPick(payload));
        Hooks.on("createChatMessage", (message) => {
            if (isWriter()) Mutations.topazCritical(message).catch((e) => console.error("Isaac's Homebrew | Topaz", e));
        });
        // Lapis Depth 2 is asked for by the roller's own client: a bare skill roll records no target, and only that client
        // knows what its user had targeted.
        Hooks.on("createChatMessage", (message, _o, userId) => {
            if (userId === game.user.id) Mutations.lapisInsight(message).catch((e) => console.error("Isaac's Homebrew | Lapis", e));
        });
        Relay.register?.(LAPIS, (payload) => Mutations.grantInsight(payload));
        // Tin Depth 3: "Invisible creatures within 30 feet are concealed to you" — pf2e's see-invisibility, which pf2e
        // hands Foundry at an unlimited range. When Tin is where the sense came from, its range is Tin's 30 feet.
        wrap("CONFIG.Token.documentClass.prototype._prepareDetectionModes", function (wrapped, ...args) {
            const result = wrapped(...args);
            const sense = this.actor?.perception?.senses?.get?.("see-invisibility");
            if (sense?.source === "Substrate: Tin" && this.detectionModes?.seeInvisibility) {
                // Detection ranges are in the scene's distance units — feet, as pf2e's own senses are given.
                this.detectionModes.seeInvisibility.range = 30;
            }
            return result;
        }, { feature: "Tin's 30-foot see-invisibility", type: "WRAPPER" });
        Relay.register?.(BARE, (payload) => Mutations.markBare(payload));
        Hooks.on("renderChatMessageHTML", (message, html) => Mutations.bindTopaz(message, html));
        Hooks.on("renderChatMessageHTML", (message, html) => Mutations.bindRush(message, html));
        Hooks.on("preUpdateToken", (token, change) => {
            if ("x" in change || "y" in change) origins.set(token.id, { x: token._source.x, y: token._source.y });
        });
        Hooks.on("updateToken", (token, change, _options, userId) => {
            if (game.user.id !== userId || !("x" in change || "y" in change)) return;
            Mutations.onMove(token).catch((e) => console.error("Isaac's Homebrew | movement tracking failed", e));
        });
        const clear = (combatant) => {
            const actor = combatant?.actor;
            travelled.delete(combatant?.tokenId);
            if (isWriter() && actor?.flags?.pf2e?.rollOptions?.all?.[MOVED]) {
                actor.update({ [`flags.pf2e.rollOptions.all.-=${MOVED}`]: null });
            }
        };
        Hooks.on("pf2e.startTurn", clear);
        Hooks.on("pf2e.endTurn", clear);
        Hooks.on("combatStart", (combat) => {
            if (isWriter()) Mutations.ferrousBlood(combat).catch((e) => console.error("Isaac's Homebrew | Hematite failed", e));
        });

        // Using a Mutation action that needs the engine.
        Hooks.on("createChatMessage", (message, _options, userId) => {
            if (userId !== game.user.id) return;
            const slug = message.item?.slug;
            const actor = message.actor;
            if (!actor?.isOwner) return;
            if (slug === "shadow-step" && !message.flags?.pf2e?.context) Mutations.pickShadowStep(actor);
            if (slug === "lay-bare" && !message.flags?.pf2e?.context) Mutations.layBare(actor).catch((e) => console.error("Isaac's Homebrew | Lay Bare", e));
            if (slug === "frame-rush" && !message.flags?.pf2e?.context) Mutations.frameRush(actor).catch((e) => console.error("Isaac's Homebrew | Frame Rush", e));
            if (slug === "draw-on-the-reservoir") AssimilatorDamage.draw(actor);
            if (slug === "discharge") setTimeout(() => AssimilatorDamage.discharge(actor), 1500);
            if (slug === "shift-tissue") {
                actor.update({ [`flags.${MODULE}.assimilator.zincShift`]: true }).then(() => GulletApp.open(actor));
            }
            // A Strike's damage spends what rode on it.
            if (message.flags?.pf2e?.context?.type === "damage-roll") {
                const spent = actor.itemTypes.effect.filter((e) => ONE_STRIKE.includes(e.slug)).map((e) => e.id);
                if (spent.length) actor.deleteEmbeddedDocuments("Item", spent);
            }
            // Jade: the upgrade happened — spend it.
            const ctx = message.flags?.pf2e?.context;
            if (ctx?.type === "saving-throw" && ctx.domains?.includes("fortitude")
                && ctx.unadjustedOutcome === "success" && ctx.outcome === "criticalSuccess" && depth(actor, "jade") >= 3) {
                actor.update({ "flags.pf2e.rollOptions.all.self:jade-spent": true });
            }
        });
        // Jade Depth 4 is once per round: a new turn gives it back. Depth 3 waits for the night.
        Hooks.on("pf2e.startTurn", (combatant) => {
            const actor = combatant?.actor;
            if (isWriter() && depth(actor, "jade") >= 4 && actor.flags?.pf2e?.rollOptions?.all?.["self:jade-spent"]) {
                actor.update({ "flags.pf2e.rollOptions.all.-=self:jade-spent": null });
            }
        });
        Hooks.on("pf2e.restForTheNight", (actor) => {
            if (isWriter() && actor.flags?.pf2e?.rollOptions?.all?.["self:jade-spent"]) {
                actor.update({ "flags.pf2e.rollOptions.all.-=self:jade-spent": null });
            }
        });

        // Moonstone's Reactive Evolution: how many held, how many a fight, and how long.
        Hooks.on("createItem", (item) => {
            if (item.slug === "effect-reactive-evolution" && isWriter()) Mutations.reactive(item);
        });
        Hooks.on("deleteCombat", (combat) => {
            if (!isWriter()) return;
            for (const c of combat.combatants) {
                const held = c.actor?.itemTypes.effect.filter((e) => e.slug === "effect-reactive-evolution"
                    && e.flags?.[MODULE]?.assimilator?.untilEncounterEnds) ?? [];
                if (held.length) c.actor.deleteEmbeddedDocuments("Item", held.map((e) => e.id));
            }
        });

        // Onyx reads dim light or darkness; pf2e emits no lighting option, so the scene's darkness is written as one.
        Hooks.on("canvasReady", () => isWriter() && Mutations.lighting());
        Hooks.on("updateScene", (scene, change) => {
            if (isWriter() && scene.isView && change.environment) Mutations.lighting();
        });
    },

    /** `self:in-dim-light-or-darkness` on every Onyx-bearing creature in the viewed scene, from its darkness level. */
    async lighting() {
        const dark = (canvas.scene?.environment?.darknessLevel ?? 0) >= 0.5;
        for (const token of canvas.tokens?.placeables ?? []) {
            const actor = token.actor;
            if (!actor?.isOwner || !depth(actor, "onyx")) continue;
            const has = !!actor.flags?.pf2e?.rollOptions?.all?.[DARK];
            if (dark && !has) await actor.update({ [`flags.pf2e.rollOptions.all.${DARK}`]: true });
            if (!dark && has) await actor.update({ [`flags.pf2e.rollOptions.all.-=${DARK}`]: null });
        }
    },

    /** Enforce Reactive Evolution's limits on the effect just created. */
    async reactive(item) {
        const actor = item.actor;
        // Perfect Adaptation: Reactive Evolution at Depth 2 without Moonstone; with it, one Depth higher for this alone.
        const adapted = (actor?.itemTypes?.feat ?? []).some((f) => f.slug === "perfect-adaptation");
        const moon = depth(actor, "moonstone");
        const d = Math.min(adapted ? (moon ? moon + 1 : 2) : moon, 4);
        if (!d) return item.delete();
        const combat = encounterOf(actor);
        const key = combat?.id ?? "none";
        const uses = actor.flags?.[MODULE]?.assimilator?.moonstoneUses ?? {};
        const used = uses.encounter === key ? uses.count : 0;
        if (used >= MOONSTONE_USES[d]) {
            ui.notifications?.warn(`Reactive Evolution is spent for this encounter (${MOONSTONE_USES[d]}).`);
            return item.delete();
        }
        await actor.update({ [`flags.${MODULE}.assimilator.moonstoneUses`]: { encounter: key, count: used + 1 } });
        // Depth 3+: it lasts until the encounter ends rather than a minute.
        if (d >= 3) {
            await item.update({ "system.duration": { expiry: null, sustained: false, unit: "unlimited", value: -1 },
                [`flags.${MODULE}.assimilator.untilEncounterEnds`]: true });
        }
        const held = actor.itemTypes.effect.filter((e) => e.slug === "effect-reactive-evolution");
        const extra = held.length - MOONSTONE_HELD[d];
        if (extra > 0) await actor.deleteEmbeddedDocuments("Item", held.filter((e) => e.id !== item.id).slice(0, extra).map((e) => e.id));
    },

    /** Add a move to the mover's tally for this turn; mark it once it reaches 10 feet. */
    async onMove(token) {
        const from = origins.get(token.id);
        origins.delete(token.id);
        // The encounter whose current turn is this token's — not `game.combat`, which is only what the tracker
        // is showing.
        const combat = game.combats?.find((c) => c.started && c.combatant?.tokenId === token.id);
        if (!combat || !from) return;
        const size = canvas.grid.size;
        const offset = { x: (token.width * size) / 2, y: (token.height * size) / 2 };
        const distance = canvas.grid.measurePath([
            { x: from.x + offset.x, y: from.y + offset.y },
            { x: token._source.x + offset.x, y: token._source.y + offset.y },
        ]).distance;
        const key = turnKey(combat);
        const prior = travelled.get(token.id);
        const total = (prior?.key === key ? prior.total : 0) + distance;
        travelled.set(token.id, { key, total });
        const actor = token.actor;
        if (total >= 10 && actor?.isOwner && !actor.flags?.pf2e?.rollOptions?.all?.[MOVED]) {
            await actor.update({ [PATH]: true });
        }
        return total;
    },

    /** Hematite Depth 2. Returns the actors granted temporary Hit Points. */
    async ferrousBlood(combat) {
        const granted = [];
        for (const combatant of combat.combatants) {
            const actor = combatant.actor;
            if (depthOf(actor, "hematite") < 2) continue;
            const options = new Set(actor.getRollOptions());
            if (depthOf(actor, "hematite") >= 3 && !options.has("carapace:intact")) continue;
            if ((actor.attributes.hp.temp ?? 0) >= actor.level) continue;
            await actor.update({ "system.attributes.hp.temp": actor.level });
            granted.push(actor.name);
        }
        return granted;
    },
};

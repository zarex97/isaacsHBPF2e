/**
 * Mutations that happen on a clock or on movement rather than on a roll.
 *
 * - **Moved 10 feet this turn** (Carnelian Depth 2, Bronze Depth 2). pf2e knows where a token is, not how far
 *   it came, so the distance is summed from each move during the creature's own turn and written as the roll
 *   option `self:moved-10-feet-this-turn` — `self:`-prefixed so rolls against it see it too, and cleared when
 *   its next turn starts.
 * - **Hematite, Depth 2**: temporary Hit Points equal to your level at the start of each encounter.
 */

import { AssimilatorDamage, depthOf as depth } from "./damage.mjs";
import { Engine } from "./engine.mjs";
import { GulletApp } from "./gullet.mjs";
import { encounterOf } from "../lib/encounter-damage.mjs";

const MOVED = "self:moved-10-feet-this-turn";
const DARK = "self:in-dim-light-or-darkness";
const MODULE = "isaacs-hb-pf2e";
/** Effects that ride one Strike and are spent by its damage roll. */
const ONE_STRIKE = ["effect-reservoir-primed", "effect-conductive-charge-fire", "effect-conductive-charge-electricity",
    "effect-kinetic-surge"];
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
    const m = actor?.getRollOptions?.().map((o) => new RegExp(`^self:effect:substrate-${slug}:(\\d+)$`).exec(o)).find(Boolean);
    return m ? Number(m[1]) : 0;
}

export const Mutations = {
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

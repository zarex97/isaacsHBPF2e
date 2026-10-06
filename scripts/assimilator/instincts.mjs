import { DamageBus, encounterOf } from "../automation.mjs";
import { DAMAGE as PRIORITY } from "../stage-priorities.mjs";
import { shadowTarget } from "../riders/bypass.mjs";
import { Relay } from "../riders/relay.mjs";
import { MODULE_ID } from "../sky/signs.mjs";
import { AssimilatorDamage, depthOf, suppressed } from "./damage.mjs";
import { Engine, scaled } from "./engine.mjs";
import { classSlugOf } from "../lib/class-dc.mjs";

/**
 * The Instinct clauses that happen on an event rather than on a sheet (guide §5.1).
 *
 * The sheet half of each Instinct — Red's damage, Orange's Speed, Green's fast healing, Gray's Hardness, Blue's AC,
 * Purple's magical Strikes — is rules on the Instinct's effect, reading numbers the engine works out. This file is
 * the rest: what happens *when a Mutation deals damage*, *when you use one*, *when you move*.
 *
 * **"A Mutation" and "its Depth" are read off the roll.** A Carapace Strike's damage roll carries every die and
 * modifier that was considered, each with its slug, whether it was enabled and whether it was critical-only — and a
 * Substrate's damage rules are all slugged `substrate-<slug>`. So the Mutations *in this damage* are exactly the
 * Substrates with a part that fired, and their Depth is the badge. A Mutation's own action (the Gland, the
 * Discharge, the Flare) is the item that dealt the damage, and its Depth is the Substrate that granted it.
 */

const KEY = "assimilator";
const CARD = "assimilatorCard";
const SIPHON = {
    fortitude: "Fortitude", reflex: "Reflex", will: "Will", perception: "Perception", ac: "AC",
    attack: "attack rolls", "skill-check": "skill checks",
};

function isWriter() {
    return game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM;
}

function record(actor) {
    return actor?.flags?.[MODULE_ID]?.[KEY] ?? {};
}

/** The Instinct clauses in force on this creature: its Instinct, and Electrum's second colour from Depth 3. */
export function activeInstincts(actor) {
    const i = record(actor).derived?.instincts;
    return new Set([i?.primary, i?.secondary].filter(Boolean));
}

function scaleOf(actor) {
    return record(actor).derived?.iv?.scale ?? 1;
}

/** Which bound Substrates' Mutations are in a damage roll, keyed to their Depth. */
export function mutationsInRoll(roll, actor, outcome = null) {
    const parts = roll?.options?.damage?.damage;
    if (!parts) return {};
    const critical = outcome === "criticalSuccess" || roll.options?.degreeOfSuccess === 3;
    const bound = Object.keys(record(actor).derived?.effective ?? {}).sort((a, b) => b.length - a.length);
    const out = {};
    for (const part of [...(parts.dice ?? []), ...(parts.modifiers ?? [])]) {
        if (!part?.enabled) continue;
        if ((part.critical === true && !critical) || (part.critical === false && critical)) continue;
        const slug = String(part.slug ?? "");
        if (!slug.startsWith("substrate-")) continue;
        const rest = slug.slice("substrate-".length);
        const substrate = bound.find((s) => rest === s || rest.startsWith(`${s}-`));
        const depth = substrate ? depthOf(actor, substrate) : 0;
        if (depth > 0) out[substrate] = depth;
    }
    return out;
}

/** A Mutation's own action, and the Substrate whose Depth it is. */
export function mutationOfAction(item) {
    const actor = item?.actor;
    if (!actor || !item.system?.traits?.otherTags?.includes?.("assimilator-mutation-action")) return {};
    // The Gland is granted by its Aberration, and the Aberration by Nickel.
    if (item.slug === "aberrant-gland") return { nickel: depthOf(actor, "nickel") };
    const source = actor.items.get(item.flags?.pf2e?.grantedBy?.id ?? "");
    const substrate = source?.flags?.[MODULE_ID]?.[KEY]?.substrate?.slug;
    return substrate ? { [substrate]: depthOf(actor, substrate) } : {};
}

/** The Mutations in a piece of damage an Assimilator dealt. */
function mutationsIn(params, origin) {
    const fromRoll = mutationsInRoll(params?.damage, origin, params?.outcome);
    return Object.keys(fromRoll).length ? fromRoll : mutationOfAction(params?.item);
}

function deepest(mutations, actor = null) {
    // Instinctive Surge: until the end of the turn, the Instinct clause treats every Substrate as one Depth higher.
    const surge = actor?.itemTypes?.effect?.some((e) => e.slug === "effect-instinctive-surge") ? 1 : 0;
    const depth = Math.max(0, ...Object.values(mutations));
    return depth ? depth + surge : 0;
}

function tokenOf(actor) {
    return actor?.getActiveTokens?.(true, true)?.[0] ?? null;
}

/** Pearl Depth 2's "yourself or an adjacent ally"; Depth 3's "Range 30 feet" (#92). */
export function tideReach(actor) {
    return depthOf(actor, "pearl") >= 3 ? 30 : 5;
}

/** Why a Cleansing Tide cannot reach the creature on `token` — or null when it can, or when it is its own. */
export function tideRefusal(actor, token) {
    const from = tokenOf(actor)?.object;
    if (!token || !from || token.actor?.id === actor.id) return null;
    const reach = tideReach(actor);
    const distance = from.distanceTo(token);
    if (distance <= reach) return null;
    return `${token.name} is ${distance} feet away; it reaches ${reach === 5 ? "an adjacent ally" : `${reach} feet`}.`;
}

const AFFLICTION_TRAITS = ["poison", "disease", "curse"];

/**
 * A creature's afflictions and their stages: pf2e's affliction items where the system has them, and — as Digest reads
 * them — a poison, disease or curse effect whose counter badge is its stage.
 */
export function afflictionsOf(actor) {
    const items = (actor.itemTypes.affliction ?? []).map((a) => ({ item: a, stage: a.stage }));
    const effects = actor.itemTypes.effect.filter((e) => e.system.badge?.type === "counter"
        && (e.system.traits?.value ?? []).some((t) => AFFLICTION_TRAITS.includes(t)))
        .map((e) => ({ item: e, stage: e.system.badge.value ?? 1 }));
    return [...items, ...effects];
}

/** Pearl Depth 4: the spell effects of 4th rank or lower on a creature — not one already suppressed. */
function spellEffectsOf(actor) {
    return actor.itemTypes.effect.filter((e) => (e.system.fromSpell || e.slug?.startsWith("spell-effect-"))
        && (Number(e.system.level?.value) || 1) <= 4 && !e.flags?.[MODULE_ID]?.suppression);
}

async function say(actor, html, extra = {}) {
    return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<p>${html}</p>`, ...extra });
}

async function effectDoc(slug) {
    const docs = await game.packs.get(`${MODULE_ID}.assimilator-effects`)?.getDocuments();
    return docs?.find((d) => d.slug === slug) ?? null;
}

/** "Temporary Hit Points equal to…" — temporary Hit Points never add; the higher stands. */
async function giveTemp(actor, amount) {
    if (!(amount > 0) || (actor.attributes.hp.temp ?? 0) >= amount) return false;
    await actor.update({ "system.attributes.hp.temp": amount });
    return true;
}

/** A once-per-round allowance, stamped with the encounter and round it was spent in. */
function roundStamp(actor) {
    const combat = encounterOf(actor);
    return combat?.started ? `${combat.id}:${combat.round}` : null;
}

export const Instincts = {
    mutationsInRoll,
    mutationOfAction,

    registerHooks() {
        Relay.register?.("assimilatorCard", (payload) => Instincts.resolveCard(payload));
        Relay.register?.("assimilatorEndCondition", (payload) => Instincts.endCondition(payload));

        // Blue: a Studied creature's resistances, against the Assimilator's Mutations.
        DamageBus.before("the Blue Instinct's Study", PRIORITY.bypass + 2, (actor, params) => Instincts.studied(actor, params));
        DamageBus.after("the Instincts that answer damage", PRIORITY.riders + 4,
            (actor, params, before) => Instincts.dealt(actor, params, before));

        Hooks.on("createChatMessage", (message) => {
            if (!isWriter()) return;
            Instincts.onMessage(message).catch((e) => console.error("Isaac's Homebrew | Instincts", e));
        });
        // The owner's own client opens the condition picker.
        Hooks.on("createChatMessage", (message, _options, userId) => {
            if (userId !== game.user.id) return;
            Instincts.onOwnMessage(message).catch((e) => console.error("Isaac's Homebrew | Instincts", e));
        });
        // Orange: a Stride or Step is a token moving during an encounter.
        Hooks.on("updateToken", (token, change) => {
            if (!isWriter() || !("x" in change || "y" in change)) return;
            Instincts.surge(token.actor, "moved").catch((e) => console.error("Isaac's Homebrew | Orange", e));
        });
        // Blue: one creature at a time.
        Hooks.on("createItem", (item) => {
            if (isWriter() && item.slug === "effect-studied") Instincts.oneStudied(item);
        });
        Hooks.on("renderChatMessageHTML", (message, html) => Instincts.bindCard(message, html));
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  Damage dealt                                                                            */
    /* ---------------------------------------------------------------------------------------- */

    studied(actor, params) {
        const origin = params?.item?.actor;
        if (!origin || origin === actor || !activeInstincts(origin).has("blue")) return undefined;
        // pf2e reports an effect with no recorded origin as its own bearer's; that one is nobody's in particular.
        const studied = actor.itemTypes?.effect?.some((e) => e.slug === "effect-studied"
            && (!e.origin || e.origin.id === origin.id || e.origin.id === actor.id));
        if (!studied || !Object.keys(mutationsIn(params, origin)).length) return undefined;
        const reduction = record(origin).derived?.iv?.blueReduction ?? 0;
        return reduction > 0 ? shadowTarget(actor, { reduction }) : undefined;
    },

    async dealt(actor, params, before) {
        const originItem = params?.item;
        const origin = originItem?.actor ? game.actors.get(originItem.actor.id) ?? originItem.actor : null;
        if (!origin || origin.id === actor.id || !isWriter()) return;
        const instincts = activeInstincts(origin);
        if (!instincts.size) return;
        const target = params?.token?.actor ?? actor;
        const after = target.hitPoints?.value ?? before;
        if (!(after < before)) return;
        const mutations = mutationsIn(params, origin);
        const depth = deepest(mutations, origin);
        if (!depth) return;
        const scale = scaleOf(origin);

        // Green: "gain temporary Hit Points equal to its Depth."
        if (instincts.has("green") && await giveTemp(origin, scaled(depth, scale))) {
            await say(origin, `<strong>Green Instinct</strong>: ${origin.name} gains ${scaled(depth, scale)} temporary Hit Points.`);
        }
        // White: "one ally within 30 feet gains temporary Hit Points equal to its Depth."
        if (instincts.has("white")) await Instincts.offerWhite(origin, scaled(depth, scale));
        // Black: "−1 status penalty to one check or DC of your choice … and you gain +1 status to the same thing."
        if (instincts.has("black")) {
            const amount = scaled(depth >= 3 ? 2 : 1, scale);
            await Instincts.offerSiphon(origin, target, amount);
        }
    },

    async offerWhite(origin, amount) {
        const from = tokenOf(origin);
        if (!from || !(amount > 0)) return;
        const allies = canvas.tokens.placeables.filter((t) => t.actor && t.actor.id !== origin.id
            && t.actor.isAllyOf?.(origin) && canvas.grid.measurePath([from.center, t.center]).distance <= 30);
        if (!allies.length) return;
        if (allies.length === 1) {
            if (await giveTemp(allies[0].actor, amount)) {
                await say(origin, `<strong>White Instinct</strong>: ${allies[0].name} gains ${amount} temporary Hit Points.`);
            }
            return;
        }
        const buttons = allies.map((t) => `<button type="button" data-action="isaacs-hb-assim-card" data-value="${t.document.uuid}">`
            + `${t.name}</button>`).join("");
        await say(origin, `<strong>White Instinct</strong>: one ally within 30 feet gains ${amount} temporary Hit Points.</p>`
            + `<p>${buttons}`, { flags: { [MODULE_ID]: { [CARD]: { kind: "white", origin: origin.uuid, amount,
                options: allies.map((t) => t.document.uuid) } } } });
    },

    async offerSiphon(origin, target, amount) {
        const buttons = Object.entries(SIPHON).map(([value, label]) =>
            `<button type="button" data-action="isaacs-hb-assim-card" data-value="${value}">${label}</button>`).join("");
        await say(origin, `<strong>Black Instinct</strong>: ${target.name} takes a −${amount} status penalty to one check or `
            + `DC until the end of its next turn, and ${origin.name} gains +${amount} to the same.</p><p>${buttons}`,
        { flags: { [MODULE_ID]: { [CARD]: { kind: "siphon", origin: origin.uuid, target: target.uuid, amount,
            options: Object.keys(SIPHON) } } } });
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  The cards                                                                               */
    /* ---------------------------------------------------------------------------------------- */

    bindCard(message, html) {
        const card = message?.flags?.[MODULE_ID]?.[CARD];
        if (!card || !html?.querySelectorAll || html.dataset?.isaacsHbAssimBound) return;
        html.dataset.isaacsHbAssimBound = "1";
        const origin = fromUuidSync(card.origin);
        const buttons = [...html.querySelectorAll(`[data-action="isaacs-hb-assim-card"]`)];
        for (const button of buttons) {
            if (message.flags[MODULE_ID][CARD].used || !(origin?.isOwner)) button.disabled = true;
            button.addEventListener("click", async () => {
                for (const b of buttons) b.disabled = true;
                await Relay.request({ action: CARD, messageId: message.id, value: button.dataset.value });
            });
        }
    },

    /** The GM applies what the card offered — only what it offered, and only once. */
    async resolveCard({ messageId, value }) {
        const message = game.messages.get(messageId);
        const card = message?.flags?.[MODULE_ID]?.[CARD];
        if (!card || card.used || !card.options?.includes(value)) return;
        await message.update({ [`flags.${MODULE_ID}.${CARD}.used`]: value });
        const origin = await fromUuid(card.origin);
        if (card.kind === "white") {
            const ally = (await fromUuid(value))?.actor;
            if (ally && await giveTemp(ally, card.amount)) {
                await say(origin, `<strong>White Instinct</strong>: ${ally.name} gains ${card.amount} temporary Hit Points.`);
            }
            return;
        }
        // Moonstone Depth 1's offer (#93): the type picked, adapted to — Reactive Evolution's own limits then apply.
        if (card.kind === "moonstone") {
            const doc = await effectDoc("effect-reactive-evolution");
            if (!doc || !origin) return;
            const source = foundry.utils.deepClone(doc.toObject());
            const choice = source.system.rules.find((r) => r.key === "ChoiceSet");
            if (choice) choice.selection = value;
            await origin.createEmbeddedDocuments("Item", [source]);
            await say(origin, `<strong>Reactive Evolution</strong>: ${origin.name} adapts to ${value}.`);
            return;
        }
        if (card.kind === "siphon") {
            const target = await fromUuid(card.target);
            const victim = target?.actor ?? target;
            await Instincts.siphon(victim, "effect-siphoned", value, -card.amount);
            await Instincts.siphon(origin, "effect-siphoning", value, card.amount);
            await say(origin, `<strong>Black Instinct</strong>: ${SIPHON[value]} — ${victim?.name} −${card.amount}, `
                + `${origin.name} +${card.amount}.`);
        }
    },

    async siphon(actor, slug, selector, amount) {
        const doc = await effectDoc(slug);
        if (!doc || !actor) return;
        const source = foundry.utils.deepClone(doc.toObject());
        foundry.utils.setProperty(source, "flags.pf2e.rulesSelections", { siphon: selector, amount });
        source.name = `${source.name} (${SIPHON[selector]})`;
        const old = actor.itemTypes.effect.filter((e) => e.slug === slug).map((e) => e.id);
        if (old.length) await actor.deleteEmbeddedDocuments("Item", old);
        await actor.createEmbeddedDocuments("Item", [source]);
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  Using a Mutation, moving, reacting, critical hits                                       */
    /* ---------------------------------------------------------------------------------------- */

    async onMessage(message) {
        const actor = message.actor;
        if (!actor || classSlugOf(actor) !== "assimilator") return;
        const instincts = activeInstincts(actor);
        if (!instincts.size) return;
        const context = message.flags?.pf2e?.context;
        const item = message.item;

        // Gray: "When you use a Mutation, gain resistance equal to its Depth to all physical damage until the start
        // of your next turn." A Mutation's action, or a Strike whose damage carried one.
        if (instincts.has("gray")) {
            const used = context?.type === "damage-roll"
                ? mutationsInRoll(message.rolls?.[0], actor, context.outcome)
                : (!context ? mutationOfAction(item) : {});
            const depth = deepest(used, actor);
            if (depth) await Instincts.plate(actor, scaled(depth, scaleOf(actor)));
        }
        // Orange: a reaction is a use of the round's first surge too.
        if (instincts.has("orange") && !context && item?.system?.actionType?.value === "reaction") {
            await Instincts.surge(actor, "reacted");
        }
        // Gold: on a critical hit, the chosen Substrate's Depth 4 row may apply.
        if (instincts.has("gold") && context?.type === "attack-roll" && context.outcome === "criticalSuccess") {
            await Instincts.goldenCritical(actor, message);
        }
    },

    async plate(actor, depth) {
        const current = actor.itemTypes.effect.find((e) => e.slug === "effect-integrated-plating");
        if (current && (current.system.badge?.value ?? 0) >= depth) return;
        if (current) await current.delete();
        const doc = await effectDoc("effect-integrated-plating");
        if (!doc) return;
        const source = foundry.utils.deepClone(doc.toObject());
        source.system.badge = { type: "counter", value: depth };
        await actor.createEmbeddedDocuments("Item", [source]);
    },

    /** Orange: the first Stride, Step or reaction each round primes the next Mutation with +1d4. */
    async surge(actor, why) {
        if (!actor || classSlugOf(actor) !== "assimilator" || !activeInstincts(actor).has("orange")) return;
        const stamp = roundStamp(actor);
        if (!stamp || record(actor).used?.orangeSurge === stamp) return;
        await actor.update({ [`flags.${MODULE_ID}.${KEY}.used.orangeSurge`]: stamp });
        await AssimilatorDamage.mark(actor, "effect-kinetic-surge");
        await say(actor, `<strong>Orange Instinct</strong>: ${actor.name} ${why}; the next Mutation this round deals +1d4.`);
    },

    /** Gold: "When you critically hit, that Substrate counts as Depth 4 for that Strike" (#86). */
    async goldenCritical(actor, message) {
        // "Does not stack with Gold's Instinct clause — take the better": Apex Predator raises every Mutation on the Strike.
        if ((actor.itemTypes?.feat ?? []).some((f) => f.slug === "apex-predator")) return;
        const pick = record(actor).choices?.goldInstinct;
        if (!pick) return;
        const raised = await Engine.depthFour(actor, [pick], { madeBy: message?.id ?? null, why: "gold" });
        if (raised) await say(actor, `<strong>Gold Instinct</strong>: a critical hit — ${raised.join(", ")} counts as `
            + "<strong>Depth 4</strong> for this Strike.");
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  Blue: one creature at a time                                                            */
    /* ---------------------------------------------------------------------------------------- */

    async oneStudied(item) {
        const origin = item.origin;
        if (!origin) return;
        for (const token of canvas.tokens.placeables) {
            const actor = token.actor;
            if (!actor || actor === item.actor) continue;
            const stale = actor.itemTypes.effect.filter((e) => e.slug === "effect-studied" && e.origin?.id === origin.id);
            if (stale.length) await actor.deleteEmbeddedDocuments("Item", stale.map((e) => e.id));
        }
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  Ending a condition: White's Purify, Pearl's Cleansing Tide                              */
    /* ---------------------------------------------------------------------------------------- */

    async onOwnMessage(message) {
        const item = message.item;
        if (!item || message.flags?.pf2e?.context) return;
        if (item.slug !== "purify" && item.slug !== "cleansing-tide") return;
        // White's Purify is the Instinct's and Pearl's Cleansing Tide a Mutation's: neither answers a suppressed symbiont.
        if (suppressed(item.actor)) {
            ui.notifications.warn(`${item.name}: the symbiont is suppressed while other armour is worn.`);
            return;
        }
        const onlyValueOne = item.slug === "cleansing-tide";
        const target = [...game.user.targets][0]?.actor ?? item.actor;
        await Instincts.pickCondition(item, target, onlyValueOne);
    },

    /**
     * What a use may end, offered as buttons; the GM carries out the one picked. Cleansing Tide offers more as Pearl
     * deepens (#92): at Depth 3 an affliction's stage, lowered by 1; at Depth 4 a spell effect of 4th rank or lower,
     * counteracted.
     */
    async pickCondition(item, target, onlyValueOne) {
        const conditions = target.itemTypes.condition.filter((c) => c.active !== false
            && (!onlyValueOne || c.value === 1));
        const pearl = item.slug === "cleansing-tide" ? depthOf(item.actor, "pearl") : 0;
        const afflictions = pearl >= 3 ? afflictionsOf(target) : [];
        const spells = pearl >= 4 ? spellEffectsOf(target) : [];
        if (!conditions.length && !afflictions.length && !spells.length) {
            ui.notifications.info(`${target.name} has nothing ${item.name} can end.`);
            return null;
        }
        const offers = [
            ...conditions.map((c) => ({ action: `condition:${c.id}`, label: c.name })),
            ...afflictions.map((a) => ({ action: `affliction:${a.item.id}`, label: `${a.item.name} (stage ${a.stage})` })),
            ...spells.map((e) => ({ action: `effect:${e.id}`, label: `Counteract ${e.name} (rank ${Number(e.system.level?.value) || 1})` })),
        ];
        const asks = [conditions.length ? "End one condition" : null, afflictions.length ? "lower an affliction's stage by 1" : null,
            spells.length ? "counteract a spell effect" : null].filter(Boolean).join(", or ");
        const { DialogV2 } = foundry.applications.api;
        const picked = await DialogV2.wait({
            window: { title: `${item.name} — ${target.name}` },
            content: `<p>${asks} on ${target.name}.</p>`,
            buttons: offers,
            rejectClose: false,
        });
        if (!picked) return null;
        const [kind, id] = picked.split(":");
        await Relay.request({ action: "assimilatorEndCondition", actorUuid: target.uuid, kind, id,
            itemUuid: item.uuid, onlyValueOne });
        return id;
    },

    async endCondition({ actorUuid, kind = "condition", id, itemUuid, onlyValueOne }) {
        const target = await fromUuid(actorUuid);
        const item = await fromUuid(itemUuid);
        const picked = target?.items?.get(id);
        if (!picked || !item) return;
        const pearl = item.slug === "cleansing-tide" ? depthOf(item.actor, "pearl") : 0;
        // The GM holds the same line the picker drew: a player's request names a thing, never what may be done to it.
        if (pearl && tideRefusal(item.actor, tokenOf(target)?.object)) return;

        if (kind === "affliction") {
            if (pearl < 3 || !afflictionsOf(target).some((a) => a.item.id === id)) return;
            const stage = picked.type === "affliction" ? picked.stage - 1 : (picked.system.badge?.value ?? 1) - 1;
            if (picked.type === "affliction") await picked.decrease();
            else if (stage < 1) await picked.delete();
            else await picked.update({ "system.badge.value": stage });
            await say(item.actor, `<strong>${item.name}</strong>: ${target.name}'s ${picked.name} ${stage < 1 ? "is gone" : `eases to stage ${stage}`}.`);
            return;
        }
        if (kind === "effect") {
            if (pearl < 4 || !spellEffectsOf(target).some((e) => e.id === id)) return;
            const { resolveCounteract } = await import("../riders/apply.mjs");
            await resolveCounteract({ originUuid: item.actor.uuid, effectUuid: picked.uuid, itemUuid: item.uuid });
            return;
        }
        if (picked.type !== "condition") return;
        if (onlyValueOne && picked.value !== 1) return;
        const name = picked.name;
        await target.decreaseCondition(picked.slug, { forceRemove: true });
        await say(item.actor, `<strong>${item.name}</strong>: ${target.name} is no longer ${name}.`);
    },
};

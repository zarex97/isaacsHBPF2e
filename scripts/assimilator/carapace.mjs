import { DamageBus, PRIORITY } from "../lib/damage-bus.mjs";
import { MODULE_ID } from "../sky/signs.mjs";

/**
 * The Carapace: the Assimilator's plate, as an object that blocks, breaks and is repaired.
 *
 * **The plate is the Living Plate armour item.** The automation programme (§3.2) planned a shield, and pf2e
 * refuses it: `ShieldPF2e#prepareBaseData` forces every shield's usage to `held-in-one-hand`, so the plate
 * would occupy a hand on a class whose whole weapon is its hands. Armour already has everything the plate
 * needs — Hardness, Hit Points, a Broken Threshold pf2e derives as half of them, the Repair activity, and a
 * rune track — so the plate and the armour are one item, which is also what the guide describes.
 *
 * **Carapace Block is not Shield Block.** Guide §4.3: *"reduce the damage by your Carapace's Hardness. The
 * Carapace takes that much damage."* The Carapace takes what it **blocked**, and §11.4 says it again — *"the
 * Carapace takes the damage it blocks"*. pf2e's Shield Block does the opposite: the shield takes whatever gets
 * *past* its Hardness, so a high-Hardness plate would almost never break and the class's one failure state
 * would never happen. So the block is taken here, on the damage bus.
 *
 * The number it needs is the damage **after** IWR, which pf2e computes inside `applyDamage` and never
 * exposes. The one place it passes through a method that can be reached is `calculateHealthDelta({ delta })`,
 * called once with exactly that figure. For one application, and only when a block is armed, that method is
 * shadowed on the actor — the same shadow-and-restore `riders/bypass.mjs` uses for Hardness — and the plate's
 * Hardness comes off the delta there.
 */

const PLATE = "living-plate";
const ARMED = "effect-carapace-block";
const BROKEN = "effect-carapace-broken";
const EFFECTS = "isaacs-hb-pf2e.assimilator-effects";
/** Guide §4.3: the trigger is *physical* damage. */
const PHYSICAL = new Set(["bludgeoning", "piercing", "slashing"]);

/** The plate's maximum before a level change, read in `preUpdateActor`. */
const grownFrom = new WeakMap();

/** What an armed block absorbed during the application in flight, keyed by the actor pf2e was called on. */
const pending = new WeakMap();

/** How much of `delta` the plate takes: its Hardness, never more than the damage, nothing once it is destroyed. */
export function blockAmount(delta, hardness, plateHP) {
    if (!(delta > 0) || !(plateHP > 0)) return 0;
    return Math.max(0, Math.min(hardness, delta));
}

export function livingPlate(actor) {
    return actor?.itemTypes?.armor?.find((a) => a.slug === PLATE) ?? null;
}

function physical(damage) {
    if (!damage || typeof damage === "number") return false;
    return (damage.instances ?? []).some((i) => PHYSICAL.has(i.type));
}

/** `applyDamage` may run on a token's contextual clone; its items are copies that cannot be updated. */
function liveActor(actor, params) {
    const passed = params?.token?.document ?? params?.token ?? null;
    return passed?.actor ?? actor.token?.actor ?? (actor.id ? game.actors?.get(actor.id) : null) ?? actor;
}

/** One writer: the first active GM, so a table with two GMs does not grant the broken effect twice. */
function isWriter() {
    return game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM;
}

async function effectFromPack(slug) {
    const pack = game.packs.get(EFFECTS);
    const docs = await pack?.getDocuments();
    return docs?.find((d) => d.slug === slug) ?? null;
}

export const Carapace = {
    registerHooks() {
        DamageBus.before("Carapace Block", PRIORITY.carapaceBlock, (actor, params) => Carapace.armBlock(actor, params));
        DamageBus.after("the Carapace takes the blow", PRIORITY.carapaceBlock, (actor, params) =>
            Carapace.takeBlow(actor, params));

        Hooks.on("createItem", (item) => {
            if (item.slug === PLATE && isWriter()) Carapace.fillPlate(item.actor);
        });
        Hooks.on("updateItem", (item, change) => {
            if (item.slug === PLATE && change?.system?.hp && isWriter()) Carapace.syncBroken(item.actor);
        });
        // The plate's maximum is 10 + 5 per level. A level gained grows the plate by the difference; it does not
        // repair it. `preUpdateActor` is the last moment the old maximum can be read.
        Hooks.on("preUpdateActor", (actor, change) => {
            if (change?.system?.details?.level) grownFrom.set(actor, livingPlate(actor)?.hitPoints.max ?? null);
        });
        Hooks.on("updateActor", (actor, change) => {
            if (!change?.system?.details?.level || !grownFrom.has(actor)) return;
            const previous = grownFrom.get(actor);
            grownFrom.delete(actor);
            if (isWriter()) Carapace.growPlate(actor, previous);
        });
        // "The symbiont is your armour and cannot be removed." Wearing other armour over it is allowed — that is
        // the guide's own "attempting it", which suppresses Living Plate — but stowing or dropping it is not.
        Hooks.on("preUpdateItem", (item, change) => {
            if (item.slug !== PLATE) return true;
            const carry = change?.system?.equipped?.carryType;
            if (carry && carry !== "worn") {
                ui.notifications?.warn(`${item.name} is alive and part of you; it cannot be taken off.`);
                return false;
            }
            return true;
        });
    },

    /** Before-stage: when a block is armed and the damage is physical, take the plate's Hardness off the delta. */
    armBlock(actor, params) {
        if (!physical(params?.damage)) return undefined;
        const armed = actor.itemTypes?.effect?.find((e) => e.slug === ARMED);
        const plate = livingPlate(actor);
        if (!armed || !plate) return undefined;

        const shadowed = Object.prototype.hasOwnProperty.call(actor, "calculateHealthDelta");
        const original = actor.calculateHealthDelta;
        const state = { absorbed: 0, plateId: plate.id, armedId: armed.id };
        pending.set(actor, state);
        actor.calculateHealthDelta = function (args) {
            const absorbed = blockAmount(args.delta, plate.hardness, plate.hitPoints.value);
            state.absorbed = absorbed;
            return original.call(this, { ...args, delta: args.delta - absorbed });
        };
        return () => {
            if (shadowed) actor.calculateHealthDelta = original;
            else delete actor.calculateHealthDelta;
        };
    },

    /** After-stage: the plate takes what it blocked, and the block is spent. */
    async takeBlow(actor, params) {
        const state = pending.get(actor);
        if (!state) return;
        pending.delete(actor);

        const live = liveActor(actor, params);
        const plate = live.items.get(state.plateId);
        const armed = live.items.get(state.armedId);
        if (armed) await armed.delete();
        if (!plate || state.absorbed <= 0) return;

        const before = plate.hitPoints.value;
        const after = Math.max(0, before - state.absorbed);
        await plate.update({ "system.hp.value": after });
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: live }),
            flags: { [MODULE_ID]: { carapaceBlock: { absorbed: state.absorbed, before, after } } },
            content:
                `<p><strong>Carapace Block</strong>: the plate turns <strong>${state.absorbed}</strong> damage and takes it. `
                + `Carapace ${after}/${plate.hitPoints.max}${plate.isBroken ? " &mdash; <strong>broken</strong>" : ""}.</p>`,
        });
    },

    /** Put the broken effect on or take it off, to match the plate's Hit Points against its Broken Threshold. */
    async syncBroken(actor) {
        const plate = livingPlate(actor);
        if (!actor || !plate) return;
        const current = actor.itemTypes.effect.filter((e) => e.slug === BROKEN);
        if (plate.isBroken && current.length === 0) {
            const effect = await effectFromPack(BROKEN);
            if (effect) await actor.createEmbeddedDocuments("Item", [foundry.utils.deepClone(effect.toObject())]);
        } else if (!plate.isBroken && current.length > 0) {
            await actor.deleteEmbeddedDocuments("Item", current.map((e) => e.id));
        }
    },

    /** Keep the plate's damage where it was when its maximum moves with a level. */
    async growPlate(actor, previousMax) {
        const plate = livingPlate(actor);
        if (!plate || previousMax === null) return;
        const grown = plate.hitPoints.max - previousMax;
        if (grown === 0) return;
        const value = Math.max(0, Math.min(plate.hitPoints.max, plate._source.system.hp.value + grown));
        await plate.update({ "system.hp.value": value });
    },

    /** Bring a newly grown plate to its maximum. */
    async fillPlate(actor) {
        const plate = livingPlate(actor);
        if (!plate) return;
        const max = plate.hitPoints.max;
        if (plate._source.system.hp.value !== max) await plate.update({ "system.hp.value": max });
    },
};

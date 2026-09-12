import { Reiatsu } from "./reiatsu.mjs";

const MODULE_ID = "isaacs-hb-pf2e";
const EFFECTS_PACK = `${MODULE_ID}.soulbound-effects`;

/**
 * A mode switch: one of N named states, exactly one at a time.
 *
 * Three abilities want this and want it identically — Senbonzakura Kageyoshi's Gokei and Senkei, Zanka
 * no Tachi's four cardinal aspects, and (in a later phase) Burner Finger's five fingers. Each is
 * "Sustain to change which one you are in", and the only thing that differs between them is the list.
 *
 * Modelled on `blut.mjs`, which is the same shape with two options and a free action instead of a
 * Sustain. The difference worth keeping is that a family here is open-ended: a Spirit declares its own
 * modes in content, and this file never learns their names.
 */

/**
 * Which mode you end up in.
 *
 * Pure, because "you are in exactly one of these" is the entire contract and it is the kind of thing that
 * goes wrong quietly — two aspects of Zanka no Tachi standing at once is a resistance and an immunity the
 * character should not have, and nothing on the sheet would say so.
 *
 * @param {object} state
 * @param {string|null} state.current    the mode standing now
 * @param {string} state.wanted          the mode being switched to
 * @param {string[]} state.available     the modes this family offers
 * @returns {string|null}
 */
export function nextMode({ current, wanted, available }) {
    if (!available.includes(wanted)) return current;
    return wanted;
}

/** The effect a mode wears: "Effect: <mode>". Families keep their names distinct. */
function effectNameFor(mode) {
    return `Effect: ${mode}`;
}

export const Modes = {
    /** Which of this family's modes is standing, or null. */
    active(actor, available) {
        const names = available.map(effectNameFor);
        const held = actor?.itemTypes?.effect?.find((e) => names.includes(e.name));
        return held ? available[names.indexOf(held.name)] : null;
    },

    /**
     * Switch to one mode, removing whichever sibling was standing.
     *
     * The removal comes first and unconditionally: a failed grant that left the old mode in place would
     * be a silent no-op, and a grant that succeeded beside the old one would be two modes at once. Both
     * are worse than ending up with none, which is at least visible.
     */
    async set(actor, mode, available) {
        if (!Reiatsu.isSoulbound(actor)) return null;
        if (nextMode({ current: this.active(actor, available), wanted: mode, available }) !== mode) {
            return null;
        }

        const names = available.map(effectNameFor);
        const held = actor.itemTypes.effect.filter((e) => names.includes(e.name));
        if (held.length > 0) {
            await actor.deleteEmbeddedDocuments("Item", held.map((e) => e.id));
        }

        const pack = game.packs.get(EFFECTS_PACK);
        const wanted = effectNameFor(mode);
        const entry = pack ? (await pack.getIndex()).find((e) => e.name === wanted) : null;
        if (!entry) {
            console.warn(`Isaac's Homebrew | ${EFFECTS_PACK} has no "${wanted}"`);
            return null;
        }
        const doc = await pack.getDocument(entry._id);
        await actor.createEmbeddedDocuments("Item", [foundry.utils.deepClone(doc.toObject())]);
        return mode;
    },

    /** Modes end with the encounter, like every other per-round state in this class. */
    async clear(actor, available) {
        const names = available.map(effectNameFor);
        const held = actor.itemTypes.effect.filter((e) => names.includes(e.name));
        if (held.length > 0) await actor.deleteEmbeddedDocuments("Item", held.map((e) => e.id));
    },
};

import { shapeFromArea } from "../targeting/place.mjs";
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
        // The sibling's shape goes with the sibling. Switching Senkei to Gokei must not leave the cage
        // standing on a board where nobody is caged any more.
        await Modes.clearAreas(actor);

        const pack = game.packs.get(EFFECTS_PACK);
        const wanted = effectNameFor(mode);
        const entry = pack ? (await pack.getIndex()).find((e) => e.name === wanted) : null;
        if (!entry) {
            console.warn(`Isaac's Homebrew | ${EFFECTS_PACK} has no "${wanted}"`);
            return null;
        }
        const doc = await pack.getDocument(entry._id);
        await actor.createEmbeddedDocuments("Item", [foundry.utils.deepClone(doc.toObject())]);
        await Modes.raiseArea(actor, doc.toObject());
        return mode;
    },

    /**
     * The shape a mode stands inside, when it has one.
     *
     * *Senkei* is the case: "the blades condense into a thousand swords forming a **20-foot cage** around
     * you and one enemy". That cage is a printed sentence with a number in it, and until now it existed
     * only as prose in the effect's description — nothing on the board said where it was, so the one thing
     * the players needed to see, they could not.
     *
     * A mode declares `area` in its own module flags and gets a Region centred on its bearer. The Region
     * carries no behavior: pf2e cannot stop a creature leaving, and the turn-start prompt already says so.
     * What it does is draw the boundary, which is the half a table actually argues about.
     */
    async raiseArea(actor, source) {
        const area = source?.flags?.[MODULE_ID]?.area;
        const token = actor?.getActiveTokens?.(true, false)?.at(0);
        if (!area?.value || !token || !canvas?.ready) return null;
        if (canvas.scene?.id !== token.document?.parent?.id) return null;

        const shape = shapeFromArea(area, token, token.center);
        if (!shape) return null;

        const [created] = await canvas.scene.createEmbeddedDocuments("Region", [{
            name: `${source.name} — ${area.value}-foot cage`,
            shapes: [shape],
            color: "#c94f7c",
            visibility: CONST.REGION_VISIBILITY.ALWAYS,
            behaviors: [],
            flags: { [MODULE_ID]: { modeArea: { actor: actor.uuid, mode: source.name } } },
        }]);
        return created ?? null;
    },

    /**
     * Keep the caster's targets inside the cage.
     *
     * > **Senkei** — enemies outside the cage cannot be targeted by you.
     *
     * pf2e never asks whether a target is legal; Foundry lets any user target any token. So the rule is
     * held at the moment the pick is made: a target outside the Region the mode raised is dropped again,
     * and the player is told why rather than left wondering what un-clicked their click.
     *
     * Only the caster is governed. Everyone else may target whoever they like, cage or no cage — the
     * clause is about what *you* can reach, and an ally shooting into it was never forbidden.
     */
    registerTargetGuard() {
        Hooks.on("targetToken", (user, token, targeted) => {
            if (!targeted || user !== game.user) return;
            try {
                const actor = token?.document?.parent === canvas.scene
                    ? canvas.tokens?.controlled?.[0]?.actor
                    : null;
                if (!actor) return;
                const cage = canvas.scene?.regions?.find(
                    (r) => r.flags?.[MODULE_ID]?.modeArea?.actor === actor.uuid,
                );
                if (!cage) return;
                if (token.actor?.uuid === actor.uuid) return;   // yourself is always reachable
                /**
                 * `testPoint` takes **one** argument.
                 *
                 * Its signature is `testPoint({x, y, elevation})`, and an elevation passed as a second
                 * argument is not ignored — it is missing, so the region's own elevation test reads
                 * `undefined` and answers false. Called that way the cage encloses nothing, refuses every
                 * target on the board, and looks from the outside exactly like a guard that works.
                 *
                 * So the cage is asked to contain its own bearer before a "no" from it is trusted. A rule
                 * that cannot be checked is a note; a rule that refuses everyone is a bug.
                 */
                const inside = (t) =>
                    cage.testPoint({ x: t.center.x, y: t.center.y, elevation: t.document.elevation ?? 0 });
                const here = canvas.tokens.controlled.find((t) => t.actor?.uuid === actor.uuid);
                if (typeof cage.testPoint !== "function") return;
                if (here && !inside(here)) return;
                if (inside(token)) return;
                token.setTarget(false, { user, releaseOthers: false });
                ui.notifications.warn(
                    `${token.name} is outside ${cage.name} — Senkei leaves you nothing else to reach.`,
                );
            } catch (error) {
                console.error("Isaac's Homebrew | the cage could not hold a target", error);
            }
        });
    },

    /** Take the shape back down with the mode that raised it. */
    async clearAreas(actor) {
        if (!canvas?.scene) return;
        const mine = canvas.scene.regions.filter(
            (r) => r.flags?.[MODULE_ID]?.modeArea?.actor === actor?.uuid,
        );
        if (mine.length > 0) {
            await canvas.scene.deleteEmbeddedDocuments("Region", mine.map((r) => r.id));
        }
    },

    /** Modes end with the encounter, like every other per-round state in this class. */
    async clear(actor, available) {
        const names = available.map(effectNameFor);
        const held = actor.itemTypes.effect.filter((e) => names.includes(e.name));
        if (held.length > 0) await actor.deleteEmbeddedDocuments("Item", held.map((e) => e.id));
        await Modes.clearAreas(actor);
    },
};

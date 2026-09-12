import { Reiatsu } from "./reiatsu.mjs";

const MODULE_ID = "isaacs-hb-pf2e";
const EFFECTS_PACK = `${MODULE_ID}.soulbound-effects`;
const SEVERANCE = "Effect: Severance";
const SPENT = "Effect: Severed";

/**
 * Severance, and the Waning table.
 *
 * The 20th-level capstone. Ten rounds of enormous general power containing exactly one irreversible
 * attack, which ends the state when used — and which is worth less the longer you wait.
 *
 * > **The tension is the point.** The longer you survive in Severance, the more the general state has
 * > given you, and the less your ending is worth. Round one is 70 damage and none of the buff. Round
 * > seven is 28 damage and six rounds of a 4d6 rider, doubled Flash Step, and free kidō. There is no
 * > dominant line, which is what makes it a decision instead of a script.
 */

/**
 * Dice for a Severing Art used in a given round of Severance (guide §9).
 *
 * `22 − 2 × round`, rounds 1 through 7. After the seventh the Art has decayed past the point of being
 * worth the action, and the rules say so rather than letting you throw away your one shot for 6d6 — so
 * this returns **0**, and the Art refuses rather than rolling something.
 *
 * Kept pure and exported because the decay IS the balance lever. Guide §9.0.1 says so outright: if
 * playtesting shows everyone fires on round one, the fix is to flatten this table, not to cut the
 * ceiling. A number that lives in one function can be flattened; one scattered across fifteen documents
 * cannot.
 *
 * @param {number} round the round of Severance, counting from 1
 * @returns {number} dice, or 0 when the Art can no longer be used
 */
export function waningDice(round) {
    if (!Number.isInteger(round) || round < 1 || round > 7) return 0;
    return 22 - 2 * round;
}

/** How many rounds of Severance have elapsed, counting the round it began as the first. */
export function roundOfSeverance({ began, now }) {
    if (!Number.isInteger(began) || !Number.isInteger(now)) return 0;
    return Math.max(1, now - began + 1);
}

async function packed(name) {
    const pack = game.packs.get(EFFECTS_PACK);
    const entry = pack ? (await pack.getIndex()).find((e) => e.name === name) : null;
    if (!entry) {
        console.warn(`Isaac's Homebrew | ${EFFECTS_PACK} has no "${name}"`);
        return null;
    }
    return pack.getDocument(entry._id);
}

export const Severance = {
    effectOn(actor) {
        return actor?.itemTypes?.effect?.find((e) => e.name === SEVERANCE) ?? null;
    },

    /** Which round of Severance this actor is in, or 0 if they are not in one. */
    round(actor) {
        const effect = this.effectOn(actor);
        if (!effect) return 0;
        const began = effect.getFlag(MODULE_ID, "severanceBegan");
        return roundOfSeverance({ began, now: game.combat?.round ?? began });
    },

    /** The dice a Severing Art would roll right now. 0 means it refuses. */
    dice(actor) {
        return waningDice(this.round(actor));
    },

    async begin(actor) {
        if (!Reiatsu.isSoulbound(actor)) return null;
        const doc = await packed(SEVERANCE);
        if (!doc) return null;
        const [made] = await actor.createEmbeddedDocuments("Item", [foundry.utils.deepClone(doc.toObject())]);
        await made?.setFlag(MODULE_ID, "severanceBegan", game.combat?.round ?? 1);
        return made;
    },

    /**
     * End Severance, and take what it costs.
     *
     * Both routes end here — the Art being used, and the clock running out at the end of the tenth
     * round — because the price is the same either way and putting it in one place is what stops one
     * route quietly forgetting it.
     */
    async end(actor) {
        const held = actor.itemTypes.effect.filter((e) => e.name === SEVERANCE);
        if (held.length > 0) await actor.deleteEmbeddedDocuments("Item", held.map((e) => e.id));

        const doc = await packed(SPENT);
        if (doc) await actor.createEmbeddedDocuments("Item", [foundry.utils.deepClone(doc.toObject())]);
    },

    registerHooks() {
        // The clock. Severance lasts ten rounds; the eleventh ends it whether or not the Art was used.
        Hooks.on("combatTurnChange", async () => {
            if (!game.user.isGM) return;
            for (const combatant of game.combat?.combatants ?? []) {
                const actor = combatant.actor;
                if (!Reiatsu.isSoulbound(actor)) continue;
                if (!this.effectOn(actor)) continue;
                if (this.round(actor) > 10) await this.end(actor);
            }
        });
    },
};

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

/** The tag every Severing Art carries, and the only thing that identifies one. */
export const ART_TAG = "sb-tier-severing";

/** Is this item a Severing Art? */
export function isSeveringArt(item) {
    return (item?.system?.traits?.otherTags ?? []).includes(ART_TAG);
}

/**
 * Stamp the Waning dice onto every Severing Art the actor is carrying.
 *
 * **The whole table was inert.** `waningDice` was pure, exported and unit-tested; the fifteen Arts were
 * authored at a flat `20d6`, which is the round-one value, and nothing ever connected the two. A
 * twentieth-level Soulbound could sit through nine rounds of a 4d6 rider, doubled Flash Step and free
 * kidō and still end the fight for seventy points of damage — which removes the decision the capstone
 * is built around. Guide §9 is explicit that the decay *is* the balance lever.
 *
 * Done in `prepareDerivedData` rather than at cast time so the **card is honest**: a player in round
 * three sees 16d6 on the Art before deciding whether to spend it. That costs a re-preparation whenever
 * the round advances, which `registerHooks` does for exactly the actors in a Severance.
 */
export function applyWaning(actor, round) {
    const dice = waningDice(round);
    for (const item of actor.itemTypes?.spell ?? []) {
        if (!isSeveringArt(item)) continue;
        const part = item.system?.damage?.["0"];
        if (!part?.formula) continue;
        // Ittō Kasō is "the Waning dice **+2d6**" (R-14), so the extra is kept rather than overwritten.
        const extra = /\+\s*(\d+d\d+)/.exec(part.formula)?.[1];
        part.formula = dice === 0 ? "0" : `${dice}d6${extra ? ` + ${extra}` : ""}`;
    }
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

    /**
     * Refuse an Art that has decayed past use, and end Severance when one is used.
     *
     * Guide §9: using the Art "is two actions, costs nothing, and immediately ends Severance whether you
     * want it to or not", and after the seventh round it cannot be used at all. Both halves lived only
     * in the prose — `waningDice` returned 0 for round 8 and nothing asked it, so the Art stayed on the
     * sheet and rolled its printed twenty dice in round ten.
     */
    beforeCast(spell) {
        if (!isSeveringArt(spell)) return true;
        const actor = spell?.actor;
        if (!actor) return true;
        if (!this.effectOn(actor)) {
            ui.notifications.warn(`${spell.name} can only be used during Severance.`);
            return false;
        }
        if (this.dice(actor) === 0) {
            ui.notifications.warn(
                `${spell.name} has decayed past use — a Severing Art cannot be used after the seventh round.`,
            );
            return false;
        }
        return true;
    },

    /** Called after the Art has actually reached the table. */
    async afterCast(spell) {
        if (!isSeveringArt(spell)) return;
        const actor = spell?.actor;
        if (!actor || !this.effectOn(actor)) return;
        await this.end(actor);
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<p><strong>${spell.name}</strong> ends Severance.</p>`,
        });
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
                if (this.round(actor) > 10) { await this.end(actor); continue; }
                // The Waning dice are a function of the round, and nothing else re-prepares an actor
                // when the round turns — so the Art on the sheet would keep round one's twenty dice.
                actor.reset();
            }
        });
    },
};

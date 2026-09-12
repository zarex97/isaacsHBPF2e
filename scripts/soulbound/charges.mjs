const MODULE_ID = "isaacs-hb-pf2e";

/**
 * A charge pool: N of something, spent and regained on a schedule.
 *
 * Three Spirits want this and want it identically — Hyōrinmaru's three petal-flowers, Los Lobos' eight
 * wolves, and Gerard's Miracle points. They differ in their numbers, in how many may be spent per round,
 * and in when they come back; they do not differ in what "how many do I have" means.
 *
 * Storage is an effect's **counter badge**, because that is already how this module counts things: the
 * rider engine's `effect` apply type with `stack: true` walks a counter badge up, Scorpio's needles are
 * counted that way, and Virgo's Om spends from one. Inventing a flag beside all that would have been a
 * second answer to a question the module had already answered.
 */

/**
 * What is left after spending, and whether the spend was allowed.
 *
 * The per-round limit is the half that goes wrong quietly: Hyōrinmaru may spend **one** petal-flower per
 * round and has three, so a pool that only checked the total would let all three go in one turn — three
 * times the damage the Bankai is costed for, with nothing on the sheet to show for it.
 *
 * @param {object} state
 * @param {number} state.held             charges currently held
 * @param {number} state.spending         charges this spend wants
 * @param {number} state.perRound         how many may be spent per round (Infinity for no limit)
 * @param {number} state.spentThisRound   how many have already gone this round
 * @returns {{ allowed: boolean, held: number, reason: string|null }}
 */
export function afterSpend({ held, spending, perRound, spentThisRound }) {
    if (spending <= 0) return { allowed: false, held, reason: "nothing to spend" };
    if (spending > held) return { allowed: false, held, reason: "not enough charges" };
    if (spentThisRound + spending > perRound) {
        return { allowed: false, held, reason: "already spent this round" };
    }
    return { allowed: true, held: held - spending, reason: null };
}

/** What is left after a refresh. Never above the maximum, never below nothing. */
export function afterRefresh({ held, max, regain }) {
    return Math.max(0, Math.min(max, held + regain));
}

export const Charges = {
    /** The charge-bearing effect, by the name it is authored under. */
    effectOn(actor, effectName) {
        return actor?.itemTypes?.effect?.find((e) => e.name === effectName) ?? null;
    },

    held(actor, effectName) {
        const badge = this.effectOn(actor, effectName)?.system?.badge;
        return badge?.type === "counter" ? (badge.value ?? 0) : 0;
    },

    max(actor, effectName) {
        const badge = this.effectOn(actor, effectName)?.system?.badge;
        return badge?.type === "counter" ? (badge.max ?? 0) : 0;
    },

    /**
     * Spend, or refuse and say why.
     *
     * Refusing out loud rather than silently is the point: a petal-flower that does not come out because
     * one already did this round looks exactly like a bug unless something says otherwise.
     */
    async spend(actor, effectName, { spending = 1, perRound = 1 } = {}) {
        const effect = this.effectOn(actor, effectName);
        if (!effect) return { allowed: false, reason: "no charges to spend" };

        const round = game.combat?.round ?? null;
        const ledger = effect.getFlag(MODULE_ID, "charges") ?? { round: null, spent: 0 };
        const spentThisRound = ledger.round === round ? (ledger.spent ?? 0) : 0;

        const result = afterSpend({
            held: this.held(actor, effectName),
            spending,
            perRound,
            spentThisRound,
        });
        if (!result.allowed) {
            ui.notifications.warn(`${effect.name}: ${result.reason}.`);
            return result;
        }

        await effect.update({
            "system.badge.value": result.held,
            [`flags.${MODULE_ID}.charges`]: { round, spent: spentThisRound + spending },
        });
        return result;
    },

    async refresh(actor, effectName, { regain = 1 } = {}) {
        const effect = this.effectOn(actor, effectName);
        if (!effect) return 0;
        const value = afterRefresh({
            held: this.held(actor, effectName),
            max: this.max(actor, effectName),
            regain,
        });
        await effect.update({ "system.badge.value": value });
        return value;
    },
};

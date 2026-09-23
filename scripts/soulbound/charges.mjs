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
    /**
     * What an item declares about the pool it spends from.
     *
     *     "flags": { "isaacs-hb-pf2e": { "chargeSpend": {
     *         "effect": "Effect: Daiguren Hyōrinmaru", "spend": 1, "perRound": 1 } } }
     *
     * Named rather than inferred, because the three Spirits that want a pool want different numbers and
     * the item is the only place that knows which pool it draws on.
     */
    declarationOn(item) {
        const declared = item?.flags?.[MODULE_ID]?.chargeSpend;
        if (!declared?.effect) return null;
        return {
            effect: declared.effect,
            spending: Number(declared.spend ?? 1),
            perRound: declared.perRound === null ? Infinity : Number(declared.perRound ?? 1),
            // Two Techniques spend a variable number rather than a fixed one, and both are Los Lobos'.
            // *Colmillo* is "expend **any number** of wolves — **each** wolf you expend … detonates",
            // so the count is the caster's to choose and is also the number of bursts they then aim;
            // *Aullido* is "you expend **all** remaining wolves", which is not a choice at all.
            upTo: Number(declared.upTo) || 0,
            all: declared.all === true,
        };
    },

    /**
     * How many charges this use will take, asking when the answer is the caster's.
     *
     * Asked from the **targeting** step rather than from `beforeCast`, because the answer is also how
     * many areas go on the cursor — and because asking there keeps "aim first, pay after": a caster who
     * backs out of the placement has spent nothing, which is the ordering the Focus Point already relies
     * on. `beforeCast` then spends exactly what was agreed.
     */
    async countFor(item) {
        const declared = this.declarationOn(item);
        const actor = item?.actor;
        if (!declared || !actor) return 0;
        const held = this.held(actor, declared.effect);
        if (declared.all) return held;
        if (!declared.upTo || held <= 1) return Math.min(declared.spending, held);

        const ceiling = Math.min(held, declared.upTo);
        const picked = await foundry.applications.api.DialogV2.wait({
            window: { title: item.name },
            content: `<p>How many do you spend? <strong>${held}</strong> left.</p>`,
            buttons: Array.from({ length: ceiling }, (_, index) => ({
                action: String(index + 1),
                label: String(index + 1),
            })),
            rejectClose: false,
        });
        return picked === null || picked === undefined ? 0 : Number(picked);
    },

    /**
     * The spend that has to happen *before* the ability resolves.
     *
     * Hyōrinmaru's petal-flowers are the case: "once per round you may spend one petal-flower to use one
     * of" three Techniques, and a Technique cast with no petal left has to be refused rather than cast
     * and then quietly not charged. Returns false to stop the cast.
     */
    async beforeCast(spell, spending) {
        const declared = this.declarationOn(spell);
        if (!declared) return true;
        const actor = spell?.actor;
        if (!actor) return true;
        // `spending` is what the targeting step already agreed with the caster. Absent — an ability that
        // never went through area targeting — the declaration's own number stands.
        const wanted = Number.isInteger(spending) && spending > 0 ? spending : declared.spending;
        const { allowed } = await this.spend(actor, declared.effect, { ...declared, spending: wanted });
        return allowed;
    },

    /**
     * Give a spent charge back at the start of each of your turns.
     *
     * Guide §7A, Hyōrinmaru's Perfected Bankai at 17th: *"restores one spent petal-flower at the start
     * of each of your turns."* The refresh is declared on the charge-bearing effect itself, so a Spirit
     * whose pool refills on a different schedule — Los Lobos regains a wolf every turn from 13th, with
     * no Perfected clause at all — says so in content instead of here:
     *
     *     "chargeRefresh": { "regain": 1, "requires": "feature:perfected-full-release" }
     */
    registerHooks() {
        Hooks.on("pf2e.startTurn", async (combatant) => {
            if (!game.user.isGM) return;
            const actor = combatant?.actor;
            if (!actor) return;
            const options = actor.getRollOptions?.() ?? [];
            for (const effect of actor.itemTypes?.effect ?? []) {
                const declared = effect.flags?.[MODULE_ID]?.chargeRefresh;
                if (!declared) continue;
                if (declared.requires && !options.includes(declared.requires)) continue;
                if (this.held(actor, effect.name) >= this.max(actor, effect.name)) continue;
                const now = await this.refresh(actor, effect.name, { regain: Number(declared.regain ?? 1) });
                ui.notifications.info(`${effect.name}: ${now} left.`);
            }
        });
    },

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

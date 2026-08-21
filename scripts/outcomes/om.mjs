import { MODULE_ID } from "../sky/signs.mjs";

const OPTION = "om:eyes-open";
const EFFECT_SLUG = "effect-om";

/**
 * Spending Om on one roll, which is what the Cloth says and what nothing enforced.
 *
 * *Open Your Eyes* empowers "the next Technique you cast or unarmed Strike you make before the end of this
 * turn". The numbers were already automated — the rule elements on **Effect: Om** read the badge and add
 * their dice — but the `om:eyes-open` toggle stayed on until somebody flipped it back, so the second roll
 * of the turn was empowered too, and the third.
 *
 * Both halves of "next, and only next" are enforced here: the first roll that actually benefits spends the
 * stacks, and `pf2e.endTurn` clears anything left unspent.
 */
export const Om = {
    registerHooks() {
        // The damage roll is the *only* seam that works. Spending on the cast would take the stacks before
        // the damage is rolled, and the dice the stacks are worth are added by rule elements that read the
        // toggle — so an early spend would empower nothing at all.
        Hooks.on("pf2e.damageRoll", (roll) => Om.onDamageRoll(roll));
        // "before the end of this turn": anything unspent lapses.
        Hooks.on("pf2e.endTurn", (combatant) => Om.onTurnEnd(combatant));
    },

    async onTurnEnd(combatant) {
        if (game.users.activeGM?.id !== game.user.id) return;
        const actor = combatant?.actor;
        const effect = Om.effectOn(actor);
        if (!effect) return;

        if (Om.isOpen(actor)) {
            // "before the end of this turn": anything unspent lapses.
            if ((effect.system?.badge?.value ?? 0) > 0) await Om.close(effect);
            return;
        }
        await Om.gain(actor, effect);
    },

    /**
     * Eyes closed: one more stack.
     *
     * This is the half of Om that was never written. Spending was automated and lapsing was automated, but
     * nothing ever moved the badge *up*, so a Virgo Saint sat at one stack forever no matter how long they
     * kept their eyes shut — the accumulation that the blindness is the price for simply did not happen.
     */
    async gain(actor, effect) {
        if (!game.settings.get(MODULE_ID, "riders")) return;
        const badge = effect.system?.badge;
        if (badge?.type !== "counter") return;

        const value = Math.min((badge.value ?? 0) + 1, Om.ceilingFor(actor, effect));
        if (value === badge.value) return;
        await effect.update({ "system.badge.value": value });
    },

    /**
     * Five stacks, or seven on a day Virgo is ascendant.
     *
     * The badge itself is authored with room for seven so the Ascendant boon has somewhere to go; the
     * everyday ceiling is five, and only the sky lifts it. Whichever is lower wins, so re-authoring the
     * badge downward is still respected.
     */
    ceilingFor(actor, effect) {
        const options = actor?.getRollOptions?.() ?? [];
        const ascendant = options.includes("sky:ascendant") && options.includes("sky:sign:virgo");
        return Math.min(ascendant ? 7 : 5, effect?.system?.badge?.max ?? Infinity);
    },

    async onDamageRoll(roll) {
        const options = roll?.options?.rollerRollOptions ?? roll?.options?.rollOptions ?? [];
        if (!setHas(options, OPTION)) return;
        const actor = actorFor(roll);
        if (actor) await Om.spend(actor);
    },

    async spend(actor) {
        if (!game.settings.get(MODULE_ID, "riders")) return;
        const effect = Om.effectOn(actor);
        if (!effect || !Om.isOpen(actor)) return;

        const stacks = effect.system?.badge?.value ?? 0;
        await Om.close(effect);
        if (stacks > 0) {
            await ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor }),
                content: `<p><strong>Om</strong>: ${stacks} stack${stacks === 1 ? "" : "s"} spent. `
                    + `The empowerment is gone until the eyes close again.</p>`,
            });
        }
    },

    /** Zero the stacks and put the toggle back, which together is "the empowerment is spent". */
    async close(effect) {
        const toggle = (effect.rules ?? []).find((rule) => rule.key === "RollOption" && rule.option === OPTION);
        if (typeof toggle?.toggle === "function") {
            await toggle.toggle(false);
        }
        if ((effect.system?.badge?.value ?? 0) > 0) {
            await effect.update({ "system.badge.value": 0 });
        }
    },

    isOpen(actor) {
        return (
            actor?.rollOptions?.all?.[`self:${OPTION}`] === true ||
            actor?.getRollOptions?.().includes(OPTION) === true
        );
    },

    effectOn(actor) {
        return actor?.itemTypes?.effect?.find((item) => item.slug === EFFECT_SLUG) ?? null;
    },
};

function setHas(options, option) {
    return options instanceof Set ? options.has(option) : Array.isArray(options) && options.includes(option);
}

function actorFor(roll) {
    const uuid = roll?.options?.origin?.actor ?? roll?.data?.actor?.uuid;
    if (uuid) return fromUuidSync(uuid) ?? null;
    return null;
}

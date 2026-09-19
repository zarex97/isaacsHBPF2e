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
        //
        // This used to hook `pf2e.damageRoll` and read `roll.options.rollerRollOptions`. That field does not
        // exist on the `DamageRoll` this pf2e version hands the hook — its own `.options` is just
        // `{rollerId, damage, degreeOfSuccess, bypass, showBreakdown}` — so `om:eyes-open` was never seen and
        // nothing ever spent: the empowerment sat armed all turn, silently, with no error anywhere. The same
        // option is on the *message* the roll produces, at `flags.pf2e.context.options`, which is where every
        // other event source in this module already reads its facts from.
        Hooks.on("createChatMessage", (message, _options, userId) => Om.onDamageMessage(message, userId));
        // "before the end of this turn": anything unspent lapses.
        Hooks.on("pf2e.endTurn", (combatant) => Om.onTurnEnd(combatant));
        // "Your eyes open automatically, spending nothing, if you are knocked unconscious."
        Hooks.on("createItem", (item) => Om.onCondition(item));
        Hooks.on("updateActor", (actor, changes) => Om.onActorUpdate(actor, changes));
    },

    /**
     * The one way out of Om that costs nothing.
     *
     * The guide is explicit that being knocked out opens the eyes *without* spending the stacks, which is
     * the opposite of every other way they leave: no empowerment is armed, the toggle is never flipped, the
     * effect simply goes. Without this a Virgo Saint woke up still blinded by an effect they could no longer
     * act to remove — the blindness outliving the choice that bought it.
     */
    async onCondition(item) {
        if (game.users.activeGM?.id !== game.user.id) return;
        if (item?.type !== "condition" || item.slug !== "unconscious") return;
        await Om.wake(item.actor);
    },

    async onActorUpdate(actor, changes) {
        if (game.users.activeGM?.id !== game.user.id) return;
        if (foundry.utils.getProperty(changes ?? {}, "system.attributes.hp.value") === undefined) return;
        if ((actor?.hitPoints?.value ?? 1) > 0) return;
        await Om.wake(actor);
    },

    /** Remove the effect without toggling: no spend, no empowerment, no chat card claiming otherwise. */
    async wake(actor) {
        const effect = Om.effectOn(actor);
        if (!effect) return;
        await effect.delete();
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            flavor: "Om",
            content: `<p><strong>${actor.name}</strong> is knocked out and their eyes open — the stacks are `
                + `lost, not spent.</p>`,
        });
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

    async onDamageMessage(message, userId) {
        // Only the client whose roll produced the message acts, the same guard `Sources.onMessage` uses —
        // otherwise a five-player table spends the stacks five times over.
        if (game.user.id !== userId) return;
        if (message?.flags?.pf2e?.context?.type !== "damage-roll") return;
        const options = message.flags.pf2e.context.options ?? [];
        if (!options.includes(OPTION)) return;
        const actor = message.actor;
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

    /**
     * "All stacks are spent and reset to 0."
     *
     * Deleting rather than zeroing, because zero is not a state Om has: the counter's own minimum is 1, so
     * an update to 0 was clamped straight back to 1 and the toggle went off underneath it — which put the
     * Saint back to blinded, with a stack, the instant they spent everything they had. Every way out of Om
     * ends the same way: the eyes are open, the effect is gone, and closing them again is a fresh action.
     */
    async close(effect) {
        await effect.delete();
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

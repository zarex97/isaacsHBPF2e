/**
 * A wound that will not close.
 *
 * Three Severing Arts say the same sentence — *Shūkei: Hakuteiken*, *Ittō Kasō*, and Zanka no Tachi's
 * **Higashi** — and it is the harshest line any of them carries:
 *
 * > On a hit the target **can't regain Hit Points**, and its regeneration and fast healing are
 * > suppressed, for 1 minute.
 *
 * pf2e has no such state. Nothing in the system refuses healing: `Resistance` reduces damage, and a
 * negative healing modifier is not a thing. So the effect shipped as a **Note plus a roll option** — the
 * note tells a GM who is reading, and the option switches off a Hollow's Regeneración, which is the one
 * half the module could already reach. A cleric standing next to the target could still heal them, and
 * nothing anywhere would say no.
 *
 * The correction is made the way Libra's crossed blades already make theirs: hit points are read either
 * side of `applyDamage`, and healing that landed on a creature carrying the wound is taken straight back
 * off. It is a correction rather than a prevention, which is visible in the log by design — a table
 * should see that healing was attempted and refused, not silently watch a number fail to move.
 */

const MODULE_ID = "isaacs-hb-pf2e";

/** The effects that refuse healing outright. Slugs, because names are localised and these are not. */
const REFUSES_HEALING = new Set(["effect-wound-that-will-not-close"]);

export const Wound = {
    /** Does this creature currently carry a wound that will not close? */
    holds(actor) {
        return !!actor?.itemTypes?.effect?.some((e) => REFUSES_HEALING.has(e.slug));
    },

    /**
     * Take back any hit points a wounded creature just regained.
     *
     * Called from the `applyDamage` wrapper with the reading from before the call, exactly as
     * `halveHealing` is, and deliberately **after** it: this one is absolute, so whatever the Crossing
     * left behind is undone as well.
     */
    async refuse(actor, before) {
        if (!Wound.holds(actor)) return;

        const after = actor.hitPoints?.value ?? 0;
        const healed = after - before;
        if (healed <= 0) return;

        await actor.update({ "system.attributes.hp.value": before });
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            flags: { [MODULE_ID]: { wound: { refused: healed } } },
            content:
                `<p><strong>The wound will not close</strong>: ${actor.name} cannot regain Hit Points, and `
                + `the ${healed} they were given is refused.</p>`,
        });
    },
};

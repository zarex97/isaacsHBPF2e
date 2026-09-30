import { CheckPipeline, PRIORITY } from "../lib/check-pipeline.mjs";

/**
 * The Stargazer's armed effects — ADR-0004.
 *
 * Fortune's Thread and Speak the Portent act on a creature's d20 *before it is rolled*, and Foundry has no
 * such moment, so they are armed in advance as effects on the creature and pf2e spends them itself:
 *
 *  - **A Thread** is a `FlatModifier` — circumstance, ±1 or ±2 — with `removeAfterRoll: "if-enabled"`.
 *    pf2e deletes the effect after the first check whose modifiers include it enabled, so a roll it does
 *    not apply to (Snarl on a saving throw) leaves it armed.
 *  - **A Portent** is a `SubstituteRoll` with `required: true`, an explicit `slug` beginning
 *    `stargazer-portent`, and `removeAfterRoll: "if-enabled"`. pf2e replaces the dice expression with the
 *    constant, so a Portent of 20 is a natural 20 and of 1 a natural 1 for the degree of success, and
 *    deletes the effect only if the substitution was actually used. The explicit slug is load-bearing:
 *    without one `"if-enabled"` never matches and the effect is never spent.
 *
 * Driven in world `pf` (phase 0, #104): a Guide added +1 to the next skill check and was gone after it; a
 * Snarl survived a Fortitude save and was spent on the next skill check; a Portent of 20 turned a critical
 * failure against DC 40 into a failure, and of 1 turned a success against DC 5 into a critical failure.
 *
 * What pf2e does not do is guide §4.5's *"Speak the Portent cannot be used on a roll already altered by a
 * fortune or misfortune effect"*. A required substitution of the same effect type **overrides** a roll-twice
 * — driven, a Portent of 20 replaced a fortune roll-twice outright — so the guard below takes the Portent
 * out of any check that fortune or misfortune already touches. It is removed from the caller's own array,
 * so pf2e's `"if-enabled"` sees it unused and the Portent stays armed for a roll it can be spoken on.
 */

/** A Portent's substitution, by the slug every Portent effect carries. */
export function isPortent(substitution) {
    return String(substitution?.slug ?? "").startsWith("stargazer-portent");
}

/**
 * Take any Portent out of a check that fortune or misfortune already alters.
 *
 * Altered means a roll-twice, or another substitution — every substitution is itself a fortune or
 * misfortune effect in pf2e. Mutates `context.substitutions` in place; returns what it removed.
 */
export function guardPortent(context) {
    const substitutions = context?.substitutions;
    if (!Array.isArray(substitutions) || !substitutions.some(isPortent)) return [];
    const altered = Boolean(context.rollTwice) || substitutions.some((s) => !isPortent(s));
    if (!altered) return [];
    const removed = [];
    for (let i = substitutions.length - 1; i >= 0; i--) {
        if (isPortent(substitutions[i])) removed.push(...substitutions.splice(i, 1));
    }
    return removed;
}

export const Armed = {
    register() {
        CheckPipeline.before("the Portent's fortune guard (guide §4.5)", PRIORITY.portentGuard, (_check, context) => {
            const removed = guardPortent(context);
            if (removed.length > 0) {
                console.debug("Isaac's Homebrew | a Portent was held back from a roll fortune already altered");
            }
        });
    },
};

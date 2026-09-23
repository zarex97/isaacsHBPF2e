import { testPredicate } from "../lib/roll-options.mjs";

const MODULE_ID = "isaacs-hb-pf2e";
export const FLAG = "extraDieSteps";

/** pf2e's weapon damage dice, smallest first. Nothing goes past d12. */
const FACES = ["d4", "d6", "d8", "d10", "d12"];

/**
 * A second step on a weapon's damage die, which pf2e will not give.
 *
 * > **Zanka no Tachi** — Your spirit weapon's damage die increases by **two** steps instead of one.
 *
 * Written as two `ItemAlteration`s with `mode: "upgrade"`, which reads exactly like the sentence and is
 * worth one step. pf2e's handler latches:
 *
 * ```js
 * case "upgrade":
 *     if (t.flags.pf2e.damageFacesUpgraded || !r) return;   // ← one upgrade, ever
 * ```
 *
 * That latch is deliberate — PF2e's own rule is that die-size increases do not stack — so no arrangement
 * of `upgrade` rules can ever produce two steps, on one effect or across two. It is not a bug in the
 * content. `override` would work but takes a literal 4/6/8/10/12, and the Bankai is generic across seven
 * spirit-weapon profiles whose base dice run from d6 to d12.
 *
 * So the second step is taken here, after pf2e has finished and taken its one. An effect declares
 * `flags["isaacs-hb-pf2e"].extraDieSteps` and the Bankai keeps one honest `upgrade` rule beside it.
 *
 * The `two-hand-dX` trait is stepped with the die, because pf2e's own handler does that
 * (`adjustTwoHandTraitForDamageFacesChange`) and a Great Blade that deals d12 while promising d10 in two
 * hands is worse than not stepping at all.
 */

/** The die `steps` larger than this one, stopping at d12. Pure, and the whole of the arithmetic. */
export function nextDie(die, steps = 1) {
    const index = FACES.indexOf(String(die));
    if (index < 0 || !(steps > 0)) return die;
    return FACES[Math.min(FACES.length - 1, index + steps)];
}

/** How many extra steps this creature's items are asking for, beyond pf2e's own one. */
export function stepsRequested(actor) {
    let steps = 0;
    for (const item of actor?.items ?? []) {
        const declared = item.flags?.[MODULE_ID]?.[FLAG];
        // A declaration may count off the item's own counter rather than stating a number. *Bailar de
        // Valquiria* needs it: "your spirit weapon's damage die increases by one step for the rest of the
        // encounter" **each time** the refusal fires, and the refusals are unlimited — so the steps are a
        // tally, and the tally is a badge.
        const count = typeof declared === "number"
            ? declared
            : (declared?.fromBadge ? item.system?.badge?.value : declared?.value);
        if (!(count > 0)) continue;
        const predicate = typeof declared === "object" ? declared.predicate : null;
        if (predicate && !testPredicate(predicate, actor.getRollOptions?.() ?? [])) continue;
        steps += count;
    }
    return steps;
}

/** Step a weapon's `two-hand-dX` trait alongside its die, the way pf2e's own handler does. */
export function stepTwoHand(traits, steps) {
    return traits.map((trait) => {
        const match = /^two-hand-(d\d+)$/.exec(trait);
        return match ? `two-hand-${nextDie(match[1], steps)}` : trait;
    });
}

export function applyExtraDieSteps(actor) {
    const steps = stepsRequested(actor);
    if (steps <= 0) return;

    for (const weapon of actor.itemTypes?.weapon ?? []) {
        if (!weapon.system?.traits?.otherTags?.includes("soulbound-spirit-weapon")) continue;
        const die = weapon.system.damage?.die;
        if (!die) continue;
        const grown = nextDie(die, steps);
        if (grown === die) continue;
        weapon.system.damage.die = grown;
        if (Array.isArray(weapon.system.traits.value)) {
            weapon.system.traits.value = stepTwoHand(weapon.system.traits.value, steps);
        }
    }
}

import { wrap } from "../lib/wrap.mjs";

/**
 * Strikes that go around cover.
 *
 * Two clauses say the same thing from opposite ends of the ladder:
 *
 * > **Shikai Form** — Your Strikes are **not** affected by cover between you and the target.
 * > **Gokei** — that enemy **cannot benefit from cover or concealment** against it.
 *
 * pf2e puts cover on the *defender*: targeting a creature behind a wall grants it an `effect-cover` item
 * whose rule adds a circumstance bonus to AC. Nothing in the system lets an attacker suppress a modifier
 * that belongs to somebody else, which is why both clauses shipped as a note and corrected no roll.
 *
 * The correction is made where the two sides finally meet — the check itself. `Check.roll` already holds
 * the attacker, the target and the DC that was computed from the target's AC, so the cover bonus is read
 * off that AC and taken back out of the DC for this one roll.
 *
 * A **copy** of the DC is handed down rather than an edit in place: the object belongs to the statistic
 * that built it, and a roll is not the place to change what the defender's AC is.
 *
 * Gokei needs the other half of the same effect. Cover grants `+bonus` to **reflex** as well, predicated
 * on `area-effect` — and an imploding sphere is exactly that, so cover was quietly helping against the
 * one thing the guide says it cannot help against. There the bonus sits on the *roller's* own check
 * rather than on a DC, so it is switched off for the roll and switched back on after.
 *
 * Concealment stays a note. It is a flat check rather than a modifier, and there is no roll here to
 * correct.
 */

/** The options that mean "this Strike ignores cover", and what to call the adjustment in the log. */
const IGNORES_COVER = new Map([
    ["soulbound:senbonzakura:scattered", "Scattered"],
    ["soulbound:senbonzakura:gokei", "Gokei"],
]);

/**
 * The cover bonus standing on a target's AC right now, or 0.
 *
 * Matched on the modifier's slug and, failing that, on the effect that granted it. pf2e has renamed the
 * label between releases and the slug is the stable half; the effect check is there so a release that
 * renames the slug degrades to "still works" rather than "silently stops".
 */
export function coverBonusOn(actor) {
    const modifiers = actor?.armorClass?.modifiers ?? [];
    const fromModifier = modifiers
        .filter((m) => m.enabled && !m.ignored && /cover/i.test(m.slug ?? ""))
        .reduce((sum, m) => sum + (Number(m.modifier) || 0), 0);
    if (fromModifier !== 0) return fromModifier;

    const cover = actor?.itemTypes?.effect?.find((e) => e.slug === "effect-cover");
    if (!cover) return 0;
    return modifiers
        .filter((m) => m.enabled && !m.ignored && /cover/i.test(m.label ?? ""))
        .reduce((sum, m) => sum + (Number(m.modifier) || 0), 0);
}

/**
 * Lesser cover is pf2e's **+1**; standard is +2 and greater is +4.
 *
 * The number is the only way to tell them apart at the point where the correction is made — the bonus
 * is on the defender's AC and its label has been renamed between releases — so it is the number that is
 * matched.
 */
export const LESSER_COVER = 1;

/**
 * Which ignore-cover allowance is in play here, or null.
 *
 * Two shapes, because the clauses come in two shapes. A **stance** says it about everything you do —
 * Senbonzakura's scattered blades, Gokei — and is an option on the actor. A **single ability** says it
 * about itself:
 *
 * > **#4 Byakurai — Pale Lightning.** 60 ft., one creature. Spell attack roll. 2d6 electricity, doubled
 * > on a crit. **Ignores lesser cover.** — guide §6.1
 *
 * That last sentence was the whole of Byakurai that never happened: the kidō had no rules, no riders and
 * no flags, so the one thing distinguishing it from any other 2d6 attack cantrip was a line of prose.
 * It is an item flag rather than an actor option because it must not leak onto the next Strike.
 *
 * `"lesser"` is deliberately not `"all"`: a +2 or +4 bonus is standard or greater cover, which this
 * clause does not touch, and reading it as "any cover" would quietly make a 1st-rank kidō better than
 * a Shikai.
 */
export function ignoringCover(actor, item = null) {
    const declared = item?.flags?.["isaacs-hb-pf2e"]?.ignoresCover;
    if (declared === "lesser") return { label: item?.name ?? "Ignores lesser cover", max: LESSER_COVER };
    if (declared === "all") return { label: item?.name ?? "Ignores cover", max: Infinity };
    const options = actor?.getRollOptions?.() ?? [];
    for (const [option, label] of IGNORES_COVER) {
        if (options.includes(option)) return { label, max: Infinity };
    }
    return null;
}

/**
 * The DC this attack should roll against, once cover is taken out of it.
 *
 * Pure, and exported, because the arithmetic is the whole feature: everything else here is plumbing.
 * Returns the DC unchanged when there is nothing to correct, so the caller can compare by identity.
 */
export function withoutCover(dc, bonus) {
    if (!dc || typeof dc.value !== "number" || !(bonus > 0)) return dc;
    return { ...dc, value: dc.value - bonus };
}

/**
 * The cover bonus standing on the check a creature is about to roll, or 0.
 *
 * Read rather than switched off. Setting `ignored` on the modifier looked right and did nothing: pf2e
 * re-tests every predicate inside `Check.roll`, so the flag was back to false before the dice fell and
 * the message recorded `cover:2` as cheerfully as ever. Drive it and you get the roll-option stamped on
 * a roll that was never corrected — a fix that reports itself as working.
 *
 * So the correction is made on the DC instead, the same as the attack-roll half. Adding the bonus to the
 * DC and leaving it on the roll is arithmetically the same as taking it off the roll, and it survives
 * anything pf2e does to the modifier afterwards.
 */
export function coverBonusOnCheck(check) {
    return (check?.modifiers ?? [])
        .filter((m) => m.enabled && !m.ignored && /cover/i.test(m.slug ?? ""))
        .reduce((sum, m) => sum + (Number(m.modifier) || 0), 0);
}

export const Scattered = {
    register() {
        wrap(
            "game.pf2e.Check.roll",
            async function (wrapped, check, context = {}, ...rest) {
                try {
                    if (context?.type === "attack-roll") {
                        const allowance = ignoringCover(context.actor, context.item);
                        const label = allowance?.label;
                        const target = context.target?.actor;
                        if (allowance && target) {
                            const found = coverBonusOn(target);
                            // "Lesser cover" and nothing more: a bonus above the allowance is standard or
                            // greater cover, and is left exactly where it is.
                            const bonus = found <= allowance.max ? found : 0;
                            const corrected = withoutCover(context.dc, bonus);
                            if (corrected !== context.dc) {
                                context = { ...context, dc: corrected };
                                context.options = new Set([
                                    ...(context.options ?? []),
                                    `soulbound:ignored-cover:${bonus}`,
                                ]);
                                console.debug(
                                    `Isaac's Homebrew | ${label} ignored ${bonus} cover on ${target.name}`,
                                );
                            }
                        }
                    } else if (context?.type === "saving-throw") {
                        const origin = context.origin?.actor ?? context.origin ?? context.item?.actor;
                        const allowance = ignoringCover(origin, context.item);
                        const label = allowance?.label;
                        const found = allowance ? coverBonusOnCheck(check) : 0;
                        const bonus = found <= (allowance?.max ?? 0) ? found : 0;
                        if (bonus > 0 && typeof context.dc?.value === "number") {
                            context = {
                                ...context,
                                dc: { ...context.dc, value: context.dc.value + bonus },
                                options: new Set([
                                    ...(context.options ?? []), `soulbound:ignored-cover:${bonus}`,
                                ]),
                            };
                            console.debug(`Isaac's Homebrew | ${label} cancelled ${bonus} cover on a save`);
                        }
                    }
                } catch (error) {
                    // A failure here must never cost the roll: the attack matters more than the clause.
                    console.error("Isaac's Homebrew | could not ignore cover", error);
                }
                return wrapped(check, context, ...rest);
            },
            { feature: "Strikes that ignore cover (S-01d, S-06c)" },
        );
    },
};

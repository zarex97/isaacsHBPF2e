/**
 * What a lit sky is worth, in heightening steps.
 *
 * Every Ascendant Boon says "your Techniques heighten as though you were 4 levels higher", and every
 * Zenith says 8. A Technique heightens once per 2 character levels, so those are 2 and 4 steps — the same
 * numbers the `DamageDice` rules on each Technique are already labelled with. A Zenith emits
 * `sky:ascendant` as well as `sky:zenith`, so the richer sky has to be tested first or it reads as 2.
 *
 * Registered with area targeting's heightening as a step provider (`registerStepProvider`), so the burst,
 * the wall and the range grow on a lit day along with the dice.
 */
export const SKY_STEPS = { ascendant: 2, zenith: 4 };

export function skyStepsFromOptions(options) {
    const set = options instanceof Set ? options : new Set(options ?? []);
    if (set.has("sky:zenith")) return SKY_STEPS.zenith;
    if (set.has("sky:ascendant")) return SKY_STEPS.ascendant;
    return 0;
}

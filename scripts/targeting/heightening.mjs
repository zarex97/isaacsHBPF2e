/**
 * The growth pf2e has no field for.
 *
 * `system.heightening` carries `damage` and `area`, and the system applies both. Everything else a
 * Technique gains per step — another creature, another ten feet of range, another pillar, another five
 * feet of wall — has nowhere to live in the spell schema, because pf2e models neither a target count nor a
 * spell's range as a number. So it lives in this module's own targeting config, and this is the arithmetic
 * that turns a cast rank into the numbers the placement uses.
 *
 * Kept pure and separate so the ladders can be checked offline: the step count is the one thing here that
 * is easy to get subtly wrong, and it is invisible in the JSON.
 */

/**
 * What a lit sky is worth, in heightening steps.
 *
 * Every Ascendant Boon says "your Techniques heighten as though you were 4 levels higher", and every
 * Zenith says 8. A Technique heightens once per 2 character levels, so those are 2 and 4 steps — the same
 * numbers the `DamageDice` rules on each Technique are already labelled with. A Zenith emits
 * `sky:ascendant` as well as `sky:zenith`, so the richer sky has to be tested first or it reads as 2.
 */
export const SKY_STEPS = { ascendant: 2, zenith: 4 };

export function skyStepsFromOptions(options) {
    const set = options instanceof Set ? options : new Set(options ?? []);
    if (set.has("sky:zenith")) return SKY_STEPS.zenith;
    if (set.has("sky:ascendant")) return SKY_STEPS.ascendant;
    return 0;
}

/**
 * How many heightening steps a cast has taken. Never negative — a Technique cast at its base rank is 0.
 *
 * `bonusSteps` is growth the cast rank cannot express. The sky is the only source today: a Saint at 20th
 * is already casting at rank 10, the ceiling, so "as though you were 4 levels higher" has nowhere to go in
 * the rank and has to be added on this side instead.
 */
export function stepsFor({ baseRank, castRank, interval = 1, bonusSteps = 0 }) {
    const step = Number(interval) || 1;
    const taken = (Number(castRank) || 0) - (Number(baseRank) || 0);
    const earned = Math.max(0, Math.floor(taken / step));
    return earned + Math.max(0, Number(bonusSteps) || 0);
}

/**
 * Apply a `heightening` block to the base numbers.
 *
 * Two kinds of growth, because the Techniques are written both ways. Range grows *per step* — "the range
 * increases by 10 feet" — while extra targets, Strikes and pillars arrive at *named character levels*:
 * "at 12th and 16th level, you may target one additional creature", which is every four levels and so
 * cannot be expressed as a per-step increment at all.
 *
 * `areas` counts placements rather than adding to them: a Technique that places three at base and gains
 * one at 10th places four, which is what "add one pillar" means.
 */
export function applyHeightening(base, heightening, ranks) {
    const result = {
        maxTargets: Number(base.maxTargets) || 0,
        range: Number(base.range) || 0,
        areas: Math.max(1, Number(base.areas) || 1),
        length: Number(base.length) || 0,
        steps: 0,
    };
    if (!heightening) return result;

    const steps = stepsFor({ ...ranks, interval: heightening.interval });
    result.steps = steps;
    if (steps === 0) return result;

    if (heightening.maxTargets && result.maxTargets > 0) {
        result.maxTargets += Number(heightening.maxTargets) * steps;
    }
    if (heightening.range && result.range > 0) result.range += Number(heightening.range) * steps;
    if (heightening.areas) result.areas += Number(heightening.areas) * steps;
    if (heightening.length && result.length > 0) result.length += Number(heightening.length) * steps;

    return result;
}

/**
 * Growth that arrives at named character levels rather than per step.
 *
 * Applied on top of `applyHeightening`, and separately, because the two are not interchangeable: a
 * Technique can gain range every step *and* a target at 12th, and *Another Dimension* does both.
 */
export function applyThresholds(result, heightening, level) {
    const at = heightening?.at;
    if (!at) return result;

    for (const [threshold, gains] of Object.entries(at)) {
        if ((Number(level) || 0) < Number(threshold)) continue;
        if (gains.maxTargets) result.maxTargets += Number(gains.maxTargets);
        if (gains.areas) result.areas += Number(gains.areas);
        if (gains.range) result.range += Number(gains.range);
        if (gains.length) result.length += Number(gains.length);
    }
    return result;
}

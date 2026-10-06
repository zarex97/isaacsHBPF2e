/**
 * The Stargazer's *Long Now* (guide §7, 12th): an Augury whose **Duration** line reads 1 minute lasts
 * 10 minutes. The Duration line is the spell's own `system.duration`; a rider scoped to a degree of success
 * carries `outcomes` and is left alone — "a duration inside a degree of success … does not change".
 *
 * Registered with the rider engine as a duration modifier (`riders-extensions.mjs`).
 */
export function longNow(rider, context) {
    const duration = rider.duration;
    const item = context?.item ?? context?.riderItem;
    const caster = context?.originActor ?? item?.actor;
    const minute = duration?.unit === "minutes" && Number(duration?.value) === 1;
    if (!minute || rider.outcomes || item?.type !== "spell") return duration;
    if (String(item.system?.duration?.value ?? "").trim().toLowerCase() !== "1 minute") return duration;
    if (!(caster?.itemTypes?.feat ?? []).some((f) => f.slug === "long-now")) return duration;
    return { ...duration, value: 10 };
}

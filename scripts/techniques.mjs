/**
 * A focus effect belonging to one of this module's classes.
 *
 * `cosmo` is the Saint's Technique trait and `reiatsu` the Soulbound's. Area targeting keys off this to
 * decide whether the "Techniques only" world setting covers a given cast, so a Soulbound
 * Technique with an area would otherwise fall back to manual targeting with no symptom but the silence.
 */
export function isTechnique(item) {
    if (item?.type !== "spell") return false;
    const traits = item.system?.traits?.value ?? [];
    return traits.includes("cosmo") || traits.includes("reiatsu");
}

/**
 * The option set a targeting predicate is tested against.
 *
 * The prefixes are the system's, not ours: `Actor#getSelfRollOptions("target")` is what produces
 * `target:trait:undead`, `target:creature`, `target:size:large` and so on, and it is the same set pf2e's
 * own property runes predicate against (see `src/module/item/physical/runes.ts`). Writing a Technique's
 * targeting rule as `["target:trait:construct"]` therefore means exactly what it means anywhere else in
 * the system, and a GM who knows pf2e predicates already knows this one.
 */
export function targetingOptions(originActor, targetActor, item) {
    const options = new Set();
    for (const option of originActor?.getRollOptions?.() ?? []) options.add(option);
    for (const option of targetActor?.getSelfRollOptions?.("target") ?? []) options.add(option);
    for (const option of item?.getRollOptions?.("item") ?? []) options.add(option);
    return options;
}

/** Test a raw predicate array from an item flag. An empty or absent predicate passes. */
export function testPredicate(predicate, options) {
    if (!Array.isArray(predicate) || predicate.length === 0) return true;
    const Predicate = game.pf2e?.Predicate;
    if (!Predicate) return true;
    try {
        return new Predicate(predicate).test(options);
    } catch (error) {
        console.error("Isaac's Homebrew | invalid targeting predicate", predicate, error);
        return true;
    }
}

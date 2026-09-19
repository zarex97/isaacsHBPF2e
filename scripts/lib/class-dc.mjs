/**
 * The class DC of whichever homebrew class an actor carries.
 *
 * Written when the module gained a second class. Before that, "the class DC" meant the Saint's Cosmo DC,
 * and the rider engine said so in three places — a default of `"saint"`, a `dc: "cosmo"` that resolved
 * through `getStatistic("saint")`, and a counteract card that named the same statistic. A rider authored
 * on a Soulbound Technique needs the Reiatsu DC from the same code path, and a rider that names no class
 * at all should mean "whatever class the origin actually has" rather than silently meaning the Saint.
 */

/** The slug of the class this actor has, or null for anyone who is neither. */
export function classSlugOf(actor) {
    return actor?.class?.system?.slug ?? null;
}

/**
 * The named class statistic, or the actor's own class statistic when no name is given.
 *
 * Both lookups are tried, because `getStatistic` is the supported path and `classDCs` is what survives
 * when a statistic has not been prepared yet — the same belt-and-braces the Saint's `resolveDC` already
 * had, kept rather than tidied away.
 */
/**
 * A class DC — the Saint's Cosmo or the Soulbound's Reiatsu — or a flat number written in the content.
 *
 * All three spellings are kept. `"cosmo"` is the Saint's own and predates the second class, so the shipped
 * Saint content already says it — mostly on class-feature actions and sky effects; rewriting them to prove a
 * point is how content breaks. `"class"` means whichever class the origin actually has, which is what a
 * rider on a shared item wants.
 *
 * Returns `null` for a spelling it does not recognise, deliberately: a caller that cannot resolve a DC
 * should say so rather than invent one. `encasement.mjs` used to keep a private copy of this that knew only
 * `"cosmo"` and fell through to a hard-coded 10, so a Soulbound rider would have silently been handed a DC
 * everything passes.
 */
export function resolveDC(dc, context) {
    if (typeof dc === "number") return dc;
    const slug = { cosmo: "saint", reiatsu: "soulbound", class: null }[dc];
    if (slug === undefined) return null;
    return classStatisticOf(context.originActor, slug)?.dc?.value ?? null;
}

export function classStatisticOf(actor, slug = null) {
    const wanted = slug ?? classSlugOf(actor);
    if (!wanted) return null;
    return actor?.getStatistic?.(wanted) ?? actor?.classDCs?.[wanted] ?? null;
}

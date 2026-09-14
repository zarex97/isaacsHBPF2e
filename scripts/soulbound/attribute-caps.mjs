const MODULE_ID = "isaacs-hb-pf2e";

/**
 * "This attribute never rises past N."
 *
 * Arrogante's Resurrección says the doomed condition **never rises past 1** (guide §7B), and that was
 * authored as the obvious thing:
 *
 *     {"key": "ActiveEffectLike", "mode": "downgrade", "path": "system.attributes.doomed.max", "value": 1}
 *
 * It read perfectly and did nothing, because pf2e sets that value **after** every rule element has run:
 *
 *     this.prepareSynthetics();                         // ← all ActiveEffectLike rules apply here
 *     …
 *     attributes.doomed.max = attributes.dying.max;     // ← and are overwritten here, unconditionally
 *
 * — `CreaturePF2e#prepareDerivedData`. There is no ordering, priority or `afterPrepareData` that can win
 * against a plain assignment further down the same method. The only seam later than it is a wrapper on
 * `prepareDerivedData` itself, which the module already owns for the reiatsu pool.
 *
 * So the declaration lives on the item, the way `actionCost` does:
 *
 *     "flags": { "isaacs-hb-pf2e": { "attributeCaps": [
 *         { "path": "attributes.doomed.max", "value": 1 } ] } }
 *
 * **Never raises a cap**, only lowers one — two items asking for different ceilings agree on the lower,
 * and a cap can never hand a character more than the system gave them.
 */
/** A dotted path, read and written without `foundry.utils` so this stays testable outside Foundry. */
function at(object, path) {
    return path.split(".").reduce((node, key) => (node == null ? node : node[key]), object);
}

export function applyAttributeCaps(actor) {
    const caps = [];
    for (const item of actor.items) {
        const declared = item.flags?.[MODULE_ID]?.attributeCaps;
        if (Array.isArray(declared)) caps.push(...declared);
    }
    if (caps.length === 0) return;

    for (const { path, value } of caps) {
        if (!path || value === undefined) continue;
        const cap = Number(value);
        if (!Number.isFinite(cap)) continue;
        const keys = `system.${path}`.split(".");
        const leaf = keys.pop();
        const parent = at(actor, keys.join("."));
        if (!parent || typeof parent[leaf] !== "number") continue;
        if (cap < parent[leaf]) parent[leaf] = cap;
    }
}

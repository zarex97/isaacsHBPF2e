const MODULE_ID = "isaacs-hb-pf2e";

/**
 * "This costs one action instead of two."
 *
 * pf2e has no `ItemAlteration` for an action cost. Its handler list is closed and finite —
 * `ac-bonus`, `area-size`, `damage-dice-faces`, `frequency-max`, `range-increment` and twenty more —
 * and there is nothing for `time` or `actions`. Two abilities in this class were written as though
 * there were, and both were inert:
 *
 *  - **`Effect: Tensa Zangetsu`** — `{"property": "time", "value": "1"}`. Guide §7A: *"Getsuga Tenshō
 *    becomes 1 action"*. Action compression is the entire reason Tensa Zangetsu is the speed Bankai.
 *  - **`Instant Full Release`** (feat 14) — `{"property": "action-cost", "value": 1}`. Guide §8.5:
 *    *"Full Release takes 1 action instead of 2."* The feat's whole text.
 *
 * Neither failed loudly. pf2e's alteration schema rejects an unknown property at validation, so the
 * rule was simply dropped and the item kept its printed cost.
 *
 * So the module does the one thing pf2e does not, in the smallest possible way: a declaration on the
 * item that grants the compression, read once per data preparation.
 *
 *     "flags": { "isaacs-hb-pf2e": { "actionCost": [
 *         { "slug": "getsuga-tensh", "value": 1 } ] } }
 *
 * A spell carries its cost in `system.time.value` (a string) and an action or feat in
 * `system.actions.value` (a number); both are written, because the declaration names an item by slug
 * and should not also have to know what kind of item it is.
 *
 * This runs in `prepareDerivedData`, which is where pf2e applies its own alterations, so it is redone
 * from source every preparation and nothing is ever written to the database.
 */
export function applyActionCosts(actor) {
    const declarations = [];
    for (const item of actor.items) {
        const declared = item.flags?.[MODULE_ID]?.actionCost;
        if (Array.isArray(declared)) declarations.push(...declared);
    }
    if (declarations.length === 0) return;

    for (const { slug, value } of declarations) {
        if (!slug || value === undefined) continue;
        const cost = Number(value);
        if (!Number.isFinite(cost)) continue;
        for (const item of actor.items) {
            if (item.system?.slug !== slug) continue;
            // Never raise a cost: an ability that is already cheaper — a second effect compressing the
            // same one, or a 1-action variant — must not be undone by a stale declaration.
            if (item.system.time && Number(item.system.time.value) > cost) {
                item.system.time.value = String(cost);
            }
            if (item.system.actions && Number(item.system.actions.value) > cost) {
                item.system.actions.value = cost;
            }
        }
    }
}

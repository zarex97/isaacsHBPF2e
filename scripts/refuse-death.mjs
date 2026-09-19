import { Release } from "./soulbound/release.mjs";

const MODULE_ID = "isaacs-hb-pf2e";

/**
 * Standing back up at one Hit Point.
 *
 * > **Unbroken Chain** (feat 16) — When you would be reduced to 0 HP while released, spend 1 Reiatsu
 * > Point to remain at 1 HP instead. Once per day. — guide §8.5
 *
 * Every condition in that sentence has to be checked here because no rule element can reach any of them:
 * pf2e has no "when reduced to zero" hook, the release state is a module flag, and the cost is a pool the
 * feat does not own. It shipped as a `RollOption` nothing read.
 *
 * **`preUpdateActor` is the only place this can live.** By `updateActor` the hit points are already zero,
 * the dying condition is already being applied, and changing the number afterwards would leave a
 * character who is simultaneously at 1 HP and dying. Rewriting the incoming value is the whole trick, and
 * it is the same reason Rising Pressure decides "was this damage?" there.
 *
 * **This used to say it read its conditions from the feat, and then matched one hard-coded slug.** The
 * docstring promised the generality and the code did not have it, which was fine while exactly one
 * ability refused to die and wrong the moment a second and third did — *Bailar de Valquiria* at a price
 * of five Miracle points, repeatable (guide §7C, S-99), and *The Balance*'s Refined clause once per day.
 * So the price is now declared on the item:
 *
 *     "flags": { "isaacs-hb-pf2e": { "refuseDeath": {
 *         "label": "Unbroken Chain",
 *         "resource": "focus",          // a pool on the actor, or an effect's counter badge
 *         "cost": 1,
 *         "requires": "released",       // optional: only while not sealed
 *         "frequency": true             // optional: also spend one of the item's own uses
 *     } } }
 *
 * and a fourth needs a flag rather than a branch.
 */

/** Where a price is paid from: the reiatsu pool, or a counter badge on an effect. */
export function poolOf(actor, resource) {
    if (!resource || resource === "focus") {
        return { value: actor?.system?.resources?.focus?.value ?? 0, kind: "focus", item: null };
    }
    const effect = actor?.itemTypes?.effect?.find((e) => e.system?.slug === resource);
    if (!effect || effect.system?.badge?.type !== "counter") return { value: 0, kind: "missing", item: null };
    return { value: effect.system.badge.value ?? 0, kind: "badge", item: effect };
}

/**
 * Does this refusal fire, on this update?
 *
 * Pure, and the reason it is: every clause is a different kind of thing — a number in flight, a module
 * flag, a pool, a daily counter — and the only way to be sure they compose is to be able to ask.
 */
export function shouldCatch({ next, current, released, points, cost = 1, usesLeft = Infinity, requiresRelease = true }) {
    if (typeof next !== "number" || next > 0) return false;
    if (current <= 0) return false;          // already down: this is not the moment it happens
    if (requiresRelease && !released) return false;
    if (points < cost) return false;
    return usesLeft > 0;
}

/** Every item on the actor that declares a price for refusing to die, cheapest first. */
export function declarationsOn(actor) {
    const found = [];
    for (const item of actor?.items ?? []) {
        const declared = item.flags?.[MODULE_ID]?.refuseDeath;
        if (declared) found.push({ item, declared });
    }
    return found.sort((a, b) => (Number(a.declared.cost) || 1) - (Number(b.declared.cost) || 1));
}

export const RefuseDeath = {
    /**
     * Stamp the declaration onto owned copies that predate it.
     *
     * An owned feature is a copy taken when it was granted, so it carries the flags the pack had *then*.
     * Arayashiki shipped for a long time with `flags: {}`, which means every Saint already in a world
     * carries a copy with no declaration — and `declarationsOn` would find nothing on exactly the
     * characters this was written for.
     *
     * Only flags are touched. Owned `system.rules` are never rewritten: pf2e stamps a `flag` onto each
     * `GrantItem` at grant time that the pack source does not carry, and replacing the array wholesale
     * strands every granted child.
     *
     * Idempotent, and safe to run more than once.
     */
    async repairAll() {
        if (!game.user.isGM) return [];
        const declared = new Map();
        for (const pack of game.packs.filter((p) => p.metadata.packageName === MODULE_ID)) {
            for (const entry of await pack.getIndex({ fields: [`flags.${MODULE_ID}.refuseDeath`] })) {
                const flag = entry.flags?.[MODULE_ID]?.refuseDeath;
                if (flag) declared.set(entry.name, flag);
            }
        }

        const repaired = [];
        for (const actor of game.actors) {
            const updates = [];
            for (const item of actor.items) {
                const flag = declared.get(item.name);
                if (!flag) continue;
                if (item.flags?.[MODULE_ID]?.refuseDeath) continue;
                updates.push({ _id: item.id, [`flags.${MODULE_ID}.refuseDeath`]: flag });
            }
            if (updates.length === 0) continue;
            await actor.updateEmbeddedDocuments("Item", updates);
            repaired.push({ actor: actor.name, items: updates.length });
        }
        console.log("Isaac's Homebrew | refuse-death repair", repaired);
        return repaired;
    },

    registerHooks() {
        Hooks.on("preUpdateActor", (actor, changes) => {
            if (!game.user.isGM) return;
            // No class gate. This used to bail unless the actor was a Soulbound, which is why the Saint's
            // *Eighth Sense — Arayashiki* never reached a hook written to be class-agnostic: it sat in
            // `scripts/soulbound/` behind a check for the very class it was not supposed to care about.
            // Any item that declares a price is now heard, whoever is carrying it.

            const next = foundry.utils.getProperty(changes, "system.attributes.hp.value");
            const current = actor.system?.attributes?.hp?.value ?? 0;
            const released = Release.stateOf(actor) !== "sealed";

            for (const { item, declared } of declarationsOn(actor)) {
                // `Number(x) || 1` would turn a declared 0 into 1. Arayashiki costs nothing up front —
                // "read the action for what it costs you afterward" — so zero has to survive.
                const declaredCost = Number(declared.cost);
                const cost = Number.isFinite(declaredCost) ? declaredCost : 1;
                const pool = poolOf(actor, declared.resource);
                // `frequency: true` means the item's own uses are spent as well as the resource. An item
                // with no frequency and no such declaration is simply unlimited, which is what
                // "repeatable while points last" means for Bailar.
                const usesLeft = declared.frequency ? (item.system?.frequency?.value ?? 0) : Infinity;

                if (!shouldCatch({
                    next, current, released,
                    points: pool.value, cost, usesLeft,
                    requiresRelease: declared.requires === "released",
                })) continue;

                // Rewrite the update in flight: one hit point instead of none.
                foundry.utils.setProperty(changes, "system.attributes.hp.value", 1);
                if (pool.kind === "focus") {
                    foundry.utils.setProperty(changes, "system.resources.focus.value", pool.value - cost);
                } else if (pool.item) {
                    pool.item.update({ "system.badge.value": pool.value - cost });
                }
                if (declared.frequency) {
                    item.update({ "system.frequency.value": (item.system.frequency.value ?? 1) - 1 });
                }

                const price = pool.kind === "focus"
                    ? `${cost} focus point${cost === 1 ? "" : "s"}`
                    : `${cost} ${pool.item?.name ?? declared.resource}`;
                const spends = cost > 0 ? `spends ${price} and ` : "";
                ChatMessage.create({
                    speaker: ChatMessage.getSpeaker({ actor }),
                    content: `<p><strong>${declared.label ?? item.name}.</strong> ${actor.name} ${spends}`
                        + `stands at <strong>1 Hit Point</strong>.</p>`,
                });
                return;   // one refusal per blow, and the cheapest was taken
            }
        });
    },
};

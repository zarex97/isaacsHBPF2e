import { testPredicate } from "../lib/roll-options.mjs";
import { MODULE_ID } from "../sky/signs.mjs";

export const FLAG = "bypass";

/**
 * Getting past a target's immunities, resistances and Hardness.
 *
 * The backlog said this needed "a damage-application hook that recomputes IWR with our overrides, since
 * `DamageAlteration` has no property for ignore-the-target's-resistance". The rule element indeed has no
 * such property — but the damage *roll* does. `roll.options.bypass` is a `DamageIRBypassData`
 * (`system/damage/types.ts`) that `applyIWR` reads on every application, and property runes are the only
 * thing populating it today. Merging into it rather than recomputing IWR ourselves means weaknesses,
 * immunity redirects, critical-hit immunity and the breakdown printed in chat all keep working.
 *
 * Two things it cannot do, and which are handled by shadowing the target instead:
 *
 *  - **Partial resistance reduction.** `IgnoredResistance` has a `max`, and its doc comment promises
 *    "ignore up to a maximum" — but `applyIWR` only ever reads it as a display value: an ignored
 *    resistance is dropped whole (`iwr.ts:210` filters on the boolean). *Atomic Dissolution*'s "treat
 *    resistance as 5 lower" therefore cannot go through `bypass` at all.
 *  - **Hardness**, which `applyDamage` reads straight off `actor.hardness` and which `bypass` says
 *    nothing about.
 */
export function bypassEntriesOn(actor) {
    const entries = [];
    for (const item of actor?.items ?? []) {
        const flagged = item.flags?.[MODULE_ID]?.[FLAG];
        if (Array.isArray(flagged)) entries.push(...flagged.map((entry) => ({ entry, item })));
    }
    return entries;
}

/** The entries whose predicate matches this damage. */
export function selectEntries(entries, options) {
    return entries.filter(({ entry }) => testPredicate(entry.predicate, options));
}

/**
 * Fold matching entries into a `DamageIRBypassData`.
 *
 * Pure, so the merge can be tested without a damage roll. `types: "all"` is expanded by the caller rather
 * than here, because "all" should mean the types this damage actually deals — emitting eighty ignore
 * entries for a single cold instance would be correct and useless.
 */
export function mergeBypass(existing, entries, damageTypes) {
    const bypass = {
        immunity: {
            ignore: [...(existing?.immunity?.ignore ?? [])],
            downgrade: [...(existing?.immunity?.downgrade ?? [])],
            redirect: [...(existing?.immunity?.redirect ?? [])],
        },
        resistance: {
            ignore: [...(existing?.resistance?.ignore ?? [])],
            redirect: [...(existing?.resistance?.redirect ?? [])],
        },
    };

    for (const { entry } of entries) {
        const resistance = entry.resistance;
        // Only a total ignore goes through `bypass`; a partial reduction is applied to the target instead.
        if (resistance && resistance.max == null) {
            for (const type of expand(resistance.types, damageTypes)) {
                if (!bypass.resistance.ignore.some((r) => r.type === type)) {
                    bypass.resistance.ignore.push({ type, max: Infinity });
                }
            }
        }

        const immunity = entry.immunity;
        if (immunity?.mode === "ignore") {
            for (const type of expand(immunity.types, damageTypes)) {
                if (!bypass.immunity.ignore.includes(type)) bypass.immunity.ignore.push(type);
            }
        } else if (immunity?.mode === "downgrade") {
            for (const type of expand(immunity.types, damageTypes)) {
                if (bypass.immunity.downgrade.some((d) => d.type === type)) continue;
                // `resistence` is pf2e's spelling in DowngradedImmunity, and the field it actually reads.
                bypass.immunity.downgrade.push({ type, resistence: Number(immunity.resistance) || 0 });
            }
        }
    }

    return bypass;
}

function expand(types, damageTypes) {
    if (types === "all") return damageTypes;
    return Array.isArray(types) ? types : [];
}

/** The largest partial reduction any matching entry asks for. Zero means none of them do. */
export function resistanceReduction(entries) {
    return entries.reduce((most, { entry }) => {
        const max = entry.resistance?.max;
        return typeof max === "number" && max > most ? max : most;
    }, 0);
}

export function ignoresHardness(entries) {
    return entries.some(({ entry }) => entry.hardness === "ignore");
}

/**
 * Shadow the parts of the target that `bypass` cannot reach, for the length of one application.
 *
 * `hardness` is a prototype getter, so an own property shadows it and deleting restores it. Resistances
 * are prepared data that is rebuilt on every `prepareData`, so lowering their values in place and putting
 * them back is safe for the duration of a single call — and is the only way to express "treat resistance
 * as 5 lower", since pf2e's own `max` is not honoured.
 *
 * Returns a function that undoes everything it did.
 */
export function shadowTarget(actor, { reduction = 0, hardness = false } = {}) {
    const undo = [];

    if (hardness && actor.hardness > 0) {
        Object.defineProperty(actor, "hardness", { value: 0, configurable: true, writable: true });
        undo.push(() => delete actor.hardness);
    }

    if (reduction > 0) {
        for (const resistance of actor.attributes?.resistances ?? []) {
            const was = resistance.value;
            if (typeof was !== "number") continue;
            resistance.value = Math.max(0, was - reduction);
            undo.push(() => {
                resistance.value = was;
            });
        }
    }

    return () => {
        for (const restore of undo.reverse()) {
            try {
                restore();
            } catch (error) {
                console.error("Isaac's Homebrew | could not restore a shadowed target", error);
            }
        }
    };
}

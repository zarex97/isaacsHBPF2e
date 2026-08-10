import { FreeCast } from "./economy/free-cast.mjs";
import { wrap } from "./lib/wrap.mjs";
import { configFor } from "./targeting/config.mjs";
import { AreaTargeting } from "./targeting/index.mjs";

/**
 * Everything the module does on the way to an ability reaching the table.
 *
 * Three features want a word before a Technique is cast — the area is aimed, the Gemini duplicate is turned
 * away, a boon pays the Focus Point — and they all want it at `SpellcastingEntryPF2e#cast`, which is where
 * the point is spent. They used to register a wrapper each; libWrapper refuses two wrappers for the same
 * target from one package, so the second one threw and took the rest of `setup` with it. There is one
 * wrapper now, and the features are steps inside it.
 *
 * The order of those steps is load-bearing: aiming comes first so that backing out of a placement does not
 * spend the once-per-round allowance on a cast that never happened.
 */
export const CastPipeline = {
    install() {
        // MIXED rather than WRAPPER: a cancelled placement returns without calling through.
        wrap(
            "CONFIG.PF2E.Item.documentClasses.spellcastingEntry.prototype.cast",
            async function (wrapped, spell, options = {}) {
                if (!(await CastPipeline.beforeCast(spell, options))) return;
                return wrapped(spell, options);
            },
            { feature: "area targeting and free casts", type: "MIXED" },
        );

        // Actions never pass through `cast`; `toMessage` is where they reach the table instead, and the
        // Zenith activities are actions — a 60-foot emanation and a 60-foot line among them.
        //
        // Aimed at the ability class rather than at whichever prototype declares `toMessage`, because that
        // is `ItemPF2e` and patching there would put this guard in front of every weapon, consumable and
        // feat in the world for the sake of a handful of activities.
        wrap(
            "CONFIG.PF2E.Item.documentClasses.action.prototype.toMessage",
            async function (wrapped, event, options = {}) {
                if (configFor(this) && !(await AreaTargeting.run(this, {}))) return undefined;
                return wrapped(event, options);
            },
            { feature: "aiming an activity's area", type: "MIXED" },
        );
    },

    /** Resolves false when the cast should not go ahead. Mutates `options` — the system gets the same object. */
    async beforeCast(spell, options) {
        if (!(await AreaTargeting.run(spell, options))) return false;
        await FreeCast.beforeCast(spell, options);
        return true;
    },
};

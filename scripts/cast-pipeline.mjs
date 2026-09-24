import { FreeCast } from "./economy/free-cast.mjs";
import { SpellFrequency } from "./economy/spell-frequency.mjs";
import { Charges } from "./soulbound/charges.mjs";
import { Release } from "./soulbound/release.mjs";
import { Severance } from "./soulbound/severance.mjs";
import { StrikeTechnique } from "./riders/strike-technique.mjs";
import { wrap } from "./lib/wrap.mjs";
import { configFor } from "./targeting/config.mjs";
import { MODULE_ID } from "./sky/signs.mjs";
import { AreaTargeting, SPENDING, VARIANT } from "./targeting/index.mjs";

const OPENING = "Effect: Kidō Combination — Opening";

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
                // A Technique offered in two shapes decides which spell is actually cast: the line is a
                // real pf2e variant, and posting the original would announce the cone whatever was aimed.
                // `consume` already unwraps to `spell.original`, so the Focus Point still comes off the
                // Technique the character owns.
                const result = await wrapped(options[VARIANT] ?? spell, options);
                // After the Art has actually reached the table, never before: guide §9 says using it
                // "immediately ends Severance whether you want it to or not", and ending it on an
                // attempt that was cancelled would take the capstone away for nothing.
                await Severance.afterCast(spell);
                // "Make one Strike, and then…" — the Strike is rolled with a weapon, so the rider that
                // follows it lives on this spell and can only be found by searching the sheet. The marker
                // is what tells that search which Technique was actually paid for; without it every Strike
                // Technique on the sheet fired on every Strike. Here rather than in `beforeCast` because
                // the cast has now actually happened.
                await StrikeTechnique.arm(options[VARIANT] ?? spell);
                // "Immediately after using a destruction kidō" — the half of Kidō Combination that
                // nothing checked. See `markDestructionKido`.
                await CastPipeline.markDestructionKido(options[VARIANT] ?? spell);
                return result;
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

    /**
     * A voice that has been sealed.
     *
     * > **#99 Kin — Silence the Chain.** **Failure** stupefied 2 for 1 minute; **can't cast spells or use
     * > kidō for 1 round**. **Crit failure** stupefied 3, can't cast for 2 rounds. — guide §6.2
     *
     * That sentence is the whole difference between Kin and an ordinary stupefy, and it shipped as a line
     * on the effect's description with `rules: []` behind it. Driven live, a target carrying
     * `Effect: Silenced Chain` cast whatever it liked.
     *
     * Read off a roll option rather than by effect name, so anything else that seals a voice — a Schrift,
     * a hazard, a GM's own effect — gets the same refusal by publishing the same option.
     *
     * **First** of the refusals, before the area is even aimed: a caster who cannot speak should not be
     * asked to place a burst and then told no.
     */
    silenced(spell) {
        const actor = spell?.actor;
        if (!actor?.getRollOptions?.().includes("soulbound:silenced")) return true;
        ui.notifications.warn(`${actor.name}'s voice is sealed: no spells and no kidō.`);
        return false;
    },

    /**
     * The opening a Way of Destruction leaves behind.
     *
     * > **Kidō Combination.** *Immediately after using a destruction kidō*, use a binding kidō against
     * > the same target for 1 fewer Reiatsu Point (minimum 0). Once per encounter. — guide §8.3
     *
     * The discount was real and the **sequencing was not**: the free cast was predicated on the binding
     * kidō alone, so a Soulbound who had spoken no Hadō at all still got their Bakudō free. Driven live,
     * a cold `Hainawa` came out costing nothing.
     *
     * It cannot be a rider. `onActionUsed` reads `ridersOn(item)` — the riders of the item that was
     * *used* — so a stamp living on the feat could never answer a kidō's cast, and one living on each
     * destruction kidō would have to be authored eight times and remembered a ninth. The pipeline sees
     * every cast, which is the one place that knows a Hadō has just been spoken.
     *
     * "Against the same target" is not enforced, and deliberately: pf2e enforces the range or the target
     * of nothing, and a check here would be the only one in the system.
     */
    async markDestructionKido(spell) {
        const actor = spell?.actor;
        if (!actor) return;
        const tags = spell.system?.traits?.otherTags ?? [];
        const traits = spell.system?.traits?.value ?? [];
        if (!tags.includes("sb-tier-kido") || !traits.includes("destruction")) return;
        /**
         * Asked of what is **waiting for** the opening, not of the feat's name.
         *
         * `Kidō Combination` sluggifies to `kid-combination`: the build reduces anything outside
         * `[a-z0-9]` to a separator, so the macron becomes a hyphen — the same trap SB-16 and
         * `Regeneración` were caught by, and the rig's slug guard caught this one before it shipped.
         * Reading the allowance's own predicate is exact, and it means a later feat that wants the same
         * opening gets it by asking for it.
         */
        const wanted = actor.items.some((i) => {
            const predicate = i.flags?.[MODULE_ID]?.freeCast?.predicate ?? [];
            return JSON.stringify(predicate).includes("soulbound:after-destruction-kido");
        });
        if (!wanted) return;
        if (actor.itemTypes.effect.some((e) => e.name === OPENING)) return;

        const pack = game.packs.get(`${MODULE_ID}.soulbound-effects`);
        const entry = pack ? (await pack.getIndex()).find((e) => e.name === OPENING) : null;
        if (!entry) return;
        const doc = await pack.getDocument(entry._id);
        await actor.createEmbeddedDocuments("Item", [foundry.utils.deepClone(doc.toObject())]);
    },

    /** Resolves false when the cast should not go ahead. Mutates `options` — the system gets the same object. */
    async beforeCast(spell, options) {
        if (!this.silenced(spell)) return false;
        if (!(await AreaTargeting.run(spell, options))) return false;
        // Before the allowance is spent, not after: `Release.beforeCast` reads the same frequency that
        // `FreeCast` decrements, and the Soulbound's once-per-round cap is a refusal rather than a price.
        if (!Release.beforeCast(spell)) return false;
        // A Severing Art outside Severance, or after the seventh round, is refused rather than rolled.
        if (!Severance.beforeCast(spell)) return false;
        // A Technique that spends from a charge pool is refused when the pool is empty, rather than cast
        // and then quietly not charged. Hyōrinmaru's three petal-flowers are the case.
        if (!(await Charges.beforeCast(spell, options?.[SPENDING]))) return false;
        // pf2e never spends a *spell's* Frequency, so a Technique that says "once per round" was limited
        // by nothing until this step existed. Last of the refusals and first of the prices: a spell that
        // is going to be turned away by any of the checks above must not have paid its allowance for it.
        if (!(await SpellFrequency.beforeCast(spell))) return false;
        await FreeCast.beforeCast(spell, options);
        return true;
    },
};

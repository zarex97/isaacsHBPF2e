import { CastPipeline, StrikeTechnique } from "./automation.mjs";
import { FreeCast } from "./economy/free-cast.mjs";
import { MODULE_ID } from "./sky/signs.mjs";
import { Charges, SPENDING } from "./soulbound/charges.mjs";
import { Release } from "./soulbound/release.mjs";
import { Severance } from "./soulbound/severance.mjs";

const OPENING = "Effect: Kidō Combination — Opening";

/**
 * Where this module's cast stages fall among the pipeline's own (`CAST_PRIORITY`: aim 10, spell frequency
 * 50). The order is load-bearing and was a fixed sequence before it was stages: a caster who cannot speak
 * is refused before being asked to aim; the Soulbound's refusals come after the area is aimed but before
 * the spell's Frequency is spent; a free cast is a price, so it comes last.
 */
export const CAST_STAGE = {
    silenced: 0,
    release: 20,
    severance: 30,
    charges: 40,
    freeCast: 60,
    // After the cast.
    severanceEnds: 10,
    armStrike: 20,
    destructionKido: 30,
};

export function registerCastStages() {
    CastPipeline.before("a sealed voice", CAST_STAGE.silenced, (spell) => silenced(spell));
    // Before the allowance is spent, not after: `Release.beforeCast` reads the same frequency that
    // `FreeCast` decrements, and the Soulbound's once-per-round cap is a refusal rather than a price.
    CastPipeline.before("the release ladder", CAST_STAGE.release, (spell) => Release.beforeCast(spell));
    // A Severing Art outside Severance, or after the seventh round, is refused rather than rolled.
    CastPipeline.before("Severance", CAST_STAGE.severance, (spell) => Severance.beforeCast(spell));
    // A Technique that spends from a charge pool is refused when the pool is empty, rather than cast and
    // then quietly not charged. Hyōrinmaru's three petal-flowers are the case.
    CastPipeline.before("charge pools", CAST_STAGE.charges, (spell, options) => Charges.beforeCast(spell, options?.[SPENDING]));
    CastPipeline.before("free casts", CAST_STAGE.freeCast, async (spell, options) => {
        await FreeCast.beforeCast(spell, options);
        return true;
    });

    // After the Art has actually reached the table, never before: guide §9 says using it "immediately ends
    // Severance whether you want it to or not", and ending it on an attempt that was cancelled would take
    // the capstone away for nothing. Asked of the spell the caster owns, as it always was.
    CastPipeline.after("Severance ends", CAST_STAGE.severanceEnds, (_cast, spell) => Severance.afterCast(spell));
    // "Make one Strike, and then…" — the Strike is rolled with a weapon, so the rider that follows it lives
    // on this spell and can only be found by searching the sheet. The marker is what tells that search
    // which Technique was actually paid for; without it every Strike Technique on the sheet fired on every
    // Strike.
    CastPipeline.after("arming a Strike Technique", CAST_STAGE.armStrike, (cast) => StrikeTechnique.arm(cast));
    // "Immediately after using a destruction kidō" — the half of Kidō Combination that nothing checked.
    CastPipeline.after("a destruction kidō's opening", CAST_STAGE.destructionKido, (cast) => markDestructionKido(cast));
}

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
export function silenced(spell) {
    const actor = spell?.actor;
    if (!actor?.getRollOptions?.().includes("soulbound:silenced")) return true;
    ui.notifications.warn(`${actor.name}'s voice is sealed: no spells and no kidō.`);
    return false;
}

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
export async function markDestructionKido(spell) {
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
}

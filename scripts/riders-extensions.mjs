import { classSlugOf, classStatisticOf } from "./lib/class-dc.mjs";
import { RiderExtensions } from "./riders/extensions.mjs";
import { WEAPON_TAG, crossingBleed, equipArm, libraDice, libraPotency } from "./riders/libra.mjs";
import { MODULE_ID } from "./sky/signs.mjs";
import { PROFILE_TAG as SPIRIT_PROFILE_TAG, SPIRIT_WEAPON_TAG } from "./soulbound/weapon.mjs";
import { longNow } from "./stargazer/long-now.mjs";
import { registerOriginFlag } from "./targeting/enemy-terrain.mjs";

/**
 * Where this module's classes plug into the rider engine.
 *
 * Every one of these used to be a branch inside `riders/apply.mjs`. They are the same code, registered —
 * so the engine knows nothing about Libra's Arms, a Soulbound's charges, a Quincy's counteract or the
 * Stargazer's Long Now, and could be lifted out whole.
 */
export function registerRiderExtensions() {
    /* ---- Apply types -------------------------------------------------------------------------- */

    RiderExtensions.registerApplyType("equip", applyEquip);
    RiderExtensions.registerApplyType("charge", applyCharge);

    /* ---- Strikes a volley may name ------------------------------------------------------------ */

    // *Rozan Ryū Hi Shō*: "one unarmed Strike **or Libra weapon Strike**" — whatever is in the Saint's hands,
    // and the fist if nothing is, because a Saint holding both Tridents cannot punch with either hand anyway.
    RiderExtensions.registerStrikeSelector("libra", (actor) => {
        const actions = actor.system.actions ?? [];
        const held = actions.find((action) => action.ready && (action.item?.system?.traits?.otherTags ?? []).includes(WEAPON_TAG));
        if (held) return held;
        return actions.find((action) => action.item?.system?.category === "unarmed") ?? actions[0];
    });
    // "With your **spirit weapon**" — whichever one that is right now: a released form's weapon wins over the
    // sealed profile, because while one is in hand the other is stowed (the order `SpiritWeapon.reconcile` keeps).
    RiderExtensions.registerStrikeSelector("spirit-weapon", (actor, { exact }) => {
        const actions = actor.system.actions ?? [];
        const spirit = actions.filter((action) => (action.item?.system?.traits?.otherTags ?? []).includes(SPIRIT_WEAPON_TAG));
        const released = spirit.find((action) => !(action.item?.system?.traits?.otherTags ?? []).includes(SPIRIT_PROFILE_TAG));
        const held = released ?? spirit[0] ?? null;
        if (held) return held;
        return exact ? null : (actions.find((a) => a.item?.system?.category === "unarmed") ?? actions[0]);
    });

    /* ---- Values a rider may ask the origin for ------------------------------------------------ */

    // The Arms Advance: a Libra Art's numbers are stated in the weapon's own damage dice, a ladder a lit sky
    // raises by a whole tier.
    RiderExtensions.registerOriginValue("Libra's dice", "origin.libra.dice", (context) => libraDice(context.originActor));
    RiderExtensions.registerOriginValue("Libra's Crossing bleed", "origin.libra.bleed", (context) => crossingBleed(context.originActor));
    RiderExtensions.registerOriginValue("Libra's potency", "origin.libra.potency", (context) => libraPotency(context.originActor));
    RiderExtensions.registerOriginValue("Libra's dice as a die", /^origin\.libra\.dice\.(d\d+)$/, (context, match) =>
        `${libraDice(context.originActor)}${match[1]}`);
    // The Waning dice as they stand *now* — Apotheosis "detonates again at the start of your next turn for half
    // the Waning dice" (R-26), and by then the round has turned.
    RiderExtensions.registerOriginValue("the Severance Waning dice", "origin.severance.dice", (context) => {
        const dice = game.modules.get(MODULE_ID)?.api?.severance?.dice?.(context.originActor) ?? 0;
        return dice > 0 ? `${dice}d6` : null;
    });

    /* ---- DCs and statistics ------------------------------------------------------------------- */

    // `cosmo` is the Saint's, `reiatsu` the Soulbound's, `class` whichever class the origin has — or borrows.
    RiderExtensions.registerDcResolver("this module's class DCs", 10, (dc, context) => {
        const slug = { cosmo: "saint", reiatsu: "soulbound", class: null }[dc];
        if (slug === undefined) return undefined;
        return classStatisticOf(context.originActor, slug)?.dc?.value ?? null;
    });
    // A borrowed class counteracts with its lender's statistic — The Thing That Wears You (#96).
    RiderExtensions.registerStatisticResolver("a class, or its lender's", 10, (actor, slug) => classStatisticOf(actor, slug) ?? undefined);
    // A counteract that names no statistic uses the origin's own class — a Soulbound's Seal the Art counteracts
    // on the Reiatsu DC without the content naming it — and the Saint's when the origin has none.
    RiderExtensions.registerDefaultStatistic("the origin's class, or the Saint's", 10, (actor) => classSlugOf(actor) ?? "saint");

    /* ---- The Quincy's counteract cluster — guide §5.3, §8.3 and the 15th-level Mastery ---------- */

    // Reishi Mastery (feat 10) raises the counteract rank by 1.
    RiderExtensions.registerCounteractRankBonus("Reishi Mastery", 10, (actor) =>
        (actor.getRollOptions?.() ?? []).includes("soulbound:reishi-mastery") ? 1 : 0);
    // A release state is "not ended outright but suppressed until the end of the target's next turn".
    RiderExtensions.registerSuppressibleTrait("soulbound");
    RiderExtensions.registerSuppressibleTrait("cosmo");
    // Suppression parks the rules and the module's own riders and puts them back when the window closes.
    // Sklaverei (15th): "On a critical success against a release state, the suppression lasts 1 minute instead."
    RiderExtensions.registerSuppressor(async (effect, { actor, outcome }) => {
        const { Suppression } = await import("./soulbound/suppression.mjs");
        const minute = outcome === "criticalSuccess" && (actor.getRollOptions?.() ?? []).includes("soulbound:sklaverei");
        const suppressed = await Suppression.suppress(effect, { minutes: minute ? 1 : 0 });
        return { suppressed, until: suppressed && minute ? "for <strong>1 minute</strong>" : null };
    });
    /**
     * Seal the Art costs 1 Reiatsu Point, charged here where the outcome is known (pf2e only deducts focus for a
     * spell); Reishi Mastery makes it free on a critical success; Sklaverei refunds a point on a successful
     * counteract, ignoring Rising Pressure's per-encounter cap, and leaves the target off-guard until the end of
     * its next turn. Read from roll options so a Borrowed Nature dip that grants Seal the Art behaves the same.
     */
    RiderExtensions.registerAfterCounteract("the Quincy's Reiatsu and Sklaverei", 10, async ({ actor, effect, item, outcome, counteracted }) => {
        if (classSlugOf(actor) !== "soulbound") return;
        const options = actor.getRollOptions?.() ?? [];
        const pool = actor.system?.resources?.focus;
        const free = options.includes("soulbound:reishi-mastery") && outcome === "criticalSuccess";
        let value = pool?.value ?? 0;
        if (!free) value = Math.max(0, value - 1);
        if (counteracted && options.includes("soulbound:sklaverei")) value = Math.min(pool?.max ?? value, value + 1);
        if (value !== (pool?.value ?? 0)) await actor.update({ "system.resources.focus.value": value });
        // A timed effect carries the condition: `increaseCondition` applies one with no duration, and a Quincy
        // with Sklaverei once left every target they sealed permanently off-guard.
        if (counteracted && options.includes("soulbound:sklaverei") && effect.actor) {
            await effect.actor.createEmbeddedDocuments("Item", [{
                name: `${item?.name ?? "Seal the Art"}: Off-Guard`,
                type: "effect",
                img: item?.img ?? "icons/svg/downgrade.svg",
                system: {
                    duration: { unit: "rounds", value: 1, expiry: "turn-end", sustained: false },
                    rules: [{ key: "GrantItem", uuid: "Compendium.pf2e.conditionitems.Item.AJh5ex99aV6VTggg", allowDuplicate: false }],
                },
            }]);
        }
    });

    /* ---- Saves the engine rolls --------------------------------------------------------------- */

    // Lapis Lazuli Depth 4 — "name a creature's strongest save; for 1 minute your Mutations target its weakest
    // instead" (#88): a save one of that Assimilator's Mutations calls for rolls the weakest.
    RiderExtensions.registerSaveModifier("Lay Bare", 10, ({ statistic, context }) => {
        const origin = context.originActor;
        if (!origin || !(context.item?.system?.traits?.otherTags ?? []).includes("assimilator-mutation-action")) return null;
        const mark = context.actor?.itemTypes?.effect?.find((e) => e.flags?.[MODULE_ID]?.laidBare?.origin === origin.uuid);
        const bare = mark?.flags?.[MODULE_ID]?.laidBare;
        return bare && statistic === bare.strongest ? { statistic: bare.weakest } : null;
    });
    // Kidō Focus (feat 2): "spend 1 additional action to give the target a −1 circumstance penalty to its save" —
    // a toggle on the caster, restricted to kidō.
    RiderExtensions.registerSaveModifier("Kidō Focus", 20, ({ context }) => {
        const focused = (context.originActor?.getRollOptions?.() ?? []).includes("soulbound:kido-focus")
            && (context.item?.system?.traits?.otherTags ?? []).includes("sb-tier-kido");
        return focused
            ? { modifiers: [new game.pf2e.Modifier({ slug: "kido-focus", label: "Kidō Focus", modifier: -1, type: "circumstance" })] }
            : null;
    });

    /* ---- Durations, forced movement, effects, areas ------------------------------------------- */

    RiderExtensions.registerDurationModifier("Long Now", 10, (duration, rider, context) => longNow({ ...rider, duration }, context));

    // Taurus' Bulwark refuses anything its own size or smaller, and a Saint in Titan's Stance cannot be shifted.
    RiderExtensions.registerTeleportRefusal("the Saint's stances", 10, (token, context) => {
        const options = token.actor?.getRollOptions?.() ?? [];
        if (options.includes("saint:immovable")) return "does not move";
        if (!options.includes("saint:bulwark")) return null;
        const order = { tiny: 0, sm: 1, med: 2, lg: 3, huge: 4, grg: 5 };
        const mover = order[context.originActor?.size ?? "med"] ?? 2;
        const held = order[token.actor?.size ?? "med"] ?? 2;
        return mover <= held ? "is not moved by anything its own size or smaller" : null;
    });

    // *The Twelve Arms* grants the matched pair through the effect's own rules; a granted weapon arrives carried
    // rather than held, and an ally holding an Arm they have not equipped is the whole Technique not working.
    RiderExtensions.registerEffectFollowUp("an Arm into the hands", 10, async (rider, context) => {
        if (rider.apply.arm) await equipArm(context.actor, rider.apply.arm);
    });

    // Senbonzakura Kageyoshi's second emanation sits wherever it was last sent (`soulbound/actions.mjs`).
    RiderExtensions.registerAreaAnchors("Senbonzakura's emanation", (actor) => actor?.getFlag?.(MODULE_ID, "areaAnchors") ?? {});

    // A Soulbound terrain aura records whose ground it is under its own key.
    registerOriginFlag("terrainAura");
}

/**
 * Summon an Arm — Libra's twelve weapons, six matched pairs, one pair in the hands at a time.
 *
 * A rider rather than an inventory click because the pair is the unit and the sky decides how many pairs the
 * Saint may hold: one normally, two half-pairs under *The Balance*, and all six under a Zenith.
 */
async function applyEquip(rider, context) {
    const actor = context.originActor ?? context.actor;
    if (!actor) return;

    const options = actor.getRollOptions?.() ?? [];
    const sky = options.includes("sky:zenith") ? "zenith" : options.includes("sky:ascendant") ? "ascendant" : "none";
    const { equipped, stowed } = await equipArm(actor, rider.apply.arm ?? null, { sky });

    const lines = [];
    if (equipped.length > 0) lines.push(`<strong>Summoned</strong> ${equipped.join(" and ")}.`);
    if (stowed.length > 0) lines.push(`<strong>Dismissed</strong> ${stowed.join(", ")}.`);
    if (lines.length === 0) lines.push("Nothing changed — that Arm is already in your hands.");
    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        flavor: context.item?.name ?? "Summon an Arm",
        content: `<p>${lines.join(" ")}</p>`,
    });
}

/**
 * Spend from a charge pool — the other half of `Charges.beforeCast`, for a Technique that is a reaction and
 * never passes through `cast` (Zanhyō Ningyō). Always the ORIGIN's pool: the petal-flowers are the Bankai's.
 */
async function applyCharge(rider, context) {
    const { Charges } = await import("./soulbound/charges.mjs");
    const actor = context.originActor;
    const { effect, spend = 1, perRound = 1 } = rider.apply;
    if (!actor || !effect) return;
    await Charges.spend(actor, effect, {
        spending: Number(spend),
        perRound: perRound === null ? Infinity : Number(perRound),
    });
}

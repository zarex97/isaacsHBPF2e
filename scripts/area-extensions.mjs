import { Astral } from "./astral.mjs";
import { Deaths } from "./deaths.mjs";
import { Duplicate } from "./economy/duplicate.mjs";
import { AreaTargeting, FrequencyGuard, Recharge, registerFlagScope, registerStepProvider } from "./automation.mjs";
import { MODULE_ID } from "./sky/signs.mjs";
import { skyStepsFromOptions } from "./sky/steps.mjs";
import { Charges } from "./soulbound/charges.mjs";
import { Lingering } from "./targeting/lingering.mjs";
import { isTechnique } from "./techniques.mjs";
import { Overlap } from "./targeting/overlap.mjs";
import { CrystalWall } from "./targeting/wall.mjs";

/**
 * Where this module's classes plug into area targeting, heightening and recharging.
 *
 * Every one of these used to be called by name from inside the targeting code. They are the same calls,
 * in the same order, made through the registries instead — so the targeting code knows nothing about
 * Saints, Soulbound or the Sky, and could be lifted out whole.
 */
export const AREA_STEP = {
    // Before anything is asked or aimed.
    duplicate: 10,
    astralBody: 20,
    // After a placement is aimed.
    astralProjection: 10,
    // After the targets are set, while the area still exists.
    crystalWall: 10,
    lingering: 20,
    overlap: 30,
    deaths: 40,
};

export function registerAreaExtensions() {
    // This module's content authors its area config, its recharge periods and its shape choices under its
    // own flags. The automation reads its own namespace first and then every registered one.
    registerFlagScope(MODULE_ID);

    // The Stargazer's rewinds count their own uses on their own clock; their pf2e frequency is a label, and
    // the automation's guard would otherwise refuse a rewind the class still allows.
    FrequencyGuard.exempt("unmake-the-moment");
    FrequencyGuard.exempt("rewrite-the-ending");

    // Gemini's duplicate has the Saint's statistics but none of their Techniques. Every cast passes through
    // the targeting choke point, so it is the honest place to say no.
    AreaTargeting.registerPreAim("the Gemini duplicate", AREA_STEP.duplicate, (spell) => {
        if (!Duplicate.isDuplicate(spell?.actor)) return true;
        ui.notifications.warn(`${spell.actor.name} is a duplicate: no Techniques, no Focus Points.`);
        return false;
    });
    // An astral body "cannot attack"; it is a projected consciousness, not a second Saint. Same choke
    // point, same argument as the duplicate above.
    AreaTargeting.registerPreAim("the astral body", AREA_STEP.astralBody, (spell) => {
        if (!Astral.isAstralBody(spell?.actor?.token)) return true;
        ui.notifications.warn(`${spell.actor.name} is an astral body: it can only carry mental Techniques.`);
        return false;
    });

    // A Saint who is projecting casts their *mental* Techniques from the astral body instead — "using its
    // position as the origin".
    AreaTargeting.registerOriginResolver("astral projection", AREA_STEP.astralProjection, (actor, item) =>
        Astral.originFor(actor, item));

    // *Astral Projection* aims at a place, not at people. Reviewing a target list it will never have is a
    // dialog that can only say "nothing caught", so it is skipped and the placement goes straight to the
    // body being made.
    AreaTargeting.registerAimed("astral projection", AREA_STEP.astralProjection, async (config, regions, originToken) => {
        if (!config.item.flags?.[MODULE_ID]?.astral) return undefined;
        canvas.tokens.setTargets([]);
        return !!(await Astral.project(config, regions[0], originToken));
    });

    // A Technique that raises a barrier builds it from the line just aimed — the last one aimed, so a
    // re-aimed wall stands where the caster finally pointed it.
    AreaTargeting.registerAfterAim("the Crystal Wall", AREA_STEP.crystalWall, (config, regions) =>
        CrystalWall.build(config, regions[0]));
    // Two Techniques leave the area behind them — Gemini folds space into difficult terrain, and Mavros
    // sets the ground alight.
    AreaTargeting.registerAfterAim("lingering areas", AREA_STEP.lingering, (config, regions, originToken) =>
        Lingering.create(config, regions, originToken));
    // Three pillars catching the same creature is one save at a penalty, not three saves.
    AreaTargeting.registerAfterAim("overlapping areas", AREA_STEP.overlap, (config, regions, originToken) =>
        Overlap.apply(config, regions, originToken));
    // And one asks the ground a question about the past.
    AreaTargeting.registerAfterAim("the death register", AREA_STEP.deaths, (config, regions) =>
        Deaths.tally(config, regions[0]));

    AreaTargeting.registerScopePredicate("techniques", isTechnique);
    AreaTargeting.registerAreaCount((cast, options) => Charges.areaCount(cast, options));

    // A lit sky heightens the whole Technique, not just its dice: the burst, the wall and the range grow
    // on an Ascendant day as well as the damage.
    registerStepProvider("the sky", skyStepsFromOptions);

    // A Zenith day is our own unit of time; only the sky tracker knows when one turns over.
    Hooks.on(`${MODULE_ID}.skyChanged`, (state, previous) => {
        if (state?.day === previous?.day) return;
        return Recharge.refillPeriod("zenith-day");
    });
}

import { MODULE_ID } from "../sky/signs.mjs";
import { applyHeightening, applyThresholds } from "./heightening.mjs";

/** The effect-area shapes pf2e knows how to build a Region from (`EFFECT_AREA_SHAPES`). */
export const AREA_SHAPES = ["burst", "cone", "cube", "cylinder", "emanation", "line", "ring", "square"];

/** Borrowed verbatim from the Aura rule element, so the words mean the same thing they do there. */
export const AFFECTS = ["all", "allies", "enemies"];

export const FLAG = "areaTargeting";

/**
 * Read a Technique's targeting rule.
 *
 * Two kinds of item reach this. Most carry a real `system.area` — the cones, bursts, lines and emanations
 * — and the flag only says *who* the area catches. The rest are the Techniques whose target line reads
 * "any creatures within 30 feet": the system has no area for those, so the flag supplies a synthetic one
 * anchored on the caster. Either way the caller gets the same shape back and does not care which it was.
 *
 * Returns null when this item should cast the ordinary way.
 */
export function configFor(item) {
    if (!item?.actor || !canvas?.ready) return null;
    if (!game.settings.get(MODULE_ID, "areaTargeting")) return null;

    const flag = item.flags?.[MODULE_ID]?.[FLAG] ?? null;
    if (flag?.enabled === false) return null;

    // A synthetic area is opt-in by definition; a real one is opt-out.
    const area = flag?.area ?? item.system?.area ?? null;
    const hasArea = !!area?.type && !!Number(area.value);
    if (hasArea && !AREA_SHAPES.includes(area.type)) {
        console.warn(`Isaac's Homebrew | ${item.name}: unknown area shape "${area.type}"`);
        return null;
    }
    // A Technique with no area can still have something to say: "one creature, and two at 20th level" is a
    // target count and a range, and both grow. Those are checked against the targets the player has already
    // picked rather than by making them aim an emanation at themselves, which for one creature is worse
    // than clicking it.
    if (!hasArea && !flag?.maxTargets && !flag?.range) return null;

    // The module ships homebrew content; it should not quietly take over every wizard's fireball unless the
    // GM asks it to. An item carrying the flag is ours by definition and always aims — the setting governs
    // the items that were never written with this in mind.
    const authored = !!flag;
    if (!authored && game.settings.get(MODULE_ID, "areaTargetingScope") === "techniques" && !isTechnique(item)) {
        return null;
    }

    // Growth per heightening step. The item arriving here is already the heightened variant — `variantFor`
    // loads it so the burst is the right size — so the cast rank is simply its rank.
    const grown = applyHeightening(
        {
            maxTargets: flag?.maxTargets,
            range: flag?.range,
            areas: flag?.areas,
            length: flag?.length,
        },
        flag?.heightening,
        { baseRank: item.baseRank ?? item.system?.level?.value, castRank: item.rank },
    );
    applyThresholds(grown, flag?.heightening, item.actor?.level);

    return {
        item,
        area: hasArea ? { type: area.type, value: Number(area.value) } : null,
        synthetic: !item.system?.area,
        affects: AFFECTS.includes(flag?.affects) ? flag.affects : "all",
        includesSelf: flag?.includesSelf === true,
        includesNeutral: flag?.includesNeutral === true,
        requireLineOfEffect: flag?.requireLineOfEffect !== false,
        predicate: Array.isArray(flag?.predicate) ? flag.predicate : [],
        // An emanation has nowhere to go but the caster and so is never placed; everything else is aimed,
        // including a cone or a line, whose apex pf2e already snaps to the edge of a space for you.
        anchor: area.type === "emanation" ? "self" : "free",
        maxTargets: grown.maxTargets,
        range: grown.range,
        areas: grown.areas,
        length: grown.length,
        steps: grown.steps,
    };
}

export function isTechnique(item) {
    return item?.type === "spell" && (item.system?.traits?.value ?? []).includes("cosmo");
}

/**
 * The caster's token, which a self-anchored area is built on and which every line of effect is drawn from.
 * Prefers the controlled token so a GM moving two copies of the same actor gets the one they are holding.
 */
export function originTokenFor(actor) {
    const tokens = actor?.getActiveTokens?.(true, false) ?? [];
    return tokens.find((token) => token.controlled) ?? tokens[0] ?? null;
}

/** A human-readable description of the rule, for the placement notification and the review dialog. */
export function describe(config) {
    const who = { all: "every creature", allies: "allies only", enemies: "enemies only" }[config.affects];
    const extra = [];
    if (!config.area) {
        const bits = [];
        if (config.maxTargets > 0) bits.push(`up to ${config.maxTargets} target${config.maxTargets === 1 ? "" : "s"}`);
        if (config.range > 0) bits.push(`within ${config.range} ft`);
        return bits.join(", ") || who;
    }
    const shape = config.area.type;
    const size = `${config.area.value} ft`;
    if (config.includesSelf) extra.push("including you");
    if (config.predicate.length > 0) extra.push("filtered");
    if (config.areas > 1) extra.push(`${config.areas} placements`);
    if (config.maxTargets > 0) extra.push(`up to ${config.maxTargets}`);
    if (config.range > 0) extra.push(`within ${config.range} ft`);
    return `${size} ${shape} — ${who}${extra.length ? ` (${extra.join(", ")})` : ""}`;
}

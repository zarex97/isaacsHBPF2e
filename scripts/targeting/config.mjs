import { MODULE_ID } from "../sky/signs.mjs";

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
    if (!area?.type || !Number(area.value)) return null;
    if (!AREA_SHAPES.includes(area.type)) {
        console.warn(`Isaac's Homebrew | ${item.name}: unknown area shape "${area.type}"`);
        return null;
    }

    // The module ships homebrew content; it should not quietly take over every wizard's fireball unless
    // the GM asks it to.
    if (game.settings.get(MODULE_ID, "areaTargetingScope") === "techniques" && !isTechnique(item)) {
        return null;
    }

    return {
        item,
        area: { type: area.type, value: Number(area.value) },
        synthetic: !item.system?.area,
        affects: AFFECTS.includes(flag?.affects) ? flag.affects : "all",
        includesSelf: flag?.includesSelf === true,
        includesNeutral: flag?.includesNeutral === true,
        requireLineOfEffect: flag?.requireLineOfEffect !== false,
        predicate: Array.isArray(flag?.predicate) ? flag.predicate : [],
        // An emanation has nowhere to go but the caster; everything else is placed unless told otherwise.
        anchor: flag?.anchor ?? (area.type === "emanation" ? "self" : "free"),
        maxTargets: Number(flag?.maxTargets) || 0,
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
    const shape = config.area.type;
    const size = `${config.area.value} ft`;
    const who = { all: "every creature", allies: "allies only", enemies: "enemies only" }[config.affects];
    const extra = [];
    if (config.includesSelf) extra.push("including you");
    if (config.predicate.length > 0) extra.push("filtered");
    return `${size} ${shape} — ${who}${extra.length ? ` (${extra.join(", ")})` : ""}`;
}

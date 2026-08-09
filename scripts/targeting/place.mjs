import { MODULE_ID } from "../sky/signs.mjs";
import { FLAG } from "./config.mjs";

const TOOLBELT_ID = "pf2e-toolbelt";

/**
 * Put the Technique's area on the board and let the caster aim it.
 *
 * Foundry v14 already does the hard part: `canvas.regions.placeRegion` shows a preview that follows the
 * cursor, rotates on the wheel, confirms on left-click and cancels on Esc, and pf2e already overrides its
 * snapping per area shape (`RegionLayerPF2e#placeRegion` keys off `displayMeasurements` + coverage
 * highlighting, both of which the data below sets).
 *
 * It is placed with `create: false`, which returns the preview document instead of saving it. That is not
 * an optimisation — the area is discarded a moment later either way, so nothing is lost, and it buys three
 * things: creating a Region needs the `REGION_CREATE` permission that an ordinary player may not have,
 * a non-GM cannot create one at all while the game is paused, and an unsaved document cannot be left
 * behind by an error. A document that was never written also never fires `createRegion`, so the toolbelt's
 * template popup stays out of the way without depending on it honouring a flag.
 *
 * Returns the aimed Region, or null if the caster backed out.
 */
export async function placeArea(config, originToken) {
    const shape = shapeFromArea(config.area, originToken, canvas.mousePosition);
    if (!shape) {
        if (config.area.type === "emanation") {
            ui.notifications.warn(`${config.item.name} needs a token on the scene to originate from.`);
        }
        return null;
    }

    // An emanation has nowhere to be placed: it is centred on the caster's own space, so asking for a
    // click that can only land in one place is a click for nothing.
    if (config.anchor === "self") {
        return [new CONFIG.Region.documentClass(regionData(config, shape), { parent: canvas.scene })];
    }

    // Several placements, one after another. *Lightning Crown* is three 5-foot squares and gains more per
    // heightening step, which is why it was excluded from area targeting until now: one Region cannot be
    // three areas, but `placeRegions` aims a list of them in turn.
    const count = Math.max(1, config.areas ?? 1);
    if (count > 1) {
        const data = Array.from({ length: count }, () => regionData(config, shape));
        const placed = await canvas.regions.placeRegions(data, { create: false });
        return placed?.length ? placed : null;
    }

    const region = await canvas.regions.placeRegion(regionData(config, shape), { create: false });
    return region ? [region] : null;
}

/**
 * Where an aimed area actually landed, for the range check.
 *
 * The same three shapes `catch.mjs` reads an origin from, and for the same reason: a polygon keeps its
 * origin, an emanation keeps its base, and everything else is at its own coordinates.
 */
export function originOf(region) {
    const shape = region?.shapes?.at?.(0);
    if (!shape) return null;
    if (shape.origin) return shape.origin;
    if (shape.base) return { x: shape.base.x, y: shape.base.y };
    return Number.isFinite(shape.x) && Number.isFinite(shape.y) ? { x: shape.x, y: shape.y } : null;
}

function regionData(config, shape) {
    const { item } = config;
    const origin = typeof item.getOriginData === "function" ? item.getOriginData() : {};
    return {
        name: item.name,
        shapes: [shape],
        color: game.user.color.toString(),
        highlightMode: "coverage",
        displayMeasurements: true,
        visibility: CONST.REGION_VISIBILITY.ALWAYS,
        ownership: { [game.user.id]: CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER },
        flags: {
            // Belt and braces: nothing is created, so the toolbelt's `createRegion` hook cannot fire — but
            // if this ever does get saved, `targetHelper.skip` is its documented third-party opt-out and
            // stops it asking the same question a second time.
            [TOOLBELT_ID]: { targetHelper: { skip: true } },
            [MODULE_ID]: { [FLAG]: { transient: true } },
            pf2e: {
                areaShape: config.area.type,
                origin: {
                    name: item.name,
                    slug: item.slug,
                    traits: foundry.utils.deepClone(item.system?.traits?.value ?? []),
                    ...origin,
                },
            },
        },
    };
}

/**
 * The same construction pf2e uses in `shapeDataFromEffectArea` (`src/module/canvas/helpers.ts`), repeated
 * here because a module cannot import the system's internals. Kept deliberately close to the original so
 * a synthetic area and a real one produce identical geometry.
 */
export function shapeFromArea(area, originToken, point) {
    const distance = (area.value / 5) * canvas.grid.size;
    const { x, y } = point ?? canvas.mousePosition;
    switch (area.type) {
        case "burst":
        case "cylinder":
            return { type: "circle", radius: distance, x, y };
        case "cone":
            return { type: "cone", angle: 90, radius: distance, x, y };
        case "cube":
        case "square":
            return { type: "rectangle", width: distance, height: distance, x, y };
        case "emanation": {
            const source = originToken?.document?._source;
            if (!source) return null;
            const base = {
                type: "token",
                x: source.x,
                y: source.y,
                width: source.width,
                height: source.height,
                shape: source.shape,
            };
            return { type: "emanation", radius: distance, base, x: source.x, y: source.y };
        }
        case "line":
            return { type: "line", length: distance, width: canvas.dimensions.size, x, y };
        case "ring": {
            const width = Math.floor(canvas.dimensions.size * 0.5);
            return { type: "ring", radius: distance, innerWidth: width, outerWidth: width, x, y };
        }
        default:
            return null;
    }
}

/**
 * Remove a region this module put down.
 *
 * With `create: false` there is normally nothing to remove — the aimed area was never written to the
 * scene. This exists for the case where one somehow was, and it checks both that the document is really
 * embedded and that the flag says it is ours, so a region a GM placed by hand is never deleted.
 */
export async function discardArea(regions) {
    for (const region of [regions].flat().filter((r) => r)) {
        if (!region.id || !region.parent?.regions?.has(region.id)) continue;
        if (region.flags?.[MODULE_ID]?.[FLAG]?.transient !== true) continue;
        await region.delete();
    }
}

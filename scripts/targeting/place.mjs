import { MODULE_ID } from "../sky/signs.mjs";
import { FLAG } from "./config.mjs";

const TOOLBELT_ID = "pf2e-toolbelt";

/**
 * Put the Technique's area on the board and let the caster aim it.
 *
 * Foundry v14 already does the hard part: `canvas.regions.placeRegion` shows a preview that follows the
 * cursor, rotates on the wheel, confirms on left-click and cancels on Esc, and pf2e already overrides its
 * snapping per area shape (`RegionLayerPF2e#placeRegion`). So for an ordinary placed area we call the
 * system's own `SpellPF2e#placeTemplate`, which builds the shape, the coverage highlight and the
 * `pf2e.areaShape` / `pf2e.origin` flags exactly the way the chat card's *Place a Template* button does.
 * We only add two flags of our own on the way past.
 *
 * Returns the created Region, or null if the caster backed out.
 */
export async function placeArea(config, originToken) {
    const { item } = config;

    // `flags.pf2e-toolbelt.targetHelper.skip` is the module's own documented opt-out for third parties
    // creating a region: without it, the toolbelt's template popup would open on top of our review dialog
    // and ask the same question twice. `transient` marks the region ours, so cleanup never touches a
    // region a GM placed by hand.
    const ours = {
        [TOOLBELT_ID]: { targetHelper: { skip: true } },
        [MODULE_ID]: { [FLAG]: { transient: true } },
    };

    if (config.anchor === "self") {
        return createAnchoredRegion(config, originToken, ours);
    }

    if (!config.synthetic && typeof item.placeTemplate === "function") {
        const stamp = Hooks.on("preCreateRegion", (region) => region.updateSource({ flags: ours }));
        try {
            return await item.placeTemplate();
        } finally {
            Hooks.off("preCreateRegion", stamp);
        }
    }

    const shape = shapeFromArea(config.area, originToken, canvas.mousePosition);
    if (!shape) return null;
    return canvas.regions.placeRegion(regionData(config, shape, ours), {
        create: true,
        // Self-anchored cones and lines still rotate freely, but their origin stays in the caster's space.
        onMove: ({ position }) => {
            if (config.anchor !== "self" || !originToken) return;
            position.x = originToken.center.x;
            position.y = originToken.center.y;
        },
    });
}

/**
 * An area that originates from the caster has nowhere to be placed, so it is created outright rather than
 * asking for a click that can only land in one spot.
 */
async function createAnchoredRegion(config, originToken, ours) {
    if (!originToken) {
        ui.notifications.warn(`${config.item.name} needs a token on the scene to originate from.`);
        return null;
    }
    const shape = shapeFromArea(config.area, originToken, originToken.center);
    if (!shape) return null;
    const [region] = await canvas.scene.createEmbeddedDocuments("Region", [
        regionData(config, shape, ours),
    ]);
    return region ?? null;
}

function regionData(config, shape, ours) {
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
            ...ours,
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

/** Remove a region this module put down. Never touches one it did not place. */
export async function discardArea(region) {
    if (!region?.parent) return;
    if (region.flags?.[MODULE_ID]?.[FLAG]?.transient !== true) return;
    await region.delete();
}

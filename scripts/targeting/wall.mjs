import { MODULE_ID } from "../sky/signs.mjs";

export const FLAG = "wall";

/**
 * Aries' *Crystal Wall*, as an actual wall.
 *
 * "A barrier of solidified cosmo 15 feet long and 10 feet high… it blocks line of effect. It has AC 10,
 * Hardness equal to your level, and Hit Points equal to four times your level." Every one of those is
 * something Foundry or pf2e already models — the barrier is a `Wall` document, and the hit points are a
 * hazard actor — so the only thing missing was something to build them.
 *
 * Both halves carry a module flag and are torn down together, so nothing is ever deleted that this did not
 * place, and a destroyed wall does not leave an invisible barrier behind.
 */
export const CrystalWall = {
    /** Build from the line the caster just aimed. Returns the hazard, or null if nothing was built. */
    async build(config, region) {
        const spec = config.item?.flags?.[MODULE_ID]?.[FLAG];
        if (!spec || !canvas?.ready) return null;
        if (game.users.activeGM?.id !== game.user.id) {
            // Only a GM may write scene geometry. A player casting this gets the wall from the GM's client
            // through the same relay everything else uses.
            return null;
        }

        const points = endpointsOf(region, config);
        if (!points) return null;

        const level = config.item.actor?.level ?? 1;
        const wallData = {
            c: [points.a.x, points.a.y, points.b.x, points.b.y],
            move: CONST.WALL_MOVEMENT_TYPES.NORMAL,
            sight: CONST.WALL_SENSE_TYPES.NORMAL,
            sound: CONST.WALL_SENSE_TYPES.NORMAL,
            light: CONST.WALL_SENSE_TYPES.NORMAL,
            flags: { [MODULE_ID]: { [FLAG]: { origin: config.item.actor?.uuid ?? null } } },
        };

        const [wall] = await canvas.scene.createEmbeddedDocuments("Wall", [wallData]);
        if (!wall) return null;

        const hazard = await createHazard(spec, level, points, wall.id, config);
        if (!hazard) {
            // A barrier with no hit points cannot be destroyed, which is worse than not having one.
            await canvas.scene.deleteEmbeddedDocuments("Wall", [wall.id]);
            return null;
        }
        return hazard;
    },

    /** Tear down a wall and its hazard together, whichever of the two was noticed first. */
    async destroy(hazard) {
        const spec = hazard?.flags?.[MODULE_ID]?.[FLAG];
        if (!spec) return;
        const scene = game.scenes.get(spec.sceneId) ?? canvas?.scene;
        if (spec.wallId && scene?.walls.has(spec.wallId)) {
            await scene.deleteEmbeddedDocuments("Wall", [spec.wallId]);
        }
        for (const token of hazard.getActiveTokens(true, true) ?? []) {
            if (token.parent?.tokens.has(token.id)) {
                await token.parent.deleteEmbeddedDocuments("Token", [token.id]);
            }
        }
        if (hazard.id && game.actors.has(hazard.id)) await hazard.delete();
    },

    /** A wall whose hazard has been reduced to 0 Hit Points is a wall that is gone. */
    registerHooks() {
        Hooks.on("updateActor", async (actor) => {
            if (game.users.activeGM?.id !== game.user.id) return;
            if (!actor.flags?.[MODULE_ID]?.[FLAG]) return;
            if ((actor.hitPoints?.value ?? 1) > 0) return;
            await CrystalWall.destroy(actor);
        });
    },
};

/**
 * The two ends of the placed line, at the heightened length.
 *
 * The region's own shape carries where it was put and which way it points; the length comes from the
 * targeting config, because that is what grows per heightening step.
 */
function endpointsOf(region, config) {
    const shape = region?.shapes?.at?.(0);
    if (!shape || !Number.isFinite(shape.x) || !Number.isFinite(shape.y)) return null;

    const feet = Number(config.length) || Number(config.area?.value) || 0;
    if (feet <= 0) return null;
    const pixels = (feet / 5) * canvas.grid.size;
    const radians = Math.toRadians(Number(shape.rotation) || 0);

    return {
        a: { x: shape.x, y: shape.y },
        b: { x: shape.x + Math.cos(radians) * pixels, y: shape.y + Math.sin(radians) * pixels },
    };
}

/**
 * The hit points, as a hazard.
 *
 * Making it a real actor rather than a note is what lets the wall be attacked with the system's own rules
 * — and it is why Capricorn's Hardness bypass works on it with no extra code, since that reads the target's
 * Hardness like any other.
 */
async function createHazard(spec, level, points, wallId, config) {
    const hardness = level * (Number(spec.hardnessPerLevel) || 1);
    const hp = level * (Number(spec.hpPerLevel) || 4);
    const midpoint = { x: (points.a.x + points.b.x) / 2, y: (points.a.y + points.b.y) / 2 };

    try {
        const hazard = await Actor.create(
            {
                name: `${config.item.name} (${config.item.actor?.name ?? "Saint"})`,
                type: "hazard",
                img: config.item.img,
                system: {
                    attributes: {
                        ac: { value: Number(spec.ac) || 10 },
                        hardness,
                        hp: { value: hp, max: hp },
                    },
                    details: { level: { value: level }, isComplex: false },
                    traits: { value: [], rarity: "common" },
                },
                flags: { [MODULE_ID]: { [FLAG]: { wallId, sceneId: canvas.scene.id } } },
            },
            { renderSheet: false },
        );
        if (!hazard) return null;

        const token = await hazard.getTokenDocument({
            x: midpoint.x - canvas.grid.size / 2,
            y: midpoint.y - canvas.grid.size / 2,
            actorLink: true,
            name: config.item.name,
        });
        await canvas.scene.createEmbeddedDocuments("Token", [token.toObject()]);
        return hazard;
    } catch (error) {
        console.error("Isaac's Homebrew | could not raise the Crystal Wall's hazard", error);
        return null;
    }
}

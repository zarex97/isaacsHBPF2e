/**
 * Terrain that stands around you and moves with you.
 *
 * Guide §7B, Tiburón's Segunda Etapa: *"Water rises around you in a **20-foot emanation**, difficult
 * terrain for enemies."* Driven live, `Effect: Hirviendo` had `rules: []` — there was no water, no
 * emanation and no terrain, only a form that said there was.
 *
 * Neither of the module's two existing answers fits on its own:
 *
 *  - `Lingering` builds a Region with the enemies-only movement-cost behavior, but a lingering area is
 *    placed by a cast and expires; this one is a property of the form and lasts as long as it does.
 *  - `Modes.raiseArea` raises a Region centred on its bearer when a mode begins and takes it down when
 *    the mode ends — the right lifecycle, but it deliberately carries **no** behavior, because Senkei's
 *    cage is a drawn boundary rather than a rule.
 *
 * So this is the two halves put together, and one thing neither of them needs: a Region is a static
 * shape, and this one has to follow the creature it rises around. It is re-centred whenever their token
 * moves, which is the whole of "around you".
 *
 * Declared on the effect, the way `freesHands` and `attributeCaps` are:
 *
 *     "flags": { "isaacs-hb-pf2e": { "terrainAura": {
 *         "affects": "enemies", "cost": 2, "value": 20 } } }
 */
import { shapeFromArea } from "../targeting/place.mjs";

const MODULE_ID = "isaacs-hb-pf2e";
const FLAG = "terrainAura";
const TERRAIN_TYPE = `${MODULE_ID}.enemyMovementCost`;

export const TerrainAura = {
    registerHooks() {
        Hooks.on("createItem", (item) => TerrainAura.onItemChanged(item));
        Hooks.on("deleteItem", (item) => TerrainAura.onItemChanged(item));
        // The half `Modes.raiseArea` never needed: Senkei's cage is drawn once around a caster who is
        // standing in it, and this one is water that comes with you.
        Hooks.on("updateToken", (token, changed) => {
            if (changed?.x === undefined && changed?.y === undefined) return;
            TerrainAura.reconcile(token.actor);
        });
    },

    onItemChanged(item) {
        if (item?.type !== "effect" || !item.actor) return;
        if (!item.flags?.[MODULE_ID]?.[FLAG] && !TerrainAura.regionsFor(item.actor).length) return;
        TerrainAura.reconcile(item.actor);
    },

    /** What this actor's effects say they should be standing in. */
    declaredOn(actor) {
        for (const effect of actor?.itemTypes?.effect ?? []) {
            const declared = effect.flags?.[MODULE_ID]?.[FLAG];
            if (declared?.value) return { ...declared, name: effect.name };
        }
        return null;
    },

    regionsFor(actor) {
        return (canvas?.scene?.regions ?? []).filter(
            (region) => region.flags?.[MODULE_ID]?.[FLAG]?.actor === actor?.uuid,
        );
    },

    /**
     * One region, in the right place, or none.
     *
     * Runs on the GM's client alone: five players reconciling the same aura is five Regions, and the
     * same argument the charge refresh and the lingering sweep already make.
     */
    async reconcile(actor) {
        if (!actor || !canvas?.ready || game.users?.activeGM?.id !== game.user?.id) return;

        const declared = TerrainAura.declaredOn(actor);
        const token = actor.getActiveTokens?.(true, false)?.at(0);
        const onThisScene = token && canvas.scene?.id === token.document?.parent?.id;
        const existing = TerrainAura.regionsFor(actor);

        if (!declared || !onThisScene) {
            if (existing.length > 0) {
                await canvas.scene.deleteEmbeddedDocuments("Region", existing.map((r) => r.id));
            }
            return;
        }

        const shape = shapeFromArea({ type: "emanation", value: declared.value }, token, token.center);
        if (!shape) return;

        // Foundry's own movement-cost behavior has no notion of sides, so "difficult terrain **for
        // enemies**" needs the module's subclass — the same swap `Lingering` makes for a petal storm.
        const enemiesOnly = declared.affects === "enemies" && CONFIG.RegionBehavior.dataModels[TERRAIN_TYPE];
        const model = CONFIG.RegionBehavior.dataModels.modifyMovementCost;
        const actions = Object.keys(model?.schema?.fields?.difficulties?.fields ?? {});
        if (actions.length === 0) return;
        const cost = Number(declared.cost) || 2;

        const data = {
            name: `${declared.name} — ${declared.value}-foot water`,
            shapes: [shape],
            color: "#3aa6c9",
            visibility: CONST.REGION_VISIBILITY.ALWAYS,
            behaviors: [{
                type: enemiesOnly ? TERRAIN_TYPE : "modifyMovementCost",
                name: enemiesOnly ? "Difficult terrain (enemies)" : "Difficult terrain",
                system: { difficulties: Object.fromEntries(actions.map((action) => [action, cost])) },
            }],
            flags: {
                [MODULE_ID]: { [FLAG]: { actor: actor.uuid, originUuid: actor.uuid } },
                pf2e: { areaShape: "emanation" },
            },
        };

        // Moved rather than replaced where one already stands: deleting and recreating a Region every
        // step makes the board flicker and loses the behavior's own state mid-movement.
        const [first, ...extra] = existing;
        if (extra.length > 0) {
            await canvas.scene.deleteEmbeddedDocuments("Region", extra.map((r) => r.id));
        }
        if (first) {
            await first.update({ shapes: [shape] });
            return;
        }
        await canvas.scene.createEmbeddedDocuments("Region", [data]);
    },
};

import { conditionUuidOf } from "./riders/apply.mjs";
import { MODULE_ID } from "./sky/signs.mjs";
import { originOf } from "./targeting/place.mjs";

export const FLAG = "astral";

/** Actors whose hit points just dropped, noticed in `preUpdateActor` and acted on in `updateActor`. */
const struck = new Set();

const EFFECT_NAME = "Effect: Astral Projection";
const BODY_NAME = "Effect: Astral Body";
const EFFECTS_PACK = `${MODULE_ID}.saint-effects`;

/**
 * A packed effect, by the name it is authored under.
 *
 * The content refers to effects by name and the build rewrites those to ids on the way into the pack, so a
 * `@UUID[…Item.Effect: X]` in a JSON file resolves. Code gets no such pass: `fromUuid` on a name-shaped
 * compendium uuid returns null, silently, and the feature that needed the effect simply does nothing. So
 * the lookup goes through the pack index, which is what the build was rewriting against anyway.
 */
async function packedEffect(name) {
    const pack = game.packs.get(EFFECTS_PACK);
    const entry = pack ? (await pack.getIndex()).find((e) => e.name === name) : null;
    if (!entry) {
        console.warn(`Isaac's Homebrew | ${EFFECTS_PACK} has no "${name}"`);
        return null;
    }
    return pack.getDocument(entry._id);
}

/**
 * *Astral Projection* — Gemini's second Technique, and until now eight sentences of prose with `rules: []`.
 *
 * *"Project your consciousness into an astral body anywhere within 200 feet that you can see or have
 * visited. For up to 10 minutes you perceive and speak through it. It is invisible to creatures without
 * Sixth Sense or see invisibility, cannot be damaged or physically interacted with, and cannot attack — but
 * you may cast mental Techniques through it, using its position as the origin. Your body is unconscious and
 * off-guard; damage to it ends the effect and leaves you stunned 1."*
 *
 * Every clause of that is a thing Foundry can be made to do, and each is done where it belongs:
 *
 *  - **The body is a token**, not an effect, for the same reason Gemini's duplicate is: it has a position,
 *    and a position is the whole point. It is unlinked, so it carries its own copy of the actor and nothing
 *    that happens to it reaches the Saint's sheet.
 *  - **Invisible and untouchable** are the body's own effect: the `invisible` condition, and resistance
 *    `all-damage` at a value nothing reaches. pf2e has no "immune to all damage" — its immunity list has no
 *    such entry — so an unreachable resistance is the honest expression of "cannot be damaged".
 *  - **Unconscious and off-guard** are granted rather than written, through the same `sourceId` path that
 *    §4.2 of the programme document exists about: `ConditionManager.getCondition` hands back a temporary
 *    document whose `uuid` is null, so a `GrantItem` pointed at `uuid` grants nothing at all.
 *  - **Damage ends it.** This cannot be a `damage-applied` rider: that event collects riders from the
 *    *attacker*, and the effect is on the person being hit. So the Saint's hit points are watched directly.
 *  - **Mental Techniques originate from the body**, which `originTokenFor` answers by preferring the astral
 *    token when the Technique carries the mental trait.
 *
 * The one thing left to the table is what the astral body can see, because Foundry's vision is a property
 * of the token and the Saint's player already controls it — they look through it by selecting it.
 */
export const Astral = {
    registerHooks() {
        // The body is the effect's shadow: however the effect goes — expiry, a dispel, a GM deleting it —
        // the token goes with it. One listener covers all three, which no per-cast timer would.
        Hooks.on("deleteItem", (item) => Astral.onEffectGone(item));
        Hooks.on("deleteCombat", () => Astral.clearAll());

        // Two halves of one question, because neither hook can answer it alone: by `updateActor` the old
        // hit points are gone, and `preUpdateActor` is too early to be creating and deleting documents.
        Hooks.on("preUpdateActor", (actor, changes) => {
            const next = changes?.system?.attributes?.hp?.value;
            if (typeof next !== "number") return;
            if (next >= (actor.system?.attributes?.hp?.value ?? next)) return;
            if (Astral.effectOn(actor)) struck.add(actor.id);
        });
        Hooks.on("updateActor", (actor) => {
            if (struck.delete(actor.id)) return Astral.endProjection(actor);
        });
    },

    /** Is this actor currently projecting? */
    effectOn(actor) {
        return actor?.itemTypes?.effect?.find((effect) => effect.flags?.[MODULE_ID]?.[FLAG]?.projection) ?? null;
    },

    /** A token this module spawned as somebody's astral body. */
    isAstralBody(tokenDocument) {
        return tokenDocument?.flags?.[MODULE_ID]?.[FLAG]?.body === true;
    },

    /**
     * The token a Technique should originate from.
     *
     * "You may cast mental Techniques through it, using its position as the origin" is a range and a line
     * of effect measured from somewhere else, which is exactly what `originTokenFor` decides.
     */
    originFor(actor, item) {
        if (!item?.system?.traits?.value?.includes?.("mental")) return null;
        if (!Astral.effectOn(actor)) return null;
        return (actor.getActiveTokens?.(false, false) ?? []).find((token) => Astral.isAstralBody(token.document))
            ?? null;
    },

    /**
     * Project. Called from `AreaTargeting.run` beside `CrystalWall.build`, because both need the placement
     * the caster confirmed rather than a second one of their own.
     */
    async project(config, region, originToken) {
        const actor = config.item?.actor;
        const scene = canvas?.scene;
        if (!actor || !scene || !originToken) return null;

        if (Astral.effectOn(actor)) {
            ui.notifications.warn(`${actor.name} is already projecting.`);
            return null;
        }

        const spec = config.item.flags?.[MODULE_ID]?.[FLAG] ?? {};
        const steps = config.steps ?? 0;
        const minutes = (Number(spec.minutes) || 10) + (Number(spec.minutesPerStep) || 0) * steps;

        const point = originOf(region);
        if (!Number.isFinite(point?.x) || !Number.isFinite(point?.y)) {
            ui.notifications.warn(`${config.item.name}: could not read where the astral body should stand.`);
            return null;
        }

        const body = await Astral.spawnBody(actor, originToken, point);
        if (!body) return null;

        const effect = await Astral.applyProjection(actor, {
            minutes,
            bodyUuid: body.uuid,
            itemUuid: config.item.uuid,
        });
        if (!effect) {
            await body.delete();
            return null;
        }
        await Astral.detachBody(body, effect);

        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content:
                `<p><strong>${actor.name}</strong> projects an astral body for ${minutes} minutes. `
                + `Their own body is unconscious and off-guard until it returns.</p>`,
        });
        return body;
    },

    /** The body itself: the Saint's token, standing where they aimed, invisible and unreachable. */
    async spawnBody(actor, originToken, point) {
        const grid = canvas.grid;
        const snapped = canvas.grid.getSnappedPoint(
            { x: point.x - (originToken.document.width * grid.sizeX) / 2, y: point.y - (originToken.document.height * grid.sizeY) / 2 },
            { mode: CONST.GRID_SNAPPING_MODES.TOP_LEFT_CORNER ?? 1, resolution: 1 },
        );

        const document = await actor.getTokenDocument({
            x: snapped.x,
            y: snapped.y,
            name: `${originToken.document.name} (Astral)`,
            actorLink: false,
            disposition: originToken.document.disposition,
            alpha: 0.5,
            flags: { [MODULE_ID]: { [FLAG]: { body: true, origin: actor.uuid } } },
        });

        const [created] = await canvas.scene.createEmbeddedDocuments("Token", [document.toObject()]);
        if (!created?.actor) return null;

        const source = (await packedEffect(BODY_NAME))?.toObject();
        if (source) {
            // "Invisible to creatures without a sixth sense" is pf2e's `invisible`, granted the same way
            // every durationed condition in this module is — through `sourceId`, never `uuid`.
            const invisible = conditionUuidOf(game.pf2e.ConditionManager.getCondition("invisible"));
            if (invisible) {
                source.system.rules = [
                    ...(source.system.rules ?? []),
                    { key: "GrantItem", uuid: invisible, allowDuplicate: false },
                ];
            }
            await created.actor.createEmbeddedDocuments("Item", [source]);
        }
        // No Focus Points and no Techniques: `AreaTargeting.run` refuses a cast from an astral body the same
        // way it refuses one from Gemini's duplicate.
        if (created.actor.system?.resources?.focus) {
            await created.actor.update({ "system.resources.focus.value": 0 });
        }
        return created;
    },

    /** The Saint's half: unconscious, off-guard, and a timer. */
    async applyProjection(actor, { minutes, bodyUuid, itemUuid }) {
        const packed = await packedEffect(EFFECT_NAME);
        const source = packed?.toObject();
        if (!source) return null;

        const grants = ["unconscious", "off-guard"]
            .map((slug) => conditionUuidOf(game.pf2e.ConditionManager.getCondition(slug)))
            .filter(Boolean)
            .map((uuid) => ({ key: "GrantItem", uuid, allowDuplicate: false }));

        source.system.rules = [...(source.system.rules ?? []), ...grants];
        source.system.duration = { expiry: "turn-start", sustained: true, unit: "minutes", value: minutes };
        source.system.start = { value: game.time.worldTime, initiative: game.combat?.combatant?.initiative ?? null };
        source._stats = foundry.utils.mergeObject(source._stats ?? {}, { compendiumSource: packed.uuid });
        source.flags = foundry.utils.mergeObject(source.flags ?? {}, {
            [MODULE_ID]: { [FLAG]: { projection: true, bodyUuid, itemUuid } },
        });

        const [effect] = await actor.createEmbeddedDocuments("Item", [source]);
        return effect ?? null;
    },

    /**
     * Keep the Saint's unconsciousness out of the astral body.
     *
     * An unlinked token is not a snapshot. Foundry re-derives its actor from the *live* base actor on every
     * preparation and lays the delta over the top — so the moment the Saint is knocked unconscious by their
     * own Technique, the projected body slumps too, wearing the projection effect that created it. The body
     * came out unconscious, blinded, prone and off-guard, which is the exact opposite of a consciousness
     * that has gone somewhere else.
     *
     * Deleting the items from the token's own actor records the removal in the delta rather than touching
     * the Saint. The conditions go with the effect: `GrantItem` writes its children into
     * `flags.pf2e.itemGrants`, so they can be named without guessing at slugs.
     */
    async detachBody(body, effect) {
        const actor = body.actor;
        if (!actor) return;

        // Grants nest: the effect grants `unconscious`, and pf2e's `unconscious` grants `prone` in turn.
        // Taking only the effect's own children left the astral body lying down.
        const ids = new Set();
        const walk = (item) => {
            if (!item || ids.has(item.id)) return;
            ids.add(item.id);
            for (const grant of Object.values(item.flags?.pf2e?.itemGrants ?? {})) {
                walk(actor.items.get(grant.id) ?? effect.actor?.items.get(grant.id));
            }
        };
        walk(effect);

        const present = [...ids].filter((id) => actor.items.has(id));
        if (present.length > 0) await actor.deleteEmbeddedDocuments("Item", present);
    },

    /** However the projection ends, the body goes with it. */
    async onEffectGone(item) {
        if (game.users?.activeGM?.id !== game.user?.id) return;
        const bodyUuid = item?.flags?.[MODULE_ID]?.[FLAG]?.bodyUuid;
        if (!bodyUuid) return;
        // `detachBody` deletes that same effect from the body's own delta, and a delta deletion is a
        // `deleteItem` like any other. Without this the body dismissed itself the instant it was made.
        if (Astral.isAstralBody(item.actor?.token)) return;
        const body = await fromUuid(bodyUuid).catch(() => null);
        if (body?.documentName === "Token") await body.delete();
    },

    /**
     * "Damage to it ends the effect and leaves you stunned 1."
     *
     * Watched on the actor rather than written as a `damage-applied` rider, because that event gathers
     * riders from whoever *dealt* the damage — and the effect that has to notice is on the person who took
     * it. Any loss of hit points counts, which is the reading the text supports: the body is defenceless.
     */
    async endProjection(actor) {
        if (game.users?.activeGM?.id !== game.user?.id) return;
        const effect = Astral.effectOn(actor);
        if (!effect) return;

        await effect.delete();
        await actor.increaseCondition("stunned", { value: 1 });
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content:
                `<p><strong>${actor.name}</strong>'s body was struck while projecting. The astral body `
                + `dissolves and they return stunned 1.</p>`,
        });
    },

    /** Nothing should be left standing on the map once the fight is over. */
    async clearAll() {
        if (game.users?.activeGM?.id !== game.user?.id) return;
        for (const scene of game.scenes) {
            const stale = scene.tokens.filter((token) => Astral.isAstralBody(token));
            if (stale.length > 0) await scene.deleteEmbeddedDocuments("Token", stale.map((t) => t.id));
        }
    },
};

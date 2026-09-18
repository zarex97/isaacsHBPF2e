import { Reiatsu } from "./reiatsu.mjs";

const MODULE_ID = "isaacs-hb-pf2e";
const EFFECT = "Effect: Regeneración Suppressed";

/**
 * The two off-switches on a Hollow's Regeneración.
 *
 * > It is deactivated while you have the dying condition, and **suppressed until the end of your next
 * > turn whenever you take spirit damage or damage from a holy or vitality effect.** — guide §5.2
 *
 * The first half is a predicate and always worked. The second was a predicate too —
 * `{not: "self:effect:regeneracion-suppressed"}` — pointing at an effect **that did not exist and that
 * nothing applied**, so a Hollow's fast healing could never be switched off. The guide's own note calls
 * that clause the point of the Lineage:
 *
 * > That last clause is the point: Soul Reapers and Quincy exist to shut this down, and both can, from
 * > 1st level.
 *
 * What closes the switch depends on the character: **Segunda Piel** (15th) narrows it to spirit alone,
 * leaving holy and vitality unable to touch it. Types and traits are returned separately because `holy`
 * is a trait and `vitality` is a type — see `traitsOf`.
 */
export function suppressorsFor(options) {
    const segundaPiel = options.includes("feature:segunda-piel");
    return segundaPiel
        ? { types: ["spirit"], traits: [] }
        : { types: ["spirit", "vitality"], traits: ["holy"] };
}

/** The damage types in an application, whether it came as a roll or as a bare number. */
export function typesOf(damage) {
    if (!damage || typeof damage === "number") return [];
    const instances = damage.instances ?? [];
    return [...new Set(instances.map((instance) => instance.type).filter(Boolean))];
}

/**
 * The traits on whatever dealt the damage.
 *
 * **`holy` is not a damage type.** The remaster made it a *trait*: there is no `holy` in pf2e's
 * `DAMAGE_TYPES`, so `5[holy]` parses as untyped and a type check for it can never match. The guide's
 * wording is exact about this and was read too quickly here —
 *
 * > damage from a **holy or vitality effect**
 *
 * — `vitality` is a type and `holy` is a property of the effect. So both halves are asked separately:
 * the roll's types, and the traits pf2e hands `applyDamage` as `item:trait:holy` in `rollOptions`, with
 * the item's own traits as the fallback for a caller that passes the item but no options.
 */
export function traitsOf({ rollOptions, item } = {}) {
    const fromOptions = [...(rollOptions ?? [])]
        // `item:` and `origin:item:` only — never `self:`, which is the *target's* traits. A Hollow
        // that happened to be holy would otherwise suppress its own regeneration on every hit.
        .map((option) => /^(?:origin:)?item:trait:([a-z-]+)$/.exec(option)?.[1])
        .filter(Boolean);
    const fromItem = item?.system?.traits?.value ?? [];
    return [...new Set([...fromOptions, ...fromItem])];
}

export const Regeneracion = {
    /**
     * Called from the same `applyDamage` wrap the riders use, because the damage **type** only exists
     * there. By the time hit points have changed, all that is left is a number.
     */
    async onDamage(actor, params) {
        if (!game.user.isGM) return;
        if (!Reiatsu.isSoulbound(actor)) return;
        /**
         * Matched on a **tag**, not on a slug.
         *
         * The build's `sluggify` reduces anything outside `[a-z0-9]` to a separator, so "Regeneración"
         * becomes **`regeneraci-n`** — the same trap as SB-16, and this time in the module's own code:
         * a comparison against the ASCII spelling matched nothing, so the suppression could never fire.
         * An authored tag is ASCII by construction and, unlike an explicit slug, does not change the
         * document's derived id and break every existing character's link to it.
         */
        if (!actor.itemTypes.feat.some((f) =>
            (f.system?.traits?.otherTags ?? []).includes("soulbound-regeneracion"))) return;

        const suppressors = suppressorsFor(actor.getRollOptions?.() ?? []);
        const types = typesOf(params?.damage);
        const traits = traitsOf(params);
        const caught = types.some((type) => suppressors.types.includes(type))
            || traits.some((trait) => suppressors.traits.includes(trait));
        if (!caught) return;
        if (actor.itemTypes.effect.some((e) => e.name === EFFECT)) return;

        const pack = game.packs.get(`${MODULE_ID}.soulbound-effects`);
        const entry = pack ? (await pack.getIndex()).find((e) => e.name === EFFECT) : null;
        if (!entry) {
            console.warn(`Isaac's Homebrew | no "${EFFECT}" to suppress Regeneración with`);
            return;
        }
        const doc = await pack.getDocument(entry._id);
        await actor.createEmbeddedDocuments("Item", [foundry.utils.deepClone(doc.toObject())]);
        ui.notifications.info(`${actor.name}'s Regeneración is suppressed until the end of their next turn.`);
    },
};

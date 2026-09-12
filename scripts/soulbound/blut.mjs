import { Reiatsu } from "./reiatsu.mjs";

const MODULE_ID = "isaacs-hb-pf2e";
const EFFECTS_PACK = `${MODULE_ID}.soulbound-effects`;

/** The two forms, by the name each effect is authored under. */
const FORMS = {
    vene: "Effect: Blut Vene",
    arterie: "Effect: Blut Arterie",
};

/**
 * Blut — the Quincy's two reishi systems, and the fact that they are two.
 *
 * Canon is explicit that Blut Vene and Blut Arterie run on different systems and cannot be used at once,
 * and guide §5.3 keeps that: choosing one removes the other. The exclusivity is enforced here rather than
 * left to the player's memory, because two resistance effects stacking on a 10-Hit-Point class is exactly
 * the kind of mistake nobody notices until a boss fight goes strangely.
 *
 * **The one exception is authored, not coded.** Uryū's Letzt Stil (guide §7C) lets Vene and its own
 * Arterie-like clause run together. Rather than a branch here that names one Spirit, an actor carrying the
 * `soulbound:blut-both` roll option keeps whichever form is already on — so Phase 5 turns that exception on
 * by adding a RollOption to a Vollständig, and this file never learns Uryū's name.
 */
export const Blut = {
    /** Which form is active, or null. */
    active(actor) {
        for (const [form, name] of Object.entries(FORMS)) {
            if (actor?.itemTypes?.effect?.some((e) => e.name === name)) return form;
        }
        return null;
    },

    /** May both forms stand at once? Only where the content says so. */
    allowsBoth(actor) {
        return (actor?.getRollOptions?.(["all"]) ?? []).includes("soulbound:blut-both");
    },

    async set(actor, form) {
        if (!Reiatsu.isSoulbound(actor)) return;
        const wanted = FORMS[form];
        if (!wanted) return;

        if (!this.allowsBoth(actor)) {
            const others = actor.itemTypes.effect.filter(
                (e) => Object.values(FORMS).includes(e.name) && e.name !== wanted,
            );
            if (others.length > 0) {
                await actor.deleteEmbeddedDocuments("Item", others.map((e) => e.id));
            }
        }
        if (actor.itemTypes.effect.some((e) => e.name === wanted)) return;

        const pack = game.packs.get(EFFECTS_PACK);
        const entry = pack ? (await pack.getIndex()).find((e) => e.name === wanted) : null;
        if (!entry) {
            console.warn(`Isaac's Homebrew | ${EFFECTS_PACK} has no "${wanted}"`);
            return;
        }
        const doc = await pack.getDocument(entry._id);
        await actor.createEmbeddedDocuments("Item", [foundry.utils.deepClone(doc.toObject())]);
    },

    /** Both forms drop at the end of the encounter, like everything else metered per round. */
    registerHooks() {
        Hooks.on("deleteCombat", async (combat) => {
            if (!game.user.isGM) return;
            for (const combatant of combat.combatants) {
                const actor = combatant.actor;
                if (!Reiatsu.isSoulbound(actor)) continue;
                const held = actor.itemTypes.effect.filter((e) => Object.values(FORMS).includes(e.name));
                if (held.length > 0) {
                    await actor.deleteEmbeddedDocuments("Item", held.map((e) => e.id));
                }
            }
        });
    },
};

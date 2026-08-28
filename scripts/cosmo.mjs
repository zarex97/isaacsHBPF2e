import { MODULE_ID } from "./sky/signs.mjs";

const ENTRY_NAME = "Cosmo";

/** Entry creations already under way, keyed by actor id. See `ensureEntry`. */
const pendingEntries = new Map();

/** The write half of `ensureEntry`, kept separate so the guard above reads as one decision. */
async function createEntry(actor) {
    const tradition = game.settings.get(MODULE_ID, "cosmoTradition");
    const [created] = await actor.createEmbeddedDocuments("Item", [
        {
            name: ENTRY_NAME,
            type: "spellcastingEntry",
            img: "icons/magic/light/explosion-star-glow-orange.webp",
            system: {
                ability: { value: Cosmo.attributeFor(actor) },
                prepared: { value: "focus" },
                proficiency: { slug: "saint", value: 1 },
                showSlotlessLevels: { value: false },
                spelldc: { dc: 0, value: 0 },
                tradition: { value: tradition },
            },
            flags: { [MODULE_ID]: { cosmoEntry: true } },
        },
    ]);
    return created ?? null;
}

/**
 * Focus spellcasting for the Saint.
 *
 * This exists because of a real gap in the system, not for convenience. PF2e creates player spellcasting
 * entries only through the character sheet's UI (see the system's spellcasting-dialog), no pack ships a
 * player-type spellcastingEntry, and GrantItem has no logic for filing a granted spell into an entry. So a
 * homebrew focus caster whose Techniques are granted by rule elements ends up with a focus pool and a pile
 * of orphaned spells. Two small hooks close that:
 *
 *   1. When the Saint class lands on a character, create a focus entry called "Cosmo".
 *   2. When a cosmo-trait spell lands with no home, file it under that entry.
 *
 * The load-bearing detail is `system.proficiency.slug = "saint"`. That makes the entry resolve its spell
 * attack and DC through `actor.getStatistic("saint")` — the Cosmo DC — rather than through a spellcasting
 * proficiency the class deliberately does not have.
 */
export const Cosmo = {
    entryFor(actor) {
        return actor.itemTypes.spellcastingEntry.find(
            (entry) => entry.system.proficiency?.slug === "saint" || entry.name === ENTRY_NAME,
        );
    },

    isSaint(actor) {
        return actor?.type === "character" && actor.class?.system?.slug === "saint";
    },

    /** The key ability the Saint chose at 1st level; the entry's DC follows it. */
    attributeFor(actor) {
        return actor.classDCs?.saint?.attribute ?? actor.class?.system?.keyAbility?.selected ?? "str";
    },

    /**
     * One entry per Saint, even when several callers ask at once.
     *
     * `createItem` fires for the class *and* for every Technique granted alongside it, in the same batch.
     * Each of those calls `ensureEntry`, each finds no entry because none has been written yet, and each
     * creates one — so every Saint ever made came out of character creation with two identical "Cosmo"
     * entries, the second one empty. The check and the create have to be one indivisible step from the
     * caller's point of view, which is what parking the in-flight promise here achieves: the second caller
     * awaits the first one's entry instead of racing it.
     */
    async ensureEntry(actor) {
        if (!this.isSaint(actor)) return null;
        const existing = this.entryFor(actor);
        if (existing) return existing;

        const inFlight = pendingEntries.get(actor.id);
        if (inFlight) return inFlight;

        const creation = createEntry(actor);
        pendingEntries.set(actor.id, creation);
        try {
            return await creation;
        } finally {
            pendingEntries.delete(actor.id);
        }
    },

    /** File a Technique into the Cosmo entry if it arrived without one. */
    async fileSpell(spell) {
        const actor = spell.actor;
        if (!this.isSaint(actor)) return;
        if (spell.system.location?.value) return;
        const entry = (await this.ensureEntry(actor)) ?? this.entryFor(actor);
        if (!entry) return;
        await spell.update({ "system.location.value": entry.id });
    },

    isTechnique(item) {
        return item?.type === "spell" && (item.system.traits?.value ?? []).includes("cosmo");
    },

    registerHooks() {
        Hooks.on("createItem", async (item) => {
            if (!game.user.isGM && item.actor?.isOwner !== true) return;
            if (item.type === "class" && item.system?.slug === "saint") {
                await this.ensureEntry(item.actor);
                // Techniques granted alongside the class can land before the entry exists.
                for (const spell of item.actor?.itemTypes.spell ?? []) {
                    if (this.isTechnique(spell)) await this.fileSpell(spell);
                }
                return;
            }
            if (this.isTechnique(item)) await this.fileSpell(item);
        });
    },
};

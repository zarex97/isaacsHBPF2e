import { classSlugOf } from "../lib/class-dc.mjs";

const MODULE_ID = "isaacs-hb-pf2e";
const ENTRY_NAME = "Reiatsu";

/** Entry creations already under way, keyed by actor id. See `ensureEntry`. */
const pendingEntries = new Map();

/** The write half of `ensureEntry`, kept separate so the guard above reads as one decision. */
async function createEntry(actor) {
    const [created] = await actor.createEmbeddedDocuments("Item", [
        {
            name: ENTRY_NAME,
            type: "spellcastingEntry",
            img: "icons/magic/light/explosion-star-glow-blue.webp",
            system: {
                ability: { value: Reiatsu.attributeFor(actor) },
                prepared: { value: "focus" },
                proficiency: { slug: "soulbound", value: 1 },
                showSlotlessLevels: { value: false },
                spelldc: { dc: 0, value: 0 },
                tradition: { value: "" },
            },
            flags: { [MODULE_ID]: { reiatsuEntry: true } },
        },
    ]);
    return created ?? null;
}

/**
 * Focus spellcasting for the Soulbound.
 *
 * Reiatsu Points are pf2e's focus pool. That is not a shortcut: a maximum of 1 rising to 2 at 5th and 3
 * at 11th is exactly the range pf2e's focus maximum allows, Steady the Breath *is* Refocus with a
 * different name in the fiction, and a focus spellcastingEntry brings the pool's UI, its daily refill and
 * every spend site with it. Re-implementing all of that to own the word "reiatsu" would buy nothing.
 *
 * The load-bearing detail is `system.proficiency.slug = "soulbound"`. That makes the entry resolve its
 * spell attack and DC through `actor.getStatistic("soulbound")` — the Reiatsu DC — rather than through a
 * spellcasting proficiency the class deliberately does not have. pf2e finds that statistic by looking the
 * slug up in `CONFIG.PF2E.classTraits`, which is why the homebrew class trait in `module.json` is what
 * makes the Reiatsu DC exist at all.
 *
 * This mirrors `scripts/cosmo.mjs` for the Saint, including the race guard, which was learned the hard
 * way there and is not going to be re-learned here.
 */
export const Reiatsu = {
    entryFor(actor) {
        return (
            actor?.itemTypes?.spellcastingEntry?.find(
                (entry) => entry.system?.proficiency?.slug === "soulbound" || entry.name === ENTRY_NAME,
            ) ?? null
        );
    },

    isSoulbound(actor) {
        return actor?.type === "character" && classSlugOf(actor) === "soulbound";
    },

    /** A Technique, a kidō, a Zanjutsu technique or a Severing Art — everything the pool pays for. */
    isReiatsuEffect(item) {
        return item?.type === "spell" && (item.system?.traits?.value ?? []).includes("reiatsu");
    },

    /** The key attribute chosen at 1st level; the entry's DC follows it. */
    attributeFor(actor) {
        return actor.classDCs?.soulbound?.attribute ?? actor.class?.system?.keyAbility?.selected ?? "str";
    },

    /**
     * One entry per Soulbound, even when several callers ask at once.
     *
     * `createItem` fires for the class *and* for every kidō granted alongside it, in the same batch. Each
     * of those calls this, each finds no entry because none has been written yet, and each creates one —
     * which is how every Saint ever made came out of character creation with two identical "Cosmo"
     * entries, the second one empty. The check and the create have to be one indivisible step from the
     * caller's point of view, which is what parking the in-flight promise here achieves: the second
     * caller awaits the first one's entry instead of racing it.
     */
    async ensureEntry(actor) {
        if (!this.isSoulbound(actor)) return null;
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

    /** File a Technique or kidō into the Reiatsu entry if it arrived without one. */
    async fileSpell(spell) {
        const actor = spell.actor;
        if (!this.isSoulbound(actor)) return;
        if (spell.system.location?.value) return;
        const entry = (await this.ensureEntry(actor)) ?? this.entryFor(actor);
        if (!entry) return;
        await spell.update({ "system.location.value": entry.id });
    },

    registerHooks() {
        Hooks.on("createItem", async (item) => {
            if (!game.user.isGM && item.actor?.isOwner !== true) return;
            if (item.type === "class" && item.system?.slug === "soulbound") {
                await this.ensureEntry(item.actor);
                // Kidō granted alongside the class can land before the entry exists.
                for (const spell of item.actor?.itemTypes.spell ?? []) {
                    if (this.isReiatsuEffect(spell)) await this.fileSpell(spell);
                }
                return;
            }
            if (this.isReiatsuEffect(item)) await this.fileSpell(item);
        });
    },
};

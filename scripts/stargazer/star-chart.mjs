import { classSlugOf } from "../lib/class-dc.mjs";
import { MODULE_ID } from "../sky/signs.mjs";

const ENTRY_NAME = "Star Chart";

/** Entry creations already under way, keyed by actor id — the same race `Cosmo.ensureEntry` guards. */
const pendingEntries = new Map();

/** Astronomy Lore's rank before any feature raises it: trained, from the class (guide §3). */
const BASE_LORE_RANK = 1;

/**
 * The Stargazer's spellcasting, and the Lore it climbs (guide §4.1, §4.6).
 *
 * **The entry.** pf2e creates a player's spellcasting entries only from the sheet, and no rule element can,
 * so the Saint's `cosmo.mjs` and the Soulbound's `reiatsu.mjs` both create theirs by script when the class
 * lands; this is the third. One occult **focus** entry holds both halves of guide §4.1: the Auguries, and
 * the five cantrips — a focus entry files an ordinary cantrip under Cantrips and casts it at will, since a
 * cantrip costs no Focus Point. `proficiency.slug: "stargazer"` makes the entry resolve its DC and spell
 * attack through the **`stargazer` class DC**, which exists because the class trait is registered: one
 * number, the Stargazer DC, shared by every Augury and by *The Last Thing You See*.
 *
 * **The Lore.** A class cannot train a Lore, and pf2e reads a Lore's rank straight off the lore item
 * (`system.proficient.value`) with no rule element that reaches it. So the core-skill features at 3rd, 7th
 * and 15th carry the rank they grant as a flag — `loreRank: { slug, rank }` — and the lore item is kept at
 * the highest one present. pf2e removes class features above the actor's level when it drops, so the rank
 * follows the level both ways.
 */
export const StarChart = {
    isStargazer(actor) {
        return actor?.type === "character" && classSlugOf(actor) === "stargazer";
    },

    entryFor(actor) {
        return actor.itemTypes.spellcastingEntry.find(
            (entry) => entry.system.proficiency?.slug === "stargazer" || entry.name === ENTRY_NAME,
        );
    },

    async ensureEntry(actor) {
        if (!this.isStargazer(actor)) return null;
        const existing = this.entryFor(actor);
        if (existing) return existing;

        const inFlight = pendingEntries.get(actor.id);
        if (inFlight) return inFlight;

        const creation = actor.createEmbeddedDocuments("Item", [{
            name: ENTRY_NAME,
            type: "spellcastingEntry",
            img: "icons/magic/light/explosion-star-glow-blue.webp",
            system: {
                ability: { value: actor.classDCs?.stargazer?.attribute ?? "wis" },
                prepared: { value: "focus" },
                proficiency: { slug: "stargazer", value: 1 },
                showSlotlessLevels: { value: false },
                spelldc: { dc: 0, value: 0 },
                tradition: { value: "occult" },
            },
            flags: { [MODULE_ID]: { starChart: true } },
        }]).then(([created]) => created ?? null);
        pendingEntries.set(actor.id, creation);
        try {
            return await creation;
        } finally {
            pendingEntries.delete(actor.id);
        }
    },

    /** An Augury carries the class trait, as every class's focus spells do; that is how it is found. */
    isAugury(item) {
        return item?.type === "spell" && (item.system.traits?.value ?? []).includes("stargazer");
    },

    /** A spell a Stargazer feat granted — Star-Touched Cantrip's — belongs in the Star Chart too. */
    isGrantedByStargazer(item) {
        if (item?.type !== "spell") return false;
        const granter = item.actor?.items.get(item.flags?.pf2e?.grantedBy?.id ?? "");
        return Boolean(granter && (granter.system.traits?.value ?? []).includes("stargazer"));
    },

    /** File an Augury into the Star Chart if it arrived without an entry — GrantItem never files one. */
    async fileSpell(spell) {
        const actor = spell.actor;
        if (!this.isStargazer(actor) || spell.system.location?.value) return;
        const entry = (await this.ensureEntry(actor)) ?? this.entryFor(actor);
        if (entry) await spell.update({ "system.location.value": entry.id });
    },

    /** The rank a Lore should have: the highest any present feature grants it, and never below trained. */
    loreRankFor(actor, slug) {
        let rank = BASE_LORE_RANK;
        for (const feat of actor.itemTypes.feat) {
            const grant = feat.flags?.[MODULE_ID]?.loreRank;
            if (grant?.slug === slug && Number(grant.rank) > rank) rank = Number(grant.rank);
        }
        return rank;
    },

    /** Bring every Lore a feature ranks up to the rank its features grant. */
    async syncLore(actor) {
        if (!this.isStargazer(actor)) return;
        const slugs = new Set(actor.itemTypes.feat.map((f) => f.flags?.[MODULE_ID]?.loreRank?.slug).filter(Boolean));
        slugs.add("astronomy-lore");
        for (const lore of actor.itemTypes.lore) {
            if (!slugs.has(lore.slug)) continue;
            const rank = this.loreRankFor(actor, lore.slug);
            if (lore.system.proficient?.value !== rank) await lore.update({ "system.proficient.value": rank });
        }
    },

    registerHooks() {
        const mine = (item) => game.user.isGM || item.actor?.isOwner === true;
        Hooks.on("createItem", async (item) => {
            if (!item.actor || !mine(item)) return;
            if (item.type === "class" && item.system?.slug === "stargazer") {
                await this.ensureEntry(item.actor);
                for (const spell of item.actor.itemTypes.spell) if (this.isAugury(spell)) await this.fileSpell(spell);
                await this.syncLore(item.actor);
                return;
            }
            if (this.isAugury(item) || this.isGrantedByStargazer(item)) await this.fileSpell(item);
            if (item.type === "lore" || item.flags?.[MODULE_ID]?.loreRank) await this.syncLore(item.actor);
        });
        Hooks.on("deleteItem", async (item) => {
            if (!item.actor || !mine(item)) return;
            if (item.flags?.[MODULE_ID]?.loreRank) await this.syncLore(item.actor);
        });
    },
};

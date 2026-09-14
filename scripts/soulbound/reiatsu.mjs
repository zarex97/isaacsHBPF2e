import { classSlugOf } from "../lib/class-dc.mjs";
import { applyActionCosts } from "./action-cost.mjs";
import { wrap } from "../lib/wrap.mjs";

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

    /**
     * The highest base rank of kidō this character may learn — guide §6, read the honest way.
     *
     * A kidō has **no rank of its own**: it "auto-heightens to half your level rounded up, like every
     * other focus effect". So the level at which a kidō becomes learnable is the level at which your
     * auto-heighten rank reaches its base rank, and that single sentence reproduces every level the
     * guide prints, exactly:
     *
     *   Byakurai, Sai, Danku, Kaidō …  base rank 1 → 1st
     *   Rikujōkōrō                      base rank 4 → 7th
     *   Sōren Sōkatsui, Kin             base rank 5 → 9th
     *   Kurohitsugi                     base rank 8 → 15th
     *
     * It is published as a roll option rather than written into six ChoiceSet filters as a list of
     * exclusions, because `Additional Kidō` can be taken at any level and a static list cannot gate it.
     * Content then says `{"lte": ["item:level", "soulbound:kido-rank"]}` and never mentions a level at
     * all. Before this existed, a **1st-level** Soul Reaper was offered **Kurohitsugi**.
     */
    kidoRank(level) {
        return Math.max(1, Math.ceil((Number(level) || 1) / 2));
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

    /**
     * The pool is the ceiling — the whole of guide §4.2's 1 / 2 / 5th / 3 at 11th.
     *
     * pf2e derives a focus pool's size from the focus effects you know: `+1` per non-cantrip focus spell
     * in `SpellPF2e#prepareActorData`, clamped to `cap`. For most classes that is the same thing, because
     * knowing more focus spells IS how their pool grows. It is not the same thing here, and the live pass
     * is what showed it: a Soul Reaper at 11th knows four costed kidō and got the right pool by accident,
     * while a **Hollow knows exactly one, forever**, and sat on a pool of 1 at 11th level where the guide
     * says 3. Guide §1.7 is explicit that the Hollow's floor is Bala and Cero and nothing more, so no
     * amount of content fixes this — the derivation is simply the wrong rule for this class.
     *
     * The class features set `cap` to 1 / 2 / 3 by level (migration 889 strips an AE-like on `max`, but
     * leaves `cap` alone), so the correction is one line: a Soulbound's maximum is its ceiling.
     */
    /**
     * Kidō are not spells, and should not be posting to chat as **Arcane**.
     *
     * > Kidō are **not spells**. They use your Reiatsu DC, they can't be counteracted as spells, and you
     * > can't heighten them with slots. — guide §6
     *
     * The entry is created with `tradition: { value: "" }`, which reads as "none" and is not. pf2e's
     * `SpellcastingEntryPF2e#tradition` getter is
     *
     *     const defaultTradition = this.system.prepared.value === "items" ? null : "arcane";
     *
     * so **every** entry that is not an item-based one falls back to arcane, and the tradition is then
     * unioned into each spell's traits — three separate places in `item/spell/document.ts` — and emitted
     * as `spell:trait:arcane`. That is not only a wrong word on a card: anything keyed on the arcane
     * tradition finds a kidō, which is exactly the counteracting §6 says cannot happen.
     *
     * There is no data value for "no tradition" on a focus entry, so the getter is overridden for this
     * class's entry alone. The Saint's Cosmo is untouched: it chooses a real tradition in a setting.
     */
    untraditionEntry() {
        const proto = CONFIG.PF2E?.Item?.documentClasses?.spellcastingEntry?.prototype;
        const descriptor = proto && Object.getOwnPropertyDescriptor(proto, "tradition");
        if (!descriptor?.get) {
            console.warn("Isaac's Homebrew | no `tradition` getter to override; kidō will read as arcane");
            return;
        }
        const original = descriptor.get;
        Object.defineProperty(proto, "tradition", {
            ...descriptor,
            get() {
                if (this.system?.proficiency?.slug === "soulbound") return null;
                return original.call(this);
            },
        });
    },

    install() {
        wrap(
            "CONFIG.PF2E.Actor.documentClasses.character.prototype.prepareDerivedData",
            function (wrapped, ...args) {
                const result = wrapped(...args);
                try {
                    // Published for EVERY character, not only a Soulbound, and that is deliberate.
                    // The first two kidō are chosen while the class item is still being created, so at
                    // the moment their ChoiceSets run the actor has no class yet — gate on the class and
                    // the option is absent, the `lte` compares against NaN, and the prompt opens with
                    // **no choices at all**, which blocks character creation outright. The option says
                    // something about the actor's level, not about their class, so computing it for
                    // everyone costs a key and is correct at the only time it is hard to be correct.
                    this.rollOptions.all[`soulbound:kido-rank:${Reiatsu.kidoRank(this.level)}`] = true;

                    if (classSlugOf(this) === "soulbound") {
                        const focus = this.system?.resources?.focus;
                        if (focus) {
                            focus.max = focus.cap ?? focus.max;
                            focus.value = Math.min(focus.value ?? 0, focus.max);
                        }
                        // pf2e has no alteration for an action cost, and two abilities need one. This is
                        // the one place a second wrapper on `prepareDerivedData` would have gone, and
                        // `wrap()` refuses two on the same target by design — so it lives here.
                        applyActionCosts(this);
                    }
                } catch (error) {
                    console.error("Isaac's Homebrew | the reiatsu pool could not be sized", error);
                }
                return result;
            },
            { feature: "the reiatsu pool" },
        );

        this.untraditionEntry();

        // Actors are prepared during `setupGame`, which runs BEFORE the `setup` hook this wrap installs
        // from — so every Soulbound in the world loads with the pool pf2e derived and only picks up the
        // correction the next time something re-prepares it. One sweep at `ready` closes that window;
        // without it the pool reads correctly all session except immediately after a reload, which is the
        // most confusing possible version of the bug.
        Hooks.once("ready", () => {
            for (const actor of game.actors) {
                if (classSlugOf(actor) === "soulbound") actor.reset();
            }
        });
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

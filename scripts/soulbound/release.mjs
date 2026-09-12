import { Reiatsu } from "./reiatsu.mjs";

const MODULE_ID = "isaacs-hb-pf2e";

const EFFECTS_PACK = `${MODULE_ID}.soulbound-effects`;

/** The effect each rung of the ladder wears, by name. Severance is Phase 6's and is not listed yet. */
const EFFECTS = {
    released: "Effect: Released",
    full: "Effect: Full Release",
};

/**
 * A packed effect, by the name it is authored under.
 *
 * The content refers to effects by name and the build rewrites those to ids on the way into the pack, so a
 * `@UUID[…Item.Effect: X]` in a JSON file resolves at the table. Code gets no such pass: `fromUuid` on a
 * name-shaped compendium uuid returns null, silently, and the feature that needed the effect simply does
 * nothing. Astral Projection shipped with two of those and did nothing at all, which is why
 * `npm run test:riders` now fails the build for any script that holds one.
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

/** What a rung falls back to when it ends. Full Release drops to Released; Released drops to sealed. */
const FALLBACK = { full: "released", released: "sealed" };

/**
 * What a Full Release is at a given level (guide §4.8).
 *
 * Three tiers, all arithmetic on one number:
 *
 *   13th  FULL RELEASE          1 minute, 15-foot emanation, fatigued when it ends, once per day
 *   17th  Perfected Full Release 2 minutes, 20-foot emanation, no fatigue
 *   19th  Unsealed               twice per day
 *
 * Kept pure because the 17th- and 19th-level upgrades are exactly the kind of thing that gets authored on
 * the wrong feature and then passes a playtest because nobody at the table was 17th level yet.
 */
export function fullReleaseShape(level) {
    if (level < 13) return { minutes: 0, emanation: 0, fatigue: false, usesPerDay: 0 };
    const perfected = level >= 17;
    return {
        minutes: perfected ? 2 : 1,
        emanation: perfected ? 20 : 15,
        fatigue: !perfected,
        usesPerDay: level >= 19 ? 2 : 1,
    };
}

/**
 * The release ladder as a state machine: sealed → released → full → severance.
 *
 * Release is deliberately **not a stance** (guide §4.7) — it does not conflict with stance actions and it
 * lasts the whole encounter rather than until you do something else — so it cannot use pf2e's stance
 * plumbing, and is an ordinary effect with a module-owned state flag beside it. That flag is what a
 * Spirit's own content predicates on, and what Phase 3 hangs each Released Form off.
 */
export const Release = {
    stateOf(actor) {
        return actor?.getFlag?.(MODULE_ID, "releaseState") ?? "sealed";
    },

    async enter(actor, state) {
        if (!Reiatsu.isSoulbound(actor)) return;
        const name = EFFECTS[state];
        if (name) {
            const doc = await packedEffect(name);
            // `toObject()` hands back the rules array by reference on a compendium document, and editing
            // it poisons the cached pack for the rest of the session. Clone before anything touches it.
            if (doc) await actor.createEmbeddedDocuments("Item", [foundry.utils.deepClone(doc.toObject())]);
        }
        await actor.setFlag(MODULE_ID, "releaseState", state);
    },

    async exit(actor, state) {
        const name = EFFECTS[state];
        // Matched on the authored name rather than on a sourceId, for the same reason `enter` looks the
        // effect up by name: the id is assigned at build time and code has no way to know it.
        const held = actor.itemTypes.effect.filter((e) => e.name === name);
        if (held.length > 0) await actor.deleteEmbeddedDocuments("Item", held.map((e) => e.id));
        if (this.stateOf(actor) === state) {
            await actor.setFlag(MODULE_ID, "releaseState", FALLBACK[state] ?? "sealed");
        }
    },

    /**
     * The encounter ends, and so does Release.
     *
     * Guide §4.7 says a released form lasts "for the rest of the encounter", which is a duration pf2e has
     * no unit for — its effects measure rounds, minutes and days. So the encounter's end is the timer, and
     * `deleteCombat` is where it fires.
     */
    registerHooks() {
        Hooks.on("deleteCombat", async (combat) => {
            if (!game.user.isGM) return;
            for (const combatant of combat.combatants) {
                const actor = combatant.actor;
                if (!Reiatsu.isSoulbound(actor)) continue;
                if (this.stateOf(actor) === "sealed") continue;
                await this.exit(actor, "full");
                await this.exit(actor, "released");
            }
        });
    },
};

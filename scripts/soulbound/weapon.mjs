import { classSlugOf } from "../lib/class-dc.mjs";

const MODULE_ID = "isaacs-hb-pf2e";

/** The tag every spirit weapon carries, sealed or released, and the one `weaponOf` searches by. */
export const SPIRIT_WEAPON_TAG = "soulbound-spirit-weapon";

/** Only the four SEALED profiles carry this. A released form's weapon does not. */
export const PROFILE_TAG = "soulbound-weapon-profile";

/**
 * The spirit weapon: finding it, and Soul-Etched rune transfer.
 *
 * The weapon is a real pf2e weapon item rather than a synthetic Strike, because everything the class does
 * to it later — a released form's damage-die step, a wholly replaced profile like Luz de la Luna or Gran
 * Caída, a rune — is an ItemAlteration, and an alteration needs a document to alter.
 *
 * Several Spirits replace the profile outright rather than altering it, which is why `weaponOf` searches
 * by tag rather than by remembering which of the four sealed profiles was chosen at 1st level.
 */
export const SpiritWeapon = {
    isSoulbound(actor) {
        return actor?.type === "character" && classSlugOf(actor) === "soulbound";
    },

    /** The manifested spirit weapon, or null while it is dismissed — which is not an error. */
    weaponOf(actor) {
        if (!this.isSoulbound(actor)) return null;
        return (
            actor.itemTypes?.weapon?.find((w) => (w.system?.traits?.otherTags ?? []).includes(SPIRIT_WEAPON_TAG))
            ?? null
        );
    },

    /**
     * A released form *replaces* the weapon; it does not add a second one.
     *
     * Guide §7 says the spirit weapon "becomes" Luz de la Luna, Gran Caída, a pair of pistols. Foundry
     * has no notion of a document becoming another, so the released form grants its own weapon — and the
     * sealed profile sat on the sheet beside it, equipped, usable, and wrong. A player choosing between
     * them is a choice the class never offered.
     *
     * So the sealed profile is stowed whenever a replacement is present, and taken back up when it is
     * not. Stowed rather than deleted: it is the character's own weapon, it comes back when the form
     * ends, and deleting it would take its runes with it.
     */
    async reconcile(actor) {
        // Deliberately NOT gated on `isSoulbound`. During character creation the class item, the
        // Lineage, the Spirit and both weapons all land in one cascade, and `actor.class` is not yet
        // readable when the weapons arrive — so the guard was false exactly when it mattered and the
        // sealed profile stayed in hand. The spirit-weapon tag is only ever on this class's content, so
        // it is guard enough on its own.
        if (!actor?.itemTypes?.weapon) return;
        const spirit = actor.itemTypes.weapon.filter(
            (w) => (w.system?.traits?.otherTags ?? []).includes(SPIRIT_WEAPON_TAG),
        );
        const sealed = spirit.filter((w) => (w.system?.traits?.otherTags ?? []).includes(PROFILE_TAG));
        const released = spirit.filter((w) => !(w.system?.traits?.otherTags ?? []).includes(PROFILE_TAG));

        const updates = [];
        for (const weapon of sealed) {
            const wanted = released.length > 0 ? "stowed" : "held";
            if (weapon.system.equipped?.carryType !== wanted) {
                updates.push({ _id: weapon.id, "system.equipped.carryType": wanted });
            }
        }
        if (updates.length > 0) await actor.updateEmbeddedDocuments("Item", updates);
    },

    /**
     * Two jobs on the same hook.
     *
     * **Soul-Etched**: runes move in and out for free during daily preparations. pf2e gates rune transfer
     * behind a Crafting check and a cost inside its own dialog, neither of which a module can waive from
     * outside; what it can do is mark the weapon as the character's own rune carrier, which is the job
     * `Handwraps of Mighty Blows` exists to do for a monk. The flag is read by the handbook rather than
     * by pf2e, so this is honest bookkeeping rather than an automated waiver — and the handbook says so.
     *
     * **Reconciling**: whenever a spirit weapon arrives or leaves, work out which one is in your hands.
     */
    registerHooks() {
        const touched = (item) => {
            if (!game.user.isGM && item.actor?.isOwner !== true) return false;
            if (item.type !== "weapon" || !item.actor) return false;
            return (item.system?.traits?.otherTags ?? []).includes(SPIRIT_WEAPON_TAG);
        };

        Hooks.on("createItem", async (item) => {
            if (!touched(item)) return;
            if (!item.getFlag(MODULE_ID, "soulEtched")) await item.setFlag(MODULE_ID, "soulEtched", true);
            queueReconcile(item.actor, (actor) => this.reconcile(actor));
        });

        // A released form ending takes its weapon with it, and the sealed profile comes back up.
        Hooks.on("deleteItem", (item) => {
            if (!touched(item)) return;
            queueReconcile(item.actor, (actor) => this.reconcile(actor));
        });
    },
};

/** Actors with a reconcile already queued, so one cascade of grants settles once. */
const queued = new Set();

/**
 * Reconcile after the current cascade finishes, not during it.
 *
 * Character creation grants the class, the Lineage, the Spirit, the sealed profile and the released
 * form in one burst of `createItem` hooks. Reconciling on each one asks "is a replacement present?"
 * while the answer is still changing — the sealed profile arrives first and is correctly left in hand,
 * and nothing asks again once the claws land. Deferring to the end of the tick asks once, when the
 * sheet is whole.
 */
function queueReconcile(actor, run) {
    if (!actor || queued.has(actor.id)) return;
    queued.add(actor.id);
    setTimeout(async () => {
        queued.delete(actor.id);
        try {
            await run(actor);
        } catch (error) {
            console.error("Isaac's Homebrew | the spirit weapon could not be reconciled", error);
        }
    }, 100);
}

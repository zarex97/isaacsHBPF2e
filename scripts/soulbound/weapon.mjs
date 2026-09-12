import { classSlugOf } from "../lib/class-dc.mjs";

const MODULE_ID = "isaacs-hb-pf2e";

/** The tag every spirit-weapon profile carries, and the one `weaponOf` searches by. */
export const SPIRIT_WEAPON_TAG = "soulbound-spirit-weapon";

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
     * Soul-Etched: runes move in and out for free during daily preparations.
     *
     * pf2e gates rune transfer behind a Crafting check and a cost inside its own transfer dialog, neither
     * of which a module can waive from outside. What it can do is mark the weapon so the sheet treats it
     * as the character's own rune carrier, which is the job `Handwraps of Mighty Blows` exists to do for
     * a monk. The flag is read by the handbook's instructions rather than by pf2e, so this is honest
     * bookkeeping rather than an automated waiver — and the handbook says so.
     */
    registerHooks() {
        Hooks.on("createItem", async (item) => {
            if (!game.user.isGM && item.actor?.isOwner !== true) return;
            if (item.type !== "weapon") return;
            if (!this.isSoulbound(item.actor)) return;
            if (!(item.system?.traits?.otherTags ?? []).includes(SPIRIT_WEAPON_TAG)) return;
            if (item.getFlag(MODULE_ID, "soulEtched")) return;
            await item.setFlag(MODULE_ID, "soulEtched", true);
        });
    },
};

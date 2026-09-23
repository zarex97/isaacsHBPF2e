import { classSlugOf } from "../lib/class-dc.mjs";

const MODULE_ID = "isaacs-hb-pf2e";

/** The tag every spirit weapon carries, sealed or released, and the one `weaponOf` searches by. */
export const SPIRIT_WEAPON_TAG = "soulbound-spirit-weapon";

/** Only the four SEALED profiles carry this. A released form's weapon does not. */
export const PROFILE_TAG = "soulbound-weapon-profile";

/**
 * How many hands a weapon in play occupies.
 *
 * pf2e derives `usage.hands` from `usage.value` while preparing the item, so that is the number to read
 * where it exists — but `reconcile` runs from `createItem`, which can reach a source object whose data
 * has not been prepared yet. The string is the authored field and is always there, so it is the fallback.
 *
 * `held-in-one-plus-hands` is deliberately one: a bow is *carried* in one hand and drawn with two, and
 * pf2e counts it as one for `handsFree` exactly as the rules do.
 */
export function handsFor(weapon) {
    const derived = Number(weapon?.system?.usage?.hands);
    if (Number.isInteger(derived) && derived > 0) return derived;
    return weapon?.system?.usage?.value === "held-in-two-hands" ? 2 : 1;
}

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

    /**
     * Is the spirit weapon dissolved?
     *
     * > **Bonded.** You can manifest or dismiss it as a free action once per round. — guide §4.1
     *
     * There was no answer to this question at all, which mattered one clause later: §4.7 says *"you can't
     * Release while your spirit weapon is dismissed"*, and `Release.release` carried a comment promising
     * it refused while checking nothing, because there was no state to check. Dismissal was a card that
     * described itself.
     *
     * The state is a flag rather than the weapon's `carryType`, because `reconcile` already writes
     * `carryType` for a different reason — stowing the sealed profile while a released form stands — and
     * two writers on one field is how a sealed Arrogante ended up holding a blade in zero hands.
     */
    isDismissed(actor) {
        return actor?.getFlag?.(MODULE_ID, "weaponDismissed") === true;
    },

    /**
     * **Manifest or Dismiss Spirit Weapon** [free-action] — guide §4.1.
     *
     * One action does both, so this toggles. pf2e counts the once-per-round itself, from the frequency on
     * the action.
     */
    async toggle(actor) {
        if (!this.isSoulbound(actor)) return false;
        const dismissing = !this.isDismissed(actor);
        await actor.setFlag(MODULE_ID, "weaponDismissed", dismissing);
        await this.reconcile(actor);
        ui.notifications.info(
            dismissing
                ? `${actor.name}'s spirit weapon dissolves. It cannot be Released while dismissed.`
                : `${actor.name}'s spirit weapon appears in hand.`,
        );
        return true;
    },

    /** The manifested spirit weapon, or null while it is dismissed — which is not an error. */
    weaponOf(actor) {
        if (this.isDismissed(actor)) return null;
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

        // Dismissed beats everything below: there is nothing in hand to reconcile, released form or not.
        if (this.isDismissed(actor)) {
            const away = spirit
                .filter((w) => w.system.equipped?.carryType !== "stowed")
                .map((w) => ({ _id: w.id, "system.equipped.carryType": "stowed" }));
            if (away.length > 0) await actor.updateEmbeddedDocuments("Item", away);
            return;
        }

        const updates = [];
        for (const weapon of sealed) {
            const wanted = released.length > 0 ? "stowed" : "held";
            if (weapon.system.equipped?.carryType !== wanted) {
                updates.push({ _id: weapon.id, "system.equipped.carryType": wanted });
            }
        }

        /**
         * Hands, for the forms that leave them empty.
         *
         * Senbonzakura's Shikai says "your hands are empty" — the blade scatters and there is nothing
         * left to hold. `ItemAlteration` cannot express this: its property list covers traits, runes,
         * damage dice and bulk, and nothing that touches how a weapon is carried. So the form declares
         * `freesHands` on itself and this is the one place that reads it, the same way Libra's Arms are
         * the one place that writes `handsHeld`.
         *
         * `carryType` stays `held`: the Strike has to remain available. Only the hand count drops, which
         * is what `attributes.handsFree` is computed from.
         *
         * **A two-handed form takes two hands.** This used to write `1` for every spirit weapon in play,
         * which is right for the nine held in one hand and wrong for the four that are not: Gran Caída,
         * the Great Blade, the Miracle's sword-and-shield and Tiburón's hollow-edged blade all declare
         * `held-in-two-hands` and were authored `handsHeld: 2`, and reconcile overwrote it on every pass.
         * Driven live, a crowned skeleton carrying a vast double axe had a hand free — free enough to
         * Grapple with, or to raise a shield in.
         */
        const frees = (actor.itemTypes?.effect ?? []).some(
            (effect) => effect.flags?.[MODULE_ID]?.freesHands === true,
        );
        for (const weapon of spirit) {
            // The carry type this pass is *leaving* the weapon with, not the one it found. A profile
            // being taken back up in the same pass is still `stowed` on the document here, so reading
            // the document skipped it — and it came back into the hand with whatever hand count the
            // form had left behind. Live, a sealed Arrogante held the Blade in **zero** hands.
            const queuedCarry = updates.find((u) => u._id === weapon.id)?.["system.equipped.carryType"];
            if ((queuedCarry ?? weapon.system.equipped?.carryType) !== "held") continue;
            const hands = frees ? 0 : handsFor(weapon);
            if ((weapon.system.equipped?.handsHeld ?? 1) === hands) continue;
            const queued = updates.find((u) => u._id === weapon.id);
            if (queued) queued["system.equipped.handsHeld"] = hands;
            else updates.push({ _id: weapon.id, "system.equipped.handsHeld": hands });
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

        /** A form that frees the hands is an effect, not a weapon, so it needs its own way in. */
        const freesHands = (item) => item?.type === "effect"
            && item.actor
            && item.flags?.[MODULE_ID]?.freesHands === true
            && (game.user.isGM || item.actor.isOwner === true);

        Hooks.on("createItem", async (item) => {
            if (freesHands(item)) queueReconcile(item.actor, (actor) => this.reconcile(actor));
            if (!touched(item)) return;
            if (!item.getFlag(MODULE_ID, "soulEtched")) await item.setFlag(MODULE_ID, "soulEtched", true);
            queueReconcile(item.actor, (actor) => this.reconcile(actor));
        });

        // A released form ending takes its weapon with it, and the sealed profile comes back up.
        Hooks.on("deleteItem", (item) => {
            if (freesHands(item)) queueReconcile(item.actor, (actor) => this.reconcile(actor));
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

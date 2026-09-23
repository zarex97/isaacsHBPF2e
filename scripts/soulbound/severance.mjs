import { FLAG as BYPASS_FLAG, MEMORY } from "../riders/bypass.mjs";
import { Reiatsu } from "./reiatsu.mjs";

const MODULE_ID = "isaacs-hb-pf2e";
const EFFECTS_PACK = `${MODULE_ID}.soulbound-effects`;
const SEVERANCE = "Effect: Severance";
const SPENT = "Effect: Severed";

/**
 * Severance, and the Waning table.
 *
 * The 20th-level capstone. Ten rounds of enormous general power containing exactly one irreversible
 * attack, which ends the state when used — and which is worth less the longer you wait.
 *
 * > **The tension is the point.** The longer you survive in Severance, the more the general state has
 * > given you, and the less your ending is worth. Round one is 70 damage and none of the buff. Round
 * > seven is 28 damage and six rounds of a 4d6 rider, doubled Flash Step, and free kidō. There is no
 * > dominant line, which is what makes it a decision instead of a script.
 */

/**
 * Dice for a Severing Art used in a given round of Severance (guide §9).
 *
 * `22 − 2 × round`, rounds 1 through 7. After the seventh the Art has decayed past the point of being
 * worth the action, and the rules say so rather than letting you throw away your one shot for 6d6 — so
 * this returns **0**, and the Art refuses rather than rolling something.
 *
 * Kept pure and exported because the decay IS the balance lever. Guide §9.0.1 says so outright: if
 * playtesting shows everyone fires on round one, the fix is to flatten this table, not to cut the
 * ceiling. A number that lives in one function can be flattened; one scattered across fifteen documents
 * cannot.
 *
 * @param {number} round the round of Severance, counting from 1
 * @returns {number} dice, or 0 when the Art can no longer be used
 */
export function waningDice(round) {
    if (!Number.isInteger(round) || round < 1 || round > 7) return 0;
    return 22 - 2 * round;
}

/** How many rounds of Severance have elapsed, counting the round it began as the first. */
export function roundOfSeverance({ began, now }) {
    if (!Number.isInteger(began) || !Number.isInteger(now)) return 0;
    return Math.max(1, now - began + 1);
}

/** The tag every Severing Art carries, and the only thing that identifies one. */
export const ART_TAG = "sb-tier-severing";

/** Is this item a Severing Art? */
export function isSeveringArt(item) {
    return (item?.system?.traits?.otherTags ?? []).includes(ART_TAG);
}

/**
 * Stamp the Waning dice onto every Severing Art the actor is carrying.
 *
 * **The whole table was inert.** `waningDice` was pure, exported and unit-tested; the fifteen Arts were
 * authored at a flat `20d6`, which is the round-one value, and nothing ever connected the two. A
 * twentieth-level Soulbound could sit through nine rounds of a 4d6 rider, doubled Flash Step and free
 * kidō and still end the fight for seventy points of damage — which removes the decision the capstone
 * is built around. Guide §9 is explicit that the decay *is* the balance lever.
 *
 * Done in `prepareDerivedData` rather than at cast time so the **card is honest**: a player in round
 * three sees 16d6 on the Art before deciding whether to spend it. That costs a re-preparation whenever
 * the round advances, which `registerHooks` does for exactly the actors in a Severance.
 */
export function applyWaning(actor, round) {
    const dice = waningDice(round);
    for (const item of actor.itemTypes?.spell ?? []) {
        if (!isSeveringArt(item)) continue;
        const part = item.system?.damage?.["0"];
        if (!part?.formula) continue;
        // Ittō Kasō is "the Waning dice **+2d6**" (R-14), so the extra is kept rather than overwritten.
        const extra = /\+\s*(\d+d\d+)/.exec(part.formula)?.[1];
        part.formula = dice === 0 ? "0" : `${dice}d6${extra ? ` + ${extra}` : ""}`;
    }
}

async function packed(name) {
    const pack = game.packs.get(EFFECTS_PACK);
    const entry = pack ? (await pack.getIndex()).find((e) => e.name === name) : null;
    if (!entry) {
        console.warn(`Isaac's Homebrew | ${EFFECTS_PACK} has no "${name}"`);
        return null;
    }
    return pack.getDocument(entry._id);
}

export const Severance = {
    effectOn(actor) {
        return actor?.itemTypes?.effect?.find((e) => e.name === SEVERANCE) ?? null;
    },

    /**
     * The encounter this actor is actually in.
     *
     * **Not `game.combat`**, which is `game.combats.viewed` — the encounter belonging to the scene the
     * *client* happens to be looking at. Beginning a Severance while viewing another scene stamped the
     * flag from a fallback and every round of the Waning table read from round one for the rest of the
     * fight. The combatant knows its own encounter and no view can change that.
     */
    encounterFor(actor) {
        return actor?.combatant?.encounter ?? actor?.combatant?.combat ?? game.combat ?? null;
    },

    /** Which round of Severance this actor is in, or 0 if they are not in one. */
    round(actor) {
        const effect = this.effectOn(actor);
        if (!effect) return 0;
        const began = effect.getFlag(MODULE_ID, "severanceBegan");
        const now = this.encounterFor(actor)?.round;
        return roundOfSeverance({ began, now: Number.isInteger(now) ? now : began });
    },

    /** The dice a Severing Art would roll right now. 0 means it refuses. */
    dice(actor) {
        return waningDice(this.round(actor));
    },

    /**
     * Refuse an Art that has decayed past use, and end Severance when one is used.
     *
     * Guide §9: using the Art "is two actions, costs nothing, and immediately ends Severance whether you
     * want it to or not", and after the seventh round it cannot be used at all. Both halves lived only
     * in the prose — `waningDice` returned 0 for round 8 and nothing asked it, so the Art stayed on the
     * sheet and rolled its printed twenty dice in round ten.
     */
    beforeCast(spell) {
        if (!isSeveringArt(spell)) return true;
        const actor = spell?.actor;
        if (!actor) return true;
        if (!this.effectOn(actor)) {
            ui.notifications.warn(`${spell.name} can only be used during Severance.`);
            return false;
        }
        if (this.dice(actor) === 0) {
            ui.notifications.warn(
                `${spell.name} has decayed past use — a Severing Art cannot be used after the seventh round.`,
            );
            return false;
        }
        return true;
    },

    /** Called after the Art has actually reached the table. */
    async afterCast(spell) {
        if (!isSeveringArt(spell)) return;
        const actor = spell?.actor;
        if (!actor || !this.effectOn(actor)) return;
        // Before the end, not after: ending Severance revokes the Art, and the Art is the only thing that
        // knows what its damage gets past. See `rememberedEntries`.
        await rememberBypass(actor, spell);
        await detachArt(actor, spell);
        await this.end(actor);
        ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<p><strong>${spell.name}</strong> ends Severance.</p>`,
        });
    },

    async begin(actor) {
        if (!Reiatsu.isSoulbound(actor)) return null;
        const doc = await packed(SEVERANCE);
        if (!doc) return null;
        // Stamped on the source rather than set afterwards: a `setFlag` on a freshly created embedded
        // document is a second write that anything reading in between — a `prepareDerivedData` triggered
        // by the creation itself — will miss, and the Waning table reads this on every preparation.
        const source = foundry.utils.deepClone(doc.toObject());
        const round = this.encounterFor(actor)?.round;
        foundry.utils.setProperty(source, `flags.${MODULE_ID}.severanceBegan`,
                                  Number.isInteger(round) && round > 0 ? round : 1);
        // A new Severance is a clean slate: last encounter's Art has no business bypassing anything now,
        // and the detached copy of it must go before the grant puts a fresh one beside it.
        await actor.unsetFlag(MODULE_ID, MEMORY);
        const spent = actor.itemTypes.spell.filter((i) => i.flags?.[MODULE_ID]?.severingArtSpent);
        if (spent.length > 0) {
            await actor.deleteEmbeddedDocuments("Item", spent.map((i) => i.id));
        }
        const [made] = await actor.createEmbeddedDocuments("Item", [source]);
        return made;
    },

    /**
     * End Severance, and take what it costs.
     *
     * Both routes end here — the Art being used, and the clock running out at the end of the tenth
     * round — because the price is the same either way and putting it in one place is what stops one
     * route quietly forgetting it.
     */
    async end(actor) {
        const held = actor.itemTypes.effect.filter((e) => e.name === SEVERANCE);
        if (held.length > 0) await actor.deleteEmbeddedDocuments("Item", held.map((e) => e.id));

        // R-10 is a list, and the Released Form is the first thing on it: "you lose your Released Form,
        // your Release Technique, your Full Release and your entire reiatsu pool". Zeroing the pool and
        // refusing a fresh Release left the character still standing in the form they had just severed.
        //
        // Imported here rather than at the top: `release` imports `reiatsu`, which imports this module
        // for the Waning table, and a static import would close that ring at evaluation time.
        const { Release } = await import("./release.mjs");
        await Release.exit(actor, "full");
        await Release.exit(actor, "released");
        // `exit` only falls back from the rung the actor is standing on, and after ADR-0002 that rung is
        // `severance` — so neither call above touches the flag and the character would be left reading as
        // mid-capstone forever. R-10 takes everything, so the ladder goes to the bottom, not one step.
        await actor.setFlag(MODULE_ID, "releaseState", "sealed");

        const doc = await packed(SPENT);
        if (doc) await actor.createEmbeddedDocuments("Item", [foundry.utils.deepClone(doc.toObject())]);

        // The Severing Art is granted by the **Spirit feature**, predicated on `soulbound:severance` —
        // so deleting the Severance effect does not cascade it away, and pf2e only re-tests a predicated
        // grant on an actor *update*. Without this nudge the Art sits on the sheet after Severance is
        // over, which invites using something `beforeCast` will then refuse. Touching the level is the
        // smallest update that re-evaluates every grant without changing anything.
        await actor.update({ "system.details.level.value": actor.system.details.level.value });
    },

    registerHooks() {
        /**
         * Stamp the round Severance began, and refuse it from the wrong rung.
         *
         * `Final Release` grants `Effect: Severance` with a `GrantItem` rule, so `begin()` — the only
         * thing that ever wrote `severanceBegan` — was never reached. Without that stamp
         * `roundOfSeverance` returns 0, `waningDice(0)` returns 0, and `beforeCast` refuses the Severing
         * Art as "decayed past use". The capstone's entire payoff was unreachable.
         *
         * preCreate rather than create: the Waning table is read during preparation, and a `setFlag`
         * after the fact is a second write that the preparation triggered by the creation itself misses.
         */
        Hooks.on("preCreateItem", (item) => {
            if (item.name !== SEVERANCE) return true;
            const actor = item.parent;
            if (!actor || !Reiatsu.isSoulbound(actor)) return true;
            const round = this.encounterFor(actor)?.round;
            item.updateSource({
                [`flags.${MODULE_ID}.severanceBegan`]:
                    Number.isInteger(round) && round > 0 ? round : 1,
            });
            return true;
        });

        /** Move the ladder to its fourth rung once the effect has actually landed. */
        Hooks.on("createItem", async (item) => {
            if (item.name !== SEVERANCE) return;
            const actor = item.parent;
            if (!game.user.isGM || !actor || !Reiatsu.isSoulbound(actor)) return;
            const { Release } = await import("./release.mjs");
            if (!(await Release.enterSeverance(actor))) {
                ui.notifications?.warn(
                    "Severance begins from a Full Release. The effect is on the sheet, but the release "
                    + "ladder was not advanced.",
                );
            }
        });

        // The clock. Severance lasts ten rounds; the eleventh ends it whether or not the Art was used.
        Hooks.on("combatTurnChange", async () => {
            if (!game.user.isGM) return;
            for (const combatant of game.combats?.contents?.flatMap((c) => c.combatants.contents) ?? []) {
                const actor = combatant.actor;
                if (!Reiatsu.isSoulbound(actor)) continue;
                if (!this.effectOn(actor)) continue;
                if (this.round(actor) > 10) { await this.end(actor); continue; }
                // The Waning dice are a function of the round, and nothing else re-prepares an actor
                // when the round turns — so the Art on the sheet would keep round one's twenty dice.
                actor.reset();
            }
        });
    },
};

/** Copy the Art's own bypass onto its user, pinned to that Art, so the damage can still find it. */
async function rememberBypass(actor, spell) {
    const entries = spell?.flags?.[MODULE_ID]?.[BYPASS_FLAG];
    if (!Array.isArray(entries) || entries.length === 0) return;
    const slug = spell.slug ?? game.pf2e.system.sluggify(spell.name ?? "");
    if (!slug) return;
    await actor.setFlag(MODULE_ID, MEMORY, { slug, name: spell.name, entries });
}

/**
 * Cut the Art loose from the grant that is about to be withdrawn.
 *
 * A Severing Art is granted by the Spirit feature predicated on `soulbound:severance`, so the instant
 * the Art ends Severance the `GrantItem` takes it straight back off the sheet — while its own chat card
 * is still sitting in the log waiting to be used. From then on the card cannot resolve its item, and
 * everything hanging off that resolution is gone with it: the damage button's target rows, the per-target
 * save buttons the outcome riders listen to, and the item `applyDamage` is handed.
 *
 * Ittō Kasō is where it shows worst — "creatures that fail can't regain Hit Points for 1 minute" is a
 * rider on a save that can no longer be rolled from the card.
 *
 * So the item is detached rather than kept alive artificially: clearing `flags.pf2e.grantedBy` makes it
 * an ordinary owned spell that the withdrawal no longer touches. It stays on the sheet as a spent thing,
 * which is honest — you did just use it — and `begin` clears it when the next Severance starts.
 * `beforeCast` already refuses an Art outside Severance, so a lingering copy cannot be fired twice.
 */
async function detachArt(actor, spell) {
    if (!spell?.id || !actor?.items?.get?.(spell.id)) return;
    const granterId = spell.flags?.pf2e?.grantedBy?.id;
    if (!granterId) return;

    // Both ends of the link, because a grant is recorded twice. The granted item names its granter, and
    // the granter keeps an `itemGrants` entry naming it back — and it is that second list the withdrawal
    // walks. Clearing only the first leaves the item exactly as revocable as it was.
    const granter = actor.items.get(granterId);
    if (granter) {
        const grants = granter.flags?.pf2e?.itemGrants ?? {};
        const key = Object.keys(grants).find((k) => grants[k]?.id === spell.id);
        if (key) await granter.update({ [`flags.pf2e.itemGrants.-=${key}`]: null });
    }
    await spell.update({
        "flags.pf2e.-=grantedBy": null,
        [`flags.${MODULE_ID}.severingArtSpent`]: true,
    });
}

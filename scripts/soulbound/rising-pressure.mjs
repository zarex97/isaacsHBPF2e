import { Reiatsu } from "./reiatsu.mjs";
import { SpiritWeapon } from "./weapon.mjs";

const MODULE_ID = "isaacs-hb-pf2e";

/**
 * Actors whose in-flight update is a loss of hit points.
 *
 * Written in `preUpdateActor`, where the old value still exists, and read in `updateActor`, where it no
 * longer does. A `WeakSet` rather than a flag on the actor: this is one tick of bookkeeping, not state
 * anyone should be able to find on a sheet.
 */
const tookDamage = new WeakSet();

/**
 * The whole of Rising Pressure, as arithmetic (guide §4.2).
 *
 * > Once per round, the first time you either deal damage to an enemy with your spirit weapon or take
 * > damage from an enemy, you regain 1 Reiatsu Point. You can't exceed your maximum pool, and over the
 * > course of a single encounter you can't regain more points this way than your maximum pool size.
 *
 * Four gates, and the fourth is the one guide §1.3 calls load-bearing: without the per-encounter ceiling
 * a long fight is an infinite pool, and the class stops being a focus user at all. Kept pure and exported
 * so the ceiling is pinned by a test rather than by whether anyone at the table noticed it paying out a
 * seventh time in a twelve-round boss fight.
 *
 * @param {object} state
 * @param {number} state.current         focus points held right now
 * @param {number} state.max             focus maximum
 * @param {number|null} state.round      the current combat round, or null out of combat
 * @param {number|null} state.roundStamp the round the last grant was made in
 * @param {number} state.gained          points granted so far this encounter
 * @param {number} state.cap             the per-encounter ceiling — normally `max`, +1 with Reiatsu Flood
 * @returns {0|1}
 */
export function grantFor({ current, max, round, roundStamp, gained, cap }) {
    if (round === null || round === undefined) return 0;
    if (roundStamp === round) return 0;
    if (current >= max) return 0;
    if (gained >= cap) return 0;
    return 1;
}

/**
 * The ceiling: the pool's maximum, plus 1 for each Reiatsu Flood taken.
 *
 * Guide §11.1 calls Reiatsu Flood "the single most dangerous feat in the class", which is exactly why it
 * is read here from the sheet rather than hard-coded anywhere: the ceiling is one number and it has one
 * home.
 */
function capFor(actor) {
    const max = actor.system?.resources?.focus?.max ?? 0;
    const flood = actor.itemTypes?.feat?.some((f) => f.system?.slug === "reiatsu-flood") ? 1 : 0;
    return max + flood;
}

async function tryGrant(actor) {
    if (!Reiatsu.isSoulbound(actor)) return;
    const focus = actor.system?.resources?.focus;
    if (!focus) return;

    const ledger = actor.getFlag(MODULE_ID, "risingPressure") ?? { round: null, gained: 0 };
    const round = game.combat?.round ?? null;

    const grant = grantFor({
        current: focus.value ?? 0,
        max: focus.max ?? 0,
        round,
        roundStamp: ledger.round,
        gained: ledger.gained ?? 0,
        cap: capFor(actor),
    });
    if (grant === 0) return;

    await actor.update({
        "system.resources.focus.value": (focus.value ?? 0) + grant,
        [`flags.${MODULE_ID}.risingPressure`]: { round, gained: (ledger.gained ?? 0) + grant },
    });
    ui.notifications.info(`${actor.name} regains 1 Reiatsu Point (Rising Pressure).`);
}

export const RisingPressure = {
    /** Exposed so a GM can clear a stuck ledger without reaching into flags by hand. */
    async resetLedger(actor) {
        await actor.setFlag(MODULE_ID, "risingPressure", { round: null, gained: 0 });
    },

    registerHooks() {
        // Damage taken from an enemy, in two halves.
        //
        // `updateActor` fires AFTER the update is applied, and by then `actor._source` already holds the
        // new hit points — so comparing the incoming value against it is always "equal", and the guard
        // rejects every single time. The old value only exists during `preUpdateActor`, so that is where
        // "was this damage?" is decided; the grant itself waits for the update to land, because it writes
        // to the same document.
        Hooks.on("preUpdateActor", (actor, changes) => {
            if (!game.user.isGM) return;
            const next = foundry.utils.getProperty(changes, "system.attributes.hp.value");
            if (typeof next !== "number") return;
            const current = actor.system?.attributes?.hp?.value ?? 0;
            if (next < current) tookDamage.add(actor);
        });

        // A GM-only guard, because a player cannot write to their own resources reliably mid-combat and
        // two clients both granting would pay the point twice.
        Hooks.on("updateActor", async (actor) => {
            if (!game.user.isGM) return;
            if (!tookDamage.delete(actor)) return;
            await tryGrant(actor);
        });

        // Damage dealt with the spirit weapon — not with a kidō, not with a fist, not with a borrowed
        // sword. The item that rolled the damage has to be the spirit weapon itself.
        Hooks.on("createChatMessage", async (message) => {
            if (!game.user.isGM) return;
            const actor = message.actor;
            if (!Reiatsu.isSoulbound(actor)) return;
            if (!message.isDamageRoll) return;
            const weapon = SpiritWeapon.weaponOf(actor);
            const origin = message.item;
            if (!weapon || !origin || origin.id !== weapon.id) return;
            await tryGrant(actor);
        });

        // A new encounter is a new ledger. Guide §4.2 meters the refill per encounter, so the count has
        // to be cleared when one starts — not when one ends, because a session can end mid-fight.
        Hooks.on("combatStart", async (combat) => {
            if (!game.user.isGM) return;
            for (const combatant of combat.combatants) {
                const actor = combatant.actor;
                if (!Reiatsu.isSoulbound(actor)) continue;
                await this.resetLedger(actor);
            }
        });
    },
};

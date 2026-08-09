import { MODULE_ID } from "../sky/signs.mjs";

export const FLAG = "recharge";

/**
 * The intervals pf2e writes down but never refills.
 *
 * `system.frequency.per` accepts `PT1M`, `PT10M`, `PT1H` and the rest, and the sheet shows them — but
 * `Actor#recharge` only takes `"turn" | "round" | "day"` (`actor/base.ts:2085`), so an ISO interval waits
 * for a full night's rest, where `Duration.fromISO(per) <= PT8H` sweeps it up with everything else. That is
 * the whole of backlog §4's "longer periods are on the honour system": not a missing concept, an
 * unimplemented interval.
 *
 * Foundry's `updateWorldTime` is the missing half, and it is a *core* hook — it fires whenever world time
 * moves, whoever moved it. pf2e's own World Clock drives it, and so does any calendar module, so nothing
 * here depends on one being installed.
 */
export const Recharge = {
    registerHooks() {
        Hooks.on("updateWorldTime", () => Recharge.onWorldTime());
        Hooks.on("updateItem", (item, changed) => Recharge.onItemUpdate(item, changed));
        // A Zenith day is our own unit of time; only the sky tracker knows when one turns over.
        Hooks.on(`${MODULE_ID}.skyChanged`, (state, previous) => Recharge.onSkyChanged(state, previous));
    },

    /**
     * Note when an allowance was spent.
     *
     * pf2e decrements `frequency.value` itself when an action is posted, and records nothing about when.
     * Stamping the world time here is what lets the refill be "an hour after you used it" rather than "on
     * the hour", which is what the Cloths actually say.
     */
    async onItemUpdate(item, changed) {
        if (!isTimekeeper()) return;
        const value = changed?.system?.frequency?.value;
        if (typeof value !== "number") return;
        if (!intervalSeconds(item.system?.frequency?.per)) return;

        if (value >= (item.system.frequency.max ?? 0)) {
            await item.unsetFlag(MODULE_ID, `${FLAG}.spentAt`);
        } else {
            await item.setFlag(MODULE_ID, `${FLAG}.spentAt`, game.time.worldTime);
        }
    },

    async onWorldTime() {
        if (!isTimekeeper()) return;
        const now = game.time.worldTime;

        for (const actor of game.actors) {
            const updates = [];
            for (const item of actor.items) {
                const frequency = item.system?.frequency;
                const seconds = intervalSeconds(frequency?.per);
                if (!seconds || frequency.value >= frequency.max) continue;

                // No stamp means the allowance was spent before this module was watching. Start the clock
                // now rather than refilling immediately, so a fresh world does not hand back every use.
                const spentAt = item.flags?.[MODULE_ID]?.[FLAG]?.spentAt;
                if (typeof spentAt !== "number") {
                    await item.setFlag(MODULE_ID, `${FLAG}.spentAt`, now);
                    continue;
                }
                if (now - spentAt < seconds) continue;

                updates.push({
                    _id: item.id,
                    "system.frequency.value": frequency.max,
                    [`flags.${MODULE_ID}.${FLAG}.-=spentAt`]: null,
                });
            }
            if (updates.length > 0) await actor.updateEmbeddedDocuments("Item", updates);
        }
    },

    /**
     * "Once per Zenith day."
     *
     * pf2e's `per: "day"` is close but resets on a rest, and a Zenith is a property of the sky rather than
     * of sleep — the whole point of the day being scheduled is that it is one particular day. So the
     * interval lives in our flag: `system.frequency.per` would have to be one of pf2e's own choices, and
     * this is not one of them.
     */
    async onSkyChanged(state, previous) {
        if (!isTimekeeper()) return;
        if (state?.day === previous?.day) return;

        for (const actor of game.actors) {
            const updates = actor.items
                .filter(
                    (item) =>
                        item.flags?.[MODULE_ID]?.[FLAG]?.per === "zenith-day" &&
                        (item.system?.frequency?.value ?? 0) < (item.system?.frequency?.max ?? 0),
                )
                .map((item) => ({ _id: item.id, "system.frequency.value": item.system.frequency.max }));
            if (updates.length > 0) await actor.updateEmbeddedDocuments("Item", updates);
        }
    },
};

/**
 * Seconds in one of pf2e's ISO frequency intervals, or zero for one it already handles itself.
 *
 * `turn`, `round` and `day` are deliberately excluded: the system recharges those on its own, and refilling
 * them here would hand back a use pf2e had every intention of taking.
 */
export function intervalSeconds(per) {
    const match = /^PT(\d+)([MH])$/.exec(String(per ?? ""));
    if (!match) return 0;
    return Number(match[1]) * (match[2] === "H" ? 3600 : 60);
}

/** One client does the refilling, or five players refill the same item five times. */
function isTimekeeper() {
    return game.users.activeGM?.id === game.user.id;
}

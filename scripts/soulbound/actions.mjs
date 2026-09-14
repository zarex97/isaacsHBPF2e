import { isAbilityUse } from "../riders/data.mjs";
import { Reiatsu } from "./reiatsu.mjs";
import { Release } from "./release.mjs";

const MODULE_ID = "isaacs-hb-pf2e";

/**
 * The bridge from "a Soulbound used an action" to the state machine that action drives.
 *
 * **This is the piece that was missing.** `release.mjs`, `blut.mjs`, `modes.mjs`, `charges.mjs` and
 * `hypnosis.mjs` were all written, unit-tested and exported on the module API — and none of them was
 * ever called. `Release.enter()` had no caller at all; the only hook registered for the release ladder
 * was `deleteCombat`, which calls `exit`. So the state was never entered, only left, and every Spirit's
 * Released Form had to be granted permanently at 1st level to appear on a sheet at all. A sealed
 * 1st-level Senbonzakura walked around with 15-foot reach, and a 13th-level one had its Bankai
 * standing, free, for ever.
 *
 * The riders pipeline (`riders/sources.mjs`) already listens for exactly this event and already knows
 * how to ignore a message's own follow-up rolls. It cannot carry the release ladder, though, because a
 * rider names **one fixed uuid** and the effect to apply here depends on which of fifteen Spirits the
 * character took. So the ladder gets its own listener on the same event, and content declares what to
 * wear rather than code learning fifteen names — see `Release.formEffectsFor`.
 *
 * Everything routed here is keyed on the item's **slug**, not its name, so renaming a feature in the
 * content does not silently unplug it.
 */

/** Slug → what to do with it. Kept as a table so adding a rung is one line, not a branch. */
const HANDLERS = {
    release: async (actor) => Release.release(actor),
    "full-release": async (actor) => Release.fullRelease(actor),
};

/** The item behind a chat message, whether it was posted from a sheet or by a macro. */
function itemOf(message) {
    return message?.item ?? null;
}

export const SoulboundActions = {
    /** Exposed so the rig can drive an action without a chat message in the way. */
    handlerFor(slug) {
        return HANDLERS[slug] ?? null;
    },

    registerHooks() {
        Hooks.on("createChatMessage", async (message) => {
            // GM-only, for the same reason Rising Pressure is: two clients both entering the state would
            // apply the effect twice and charge the point twice.
            if (!game.user.isGM) return;
            if (!isAbilityUse(message)) return;

            const item = itemOf(message);
            if (!item) return;
            const actor = message.actor;
            if (!Reiatsu.isSoulbound(actor)) return;

            const slug = item.system?.slug ?? game.pf2e.system.sluggify(item.name);
            const handler = HANDLERS[slug];
            if (!handler) return;

            try {
                await handler(actor, item, message);
            } catch (error) {
                console.error(`Isaac's Homebrew | "${slug}" could not be resolved`, error);
            }
        });
    },
};

export { MODULE_ID };

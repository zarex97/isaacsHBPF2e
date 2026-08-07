import { MODULE_ID } from "../sky/signs.mjs";
import { applyRiders } from "./apply.mjs";

const CHANNEL = `module.${MODULE_ID}`;

/**
 * Getting a rider onto a target's sheet.
 *
 * A player owns their Saint and nothing else, so they cannot write a condition onto the monster that just
 * failed its save — the request has to be carried out by a GM. Exactly one GM: `game.users.activeGM` is
 * Foundry's designated primary, so two GMs at the table do not both apply the same condition.
 *
 * The payload deliberately carries no rider data. It names a message, a target and an outcome, and the GM
 * reads the riders off the item themselves. A player therefore cannot ask for an effect the Technique does
 * not have, and a stale client cannot apply a rider that has since been edited out of the compendium.
 */
export const Relay = {
    listen() {
        game.socket.on(CHANNEL, async (payload) => {
            if (payload?.action !== "applyRiders") return;
            if (game.users.activeGM?.id !== game.user.id) return;
            await applyRiders(payload);
        });
    },

    async request(payload) {
        if (game.user.isGM && game.users.activeGM?.id === game.user.id) {
            return applyRiders(payload);
        }
        if (!game.users.activeGM) {
            return warnNoGM(payload);
        }
        game.socket.emit(CHANNEL, payload);
    },
};

/**
 * Failing loudly rather than quietly.
 *
 * With no GM online the riders cannot be applied at all, and the worst outcome is a table that believes
 * they were. Say what would have happened so it can be done by hand — which is exactly where this feature
 * started, so nothing is lost but the convenience.
 */
async function warnNoGM({ messageId, targetUuid, outcome }) {
    const message = game.messages.get(messageId);
    const target = await fromUuid(targetUuid);
    const name = target?.name ?? "the target";
    ui.notifications.warn(
        `${message?.item?.name ?? "This Technique"}: no GM is online, so ${name}'s ${outcome} riders were `
            + `not applied. Apply them by hand.`,
    );
}

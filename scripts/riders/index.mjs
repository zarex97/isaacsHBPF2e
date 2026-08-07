import { MODULE_ID } from "../sky/signs.mjs";
import { OUTCOMES, itemFor, ridersOn } from "./data.mjs";
import { Relay } from "./relay.mjs";

/**
 * The riders: what happens to a target *besides* damage when it fails its save.
 *
 * This is backlog item 1. A rule element lives on the Saint's sheet and cannot write a condition onto a
 * target's sheet, so "a creature that fails is slowed 1 for 1 round" has always been a line of text
 * someone had to notice and act on. Nothing about that is fixable from the item; it needs code that sees
 * the outcome and reaches the other actor.
 *
 * pf2e-toolbelt's Target Helper supplies the outcome: it rolls each target's save from the chat card and
 * announces the result on `pf2e-toolbelt.rollSave`. What is left is deciding which riders that outcome
 * earns, and getting them applied by someone with permission to write to the target — which is a GM,
 * always, because a player owns neither the monster nor usually the ally standing next to them.
 */
export const Riders = {
    registerSettings() {
        game.settings.register(MODULE_ID, "riders", {
            name: "Apply Technique riders automatically",
            hint: "When a target rolls its save from a chat card, apply the conditions the Technique inflicts "
                + "on that outcome. Requires pf2e-toolbelt's Target Helper, and a GM online.",
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
        });
    },

    registerHooks() {
        Relay.listen();
        Hooks.on("pf2e-toolbelt.rollSave", (payload) => Riders.onSave(payload));
        Hooks.on("pf2e-toolbelt.rerollSave", (payload) => Riders.onSave(payload));
    },

    /** Fires on the client that rolled, once per target. */
    async onSave({ message, target, data }) {
        if (!game.settings.get(MODULE_ID, "riders")) return;
        if (!message || !target || !OUTCOMES.includes(data?.success)) return;
        if (ridersOn(itemFor(message)).length === 0) return;

        await Relay.request({
            action: "applyRiders",
            messageId: message.id,
            targetUuid: target.uuid,
            outcome: data.success,
        });
    },
};

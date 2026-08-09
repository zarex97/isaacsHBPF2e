import { MODULE_ID } from "../sky/signs.mjs";
import { Relay } from "./relay.mjs";
import { Sources } from "./sources.mjs";

/**
 * Riders: what happens to a target *besides* damage.
 *
 * This is backlog §1. A rule element lives on the Saint's sheet and cannot write a condition onto a
 * target's sheet, so "a creature that fails is slowed 1 for 1 round" was always a line of text someone had
 * to notice and act on. Nothing about that is fixable from the item; it needs code that sees an outcome
 * and reaches the other actor.
 *
 * The shape is one pipeline, not one listener per feature. A handful of sources normalise what happened
 * into an event; the riders on the origin's items say what that event earns; a GM applies it. Adding
 * Virgo's sense loss or Pisces' garden is then a content change and a line in a table, rather than another
 * bespoke hook.
 */
export const Riders = {
    registerSettings() {
        game.settings.register(MODULE_ID, "riders", {
            name: "Apply Technique riders automatically",
            hint: "When a save is rolled, a Strike lands, or damage is applied, apply the conditions the "
                + "Technique or Cloth inflicts. Requires a GM online; saves rolled from a chat card also "
                + "require pf2e-toolbelt's Target Helper.",
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
        });
    },

    registerHooks() {
        Relay.listen();
        Sources.register();
        Hooks.on("renderChatMessageHTML", (message, html) => bindChoiceButtons(message, html));
        // Foundry <13 and any client still emitting the jQuery flavour of the hook.
        Hooks.on("renderChatMessage", (message, html) => bindChoiceButtons(message, html?.[0] ?? html));
    },
};

/** The buttons on a "choose a sense" card. Clicking relays the pick; the GM applies it. */
function bindChoiceButtons(message, html) {
    const choice = message?.flags?.[MODULE_ID]?.choice;
    if (!choice || !html?.querySelectorAll) return;

    for (const button of html.querySelectorAll(`[data-action="isaacs-hb-rider-choice"]`)) {
        button.addEventListener("click", async () => {
            for (const sibling of html.querySelectorAll(`[data-action="isaacs-hb-rider-choice"]`)) {
                sibling.disabled = true;
            }
            await Relay.request({
                action: "applyChoice",
                event: "choice",
                optionIndex: Number(button.dataset.option),
                ...choice,
            });
        });
    }
}

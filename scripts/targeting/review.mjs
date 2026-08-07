import { MODULE_ID } from "../sky/signs.mjs";
import { describe } from "./config.mjs";

const { DialogV2 } = foundry.applications.api;

/**
 * The last look before the Technique goes off.
 *
 * The area has already decided who is in it; this is only about who the caster *means*. It matters
 * because the alliance rules are guesses about intent — a charmed ally standing with the enemy is still
 * flagged `party` — and because a Technique like *Aiolos's Wings* catches more allies than it may take.
 * Everything the area rejected is listed too, with its reason, so a target going missing is never a
 * mystery the caster has to debug mid-turn.
 *
 * Returns the chosen token ids, or null if the caster called the whole thing off.
 */
export async function reviewTargets({ caught, rejected }, config) {
    if (caught.length === 0 && rejected.length === 0) {
        ui.notifications.info(`${config.item.name}: nothing in the area.`);
        return [];
    }

    if (!game.settings.get(MODULE_ID, "areaTargetingReview")) {
        return caught.filter((entry) => entry.checked).map((entry) => entry.token.id);
    }

    const content = await foundry.applications.handlebars.renderTemplate(
        `modules/${MODULE_ID}/templates/area-targets.hbs`,
        {
            name: config.item.name,
            img: config.item.img,
            rule: describe(config),
            caught: caught.map(({ token, checked, note }) => ({
                id: token.id,
                name: token.document.name,
                img: token.document.texture?.src ?? token.actor?.img,
                checked,
                note,
            })),
            rejected: rejected.map(({ token, reason }) => ({
                id: token.id,
                name: token.document.name,
                img: token.document.texture?.src ?? token.actor?.img,
                reason,
            })),
        },
    );

    return DialogV2.wait({
        window: { title: "Confirm targets", icon: "fa-solid fa-crosshairs" },
        classes: ["isaacs-hb-pf2e", "area-targets"],
        position: { width: 420 },
        content,
        buttons: [
            {
                action: "confirm",
                label: "Target and cast",
                icon: "fa-solid fa-crosshairs",
                default: true,
                callback: (_event, _button, dialog) =>
                    Array.from(
                        dialog.element.querySelectorAll(`input[name="target"]:checked`),
                        (input) => input.value,
                    ),
            },
            { action: "cancel", label: "Cancel", icon: "fa-solid fa-ban", callback: () => null },
        ],
        render: (_event, dialog) => highlightOnHover(dialog.element),
        rejectClose: false,
    }).then((result) => result ?? null);
}

/** Hovering a row lights the token up on the canvas, so a name in the list is never ambiguous. */
function highlightOnHover(html) {
    for (const row of html.querySelectorAll("li[data-token-id]")) {
        const token = canvas.tokens.get(row.dataset.tokenId);
        if (!token) continue;
        row.addEventListener("mouseenter", () => {
            try {
                token._onHoverIn(new PointerEvent("pointerenter"), { hoverOutOthers: true });
            } catch {
                /* hover is a nicety; never let it break the dialog */
            }
        });
        row.addEventListener("mouseleave", () => {
            try {
                token._onHoverOut(new PointerEvent("pointerleave"));
            } catch {
                /* as above */
            }
        });
    }
}

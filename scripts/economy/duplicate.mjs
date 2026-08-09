import { MODULE_ID } from "../sky/signs.mjs";

export const FLAG = "duplicate";

/**
 * Gemini's Zenith duplicate.
 *
 * *"A duplicate of you appears in an adjacent space at the start of each of your turns. It has your
 * statistics, acts on your initiative with 2 actions and can only Strike and Stride, and vanishes at the
 * start of your next turn. One at a time."*
 *
 * The backlog called this "a second actor, not a modifier", and that is exactly right — which is why it is
 * a token rather than an effect. Everything else follows from the text: the old one is deleted before the
 * new one is made, which covers both "vanishes at the start of your next turn" and "one at a time" in a
 * single step; and no combatant is added, because it acts on the Saint's initiative and a second row in the
 * tracker would be wrong.
 *
 * Two of the restrictions are enforced rather than noted, because the module already owns the choke point:
 * the duplicate's focus pool is emptied when it is made, and the `cast` wrapper refuses to cast for it.
 * "Strike and Stride only" stays a note, because Foundry gates neither movement nor skill actions.
 */
export const Duplicate = {
    registerHooks() {
        Hooks.on("pf2e.startTurn", (combatant) => Duplicate.onTurnStart(combatant));
        Hooks.on("deleteCombat", (combat) => Duplicate.clearAll(combat));
    },

    /** True for a token this module spawned — the `cast` wrapper asks before letting a spell through. */
    isDuplicate(actor) {
        return actor?.token?.flags?.[MODULE_ID]?.[FLAG] === true;
    },

    async onTurnStart(combatant) {
        if (game.users.activeGM?.id !== game.user.id) return;
        const actor = combatant?.actor;
        const token = combatant?.token;
        if (!actor || !token?.parent) return;

        // Always sweep first: the Saint may have lost the boon since last turn, and a duplicate left
        // standing after the sky changes is worse than one that never appeared.
        await Duplicate.clearFor(token.parent, actor.uuid);

        const source = actor.items.find((item) => item.flags?.[MODULE_ID]?.[FLAG]);
        if (!source) return;

        const square = adjacentFreeSquare(token);
        if (!square) {
            ui.notifications.warn(
                `${actor.name}: no free space adjacent for the Gemini duplicate. Place it by hand.`,
            );
            return;
        }

        const document = await actor.getTokenDocument({
            ...square,
            name: `${token.name} (Duplicate)`,
            actorLink: false,
            disposition: token.disposition,
            flags: { [MODULE_ID]: { [FLAG]: true, origin: actor.uuid } },
        });

        const [created] = await token.parent.createEmbeddedDocuments("Token", [document.toObject()]);
        if (!created?.actor) return;

        // No Focus Points, per the text. The `cast` refusal covers Techniques; this covers the pool itself.
        if (created.actor.system?.resources?.focus) {
            await created.actor.update({ "system.resources.focus.value": 0 });
        }
        const note = source.flags[MODULE_ID][FLAG];
        if (note?.effect) {
            const effect = (await fromUuid(note.effect))?.toObject();
            if (effect) await created.actor.createEmbeddedDocuments("Item", [effect]);
        }
    },

    async clearFor(scene, originUuid) {
        const stale = scene.tokens.filter(
            (t) => t.flags?.[MODULE_ID]?.[FLAG] === true && t.flags[MODULE_ID].origin === originUuid,
        );
        if (stale.length > 0) {
            await scene.deleteEmbeddedDocuments("Token", stale.map((t) => t.id));
        }
    },

    /** Combat ending should not leave duplicates standing around on the map. */
    async clearAll(combat) {
        if (game.users.activeGM?.id !== game.user.id) return;
        const scene = combat?.scene ?? canvas?.scene;
        const stale = scene?.tokens.filter((t) => t.flags?.[MODULE_ID]?.[FLAG] === true) ?? [];
        if (stale.length > 0) await scene.deleteEmbeddedDocuments("Token", stale.map((t) => t.id));
    },
};

/** The first unoccupied square touching the token, read clockwise from the north-west corner. */
function adjacentFreeSquare(token) {
    const grid = canvas?.grid;
    if (!grid || token.parent?.id !== canvas.scene?.id) return null;

    const width = Math.max(1, Math.round(token.width));
    const height = Math.max(1, Math.round(token.height));
    const occupied = new Set(
        token.parent.tokens.flatMap((other) => {
            const w = Math.max(1, Math.round(other.width));
            const h = Math.max(1, Math.round(other.height));
            const squares = [];
            for (let i = 0; i < w; i++) {
                for (let j = 0; j < h; j++) {
                    squares.push(`${other.x + i * grid.sizeX},${other.y + j * grid.sizeY}`);
                }
            }
            return squares;
        }),
    );

    for (let i = -1; i <= width; i++) {
        for (let j = -1; j <= height; j++) {
            if (i >= 0 && i < width && j >= 0 && j < height) continue; // inside the token itself
            const x = token.x + i * grid.sizeX;
            const y = token.y + j * grid.sizeY;
            if (occupied.has(`${x},${y}`)) continue;
            if (x < 0 || y < 0 || x >= canvas.dimensions.width || y >= canvas.dimensions.height) continue;
            return { x, y };
        }
    }
    return null;
}

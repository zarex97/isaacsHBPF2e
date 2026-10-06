import { Relay } from "../automation.mjs";
import { MODULE_ID } from "../sky/signs.mjs";
import { bondActive } from "./bonds.mjs";
import { depthOf } from "./damage.mjs";
import { classSlugOf } from "../lib/class-dc.mjs";

/**
 * The Shove push: the forced movement an Assimilator causes, moved on the board rather than described.
 *
 * pf2e's Shove says *"push it up to 5 feet away from you"* (10 on a critical success) and leaves the moving to the
 * table. Three clauses add to that and were Notes on the Athletics card as a result (#85):
 *
 * - Iron Depth 3 — *"forced movement you cause increases by 5 feet"*;
 * - Siege Frame (Iron + Steel) — *"forced movement you cause increases by an additional 10 feet"*;
 * - Iron Depth 4 — *"a creature you Shove into a wall, hazard or another creature takes bludgeoning damage equal to
 *   your level."*
 *
 * So a successful Shove posts a card with one **Push** button for the full distance (#85, Q5): the creature is
 * moved straight away from the Assimilator, a square at a time, and stops short of a wall or another token. Stopping
 * against one of those is the collision Iron Depth 4 pays for. The move is the GM's — only a GM may move a token
 * that is not theirs — so the button asks through the relay, and the GM re-reads the Shove it came from.
 */

const CARD = "assimilatorPush";
const FEET_PER_SQUARE = () => canvas.scene?.grid?.distance ?? 5;

function isWriter() {
    return game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM;
}

/** A successful Shove made by an Assimilator, and the creature it was made against — or null. */
function shoveOf(message) {
    const context = message?.flags?.pf2e?.context;
    if (context?.type !== "skill-check" || !context.options?.includes?.("action:shove")) return null;
    if (!["success", "criticalSuccess"].includes(context.outcome)) return null;
    const actor = message.actor;
    if (classSlugOf(actor) !== "assimilator") return null;
    const target = context.target?.token ? fromUuidSync(context.target.token) : null;
    if (!target) return null;
    return { actor, target, critical: context.outcome === "criticalSuccess" };
}

/** How far this Assimilator's Shove moves a creature, in feet, and what added to it. */
export function pushDistance(actor, critical) {
    const parts = [[critical ? "Shove (critical)" : "Shove", critical ? 10 : 5]];
    if (depthOf(actor, "iron") >= 3) parts.push(["Iron", 5]);
    if (bondActive(actor, "siege-frame")) parts.push(["Siege Frame", 10]);
    return { feet: parts.reduce((n, [, f]) => n + f, 0), parts };
}

/** One step of 8, straight away from `from` towards `to`, in grid squares. */
function awayStep(from, to) {
    const angle = Math.atan2(to.y - from.y, to.x - from.x);
    const snapped = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4);
    return { dx: Math.round(Math.cos(snapped)), dy: Math.round(Math.sin(snapped)) };
}

/** The token standing in the rectangle `rect`, other than `self` — the creature or hazard a push runs into. */
function occupant(rect, self) {
    return canvas.scene.tokens.find((t) => t.id !== self.id && !t.hidden
        && t._source.x < rect.x + rect.w && rect.x < t._source.x + (t.width ?? 1) * canvas.grid.size
        && t._source.y < rect.y + rect.h && rect.y < t._source.y + (t.height ?? 1) * canvas.grid.size) ?? null;
}

/**
 * Walk `target` away from `shover` for up to `feet`, a square at a time. Returns where it stops and what stopped it:
 * `wall`, `hazard`, `creature`, or null when it went the whole way.
 */
export function planPush(shover, target, feet) {
    const size = canvas.grid.size;
    const w = (target.width ?? 1) * size;
    const h = (target.height ?? 1) * size;
    const centre = (x, y) => ({ x: x + w / 2, y: y + h / 2 });
    const from = { x: shover._source.x + ((shover.width ?? 1) * size) / 2, y: shover._source.y + ((shover.height ?? 1) * size) / 2 };
    const step = awayStep(from, centre(target._source.x, target._source.y));
    let { x, y } = target._source;
    let hit = null;
    let blocker = null;
    const squares = Math.floor(feet / FEET_PER_SQUARE());
    for (let i = 0; i < squares; i++) {
        const nx = x + step.dx * size;
        const ny = y + step.dy * size;
        if (nx < 0 || ny < 0 || nx + w > canvas.dimensions.width || ny + h > canvas.dimensions.height) break;
        if (CONFIG.Canvas.polygonBackends.move.testCollision(centre(x, y), centre(nx, ny), { type: "move", mode: "any" })) {
            hit = "wall";
            break;
        }
        const other = occupant({ x: nx, y: ny, w, h }, target);
        if (other) {
            hit = other.actor?.type === "hazard" ? "hazard" : "creature";
            blocker = other;
            break;
        }
        x = nx;
        y = ny;
    }
    const moved = Math.round(Math.hypot(x - target._source.x, y - target._source.y) / size) * FEET_PER_SQUARE();
    return { x, y, moved, hit, blocker };
}

export const Shove = {
    registerHooks() {
        Relay.register(CARD, (payload) => Shove.push(payload));
        Hooks.on("createChatMessage", (message) => {
            if (isWriter()) Shove.offer(message).catch((e) => console.error("Isaac's Homebrew | Shove", e));
        });
        Hooks.on("renderChatMessageHTML", (message, html) => Shove.bind(message, html));
    },

    /** A successful Shove: post the Push card beside it. */
    async offer(message) {
        const shove = shoveOf(message);
        if (!shove) return null;
        const { feet, parts } = pushDistance(shove.actor, shove.critical);
        const detail = parts.map(([why, f]) => `${why} ${f}`).join(" + ");
        return ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: shove.actor }),
            flags: { [MODULE_ID]: { [CARD]: { shove: message.id, feet } } },
            content: `<p><strong>Shove</strong>: ${shove.target.name} can be pushed <strong>${feet} feet</strong> `
                + `straight away (${detail}).</p><button type="button" data-action="isaacs-hb-push">Push ${feet} ft</button>`,
        });
    },

    bind(message, html) {
        const card = message?.flags?.[MODULE_ID]?.[CARD];
        if (!card || !html?.querySelector || html.dataset?.isaacsHbPushBound) return;
        html.dataset.isaacsHbPushBound = "1";
        const button = html.querySelector(`[data-action="isaacs-hb-push"]`);
        if (!button) return;
        if (card.done || !message.isOwner) button.disabled = true;
        button.addEventListener("click", async () => {
            button.disabled = true;
            await Relay.request({ action: CARD, messageId: message.id });
        });
    },

    /** The GM moves the creature — once per card, re-reading the Shove it came from. */
    async push({ messageId }) {
        const card = game.messages.get(messageId);
        const flag = card?.flags?.[MODULE_ID]?.[CARD];
        if (!flag || flag.done) return null;
        const shove = shoveOf(game.messages.get(flag.shove));
        if (!shove) return null;
        await card.update({ [`flags.${MODULE_ID}.${CARD}.done`]: true });
        const shover = shove.actor.getActiveTokens(true, true)[0];
        if (!shover) return null;
        const { feet } = pushDistance(shove.actor, shove.critical);
        const plan = planPush(shover, shove.target, feet);
        if (plan.moved > 0) await shove.target.update({ x: plan.x, y: plan.y }, { animate: false });

        const lines = [`${shove.target.name} is pushed <strong>${plan.moved} feet</strong>`
            + (plan.hit ? ` and stopped by ${plan.hit === "wall" ? "a wall" : plan.blocker?.name ?? `a ${plan.hit}`}.` : ".")];
        // Iron Depth 4: into a wall, hazard or another creature — bludgeoning equal to your level.
        if (plan.hit && depthOf(shove.actor, "iron") >= 4 && shove.target.actor) {
            const DamageRoll = CONFIG.Dice.rolls.find((c) => c.name === "DamageRoll");
            const roll = await new DamageRoll(`${shove.actor.level}[bludgeoning]`).evaluate();
            await shove.target.actor.applyDamage({ damage: roll, token: shove.target });
            lines.push(`<strong>Iron</strong>: it hits hard — <strong>${shove.actor.level}</strong> bludgeoning.`);
        }
        await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: shove.actor }),
            flags: { [MODULE_ID]: { assimilatorPushed: { moved: plan.moved, hit: plan.hit } } },
            content: `<p>${lines.join(" ")}</p>` });
        return plan;
    },
};

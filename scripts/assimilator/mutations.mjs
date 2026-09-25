/**
 * Mutations that happen on a clock or on movement rather than on a roll.
 *
 * - **Moved 10 feet this turn** (Carnelian Depth 2, Bronze Depth 2). pf2e knows where a token is, not how far
 *   it came, so the distance is summed from each move during the creature's own turn and written as the roll
 *   option `self:moved-10-feet-this-turn` — `self:`-prefixed so rolls against it see it too, and cleared when
 *   its next turn starts.
 * - **Hematite, Depth 2**: temporary Hit Points equal to your level at the start of each encounter.
 */

const MOVED = "self:moved-10-feet-this-turn";
const PATH = `flags.pf2e.rollOptions.all.${MOVED}`;

/** Distance moved this turn, by token id, stamped with the turn it belongs to. */
const travelled = new Map();
const origins = new Map();

function isWriter() {
    return game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM;
}

function turnKey(combat) {
    return combat ? `${combat.id}:${combat.round}:${combat.turn}` : null;
}

function depthOf(actor, slug) {
    const m = actor?.getRollOptions?.().map((o) => new RegExp(`^self:effect:substrate-${slug}:(\\d+)$`).exec(o)).find(Boolean);
    return m ? Number(m[1]) : 0;
}

export const Mutations = {
    registerHooks() {
        Hooks.on("preUpdateToken", (token, change) => {
            if ("x" in change || "y" in change) origins.set(token.id, { x: token._source.x, y: token._source.y });
        });
        Hooks.on("updateToken", (token, change, _options, userId) => {
            if (game.user.id !== userId || !("x" in change || "y" in change)) return;
            Mutations.onMove(token).catch((e) => console.error("Isaac's Homebrew | movement tracking failed", e));
        });
        const clear = (combatant) => {
            const actor = combatant?.actor;
            travelled.delete(combatant?.tokenId);
            if (isWriter() && actor?.flags?.pf2e?.rollOptions?.all?.[MOVED]) {
                actor.update({ [`flags.pf2e.rollOptions.all.-=${MOVED}`]: null });
            }
        };
        Hooks.on("pf2e.startTurn", clear);
        Hooks.on("pf2e.endTurn", clear);
        Hooks.on("combatStart", (combat) => {
            if (isWriter()) Mutations.ferrousBlood(combat).catch((e) => console.error("Isaac's Homebrew | Hematite failed", e));
        });
    },

    /** Add a move to the mover's tally for this turn; mark it once it reaches 10 feet. */
    async onMove(token) {
        const from = origins.get(token.id);
        origins.delete(token.id);
        // The encounter whose current turn is this token's — not `game.combat`, which is only what the tracker
        // is showing.
        const combat = game.combats?.find((c) => c.started && c.combatant?.tokenId === token.id);
        if (!combat || !from) return;
        const size = canvas.grid.size;
        const offset = { x: (token.width * size) / 2, y: (token.height * size) / 2 };
        const distance = canvas.grid.measurePath([
            { x: from.x + offset.x, y: from.y + offset.y },
            { x: token._source.x + offset.x, y: token._source.y + offset.y },
        ]).distance;
        const key = turnKey(combat);
        const prior = travelled.get(token.id);
        const total = (prior?.key === key ? prior.total : 0) + distance;
        travelled.set(token.id, { key, total });
        const actor = token.actor;
        if (total >= 10 && actor?.isOwner && !actor.flags?.pf2e?.rollOptions?.all?.[MOVED]) {
            await actor.update({ [PATH]: true });
        }
        return total;
    },

    /** Hematite Depth 2. Returns the actors granted temporary Hit Points. */
    async ferrousBlood(combat) {
        const granted = [];
        for (const combatant of combat.combatants) {
            const actor = combatant.actor;
            if (depthOf(actor, "hematite") < 2) continue;
            const options = new Set(actor.getRollOptions());
            if (depthOf(actor, "hematite") >= 3 && !options.has("carapace:intact")) continue;
            if ((actor.attributes.hp.temp ?? 0) >= actor.level) continue;
            await actor.update({ "system.attributes.hp.temp": actor.level });
            granted.push(actor.name);
        }
        return granted;
    },
};

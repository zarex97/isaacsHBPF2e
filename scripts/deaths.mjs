import { MODULE_ID } from "./sky/signs.mjs";

const SETTING = "deathLog";

/** Nothing in the content looks back further than an hour; a day of history is a generous margin. */
const KEEP_SECONDS = 86400;
const KEEP_ENTRIES = 500;

/** Actors whose hit points are about to reach zero, noticed in `preUpdateActor`, recorded in `updateActor`. */
const dying = new Map();

/**
 * Where people have died, and when.
 *
 * *Sekishiki Konsō Ha* — "Soul Burial Waves" — is the only thing in the class that asks the map a question
 * about the past: *"+1d8 for every creature that has died in this area within the last hour, maximum
 * +5d8."* Nothing in Foundry remembers that. A dead NPC's token is usually deleted, and a dead player
 * character's has moved on; by the time the Cancer Saint takes the spirits as gunpowder there is nothing
 * left on the board to count.
 *
 * So the deaths are written down as they happen: a scene, a point, a moment. It is a small register and it
 * is pruned, because it exists to answer one Technique's question rather than to be a campaign log.
 *
 * Hit points reaching zero is the definition used, which is also what the rest of the module means by
 * death — `applyDeath` reduces a creature to zero and marks it defeated, and the Cancer Ascendant Boon
 * turns exactly that moment into a killing. Recording on the same event keeps the two consistent.
 */
export const Deaths = {
    registerSettings() {
        game.settings.register(MODULE_ID, SETTING, {
            scope: "world",
            config: false,
            type: Array,
            default: [],
        });
    },

    registerHooks() {
        Hooks.on("preUpdateActor", (actor, changes) => {
            const next = changes?.system?.attributes?.hp?.value;
            if (typeof next !== "number" || next > 0) return;
            if ((actor.system?.attributes?.hp?.value ?? 0) <= 0) return; // already down
            dying.set(actor.id, actor);
        });
        Hooks.on("updateActor", (actor) => {
            if (dying.delete(actor.id)) return Deaths.record(actor);
        });
    },

    entries() {
        const stored = game.settings.get(MODULE_ID, SETTING);
        return Array.isArray(stored) ? stored : [];
    },

    /** One death, at the token's own square. Active GM only, so a full table writes one entry. */
    async record(actor) {
        if (game.users?.activeGM?.id !== game.user?.id) return;
        const token = actor.getActiveTokens?.(false, true)?.at(0);
        const scene = token?.parent;
        if (!token || !scene) return;

        const now = game.time.worldTime;
        const entry = {
            sceneId: scene.id,
            // The centre of the space, not its corner: containment is tested at the centre of a square, so
            // storing the anchor would put a large creature's death outside an area it plainly died in.
            x: (token._source?.x ?? token.x) + (token.width * scene.grid.size) / 2,
            y: (token._source?.y ?? token.y) + (token.height * scene.grid.size) / 2,
            time: now,
            name: token.name,
        };

        const kept = [...Deaths.entries(), entry]
            .filter((row) => now - row.time <= KEEP_SECONDS)
            .slice(-KEEP_ENTRIES);
        await game.settings.set(MODULE_ID, SETTING, kept);
    },

    /**
     * How many died inside this area, recently enough to count.
     *
     * Tested against the Region's polygon tree for the same reason `catchTokens` is: the area being asked
     * about has not been saved, so it has no `tokens` collection and no placeable — but its geometry is
     * derived from its shapes and is available immediately.
     */
    countIn(region, { sceneId, withinSeconds = 3600, max = Infinity } = {}) {
        const tree = region?.polygonTree;
        if (!tree) return 0;
        const now = game.time.worldTime;
        const scene = sceneId ?? canvas?.scene?.id;

        let found = 0;
        for (const entry of Deaths.entries()) {
            if (entry.sceneId !== scene) continue;
            if (now - entry.time > withinSeconds) continue;
            if (!tree.testPoint({ x: entry.x, y: entry.y })) continue;
            if (++found >= max) return max;
        }
        return found;
    },

    /**
     * Write the count where a rule element can read it.
     *
     * `DamageDice#diceNumber` is a resolvable field, so a Technique can carry
     * `"@actor.flags.isaacs-hb-pf2e.soulDice"` and be scaled by a number this module puts on the actor a
     * moment before the cast. That beats creating and destroying an ephemeral effect around every cast:
     * there is no window in which the effect can be orphaned by an error, and no second data preparation.
     *
     * The flag is per-Technique-cast and overwritten by the next one. It only ever reaches a rule that is
     * predicated on the Technique's own damage selector, so a stale value between casts is unreachable.
     */
    async tally(config, region) {
        const spec = config.item?.flags?.[MODULE_ID]?.souls;
        const actor = config.item?.actor;
        if (!spec || !actor || !region) return 0;

        const count = Deaths.countIn(region, {
            sceneId: canvas?.scene?.id,
            withinSeconds: Number(spec.withinSeconds) || 3600,
            max: Number(spec.max) || Infinity,
        });

        const path = `flags.${MODULE_ID}.${spec.flag ?? "soulDice"}`;
        if ((foundry.utils.getProperty(actor, path) ?? 0) !== count) await actor.update({ [path]: count });
        if (count > 0) {
            ui.notifications.info(
                `${config.item.name}: ${count} soul${count === 1 ? "" : "s"} in the area — +${count}d8.`,
            );
        }
        return count;
    },
};

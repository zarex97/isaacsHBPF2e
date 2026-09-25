import { DamageBus, PRIORITY } from "./damage-bus.mjs";

/**
 * "A creature that has already lost Hit Points this encounter" — as a roll option on the creature.
 *
 * Red's Instinct doubles against one, Garnet adds a die against one, Iron's grapples are easier against one.
 * pf2e knows a creature's current Hit Points but not whether they fell *during this fight*: a monster that
 * walked in wounded is not bloodied by you, and `hp-percent` cannot tell the two apart.
 *
 * So the damage bus marks it the moment it happens. The option is written into the creature's persistent
 * roll-option toggles (`flags.pf2e.rollOptions.all`), which pf2e folds into its roll options, so anything
 * rolled against it sees `target:damaged-this-encounter`. The encounter's end clears it for everyone in it.
 */

/**
 * `self:`-prefixed on purpose: pf2e builds a target's options with `getSelfRollOptions("target")`, which keeps
 * only keys that begin `self:` and renames them. A bare `damaged-this-encounter` is on the creature and never
 * reaches a roll made against it — driven live, the mark was set and Red's doubling still did not fire.
 */
export const OPTION = "self:damaged-this-encounter";
const PATH = `flags.pf2e.rollOptions.all.${OPTION}`;

/** `applyDamage` may run on a token's contextual clone; write to the document behind it. */
function liveActor(actor, params) {
    const passed = params?.token?.document ?? params?.token ?? null;
    return passed?.actor ?? actor.token?.actor ?? (actor.id ? game.actors?.get(actor.id) : null) ?? actor;
}

export const EncounterDamage = {
    registerHooks() {
        DamageBus.after("damaged this encounter", PRIORITY.encounterDamage, async (actor, params, before) => {
            if (!game.combat?.started) return;
            const live = liveActor(actor, params);
            if (!live?.isOwner) return;
            // *This* encounter: a creature standing outside the fight is not in it, however it is hurt.
            const inIt = game.combat.combatants.some((c) => (c.token?.actor ?? c.actor) === live || c.actor?.id === live.id);
            if (!inIt) return;
            const now = live.hitPoints?.value ?? before;
            if (now >= before || live.flags?.pf2e?.rollOptions?.all?.[OPTION]) return;
            await live.update({ [PATH]: true });
        });

        Hooks.on("deleteCombat", async (combat) => {
            if (!game.user.isGM) return;
            for (const combatant of combat.combatants) {
                const actor = combatant.token?.actor ?? combatant.actor;
                if (actor?.flags?.pf2e?.rollOptions?.all?.[OPTION]) {
                    await actor.update({ [`flags.pf2e.rollOptions.all.-=${OPTION}`]: null });
                }
            }
        });
    },
};

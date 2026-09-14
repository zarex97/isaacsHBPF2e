import { Reiatsu } from "./reiatsu.mjs";
import { Release } from "./release.mjs";

const MODULE_ID = "isaacs-hb-pf2e";

/**
 * Standing back up at one Hit Point.
 *
 * > **Unbroken Chain** (feat 16) — When you would be reduced to 0 HP while released, spend 1 Reiatsu
 * > Point to remain at 1 HP instead. Once per day. — guide §8.5
 *
 * Every condition in that sentence is checked here because no rule element can reach any of them: pf2e
 * has no "when reduced to zero" hook, the release state is a module flag, and the cost is a pool the
 * feat does not own. It shipped as a `RollOption` nothing read.
 *
 * **`preUpdateActor` is the only place this can live.** By `updateActor` the hit points are already
 * zero, the dying condition is already being applied, and changing the number afterwards would leave a
 * character who is simultaneously at 1 HP and dying. Rewriting the incoming value is the whole trick,
 * and it is the same reason Rising Pressure decides "was this damage?" there.
 *
 * `The Miracle`'s Vollständig has the same shape at a different price — 5 Miracle points rather than a
 * Reiatsu Point, and repeatable — so this is written to read its conditions from the feat rather than
 * to know one feat's name. A second refusal-to-die declares itself and needs no code here.
 */
export function shouldCatch({ next, current, released, points, usesLeft }) {
    if (typeof next !== "number" || next > 0) return false;
    if (current <= 0) return false;          // already down: this is not the moment it happens
    if (!released) return false;
    if (points < 1) return false;
    return usesLeft > 0;
}

export const UnbrokenChain = {
    registerHooks() {
        Hooks.on("preUpdateActor", (actor, changes) => {
            if (!game.user.isGM) return;
            if (!Reiatsu.isSoulbound(actor)) return;

            const next = foundry.utils.getProperty(changes, "system.attributes.hp.value");
            const feat = actor.itemTypes.feat.find((f) => f.system?.slug === "unbroken-chain");
            if (!feat) return;

            const caught = shouldCatch({
                next,
                current: actor.system?.attributes?.hp?.value ?? 0,
                released: Release.stateOf(actor) !== "sealed",
                points: actor.system?.resources?.focus?.value ?? 0,
                usesLeft: feat.system?.frequency?.value ?? 0,
            });
            if (!caught) return;

            // Rewrite the update in flight: one hit point instead of none.
            foundry.utils.setProperty(changes, "system.attributes.hp.value", 1);
            foundry.utils.setProperty(
                changes,
                "system.resources.focus.value",
                Math.max(0, (actor.system.resources.focus.value ?? 0) - 1),
            );

            // The frequency is pf2e's own daily counter, so it recharges with everything else.
            feat.update({ "system.frequency.value": (feat.system.frequency.value ?? 1) - 1 });
            ChatMessage.create({
                speaker: ChatMessage.getSpeaker({ actor }),
                content: `<p><strong>Unbroken Chain.</strong> ${actor.name} spends a Reiatsu Point and `
                    + "stands at <strong>1 Hit Point</strong>.</p>",
            });
        });
    },
};

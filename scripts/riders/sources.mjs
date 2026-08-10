import { describeActor, describeDamage } from "../lib/roll-options.mjs";
import { wrap } from "../lib/wrap.mjs";
import { MODULE_ID } from "../sky/signs.mjs";
import {
    bypassEntriesOn,
    ignoresHardness,
    mergeBypass,
    resistanceReduction,
    selectEntries,
    shadowTarget,
} from "./bypass.mjs";
import { OUTCOMES, ridersOn } from "./data.mjs";
import { Relay } from "./relay.mjs";

/**
 * Where events come from.
 *
 * Each of these does the same small job: notice that something happened, work out the four things a rider
 * needs — which event, whose item, which target, what outcome — and hand it to the relay. None of them
 * decides what to apply; that is the GM's side, reading the riders off the item itself.
 *
 * Every source fires on exactly one client, which is what keeps a rider from being applied five times at a
 * five-player table. For chat messages that is the message's author; for `applyDamage` it is whoever
 * clicked apply; for turns it is the active GM.
 */
export const Sources = {
    register() {
        // Saves, via pf2e-toolbelt's Target Helper. Fires on the client that rolled.
        Hooks.on("pf2e-toolbelt.rollSave", (payload) => Sources.onSave(payload));
        Hooks.on("pf2e-toolbelt.rerollSave", (payload) => Sources.onSave(payload));

        Hooks.on("createChatMessage", (message, _options, userId) => Sources.onMessage(message, userId));
        Hooks.on("pf2e.endTurn", (combatant) => Sources.onTurn("turn-end", combatant));
        Hooks.on("pf2e.startTurn", (combatant) => Sources.onTurn("turn-start", combatant));

        Sources.wrapApplyDamage();
    },

    async onSave({ message, target, data }) {
        if (!enabled() || !message || !target || !OUTCOMES.includes(data?.success)) return;
        await Relay.request({
            action: "applyRiders",
            event: "save-rolled",
            messageId: message.id,
            targetUuid: target.uuid,
            outcome: data.success,
        });
    },

    /**
     * Strikes.
     *
     * The attack-roll message already carries the degree of success and the token that was attacked, so no
     * wrapping is needed. Two events come out of one message, because "when you hit" and "when something
     * hits you" are both things a Cloth says: Capricorn severs on its own critical hit, Pisces' roses
     * answer somebody else's.
     */
    async onMessage(message, userId) {
        if (!enabled() || game.user.id !== userId) return;
        const context = message?.flags?.pf2e?.context;
        if (context?.type !== "attack-roll" || !OUTCOMES.includes(context.outcome)) {
            return Sources.onActionUsed(message);
        }

        const attackerUuid = message.actor?.uuid;
        const targetUuid = context.target?.token;
        if (!attackerUuid || !targetUuid) return;

        await Relay.request({
            action: "applyRiders",
            event: "strike-resolved",
            messageId: message.id,
            originUuid: attackerUuid,
            targetUuid,
            outcome: context.outcome,
        });

        // The mirror image: the defender's own items get a look, with origin and target swapped.
        await Relay.request({
            action: "applyRiders",
            event: "strike-received",
            messageId: message.id,
            originUuid: targetUuid,
            targetUuid: attackerUuid,
            outcome: context.outcome,
        });
    },

    /**
     * An action or ability posted to chat.
     *
     * This is how the Zenith activities and *The Twelve Arms* reach their targets. Area targeting has just
     * run for them — it wraps `toMessage` as well as `cast` — so `game.user.targets` is the set the caster
     * confirmed, and reading it here is reading their answer rather than guessing at one.
     *
     * Spells qualify too. A Technique's *save* riders come through `save-rolled` when the target rolls, but
     * a Technique that simply hands something to whoever it caught has no save to wait for.
     */
    async onActionUsed(message) {
        const item = message?.item;
        if (!item) return;
        if (!ridersOn(item).some((rider) => rider.event === "action-used")) return;

        const actor = message.actor;
        for (const target of game.user.targets) {
            await Relay.request({
                action: "applyRiders",
                event: "action-used",
                messageId: message.id,
                itemUuid: item.uuid,
                originUuid: actor?.uuid,
                targetUuid: target.document.uuid,
            });
        }
    },

    /**
     * Damage landing on someone.
     *
     * `applyDamage` is wrapped rather than hooked because pf2e emits nothing here, and because its
     * arguments carry the one thing a rider cannot work without: the item the damage came from, and so the
     * actor responsible for it. Hit points are read either side of the call so "reduce a creature to 0"
     * is a fact rather than an inference.
     */
    wrapApplyDamage() {
        // `applyDamage` is declared on ActorPF2e and inherited by every actor type, so this is the one wrap
        // in the module that asks for the plain prototype patch: libWrapper would define its override on
        // the single subclass it was handed a path to, leaving NPCs — most of what a Technique is aimed at
        // — unwrapped. `strategy: "prototype"` walks up to the prototype that declares it and patches there.
        wrap(
            "CONFIG.PF2E.Actor.documentClasses.character.prototype.applyDamage",
            async function (wrapped, params) {
                const before = this.hitPoints?.value ?? 0;
                const restore = Sources.applyBypass(this, params);
                let result;
                try {
                    result = await wrapped(params);
                } finally {
                    restore();
                }
                try {
                    await Sources.onDamage(this, params, before);
                } catch (error) {
                    console.error("Isaac's Homebrew | damage rider failed", error);
                }
                return result;
            },
            { feature: "damage riders and IWR bypass", strategy: "prototype" },
        );
    },

    /**
     * Merge the origin's IWR bypasses into this application, and shadow what bypass cannot reach.
     *
     * Returns the undo function; it is called in a `finally` so a throw inside `applyDamage` can never
     * leave a target with its Hardness or resistances quietly lowered.
     */
    applyBypass(actor, params) {
        const noop = () => {};
        if (!enabled()) return noop;

        const damage = params?.damage;
        // A plain number means IWR is being skipped entirely; there is no roll to attach a bypass to.
        if (!damage || typeof damage === "number" || !Array.isArray(damage.instances)) return noop;

        const origin = params.item?.actor;
        if (!origin || origin === actor) return noop;

        const entries = bypassEntriesOn(origin);
        if (entries.length === 0) return noop;

        const damageTypes = damageTypesOf(damage);
        const options = new Set([
            ...(params.rollOptions ?? []),
            ...damageTypes.map((type) => `damage:type:${type}`),
            ...describeDamage({ types: damageTypes, outcome: params.outcome ?? null }),
            ...(origin.getRollOptions?.() ?? []),
            ...(params.item?.getRollOptions?.("item") ?? []),
            ...describeActor(actor, "target"),
        ]);

        const matching = selectEntries(entries, options);
        if (matching.length === 0) return noop;

        try {
            damage.options.bypass = mergeBypass(damage.options.bypass, matching, damageTypes);
        } catch (error) {
            console.error("Isaac's Homebrew | could not merge damage bypass", error);
        }

        return shadowTarget(actor, {
            reduction: resistanceReduction(matching),
            hardness: ignoresHardness(matching),
        });
    },

    async onDamage(actor, params, before) {
        if (!enabled()) return;
        const item = params?.item;
        const origin = item?.actor;
        if (!origin || origin === actor) return;

        const after = actor.hitPoints?.value ?? 0;
        if (after >= before) return; // healing, or nothing landed

        const target = params?.token ?? actor.getActiveTokens(true, true).at(0);
        if (!target?.uuid) return;

        await Relay.request({
            action: "applyRiders",
            event: "damage-applied",
            itemUuid: item.uuid,
            originUuid: origin.uuid,
            targetUuid: target.uuid,
            outcome: params?.outcome ?? null,
            damage: {
                types: damageTypesOf(params?.damage),
                total: before - after,
                outcome: params?.outcome ?? null,
            },
        });
    },

    /**
     * Turn boundaries, for the auras that tick on them.
     *
     * Only the active GM acts, because the turn hooks fire on every client and an aura that resolved once
     * per player would be five times the poison it should be.
     */
    async onTurn(event, combatant) {
        if (!enabled() || game.users.activeGM?.id !== game.user.id) return;
        const actor = combatant?.actor;
        const token = combatant?.token;
        if (!actor || !token) return;

        await Relay.request({
            action: "applyRiders",
            event,
            originUuid: actor.uuid,
            targetUuid: token.uuid, // the origin's own token; area riders fan out from it
        });
    },
};

function enabled() {
    return game.settings.get(MODULE_ID, "riders");
}

/** Damage types present in a roll, for `rider:damage:type:cold` and friends. */
function damageTypesOf(damage) {
    if (!damage || typeof damage === "number") return [];
    const instances = damage.instances ?? [];
    return [...new Set(instances.map((instance) => instance.type).filter((type) => type))];
}

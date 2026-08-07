import { targetingOptions, testPredicate } from "../lib/roll-options.mjs";
import { MODULE_ID } from "../sky/signs.mjs";
import { OUTCOME_LABELS, itemFor, ridersOn } from "./data.mjs";

/**
 * Apply a target's riders for an outcome. GM-side; see relay.mjs for why.
 *
 * Rerolls are the reason this is written as "replace what is on the sheet" rather than "add": a hero point
 * turning a critical failure into a success has to take the stunned 3 back off again. Only what this
 * module put there may be removed — a condition the GM clicked on by hand is not ours to touch — so every
 * application leaves a receipt on the message saying which items it created and which counters it moved,
 * and undoing is replaying that receipt backwards.
 */
export async function applyRiders({ messageId, targetUuid, outcome }) {
    const message = game.messages.get(messageId);
    const target = await fromUuid(targetUuid);
    const actor = target?.actor;
    const item = itemFor(message);
    if (!message || !actor || !item) return;

    const previous = message.flags?.[MODULE_ID]?.ridersApplied?.[target.id] ?? null;
    if (previous?.outcome === outcome) return;
    if (previous) await undo(actor, previous);

    const context = { item, actor, target, message, outcome, adjustments: [], prompts: [] };
    const before = new Set(actor.items.map((i) => i.id));

    for (const rider of selectRiders(item, outcome, actor)) {
        try {
            await applyOne(rider, context);
        } catch (error) {
            console.error(`Isaac's Homebrew | ${item.name}: rider failed on ${actor.name}`, rider, error);
        }
    }

    const receipt = {
        outcome,
        itemIds: actor.items.map((i) => i.id).filter((id) => !before.has(id)),
        adjustments: context.adjustments,
    };
    await message.update({ [`flags.${MODULE_ID}.ridersApplied.${target.id}`]: receipt });

    if (context.prompts.length > 0) await postPrompts(context);
}

async function applyOne(rider, context) {
    const apply = rider.apply ?? {};
    switch (apply.type) {
        case "prompt":
            context.prompts.push(apply.text ?? rider.note ?? "");
            return;
        case "effect":
            return applyEffect(rider, context);
        case "condition":
            return applyCondition(rider, context);
        default:
            console.warn(`Isaac's Homebrew | ${context.item.name}: unknown rider type "${apply.type}"`);
    }
}

/** Riders this outcome earns, after the target has been tested against each one's predicate. */
function selectRiders(item, outcome, actor) {
    const options = targetingOptions(item.actor, actor, item);
    return ridersOn(item).filter(
        (rider) =>
            Array.isArray(rider.outcomes) &&
            rider.outcomes.includes(outcome) &&
            testPredicate(rider.predicate, options),
    );
}

async function undo(actor, receipt) {
    for (const { itemId, delta } of receipt.adjustments ?? []) {
        const item = actor.items.get(itemId);
        const value = item?.system?.badge?.value;
        if (typeof value !== "number") continue;
        const reverted = value - delta;
        if (reverted > 0) await item.update({ "system.badge.value": reverted });
        else await item.delete();
    }
    const present = (receipt.itemIds ?? []).filter((id) => actor.items.has(id));
    if (present.length > 0) await actor.deleteEmbeddedDocuments("Item", present);
}

/**
 * A condition with a duration is not a condition — it is an effect that grants one.
 *
 * PF2e conditions carry no duration of their own, which is why the system's own timed conditions ship as
 * "Effect: X" items with a GrantItem rule. Applying a bare `slowed 1` for "1 round" would leave it on the
 * sheet until somebody remembered, which is the problem this feature exists to solve, so a rider with a
 * duration is wrapped the same way the system wraps its own.
 */
async function applyCondition(rider, context) {
    const slug = rider.apply.slug;
    const value = Number(rider.apply.value) || null;

    if (!rider.duration) {
        await context.actor.increaseCondition(slug, value ? { value } : {});
        return;
    }

    const condition = game.pf2e.ConditionManager.getCondition(slug);
    if (!condition) {
        console.warn(`Isaac's Homebrew | unknown condition slug "${slug}"`);
        return;
    }
    const label = value ? `${condition.name} ${value}` : condition.name;
    const grant = { key: "GrantItem", uuid: condition.uuid, allowDuplicate: false };
    if (value) grant.alterations = [{ mode: "override", property: "badge-value", value }];

    await context.actor.createEmbeddedDocuments("Item", [effectSource(label, [grant], rider, context)]);
}

/** An authored effect from a pack — the riders that are more than a condition with a timer. */
async function applyEffect(rider, context) {
    const uuid = rider.apply.uuid;
    const source = (await fromUuid(uuid))?.toObject();
    if (!source) {
        console.warn(`Isaac's Homebrew | rider effect not found: ${uuid}`);
        return;
    }

    // A Scorpio needle is not a second effect, it is one more needle. `stack` walks the counter badge up
    // instead of leaving a target wearing fifteen identical icons — which is also what makes "the target
    // has at least 5 needles" a number the sheet can be asked for.
    const delta = Number(rider.apply.value) || 1;
    if (rider.apply.stack) {
        const existing = context.actor.itemTypes.effect.find((e) => e.sourceId === uuid);
        if (existing?.system.badge?.type === "counter") {
            const was = existing.system.badge.value;
            const value = Math.min(was + delta, existing.system.badge.max ?? Infinity);
            await existing.update({ "system.badge.value": value });
            context.adjustments.push({ itemId: existing.id, delta: value - was });
            return;
        }
    }

    source._stats = foundry.utils.mergeObject(source._stats ?? {}, { compendiumSource: uuid });
    source.system.start = startData();
    if (rider.duration) source.system.duration = durationData(rider.duration);
    source.system.context = contextData(context);
    source.flags = foundry.utils.mergeObject(source.flags ?? {}, riderFlags(rider, context));
    await context.actor.createEmbeddedDocuments("Item", [source]);
}

function effectSource(label, rules, rider, context) {
    const { item, outcome } = context;
    return {
        type: "effect",
        name: `${item.name}: ${label}`,
        img: item.img,
        system: {
            description: {
                value: `<p>Applied by @UUID[${item.uuid}]{${item.name}} on a ${OUTCOME_LABELS[outcome]}.</p>`,
            },
            duration: durationData(rider.duration),
            level: { value: item.level ?? item.system?.level?.value ?? 1 },
            start: startData(),
            tokenIcon: { show: true },
            traits: { value: [], rarity: "common" },
            context: contextData(context),
            rules,
        },
        flags: riderFlags(rider, context),
    };
}

function durationData(duration) {
    return {
        expiry: duration.expiry ?? "turn-start",
        sustained: false,
        unit: duration.unit ?? "rounds",
        value: Number(duration.value) || 1,
    };
}

function startData() {
    return { value: game.time.worldTime, initiative: game.combat?.combatant?.initiative ?? null };
}

/** Lets the effect's own rules resolve against the Saint that caused it, the way an aura's would. */
function contextData({ item, actor, target }) {
    const originActor = item.actor;
    if (!originActor) return null;
    return {
        origin: {
            actor: originActor.uuid,
            token: originActor.getActiveTokens(true, true).at(0)?.uuid ?? null,
            item: item.uuid,
            spellcasting: null,
            rollOptions: [],
        },
        target: { actor: actor.uuid, token: target.uuid },
        roll: null,
    };
}

function riderFlags(rider, { message, item, outcome }) {
    return {
        [MODULE_ID]: { rider: { messageId: message.id, outcome, source: item.uuid, note: rider.note ?? "" } },
    };
}

/**
 * Riders nobody should pretend to automate.
 *
 * Being pushed 15 feet and knocked prone is two things: prone is a condition, and the push is a decision
 * about which 15 feet — which depends on walls, allies and where the caster was standing. Automating the
 * half that is a condition and whispering the half that is not is more honest than guessing, and keeps the
 * table from wondering whether the module already moved the token.
 */
async function postPrompts({ prompts, item, actor, outcome }) {
    const lines = prompts.filter((text) => text).map((text) => `<li>${text}</li>`).join("");
    if (!lines) return;
    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: item.actor }),
        whisper: ChatMessage.getWhisperRecipients("GM").map((user) => user.id),
        flavor: `${item.name} — ${actor.name}, ${OUTCOME_LABELS[outcome]}`,
        content: `<p>Left to the table:</p><ul>${lines}</ul>`,
    });
}

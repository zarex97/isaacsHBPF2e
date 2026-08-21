import { describeActor, describeDamage, riderOptions } from "../lib/roll-options.mjs";
import { MODULE_ID } from "../sky/signs.mjs";
import { catchTokens } from "../targeting/catch.mjs";
import { shapeFromArea } from "../targeting/place.mjs";
import { OUTCOME_LABELS, collectRiders, itemFor } from "./data.mjs";
import { selectRiders } from "./select.mjs";

/** pf2e's DegreeOfSuccess is an index, not a word. */
const DEGREES = ["criticalFailure", "failure", "success", "criticalSuccess"];

/**
 * Apply the riders an event earned. GM-side; see relay.mjs for why.
 *
 * Rerolls are the reason this replaces rather than adds: a hero point turning a critical failure into a
 * success has to take the stunned 3 back off again. Only what this module put there may be removed — a
 * condition the GM clicked on by hand is not ours to touch — so every application leaves a receipt on the
 * message saying which items it created and which counters it moved, and undoing is that receipt replayed
 * backwards.
 */
export async function applyRiders(payload) {
    const context = await resolveContext(payload);
    if (!context) return;

    let candidates = collectRiders({
        event: payload.event,
        // The message's item where there is one, and the item the payload named otherwise. `action-used`
        // is collected from this item alone, so it has to be the ability that was actually used rather
        // than null — which it is: `onActionUsed` sends its uuid.
        item: context.messageItem ?? context.item,
        actor: context.originActor,
    });

    // One use of an ability produces one request for the caster and one per target, and each half must see
    // only its own riders. Letting every request see all of them means a `self` rider is applied once per
    // target as well — and the receipt cannot be trusted to catch that, because a player's requests reach
    // the GM as independent socket jobs with no ordering between them. See `Sources.onActionUsed`.
    if (payload.event === "action-used") {
        const wantSelf = payload.selfOnly === true;
        candidates = candidates.filter(({ rider }) => (rider.self === true) === wantSelf);
    }
    if (candidates.length === 0) return;

    // A rider with an `area` fans out from the origin's token; everything else lands on the one target the
    // event named. Grouping by target first is what lets each target get its own snapshot and receipt.
    const byTarget = new Map();
    for (const candidate of candidates) {
        for (const target of await targetsFor(candidate.rider, context)) {
            if (!byTarget.has(target)) byTarget.set(target, []);
            byTarget.get(target).push(candidate);
        }
    }

    for (const [target, forTarget] of byTarget) {
        await applyToTarget(target, forTarget, context, payload);
    }
}

async function applyToTarget(target, candidates, context, payload) {
    const actor = target?.actor;
    if (!actor) return;

    const receiptKey = `${payload.event}:${target.id}`;
    const previous = context.message?.flags?.[MODULE_ID]?.ridersApplied?.[receiptKey] ?? null;
    if (previous?.outcome === (payload.outcome ?? null)) return;
    if (previous) await undo(actor, previous);

    // The snapshot. Every predicate for this target is tested against the world as it was before anything
    // was applied, which is what makes an escalation ladder advance exactly one step: the rider for step
    // two requires step one to be present, and it is not, yet.
    const options = riderOptions({
        originActor: context.originActor,
        targetActor: actor,
        // `eventItem` last: it is the only one that can belong to somebody else, so it fills in only when
        // the event named no item of the origin's own. See `resolveContext` for why the two are separate.
        item: context.item ?? context.messageItem ?? context.eventItem,
        extra: payload.damage ? describeDamage(payload.damage) : [],
    });

    const chosen = selectRiders(candidates, { outcome: payload.outcome ?? null, options });
    if (chosen.length === 0) return;

    const work = {
        ...context,
        actor,
        target,
        outcome: payload.outcome ?? null,
        event: payload.event,
        adjustments: [],
        prompts: [],
        choices: [],
    };
    const before = new Set(actor.items.map((i) => i.id));

    for (const { rider, item, index } of chosen) {
        try {
            await applyOne(rider, { ...work, item, riderIndex: index, riderItem: item });
        } catch (error) {
            console.error(`Isaac's Homebrew | ${item.name}: rider failed on ${actor.name}`, rider, error);
        }
    }

    if (context.message) {
        const receipt = {
            outcome: payload.outcome ?? null,
            itemIds: actor.items.map((i) => i.id).filter((id) => !before.has(id)),
            adjustments: work.adjustments,
        };
        await context.message.update({ [`flags.${MODULE_ID}.ridersApplied.${receiptKey}`]: receipt });
    }

    if (work.prompts.length > 0) await postPrompts(work);
    for (const choice of work.choices) await postChoice(choice, work, payload);
}

/** One option of one choice rider, come back from the caster's click. */
export async function applyChoice(payload) {
    const context = await resolveContext(payload);
    const target = await fromUuid(payload.targetUuid);
    const actor = target?.actor;
    if (!context || !actor) return;

    const item = await fromUuid(payload.riderItemUuid);
    const rider = (item?.flags?.[MODULE_ID]?.riders ?? [])[payload.riderIndex];
    const option = rider?.apply?.options?.[payload.optionIndex];
    if (!option?.apply) return;

    const work = { ...context, actor, target, item, outcome: payload.outcome ?? null, adjustments: [], prompts: [], choices: [] };
    await applyOne({ ...rider, apply: option.apply, duration: option.duration ?? rider.duration }, work);
    if (work.prompts.length > 0) await postPrompts(work);
}

async function applyOne(rider, context) {
    const apply = rider.apply ?? {};
    switch (apply.type) {
        case "prompt":
            context.prompts.push(apply.text ?? rider.note ?? "");
            return;
        case "choice":
            context.choices.push({ rider, index: context.riderIndex, item: context.riderItem ?? context.item });
            return;
        case "save":
            return applySave(rider, context);
        case "damage":
            return applyDamageRider(rider, context);
        case "death":
            return applyDeath(rider, context);
        case "persistent-damage":
            return applyPersistent(rider, context);
        case "effect":
            return applyEffect(rider, context);
        case "condition":
            return applyCondition(rider, context);
        default:
            console.warn(`Isaac's Homebrew | ${context.item?.name}: unknown rider type "${apply.type}"`);
    }
}

/* ------------------------------------------------------------------------------------------------ */
/*  Targets                                                                                          */
/* ------------------------------------------------------------------------------------------------ */

/**
 * Who a rider lands on.
 *
 * `self` is the Technique that buffs its own caster — *Excalibur*, *Aiolos's Wings*. pf2e's own answer to
 * those is `system.selfEffect`, but that field exists on actions and feats and not on spells, so a Technique
 * that turns the Saint's arms into blades had its rule elements written straight onto the spell instead.
 * Rule elements on a spell are live the moment it is on the sheet, which made a 1-action Technique a
 * permanent passive: every Capricorn Saint had deadly d10 slashing fists from level 1, forever.
 *
 * Without an `area` a rider lands on the token the event named. With one, the rider is an aura tick: build
 * the shape on the origin's token and reuse the same containment and alliance filtering the cast-time area
 * targeting uses, so "enemies within 10 feet" means the same thing in both places.
 */
async function targetsFor(rider, context) {
    if (rider.self) return context.originToken ? [context.originToken] : [];
    if (!rider.area) return context.target ? [context.target] : [];

    const originToken = context.originToken;
    if (!originToken?.object) return [];
    if (!canvas?.ready || canvas.scene?.id !== originToken.parent?.id) {
        console.warn(
            `Isaac's Homebrew | ${context.originActor?.name}: an area rider needs the origin's scene to be `
                + `the viewed one, and it is not. Skipped.`,
        );
        return [];
    }

    const shape = shapeFromArea(rider.area, originToken.object, originToken.object.center);
    if (!shape) return [];

    const region = new CONFIG.Region.documentClass(
        { name: "Rider area", shapes: [shape], flags: { pf2e: { areaShape: rider.area.type } } },
        { parent: canvas.scene },
    );
    // `catchTokens` reads the origin actor off `config.item`, so hand it something item-shaped. The aura
    // belongs to the Cloth, not to any one Technique, so there is no real item to give it.
    const config = {
        item: { actor: context.originActor, name: context.originActor?.name ?? "", system: {} },
        affects: rider.area.affects ?? "enemies",
        includesSelf: rider.area.includesSelf === true,
        includesNeutral: rider.area.includesNeutral === true,
        requireLineOfEffect: rider.area.requireLineOfEffect !== false,
        predicate: [],
        maxTargets: Number(rider.area.maxTargets) || 0,
    };

    const { caught } = catchTokens(region, config, originToken.object);
    return caught.filter((entry) => entry.checked).map((entry) => entry.token.document);
}

/* ------------------------------------------------------------------------------------------------ */
/*  Apply handlers                                                                                   */
/* ------------------------------------------------------------------------------------------------ */

/**
 * A condition with a duration is not a condition — it is an effect that grants one.
 *
 * PF2e conditions carry no duration of their own, which is why the system's own timed conditions ship as
 * "Effect: X" items with a GrantItem rule. Applying a bare `slowed 1` for "1 round" would leave it on the
 * sheet until somebody remembered, which is the problem this feature exists to solve.
 */
async function applyCondition(rider, context) {
    const slug = rider.apply.slug;
    const value = Number(rider.apply.value) || null;

    if (!rider.duration) {
        const params = {};
        if (value) params.value = value;
        // "cumulative to enfeebled 4" — the cap belongs on the increment, not on a predicate that would
        // have to be rewritten every time the ceiling moves.
        if (Number(rider.apply.max)) params.max = Number(rider.apply.max);
        await context.actor.increaseCondition(slug, params);
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
            if (value === was) return;
            await existing.update({ "system.badge.value": value });
            context.adjustments.push({ itemId: existing.id, delta: value - was });
            return;
        }
    }

    applySubstitutions(source, rider.apply.substitutions, context);
    source._stats = foundry.utils.mergeObject(source._stats ?? {}, { compendiumSource: uuid });
    source.system.start = startData();
    if (rider.duration) source.system.duration = durationData(rider.duration);
    source.system.context = contextData(context);
    source.flags = foundry.utils.mergeObject(source.flags ?? {}, riderFlags(rider, context));
    await context.actor.createEmbeddedDocuments("Item", [source]);
}

/**
 * Persistent damage, optionally scaled by a counter the target is already carrying.
 *
 * Scorpio's Ascendant bleed is "1d6 per needle", and the needle count is on the target as a counter badge
 * put there by an earlier rider. Reading it back is what turns a static formula into the stacking one the
 * Cloth actually describes.
 */
async function applyPersistent(rider, context) {
    const { formula = "1d6", damageType = "bleed", perCounter, max } = rider.apply;
    const count = perCounter ? Math.min(counterOn(context.actor, perCounter), Number(max) || Infinity) : 1;
    const scaled = perCounter ? scaleFormula(formula, count) : formula;
    if (!scaled) return;

    // A stacking bleed is one growing wound, not a new one per needle. Whatever this module applied last
    // time is replaced; persistent damage a GM added by hand is left alone.
    const ours = context.actor.itemTypes.condition.filter(
        (c) =>
            c.slug === "persistent-damage" &&
            c.system.persistent?.damageType === damageType &&
            c.flags?.[MODULE_ID]?.rider,
    );
    if (ours.length > 0) {
        await context.actor.deleteEmbeddedDocuments("Item", ours.map((c) => c.id));
    }

    const source = game.pf2e.ConditionManager.getCondition("persistent-damage")?.toObject();
    if (!source) return;
    source.system.persistent = {
        formula: scaled,
        damageType,
        dc: Number(rider.apply.dc) || 15,
    };
    source.flags = foundry.utils.mergeObject(source.flags ?? {}, riderFlags(rider, context));
    await context.actor.createEmbeddedDocuments("Item", [source]);
}

/**
 * Damage a rider deals directly — Pisces' roses, and the garden's tick.
 *
 * Rolled as a real `DamageRoll` rather than a flat number so immunities, weaknesses and resistances are
 * honoured on the way in, and posted to chat so the table can see where the poison came from. The roll
 * carries no originating item on purpose: `applyDamage` is wrapped as an event source, and an item here
 * would let a rider's own damage trigger another rider.
 */
async function applyDamageRider(rider, context) {
    const { formula = "1d6", damageType = "untyped" } = rider.apply;
    const DamageRoll = CONFIG.Dice.rolls.find((cls) => cls.name === "DamageRoll");
    if (!DamageRoll) {
        console.warn("Isaac's Homebrew | pf2e's DamageRoll is not registered; damage rider skipped.");
        return;
    }

    const roll = await new DamageRoll(`(${formula})[${damageType}]`).evaluate();
    const name = context.item?.name ?? context.originActor?.name ?? "Rider";
    await roll.toMessage(
        {
            speaker: ChatMessage.getSpeaker({ actor: context.originActor }),
            flavor: `${name} — ${context.actor.name}`,
        },
        { rollMode: game.settings.get("core", "rollMode") },
    );
    await context.actor.applyDamage({ damage: roll, token: context.target });
}

/**
 * "Or die."
 *
 * Everything else in this module treats outright death as a prompt, because whether a boss dies is a
 * table's call. A once-per-day Zenith capstone that says *or die* deserves better than a whisper — but
 * ending a player character without asking is not something a module should do on its own initiative. So
 * the setting draws the line where the stakes change: monsters die, player characters get asked.
 *
 * Reducing to 0 Hit Points rather than deleting anything: pf2e turns that into dying for a character, and
 * into a corpse for an NPC, which is what the rest of the system already knows how to handle.
 */
async function applyDeath(rider, context) {
    const mode = game.settings.get(MODULE_ID, "automateDeath");
    const playerOwned = context.actor.hasPlayerOwner;

    if (mode === "off" || (mode === "npcs" && playerOwned)) {
        context.prompts.push(rider.apply.text ?? "It dies.");
        return;
    }

    const hp = context.actor.hitPoints;
    if (!hp || hp.value <= 0) return;
    await context.actor.update({ "system.attributes.hp.value": 0 });
    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: context.originActor }),
        flavor: context.item?.name ?? context.originActor?.name ?? "Rider",
        content: `<p><strong>${context.actor.name}</strong> is reduced to 0 Hit Points — ${
            rider.apply.text ?? "it dies."
        }</p>`,
    });
}

/**
 * A rider that makes the target roll for it.
 *
 * Virgo's Six Paths demands a Will save per unarmed hit, and Aquarius' cold asks for a Fortitude save on
 * every hit of cold damage. Neither has a chat card with save buttons to hang off — they happen mid-Strike
 * — so the save is rolled here against the Saint's own DC, and the nested riders are chosen by its result
 * exactly the way the outer ones were chosen by the event's.
 */
async function applySave(rider, context) {
    const { statistic: slug, dc } = rider.apply;
    const statistic = context.actor.getStatistic?.(slug);
    if (!statistic) {
        console.warn(`Isaac's Homebrew | ${context.actor.name} has no ${slug} statistic`);
        return;
    }

    const value = resolveDC(dc, context);
    if (!value) return;

    const roll = await statistic.roll({
        dc: { value },
        skipDialog: true,
        item: context.item ?? null,
        origin: context.originActor ?? null,
        extraRollOptions: [`${MODULE_ID}:rider-save`],
    });
    const outcome = DEGREES[roll?.degreeOfSuccess ?? -1];
    if (!outcome) return;

    const nested = (rider.apply.riders ?? []).map((r, index) => ({ rider: r, item: context.item, index }));
    const options = riderOptions({
        originActor: context.originActor,
        targetActor: context.actor,
        item: context.item,
    });
    for (const { rider: inner } of selectRiders(nested, { outcome, options })) {
        await applyOne(inner, { ...context, outcome });
    }
}

/** The Saint's Cosmo DC, or a flat number written in the content. */
function resolveDC(dc, context) {
    if (typeof dc === "number") return dc;
    if (dc === "cosmo") {
        return (
            context.originActor?.getStatistic?.("saint")?.dc?.value ??
            context.originActor?.classDCs?.saint?.dc?.value ??
            null
        );
    }
    return null;
}

function counterOn(actor, uuid) {
    const effect = actor.itemTypes.effect.find((e) => e.sourceId === uuid);
    const badge = effect?.system?.badge;
    return badge?.type === "counter" ? (badge.value ?? 0) : 0;
}

/** "1d6" with a count of 3 becomes "3d6". A count of zero means there is nothing to apply. */
function scaleFormula(formula, count) {
    if (count <= 0) return null;
    const match = /^(\d*)d(\d+)$/.exec(String(formula).trim());
    if (!match) return formula;
    return `${(Number(match[1]) || 1) * count}d${match[2]}`;
}

/* ------------------------------------------------------------------------------------------------ */
/*  Undo, sources, chat                                                                              */
/* ------------------------------------------------------------------------------------------------ */

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

async function resolveContext(payload) {
    const message = payload.messageId ? game.messages.get(payload.messageId) : null;
    const item = payload.itemUuid ? await fromUuid(payload.itemUuid) : null;
    const target = payload.targetUuid ? await fromUuid(payload.targetUuid) : null;

    const originDoc = payload.originUuid ? await fromUuid(payload.originUuid) : null;
    const originActor = originDoc?.actor ?? originDoc ?? item?.actor ?? message?.actor ?? null;
    if (!originActor) return null;

    const originToken =
        originDoc?.documentName === "Token"
            ? originDoc
            : (originActor.getActiveTokens(true, true).at(0) ?? null);

    // The message's item only counts as a rider source when the message belongs to the origin. On
    // `strike-received` the message is the attacker's, and their weapon has nothing to say about the
    // roses growing on the person they hit.
    const messageItem = message?.actor && message.actor === originActor ? itemFor(message) : null;

    // ...but it is the only thing the *predicate* can be about. "Any creature that hits you with an unarmed
    // or non-reach melee attack takes 1d6 poison" is a question about the attacker's weapon, and answering
    // it needs that weapon in the option set. Keeping the two apart is the whole point: `messageItem` is
    // "may this item carry riders", `eventItem` is "what was the event about". Collapsing them either lets
    // an attacker's weapon fire the defender's riders, or — as shipped — leaves Pisces with no `item:`
    // option at all, so its predicate could never pass and the roses never drew blood.
    const eventItem = itemFor(message);

    return { message, item, messageItem, eventItem, originActor, originToken, target };
}

/**
 * Write numbers from the origin into the effect before it is created.
 *
 * *The Twelve Arms* loans a weapon to an ally and lets them use **the Saint's** proficiency with it. pf2e
 * has exactly the rule element for that — `MartialProficiency`, with a `definition` predicate naming the
 * weapons and a rank — but the rank has to be the Saint's, and a resolvable value on the ally's effect
 * resolves `@actor` against the ally. So the number is baked in here, at hand-out time, which is also the
 * only moment it is knowable.
 */
function applySubstitutions(source, substitutions, context) {
    for (const [path, expression] of Object.entries(substitutions ?? {})) {
        const value = resolveFromOrigin(expression, context);
        if (value === null) {
            console.warn(`Isaac's Homebrew | could not resolve "${expression}" for ${path}`);
            continue;
        }
        foundry.utils.setProperty(source, path, value);
    }
}

function resolveFromOrigin(expression, { originActor }) {
    if (typeof expression === "number") return expression;
    const match = /^origin\.statistic\.([\w-]+)\.rank$/.exec(String(expression));
    if (match) return originActor?.getStatistic?.(match[1])?.rank ?? null;
    if (expression === "origin.level") return originActor?.level ?? null;
    return null;
}

function effectSource(label, rules, rider, context) {
    const item = context.item ?? context.riderItem;
    const name = item?.name ?? context.originActor?.name ?? "Rider";
    return {
        type: "effect",
        name: `${name}: ${label}`,
        img: item?.img ?? "icons/svg/aura.svg",
        system: {
            description: {
                value: item?.uuid
                    ? `<p>Applied by @UUID[${item.uuid}]{${name}}${outcomeSuffix(context)}.</p>`
                    : `<p>Applied by ${name}${outcomeSuffix(context)}.</p>`,
            },
            duration: durationData(rider.duration),
            level: { value: item?.level ?? item?.system?.level?.value ?? 1 },
            start: startData(),
            tokenIcon: { show: true },
            traits: { value: [], rarity: "common" },
            context: contextData(context),
            rules,
        },
        flags: riderFlags(rider, context),
    };
}

function outcomeSuffix(context) {
    return context.outcome ? ` on a ${OUTCOME_LABELS[context.outcome]}` : "";
}

function durationData(duration) {
    return {
        expiry: duration?.expiry ?? "turn-start",
        sustained: false,
        unit: duration?.unit ?? "rounds",
        value: Number(duration?.value) || 1,
    };
}

function startData() {
    return { value: game.time.worldTime, initiative: game.combat?.combatant?.initiative ?? null };
}

/** Lets the effect's own rules resolve against the Saint that caused it, the way an aura's would. */
function contextData({ originActor, originToken, item, actor, target }) {
    if (!originActor) return null;
    return {
        origin: {
            actor: originActor.uuid,
            token: originToken?.uuid ?? null,
            item: item?.uuid ?? null,
            spellcasting: null,
            rollOptions: [],
        },
        target: { actor: actor.uuid, token: target?.uuid ?? null },
        roll: null,
    };
}

function riderFlags(rider, { message, item, outcome }) {
    return {
        [MODULE_ID]: {
            rider: {
                messageId: message?.id ?? null,
                outcome: outcome ?? null,
                source: item?.uuid ?? null,
                note: rider.note ?? "",
            },
        },
    };
}

/**
 * Riders nobody should pretend to automate.
 *
 * Being pushed 15 feet and knocked prone is two things: prone is a condition, and the push is a decision
 * about which 15 feet — which depends on walls, allies and where the caster was standing. Automating the
 * half that is a condition and whispering the half that is not is more honest than guessing.
 */
async function postPrompts({ prompts, item, originActor, actor, outcome }) {
    const lines = prompts.filter((text) => text).map((text) => `<li>${text}</li>`).join("");
    if (!lines) return;
    const name = item?.name ?? originActor?.name ?? "Rider";
    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: originActor }),
        whisper: ChatMessage.getWhisperRecipients("GM").map((user) => user.id),
        flavor: `${name} — ${actor.name}${outcome ? `, ${OUTCOME_LABELS[outcome]}` : ""}`,
        content: `<p>Left to the table:</p><ul>${lines}</ul>`,
    });
}

/**
 * A rider the Saint has to choose.
 *
 * Which sense *Tenbu Hōrin* takes, which limb *The Sharpest Sword* severs — the condition is automatable,
 * the pick is not, and the pick belongs to the caster, who is often not whoever rolled. A chat card rather
 * than a dialog on purpose: it survives a reload, and it cannot be missed by someone looking at their
 * sheet at the wrong moment.
 */
async function postChoice({ rider, index, item }, context, payload) {
    const options = rider.apply.options ?? [];
    if (options.length === 0 || !item?.uuid) return;

    const buttons = options
        .map(
            (option, optionIndex) =>
                `<button type="button" data-action="isaacs-hb-rider-choice" data-option="${optionIndex}">`
                + `${foundry.utils.escapeHTML(option.label ?? `Option ${optionIndex + 1}`)}</button>`,
        )
        .join(" ");

    const recipients = new Set(ChatMessage.getWhisperRecipients("GM").map((user) => user.id));
    for (const [userId, level] of Object.entries(context.originActor?.ownership ?? {})) {
        if (level === CONST.DOCUMENT_OWNERSHIP_LEVELS.OWNER && userId !== "default") recipients.add(userId);
    }

    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: context.originActor }),
        whisper: [...recipients],
        flavor: `${item.name} — ${context.actor.name}`,
        content:
            `<p>${foundry.utils.escapeHTML(rider.apply.prompt ?? "Choose one.")}</p>`
            + `<div class="isaacs-hb-choice">${buttons}</div>`,
        flags: {
            [MODULE_ID]: {
                choice: {
                    riderItemUuid: item.uuid,
                    riderIndex: index,
                    targetUuid: context.target?.uuid ?? payload.targetUuid,
                    originUuid: context.originActor?.uuid,
                    messageId: payload.messageId ?? null,
                    itemUuid: payload.itemUuid ?? null,
                    outcome: context.outcome ?? null,
                },
            },
        },
    });
}

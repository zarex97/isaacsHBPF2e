import { describeActor, describeDamage, riderOptions } from "../lib/roll-options.mjs";
import { MODULE_ID } from "../sky/signs.mjs";
import { catchTokens } from "../targeting/catch.mjs";
import { shapeFromArea } from "../targeting/place.mjs";
import { skyStepsFromOptions, stepsFor } from "../targeting/heightening.mjs";
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
        moves: [],
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
            moves: work.moves,
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

    const work = { ...context, actor, target, item, outcome: payload.outcome ?? null, adjustments: [], prompts: [], choices: [], moves: [] };
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
        case "teleport":
            return applyTeleport(rider, context);
        case "strikes":
            return applyStrikes(rider, context);
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
 * Move a creature, rather than telling the GM to.
 *
 * The module used to whisper every forced movement — "Teleported 250 feet in a direction of the Saint's
 * choice" — on the grounds that *which* 250 feet is a table decision. In practice it made a Technique's
 * headline effect the one thing that did not happen, and the whisper was read once and forgotten. The
 * direction is now taken from the geometry that is already on the table: a creature sent away goes along
 * the line from the caster to itself, which is the reading nobody argues with.
 *
 * The scene is a hard boundary. "One mile" is longer than any battle map, so the token stops at the last
 * legal square along that ray and the chat card says how far it actually travelled — an honest number
 * beats a silent no-op, and a creature pinned to the far edge of the map is out of the fight either way.
 */
async function applyTeleport(rider, context) {
    const token = context.target;
    const scene = token?.parent;
    if (!token || !scene) return;

    const feet = Number(rider.apply.distance) || 0;
    if (feet <= 0) return;

    // Some creatures do not move. Taurus' Bulwark refuses anything its own size or smaller, and a Saint in
    // Titan's Stance cannot be shifted at all — both are written as a promise the guide makes, so a forced
    // movement has to honour them rather than shove the token anyway and leave the table to argue.
    const targetOptions = token.actor?.getRollOptions?.() ?? [];
    const refusal = (() => {
        if (targetOptions.includes("saint:immovable")) return "does not move";
        if (!targetOptions.includes("saint:bulwark")) return null;
        const order = { tiny: 0, sm: 1, med: 2, lg: 3, huge: 4, grg: 5 };
        const mover = order[context.originActor?.size ?? "med"] ?? 2;
        const held = order[token.actor?.size ?? "med"] ?? 2;
        return mover <= held ? "is not moved by anything its own size or smaller" : null;
    })();
    if (refusal) {
        context.prompts.push(`${token.name} ${refusal} — the push is refused.`);
        return;
    }

    const gridSize = scene.grid.size;
    const perFoot = gridSize / (scene.grid.distance || 5);
    const from = context.originToken ?? token;

    // `TokenDocument#x` follows the *animation*, not the stored value: read it while a token is still
    // sliding — which it always is, a rider fires within a frame of the move that caused it — and every
    // number downstream is wrong by however far the tween has got. `_source` is the position the document
    // actually holds. This cost a wall of fractional coordinates before it was spotted.
    const at = (doc) => ({ x: doc._source?.x ?? doc.x, y: doc._source?.y ?? doc.y });
    const here = at(token);
    const origin = at(from);

    // Direction: away from the caster by default, back towards them when a Technique pulls.
    const sign = rider.apply.direction === "toward" ? -1 : 1;
    let dx = (here.x - origin.x) * sign;
    let dy = (here.y - origin.y) * sign;
    if (!dx && !dy) dx = 1; // Standing in the same square: pick an axis rather than divide by zero.
    const length = Math.hypot(dx, dy);
    const ux = dx / length;
    const uy = dy / length;

    // The scene's playable rectangle, minus the token's own footprint.
    const rect = scene.dimensions?.sceneRect ?? { x: 0, y: 0, width: scene.width, height: scene.height };
    const maxX = rect.x + rect.width - token.width * gridSize;
    const maxY = rect.y + rect.height - token.height * gridSize;

    // "Pushed 15 feet" is a delta; "pushed to the end of the line" is a destination. The second is what a
    // line-shaped Technique means — a creature standing 20 feet along a 60-foot line travels 40, not 60 —
    // so `measure: "from-origin"` reads the distance as where the creature ends up rather than how far it
    // goes, and a creature already past that point is not dragged back.
    const travel = rider.apply.measure === "from-origin"
        ? Math.max(0, feet - Math.hypot(here.x - origin.x, here.y - origin.y) / perFoot)
        : feet;
    if (travel <= 0) return;

    const wanted = { x: here.x + ux * travel * perFoot, y: here.y + uy * travel * perFoot };
    const landed = {
        x: Math.clamp(wanted.x, rect.x, Math.max(rect.x, maxX)),
        y: Math.clamp(wanted.y, rect.y, Math.max(rect.y, maxY)),
    };
    const snapped = canvas?.grid?.getSnappedPoint
        ? canvas.grid.getSnappedPoint(landed, { mode: CONST.GRID_SNAPPING_MODES.TOP_LEFT_CORNER ?? 1, resolution: 1 })
        : { x: Math.round(landed.x / gridSize) * gridSize, y: Math.round(landed.y / gridSize) * gridSize };

    const travelled = Math.round(Math.hypot(snapped.x - here.x, snapped.y - here.y) / perFoot);
    if (travelled === 0) return;

    // A teleport blinks; it does not slide across the map past everything in between.
    await token.update(snapped, { animate: false });
    context.moves.push({ tokenUuid: token.uuid, x: here.x, y: here.y });

    // Say what happened, including when the map was the limiting factor.
    const short = travelled < travel - (scene.grid.distance || 5);
    context.prompts.push(
        short
            ? `Teleported ${travelled} feet away — the ${Math.round(travel)}-foot throw ran out of map.`
            : `Teleported ${travelled} feet away.`,
    );
}

/**
 * A volley: one activity that makes several Strikes of its own accord.
 *
 * Seven Techniques say some variant of "make five unarmed Strikes". They were authored with a damage block
 * and no defence, which pf2e reads as *one* spell attack followed by *one* damage roll — so only one attack
 * happened, heightening scaled the roll rather than each Strike, and there was no multiple attack penalty
 * to speak of. This rolls the Strikes instead.
 *
 * Three things make it work, and each is a constraint pf2e imposed rather than a choice:
 *
 *  - **No penalty may be passed to the roll.** `AttackRollParams` takes a target and roll options and
 *    nothing else, so the cumulative −1 arrives as `FlatModifier`s on a short-lived effect, each predicated
 *    on the option this function emits for that Strike (`…:strike:2`, `:3`, …).
 *  - **`variants[0]` every time.** That is the un-penalised variant, which is exactly what "your multiple
 *    attack penalty does not increase during this activity" asks for.
 *  - **The volley needs every target at once.** A rider is normally applied once per target; this one is a
 *    `self` rider so it fires once, and reads the confirmed list off the payload. See `Sources.onActionUsed`.
 *
 * The one clause that cannot be honoured is "counts as three attacks for your multiple attack penalty
 * afterward": pf2e does not count a turn's attacks, the player picks the variant. That stays in the text.
 */
async function applyStrikes(rider, context) {
    const actor = context.originActor;
    const targets = context.targets ?? [];
    if (!actor || targets.length === 0) return;

    const wanted = rider.apply.strike ?? "unarmed";
    const strike = (actor.system.actions ?? []).find(
        (action) => action.slug === wanted || action.item?.system?.category === wanted,
    ) ?? (actor.system.actions ?? [])[0];
    if (!strike?.variants?.length) {
        console.warn(`Isaac's Homebrew | ${context.item?.name}: no Strike to make`);
        return;
    }

    // The volley's own buff — the damage it deals, and the ladder of penalties it walks down.
    let effect = null;
    if (rider.apply.uuid) {
        const source = (await fromUuid(rider.apply.uuid))?.toObject();
        if (source) {
            applySubstitutions(source, rider.apply.substitutions, context);
            source._stats = foundry.utils.mergeObject(source._stats ?? {}, { compendiumSource: rider.apply.uuid });
            [effect] = await actor.createEmbeddedDocuments("Item", [source]);
        } else {
            console.warn(`Isaac's Homebrew | volley effect not found: ${rider.apply.uuid}`);
        }
    }

    const slug = rider.apply.option ?? "volley";
    try {
        for (const [index, token] of targets.entries()) {
            const options = [`${slug}:strike:${index + 1}`];
            await strike.variants[0].roll({ target: token.object ?? null, options, createMessage: true });

            // Follow through: an attack that lands should deal its damage without a second prompt.
            const outcome = [...game.messages].reverse()
                .find((m) => m.flags?.pf2e?.context?.type === "attack-roll")?.flags?.pf2e?.context?.outcome;
            if (outcome === "criticalSuccess" && typeof strike.critical === "function") {
                await strike.critical({ target: token.object ?? null, options, createMessage: true });
            } else if (outcome === "success" && typeof strike.damage === "function") {
                await strike.damage({ target: token.object ?? null, options, createMessage: true });
            }
        }
    } finally {
        if (effect) await effect.delete();
    }
}

/**
 * The compendium address of a condition, for a `GrantItem` to point at.
 *
 * `ConditionManager.getCondition` hands back a *temporary* instance built from the compendium rather than
 * the stored document, so `condition.uuid` is null and only `sourceId` carries the address. Reading `uuid`
 * here produced `{ key: "GrantItem", uuid: null }` — a rule element that validates, creates the effect with
 * the right name and duration, and grants nothing. Every durationed condition in the content was therefore
 * inert while looking correct on the sheet: a creature wore "Crystal Net: Immobilized" and was not
 * immobilized. Riders without a duration were unaffected, because they take `increaseCondition` and never
 * build a grant at all — which is why this hid for so long, with 36 working riders around 20 broken ones.
 *
 * `uuid` is kept last rather than dropped: a future pf2e may well return a real document here.
 */
export function conditionUuidOf(condition) {
    return condition?.sourceId ?? condition?._stats?.compendiumSource ?? condition?.uuid ?? null;
}

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

    const conditionUuid = conditionUuidOf(condition);
    if (!conditionUuid) {
        console.warn(`Isaac's Homebrew | condition "${slug}" has no resolvable uuid to grant`);
        return;
    }

    const label = value ? `${condition.name} ${value}` : condition.name;
    const grant = { key: "GrantItem", uuid: conditionUuid, allowDuplicate: false };
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
    const { formula = "1d6", damageType = "untyped", perStep = null } = rider.apply;
    const DamageRoll = CONFIG.Dice.rolls.find((cls) => cls.name === "DamageRoll");
    if (!DamageRoll) {
        console.warn("Isaac's Homebrew | pf2e's DamageRoll is not registered; damage rider skipped.");
        return;
    }

    // Damage that only happens on one outcome still has to heighten. *Titan's Break* deals its extra 4d8
    // on a critical failure alone, and that 4d8 grows a die per step like everything else — but a rider
    // sits outside `system.damage`, so pf2e never scales it. `perStep` is that growth, counted the same
    // way the Technique's own is: steps earned by rank, plus whatever the sky is worth today.
    const source = context.item;
    const steps = perStep
        ? stepsFor({
              baseRank: source?.baseRank ?? source?.system?.level?.value,
              castRank: source?.rank,
              bonusSteps: skyStepsFromOptions(context.originActor?.getRollOptions?.() ?? []),
          })
        : 0;
    const growth = perStep ? scaleFormula(perStep, steps) : null;
    const scaled = growth ? `${formula} + ${growth}` : formula;

    const roll = await new DamageRoll(`(${scaled})[${damageType}]`).evaluate();
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

    // A forced movement is as much a consequence as a condition is, so a hero point that turns the critical
    // failure into a success has to walk the creature back to where it was standing.
    for (const move of receipt.moves ?? []) {
        const token = await fromUuid(move.tokenUuid).catch(() => null);
        if (token?.documentName === "Token") await token.update({ x: move.x, y: move.y }, { animate: false });
    }
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

    // The whole confirmed target list, for the one rider that needs it — see `applyStrikes`.
    const targets = payload.targetUuids
        ? (await Promise.all(payload.targetUuids.map((uuid) => fromUuid(uuid).catch(() => null)))).filter(Boolean)
        : [];

    return { message, item, messageItem, eventItem, originActor, originToken, target, targets };
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
    // Authored as a list of `{ path, value }`, never as an object keyed by path. Foundry expands dotted
    // *keys* into nested objects on any `update`, so `{ "system.rules.0.value": … }` silently becomes
    // `{ system: { rules: { 0: { value: … } } } }` the first time the item is written to an actor — and the
    // substitution then matches nothing. Keeping the path in a string value makes it survive the round trip.
    const list = Array.isArray(substitutions)
        ? substitutions
        : Object.entries(substitutions ?? {}).map(([path, value]) => ({ path, value }));

    for (const { path, value: expression } of list) {
        const value = resolveFromOrigin(expression, context);
        if (value === null) {
            console.warn(`Isaac's Homebrew | could not resolve "${expression}" for ${path}`);
            continue;
        }
        foundry.utils.setProperty(source, path, value);
    }
}

function resolveFromOrigin(expression, context) {
    const { originActor } = context;
    if (typeof expression === "number") return expression;
    const match = /^origin\.statistic\.([\w-]+)\.rank$/.exec(String(expression));
    if (match) return originActor?.getStatistic?.(match[1])?.rank ?? null;
    if (expression === "origin.level") return originActor?.level ?? null;
    // How far the Technique itself has heightened, sky included — the growth a Strike inherits when the
    // Technique says "each Strike's damage increases by 1d6".
    if (expression === "origin.item.steps") {
        const item = context.item ?? context.riderItem;
        if (!item) return null;
        return stepsFor({
            baseRank: item.baseRank ?? item.system?.level?.value,
            castRank: item.rank,
            bonusSteps: skyStepsFromOptions(originActor?.getRollOptions?.() ?? []),
        });
    }
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

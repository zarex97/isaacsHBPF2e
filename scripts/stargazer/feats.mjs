import { DamageBus, Relay, degreeOf } from "../automation.mjs";
import { DAMAGE } from "../stage-priorities.mjs";
import { relabel, setDieResult } from "../roll-rewrites/balance.mjs";
import { MODULE_ID, SIGN_IDS, aspectOf, signOf } from "../sky/signs.mjs";
import { SkyTracker } from "../sky/tracker.mjs";
import { announce, snarledBy } from "./paths.mjs";
import { isStargazer, reactionsLeft, spendReaction } from "./threads.mjs";

/**
 * The Stargazer's class feats (guide §7) — what their rule elements cannot say. Phase 6a.
 *
 * Feats that move a number a class feature already reads live beside that feature: Long Thread, Widened
 * Chart, Two Warnings, Thread of Warning, Cascade, Prophesied Ally and Unspent Thread in `threads.mjs`;
 * Sky Reader, Wide Vigil, Sky Anchor and the Vigil card's buttons in `vigil.mjs`. Here:
 *
 * - **Used by posting them** (the Stargazer's own client): Cold Read, Read the Room, Prophecy's Weight,
 *   Fate's Favourite, Star-Marked Enemy, Written in Advance, Patient Watcher.
 * - **Buttons after the event** (ADR-0004), offered by the GM's client: Omen of Blades, Second Chance at
 *   Fate, Inevitable, and Patient Watcher after a Refocus.
 * - **Companion of the Watch** makes the familiar when the feat lands.
 *
 * "Once per day" is the item's own pf2e frequency, which Rest for the Night refills. pf2e counts it but
 * never refuses a use at 0 (#123), so everything here checks the count itself before it acts.
 */

const FLAG = "stargazer";
const isWriter = () => (game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM);
const has = (actor, slug) => (actor?.itemTypes?.feat ?? []).some((f) => f.slug === slug);
const featOf = (actor, slug) => (actor?.itemTypes?.feat ?? []).find((f) => f.slug === slug) ?? null;
const state = (actor) => actor?.flags?.[MODULE_ID]?.[FLAG] ?? {};
const tokenOf = (actor) => actor?.getActiveTokens?.(true, true)?.[0] ?? null;
const stargazers = () => game.actors.filter((a) => isStargazer(a));

/** pf2e's DCs by level (GM Core, table 10–5), for the secret check Cold Read hands the GM. */
const LEVEL_DC = [14, 15, 16, 18, 19, 20, 22, 23, 24, 26, 27, 28, 30, 31, 32, 34, 35, 36, 38, 39, 40, 42, 44, 46, 48, 50];

function feet(a, b) {
    const ta = tokenOf(a);
    const tb = tokenOf(b);
    if (!ta || !tb || ta.parent?.id !== tb.parent?.id) return Infinity;
    return canvas?.grid?.measurePath?.([ta.center, tb.center])?.distance ?? Infinity;
}

function ownersOf(actor) {
    return game.users.filter((u) => actor.testUserPermission(u, "OWNER")).map((u) => u.id);
}
const gmIds = () => game.users.filter((u) => u.isGM).map((u) => u.id);

async function say(actor, html, extra = {}) {
    return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<p>${html}</p>`, ...extra });
}

async function effectFromPack(name) {
    const pack = game.packs.get(`${MODULE_ID}.stargazer-effects`);
    const entry = (await pack?.getIndex())?.find((e) => e.name === name);
    return entry ? foundry.utils.deepClone((await pack.getDocument(entry._id)).toObject()) : null;
}

/** A once-per-day use left on the item, or false. Spends it when there is one. */
export async function spendDaily(item) {
    const frequency = item?.system?.frequency;
    if (!frequency) return true;
    if ((frequency.value ?? 0) <= 0) return false;
    await item.update({ "system.frequency.value": frequency.value - 1 });
    return true;
}

/** Omen of Blades (§7, 4th): 2 plus 2 per rank of the Stargazer DC. Pure. */
export function omenReduction(rank) {
    return 2 + 2 * Math.max(0, Number(rank) || 0);
}

/* ------------------------------------------------------------------------------------------------ */
/*  Used by posting them                                                                            */
/* ------------------------------------------------------------------------------------------------ */

/** Cold Read: the Deception check in the open, and the GM's secret Astronomy Lore beside it. */
async function coldRead(actor) {
    await actor.skills.deception.roll({ skipDialog: true, extraRollOptions: ["action:cold-read"], label: "Cold Read" });
    const lore = Object.values(actor.skills ?? {}).find((s) => s.slug === "astronomy-lore");
    if (!lore) return;
    const dc = LEVEL_DC[Math.min(actor.level ?? 1, LEVEL_DC.length - 1)];
    // "The GM rolls a secret Astronomy Lore check": pf2e keeps a check from its roller when it carries the
    // `secret` trait; a `rollMode` alone was posted in the open (driven).
    await lore.roll({ skipDialog: true, rollMode: "blindroll", traits: ["secret"], dc: { value: dc, label: "Cold Read (the prophecy)" }, extraRollOptions: ["action:cold-read", "secret"] });
}

/** After the GM's secret check lands: on a critical success, tell the GM the prophecy was true. */
async function coldReadVerdict(message) {
    const context = message.flags?.pf2e?.context;
    if (!(context?.options ?? []).includes("action:cold-read") || context.type !== "skill-check") return;
    if (!context.domains?.includes("astronomy-lore") || context.outcome !== "criticalSuccess") return;
    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: message.actor }),
        whisper: gmIds(),
        content: `<p><strong>Cold Read</strong> — ${message.actor?.name} was <strong>accidentally right</strong>. Treat what they said as true.</p>`,
    });
}

/** Read the Room: Sense Motive, once per encounter. */
async function readTheRoom(actor) {
    const combat = game.combats?.find((c) => c.started && c.combatants.some((x) => x.actorId === actor.id));
    if (combat && state(actor).readTheRoom === combat.id) {
        return ui.notifications.warn("Read the Room: already used this encounter.");
    }
    if (combat) await actor.update({ [`flags.${MODULE_ID}.${FLAG}.readTheRoom`]: combat.id });
    await game.pf2e.actions.get("sense-motive").use({ actors: [actor] });
}

/** Fate's Favourite: armed on yourself, spent by your next d20 (ADR-0004). */
async function fatesFavourite(actor, item) {
    if (!(await spendDaily(item))) return ui.notifications.warn("Fate's Favourite: already used today.");
    const source = await effectFromPack("Effect: Fate's Favourite");
    if (source) await actor.createEmbeddedDocuments("Item", [source]);
}

/** Written in Advance: armed on yourself for the hour; the next skill check takes it. */
async function writtenInAdvance(actor) {
    const old = actor.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.writtenInAdvance);
    if (old.length > 0) await actor.deleteEmbeddedDocuments("Item", old.map((e) => e.id));
    const source = await effectFromPack("Effect: Written in Advance");
    if (source) await actor.createEmbeddedDocuments("Item", [source]);
}

/** Star-Marked Enemy: the creature targeted, marked until the Stargazer's next Vigil. */
async function starMark(actor) {
    const targets = [...game.user.targets].map((t) => t.actor).filter((a) => a && a.id !== actor.id);
    if (targets.length !== 1) return ui.notifications.warn("Star-Marked Enemy: target exactly one creature.");
    await Relay.request({ action: "stargazerStarMark", origin: actor.uuid, target: targets[0].uuid });
}

async function applyStarMark({ origin: originUuid, target: targetUuid }) {
    const origin = await fromUuid(originUuid);
    const target = (await fromUuid(targetUuid))?.actor ?? (await fromUuid(targetUuid));
    if (!isStargazer(origin) || !has(origin, "star-marked-enemy") || !target) return;
    await clearStarMarks(origin);
    const source = await effectFromPack("Effect: Star-Marked");
    if (!source) return;
    source.flags[MODULE_ID].starMarked = origin.uuid;
    source.system.description.value = `<p>Marked by ${origin.name}: Coiling Doubt and Snarl reach it wherever it is known to be, until ${origin.name}'s next daily preparations.</p>`;
    await target.createEmbeddedDocuments("Item", [source]);
    await say(origin, `<strong>Star-Marked Enemy</strong>: ${target.name}, until your next daily preparations.`, { whisper: ownersOf(origin) });
}

/** One mark at a time, and none past the next Vigil. */
export async function clearStarMarks(origin) {
    for (const actor of game.actors) {
        const marks = actor.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.starMarked === origin.uuid);
        if (marks.length > 0) await actor.deleteEmbeddedDocuments("Item", marks.map((e) => e.id));
    }
    for (const token of canvas?.scene?.tokens ?? []) {
        if (token.actorLink || !token.actor) continue;
        const marks = token.actor.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.starMarked === origin.uuid);
        if (marks.length > 0) await token.actor.deleteEmbeddedDocuments("Item", marks.map((e) => e.id));
    }
}

/* ------------------------------------------------------------------------------------------------ */
/*  Reckoning of Days                                                                               */
/* ------------------------------------------------------------------------------------------------ */

/**
 * The DC to read a day's sky (guide §8.4): the level-based **Hard** DC, less 5 on an Exalted or Malefic day
 * — "a great sky is obvious to anyone who looks up". The region's level is the Stargazer's, for want of one.
 */
export function readingDC(level, aspect) {
    const base = LEVEL_DC[Math.min(Math.max(level ?? 1, 0), LEVEL_DC.length - 1)] + 2;
    return ["exalted", "malefic"].includes(aspect) ? base - 5 : base;
}

/** What a reading of that degree tells the reader (§8.4). A critical failure is a wrong sign, told as a success. */
export function readingResult(degree, day, { wrongSign } = {}) {
    if (degree === 3) return { sign: day.sign, aspect: day.aspect };
    if (degree === 2) return { sign: day.sign, aspect: null };
    if (degree === 0) return { sign: wrongSign, aspect: null };
    return null;
}

/** Reckoning of Days (§7, 2nd): yesterday, or four to seven days out — the queue's end. */
async function reckoning(actor) {
    const sky = SkyTracker.state;
    const days = [{ label: `Yesterday (day ${sky.day - 1})`, offset: -1 }];
    for (let n = 4; n <= Math.min(7, sky.queue?.length ?? 0); n++) days.push({ label: `Day ${sky.day + n} (${n} days out)`, offset: n });
    const data = await foundry.applications.api.DialogV2.prompt({
        window: { title: "Reckoning of Days" },
        content: `<p>Which day's sky do you reckon?</p><div class="form-group"><label>Day</label><select name="offset">${days.map((d) => `<option value="${d.offset}">${d.label}</option>`).join("")}</select></div>`,
        rejectClose: false,
        ok: { label: "Reckon it", callback: (_e, button) => new foundry.applications.ux.FormDataExtended(button.form).object },
    });
    const offset = Number(data?.offset);
    if (!days.some((d) => d.offset === offset)) return;
    const day = offset < 0 ? SkyTracker.recall(sky.day - 1) : sky.queue?.[offset - 1];
    const lore = Object.values(actor.skills ?? {}).find((s) => s.slug === "astronomy-lore");
    if (!lore) return ui.notifications.warn("Reckoning of Days: you have no Astronomy Lore.");
    if (!day) {
        return say(actor, `<strong>Reckoning of Days</strong>: the tracker does not hold that day; the GM tells you what it was.`, { whisper: ownersOf(actor) });
    }
    const dc = readingDC(actor.level, day.aspect);
    const roll = await lore.roll({
        skipDialog: true, rollMode: "blindroll", traits: ["secret"], dc: { value: dc, label: "Reckoning of Days" },
        extraRollOptions: ["action:reckoning-of-days", "secret"],
    });
    const degree = roll?.degreeOfSuccess ?? roll?.options?.degreeOfSuccess ?? null;
    const others = SIGN_IDS.filter((s) => s !== day.sign);
    const result = readingResult(degree, day, { wrongSign: others[Math.floor(Math.random() * others.length)] });
    const when = offset < 0 ? "Yesterday" : `Day ${sky.day + offset}`;
    const text = result
        ? `${when}: ${signOf(result.sign).glyph} <strong>${signOf(result.sign).label}</strong>${result.aspect ? `, ${aspectOf(result.aspect).label}` : " rules it; not whether that is good news"}.`
        : `${when}: the sky will not say.`;
    await say(actor, `<strong>Reckoning of Days</strong> — ${text}`, { whisper: ownersOf(actor) });
}

/**
 * Reading the sky without the class (guide §8.4): ten minutes under an open sky and an Astronomy Lore or
 * Occultism check, as Recall Knowledge, against the region's Hard DC — 5 lower on an Exalted or Malefic day.
 * Anyone can; the macro in the Stargazer's macro pack calls this. The roll is secret, and what it tells the
 * reader is whispered to them: sign and aspect, the sign, nothing, or a wrong sign told as a success.
 */
export async function readTheSky(actor) {
    if (!actor) return ui.notifications.warn("Read the Sky: select your token first.");
    const sky = SkyTracker.state;
    if (sky.clouded) return ui.notifications.warn("Read the Sky: the sky is clouded tonight; there is nothing to read.");
    const lore = Object.values(actor.skills ?? {}).find((s) => s.slug === "astronomy-lore");
    const skills = [lore, actor.skills?.occultism].filter(Boolean);
    const data = await foundry.applications.api.DialogV2.prompt({
        window: { title: "Read the Sky" },
        content: `<p>Ten minutes under an open sky. The region's level sets the DC.</p>
            <div class="form-group"><label>Skill</label><select name="skill">${skills.map((s) => `<option value="${s.slug}">${s.label} (${s.mod >= 0 ? "+" : ""}${s.mod})</option>`).join("")}</select></div>
            <div class="form-group"><label>Region level</label><input type="number" name="level" min="0" max="25" value="${actor.level ?? 1}" /></div>`,
        rejectClose: false,
        ok: { label: "Read it", callback: (_e, button) => new foundry.applications.ux.FormDataExtended(button.form).object },
    });
    if (!data) return;
    const statistic = skills.find((s) => s.slug === data.skill);
    if (!statistic) return;
    const dc = readingDC(Number(data.level), sky.aspect);
    const roll = await statistic.roll({
        skipDialog: true, rollMode: "blindroll", traits: ["secret"], dc: { value: dc, label: "Read the Sky" },
        extraRollOptions: ["action:recall-knowledge", "action:read-the-sky", "secret"],
    });
    const degree = roll?.degreeOfSuccess ?? roll?.options?.degreeOfSuccess ?? null;
    const others = SIGN_IDS.filter((s) => s !== sky.sign);
    const result = readingResult(degree, { sign: sky.sign, aspect: sky.aspect }, { wrongSign: others[Math.floor(Math.random() * others.length)] });
    const text = result
        ? `Today: ${signOf(result.sign).glyph} <strong>${signOf(result.sign).label}</strong>${result.aspect ? `, ${aspectOf(result.aspect).label}` : " rules it; not whether that is good news"}.`
        : "The sky will not say.";
    await say(actor, `<strong>Read the Sky</strong> — ${text}`, { whisper: [...new Set([...ownersOf(actor), ...gmIds()])] });
}

/* ------------------------------------------------------------------------------------------------ */
/*  Foretold Escape                                                                                 */
/* ------------------------------------------------------------------------------------------------ */

/**
 * The attack roll that just dropped this Stargazer, or null. Foretold Escape reaches only an **attack
 * roll** against you (ruling R15), so damage no attack roll dealt finds nothing here.
 */
function killingAttack(actor, attacker) {
    // The most recent attack at this creature, and only if it hit. An older hit further up the log is not
    // what dealt this damage — driven: a fire splash after a miss found the hit before it.
    for (const message of game.messages.contents.slice(-15).reverse()) {
        const context = message.flags?.pf2e?.context;
        if (context?.type !== "attack-roll") continue;
        const target = context.target?.actor ? fromUuidSync(context.target.actor) : null;
        if (target?.id !== actor.id) continue;
        if (attacker && message.actor?.id !== attacker.id) return null;
        return ["success", "criticalSuccess"].includes(context.outcome) ? message : null;
    }
    return null;
}

async function offerEscape(actor, params, before) {
    if (!isStargazer(actor) || !(before > 0) || (actor.hitPoints?.value ?? 1) > 0) return;
    const item = featOf(actor, "foretold-escape");
    if (!item || (item.system.frequency?.value ?? 0) <= 0) return;
    const attack = killingAttack(actor, params?.item?.actor ?? null);
    if (!attack) return;
    await offerCard(actor, `<strong>Foretold Escape</strong> — ${attack.actor?.name}'s attack would end you. Speak a Portent of 1 over it?`,
        "escape", { messageId: attack.id, before }, [["use", "Speak it: a 1"]]);
}

/** The attack re-read with a natural 1, and the Stargazer put back as they stood if it now misses. */
async function escape(origin, flag) {
    const item = featOf(origin, "foretold-escape");
    const attack = game.messages.get(flag.messageId);
    const context = attack?.flags?.pf2e?.context;
    const roll = attack?.rolls?.at(0);
    if (!item || !context || !roll) return;
    if (!(await spendDaily(item))) return say(origin, "<strong>Foretold Escape</strong>: already used today.", { whisper: ownersOf(origin) });
    const modifier = Number(roll.total) - Number(roll.dice?.find((d) => d.faces === 20)?.total ?? 0);
    const rollData = roll.toJSON();
    setDieResult(rollData, 1);
    const degree = degreeOf({ dieValue: 1, modifier, dc: context.dc?.value, adjustments: context.dosAdjustments ?? null });
    rollData.total = degree.total;
    rollData.options = { ...(rollData.options ?? {}), degreeOfSuccess: degree.value };
    await attack.update({
        rolls: [JSON.stringify(rollData)], content: String(degree.total),
        flavor: relabel(attack.flavor ?? "", degree, `Foretold Escape (${origin.name}): a Portent of 1`),
        "flags.pf2e.context.outcome": degree.key, "flags.pf2e.context.unadjustedOutcome": degree.unadjustedKey,
    });
    if (degree.value >= 2) {
        return say(origin, `<strong>Foretold Escape</strong>: even on a 1, ${attack.actor?.name}'s attack hits. The damage stands.`);
    }
    // It missed: it never happened. Hit Points back to where they stood, and the fall undone.
    await origin.update({ "system.attributes.hp.value": flag.before });
    for (const slug of ["dying", "unconscious"]) {
        const held = origin.itemTypes.condition.find((c) => c.slug === slug);
        if (held) await origin.decreaseCondition(slug, { forceRemove: true });
    }
    await say(origin, `<strong>Foretold Escape</strong>: ${attack.actor?.name}'s attack was always going to miss. ${origin.name} stands at ${flag.before} Hit Points.`);
}

/* ------------------------------------------------------------------------------------------------ */
/*  Patient Watcher: change an Augury when you Refocus                                              */
/* ------------------------------------------------------------------------------------------------ */

/** The Auguries a Stargazer chose — each granted by a ChoiceSet on a feature or feat, not the day's or a Path's. */
export function swappableAuguries(actor) {
    return actor.itemTypes.spell.filter((spell) => {
        if (!(spell.system.traits?.otherTags ?? []).includes("stargazer-augury")) return false;
        if (spell.flags?.[MODULE_ID]?.auguryOfTheDay) return false;
        const granter = actor.items.get(spell.flags?.pf2e?.grantedBy?.id ?? "");
        return Boolean(granter?.system?.rules?.some((r) => r.key === "ChoiceSet"));
    });
}

async function patientWatcher(actor) {
    const known = swappableAuguries(actor);
    if (known.length === 0) return ui.notifications.warn("Patient Watcher: no chosen Augury to change.");
    const pack = game.packs.get(`${MODULE_ID}.stargazer-auguries`);
    const names = new Set(actor.itemTypes.spell.map((s) => s.name));
    const options = (await pack.getIndex()).filter((e) => !names.has(e.name)).sort((a, b) => a.name.localeCompare(b.name));
    const data = await foundry.applications.api.DialogV2.prompt({
        window: { title: "Patient Watcher" },
        content: `<p>Change one of your known Auguries.</p>
            <div class="form-group"><label>Forget</label><select name="old">${known.map((s) => `<option value="${s.id}">${s.name}</option>`).join("")}</select></div>
            <div class="form-group"><label>Learn</label><select name="learn">${options.map((e) => `<option value="${e._id}">${e.name}</option>`).join("")}</select></div>`,
        rejectClose: false,
        ok: { label: "Change it", callback: (_e, button) => new foundry.applications.ux.FormDataExtended(button.form).object },
    });
    if (!data?.old || !data?.learn) return;
    await swapAugury(actor, data.old, data.learn);
}

/**
 * Put the new Augury where the old one was: granted by the same ChoiceSet, and the ChoiceSet's selection
 * moved to it, so pf2e's own bookkeeping (and a later level-down) sees the new one as the grant.
 */
export async function swapAugury(actor, oldId, packId) {
    const old = actor.items.get(oldId);
    if (!old || !swappableAuguries(actor).includes(old)) return;
    const granter = actor.items.get(old.flags.pf2e.grantedBy.id);
    const choice = granter.system.rules.find((r) => r.key === "ChoiceSet");
    const pack = game.packs.get(`${MODULE_ID}.stargazer-auguries`);
    const fresh = await pack.getDocument(packId);
    if (!fresh || actor.itemTypes.spell.some((s) => s.name === fresh.name)) return;
    const source = foundry.utils.deepClone(fresh.toObject());
    source._stats = { ...(source._stats ?? {}), compendiumSource: fresh.uuid };
    source.system.location = { value: old.system.location?.value ?? null };
    source.flags = foundry.utils.mergeObject(source.flags ?? {}, { pf2e: { grantedBy: { id: granter.id, onDelete: "cascade" } } });
    await old.delete();
    const [created] = await actor.createEmbeddedDocuments("Item", [source]);
    const grants = foundry.utils.deepClone(granter.flags?.pf2e?.itemGrants ?? {});
    const key = Object.keys(grants).find((k) => grants[k]?.id === oldId) ?? choice.flag;
    grants[key] = { id: created.id, onDelete: "detach" };
    // pf2e derives `rulesSelections` from the ChoiceSet rule's own `selection` on every prepare, so the flag
    // alone reverted (driven); the rule is what has to move.
    const rules = foundry.utils.deepClone(granter._source.system.rules);
    const index = rules.findIndex((r) => r.key === "ChoiceSet");
    if (index >= 0) rules[index].selection = fresh.uuid;
    await granter.update({ "system.rules": rules, [`flags.pf2e.rulesSelections.${choice.flag}`]: fresh.uuid, "flags.pf2e.itemGrants": grants });
    await say(actor, `<strong>Patient Watcher</strong>: ${old.name} is forgotten; ${created.name} is learned.`, { whisper: ownersOf(actor) });
}

/* ------------------------------------------------------------------------------------------------ */
/*  Buttons after the event, offered by the GM                                                      */
/* ------------------------------------------------------------------------------------------------ */

async function offerCard(origin, html, key, data, buttons) {
    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: origin }),
        whisper: ownersOf(origin),
        content: `<p>${html}</p>${buttons.map(([kind, label]) => `<button type="button" data-stargazer-feat="${key}" data-kind="${kind}">${label}</button>`).join("")}`,
        flags: { [MODULE_ID]: { featCard: { key, origin: origin.uuid, used: false, ...data } } },
    });
}

/** Why this Stargazer cannot give Second Chance at Fate to this roll, or null. Pure enough to pin. */
export function secondChanceRefusal({ usesLeft, outcome, distanceFeet, alreadyFortune }) {
    if (outcome !== "criticalFailure") return "only a critical failure";
    if (usesLeft <= 0) return "already used today";
    if (distanceFeet > 30) return "beyond 30 feet";
    if (alreadyFortune) return "a fortune effect already touched that roll";
    return null;
}

const fortuneTouched = (context) => Boolean(context?.isReroll || context?.rollTwice === "keep-higher"
    || (context?.substitutions ?? []).some((s) => s.selected !== false && s.effectType === "fortune"));

async function afterCheck(message) {
    const context = message.flags?.pf2e?.context;
    const roller = message.actor;
    if (!context || !roller || !["attack-roll", "saving-throw", "skill-check", "perception-check", "check"].includes(context.type)) return;

    for (const origin of stargazers()) {
        // Omen of Blades: a Snarled attack that hits anyway.
        if (context.type === "attack-roll" && ["success", "criticalSuccess"].includes(context.outcome)
            && snarledBy(context.options).includes(origin.id) && has(origin, "omen-of-blades")
            && (origin.system?.resources?.focus?.value ?? 0) > 0 && context.target?.actor) {
            const n = omenReduction(origin.classDCs?.stargazer?.rank);
            await offerCard(origin, `<strong>Omen of Blades</strong> — ${roller.name}'s attack hit through your Snarl. Spend 1 Focus Point to take ${n} off its damage?`,
                "omen", { messageId: message.id, target: context.target.actor, amount: n }, [["use", `Reduce by ${n} (1 Focus Point)`]]);
        }

        // Second Chance at Fate: a critical failure within 30 feet.
        const second = featOf(origin, "second-chance-at-fate");
        if (second && context.outcome === "criticalFailure" && !secondChanceRefusal({
            usesLeft: second.system.frequency?.value ?? 0, outcome: context.outcome,
            distanceFeet: roller.id === origin.id ? 0 : feet(origin, roller), alreadyFortune: fortuneTouched(context),
        })) {
            await offerCard(origin, `<strong>Second Chance at Fate</strong> — ${roller.id === origin.id ? "you" : roller.name} critically failed. Have it reroll?`,
                "second", { messageId: message.id }, [["use", "Reroll it (fortune)"]]);
        }

        // Inevitable: a critical success on a check against you.
        const inevitable = featOf(origin, "inevitable");
        const against = context.target?.actor && fromUuidSync(context.target.actor)?.id === origin.id;
        if (inevitable && against && context.outcome === "criticalSuccess" && roller.id !== origin.id
            && (inevitable.system.frequency?.value ?? 0) > 0 && reactionsLeft(origin) > 0) {
            await offerCard(origin, `<strong>Inevitable</strong> — ${roller.name} critically succeeded against you. Make it only a success?`,
                "inevitable", { messageId: message.id }, [["use", "Use your reaction"]]);
        }
    }

    // Written in Advance: the next skill check takes the effect with it.
    if (context.type === "skill-check") {
        const written = roller.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.writtenInAdvance);
        if (written.length > 0) await roller.deleteEmbeddedDocuments("Item", written.map((e) => e.id));
    }
}

/** Patient Watcher: offered after a Refocus. */
async function afterRefocus(message) {
    const actor = message.actor;
    if (message.item?.slug !== "refocus" || !isStargazer(actor)) return;
    // Refocus (guide §4.1): "you Refocus by reading the sky, or your chart, for 10 minutes". pf2e's Refocus
    // is text only and restores nothing (driven), so the Focus Point is given here, up to the pool.
    const focus = actor.system?.resources?.focus;
    if (focus && (focus.value ?? 0) < (focus.max ?? 0)) {
        await actor.update({ "system.resources.focus.value": Math.min(focus.max, (focus.value ?? 0) + 1) });
        await say(actor, `<strong>Refocus</strong>: ten minutes with the sky, or the chart. ${actor.name} has ${actor.system.resources.focus.value} of ${focus.max} Focus Points.`, { whisper: ownersOf(actor) });
    }
    // Unbroken Chain (§7, 18th): Unmake the Moment recharges on a 10-minute rest, no more than once per hour.
    const s = state(actor);
    if (has(actor, "unbroken-chain") && (s.unmakeUsed ?? 0) > 0 && (typeof s.chainAt !== "number" || game.time.worldTime - s.chainAt >= 3600)) {
        await actor.update({ [`flags.${MODULE_ID}.${FLAG}.unmakeUsed`]: 0, [`flags.${MODULE_ID}.${FLAG}.chainAt`]: game.time.worldTime });
        await say(actor, "<strong>Unbroken Chain</strong>: ten minutes' rest, and Unmake the Moment is ready again.", { whisper: ownersOf(actor) });
    }
    if (!has(actor, "patient-watcher")) return;
    await offerCard(actor, "<strong>Patient Watcher</strong> — you Refocused. Change one of your known Auguries?", "watcher", {}, [["use", "Change an Augury"]]);
}

async function useCard({ card: cardId }) {
    const card = game.messages.get(cardId);
    const flag = card?.flags?.[MODULE_ID]?.featCard;
    if (!flag || flag.used) return;
    const origin = await fromUuid(flag.origin);
    if (!isStargazer(origin)) return;
    await card.update({ [`flags.${MODULE_ID}.featCard.used`]: true });
    const source = game.messages.get(flag.messageId ?? "");

    if (flag.key === "omen") {
        const focus = origin.system?.resources?.focus?.value ?? 0;
        if (focus <= 0) return say(origin, "<strong>Omen of Blades</strong>: no Focus Point left.", { whisper: ownersOf(origin) });
        const target = (await fromUuid(flag.target))?.actor ?? (await fromUuid(flag.target));
        if (!target) return;
        await origin.update({ "system.resources.focus.value": focus - 1 });
        await target.createEmbeddedDocuments("Item", [{
            name: `Omen of Blades (${flag.amount})`, type: "effect", img: "icons/magic/unholy/orb-glowing-purple.webp",
            system: {
                description: { value: `<p>${origin.name}'s Omen of Blades: the next damage taken is ${flag.amount} less.</p>` },
                duration: { value: 1, unit: "rounds", expiry: "turn-end", sustained: false },
                level: { value: origin.level ?? 1 },
                rules: [{ key: "Resistance", type: "all-damage", value: flag.amount }],
                tokenIcon: { show: true },
            },
            flags: { [MODULE_ID]: { omenOfBlades: origin.uuid } },
        }]);
        return say(origin, `<strong>Omen of Blades</strong>: ${target.name} takes ${flag.amount} less from that attack's damage.`);
    }

    if (flag.key === "second") {
        const item = featOf(origin, "second-chance-at-fate");
        const context = source?.flags?.pf2e?.context;
        const why = !source || !context ? "the roll is gone" : secondChanceRefusal({
            usesLeft: item?.system.frequency?.value ?? 0, outcome: context.outcome,
            distanceFeet: source.actor?.id === origin.id ? 0 : feet(origin, source.actor), alreadyFortune: fortuneTouched(context),
        });
        if (why) return say(origin, `<strong>Second Chance at Fate</strong>: ${why}.`, { whisper: ownersOf(origin) });
        await spendDaily(item);
        await game.pf2e.Check.rerollFromMessage(source, { keep: "new" });
        return;
    }

    if (flag.key === "escape") return escape(origin, flag);

    if (flag.key === "inevitable") {
        const item = featOf(origin, "inevitable");
        const context = source?.flags?.pf2e?.context;
        if (!source || context?.outcome !== "criticalSuccess") return;
        if (reactionsLeft(origin) <= 0) return say(origin, "<strong>Inevitable</strong>: no reaction left this round.", { whisper: ownersOf(origin) });
        if (!(await spendDaily(item))) return say(origin, "<strong>Inevitable</strong>: already used today.", { whisper: ownersOf(origin) });
        await spendReaction(origin);
        const roll = source.rolls.at(0);
        const rollData = roll.toJSON();
        rollData.options = { ...(rollData.options ?? {}), degreeOfSuccess: 2 };
        await source.update({
            rolls: [JSON.stringify(rollData)],
            flavor: relabel(source.flavor ?? "", { key: "success", value: 2 }, `Inevitable (${origin.name})`),
            "flags.pf2e.context.outcome": "success",
        });
    }
}

/* ------------------------------------------------------------------------------------------------ */
/*  Companion of the Watch                                                                          */
/* ------------------------------------------------------------------------------------------------ */

async function makeFamiliar(item) {
    const master = item.actor;
    if (item.slug !== "companion-of-the-watch" || !isStargazer(master)) return;
    if (game.actors.some((a) => a.type === "familiar" && a.system?.master?.id === master.id)) return;
    const familiar = await Actor.create({
        name: `${master.name}'s Watcher`,
        type: "familiar",
        img: "icons/creatures/birds/owl-flying-white.webp",
        system: { master: { id: master.id } },
        ownership: foundry.utils.deepClone(master.ownership),
        // pf2e 8's familiar stores no traits (its schema has none, and an ActorTraits rule on it is ignored —
        // driven), so `celestial` is carried as the roll option a trait would produce. Predicates see it, on
        // the familiar as `self:trait:celestial` and on anything aiming at it as `target:trait:celestial`.
        flags: { [MODULE_ID]: { companionOfTheWatch: master.uuid }, pf2e: { rollOptions: { all: { "self:trait:celestial": true } } } },
    });
    if (familiar) await say(master, `<strong>Companion of the Watch</strong>: ${familiar.name} watches with you. Give it one extra ability that gathers or carries information.`, { whisper: ownersOf(master) });
}

/* ------------------------------------------------------------------------------------------------ */

async function onOwnUse(message) {
    const item = message.item;
    const actor = item?.actor;
    if (!isStargazer(actor) || message.flags?.pf2e?.context) return;
    const run = {
        "cold-read": () => coldRead(actor),
        "read-the-room": () => readTheRoom(actor),
        "prophecys-weight": () => announce(actor),
        "fates-favourite": () => fatesFavourite(actor, item),
        "written-in-advance": () => writtenInAdvance(actor),
        "star-marked-enemy": () => starMark(actor),
        "patient-watcher": () => patientWatcher(actor),
        "reckoning-of-days": () => reckoning(actor),
    }[item.slug];
    if (run) await run();
}

function bindCard(message, html) {
    const flag = message.flags?.[MODULE_ID]?.featCard;
    if (!flag) return;
    for (const button of html.querySelectorAll?.("button[data-stargazer-feat]") ?? []) {
        if (flag.used) button.disabled = true;
        button.addEventListener("click", async () => {
            for (const b of html.querySelectorAll("button[data-stargazer-feat]")) b.disabled = true;
            if (flag.key === "watcher") {
                const actor = await fromUuid(flag.origin);
                if (actor?.isOwner) await patientWatcher(actor);
                return;
            }
            Relay.request({ action: "stargazerFeatCard", card: message.id });
        });
    }
}

export const Feats = {
    registerHooks() {
        Relay.register?.("stargazerFeatCard", useCard);
        Relay.register?.("stargazerStarMark", applyStarMark);
        Relay.register?.("stargazerClearMarks", async ({ origin }) => {
            const actor = await fromUuid(origin);
            if (isStargazer(actor)) await clearStarMarks(actor);
        });
        Hooks.on("createChatMessage", (message, _options, userId) => {
            if (isWriter()) {
                afterCheck(message).catch((e) => console.error("Isaac's Homebrew | the Stargazer's feats", e));
                afterRefocus(message).catch((e) => console.error("Isaac's Homebrew | Patient Watcher", e));
                coldReadVerdict(message).catch((e) => console.error("Isaac's Homebrew | Cold Read", e));
            }
            if (userId === game.user.id) onOwnUse(message).catch((e) => console.error("Isaac's Homebrew | the Stargazer's feats", e));
        });
        Hooks.on("createItem", (item, _options, userId) => {
            if (userId === game.user.id && item.type === "feat") makeFamiliar(item).catch((e) => console.error("Isaac's Homebrew | Companion of the Watch", e));
        });
        DamageBus.after("Foretold Escape", DAMAGE.riders + 11, (actor, params, before) => offerEscape(actor, params, before));
        // Omen of Blades lasts one hit: the damage it softened takes it away.
        DamageBus.after("Omen of Blades", DAMAGE.riders + 10, async (actor) => {
            const omens = (actor?.itemTypes?.effect ?? []).filter((e) => e.flags?.[MODULE_ID]?.omenOfBlades);
            if (omens.length > 0 && actor.isOwner) await actor.deleteEmbeddedDocuments("Item", omens.map((e) => e.id));
        });
        Hooks.on("renderChatMessageHTML", (message, html) => bindCard(message, html));
    },
};

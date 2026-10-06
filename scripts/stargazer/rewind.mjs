import { Relay } from "../automation.mjs";
import { MODULE_ID } from "../sky/signs.mjs";
import { SkyTracker } from "../sky/tracker.mjs";
import { isStargazer } from "./threads.mjs";

/**
 * The rewinds — *Unmake the Moment* (guide §4.11) and *Rewrite the Ending* (§10.3), built as §11.7 and
 * ruling R5 say: a snapshot on a clean initiative boundary, and a restore.
 *
 * **A snapshot** is the board: every combatant's actor in full (Hit Points, conditions, effects, resources,
 * item uses), every token on the scene, the combatants, the round and turn, and the world clock. It is
 * taken on the GM's client — at the start of each Stargazer's turn for Unmake, at the start of *every*
 * turn when someone has *The Long Way Round*, and when the encounter starts for Rewrite — and kept in that
 * client's memory: a snapshot is a copy of the whole encounter, too large to write into a document every
 * turn. A reload of the GM's client forgets them, and the rewinds then say there is nothing to rewind to.
 *
 * **A restore** puts each actor back item by item, puts tokens back where they stood (re-creating any
 * removed, deleting any added — and an actor created for a token added since), puts the combatants and
 * the turn back, and winds the world clock back with them. The chat log is left alone.
 *
 * Unmake runs on the GM's client **without a confirmation**, because its trigger — your turn begins — is
 * checked. Rewrite asks the **GM to confirm**, because "defeated or captured" is a judgement.
 */

const FLAG = "stargazer";
const ADVENTURE = "stargazerAdventure";
const isWriter = () => (game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM);
const has = (actor, slug) => (actor?.itemTypes?.feat ?? []).some((f) => f.slug === slug);
const featOf = (actor, slug) => (actor?.itemTypes?.feat ?? []).find((f) => f.slug === slug) ?? null;
const state = (actor) => actor?.flags?.[MODULE_ID]?.[FLAG] ?? {};
/**
 * Options every write of a restore carries, so the module's own delete and create hooks stand aside. A fresh
 * object each time: Foundry writes `parent` into the options it is given, and one shared object carried the
 * scene from a token write into an actor update (driven: "Actor is not a valid embedded Document within
 * the Scene").
 */
const QUIET = () => ({ stargazerQuiet: true, stargazerRewind: true });

/** Turn snapshots by combat, then by combatant: the last three starts of that combatant's turn. */
const turnShots = new Map();
/** The snapshot taken when each encounter's initiative was rolled. */
const initiativeShots = new Map();

function ownersOf(actor) {
    return game.users.filter((u) => actor.testUserPermission(u, "OWNER")).map((u) => u.id);
}
const gmIds = () => game.users.filter((u) => u.isGM).map((u) => u.id);

async function say(actor, html, extra = {}) {
    return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: html, ...extra });
}

async function effectFromPack(name) {
    const pack = game.packs.get(`${MODULE_ID}.stargazer-effects`);
    const entry = (await pack?.getIndex())?.find((e) => e.name === name);
    return entry ? foundry.utils.deepClone((await pack.getDocument(entry._id)).toObject()) : null;
}

/* ------------------------------------------------------------------------------------------------ */
/*  Frequencies                                                                                     */
/* ------------------------------------------------------------------------------------------------ */

/** Unmake: once per day, twice with *Unmade Again* (§6.4). The count resets at the Vigil (and see Unbroken Chain). */
export function unmakeUses(actor) {
    return has(actor, "unmade-again") ? 2 : 1;
}

export function unmakeLeft(actor) {
    return Math.max(0, unmakeUses(actor) - (state(actor).unmakeUsed ?? 0));
}

/** The world's current adventure, for *The Long Vigil* — a name the GM sets in the module settings. */
export function currentAdventure() {
    try {
        return game.settings.get(MODULE_ID, ADVENTURE) ?? "";
    } catch {
        return "";
    }
}

/**
 * Rewrite's cooldown in the Sky's dawns (§11.7, "weeks are counted in the Sky's dawns"): 7, or 3 with *The
 * Long Vigil* when the last use was in an earlier adventure. Pure.
 */
export function rewriteCooldown({ longVigil, lastAdventure, adventure }) {
    return longVigil && lastAdventure !== adventure ? 3 : 7;
}

export function rewriteReady(actor, today = SkyTracker.state?.day) {
    const last = state(actor).rewrite;
    if (!last || typeof last.day !== "number") return true;
    const cooldown = rewriteCooldown({ longVigil: has(actor, "the-long-vigil"), lastAdventure: last.adventure ?? "", adventure: currentAdventure() });
    return today - last.day >= cooldown;
}

export const chartDark = (actor) => Boolean(state(actor).dark);

/* ------------------------------------------------------------------------------------------------ */
/*  Snapshot                                                                                        */
/* ------------------------------------------------------------------------------------------------ */

function sceneOf(combat) {
    return combat?.scene ?? game.scenes.get(combat?._source?.scene ?? "") ?? canvas?.scene ?? null;
}

/** The board, now. */
export function capture(combat) {
    const scene = sceneOf(combat);
    const actors = {};
    for (const combatant of combat.combatants) {
        const actor = combatant.actor;
        if (!actor) continue;
        const key = combatant.token && !combatant.token.actorLink ? `token:${combatant.token.id}` : `actor:${actor.id}`;
        actors[key] = actor.toObject();
    }
    return {
        combatId: combat.id,
        sceneId: scene?.id ?? null,
        round: combat.round,
        turn: combat.turn,
        combatantId: combat.combatant?.id ?? null,
        worldTime: game.time.worldTime,
        combatants: combat.combatants.map((c) => c.toObject()),
        tokens: scene ? scene.tokens.map((t) => t.toObject()) : [],
        actors,
        actorIds: game.actors.map((a) => a.id),
    };
}

function keepTurnShot(combat, combatantId) {
    let byCombatant = turnShots.get(combat.id);
    if (!byCombatant) turnShots.set(combat.id, (byCombatant = new Map()));
    // A turn replayed after a rewind replaces its own snapshot rather than joining it: two of round 2 pushed
    // round 1's out, and the second Unmake had nothing to go back to (driven).
    const shot = capture(combat);
    const list = (byCombatant.get(combatantId) ?? []).filter((s) => s.round !== shot.round || s.turn !== shot.turn);
    list.push(shot);
    list.sort((x, y) => x.round - y.round || x.turn - y.turn);
    byCombatant.set(combatantId, list.slice(-3));
}

/** Who needs a snapshot at the start of this turn: the Stargazer whose turn it is, or everyone for *The Long Way Round*. */
function wantsShot(combat, combatant) {
    const stargazers = combat.combatants.map((c) => c.actor).filter((a) => isStargazer(a) && has(a, "unmake-the-moment"));
    if (stargazers.length === 0) return false;
    if (stargazers.some((a) => has(a, "the-long-way-round"))) return true;
    return stargazers.some((a) => a.id === combatant?.actor?.id);
}

/**
 * The snapshot to go back to: the most recent start of this combatant's turn **before** the turn now
 * beginning. When the combatant is the one whose turn is starting, that is the one before the one just
 * taken — "the start of your last turn".
 */
export function previousShot(list, { now }) {
    const before = (list ?? []).filter((s) => s.round < now.round || (s.round === now.round && s.turn < now.turn));
    return before.at(-1) ?? null;
}

/* ------------------------------------------------------------------------------------------------ */
/*  Restore                                                                                         */
/* ------------------------------------------------------------------------------------------------ */

const strip = (source) => {
    const copy = foundry.utils.deepClone(source);
    delete copy._stats;
    delete copy.sort;
    return copy;
};

/** Put an actor back as its snapshot had it, item by item. */
async function restoreActor(actor, snap) {
    const current = new Map(actor.items.map((i) => [i.id, i]));
    const wanted = new Map(snap.items.map((i) => [i._id, i]));
    const remove = [...current.keys()].filter((id) => !wanted.has(id));
    const create = [...wanted.values()].filter((i) => !current.has(i._id));
    const update = [...wanted.values()]
        .filter((i) => current.has(i._id))
        .filter((i) => JSON.stringify(strip(current.get(i._id).toObject())) !== JSON.stringify(strip(i)))
        .map((i) => ({ _id: i._id, name: i.name, img: i.img, system: i.system, flags: i.flags }));
    if (remove.length > 0) await actor.deleteEmbeddedDocuments("Item", remove, QUIET());
    if (update.length > 0) await actor.updateEmbeddedDocuments("Item", update, { ...QUIET(), recursive: false });
    if (create.length > 0) await actor.createEmbeddedDocuments("Item", create, { ...QUIET(), keepId: true });
    // A re-created item with a GrantItem can grant again what the snapshot already holds; the snapshot is the truth.
    const extra = actor.items.filter((i) => !wanted.has(i.id)).map((i) => i.id);
    if (extra.length > 0) await actor.deleteEmbeddedDocuments("Item", extra, QUIET());
    await actor.update({ system: snap.system, flags: snap.flags ?? {} }, { ...QUIET(), recursive: false });
}

/**
 * The whole board back as the snapshot had it. `keep` names Stargazer flags the rewind must not undo — the
 * use it is itself being spent on.
 */
export async function restore(snap) {
    const combat = game.combats.get(snap.combatId);
    const scene = game.scenes.get(snap.sceneId);
    if (!combat || !scene) return false;

    // Tokens: deleted ones come back, added ones go, and every one stands where it stood.
    const wantedTokens = new Map(snap.tokens.map((t) => [t._id, t]));
    const added = scene.tokens.filter((t) => !wantedTokens.has(t.id));
    const addedActors = added.map((t) => t.actorId).filter((id) => id && !snap.actorIds.includes(id));
    if (added.length > 0) await scene.deleteEmbeddedDocuments("Token", added.map((t) => t.id), QUIET());
    const missing = snap.tokens.filter((t) => !scene.tokens.has(t._id));
    if (missing.length > 0) await scene.createEmbeddedDocuments("Token", missing, { ...QUIET(), keepId: true });
    const moves = snap.tokens.filter((t) => scene.tokens.has(t._id)).map((t) => ({
        _id: t._id, x: t.x, y: t.y, elevation: t.elevation, rotation: t.rotation, hidden: t.hidden,
    }));
    if (moves.length > 0) await scene.updateEmbeddedDocuments("Token", moves, { ...QUIET(), animate: false });
    for (const id of [...new Set(addedActors)]) {
        const actor = game.actors.get(id);
        if (actor && !game.scenes.some((s) => s.tokens.some((t) => t.actorId === id))) await actor.delete(QUIET());
    }

    // Actors: linked ones in the world, unlinked ones through their token.
    for (const [key, source] of Object.entries(snap.actors)) {
        const [kind, id] = key.split(":");
        const actor = kind === "token" ? scene.tokens.get(id)?.actor : game.actors.get(id);
        if (actor) await restoreActor(actor, source);
    }

    // Combatants and the turn.
    const wantedCombatants = new Map(snap.combatants.map((c) => [c._id, c]));
    const extra = combat.combatants.filter((c) => !wantedCombatants.has(c.id)).map((c) => c.id);
    if (extra.length > 0) await combat.deleteEmbeddedDocuments("Combatant", extra, QUIET());
    const gone = snap.combatants.filter((c) => !combat.combatants.has(c._id));
    if (gone.length > 0) await combat.createEmbeddedDocuments("Combatant", gone, { ...QUIET(), keepId: true });
    // With their flags: pf2e starts and ends a combatant's turn once per round (`roundOfLastTurn`,
    // `roundOfLastTurnEnd`), and a turn rewound into a round it had already started never began again
    // (driven: the Long Way Round's second use found no card waiting).
    const back = snap.combatants.filter((c) => combat.combatants.has(c._id))
        .map((c) => ({ _id: c._id, initiative: c.initiative, defeated: c.defeated, hidden: c.hidden, flags: c.flags }));
    if (back.length > 0) await combat.updateEmbeddedDocuments("Combatant", back, QUIET());
    await combat.update({ round: snap.round, turn: snap.turn }, { ...QUIET(), direction: -1 });

    // Snapshots of turns the rewind erased are of a timeline that no longer happened.
    for (const [id, list] of turnShots.get(combat.id) ?? []) {
        turnShots.get(combat.id).set(id, list.filter((s) => s.round < snap.round || (s.round === snap.round && s.turn <= snap.turn)));
    }

    // The clock goes back with the rounds, so effects measured in it do not run out early.
    const delta = snap.worldTime - game.time.worldTime;
    if (delta < 0) await game.time.advance(delta);
    return true;
}

/* ------------------------------------------------------------------------------------------------ */
/*  Unmake the Moment                                                                               */
/* ------------------------------------------------------------------------------------------------ */

/**
 * Dead: no Hit Points and dying at its maximum. pf2e's `isDead` also wants the death overlay on a token,
 * which a character reaching dying 4 does not get by itself (driven).
 */
export function isDead(actor) {
    if (actor?.isDead) return true;
    const dying = actor?.itemTypes?.condition?.find((c) => c.slug === "dying")?.value ?? 0;
    const max = actor?.attributes?.dying?.max ?? 4;
    return (actor?.hitPoints?.value ?? 1) <= 0 && dying >= max;
}

/** The combats this Stargazer is fighting in, the viewed one first. */
function combatOf(actor) {
    const holds = (c) => c?.started && c.combatants.some((x) => x.actorId === actor.id);
    return holds(game.combat) ? game.combat : game.combats.find(holds) ?? null;
}

/** Offer Unmake at the start of the Stargazer's turn — the trigger, so the card only exists when it can fire. */
async function offerUnmake(combat, combatant) {
    const actor = combatant?.actor;
    if (!isStargazer(actor) || !has(actor, "unmake-the-moment") || unmakeLeft(actor) <= 0) return;
    const shot = previousShot(turnShots.get(combat.id)?.get(combatant.id), { now: { round: combat.round, turn: combat.turn } });
    if (!shot) return;
    const others = has(actor, "the-long-way-round")
        ? combat.combatants.filter((c) => c.id !== combatant.id && previousShot(turnShots.get(combat.id)?.get(c.id), { now: { round: combat.round, turn: combat.turn } }))
        : [];
    const choice = others.length > 0
        ? `<p>The Long Way Round: rewind to the start of <select name="whose"><option value="${combatant.id}">your last turn</option>${others.map((c) => `<option value="${c.id}">${c.name}'s last turn</option>`).join("")}</select></p>`
        : "";
    await say(actor, `<p><strong>Unmake the Moment</strong> — your turn begins. Rewind to the start of your last turn (round ${shot.round})? (${unmakeLeft(actor)} left today)</p>${choice}<button type="button" data-stargazer-rewind="unmake">Unmake it</button>`, {
        whisper: ownersOf(actor),
        flags: { [MODULE_ID]: { rewindCard: { kind: "unmake", origin: actor.uuid, combatId: combat.id, combatantId: combatant.id, round: combat.round, turn: combat.turn, used: false } } },
    });
}

/** The GM's half. The trigger is checked: it is still that turn, and a use is left — or The Long Way Round's week, while dead. */
async function unmake({ card: cardId, whose }) {
    const card = game.messages.get(cardId);
    const flag = card?.flags?.[MODULE_ID]?.rewindCard;
    if (!flag || flag.used || flag.kind !== "unmake") return;
    const origin = await fromUuid(flag.origin);
    const combat = game.combats.get(flag.combatId);
    if (!isStargazer(origin) || !combat) return;

    const dead = isDead(origin);
    const whileDead = dead && has(origin, "the-long-way-round");
    if (dead && !whileDead) return say(origin, "<p><strong>Unmake the Moment</strong>: you are dead.</p>", { whisper: ownersOf(origin) });
    if (whileDead) {
        const at = state(origin).deadUnmakeDay;
        if (typeof at === "number" && SkyTracker.state.day - at < 7) return say(origin, "<p><strong>The Long Way Round</strong>: you have already come back this week.</p>", { whisper: ownersOf(origin) });
    } else {
        const onTurn = combat.round === flag.round && combat.turn === flag.turn && combat.combatant?.id === flag.combatantId;
        if (!onTurn) return say(origin, "<p><strong>Unmake the Moment</strong>: only as your turn begins.</p>", { whisper: ownersOf(origin) });
        if (unmakeLeft(origin) <= 0) return say(origin, "<p><strong>Unmake the Moment</strong>: no use left today.</p>", { whisper: ownersOf(origin) });
    }

    const target = whose && has(origin, "the-long-way-round") ? whose : flag.combatantId;
    const shot = previousShot(turnShots.get(combat.id)?.get(target), { now: { round: flag.round, turn: flag.turn } });
    if (!shot) return say(origin, "<p><strong>Unmake the Moment</strong>: there is no moment to go back to — the GM's client has no snapshot of it.</p>", { whisper: ownersOf(origin) });

    await card.update({ [`flags.${MODULE_ID}.rewindCard.used`]: true });
    const used = state(origin).unmakeUsed ?? 0;
    if (!(await restore(shot))) return;

    // The rewind undid the Stargazer's own sheet too; the use it cost is written after.
    const after = { [`flags.${MODULE_ID}.${FLAG}.unmakeUsed`]: used + 1 };
    if (whileDead) after[`flags.${MODULE_ID}.${FLAG}.deadUnmakeDay`] = SkyTracker.state.day;
    await origin.update(after);
    await origin.increaseCondition("stunned", { value: 1 });
    if (!has(origin, "unmade-again")) await origin.increaseCondition("drained", { value: 1 });

    const whoseName = combat.combatants.get(target)?.name;
    const buttons = [`<button type="button" data-stargazer-rewind="shout">Shout a warning (1 action)</button>`];
    if (has(origin, "echo-of-the-unmade")) buttons.push(`<button type="button" data-stargazer-rewind="echo">Echo of the Unmade: share the memory</button>`);
    await say(origin, `<p><strong>Unmake the Moment</strong> — the round never happened. Back to the start of ${target === flag.combatantId ? `${origin.name}'s` : `${whoseName}'s`} last turn (round ${shot.round}). ${origin.name} alone remembers it.</p>${buttons.join(" ")}`, {
        flags: { [MODULE_ID]: { rewindCard: { kind: "after", origin: origin.uuid, round: shot.round, used: false } } },
    });
}

/** Shout a warning: +2 circumstance to one ally's next roll this round. */
async function shout({ origin: originUuid, ally: allyUuid }) {
    const origin = await fromUuid(originUuid);
    const ally = (await fromUuid(allyUuid))?.actor ?? (await fromUuid(allyUuid));
    if (!isStargazer(origin) || !ally) return;
    const source = await effectFromPack("Effect: Shouted Warning");
    if (source) await ally.createEmbeddedDocuments("Item", [source]);
    await say(origin, `<p><strong>Unmake the Moment</strong>: ${origin.name} shouts a warning — ${ally.name} takes +2 to their next roll this round.</p>`);
}

/** Echo of the Unmade: one ally keeps the erased round. */
async function echo({ origin: originUuid, ally: allyUuid }) {
    const origin = await fromUuid(originUuid);
    const ally = (await fromUuid(allyUuid))?.actor ?? (await fromUuid(allyUuid));
    if (!isStargazer(origin) || !has(origin, "echo-of-the-unmade") || !ally) return;
    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: origin }),
        whisper: [...new Set([...ownersOf(ally), ...gmIds()])],
        content: `<p><strong>Echo of the Unmade</strong> — ${ally.name}, you remember the round that never happened: everything you saw in it is yours to keep. Nobody else remembers.</p>`,
    });
}

/* ------------------------------------------------------------------------------------------------ */
/*  Rewrite the Ending                                                                              */
/* ------------------------------------------------------------------------------------------------ */

/** The Stargazer invokes it; the GM is asked, with The Sky Answers offered beside it when it can be. */
async function invokeRewrite(actor) {
    const combat = combatOf(actor);
    if (!combat) return ui.notifications.warn("Rewrite the Ending: there is no encounter to rewrite.");
    if (chartDark(actor)) return ui.notifications.warn("Rewrite the Ending: your Star Chart is dark.");
    const answers = featOf(actor, "the-sky-answers");
    const skyAnswers = answers && (answers.system.frequency?.value ?? 0) > 0;
    if (!rewriteReady(actor) && !skyAnswers) return ui.notifications.warn("Rewrite the Ending: not again yet.");
    await Relay.request({ action: "stargazerRewriteAsk", origin: actor.uuid, combatId: combat.id });
}

async function askRewrite({ origin: originUuid, combatId }) {
    const origin = await fromUuid(originUuid);
    const combat = game.combats.get(combatId);
    if (!isStargazer(origin) || !combat) return;
    const shot = initiativeShots.get(combat.id);
    const answers = featOf(origin, "the-sky-answers");
    const skyAnswers = answers && (answers.system.frequency?.value ?? 0) > 0 && has(origin, "unmake-the-moment");
    const buttons = [];
    if (rewriteReady(origin) && shot) buttons.push(`<button type="button" data-stargazer-rewind="rewrite">Confirm: rewrite the encounter</button>`);
    if (skyAnswers) buttons.push(`<button type="button" data-stargazer-rewind="sky-answers">The Sky Answers: Unmake the Moment instead</button>`);
    const why = !shot ? " The GM's client has no snapshot of this encounter's start." : !rewriteReady(origin) ? " Rewrite the Ending is not ready again." : "";
    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: origin }),
        whisper: gmIds(),
        content: `<p><strong>Rewrite the Ending</strong> — ${origin.name} invokes it: they or an ally within 60 feet died, or the party is defeated or captured. Is that so?${why}</p>${buttons.join(" ")}`,
        flags: { [MODULE_ID]: { rewindCard: { kind: "rewrite", origin: origin.uuid, combatId: combat.id, used: false } } },
    });
}

async function rewrite(card, flag) {
    const origin = await fromUuid(flag.origin);
    const combat = game.combats.get(flag.combatId);
    const shot = initiativeShots.get(flag.combatId);
    if (!isStargazer(origin) || !combat || !shot || !rewriteReady(origin)) return;
    await card.update({ [`flags.${MODULE_ID}.rewindCard.used`]: true });

    // Who was in the erased timeline, before it is erased.
    const allies = combat.combatants.map((c) => c.actor).filter((a) => a && (a.id === origin.id || a.isAllyOf?.(origin)));
    if (!(await restore(shot))) return;
    // Initiative is rolled again: that is the re-run encounter.
    await combat.resetAll();
    await combat.update({ round: 0, turn: null }, QUIET());

    const remembered = [await effectFromPack("Effect: Remembered Initiative"), await effectFromPack("Effect: Remembered Ending")].filter(Boolean);
    for (const ally of allies) if (remembered.length > 0) await ally.createEmbeddedDocuments("Item", remembered.map((e) => foundry.utils.deepClone(e)));

    // The cost, written after the restore it would otherwise have undone.
    await origin.update({
        [`flags.${MODULE_ID}.${FLAG}.rewrite`]: { day: SkyTracker.state.day, adventure: currentAdventure() },
        [`flags.${MODULE_ID}.${FLAG}.dark`]: { day: SkyTracker.state.day },
        "system.resources.focus.value": 0,
    });
    await origin.increaseCondition("drained", { value: 2 });
    await origin.increaseCondition("doomed", { value: 1 });
    const dark = await effectFromPack("Effect: Star Chart Dark");
    if (dark) await origin.createEmbeddedDocuments("Item", [dark]);
    await say(origin, `<p><strong>Rewrite the Ending</strong> — the encounter has not happened. Roll initiative again: ${allies.map((a) => a.name).join(", ")} remember it (+2 to initiative and to the first d20). ${origin.name}'s Star Chart goes dark.</p>`);
}

/** The Sky Answers: Unmake instead, without spending its frequency, and Rewrite not expended. */
async function skyAnswers(card, flag) {
    const origin = await fromUuid(flag.origin);
    const combat = game.combats.get(flag.combatId);
    const answers = featOf(origin, "the-sky-answers");
    if (!isStargazer(origin) || !combat || !answers || (answers.system.frequency?.value ?? 0) <= 0) return;
    const combatant = combat.combatants.find((c) => c.actorId === origin.id);
    const shot = previousShot(turnShots.get(combat.id)?.get(combatant?.id), { now: { round: combat.round, turn: combat.turn } });
    if (!shot) return say(origin, "<p><strong>The Sky Answers</strong>: there is no moment to go back to.</p>", { whisper: gmIds() });
    await card.update({ [`flags.${MODULE_ID}.rewindCard.used`]: true });
    const frequency = answers.system.frequency.value;
    if (!(await restore(shot))) return;
    await answers.update({ "system.frequency.value": frequency - 1 });
    await origin.increaseCondition("stunned", { value: 1 });
    if (!has(origin, "unmade-again")) await origin.increaseCondition("drained", { value: 1 });
    await say(origin, `<p><strong>The Sky Answers</strong> — not the ending, only the moment: back to the start of ${origin.name}'s last turn (round ${shot.round}). Unmake the Moment is not spent, and Rewrite the Ending is not expended.</p>`);
}

/* ------------------------------------------------------------------------------------------------ */
/*  The dark chart                                                                                  */
/* ------------------------------------------------------------------------------------------------ */

/** Rewrite's drained 2 and doomed 1 "cannot be reduced before then by any means". */
function lockCondition(item, change, options) {
    if (options?.stargazerRelight || options?.stargazerRewind) return true;
    const actor = item?.actor;
    if (!chartDark(actor) || !["drained", "doomed"].includes(item.slug)) return true;
    if (change === null) return false; // a deletion
    const value = change?.system?.value?.value;
    if (typeof value === "number" && value < (item.system?.value?.value ?? 0)) return false;
    return true;
}

/** The GM's word that a Vigil was the full eight hours under open sky: the chart relights. */
export async function relight({ origin: originUuid }) {
    const actor = await fromUuid(originUuid);
    if (!isStargazer(actor) || !chartDark(actor)) return;
    const dark = actor.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.chartDark);
    if (dark.length > 0) await actor.deleteEmbeddedDocuments("Item", dark.map((e) => e.id), { stargazerRelight: true });
    await actor.update({ [`flags.${MODULE_ID}.${FLAG}.dark`]: null }, { stargazerRelight: true });
    await say(actor, `<p><strong>Night Vigil</strong> — eight hours under an open sky. ${actor.name}'s Star Chart is lit again.</p>`);
}

/* ------------------------------------------------------------------------------------------------ */

async function pickAlly(actor, title) {
    const combat = combatOf(actor);
    const allies = (combat?.combatants.map((c) => c.actor) ?? []).filter((a) => a && a.id !== actor.id && a.isAllyOf?.(actor));
    if (allies.length === 0) return null;
    const data = await foundry.applications.api.DialogV2.prompt({
        window: { title },
        content: `<div class="form-group"><label>Ally</label><select name="ally">${allies.map((a) => `<option value="${a.uuid}">${a.name}</option>`).join("")}</select></div>`,
        rejectClose: false,
        ok: { label: "Choose", callback: (_e, button) => new foundry.applications.ux.FormDataExtended(button.form).object },
    });
    return data?.ally || null;
}

function bindCard(message, html) {
    const flag = message.flags?.[MODULE_ID]?.rewindCard;
    if (!flag) return;
    for (const button of html.querySelectorAll?.("button[data-stargazer-rewind]") ?? []) {
        const kind = button.dataset.stargazerRewind;
        if (flag.used && ["unmake", "rewrite", "sky-answers"].includes(kind)) button.disabled = true;
        button.addEventListener("click", async () => {
            const origin = await fromUuid(flag.origin);
            if (kind === "unmake") {
                button.disabled = true;
                const whose = html.querySelector?.('select[name="whose"]')?.value ?? null;
                return Relay.request({ action: "stargazerUnmake", card: message.id, whose });
            }
            if (kind === "rewrite" || kind === "sky-answers") {
                if (!game.user.isGM) return;
                for (const b of html.querySelectorAll("button[data-stargazer-rewind]")) b.disabled = true;
                return kind === "rewrite" ? rewrite(message, flag) : skyAnswers(message, flag);
            }
            if (!origin?.isOwner) return;
            const ally = await pickAlly(origin, kind === "shout" ? "Shout a warning" : "Echo of the Unmade");
            if (!ally) return;
            button.disabled = true;
            await Relay.request({ action: kind === "shout" ? "stargazerShout" : "stargazerEcho", origin: origin.uuid, ally });
        });
    }
}

async function onOwnUse(message) {
    const item = message.item;
    const actor = item?.actor;
    if (!isStargazer(actor) || message.flags?.pf2e?.context) return;
    if (item.slug === "rewrite-the-ending") await invokeRewrite(actor);
    if (item.slug === "unmake-the-moment") {
        const combat = combatOf(actor);
        const combatant = combat?.combatants.find((c) => c.actorId === actor.id);
        if (!combat || !combatant) return ui.notifications.warn("Unmake the Moment: only in an encounter.");
        if (isDead(actor) && has(actor, "the-long-way-round")) {
            await Relay.request({ action: "stargazerOfferUnmake", combatId: combat.id, combatantId: combatant.id });
        } else if (combat.combatant?.id !== combatant.id) {
            ui.notifications.warn("Unmake the Moment: only as your turn begins.");
        } else {
            await Relay.request({ action: "stargazerOfferUnmake", combatId: combat.id, combatantId: combatant.id });
        }
    }
}

export const Rewind = {
    turnShots,
    initiativeShots,
    registerSettings() {
        game.settings.register(MODULE_ID, ADVENTURE, {
            name: "Stargazer: current adventure",
            hint: "The Long Vigil shortens Rewrite the Ending's cooldown to 3 days when it has not been used during the current adventure. Change this name when a new adventure begins.",
            scope: "world", config: true, type: String, default: "",
        });
    },
    registerHooks() {
        Relay.register?.("stargazerUnmake", unmake);
        Relay.register?.("stargazerShout", shout);
        Relay.register?.("stargazerEcho", echo);
        Relay.register?.("stargazerRewriteAsk", askRewrite);
        Relay.register?.("stargazerRelight", relight);
        Relay.register?.("stargazerOfferUnmake", async ({ combatId, combatantId }) => {
            const combat = game.combats.get(combatId);
            const combatant = combat?.combatants.get(combatantId);
            if (!combatant) return;
            const actor = combatant.actor;
            if (isDead(actor) && has(actor, "the-long-way-round")) {
                // While dead, the rewind goes back to the start of your own last turn, whatever turn it is now.
                const shot = (turnShots.get(combat.id)?.get(combatantId) ?? []).at(-1);
                if (!shot) return;
                return say(actor, `<p><strong>The Long Way Round</strong> — you died this round. Come back to the start of your last turn (round ${shot.round})?</p><button type="button" data-stargazer-rewind="unmake">Unmake it</button>`, {
                    whisper: ownersOf(actor),
                    flags: { [MODULE_ID]: { rewindCard: { kind: "unmake", origin: actor.uuid, combatId, combatantId, round: combat.round + 1, turn: 0, used: false } } },
                });
            }
            return offerUnmake(combat, combatant);
        });
        Hooks.on("combatStart", (combat) => {
            if (isWriter() && combat.combatants.some((c) => isStargazer(c.actor) && has(c.actor, "rewrite-the-ending"))) {
                initiativeShots.set(combat.id, capture(combat));
            }
        });
        Hooks.on("pf2e.startTurn", (combatant) => {
            if (!isWriter()) return;
            const combat = combatant?.parent;
            if (!combat || !wantsShot(combat, combatant)) return;
            keepTurnShot(combat, combatant.id);
            offerUnmake(combat, combatant).catch((e) => console.error("Isaac's Homebrew | Unmake the Moment", e));
        });
        Hooks.on("preUpdateItem", (item, change, options) => lockCondition(item, change, options));
        Hooks.on("preDeleteItem", (item, options) => lockCondition(item, null, options));
        Hooks.on("createChatMessage", (message, _options, userId) => {
            if (userId === game.user.id) onOwnUse(message).catch((e) => console.error("Isaac's Homebrew | the rewinds", e));
        });
        Hooks.on("renderChatMessageHTML", (message, html) => bindCard(message, html));
    },
};

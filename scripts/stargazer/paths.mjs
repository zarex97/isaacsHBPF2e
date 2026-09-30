import { CheckPipeline, PRIORITY } from "../lib/check-pipeline.mjs";
import { degreeOf } from "../lib/degree.mjs";
import { wrap } from "../lib/wrap.mjs";
import { inflictPersistent } from "../riders/apply.mjs";
import { Relay } from "../riders/relay.mjs";
import { relabel, setDieResult } from "../roll-rewrites/balance.mjs";
import { MODULE_ID, aspectOf, signOf } from "../sky/signs.mjs";
import { SkyTracker } from "../sky/tracker.mjs";
import { Numbers, THREAD, isStargazer, reactionsLeft, refusal, spendReaction } from "./threads.mjs";

/**
 * The four Stargazer's Paths (guide §6) — what their rule elements and riders cannot say.
 *
 * - **The Weaver** lives mostly in `threads.mjs` (Doubled Strand, Skein of Fates, Tapestry, and the Knotted
 *   Thread given when a Guide lands). Here: the next attack at a knotted creature takes the knot back.
 * - **The Herald**: which roll a Snarl touched is known only before the die falls, so a check-pipeline stage
 *   tags it with a roll option naming the Stargazer; *Herald's Omen* and *Foregone Conclusion* read the tag
 *   off the finished message. *Sentence Passed* is a rider save; what the target then suffers — every natural
 *   20 a natural 10, and no fortune — is a message rewrite (The Balance's shape) and a pipeline stage.
 * - **The Ephemeris**: *Written Down* on a critical Recall Knowledge, and the Thread it lets you use after a
 *   Recall Knowledge is rolled (a button; ADR-0004); *The Almanac*'s read of a past day.
 * - **The Broken Thread**: *Deja Vu* and *Second Sight* are buttons after a failed check, rerolled by the GM
 *   through pf2e's own `rerollFromMessage`. *Unmade Again* and *The Long Way Round* modify *Unmake the Moment*,
 *   which is phase 7's.
 */

const FLAG = "stargazer";
const SNARLED = "stargazer:snarled-by:";
const ANNOUNCEMENT = "stargazer:the-announcement";
const HEARING = 60;
const OFF_GUARD = "Compendium.pf2e.conditionitems.Item.AJh5ex99aV6VTggg";
const CHECK_KINDS = ["attack-roll", "saving-throw", "skill-check", "perception-check", "check"];

const isWriter = () => (game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM);
const has = (actor, slug) => (actor?.itemTypes?.feat ?? []).some((f) => f.slug === slug);
const state = (actor) => actor?.flags?.[MODULE_ID]?.[FLAG] ?? {};
const tokenOf = (actor) => actor?.getActiveTokens?.(true, true)?.[0] ?? null;
const sentenced = (actor) => (actor?.itemTypes?.effect ?? []).some((e) => e.flags?.[MODULE_ID]?.sentencePassed);
const stargazers = () => game.actors.filter((a) => isStargazer(a));

function feet(a, b) {
    const ta = tokenOf(a);
    const tb = tokenOf(b);
    if (!ta || !tb || ta.document?.parent?.id !== tb.document?.parent?.id) return Infinity;
    return canvas?.grid?.measurePath?.([ta.center, tb.center])?.distance ?? Infinity;
}

function ownersOf(actor) {
    return game.users.filter((u) => actor.testUserPermission(u, "OWNER")).map((u) => u.id);
}

async function say(actor, html, extra = {}) {
    return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<p>${html}</p>`, ...extra });
}

/** The round a creature is fighting in, or a six-second slice of the clock outside combat. */
function roundOf(actor) {
    const combat = game.combats?.find((c) => c.started && c.combatants.some((x) => x.actorId === actor?.id));
    return combat ? `${combat.id}:${combat.round}` : `t${Math.floor(game.time.worldTime / 6)}`;
}

const tenMinutes = (at) => typeof at !== "number" || (game.time.worldTime - at) >= 600;

/** Stargazers whose Snarl touched this roll, by the tag the pipeline stage left on it. */
export function snarledBy(options = []) {
    return [...new Set([...options].filter((o) => o.startsWith(SNARLED)).map((o) => o.slice(SNARLED.length)))];
}

/* ------------------------------------------------------------------------------------------------ */
/*  Before the die falls                                                                            */
/* ------------------------------------------------------------------------------------------------ */

function addOption(context, option) {
    if (context.options instanceof Set) context.options.add(option);
    else if (Array.isArray(context.options)) context.options.push(option);
    else context.options = new Set([option]);
}

/**
 * Tag a roll with every Stargazer whose Snarl is about to touch it. A flat Snarl is known by its modifier
 * being enabled on this check; a Twin Fates Snarl by pf2e having set the roll to keep the lower.
 */
function tagSnarl(check, context) {
    const actor = context?.actor;
    if (!actor) return;
    const domains = new Set(context.domains ?? []);
    for (const effect of actor.itemTypes?.effect ?? []) {
        const flag = effect.flags?.[MODULE_ID]?.[THREAD];
        if (flag?.kind !== "snarl") continue;
        const rule = effect.system?.rules?.[0] ?? {};
        const touched = rule.key === "RollTwice"
            ? context.rollTwice === "keep-lower" && [rule.selector].flat().some((s) => domains.has(s))
            : (check?.modifiers ?? []).some((m) => m.slug === rule.slug && m.enabled);
        if (touched) addOption(context, `${SNARLED}${fromUuidSync(flag.origin)?.id ?? flag.origin}`);
    }
}

/** Sentence Passed: "cannot benefit from fortune effects" — a kept-higher roll and a fortune substitution go. */
function blockFortune(_check, context) {
    if (!sentenced(context?.actor)) return;
    if (context.rollTwice === "keep-higher") context.rollTwice = false;
    const subs = context.substitutions;
    if (Array.isArray(subs)) {
        for (let i = subs.length - 1; i >= 0; i--) if (subs[i]?.effectType === "fortune") subs.splice(i, 1);
    }
}

/** Sentence Passed: every natural 20 is a natural 10. The die is changed as it lands, as The Balance does. */
function sentenceRewrite(message) {
    try {
        const roll = message.rolls?.at(0);
        const die = roll?.dice?.find((d) => d.faces === 20);
        if (die?.total !== 20 || !sentenced(message.actor)) return true;
        const context = message.flags?.pf2e?.context;
        if (!context || !CHECK_KINDS.includes(context.type)) return true;
        const modifier = Number(roll.total) - 20;
        const rollData = roll.toJSON();
        setDieResult(rollData, 10);
        rollData.total = 10 + modifier;
        // pf2e writes the total into the content as well; left alone, the card read 20 over a total of 10 (driven).
        const update = { rolls: [JSON.stringify(rollData)], content: String(rollData.total) };
        const dc = context.dc?.value;
        if (Number.isInteger(dc)) {
            const degree = degreeOf({ dieValue: 10, modifier, dc, adjustments: context.dosAdjustments ?? null });
            rollData.options = { ...(rollData.options ?? {}), degreeOfSuccess: degree.value };
            update.rolls = [JSON.stringify(rollData)];
            update.flavor = relabel(message.flavor ?? "", degree, "Sentence Passed: natural 20 counted as a 10");
            update["flags.pf2e.context.outcome"] = degree.key;
            update["flags.pf2e.context.unadjustedOutcome"] = degree.unadjustedKey;
        }
        message.updateSource(update);
    } catch (error) {
        console.error("Isaac's Homebrew | Sentence Passed could not rewrite a roll", error);
    }
    return true;
}

/* ------------------------------------------------------------------------------------------------ */
/*  After the roll, on the GM's client                                                              */
/* ------------------------------------------------------------------------------------------------ */

async function afterCheck(message) {
    const context = message.flags?.pf2e?.context;
    const actor = message.actor;
    if (!context || !actor || !CHECK_KINDS.includes(context.type)) return;

    // Knotted Thread: the next attack made against the knotted creature takes the knot back.
    if (context.type === "attack-roll" && context.target?.actor) {
        const target = await fromUuid(context.target.actor);
        const knots = (target?.itemTypes?.effect ?? []).filter((e) => e.flags?.[MODULE_ID]?.knottedThread);
        if (knots.length > 0) await target.deleteEmbeddedDocuments("Item", knots.map((e) => e.id), { stargazerQuiet: true });
    }

    for (const id of snarledBy(context.options)) {
        const origin = game.actors.get(id);
        if (!isStargazer(origin)) continue;
        await heraldsOmen(origin, actor, context);
        await foregoneConclusion(origin, actor, context);
    }

    await offerDejaVu(message, actor, context);
    await offerWrittenThread(message, actor, context);
}

/** Herald's Omen (§6.2): a critical failure on a Snarled roll is persistent mental damage, once per round. */
async function heraldsOmen(origin, roller, context) {
    if (context.outcome !== "criticalFailure" || !has(origin, "heralds-omen")) return;
    const wis = origin.system?.abilities?.wis?.mod ?? 0;
    if (wis <= 0) return;
    const round = roundOf(roller);
    if (state(origin).omenRound === round) return;
    await origin.update({ [`flags.${MODULE_ID}.${FLAG}.omenRound`]: round });
    await inflictPersistent(roller, { formula: String(wis), damageType: "mental", flags: { [MODULE_ID]: { heraldsOmen: origin.uuid } } });
    await say(origin, `<strong>Herald's Omen</strong>: ${roller.name} critically failed under your Snarl — ${wis} persistent mental damage.`);
}

/** Foregone Conclusion (§6.2): a Snarled attack that misses leaves the attacker off-guard to the end of its turn. */
async function foregoneConclusion(origin, attacker, context) {
    if (context.type !== "attack-roll" || !["failure", "criticalFailure"].includes(context.outcome)) return;
    if (!has(origin, "foregone-conclusion")) return;
    const round = roundOf(attacker);
    if (state(origin).foregoneRound === round) return;
    await origin.update({ [`flags.${MODULE_ID}.${FLAG}.foregoneRound`]: round });
    await attacker.createEmbeddedDocuments("Item", [{
        name: "Foregone Conclusion", type: "effect", img: "icons/magic/unholy/orb-glowing-purple.webp",
        system: {
            description: { value: `<p>${origin.name} Snarled this creature's attack and it missed: off-guard until the end of its turn.</p>` },
            duration: { value: 0, unit: "rounds", expiry: "turn-end", sustained: false },
            level: { value: origin.level ?? 1 },
            rules: [{ key: "GrantItem", uuid: OFF_GUARD }],
            tokenIcon: { show: true },
        },
        flags: { [MODULE_ID]: { foregoneConclusion: origin.uuid } },
    }]);
}

/* ------------------------------------------------------------------------------------------------ */
/*  Deja Vu and Second Sight                                                                        */
/* ------------------------------------------------------------------------------------------------ */

/** Why this Stargazer cannot Deja Vu this roll, or null. Shared by the offer and the GM's re-check. */
export function dejaVuRefusal(origin, roller, context, { at, alreadyFortune, sentence, distanceFeet }) {
    if (!has(origin, "deja-vu")) return "no Deja Vu";
    if (context?.outcome !== "failure") return "only a failure, not a critical failure, can be rerolled";
    if (!tenMinutes(at)) return "Deja Vu is spent for 10 minutes";
    if (alreadyFortune) return "a fortune effect already touched that roll";
    if (sentence) return `${roller.name} cannot benefit from fortune effects`;
    if (roller.id !== origin.id) {
        if (!has(origin, "second-sight")) return "not your own check";
        if (!roller.isAllyOf?.(origin)) return `${roller.name} is not your ally`;
        if (distanceFeet > 30) return `${roller.name} is beyond 30 feet`;
    }
    return null;
}

const fortuneTouched = (context) => Boolean(context?.isReroll || context?.rollTwice === "keep-higher"
    || (context?.substitutions ?? []).some((s) => s.selected !== false && s.effectType === "fortune"));

function dejaVuWhy(origin, roller, context) {
    return dejaVuRefusal(origin, roller, context, {
        at: state(origin).dejaVuAt,
        alreadyFortune: fortuneTouched(context),
        sentence: sentenced(roller),
        distanceFeet: roller.id === origin.id ? 0 : feet(origin, roller),
    });
}

async function offerDejaVu(message, roller, context) {
    if (context.outcome !== "failure") return;
    for (const origin of stargazers()) {
        if (dejaVuWhy(origin, roller, context)) continue;
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: origin }),
            whisper: ownersOf(origin),
            content: `<p><strong>Deja Vu</strong> — ${roller.id === origin.id ? "you" : roller.name} failed. You have seen this go wrong before.</p>
                <button type="button" data-stargazer="deja-vu">Reroll it (free action, fortune)</button>`,
            flags: { [MODULE_ID]: { dejaVu: { origin: origin.uuid, messageId: message.id, used: false } } },
        });
    }
}

async function dejaVu({ card: cardId }) {
    const card = game.messages.get(cardId);
    const flag = card?.flags?.[MODULE_ID]?.dejaVu;
    if (!flag || flag.used) return;
    const origin = await fromUuid(flag.origin);
    const failed = game.messages.get(flag.messageId);
    const roller = failed?.actor;
    const context = failed?.flags?.pf2e?.context;
    if (!isStargazer(origin) || !roller || !context) return;
    const why = dejaVuWhy(origin, roller, context);
    await card.update({ [`flags.${MODULE_ID}.dejaVu.used`]: true });
    if (why) return say(origin, `<strong>Deja Vu</strong>: ${why}.`, { whisper: ownersOf(origin) });
    await origin.update({ [`flags.${MODULE_ID}.${FLAG}.dejaVuAt`]: game.time.worldTime });
    await game.pf2e.Check.rerollFromMessage(failed, { keep: "new" });
}

/* ------------------------------------------------------------------------------------------------ */
/*  Written Down                                                                                    */
/* ------------------------------------------------------------------------------------------------ */

const isRecall = (context) => [...(context?.options ?? [])].includes("action:recall-knowledge");

/** The creature types a creature carries, in its trait order. */
export function creatureTypesOf(traits = [], known = {}) {
    return traits.filter((t) => t in known);
}

/**
 * Written Down (§6.3), on the roller's own client — pf2e records no target on a skill check, so the creature
 * recalled is the one the roller has targeted (Perfect Ledger's driven lesson).
 */
async function ownRecall(message) {
    const context = message.flags?.pf2e?.context;
    const actor = message.actor;
    if (!isStargazer(actor) || !has(actor, "written-down") || context?.outcome !== "criticalSuccess" || !isRecall(context)) return;
    const target = [...(game.user.targets ?? [])].map((t) => t.actor).find((a) => a && a.id !== actor.id);
    const [type] = creatureTypesOf(target?.system?.traits?.value ?? [], CONFIG.PF2E?.creatureTypes ?? {});
    if (!type) return;
    await Relay.request({ action: "stargazerWrittenDown", origin: actor.uuid, type });
}

async function writtenDown({ origin: originUuid, type }) {
    const origin = await fromUuid(originUuid);
    if (!isStargazer(origin) || !has(origin, "written-down") || !(type in (CONFIG.PF2E?.creatureTypes ?? {}))) return;
    const label = game.i18n.localize(CONFIG.PF2E.creatureTypes[type]);
    const scene = tokenOf(origin)?.parent;
    const listeners = new Map([[origin.id, origin]]);
    for (const token of scene?.tokens ?? []) {
        // "Who can hear you": pf2e gives hearing no range, so this reads it as the Paths' own 60 feet — without
        // one, a test scene briefed thirty-odd allies across the map (driven).
        if (token.actor && token.actor.isAllyOf?.(origin) && feet(origin, token.actor) <= HEARING) listeners.set(token.actor.id, token.actor);
    }
    const effect = {
        name: `Written Down: ${label}`, type: "effect", img: "icons/sundries/books/book-embossed-blue.webp",
        system: {
            description: { value: `<p>${origin.name} has written ${label} down: +1 circumstance bonus to all d20 rolls against ${label} creatures.</p>` },
            duration: { value: 1, unit: "minutes", expiry: "turn-start", sustained: false },
            level: { value: origin.level ?? 1 },
            rules: [{
                key: "FlatModifier", slug: `written-down-${type}`, label: `Written Down (${label})`, type: "circumstance", value: 1,
                selector: ["attack-roll", "saving-throw", "skill-check", "perception"],
                predicate: [{ or: [`target:trait:${type}`, `origin:trait:${type}`] }],
            }],
            tokenIcon: { show: true },
        },
        flags: { [MODULE_ID]: { writtenDown: { origin: origin.uuid, type } } },
    };
    for (const creature of listeners.values()) {
        const old = creature.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.writtenDown?.type === type);
        if (old.length > 0) await creature.deleteEmbeddedDocuments("Item", old.map((e) => e.id));
        await creature.createEmbeddedDocuments("Item", [effect]);
    }
    await say(origin, `<strong>Written Down</strong>: ${label} — ${[...listeners.values()].map((c) => c.name).join(", ")} take +1 against them for a minute.`);
}

/** Written Down's second half: a Fortune's Thread on a Recall Knowledge after the roll, offered as buttons. */
async function offerWrittenThread(message, roller, context) {
    if (!isRecall(context) || context.type !== "skill-check") return;
    for (const origin of stargazers()) {
        if (!has(origin, "written-down") || reactionsLeft(origin) <= 0) continue;
        if (roller.id !== origin.id && refusal(origin, roller, { range: Numbers.threadRange(origin) })) continue;
        const value = Numbers.threadValue(origin);
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: origin }),
            whisper: ownersOf(origin),
            content: `<p><strong>Written Down</strong> — ${roller.name}'s Recall Knowledge is rolled. Pull the Thread before the GM answers?</p>
                <button type="button" data-stargazer="written-thread" data-kind="guide">Guide +${value}</button>
                <button type="button" data-stargazer="written-thread" data-kind="snarl">Snarl −${value}</button>`,
            flags: { [MODULE_ID]: { writtenThread: { origin: origin.uuid, messageId: message.id, used: false } } },
        });
    }
}

/** The roll's total moved by `delta`, and its degree recomputed against the same DC. Pure. */
export function shiftedCheck({ total, dieValue, dc, adjustments = null }, delta) {
    const moved = Number(total) + delta;
    if (!Number.isInteger(dc)) return { total: moved, degree: null };
    return { total: moved, degree: degreeOf({ dieValue, total: moved, dc, adjustments }) };
}

async function writtenThread({ card: cardId, kind }) {
    const card = game.messages.get(cardId);
    const flag = card?.flags?.[MODULE_ID]?.writtenThread;
    if (!flag || flag.used || !["guide", "snarl"].includes(kind)) return;
    const origin = await fromUuid(flag.origin);
    const rolled = game.messages.get(flag.messageId);
    const roll = rolled?.rolls?.at(0);
    const context = rolled?.flags?.pf2e?.context;
    if (!isStargazer(origin) || !roll || !context) return;
    if (reactionsLeft(origin) <= 0) return say(origin, "<strong>Written Down</strong>: no reaction left this round.", { whisper: ownersOf(origin) });
    await card.update({ [`flags.${MODULE_ID}.writtenThread.used`]: true });
    await spendReaction(origin);

    const value = Numbers.threadValue(origin);
    const delta = kind === "guide" ? value : -value;
    const dieValue = roll.dice?.find((d) => d.faces === 20)?.total ?? null;
    const shifted = shiftedCheck({ total: roll.total, dieValue, dc: context.dc?.value, adjustments: context.dosAdjustments ?? null }, delta);
    const rollData = roll.toJSON();
    rollData.total = shifted.total;
    const what = `Written Down: ${kind === "guide" ? "Guide" : "Snarl"} ${delta > 0 ? "+" : "−"}${value} (${shifted.total})`;
    const update = { rolls: [JSON.stringify(rollData)], content: String(shifted.total) };
    if (shifted.degree) {
        rollData.options = { ...(rollData.options ?? {}), degreeOfSuccess: shifted.degree.value };
        update.rolls = [JSON.stringify(rollData)];
        update.flavor = relabel(rolled.flavor ?? "", shifted.degree, what);
        update["flags.pf2e.context.outcome"] = shifted.degree.key;
        update["flags.pf2e.context.unadjustedOutcome"] = shifted.degree.unadjustedKey;
    } else {
        update.flavor = `${rolled.flavor ?? ""}<div class="isaacs-hb-balance">${what}.</div>`;
    }
    await rolled.update(update);
}

/* ------------------------------------------------------------------------------------------------ */
/*  The Almanac and The Announcement, on the Stargazer's client                                     */
/* ------------------------------------------------------------------------------------------------ */

/** The Almanac (§6.3): the sky of a past day, if the tracker kept it. */
export async function readPastDay(actor) {
    if (!has(actor, "the-almanac")) return;
    const today = SkyTracker.state.day;
    const data = await foundry.applications.api.DialogV2.prompt({
        window: { title: "The Almanac" },
        content: `<p>Today is day ${today}. Which past day do you read?</p><div class="form-group"><label>Day</label><input type="number" name="day" min="1" max="${today - 1}" value="${Math.max(1, today - 1)}" /></div>`,
        rejectClose: false,
        ok: { label: "Read it", callback: (_e, button) => new foundry.applications.ux.FormDataExtended(button.form).object },
    });
    const day = Number(data?.day);
    if (!Number.isInteger(day)) return;
    const entry = day < today ? SkyTracker.recall(day) : null;
    const html = entry
        ? `<p><strong>The Almanac</strong> — Day ${day}: ${signOf(entry.sign).glyph} <strong>${signOf(entry.sign).label}</strong>, ${aspectOf(entry.aspect).label}.</p>`
        : `<p><strong>The Almanac</strong> — Day ${day}: ${day >= today ? "that day has not passed." : "the tracker does not hold it; the GM tells you what it was."}</p>`;
    await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), whisper: [...new Set([...ownersOf(actor), ...game.users.filter((u) => u.isGM).map((u) => u.id)])], content: html });
}

/** The Announcement (§6.2): Demoralize with Astronomy Lore. */
async function announce(actor) {
    const lore = Object.values(actor.skills ?? {}).find((s) => s.slug === "astronomy-lore" || s.label === "Astronomy Lore");
    if (!lore) return ui.notifications.warn("The Announcement: you have no Astronomy Lore.");
    const action = game.pf2e.actions.get("demoralize");
    await action.use({ actors: [actor], statistic: lore.slug, rollOptions: [ANNOUNCEMENT] });
}

/**
 * The Announcement has "no auditory or visual requirement — you are not shouting, you are reading out a date".
 * pf2e's Demoralize carries the auditory trait and a −4 when the target does not understand you; a Demoralize
 * made through The Announcement drops both (driven: the first one rolled "Unintelligible −4").
 */
function announcementStage(check, context) {
    if (![...(context?.options ?? [])].includes(ANNOUNCEMENT)) return;
    // pf2e re-tests every modifier's predicate against these options as it rolls, so switching the modifier
    // off is undone (driven); taking away the option it is predicated on is what sticks.
    const unintelligible = "action:demoralize:unintelligible";
    if (context.options instanceof Set) context.options.delete(unintelligible);
    else if (Array.isArray(context.options)) context.options = context.options.filter((o) => o !== unintelligible);
    for (const modifier of check?.modifiers ?? []) {
        if (modifier.slug === "unintelligible") modifier.ignored = true;
    }
    check?.calculateTotal?.(context.options instanceof Set ? context.options : new Set(context.options));
    if (Array.isArray(context.traits)) {
        const i = context.traits.findIndex((trait) => (trait?.name ?? trait) === "auditory");
        if (i >= 0) context.traits.splice(i, 1);
    }
}

async function onOwnUse(message) {
    const item = message.item;
    const actor = item?.actor;
    if (!isStargazer(actor) || message.flags?.pf2e?.context) return;
    if (item.slug === "the-almanac") await readPastDay(actor);
    if (item.slug === "the-announcement") await announce(actor);
}

function bindCard(message, html) {
    const dv = message.flags?.[MODULE_ID]?.dejaVu;
    const wt = message.flags?.[MODULE_ID]?.writtenThread;
    if (!dv && !wt) return;
    for (const button of html.querySelectorAll?.("button[data-stargazer]") ?? []) {
        if ((dv ?? wt).used) button.disabled = true;
        button.addEventListener("click", () => {
            for (const b of html.querySelectorAll("button[data-stargazer]")) b.disabled = true;
            if (dv) Relay.request({ action: "stargazerDejaVu", card: message.id });
            else Relay.request({ action: "stargazerWrittenThread", card: message.id, kind: button.dataset.kind });
        });
    }
}

export const Paths = {
    registerHooks() {
        Relay.register?.("stargazerDejaVu", dejaVu);
        Relay.register?.("stargazerWrittenDown", writtenDown);
        Relay.register?.("stargazerWrittenThread", writtenThread);
        CheckPipeline.before("The Announcement needs no hearing (Stargazer guide §6.2)", PRIORITY.announcement, announcementStage);
        CheckPipeline.before("the Herald's Snarl tag (Stargazer guide §6.2)", PRIORITY.snarlTag, tagSnarl);
        CheckPipeline.before("Sentence Passed blocks fortune (Stargazer guide §6.2)", PRIORITY.sentencePassed, blockFortune);
        Hooks.on("preCreateChatMessage", (message) => sentenceRewrite(message));
        Hooks.on("createChatMessage", (message, _options, userId) => {
            if (isWriter()) afterCheck(message).catch((e) => console.error("Isaac's Homebrew | the Paths", e));
            if (userId === game.user.id) {
                ownRecall(message).catch((e) => console.error("Isaac's Homebrew | Written Down", e));
                onOwnUse(message).catch((e) => console.error("Isaac's Homebrew | the Paths", e));
            }
        });
        Hooks.on("renderChatMessageHTML", (message, html) => bindCard(message, html));
    },

    /** At setup, when `game.pf2e` is there to wrap. */
    install() {
        // Sentence Passed: no fortune. pf2e's hero-point reroll is one, and Deja Vu is another.
        wrap("game.pf2e.Check.rerollFromMessage", function (wrapped, message, ...rest) {
            if (sentenced(message?.actor)) {
                ui.notifications.warn(`${message.actor.name} cannot benefit from fortune effects (Sentence Passed).`);
                return undefined;
            }
            return wrapped(message, ...rest);
        }, { feature: "Sentence Passed" });
    },
};

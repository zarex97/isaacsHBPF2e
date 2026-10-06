import { CheckPipeline } from "../lib/check-pipeline.mjs";
import { CHECK as PRIORITY } from "../stage-priorities.mjs";
import { DamageBus } from "../lib/damage-bus.mjs";
import { DAMAGE } from "../stage-priorities.mjs";
import { Relay } from "../riders/relay.mjs";
import { MODULE_ID } from "../sky/signs.mjs";
import { isStargazer, reactionsLeft, spendReaction } from "./threads.mjs";

/**
 * What the Auguries need beyond their riders and rule elements (Stargazer guide §5).
 *
 * - **Reprieves** (Iron Auspice, Deep Dream): one critical failure on a save becomes a failure, once. The
 *   adjustment rides on a separate effect flagged `stargazerReprieve`, removed the moment it is used.
 * - **First Blood**: the spirit dice ride on an effect removed by the first Strike damage roll that hits.
 * - **Coiling Doubt**: on a failure, "the first attack roll or skill check each round" — the one-roll
 *   effect is handed back at the start of each of the target's turns while the lingering effect lasts.
 * - **Perfect Ledger**: a critical success on the Recall Knowledge it boosted whispers the creature's lowest
 *   save and its weaknesses to the one who rolled.
 * - **Fixed Point**: the caster names the roll types after casting; the GM arms a 10 on each target.
 * - **The Hour Is Not Come**: a reaction, offered as a whispered button when an ally within 30 feet drops to
 *   0 Hit Points (ADR-0004's shape for reactions after the event).
 * - **Hunted by the Sky**: a check-pipeline stage for the first attack each round and Seek against it; the
 *   Snarl half lives in `threads.mjs`.
 *
 * The Augury of the Day (§4.2, §5.3) is granted by the Night Vigil — `vigil.mjs` — from the table below.
 */

const isWriter = () => (game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM);
const flagOf = (item, key) => item?.flags?.[MODULE_ID]?.[key];
const tokenOf = (actor) => actor?.getActiveTokens?.(true, true)?.[0] ?? null;

/** Guide §5.3. Guiding Star, Borrowed Second, Death Foretold and The Hour Is Not Come belong to no sign. */
export const SIGN_AUGURY = {
    aries: "First Blood",
    taurus: "Iron Auspice",
    gemini: "Two Roads",
    cancer: "Shell of Hours",
    leo: "Crown of Fire",
    virgo: "Perfect Ledger",
    libra: "Fixed Point",
    scorpio: "Coiling Doubt",
    sagittarius: "Hunted by the Sky",
    capricorn: "Alms of Fate",
    aquarius: "Poured Knowing",
    pisces: "Deep Dream",
};

/** A reprieve spent by this save, or null. Pure, so the rule can be asked directly. */
export function spentReprieve(effects, { type, domains = [], unadjustedOutcome }) {
    if (type !== "saving-throw" || unadjustedOutcome !== "criticalFailure") return null;
    return effects.find((e) => domains.includes(e.flags?.[MODULE_ID]?.stargazerReprieve)) ?? null;
}

/** The Hour Is Not Come's extra healing (guide §5.2): 2d8 from rank 5, +2d8 each two ranks after. */
export function hourDice(rank) {
    return rank >= 5 ? 2 * (1 + Math.floor((rank - 5) / 2)) : 0;
}

function feet(a, b) {
    const ta = tokenOf(a);
    const tb = tokenOf(b);
    if (!ta || !tb || ta.document?.parent?.id !== tb.document?.parent?.id) return Infinity;
    return canvas?.grid?.measurePath?.([ta.center, tb.center])?.distance ?? Infinity;
}

function ownersOf(actor) {
    return game.users.filter((u) => actor.testUserPermission(u, "OWNER")).map((u) => u.id);
}

async function effectFromPack(name) {
    const pack = game.packs.get(`${MODULE_ID}.stargazer-effects`);
    const entry = (await pack?.getIndex())?.find((e) => e.name === name);
    return entry ? foundry.utils.deepClone((await pack.getDocument(entry._id)).toObject()) : null;
}

/* ------------------------------------------------------------------------------------------------ */
/*  After a roll                                                                                    */
/* ------------------------------------------------------------------------------------------------ */

async function afterRoll(message) {
    const context = message.flags?.pf2e?.context;
    const actor = message.actor;
    if (!context || !actor) return;
    const effects = actor.itemTypes?.effect ?? [];

    const reprieve = spentReprieve(effects, context);
    if (reprieve) await reprieve.delete();

    // Crown of Fire: once per round, a critical success hands an ally within 30 feet +1 to their next roll.
    if (context.outcome === "criticalSuccess") await crownOfFire(actor, effects);

    // First Blood: "its first Strike of the encounter that hits". A damage roll is only made on a hit.
    if (context.type === "damage-roll" && (context.domains ?? []).includes("strike-damage")) {
        const blood = effects.find((e) => flagOf(e, "firstBloodStrike"));
        if (blood) await blood.delete();
    }

}

/**
 * Perfect Ledger: a critical success on the Recall Knowledge it boosted. On the roller's own client, because
 * pf2e records no target on a skill check — the creature being recalled is the one its roller has targeted.
 * Driven: the context's target was null on a critical success, and the reveal said nothing.
 */
async function ownRoll(message) {
    const context = message.flags?.pf2e?.context;
    const actor = message.actor;
    if (!context || !actor || context.outcome !== "criticalSuccess") return;
    const boosted = (message.flags?.pf2e?.modifiers ?? []).some((m) => m.enabled && m.label === "Perfect Ledger");
    if (!boosted) return;
    const target = (context.target?.actor ? await fromUuid(context.target.actor) : null)
        ?? [...(game.user.targets ?? [])].map((t) => t.actor).find((a) => a && a.id !== actor.id);
    if (target) await revealLedger(actor, target);
}

async function revealLedger(actor, target) {
    const saves = ["fortitude", "reflex", "will"].map((s) => [s, target.saves?.[s]?.mod ?? 0]);
    const lowest = saves.sort((a, b) => a[1] - b[1])[0];
    const weaknesses = (target.attributes?.weaknesses ?? []).map((w) => w.label ?? `${w.type} ${w.value}`);
    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        whisper: [...new Set([...ownersOf(actor), ...game.users.filter((u) => u.isGM).map((u) => u.id)])],
        content: `<p><strong>Perfect Ledger</strong> — ${target.name}: lowest save <strong>${lowest[0]}</strong> (${lowest[1] >= 0 ? "+" : ""}${lowest[1]}); weaknesses: ${weaknesses.length ? weaknesses.join(", ") : "none"}.</p>`,
    });
}

/* ------------------------------------------------------------------------------------------------ */
/*  Crown of Fire: a critical success shared                                                        */
/* ------------------------------------------------------------------------------------------------ */

/** The creature that cast the Augury an effect came from, if the rider recorded it. */
function casterOf(effect) {
    const uuid = effect?.system?.context?.origin?.actor;
    return uuid ? fromUuidSync(uuid) : null;
}

/** The round a creature is fighting in, or a six-second slice of the clock outside combat. */
function roundOf(actor) {
    const combat = game.combats?.find((c) => c.started && c.combatants.some((x) => x.actorId === actor?.id));
    return combat ? `${combat.id}:${combat.round}` : `t${Math.floor(game.time.worldTime / 6)}`;
}

async function crownOfFire(actor, effects) {
    const crownEffect = effects.find((e) => e.name === "Effect: Crown of Fire");
    if (!crownEffect) return;
    const round = roundOf(actor);
    if (flagOf(crownEffect, "crownRound") === round) return;
    const seen = new Set();
    const allies = [];
    for (const token of canvas?.scene?.tokens ?? []) {
        const a = token.actor;
        if (!a || a.id === actor.id || seen.has(a.id)) continue;
        seen.add(a.id);
        if (a.isAllyOf?.(actor) && feet(actor, a) <= 30) allies.push(a);
    }
    if (allies.length === 0) return;
    await crownEffect.update({ [`flags.${MODULE_ID}.crownRound`]: round });
    const chooser = casterOf(crownEffect) ?? actor;
    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: chooser }),
        whisper: [...new Set([...ownersOf(chooser), ...ownersOf(actor)])],
        content: `<p><strong>Crown of Fire</strong> — ${actor.name} critically succeeded. One ally within 30 feet of them takes +1 to their next roll:</p>
            <select name="ally">${allies.map((a) => `<option value="${a.uuid}">${a.name}</option>`).join("")}</select>
            <button type="button" data-stargazer="crown">Crown them</button>`,
        flags: { [MODULE_ID]: { crownCard: { from: actor.uuid, used: false } } },
    });
}

async function crown({ card: cardId, ally: allyUuid }) {
    const card = game.messages.get(cardId);
    const flag = card?.flags?.[MODULE_ID]?.crownCard;
    if (!flag || flag.used) return;
    const ally = (await fromUuid(allyUuid))?.actor ?? (await fromUuid(allyUuid));
    if (!ally) return;
    await card.update({ [`flags.${MODULE_ID}.crownCard.used`]: true });
    const source = await effectFromPack("Effect: Crown's Blessing");
    if (source) await ally.createEmbeddedDocuments("Item", [source]);
}

function bindCrown(message, html) {
    const flag = message.flags?.[MODULE_ID]?.crownCard;
    const button = html.querySelector?.('button[data-stargazer="crown"]');
    if (!flag || !button) return;
    if (flag.used) button.disabled = true;
    button.addEventListener("click", () => {
        button.disabled = true;
        Relay.request({ action: "stargazerCrown", card: message.id, ally: html.querySelector('select[name="ally"]')?.value });
    });
}

/* ------------------------------------------------------------------------------------------------ */
/*  Alms of Fate: 1s and 2s rerolled                                                                */
/* ------------------------------------------------------------------------------------------------ */

/**
 * Alms of Fate on a damage roll, rewritten as it lands (The Balance's shape): every die showing 1 or 2 is
 * rolled again and the new result kept; from 9th rank one die — the one with the most to gain — is set to
 * its maximum. Returns the dice changed, for the flavour. `random` is injectable for the tests.
 */
export function almsDice(dice, { maximise = false, random = Math.random } = {}) {
    const changed = [];
    for (const die of dice) {
        for (const result of die.results ?? []) {
            if (result.active === false || result.result > 2) continue;
            const was = result.result;
            result.result = Math.floor(random() * die.faces) + 1;
            changed.push(`d${die.faces} ${was} to ${result.result}`);
        }
    }
    if (maximise) {
        let best = null;
        for (const die of dice) {
            for (const result of die.results ?? []) {
                if (result.active === false) continue;
                const gain = die.faces - result.result;
                if (!best || gain > best.gain) best = { die, result, gain };
            }
        }
        if (best && best.gain > 0) {
            changed.push(`d${best.die.faces} ${best.result.result} to ${best.die.faces}, maximised`);
            best.result.result = best.die.faces;
        }
    }
    return changed;
}

/**
 * Re-total a pf2e damage roll whose dice were changed in place. Each `DamageInstance` caches its total, and
 * the `InstancePool` above them keeps a result per instance of its own — both have to be told, or the card
 * shows the new dice over the old total (driven: a d4 rewritten 1 → 4 still totalled 1).
 */
function retotal(roll) {
    for (const pool of roll.terms ?? []) {
        if (!Array.isArray(pool.rolls)) continue;
        pool.rolls.forEach((instance, i) => {
            instance._total = instance._evaluateTotal();
            if (pool.results?.[i]) pool.results[i].result = instance._total;
        });
    }
    roll._total = roll._evaluateTotal();
}

function almsRewrite(message) {
    try {
        const context = message.flags?.pf2e?.context;
        if (context?.type !== "damage-roll") return true;
        const actor = message.actor;
        const alms = actor?.itemTypes?.effect?.find((e) => flagOf(e, "almsOfFate"));
        if (!alms) return true;
        const roll = message.rolls?.at(0);
        if (!roll?.dice?.length) return true;
        const caster = casterOf(alms);
        const changed = almsDice(roll.dice, { maximise: (caster?.level ?? 0) >= 17 });
        retotal(roll);
        message.updateSource({
            rolls: [JSON.stringify(roll.toJSON())], content: String(roll.total),
            flavor: `${message.flavor ?? ""}<div class="isaacs-hb-balance">Alms of Fate: ${changed.length ? changed.join("; ") : "no 1s or 2s"}.</div>`,
            [`flags.${MODULE_ID}.almsSpent`]: alms.uuid,
        });
    } catch (error) {
        console.error("Isaac's Homebrew | Alms of Fate could not rewrite a damage roll", error);
    }
    return true;
}

/** The effect goes with the damaging effect it touched. */
async function almsSpent(message) {
    const uuid = message.flags?.[MODULE_ID]?.almsSpent;
    if (!uuid) return;
    const effect = await fromUuid(uuid);
    if (effect) await effect.delete();
}

/* ------------------------------------------------------------------------------------------------ */
/*  Coiling Doubt: the first attack or skill check each round                                       */
/* ------------------------------------------------------------------------------------------------ */

async function renewDoubt(actor) {
    if (!actor) return;
    const lingering = actor.itemTypes.effect.some((e) => flagOf(e, "coilingDoubt"));
    if (!lingering || actor.itemTypes.effect.some((e) => e.name === "Effect: Coiling Doubt")) return;
    const source = await effectFromPack("Effect: Coiling Doubt");
    if (source) await actor.createEmbeddedDocuments("Item", [source]);
}

/* ------------------------------------------------------------------------------------------------ */
/*  Fixed Point: name the roll types                                                                */
/* ------------------------------------------------------------------------------------------------ */

const FIXED_TYPES = { "attack-roll": "attack rolls", "saving-throw": "saving throws", "skill-check": "skill checks" };

async function nameFixedPoint(message) {
    const spell = message.item;
    const actor = spell?.actor;
    if (!isStargazer(actor) || spell.name !== "Fixed Point") return;
    const targets = [...game.user.targets].map((t) => t.actor?.uuid).filter(Boolean);
    if (targets.length === 0) return;
    const two = (spell.rank ?? 1) >= 6;
    const boxes = Object.entries(FIXED_TYPES).map(([k, v]) => `<label style="display:block"><input type="checkbox" name="${k}"> ${v}</label>`).join("");
    const data = await foundry.applications.api.DialogV2.prompt({
        window: { title: "Fixed Point" },
        content: `<p>Name ${two ? "up to two roll types" : "one roll type"}.</p>${boxes}`,
        rejectClose: false,
        ok: { label: "Name them", callback: (_e, button) => new foundry.applications.ux.FormDataExtended(button.form).object },
    });
    if (!data) return;
    const named = Object.keys(FIXED_TYPES).filter((k) => data[k]).slice(0, two ? 2 : 1);
    if (named.length === 0) return;
    await Relay.request({ action: "stargazerFixedPoint", origin: actor.uuid, targets: targets.slice(0, 6), named });
}

async function fixPoint({ origin: originUuid, targets = [], named = [] }) {
    const origin = await fromUuid(originUuid);
    if (!isStargazer(origin)) return;
    const combatant = game.combats?.find((c) => c.started && c.combatants.some((x) => x.actorId === origin.id))?.combatants.find((x) => x.actorId === origin.id);
    const rules = named.filter((k) => k in FIXED_TYPES).map((selector) => ({
        key: "SubstituteRoll", slug: `stargazer-fixed-point-${selector}`, label: "Fixed Point", selector, value: 10,
        required: true, effectType: "fortune", removeAfterRoll: "if-enabled",
    }));
    for (const uuid of targets.slice(0, 6)) {
        const target = (await fromUuid(uuid))?.actor ?? (await fromUuid(uuid));
        if (!target) continue;
        // One effect per named type, so the first of each is spent on its own.
        await target.createEmbeddedDocuments("Item", rules.map((rule) => ({
            name: `Fixed Point (${FIXED_TYPES[rule.selector]})`, type: "effect", img: "icons/magic/time/hourglass-tilted-gray.webp",
            system: {
                description: { value: `<p>The first ${FIXED_TYPES[rule.selector].replace(/s$/, "")} before the end of ${origin.name}'s next turn is a 10 on the die.</p>` },
                duration: { value: 1, unit: "rounds", expiry: "turn-end", sustained: false },
                start: { value: game.time.worldTime, initiative: combatant?.initiative ?? null },
                level: { value: origin.level }, rules: [rule], tokenIcon: { show: true },
            },
        })));
    }
}

/* ------------------------------------------------------------------------------------------------ */
/*  The Hour Is Not Come                                                                            */
/* ------------------------------------------------------------------------------------------------ */

function knowsHour(actor) {
    return (actor?.itemTypes?.spell ?? []).some((s) => s.name === "The Hour Is Not Come" && s.system.location?.value);
}

async function offerHour(target, _params, before) {
    if (!(before > 0) || (target.hitPoints?.value ?? 1) > 0) return;
    if (target.itemTypes.effect.some((e) => e.name === "Effect: The Hour Is Not Come (Immune)")) return;
    for (const stargazer of game.actors) {
        if (!isStargazer(stargazer) || !knowsHour(stargazer)) continue;
        if ((stargazer.system.resources?.focus?.value ?? 0) < 1 || reactionsLeft(stargazer) <= 0) continue;
        const ally = stargazer.id === target.id || target.system?.details?.alliance === stargazer.system?.details?.alliance;
        if (!ally || (stargazer.id !== target.id && feet(stargazer, target) > 30)) continue;
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: stargazer }),
            whisper: ownersOf(stargazer),
            content: `<p><strong>The Hour Is Not Come</strong> — ${target.name} has fallen. It was not going to happen today.</p>
                <button type="button" data-stargazer="hour">Spend a Focus Point and your reaction</button>`,
            flags: { [MODULE_ID]: { hourCard: { origin: stargazer.uuid, target: target.uuid, used: false } } },
        });
    }
}

async function hour({ messageId }) {
    const message = game.messages.get(messageId);
    const card = message?.flags?.[MODULE_ID]?.hourCard;
    if (!card || card.used) return;
    const origin = await fromUuid(card.origin);
    const target = await fromUuid(card.target);
    if (!isStargazer(origin) || !target || (target.hitPoints?.value ?? 1) > 0) return;
    const focus = origin.system.resources?.focus?.value ?? 0;
    if (focus < 1 || reactionsLeft(origin) <= 0) return;
    await message.update({ [`flags.${MODULE_ID}.hourCard.used`]: true });
    await origin.update({ "system.resources.focus.value": focus - 1 });
    await spendReaction(origin);

    // "Reduced to 1 Hit Point instead … and does not gain the wounded condition from this instance."
    const woundedBefore = target.itemTypes.condition.find((c) => c.slug === "wounded")?.value ?? 0;
    for (const slug of ["dying", "unconscious"]) {
        const condition = target.itemTypes.condition.find((c) => c.slug === slug);
        if (condition) await condition.delete();
    }
    const woundedAfter = target.itemTypes.condition.find((c) => c.slug === "wounded");
    if (woundedAfter && (woundedAfter.value ?? 0) !== woundedBefore) {
        if (woundedBefore > 0) await woundedAfter.update({ "system.value.value": woundedBefore });
        else await woundedAfter.delete();
    }
    const rank = Math.ceil((origin.level ?? 1) / 2);
    const dice = hourDice(rank);
    let healed = 0;
    if (dice > 0) healed = (await new Roll(`${dice}d8`).evaluate()).total;
    const hp = target.hitPoints;
    await target.update({
        "system.attributes.hp.value": Math.min(hp.max, 1 + healed),
        "system.attributes.hp.temp": Math.max(hp.temp ?? 0, origin.level ?? 0),
    });
    const immune = await effectFromPack("Effect: The Hour Is Not Come (Immune)");
    if (immune) await target.createEmbeddedDocuments("Item", [immune]);
    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor: origin }),
        content: `<p><strong>The Hour Is Not Come</strong>: ${target.name} stands at ${Math.min(hp.max, 1 + healed)} Hit Points with ${origin.level} temporary.</p>`,
    });
}

function bindHour(message, html) {
    const button = html.querySelector?.('button[data-stargazer="hour"]');
    if (!button) return;
    if (message.flags?.[MODULE_ID]?.hourCard?.used) button.disabled = true;
    button.addEventListener("click", () => {
        button.disabled = true;
        Relay.request({ action: "stargazerHour", messageId: message.id });
    });
}

/* ------------------------------------------------------------------------------------------------ */
/*  Hunted by the Sky                                                                               */
/* ------------------------------------------------------------------------------------------------ */

/** The round a hunted creature was last attacked in, so only the first attack each round gains. */
const huntedRound = new Map();

function hunted(check, context) {
    // pf2e records a target on an attack roll but not on a Perception check; a Seek is aimed by the roller's
    // own target, and this stage runs on the roller's client. Driven: Seek against the hunted creature got nothing.
    const target = context?.target?.actor
        ?? [...(game.user?.targets ?? [])].map((t) => t.actor).find((a) => a && a.id !== context?.actor?.id);
    const mark = target?.itemTypes?.effect?.find((e) => flagOf(e, "huntedBySky"));
    if (!mark) return;
    const options = new Set(context.options ?? []);
    if (context.type === "attack-roll") {
        const combat = game.combats?.find((c) => c.started && c.combatants.some((x) => x.actorId === target.id));
        const round = combat ? `${combat.id}:${combat.round}` : `${game.time.worldTime}`;
        if (huntedRound.get(target.uuid) === round) return;
        huntedRound.set(target.uuid, round);
        check.push(new game.pf2e.Modifier({ slug: "hunted-by-the-sky", label: "Hunted by the Sky", modifier: 1, type: "circumstance" }));
    } else if (options.has("action:seek") && context.actor?.system?.details?.alliance === "party") {
        check.push(new game.pf2e.Modifier({ slug: "hunted-by-the-sky-seek", label: "Hunted by the Sky", modifier: 1, type: "circumstance" }));
    }
}

/* ------------------------------------------------------------------------------------------------ */
/*  Poured Knowing: counteract checks                                                               */
/* ------------------------------------------------------------------------------------------------ */

/** A counteract note's rank, one higher — every outcome but a critical failure, which counteracts nothing. Pure. */
export function liftCounteractNote(text, outcome) {
    if (!outcome || outcome === "criticalFailure") return text;
    return String(text).replace(/(\d+)(?!.*\d)/, (n) => String(Number(n) + 1));
}

/**
 * Poured Knowing (guide §5.2): "each target's counteract checks … use your Stargazer DC and proficiency rank
 * if higher than their own, and count their counteract rank as 1 higher". pf2e rolls a counteract check with
 * the `counteract-check` domain and prints the rank each degree reaches as notes; the check is raised to the
 * Stargazer DC's modifier when that is higher, and each note's rank is lifted by one.
 */
function pouredKnowing(check, context) {
    if (!(context?.domains ?? []).includes("counteract-check")) return;
    const effect = (context.actor?.itemTypes?.effect ?? []).find((e) => flagOf(e, "pouredKnowing"));
    if (!effect) return;
    const caster = casterOf(effect);
    const dc = caster?.classDCs?.stargazer?.dc?.value ?? caster?.getStatistic?.("stargazer")?.dc?.value;
    if (Number.isFinite(dc) && dc - 10 > check.totalModifier) {
        check.push(new game.pf2e.Modifier({ slug: "poured-knowing", label: `Poured Knowing (${caster.name}'s Stargazer DC)`, modifier: dc - 10 - check.totalModifier, type: "untyped" }));
    }
    for (const note of context.notes ?? []) {
        const outcome = [note.outcome ?? []].flat()[0];
        if (outcome && typeof note.text === "string") note.text = liftCounteractNote(note.text, outcome);
    }
}

/* ------------------------------------------------------------------------------------------------ */

export const Auguries = {
    registerHooks() {
        Relay.register?.("stargazerFixedPoint", fixPoint);
        Relay.register?.("stargazerHour", hour);
        Relay.register?.("stargazerCrown", crown);
        Hooks.on("preCreateChatMessage", (message) => almsRewrite(message));
        Hooks.on("createChatMessage", (message, _options, userId) => {
            if (isWriter()) afterRoll(message).catch((e) => console.error("Isaac's Homebrew | the Auguries", e));
            if (isWriter()) almsSpent(message).catch((e) => console.error("Isaac's Homebrew | Alms of Fate", e));
            if (userId === game.user.id) ownRoll(message).catch((e) => console.error("Isaac's Homebrew | Perfect Ledger", e));
            if (userId === game.user.id && message.item?.type === "spell") {
                nameFixedPoint(message).catch((e) => console.error("Isaac's Homebrew | Fixed Point", e));
            }
        });
        Hooks.on("pf2e.startTurn", (combatant) => {
            if (isWriter()) renewDoubt(combatant?.actor).catch((e) => console.error("Isaac's Homebrew | Coiling Doubt", e));
        });
        DamageBus.after("The Hour Is Not Come", DAMAGE.riders + 9, (actor, params, before) => offerHour(actor, params, before));
        CheckPipeline.before("Hunted by the Sky (Stargazer guide §5.2)", PRIORITY.huntedBySky, hunted);
        CheckPipeline.before("Poured Knowing's counteract checks (Stargazer guide §5.2)", PRIORITY.pouredKnowing, pouredKnowing);
        Hooks.on("renderChatMessageHTML", (message, html) => {
            bindHour(message, html);
            bindCrown(message, html);
        });
    },
};

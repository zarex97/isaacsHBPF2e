import { classSlugOf } from "../lib/class-dc.mjs";
import { DamageBus } from "../lib/damage-bus.mjs";
import { DAMAGE as PRIORITY } from "../stage-priorities.mjs";
import { Relay } from "../riders/relay.mjs";
import { MODULE_ID } from "../sky/signs.mjs";
import { SkyTracker } from "../sky/tracker.mjs";

/**
 * The luck engine — Fortune's Thread, Chart the Course, Speak the Portent, The Last Thing You See.
 *
 * ADR-0004: what acts on a d20 *before* it is rolled is **armed** as an effect on the creature, and pf2e
 * spends it itself (`removeAfterRoll`). What answers something that already happened is a **button** on a
 * chat card. The Stargazer's player chooses on their own client; everything written to another creature
 * goes through the GM relay, and the GM re-checks it — range, how many, the reaction, Snarl's restriction —
 * rather than trusting the request.
 *
 * **The reaction** is counted here, because pf2e does not count reactions at all. A Thread costs nothing
 * when it is armed and one reaction when the first creature it was armed on rolls (the rest stay armed —
 * "one reaction arms up to as many creatures as the Thread can affect"). Until then it is *pending*, and a
 * pending Thread holds the reaction: you cannot arm a second while the first is waiting, unless you have a
 * second reaction to spend. Everything armed expires at the start of your next turn, and the count resets
 * with it. Out of combat nothing is counted — there are no turns to count them in.
 */

const FLAG = "stargazer";
export const THREAD = "stargazerThread";
const PORTENT = "stargazerPortent";
const IMMUNE_SLUG = "stargazer-last-thing-immune";

/** The four roll kinds, by pf2e selector. Snarl never reaches a saving throw (guide §4.3). */
const KINDS = {
    "attack-roll": "attack rolls",
    "saving-throw": "saving throws",
    "skill-check": "skill checks",
    perception: "Perception checks",
    initiative: "initiative rolls",
};
const GUIDE_KINDS = ["attack-roll", "saving-throw", "skill-check", "perception"];
const SNARL_KINDS = ["attack-roll", "skill-check", "perception"];

/** The kinds a Thread may be armed on. Thread of Warning (guide §7, 2nd) adds initiative, to either. */
export function threadKinds(actor, kind) {
    const base = kind === "snarl" ? SNARL_KINDS : GUIDE_KINDS;
    return has(actor, "thread-of-warning") ? [...base, "initiative"] : base;
}

const isWriter = () => (game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM);
const has = (actor, slug) => (actor?.itemTypes?.feat ?? []).some((f) => f.slug === slug);
const state = (actor) => actor?.flags?.[MODULE_ID]?.[FLAG] ?? {};
const tokenOf = (actor) => actor?.getActiveTokens?.(true, true)?.[0] ?? null;
/**
 * In any started encounter — not only the one being viewed. `game.combat` is the viewed combat, and a world
 * with a second encounter open made a Stargazer fighting in it look out of combat, so a fired Thread cost
 * nothing (driven).
 */
const inCombat = (actor) => Boolean(actor && game.combats?.some((c) => c.started && c.combatants.some((x) => x.actorId === actor.id)));

/** The round this Stargazer is fighting in, or null out of combat. */
function roundKey(actor) {
    const combat = game.combats?.find((c) => c.started && c.combatants.some((x) => x.actorId === actor?.id));
    return combat ? `${combat.id}:${combat.round}` : null;
}

/**
 * Prophesied Ally (guide §7, 12th): a Thread on the ally named at the Vigil costs no reaction, once per
 * round. Read as a Thread on that ally alone — one aimed at others too still costs the reaction they need.
 */
export function prophesiedFree(actor, targetUuids) {
    if (!has(actor, "prophesied-ally") || targetUuids.length !== 1) return false;
    const ally = state(actor).prophesied;
    if (!ally?.uuid) return false;
    const target = fromUuidSync(targetUuids[0]);
    const targetActor = target?.actor ?? target;
    if (!targetActor || targetActor.uuid !== ally.uuid) return false;
    const round = roundKey(actor);
    return !round || state(actor).prophesiedRound !== round;
}

export function isStargazer(actor) {
    return actor?.type === "character" && classSlugOf(actor) === "stargazer";
}

/** Feet between two creatures' tokens, or Infinity when either has none on the scene. */
function distance(a, b) {
    const ta = tokenOf(a);
    const tb = tokenOf(b);
    if (!ta || !tb) return Infinity;
    if (ta.document?.parent?.id !== tb.document?.parent?.id) return Infinity;
    return canvas?.grid?.measurePath?.([ta.center, tb.center])?.distance ?? Infinity;
}

/* ------------------------------------------------------------------------------------------------ */
/*  The numbers each feature moves                                                                  */
/* ------------------------------------------------------------------------------------------------ */

export const Numbers = {
    /** Guide §4.3, §4.7, §4.14 — one creature, two from Widen the Sky, three from Threefold Thread. */
    threadTargets(actor) {
        const base = has(actor, "threefold-thread") ? 3 : has(actor, "widen-the-sky") ? 2 : 1;
        return base + (has(actor, "skein-of-fates") ? 1 : 0);
    },
    /** Guide §4.3, §4.7 — 30 feet, 60 from Widen the Sky; Long Thread adds 30. */
    threadRange(actor) {
        return (has(actor, "widen-the-sky") ? 60 : 30) + (has(actor, "long-thread") ? 30 : 0);
    },
    /** Guide §4.3, §4.10 — ±1, ±2 from Surer Thread. */
    threadValue(actor) {
        return has(actor, "surer-thread") ? 2 : 1;
    },
    /** Guide §4.4 — one creature, two from 11th; the Weaver's Doubled Strand makes it two, and three (§6.1). */
    chartTargets(actor) {
        const eleventh = (actor?.level ?? 1) >= 11;
        if (has(actor, "doubled-strand")) return eleventh ? 3 : 2;
        return eleventh ? 2 : 1;
    },
    chartRange(actor) {
        return has(actor, "widened-chart") ? 120 : 60;
    },
    /**
     * How many of a Thread's targets Twin Fates may double: two from the class feature at 15th. Cascade
     * (12th) grants it early on one, and makes it three once the class feature arrives (ruling R3).
     */
    twinFates(actor) {
        const feature = has(actor, "twin-fates");
        if (has(actor, "cascade")) return feature ? 3 : 1;
        return feature ? 2 : 0;
    },
    /** One reaction; Two Warnings grants a second, for these abilities only. */
    reactions(actor) {
        return has(actor, "two-warnings") ? 2 : 1;
    },
};

/** How many reactions this Stargazer can still commit: the round's allowance, less spent and pending. */
export function reactionsLeft(actor) {
    const s = state(actor);
    const pending = (s.pending ?? []).length;
    if (!inCombat(actor)) return Numbers.reactions(actor) - pending;
    return Numbers.reactions(actor) - (s.spent ?? 0) - pending;
}

/** Spend one of this Stargazer's reactions on something other than a Thread — The Last Thing You See, The Hour Is Not Come. */
export async function spendReaction(actor) {
    if (!inCombat(actor)) return;
    await actor.update({ [`flags.${MODULE_ID}.${FLAG}.spent`]: (state(actor).spent ?? 0) + 1 });
}

/** Hunted by the Sky (guide §5.2): a Snarl against a hunted creature is −3, or −4 with Surer Thread. */
export function snarlAgainst(origin, target) {
    const hunted = (target?.itemTypes?.effect ?? []).some((e) => e.flags?.[MODULE_ID]?.huntedBySky);
    return Numbers.threadValue(origin) + (hunted ? 2 : 0);
}

/** A Thread's effect, as the GM writes it onto the creature. */
export function threadEffect({ origin, group, kind, value, kinds, free, twice }) {
    const guide = kind === "guide";
    const sign = guide ? `+${value}` : `−${value}`;
    const selector = kinds;
    const rule = twice
        ? { key: "RollTwice", selector, keep: guide ? "higher" : "lower", removeAfterRoll: true }
        : {
            key: "FlatModifier",
            slug: `stargazer-${kind}-${group}`,
            label: guide ? "Guide" : "Snarl",
            selector,
            type: "circumstance",
            value: guide ? value : -value,
            // A free Thread from Chart the Course is spent by the creature's first d20, whatever it is.
            removeAfterRoll: free ? true : "if-enabled",
        };
    const title = twice ? (guide ? "Twin Fates (fortune)" : "Twin Fates (misfortune)") : `${guide ? "Guide" : "Snarl"} ${sign}`;
    return {
        name: `Fortune's Thread: ${title}`,
        type: "effect",
        img: guide ? "icons/magic/light/explosion-star-glow-yellow.webp" : "icons/magic/unholy/orb-glowing-purple.webp",
        system: {
            description: { value: `<p>Armed by ${origin.name}. Spent by the next ${selector.map((s) => KINDS[s]).join(", ")} this creature rolls.</p>` },
            duration: { value: -1, unit: "unlimited", expiry: null, sustained: false },
            level: { value: origin.level ?? 1 },
            rules: [rule],
            tokenIcon: { show: true },
            traits: { value: ["prediction"], rarity: "common", otherTags: [] },
        },
        flags: { [MODULE_ID]: { [THREAD]: { origin: origin.uuid, group, kind, free: Boolean(free) } } },
    };
}

/** The Portent, armed on a creature for one kind of roll (guide §4.5). */
export function portentEffect({ origin, value, selector, portentId = "p1" }) {
    return {
        name: `Portent: ${value}`,
        type: "effect",
        img: "icons/magic/perception/eye-ringed-glow-angry-small-teal.webp",
        system: {
            description: { value: `<p>${origin.name} has spoken a Portent of ${value} over this creature's next ${KINDS[selector]}.</p>` },
            duration: { value: -1, unit: "unlimited", expiry: null, sustained: false },
            level: { value: origin.level ?? 1 },
            rules: [{
                key: "SubstituteRoll",
                // Load-bearing: `"if-enabled"` only matches an explicit slug, and the fortune guard in
                // `armed.mjs` finds a Portent by this prefix.
                slug: `stargazer-portent-${origin.id}-${portentId}`,
                label: "Portent",
                selector,
                value,
                required: true,
                effectType: "fortune",
                removeAfterRoll: "if-enabled",
            }],
            tokenIcon: { show: true },
            traits: { value: ["prediction"], rarity: "common", otherTags: [] },
        },
        flags: { [MODULE_ID]: { [PORTENT]: { origin: origin.uuid, portentId } } },
    };
}

/* ------------------------------------------------------------------------------------------------ */
/*  How many Portents, and which                                                                    */
/* ------------------------------------------------------------------------------------------------ */

/**
 * How many Portents a Vigil records (guide §4.5, §7): one; two with *Twin Portent* or *Second Portent*;
 * three with both. Each speaking spends one, so this is also how often the Portent can be spoken — Twin
 * Portent's "twice per day" and Second Portent's "twice … three times" are the same count.
 */
export function portentCount(actor) {
    if (!has(actor, "portent")) return 0;
    return 1 + (has(actor, "twin-portent") ? 1 : 0) + (has(actor, "second-portent") ? 1 : 0);
}

/** Fixed Sky (guide §7, 20th; ruling R15): the fixed Portent can be spoken once per week — seven dawns of the Sky. */
export function fixedReady(actor, today = SkyTracker.state?.day) {
    const at = state(actor).fixedSpokenDay;
    return typeof at !== "number" || today - at >= 7;
}

/** This Stargazer's Portents. A sheet from before Twin Portent carries one, as `portent`. */
export function portentsOf(actor) {
    const s = state(actor);
    if (Array.isArray(s.portents)) return s.portents;
    if (typeof s.portent?.value === "number") return [{ id: "p1", value: s.portent.value, spent: Boolean(s.portent.spent) }];
    return [];
}

export const unspentPortents = (actor) => portentsOf(actor).filter((p) => !p.spent && typeof p.value === "number");

/** The Portents a Vigil records, before any are rolled: a `fixed` one is 20, the rest are `null` until the die. */
export function portentSlots(actor, today) {
    const count = portentCount(actor);
    if (count === 0) return [];
    const slots = [];
    if (has(actor, "fixed-sky")) slots.push({ id: "fixed", value: 20, fixed: true, spent: !fixedReady(actor, today) });
    while (slots.length < count) slots.push({ id: `p${slots.length + 1}`, value: null, spent: false });
    return slots;
}

/** The condition slugs a creature carries, active ones only. */
const conditionsOf = (actor) => new Set((actor?.itemTypes?.condition ?? []).filter((c) => c.active !== false).map((c) => c.slug));

/**
 * Why the Stargazer cannot see this creature, or null (#116). "That you can see" — Fortune's Thread, Chart the
 * Course, Speak the Portent, The Last Thing You See — fails when the Stargazer is **blinded**, when the target
 * is **invisible** (unless the Stargazer sees invisibility), **hidden**, **undetected** or **unnoticed**, or when
 * a wall that blocks sight stands between their tokens. Lighting is left to the GM: pf2e does not record
 * what a creature can see in the dark, only how it is concealed.
 */
export function sightBlock(origin, target) {
    if (!origin || !target || origin.id === target.id) return null;
    if (conditionsOf(origin).has("blinded")) return `${origin.name} is blinded`;
    const onTarget = conditionsOf(target);
    const senses = [...(origin.perception?.senses ?? origin.system?.perception?.senses ?? [])].map((s) => s?.type ?? s);
    if (onTarget.has("invisible") && !senses.includes("see-invisibility")) return `${target.name} is invisible`;
    for (const slug of ["undetected", "unnoticed", "hidden"]) if (onTarget.has(slug)) return `${target.name} is ${slug}`;
    const a = tokenOf(origin);
    const b = tokenOf(target);
    if (!a || !b || a.parent?.id !== b.parent?.id) return null;
    const from = a.object?.center ?? a.center;
    const to = b.object?.center ?? b.center;
    const backend = CONFIG.Canvas?.polygonBackends?.sight;
    if (from && to && backend?.testCollision?.(from, to, { type: "sight", mode: "any" })) return `${target.name} is out of sight`;
    return null;
}

/** Why a target cannot take this Thread, or null. Shared by the picker and the GM's re-check. */
export function refusal(origin, target, { range, sight = true }) {
    if (!target) return "no such creature";
    if ((target.attributes?.immunities ?? []).some((i) => i.type === "prediction")) return `${target.name} is immune to prediction`;
    if (sight) {
        const blind = sightBlock(origin, target);
        if (blind) return `you cannot see it: ${blind}`;
    }
    const feet = distance(origin, target);
    if (feet > range) {
        return Number.isFinite(feet)
            ? `${target.name} is ${Math.round(feet)} feet away, beyond ${range} feet`
            : `${target.name} has no token on this scene`;
    }
    return null;
}

/* ------------------------------------------------------------------------------------------------ */
/*  The picker, on the Stargazer's client                                                           */
/* ------------------------------------------------------------------------------------------------ */

async function form(title, html) {
    return foundry.applications.api.DialogV2.prompt({
        window: { title },
        content: html,
        rejectClose: false,
        ok: { label: "Arm", callback: (_event, button) => new foundry.applications.ux.FormDataExtended(button.form).object },
    });
}

function targeted() {
    return [...game.user.targets].map((t) => t.actor).filter(Boolean);
}

async function pickTapestry() {
    const data = await form("Tapestry", `<p>One reaction, one choice, everyone within ${TAPESTRY_RANGE} feet.</p>
        <div class="form-group"><label>Thread</label><select name="kind">
            <option value="">Not now: use my targets</option>
            <option value="guide">Guide every ally</option><option value="snarl">Snarl every enemy</option>
        </select></div>`);
    return data?.kind || null;
}

async function pickThreads(actor, { free, chart }) {
    if (!chart && tapestryReady(actor) && reactionsLeft(actor) > 0) {
        const kind = await pickTapestry();
        if (kind) return Relay.request({ action: "stargazerArm", origin: actor.uuid, tapestry: kind, entries: [], chart: false, free: false });
    }
    const creatures = targeted();
    const max = chart ? Numbers.chartTargets(actor) : Numbers.threadTargets(actor);
    const name = chart ? "Chart the Course" : "Fortune's Thread";
    if (creatures.length === 0) return ui.notifications.warn(`${name}: target the creatures first.`);
    if (creatures.length > max) return ui.notifications.warn(`${name}: at most ${max} creature${max > 1 ? "s" : ""}.`);
    const prophesied = !chart && prophesiedFree(actor, creatures.map((c) => c.uuid));
    if (!free && !prophesied && reactionsLeft(actor) <= 0) return ui.notifications.warn(`${name}: no reaction left this round.`);

    const twinFates = !chart && Numbers.twinFates(actor) > 0 && twinFatesReady(actor);
    const rows = creatures.map((c, i) => `
        <div class="form-group"><label>${c.name}</label>
            <select name="kind${i}"><option value="guide">Guide</option><option value="snarl">Snarl</option></select>
            ${chart ? "" : `<select name="on${i}"><option value="any">its next eligible roll</option>${
                Object.entries(KINDS).filter(([k]) => threadKinds(actor, "guide").includes(k) || k === "saving-throw")
                    .map(([k, v]) => `<option value="${k}">its next ${v.replace(/s$/, "")}</option>`).join("")}</select>`}
            ${twinFates ? `<label><input type="checkbox" name="twice${i}"> Twin Fates</label>` : ""}
        </div>`).join("");
    const data = await form(name, `<p>${chart
        ? "The first time each rolls a d20 before the start of your next turn, this Thread is spent on it — no reaction."
        : "Spent by the first matching roll; the reaction goes then."}</p>${rows}`);
    if (!data) return;

    const entries = creatures.map((c, i) => ({ target: c.uuid, kind: data[`kind${i}`], on: data[`on${i}`] ?? "any", twice: Boolean(data[`twice${i}`]) }));
    const twinMax = Numbers.twinFates(actor);
    if (entries.filter((e) => e.twice).length > twinMax) return ui.notifications.warn(`Twin Fates: up to ${twinMax === 1 ? "one" : twinMax === 3 ? "three" : "two"} of the Thread's targets.`);
    await Relay.request({ action: "stargazerArm", origin: actor.uuid, entries, chart: Boolean(chart), free: Boolean(free) });
}

async function pickPortent(actor) {
    const open = unspentPortents(actor);
    if (open.length === 0) return ui.notifications.warn("Speak the Portent: you have no Portent left. They are rolled at your Night Vigil.");
    const [target] = targeted();
    if (!target || targeted().length > 1) return ui.notifications.warn("Speak the Portent: target exactly one creature.");
    const which = open.map((p) => `<option value="${p.id}">${p.value}${p.fixed ? " (Fixed Sky, once a week)" : ""}</option>`).join("");
    const data = await form("Speak the Portent", `<p>The next roll of this kind ${target.name} makes <em>is</em> your Portent.</p>
        <div class="form-group"><label>Portent</label><select name="portent">${which}</select></div>
        <div class="form-group"><label>Roll</label><select name="on">
            <option value="attack-roll">attack roll</option><option value="saving-throw">saving throw</option><option value="skill-check">skill check</option>
        </select></div>`);
    if (!data) return;
    await Relay.request({ action: "stargazerPortent", origin: actor.uuid, target: target.uuid, on: data.on, portentId: data.portent });
}

/** Once per 10 minutes, by the world clock. */
const tenMinutes = (at) => typeof at !== "number" || (game.time.worldTime - at) >= 600;

function twinFatesReady(actor) {
    return tenMinutes(state(actor).twinFatesAt);
}

/** The Weaver's Tapestry (guide §6.1), once per 10 minutes. */
export function tapestryReady(actor) {
    return has(actor, "tapestry") && tenMinutes(state(actor).tapestryAt);
}
const TAPESTRY_RANGE = 60;

/** Everyone the Tapestry reaches: every ally within 60 feet (Guide) or every enemy (Snarl). */
function tapestryCreatures(origin, kind) {
    const scene = tokenOf(origin)?.parent;
    const found = new Map();
    for (const token of scene?.tokens ?? []) {
        const actor = token.actor;
        if (!actor || actor.id === origin.id || found.has(actor.id)) continue;
        if (distance(origin, actor) > TAPESTRY_RANGE) continue;
        if (kind === "guide" ? actor.isAllyOf(origin) : actor.isEnemyOf(origin)) found.set(actor.id, actor);
    }
    return [...found.values()];
}

/* ------------------------------------------------------------------------------------------------ */
/*  The GM's half                                                                                   */
/* ------------------------------------------------------------------------------------------------ */

async function arm({ origin: originUuid, entries = [], chart, free, tapestry }) {
    const origin = await fromUuid(originUuid);
    if (!isStargazer(origin)) return;
    // Tapestry: the GM, not the picker, decides who is within 60 feet and on which side.
    if (tapestry) {
        if (chart || free || !["guide", "snarl"].includes(tapestry) || !tapestryReady(origin)) return;
        entries = tapestryCreatures(origin, tapestry).map((c) => ({ target: c.uuid, kind: tapestry, on: "any" }));
        if (entries.length === 0) return say(origin, `<strong>Tapestry</strong>: nobody within ${TAPESTRY_RANGE} feet to ${tapestry === "guide" ? "Guide" : "Snarl"}.`);
    }
    const name = tapestry ? "Tapestry" : chart ? "Chart the Course" : "Fortune's Thread";
    const max = chart ? Numbers.chartTargets(origin) : Numbers.threadTargets(origin);
    const range = tapestry ? TAPESTRY_RANGE : chart ? Numbers.chartRange(origin) : Numbers.threadRange(origin);
    const prophesied = !chart && !free && !tapestry && prophesiedFree(origin, entries.map((e) => e.target));
    const isFree = Boolean(chart || free || prophesied);
    if (entries.length === 0 || (!tapestry && entries.length > max)) return;
    if (!isFree && reactionsLeft(origin) <= 0) return say(origin, `<strong>${name}</strong>: no reaction left this round.`);

    const twice = entries.filter((e) => e.twice);
    if (twice.length > 0 && (chart || tapestry || twice.length > Numbers.twinFates(origin) || !twinFatesReady(origin))) return;

    // Chart the Course: only one active at a time — the last one's Threads go.
    if (chart) await sweep(origin, (flag) => flag.free);

    const group = foundry.utils.randomID();
    const value = Numbers.threadValue(origin);
    const armed = [];
    for (const entry of entries) {
        const target = (await fromUuid(entry.target))?.actor ?? (await fromUuid(entry.target));
        // Thread of Warning: "even though positions are not yet set" — a Thread on initiative alone has no range.
        const onInitiative = entry.on === "initiative";
        // Sight, where it is asked (#116): not on initiative (Thread of Warning), not for a Chart the Course with
        // Widened Chart ("only to know where it is"), and not for a Snarl on this Stargazer's Star-Marked Enemy.
        const starMarked = entry.kind === "snarl" && (target?.itemTypes?.effect ?? []).some((e) => e.flags?.[MODULE_ID]?.starMarked === origin.uuid);
        const sight = !onInitiative && !(chart && has(origin, "widened-chart")) && !starMarked;
        const why = refusal(origin, target, { range: onInitiative ? Infinity : range, sight });
        if (why) {
            await say(origin, `<strong>${name}</strong>: ${why}.`);
            continue;
        }
        const allowed = threadKinds(origin, entry.kind);
        const kinds = entry.on && entry.on !== "any" ? [entry.on] : allowed;
        if (!kinds.every((k) => allowed.includes(k))) {
            await say(origin, `<strong>${name}</strong>: Snarl can only be applied to an attack roll, skill check or Perception check.`);
            continue;
        }
        const strength = entry.kind === "snarl" ? snarlAgainst(origin, target) : value;
        const effect = threadEffect({ origin, group, kind: entry.kind, value: strength, kinds, free: isFree, twice: Boolean(entry.twice) });
        await target.createEmbeddedDocuments("Item", [effect]);
        armed.push(`${entry.kind === "guide" ? "Guide" : "Snarl"} on ${target.name}${entry.twice ? " (Twin Fates)" : ""}`);
    }
    if (armed.length === 0) return;

    const update = {};
    if (!isFree) update[`flags.${MODULE_ID}.${FLAG}.pending`] = [...(state(origin).pending ?? []), group];
    if (twice.length > 0) update[`flags.${MODULE_ID}.${FLAG}.twinFatesAt`] = game.time.worldTime;
    if (tapestry) update[`flags.${MODULE_ID}.${FLAG}.tapestryAt`] = game.time.worldTime;
    let cost = "";
    if (prophesied) {
        update[`flags.${MODULE_ID}.${FLAG}.prophesiedRound`] = roundKey(origin);
        cost = " No reaction: the Prophesied Ally.";
    }
    // Unspent Thread (guide §7, 10th): the first Chart the Course of a turn that began with the reaction unused.
    if (chart && has(origin, "unspent-thread") && state(origin).unspentThread && state(origin).unspentThread === roundKey(origin)) {
        update[`flags.${MODULE_ID}.${FLAG}.unspentThread`] = null;
        cost = " A free action: Unspent Thread.";
    }
    if (Object.keys(update).length > 0) await origin.update(update);
    await say(origin, `<strong>${name}</strong>: ${armed.join("; ")}.${cost}`, { whisper: ownersOf(origin) });
}

async function speak({ origin: originUuid, target: targetUuid, on, portentId }) {
    const origin = await fromUuid(originUuid);
    if (!isStargazer(origin) || !["attack-roll", "saving-throw", "skill-check"].includes(on)) return;
    const open = unspentPortents(origin);
    const portent = open.find((p) => p.id === (portentId ?? open[0]?.id));
    if (!portent) return;
    const value = portent.value;
    const target = (await fromUuid(targetUuid))?.actor ?? (await fromUuid(targetUuid));
    const why = refusal(origin, target, { range: 60 });
    if (why) return say(origin, `<strong>Speak the Portent</strong>: ${why}.`);
    // One Portent, one place: speaking it again moves it. Another Portent is another place.
    await sweepPortent(origin, portent.id);
    await target.createEmbeddedDocuments("Item", [portentEffect({ origin, value, selector: on, portentId: portent.id })]);
    await say(origin, `<strong>Speak the Portent</strong>: ${target.name}'s next ${KINDS[on].replace(/s$/, "")} will be a ${value}.`, { whisper: ownersOf(origin) });
}

/** Delete this Stargazer's armed Threads that match, wherever they are, without counting them as spent. */
async function sweep(origin, match = () => true) {
    for (const actor of game.actors) {
        const ours = actor.itemTypes.effect.filter((e) => {
            const flag = e.flags?.[MODULE_ID]?.[THREAD];
            return flag?.origin === origin.uuid && match(flag);
        });
        if (ours.length > 0) await actor.deleteEmbeddedDocuments("Item", ours.map((e) => e.id), { stargazerQuiet: true });
    }
}

async function sweepPortent(origin, portentId = null) {
    for (const actor of game.actors) {
        const ours = actor.itemTypes.effect.filter((e) => {
            const flag = e.flags?.[MODULE_ID]?.[PORTENT];
            return flag?.origin === origin.uuid && (!portentId || (flag.portentId ?? "p1") === portentId);
        });
        if (ours.length > 0) await actor.deleteEmbeddedDocuments("Item", ours.map((e) => e.id), { stargazerQuiet: true });
    }
}

/** An armed effect left the sheet. If pf2e spent it on a roll, the Thread fired — or the Portent was spoken. */
async function spent(item, options) {
    if (options?.stargazerQuiet) return;
    const thread = item.flags?.[MODULE_ID]?.[THREAD];
    const portent = item.flags?.[MODULE_ID]?.[PORTENT];
    if (!thread && !portent) return;
    const origin = await fromUuid((thread ?? portent).origin);
    if (!origin) return;
    if (portent) {
        const id = portent.portentId ?? "p1";
        const portents = portentsOf(origin).map((p) => (p.id === id ? { ...p, spent: true } : p));
        const update = { [`flags.${MODULE_ID}.${FLAG}.portents`]: portents, [`flags.${MODULE_ID}.${FLAG}.portent`]: null };
        const fixed = portents.find((p) => p.id === id)?.fixed;
        if (fixed) update[`flags.${MODULE_ID}.${FLAG}.fixedSpokenDay`] = SkyTracker.state.day;
        await origin.update(update);
        return say(origin, `<strong>Portent</strong> spoken on ${item.actor?.name}${fixed ? ": the Fixed Sky, once this week" : ""}.`, { whisper: ownersOf(origin) });
    }
    if (thread.kind === "guide" && has(origin, "knotted-thread") && item.actor) await knot(origin, item.actor);
    if (thread.free) return;
    const pending = state(origin).pending ?? [];
    if (!pending.includes(thread.group)) return; // this group already cost its reaction
    await origin.update({
        [`flags.${MODULE_ID}.${FLAG}.pending`]: pending.filter((g) => g !== thread.group),
        [`flags.${MODULE_ID}.${FLAG}.spent`]: inCombat(origin) ? (state(origin).spent ?? 0) + 1 : 0,
    });
}

/**
 * The Weaver's Knotted Thread (guide §6.1): a Guided creature also takes +1 AC against the next attack made
 * against it before the start of the Stargazer's next turn. Given when the Guide lands — that is when the
 * Thread is spent — and taken back by the next attack roll at it (`paths.mjs`), or by the Stargazer's turn.
 */
async function knot(origin, actor) {
    const pack = game.packs.get(`${MODULE_ID}.stargazer-effects`);
    const entry = (await pack?.getIndex())?.find((e) => e.name === "Effect: Knotted Thread");
    if (!entry) return;
    const source = foundry.utils.deepClone((await pack.getDocument(entry._id)).toObject());
    source.flags = foundry.utils.mergeObject(source.flags ?? {}, { [MODULE_ID]: { knottedThread: origin.uuid } });
    source.system.duration = { value: -1, unit: "unlimited", expiry: null, sustained: false };
    await unknot(origin, actor);
    await actor.createEmbeddedDocuments("Item", [source]);
}

/** Take this Stargazer's Knotted Thread off one creature, or off everyone. */
async function unknot(origin, only = null) {
    for (const actor of only ? [only] : game.actors) {
        const ours = actor.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.knottedThread === origin.uuid);
        if (ours.length > 0) await actor.deleteEmbeddedDocuments("Item", ours.map((e) => e.id), { stargazerQuiet: true });
    }
}

/** The start of the Stargazer's turn: the reaction comes back and every Thread still armed expires. */
async function startTurn(actor) {
    if (!isStargazer(actor)) return;
    const before = state(actor);
    const unspent = has(actor, "unspent-thread") && (before.spent ?? 0) === 0 && (before.pending ?? []).length === 0;
    await sweep(actor);
    await unknot(actor);
    if (unspent) {
        await actor.update({ [`flags.${MODULE_ID}.${FLAG}.unspentThread`]: roundKey(actor) });
        await say(actor, "<strong>Unspent Thread</strong>: your reaction went unused. Your first <em>Chart the Course</em> this turn is a free action.", { whisper: ownersOf(actor) });
    }
    await actor.update({ [`flags.${MODULE_ID}.${FLAG}.pending`]: [], [`flags.${MODULE_ID}.${FLAG}.spent`]: 0 });
}

/* ------------------------------------------------------------------------------------------------ */
/*  The Portent, rolled at the Vigil                                                                */
/* ------------------------------------------------------------------------------------------------ */

/**
 * Guide §4.5, §7: at the Night Vigil, roll the Portents and record them. A new Vigil overwrites every
 * unspent one. `times: 2` is a Starless night ("roll your Portent twice and keep either"): each Portent gets
 * both dice as `options`, and the first is recorded until the player keeps one.
 */
export async function rollPortents(actor, { times = 1 } = {}) {
    if (!isStargazer(actor)) return [];
    const slots = portentSlots(actor, SkyTracker.state.day);
    const open = slots.filter((s) => s.value === null);
    if (slots.length === 0) return [];
    let dice = [];
    if (open.length > 0) {
        const roll = await new Roll(`${open.length * times}d20`).evaluate();
        dice = roll.dice[0].results.map((r) => r.result);
        const label = open.length === 1 && times === 1 ? "Portent" : "Portents";
        await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor }), flavor: `<strong>${label}</strong>, recorded at the Night Vigil` }, { rollMode: "gmroll" });
    }
    open.forEach((slot, i) => {
        slot.options = dice.slice(i * times, (i + 1) * times);
        slot.value = slot.options[0];
    });
    await setPortents(actor, slots.map(({ options, ...slot }) => slot));
    return slots;
}

/** Record the Portents, overwriting every unspent one — including any already armed on a creature. */
export async function setPortents(actor, portents) {
    // An old Portent may be armed on a creature this client cannot write to; the GM takes it back.
    await Relay.request({ action: "stargazerSweepPortent", origin: actor.uuid });
    await actor.update({ [`flags.${MODULE_ID}.${FLAG}.portents`]: portents, [`flags.${MODULE_ID}.${FLAG}.portent`]: null });
}

/** Change one recorded Portent's value: a Starless night's other die, or Astrological Sign's nudge. */
export async function setPortentValue(actor, id, value) {
    const portents = portentsOf(actor).map((p) => (p.id === id && !p.fixed ? { ...p, value } : p));
    await actor.update({ [`flags.${MODULE_ID}.${FLAG}.portents`]: portents, [`flags.${MODULE_ID}.${FLAG}.portent`]: null });
}

/* ------------------------------------------------------------------------------------------------ */
/*  The Last Thing You See — a button after the damage                                              */
/* ------------------------------------------------------------------------------------------------ */

async function offerLastThing(actor, params, before) {
    if (!isStargazer(actor) || !has(actor, "the-last-thing-you-see")) return;
    if ((actor.hitPoints?.value ?? 0) >= before) return; // no damage landed
    const attacker = params?.item?.actor;
    if (!attacker || attacker.id === actor.id) return;
    if (distance(actor, attacker) > 30) return;
    // "A creature within 30 feet that you can see" (#116).
    if (sightBlock(actor, attacker)) return;
    if (reactionsLeft(actor) <= 0) return;
    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        whisper: ownersOf(actor),
        content: `<p><strong>The Last Thing You See</strong> — ${attacker.name} hurt you. Show it the hour of its own death?</p>
            <button type="button" data-stargazer="last-thing">Use your reaction</button>`,
        flags: { [MODULE_ID]: { lastThing: { origin: actor.uuid, attacker: attacker.uuid, used: false } } },
    });
}

async function lastThing({ messageId }) {
    const message = game.messages.get(messageId);
    const card = message?.flags?.[MODULE_ID]?.lastThing;
    if (!card || card.used) return;
    const origin = await fromUuid(card.origin);
    const attacker = await fromUuid(card.attacker);
    if (!isStargazer(origin) || !attacker) return;
    if (reactionsLeft(origin) <= 0) return say(origin, "<strong>The Last Thing You See</strong>: no reaction left this round.");
    await message.update({ [`flags.${MODULE_ID}.lastThing.used`]: true });
    await spendReaction(origin);

    const immune = attacker.itemTypes.effect.some((e) => e.slug === IMMUNE_SLUG && e.flags?.[MODULE_ID]?.lastThingFrom === origin.uuid);
    const traits = ["emotion", "fear", "illusion", "mental", "prediction", "visual"];
    const immunities = (attacker.attributes?.immunities ?? []).map((i) => i.type);
    if (immune || traits.some((t) => immunities.includes(t))) {
        return say(origin, `<strong>The Last Thing You See</strong>: ${attacker.name} is unaffected.`);
    }
    const dc = origin.classDCs?.stargazer?.dc?.value ?? origin.getStatistic?.("stargazer")?.dc?.value;
    const roll = await attacker.saves.will.roll({
        dc: { value: dc, label: "The Last Thing You See" }, skipDialog: true, traits,
        extraRollOptions: ["stargazer:the-last-thing-you-see"],
    });
    const degree = roll?.degreeOfSuccess ?? null;
    if (degree === 3) {
        await attacker.createEmbeddedDocuments("Item", [{
            name: "Immune: The Last Thing You See", type: "effect", img: "icons/magic/perception/eye-ringed-glow-angry-small-teal.webp",
            system: { slug: IMMUNE_SLUG, description: { value: `<p>Temporarily immune to ${origin.name}'s The Last Thing You See.</p>` },
                duration: { value: 10, unit: "minutes", expiry: "turn-start", sustained: false }, level: { value: origin.level }, rules: [], tokenIcon: { show: false } },
            flags: { [MODULE_ID]: { lastThingFrom: origin.uuid } },
        }]);
    } else if (degree !== null) {
        const frightened = { 2: 1, 1: 2, 0: 3 }[degree];
        await attacker.increaseCondition("frightened", { value: frightened });
        if (degree === 0) await attacker.increaseCondition("stunned", { value: 1 });
    }
}

function bindCard(message, html) {
    const button = html.querySelector?.('button[data-stargazer="last-thing"]');
    if (!button) return;
    const card = message.flags?.[MODULE_ID]?.lastThing;
    if (card?.used) button.disabled = true;
    button.addEventListener("click", () => {
        button.disabled = true;
        Relay.request({ action: "stargazerLastThing", messageId: message.id });
    });
}

/* ------------------------------------------------------------------------------------------------ */

function ownersOf(actor) {
    return game.users.filter((u) => actor.testUserPermission(u, "OWNER")).map((u) => u.id);
}

async function say(actor, html, extra = {}) {
    return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<p>${html}</p>`, ...extra });
}

async function onOwnUse(message) {
    const item = message.item;
    const actor = item?.actor;
    if (!isStargazer(actor) || message.flags?.pf2e?.context) return;
    // Rewrite the Ending (§10.3): with the Star Chart dark, the luck engine is gone until the long Vigil.
    if (state(actor).dark && ["fortunes-thread", "chart-the-course", "portent"].includes(item.slug)) {
        return ui.notifications.warn(`${item.name}: your Star Chart is dark until a full eight-hour Night Vigil under open sky.`);
    }
    const run = {
        "fortunes-thread": () => pickThreads(actor, { free: false, chart: false }),
        "chart-the-course": () => pickThreads(actor, { free: true, chart: true }),
        "portent": () => pickPortent(actor),
    }[item.slug];
    if (run) await run();
}

export const Threads = {
    rollPortents,
    reactionsLeft,
    registerHooks() {
        Relay.register?.("stargazerArm", arm);
        Relay.register?.("stargazerPortent", speak);
        Relay.register?.("stargazerLastThing", lastThing);
        Relay.register?.("stargazerSweepPortent", async ({ origin }) => {
            const actor = await fromUuid(origin);
            if (isStargazer(actor)) await sweepPortent(actor);
        });
        Hooks.on("createChatMessage", (message, _options, userId) => {
            if (userId === game.user.id) onOwnUse(message).catch((e) => console.error("Isaac's Homebrew | the luck engine", e));
        });
        Hooks.on("deleteItem", (item, options) => {
            if (isWriter()) spent(item, options).catch((e) => console.error("Isaac's Homebrew | a spent Thread", e));
        });
        Hooks.on("pf2e.startTurn", (combatant) => {
            if (isWriter()) startTurn(combatant?.actor).catch((e) => console.error("Isaac's Homebrew | a Stargazer's turn", e));
        });
        DamageBus.after("The Last Thing You See", PRIORITY.riders + 8, (actor, params, before) => offerLastThing(actor, params, before));
        Hooks.on("renderChatMessageHTML", (message, html) => bindCard(message, html));
    },
};

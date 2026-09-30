import { classSlugOf } from "../lib/class-dc.mjs";
import { DamageBus, PRIORITY } from "../lib/damage-bus.mjs";
import { Relay } from "../riders/relay.mjs";
import { MODULE_ID } from "../sky/signs.mjs";

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
const THREAD = "stargazerThread";
const PORTENT = "stargazerPortent";
const IMMUNE_SLUG = "stargazer-last-thing-immune";

/** The four roll kinds, by pf2e selector. Snarl never reaches a saving throw (guide §4.3). */
const KINDS = {
    "attack-roll": "attack rolls",
    "saving-throw": "saving throws",
    "skill-check": "skill checks",
    perception: "Perception checks",
};
const GUIDE_KINDS = ["attack-roll", "saving-throw", "skill-check", "perception"];
const SNARL_KINDS = ["attack-roll", "skill-check", "perception"];

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
    /** Guide §4.4 — one creature, two from 11th. */
    chartTargets(actor) {
        return (actor?.level ?? 1) >= 11 ? 2 : 1;
    },
    chartRange(actor) {
        return has(actor, "widened-chart") ? 120 : 60;
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
export function portentEffect({ origin, value, selector }) {
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
                slug: `stargazer-portent-${origin.id}`,
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
        flags: { [MODULE_ID]: { [PORTENT]: { origin: origin.uuid } } },
    };
}

/** Why a target cannot take this Thread, or null. Shared by the picker and the GM's re-check. */
export function refusal(origin, target, { range }) {
    if (!target) return "no such creature";
    if ((target.attributes?.immunities ?? []).some((i) => i.type === "prediction")) return `${target.name} is immune to prediction`;
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

async function pickThreads(actor, { free, chart }) {
    const creatures = targeted();
    const max = chart ? Numbers.chartTargets(actor) : Numbers.threadTargets(actor);
    const name = chart ? "Chart the Course" : "Fortune's Thread";
    if (creatures.length === 0) return ui.notifications.warn(`${name}: target the creatures first.`);
    if (creatures.length > max) return ui.notifications.warn(`${name}: at most ${max} creature${max > 1 ? "s" : ""}.`);
    if (!free && reactionsLeft(actor) <= 0) return ui.notifications.warn(`${name}: no reaction left this round.`);

    const twinFates = !chart && has(actor, "twin-fates") && twinFatesReady(actor);
    const rows = creatures.map((c, i) => `
        <div class="form-group"><label>${c.name}</label>
            <select name="kind${i}"><option value="guide">Guide</option><option value="snarl">Snarl</option></select>
            ${chart ? "" : `<select name="on${i}"><option value="any">its next eligible roll</option>${
                Object.entries(KINDS).map(([k, v]) => `<option value="${k}">its next ${v.replace(/s$/, "")}</option>`).join("")}</select>`}
            ${twinFates ? `<label><input type="checkbox" name="twice${i}"> Twin Fates</label>` : ""}
        </div>`).join("");
    const data = await form(name, `<p>${chart
        ? "The first time each rolls a d20 before the start of your next turn, this Thread is spent on it — no reaction."
        : "Spent by the first matching roll; the reaction goes then."}</p>${rows}`);
    if (!data) return;

    const entries = creatures.map((c, i) => ({ target: c.uuid, kind: data[`kind${i}`], on: data[`on${i}`] ?? "any", twice: Boolean(data[`twice${i}`]) }));
    if (entries.filter((e) => e.twice).length > 2) return ui.notifications.warn("Twin Fates: up to two of the Thread's targets.");
    await Relay.request({ action: "stargazerArm", origin: actor.uuid, entries, chart: Boolean(chart), free: Boolean(free) });
}

async function pickPortent(actor) {
    const s = state(actor);
    if (typeof s.portent?.value !== "number") return ui.notifications.warn("Speak the Portent: you have no Portent. It is rolled at your Night Vigil.");
    const [target] = targeted();
    if (!target || targeted().length > 1) return ui.notifications.warn("Speak the Portent: target exactly one creature.");
    const data = await form("Speak the Portent", `<p>Your Portent is <strong>${s.portent.value}</strong>. The next roll of this kind ${target.name} makes <em>is</em> your Portent.</p>
        <div class="form-group"><label>Roll</label><select name="on">
            <option value="attack-roll">attack roll</option><option value="saving-throw">saving throw</option><option value="skill-check">skill check</option>
        </select></div>`);
    if (!data) return;
    await Relay.request({ action: "stargazerPortent", origin: actor.uuid, target: target.uuid, on: data.on });
}

function twinFatesReady(actor) {
    const at = state(actor).twinFatesAt;
    return typeof at !== "number" || (game.time.worldTime - at) >= 600;
}

/* ------------------------------------------------------------------------------------------------ */
/*  The GM's half                                                                                   */
/* ------------------------------------------------------------------------------------------------ */

async function arm({ origin: originUuid, entries = [], chart, free }) {
    const origin = await fromUuid(originUuid);
    if (!isStargazer(origin)) return;
    const name = chart ? "Chart the Course" : "Fortune's Thread";
    const max = chart ? Numbers.chartTargets(origin) : Numbers.threadTargets(origin);
    const range = chart ? Numbers.chartRange(origin) : Numbers.threadRange(origin);
    const isFree = Boolean(chart || free);
    if (entries.length === 0 || entries.length > max) return;
    if (!isFree && reactionsLeft(origin) <= 0) return say(origin, `<strong>${name}</strong>: no reaction left this round.`);

    const twice = entries.filter((e) => e.twice);
    if (twice.length > 0 && (chart || twice.length > 2 || !has(origin, "twin-fates") || !twinFatesReady(origin))) return;

    // Chart the Course: only one active at a time — the last one's Threads go.
    if (chart) await sweep(origin, (flag) => flag.free);

    const group = foundry.utils.randomID();
    const value = Numbers.threadValue(origin);
    const armed = [];
    for (const entry of entries) {
        const target = (await fromUuid(entry.target))?.actor ?? (await fromUuid(entry.target));
        const why = refusal(origin, target, { range });
        if (why) {
            await say(origin, `<strong>${name}</strong>: ${why}.`);
            continue;
        }
        const allowed = entry.kind === "snarl" ? SNARL_KINDS : GUIDE_KINDS;
        const kinds = entry.on && entry.on !== "any" ? [entry.on] : allowed;
        if (!kinds.every((k) => allowed.includes(k))) {
            await say(origin, `<strong>${name}</strong>: Snarl can only be applied to an attack roll, skill check or Perception check.`);
            continue;
        }
        const effect = threadEffect({ origin, group, kind: entry.kind, value, kinds, free: isFree, twice: Boolean(entry.twice) });
        await target.createEmbeddedDocuments("Item", [effect]);
        armed.push(`${entry.kind === "guide" ? "Guide" : "Snarl"} on ${target.name}${entry.twice ? " (Twin Fates)" : ""}`);
    }
    if (armed.length === 0) return;

    const update = {};
    if (!isFree) update[`flags.${MODULE_ID}.${FLAG}.pending`] = [...(state(origin).pending ?? []), group];
    if (twice.length > 0) update[`flags.${MODULE_ID}.${FLAG}.twinFatesAt`] = game.time.worldTime;
    if (Object.keys(update).length > 0) await origin.update(update);
    await say(origin, `<strong>${name}</strong>: ${armed.join("; ")}.`, { whisper: ownersOf(origin) });
}

async function speak({ origin: originUuid, target: targetUuid, on }) {
    const origin = await fromUuid(originUuid);
    if (!isStargazer(origin) || !["attack-roll", "saving-throw", "skill-check"].includes(on)) return;
    const value = state(origin).portent?.value;
    if (typeof value !== "number") return;
    const target = (await fromUuid(targetUuid))?.actor ?? (await fromUuid(targetUuid));
    const why = refusal(origin, target, { range: 60 });
    if (why) return say(origin, `<strong>Speak the Portent</strong>: ${why}.`);
    // One Portent, one place: speaking it again moves it.
    await sweepPortent(origin);
    await target.createEmbeddedDocuments("Item", [portentEffect({ origin, value, selector: on })]);
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

async function sweepPortent(origin) {
    for (const actor of game.actors) {
        const ours = actor.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.[PORTENT]?.origin === origin.uuid);
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
        await origin.update({ [`flags.${MODULE_ID}.${FLAG}.portent`]: { value: null, spent: true } });
        return say(origin, `<strong>Portent</strong> spoken on ${item.actor?.name}.`, { whisper: ownersOf(origin) });
    }
    if (thread.free) return;
    const pending = state(origin).pending ?? [];
    if (!pending.includes(thread.group)) return; // this group already cost its reaction
    await origin.update({
        [`flags.${MODULE_ID}.${FLAG}.pending`]: pending.filter((g) => g !== thread.group),
        [`flags.${MODULE_ID}.${FLAG}.spent`]: inCombat(origin) ? (state(origin).spent ?? 0) + 1 : 0,
    });
}

/** The start of the Stargazer's turn: the reaction comes back and every Thread still armed expires. */
async function startTurn(actor) {
    if (!isStargazer(actor)) return;
    await sweep(actor);
    await actor.update({ [`flags.${MODULE_ID}.${FLAG}.pending`]: [], [`flags.${MODULE_ID}.${FLAG}.spent`]: 0 });
}

/* ------------------------------------------------------------------------------------------------ */
/*  The Portent, rolled at the Vigil                                                                */
/* ------------------------------------------------------------------------------------------------ */

/** Guide §4.5: at the Night Vigil, roll a d20 and record it. A new Vigil overwrites an unspent Portent. */
export async function rollPortent(actor) {
    if (!isStargazer(actor) || !has(actor, "portent")) return null;
    const roll = await new Roll("1d20").evaluate();
    // The old Portent may be armed on a creature this client cannot write to; the GM takes it back.
    await Relay.request({ action: "stargazerSweepPortent", origin: actor.uuid });
    await actor.update({ [`flags.${MODULE_ID}.${FLAG}.portent`]: { value: roll.total, spent: false } });
    await roll.toMessage({ speaker: ChatMessage.getSpeaker({ actor }), flavor: "<strong>Portent</strong> — recorded at the Night Vigil" }, { rollMode: "gmroll" });
    return roll.total;
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
    await origin.update({ [`flags.${MODULE_ID}.${FLAG}.spent`]: inCombat(origin) ? (state(origin).spent ?? 0) + 1 : 0 });

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
    const run = {
        "fortunes-thread": () => pickThreads(actor, { free: false, chart: false }),
        "chart-the-course": () => pickThreads(actor, { free: true, chart: true }),
        "portent": () => pickPortent(actor),
    }[item.slug];
    if (run) await run();
}

export const Threads = {
    rollPortent,
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
        Hooks.on("pf2e.restForTheNight", (actor) => {
            // The Night Vigil runs at rest (guide §11.7). Phase 3 grows the rest of the Vigil around this.
            if (actor?.isOwner && isStargazer(actor)) rollPortent(actor).catch((e) => console.error("Isaac's Homebrew | the Portent", e));
        });
        DamageBus.after("The Last Thing You See", PRIORITY.riders + 8, (actor, params, before) => offerLastThing(actor, params, before));
        Hooks.on("renderChatMessageHTML", (message, html) => bindCard(message, html));
    },
};

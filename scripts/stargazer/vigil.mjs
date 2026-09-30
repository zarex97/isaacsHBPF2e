import { Relay } from "../riders/relay.mjs";
import { MODULE_ID, aspectOf, signOf } from "../sky/signs.mjs";
import { SkyTracker } from "../sky/tracker.mjs";
import { SIGN_AUGURY } from "./auguries.mjs";
import { isStargazer, rollPortent, setPortent } from "./threads.mjs";

/**
 * The Night Vigil — Stargazer guide §4.2, §4.12, and the build ruling in §11.7.
 *
 * It runs by itself at *Rest for the Night*, on the resting player's client, and whispers one card: today's
 * sign and aspect exactly (*Certainty*), the next three days from the tracker's pre-rolled queue (*the
 * Forecast* — the same answer however often it is asked, because the queue is fixed), and the Portent. The
 * card carries the two things the player decides afterwards: **Forewarned**, which names up to five allies,
 * and at 13th **Trade the Day**, which swaps today's aspect with one of the forecast's.
 *
 * A **clouded** night — the GM's toggle on the tracker — reads nothing at all: no certainty, no forecast, no
 * Portent, no Forewarned (*Clouded Sky*). *Sky Anchor* (6th) reads it anyway.
 *
 * Forewarned is not applied here. It is a flag on each creature briefed, keyed by the sky's day, and
 * `SkyTracker.aspectFor` reads it — the same place *Shelter of the Cloth* softens the day — so the effect a
 * creature wears is simply the milder one, and it lapses when the GM advances the sky.
 */

const FLAG = "stargazer";
const has = (actor, slug) => (actor?.itemTypes?.feat ?? []).some((f) => f.slug === slug);
const state = (actor) => actor?.flags?.[MODULE_ID]?.[FLAG] ?? {};

function ownersOf(actor) {
    return game.users.filter((u) => actor.testUserPermission(u, "OWNER")).map((u) => u.id);
}

async function whisper(actor, html, flags = {}) {
    return ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        whisper: ownersOf(actor),
        content: html,
        flags: { [MODULE_ID]: flags },
    });
}

const describe = (sign, aspect) => `${signOf(sign).glyph} <strong>${signOf(sign).label}</strong>, ${aspectOf(aspect).label}`;

/** How many allies Forewarned may brief (guide §4.2); Wide Vigil (10th) lifts the limit. */
export function forewarnLimit(actor) {
    return has(actor, "wide-vigil") ? Infinity : 5;
}

/** Forewarned or, from Constellation Mastery, Foreordained (guide §4.12). */
export function forewarnMode(actor) {
    return has(actor, "constellation-mastery") ? "benefic" : "milder";
}

/** Guide §4.2 / §6.3: three days of forecast, seven with the Ephemeris's The Almanac. */
export function forecastDays(actor) {
    return has(actor, "the-almanac") ? 7 : 3;
}

/**
 * The Augury of the Day (§4.2, §5.3): the ascendant sign's Augury, added to the repertoire until the next
 * daily preparations. Yesterday's goes first, whatever tonight brings. Nothing is granted on a Starless or
 * clouded night, or when the Augury is already known permanently — "a spare Focus Point's worth of nothing,
 * which is the price of a guarantee." Returns the name granted, or null.
 */
export async function grantAuguryOfTheDay(actor, name, day) {
    const old = actor.itemTypes.spell.filter((s) => s.flags?.[MODULE_ID]?.auguryOfTheDay);
    if (old.length > 0) await actor.deleteEmbeddedDocuments("Item", old.map((s) => s.id));
    if (!name) return null;
    if (actor.itemTypes.spell.some((s) => s.name === name)) return null;
    const pack = game.packs.get(`${MODULE_ID}.stargazer-auguries`);
    const entry = (await pack?.getIndex())?.find((e) => e.name === name);
    if (!entry) return null;
    const source = foundry.utils.deepClone((await pack.getDocument(entry._id)).toObject());
    source.flags = foundry.utils.mergeObject(source.flags ?? {}, { [MODULE_ID]: { auguryOfTheDay: { day } } });
    await actor.createEmbeddedDocuments("Item", [source]);
    return name;
}

export async function runVigil(actor) {
    if (!isStargazer(actor) || !has(actor, "night-vigil")) return;
    const sky = SkyTracker.state;
    const clouded = Boolean(sky.clouded) && !has(actor, "sky-anchor");
    await actor.update({ [`flags.${MODULE_ID}.${FLAG}.vigil`]: { day: sky.day, clouded, forewarned: false, traded: false } });

    if (clouded) {
        await grantAuguryOfTheDay(actor, null, sky.day);
        return whisper(actor, `<p><strong>Night Vigil — Clouded Sky.</strong> You learn nothing, gain no Augury of the Day, get no forecast, and cannot use Forewarned. You are as blind as everybody else.</p>`);
    }

    const forecast = SkyTracker.forecast(forecastDays(actor));
    const starless = sky.sign === "starless";
    const lines = [
        `<p><strong>Night Vigil</strong> — Day ${sky.day}.</p>`,
        `<p><strong>Certainty.</strong> Today: ${describe(sky.sign, sky.aspect)}.</p>`,
        `<p><strong>The Forecast.</strong></p><ol>${forecast.map((d) => `<li>Day ${d.day}: ${d.sign.glyph} ${d.sign.label}, ${d.aspect.label}</li>`).join("")}</ol>`,
    ];

    const granted = await grantAuguryOfTheDay(actor, SIGN_AUGURY[sky.sign] ?? null, sky.day);
    if (granted) lines.push(`<p><strong>Augury of the Day.</strong> <em>${granted}</em>, until your next daily preparations.</p>`);
    else if (SIGN_AUGURY[sky.sign]) lines.push(`<p><strong>Augury of the Day.</strong> <em>${SIGN_AUGURY[sky.sign]}</em> — you already know it.</p>`);
    if (starless && has(actor, "constellation-mastery")) {
        lines.push("<p><strong>Starless.</strong> Choose any sign's Augury as your Augury of the Day:</p>",
            ...Object.values(SIGN_AUGURY).map((n) => `<button type="button" data-stargazer="day-augury" data-name="${n}">${n}</button>`));
    }

    let portents = null;
    if (has(actor, "portent")) {
        if (starless) {
            // "Nothing is written, so you may roll your Portent twice and keep either result."
            const rolls = await Promise.all([new Roll("1d20").evaluate(), new Roll("1d20").evaluate()]);
            portents = rolls.map((r) => r.total);
            lines.push(`<p><strong>Starless.</strong> Nothing is written: your Portent rolled <strong>${portents[0]}</strong> and <strong>${portents[1]}</strong>. Keep either.</p>`,
                ...portents.map((v) => `<button type="button" data-stargazer="keep-portent" data-value="${v}">Keep ${v}</button>`));
        } else {
            await rollPortent(actor);
        }
    }

    const limit = forewarnLimit(actor);
    lines.push(`<hr /><button type="button" data-stargazer="forewarn">${forewarnMode(actor) === "benefic" ? "Foreordained" : "Forewarned"}: brief ${Number.isFinite(limit) ? `up to ${limit}` : "any number of"} allies</button>`);
    if (has(actor, "constellation-mastery")) {
        lines.push(`<p><strong>Trade the Day.</strong> Swap today's aspect with one of these; the signs do not move.</p>`,
            ...forecast.slice(0, 3).map((d) => `<button type="button" data-stargazer="trade" data-days="${d.in}">Day ${d.day} (${d.aspect.label})</button>`));
    }
    return whisper(actor, lines.join(""), { vigilCard: { origin: actor.uuid, day: sky.day, portents } });
}

/* ------------------------------------------------------------------------------------------------ */
/*  The card's buttons                                                                              */
/* ------------------------------------------------------------------------------------------------ */

async function pickAllies(actor) {
    const limit = forewarnLimit(actor);
    const scene = game.scenes?.active;
    const candidates = new Map();
    for (const token of scene?.tokens ?? []) {
        const a = token.actor;
        if (a && a.id !== actor.id && a.type === "character") candidates.set(a.id, a);
    }
    for (const a of game.actors) if (a.hasPlayerOwner && a.type === "character" && a.id !== actor.id) candidates.set(a.id, a);
    const rows = [...candidates.values()].map((a) => `<label style="display:block"><input type="checkbox" name="${a.uuid}"> ${a.name}</label>`).join("");
    const data = await foundry.applications.api.DialogV2.prompt({
        window: { title: forewarnMode(actor) === "benefic" ? "Foreordained" : "Forewarned" },
        content: `<p>You and each ally who listens ${forewarnMode(actor) === "benefic" ? "treat a negative aspect as Benefic" : "take today's negative aspect one step milder"} for the rest of the day. ${Number.isFinite(limit) ? `Up to ${limit} allies.` : ""}</p>${rows}`,
        rejectClose: false,
        ok: { label: "Brief them", callback: (_e, button) => new foundry.applications.ux.FormDataExtended(button.form).object },
    });
    if (!data) return null;
    return Object.entries(data).filter(([, v]) => v).map(([uuid]) => uuid);
}

function bindCard(message, html) {
    const card = message.flags?.[MODULE_ID]?.vigilCard;
    if (!card) return;
    for (const button of html.querySelectorAll?.("button[data-stargazer]") ?? []) {
        button.addEventListener("click", async () => {
            const actor = await fromUuid(card.origin);
            if (!actor?.isOwner) return;
            const kind = button.dataset.stargazer;
            if (kind === "keep-portent") {
                const value = Number(button.dataset.value);
                if (!card.portents?.includes(value) || state(actor).vigil?.day !== card.day) return;
                await setPortent(actor, value);
                ui.notifications.info(`Portent: ${value}.`);
                for (const b of html.querySelectorAll('button[data-stargazer="keep-portent"]')) b.disabled = true;
            } else if (kind === "day-augury") {
                const name = button.dataset.name;
                if (!Object.values(SIGN_AUGURY).includes(name) || state(actor).vigil?.day !== card.day) return;
                if (!has(actor, "constellation-mastery") || SkyTracker.state.sign !== "starless") return;
                await grantAuguryOfTheDay(actor, name, card.day);
                ui.notifications.info(`Augury of the Day: ${name}.`);
                for (const b of html.querySelectorAll('button[data-stargazer="day-augury"]')) b.disabled = true;
            } else if (kind === "forewarn") {
                const allies = await pickAllies(actor);
                if (allies) await Relay.request({ action: "stargazerForewarn", origin: actor.uuid, allies, day: card.day });
            } else if (kind === "trade") {
                await Relay.request({ action: "stargazerTrade", origin: actor.uuid, days: Number(button.dataset.days), day: card.day });
            }
        });
    }
}

/* ------------------------------------------------------------------------------------------------ */
/*  The GM's half                                                                                   */
/* ------------------------------------------------------------------------------------------------ */

/** Is today's Vigil still good for this — made today, and not under a clouded sky? */
function vigilToday(actor, day) {
    const vigil = state(actor).vigil;
    return vigil && vigil.day === day && day === SkyTracker.state.day && !vigil.clouded ? vigil : null;
}

async function forewarn({ origin, allies = [], day }) {
    const actor = await fromUuid(origin);
    const vigil = isStargazer(actor) ? vigilToday(actor, day) : null;
    if (!vigil) return;
    if (vigil.forewarned) return whisper(actor, "<p><strong>Forewarned</strong>: you have already briefed the party today.</p>");
    const limit = forewarnLimit(actor);
    const listeners = [];
    for (const uuid of allies.slice(0, Number.isFinite(limit) ? limit : allies.length)) {
        const ally = await fromUuid(uuid);
        if (ally && ally.id !== actor.id) listeners.push(ally);
    }
    const mode = forewarnMode(actor);
    for (const creature of [actor, ...listeners]) {
        await creature.update({ [`flags.${MODULE_ID}.forewarned`]: { day, mode, by: actor.uuid } });
        await SkyTracker.applyTo(creature);
    }
    await actor.update({ [`flags.${MODULE_ID}.${FLAG}.vigil.forewarned`]: true });
    await whisper(actor, `<p><strong>${mode === "benefic" ? "Foreordained" : "Forewarned"}</strong>: ${[actor, ...listeners].map((c) => c.name).join(", ")}.</p>`);
}

async function trade({ origin, days, day }) {
    const actor = await fromUuid(origin);
    const vigil = isStargazer(actor) && has(actor, "constellation-mastery") ? vigilToday(actor, day) : null;
    if (!vigil || vigil.traded || !(days >= 1 && days <= 3)) return;
    const before = SkyTracker.state.aspect;
    const swapped = await SkyTracker.swapAspects(days);
    if (!swapped) return whisper(actor, "<p><strong>Trade the Day</strong>: that day cannot move — a scheduled Zenith is the GM's, not the sky's.</p>");
    await actor.update({ [`flags.${MODULE_ID}.${FLAG}.vigil.traded`]: true });
    await whisper(actor, `<p><strong>Trade the Day</strong>: today is now ${aspectOf(SkyTracker.state.aspect).label}; ${aspectOf(before).label} is still coming, ${days} day${days === 1 ? "" : "s"} from now.</p>`);
}

export const Vigil = {
    runVigil,
    registerHooks() {
        Relay.register?.("stargazerForewarn", forewarn);
        Relay.register?.("stargazerTrade", trade);
        Hooks.on("pf2e.restForTheNight", (actor) => {
            if (actor?.isOwner && isStargazer(actor)) runVigil(actor).catch((e) => console.error("Isaac's Homebrew | the Night Vigil", e));
        });
        Hooks.on("renderChatMessageHTML", (message, html) => bindCard(message, html));
    },
};

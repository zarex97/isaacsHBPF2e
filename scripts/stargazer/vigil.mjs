import { Relay } from "../riders/relay.mjs";
import { MODULE_ID, aspectOf, signOf } from "../sky/signs.mjs";
import { SkyTracker } from "../sky/tracker.mjs";
import { SIGN_AUGURY } from "./auguries.mjs";
import { readPastDay } from "./paths.mjs";
import { isStargazer, portentsOf, rollPortents, setPortentValue } from "./threads.mjs";

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

/** Guide §4.2, §7: the Vigil takes 10 minutes, 1 with Sky Reader. */
export function vigilMinutes(actor) {
    return has(actor, "sky-reader") ? 1 : 10;
}

/** Guide §7: briefing the party takes 10 minutes, 1 with Sky Reader or Wide Vigil. */
export function briefingMinutes(actor) {
    return has(actor, "sky-reader") || has(actor, "wide-vigil") ? 1 : 10;
}

const minutes = (n) => `${n} minute${n === 1 ? "" : "s"}`;

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
    const [granted] = await grantAuguriesOfTheDay(actor, name ? [name] : [], day);
    return granted ?? null;
}

/**
 * Several Auguries of the Day at once — *Two Skies* (§7, 18th) gives both signs' — replacing yesterday's.
 * Each is skipped when it is already known. Returns the names granted.
 */
export async function grantAuguriesOfTheDay(actor, names, day) {
    const old = actor.itemTypes.spell.filter((s) => s.flags?.[MODULE_ID]?.auguryOfTheDay);
    if (old.length > 0) await actor.deleteEmbeddedDocuments("Item", old.map((s) => s.id));
    const pack = game.packs.get(`${MODULE_ID}.stargazer-auguries`);
    const index = (await pack?.getIndex()) ?? [];
    const granted = [];
    for (const name of [...new Set(names.filter(Boolean))]) {
        if (actor.itemTypes.spell.some((s) => s.name === name)) continue;
        const entry = index.find((e) => e.name === name);
        if (!entry) continue;
        const source = foundry.utils.deepClone((await pack.getDocument(entry._id)).toObject());
        source.flags = foundry.utils.mergeObject(source.flags ?? {}, { [MODULE_ID]: { auguryOfTheDay: { day } } });
        await actor.createEmbeddedDocuments("Item", [source]);
        granted.push(name);
    }
    return granted;
}

/** Private Sign's Augury, by name, from the choice the feat recorded. */
function privateAugury(actor) {
    const own = SkyTracker.privateSignOf(actor);
    return own?.augury ? fromUuidSync(own.augury)?.name ?? null : null;
}

/**
 * The day's Auguries for this Stargazer: the sign's, the second sign's with Two Skies, and on a Starless day
 * a Private Sign's. `tomorrow` is Doubled Reading's: tomorrow's sign read in place of today's.
 */
export function dayAuguries(actor, sky, { tomorrow = false } = {}) {
    const first = tomorrow ? sky.queue?.[0]?.sign : sky.sign;
    const names = [SIGN_AUGURY[first] ?? null];
    if (has(actor, "two-skies") && sky.second?.sign) names.push(SIGN_AUGURY[sky.second.sign] ?? null);
    if (sky.sign === "starless" && has(actor, "private-sign")) names.push(privateAugury(actor));
    return names.filter(Boolean);
}

export async function runVigil(actor, { borrowed = false } = {}) {
    if (!isStargazer(actor) || !has(actor, "night-vigil")) return;
    const sky = SkyTracker.state;
    // Rewrite the Ending (§10.3): a dark chart reads nothing, until the GM marks a Vigil as the full eight
    // hours under open sky.
    if (state(actor).dark) {
        return ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            whisper: [...new Set([...ownersOf(actor), ...game.users.filter((u) => u.isGM).map((u) => u.id)])],
            content: `<p><strong>Night Vigil</strong> — your Star Chart is dark. Nothing is read, and nothing comes back, until a full eight-hour Night Vigil under open sky.</p><button type="button" data-stargazer-gm="relight">GM: this was the full eight hours under open sky</button>`,
            flags: { [MODULE_ID]: { relightCard: { origin: actor.uuid, used: false } } },
        });
    }
    // Unmake the Moment recharges on the Night Vigil (§4.11).
    if ((state(actor).unmakeUsed ?? 0) > 0) await actor.update({ [`flags.${MODULE_ID}.${FLAG}.unmakeUsed`]: 0 });
    // Borrowed Eyes (§7, 4th): read through a familiar or ally under an open sky — the GM's allowance, below.
    const clouded = Boolean(sky.clouded) && !has(actor, "sky-anchor") && !borrowed;
    await actor.update({ [`flags.${MODULE_ID}.${FLAG}.vigil`]: { day: sky.day, clouded, forewarned: false, traded: false } });
    // Star-Marked Enemy lasts "until your next daily preparations"; the mark may be on a creature only the GM can write.
    if (has(actor, "star-marked-enemy")) await Relay.request({ action: "stargazerClearMarks", origin: actor.uuid });

    if (clouded) {
        await grantAuguryOfTheDay(actor, null, sky.day);
        const eyes = has(actor, "borrowed-eyes")
            ? `<p><button type="button" data-stargazer="borrowed-eyes">Borrowed Eyes: ask to read through your familiar or an ally</button></p>`
            : "";
        return whisper(actor, `<p><strong>Night Vigil — Clouded Sky.</strong> You learn nothing, gain no Augury of the Day, get no forecast, and cannot use Forewarned. You are as blind as everybody else.</p>${eyes}`,
            { vigilCard: { origin: actor.uuid, day: sky.day, clouded: true } });
    }

    const forecast = SkyTracker.forecast(forecastDays(actor));
    const starless = sky.sign === "starless";
    const lines = [
        `<p><strong>Night Vigil</strong> — Day ${sky.day}. (${minutes(vigilMinutes(actor))})${borrowed ? " Read through borrowed eyes." : ""}</p>`,
        `<p><strong>Certainty.</strong> Today: ${describe(sky.sign, sky.aspect)}.</p>`,
    ];
    // Two Skies: the second sky, pre-rolled with the day (R7).
    if (has(actor, "two-skies") && sky.second?.sign) lines.push(`<p><strong>Two Skies.</strong> Also up, for you and whoever you brief: ${describe(sky.second.sign, sky.second.aspect)}.</p>`);
    // Private Sign: on a Starless day, your own sign rises over you.
    const own = starless ? SkyTracker.privateSignOf(actor) : null;
    if (own?.domain && sky.privateAspect) lines.push(`<p><strong>Private Sign.</strong> Nothing is written for anyone else; your own sign rises, governing ${signOf(own.domain).label}'s domain, ${aspectOf(sky.privateAspect).label}.</p>`);
    const twoSkies = has(actor, "two-skies");
    lines.push(`<p><strong>The Forecast.</strong></p><ol>${forecast.map((d) => `<li>Day ${d.day}: ${d.sign.glyph} ${d.sign.label}, ${d.aspect.label}${twoSkies && d.second ? `; and ${d.second.sign.glyph} ${d.second.sign.label}, ${d.second.aspect.label}` : ""}</li>`).join("")}</ol>`);

    const auguries = dayAuguries(actor, sky);
    const granted = await grantAuguriesOfTheDay(actor, auguries, sky.day);
    for (const name of auguries) {
        const known = actor.itemTypes.spell.some((s) => s.name === name && !s.flags?.[MODULE_ID]?.auguryOfTheDay);
        lines.push(granted.includes(name)
            ? `<p><strong>Augury of the Day.</strong> <em>${name}</em>, until your next daily preparations.</p>`
            : known
                ? `<p><strong>Augury of the Day.</strong> <em>${name}</em> — you already know it.</p>`
                : `<p><strong>Augury of the Day.</strong> <em>${name}</em> is not in the Auguries compendium yet.</p>`);
    }
    if (starless && has(actor, "constellation-mastery")) {
        lines.push("<p><strong>Starless.</strong> Choose any sign's Augury as your Augury of the Day:</p>",
            ...Object.values(SIGN_AUGURY).map((n) => `<button type="button" data-stargazer="day-augury" data-name="${n}">${n}</button>`));
    }
    // Doubled Reading (§7, 8th): once per day, take the better of today's Augury and tomorrow's.
    const doubled = actor.itemTypes.feat.find((f) => f.slug === "doubled-reading");
    const tomorrow = SIGN_AUGURY[sky.queue?.[0]?.sign] ?? null;
    if (doubled && (doubled.system.frequency?.value ?? 0) > 0 && tomorrow && tomorrow !== auguries[0]) {
        lines.push(`<p><button type="button" data-stargazer="doubled-reading">Doubled Reading: take tomorrow's <em>${tomorrow}</em> instead${auguries[0] ? ` of <em>${auguries[0]}</em>` : ""}</button></p>`);
    }

    let portentChoices = null;
    if (has(actor, "portent")) {
        // "Nothing is written, so you may roll your Portent twice and keep either result" — each of them.
        const slots = await rollPortents(actor, { times: starless ? 2 : 1 });
        const shown = slots.map((s) => (s.fixed ? `<strong>20</strong> (Fixed Sky${s.spent ? ", spoken this week" : ""})` : `<strong>${s.value}</strong>`));
        lines.push(`<p><strong>Portent${slots.length > 1 ? "s" : ""}.</strong> ${shown.join(", ")}.</p>`);
        portentChoices = Object.fromEntries(slots.filter((s) => s.options).map((s) => [s.id, s.options]));
        if (starless) {
            for (const slot of slots.filter((s) => (s.options ?? []).length > 1)) {
                lines.push(`<p>Starless: nothing is written. Keep ${slot.options.map((v) => `<button type="button" data-stargazer="keep-portent" data-slot="${slot.id}" data-value="${v}">${v}</button>`).join(" or ")}</p>`);
            }
        }
        const sign = actor.itemTypes.feat.find((f) => f.slug === "astrological-sign");
        if (sign && (sign.system.frequency?.value ?? 0) > 0) lines.push(`<p><button type="button" data-stargazer="astrological-sign">Astrological Sign: move a Portent up to 3</button></p>`);
    }

    if (has(actor, "prophesied-ally")) lines.push(`<p><button type="button" data-stargazer="prophesy">Prophesied Ally: choose one</button></p>`);
    if (has(actor, "star-touched-cantrip")) lines.push(`<p><button type="button" data-stargazer="swap-cantrip">Star-Touched Cantrip: swap it</button></p>`);
    if (has(actor, "the-almanac")) lines.push(`<p><button type="button" data-stargazer="almanac">The Almanac: read a past day</button></p>`);

    const limit = forewarnLimit(actor);
    lines.push(`<hr /><button type="button" data-stargazer="forewarn">${forewarnMode(actor) === "benefic" ? "Foreordained" : "Forewarned"}: brief ${Number.isFinite(limit) ? `up to ${limit}` : "any number of"} allies</button>`);
    if (has(actor, "constellation-mastery")) {
        lines.push(`<p><strong>Trade the Day.</strong> Swap today's aspect with one of these; the signs do not move.</p>`,
            ...forecast.slice(0, 3).map((d) => `<button type="button" data-stargazer="trade" data-days="${d.in}">Day ${d.day} (${d.aspect.label})</button>`));
    }
    return whisper(actor, lines.join(""), { vigilCard: { origin: actor.uuid, day: sky.day, portents: portentChoices, auguries } });
}

/* ------------------------------------------------------------------------------------------------ */
/*  The card's buttons                                                                              */
/* ------------------------------------------------------------------------------------------------ */

/** One ally, from the same candidates Forewarned offers. */
async function pickOne(actor, title, text) {
    const candidates = allyCandidates(actor);
    const data = await foundry.applications.api.DialogV2.prompt({
        window: { title },
        content: `<p>${text}</p><div class="form-group"><label>Ally</label><select name="ally">${candidates.map((a) => `<option value="${a.uuid}">${a.name}</option>`).join("")}</select></div>`,
        rejectClose: false,
        ok: { label: "Choose", callback: (_e, button) => new foundry.applications.ux.FormDataExtended(button.form).object },
    });
    return data?.ally || null;
}

/**
 * Star-Touched Cantrip: "may swap it during daily preparations". pf2e asks a ChoiceSet once, when the
 * feat is created, so the feat is made again in its own slot — its cantrip goes with it and the prompt
 * comes back.
 */
async function swapCantrip(actor) {
    const feat = actor.itemTypes.feat.find((f) => f.slug === "star-touched-cantrip");
    if (!feat) return;
    // From the compendium, not the owned copy: pf2e stores the answer in the ChoiceSet rule's own
    // `selection` and in the name, so a copy of the owned feat re-granted the same cantrip unasked (driven).
    const pack = game.packs.get(`${MODULE_ID}.stargazer-feats`);
    const entry = (await pack?.getIndex())?.find((e) => e.name === "Star-Touched Cantrip");
    const fresh = entry ? await pack.getDocument(entry._id) : null;
    if (!fresh) return;
    const source = fresh.toObject();
    source.system.location = feat.system.location;
    source._stats = { ...(source._stats ?? {}), compendiumSource: fresh.uuid };
    await feat.delete();
    await actor.createEmbeddedDocuments("Item", [source]);
}

function allyCandidates(actor) {
    const candidates = new Map();
    for (const token of game.scenes?.active?.tokens ?? []) {
        const a = token.actor;
        if (a && a.id !== actor.id && a.type === "character") candidates.set(a.id, a);
    }
    for (const a of game.actors) if (a.hasPlayerOwner && a.type === "character" && a.id !== actor.id) candidates.set(a.id, a);
    return [...candidates.values()];
}

async function pickAllies(actor) {
    const limit = forewarnLimit(actor);
    const rows = allyCandidates(actor).map((a) => `<label style="display:block"><input type="checkbox" name="${a.uuid}"> ${a.name}</label>`).join("");
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
                const slot = button.dataset.slot ?? "p1";
                if (!(card.portents?.[slot] ?? []).includes(value) || state(actor).vigil?.day !== card.day) return;
                await setPortentValue(actor, slot, value);
                ui.notifications.info(`Portent: ${value}.`);
                for (const b of html.querySelectorAll(`button[data-stargazer="keep-portent"][data-slot="${slot}"]`)) b.disabled = true;
            } else if (kind === "astrological-sign") {
                if (state(actor).vigil?.day !== card.day) return;
                if (await astrologicalSign(actor, card)) button.disabled = true;
            } else if (kind === "doubled-reading") {
                if (state(actor).vigil?.day !== card.day) return;
                const item = actor.itemTypes.feat.find((f) => f.slug === "doubled-reading");
                if (!item || (item.system.frequency?.value ?? 0) <= 0) return ui.notifications.warn("Doubled Reading: already used today.");
                await item.update({ "system.frequency.value": item.system.frequency.value - 1 });
                const names = dayAuguries(actor, SkyTracker.state, { tomorrow: true });
                const granted = await grantAuguriesOfTheDay(actor, names, card.day);
                ui.notifications.info(`Doubled Reading: ${names[0]}${granted.includes(names[0]) ? "" : " (already known)"}.`);
                button.disabled = true;
            } else if (kind === "borrowed-eyes") {
                const through = await pickOne(actor, "Borrowed Eyes", "Whose eyes, under an open sky, within a mile of you?");
                if (!through) return;
                await Relay.request({ action: "stargazerBorrowedEyes", origin: actor.uuid, through, day: card.day });
                button.disabled = true;
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
            } else if (kind === "prophesy") {
                const ally = await pickOne(actor, "Prophesied Ally", "Fortune's Thread on this ally alone costs no reaction, once per round, until your next Vigil.");
                if (!ally) return;
                await actor.update({ [`flags.${MODULE_ID}.${FLAG}.prophesied`]: { uuid: ally, day: card.day }, [`flags.${MODULE_ID}.${FLAG}.prophesiedRound`]: null });
                ui.notifications.info(`Prophesied Ally: ${fromUuidSync(ally)?.name}.`);
                button.disabled = true;
            } else if (kind === "swap-cantrip") {
                await swapCantrip(actor);
                button.disabled = true;
            } else if (kind === "almanac") {
                await readPastDay(actor);
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

/**
 * Astrological Sign (§7, 1st): once per day, when the Portents are recorded, one of them may be treated as
 * any number within 3 of what was rolled. "What was rolled" is the Vigil's die, not a value already moved.
 */
async function astrologicalSign(actor, card) {
    const item = actor.itemTypes.feat.find((f) => f.slug === "astrological-sign");
    if (!item || (item.system.frequency?.value ?? 0) <= 0) {
        ui.notifications.warn("Astrological Sign: already used today.");
        return false;
    }
    const open = portentsOf(actor).filter((p) => !p.fixed && !p.spent);
    if (open.length === 0) return false;
    const rolled = (p) => card.portents?.[p.id] ?? [p.value];
    const options = open.flatMap((p) => {
        const base = rolled(p);
        const values = new Set(base.flatMap((v) => Array.from({ length: 7 }, (_, i) => v - 3 + i)).filter((v) => v >= 1 && v <= 20));
        return [...values].sort((a, b) => a - b).map((v) => `<option value="${p.id}:${v}" ${v === p.value ? "selected" : ""}>${open.length > 1 ? `Portent ${p.id.replace("p", "")}: ` : ""}${v}</option>`);
    }).join("");
    const data = await foundry.applications.api.DialogV2.prompt({
        window: { title: "Astrological Sign" },
        content: `<p>Treat a Portent as any number within 3 of what you rolled (${open.map((p) => rolled(p).join(" or ")).join("; ")}).</p><div class="form-group"><label>Portent</label><select name="choice">${options}</select></div>`,
        rejectClose: false,
        ok: { label: "Record it", callback: (_e, button) => new foundry.applications.ux.FormDataExtended(button.form).object },
    });
    if (!data?.choice) return false;
    const [id, raw] = String(data.choice).split(":");
    const value = Number(raw);
    const portent = open.find((p) => p.id === id);
    if (!portent || !rolled(portent).some((v) => Math.abs(v - value) <= 3)) return false;
    await item.update({ "system.frequency.value": item.system.frequency.value - 1 });
    await setPortentValue(actor, id, value);
    await whisper(actor, `<p><strong>Astrological Sign</strong>: a Portent of <strong>${value}</strong>.</p>`);
    return true;
}

/** Borrowed Eyes: the GM allows the reading, and the Vigil runs as though the sky were open. */
async function borrowedEyes({ origin, through, day }) {
    const actor = await fromUuid(origin);
    const eyes = fromUuidSync(through);
    if (!isStargazer(actor) || !has(actor, "borrowed-eyes") || day !== SkyTracker.state.day) return;
    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        whisper: game.users.filter((u) => u.isGM).map((u) => u.id),
        content: `<p><strong>Borrowed Eyes</strong> — ${actor.name} asks to read tonight's sky through ${eyes?.name ?? "an ally"}'s eyes: under an open sky, within a mile.</p><button type="button" data-stargazer-gm="borrowed-eyes">Allow it</button>`,
        flags: { [MODULE_ID]: { borrowedEyes: { origin, through, day, used: false } } },
    });
}

function bindRelight(message, html) {
    const flag = message.flags?.[MODULE_ID]?.relightCard;
    const button = html.querySelector?.('button[data-stargazer-gm="relight"]');
    if (!flag || !button) return;
    if (flag.used || !game.user.isGM) button.disabled = true;
    button.addEventListener("click", async () => {
        button.disabled = true;
        if (!game.user.isGM) return;
        await message.update({ [`flags.${MODULE_ID}.relightCard.used`]: true });
        await Relay.request({ action: "stargazerRelight", origin: flag.origin });
        const actor = await fromUuid(flag.origin);
        if (actor) await runVigil(actor);
    });
}

function bindGmCard(message, html) {
    const flag = message.flags?.[MODULE_ID]?.borrowedEyes;
    const button = html.querySelector?.('button[data-stargazer-gm="borrowed-eyes"]');
    if (!flag || !button) return;
    if (flag.used || !game.user.isGM) button.disabled = true;
    button.addEventListener("click", async () => {
        button.disabled = true;
        if (!game.user.isGM || flag.day !== SkyTracker.state.day) return;
        await message.update({ [`flags.${MODULE_ID}.borrowedEyes.used`]: true });
        const actor = await fromUuid(flag.origin);
        if (actor) await runVigil(actor, { borrowed: true });
    });
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
    await whisper(actor, `<p><strong>${mode === "benefic" ? "Foreordained" : "Forewarned"}</strong>: ${[actor, ...listeners].map((c) => c.name).join(", ")}. (The briefing took ${minutes(briefingMinutes(actor))}.)</p>`);
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
        Relay.register?.("stargazerBorrowedEyes", borrowedEyes);
        Hooks.on("pf2e.restForTheNight", (actor) => {
            if (actor?.isOwner && isStargazer(actor)) runVigil(actor).catch((e) => console.error("Isaac's Homebrew | the Night Vigil", e));
        });
        Hooks.on("renderChatMessageHTML", (message, html) => {
            bindCard(message, html);
            bindGmCard(message, html);
            bindRelight(message, html);
        });
    },
};

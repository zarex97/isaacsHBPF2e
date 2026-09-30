import { ASPECTS, ASPECT_IDS, CLOTH_SIGNS, MODULE_ID, SIGN_IDS, aspectOf, signOf } from "./signs.mjs";

const SETTING = "sky";
const EFFECT_FLAG = "skyEffect";
const QUEUE_LENGTH = 7;
/** Past days kept for the Almanac and Reckoning of Days — a year and then some. */
const HISTORY_LENGTH = 400;
/** The four terrain effects, as opposed to a Saint's own Ascendant and Zenith. */
const ASPECT_EFFECT = /^Sky: (Benefic|Retrograde|Malefic|Exalted)$/;
const BLANK_ICON = "icons/magic/light/explosion-star-glow-silhouette.webp";

/** An NPC opts into the Sky by tag, the same idiom `clothOf` uses to find a Cloth. */
const TERRAIN_TAG = "sky-tracked";

/** Shelter of the Cloth: allies within 30 feet treat the aspect as one step milder. */
const SHELTER_SLUG = "shelter-of-the-cloth";
const SHELTER_FEET = 30;

/** One step milder, and the only two aspects that have a milder step. */
const MILDER = { malefic: "retrograde", retrograde: "none" };

/** Harshest to kindest, for choosing the mildest of several softenings. */
const MILDNESS = ["malefic", "retrograde", "none", "benefic"];

/** A sky effect's rules for one sign: those gated on it, and those gated on no sign at all. Pure. */
export function ownSignRules(rules, sign) {
    return rules.filter((rule) => {
        const predicate = JSON.stringify(rule?.predicate ?? []);
        return !predicate.includes("sky:sign:") || predicate.includes(`"sky:sign:${sign}"`);
    });
}

/** The application in flight for each creature, so two never overlap. See `SkyTracker.applyTo`. */
const applying = new Map();

/**
 * The sky's state and the only code that touches actors because of it.
 *
 * Everything mechanical lives in the Sky: Ascendant / Sky: Zenith effect items. This module's whole job is
 * deciding which of those 24 items belongs on which Saint, and applying or removing it. That split means a
 * GM who never opens the tracker can still drag the right effect on by hand and get identical results.
 */
export const SkyTracker = {
    get state() {
        return game.settings.get(MODULE_ID, SETTING);
    },

    get sign() {
        return signOf(this.state.sign);
    },

    get aspect() {
        return aspectOf(this.state.aspect);
    },

    get isZenith() {
        return this.state.aspect === "exalted";
    },

    /* ---------------------------------------------------------------------------------------------- */
    /*  State                                                                                          */
    /* ---------------------------------------------------------------------------------------------- */

    /** Roll a sign. All thirteen skies are equally likely, which is where the 1-in-13 Ascendant rate comes from. */
    rollSign() {
        return SIGN_IDS[Math.floor(Math.random() * SIGN_IDS.length)];
    },

    /** Roll an aspect by weight. `exalted` carries weight 10 — see the note in signs.mjs. */
    rollAspect() {
        const total = ASPECTS.reduce((sum, a) => sum + a.weight, 0);
        let roll = Math.random() * total;
        for (const aspect of ASPECTS) {
            roll -= aspect.weight;
            if (roll < 0) return aspect.id;
        }
        return "none";
    },

    /**
     * Pre-roll the next several days.
     *
     * Read the Constellation (8th level) asks what the sky does over the next three days. If that were
     * rolled on demand the answer would change every time it was asked, so the queue is rolled once and
     * stored — the future is fixed before anybody looks at it.
     */
    rollQueue(length = QUEUE_LENGTH) {
        return Array.from({ length }, () => this.rollDay());
    },

    /**
     * One day of sky, with what two Stargazer feats read beside it (guide §7; ruling R7): a **second** sign
     * and aspect for *Two Skies*, and the aspect a *Private Sign* rises with on a Starless day. Rolled with
     * the day, so the future stays fixed however often it is read.
     */
    rollDay() {
        return { sign: this.rollSign(), aspect: this.rollAspect(), ...this.rollExtras() };
    },

    rollExtras() {
        return { second: { sign: this.rollSign(), aspect: this.rollAspect() }, privateAspect: this.rollAspect() };
    },

    /** A day rolled before Two Skies existed has no second sky; it gets one the first time the GM's client looks. */
    withExtras(entry) {
        return entry?.second && entry?.privateAspect ? entry : { ...entry, ...this.rollExtras() };
    },

    /** What the sky will be over the next `days` days, for Read the Constellation and Two Skies. */
    forecast(days = 3) {
        const queue = this.state.queue ?? [];
        return queue.slice(0, days).map((entry, i) => ({
            in: i + 1,
            day: this.state.day + i + 1,
            sign: signOf(entry.sign),
            aspect: aspectOf(entry.aspect),
            second: entry.second ? { sign: signOf(entry.second.sign), aspect: aspectOf(entry.second.aspect) } : null,
            privateAspect: entry.privateAspect ? aspectOf(entry.privateAspect) : null,
        }));
    },

    /**
     * Write the sky. Keys this call does not name are kept, not dropped — the state carries more than the
     * four it began with (`scheduled`, `clouded`), and a Saint-era caller that sets only a sign must not
     * erase a Stargazer's clouded night.
     */
    async set({ sign, aspect, day, queue, scheduled, clouded, history, second, privateAspect } = {}, { announce = true } = {}) {
        if (!game.user.isGM) return;
        const current = this.state;
        const next = {
            ...current,
            day: day ?? current.day,
            sign: sign ?? current.sign,
            aspect: aspect ?? current.aspect,
            queue: queue ?? current.queue,
            scheduled: scheduled ?? current.scheduled ?? false,
            clouded: clouded ?? current.clouded ?? false,
            history: history ?? current.history ?? [],
            second: second ?? current.second ?? null,
            privateAspect: privateAspect ?? current.privateAspect ?? null,
        };
        await game.settings.set(MODULE_ID, SETTING, next);
        await this.applyToAll();
        // A Zenith day is a unit of time only this tracker can define, so it is the only thing that can
        // say when one turns over. Anything keyed to that listens here rather than polling the setting.
        Hooks.callAll(`${MODULE_ID}.skyChanged`, next, current);
        if (announce) await this.announce();
    },

    /** Advance one day, taking the next pre-rolled entry and topping the queue back up. */
    async advanceDay() {
        if (!game.user.isGM) return;
        const current = this.state;
        const queue = [...(current.queue ?? [])];
        const nextDay = this.withExtras(queue.shift() ?? this.rollDay());
        // The day that ends is kept, so a past sky can be read as well as a future one (§8.2, R7).
        const history = [...(current.history ?? []), {
            day: current.day, sign: current.sign, aspect: current.aspect,
            ...(current.second ? { second: current.second } : {}),
            ...(current.privateAspect ? { privateAspect: current.privateAspect } : {}),
        }].slice(-HISTORY_LENGTH);
        while (queue.length < QUEUE_LENGTH) {
            queue.push(this.rollDay());
        }
        // A new night is not clouded until the GM says so; a scheduled day stays marked as scheduled.
        await this.set({
            day: current.day + 1, sign: nextDay.sign, aspect: nextDay.aspect, queue: queue.map((d) => this.withExtras(d)),
            scheduled: Boolean(nextDay.scheduled), clouded: false, history,
            second: nextDay.second, privateAspect: nextDay.privateAspect,
        });
    },

    /**
     * Swap today's aspect with the aspect `days` from now — *Trade the Day* (Stargazer guide §4.12). The
     * signs do not move, and the day traded away is still coming. A **scheduled Zenith** on either side is
     * refused (§8.6): it is the GM's arc-climax button, not a thing the sky rolled.
     */
    async swapAspects(days) {
        if (!game.user.isGM) return false;
        const current = this.state;
        const queue = [...(current.queue ?? [])];
        const other = queue[days - 1];
        if (!other || days < 1) return false;
        const zenith = (aspect, scheduled) => aspect === "exalted" && scheduled;
        if (zenith(current.aspect, current.scheduled) || zenith(other.aspect, other.scheduled)) return false;
        queue[days - 1] = { ...other, aspect: current.aspect };
        await this.set({ aspect: other.aspect, queue }, { announce: false });
        return true;
    },

    /** The GM's word that tonight's sky is hidden — *Clouded Sky* (Stargazer guide §4.2). One night at a time. */
    async setClouded(clouded) {
        if (!game.user.isGM) return;
        await this.set({ clouded: Boolean(clouded) }, { announce: false });
    },

    /**
     * Pin a sign, an aspect, or both, `days` from now.
     *
     * Each axis is independently optional: an unpinned one keeps whatever the queue already rolled for that
     * day, rather than making the caller invent a value it does not care about. Pinning only the aspect is
     * the common case for terrain — "next Tuesday is Malefic, whatever is up".
     *
     * `days: 0` changes today. The announcement is suppressed when writing into the queue, because the day
     * has not changed; it is not suppressed for `days: 0`, because it has.
     *
     * Starless is schedulable here, unlike in `scheduleZenith`: a Zenith needs a Cloth to wake, but a
     * Starless day is a real sky with a real meaning ("nothing is written") and a GM may want to pin one.
     */
    async scheduleAspect({ sign = null, aspect = null, days = 0 } = {}) {
        if (!game.user.isGM) return;
        if (sign === null && aspect === null) return;
        if (sign !== null && !SIGN_IDS.includes(sign)) return;
        if (aspect !== null && !ASPECT_IDS.includes(aspect)) return;

        if (days <= 0) {
            const today = { scheduled: true };
            if (sign !== null) today.sign = sign;
            if (aspect !== null) today.aspect = aspect;
            return this.set(today);
        }

        const queue = [...(this.state.queue ?? this.rollQueue())];
        while (queue.length < days) queue.push({ sign: this.rollSign(), aspect: this.rollAspect() });
        const queued = queue[days - 1];
        // Marked as scheduled, so *Trade the Day* can tell the GM's Zenith from one the sky rolled.
        const pinned = { sign: sign ?? queued.sign, aspect: aspect ?? queued.aspect, scheduled: true };
        queue[days - 1] = pinned;
        await this.set({ queue }, { announce: false });

        const when = `in ${days} day${days === 1 ? "" : "s"}`;
        ui.notifications.info(
            aspect === "exalted" && sign !== null
                ? `${signOf(pinned.sign).label} will rise Exalted ${when}.`
                : `${signOf(pinned.sign).label}, ${aspectOf(pinned.aspect).label}, ${when}.`,
        );
        return pinned;
    },

    /**
     * Pin an Exalted day for a given sign. The arc-climax button, kept as its own name because macros,
     * journal links and the tracker UI all call it.
     *
     * Still meaningful after the reweighting: Exalted now arrives about one day in ten by chance, but a
     * climax should land on a chosen session rather than when a d10 says so.
     */
    async scheduleZenith(sign, days = 0) {
        if (!CLOTH_SIGNS.includes(sign)) return;
        return this.scheduleAspect({ sign, aspect: "exalted", days });
    },

    /* ---------------------------------------------------------------------------------------------- */
    /*  Applying boons                                                                                 */
    /* ---------------------------------------------------------------------------------------------- */

    /** Every player character with the Saint class. */
    saints() {
        return game.actors.filter(
            (actor) => actor.type === "character" && actor.class?.system?.slug === "saint",
        );
    },

    /**
     * Which Cloth a Saint wears, read off the Cloth feature's own tag rather than off a rule-element
     * selection flag. The tag travels with the item, so this keeps working if the selection is retrained or
     * the feature is granted some other way.
     */
    clothOf(actor) {
        for (const item of actor.itemTypes.feat) {
            const tags = item.system.traits?.otherTags ?? [];
            if (!tags.includes("saint-cloth")) continue;
            const signTag = tags.find((t) => t.startsWith("cloth-"));
            if (signTag) return signTag.slice("cloth-".length);
        }
        return null;
    },

    /** The pack name of a sky effect this module applied, even when it wears the blank "The Sky". */
    skyName(effect) {
        return effect.getFlag(MODULE_ID, "skyName") ?? effect.name;
    },

    /** Stargazer guide §8.4 (R6): a player owns a Stargazer character anywhere in the world. */
    hidesTheSky() {
        return game.actors.some((a) => a.type === "character" && a.hasPlayerOwner && a.class?.system?.slug === "stargazer");
    },

    /** Players who own a Stargazer — who the day is whispered to when it is not announced (§8.4). */
    stargazerPlayers() {
        const owners = new Set();
        for (const actor of game.actors) {
            if (actor.type !== "character" || actor.class?.system?.slug !== "stargazer") continue;
            for (const user of game.users) if (!user.isGM && actor.testUserPermission(user, "OWNER")) owners.add(user.id);
        }
        return [...owners];
    },

    /** The sky of a past day, if the history holds it (Stargazer guide §8.2; ruling R7). */
    recall(day) {
        return (this.state.history ?? []).find((entry) => entry.day === day) ?? null;
    },

    /** Sky effects this module put on an actor. Effects a GM applied by hand are left alone. */
    ownedEffects(actor) {
        return actor.itemTypes.effect.filter((e) => e.getFlag(MODULE_ID, EFFECT_FLAG));
    },

    /**
     * Who the Sky lands on.
     *
     * ADR-0001 makes the Sky terrain: it applies to every creature, the ogre included. Its amendment draws
     * the line where a machine can see it — guide v3 §8.4 says "track it for PCs and named NPCs only;
     * −1 on a mook is noise", and Foundry has no marker for a named NPC — so characters are automatic and
     * NPCs opt in by tag.
     *
     * Scene-scoped, not world-scoped: a world with hundreds of actors, most of them monsters in unopened
     * folders, should not carry sky effects on all of them.
     *
     * Saints are added regardless of scene, because their Ascendant and Zenith boons are a class feature
     * rather than weather — the Cloth is theirs wherever they stand.
     */
    audience() {
        const found = new Map();
        for (const token of game.scenes?.active?.tokens ?? []) {
            const actor = token.actor;
            if (!actor) continue;
            const tagged = (actor.system?.traits?.otherTags ?? []).includes(TERRAIN_TAG);
            if (actor.type === "character" || tagged) found.set(actor.id, actor);
        }
        for (const saint of this.saints()) found.set(saint.id, saint);
        return [...found.values()];
    },

    /**
     * The aspect this actor actually suffers, after the two features that exist to soften it.
     *
     * Both shipped with live rule elements and no consumer: `Unfailing Cosmo` emits
     * `saint:unfailing-cosmo` and nothing read it, and `Shelter of the Cloth` carries a 30-foot `Aura`
     * that nothing read either. The immunity used to be "implemented" only because this whole routine
     * never ran on anyone but a Saint.
     *
     * Only the negative half is softened. Nothing mitigates a kindness.
     */
    aspectFor(actor, aspect = this.state.aspect) {
        if (!MILDER[aspect]) return aspect;
        const options = actor.getRollOptions?.() ?? [];
        if (options.includes("saint:unfailing-cosmo")) return "none";
        // Softenings do not stack: a Saint's Shelter and a Stargazer's Forewarned each take the day one
        // step milder, and a creature under both gets the milder of the two, not two steps.
        const candidates = [aspect];
        if (this.isSheltered(actor)) candidates.push(MILDER[aspect]);
        const warned = this.forewarnedFor(actor);
        if (warned) candidates.push(warned === "benefic" ? "benefic" : MILDER[aspect]);
        return candidates.sort((a, b) => MILDNESS.indexOf(b) - MILDNESS.indexOf(a))[0];
    },

    /**
     * Stargazer guide §4.2 and §4.12: a creature the Stargazer briefed at today's Night Vigil. `"milder"` is
     * Forewarned (Malefic → Retrograde, Retrograde → nothing); `"benefic"` is Foreordained, from 13th.
     * Keyed by day, so it lapses on its own when the GM advances the sky.
     */
    forewarnedFor(actor) {
        const warned = actor?.flags?.[MODULE_ID]?.forewarned;
        return warned && warned.day === this.state.day ? warned.mode : null;
    },

    /** Within 30 feet of a Saint whose Cloth spills far enough to shade them. */
    isSheltered(actor) {
        const scene = game.scenes?.active;
        if (!scene) return false;
        const mine = scene.tokens.filter((t) => t.actor?.id === actor.id);
        if (mine.length === 0) return false;
        const shelters = scene.tokens.filter((t) => (t.actor?.itemTypes?.feat ?? []).some(
            (f) => (f.system?.rules ?? []).some((r) => r.key === "Aura" && r.slug === SHELTER_SLUG),
        ));
        for (const token of mine) {
            for (const shelter of shelters) {
                if (shelter.actor?.id === actor.id) continue;
                const feet = canvas?.grid?.measurePath?.([token.object?.center ?? token, shelter.object?.center ?? shelter])?.distance
                    ?? Infinity;
                if (feet <= SHELTER_FEET) return true;
            }
        }
        return false;
    },

    async applyToAll() {
        if (!game.user.isGM) return;
        const seen = new Set();
        for (const actor of this.audience()) { seen.add(actor.id); await this.applyTo(actor); }

        /**
         * Sweep anyone still wearing a sky effect who is no longer in the audience.
         *
         * Leaving the audience is not a rare case: an NPC loses its opt-in tag, a token is deleted from
         * the scene, a character walks into a different scene. `applyTo` only ever visits the audience, so
         * without this the effect is orphaned on the sheet and nothing will ever take it off — which is
         * exactly what untagging an NPC did the first time this was tested.
         */
        for (const actor of game.actors) {
            if (seen.has(actor.id)) continue;
            const ours = this.ownedEffects(actor);
            if (ours.length > 0) await actor.deleteEmbeddedDocuments("Item", ours.map((e) => e.id));
        }
    },

    /** Every sky effect this actor should be wearing right now: its pack name, and the sign it is stamped with. */
    wantedFor(actor) {
        const { sign } = this.state;
        const wanted = [];

        // The Saint's own boon: their Cloth's sign is up.
        const cloth = this.clothOf(actor);
        if (cloth && cloth === sign) {
            const tier = this.state.aspect === "exalted" ? "Zenith" : "Ascendant";
            wanted.push({ name: `Sky: ${tier} (${signOf(sign).label})`, sign });
        }

        // The terrain everyone stands in. Starless is a real sky with nothing written in it, and a Quiet
        // day has no modifier to carry, so neither produces an effect.
        const terrain = (skySign, skyAspect) => {
            const aspect = this.aspectFor(actor, skyAspect);
            if (skySign && skySign !== "starless" && aspect && aspect !== "none") wanted.push({ name: `Sky: ${aspectOf(aspect).label}`, sign: skySign });
        };
        terrain(sign, this.state.aspect);

        // Two Skies (Stargazer guide §7, 18th): the second sign is ascendant too, for the Stargazer and the
        // allies they briefed today.
        const second = this.state.second;
        if (second && second.sign !== sign && this.readsTwoSkies(actor)) terrain(second.sign, second.aspect);

        // Private Sign (§7, 16th): on a Starless day the Stargazer's own sign rises over them alone, with the
        // domain they chose and the aspect pre-rolled for the day.
        const own = sign === "starless" ? this.privateSignOf(actor) : null;
        if (own?.domain && this.state.privateAspect) terrain(own.domain, this.state.privateAspect);
        return wanted;
    },

    /** Two Skies reaches its Stargazer and whoever that Stargazer briefed today. */
    readsTwoSkies(actor) {
        const has = (a) => (a?.itemTypes?.feat ?? []).some((f) => f.slug === "two-skies");
        if (has(actor)) return true;
        const warned = actor?.flags?.[MODULE_ID]?.forewarned;
        return Boolean(warned && warned.day === this.state.day && has(fromUuidSync(warned.by ?? "")));
    },

    /** A Private Sign's two choices — the Augury it grants and the sign whose domain it governs — or null. */
    privateSignOf(actor) {
        const feat = (actor?.itemTypes?.feat ?? []).find((f) => f.slug === "private-sign");
        if (!feat) return null;
        const chosen = feat.flags?.pf2e?.rulesSelections ?? {};
        return { augury: chosen.privateAugury ?? null, domain: chosen.privateDomain ?? null };
    },

    /**
     * One application at a time per creature. The start-up `applyToAll` and a GM's first change of the sky can
     * overlap, and now that a changed sign replaces the effect rather than keeping it, two overlapping passes
     * both tried to delete the same effect — driven: *Item does not exist* on the first change after a reload.
     */
    applyTo(actor) {
        const previous = applying.get(actor.id) ?? Promise.resolve();
        const next = previous.then(() => this.applyNow(actor)).catch((error) => {
            console.error(`Isaac's Homebrew | the sky could not be applied to ${actor.name}`, error);
        });
        applying.set(actor.id, next);
        return next;
    },

    async applyNow(actor) {
        if (!game.user.isGM) return;
        const wanted = this.wantedFor(actor);
        const key = (name, skySign) => `${name}|${skySign}`;
        const wantedKeys = new Set(wanted.map((w) => key(w.name, w.sign)));

        const existing = this.ownedEffects(actor);
        // Matched by the name the pack gave it, which a blanked effect keeps in a flag — and a blanked effect
        // on a world with no Stargazer (or the reverse) is replaced, so the presentation follows the table.
        const blank = this.hidesTheSky();
        // And by the sign it was stamped with. The four terrain effects are one item each for every sign, and
        // the day's sign is stamped on as a roll option when the effect is created — so an effect kept because
        // its *name* still matched ("Sky: Benefic" two days running) carried yesterday's sign, and the terrain
        // touched yesterday's domain. Driven: Taurus → Gemini → Leo, all Benefic, and the effect still said
        // `sky:sign:taurus` on the third day.
        //
        // Two Skies and Private Sign make the sign part of the key: a creature may wear two `Sky: Benefic`
        // effects at once, one for each sign up over it.
        const fits = (e) => wantedKeys.has(key(this.skyName(e), e.getFlag(MODULE_ID, "skySign") ?? null))
            && Boolean(e.getFlag(MODULE_ID, "skyBlank")) === (blank && ASPECT_EFFECT.test(this.skyName(e)));
        const keep = existing.filter(fits);
        const remove = existing.filter((e) => !fits(e));
        if (remove.length > 0) {
            await actor.deleteEmbeddedDocuments("Item", remove.map((e) => e.id));
        }

        const held = new Set(keep.map((e) => key(this.skyName(e), e.getFlag(MODULE_ID, "skySign") ?? null)));
        const missing = wanted.filter((w) => !held.has(key(w.name, w.sign)));
        if (missing.length === 0) return;

        const pack = game.packs.get(`${MODULE_ID}.saint-effects`);
        if (!pack) return;
        const sources = [];
        for (const { name, sign: skySign } of missing) {
            const index = pack.index.find((e) => e.name === name);
            if (!index) {
                console.warn(`${MODULE_ID} | no sky effect named "${name}" in the effects pack`);
                continue;
            }
            const source = (await pack.getDocument(index._id)).toObject();
            source.flags = foundry.utils.mergeObject(source.flags ?? {}, { [MODULE_ID]: { [EFFECT_FLAG]: true, skyName: name, skySign } });
            // Stargazer guide §8.4 (ruling R6): with a Stargazer at the table the day's aspect is what the
            // Night Vigil sells, so the four terrain effects arrive as one anonymous "The Sky" — same rules,
            // no name, no description, one shared icon. A Saint's own Ascendant and Zenith keep their names.
            if (blank && ASPECT_EFFECT.test(name)) {
                source.name = "The Sky";
                source.img = BLANK_ICON;
                source.system.description = { ...(source.system.description ?? {}), value: "" };
                source.flags[MODULE_ID].skyBlank = true;
            }
            /**
             * Stamp the day's sign onto the effect on its way to the sheet.
             *
             * The four terrain effects are one item each for all twelve signs — four documents instead of
             * forty-eight — so their modifiers predicate on `sky:sign:<id>` and something has to emit it.
             * A lit Saint's Ascendant item already carries the same option; a second identical RollOption
             * is idempotent, so this is unconditional rather than guessing which kind of effect it is.
             *
             * Stamped on the source rather than set afterwards, the same reasoning as
             * `applyFullReleaseShape`: a rule added after creation misses the preparation the creation
             * itself triggers.
             */
            //
            // Only this sign's rules come along. The effect carries every sign's, each gated on
            // `sky:sign:<id>`, and a roll option is the creature's, not the effect's: under Two Skies a
            // `Sky: Benefic` for Aquarius and a `Sky: Retrograde` for Leo each lit the other's domain, and Leo
            // read +1 from the wrong effect (driven).
            source.system.rules = [
                { key: "RollOption", option: `sky:sign:${skySign}` },
                ...ownSignRules(source.system.rules ?? [], skySign),
            ];
            sources.push(source);
        }
        if (sources.length > 0) await actor.createEmbeddedDocuments("Item", sources);
    },

    /** Strip our sky effects from everyone wearing one — used when the module is disabled mid-session. */
    async clearAll() {
        if (!game.user.isGM) return;
        for (const actor of this.audience()) {
            const ours = this.ownedEffects(actor);
            if (ours.length > 0) {
                await actor.deleteEmbeddedDocuments(
                    "Item",
                    ours.map((e) => e.id),
                );
            }
        }
    },

    /* ---------------------------------------------------------------------------------------------- */
    /*  Announcements                                                                                  */
    /* ---------------------------------------------------------------------------------------------- */

    async announce() {
        if (!game.user.isGM) return;
        // Off, the day goes to the players who own a Stargazer rather than to nobody (§8.4, R6).
        const announced = game.settings.get(MODULE_ID, "announceSky");
        const whisper = announced ? [] : this.stargazerPlayers();
        if (!announced && whisper.length === 0) return;

        const sign = this.sign;
        const aspect = this.aspect;
        const lit = this.saints().filter((a) => this.clothOf(a) === this.state.sign);

        const rows = lit.map((actor) => {
            const tier = this.isZenith ? "Zenith" : "Ascendant";
            return `<li><strong>${actor.name}</strong> — ${tier} Boon</li>`;
        });

        const content = [
            `<div class="isaacs-hb-sky-message">`,
            `<h3>${sign.glyph} ${sign.label} — ${aspect.label}</h3>`,
            `<p><em>${aspect.hint}</em></p>`,
            rows.length > 0
                ? `<p>The Cloth is awake:</p><ul>${rows.join("")}</ul>`
                : `<p>No Saint's constellation is up today.</p>`,
            this.isZenith ? `<p><strong>This is a Zenith.</strong></p>` : "",
            `</div>`,
        ].join("");

        await ChatMessage.create({ content, whisper });
    },

    /* ---------------------------------------------------------------------------------------------- */
    /*  Registration                                                                                   */
    /* ---------------------------------------------------------------------------------------------- */

    registerSettings() {
        game.settings.register(MODULE_ID, SETTING, {
            name: "Sky state",
            scope: "world",
            config: false,
            type: Object,
            default: { day: 1, sign: "starless", aspect: "none", queue: [] },
            onChange: () => {
                // World settings sync to every client, so players re-render from this without a socket.
                Object.values(ui.windows ?? {})
                    .filter((app) => app.constructor?.MODULE_APP === "sky-tracker")
                    .forEach((app) => app.render());
                for (const app of foundry.applications.instances?.values() ?? []) {
                    if (app.constructor?.MODULE_APP === "sky-tracker") app.render();
                }
            },
        });

        game.settings.register(MODULE_ID, "announceSky", {
            name: "Announce the sky in chat",
            hint: "Post a chat message naming the day's sign and aspect, and which Saints are lit by it.",
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
        });

        game.settings.register(MODULE_ID, "cosmoTradition", {
            name: "Cosmo tradition",
            hint: "Which magical tradition a Saint's Techniques count as. Mirrors the Monk's qi spells, which "
                + "pick divine or occult when the first one is gained.",
            scope: "world",
            config: true,
            type: String,
            choices: { divine: "Divine", occult: "Occult", primal: "Primal", arcane: "Arcane" },
            default: "divine",
        });
    },

    /** Seed the queue on first load so a forecast is available immediately. */
    async initialise() {
        if (!game.user.isGM) return;
        const state = this.state;
        if (!state.queue || state.queue.length === 0) {
            await game.settings.set(MODULE_ID, SETTING, { ...state, queue: this.rollQueue() });
        }
        // Two Skies and Private Sign read a second sky pre-rolled with each day (R7). A world whose days were
        // rolled before that gets them now, once, rather than on a player's client that cannot write them.
        const now = this.state;
        const queue = (now.queue ?? []).map((d) => this.withExtras(d));
        const today = now.second && now.privateAspect ? {} : this.rollExtras();
        if (Object.keys(today).length > 0 || queue.some((d, i) => d !== now.queue[i])) {
            await game.settings.set(MODULE_ID, SETTING, { ...now, ...today, queue });
        }
        await this.applyToAll();
    },
};

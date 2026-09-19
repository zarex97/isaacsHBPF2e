import { ASPECTS, ASPECT_IDS, CLOTH_SIGNS, MODULE_ID, SIGN_IDS, aspectOf, signOf } from "./signs.mjs";

const SETTING = "sky";
const EFFECT_FLAG = "skyEffect";
const QUEUE_LENGTH = 7;

/** An NPC opts into the Sky by tag, the same idiom `clothOf` uses to find a Cloth. */
const TERRAIN_TAG = "sky-tracked";

/** Shelter of the Cloth: allies within 30 feet treat the aspect as one step milder. */
const SHELTER_SLUG = "shelter-of-the-cloth";
const SHELTER_FEET = 30;

/** One step milder, and the only two aspects that have a milder step. */
const MILDER = { malefic: "retrograde", retrograde: "none" };

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
        return Array.from({ length }, () => ({ sign: this.rollSign(), aspect: this.rollAspect() }));
    },

    /** What the sky will be over the next `days` days, for Read the Constellation and Two Skies. */
    forecast(days = 3) {
        const queue = this.state.queue ?? [];
        return queue.slice(0, days).map((entry, i) => ({
            in: i + 1,
            day: this.state.day + i + 1,
            sign: signOf(entry.sign),
            aspect: aspectOf(entry.aspect),
        }));
    },

    async set({ sign, aspect, day, queue } = {}, { announce = true } = {}) {
        if (!game.user.isGM) return;
        const current = this.state;
        const next = {
            day: day ?? current.day,
            sign: sign ?? current.sign,
            aspect: aspect ?? current.aspect,
            queue: queue ?? current.queue,
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
        const nextDay = queue.shift() ?? { sign: this.rollSign(), aspect: this.rollAspect() };
        while (queue.length < QUEUE_LENGTH) {
            queue.push({ sign: this.rollSign(), aspect: this.rollAspect() });
        }
        await this.set({ day: current.day + 1, sign: nextDay.sign, aspect: nextDay.aspect, queue });
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
            const today = {};
            if (sign !== null) today.sign = sign;
            if (aspect !== null) today.aspect = aspect;
            return this.set(today);
        }

        const queue = [...(this.state.queue ?? this.rollQueue())];
        while (queue.length < days) queue.push({ sign: this.rollSign(), aspect: this.rollAspect() });
        const queued = queue[days - 1];
        const pinned = { sign: sign ?? queued.sign, aspect: aspect ?? queued.aspect };
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
    aspectFor(actor) {
        const { aspect } = this.state;
        if (!MILDER[aspect]) return aspect;
        const options = actor.getRollOptions?.() ?? [];
        if (options.includes("saint:unfailing-cosmo")) return "none";
        return this.isSheltered(actor) ? MILDER[aspect] : aspect;
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

    /** Every sky effect this actor should be wearing right now, by name. */
    wantedFor(actor) {
        const { sign } = this.state;
        const wanted = [];

        // The Saint's own boon: their Cloth's sign is up.
        const cloth = this.clothOf(actor);
        if (cloth && cloth === sign) {
            const tier = this.state.aspect === "exalted" ? "Zenith" : "Ascendant";
            wanted.push(`Sky: ${tier} (${signOf(sign).label})`);
        }

        // The terrain everyone stands in. Starless is a real sky with nothing written in it, and a Quiet
        // day has no modifier to carry, so neither produces an effect.
        const aspect = this.aspectFor(actor);
        if (sign !== "starless" && aspect !== "none") wanted.push(`Sky: ${aspectOf(aspect).label}`);
        return wanted;
    },

    async applyTo(actor) {
        if (!game.user.isGM) return;
        const wanted = new Set(this.wantedFor(actor));

        const existing = this.ownedEffects(actor);
        const keep = existing.filter((e) => wanted.has(e.name));
        const remove = existing.filter((e) => !wanted.has(e.name));
        if (remove.length > 0) {
            await actor.deleteEmbeddedDocuments("Item", remove.map((e) => e.id));
        }

        const held = new Set(keep.map((e) => e.name));
        const missing = [...wanted].filter((name) => !held.has(name));
        if (missing.length === 0) return;

        const pack = game.packs.get(`${MODULE_ID}.saint-effects`);
        if (!pack) return;
        const sources = [];
        for (const name of missing) {
            const index = pack.index.find((e) => e.name === name);
            if (!index) {
                console.warn(`${MODULE_ID} | no sky effect named "${name}" in the effects pack`);
                continue;
            }
            const source = (await pack.getDocument(index._id)).toObject();
            source.flags = foundry.utils.mergeObject(source.flags ?? {}, { [MODULE_ID]: { [EFFECT_FLAG]: true } });
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
            source.system.rules = [
                { key: "RollOption", option: `sky:sign:${this.state.sign}` },
                ...(source.system.rules ?? []),
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
        if (!game.settings.get(MODULE_ID, "announceSky")) return;

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

        await ChatMessage.create({ content, whisper: [] });
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
        await this.applyToAll();
    },
};

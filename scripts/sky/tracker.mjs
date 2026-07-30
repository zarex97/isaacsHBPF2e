import { ASPECTS, CLOTH_SIGNS, MODULE_ID, SIGN_IDS, aspectOf, signOf } from "./signs.mjs";

const SETTING = "sky";
const EFFECT_FLAG = "skyEffect";
const QUEUE_LENGTH = 7;

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

    /** Roll an aspect by weight. `exalted` has weight 0 — see the note in signs.mjs. */
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
     * Pin an Exalted day for a given sign `days` from now.
     *
     * This is the arc-climax button. `days: 0` makes today the Zenith.
     */
    async scheduleZenith(sign, days = 0) {
        if (!game.user.isGM) return;
        if (!CLOTH_SIGNS.includes(sign)) return;
        if (days <= 0) return this.set({ sign, aspect: "exalted" });

        const queue = [...(this.state.queue ?? this.rollQueue())];
        while (queue.length < days) queue.push({ sign: this.rollSign(), aspect: this.rollAspect() });
        queue[days - 1] = { sign, aspect: "exalted" };
        await this.set({ queue }, { announce: false });
        ui.notifications.info(
            `${signOf(sign).label} will rise Exalted in ${days} day${days === 1 ? "" : "s"}.`,
        );
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

    async applyToAll() {
        if (!game.user.isGM) return;
        for (const actor of this.saints()) await this.applyTo(actor);
    },

    async applyTo(actor) {
        if (!game.user.isGM) return;
        const cloth = this.clothOf(actor);
        const { sign, aspect } = this.state;
        const lit = cloth && cloth === sign;
        const tier = lit ? (aspect === "exalted" ? "Zenith" : "Ascendant") : null;
        const wanted = tier ? `Sky: ${tier} (${signOf(sign).label})` : null;

        // Malefic and Retrograde riders are never applied to a Saint at all. That is Unfailing Cosmo (1st
        // level), enforced here rather than left to the GM to remember.

        const existing = this.ownedEffects(actor);
        const keep = wanted ? existing.filter((e) => e.name === wanted) : [];
        const remove = existing.filter((e) => !keep.includes(e));
        if (remove.length > 0) {
            await actor.deleteEmbeddedDocuments(
                "Item",
                remove.map((e) => e.id),
            );
        }
        if (!wanted || keep.length > 0) return;

        const pack = game.packs.get(`${MODULE_ID}.saint-effects`);
        if (!pack) return;
        const index = pack.index.find((e) => e.name === wanted);
        if (!index) {
            console.warn(`${MODULE_ID} | no sky effect named "${wanted}" in the effects pack`);
            return;
        }
        const source = (await pack.getDocument(index._id)).toObject();
        source.flags = foundry.utils.mergeObject(source.flags ?? {}, { [MODULE_ID]: { [EFFECT_FLAG]: true } });
        await actor.createEmbeddedDocuments("Item", [source]);
    },

    /** Strip our sky effects from every Saint — used when the module is disabled mid-session. */
    async clearAll() {
        if (!game.user.isGM) return;
        for (const actor of this.saints()) {
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

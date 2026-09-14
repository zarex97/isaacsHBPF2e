import { Hypnosis } from "./hypnosis.mjs";
import { Reiatsu } from "./reiatsu.mjs";

const MODULE_ID = "isaacs-hb-pf2e";

const EFFECTS_PACK = `${MODULE_ID}.soulbound-effects`;

/** The effect each rung of the ladder wears, by name. Severance is Phase 6's and is not listed yet. */
const EFFECTS = {
    released: "Effect: Released",
    full: "Effect: Full Release",
};

/**
 * A packed effect, by the name it is authored under.
 *
 * The content refers to effects by name and the build rewrites those to ids on the way into the pack, so a
 * `@UUID[…Item.Effect: X]` in a JSON file resolves at the table. Code gets no such pass: `fromUuid` on a
 * name-shaped compendium uuid returns null, silently, and the feature that needed the effect simply does
 * nothing. Astral Projection shipped with two of those and did nothing at all, which is why
 * `npm run test:riders` now fails the build for any script that holds one.
 */
async function packedEffect(name) {
    const pack = game.packs.get(EFFECTS_PACK);
    const entry = pack ? (await pack.getIndex()).find((e) => e.name === name) : null;
    if (!entry) {
        console.warn(`Isaac's Homebrew | ${EFFECTS_PACK} has no "${name}"`);
        return null;
    }
    return pack.getDocument(entry._id);
}

/** What a rung falls back to when it ends. Full Release drops to Released; Released drops to sealed. */
const FALLBACK = { full: "released", released: "sealed" };

/**
 * Which effects a Spirit wears at a given rung, read from the content rather than from a list here.
 *
 * Fifteen Spirits × two rungs is thirty names, and a name is exactly the wrong thing for code to hold:
 * `Kanzen Saimin`, `Antithesis — Schrift` and `Senbonzakura — Shikai` follow three different conventions
 * and a fourth will arrive with the next Spirit. So each Spirit's form feature declares what it puts on:
 *
 *     "flags": { "isaacs-hb-pf2e": { "releaseForm": {
 *         "rung": "released", "effect": "Effect: Senbonzakura — Shikai" } } }
 *
 * The feature stays on the sheet as the readable description of the form — it just stops *granting* the
 * effect, which is what made every Released Form permanent from 1st level.
 */
export function formEffectsFor(actor, rung) {
    const items = [...(actor?.itemTypes?.feat ?? []), ...(actor?.itemTypes?.action ?? [])];
    return items
        .map((item) => item.flags?.[MODULE_ID]?.releaseForm)
        .filter((form) => form?.rung === rung && typeof form.effect === "string")
        .map((form) => form.effect);
}

/**
 * What a Release costs (guide §4.7).
 *
 * > The first Release each encounter is free; releasing again after re-sealing costs 1 Reiatsu Point.
 *
 * Pure, and separate from the spending, because "free the first time" is a per-encounter ledger exactly
 * like Rising Pressure's and those two are the only places in the class where an encounter is a unit of
 * accounting. Outside an encounter there is nothing to be the first of, so it is free.
 */
export function releaseCost({ releasesThisEncounter }) {
    return (releasesThisEncounter ?? 0) === 0 ? 0 : 1;
}

/**
 * What a Full Release is at a given level (guide §4.8).
 *
 * Three tiers, all arithmetic on one number:
 *
 *   13th  FULL RELEASE          1 minute, 15-foot emanation, fatigued when it ends, once per day
 *   17th  Perfected Full Release 2 minutes, 20-foot emanation, no fatigue
 *   19th  Unsealed               twice per day
 *
 * Kept pure because the 17th- and 19th-level upgrades are exactly the kind of thing that gets authored on
 * the wrong feature and then passes a playtest because nobody at the table was 17th level yet.
 */
export function fullReleaseShape(level) {
    if (level < 13) return { minutes: 0, emanation: 0, fatigue: false, usesPerDay: 0 };
    const perfected = level >= 17;
    return {
        minutes: perfected ? 2 : 1,
        emanation: perfected ? 20 : 15,
        fatigue: !perfected,
        usesPerDay: level >= 19 ? 2 : 1,
    };
}

/**
 * Stamp `fullReleaseShape`'s numbers onto an effect on its way onto the sheet.
 *
 * Perfected Full Release (17th) makes the state last 2 minutes instead of 1 and widens the pressure
 * emanation from 15 feet to 20. The duration is an ordinary field; the emanation is **not** — it lives
 * in the effect's rider flags, where an `ItemAlteration` cannot reach it. Rather than author two
 * near-identical effects and predicate between them, the one effect is adjusted as it is created, from
 * the same pure function the rig already asserts against. One source of truth for three tiers.
 */
function applyFullReleaseShape(source, level) {
    const shape = fullReleaseShape(level);
    if (shape.minutes === 0) return source;

    source.system.duration = { ...source.system.duration, unit: "minutes", value: shape.minutes };
    for (const rider of source.flags?.[MODULE_ID]?.riders ?? []) {
        if (rider.area?.type === "emanation") rider.area.value = shape.emanation;
    }
    return source;
}

/**
 * The release ladder as a state machine: sealed → released → full → severance.
 *
 * Release is deliberately **not a stance** (guide §4.7) — it does not conflict with stance actions and it
 * lasts the whole encounter rather than until you do something else — so it cannot use pf2e's stance
 * plumbing, and is an ordinary effect with a module-owned state flag beside it. That flag is what a
 * Spirit's own content predicates on, and what Phase 3 hangs each Released Form off.
 */
export const Release = {
    stateOf(actor) {
        return actor?.getFlag?.(MODULE_ID, "releaseState") ?? "sealed";
    },

    async enter(actor, state) {
        if (!Reiatsu.isSoulbound(actor)) return;
        // The rung's own marker effect, then whatever this Spirit wears at that rung. Both in one create
        // call so the actor is prepared once with the finished picture: a released form that arrives a
        // tick after the marker makes any rule predicated on `self:effect:released` miss on the first
        // prepare, which is the kind of thing that works on a re-render and not at the table.
        const names = [EFFECTS[state], ...formEffectsFor(actor, state)].filter(Boolean);
        const held = new Set(actor.itemTypes.effect.map((e) => e.name));
        const sources = [];
        for (const name of names) {
            if (held.has(name)) continue;
            const doc = await packedEffect(name);
            // `toObject()` hands back the rules array by reference on a compendium document, and editing
            // it poisons the cached pack for the rest of the session. Clone before anything touches it.
            if (doc) sources.push(foundry.utils.deepClone(doc.toObject()));
        }
        if (state === "full") for (const source of sources) applyFullReleaseShape(source, actor.level);
        if (sources.length > 0) await actor.createEmbeddedDocuments("Item", sources);
        await actor.setFlag(MODULE_ID, "releaseState", state);

        /**
         * Kyōka Suigetsu hypnotises on Release, and again on the Full Release — guide §7A.
         *
         * > When you Release … that creature must succeed at a Will save against your Reiatsu DC or be
         * > hypnotized for 1 minute.
         * > [Sōten Kisshun] All enemies within 60 feet who can see you must attempt the Shikai save,
         * > **including those who previously succeeded or became immune.**
         *
         * Read off the sheet — `soulbound:kyoka:hypnotist` and `soulbound:kyoka:total` — so no Spirit is
         * named here. `soulbound:kyoka:total` is what makes the Full Release ignore the immunity register
         * rather than re-rolling only the people who were never immune, which is the whole of that tier.
         */
        const options = actor.getRollOptions?.() ?? [];
        if (options.includes("soulbound:kyoka:hypnotist")) {
            const total = options.includes("soulbound:kyoka:total");
            await Hypnosis.sweep(actor, { range: total ? 60 : null, includeImmune: total });
        }
    },

    async exit(actor, state) {
        const names = new Set([EFFECTS[state], ...formEffectsFor(actor, state)].filter(Boolean));
        // Matched on the authored name rather than on a sourceId, for the same reason `enter` looks the
        // effect up by name: the id is assigned at build time and code has no way to know it.
        const held = actor.itemTypes.effect.filter((e) => names.has(e.name));
        if (held.length > 0) await actor.deleteEmbeddedDocuments("Item", held.map((e) => e.id));
        if (this.stateOf(actor) === state) {
            await actor.setFlag(MODULE_ID, "releaseState", FALLBACK[state] ?? "sealed");
        }
    },

    /* --- repairing characters built before the ladder worked ------------------------------------- */

    /**
     * Every Released Form a Spirit can wear, read from the compendium rather than from a sheet.
     *
     * A legacy character's *owned* features are copies taken when they were granted, so they carry the
     * rules the pack had then — a `GrantItem` for the form effect — and none of the `releaseForm` flag
     * the pack carries now. Repair therefore cannot start from the actor; it has to start from the pack.
     */
    async declaredForms() {
        const pack = game.packs.get(`${MODULE_ID}.soulbound-class-features`);
        if (!pack) return new Map();
        const forms = new Map();
        for (const entry of await pack.getIndex({ fields: ["flags"] })) {
            const declared = entry.flags?.[MODULE_ID]?.releaseForm;
            if (declared?.effect) forms.set(entry.name, declared);
        }
        return forms;
    },

    /**
     * Every authored module flag in the Soulbound packs, keyed by compendium uuid and by name.
     *
     * Keyed both ways because `_stats.compendiumSource` is the reliable address and a name is the only
     * one some older grants left behind.
     */
    async authoredFlags() {
        const packs = [
            "soulbound-class-features", "soulbound-techniques", "soulbound-kido",
            "soulbound-feats", "soulbound-effects", "soulbound-equipment", "soulbound-class",
        ];
        const authored = new Map();
        for (const name of packs) {
            const pack = game.packs.get(`${MODULE_ID}.${name}`);
            if (!pack) continue;
            for (const entry of await pack.getIndex({ fields: ["flags"] })) {
                const flags = entry.flags?.[MODULE_ID];
                if (!flags || Object.keys(flags).length === 0) continue;
                authored.set(`Compendium.${MODULE_ID}.${name}.Item.${entry._id}`, flags);
                authored.set(`name:${entry.name}`, flags);
            }
        }
        return authored;
    },

    /**
     * Bring a character built before the release ladder worked into line with one that was not.
     *
     * Two things are wrong with such a sheet, and neither heals on its own:
     *
     *  1. It is **wearing** its Released Form, and from 13th its Full Release and its Bankai, because
     *     those were granted outright by the class features. Worse than cosmetic: the Bankai's
     *     `turn-start` emanation and the Full Release fear aura fire every round from those effects.
     *  2. Its owned features do **not** declare a `releaseForm`, so even after the effects are removed,
     *     Releasing would put nothing on — the character would be strictly worse than before.
     *
     * Both are fixed here, and deliberately without touching `system.rules` on an owned item: replacing
     * that array wipes the `flag` pf2e writes onto a `GrantItem` at grant time, and the result is
     * "<Actor> already has <Item>" on every actor update, for ever. The stale `GrantItem` left behind is
     * inert — it has no `reevaluateOnUpdate`, so it only ever ran once, when the feature landed.
     */
    async repair(actor) {
        if (!Reiatsu.isSoulbound(actor)) return null;
        const forms = await this.declaredForms();

        // 1. Re-read every authored module flag from the packs.
        //
        // An owned item is a COPY taken when it was granted, so a character built last week is still
        // carrying last week's rider flags — which is how a fixed predicate stays broken on every sheet
        // that already exists. Only the module's own flag subtree is replaced, never `system.rules`:
        // replacing that array wipes the `flag` pf2e writes onto a `GrantItem` at grant time, and the
        // result is "<Actor> already has <Item>" on every actor update, for ever. Nothing stores runtime
        // state under this namespace on an item — the ledgers all live on the actor — so the pack is
        // safely the source of truth here.
        const authored = await this.authoredFlags();
        const updates = [];
        const refreshed = [];
        for (const item of actor.items) {
            const source = item._stats?.compendiumSource;
            const packFlags = (source && authored.get(source)) ?? authored.get(`name:${item.name}`);
            if (!packFlags) continue;
            const current = item.flags?.[MODULE_ID] ?? {};
            if (JSON.stringify(current) === JSON.stringify(packFlags)) continue;
            updates.push({ _id: item.id, [`flags.${MODULE_ID}`]: packFlags });
            refreshed.push(item.name);
        }

        // 2. Teach the owned features what they wear, matching the pack by name.
        for (const item of [...actor.itemTypes.feat, ...actor.itemTypes.action]) {
            const declared = forms.get(item.name);
            if (!declared) continue;
            if (item.flags?.[MODULE_ID]?.releaseForm?.effect === declared.effect) continue;
            const existing = updates.find((u) => u._id === item.id);
            if (existing) existing[`flags.${MODULE_ID}`].releaseForm = declared;
            else updates.push({ _id: item.id, [`flags.${MODULE_ID}.releaseForm`]: declared });
        }
        if (updates.length > 0) await actor.updateEmbeddedDocuments("Item", updates);

        // 2. Take off anything the character has not actually Released into.
        const state = this.stateOf(actor);
        const allowed = new Set(
            state === "sealed"
                ? []
                : state === "released"
                    ? [EFFECTS.released, ...formEffectsFor(actor, "released")]
                    : [EFFECTS.released, EFFECTS.full,
                       ...formEffectsFor(actor, "released"), ...formEffectsFor(actor, "full")],
        );
        const wearable = new Set([...forms.values()].map((f) => f.effect));
        wearable.add(EFFECTS.full);
        // Greater Flash Step wore the same way: granted outright at 11th, where the guide gives it "until
        // the start of your next turn" after you Flash Step. Flash Step applies it now, so a legacy sheet
        // is carrying an afterimage it never made.
        wearable.add("Effect: Greater Flash Step");
        const unearned = actor.itemTypes.effect.filter(
            (e) => wearable.has(e.name) && !allowed.has(e.name),
        );
        if (unearned.length > 0) {
            await actor.deleteEmbeddedDocuments("Item", unearned.map((e) => e.id));
        }

        return {
            actor: actor.name,
            refreshed,
            taught: updates.length,
            removed: unearned.map((e) => e.name),
        };
    },

    /** Every Soulbound in the world. Safe to run more than once. */
    async repairAll() {
        const report = [];
        for (const actor of game.actors) {
            const result = await this.repair(actor);
            if (result) report.push(result);
        }
        console.log("Isaac's Homebrew | release-ladder repair", report);
        return report;
    },

    /* --- what a Technique needs before it may be used -------------------------------------------- */

    /**
     * The two requirements a Technique carries that a pf2e sheet cannot state.
     *
     * > A **Release Technique** — a signature effect costing 1 Reiatsu Point, **usable only while
     * > released**. — guide §4.7
     * > Each [Zanjutsu technique] costs 1 Reiatsu Point … and **requires your spirit weapon to be
     * > Released**. — guide §8.4
     * > [In a Full Release] your Release Technique costs no Reiatsu Points, **but you can use it only
     * > once per round**. — guide §4.8
     *
     * The once-per-round cap shares its ledger with the free cast rather than keeping a second one:
     * `Unbound Technique` is granted by `Effect: Full Release`, carries `frequency 1/round`, and pf2e
     * recharges it on round change by itself. When its charge is gone the Technique is not merely
     * chargeable again — it is spent for the round, which is what the guide says.
     *
     * Returns false to stop the cast.
     */
    beforeCast(spell) {
        const actor = spell?.actor;
        if (!Reiatsu.isSoulbound(actor)) return true;
        const tags = spell.system?.traits?.otherTags ?? [];
        const isRelease = tags.includes("sb-tier-release");
        const isZanjutsu = tags.includes("sb-tier-zanjutsu");
        if (!isRelease && !isZanjutsu) return true;

        if (this.stateOf(actor) === "sealed") {
            ui.notifications.warn(
                `${spell.name} needs your spirit weapon released. Use Release first.`,
            );
            return false;
        }

        if (isRelease && this.stateOf(actor) === "full") {
            const allowance = actor.itemTypes.action.find((a) => a.system?.slug === "unbound-technique");
            if (allowance && (allowance.system.frequency?.value ?? 0) <= 0) {
                ui.notifications.warn(
                    `${spell.name} is once per round while you are in a Full Release, and it has been used.`,
                );
                return false;
            }
        }
        return true;
    },

    /* --- the two actions ------------------------------------------------------------------------ */

    /** How many times this actor has Released in the encounter standing now. */
    releasesThisEncounter(actor) {
        const ledger = actor?.getFlag?.(MODULE_ID, "releaseLedger") ?? {};
        const encounter = game.combat?.id ?? null;
        return ledger.encounter === encounter ? (ledger.releases ?? 0) : 0;
    },

    /**
     * **Release** [one-action] — guide §4.7.
     *
     * Requirements are checked rather than described: a dismissed spirit weapon refuses, and a second
     * Release in the same encounter costs a point and refuses when the pool is empty. Refusing is the
     * whole value of automating this — a player who Releases twice for free never finds out.
     */
    async release(actor) {
        if (!Reiatsu.isSoulbound(actor)) return false;
        if (this.stateOf(actor) !== "sealed") {
            ui.notifications.info(`${actor.name} is already released.`);
            return false;
        }

        const cost = releaseCost({ releasesThisEncounter: this.releasesThisEncounter(actor) });
        const pool = actor.system?.resources?.focus;
        if (cost > 0 && (pool?.value ?? 0) < cost) {
            ui.notifications.warn(
                `${actor.name} has re-sealed once already this encounter, so Releasing again costs 1 Reiatsu Point — and the pool is empty.`,
            );
            return false;
        }

        await this.enter(actor, "released");
        const encounter = game.combat?.id ?? null;
        const updates = {
            [`flags.${MODULE_ID}.releaseLedger`]: {
                encounter,
                releases: this.releasesThisEncounter(actor) + 1,
            },
        };
        if (cost > 0) updates["system.resources.focus.value"] = (pool?.value ?? 0) - cost;
        await actor.update(updates);
        ui.notifications.info(
            cost > 0
                ? `${actor.name} Releases again, for 1 Reiatsu Point.`
                : `${actor.name} Releases. The first Release each encounter is free.`,
        );
        return true;
    },

    /**
     * **FULL RELEASE** [two-actions] — guide §4.8.
     *
     * Frequency is pf2e's, on the feat itself, so the once-per-day (twice with `Unsealed`) is already
     * counted by the sheet. What is checked here is the pair of requirements the sheet cannot express:
     * you must already be released, and you must hold at least 1 Reiatsu Point.
     */
    async fullRelease(actor) {
        if (!Reiatsu.isSoulbound(actor)) return false;
        if (this.stateOf(actor) === "sealed") {
            ui.notifications.warn(`${actor.name} must Release before a Full Release.`);
            return false;
        }
        if (this.stateOf(actor) === "full") {
            ui.notifications.info(`${actor.name} is already in a Full Release.`);
            return false;
        }
        if ((actor.system?.resources?.focus?.value ?? 0) < 1) {
            ui.notifications.warn(`Full Release requires at least 1 Reiatsu Point.`);
            return false;
        }

        await this.enter(actor, "full");
        ui.notifications.info(`${actor.name} enters a Full Release.`);
        return true;
    },

    /**
     * The encounter ends, and so does Release.
     *
     * Guide §4.7 says a released form lasts "for the rest of the encounter", which is a duration pf2e has
     * no unit for — its effects measure rounds, minutes and days. So the encounter's end is the timer, and
     * `deleteCombat` is where it fires.
     */
    registerHooks() {
        /**
         * A Full Release ending, by whichever route.
         *
         * > When it ends you become **fatigued** until you rest for 10 minutes — guide §4.8
         *
         * pf2e expires an effect by deleting it, so `deleteItem` is the one place that catches the timer
         * running out, a GM removing it by hand, and `Seal the Art` suppressing it alike. Perfected Full
         * Release (17th) removes the fatigue, and that is read off the sheet rather than from a level
         * check, so a Spirit that ever grants it early gets it for free.
         */
        Hooks.on("deleteItem", async (item) => {
            if (!game.user.isGM) return;
            if (item.name !== EFFECTS.full) return;
            const actor = item.actor;
            if (!Reiatsu.isSoulbound(actor)) return;

            await this.exit(actor, "full");
            const perfected = actor.itemTypes.feat.some(
                (f) => f.system?.slug === "perfected-full-release",
            );
            if (!perfected) {
                await actor.increaseCondition("fatigued");
                ui.notifications.info(`${actor.name}'s Full Release ends. Fatigued until 10 minutes' rest.`);
            }
        });

        /**
         * Zangetsu is never sealed — guide §7A.
         *
         * > Your first Release each encounter is free and requires no action — you begin every encounter
         * > already released.
         *
         * `Zangetsu — Shikai` sets `soulbound:release:never-sealed`, so this reads the clause off the
         * sheet instead of naming Ichigo in code. It costs nothing and consumes no ledger entry, because
         * the free first Release is precisely what it is spending.
         */
        Hooks.on("combatStart", async (combat) => {
            if (!game.user.isGM) return;
            for (const combatant of combat.combatants) {
                const actor = combatant.actor;
                if (!Reiatsu.isSoulbound(actor)) continue;
                const never = (actor.getRollOptions?.(["all"]) ?? [])
                    .includes("soulbound:release:never-sealed");
                if (!never || this.stateOf(actor) !== "sealed") continue;
                await this.enter(actor, "released");
                await actor.setFlag(MODULE_ID, "releaseLedger", { encounter: combat.id, releases: 1 });
            }
        });

        Hooks.on("deleteCombat", async (combat) => {
            if (!game.user.isGM) return;
            for (const combatant of combat.combatants) {
                const actor = combatant.actor;
                if (!Reiatsu.isSoulbound(actor)) continue;
                if (this.stateOf(actor) === "sealed") continue;
                await this.exit(actor, "full");
                await this.exit(actor, "released");
            }
        });
    },
};

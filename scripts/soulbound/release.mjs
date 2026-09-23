import { Hypnosis } from "./hypnosis.mjs";
import { Reiatsu } from "./reiatsu.mjs";
import { SpiritWeapon } from "./weapon.mjs";

const MODULE_ID = "isaacs-hb-pf2e";

const EFFECTS_PACK = `${MODULE_ID}.soulbound-effects`;

/**
 * The effect each rung wears, by name.
 *
 * Severance is absent on purpose: its effect is owned by `severance.mjs`, which holds the Waning table and
 * the clock. This map is what `enter`/`exit` create and delete, and Severance is neither entered nor left
 * that way — the capstone grants its effect with a rule element.
 */
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

/**
 * What a rung falls back to when it ends.
 *
 * Severance drops all the way to `sealed` rather than one step, because R-10 takes everything: "you lose
 * your Released Form, your Release Technique, your Full Release and your entire reiatsu pool". There is no
 * rung underneath to fall back to — which is what makes it the terminal state rather than a fourth rung
 * like the others.
 */
const FALLBACK = { severance: "sealed", full: "released", released: "sealed" };

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
/**
 * May an owned item's `system.rules` be replaced with the pack's?
 *
 * Usually **no**, and `repair` says why: pf2e writes a `flag` onto a `GrantItem` at grant time and a
 * `selection` onto a `ChoiceSet` when the player answers it. Both live *inside* the rules array, so
 * overwriting it wholesale throws that state away — the grant becomes "<Actor> already has <Item>" on
 * every actor update for ever, and the choice is silently un-made.
 *
 * But that reason only covers rules that *carry* grant-time state. An owned item whose rules are all
 * plain synthetics — a `MultipleAttackPenalty`, a `FlatModifier`, a `Resistance` — has nothing to lose,
 * and is exactly the case that otherwise stays broken for ever on a character who already exists.
 *
 * Which is not hypothetical: *Bala*'s MAP rule said `value: 1` where pf2e demands a negative penalty, so
 * every Soulbound in the world logged a validation failure once per data preparation and threw the rule
 * away. Fixing the pack fixed nobody who had already been built.
 */
const STATEFUL_RULES = new Set(["GrantItem", "ChoiceSet"]);

export function rulesAreSafeToRefresh(owned, packed) {
    if (!Array.isArray(owned) || !Array.isArray(packed)) return false;
    if (JSON.stringify(owned) === JSON.stringify(packed)) return false;   // nothing to do
    return ![...owned, ...packed].some((rule) => STATEFUL_RULES.has(rule?.key));
}

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
function applyFullReleaseShape(source, level, actor = null) {
    const shape = fullReleaseShape(level);
    if (shape.minutes === 0) return source;

    source.system.duration = { ...source.system.duration, unit: "minutes", value: shape.minutes };
    for (const rider of source.flags?.[MODULE_ID]?.riders ?? []) {
        if (rider.area?.type === "emanation") rider.area.value = shape.emanation;
    }

    /**
     * The pressure emanation is a pf2e `Aura`, so its radius and its trigger live in a rule element.
     *
     * Perfected Full Release widens it to 20 feet, and `Twin Pressure` (feat 14) is a single word:
     *
     * > While in a Full Release, the emanation's Will save also applies to enemies that **enter** it,
     * > not only those who end their turn in it. — guide §8.5
     *
     * That feat had a `RollOption` nothing read, and could not have been written as content: the events
     * list belongs to an effect the feat does not own.
     */
    const twinPressure = actor?.itemTypes?.feat?.some((f) => f.system?.slug === "twin-pressure");
    for (const rule of source.system?.rules ?? []) {
        if (rule.key !== "Aura" || rule.slug !== "soulbound-pressure") continue;
        rule.radius = shape.emanation;
        if (twinPressure) rule.effects = rule.effects.map((e) => ({ ...e, events: ["enter", "turn-end"] }));
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
        if (state === "full") for (const source of sources) applyFullReleaseShape(source, actor.level, actor);
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

    /**
     * Enter the fourth and final rung.
     *
     * Called from `severance.mjs` when `Effect: Severance` lands, because `Final Release` grants that
     * effect with a `GrantItem` rule rather than through code — so nothing here is ever the thing that
     * starts a Severance.
     *
     * The ladder is linear (ADR-0002): `sealed → released → full → severance`, and Final Getsuga Tenshou
     * comes from Bankai, not from Shikai.
     */
    async enterSeverance(actor) {
        if (!Reiatsu.isSoulbound(actor)) return false;
        if (this.stateOf(actor) !== "full") return false;
        await actor.setFlag(MODULE_ID, "releaseState", "severance");
        return true;
    },

    async exit(actor, state = this.stateOf(actor)) {
        // Defaulting to the state the actor is actually in matters: `exit(actor)` with no rung used to
        // build an empty name set, delete nothing, and leave the release flag untouched — silently, and
        // looking exactly like a Release that had failed to clear. Whatever you are in is the sensible
        // thing to leave.
        if (!state || state === "sealed") return;
        const names = new Set([EFFECTS[state], ...formEffectsFor(actor, state)].filter(Boolean));
        // Matched on the authored name rather than on a sourceId, for the same reason `enter` looks the
        // effect up by name: the id is assigned at build time and code has no way to know it.
        const held = actor.itemTypes.effect.filter((e) => names.has(e.name));
        // What leaving this rung costs, read off the rung itself before it is taken away.
        //
        // Uryū's Letzt Stil is the only form in the class with a real one, and guide §7C states it twice
        // over: "you lose access to your Schrift Form, your Release Technique, Licht Regen, Vollständig,
        // and your entire reiatsu pool until you complete 24 hours of rest". `Release.release` has read
        // `soulbound:letzt-stil-spent` since the ladder was built — and **nothing ever published it**, so
        // the cost was a paragraph and the character could simply Release again on the next turn. Driven
        // live: the pool came out of the form untouched and the Schrift went straight back on.
        const costs = held.map((e) => e.flags?.[MODULE_ID]?.endsWith).filter((cost) => cost?.effect);
        if (held.length > 0) await actor.deleteEmbeddedDocuments("Item", held.map((e) => e.id));
        for (const cost of costs) {
            const doc = await packedEffect(cost.effect);
            if (doc) await actor.createEmbeddedDocuments("Item", [foundry.utils.deepClone(doc.toObject())]);
            else console.warn(`Isaac's Homebrew | exit cost not found: ${cost.effect}`);
            // The pool is emptied by the cost effect's own `focus.cap` override rather than by a write
            // here: a one-off `value: 0` grows back on the next refocus, and the guide says the pool is
            // gone until 24 hours of rest.
            if (cost.zeroPool) await actor.update({ "system.resources.focus.value": 0 });
        }
        if (this.stateOf(actor) === state) {
            await actor.setFlag(MODULE_ID, "releaseState", FALLBACK[state] ?? "sealed");
        }
        // A cost that takes the rung below with it. Severance is written into `FALLBACK` because it is
        // the only *rung* that does this; Letzt Stil is a **form**, and §7C takes the Schrift Form as
        // well as the Vollständig — "you lose access to your Schrift Form, your Release Technique,
        // Licht Regen, Vollständig". Falling one step left the Schrift on, and with it the bow, the
        // reaction and Licht Regen, which is three of the four things the clause names.
        for (const cost of costs) {
            if (cost.exitTo === "sealed" && this.stateOf(actor) !== "sealed") {
                await this.exit(actor, this.stateOf(actor));
            }
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
        // Every Item pack the module ships, the Saint's included. The list used to name only the
        // Soulbound's seven, which was right while this repaired the release ladder and wrong the moment
        // it also began refreshing icons and stateless rules: a Pisces Saint sat with three broken
        // images that the sweep walked straight past.
        const packs = game.packs
            .filter((pack) => pack.metadata.packageName === MODULE_ID && pack.metadata.type === "Item")
            .map((pack) => pack.metadata.name);
        const authored = new Map();
        for (const name of packs) {
            const pack = game.packs.get(`${MODULE_ID}.${name}`);
            if (!pack) continue;
            const fields = ["flags", "system.rules", "system.traits.otherTags", "img"];
            for (const entry of await pack.getIndex({ fields })) {
                const flags = entry.flags?.[MODULE_ID];
                const rules = entry.system?.rules;
                const otherTags = entry.system?.traits?.otherTags ?? null;
                const img = entry.img ?? null;
                if (!flags && !rules?.length && !otherTags?.length && !img) continue;
                const record = { flags: flags ?? null, rules: rules ?? null, otherTags, img };
                authored.set(`Compendium.${MODULE_ID}.${name}.Item.${entry._id}`, record);
                authored.set(`name:${entry.name}`, record);
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
        // Gated on **carrying the module's items**, not on being a Soulbound.
        //
        // Half of what this does — refreshing flags, stateless rules and icons from the packs — is about
        // module content wherever it sits, and a Saint was every bit as stuck with a sheet of broken
        // images as a Soul Reaper was. The release-ladder half below still only applies to a Soulbound,
        // and says so; `declaredForms` simply finds nothing for anyone else.
        const mine = actor?.items?.some?.((item) =>
            typeof item._stats?.compendiumSource === "string"
            && item._stats.compendiumSource.startsWith(`Compendium.${MODULE_ID}.`));
        if (!mine) return null;
        const soulbound = Reiatsu.isSoulbound(actor);
        const forms = soulbound ? await this.declaredForms() : new Map();

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
        const rewritten = [];
        for (const item of actor.items) {
            const source = item._stats?.compendiumSource;
            const record = (source && authored.get(source)) ?? authored.get(`name:${item.name}`);
            if (!record) continue;

            const packFlags = record.flags;
            if (packFlags) {
                const current = item.flags?.[MODULE_ID] ?? {};
                if (JSON.stringify(current) !== JSON.stringify(packFlags)) {
                    updates.push({ _id: item.id, [`flags.${MODULE_ID}`]: packFlags });
                    refreshed.push(item.name);
                }
            }

            // The icon, which is pure presentation and carries no state at all. The module's art used
            // to point at ninety invented paths in Foundry's library; it now ships with the module, and
            // without this a character built yesterday keeps a sheet full of broken images.
            if (record.img && item.img !== record.img) {
                const existing = updates.find((u) => u._id === item.id);
                if (existing) existing.img = record.img;
                else updates.push({ _id: item.id, img: record.img });
                if (!refreshed.includes(item.name)) refreshed.push(item.name);
            }

            /**
             * The tags, which are read by predicates and written by nobody.
             *
             * `Refined Release` (9th) widens a Technique's area with an `ItemAlteration` predicated on
             * `item:tag:sb-refined-area-20`. Driven live at C-32: a **20th-level** Soul Reaper with
             * Refined Release plainly on the sheet cast Senbonzakura into a **15-foot** emanation, because
             * the owned copy of the spell predates the tag and carries only `sb-tier-release`. The pack was
             * right; the character was built before it was. A predicate that matches nothing does not
             * complain — it simply never fires, which is this audit's whole subject.
             *
             * A **union**, never a replacement, and read off `_source` rather than off the prepared item:
             * pf2e's own `ItemAlteration` can add an `other-tag` during preparation, and rewriting the
             * stored array from a prepared one would bake a synthetic tag into the document for ever.
             * Union means a tag *removed* from the pack survives on an old sheet, which is the lesser of
             * the two mistakes: a stale tag can only fire a rule that is still authored.
             */
            const ownTags = item._source?.system?.traits?.otherTags;
            if (Array.isArray(ownTags) && Array.isArray(record.otherTags)) {
                const missing = record.otherTags.filter((tag) => !ownTags.includes(tag));
                if (missing.length > 0) {
                    const merged = [...ownTags, ...missing];
                    const existing = updates.find((u) => u._id === item.id);
                    if (existing) existing["system.traits.otherTags"] = merged;
                    else updates.push({ _id: item.id, "system.traits.otherTags": merged });
                    if (!refreshed.includes(item.name)) refreshed.push(item.name);
                }
            }

            // And the rules, but only where nothing in them carries grant-time state — see
            // `rulesAreSafeToRefresh`. This is the half that reaches a character who already exists:
            // a corrected rule in the pack does nothing for a sheet holding a copy of the old one.
            if (rulesAreSafeToRefresh(item.system?.rules, record.rules)) {
                const existing = updates.find((u) => u._id === item.id);
                if (existing) existing["system.rules"] = record.rules;
                else updates.push({ _id: item.id, "system.rules": record.rules });
                rewritten.push(item.name);
            }
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

        // 3. Deliver grants a feature learned **after** this character was built.
        //
        // `GrantItem` runs once, at the moment the granting item is created. A rule added to the pack
        // afterwards is never re-run — pf2e re-evaluates a grant on an actor update only when it says
        // `reevaluateOnUpdate`, and most do not — so a feature that learned to hand something out last
        // week hands it to nobody who already exists.
        //
        // Found by driving C-20: `Steady the Breath` is granted by `Reiatsu`, and **sixteen of the
        // forty-one Soulbound in the rig did not have it**, because they predate the grant. The pool
        // still refilled, because it is a real pf2e focus pool and Refocus is pf2e's own; what was
        // missing was the class's name for the activity, on the sheet, where the player reads it.
        //
        // Deliberately narrow. Only a plain compendium uuid is followed — never `{item|flags…}`, which
        // is a ChoiceSet's answer and belongs to a decision this cannot make — and never a predicated
        // grant, which may be absent because its predicate is false rather than because it was missed.
        const delivered = await this.deliverMissingGrants(actor);

        // 2. Take off anything the character has not actually Released into. Soulbound only: nobody else
        // has a release state, and `stateOf` would answer "sealed" for a Saint and strip nothing.
        if (!soulbound) {
            return { actor: actor.name, refreshed, rewritten, delivered, taught: updates.length, removed: [] };
        }
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
            rewritten,
            delivered,
            taught: updates.length,
            removed: unearned.map((e) => e.name),
        };
    },

    /**
     * Hand over what the packs say this character's own features should have granted.
     *
     * Reads the **pack** copy of each owned module item, walks its `GrantItem` rules, and creates
     * anything the actor is missing by name. Idempotent: a second run finds nothing, because the first
     * one gave it a copy with that name.
     */
    async deliverMissingGrants(actor) {
        const held = new Set(actor.items.map((i) => i.name));
        const authored = await this.authoredFlags();
        const created = [];
        const sources = [];

        for (const item of actor.items) {
            const compendiumSource = item._stats?.compendiumSource;
            const record = (compendiumSource && authored.get(compendiumSource))
                ?? authored.get(`name:${item.name}`);
            for (const rule of record?.rules ?? []) {
                if (rule?.key !== "GrantItem") continue;
                // A ChoiceSet's answer, not a fixed grant: whose item it is depends on a decision this
                // repair has no standing to make.
                if (typeof rule.uuid !== "string" || !rule.uuid.startsWith("Compendium.")) continue;
                // Absent may be correct: the predicate may simply be false for this character.
                if (Array.isArray(rule.predicate) && rule.predicate.length > 0) continue;

                const granted = await fromUuid(rule.uuid);
                if (!granted || held.has(granted.name)) continue;
                held.add(granted.name);
                sources.push(foundry.utils.deepClone(granted.toObject()));
                created.push(granted.name);
            }
        }

        if (sources.length > 0) await actor.createEmbeddedDocuments("Item", sources);
        return created;
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
        // Two costs end the same way: the form simply cannot be put back on.
        //
        // Guide §7C — when Letzt Stil ends "you lose Schrift Form, Release Technique, Licht Regen,
        // Vollständig and your entire pool until 24 hours of rest"; and guide §9, R-10 — when Severance
        // ends by either route you lose "your Released Form, your Release Technique, your Full Release
        // and your entire reiatsu pool" until a week of downtime. Both effects zeroed the pool and
        // published a roll option that nothing read, so the character could simply Release again and put
        // everything back, which is the opposite of a cost.
        const spent = [
            ["soulbound:letzt-stil-spent", "has spent Letzt Stil: no Schrift Form until 24 hours of rest"],
            ["soulbound:severed", "is Severed: no Released Form until a week of downtime"],
        ].find(([option]) => actor.getRollOptions?.().includes(option));
        if (spent) {
            ui.notifications.warn(`${actor.name} ${spent[1]}.`);
            return false;
        }

        /**
         * > You can't Release while your spirit weapon is dismissed. — guide §4.7
         *
         * This comment's promise above — "a dismissed spirit weapon refuses" — was a description of
         * something no line of code did, because until `SpiritWeapon.isDismissed` there was no dismissed
         * state to ask about. Dismissing was a chat card and nothing else.
         */
        if (SpiritWeapon.isDismissed(actor)) {
            ui.notifications.warn(
                `${actor.name}'s spirit weapon is dismissed. Manifest it before Releasing.`,
            );
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

        /**
         * > **Frequency** once per day … you can't use Full Release again today. — guide §4.8
         *
         * pf2e **counts** this and does not enforce it. `createUseActionMessage` decrements
         * `system.frequency.value` when the sheet's use button is clicked, stops decrementing at zero, and
         * then posts the card anyway — so a 13th-level Soulbound whose one use was spent clicked the
         * button again, the counter stayed at 0, and they entered a second Full Release. Driven live, that
         * is exactly what happened.
         *
         * The count is kept here rather than read off pf2e's, because by the time this runs pf2e has
         * already decremented for a legitimate use and the two cases are indistinguishable from the
         * counter alone. `max` is still read off the feat, so `Unsealed`'s `ItemAlteration` — the 19th
         * level's "twice per day" — raises this allowance without knowing this code exists.
         *
         * The day is the world's, the same one `Steady the Breath` counts its first use of.
         */
        const feat = actor.itemTypes.feat.find((f) => f.system?.slug === "full-release");
        const max = Number(feat?.system?.frequency?.max ?? 1);
        const today = new Date(game.time.worldTime * 1000).toDateString();
        const ledger = actor.getFlag(MODULE_ID, "fullReleaseLedger") ?? {};
        const used = ledger.day === today ? (ledger.used ?? 0) : 0;
        if (used >= max) {
            ui.notifications.warn(
                `${actor.name} has used Full Release ${used === 1 ? "once" : `${used} times`} today, `
                + `which is all of it. It comes back with your daily preparations.`,
            );
            return false;
        }

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
        // Spent *after* every refusal above, so a Full Release that could not begin has not cost a use.
        await actor.setFlag(MODULE_ID, "fullReleaseLedger", { day: today, used: used + 1 });
        ui.notifications.info(
            `${actor.name} enters a Full Release. ${max - used - 1} left today.`,
        );
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
            // Two things suppress the fatigue: Perfected Full Release at 17th, and `Vollständig
            // Endurance` (feat 14) — "when your Vollständig ends you are not fatigued". The feat is read
            // through a roll option rather than by slug so a later Spirit can grant the same relief.
            const perfected = actor.itemTypes.feat.some(
                (f) => f.system?.slug === "perfected-full-release",
            ) || (actor.getRollOptions?.() ?? []).includes("soulbound:no-full-release-fatigue");
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
                const options = actor.getRollOptions?.(["all"]) ?? [];
                // Two clauses put you in your released form the moment a fight begins, and they are the
                // same event: Zangetsu is never sealed at all (guide §7A), and `Sheathed Draw` (feat 1)
                // is "when you roll initiative, manifest your spirit weapon and Release as a single free
                // action". Both spend the free first Release rather than a point.
                const never = options.includes("soulbound:release:never-sealed")
                    || actor.itemTypes.feat.some((f) => f.system?.slug === "sheathed-draw");
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

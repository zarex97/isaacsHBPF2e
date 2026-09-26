import { MODULE_ID } from "../sky/signs.mjs";

/**
 * The Assimilator's engine: what the character has eaten, and everything that follows from it.
 *
 * **The actor flag is the record; items are its projection.** `flags["isaacs-hb-pf2e"].assimilator` holds
 * what was *paid* — each Substrate's Depth, the Bonds slotted, the Instinct fixed at the last daily
 * preparations, the Vein grants spent. Every Substrate, the Instinct and each Bond is an **effect** on the
 * actor whose presence, and whose counter badge, `rebuild()` derives from that record. Nothing else writes
 * them. That is the automation programme's single most important rule (§4.2): the Saint's worst bugs were
 * two writers disagreeing about derived state.
 *
 * **A Substrate is an effect with its Depth on the badge.** pf2e emits `self:effect:<slug>:<badge>` for a
 * counter badge, so a Depth ladder is plain predicates — `{ gte: ["self:effect:substrate-ruby", 3] }` —
 * and the build is visible in the effects panel, which is the guide's whole premise (§10.3). The badge is
 * the **effective** Depth, which is where Gold's "counts as one higher" and Apotheosis will act; the flag
 * keeps the paid one.
 *
 * **Mass, the Depth cap and Bond slots come from the features that grant them.** Each such feature carries
 * `flags["isaacs-hb-pf2e"].assimilator.grants = { gem, metal, depthCap, bondSlots }` and the engine sums
 * what the character owns — so a Mass feat later is one flag, not a code change, and the numbers can never
 * disagree with the sheet.
 */

const KEY = "assimilator";
const PACKS = {
    substrates: `${MODULE_ID}.assimilator-substrates`,
    bonds: `${MODULE_ID}.assimilator-bonds`,
    effects: `${MODULE_ID}.assimilator-effects`,
};
export const COLOURS = ["red", "gold", "orange", "blue", "purple", "green", "black", "white", "gray"];
export const SUBSTRATE_PREFIX = "substrate-";

/** Guide §4.5 (v1.1, ruling on #82): the damage type each Instinct sets. */
export const INSTINCT_TYPES = {
    red: "fire", gold: "force", orange: "electricity", blue: "cold", purple: "mental",
    green: "poison", black: "void", white: "vitality", gray: "bludgeoning",
};

/** Emerald's own fast healing by Depth (lexicon §8), against which the Green Instinct's is compared. */
export const EMERALD_FAST_HEALING = { 1: 1, 2: 2, 3: 5, 4: 10 };
/** On while the Green Instinct's fast healing is the higher: only the highest of two applies (duplicate effects). */
export const GREEN_OUTHEALS = "assimilator:green-fast-healing";

/** Nickel's Aberrations held at each Depth (lexicon §9). */
export const ABERRATION_COUNT = { 1: 1, 2: 2, 3: 2, 4: 3 };
export const ABERRATIONS = ["limb", "organ", "mode", "plate", "gland", "maw"];

/* -------------------------------------------------------------------------------------------- */
/*  Pure rules — no Foundry, so the tests can hold them                                         */
/* -------------------------------------------------------------------------------------------- */

/** Sum every `grants` block the character owns. The Depth cap is the highest granted, not a sum. */
export function grantsOf(blocks) {
    const out = { gem: 0, metal: 0, depthCap: 0, bondSlots: 0, sources: 0 };
    for (const g of blocks) {
        if (!g) continue;
        out.gem += g.gem ?? 0;
        out.metal += g.metal ?? 0;
        out.bondSlots += g.bondSlots ?? 0;
        out.depthCap = Math.max(out.depthCap, g.depthCap ?? 0);
        // "Every time your Mass increases, you gain one free Substrate" — one per feature that raises it.
        if ((g.gem ?? 0) > 0 || (g.metal ?? 0) > 0) out.sources += 1;
    }
    return out;
}

/** Mass spent in each track: a Substrate at Depth N costs N (guide §3.1). */
export function spentOf(paid, catalogue) {
    const spent = { gem: 0, metal: 0 };
    for (const [slug, depth] of Object.entries(paid)) {
        const kind = catalogue[slug]?.kind;
        if (kind) spent[kind] += depth;
    }
    return spent;
}

/**
 * The Depth at which a Substrate first adds damage to a Strike: the shallowest provenance-tagged damage rule
 * that fires on every hit. A critical-only rider is not "a Mutation dealing damage" on the hits that matter.
 */
export function damageFrom(rules = []) {
    const depths = rules
        .filter((r) => (r.key === "DamageDice" || r.key === "FlatModifier") && !r.critical
            && [r.selector].flat().some((s) => String(s).endsWith("damage")))
        .map((r) => r.flags?.[MODULE_ID]?.[KEY]?.depth)
        .filter(Number.isInteger);
    return depths.length ? Math.min(...depths) : null;
}

/** The damage type a Substrate's Mutation adds: its first typed, non-critical damage die. */
export function damageTypeOf(rules = []) {
    return rules.find((r) => r.key === "DamageDice" && !r.critical && r.damageType && !String(r.damageType).startsWith("{")
        && [r.selector].flat().some((s) => String(s).endsWith("damage")))?.damageType ?? null;
}

/**
 * "Its own damage type" — Orange's +1d4 on a Strike that may carry several Mutations. The deepest one adding
 * damage decides; with none, the Instinct's own type.
 */
export function mutationTypeOf(effective, catalogue, fallback) {
    let best = null;
    for (const [slug, depth] of Object.entries(effective)) {
        const entry = catalogue[slug];
        if (!entry?.damageType || entry.damageFrom === null || entry.damageFrom === undefined || depth < entry.damageFrom) continue;
        if (!best || depth > best.depth) best = { depth, type: entry.damageType };
    }
    return best?.type ?? fallback;
}

/**
 * The Carapace's Hardness from Substrates: the **highest** single bonus, not the sum — guide §4.3 v1.1, ruled
 * on #82. *Adamant Shell* is the one thing that makes them add.
 */
export function substrateHardness(effective, catalogue, { stack = false, extra = [] } = {}) {
    const bonuses = [...extra];
    for (const [slug, depth] of Object.entries(effective)) {
        const ladder = catalogue[slug]?.hardness;
        if (ladder) bonuses.push(ladder[Math.min(depth, 4)] ?? 0);
    }
    if (bonuses.length === 0) return 0;
    return stack ? bonuses.reduce((a, b) => a + b, 0) : Math.max(...bonuses);
}

/**
 * Red's clause is "+1 damage per Depth **of its Substrate**" for each Mutation that deals damage. So the
 * bonus is the sum, over every Substrate whose Mutation is adding damage at its current Depth, of that Depth.
 */
export function mutationDepth(effective, catalogue) {
    let sum = 0;
    for (const [slug, depth] of Object.entries(effective)) {
        const from = catalogue[slug]?.damageFrom;
        if (from !== null && from !== undefined && depth >= from) sum += depth;
    }
    return sum;
}

/** Total Mass per colour, both tracks together — what the Instinct is read from (guide §4.5). */
export function colourTotals(paid, catalogue) {
    const totals = Object.fromEntries(COLOURS.map((c) => [c, 0]));
    for (const [slug, depth] of Object.entries(paid)) {
        const colour = catalogue[slug]?.colour;
        if (colour) totals[colour] += depth;
    }
    return totals;
}

/**
 * Bound Substrates per colour — a count, not Mass: "+5 feet Speed per bound Orange Substrate", "fast healing equal
 * to the number of bound Green Substrates". Electrum *also* counts as its second colour (lexicon §6, ruled on #82),
 * while its Mass stays Gold's.
 */
export function colourCounts(effective, catalogue, electrumColour = null) {
    const counts = Object.fromEntries(COLOURS.map((c) => [c, 0]));
    for (const [slug, depth] of Object.entries(effective)) {
        if (!(depth > 0)) continue;
        const colour = catalogue[slug]?.colour;
        if (colour) counts[colour] += 1;
        if (slug === "electrum" && COLOURS.includes(electrumColour) && electrumColour !== colour) counts[electrumColour] += 1;
    }
    return counts;
}

/**
 * Which slotted Bonds are in force (lexicon §14): both Substrates at Depth 2 or higher. Electrum Depth 2 "may stand in
 * for either Substrate of any one Bond you know" — so for the one Bond named, Electrum at 2+ covers a missing half.
 */
export function activeBonds(slotted, effective, pairs, standIn = null) {
    const deep = (slug) => (effective[slug] ?? 0) >= 2;
    return slotted.filter((slug) => {
        const pair = pairs[slug];
        if (!pair) return false;
        const met = pair.filter(deep).length;
        if (met === 2) return true;
        return met === 1 && standIn === slug && deep("electrum") && !pair.includes("electrum");
    });
}

/** The option a Bond's rules and code key off while it is in force. */
export const bondOption = (slug) => `assimilator:bond:${slug}`;

/**
 * The Instinct clauses in force. Electrum Depth 3 adds the second colour's clause — "but both clauses operate at
 * half value"; Depth 4, "both at full value". A second colour that *is* the Instinct adds nothing.
 */
export function instinctsOf(primary, electrumDepth = 0, electrumColour = null, transmutation = false) {
    const secondary = primary && electrumDepth >= 3 && COLOURS.includes(electrumColour) && electrumColour !== primary
        ? electrumColour : null;
    // Transmutation (Gold + Electrum): "Alloyed Instinct's half-value clause becomes three-quarters (round up)."
    const partial = transmutation ? 0.75 : 0.5;
    return { primary: primary ?? null, secondary, scale: secondary && electrumDepth < 4 ? partial : 1 };
}

/** "Half value (round down, minimum 1)" — and nothing halved is still nothing. */
export function scaled(n, scale = 1) {
    if (!(n > 0)) return 0;
    if (scale === 1) return n;
    // Half rounds down; Transmutation's three-quarters rounds up. Both are at least 1.
    return Math.max(1, scale === 0.75 ? Math.ceil(n * scale) : Math.floor(n * scale));
}

/** The numbers the Instinct effects read (guide §5.1), at the value the clauses currently operate at. */
export function instinctValues({ effective, catalogue, counts, scale = 1 }) {
    const depths = Object.entries(effective).filter(([, d]) => d > 0);
    const highest = Math.max(0, ...depths.map(([, d]) => d));
    const metal = depths.filter(([s]) => catalogue[s]?.kind === "metal").reduce((sum, [, d]) => sum + d, 0);
    return {
        scale,
        // Red: "+1 damage per Depth of its Substrate" — one figure per Substrate, for the modifier its own damage fires.
        red: Object.fromEntries(depths.map(([s, d]) => [s, scaled(d, scale)])),
        orangeSpeed: 5 * scaled(counts.orange, scale),
        blueReduction: scaled(2 * highest, scale),
        blueAc: scaled(1, scale),
        greenHealing: scaled(counts.green, scale),
        whiteUses: scaled(highest, scale),
        grayHardness: scaled(metal, scale),
    };
}

/**
 * The Instinct: the colour with the most Mass. A tie is the player's to break (guide §4.5) — if their
 * choice is among the tied colours it wins, otherwise the tie stands unbroken and there is no Instinct
 * until they choose, rather than one picked for them by list order.
 */
export function instinctOf(totals, tiebreak = null) {
    const best = Math.max(0, ...Object.values(totals));
    if (best === 0) return { instinct: null, tied: [] };
    const tied = COLOURS.filter((c) => totals[c] === best);
    if (tied.length === 1) return { instinct: tied[0], tied };
    return { instinct: tied.includes(tiebreak) ? tiebreak : null, tied };
}

/**
 * May this Substrate be fed now? Returns `{ ok, reason, depth }`.
 *
 * Depth rises by one; the cost is the Mass of the **new** Depth in total, so the step itself costs one more
 * in its track. The cap is the level's; a specimen for Depth 3–4 must be quickened (guide §4.4).
 */
export function feedCheck({ slug, paid, catalogue, grants, specimen }) {
    const entry = catalogue[slug];
    if (!entry) return { ok: false, reason: `There is no Substrate called "${slug}".` };
    const depth = (paid[slug] ?? 0) + 1;
    if (depth > grants.depthCap) {
        return { ok: false, reason: `${entry.name} would reach Depth ${depth}; your Depth cap is ${grants.depthCap}.` };
    }
    const spent = spentOf(paid, catalogue)[entry.kind];
    const pool = grants[entry.kind];
    if (spent + 1 > pool) {
        return { ok: false, reason: `Not enough ${entry.kind} Mass: ${spent} of ${pool} spent, and Depth ${depth} costs one more.` };
    }
    if (depth >= 3 && specimen !== "quickened") {
        return { ok: false, reason: `Depth ${depth} takes a quickened specimen — one that grew somewhere the mundane world doesn't reach.` };
    }
    if (!specimen) return { ok: false, reason: `Feeding ${entry.name} takes a specimen of it, or a grant from the Vein.` };
    return { ok: true, depth };
}

/* -------------------------------------------------------------------------------------------- */
/*  The engine                                                                                  */
/* -------------------------------------------------------------------------------------------- */

let catalogueCache = null;
let bondCache = null;

/** One writer per actor at a time: rebuilds queue behind each other rather than interleaving. */
const queues = new WeakMap();

function isWriter() {
    return game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM;
}

export const Engine = {
    isAssimilator(actor) {
        return actor?.class?.slug === "assimilator";
    },

    state(actor) {
        const s = foundry.utils.deepClone(actor?.flags?.[MODULE_ID]?.[KEY] ?? {});
        s.substrates ??= {};
        s.bonds ??= [];
        s.veinUsed ??= 0;
        s.instinct ??= null;
        s.tiebreak ??= null;
        s.preparing ??= false;
        s.choices ??= {};
        return s;
    },

    /** The Substrates the packs define, keyed by slug: `{ name, colour, kind, uuid }`. */
    async catalogue() {
        if (catalogueCache) return catalogueCache;
        const docs = (await game.packs.get(PACKS.substrates)?.getDocuments()) ?? [];
        catalogueCache = {};
        for (const doc of docs) {
            const s = doc.flags?.[MODULE_ID]?.[KEY]?.substrate;
            if (s?.slug) {
                catalogueCache[s.slug] = { ...s, name: doc.name, uuid: doc.uuid, doc, damageFrom: damageFrom(doc.system.rules),
                    damageType: damageTypeOf(doc.system.rules) };
            }
        }
        return catalogueCache;
    },

    /** Each Bond's two Substrates, keyed by the Bond's slug. */
    async bondPairs() {
        const out = {};
        for (const [slug, bond] of Object.entries(await Engine.bondCatalogue())) out[slug] = bond.substrates;
        return out;
    },

    async bondCatalogue() {
        // Read once: every rebuild asks which Bonds are in force, and the pack does not change mid-session.
        if (bondCache) return bondCache;
        const docs = (await game.packs.get(PACKS.bonds)?.getDocuments()) ?? [];
        const out = {};
        for (const doc of docs) {
            const b = doc.flags?.[MODULE_ID]?.[KEY]?.bond;
            if (b?.substrates) out[doc.system.slug ?? doc.slug] = { ...b, name: doc.name, uuid: doc.uuid, doc };
        }
        bondCache = out;
        return out;
    },

    grants(actor) {
        return grantsOf(actor.items.contents.map((i) => i.flags?.[MODULE_ID]?.[KEY]?.grants));
    },

    /** Everything the Gullet shows and the rules read, computed from the record and the owned features. */
    async derive(actor, state = Engine.state(actor)) {
        const catalogue = await Engine.catalogue();
        const grants = Engine.grants(actor);
        const effective = Engine.effectiveDepths(actor, state, grants);
        const totals = colourTotals(state.substrates, catalogue);
        const electrumColour = state.choices.electrum ?? null;
        const counts = colourCounts(effective, catalogue, electrumColour);
        const bonds = activeBonds(state.bonds.slice(0, grants.bondSlots), effective, await Engine.bondPairs(),
            state.choices.electrumBond ?? null);
        const instincts = instinctsOf(state.instinct, effective.electrum ?? 0, electrumColour, bonds.includes("transmutation"));
        return {
            bonds,
            colourCount: counts,
            instincts,
            iv: instinctValues({ effective, catalogue, counts, scale: instincts.scale }),
            mass: { gem: grants.gem, metal: grants.metal },
            spent: spentOf(state.substrates, catalogue),
            depthCap: grants.depthCap,
            bondSlots: grants.bondSlots,
            vein: Math.max(0, grants.sources - state.veinUsed),
            colours: totals,
            effective,
            highestDepth: Math.max(0, ...Object.values(effective)),
            // A broken Carapace switches every Mutation at Depth 3+ off, so it deals no damage to count.
            mutationDepth: mutationDepth(Engine.workingDepths(actor, effective), catalogue),
            instinctType: INSTINCT_TYPES[state.instinct] ?? "bludgeoning",
            substrateHardness: substrateHardness(Engine.workingDepths(actor, effective), catalogue, {
                stack: bonds.includes("adamant-shell"),
                extra: (state.choices.nickel ?? []).includes("plate") && effective.nickel ? [3] : [],
            }),
            pending: instinctOf(totals, state.tiebreak),
        };
    },

    /**
     * The Depth each Substrate actually manifests at: what was paid, held to the cap. Apotheosis lifts every
     * bound Substrate to the cap while its effect lasts (guide §4.9).
     */
    effectiveDepths(actor, state, grants) {
        const effects = actor.itemTypes?.effect ?? [];
        const apotheosis = effects.some((e) => e.slug === "effect-apotheosis");
        const out = {};
        for (const [slug, paid] of Object.entries(state.substrates)) {
            if (paid <= 0) continue;
            out[slug] = apotheosis ? grants.depthCap : Math.min(paid, grants.depthCap);
        }
        // Gold's Gilded Core: the chosen other Substrates count one Depth higher, never above the cap. One choice,
        // two from Gold Depth 3 (lexicon §6).
        const gold = out.gold ?? 0;
        if (gold >= 1 && !apotheosis) {
            const picks = (state.choices.gold ?? []).filter((s) => s !== "gold" && s in out).slice(0, gold >= 3 ? 2 : 1);
            for (const slug of picks) out[slug] = Math.min(out[slug] + 1, grants.depthCap);
            // Gilded Apotheosis: the first chosen manifests at Depth 4 for a minute.
            if (picks[0] && effects.some((e) => e.slug === "effect-gilded-apotheosis")) out[picks[0]] = 4;
        }
        // The Instincts that move a Depth. Electrum's second colour is in force from Electrum Depth 3; "+1" at half
        // value is still 1, so the scale changes nothing here.
        const active = new Set([state.instinct, (out.electrum ?? 0) >= 3 ? state.choices.electrum : null].filter(Boolean));
        if (!apotheosis && active.has("gold")) {
            // Gold: "one Depth higher for its numeric effects, never above your Depth cap."
            const pick = state.choices.goldInstinct;
            if (pick in out) out[pick] = Math.min(out[pick] + 1, grants.depthCap);
        }
        if (!apotheosis && active.has("purple")) {
            // Purple: one of your choice manifests one higher — the clause names no cap but the ladder's own top —
            // and one other, rolled at preparations, one lower. A Depth 1 Substrate lowered does not manifest today.
            const { purpleUp: up, purpleDown: down } = state.choices;
            if (up in out) out[up] = Math.min(out[up] + 1, 4);
            if (down in out && down !== up) {
                out[down] -= 1;
                if (out[down] <= 0) delete out[down];
            }
        }
        return out;
    },

    /** The Mutations actually working: all of them, less every one at Depth 3+ while the plate is broken. */
    workingDepths(actor, effective) {
        const broken = actor.itemTypes?.effect?.some((e) => e.slug === "effect-carapace-broken");
        if (!broken) return effective;
        return Object.fromEntries(Object.entries(effective).filter(([, depth]) => depth < 3));
    },

    /**
     * Write the record. Foundry *merges* an object into a flag, so a key the new record no longer has — a
     * Substrate shed to nothing, a choice cleared — would survive the write. Each one is deleted explicitly.
     */
    async write(actor, state) {
        const base = `flags.${MODULE_ID}.${KEY}`;
        const before = actor.flags?.[MODULE_ID]?.[KEY] ?? {};
        const update = { [base]: state };
        for (const field of ["substrates", "choices"]) {
            for (const key of Object.keys(before[field] ?? {})) {
                if (!(key in (state[field] ?? {}))) update[`${base}.${field}.-=${key}`] = null;
            }
        }
        await actor.update(update, { assimilatorEngine: true });
    },

    /** Queue a rebuild. Safe to call from any hook; only the writer client does anything. */
    rebuild(actor) {
        if (!actor || !isWriter() || !Engine.isAssimilator(actor)) return Promise.resolve();
        const previous = queues.get(actor) ?? Promise.resolve();
        const next = previous.then(() => Engine._rebuild(actor)).catch((error) =>
            console.error(`Isaac's Homebrew | the Assimilator could not rebuild ${actor.name}`, error));
        queues.set(actor, next);
        return next;
    },

    async _rebuild(actor) {
        const state = Engine.state(actor);
        const catalogue = await Engine.catalogue();
        let derived = await Engine.derive(actor, state);

        // The first time anything is bound, the Instinct is read at once rather than waiting a night;
        // after that it moves only at daily preparations.
        const was = state.instinct;
        if (state.instinct === null && derived.pending.instinct) state.instinct = derived.pending.instinct;
        if (state.preparing) state.instinct = derived.pending.instinct;
        // Gold and Purple move Depths, so an Instinct that has just settled changes what everything manifests at.
        if (state.instinct !== was) derived = await Engine.derive(actor, state);

        const creates = [];
        const updates = [];
        const deletes = [];

        // Substrates. `intact` is written onto each so that breaking or mending the plate is an *update* of the
        // Substrate — the event pf2e re-tests a `reevaluateOnUpdate` GrantItem on, which is how a Depth 3 action
        // leaves the sheet with the plate and comes back with it.
        const intact = !actor.itemTypes.effect.some((e) => e.slug === "effect-carapace-broken");
        const owned = actor.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.[KEY]?.substrate);
        for (const [slug, depth] of Object.entries(derived.effective)) {
            const have = owned.find((e) => e.flags[MODULE_ID][KEY].substrate.slug === slug);
            if (!have) {
                const source = foundry.utils.deepClone(catalogue[slug].doc.toObject());
                source.system.badge = { ...(source.system.badge ?? {}), type: "counter", value: depth };
                foundry.utils.setProperty(source, `flags.${MODULE_ID}.${KEY}.intact`, intact);
                creates.push(source);
            } else if (have.system.badge?.value !== depth || have.flags[MODULE_ID][KEY].intact !== intact) {
                updates.push({ _id: have.id, "system.badge.value": depth, [`flags.${MODULE_ID}.${KEY}.intact`]: intact });
            }
        }
        for (const e of owned) if (!(e.flags[MODULE_ID][KEY].substrate.slug in derived.effective)) deletes.push(e.id);

        // The Instinct: the recorded colour's effect, and from Electrum Depth 3 the second colour's beside it. The
        // effect is the clause; which one is *the* Instinct — the damage type, `assimilator:instinct:<colour>` — is
        // the primary's alone, so that option is written below rather than by the effect.
        const settled = instinctsOf(state.instinct, derived.effective.electrum ?? 0, state.choices.electrum ?? null,
            derived.bonds.includes("transmutation"));
        const instincts = actor.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.[KEY]?.instinct);
        const wantedColours = [settled.primary, settled.secondary].filter(Boolean);
        for (const e of instincts) if (!wantedColours.includes(e.flags[MODULE_ID][KEY].instinct)) deletes.push(e.id);
        const missingColours = wantedColours.filter((c) => !instincts.some((e) => e.flags[MODULE_ID][KEY].instinct === c));
        if (missingColours.length) {
            const docs = (await game.packs.get(PACKS.effects)?.getDocuments()) ?? [];
            for (const colour of missingColours) {
                const doc = docs.find((d) => d.flags?.[MODULE_ID]?.[KEY]?.instinct === colour);
                if (doc) creates.push(doc.toObject());
            }
        }

        // Bonds: the slotted ones, as many as there are slots. Suppression below Depth 2 is each Bond's own
        // predicate, so a Bond whose Substrate is shed stays slotted and simply stops (guide §7).
        const slotted = state.bonds.slice(0, derived.bondSlots);
        const bondEffects = actor.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.[KEY]?.bond);
        const bondCatalogue = slotted.length || bondEffects.length ? await Engine.bondCatalogue() : {};
        for (const e of bondEffects) if (!slotted.includes(e.slug)) deletes.push(e.id);
        for (const slug of slotted) {
            if (!bondEffects.some((e) => e.slug === slug) && bondCatalogue[slug]) creates.push(bondCatalogue[slug].doc.toObject());
        }

        // Nickel's Aberrations: the chosen ones, as many as its Depth holds.
        const aberrations = actor.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.[KEY]?.aberration);
        const held = derived.effective.nickel
            ? (state.choices.nickel ?? []).slice(0, Engine.aberrationCount(derived.effective.nickel, derived.bonds))
            : [];
        for (const e of aberrations) if (!held.includes(e.flags[MODULE_ID][KEY].aberration)) deletes.push(e.id);
        const missing = held.filter((k) => !aberrations.some((e) => e.flags[MODULE_ID][KEY].aberration === k));
        if (missing.length) {
            const docs = (await game.packs.get(PACKS.effects)?.getDocuments()) ?? [];
            for (const key of missing) {
                const doc = docs.find((d) => d.flags?.[MODULE_ID]?.[KEY]?.aberration === key);
                if (doc) creates.push(doc.toObject());
            }
        }

        if (deletes.length) await actor.deleteEmbeddedDocuments("Item", [...new Set(deletes)]);
        if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
        if (creates.length) await actor.createEmbeddedDocuments("Item", creates);

        const derivedFlag = {
            mass: derived.mass, spent: derived.spent, depthCap: derived.depthCap, bondSlots: derived.bondSlots,
            vein: derived.vein, highestDepth: derived.highestDepth, mutationDepth: derived.mutationDepth,
            // From the Instinct as this rebuild settled it, not as `derive` read it before the first binding set one.
            instinctType: INSTINCT_TYPES[state.instinct] ?? "bludgeoning", substrateHardness: derived.substrateHardness,
            colours: derived.colours, effective: derived.effective,
            colourCount: derived.colourCount, instincts: settled, bonds: derived.bonds,
            fastHealing: Math.max(
                EMERALD_FAST_HEALING[Math.min(Engine.workingDepths(actor, derived.effective).emerald ?? 0, 4)] ?? 0,
                [settled.primary, settled.secondary].includes("green")
                    ? instinctValues({ effective: derived.effective, catalogue, counts: derived.colourCount, scale: settled.scale }).greenHealing
                    : 0),
            mutationType: mutationTypeOf(Engine.workingDepths(actor, derived.effective), catalogue,
                INSTINCT_TYPES[state.instinct] ?? "bludgeoning"),
            iv: instinctValues({ effective: derived.effective, catalogue, counts: derived.colourCount, scale: settled.scale }),
        };
        // Write only what a rebuild owns — the derived picture and the Instinct it settled — never the record it
        // read at the start. A rebuild awaits item work in between, and writing the whole record back clobbered
        // anything written meanwhile: driven by the rig, a Zinc choice set while a rebuild was running vanished,
        // and with it Shifting Tissue's resistance.
        const now = actor.flags?.[MODULE_ID]?.[KEY] ?? {};
        const update = {};
        if (JSON.stringify(now.derived) !== JSON.stringify(derivedFlag)) {
            update[`flags.${MODULE_ID}.${KEY}.derived`] = derivedFlag;
            // `effective` is the one sparse field; a Substrate shed away must leave it, not merge past.
            for (const slug of Object.keys(now.derived?.effective ?? {})) {
                if (!(slug in derivedFlag.effective)) update[`flags.${MODULE_ID}.${KEY}.derived.effective.-=${slug}`] = null;
            }
            if (JSON.stringify(now.derived?.bonds) !== JSON.stringify(derivedFlag.bonds)) {
                update[`flags.${MODULE_ID}.${KEY}.derived.bonds`] = derivedFlag.bonds;
            }
            for (const slug of Object.keys(now.derived?.iv?.red ?? {})) {
                if (!(slug in derivedFlag.iv.red)) update[`flags.${MODULE_ID}.${KEY}.derived.iv.red.-=${slug}`] = null;
            }
        }
        if (now.instinct !== state.instinct) update[`flags.${MODULE_ID}.${KEY}.instinct`] = state.instinct;
        const toggles = actor.flags?.pf2e?.rollOptions?.all ?? {};
        const emerald = EMERALD_FAST_HEALING[Math.min(Engine.workingDepths(actor, derived.effective).emerald ?? 0, 4)] ?? 0;
        const outheals = [settled.primary, settled.secondary].includes("green") && derivedFlag.iv.greenHealing > emerald;
        if (outheals && !toggles[GREEN_OUTHEALS]) update[`flags.pf2e.rollOptions.all.${GREEN_OUTHEALS}`] = true;
        if (!outheals && toggles[GREEN_OUTHEALS]) update[`flags.pf2e.rollOptions.all.-=${GREEN_OUTHEALS}`] = null;
        // The Bonds in force, one option each: every Bond rule and every line of Bond code keys off it.
        for (const slug of Object.keys(await Engine.bondPairs())) {
            const option = bondOption(slug);
            const on = derived.bonds.includes(slug);
            if (on && !toggles[option]) update[`flags.pf2e.rollOptions.all.${option}`] = true;
            if (!on && toggles[option]) update[`flags.pf2e.rollOptions.all.-=${option}`] = null;
        }
        for (const colour of COLOURS) {
            const option = `assimilator:instinct:${colour}`;
            if (colour === settled.primary && !toggles[option]) update[`flags.pf2e.rollOptions.all.${option}`] = true;
            if (colour !== settled.primary && toggles[option]) update[`flags.pf2e.rollOptions.all.-=${option}`] = null;
        }
        if (Object.keys(update).length) await actor.update(update, { assimilatorEngine: true });
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  What a player does                                                                      */
    /* ---------------------------------------------------------------------------------------- */

    /**
     * Specimens the character is carrying, for one Substrate.
     *
     * An **ordinary** specimen is anything whose name is the Substrate's own, or its period name — the
     * looted ruby, the copper ingot (lexicon §15.3–15.4). A **quickened** one is marked by the GM with
     * `flags["isaacs-hb-pf2e"].assimilator.specimen = { substrate, quickened: true }`, because what grew at a
     * planar breach is the GM's to say.
     */
    async specimensFor(actor, slug) {
        const entry = (await Engine.catalogue())[slug];
        if (!entry) return [];
        const names = [entry.specimenNames ?? [], entry.name.replace(/^Substrate:\s*/, "")].flat()
            .map((n) => n.toLowerCase());
        return actor.items.filter((item) => {
            if (!item.isOfType?.("physical")) return false;
            const marked = item.flags?.[MODULE_ID]?.[KEY]?.specimen;
            if (marked) return marked.substrate === slug;
            return names.some((n) => new RegExp(`\\b${n}\\b`, "i").test(item.name));
        }).map((item) => ({
            id: item.id, name: item.name, quantity: item.quantity ?? 1,
            quickened: !!item.flags?.[MODULE_ID]?.[KEY]?.specimen?.quickened,
        }));
    },

    /**
     * Feed ◆◆◆◆ (10 minutes): consume a specimen, or spend a grant from the Vein, and raise a Substrate's
     * Depth by one. Refused in an encounter — ten minutes do not fit in one.
     */
    async feed(actor, slug, { itemId = null, vein = false } = {}) {
        const state = Engine.state(actor);
        const catalogue = await Engine.catalogue();
        if (game.combats?.some((c) => c.started && c.combatants.some((x) => x.actor?.id === actor.id))) {
            return Engine._refuse("Feeding takes 10 minutes; it cannot be done in an encounter.");
        }

        let specimen = null;
        let item = null;
        if (itemId) {
            item = actor.items.get(itemId);
            const found = (await Engine.specimensFor(actor, slug)).find((s) => s.id === itemId);
            if (!found) return Engine._refuse(`${item?.name ?? "That"} is not a specimen of ${catalogue[slug]?.name ?? slug}.`);
            specimen = found.quickened ? "quickened" : "ordinary";
        } else if (vein) {
            const derived = await Engine.derive(actor, state);
            if (derived.vein <= 0) return Engine._refuse("The Vein has nothing left to give until your Mass next grows.");
            specimen = "ordinary";
        }

        const check = feedCheck({ slug, paid: state.substrates, catalogue, grants: Engine.grants(actor), specimen });
        if (!check.ok) return Engine._refuse(check.reason);

        if (item) {
            if ((item.quantity ?? 1) > 1) await item.update({ "system.quantity": item.quantity - 1 });
            else await item.delete();
        }
        if (vein && !item) state.veinUsed += 1;
        state.substrates[slug] = check.depth;
        await Engine.write(actor, state);
        await Engine.rebuild(actor);
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            flags: { [MODULE_ID]: { assimilatorFeed: { slug, depth: check.depth } } },
            content: `<p><strong>Feed</strong>: ${actor.name} consumes ${item ? item.name : "a grant from the Vein"}. `
                + `<strong>${catalogue[slug].name}</strong> is now at <strong>Depth ${check.depth}</strong>.</p>`,
        });
        return { ok: true, depth: check.depth };
    },

    /**
     * Mend the Carapace by the second road guide §4.3 gives: *"one hour of Feeding it any Substrate you don't
     * bind."* The specimen is consumed and the plate is whole. (The first road, the Repair activity, is pf2e's
     * own on the Living Plate item.)
     */
    async mend(actor, itemId) {
        const item = actor.items.get(itemId);
        const catalogue = await Engine.catalogue();
        const state = Engine.state(actor);
        const match = [];
        for (const slug of Object.keys(catalogue)) {
            if (slug in state.substrates) continue;
            if ((await Engine.specimensFor(actor, slug)).some((s) => s.id === itemId)) match.push(slug);
        }
        if (!item || !match.length) return Engine._refuse("Mending takes a specimen of a Substrate you do not bind.");
        const plate = actor.itemTypes.armor.find((a) => a.slug === "living-plate");
        if (!plate) return Engine._refuse("There is no Carapace to mend.");
        if ((item.quantity ?? 1) > 1) await item.update({ "system.quantity": item.quantity - 1 });
        else await item.delete();
        await plate.update({ "system.hp.value": plate.hitPoints.max });
        await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }),
            content: `<p><strong>The Carapace mends</strong>: an hour of feeding it ${item.name}.</p>` });
        return { ok: true };
    },

    /** Shed — during daily preparations only. Lower a Substrate's Depth (to 0 removes it); it is destroyed. */
    async shed(actor, slug, toDepth = 0) {
        const state = Engine.state(actor);
        if (!state.preparing) return Engine._refuse("You may shed only during your daily preparations.");
        const current = state.substrates[slug] ?? 0;
        if (toDepth >= current || toDepth < 0) return Engine._refuse("Shedding lowers a Depth; it cannot raise one.");
        if (toDepth === 0) delete state.substrates[slug];
        else state.substrates[slug] = toDepth;
        await Engine.write(actor, state);
        await Engine.rebuild(actor);
        return { ok: true };
    },

    /** Break an Instinct tie — freely, but only at daily preparations (guide §4.5). */
    async breakTie(actor, colour) {
        const state = Engine.state(actor);
        if (!state.preparing && state.instinct !== null) {
            return Engine._refuse("Ties are broken at daily preparations.");
        }
        state.tiebreak = colour;
        await Engine.write(actor, state);
        await Engine.rebuild(actor);
        return { ok: true };
    },

    /**
     * Slot a Bond. A new slot is filled when gained; a filled one changes only at daily preparations, and
     * only to a Bond whose requirements are met (guide §7).
     */
    async setBond(actor, index, slug) {
        const state = Engine.state(actor);
        const derived = await Engine.derive(actor, state);
        if (index >= derived.bondSlots) return Engine._refuse("You have no Bond slot there yet.");
        const replacing = !!state.bonds[index];
        if (replacing && !state.preparing) return Engine._refuse("A Bond changes only at daily preparations.");
        if (slug) {
            const bond = (await Engine.bondCatalogue())[slug];
            if (!bond) return Engine._refuse(`There is no Bond called "${slug}".`);
            const met = activeBonds([slug], derived.effective, { [slug]: bond.substrates }, state.choices.electrumBond ?? null);
            if (!met.length) {
                const unmet = bond.substrates.filter((s) => (derived.effective[s] ?? 0) < 2);
                return Engine._refuse(`${bond.name} needs ${unmet.join(" and ")} at Depth 2 or higher.`);
            }
            if (state.bonds.includes(slug)) return Engine._refuse(`${bond.name} is already slotted.`);
        }
        state.bonds[index] = slug ?? null;
        state.bonds = state.bonds.filter(Boolean);
        await Engine.write(actor, state);
        await Engine.rebuild(actor);
        return { ok: true };
    },

    /**
     * A daily choice: Gold's Substrates, Electrum's second colour, Zinc's energy type, Nickel's Aberrations.
     * Made at daily preparations — or the first time, whenever it is first needed, since a Substrate fed in the
     * afternoon should not wait a night to do anything.
     */
    async choose(actor, key, value) {
        const state = Engine.state(actor);
        const current = state.choices[key];
        const first = current === undefined || current === null || (Array.isArray(current) && !current.length);
        // Zinc Depth 2's *Shift Tissue* lets the type change once, whenever; its use sets `zincShift`.
        const shifting = key === "zinc" && actor.flags?.[MODULE_ID]?.[KEY]?.zincShift;
        if (!state.preparing && !first && !shifting) return Engine._refuse("That choice is made at daily preparations.");
        if (shifting) state.zincShift = false;
        if (key === "nickel") value = [value].flat().filter((k) => ABERRATIONS.includes(k));
        if (key === "electrumBond" && value && !(await Engine.bondCatalogue())[value]) return Engine._refuse(`There is no Bond called "${value}".`);
        if (key === "gold") value = [value].flat().filter((s) => s && s !== "gold" && s in state.substrates);
        if ((key === "goldInstinct" || key === "purpleUp") && !(value in state.substrates)) {
            return Engine._refuse("Choose a Substrate you bind.");
        }
        state.choices[key] = value;
        // Purple: the other one is not chosen. It is rolled when the first is, and again each morning.
        if (key === "purpleUp") state.choices.purpleDown = Engine.rollPurpleDown(state);
        await Engine.write(actor, state);
        await Engine.rebuild(actor);
        return { ok: true };
    },

    /** Nickel: roll the Aberrations — at daily preparations, or by the Depth 3 re-roll. */
    /** Aberrations held at a Nickel Depth; Chimera (Electrum + Nickel) holds one more. */
    aberrationCount(depth, bonds = []) {
        return (ABERRATION_COUNT[Math.min(depth, 4)] ?? 0) + (bonds.includes("chimera") ? 1 : 0);
    },

    async rollAberrations(actor, { reroll = false, forced = false } = {}) {
        const state = Engine.state(actor);
        const derived = await Engine.derive(actor, state);
        const depth = derived.effective.nickel ?? 0;
        if (!depth) return Engine._refuse("Nickel is not bound.");
        // `forced`: Runaway Growth re-rolls them by itself, whatever Nickel's Depth.
        if (reroll && !forced && depth < 3) return Engine._refuse("Re-rolling your Aberrations takes Nickel at Depth 3.");
        if (!reroll && !state.preparing && (state.choices.nickel ?? []).length) {
            return Engine._refuse("Aberrations are rolled at daily preparations.");
        }
        const pool = [...ABERRATIONS];
        const picked = [];
        for (let i = 0; i < Engine.aberrationCount(depth, derived.bonds); i++) {
            picked.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
        }
        state.choices.nickel = picked;
        await Engine.write(actor, state);
        await Engine.rebuild(actor);
        return { ok: true, picked };
    },

    /** Purple: "one other, randomly determined" — any bound Substrate but the one raised. */
    rollPurpleDown(state) {
        const pool = Object.keys(state.substrates).filter((s) => s !== state.choices.purpleUp && state.substrates[s] > 0);
        return pool.length ? pool[Math.floor(Math.random() * pool.length)] : null;
    },

    /** Daily preparations open with Rest for the Night and close when the owner says so, or combat starts. */
    async beginPreparations(actor) {
        const state = Engine.state(actor);
        if (state.preparing) return;
        state.preparing = true;
        await Engine.write(actor, state);
        await Engine.rebuild(actor);
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            whisper: game.users.filter((u) => actor.testUserPermission(u, "OWNER")).map((u) => u.id),
            content: `<p><strong>Daily preparations.</strong> ${actor.name} may Shed, break an Instinct tie and change `
                + `Bonds in the Gullet until they finish preparing.</p>`,
        });
    },

    async endPreparations(actor) {
        const state = Engine.state(actor);
        if (!state.preparing) return;
        await Engine.rebuild(actor);
        const settled = Engine.state(actor);
        settled.preparing = false;
        // A new morning rolls Purple's lowered Substrate again.
        if (settled.choices.purpleUp) settled.choices.purpleDown = Engine.rollPurpleDown(settled);
        await Engine.write(actor, settled);
        await Engine.rebuild(actor);
    },

    _refuse(reason) {
        ui.notifications?.warn(reason);
        return { ok: false, reason };
    },

    registerHooks() {
        Hooks.on("pf2e.restForTheNight", (actor) => {
            if (Engine.isAssimilator(actor) && isWriter()) Engine.beginPreparations(actor);
        });
        Hooks.on("combatStart", (combat) => {
            if (!isWriter()) return;
            for (const c of combat.combatants) if (Engine.state(c.actor).preparing) Engine.endPreparations(c.actor);
        });
        // The record changed, a level changed, or a feature that grants Mass came or went.
        Hooks.on("updateActor", (actor, change, options) => {
            if (options?.assimilatorEngine) return;
            if (change?.system?.details?.level || change?.flags?.[MODULE_ID]?.[KEY]) Engine.rebuild(actor);
        });
        const itemChanged = (item) => {
            const flag = item.flags?.[MODULE_ID]?.[KEY];
            const moves = ["effect-apotheosis", "effect-carapace-broken", "effect-gilded-apotheosis", "adamant-shell"]
                .includes(item.slug);
            if (flag?.grants || moves || item.type === "class") Engine.rebuild(item.actor);
        };
        Hooks.on("createItem", itemChanged);
        Hooks.on("deleteItem", itemChanged);
    },
};

import { MODULE_ID } from "../sky/signs.mjs";
import { suppressed } from "./damage.mjs";

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
/** The effect a critical hit's "counts as Depth 4 for that Strike" leaves (#86). */
export const DEPTH_FOUR = "effect-depth-4-for-this-strike";

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
    const out = { gem: 0, metal: 0, depthCap: 0, bondSlots: 0, sources: 0, merged: false };
    for (const g of blocks) {
        if (!g) continue;
        // Omnivore: "your Gem Mass and Metal Mass merge into a single pool of their combined size."
        if (g.merged) out.merged = true;
        out.gem += g.gem ?? 0;
        out.metal += g.metal ?? 0;
        out.bondSlots += g.bondSlots ?? 0;
        out.depthCap = Math.max(out.depthCap, g.depthCap ?? 0);
        // "Every time your Mass increases, you gain one free Substrate" — one per feature that raises it. Borrowed Mass
        // (Eat the World's four) is not an increase of that kind.
        if (((g.gem ?? 0) > 0 || (g.metal ?? 0) > 0) && !g.temporary) out.sources += 1;
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
        // Fifth Depth (#96): Depth 5's numbers are Depth 4's by half again, rounded up.
        if (ladder) bonuses.push(depth >= 5 ? Math.ceil((ladder[4] ?? 0) * 1.5) : (ladder[Math.min(depth, 4)] ?? 0));
    }
    if (bonuses.length === 0) return 0;
    return stack ? bonuses.reduce((a, b) => a + b, 0) : Math.max(...bonuses);
}

/**
 * Fifth Depth — *"its Depth 4 rider applies twice where that is meaningful, and all of its numeric values increase
 * by half again"* (#96). Every number the Substrate's rules grant goes up by half, rounded up: a bonus, a
 * resistance, fast healing, a Speed, a number of damage dice. A penalty is not a grant and stays. "Twice where that
 * is meaningful" is a judgement the clause leaves to the table, so a Note says so.
 */
export function fifthDepthRules(rules, name = "This Substrate") {
    const up = (v) => Math.ceil(v * 1.5);
    const out = (rules ?? []).map((rule) => {
        const r = foundry.utils.deepClone(rule);
        if (["FlatModifier", "Resistance", "FastHealing", "BaseSpeed"].includes(r.key) && typeof r.value === "number" && r.value > 0) r.value = up(r.value);
        if (r.key === "DamageDice" && typeof r.diceNumber === "number" && r.diceNumber > 0) r.diceNumber = up(r.diceNumber);
        return r;
    });
    out.push({ key: "Note", selector: "all", title: "Fifth Depth",
        text: `${name.replace(/^Substrate:\s*/, "")} is at Depth 5: its numbers are half again, and its Depth 4 rider applies twice where that is meaningful — the table's judgement.` });
    return out;
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
export function activeBonds(slotted, effective, pairs, standIn = null, bondedDeep = null) {
    return slotted.filter((slug) => {
        const pair = pairs[slug];
        if (!pair) return false;
        // Bonded Deep: "One Bond you know functions with its Substrates at Depth 1 instead of Depth 2."
        const need = slug === bondedDeep ? 1 : 2;
        const deep = (s) => (effective[s] ?? 0) >= need;
        const met = pair.filter(deep).length;
        if (met === 2) return true;
        return met === 1 && standIn === slug && (effective.electrum ?? 0) >= Math.min(need, 2) && !pair.includes("electrum");
    });
}

/** The option a Bond's rules and code key off while it is in force. */
export const bondOption = (slug) => `assimilator:bond:${slug}`;

/**
 * The Instinct clauses in force. Electrum Depth 3 adds the second colour's clause — "but both clauses operate at
 * half value"; Depth 4, "both at full value". A second colour that *is* the Instinct adds nothing.
 */
export function instinctsOf(primary, electrumDepth = 0, electrumColour = null, transmutation = false, feats = {}) {
    const valid = (c) => primary && COLOURS.includes(c) && c !== primary;
    const offers = [];
    // Electrum Depth 3: the second colour's clause, at half (three-quarters under Transmutation); Depth 4, full.
    if (electrumDepth >= 3 && valid(electrumColour)) {
        offers.push({ colour: electrumColour, scale: electrumDepth >= 4 ? 1 : (transmutation ? 0.75 : 0.5) });
    }
    // Two Instincts: a second clause of your choice at half value; Omnivore: two Instincts at full value.
    if (feats.twoInstincts && valid(feats.twoInstincts)) {
        offers.push({ colour: feats.twoInstincts, scale: feats.omnivore ? 1 : 0.5 });
    }
    // "This does not stack with Electrum's Alloyed Instinct — take the better." One second clause, the better one.
    const best = offers.sort((a, b) => b.scale - a.scale)[0] ?? null;
    // Instinct Fusion: "Both of your Instinct clauses operate at full value."
    const scale = best ? (feats.fusion ? 1 : best.scale) : 1;
    return { primary: primary ?? null, secondary: best?.colour ?? null, scale };
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
export function feedCheck({ slug, paid, catalogue, grants, specimen, caps = {} }) {
    const entry = catalogue[slug];
    if (!entry) return { ok: false, reason: `There is no Substrate called "${slug}".` };
    const depth = (paid[slug] ?? 0) + 1;
    const cap = caps[slug] ?? grants.depthCap;
    if (depth > cap) {
        return { ok: false, reason: `${entry.name} would reach Depth ${depth}; its Depth cap is ${cap}.` };
    }
    const spentBy = spentOf(paid, catalogue);
    const spent = grants.merged ? spentBy.gem + spentBy.metal : spentBy[entry.kind];
    const pool = grants.merged ? grants.gem + grants.metal : grants[entry.kind];
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
        s.temporary ??= {};
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

    /** Does the character have this Assimilator feat? */
    hasFeat(actor, slug) {
        return (actor?.itemTypes?.feat ?? []).some((f) => f.slug === slug);
    },

    /** The Depth cap per Substrate where a feat moves it: Deep Vein one past the cap (to 4), Fifth Depth to 5. */
    caps(actor, state, grants) {
        const caps = {};
        const vein = state.choices.deepVein;
        if (vein && Engine.hasFeat(actor, "deep-vein")) caps[vein] = Math.min(4, grants.depthCap + 1);
        const fifth = state.choices.fifthDepth;
        if (fifth && Engine.hasFeat(actor, "fifth-depth")) caps[fifth] = 5;
        return caps;
    },

    /** Instinctive Surge: for the Instinct clause, every Substrate one Depth higher while its effect lasts. */
    surged(actor, effective) {
        if (!(actor?.itemTypes?.effect ?? []).some((e) => e.slug === "effect-instinctive-surge")) return effective;
        return Object.fromEntries(Object.entries(effective).map(([s, d]) => [s, Math.min(d + 1, 5)]));
    },

    /** The feats that shape the Instinct clauses. */
    instinctFeats(actor, state) {
        const omnivore = Engine.hasFeat(actor, "omnivore");
        return {
            twoInstincts: Engine.hasFeat(actor, "two-instincts") || omnivore ? state.choices.twoInstincts ?? null : null,
            fusion: Engine.hasFeat(actor, "instinct-fusion"),
            omnivore,
        };
    },

    /** Greater Bond: the chosen Bond's numbers ×1.5, keyed with underscores so a formula can read them. */
    greaterBond(actor, state) {
        const chosen = Engine.hasFeat(actor, "greater-bond") ? state.choices.greaterBond : null;
        const out = {};
        for (const slug of state.bonds ?? []) out[slug.replace(/-/g, "_")] = slug === chosen ? 1.5 : 1;
        return out;
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
            state.choices.electrumBond ?? null, Engine.hasFeat(actor, "bonded-deep") ? state.choices.bondedDeep ?? null : null);
        let instincts = instinctsOf(state.instinct, effective.electrum ?? 0, electrumColour, bonds.includes("transmutation"),
            Engine.instinctFeats(actor, state));
        // Chimera (#95, lexicon v3.4): its extra Aberration may instead be a bound Substrate of either Instinct's colour,
        // counting as Depth 4. It needs the Bonds, which need the Depths, so it is applied after both.
        const chimeraDeep = Engine.chimeraDeep(actor, state, effective, bonds, instincts, catalogue);
        if (chimeraDeep) {
            effective[chimeraDeep] = Math.max(effective[chimeraDeep], 4);
            instincts = instinctsOf(state.instinct, effective.electrum ?? 0, electrumColour, bonds.includes("transmutation"),
                Engine.instinctFeats(actor, state));
        }
        return {
            bonds,
            chimeraDeep,
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
        const caps = Engine.caps(actor, state, grants);
        const capOf = (slug) => caps[slug] ?? grants.depthCap;
        // Perfect Organism: "Every bound Substrate counts as being at your Depth cap."
        const organism = Engine.hasFeat(actor, "perfect-organism");
        for (const [slug, paid] of Object.entries(state.substrates)) {
            if (paid <= 0) continue;
            out[slug] = apotheosis || organism ? Math.max(Math.min(paid, capOf(slug)), grants.depthCap) : Math.min(paid, capOf(slug));
        }
        // Devouring Plate: a temporary Substrate at Depth 2 until the next daily preparations, costing no Mass.
        for (const [slug, depth] of Object.entries(state.temporary ?? {})) {
            if (!(slug in out)) out[slug] = Math.min(depth, grants.depthCap);
        }
        // Consume the Fallen: one bound Substrate one Depth higher until the next preparations, never above the cap.
        const fallen = state.choices.fallen;
        if (fallen && fallen in out) out[fallen] = Math.min(out[fallen] + 1, capOf(fallen));
        // Second Hunger: two Mass spent at once to deepen a bound Substrate, for as long as its effect lasts.
        for (const hunger of effects.filter((e) => e.slug === "effect-second-hunger")) {
            const slug = hunger.flags?.[MODULE_ID]?.[KEY]?.hungerFor;
            if (slug in out) out[slug] = Math.min(out[slug] + 2, capOf(slug));
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
        // Nickel Depth 4 (#89, the #86 ruling): one bound Purple Substrate may count as Depth 4, in place of the third
        // Aberration. Not on a broken plate, for the same reason as below.
        const purple = state.choices.nickelPurple;
        if ((out.nickel ?? 0) >= 4 && purple && purple !== "nickel" && purple in out
            && !effects.some((e) => e.slug === "effect-carapace-broken")) out[purple] = Math.max(out[purple], 4);
        // A critical hit's "counts as Depth 4 for that Strike" — Gold's Instinct, Topaz Depth 4, Apex Predator (#86: a
        // Depth is indivisible). Not on a broken plate, where §4.3 switches every Mutation at Depth 3 or higher off:
        // raising one to 4 there would take it away.
        if (!effects.some((e) => e.slug === "effect-carapace-broken")) {
            for (const four of effects.filter((e) => e.slug === DEPTH_FOUR)) {
                for (const slug of four.flags?.[MODULE_ID]?.[KEY]?.depthFour ?? []) if (slug in out) out[slug] = Math.max(out[slug], 4);
            }
        }
        return out;
    },

    /**
     * Make `slugs` count as Depth 4 for the Strike that just critically hit. The effect lasts until the next attack
     * is rolled or the turn ends — not only the damage roll, because some of a Depth 4 rider answers the damage
     * *landing* (Ruby's burning ground). Returns the Substrates raised, or null.
     */
    async depthFour(actor, slugs, { madeBy = null, why = "" } = {}) {
        if (!actor || actor.itemTypes.effect.some((e) => e.slug === "effect-carapace-broken")) return null;
        const bound = Engine.state(actor).substrates;
        const raised = [...new Set(slugs)].filter((s) => (bound[s] ?? 0) > 0);
        if (!raised.length) return null;
        const doc = ((await game.packs.get(PACKS.effects)?.getDocuments()) ?? []).find((d) => d.slug === DEPTH_FOUR);
        if (!doc) return null;
        const catalogue = await Engine.catalogue();
        const names = raised.map((s) => catalogue[s]?.name?.replace(/^Substrate:\s*/, "") ?? s);
        const source = foundry.utils.deepClone(doc.toObject());
        source.name = `Effect: Depth 4 — ${names.join(", ")}`;
        foundry.utils.setProperty(source, `flags.${MODULE_ID}.${KEY}`, { depthFour: raised, madeBy, why });
        await actor.createEmbeddedDocuments("Item", [source]);
        return raised;
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
        for (const field of ["substrates", "choices", "temporary"]) {
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
            // Fifth Depth (#96): a Substrate at Depth 5 carries its rules' numbers by half again; back below 5, the
            // compendium's own.
            const fifth = depth >= 5;
            if (!have) {
                const source = foundry.utils.deepClone(catalogue[slug].doc.toObject());
                source.system.badge = { ...(source.system.badge ?? {}), type: "counter", value: depth };
                foundry.utils.setProperty(source, `flags.${MODULE_ID}.${KEY}.intact`, intact);
                if (fifth) {
                    source.system.rules = fifthDepthRules(source.system.rules, source.name);
                    foundry.utils.setProperty(source, `flags.${MODULE_ID}.${KEY}.fifth`, true);
                }
                creates.push(source);
            } else if (have.system.badge?.value !== depth || have.flags[MODULE_ID][KEY].intact !== intact
                || !!have.flags[MODULE_ID][KEY].fifth !== fifth) {
                const update = { _id: have.id, "system.badge.value": depth, [`flags.${MODULE_ID}.${KEY}.intact`]: intact };
                if (!!have.flags[MODULE_ID][KEY].fifth !== fifth) {
                    const pristine = foundry.utils.deepClone(catalogue[slug].doc.toObject().system.rules);
                    update["system.rules"] = fifth ? fifthDepthRules(pristine, have.name) : pristine;
                    update[`flags.${MODULE_ID}.${KEY}.fifth`] = fifth;
                }
                updates.push(update);
            }
        }
        for (const e of owned) if (!(e.flags[MODULE_ID][KEY].substrate.slug in derived.effective)) deletes.push(e.id);

        // The Instinct: the recorded colour's effect, and from Electrum Depth 3 the second colour's beside it. The
        // effect is the clause; which one is *the* Instinct — the damage type, `assimilator:instinct:<colour>` — is
        // the primary's alone, so that option is written below rather than by the effect.
        const settled = instinctsOf(state.instinct, derived.effective.electrum ?? 0, state.choices.electrum ?? null,
            derived.bonds.includes("transmutation"), Engine.instinctFeats(actor, state));
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
        // Chimeric Frame: "two of Nickel's Aberrations without binding Nickel" — in addition to any Nickel holds.
        const frame = Engine.hasFeat(actor, "chimeric-frame") ? 2 : 0;
        const holds = (derived.effective.nickel ? Engine.aberrationCount(derived.effective.nickel, derived.bonds) : 0) + frame
            - Engine.purpleInstead(state, derived.effective) - (derived.chimeraDeep ? 1 : 0);
        const held = (state.choices.nickel ?? []).slice(0, holds);
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

        // Guide §4.2: other armour worn over the plate suppresses every Mutation and the Instinct. The items stay —
        // their rules carry the suppression as a predicate, and deleting them would hand back every granted action's
        // spent uses when the armour came off — but the picture every script reads goes dark: nothing bound, no
        // Instinct, no Bond. Mass, slots and the record itself are untouched, so taking the armour off restores it.
        const dark = suppressed(actor);
        const effective = dark ? {} : derived.effective;
        const counts = dark ? {} : derived.colourCount;
        const live = dark ? { primary: null, secondary: null, scale: 1 } : settled;
        const instinct = dark ? null : state.instinct;
        const iv = instinctValues({ effective: Engine.surged(actor, effective), catalogue, counts, scale: live.scale });
        // Except White's uses a day: that number is a frequency's maximum, and a maximum that fell to 0 and came back
        // must not look like a day's uses spent. Purify refuses a suppressed symbiont on its own.
        if (dark) iv.whiteUses = instinctValues({ effective: derived.effective, catalogue, counts: derived.colourCount,
            scale: settled.scale }).whiteUses;
        const derivedFlag = {
            mass: derived.mass, spent: derived.spent, depthCap: derived.depthCap, bondSlots: derived.bondSlots,
            vein: derived.vein, highestDepth: dark ? 0 : derived.highestDepth, mutationDepth: dark ? 0 : derived.mutationDepth,
            // From the Instinct as this rebuild settled it, not as `derive` read it before the first binding set one.
            instinctType: INSTINCT_TYPES[instinct] ?? "bludgeoning", substrateHardness: dark ? 0 : derived.substrateHardness,
            colours: derived.colours, effective,
            colourCount: counts, instincts: live, bonds: dark ? [] : derived.bonds,
            gb: Engine.greaterBond(actor, state),
            fastHealing: Math.max(
                EMERALD_FAST_HEALING[Math.min(Engine.workingDepths(actor, effective).emerald ?? 0, 4)] ?? 0,
                [live.primary, live.secondary].includes("green")
                    ? instinctValues({ effective, catalogue, counts, scale: live.scale }).greenHealing
                    : 0),
            mutationType: mutationTypeOf(Engine.workingDepths(actor, effective), catalogue,
                INSTINCT_TYPES[instinct] ?? "bludgeoning"),
            iv,
            suppressed: dark,
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
        const emerald = EMERALD_FAST_HEALING[Math.min(Engine.workingDepths(actor, effective).emerald ?? 0, 4)] ?? 0;
        const outheals = [live.primary, live.secondary].includes("green") && derivedFlag.iv.greenHealing > emerald;
        if (outheals && !toggles[GREEN_OUTHEALS]) update[`flags.pf2e.rollOptions.all.${GREEN_OUTHEALS}`] = true;
        if (!outheals && toggles[GREEN_OUTHEALS]) update[`flags.pf2e.rollOptions.all.-=${GREEN_OUTHEALS}`] = null;
        // Burrower: "a metal Substrate at Depth 2 or higher".
        const metal2 = Object.entries(effective).some(([s, d]) => catalogue[s]?.kind === "metal" && d >= 2);
        if (metal2 && !toggles["assimilator:metal-2"]) update["flags.pf2e.rollOptions.all.assimilator:metal-2"] = true;
        if (!metal2 && toggles["assimilator:metal-2"]) update["flags.pf2e.rollOptions.all.-=assimilator:metal-2"] = null;
        // The Bonds in force, one option each: every Bond rule and every line of Bond code keys off it.
        for (const slug of Object.keys(await Engine.bondPairs())) {
            const option = bondOption(slug);
            const on = derivedFlag.bonds.includes(slug);
            if (on && !toggles[option]) update[`flags.pf2e.rollOptions.all.${option}`] = true;
            if (!on && toggles[option]) update[`flags.pf2e.rollOptions.all.-=${option}`] = null;
        }
        // Nickel's Organ and Mode, as the Aberrations' rules read them (#89).
        for (const [key, all] of [["organ", ["darkvision", "scent", "low-light"]], ["mode", ["climb", "swim"]]]) {
            const pick = state.choices[`nickel${key[0].toUpperCase()}${key.slice(1)}`];
            for (const one of all) {
                const option = `assimilator:${key}:${one}`;
                if (pick === one && !toggles[option]) update[`flags.pf2e.rollOptions.all.${option}`] = true;
                if (pick !== one && toggles[option]) update[`flags.pf2e.rollOptions.all.-=${option}`] = null;
            }
        }
        // Reactive Evolution's working Depth (#96), as the option its resistances read: Moonstone's, or Perfect
        // Adaptation's — Depth 2 without Moonstone, one higher with it, for this Mutation alone.
        const moon = effective.moonstone ?? 0;
        const reactive = Math.min(Engine.hasFeat(actor, "perfect-adaptation") ? (moon ? moon + 1 : 2) : moon, 4);
        for (let d = 1; d <= 4; d++) {
            const option = `assimilator:reactive-depth:${d}`;
            if (d === reactive && !toggles[option]) update[`flags.pf2e.rollOptions.all.${option}`] = true;
            if (d !== reactive && toggles[option]) update[`flags.pf2e.rollOptions.all.-=${option}`] = null;
        }
        // Greater Bond (#96): which Bond, as an option the rules read — Storm Battery's wider cone keys off it.
        const greaterPick = Engine.hasFeat(actor, "greater-bond") ? state.choices.greaterBond : null;
        for (const slug of Object.keys(await Engine.bondPairs())) {
            const option = `assimilator:greater-bond:${slug}`;
            const on = slug === greaterPick && derivedFlag.bonds.includes(slug);
            if (on && !toggles[option]) update[`flags.pf2e.rollOptions.all.${option}`] = true;
            if (!on && toggles[option]) update[`flags.pf2e.rollOptions.all.-=${option}`] = null;
        }
        // Immune System (#95): Shifting Tissue naming disease is a bonus to saves, since pf2e has no disease resistance.
        const disease = state.choices.zinc === "disease";
        if (disease && !toggles["assimilator:zinc:disease"]) update["flags.pf2e.rollOptions.all.assimilator:zinc:disease"] = true;
        if (!disease && toggles["assimilator:zinc:disease"]) update["flags.pf2e.rollOptions.all.-=assimilator:zinc:disease"] = null;
        for (const colour of COLOURS) {
            const option = `assimilator:instinct:${colour}`;
            if (colour === live.primary && !toggles[option]) update[`flags.pf2e.rollOptions.all.${option}`] = true;
            if (colour !== live.primary && toggles[option]) update[`flags.pf2e.rollOptions.all.-=${option}`] = null;
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

        const grants = Engine.grants(actor);
        const check = feedCheck({ slug, paid: state.substrates, catalogue, grants, specimen, caps: Engine.caps(actor, state, grants) });
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
        // Gold Depth 2: "You may choose the Substrate again at the start of each encounter" (#86) — once an encounter.
        const encounter = game.combats?.find((c) => c.started && c.combatants.some((x) => x.actor?.id === actor.id));
        const regild = key === "gold" && encounter && (actor.flags?.[MODULE_ID]?.[KEY]?.derived?.effective?.gold ?? 0) >= 2
            && state.choices.goldEncounter !== encounter.id;
        if (!state.preparing && !first && !shifting && !regild) {
            return Engine._refuse(key === "gold" && encounter
                ? "Gilded Core's choice is made at daily preparations, and again once each encounter from Gold Depth 2."
                : "That choice is made at daily preparations.");
        }
        if (regild && !state.preparing) state.choices.goldEncounter = encounter.id;
        if (shifting) state.zincShift = false;
        if (key === "nickel") value = [value].flat().filter((k) => ABERRATIONS.includes(k));
        if (key === "electrumBond" && value && !(await Engine.bondCatalogue())[value]) return Engine._refuse(`There is no Bond called "${value}".`);
        if (key === "gold") value = [value].flat().filter((s) => s && s !== "gold" && s in state.substrates);
        if (["deepVein", "fifthDepth", "fallen"].includes(key) && value && !(value in state.substrates)) {
            return Engine._refuse("Choose a Substrate you bind.");
        }
        if (["bondedDeep", "greaterBond"].includes(key) && value && !state.bonds.includes(value)) {
            return Engine._refuse("Choose a Bond you know.");
        }
        if (key === "twoInstincts" && value && !COLOURS.includes(value)) return Engine._refuse(`"${value}" is not an Instinct.`);
        if (key === "nickelPurple" && value && !(["amethyst", "quartz", "platinum"].includes(value) && value in state.substrates)) {
            return Engine._refuse("Choose another Purple Substrate you bind: Amethyst, Quartz or Platinum.");
        }
        if (key === "chimeraDeep" && value && !(value in state.substrates)) return Engine._refuse("Choose a Substrate you bind.");
        if (key === "nickelOrgan" && !["darkvision", "scent", "low-light"].includes(value)) return Engine._refuse("An organ is darkvision, scent or low-light.");
        if (key === "nickelMode" && !["climb", "swim"].includes(value)) return Engine._refuse("A mode is climb or swim.");
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
    /**
     * Chimera — *"it may be drawn from the Depth-4 rider list of either of your Instincts"* (#95). Ruled as Nickel Depth
     * 4's "instead": the chosen bound Substrate of the primary or second Instinct's colour counts as Depth 4. Not on a
     * broken plate, where §4.3 switches Depth 3+ off.
     */
    chimeraDeep(actor, state, effective, bonds, instincts, catalogue) {
        const pick = state.choices.chimeraDeep;
        if (!pick || !bonds.includes("chimera") || !(pick in effective)) return null;
        if ((actor.itemTypes?.effect ?? []).some((e) => e.slug === "effect-carapace-broken")) return null;
        return [instincts.primary, instincts.secondary].filter(Boolean).includes(catalogue[pick]?.colour) ? pick : null;
    },

    /** Nickel Depth 4: 1 when a Purple Substrate stands in for the third Aberration, else 0. */
    purpleInstead(state, effective) {
        const purple = state.choices.nickelPurple;
        return (effective.nickel ?? 0) >= 4 && purple && purple !== "nickel" && purple in state.substrates ? 1 : 0;
    },

    aberrationCount(depth, bonds = []) {
        return (ABERRATION_COUNT[Math.min(depth, 4)] ?? 0) + (bonds.includes("chimera") ? 1 : 0);
    },

    async rollAberrations(actor, { reroll = false, forced = false } = {}) {
        const state = Engine.state(actor);
        const derived = await Engine.derive(actor, state);
        const depth = derived.effective.nickel ?? 0;
        const frame = Engine.hasFeat(actor, "chimeric-frame") ? 2 : 0;
        if (!depth && !frame) return Engine._refuse("Nickel is not bound.");
        // `forced`: Runaway Growth re-rolls them by itself, whatever Nickel's Depth.
        if (reroll && !forced && depth < 3) return Engine._refuse("Re-rolling your Aberrations takes Nickel at Depth 3.");
        if (!reroll && !state.preparing && (state.choices.nickel ?? []).length) {
            return Engine._refuse("Aberrations are rolled at daily preparations.");
        }
        const pool = [...ABERRATIONS];
        const picked = [];
        const count = (depth ? Engine.aberrationCount(depth, derived.bonds) : 0) + frame - Engine.purpleInstead(state, derived.effective)
            - (derived.chimeraDeep ? 1 : 0);
        for (let i = 0; i < count; i++) {
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
        // "Until your next daily preparations": Consume the Fallen's Depth and Devouring Plate's Substrates end.
        delete settled.choices.fallen;
        settled.temporary = {};
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
            // Gold Depth 2: the encounter's one chance to choose Gilded Core's Substrate again.
            for (const c of combat.combatants) {
                if (!Engine.isAssimilator(c.actor) || (c.actor.flags?.[MODULE_ID]?.[KEY]?.derived?.effective?.gold ?? 0) < 2) continue;
                ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor: c.actor }),
                    whisper: game.users.filter((u) => c.actor.testUserPermission(u, "OWNER")).map((u) => u.id),
                    content: `<p><strong>Gilded Core</strong>: ${c.actor.name} may choose Gold's Substrate again for this encounter, in the Gullet.</p>` });
            }
        });
        // The record changed, a level changed, or a feature that grants Mass came or went.
        Hooks.on("updateActor", (actor, change, options) => {
            if (options?.assimilatorEngine) return;
            if (change?.system?.details?.level || change?.flags?.[MODULE_ID]?.[KEY]) Engine.rebuild(actor);
        });
        const itemChanged = (item) => {
            const flag = item.flags?.[MODULE_ID]?.[KEY];
            const moves = ["effect-apotheosis", "effect-carapace-broken", "effect-gilded-apotheosis", "adamant-shell",
                "effect-instinctive-surge", "effect-second-hunger", DEPTH_FOUR].includes(item.slug);
            // An Assimilator feat can move the engine's numbers (Deep Vein, Two Instincts, Perfect Organism, …).
            const feat = item.type === "feat" && item.system?.traits?.value?.includes?.("assimilator");
            if (flag?.grants || moves || feat || item.type === "class") Engine.rebuild(item.actor);
        };
        Hooks.on("createItem", itemChanged);
        Hooks.on("deleteItem", itemChanged);
        // "For that Strike": the next attack rolled ends it — any attack but the critical that made it.
        Hooks.on("createChatMessage", (message) => {
            if (!isWriter() || message.flags?.pf2e?.context?.type !== "attack-roll") return;
            const spent = message.actor?.itemTypes?.effect?.filter((e) => e.slug === DEPTH_FOUR
                && e.flags?.[MODULE_ID]?.[KEY]?.madeBy !== message.id).map((e) => e.id) ?? [];
            if (spent.length) message.actor.deleteEmbeddedDocuments("Item", spent);
        });
    },
};

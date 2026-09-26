import { rel } from "./pack.mjs";

/**
 * The Assimilator's build-time invariants.
 *
 * Every one of these is a failure that validates, builds, and does nothing at the table — the kind this
 * module keeps finding late (`Docs/full-automation-programme.md` §4). They are written before the first
 * Substrate is, per `Docs/homebrewing/carapace-automation-programme.md` §9, so the first Substrate is
 * checked rather than the thirty-sixth.
 *
 * **The vocabulary they hold content to.** A bound Substrate is an effect, `substrate-<slug>`, whose counter
 * badge is its effective Depth; pf2e emits `self:effect:substrate-<slug>:<n>` for it, so a Depth is read with
 * pf2e's own numeric predicates. The plate's state is `carapace:`, because "the Carapace" now names only the
 * plate (guide v1.1).
 *
 *     { gte: ["self:effect:substrate-<slug>", n] }   at Depth n or deeper
 *     { lt:  ["self:effect:substrate-<slug>", n] }   shallower than n — how one tier stops the one below
 *     carapace:intact                                 present while the Carapace is not broken
 *
 * A rule with no Depth term at all is a Depth 1 rule: the effect exists only once the Substrate is bound.
 * A Substrate item declares itself with `flags["isaacs-hb-pf2e"].assimilator.substrate` —
 * `{ slug, colour, kind: "gem" | "metal" }` — and a Bond with `.bond` — `{ substrates: [a, b] }`.
 */

const FLAG = "isaacs-hb-pf2e";
export const INTACT = "carapace:intact";
const DEPTH_OPTION = /^self:effect:substrate-([a-z0-9-]+)$/;

/** Rule keys whose value is damage, and so must say which Substrate at which Depth produced it. */
const PROVENANCE_KEYS = new Set(["DamageDice", "FlatModifier"]);

/**
 * The non-stacking pairs the guide declares, as feat slug → the option its predicate must refuse.
 *
 * Symbiotic Reflex vs Carapace Block and Perfect Adaptation vs Moonstone are the other two the programme
 * names; they are the same shape and join this list when their items exist.
 */
const NON_STACKING = {
    "two-instincts": "electrum-alloyed-instinct",
    "apex-predator": "gold-instinct",
};

function assimilator(doc) {
    return doc?.flags?.[FLAG]?.assimilator ?? {};
}

/** Every string anywhere in a predicate, however deeply `and` / `or` / `not` nest it. */
function optionsIn(predicate, out = []) {
    if (typeof predicate === "string") out.push(predicate);
    else if (Array.isArray(predicate)) for (const p of predicate) optionsIn(p, out);
    else if (predicate && typeof predicate === "object") for (const v of Object.values(predicate)) optionsIn(v, out);
    return out;
}

/** The positive (un-negated) terms of a predicate — the ones a rule actually needs to hold. */
function required(predicate) {
    if (!Array.isArray(predicate)) return [];
    return predicate.flatMap((term) => (term?.and ? required(term.and) : [term]));
}

/** Every numeric Depth comparison in a predicate: `{ op, slug, n }`, wherever it sits. */
function depthTerms(predicate, out = []) {
    if (Array.isArray(predicate)) for (const p of predicate) depthTerms(p, out);
    else if (predicate && typeof predicate === "object") {
        for (const op of ["gte", "gt", "lt", "lte", "eq"]) {
            const pair = predicate[op];
            const match = Array.isArray(pair) ? DEPTH_OPTION.exec(pair[0]) : null;
            if (match) out.push({ op, slug: match[1], n: Number(pair[1]) });
        }
        for (const [k, v] of Object.entries(predicate)) if (!["gte", "gt", "lt", "lte", "eq"].includes(k)) depthTerms(v, out);
    }
    return out;
}

function packOf(packs, name) {
    return packs.find(({ def }) => def.name === name)?.docs ?? [];
}

export function validateAssimilator(packs, errors) {
    const substrates = packOf(packs, "assimilator-substrates");
    const bonds = packOf(packs, "assimilator-bonds");
    const feats = packOf(packs, "assimilator-feats");

    const known = new Map();
    for (const { file, doc } of substrates) {
        const where = rel(file);
        const declared = assimilator(doc).substrate;
        if (!declared?.slug) {
            errors.push(`${where}: a Substrate must declare flags.${FLAG}.assimilator.substrate.slug`);
            continue;
        }
        if (known.has(declared.slug)) errors.push(`${where}: Substrate "${declared.slug}" is declared twice`);
        known.set(declared.slug, where);
        validateSubstrate(doc, declared.slug, where, errors);
    }

    validateBondClosure(bonds, known, errors);
    validateNonStacking(feats, errors);
    validateBasicSaves(packs.filter(({ def }) => def.name.startsWith("assimilator-")).flatMap(({ docs }) => docs), errors);
}

/**
 * Provenance, Depth coverage and the broken state, for one Substrate.
 *
 * - **Provenance.** Red's clause is "+1 damage per Depth *of its Substrate*". An untagged modifier cannot
 *   answer that, and the failure is silent: damage still goes up, from the dice, so the clause looks like
 *   it works (programme §12.2).
 * - **Depth coverage.** Every Depth 1–4 has at least one rule, and nothing names a Depth that does not
 *   exist. A ladder with a missing rung reads as "that Depth does nothing".
 * - **`carapace:intact`.** Every rule that needs Depth 3 or 4 also needs the plate whole (guide §4.3). One
 *   missing means a broken Carapace keeps a rider it should have lost.
 */
function validateSubstrate(doc, slug, where, errors) {
    const reached = new Set();
    (doc.system?.rules ?? []).forEach((rule, i) => {
        const at = `${where} rule ${i} (${rule.key})`;
        for (const term of depthTerms(rule.predicate)) {
            if (term.slug !== slug) {
                errors.push(`${at}: predicates on another Substrate's Depth ("substrate-${term.slug}") — a Substrate reads only its own`);
                continue;
            }
            // *Fifth Depth* (guide §8.10) is the feat's to implement — it doubles the Depth 4 rider and scales
            // the numbers — so no Substrate item carries a rung of its own above 4.
            if (term.n < 1 || term.n > (term.op === "lt" ? 5 : 4)) {
                errors.push(`${at}: names Depth ${term.n}, which does not exist (1–4)`);
            }
        }

        // The Depth a rule needs: its top-level `gte`, or 1 when it names none.
        const needed = depthTerms(required(rule.predicate).filter((t) => typeof t === "object" && t.gte))
            .filter((t) => t.slug === slug && t.op === "gte" && t.n >= 1 && t.n <= 4)
            .map((t) => t.n);
        const top = needed.length ? Math.max(...needed) : 1;
        reached.add(top);
        if (top >= 3 && !required(rule.predicate).includes(INTACT)) {
            errors.push(`${at}: needs Depth ${top} but not "${INTACT}", so a broken Carapace would keep it`);
        }

        // Only damage needs to say where it came from; Iron's Athletics bonus is not an Instinct's business.
        const selectors = [rule.selector].flat().map(String);
        if (PROVENANCE_KEYS.has(rule.key) && selectors.some((sel) => sel.endsWith("damage"))) {
            const tag = rule.flags?.[FLAG]?.assimilator;
            if (rule.slug !== `substrate-${slug}` && !String(rule.slug).startsWith(`substrate-${slug}-`)) {
                errors.push(`${at}: slug must be "substrate-${slug}" or begin "substrate-${slug}-" so an Instinct can find it`);
            }
            if (tag?.substrate !== slug || !Number.isInteger(tag?.depth)) {
                errors.push(`${at}: must carry flags.${FLAG}.assimilator = { substrate: "${slug}", depth: <n> }`);
            } else if (tag.depth !== top) {
                errors.push(`${at}: tagged Depth ${tag.depth} but predicated on Depth ${top}`);
            }
        }
    });

    for (const depth of [1, 2, 3, 4]) {
        if (!reached.has(depth)) {
            errors.push(`${where}: no rule needs Depth ${depth} — it would do nothing`);
        }
    }
}

/** Every Bond names two Substrates that exist, and — once all thirty-six do — every Substrate is in one. */
function validateBondClosure(bonds, known, errors) {
    const used = new Set();
    for (const { file, doc } of bonds) {
        const where = rel(file);
        const pair = assimilator(doc).bond?.substrates;
        if (!Array.isArray(pair) || pair.length !== 2 || pair[0] === pair[1]) {
            errors.push(`${where}: a Bond must declare flags.${FLAG}.assimilator.bond.substrates as two different Substrates`);
            continue;
        }
        for (const slug of pair) {
            used.add(slug);
            if (!known.has(slug)) errors.push(`${where}: names Substrate "${slug}", which is not in the Substrates pack`);
        }
    }
    // The lexicon's own closure holds only for the whole set — all 36 Substrates and all thirty Bonds — so it is
    // asserted only once both are whole (Phase 5); before that every unwritten Bond would read as a gap.
    if (known.size === 36 && bonds.length >= 30) {
        for (const [slug, where] of known) {
            if (!used.has(slug)) errors.push(`${where}: Substrate "${slug}" appears in no Bond (lexicon §14.1 has one for each)`);
        }
    }
}

/**
 * A basic save's damage carries no multiplier of its own. `basicLadder` composes the ladder with one, so the
 * Gland and the Discharge — both written with `multiplier: 0.5` — dealt half at every degree: driven live, a
 * critical failure took the dice once instead of twice. The Assimilator has no fraction-of-damage clause for a
 * multiplier to mean; the Soulbound's three genuine ones are outside this family.
 */
function validateBasicSaves(docs, errors) {
    const visit = (node, where) => {
        if (Array.isArray(node)) return node.forEach((n) => visit(n, where));
        if (!node || typeof node !== "object") return;
        const apply = node.apply;
        if (apply?.type === "save" && apply.basic === true) {
            for (const rider of apply.riders ?? []) {
                if (rider?.apply?.type === "damage" && !rider.outcomes && rider.apply.multiplier !== undefined) {
                    errors.push(`${where}: a basic save's damage takes no multiplier — the ladder already halves and doubles it`);
                }
            }
        }
        Object.values(node).forEach((v) => visit(v, where));
    };
    for (const { file, doc } of docs) visit(doc.flags?.[FLAG]?.riders ?? [], rel(file));
}

/**
 * A declared non-stacking pair has to say so on the feat, where the code that takes the better one reads it — not in a
 * sentence that asks nicely. Both pairs are the engine's to settle: Two Instincts and Electrum each offer a second
 * Instinct clause and `instinctsOf` keeps the better; Apex Predator and Gold's Instinct each offer a Depth 4 rider on
 * a critical and one card is posted. `test-assimilator` pins both.
 */
function validateNonStacking(feats, errors) {
    for (const { file, doc } of feats) {
        const expected = NON_STACKING[doc.system?.slug];
        if (!expected) continue;
        if (assimilator(doc).doesNotStackWith !== expected) {
            errors.push(`${rel(file)}: the guide says this does not stack; declare flags.${FLAG}.assimilator.doesNotStackWith = "${expected}"`);
        }
    }
}

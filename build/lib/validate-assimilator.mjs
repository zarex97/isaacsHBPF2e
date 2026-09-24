import { rel } from "./pack.mjs";

/**
 * The Assimilator's build-time invariants.
 *
 * Every one of these is a failure that validates, builds, and does nothing at the table — the kind this
 * module keeps finding late (`Docs/full-automation-programme.md` §4). They are written before the first
 * Substrate is, per `Docs/homebrewing/carapace-automation-programme.md` §9, so the first Substrate is
 * checked rather than the thirty-sixth.
 *
 * **The vocabulary they hold content to.** Class-derived state is `assimilator:`; the plate is
 * `carapace:`, because "the Carapace" now names only the plate (guide v1.1).
 *
 *     assimilator:substrate:<slug>          bound at all
 *     assimilator:substrate:<slug>:<n>      one option per Depth reached, so predicates never need `gte`
 *     carapace:intact                       present while the Carapace is not broken
 *
 * A Substrate item declares itself with `flags["isaacs-hb-pf2e"].assimilator.substrate` —
 * `{ slug, colour, kind: "gem" | "metal" }` — and a Bond with `.bond` — `{ substrates: [a, b] }`.
 */

const FLAG = "isaacs-hb-pf2e";
export const INTACT = "carapace:intact";
const DEPTH_OPTION = /^assimilator:substrate:([a-z0-9-]+):(\d+)$/;

/** Rule keys whose value is damage, and so must say which Substrate at which Depth produced it. */
const PROVENANCE_KEYS = new Set(["DamageDice", "FlatModifier"]);

/**
 * The non-stacking pairs the guide declares, as feat slug → the option its predicate must refuse.
 *
 * Symbiotic Reflex vs Carapace Block and Perfect Adaptation vs Moonstone are the other two the programme
 * names; they are the same shape and join this list when their items exist.
 */
const NON_STACKING = {
    "two-instincts": "assimilator:substrate:electrum:3",
    "apex-predator": "assimilator:instinct:gold",
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

/** The positive (un-negated) options of a predicate — the ones a rule actually needs present. */
function required(predicate) {
    if (!Array.isArray(predicate)) return [];
    return predicate.flatMap((term) => (typeof term === "string" ? [term] : term?.and ? required(term.and) : []));
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
        for (const option of optionsIn(rule.predicate)) {
            const match = DEPTH_OPTION.exec(option);
            if (!match) continue;
            if (match[1] !== slug) {
                errors.push(`${at}: predicates on another Substrate's Depth ("${option}") — a Substrate reads only its own`);
                continue;
            }
            const depth = Number(match[2]);
            // *Fifth Depth* (guide §8.10) is the feat's to implement — it doubles the Depth 4 rider and scales
            // the numbers — so no Substrate item carries a rung of its own above 4.
            if (depth < 1 || depth > 4) errors.push(`${at}: names Depth ${depth}, which does not exist (1–4)`);
        }

        const needed = required(rule.predicate)
            .map((o) => DEPTH_OPTION.exec(o))
            .filter((m) => m && m[1] === slug)
            .map((m) => Number(m[2]))
            .filter((d) => d >= 1 && d <= 4);
        const top = Math.max(0, ...needed);
        if (top) reached.add(top);
        if (top >= 3 && !required(rule.predicate).includes(INTACT)) {
            errors.push(`${at}: needs Depth ${top} but not "${INTACT}", so a broken Carapace would keep it`);
        }

        if (PROVENANCE_KEYS.has(rule.key)) {
            const tag = rule.flags?.[FLAG]?.assimilator;
            if (rule.slug !== `substrate-${slug}`) {
                errors.push(`${at}: slug must be "substrate-${slug}" so an Instinct can find it in the modifier list`);
            }
            if (tag?.substrate !== slug || !Number.isInteger(tag?.depth)) {
                errors.push(`${at}: must carry flags.${FLAG}.assimilator = { substrate: "${slug}", depth: <n> }`);
            } else if (top && tag.depth !== top) {
                errors.push(`${at}: tagged Depth ${tag.depth} but predicated on Depth ${top}`);
            }
        }
    });

    for (const depth of [1, 2, 3, 4]) {
        if (!reached.has(depth)) {
            errors.push(`${where}: no rule requires "assimilator:substrate:${slug}:${depth}" — Depth ${depth} would do nothing`);
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
    // The lexicon's own closure holds only for the whole set, so it is asserted only once the set is whole.
    if (known.size === 36 && bonds.length > 0) {
        for (const [slug, where] of known) {
            if (!used.has(slug)) errors.push(`${where}: Substrate "${slug}" appears in no Bond (lexicon §14.1 has one for each)`);
        }
    }
}

/** A declared non-stacking pair needs a predicate that refuses the second, not a sentence that asks nicely. */
function validateNonStacking(feats, errors) {
    for (const { file, doc } of feats) {
        const refuses = NON_STACKING[doc.system?.slug];
        if (!refuses) continue;
        const refused = (doc.system?.rules ?? []).some((rule) =>
            optionsIn(rule.predicate?.filter?.((t) => typeof t === "object" && "not" in t) ?? []).includes(refuses));
        if (!refused) {
            errors.push(`${rel(file)}: the guide says this does not stack; some rule must predicate { not: "${refuses}" }`);
        }
    }
}

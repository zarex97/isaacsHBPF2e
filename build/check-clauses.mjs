/**
 * Hold the clause trackers to the guide.
 *
 * A clause is one independently-failable declaration a class guide makes, tracked as a row in
 * `Docs/clauses/*.md` (the Soulbound) or `Docs/clauses/assimilator/*.md` (the Assimilator). The rows are the spec restated as a checklist, and a checklist restating a
 * document is a second copy of it — which drifts. `Docs/soulbound-verification-checklist.md` was
 * written that way, by hand, from the guide, and nothing has ever checked that its 269 rows still say
 * what the guide says.
 *
 * So the clause text is a **verbatim fragment**, and this asserts it: every clause must still be a
 * literal substring of `Docs/soulbound-guide-v1.md` once both sides are stripped of markdown emphasis
 * and their whitespace collapsed. A paraphrase fails here, and so does a guide edit made behind a
 * tracker's back — which matters because the guide is frozen at v1.4 for this pass, and an amendment
 * is supposed to be a decision rather than a diff nobody noticed.
 *
 * The other five assertions are the ones the old checklist stated in prose and never enforced. The
 * fourth is the one that would have caught most: §0 says "A row with no evidence is ☐ no matter how
 * obviously correct the JSON looks", and rows have carried a ✅ with an empty Evidence cell anyway.
 */

import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/pack.mjs";

const CLAUSE_DIR = path.join(ROOT, "Docs", "clauses");
const GUIDE = path.join(ROOT, "Docs", "soulbound-guide-v1.md");
const ASSIMILATOR_DIR = path.join(CLAUSE_DIR, "assimilator");
const ASSIMILATOR_GUIDE = path.join(ROOT, "Docs", "assimilator-guide-v1.md");
/** The guide's §6 makes the lexicon its Chapter 5 and does not reprint it, so Substrates and Bonds quote it. */
const ASSIMILATOR_LEXICON = path.join(ROOT, "Docs", "homebrewing", "carapace-material-lexicon-v3.md");

/** The six marks, and nothing else. `—` means "nothing to automate", not "not done". */
const MARKS = new Set(["☐", "✅", "⚠️", "❌", "🔧", "—"]);

/** Marks that assert something happened at the table, and therefore owe evidence. */
const NEEDS_EVIDENCE = new Set(["✅", "⚠️", "❌", "🔧", "—"]);

/**
 * Which ID prefixes a file may use.
 *
 * The prefixes are the old checklist's, deliberately: forty-five SB findings and every evidence note
 * cite them, and renumbering would break every one of those citations to buy nothing. A split row
 * keeps its number and takes a letter — `S-14` became `S-14a`, `S-14b`, `S-14c`.
 */
const PREFIXES = {
    "class.md": ["C", "K", "F", "X"],
    "lineage-soul-reaper.md": ["SR", "K", "F"],
    "lineage-hollow.md": ["H", "K"],
    "lineage-quincy.md": ["Q", "K"],
};
/** Every `spirit-*.md` tracks its Spirit's §7 rungs and its one §9 Severing Art. */
const SPIRIT_PREFIXES = ["S", "R"];

/**
 * The Assimilator's trackers, and which document each one quotes.
 *
 * A Substrate's ID is its two-letter code and its Depth — `RU-3b` is Ruby's Depth 3, second clause — so
 * each colour's file may use only its own four codes. IDs share one namespace with the Soulbound's, which
 * is why none of these reuses `C`, `K`, `F`, `X`, `S`, `R`, `SR`, `H` or `Q`.
 */
const ASSIMILATOR = {
    "class.md": { prefixes: ["A"], source: ASSIMILATOR_GUIDE },
    "instincts.md": { prefixes: ["I"], source: ASSIMILATOR_GUIDE },
    "feats.md": { prefixes: ["AF"], source: ASSIMILATOR_GUIDE },
    "bonds.md": { prefixes: ["B"], source: ASSIMILATOR_LEXICON },
    "substrates-red.md": { prefixes: ["RU", "GA", "IR", "CU"], source: ASSIMILATOR_LEXICON },
    "substrates-gold.md": { prefixes: ["TO", "CI", "AU", "EL"], source: ASSIMILATOR_LEXICON },
    "substrates-orange.md": { prefixes: ["CA", "AM", "BR", "HG"], source: ASSIMILATOR_LEXICON },
    "substrates-blue.md": { prefixes: ["SA", "LA", "CO", "SN"], source: ASSIMILATOR_LEXICON },
    "substrates-purple.md": { prefixes: ["AT", "QZ", "PT", "NI"], source: ASSIMILATOR_LEXICON },
    "substrates-green.md": { prefixes: ["EM", "JA", "ZN", "CR"], source: ASSIMILATOR_LEXICON },
    "substrates-black.md": { prefixes: ["ON", "JE", "PB", "MN"], source: ASSIMILATOR_LEXICON },
    "substrates-white.md": { prefixes: ["DI", "PE", "AL", "MG"], source: ASSIMILATOR_LEXICON },
    "substrates-gray.md": { prefixes: ["HE", "MO", "ST", "AG"], source: ASSIMILATOR_LEXICON },
};

const failures = [];
let clauses = 0;

function fail(file, id, message) {
    failures.push(`${file}${id ? ` ${id}` : ""}: ${message}`);
}

/**
 * Markdown emphasis is presentation, not text.
 *
 * The guide bolds the load-bearing half of nearly every sentence — "**30-foot emanation**, basic
 * Fortitude, **cold**" — and a clause quoting it plainly should match. Line wrapping is the same
 * problem in the other direction: the guide hard-wraps at column 100, so a clause spanning a wrap has
 * a newline in the middle of it where the tracker has a space.
 */
function normalise(text) {
    return text
        // A blockquote marker is presentation too, and it is the one that bites. The guide puts whole
        // Techniques inside `>` blocks — Colmillo, Kanzen Saimin's canon note — and hard-wraps them at
        // column 100 like everything else, so a clause spanning a wrap inside a quote had a stray `>`
        // in the middle of it where the tracker had a space. The symptom is a clause that is plainly
        // verbatim and fails anyway, which has already cost two trackers a row split around nothing.
        .replace(/^[ \t]*>+[ \t]?/gm, "")
        .replace(/[*_`]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

/** Each source is read and normalised once, however many trackers quote it. */
const sources = new Map();
function source(file) {
    if (!sources.has(file)) sources.set(file, normalise(fs.readFileSync(file, "utf8")));
    return sources.get(file);
}

if (!fs.existsSync(CLAUSE_DIR)) {
    console.log("No Docs/clauses yet — nothing to check.");
    process.exit(0);
}

const seen = new Map();

/** Every tracker file, with the prefixes it may use and the document its clauses must quote. */
const trackers = [];
for (const name of fs.readdirSync(CLAUSE_DIR).filter((n) => n.endsWith(".md")).sort()) {
    const allowed = PREFIXES[name] ?? (name.startsWith("spirit-") ? SPIRIT_PREFIXES : null);
    if (!allowed) {
        fail(name, null, "not a known tracker file — expected class.md, lineage-*.md or spirit-*.md");
        continue;
    }
    trackers.push({ name, file: path.join(CLAUSE_DIR, name), allowed, guide: source(GUIDE) });
}
if (fs.existsSync(ASSIMILATOR_DIR)) {
    for (const name of fs.readdirSync(ASSIMILATOR_DIR).filter((n) => n.endsWith(".md")).sort()) {
        const tier = ASSIMILATOR[name];
        const label = `assimilator/${name}`;
        if (!tier) {
            fail(label, null, `not a known tracker file — expected one of ${Object.keys(ASSIMILATOR).join(", ")}`);
            continue;
        }
        trackers.push({ name: label, file: path.join(ASSIMILATOR_DIR, name), allowed: tier.prefixes, guide: source(tier.source) });
    }
}

for (const { name, file, allowed, guide } of trackers) {

    const counted = { "☐": 0, "✅": 0, "⚠️": 0, "❌": 0, "🔧": 0, "—": 0 };
    const text = fs.readFileSync(file, "utf8");

    for (const line of text.split("\n")) {
        // A clause row, as opposed to the legend or the counts table: six cells, and the first is an ID.
        if (!line.startsWith("|")) continue;
        const cells = line.split("|").slice(1, -1).map((c) => c.trim());
        if (cells.length !== 6) continue;
        const [id, , clause, , status, evidence] = cells;
        if (!/^[A-Z]{1,2}-\d+[a-z]?$/.test(id)) continue;

        clauses += 1;

        const prefix = id.split("-")[0];
        if (!allowed.includes(prefix)) {
            fail(name, id, `prefix "${prefix}-" does not belong in this file (expected ${allowed.map((p) => `${p}-`).join(", ")})`);
        }

        const where = seen.get(id);
        if (where) fail(name, id, `duplicate clause id — already used in ${where}`);
        else seen.set(id, name);

        if (!MARKS.has(status)) {
            fail(name, id, `status "${status}" is not one of ${[...MARKS].join(" ")}`);
        }

        // §0's own rule, finally enforced: a mark that claims something happened must say what proved it.
        if (NEEDS_EVIDENCE.has(status) && evidence === "") {
            fail(name, id, `marked ${status} with no evidence — §0 says that is still ☐`);
        }

        if (clause === "") {
            fail(name, id, "empty clause");
        } else if (!guide.includes(normalise(clause))) {
            fail(name, id, `clause is not a verbatim fragment of its source: "${clause}"`);
        }

        if (MARKS.has(status)) counted[status] += 1;
    }

    // The counts table at the foot of each file is a summary, and a summary that disagrees with what it
    // summarises is worse than none: it is the number a reader trusts instead of counting.
    const declared = {};
    for (const line of text.split("\n")) {
        const match = /^\|\s*(☐|✅|⚠️|❌|🔧|—)\s*\|\s*(\d+)\s*\|$/.exec(line.trim());
        if (match) declared[match[1]] = Number(match[2]);
    }
    if (Object.keys(declared).length > 0) {
        for (const mark of MARKS) {
            if ((declared[mark] ?? 0) !== counted[mark]) {
                fail(name, null, `counts table says ${declared[mark] ?? 0} × ${mark}, the rows say ${counted[mark]}`);
            }
        }
    }

    const total = /^\|\s*\*\*Total\*\*\s*\|\s*\*\*(\d+)\*\*\s*\|$/m.exec(text);
    const rows = Object.values(counted).reduce((a, b) => a + b, 0);
    if (total && Number(total[1]) !== rows) {
        fail(name, null, `counts table says ${total[1]} clauses, the rows say ${rows}`);
    }
}

if (failures.length > 0) {
    console.error(`Clause checks failed: ${failures.length}.`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
}
console.log(`Clause checks passed: ${clauses} clauses in ${seen.size > 0 ? new Set([...seen.values()]).size : 0} tracker(s).`);

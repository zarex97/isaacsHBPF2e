/**
 * Hold the clause trackers to the guide.
 *
 * A clause is one independently-failable declaration the Soulbound guide makes, tracked as a row in
 * `Docs/clauses/*.md`. The rows are the spec restated as a checklist, and a checklist restating a
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
        .replace(/[*_`]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

const guide = normalise(fs.readFileSync(GUIDE, "utf8"));

if (!fs.existsSync(CLAUSE_DIR)) {
    console.log("No Docs/clauses yet — nothing to check.");
    process.exit(0);
}

const seen = new Map();

for (const name of fs.readdirSync(CLAUSE_DIR).filter((n) => n.endsWith(".md")).sort()) {
    const allowed = PREFIXES[name] ?? (name.startsWith("spirit-") ? SPIRIT_PREFIXES : null);
    if (!allowed) {
        fail(name, null, "not a known tracker file — expected class.md, lineage-*.md or spirit-*.md");
        continue;
    }

    const counted = { "☐": 0, "✅": 0, "⚠️": 0, "❌": 0, "🔧": 0, "—": 0 };
    const text = fs.readFileSync(path.join(CLAUSE_DIR, name), "utf8");

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
            fail(name, id, `clause is not a verbatim fragment of the guide: "${clause}"`);
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

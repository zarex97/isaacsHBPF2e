/**
 * Exercise rider selection against the real content, without Foundry.
 *
 * The escalation ladders are the part of this feature most likely to be silently wrong: Virgo's sense loss
 * has to advance exactly one step per hit, and Aquarius' cold has to stack slowed until it petrifies
 * instead. Both properties come out of predicates being tested against a snapshot taken before anything is
 * applied, and neither is visible by reading the JSON. So the ladders are simulated here, driven by the
 * shipped content rather than a copy of it — an edit that breaks the ordering fails the build.
 *
 * `game.pf2e.Predicate` is stubbed, because the real one lives in the system. The stand-in implements the
 * subset the content actually uses (plain statements, `not`, `or`, `and`) and nothing more, so a rider
 * written with a predicate form beyond that subset will throw here rather than quietly pass.
 */
import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/pack.mjs";

/* -------------------------------------------------------------------------------------------- */
/*  Stubs                                                                                        */
/* -------------------------------------------------------------------------------------------- */

class StubPredicate {
    constructor(statements) {
        this.statements = statements;
    }

    test(options) {
        const set = options instanceof Set ? options : new Set(options);
        return this.statements.every((statement) => evaluate(statement, set));
    }
}

function evaluate(statement, options) {
    if (typeof statement === "string") return options.has(statement);
    if (statement && typeof statement === "object") {
        if ("not" in statement) return !evaluate(statement.not, options);
        if ("or" in statement) return statement.or.some((s) => evaluate(s, options));
        if ("and" in statement) return statement.and.every((s) => evaluate(s, options));
    }
    throw new Error(`predicate form not supported by the test stub: ${JSON.stringify(statement)}`);
}

globalThis.game = { pf2e: { Predicate: StubPredicate } };

const { riderOptions } = await import("../scripts/lib/roll-options.mjs");
const { selectRiders } = await import("../scripts/riders/select.mjs");
const { collectRiders } = await import("../scripts/riders/data.mjs");
const { mergeBypass, resistanceReduction, ignoresHardness, selectEntries } = await import(
    "../scripts/riders/bypass.mjs"
);
const { degreeOf } = await import("../scripts/lib/degree.mjs");
const { applyHeightening, applyThresholds, stepsFor } = await import(
    "../scripts/targeting/heightening.mjs"
);
const { intervalSeconds } = await import("../scripts/economy/recharge.mjs");

/* -------------------------------------------------------------------------------------------- */
/*  A world small enough to reason about                                                         */
/* -------------------------------------------------------------------------------------------- */

function actor({ conditions = {}, effects = {}, hp = null } = {}) {
    const self = {
        // A getter, not a snapshot: applying a rider has to be visible to the next snapshot, or the
        // ladder can never advance and the test passes something that would fail at the table.
        get itemTypes() {
            return {
                condition: Object.entries(conditions).map(([slug, value]) => ({
                    slug,
                    active: true,
                    system: { value: { value: typeof value === "number" ? value : null } },
                })),
                effect: Object.entries(effects).map(([slug, count]) => ({
                    slug,
                    system: {
                        badge: typeof count === "number" ? { type: "counter", value: count } : undefined,
                    },
                })),
            };
        },
        hitPoints: hp,
        getRollOptions: () => [],
        getSelfRollOptions: () => [],
        // What "applying" a rider does to this stand-in world.
        apply(rider) {
            const a = rider.apply;
            if (a.type === "condition") conditions[a.slug] = a.value ?? true;
            else if (a.type === "effect") effects[slugOf(a.uuid)] = (effects[slugOf(a.uuid)] ?? 0) + 1;
            return a.type === "condition" ? a.slug : slugOf(a.uuid);
        },
    };
    return self;
}

/** The content addresses effects by name; the option set addresses them by slug. */
function slugOf(uuid) {
    const name = String(uuid).split(".").pop();
    return name
        .replace(/^Effect:\s*/, "")
        .toLowerCase()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function load(...parts) {
    return JSON.parse(fs.readFileSync(path.join(ROOT, "content", ...parts), "utf8"));
}

function ridersOf(doc) {
    return doc.flags?.["isaacs-hb-pf2e"]?.riders;
}

/* -------------------------------------------------------------------------------------------- */
/*  Harness                                                                                      */
/* -------------------------------------------------------------------------------------------- */

const failures = [];
let checks = 0;

function check(label, actual, expected) {
    checks += 1;
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    if (a !== e) failures.push(`${label}\n      expected ${e}\n      got      ${a}`);
}

/** Run one rider set against a target repeatedly, returning what landed each time. */
function ladder(riders, target, { outcome, rounds }) {
    const applied = [];
    for (let i = 0; i < rounds; i++) {
        const options = riderOptions({ originActor: actor(), targetActor: target, item: null });
        const chosen = selectRiders(
            riders.map((rider, index) => ({ rider, index, item: null })),
            { outcome, options },
        );
        // Every rider selected in one pass is applied against the same snapshot — that is the property
        // being tested, so apply them all before taking the next snapshot.
        applied.push(chosen.map(({ rider }) => target.apply(rider)));
    }
    return applied;
}

/* -------------------------------------------------------------------------------------------- */
/*  Virgo — one sense per hit, in order                                                          */
/* -------------------------------------------------------------------------------------------- */

const virgo = ridersOf(load("saint-effects", "sky-ascendant", "sky-ascendant-virgo.json"))[0];
check(
    "Virgo Six Paths takes exactly one sense per failed save, in order",
    ladder(virgo.apply.riders, actor(), { outcome: "failure", rounds: 5 }),
    [["blinded"], ["deafened"], ["sense-lost-smell-and-taste"], ["sense-lost-touch"], []],
);
check(
    "Virgo takes nothing on a successful save",
    ladder(virgo.apply.riders, actor(), { outcome: "success", rounds: 2 }),
    [[], []],
);
check(
    "Virgo skips a sense the target has already lost",
    ladder(virgo.apply.riders, actor({ conditions: { blinded: true } }), {
        outcome: "criticalFailure",
        rounds: 1,
    }),
    [["deafened"]],
);

/* -------------------------------------------------------------------------------------------- */
/*  Aquarius — slowed stacks, then petrifies instead                                             */
/* -------------------------------------------------------------------------------------------- */

const aquarius = ridersOf(load("saint-effects", "sky-ascendant", "sky-ascendant-aquarius.json"))[0];
const cold = aquarius.apply.riders;

for (const [slowed, expected] of [[0, "slowed"], [2, "slowed"], [3, "petrified"], [4, "petrified"]]) {
    check(
        `Aquarius at slowed ${slowed} applies ${expected}`,
        ladder(cold, actor({ conditions: slowed ? { slowed } : {} }), { outcome: "failure", rounds: 1 }),
        [[expected]],
    );
}
check(
    "Aquarius does nothing on a successful save",
    ladder(cold, actor({ conditions: { slowed: 3 } }), { outcome: "success", rounds: 1 }),
    [[]],
);

/* -------------------------------------------------------------------------------------------- */
/*  Scorpio — thresholds fire once, at the right counts                                          */
/* -------------------------------------------------------------------------------------------- */

const scorpio = ridersOf(load("saint-class-features", "cloths", "scorpio-the-needle.json"));
const at = (needles, conditions = {}) =>
    ladder(scorpio, actor({ effects: { "effect-scarlet-needle": needles }, conditions }), {
        outcome: "success",
        rounds: 1,
    })[0];

check("Scorpio does nothing at 4 needles", at(4), []);
check("Scorpio enfeebles at 5 needles", at(5), ["enfeebled"]);
check("Scorpio does not re-enfeeble a target already enfeebled", at(6, { enfeebled: 1 }), []);
check("Scorpio blinds at 10 needles", at(10, { enfeebled: 1 }), ["blinded"]);
check(
    "Scorpio stuns and suppresses runes at 14 needles",
    at(14, { enfeebled: 1, blinded: true }).length,
    2, // the stunned condition and the runes prompt, together
);

/* -------------------------------------------------------------------------------------------- */
/*  Events route riders to the right source                                                      */
/* -------------------------------------------------------------------------------------------- */

const pisces = load("saint-class-features", "cloths", "pisces-the-roses.json");
const item = { id: "pisces", flags: pisces.flags };
check(
    "a strike-received rider is not collected for strike-resolved",
    collectRiders({ event: "strike-resolved", item, actor: null }).length,
    0,
);
check(
    "a strike-received rider is collected for its own event",
    collectRiders({ event: "strike-received", item, actor: null }).length,
    1,
);

const diamondDust = load("saint-techniques", "slot-1-signature", "diamond-dust.json");
check(
    "a rider with no event still means save-rolled",
    collectRiders({ event: "save-rolled", item: { id: "dd", flags: diamondDust.flags }, actor: null }).length,
    1,
);
check(
    "an item is not searched twice when it is both the message item and on the actor",
    collectRiders({
        event: "save-rolled",
        item: { id: "dd", flags: diamondDust.flags },
        actor: { items: [{ id: "dd", flags: diamondDust.flags }] },
    }).length,
    1,
);

/* -------------------------------------------------------------------------------------------- */
/*  IWR bypass — the merge, and the split between ignoring and reducing                          */
/* -------------------------------------------------------------------------------------------- */

const wrap = (entries) => entries.map((entry) => ({ entry, item: null }));
const empty = { immunity: { ignore: [], downgrade: [], redirect: [] }, resistance: { ignore: [], redirect: [] } };

const bypassOf = (doc) => doc.flags?.["isaacs-hb-pf2e"]?.bypass;

// Every file the bypass checks below read must actually carry one. Asserting it here means a flag lost to
// a stray `git checkout` fails as "Seventh Sense has no bypass" rather than as a stack trace.
for (const parts of [
    ["saint-class-features", "core", "seventh-sense.json"],
    ["saint-effects", "sky-ascendant", "sky-ascendant-capricorn.json"],
    ["saint-effects", "sky-ascendant", "sky-ascendant-aquarius.json"],
    ["saint-feats", "level-16", "atomic-dissolution.json"],
]) {
    check(`${parts.at(-1)} carries a bypass`, Array.isArray(bypassOf(load(...parts))), true);
}

check(
    "Seventh Sense ignores resistance to every type the damage actually deals",
    mergeBypass(empty, wrap(bypassOf(load("saint-class-features", "core", "seventh-sense.json"))),
                ["slashing", "force"]).resistance.ignore,
    [{ type: "slashing", max: Infinity }, { type: "force", max: Infinity }],
);

const aquariusBypass = bypassOf(load("saint-effects", "sky-ascendant", "sky-ascendant-aquarius.json"));
const coldBypass = mergeBypass(empty, wrap(aquariusBypass), ["cold"]);
check("Aquarius ignores cold resistance", coldBypass.resistance.ignore, [{ type: "cold", max: Infinity }]);
check(
    "Aquarius downgrades cold immunity to resistance 10, using pf2e's spelling of the field",
    coldBypass.immunity.downgrade,
    [{ type: "cold", resistence: 10 }],
);

// The split that is easy to get wrong: pf2e does not honour `max` on an ignored resistance, so a partial
// reduction must never reach `bypass` — it is applied to the target instead.
const atomic = bypassOf(load("saint-feats", "level-16", "atomic-dissolution.json"));
check(
    "Atomic Dissolution's partial reduction does not reach bypass",
    mergeBypass(empty, wrap(atomic), ["bludgeoning"]).resistance.ignore,
    [],
);
check("Atomic Dissolution reduces resistance by 5 instead", resistanceReduction(wrap(atomic)), 5);
check("Atomic Dissolution ignores Hardness", ignoresHardness(wrap(atomic)), true);
check("A total ignore asks for no reduction", resistanceReduction(wrap(aquariusBypass)), 0);

check(
    "two entries merge without either clobbering the other",
    mergeBypass(empty, wrap([...aquariusBypass, ...bypassOf(
        load("saint-effects", "sky-ascendant", "sky-ascendant-capricorn.json"),
    )]), ["cold"]),
    {
        // Capricorn ignores *physical* immunity, Aquarius downgrades *cold* immunity: neither overwrites
        // the other, which is the whole point of merging rather than replacing.
        immunity: { ignore: ["physical"], downgrade: [{ type: "cold", resistence: 10 }], redirect: [] },
        resistance: { ignore: [{ type: "cold", max: Infinity }], redirect: [] },
    },
);
check(
    "an existing bypass from a property rune survives the merge",
    mergeBypass(
        { immunity: { ignore: [], downgrade: [], redirect: [] },
          resistance: { ignore: [{ type: "physical", max: 5 }], redirect: [] } },
        wrap(aquariusBypass), ["cold"],
    ).resistance.ignore,
    [{ type: "physical", max: 5 }, { type: "cold", max: Infinity }],
);

// JSON.stringify turns Infinity into null, so the comparisons above cannot tell the two apart. This one
// can, and "ignore entirely" depends on it being Infinity rather than a falsy null.
check(
    "an ignored resistance is ignored without limit",
    coldBypass.resistance.ignore[0].max === Infinity,
    true,
);

check(
    "a predicate that does not match contributes nothing",
    selectEntries(wrap(aquariusBypass), new Set(["damage:type:fire"])).length,
    0,
);

/* -------------------------------------------------------------------------------------------- */
/*  Degree of success — the one re-implementation, so the most cases                             */
/* -------------------------------------------------------------------------------------------- */

const degree = (dieValue, modifier, dc, adjustments = null) =>
    degreeOf({ dieValue, modifier, dc, adjustments }).key;

// The four bands, at their exact boundaries.
check("ten under the DC is a critical failure", degree(10, 0, 20), "criticalFailure");
check("nine under the DC is a failure", degree(11, 0, 20), "failure");
check("exactly the DC is a success", degree(10, 10, 20), "success");
check("ten over the DC is a critical success", degree(10, 20, 20), "criticalSuccess");
check("nine over the DC is only a success", degree(10, 19, 20), "success");

// The die itself moves the result one step, and cannot move it off either end.
check("a natural 20 raises a failure to a success", degree(20, -5, 20), "success");
check("a natural 1 lowers a success to a failure", degree(1, 25, 20), "failure");
check("a natural 20 cannot exceed a critical success", degree(20, 20, 20), "criticalSuccess");
check("a natural 1 cannot fall below a critical failure", degree(1, 0, 20), "criticalFailure");

// This is the case The Balance creates: a 1 that is treated as a 10 keeps none of the 1's penalty.
check("a 10 against the same DC keeps its band", degree(10, 10, 20), "success");

// Adjustments, including the two exclusions pf2e applies.
const bump = { all: { label: "test", amount: 1 } };
check("an adjustment raises the degree", degree(10, 10, 20, bump), "criticalSuccess");
check(
    "an adjustment naming another outcome does not apply",
    degree(10, 10, 20, { failure: { label: "test", amount: 1 } }),
    "success",
);
check(
    "an adjustment cannot raise a critical success further",
    degree(10, 20, 20, bump),
    "criticalSuccess",
);
check(
    "a named adjustment jumps straight to its degree",
    degree(10, 0, 20, { all: { label: "test", amount: "criticalSuccess" } }),
    "criticalSuccess",
);
check("the unadjusted degree is reported too", degreeOf({ dieValue: 10, modifier: 10, dc: 20, adjustments: bump }).unadjustedKey, "success");

/* -------------------------------------------------------------------------------------------- */
/*  Heightening — per step, and at named levels                                                  */
/* -------------------------------------------------------------------------------------------- */

// Every Technique the heightening checks below read must actually carry a block. Asserting it here means
// a flag lost to a stray `git checkout` fails as "Lightning Crown has no targeting" rather than a crash.
for (const parts of [
    ["saint-techniques", "slot-2", "lightning-crown.json"],
    ["saint-techniques", "slot-2", "pleiades-nova.json"],
    ["saint-techniques", "slot-2", "the-twelve-arms.json"],
    ["saint-techniques", "slot-1-signature", "another-dimension.json"],
    ["saint-techniques", "slot-1-signature", "crystal-wall.json"],
]) {
    check(
        `${parts.at(-1)} carries a targeting rule`,
        !!load(...parts).flags?.["isaacs-hb-pf2e"]?.areaTargeting,
        true,
    );
}

check("a cast at its base rank has taken no steps", stepsFor({ baseRank: 1, castRank: 1 }), 0);
check("four ranks at interval 1 is four steps", stepsFor({ baseRank: 1, castRank: 5 }), 4);
check("a cast below its base rank never goes negative", stepsFor({ baseRank: 6, castRank: 3 }), 0);

const twelveArms = load("saint-techniques", "slot-2", "the-twelve-arms.json")
    .flags["isaacs-hb-pf2e"].areaTargeting;
check(
    "The Twelve Arms gains 10 feet of range per step",
    applyHeightening(twelveArms, twelveArms.heightening, { baseRank: 3, castRank: 6 }).range,
    60, // 30 base + 3 steps
);
check(
    "growth applies to nothing when the base is absent",
    applyHeightening({ range: 0 }, { range: 10 }, { baseRank: 1, castRank: 5 }).range,
    0,
);

const anotherDimension = load("saint-techniques", "slot-1-signature", "another-dimension.json")
    .flags["isaacs-hb-pf2e"].areaTargeting;
const atLevel = (flag, level, ranks) =>
    applyThresholds(applyHeightening(flag, flag.heightening, ranks), flag.heightening, level);

check(
    "Another Dimension targets one creature below 12th level",
    atLevel(anotherDimension, 11, { baseRank: 1, castRank: 6 }).maxTargets,
    1,
);
check(
    "…two from 12th",
    atLevel(anotherDimension, 12, { baseRank: 1, castRank: 6 }).maxTargets,
    2,
);
check(
    "…and three from 16th, not one per step in between",
    atLevel(anotherDimension, 16, { baseRank: 1, castRank: 8 }).maxTargets,
    3,
);

const lightningCrown = load("saint-techniques", "slot-2", "lightning-crown.json")
    .flags["isaacs-hb-pf2e"].areaTargeting;
check("Lightning Crown places three pillars at 6th", atLevel(lightningCrown, 6, { baseRank: 3, castRank: 3 }).areas, 3);
check("…four at 10th", atLevel(lightningCrown, 10, { baseRank: 3, castRank: 5 }).areas, 4);
check("…six at 18th", atLevel(lightningCrown, 18, { baseRank: 3, castRank: 9 }).areas, 6);

const pleiades = load("saint-techniques", "slot-2", "pleiades-nova.json")
    .flags["isaacs-hb-pf2e"].areaTargeting;
check("Pleiades Nova is five Strikes at 6th", atLevel(pleiades, 6, { baseRank: 3, castRank: 3 }).maxTargets, 5);
check("…and seven at 18th, its stated maximum", atLevel(pleiades, 18, { baseRank: 3, castRank: 9 }).maxTargets, 7);

/* -------------------------------------------------------------------------------------------- */
/*  Frequency intervals                                                                          */
/* -------------------------------------------------------------------------------------------- */

check("an hour is 3600 seconds", intervalSeconds("PT1H"), 3600);
check("ten minutes is 600", intervalSeconds("PT10M"), 600);
check("a day is left to pf2e", intervalSeconds("day"), 0);
check("a round is left to pf2e", intervalSeconds("round"), 0);
check("a week is not handled here", intervalSeconds("P1W"), 0);
check("nonsense is not an interval", intervalSeconds(undefined), 0);

/* -------------------------------------------------------------------------------------------- */
/*  Wrapped methods                                                                              */
/* -------------------------------------------------------------------------------------------- */

/**
 * The one bug in this module that reached a release was two features registering a libWrapper wrapper for
 * the same method under the same package id. libWrapper refuses that by design, the throw was inside the
 * `setup` hook, and it took every feature registered after it down with it — a crash that read at the table
 * as most of the module doing nothing at all.
 *
 * Nothing offline can load libWrapper, but the cause is visible in the source: every wrap in the module now
 * goes through `wrap()` with the target as a string literal, so the targets can simply be counted. Two
 * checks — no target claimed twice, and none of the expected wraps quietly missing, which is the other half
 * of the same incident: the activity wrap sat behind a `return` and was never reached, with no error at all.
 */
const wrapCalls = [];
for (const file of mjsUnder(path.join(ROOT, "scripts"))) {
    const source = fs.readFileSync(file, "utf8");
    for (const match of source.matchAll(/\bwrap\(\s*["']([^"']+)["']/g)) {
        wrapCalls.push({ target: match[1], file: path.relative(ROOT, file) });
    }
}

const claimedBy = new Map();
const duplicates = [];
for (const call of wrapCalls) {
    const previous = claimedBy.get(call.target);
    if (previous) duplicates.push(`${call.target}: ${previous} and ${call.file}`);
    else claimedBy.set(call.target, call.file);
}

check("no method is wrapped twice", duplicates, []);
check("every wrap the module needs is still there", [...claimedBy.keys()].sort(), [
    "CONFIG.PF2E.Actor.documentClasses.character.prototype.applyDamage",
    "CONFIG.PF2E.Item.documentClasses.action.prototype.toMessage",
    "CONFIG.PF2E.Item.documentClasses.spellcastingEntry.prototype.cast",
]);

function mjsUnder(dir) {
    return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return mjsUnder(full);
        return entry.name.endsWith(".mjs") ? [full] : [];
    });
}

/* -------------------------------------------------------------------------------------------- */

if (failures.length > 0) {
    console.error(`Rider tests failed: ${failures.length} of ${checks}.`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
}
console.log(`Rider tests passed: ${checks} checks.`);

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
const { collectRiders, isAbilityUse, riderAt } = await import("../scripts/riders/data.mjs");
const { mergeBypass, resistanceReduction, ignoresHardness, selectEntries } = await import(
    "../scripts/riders/bypass.mjs"
);
const { degreeOf } = await import("../scripts/lib/degree.mjs");
const { applyHeightening, applyThresholds, stepsFor, thresholdsCrossed, valueAtLevel } = await import(
    "../scripts/targeting/heightening.mjs"
);
const { intervalSeconds } = await import("../scripts/economy/recharge.mjs");
const { aimAngle } = await import("../scripts/targeting/place.mjs");
const { canRotate } = await import("../scripts/targeting/config.mjs");
const { REAIM } = await import("../scripts/targeting/review.mjs");

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

/**
 * The thresholds used to be four `strike-resolved` riders on the Cloth, guarded by "not already enfeebled"
 * and predicated on a needle count taken *before* the pass placed one. Three things were wrong with that
 * and only the third was visible: they reached only the needles a Strike placed, so *Scarlet Needle* and
 * the free action never triggered them; "not already enfeebled" is not the same question as "has this count
 * just crossed five"; and the fourteenth needle's runes were a whisper. They are one list on the needle
 * effect now — see the Leo/Virgo/Scorpio section below for the walk from one needle to fifteen.
 */
check(
    "the needle thresholds are not also on the Cloth",
    ridersOf(load("saint-class-features", "cloths", "scorpio-the-needle.json")) ?? [],
    [],
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

/*
 * Pisces asks about the *attacker's* weapon, so that weapon has to be in the option set.
 *
 * The roses shipped inert: on `strike-received` the attacker's weapon is deliberately not a rider source,
 * and nothing put it back as a predicate subject, so `item:melee` had nothing to match and the 1d6 poison
 * never landed. Both halves are checked — without a weapon the predicate must fail, with one it must pass —
 * because a fix that simply drops the predicate would pass the second check alone.
 */
const roses = ridersOf(pisces)[0];
const weapon = (options) => ({ getRollOptions: () => options });

check(
    "the roses cannot fire when no weapon reached the predicate",
    selectRiders([{ rider: roses, index: 0, item }], {
        outcome: "success",
        options: riderOptions({ originActor: actor(), targetActor: actor(), item: null }),
    }).length,
    0,
);
check(
    "the roses fire against an unarmed Strike",
    selectRiders([{ rider: roses, index: 0, item }], {
        outcome: "success",
        options: riderOptions({
            originActor: actor(),
            targetActor: actor(),
            item: weapon(["item:melee", "item:category:unarmed"]),
        }),
    }).length,
    1,
);

const diamondDust = load("saint-techniques", "slot-1-signature", "diamond-dust.json");
check(
    "a rider with no event still means save-rolled",
    collectRiders({ event: "save-rolled", item: { id: "dd", flags: diamondDust.flags }, actor: null }).length,
    1,
);

/*
 * A save rider belongs to the Technique that forced the save, and to nothing else on the sheet.
 *
 * Searching the whole actor for them is how one Fortitude save from *Scarlet Needle* also handed out
 * *Crimson Mirage*'s dazzled and *Antares*' "it dies" — 56 of the 57 save riders in the content carry no
 * predicate, so degree of success is the only thing separating them, and it separates nothing. The cast
 * below is the one from the bug report: a 16th-level Scorpio Saint owns all four of their Techniques.
 */
const scorpioSheet = [
    ["sn", load("saint-techniques", "slot-1-signature", "scarlet-needle.json")],
    ["cm", load("saint-techniques", "slot-2", "crimson-mirage.json")],
    ["cf", load("saint-techniques", "slot-3-cloth-ability", "crimson-flurry.json")],
    ["an", load("saint-techniques", "slot-4-ultimate", "antares.json")],
].map(([id, doc]) => ({ id, name: doc.name, flags: doc.flags }));

const scarletNeedle = scorpioSheet[0];
const onScarletNeedle = collectRiders({
    event: "save-rolled",
    item: scarletNeedle,
    actor: { items: scorpioSheet },
});

check(
    "a save collects riders from the Technique that forced it and no other",
    [...new Set(onScarletNeedle.map(({ item }) => item.name))],
    ["Scarlet Needle"],
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
/*  What counts as using an ability                                                              */
/* -------------------------------------------------------------------------------------------- */

/**
 * The loop guard, and the reason it exists.
 *
 * pf2e stamps the originating item onto every check it rolls, and `ChatMessagePF2e#item` reads it back. So
 * the Fortitude save Aurora Execution forces produces a message whose `item` *is* Aurora Execution. Before
 * this guard, `action-used` fired on that message too: save, damage, save, damage, until Foundry was closed.
 * These cases are the shapes of the real messages involved.
 */
const card = { rolls: [], flags: { pf2e: { origin: { uuid: "Item.aurora" } } } };
const spellCard = { rolls: [], flags: { pf2e: { context: { type: "spell-cast" } } } };
const selfEffect = { rolls: [], flags: { pf2e: { context: { type: "self-effect" } } } };
// The save carries the ability's own uuid in `origin` — that is the whole trap.
const saveRoll = {
    rolls: [{}],
    flags: { pf2e: { context: { type: "saving-throw" }, origin: { uuid: "Item.aurora" } } },
};
const damageRoll = { rolls: [{}], flags: { pf2e: { context: { type: "damage-roll" } } } };
const attackRoll = { rolls: [{}], flags: { pf2e: { context: { type: "attack-roll" } } } };
const unknown = { rolls: [], flags: { pf2e: { context: { type: "something-pf2e-adds-later" } } } };

check("an ability card is a use", isAbilityUse(card), true);
check("a spell card with a save is a use", isAbilityUse(spellCard), true);
check("a self-applied effect is a use", isAbilityUse(selfEffect), true);
check("the save the ability forced is NOT a use", isAbilityUse(saveRoll), false);
check("neither is the damage that follows it", isAbilityUse(damageRoll), false);
check("nor an attack roll", isAbilityUse(attackRoll), false);
check("an unknown context fails closed, not open", isAbilityUse(unknown), false);
check("anything with dice attached is a result, not a use", isAbilityUse({ rolls: [{}], flags: {} }), false);
check("nothing is not a use", isAbilityUse(null), false);
check("a message with no flags at all is a use", isAbilityUse({ rolls: [] }), true);

// The ability that actually did it, so the guard stays tied to the shape of content that needs it: an
// `action-used` rider whose own effect is to roll a save. Any ability written this way re-enters itself.
const aurora = ridersOf(load("saint-class-features", "actions", "aurora-execution.json"));
check("Aurora Execution fires on being used", aurora.map((rider) => rider.event), ["action-used"]);
check("…and what it does is force a save", aurora[0].apply.type, "save");
check(
    "…whose own message names Aurora Execution, and must not count as using it again",
    isAbilityUse(saveRoll),
    false,
);

// Testing the predicate proves it is correct, not that anything calls it — and an uncalled loop guard is
// no guard at all. Nothing offline can drive Foundry's chat pipeline, so the wiring is checked statically,
// the same way duplicate wrap targets are below.
const onActionUsed = fs
    .readFileSync(path.join(ROOT, "scripts", "riders", "sources.mjs"), "utf8")
    .split("async onActionUsed(")[1] ?? "";
check("the guard is the first thing onActionUsed does", /^[^}]{0,200}isAbilityUse\(/.test(onActionUsed), true);

/**
 * The other half of the same mistake: one use firing every ability that answers to being used.
 *
 * A Saint who has stood under two Zeniths owns two of these activities, and neither carries a predicate —
 * nothing tells them apart except which one was used. Searching the whole sheet for an `action-used` rider
 * makes one activity roll the other's save too.
 */
const withRiders = (name, riders) => ({ id: name, name, flags: { "isaacs-hb-pf2e": { riders } } });
const auroraItem = withRiders("Aurora Execution", aurora);
const rozanItem = withRiders("Rozan Hyaku Ryū Ha", ridersOf(load("saint-class-features", "actions", "rozan-hyaku-ry-ha.json")));
const saint = { items: [auroraItem, rozanItem] };

check(
    "using one Zenith activity fires only that one",
    collectRiders({ event: "action-used", item: auroraItem, actor: saint }).map((c) => c.item.name),
    ["Aurora Execution"],
);
check(
    "…and the other one, only itself",
    collectRiders({ event: "action-used", item: rozanItem, actor: saint }).map((c) => c.item.name),
    ["Rozan Hyaku Ryū Ha"],
);
// A Strike rider is written on the sky effect, not on the fist that threw it — `message.item` for a Strike
// is the weapon — so that search must stay wide or Scorpio's needles stop landing.
const scorpioSky = withRiders(
    "Sky: Ascendant (Scorpio)",
    ridersOf(load("saint-effects", "sky-ascendant", "sky-ascendant-scorpio.json")),
);
check(
    "a strike rider on the sky effect is still found from the fist that threw it",
    collectRiders({
        event: "strike-resolved",
        item: withRiders("Fist", []),
        actor: { items: [auroraItem, scorpioSky] },
    }).map((c) => c.item.name),
    ["Sky: Ascendant (Scorpio)", "Sky: Ascendant (Scorpio)", "Sky: Ascendant (Scorpio)"],
);

/* -------------------------------------------------------------------------------------------- */
/*  Aiming                                                                                       */
/* -------------------------------------------------------------------------------------------- */

/**
 * The opening direction of a cone or a line.
 *
 * Screen space, where y grows *downward*, so 90° is south and 270° is north. Getting that sign wrong is the
 * easy mistake and an invisible one: every line would simply point at its own mirror image, which reads as
 * "the aiming is broken" rather than as an inverted axis. `wall.mjs` reads the same rotation back when it
 * lays the Crystal Wall, so the error would show up on the scene as well as in the target list.
 */
const origin = { x: 100, y: 100 };
check("east is 0°", aimAngle(origin, { x: 200, y: 100 }), 0);
check("south is 90°, because y grows downward", aimAngle(origin, { x: 100, y: 200 }), 90);
check("west is 180°", aimAngle(origin, { x: 0, y: 100 }), 180);
check("north is 270°, not -90°", aimAngle(origin, { x: 100, y: 0 }), 270);
check("south-east is 45°", aimAngle(origin, { x: 200, y: 200 }), 45);
check("north-west is 225°", aimAngle(origin, { x: 0, y: 0 }), 225);
check("a caster with no token aims due east", aimAngle(null, { x: 200, y: 100 }), 0);
check("so does one with a nonsense point", aimAngle(origin, { x: NaN, y: 100 }), 0);

// Only the shapes that carry a `rotation` field are worth telling the caster about.
check("a line turns", canRotate("line"), true);
check("a cone turns", canRotate("cone"), true);
check("a cube turns", canRotate("cube"), true);
check("a burst does not", canRotate("burst"), false);
check("an emanation does not", canRotate("emanation"), false);
check("a ring does not", canRotate("ring"), false);
check("neither does a Technique with no area at all", canRotate(undefined), false);

// The three outcomes of the review dialog have to stay distinguishable: an empty array is a confirmation
// with nothing targetable, null is a cancellation, and re-aim is neither. Conflating the first two with the
// third would either spend the cast or eat it.
check("re-aim is not a cancellation", REAIM === null, false);
check("re-aim is not an empty confirmation", Array.isArray(REAIM), false);
check("re-aim survives the dialog's nullish coalescing", (REAIM ?? null) === REAIM, true);

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
/*  Om — the ceiling the stacks climb toward                                                     */
/* -------------------------------------------------------------------------------------------- */

/*
 * Om accumulated nothing for a release: spending was automated, lapsing was automated, and the end-of-turn
 * gain was never written, so a Virgo Saint sat at one stack however long they kept their eyes shut. The
 * ceiling is the part worth pinning down — five normally, seven only on a day Virgo is ascendant — because
 * the badge is authored with room for seven and nothing else says which of the two applies.
 */
const { Om } = await import("../scripts/outcomes/om.mjs");
const omEffect = load("saint-effects", "activities", "effect-om.json");
const sky = (options) => ({ getRollOptions: () => options });

check("Om stops at five under an ordinary sky", Om.ceilingFor(sky([]), omEffect), 5);
check(
    "Om reaches seven when Virgo is ascendant",
    Om.ceilingFor(sky(["sky:ascendant", "sky:sign:virgo"]), omEffect),
    7,
);
check(
    "another sign's ascendant does not raise Virgo's ceiling",
    Om.ceilingFor(sky(["sky:ascendant", "sky:sign:leo"]), omEffect),
    5,
);
check("the authored badge still caps the ceiling", Om.ceilingFor(sky([]), { system: { badge: { max: 3 } } }), 3);

/* -------------------------------------------------------------------------------------------- */
/*  A lit sky heightens everything, not just dice                                                */
/* -------------------------------------------------------------------------------------------- */

/**
 * "Your Techniques heighten as though you were 4 levels higher" is 2 steps, and a Zenith's 8 levels are 4.
 * That growth used to reach only the `DamageDice` rules, so a wall stayed its ordinary length on the one
 * day of the year it should have been longest. A Zenith emits `sky:ascendant` too, so the order matters.
 */
const { skyStepsFromOptions } = await import("../scripts/targeting/heightening.mjs");

check("an unlit sky is worth no steps", skyStepsFromOptions([]), 0);
check("an Ascendant day is worth two steps", skyStepsFromOptions(["sky:ascendant", "sky:sign:aries"]), 2);
check(
    "a Zenith is worth four, and outranks the ascendant option it also emits",
    skyStepsFromOptions(["sky:ascendant", "sky:zenith", "sky:sign:aries"]),
    4,
);
check("bonus steps are added to the steps the rank earned", stepsFor({ baseRank: 1, castRank: 10, bonusSteps: 2 }), 11);
check("bonus steps alone still count at base rank", stepsFor({ baseRank: 6, castRank: 6, bonusSteps: 4 }), 4);

// Crystal Wall is the clearest case: 15 ft base, +5 per step, and nothing else touches its length.
const crystalWall = load("saint-techniques", "slot-1-signature", "crystal-wall.json");
const wallFlag = crystalWall.flags["isaacs-hb-pf2e"].areaTargeting;
const wallLength = (castRank, bonusSteps) =>
    applyHeightening(
        { maxTargets: wallFlag.maxTargets, range: wallFlag.range, areas: wallFlag.areas, length: wallFlag.length },
        wallFlag.heightening,
        { baseRank: crystalWall.system.level.value, castRank, bonusSteps },
    ).length;

check("Crystal Wall is 60 feet at rank 10 under an ordinary sky", wallLength(10, 0), 60);
check("an Ascendant day makes it 70", wallLength(10, 2), 70);
check("a Zenith makes it 80", wallLength(10, 4), 80);
check("and a 1st-level Saint's wall is still 15 feet", wallLength(1, 0), 15);

/* -------------------------------------------------------------------------------------------- */
/*  Taurus, converted away from whispers                                                         */
/* -------------------------------------------------------------------------------------------- */

/**
 * Every forced movement the Bull inflicts now moves a token. These checks are the regression guard: a
 * prompt reappearing anywhere in Taurus means somebody has gone back to telling the GM to do it by hand.
 */
const taurusFiles = [
    ["saint-class-features", "cloths", "taurus-the-horn.json"],
    ["saint-techniques", "slot-1-signature", "great-horn.json"],
    ["saint-techniques", "slot-2", "pleiades-nova.json"],
    ["saint-techniques", "slot-3-cloth-ability", "titans-stance.json"],
    ["saint-techniques", "slot-4-ultimate", "titans-break-the-golden-horn.json"],
    ["saint-effects", "sky-ascendant", "sky-ascendant-taurus.json"],
    ["saint-effects", "sky-zenith", "sky-zenith-taurus.json"],
];

function everyRider(riders, out = []) {
    for (const rider of riders ?? []) {
        out.push(rider);
        everyRider(rider.apply?.riders, out);
    }
    return out;
}

const taurusRiders = taurusFiles.flatMap((parts) => everyRider(ridersOf(load(...parts))));
check("no Taurus rider is left as a whisper", taurusRiders.filter((r) => r.apply?.type === "prompt").length, 0);
check(
    "Taurus pushes are real movement",
    taurusRiders.filter((r) => r.apply?.type === "teleport").map((r) => r.apply.distance).sort((a, b) => a - b),
    [10, 10, 15, 60],
);

// The Ultimate's extra 4d8 fires on a critical failure only. Authored as a second `system.damage` part it
// was rolled against everyone, which made an 8d8 Technique deal 12d8 to every creature in the line.
const titansBreak = load("saint-techniques", "slot-4-ultimate", "titans-break-the-golden-horn.json");
check("Titan's Break rolls one damage part", Object.keys(titansBreak.system.damage).length, 1);
check(
    "and the conditional damage is a critical-failure rider that heightens",
    everyRider(ridersOf(titansBreak))
        .filter((r) => r.apply?.type === "damage")
        .map((r) => `${r.apply.formula}+${r.apply.perStep}/step [${(r.outcomes ?? []).join("/")}]`),
    ["4d8+1d8/step [criticalFailure]"],
);
// Four DamageDice rules shared one selector, so a lit sky counted twice.
check(
    "the sky's dice are added once, not twice",
    titansBreak.system.rules.filter((r) => r.key === "DamageDice").length,
    2,
);

// That rider's growth is counted the same way the Technique's own is: rank steps plus the sky's.
check(
    "the extra damage is 4d8 at base rank under an unlit sky",
    stepsFor({ baseRank: 8, castRank: 8, bonusSteps: skyStepsFromOptions([]) }),
    0,
);
check(
    "and grows to eight dice at rank 10 on an Ascendant day",
    4 + stepsFor({ baseRank: 8, castRank: 10, bonusSteps: skyStepsFromOptions(["sky:ascendant"]) }),
    8,
);

/* -------------------------------------------------------------------------------------------- */
/*  The volley                                                                                   */
/* -------------------------------------------------------------------------------------------- */

/**
 * *Pleiades Nova* is the first Technique to roll its own Strikes rather than pretend to be a spell attack.
 * The shape is load-bearing in three ways, and each has already been got wrong once:
 *
 *  - a `damage` block makes pf2e roll a spell attack instead, which is the whole RC-4 defect;
 *  - the rider must be `self`, or the volley runs once per target caught;
 *  - `substitutions` must be a list, because Foundry expands dotted *keys* into nested objects the first
 *    time an item is written to an actor, and the substitution then silently matches nothing.
 */
const novaTechnique = load("saint-techniques", "slot-2", "pleiades-nova.json");
const novaVolley = ridersOf(novaTechnique)[0];

check("Pleiades Nova no longer carries a damage block", Object.keys(novaTechnique.system.damage ?? {}).length, 0);
check("its rider rolls Strikes", novaVolley.apply.type, "strikes");
check("and fires once for the whole activity", novaVolley.self, true);
check("substitutions are a list, not an object keyed by path", Array.isArray(novaVolley.apply.substitutions), true);
check(
    "the Strikes' damage grows with the Technique, sky included",
    (Array.isArray(novaVolley.apply.substitutions) ? novaVolley.apply.substitutions : [])
        .map((s) => `${s.path}=${s.value}`),
    ["system.rules.0.diceNumber=origin.item.steps"],
);

// The penalty ladder lives on the effect, because a roll cannot be handed a modifier.
const novaEffect = load("saint-effects", "activities", "effect-pleiades-nova.json");
const penalties = novaEffect.system.rules
    .filter((r) => r.key === "FlatModifier")
    .map((r) => `${r.predicate[0]}=${r.value}`);
check(
    "every Strike after the first is one worse, out to the seventh",
    penalties,
    [
        "pleiades-nova:strike:2=-1", "pleiades-nova:strike:3=-2", "pleiades-nova:strike:4=-3",
        "pleiades-nova:strike:5=-4", "pleiades-nova:strike:6=-5", "pleiades-nova:strike:7=-6",
    ],
);
check(
    "and the substituted rule is the one that adds the dice",
    `${novaEffect.system.rules[0].key}/${novaEffect.system.rules[0].dieSize}/${novaEffect.system.rules[0].damageType}`,
    "DamageDice/d6/force",
);

/* -------------------------------------------------------------------------------------------- */
/*  Condition grants                                                                             */
/* -------------------------------------------------------------------------------------------- */

/**
 * A durationed condition rider is a `GrantItem` pointing at pf2e's condition item, and it is only as good
 * as the uuid it points at. `ConditionManager.getCondition` returns a temporary instance whose `uuid` is
 * null — only `sourceId` carries the compendium address — so reading `uuid` produced a grant of `null`:
 * the effect appeared with the right name and duration and granted nothing at all. Verified against a
 * running pf2e 8.3.0, where `getCondition("immobilized")` gives
 * `sourceId: "Compendium.pf2e.conditionitems.Item.eIcWbB5o3pP6OIMe"` and `uuid: null`.
 */
const { conditionUuidOf, receiptKeyFor, growByStep } = await import("../scripts/riders/apply.mjs");
const CONDITION_UUID = "Compendium.pf2e.conditionitems.Item.eIcWbB5o3pP6OIMe";

check(
    "a condition grant resolves through sourceId when uuid is null",
    conditionUuidOf({ name: "Immobilized", uuid: null, sourceId: CONDITION_UUID }),
    CONDITION_UUID,
);
check(
    "a condition grant still resolves if a future pf2e returns a real uuid",
    conditionUuidOf({ name: "Immobilized", uuid: CONDITION_UUID }),
    CONDITION_UUID,
);
check(
    "compendiumSource is accepted as well",
    conditionUuidOf({ name: "Immobilized", _stats: { compendiumSource: CONDITION_UUID } }),
    CONDITION_UUID,
);
check("a condition with no address at all resolves to null", conditionUuidOf({ name: "Immobilized" }), null);

/* -------------------------------------------------------------------------------------------- */
/*  Free-cast predicates                                                                         */
/* -------------------------------------------------------------------------------------------- */

/**
 * A free-cast predicate is only as good as the roll options pf2e actually emits.
 *
 * *Attuned Casting* shipped predicated on `item:time:1` / `item:time:2`, which reads correctly and matches
 * nothing: pf2e emits no time-based option at all. The option that carries a spell's cost is
 * `item:cast:actions:N`, confirmed against a running pf2e 8.3.0. A predicate naming an option nobody emits
 * fails silently — the boon simply never pays — so the shape is pinned here against the shipped content.
 */
const { testPredicate } = await import("../scripts/lib/roll-options.mjs");

/** Every Technique, as the option set pf2e would build for it. */
function techniqueCosts() {
    const dir = path.join(ROOT, "content", "saint-techniques");
    const out = [];
    const walk = (at) => {
        for (const entry of fs.readdirSync(at, { withFileTypes: true })) {
            const full = path.join(at, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith(".json")) {
                const doc = JSON.parse(fs.readFileSync(full, "utf8"));
                if (doc?.type === "spell") out.push({ name: doc.name, cost: String(doc.system?.time?.value ?? "") });
            }
        }
    };
    walk(dir);
    return out;
}

const attuned = load("saint-class-features", "actions", "attuned-casting.json");
const attunedPredicate = attuned.flags["isaacs-hb-pf2e"].freeCast.predicate;
const costed = techniqueCosts();

const matching = costed
    .filter(({ cost }) => testPredicate(attunedPredicate, new Set([`item:cast:actions:${cost}`])))
    .map(({ cost }) => cost);

check(
    "Attuned Casting pays for one- and two-action Techniques",
    [...new Set(matching)].sort(),
    ["1", "2"],
);
check(
    "Attuned Casting pays for every Technique that costs two actions or less",
    matching.length,
    costed.filter(({ cost }) => cost === "1" || cost === "2").length,
);
check(
    "Attuned Casting does not pay for a three-action Technique",
    testPredicate(attunedPredicate, new Set(["item:cast:actions:3"])),
    false,
);

/* -------------------------------------------------------------------------------------------- */
/*  Every aimed ability, through the real configFor                                              */
/* -------------------------------------------------------------------------------------------- */

// This exists because of a crash that made four abilities uncastable and went unnoticed through two
// full Cloth passes. `configFor` read `area.type` unguarded, and an ability may legitimately reach it
// with no area at all — "one creature within 60 feet" is a target count and a range. The TypeError went
// straight out of the `cast` wrapper, so *Another Dimension*, *Tenbu Hōrin*, *Rikudō Rinne* and
// *Star Guard: Exile* threw instead of casting. Every shipped flag is now run through the real function.
globalThis.canvas = { ready: true };
globalThis.game.settings = {
    get: (_module, key) => (key === "areaTargetingScope" ? "techniques" : true),
};
const { configFor: realConfigFor } = await import("../scripts/targeting/config.mjs");

const aimed = [];
(function walkContent(at) {
    for (const entry of fs.readdirSync(at, { withFileTypes: true })) {
        const full = path.join(at, entry.name);
        if (entry.isDirectory()) walkContent(full);
        else if (entry.name.endsWith(".json")) {
            const doc = JSON.parse(fs.readFileSync(full, "utf8"));
            if (doc?.flags?.["isaacs-hb-pf2e"]?.areaTargeting) aimed.push(doc);
        }
    }
})(path.join(ROOT, "content"));

const configFailures = [];
for (const doc of aimed) {
    const stub = {
        ...doc,
        name: doc.name,
        actor: { level: 20, getRollOptions: () => [] },
        // The heightened variant is what reaches `configFor` at cast time, so a rank is supplied.
        rank: Math.max(1, doc.system?.level?.value ?? 1),
        baseRank: doc.system?.level?.value ?? 1,
    };
    try {
        realConfigFor(stub);
    } catch (error) {
        configFailures.push(`${doc.name}: ${error.message}`);
    }
}
check("every aimed ability survives configFor", configFailures, []);
check("and there are enough of them for that to mean something", aimed.length > 20, true);

// Range came only from the flag, and no area Technique in the module sets it there — so "a 60-foot burst
// within 120 feet" placed the burst and never checked the 120 feet, on any Cloth. It now falls back to the
// spell's own `system.range`, which every one of them does state.
const { feetOf } = await import("../scripts/targeting/config.mjs");
check("a stated range parses to a number", [feetOf("120 feet"), feetOf("60 feet")], [120, 60]);

// `steps` is a fact about the cast, not about the flag. It used to be reported as zero whenever a
// Technique carried no flag-level `heightening` block — which *Mavros Eruption Clast* does not, since its
// damage and area are pf2e's business. The fire it leaves burning is not, and it grows a die a step, so it
// sat at 4d6 from 16th level to 20th.
check(
    "steps are counted with no heightening block to apply",
    applyHeightening({}, undefined, { baseRank: 8, castRank: 10 }).steps,
    2,
);
check(
    "and a lit sky still counts on top of that",
    applyHeightening({}, undefined, { baseRank: 8, castRank: 10, bonusSteps: 2 }).steps,
    4,
);
check(
    "a block that grows nothing relevant still reports the steps",
    applyHeightening({ range: 60 }, { range: 10 }, { baseRank: 1, castRank: 10 }),
    { maxTargets: 0, range: 150, areas: 1, length: 0, steps: 9 },
);
check("and one that is not a distance is no limit", [feetOf(""), feetOf("touch"), feetOf(null)], [0, 0, 0]);

// Only the shapes that are put down *away* from the caster need one. A cone or a line opens from the
// Saint's own space and an emanation is centred on it, so their reach is their own size.
// `cylinder` is absent deliberately: the only one in the content is *Rozan Shō Ryū Ha*, which the guide
// centres on the caster. It is aimed freely all the same — `anchor` treats only an emanation as
// self-centred — which is a Libra defect for that Cloth's own pass, not a missing range.
const AT_A_DISTANCE = new Set(["burst", "cube", "square", "ring"]);
const unreachable = aimed
    .filter((doc) => {
        const flag = doc.flags["isaacs-hb-pf2e"].areaTargeting;
        const area = flag.area ?? doc.system?.area;
        return (
            AT_A_DISTANCE.has(area?.type) &&
            area?.value &&
            !flag.range &&
            !feetOf(doc.system?.range?.value)
        );
    })
    .map((doc) => doc.name);
check("every area placed at a distance has a reach to check it against", unreachable, []);

/* -------------------------------------------------------------------------------------------- */
/*  Gemini                                                                                       */
/* -------------------------------------------------------------------------------------------- */

// Two Faces decides which half of *Another Dimension* happens, and it is the only place in the content
// where one Technique has two mutually exclusive bodies. Neither half may fire in the other's aspect.
const dimensionRiders = ridersOf(load("saint-techniques", "slot-1-signature", "another-dimension.json"));
const inAspect = (aspect, outcome) =>
    selectRiders(
        dimensionRiders.map((rider, index) => ({ rider, index, item: {} })),
        { outcome, options: new Set([`gemini-aspect:${aspect}`]) },
    ).map(({ rider }) => rider.apply.type);

check("Light banishes on a failure", inAspect("light", "failure"), ["banish"]);
check("Light banishes for longer on a critical failure", inAspect("light", "criticalFailure"), ["banish"]);
check("Shadow confuses instead of banishing", inAspect("shadow", "failure"), ["condition"]);
check("Shadow never banishes", inAspect("shadow", "criticalFailure"), ["condition"]);
check(
    "the two banishments are one minute and ten",
    dimensionRiders.filter((r) => r.apply.type === "banish").map((r) => r.duration.value),
    [1, 10],
);

// The whole point of *Swap Aspect*: the toggle it flips has to be the one the Technique above reads.
const swapAspect = ridersOf(load("saint-class-features", "actions", "swap-aspect.json"))[0];
const geminiCloth = load("saint-class-features", "cloths", "gemini-the-other-dimension.json");
const twoFaces = geminiCloth.system.rules.find(
    (rule) => rule.key === "RollOption" && rule.option === "gemini-aspect",
);
check("Swap Aspect flips the Cloth's own toggle", swapAspect.apply.option, twoFaces.option);
check(
    "and cycles exactly the suboptions the Cloth declares",
    swapAspect.apply.cycle.slice().sort(),
    twoFaces.suboptions.map((s) => s.value).sort(),
);

// The defect this pass fixed: the area's persistent fire was also a `system.damage` part, so pf2e rolled
// it against everyone caught in the blast on top of the burning ground dealing it.
const mavros = load("saint-techniques", "slot-4-ultimate", "mavros-eruption-clast.json");
check("Mavros' blast is one damage part, not two", Object.keys(mavros.system.damage), ["0"]);
check(
    "its persistent fire belongs to the ground it leaves burning",
    mavros.flags["isaacs-hb-pf2e"].lingering.damage.formula,
    "4d6",
);
check(
    "and grows a die per step there, since a lingering area is outside pf2e's heightening",
    mavros.flags["isaacs-hb-pf2e"].lingering.damage.perStep,
    "1d6",
);
check(
    "no sky rule doubles it either",
    mavros.system.rules.filter((rule) => rule.category === "persistent").length,
    0,
);

/* -------------------------------------------------------------------------------------------- */
/*  Cancer                                                                                       */
/* -------------------------------------------------------------------------------------------- */

// "For each creature that fails its save, you regain 3 Hit Points." Per failure and onto the caster is an
// unusual pair, and it is exactly the pair that broke the receipt key, so both halves are pinned here.
const kisoen = ridersOf(load("saint-techniques", "slot-2", "sekishiki-kisoen.json"));
const feed = kisoen.find((rider) => rider.apply.type === "heal");
check("the flames feed on a failure and a critical failure", feed.outcomes, ["failure", "criticalFailure"]);
check("they feed the Saint, not the creature that failed", feed.self, true);
check("three Hit Points a soul, growing by two a step", [feed.apply.value, feed.apply.perStep], [3, 2]);
check("capped at the Saint's level per casting", feed.apply.maxPerCast, "origin.level");

// The Ascendant Boon's "any creature you reduce to 0 Hit Points dies" moved onto the action *both* skies
// grant. On the Zenith effect, which carries no riders of its own, it previously did not exist at all.
const springOpens = load("saint-class-features", "actions", "the-yellow-spring-opens.json");
const cancerSkies = [
    ["saint-effects", "sky-ascendant", "sky-ascendant-cancer.json"],
    ["saint-effects", "sky-zenith", "sky-zenith-cancer.json"],
].map((parts) => load(...parts));
check(
    "the killing clause is a death, not a whisper",
    ridersOf(springOpens).filter((r) => r.event === "damage-applied").map((r) => r.apply.type),
    ["death"],
);
check(
    "and both skies grant the action that carries it",
    cancerSkies.map((sky) => sky.system.rules.some((rule) => rule.uuid?.endsWith("The Yellow Spring Opens"))),
    [true, true],
);
check(
    "so neither sky needs a rider of its own",
    cancerSkies.map((sky) => ridersOf(sky) ?? null),
    [null, null],
);

// The extra dice against undead and spirits follow the basic save the Technique already uses.
const konsoRiders = ridersOf(load("saint-techniques", "slot-3-cloth-ability", "sekishiki-konso-ha.json"));
const konsoExtra = konsoRiders.filter((rider) => rider.apply.type === "damage");
check(
    "undead and spirits take half, full and double as the save ladder says",
    konsoExtra.map((rider) => [rider.outcomes[0], rider.apply.formula]),
    [["success", "1d8"], ["failure", "2d8"], ["criticalFailure", "4d8"]],
);
check(
    "and nothing lands on a critical success",
    konsoExtra.some((rider) => rider.outcomes.includes("criticalSuccess")),
    false,
);
check(
    "every one of them is limited to undead and spirits",
    konsoExtra.every((rider) => JSON.stringify(rider.predicate).includes("target:trait:undead")),
    true,
);

// The Ultimate: two whispers became a drag and a death, and the damage became a ladder.
const tenryuDoc = load("saint-techniques", "slot-4-ultimate", "sekishiki-tenryu-ha.json");
const tenryu = ridersOf(tenryuDoc);
check(
    "no prompts left in the Cancer ultimate",
    tenryu.map((r) => r.apply.type),
    ["damage", "damage", "teleport", "death"],
);
const drag = tenryu.find((r) => r.apply.type === "teleport");
check("the drag pulls toward the mouth, thirty feet", [drag.apply.direction, drag.apply.distance], ["toward", 30]);

// pf2e halves damage by degree of success only for a *basic* save, and pf2e-toolbelt gates its automatic
// application on the same flag. This save is not basic — the guide gives it its own ladder — so the
// Technique carries the ladder itself, and must not also leave a `system.damage` block for pf2e to roll.
check("the ultimate's save is not a basic one", tenryuDoc.system.defense.save.basic, false);
check("so it carries no damage block for pf2e to roll unscaled", Object.keys(tenryuDoc.system.damage), []);
check(
    "and no sky dice either, which would count the Ascendant a second time on top of perStep",
    tenryuDoc.system.rules.filter((rule) => rule.key === "DamageDice").length,
    0,
);
const dmgLadder = tenryu.filter((r) => r.apply.type === "damage");
check(
    "half on a success, full on a failure, and full again on a critical failure",
    dmgLadder.map((r) => [r.outcomes.join("+"), r.apply.formula, r.apply.multiplier ?? 1]),
    [["success", "8d8", 0.5], ["failure+criticalFailure", "8d8", 1]],
);
check("both halves grow a die a step", dmgLadder.every((r) => r.apply.perStep === "1d8"), true);
check(
    "and the death is checked against what the damage leaves behind, not a snapshot before it",
    tenryu.find((r) => r.apply.type === "death").apply.hpFraction,
    0.5,
);

// The same shape elsewhere in the class, recorded so it cannot grow silently. Each of these states a
// success clause the system will not apply, and each belongs to a Cloth that has not had its pass yet.
const unscaled = [];
(function walkTechniques(at) {
    for (const entry of fs.readdirSync(at, { withFileTypes: true })) {
        const full = path.join(at, entry.name);
        if (entry.isDirectory()) walkTechniques(full);
        else if (entry.name.endsWith(".json")) {
            const doc = JSON.parse(fs.readFileSync(full, "utf8"));
            const save = doc?.system?.defense?.save;
            const damage = doc?.system?.damage ?? {};
            if (save?.basic === false && Object.keys(damage).length > 0
                && /Success<\/strong>\s*Half damage/i.test(doc.system.description?.value ?? "")) {
                unscaled.push(doc.name);
            }
        }
    }
})(path.join(ROOT, "content"));
check("the unscaled success clauses are the one still known — Royal Funeral joined Sekishiki Tenryū Ha's fix in the Pisces pass", unscaled.sort(), ["Koliço"]);

// The standing policy, checked the way Taurus' was: neither Cloth may ship a whisper.
const geminiCancerFiles = [
    ["saint-techniques", "slot-1-signature", "another-dimension.json"],
    ["saint-techniques", "slot-2", "astral-projection.json"],
    ["saint-techniques", "slot-3-cloth-ability", "galaxian-explosion.json"],
    ["saint-techniques", "slot-4-ultimate", "mavros-eruption-clast.json"],
    ["saint-techniques", "slot-1-signature", "sekishiki-meikai-ha.json"],
    ["saint-techniques", "slot-2", "sekishiki-kisoen.json"],
    ["saint-techniques", "slot-3-cloth-ability", "sekishiki-konso-ha.json"],
    ["saint-techniques", "slot-4-ultimate", "sekishiki-tenryu-ha.json"],
    ["saint-class-features", "cloths", "gemini-the-other-dimension.json"],
    ["saint-class-features", "cloths", "cancer-the-yellow-spring.json"],
    ["saint-class-features", "actions", "swap-aspect.json"],
    ["saint-class-features", "actions", "the-yellow-spring-opens.json"],
    ["saint-class-features", "actions", "the-yellow-spring-is-here.json"],
    ["saint-effects", "sky-ascendant", "sky-ascendant-gemini.json"],
    ["saint-effects", "sky-zenith", "sky-zenith-gemini.json"],
    ["saint-effects", "sky-ascendant", "sky-ascendant-cancer.json"],
    ["saint-effects", "sky-zenith", "sky-zenith-cancer.json"],
];
const geminiCancerPrompts = geminiCancerFiles
    .filter((parts) => (ridersOf(load(...parts)) ?? []).some((rider) => rider.apply?.type === "prompt"))
    .map((parts) => parts.at(-1));
check("Gemini and Cancer leave nothing to the table", geminiCancerPrompts, []);

// Foundry's document collections are Maps with a few array methods bolted on — `map`, `filter`, `find`,
// `reduce`, `some`, `every` — and nothing else. `flatMap` in particular is not there, and calling it threw
// on every turn start of a Gemini Saint on a Zenith day, so the duplicate never once appeared.
const collectionMisuse = [];
(function walkForCollections(at) {
    for (const entry of fs.readdirSync(at, { withFileTypes: true })) {
        const full = path.join(at, entry.name);
        if (entry.isDirectory()) walkForCollections(full);
        else if (entry.name.endsWith(".mjs")) {
            const text = fs.readFileSync(full, "utf8");
            for (const [i, line] of text.split("\n").entries()) {
                const bad = /\.(tokens|regions|items|combatants|effects|walls|drawings|lights|scenes|actors|messages|users|combats)\.(flatMap|sort|slice|concat|includes|indexOf|at|join|flat)\(/.exec(line);
                if (bad) collectionMisuse.push(`${path.relative(ROOT, full)}:${i + 1} .${bad[1]}.${bad[2]}()`);
            }
        }
    }
})(path.join(ROOT, "scripts"));
check("no array-only method is called on a document collection", collectionMisuse, []);

// A second regression guard, from the same family. The build rewrites a *content* uuid from the name it
// is authored under to the packed id, so `@UUID[…Item.Effect: X]` in JSON resolves at the table. Code gets
// no such pass — `fromUuid` on a name-shaped compendium uuid returns null, silently — so a script must
// never hold one. Astral Projection shipped with two and did nothing at all.
const scriptUuids = [];
(function walkScripts(at) {
    for (const entry of fs.readdirSync(at, { withFileTypes: true })) {
        const full = path.join(at, entry.name);
        if (entry.isDirectory()) walkScripts(full);
        else if (entry.name.endsWith(".mjs")) {
            for (const line of fs.readFileSync(full, "utf8").split("\n")) {
                const match = /["'`]Compendium\.isaacs-hb-pf2e\.[\w-]+\.\w+\.(.+?)["'`]/.exec(line);
                // A 16-character id is fine; anything else is a name and will not resolve.
                if (match && !/^[A-Za-z0-9]{16}$/.test(match[1])) {
                    scriptUuids.push(`${path.relative(ROOT, full)}: ${match[1]}`);
                }
            }
        }
    }
})(path.join(ROOT, "scripts"));
check("no script holds a compendium uuid by name", scriptUuids, []);

// The regression guard. `item:time:N` looks plausible enough to be written again by hand.
const retired = [];
for (const [file, doc] of (() => {
    const found = [];
    const walk = (at) => {
        for (const entry of fs.readdirSync(at, { withFileTypes: true })) {
            const full = path.join(at, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith(".json")) found.push([full, fs.readFileSync(full, "utf8")]);
        }
    };
    walk(path.join(ROOT, "content"));
    return found;
})()) {
    if (doc.includes("item:time:")) retired.push(path.relative(ROOT, file));
}
check("no content predicates the roll option pf2e never emits", retired, []);

/* -------------------------------------------------------------------------------------------- */
/*  Leo, Virgo and Scorpio                                                                       */
/* -------------------------------------------------------------------------------------------- */

/**
 * The needle thresholds, walked one needle at a time.
 *
 * Scorpio's Cloth is the only place in the content where a *number* rather than a degree of success decides
 * what happens, and it is the shape most likely to fire twice: enfeebled applied again on the sixth needle
 * would be enfeebled 2, on the seventh enfeebled 3, and a creature would be enfeebled 11 by the fifteenth.
 * Every needle is placed here, in order, and the crossings are counted.
 */
{
    const needle = load("saint-effects", "riders", "effect-scarlet-needle.json");
    const thresholds = needle.flags["isaacs-hb-pf2e"].counterThresholds;
    const fired = [];
    for (let count = 1; count <= 15; count++) {
        for (const crossed of thresholdsCrossed(thresholds, count - 1, count)) {
            fired.push(`${count}:${crossed.apply.slug ?? slugOf(crossed.apply.uuid)}`);
        }
    }
    check(
        "each needle threshold fires exactly once, on the needle that crosses it",
        fired,
        ["5:enfeebled", "10:blinded", "14:stunned", "14:runes-severed"],
    );
    check("the needle counter still tops out at fifteen", needle.system.badge.max, 15);
    check(
        "needles last until the encounter ends, which is what the Cloth says",
        needle.system.duration.unit,
        "encounter",
    );
    check(
        "no threshold sits above the counter's own ceiling",
        thresholds.filter((t) => t.at > needle.system.badge.max).length,
        0,
    );
}

/** A counter that arrives already above a threshold does not fire it retroactively. */
check(
    "a counter already past the fifth needle does not fire it again",
    thresholdsCrossed([{ at: 5 }, { at: 10 }], 5, 6).length,
    0,
);
check(
    "a jump from 3 to 11 crosses both thresholds it passed",
    thresholdsCrossed([{ at: 5 }, { at: 10 }], 3, 11).length,
    2,
);

/**
 * The Scorpion asks its question at eight needles, and at five on a Zenith.
 *
 * Both boons carry the same three riders; only the threshold differs, and it differs in a predicate rather
 * than in code, so the wrong number would look exactly like the right one.
 */
for (const [dir, at] of [["sky-ascendant", 8], ["sky-zenith", 5]]) {
    const sky = load("saint-effects", dir, `${dir}-scorpio.json`);
    const riders = ridersOf(sky);
    const death = riders.find((rider) => rider.apply.type === "save");
    check(
        `Scorpio's ${dir} death waits for ${at} needles`,
        death.predicate,
        [`rider:target:effect:effect-scarlet-needle:${at}+`],
    );
    check(`and it is a death rather than a whisper (${dir})`, death.apply.riders[0].apply.type, "death");
    const bleed = riders.find((rider) => rider.apply.type === "persistent-damage");
    check(`the bleed is capped at ten needles (${dir})`, bleed.apply.max, 10);
    // Both of these count a needle that another rider in the same pass has just placed. Against the
    // snapshot they are one behind: the first needle draws no blood and the Scorpion asks its question on
    // the ninth. Found at the table, on the eighth needle that did nothing.
    check(`the bleed reads the needle it was just given (${dir})`, bleed.live, true);
    check(`and so does the death (${dir})`, death.live, true);
    check(
        `while the needle itself is not live (${dir}) — nothing in the pass has placed it yet`,
        riders.find((rider) => rider.apply.type === "effect").live,
        undefined,
    );
}

/**
 * No escalation ladder may be live.
 *
 * The snapshot is what makes Virgo's four senses advance one step per hit; a `live` rider there would take
 * all four at once. So the field is checked against every ladder in the content, not just Virgo's.
 */
{
    const ladders = [];
    for (const [dir, file] of [
        ["sky-ascendant", "sky-ascendant-virgo.json"],
        ["sky-zenith", "sky-zenith-virgo.json"],
        ["sky-ascendant", "sky-ascendant-aquarius.json"],
    ]) {
        const sky = load("saint-effects", dir, file);
        for (const rider of ridersOf(sky) ?? []) {
            for (const inner of rider.apply?.riders ?? []) {
                if (inner.live === true && (inner.predicate ?? []).length > 0) ladders.push(`${file}: ${inner.apply.type}`);
            }
            if (rider.live === true && rider.apply?.type === "save") ladders.push(`${file}: outer save`);
        }
    }
    check("no sense ladder is chosen against the world it is changing", ladders, []);
}

/** Below the threshold, nothing is asked. The snapshot is the whole mechanism. */
{
    const sky = load("saint-effects", "sky-ascendant", "sky-ascendant-scorpio.json");
    const riders = ridersOf(sky).filter((rider) => rider.event === "strike-resolved");
    const at = (needles) =>
        selectRiders(
            riders.map((rider, index) => ({ rider, index, item: null })),
            {
                outcome: "success",
                options: riderOptions({
                    originActor: actor(),
                    targetActor: actor({ effects: { "effect-scarlet-needle": needles } }),
                    item: null,
                }),
            },
        ).map(({ rider }) => rider.apply.type);
    check("no needles: only the needle itself", at(0), ["effect"]);
    check("one needle: the needle and the bleed", at(1), ["effect", "persistent-damage"]);
    check("seven needles: still no question asked", at(7), ["effect", "persistent-damage"]);
    check("eight needles: the Scorpion asks", at(8), ["effect", "persistent-damage", "save"]);
}

/**
 * Crimson Flurry's misses.
 *
 * "On any day your constellation is ascendant, Strikes that miss apply a needle too" is one predicate on
 * one follow-up, and getting it wrong in either direction is invisible: needles on every miss forever, or
 * never.
 */
{
    const flurry = load("saint-techniques", "slot-3-cloth-ability", "crimson-flurry.json");
    const volley = ridersOf(flurry)[0].apply;
    check("a hit always places a needle", volley.onHit.length, 1);
    check("a miss places one only under Scorpio's own sky", volley.onMiss[0].predicate, [
        "sky:ascendant",
        "sky:sign:scorpio",
    ]);
    check("the volley makes as many Strikes as the Technique has", volley.count, "maxTargets");
    check("and it is a self rider, so it fires once for the whole cast", ridersOf(flurry)[0].self, true);
}

/**
 * The Strike counts, at every level a Saint can be.
 *
 * Both volleys grow at named character levels rather than per step, so the ladder cannot be derived from
 * the rank and has to be read out of the flag. A lit sky is worth four levels, which moves the thresholds
 * as well as the dice — the clause the Boons state and the code used not to honour.
 */
{
    const strikes = (doc, level, sky = 0) => {
        const flag = doc.flags["isaacs-hb-pf2e"].areaTargeting;
        const grown = applyHeightening({ maxTargets: flag.maxTargets }, flag.heightening, {
            baseRank: doc.system.level.value,
            castRank: Math.ceil(level / 2),
            bonusSteps: sky,
        });
        applyThresholds(grown, flag.heightening, level + sky * 2);
        return grown.maxTargets;
    };
    const plasma = load("saint-techniques", "slot-3-cloth-ability", "lightning-plasma.json");
    check(
        "Lightning Plasma: three Strikes, four from 17th",
        [11, 16, 17, 20].map((level) => strikes(plasma, level)),
        [3, 3, 4, 4],
    );
    check("and an Ascendant sky brings the fourth Strike forward to 13th", strikes(plasma, 13, 2), 4);

    const flurry = load("saint-techniques", "slot-3-cloth-ability", "crimson-flurry.json");
    check(
        "Crimson Flurry: four Strikes, five from 15th, six from 19th",
        [11, 14, 15, 18, 19, 20].map((level) => strikes(flurry, level)),
        [4, 4, 5, 5, 6, 6],
    );

    // Taurus has the same sentence and shipped with the same defect: the volley made one Strike per
    // confirmed target, so a Saint facing one enemy made one Strike out of five. Found by walking Leo.
    const nova = load("saint-techniques", "slot-2", "pleiades-nova.json");
    check("Pleiades Nova makes its own five Strikes, not one per creature", ridersOf(nova)[0].apply.count, "maxTargets");
    check(
        "Pleiades Nova: five Strikes, six from 12th, seven from 18th",
        [6, 11, 12, 17, 18, 20].map((level) => strikes(nova, level)),
        [5, 5, 6, 6, 7, 7],
    );
}

/** Lightning Crown's pillars: three, and one more at 10th, 14th and 18th. */
{
    const crown = load("saint-techniques", "slot-2", "lightning-crown.json");
    const flag = crown.flags["isaacs-hb-pf2e"].areaTargeting;
    const pillars = (level, sky = 0) => {
        const grown = applyHeightening({ areas: flag.areas }, flag.heightening, {
            baseRank: crown.system.level.value,
            castRank: Math.ceil(level / 2),
            bonusSteps: sky,
        });
        applyThresholds(grown, flag.heightening, level + sky * 2);
        return grown.areas;
    };
    check(
        "Lightning Crown: 3 pillars, then 4, 5 and 6",
        [6, 9, 10, 13, 14, 17, 18, 20].map((level) => pillars(level)),
        [3, 3, 4, 4, 5, 5, 6, 6],
    );
    check("the pillar's area is the square it stands in and everything adjacent", flag.area, {
        type: "square",
        value: 15,
    });
    check(
        "two pillars on one creature is one save at a penalty",
        crown.flags["isaacs-hb-pf2e"].overlap.value,
        -2,
    );
    // pf2e names the spell forcing a save `item:slug:…`; `origin:` is the caster and the action's traits.
    // The first version predicated on `origin:item:slug:lightning-crown`, which put the modifier in the
    // breakdown and left it switched off — visible only by reading a real save's modifier list.
    check(
        "and the penalty is predicated on an option a saving throw actually carries",
        crown.flags["isaacs-hb-pf2e"].overlap.predicate,
        ["item:slug:lightning-crown"],
    );
    check(
        "no content predicates a save on origin:item:slug, which pf2e never emits",
        JSON.stringify(crown).includes("origin:item:slug"),
        false,
    );
    check("and the pillars stand for a round, lighting and blocking", [
        crown.flags["isaacs-hb-pf2e"].lingering.duration,
        crown.flags["isaacs-hb-pf2e"].lingering.blocksSight,
    ], [{ unit: "rounds", value: 1 }, true]);
}

/**
 * Tenporin'in's bonus, which is the caster's level deciding a number on an ally's sheet.
 *
 * The ladder has to be resolved at hand-out time, so an off-by-one here is a bonus that is right for the
 * Saint and wrong for everyone wearing it.
 */
{
    const wheel = load("saint-techniques", "slot-2", "tenporinin.json");
    const rider = ridersOf(wheel)[0];
    const bonus = rider.apply.substitutions[0].value;
    check(
        "Tenporin'in: +1, +2 from 12th, +3 from 18th",
        [6, 11, 12, 17, 18, 20].map((level) => valueAtLevel(bonus, level)),
        [1, 1, 2, 2, 3, 3],
    );
    const confused = rider.apply.substitutions[2].value;
    check(
        "and the confused immunity is switched off by a predicate nothing satisfies until 12th",
        [11, 12].map((level) => valueAtLevel(confused, level)),
        [["tenporinin:refined"], []],
    );
    check("the aura is no longer a rule element live from the moment it is on the sheet", wheel.system.rules, []);
    check("the counteract offer is one for the whole cast", ridersOf(wheel)[1].self, true);

    // Found live: the aura buff itself carried the `mental` trait, so casting the Technique again while an
    // earlier casting's buff was still standing on an ally offered to counteract that ally's own aura —
    // "a mental effect currently affecting a creature" caught the beneficial one sitting right beside it.
    const aura = load("saint-effects", "activities", "effect-tenporinin.json");
    check("Tenpōrin'in's own aura cannot offer to counteract itself", aura.system.traits.value, []);
}

/** Crimson Mirage's per-needle die, which grows at three named levels. */
{
    const mirage = load("saint-techniques", "slot-2", "crimson-mirage.json");
    const formula = ridersOf(mirage)[0].apply.substitutions[0].value;
    check(
        "Crimson Mirage: 1d6 a needle, then 2d6, 3d6 and 4d6",
        [6, 9, 10, 13, 14, 17, 18, 20].map((level) => valueAtLevel(formula, level)),
        ["1d6", "1d6", "2d6", "2d6", "3d6", "3d6", "4d6", "4d6"],
    );
    check(
        "and it only reaches a creature that already has a needle in it",
        mirage.flags["isaacs-hb-pf2e"].areaTargeting.predicate,
        ["rider:target:effect:effect-scarlet-needle:1+"],
    );
}

/** Antares needs five needles, and kills rather than whispering. */
{
    const antares = load("saint-techniques", "slot-4-ultimate", "antares.json");
    check(
        "Antares reaches only a creature with five needles",
        antares.flags["isaacs-hb-pf2e"].areaTargeting.predicate,
        ["rider:target:effect:effect-scarlet-needle:5+"],
    );
    check(
        "and its critical failure is a death",
        ridersOf(antares).find((rider) => rider.outcomes[0] === "criticalFailure").apply.type,
        "death",
    );
}

/** Rikudo Rinne: the soul leaves for a minute or for ten, and the body stays where it fell. */
{
    const rinne = load("saint-techniques", "slot-4-ultimate", "rikudo-rinne.json");
    const riders = ridersOf(rinne);
    check("no half of the six realms is left to the table", riders.filter((r) => r.apply.type === "prompt"), []);
    check(
        "a failure is a minute stunned, a critical failure ten",
        riders.filter((r) => r.apply.slug === "stunned" && r.duration).map((r) => r.duration),
        [{ unit: "minutes", value: 1 }, { unit: "minutes", value: 10 }],
    );
    check(
        "and the stun is locked at three actions, which is every action it has",
        riders.filter((r) => r.apply.slug === "stunned" && r.duration).map((r) => [r.apply.value, r.apply.max]),
        [[3, 3], [3, 3]],
    );
}

/** Tenma Kofuku changes shape when the eyes open, and only then. */
{
    const kofuku = load("saint-techniques", "slot-3-cloth-ability", "tenma-kofuku.json");
    const alternate = kofuku.flags["isaacs-hb-pf2e"].areaTargeting.alternateArea;
    check("open eyes turn the cone into a 60-foot emanation", alternate[0].area, {
        type: "emanation",
        value: 60,
    });
    check("and nothing else does", alternate[0].predicate, ["om:eyes-open"]);
    check("the cone it starts as is still 30 feet", kofuku.system.area, { type: "cone", value: 30 });
    check(
        "the reaction denial is an effect with a timer rather than a line of text",
        ridersOf(kofuku).filter((r) => r.apply.type === "prompt"),
        [],
    );
}

/** Photon Burst offers both shapes, and force resistance does not stop light. */
{
    const burst = load("saint-techniques", "slot-4-ultimate", "photon-burst.json");
    check(
        "Photon Burst is a 120-foot line or a 30-foot burst",
        burst.flags["isaacs-hb-pf2e"].areaTargetingShapes.map((shape) => [shape.type, shape.value]),
        [["line", 120], ["burst", 30]],
    );
    const bypass = burst.flags["isaacs-hb-pf2e"].bypass[0];
    check("and it ignores resistance to force", bypass.resistance.types, ["force"]);
    check("only its own", bypass.predicate, ["item:slug:photon-burst"]);
}

/**
 * No whisper left on any of the three Cloths.
 *
 * The programme's own definition of done. A prompt reintroduced anywhere in Leo, Virgo or Scorpio fails the
 * build rather than being noticed a session later.
 */
{
    const promptsIn = (doc) => {
        const found = [];
        const walk = (riders, at) => {
            for (const [i, rider] of (riders ?? []).entries()) {
                if (rider?.apply?.type === "prompt") found.push(`${at}[${i}]`);
                walk(rider?.apply?.riders, `${at}[${i}].riders`);
                walk(rider?.apply?.onHit, `${at}[${i}].onHit`);
                walk(rider?.apply?.onMiss, `${at}[${i}].onMiss`);
                for (const [j, option] of (rider?.apply?.options ?? []).entries()) {
                    if (option?.apply?.type === "prompt") found.push(`${at}[${i}].options[${j}]`);
                }
            }
        };
        walk(ridersOf(doc), "riders");
        walk(doc.flags?.["isaacs-hb-pf2e"]?.counterThresholds, "counterThresholds");
        return found;
    };

    const walked = [
        ["saint-techniques/slot-1-signature", "lightning-bolt.json"],
        ["saint-techniques/slot-2", "lightning-crown.json"],
        ["saint-techniques/slot-3-cloth-ability", "lightning-plasma.json"],
        ["saint-techniques/slot-4-ultimate", "photon-burst.json"],
        ["saint-techniques/slot-1-signature", "tenbu-horin.json"],
        ["saint-techniques/slot-2", "tenporinin.json"],
        ["saint-techniques/slot-3-cloth-ability", "tenma-kofuku.json"],
        ["saint-techniques/slot-4-ultimate", "rikudo-rinne.json"],
        ["saint-techniques/slot-1-signature", "scarlet-needle.json"],
        ["saint-techniques/slot-2", "crimson-mirage.json"],
        ["saint-techniques/slot-3-cloth-ability", "crimson-flurry.json"],
        ["saint-techniques/slot-4-ultimate", "antares.json"],
        ["saint-effects/sky-ascendant", "sky-ascendant-leo.json"],
        ["saint-effects/sky-zenith", "sky-zenith-leo.json"],
        ["saint-effects/sky-ascendant", "sky-ascendant-virgo.json"],
        ["saint-effects/sky-zenith", "sky-zenith-virgo.json"],
        ["saint-effects/sky-ascendant", "sky-ascendant-scorpio.json"],
        ["saint-effects/sky-zenith", "sky-zenith-scorpio.json"],
        ["saint-effects/riders", "effect-scarlet-needle.json"],
        ["saint-class-features/actions", "six-realms-unmade.json"],
        ["saint-class-features/actions", "place-a-scarlet-needle.json"],
        ["saint-class-features/actions", "om.json"],
        ["saint-class-features/actions", "open-your-eyes.json"],
        // The Cloths themselves. Scorpio's carried four `strike-resolved` threshold riders — one of them a
        // prompt — that duplicated the needle effect's own thresholds and only ever fired on a Strike.
        ["saint-class-features/cloths", "leo-the-lightning.json"],
        ["saint-class-features/cloths", "virgo-nearest-to-god.json"],
        ["saint-class-features/cloths", "scorpio-the-needle.json"],
    ];
    const remaining = [];
    for (const [dir, file] of walked) {
        const doc = load(...dir.split("/"), file);
        for (const where of promptsIn(doc)) remaining.push(`${file}: ${where}`);
    }
    check("nothing on Leo, Virgo or Scorpio is left to the table", remaining, []);

    // The thresholds are stated once. Two copies is two chances to disagree, and the copy on the Cloth
    // reached only the needles a Strike placed.
    const cloth = load("saint-class-features", "cloths", "scorpio-the-needle.json");
    check("Scorpio's thresholds live on the needle, not on the Cloth as well", ridersOf(cloth) ?? [], []);
}

/**
 * The receipt-key collision found live: a self rider and a non-self rider landing on the same token.
 *
 * *Tenpōrin'in* is a `self`-riderless buff plus a `self: true` counteract offer, and its area `includesSelf`
 * — so the caster's own token is `payload.targetUuid` for two different relay requests: the self-only one
 * `Sources.onActionUsed` sends for the counteract, and the ordinary per-target one it sends because the
 * caster is one of the confirmed targets. Both used to produce the identical receipt key, so the counteract
 * offer's receipt made the buff's own application look like a re-application and it was silently declined —
 * the Saint got the card and never their own aura. Verified live in world `pf`: with the fix reverted, the
 * cast leaves exactly one receipt on the message and no buff on the caster; with it applied, the aura lands.
 */
{
    const selfPayload = { event: "action-used", targetUuid: "Scene.x.Token.abc", selfOnly: true };
    const targetedPayload = { event: "action-used", targetUuid: "Scene.x.Token.abc", selfOnly: false };
    check(
        "a self-only wave and a per-target wave landing on the same token get different receipts",
        receiptKeyFor(selfPayload, "abc") === receiptKeyFor(targetedPayload, "abc"),
        false,
    );
    // Sekishiki Kisōen's own shape must still work: a `self` rider on a per-target event, keyed apart by
    // which creature the event was about rather than by which wave sent it.
    const failureOne = { event: "save-rolled", targetUuid: "Scene.x.Token.enemy1" };
    const failureTwo = { event: "save-rolled", targetUuid: "Scene.x.Token.enemy2" };
    check(
        "two different creatures failing the same save still earn two receipts for the same healer",
        receiptKeyFor(failureOne, "healer") === receiptKeyFor(failureTwo, "healer"),
        false,
    );
    // An event that never splits into waves — most of them — is untouched: the key is the same shape it
    // always was, so no receipt written before this fix stops matching after it.
    check(
        "an ordinary rider's key still has no wave to distinguish",
        receiptKeyFor({ event: "strike-resolved", targetUuid: "Scene.x.Token.foe" }, "foe"),
        "strike-resolved:any:foe:foe",
    );
}

/* -------------------------------------------------------------------------------------------- */
/*  Sagittarius, Capricorn and Aquarius                                                          */
/* -------------------------------------------------------------------------------------------- */

/**
 * Chiron's Light Impulse used to be eight sentences and `rules: []` — no flags at all, so casting it did
 * nothing but roll a meaningless damage link. It is now a granted buff with its own heightening.
 */
{
    const chiron = load("saint-techniques", "slot-2", "chirons-light-impulse.json");
    check("Chiron's Light Impulse deals no damage of its own — the buff it grants does", chiron.system.damage, {});
    check("and so it carries no heightening block", chiron.system.heightening, undefined);
    const rider = ridersOf(chiron)[0];
    check("casting it grants the golden-light buff", rider.apply.type, "effect");
    const buff = load("saint-effects", "activities", "effect-chirons-light-impulse.json");
    check(
        "the buff's own rules: +1 to attack, +1d6 force on hits, fly 20, and the two guided-roll options",
        buff.system.rules.map((r) => r.key),
        ["FlatModifier", "DamageDice", "BaseSpeed", "SubstituteRoll", "SubstituteRoll"],
    );
    check(
        "both SubstituteRoll rules spend themselves the moment they are used",
        buff.system.rules.filter((r) => r.key === "SubstituteRoll").map((r) => r.removeAfterRoll),
        ["if-enabled", "if-enabled"],
    );
    check(
        "the extra damage starts at 1d6 and grows 1d6 a step (not from zero, the way Pleiades Nova's does)",
        rider.apply.substitutions.find((s) => s.path.endsWith(".diceNumber")).value,
        { base: 1, perStep: 1 },
    );
    const flyLadder = rider.apply.substitutions.find((s) => s.path.endsWith(".value")).value;
    check(
        "…20 feet below 14th, the target's own Speed from 14th",
        [6, 13, 14, 20].map((level) => valueAtLevel(flyLadder, level)),
        [20, 20, "@actor.attributes.speed.value", "@actor.attributes.speed.value"],
    );
}

/** Golden Arrow's Zenith reach: its own damage ladder, plus a flat eight dice, no attack roll to miss. */
{
    const shot = load("saint-class-features", "actions", "golden-arrow-named-shot.json");
    check("granted once per minute", shot.system.frequency, { max: 1, per: "PT1M", value: 1 });
    check(
        "it can be aimed through any barrier on the scene",
        shot.flags["isaacs-hb-pf2e"].areaTargeting.requireLineOfEffect,
        false,
    );
    // A granted action carries no rank of its own, so its damage cannot be `perStep` off itself — it
    // reads Golden Arrow's current heightened total by name and adds the Zenith's flat 8 dice on top,
    // which must not scale a second time when Golden Arrow's own heightening already has.
    check(
        "its damage tracks Golden Arrow's own current total, plus a flat eight dice that do not scale again",
        ridersOf(shot)[0].apply,
        { damageType: "force", formula: "origin.technique.Golden Arrow.damage+8d6", type: "damage" },
    );
    const zenith = load("saint-effects", "sky-zenith", "sky-zenith-sagittarius.json");
    check(
        "the Zenith is what grants it",
        zenith.system.rules.some((r) => r.key === "GrantItem" && r.uuid.endsWith("Golden Arrow: Named Shot")),
        true,
    );
}

/** Excalibur's ladder was missing outright: deadly d10 forever, no bonus die, at any level. */
{
    const effect = load("saint-effects", "activities", "effect-excalibur.json");
    check(
        "the deadly upgrade and the bonus die are both on the effect, ready to be substituted in",
        [effect.system.rules[2].key, effect.system.rules[3].key],
        ["AdjustStrike", "DamageDice"],
    );
    const rider = ridersOf(load("saint-techniques", "slot-1-signature", "excalibur.json"))[0];
    const [deadly, bonus] = rider.apply.substitutions.map((s) => s.value);
    check(
        "deadly d10 until 10th, then d12",
        [6, 9, 10, 20].map((level) => valueAtLevel(deadly, level)),
        ["deadly-d10", "deadly-d10", "deadly-d12", "deadly-d12"],
    );
    check(
        "no bonus die until 14th, then 1d6, then 2d6 from 18th",
        [11, 13, 14, 17, 18, 20].map((level) => valueAtLevel(bonus, level)),
        [0, 0, 1, 1, 2, 2],
    );
}

/**
 * Double Excalibur: two Strikes at one target, and the sever only when both land.
 *
 * A per-Strike `onHit` would fire the sever check after the *first* hit alone; the guide's "if both hit" is
 * a fact about the whole activity, which is what `onAllHit` exists to answer.
 */
{
    const nova = ridersOf(load("saint-techniques", "slot-3-cloth-ability", "double-excalibur.json"))[0];
    check("exactly two Strikes, always — not one per confirmed target", nova.apply.count, 2);
    check("the sever check is an all-hit follow-up, not a per-Strike one", !!nova.apply.onAllHit, true);
    check("and nothing is left as onHit/onMiss instead", [nova.apply.onHit, nova.apply.onMiss], [undefined, undefined]);
    const effect = load("saint-effects", "activities", "effect-double-excalibur.json");
    check(
        "both Strikes ignore Hardness, resistance and physical immunity",
        effect.flags["isaacs-hb-pf2e"].bypass[0].resistance,
        { max: null, types: "all" },
    );
}

/** The Sharpest Sword now fires itself, on every unarmed critical hit — it used to be a Note and nothing else. */
{
    const cloth = load("saint-class-features", "cloths", "capricorn-excalibur.json");
    const rider = ridersOf(cloth)[0];
    check("a critical unarmed hit offers the sever choice", rider.event, "strike-resolved");
    check("on nothing less than a critical success", rider.outcomes, ["criticalSuccess"]);
}

/** Sever's frequency is real, even though "per creature" and "no effect" stay the table's. */
{
    const sever = load("saint-class-features", "actions", "sever.json");
    check("Sever is limited at least once per turn", sever.system.frequency, { max: 1, per: "turn", value: 1 });
}

/** Koliço's rings and Freezing Coffin's ice are both real, breakable shells now — not prose about one. */
{
    const kolico = ridersOf(load("saint-techniques", "slot-2", "kolico.json"));
    const rings = kolico.find((r) => r.apply.type === "encasement");
    check("the rings are Hardness 8 / 30 HP, growing +2/+10 a step", [rings.apply.hardness, rings.apply.hp, rings.apply.hardnessPerStep, rings.apply.hpPerStep], [8, 30, 2, 10]);
    check("failure immobilizes through the rings", rings.apply.conditions, ["immobilized"]);
    check("and grants an Escape check against the Cosmo DC", rings.apply.escapeDc, "cosmo");
    check(
        "critical failure adds restrained on top, same as the guide",
        kolico.find((r) => r.apply.slug === "restrained")?.outcomes,
        ["criticalFailure"],
    );

    const coffin = ridersOf(load("saint-techniques", "slot-4-ultimate", "freezing-coffin.json"));
    const ice = coffin.find((r) => r.apply.type === "encasement");
    check("the coffin is Hardness 30 / 120 HP, fixed — the guide gives it no heightening", [ice.apply.hardness, ice.apply.hp, ice.apply.hardnessPerStep, ice.apply.hpPerStep], [30, 120, undefined, undefined]);
    check("critical failure petrifies through the coffin, with no Escape — it cannot act to attempt one", [ice.apply.conditions, ice.apply.escapeDc], [["petrified"], undefined]);
    check("no bare prompt is left describing the coffin", coffin.filter((r) => r.apply.type === "prompt"), []);
}

/** Freezing Shield's aura actually ticks now, through the generic marker every future aura can reuse. */
{
    const spell = load("saint-techniques", "slot-3-cloth-ability", "freezing-shield.json");
    check("the Aura and Resistance rules moved off the spell onto a granted effect", spell.system.rules, []);
    check("and the spell itself deals no damage of its own", spell.system.damage, {});
    const rider = ridersOf(spell)[0];
    check("cast as a self buff, 1 minute", [rider.self, rider.duration], [true, { unit: "minutes", value: 1 }]);

    const effect = load("saint-effects", "activities", "effect-freezing-shield.json");
    const aura = effect.system.rules.find((r) => r.key === "Aura");
    check("the aura points at the reusable tick marker", aura.effects[0].uuid.endsWith("Effect: Aura Tick"), true);
    check("catching enemies on entry and at the end of their turn", aura.effects[0].events, ["enter", "turn-end"]);
    const tick = effect.flags["isaacs-hb-pf2e"].riders[0];
    check("the tick itself is a basic Fortitude save for cold damage plus a round of slowed", tick.event, "aura-tick");
    check(
        "6d8 cold and slowed 1, both on a failure or worse — a critical failure is not a lesser failure",
        tick.apply.riders.map((r) => r.outcomes),
        [["failure", "criticalFailure"], ["failure", "criticalFailure"]],
    );

    const marker = load("saint-effects", "riders", "effect-aura-tick.json");
    check("the marker itself carries no content — it is a signal, not a Technique", marker.system.rules, []);
}

/**
 * `riderAt`, the addressing a choice card's button has to survive a round trip through.
 *
 * `applyChoice` never gets handed the rider it should apply — only an item uuid and an address, so a
 * player cannot ask for an effect the Technique does not have. A bare index was enough while every choice
 * rider was top-level, which was every one of them until *Double Excalibur*: its sever sits inside a
 * `strikes` rider's `onAllHit`, and a bare index can only ever re-find the outer `strikes` rider, never the
 * choice nested inside it. The card posted correctly — `postChoice` was handed the rider directly and never
 * needed to re-find it — and clicking it did nothing, because `applyChoice`'s lookup landed on the wrong
 * rider and read `.apply.options` off something that had none.
 */
{
    const doubleExcalibur = load("saint-techniques", "slot-3-cloth-ability", "double-excalibur.json");
    const nested = riderAt(doubleExcalibur, [0, "onAllHit", 0]);
    check("a nested address finds the sever choice, not the outer strikes rider", nested?.apply?.type, "choice");
    check(
        "and its options are the three things Excalibur severs",
        nested.apply.options.map((o) => o.label),
        ["A limb", "A sense", "A natural attack"],
    );

    const tenbu = load("saint-techniques", "slot-1-signature", "tenbu-horin.json");
    check(
        "a plain number still finds a top-level rider the old way — nothing already working moved",
        riderAt(tenbu, 0)?.apply?.type,
        "choice",
    );
    check("and is the same rider a bare number and a one-element path both name", riderAt(tenbu, 1), riderAt(tenbu, [1]));
}

/**
 * Pisces — the Roses.
 *
 * *Piranha Rose*'s persistent bleed used to be a second `system.damage` part under a basic save, which
 * pf2e halves on a success rather than negating — the guide's "a successful save negates the persistent
 * damage" needs a rider that skips it outright on success instead. *Royal Demon Rose* was worse: two
 * condition riders sat on `save-rolled`, an event nothing ever fires for a Technique whose entire effect is
 * "any creature that starts its turn in the area" — the ground tick now lives in `lingering.save` instead,
 * with the damage folded in as a third rider that never existed before. *Crimson Fog*'s difficult terrain
 * had no `lingering` flag at all. *Royal Funeral*'s critical failure was a `prompt`, and its "know the
 * target's exact Hit Points" special had nothing behind it. *Bloody Rose* had no `system.rules`, no
 * `flags.isaacs-hb-pf2e.riders` and no frequency — a granted action that did nothing but describe itself.
 */
{
    const piranha = load("saint-techniques", "slot-1-signature", "piranha-rose.json");
    check("the persistent bleed is no longer a second system.damage part", piranha.system.damage["1"], undefined);
    const bleed = ridersOf(piranha)[0];
    check(
        "a success negates it instead: the rider only fires on failure or worse",
        bleed.outcomes,
        ["failure", "criticalFailure"],
    );
    check(
        "and the level ladder is the named-level kind, not a per-step one",
        bleed.apply.formula,
        { at: { "13": "3d6", "17": "4d6", "9": "2d6" }, base: "1d6" },
    );

    const rose = load("saint-techniques", "slot-2", "royal-demon-rose.json");
    check("Royal Demon Rose carries no top-level riders any more — the ground tick replaced them", ridersOf(rose), undefined);
    const tick = rose.flags["isaacs-hb-pf2e"].lingering;
    check("the petal cloud ticks on turn start only, matching \"starts its turn in the area\"", tick.events, ["tokenTurnStart"]);
    check("for the Technique's own 1-minute duration", tick.duration, { unit: "minutes", value: 1 });
    check("against the Saint's Cosmo DC", [tick.save.dc, tick.save.statistic], ["cosmo", "fortitude"]);
    check(
        "three riders: the damage the guide names but never used to apply, flat enfeebled 1, and stupefied 2 on a crit",
        tick.save.riders.map((r) => [r.apply.type, r.apply.slug ?? r.apply.damageType, r.outcomes]),
        [
            ["damage", "poison", ["failure", "criticalFailure"]],
            ["condition", "enfeebled", ["failure", "criticalFailure"]],
            ["condition", "stupefied", ["criticalFailure"]],
        ],
    );
    check(
        "enfeebled is guarded against re-stacking every turn the creature fails again",
        tick.save.riders[1].predicate,
        [{ not: "rider:target:condition:enfeebled:1+" }],
    );
    check("the damage grows 1d8 a heightening step off a 3d8 base, same as the guide's own ladder", tick.save.riders[0].apply.formula, { base: "3d8", perStep: "1d8" });

    const fog = load("saint-techniques", "slot-3-cloth-ability", "crimson-fog.json");
    check("Crimson Fog's petals are difficult terrain for 1 minute", fog.flags["isaacs-hb-pf2e"].lingering.difficultTerrain, 2);

    const funeral = load("saint-techniques", "slot-4-ultimate", "royal-funeral.json");
    check("the damage came off the spell — this is not a basic save, so pf2e would never scale it", funeral.system.damage, {});
    const funeralRiders = ridersOf(funeral);
    check("no bare prompt describes the critical-failure death any more", funeralRiders.some((r) => r.apply.type === "prompt"), false);
    const funeralDamage = funeralRiders.filter((r) => r.apply.type === "damage");
    check(
        "the ladder is riders now: half on a success, full on failure and critical failure",
        funeralDamage.map((r) => [r.apply.multiplier ?? 1, r.outcomes]),
        [
            [0.5, ["success"]],
            [1, ["failure", "criticalFailure"]],
        ],
    );
    const death = funeralRiders.find((r) => r.apply.type === "death");
    check("critical failure is a real death rider, on criticalFailure alone", [!!death, death.outcomes], [true, ["criticalFailure"]]);
    const tracker = funeralRiders.find((r) => r.apply.trackedTarget);
    check(
        "the Special is a self effect grant, on every outcome — knowing the target's Hit Points does not depend on the save",
        [tracker.self, tracker.outcomes.length],
        [true, 4],
    );
    check("carried for the rest of the encounter", tracker.duration, { unit: "encounter", value: 1 });

    const marker = load("saint-effects", "activities", "effect-rose-marked.json");
    const markerRider = ridersOf(marker)[0];
    check(
        "the marker re-reads the one creature it was told to watch at the start of every one of the Saint's turns",
        [markerRider.event, markerRider.self, markerRider.apply.type, markerRider.apply.trackedTarget],
        ["turn-start", true, "readout", true],
    );

    const bloodyRose = load("saint-class-features", "actions", "bloody-rose.json");
    check("Bloody Rose is limited once per minute now, matching its own description", bloodyRose.system.frequency, { max: 1, per: "PT1M", value: 1 });
    const bloodySave = ridersOf(bloodyRose)[0];
    check(
        "and rolls its own Fortitude save on Cosmo, exactly like Aurora Execution",
        [bloodySave.event, bloodySave.apply.type, bloodySave.apply.statistic, bloodySave.apply.dc],
        ["action-used", "save", "fortitude", "cosmo"],
    );
    check(
        "failure deals the damage and enfeebled 2; critical failure kills instead of dealing more damage",
        bloodySave.apply.riders.map((r) => [r.apply.type, r.outcomes]),
        [
            ["damage", ["failure"]],
            ["condition", ["failure"]],
            ["death", ["criticalFailure"]],
        ],
    );
}

/** `growByStep`, the arithmetic behind every per-step substitution above, exercised directly. */
check("no steps taken: the base value, untouched", growByStep(15, 5, 0), 15);
check("three steps of a flat number", growByStep(15, 5, 3), 30);
check("three steps of matching dice", growByStep("6d8", "1d8", 3), "9d8");
check("dice of different sizes cannot be combined — the base wins rather than guessing", growByStep("6d8", "1d6", 3), "6d8");

/* -------------------------------------------------------------------------------------------- */

if (failures.length > 0) {
    console.error(`Rider tests failed: ${failures.length} of ${checks}.`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
}
console.log(`Rider tests passed: ${checks} checks.`);

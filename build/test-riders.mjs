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
const { basicLadder } = await import("../scripts/riders/apply.mjs");
const { alreadySpent, gateByRound, riderKey } = await import("../scripts/riders/round-gate.mjs");
const { auraCatches, effectForAura } = await import("../scripts/riders/sources.mjs");
const { mergeBypass, resistanceReduction, ignoresHardness, ignoredImmunities, selectEntries } = await import(
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

/**
 * A "make one Strike" Technique fires for the Strike it paid for, and no other.
 *
 * The wide search above is what lets a rider written on *Ryūsenka* find a Strike rolled with a weapon.
 * Five Techniques are shaped that way and carry no attack trait to narrow them, so every one of them
 * fired on **every** Strike their owner made — driven live, one bare critical Strike from a Soul Reaper
 * who had cast nothing applied both *Ryūsenka: Off-Guard* and *Hitotsume: Nadegiri: Off-Guard*, with the
 * pool reading 1 point before and 1 after. Guide §1.4: "Every technique costs 1 Reiatsu Point".
 *
 * The four checks below are the four cases the marker has to keep apart, and the third is the one that
 * makes this a scoping fix rather than a switch: the seventeen **non-spell** sources of `strike-resolved`
 * riders are passive by design and must go on firing on every Strike, cast or not.
 */
const ryusenkaSpell = {
    id: "ryusenka",
    type: "spell",
    name: "Ryūsenka",
    system: { traits: { value: [] } },
    flags: load("soulbound-techniques", "ryusenka.json").flags,
};
const shikaiEffect = withRiders(
    "Effect: Hyōrinmaru — Shikai",
    ridersOf(load("soulbound-effects", "effect-hyorinmaru-shikai.json")),
);
const strikeWeapon = withRiders("Spirit Weapon (Blade)", []);
const sheet = [ryusenkaSpell, shikaiEffect];
const armed = (id) => ({ items: sheet, getFlag: (_m, key) => (key === "strikeTechnique" ? { itemId: id } : null) });

check(
    "a Strike Technique's riders do not fire on a Strike it did not pay for",
    collectRiders({ event: "strike-resolved", item: strikeWeapon, actor: armed(null) })
        .map((c) => c.item.name),
    ["Effect: Hyōrinmaru — Shikai"],
);
check(
    "…and do fire on the Strike the cast armed",
    collectRiders({ event: "strike-resolved", item: strikeWeapon, actor: armed("ryusenka") })
        .map((c) => c.item.name)
        .filter((n) => n === "Ryūsenka").length,
    ridersOf(load("soulbound-techniques", "ryusenka.json")).length,
);
check(
    "a passive strike rider on an effect needs no marker at all",
    collectRiders({ event: "strike-resolved", item: strikeWeapon, actor: { items: [shikaiEffect] } })
        .map((c) => c.item.name),
    ["Effect: Hyōrinmaru — Shikai"],
);
// An actor with no `getFlag` at all — every other test in this file builds one that way — must not throw
// and must not collect the spell. The failure mode of getting this wrong is the loud kind, which is why
// it is worth one line.
check(
    "…and an actor with no flags collects the effect and not the spell",
    collectRiders({ event: "strike-resolved", item: strikeWeapon, actor: { items: sheet } })
        .map((c) => c.item.name),
    ["Effect: Hyōrinmaru — Shikai"],
);

/**
 * S-15e. "On a critical hit the ice shatters: the target **instead** takes an additional 2d6 cold."
 *
 * *Instead* — so the critical branch is the hit branch doubled, and the heightening doubles with it. The
 * card's own 1d6 ladder is one half and the rider is the other, which is why the rider carries the same
 * `perStep` and the same (+2) interval rather than a flat die. It shipped flat: at rank 9 a critical hit
 * dealt the card's 5d6 plus 1d6, where the guide asks for 10d6.
 */
const ryusenkaRiders = ridersOf(load("soulbound-techniques", "ryusenka.json"));
const ryusenkaCrit = ryusenkaRiders.find((r) => r.apply?.type === "damage");
check("Ryūsenka's critical hit doubles the die and the ladder with it",
    [ryusenkaCrit.apply.formula, ryusenkaCrit.apply.perStep, ryusenkaCrit.apply.perStepInterval,
     ryusenkaCrit.outcomes.join("/")],
    ["1d6", "1d6", 2, "criticalSuccess"]);
// The hit branch keeps the save and the crit branch does not: "instead" governs both halves of the
// sentence, so a critical hit replaces the Fortitude save with off-guard rather than adding to it.
check("…and the save belongs to the hit, not the critical hit",
    ryusenkaRiders.filter((r) => r.apply?.type === "save").map((r) => r.outcomes.join("/")),
    ["success"]);

/**
 * Spirit-Cutting's second half, guide §4.1: "affect incorporeal creatures as though the weapon had the
 * ghost touch rune". The first half is the `versatile-spirit` trait on the four profiles; this one has no
 * trait to carry it, because pf2e expresses it as a property rune and reads it back as
 * `item:rune:property:ghost-touch` when it works out incorporeal resistance.
 */
const spiritWeapon = load("soulbound-class-features", "core", "spirit-weapon.json");
const ghostTouch = spiritWeapon.system.rules.find((r) => r.key === "AdjustStrike");
check("Spirit-Cutting reaches incorporeal creatures",
    [ghostTouch?.property, ghostTouch?.mode, ghostTouch?.value, JSON.stringify(ghostTouch?.definition)],
    ["property-runes", "add", "ghostTouch", '["item:tag:soulbound-spirit-weapon"]']);
// …and the damage-type half, on all four sealed profiles, since the guide promises it of every one.
for (const profile of ["blade", "great-blade", "paired-blades", "spirit-bow"]) {
    check(`…and ${profile} can still choose spirit`,
        load("soulbound-equipment", `${profile}.json`).system.traits.value.includes("versatile-spirit"),
        true);
}

/**
 * Every one-round rider says which end of the turn it means.
 *
 * The default in `effectSource` is `turn-end`, changed when Hyōrinmaru's clauses were fixed: both guides
 * say "until the end of its next turn" over and over, and `turn-start` ends an effect one step short of
 * that. Right for those — and one turn too long for the twenty-odd riders phrased "for 1 round", which
 * is the whole kidō table and every Cosmo art on the Saint side. PF2e reads "1 round" as "until the same
 * point in the initiative order next round", which is `turn-start`.
 *
 * So both readings are now written down rather than inherited, and this asserts that: a rounds-duration
 * rider with no `expiry` is a rider nobody decided about. The list below is the exception, and each entry
 * is a clause that states no duration at all — an aura's slow, an ash-figure's grab — where picking one
 * would be a design call rather than a repair.
 */
const UNDECIDED_EXPIRY = new Set([
    "effect-freezing-shield.json",   // "is slowed 1 on a failure" — the dome states no duration
    "effect-minami.json",            // "grabbed by ash-figures (Escape vs. your Reiatsu DC)" — likewise
    "the-yellow-spring-opens.json",  // "take 8d6 void and be slowed 1" — likewise
]);

{
    const undecided = [];
    const walk = (node, file) => {
        if (Array.isArray(node)) {
            for (const entry of node) walk(entry, file);
        } else if (node && typeof node === "object") {
            const duration = node.duration;
            const apply = node.apply ?? {};
            if (duration?.unit === "rounds" && !duration.expiry && (apply.type === "condition" || apply.type === "effect")) {
                undecided.push(file);
            }
            for (const value of Object.values(node)) walk(value, file);
        }
    };
    const files = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return files(full);
        return entry.name.endsWith(".json") ? [full] : [];
    });
    for (const full of files(path.join(ROOT, "content"))) {
        const raw = fs.readFileSync(full, "utf8");
        if (!raw.includes('"duration"')) continue;
        walk(JSON.parse(raw).flags ?? {}, path.basename(full));
    }
    check("every one-round condition rider says which end of the turn it means",
        [...new Set(undecided)].filter((f) => !UNDECIDED_EXPIRY.has(f)).sort(), []);
}

// The clauses that say "until the end of its next turn", pinned one by one so a future default flip
// cannot quietly take them back.
for (const [file, slug] of [
    ["soulbound-techniques/ryusenka.json", "immobilized"],
    ["soulbound-techniques/ryusenka.json", "off-guard"],
    ["soulbound-techniques/hyoryu-senbi.json", "slowed"],
    ["soulbound-techniques/sennen-hyoro.json", "immobilized"],
    ["soulbound-kido/hado/kurohitsugi.json", "immobilized"],
]) {
    const doc = load(...file.split("/"));
    const found = ridersOf(doc).filter((r) => r.apply?.slug === slug);
    check(`${path.basename(file)} ${slug} lasts until the end of the target's next turn`,
        found.map((r) => r.duration?.expiry), found.map(() => "turn-end"));
}

/**
 * A `self` rider cannot ask a question about its target.
 *
 * `riderOptions` describes **the rider's target**, and a `self` rider's target is the ability's owner —
 * so `rider:target:hp-zero` on a `self` rider asks whether *the caster* is the one dying. *Soul Sever*
 * was written that way: "when you reduce a creature to 0 HP … perform a Konsō on **it**", authored as
 * `self: true` with `predicate: ["rider:target:hp-zero"]`, and it could never fire. Measured live on a
 * kill, the self reading produced `[]` where the target reading produced `["rider:target:hp-zero"]`.
 *
 * The contradiction is invisible in review — both halves read correctly on their own — so it is worth a
 * scan rather than a memory. A `self` rider that legitimately asks about the **origin** uses
 * `rider:origin:` or a plain `self:`/`feature:` option and is untouched by this.
 */
{
    const contradictions = [];
    const walk = (node, file, name) => {
        if (Array.isArray(node)) {
            for (const entry of node) walk(entry, file, name);
        } else if (node && typeof node === "object") {
            if (node.self === true && Array.isArray(node.predicate)) {
                const text = JSON.stringify(node.predicate);
                if (text.includes("rider:target:")) contradictions.push(`${file} — ${name}`);
            }
            for (const value of Object.values(node)) walk(value, file, name);
        }
    };
    const files = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) return files(full);
        return entry.name.endsWith(".json") ? [full] : [];
    });
    for (const full of files(path.join(ROOT, "content"))) {
        const raw = fs.readFileSync(full, "utf8");
        if (!raw.includes('"self"')) continue;
        const doc = JSON.parse(raw);
        walk(doc.flags ?? {}, path.basename(full), doc.name);
    }
    check("no self rider predicates on its own target", [...new Set(contradictions)].sort(), []);
}

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
/*  The Balance                                                                                  */
/* -------------------------------------------------------------------------------------------- */

/**
 * Every clause of The Balance that failed by being written somewhere nothing reads.
 *
 * Four separate cases, and they are worth keeping together because they are the same mistake wearing
 * four faces: an authored statement that validates, builds, ships, and is never consulted.
 *
 *  - the reaction keyed to the **attacker's** event, so being hit offered nothing;
 *  - an AC bonus predicated on a roll option pf2e does not publish;
 *  - a refusal to die whose machinery was general and whose declaration was never written;
 *  - a doomed ladder whose condition nothing counted.
 */
{
    const reaction = load("soulbound-techniques", "the-balance-reaction.json");
    const riders = ridersOf(reaction);

    check("The Balance's reaction is on the defender's event", riders.map((r) => r.event),
        ["damage-received", "damage-received"]);
    // A reaction must be `self` — `validate` insists on it, because the card is offered to the ability's
    // owner. Everything that is supposed to reach somebody else is marked `trigger: true`.
    check("…offered to its owner", riders.map((r) => r.self), [true, true]);
    check("…in two variants, chosen by the Refined rung",
        riders.map((r) => JSON.stringify(r.predicate)),
        ['[{"not":"feature:refined-release"}]', '["feature:refined-release"]']);

    for (const [index, rider] of riders.entries()) {
        const nested = rider.apply.riders;
        const where = index === 0 ? "plain" : "refined";
        // The reduction stays on the Quincy; the 2d6 and the penalty go to the creature that struck.
        check(`…${where}: the reduction lands on the Quincy`,
            [nested[0].apply.type, nested[0].trigger ?? false],
            ["effect", false]);
        check(`…${where}: the spirit damage goes to the triggering creature`,
            [nested[1].apply.formula, nested[1].apply.damageType, nested[1].trigger],
            ["2d6", "spirit", true]);
        check(`…${where}: at every other rank, which is what Heightened (+2) means`,
            [nested[1].apply.perStep, nested[1].apply.perStepInterval], ["1d6", 2]);
        check(`…${where}: the saves penalty goes with it`,
            [nested[2].apply.type, nested[2].trigger], ["effect", true]);
        // R-24c: "if you have used your Release Technique at least three times this encounter".
        check(`…${where}: and the use is counted`,
            [nested[3].apply.type, nested[3].apply.stack, nested[3].apply.value], ["effect", true, 1]);
    }

    /**
     * The one flat numeric bonus in the class, and it was never on.
     *
     * It was predicated on `{gte: ["self:resource:focus:value", 1]}`, which reads exactly right and
     * matches nothing: **pf2e publishes no roll option for a resource**. Driven live, a character holding
     * three Reiatsu Points had no option matching `self:resource:` at all, so the +1 could not apply at
     * any pool size. The effect publishes its own option now, from a resolvable pf2e does evaluate.
     */
    const schrift = load("soulbound-effects", "effect-the-balance-schrift.json");
    const rules = schrift.system.rules;
    const option = rules.find((r) => r.key === "RollOption");
    check("The Balance publishes an option for holding a Reiatsu Point",
        [option?.option, option?.domain, option?.value],
        ["soulbound:reiatsu-remaining", "all", "gte(@actor.system.resources.focus.value,1)"]);
    const ac = rules.find((r) => r.key === "FlatModifier");
    check("…and the AC bonus predicates on that, not on a resource",
        [ac?.selector, ac?.type, ac?.value, JSON.stringify(ac?.predicate)],
        ["ac", "circumstance", 1, '["soulbound:reiatsu-remaining"]']);

    /**
     * S-73b. `refuse-death.mjs` was made general for *Bailar de Valquiria*, and its docstring names this
     * clause as one of the three it was generalised for — and The Balance was never given the flag. The
     * `predicate` is the part worth pinning: Refined is a class feat rather than a rung with an item of
     * its own, so the price lives on the Spirit's form feature and names the rung it belongs to.
     */
    const form = load("soulbound-class-features", "spirits", "the-balance-schrift.json");
    const refusal = form.flags["isaacs-hb-pf2e"].refuseDeath;
    check("The Balance refuses one death a day, at the Refined rung",
        [refusal.cost, refusal.requires, refusal.frequency, JSON.stringify(refusal.predicate)],
        [0, "released", true, '["feature:refined-release"]']);
    check("…and the allowance is a frequency pf2e will refill",
        [form.system.frequency.max, form.system.frequency.per], [1, "day"]);

    /** R-24c: doomed 1 or doomed 2, by a tally the reaction keeps. */
    const reckoning = ridersOf(load("soulbound-techniques", "the-reckoning.json"));
    check("The Reckoning dooms by how much fortune was held",
        reckoning.map((r) => [r.apply.value, JSON.stringify(r.predicate)]),
        [
            [1, '[{"not":{"gte":["self:effect:the-balance-fortune-held",3]}}]'],
            [2, '[{"gte":["self:effect:the-balance-fortune-held",3]}]'],
        ]);
    check("…on a failure either way", reckoning.map((r) => r.outcomes.join("/")),
        ["failure/criticalFailure", "failure/criticalFailure"]);
}

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
    // The Soulbound's pool is its ceiling, not the count of focus effects it knows. pf2e derives the
    // latter and a Hollow knows exactly one costed kido forever, so the derivation had it sitting on a
    // pool of 1 at 11th level where the guide says 3.
    "CONFIG.PF2E.Actor.documentClasses.character.prototype.prepareDerivedData",
    "CONFIG.PF2E.Item.documentClasses.action.prototype.toMessage",
    "CONFIG.PF2E.Item.documentClasses.spellcastingEntry.prototype.cast",
    // Cover belongs to the defender, and two Senbonzakura clauses say a Strike goes around it. The check
    // is the one place that holds the attacker, the target and the DC built from that target's AC.
    "game.pf2e.Check.roll",
]);

/**
 * Where a `"prototype"` wrap actually lands.
 *
 * The strategy exists for one reason — `ActorPF2e#applyDamage` is declared on the shared base and
 * inherited by every actor type, so a wrapper defined on the one subclass the path names leaves NPCs
 * untouched — and for most of this module's life it did precisely that. The walk stopped at the **first**
 * prototype that owned the method, and pf2e's `CharacterPF2e` declares its own `applyDamage`, so the patch
 * went on the character class alone. **No damage rider in the module had ever fired against an NPC**,
 * which is almost everything a Technique is aimed at.
 *
 * Nothing here needs Foundry: the bug is a prototype-chain walk, and a three-class chain reproduces it
 * exactly. The second check is the other half — a subclass override must still run, reaching the patched
 * method through `super`.
 */
class WrapBase {
    hit() {
        return "base";
    }
}
class WrapSub extends WrapBase {
    hit() {
        return `sub(${super.hit()})`;
    }
}
class WrapSibling extends WrapBase {}

globalThis.__wrapProbe = { classes: { sub: WrapSub, sibling: WrapSibling } };
const { wrap: wrapMethod } = await import("../scripts/lib/wrap.mjs");
wrapMethod("__wrapProbe.classes.sub.prototype.hit", function (wrapped, ...args) {
    return `wrapped:${wrapped(...args)}`;
}, { feature: "the prototype-walk test", strategy: "prototype" });

check("a prototype wrap lands on the class that declares the method", new WrapSibling().hit(), "wrapped:base");
check("a subclass override still runs, reaching the wrap through super", new WrapSub().hit(), "sub(wrapped:base)");

/* -------------------------------------------------------------------------------------------- */
/*  The second road a save travels                                                               */
/* -------------------------------------------------------------------------------------------- */

/**
 * Saves rolled by pf2e's own button.
 *
 * Every save rider reached the relay through `pf2e-toolbelt.rollSave`, and the Target Helper renders its
 * per-target rows on a spell's own card and not on a **variant's**. The Heat's *Burner Finger* is the only
 * Technique in the class built out of variants, so its three area options had no rows at all, and the save
 * pf2e itself rolled told this module nothing: Burner Finger Four's 1d4 persistent fire could not be made
 * to happen by any route.
 *
 * Three things have to hold, and each is a way the second road was got wrong while it was built: the
 * origin comes off the roll's own context rather than the speaker, no `itemUuid` travels with it (a
 * variant's uuid is the base spell's, so the GM side would collect Burner Finger *One's* riders), and a
 * save this module rolled itself is ignored — `runSave` has already dispatched those riders, and doing it
 * again is how an ability that forces a save forces it forever.
 */
const { Sources } = await import("../scripts/riders/sources.mjs");
const { Relay } = await import("../scripts/riders/relay.mjs");

const heatToken = { documentName: "Token", uuid: "Scene.s.Token.heat", actor: { uuid: "Actor.heat" } };
const dummyToken = { documentName: "Token", uuid: "Scene.s.Token.dummy", actor: { uuid: "Actor.dummy" } };
globalThis.fromUuid = async (uuid) => (uuid === heatToken.uuid ? heatToken : null);

function saveMessage({ options = [] } = {}) {
    return {
        id: "save-message",
        actor: dummyToken.actor,
        token: dummyToken,
        flags: { pf2e: { context: { type: "saving-throw", outcome: "criticalFailure", options, origin: { actor: "Actor.heat", token: heatToken.uuid } } } },
    };
}

const sent = [];
const realRequest = Relay.request;
Relay.request = async (payload) => void sent.push(payload);

const message = saveMessage();
await Sources.onSaveMessage(message, message.flags.pf2e.context);
check("a save rolled by pf2e's own button reaches the relay", sent.length, 1);
check("the origin is the token the roll's context named", sent[0]?.originUuid, heatToken.uuid);
check("the creature that rolled is the target", sent[0]?.targetUuid, dummyToken.uuid);
check("no itemUuid travels with it, so the GM side rebuilds the variant", "itemUuid" in (sent[0] ?? {}), false);
check("the event is the one every save rider listens for", sent[0]?.event, "save-rolled");

sent.length = 0;
const ownSave = saveMessage({ options: ["isaacs-hb-pf2e:rider-save"] });
await Sources.onSaveMessage(ownSave, ownSave.flags.pf2e.context);
check("a save this module rolled itself is not dispatched again", sent.length, 0);

sent.length = 0;
const sheetSave = saveMessage();
delete sheetSave.flags.pf2e.context.origin;
await Sources.onSaveMessage(sheetSave, sheetSave.flags.pf2e.context);
check("a save with no origin — one rolled off a character sheet — is nothing to this module", sent.length, 0);

Relay.request = realRequest;
delete globalThis.fromUuid;

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
const { Om } = await import("../scripts/roll-rewrites/om.mjs");
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

// The regression guard. `item:time:N` looks plausible enough to be written again by hand — and so is
// `self:feature:<slug>`, which shipped on **six** Refined riders and could never once have been true.
// pf2e emits `feature:<slug>` for a feature, and `self:` only ever prefixes effects and a few actor
// facts; there is no `self:feature:` anywhere in the system. The predicate reads perfectly, matches
// nothing, and the only symptom is a rider that quietly never fires.
// `action:jump` is the third of the family, and the one that reads most like it must exist. pf2e has no
// Jump action: **Leap** is the basic move, and the two Athletics actions are **High Jump** and **Long
// Jump**, emitting `action:leap`, `action:high-jump` and `action:long-jump`. Capricorn's domain clause
// said `action:jump` in all four Sky Aspect effects, so a Capricorn sky helped a Saint climb and swim and
// never once helped them jump.
const DEAD_OPTIONS = ["item:time:", "self:feature:", "action:jump"];
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
    for (const dead of DEAD_OPTIONS) {
        if (doc.includes(dead)) retired.push(`${path.relative(ROOT, file)} (${dead})`);
    }
}
check("no content predicates a roll option pf2e never emits", retired, []);

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

/* -------------------------------------------------------------------------------------------- */
/*  The Escape a condition rider promises                                                        */
/* -------------------------------------------------------------------------------------------- */

/**
 * `escapeDc` on a condition rider used to be a comment.
 *
 * Only the encasement handler read the key, so the thirteen condition riders that carry it — across nine
 * Soulbound abilities, every one of whose descriptions says "(Escape against your Reiatsu DC)" — applied
 * their condition with a timer and granted nothing. The captive's only way out was to wait. Neither
 * `immobilized` nor `restrained` has a native Escape, and `grabbed`'s has no DC, so pf2e could not supply
 * it either.
 */
const { ESCAPE_DC_TYPES, escapeActionSource, escapeStatisticFor } = await import("../scripts/riders/escape.mjs");

{
    // The guard that keeps it honest: an `escapeDc` written on any other rider type is a promise with no
    // handler behind it, which is the shape this whole fix exists to remove.
    const stray = [];
    const seen = [];
    const walkApplies = (node, file) => {
        if (Array.isArray(node)) return node.forEach((v) => walkApplies(v, file));
        if (!node || typeof node !== "object") return;
        if (node.escapeDc !== undefined) {
            seen.push(`${file}:${node.type}`);
            if (!ESCAPE_DC_TYPES.has(node.type)) stray.push(`${file} (${node.type})`);
        }
        for (const value of Object.values(node)) walkApplies(value, file);
    };
    const walkContent = (at) => {
        for (const entry of fs.readdirSync(at, { withFileTypes: true })) {
            const full = path.join(at, entry.name);
            if (entry.isDirectory()) walkContent(full);
            else if (entry.name.endsWith(".json")) {
                walkApplies(JSON.parse(fs.readFileSync(full, "utf8")), path.relative(ROOT, full));
            }
        }
    };
    walkContent(path.join(ROOT, "content"));
    check("every escapeDc in the content sits on a rider type that grants one", stray, []);
    check("and there are still fourteen of them to grant", seen.length, 14);

    const item = { name: "Sai — Restrain", uuid: "Compendium.isaacs-hb-pf2e.soulbound-kido.Item.0123456789abcdef", img: "sai.webp" };
    const source = escapeActionSource({
        item,
        dc: 27,
        release: { conditions: ["immobilized"], effectId: "effect01", source: item.uuid, name: item.name },
    });
    check(
        "the Escape is a one-action item named for what holds you",
        [source.type, source.name, source.system.actions.value],
        ["action", "Escape Sai — Restrain", 1],
    );
    check("its card names the DC, because nothing else will", source.system.description.value.includes("DC 27"), true);
    check("and offers the two skills a check can be rolled for", source.system.description.value.includes("Acrobatics or Athletics"), true);

    const rider = source.flags["isaacs-hb-pf2e"].riders[0];
    check(
        "using it rolls the escape on the captive's own sheet",
        [rider.event, rider.self, rider.apply.type, rider.apply.dc],
        ["action-used", true, "escape", 27],
    );
    check("and says what breaking free lifts", [rider.apply.effectId, rider.apply.conditions], ["effect01", ["immobilized"]]);
    check(
        "the grip is named on the rider, so renaming the action cannot change what chat says",
        rider.apply.name,
        "Sai — Restrain",
    );
    check(
        "the same release is on the item, so an expiring effect can take it back down",
        source.flags["isaacs-hb-pf2e"].escape.effectId,
        "effect01",
    );

    const named = escapeActionSource({ item, dc: 20, statistic: "athletics", release: { conditions: ["grabbed"] } });
    check("content may name one skill instead", named.system.description.value.includes("an Athletics check"), true);

    const stub = (acrobatics, athletics) => ({
        getStatistic: (slug) => ({ acrobatics: { slug: "acrobatics", mod: acrobatics }, athletics: { slug: "athletics", mod: athletics } })[slug],
    });
    check("the captive rolls their better skill", escapeStatisticFor(stub(9, 14)).slug, "athletics");
    check("either way round", escapeStatisticFor(stub(15, 14)).slug, "acrobatics");
    check("unless the rider named one", escapeStatisticFor(stub(15, 14), "athletics").slug, "athletics");
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
/*  The README is documentation, and documentation drifts                                        */
/* -------------------------------------------------------------------------------------------- */

/**
 * The rider reference in README.md is a third copy of two lists that already exist in the source: the
 * apply-type switch and the EVENTS array. It had drifted to seven of twenty-one apply types and seven of
 * eight events, and nothing failed. Comparing the sets here means the next divergence fails the build
 * instead of rotting quietly.
 */
function documentedIn(readme, heading, nextHeading) {
    const start = readme.indexOf(heading);
    const end = readme.indexOf(nextHeading, start);
    const section = readme.slice(start, end);
    const names = new Set();
    for (const line of section.split("\n")) {
        if (!line.startsWith("|")) continue;
        const firstCell = line.split("|")[1] ?? "";
        for (const [, name] of firstCell.matchAll(/`([a-z-]+)`/g)) names.add(name);
    }
    names.delete("type");
    names.delete("event");
    return names;
}

{
    const readme = fs.readFileSync(path.join(ROOT, "README.md"), "utf8");
    const applySource = fs.readFileSync(path.join(ROOT, "scripts/riders/apply.mjs"), "utf8");
    const dataSource = fs.readFileSync(path.join(ROOT, "scripts/riders/data.mjs"), "utf8");

    // Anchored to `applyOne`'s switch rather than the whole file: `apply.mjs` is 2000 lines and any other
    // switch with a lowercase-hyphen case (`case "from-origin":`, teleport's own `measure` value) would
    // otherwise be scraped as an apply type and demand documenting.
    const applyOneStart = applySource.indexOf("async function applyOne(");
    const applyOneBody = applySource.slice(applyOneStart, applySource.indexOf("\n}\n", applyOneStart));
    const dispatched = new Set([...applyOneBody.matchAll(/^\s*case "([a-z-]+)":/gm)].map((m) => m[1]));
    const eventsBlock = dataSource.slice(dataSource.indexOf("export const EVENTS"));
    const events = new Set(
        [...eventsBlock.slice(0, eventsBlock.indexOf("]")).matchAll(/"([a-z-]+)"/g)].map((m) => m[1]),
    );

    const documentedTypes = documentedIn(readme, "### What a rider can do", "### Areas");
    const documentedEvents = documentedIn(readme, "### Events", "### What a rider can do");

    const missing = (a, b) => [...a].filter((x) => !b.has(x)).sort().join(", ") || "none";

    check("README documents every apply type the dispatcher handles", missing(dispatched, documentedTypes), "none");
    check("README invents no apply type the dispatcher lacks", missing(documentedTypes, dispatched), "none");
    check("README documents every event", missing(events, documentedEvents), "none");
    check("README invents no event", missing(documentedEvents, events), "none");
}

/* -------------------------------------------------------------------------------------------- */
/*  Once per round, and the two things a bypass cannot reach                                     */
/* -------------------------------------------------------------------------------------------- */

{
    // Tensa Zangetsu is the only `oncePerRound` rider today, and it is the reason the gate exists:
    // "the first time each round you hit" prompted on every hit, and its own JSON said so.
    const tensa = load("soulbound-effects", "effect-tensa-zangetsu.json");
    check("Tensa Zangetsu's free Step is gated to once a round",
        ridersOf(tensa).map((r) => r.oncePerRound === true), [true]);
    // Pantera's extra claw Strike is the second of this shape: "once per round when you critically hit".
    const segunda = load("soulbound-effects", "effect-pantera-segunda-etapa.json");
    check("…and so is Segunda Etapa's extra claw Strike",
        ridersOf(segunda).map((r) => r.oncePerRound === true), [true]);
    check("and it no longer carries the note admitting it was not",
        ridersOf(tensa).some((r) => typeof r.note === "string" && /per-round/.test(r.note)), false);

    // A flag key containing a dot is a path. `setFlag(id, "riderRounds", {"abc.0": stamp})` becomes
    // `{abc: {0: stamp}}`, and the read that follows finds nothing — the gate wrote every round and let
    // every hit through. The separator is the whole fix, so it is asserted rather than remembered.
    check("a rider key is not a Foundry flag path", riderKey({ id: "abc" }, 0).includes("."), false);

    const stamp = "combat-1:3";
    check("an unstamped round is not spent", alreadySpent({}, "abc-0", stamp), false);
    check("a stamped round is spent", alreadySpent({ "abc-0": stamp }, "abc-0", stamp), true);
    check("last round's stamp does not spend this one",
        alreadySpent({ "abc-0": "combat-1:2" }, "abc-0", stamp), false);
    check("another encounter's stamp does not spend this one",
        alreadySpent({ "abc-0": "combat-2:3" }, "abc-0", stamp), false);
    // Out of combat there is no round, so a per-round allowance has no boundary to enforce.
    check("no encounter, no gate", alreadySpent({ "abc-0": stamp }, "abc-0", null), false);

    // The gate is opt-in: a rider that never asked is never consulted, and no ledger is written for it.
    const plain = [{ rider: { apply: { type: "prompt" } }, item: { id: "x" }, index: 0 }];
    check("a rider without `oncePerRound` is passed through untouched",
        (await gateByRound(plain, null)).length, 1);
}

{
    // `applyIWR` reads exactly three things off a bypass — `resistance.ignore`, `resistance.redirect`
    // and `immunity.redirect` — and decides immunity separately by asking the target. So the immunity
    // half of every Art's promise has to be read back out and applied by shadowing the target instead.
    const mugetsu = load("soulbound-techniques", "mugetsu.json");
    const entries = mugetsu.flags["isaacs-hb-pf2e"].bypass.map((entry) => ({ entry, item: null }));
    check("Mugetsu ignores spirit resistance through the bypass pf2e reads",
        mergeBypass(null, entries, ["spirit"]).resistance.ignore.map((r) => r.type), ["spirit"]);
    check("…and its immunity half comes back out for the shadow, because pf2e never reads it",
        ignoredImmunities(entries, ["spirit"]), ["spirit"]);
    check("a bypass with no immunity clause shadows nothing",
        ignoredImmunities([{ entry: { resistance: { types: ["spirit"], max: null } } }], ["spirit"]), []);
}

/* -------------------------------------------------------------------------------------------- */
/*  Ryūjin Jakka                                                                                 */
/* -------------------------------------------------------------------------------------------- */

{
    // "+1d6 and +1 persistent die at EVERY OTHER increment" is two rates in one sentence, so the rate
    // has to be sayable. Without the interval a rank-7 cast would earn six extra dice rather than three.
    const ennetsu = load("soulbound-techniques", "ennetsu-jigoku.json");
    const persistent = ridersOf(ennetsu).find((r) => r.apply?.type === "persistent-damage");
    check("Ennetsu Jigoku's persistent fire grows", [persistent?.apply?.formula, persistent?.apply?.perStep],
        ["1d4", "1d4"]);
    check("…at every other increment", persistent?.apply?.perStepInterval, 2);

    // "a creature that DAMAGES you", not one that swings at you. A rider with no `outcomes` fires on
    // every outcome, and the heat was answering misses.
    const nishi = load("soulbound-effects", "effect-nishi.json");
    check("Nishi answers a hit and not a miss",
        ridersOf(nishi)[0]?.outcomes, ["success", "criticalSuccess"]);

    // The aspect carried a bypass and a roll option and nothing that stopped healing.
    const higashi = load("soulbound-effects", "effect-higashi.json");
    const wound = ridersOf(higashi)?.[0];
    check("Higashi stops healing on a hit with the spirit weapon",
        [wound?.event, wound?.apply?.type, wound?.predicate?.[0]],
        ["strike-resolved", "effect", "item:tag:soulbound-spirit-weapon"]);
    check("…until the end of your next turn",
        [wound?.duration?.value, wound?.duration?.unit, wound?.duration?.expiry], [1, "rounds", "turn-end"]);

    // A `turn-end` AREA rider sweeps whoever stands there when the CASTER's turn ends. The clause is
    // about an enemy ending its own turn in the ash, which is what an Aura means by `turn-end`.
    const minami = load("soulbound-effects", "effect-minami.json");
    const ash = ridersOf(minami)[0];
    check("Minami's ash waits for the enemy's own turn to end", ash?.event, "aura-tick");
    check("…and has no area of its own to sweep", [ash?.area, ash?.self], [undefined, undefined]);
    const aura = minami.system.rules.find((r) => r.key === "Aura");
    check("…because the Aura decides who is caught",
        [aura?.radius, aura?.effects?.[0]?.affects, aura?.effects?.[0]?.events], [20, "enemies", ["turn-end"]]);
}

/* -------------------------------------------------------------------------------------------- */
/*  Which aura a tick belongs to                                                                 */
/* -------------------------------------------------------------------------------------------- */

{
    /**
     * A creature can stand in two of ours at once.
     *
     * A Ryūjin Jakka in Full Release carries the pressure emanation and whichever cardinal aspect is up,
     * and the tick used to be matched to "the first item on this actor with an `aura-tick` rider at all".
     * Minami's ash therefore rolled the pressure's Will save instead of its own Reflex, and the grab never
     * happened — driven live, the dummy came away with the pressure's immunity marker and nothing else.
     */
    const withAura = (slug) => ({
        name: slug,
        system: { rules: [{ key: "Aura", slug, radius: 20 }] },
        flags: { "isaacs-hb-pf2e": { riders: [{ event: "aura-tick", apply: { type: "save" } }] } },
    });
    const pressure = withAura("soulbound-pressure");
    const ash = withAura("soulbound-minami-ash");
    const bystander = { name: "unrelated", system: { rules: [] }, flags: {} };

    check("the tick goes to the aura it came from",
        effectForAura([pressure, ash, bystander], "soulbound-minami-ash")?.name, "soulbound-minami-ash");
    check("…and not to whichever one happens to be first",
        effectForAura([pressure, ash], "soulbound-pressure")?.name, "soulbound-pressure");
    // The first aura of this kind was written with its rider on a different item from its `Aura` rule.
    const loose = { name: "loose", system: { rules: [] },
        flags: { "isaacs-hb-pf2e": { riders: [{ event: "aura-tick", apply: { type: "save" } }] } } };
    check("an aura whose rider lives elsewhere still finds it",
        effectForAura([bystander, loose], "whatever")?.name, "loose");
    check("and an actor carrying none of them gets nothing",
        effectForAura([bystander], "soulbound-pressure"), null);

    // pf2e's `auraAffectsActor`, restated here because it lives in the bundle with no export.
    const you = { isAllyOf: () => false, isEnemyOf: () => false };
    const ally = { isAllyOf: () => true, isEnemyOf: () => false };
    const foe = { isAllyOf: () => false, isEnemyOf: () => true };
    check("an enemies-only aura catches enemies and nobody else",
        [foe, ally, you].map((who) => auraCatches({ affects: "enemies" }, you, who)), [true, false, false]);
    check("an allies-only aura is the mirror of it",
        [foe, ally, you].map((who) => auraCatches({ affects: "allies" }, you, who)), [false, true, false]);
    check("`all` means everyone but the creature emitting it",
        [foe, ally, you].map((who) => auraCatches({ affects: "all" }, you, who)), [true, true, false]);
    check("unless it says it includes them",
        auraCatches({ affects: "all", includesSelf: true }, you, you), true);
}

/* -------------------------------------------------------------------------------------------- */
/*  A predicate that names an effect has to name one that exists                                 */
/* -------------------------------------------------------------------------------------------- */

{
    /**
     * `rider:target:effect:` is built from the effect's **own slug**, not from pf2e's roll option.
     *
     * pf2e strips the "Effect: " prefix for `self:effect:hypnotized`; `describeActor` uses the raw slug,
     * which is `effect-hypnotized`. Two predicates in the content had been written against the shorter
     * spelling and matched nothing, in silence:
     *
     *  - the Full Release pressure's `{not: rider:target:effect:steeled-against-pressure}`, which is the
     *    gate that makes "success = immune 10 minutes" mean anything. It never closed, so a creature that
     *    succeeded was asked again on the next tick, for as long as it stood in the aura.
     *  - Kyōka Suigetsu's Sustain, which is supposed to reach only a creature already hypnotized.
     *
     * Both are the same shape of mistake as the dotted flag key: a name that reads correctly beside the
     * thing it refers to, and refers to nothing. So the names are checked against the effects that exist.
     */
    // The whole name, prefix included — `slugOf` above strips "Effect: " because pf2e does, and that is
    // exactly the difference these two predicates fell down.
    const rawSlug = (name) => String(name).toLowerCase()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");

    const effectSlugs = new Set();
    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith(".json")) {
                const doc = JSON.parse(fs.readFileSync(full, "utf8"));
                if (doc?.type === "effect" || doc?.type === "affliction") {
                    effectSlugs.add(doc.system?.slug || rawSlug(doc.name));
                }
            }
        }
    };
    walk(path.join(ROOT, "content"));

    const named = new Set();
    const collect = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) collect(full);
            else if (entry.name.endsWith(".json")) {
                const raw = fs.readFileSync(full, "utf8");
                for (const m of raw.matchAll(/rider:target:effect:([a-z0-9-]+)/g)) {
                    named.add(`${m[1]}  (${entry.name})`);
                }
            }
        }
    };
    collect(path.join(ROOT, "content"));

    const dangling = [...named].filter((entry) => !effectSlugs.has(entry.split("  ")[0])).sort();
    check("every `rider:target:effect:` predicate names an effect that exists",
        dangling.join(", ") || "none", "none");
    // The guard is only worth anything if it is looking at something.
    check("…and there are some to check", named.size > 0, true);
}

/* -------------------------------------------------------------------------------------------- */
/*  What breaks Kyōka Suigetsu's hypnosis                                                        */
/* -------------------------------------------------------------------------------------------- */

{
    /**
     * The Full Release says *"hitting you **no longer** ends the effect; only a critical hit does"*, and
     * §7A's Shikai never stated the rule that sentence negates. Nothing on either side ended the
     * hypnosis on a hit, so the clause read as passing because the thing it changes was never there —
     * the "control that cannot fail" shape. Settled in #63 as: the Shikai breaks on a hit, the Full
     * Release only on a critical one.
     *
     * Two riders, same apply, split on the roll option the Full Release emits. If they ever collapse to
     * one the tiers stop differing, which is the whole of what the clause buys.
     */
    const ks = load("soulbound-effects", "effect-kanzen-saimin.json");
    const riders = ridersOf(ks) ?? [];
    check("the Shikai hypnosis breaks on a hit",
        riders.map((r) => [r.event, r.apply?.type, r.apply?.effect]),
        [["strike-received", "expire", "Hypnotized"], ["strike-received", "expire", "Hypnotized"]]);
    check("…on any hit at the Shikai tier",
        riders.find((r) => r.predicate?.some((p) => p?.not === "soulbound:kyoka:total"))?.outcomes,
        ["success", "criticalSuccess"]);
    check("…and only on a critical hit once Sōten Kisshun is up",
        riders.find((r) => r.predicate?.includes("soulbound:kyoka:total"))?.outcomes,
        ["criticalSuccess"]);
    check("both are gated on the attacker actually being hypnotized",
        riders.every((r) => r.predicate?.includes("rider:target:effect:effect-hypnotized")), true);
}

/* -------------------------------------------------------------------------------------------- */
/*  Difficult terrain, and who it is for                                                         */
/* -------------------------------------------------------------------------------------------- */

{
    /**
     * A lingering `difficultTerrain` with no `affects` slows everybody, including the caster's own party.
     * That is right for the three the guide writes without an allegiance, and wrong for the two it does
     * not — Senbonzakura's petals and Garra de la Pantera's shards are both "difficult terrain **for
     * enemies**", and Garra's was slowing the party until this was driven.
     *
     * Pinned in both directions, because the mistake is invisible either way round: a missing `affects`
     * reads as a sensible default, and a spurious one reads as thoroughness.
     */
    const lingeringOf = (file) =>
        load("soulbound-techniques", file).flags["isaacs-hb-pf2e"]?.lingering ?? {};
    const ENEMIES_ONLY = ["senbonzakura.json", "garra-de-la-pantera.json"];
    const EVERYONE = ["ennetsu-jigoku.json", "la-gota.json"];

    for (const file of ENEMIES_ONLY) {
        check(`${file}'s terrain is enemies-only, as the guide says`,
            lingeringOf(file).affects, "enemies");
    }
    for (const file of EVERYONE) {
        check(`${file}'s terrain names no side, as the guide says`,
            lingeringOf(file).affects ?? "unset", "unset");
    }
}

/* -------------------------------------------------------------------------------------------- */
/*  A splash, and the half of it the basic ladder must not eat                                   */
/* -------------------------------------------------------------------------------------------- */

{
    /**
     * Murcielago's Refined Cero Oscuras gains "a **5-foot burst** at the target's location dealing half
     * damage to other creatures in it (basic Reflex)", and every word of that was wrong at once.
     *
     * The shape reached nobody. A 5-foot burst centred on the target's *centre point* is a circle one
     * grid square in radius drawn from the middle of one square: it covers the creature it is defined to
     * exclude and stops exactly on the centre of every neighbour. An area anchored on a creature is built
     * as an emanation from that creature's space now, which is what "within 5 feet of it" means
     * everywhere else in pf2e.
     *
     * And the damage was full. `basicLadder` **overwrote** the author's `multiplier`, so "half damage"
     * was decoration - the splash dealt the whole cero to every neighbour. Three riders in the content
     * scale something and then ask for a basic save on top, and all three were losing the fraction.
     */
    const splash = ridersOf(load("soulbound-techniques", "cero-oscuras.json"))
        .find((rider) => rider.area?.anchor === "target");
    check("Cero Oscuras' splash opens at the creature it hit", splash?.area?.anchor, "target");
    check("…as a 5-foot burst", [splash?.area?.type, splash?.area?.value], ["burst", 5]);
    // The creature it splashed off is the centre, not a second victim - `excludeAnchor` defaults to that.
    check("…leaving that creature out", splash?.area?.excludeAnchor ?? "default", "default");
    check("…for half damage", splash?.apply?.riders?.[0]?.apply?.multiplier, 0.5);
    check("…on a basic Reflex save", [splash?.apply?.basic, splash?.apply?.statistic], [true, "reflex"]);

    /** The ladder multiplies the author's fraction; it does not replace it. */
    const expanded = basicLadder(splash.apply);
    const by = (outcome) => expanded.find((r) => r.outcomes?.[0] === outcome)?.apply;
    check("a success halves the half", by("success")?.multiplier, 0.25);
    check("a failure is the half", by("failure")?.multiplier, 0.5);
    // Exactly 1 is the absence of a multiplier: `(10d6) * 1` on the card reads as though something had
    // been done to it.
    check("a critical failure doubles the half back to the whole",
        "multiplier" in by("criticalFailure"), false);

    // The same composition, on the two riders that are not Murcielago's. Apotheosis detonates "for half
    // the Waning dice" and Senbonzakura's Gokei doubles the petal-blades; both were losing the word.
    const composedOnFailure = (file) => {
        const rider = ridersOf(load("soulbound-effects", file))
            .find((r) => r.apply?.basic === true && r.apply.riders?.some((n) => n.apply?.multiplier));
        const rung = basicLadder(rider.apply).find((r) => r.outcomes?.[0] === "failure")?.apply;
        return "multiplier" in rung ? rung.multiplier : 1;
    };
    check("Apotheosis still detonates for half on a failure",
        composedOnFailure("effect-apotheosis.json"), 0.5);
    check("Gokei still doubles on a failure",
        composedOnFailure("effect-senbonzakura-kageyoshi.json"), 2);
}

/* -------------------------------------------------------------------------------------------- */
/*  "Whether or not you hit"                                                                     */
/* -------------------------------------------------------------------------------------------- */

{
    /**
     * Lanza del Relampago's lance "detonates in a **15-foot burst** at that point" whichever way the
     * attack went. It was written as a `self` rider with no area, so casting it dealt 5d6 fire to the
     * **caster**, with no save, and the burst never happened at all.
     *
     * An outcome-free `strike-resolved` rider is precisely "whether or not you hit"; the area anchored on
     * the target is "at that point"; and `excludeAnchor: false` is what keeps the creature the lance was
     * thrown at inside its own explosion.
     */
    const lance = ridersOf(load("soulbound-techniques", "lanza-del-relampago.json"))[0];
    check("the detonation does not land on the caster", lance?.self ?? false, false);
    check("…it fires however the attack went", [lance?.event, lance?.outcomes ?? "any"],
        ["strike-resolved", "any"]);
    check("…as a 15-foot burst where the lance landed",
        [lance?.area?.type, lance?.area?.value, lance?.area?.anchor], ["burst", 15, "target"]);
    check("…which includes the creature it was thrown at", lance?.area?.excludeAnchor, false);
    check("…and everyone caught rolls a basic Reflex save",
        [lance?.apply?.basic, lance?.apply?.statistic, lance?.apply?.riders?.[0]?.apply?.damageType],
        [true, "reflex", "fire"]);
}

/* -------------------------------------------------------------------------------------------- */
/*  A spell's Frequency, which pf2e writes down and never reads                                  */
/* -------------------------------------------------------------------------------------------- */

{
    /**
     * pf2e spends a frequency in `createUseActionMessage` - abilities and feats only - and refills it in
     * `Actor#recharge`, whose loop is `[itemTypes.action, itemTypes.feat]`. A **spell** is in neither, so
     * "Frequency once per round" on one was enforced by nothing: Lanza del Relampago cast twice in a
     * round posted two cards and left the counter at 1.
     *
     * `SpellFrequency` is both halves. This pins the list it is responsible for, so a sixth spell that
     * says *Frequency* cannot be added without somebody reading this.
     */
    const spells = [];
    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith(".json")) {
                const doc = JSON.parse(fs.readFileSync(full, "utf8"));
                if (doc?.type === "spell" && doc.system?.frequency) {
                    spells.push(`${entry.name}:${doc.system.frequency.max}/${doc.system.frequency.per}`);
                }
            }
        }
    };
    walk(path.join(ROOT, "content"));
    check("every spell whose Frequency the module now enforces", spells.sort(), [
        "hirviendo-boil.json:1/round",
        "kita-tenchi-kaijin.json:1/round",
        "lanza-del-relampago.json:1/round",
        "the-miracle-growth.json:1/round",
        "trident.json:1/round",
    ]);
}

/* -------------------------------------------------------------------------------------------- */
/*  A spell attack's riders are its own                                                          */
/* -------------------------------------------------------------------------------------------- */

{
    /**
     * `strike-resolved` searches the whole sheet on purpose: a Technique that says "make one Strike"
     * leaves the weapon as the message's item, and only the wide search brings the two together.
     *
     * A spell with the **attack** trait is the opposite case - it rolls the attack itself - and left in
     * that search it answered everybody else's. Driven live, casting Lanza del Relampago fired Cero
     * Oscuras' splash as well as the lance's, against creatures the cero was never aimed at.
     *
     * So the split is by trait, and both sides of it are pinned: the attack-trait spells that must be
     * scoped to their own roll, and the Strike Techniques that must not be.
     */
    const strikeSpells = { scoped: [], wide: [] };
    const dir = path.join(ROOT, "content", "soulbound-techniques");
    for (const name of fs.readdirSync(dir)) {
        if (!name.endsWith(".json")) continue;
        const doc = JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"));
        if (doc.type !== "spell") continue;
        if (!(ridersOf(doc) ?? []).some((rider) => rider.event === "strike-resolved")) continue;
        (doc.system.traits.value.includes("attack") ? strikeSpells.scoped : strikeSpells.wide).push(name);
    }
    check("the spell attacks whose strike riders are their own", strikeSpells.scoped.sort(),
        ["cero-oscuras.json", "galvano-javelin.json", "lanza-del-relampago.json"]);
    check("…and the Strike Techniques that still need the wide search", strikeSpells.wide.sort(),
        ["hitotsume-nadegiri.json", "ikkotsu.json", "ryusenka.json", "shitonegaeshi.json",
            "shukei-hakuteiken.json"]);
}

/* -------------------------------------------------------------------------------------------- */
/*  A patch of ground is for somebody                                                            */
/* -------------------------------------------------------------------------------------------- */

{
    /**
     * `affects` was read when a lingering area made the ground difficult and nowhere else, so a patch
     * that dealt **damage** dealt it to everybody standing in it. Respira is an emanation centred on the
     * caster, so the caster was the first creature in their own miasma: driven live, an Arrogante ending
     * their turn inside it came away with persistent void damage, and so did the party ally beside them.
     *
     * Two more things were wrong in the same six lines. The tick defaulted to **persistent** damage where
     * the guide says a one-off *"(no save)"*, and it grew a die every heightening step where the guide
     * says *"at every other increment"* — 5d6 at rank 5 instead of 3d6.
     *
     * All three are pinned here, in both directions: the two areas that name a side, and the ones that
     * deliberately do not.
     */
    const lingeringOf = (...parts) => load(...parts).flags["isaacs-hb-pf2e"]?.lingering ?? {};
    const respira = lingeringOf("soulbound-techniques", "respira.json");
    check("Respira's miasma is for the enemy, as the guide says", respira.affects, "enemies");
    check("…it ticks once rather than setting them alight", respira.damage?.persistent, false);
    check("…and it grows at every other increment", respira.damage?.perStepInterval, 2);

    // The other lingering that deals damage is a Saint Technique, and it is persistent on purpose.
    const mavros = lingeringOf("saint-techniques", "slot-4-ultimate", "mavros-eruption-clast.json");
    check("Mavros Eruption Clast is still persistent fire", mavros.damage?.persistent, true);

    // `scaledDamage` is what pays for the interval, and it is worth checking it counts rather than
    // multiplies: at four increments an interval of 2 earns two dice, not four.
    const grown = (formula, perStep, perStepInterval, steps) => {
        const interval = Math.max(1, Number(perStepInterval) || 1);
        const earned = Math.floor(steps / interval);
        const base = /^(\d*)d(\d+)$/.exec(formula);
        const per = /^(\d*)d(\d+)$/.exec(perStep);
        return `${(Number(base[1]) || 1) + (Number(per[1]) || 1) * earned}d${base[2]}`;
    };
    check("1d6 +1d6 every other increment, four increments in", grown("1d6", "1d6", 2, 4), "3d6");
    check("…and the same rate with no interval named", grown("1d6", "1d6", undefined, 4), "5d6");
}

/* -------------------------------------------------------------------------------------------- */
/*  An aura ticks when the creature's own turn ends                                              */
/* -------------------------------------------------------------------------------------------- */

{
    /**
     * *"Enemies that end their turn in it take 3d6 void damage (basic Fortitude)."*
     *
     * Respira Absoluta was a `turn-end` **self** rider with an area, which sweeps whoever is standing
     * there when the **caster's** turn ends — the right creatures at the wrong moment, the same finding
     * Ryūjin Jakka's ash carries a note about. pf2e's own `Aura` is what decides who is caught and when,
     * and the module has answered it through `aura-tick` since Minami.
     *
     * The nested damage also carried no `basic`, so a Fortitude save against it changed nothing at all.
     */
    const absoluta = load("soulbound-effects", "effect-respira-absoluta.json");
    const riders = ridersOf(absoluta);
    const tick = riders.find((rider) => rider.apply?.type === "save");
    check("Respira Absoluta ticks on the aura, not on the caster's turn", tick?.event, "aura-tick");
    check("…and it is a basic Fortitude save",
        [tick?.apply?.basic, tick?.apply?.statistic], [true, "fortitude"]);
    check("…with no area of its own, because the Aura is the area",
        [tick?.area ?? "none", tick?.self ?? false], ["none", false]);

    const aura = absoluta.system.rules.find((rule) => rule.key === "Aura");
    check("the Aura is the guide's 20 feet, for enemies", [aura?.radius, aura?.effects?.length], [20, 2]);
    check("…one entry is pf2e's own turn-end tick",
        aura?.effects?.some((e) => /Effect: Aura Tick$/.test(e.uuid) && e.events?.includes("turn-end")), true);
    // The second is what makes "a creature **within the emanation**" testable at all: pf2e grants it on
    // entering and takes it back on leaving, so a predicate can ask whether somebody is standing there.
    const marker = aura?.effects?.find((e) => /In the Miasma$/.test(e.uuid));
    check("…and the other is the presence marker the flat check is gated on", !!marker, true);
    check("…which is for enemies and is not a turn event", [marker?.affects, marker?.events ?? "none"],
        ["enemies", "none"]);

    /**
     * The flat check: only from inside, and only once per minute each.
     *
     * It fired for every attacker anywhere — a dummy 70 feet away rolled it — and a creature that
     * succeeded was asked again on its very next attack. It was also written `self: true`, which lands
     * the rider on the **Arrogante**: the predicate would have described the Arrogante rather than their
     * attacker, and the immunity marker would have gone on the wrong sheet.
     */
    const check5 = riders.find((rider) => rider.apply?.type === "flat-check");
    check("the decay is rolled by the attacker, not by the Arrogante", check5?.self ?? false, false);
    check("…only for a creature standing in the miasma",
        check5?.predicate?.includes("rider:target:effect:effect-respira-in-the-miasma"), true);
    check("…and not for one that has already got through",
        (check5?.predicate ?? []).some((p) => p?.not === "rider:target:effect:effect-steeled-against-respira"),
        true);
    check("…which is what succeeding writes on them",
        check5?.apply?.onSuccess?.[0]?.apply?.uuid?.endsWith("Effect: Steeled Against Respira"), true);
    check("…and that marker lasts the guide's minute",
        [load("soulbound-effects", "effect-steeled-against-respira.json").system.duration.value,
            load("soulbound-effects", "effect-steeled-against-respira.json").system.duration.unit],
        [1, "minutes"]);
}

/* -------------------------------------------------------------------------------------------- */
/*  A free shot the Sustain has to buy                                                           */
/* -------------------------------------------------------------------------------------------- */

{
    /**
     * *"You may **Sustain** Cero Metralleta at the start of your next turn to fire it again in a
     * different direction without spending a Reiatsu Point."*
     *
     * The allowance was not tied to the Sustain at all. `FreeCast` pays whenever a flagged item on the
     * sheet has a use left, so the **first** Cero Metralleta of an encounter was free, once every round,
     * forever — Refined removed the Technique's cost rather than buying a second shot. Driven live, a
     * plain cast announced "no Focus Point spent" before the Sustain had been used once.
     *
     * Using the Sustain now leaves a marker that lasts until the end of that turn, and the free cast is
     * predicated on it. The marker's one-turn life is the once-per-round gate; the allowance itself is
     * unlimited, because the Sustain's own frequency is spent by posting it and would otherwise be gone
     * exactly when the free cast came to look for it.
     */
    const sustain = load("soulbound-class-features", "actions", "cero-metralleta-sustain.json");
    const flag = sustain.flags["isaacs-hb-pf2e"];
    check("the free shot is gated on having used the Sustain",
        flag.freeCast?.predicate?.includes("self:effect:cero-metralleta-sustained"), true);
    check("…and still only pays for Cero Metralleta",
        flag.freeCast?.predicate?.includes("item:slug:cero-metralleta"), true);
    check("…with no ceiling of its own — the marker is the ceiling", flag.freeCast?.unlimited, true);
    const marker = flag.riders?.find((rider) => rider.event === "action-used");
    check("using the Sustain is what leaves the marker",
        [marker?.self, marker?.apply?.type, marker?.apply?.uuid?.endsWith("Effect: Cero Metralleta — Sustained")],
        [true, "effect", true]);
    check("…and the marker lasts exactly one turn",
        [load("soulbound-effects", "effect-cero-metralleta-sustained.json").system.duration.value,
            load("soulbound-effects", "effect-cero-metralleta-sustained.json").system.duration.expiry],
        [1, "turn-end"]);
}

/* -------------------------------------------------------------------------------------------- */
/*  "With your spirit weapon" names the weapon, not a fist                                       */
/* -------------------------------------------------------------------------------------------- */

{
    /**
     * *"Make **three** ranged Strikes **with your spirit weapon**."*
     *
     * Trident's rider named no weapon, and `findStrike` falls back to `unarmed` — so a released Tiburón
     * punched the target three times. Naming the profile would not have worked either: `findStrike`
     * compares slugs, and *Tiburón — Hollow-Edged Blade* slugs to `tibur-n-hollow-edged-blade` with the
     * accent dropped, which is the same trap as SB-16's `getsuga-tensh`.
     *
     * `spirit-weapon` is the class's own word for it — the tag every profile and every released form
     * carries — so it survives the released/sealed swap and every Spirit that replaces its weapon.
     */
    const trident = load("soulbound-techniques", "trident.json");
    const rider = ridersOf(trident)[0];
    check("Trident strikes with the spirit weapon", rider.apply.strike, "spirit-weapon");
    check("…three times", rider.apply.count, 3);
    // `variants[0]` is the no-MAP variant, and no `mapIndex` is what asks for it: "the penalty does not
    // increase until all three are made".
    check("…at a penalty that does not climb", rider.apply.mapIndex ?? "variants[0]", "variants[0]");

    // Nothing else in the content leans on the old fallback, which would now be a fist by accident.
    const strikeRiders = [];
    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith(".json")) {
                const doc = JSON.parse(fs.readFileSync(full, "utf8"));
                for (const r of ridersOf(doc) ?? []) {
                    if (r.apply?.type === "strikes" && !r.apply.strike && !r.apply.strikes) {
                        strikeRiders.push(entry.name);
                    }
                }
            }
        }
    };
    walk(path.join(ROOT, "content"));
    check("every volley says which weapon it swings", strikeRiders.sort(), []);
}

/* -------------------------------------------------------------------------------------------- */
/*  A reaction to being hurt, and where each half of it lands                                    */
/* -------------------------------------------------------------------------------------------- */

{
    /**
     * Antithesis: *"**Trigger** You or an ally within 30 feet takes damage … **Effect** The triggering
     * creature takes 2d6 spirit damage, and the target of the trigger gains resistance equal to your
     * level."*
     *
     * It was keyed to **`damage-applied`**, which the events list defines as "damage from **this actor's
     * item** landed on a target" — the attacker's half. Driven live, a dummy hit the Quincy for 20 and no
     * reaction card appeared at all. `damage-received` is the mirror, and the one the trigger describes.
     *
     * The rider must then be `self`, because a reaction is offered to the ability's owner and `validate`
     * insists on it — so everything nested inside lands on the Quincy, including the 2d6 that is supposed
     * to go the other way. `trigger: true` sends one nested entry to the other end of the event.
     */
    const anti = load("soulbound-techniques", "antithesis.json");
    const rider = ridersOf(anti)[0];
    check("Antithesis answers being hurt, not hurting", rider.event, "damage-received");
    check("…and is offered to its owner, as a reaction must be", rider.self, true);
    const [damage, resistance] = rider.apply.riders;
    check("…the 2d6 goes to whoever struck", [damage.apply.type, damage.trigger], ["damage", true]);
    check("…and the resistance stays with whoever was struck",
        [resistance.apply.type, resistance.trigger ?? "the owner"], ["effect", "the owner"]);
    // "Heightened (+2) +1d6" — every other rank, not every rank.
    check("…growing a die every other rank", damage.apply.perStepInterval, 2);

    // Every reaction rider in the content is `self`, which is what the card being offered to its owner
    // means; this is the rule `validate` enforces, asserted here so the shape is visible beside its use.
    const reactions = [];
    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith(".json")) {
                const doc = JSON.parse(fs.readFileSync(full, "utf8"));
                for (const r of ridersOf(doc) ?? []) {
                    if (r.apply?.type === "reaction" && r.self !== true) reactions.push(entry.name);
                }
            }
        }
    };
    walk(path.join(ROOT, "content"));
    check("every reaction is offered to its own owner", reactions.sort(), []);
}

/* -------------------------------------------------------------------------------------------- */
/*  A free cast needs somewhere pf2e keeps a frequency                                           */
/* -------------------------------------------------------------------------------------------- */

{
    /**
     * *"Once per round you may use [Licht Regen] without spending a Reiatsu Point."*
     *
     * The `freeCast` flag sat on `Effect: Quincy: Letzt Stil`, and pf2e's **effect** data model has no
     * `frequency` field — the authored `1/round` was dropped on load, so `FreeCast.find` read `?? 0`
     * remaining and the allowance was never once available. Driven live, `find` returned null.
     *
     * A **feat** keeps a frequency and `Actor#recharge` refills it each round, so the allowance lives
     * there and is predicated on actually being in the form.
     */
    const feat = load("soulbound-class-features", "spirits", "quincy-letzt-stil.json");
    const flag = feat.flags["isaacs-hb-pf2e"].freeCast;
    check("the free Licht Regen is an allowance on the feat, which keeps a frequency",
        [feat.system.frequency?.max, feat.system.frequency?.per], [1, "round"]);
    check("…and it only pays for Licht Regen, and only in the form",
        flag?.predicate?.slice().sort(),
        ["item:slug:licht-regen", "self:effect:quincy-letzt-stil"]);
    check("…and the effect no longer claims a frequency pf2e would drop",
        "frequency" in load("soulbound-effects", "effect-quincy-letzt-stil.json").system, false);
}

/* -------------------------------------------------------------------------------------------- */
/*  "Once per round, when you damage a creature with fire"                                       */
/* -------------------------------------------------------------------------------------------- */

{
    /**
     * The Heat's Vollständig, and the fourth per-round gate this campaign has had to add — after
     * Pantera's extra claw Strike, Kyōka's Sustain and Tiburón's push. Without it every fire hit in a
     * turn added its own 2d6 persistent.
     *
     * The rider itself does not fire at all, and not for a reason in this Spirit: `damage-applied` is
     * gated on `landed > 0`, and `Sources.onDamage` reads the defender's hit points the instant
     * `applyDamage` resolves — before pf2e has written them — so `landed` is always zero. **Nine riders
     * across the Saint and the Soulbound sit on that event.** The gate is asserted here because it is
     * the half that is this Spirit's to get right; the event is recorded in the tracker as S-70d.
     */
    const deus = load("soulbound-effects", "effect-deus-ex-machina.json");
    const rider = ridersOf(deus)[0];
    check("The Heat's persistent fire is once a round", rider.oncePerRound, true);
    check("…on damaging with fire", [rider.event, rider.predicate], ["damage-applied", ["rider:damage:type:fire"]]);
    check("…for 2d6 with the harder flat check",
        [rider.apply.formula, rider.apply.damageType, rider.apply.dc], ["2d6", "fire", 20]);

    // Every rider in the module that waits on `damage-applied`, so the count is visible next to the
    // finding rather than buried in it.
    const waiting = [];
    const walk = (dir) => {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith(".json")) {
                const raw = fs.readFileSync(full, "utf8");
                if (/"event":\s*"damage-applied"/.test(raw)) waiting.push(entry.name);
            }
        }
    };
    walk(path.join(ROOT, "content"));
    /**
     * The roster, kept because the count is the finding.
     *
     * Nine riders waited on an event that had never fired. Four of them turned out not to belong on it at
     * all: Antithesis, The Balance, Danku and The Miracle's Growth are all triggered by **being** damaged,
     * which is `damage-received` — the mistake was invisible for as long as neither event worked. What is
     * left is the five that genuinely are the attacker's: damage this actor dealt, landing on somebody.
     */
    /**
     * "You take damage" is the defender's event, and four abilities had it the wrong way round.
     *
     * The inversion is easy to make and was impossible to see: `damage-applied` never fired for anything,
     * so a reaction keyed to it was simply never offered, and nothing distinguished that from a reaction
     * nobody had tried. Pinned by name because the fifth one will read exactly like the first four.
     */
    for (const [file, name] of [
        ["soulbound-techniques/antithesis.json", "Antithesis"],
        ["soulbound-techniques/the-balance-reaction.json", "The Balance"],
        ["soulbound-kido/bakudo/danku.json", "Danku"],
        ["soulbound-techniques/the-miracle-growth.json", "The Miracle's Growth"],
    ]) {
        const riders = ridersOf(load(...file.split("/")));
        check(`${name} answers being damaged, not damaging`,
            [...new Set(riders.map((r) => r.event))], ["damage-received"]);
        // A reaction is offered to the ability's owner, so the outer rider must be `self`; anything meant
        // for the other end of the event is marked `trigger: true` inside it.
        check(`…and is offered to its owner`, riders.every((r) => r.self === true), true);
    }

    check("the riders that wait on damage-applied", waiting.sort(), [
        "effect-deus-ex-machina.json",
        "sekishiki-kisoen.json",
        "sky-ascendant-aquarius.json",
        "soul-sever.json",
        "the-yellow-spring-opens.json",
    ]);
}

/* -------------------------------------------------------------------------------------------- */

if (failures.length > 0) {
    console.error(`Rider tests failed: ${failures.length} of ${checks}.`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
}
console.log(`Rider tests passed: ${checks} checks.`);

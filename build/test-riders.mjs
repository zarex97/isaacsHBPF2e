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
const { collectRiders, isAbilityUse } = await import("../scripts/riders/data.mjs");
const { mergeBypass, resistanceReduction, ignoresHardness, selectEntries } = await import(
    "../scripts/riders/bypass.mjs"
);
const { degreeOf } = await import("../scripts/lib/degree.mjs");
const { applyHeightening, applyThresholds, stepsFor } = await import(
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
// A Strike rider is written on the Cloth, not on the fist that threw it — `message.item` for a Strike is
// the weapon — so that search must stay wide or Scorpio's needles stop landing.
const scorpioItem = withRiders(
    "Scorpio",
    ridersOf(load("saint-class-features", "cloths", "scorpio-the-needle.json")),
);
check(
    "a strike rider on the Cloth is still found from the fist that threw it",
    collectRiders({
        event: "strike-resolved",
        item: withRiders("Fist", []),
        actor: { items: [auroraItem, scorpioItem] },
    }).map((c) => c.item.name),
    ["Scorpio", "Scorpio", "Scorpio", "Scorpio"],
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
const { conditionUuidOf } = await import("../scripts/riders/apply.mjs");
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

if (failures.length > 0) {
    console.error(`Rider tests failed: ${failures.length} of ${checks}.`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
}
console.log(`Rider tests passed: ${checks} checks.`);

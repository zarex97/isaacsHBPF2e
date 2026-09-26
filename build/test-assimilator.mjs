/**
 * The Assimilator's offline checks.
 *
 * Phase 0 ships the validator before any content exists, which means an empty pack passes it trivially —
 * and a check that has only ever passed on nothing has not been shown to check anything. So each rule in
 * `build/lib/validate-assimilator.mjs` is fed a fixture that should break it, and one that should not.
 *
 * The damage bus is here too: it is the Assimilator's way onto `applyDamage`, and its whole contract is
 * ordering and isolation, both of which can be exercised without Foundry.
 */

import { validateAssimilator } from "./lib/validate-assimilator.mjs";

const failures = [];
let checks = 0;

function check(label, actual, expected) {
    checks += 1;
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    if (a !== e) failures.push(`${label}\n      expected ${e}\n      got      ${a}`);
}

/** Run the validator over fixture packs and return only the messages, stripped of the fixture path. */
function errorsFor({ substrates = [], bonds = [], feats = [] } = {}) {
    const wrap = (name, docs) => ({
        def: { name },
        docs: docs.map((doc, i) => ({ file: `${process.cwd()}/content/${name}/fixture-${i}.json`, doc })),
    });
    const errors = [];
    validateAssimilator(
        [wrap("assimilator-substrates", substrates), wrap("assimilator-bonds", bonds), wrap("assimilator-feats", feats)],
        errors,
    );
    return errors.map((e) => e.replace(/^.*?fixture-\d+\.json:?\s*/, ""));
}

const FLAG = "isaacs-hb-pf2e";
const at = (slug, depth) => ({ gte: [`self:effect:substrate-${slug}`, depth] });
const below = (slug, depth) => ({ lt: [`self:effect:substrate-${slug}`, depth] });
const tag = (substrate, depth) => ({ [FLAG]: { assimilator: { substrate, depth } } });

/** A Ruby written the way programme §7.2 says, with the vocabulary the validator holds it to. */
function ruby(overrides = {}) {
    return {
        name: "Substrate: Ruby",
        type: "effect",
        flags: { [FLAG]: { assimilator: { substrate: { slug: "ruby", colour: "red", kind: "gem" } } } },
        system: {
            rules: overrides.rules ?? [
                { key: "TokenLight", value: { dim: 10 } },
                { key: "DamageDice", selector: "unarmed-damage", slug: "substrate-ruby", damageType: "fire",
                    diceNumber: 1, dieSize: "d4", flags: tag("ruby", 2),
                    predicate: [at("ruby", 2), below("ruby", 3)] },
                { key: "DamageDice", selector: "unarmed-damage", slug: "substrate-ruby", damageType: "fire",
                    diceNumber: 1, dieSize: "d6", flags: tag("ruby", 3),
                    predicate: [at("ruby", 3), below("ruby", 4), "carapace:intact"] },
                { key: "DamageDice", selector: "unarmed-damage", slug: "substrate-ruby", damageType: "fire",
                    diceNumber: 1, dieSize: "d6", flags: tag("ruby", 4),
                    predicate: [at("ruby", 4), "carapace:intact"] },
            ],
        },
    };
}

/* -------------------------------------------------------------------------------------------- */
/*  The validator                                                                               */
/* -------------------------------------------------------------------------------------------- */

check("empty packs pass", errorsFor(), []);
check("a well-formed Substrate passes", errorsFor({ substrates: [ruby()] }), []);

{
    const doc = ruby();
    delete doc.flags;
    check("a Substrate must say which one it is", errorsFor({ substrates: [doc] }), [
        "a Substrate must declare flags.isaacs-hb-pf2e.assimilator.substrate.slug",
    ]);
}

{
    // Driven live: the Gland's 2d6 on a critical failure landed once, not twice — the ladder composed with 0.5.
    const gland = (multiplier) => ({ name: "Gland", type: "action", system: { rules: [] }, flags: { [FLAG]: { riders: [
        { event: "action-used", apply: { type: "save", statistic: "reflex", dc: "class", basic: true, riders: [
            { apply: { type: "damage", formula: "2d6", damageType: "fire", ...(multiplier ? { multiplier } : {}) } }] } }] } } });
    check("a basic save's damage takes no multiplier", errorsFor({ feats: [gland(0.5)] }), [
        "a basic save's damage takes no multiplier — the ladder already halves and doubles it",
    ]);
    check("and without one it passes", errorsFor({ feats: [gland()] }), []);
}

check("the same Substrate twice is refused", errorsFor({ substrates: [ruby(), ruby()] }), [
    'Substrate "ruby" is declared twice',
]);

{
    const doc = ruby();
    doc.system.rules.pop();
    check("a missing rung is Depth 4 doing nothing", errorsFor({ substrates: [doc] }), [
        "no rule needs Depth 4 — it would do nothing",
    ]);
}

{
    const doc = ruby();
    doc.system.rules[2].predicate = [at("ruby", 3), below("ruby", 4)];
    check("Depth 3 without carapace:intact survives the plate breaking", errorsFor({ substrates: [doc] }), [
        'rule 2 (DamageDice): needs Depth 3 but not "carapace:intact", so a broken Carapace would keep it',
    ]);
}

{
    // A `not` naming the plate is the opposite of requiring it, and must not satisfy the check.
    const doc = ruby();
    doc.system.rules[3].predicate = [at("ruby", 4), { not: "carapace:intact" }];
    check("a negated carapace:intact does not count", errorsFor({ substrates: [doc] }).length, 1);
}

{
    const doc = ruby();
    delete doc.system.rules[1].slug;
    delete doc.system.rules[1].flags;
    check("untagged damage loses its provenance", errorsFor({ substrates: [doc] }), [
        'rule 1 (DamageDice): slug must be "substrate-ruby" or begin "substrate-ruby-" so an Instinct can find it',
        "rule 1 (DamageDice): must carry flags.isaacs-hb-pf2e.assimilator = { substrate: \"ruby\", depth: <n> }",
    ]);
}

{
    const doc = ruby();
    doc.system.rules[1].flags = tag("ruby", 3);
    check("a tag that disagrees with its predicate is caught", errorsFor({ substrates: [doc] }), [
        "rule 1 (DamageDice): tagged Depth 3 but predicated on Depth 2",
    ]);
}

{
    const doc = ruby();
    doc.system.rules.push({ key: "RollOption", domain: "all", option: "x", predicate: [at("ruby", 5)] });
    check("Depth 5 does not exist", errorsFor({ substrates: [doc] }), [
        "rule 4 (RollOption): names Depth 5, which does not exist (1–4)",
    ]);
}

{
    const doc = ruby();
    doc.system.rules.push({ key: "RollOption", domain: "all", option: "x", predicate: [at("iron", 2)] });
    check("a Substrate reads only its own Depth", errorsFor({ substrates: [doc] }), [
        'rule 4 (RollOption): predicates on another Substrate\'s Depth ("substrate-iron") — a Substrate reads only its own',
    ]);
}

{
    const bond = (substrates) => ({ name: "Molten Carapace", flags: { [FLAG]: { assimilator: { bond: { substrates } } } } });
    check("a Bond of two known Substrates passes", errorsFor({
        substrates: [ruby(), { ...ruby(), flags: { [FLAG]: { assimilator: { substrate: { slug: "iron" } } } },
            system: { rules: [1, 2, 3, 4].map((d) => ({ key: "RollOption", domain: "all", option: "x",
                predicate: [at("iron", d), ...(d >= 3 ? ["carapace:intact"] : [])] })) } }],
        bonds: [bond(["ruby", "iron"])],
    }), []);
    check("a Bond naming a missing Substrate is refused", errorsFor({ substrates: [ruby()], bonds: [bond(["ruby", "iron"])] }), [
        'names Substrate "iron", which is not in the Substrates pack',
    ]);
    check("a Bond must be two different Substrates", errorsFor({ substrates: [ruby()], bonds: [bond(["ruby", "ruby"])] }), [
        "a Bond must declare flags.isaacs-hb-pf2e.assimilator.bond.substrates as two different Substrates",
    ]);
}

{
    const feat = (flags) => ({ name: "Apex Predator", system: { slug: "apex-predator", rules: [] }, flags });
    check("a declared non-stacking pair that does not say so is caught", errorsFor({ feats: [feat(undefined)] }), [
        'the guide says this does not stack; declare flags.isaacs-hb-pf2e.assimilator.doesNotStackWith = "gold-instinct"',
    ]);
    check("…and passes once it declares it", errorsFor({
        feats: [feat({ [FLAG]: { assimilator: { doesNotStackWith: "gold-instinct" } } })],
    }), []);
    // AF-22c: Two Instincts and Electrum each offer a second clause; the better stands, never both.
    const { instinctsOf: pick } = await import("../scripts/assimilator/engine.mjs");
    check("AF-22c Two Instincts beside Electrum 4: Electrum's full clause stands", pick("red", 4, "green", false, { twoInstincts: "blue" }),
        { primary: "red", secondary: "green", scale: 1 });
    check("…beside Electrum 3: the two halves are equal, one clause only", pick("red", 3, "green", false, { twoInstincts: "blue" }).scale, 0.5);
    check("AF-22a/b Two Instincts alone: the chosen clause at half", pick("red", 0, null, false, { twoInstincts: "blue" }),
        { primary: "red", secondary: "blue", scale: 0.5 });
    check("AF-35b Instinct Fusion: full value", pick("red", 0, null, false, { twoInstincts: "blue", fusion: true }).scale, 1);
    check("AF-43a Omnivore: two Instincts at full value", pick("red", 0, null, false, { twoInstincts: "blue", omnivore: true }).scale, 1);
}

/* -------------------------------------------------------------------------------------------- */
/*  The damage bus                                                                              */
/* -------------------------------------------------------------------------------------------- */

{
    // `wrap.mjs` resolves its target off `CONFIG`, so a stand-in actor class is all the bus needs.
    const log = [];
    class Actor {
        constructor() {
            this.hitPoints = { value: 10 };
            this.hardness = 0;
        }

        async applyDamage({ amount }) {
            log.push(`apply hardness=${this.hardness}`);
            if (amount === "throw") throw new Error("pf2e threw");
            this.hitPoints.value -= amount;
            return this;
        }
    }
    globalThis.CONFIG = { PF2E: { Actor: { documentClasses: { character: Actor } } } };
    globalThis.game = { user: { isGM: true } };

    const { DamageBus, PRIORITY } = await import("../scripts/lib/damage-bus.mjs");

    DamageBus.after("late", 40, (_a, _p, before) => log.push(`late before=${before}`));
    DamageBus.after("broken", 20, () => {
        throw new Error("a stage broke");
    });
    DamageBus.after("early", 10, (actor) => log.push(`early hp=${actor.hitPoints.value}`));
    DamageBus.before("shadow", PRIORITY.bypass, (actor) => {
        actor.hardness = 99;
        return () => {
            actor.hardness = 0;
        };
    });

    let refused = null;
    try {
        DamageBus.after("early", 5, () => {});
    } catch (error) {
        refused = error.message.includes('already has a stage called "early"');
    }
    check("a stage name is claimed once", refused, true);

    check("stages run in priority order", DamageBus.stages().after.map((s) => s.name), ["early", "broken", "late"]);

    DamageBus.install();
    const quiet = console.error;
    console.error = () => {};
    const target = new Actor();
    await target.applyDamage({ amount: 3 });
    check("before shadows, after reads both sides, a broken stage costs only itself", log, [
        "apply hardness=99", "early hp=7", "late before=10",
    ]);
    check("the shadow is undone", target.hardness, 0);

    log.length = 0;
    let threw = false;
    try {
        await target.applyDamage({ amount: "throw" });
    } catch {
        threw = true;
    }
    console.error = quiet;
    check("a throw inside applyDamage still undoes the shadow, and still throws", [threw, target.hardness], [true, 0]);
    check("…and runs no after-stage for damage that never landed", log, ["apply hardness=99"]);
}

/* -------------------------------------------------------------------------------------------- */
/*  The chassis, as authored                                                                    */
/* -------------------------------------------------------------------------------------------- */

{
    const fs = await import("node:fs");
    const read = (p) => JSON.parse(fs.readFileSync(new URL(`../content/${p}`, import.meta.url), "utf8"));
    const cls = read("assimilator-class/assimilator.json").system;
    check("A-01 key attribute is Strength or Dexterity", cls.keyAbility.value, ["str", "dex"]);
    check("A-02 10 Hit Points per level", cls.hp, 10);
    check("A-03 Perception trained", cls.perception, 1);
    check("A-05 three Expert saves", cls.savingThrows, { fortitude: 2, reflex: 2, will: 2 });
    check("A-07 Athletics plus 3 + Int", [cls.trainedSkills.value, cls.trainedSkills.additional], [["athletics"], 3]);
    check("A-08 unarmed trained, no weapon proficiency of any kind",
        [cls.attacks.unarmed, cls.attacks.simple, cls.attacks.martial, cls.attacks.advanced], [1, 0, 0, 0]);
    check("A-11 unarmoured Expert, no armour proficiency of any kind",
        [cls.defenses.unarmored, cls.defenses.light, cls.defenses.medium, cls.defenses.heavy], [2, 0, 0, 0]);
    check("A-13 the class trait is what keys the Assimilator DC", [cls.slug, cls.traits.value], ["assimilator", ["assimilator"]]);

    const carapace = read("assimilator-class-features/core/the-carapace.json").system.rules;
    const strike = carapace.find((r) => r.key === "Strike");
    check("A-19 the Carapace Strike: unarmed, 1d8 bludgeoning, brawling",
        [strike.label, strike.category, strike.group, strike.damage.base], ["Carapace Strike", "unarmed", "brawling",
            { damageType: "bludgeoning", dice: 1, die: "d8" }]);
    check("A-20 its only trait is unarmed — not agile, not finesse", strike.traits, ["unarmed"]);
    check("A-19 it replaces the basic unarmed attack: there is no second option", strike.replaceBasicUnarmed, true);
    check("A-28 the plate's Hit Points are 10 + 5 per level",
        carapace.find((r) => r.property === "hp-max")?.value, "10 + 5 * @actor.level");
    check("A-34 carapace:intact is the broken effect's absence",
        carapace.find((r) => r.option === "carapace:intact")?.predicate, [{ not: "self:effect:carapace-broken" }]);

    const plate = read("assimilator-class-features/core/living-plate.json").system;
    check("A-24 explorer's clothing that is alive",
        [plate.category, plate.acBonus, plate.dexCap, plate.checkPenalty, plate.speedPenalty, plate.bulk.value],
        ["unarmored", 0, 5, 0, 0, 0]);
    check("A-27a the plate's own Hardness is 2", plate.hardness, 2);
    check("A-23 the plate is granted worn, and invested so its runes work the moment it has any", plate.equipped, { carryType: "worn", handsHeld: 0, inSlot: true, invested: true });
}

/* -------------------------------------------------------------------------------------------- */
/*  Carapace Block                                                                              */
/* -------------------------------------------------------------------------------------------- */

{
    const { blockAmount } = await import("../scripts/assimilator/carapace.mjs");
    check("A-31 the block takes the plate's Hardness off", blockAmount(20, 8, 30), 8);
    check("…never more than the damage", blockAmount(5, 8, 30), 5);
    check("…nothing from a plate at 0 Hit Points", blockAmount(20, 8, 0), 0);
    check("…nothing from healing", blockAmount(-10, 8, 30), 0);
    check("A-32 a plate with fewer Hit Points than Hardness still turns its full Hardness", blockAmount(20, 8, 3), 8);
}

/* -------------------------------------------------------------------------------------------- */
/*  The engine's rules                                                                          */
/* -------------------------------------------------------------------------------------------- */

{
    const fs = await import("node:fs");
    const path = await import("node:path");
    const { grantsOf, feedCheck, instinctOf, colourTotals, spentOf, mutationDepth, damageFrom } =
        await import("../scripts/assimilator/engine.mjs");

    // Guide §3.1, the table v1.1 made canon (#82): Mass and the Depth cap by level.
    const TABLE = { 1: [1, 1, 1], 3: [2, 1, 1], 5: [3, 2, 2], 8: [5, 4, 2], 11: [7, 5, 3], 14: [9, 7, 3], 17: [11, 8, 4], 20: [13, 10, 4] };
    const dir = new URL("../content/assimilator-class-features/core/", import.meta.url);
    const features = fs.readdirSync(dir).map((f) => JSON.parse(fs.readFileSync(new URL(f, dir), "utf8")));
    const grantsAt = (level, { apotheosis = false } = {}) => grantsOf(features
        .filter((f) => f.system.level.value <= level && (apotheosis || f.system.slug !== "apotheosis" && f.name !== "Apotheosis"))
        .map((f) => f.flags?.["isaacs-hb-pf2e"]?.assimilator?.grants));
    for (const [level, [gem, metal, cap]] of Object.entries(TABLE)) {
        const g = grantsAt(Number(level));
        check(`A-42/A-51 §3.1 at ${level}th: ${gem} Gem, ${metal} Metal, Depth cap ${cap}`, [g.gem, g.metal, g.depthCap], [gem, metal, cap]);
    }
    check("A-61 Apotheosis adds 3 in each track at 19th", [grantsAt(20, { apotheosis: true }).gem, grantsAt(20, { apotheosis: true }).metal], [16, 13]);
    check("A-47 five Bond slots, at 4th, 8th, 12th, 16th and 20th",
        [3, 4, 8, 12, 16, 20].map((l) => grantsAt(l).bondSlots), [0, 1, 2, 3, 4, 5]);
    check("A-41 the Vein: one grant per feature that raises Mass", [1, 3, 5, 8, 20].map((l) => grantsAt(l).sources), [1, 2, 3, 4, 8]);

    const catalogue = {
        ruby: { name: "Substrate: Ruby", colour: "red", kind: "gem", damageFrom: 2 },
        iron: { name: "Substrate: Iron", colour: "red", kind: "metal", damageFrom: 1 },
        copper: { name: "Substrate: Copper", colour: "red", kind: "metal", damageFrom: null },
        sapphire: { name: "Substrate: Sapphire", colour: "blue", kind: "gem", damageFrom: 2 },
    };
    const at5 = { gem: 3, metal: 2, depthCap: 2 };
    check("A-37 a Substrate at Depth N costs N", spentOf({ ruby: 2, iron: 1, copper: 1 }, catalogue), { gem: 2, metal: 2 });
    check("A-38b a new Substrate enters at Depth 1",
        feedCheck({ slug: "ruby", paid: {}, catalogue, grants: at5, specimen: "ordinary" }), { ok: true, depth: 1 });
    check("A-38b feeding one you hold raises it by 1",
        feedCheck({ slug: "ruby", paid: { ruby: 1 }, catalogue, grants: at5, specimen: "ordinary" }), { ok: true, depth: 2 });
    check("A-52 the Depth cap is the gate",
        feedCheck({ slug: "ruby", paid: { ruby: 2 }, catalogue, grants: at5, specimen: "quickened" }).ok, false);
    check("A-38c the new Depth must fit the track's Mass",
        feedCheck({ slug: "sapphire", paid: { ruby: 2, sapphire: 1 }, catalogue, grants: at5, specimen: "ordinary" }).ok, false);
    check("A-40b Depth 3 takes a quickened specimen",
        feedCheck({ slug: "ruby", paid: { ruby: 2 }, catalogue, grants: { gem: 7, metal: 5, depthCap: 3 }, specimen: "ordinary" }).ok, false);
    check("…and a quickened one will do",
        feedCheck({ slug: "ruby", paid: { ruby: 2 }, catalogue, grants: { gem: 7, metal: 5, depthCap: 3 }, specimen: "quickened" }).ok, true);
    check("A-38a nothing to feed, no feeding",
        feedCheck({ slug: "ruby", paid: {}, catalogue, grants: at5, specimen: null }).ok, false);

    check("A-43 the Instinct is the colour with the most Mass",
        instinctOf(colourTotals({ ruby: 2, sapphire: 1 }, catalogue)).instinct, "red");
    check("A-45 a tie is the player's to break — unbroken, there is no Instinct",
        instinctOf(colourTotals({ ruby: 1, sapphire: 1 }, catalogue)), { instinct: null, tied: ["red", "blue"] });
    check("…and broken, it is theirs", instinctOf(colourTotals({ ruby: 1, sapphire: 1 }, catalogue), "blue").instinct, "blue");

    check("I-1a Red sums the Depths of the Mutations adding damage", mutationDepth({ ruby: 3, iron: 2, copper: 2 }, catalogue), 5);
    check("…and Ruby at Depth 1 adds no damage yet", mutationDepth({ ruby: 1 }, catalogue), 0);

    const ruby = JSON.parse(fs.readFileSync(new URL("../content/assimilator-substrates/red/ruby.json", import.meta.url), "utf8"));
    check("Ruby first adds damage at Depth 2 — its crit-only persistent does not count", damageFrom(ruby.system.rules), 2);

    // Phase 4: the Instincts.
    const { colourCounts, instinctsOf, scaled, instinctValues, mutationTypeOf, damageTypeOf } =
        await import("../scripts/assimilator/engine.mjs");
    const cat = { ...catalogue,
        electrum: { colour: "gold", kind: "metal", damageFrom: null },
        emerald: { colour: "green", kind: "gem", damageFrom: null },
        carnelian: { colour: "orange", kind: "gem", damageFrom: null } };
    check("EL-1b Electrum also counts as its second colour",
        colourCounts({ electrum: 1, emerald: 2 }, cat, "green"), { red: 0, gold: 1, orange: 0, blue: 0, purple: 0, green: 2, black: 0, white: 0, gray: 0 });
    check("EL-3a at Electrum 3 a second clause, both at half", instinctsOf("red", 3, "green"), { primary: "red", secondary: "green", scale: 0.5 });
    check("EL-4a at Electrum 4 both at full", instinctsOf("red", 4, "green").scale, 1);
    check("…below 3 no second clause", instinctsOf("red", 2, "green").secondary, null);
    check("…and the Instinct's own colour adds nothing", instinctsOf("green", 4, "green").secondary, null);
    check("half value rounds down, minimum 1; nothing stays nothing", [scaled(5, 0.5), scaled(1, 0.5), scaled(0, 0.5), scaled(4, 1)], [2, 1, 0, 4]);
    const iv = instinctValues({ effective: { ruby: 3, iron: 2, emerald: 1, carnelian: 2 }, catalogue: cat,
        counts: colourCounts({ ruby: 3, iron: 2, emerald: 1, carnelian: 2 }, cat), scale: 1 });
    check("I-1a Red: each Substrate's own Depth", iv.red, { ruby: 3, iron: 2, emerald: 1, carnelian: 2 });
    check("I-3b Orange: +5 feet per bound Orange Substrate", iv.orangeSpeed, 5);
    check("I-4b Blue: twice the highest Depth", iv.blueReduction, 6);
    check("I-6b Green: fast healing per bound Green Substrate", iv.greenHealing, 1);
    check("I-8b White: uses equal to the highest Depth", iv.whiteUses, 3);
    check("I-9a Gray: the total Depth of bound metals", iv.grayHardness, 2);
    check("I-3a Orange's +1d4 is the deepest damaging Mutation's type",
        mutationTypeOf({ ruby: 3, iron: 2 }, { ruby: { damageFrom: 2, damageType: "fire" }, iron: { damageFrom: 1, damageType: "bludgeoning" } }, "electricity"), "fire");
    check("Ruby's Mutation is fire", damageTypeOf(ruby.system.rules), "fire");

    // Phase 5: the Bonds.
    const { activeBonds } = await import("../scripts/assimilator/engine.mjs");
    const pairs = { "molten-carapace": ["ruby", "iron"], transmutation: ["gold", "electrum"] };
    check("A Bond is in force with both Substrates at 2+", activeBonds(["molten-carapace"], { ruby: 2, iron: 2 }, pairs), ["molten-carapace"]);
    check("…and suppressed when either drops below 2", activeBonds(["molten-carapace"], { ruby: 2, iron: 1 }, pairs), []);
    check("…and only while slotted", activeBonds([], { ruby: 2, iron: 2 }, pairs), []);
    check("EL-2a Electrum 2 stands in for the missing half of the Bond it names",
        activeBonds(["molten-carapace"], { ruby: 2, electrum: 2 }, pairs, "molten-carapace"), ["molten-carapace"]);
    check("…not for a Bond it does not name", activeBonds(["molten-carapace"], { ruby: 2, electrum: 2 }, pairs, "conduction"), []);
    check("…not for both halves at once", activeBonds(["molten-carapace"], { electrum: 4 }, pairs, "molten-carapace"), []);
    check("…and not below Depth 2", activeBonds(["molten-carapace"], { ruby: 2, electrum: 1 }, pairs, "molten-carapace"), []);
    // Phase 6: the feats the engine reads.
    const cap5 = { gem: 3, metal: 2, depthCap: 2 };
    check("AF-14b Deep Vein: one Substrate past the cap", [
        feedCheck({ slug: "ruby", paid: { ruby: 2 }, catalogue, grants: cap5, specimen: "quickened", caps: { ruby: 3 } }).ok,
        feedCheck({ slug: "ruby", paid: { ruby: 2 }, catalogue, grants: cap5, specimen: "quickened" }).ok], [true, false]);
    check("AF-43a Omnivore: one pool", [
        feedCheck({ slug: "ruby", paid: { ruby: 1, sapphire: 2 }, catalogue, grants: { gem: 3, metal: 2, depthCap: 4 }, specimen: "ordinary" }).ok,
        feedCheck({ slug: "ruby", paid: { ruby: 1, sapphire: 2 }, catalogue, grants: { gem: 3, metal: 2, depthCap: 4, merged: true }, specimen: "ordinary" }).ok],
    [false, true]);
    check("AF-21 Bonded Deep: its Bond at Depth 1", [
        activeBonds(["molten-carapace"], { ruby: 1, iron: 1 }, pairs, null, "molten-carapace"),
        activeBonds(["molten-carapace"], { ruby: 1, iron: 1 }, pairs)], [["molten-carapace"], []]);
    check("B-11 Transmutation: three-quarters, rounded up", [instinctsOf("red", 3, "green", true).scale, scaled(5, 0.75), scaled(1, 0.75)], [0.75, 4, 1]);
}

/* -------------------------------------------------------------------------------------------- */

if (failures.length > 0) {
    console.error(`Assimilator tests failed: ${failures.length} of ${checks}.`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
}
console.log(`Assimilator tests passed: ${checks} checks.`);

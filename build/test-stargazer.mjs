/**
 * The Stargazer's offline checks.
 *
 * Phase 0 ships no content, so what can be checked is plumbing: the check pipeline that is now the one way
 * onto `game.pf2e.Check.roll` — its contract is ordering, isolation and handing the stage's context to the
 * roll, all of which can be exercised without Foundry — and the Portent's fortune guard (guide §4.5), which
 * is a pure edit of `context.substitutions`.
 */

const failures = [];
let checks = 0;

function check(label, actual, expected) {
    checks += 1;
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    if (a !== e) failures.push(`${label}\n      expected ${e}\n      got      ${a}`);
}

/* -------------------------------------------------------------------------------------------- */
/*  The check pipeline                                                                          */
/* -------------------------------------------------------------------------------------------- */

{
    const seen = [];
    globalThis.game = {
        pf2e: {
            Check: {
                async roll(check, context) {
                    seen.push({ dc: context.dc?.value, tag: context.tag ?? null, subs: context.substitutions?.length ?? 0 });
                    return "rolled";
                },
            },
        },
    };

    const { CheckPipeline, PRIORITY } = await import("../scripts/lib/check-pipeline.mjs");
    const order = [];
    CheckPipeline.before("late", 30, (_check, context) => {
        order.push("late");
        return { ...context, tag: `${context.tag ?? ""}late` };
    });
    CheckPipeline.before("broken", 20, () => {
        order.push("broken");
        throw new Error("a stage broke");
    });
    CheckPipeline.before("early", 10, (_check, context) => {
        order.push("early");
        return { ...context, dc: { value: context.dc.value + 2 }, tag: "early+" };
    });

    let refused = null;
    try {
        CheckPipeline.before("early", 5, () => {});
    } catch (error) {
        refused = error.message.includes('already has a stage called "early"');
    }
    check("a stage name is claimed once", refused, true);
    check("stages sort by priority", CheckPipeline.stages().map((s) => s.name), ["early", "broken", "late"]);
    check("the Portent guard runs after the cover correction", PRIORITY.portentGuard > PRIORITY.ignoreCover, true);

    CheckPipeline.install();
    const quiet = console.error;
    console.error = () => {};
    const result = await game.pf2e.Check.roll({}, { dc: { value: 15 }, substitutions: [] });
    console.error = quiet;
    check("each stage sees the last one's context, a broken stage costs only itself, and the check is rolled",
        [order, seen, result], [["early", "broken", "late"], [{ dc: 17, tag: "early+late", subs: 0 }], "rolled"]);
}

/* -------------------------------------------------------------------------------------------- */
/*  The Portent's fortune guard — guide §4.5                                                     */
/* -------------------------------------------------------------------------------------------- */

{
    const { guardPortent, isPortent } = await import("../scripts/stargazer/armed.mjs");
    const portent = () => ({ slug: "stargazer-portent", value: 20, required: true, selected: true, effectType: "fortune" });

    check("a Portent is known by its slug", [isPortent(portent()), isPortent({ slug: "assured-fate" }), isPortent({})], [true, false, false]);

    const plain = { substitutions: [portent()] };
    check("an unaltered roll keeps its Portent", [guardPortent(plain).length, plain.substitutions.length], [0, 1]);

    for (const rollTwice of ["keep-higher", "keep-lower"]) {
        const context = { rollTwice, substitutions: [portent()] };
        const array = context.substitutions;
        const removed = guardPortent(context);
        check(`a ${rollTwice} roll-twice holds the Portent back, from the caller's own array`,
            [removed.length, context.substitutions.length, context.substitutions === array], [1, 0, true]);
    }

    const other = { substitutions: [{ slug: "assured-fate", value: 10, required: true, selected: true }, portent()] };
    check("another substitution holds it back and is itself left alone",
        [guardPortent(other).length, other.substitutions.map((s) => s.slug)], [1, ["assured-fate"]]);

    check("no substitutions, nothing to do", [guardPortent({}).length, guardPortent({ rollTwice: "keep-higher" }).length], [0, 0]);
}

/* -------------------------------------------------------------------------------------------- */
/*  Phase 1 — the chassis (class tracker SG-01 to SG-21, SG-23, SG-36, SG-39)                     */
/* -------------------------------------------------------------------------------------------- */

{
    const fs = await import("node:fs");
    const read = (rel) => JSON.parse(fs.readFileSync(new URL(`../content/${rel}`, import.meta.url), "utf8"));
    const cls = read("stargazer-class/stargazer.json").system;

    check("SG-01 key ability Wisdom", cls.keyAbility.value, ["wis"]);
    check("SG-02 HP 8 per level", cls.hp, 8);
    check("SG-03 Perception expert at 1st", cls.perception, 2);
    check("SG-04 Fortitude and Reflex trained, Will expert", cls.savingThrows, { fortitude: 1, reflex: 1, will: 2 });
    const grants = read("stargazer-class-features/core/star-chart.json").system.rules.filter((r) => r.key === "GrantItem").map((r) => r.uuid);
    check("SG-05 Occultism plus four others, and Astronomy Lore granted at 1st by Star Chart",
        [cls.trainedSkills, grants], [{ additional: 4, value: ["occultism"] }, ["Compendium.isaacs-hb-pf2e.stargazer-class-features.Item.Astronomy Lore"]]);
    check("SG-06 unarmed and simple trained, nothing else", [cls.attacks.simple, cls.attacks.unarmed, cls.attacks.martial, cls.attacks.advanced], [1, 1, 0, 0]);
    check("SG-07 unarmored and light trained, nothing else", cls.defenses, { heavy: 0, light: 1, medium: 0, unarmored: 1 });
    check("SG-08 the Stargazer DC is the class's own, and it casts", [cls.slug, cls.traits.value, cls.spellcasting], ["stargazer", ["stargazer"], 1]);
    check("SG-21 Stargazer feats at 1, 2 and every even level", cls.classFeatLevels.value, [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
    check("SG-36b a core skill feat at 3rd, 7th and 15th on top of the even levels",
        cls.skillFeatLevels.value, [2, 3, 4, 6, 7, 8, 10, 12, 14, 15, 16, 18, 20]);

    const feature = (name) => {
        const grant = Object.values(cls.items).find((i) => i.name === name);
        const slug = name.toLowerCase().replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
        return { level: grant?.level, doc: read(`stargazer-class-features/core/${slug}.json`) };
    };
    const rank = (name, key) => {
        const { level, doc } = feature(name);
        return [level, doc.system.level.value, doc.system.subfeatures?.proficiencies?.[key]?.rank];
    };
    check("SG-09 Expert Stargazer at 7th", rank("Expert Stargazer", "stargazer"), [7, 7, 2]);
    check("SG-10 Vigilant Senses at 7th", rank("Vigilant Senses", "perception"), [7, 7, 3]);
    check("SG-11 Great Fortitude at 9th", rank("Great Fortitude", "fortitude"), [9, 9, 2]);
    check("SG-12 Resolve at 11th", rank("Resolve", "will"), [11, 11, 3]);
    check("SG-13 Weapon Expertise at 11th: simple and unarmed",
        [rank("Weapon Expertise", "simple"), rank("Weapon Expertise", "unarmed")[2]], [[11, 11, 2], 2]);
    check("SG-14 Incredible Senses at 13th", rank("Incredible Senses", "perception"), [13, 13, 4]);
    check("SG-15 Lightning Reflexes at 13th", rank("Lightning Reflexes", "reflex"), [13, 13, 2]);
    check("SG-16 Armor Expertise at 13th: light and unarmored, never medium or heavy",
        [rank("Armor Expertise", "light"), rank("Armor Expertise", "unarmored")[2],
            Object.keys(feature("Armor Expertise").doc.system.subfeatures.proficiencies).sort()], [[13, 13, 2], 2, ["light", "unarmored"]]);
    check("SG-17 Master Stargazer at 15th", rank("Master Stargazer", "stargazer"), [15, 15, 3]);
    check("SG-18 Greater Resolve at 17th", rank("Greater Resolve", "will"), [17, 17, 4]);
    check("SG-19 Legendary Stargazer at 19th", rank("Legendary Stargazer", "stargazer"), [19, 19, 4]);
    check("the spellcasting rank rises with the Stargazer DC",
        ["Expert Stargazer", "Master Stargazer", "Legendary Stargazer"].map((n) => rank(n, "spellcasting")[2]), [2, 3, 4]);
    check("SG-20 no weapon specialization, ever",
        Object.values(cls.items).filter((i) => /specialization/i.test(i.name)).length, 0);

    const cap = (name) => feature(name).doc.system.rules.find((r) => r.path === "system.resources.focus.cap");
    check("SG-23a a focus pool of 1; SG-39 2 at Second Star (7th), the later rule winning",
        [cap("Star Chart").value, cap("Second Star").value, cap("Second Star").priority > cap("Star Chart").priority, feature("Second Star").level],
        [1, 2, true, 7]);

    const loreFlag = (name) => feature(name).doc.flags?.["isaacs-hb-pf2e"]?.loreRank;
    check("SG-36a Astronomy Lore expert at 3rd, master at 7th, legendary at 15th",
        ["Astronomy Lore (3rd)", "Astronomy Lore (7th)", "Astronomy Lore (15th)"].map((n) => [feature(n).level, loreFlag(n)?.rank]),
        [[3, 2], [7, 3], [15, 4]]);

    globalThis.game ??= {};
    const { StarChart } = await import("../scripts/stargazer/star-chart.mjs");
    const actorWith = (...ranks) => ({
        itemTypes: { feat: ranks.map((r) => ({ flags: { "isaacs-hb-pf2e": { loreRank: { slug: "astronomy-lore", rank: r } } } })) },
    });
    check("the Lore's rank is the highest a present feature grants, and never below trained",
        [StarChart.loreRankFor(actorWith(), "astronomy-lore"), StarChart.loreRankFor(actorWith(2, 3), "astronomy-lore"),
            StarChart.loreRankFor(actorWith(4, 2, 3), "astronomy-lore"), StarChart.loreRankFor(actorWith(4), "other-lore")],
        [1, 3, 4, 1]);
}

/* -------------------------------------------------------------------------------------------- */

if (failures.length > 0) {
    console.error(`Stargazer tests failed: ${failures.length} of ${checks}.`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
}
console.log(`Stargazer tests passed: ${checks} checks.`);

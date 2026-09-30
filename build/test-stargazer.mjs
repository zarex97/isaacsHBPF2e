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
/*  Phase 2 — the luck engine (SG-33, SG-34, SG-35, SG-37, SG-40, SG-43, SG-44, SG-47)            */
/* -------------------------------------------------------------------------------------------- */

{
    globalThis.foundry ??= { utils: { randomID: () => "x" } };
    const { Numbers, threadEffect, portentEffect, refusal } = await import("../scripts/stargazer/threads.mjs");
    const { isPortent } = await import("../scripts/stargazer/armed.mjs");
    const sg = (level, ...slugs) => ({ level, name: "Vega", uuid: "Actor.vega", id: "vega", itemTypes: { feat: slugs.map((slug) => ({ slug })) } });

    check("SG-33b/SG-37a/SG-44a: one creature at 30 feet; two at 60 from Widen the Sky; three from Threefold Thread",
        [[Numbers.threadTargets(sg(1)), Numbers.threadRange(sg(1))],
            [Numbers.threadTargets(sg(5, "widen-the-sky")), Numbers.threadRange(sg(5, "widen-the-sky"))],
            [Numbers.threadTargets(sg(17, "widen-the-sky", "threefold-thread")), Numbers.threadRange(sg(17, "widen-the-sky", "threefold-thread"))]],
        [[1, 30], [2, 60], [3, 60]]);
    check("SG-40: ±1, ±2 from Surer Thread", [Numbers.threadValue(sg(8)), Numbers.threadValue(sg(9, "surer-thread"))], [1, 2]);
    check("SG-34b: Chart the Course names one creature, two from 11th", [Numbers.chartTargets(sg(10)), Numbers.chartTargets(sg(11))], [1, 2]);
    check("one reaction; Two Warnings a second", [Numbers.reactions(sg(9)), Numbers.reactions(sg(10, "two-warnings"))], [1, 2]);

    const origin = sg(9, "surer-thread");
    const guide = threadEffect({ origin, group: "g", kind: "guide", value: 2, kinds: ["attack-roll", "saving-throw", "skill-check", "perception"] }).system.rules[0];
    const snarl = threadEffect({ origin, group: "g", kind: "snarl", value: 2, kinds: ["attack-roll", "skill-check", "perception"] }).system.rules[0];
    check("SG-33c Guide: +N circumstance, spent only by a roll it applied to",
        [guide.key, guide.type, guide.value, guide.removeAfterRoll], ["FlatModifier", "circumstance", 2, "if-enabled"]);
    check("SG-33d/e Snarl: −N circumstance, and never a saving throw",
        [snarl.value, snarl.selector.includes("saving-throw")], [-2, false]);
    const free = threadEffect({ origin, group: "g", kind: "snarl", value: 1, kinds: ["attack-roll", "skill-check", "perception"], free: true }).system.rules[0];
    check("SG-47d a Chart the Course Thread is spent by the creature's first d20, whatever it is", free.removeAfterRoll, true);
    const twin = threadEffect({ origin, group: "g", kind: "guide", value: 2, kinds: ["attack-roll"], twice: true }).system.rules[0];
    const twinSnarl = threadEffect({ origin, group: "g", kind: "snarl", value: 2, kinds: ["skill-check"], twice: true }).system.rules[0];
    check("SG-43a/b Twin Fates: roll twice, higher for Guide and lower for Snarl, spent only when it rolled twice",
        [twin.key, twin.keep, twinSnarl.keep, twin.removeAfterRoll], ["RollTwice", "higher", "lower", true]);

    const portent = portentEffect({ origin, value: 20, selector: "skill-check" }).system.rules[0];
    check("SG-35e/f the Portent replaces the die, required, with a slug the fortune guard knows",
        [portent.key, portent.value, portent.required, portent.removeAfterRoll, isPortent(portent)], ["SubstituteRoll", 20, true, "if-enabled", true]);

    check("a creature immune to prediction refuses the Thread",
        refusal(origin, { name: "Oracle", attributes: { immunities: [{ type: "prediction" }] } }, { range: 30 }), "Oracle is immune to prediction");
}

/* -------------------------------------------------------------------------------------------- */
/*  Phase 3a — the Night Vigil (SG-28, SG-30, SG-42)                                             */
/* -------------------------------------------------------------------------------------------- */

{
    const { forewarnLimit, forewarnMode, forecastDays } = await import("../scripts/stargazer/vigil.mjs");
    const sg = (...slugs) => ({ itemTypes: { feat: slugs.map((slug) => ({ slug })) } });
    check("SG-30a Forewarned briefs up to five allies; Wide Vigil lifts the limit",
        [forewarnLimit(sg()), forewarnLimit(sg("wide-vigil"))], [5, Infinity]);
    check("SG-30b/SG-42d Forewarned takes a step off; Constellation Mastery makes it Foreordained",
        [forewarnMode(sg()), forewarnMode(sg("constellation-mastery"))], ["milder", "benefic"]);
    check("SG-28a three days of forecast; seven with the Ephemeris's The Almanac",
        [forecastDays(sg()), forecastDays(sg("the-almanac"))], [3, 7]);
}

/* -------------------------------------------------------------------------------------------- */
/*  Phase 3b — the Sky (SK-22, SK-12, SK-14, SK-19, SK-20)                                       */
/* -------------------------------------------------------------------------------------------- */

{
    const { libraReady } = await import("../scripts/sky/terrain-rolls.mjs");
    const now = { day: 10, hour: 240 };
    check("SK-22a/c Libra's daily allowance: spent for the sky's day, back the next",
        [libraReady("benefic", null, now), libraReady("benefic", { day: 10, hour: 239 }, now), libraReady("retrograde", { day: 9, hour: 240 }, now)],
        [true, false, true]);
    check("SK-22b/d Libra's hourly allowance on Exalted and Malefic: spent for the hour, back the next",
        [libraReady("exalted", { day: 10, hour: 240 }, now), libraReady("malefic", { day: 10, hour: 239 }, now)], [false, true]);

    const fs = await import("node:fs");
    for (const aspect of ["benefic", "exalted", "retrograde", "malefic"]) {
        const rules = JSON.parse(fs.readFileSync(new URL(`../content/saint-effects/sky-aspect/sky-${aspect}.json`, import.meta.url), "utf8")).system.rules;
        const value = rules[0].value;
        const find = (selector, sign) => rules.find((r) => r.selector === selector && r.predicate?.[0] === `sky:sign:${sign}` && r.predicate.length > 1)
            ?? rules.find((r) => r.selector === selector && r.predicate?.[0] === `sky:sign:${sign}`);
        check(`SK-12/14/19/20 ${aspect}: Cancer's disease and poison, Virgo's Recall Knowledge and Seek, Aquarius's counteract, Pisces's illusions — all at ${value}`,
            [find("fortitude", "cancer")?.value, find("skill-check", "virgo")?.predicate?.[1], find("perception", "virgo")?.predicate?.[1],
                find("counteract-check", "aquarius")?.value, find("perception", "pisces")?.predicate?.[1]],
            [value, "action:recall-knowledge", "action:seek", value, "item:trait:illusion"]);
    }
}

/* -------------------------------------------------------------------------------------------- */
/*  Phase 4a — the Auguries that buff (OM-00, OM-03, OM-05–OM-08, OM-14–OM-17, SG-25)            */
/* -------------------------------------------------------------------------------------------- */

{
    const fs = await import("node:fs");
    const read = (rel) => JSON.parse(fs.readFileSync(new URL(`../content/${rel}`, import.meta.url), "utf8"));
    const spell = (slug) => read(`stargazer-auguries/${slug}.json`);
    const targeting = (slug) => spell(slug).flags["isaacs-hb-pf2e"].areaTargeting;
    const maxAt = (slug, level) => {
        const t = targeting(slug);
        return t.maxTargets + Object.entries(t.heightening?.at ?? {}).filter(([l]) => Number(l) <= level).reduce((n, [, v]) => n + (v.maxTargets ?? 0), 0);
    };
    const all = ["guiding-star", "iron-auspice", "two-roads", "shell-of-hours", "crown-of-fire", "poured-knowing", "deep-dream", "borrowed-second"];
    check("OM-00a/b every Augury: prediction, focus, the class trait, occult, rank 1 auto-heightening",
        all.every((s) => ["focus", "prediction", "stargazer"].every((t) => spell(s).system.traits.value.includes(t))
            && spell(s).system.traits.traditions.includes("occult") && spell(s).system.level.value === 1), true);
    check("OM-03 Guiding Star: 2 allies at 60 feet, 3 at rank 4, 4 at rank 7, 5 at rank 10",
        [targeting("guiding-star").range, maxAt("guiding-star", 1), maxAt("guiding-star", 7), maxAt("guiding-star", 13), maxAt("guiding-star", 19)], [60, 2, 3, 4, 5]);
    check("OM-03f Guiding Star's bonus is +2 from rank 10",
        spell("guiding-star").flags["isaacs-hb-pf2e"].riders[0].apply.substitutions.map((s) => s.value.at["19"]), [2, 2, 2, 2]);
    check("OM-05f/07f/08f/14f/15f +1 ally every other rank", ["iron-auspice", "shell-of-hours", "crown-of-fire", "poured-knowing", "deep-dream"]
        .map((s) => [maxAt(s, 4), maxAt(s, 5), maxAt(s, 9), maxAt(s, 17)]), Array(5).fill([2, 3, 4, 6]));
    check("OM-05d Iron Auspice's temporary Hit Points are three times the Stargazer's level",
        [3, 10, 20].map((l) => { const v = spell("iron-auspice").flags["isaacs-hb-pf2e"].riders[0].apply.substitutions[0].value; return l === 1 ? v.base : v.at[String(l)]; }), [9, 30, 60]);
    check("OM-06 Two Roads: 2 allies, 3 and saves from rank 5 (level 9), 4 from rank 9",
        [maxAt("two-roads", 8), maxAt("two-roads", 9), maxAt("two-roads", 17),
            spell("two-roads").flags["isaacs-hb-pf2e"].riders[0].apply.substitutions[0].value.at["9"][0]], [2, 3, 4, "saving-throw"]);
    check("OM-07c Shell of Hours heals 2d8, +2d8 every other rank",
        (({ formula, perStep, perStepInterval }) => [formula, perStep, perStepInterval])(spell("shell-of-hours").flags["isaacs-hb-pf2e"].riders[0].apply), ["2d8", "2d8", 2]);
    check("OM-07e Shell of Hours refuses one drop to 0 and ends", read("stargazer-effects/effect-shell-of-hours.json").flags["isaacs-hb-pf2e"].refuseDeath.consume, true);
    check("OM-16 Borrowed Second: you and/or one ally, 3 from rank 5, 5 from rank 9",
        [targeting("borrowed-second").includesSelf, maxAt("borrowed-second", 1), maxAt("borrowed-second", 9), maxAt("borrowed-second", 17)], [true, 2, 3, 5]);

    const { spentReprieve, SIGN_AUGURY } = await import("../scripts/stargazer/auguries.mjs");
    const fort = { flags: { "isaacs-hb-pf2e": { stargazerReprieve: "fortitude" } } };
    check("OM-05e/15d a reprieve is spent by a critical failure on its own save, and only that",
        [spentReprieve([fort], { type: "saving-throw", domains: ["fortitude", "saving-throw"], unadjustedOutcome: "criticalFailure" }) === fort,
            spentReprieve([fort], { type: "saving-throw", domains: ["fortitude"], unadjustedOutcome: "failure" }),
            spentReprieve([fort], { type: "saving-throw", domains: ["will"], unadjustedOutcome: "criticalFailure" })], [true, null, null]);
    check("OM-17 twelve signs, twelve Auguries; four belong to none",
        [Object.keys(SIGN_AUGURY).length, ["Guiding Star", "Borrowed Second", "Death Foretold", "The Hour Is Not Come"].some((n) => Object.values(SIGN_AUGURY).includes(n))], [12, false]);
    const cls = read("stargazer-class/stargazer.json").system.items;
    check("SG-25 nine Auguries known, at 1, 5, 7, 9, 11, 13, 15, 17 and 19",
        Object.values(cls).filter((i) => /^Augury \(/.test(i.name)).map((i) => i.level).sort((a, b) => a - b), [1, 5, 7, 9, 11, 13, 15, 17, 19]);
}

/* -------------------------------------------------------------------------------------------- */
/*  Phase 4b — the Auguries that bite (OM-01, OM-02, OM-04, OM-09–OM-12)                         */
/* -------------------------------------------------------------------------------------------- */

{
    const fs = await import("node:fs");
    const read = (rel) => JSON.parse(fs.readFileSync(new URL(`../content/${rel}`, import.meta.url), "utf8"));
    const riders = (slug) => read(`stargazer-auguries/${slug}.json`).flags["isaacs-hb-pf2e"].riders;
    const at = (list, rank, outcome) => list.filter((r) => r.apply.type === "damage" && r.outcomes.includes(outcome)
        && r.predicate.every((p) => (p.gte ? rank >= p.gte[1] : rank <= p.lte[1]))).map((r) => `${r.apply.formula}${r.apply.multiplier ? "x2" : ""}`);
    const death = riders("death-foretold");
    check("OM-01d-f Death Foretold: frightened 1 / 2 / 3 + stunned 1 + fleeing 1 round",
        death.filter((r) => r.apply.type === "condition").map((r) => `${r.outcomes[0]}:${r.apply.slug}${r.apply.value ?? ""}`),
        ["success:frightened1", "failure:frightened2", "criticalFailure:frightened3", "criticalFailure:stunned1", "criticalFailure:fleeing"]);
    check("OM-01g/h Death Foretold's damage: none below rank 4; 2d6 at 4, +2d6 each two ranks; doubled on a critical failure",
        [at(death, 3, "failure"), at(death, 4, "failure"), at(death, 7, "failure"), at(death, 10, "failure"), at(death, 10, "criticalFailure")],
        [[], ["2d6"], ["4d6"], ["8d6"], ["8d6x2"]]);
    const { hourDice } = await import("../scripts/stargazer/auguries.mjs");
    check("OM-02g/h The Hour Is Not Come heals nothing below rank 5, 2d8 at 5, +2d8 each two ranks",
        [4, 5, 6, 7, 9, 10].map(hourDice), [0, 2, 2, 4, 6, 6]);
    const blood = riders("first-blood")[1].apply.substitutions[0].value;
    check("OM-04e/f First Blood: 1d6 spirit, +1d6 every other rank", [blood.base, blood.at["5"], blood.at["17"],
        read("stargazer-effects/effect-first-blood-strike.json").system.rules[0].damageType], [1, 2, 5, "spirit"]);
    const doubt = riders("coiling-doubt");
    check("OM-11 Coiling Doubt: one roll on a success; each round for 3 rounds on a failure; a minute and stupefied 2 on a critical failure",
        doubt.map((r) => `${r.outcomes.join("/")}:${r.apply.slug ?? r.apply.uuid.split("Item.")[1]}:${r.duration.value}${r.duration.unit[0]}`),
        ["success/failure/criticalFailure:Effect: Coiling Doubt:1m", "failure:Effect: Coiling Doubt (Lingering):3r",
            "criticalFailure:Effect: Coiling Doubt (Lingering):1m", "criticalFailure:stupefied:1m"]);
    check("OM-10b Fixed Point: a 30-foot emanation, up to 6 creatures",
        [read("stargazer-auguries/fixed-point.json").system.area, read("stargazer-auguries/fixed-point.json").flags["isaacs-hb-pf2e"].areaTargeting.maxTargets],
        [{ type: "emanation", value: 30 }, 6]);
    const { snarlAgainst } = await import("../scripts/stargazer/threads.mjs");
    const huntedTarget = { itemTypes: { effect: [{ flags: { "isaacs-hb-pf2e": { huntedBySky: true } } }] } };
    const sg = (...slugs) => ({ itemTypes: { feat: slugs.map((slug) => ({ slug })) } });
    check("OM-12f Snarl against a hunted creature: −3, −4 with Surer Thread; −1 against anyone else",
        [snarlAgainst(sg(), huntedTarget), snarlAgainst(sg("surer-thread"), huntedTarget), snarlAgainst(sg(), { itemTypes: { effect: [] } })], [3, 4, 1]);
}

/* -------------------------------------------------------------------------------------------- */
/*  Phase 5: the four Paths                                                                     */
/* -------------------------------------------------------------------------------------------- */

{
    const fs = await import("node:fs");
    const read = (rel) => JSON.parse(fs.readFileSync(new URL(`../content/${rel}`, import.meta.url), "utf8"));
    const feature = (name) => `Compendium.isaacs-hb-pf2e.stargazer-class-features.Item.${name}`;
    const PATHS = {
        "the-weaver": ["Knotted Thread", "Doubled Strand", "Skein of Fates", "Tapestry"],
        "the-herald": ["Herald's Omen", "The Announcement", "Sentence Passed", "Foregone Conclusion"],
        "the-ephemeris": ["Perfect Recall", "The Almanac", "Written Down", "Every Sky Ever Read"],
        "the-broken-thread": ["Deja Vu", "Second Sight", "Unmade Again", "The Long Way Round"],
    };
    const choice = read("stargazer-class-features/core/stargazers-path.json").system.rules[0];
    check("SG-22 Stargazer's Path: a 1st-level choice of four",
        [read("stargazer-class/stargazer.json").system.items.spath.level, choice.key, choice.choices.map((c) => c.label)],
        [1, "ChoiceSet", ["The Weaver", "The Herald", "The Ephemeris", "The Broken Thread"]]);
    for (const [slug, abilities] of Object.entries(PATHS)) {
        const grants = read(`stargazer-class-features/paths/${slug}.json`).system.rules
            .map((r) => [r.uuid, r.predicate?.[0]?.gte?.[1] ?? 1]);
        check(`SG-22 ${slug}: an ability at 1st, 5th, 13th and 17th`, grants, abilities.map((a, i) => [feature(a), [1, 5, 13, 17][i]]));
    }

    const { Numbers } = await import("../scripts/stargazer/threads.mjs");
    const sg = (level, ...slugs) => ({ level, itemTypes: { feat: slugs.map((slug) => ({ slug })) } });
    check("WV-02a Doubled Strand: Chart the Course names two, three from 11th (one and two without it)",
        [sg(5, "doubled-strand"), sg(11, "doubled-strand"), sg(5), sg(11)].map((a) => Numbers.chartTargets(a)), [2, 3, 1, 2]);
    check("WV-03a Skein of Fates: three from 13th, four with Threefold Thread",
        [Numbers.threadTargets(sg(13, "widen-the-sky", "skein-of-fates")), Numbers.threadTargets(sg(17, "widen-the-sky", "threefold-thread", "skein-of-fates"))], [3, 4]);
    const knot = read("stargazer-effects/effect-knotted-thread.json").system.rules[0];
    check("WV-01a Knotted Thread: +1 circumstance to AC", [knot.selector, knot.type, knot.value], ["ac", "circumstance", 1]);

    check("HR-01a Herald's Omen grants Coiling Doubt",
        read("stargazer-class-features/paths/heralds-omen.json").system.rules[0].uuid, "Compendium.isaacs-hb-pf2e.stargazer-auguries.Item.Coiling Doubt");
    const sentence = read("stargazer-class-features/paths/sentence-passed.json");
    const save = sentence.flags["isaacs-hb-pf2e"].riders[0].apply;
    check("HR-03a Sentence Passed: two actions, once per 10 minutes, a Will save against the class DC",
        [sentence.system.actions.value, sentence.system.traits.value.slice(1), sentence.system.frequency, save.statistic, save.dc],
        [2, ["concentrate", "misfortune", "prediction"], { max: 1, per: "PT10M" }, "will", "class"]);
    check("HR-03b/d Sentence Passed: the sentence on a failure for a minute; doomed 1 on a critical failure",
        save.riders.map((r) => `${r.outcomes.join("/")}:${r.apply.slug ?? r.apply.uuid.split("Item.")[1]}${r.duration ? `:${r.duration.value}${r.duration.unit[0]}` : ""}`),
        ["failure/criticalFailure:Effect: Sentence Passed:1m", "criticalFailure:doomed"]);
    check("HR-02c The Announcement carries neither auditory nor visual",
        read("stargazer-class-features/paths/the-announcement.json").system.traits.value.filter((t) => ["auditory", "visual"].includes(t)), []);

    const { snarledBy, dejaVuRefusal, shiftedCheck, creatureTypesOf } = await import("../scripts/stargazer/paths.mjs");
    check("HR-01c/HR-04 a Snarled roll names each Stargazer once",
        snarledBy(["action:strike", "stargazer:snarled-by:abc", "stargazer:snarled-by:abc", "stargazer:snarled-by:def"]), ["abc", "def"]);

    const recall = read("stargazer-class-features/paths/perfect-recall.json").system.rules;
    check("EP-01a/b Perfect Recall: −2 circumstance on Astronomy Lore in place of another skill, below 7th only",
        [recall[1].selector, recall[1].value, recall[1].predicate], ["astronomy-lore", -2, ["perfect-recall:substitute", { lt: ["self:level", 7] }]]);
    check("EP-04a Every Sky Ever Read: once per hour",
        read("stargazer-class-features/paths/every-sky-ever-read.json").system.frequency, { max: 1, per: "PT1H" });
    check("EP-03a Written Down reads the creature's first creature type",
        creatureTypesOf(["evil", "undead", "zombie", "mindless"], { undead: "PF2E.TraitUndead", humanoid: "x" }), ["undead"]);
    check("EP-03b a Guide after the roll moves the total and the degree: 19 vs DC 20 → 20, a success",
        [shiftedCheck({ total: 19, dieValue: 9, dc: 20 }, 1).total, shiftedCheck({ total: 19, dieValue: 9, dc: 20 }, 1).degree.key,
            shiftedCheck({ total: 20, dieValue: 10, dc: 20 }, -2).degree.key], [20, "success", "failure"]);

    const me = { id: "me", ...sg(5, "deja-vu", "second-sight") };
    const ally = { id: "ally", name: "Deneb", isAllyOf: () => true };
    const foe = { id: "foe", name: "Foe", isAllyOf: () => false };
    const ok = { at: null, alreadyFortune: false, sentence: false, distanceFeet: 10 };
    globalThis.game = { ...(globalThis.game ?? {}), time: { worldTime: 1000 } };
    check("BT-01a/b/c, BT-02 Deja Vu: own failure yes; a critical failure, a spent 10 minutes, fortune already there, the sentence, no",
        [
            dejaVuRefusal(me, me, { outcome: "failure" }, ok),
            dejaVuRefusal(me, me, { outcome: "criticalFailure" }, ok) !== null,
            dejaVuRefusal(me, me, { outcome: "failure" }, { ...ok, at: 700 }) !== null,
            dejaVuRefusal(me, me, { outcome: "failure" }, { ...ok, at: 400 }),
            dejaVuRefusal(me, me, { outcome: "failure" }, { ...ok, alreadyFortune: true }) !== null,
            dejaVuRefusal(me, me, { outcome: "failure" }, { ...ok, sentence: true }) !== null,
        ], [null, true, true, null, true, true]);
    check("BT-02 Second Sight: an ally within 30 feet, not beyond, not a foe, not without the feature",
        [
            dejaVuRefusal(me, ally, { outcome: "failure" }, ok),
            dejaVuRefusal(me, ally, { outcome: "failure" }, { ...ok, distanceFeet: 35 }) !== null,
            dejaVuRefusal(me, foe, { outcome: "failure" }, ok) !== null,
            dejaVuRefusal({ id: "me", ...sg(5, "deja-vu") }, ally, { outcome: "failure" }, ok) !== null,
        ], [null, true, true, true]);
}

/* -------------------------------------------------------------------------------------------- */
/*  Phase 6a: the class feats                                                                   */
/* -------------------------------------------------------------------------------------------- */

{
    const fs = await import("node:fs");
    const dir = new URL("../content/stargazer-feats/", import.meta.url);
    const read = (rel) => JSON.parse(fs.readFileSync(new URL(rel, dir), "utf8"));
    const all = fs.readdirSync(dir).filter((f) => f.endsWith(".json") && !f.startsWith("_")).map((f) => read(f));
    const byLevel = {};
    for (const f of all) byLevel[f.system.level.value] = (byLevel[f.system.level.value] ?? 0) + 1;
    check("SF: forty class feats at 1, 2, 4 … 20, each carrying the class trait",
        [all.length, byLevel, all.every((f) => f.system.category === "class" && f.system.traits.value.includes("stargazer"))],
        [40, { 1: 5, 2: 5, 4: 4, 6: 4, 8: 3, 10: 4, 12: 3, 14: 3, 16: 3, 18: 3, 20: 3 }, true]);

    const { Numbers, threadKinds } = await import("../scripts/stargazer/threads.mjs");
    const sg = (level, ...slugs) => ({ level, itemTypes: { feat: slugs.map((slug) => ({ slug })) } });
    check("SF-08a Thread of Warning adds initiative to Guide and Snarl",
        [threadKinds(sg(2, "thread-of-warning"), "guide").includes("initiative"), threadKinds(sg(2, "thread-of-warning"), "snarl").includes("initiative"), threadKinds(sg(2), "guide").includes("initiative")],
        [true, true, false]);
    check("SF-18 Long Thread: +30 feet (30 → 60; 60 → 90 with Widen the Sky)",
        [Numbers.threadRange(sg(6, "long-thread")), Numbers.threadRange(sg(6, "widen-the-sky", "long-thread"))], [60, 90]);
    check("SF-13a Widened Chart: Chart the Course at 120 feet", [Numbers.chartRange(sg(4, "widened-chart")), Numbers.chartRange(sg(4))], [120, 60]);
    check("SF-25a Two Warnings: a second reaction", [Numbers.reactions(sg(10, "two-warnings")), Numbers.reactions(sg(10))], [2, 1]);
    check("SF-26a/b Cascade: Twin Fates on one at 12th, three with the class feature; two without Cascade",
        [Numbers.twinFates(sg(12, "cascade")), Numbers.twinFates(sg(15, "cascade", "twin-fates")), Numbers.twinFates(sg(15, "twin-fates")), Numbers.twinFates(sg(12))], [1, 3, 2, 0]);

    const conj = read("conjunction.json").system.rules[0];
    check("SF-19 Conjunction: the focus cap is 3, above Second Star's 2",
        [conj.path, conj.mode, conj.value, conj.priority > 20], ["system.resources.focus.cap", "override", 3, true]);
    const adept = read("augury-adept.json").system.rules;
    check("SF-09 Augury Adept: a choice among the Auguries, granted",
        [adept[0].key, adept[0].choices.filter, adept[1].key], ["ChoiceSet", ["item:tag:stargazer-augury"], "GrantItem"]);
    check("SF-03c Companion of the Watch: one extra familiar ability",
        read("companion-of-the-watch.json").system.rules[0], { key: "ActiveEffectLike", mode: "add", path: "system.attributes.familiarAbilities.value", value: 1 });
    check("SF-22, SF-29a, SF-15a: once per day", ["fates-favourite.json", "inevitable.json", "second-chance-at-fate.json"].map((f) => read(f).system.frequency),
        Array(3).fill({ max: 1, per: "day", value: 1 }));
    check("SF-29a/b Inevitable: a reaction, with misfortune", [read("inevitable.json").system.actionType.value, read("inevitable.json").system.traits.value.includes("misfortune")], ["reaction", true]);
    check("SF-15b Second Chance at Fate: fortune", read("second-chance-at-fate.json").system.traits.value.includes("fortune"), true);

    const eff = (name) => JSON.parse(fs.readFileSync(new URL(`../content/stargazer-effects/${name}.json`, import.meta.url), "utf8")).system.rules[0];
    const fav = eff("effect-fates-favourite");
    check("SF-22 Fate's Favourite: the next d20 is a 20, spent by it", [fav.key, fav.value, fav.removeAfterRoll, fav.selector], ["SubstituteRoll", 20, "if-enabled", "all"]);
    const wia = eff("effect-written-in-advance");
    check("SF-33 Written in Advance: a skill check becomes a success — a critical success too",
        [wia.key, wia.selector, Object.values(wia.adjustment)], ["AdjustDegreeOfSuccess", "skill-check", ["to-success", "to-success", "to-success"]]);

    const { omenReduction, secondChanceRefusal } = await import("../scripts/stargazer/feats.mjs");
    check("SF-12b Omen of Blades: 4 / 6 / 8 / 10 by rank", [1, 2, 3, 4].map(omenReduction), [4, 6, 8, 10]);
    const ok = { usesLeft: 1, outcome: "criticalFailure", distanceFeet: 20, alreadyFortune: false };
    check("SF-15a Second Chance at Fate: a critical failure within 30 feet, once a day, not on a fortune roll",
        [secondChanceRefusal(ok), secondChanceRefusal({ ...ok, outcome: "failure" }) !== null, secondChanceRefusal({ ...ok, usesLeft: 0 }) !== null,
            secondChanceRefusal({ ...ok, distanceFeet: 35 }) !== null, secondChanceRefusal({ ...ok, alreadyFortune: true }) !== null], [null, true, true, true, true]);
}

/* -------------------------------------------------------------------------------------------- */
/*  Phase 6b: the Portent family, and the sky beyond today                                      */
/* -------------------------------------------------------------------------------------------- */

{
    const { portentCount, portentSlots, fixedReady, portentsOf } = await import("../scripts/stargazer/threads.mjs");
    const sg = (flags, ...slugs) => ({ level: 20, itemTypes: { feat: slugs.map((slug) => ({ slug })) }, flags: { "isaacs-hb-pf2e": { stargazer: flags } } });
    check("SF-07a, SF-20a/b: one Portent; two with Twin Portent or Second Portent; three with both",
        [portentCount(sg({}, "portent")), portentCount(sg({}, "portent", "twin-portent")), portentCount(sg({}, "portent", "second-portent")),
            portentCount(sg({}, "portent", "twin-portent", "second-portent")), portentCount(sg({}))], [1, 2, 2, 3, 0]);
    check("SF-39a/b Fixed Sky: one Portent is a 20; the others are rolled",
        portentSlots(sg({}, "portent", "twin-portent", "fixed-sky"), 100).map((s) => [s.id, s.value, Boolean(s.fixed), s.spent]),
        [["fixed", 20, true, false], ["p2", null, false, false]]);
    check("SF-39a Fixed Sky: once per week — seven dawns of the Sky",
        [fixedReady(sg({ fixedSpokenDay: 100 }), 106), fixedReady(sg({ fixedSpokenDay: 100 }), 107), fixedReady(sg({}), 1)], [false, true, true]);
    check("SF-39a: a fixed Portent spoken this week is recorded spent",
        portentSlots(sg({ fixedSpokenDay: 100 }, "portent", "fixed-sky"), 103).map((s) => s.spent), [true]);
    check("a sheet from before Twin Portent still reads its one Portent",
        portentsOf(sg({ portent: { value: 14, spent: false } })), [{ id: "p1", value: 14, spent: false }]);

    const { readingDC, readingResult } = await import("../scripts/stargazer/feats.mjs");
    check("SF-06b Reckoning of Days: the level's Hard DC, 5 lower on an Exalted or Malefic day",
        [readingDC(2, "benefic"), readingDC(2, "malefic"), readingDC(10, "exalted"), readingDC(10, "none")], [18, 13, 24, 29]);
    const day = { sign: "leo", aspect: "benefic" };
    check("SF-06a §8.4's ladder: sign and aspect; sign; nothing; a wrong sign told as a success",
        [0, 1, 2, 3].map((d) => readingResult(d, day, { wrongSign: "virgo" })),
        [{ sign: "virgo", aspect: null }, null, { sign: "leo", aspect: null }, { sign: "leo", aspect: "benefic" }]);

    const { longNow } = await import("../scripts/riders/apply.mjs");
    const caster = (...slugs) => ({ itemTypes: { feat: slugs.map((slug) => ({ slug })) } });
    const spell = (duration) => ({ type: "spell", system: { duration: { value: duration } } });
    const minute = { unit: "minutes", value: 1 };
    check("SF-27a Long Now: a 1-minute Duration line lasts 10 minutes",
        longNow({ duration: minute }, { item: spell("1 minute"), originActor: caster("long-now") }), { unit: "minutes", value: 10 });
    check("SF-27b Long Now: not inside a degree of success, not without a Duration line, not without the feat",
        [longNow({ duration: minute, outcomes: ["criticalFailure"] }, { item: spell("1 minute"), originActor: caster("long-now") }).value,
            longNow({ duration: minute }, { item: spell(""), originActor: caster("long-now") }).value,
            longNow({ duration: minute }, { item: spell("1 minute"), originActor: caster() }).value], [1, 1, 1]);

    const { SkyTracker } = await import("../scripts/sky/tracker.mjs");
    const rolled = SkyTracker.rollDay();
    check("SF-32d, SF-35c: every day is rolled with a second sky and a private aspect",
        [typeof rolled.second?.sign, typeof rolled.second?.aspect, typeof rolled.privateAspect, SkyTracker.withExtras(rolled) === rolled,
            Boolean(SkyTracker.withExtras({ sign: "leo", aspect: "none" }).second)], ["string", "string", "string", true, true]);

    const { ownSignRules } = await import("../scripts/sky/tracker.mjs");
    const benefic = JSON.parse((await import("node:fs")).readFileSync(new URL("../content/saint-effects/sky-aspect/sky-benefic.json", import.meta.url), "utf8")).system.rules;
    const leo = ownSignRules(benefic, "leo");
    check("SF-35b, SF-32c: a sky effect keeps only its own sign's rules, so two skies do not light each other's domains",
        [leo.length > 0, leo.every((r) => JSON.stringify(r.predicate ?? []).includes('"sky:sign:leo"')), ownSignRules(benefic, "starless").length], [true, true, 0]);

    const { wornAspect } = await import("../scripts/sky/terrain-rolls.mjs");
    const effect = (name, sign) => ({ getFlag: (_m, k) => ({ skyEffect: true, skyName: name, skySign: sign })[k], name });
    const wearer = { itemTypes: { effect: [effect("Sky: Benefic", "leo"), effect("Sky: Malefic", "libra")] } };
    check("SF-32, SF-35: Libra and Aries read the sign a creature wears, not only the day's",
        [wornAspect(wearer, "libra"), wornAspect(wearer, "leo"), wornAspect(wearer, "aries")], ["malefic", "benefic", null]);
}

/* -------------------------------------------------------------------------------------------- */
/*  Phase 7a: the rewinds                                                                       */
/* -------------------------------------------------------------------------------------------- */

{
    const fs = await import("node:fs");
    const read = (rel) => JSON.parse(fs.readFileSync(new URL(`../content/${rel}`, import.meta.url), "utf8"));
    const unmake = read("stargazer-class-features/actions/unmake-the-moment.json").system;
    const rewrite = read("stargazer-class-features/actions/rewrite-the-ending.json").system;
    check("SG-41a/b, SG-46a/b: two free actions with prediction, once a day and once a week, at 11th and 19th",
        [unmake.actionType.value, unmake.traits.value.includes("prediction"), unmake.frequency.per, unmake.level.value,
            rewrite.actionType.value, rewrite.traits.value.includes("prediction"), rewrite.frequency.per, rewrite.level.value],
        ["free", true, "day", 11, "free", true, "P1W", 19]);
    const items = read("stargazer-class/stargazer.json").system.items;
    check("the class grants both", [items.unmak?.level, items.rwrte?.level], [11, 19]);
    const dark = read("stargazer-effects/effect-star-chart-dark.json").system.rules[0];
    check("SG-46h a dark chart holds no Focus Points", [dark.path, dark.value, dark.priority > 30], ["system.resources.focus.cap", 0, true]);

    const { previousShot, rewriteCooldown, unmakeUses } = await import("../scripts/stargazer/rewind.mjs");
    const shots = [{ round: 3, turn: 2 }, { round: 4, turn: 2 }];
    check("SG-41d Unmake goes back to the start of your last turn, not the one beginning now",
        [previousShot(shots, { now: { round: 4, turn: 2 } }), previousShot(shots, { now: { round: 5, turn: 2 } }), previousShot([{ round: 4, turn: 2 }], { now: { round: 4, turn: 2 } })],
        [{ round: 3, turn: 2 }, { round: 4, turn: 2 }, null]);
    check("BT-04a The Long Way Round: another creature's last turn, earlier this round",
        previousShot([{ round: 4, turn: 0 }], { now: { round: 4, turn: 2 } }), { round: 4, turn: 0 });
    const sg = (...slugs) => ({ itemTypes: { feat: slugs.map((slug) => ({ slug })) } });
    check("BT-03a Unmade Again: twice per day", [unmakeUses(sg()), unmakeUses(sg("unmade-again"))], [1, 2]);
    check("SG-46j, SF-36: seven dawns; three with The Long Vigil when the last use was in an earlier adventure",
        [rewriteCooldown({ longVigil: false, lastAdventure: "a", adventure: "b" }), rewriteCooldown({ longVigil: true, lastAdventure: "a", adventure: "b" }),
            rewriteCooldown({ longVigil: true, lastAdventure: "b", adventure: "b" })], [7, 3, 7]);
}

/* -------------------------------------------------------------------------------------------- */

if (failures.length > 0) {
    console.error(`Stargazer tests failed: ${failures.length} of ${checks}.`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
}
console.log(`Stargazer tests passed: ${checks} checks.`);

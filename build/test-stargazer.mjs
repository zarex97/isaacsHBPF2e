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

if (failures.length > 0) {
    console.error(`Stargazer tests failed: ${failures.length} of ${checks}.`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
}
console.log(`Stargazer tests passed: ${checks} checks.`);

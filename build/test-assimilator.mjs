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
const at = (slug, depth) => `assimilator:substrate:${slug}:${depth}`;
const tag = (substrate, depth) => ({ [FLAG]: { assimilator: { substrate, depth } } });

/** A Ruby written the way programme §7.2 says, with the vocabulary the validator holds it to. */
function ruby(overrides = {}) {
    return {
        name: "Substrate: Ruby",
        type: "effect",
        flags: { [FLAG]: { assimilator: { substrate: { slug: "ruby", colour: "red", kind: "gem" } } } },
        system: {
            rules: overrides.rules ?? [
                { key: "RollOption", domain: "all", option: "assimilator:furnace-light", predicate: [at("ruby", 1)] },
                { key: "DamageDice", selector: "unarmed-damage", slug: "substrate-ruby", damageType: "fire",
                    diceNumber: 1, dieSize: "d4", flags: tag("ruby", 2),
                    predicate: [at("ruby", 2), { not: at("ruby", 3) }] },
                { key: "DamageDice", selector: "unarmed-damage", slug: "substrate-ruby", damageType: "fire",
                    diceNumber: 1, dieSize: "d6", flags: tag("ruby", 3),
                    predicate: [at("ruby", 3), { not: at("ruby", 4) }, "carapace:intact"] },
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

check("the same Substrate twice is refused", errorsFor({ substrates: [ruby(), ruby()] }), [
    'Substrate "ruby" is declared twice',
]);

{
    const doc = ruby();
    doc.system.rules.pop();
    check("a missing rung is Depth 4 doing nothing", errorsFor({ substrates: [doc] }), [
        'no rule requires "assimilator:substrate:ruby:4" — Depth 4 would do nothing',
    ]);
}

{
    const doc = ruby();
    doc.system.rules[2].predicate = [at("ruby", 3), { not: at("ruby", 4) }];
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
        'rule 1 (DamageDice): slug must be "substrate-ruby" so an Instinct can find it in the modifier list',
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
        'rule 4 (RollOption): predicates on another Substrate\'s Depth ("assimilator:substrate:iron:2") — a Substrate reads only its own',
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
    const feat = (rules) => ({ name: "Apex Predator", system: { slug: "apex-predator", rules } });
    check("a declared non-stacking pair with no refusal is caught", errorsFor({ feats: [feat([])] }), [
        'the guide says this does not stack; some rule must predicate { not: "assimilator:instinct:gold" }',
    ]);
    check("…and passes once the predicate refuses it", errorsFor({
        feats: [feat([{ key: "RollOption", domain: "all", option: "x", predicate: [{ not: "assimilator:instinct:gold" }] }])],
    }), []);
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

if (failures.length > 0) {
    console.error(`Assimilator tests failed: ${failures.length} of ${checks}.`);
    for (const failure of failures) console.error(`  - ${failure}`);
    process.exit(1);
}
console.log(`Assimilator tests passed: ${checks} checks.`);

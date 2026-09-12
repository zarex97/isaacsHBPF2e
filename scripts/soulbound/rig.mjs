/**
 * Soulbound test rig — build a character, level it, and assert at each checkpoint.
 *
 * Two guards here are not optional, and both were learned the expensive way in earlier live sessions:
 *
 *  1. A ChoiceSet opens a PickAThingPrompt that BLOCKS every await on item creation and levelling. From a
 *     scripted driver this surfaces as a protocol timeout, not as a dialog, and the hour goes into
 *     debugging the wrong thing. The resolver below closes them — and never default-picks a Spirit,
 *     because a wrong default silently tests the wrong subclass while every number still looks plausible.
 *
 *  2. An actor created by a GM defaults to alliance "opposition". Area targeting with affects:"enemies"
 *     then catches nothing AND silently clears targets set by hand, which reads as the ability being
 *     broken rather than the test actor being on the wrong side.
 *
 * Run it from the console, or from the `Soulbound: Test Rig` macro:
 *   await game.modules.get("isaacs-hb-pf2e").api.rig.run({ profile: "Spirit Weapon (Blade)" });
 */

import { fullReleaseShape } from "./release.mjs";

const MODULE_ID = "isaacs-hb-pf2e";
const CHECKPOINTS = [1, 5, 9, 11, 13, 17, 20];

/* -------------------------------------------------------------------------------------------- */

const promptProblems = [];

function installPromptResolver(choose) {
    return setInterval(() => {
        for (const app of foundry.applications.instances.values()) {
            if (app.constructor.name !== "PickAThingPrompt") continue;

            // An empty ChoiceSet cannot be answered by anyone, ever: the dialog has no buttons and the
            // await behind it never returns, which from a scripted driver reads as a protocol timeout
            // rather than as a broken filter. Close it and record WHY, so the run reports a fault
            // instead of hanging. This is how the spirit-weapon filter's missing itemType was found —
            // pf2e's queryCompendium defaults itemType to "feat", and the profiles are weapons.
            if ((app.choices ?? []).length === 0) {
                promptProblems.push(`empty ChoiceSet: "${app.prompt ?? app.item?.name ?? "unnamed"}" offered no choices`);
                app.close();
                continue;
            }

            const picked = choose(app);
            // undefined means "I do not know what this is" — leave it open rather than guess.
            if (picked === undefined) continue;
            app.selection = picked;
            app.close();
        }
    }, 100);
}

/** Pick a named spirit-weapon profile; refuse to guess at anything else. */
function chooserFor({ profile }) {
    return (app) => {
        const choices = app.choices ?? [];
        const wanted = choices.find((c) => c.label === profile || c.value === profile);
        if (wanted) return wanted;
        const isProfile = choices.some((c) => String(c.value ?? "").includes("soulbound-equipment"));
        if (isProfile && choices.length > 0) return choices[0];
        return undefined;
    };
}

/* -------------------------------------------------------------------------------------------- */

const results = [];
let current = null;

function at(level) {
    current = { level, checks: [] };
    results.push(current);
}

function expect(label, actual, expected) {
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    current.checks.push({ label, pass: a === e, actual: a, expected: e });
}

/* -------------------------------------------------------------------------------------------- */

async function build(name, profile) {
    const existing = game.actors.getName(name);
    if (existing) await existing.delete();

    const actor = await Actor.create({ name, type: "character" });
    // Guard 2. Without this every enemies-only area catches nothing and clears hand-set targets.
    await actor.update({ "system.details.alliance": "party" });

    const pack = game.packs.get(`${MODULE_ID}.soulbound-class`);
    const entry = (await pack.getIndex()).find((e) => e.name === "Soulbound");
    const cls = await pack.getDocument(entry._id);
    // deepClone: toObject() returns the rules array BY REFERENCE on a compendium document, and editing it
    // poisons the cached pack for the rest of the session.
    await actor.createEmbeddedDocuments("Item", [foundry.utils.deepClone(cls.toObject())]);

    await actor.update({ "system.build.attributes.boosts.1": ["str"] });
    return actor;
}

function rankOf(actor, path) {
    return foundry.utils.getProperty(actor, path)?.rank ?? foundry.utils.getProperty(actor, path) ?? null;
}

function hasFeature(actor, name) {
    return actor.itemTypes.feat.some((f) => f.name === name) || actor.itemTypes.action?.some((a) => a.name === name);
}

/* -------------------------------------------------------------------------------------------- */

async function assertAt(actor, level) {
    at(level);
    const sys = actor.system;

    if (level === 1) {
        expect("Reiatsu DC is trained", sys.proficiencies?.classDCs?.soulbound?.rank, 1);
        expect("Fortitude and Reflex expert, Will trained",
            [sys.saves.fortitude.rank, sys.saves.reflex.rank, sys.saves.will.rank], [2, 2, 1]);
        expect("light armour and unarmoured trained, medium untrained",
            [sys.proficiencies.defenses.light.rank, sys.proficiencies.defenses.unarmored.rank,
             sys.proficiencies.defenses.medium.rank], [1, 1, 0]);
        expect("simple, martial and unarmed trained",
            [sys.proficiencies.attacks.simple.rank, sys.proficiencies.attacks.martial.rank,
             sys.proficiencies.attacks.unarmed.rank], [1, 1, 1]);
        // pf2e derives focus.max from the focus effects known and clamps it to `cap`. Phase 1 has no
        // Techniques, so max is legitimately 0; the ceiling is what the class feature actually sets.
        expect("the reiatsu ceiling is 1", sys.resources.focus.cap, 1);
        expect("a Reiatsu spellcasting entry exists, and exactly one",
            actor.itemTypes.spellcastingEntry.filter((e) => e.system.proficiency?.slug === "soulbound").length, 1);
        expect("a spirit weapon is on the sheet",
            actor.itemTypes.weapon.some((w) => (w.system.traits?.otherTags ?? []).includes("soulbound-spirit-weapon")), true);
        for (const name of ["Spirit Sense", "Konsō", "Reiatsu", "Rising Pressure", "Released Form", "Spirit Weapon"]) {
            expect(`${name} is on the sheet`, hasFeature(actor, name), true);
        }
        expect("Release is available as an action", hasFeature(actor, "Release"), true);
    }

    if (level === 5) {
        expect("weapons are expert", sys.proficiencies.attacks.martial.rank, 2);
        expect("Perception is expert (Alertness)", sys.perception.rank, 2);
        expect("the reiatsu ceiling is 2", sys.resources.focus.cap, 2);
    }

    if (level === 9) {
        expect("Reiatsu DC is expert, not master", sys.proficiencies?.classDCs?.soulbound?.rank, 2);
        expect("Refined Release is on the sheet", hasFeature(actor, "Refined Release"), true);
    }

    if (level === 11) {
        expect("the reiatsu ceiling is 3", sys.resources.focus.cap, 3);
        expect("Fortitude is master (Juggernaut)", sys.saves.fortitude.rank, 3);
        expect("Greater Flash Step is on the sheet", hasFeature(actor, "Greater Flash Step"), true);
    }

    if (level === 13) {
        expect("weapons are master", sys.proficiencies.attacks.martial.rank, 3);
        expect("light armour and unarmoured are expert (Spirit Weave)",
            [sys.proficiencies.defenses.light.rank, sys.proficiencies.defenses.unarmored.rank], [2, 2]);
        expect("Full Release is on the sheet", hasFeature(actor, "Full Release"), true);
        const full = actor.itemTypes.feat.find((f) => f.name === "Full Release");
        expect("Full Release is once per day", [full?.system.frequency?.max, full?.system.frequency?.per], [1, "day"]);
    }

    if (level === 15) {
        expect("Reflex is master (Evasion)", sys.saves.reflex.rank, 3);
    }

    if (level === 17) {
        expect("Reiatsu DC is master, not legendary", sys.proficiencies?.classDCs?.soulbound?.rank, 3);
        expect("Perfected Full Release is on the sheet", hasFeature(actor, "Perfected Full Release"), true);
        const shape = fullReleaseShape(17);
        expect("and its shape is 2 minutes, 20 feet, no fatigue",
            [shape.minutes, shape.emanation, shape.fatigue], [2, 20, false]);
    }

    if (level === 20) {
        expect("Unsealed is on the sheet", hasFeature(actor, "Unsealed"), true);
        const full = actor.itemTypes.feat.find((f) => f.name === "Full Release");
        expect("Unsealed raises Full Release to twice per day", full?.system.frequency?.max, 2);
        expect("the reiatsu ceiling still stops at 3 — the pool does not grow past 11th", sys.resources.focus.cap, 3);
    }
}

/* -------------------------------------------------------------------------------------------- */

async function run({ profile = "Spirit Weapon (Blade)", name = "ZZ Test — Soulbound", levels = CHECKPOINTS } = {}) {
    results.length = 0;
    promptProblems.length = 0;
    const resolver = installPromptResolver(chooserFor({ profile }));
    try {
        const actor = await build(name, profile);
        for (const level of levels) {
            await actor.update({ "system.details.level.value": level });
            // No explicit prepareData() here. `update` already re-prepares, and calling it a second time
            // throws "Cannot redefine property: system" — pf2e's prepareBaseData installs `system` with
            // Object.defineProperty, which cannot be run twice on the same document.
            await assertAt(actor, level);
        }
    } finally {
        clearInterval(resolver);
    }

    const failed = results.flatMap((r) => r.checks.filter((c) => !c.pass).map((c) => ({ level: r.level, ...c })));
    const total = results.reduce((n, r) => n + r.checks.length, 0);
    console.log(`Soulbound rig: ${total - failed.length}/${total} checks passed.`);
    for (const f of failed) console.warn(`  L${f.level} ${f.label}\n    expected ${f.expected}\n    got      ${f.actual}`);
    for (const p of promptProblems) console.warn(`  prompt: ${p}`);
    return { total, failed, promptProblems: [...promptProblems], results };
}

export const SoulboundRig = { run, CHECKPOINTS };

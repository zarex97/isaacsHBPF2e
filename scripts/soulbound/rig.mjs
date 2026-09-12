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

/**
 * A resolver that outlives one call.
 *
 * `run()` used to install its own and clear it in a `finally`. That is correct when `run()` finishes —
 * and wrong when the caller is a scripted driver whose protocol call times out, because the abandoned
 * promise means the `finally` never fires, the interval dies, and the next prompt sits on screen
 * blocking every subsequent await. From the driver that looks like the content hanging.
 *
 * So the resolver is installable separately and, when one is already standing, `run()` leaves it alone.
 */
let standingResolver = null;

export function installResolver(names = []) {
    clearResolver();
    standingResolver = installPromptResolver(chooserFor({
        profile: names.find((n) => n.startsWith("Spirit Weapon")),
        lineage: names.find((n) => ["Soul Reaper", "Hollow", "Quincy"].includes(n)),
        spirit: names.find((n) => !n.startsWith("Spirit Weapon")
            && !["Soul Reaper", "Hollow", "Quincy"].includes(n)),
    }));
    return standingResolver;
}

export function clearResolver() {
    if (standingResolver) clearInterval(standingResolver);
    standingResolver = null;
}

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
function chooserFor({ profile, lineage, spirit, kido = [] }) {
    const picked = [];
    return (app) => {
        const choices = app.choices ?? [];
        const byName = (name) => choices.find((c) => c.label === name || c.value === name);

        // The spirit-weapon profile, by name.
        const wantedProfile = profile ? byName(profile) : null;
        if (wantedProfile) return wantedProfile;

        // The Lineage, by name.
        const wantedLineage = lineage ? byName(lineage) : null;
        if (wantedLineage) return wantedLineage;

        // The Spirit, by name. Never defaulted: a wrong Spirit silently tests the wrong ladder while
        // every number still looks plausible.
        const wantedSpirit = spirit ? byName(spirit) : null;
        if (wantedSpirit) return wantedSpirit;

        const looksLike = (fragment) => choices.some((c) => String(c.value ?? "").includes(fragment));

        // A kido ChoiceSet: take the named ones in order, then anything not already taken, so six
        // prompts never resolve to the same spell six times.
        if (looksLike("soulbound-kido")) {
            const wanted = kido.map(byName).filter(Boolean).find((c) => !picked.includes(c.value));
            const choice = wanted ?? choices.find((c) => !picked.includes(c.value));
            if (choice) {
                picked.push(choice.value);
                return choice;
            }
        }

        if (looksLike("soulbound-equipment") && choices.length > 0) return choices[0];
        if (looksLike("soulbound-class-features") && lineage === undefined && choices.length > 0) {
            return choices[0];
        }
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

async function assertAt(actor, level, lineage, spirit) {
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

    /* --- per-Lineage, guide §5 ------------------------------------------------------------------ */

    const knows = (name) => actor.itemTypes.spell.some((sp) => sp.name.startsWith(name));
    // Count kido by their tier tag, not "every non-cantrip focus spell": a Spirit's Release Technique is
    // also a costed focus effect, and counting it as a kido made every Soul Reaper look one over its
    // ceiling the moment Spirits existed.
    const costedKido = () => actor.itemTypes.spell.filter(
        (sp) => (sp.system.traits.otherTags ?? []).includes("sb-tier-kido")
            && !sp.traits.has("cantrip"),
    ).length;
    const skillRank = (slug) => actor.system.skills?.[slug]?.rank ?? 0;

    if (lineage === "Soul Reaper") {
        if (level === 1) {
            expect("Society is trained", skillRank("society"), 1);
            expect("Shō is known and free", knows("Shō"), true);
            expect("two chosen kidō at 1st", costedKido(), 2);
        }
        if (level === 5) expect("a third kidō at 5th", costedKido(), 3);
        if (level === 9) expect("a fourth kidō at 9th", costedKido(), 4);
        if (level === 17) expect("six chosen kidō by 17th — the ceiling guide §6.6 names", costedKido(), 6);
    }

    if (lineage === "Hollow") {
        if (level === 1) {
            expect("Athletics is trained", skillRank("athletics"), 1);
            expect("Bala and Cero are known, and no other kidō", [knows("Bala"), knows("Cero"), costedKido()], [true, true, 1]);
            expect("Hierro resists physical at half level, minimum 1", actor.system.attributes.resistances?.find?.((r) => r.type === "physical")?.value ?? null, 1);
        }
        if (level === 11) expect("Hierro at 11th is half of 11, rounded down", actor.system.attributes.resistances?.find?.((r) => r.type === "physical")?.value ?? null, 5);
        // pf2e's FastHealing writes NOTHING to the sheet: it fires at turn-start and posts a healing
        // roll. So the rule element itself is what there is to check, and its resolved value is the
        // number that will actually be healed.
        const fastHealing = (lvl) => {
            const feature = actor.itemTypes.feat.find((f) => f.name === "Regeneración");
            const rule = feature?.rules?.find((r) => r.key === "FastHealing");
            return rule && !rule.ignored ? Number(rule.resolveValue(rule.value)) : null;
        };
        if (level === 5) expect("Regeneración heals 2 at 5th", fastHealing(5), 2);
        if (level === 11) expect("Regeneración heals 4 at 11th", fastHealing(11), 4);
    }

    if (lineage === "Quincy") {
        if (level === 1) {
            expect("Crafting is trained", skillRank("crafting"), 1);
            expect("Heizen and Gritz are known, and no other kidō", [knows("Heizen"), knows("Gritz"), costedKido()], [true, true, 1]);
            expect("Blut is available as a free action", hasFeature(actor, "Blut"), true);
        }
        if (level === 5) expect("Seal the Art arrives at 5th", hasFeature(actor, "Seal the Art"), true);
        if (level === 15) expect("Sklaverei arrives at 15th", hasFeature(actor, "Sklaverei"), true);
    }

    /* --- per-Spirit, guide §7 -------------------------------------------------------------------- */

    if (spirit) {
        const has = (name) => actor.itemTypes.feat.some((f) => f.name === name)
            || actor.itemTypes.spell.some((sp) => sp.name === name);

        if (level === 1) {
            expect(`${spirit} is on the sheet`, has(spirit), true);
            expect("its Release Technique is known and costed", actor.itemTypes.spell
                .some((sp) => (sp.system.traits.otherTags ?? []).includes("sb-tier-release")), true);
            // The first proof that Phase 1's pool decision holds end to end: a Release Technique is a
            // costed focus effect, so from 1st level the pool is no longer zero.
            expect("and the reiatsu pool is finally non-zero", actor.system.resources.focus.max, 1);
        }
        if (level === 13) {
            expect("the Full Release rung has arrived", actor.itemTypes.feat
                .some((f) => f.system.level?.value === 13 && f.name !== "Full Release"
                    && f.name !== "Weapon Mastery" && f.name !== "Spirit Weave"), true);
        }
    }

    if (level === 20) {
        expect("Unsealed is on the sheet", hasFeature(actor, "Unsealed"), true);
        const full = actor.itemTypes.feat.find((f) => f.name === "Full Release");
        expect("Unsealed raises Full Release to twice per day", full?.system.frequency?.max, 2);
        expect("the reiatsu ceiling still stops at 3 — the pool does not grow past 11th", sys.resources.focus.cap, 3);
    }
}

/* -------------------------------------------------------------------------------------------- */

async function run({ profile = "Spirit Weapon (Blade)", lineage = "Soul Reaper", spirit = null, kido = [],
                    name = null, levels = CHECKPOINTS } = {}) {
    name ??= `ZZ Test — ${spirit ?? lineage}`;
    results.length = 0;
    promptProblems.length = 0;
    // Reuse a standing resolver if one was installed; only own one when nobody else does.
    const owned = standingResolver ? null : installPromptResolver(chooserFor({ profile, lineage, spirit, kido }));
    try {
        const actor = await build(name, profile);
        current = null;
        for (const level of levels) {
            await actor.update({ "system.details.level.value": level });
            // No explicit prepareData() here. `update` already re-prepares, and calling it a second time
            // throws "Cannot redefine property: system" — pf2e's prepareBaseData installs `system` with
            // Object.defineProperty, which cannot be run twice on the same document.
            await assertAt(actor, level, lineage, spirit);
        }
    } finally {
        if (owned) clearInterval(owned);
    }

    const failed = results.flatMap((r) => r.checks.filter((c) => !c.pass).map((c) => ({ level: r.level, ...c })));
    const total = results.reduce((n, r) => n + r.checks.length, 0);
    console.log(`Soulbound rig: ${total - failed.length}/${total} checks passed.`);
    for (const f of failed) console.warn(`  L${f.level} ${f.label}\n    expected ${f.expected}\n    got      ${f.actual}`);
    for (const p of promptProblems) console.warn(`  prompt: ${p}`);
    return { total, failed, promptProblems: [...promptProblems], results };
}

export const SoulboundRig = { run, installResolver, clearResolver, CHECKPOINTS };

/**
 * Soulbound invariants, driven through the real validator against synthetic packs.
 *
 * The point of the synthetic packs is the negative case: proving that a Soulbound spell is NOT held to
 * the Saint's `cosmo`/`technique-slot` rules is impossible to show from shipped content, because the
 * absence of an error looks the same as the absence of a document.
 */
import { check, report } from "./lib/check.mjs";
import { familyOf, validate } from "./lib/validate-lib.mjs";

/** A minimal, otherwise-valid spell document, so only the family-specific rules can fail. */
function spellDoc({ traits, otherTags = [], rank = 1 }) {
    return {
        name: "Test Technique",
        type: "spell",
        img: "icons/svg/explosion.svg",
        system: {
            description: { value: "<p>Test.</p>" },
            publication: { license: "ORC", remaster: true, title: "Isaac's Homebrew: The Soulbound" },
            level: { value: rank },
            traits: { rarity: "common", value: traits, otherTags, traditions: [] },
            damage: {},
        },
    };
}

function runValidate(packName, doc) {
    const errors = [];
    validate(
        [{ def: { name: packName, type: "Item" }, docs: [{ file: `content/${packName}/x.json`, doc }] }],
        { errors },
    );
    // Reachability is a whole-module question — "does anything grant this" — and a one-document
    // synthetic pack can never answer it. These fixtures exist to test the FAMILY rules, so the
    // cross-document checks are dropped here and proved against the real packs by `npm run validate`.
    return errors.filter((e) => !/nothing grants the/.test(e));
}

check(
    "familyOf reads the pack prefix",
    [familyOf("saint-techniques"), familyOf("soulbound-kido"), familyOf("other")],
    ["saint", "soulbound", null],
);

const soulboundSpell = spellDoc({
    traits: ["focus", "reiatsu", "soulbound", "concentrate"],
    otherTags: ["soulbound-technique", "sb-tier-release"],
});
check(
    "a Soulbound Technique is not held to the Saint's cosmo trait or technique-slot tag",
    runValidate("soulbound-techniques", soulboundSpell),
    [],
);

check(
    "a Soulbound Technique without the reiatsu trait is refused",
    runValidate("soulbound-techniques", spellDoc({
        traits: ["focus", "soulbound"],
        otherTags: ["soulbound-technique", "sb-tier-release"],
    })).length > 0,
    true,
);

check(
    "a Release Technique authored at the wrong base rank is refused (guide §7: Release = 1)",
    runValidate("soulbound-techniques", spellDoc({
        traits: ["focus", "reiatsu", "soulbound"],
        otherTags: ["soulbound-technique", "sb-tier-release"],
        rank: 3,
    })).length > 0,
    true,
);

check(
    "the Saint's own rules still apply to a Saint pack",
    runValidate("saint-techniques", spellDoc({ traits: ["focus", "reiatsu", "soulbound"] })).length > 0,
    true,
);

/* ---------------------------------------------------------------------------------------------- */
/*  The shared engine, made class-general                                                           */
/* ---------------------------------------------------------------------------------------------- */

const { classSlugOf, classStatisticOf } = await import("../scripts/lib/class-dc.mjs");

/** An actor stub carrying one class DC, the way pf2e exposes it. */
function actorWith(slug, dc) {
    return {
        class: { system: { slug } },
        classDCs: { [slug]: { dc: { value: dc } } },
        getStatistic(wanted) {
            return wanted === slug ? { dc: { value: dc } } : null;
        },
    };
}

const saintActor = actorWith("saint", 31);
const soulboundActor = actorWith("soulbound", 28);

check(
    "the class slug comes off the actor's own class",
    [classSlugOf(saintActor), classSlugOf(soulboundActor), classSlugOf(null)],
    ["saint", "soulbound", null],
);
check("an explicit slug wins over the actor's class", classStatisticOf(saintActor, "saint")?.dc?.value, 31);
check("with no slug given, the actor's own class answers", classStatisticOf(soulboundActor)?.dc?.value, 28);
check("a class the actor does not have resolves to nothing", classStatisticOf(saintActor, "soulbound"), null);

const { isTechnique } = await import("../scripts/targeting/config.mjs");

function spellItem(traits) {
    return { type: "spell", system: { traits: { value: traits } } };
}
check(
    "area targeting recognises both classes' focus effects and nothing else",
    [
        isTechnique(spellItem(["cosmo"])),
        isTechnique(spellItem(["reiatsu"])),
        isTechnique(spellItem(["focus"])),
        isTechnique({ type: "action", system: { traits: { value: ["reiatsu"] } } }),
    ],
    [true, true, false, false],
);

/* ---------------------------------------------------------------------------------------------- */
/*  The class item                                                                                  */
/* ---------------------------------------------------------------------------------------------- */

const fs = await import("node:fs");
const path = await import("node:path");
const { ROOT } = await import("./lib/pack.mjs");

function contentDoc(relative) {
    return JSON.parse(fs.readFileSync(path.join(ROOT, "content", relative), "utf8"));
}

const cs = contentDoc("soulbound-class/soulbound.json").system;

check("10 HP, and the key attribute is Strength or Dexterity (guide §1.2)", [cs.hp, [...cs.keyAbility.value].sort()], [10, ["dex", "str"]]);
check("Fortitude and Reflex expert, Will trained (guide §3.1)", cs.savingThrows, { fortitude: 2, reflex: 2, will: 1 });
check("Perception trained; Expertise arrives at 5th as a feature, not here", cs.perception, 1);
check("simple, martial and unarmed trained; no advanced (guide §3.1)", [cs.attacks.simple, cs.attacks.martial, cs.attacks.unarmed, cs.attacks.advanced], [1, 1, 1, 0]);
check("light armour and unarmoured only — medium is the line this class does not cross (guide §3.1)", [cs.defenses.light, cs.defenses.unarmored, cs.defenses.medium, cs.defenses.heavy], [1, 1, 0, 0]);
check("Religion, plus 3 + Int (the Lineage skill and Spirit Lore are granted by features)", [cs.trainedSkills.value, cs.trainedSkills.additional], [["religion"], 3]);
check("eleven class feats, on the even levels plus 1st (guide §3.2)", cs.classFeatLevels.value, [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
check("general feats on the standard PF2e levels", cs.generalFeatLevels.value, [3, 7, 11, 15, 19]);
check("ancestry feats on the standard PF2e levels", cs.ancestryFeatLevels.value, [1, 5, 9, 13, 17]);
check("skill increases on every odd level from 3rd", cs.skillIncreaseLevels.value, [3, 5, 7, 9, 11, 13, 15, 17, 19]);
check("the class slug keys the Reiatsu DC", cs.slug, "soulbound");

/* ---------------------------------------------------------------------------------------------- */
/*  The spirit weapon                                                                               */
/* ---------------------------------------------------------------------------------------------- */

const blade = contentDoc("soulbound-equipment/blade.json");
check(
    "Blade: 1d8 slashing, versatile P, two-hand d10 (guide §4.1)",
    [blade.system.damage.die, blade.system.damage.damageType, [...blade.system.traits.value].sort()],
    ["d8", "slashing", ["two-hand-d10", "versatile-p", "versatile-spirit"]],
);

const greatBlade = contentDoc("soulbound-equipment/great-blade.json");
// Guide §4.1 says "two-handed, sweep", but pf2e has no `two-handed` trait: a weapon that is only ever
// two-handed says so in `usage`, exactly as its own greatsword does. Correction for guide v1.4.
check(
    "Great Blade: 1d10 slashing, sweep, two-handed expressed in usage as pf2e does it",
    [greatBlade.system.damage.die, greatBlade.system.usage.value, [...greatBlade.system.traits.value].sort()],
    ["d10", "held-in-two-hands", ["sweep", "versatile-spirit"]],
);

const paired = contentDoc("soulbound-equipment/paired-blades.json");
check(
    "Paired Blades: 1d6 slashing, agile, finesse, twin (guide §4.1)",
    [paired.system.damage.die, [...paired.system.traits.value].sort()],
    ["d6", ["agile", "finesse", "twin", "versatile-spirit"]],
);

const bow = contentDoc("soulbound-equipment/spirit-bow.json");
check(
    "Spirit Bow: 1d8 piercing, propulsive, range 60, reload 0 (guide §4.1)",
    [bow.system.damage.die, bow.system.damage.damageType, bow.system.range, bow.system.reload.value],
    ["d8", "piercing", 60, "0"],
);

/**
 * Spirit-Cutting shipped as a paragraph.
 *
 * Guide §4.1 says a spirit weapon's "Strikes can deal **spirit** damage instead of their normal damage
 * type", and four Shikai entries repeat the promise as "(you may still choose spirit)". Every profile
 * carried `rules: []` and said it only in its description, so no Soulbound could ever choose it — and
 * in Shikai an unconditional damage-type override would have won anyway. `versatile-spirit` is the
 * system's own answer and is what the strike UI offers the choice through.
 */
for (const name of ["blade", "great-blade", "paired-blades", "spirit-bow"]) {
    const doc = contentDoc(`soulbound-equipment/${name}.json`);
    check(
        `${name}: Spirit-Cutting is a trait, not a paragraph`,
        doc.system.traits.value.includes("versatile-spirit"),
        true,
    );
}

for (const name of ["blade", "great-blade", "paired-blades", "spirit-bow"]) {
    const doc = contentDoc(`soulbound-equipment/${name}.json`);
    const tags = doc.system.traits.otherTags ?? [];
    check(`${name}: a martial weapon the class is always proficient with`, doc.system.category, "martial");
    check(`${name}: tagged for the ChoiceSet and for weaponOf`, [
        tags.includes("soulbound-weapon-profile"),
        tags.includes("soulbound-spirit-weapon"),
    ], [true, true]);
}

const { SpiritWeapon } = await import("../scripts/soulbound/weapon.mjs");

/** An actor stub holding one tagged weapon and one ordinary one. */
const armed = {
    type: "character",
    class: { system: { slug: "soulbound" } },
    itemTypes: {
        weapon: [
            { id: "w1", system: { traits: { otherTags: ["mundane"] } } },
            { id: "w2", system: { traits: { otherTags: ["soulbound-spirit-weapon"] } } },
        ],
    },
};
check("weaponOf finds the spirit weapon by its tag, not by position", SpiritWeapon.weaponOf(armed)?.id, "w2");
check("a Saint has no spirit weapon to find", SpiritWeapon.weaponOf({ ...armed, class: { system: { slug: "saint" } } }), null);
check(
    "dismissed, there is nothing to find and that is not an error",
    SpiritWeapon.weaponOf({ ...armed, itemTypes: { weapon: [] } }),
    null,
);

/* ---------------------------------------------------------------------------------------------- */
/*  The Reiatsu pool                                                                                */
/* ---------------------------------------------------------------------------------------------- */

const { Reiatsu } = await import("../scripts/soulbound/reiatsu.mjs");

check(
    "a reiatsu-trait spell is recognised; a cosmo one is not",
    [
        Reiatsu.isReiatsuEffect({ type: "spell", system: { traits: { value: ["focus", "reiatsu"] } } }),
        Reiatsu.isReiatsuEffect({ type: "spell", system: { traits: { value: ["focus", "cosmo"] } } }),
        Reiatsu.isReiatsuEffect({ type: "action", system: { traits: { value: ["reiatsu"] } } }),
    ],
    [true, false, false],
);

check(
    "the entry is found by its proficiency slug, not by its name",
    Reiatsu.entryFor({
        itemTypes: { spellcastingEntry: [{ id: "e9", name: "Renamed By A Player", system: { proficiency: { slug: "soulbound" } } }] },
    })?.id,
    "e9",
);

/** Three concurrent callers, one actor, one entry — the bug that gave every Saint two Cosmo entries. */
{
    let created = 0;
    const actor = {
        id: "a1",
        type: "character",
        class: { system: { slug: "soulbound" } },
        itemTypes: { spellcastingEntry: [] },
        classDCs: { soulbound: { attribute: "str" } },
        async createEmbeddedDocuments(_type, [data]) {
            created += 1;
            await new Promise((resolve) => setTimeout(resolve, 5));
            const entry = { ...data, id: `e${created}` };
            actor.itemTypes.spellcastingEntry.push(entry);
            return [entry];
        },
    };
    await Promise.all([Reiatsu.ensureEntry(actor), Reiatsu.ensureEntry(actor), Reiatsu.ensureEntry(actor)]);
    check("three concurrent ensureEntry calls create exactly one entry", created, 1);
    check("and it resolves its DC through the Reiatsu DC, not a spellcasting proficiency",
        actor.itemTypes.spellcastingEntry[0].system.proficiency.slug, "soulbound");
    check("and it is a focus pool entry", actor.itemTypes.spellcastingEntry[0].system.prepared.value, "focus");
}

check("a Saint gets no Reiatsu entry", await Reiatsu.ensureEntry({ type: "character", class: { system: { slug: "saint" } } }), null);

/* ---------------------------------------------------------------------------------------------- */
/*  Rising Pressure                                                                                 */
/* ---------------------------------------------------------------------------------------------- */

const { grantFor } = await import("../scripts/soulbound/rising-pressure.mjs");

const base = { current: 0, max: 2, round: 1, roundStamp: null, gained: 0, cap: 2 };

check("the first qualifying event in a round pays a point", grantFor(base), 1);
check("the second in the same round pays nothing", grantFor({ ...base, roundStamp: 1 }), 0);
check("a new round pays again", grantFor({ ...base, roundStamp: 1, round: 2 }), 1);
check("a full pool gains nothing", grantFor({ ...base, current: 2 }), 0);
check("the per-encounter ceiling stops the refill even with room in the pool (guide §1.3)", grantFor({ ...base, gained: 2 }), 0);
check("one short of the ceiling still pays", grantFor({ ...base, gained: 1 }), 1);
check("Reiatsu Flood raises the ceiling by 1 and nothing else", grantFor({ ...base, gained: 2, cap: 3 }), 1);
check("out of combat there is no round, and so no refill", grantFor({ ...base, round: null }), 0);
check("a 1st-level pool of 1 pays once per encounter and no more", [
    grantFor({ current: 0, max: 1, round: 1, roundStamp: null, gained: 0, cap: 1 }),
    grantFor({ current: 0, max: 1, round: 2, roundStamp: 1, gained: 1, cap: 1 }),
], [1, 0]);

/* ---------------------------------------------------------------------------------------------- */
/*  The standalone chassis features                                                                 */
/* ---------------------------------------------------------------------------------------------- */

function featureDoc(name) {
    return contentDoc(`soulbound-class-features/core/${name}.json`);
}

const flashStep = featureDoc("flash-step");
check(
    "Flash Step is one action, once per round (guide §4.5)",
    [flashStep.system.actions.value, flashStep.system.frequency],
    [1, { max: 1, per: "round", value: 1 }],
);
check("Flash Step is a move and reiatsu effect", [...flashStep.system.traits.value].sort(), ["move", "reiatsu", "soulbound"]);

const spiritSense = featureDoc("spirit-sense");
const sense = spiritSense.system.rules.find((r) => r.key === "Sense");
check(
    "Spirit Sense is pf2e's own spiritsense, imprecise, at 60 feet (guide §4.3)",
    [sense?.selector, sense?.acuity, sense?.range],
    ["spiritsense", "imprecise", 60],
);

const departed = featureDoc("departed-flesh");
check(
    "Departed Flesh: disease immunity, and a poison success becomes a critical success (guide §4.6)",
    [
        departed.system.rules.some((r) => r.key === "Immunity" && r.type === "disease"),
        departed.system.rules.some((r) => r.key === "AdjustDegreeOfSuccess" && r.adjustment.success === "one-degree-better"),
    ],
    [true, true],
);

check("Konsō is a 10-minute exploration activity, not a combat action", [
    featureDoc("konso").system.traits.value.includes("exploration"),
    featureDoc("konso").system.actions.value,
], [true, null]);

/* ---------------------------------------------------------------------------------------------- */
/*  The release ladder                                                                              */
/* ---------------------------------------------------------------------------------------------- */

const { fullReleaseShape, Release } = await import("../scripts/soulbound/release.mjs");

check("13th: one minute, 15-foot emanation, fatigued after, once a day (guide §4.8)", fullReleaseShape(13), { minutes: 1, emanation: 15, fatigue: true, usesPerDay: 1 });
check("16th: unchanged — Perfected arrives at 17th, not before", fullReleaseShape(16), { minutes: 1, emanation: 15, fatigue: true, usesPerDay: 1 });
check("17th, Perfected: two minutes, 20 feet, no fatigue", fullReleaseShape(17), { minutes: 2, emanation: 20, fatigue: false, usesPerDay: 1 });
check("19th, Unsealed: twice a day, keeping Perfected's shape", fullReleaseShape(19), { minutes: 2, emanation: 20, fatigue: false, usesPerDay: 2 });
check("below 13th there is no Full Release at all", fullReleaseShape(12), { minutes: 0, emanation: 0, fatigue: false, usesPerDay: 0 });

check("an actor with no flag is sealed", Release.stateOf({ getFlag: () => undefined }), "sealed");
check("the state is read from the module's own flag", Release.stateOf({ getFlag: () => "full" }), "full");
check("a non-Soulbound has no release state to read", Release.stateOf(null), "sealed");

const fullReleaseFeature = featureDoc("full-release");
check(
    "Full Release is a two-action activity, once per day (guide §4.8)",
    [fullReleaseFeature.system.actions.value, fullReleaseFeature.system.frequency],
    [2, { max: 1, per: "day", value: 1 }],
);

const releaseAction = featureDoc("released-form");
check("Released Form grants the Release action and is not itself one", releaseAction.system.actionType.value, "passive");

const pressure = contentDoc("soulbound-effects/effect-full-release.json");
const emanation = pressure.flags["isaacs-hb-pf2e"].riders[0];
// It used to be a `turn-end` **area rider**, which fires when the CASTER's turn ends and sweeps whoever
// is standing there then. The guide says "an enemy that ends ITS turn in the emanation" — a per-creature
// trigger — and pf2e has an `Aura` for exactly that. Making it one is also what makes `Twin Pressure`
// expressible: that feat adds "enter" to the events list and nothing else.
const pressureAura = pressure.system.rules.find((r) => r.key === "Aura" && r.slug === "soulbound-pressure");
check(
    "the pressure emanation is a real aura, caught per creature at the end of ITS turn (guide §4.8)",
    [pressureAura?.radius, pressureAura?.effects[0].affects, pressureAura?.effects[0].events],
    [15, "enemies", ["turn-end"]],
);
check(
    "and its save is an aura-tick rider on the Reiatsu DC",
    [emanation.event, emanation.apply.type, emanation.apply.statistic, emanation.apply.dc],
    ["aura-tick", "save", "will", "reiatsu"],
);
check(
    "a creature that succeeds is made immune for 10 minutes rather than asked again",
    contentDoc("soulbound-effects/effect-steeled-against-pressure.json").system.duration,
    { expiry: null, sustained: false, unit: "minutes", value: 10 },
);

/* ---------------------------------------------------------------------------------------------- */
/*  The live test rig                                                                               */
/* ---------------------------------------------------------------------------------------------- */

const rigMacro = contentDoc("soulbound-macros/test-rig.json");
check("the rig macro is a script macro", [rigMacro.type, typeof rigMacro.command], ["script", "string"]);
// The macro is a thin wrapper on purpose: a macro's body only changes when the world is shut down and
// the packs are recompiled, while a module script is re-read on F5. Iterating the rig cost a full
// shutdown-rebuild-relaunch cycle each time until it moved.
check("the macro delegates to the module script rather than carrying the rig", rigMacro.command.includes("api.rig.run"), true);
try {
    // A macro with a syntax error fails silently at the table: no dialog, no console entry a GM sees.
    new Function(rigMacro.command.replace(/\bawait\b/g, ""));
    check("the rig macro parses as JavaScript", true, true);
} catch (error) {
    check("the rig macro parses as JavaScript", String(error), true);
}

const rigSource = fs.readFileSync(path.join(ROOT, "scripts/soulbound/rig.mjs"), "utf8");
check(
    "the rig carries the four guards that cost hours in live sessions",
    [
        rigSource.includes("PickAThingPrompt"),
        rigSource.includes("system.details.alliance"),
        rigSource.includes("deepClone"),
        rigSource.includes("promptProblems"),
    ],
    [true, true, true, true],
);
check("it never default-picks a Spirit — an unknown prompt is left open", rigSource.includes("return undefined"), true);
check("it does not call prepareData itself — pf2e cannot redefine `system` twice", !/await\s+actor\.prepareData\(\)/.test(rigSource), true);
check("it asserts the Reiatsu DC stops at master, not legendary", rigSource.includes("not legendary"), true);

/* ---------------------------------------------------------------------------------------------- */
/*  Foreign-pack references                                                                         */
/* ---------------------------------------------------------------------------------------------- */

/**
 * Every `Compendium.pf2e.*` reference in the content must resolve to an id at build time.
 *
 * pf2e does not resolve a name-shaped compendium uuid at runtime: `fromUuid` returns null, silently, and
 * the grant simply does nothing. That is how every Saint in every world came to be missing Alertness,
 * Iron Will, Juggernaut, Evasion and both Weapon Specializations — Perception still trained at 20th
 * level, with nothing anywhere reporting it.
 */
const foreignUuids = JSON.parse(fs.readFileSync(path.join(ROOT, "build/lib/pf2e-uuids.json"), "utf8"));
const known = new Set(
    Object.entries(foreignUuids)
        .filter(([pack]) => !pack.startsWith("_"))
        .flatMap(([pack, names]) => Object.keys(names).map((name) => `${pack}|${name}`)),
);

const unresolved = [];
(function walkContent(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walkContent(full);
        else if (entry.name.endsWith(".json")) {
            const raw = fs.readFileSync(full, "utf8");
            for (const match of raw.matchAll(/Compendium\.pf2e\.([\w-]+)\.[A-Za-z]+\.([^"\]|}<]+)/g)) {
                const [, pack, tail] = match;
                const name = tail.trim();
                if (/^[A-Za-z0-9]{16}$/.test(name)) continue; // already an id
                if (known.has(`pf2e.${pack}|${name}`)) continue;
                unresolved.push(`${path.relative(ROOT, full)}: pf2e.${pack} "${name}"`);
            }
        }
    }
})(path.join(ROOT, "content"));

check("every pf2e reference in the content has a snapshotted id", unresolved, []);
check(
    "the snapshot records which system version it was taken from",
    typeof foreignUuids._systemVersion === "string",
    true,
);

/* ---------------------------------------------------------------------------------------------- */
/*  The Lineage axis                                                                                */
/* ---------------------------------------------------------------------------------------------- */

function lineageDoc(name) {
    return contentDoc(`soulbound-class-features/lineages/${name}.json`);
}

const lineageFeature = featureDoc("lineage");
const lineageChoice = lineageFeature.system.rules.find((r) => r.key === "ChoiceSet");
check(
    "Lineage is chosen at 1st level from the tagged Lineage items",
    [lineageFeature.system.level.value, lineageChoice?.flag, lineageChoice?.choices?.filter],
    [1, "lineage", ["item:tag:soulbound-lineage"]],
);
check(
    "and the choice is granted",
    lineageFeature.system.rules.some((r) => r.key === "GrantItem" && r.uuid === "{item|flags.system.rulesSelections.lineage}"),
    true,
);

// `subfeatures.proficiencies` cannot grant a skill: pf2e's applier handles Perception, saves, weapon and
// armour categories and class DCs, and nothing else. A skill is an ActiveEffectLike on its rank, which is
// how the Saint's Aquarius Cloth already grants Occultism or Arcana.
for (const [file, skill] of [["soul-reaper", "society"], ["hollow", "athletics"], ["quincy", "crafting"]]) {
    const doc = lineageDoc(file);
    check(`${file}: tagged for the ChoiceSet`, (doc.system.traits.otherTags ?? []).includes("soulbound-lineage"), true);
    const rank = doc.system.rules.find((r) => r.key === "ActiveEffectLike" && r.path === `system.skills.${skill}.rank`);
    check(`${file}: trains its Lineage skill (guide §5)`, [rank?.mode, rank?.value], ["upgrade", 1]);
}

// Guide §3.1 trains every Soulbound in Spirit Lore. The class data model has no `lore` field — only a
// background does — so it is a real `lore` item, granted by the chassis rather than by the Lineage.
const spiritLore = contentDoc("soulbound-class-features/core/spirit-lore.json");
check("Spirit Lore is a lore item, the only shape pf2e has for it", spiritLore.type, "lore");
check("trained, not merely present", spiritLore.system.proficient.value, 1);
check(
    "and the chassis grants it, so all three Lineages have it",
    featureDoc("spirit-sense").system.rules.some((r) => r.key === "GrantItem" && String(r.uuid).endsWith("Spirit Lore")),
    true,
);

/* ---------------------------------------------------------------------------------------------- */
/*  Kidō                                                                                            */
/* ---------------------------------------------------------------------------------------------- */

function kidoDoc(way, name) {
    return contentDoc(`soulbound-kido/${way}/${name}.json`);
}

const sho = kidoDoc("hado", "sho");
check(
    "Shō is a cantrip, so it costs no Reiatsu and does not inflate the pool (guide §6)",
    [sho.system.traits.value.includes("cantrip"), sho.system.level.value],
    [true, 1],
);
check("Shō adds the key attribute, being the class's only free filler", sho.system.damage["0"].applyMod, true);

const byakurai = kidoDoc("hado", "byakurai");
check(
    "Byakurai is a spell attack — defense null plus the attack trait, as pf2e's own Fire Ray does it",
    [byakurai.system.defense, byakurai.system.traits.value.includes("attack")],
    [null, true],
);
check("Byakurai is 1 action at 60 feet (guide §6.1)", [byakurai.system.time.value, byakurai.system.range.value], ["1", "60 feet"]);

const kurohitsugi = kidoDoc("hado", "kurohitsugi");
check(
    "Kurohitsugi enters at rank 8 with 9d6 void (guide §6.1)",
    [kurohitsugi.system.level.value, kurohitsugi.system.damage["0"].formula, kurohitsugi.system.damage["0"].type],
    [8, "9d6", "void"],
);

const sorenSokatsui = kidoDoc("hado", "soren-sokatsui");
check("Sōren Sōkatsui is rank 5 and twice the basic variant's power (guide §6.1)", [sorenSokatsui.system.level.value, sorenSokatsui.system.damage["0"].formula], [5, "7d6"]);

for (const name of ["sho", "byakurai", "shakkaho", "sokatsui", "soren-sokatsui", "kurohitsugi"]) {
    const doc = kidoDoc("hado", name);
    const traits = doc.system.traits.value;
    check(`${name}: carries kidō, reiatsu, focus and destruction`, [
        traits.includes("kido"), traits.includes("reiatsu"), traits.includes("focus"), traits.includes("destruction"),
    ], [true, true, true, true]);
    check(`${name}: declares its tier`, (doc.system.traits.otherTags ?? []).includes("sb-tier-kido"), true);
}

const sai = kidoDoc("bakudo", "sai");
check(
    "Sai immobilizes on a failure and escalates on a critical failure (guide §6.2)",
    sai.flags["isaacs-hb-pf2e"].riders.map((r) => [r.outcomes, r.apply.slug, r.duration.unit]),
    [[["failure"], "immobilized", "rounds"], [["criticalFailure"], "immobilized", "minutes"]],
);
check("Sai's escape is against the Reiatsu DC", sai.flags["isaacs-hb-pf2e"].riders[0].apply.escapeDc, "reiatsu");

const danku = kidoDoc("bakudo", "danku");
check("Danku is a reaction (guide §6.2)", [danku.system.time.value, danku.system.traits.value.includes("binding")], ["reaction", true]);

const rikujokoro = kidoDoc("bakudo", "rikujokoro");
check(
    "Rikujōkōrō is Fortitude, and has no incapacitation trait — it stops short of paralysed (guide §6.2)",
    [rikujokoro.system.defense.save.statistic, rikujokoro.system.traits.value.includes("incapacitation")],
    ["fortitude", false],
);

const kaido = kidoDoc("kaido", "kaido");
check(
    "Kaidō heals rather than harms, the way pf2e's own Heal Animal does it",
    [kaido.system.damage["0"].kinds, kaido.system.damage["0"].type, kaido.system.traits.value.includes("mending")],
    [["healing"], "untyped", true],
);
check(
    "and it scales 5 per rank, which is guide §6.3's 5 per half your level",
    [kaido.system.damage["0"].formula, kaido.system.heightening.damage["0"], kaido.system.heightening.interval],
    ["5", "5", 1],
);
check("Kaidō is two actions at touch (guide §6.3)", [kaido.system.time.value, kaido.system.range.value], ["2", "touch"]);

for (const [way, name] of [["bakudo", "sai"], ["bakudo", "hainawa"], ["bakudo", "rikujokoro"], ["bakudo", "danku"], ["bakudo", "kin"], ["kaido", "kaido"]]) {
    const doc = kidoDoc(way, name);
    const traits = doc.system.traits.value;
    check(`${name}: carries kidō and reiatsu`, [traits.includes("kido"), traits.includes("reiatsu")], [true, true]);
    check(`${name}: declares its tier`, (doc.system.traits.otherTags ?? []).includes("sb-tier-kido"), true);
}

const bala = kidoDoc("hollow", "bala");
check(
    "Bala is a cantrip spell attack that adds the key attribute (guide §6.4)",
    [bala.system.traits.value.includes("cantrip"), bala.system.defense, bala.system.damage["0"].applyMod],
    [true, null, true],
);
// `agile` is a WEAPON trait — pf2e reads it off a weapon when computing a Strike's MAP and would never
// look for it on a spell, so authoring it here would validate and do nothing. That much was right. The
// rule that replaced it then carried `value: 1`, which pf2e rejects outright — see SB-31 below.
check(
    "Bala's agile clause is a MultipleAttackPenalty rule, not an inert weapon trait",
    [
        bala.system.traits.value.includes("agile"),
        bala.system.rules.some((r) => r.key === "MultipleAttackPenalty" && r.value < 0),
    ],
    [false, true],
);

const cero = kidoDoc("hollow", "cero");
check(
    "Cero is a 60-foot line on a basic Reflex save (guide §6.4)",
    [cero.system.area, cero.system.defense.save.basic, cero.system.damage["0"].formula],
    [{ type: "line", value: 60 }, true, "2d6"],
);

const heizen = kidoDoc("quincy", "heizen");
check(
    "Heizen is an area cantrip and so adds no attribute modifier (guide §6.5)",
    [heizen.system.traits.value.includes("cantrip"), heizen.system.damage["0"].applyMod, heizen.system.area],
    [true, false, { type: "line", value: 15 }],
);

const gritz = kidoDoc("quincy", "gritz");
check(
    "Gritz restrains on a critical failure — one step better than Sai, being the Quincy's only costed kidō",
    gritz.flags["isaacs-hb-pf2e"].riders.find((r) => r.outcomes.includes("criticalFailure")).apply.slug,
    "restrained",
);

// Guide §6: three free cantrips, one per Lineage, and every other kidō is costed.
const cantrips = ["hado/sho", "hollow/bala", "quincy/heizen"];
for (const path of cantrips) {
    const [way, name] = path.split("/");
    check(`${name} is one of the three free cantrips`, kidoDoc(way, name).system.traits.value.includes("cantrip"), true);
}
for (const path of ["hado/byakurai", "hado/shakkaho", "hado/sokatsui", "hado/soren-sokatsui", "hado/kurohitsugi",
                    "bakudo/sai", "bakudo/hainawa", "bakudo/rikujokoro", "bakudo/danku", "bakudo/kin",
                    "kaido/kaido", "hollow/cero", "quincy/gritz"]) {
    const [way, name] = path.split("/");
    check(`${name} is costed, not free`, kidoDoc(way, name).system.traits.value.includes("cantrip"), false);
}

/* ---------------------------------------------------------------------------------------------- */
/*  Lineage features                                                                                */
/* ---------------------------------------------------------------------------------------------- */

const hierro = lineageDoc("hierro-and-sonido");
const resistance = hierro.system.rules.find((r) => r.key === "Resistance");
check(
    "Hierro is physical resistance at half level, minimum 1 (guide §5.2)",
    [resistance?.type, resistance?.value],
    ["physical", "max(1,floor(@actor.level/2))"],
);
// ONE rule, not two. Two FlatModifiers sharing the label "Sonido" share a slug, and pf2e dedupes
// modifiers by slug — so the pair resolved to one and the +5 never reached the total. Sonido was inert
// on every Hollow from Phase 2 until the live pass read the final number off a sheet.
const sonido = hierro.system.rules.filter((r) => r.key === "FlatModifier" && r.selector === "speed");
check(
    "Sonido is one rule whose value scales, not two rules sharing a label",
    [sonido.length, sonido[0]?.value],
    [1, "ternary(gte(@actor.level,11),10,5)"],
);
// A status bonus on the speed selector is listed in the breakdown and never counted; an untyped one on
// the same selector applies. The guide says status; the table gets the five feet.
check("and it is untyped, because a status bonus to Speed never reaches the total", sonido[0]?.type, "untyped");

const regen = lineageDoc("regeneracion");
const fh = regen.system.rules.find((r) => r.key === "FastHealing");
check("Regeneración is fast healing that scales 2 / 4 / 6 (guide §5.2)", typeof fh?.value === "string" && fh.value.includes("17"), true);
// The spelling matters more than the presence. pf2e emits `self:condition:dying` with no value suffix —
// `self:condition:dying:0` is never true, so a predicate written that way leaves fast healing permanently
// OFF, which looks exactly like the feature not existing. `self:effect:<slug>` is pf2e's own spelling too
// (see its `air-gate` class feature).
// There are two FastHealing rules now — the ordinary rate and Murciélago's doubled one — so this asserts
// the two switches are on the base rule rather than pinning the whole predicate, which the doubling
// legitimately extends.
check(
    "and it is off while dying and while suppressed, in pf2e's own spellings",
    [{ not: "self:condition:dying" }, { not: "self:effect:regeneracion-suppressed" }]
        .every((p) => fh?.predicate.some((q) => JSON.stringify(q) === JSON.stringify(p))),
    true,
);

const segunda = lineageDoc("segunda-piel");
check("Segunda Piel extends Hierro to spirit damage (guide §5.2)", segunda.system.rules.find((r) => r.key === "Resistance")?.type, "spirit");

// A ChoiceSet resolves once, when the item carrying it is created; a `predicate` decides whether it
// applies at all rather than making it ask again later, and `reevaluateOnUpdate` is a GrantItem property.
// Six level-gated ChoiceSets on one feature therefore asked all six questions at 1st level and never
// asked the later four — a Soul Reaper stayed on two kidō forever. Each pickup is now its own feature.
const kidoAdept = lineageDoc("kido-adept");
check(
    "Kidō Adept grants six pickups and Shō, and asks nothing itself",
    [
        kidoAdept.system.rules.filter((r) => r.key === "ChoiceSet").length,
        kidoAdept.system.rules.filter((r) => r.key === "GrantItem").length,
    ],
    [0, 7],
);
check(
    "the four later pickups are level-gated and re-evaluate as you level",
    kidoAdept.system.rules.filter((r) => r.key === "GrantItem" && r.reevaluateOnUpdate === true).length,
    4,
);
check("Shō is granted outright, not chosen", kidoAdept.system.rules.some((r) => r.key === "GrantItem" && String(r.uuid).includes("Shō")), true);

for (const ordinal of ["1st", "2nd", "5th", "9th", "13th", "17th"]) {
    const pickup = lineageDoc(`kido-learned-${ordinal}`);
    const choice = pickup.system.rules.find((r) => r.key === "ChoiceSet");
    check(`Kidō Learned (${ordinal}): asks exactly one question, for a spell`, [
        pickup.system.rules.filter((r) => r.key === "ChoiceSet").length,
        choice?.choices?.itemType,
    ], [1, "spell"]);
    check(
        `Kidō Learned (${ordinal}): cannot offer a cantrip or another Lineage's fixed art`,
        JSON.stringify(choice.choices.filter).includes("cantrip")
            && JSON.stringify(choice.choices.filter).includes("soulbound-kido-hollow"),
        true,
    );
}

const cba = lineageDoc("cero-and-bala");
check("A Hollow's two arts are granted, never chosen (guide §6.4)", [
    cba.system.rules.filter((r) => r.key === "GrantItem").length,
    cba.system.rules.some((r) => r.key === "ChoiceSet"),
], [2, false]);

// Each Lineage grants its own features plus its Spirit chooser.
for (const [file, expected] of [["soul-reaper", 4], ["hollow", 5]]) {
    check(
        `${file} grants its own features and its Spirit chooser`,
        lineageDoc(file).system.rules.filter((r) => r.key === "GrantItem").length,
        expected,
    );
}

/* ---------------------------------------------------------------------------------------------- */
/*  Reactions, Blut, and Seal the Art                                                               */
/* ---------------------------------------------------------------------------------------------- */

const { canOffer } = await import("../scripts/riders/reactions.mjs");

const offerBase = { hasReaction: true, alreadyOffered: false, ownerOnline: true, frequencyLeft: 1 };
check("an owner with a reaction available is offered it", canOffer(offerBase), true);
check("a reaction the actor cannot take is not offered", canOffer({ ...offerBase, hasReaction: false }), false);
check("the same trigger is never offered twice", canOffer({ ...offerBase, alreadyOffered: true }), false);
check("an exhausted frequency is not offered", canOffer({ ...offerBase, frequencyLeft: 0 }), false);
check("with nobody at the keyboard, nothing is offered", canOffer({ ...offerBase, ownerOnline: false }), false);

/**
 * Danku answers **being** damaged, not damaging.
 *
 * This assertion used to demand `damage-applied`, which reads right and is the opposite event: *"Trigger
 * You or an ally within 15 ft. would take damage from a ranged attack, a spell, or an area effect"* is
 * the defender's. `damage-applied` is "damage from **this actor's** item landed on a target", so the
 * reaction was consulted on the turns the Soul Reaper was hurting somebody and never on the turns they
 * were hurt. Invisible for as long as `damage-applied` itself never fired; see #71.
 */
const dankuReaction = kidoDoc("bakudo", "danku").flags["isaacs-hb-pf2e"].riders[0];
check(
    "Danku is a real reaction offered when damage lands on you (guide §6.2)",
    [dankuReaction.apply.type, dankuReaction.event, dankuReaction.self],
    ["reaction", "damage-received", true],
);
check(
    "and it grants resistance equal to your level",
    contentDoc("soulbound-effects/effect-splitting-void.json").system.rules[0],
    { key: "Resistance", type: "all-damage", value: "@actor.level" },
);

// Phase 1 left this open: the flat check could only be reported after the fact. It is now offered.
const gfs = contentDoc("soulbound-effects/effect-greater-flash-step.json").flags["isaacs-hb-pf2e"].riders[0];
check(
    "Greater Flash Step's DC 5 flat check is offered as a reaction (Phase 1's open item)",
    [gfs.apply.type, gfs.event, gfs.apply.riders[0].apply.type, gfs.apply.riders[0].apply.dc],
    ["reaction", "strike-received", "flat-check", 5],
);
check(
    "and its description no longer says it is unautomated",
    contentDoc("soulbound-effects/effect-greater-flash-step.json").system.description.value.includes("Not yet automated"),
    false,
);

const { Blut } = await import("../scripts/soulbound/blut.mjs");
const withEffect = (name) => ({
    type: "character", class: { system: { slug: "soulbound" } },
    itemTypes: { effect: name ? [{ id: "e1", name }] : [] },
    getRollOptions: () => [],
});
check(
    "Blut reports which form is standing, or none",
    [Blut.active(withEffect("Effect: Blut Vene")), Blut.active(withEffect("Effect: Blut Arterie")), Blut.active(withEffect(null))],
    ["vene", "arterie", null],
);
check(
    "both forms are refused unless the content says otherwise — canon's two reishi systems",
    [
        Blut.allowsBoth(withEffect(null)),
        Blut.allowsBoth({ ...withEffect(null), getRollOptions: () => ["soulbound:blut-both"] }),
    ],
    [false, true],
);

const sealArt = contentDoc("soulbound-class-features/actions/seal-the-art.json");
const sealRider = sealArt.flags["isaacs-hb-pf2e"].riders[0];
check(
    "Seal the Art counteracts, on use, for the whole cast (guide §5.3)",
    [sealRider.apply.type, sealRider.event, sealRider.self, sealArt.system.actions.value],
    ["counteract", "action-used", true, 2],
);
check("and it reaches release states, stances and auras", [
    sealRider.apply.traits.includes("soulbound"),
    sealRider.apply.traits.includes("stance"),
    sealRider.apply.traits.includes("cosmo"),
], [true, true, true]);

check(
    "the Quincy grants all four of its features, plus its Spirit chooser",
    lineageDoc("quincy").system.rules.filter((r) => r.key === "GrantItem").length,
    5,
);

/* ---------------------------------------------------------------------------------------------- */
/*  Spirits — the axis, and Senbonzakura                                                            */
/* ---------------------------------------------------------------------------------------------- */

// A ChoiceSet stores its selection as a UUID, not a tag, so a filter cannot join "this Spirit's Lineage"
// to "the Lineage you chose". Proved in the live world before five Spirits depended on it; the fallback
// the design already named is three per-Lineage choosers, which cannot offer the wrong Spirit at all.
for (const [slug, lineage] of [["soul-reaper", "Soul Reaper"], ["hollow", "Hollow"], ["quincy", "Quincy"]]) {
    const chooser = featureDoc(`spirit-${slug}`);
    const choice = chooser.system.rules.find((r) => r.key === "ChoiceSet");
    check(`Spirit (${lineage}): offers only its own Lineage's Spirits`, choice.choices.filter, [
        "item:tag:soulbound-spirit", `item:tag:soulbound-lineage-${slug}`,
    ]);
    check(`Spirit (${lineage}): is granted by its Lineage`,
        lineageDoc(slug).system.rules.some((r) => r.key === "GrantItem" && String(r.uuid).endsWith(`Spirit (${lineage})`)), true);
}

function spiritDoc(name) {
    return contentDoc(`soulbound-class-features/spirits/${name}.json`);
}
function techDoc(name) {
    return contentDoc(`soulbound-techniques/${name}.json`);
}

const senbon = spiritDoc("senbonzakura");
check("Senbonzakura is a Soul Reaper Spirit the chooser can find", [
    senbon.system.traits.otherTags.includes("soulbound-spirit"),
    senbon.system.traits.otherTags.includes("soulbound-lineage-soul-reaper"),
], [true, true]);
check("and it grants a Shikai, a Release Technique and a Bankai at 13th",
    ["Shikai", "soulbound-techniques", "Kageyoshi"].map((needle) =>
        senbon.system.rules.some((r) => r.key === "GrantItem" && r.uuid.includes(needle))),
    [true, true, true]);
check("the Bankai is level-gated", senbon.system.rules.some((r) => r.key === "GrantItem" && r.reevaluateOnUpdate === true), true);

const senbonTech = techDoc("senbonzakura");
check(
    "Senbonzakura: 15-foot emanation, basic Reflex, 2d6 slashing, +1d6 per rank (guide §7A)",
    [senbonTech.system.area, senbonTech.system.defense.save.basic, senbonTech.system.damage["0"].formula,
     senbonTech.system.damage["0"].type, senbonTech.system.heightening.damage["0"], senbonTech.system.level.value],
    [{ type: "emanation", value: 15 }, true, "2d6", "slashing", "1d6", 1],
);
check(
    "and it leaves difficult terrain behind for a round",
    [senbonTech.flags["isaacs-hb-pf2e"].lingering.difficultTerrain, senbonTech.flags["isaacs-hb-pf2e"].lingering.duration],
    [2, { unit: "rounds", value: 1 }],
);

// "The emanation increases to 20 feet" is a 9th-level benefit, and a focus effect heightens per RANK —
// "at 9th level" is not a rank step. pf2e's own `area-size` alteration is the lever, applied by the
// feature that grants the benefit.
//
// It used to be ONE alteration adding a flat 5 feet to every `sb-tier-release` item, which this test
// asserted. That was the bug: Getsuga Tenshō's line goes 30 → 60 and La Gota's cone 30 → 40, and three
// more Spirits' Refined benefit is not a widening at all. The size travels with the technique now; the
// fuller invariants are at the bottom of this file.
const refined = featureDoc("refined-release");
check(
    "Refined Release sets an area outright rather than nudging every Technique by 5 feet",
    refined.system.rules.find((r) => r.key === "ItemAlteration"),
    { itemType: "spell", key: "ItemAlteration", mode: "override", predicate: ["item:tag:sb-refined-area-20"], property: "area-size", value: 20 },
);

const { nextMode } = await import("../scripts/soulbound/modes.mjs");
const AVAILABLE = ["Gokei", "Senkei"];
check("a mode switch moves to the mode asked for", nextMode({ current: null, wanted: "Gokei", available: AVAILABLE }), "Gokei");
check("switching replaces rather than adds", nextMode({ current: "Gokei", wanted: "Senkei", available: AVAILABLE }), "Senkei");
check("a mode this family does not have is refused, leaving what stood", nextMode({ current: "Gokei", wanted: "Higashi", available: AVAILABLE }), "Gokei");

check(
    "Senkei takes back the reach the Shikai granted, rather than cancelling it elsewhere",
    contentDoc("soulbound-effects/effect-senkei.json").system.rules
        .some((r) => r.key === "ItemAlteration" && r.mode === "remove" && r.value === "reach-15"),
    true,
);
// The damage moved a level down when the emanation gained the basic Reflex it always should have had:
// `apply` is the save now, and the dice are the save's nested rider. The assertion used to read
// `r.apply.formula` and would have gone on passing if the save were removed again.
check(
    "the Bankai ticks at the start of your turn against enemies in the emanation",
    (() => {
        const r = contentDoc("soulbound-effects/effect-senbonzakura-kageyoshi.json").flags["isaacs-hb-pf2e"].riders[0];
        return [r.event, r.apply.riders[0].apply.formula, [r.area].flat()[0].value, r.areaTargeting.affects];
    })(),
    ["turn-start", "5d6", 20, "enemies"],
);

/* --- Hyōrinmaru, and the charge pool ---------------------------------------------------------- */

const { afterSpend, afterRefresh } = await import("../scripts/soulbound/charges.mjs");

const petals = { held: 3, spending: 1, perRound: 1, spentThisRound: 0 };
check("a petal-flower is spent and two remain", afterSpend(petals), { allowed: true, held: 2, reason: null });
// The per-round limit is the half that goes wrong quietly: three petals with no per-round check is three
// times the damage the Bankai is costed for, with nothing on the sheet to show for it.
check("a second petal in the same round is refused", afterSpend({ ...petals, spentThisRound: 1 }).allowed, false);
check("spending more than you hold is refused", afterSpend({ ...petals, held: 0 }).allowed, false);
check("and the refusal says why", afterSpend({ ...petals, held: 0 }).reason, "not enough charges");
check("a refresh never exceeds the maximum", afterRefresh({ held: 3, max: 3, regain: 1 }), 3);
check("and never falls below nothing", afterRefresh({ held: 0, max: 3, regain: -5 }), 0);

const hyorin = spiritDoc("hyorinmaru");
check("Hyōrinmaru grants a Shikai, Ryūsenka and a Bankai at 13th",
    ["Shikai", "Ryūsenka", "Daiguren"].map((needle) =>
        hyorin.system.rules.some((r) => r.key === "GrantItem" && r.uuid.includes(needle))),
    [true, true, true]);

const daiguren = contentDoc("soulbound-effects/effect-daiguren-hyorinmaru.json");
check(
    "the Bankai holds three petal-flowers as a counter badge, the way this module counts everything",
    [daiguren.system.badge.type, daiguren.system.badge.value, daiguren.system.badge.max],
    ["counter", 3, 3],
);
check(
    "and it grants a fly Speed and cold resistance equal to level (guide §7A)",
    [
        daiguren.system.rules.some((r) => r.key === "Resistance" && r.type === "cold" && r.value === "@actor.level"),
        daiguren.system.rules.some((r) => r.key === "BaseSpeed" && r.selector === "fly"),
    ],
    [true, true],
);

const ryusenka = techDoc("ryusenka");
check(
    "Ryūsenka is a Strike rider on the +2 ladder, not an area (guide §1.5)",
    [ryusenka.system.damage["0"].formula, ryusenka.system.heightening.interval, ryusenka.system.area],
    ["1d6", 2, undefined],
);
check(
    "its immobilize is gated behind landing the Strike AND a failed save",
    (() => {
        const r = ryusenka.flags["isaacs-hb-pf2e"].riders[0];
        return [r.event, r.outcomes, r.apply.type, r.apply.statistic, r.apply.riders[0].apply.slug];
    })(),
    ["strike-resolved", ["success"], "save", "fortitude", "immobilized"],
);

for (const name of ["sennen-hyoro", "hyoryu-senbi", "zanhyo-ningyo"]) {
    const doc = techDoc(name);
    check(`${name}: a Full Release technique, base rank 7 (guide §7 preamble)`,
        [doc.system.level.value, doc.system.traits.otherTags.includes("sb-tier-full-release")], [7, true]);
}
check("Zanhyō Ningyō is a reaction, using the machinery Phase 2 built",
    [techDoc("zanhyo-ningyo").system.time.value,
     techDoc("zanhyo-ningyo").flags["isaacs-hb-pf2e"].riders[0].apply.type],
    ["reaction", "reaction"]);

/* --- Zangetsu and Ryūjin Jakka ----------------------------------------------------------------- */

const zangetsuShikai = spiritDoc("zangetsu-shikai");
check(
    "Zangetsu is never sealed, and the state machine reads a roll option rather than Ichigo's name",
    zangetsuShikai.system.rules.some((r) => r.key === "RollOption" && r.option === "soulbound:release:never-sealed"),
    true,
);
/**
 * The two-handed half of the Shikai form, which shipped as prose.
 *
 * "it gains two-handed d12 **if it did not already have a two-handed trait**" is a condition about the
 * weapon's own printed profile, and pf2e emits a bare `item:trait:two-hand` alongside the sized
 * `item:trait:two-hand-d10` — so one `not` covers d6, d8, d10 and d12 without naming any of them.
 */
{
    const rules = contentDoc("soulbound-effects/effect-zangetsu-shikai.json").system.rules;
    const add = rules.find((r) => r.property === "traits" && r.mode === "add");
    check("the Shikai form grants two-hand d12", add?.value, "two-hand-d12");
    check(
        "…only to a weapon that is not already two-handed, by the unsized trait option",
        add?.predicate?.some((p) => p?.not === "item:trait:two-hand"),
        true,
    );
}

/**
 * "Two steps instead of one" is not expressible as a rule element.
 *
 * pf2e's `damage-dice-faces` handler latches — `if (item.flags.pf2e.damageFacesUpgraded) return` — so a
 * second `upgrade` is a no-op whether it sits on the same effect or another one. Driven live: a base d8
 * spirit weapon read d10 with one rule and d10 with two. The latch is deliberate; PF2e's own rule is that
 * die-size increases do not stack, and the guide overrides that on purpose.
 *
 * So the Bankai keeps **one** honest `upgrade` and declares the rest as `extraDieSteps`, taken in
 * `prepareDerivedData` after pf2e has finished. A second `upgrade` rule reappearing here would be a
 * silent regression to one step, which is why the count is asserted as exactly one.
 */
{
    const shikai = contentDoc("soulbound-effects/effect-zangetsu-shikai.json").system.rules;
    const zanka = contentDoc("soulbound-effects/effect-zanka-no-tachi.json");
    const faces = (rules) => rules.filter((r) => r.property === "damage-dice-faces").length;
    check("one upgrade rule each, because a second would do nothing",
        [faces(shikai), faces(zanka.system.rules)], [1, 1]);
    check("and Zanka no Tachi asks for its second step in the one way that works",
        zanka.flags["isaacs-hb-pf2e"].extraDieSteps, 1);
    check("the Shikai does not, because one step is all it claims",
        contentDoc("soulbound-effects/effect-zangetsu-shikai.json").flags?.["isaacs-hb-pf2e"]?.extraDieSteps,
        undefined);
}
// The Getsuga half asserted `property: "time"`, which pf2e has no handler for — so this check was
// pinning an inert rule in place and calling it compression. The action cost is a module capability
// now; the assertions for it are at the bottom of this file.
check(
    "Tensa Zangetsu compresses Flash Step to twice a round, and adds no die step",
    (() => {
        const rules = contentDoc("soulbound-effects/effect-tensa-zangetsu.json").system.rules;
        return [
            rules.some((r) => r.property === "frequency-max" && r.value === 2),
            rules.some((r) => r.property === "damage-dice-faces"),
        ];
    })(),
    [true, false],
);

const getsuga = techDoc("getsuga-tensho");
check(
    "Getsuga Tenshō: 30-foot line, 2d6 spirit, +1d6 per rank (guide §7A)",
    [getsuga.system.area, getsuga.system.damage["0"].formula, getsuga.system.damage["0"].type],
    [{ type: "line", value: 30 }, "2d6", "spirit"],
);
// `feature:<slug>`, not `self:feature:<slug>`. pf2e has no `self:feature:` option at all, and this
// assertion was pinning the broken spelling in place on six Refined riders at once.
check(
    "and Kuroi Getsuga's spirit-resistance bypass waits for Refined Release",
    getsuga.flags["isaacs-hb-pf2e"].bypass[0].predicate,
    ["feature:refined-release"],
);

const zanka = contentDoc("soulbound-effects/effect-zanka-no-tachi.json");
const ambient = zanka.flags["isaacs-hb-pf2e"].riders[0];
check(
    "Zanka no Tachi burns EVERYTHING within 30 feet, allies included — guide §7A is explicit",
    [ambient.event, ambient.area.value, ambient.areaTargeting.affects, ambient.areaTargeting.includesSelf],
    ["turn-start", 30, "all", false],
);
check(
    "and the Shikai's fire resistance switches off while the Bankai stands",
    contentDoc("soulbound-effects/effect-ryujin-jakka-shikai.json").system.rules
        .find((r) => r.key === "Resistance").predicate,
    [{ not: "self:effect:zanka-no-tachi" }],
);

const kita = techDoc("kita-tenchi-kaijin");
check(
    "Kita is the only unresistable damage in the class — fire and physical resistance both bypassed",
    kita.flags["isaacs-hb-pf2e"].bypass[0].resistance.types,
    ["fire", "physical"],
);
check("and it is metered to once per round", kita.system.frequency, { max: 1, per: "round", value: 1 });

for (const name of ["senbonzakura", "hyorinmaru", "zangetsu", "ryujin-jakka"]) {
    const doc = spiritDoc(name);
    check(`${name}: tagged as a Soul Reaper Spirit`, [
        doc.system.traits.otherTags.includes("soulbound-spirit"),
        doc.system.traits.otherTags.includes("soulbound-lineage-soul-reaper"),
    ], [true, true]);
}

/* --- Kyōka Suigetsu, and the hypnosis register -------------------------------------------------- */

const { windowFor, shouldRoll } = await import("../scripts/soulbound/hypnosis.mjs");

check("a critical success buys 24 hours of immunity (guide §7A)", windowFor("criticalSuccess").immuneFor, { unit: "hours", value: 24 });
check("a success buys 10 minutes", windowFor("success").immuneFor, { unit: "minutes", value: 10 });
check("a failure is one minute hypnotized, and no immunity", [windowFor("failure").hypnotizedFor, windowFor("failure").immuneFor], [{ unit: "minutes", value: 1 }, null]);
// "Seen it once, falls to it forever" is one branch of four, invisible in the JSON, and getting it wrong
// makes Aizen either harmless or unbeatable with nothing in between.
check("a critical failure is an hour, and makes a permanent victim", [windowFor("criticalFailure").hypnotizedFor, windowFor("criticalFailure").permanentVictim], [{ unit: "hours", value: 1 }, true]);

const observer = { canSee: true, immuneUntil: null, now: 100, alreadyHypnotized: false, permanentVictim: false };
check("a creature that can see and is not immune rolls", shouldRoll(observer), { roll: true, autoHypnotize: false });
check("the blind are Aizen's blind spot — canon's own exemption", shouldRoll({ ...observer, canSee: false }), { roll: false, autoHypnotize: false });
check("an immunity window is respected", shouldRoll({ ...observer, immuneUntil: 500 }), { roll: false, autoHypnotize: false });
check("and expires", shouldRoll({ ...observer, immuneUntil: 50 }), { roll: true, autoHypnotize: false });
check("a permanent victim does not roll — it simply falls again", shouldRoll({ ...observer, permanentVictim: true }), { roll: false, autoHypnotize: true });
check("someone already hypnotized is not asked twice", shouldRoll({ ...observer, alreadyHypnotized: true }), { roll: false, autoHypnotize: false });

const kyoka = spiritDoc("kyoka-suigetsu");
check("Kyōka Suigetsu grants a Shikai, Shikake and a Full Release at 13th",
    ["Kanzen Saimin", "Shikake", "Sōten Kisshun"].map((needle) =>
        kyoka.system.rules.some((r) => r.key === "GrantItem" && r.uuid.includes(needle))),
    [true, true, true]);

const hypnotized = contentDoc("soulbound-effects/effect-hypnotized.json");
check(
    "the displaced image is a DC 5 flat check, using the type Phase 2 added",
    (() => { const r = hypnotized.flags["isaacs-hb-pf2e"].riders[0]; return [r.apply.type, r.apply.dc, r.event]; })(),
    ["flat-check", 5, "strike-resolved"],
);

const shikake = techDoc("shikake");
check(
    "Shikake is an illusion, mental and visual effect on a Will save (guide §7A)",
    [shikake.system.defense.save.statistic, ["illusion", "mental", "visual"].every((t) => shikake.system.traits.value.includes(t))],
    ["will", true],
);
check(
    "its critical failure lasts two rounds where a failure lasts one",
    shikake.flags["isaacs-hb-pf2e"].riders.slice(0, 2).map((r) => [r.outcomes[0], r.duration.value]),
    [["failure", 1], ["criticalFailure", 2]],
);

// All five Soul Reaper Spirits, each with its full ladder.
for (const name of ["senbonzakura", "zangetsu", "hyorinmaru", "ryujin-jakka", "kyoka-suigetsu"]) {
    const doc = spiritDoc(name);
    // By what each grant is, not how many there are. The count said three until the Severing Art turned
    // out to be granted by nobody at all, and a count is a number to edit rather than a claim to check.
    const grants = doc.system.rules.filter((r) => r.key === "GrantItem");
    const gated = (needle) => grants.some((r) => JSON.stringify(r.predicate ?? []).includes(needle));
    check(`${name}: a form from 1st, a Full Release gated to 13th, and a Severing Art behind Severance`, [
        grants.some((r) => !r.predicate?.length),
        gated("13"),
        gated("soulbound:severance"),
    ], [true, true, true]);
}

/* ---------------------------------------------------------------------------------------------- */
/*  Hollow Spirits                                                                                  */
/* ---------------------------------------------------------------------------------------------- */

const HOLLOW_SPIRITS = ["pantera", "murcielago", "arrogante", "los-lobos", "tiburon"];
for (const name of HOLLOW_SPIRITS) {
    const doc = spiritDoc(name);
    check(`${name}: a Hollow Spirit its own Lineage can offer`, [
        doc.system.traits.otherTags.includes("soulbound-spirit"),
        doc.system.traits.otherTags.includes("soulbound-lineage-hollow"),
    ], [true, true]);
    const grants = doc.system.rules.filter((r) => r.key === "GrantItem");
    const gated = (needle) => grants.some((r) => JSON.stringify(r.predicate ?? []).includes(needle));
    check(`${name}: a form from 1st, a Segunda Etapa gated to 13th, and a Severing Art`, [
        grants.some((r) => !r.predicate?.length),
        gated("13"),
        gated("soulbound:severance"),
    ], [true, true, true]);
}

// pf2e's Resistance takes an `exceptions` list, so guide §7B's "all damage except spirit" is exactly
// expressible and did not need approximating.
const murcielagoSegunda = contentDoc("soulbound-effects/effect-murcielago-segunda-etapa.json");
check(
    "Murciélago resists everything except spirit, at half level",
    murcielagoSegunda.system.rules.find((r) => r.key === "Resistance"),
    { exceptions: ["spirit"], key: "Resistance", type: "all-damage", value: "max(1,floor(@actor.level/2))" },
);
// Two FastHealing rules would be two separate heals at turn start, which is not what "doubles" means.
check(
    "and High-Speed Regeneration does not declare a second fast healing",
    murcielagoSegunda.system.rules.some((r) => r.key === "FastHealing"),
    false,
);

// The burst was written as the *cast's* area, with the detonation a `self` rider beside it. Both halves
// were wrong, and this check used to pin them: cast-time area targeting would have replaced the single
// creature the attack is rolled against with everyone in a 15-foot burst, and the `self` rider dealt the
// lance's 5d6 fire to the caster. Driven live it did exactly that and nothing else — no burst, no save,
// 13 damage to the Murciélago. "At that point" is the creature the lance was thrown at, so the burst is
// anchored on the target and the attack keeps its one target.
const lanza = techDoc("lanza-del-relampago");
const lance = lanza.flags["isaacs-hb-pf2e"].riders[0];
check(
    "Lanza del Relámpago is a spell attack at one creature, and the burst opens where the lance landed",
    [lanza.system.defense, lanza.flags["isaacs-hb-pf2e"].areaTargeting, lance.self,
     lance.area, lance.event],
    [null, undefined, undefined, { anchor: "target", excludeAnchor: false, type: "burst", value: 15 },
     "strike-resolved"],
);

const claws = contentDoc("soulbound-equipment/pantera-claws.json");
check(
    "Pantera's claws are agile finesse unarmed attacks in the brawling group (guide §7B)",
    [claws.system.category, claws.system.group, claws.system.damage.die, [...claws.system.traits.value].sort()],
    ["unarmed", "brawling", "d8", ["agile", "finesse", "unarmed"]],
);

// Cero Metralleta is one spell with two shapes, which is what pf2e's spell overlays are for.
const metralleta = techDoc("cero-metralleta");
check(
    "Cero Metralleta is a 60-foot cone with a 120-foot line variant",
    [metralleta.system.area, Object.values(metralleta.system.overlays)[0].system.area],
    [{ type: "cone", value: 60 }, { type: "line", value: 120 }],
);

const colmillo = techDoc("colmillo-fang");
check(
    "Colmillo's overlapping bursts do not stack — the existing overlap flag, not a new answer",
    [colmillo.flags["isaacs-hb-pf2e"].overlap.from, colmillo.flags["isaacs-hb-pf2e"].overlap.value],
    [2, 0],
);
check(
    "and the wolves are a counter badge, like every other charge in this module",
    contentDoc("soulbound-effects/effect-colmillo.json").system.badge,
    { max: 8, min: 0, type: "counter", value: 8 },
);

const trident = techDoc("trident");
check(
    "Trident is three Strikes at one MAP, through the type Pleiades Nova already proved",
    (() => { const r = trident.flags["isaacs-hb-pf2e"].riders[0]; return [r.apply.type, r.apply.count, r.self]; })(),
    ["strikes", 3, true],
);

const respira = techDoc("respira");
check(
    "Respira's miasma lingers and grows with rank",
    [respira.flags["isaacs-hb-pf2e"].lingering.damage.formula, respira.flags["isaacs-hb-pf2e"].lingering.damage.perStep],
    ["1d6", "1d6"],
);
check(
    "Respira Absoluta's decay is a flat check on what is aimed at you",
    contentDoc("soulbound-effects/effect-respira-absoluta.json").flags["isaacs-hb-pf2e"].riders
        .find((r) => r.apply.type === "flat-check").apply.dc,
    5,
);

/* --- a released form replaces the weapon, it does not add a second ----------------------------- */

const { SpiritWeapon: SW, PROFILE_TAG, SPIRIT_WEAPON_TAG, handsFor } = await import("../scripts/soulbound/weapon.mjs");

function armedWith(names) {
    const weapons = names.map(([name, tags, carryType], i) => ({
        id: `w${i}`, name,
        system: { traits: { otherTags: tags }, equipped: { carryType } },
    }));
    return {
        itemTypes: { weapon: weapons },
        updates: [],
        async updateEmbeddedDocuments(_type, updates) {
            this.updates.push(...updates);
            for (const u of updates) {
                const w = weapons.find((x) => x.id === u._id);
                if (w) w.system.equipped.carryType = u["system.equipped.carryType"];
            }
        },
    };
}

const SEALED = [SPIRIT_WEAPON_TAG, PROFILE_TAG];
const RELEASED = [SPIRIT_WEAPON_TAG];

{
    // The sealed profile beside a replacement: stow it. A player choosing between them is a choice the
    // class never offered.
    const actor = armedWith([["Blade", SEALED, "held"], ["Luz de la Luna", RELEASED, "held"]]);
    await SW.reconcile(actor);
    check("a replacement stows the sealed profile",
        actor.itemTypes.weapon.map((w) => `${w.name}:${w.system.equipped.carryType}`),
        ["Blade:stowed", "Luz de la Luna:held"]);
}
{
    // The form ends and its weapon goes: the profile comes back up.
    const actor = armedWith([["Blade", SEALED, "stowed"]]);
    await SW.reconcile(actor);
    check("and it is taken back up when the replacement is gone",
        actor.itemTypes.weapon[0].system.equipped.carryType, "held");
}
{
    // Zangetsu and Hyorinmaru ALTER the weapon rather than replacing it. Nothing to stow.
    const actor = armedWith([["Blade", SEALED, "held"]]);
    await SW.reconcile(actor);
    check("a Spirit that only alters the weapon leaves it in hand", actor.updates.length, 0);
}
{
    // The guard is the TAG, not isSoulbound: during character creation the class has not landed when
    // the weapons arrive, and gating on it meant the guard was false exactly when it mattered.
    const actor = armedWith([["Blade", SEALED, "held"], ["Claws", RELEASED, "held"]]);
    await SW.reconcile(actor);
    check("reconcile does not wait for the class item to land", actor.updates.length, 1);
}
{
    /**
     * A two-handed form takes two hands.
     *
     * `reconcile` wrote `handsHeld: 1` for every spirit weapon in play, which is right for the nine held
     * in one hand and wrong for the four that are not. Driven live, a crowned skeleton carrying Gran
     * Caída — a vast double axe, `held-in-two-hands` — had a hand free, free enough to Grapple with.
     *
     * `held-in-one-plus-hands` stays at one on purpose: a bow is carried in one hand and drawn with two,
     * and pf2e counts it as one for `handsFree` exactly as the rules do.
     */
    check("a two-handed spirit weapon occupies two hands",
        handsFor({ system: { usage: { value: "held-in-two-hands" } } }), 2);
    check("…a one-handed one occupies one",
        handsFor({ system: { usage: { value: "held-in-one-hand" } } }), 1);
    check("…a bow occupies one",
        handsFor({ system: { usage: { value: "held-in-one-plus-hands" } } }), 1);
    // pf2e derives `usage.hands` while preparing the item; where it exists it is the number to read.
    check("…and a prepared item's own hand count wins",
        handsFor({ system: { usage: { value: "held-in-one-hand", hands: 2 } } }), 2);

    // Every spirit weapon the content ships, against the usage it declares.
    const TWO_HANDED = ["gran-caida.json", "great-blade.json", "miracle-blade.json", "tiburon-blade.json"];
    const declared = fs.readdirSync(path.join(ROOT, "content", "soulbound-equipment"))
        .filter((name) => name.endsWith(".json"))
        .map((name) => [name, JSON.parse(fs.readFileSync(path.join(ROOT, "content", "soulbound-equipment", name), "utf8"))])
        .filter(([, doc]) => doc.type === "weapon");
    const mismatched = declared
        .filter(([name, doc]) => doc.system.equipped?.handsHeld !== handsFor(doc)
            && !(doc.system.usage?.value === "held-in-one-plus-hands"))
        .map(([name]) => name);
    check("every spirit weapon is equipped in as many hands as it takes", mismatched, []);
    check("…and the four two-handed ones are the four the guide names",
        declared.filter(([, doc]) => handsFor(doc) === 2).map(([name]) => name).sort(), TWO_HANDED);
}

/* ---------------------------------------------------------------------------------------------- */
/*  Quincy Spirits — and all fifteen                                                                */
/* ---------------------------------------------------------------------------------------------- */

const QUINCY_SPIRITS = ["antithesis", "the-heat", "the-balance", "the-thunderbolt", "the-miracle"];
for (const name of QUINCY_SPIRITS) {
    const doc = spiritDoc(name);
    check(`${name}: a Quincy Spirit its own Lineage can offer`, [
        doc.system.traits.otherTags.includes("soulbound-spirit"),
        doc.system.traits.otherTags.includes("soulbound-lineage-quincy"),
    ], [true, true]);
    // Asserted by what each grant IS rather than by counting them — the count was 3 until the 9th-level
    // Technique and the Severing Art turned out to be granted by nobody, and a count would have had to
    // be edited rather than consulted. Every Spirit grants a Schrift Form, a Technique it can use from
    // 1st, a Vollständig at 13th, and a Severing Art that exists only inside Severance.
    const grants = doc.system.rules.filter((r) => r.key === "GrantItem");
    const gated = (needle) => grants.some((r) => JSON.stringify(r.predicate ?? []).includes(needle));
    check(`${name}: a Schrift Form, and a Vollständig gated to 13th`, [
        grants.some((r) => !r.predicate?.length),
        gated("13"),
    ], [true, true]);
    check(`${name}: and a Severing Art that only Severance can reach`,
        gated("soulbound:severance"), true);
}

// Guide §7C is explicit that these carry incapacitation: stunned on a failed basic save at rank 1 is
// above the curve without it, and against a higher-level creature it should do nothing but damage.
// Electrocution joins them: §9.3 says its stunned 2 is incapacitation in as many words, and a Severing
// Art that stunned a higher-level creature outright would be the one place the trait is load-bearing.
for (const name of ["galvano-blast", "galvano-javelin", "electrocution"]) {
    check(`${name} carries incapacitation (guide §7C)`,
        techDoc(name).system.traits.value.includes("incapacitation"), true);
}

/**
 * C-08. Weapon Expertise promised critical specialization **in its description** and carried no rules.
 *
 * pf2e builds the `critical-specialization` roll option from a synthetic the `CriticalSpecialization`
 * rule element creates (`system/damage/weapon.ts`), so a feature with no rule grants nothing however
 * plainly its text says otherwise — and a class feature's text is exactly where nobody looks for a bug.
 * Driven live on a critical hit at 17th: the damage card carries the note now and did not before.
 *
 * Unpredicated on purpose. A first attempt gated it on the weapon's proficiency rank and matched
 * nothing, because a weapon publishes no `item:proficiency:rank` option; and this class has one weapon
 * progression, which reaches expert at the level this feature arrives at.
 */
/**
 * C-13. All four sealed profiles, because the guide states them as a table and a table is the easiest
 * thing in a document to edit on one side only.
 */
for (const [file, dice, die, type, traits] of [
    ["blade", 1, "d8", "slashing", ["two-hand-d10", "versatile-p", "versatile-spirit"]],
    ["great-blade", 1, "d10", "slashing", ["sweep", "versatile-spirit"]],
    ["paired-blades", 1, "d6", "slashing", ["agile", "finesse", "twin", "versatile-spirit"]],
    ["spirit-bow", 1, "d8", "piercing", ["propulsive", "versatile-spirit"]],
]) {
    const doc = contentDoc(`soulbound-equipment/${file}.json`);
    check(`${file} is ${dice}${die} ${type}`,
        [doc.system.damage.dice, doc.system.damage.die, doc.system.damage.damageType, doc.system.category],
        [dice, die, type, "martial"]);
    check(`…with the traits the guide gives it`, doc.system.traits.value.sort(), [...traits].sort());
}

check("Weapon Expertise grants the critical specialization it describes",
    contentDoc("soulbound-class-features/core/weapon-expertise.json").system.rules,
    [{ key: "CriticalSpecialization" }]);

// The exception blut.mjs was written blind to accept in Phase 2, so it would never learn Uryū's name.
check(
    "Letzt Stil is the one thing in the class that sets soulbound:blut-both",
    contentDoc("soulbound-effects/effect-quincy-letzt-stil.json").system.rules
        .some((r) => r.key === "RollOption" && r.option === "soulbound:blut-both"),
    true,
);
// This check used to assert the opposite — "it steps the die twice, as two rules, because one `upgrade`
// steps once" — and the reasoning was half right: one upgrade does step once, and *two* step once as
// well. pf2e latches on `damageFacesUpgraded`, and the **Schrift's** own upgrade had already taken the
// one pf2e allows, so both of Letzt Stil's were no-ops. Driven live the bow was 1d10 at the Vollständig,
// identical to the Schrift. The second step is `extraDieSteps` now; see the block above.
check(
    "its cost is a real state: the pool's ceiling goes to zero for 24 hours",
    (() => {
        const spent = contentDoc("soulbound-effects/effect-letzt-stil-spent.json");
        const rule = spent.system.rules.find((r) => r.path === "system.resources.focus.cap");
        return [spent.system.duration, rule?.value];
    })(),
    [{ expiry: null, sustained: false, unit: "hours", value: 24 }, 0],
);

// Burner Finger is one technique with five shapes, which is what overlays are for.
const burner = techDoc("burner-finger");
check(
    "Burner Finger has four overlays beside its base shape — five fingers in all (guide §7C)",
    Object.keys(burner.system.overlays).length,
    4,
);
// Ordered by each overlay's `sort`, which is what pf2e itself orders variants by — the object's key
// order is incidental, and a re-serialisation that sorted the keys once turned a player's "Three" into
// the emanation without touching a single value.
const fingers = Object.values(burner.system.overlays).sort((a, b) => a.sort - b.sort);
check(
    "the base is the ranged attack; the others are line, emanation and cone",
    [burner.system.area, ...fingers.map((f) => f.system?.area?.type ?? "none")],
    [null, "none", "line", "emanation", "cone"],
);
check("and the guide's own numbering survives it",
    fingers.map((f) => f.name),
    ["Burner Finger Two", "Burner Finger Three", "Burner Finger Four", "Burner Finger Five"]);


/**
 * The AC bonus must read an option something **publishes**.
 *
 * This assertion used to demand the opposite, and its comment said "read the POOL, not a roll option
 * nothing sets" — which is exactly backwards, because `self:resource:focus:value` is the roll option
 * nothing sets. **pf2e publishes no roll option for a resource at all.** Driven live, a Balance holding
 * three Reiatsu Points had nothing matching `self:resource:` in `getRollOptions()`, so the one flat
 * numeric bonus in the class could not apply at any pool size, and this test held it that way.
 *
 * So the effect publishes its own option from a resolvable pf2e does evaluate — `gte` is one of the
 * comparisons registered on `Math` for rule-element values — and the modifier predicates on that. Live,
 * both ways: AC 27 with points and AC 26 at zero.
 */
const balanceSchrift = contentDoc("soulbound-effects/effect-the-balance-schrift.json");
check(
    "The Balance publishes an option for holding a Reiatsu Point",
    (() => { const r = balanceSchrift.system.rules.find((x) => x.key === "RollOption");
             return [r?.option, r?.value]; })(),
    ["soulbound:reiatsu-remaining", "gte(@actor.system.resources.focus.value,1)"],
);
check(
    "The Balance's AC bonus is a circumstance bonus gated on holding a Reiatsu Point",
    (() => { const r = balanceSchrift.system.rules.find((x) => x.selector === "ac");
             return [r?.type, r?.value, JSON.stringify(r?.predicate)]; })(),
    ["circumstance", 1, JSON.stringify(["soulbound:reiatsu-remaining"])],
);

// Miracle points are the charge pool again, and the resistance reads the badge on its own item.
const miracle = contentDoc("soulbound-effects/effect-miracle-points.json");
check(
    "Miracle points are a counter badge capped at 10, and resistance tracks the count",
    [miracle.system.badge.max, miracle.system.rules.find((r) => r.key === "Resistance")?.value],
    [10, "@item.badge.value"],
);
check(
    "Bailar de Valquiria's fast healing lives on the item holding the count, not beside it",
    miracle.system.rules.some((r) => r.key === "FastHealing" && r.value === "@item.badge.value"),
    true,
);

/* --- all fifteen Spirits, five per Lineage ------------------------------------------------------ */

const ALL_SPIRITS = [
    ["soul-reaper", ["senbonzakura", "zangetsu", "hyorinmaru", "ryujin-jakka", "kyoka-suigetsu"]],
    ["hollow", HOLLOW_SPIRITS],
    ["quincy", QUINCY_SPIRITS],
];
for (const [lineage, names] of ALL_SPIRITS) {
    check(`${lineage} has exactly five Spirits`, names.length, 5);
    for (const name of names) {
        const doc = spiritDoc(name);
        check(`${name}: exactly one Lineage claims it`, [
            doc.system.traits.otherTags.filter((t) => t.startsWith("soulbound-lineage-")),
        ], [[`soulbound-lineage-${lineage}`]]);
    }
}

// Guide §7C: Antithesis's bow "may be used as a melee weapon". Seele Schneider is an ADDITIONAL use of
// it, not a replacement — tagging it as a spirit weapon made reconcile stow the very bow the Schrift is
// about.
const seele = contentDoc("soulbound-equipment/seele-schneider.json");
check(
    "Seele Schneider does not replace the bow",
    [seele.system.traits.otherTags.includes("soulbound-spirit-weapon"),
     seele.system.traits.otherTags.includes("soulbound-seele-schneider")],
    [false, true],
);
check(
    "and it still ignores resistance to slashing, keyed to its own tag",
    contentDoc("soulbound-effects/effect-antithesis-schrift.json")
        .flags["isaacs-hb-pf2e"].bypass[0].predicate,
    ["item:tag:soulbound-seele-schneider"],
);

/* ---------------------------------------------------------------------------------------------- */
/*  Feats, Zanjutsu, Borrowed Nature, and Severance                                                 */
/* ---------------------------------------------------------------------------------------------- */

function featDoc(name) {
    return contentDoc(`soulbound-feats/${name}.json`);
}

// Guide §6.6 calls the kidō ceiling load-bearing: Additional Kidō is Soul Reaper only, three times, and
// a Hollow or Quincy can never exceed two.
const additional = featDoc("additional-kido");
check(
    "Additional Kidō is Soul Reaper only and takeable three times (guide §6.6)",
    [additional.system.maxTakable, JSON.stringify(additional.system.prerequisites.value)],
    [3, JSON.stringify([{ value: "Soul Reaper lineage" }])],
);

// Every Lineage-gated feat must actually say so, or the gate is decoration.
for (const [name, lineage] of [
    ["pesquisa", "Hollow"], ["hirenkyaku-drill", "Quincy"], ["rapid-bala", "Hollow"],
    ["ginto-reserve", "Quincy"], ["cero-doble", "Hollow"], ["blut-discipline", "Quincy"],
    ["descorrer", "Hollow"], ["zanjutsu-hakuda", "Soul Reaper"], ["reishi-mastery", "Quincy"],
    ["segunda-piel-temprana", "Hollow"], ["vollstandig-endurance", "Quincy"],
]) {
    check(`${name} requires its Lineage`,
        featDoc(name).system.prerequisites.value.some((p) => p.value === `${lineage} lineage`), true);
}

// pf2e's frequency intervals are tokens, not English words — "week" would simply never recharge.
check(
    "once-per-week and once-per-hour use pf2e's own interval tokens",
    [featDoc("final-release").system.frequency.per, featDoc("descorrer").system.frequency.per],
    ["P1W", "PT1H"],
);

check(
    "Reactive Strike is granted under its published pf2e name, resolved through the snapshot",
    featDoc("reactive-strike").system.rules.some((r) => r.key === "GrantItem" && String(r.uuid).startsWith("Compendium.pf2e.")),
    true,
);

/* --- the Waning table --------------------------------------------------------------------------- */

const { waningDice, roundOfSeverance } = await import("../scripts/soulbound/severance.mjs");

// Guide §9: dice = 22 − 2 × round, rounds 1–7, refused after. The decay IS the balance lever — §9.0.1
// says if everyone fires on round one the fix is to flatten this table, not cut the ceiling. A number
// that lives in one function can be flattened; one scattered across fifteen documents cannot.
check("the Waning table, all ten rounds (guide §9)", [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(waningDice),
    [20, 18, 16, 14, 12, 10, 8, 0, 0, 0]);
check("and nothing outside it rolls anything", [waningDice(0), waningDice(-1), waningDice(1.5)], [0, 0, 0]);
check("the round of Severance counts from the round it began",
    [roundOfSeverance({ began: 3, now: 3 }), roundOfSeverance({ began: 3, now: 9 })], [1, 7]);

const severanceEffect = contentDoc("soulbound-effects/effect-severance.json");
check("Severance lasts ten rounds", severanceEffect.system.duration, { unit: "rounds", value: 10 });
check(
    "and grants the four immunities guide §9 names",
    severanceEffect.system.rules.filter((r) => r.key === "Immunity").map((r) => r.type).sort(),
    ["death-effects", "doomed", "fear-effects", "frightened"],
);
check(
    "its Strike rider is 4d6 spirit on the spirit weapon",
    (() => { const r = severanceEffect.system.rules.find((x) => x.key === "DamageDice");
             return [r?.diceNumber, r?.dieSize, r?.damageType]; })(),
    [4, "d6", "spirit"],
);

// Both ways out of Severance cost the same, and the cost is a real state.
const severed = contentDoc("soulbound-effects/effect-severed.json");
check(
    "losing Severance drops the pool's ceiling to zero for a week",
    [severed.system.duration, severed.system.rules.find((r) => r.path === "system.resources.focus.cap")?.value],
    [{ expiry: null, sustained: false, unit: "days", value: 7 }, 0],
);

/* --- fifteen Severing Arts, one per Spirit ------------------------------------------------------ */

const ARTS = [
    ["shukei-hakuteiken", "senbonzakura"], ["mugetsu", "zangetsu"], ["hyoten-hyakkaso", "hyorinmaru"],
    ["itto-kaso", "ryujin-jakka"], ["kanzen-saimin-owari", "kyoka-suigetsu"],
    ["desgarron", "pantera"], ["cero-oscuras-ceniza", "murcielago"], ["la-hora-final", "arrogante"],
    ["aullido", "los-lobos"], ["ola-azul", "tiburon"],
    ["sprenger", "antithesis"], ["burning-full-fingers", "the-heat"], ["the-reckoning", "the-balance"],
    ["electrocution", "the-thunderbolt"], ["apotheosis", "the-miracle"],
];
check("there are fifteen Severing Arts, one per Spirit", ARTS.length, 15);
for (const [file, spirit] of ARTS) {
    const doc = techDoc(file);
    check(`${file}: a severing-tier effect at base rank 10, tagged to its Spirit`, [
        doc.system.level.value,
        doc.system.traits.otherTags.includes("sb-tier-severing"),
        doc.system.traits.otherTags.includes(`soulbound-art-${spirit}`),
    ], [10, true, true]);
    // Ittō Kasō is the one Art that beats the table — "the Waning dice **+2d6**" (R-14b) — and
    // `applyWaning` preserves an extra it finds in the formula. Everything else is the bare table.
    check(`${file}: prints round one's 20d6`, doc.system.damage["0"].formula,
        file === "itto-kaso" ? "20d6 + 2d6" : "20d6");
}

// Ittō Kasō is the only Art with a self-cost, and the only one that beats the table.
const itto = techDoc("itto-kaso");
check(
    "Ittō Kasō states its self-cost and its +2d6 in its own text",
    [itto.system.description.value.includes("half your current Hit Points"),
     itto.system.description.value.includes("+2d6")],
    [true, true],
);
/**
 * …and carries it where the dice are rolled, not only where they are described.
 *
 * `applyWaning` preserves a `+NdN` that is already in the formula, and that behaviour has been asserted
 * since it was written — against a hand-built fixture. The shipped content said plain `20d6`, so the
 * only Art that beats the table did not, and the description promised an extra nobody rolled. Driven
 * live at Waning round 1: `22d6 fire`.
 */
check("…and carries the +2d6 in the formula the dice are rolled from",
    itto.system.damage["0"].formula, "20d6 + 2d6");

// Six Arts are extrapolations and must say so where someone reads them.
for (const file of ["kanzen-saimin-owari", "cero-oscuras-ceniza", "la-hora-final", "aullido",
                    "the-reckoning", "apotheosis"]) {
    check(`${file} is marked extrapolated in its own text (guide §9.4)`,
        techDoc(file).system.description.value.includes("Extrapolated"), true);
}

/* --- Zanjutsu ----------------------------------------------------------------------------------- */

for (const file of ["sokotsu", "hitotsume-nadegiri", "shitonegaeshi", "nadegiri", "ikkotsu",
                    "zanjutsu-kendo"]) {
    check(`${file} is a Zanjutsu technique requiring a Released weapon`, [
        techDoc(file).system.traits.otherTags.includes("sb-tier-zanjutsu"),
        techDoc(file).system.requirements,
    ], [true, "Your spirit weapon is Released"]);
}
check("Ikkotsu's stun carries incapacitation (guide §8.4)",
    techDoc("ikkotsu").system.traits.value.includes("incapacitation"), true);
// "One Strike against EACH enemy in reach" is one per confirmed target — the volley's default. A count
// would have fixed the number, which is the opposite of what the technique says.
check("Nadegiri strikes once per enemy caught, with no fixed count",
    techDoc("nadegiri").flags["isaacs-hb-pf2e"].riders[0].apply.count, undefined);
// Phase 2 left this a placeholder on purpose; it now grants a real choice.
check(
    "the Zanjutsu Lineage feature grants one free technique, closing Phase 2's placeholder",
    lineageDoc("zanjutsu").system.rules.filter((r) => r.key === "ChoiceSet").length,
    1,
);

/* --- Seal the Art's suppression, the last item Phase 2 left open -------------------------------- */

const sealNow = contentDoc("soulbound-class-features/actions/seal-the-art.json");
// Guide §5.3: a release state is "not ended outright but suppressed until the end of the target's next
// turn". Deleting a 13th-level Bankai with a 5th-level action is exactly what that clause prevents.
check("Seal the Art suppresses rather than ends", sealNow.flags["isaacs-hb-pf2e"].riders[0].apply.suppress, true);
check(
    "and its own text no longer says the distinction is unimplemented",
    sealNow.system.description.value.includes("not yet distinguished"),
    false,
);


/* ---------------------------------------------------------------------------------------------- */
/*  The release ladder, and the two ways it went wrong                                              */
/* ---------------------------------------------------------------------------------------------- */

/**
 * SB-6. Every Spirit's Released Form used to be granted by its class feature, unconditionally, at the
 * level the feature arrives. A sealed 1st-level Senbonzakura therefore had 15-foot reach, and from 13th
 * the Bankai's `turn-start` emanation and the Full Release fear aura fired every round for free.
 *
 * The form effects are now applied by the Release and Full Release actions and declared, not granted:
 * `flags["isaacs-hb-pf2e"].releaseForm = { rung, effect }`. These checks are the wall that keeps a new
 * Spirit from being authored the old way — the old way passes the validator and looks completely normal.
 */
const spiritFiles = fs
    .readdirSync(path.join(ROOT, "content", "soulbound-class-features", "spirits"))
    .filter((f) => f.endsWith(".json"));

const formFeatures = spiritFiles
    .map((f) => ({ file: f, doc: spiritDoc(f.replace(/\.json$/, "")) }))
    .filter(({ doc }) => doc.flags?.["isaacs-hb-pf2e"]?.releaseForm);

check("every rung of every Spirit declares the form it wears — fifteen at 1st, fifteen at 13th", [
    formFeatures.filter(({ doc }) => doc.flags["isaacs-hb-pf2e"].releaseForm.rung === "released").length,
    formFeatures.filter(({ doc }) => doc.flags["isaacs-hb-pf2e"].releaseForm.rung === "full").length,
], [15, 15]);

const grantsAnEffect = spiritFiles.filter((f) => {
    const doc = spiritDoc(f.replace(/\.json$/, ""));
    return (doc.system.rules ?? []).some(
        (r) => r.key === "GrantItem" && String(r.uuid ?? "").includes("soulbound-effects"),
    );
});
check(
    "and no Spirit feature grants a Released Form outright — that is what made every form permanent",
    grantsAnEffect,
    [],
);

check(
    "Full Release stops granting its own effect too; the action applies it",
    (featureDoc("full-release").system.rules ?? []).some(
        (r) => r.key === "GrantItem" && String(r.uuid ?? "").includes("Effect: Full Release"),
    ),
    false,
);

const fullReleaseEffect = contentDoc("soulbound-effects/effect-full-release.json");
check(
    "Effect: Full Release carries the damage-die step guide §4.8 promises and it never had",
    (fullReleaseEffect.system.rules ?? []).some(
        (r) => r.key === "ItemAlteration" && r.property === "damage-dice-faces" && r.mode === "upgrade",
    ),
    true,
);
check(
    "Tensa Zangetsu opts out of it, because guide §7A says its die does NOT increase",
    (contentDoc("soulbound-effects/effect-tensa-zangetsu.json").system.rules ?? []).some(
        (r) => r.key === "RollOption" && r.option === "soulbound:full-release:no-die-step",
    ),
    true,
);

/**
 * SB-7. `Refined Release` used to be one blanket `+5 to area-size` on every `sb-tier-release` item.
 * That is right for the three Spirits whose Refined benefit is "the emanation increases to 20 feet",
 * wrong for the two whose widening is a different number, and simply false for the three whose Refined
 * benefit is not a widening at all — they were being handed area the guide never gives them.
 *
 * The size now travels with the technique as an `sb-refined-area-<n>` tag, and Refined Release carries
 * one override per distinct size. A technique with no tag gets no area change, which is the default the
 * blanket rule could not express.
 */
const refinedRules = featureDoc("refined-release").system.rules;
check(
    "Refined Release no longer widens every Release Technique by a flat 5 feet",
    refinedRules.some((r) => r.mode === "add" && r.property === "area-size"),
    false,
);

const refinedSizes = new Set(
    refinedRules
        .filter((r) => r.property === "area-size" && r.mode === "override")
        .map((r) => r.value),
);

const REFINED_AREA = {
    // guide §7A–7C, one row per Release Technique whose Refined benefit changes its area
    senbonzakura: 20, "ennetsu-jigoku": 20, respira: 20,
    "getsuga-tensho": 60, "la-gota": 40,
};
// The Refined benefits that are NOT area increases. Listed rather than inferred, because "this one
// gains nothing" is exactly the case the blanket rule got wrong and silence would get wrong again.
const REFINED_NO_AREA = ["garra-de-la-pantera", "cero-metralleta", "galvano-blast"];

for (const [slug, size] of Object.entries(REFINED_AREA)) {
    const tags = techDoc(slug).system.traits.otherTags ?? [];
    check(`${slug}'s Refined area is ${size} feet`, tags.includes(`sb-refined-area-${size}`), true);
    check(`and Refined Release has a rule that can deliver ${size}`, refinedSizes.has(size), true);
}
for (const slug of REFINED_NO_AREA) {
    const tags = techDoc(slug).system.traits.otherTags ?? [];
    check(
        `${slug}'s Refined benefit is not a widening, so it carries no area tag`,
        tags.some((t) => t.startsWith("sb-refined-area-")),
        false,
    );
}


/* ---------------------------------------------------------------------------------------------- */
/*  The choice prompts, and the two ways they were unbounded                                        */
/* ---------------------------------------------------------------------------------------------- */

/**
 * SB-3. `Kidō Learned` offered all eleven Soul Reaper kidō at **every** level — a 1st-level character
 * was shown Kurohitsugi, which guide §6.1 prints as 15th.
 *
 * The gate is the guide's own sentence rather than a table of levels: a kidō has no rank of its own and
 * auto-heightens to half your level rounded up, so you can learn one when your auto-heighten rank
 * reaches its base rank. `Reiatsu.kidoRank` publishes that as `soulbound:kido-rank:<n>` and the filters
 * compare against it, which is also the only form that can gate `Additional Kidō` — a feat takeable at
 * any level, where a static exclusion list is no use at all.
 */
check("a kidō is learnable when your auto-heighten rank reaches its base rank (guide §6)", [
    Reiatsu.kidoRank(1), Reiatsu.kidoRank(7), Reiatsu.kidoRank(9), Reiatsu.kidoRank(13), Reiatsu.kidoRank(15),
], [1, 4, 5, 7, 8]);

// The four gated kidō, at the base rank the guide's printed level implies.
for (const [slug, rank, level] of [
    ["rikujokoro", 4, "7th"], ["soren-sokatsui", 5, "9th"], ["kin", 5, "9th"], ["kurohitsugi", 8, "15th"],
]) {
    const doc = contentDoc(
        `soulbound-kido/${["rikujokoro", "kin"].includes(slug) ? "bakudo" : "hado"}/${slug}.json`,
    );
    check(`${slug} is base rank ${rank}, so it arrives at ${level}`, doc.system.level.value, rank);
}

const GATE = { lte: ["item:level", "soulbound:kido-rank"] };
const kidoChoosers = [
    ...["1st", "2nd", "5th", "9th", "13th", "17th"].map((n) => ({
        label: `Kidō Learned (${n})`,
        doc: lineageDoc(`kido-learned-${n}`),
    })),
    { label: "Additional Kidō", doc: contentDoc("soulbound-feats/additional-kido.json") },
];
for (const { label, doc } of kidoChoosers) {
    const choice = doc.system.rules.find((r) => r.key === "ChoiceSet");
    check(
        `${label} will not offer a kidō above your auto-heighten rank`,
        (choice?.choices?.filter ?? []).some((f) => JSON.stringify(f) === JSON.stringify(GATE)),
        true,
    );
    // SB-2. Two slots could pick the same kidō and both landed: a live 20th-level Soul Reaper finished
    // holding Kurohitsugi twice, knowing five where guide §5.1 promises six.
    const grant = doc.system.rules.find((r) => r.key === "GrantItem");
    check(`${label} refuses a kidō you already know`, grant?.allowDuplicate, false);
}

/**
 * SB-4. Zanjutsu's free 5th-level technique offered all six, and a live 5th-level character was granted
 * `Zanjutsu: Kendō` — a 14th-level technique. Unlike `Additional Kidō` this grant lands at exactly one
 * level, so the gate is static: the two 5th-level sword arts are the rank-2 ones.
 */
const zanChoice = lineageDoc("zanjutsu").system.rules.find((r) => r.key === "ChoiceSet");
check(
    "Zanjutsu's free technique is a 5th-level pick, so it offers only 5th-level sword arts",
    (zanChoice?.choices?.filter ?? []).some((f) => JSON.stringify(f) === JSON.stringify({ lte: ["item:level", 2] })),
    true,
);
check("Sōkotsu and Hitotsume: Nadegiri are the rank-2 pair that gate lets through", [
    techDoc("sokotsu").system.level.value, techDoc("hitotsume-nadegiri").system.level.value,
], [2, 2]);
check("and the four it excludes are all above it", [
    techDoc("shitonegaeshi").system.level.value, techDoc("nadegiri").system.level.value,
    techDoc("ikkotsu").system.level.value, techDoc("zanjutsu-kendo").system.level.value,
].every((r) => r > 2), true);


/**
 * C-35. "Your Release Technique costs no Reiatsu Points, but you can use it only once per round"
 * (guide §4.8) was the one clause of Full Release with nothing behind it at all.
 *
 * Both halves ride on one ledger. `Unbound Technique` is an `action` — the only item types pf2e
 * recharges a frequency on are `action` and `feat`, so an effect cannot hold the allowance itself —
 * granted by `Effect: Full Release`, so it exists exactly as long as the state does. `FreeCast` spends
 * it to pay for the Technique; `Release.beforeCast` reads the same value and refuses a second use.
 */
const unbound = contentDoc("soulbound-class-features/actions/unbound-technique.json");
check("the Full Release allowance is an action, because pf2e only recharges those and feats",
    unbound.type, "action");
check("and it is once per round", unbound.system.frequency, { max: 1, per: "round", value: 1 });
check("it pays for a Release Technique and nothing else",
    unbound.flags["isaacs-hb-pf2e"].freeCast.predicate, ["item:tag:sb-tier-release"]);
check("and it arrives with the Full Release, not with the 13th level",
    fullReleaseEffect.system.rules.some(
        (r) => r.key === "GrantItem" && String(r.uuid).endsWith("Unbound Technique"),
    ),
    true,
);


/* ---------------------------------------------------------------------------------------------- */
/*  Don the Other Face — an action with nothing in it                                               */
/* ---------------------------------------------------------------------------------------------- */

/**
 * F-47, F-48. "**Cost** 1 Reiatsu Point · **Frequency** once per encounter. For **1 minute** you gain
 * your borrowed Lineage's **Aspect**."
 *
 * The action shipped with `rules: []` and no flags — using it did nothing at all, and driven live it
 * cost nothing and put nothing on. What made it look as though it worked is `Second Nature` (feat 18),
 * which grants the 6th-level Aspect **permanently** by its own `GrantItem`: on a sheet carrying that,
 * the mask is simply always there and the action changes nothing visible.
 *
 * It is routed by slug now, like every other action in the class, and reads which face to wear off the
 * `ChoiceSet` answer `Borrowed Nature` already publishes.
 */
const donTheOtherFace = contentDoc("soulbound-class-features/actions/don-the-other-face.json");
check("Don the Other Face is one action, once per encounter",
    [donTheOtherFace.system.actions.value, donTheOtherFace.system.frequency],
    [1, { max: 1, per: "PT10M", value: 1 }]);
check("…and it is routed rather than carrying rules of its own",
    [donTheOtherFace.system.rules,
     fs.readFileSync(path.join(ROOT, "scripts", "soulbound", "actions.mjs"), "utf8")
         .includes('"don-the-other-face"')],
    [[], true]);

// The three Aspects, each lasting the minute the action grants and each arguing with you until 18th.
for (const [file, option] of [
    ["effect-hollows-mask.json", "soulbound:aspect:hollow"],
    ["effect-soul-reapers-discipline.json", "soulbound:aspect:soul-reaper"],
    ["effect-quincys-discipline.json", "soulbound:aspect:quincy"],
]) {
    const aspect = contentDoc(`soulbound-effects/${file}`);
    check(`${aspect.name} lasts a minute`, aspect.system.duration.unit, "minutes");
    check("…and says which face it is", aspect.system.rules[0].option, option);
    // "While it is on, you take a −1 status penalty to Will saves" — and Second Nature takes it away.
    const will = aspect.system.rules.find((r) => r.key === "FlatModifier" && r.selector === "will");
    check("…and argues, until Second Nature makes it yours",
        [will?.value, will?.predicate], [-1, [{ not: "soulbound:second-nature" }]]);
}


/* ---------------------------------------------------------------------------------------------- */
/*  Gintō Reserve — three prepared things are a counter, not a frequency                            */
/* ---------------------------------------------------------------------------------------------- */

/**
 * F-12. "You prepare **3 Gintō** during daily preparations. Each may be spent as a free action to use
 * **Gritz** without spending a Reiatsu Point."
 *
 * The tubes were real — a counter badge reading 3 of 3, on an effect lasting a day — and nothing could
 * spend them. `FreeCast.find` read `system.frequency.value` and only that, so the badge said three and
 * the allowance said nothing: driven live, every Gritz cost its Reiatsu Point with three full tubes on
 * the sheet.
 *
 * pf2e's `frequency` is the wrong shape here and cannot be made right: it belongs to an item and
 * *recharges* on a schedule, where these are consumed and do not come back until the next preparations.
 */
const gintoReserve = contentDoc("soulbound-effects/effect-ginto-reserve.json");
check("three tubes, counted by a badge and lost with the day",
    [gintoReserve.system.badge.type, gintoReserve.system.badge.max, gintoReserve.system.duration],
    ["counter", 3, { expiry: null, sustained: false, unit: "days", value: 1 }]);
check("…and each one pays for a Gritz",
    gintoReserve.flags["isaacs-hb-pf2e"].freeCast,
    { fromBadge: true, label: "Gintō Reserve", predicate: ["item:slug:gritz"] });


/* ---------------------------------------------------------------------------------------------- */
/*  Two feats whose conditions were not conditions                                                  */
/* ---------------------------------------------------------------------------------------------- */

/**
 * F-10. "When you use a kidō, spend 1 additional action to give the target a **−1 circumstance
 * penalty** to its save."
 *
 * The toggle was real and the penalty landed in exactly one place: the module's own `runSave`. Every
 * kidō with a save declares `system.defense.save`, so **pf2e rolls all of them** from the spell card —
 * and driven live the save came back carrying Dexterity and proficiency and nothing else. The feat
 * applied to no kidō in the class.
 *
 * pf2e's own route for "a penalty to saves against your spells" is an `EphemeralEffect` handed to the
 * target for that roll, which is what it has now. The `runSave` path stays for rider-rolled saves.
 */
const kidoFocus = contentDoc("soulbound-feats/kido-focus.json");
const ephemeral = kidoFocus.system.rules.find((r) => r.key === "EphemeralEffect");
check("Kidō Focus reaches a save pf2e rolls",
    [ephemeral?.affects, ephemeral?.selectors, ephemeral?.predicate],
    ["target", ["saving-throw"], ["soulbound:kido-focus", "item:tag:sb-tier-kido"]]);
check("…as a −1 circumstance penalty, and only that",
    contentDoc("soulbound-effects/effect-kido-focus.json").system.rules
        .map((r) => [r.key, r.selector, r.type, r.value]),
    [["FlatModifier", "saving-throw", "circumstance", -1]]);
// It stays a toggle: the extra action is a choice made at the moment you cast.
check("…and the extra action is still the player's to spend",
    kidoFocus.system.rules.find((r) => r.key === "RollOption")?.toggleable, true);

/**
 * F-18. "**Immediately after using a destruction kidō**, use a binding kidō against the same target for
 * 1 fewer Reiatsu Point."
 *
 * The discount was real; the **sequencing was not**. The free cast was predicated on the binding kidō
 * alone, so a Soulbound who had spoken no Hadō at all still got their Bakudō free — driven live, a cold
 * `Hainawa` came out costing nothing.
 *
 * The opening cannot be a rider: `onActionUsed` reads only the used item's riders, so a stamp on the
 * feat could never answer a kidō's cast, and one on each destruction kidō would be authored eight times
 * and forgotten a ninth. The cast pipeline sees every cast.
 */
const combination = contentDoc("soulbound-feats/kido-combination.json");
check("Kidō Combination asks for the opening as well as the Way",
    combination.flags["isaacs-hb-pf2e"].freeCast.predicate,
    ["item:tag:soulbound-kido-bakudo", "soulbound:after-destruction-kido"]);
check("…once per encounter, in the unit pf2e counts",
    combination.system.frequency, { max: 1, per: "PT10M", value: 1 });
const opening = contentDoc("soulbound-effects/effect-kido-combination-opening.json");
check("…and the opening lasts until the end of your turn",
    [opening.system.duration, opening.system.rules.map((r) => r.option)],
    [{ expiry: "turn-end", sustained: false, unit: "rounds", value: 1 },
     ["soulbound:after-destruction-kido"]]);


/* ---------------------------------------------------------------------------------------------- */
/*  Feats: a Flash Step by another name, and a Technique that promised three things                 */
/* ---------------------------------------------------------------------------------------------- */

/**
 * F-13, F-27. "**Flash Step**, then **Strike**."
 *
 * The Flash Step a `Shunpo Strike` performs is a real one, and nothing downstream knew it had happened.
 * Greater Flash Step's afterimage hangs off Flash Step's own `action-used` rider, and Ghost Step's
 * permission was predicated on `item:slug:flash-step` — so a Soulbound who moved by Shunpo Strike left
 * no afterimage and ignored no difficult terrain. An 11th-level feature and a 10th-level feat, both
 * silently switched off by using a 4th-level one.
 *
 * Matched on a **tag** both actions carry, rather than on either one's slug, so a third way to Flash
 * Step says so by declaring itself rather than by being named in two more predicates.
 */
const flashStepAction = contentDoc("soulbound-class-features/core/flash-step.json");
const shunpoStrike = contentDoc("soulbound-feats/shunpo-strike.json");
for (const [label, doc] of [["Flash Step", flashStepAction], ["Shunpo Strike", shunpoStrike]]) {
    check(`${label} declares itself a Flash Step`,
        (doc.system.traits.otherTags ?? []).includes("soulbound-flash-step"), true);
}
/**
 * Both consequences of a Flash Step live on the **actions that perform it**, and neither could live
 * anywhere else. `onActionUsed` reads `ridersOn(item)` — the riders of the item that was used — so a
 * rider sitting on `Ghost Step` could never answer somebody else's Flash Step. Driven live: it never
 * once fired, not even on a plain Flash Step, for as long as it existed.
 */
for (const [label, doc] of [["Flash Step", flashStepAction], ["Shunpo Strike", shunpoStrike]]) {
    check(`${label} carries both, predicated on the feature that grants each`,
        doc.flags["isaacs-hb-pf2e"].riders.map((r) => [r.event, r.predicate, r.self]),
        [["action-used", ["feature:greater-flash-step"], true],
         ["action-used", ["feat:ghost-step"], true]]);
}
check("…and Ghost Step itself grants no rider it cannot fire",
    contentDoc("soulbound-feats/ghost-step.json").flags?.["isaacs-hb-pf2e"]?.riders, undefined);

/**
 * F-37 (#80). "Make one Strike. Before rolling, choose: it ignores all resistances and immunities to
 * its damage type, **or** it treats the target's AC as 2 lower. On a hit, **+5d6**."
 *
 * Three promises, and the Technique shipped with `rules: []` and no riders at all — the only one of the
 * six Zanjutsu with no automation whatever.
 */
const kendo = contentDoc("soulbound-techniques/zanjutsu-kendo.json");
const kendoRiders = kendo.flags["isaacs-hb-pf2e"].riders;
// "Before rolling" is the cast, not the Strike: both answers have to be worn before the die is thrown.
check("Kendō asks before the roll", [kendoRiders[0].event, kendoRiders[0].apply.type, kendoRiders[0].self],
    ["action-used", "choice", true]);
check("…offering exactly the guide's two", kendoRiders[0].apply.options.length, 2);
check("…and +5d6 on a hit, with the spirit weapon",
    [kendoRiders[1].event, kendoRiders[1].apply.formula, kendoRiders[1].outcomes, kendoRiders[1].predicate],
    ["strike-resolved", "5d6", ["success", "criticalSuccess"], ["item:tag:soulbound-spirit-weapon"]]);

const unresisted = contentDoc("soulbound-effects/effect-kendō-unresisted.json");
check("…the first answer ignores resistance and immunity alike",
    unresisted.flags["isaacs-hb-pf2e"].bypass.map((b) => [b.resistance.types, b.immunity.mode, b.immunity.types]),
    [["all", "ignore", "all"]]);
// Capped at −2 on purpose — the guide says so, "so it cannot combine with flanking and a status penalty
// to erase a boss's defence" — and circumstance, so a second circumstance penalty does not stack onto it.
const guard = contentDoc("soulbound-effects/effect-guard-opened.json");
/**
 * Capped at −2 on purpose — the guide says so, "so it cannot combine with flanking and a status penalty
 * to erase a boss's defence" — and a **circumstance** penalty, so a second one does not stack onto it.
 *
 * Unpredicated, and it has to be. The modifier sits on the **defender's** AC, where `item:` means the
 * defender's own items, so no predicate written here can ask which weapon the attacker swung. Driven
 * live both ways: on the `EphemeralEffect` the −2 reached a Hakuda fist it has no business touching,
 * and on the modifier it reached nothing at all. The scope is the clause's own word instead — "make
 * **one** Strike" — and the expire rider below is what enforces it.
 */
check("…and the second takes exactly 2 off the target's AC, as a circumstance penalty",
    guard.system.rules.map((r) => [r.key, r.selector, r.type, r.value, r.predicate]),
    [["FlatModifier", "ac", "circumstance", -2, undefined]]);
check("…and both faces are retired the moment a Strike resolves",
    [kendoRiders[2].event, kendoRiders[2].apply.type, kendoRiders[2].apply.effect.length],
    ["strike-resolved", "expire", 2]);
// Cover lives on the defender and so does AC: the penalty has to be handed to the target's own context.
check("…carried onto the target's roll rather than onto the attacker's",
    contentDoc("soulbound-effects/effect-kendō-opened-guard.json").system.rules
        .map((r) => [r.key, r.selectors]),
    [["EphemeralEffect", ["strike-attack-roll"]]]);


/* ---------------------------------------------------------------------------------------------- */
/*  Zanjutsu Mastery — a 15th-level capstone that was one unread string                             */
/* ---------------------------------------------------------------------------------------------- */

/**
 * SR-09 to SR-12. The Soul Reaper's Lineage Mastery made two promises and kept neither: the feature's
 * whole rules array was a single `RollOption` publishing `soulbound:zanjutsu-mastery`, and **nothing in
 * the module or the content read it**.
 *
 * The die step could not have been written as a rule element even in principle. pf2e's
 * `damage-dice-faces` handler declares `itemType: new fields.StringField({ choices: ["weapon"] })`, and
 * a Zanjutsu technique is a **spell** — so the alteration that looks right is rejected outright.
 */
const zanjutsuMastery = contentDoc("soulbound-class-features/lineages/zanjutsu-mastery.json");
const zmFlags = zanjutsuMastery.flags["isaacs-hb-pf2e"];
check("Zanjutsu Mastery declares the step rather than naming the Techniques in code",
    zmFlags.techniqueDieSteps, { tag: "sb-tier-zanjutsu", value: 1 });

{
    const { applyTechniqueDieSteps } = await import("../scripts/soulbound/die-steps.mjs");
    const spell = (formula, tags) => ({
        system: { traits: { otherTags: tags }, damage: { 0: { formula } } },
    });
    const feature = { flags: { "isaacs-hb-pf2e": { techniqueDieSteps: { tag: "sb-tier-zanjutsu", value: 1 } } } };
    const drilled = spell("2d6", ["sb-tier-zanjutsu"]);
    const elsewhere = spell("2d6", ["sb-tier-release"]);
    // A formula that is not plain dice is left exactly as it is rather than guessed at.
    const flat = spell("@actor.level", ["sb-tier-zanjutsu"]);
    applyTechniqueDieSteps({ items: [feature], itemTypes: { spell: [drilled, elsewhere, flat] } });
    check("…d6 becomes d8, and the number of dice does not move",
        drilled.system.damage[0].formula, "2d8");
    check("…a Technique of another tier is untouched", elsewhere.system.damage[0].formula, "2d6");
    check("…and a formula that is not plain dice is left alone",
        flat.system.damage[0].formula, "@actor.level");

    // "d8→d10" is the guide's own second example, and d12 is where pf2e's ladder stops.
    const eight = spell("1d8", ["sb-tier-zanjutsu"]);
    const twelve = spell("3d12", ["sb-tier-zanjutsu"]);
    applyTechniqueDieSteps({ items: [feature], itemTypes: { spell: [eight, twelve] } });
    check("…d8 becomes d10", eight.system.damage[0].formula, "1d10");
    check("…and nothing goes past d12", twelve.system.damage[0].formula, "3d12");

    // An actor with no such declaration pays nothing for this at all.
    const untouched = spell("2d6", ["sb-tier-zanjutsu"]);
    applyTechniqueDieSteps({ items: [], itemTypes: { spell: [untouched] } });
    check("…and a Soul Reaper below 15th is not stepped",
        untouched.system.damage[0].formula, "2d6");
}

/**
 * The other half: "Once per round, when you critically hit with your spirit weapon, you regain 1 Reiatsu
 * Point; this ignores Rising Pressure's per-encounter cap." Word for word the clause `Unsealed` makes at
 * 19th, and the same mechanism — `pool` could only ever spend until `gain` existed.
 */
/**
 * F-44. "Your Release Technique's damage dice increase by **two steps** (d6→d10, d8→d12)."
 *
 * `Beyond the Blade` shipped as **two** `damage-dice-faces` alterations, which reads exactly like the
 * sentence and was worth **nothing**: pf2e's handler takes `itemType: ["weapon"]` and a Release Technique
 * is a spell, so both were rejected outright. Driven live at 18th, Senbonzakura read `2d6` — the pack's
 * own base. And even on a weapon the pair would have been worth one step, because the handler latches
 * after the first upgrade on purpose.
 *
 * So it uses the same declaration Zanjutsu Mastery does, asking for two steps instead of one.
 */
const beyondTheBlade = contentDoc("soulbound-feats/beyond-the-blade.json");
check("Beyond the Blade steps a Technique twice, and no longer by an alteration that cannot work",
    [beyondTheBlade.system.rules,
     beyondTheBlade.flags["isaacs-hb-pf2e"].techniqueDieSteps],
    [[], { tag: "sb-tier-release", value: 2 }]);
{
    const { applyTechniqueDieSteps } = await import("../scripts/soulbound/die-steps.mjs");
    const spell = (formula) => ({
        system: { traits: { otherTags: ["sb-tier-release"] }, damage: { 0: { formula } } },
    });
    const feature = { flags: { "isaacs-hb-pf2e": { techniqueDieSteps: { tag: "sb-tier-release", value: 2 } } } };
    const six = spell("2d6");
    const eight = spell("1d8");
    applyTechniqueDieSteps({ items: [feature], itemTypes: { spell: [six, eight] } });
    // The guide's own two examples.
    check("…d6 → d10", six.system.damage[0].formula, "2d10");
    check("…and d8 → d12", eight.system.damage[0].formula, "1d12");
}

const zmRefund = zmFlags.riders[0];
check("…and a critical hit with the spirit weapon hands a point back",
    [zmRefund.event, zmRefund.apply.type, zmRefund.apply.gain, zmRefund.outcomes],
    ["strike-resolved", "pool", 1, ["criticalSuccess"]]);
check("…once in a round", zmRefund.oncePerRound, true);
check("…and only with the spirit weapon",
    [zmRefund.predicate, zmRefund.self], [["item:tag:soulbound-spirit-weapon"], true]);


/* ---------------------------------------------------------------------------------------------- */
/*  Seal the Art — the suppression that suppressed nothing                                          */
/* ---------------------------------------------------------------------------------------------- */

/**
 * Q-18, Q-19. "A release state … is **not ended outright but suppressed** until the end of the target's
 * next turn, and the target can't re-enter it during that time."
 *
 * The counteract path wrote `effect.update({ disabled: true })`, and **a pf2e Effect item has no
 * `disabled` field**. The one it does have, `system.expired`, is derived from `remainingDuration` in
 * `prepareBaseData` and is rewritten on every preparation. Driven live: a Quincy spent a Reiatsu Point,
 * the card announced that a 17th-level Shikai was suppressed, and all three of its rule elements were
 * still live on the actor a moment later. Re-entry was not refused either — the marker flag was read by
 * nothing at all.
 */
{
    const { Suppression } = await import("../scripts/soulbound/suppression.mjs");
    const effect = (rules) => ({ _source: { system: { rules } } });

    // Parked and put back, so the rules must be ones that survive the round trip — the same reasoning
    // `rulesAreSafeToRefresh` gives: a `GrantItem` or a `ChoiceSet` carries state *inside* the array.
    check("a release state of plain synthetics can be parked",
        Suppression.canSuppress(effect([{ key: "FlatModifier" }, { key: "Resistance" }])), true);
    check("…one holding a grant cannot", Suppression.canSuppress(effect([{ key: "GrantItem" }])), false);
    check("…nor one holding a choice", Suppression.canSuppress(effect([{ key: "ChoiceSet" }])), false);
    check("…and an effect with no rules at all is trivially safe", Suppression.canSuppress(effect([])), true);

    // "Can't re-enter it during that time" — asked of the whole actor, because re-entering is climbing
    // the ladder again rather than re-creating one named effect.
    //
    // Driven live, and the first shape of this failed: the block was read off the suppressed *effect*,
    // so the target re-sealed — which takes the release-state effect off the sheet — and the very next
    // Release went through. Re-sealing to wash off a seal is precisely the loophole this closes, so the
    // window is stamped on the **actor**, where taking an effect off cannot erase it.
    const sealed = (flag) => ({ getFlag: () => flag });
    check("a Soulbound whose art is sealed may not climb the ladder again",
        Suppression.blocked(sealed({ turns: 1 })), true);
    check("…nor while Sklaverei's minute is running",
        Suppression.blocked(sealed({ until: 12345 })), true);
    check("…and one with nothing sealed is free", Suppression.blocked(sealed(null)), false);
}


/* ---------------------------------------------------------------------------------------------- */
/*  Final Release — the capstone that entered itself                                                */
/* ---------------------------------------------------------------------------------------------- */

/**
 * X-01. "**Frequency** once per week · **Requirements** You are 20th level and your spirit weapon is
 * in its released form."
 *
 * The feat carried a `GrantItem` for `Effect: Severance`, and a `GrantItem` fires when the **item is
 * created** — so choosing the feat put a 20th-level character into Severance on the spot, for ten
 * rounds, without the three actions and without either requirement being looked at. Driven live:
 * adding the feat to a **sealed** Soulbound put the effect straight onto the sheet.
 *
 * `Severance.begin()` has been the intended entry point since it was written and its own comment says
 * it "was never reached". It has a caller now, routed by slug like every other rung of the ladder.
 */
const finalRelease = contentDoc("soulbound-feats/final-release.json");
check("Final Release is three actions, once per week",
    [finalRelease.system.actions.value, finalRelease.system.frequency],
    [3, { max: 1, per: "P1W", value: 1 }]);
check("…auditory, concentrate, reiatsu — the guide's own three",
    [...finalRelease.system.traits.value].sort(),
    ["auditory", "concentrate", "reiatsu", "soulbound"]);
check("…and it grants nothing on its own: Severance belongs to the use, not to the choosing",
    finalRelease.system.rules, []);

/**
 * X-03 to X-07. Severance is one effect and every general clause of §9.0 is a rule on it.
 */
/**
 * A refusal must not cost the allowance it is refusing.
 *
 * `createUseActionMessage` decrements `system.frequency.value` and *then* posts the card, and the card
 * is all this module ever sees — so by the time any requirement is checked, the use is already gone.
 * Driven live: a Final Release turned away for the wrong requirement left the feat reading **0 of 1 per
 * week**, and the week's one use was spent on a capstone that never happened.
 */
{
    const { refundUse } = await import("../scripts/soulbound/release.mjs");
    const fake = (frequency) => {
        const item = { system: { frequency }, updated: null };
        item.update = async (data) => { item.updated = data; };
        return item;
    };
    const spent = fake({ value: 0, max: 1, per: "P1W" });
    await refundUse(spent);
    check("a refused use comes back", spent.updated, { "system.frequency.value": 1 });
    // Clamped, so an action used by some other route — which pf2e never decremented — cannot be handed
    // a use it did not spend.
    const full = fake({ value: 2, max: 2, per: "day" });
    await refundUse(full);
    check("…and never more than the maximum", full.updated, null);
    const none = fake(null);
    await refundUse(none);
    check("…and an item with no frequency is left alone", none.updated, null);
}

const severKey = (key) => severanceEffect.system.rules.filter((r) => r.key === key);
// The duration, the immunities and the 4d6 rider are asserted above, where the Waning table is.
check("Severance puts the Speed up by 20 feet",
    severKey("FlatModifier").map((r) => [r.selector, r.value]), [["speed", 20]]);
const alterations = severKey("ItemAlteration");
check("…and Flash Step to twice per round",
    alterations.filter((r) => JSON.stringify(r.predicate).includes("flash-step")).map((r) => [r.property, r.value]),
    [["frequency-max", 2]]);
// "Cost nothing and have no frequency limit" is two mechanisms, not one: the price is waived by an
// unlimited `freeCast`, and the cap is raised past any real number by an alteration.
check("…the Release Technique and every kidō costing nothing, without limit",
    [severanceEffect.flags["isaacs-hb-pf2e"].freeCast.unlimited,
     alterations.filter((r) => JSON.stringify(r.predicate).includes("sb-tier-kido")).map((r) => r.value)],
    [true, [99]]);
check("…and the Full Release it hands you costing no fatigue",
    severKey("RollOption").map((r) => r.option).sort(),
    ["soulbound:no-full-release-fatigue", "soulbound:severance"]);


/*  Kidō — the four clauses that were descriptions                                                  */
/* ---------------------------------------------------------------------------------------------- */

/**
 * Four kidō shipped with a sentence each that nothing behind it read. They are grouped because they are
 * the same failure four times: a clause that is true on the card, false at the table, and silent either
 * way — a predicate that matches nothing does not complain.
 */

// K-09. "Ignores lesser cover." Byakurai had no rules, no riders and no flags at all, so the one line
// separating it from any other 2d6 attack cantrip did nothing. The machinery already existed for
// Senbonzakura's scattered blades; what it could not do was belong to an *item* rather than a stance.
const { ignoringCover, withoutCover, LESSER_COVER } = await import("../scripts/soulbound/scattered.mjs");
const paleLightning = kidoDoc("hado", "byakurai");
check("Byakurai declares that it goes through lesser cover",
    paleLightning.flags["isaacs-hb-pf2e"].ignoresCover, "lesser");
const lesser = ignoringCover(null, paleLightning);
check("…which the engine reads off the item, not off the caster", lesser?.max, LESSER_COVER);
check("…and lesser cover is pf2e's +1", LESSER_COVER, 1);
// The cap is the point: reading it as "any cover" makes a 1st-rank kidō better than a Shikai.
check("…so +1 comes out of the DC", withoutCover({ value: 30 }, 1).value, 29);
check("…and +2 — standard cover — does not",
    withoutCover({ value: 30 }, 2 <= lesser.max ? 2 : 0).value, 30);
check("a stance still ignores every kind", ignoringCover(
    { getRollOptions: () => ["soulbound:senbonzakura:gokei"] }, null)?.max, Infinity);

// K-17. "You **or an ally within 15 ft.**" — `damage-received` is the defender's own event, so when the
// ally was the one hit the engine read the ally's items and the Soul Reaper's kidō was not among them.
// Fourth ability to need `ally-damaged`, after Antithesis and The Balance.
const splittingVoid = kidoDoc("bakudo", "danku").flags["isaacs-hb-pf2e"].riders;
check("Danku answers both ends of its trigger",
    splittingVoid.map((r) => r.event), ["damage-received", "ally-damaged"]);
check("…the ally half reaching 15 feet, which is the clause's own number",
    splittingVoid[1].range, 15);
check("…and putting the wall in front of the creature that was hurt",
    splittingVoid[1].apply.riders[0].trigger, "ally");
/**
 * "Resistance equal to **your** level" — the caster's.
 *
 * The effect's rule said `@actor.level`, which is resolved on the sheet it lands on. While the kidō
 * could only ever protect its own caster the two were the same number and the bug was invisible; the
 * ally half would have made a 3rd-level ally resist 3 from a 17th-level Soul Reaper's wall.
 */
for (const [index, rider] of splittingVoid.entries()) {
    check(`…and the resistance is the caster's level on ${index === 0 ? "the self" : "the ally"} half`,
        rider.apply.riders[0].apply.substitutions,
        [{ path: "system.rules.0.value", value: "origin.level" }]);
}

/**
 * K-07. "**`Additional Kidō` … is Soul Reaper only** … A Hollow or Quincy can never exceed two."
 *
 * The feat said so in `prerequisites`, which pf2e **displays and never tests** — it is a string for the
 * reader, not a gate. Its ChoiceSet already refused to offer a Hollow's or a Quincy's own arts, so a
 * Hollow taking it could not pick Cero twice; what it could do was pick Sōkatsui, and the guide's hard
 * ceiling of two is the whole reason the Lineage gets Hierro and Regeneración instead.
 *
 * The predicate is on the **ChoiceSet only**. A `GrantItem` gated on a predicate is tested once, at
 * creation, and the validator refuses one without `reevaluateOnUpdate` for that reason — but there is
 * nothing to gate: with no selection made, the grant's `{item|flags…}` uuid resolves to nothing and
 * hands over nothing.
 */
const extraKido = contentDoc("soulbound-feats/additional-kido.json");
const extraChoice = extraKido.system.rules.find((r) => r.key === "ChoiceSet");
check("Additional Kidō may be taken three times", extraKido.system.maxTakable, 3);
check("…by a Soul Reaper, and tested rather than merely printed",
    extraChoice.predicate, ["feature:soul-reaper"]);
check("…and the grant carries no predicate of its own",
    extraKido.system.rules.find((r) => r.key === "GrantItem").predicate, undefined);
// The filter is the second half of the ceiling: no cantrips, no other Lineage's arts, nothing above the
// rank the character's own level allows.
check("…choosing a costed kidō of neither other Lineage, within rank",
    JSON.stringify(extraChoice.choices.filter),
    JSON.stringify(["item:tag:sb-tier-kido", { not: "item:trait:cantrip" },
        { not: "item:tag:soulbound-kido-hollow" }, { not: "item:tag:soulbound-kido-quincy" },
        { lte: ["item:level", "soulbound:kido-rank"] }]));

// K-18. "can't cast spells or use kidō" was a line on an effect with `rules: []`. The cast pipeline
// already refuses a cast for three other reasons; this is the fourth, read off an option so anything
// else that seals a voice gets the same refusal.
const silenced = contentDoc("soulbound-effects/effect-silenced-chain.json");
check("a sealed voice says so where something can read it",
    silenced.system.rules.filter((r) => r.key === "RollOption").map((r) => [r.option, r.domain]),
    [["soulbound:silenced", "all"]]);

// K-19. "At 9th level, also remove one of clumsy, enfeebled, or stupefied." Sixty condition riders
// across both classes apply a condition; not one of them lifted one until this.
const mend = kidoDoc("kaido", "kaido").flags["isaacs-hb-pf2e"].riders[0];
check("Mend the Weave offers its 9th-level half on the cast",
    [mend.event, mend.apply.type], ["action-used", "choice"]);
// The caster's level, not the kidō's rank: a kidō auto-heightens to half your level, so rank 5 *is*
// 9th level, and writing the rank would have been right by accident and wrong for every other kidō.
check("…from 9th level, counted on the caster", mend.predicate, [{ gte: ["self:level", 9] }]);
check("…lifting exactly the three the guide names",
    mend.apply.options.map((o) => o.riders[0].apply.slug), ["clumsy", "enfeebled", "stupefied"]);
check("…removing them rather than stepping them down",
    mend.apply.options.every((o) => o.riders[0].apply.remove === true), true);
// Offered only where there is something to lift, so the card does not promise a mend it cannot make.
check("…and offering only what is actually there",
    mend.apply.options.map((o) => o.predicate[0]),
    ["rider:target:condition:clumsy", "rider:target:condition:enfeebled",
     "rider:target:condition:stupefied"]);


/* ---------------------------------------------------------------------------------------------- */
/*  Unsealed, the afterimage, and the two allowances nothing spent                                  */
/* ---------------------------------------------------------------------------------------------- */

/**
 * C-39. `Unsealed` (19th) makes three promises and shipped with one.
 *
 * > You can use Full Release **twice per day**. While in a Full Release you're immune to fear effects,
 * > and the first time each round you critically hit with your spirit weapon you regain 1 Reiatsu Point.
 *
 * The `ItemAlteration` raising the frequency to 2 was there and works. The other two were prose: nothing
 * anywhere granted fear immunity, and nothing anywhere handed a point back — `pool` could only ever
 * spend, which is why `gain` exists now.
 *
 * Both live on the **effect** rather than on the feature, because both are true only while the Full
 * Release stands, and both are predicated on the feature so a 13th-level Full Release does not get them.
 */
const unsealed = contentDoc("soulbound-class-features/core/unsealed.json");
check("Unsealed raises Full Release to twice per day, by altering the feat's own frequency",
    unsealed.system.rules.filter((r) => r.key === "ItemAlteration" && r.property === "frequency-max")
        .map((r) => [r.value, r.predicate]),
    [[2, ["item:slug:full-release"]]]);

// `fear-effects` and not `fear`: pf2e's immunity list is its own, and "fear" there is the *trait*. The
// validator caught this before it shipped — an `Immunity` with a type pf2e does not know is dropped
// during preparation without a word, which is a fear immunity that is not one.
const fearImmunity = fullReleaseEffect.system.rules.find((r) => r.key === "Immunity");
check("…a Full Release with Unsealed is immune to fear", [fearImmunity?.type, fearImmunity?.predicate],
    ["fear-effects", ["feature:unsealed"]]);

const refund = fullReleaseEffect.flags["isaacs-hb-pf2e"].riders
    .find((r) => r.event === "strike-resolved");
check("…and a critical hit with the spirit weapon hands a point back",
    [refund?.apply?.type, refund?.apply?.gain, refund?.outcomes, refund?.self],
    ["pool", 1, ["criticalSuccess"], true]);
// "The **first time each round**" — the same count `Tensa Zangetsu` needed, and the same one the
// afterimage below was missing. A rider that does not ask for the gate is never consulted by it.
check("…once in a round, not once per critical hit", refund?.oncePerRound, true);
check("…and only with the spirit weapon, on a character who has Unsealed",
    refund?.predicate, ["feature:unsealed", "item:tag:soulbound-spirit-weapon"]);

/**
 * C-29. "The **first attack** made against you **each round** requires … a DC 5 flat check."
 *
 * Driven live: D1 threw two Fists at a released Senbonzakura in one round and the afterimage offered its
 * flat check on **both**. The clause's whole shape is "first", and the rider had no way to count.
 */
const afterimage = contentDoc("soulbound-effects/effect-greater-flash-step.json");
const flatCheck = afterimage.flags["isaacs-hb-pf2e"].riders[0];
check("the afterimage answers an attack that has landed on you",
    [flatCheck.event, flatCheck.self], ["strike-received", true]);
check("…once each round, however many attacks come", flatCheck.oncePerRound, true);
check("…and it is a DC 5 flat check",
    [flatCheck.apply.riders[0].apply.type, flatCheck.apply.riders[0].apply.dc], ["flat-check", 5]);
// It is worn for a round, from Flash Step, and only by a character who has the 11th-level feature.
const stepping = contentDoc("soulbound-class-features/core/flash-step.json");
check("…worn by Flash Step, and only from 11th",
    [stepping.flags["isaacs-hb-pf2e"].riders[0].event,
     stepping.flags["isaacs-hb-pf2e"].riders[0].predicate],
    ["action-used", ["feature:greater-flash-step"]]);
check("…and Flash Step is itself once per round",
    stepping.system.frequency, { max: 1, per: "round", value: 1 });


/* ---------------------------------------------------------------------------------------------- */
/*  A basic save's four degrees                                                                     */
/* ---------------------------------------------------------------------------------------------- */

/**
 * SB-13/SB-14. A self-rolled save — an aura tick, a turn-start emanation — is not a spell's own save,
 * so pf2e never applies the basic ladder for it. Every one of them in the content carried the ladder by
 * hand, and **not one doubled on a critical failure**. Written out three times per ability, the missing
 * fourth line is invisible; `basic: true` writes it once.
 */
const { basicLadder } = await import("../scripts/riders/apply.mjs");

const damageOnly = { basic: true, riders: [{ apply: { type: "damage", formula: "5d6", damageType: "slashing" } }] };
check("a basic save halves on a success, doubles on a critical failure, and pays nothing on a critical success",
    basicLadder(damageOnly).map((r) => [r.outcomes[0], r.apply.multiplier ?? 1]),
    [["success", 0.5], ["failure", 1], ["criticalFailure", 2]]);

check("without the flag the riders are left exactly as written",
    basicLadder({ riders: [{ apply: { type: "damage", formula: "1d6" } }] }).length, 1);

check("a damage rider that names its own outcomes is not expanded — an ability off the ladder says so",
    basicLadder({ basic: true, riders: [{ outcomes: ["failure"], apply: { type: "damage", formula: "1d6" } }] }).length,
    1);

check("and a condition is not scaled by a degree of success at all",
    basicLadder({ basic: true, riders: [{ apply: { type: "condition", slug: "off-guard" } }] })[0].outcomes,
    undefined);

// The two the guide calls basic, now saying so in one word each.
const kageyoshi = contentDoc("soulbound-effects/effect-senbonzakura-kageyoshi.json");
const kageRider = kageyoshi.flags["isaacs-hb-pf2e"].riders[0];
check("Senbonzakura Kageyoshi's emanation is a basic Reflex, not free damage (guide §7A)",
    [kageRider.apply.type, kageRider.apply.statistic, kageRider.apply.basic,
     [kageRider.area].flat()[0]],
    ["save", "reflex", true, { type: "emanation", value: 20 }]);
check("and it still deals 5d6 slashing rising a die a rank",
    [kageRider.apply.riders[0].apply.formula, kageRider.apply.riders[0].apply.perStep],
    ["5d6", "1d6"]);

const thunder = contentDoc("soulbound-effects/effect-thunderbolt-form.json");
check("Thunderbolt Form's aura is a basic Reflex too (guide §7C)",
    thunder.flags["isaacs-hb-pf2e"].riders[0].apply.basic, true);


/* ---------------------------------------------------------------------------------------------- */
/*  SB-15 — an aura that never left the caster                                                      */
/* ---------------------------------------------------------------------------------------------- */

/**
 * `targetsFor` checked `rider.self` before `rider.area`, so a rider with both resolved to the origin's
 * own token and the area was never built. Every Soulbound aura says `self: true` — it reads correctly,
 * "this aura is mine" — so all six emptied: driven live, a 13th-level Senbonzakura rolled its own
 * Reflex save against its own DC and took its own 5d6 while the ghoul beside it took nothing.
 *
 * These pin the shape of the content rather than the engine, because the engine change is one line and
 * the thing that will drift is a seventh aura authored to the same pattern.
 */
// Effect: Full Release is not in this list, nor Effect: Minami, nor Effect: Respira Absoluta: all three
// emanations were promoted to real pf2e `Aura`s, which catch per creature at the end of ITS turn rather
// than sweeping at the caster's. Minami went that way first — driven live, two enemies were grabbed the
// instant the *caster's* turn ended, which is not what "enemies that end their turn in it" says — and
// Respira Absoluta followed it for the identical reason at the identical moment in a drive.
//
// **Effect: Thunderbolt Form has joined them.** It was left as an area rider on purpose — the note here
// said it belonged to the Quincy pass, where it could be driven rather than changed on the strength of
// somebody else's drive — and the Quincy pass drove it: on the old shape the current paid out at the
// **Quincy's** turn end and never once when a creature stood in it.
//
// The two `turn-start` entries below are correct as area riders: Zanka no Tachi's ambient heat and
// Kageyoshi's petals both say "at the start of each of **your** turns", which is a sweep.
const AURAS = [
    ["soulbound-effects/effect-senbonzakura-kageyoshi.json", "turn-start", 20],
    ["soulbound-effects/effect-zanka-no-tachi.json", "turn-start", 30],
];

// And the promoted ones, pinned the other way: a real `Aura` rule, and no area rider left behind to
// sweep in parallel with it.
const PROMOTED = [
    ["soulbound-effects/effect-full-release.json", 15],
    ["soulbound-effects/effect-minami.json", 20],
    ["soulbound-effects/effect-respira-absoluta.json", 20],
    ["soulbound-effects/effect-thunderbolt-form.json", 10],
];
for (const [file, radius] of PROMOTED) {
    const doc = contentDoc(file);
    const aura = doc.system.rules.find((rule) => rule.key === "Aura");
    check(`${file.split("/").pop()} is a real pf2e Aura of ${radius} feet`, aura?.radius, radius);
    check("…and nothing beside it sweeps at the caster's turn end",
        (doc.flags["isaacs-hb-pf2e"].riders ?? []).filter((r) => r.event === "turn-end").length, 0);
}
for (const [file, event, radius] of AURAS) {
    const rider = contentDoc(file).flags["isaacs-hb-pf2e"].riders[0];
    // A rider may carry several shapes; the first is the one centred on the caster.
    const first = [rider.area].flat()[0];
    check(`${file.split("/").pop()} is a ${radius}-foot ${event} aura`,
        [rider.event, first?.type, first?.value], [event, "emanation", radius]);
    check("and it says who it catches, in one place or the other",
        Boolean(rider.areaTargeting?.affects ?? rider.area?.affects), true);
}


/* ---------------------------------------------------------------------------------------------- */
/*  SB-16 and SB-17 — two predicates and two properties that named nothing                          */
/* ---------------------------------------------------------------------------------------------- */

/**
 * SB-16. `sluggify` here reduces anything outside `[a-z0-9]` to a separator, so "Getsuga Tenshō" is
 * built as **`getsuga-tensh`** — the macron is dropped, not transliterated. `Effect: Tensa Zangetsu`
 * predicated on `getsuga-tensho`, which reads perfectly next to the name and matches nothing.
 */
const tensa = contentDoc("soulbound-effects/effect-tensa-zangetsu.json");
const getsugaRules = tensa.system.rules.filter((r) => JSON.stringify(r.predicate ?? []).includes("getsuga"));
check("Tensa Zangetsu names the slug the build actually writes",
    getsugaRules.every((r) => r.predicate.includes("item:slug:getsuga-tensh")), true);

/**
 * And the line is two predicated overrides rather than an `add`: an `add` racing Refined Release's own
 * `override` to 60 resolved to whichever ran last, and it was the override — so guide §7A's
 * "60 feet (90 with Refined)" never reached 90.
 */
check("Getsuga's line is 60 without Refined Release and 90 with it (guide §7A)",
    getsugaRules.filter((r) => r.property === "area-size")
        .map((r) => [r.value, r.predicate.some((p) => typeof p === "object" && p.not === "feature:refined-release")])
        .sort((a, b) => a[0] - b[0]),
    [[60, true], [90, false]]);

/**
 * SB-17. pf2e's `ItemAlteration` handler map has no entry for an action cost, and an unknown property
 * is dropped at schema validation — so `{"property": "time"}` on Tensa and `{"property":
 * "action-cost"}` on Instant Full Release were both inert, and both are the whole point of their
 * ability. The module supplies that one capability through an `actionCost` flag.
 */
const { applyActionCosts } = await import("../scripts/soulbound/action-cost.mjs");

check("Tensa declares Getsuga at one action (guide §7A)",
    tensa.flags["isaacs-hb-pf2e"].actionCost, [{ slug: "getsuga-tensh", value: 1 }]);
check("Instant Full Release declares Full Release at one action (guide §8.5)",
    contentDoc("soulbound-feats/instant-full-release.json").flags["isaacs-hb-pf2e"].actionCost,
    [{ slug: "full-release", value: 1 }]);
check("and neither still carries a property pf2e would throw away",
    [...tensa.system.rules, ...contentDoc("soulbound-feats/instant-full-release.json").system.rules]
        .some((r) => ["time", "action-cost"].includes(r.property)),
    false);

// The compression itself, on a stand-in actor: a spell carries its cost as a string, a feat as a number.
const fakeActor = {
    items: [
        { flags: { "isaacs-hb-pf2e": { actionCost: [{ slug: "getsuga-tensh", value: 1 }] } }, system: {} },
        { system: { slug: "getsuga-tensh", time: { value: "2" } } },
        { system: { slug: "full-release", actions: { value: 2 } } },
    ],
};
applyActionCosts(fakeActor);
check("a two-action spell becomes one action, and an unrelated item is untouched",
    [fakeActor.items[1].system.time.value, fakeActor.items[2].system.actions.value], ["1", 2]);

const cheaper = { items: [
    { flags: { "isaacs-hb-pf2e": { actionCost: [{ slug: "x", value: 2 }] } }, system: {} },
    { system: { slug: "x", time: { value: "1" } } },
] };
applyActionCosts(cheaper);
check("and a declaration never raises a cost that is already lower",
    cheaper.items[1].system.time.value, "1");


/* ---------------------------------------------------------------------------------------------- */
/*  Charge pools — the third machine with no caller                                                 */
/* ---------------------------------------------------------------------------------------------- */

/**
 * `charges.mjs` could spend and refresh a pool since Phase 3, and nothing ever called it. The counter
 * badges were authored — Hyōrinmaru's three petal-flowers, Los Lobos' eight wolves — and simply never
 * moved: all three petal Techniques were usable every round, for ever, which is three times the damage
 * the Bankai is costed for with nothing on the sheet to show it.
 *
 * Two entry points now, matching the two ways an ability reaches the table. A Technique that is **cast**
 * is refused before it resolves (`Charges.beforeCast`, in the cast pipeline beside the release gate); a
 * Technique that is a **reaction** never passes through `cast`, so its spend is a `charge` rider on the
 * prompt being accepted.
 */
const { Charges } = await import("../scripts/soulbound/charges.mjs");

const pool = contentDoc("soulbound-effects/effect-daiguren-hyorinmaru.json");
check("the petal-flowers are a counter of three (guide §7A)",
    [pool.system.badge.type, pool.system.badge.value, pool.system.badge.max], ["counter", 3, 3]);
check("and they only come back once Perfected Full Release is on the sheet",
    pool.flags["isaacs-hb-pf2e"].chargeRefresh,
    { regain: 1, requires: "feature:perfected-full-release" });

// Los Lobos regains a wolf every turn from 13th, with no Perfected clause at all — the same machine,
// a different schedule, said in content rather than in code.
check("Los Lobos' wolves regain one a turn from 13th, unconditionally (guide §7B)",
    contentDoc("soulbound-effects/effect-colmillo.json").flags["isaacs-hb-pf2e"].chargeRefresh,
    { regain: 1 });

for (const slug of ["sennen-hyoro", "hyoryu-senbi"]) {
    check(`${slug} spends one petal-flower, once per round`,
        Charges.declarationOn(techDoc(slug)),
        { effect: "Effect: Daiguren Hyōrinmaru", spending: 1, perRound: 1, upTo: 0, all: false });
}

/**
 * Los Lobos spends a *variable* number, and it is the only Spirit that does.
 *
 * *Colmillo* is "expend **any number** of wolves — **each** wolf you expend … detonates in a 10-foot
 * burst", so one question decides both how much the pool pays and how many areas go on the cursor.
 * *Aullido* is "you expend **all** remaining wolves", which is not a choice.
 *
 * Before this, neither Technique declared a spend at all: the pool filled to eight and never emptied,
 * and Colmillo was an unlimited one-action 3d6 burst. Driven live, eight wolves survived a cast.
 */
check("Colmillo — Fang spends from the wolves, any number up to eight",
    Charges.declarationOn(techDoc("colmillo-fang")),
    { effect: "Effect: Colmillo", spending: 1, perRound: Infinity, upTo: 8, all: false });
check("…and takes its burst count from that answer rather than a fixed one",
    techDoc("colmillo-fang").flags["isaacs-hb-pf2e"].areaTargeting.areas ?? "from the answer",
    "from the answer");
check("Aullido expends every wolf that is left",
    Charges.declarationOn(techDoc("aullido")),
    { effect: "Effect: Colmillo", spending: 1, perRound: Infinity, upTo: 0, all: true });

/* --- one Technique, five shapes, and only one of them an attack --------------------------------- */

/**
 * Burner Finger is the only Technique in the class built out of pf2e spell **overlays**, and the three
 * area options inherited the base's **attack** trait. pf2e derives `defense.passive = AC` from that
 * trait (`spell/document.ts`: `if (traits.value.includes("attack"))`), so Three, Four and Five each
 * announced "Defense AC and basic Reflex" on the card and counted as attack spells for damage domains.
 *
 * Two keeps the trait, because Two really is a ranged spell attack against two creatures.
 */
{
    const bf = techDoc("burner-finger");
    const overlay = (k) => bf.system.overlays[k];
    check("Burner Finger's five shapes", [
        [bf.system.target?.value, JSON.stringify(bf.system.area ?? null)],
        [overlay("burnerfingertwo").system.target?.value, JSON.stringify(overlay("burnerfingertwo").system.area ?? null)],
        JSON.stringify(overlay("burnerfingerthree").system.area),
        JSON.stringify(overlay("burnerfingerfour").system.area),
        JSON.stringify(overlay("burnerfingerfive").system.area),
    ], [
        ["1 creature", "null"],
        ["2 creatures", "null"],
        '{"type":"line","value":30}',
        '{"type":"emanation","value":15}',
        '{"type":"cone","value":30}',
    ]);
    check("…the attack is the base and Two, and nothing else",
        ["burnerfingertwo", "burnerfingerthree", "burnerfingerfour", "burnerfingerfive"]
            .filter((k) => (overlay(k).system.traits?.value ?? bf.system.traits.value).includes("attack")),
        ["burnerfingertwo"]);
    // Five's cone grows at the Vollständig, and only there.
    check("…and Five widens to 60 feet under Deus Ex Machina",
        overlay("burnerfingerfive").flags["isaacs-hb-pf2e"].areaTargeting.alternateArea,
        [{ area: { type: "cone", value: 60 }, predicate: ["self:effect:deus-ex-machina"] }]);
}

/* --- two die steps, and a cost that is actually paid --------------------------------------------- */

/**
 * *"Your spirit weapon's damage die increases by **two** steps instead of one."*
 *
 * Written as two `ItemAlteration` upgrades it is worth **zero**: pf2e latches on `damageFacesUpgraded`
 * and the Schrift's own upgrade had already taken the one pf2e allows. Driven live, the bow was 1d10 at
 * the Vollständig — identical to the Schrift. `extraDieSteps` is the answer the module already wrote for
 * Zanka no Tachi, and the comment in `die-steps.mjs` explains why no arrangement of `upgrade` can work.
 */
{
    const letzt = contentDoc("soulbound-effects/effect-quincy-letzt-stil.json");
    check("Letzt Stil takes its second step the only way pf2e allows",
        letzt.flags["isaacs-hb-pf2e"].extraDieSteps, 1);
    check("…and no longer asks pf2e for an upgrade it will not give",
        letzt.system.rules.filter((r) => r.property === "damage-dice-faces").length, 0);
    // Every die-step declaration in the content, so a new one arrives beside its predecessors rather
    // than in silence. The third is *Bailar de Valquiria*'s and is the only one that counts off a badge:
    // its step is taken **per refusal**, and the refusals are unlimited.
    const declared = [];
    (function walk(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith(".json")) {
                const doc = JSON.parse(fs.readFileSync(full, "utf8"));
                if (doc.flags?.["isaacs-hb-pf2e"]?.extraDieSteps) declared.push(entry.name);
            }
        }
    })(path.join(ROOT, "content"));
    check("the forms that give a second die step", declared.sort(),
        ["effect-quincy-letzt-stil.json", "effect-the-miracle-grown.json", "effect-zanka-no-tachi.json"]);
}

/**
 * *"When Letzt Stil ends, you lose access to your Schrift Form, your Release Technique, Licht Regen,
 * Vollständig, and your entire reiatsu pool until you complete 24 hours of rest."*
 *
 * `Release.release` has refused on `soulbound:letzt-stil-spent` since the ladder was built, and nothing
 * ever published it: `Effect: Letzt Stil — Spent` was in the content, applied by nobody. Driven live the
 * pool came out of the form untouched and the Schrift went straight back on.
 *
 * A form declares what leaving it costs, and `exitTo` is why the Schrift goes too — §7C takes the rung
 * below, the way Severance does, and falling one step left three of the four named things in place.
 */
{
    const letzt = contentDoc("soulbound-effects/effect-quincy-letzt-stil.json");
    check("leaving Letzt Stil costs what the guide says it costs",
        letzt.flags["isaacs-hb-pf2e"].endsWith,
        { effect: "Effect: Letzt Stil — Spent", exitTo: "sealed" });
    const spent = contentDoc("soulbound-effects/effect-letzt-stil-spent.json");
    check("…the cost lasts a day", [spent.system.duration.value, spent.system.duration.unit], [24, "hours"]);
    check("…empties the pool by capping it, so it cannot be refocused back",
        spent.system.rules.some((r) => r.key === "ActiveEffectLike" && r.path === "system.resources.focus.cap"
            && r.value === 0), true);
    check("…and publishes the option the ladder has always refused on",
        spent.system.rules.some((r) => r.key === "RollOption" && r.option === "soulbound:letzt-stil-spent"),
        true);
}

/* --- a spirit weapon you can actually fire ------------------------------------------------------ */

/**
 * pf2e makes a ranged, non-thrown weapon with a reload value demand ammunition — `weapon/document.ts`
 * fills `system.ammo` from the base item and `character/document.ts` refuses the Strike outright when
 * nothing is loaded. Both of the class's ranged spirit weapons inherited that from their base items, so
 * neither could be fired: *"No ammunition is assigned to Los Lobos — Pistols"*, no roll, no message.
 *
 * `builtIn` is pf2e's own field for a weapon that carries its own ammunition, and it is what guide §7B's
 * "they need no ammunition" means. Driven live on both: refused before, two Strikes after.
 *
 * Pinned by walking the equipment rather than by naming two files, because the next ranged profile will
 * arrive with the same inheritance and the same silence.
 */
{
    const dir = path.join(ROOT, "content", "soulbound-equipment");
    const ranged = fs.readdirSync(dir)
        .filter((name) => name.endsWith(".json"))
        .map((name) => [name, JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"))])
        .filter(([, doc]) => doc.type === "weapon" && doc.system.range && doc.system.reload?.value !== "-");
    check("the class's ranged spirit weapons", ranged.map(([name]) => name).sort(),
        ["los-lobos-pistols.json", "spirit-bow.json"]);
    check("…and every one of them carries its own ammunition",
        ranged.filter(([, doc]) => doc.system.ammo?.builtIn !== true).map(([name]) => name), []);
}

/* --- terrain that follows you, and a shape that stays a choice ---------------------------------- */

/**
 * Tiburón's Segunda Etapa: *"Water rises around you in a **20-foot emanation**, difficult terrain for
 * enemies."* `Effect: Hirviendo` had `rules: []` — no water, no emanation, no terrain, only a form that
 * said so. `TerrainAura` is the fix, and it is declared on the effect the way `freesHands` is.
 */
{
    const hirviendo = contentDoc("soulbound-effects/effect-hirviendo.json");
    check("Hirviendo's water is a 20-foot aura for enemies",
        hirviendo.flags["isaacs-hb-pf2e"].terrainAura, { affects: "enemies", cost: 2, value: 20 });
    // The push beside it is "once per round when you hit", and had no gate at all.
    check("…and the push it grants is gated to once a round",
        hirviendo.flags["isaacs-hb-pf2e"].riders[0].oncePerRound, true);
}

/**
 * *"La Gota **may** be used as a 60-foot line **instead of** a cone."*
 *
 * Written as an `alternateArea` the line simply won at the Segunda Etapa, and the cone could no longer
 * be cast at all. Shape choices carry predicates now and the list is filtered before it is offered, so
 * the two cone sizes stay a size — one survivor is not a question — and the line is a third option that
 * only exists once Hirviendo does.
 */
{
    const gota = techDoc("la-gota");
    const shapes = gota.flags["isaacs-hb-pf2e"].areaTargetingShapes;
    check("La Gota offers its shapes rather than replacing one with another",
        shapes.map((shape) => `${shape.value}-foot ${shape.type}`),
        ["40-foot cone", "30-foot cone", "60-foot line"]);
    check("…the wide cone is Refined's",
        shapes.find((s) => s.value === 40)?.predicate, ["feature:refined-release"]);
    check("…the narrow one is everyone else's",
        shapes.find((s) => s.value === 30)?.predicate, [{ not: "feature:refined-release" }]);
    check("…and the line only exists at the Segunda Etapa",
        shapes.find((s) => s.type === "line")?.predicate, ["self:effect:hirviendo"]);
    check("…with no alternateArea left to fight it",
        gota.flags["isaacs-hb-pf2e"].areaTargeting.alternateArea ?? "gone", "gone");
}

/* --- a shape choice that reaches the card ------------------------------------------------------- */

/**
 * Cero Metralleta is offered as a 60-foot cone or a 120-foot line, and the choice reached the placement
 * from the start — the Region really was a line. The **card** did not: it read "Area 60-foot cone"
 * whatever was aimed, because the answer never reached pf2e. The content already shipped the variant.
 *
 * So a shape that has a variant names it, and the pipeline casts that variant instead of the original.
 */
{
    const doc = techDoc("cero-metralleta");
    const shapes = doc.flags["isaacs-hb-pf2e"].areaTargetingShapes;
    check("Cero Metralleta offers the guide's two shapes",
        shapes.map((shape) => `${shape.value}-foot ${shape.type}`), ["60-foot cone", "120-foot line"]);
    const line = shapes.find((shape) => shape.type === "line");
    check("…and the line names the variant that carries it", line.overlay, "cerometralletaline");
    check("…which exists, and is that shape",
        doc.system.overlays[line.overlay]?.system?.area, { type: "line", value: 120 });
}
check("Zanhyō Ningyō is a reaction, so its spend rides on the prompt instead",
    techDoc("zanhyo-ningyo").flags["isaacs-hb-pf2e"].riders[0].apply.riders
        .some((r) => r.apply.type === "charge" && r.apply.effect === "Effect: Daiguren Hyōrinmaru"),
    true);
check("and it is still a reaction, not a cast", techDoc("zanhyo-ningyo").system.time.value, "reaction");


/**
 * SB-18. `Effect: Daiguren Hyōrinmaru` declared `min: 0` for its three petal-flowers and carried
 * `labels: ["1","2","3"]` beside it. pf2e nulls the minimum of a labelled counter, treats it as 1, and
 * **deletes the effect** when a change would take the value below it — so spending the third petal did
 * not empty the pool, it deleted the Bankai, taking the fly Speed, the cold resistance and the host of
 * all three petal Techniques with it. Reproduced live: the effect was simply gone.
 */
check("the petal-flowers can be spent down to none without deleting the Bankai",
    [pool.system.badge.min, pool.system.badge.labels], [0, undefined]);
check("Los Lobos' wolves were already right, and stay right",
    contentDoc("soulbound-effects/effect-colmillo.json").system.badge.min, 0);


/* ---------------------------------------------------------------------------------------------- */
/*  SB-19 — who an area catches                                                                     */
/* ---------------------------------------------------------------------------------------------- */

/**
 * `configFor` defaults `affects` to **`"all"`** when an item carries no `areaTargeting` flag, and 24 of
 * the class's 33 area effects carried none — so every kidō line and burst, Getsuga Tenshō, Galvano
 * Blast, both of Hyōrinmaru's petal areas and **thirteen of the fifteen Severing Arts** caught the
 * caster's own party.
 *
 * The guide settles it in one sentence, about Zanka no Tachi:
 *
 * > **Design note.** This is the most complex Bankai in the class and **the only one that damages your
 * > own party.**
 *
 * So exactly one area in the class affects everyone — Zanka no Tachi's ambient burn, which was already
 * authored `affects: "all"` — and every other one is enemies-only.
 */
const SOULBOUND_AREA_DIRS = ["soulbound-techniques", "soulbound-kido"];
const areaItems = [];
(function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith(".json") && entry.name !== "_folders.json") {
            const doc = JSON.parse(fs.readFileSync(full, "utf8"));
            if (doc.system?.area) areaItems.push({ name: doc.name, doc });
        }
    }
})(path.join(ROOT, "content", SOULBOUND_AREA_DIRS[0]));
(function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (entry.name.endsWith(".json") && entry.name !== "_folders.json") {
            const doc = JSON.parse(fs.readFileSync(full, "utf8"));
            if (doc.system?.area) areaItems.push({ name: doc.name, doc });
        }
    }
})(path.join(ROOT, "content", SOULBOUND_AREA_DIRS[1]));

check("every Soulbound area says who it catches, rather than defaulting to everyone",
    areaItems.filter((i) => !i.doc.flags?.["isaacs-hb-pf2e"]?.areaTargeting?.affects).map((i) => i.name),
    []);
check("and none of them catches allies — Zanka no Tachi's ambient burn is the class's only friendly fire",
    areaItems.filter((i) => i.doc.flags["isaacs-hb-pf2e"].areaTargeting.affects !== "enemies").map((i) => i.name),
    []);
check("Zanka no Tachi's ambient burn still reaches everyone but the caster (guide §7A design note)",
    (() => {
        const r = contentDoc("soulbound-effects/effect-zanka-no-tachi.json").flags["isaacs-hb-pf2e"].riders[0];
        return [r.areaTargeting.affects, r.areaTargeting.includesSelf];
    })(),
    ["all", false]);


/* ---------------------------------------------------------------------------------------------- */
/*  SB-20 — the feat layer                                                                          */
/* ---------------------------------------------------------------------------------------------- */

/**
 * Twenty-three of the class's forty-seven feats had no mechanism behind them at all: a `RollOption`
 * nothing reads, or an empty `rules` array. `Reiatsu Flood` was the single exception among those that
 * looked inert — `rising-pressure.mjs` reads it by slug.
 *
 * A feat passes this check when it has a rule that is not just a `RollOption`, a module flag that the
 * engine acts on, or a slug the scripts read. The list below is the ones fixed so far; the rest are
 * enumerated in the checklist so the count cannot drift silently.
 */
const MECHANICAL_FLAGS = ["riders", "areaTargeting", "actionCost", "chargeSpend", "chargeRefresh",
    "bypass", "lingering", "overlap", "freeCast", "releaseForm", "modeSwitch"];

function featHasMechanism(slug) {
    const doc = contentDoc(`soulbound-feats/${slug}.json`);
    const rules = doc.system.rules ?? [];
    const flags = Object.keys(doc.flags?.["isaacs-hb-pf2e"] ?? {});
    // A *toggleable* RollOption is a mechanism: it is pf2e's own way of putting a cast-time choice on
    // the sheet, and Cero Doble's cone is read off one. A plain RollOption is not.
    return rules.some((r) => r.key !== "RollOption" || r.toggleable)
        || flags.some((f) => MECHANICAL_FLAGS.includes(f));
}

for (const slug of ["perfected-technique", "zanjutsu-hakuda", "chain-anchor", "segunda-piel-temprana"]) {
    check(`${slug} does something`, featHasMechanism(slug), true);
}

// Perfected Technique rides the same allowance machinery as the Full Release's Unbound Technique.
// pf2e has no "encounter" frequency period — its list is turn/round/PT1M/PT10M/PT1H/PT24H/day/P1W/P1M/P1Y
// — so PT10M is the stand-in for once a fight, and is named here so the choice is not mistaken for a bug.
const perfected = contentDoc("soulbound-feats/perfected-technique.json");
check("Perfected Technique frees one Release Technique, once a fight (guide §8.3)",
    [perfected.system.frequency, perfected.flags["isaacs-hb-pf2e"].freeCast.predicate],
    [{ max: 1, per: "PT10M", value: 1 }, ["item:tag:sb-tier-release"]]);

// Zanjutsu: Hakuda is a real unarmed attack, not a roll option describing one.
const hakuda = contentDoc("soulbound-feats/zanjutsu-hakuda.json").system.rules[0];
check("Zanjutsu: Hakuda grants a 1d6 agile finesse nonlethal fist (guide §8.3)",
    [hakuda.key, hakuda.damage.base.dice + hakuda.damage.base.die, hakuda.traits.sort()],
    ["Strike", "1d6", ["agile", "finesse", "nonlethal", "unarmed"]]);

// Rising Tide can only be known where the grant happens, which is why it sat unread.
check("Rising Tide is paid out by Rising Pressure itself",
    fs.readFileSync(path.join(ROOT, "scripts/soulbound/rising-pressure.mjs"), "utf8").includes("rising-tide"),
    true);


/**
 * `Twin Pressure` (feat 14) could not have been written as content at all: the events list belongs to
 * an effect the feat does not own. It is stamped onto `Effect: Full Release` as that effect is created,
 * beside the Perfected radius — the same answer as `applyFullReleaseShape` gives the duration.
 */
check("Twin Pressure is applied where the aura is built, not from the feat",
    fs.readFileSync(path.join(ROOT, "scripts/soulbound/release.mjs"), "utf8").includes("twin-pressure"),
    true);
check("and the aura's default trigger is turn-end alone",
    pressureAura.effects[0].events, ["turn-end"]);


/**
 * SB-22. `Actor#increaseCondition` is additive — `Math.clamp(currentValue + addend, 1, max)` — and the
 * Full Release aura, ticking each round, walked a creature to **frightened 8** from a class whose
 * highest printed value is 2.
 *
 * Sixty durationless condition riders exist across both classes and **fifty-seven** read as "become X":
 * stunned 2, prone, blinded, doomed 1. The three that genuinely accumulate — two Pisces skies and an
 * Aquarius one — all declare a `max`, so `max` is the signal, and no content file had to change.
 */
const conditionRiders = [];
(function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) { walk(full); continue; }
        if (!entry.name.endsWith(".json") || entry.name === "_folders.json") continue;
        const doc = JSON.parse(fs.readFileSync(full, "utf8"));
        const visit = (riders) => {
            if (!Array.isArray(riders)) return;
            for (const r of riders) {
                const ap = r?.apply;
                if (!ap || typeof ap !== "object") continue;
                if (ap.type === "condition" && !r.duration) {
                    conditionRiders.push({ name: doc.name, slug: ap.slug, value: ap.value, max: ap.max });
                }
                for (const key of ["riders", "onHit", "onAllHit", "options"]) visit(ap[key]);
            }
        };
        visit(doc.flags?.["isaacs-hb-pf2e"]?.riders);
    }
})(path.join(ROOT, "content"));

check("only the riders that declare a `max` accumulate; every other one means \"become X\"",
    conditionRiders.filter((r) => r.max).map((r) => `${r.name}: ${r.slug} ${r.value}/${r.max}`).sort(),
    ["Sky: Ascendant (Aquarius): slowed 1/4",
     "Sky: Ascendant (Pisces): enfeebled 1/4",
     "Sky: Zenith (Pisces): enfeebled 1/4"]);

check("the Full Release aura's frightened is not one of them",
    conditionRiders.filter((r) => r.slug === "frightened").every((r) => !r.max), true);

check("and the engine sets rather than adds when no max is declared",
    fs.readFileSync(path.join(ROOT, "scripts/riders/apply.mjs"), "utf8")
        .includes("set to at least the value, never above what is already there"),
    true);


/**
 * A second tranche of SB-20, all of it hooking machinery that already existed.
 */
for (const slug of ["cero-doble", "zanjutsu-footwork"]) {
    check(`${slug} does something`, featHasMechanism(slug), true);
}

// "May be shaped as a 30-foot cone" is a choice, not a rule, so it is a toggle on the sheet — pf2e's
// own answer for a cast-time choice — read by the `alternateArea` seam written for Photon Burst.
const ceroDoble = contentDoc("soulbound-feats/cero-doble.json").system.rules[0];
check("Cero Doble is a toggle the player flips, not an automatic reshape (guide §8.2)",
    [ceroDoble.key, ceroDoble.toggleable, ceroDoble.option],
    ["RollOption", true, "soulbound:cero-doble"]);
const ceroKido = contentDoc("soulbound-kido/hollow/cero.json").flags["isaacs-hb-pf2e"];
check("and Cero offers the cone only while that toggle is on",
    ceroKido.areaTargeting.alternateArea.map((a) => [a.predicate, a.area.type, a.area.value]),
    [[["soulbound:cero-doble"], "cone", 30]]);
check("with the 10-foot push on a critical failure, gated the same way",
    ceroKido.riders.some((r) => r.apply.type === "teleport" && r.apply.distance === 10
        && r.predicate.includes("soulbound:cero-doble")),
    true);

// Two clauses put you in your released form the moment a fight begins, and they are one event.
const releaseSource = fs.readFileSync(path.join(ROOT, "scripts/soulbound/release.mjs"), "utf8");
check("Sheathed Draw releases you when the fight starts (guide §8.1)",
    releaseSource.includes("sheathed-draw"), true);
check("Vollständig Endurance suppresses the Full Release fatigue (guide §8.5)",
    releaseSource.includes("soulbound:no-full-release-fatigue"), true);
check("and the feat declares that option",
    contentDoc("soulbound-feats/vollstandig-endurance.json").system.rules[0].option,
    "soulbound:no-full-release-fatigue");

// The Quincy counteract cluster: three clauses that all turn on one roll.
const applySource = fs.readFileSync(path.join(ROOT, "scripts/riders/apply.mjs"), "utf8");
check("Seal the Art's Reiatsu Point is charged where the outcome is known",
    applySource.includes("soulbound:reishi-mastery") && applySource.includes("soulbound:sklaverei"),
    true);


/* ---------------------------------------------------------------------------------------------- */
/*  SB-20, closed: every feat does something                                                        */
/* ---------------------------------------------------------------------------------------------- */

/**
 * Twenty-three of forty-seven feats had no mechanism at all. This is the standing guard that says so
 * for every one of them, so the number cannot drift back.
 *
 * A feat counts as mechanical when any of these is true:
 *
 *  - it carries a rule that is not merely a flat `RollOption` — including a **toggleable** one, which
 *    is pf2e's own way of putting a cast-time choice on the sheet (Cero Doble, Kidō Focus);
 *  - it carries a module flag the engine acts on;
 *  - it is an **activity** with an action cost or a frequency, which is the whole mechanism for an
 *    action-economy feat — pf2e writes `Double Shot` exactly this way (Rapid Bala, Shunpo Strike,
 *    Descorrer, Reader of Threads);
 *  - something reads it, by slug or by the option it sets (Reiatsu Flood, Unbroken Chain).
 */
const SCRIPTS = (() => {
    let text = "";
    (function walk(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith(".mjs")) text += fs.readFileSync(full, "utf8");
        }
    })(path.join(ROOT, "scripts"));
    return text;
})();

/** Every authored document, as one string, for the same question asked of the content. */
const CONTENT = (() => {
    let text = "";
    (function walk(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) walk(full);
            else if (entry.name.endsWith(".json")) text += fs.readFileSync(full, "utf8");
        }
    })(path.join(ROOT, "content"));
    return text;
})();

const ENGINE_FLAGS = ["riders", "areaTargeting", "actionCost", "chargeSpend", "chargeRefresh", "bypass",
    "lingering", "overlap", "freeCast", "releaseForm", "modeSwitch", "deepBreath", "techniqueDieSteps",
    "refuseDeath"];

/**
 * A caveat this census cannot see, and `Beyond the Blade` is the proof.
 *
 * It asks whether a feat **has** a mechanism, not whether that mechanism can work. `Beyond the Blade`
 * carried two `ItemAlteration`s and passed here for as long as it existed — while doing nothing at all,
 * because pf2e's `damage-dice-faces` handler takes `itemType: ["weapon"]` and a Release Technique is a
 * spell. A rule element pf2e rejects is indistinguishable from one it honours, from here. Only the live
 * drive tells them apart, which is what `Docs/clauses/` is for.
 */

const inertFeats = [];
for (const file of fs.readdirSync(path.join(ROOT, "content", "soulbound-feats"))) {
    //  is a bare array, not a document.
    if (!file.endsWith(".json") || file === "_folders.json") continue;
    const doc = contentDoc(`soulbound-feats/${file}`);
    const rules = doc.system.rules ?? [];
    const flags = Object.keys(doc.flags?.["isaacs-hb-pf2e"] ?? {});
    if (rules.some((r) => r.key !== "RollOption" || r.toggleable)) continue;
    if (flags.some((f) => ENGINE_FLAGS.includes(f))) continue;
    const actionType = doc.system.actionType?.value;
    if (["action", "reaction", "free"].includes(actionType)
        && (doc.system.frequency || doc.system.actions?.value)) continue;
    const slug = doc.system.slug ?? file.replace(/\.json$/, "");
    const options = rules.filter((r) => r.key === "RollOption").map((r) => r.option);
    /**
     * A feat is automated when **something** reads it, and that something need not be code.
     *
     * `Ghost Step` is the case that taught this: its permission is a rider on the two actions that
     * perform a Flash Step, predicated on pf2e's own `feat:ghost-step`. Nothing in `scripts/` mentions
     * it and nothing needs to — the content asks for it by name. Searching only the scripts called that
     * inert, which would have pushed the rider back onto the feat, where it could never fire.
     */
    const read = SCRIPTS.includes(`"${slug}"`) || SCRIPTS.includes(`feature:${slug}`)
        || CONTENT.includes(`feat:${slug}`) || CONTENT.includes(`feature:${slug}`)
        || options.some((o) => SCRIPTS.includes(o) || CONTENT.includes(o));
    if (!read) inertFeats.push(doc.name);
}
check("every Soulbound feat has a mechanism behind it", inertFeats, []);


/* ---------------------------------------------------------------------------------------------- */
/*  Senbonzakura Kageyoshi, finished                                                                */
/* ---------------------------------------------------------------------------------------------- */

/**
 * The Bankai's second emanation is the only area in either class that is **placed and then stays
 * there**, ticking at the start of each of the caster's turns from wherever it was last sent. Every
 * other area is centred on the caster, which is why `shapeFromArea` took the origin's centre for both
 * the anchor and the direction — so an area may now name an `anchor`, a key under the caster's
 * `areaAnchors` flag holding the point.
 *
 * Gokei then reshapes that second area rather than adding a third: a 10-foot burst at double damage.
 */
const kage = contentDoc("soulbound-effects/effect-senbonzakura-kageyoshi.json")
    .flags["isaacs-hb-pf2e"].riders;
// Both shapes ride ONE rider, so a creature standing in both is caught once — the guide says "each
// enemy in **either** emanation", and two riders made that two turn events and two lots of damage.
check("the Bankai ticks from two places at once, as one event (guide §7A)",
    kage.map((r) => [r.event, [r.area].flat().map((a) => `${a.type} ${a.value} ${a.anchor ?? "on you"}`)]),
    [["turn-start", ["emanation 20 on you", "emanation 20 senbonzakura-second"]],
     ["turn-start", ["emanation 20 on you", "burst 10 senbonzakura-second"]]]);
check("and all three are a basic Reflex for 5d6 slashing, a die a rank",
    kage.every((r) => r.apply.basic === true && r.apply.statistic === "reflex"
        && r.apply.riders[0].apply.formula === "5d6" && r.apply.riders[0].apply.perStep === "1d6"),
    true);
check("Gokei reshapes the second area and doubles it, rather than adding a third",
    kage.map((r) => [JSON.stringify(r.predicate), r.apply.riders[0].apply.multiplier ?? 1]),
    [[JSON.stringify([{ not: "soulbound:senbonzakura:gokei" }]), 1],
     [JSON.stringify(["soulbound:senbonzakura:gokei"]), 2]]);

// One Sustain, three things it can do — the guide gives them all the same action.
const sustain = contentDoc("soulbound-class-features/actions/senbonzakura-kageyoshi-sustain.json");
check("the Sustain can send the blades as well as switch modes, once per round",
    [sustain.flags["isaacs-hb-pf2e"].modeSwitch.place.anchor,
     sustain.flags["isaacs-hb-pf2e"].modeSwitch.place.range,
     sustain.system.frequency],
    ["senbonzakura-second", 60, { max: 1, per: "round", value: 1 }]);

// Senkei abandons defence: it takes the reach back and ignores every resistance.
const senkei = contentDoc("soulbound-effects/effect-senkei.json");
check("Senkei's Strikes ignore all resistances (guide §7A)",
    senkei.flags["isaacs-hb-pf2e"].bypass[0].resistance.types, "all");
check("and it still takes back the reach the Shikai granted",
    senkei.system.rules.some((r) => r.key === "ItemAlteration" && r.mode === "remove" && r.value === "reach-15"),
    true);

// Shikake was authored correctly all along; SB-12 repaired the predicate that gated its Refined half.
const shikakeRiders = contentDoc("soulbound-techniques/shikake.json").flags["isaacs-hb-pf2e"].riders;
check("Shikake lasts a round on a failure and two on a critical failure (guide §7A)",
    shikakeRiders.filter((r) => r.apply.type === "effect")
        .map((r) => [r.outcomes[0], r.duration.value]),
    [["failure", 1], ["criticalFailure", 2]]);
check("and its Refined off-guard waits for Refined Release, spelled the way pf2e emits it",
    shikakeRiders.find((r) => r.apply.slug === "off-guard").predicate, ["feature:refined-release"]);


/* ---------------------------------------------------------------------------------------------- */
/*  SB-24 … SB-26 — the Hollow clauses that were predicates pointing at nothing                     */
/* ---------------------------------------------------------------------------------------------- */

/**
 * SB-24. Regeneración's second off-switch was `{not: "self:effect:regeneracion-suppressed"}` — an
 * effect **that did not exist and that nothing applied**, so a Hollow's fast healing could never be
 * switched off. The guide calls that clause the point of the Lineage: *"Soul Reapers and Quincy exist
 * to shut this down, and both can, from 1st level."*
 *
 * Which types close it depends on the character — **Segunda Piel** (15th) narrows it to spirit alone.
 */
const { suppressorsFor, typesOf, traitsOf } = await import("../scripts/soulbound/regeneracion.mjs");
check("spirit and vitality damage suppress Regeneración, and a holy effect does",
    suppressorsFor([]), { types: ["spirit", "vitality"], traits: ["holy"] });
check("Segunda Piel narrows that to spirit alone",
    suppressorsFor(["feature:segunda-piel"]), { types: ["spirit"], traits: [] });
// `holy` is a TRAIT, not a damage type: pf2e's DAMAGE_TYPES has no such entry, so `5[holy]` parses as
// untyped and a type check for it matches nothing. The two halves of the guide's "holy or vitality
// effect" are therefore asked in two different places.
check("holy is not among the damage types asked for",
    suppressorsFor([]).types.includes("holy"), false);
check("the effect the predicate names exists, and lasts to the end of your next turn",
    contentDoc("soulbound-effects/effect-regeneracion-suppressed.json").system.duration,
    { expiry: "turn-end", sustained: false, unit: "rounds", value: 1 });
check("and its slug is pinned, because sluggify would make the option `regeneraci-n-suppressed`",
    contentDoc("soulbound-effects/effect-regeneracion-suppressed.json").system.slug,
    "effect-regeneracion-suppressed");
check("the damage types come off the roll's instances",
    typesOf({ instances: [{ type: "spirit" }, { type: "slashing" }] }), ["spirit", "slashing"]);
check("the source's traits come off the damage roll options",
    traitsOf({ rollOptions: new Set(["item:trait:holy", "item:slug:sacred-blade"]) }), ["holy"]);
check("and off the item when a caller passes no options",
    traitsOf({ item: { system: { traits: { value: ["holy", "divine"] } } } }), ["holy", "divine"]);
check("the TARGET's own traits are never read — a holy Hollow does not suppress itself",
    traitsOf({ rollOptions: new Set(["self:trait:holy"]) }), []);

/**
 * SB-25. "Your Regeneración fast healing **doubles**" was a roll option nothing read. The base rate is
 * predicated off when the doubling applies and a doubled rule takes its place — two `FastHealing` rules
 * at once would heal twice rather than once for double.
 */
const regenRules = contentDoc("soulbound-class-features/lineages/regeneracion.json").system.rules;
check("Regeneración is one rate or the other, never both (guide §7B)",
    regenRules.map((r) => [r.value.startsWith("2*"), r.predicate.some((p) =>
        p === "soulbound:murcielago:high-speed-regeneration")]),
    [[false, false], [true, true]]);

/**
 * SB-27. "You can still gain doomed, but it never increases past 1" was first a roll option nothing
 * read, and then — the repair — an `ActiveEffectLike` lowering `system.attributes.doomed.max`. That
 * read perfectly and **also did nothing**, because pf2e assigns the value after every rule element:
 *
 *     this.prepareSynthetics();                     // every ActiveEffectLike applies here
 *     attributes.doomed.max = attributes.dying.max; // and is overwritten here, unconditionally
 *
 * No priority or mode wins against a plain assignment further down the same method, so the cap is
 * declared on the item and applied in the module's own `prepareDerivedData` wrapper, which is later.
 */
const arrogante = contentDoc("soulbound-effects/effect-arrogante-resurreccion.json");
check("Arrogante caps doomed at 1 where pf2e cannot overwrite it (guide §7B)",
    arrogante.flags["isaacs-hb-pf2e"].attributeCaps,
    [{ path: "attributes.doomed.max", value: 1 }]);
check("and the ActiveEffectLike that could never work is gone",
    arrogante.system.rules.some((r) => r.path === "system.attributes.doomed.max"), false);

const { applyAttributeCaps } = await import("../scripts/soulbound/attribute-caps.mjs");
const capped = (caps, current) => {
    const actor = { system: { attributes: { doomed: { max: current } } },
                    items: [{ flags: { "isaacs-hb-pf2e": { attributeCaps: caps } } }] };
    applyAttributeCaps(actor);
    return actor.system.attributes.doomed.max;
};
check("a cap lowers the ceiling", capped([{ path: "attributes.doomed.max", value: 1 }], 4), 1);
check("and never raises it — two items asking for different ceilings agree on the lower",
    capped([{ path: "attributes.doomed.max", value: 3 }], 1), 1);
check("an actor with no declaration is untouched", capped([], 4), 4);

// Tiburón's Hirviendo changes La Gota's SHAPE, not just its size — but the guide's word is **may**:
// "La Gota **may** be used as a 60-foot line **instead of** a cone".
//
// This check used to assert the opposite, and to explain why: `alternateArea` is first-match-wins, so
// the line was ordered above the Refined cone and "a Hirviendo Tiburón must throw the 60-foot line".
// Driven live, that is exactly what happened — and it meant a 13th-level Tiburón could no longer cast
// the cone at all. An option that replaces the thing it is an option to is not an option. The shapes
// are a filtered choice now; see the block above.


/**
 * Every `system.slug === "x"` in the scripts must name a document the build actually writes.
 *
 * `validateSlugPredicates` catches this for `item:slug:` in *content*. It said nothing about code — and
 * the same trap caught the module's own: `sluggify` reduces anything outside `[a-z0-9]` to a separator,
 * so "Regeneración" is built as **`regeneraci-n`**, and `slug === "regeneracion"` in
 * `scripts/soulbound/regeneracion.mjs` matched nothing. The Hollow's fast healing could never be
 * suppressed, which is the clause guide §5.2 calls the point of the Lineage.
 *
 * The fix there was a **tag** rather than an explicit slug: ASCII by construction, and it does not
 * change the document's derived id the way `system.slug` would, which would break every existing
 * character's link to it.
 */
const BUILT_SLUGS = (() => {
    const slugs = new Set();
    (function walk(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) { walk(full); continue; }
            if (!entry.name.endsWith(".json") || entry.name === "_folders.json") continue;
            const doc = JSON.parse(fs.readFileSync(full, "utf8"));
            if (!doc?.name) continue;
            slugs.add(doc.system?.slug ?? doc.name.toLowerCase()
                .replace(/['’]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
        }
    })(path.join(ROOT, "content"));
    return slugs;
})();

// pf2e owns these; they are conditions and system slugs, not our documents.
const SYSTEM_SLUGS = new Set([
    "dying", "persistent-damage", "saint", "soulbound", "kido-focus",
    // pf2e grants this one itself when a target is behind something. Senbonzakura reads it to take
    // the bonus back out of the DC, which is the only way an attacker can ignore cover.
    "effect-cover",
    // A pf2e condition the Assimilator rig reads off a target after a Flare.
    "blinded",
    // Not a document: the slug of the −1 Will modifier *Effect: Null Weight* puts on a save.
    "null-weight",
    // The Assimilator's Substrate catalogue is keyed by its own slug ("electrum"), not the effect's document slug.
    "electrum",
    // Not documents: the Orange Instinct's Speed modifier and Kinetic Surge's damage die, read off a roll.
    "instinct-orange-speed", "kinetic-surge",
    // A pf2e condition the rig puts on and the White Instinct's picker ends.
    "frightened",
    // Cobalt's synthetic Strike (a Strike rule's slug, not a document), and pf2e conditions the Bonds read.
    "arcane-channel", "stunned", "slowed", "stupefied",
]);

const unresolvedInScripts = [];
for (const [, slug] of SCRIPTS.matchAll(/slug\s*===\s*["']([a-z0-9-]+)["']/g)) {
    if (BUILT_SLUGS.has(slug) || SYSTEM_SLUGS.has(slug)) continue;
    if (!unresolvedInScripts.includes(slug)) unresolvedInScripts.push(slug);
}
check("every slug the scripts compare against names a document the build writes", unresolvedInScripts, []);


/**
 * SB-31. "Bala counts as agile for the purpose of your multiple attack penalty (-4/-8 rather than
 * -5/-10)" was authored as `value: 1` — a reduction of one. pf2e reads the value as the **penalty
 * itself**, rejects anything above zero, and drops the rule; the warning was in every Soulbound's
 * console, once per data preparation, for as long as the class has existed.
 *
 * A MAP synthetic lives on the ACTOR keyed by domain, not on the item that declared it, so an
 * unpredicated one on `spell-attack` would have made every spell attack the character makes agile —
 * a Murciélago's Cero Oscuras included.
 */
const balaMap = contentDoc("soulbound-kido/hollow/bala.json").system.rules
    .find((r) => r.key === "MultipleAttackPenalty");
check("Bala's agile MAP is the penalty itself, not a reduction of it", balaMap.value, -4);
check("and it is scoped to Bala, because the synthetic is actor-wide",
    balaMap.predicate, ["item:slug:bala"]);
check("Bala's selector is a real spell-attack check domain", balaMap.selector, "spell-attack");

// Twin Fang was wrong the same way, and silently: it only warns for a character who took the feat.
const twinMap = contentDoc("soulbound-feats/twin-fang.json").system.rules
    .find((r) => r.key === "MultipleAttackPenalty");
check("Twin Fang's MAP is negative too", twinMap.value, -4);
check("and stays scoped to the spirit weapon", twinMap.predicate.at(-1), "item:tag:soulbound-spirit-weapon");


// A corrected rule in the pack reaches nobody who already exists: an owned item is a COPY. `repair`
// refuses to replace `system.rules` wholesale for a good reason — pf2e writes a `flag` onto a GrantItem
// at grant time and a `selection` onto a ChoiceSet when the player answers it, both INSIDE that array —
// but that reason only covers rules which carry such state.
const { rulesAreSafeToRefresh } = await import("../scripts/soulbound/release.mjs");
const map1 = [{ key: "MultipleAttackPenalty", value: 1 }];
const map4 = [{ key: "MultipleAttackPenalty", value: -4 }];
check("a stale stateless rule is refreshed", rulesAreSafeToRefresh(map1, map4), true);
check("an identical one is left alone", rulesAreSafeToRefresh(map4, map4), false);
check("a GrantItem is never overwritten — its grant-time flag lives in the array",
    rulesAreSafeToRefresh([{ key: "GrantItem", uuid: "x" }], [{ key: "GrantItem", uuid: "y" }]), false);
check("nor is a ChoiceSet, whose selection lives there too",
    rulesAreSafeToRefresh([{ key: "ChoiceSet", selection: "a" }], [{ key: "ChoiceSet" }]), false);
check("a stateful rule anywhere in either version protects the whole array",
    rulesAreSafeToRefresh(map1, [...map4, { key: "GrantItem", uuid: "y" }]), false);
check("and a missing side is never refreshed", rulesAreSafeToRefresh(map1, undefined), false);


/**
 * SB-35. `unbroken-chain.mjs` said in its own docstring that it read its conditions from the feat "so a
 * second refusal-to-die declares itself and needs no code here" — and then matched one hard-coded slug.
 * Fine while exactly one ability refused to die; wrong the moment Bailar de Valquiria (5 Miracle points,
 * repeatable) and The Balance's Refined clause did too.
 */
const { shouldCatch: refuses, poolOf, declarationsOn } =
    await import("../scripts/refuse-death.mjs");
const at0 = { next: 0, current: 20, released: true, points: 5 };
check("a blow that would drop you is caught", refuses({ ...at0 }), true);
check("a blow that leaves you standing is not", refuses({ ...at0, next: 3 }), false);
check("nor is one landing on someone already down", refuses({ ...at0, current: 0 }), false);
check("a price you cannot pay is no refusal", refuses({ ...at0, points: 4, cost: 5 }), false);
check("and one you can is", refuses({ ...at0, points: 5, cost: 5 }), true);
check("Unbroken Chain needs the release state", refuses({ ...at0, released: false }), false);
check("Bailar does not — it is already a Vollständig",
    refuses({ ...at0, released: false, requiresRelease: false }), true);
check("a spent daily use ends it", refuses({ ...at0, usesLeft: 0 }), false);

check("the reiatsu pool is the default resource",
    poolOf({ system: { resources: { focus: { value: 3 } } } }).value, 3);
check("and a counter badge is the other",
    poolOf({ itemTypes: { effect: [{ system: { slug: "effect-miracle-points", badge: { type: "counter", value: 7 } } }] } },
           "effect-miracle-points").value, 7);
check("a resource that is not there pays nothing",
    poolOf({ itemTypes: { effect: [] } }, "effect-miracle-points").value, 0);

// Cheapest first, so a Soulbound carrying both spends the Reiatsu Point before the five Miracle points.
check("declarations come back cheapest first",
    declarationsOn({ items: [
        { flags: { "isaacs-hb-pf2e": { refuseDeath: { label: "Bailar", cost: 5 } } } },
        { flags: { "isaacs-hb-pf2e": { refuseDeath: { label: "Unbroken Chain", cost: 1 } } } },
    ] }).map((d) => d.declared.label),
    ["Unbroken Chain", "Bailar"]);

check("Unbroken Chain declares its own price now",
    contentDoc("soulbound-feats/unbroken-chain.json").flags["isaacs-hb-pf2e"].refuseDeath,
    { cost: 1, frequency: true, label: "Unbroken Chain", requires: "released", resource: "focus" });
// …and Bailar's carries a `grants`, which is what makes the refusal repeatable *and* cumulative:
// "your spirit weapon's damage die increases by one step for the rest of the encounter", once per
// refusal, with no limit on the refusals.
check("and Bailar declares a different one",
    contentDoc("soulbound-effects/effect-bailar-de-valquiria.json").flags["isaacs-hb-pf2e"].refuseDeath,
    { cost: 5, label: "Bailar de Valquiria", resource: "effect-miracle-points",
      grants: "Effect: The Miracle — Grown" });


/**
 * SB-42. The Waning table was pure, exported, unit-tested — and connected to nothing. All fifteen
 * Severing Arts were authored at a flat `20d6`, the round-one value, so a Soulbound could sit through
 * nine rounds of a 4d6 rider, doubled Flash Step and free kidō and still end the fight for seventy
 * points. Guide §9 is explicit that the decay IS the balance lever.
 */
const { applyWaning, isSeveringArt, waningDice: waning } =
    await import("../scripts/soulbound/severance.mjs");

check("the table runs 20 down to 8 across rounds one to seven",
    [1, 2, 3, 4, 5, 6, 7].map(waning), [20, 18, 16, 14, 12, 10, 8]);
check("and refuses outside it — the Art is gone, not cheap",
    [0, 8, 9, 10].map(waning), [0, 0, 0, 0]);

const art = (formula) => ({
    system: { traits: { otherTags: ["sb-tier-severing"] }, damage: { 0: { formula } } },
});
const notArt = { system: { traits: { otherTags: [] }, damage: { 0: { formula: "20d6" } } } };

const stamped = (round, formula) => {
    const item = art(formula);
    applyWaning({ itemTypes: { spell: [item] } }, round);
    return item.system.damage[0].formula;
};
check("round three stamps sixteen dice", stamped(3, "20d6"), "16d6");
check("round seven stamps eight", stamped(7, "20d6"), "8d6");
check("round eight leaves nothing to roll", stamped(8, "20d6"), "0");
// Ittō Kasō is "the Waning dice **+2d6**" (R-14): the extra survives the rewrite.
check("an Art with an extra keeps it", stamped(3, "20d6 + 2d6"), "16d6 + 2d6");

const other = { itemTypes: { spell: [notArt] } };
applyWaning(other, 3);
check("and a Technique that is not an Art is untouched", notArt.system.damage[0].formula, "20d6");

check("the tag is the only thing that identifies an Art",
    [isSeveringArt(art("20d6")), isSeveringArt(notArt)], [true, false]);

// Every one of the fifteen carries it, or the stamp would skip it in silence.
for (const name of ["mugetsu", "shukei-hakuteiken", "hyoten-hyakkaso", "itto-kaso",
                    "kanzen-saimin-owari", "desgarron", "cero-oscuras-ceniza", "la-hora-final",
                    "aullido", "ola-azul", "sprenger", "burning-full-fingers", "the-reckoning",
                    "electrocution", "apotheosis"]) {
    check(`${name} is tagged as a Severing Art`,
        techDoc(name).system.traits.otherTags.includes("sb-tier-severing"), true);
}

check("Severance pays for the Release Technique and every kidō, without a counter",
    contentDoc("soulbound-effects/effect-severance.json").flags["isaacs-hb-pf2e"].freeCast.unlimited,
    true);


/**
 * SB-46. Four Severing Art clauses that were prose: the wound that will not close (R-11, R-14),
 * Ittō Kasō's price (R-15), Hyōten Hyakkasō's flat check (R-13) and Apotheosis (R-26).
 */
check("Shūkei: Hakuteiken and Ittō Kasō share the wound that will not close",
    ["shukei-hakuteiken", "itto-kaso"].map((n) =>
        (techDoc(n).flags["isaacs-hb-pf2e"].riders ?? []).some((r) =>
            /Wound That Will Not Close/.test(r.apply?.uuid ?? ""))),
    [true, true]);
check("and that effect suppresses regeneration by the option Regeneración already tests",
    contentDoc("soulbound-effects/effect-wound-that-will-not-close.json").system.rules
        .some((r) => r.key === "RollOption" && r.option === "self:effect:regeneracion-suppressed"),
    true);

// R-15: the number is not known until it lands, and nothing may reduce it.
const price = (techDoc("itto-kaso").flags["isaacs-hb-pf2e"].riders ?? [])
    .find((r) => r.apply?.fractionOfCurrentHp !== undefined);
check("Ittō Kasō costs half your current hit points, to yourself",
    [price?.apply.fractionOfCurrentHp, price?.self], [0.5, true]);

// R-13: the engine has no "no flat check" mode, so the DC is one no d20 reaches — and it says so.
check("Hyōten Hyakkasō's persistent cold cannot be shaken off",
    (techDoc("hyoten-hyakkaso").flags["isaacs-hb-pf2e"].riders ?? [])
        .find((r) => r.apply?.type === "persistent-damage")?.apply.dc > 20,
    true);

const apo = contentDoc("soulbound-effects/effect-apotheosis.json");
check("Apotheosis gives temporary hit points equal to twice your level",
    apo.system.rules.find((r) => r.key === "TempHP")?.value, "2 * @actor.level");
check("and detonates again at the start of your next turn for half the Waning dice",
    [apo.flags["isaacs-hb-pf2e"].riders[0].event,
     apo.flags["isaacs-hb-pf2e"].riders[0].apply.riders[0].apply.formula,
     apo.flags["isaacs-hb-pf2e"].riders[0].apply.riders[0].apply.multiplier],
    ["turn-start", "origin.severance.dice", 0.5]);

/* -------------------------------------------------------------------------------------------- */
/*  Nine abilities that promise an Escape                                                        */
/* -------------------------------------------------------------------------------------------- */

/**
 * Every "(Escape against your Reiatsu DC)" in the Soulbound content, and the rider that now makes one.
 *
 * All nine said it in their description and none of them created anything: `escapeDc` was read only by
 * the encasement handler, so a condition rider carrying it applied the grip with a timer and left the
 * captive to wait it out. The list is spelled out rather than scraped so that a tenth ability written
 * with the sentence and without the key fails here, which is the way the first nine got in.
 */
{
    const promised = [
        ["soulbound-effects/effect-minami.json", ["grabbed"]],
        ["soulbound-kido/bakudo/rikujokoro.json", ["immobilized", "immobilized"]],
        ["soulbound-kido/bakudo/sai.json", ["immobilized", "immobilized"]],
        ["soulbound-kido/hado/kurohitsugi.json", ["immobilized"]],
        ["soulbound-kido/quincy/gritz.json", ["immobilized", "restrained"]],
        ["soulbound-techniques/hyoten-hyakkaso.json", ["restrained"]],
        ["soulbound-techniques/ryusenka.json", ["immobilized"]],
        ["soulbound-techniques/sennen-hyoro.json", ["immobilized", "restrained"]],
        ["soulbound-techniques/sprenger.json", ["restrained"]],
    ];

    const found = [];
    for (const [file] of promised) {
        const doc = contentDoc(file);
        const held = [];
        const walk = (node) => {
            if (Array.isArray(node)) return node.forEach(walk);
            if (!node || typeof node !== "object") return;
            if (node.escapeDc !== undefined) held.push([node.type, node.slug, node.escapeDc]);
            for (const value of Object.values(node)) walk(value);
        };
        walk(doc.flags?.["isaacs-hb-pf2e"] ?? {});
        found.push([file, held.map(([, slug]) => slug)]);
        check(
            `${file}: every grip it applies is escapable against the Reiatsu DC`,
            held.map(([type, , dc]) => `${type}:${dc}`),
            held.map(() => "condition:reiatsu"),
        );
    }
    check("all nine grips are accounted for", found, promised);
}

report("Soulbound tests");

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
    return errors;
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
    ["d8", "slashing", ["two-hand-d10", "versatile-p"]],
);

const greatBlade = contentDoc("soulbound-equipment/great-blade.json");
// Guide §4.1 says "two-handed, sweep", but pf2e has no `two-handed` trait: a weapon that is only ever
// two-handed says so in `usage`, exactly as its own greatsword does. Correction for guide v1.4.
check(
    "Great Blade: 1d10 slashing, sweep, two-handed expressed in usage as pf2e does it",
    [greatBlade.system.damage.die, greatBlade.system.usage.value, [...greatBlade.system.traits.value].sort()],
    ["d10", "held-in-two-hands", ["sweep"]],
);

const paired = contentDoc("soulbound-equipment/paired-blades.json");
check(
    "Paired Blades: 1d6 slashing, agile, finesse, twin (guide §4.1)",
    [paired.system.damage.die, [...paired.system.traits.value].sort()],
    ["d6", ["agile", "finesse", "twin"]],
);

const bow = contentDoc("soulbound-equipment/spirit-bow.json");
check(
    "Spirit Bow: 1d8 piercing, propulsive, range 60, reload 0 (guide §4.1)",
    [bow.system.damage.die, bow.system.damage.damageType, bow.system.range, bow.system.reload.value],
    ["d8", "piercing", 60, "0"],
);

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
check(
    "the pressure emanation is a turn-end area rider on the Reiatsu DC (guide §4.8)",
    [emanation.event, emanation.area.value, emanation.apply.type, emanation.apply.statistic, emanation.apply.dc],
    ["turn-end", 15, "save", "will", "reiatsu"],
);
check(
    "a creature that succeeds is made immune for 10 minutes rather than asked again",
    contentDoc("soulbound-effects/effect-steeled-against-pressure.json").system.duration,
    { expiry: null, sustained: false, unit: "minutes", value: 10 },
);

/* ---------------------------------------------------------------------------------------------- */
/*  The live test rig                                                                               */
/* ---------------------------------------------------------------------------------------------- */

const rig = contentDoc("soulbound-macros/test-rig.json");
check("the rig is a script macro", [rig.type, typeof rig.command], ["script", "string"]);
check(
    "it carries the three guards that cost hours in earlier live sessions",
    [
        rig.command.includes("PickAThingPrompt"),
        rig.command.includes("system.details.alliance"),
        rig.command.includes("deepClone"),
    ],
    [true, true, true],
);
check("it never default-picks a Spirit — an unknown prompt is left open", rig.command.includes("return undefined"), true);
// A macro with a syntax error fails silently at the table: no dialog, no console entry the GM would see.
try {
    new Function(rig.command);
    check("the rig parses as JavaScript", true, true);
} catch (error) {
    check("the rig parses as JavaScript", String(error), true);
}
check("it asserts the Reiatsu DC stops at master, not legendary", rig.command.includes("not legendary"), true);

report("Soulbound tests");

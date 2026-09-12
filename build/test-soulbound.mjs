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
// look for it on a spell, so authoring it here would validate and do nothing.
check(
    "Bala's agile clause is a MultipleAttackPenalty rule, not an inert weapon trait",
    [
        bala.system.traits.value.includes("agile"),
        bala.system.rules.some((r) => r.key === "MultipleAttackPenalty" && r.value === 1),
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
check(
    "Sonido is +5 ft below 11th and +10 at 11th, never both",
    hierro.system.rules.filter((r) => r.key === "FlatModifier" && r.selector === "speed").map((r) => r.value),
    [5, 10],
);

const regen = lineageDoc("regeneracion");
const fh = regen.system.rules.find((r) => r.key === "FastHealing");
check("Regeneración is fast healing that scales 2 / 4 / 6 (guide §5.2)", typeof fh?.value === "string" && fh.value.includes("17"), true);
// The spelling matters more than the presence. pf2e emits `self:condition:dying` with no value suffix —
// `self:condition:dying:0` is never true, so a predicate written that way leaves fast healing permanently
// OFF, which looks exactly like the feature not existing. `self:effect:<slug>` is pf2e's own spelling too
// (see its `air-gate` class feature).
check(
    "and it is off while dying and while suppressed, in pf2e's own spellings",
    fh?.predicate,
    [{ not: "self:condition:dying" }, { not: "self:effect:regeneracion-suppressed" }],
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

const dankuReaction = kidoDoc("bakudo", "danku").flags["isaacs-hb-pf2e"].riders[0];
check(
    "Danku is a real reaction offered when damage lands (guide §6.2)",
    [dankuReaction.apply.type, dankuReaction.event, dankuReaction.self],
    ["reaction", "damage-applied", true],
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
    senbon.system.rules.filter((r) => r.key === "GrantItem").length, 3);
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
const refined = featureDoc("refined-release");
check(
    "Refined Release widens a Release Technique's area by 5 feet",
    refined.system.rules.find((r) => r.key === "ItemAlteration"),
    { itemType: "spell", key: "ItemAlteration", mode: "add", predicate: ["item:tag:sb-tier-release"], property: "area-size", value: 5 },
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
check(
    "the Bankai ticks at the start of your turn against enemies in the emanation",
    (() => {
        const r = contentDoc("soulbound-effects/effect-senbonzakura-kageyoshi.json").flags["isaacs-hb-pf2e"].riders[0];
        return [r.event, r.apply.formula, r.area.value, r.areaTargeting.affects];
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
    hyorin.system.rules.filter((r) => r.key === "GrantItem").length, 3);

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
// pf2e's `damage-dice-faces` steps once per `upgrade` and refuses a value unless the mode is override.
// Two steps is two rules, which is also how the Bankai says "two steps instead of one" out loud.
check(
    "the Shikai steps the die once; Zanka no Tachi steps it twice",
    [
        contentDoc("soulbound-effects/effect-zangetsu-shikai.json").system.rules
            .filter((r) => r.property === "damage-dice-faces").length,
        contentDoc("soulbound-effects/effect-zanka-no-tachi.json").system.rules
            .filter((r) => r.property === "damage-dice-faces").length,
    ],
    [1, 2],
);
check(
    "Tensa Zangetsu compresses: Getsuga to 1 action, Flash Step to twice a round",
    (() => {
        const rules = contentDoc("soulbound-effects/effect-tensa-zangetsu.json").system.rules;
        return [
            rules.some((r) => r.property === "time" && r.value === "1"),
            rules.some((r) => r.property === "frequency-max" && r.value === 2),
            rules.some((r) => r.property === "damage-dice-faces"),
        ];
    })(),
    [true, true, false],
);

const getsuga = techDoc("getsuga-tensho");
check(
    "Getsuga Tenshō: 30-foot line, 2d6 spirit, +1d6 per rank (guide §7A)",
    [getsuga.system.area, getsuga.system.damage["0"].formula, getsuga.system.damage["0"].type],
    [{ type: "line", value: 30 }, "2d6", "spirit"],
);
check(
    "and Kuroi Getsuga's spirit-resistance bypass waits for Refined Release",
    getsuga.flags["isaacs-hb-pf2e"].bypass[0].predicate,
    ["self:feature:refined-release"],
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
    kyoka.system.rules.filter((r) => r.key === "GrantItem").length, 3);

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
    check(`${name}: three rungs granted, the Full Release gated to 13th`, [
        doc.system.rules.filter((r) => r.key === "GrantItem").length,
        doc.system.rules.some((r) => r.key === "GrantItem" && JSON.stringify(r.predicate ?? []).includes("13")),
    ], [3, true]);
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
    check(`${name}: three rungs, the Segunda Etapa gated to 13th`, [
        doc.system.rules.filter((r) => r.key === "GrantItem").length,
        doc.system.rules.some((r) => r.key === "GrantItem" && JSON.stringify(r.predicate ?? []).includes("13")),
    ], [3, true]);
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

const lanza = techDoc("lanza-del-relampago");
check(
    "Lanza del Relámpago is an attack whose burst is the cast's own area, not a second one",
    [lanza.system.defense, lanza.flags["isaacs-hb-pf2e"].areaTargeting.area,
     lanza.flags["isaacs-hb-pf2e"].riders[0].area],
    [null, { type: "burst", value: 15 }, undefined],
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

report("Soulbound tests");

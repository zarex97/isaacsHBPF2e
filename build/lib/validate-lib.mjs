import fs from "node:fs";
import path from "node:path";
import { ROOT, rel } from "./pack.mjs";

const pf2e = JSON.parse(fs.readFileSync(path.join(ROOT, "build", "lib", "pf2e-traits.json"), "utf8"));
const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "module.json"), "utf8"));

/** Rule element keys registered by pf2e 8.3.0 (src/module/rules/index.ts, RuleElements.builtin). */
const RULE_KEYS = new Set([
    "ActiveEffectLike", "ActorTraits", "AdjustDegreeOfSuccess", "AdjustModifier", "AdjustStrike", "Aura",
    "BaseSpeed", "BattleForm", "ChoiceSet", "CraftingAbility", "CreatureSize", "CriticalSpecialization",
    "DamageAlteration", "DamageDice", "DexterityModifierCap", "EphemeralEffect", "FastHealing", "FlatModifier",
    "GrantItem", "Immunity", "ItemAlteration", "LoseHitPoints", "MartialProficiency", "MultipleAttackPenalty",
    "Note", "Resistance", "RollOption", "RollTwice", "Sense", "SpecialResource", "SpecialStatistic", "Strike",
    "SubstituteRoll", "TempHP", "TokenEffectIcon", "TokenImage", "TokenLight", "TokenMark", "TokenName", "Weakness",
]);

const ITEM_TYPES = new Set(["class", "feat", "spell", "effect", "action", "armor", "weapon", "equipment"]);
const ACTION_CATEGORIES = new Set(["offensive", "defensive", "interaction", "familiar", null, undefined]);
const FEAT_CATEGORIES = new Set(["class", "classfeature", "general", "skill", "ancestry", "ancestryfeature", "bonus"]);
const DAMAGE_TYPES = new Set(pf2e.damageTypes);

/** Homebrew traits this module registers in module.json, which are legal everywhere pf2e traits are. */
const homebrew = (() => {
    const hb = manifest.flags?.["isaacs-hb-pf2e"]?.["pf2e-homebrew"] ?? {};
    const keys = new Set();
    for (const record of Object.values(hb)) {
        if (record && typeof record === "object") for (const key of Object.keys(record)) keys.add(key);
    }
    // classTraits propagate to featTraits and spellTraits (pf2e's TRAIT_PROPAGATIONS).
    return keys;
})();

function allowedTraits(itemType) {
    const base =
        itemType === "spell" ? pf2e.spellTraits
        : itemType === "effect" ? pf2e.effectTraits
        : itemType === "armor" || itemType === "weapon" ? pf2e.weaponTraits
        : pf2e.featTraits;
    return new Set([...base, ...pf2e.actionTraits, ...homebrew]);
}

/**
 * Invariants from the class guide that must not silently regress.
 *
 * The guide's §9 is explicit that incapacitation on these is load-bearing — without it they cheese bosses,
 * which is exactly the kind of thing that survives a careless edit. Keyed by slug.
 */
const MUST_BE_INCAPACITATION = new Set([
    "another-dimension",
    "sekishiki-tenryu-ha",
    "rikudo-rinne",
    "antares",
    "freezing-coffin",
    "royal-funeral",
]);

/**
 * Guide v4 §1.3: Techniques have no rank. Each is gained at one of four levels and heightens once per two
 * character levels above it. PF2e has no rankless spell, so a Technique's base rank is ceil(gain / 2).
 */
const SLOT_RANK = { 1: 1, 6: 3, 11: 6, 16: 8 };

export function validate(packs, { errors }) {
    for (const { def, docs } of packs) {
        for (const { file, doc } of docs) {
            const where = rel(file);
            if (def.type === "Item") validateItem(doc, where, errors);
            if (def.type === "JournalEntry") validateJournal(doc, where, errors);
            if (def.type === "Macro") validateMacro(doc, where, errors);
        }
    }
    validateAdvancementTable(packs, errors);
}

function validateItem(doc, where, errors) {
    if (!ITEM_TYPES.has(doc.type)) errors.push(`${where}: unknown item type "${doc.type}"`);
    if (!doc.img) errors.push(`${where}: missing img`);
    const system = doc.system;
    if (!system) {
        errors.push(`${where}: missing system data`);
        return;
    }
    if (!system.description?.value) errors.push(`${where}: missing description`);
    if (!system.publication) errors.push(`${where}: missing publication block`);

    // Traits
    const traits = system.traits?.value;
    if (doc.type !== "class" && !Array.isArray(traits)) {
        errors.push(`${where}: missing system.traits.value`);
    } else if (Array.isArray(traits)) {
        const allowed = allowedTraits(doc.type);
        for (const trait of traits) {
            if (!allowed.has(trait)) errors.push(`${where}: unknown ${doc.type} trait "${trait}"`);
        }
    }

    // Rule elements
    for (const [i, rule] of (system.rules ?? []).entries()) {
        if (!rule.key) errors.push(`${where}: rules[${i}] has no key`);
        else if (!RULE_KEYS.has(rule.key)) errors.push(`${where}: rules[${i}] unknown key "${rule.key}"`);
    }

    // pf2e nulls selfEffect on any item whose actionType is "passive" (item/ability/data.ts). A passive
    // item carrying one looks correct in the JSON and silently does nothing at the table, which is exactly
    // the failure this check exists to stop.
    if (system.selfEffect && system.actionType?.value === "passive") {
        errors.push(
            `${where}: selfEffect on a passive item is discarded by pf2e — give the activity its own ` +
                `action item and GrantItem it instead`,
        );
    }

    if (doc.type === "feat") validateFeat(doc, where, errors);
    if (doc.type === "spell") validateSpell(doc, where, errors);
    if (doc.type === "effect") validateEffect(doc, where, errors);
    if (doc.type === "class") validateClass(doc, where, errors);
    if (doc.type === "action" && !ACTION_CATEGORIES.has(system.category)) {
        errors.push(`${where}: bad action category "${system.category}"`);
    }

    if (MUST_BE_INCAPACITATION.has(system.slug) && !(traits ?? []).includes("incapacitation")) {
        errors.push(
            `${where}: "${system.slug}" removes a creature from the fight and must carry the incapacitation trait ` +
                `(class guide §9)`,
        );
    }
}

function validateFeat(doc, where, errors) {
    const system = doc.system;
    if (typeof system.level?.value !== "number") errors.push(`${where}: feat missing system.level.value`);
    if (!FEAT_CATEGORIES.has(system.category)) errors.push(`${where}: bad feat category "${system.category}"`);
    if (!system.actionType?.value) errors.push(`${where}: feat missing actionType.value`);
    if (system.category === "class" && !(system.traits?.value ?? []).includes("saint")) {
        errors.push(`${where}: Saint class feat must carry the "saint" trait`);
    }
    for (const [slug, increase] of Object.entries(system.subfeatures?.proficiencies ?? {})) {
        if (typeof increase?.rank !== "number") {
            errors.push(`${where}: subfeatures.proficiencies.${slug} needs a numeric rank`);
        }
    }
}

function validateSpell(doc, where, errors) {
    const system = doc.system;
    const traits = system.traits?.value ?? [];
    const rank = system.level?.value;
    if (typeof rank !== "number" || rank < 1 || rank > 10) errors.push(`${where}: spell rank must be 1-10`);
    for (const required of ["focus", "cosmo", "saint"]) {
        if (!traits.includes(required)) errors.push(`${where}: Technique must carry the "${required}" trait`);
    }
    if (!system.traits?.traditions) errors.push(`${where}: spell missing traits.traditions`);

    const damage = system.damage ?? {};
    const damageEntries = Object.entries(damage);
    for (const [key, part] of damageEntries) {
        if (part.type && !DAMAGE_TYPES.has(part.type)) {
            errors.push(`${where}: damage.${key} unknown damage type "${part.type}"`);
        }
        if (!part.formula) errors.push(`${where}: damage.${key} has no formula`);
    }

    // Every Technique must declare which slot it occupies, because its base rank has to match: a
    // mismatch would silently put it at the wrong power level for the whole campaign.
    const slotTag = (system.traits?.otherTags ?? []).find((t) => t.startsWith("technique-slot-"));
    if (!slotTag) {
        errors.push(`${where}: Technique has no technique-slot-<level> tag (guide v4 §1.3)`);
    } else {
        const gained = Number(slotTag.slice("technique-slot-".length));
        if (!(gained in SLOT_RANK)) {
            errors.push(`${where}: Technique slot must be gained at 1, 6, 11, or 16 — got ${gained}`);
        } else if (rank !== SLOT_RANK[gained]) {
            errors.push(
                `${where}: a Technique gained at level ${gained} must have base rank ${SLOT_RANK[gained]}, ` +
                    `not ${rank}`,
            );
        }
    }

    // The heightening spine: a damaging Technique must scale, or it silently falls off at high level.
    if (damageEntries.length > 0) {
        const heightening = system.heightening;
        if (!heightening) {
            errors.push(`${where}: damaging Technique has no heightening block (rank spine, guide §1.3)`);
        } else if (heightening.type === "interval") {
            if (heightening.interval !== 1) {
                errors.push(`${where}: interval heightening must step every rank (interval: 1)`);
            } else if (!heightening.damage || Object.keys(heightening.damage).length === 0) {
                errors.push(`${where}: Technique heightening has no per-rank damage`);
            }
        } else if (heightening.type === "fixed") {
            if (!heightening.levels || Object.keys(heightening.levels).length === 0) {
                errors.push(`${where}: fixed heightening has no levels`);
            }
        } else {
            errors.push(`${where}: Technique heightening type must be "interval" or "fixed"`);
        }

        // The sky's +4 / +8 levels is +2 / +4 heightening steps, automated per Technique. A damaging
        // Technique without both rules is one the sky silently fails to boost.
        const skyRules = (system.rules ?? []).filter(
            (r) => r.key === "DamageDice" && String(r.label ?? "").startsWith("Sky:"),
        );
        const tiers = new Set(skyRules.map((r) => (String(r.label).includes("Zenith") ? "z" : "a")));
        if (!tiers.has("a") || !tiers.has("z")) {
            errors.push(
                `${where}: damaging Technique is missing its Ascendant and/or Zenith heightening dice ` +
                    `(guide v4 §1.2)`,
            );
        }
    }
}

function validateEffect(doc, where, errors) {
    const system = doc.system;
    if (!system.duration) errors.push(`${where}: effect missing duration`);
    if (typeof system.level?.value !== "number") errors.push(`${where}: effect missing level.value`);
    if (!system.tokenIcon) errors.push(`${where}: effect missing tokenIcon`);
}

function validateClass(doc, where, errors) {
    const system = doc.system;
    if (system.slug !== "saint") errors.push(`${where}: class slug must be "saint" (it keys the Cosmo DC)`);
    if (!(system.traits?.value ?? []).includes("saint")) errors.push(`${where}: class must carry the "saint" trait`);
    if (system.hp !== 10) errors.push(`${where}: Saint HP should be 10 (guide §2)`);
    const keyAbility = system.keyAbility?.value ?? [];
    if (keyAbility.length !== 2 || !keyAbility.includes("str") || !keyAbility.includes("dex")) {
        errors.push(`${where}: key ability should be Strength or Dexterity (guide §1.5)`);
    }
    for (const [key, grant] of Object.entries(system.items ?? {})) {
        if (typeof grant.level !== "number") errors.push(`${where}: items.${key} missing level`);
        if (!grant.uuid) errors.push(`${where}: items.${key} missing uuid`);
    }
}

function validateJournal(doc, where, errors) {
    if (!Array.isArray(doc.pages) || doc.pages.length === 0) errors.push(`${where}: journal has no pages`);
    for (const [i, page] of (doc.pages ?? []).entries()) {
        if (!page._id) errors.push(`${where}: pages[${i}] missing _id`);
        if (!page.name) errors.push(`${where}: pages[${i}] missing name`);
    }
}

function validateMacro(doc, where, errors) {
    if (!doc.command) errors.push(`${where}: macro has no command`);
    if (!doc.type) errors.push(`${where}: macro has no type`);
}

/**
 * The class item's grant levels must match the guide's advancement table (§3). This is the single easiest
 * thing to get wrong by hand and the hardest to notice in play.
 */
const ADVANCEMENT = {
    1: ["The Cloth", "Cosmo", "Ascendant Constellation", "Cosmo Strike", "Unfailing Cosmo",
        "Shelter of the Cloth"],
    3: ["Iron Will"],
    5: ["Expert Cosmo Strike", "Sky-Reading"],
    6: ["Second Technique"],
    7: ["Sixth Sense", "Second Cosmo", "Alertness", "Weapon Specialization"],
    9: ["Cosmo Expertise", "Juggernaut"],
    11: ["Third Technique"],
    13: ["Cloth Mastery", "Armor Expertise", "Third Cosmo"],
    15: ["Seventh Sense", "Greater Weapon Specialization", "Evasion"],
    16: ["Fourth Technique"],
    17: ["Cosmo Mastery", "Cloth Attunement"],
    19: ["Eighth Sense"],
};

function validateAdvancementTable(packs, errors) {
    const classPack = packs.find((p) => p.def.name === "saint-class");
    const saint = classPack?.docs.find((d) => d.doc.system?.slug === "saint")?.doc;
    if (!saint) return; // absent during early scaffolding; the class validator reports a missing class

    const byLevel = {};
    for (const grant of Object.values(saint.system.items ?? {})) {
        (byLevel[grant.level] ??= []).push(grant.name);
    }
    for (const [level, expected] of Object.entries(ADVANCEMENT)) {
        const actual = byLevel[level] ?? [];
        for (const name of expected) {
            if (!actual.some((a) => a.startsWith(name))) {
                errors.push(`content/saint-class: advancement table expects "${name}" at level ${level} (guide §3)`);
            }
        }
    }
}

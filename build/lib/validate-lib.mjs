import fs from "node:fs";
import path from "node:path";
import { ROOT, rel } from "./pack.mjs";

const pf2e = JSON.parse(fs.readFileSync(path.join(ROOT, "build", "lib", "pf2e-traits.json"), "utf8"));
/** pf2e's immunity/weakness/resistance dictionaries, snapshotted from a running 8.3.0. */
const iwr = JSON.parse(fs.readFileSync(path.join(ROOT, "build", "lib", "pf2e-iwr.json"), "utf8"));
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

const ITEM_TYPES = new Set(["class", "feat", "spell", "effect", "action", "armor", "weapon", "shield", "equipment"]);

/** The six Arms of the Libra Cloth, as an `equip` rider names them. */
const LIBRA_ARMS = new Set(["twin-swords", "tridents", "nunchaku", "shields", "sanjiegun", "tonfa"]);

/** ItemAlteration properties whose pf2e handler declares `value` as required, so `upgrade` needs one. */
const UPGRADE_TAKES_A_VALUE = new Set([
    "runes-potency", "runes-striking", "runes-resilient", "damage-dice-number", "hardness", "hp-max",
]);
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
        // A shield's traits are filtered against `CONFIG.PF2E.shieldTraits` in `prepareBaseData` and
        // anything else is dropped before the item is ever read — silently, which is how Libra's Shields
        // would have lost `twin` and `versatile S` without a word. Those live on the *generated* weapon
        // instead, added by the Cloth; the shield itself may only carry what pf2e will keep.
        : itemType === "shield" ? pf2e.shieldTraits
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
    validateActionsAreReachable(packs, errors);
}

/**
 * Every action item must be granted by something.
 *
 * An action nothing grants is invisible at the table — which is precisely the bug that had a Virgo Saint
 * with no Om on their sheet. The data looked fine; the character just couldn't do it.
 */
function validateActionsAreReachable(packs, errors) {
    // This runs after prepare(), which has already rewritten name-based UUIDs to IDs — so match on the
    // document ID, not the name, or every action looks orphaned.
    const actions = new Map();
    const granted = new Set();
    for (const { docs } of packs) {
        for (const { file, doc } of docs) {
            if (doc.type === "action") actions.set(doc._id, { name: doc.name, file });
            for (const rule of doc.system?.rules ?? []) {
                if (rule.key !== "GrantItem" || typeof rule.uuid !== "string") continue;
                granted.add(rule.uuid.split(".").at(-1));
            }
        }
    }
    for (const [id, { name, file }] of actions) {
        if (!granted.has(id)) {
            errors.push(
                `${rel(file)}: nothing grants the action "${name}", so no character will ever see it — ` +
                    `add a GrantItem on the feature or sky effect that provides it`,
            );
        }
    }
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

        // pf2e's numeric ItemAlteration handlers reject a value alongside `upgrade` or `downgrade`: those
        // modes mean "one step better/worse", and only `override` names a number. Getting it wrong throws a
        // DataModelValidationError during actor preparation, which kills the rest of that item's rules —
        // *Cosmo Strike* shipped with `mode: "upgrade", value: 6` and so never made the Saint's fist a d6.
        //
        // Four handlers are the exception, and they are the exception in the other direction: their `value`
        // is a *required* field, so `upgrade` there means "raise it to at least this" and omitting the
        // number is what fails. That is exactly what the Arms Advance needs — the guide says to use the
        // better of a granted tier and an etched rune, which is `upgrade` and nothing else. Each pair below
        // was checked against a running pf2e 8.4.1 rather than read off the schema, because the schema is
        // built inside a closure the module cannot reach.
        if (rule.key === "ItemAlteration" && ["upgrade", "downgrade"].includes(rule.mode)
            && !UPGRADE_TAKES_A_VALUE.has(rule.property)
            && rule.value !== undefined && rule.value !== null) {
            errors.push(
                `${where}: rules[${i}] ItemAlteration "${rule.property}" has mode "${rule.mode}" with a ` +
                    `value — pf2e requires the value be omitted unless the mode is "override"`,
            );
        }

        // Immunity, Weakness and Resistance validate their type against pf2e's own dictionaries and
        // fail the whole rule element on an unknown one. Leo shipped immune to "fear" and Arayashiki to
        // "death" and "dying"; the real names are "fear-effects" and "death-effects", and there is no
        // `dying` immunity at all. Each was a silent no-op plus a console warning on every prepare.
        if (["Immunity", "Weakness", "Resistance"].includes(rule.key)) {
            const known = rule.key === "Immunity" ? iwr.immunity
                : rule.key === "Weakness" ? iwr.weakness : iwr.resistance;
            const types = Array.isArray(rule.type) ? rule.type : [rule.type];
            for (const type of types.filter(Boolean)) {
                if (!known.includes(type)) {
                    errors.push(
                        `${where}: rules[${i}] ${rule.key} type "${type}" is not a pf2e ` +
                            `${rule.key.toLowerCase()} type — the rule element fails at runtime`,
                    );
                }
            }
        }

        // ActorTraits validates every added trait against pf2e's creature-trait dictionary and calls
        // failValidation on anything unknown — so a size slug like "large" is not a quiet no-op, it is a
        // console error at runtime that can abort the rest of the item's rules.
        if (rule.key === "ActorTraits") {
            for (const trait of rule.add ?? []) {
                if (!pf2e.creatureTraits.includes(trait)) {
                    errors.push(
                        `${where}: rules[${i}] ActorTraits adds "${trait}", which is not a creature trait — ` +
                            `pf2e fails validation on it at runtime`,
                    );
                }
            }
        }
    }

    if (doc.type === "feat") validateFeat(doc, where, errors);
    if (doc.type === "spell") validateSpell(doc, where, errors);
    if (doc.type === "effect") validateEffect(doc, where, errors);
    if (doc.type === "class") validateClass(doc, where, errors);

    validateAreaTargeting(doc, where, errors);
    validateRiders(doc, where, errors);
    validateCounterThresholds(doc, where, errors);
    validateBypass(doc, where, errors);
    validateFreeCast(doc, where, errors);
    validateFrequency(doc, where, errors);
    validateLingering(doc, where, errors);
    validateAstral(doc, where, errors);
    validateSouls(doc, where, errors);

    if (MUST_BE_INCAPACITATION.has(system.slug) && !(traits ?? []).includes("incapacitation")) {
        errors.push(
            `${where}: "${system.slug}" removes a creature from the fight and must carry the incapacitation trait ` +
                `(class guide §9)`,
        );
    }
}

/** Effect-area shapes pf2e can build a Region from (EFFECT_AREA_SHAPES in src/module/item/values.ts). */
const AREA_SHAPES = new Set(["burst", "cone", "cube", "cylinder", "emanation", "line", "ring", "square"]);
const AFFECTS = new Set(["all", "allies", "enemies"]);

/**
 * The area-targeting flag read by scripts/targeting.
 *
 * Worth validating for the same reason the trait and rule-key snapshots are: a typo here produces no error
 * at runtime, only a Technique that quietly goes back to manual targeting — which is indistinguishable
 * from the feature being off, and so gets diagnosed as "the module is broken".
 */
function validateAreaTargeting(doc, where, errors) {
    const flag = doc.flags?.["isaacs-hb-pf2e"]?.areaTargeting;
    if (!flag) return;

    // Spells aim through `cast`; actions aim through `toMessage`. Nothing else reaches either wrapper.
    if (!["spell", "action"].includes(doc.type)) {
        errors.push(`${where}: areaTargeting is only read on spells and actions, not ${doc.type}`);
        return;
    }
    if (flag.affects !== undefined && !AFFECTS.has(flag.affects)) {
        errors.push(`${where}: areaTargeting.affects must be all/allies/enemies — got "${flag.affects}"`);
    }
    // Whether the area is aimed or centred on the caster usually follows from its shape — an emanation
    // has one place to be and everything else is pointed somewhere. `anchor` is the exception, and exists
    // for the one Technique whose shape and whose origin disagree: *Rozan Shō Ryū Ha* is a cylinder that
    // climbs out of the Saint's own square, and putting it on the cursor asks the player to aim something
    // that can only go in one place.
    if (flag.anchor !== undefined && !["self", "free"].includes(flag.anchor)) {
        errors.push(
            `${where}: areaTargeting.anchor must be "self" (centred on the caster) or "free" (aimed) — `
                + `got "${flag.anchor}"`,
        );
    }
    if (flag.predicate !== undefined && !Array.isArray(flag.predicate)) {
        errors.push(`${where}: areaTargeting.predicate must be an array`);
    }
    for (const key of ["maxTargets", "range", "areas", "length"]) {
        const value = flag[key];
        if (value !== undefined && !(Number.isInteger(value) && value > 0)) {
            errors.push(`${where}: areaTargeting.${key} must be a positive integer`);
        }
    }
    validateHeightening(flag, where, errors);

    // A synthetic area exists precisely because the spell has none; supplying both means one of them is
    // being ignored, and which one is not obvious from the file.
    const own = doc.system?.area;
    if (flag.area && own) {
        errors.push(`${where}: areaTargeting.area duplicates system.area — remove one`);
    }
    // No area at all is legitimate for a Technique that names a target count and a range instead — those
    // are checked against the targets the player picked. But a block with neither does nothing.
    if (!flag.area && !own && !flag.maxTargets && !flag.range) {
        errors.push(
            `${where}: areaTargeting has no area and no maxTargets or range, so it has nothing to do`,
        );
    }
    if (flag.area) {
        if (!AREA_SHAPES.has(flag.area.type)) {
            errors.push(`${where}: areaTargeting.area.type "${flag.area.type}" is not an effect-area shape`);
        }
        if (!(Number(flag.area.value) > 0)) {
            errors.push(`${where}: areaTargeting.area.value must be a positive number of feet`);
        }
    }

}

const OUTCOMES = new Set(["criticalSuccess", "success", "failure", "criticalFailure"]);
const CONDITION_SLUGS = new Set(pf2e.conditionSlugs);
const DURATION_UNITS = new Set(["rounds", "minutes", "hours", "days", "unlimited", "encounter"]);
const RIDER_TYPES = new Set([
    "condition", "effect", "prompt", "choice", "save", "damage", "persistent-damage", "death", "teleport",
    "strikes", "banish", "heal", "readout", "toggle", "counteract", "encasement", "escape",
    "equip",
]);
const RIDER_EVENTS = new Set([
    "save-rolled", "strike-resolved", "strike-received", "action-used", "damage-applied",
    "turn-end", "turn-start", "aura-tick",
]);
const RESISTANCE_TYPES = new Set([...pf2e.damageTypes, "all-damage", "physical", "precision", "critical-hits"]);
const IMMUNITY_TYPES = RESISTANCE_TYPES;
const SAVE_STATISTICS = new Set(["fortitude", "reflex", "will"]);
const DICE_FORMULA = /^\d*d\d+$/;
/** A rider's damage may also be a flat number: a 30-foot fall is 15 bludgeoning, not 15 of anything. */
const FLAT_OR_DICE = /^(\d*d\d+|\d+)$/;

/**
 * The riders read by scripts/riders.
 *
 * A rider that never fires looks exactly like the automation being switched off, so every way of writing
 * one wrong is checked here: an outcome that is not one of the four degrees, a condition slug pf2e does
 * not have, a duration unit the effect schema will reject. The compendium UUID of an `effect` rider is not
 * checked here because prepare() already fails the build on an unresolvable one.
 */
/**
 * The IWR-bypass flag read by scripts/riders/bypass.mjs.
 *
 * The split between a total ignore and a partial reduction is load-bearing and easy to get wrong: pf2e's
 * own `max` on an ignored resistance is not honoured by `applyIWR`, so a partial reduction is applied by
 * lowering the target's resistances instead. Writing `max` alongside a type list that says "all" is fine;
 * writing it and expecting it to reach `bypass` is not, and the difference is invisible at the table.
 */
function validateBypass(doc, where, errors) {
    const entries = doc.flags?.["isaacs-hb-pf2e"]?.bypass;
    if (entries === undefined) return;
    if (!Array.isArray(entries)) {
        errors.push(`${where}: bypass must be an array`);
        return;
    }

    for (const [i, entry] of entries.entries()) {
        const at = `${where}: bypass[${i}]`;
        if (entry.predicate !== undefined && !Array.isArray(entry.predicate)) {
            errors.push(`${at} predicate must be an array`);
        }
        if (!entry.resistance && !entry.immunity && !entry.hardness) {
            errors.push(`${at} does nothing — give it a resistance, an immunity or a hardness`);
        }

        for (const [key, dictionary] of [["resistance", RESISTANCE_TYPES], ["immunity", IMMUNITY_TYPES]]) {
            const block = entry[key];
            if (block === undefined) continue;
            if (block.types !== "all" && !Array.isArray(block.types)) {
                errors.push(`${at} ${key}.types must be "all" or an array of types`);
            } else if (Array.isArray(block.types)) {
                for (const type of block.types) {
                    if (!dictionary.has(type)) errors.push(`${at} "${type}" is not a pf2e ${key} type`);
                }
            }
        }

        const resistance = entry.resistance;
        if (resistance && resistance.max !== undefined && resistance.max !== null) {
            if (!(Number.isInteger(resistance.max) && resistance.max > 0)) {
                errors.push(`${at} resistance.max must be null (ignore entirely) or a positive integer`);
            }
        }

        const immunity = entry.immunity;
        if (immunity) {
            if (!["ignore", "downgrade"].includes(immunity.mode)) {
                errors.push(`${at} immunity.mode must be "ignore" or "downgrade" — got "${immunity.mode}"`);
            }
            if (immunity.mode === "downgrade" && !(Number(immunity.resistance) > 0)) {
                errors.push(`${at} a downgraded immunity needs the resistance it becomes`);
            }
        }

        if (entry.hardness !== undefined && entry.hardness !== "ignore") {
            errors.push(`${at} hardness may only be "ignore"`);
        }
    }
}

/**
 * Any item's frequency, not only a free cast's.
 *
 * pf2e's intervals are ISO-ish codes — `PT1H` is "once per hour", and there is no `hour`. An unrecognised
 * one is not rejected by the system: it is stored, displayed as an empty label, and never recharged, so the
 * ability works once and then quietly never again. This was checked only for items carrying the free-cast
 * flag, which meant *Swap Aspect*'s "once per hour" could ship with an interval that does not exist.
 */
function validateFrequency(doc, where, errors) {
    const frequency = doc.system?.frequency;
    if (!frequency) return;
    if (!(Number(frequency.max) > 0)) {
        errors.push(`${where}: system.frequency.max must be a positive number — got "${frequency.max}"`);
    }
    if (!FREQUENCY_INTERVALS.has(frequency.per)) {
        errors.push(
            `${where}: system.frequency.per "${frequency.per}" is not a pf2e interval `
                + `(${[...FREQUENCY_INTERVALS].join("/")}) — it would never recharge`,
        );
    }
}

/**
 * The lingering-area spec: what a Technique leaves on the ground behind it.
 *
 * The check that earns its place is the last one. *Mavros Eruption Clast* shipped with its area's persistent
 * fire written as a second `system.damage` part, which pf2e rolls unconditionally against everyone caught
 * in the blast — the same shape as *Titan's Break*'s critical-failure-only 4d8. Now that the burning ground
 * deals it, having it in both places would deal it twice.
 */
function validateLingering(doc, where, errors) {
    const flag = doc.flags?.["isaacs-hb-pf2e"]?.lingering;
    if (flag === undefined) return;
    const at = `${where}: lingering`;

    if (!(Number(flag.duration?.value) > 0)) {
        errors.push(`${at} needs a duration — an area with no expiry is never swept off the map`);
    } else if (!DURATION_UNITS.has(flag.duration.unit)) {
        errors.push(`${at}.duration.unit "${flag.duration.unit}" is not a duration unit`);
    }
    // Five things a patch of ground can be. Three are Region behaviors, two are scenery placed beside the
    // Region — but all five are swept away by the same expiry, so all five count as doing something.
    if (!flag.difficultTerrain && !flag.damage && !flag.save && !flag.light && !flag.blocksSight) {
        errors.push(`${at} does nothing: give it difficultTerrain, damage, save, light or blocksSight`);
    }
    if (flag.blocksSight !== undefined && typeof flag.blocksSight !== "boolean") {
        errors.push(`${at}.blocksSight must be true or false`);
    }
    if (flag.light !== undefined) {
        for (const key of ["bright", "dim"]) {
            if (flag.light[key] !== undefined && !(Number(flag.light[key]) >= 0)) {
                errors.push(`${at}.light.${key} must be a distance in feet — got "${flag.light[key]}"`);
            }
        }
        if (flag.light.color !== undefined && !/^#[0-9a-f]{6}$/i.test(String(flag.light.color))) {
            errors.push(`${at}.light.color must be a hex colour like "#8ecbff" — got "${flag.light.color}"`);
        }
    }
    if (flag.difficultTerrain !== undefined && !(Number(flag.difficultTerrain) > 1)) {
        errors.push(`${at}.difficultTerrain is a movement multiplier and must be above 1`);
    }
    if (flag.damage) {
        if (!DICE_FORMULA.test(String(flag.damage.formula ?? ""))) {
            errors.push(`${at}.damage needs a formula like "4d6" — got "${flag.damage.formula}"`);
        }
        if (!DAMAGE_TYPES.has(flag.damage.type)) {
            errors.push(`${at}.damage "${flag.damage.type}" is not a pf2e damage type`);
        }
        if (flag.damage.perStep !== undefined && !DICE_FORMULA.test(String(flag.damage.perStep))) {
            errors.push(`${at}.damage.perStep needs a formula like "1d6" — got "${flag.damage.perStep}"`);
        }
        const duplicated = Object.values(doc.system?.damage ?? {}).some(
            (part) => part?.category === "persistent" && part?.type === flag.damage.type,
        );
        if (duplicated) {
            errors.push(
                `${at}.damage is also a persistent part of system.damage — pf2e rolls that against `
                    + `everyone the blast catches, so the area would burn them twice`,
            );
        }
    }
    if (flag.events !== undefined && (!Array.isArray(flag.events) || flag.events.length === 0)) {
        errors.push(`${at}.events must be a non-empty array of region event names`);
    }
    // *Royal Demon Rose* — "any creature that starts its turn in the area must attempt a Fortitude save" —
    // is a save with its own outcome ladder, not a flat tick, so it earns the same shape a `save` rider's
    // `apply` does and the same recursive check every one of its nested riders gets anywhere else.
    if (flag.save) {
        const sat = `${at}.save`;
        if (!SAVE_STATISTICS.has(flag.save.statistic)) {
            errors.push(`${sat} needs fortitude/reflex/will — got "${flag.save.statistic}"`);
        }
        if (flag.save.dc !== "cosmo" && !Number.isInteger(flag.save.dc)) {
            errors.push(`${sat} dc must be "cosmo" or a whole number — got "${flag.save.dc}"`);
        }
        if (!Array.isArray(flag.save.riders) || flag.save.riders.length === 0) {
            errors.push(`${sat} needs at least one rider of its own, or the save decides nothing`);
        } else {
            flag.save.riders.forEach((inner, j) =>
                validateRider(inner, `${sat}.riders[${j}]`, errors, { doc, depth: 1 }),
            );
        }
    }
}

/** The astral-projection spec, and the aiming it needs. */
function validateAstral(doc, where, errors) {
    const flag = doc.flags?.["isaacs-hb-pf2e"]?.astral;
    if (flag === undefined) return;
    const at = `${where}: astral`;

    if (!(Number(flag.minutes) > 0)) errors.push(`${at}.minutes must be a positive number`);
    if (flag.minutesPerStep !== undefined && !(Number(flag.minutesPerStep) >= 0)) {
        errors.push(`${at}.minutesPerStep must be zero or more`);
    }
    // The body is placed by the area-targeting flow, which needs something to aim and a reach to check it
    // against. Without both, the Technique would project to wherever the cursor happened to be.
    const targeting = doc.flags?.["isaacs-hb-pf2e"]?.areaTargeting;
    if (!targeting?.area?.value) {
        errors.push(`${at} needs an areaTargeting.area to aim the body with`);
    }
    if (!(Number(targeting?.range) > 0)) {
        errors.push(`${at} needs an areaTargeting.range — the body may only appear within reach`);
    }
}

/** The soul-count spec behind *Sekishiki Konsō Ha*'s "+1d8 for every creature that has died here". */
function validateSouls(doc, where, errors) {
    const flag = doc.flags?.["isaacs-hb-pf2e"]?.souls;
    if (flag === undefined) return;
    const at = `${where}: souls`;

    if (!(Number(flag.max) > 0)) errors.push(`${at}.max must be a positive number of dice`);
    if (!(Number(flag.withinSeconds) > 0)) errors.push(`${at}.withinSeconds must be a positive number`);

    const path = `flags.isaacs-hb-pf2e.${flag.flag ?? "soulDice"}`;
    const rules = doc.system?.rules ?? [];
    const reads = rules.some((rule) => String(rule.diceNumber ?? "").includes(flag.flag ?? "soulDice"));
    if (!reads) errors.push(`${at} is counted but nothing reads it — no rule element uses ${path}`);

    // Without an initialiser the path does not exist until the first cast, and pf2e's injected-property
    // resolution fails validation loudly on every roll until it does.
    const initialised = rules.some(
        (rule) => rule.key === "ActiveEffectLike" && rule.path === path && rule.mode === "add" && rule.value === 0,
    );
    if (!initialised) {
        errors.push(
            `${at} needs an ActiveEffectLike add-0 on ${path} to initialise it, or the rule that reads `
                + `it fails until the first cast`,
        );
    }
}

/** The free-cast flag. Its allowance is the item's own frequency, so the item needs one. */
function validateFreeCast(doc, where, errors) {
    const flag = doc.flags?.["isaacs-hb-pf2e"]?.freeCast;
    if (flag === undefined) return;

    if (flag.predicate !== undefined && !Array.isArray(flag.predicate)) {
        errors.push(`${where}: freeCast.predicate must be an array`);
    }
    const frequency = doc.system?.frequency;
    if (!frequency || !(Number(frequency.max) > 0)) {
        errors.push(
            `${where}: freeCast needs system.frequency to hold the allowance — without one there is ` +
                `nothing to spend, and the boon silently never fires`,
        );
    } else if (!DURATION_UNITS.has(frequency.per) && !FREQUENCY_INTERVALS.has(frequency.per)) {
        errors.push(`${where}: freeCast frequency.per "${frequency.per}" is not a pf2e interval`);
    }
}

const FREQUENCY_INTERVALS = new Set(["turn", "round", "PT1M", "PT10M", "PT1H", "PT24H", "day", "P1W", "P1M", "P1Y"]);

/**
 * The per-step and per-level growth read by scripts/targeting/heightening.mjs.
 *
 * The two are not interchangeable and the difference is the easy mistake: a Technique whose text says
 * "at 12th and 16th level" grows every *four* levels, which no per-step increment can express. Writing it
 * as a step increment would silently hand out a target every two levels instead.
 */
function validateHeightening(flag, where, errors) {
    const heightening = flag.heightening;
    if (heightening === undefined) return;

    const at = `${where}: areaTargeting.heightening`;
    for (const key of ["maxTargets", "range", "areas", "length", "interval"]) {
        const value = heightening[key];
        if (value !== undefined && !(Number.isInteger(value) && value > 0)) {
            errors.push(`${at}.${key} must be a positive integer`);
        }
    }
    // Growth needs something to grow: `range: 10` per step does nothing if the Technique has no range.
    for (const key of ["maxTargets", "range", "length"]) {
        if (heightening[key] !== undefined && !flag[key]) {
            errors.push(`${at}.${key} grows a ${key} the Technique does not have — set a base value`);
        }
    }

    if (heightening.at !== undefined) {
        if (typeof heightening.at !== "object" || Array.isArray(heightening.at)) {
            errors.push(`${at}.at must be an object keyed by character level`);
            return;
        }
        for (const [level, gains] of Object.entries(heightening.at)) {
            const level_ = Number(level);
            if (!(Number.isInteger(level_) && level_ >= 1 && level_ <= 20)) {
                errors.push(`${at}.at has "${level}", which is not a character level`);
            }
            const keys = Object.keys(gains ?? {});
            if (keys.length === 0) errors.push(`${at}.at["${level}"] grants nothing`);
            for (const key of keys) {
                if (!["maxTargets", "areas", "range", "length"].includes(key)) {
                    errors.push(`${at}.at["${level}"] cannot grow "${key}"`);
                } else if (!(Number.isInteger(gains[key]) && gains[key] > 0)) {
                    errors.push(`${at}.at["${level}"].${key} must be a positive integer`);
                }
            }
        }
    }
}

function validateRiders(doc, where, errors) {
    const riders = doc.flags?.["isaacs-hb-pf2e"]?.riders;
    if (riders === undefined) return;
    if (!Array.isArray(riders)) {
        errors.push(`${where}: riders must be an array`);
        return;
    }

    for (const [i, rider] of riders.entries()) {
        validateRider(rider, `${where}: riders[${i}]`, errors, { doc, top: true });
    }
}

/**
 * What a counter effect does when its badge passes a number.
 *
 * Scorpio's three needle thresholds live on **Effect: Scarlet Needle** rather than on each of the five
 * things that place a needle, so they are stated once. The badge is what makes that possible and what makes
 * it fail silently if it is missing: a threshold on an effect with no counter can never be crossed.
 */
function validateCounterThresholds(doc, where, errors) {
    const thresholds = doc.flags?.["isaacs-hb-pf2e"]?.counterThresholds;
    if (thresholds === undefined) return;
    if (!Array.isArray(thresholds) || thresholds.length === 0) {
        errors.push(`${where}: counterThresholds must be a non-empty array`);
        return;
    }
    if (doc.system?.badge?.type !== "counter") {
        errors.push(`${where}: counterThresholds need a counter badge to read — this document has none`);
    }
    const max = Number(doc.system?.badge?.max);
    for (const [i, threshold] of thresholds.entries()) {
        const at = `${where}: counterThresholds[${i}]`;
        if (!(Number.isInteger(threshold.at) && threshold.at > 0)) {
            errors.push(`${at} needs a positive whole \`at\` — got "${threshold.at}"`);
        } else if (max > 0 && threshold.at > max) {
            errors.push(`${at} at ${threshold.at} is above the badge maximum of ${max}, so it never fires`);
        }
        validateRider(threshold, at, errors, { doc, depth: 1 });
    }
}

/**
 * One rider, at any depth.
 *
 * Riders nest: a `save` rider carries the riders its result earns, and a `choice` rider carries one per
 * option. Checking them with the same function is the only way a mistake three levels down still fails the
 * build rather than turning into a Technique that silently does nothing.
 */
function validateRider(rider, at, errors, { doc, top = false, depth = 0 } = {}) {
    if (depth > 3) {
        errors.push(`${at} is nested too deeply — riders may not recurse more than three levels`);
        return;
    }

    const event = rider.event ?? "save-rolled";
    if (!RIDER_EVENTS.has(event)) {
        errors.push(`${at} unknown event "${rider.event}"`);
    }

    // A save rider keys off a degree of success on this item's own save, so a spell without one can never
    // fire it. The other events supply their own outcome and do not care.
    if (top && event === "save-rolled" && doc.type === "spell" && !doc.system?.defense?.save?.statistic) {
        errors.push(`${at} is a save rider, but this spell has no save for it to key off`);
    }

    if (rider.outcomes !== undefined) {
        if (!Array.isArray(rider.outcomes) || rider.outcomes.length === 0) {
            errors.push(`${at} outcomes must be a non-empty array, or absent to mean "any outcome"`);
        } else {
            for (const outcome of rider.outcomes) {
                if (!OUTCOMES.has(outcome)) errors.push(`${at} unknown outcome "${outcome}"`);
            }
        }
    }

    if (rider.predicate !== undefined && !Array.isArray(rider.predicate)) {
        errors.push(`${at} predicate must be an array`);
    }

    if (rider.area !== undefined) {
        if (!AREA_SHAPES.has(rider.area.type)) {
            errors.push(`${at} area.type "${rider.area.type}" is not an effect-area shape`);
        }
        if (!(Number(rider.area.value) > 0)) {
            errors.push(`${at} area.value must be a positive number of feet`);
        }
        if (rider.area.affects !== undefined && !AFFECTS.has(rider.area.affects)) {
            errors.push(`${at} area.affects must be all/allies/enemies — got "${rider.area.affects}"`);
        }
        if (!["turn-start", "turn-end"].includes(event)) {
            errors.push(
                `${at} has an area, which only makes sense on a turn event — got "${event}". An ` +
                    `action-used rider lands on the targets the caster confirmed, so it needs no area.`,
            );
        }
    }

    // A rider chosen against the world as the pass leaves it rather than as it found it. Scorpio's bleed
    // and its death both count needles another rider in the same pass has just placed; an escalation ladder
    // must never be marked this way, or every step of it fires on the first hit.
    if (rider.live !== undefined && typeof rider.live !== "boolean") {
        errors.push(`${at} live must be true or false`);
    }

    const apply = rider.apply;
    if (!apply || !RIDER_TYPES.has(apply.type)) {
        errors.push(`${at} apply.type must be one of ${[...RIDER_TYPES].join("/")} — got "${apply?.type}"`);
        return;
    }

    if (rider.duration !== undefined) {
        if (!DURATION_UNITS.has(rider.duration.unit)) {
            errors.push(`${at} unknown duration unit "${rider.duration.unit}"`);
        }
        if (["prompt", "save", "damage", "death"].includes(apply.type)) {
            errors.push(`${at} a ${apply.type} rider has no duration of its own`);
        }
    }

    // Substitutions are a list, whatever the rider type. Keyed by path, Foundry expands the dots into
    // nested objects the first time the item is written to an actor, and the substitution matches nothing.
    if (apply.substitutions && !Array.isArray(apply.substitutions)) {
        errors.push(`${at} substitutions must be a list of { path, value }, not an object keyed by path`);
    } else {
        for (const [j, substitution] of (apply.substitutions ?? []).entries()) {
            const sat = `${at}.substitutions[${j}]`;
            // Into the effect's rules, or into a rider it carries of its own: *Crimson Mirage* writes the
            // die count for its end-of-turn damage into the effect's own turn-end rider, because that
            // number is the caster's and the effect is about to belong to somebody else.
            const path = substitution?.path;
            if (typeof path !== "string" || !(path.startsWith("system.") || path.startsWith("flags."))) {
                errors.push(`${sat} needs a path into the effect, like "system.rules.0.value"`);
            }
            const value = substitution?.value;
            if (value && typeof value === "object" && !Array.isArray(value) && "at" in value) {
                // A value keyed to character levels. Every key has to be a level, or the threshold is
                // silently never met and the effect hands out its base value forever.
                if (typeof value.at !== "object") {
                    errors.push(`${sat} an object value must be { base, at: { "12": … } }`);
                } else if (Object.keys(value.at).some((level) => !(Number(level) > 0))) {
                    errors.push(`${sat} every key of \`at\` must be a character level`);
                }
            } else if (value && typeof value === "object" && !Array.isArray(value) && "perStep" in value) {
                // A value that grows smoothly with heightening rather than at named levels — "the damage
                // increases by 1d8, the resistance by 5, and the radius by 5 feet" is this shape, not that
                // one, and the two are easy to reach for interchangeably since both are `{ base, … }`.
                if (value.base === undefined) errors.push(`${sat} a perStep value needs a \`base\` to grow from`);
                const sameKind = typeof value.base === typeof value.perStep
                    || (DICE_FORMULA.test(String(value.base)) && DICE_FORMULA.test(String(value.perStep)));
                if (!sameKind) {
                    errors.push(`${sat} base and perStep must both be numbers or both be dice of the same size`);
                }
            } else if (value && typeof value === "object" && !Array.isArray(value) && "literal" in value) {
                // A value that is written rather than derived. Nothing to check but that it is there.
                if (value.literal === undefined) errors.push(`${sat} a literal substitution needs a value`);
            } else if (typeof value !== "string" && typeof value !== "number") {
                errors.push(`${sat} value must be a resolvable name, a number, a level ladder, or a per-step growth`);
            }
        }
    }

    if (apply.type !== "effect" && apply.stack) {
        errors.push(`${at} only effect riders can stack`);
    }

    switch (apply.type) {
        case "condition":
            if (!CONDITION_SLUGS.has(apply.slug)) {
                errors.push(`${at} "${apply.slug}" is not a pf2e condition slug`);
            }
            if (apply.max !== undefined && !(Number.isInteger(apply.max) && apply.max > 0)) {
                errors.push(`${at} condition max must be a positive integer`);
            }
            break;
        case "effect":
            if (typeof apply.uuid !== "string") errors.push(`${at} effect riders need a uuid`);
            if (apply.once !== undefined && typeof apply.once !== "boolean") {
                errors.push(`${at} once must be true or false`);
            }
            if (apply.once && apply.stack) {
                errors.push(`${at} an effect cannot both stack and be granted only once`);
            }
            if (apply.refresh !== undefined && typeof apply.refresh !== "boolean") {
                errors.push(`${at} refresh must be true or false`);
            }
            if (apply.refresh && apply.once) {
                errors.push(`${at} refresh and once contradict each other — one renews, the other declines to`);
            }
            break;
        case "counteract":
            // The list is read off the board at cast time, so the one thing that can be wrong here is the
            // trait it looks for — and a trait nothing carries is a card with no buttons on it.
            if (apply.traits !== undefined && (!Array.isArray(apply.traits) || apply.traits.length === 0)) {
                errors.push(`${at} counteract traits must be a non-empty list`);
            }
            if (rider.self !== true) {
                errors.push(`${at} a counteract rider must be \`self\`: it offers one choice for the whole cast`);
            }
            break;
        case "prompt":
            if (!apply.text) errors.push(`${at} prompt riders need text — it is the only thing they do`);
            break;
        case "strikes":
            // A volley visits every confirmed target in order, so it must be a `self` rider — a per-target
            // rider would roll the whole volley once for each creature caught.
            if (rider.self !== true) {
                errors.push(`${at} a strikes rider must be \`self\`: it fires once for the whole activity`);
            }
            if (typeof apply.option !== "string" || !/^[a-z0-9-]+$/.test(apply.option)) {
                errors.push(`${at} strikes riders need a slug \`option\` — it names the per-Strike roll options`);
            }
            if (apply.substitutions && typeof apply.uuid !== "string") {
                errors.push(`${at} substitutions have nothing to apply to without an effect \`uuid\``);
            }
            // "Make four unarmed Strikes against any creatures within 30 feet" is four Strikes however many
            // creatures are in reach. Without a count the volley makes one per confirmed target, which is
            // the old behaviour and right only by coincidence.
            if (apply.count !== undefined && apply.count !== "maxTargets" && !(Number(apply.count) > 0)) {
                errors.push(`${at} strikes count must be a positive number or "maxTargets" — got "${apply.count}"`);
            }
            if (apply.count === "maxTargets" && !(Number(doc.flags?.["isaacs-hb-pf2e"]?.areaTargeting?.maxTargets) > 0)) {
                errors.push(`${at} count "maxTargets" needs an areaTargeting.maxTargets to read`);
            }
            for (const half of ["onHit", "onMiss", "onAllHit"]) {
                const list = apply[half];
                if (list === undefined) continue;
                if (!Array.isArray(list)) {
                    errors.push(`${at} ${half} must be a list of riders`);
                    continue;
                }
                list.forEach((inner, j) =>
                    validateRider(inner, `${at}.apply.${half}[${j}]`, errors, { doc, depth: depth + 1 }),
                );
            }
            break;
        case "death":
            // A threshold read after the damage lands, for "if the creature is at half Hit Points or fewer
            // it dies". A predicate cannot express it: predicates see the world as it was before the pass.
            if (apply.hpFraction !== undefined
                && !(Number(apply.hpFraction) > 0 && Number(apply.hpFraction) <= 1)) {
                errors.push(`${at} hpFraction is a share of maximum hit points and must be above 0 and at `
                    + `most 1 — got "${apply.hpFraction}"`);
            }
            break;
        case "banish": {
            // A banishment with no duration takes a creature off the board and never brings it back. That
            // is not a weak rider, it is a deleted token — so the build refuses it outright.
            const duration = rider.duration ?? apply.duration;
            if (!(Number(duration?.value) > 0)) {
                errors.push(`${at} banish riders need a duration — without one the creature never returns`);
            }
            if (duration?.unit && !["rounds", "minutes", "hours", "days"].includes(duration.unit)) {
                errors.push(`${at} banish duration unit must be rounds/minutes/hours/days — got "${duration.unit}"`);
            }
            break;
        }
        case "heal":
            if (!(Number(apply.value) > 0)) {
                errors.push(`${at} heal riders need a positive value — got "${apply.value}"`);
            }
            // The Saint is the one who heals, not the creature that failed its save. Landing this on the
            // target would hand an enemy hit points for surviving the Technique.
            if (rider.self !== true) errors.push(`${at} a heal rider must be \`self\``);
            if (apply.maxPerCast !== undefined
                && apply.maxPerCast !== "origin.level"
                && !(Number(apply.maxPerCast) > 0)) {
                errors.push(`${at} maxPerCast must be a positive number or "origin.level"`);
            }
            break;
        case "readout":
            // A tracked readout asks about one creature named at grant time, not a range scan of the board —
            // *Royal Funeral*'s "you know the target's exact Hit Points" has nobody else to report on.
            if (!apply.trackedTarget && !(Number(apply.range) > 0)) {
                errors.push(`${at} readout riders need a range in feet — got "${apply.range}"`);
            }
            if (rider.self !== true) errors.push(`${at} a readout rider must be \`self\`: it reports to the Saint`);
            break;
        case "toggle":
            // A namespaced option is still a slug: `om:eyes-open` is one RollOption, not two.
            if (typeof apply.option !== "string" || !/^[a-z0-9-]+(:[a-z0-9-]+)*$/.test(apply.option)) {
                errors.push(`${at} toggle riders need a slug \`option\` naming the RollOption to flip`);
            }
            // A cycle of one has nowhere to go: the action would report a change and change nothing. No
            // cycle at all is the other legitimate shape — a plain on/off toggle, which is what Virgo's
            // `om:eyes-open` is — and that one needs to say which way it is being set.
            if (apply.cycle !== undefined && (!Array.isArray(apply.cycle) || apply.cycle.length < 2)) {
                errors.push(`${at} toggle riders need a \`cycle\` of at least two suboptions, or none at all`);
            }
            if (apply.cycle === undefined && apply.value !== undefined && typeof apply.value !== "boolean") {
                errors.push(`${at} a toggle with no cycle sets the option true or false — got "${apply.value}"`);
            }
            if (rider.self !== true) errors.push(`${at} a toggle rider must be \`self\``);
            break;
        case "equip":
            // `arm: null` is the dismissal, and is deliberately legal. An unknown Arm is not: the summon
            // would find nothing to put in the Saint's hands and report that nothing changed, which reads
            // at the table as the free action doing nothing at all.
            if (apply.arm !== null && !LIBRA_ARMS.has(apply.arm)) {
                errors.push(
                    `${at} equip riders name one of the six Arms — ${[...LIBRA_ARMS].join("/")} — or null to `
                        + `dismiss them all; got "${apply.arm}"`,
                );
            }
            if (rider.self !== true) errors.push(`${at} an equip rider must be \`self\`: it arms the Saint`);
            break;
        case "teleport":
            // A teleport with no distance moves nobody and says nothing, which is the same silent-no-op
            // shape that hid the null condition grant for so long. It fails the build instead.
            if (!(Number(apply.distance) > 0)) {
                errors.push(`${at} teleport riders need a positive distance in feet — got "${apply.distance}"`);
            }
            if (apply.direction !== undefined && !["away", "toward"].includes(apply.direction)) {
                errors.push(`${at} teleport direction must be "away" or "toward" — got "${apply.direction}"`);
            }
            break;
        case "encasement": {
            if (!(Number(apply.hardness) >= 0)) {
                errors.push(`${at} encasement needs a Hardness — got "${apply.hardness}"`);
            }
            if (!(Number(apply.hp) > 0)) {
                errors.push(`${at} encasement needs positive Hit Points — got "${apply.hp}"`);
            }
            const conditions = [apply.conditions].flat().filter(Boolean);
            if (conditions.length === 0) {
                errors.push(`${at} encasement needs at least one condition it applies and clears`);
            } else {
                for (const slug of conditions) {
                    if (!CONDITION_SLUGS.has(slug)) errors.push(`${at} "${slug}" is not a pf2e condition slug`);
                }
            }
            if (apply.escapeDc !== undefined && apply.escapeDc !== "cosmo" && !Number.isInteger(apply.escapeDc)) {
                errors.push(`${at} escapeDc must be "cosmo" or a whole number — got "${apply.escapeDc}"`);
            }
            break;
        }
        case "escape":
            if (apply.dc !== undefined && !(Number(apply.dc) > 0)) {
                errors.push(`${at} escape riders need a positive dc — got "${apply.dc}"`);
            }
            if (typeof apply.hazardUuid !== "string") {
                errors.push(`${at} escape riders need a \`hazardUuid\` naming the shell they break`);
            }
            if (rider.self !== true) errors.push(`${at} an escape rider must be \`self\`: it is the captive's own action`);
            break;
        case "damage":
        case "persistent-damage": {
            // Almost always a literal formula. One exception is a *granted action* reaching for another
            // Technique's own current damage — `Golden Arrow: Named Shot` — which has no rank of its own
            // for `perStep` to scale from and has to name what it means instead. The other is *Piranha
            // Rose*'s persistent bleed and *Royal Demon Rose*'s ground-tick damage: a named-level ladder or
            // a per-step growth that has to be baked in before the rider ever fires, the same `{ base, … }`
            // shape a substitution's value already accepts.
            if (apply.formula && typeof apply.formula === "object" && !Array.isArray(apply.formula)) {
                if (!DICE_FORMULA.test(String(apply.formula.base ?? ""))) {
                    errors.push(`${at} ${apply.type} formula.base needs a formula like "1d6" — got "${apply.formula.base}"`);
                }
                if (apply.formula.perStep !== undefined && !DICE_FORMULA.test(String(apply.formula.perStep))) {
                    errors.push(`${at} ${apply.type} formula.perStep needs a formula like "1d8" — got "${apply.formula.perStep}"`);
                }
                if (apply.formula.at !== undefined) {
                    if (typeof apply.formula.at !== "object" || Array.isArray(apply.formula.at)) {
                        errors.push(`${at} ${apply.type} formula.at must be an object keyed by character level`);
                    } else {
                        for (const [level, value] of Object.entries(apply.formula.at)) {
                            if (!(Number(level) > 0)) {
                                errors.push(`${at} ${apply.type} formula.at has "${level}", which is not a character level`);
                            }
                            if (!DICE_FORMULA.test(String(value))) {
                                errors.push(`${at} ${apply.type} formula.at["${level}"] needs a formula like "2d6" — got "${value}"`);
                            }
                        }
                    }
                }
            } else {
                const isResolvable = typeof apply.formula === "string" && apply.formula.startsWith("origin.");
                if (!isResolvable && !FLAT_OR_DICE.test(String(apply.formula ?? ""))) {
                    errors.push(`${at} ${apply.type} needs a formula like "4d6" — got "${apply.formula}"`);
                }
                const known = /^origin\.technique\..+\.damage(\+\d+d\d+)?$/.test(apply.formula)
                    || apply.formula === "origin.libra.bleed"
                    || /^origin\.libra\.dice\.d\d+$/.test(apply.formula);
                if (isResolvable && !known) {
                    errors.push(`${at} unrecognised resolvable formula "${apply.formula}"`);
                }
            }
            if (!DAMAGE_TYPES.has(apply.damageType)) {
                errors.push(`${at} "${apply.damageType}" is not a pf2e damage type`);
            }
            // "1d6 per needle" reads the die count off a counter the target is already wearing. Both
            // damage kinds do it now: Scorpio's Ascendant bleed is persistent, and *Crimson Mirage*'s
            // end-of-turn mental damage is not.
            if (apply.perCounter !== undefined && typeof apply.perCounter !== "string") {
                errors.push(`${at} perCounter must be the uuid of a counter effect`);
            }
            if (apply.max !== undefined && !(Number(apply.max) > 0)) {
                errors.push(`${at} max must be a positive number of counters — got "${apply.max}"`);
            }
            // The outcome multiplier behind "Success: half damage". Anything outside this range is a
            // degree of success pf2e does not have.
            if (apply.multiplier !== undefined && !(Number(apply.multiplier) > 0 && Number(apply.multiplier) <= 2)) {
                errors.push(`${at} multiplier must be between 0 and 2 — got "${apply.multiplier}"`);
            }
            if (apply.type === "persistent-damage" && apply.multiplier !== undefined) {
                errors.push(`${at} persistent damage has no degree of success to scale by`);
            }
            break;
        }
        case "save": {
            if (!SAVE_STATISTICS.has(apply.statistic)) {
                errors.push(`${at} save riders need fortitude/reflex/will — got "${apply.statistic}"`);
            }
            if (apply.dc !== "cosmo" && !Number.isInteger(apply.dc)) {
                errors.push(`${at} save dc must be "cosmo" or a whole number — got "${apply.dc}"`);
            }
            const nested = apply.riders;
            if (!Array.isArray(nested) || nested.length === 0) {
                errors.push(`${at} a save rider with no riders of its own does nothing`);
            } else {
                nested.forEach((inner, j) =>
                    validateRider(inner, `${at}.apply.riders[${j}]`, errors, { doc, depth: depth + 1 }),
                );
            }
            break;
        }
        case "choice": {
            const options = apply.options;
            if (!Array.isArray(options) || options.length < 2) {
                errors.push(`${at} a choice needs at least two options`);
                break;
            }
            options.forEach((option, j) => {
                const oat = `${at}.apply.options[${j}]`;
                if (!option.label) errors.push(`${oat} needs a label — it is the button text`);
                if (!option.apply) {
                    errors.push(`${oat} needs an apply`);
                    return;
                }
                if (option.apply.type === "choice") {
                    errors.push(`${oat} a choice cannot offer another choice`);
                    return;
                }
                // A choice option is one branch of the rider that offered it, so it inherits that
                // rider's addressing: an option that arms the Saint is `self` because the card that
                // whispered it was.
                validateRider(
                    { apply: option.apply, duration: option.duration ?? rider.duration, self: rider.self },
                    oat, errors, { doc, depth: depth + 1 },
                );
            });
            break;
        }
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

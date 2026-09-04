import { MODULE_ID } from "../sky/signs.mjs";

/**
 * Everything the Libra Cloth needs that is not expressible as a rule element.
 *
 * Three things live here, and each is here for the same reason: pf2e models the *item* but not the
 * *arsenal*. There is no rule that equips a matched pair, no `ItemAlteration` property for a weapon's
 * property runes, and no modifier selector that halves incoming healing.
 */

/** An Arm is half of a matched pair; every weapon in it carries this tag. */
export const ARM_TAG = (arm) => `libra-arm-${arm}`;
/** Every Libra weapon, of any Arm, carries this one. */
export const WEAPON_TAG = "libra-weapon";

/**
 * The Arms Advance, as damage dice.
 *
 * Guide v4, *The Arms Advance*: striking at 4th, greater striking at 10th, major striking at 16th, and a
 * fifth die at 19th past the game's own cap. This is the fallback: the number is read off a real weapon
 * wherever one is on the sheet, because a lit sky raises it by a tier and the item already knows that.
 */
export function advanceDice(level) {
    if (level >= 19) return 5;
    if (level >= 16) return 4;
    if (level >= 10) return 3;
    if (level >= 4) return 2;
    return 1;
}

function tagsOf(item) {
    return item?.system?.traits?.otherTags ?? [];
}

/** Every Libra weapon or shield the actor owns. */
export function armsOf(actor) {
    const items = [...(actor?.itemTypes?.weapon ?? []), ...(actor?.itemTypes?.shield ?? [])];
    return items.filter((item) => tagsOf(item).includes(WEAPON_TAG));
}

/**
 * How many damage dice a Libra weapon rolls right now.
 *
 * Read off the item rather than computed, so the Ascendant Boon's extra tier and any striking rune the
 * table has added are both already in the number. The level table is only the answer for a Saint holding
 * nothing — which is exactly when nothing is going to read this anyway, but a rider that resolves to
 * `NaNd6` is worse than one that resolves to the honest minimum.
 */
export function libraDice(actor) {
    const arms = armsOf(actor);
    const held = arms.filter((item) => item.isEquipped);
    const pool = held.length > 0 ? held : arms;
    const dice = pool
        .map((item) => Number(item.system?.damage?.dice) || 0)
        .filter((n) => n > 0);
    if (dice.length > 0) return Math.max(...dice);
    return advanceDice(actor?.level ?? 1);
}

/**
 * The weapon potency an Arm currently carries.
 *
 * *The Twelve Arms* hands an ally "its full Arms Advance for your level", and the honest way to say what
 * that is, is to read it off the Saint's own weapon: the sky's extra tier is already in the number, and so
 * is any rune the table has etched.
 */
export function libraPotency(actor) {
    const values = armsOf(actor).map((item) => Number(item.system?.runes?.potency) || 0);
    return values.length > 0 ? Math.max(...values) : 0;
}

/**
 * *The Crossing*'s bleed: "persistent bleed equal to your weapons' number of damage dice in d6s", and
 * "the bleed dice become d8s" at 14th.
 */
export function crossingBleed(actor) {
    const die = (actor?.level ?? 1) >= 14 ? "d8" : "d6";
    return `${libraDice(actor)}${die}`;
}

/* ------------------------------------------------------------------------------------------------ */
/*  Summoning an Arm                                                                                  */
/* ------------------------------------------------------------------------------------------------ */

/**
 * "Summoning or dismissing an Arm is a free action, and it always arrives as *both* weapons at once."
 *
 * The pair is the unit, which is the whole reason this is not left to the inventory tab: equipping one
 * sword is not a thing a Libra Saint can do, and holding one of each of two Arms is a thing only *The
 * Balance* allows. Both facts are enforced here, from the sky, rather than remembered.
 *
 * The other Arms are set down rather than deleted. A property rune the player bought and etched lives on
 * the item, and an Arm that is destroyed and re-made every time it is dismissed would lose it.
 */
export async function equipArm(actor, arm, { sky = "none" } = {}) {
    const arms = armsOf(actor);
    if (arms.length === 0) return { equipped: [], stowed: [] };

    const wanted = arm ? arms.filter((item) => tagsOf(item).includes(ARM_TAG(arm))) : [];
    const others = arms.filter((item) => !wanted.includes(item));

    // What the sky lets the hands hold.
    //
    // Normally: one Arm, both weapons, and nothing else. Under *The Balance*: "one weapon from each of two
    // different Arms" — two weapons in total, not two pairs, because a Saint still has two hands. Under a
    // Zenith: "all six Arms at once, the Cloth holds what your hands cannot", and nothing is ever set down.
    const zenith = sky === "zenith";
    const balance = sky === "ascendant" && arm !== null;

    const equipped = [];
    const stowed = [];
    const updates = [];

    const hold = (item) => {
        if (item.system.equipped.carryType === "held" && item.system.equipped.handsHeld === 1) return;
        updates.push({ _id: item.id, "system.equipped.carryType": "held", "system.equipped.handsHeld": 1 });
        equipped.push(item.name);
    };
    const setDown = (item) => {
        if (item.system.equipped.carryType !== "held") return;
        updates.push({ _id: item.id, "system.equipped.carryType": "worn", "system.equipped.handsHeld": 0 });
        stowed.push(item.name);
    };

    if (balance) {
        // One half of the Arm being called, and one half of at most one Arm already out.
        wanted.slice(0, 1).forEach(hold);
        wanted.slice(1).forEach(setDown);
        let keptArm = null;
        for (const item of others) {
            const tag = tagsOf(item).find((t) => t.startsWith("libra-arm-"));
            if (item.system.equipped.carryType !== "held") continue;
            if (keptArm === null || keptArm === tag) {
                keptArm = tag;
                continue;
            }
            setDown(item);
        }
        // …and only one weapon of that one.
        const kept = others.filter(
            (item) => item.system.equipped.carryType === "held"
                && tagsOf(item).includes(keptArm ?? ""),
        );
        kept.slice(1).forEach(setDown);
    } else {
        wanted.forEach(hold);
        if (!zenith) others.forEach(setDown);
    }

    if (updates.length > 0) await actor.updateEmbeddedDocuments("Item", updates);
    // A Shield that went to 0 returns to the Cloth and comes back whole; so does one whose maximum grew
    // while it was put away. Either way, calling an Arm is when the Cloth re-forms it.
    await restoreShields(actor);
    return { equipped, stowed };
}

/* ------------------------------------------------------------------------------------------------ */
/*  Taking the Arms back                                                                              */
/* ------------------------------------------------------------------------------------------------ */

/** Every shape of the lent-Arm effect, so the sweeper can recognise one whichever Arm it carried. */
const LENT = /^the-twelve-arms(-|$)/;

/**
 * "The weapons return to your Cloth when the duration ends."
 *
 * pf2e expires an effect but does not delete it unless the world is set to, and the Arms are `GrantItem`
 * children of that effect — so without this the borrowed weapons would sit on the ally's sheet, still
 * working, until somebody noticed. Deleting the effect cascades to the weapons, which is exactly the
 * sentence the guide writes.
 */
/**
 * Keep a Libra Shield's Hit Points level with its Hit Point maximum.
 *
 * *The Twin Bulwark* sets each Shield's maximum to 8 × the Saint's level, and pf2e has no alteration for
 * the *current* value — so the moment a 1st-level Saint reaches 2nd, a Shield sitting at its authored 8 Hit
 * Points is below a Broken Threshold that has just doubled. A broken shield is dropped from
 * `prepareStrikes` outright, and the symptom is not "my shield is broken", it is **both Shield Strikes
 * silently missing from the sheet** — which is exactly how *Athena's Arsenal* came to Strike with the same
 * sword twice.
 *
 * A Cloth shield is not a shield anybody repairs; it re-forms. So it is topped up whenever the Saint's
 * level changes, and again whenever an Arm is summoned, which is also the guide's own answer to a Shield
 * reduced to 0: it returns to the Cloth and comes back whole.
 */
export async function restoreShields(actor) {
    const shields = armsOf(actor).filter((item) => item.type === "shield");
    const updates = shields
        .filter((item) => item._source.system.hp.value < item.system.hp.max)
        .map((item) => ({ _id: item.id, "system.hp.value": item.system.hp.max }));
    if (updates.length > 0) await actor.updateEmbeddedDocuments("Item", updates);
    return updates.length;
}

export function registerHooks() {
    Hooks.on("updateActor", async (actor, changed) => {
        if (!game.user.isGM) return;
        if (changed?.system?.details?.level?.value === undefined) return;
        try {
            await restoreShields(actor);
        } catch (error) {
            console.error("Isaac's Homebrew | could not re-form the Libra Shields", error);
        }
    });

    const sweep = (combatant) => {
        const actor = combatant?.actor;
        if (!actor || !game.user.isGM) return;
        const expired = actor.itemTypes.effect.filter((e) => LENT.test(e.slug ?? "") && e.isExpired);
        if (expired.length === 0) return;
        actor.deleteEmbeddedDocuments("Item", expired.map((e) => e.id));
    };
    Hooks.on("pf2e.startTurn", sweep);
    Hooks.on("pf2e.endTurn", sweep);
}

/* ------------------------------------------------------------------------------------------------ */
/*  Healing halved                                                                                    */
/* ------------------------------------------------------------------------------------------------ */

/** Effects whose bearer receives half the Hit Points from any healing. */
const HALVES_HEALING = new Set(["bleeding-from-the-crossing"]);

/**
 * *The Crossing*, Perfect: "a creature bleeding from The Crossing receives only half the Hit Points from
 * any healing."
 *
 * pf2e routes healing through `applyDamage` as negative damage, and it does extract modifiers for a
 * `healing-received` selector — but every rule element that reaches that selector adds or subtracts, and
 * none of them multiplies, so there is no rule that halves. Nor is the roll a safe thing to shadow:
 * `applyDamage` runs the healing through `applyIWR` rather than reading `total`, so rewriting the roll
 * changes a number nobody reads.
 *
 * What is unambiguous is the Hit Points that actually landed, so the correction is made afterwards, from
 * the two readings the wrap already takes. Half is *taken back*, rounded in the target's favour, and said
 * out loud — a silent correction to a heal is the one thing worse than no correction at all.
 */
export async function halveHealing(actor, before) {
    if (!actor?.itemTypes?.effect?.some((e) => HALVES_HEALING.has(e.slug))) return;

    const after = actor.hitPoints?.value ?? 0;
    const healed = after - before;
    if (healed <= 0) return;

    const kept = Math.ceil(healed / 2);
    await actor.update({ "system.attributes.hp.value": before + kept });
    await ChatMessage.create({
        speaker: ChatMessage.getSpeaker({ actor }),
        content:
            `<p><strong>The Crossing</strong>: ${actor.name} is bleeding from crossed blades and receives only `
            + `half the Hit Points from any healing — ${healed} became ${kept}.</p>`,
    });
}

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

report("Soulbound tests");

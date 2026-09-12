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

report("Soulbound tests");

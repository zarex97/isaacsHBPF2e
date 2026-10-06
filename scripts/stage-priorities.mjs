/**
 * Where this module's stages fall on the damage bus and the check pipeline.
 *
 * The pipelines themselves run stages in ascending numeric priority and know nothing about who registered
 * them; these names are the homebrew's own map of who sits where, so a new stage can see where it falls
 * without reading every caller. Leave gaps; a new stage slots between.
 */

/** `DamageBus` stages. */
export const DAMAGE = {
    /** `riders/sources.mjs` — origin bypasses, and the shadowing bypass cannot reach. */
    bypass: 0,
    /** `assimilator/carapace.mjs` — Carapace Block takes the plate's Hardness off the damage, and the plate pays. */
    carapaceBlock: 5,
    /** `riders/libra.mjs` — the Crossing halves whatever a heal gave. */
    crossing: 10,
    /** `soulbound/wound.mjs` — absolute, so after the Crossing: it undoes whatever half was left. */
    wound: 20,
    /** `riders/sources.mjs` — the `damage-applied` rider event. */
    riders: 30,
    /** `lib/encounter-damage.mjs` registers itself at 35 — marks a creature that has lost Hit Points in this encounter. */
    encounterDamage: 35,
    /** `soulbound/regeneracion.mjs` — reads the damage type, which exists only here. */
    regeneracion: 40,
};

/** `CheckPipeline` stages. */
export const CHECK = {
    /** `soulbound/scattered.mjs` — Strikes and saves that ignore lesser cover correct the DC. */
    ignoreCover: 10,
    /** Guide §4.5 — a Portent is not spent on a roll that fortune or misfortune already altered. */
    portentGuard: 20,
    /** `sky/terrain-rolls.mjs` — the day's modifier on a creature's first Strike in an encounter, under Aries. */
    ariesFirstStrike: 30,
    /** `stargazer/auguries.mjs` — Hunted by the Sky: the first attack each round, and Seek against it. */
    huntedBySky: 40,
    /** `stargazer/auguries.mjs` — Poured Knowing: a counteract check at the Stargazer's DC, one rank higher. */
    pouredKnowing: 45,
    /** `stargazer/paths.mjs` — Sentence Passed: the sentenced creature's fortune effects are taken off the roll. */
    sentencePassed: 50,
    /** `stargazer/paths.mjs` — tag a roll a Snarl touched, for Herald's Omen and Foregone Conclusion. */
    snarlTag: 60,
    /** `stargazer/paths.mjs` — a Demoralize by The Announcement is not lost on a creature that cannot understand you. */
    announcement: 70,
};

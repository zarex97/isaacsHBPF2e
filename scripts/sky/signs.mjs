export const MODULE_ID = "isaacs-hb-pf2e";

/**
 * The thirteen skies. Twelve constellations plus Starless — the thirteenth sky, which no Cloth owns and
 * which the 18th-level feat *The Thirteenth* claims.
 */
export const SIGNS = [
    { id: "aries", label: "Aries", glyph: "♈" },
    { id: "taurus", label: "Taurus", glyph: "♉" },
    { id: "gemini", label: "Gemini", glyph: "♊" },
    { id: "cancer", label: "Cancer", glyph: "♋" },
    { id: "leo", label: "Leo", glyph: "♌" },
    { id: "virgo", label: "Virgo", glyph: "♍" },
    { id: "libra", label: "Libra", glyph: "♎" },
    { id: "scorpio", label: "Scorpio", glyph: "♏" },
    { id: "sagittarius", label: "Sagittarius", glyph: "♐" },
    { id: "capricorn", label: "Capricorn", glyph: "♑" },
    { id: "aquarius", label: "Aquarius", glyph: "♒" },
    { id: "pisces", label: "Pisces", glyph: "♓" },
    { id: "starless", label: "Starless", glyph: "✦" },
];

export const SIGN_IDS = SIGNS.map((s) => s.id);
export const CLOTH_SIGNS = SIGN_IDS.filter((id) => id !== "starless");

export function signOf(id) {
    return SIGNS.find((s) => s.id === id) ?? SIGNS.at(-1);
}

/**
 * Aspects, and the weights used when rolling a day.
 *
 * Reweighted for the Stargazer (guide v3 §8.2) at the module owner's direction. The old spread was
 * 50/20/15/15/0 — half of all days were Quiet, and a sky that does nothing five days in ten is a
 * subsystem nobody at the table ever notices. The sky is now active on four days in five.
 *
 * `exalted` is no longer weight 0, which is a real change to the SAINT and not only to the Stargazer:
 * a Zenith can now happen by chance. A Saint's own sign rises 1 day in 13 and 1 day in 10 is Exalted,
 * so an unscheduled Zenith lands roughly once every 130 days of game time rather than never.
 * `scheduleZenith` is unchanged and is still how you put one on a specific day.
 */
export const ASPECTS = [
    { id: "none", label: "Quiet", weight: 20, hint: "The sky is unremarkable." },
    { id: "benefic", label: "Benefic", weight: 30, hint: "The sky is kind." },
    { id: "retrograde", label: "Retrograde", weight: 10, hint: "The sky drags." },
    { id: "malefic", label: "Malefic", weight: 30, hint: "The sky is hostile." },
    { id: "exalted", label: "Exalted", weight: 10, hint: "A Zenith." },
];

export const ASPECT_IDS = ASPECTS.map((a) => a.id);

export function aspectOf(id) {
    return ASPECTS.find((a) => a.id === id) ?? ASPECTS[0];
}

/** Adjacent signs in the zodiac, for the Golden Cosmo feat. Starless has no neighbours. */
export function adjacentSigns(id) {
    const i = CLOTH_SIGNS.indexOf(id);
    if (i === -1) return [];
    const n = CLOTH_SIGNS.length;
    return [CLOTH_SIGNS[(i - 1 + n) % n], CLOTH_SIGNS[(i + 1) % n]];
}

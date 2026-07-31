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
 * `exalted` has weight 0 on purpose. The class guide is emphatic that a Zenith is scheduled, not rolled —
 * 1 in 260 means it would otherwise never actually happen at the table, and that scene is the whole class.
 * The only way to an Exalted sky is the GM's Schedule Zenith control.
 */
export const ASPECTS = [
    { id: "none", label: "Quiet", weight: 50, hint: "The sky is unremarkable." },
    { id: "benefic", label: "Benefic", weight: 20, hint: "The sky is kind." },
    { id: "retrograde", label: "Retrograde", weight: 15, hint: "The sky drags." },
    { id: "malefic", label: "Malefic", weight: 15, hint: "The sky is hostile." },
    { id: "exalted", label: "Exalted", weight: 0, hint: "A Zenith. Scheduled by the GM, never rolled." },
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

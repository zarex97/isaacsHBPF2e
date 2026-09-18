import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { ROOT } from "./lib/pack.mjs";

/**
 * Draw the module's own item art.
 *
 * Every `img` in this module pointed into Foundry's icon library, and **eighty-nine of those paths did
 * not exist** — `leaf-petals-pink.webp`, `wolf-howl-moon-grey.webp`, `sword-katana-black.webp`. They
 * read like real files and were invented. Only seven ever warned, because Foundry validates an icon
 * when something actually renders it; the rest sat silently on a fallback.
 *
 * The names were the right instinct even though the files were not: each one says exactly what it
 * wants to be. So rather than remap ninety items onto whatever Foundry happens to ship — a wolf becomes
 * a purple wolf, petals become maple leaves — the names are kept and the art is drawn to match.
 *
 * Both halves of each filename are read:
 *
 *   `wolf-howl-moon-grey`  ->  glyph `wolf`, palette `grey`
 *   `blade-two-handed-glowing-orange`  ->  glyph `blade-two-handed`, palette `orange`
 *
 * so the set stays coherent by construction, and adding one is a filename rather than a drawing.
 *
 * Run with `npm run icons`.
 */

const OUT = path.join(ROOT, "icons");
const SIZE = 64;

/* ------------------------------------------------------------------------------------------------ */
/*  Palette                                                                                          */
/* ------------------------------------------------------------------------------------------------ */

/** Accent colours, keyed by the colour words that appear in the filenames. */
const HUES = {
    red: "#e2543f", orange: "#f08b35", yellow: "#f3d04c", gold: "#dCa93c",
    green: "#5cb867", teal: "#3fb8a6", blue: "#4f9de6", purple: "#a074da",
    pink: "#e78dbb", white: "#e9ebf2", grey: "#9aa3b0", gray: "#9aa3b0",
    brown: "#a07648", black: "#5b6270", steel: "#a8b4c4", dark: "#6c7686",
    clear: "#8fd3e8", crystal: "#8fd3e8", ice: "#9fd8ee", water: "#4f9de6",
    flame: "#f08b35", light: "#f3e6a8", stone: "#9a8f7d", membrane: "#5cb867",
    golden: "#dCa93c", silver: "#c6ccd6", bat: "#7a5ea8", moon: "#c9d2e4",
};

/**
 * A darker companion for shading, and a lighter one for highlights.
 *
 * **The clamp is load-bearing.** Lightening a bright accent takes a channel past 255, and an unclamped
 * `(0xdc * 1.35).toString(16)` is three hex digits — which makes the whole colour string one character
 * too long, so the browser discards it and paints black. The winged figure in `angel-winged-humanoid-
 * golden` came out a black silhouette on gold wings, and it was the colour arithmetic, not the drawing.
 */
const shade = (hex, k = 0.55) => {
    const n = parseInt(hex.slice(1), 16);
    const c = [(n >> 16) & 255, (n >> 8) & 255, n & 255]
        .map((v) => Math.max(0, Math.min(255, Math.round(v * k))));
    return `#${c.map((v) => v.toString(16).padStart(2, "0")).join("")}`;
};

/**
 * The accent for a name: the LAST colour word wins.
 *
 * `explosion-flame-blue-orange` is an orange explosion with blue in it, not a blue one — the trailing
 * word is the one the author reached for last, and reading it that way matches every name in the set.
 */
function paletteFor(name) {
    const words = name.split("-");
    let hue = null;
    for (const word of words) if (HUES[word]) hue = HUES[word];
    hue ??= "#8fa6c8";
    return { accent: hue, deep: shade(hue, 0.5), glow: shade(hue, 1.35), dim: words.includes("dim") };
}

/* ------------------------------------------------------------------------------------------------ */
/*  Glyphs                                                                                           */
/* ------------------------------------------------------------------------------------------------ */

/**
 * Each glyph returns SVG drawn inside a 64x64 box, given `{accent, deep, glow}`.
 *
 * Deliberately flat and few-pathed: these are read at 32 pixels in a sheet's item list, where a bold
 * silhouette carries and detail turns to mud.
 */
const G = {
    blade: (p, big) => `
        <path d="M32 ${big ? 5 : 8} L${big ? 39 : 37} ${big ? 20 : 22} L${big ? 39 : 37} 40 L32 46 L${big ? 25 : 27} 40 L${big ? 25 : 27} ${big ? 20 : 22} Z" fill="${p.accent}"/>
        <path d="M32 ${big ? 5 : 8} L32 46 L${big ? 25 : 27} 40 L${big ? 25 : 27} ${big ? 20 : 22} Z" fill="${p.deep}"/>
        <rect x="20" y="45" width="24" height="4" rx="2" fill="${p.deep}"/>
        <rect x="30" y="48" width="4" height="10" rx="2" fill="${p.accent}"/>`,
    katana: (p) => `
        <path d="M12 52 C24 44 40 26 50 10 L54 14 C44 30 28 47 16 56 Z" fill="${p.accent}"/>
        <path d="M12 52 C24 44 40 26 50 10 L52 12 C42 28 26 46 14 54 Z" fill="${p.glow}" opacity=".7"/>
        <rect x="8" y="48" width="12" height="4" rx="2" transform="rotate(-38 14 50)" fill="${p.deep}"/>`,
    "swords-crossed": (p) => `
        <path d="M14 10 L50 50" stroke="${p.accent}" stroke-width="6" stroke-linecap="round"/>
        <path d="M50 10 L14 50" stroke="${p.deep}" stroke-width="6" stroke-linecap="round"/>
        <circle cx="32" cy="30" r="4" fill="${p.glow}"/>`,
    "swords-short": (p) => `
        <path d="M22 8 L28 8 L28 40 L25 46 L22 40 Z" fill="${p.accent}"/>
        <path d="M36 8 L42 8 L42 40 L39 46 L36 40 Z" fill="${p.deep}"/>
        <rect x="16" y="39" width="18" height="3.5" rx="1.7" fill="${p.deep}"/>
        <rect x="30" y="39" width="18" height="3.5" rx="1.7" fill="${p.accent}"/>`,
    "blade-tips": (p) => `
        <path d="M18 50 L18 20 L24 10 L30 20 L30 50 Z" fill="${p.deep}"/>
        <path d="M27 54 L27 16 L33 4 L39 16 L39 54 Z" fill="${p.accent}"/>
        <path d="M36 50 L36 20 L42 10 L48 20 L48 50 Z" fill="${p.deep}"/>`,
    skull: (p, horned, crowned) => `
        ${crowned ? `<path d="M18 16 L22 8 L26 14 L32 6 L38 14 L42 8 L46 16 Z" fill="${p.glow}"/>` : ""}
        ${horned ? `<path d="M16 22 C8 16 8 8 14 6 C14 14 18 16 20 18 Z M48 22 C56 16 56 8 50 6 C50 14 46 16 44 18 Z" fill="${p.accent}"/>` : ""}
        <path d="M32 ${crowned ? 18 : 14} C44 ${crowned ? 18 : 14} 50 26 50 34 C50 41 46 45 42 47 L42 54 L22 54 L22 47 C18 45 14 41 14 34 C14 26 20 ${crowned ? 18 : 14} 32 ${crowned ? 18 : 14} Z" fill="${p.accent}"/>
        <ellipse cx="24" cy="34" rx="5" ry="6" fill="${p.deep}"/>
        <ellipse cx="40" cy="34" rx="5" ry="6" fill="${p.deep}"/>
        <path d="M29 44 L32 39 L35 44 Z" fill="${p.deep}"/>`,
    bolt: (p, forked) => `
        <path d="M36 4 L18 34 L29 34 L24 60 L46 28 L34 28 Z" fill="${p.accent}"/>
        ${forked ? `<path d="M44 8 L34 30 L40 30 L36 52" stroke="${p.glow}" stroke-width="3" fill="none" stroke-linecap="round" opacity=".8"/>` : ""}
        <path d="M36 4 L18 34 L25 34 Z" fill="${p.glow}" opacity=".55"/>`,
    wind: (p, vortex) => (vortex
        ? `<path d="M32 10 C48 10 54 20 54 28 C54 40 44 48 32 48 C22 48 16 42 16 36 C16 30 21 26 27 26 C32 26 36 29 36 33" fill="none" stroke="${p.accent}" stroke-width="5" stroke-linecap="round"/>
           <circle cx="36" cy="36" r="4" fill="${p.glow}"/>`
        : `<path d="M8 22 H38 A7 7 0 1 0 31 15" fill="none" stroke="${p.accent}" stroke-width="5" stroke-linecap="round"/>
           <path d="M8 34 H46 A7 7 0 1 1 39 41" fill="none" stroke="${p.glow}" stroke-width="5" stroke-linecap="round" opacity=".85"/>
           <path d="M12 46 H30" stroke="${p.deep}" stroke-width="5" stroke-linecap="round"/>`),
    flame: (p) => `
        <path d="M32 4 C40 18 50 24 50 38 C50 50 42 58 32 58 C22 58 14 50 14 38 C14 26 24 20 32 4 Z" fill="${p.accent}"/>
        <path d="M32 24 C36 32 41 35 41 42 C41 48 37 52 32 52 C27 52 23 48 23 42 C23 35 28 32 32 24 Z" fill="${p.glow}"/>`,
    explosion: (p, star) => (star
        ? `<path d="M32 2 L38 24 L60 32 L38 40 L32 62 L26 40 L4 32 L26 24 Z" fill="${p.accent}"/>
           <path d="M32 16 L35 29 L48 32 L35 35 L32 48 L29 35 L16 32 L29 29 Z" fill="${p.glow}"/>`
        : `<circle cx="32" cy="32" r="18" fill="${p.accent}"/>
           <circle cx="32" cy="32" r="10" fill="${p.glow}"/>
           <path d="M32 2 L36 14 L28 14 Z M32 62 L28 50 L36 50 Z M2 32 L14 28 L14 36 Z M62 32 L50 36 L50 28 Z" fill="${p.accent}"/>`),
    beam: (p) => `
        <path d="M4 40 L44 12 L52 22 L12 50 Z" fill="${p.accent}"/>
        <path d="M4 40 L44 12 L47 16 L8 44 Z" fill="${p.glow}" opacity=".8"/>
        <circle cx="50" cy="16" r="9" fill="${p.glow}"/>`,
    rays: (p) => `
        <circle cx="32" cy="32" r="9" fill="${p.glow}"/>
        ${[0, 45, 90, 135, 180, 225, 270, 315].map((a) =>
            `<rect x="30.5" y="2" width="3" height="16" rx="1.5" fill="${p.accent}" transform="rotate(${a} 32 32)"/>`).join("")}`,
    petals: (p) => `
        ${[[32, 12, 0], [48, 26, 55], [42, 48, 115], [22, 48, 245], [16, 26, 305]].map(([x, y, a]) =>
            `<ellipse cx="${x}" cy="${y}" rx="7" ry="11" fill="${p.accent}" transform="rotate(${a} ${x} ${y})"/>`).join("")}
        <circle cx="32" cy="32" r="6" fill="${p.glow}"/>`,
    rose: (p) => `
        <circle cx="32" cy="26" r="16" fill="${p.accent}"/>
        <path d="M32 12 A14 14 0 0 1 32 40 A9 9 0 0 1 32 22 A5 5 0 0 0 32 32" fill="${p.deep}"/>
        <path d="M32 40 L32 60 M32 48 L44 44 M32 52 L20 48" stroke="${shade("#5cb867", 0.9)}" stroke-width="4" stroke-linecap="round" fill="none"/>`,
    vines: (p) => `
        <path d="M10 58 C10 36 22 24 32 21 C42 18 52 24 55 8" fill="none" stroke="${p.accent}" stroke-width="6" stroke-linecap="round"/>
        <path d="M13 44 L2 40 L12 37 Z  M20 31 L12 20 L24 23 Z  M32 21 L30 8 L40 17 Z
                 M45 16 L56 20 L46 25 Z  M16 54 L6 56 L14 48 Z" fill="${p.glow}"/>`,
    eye: (p, large) => `
        <ellipse cx="32" cy="32" rx="${large ? 28 : 24}" ry="${large ? 17 : 14}" fill="${p.deep}"/>
        <ellipse cx="32" cy="32" rx="${large ? 24 : 20}" ry="${large ? 13 : 11}" fill="${p.accent}"/>
        <circle cx="32" cy="32" r="${large ? 9 : 7}" fill="#12141a"/>
        <circle cx="32" cy="32" r="${large ? 4 : 3}" fill="${p.glow}"/>`,
    wolf: (p) => `
        <circle cx="50" cy="13" r="8" fill="${p.glow}" opacity=".9"/>
        <circle cx="47" cy="11" r="7" fill="#0e1016"/>
        <path d="M14 20 L18 4 L27 14 Z M50 20 L46 4 L37 14 Z" fill="${p.accent}"/>
        <path d="M32 12 C43 12 50 20 50 30 C50 36 47 40 43 43 L36 58 L28 58 L21 43 C17 40 14 36 14 30 C14 20 21 12 32 12 Z" fill="${p.accent}"/>
        <path d="M28 56 L32 40 L36 56 Z" fill="${p.deep}"/>
        <circle cx="24" cy="30" r="3" fill="#0e1016"/><circle cx="40" cy="30" r="3" fill="#0e1016"/>
        <path d="M32 38 L28 34 H36 Z" fill="${p.deep}"/>`,
    paw: (p) => `
        <ellipse cx="32" cy="42" rx="14" ry="12" fill="${p.accent}"/>
        ${[[18, 24], [27, 18], [37, 18], [46, 24]].map(([x, y]) =>
            `<ellipse cx="${x}" cy="${y}" rx="5.5" ry="7" fill="${p.accent}"/>`).join("")}`,
    wing: (p) => `
        <path d="M6 10 C22 12 40 22 56 40 C48 44 42 42 38 46 C34 42 28 44 24 48 C20 44 14 46 10 42 C10 30 8 18 6 10 Z" fill="${p.accent}"/>
        <path d="M6 10 C20 20 30 30 38 46 M6 10 C16 24 20 36 24 48 M6 10 C12 26 12 34 10 42"
              stroke="${p.deep}" stroke-width="2.5" fill="none" stroke-linecap="round"/>
        <path d="M6 10 C22 12 40 22 56 40" stroke="${p.glow}" stroke-width="3" fill="none" stroke-linecap="round"/>`,
    horns: (p) => `
        <path d="M30 30 C18 30 10 24 6 12 C6 8 10 6 13 9 C17 17 23 22 30 23 Z" fill="${p.accent}"/>
        <path d="M34 30 C46 30 54 24 58 12 C58 8 54 6 51 9 C47 17 41 22 34 23 Z" fill="${p.accent}"/>
        <path d="M32 22 C41 22 47 28 47 38 C47 48 40 56 32 56 C24 56 17 48 17 38 C17 28 23 22 32 22 Z" fill="${p.deep}"/>
        <circle cx="25" cy="36" r="3" fill="${p.glow}"/><circle cx="39" cy="36" r="3" fill="${p.glow}"/>
        <path d="M27 48 H37" stroke="${p.glow}" stroke-width="3" stroke-linecap="round"/>`,
    snowflake: (p) => `
        ${[0, 60, 120].map((a) =>
            `<g transform="rotate(${a} 32 32)"><rect x="30.5" y="4" width="3" height="56" rx="1.5" fill="${p.accent}"/>
             <path d="M32 12 L25 18 M32 12 L39 18 M32 52 L25 46 M32 52 L39 46" stroke="${p.accent}" stroke-width="3" stroke-linecap="round" fill="none"/></g>`).join("")}
        <circle cx="32" cy="32" r="5" fill="${p.glow}"/>`,
    ice: (p) => `
        <path d="M32 4 L46 20 L40 52 L24 52 L18 20 Z" fill="${p.accent}"/>
        <path d="M32 4 L32 52 L24 52 L18 20 Z" fill="${p.deep}"/>
        <path d="M32 14 L38 24 L32 34 L26 24 Z" fill="${p.glow}" opacity=".8"/>`,
    water: (p) => `
        <path d="M32 4 C44 22 52 30 52 40 C52 51 43 59 32 59 C21 59 12 51 12 40 C12 30 20 22 32 4 Z" fill="${p.accent}"/>
        <path d="M14 42 C20 38 26 46 32 42 C38 38 44 46 50 42" fill="none" stroke="${p.glow}" stroke-width="3.5" stroke-linecap="round"/>`,
    orb: (p) => `
        <circle cx="32" cy="32" r="20" fill="${p.accent}"/>
        <circle cx="32" cy="32" r="12" fill="${p.glow}" opacity=".75"/>
        <ellipse cx="25" cy="24" rx="6" ry="4" fill="#ffffff" opacity=".45" transform="rotate(-30 25 24)"/>`,
    barrier: (p, wall) => (wall
        ? `<rect x="8" y="14" width="48" height="36" rx="6" fill="none" stroke="${p.accent}" stroke-width="5"/>
           <path d="M8 26 H56 M8 38 H56 M24 14 V50 M40 14 V50" stroke="${p.deep}" stroke-width="3"/>`
        : `<path d="M32 6 L54 16 V34 C54 46 44 55 32 58 C20 55 10 46 10 34 V16 Z" fill="${p.accent}"/>
           <path d="M32 14 L46 20 V34 C46 42 40 48 32 50 Z" fill="${p.glow}" opacity=".7"/>`),
    breastplate: (p) => `
        <path d="M18 10 L32 16 L46 10 L50 22 C50 40 42 52 32 58 C22 52 14 40 14 22 Z" fill="${p.accent}"/>
        <path d="M32 16 L32 58 C22 52 14 40 14 22 L18 10 Z" fill="${p.deep}"/>
        <path d="M22 28 H42 M22 36 H42" stroke="${p.glow}" stroke-width="2.5" opacity=".7"/>`,
    chest: (p) => `
        <path d="M8 26 C8 16 16 10 32 10 C48 10 56 16 56 26 Z" fill="${p.accent}"/>
        <rect x="8" y="26" width="48" height="26" rx="3" fill="${p.deep}"/>
        <rect x="27" y="22" width="10" height="14" rx="2" fill="${p.glow}"/>`,
    chains: (p) => `
        ${[[14, 20], [30, 32], [46, 44]].map(([x, y]) =>
            `<ellipse cx="${x}" cy="${y}" rx="9" ry="6" fill="none" stroke="${p.accent}" stroke-width="4.5" transform="rotate(-40 ${x} ${y})"/>`).join("")}`,
    link: (p) => `
        <path d="M8 32 C8 22 26 22 32 32 C38 42 56 42 56 32" fill="none" stroke="${p.accent}" stroke-width="6" stroke-linecap="round"/>
        <circle cx="10" cy="32" r="6" fill="${p.glow}"/><circle cx="54" cy="32" r="6" fill="${p.glow}"/>`,
    hand: (p) => `
        <path d="M20 58 L18 34 C18 30 23 29 24 33 L26 40 L26 14 C26 10 32 10 32 14 L32 34 L34 12 C34 8 40 8 40 12 L40 34 L43 18 C44 14 49 15 48 19 L46 44 C45 53 39 58 32 58 Z" fill="${p.accent}"/>
        <circle cx="32" cy="10" r="5" fill="${p.glow}" opacity=".8"/>`,
    heart: (p) => `
        <path d="M32 56 C12 42 8 30 8 22 C8 14 16 8 24 12 C28 14 31 18 32 21 C33 18 36 14 40 12 C48 8 56 14 56 22 C56 30 52 42 32 56 Z" fill="${p.accent}"/>
        <path d="M28 22 H36 V28 H42 V36 H36 V42 H28 V36 H22 V28 H28 Z" fill="${p.glow}"/>`,
    angel: (p) => `
        <path d="M30 26 C22 14 12 8 2 8 C4 20 10 30 20 36 C12 36 8 34 4 30 C8 40 18 46 30 44 Z" fill="${p.accent}"/>
        <path d="M34 26 C42 14 52 8 62 8 C60 20 54 30 44 36 C52 36 56 34 60 30 C56 40 46 46 34 44 Z" fill="${p.accent}"/>
        <circle cx="32" cy="14" r="7" fill="${p.glow}"/>
        <path d="M32 22 C37 22 40 26 40 32 L40 58 L24 58 L24 32 C24 26 27 22 32 22 Z" fill="${p.glow}"/>`,
    portal: (p) => `
        <ellipse cx="32" cy="32" rx="18" ry="26" fill="${p.deep}"/>
        <ellipse cx="32" cy="32" rx="12" ry="19" fill="${p.accent}"/>
        <ellipse cx="32" cy="32" rx="5" ry="9" fill="${p.glow}"/>`,
    runes: (p, triangle) => (triangle
        ? `<path d="M32 6 L58 52 H6 Z" fill="none" stroke="${p.accent}" stroke-width="5" stroke-linejoin="round"/>
           <path d="M32 22 L44 44 H20 Z" fill="${p.glow}" opacity=".7"/>`
        : `<rect x="12" y="10" width="40" height="44" rx="5" fill="${p.deep}"/>
           <path d="M22 20 L32 20 L22 32 L32 32 M40 20 L40 44 M34 26 L46 26" stroke="${p.accent}" stroke-width="4" fill="none" stroke-linecap="round"/>`),
    cloud: (p) => `
        <ellipse cx="22" cy="38" rx="14" ry="11" fill="${p.accent}"/>
        <ellipse cx="40" cy="34" rx="16" ry="13" fill="${p.accent}"/>
        <ellipse cx="32" cy="44" rx="20" ry="9" fill="${p.deep}"/>`,
    projectile: (p, salvo) => (salvo
        ? `${[[14, 16], [32, 32], [50, 48]].map(([x, y]) =>
              `<path d="M${x - 10} ${y + 6} L${x + 10} ${y - 6} L${x + 6} ${y} L${x + 12} ${y - 2} Z" fill="${p.accent}"/>`).join("")}`
        : `<path d="M8 50 L48 12 L56 8 L52 16 L14 56 Z" fill="${p.accent}"/>
           <path d="M8 50 L48 12 L50 14 L12 54 Z" fill="${p.glow}" opacity=".7"/>`),
    bow: (p) => `
        <path d="M46 6 C24 16 24 48 46 58" fill="none" stroke="${p.accent}" stroke-width="6" stroke-linecap="round"/>
        <path d="M46 6 L46 58" stroke="${p.glow}" stroke-width="2.5"/>
        <path d="M46 32 L14 32 M20 26 L14 32 L20 38" stroke="${p.glow}" stroke-width="4" fill="none" stroke-linecap="round"/>`,
    arrow: (p) => `
        <path d="M8 56 L48 16" stroke="${p.accent}" stroke-width="5" stroke-linecap="round"/>
        <path d="M58 6 L40 10 L54 24 Z" fill="${p.glow}"/>
        <path d="M8 56 L10 44 L20 54 Z" fill="${p.deep}"/>`,
    javelin: (p) => `
        <path d="M12 56 L44 20" stroke="${p.accent}" stroke-width="5" stroke-linecap="round"/>
        <path d="M56 4 L38 14 L50 26 Z" fill="${p.glow}"/>`,
    trident: (p) => `
        <path d="M14 8 L14 24 M32 4 L32 24 M50 8 L50 24" stroke="${p.accent}" stroke-width="5" stroke-linecap="round"/>
        <path d="M10 24 H54" stroke="${p.accent}" stroke-width="5" stroke-linecap="round"/>
        <rect x="29" y="24" width="6" height="34" rx="3" fill="${p.deep}"/>`,
    telescope: (p) => `
        <rect x="6" y="28" width="30" height="12" rx="6" fill="${p.deep}" transform="rotate(-28 21 34)"/>
        <rect x="28" y="16" width="30" height="14" rx="7" fill="${p.accent}" transform="rotate(-28 43 23)"/>
        <path d="M14 50 L26 42 M26 56 L32 44" stroke="${p.deep}" stroke-width="4" stroke-linecap="round"/>`,
    vial: (p) => `
        <path d="M26 6 H38 V24 L48 48 C50 54 46 58 40 58 H24 C18 58 14 54 16 48 Z" fill="none" stroke="${p.deep}" stroke-width="4"/>
        <path d="M20 42 L44 42 L48 50 C50 55 46 58 40 58 H24 C18 58 14 55 16 50 Z" fill="${p.accent}"/>
        <circle cx="28" cy="48" r="3" fill="${p.glow}"/>`,
    impact: (p) => `
        <circle cx="32" cy="32" r="8" fill="${p.glow}"/>
        ${[0, 60, 120, 180, 240, 300].map((a) =>
            `<path d="M32 20 L36 4 L28 4 Z" fill="${p.accent}" transform="rotate(${a} 32 32)"/>`).join("")}
        <circle cx="32" cy="32" r="16" fill="none" stroke="${p.accent}" stroke-width="3" opacity=".6"/>`,
    crystal: (p) => `
        <path d="M32 4 L50 24 L40 58 L24 58 L14 24 Z" fill="${p.accent}"/>
        <path d="M32 4 L32 58 L24 58 L14 24 Z" fill="${p.deep}"/>
        <path d="M14 24 H50" stroke="${p.glow}" stroke-width="2.5" opacity=".6"/>`,
    star: (p) => `
        <path d="M32 4 L39 24 L60 24 L43 37 L49 58 L32 45 L15 58 L21 37 L4 24 L25 24 Z" fill="${p.accent}"/>
        <path d="M32 18 L35 27 L45 27 L37 33 L40 43 L32 37 L24 43 L27 33 L19 27 L29 27 Z" fill="${p.glow}"/>`,
};

/**
 * Which glyph a filename asks for.
 *
 * Longest match first, so `blade-tips-triple` does not answer to `blade`, and `explosion-star` does not
 * answer to `explosion`.
 */
const RULES = [
    ["blade-tips", (p) => G["blade-tips"](p)],
    ["blade-two-handed", (p) => G.blade(p, true)],
    ["greatsword", (p) => G.blade(p, true)],
    ["sword-katana", (p) => G.katana(p)],
    ["swords-crossed", (p) => G["swords-crossed"](p)],
    ["swords-short", (p) => G["swords-short"](p)],
    ["sword-", (p) => G.blade(p, false)],
    ["gladius", (p) => G.blade(p, false)],
    ["skull-crowned", (p) => G.skull(p, false, true)],
    ["skull-horned", (p) => G.skull(p, true, false)],
    ["skull-", (p) => G.skull(p, false, false)],
    ["bolt-strike-forked", (p) => G.bolt(p, true)],
    ["bolt-strike", (p) => G.bolt(p, false)],
    ["orb-lightning", (p) => G.orb(p)],
    ["orb-ice", (p) => G.orb(p)],
    ["wind-vortex", (p) => G.wind(p, true)],
    ["wind-swirl", (p) => G.wind(p, true)],
    ["wind-stream", (p) => G.wind(p, false)],
    ["portal-vortex", (p) => G.portal(p)],
    ["explosion-star", (p) => G.explosion(p, true)],
    ["star-sparkles", (p) => G.star(p)],
    ["explosion-", (p) => G.explosion(p, false)],
    ["beam-explosion", (p) => G.explosion(p, false)],
    ["beams-rays", (p) => G.rays(p)],
    ["beam-", (p) => G.beam(p)],
    ["barrier-wall", (p) => G.barrier(p, true)],
    ["barrier-shield", (p) => G.barrier(p, false)],
    ["shield-barrier", (p) => G.barrier(p, false)],
    ["heater-crystal", (p) => G.barrier(p, false)],
    ["breastplate", (p) => G.breastplate(p)],
    ["chest-", (p) => G.chest(p)],
    ["debuff-chains", (p) => G.chains(p)],
    ["energy-stream-link", (p) => G.link(p)],
    ["hand-", (p) => G.hand(p)],
    ["heart-", (p) => G.heart(p)],
    ["angel-", (p) => G.angel(p)],
    ["runes-triangle", (p) => G.runes(p, true)],
    ["runes-", (p) => G.runes(p, false)],
    ["dust-smoke-cloud", (p) => G.cloud(p)],
    ["projectile-bolt-salvo", (p) => G.projectile(p, true)],
    ["projectile-bolt", (p) => G.projectile(p, false)],
    ["projectile-fireball", (p) => G.flame(p)],
    ["projectile-", (p) => G.projectile(p, false)],
    ["flame-burning", (p) => G.flame(p)],
    ["leaf-petals", (p) => G.petals(p)],
    ["rose-thorned", (p) => G.rose(p)],
    ["root-vine", (p) => G.vines(p)],
    ["vines-", (p) => G.vines(p)],
    ["eye-ringed-glow-angry-large", (p) => G.eye(p, true)],
    ["eye-", (p) => G.eye(p, false)],
    ["wolf-howl", (p) => G.wolf(p)],
    ["paw-print", (p) => G.paw(p)],
    ["wing-bat", (p) => G.wing(p)],
    ["bull-horns", (p) => G.horns(p)],
    ["snowflake-", (p) => G.snowflake(p)],
    ["ice-crystal", (p) => G.ice(p)],
    ["water-elemental", (p) => G.water(p)],
    ["bow-", (p) => G.bow(p)],
    ["arrow-", (p) => G.arrow(p)],
    ["javelin-", (p) => G.javelin(p)],
    ["trident", (p) => G.trident(p)],
    ["telescope", (p) => G.telescope(p)],
    ["vial-", (p) => G.vial(p)],
    ["abstract-impact", (p) => G.impact(p)],
];

function glyphFor(name, palette) {
    const rule = RULES.find(([prefix]) => name.startsWith(prefix));
    // A name with no rule still gets art rather than a blank: a crystal reads as "some magic thing",
    // which is the honest fallback and is visibly different from Foundry's missing-image placeholder.
    return (rule ? rule[1] : G.crystal)(palette);
}

/* ------------------------------------------------------------------------------------------------ */

function svgFor(name) {
    const p = paletteFor(name);
    const body = glyphFor(name, p);
    const opacity = p.dim ? 0.55 : 1;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SIZE} ${SIZE}" width="${SIZE}" height="${SIZE}">
  <defs>
    <radialGradient id="g" cx="50%" cy="38%" r="72%">
      <stop offset="0%" stop-color="${shade(p.accent, 0.34)}"/>
      <stop offset="100%" stop-color="#0e1016"/>
    </radialGradient>
  </defs>
  <rect width="${SIZE}" height="${SIZE}" rx="9" fill="url(#g)"/>
  <rect x="1.25" y="1.25" width="${SIZE - 2.5}" height="${SIZE - 2.5}" rx="8" fill="none" stroke="${p.accent}" stroke-width="1.5" opacity=".5"/>
  <g opacity="${opacity}">${body}
  </g>
</svg>
`;
}

/** Every icon the content asks for, taken from the content itself. */
export function wantedIcons() {
    const names = new Set();
    (function walk(dir) {
        for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
            const full = path.join(dir, entry.name);
            if (entry.isDirectory()) { walk(full); continue; }
            if (!entry.name.endsWith(".json")) continue;
            let doc;
            try { doc = JSON.parse(fs.readFileSync(full, "utf8")); } catch { continue; }
            const img = doc?.img;
            if (typeof img === "string" && img.startsWith(`modules/${"isaacs-hb-pf2e"}/icons/`)) {
                names.add(path.basename(img, ".svg"));
            }
        }
    })(path.join(ROOT, "content"));
    return [...names].sort();
}

function main() {
    fs.mkdirSync(OUT, { recursive: true });
    const names = wantedIcons();
    for (const name of names) fs.writeFileSync(path.join(OUT, `${name}.svg`), svgFor(name), "utf8");
    // Anything in the folder the content no longer asks for is dead weight in the module.
    const stale = fs.readdirSync(OUT).filter((f) => f.endsWith(".svg") && !names.includes(path.basename(f, ".svg")));
    for (const f of stale) fs.unlinkSync(path.join(OUT, f));
    console.log(`Drew ${names.length} icon(s)${stale.length ? `, removed ${stale.length} stale` : ""}.`);
}

// `file://` + a Windows path is not the URL Node produces — it escapes the drive letter — so the
// hand-rolled comparison silently never matched and the script did nothing at all, quietly
// exiting 0. `pathToFileURL` is the only correct way to ask this question.
// `process.argv[1]` is undefined when this module is imported rather than run — from a test, or
// from `node -e` — and `pathToFileURL(undefined)` throws, so the guard has to check first.
const entry = process.argv[1] ? pathToFileURL(process.argv[1]).href : null;
if (entry && import.meta.url === entry) main();

export { svgFor, paletteFor, glyphFor, RULES };

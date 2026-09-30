import { MODULE_ID } from "../sky/signs.mjs";

/**
 * What the Auguries need beyond their riders and rule elements (Stargazer guide §5).
 *
 * **Reprieves.** *Iron Auspice* and *Deep Dream* each turn **one** critical failure on a save into a failure
 * during their minute. `AdjustDegreeOfSuccess` has no "once", so the adjustment rides on a separate effect
 * flagged `stargazerReprieve: "<save>"`, and it is removed here the moment it has been used — a save of that
 * kind whose unadjusted outcome was a critical failure.
 *
 * **The Augury of the Day** (§4.2, §5.3) is granted by the Night Vigil — `vigil.mjs` — from the sign table
 * below, and taken back at the next.
 */

const isWriter = () => (game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM);

/** Guide §5.3. Guiding Star, Borrowed Second, Death Foretold and The Hour Is Not Come belong to no sign. */
export const SIGN_AUGURY = {
    aries: "First Blood",
    taurus: "Iron Auspice",
    gemini: "Two Roads",
    cancer: "Shell of Hours",
    leo: "Crown of Fire",
    virgo: "Perfect Ledger",
    libra: "Fixed Point",
    scorpio: "Coiling Doubt",
    sagittarius: "Hunted by the Sky",
    capricorn: "Alms of Fate",
    aquarius: "Poured Knowing",
    pisces: "Deep Dream",
};

/** A reprieve spent by this save, or null. Pure, so the rule can be asked directly. */
export function spentReprieve(effects, { type, domains = [], unadjustedOutcome }) {
    if (type !== "saving-throw" || unadjustedOutcome !== "criticalFailure") return null;
    return effects.find((e) => domains.includes(e.flags?.[MODULE_ID]?.stargazerReprieve)) ?? null;
}

export const Auguries = {
    registerHooks() {
        Hooks.on("createChatMessage", (message) => {
            if (!isWriter()) return;
            const context = message.flags?.pf2e?.context;
            const actor = message.actor;
            if (!context || !actor) return;
            const reprieve = spentReprieve(actor.itemTypes?.effect ?? [], context);
            if (reprieve) reprieve.delete().catch((e) => console.error("Isaac's Homebrew | a spent reprieve", e));
        });
    },
};

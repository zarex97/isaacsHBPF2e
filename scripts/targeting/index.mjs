import { MODULE_ID } from "../sky/signs.mjs";
import { catchTokens } from "./catch.mjs";
import { configFor, describe, originTokenFor } from "./config.mjs";
import { discardArea, placeArea } from "./place.mjs";
import { reviewTargets } from "./review.mjs";

/**
 * Area targeting: the step that used to be "click eight tokens and hope you got them all".
 *
 * A Technique with an area now puts that area on the board as a Scene Region, lets the caster aim it,
 * catches whoever is inside, applies the Technique's own targeting rule, and sets the result as the
 * user's targets before the spell is ever cast. By the time the chat card exists the targets are already
 * there, which is exactly what pf2e-toolbelt's Target Helper reads when it builds the card's target rows
 * — so the two features meet without either one knowing about the other.
 *
 * The interception point is `SpellcastingEntryPF2e#cast`, which is where the Focus Point is spent. Bailing
 * out before calling through is therefore also what makes a cancelled placement cost nothing.
 */
export const AreaTargeting = {
    registerSettings() {
        game.settings.register(MODULE_ID, "areaTargeting", {
            name: "Place areas as Regions when casting",
            hint: "A Technique with an area puts that area on the board to be aimed, then targets whoever is "
                + "inside it, instead of asking you to select targets by hand first.",
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
        });

        game.settings.register(MODULE_ID, "areaTargetingScope", {
            name: "Area targeting applies to",
            hint: "Whether area targeting is used only for the Saint's Techniques, or for every spell with "
                + "an area in the world.",
            scope: "world",
            config: true,
            type: String,
            choices: {
                techniques: "The Saint's Techniques only",
                spells: "Every spell with an area",
            },
            default: "techniques",
        });

        game.settings.register(MODULE_ID, "areaTargetingReview", {
            name: "Review targets before casting",
            hint: "Show the list of caught tokens for confirmation after you place the area. Turn this off to "
                + "target everything the area caught and cast immediately.",
            scope: "client",
            config: true,
            type: Boolean,
            default: true,
        });
    },

    /**
     * Wrap the system's cast. libWrapper when it is installed, a plain prototype wrap otherwise — the
     * module has no other reason to require it, and pf2e-toolbelt already wraps this same method, so
     * either way the two chain rather than collide.
     */
    install() {
        const path = "CONFIG.PF2E.Item.documentClasses.spellcastingEntry.prototype.cast";
        const proto = CONFIG.PF2E?.Item?.documentClasses?.spellcastingEntry?.prototype;
        if (!proto?.cast) {
            console.warn(`Isaac's Homebrew | could not find ${path}; area targeting is off.`);
            return;
        }

        if (globalThis.libWrapper?.register) {
            libWrapper.register(
                MODULE_ID,
                path,
                async function (wrapped, spell, options = {}) {
                    if (!(await AreaTargeting.run(spell, options))) return;
                    return wrapped(spell, options);
                },
                "MIXED",
            );
            return;
        }

        const original = proto.cast;
        proto.cast = async function (spell, options = {}) {
            if (!(await AreaTargeting.run(spell, options))) return;
            return original.call(this, spell, options);
        };
    },

    /**
     * Run the flow for one cast. Resolves true when the cast should go ahead.
     *
     * Every early return is `true`: a Technique with no area, the setting off, the bypass key held, no
     * canvas — all of those are "not our business, cast normally". Only a caster who backed out of the
     * placement or the review returns false.
     */
    async run(spell, options = {}) {
        const cast = variantFor(spell, options);
        const config = configFor(cast);
        if (!config) return true;
        if (bypassHeld()) return true;

        const originToken = originTokenFor(spell.actor);
        let region = null;
        try {
            ui.notifications.info(`${cast.name}: ${describe(config)}`);
            region = await placeArea(config, originToken);
            if (!region) return false;

            const found = catchTokens(region, config, originToken);
            const ids = await reviewTargets(found, config);
            if (ids === null) return false;

            canvas.tokens.setTargets(ids);
            return true;
        } catch (error) {
            console.error("Isaac's Homebrew | area targeting failed", error);
            ui.notifications.error("Area targeting failed; cast normally. See the console for details.");
            return true;
        } finally {
            // Runs before the cast proceeds, so the area is gone by the time the card is posted.
            await discardArea(region);
        }
    },
};

/**
 * The spell as it will actually be cast.
 *
 * Area grows with rank (`system.heightening.area`), and that growth only exists on the heightened
 * variant — the same variant `SpellPF2e#toMessage` loads a moment later. Reading the area off the base
 * spell would place a 30-foot burst for a Technique being cast as a 60-foot one.
 */
function variantFor(spell, options) {
    const rank = options?.rank ?? spell?.rank;
    const castRank = typeof spell?.computeCastRank === "function" ? spell.computeCastRank(rank) : rank;
    if (castRank && castRank !== spell.rank && typeof spell.loadVariant === "function") {
        return spell.loadVariant({ castRank }) ?? spell;
    }
    return spell;
}

/** Hold Control while casting to target by hand, the same key pf2e-toolbelt uses to skip its own popup. */
function bypassHeld() {
    const manager = foundry.helpers?.interaction?.KeyboardManager ?? globalThis.KeyboardManager;
    const control = manager?.MODIFIER_KEYS?.CONTROL ?? "Control";
    return game.keyboard?.isModifierActive?.(control) === true;
}

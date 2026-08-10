import { Duplicate } from "../economy/duplicate.mjs";
import { MODULE_ID } from "../sky/signs.mjs";
import { catchTokens } from "./catch.mjs";
import { canRotate, configFor, describe, originTokenFor } from "./config.mjs";
import { discardArea, originOf, placeArea } from "./place.mjs";
import { REAIM, reviewTargets } from "./review.mjs";
import { CrystalWall } from "./wall.mjs";

/**
 * Area targeting: the step that used to be "click eight tokens and hope you got them all".
 *
 * A Technique with an area now puts that area on the board as a Scene Region, lets the caster aim it,
 * catches whoever is inside, applies the Technique's own targeting rule, and sets the result as the
 * user's targets before the spell is ever cast. By the time the chat card exists the targets are already
 * there, which is exactly what pf2e-toolbelt's Target Helper reads when it builds the card's target rows
 * — so the two features meet without either one knowing about the other.
 *
 * The interception point is `SpellcastingEntryPF2e#cast`, which is where the Focus Point is spent — so
 * refusing there is also what makes a cancelled placement cost nothing. `run` is called from
 * `scripts/cast-pipeline.mjs`, which owns that wrapper and the one on an activity's `toMessage`.
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

        game.settings.register(MODULE_ID, "enforceRange", {
            name: "Enforce Technique range",
            hint: "Refuse a placement further from you than the Technique reaches. The module never checked "
                + "this before, so it can be turned off — and a GM can always confirm past a rejection.",
            scope: "world",
            config: true,
            type: Boolean,
            default: true,
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
     * Run the flow for one cast. Resolves true when the cast should go ahead.
     *
     * Every early return is `true`: a Technique with no area, the setting off, the bypass key held, no
     * canvas — all of those are "not our business, cast normally". Only a caster who backed out of the
     * placement or the review returns false.
     */
    async run(spell, options = {}) {
        // Gemini's duplicate has the Saint's statistics but none of their Techniques. This is the choke
        // point every cast passes through, so it is the honest place to say no.
        if (Duplicate.isDuplicate(spell?.actor)) {
            ui.notifications.warn(`${spell.actor.name} is a duplicate: no Techniques, no Focus Points.`);
            return false;
        }

        const cast = variantFor(spell, options);
        const config = configFor(cast);
        if (!config) return true;
        if (bypassHeld()) return true;

        const originToken = originTokenFor(spell.actor);

        // No area to aim: the Technique names a number of creatures and a range instead, and both grow.
        // Those are checked against the targets the player already picked.
        if (!config.area) return checkExistingTargets(config, originToken);

        // Every area ever put down this cast, not just the one that survived: a caster who re-aims three
        // times has aimed three areas, and all three are discarded together in the `finally`.
        const placed = [];
        // The placement currently under consideration — aimed, and in range. Only this one is ever
        // reviewed, targeted or built into a wall.
        let regions = null;
        try {
            ui.notifications.info(aimHint(cast, config));

            // Aim, look at who it caught, and go back to aiming if that was not what they meant. The loop
            // is the adjustment step: re-placing is how the area is moved *and* turned, so there is no
            // second set of controls to learn and no area left on the board while a dialog is open.
            for (;;) {
                const aimed = await placeArea(config, originToken);
                if (aimed?.length) {
                    placed.push(...aimed);
                    // Declining an out-of-range placement now means "let me aim again" rather than calling
                    // the cast off, which is the answer that question always wanted.
                    if (!(await withinRange(aimed, config, originToken))) continue;
                    regions = aimed;
                } else if (!regions) {
                    // Esc with nothing aimed yet is the caster calling the whole thing off. Esc while
                    // re-aiming only means "keep what I had", so it falls through to that placement's
                    // target list instead.
                    return false;
                }

                // An emanation is never placed — it is centred on the caster's own space, so re-aiming it
                // would put the identical area back in the identical spot. Offering a button that visibly
                // does nothing is worse than not offering one.
                const ids = await reviewTargets(collect(regions, config, originToken), config, {
                    canReaim: config.anchor !== "self",
                });
                if (ids === null) return false;
                if (ids === REAIM) continue;

                canvas.tokens.setTargets(ids);
                // A Technique that raises a barrier builds it from the line just aimed — the last one
                // aimed, so a re-aimed wall stands where the caster finally pointed it.
                await CrystalWall.build(config, regions[0]);
                return true;
            }
        } catch (error) {
            console.error("Isaac's Homebrew | area targeting failed", error);
            ui.notifications.error("Area targeting failed; cast normally. See the console for details.");
            return true;
        } finally {
            // Runs before the cast proceeds, so the area is gone by the time the card is posted.
            await discardArea(placed);
        }
    },
};

/**
 * Who the placed areas caught, across all of them.
 *
 * Several placements catch between them, and a token standing in two of them is still one target — the
 * dialog would otherwise offer to hit it twice. A token caught by one area and rejected by another is
 * caught: being out of the second area is not a reason to spare it from the first.
 */
function collect(regions, config, originToken) {
    const caught = new Map();
    const rejected = new Map();
    for (const region of regions) {
        const found = catchTokens(region, config, originToken);
        for (const entry of found.caught) caught.set(entry.token.id, entry);
        for (const entry of found.rejected) rejected.set(entry.token.id, entry);
    }
    for (const id of caught.keys()) rejected.delete(id);
    return { caught: [...caught.values()], rejected: [...rejected.values()] };
}

/**
 * What to announce before the area goes on the cursor.
 *
 * The rotation keys are named because a plain wheel zooms the canvas — Foundry gates rotation behind Shift
 * or Ctrl — so a caster who scrolls and sees the map get bigger reasonably concludes the area cannot be
 * turned at all. Only said for a shape where it is true: a burst and an emanation are the same in every
 * direction.
 */
function aimHint(cast, config) {
    const base = `${cast.name}: ${describe(config)}`;
    return canRotate(config.area?.type) ? `${base} — Shift+scroll to rotate (Ctrl for finer).` : base;
}

/**
 * A Technique with no area still has a target count and a range.
 *
 * *Another Dimension* is one creature and two from 12th level; *Rikudō Rinne* is one and two at 20th. Both
 * grow, and neither is worth turning into an emanation the caster aims at their own feet — so the numbers
 * are checked against the targets they picked, and a breach is a question rather than a refusal for the
 * same reason an out-of-range placement is.
 */
async function checkExistingTargets(config, originToken) {
    const targets = [...game.user.targets];
    const problems = [];

    if (config.maxTargets > 0 && targets.length > config.maxTargets) {
        problems.push(
            `${targets.length} targeted, and it reaches ${config.maxTargets}`,
        );
    }
    if (config.range > 0 && game.settings.get(MODULE_ID, "enforceRange") && originToken) {
        const far = targets.filter((t) => (originToken.distanceTo?.(t) ?? 0) > config.range);
        if (far.length > 0) {
            problems.push(
                `${far.map((t) => t.document.name).join(", ")} beyond ${config.range} ft`,
            );
        }
    }
    if (problems.length === 0) return true;

    return foundry.applications.api.DialogV2.confirm({
        window: { title: config.item.name },
        content: `<p>${problems.join("; ")}.</p><p>Cast anyway?</p>`,
        rejectClose: false,
    });
}

/**
 * Was it placed within reach?
 *
 * A rejection is a question rather than a refusal: a measured distance is not always the distance a table
 * means, and holding people to a rule they were not being held to yesterday should be overridable. The
 * setting turns it off entirely. Answering no sends the caster back to aiming, which is the thing they
 * actually wanted when they said the placement was wrong.
 *
 * `originToken` is the placeable, which is what `originTokenFor` returns and what carries `distanceTo`.
 */
async function withinRange(regions, config, originToken) {
    if (!config.range || !originToken) return true;
    if (!game.settings.get(MODULE_ID, "enforceRange")) return true;

    let furthest = 0;
    for (const region of regions) {
        const origin = originOf(region);
        if (!origin) continue;
        const distance = originToken.distanceTo?.(origin) ?? 0;
        furthest = Math.max(furthest, distance);
    }
    if (furthest <= config.range) return true;

    return foundry.applications.api.DialogV2.confirm({
        window: { title: "Out of range" },
        content:
            `<p><strong>${config.item.name}</strong> reaches ${config.range} feet. That placement is `
            + `${Math.round(furthest)} feet away.</p><p>Place it anyway?</p>`,
        rejectClose: false,
    });
}

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

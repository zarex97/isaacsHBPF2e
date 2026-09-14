import { isAbilityUse } from "../riders/data.mjs";
import { Blut } from "./blut.mjs";
import { Modes } from "./modes.mjs";
import { Reiatsu } from "./reiatsu.mjs";
import { Release } from "./release.mjs";

const MODULE_ID = "isaacs-hb-pf2e";

/**
 * The bridge from "a Soulbound used an action" to the state machine that action drives.
 *
 * **This is the piece that was missing.** `release.mjs`, `blut.mjs`, `modes.mjs`, `charges.mjs` and
 * `hypnosis.mjs` were all written, unit-tested and exported on the module API — and none of them was
 * ever called. `Release.enter()` had no caller at all; the only hook registered for the release ladder
 * was `deleteCombat`, which calls `exit`. So the state was never entered, only left, and every Spirit's
 * Released Form had to be granted permanently at 1st level to appear on a sheet at all. A sealed
 * 1st-level Senbonzakura walked around with 15-foot reach, and a 13th-level one had its Bankai
 * standing, free, for ever.
 *
 * The riders pipeline (`riders/sources.mjs`) already listens for exactly this event and already knows
 * how to ignore a message's own follow-up rolls. It cannot carry the release ladder, though, because a
 * rider names **one fixed uuid** and the effect to apply here depends on which of fifteen Spirits the
 * character took. So the ladder gets its own listener on the same event, and content declares what to
 * wear rather than code learning fifteen names — see `Release.formEffectsFor`.
 *
 * Everything routed here is keyed on the item's **slug**, not its name, so renaming a feature in the
 * content does not silently unplug it.
 */

/**
 * Ask which of several things the actor is doing.
 *
 * Every one of these is a choice the player makes at the moment they act — Vene or Arterie, Gokei or
 * Senkei, which of Zanka no Tachi's four cardinal aspects — so it is a dialog and not a setting. Returns
 * null when it is dismissed, and the caller does nothing.
 */
async function chooseOne(title, prompt, options) {
    const buttons = options.map((option) => ({
        action: option,
        label: option,
        callback: () => option,
    }));
    return foundry.applications.api.DialogV2.wait({
        window: { title },
        content: `<p>${prompt}</p>`,
        buttons,
        rejectClose: false,
        close: () => null,
    }).catch(() => null);
}

/** Slug → what to do with it. Kept as a table so adding a rung is one line, not a branch. */
const HANDLERS = {
    release: async (actor) => Release.release(actor),
    "full-release": async (actor) => Release.fullRelease(actor),

    /**
     * **Steady the Breath** — the class's own name for Refocus (guide §4.2), and the only way
     * `Deep Breath` (feat 4) can be expressed.
     *
     * > You regain 2 Reiatsu Points instead of 1 the first time you use Steady the Breath each day.
     *
     * pf2e's Refocus emits nothing a module can hook, so the alternative was sniffing focus changes in
     * `preUpdateActor` — which misfires on every other restore there is. Giving the class its own named
     * action is both truer to the guide and the only place that can count "the first time each day".
     */
    "steady-the-breath": async (actor) => {
        const pool = actor.system?.resources?.focus;
        if (!pool) return;
        if ((pool.value ?? 0) >= (pool.max ?? 0)) {
            ui.notifications.info(`${actor.name}'s reiatsu is already full.`);
            return;
        }

        const feat = actor.itemTypes.feat.find((f) => f.flags?.[MODULE_ID]?.deepBreath);
        const today = new Date(game.time.worldTime * 1000).toDateString();
        const ledger = actor.getFlag(MODULE_ID, "steadyTheBreath") ?? {};
        const first = feat && ledger.day !== today;
        const restore = first ? Number(feat.flags[MODULE_ID].deepBreath.restores ?? 2) : 1;

        const value = Math.min(pool.max ?? 0, (pool.value ?? 0) + restore);
        await actor.update({
            "system.resources.focus.value": value,
            [`flags.${MODULE_ID}.steadyTheBreath`]: { day: feat ? today : ledger.day ?? null },
        });
        ui.notifications.info(
            first
                ? `${actor.name} steadies the breath and regains ${restore} Reiatsu Points (Deep Breath).`
                : `${actor.name} steadies the breath and regains 1 Reiatsu Point.`,
        );
    },

    /**
     * **Cero Metralleta — Sustain** (Los Lobos, Refined Release) — guide §7B.
     *
     * > Sustain at the start of your next turn to fire again in a different direction with no Reiatsu
     * > cost.
     *
     * The Sustain **is** the second shot, so it casts rather than merely permitting a cast: leaving the
     * player to Sustain and then cast would charge them the Technique's printed two actions on top of the
     * Sustain's one, which is three actions for what the guide gives as one.
     *
     * `consume: false` is the "no Reiatsu cost" — the same seam `FreeCast` uses, and the reason the point
     * never has to be spent and refunded. Aiming is untouched: the cast goes through the ordinary
     * pipeline, so the two shapes are offered again and "a different direction" is the caster's to choose.
     */
    "cero-metralleta-sustain": async (actor) => {
        const spell = actor.itemTypes.spell.find((s) => s.system?.slug === "cero-metralleta");
        if (!spell) {
            ui.notifications.warn(`${actor.name} has no Cero Metralleta to sustain.`);
            return;
        }
        await spell.spellcasting?.cast(spell, { message: true, consume: false });
    },

    /**
     * Blut — guide §5.3. Two reishi systems, never both, chosen fresh each round.
     *
     * Not routed through the generic mode switch below, because `Blut.set` carries the one exception the
     * class has: an actor with `soulbound:blut-both` — Uryū in Letzt Stil — keeps whichever form is
     * already standing instead of swapping it out.
     */
    blut: async (actor) => {
        const choice = await chooseOne("Blut", "Which system do you run?", ["Vene", "Arterie"]);
        if (!choice) return;
        await Blut.set(actor, choice.toLowerCase());
        ui.notifications.info(`${actor.name}: Blut ${choice}.`);
    },
};

/**
 * A mode switch declared by the item rather than known here.
 *
 *     "flags": { "isaacs-hb-pf2e": { "modeSwitch": {
 *         "family": ["Gokei", "Senkei"], "prompt": "Which way do the blades go?" } } }
 *
 * Three abilities want this and want it identically — Senbonzakura Kageyoshi's two modes, Zanka no
 * Tachi's four cardinal aspects, and Burner Finger's five fingers — and `modes.mjs` has been able to do
 * it since Phase 3. What it never had was anything that called it.
 */
async function switchMode(actor, item) {
    const declared = item.flags?.[MODULE_ID]?.modeSwitch;
    const family = declared?.family;
    if (!Array.isArray(family) || family.length === 0) return false;

    // A family usually offers the way back out: Senbonzakura Kageyoshi's base state — two emanations, no
    // mode — is a real state the guide describes, and a switch that could only move between Gokei and
    // Senkei would make it unreachable after the first Sustain. Zanka no Tachi is the other shape —
    // "select one cardinal aspect, which lasts until you select another", with no way to stand in none of
    // them — and declares `none: false` to say so.
    const none = declared.none === false ? null : (declared.none ?? "Neither");
    // One Sustain, two things it can do: "Sustain once per round to move the second emanation up to 30
    // feet, **or** to switch modes" (guide §7A). So placing is one more button on the same dialog.
    const place = declared.place?.anchor ? (declared.place.label ?? "Place it") : null;
    const choice = await chooseOne(item.name, declared.prompt ?? "Which one?",
        [...family, ...(place ? [place] : []), ...(none ? [none] : [])]);
    if (!choice) return true; // declared, and declined — not "unhandled"

    if (choice === place) {
        await placeAnchor(actor, declared.place);
        return true;
    }

    if (choice === none) {
        await Modes.clear(actor, family);
        ui.notifications.info(`${actor.name}: back to ${none.toLowerCase()}.`);
        return true;
    }
    const set = await Modes.set(actor, choice, family);
    if (set) ui.notifications.info(`${actor.name}: ${set}.`);
    return true;
}

/**
 * Remember where an area was sent.
 *
 * Senbonzakura Kageyoshi's second emanation is the only area in either class that is **placed and then
 * stays there**, ticking at the start of each of the caster's turns from wherever it was last put. The
 * point is kept on the caster under `areaAnchors`, and a rider naming that anchor builds its shape
 * around it — see `targetsFor`.
 *
 * The placement itself is pf2e's, through the module's own `placeArea`, so it snaps and previews like
 * every other aimed area and can be cancelled without costing the Sustain.
 */
async function placeAnchor(actor, declared) {
    const { placeArea, discardArea } = await import("../targeting/place.mjs");
    const originToken = actor.getActiveTokens(true, true).at(0);
    if (!originToken?.object) {
        ui.notifications.warn(`${actor.name} needs a token on the scene to send the blades from.`);
        return;
    }
    const config = { item: { actor, name: "Senbonzakura Kageyoshi", system: {} },
                     area: declared.area, anchor: null, affects: "enemies" };
    const placed = await placeArea(config, originToken.object);
    if (!placed?.length) return;

    const shape = placed[0].shapes?.at?.(0);
    const point = shape ? { x: shape.x, y: shape.y } : null;
    await discardArea(placed);
    if (!point) return;

    await actor.setFlag(MODULE_ID, `areaAnchors.${declared.anchor}`, point);
    ui.notifications.info(`${actor.name} sends the blades.`);
}

/** The item behind a chat message, whether it was posted from a sheet or by a macro. */
function itemOf(message) {
    return message?.item ?? null;
}

export const SoulboundActions = {
    /** Exposed so the rig can drive an action without a chat message in the way. */
    handlerFor(slug) {
        return HANDLERS[slug] ?? null;
    },

    registerHooks() {
        Hooks.on("createChatMessage", async (message) => {
            // GM-only, for the same reason Rising Pressure is: two clients both entering the state would
            // apply the effect twice and charge the point twice.
            if (!game.user.isGM) return;
            if (!isAbilityUse(message)) return;

            const item = itemOf(message);
            if (!item) return;
            const actor = message.actor;
            if (!Reiatsu.isSoulbound(actor)) return;

            const slug = item.system?.slug ?? game.pf2e.system.sluggify(item.name);
            const handler = HANDLERS[slug];

            try {
                if (handler) await handler(actor, item, message);
                else await switchMode(actor, item);
            } catch (error) {
                console.error(`Isaac's Homebrew | "${slug}" could not be resolved`, error);
            }
        });
    },
};

export { MODULE_ID };

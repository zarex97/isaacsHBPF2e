import { Astral } from "./astral.mjs";
import { CastPipeline } from "./cast-pipeline.mjs";
import { Cosmo } from "./cosmo.mjs";
import { Deaths } from "./deaths.mjs";
import { Duplicate } from "./economy/duplicate.mjs";
import { FreeCast } from "./economy/free-cast.mjs";
import { Recharge } from "./economy/recharge.mjs";
import { Balance } from "./outcomes/balance.mjs";
import { Om } from "./outcomes/om.mjs";
import { Banish } from "./riders/banish.mjs";
import { registerHooks as registerLibraHooks } from "./riders/libra.mjs";
import { Encasement } from "./riders/encasement.mjs";
import { Riders } from "./riders/index.mjs";
import { MODULE_ID, adjacentSigns } from "./sky/signs.mjs";
import { SkyTrackerApp } from "./sky/tracker-app.mjs";
import { SkyTracker } from "./sky/tracker.mjs";
import { AreaTargeting } from "./targeting/index.mjs";
import { Lingering } from "./targeting/lingering.mjs";
import { CrystalWall } from "./targeting/wall.mjs";

/**
 * Run one feature's setup, and let the rest of them start if it fails.
 *
 * A wrapper conflict once threw inside `setup` and, because these calls were a bare list, took the relay,
 * every rider source and the whole IWR bypass down with it — a crash in one feature read at the table as
 * "half the module does nothing", with a console message that named only the part that threw. One feature
 * failing should cost one feature.
 */
function start(feature, fn) {
    try {
        fn();
    } catch (error) {
        console.error(`Isaac's Homebrew | ${feature} failed to start; the rest of the module continues.`, error);
    }
}

Hooks.once("init", () => {
    start("the sky tracker's settings", () => SkyTracker.registerSettings());
    start("area targeting's settings", () => AreaTargeting.registerSettings());
    start("the rider engine's settings", () => Riders.registerSettings());
    start("the banishment register", () => {
        Banish.registerSettings();
        Banish.registerHooks();
    });
    start("the death register", () => {
        Deaths.registerSettings();
        Deaths.registerHooks();
    });
    start("lingering areas", () => {
        Lingering.register();
        Lingering.registerHooks();
    });
    start("astral projection", () => Astral.registerHooks());
    start("free casts' settings", () => FreeCast.registerSettings());
    start("Cosmo", () => Cosmo.registerHooks());
    start("the Gemini duplicate", () => Duplicate.registerHooks());
    start("recharging", () => Recharge.registerHooks());
    start("Om", () => Om.registerHooks());
    start("The Balance", () => Balance.registerHooks());
    start("the Crystal Wall", () => CrystalWall.registerHooks());
    start("encasements", () => Encasement.registerHooks());
    start("the Libra Arms", () => registerLibraHooks());
    start("the sky tracker window", () => SkyTrackerApp.registerHooks());

    start("the sky tracker's settings menu", () => {
        game.settings.registerMenu(MODULE_ID, "skyTrackerMenu", {
            name: "The Sky",
            label: "Open the Sky Tracker",
            hint: "Set the day's constellation and aspect, advance the day, and schedule a Zenith.",
            icon: "fa-solid fa-star",
            type: SkyTrackerApp,
            restricted: false,
        });
    });

    // Everything the tracker can do is reachable from the API too, so the class stays playable from a macro
    // if a Foundry update ever breaks the window. Last, and outside the isolation above, because a module
    // with no API is the one failure a player cannot work around.
    const module = game.modules.get(MODULE_ID);
    module.api = {
        sky: SkyTracker,
        cosmo: Cosmo,
        targeting: AreaTargeting,
        castPipeline: CastPipeline,
        riders: Riders,
        freeCast: FreeCast,
        duplicate: Duplicate,
        astral: Astral,
        banish: Banish,
        deaths: Deaths,
        lingering: Lingering,
        recharge: Recharge,
        om: Om,
        balance: Balance,
        crystalWall: CrystalWall,
        encasement: Encasement,
        open: () => new SkyTrackerApp().render(true),
        adjacentSigns,
    };
});

// After `init`, so the system's document classes exist to be wrapped: the cast pipeline wraps the
// spellcasting entry's `cast` and an activity's `toMessage`, and the rider sources wrap `applyDamage`.
Hooks.once("setup", () => {
    start("the cast pipeline", () => CastPipeline.install());
    start("the rider engine", () => Riders.registerHooks());
});

Hooks.once("ready", async () => {
    await SkyTracker.initialise();
});

/** Scene-control button, so the tracker is one click away rather than buried in settings. */
Hooks.on("getSceneControlButtons", (controls) => {
    const tool = {
        name: "isaacs-hb-sky",
        title: "The Sky",
        icon: "fa-solid fa-star",
        order: 100,
        button: true,
        visible: true,
        onChange: () => new SkyTrackerApp().render(true),
        onClick: () => new SkyTrackerApp().render(true),
    };

    // v13+ passes an object keyed by control name; older shapes pass an array.
    const tokenControl = Array.isArray(controls)
        ? controls.find((c) => c.name === "token")
        : (controls.tokens ?? controls.token);
    if (!tokenControl) return;
    if (Array.isArray(tokenControl.tools)) tokenControl.tools.push(tool);
    else tokenControl.tools[tool.name] = tool;
});

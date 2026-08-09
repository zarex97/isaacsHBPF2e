import { Cosmo } from "./cosmo.mjs";
import { Duplicate } from "./economy/duplicate.mjs";
import { FreeCast } from "./economy/free-cast.mjs";
import { Riders } from "./riders/index.mjs";
import { MODULE_ID, adjacentSigns } from "./sky/signs.mjs";
import { SkyTrackerApp } from "./sky/tracker-app.mjs";
import { SkyTracker } from "./sky/tracker.mjs";
import { AreaTargeting } from "./targeting/index.mjs";

Hooks.once("init", () => {
    SkyTracker.registerSettings();
    AreaTargeting.registerSettings();
    Riders.registerSettings();
    FreeCast.registerSettings();
    Cosmo.registerHooks();
    Duplicate.registerHooks();
    SkyTrackerApp.registerHooks();

    game.settings.registerMenu(MODULE_ID, "skyTrackerMenu", {
        name: "The Sky",
        label: "Open the Sky Tracker",
        hint: "Set the day's constellation and aspect, advance the day, and schedule a Zenith.",
        icon: "fa-solid fa-star",
        type: SkyTrackerApp,
        restricted: false,
    });

    // Everything the tracker can do is reachable from the API too, so the class stays playable from a macro
    // if a Foundry update ever breaks the window.
    const module = game.modules.get(MODULE_ID);
    module.api = {
        sky: SkyTracker,
        cosmo: Cosmo,
        targeting: AreaTargeting,
        riders: Riders,
        freeCast: FreeCast,
        duplicate: Duplicate,
        open: () => new SkyTrackerApp().render(true),
        adjacentSigns,
    };
});

// After `init`, so the system's document classes exist to be wrapped: area targeting wraps the
// spellcasting entry's `cast`, and the rider sources wrap `applyDamage`.
Hooks.once("setup", () => {
    AreaTargeting.install();
    FreeCast.install();
    Riders.registerHooks();
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

import { Carapace } from "./assimilator/carapace.mjs";
import { Engine as AssimilatorEngine } from "./assimilator/engine.mjs";
import { GulletApp, registerGulletHooks } from "./assimilator/gullet.mjs";
import { AssimilatorDamage } from "./assimilator/damage.mjs";
import { Mutations } from "./assimilator/mutations.mjs";
import { Instincts } from "./assimilator/instincts.mjs";
import { Red } from "./assimilator/red.mjs";
import { AssimilatorRig } from "./assimilator/rig.mjs";
import { Astral } from "./astral.mjs";
import { CastPipeline } from "./cast-pipeline.mjs";
import { Cosmo } from "./cosmo.mjs";
import { Deaths } from "./deaths.mjs";
import { DamageBus, PRIORITY } from "./lib/damage-bus.mjs";
import { EncounterDamage } from "./lib/encounter-damage.mjs";
import { Duplicate } from "./economy/duplicate.mjs";
import { FreeCast } from "./economy/free-cast.mjs";
import { Recharge } from "./economy/recharge.mjs";
import { SpellFrequency } from "./economy/spell-frequency.mjs";
import { TerrainAura } from "./soulbound/terrain-aura.mjs";
import { Balance } from "./roll-rewrites/balance.mjs";
import { Om } from "./roll-rewrites/om.mjs";
import { Banish } from "./riders/banish.mjs";
import { registerHooks as registerLibraHooks } from "./riders/libra.mjs";
import { Encasement } from "./riders/encasement.mjs";
import { Escape } from "./riders/escape.mjs";
import { Riders } from "./riders/index.mjs";
import { StrikeTechnique } from "./riders/strike-technique.mjs";
import { MODULE_ID, adjacentSigns } from "./sky/signs.mjs";
import { SkyTrackerApp } from "./sky/tracker-app.mjs";
import { SkyTracker } from "./sky/tracker.mjs";
import { Blut } from "./soulbound/blut.mjs";
import { SoulboundActions } from "./soulbound/actions.mjs";
import { RefuseDeath } from "./refuse-death.mjs";
import { Charges } from "./soulbound/charges.mjs";
import { Hypnosis } from "./soulbound/hypnosis.mjs";
import { Modes } from "./soulbound/modes.mjs";
import { Regeneracion } from "./soulbound/regeneracion.mjs";
import { Reiatsu } from "./soulbound/reiatsu.mjs";
import { Release } from "./soulbound/release.mjs";
import { Severance } from "./soulbound/severance.mjs";
import { SoulboundRig } from "./soulbound/rig.mjs";
import { RisingPressure } from "./soulbound/rising-pressure.mjs";
import { Scattered } from "./soulbound/scattered.mjs";
import { Suppression } from "./soulbound/suppression.mjs";
import { SpiritWeapon } from "./soulbound/weapon.mjs";
import { Wound } from "./soulbound/wound.mjs";
import { AreaTargeting } from "./targeting/index.mjs";
import { registerRollBypass } from "./riders/bypass.mjs";
import { registerEnemyTerrain } from "./targeting/enemy-terrain.mjs";
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
    start("enemies-only difficult terrain", () => registerEnemyTerrain());
    start("lingering areas", () => {
        Lingering.register();
        Lingering.registerHooks();
    });
    // The marker a "make one Strike" Technique leaves for the Strike that follows it. Only the sweeps
    // are hooks: arming is the cast pipeline's, spending is the rider engine's.
    start("Strike Techniques", () => StrikeTechnique.registerHooks());
    start("astral projection", () => Astral.registerHooks());
    start("free casts' settings", () => FreeCast.registerSettings());
    start("Cosmo", () => Cosmo.registerHooks());
    start("the Gemini duplicate", () => Duplicate.registerHooks());
    start("recharging", () => Recharge.registerHooks());
    start("spell frequency", () => SpellFrequency.registerHooks());
    start("terrain auras", () => TerrainAura.registerHooks());
    start("Om", () => Om.registerHooks());
    start("The Balance", () => Balance.registerHooks());
    start("the Crystal Wall", () => CrystalWall.registerHooks());
    start("encasements", () => Encasement.registerHooks());
    start("escapes", () => Escape.registerHooks());
    start("the Libra Arms", () => registerLibraHooks());
    start("the spirit weapon", () => SpiritWeapon.registerHooks());
    // Seal the Art parks a release state rather than deleting it; these put it back.
    start("suppressed arts", () => Suppression.registerHooks());
    start("the Senkei cage's targets", () => Modes.registerTargetGuard());
    start("Reiatsu", () => Reiatsu.registerHooks());
    start("Rising Pressure", () => RisingPressure.registerHooks());
    start("the release ladder", () => Release.registerHooks());
    start("Severance", () => Severance.registerHooks());
    start("a Severing Art's bypass on its own damage roll", () => registerRollBypass());
    start("Blut", () => Blut.registerHooks());
    start("charge pools", () => Charges.registerHooks());
    start("Refuse Death", () => RefuseDeath.registerHooks());
    // The bridge from a used action to the state machine behind it. Without this the release
    // ladder is inert: `Release.enter()` has no other caller anywhere in the module.
    start("the Soulbound action bridge", () => SoulboundActions.registerHooks());
    // Two Soulbound readings of damage that has just landed. Stages on the damage bus rather than calls
    // from inside the rider engine, which is where they used to live.
    start("the wound that will not close", () => DamageBus.after("the wound that will not close", PRIORITY.wound,
        async (actor, _params, before) => { if (game.user.isGM) await Wound.refuse(actor, before); }));
    start("the Carapace", () => Carapace.registerHooks());
    start("the Assimilator engine", () => AssimilatorEngine.registerHooks());
    start("the Gullet", () => registerGulletHooks());
    start("Red's scripted riders", () => Red.registerHooks());
    start("the Mutations' clocks", () => Mutations.registerHooks());
    start("the Mutations that answer damage", () => AssimilatorDamage.registerHooks());
    start("the Instincts", () => Instincts.registerHooks());
    start("damaged this encounter", () => EncounterDamage.registerHooks());
    start("Regeneración's suppression", () => DamageBus.after("Regeneración's suppression", PRIORITY.regeneracion,
        (actor, params) => Regeneracion.onDamage(actor, params)));
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
        spiritWeapon: SpiritWeapon,
        suppression: Suppression,
        reiatsu: Reiatsu,
        risingPressure: RisingPressure,
        release: Release,
        severance: Severance,
        blut: Blut,
        soulboundActions: SoulboundActions,
        modes: Modes,
        charges: Charges,
        refuseDeath: RefuseDeath,
        hypnosis: Hypnosis,
        rig: SoulboundRig,
        damageBus: DamageBus,
        carapace: Carapace,
        assimilator: {
            engine: AssimilatorEngine,
            openGullet: (actor) => GulletApp.open(actor),
            feed: (actor, slug, options) => AssimilatorEngine.feed(actor, slug, options),
            shed: (actor, slug, toDepth) => AssimilatorEngine.shed(actor, slug, toDepth),
            rig: AssimilatorRig,
            damage: AssimilatorDamage,
            instincts: Instincts,
            mend: (actor, itemId) => AssimilatorEngine.mend(actor, itemId),
        },
        open: () => new SkyTrackerApp().render(true),
        adjacentSigns,
    };
});

// After `init`, so the system's document classes exist to be wrapped: the cast pipeline wraps the
// spellcasting entry's `cast` and an activity's `toMessage`, and the damage bus wraps `applyDamage`.
Hooks.once("setup", () => {
    start("the damage bus", () => DamageBus.install());
    start("the cast pipeline", () => CastPipeline.install());
    start("the reiatsu pool", () => Reiatsu.install());
    start("the rider engine", () => Riders.registerHooks());
    start("Strikes that ignore cover", () => Scattered.register());
});

Hooks.once("ready", async () => {
    await SkyTracker.initialise();
    // Characters built before an ability declared its refusal carry an owned copy with no declaration.
    // Narrow and idempotent — it only copies a flag the pack already carries onto an item of the same
    // name that lacks it — so it runs on load rather than waiting to be remembered.
    await RefuseDeath.repairAll();
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

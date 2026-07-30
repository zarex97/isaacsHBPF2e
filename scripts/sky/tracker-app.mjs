import { ASPECTS, CLOTH_SIGNS, MODULE_ID, SIGNS, signOf } from "./signs.mjs";
import { SkyTracker } from "./tracker.mjs";

const { ApplicationV2, HandlebarsApplicationMixin, DialogV2 } = foundry.applications.api;

/**
 * The GM's sky window. Players get the same window read-only, so the table can see whose day it is without
 * asking.
 */
export class SkyTrackerApp extends HandlebarsApplicationMixin(ApplicationV2) {
    /** Marker used by the setting's onChange to find open instances and re-render them. */
    static MODULE_APP = "sky-tracker";

    static DEFAULT_OPTIONS = {
        id: "isaacs-hb-sky-tracker",
        classes: ["isaacs-hb-pf2e", "sky-tracker"],
        position: { width: 460, height: "auto" },
        window: { title: "The Sky", icon: "fa-solid fa-star", resizable: false },
        actions: {
            setSign: SkyTrackerApp.#onSetSign,
            setAspect: SkyTrackerApp.#onSetAspect,
            advanceDay: SkyTrackerApp.#onAdvanceDay,
            scheduleZenith: SkyTrackerApp.#onScheduleZenith,
            reapply: SkyTrackerApp.#onReapply,
        },
    };

    static PARTS = {
        main: { template: `modules/${MODULE_ID}/templates/sky-tracker.hbs` },
    };

    async _prepareContext() {
        const state = SkyTracker.state;
        const saints = SkyTracker.saints().map((actor) => {
            const cloth = SkyTracker.clothOf(actor);
            const lit = cloth === state.sign;
            return {
                name: actor.name,
                cloth: cloth ? signOf(cloth) : null,
                lit,
                tier: lit ? (SkyTracker.isZenith ? "Zenith" : "Ascendant") : null,
            };
        });

        return {
            isGM: game.user.isGM,
            day: state.day,
            sign: SkyTracker.sign,
            aspect: SkyTracker.aspect,
            isZenith: SkyTracker.isZenith,
            signs: SIGNS.map((s) => ({ ...s, selected: s.id === state.sign })),
            aspects: ASPECTS.map((a) => ({ ...a, selected: a.id === state.aspect })),
            saints,
            anyLit: saints.some((s) => s.lit),
            forecast: game.user.isGM ? SkyTracker.forecast(3) : [],
        };
    }

    static async #onSetSign(_event, target) {
        await SkyTracker.set({ sign: target.value });
    }

    static async #onSetAspect(_event, target) {
        await SkyTracker.set({ aspect: target.value });
    }

    static async #onAdvanceDay() {
        await SkyTracker.advanceDay();
    }

    static async #onReapply() {
        await SkyTracker.applyToAll();
        ui.notifications.info("Re-applied sky boons to every Saint.");
    }

    static async #onScheduleZenith() {
        const signOptions = CLOTH_SIGNS.map(
            (id) => `<option value="${id}">${signOf(id).glyph} ${signOf(id).label}</option>`,
        ).join("");

        const result = await DialogV2.prompt({
            window: { title: "Schedule a Zenith" },
            content: `
                <p>A Zenith is one day in 260. It never happens by chance — write it on the card before the
                arc climax.</p>
                <div class="form-group">
                    <label>Constellation</label>
                    <select name="sign">${signOptions}</select>
                </div>
                <div class="form-group">
                    <label>Days from now</label>
                    <input type="number" name="days" value="0" min="0" max="7" />
                </div>
                <p class="hint">0 makes today the Zenith. Up to 7 days can be scheduled ahead.</p>
            `,
            ok: {
                label: "Schedule",
                callback: (_e, _button, dialog) => new foundry.applications.ux.FormDataExtended(
                    dialog.element.querySelector("form") ?? dialog.element,
                ).object,
            },
            rejectClose: false,
        });
        if (!result) return;
        await SkyTracker.scheduleZenith(result.sign, Number(result.days) || 0);
    }

    /** Re-render whenever a Saint joins or leaves the world, or swaps a Cloth. */
    static registerHooks() {
        const rerender = () => {
            for (const app of foundry.applications.instances.values()) {
                if (app.constructor?.MODULE_APP === SkyTrackerApp.MODULE_APP) app.render();
            }
        };
        Hooks.on("createItem", rerender);
        Hooks.on("deleteItem", rerender);
        Hooks.on("createActor", rerender);
        Hooks.on("deleteActor", rerender);
    }
}

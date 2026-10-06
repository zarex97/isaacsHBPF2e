import { AUTOMATION_ID } from "./automation.mjs";
import { MODULE_ID } from "./sky/signs.mjs";

/**
 * Area targeting's settings, carried over from this module to Isaac's PF2e Automation.
 *
 * The settings moved with the code: they are registered under `isaacs-pf2e-automation` now, and the values
 * people chose here would otherwise be dropped back to the defaults without a word. This copies each one
 * once — the world's on the active GM's client, the per-user one on every client — and only where nobody
 * has already set the new one. The old values are read straight out of Foundry's settings storage, because
 * the keys are no longer registered under this module and `game.settings.get` would refuse them.
 *
 * The scope setting changed its choices on the way: "Techniques only" is now "abilities written for area
 * targeting, plus those other modules ask for" — this module asks for its Techniques — and "every spell
 * with an area" is `all`.
 */
const WORLD_DONE = "automationSettingsCarried";
const CLIENT_DONE = "automationClientSettingsCarried";

const WORLD = {
    areaTargeting: (value) => value,
    enforceRange: (value) => value,
    areaTargetingScope: (value) => ({ techniques: "registered", spells: "all" })[value],
};
const CLIENT = {
    areaTargetingReview: (value) => value,
};

/** A stored setting's value, or undefined when nothing was ever stored. */
function stored(storage, key) {
    const raw = storage === "world"
        ? game.settings.storage.get("world")?.getSetting?.(key)?.value
        : game.settings.storage.get("client")?.getItem?.(key);
    if (raw === undefined || raw === null) return undefined;
    if (typeof raw !== "string") return raw;
    try {
        return JSON.parse(raw);
    } catch {
        return raw;
    }
}

export const Migration = {
    registerSettings() {
        game.settings.register(MODULE_ID, WORLD_DONE, { scope: "world", config: false, type: Boolean, default: false });
        game.settings.register(MODULE_ID, CLIENT_DONE, { scope: "client", config: false, type: Boolean, default: false });
    },

    async run() {
        const carried = [];
        if (game.users.activeGM?.id === game.user.id && !game.settings.get(MODULE_ID, WORLD_DONE)) {
            carried.push(...(await carry("world", WORLD)));
            await game.settings.set(MODULE_ID, WORLD_DONE, true);
        }
        if (!game.settings.get(MODULE_ID, CLIENT_DONE)) {
            carried.push(...(await carry("client", CLIENT)));
            await game.settings.set(MODULE_ID, CLIENT_DONE, true);
        }
        if (carried.length > 0) console.info(`Isaac's Homebrew | carried over to ${AUTOMATION_ID}:`, carried.join(", "));
        return carried;
    },
};

async function carry(storage, table) {
    const carried = [];
    for (const [key, convert] of Object.entries(table)) {
        const old = stored(storage, `${MODULE_ID}.${key}`);
        if (old === undefined) continue;
        if (stored(storage, `${AUTOMATION_ID}.${key}`) !== undefined) continue;
        const value = convert(old);
        if (value === undefined) continue;
        await game.settings.set(AUTOMATION_ID, key, value);
        carried.push(`${key} = ${JSON.stringify(value)}`);
    }
    return carried;
}

/**
 * Isaac's PF2e Automation, for the offline tests.
 *
 * The classes reach the automation through `scripts/automation.mjs`, which in Foundry reads the API the
 * automation publishes. Offline there is no Foundry, so the tests build that API from the automation's own
 * sources and hand it to the door — the same code the world runs, at the version this module requires.
 *
 * Where the automation is: `AUTOMATION_PATH` if set (CI checks out the required tag there), otherwise the
 * sibling checkout `../isaacs-pf2e-automation` beside this repo.
 */
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const ROOT = path.resolve(url.fileURLToPath(new URL(".", import.meta.url)), "..", "..");
export const AUTOMATION_ROOT = path.resolve(ROOT, process.env.AUTOMATION_PATH ?? path.join("..", "isaacs-pf2e-automation"));

if (!fs.existsSync(path.join(AUTOMATION_ROOT, "scripts", "api.mjs"))) {
    console.error(
        `Isaac's PF2e Automation not found at ${AUTOMATION_ROOT}.\n`
        + "Clone zarex97/isaacs-pf2e-automation beside this repo, or set AUTOMATION_PATH to a checkout.",
    );
    process.exit(1);
}

/** A file URL for one of the automation's scripts, for `import()`. */
export function lib(relative) {
    return url.pathToFileURL(path.join(AUTOMATION_ROOT, "scripts", relative)).href;
}

/** Build the automation's API from its sources and hand it to this module's door. */
export async function useAutomation() {
    const { buildApi } = await import(lib("api.mjs"));
    const { setAutomation } = await import("../../scripts/automation.mjs");
    const api = buildApi();
    setAutomation(api);
    // As the module does at start-up: its content authors under its own id, which the automation reads.
    api.flags.registerFlagScope("isaacs-hb-pf2e");
    return api;
}

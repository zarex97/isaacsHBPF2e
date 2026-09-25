/**
 * Bring up a live Foundry session, idempotently.
 *
 * The part that was being done by hand every time: start the Foundry desktop app if nothing is
 * already listening on :30000, wait until it actually answers, and print what to do next.
 *
 * **It does not start a browser.** The driver is the Claude-in-Chrome extension, which lives in the
 * user's own Chrome on the profile that carries it — see `Docs/tools/live-verification.md`. A browser
 * this script started could not be that one: it would have its own throwaway profile and therefore no
 * extension, which is exactly the trap `--devtools` used to set by default.
 *
 * `--devtools` starts the debug Chrome on :9222 for the fallback driver, chrome-devtools MCP. That is
 * for unattended runs, where no window is in focus and no real pointer exists.
 *
 * It does NOT join the world either. Joining is a POST, and the point of this script is to get to the
 * place where a driver can take over.
 *
 *   node build/live-session.mjs              # start Foundry, and stop
 *   node build/live-session.mjs --devtools   # …and the debug Chrome for the fallback driver
 *   node build/live-session.mjs --status     # report only, start nothing
 *   node build/live-session.mjs --world pf   # also print the launch/join snippet for that world
 *
 * Two things this script exists to stop happening again:
 *
 *   - **The debug window must be at least 1024×768.** Below that Foundry never finishes initialising
 *     and the symptom is not a size warning: `CONFIG.PF2E` and `game.pf2e` come back undefined and
 *     `CONFIG.Actor.documentClass` is core `Actor`, which reads exactly like this module having broken
 *     the system. Chrome is therefore started with an explicit `--window-size`.
 *   - **A CDP server reports "connected" even when nothing is listening.** So readiness here is a real
 *     GET of `/json/version`, not the absence of an error.
 */

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import process from "node:process";

const FOUNDRY_EXE = "C:\\Program Files\\Foundry Virtual Tabletop\\Foundry Virtual Tabletop.exe";
const CHROME_EXE = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const PROFILE_DIR = `${process.env.TEMP ?? "C:\\Temp"}\\chrome-foundry-debug`;
const FOUNDRY_URL = "http://localhost:30000";
const CDP_URL = "http://127.0.0.1:9222";

const args = process.argv.slice(2);
const statusOnly = args.includes("--status");
// Opt-in, because the browser this starts is the one the primary driver cannot use.
const wantDevtools = args.includes("--devtools");
const world = args[args.indexOf("--world") + 1] ?? null;

/* -------------------------------------------------------------------------------------------- */

async function reachable(url, ms = 1500) {
    try {
        const controller = new AbortController();
        const timer = setTimeout(() => controller.abort(), ms);
        const response = await fetch(url, { signal: controller.signal, redirect: "manual" });
        clearTimeout(timer);
        return response.status > 0;
    } catch {
        return false;
    }
}

async function waitFor(label, url, seconds) {
    for (let i = 0; i < seconds; i++) {
        if (await reachable(url)) return true;
        await new Promise((r) => setTimeout(r, 1000));
        if (i === 4) console.log(`  … still waiting for ${label}`);
    }
    return false;
}

function launch(exe, argv) {
    if (!existsSync(exe)) throw new Error(`not installed where this script expects it: ${exe}`);
    const child = spawn(exe, argv, { detached: true, stdio: "ignore" });
    child.unref();
}

/* -------------------------------------------------------------------------------------------- */

async function main() {
    const foundryUp = await reachable(FOUNDRY_URL);
    const chromeUp = await reachable(`${CDP_URL}/json/version`);

    console.log(`Foundry  ${FOUNDRY_URL}      ${foundryUp ? "up" : "down"}`);
    if (wantDevtools || chromeUp) {
        console.log(`Debug Chrome ${CDP_URL}   ${chromeUp ? "up" : "down"}`);
    }

    if (statusOnly) {
        if (chromeUp) await printTargets();
        // A missing debug Chrome is only a failure when one was asked for: the primary driver is an
        // extension in a browser this script never touches, and reporting that as "down" reads as broken.
        return foundryUp && (chromeUp || !wantDevtools) ? 0 : 1;
    }

    if (!foundryUp) {
        console.log("\nStarting Foundry…");
        launch(FOUNDRY_EXE, []);
        if (!(await waitFor("Foundry", FOUNDRY_URL, 90))) {
            console.error("Foundry did not come up. It may be showing its EULA or a licence prompt — "
                + "check the desktop window.");
            return 1;
        }
        console.log("Foundry is up.");
    }

    if (wantDevtools && !chromeUp) {
        console.log("\nStarting the debug Chrome…");
        // --window-size is not cosmetic: see the header.
        launch(CHROME_EXE, [
            "--remote-debugging-port=9222",
            `--user-data-dir=${PROFILE_DIR}`,
            "--window-size=1600,1000",
            // A background or covered Chrome throttles its timers, and Foundry's startup waits on them: the world
            // sat on a black screen until the window was forced to the front. The debug Chrome runs unattended,
            // so it is told never to throttle.
            "--disable-background-timer-throttling",
            "--disable-backgrounding-occluded-windows",
            "--disable-renderer-backgrounding",
            "--no-first-run",
            "--no-default-browser-check",
            FOUNDRY_URL,
        ]);
        if (!(await waitFor("the debug Chrome", `${CDP_URL}/json/version`, 45))) {
            console.error("Chrome did not expose :9222. If a Chrome using this profile is already "
                + `running without the flag, close it: ${PROFILE_DIR}`);
            return 1;
        }
        console.log("Debug Chrome is up.");
    }

    if (chromeUp || wantDevtools) await printTargets();
    printNextSteps();
    return 0;
}

async function printTargets() {
    try {
        const targets = await (await fetch(`${CDP_URL}/json/list`)).json();
        const pages = targets.filter((t) => t.type === "page");
        console.log(`\n${pages.length} page target${pages.length === 1 ? "" : "s"}:`);
        for (const page of pages) console.log(`  ${page.title}  —  ${page.url}`);
    } catch {
        console.log("\n(could not list CDP targets)");
    }
}

function printNextSteps() {
    console.log(`
Next, in the driver — a tab in your own Chrome, on the profile carrying the Claude-in-Chrome
extension. See Docs/tools/live-verification.md; --devtools starts the fallback browser instead.

  1. Point the page at ${FOUNDRY_URL}. If another world is running you will land on /join;
     use "Return to Setup" (or shut the world down) to reach /setup.
  2. Launch the world from /setup. Without a POST, the click is:

       document.querySelector('[data-package-id="${world ?? "pf"}"] a.control.play').click()

     The play control is a bare <a> with no text, so it does not appear in an a11y snapshot —
     clicking it by selector is the reliable route.
  3. On /join pick the Gamemaster user and submit. Then wait for game.ready.
  4. Sanity-check the module before trusting anything:

       game.world.id, game.system.version,
       game.modules.get("isaacs-hb-pf2e").active,
       !!CONFIG.PF2E                       // false means the window is too small — resize and reload

Remember: \`npm run build\` fails with EPERM while a world is open (the pack LevelDB is locked).
Call game.shutDown() first, then retry the build a couple of times — the lock clears a second late.
`);
}

process.exitCode = await main();

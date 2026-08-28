/**
 * Rebuild the compendium packs whenever content/ changes.
 *
 * This is the half of the dev loop that a browser refresh cannot cover. scripts/, styles/ and templates/
 * are served from disk, so reloading the world picks them up; packs/ is a compiled LevelDB, so a content
 * edit only reaches Foundry once it is rebuilt.
 *
 * Foundry holds a LOCK on every pack of the active world, and the build deletes packs/ before recompiling,
 * so a rebuild fails while a world is loaded. Return to Setup first — that releases the locks without
 * quitting Foundry. The watcher says so rather than printing a bare EPERM.
 */
import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const ROOT = path.resolve(url.fileURLToPath(new URL(".", import.meta.url)), "..");
const CONTENT_DIR = path.join(ROOT, "content");
const DEBOUNCE_MS = 300;

let timer = null;
let running = false;
let queued = false;

function build() {
    if (running) {
        queued = true;
        return;
    }
    running = true;
    console.log(`\n[${new Date().toLocaleTimeString()}] building...`);
    const child = spawn(process.execPath, [path.join(ROOT, "build", "build-packs.mjs")], {
        cwd: ROOT,
        stdio: ["ignore", "inherit", "pipe"],
    });

    let stderr = "";
    child.stderr.on("data", (chunk) => {
        stderr += chunk;
        process.stderr.write(chunk);
    });

    child.on("close", (code) => {
        running = false;
        if (code === 0) {
            console.log("Reload the world in Foundry to see it (F5).");
        } else if (/EPERM|EBUSY|ENOTEMPTY|resource busy|LOCK/i.test(stderr)) {
            console.error("\nThe packs are locked, which means a world is open in Foundry.");
            console.error("Return to Setup — that releases the locks — then save the file again.");
        }
        if (queued) {
            queued = false;
            build();
        }
    });
}

if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`No content directory at ${CONTENT_DIR}`);
    process.exit(1);
}

fs.watch(CONTENT_DIR, { recursive: true }, (_event, filename) => {
    if (filename && !filename.endsWith(".json")) return;
    clearTimeout(timer);
    timer = setTimeout(build, DEBOUNCE_MS);
});

console.log(`Watching ${CONTENT_DIR} — save a document to rebuild its pack. Ctrl+C to stop.`);
build();

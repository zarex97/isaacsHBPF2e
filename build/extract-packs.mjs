/**
 * Round-trip built LevelDB packs back to JSON.
 *
 * Two uses: proving the compile step is lossless (the CI check), and pulling changes back out after
 * authoring content in Foundry's UI, which is often faster than hand-editing JSON for descriptions.
 *
 * By default this writes to .staging/extracted so it never clobbers hand-authored source. Pass --overwrite
 * to write into content/ instead — that is the "I edited in Foundry, pull it back" path.
 */
import { extractPack } from "@foundryvtt/foundryvtt-cli";
import fs from "node:fs";
import path from "node:path";
import { CONTENT_DIR, ROOT, sluggify } from "./lib/pack.mjs";

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "module.json"), "utf8"));
const overwrite = process.argv.includes("--overwrite");
const outRoot = overwrite ? CONTENT_DIR : path.join(ROOT, ".staging", "extracted");

for (const def of manifest.packs) {
    const src = path.join(ROOT, "packs", def.name);
    if (!fs.existsSync(src)) {
        console.log(`  ${def.name}: not built, skipping`);
        continue;
    }
    const dest = path.join(outRoot, def.name);
    fs.mkdirSync(dest, { recursive: true });
    await extractPack(src, dest, {
        clean: !overwrite,
        transformName: (doc) => `${sluggify(doc.name ?? doc._id)}.json`,
        jsonOptions: { space: 4 },
        transformEntry: (doc) => {
            // _key and _id are re-derived on build; keeping them out keeps the diff readable.
            delete doc._key;
            delete doc._stats;
            return undefined;
        },
    });
    console.log(`  ${def.name} -> ${path.relative(ROOT, dest)}`);
}
console.log(`\nExtracted to ${path.relative(ROOT, outRoot)}${overwrite ? " (overwrote source)" : ""}.`);

import { compilePack } from "@foundryvtt/foundryvtt-cli";
import fs from "node:fs";
import path from "node:path";
import { CONTENT_DIR, ROOT, loadPacks, prepare, stage } from "./lib/pack.mjs";
import { validate } from "./lib/validate-lib.mjs";

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "module.json"), "utf8"));
const stagingDir = path.join(ROOT, ".staging");
const outDir = path.join(ROOT, "packs");

if (!fs.existsSync(CONTENT_DIR)) {
    console.error(`No content directory at ${CONTENT_DIR}`);
    process.exit(1);
}

const errors = [];
const packs = loadPacks(manifest);
prepare(packs, { errors });
validate(packs, { errors });

if (errors.length > 0) {
    console.error(`\nBuild failed with ${errors.length} error(s):`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
}

stage(packs, stagingDir);

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

let total = 0;
for (const { def, docs, folders } of packs) {
    await compilePack(path.join(stagingDir, def.name), path.join(outDir, def.name), { recursive: true });
    total += docs.length;
    console.log(`  ${def.name}: ${docs.length} document(s), ${folders.length} folder(s)`);
}

fs.rmSync(stagingDir, { recursive: true, force: true });
console.log(`\nBuilt ${packs.length} pack(s) with ${total} documents.`);

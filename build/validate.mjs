import fs from "node:fs";
import path from "node:path";
import { ROOT, loadPacks, prepare } from "./lib/pack.mjs";
import { validate } from "./lib/validate-lib.mjs";

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "module.json"), "utf8"));
const errors = [];
const packs = loadPacks(manifest);
prepare(packs, { errors });
validate(packs, { errors });

const count = packs.reduce((n, p) => n + p.docs.length, 0);
if (errors.length > 0) {
    console.error(`Validation failed: ${errors.length} error(s) across ${count} document(s).`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
}
console.log(`Validated ${count} document(s) in ${packs.length} pack(s): no errors.`);

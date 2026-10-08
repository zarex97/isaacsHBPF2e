/**
 * The automation's precedent lookup, over its trackers and this module's together:
 *
 *   npm run precedent -- --text "<rule text>" | --tags "facet:value …" | --clause <ID>
 *
 * The vocabulary is the automation's (`Docs/patterns.md` there), at the version this module requires.
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { AUTOMATION_ROOT } from "./lib/automation.mjs";
import { ROOT } from "./lib/pack.mjs";

const run = spawnSync(process.execPath, [path.join(AUTOMATION_ROOT, "build", "precedent.mjs"), "--trackers", path.join(ROOT, "Docs", "clauses"), ...process.argv.slice(2)], { stdio: "inherit" });
process.exit(run.status ?? 1);

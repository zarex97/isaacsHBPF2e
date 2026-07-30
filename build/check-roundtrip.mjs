/**
 * Prove the compile step is lossless.
 *
 * Reads the built LevelDB back and compares every document to the prepared source it came from. A pack that
 * silently drops a field would still install and still look fine in Foundry — the missing rule element just
 * would not fire — so this is the check that catches it.
 */
import { ClassicLevel } from "classic-level";
import fs from "node:fs";
import path from "node:path";
import { ROOT, loadPacks, prepare } from "./lib/pack.mjs";

const manifest = JSON.parse(fs.readFileSync(path.join(ROOT, "module.json"), "utf8"));
const COLLECTIONS = { Item: "items", JournalEntry: "journal", Macro: "macros" };

const errors = [];
const packs = loadPacks(manifest);
prepare(packs, { errors });
if (errors.length > 0) {
    console.error("Sources do not prepare cleanly; run `npm run validate` first.");
    process.exit(1);
}

/**
 * Embedded collections foundryvtt-cli splits out, and the extra arrays it materialises on a stored parent.
 *
 * The CLI stores children in their own `<collection>.<embedded>` sublevel and rewrites the parent's array to
 * hold only their IDs, and it fills in empty hierarchy arrays that the source omits. Both are correct, so the
 * comparison has to model them — otherwise the check screams about every single document and is useless.
 */
const HIERARCHY = { items: { effects: [] }, journal: { pages: [] } };

/** Strip fields the compile step legitimately adds, and reduce embedded children to their IDs. */
function normalise(doc, collection) {
    const copy = structuredClone(doc);
    delete copy._key;
    delete copy._stats;
    for (const embedded of Object.keys(HIERARCHY[collection] ?? {})) {
        const value = copy[embedded] ?? [];
        copy[embedded] = value.map((child) => (typeof child === "string" ? child : child._id));
    }
    // `categories` is materialised on stored journal entries.
    if (collection === "journal") copy.categories ??= [];
    return copy;
}

function diffPaths(a, b, at = "", out = []) {
    if (out.length > 8) return out;
    const bothObjects = a && b && typeof a === "object" && typeof b === "object";
    if (!bothObjects) {
        if (JSON.stringify(a) !== JSON.stringify(b)) out.push(at || "(root)");
        return out;
    }
    for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
        diffPaths(a[key], b[key], at ? `${at}.${key}` : key, out);
    }
    return out;
}

let checked = 0;
for (const { def, docs, folders } of packs) {
    const dir = path.join(ROOT, "packs", def.name);
    if (!fs.existsSync(dir)) {
        errors.push(`${def.name}: not built — run \`npm run build\` first`);
        continue;
    }
    const db = new ClassicLevel(dir, { keyEncoding: "utf8", valueEncoding: "json" });
    await db.open();
    const collection = COLLECTIONS[def.type];
    const stored = new Map();
    for await (const [id, value] of db.sublevel(collection, { keyEncoding: "utf8", valueEncoding: "json" }).iterator()) {
        stored.set(id, value);
    }
    const storedFolders = new Map();
    for await (const [id, value] of db.sublevel("folders", { keyEncoding: "utf8", valueEncoding: "json" }).iterator()) {
        storedFolders.set(id, value);
    }
    const storedEmbedded = new Map();
    for (const embedded of Object.keys(HIERARCHY[collection] ?? {})) {
        const sub = db.sublevel(`${collection}.${embedded}`, { keyEncoding: "utf8", valueEncoding: "json" });
        for await (const [id, value] of sub.iterator()) storedEmbedded.set(`${embedded}:${id}`, value);
    }
    await db.close();

    if (stored.size !== docs.length) {
        errors.push(`${def.name}: built ${stored.size} document(s) but source has ${docs.length}`);
    }
    if (storedFolders.size !== folders.length) {
        errors.push(`${def.name}: built ${storedFolders.size} folder(s) but source has ${folders.length}`);
    }

    for (const { doc } of docs) {
        const found = stored.get(doc._id);
        if (!found) {
            errors.push(`${def.name}: "${doc.name}" (${doc._id}) is missing from the built pack`);
            continue;
        }
        const differences = diffPaths(normalise(doc, collection), normalise(found, collection));
        if (differences.length > 0) {
            errors.push(`${def.name}: "${doc.name}" differs at ${differences.join(", ")}`);
        }
        checked += 1;

        // Embedded children live in their own sublevel; verify each one survived too.
        for (const embedded of Object.keys(HIERARCHY[collection] ?? {})) {
            for (const child of doc[embedded] ?? []) {
                const storedChild = storedEmbedded.get(`${embedded}:${doc._id}.${child._id}`);
                if (!storedChild) {
                    errors.push(`${def.name}: "${doc.name}" ${embedded} "${child.name}" is missing`);
                    continue;
                }
                const childDiff = diffPaths(normalise(child, embedded), normalise(storedChild, embedded));
                if (childDiff.length > 0) {
                    errors.push(
                        `${def.name}: "${doc.name}" ${embedded} "${child.name}" differs at ${childDiff.join(", ")}`,
                    );
                }
                checked += 1;
            }
        }
    }
}

if (errors.length > 0) {
    console.error(`Round-trip check failed with ${errors.length} problem(s):`);
    for (const error of errors) console.error(`  - ${error}`);
    process.exit(1);
}
console.log(`Round-trip check passed: ${checked} document(s) survive compilation unchanged.`);

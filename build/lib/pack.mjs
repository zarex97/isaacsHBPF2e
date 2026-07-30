import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import url from "node:url";

const ROOT = path.resolve(url.fileURLToPath(new URL(".", import.meta.url)), "..", "..");
const MODULE_ID = "isaacs-hb-pf2e";
const CONTENT_DIR = path.join(ROOT, "content");

/** Foundry document IDs are 16 characters from this alphabet. */
const ID_ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

/** Collection name per document type, matching foundryvtt-cli's TYPE_COLLECTION_MAP. */
const COLLECTIONS = { Item: "items", JournalEntry: "journal", Macro: "macros", Folder: "folders" };

/** Embedded collections we author, mirroring foundryvtt-cli's HIERARCHY for the types this module ships. */
const EMBEDDED = { journal: { pages: "JournalEntryPage" } };

/**
 * Derive a stable 16-character Foundry ID from a pack name and slug.
 *
 * Stability matters: an ID that churns between builds breaks every link in an existing world — granted
 * features detach from their parents and actors lose their spells. Hashing the identity rather than
 * generating randomly means a rebuild of unchanged content produces an identical pack.
 */
export function deriveId(packName, kind, slug) {
    const digest = crypto.createHash("sha256").update(`${MODULE_ID}:${packName}:${kind}:${slug}`).digest();
    let id = "";
    for (let i = 0; i < 16; i++) id += ID_ALPHABET[digest[i] % ID_ALPHABET.length];
    return id;
}

/** Mirror of pf2e's `sluggify` for the cases that appear in our content. */
export function sluggify(name) {
    return name
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .toLowerCase()
        .replace(/['’]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

/** Walk every string in a value, replacing it with the result of `fn`. */
function mapStrings(value, fn) {
    if (typeof value === "string") return fn(value);
    if (Array.isArray(value)) return value.map((v) => mapStrings(v, fn));
    if (value && typeof value === "object") {
        for (const [k, v] of Object.entries(value)) value[k] = mapStrings(v, fn);
    }
    return value;
}

function* walkJson(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) yield* walkJson(full);
        else if (entry.name.endsWith(".json")) yield full;
    }
}

/**
 * Read every pack's JSON source.
 *
 * Layout: content/<pack-name>/**\/*.json, one document per file, plus an optional _folders.json per pack
 * holding an array of Folder documents (the shape pf2e uses).
 */
export function loadPacks(manifest) {
    const packs = [];
    for (const packDef of manifest.packs) {
        const dir = path.join(CONTENT_DIR, packDef.name);
        if (!fs.existsSync(dir)) {
            packs.push({ def: packDef, docs: [], folders: [] });
            continue;
        }

        const docs = [];
        let folders = [];
        for (const file of walkJson(dir)) {
            const raw = JSON.parse(fs.readFileSync(file, "utf8"));
            if (path.basename(file) === "_folders.json") {
                folders = raw;
                continue;
            }
            docs.push({ file, doc: raw });
        }
        packs.push({ def: packDef, docs, folders });
    }
    return packs;
}

/**
 * Assign IDs and slugs, then rewrite name-based UUIDs to ID-based ones.
 *
 * The pf2e system does NOT resolve `Compendium.<pack>.Item.<Name>` at runtime — its own build converts
 * those to IDs (pf2e's build/lib/compendium-pack.ts, `convertUUIDs`). Authoring by name and resolving
 * here keeps the source readable without shipping references Foundry cannot follow.
 */
export function prepare(packs, { errors }) {
    const nameToUuid = new Map();
    const seen = new Map();

    // Pass 1: identity.
    for (const { def, docs, folders } of packs) {
        const collection = COLLECTIONS[def.type];
        for (const { file, doc } of docs) {
            if (!doc.name) {
                errors.push(`${rel(file)}: document has no name`);
                continue;
            }
            const slug = doc.system?.slug ?? sluggify(doc.name);
            const dupeKey = `${def.name}:${slug}`;
            if (seen.has(dupeKey)) {
                errors.push(`${rel(file)}: duplicate slug "${slug}" (also in ${rel(seen.get(dupeKey))})`);
            }
            seen.set(dupeKey, file);

            doc._id ??= deriveId(def.name, def.type, slug);
            doc._key = `!${collection}!${doc._id}`;
            if (def.type === "Item" && doc.system) doc.system.slug = slug;

            // Embedded documents get their own keys in a `<collection>.<embedded>` sublevel, keyed
            // `<parentId>.<childId>`. foundryvtt-cli walks the hierarchy and will throw on a missing key
            // rather than skipping, so journal pages need this or the build dies.
            for (const [embedded, sub] of Object.entries(EMBEDDED[collection] ?? {})) {
                for (const child of doc[embedded] ?? []) {
                    child._id ??= deriveId(def.name, sub, `${slug}:${child.name ?? ""}`);
                    child._key = `!${collection}.${embedded}!${doc._id}.${child._id}`;
                }
            }

            nameToUuid.set(
                `Compendium.${MODULE_ID}.${def.name}.${def.type}.${doc.name}`,
                `Compendium.${MODULE_ID}.${def.name}.${def.type}.${doc._id}`,
            );
        }

        for (const folder of folders) {
            folder._id ??= deriveId(def.name, "Folder", sluggify(folder.name));
            folder._key = `!folders!${folder._id}`;
            folder.type ??= def.type;
        }
    }

    // Pass 1b: folders and documents may reference folders by name; resolve to IDs.
    for (const { def, docs, folders } of packs) {
        const byName = new Map(folders.map((f) => [f.name, f._id]));
        for (const folder of folders) {
            if (folder.folder && !/^[a-zA-Z0-9]{16}$/.test(folder.folder)) {
                const parent = byName.get(folder.folder);
                if (!parent) errors.push(`${def.name}/_folders.json: unknown parent folder "${folder.folder}"`);
                folder.folder = parent ?? null;
            }
            folder.folder ??= null;
            folder.sort ??= 0;
            folder.sorting ??= "a";
            folder.color ??= null;
            folder.description ??= "";
            folder.flags ??= {};
        }
        for (const { file, doc } of docs) {
            if (!doc.folder) continue;
            if (/^[a-zA-Z0-9]{16}$/.test(doc.folder)) continue;
            const id = byName.get(doc.folder);
            if (!id) errors.push(`${rel(file)}: unknown folder "${doc.folder}"`);
            doc.folder = id ?? null;
        }
    }

    // Pass 2: UUID resolution. Anything addressing this module by name must resolve, or the reference is
    // dead at runtime — better to fail the build than ship a broken grant.
    const prefix = `Compendium.${MODULE_ID}.`;
    // Document names legitimately contain apostrophes ("Titan's Stance") and spaces, so the terminator set
    // is only the characters that actually end a UUID in our sources: @UUID[...] brackets, the {...|label}
    // form, JSON quoting, and an opening HTML tag.
    const uuidPattern = /Compendium\.isaacs-hb-pf2e\.[^.\s]+\.[A-Za-z]+\.[^\]|}"<]+/g;
    for (const { docs } of packs) {
        for (const { file, doc } of docs) {
            mapStrings(doc, (str) => {
                if (!str.includes(prefix)) return str;
                return str.replace(uuidPattern, (uuid) => {
                    const trimmed = uuid.trimEnd();
                    if (nameToUuid.has(trimmed)) return nameToUuid.get(trimmed) + uuid.slice(trimmed.length);
                    const tail = trimmed.split(".").at(-1);
                    if (/^[a-zA-Z0-9]{16}$/.test(tail)) return uuid; // already an ID
                    errors.push(`${rel(file)}: unresolvable UUID "${trimmed}"`);
                    return uuid;
                });
            });
        }
    }

    return { nameToUuid };
}

/** Write prepared documents to a staging directory for foundryvtt-cli to compile. */
export function stage(packs, stagingDir) {
    fs.rmSync(stagingDir, { recursive: true, force: true });
    for (const { def, docs, folders } of packs) {
        const dir = path.join(stagingDir, def.name);
        fs.mkdirSync(dir, { recursive: true });
        for (const folder of folders) {
            fs.writeFileSync(path.join(dir, `_folder_${folder._id}.json`), JSON.stringify(folder));
        }
        for (const { doc } of docs) {
            fs.writeFileSync(path.join(dir, `${doc._id}.json`), JSON.stringify(doc));
        }
    }
}

export function rel(file) {
    return path.relative(ROOT, file);
}

export { CONTENT_DIR, MODULE_ID, ROOT };

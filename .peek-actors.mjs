import { ClassicLevel } from "classic-level";
import fs from "node:fs";
import path from "node:path";

const base = "C:/Users/isaac/AppData/Local/FoundryVTT/Data/worlds";

for (const world of ["pf", "testingpfcommision"]) {
    const dataDir = path.join(base, world, "data");
    console.log("\n=== " + world + " ===");
    if (!fs.existsSync(dataDir)) {
        console.log("  no data dir at " + dataDir);
        continue;
    }
    console.log("  collections: " + fs.readdirSync(dataDir).join(", "));

    const actorsDir = path.join(dataDir, "actors");
    if (!fs.existsSync(actorsDir)) {
        console.log("  no actors db");
        continue;
    }

    const db = new ClassicLevel(actorsDir, { valueEncoding: "json", createIfMissing: false });
    try {
        await db.open();
        const rows = [];
        for await (const [, v] of db.iterator()) {
            const cls = (v.items ?? []).find((i) => i.type === "class");
            const hb = (v.items ?? []).filter((i) => {
                const src = i._stats?.compendiumSource ?? i.flags?.core?.sourceId ?? "";
                return String(src).includes("isaacs-hb-pf2e");
            }).length;
            rows.push({
                name: v.name,
                type: v.type,
                lvl: v.system?.details?.level?.value,
                cls: cls?.name ?? "-",
                hb,
                items: (v.items ?? []).length,
            });
        }
        console.log("  actors: " + rows.length);
        for (const r of rows.filter((r) => r.type === "character" || r.hb > 0)) {
            console.log(
                "   " +
                    String(r.type).padEnd(10) +
                    " lvl " + String(r.lvl ?? "?").padStart(2) +
                    "  class=" + String(r.cls).padEnd(18) +
                    " hbItems=" + String(r.hb).padStart(3) +
                    " items=" + String(r.items).padStart(3) +
                    "  " + r.name,
            );
        }
        const npcs = rows.filter((r) => r.type === "npc");
        console.log("  (+ " + npcs.length + " npcs) e.g. " + npcs.slice(0, 8).map((r) => r.name).join(", "));
    } catch (e) {
        console.log("  ERROR: " + e.message);
    } finally {
        await db.close().catch(() => {});
    }
}

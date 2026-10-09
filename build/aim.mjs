/**
 * Aim a standing area placement with trusted pointer input, from a script.
 *
 * Start the cast first — from chrome-devtools MCP, the sheet, anything — without awaiting it: a cast
 * awaits its own placement, and this is what answers it. Then:
 *
 *   node build/aim.mjs --toward "Goblin"                     # a line or cone pinned to the caster: one click
 *   node build/aim.mjs --apex 1450,2100 --toward 1800,2100   # a free cone or line: apex, then facing
 *   node build/aim.mjs --at 1800,2100                        # a burst: one click where it lands
 *   … --dry-run                                              # stop before the confirming click
 *
 * A point is `x,y` in world (scene) pixels, or the name of a token on the scene, which means its centre.
 *
 * Why this exists: chrome-devtools MCP can only click an element from a page snapshot, and an area is
 * confirmed at a point on the canvas. The extension's real pointer could, but only in a window someone is
 * watching. `Input.dispatchMouseEvent` reaches the page as trusted input through Chrome's own pipeline,
 * in a headless browser as well as a visible one — see `build/lib/cdp.mjs`.
 *
 * Three things it does that a burst of clicks would not, each learnt the hard way (see
 * `Docs/tools/live-verification.md` §10):
 *
 *   - **It centres the view first,** with `canvas.pan`, because the placement's `pointermove` pans the
 *     canvas when the pointer nears an edge and every later coordinate would drift with it.
 *   - **It waits for frames between steps,** because down–move–up delivered as one burst confirms whatever
 *     the preview faced before the move was processed.
 *   - **It reads the preview back before confirming,** and prints `canvas.mousePosition`, so a wrong aim is
 *     seen before it is placed rather than inferred afterwards from who was caught.
 */
import { writeFileSync } from "node:fs";
import process from "node:process";
import { Page } from "./lib/cdp.mjs";

const args = process.argv.slice(2);
const option = (name) => {
    const i = args.indexOf(`--${name}`);
    return i === -1 ? null : args[i + 1];
};
const dryRun = args.includes("--dry-run");
/** CSS pixels from the viewport's edge inside which a pointer pans the canvas during a placement. */
const EDGE = 60;
const shotPath = option("shot");

/** The world point an argument names: `x,y`, or a token's centre by name. */
async function resolve(page, spec) {
    if (spec === null) return null;
    const pair = /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/.exec(spec);
    if (pair) return { x: Number(pair[1]), y: Number(pair[2]) };
    const point = await page.eval(`(() => {
        const token = canvas.tokens.placeables.find((t) => t.document.name === ${JSON.stringify(spec)});
        return token ? { x: token.center.x, y: token.center.y } : null;
    })()`);
    if (!point) throw new Error(`no token named "${spec}" on the scene, and not an x,y pair`);
    return point;
}

/** The CSS pixel a world point is drawn at, in the viewport — what `Input.dispatchMouseEvent` takes. */
function toClient(page, point) {
    return page.eval(`(() => {
        const p = canvas.clientCoordinatesFromCanvas(${JSON.stringify(point)});
        // Not just on screen but clear of the edge band, where the placement pans the view under the pointer.
        const m = ${EDGE};
        const inside = p.x >= m && p.y >= m && p.x < innerWidth - m && p.y < innerHeight - m;
        // A window or a popped-out tracker over the point takes the click instead of the board.
        const top = inside ? document.elementFromPoint(p.x, p.y) : null;
        const cover = top && top !== canvas.app.view
            ? (top.closest(".application, .app, [id]")?.id || top.closest(".application, .app")?.className || top.tagName) : null;
        return { x: Math.round(p.x), y: Math.round(p.y), inside, cover };
    })()`);
}

/** What the standing placement would put down, or null when none is standing. */
function preview(page) {
    return page.eval(`(() => {
        const shape = canvas.regions.preview?.children?.[0]?.document?.shapes?.[0];
        if (!shape) return null;
        const { type, x, y, rotation, radius, length } = shape;
        return { type, x: Math.round(x), y: Math.round(y), rotation, radius, length,
                 mouse: { x: Math.round(canvas.mousePosition.x), y: Math.round(canvas.mousePosition.y) } };
    })()`);
}

async function moveTo(page, label, world) {
    const client = await toClient(page, world);
    if (!client.inside) throw new Error(`${label} (${world.x}, ${world.y}) is off-screen at (${client.x}, ${client.y})`);
    if (client.cover) throw new Error(`${label} (${world.x}, ${world.y}) is covered at (${client.x}, ${client.y}) by ${client.cover} — close it first`);
    await page.mouse("mouseMoved", client.x, client.y);
    await page.frames();
    return client;
}

async function main() {
    const page = await Page.connect();
    try {
        const apex = await resolve(page, option("apex"));
        const toward = await resolve(page, option("toward") ?? option("at"));
        if (!toward) throw new Error("say where to aim: --toward <point> (or --at <point> for a burst)");

        // Wait for the cast to put its placement down; it may still be asking "Confirm targets" or a variant.
        let standing = null;
        for (let i = 0; i < 40 && !standing; i++) {
            standing = await preview(page);
            if (!standing) await new Promise((r) => setTimeout(r, 250));
        }
        if (!standing) throw new Error("no area placement is standing — start the cast first, and do not await it");
        console.log(`placement  ${standing.type} at (${standing.x}, ${standing.y}), rotation ${standing.rotation}`);

        // Park the pointer mid-viewport before panning. PIXI re-sends `pointermove` every tick while the stage
        // moves under a still pointer, and each one reaches the placement's edge pan: a pointer left in a corner
        // drags the view into that corner, the moment `canvas.pan` moves it. It also wakes a canvas that sits at
        // 1 FPS until it sees pointer input.
        const viewport = await page.eval("({ w: innerWidth, h: innerHeight })");
        await page.mouse("mouseMoved", Math.round(viewport.w / 2), Math.round(viewport.h / 2));
        await page.frames();
        const centre = apex ? { x: (apex.x + toward.x) / 2, y: (apex.y + toward.y) / 2 } : toward;
        await page.eval(`canvas.pan(${JSON.stringify(centre)}); true`);
        await page.frames(3);

        if (apex) {
            const client = await moveTo(page, "apex", apex);
            await page.click(client.x, client.y);
            await page.frames();
            const fixed = await preview(page);
            console.log(`apex       fixed at (${fixed?.x}, ${fixed?.y}) — asked for (${apex.x}, ${apex.y})`);
        }

        const client = await moveTo(page, "aim", toward);
        // A second move a few pixels on, then back: some listeners only update on a change of position.
        await page.mouse("mouseMoved", client.x + 2, client.y);
        await page.frames();
        await page.mouse("mouseMoved", client.x, client.y);
        await page.frames();
        const aimed = await preview(page);
        console.log(`aimed      ${aimed.type} at (${aimed.x}, ${aimed.y}), rotation ${aimed.rotation}; `
            + `pointer reads (${aimed.mouse.x}, ${aimed.mouse.y}) — asked for (${toward.x}, ${toward.y})`);

        if (shotPath) {
            writeFileSync(shotPath, await page.screenshot());
            console.log(`screenshot ${shotPath}`);
        }
        if (dryRun) {
            console.log("dry run    placement left standing");
            return 0;
        }

        await page.click(client.x, client.y);
        await page.frames(3);
        const after = await preview(page);
        console.log(after ? "confirm    the placement is still standing — the click did not confirm it"
            : "confirm    placed");
        return after ? 1 : 0;
    } finally {
        page.close();
    }
}

try {
    process.exitCode = await main();
} catch (error) {
    console.error(error.message);
    process.exitCode = 1;
}

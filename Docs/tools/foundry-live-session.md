# Driving a live Foundry session

*The repeatable version of "open Foundry, open a debug Chrome, go to localhost:30000". Written so
neither a human nor an agent has to remember any of it again.*

---

## 1. Bring it up

```sh
npm run live            # starts whatever is not already running, then reports
npm run live:status     # reports only, starts nothing
```

`build/live-session.mjs` is idempotent: it starts the Foundry desktop app only if nothing answers on
`:30000`, and the debug Chrome only if nothing answers on `:9222`. Both checks are a real HTTP GET,
because **a CDP client reports "connected" even when no debug Chrome is listening** and that lie has
cost hours.

The debug Chrome gets its own profile (`%TEMP%\chrome-foundry-debug`), so the user's ordinary Chrome
is never involved and never needs restarting.

**The window is started at 1600×1000 on purpose.** Below 1024×768 Foundry never finishes
initialising, and the symptom is not a size warning — `CONFIG.PF2E` and `game.pf2e` come back
`undefined` and `CONFIG.Actor.documentClass` is core `Actor`, which reads exactly like this module
having broken the system.

## 2. Attach a driver

For an agent, the driver is the **chrome-devtools MCP** server against that port — not the
`claude-in-chrome` extension:

```sh
claude mcp add --transport stdio chrome-devtools -- npx -y chrome-devtools-mcp@latest --browserUrl=http://127.0.0.1:9222
```

Run that through a POSIX shell. PowerShell swallows the `--` separator and `claude mcp add` then fails
with `unknown option '-y'`.

## 3. Reach the world

If another world is already running you land on `/join`, not `/setup`. Get to `/setup` with the
page's own **Return to Setup** form, then launch the world by clicking its play control:

```js
document.querySelector('[data-package-id="pf"] a.control.play').click();
```

That control is a bare `<a>` with no text, so it does **not** appear in an accessibility snapshot;
selecting it by attribute is the reliable route. Then on `/join`, pick **Gamemaster** (world `pf` has
no password) and submit.

## 4. Sanity-check before trusting anything

```js
({ world: game.world.id, system: game.system.version, ready: game.ready,
   module: game.modules.get("isaacs-hb-pf2e").active,
   pf2e: !!CONFIG.PF2E })
```

`pf2e: false` means the window is too small. Resize and reload; do not start debugging content.

## 5. Running long jobs

`evaluate_script` has a **60-second protocol timeout**, and anything that opens a dialog blocks every
`await` behind it — which surfaces as a timeout, never as "a dialog is open". So long jobs are started
detached and polled:

```js
globalThis.__sb.run("name", async (rec) => { /* … rec.log.push(…) … */ return value; });
globalThis.__sb.peek("name");   // { state, error, log, value }
```

`build/live-session.mjs` does not install that helper — paste it once per session, or use the rig,
which owns the same problem:

```js
const api = game.modules.get("isaacs-hb-pf2e").api;
api.rig.installResolver(["Spirit Weapon (Blade)", "Soul Reaper", "Senbonzakura"]);  // answers ChoiceSets
await api.rig.run({ lineage: "Soul Reaper", spirit: "Senbonzakura" });
api.rig.clearResolver();
```

**Always install the ChoiceSet resolver before creating or levelling a Soulbound.** The class opens a
`PickAThingPrompt` for the spirit-weapon profile, the Lineage, the Spirit and every chosen kidō, and
each one blocks the levelling `await` indefinitely.

## 6. Rebuilding content mid-session

`npm run build` fails with `EPERM … rm packs` while a world is open — the pack LevelDB is locked.

```js
game.shutDown();      // returns to /setup; a POST of {action:"shutdown"} to /game does NOT
```

…then retry the build a couple of times, because the lock clears a second or two after the world
closes. Relaunching the world re-registers `module.json`'s homebrew traits, with no Foundry server
restart needed.

## 7. Test-actor gotchas

| Gotcha | Consequence |
| :-- | :-- |
| An actor created by a GM defaults to `alliance: "opposition"` | Every `affects: "enemies"` area catches nothing **and silently clears targets set by hand** — reads as the ability being broken. Always `actor.update({"system.details.alliance": "party"})` |
| NPC tokens are unlinked | Read `token.actor`, never `game.actors.getName()` |
| `showCheckDialogs` / `showDamageDialogs` user flags | Block scripted rolls |
| `game.user.updateTokenTargets` does not exist | Use `token.object.setTarget(true, { user, releaseOthers })` |
| `TokenDocument#x` is the **animated** position in v14 | Read `_source.x` for real coordinates |
| `toObject()` on a **compendium** document returns `rules` by reference | Editing it poisons the cached pack for the session. `foundry.utils.deepClone` it |
| `item.toMessage()` bypasses `spellcastingEntry.cast` | A *spell* posted that way skips area targeting; an *action* does not |

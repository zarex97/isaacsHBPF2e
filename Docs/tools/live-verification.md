# Live verification

*How a clause is driven: the rig, the world, and what counts as proof. Written so neither a human nor
an agent has to remember any of it again.*

The standard is stated in `Docs/soulbound-verification-checklist.md` §0 and it is short: **every
sentence in the guide should happen by itself.** "It is on the sheet" is not a pass. A row passes when
the number, the condition, the area, the frequency and the cost all arrive without a human remembering
them — which is why this is driven in a live world rather than read out of the JSON.

Filing rules — one finding per issue, one tracker per tier — live in `Docs/agents/issue-tracker.md`
and are not restated here.

---

## 1. Bring it up

```sh
npm run live            # starts Foundry if it is not already up, then reports
npm run live:status     # reports only, starts nothing
npm run live -- --devtools   # …and the debug Chrome, for the fallback driver only
```

`build/live-session.mjs` is idempotent: it starts the Foundry desktop app only if nothing answers on
`:30000`. Readiness is a real HTTP GET, because **a CDP client reports "connected" even when no debug
Chrome is listening** and that lie has cost hours.

**It deliberately does not start a browser.** See §2 for why the one it used to start was the wrong one.

## 2. The driver

### Primary — the Claude-in-Chrome extension

Open Foundry in a tab of **your own Chrome, on the profile signed in as `zarexlibertad@gmail.com`**.
That profile is the one carrying the extension, and the extension is the driver.

This matters more than it looks. `canvas.regions.placeRegion` registers its listeners on
`canvas.stage` and waits for `pointerdown`; a placement is confirmed by pointer input reaching PIXI's
federated event system. A browser started by a script gets a throwaway profile, and a throwaway profile
has no extension — which is exactly the trap `npm run live` used to set by starting one every time.

**Calibrate the pointer before using it.** The extension's coordinates are the **screenshot's**, not the
page's. A screenshot of a 2400-wide viewport comes back 1568 wide, so a CSS position has to be scaled:

```js
const K = { sx: 1568 / window.innerWidth, sy: 743 / window.innerHeight };
const ext = (worldX, worldY) => {
    const p = canvas.stage.worldTransform.apply({ x: worldX, y: worldY });
    return { x: Math.round(p.x * K.sx), y: Math.round(p.y * K.sy) };
};
```

Read the screenshot's own dimensions from the tool's result rather than hard-coding 1568×743; they
follow the window. Hovering at an uncalibrated coordinate lands the cursor hundreds of feet from where
you meant, and the only symptom is an area that catches the wrong tokens.

### Fallback — chrome-devtools MCP

For an unattended run, where no window is in focus and no real pointer exists:

```sh
npm run live -- --devtools
claude mcp add --transport stdio chrome-devtools -- npx -y chrome-devtools-mcp@latest --browserUrl=http://127.0.0.1:9222
```

Run that through a POSIX shell. PowerShell swallows the `--` separator and `claude mcp add` then fails
with `unknown option '-y'`.

**The debug window is started at 1600×1000 on purpose.** Below 1024×768 Foundry never finishes
initialising, and the symptom is not a size warning — `CONFIG.PF2E` and `game.pf2e` come back
`undefined` and `CONFIG.Actor.documentClass` is core `Actor`, which reads exactly like this module
having broken the system.

## 3. Reach the world

If another world is already running you land on `/join`, not `/setup`. Get to `/setup` with the page's
own **Return to Setup** form, then launch the world by clicking its play control:

```js
document.querySelector('[data-package-id="pf"] a.control.play').click();
```

That control is a bare `<a>` with no text, so it does **not** appear in an accessibility snapshot;
selecting it by attribute is the reliable route. Then on `/join`, pick **Gamemaster** (world `pf` has
no password) and submit.

Both halves are also a POST, which is faster from a script and survives a page that will not render:

```js
await fetch("/setup", { method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "launchWorld", world: "pf" }) });
await fetch("/join",  { method: "POST", headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ action: "join", userid: "<id>", password: "" }) });
```

The key is `world`, not `id` — `{action: "launchWorld", id: "pf"}` answers *"The requested world
undefined does not exist"*. Read the user id off `/join`'s own `select[name="userid"]`. If `/setup`
answers **403**, the admin session has lapsed: reload `/setup` in the tab and try again.

## 4. Sanity-check before trusting anything

```js
({ world: game.world.id, system: game.system.version, ready: game.ready,
   module: game.modules.get("isaacs-hb-pf2e").active,
   pf2e: !!CONFIG.PF2E })
```

`pf2e: false` means the window is too small. Resize and reload; do not start debugging content.

## 5. What a drive owes

The six marks are `Docs/soulbound-verification-checklist.md` §0's, and every clause tracker restates
them:

| Mark | Meaning |
| :-- | :-- |
| ☐ | Not yet driven |
| ✅ | Driven live; the clause happened by itself |
| ⚠️ | Driven live; partially happens — the gap is named in **Evidence** |
| ❌ | Driven live; does not happen |
| 🔧 | Was ❌ or ⚠️, a fix has landed, awaiting re-drive |
| — | Nothing to automate (pure roleplaying / GM ruling) |

### A control that cannot fail proves nothing

Every ✅ owes a **control**: the same measurement with the cause removed, showing the effect gone. An
observation on its own is compatible with the mechanism under test doing nothing at all.

Three from one week, each of which read as a pass until its control was run:

- **Zangetsu S-11a.** *"The damage die does not increase."* It did not — and the control showed Full
  Release's die step was not applying either, so the clause was satisfied by an accident. It took
  lifting the Shikai form as well before the two states separated: Full Release alone → d10, Full
  Release with Tensa → d8.
- **Senbonzakura S-07f.** The Senkei cage dropped a target outside it. It also dropped every target
  inside it, because `testPoint` was being called with two arguments and answering false for the whole
  board. A guard that refuses everyone looks exactly like a guard that works.
- **Ryūjin Jakka S-29b.** The ash grabbed nobody at the caster's turn end, which was the fix. It also
  grabbed nobody at the enemy's, which was not.

Write the control into the Evidence cell beside the result. *"D2 with `spirit 10` lost 32; the identical
dummy with no resistance lost 32; the same cast from a caster without Refined lost 0"* is evidence.
*"D2 lost 32"* is a number.

### A fix that reports itself as working

Prefer the measurement the rules actually consume over the one that is easy to read. Setting `ignored`
on a modifier inside `Check.roll` looked right, stamped its roll option on the message, and changed no
total — pf2e re-tests every predicate before the dice fall. The roll option said the feature had
worked. Only the DC said whether it had.

## 6. Traps

### The rig

| Trap | What it looks like |
| :-- | :-- |
| The extension's coordinates are the **screenshot's** | The cursor lands far from the target; an area catches the wrong tokens. See §2 |
| The extension's own click does not confirm a Region placement | The preview follows the cursor and never commits. Dispatch a synthetic `PointerEvent` at `canvas.app.view` instead — see §10 |
| `evaluate_script` has a **60-second** protocol timeout | Anything that opens a dialog blocks every `await` behind it and surfaces as a timeout, never as "a dialog is open". See §7 |
| `canvas.animatePan` never returns while a placement is standing | The script channel times out. `canvas.pan` returns immediately and is the one to use |

### The world

World `pf` is not a clean room. It is a working world with years of fixtures in it.

| Trap | What it looks like |
| :-- | :-- |
| Token `x`/`y` and `disposition` writes are **silently reverted** | A token you moved is back where it was, and an area you aimed catches the wrong creatures. `system.details.alliance` on the *actor* holds |
| An actor created by a GM defaults to `alliance: "opposition"` | Every `affects: "enemies"` area catches nothing **and silently clears targets set by hand**. Always `actor.update({"system.details.alliance": "party"})` |
| Fixtures carry state from the last drive | A "clean" heal that gives back nothing because the target is still wounded; a save that does not fire because the target still has last week's immunity marker. Strip what you are about to measure |
| A heightening clause needs a caster above 14th | Clone one rather than editing a level in place: re-levelling reopens every `ChoiceSet` the class ever asked |
| Test actors are misnamed | `ZZ Sev — Ryūjin Jakka` is an Arrogante. Check the spell list, not the name |
| The pack LevelDB is locked while a world is open | `npm run build` fails with `EPERM … rm packs`. See §8 |

### Foundry

| Trap | What it looks like |
| :-- | :-- |
| `Region#testPoint` takes **one** argument, `{x, y, elevation}` | A second argument is not ignored, it is *missing*: the elevation test reads `undefined` and the region answers false for every point on the board |
| A flag key containing a dot is a **path** | `setFlag(id, "k", {"abc.0": v})` stores `{abc: {0: v}}`, and the next read of `ledger["abc.0"]` is `undefined`. A counter that writes and never reads |
| `TokenDocument#x` is the **animated** position in v14 | Read `_source.x` for real coordinates |
| A compendium UUID needs the `_id`, not the name | `Compendium.pack.Item.Effect: Foo` does not resolve at runtime; the build rewrites names to ids at pack time, so content may say the name and a live patch may not |
| `toObject()` on a **compendium** document returns `rules` by reference | Editing it poisons the cached pack for the session. `foundry.utils.deepClone` it |
| Region creation validates the behavior subtype | A module subtype must be declared in `module.json` under `documentTypes.RegionBehavior` or creation throws `DataModelValidationError` |

### pf2e

| Trap | What it looks like |
| :-- | :-- |
| **Owned items are copies taken at grant time** | A content flag added today never reaches a character granted yesterday. Hit twice in one week — sync the owned copy by hand for the drive, and rebuild the pack before believing a negative |
| `damage-dice-faces` with `mode: "upgrade"` **latches** | `if (item.flags.pf2e.damageFacesUpgraded) return` — a second upgrade is a no-op, on the same effect or another. Two steps cannot be written as a rule element |
| `bypass.immunity.ignore` is a field pf2e **never reads** | `applyIWR` consults `resistance.ignore`, `resistance.redirect` and `immunity.redirect`, then settles immunity separately via `isAffectedBy`. Ignoring immunity has to shadow the target |
| An `Aura`'s `events` list is read **once** | Only to default `removeOnExit`. Effects are granted on contact, not at turn start or turn end — the module times those itself |
| `game.pf2e.Check.roll` re-tests every predicate | A modifier switched off before the call is switched back on before the dice fall. Correct the DC instead |
| `save-rolled` riders come from `pf2e-toolbelt.rollSave` | Which fires only from a **target row on the chat card**. An ad-hoc `actor.saves.reflex.roll()` fires nothing |
| `item.toMessage()` bypasses `spellcastingEntry.cast` | A *spell* posted that way skips area targeting; an *action* does not |
| `item.toMessage()` also **spends no frequency** | pf2e decrements `system.frequency.value` in `createUseActionMessage`, which only the two character sheets call. Driving an action by `toMessage()` leaves a once-per-day allowance untouched, and reads exactly like the class failing to count. Click `[data-action="use-action"]` on the sheet's own row instead |
| A **counted** frequency is not an **enforced** one | `createUseActionMessage` stops decrementing at zero and posts the card anyway. pf2e never refuses; whatever the card drives must check for itself |
| A predicate on a tag matches nothing on an **old** sheet | `otherTags` is copied at grant time like everything else, so a tag added to the pack later is absent — and a predicate that matches nothing does not complain, it simply never fires. `Release.repair` unions them back; run it before believing a rule element did nothing |
| `showCheckDialogs` / `showDamageDialogs` user flags | Block scripted rolls |
| `game.user.updateTokenTargets` does not exist | Use `token.object.setTarget(true, { user, releaseOthers })` |
| A damage card has **two** apply buttons | `data-action="applyDamage"` applies to the **selected** token; `data-action="target-applyDamage"` applies to the card's target. Driving a Strike leaves the *attacker* selected, so the first one damages the attacker and the target's hit points never move — which reads exactly like a resistance bypass that failed |
| A combatant ends its turn **once per round** | pf2e's `_onEndTurn` skips everything when `roundOfLastTurnEnd === context.round`, so `pf2e.endTurn` does not fire and nothing measured in turns advances. A rig that jumps `combat.turn` back and forth inside one round will watch a one-turn window never close. Advance the **round** first |
| A penalty of a type the target already has is **swallowed** | pf2e keeps only the worst modifier of each type. A −2 **circumstance** penalty to AC vanishes against a target that is already off-guard, and the reading looks exactly like a rule that failed. Probe with an `untyped` modifier first to tell the two apart |
| A rider fires only for the item that was **used** | `onActionUsed` reads `ridersOn(item)`, so a rider on feat A can never answer the use of item B. A permission that modifies another action belongs **on that action**, predicated on the feat — which is how Ghost Step went from never firing to firing |
| An effect has no `disabled` field | A pf2e Effect item's `system.expired` is derived in `prepareBaseData`, so writing either one is overwritten or ignored. To switch an effect off without deleting it, move its rules aside — see `soulbound/suppression.mjs` |

## 7. Running long jobs

Start detached and poll, because of the 60-second timeout above:

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

**Always install the ChoiceSet resolver before creating or levelling a Soulbound, and keep it installed
for as long as you keep changing the level.** The class opens a `PickAThingPrompt` for the spirit-weapon
profile, the Lineage, the Spirit and every chosen kidō, and each one blocks the levelling `await`
indefinitely. `rig.run` cleans up its own resolver, so a later `actor.update({level: 9})` outside it hits
"Kidō Learned (9th)" with nobody answering and the job simply stops — with no error, which reads exactly
like a hang. If one is already standing:

```js
[...foundry.applications.instances.values()]
    .find(a => a.constructor.name === "PickAThingPrompt")
    ?.element.querySelector("button.select-button")?.click();
```

**There are two prompt shapes, and the newer one has no `select-button`.** A Svelte `PickAThingPrompt`
carries a `button.sv-btn-indicator` per choice and a plain **Save** — a resolver written against the
older selector answers nothing there and the job hangs exactly as though none were installed. Worse, a
detached prompt (`rendered: false`) ignores both, and the only way out is
`close({force: true})` followed by `element.remove()`.

Nine of them stacked up in one session from a single `actor.update({level: 20})` on a clone, and every
symptom was somewhere else: three CDP timeouts, a world that would not finish launching, and a cast
that resolved `pending` forever with no error and no notification. **Check for a standing prompt before
believing any of those.**

```js
[...foundry.applications.instances.values()].filter((a) => a.constructor.name === "PickAThingPrompt")
```

**The selector is `button.select-button`.** `button[data-choice]` looks right and matches nothing — the
choices are Svelte-rendered buttons carrying no dataset at all, so a resolver written against
`data-choice` silently answers nothing and the job hangs exactly as though no resolver were installed.

A `DialogV2` that will not submit to a click will submit to its own form:

```js
const btn = dialog.querySelector('button[data-action="confirm"]');
btn.closest("form").requestSubmit(btn);
```

**Reset the release ledger before measuring anything that Releases repeatedly.** The first Release each
encounter is free and the next costs a Reiatsu Point, so after a dozen scripted cycles `release()` starts
returning `false` on an empty pool — correct behaviour that reads as a broken ladder:

```js
await actor.update({ "flags.isaacs-hb-pf2e.releaseLedger": { encounter: null, releases: 0 } });
```

## 8. Rebuilding content mid-session

`npm run build` fails with `EPERM … rm packs` while a world is open — the pack LevelDB is locked.

```js
game.shutDown();      // returns to /setup; a POST of {action:"shutdown"} to /game does NOT
```

…then retry the build a couple of times, because the lock clears a second or two after the world
closes. Relaunching the world re-registers `module.json`'s homebrew traits and its
`documentTypes`, with no Foundry server restart needed — which is the only way to pick up a new
one, so a trait or a RegionBehavior subtype added today will not exist until the world has been
relaunched.

**`check:roundtrip` reports hundreds of false differences after a session.** Every document comes back
"differs at `folder`, `sort`, `ownership`" — 529 of them, with no content change behind any of them.
Foundry normalises those fields into the LevelDB when a world loads an unlocked pack, so the check is
comparing the content against a pack the *application* last wrote. A plain `npm run build` restores it.
Rebuild before believing a round-trip failure that names fields nobody authored.

## 9. Casting without aiming

**An emanation needs no click.** It is centred on the caster's own space, so `placeArea` builds it and
returns; all you answer is the "Confirm targets" `DialogV2`:

```js
const dlg = [...foundry.applications.instances.values()]
    .find(a => a.constructor.name === "DialogV2" && /Confirm targets/i.test(a.title ?? ""));
dlg?.element.querySelector('button[data-action="confirm"]')?.click();
```

For everything else, the cheapest honest route is to skip aiming and target by hand through the
module's own setting:

```js
globalThis.__castOn = async (spell, tokens) => {
    const was = game.settings.get("isaacs-hb-pf2e", "areaTargeting");
    await game.settings.set("isaacs-hb-pf2e", "areaTargeting", false);   // configFor returns null
    try {
        [...game.user.targets].forEach(t => t.setTarget(false, { releaseOthers: false }));
        for (const t of tokens) t.setTarget(true, { user: game.user, releaseOthers: false });
        await spell.spellcasting.cast(spell, { message: true });
        await new Promise(r => setTimeout(r, 2500));
    } finally { await game.settings.set("isaacs-hb-pf2e", "areaTargeting", was); }
};
```

That splits the work honestly: **area targeting itself is proven on emanations**, which need no click,
and everything downstream of it — the Reiatsu cost, the charge spend, the save, the riders, the
damage — is proven this way on every shape. It is the right route whenever the clause under test is
downstream of the aim.

## 10. Aiming a line, a cone or a placed burst

When the clause *is* the aim, it can be driven. This section used to say it could not; four things were
tried and the fourth works.

| Attempt | Result |
| :-- | :-- |
| `canvas.animatePan` to the target, then synthetic pointer events | The pan is **refused while a placement is standing**, so the click lands wherever the view already was |
| The extension's own `left_click` at the target | The preview follows the cursor and the placement never commits |
| Stub `canvas.regions.placeRegion` to return the region immediately | Turns `AreaTargeting.run`'s re-aim loop into an **infinite** one: the loop `continue`s whenever the range check fails, and with an instant stub it never yields |
| **A synthetic `PointerEvent` dispatched at `canvas.app.view`** | Commits the placement |

`placeRegion` registers `pointermove` and `pointerdown` on `canvas.stage`, and PIXI federates those
from DOM events on the canvas element. So the event has to be constructed and dispatched there:

```js
const view = canvas.app.view;
const send = (type, x, y) => view.dispatchEvent(new PointerEvent(type, {
    clientX: x, clientY: y, button: 0, buttons: type === "pointerdown" ? 1 : 0,
    pointerId: 1, pointerType: "mouse", isPrimary: true, bubbles: true, cancelable: true, view: window,
}));
send("pointermove", cssX, cssY);   // let canvas.mousePosition settle before confirming
await new Promise(r => setTimeout(r, 250));
send("pointerdown", cssX, cssY);
send("pointerup",   cssX, cssY);
```

Those are **CSS** pixels — `canvas.stage.worldTransform.apply(...)` straight through, with no screenshot
scaling, because they go to the DOM rather than to the extension. Check `canvas.mousePosition` against
the world point you meant before sending `pointerdown`; if it is wrong the aim is wrong and the
placement will be too.

Two more things about the placement loop:

- **The Regions layer must be active.** `canvas.regions.activate()` first; a click that lands on the
  token layer does nothing, and activating the layer *during* a placement cancels it.
- **Unpause.** A placement confirmed while the game is paused behaves inconsistently.

**If a placement does get stuck**, Escape usually clears it; reloading the page always does. A stuck
placement makes the *next* cast look broken, so check `canvas.regions.preview.children.length` before
believing a failure.

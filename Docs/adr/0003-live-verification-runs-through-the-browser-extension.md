# Live verification runs through the browser extension

Clauses are driven in world `pf` through the **Claude-in-Chrome extension**, in a tab of the user's own
Chrome on the profile signed in as `zarexlibertad@gmail.com`. **chrome-devtools MCP** against a debug
Chrome on `:9222` stays supported as the fallback for unattended runs.

This reverses what that doc said in bold before it was renamed (`foundry-live-session.md`) — *"the driver is the
chrome-devtools MCP server against that port — **not** the `claude-in-chrome` extension"* — and it is
written down because the tooling still points the other way in one visible place: `npm run live` used
to start a debug Chrome every time, and a reader finding that would reasonably conclude devtools MCP is
the intended path.

## Why

An aimed area is confirmed by pointer input. `canvas.regions.placeRegion` registers `pointermove` and
`pointerdown` on `canvas.stage`, and PIXI federates those from DOM events on the canvas element. The
extension drives a real browser the user is looking at, which is the cheapest way to produce that
input and the only way to produce it interactively.

The trade-off runs the other way for long jobs. devtools MCP needs no window in focus, survives the
user working elsewhere, and is the right driver for a sweep nobody is watching. It cannot aim, so it
casts against hand-picked targets with the module's own `areaTargeting` setting off — which is honest
for every clause downstream of the aim, and useless for the aim itself.

Neither is strictly better. Naming one primary and one fallback records which problem each solves.

## Consequences

- **`npm run live` starts Foundry and stops.** The debug Chrome moved behind `--devtools`. A browser
  started by the script gets a throwaway profile (`%TEMP%\chrome-foundry-debug`) and therefore has no
  extension in it — starting one by default was pointing every drive at the wrong window.
- **The profile is part of the contract.** The extension lives on one Chrome profile; a tab opened
  anywhere else is not the driver, and the symptom is the tool answering normally while the clicks go
  nowhere.
- **The extension's pointer needs calibrating.** Its coordinates are the screenshot's, not the page's.
  This is a property of the driver, not of Foundry, and it moves with the window — `live-verification.md`
  §2 carries the conversion.
- **A synthetic `PointerEvent` at `canvas.app.view` is still needed** to commit a placement; the
  extension's own click does not. So "use the extension" is the necessary half, not the whole of it.
- `Docs/soulbound-verification-checklist.md` §18 recorded *"a synthetic `pointerdown` does not confirm
  the placement"* as settled. That was wrong about **where**, not about what, and is corrected in place
  rather than deleted — the three routes that failed are still worth knowing.

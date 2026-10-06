# Generic automation lives in isaacs-pf2e-automation

Area targeting, the single-wrap pipelines (cast, `toMessage`, damage, check, reroll, character
preparation, detection modes) and the allowance fixes (a spell's frequency, the zero-uses guard, interval
recharges) moved out of this module into **Isaac's PF2e Automation** (`zarex97/isaacs-pf2e-automation`),
a module of its own that this one requires. What stayed here is everything that knows a class: the
Techniques, the Sky, the riders, the rigs, and every stage and registration the classes make.

## Why

The automation was never about four homebrew classes. It is what a pf2e table wants for vanilla content too
— a Fireball aimed rather than eight tokens clicked, a once-per-round spell that is actually once per round
— and as long as it lived here it shipped only with the Saint and the Soulbound, and grew homebrew
assumptions (a "Techniques only" setting, Stargazer slugs in the frequency guard, the Sky inside heightening).
Split out, it can serve vanilla content and other modules, and this module becomes its first consumer.

The split was staged so behaviour never changed in one step: registries replaced calls by name (#131), the
code moved into a folder behind one door (#132), the library was released from that folder (1.0.0), and
then this module switched over.

## Consequences

- **One door.** The classes reach the automation only through `scripts/automation.mjs`, whose exports are
  lazy facades over `game.modules.get("isaacs-pf2e-automation").api`. `build/test-riders.mjs` fails on any
  other import of the automation and on any `wrap()` in this repo (the automation's ADR 0001: it owns every
  wrap).
- **Start-up follows the automation.** This module's `init` work runs on the automation's
  `isaacs-pf2e-automation.init` hook, which fires inside the automation's own `init` once the API is
  published — Foundry does not order two modules' `init` hooks.
- **Authored config stays where it is.** The 113 items carrying `flags["isaacs-hb-pf2e"].areaTargeting`, and
  every copy on a character, are read through a registered flag scope; nothing was rewritten.
- **Settings moved.** Area targeting's four settings are the automation's now. A one-time migration on
  `ready` copies the values a world and each client had chosen (`scripts/migration.mjs`), mapping the old
  "Techniques only" scope to `registered`.
- **Tests run against the required version.** Offline tests build the automation's API from its sources —
  the sibling checkout locally, the `compatibility.minimum` tag in CI — so a new API must be released there
  before it is used here.
- **Shared docs live there.** The live-verification rig and the Foundry traps are in the automation's
  `Docs/tools/`; `CLAUDE.md` imports them.

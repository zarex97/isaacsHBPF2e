# The rider engine lives in the automation

The rider engine moved into **Isaac's PF2e Automation** in its 1.1.0, with the Regions it leaves behind:
lingering areas, overlap and enemies-only terrain. This module requires 1.1.0 and keeps only what knows a
class. That is the content's riders, and the registrations in `scripts/riders-extensions.mjs`: Libra's
`equip` and the Soulbound's `charge` apply types, the class DCs (`cosmo`, `reiatsu`, `class`), the Quincy's
counteract, Long Now, the Saint's teleport refusals, Senbonzakura's anchors and the terrain aura's origin
flag.

It amends ADR 0005, which kept the riders here.

## Why

The engine was generic except for the branches each class had cut into it. Those became registrations
first (#134), then the engine was staged behind the door (#135), then it moved. Each step was driven live.
The reasons in 0005 apply unchanged: vanilla content wants riders as much as these classes do, and one
engine per world is the only safe number.

## The cut-over

- The staged copy in `scripts/automation/` is gone. `ridersApi()` is `automation()`.
- `module.json` drops `socket` and `documentTypes`. The relay and the Region behavior types are the
  automation's.
- A one-time GM migration, versioned by the `ridersCarried` world flag:
  - carries the `riders`, `automateDeath` and `banishments` settings across, where the automation has
    none stored;
  - recreates every `isaacs-hb-pf2e.lingering` / `.enemyMovementCost` Region behavior, on every scene,
    under the automation's type id. Until then Foundry cannot load them.
- Roll options and hooks the engine emits carry the automation's id:
  - `isaacs-pf2e-automation:counteract`, read by Cobalt and the Assimilator rig;
  - `isaacs-pf2e-automation:rider-save`;
  - `isaacs-pf2e-automation.counteracted`, heard by Purple.
- Content keeps authoring riders under this module's id. The automation reads it through the flag scope
  registered at start-up. What the engine writes (receipts, ledgers, the armed Strike, escape actions) is
  under the automation's id, and it reads what this module wrote before the upgrade until its 2.0.0.

## Consequences

- An automation below 1.1.0 next to this module runs no riders. Foundry's dependency check says why.
- An automation at 1.1.0 next to a homebrew below 1.1.0 stands its own engine down, so two engines never run.
- A new rider apply type, DC word or counteract stage for a class is a registration here. A generic one is
  an API change in the automation first.

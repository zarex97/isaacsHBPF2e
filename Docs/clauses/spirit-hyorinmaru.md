# Clauses — ❄ Hyōrinmaru

*Spirit tracker. Every independently-failable declaration the guide makes about Hyōrinmaru, one row
each. Source: `Docs/soulbound-guide-v1.md` v1.4 §7A (Hyōrinmaru) and §9.1 (Hyōten Hyakkasō).*

**Lineage:** Soul Reaper · **Ladder:** Shikai → Bankai · **Tracker issue:** #51

---

## How a row is marked

| Mark | Meaning |
| :-- | :-- |
| ☐ | Not yet driven |
| ✅ | Driven live; the clause happened by itself |
| ⚠️ | Driven live; partially happens — the gap is named in **Evidence** |
| ❌ | Driven live; does not happen |
| 🔧 | Was ❌ or ⚠️, a fix has landed, awaiting re-drive |
| — | Nothing to automate (pure roleplaying / GM ruling) |

**Clause** is a verbatim fragment of the guide. `build/check-clauses.mjs` asserts it still is one, so
a paraphrase here or an edit to the guide fails the build.

**Static check** names the assertion in `build/test-soulbound.mjs` or `build/test-riders.mjs` that
guards the clause against a later edit. **Evidence** names what proved it happened at the table. A
clause needs both: live evidence alone rots the moment someone edits the JSON, and a static check
alone can assert a broken spelling.

A row inherits its ✅ only where the old checklist's evidence names *that* clause. Siblings of a
split row start ☐ even when the row they came from passed.

---

## Shikai (1st) — guide §7A Hyōrinmaru

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-14a | Shikai Form | Your damage type becomes cold | | ✅ | Damage type becomes cold (ported from S-14) |
| S-14b | Shikai Form | you may still choose spirit | | ☐ | |
| S-14c | Shikai Form | On a critical hit, the target takes a −5-foot status penalty to its Speeds until the end of your next turn | | ✅ | A critical hit applies `Effect: Frosted Stride` through a `strike-resolved` rider (ported from S-14) |

## Release Technique — Ryūsenka (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-15a | Ryūsenka | Make a Strike with your spirit weapon | | ☐ | |
| S-15b | Ryūsenka | On a hit it deals an additional 1d6 cold damage | | ☐ | |
| S-15c | Ryūsenka | the target must succeed at a Fortitude save or be immobilized in ice until the end of its next turn | | ☐ | |
| S-15d | Ryūsenka | Escape vs. your Reiatsu DC | | 🔧 | Fixed under #43: the condition rider's `escapeDc` now grants a real Escape action at the caster's Reiatsu DC. Driven live on 19 Sep 2026 — awaiting a drive through the Technique itself rather than the rider |
| S-15e | Ryūsenka | On a critical hit the ice shatters: the target instead takes an additional 2d6 cold | | ☐ | |
| S-15f | Ryūsenka | is off-guard until the end of its next turn | | ☐ | |
| S-15g | Ryūsenka | Heightened (+2) +1d6 | | ☐ | |

## Refined (9th) — Guncho Tsurara

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-16a | Guncho Tsurara | Ryūsenka can instead be made as a ranged Strike against a target within 60 feet | | ☐ | |
| S-16b | Guncho Tsurara | it returns to your hand immediately | | ☐ | |

## Bankai — Daiguren Hyōrinmaru (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-17a | Bankai | You gain a fly Speed equal to your Speed | | ✅ | A fly Speed matching land Speed, authored as a rule element (ported from S-17) |
| S-17b | Bankai | cold resistance equal to your level | | ✅ | `Resistance` cold = `@actor.level` (ported from S-17) |
| S-18a | Bankai | Three four-petaled ice flowers hang in the air behind you | | ✅ | **SB-18.** Three petals spend one at a time down to zero and the Bankai survives; a fourth is refused *"not enough charges"* (ported from S-18) |
| S-18b | Bankai | They are not a timer on the Bankai | | — | A statement about what the petals are not. Proved by S-18a: the Bankai survives the third spend |
| S-18c | Bankai | Once per round you may spend one petal-flower | | ✅ | A second spend in the same round is refused *"already spent this round"* (ported from S-18) |

## Petal options (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-19a | Sennen Hyōrō | Four walls of ice erupt in a 20-foot burst within 60 feet | | ⚠️ | Authored as a 20-ft burst within 60 ft; the area is not yet driven (ported from S-19) |
| S-19b | Sennen Hyōrō | Each enemy in the area attempts a Reflex save | | ☐ | |
| S-19c | Sennen Hyōrō | on a failure it takes 5d6 cold damage | | ☐ | |
| S-19d | Sennen Hyōrō | is immobilized until the end of its next turn | | ☐ | |
| S-19e | Sennen Hyōrō | on a critical failure it is restrained for 1 minute instead | | ☐ | |
| S-19f | Sennen Hyōrō | Escape vs. your Reiatsu DC | | 🔧 | Fixed under #43. Driven live on 19 Sep 2026 at the caster's own Reiatsu DC via the rider; awaiting a drive through the Technique |
| S-19g | Sennen Hyōrō | Heightened (+1) +1d6 | | ☐ | |
| S-20a | Hyōryū Senbi | 60-foot line, basic Reflex, 5d6 cold damage | | ✅ | The card posts a 60-foot line, basic Reflex; the cast spends one petal and one Reiatsu Point (ported from S-20) |
| S-20b | Hyōryū Senbi | creatures that fail are slowed 1 until the end of their next turn | | ☐ | |
| S-20c | Hyōryū Senbi | Heightened (+1) +1d6 | | ☐ | |
| S-21a | Zanhyō Ningyō | Trigger you are hit by an attack | | ⚠️ | Authored as a `damage-applied` reaction, which fires on damage rather than on the hit (ported from S-21) |
| S-21b | Zanhyō Ningyō | Reduce the damage by an amount equal to twice your level | | ⚠️ | Granted as `Effect: Remnant Ice Doll`, resistance to all damage `@actor.level*2`; not yet driven (ported from S-21) |
| S-21c | Zanhyō Ningyō | the doll shatters | | ☐ | |

## Perfected Bankai (17th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-22a | Perfected Bankai | restores one spent petal-flower at the start of each of your turns | | ✅ | A turn start at 13th gives nothing back; at 17th the pool climbs 1 → 2 → 3 and stops at three. Declared on the effect (`chargeRefresh`) (ported from S-22) |

## Severing Art — Hyōten Hyakkasō (guide §9.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-13a | Hyōten Hyakkasō | 30-foot emanation, basic Fortitude, cold | | ✅ | Ported from R-13: the shape and save were right when driven |
| R-13b | Hyōten Hyakkasō | Creatures that fail are restrained in a pillar of ice | | ✅ | Ported from R-13 |
| R-13c | Hyōten Hyakkasō | Escape vs. your Reiatsu DC | | 🔧 | Fixed under #43. The restrained rider's `escapeDc` now grants a real Escape; awaiting a re-drive through the Art |
| R-13d | Hyōten Hyakkasō | take 4d6 persistent cold | | ✅ | Ported from R-13 |
| R-13e | Hyōten Hyakkasō | that allows no flat check to end while restrained | | 🔧 | The flat check is now one no d20 reaches (ported from R-13, awaiting re-drive) |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 17 |
| ✅ | 11 |
| ⚠️ | 3 |
| ❌ | 0 |
| 🔧 | 4 |
| — | 1 |
| **Total** | **36** |

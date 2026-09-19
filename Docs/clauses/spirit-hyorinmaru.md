# Clauses — ❄ Hyōrinmaru

*Spirit tracker. Every independently-failable declaration the guide makes about Hyōrinmaru, one row
each. Source: `Docs/soulbound-guide-v1.md` v1.4 §7A (Hyōrinmaru) and §9.1 (Hyōten Hyakkasō).*

**Lineage:** Soul Reaper · **Ladder:** Shikai → Bankai · **Tracker issue:** #51

**Open findings:** [#52 SB-48](../../issues/52) Spirit-Cutting is prose · [#53 SB-49](../../issues/53) Strike Techniques fire free · [#54 SB-50](../../issues/54) Ryūsenka's critical die · [#55 SB-51](../../issues/55) rider durations end a turn early

**Four clauses still undriven, and the three gates are now behind us.**

The area Techniques drive end to end through the Claude Chrome extension. Three things had to be
true at once, and each one looked like the whole problem until the next appeared: real pointer input
reaches the PIXI stage where a synthetic `PointerEvent` does not; the caster must be **party**-aligned
for an `enemies` area to catch anything, so drives use `ZZ SR — Hyorinmaru` rather than the
opposition-aligned `123`; and the confirming click places the area **where the preview sits**, so the
cursor has to be moved and read back through `canvas.mousePosition` before clicking.

What remains is not the harness. **S-19g** and **S-20c** are the two heightening clauses: a cast
ignores an explicit `rank` argument and uses the auto-heighten rank, which for a 13th-level Soulbound
is the spell's own base rank 7, where no interval applies. Proving them needs a caster above 14th who
is also party-aligned. **S-16b** and **S-21c** are the returning blade and the shattering doll, both
cosmetic riders with no sheet effect to read.

*Harness notes for the next drive.* `canvas.pan` returns immediately where `canvas.animatePan` times
out the extension's script channel. Token disposition writes are silently reverted in this world —
the update resolves without error and the value does not change — so pick a caster whose alliance
already fits rather than editing the dummies.

---

## Shikai (1st) — guide §7A Hyōrinmaru

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-14a | Shikai Form | Your damage type becomes cold |  | ✅ | Live 19 Sep 2026: `Spirit Weapon (Blade)` reads `damageType: cold` through an `ItemAlteration` override on the Shikai effect |
| S-14b | Shikai Form | you may still choose spirit |  | ❌ | **SB-48.** There is no way to choose spirit. All four weapon profiles carry `rules: []` and Spirit-Cutting exists only in the blade's description; the Shikai override is unconditional. See #52 |
| S-14c | Shikai Form | On a critical hit, the target takes a −5-foot status penalty to its Speeds until the end of your next turn |  | ✅ | Live: a critical hit on D1 applied `Effect: Frosted Stride` through the `strike-resolved` rider |

## Release Technique — Ryūsenka (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-15a | Ryūsenka | Make a Strike with your spirit weapon |  | ✅ | Live: the card posts *Range melee; Targets 1 creature* and the Strike that follows carries the rider |
| S-15b | Ryūsenka | On a hit it deals an additional 1d6 cold damage |  | ✅ | Live: `Roll Damage` posted **5d6 cold** at rank 9 — 1d6 base plus four heightening intervals |
| S-15c | Ryūsenka | the target must succeed at a Fortitude save or be immobilized in ice until the end of its next turn |  | ⚠️ | Live: a failed Fortitude save at DC 33 applied **Immobilized** plus `Ryūsenka: Immobilized`. The duration is authored `1 round, expiry turn-start`, which ends at the start of its next turn rather than the end — the clause says *the end of its next turn* |
| S-15d | Ryūsenka | Escape vs. your Reiatsu DC |  | ✅ | Live: `Escape Ryūsenka` was granted to D1 at **DC 33**, the caster's own Reiatsu DC. Fixed under #43 |
| S-15e | Ryūsenka | On a critical hit the ice shatters: the target instead takes an additional 2d6 cold |  | ❌ | **SB-50.** The critical hit's extra die does not exist. The spell carries one damage entry of `1d6` and its riders add only off-guard on a critical success — nothing replaces 1d6 with 2d6. See #54 |
| S-15f | Ryūsenka | is off-guard until the end of its next turn |  | ✅ | Live: a critical hit applied `Ryūsenka: Off-Guard` to D1 |
| S-15g | Ryūsenka | Heightened (+2) +1d6 |  | ✅ | Live: `heightening` is `interval 2, +1d6`, and the rank-9 cast rolled 5d6 |

## Refined (9th) — Guncho Tsurara

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-16a | Guncho Tsurara | Ryūsenka can instead be made as a ranged Strike against a target within 60 feet |  | ⚠️ | Implemented as the `thrown-60` trait, predicated on `feature:refined-release`. Live: the strike offers an altUsage with **range increment 60, max 360**. The clause says *within 60 feet*; thrown-60 allows 360 at a penalty instead of forbidding it |
| S-16b | Guncho Tsurara | it returns to your hand immediately |  | ☐ |  |

## Bankai — Daiguren Hyōrinmaru (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-17a | Bankai | You gain a fly Speed equal to your Speed |  | ✅ | Live at 17th: `fly` Speed 25 matching land Speed 25, breakdown *25-Foot Fly Speed (Daiguren Hyōrinmaru)* |
| S-17b | Bankai | cold resistance equal to your level |  | ✅ | Live at 17th: `resistances` reads **cold 17** |
| S-18a | Bankai | Three four-petaled ice flowers hang in the air behind you |  | ✅ | Live: the Bankai effect's badge is a counter at **3 / 3**. **SB-18** — three petals spend down to zero and the Bankai survives |
| S-18b | Bankai | They are not a timer on the Bankai |  | — | A statement about what the petals are not. Proved by S-18a: the Bankai survives the third spend |
| S-18c | Bankai | Once per round you may spend one petal-flower |  | ✅ | Live: one cast spends one petal (3 → 2); a second cast in the same round posts nothing and spends nothing |

## Petal options (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-19a | Sennen Hyōrō | Four walls of ice erupt in a 20-foot burst within 60 feet |  | ✅ | Live 19 Sep 2026: the card posts **Range 60 feet; Area 20-foot burst, Defense basic Reflex**, and the placed burst caught three enemies |
| S-19b | Sennen Hyōrō | Each enemy in the area attempts a Reflex save |  | ✅ | Live: D1, D2 and ZZ Victim each rolled a Reflex save at **DC 27**, the caster's Reiatsu DC — 20, 30 and 17 |
| S-19c | Sennen Hyōrō | on a failure it takes 5d6 cold damage |  | ✅ | Live: **5d6 cold**. The basic-save ladder applied on the card — D2 succeeded and took half, ZZ Victim critically failed and took double |
| S-19d | Sennen Hyōrō | is immobilized until the end of its next turn |  | ⚠️ | Live: D1's failure applied **Immobilized** plus `Sennen Hyōrō: Immobilized`. The effect expires `1 round, turn-start`, which ends at the start of its next turn rather than the end. **SB-51**, see #55 |
| S-19e | Sennen Hyōrō | on a critical failure it is restrained for 1 minute instead |  | ✅ | Live: ZZ Victim rolled 17 against DC 27, a critical failure, and took **Restrained** for a duration of `1 minute` instead of the failure's immobilize |
| S-19f | Sennen Hyōrō | Escape vs. your Reiatsu DC |  | ✅ | Live: `Escape Sennen Hyōrō` granted at **DC 27**, the caster's own Reiatsu DC |
| S-19g | Sennen Hyōrō | Heightened (+1) +1d6 |  | ☐ |  |
| S-20a | Hyōryū Senbi | 60-foot line, basic Reflex, 5d6 cold damage |  | ✅ | Live: the card posts **Range 60 feet; Area 60-foot line, Defense basic Reflex**, the line placed and caught two enemies, and damage rolled **5d6 cold** |
| S-20b | Hyōryū Senbi | creatures that fail are slowed 1 until the end of their next turn |  | ⚠️ | Live: Phantom Knight and `ar` both failed at DC 27 and took `Hyōryū Senbi: Slowed 1`. Same duration gap as S-19d — `turn-start` where the guide says the end of its next turn. **SB-51** |
| S-20c | Hyōryū Senbi | Heightened (+1) +1d6 |  | ☐ |  |
| S-21a | Zanhyō Ningyō | Trigger you are hit by an attack |  | ⚠️ | Authored as a `damage-applied` reaction, which fires on damage rather than on the hit (ported from S-21) |
| S-21b | Zanhyō Ningyō | Reduce the damage by an amount equal to twice your level |  | ⚠️ | Granted as `Effect: Remnant Ice Doll`, resistance to all damage `@actor.level*2`; not yet driven (ported from S-21) |
| S-21c | Zanhyō Ningyō | the doll shatters |  | ☐ |  |

## Perfected Bankai (17th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-22a | Perfected Bankai | restores one spent petal-flower at the start of each of your turns |  | ✅ | Live at 17th: the petal pool returned to **3** at the start of each of three consecutive rounds. Declared on the effect (`chargeRefresh`), gated on `feature:perfected-full-release` |

## Severing Art — Hyōten Hyakkasō (guide §9.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-13a | Hyōten Hyakkasō | 30-foot emanation, basic Fortitude, cold |  | ✅ | Ported from R-13: the shape and save were right when driven |
| R-13b | Hyōten Hyakkasō | Creatures that fail are restrained in a pillar of ice |  | ✅ | Ported from R-13 |
| R-13c | Hyōten Hyakkasō | Escape vs. your Reiatsu DC |  | 🔧 | Fixed under #43. The restrained rider's `escapeDc` now grants a real Escape; awaiting a re-drive through the Art |
| R-13d | Hyōten Hyakkasō | take 4d6 persistent cold |  | ✅ | Ported from R-13 |
| R-13e | Hyōten Hyakkasō | that allows no flat check to end while restrained |  | 🔧 | The flat check is now one no d20 reaches (ported from R-13, awaiting re-drive) |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 4 |
| ✅ | 21 |
| ⚠️ | 6 |
| ❌ | 2 |
| 🔧 | 2 |
| — | 1 |
| **Total** | **36** |

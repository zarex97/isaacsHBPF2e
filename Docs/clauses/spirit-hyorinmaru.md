# Clauses — ❄ Hyōrinmaru

*Spirit tracker. Every independently-failable declaration the guide makes about Hyōrinmaru, one row
each. Source: `Docs/soulbound-guide-v1.md` v1.4 §7A (Hyōrinmaru) and §9.1 (Hyōten Hyakkasō).*

**Lineage:** Soul Reaper · **Ladder:** Shikai → Bankai · **Tracker issue:** #51

**Findings raised and fixed here:** [#52 SB-48](../../issues/52) Spirit-Cutting was prose ·
[#54 SB-50](../../issues/54) Ryūsenka's critical die · [#55 SB-51](../../issues/55) rider durations ended a
turn early. **Still open:** [#53 SB-49](../../issues/53) Strike Techniques fire on every Strike, which is
class-tier and not a Hyōrinmaru clause.

**Every clause is ✅ or `—`.** Thirty-five of thirty-six happen by themselves in world `pf`; the one
`—` is a sentence about what the petal-flowers are *not*, proved by the clause above it.

The last two took a fixture. Sennen Hyōrō's and Hyōryū Senbi's heightening cannot be exercised below
15th level — a focus spell caps at half the caster's level and their base rank is 7 — and the world had
no party-aligned Hyōrinmaru above 13th. **`ZZ Fix — Hyōrinmaru 17`** is a clone of `ZZ SR — Hyorinmaru`
at level 17, party-aligned, and it casts both at rank 9 for **7d6**. Keep it: the same wall stands in
front of every Spirit's heightening clauses.

## How a row is marked

| Mark | Meaning |
| :-- | :-- |
| ☐ | Not yet driven |
| ✅ | Driven live; the clause happened by itself |
| ⚠️ | Driven live; partially happens — the gap is named in **Evidence** |
| ❌ | Driven live; does not happen |
| 🔧 | Was ❌ or ⚠️, a fix has landed, awaiting re-drive |
| — | Nothing to automate (pure roleplaying / GM ruling) |

**Clause** is a verbatim fragment of the guide. `build/check-clauses.mjs` asserts it still is one, so a
paraphrase here or an edit to the guide fails the build. **Static check** names the assertion that guards
it; **Evidence** names what proved it happened at the table.

*Harness notes.* Drive through the Claude Chrome extension: real pointer input is what
`canvas.regions.placeRegion` accepts. Cast from a **party**-aligned actor or an `enemies` area catches
nobody. `canvas.pan` returns immediately where `canvas.animatePan` times out the script channel. Token
disposition writes are silently reverted in this world; `system.details.alliance` on the actor is not.
---

## Shikai (1st) — guide §7A Hyōrinmaru

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-14a | Shikai Form | Your damage type becomes cold |  | ✅ | Live 19 Sep 2026: `Spirit Weapon (Blade)` reads `damageType: cold` through an `ItemAlteration` override on the Shikai effect |
| S-14b | Shikai Form | you may still choose spirit |  | ✅ | **SB-48 fixed.** All four weapon profiles carry `versatile-spirit`. Live: in Shikai the Strike offers `cold / piercing / spirit`, so the damage-type override no longer stamps on the choice |
| S-14c | Shikai Form | On a critical hit, the target takes a −5-foot status penalty to its Speeds until the end of your next turn |  | ✅ | Live: a critical hit on D1 applied `Effect: Frosted Stride` through the `strike-resolved` rider |

## Release Technique — Ryūsenka (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-15a | Ryūsenka | Make a Strike with your spirit weapon |  | ✅ | Live: the card posts *Range melee; Targets 1 creature* and the Strike that follows carries the rider |
| S-15b | Ryūsenka | On a hit it deals an additional 1d6 cold damage |  | ✅ | Live: `Roll Damage` posted **5d6 cold** at rank 9 — 1d6 base plus four heightening intervals |
| S-15c | Ryūsenka | the target must succeed at a Fortitude save or be immobilized in ice until the end of its next turn |  | ✅ | Live: a failed Fortitude save applied **Immobilized**, and the effect now reads `1 round, turn-end` — the end of its next turn, not the start. **SB-51 fixed** |
| S-15d | Ryūsenka | Escape vs. your Reiatsu DC |  | ✅ | Live: `Escape Ryūsenka` was granted to D1 at **DC 33**, the caster's own Reiatsu DC. Fixed under #43 |
| S-15e | Ryūsenka | On a critical hit the ice shatters: the target instead takes an additional 2d6 cold |  | ✅ | **SB-50 fixed.** A `damage` rider on `criticalSuccess` adds one more die than the hit. Live: critical hits posted a separate **1d6 cold** beside the card's own, ordinary hits posted none |
| S-15f | Ryūsenka | is off-guard until the end of its next turn |  | ✅ | Live: a critical hit applied `Ryūsenka: Off-Guard` to D1 |
| S-15g | Ryūsenka | Heightened (+2) +1d6 |  | ✅ | Live: `heightening` is `interval 2, +1d6`, and the rank-9 cast rolled 5d6 |

## Refined (9th) — Guncho Tsurara

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-16a | Guncho Tsurara | Ryūsenka can instead be made as a ranged Strike against a target within 60 feet |  | ✅ | Live: the thrown usage rolled a **Ranged Strike** tagged *Thrown 60 ft., Range increment 60 ft.* A Note states the 60-foot range, because pf2e reads `thrown 60` as an increment and allows further shots at a penalty Ryūsenka does not grant |
| S-16b | Guncho Tsurara | it returns to your hand immediately |  | ✅ | Live: after the ranged Strike the weapon is still `carryType: held`. pf2e never takes a thrown weapon out of your hands, so the blade returning is true by construction |

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
| S-19d | Sennen Hyōrō | is immobilized until the end of its next turn |  | ✅ | Live: the failure's **Immobilized** now reads `1 round, turn-end`. **SB-51 fixed** |
| S-19e | Sennen Hyōrō | on a critical failure it is restrained for 1 minute instead |  | ✅ | Live: ZZ Victim rolled 17 against DC 27, a critical failure, and took **Restrained** for a duration of `1 minute` instead of the failure's immobilize |
| S-19f | Sennen Hyōrō | Escape vs. your Reiatsu DC |  | ✅ | Live: `Escape Sennen Hyōrō` granted at **DC 27**, the caster's own Reiatsu DC |
| S-19g | Sennen Hyōrō | Heightened (+1) +1d6 |  | ✅ | Live on the level-17 fixture: a rank-9 cast posted **Base: 7th, Heightened: +2** and rolled **7d6 cold** where the rank-7 cast rolls 5d6 |
| S-20a | Hyōryū Senbi | 60-foot line, basic Reflex, 5d6 cold damage |  | ✅ | Live: the card posts **Range 60 feet; Area 60-foot line, Defense basic Reflex**, the line placed and caught two enemies, and damage rolled **5d6 cold** |
| S-20b | Hyōryū Senbi | creatures that fail are slowed 1 until the end of their next turn |  | ✅ | Live: both creatures caught took `Hyōryū Senbi: Slowed 1`, now reading `1 round, turn-end`. **SB-51 fixed** |
| S-20c | Hyōryū Senbi | Heightened (+1) +1d6 |  | ✅ | Live on the same fixture: the rank-9 card posted **Base: 7th, Heightened: +2** and rolled **7d6 cold** |
| S-21a | Zanhyō Ningyō | Trigger you are hit by an attack |  | ✅ | Live: the reaction fires on `strike-received` and is offered on the hit itself, gated on `criticalSuccess`/`success`. A miss offered it before, against a trigger that reads *you are hit by an attack* |
| S-21b | Zanhyō Ningyō | Reduce the damage by an amount equal to twice your level |  | ✅ | Live: taking it spends a petal and grants `Effect: Remnant Ice Doll`, resistance to all damage **26** at level 13 — twice the level. A 32-damage critical hit cost 6 hit points |
| S-21c | Zanhyō Ningyō | the doll shatters |  | ✅ | Live: the doll is gone the moment a blow lands on its wearer. Needed a new `expire` rider and a new `damage-received` event, because `damage-applied` is the attacker's and the defender never saw it |

## Perfected Bankai (17th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-22a | Perfected Bankai | restores one spent petal-flower at the start of each of your turns |  | ✅ | Live at 17th: the petal pool returned to **3** at the start of each of three consecutive rounds. Declared on the effect (`chargeRefresh`), gated on `feature:perfected-full-release` |

## Severing Art — Hyōten Hyakkasō (guide §9.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-13a | Hyōten Hyakkasō | 30-foot emanation, basic Fortitude, cold |  | ✅ | Ported from R-13: the shape and save were right when driven |
| R-13b | Hyōten Hyakkasō | Creatures that fail are restrained in a pillar of ice |  | ✅ | Live: a failure applies **Restrained** for `1 minute` |
| R-13c | Hyōten Hyakkasō | Escape vs. your Reiatsu DC |  | ✅ | Live: a failure grants `Escape Hyōten Hyakkasō` at the caster's own Reiatsu DC |
| R-13d | Hyōten Hyakkasō | take 4d6 persistent cold |  | ✅ | Live: **4d6 persistent cold** on the captive |
| R-13e | Hyōten Hyakkasō | that allows no flat check to end while restrained |  | ✅ | Live: the persistent cold arrives at **flat-check DC 50**, which no d20 reaches — the guide's *no flat check to end while restrained* |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 35 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 1 |
| **Total** | **36** |

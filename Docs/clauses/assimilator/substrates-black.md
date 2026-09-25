# Clauses — ⚫ Black Substrates

*Substrate tracker. Every independently-failable declaration the lexicon makes about the four ⚫ Black
Substrates (Consume / Corrupt), one row each. Source: `Docs/homebrewing/carapace-material-lexicon-v3.md` §11 —
the guide's §6 makes the lexicon its Chapter 5 and does not reprint it.*

**Tier:** Substrates · **Colour:** ⚫ Black · **Tracker issue:** #91

## How a row is marked

| Mark | Meaning |
| :-- | :-- |
| ☐ | Not yet driven |
| ✅ | Driven live; the clause happened by itself |
| ⚠️ | Driven live; partially happens — the gap is named in **Evidence** |
| ❌ | Driven live; does not happen |
| 🔧 | Was ❌ or ⚠️, a fix has landed, awaiting re-drive |
| — | Nothing to automate (pure roleplaying / GM ruling) |

**Clause** is a verbatim fragment of the lexicon (`Docs/homebrewing/carapace-material-lexicon-v3.md`). `build/check-clauses.mjs` asserts it still is one, so a
paraphrase here or an edit to the source fails the build. **Static check** names the assertion that
guards it; **Evidence** names what proved it happened at the table.

*How a clause is driven — the rig, the traps it sets and what a ✅ owes — is
`Docs/tools/live-verification.md`. It is the one copy; this file records results, not method.*

*Nothing is implemented yet.* Every row starts ☐, and the Assimilator is being built against these
rows rather than checked after the fact — a clause is done when it is ✅, not when its JSON exists.

*⚫ Black's own shape.* **Resistance reduction and areas.** Manganese's *all its resistances reduced* is partial reduction, which pf2e cannot express natively and `scripts/riders/bypass.mjs` already solves; Onyx and Lead put darkness and suppression on the scene.

**IDs are `<Substrate>-<Depth><letter>`** — `ON-` Onyx, `JE-` Jet, `PB-` Lead, `MN-` Manganese. The number *is* the Depth, so `RU-3b` is the second
clause of Ruby's Depth 3. Every Depth 3 and Depth 4 row also owes the broken-Carapace check: the rider
stops while the Carapace is broken and comes back when it is repaired (class tracker, `A-34`).

---

## 💎 Onyx — *Shadow Mantle* (lexicon §11)

**Essence:** Darkness · **Prefix:** `ON-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| ON-1a | Onyx D1 | **Darkvision.** |  | ✅ | Live: **darkvision** |
| ON-1b | Onyx D1 | +1 item bonus to Stealth in dim light or darkness. |  | ⚠️ | Live: **Onyx +1 (item)** on Stealth, predicated on dim light or darkness; the lighting half not driven |
| ON-2a | Onyx D2 | Once per day, create a 20-foot emanation of **magical darkness** for 1 minute. |  | ⚠️ | Live: *Shadow Mantle* granted at Depth 2, 1/day; the darkness itself is placed by hand |
| ON-2b | Onyx D2 | You see through it normally. |  | ☐ |  |
| ON-3a | Onyx D3 | In dim light or darkness you may **Hide and Sneak without cover or concealment**, and gain +1 circumstance to AC. |  | ☐ |  |
| ON-4a | Onyx D4 | Once per round, as a single action, **teleport between two areas of darkness** within 60 feet. |  | ☐ |  |

## 💎 Jet — *Carrion Bloom* (lexicon §11)

**Essence:** Death · **Prefix:** `JE-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| JE-1a | Jet D1 | Your Strikes may deal **void**. |  | ✅ | Live: **versatile-void** |
| JE-1b | Jet D1 | +1 item bonus to saves against death effects. |  | ☐ |  |
| JE-2a | Jet D2 | **+1d4 void.** |  | ☐ |  |
| JE-2b | Jet D2 | Gain **2 temporary Hit Points** when you reduce a creature to 0 Hit Points. |  | ☐ |  |
| JE-3a | Jet D3 | **+1d6 void.** |  | ✅ | Live: **`+ 1d6 void`** at Depth 3 |
| JE-3b | Jet D3 | A creature you kill cannot be returned to life by magic below 6th rank. |  | ☐ |  |
| JE-4a | Jet D4 | **+1d6 void.** |  | ☐ |  |
| JE-4b | Jet D4 | Once per day, a creature within 30 feet at or below half Hit Points must succeed at a Fortitude save against your class DC or take **void damage equal to twice your level**. |  | ☐ |  |

## ⚙️ Lead — *Null Weight* (lexicon §11)

**Essence:** Suppression · **Prefix:** `PB-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| PB-1a | Lead D1 | +1 circumstance bonus to saves against magic. |  | ☐ |  |
| PB-1b | Lead D1 | Divinations of 3rd rank or lower cannot locate you. |  | ☐ |  |
| PB-2a | Lead D2 | Once per round, when a Mutation damages a creature, it takes **−1 status to its next save**. |  | ☐ |  |
| PB-3a | Lead D3 | Creatures within 10 feet take **−1 status to spell attack rolls and spell DCs**. |  | ☐ |  |
| PB-4a | Lead D4 | Once per encounter, as a two-action activity, **suppress magical effects in a 15-foot emanation for 1 round** (counteract each; rank = half your level). |  | ☐ |  |

## ⚙️ Manganese — *Rot Touch* (lexicon §11)

**Essence:** Corrosion · **Prefix:** `MN-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| MN-1a | Manganese D1 | Your Strikes deal **1 persistent acid** on a critical hit. |  | ✅ | Live: the critical carries **1 persistent acid** |
| MN-2a | Manganese D2 | A creature you damage has **all its resistances reduced by 2** until the end of its next turn. |  | ☐ |  |
| MN-3a | Manganese D3 | Reduced by **5**. |  | ☐ |  |
| MN-3b | Manganese D3 | Objects you Strike take a cumulative **−1 item penalty** (to a maximum of −3) until Repaired. |  | ☐ |  |
| MN-4a | Manganese D4 | Reduced by **10**. |  | ☐ |  |
| MN-4b | Manganese D4 | A creature that ends its turn adjacent to you takes **1d6 persistent acid**. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 19 |
| ✅ | 4 |
| ⚠️ | 2 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **25** |

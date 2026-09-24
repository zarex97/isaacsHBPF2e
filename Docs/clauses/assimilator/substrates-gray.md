# Clauses — ⚙️ Gray Substrates

*Substrate tracker. Every independently-failable declaration the lexicon makes about the four ⚙️ Gray
Substrates (Harden / Integrate), one row each. Source: `Docs/homebrewing/carapace-material-lexicon-v3.md` §13 —
the guide's §6 makes the lexicon its Chapter 5 and does not reprint it.*

**Tier:** Substrates · **Colour:** ⚙️ Gray · **Tracker issue:** #93

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

*⚙️ Gray's own shape.* **Stacking.** Steel is the third source of Carapace Hardness, and whether Hardness bonuses stack or take the higher is exactly the question the guide and the lexicon answer differently. Moonstone adapts to damage types by reaction; Silver makes Strikes a precious material.

**IDs are `<Substrate>-<Depth><letter>`** — `HE-` Hematite, `MO-` Moonstone, `ST-` Steel, `AG-` Silver. The number *is* the Depth, so `RU-3b` is the second
clause of Ruby's Depth 3. Every Depth 3 and Depth 4 row also owes the broken-Carapace check: the rider
stops while the Carapace is broken and comes back when it is repaired (class tracker, `A-34`).

---

## 💎 Hematite — *Ferrous Blood* (lexicon §13)

**Essence:** Blood / Iron · **Prefix:** `HE-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| HE-1a | Hematite D1 | +1 item bonus to Athletics. |  | ☐ |  |
| HE-1b | Hematite D1 | You are immune to **persistent bleed**. |  | ☐ |  |
| HE-2a | Hematite D2 | Gain **temporary Hit Points equal to your level** at the start of each encounter. |  | ☐ |  |
| HE-3a | Hematite D3 | +2 status bonus to Fortitude saves. |  | ☐ |  |
| HE-3b | Hematite D3 | You cannot be **drained**. |  | ☐ |  |
| HE-4a | Hematite D4 | Once per day, when you are reduced to 0 Hit Points, immediately stand with **Hit Points equal to your level**. |  | ☐ |  |

## 💎 Moonstone — *Reactive Evolution* (lexicon §13)

**Essence:** Adaptation · **Prefix:** `MO-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| MO-1a | Moonstone D1 | Once per encounter, as a reaction after taking damage of a type, gain **resistance 2** to that type for 1 minute. |  | ☐ |  |
| MO-2a | Moonstone D2 | **Resistance 5**, twice per encounter. |  | ☐ |  |
| MO-3a | Moonstone D3 | **Resistance 8**, it lasts until the encounter ends, and you may hold **two** types at once. |  | ☐ |  |
| MO-4a | Moonstone D4 | **Resistance 12**, unlimited uses, **three** types at once. |  | ☐ |  |
| MO-4b | Moonstone D4 | The first time each encounter you would take damage of a type you already resist, you take **none**. |  | ☐ |  |

## ⚙️ Steel — *True Plate* (lexicon §13)

**Essence:** Structure · **Prefix:** `ST-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| ST-1a | Steel D1 | Carapace **Hardness +2**. |  | ☐ |  |
| ST-1b | Steel D1 | Your unarmed Strikes' damage die increases one step. |  | ☐ |  |
| ST-2a | Steel D2 | **Hardness +5.** |  | ☐ |  |
| ST-3a | Steel D3 | **Hardness +8.** |  | ☐ |  |
| ST-3b | Steel D3 | Your unarmed Strikes gain the **versatile P** and **versatile S** traits. |  | ☐ |  |
| ST-4a | Steel D4 | **Hardness +12.** |  | ☐ |  |
| ST-4b | Steel D4 | **+1 damage die** on your unarmed Strikes. |  | ☐ |  |

## ⚙️ Silver — *Argent Edge* (lexicon §13)

**Essence:** Suppression / Supernatural Integration · **Prefix:** `AG-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AG-1a | Silver D1 | Your Strikes count as **silver**. |  | ☐ |  |
| AG-2a | Silver D2 | **+1d4** damage against aberrations, fiends, undead and spirits. |  | ☐ |  |
| AG-3a | Silver D3 | **+1d6** instead. |  | ☐ |  |
| AG-3b | Silver D3 | Your Strikes affect incorporeal creatures as though they had the **ghost touch** rune. |  | ☐ |  |
| AG-4a | Silver D4 | **+1d6.** |  | ☐ |  |
| AG-4b | Silver D4 | A supernatural creature you critically hit cannot use **reactions or innate spells** until the end of its next turn. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 24 |
| ✅ | 0 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **24** |

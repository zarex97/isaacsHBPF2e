# Clauses — ⚪ White Substrates

*Substrate tracker. Every independently-failable declaration the lexicon makes about the four ⚪ White
Substrates (Preserve / Purify), one row each. Source: `Docs/homebrewing/carapace-material-lexicon-v3.md` §12 —
the guide's §6 makes the lexicon its Chapter 5 and does not reprint it.*

**Tier:** Substrates · **Colour:** ⚪ White · **Tracker issue:** #92

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

*⚪ White's own shape.* **Hardness and conditions.** Diamond is the first gem that writes to the Carapace, Pearl and Magnesium end conditions on other people, and Aluminium makes the class fly.

**IDs are `<Substrate>-<Depth><letter>`** — `DI-` Diamond, `PE-` Pearl, `AL-` Aluminium, `MG-` Magnesium. The number *is* the Depth, so `RU-3b` is the second
clause of Ruby's Depth 3. Every Depth 3 and Depth 4 row also owes the broken-Carapace check: the rider
stops while the Carapace is broken and comes back when it is repaired (class tracker, `A-34`).

---

## 💎 Diamond — *Adamant Skin* (lexicon §12)

**Essence:** Hardness · **Prefix:** `DI-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| DI-1a | Diamond D1 | Carapace **Hardness +2**. |  | ☐ |  |
| DI-2a | Diamond D2 | **Hardness +5.** |  | ☐ |  |
| DI-2b | Diamond D2 | Reduce persistent damage you take by 2. |  | ☐ |  |
| DI-3a | Diamond D3 | **Hardness +8.** |  | ☐ |  |
| DI-3b | Diamond D3 | Once per encounter, a critical hit against you deals **normal damage** instead. |  | ☐ |  |
| DI-4a | Diamond D4 | **Hardness +12.** |  | ☐ |  |
| DI-4b | Diamond D4 | Once per **round** instead of once per encounter. |  | ☐ |  |

## 💎 Pearl — *Clear Tide* (lexicon §12)

**Essence:** Purification · **Prefix:** `PE-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| PE-1a | Pearl D1 | +1 item bonus to saves against poison and disease. |  | ☐ |  |
| PE-1b | Pearl D1 | Once per day, reduce one condition's value by 1. |  | ☐ |  |
| PE-2a | Pearl D2 | Once per encounter, as a single action, **end one condition of value 1** on yourself or an adjacent ally. |  | ☐ |  |
| PE-3a | Pearl D3 | Range **30 feet**, and it may instead reduce one **affliction's stage** by 1. |  | ☐ |  |
| PE-4a | Pearl D4 | **Twice** per encounter, and it may instead **counteract** one spell effect of 4th rank or lower. |  | ☐ |  |

## ⚙️ Aluminium — *Hollow Frame* (lexicon §12)

**Essence:** Lightness · **Prefix:** `AL-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AL-1a | Aluminium D1 | Your Carapace has **no Bulk** and imposes no penalties. |  | ☐ |  |
| AL-1b | Aluminium D1 | **+5 feet Speed**. |  | ☐ |  |
| AL-2a | Aluminium D2 | **+10 feet Speed.** |  | ☐ |  |
| AL-2b | Aluminium D2 | You take no damage from falls of less than 30 feet. |  | ☐ |  |
| AL-3a | Aluminium D3 | You Leap twice as far. |  | ☐ |  |
| AL-3b | Aluminium D3 | Once per day, **Fly 30 feet** as a single action. |  | ☐ |  |
| AL-4a | Aluminium D4 | Permanent **fly Speed 20 feet**. |  | ☐ |  |
| AL-4b | Aluminium D4 | You may end your turn in midair without falling. |  | ☐ |  |

## ⚙️ Magnesium — *Flare Core* (lexicon §12)

**Essence:** Radiance · **Prefix:** `MG-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| MG-1a | Magnesium D1 | You shed **bright light in a 20-foot radius** at will. |  | ☐ |  |
| MG-1b | Magnesium D1 | +1 item bonus to saves against blindness and dazzle. |  | ☐ |  |
| MG-2a | Magnesium D2 | Once per encounter, as a single action: creatures in a **15-foot emanation** must succeed at a Fortitude save against your class DC or be **dazzled** for 1 round. |  | ☐ |  |
| MG-3a | Magnesium D3 | On a failed save they are **blinded** for 1 round instead. |  | ☐ |  |
| MG-3b | Magnesium D3 | The flare deals **fire damage equal to your level** to creatures with light sensitivity or light blindness. |  | ☐ |  |
| MG-4a | Magnesium D4 | The emanation becomes **30 feet** and **counteracts magical darkness**. |  | ☐ |  |
| MG-4b | Magnesium D4 | Once per day, it instead heals each ally within it for your level. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 27 |
| ✅ | 0 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **27** |

# Clauses — 🟠 Orange Substrates

*Substrate tracker. Every independently-failable declaration the lexicon makes about the four 🟠 Orange
Substrates (Move / React), one row each. Source: `Docs/homebrewing/carapace-material-lexicon-v3.md` §7 —
the guide's §6 makes the lexicon its Chapter 5 and does not reprint it.*

**Tier:** Substrates · **Colour:** 🟠 Orange · **Tracker issue:** #87

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

*🟠 Orange's own shape.* **State that lives between actions.** Carnelian and Bronze ask whether you moved ten feet *this turn*; Amber keeps charges across an encounter. Nothing here is hard alone, and all of it is the kind of counter that silently resets at the wrong moment.

**IDs are `<Substrate>-<Depth><letter>`** — `CA-` Carnelian, `AM-` Amber, `BR-` Bronze, `HG-` Mercury. The number *is* the Depth, so `RU-3b` is the second
clause of Ruby's Depth 3. Every Depth 3 and Depth 4 row also owes the broken-Carapace check: the rider
stops while the Carapace is broken and comes back when it is repaired (class tracker, `A-34`).

---

## 💎 Carnelian — *Kinetic Spurs* (lexicon §7)

**Essence:** Momentum · **Prefix:** `CA-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| CA-1a | Carnelian D1 | **+5 feet Speed.** |  | ☐ |  |
| CA-2a | Carnelian D2 | If you moved at least 10 feet this turn before attacking, your Strike deals **+1d4**. |  | ☐ |  |
| CA-3a | Carnelian D3 | **+10 feet Speed**, and the bonus becomes **+1d6**. |  | ☐ |  |
| CA-4a | Carnelian D4 | Once per round, after a Strike, **Stride up to half your Speed** as a free action. |  | ☐ |  |

## 💎 Amber — *Reservoir* (lexicon §7)

**Essence:** Stored Energy · **Prefix:** `AM-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AM-1a | Amber D1 | When you take energy damage, store **1 charge** (max 3). |  | ☐ |  |
| AM-1b | Amber D1 | Spend 1 as a free action to add **1d4** of that type to a Strike. |  | ☐ |  |
| AM-2a | Amber D2 | Max **5 charges**. |  | ☐ |  |
| AM-2b | Amber D2 | Spending 2 adds **1d6 + 2** instead. |  | ☐ |  |
| AM-3a | Amber D3 | You also store a charge whenever you **deal** energy damage, once per round. |  | ☐ |  |
| AM-4a | Amber D4 | Spend 3 charges as a two-action activity: a **30-foot line**, **6d6** of the stored type, basic Reflex against your class DC. |  | ☐ |  |

## ⚙️ Bronze — *Battle Frame* (lexicon §7)

**Essence:** Momentum / Combat · **Prefix:** `BR-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| BR-1a | Bronze D1 | You are trained in improvised weapons as martial weapons, and take no penalty for using them. |  | ☐ |  |
| BR-2a | Bronze D2 | If you Stride at least 10 feet, your next Strike this turn gains a **+1 circumstance bonus to hit**. |  | ☐ |  |
| BR-3a | Bronze D3 | Once per round, make a Strike and then a Shove, Trip or Grapple as a **single action**. |  | ☐ |  |
| BR-4a | Bronze D4 | On a critical hit, immediately **Stride up to half your Speed** toward a different enemy as a free action. |  | ☐ |  |

## ⚙️ Mercury — *Liquid Form* (lexicon §7)

**Essence:** Fluidity · **Prefix:** `HG-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| HG-1a | Mercury D1 | You Squeeze at full Speed and are not off-guard while squeezing. |  | ☐ |  |
| HG-2a | Mercury D2 | **Resistance 5** to bludgeoning, piercing and slashing. |  | ☐ |  |
| HG-3a | Mercury D3 | Once per round, as a reaction when you are hit, **reduce the damage by your level** as the blow passes through you. |  | ☐ |  |
| HG-4a | Mercury D4 | You move through gaps as small as an inch. |  | ☐ |  |
| HG-4b | Mercury D4 | Once per day, become **amorphous** for 1 minute: immune to precision damage, and critical hits against you deal normal damage. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 19 |
| ✅ | 0 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **19** |

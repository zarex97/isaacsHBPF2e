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
| CA-1a | Carnelian D1 | **+5 feet Speed.** |  | ✅ | Live: land Speed **25 → 30** |
| CA-2a | Carnelian D2 | If you moved at least 10 feet this turn before attacking, your Strike deals **+1d4**. |  | ✅ | Live in an encounter, on the Assimilator's turn: **5 feet** moved — not marked; **10 feet** — `self:moved-10-feet-this-turn` set and the Strike gained **+1d4**; the mark cleared when the turn ended. **Fixed while driving:** the tracker read `game.combat`, which is the encounter the tracker *shows*, not the one the token is in |
| CA-3a | Carnelian D3 | **+10 feet Speed**, and the bonus becomes **+1d6**. |  | ✅ | Live: Speed **35** at Depth 3 (+10, not +15) |
| CA-4a | Carnelian D4 | Once per round, after a Strike, **Stride up to half your Speed** as a free action. | `rig` | ✅ | Rig, live: a Strike at Carnelian 4 posts the *Kinetic Spurs* prompt — the free Stride is offered at the moment it can be taken, once per round |

## 💎 Amber — *Reservoir* (lexicon §7)

**Essence:** Stored Energy · **Prefix:** `AM-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AM-1a | Amber D1 | When you take energy damage, store **1 charge** (max 3). | `rig` | ✅ | Rig, live: 5 cold taken stored **1 charge of cold** |
| AM-1b | Amber D1 | Spend 1 as a free action to add **1d4** of that type to a Strike. | `rig` | ✅ | Rig, live: *Draw on the Reservoir* spent **3 → 2** charges and the next Strike carried **+1d4 cold**; its damage roll spent the primed effect |
| AM-2a | Amber D2 | Max **5 charges**. | `rig` | ✅ | Rig, live: at Depth 2 the Reservoir stops at **5** |
| AM-2b | Amber D2 | Spending 2 adds **1d6 + 2** instead. | `rig` | ✅ | Rig, live: with 2 charges at Depth 2, the draw spent **both** for **+1d6 + 2 fire**. **Fixed while driving:** the +2 did not reach the roll as a DamageDice bonus; it is its own modifier |
| AM-3a | Amber D3 | You also store a charge whenever you **deal** energy damage, once per round. | `rig` | ✅ | Rig, live: dealing 5 fire stored **1 charge** |
| AM-4a | Amber D4 | Spend 3 charges as a two-action activity: a **30-foot line**, **6d6** of the stored type, basic Reflex against your class DC. | Claude-in-Chrome | ✅ | Live, aimed with the real pointer: the 30-foot line caught both creatures; each critically failed and took **`6d6 * 2 fire`**, and the Reservoir went **3 → 0**. Fixed with the Gland: the same stray `multiplier: 0.5` had halved every degree |

## ⚙️ Bronze — *Battle Frame* (lexicon §7)

**Essence:** Momentum / Combat · **Prefix:** `BR-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| BR-1a | Bronze D1 | You are trained in improvised weapons as martial weapons, and take no penalty for using them. | `rig` | ⚠️ | Rig: the Note *Bronze (Depth 1)* appears on the Strike card. Text the table applies — nothing enforces it |
| BR-2a | Bronze D2 | If you Stride at least 10 feet, your next Strike this turn gains a **+1 circumstance bonus to hit**. |  | ✅ | Live, the same move: the Strike's attack **+23 → +24** once 10 feet were moved |
| BR-3a | Bronze D3 | Once per round, make a Strike and then a Shove, Trip or Grapple as a **single action**. | `rig` | ⚠️ | Rig: the Note *Bronze (Depth 3)* appears on the Strike card. Text the table applies — nothing enforces it |
| BR-4a | Bronze D4 | On a critical hit, immediately **Stride up to half your Speed** toward a different enemy as a free action. | `rig` | ✅ | Rig, live: a critical at Bronze 4 posts the *Battle Frame* prompt |

## ⚙️ Mercury — *Liquid Form* (lexicon §7)

**Essence:** Fluidity · **Prefix:** `HG-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| HG-1a | Mercury D1 | You Squeeze at full Speed and are not off-guard while squeezing. | `rig` | ⚠️ | Rig: the Note *Mercury (Depth 1)* appears on the Acrobatics card. Text the table applies — nothing enforces it |
| HG-2a | Mercury D2 | **Resistance 5** to bludgeoning, piercing and slashing. |  | ✅ | Live: **bludgeoning 5, piercing 5, slashing 5** |
| HG-3a | Mercury D3 | Once per round, as a reaction when you are hit, **reduce the damage by your level** as the blow passes through you. |  | ✅ | Live at 17th: *Pass Through* granted at Depth 3; armed, 40 fire from a creature's Claw took **23** — **17** turned, equal to level — and the reaction was spent |
| HG-4a | Mercury D4 | You move through gaps as small as an inch. |  | — | Nothing to automate: squeezing through an inch gap is movement the table adjudicates |
| HG-4b | Mercury D4 | Once per day, become **amorphous** for 1 minute: immune to precision damage, and critical hits against you deal normal damage. |  | ✅ | Live: *Amorphous* granted at Depth 4; used, the actor is immune to **precision** and **critical-hits** for 1 minute |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 15 |
| ⚠️ | 3 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 1 |
| **Total** | **19** |

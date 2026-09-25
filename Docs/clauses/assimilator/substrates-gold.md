# Clauses — 🟡 Gold Substrates

*Substrate tracker. Every independently-failable declaration the lexicon makes about the four 🟡 Gold
Substrates (Amplify / Dominate), one row each. Source: `Docs/homebrewing/carapace-material-lexicon-v3.md` §6 —
the guide's §6 makes the lexicon its Chapter 5 and does not reprint it.*

**Tier:** Substrates · **Colour:** 🟡 Gold · **Tracker issue:** #86

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

*🟡 Gold's own shape.* **The colour that acts on other Substrates.** Gold's Gilded Core and Electrum's Alloyed Instinct do not grant an ability — they rewrite the derived state every other Substrate reads, so they are the first real test of the one-writer rule: a Depth that *counts as* one higher must come out of the same rebuild as the Depth that *is*.

**IDs are `<Substrate>-<Depth><letter>`** — `TO-` Topaz, `CI-` Citrine, `AU-` Gold, `EL-` Electrum. The number *is* the Depth, so `RU-3b` is the second
clause of Ruby's Depth 3. Every Depth 3 and Depth 4 row also owes the broken-Carapace check: the rider
stops while the Carapace is broken and comes back when it is repaired (class tracker, `A-34`).

---

## 💎 Topaz — *Regal Aspect* (lexicon §6)

**Essence:** Power · **Prefix:** `TO-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| TO-1a | Topaz D1 | +1 item bonus to Intimidation. |  | ✅ | Live: Intimidation carries **Topaz +1 (item)** |
| TO-1b | Topaz D1 | Your critical hits deal **+2 damage**. |  | ✅ | Live: the critical reads **`2 * (1d8 + 6) + 2`** — the +2 on the critical only |
| TO-2a | Topaz D2 | Your unarmed Strikes gain the **critical specialization effect** of the brawling group. |  | ✅ | Live: a second brawling critical-specialization synthetic appears with Topaz at Depth 2 (the 7th-level class feature is the first) |
| TO-3a | Topaz D3 | A creature you critically hit is **frightened 1**. |  | ✅ | Live, a real critical against a dummy with AC 1: Topaz Depth 3 left it **frightened 1**; the same critical at Depth 2 left **no condition** |
| TO-4a | Topaz D4 | When you critically hit, apply the **Depth 4 rider of one other bound Substrate** to that Strike, whether or not it is at Depth 4. |  | ⚠️ | A Note on the critical attack roll; nothing applies another Substrate's rider |

## 💎 Citrine — *Gilded Chance* (lexicon §6)

**Essence:** Fortune · **Prefix:** `CI-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| CI-1a | Citrine D1 | Once per day, reroll one failed check and take the second result. |  | ✅ | Live: *Gilded Chance* granted at Depth 1, **1/day** |
| CI-2a | Citrine D2 | Twice per day. |  | ✅ | Live: at Depth 2 *Gilded Chance* reads **max 2 per day** |
| CI-2b | Citrine D2 | The reroll gains a **+2 circumstance bonus**. |  | ⚠️ | Text on the action: the +2 circumstance bonus on the reroll is the player's to add |
| CI-3a | Citrine D3 | Once per encounter, when an enemy within 30 feet critically succeeds at a save against you, it gets a success instead. |  | ☐ |  |
| CI-4a | Citrine D4 | Once per day, after seeing the result, **change one d20 roll made within 30 feet by 5** in either direction — yours, an ally's, or an enemy's. |  | ✅ | Live: *Turn of Fortune* granted at Depth 4, **1/day** |

## ⚙️ Gold — *Gilded Core* (lexicon §6)

**Essence:** Amplification · **Prefix:** `AU-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AU-1a | Gold D1 | At daily preparations, choose one other bound Substrate. |  | ✅ | Live: Gold with Ruby chosen — the choice is read from the record; the Gullet offers every other bound Substrate |
| AU-1b | Gold D1 | It counts as **one Depth higher** for its numeric effects. |  | ⚠️ | Live: Ruby paid **2** manifests at **3** and deals Depth 3's 1d6 fire. **The gap:** the whole Depth rises, riders with it — Depth 1 should lift only the numbers, and a rule cannot be split into its number and its rider |
| AU-1c | Gold D1 | This can never exceed your level's Depth cap. | `test-assimilator` | ✅ | The lift is clamped to the cap in `effectiveDepths`; live, nothing chosen rose above the level's cap |
| AU-2a | Gold D2 | The chosen Substrate also gains the **rider** of that higher Depth, not only the numbers. |  | ✅ | Live: the lifted Substrate gains the higher Depth's rider (Ruby's Depth 3 resistance cut and die) — which at Depth 2 is exactly the clause |
| AU-3a | Gold D3 | Choose **two** Substrates instead of one. |  | ✅ | Live at Gold 3: **two** choices lifted — Ruby **2 → 3** and Iron **1 → 2** |
| AU-4a | Gold D4 | Once per day, as a free action, one chosen Substrate manifests at **Depth 4** for 1 minute regardless of its real Depth. |  | ✅ | Live: *Gilded Apotheosis* granted at Depth 4; used, the first chosen Substrate (Ruby) manifested at **4** while the second (Iron) stayed at 2 |

## ⚙️ Electrum — *Alloyed Instinct* (lexicon §6)

**Essence:** Resonance · **Prefix:** `EL-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| EL-1a | Electrum D1 | Choose a second colour. |  | ☐ |  |
| EL-1b | Electrum D1 | Electrum also **counts as a Substrate of that colour** for any effect that counts your bound Substrates of a colour; its Mass still counts toward Gold. |  | ☐ |  |
| EL-2a | Electrum D2 | Electrum may stand in for **either Substrate** of any one Bond you know. |  | ☐ |  |
| EL-3a | Electrum D3 | You gain your second colour's **Instinct clause** as well — but both clauses operate at **half value** (round down, minimum 1). |  | ☐ |  |
| EL-4a | Electrum D4 | Both Instinct clauses operate at **full value**. |  | ☐ |  |
| EL-4b | Electrum D4 | You are two organisms sharing a host, and they do not always want the same thing. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 7 |
| ✅ | 12 |
| ⚠️ | 3 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **22** |

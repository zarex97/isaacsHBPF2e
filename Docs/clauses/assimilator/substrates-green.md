# Clauses — 🟢 Green Substrates

*Substrate tracker. Every independently-failable declaration the lexicon makes about the four 🟢 Green
Substrates (Grow / Reproduce), one row each. Source: `Docs/homebrewing/carapace-material-lexicon-v3.md` §10 —
the guide's §6 makes the lexicon its Chapter 5 and does not reprint it.*

**Tier:** Substrates · **Colour:** 🟢 Green · **Tracker issue:** #90

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

*🟢 Green's own shape.* **Numbers that tick.** Fast healing, a resistance whose type is chosen every morning and then changed by reaction, and Chromium's Hardness — the first metal that writes to the Carapace itself.

**IDs are `<Substrate>-<Depth><letter>`** — `EM-` Emerald, `JA-` Jade, `ZN-` Zinc, `CR-` Chromium. The number *is* the Depth, so `RU-3b` is the second
clause of Ruby's Depth 3. Every Depth 3 and Depth 4 row also owes the broken-Carapace check: the rider
stops while the Carapace is broken and comes back when it is repaired (class tracker, `A-34`).

---

## 💎 Emerald — *Knitting Flesh* (lexicon §10)

**Essence:** Regeneration · **Prefix:** `EM-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| EM-1a | Emerald D1 | **Fast healing 1** while you have at least 1 Hit Point and are below your maximum. |  | ☐ |  |
| EM-2a | Emerald D2 | **Fast healing 2.** |  | ☐ |  |
| EM-2b | Emerald D2 | Once per day, regrow a severed part over 1 hour. |  | ☐ |  |
| EM-3a | Emerald D3 | **Fast healing 5.** |  | ☐ |  |
| EM-3b | Emerald D3 | You stabilize automatically when dying. |  | ☐ |  |
| EM-4a | Emerald D4 | **Fast healing 10.** |  | ✅ | Live, turn start in an encounter at Depth 4: pf2e's card reads **fast healing 10 — Emerald**, and only one card — the lower rungs stood down |
| EM-4b | Emerald D4 | Once per day, when reduced to 0 Hit Points, be reduced to 1 instead and gain fast healing 15 for 1 minute. |  | ☐ |  |

## 💎 Jade — *Deep Root* (lexicon §10)

**Essence:** Vitality · **Prefix:** `JA-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| JA-1a | Jade D1 | +1 item bonus to Fortitude saves. |  | ✅ | Live: Fortitude carries **+1 (item)** |
| JA-2a | Jade D2 | **Resistance 5** to poison. |  | ✅ | Live: **poison 5** |
| JA-2b | Jade D2 | You are immune to disease. |  | ✅ | Live: immune to **disease** |
| JA-3a | Jade D3 | Once per day, when you roll a success on a Fortitude save, get a **critical success** instead. |  | ☐ |  |
| JA-4a | Jade D4 | Once per **round** instead of once per day. |  | ☐ |  |
| JA-4b | Jade D4 | You cannot be **drained** or **enfeebled**. |  | ✅ | Live: immune to **enfeebled** at Depth 4 (drained comes from Alien Physiology at this level as well) |

## ⚙️ Zinc — *Shifting Tissue* (lexicon §10)

**Essence:** Biological Adaptation · **Prefix:** `ZN-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| ZN-1a | Zinc D1 | At daily preparations, choose one energy damage type. |  | ✅ | Live: the choice is read from the record; the Gullet offers the energy types |
| ZN-1b | Zinc D1 | Gain **resistance 2** to it. |  | ☐ |  |
| ZN-2a | Zinc D2 | **Resistance 5.** |  | ✅ | Live: **fire 5** at Depth 2 with fire chosen |
| ZN-2b | Zinc D2 | Change the chosen type as a single action, once per day. |  | ☐ |  |
| ZN-3a | Zinc D3 | **Resistance 8.** |  | ☐ |  |
| ZN-3b | Zinc D3 | Once per round, as a reaction when you take energy damage, change the chosen type **to that type** — after learning the type, before damage applies. |  | ☐ |  |
| ZN-4a | Zinc D4 | **Resistance 12.** |  | ✅ | Live: **cold 12** at Depth 4 with cold chosen — the resistance follows the choice |
| ZN-4b | Zinc D4 | The reaction is unlimited, and you keep resistance to the previously chosen type as well. |  | ☐ |  |

## ⚙️ Chromium — *Lacquer Shell* (lexicon §10)

**Essence:** Armour / Regeneration · **Prefix:** `CR-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| CR-1a | Chromium D1 | Carapace **Hardness +2**. |  | ✅ | Live: Hardness **2 → 4** |
| CR-1b | Chromium D1 | **Resistance 2** to acid. |  | ✅ | Live: **acid 2** |
| CR-2a | Chromium D2 | **Hardness +5**, **resistance 5** to acid. |  | ☐ |  |
| CR-2b | Chromium D2 | Your Carapace repairs 1 Hit Point per hour on its own. |  | ☐ |  |
| CR-3a | Chromium D3 | **Hardness +8**, **resistance 8** to acid. |  | ☐ |  |
| CR-3b | Chromium D3 | You are immune to rust, corrosion and effects that damage your items with acid. |  | ☐ |  |
| CR-4a | Chromium D4 | **Hardness +12**, **resistance 12** to acid. |  | ✅ | Live: Hardness **14** and **acid 12** |
| CR-4b | Chromium D4 | Once per encounter, when your Carapace's Hardness would be reduced or bypassed, it isn't. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 18 |
| ✅ | 11 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **29** |

# Clauses — 🔴 Red Substrates

*Substrate tracker. Every independently-failable declaration the lexicon makes about the four 🔴 Red
Substrates (Consume / Destroy), one row each. Source: `Docs/homebrewing/carapace-material-lexicon-v3.md` §5 —
the guide's §6 makes the lexicon its Chapter 5 and does not reprint it.*

**Tier:** Substrates · **Colour:** 🔴 Red · **Tracker issue:** #85

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

*🔴 Red's own shape.* **This is the architecture proof** — the automation programme's Phase 2. Red is built first and completely: the first Substrates, the first Depth ladder, the first provenance-tagged damage, and the first rider that must switch off when the Carapace breaks. If the data model is wrong, it is wrong here, with four Substrates written instead of thirty-six.

**IDs are `<Substrate>-<Depth><letter>`** — `RU-` Ruby, `GA-` Garnet, `IR-` Iron, `CU-` Copper. The number *is* the Depth, so `RU-3b` is the second
clause of Ruby's Depth 3. Every Depth 3 and Depth 4 row also owes the broken-Carapace check: the rider
stops while the Carapace is broken and comes back when it is repaired (class tracker, `A-34`).

---

## 💎 Ruby — *Furnace Veins* (lexicon §5)

**Essence:** Flame · **Prefix:** `RU-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| RU-1a | Ruby D1 | Your Carapace Strikes may deal **fire** instead of their normal damage type. |  | ✅ | Live: the Carapace Strike gained **versatile-fire** at Depth 1 |
| RU-1b | Ruby D1 | You shed dim light in a 10-foot radius and cannot suppress it. | `rig` | ✅ | Live and in the rig: the token's light reads **dim 10** |
| RU-2a | Ruby D2 | **+1d4 fire.** | `test-assimilator` pins it | ✅ | Live at Depth 2: **`+ 1d4 fire`**, labelled *Ruby +1d4 Fire* |
| RU-2b | Ruby D2 | On a critical hit, **1d4 persistent fire**. |  | ✅ | Live: the critical carried **1d4 persistent fire** |
| RU-3a | Ruby D3 | **+1d6 fire.** |  | ✅ | Live at Depth 3: **`+ 1d6 fire`**, and the d4 was gone |
| RU-3b | Ruby D3 | Fire damage you deal treats fire resistance as **5 lower**. |  | ✅ | Live: the same 20 fire into resistance 10 — **10** with no source, **15** from the Strike |
| RU-4a | Ruby D4 | **+1d6 fire.** |  | ✅ | Live under Apotheosis: the critical doubled **1d6 fire**, not 1d4 |
| RU-4b | Ruby D4 | On a critical hit, **2d10 persistent fire**, and the target's space burns — a creature ending its turn there takes 1d6 fire. |  | ⚠️ | Live: the critical carried **2d10 persistent fire**. The burning space is a Note on the critical attack roll; nothing places it |

## 💎 Garnet — *Crimson Tendrils* (lexicon §5)

**Essence:** Blood · **Prefix:** `GA-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| GA-1a | Garnet D1 | Your Strikes deal **1 persistent bleed** on a critical hit. |  | ✅ | Live: a critical at Depth 1 carried **1 bleed** |
| GA-1b | Garnet D1 | You may Treat Wounds on yourself. |  | — | Nothing to automate: pf2e's Treat Wounds already allows treating yourself |
| GA-2a | Garnet D2 | **+1d4** damage against any creature that has already lost Hit Points this encounter. |  | ✅ | Live: **no Garnet die** against a creature unhurt in the encounter, **+1d4** against one that was |
| GA-2b | Garnet D2 | Critical hits deal **1d6 persistent bleed**. |  | ✅ | Live: the critical carried **1d6 bleed** in place of the 1 |
| GA-3a | Garnet D3 | At the start of your turn, gain **temporary Hit Points equal to half your level** if any creature within 30 feet is taking persistent bleed. |  | ✅ | Live at 11th: **5** temporary Hit Points with a bleeding creature within 30 feet, **0** without one. Driven through `Red.crimsonTendrils`, the function `pf2e.startTurn` calls, rather than by advancing a turn |
| GA-4a | Garnet D4 | Creatures taking persistent bleed from you take **+2 damage per weapon damage die** from your Strikes. |  | ⚠️ | Live: **Garnet +2** (one die) against a bleeding target, off against one that is not. *From you* is not checked — any bleed counts. **Fixed while driving:** it predicated on `target:persistent-damage:bleed`; pf2e's option is `target:condition:persistent-damage:bleed` |
| GA-4b | Garnet D4 | Once per day, drain a dying creature within 30 feet: it dies, you regain Hit Points equal to your level. | `rig` | ✅ | Rig, live: *Exsanguinate* on a dying target — it died, and the Assimilator went **50 → 67** Hit Points (level 17) |

## ⚙️ Iron — *Dense Frame* (lexicon §5)

**Essence:** Brutality · **Prefix:** `IR-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| IR-1a | Iron D1 | +1 item bonus to Athletics. |  | ✅ | Live: Athletics **+4** at 1st — trained +3 and **Iron +1 item** |
| IR-1b | Iron D1 | Your unarmed Strikes deal **+1 bludgeoning**. |  | ✅ | Live: the breakdown reads **Iron +1** |
| IR-2a | Iron D2 | +2 circumstance bonus to Athletics checks to Shove, Trip or Grapple a creature you have already damaged this encounter. |  | ✅ | Live, pf2e's own Grapple: the **+2 circumstance** is on against a creature that lost Hit Points this encounter and off against one that did not |
| IR-3a | Iron D3 | Your unarmed Strikes gain the **shove** trait, and forced movement you cause increases by **5 feet**. |  | ⚠️ | Live: the Strike gained **shove** at Depth 3 (absent at 2). The extra 5 feet of forced movement is a Note |
| IR-4a | Iron D4 | **+1 damage die** on your unarmed Strikes. |  | ✅ | Live under Apotheosis: the Strike's die went **1d8 → 2d8** |
| IR-4b | Iron D4 | A creature you Shove into a wall, hazard or another creature takes bludgeoning damage equal to your level. | `rig` | ⚠️ | Rig: the Note *Iron (Depth 4)* appears on the Athletics card. Text the table applies — nothing enforces it |

## ⚙️ Copper — *Conductive Filament* (lexicon §5)

**Essence:** Heat / Conduction · **Prefix:** `CU-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| CU-1a | Copper D1 | When a Mutation of yours deals energy damage, the target takes **1 more of that type** at the start of its next turn. | `rig` | ✅ | Rig, live: 5 fire from a Copper Strike queued **1 fire** on the target for the start of its next turn (the point lands from `pf2e.startTurn`) |
| CU-2a | Copper D2 | When you take fire or electricity damage, your next Strike before the end of your next turn deals **+1d4** of that type. | `rig` | ✅ | Rig, live: taking 5 fire gave the next Strike **+1d4 fire**, and that damage roll spent it |
| CU-3a | Copper D3 | Energy damage from your Mutations **conducts**: one creature adjacent to the target takes **2** of that type. | `rig` | ✅ | Rig, live: 5 electricity into the target — the creature beside it took **2** |
| CU-4a | Copper D4 | The conduction becomes **half** the energy damage, and reaches any creature touching the same metal object, water, or surface as the target. | `rig` | ⚠️ | Rig, live: 10 electricity into the target — the creature beside it took **5**, half. *"Any creature touching the same metal object, water, or surface"* is reduced to the adjacent one |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 19 |
| ⚠️ | 5 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 1 |
| **Total** | **25** |

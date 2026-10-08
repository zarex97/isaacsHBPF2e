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

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| ON-1a | Onyx D1 | **Darkvision.** | effect:sense | | ✅ | Live: **darkvision** |
| ON-1b | Onyx D1 | +1 item bonus to Stealth in dim light or darkness. | effect:bonus | `rig` | ✅ | Rig, live: the scene darkened (0.8) — **+1 item** to Stealth; lit (0) — none. The module writes `self:in-dim-light-or-darkness` from the scene's darkness level, pf2e reading light scene-wide |
| ON-2a | Onyx D2 | Once per day, create a 20-foot emanation of **magical darkness** for 1 minute. | economy:granted-action · economy:charges · reach:area/emanation · effect:darkness · ending:duration | `rig` | ✅ | Rig, live: *Shadow Mantle* (granted at Depth 2, 1/day) gives the Assimilator's token **20 feet of darkness** — a TokenLight with negative light, which follows the token for the minute; it ends with the effect. The old evidence (placed by hand) predated that rule (#91, Q1) |
| ON-2b | Onyx D2 | You see through it normally. | | | — | Nothing to automate: seeing through your own darkness is the table's |
| ON-3a | Onyx D3 | In dim light or darkness you may **Hide and Sneak without cover or concealment**, and gain +1 circumstance to AC. | effect:bonus | `rig` | ✅ | Rig, live: AC **Onyx +1 circumstance** is on with `self:in-dim-light-or-darkness` and off without it. **Fixed while driving:** pf2e has no lighting roll option, so the Stealth and AC bonuses predicated on one could never fire; the module writes the scene's darkness as one |
| ON-4a | Onyx D4 | Once per round, as a single action, **teleport between two areas of darkness** within 60 feet. | economy:granted-action · economy:once-per-round · effect:teleport | `rig` | ✅ | Rig, live: *Shadow Step* (1 action, once per round) — the module checks the start and the destination are both in darkness (a dark scene, or inside a Foundry darkness source such as Shadow Mantle's) and within 60 feet, then moves the token. A lit square: refused; 70 feet: refused; a darkness 20 feet off: stepped into. In play the destination is the next click on the board (#91, Q2) |

## 💎 Jet — *Carrion Bloom* (lexicon §11)

**Essence:** Death · **Prefix:** `JE-`, numbered by Depth

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| JE-1a | Jet D1 | Your Strikes may deal **void**. | effect:trait-gained · effect:damage-type | | ✅ | Live: **versatile-void** |
| JE-1b | Jet D1 | +1 item bonus to saves against death effects. | effect:bonus | `rig` | ✅ | Rig, live: Fortitude carries **Jet +1 item**, predicated on death effects |
| JE-2a | Jet D2 | **+1d4 void.** | effect:strike-damage | `rig` | ✅ | Rig, live: **`+ 1d4 void`** |
| JE-2b | Jet D2 | Gain **2 temporary Hit Points** when you reduce a creature to 0 Hit Points. | when:damage-dealt · effect:temp-hp | `rig` | ✅ | Rig, live: a Strike that took a 5-Hit-Point creature to 0 gave the Assimilator **2** temporary Hit Points |
| JE-3a | Jet D3 | **+1d6 void.** | effect:strike-damage · scaling:from-rank | | ✅ | Live: **`+ 1d6 void`** at Depth 3 |
| JE-3b | Jet D3 | A creature you kill cannot be returned to life by magic below 6th rank. | effect:gm-note | `rig` | — | Nothing to enforce: pf2e has no resurrection to block. The rule is made unmissable instead — a creature a Jet 3 Assimilator kills gets *Carrion-Marked* (cannot be returned to life by magic below 6th rank) on its sheet; Jet 2 marks nothing. Rig, live (#91, Q3) |
| JE-4a | Jet D4 | **+1d6 void.** | effect:strike-damage · scaling:from-rank | `rig` | ✅ | Rig, live: **`+ 1d6 void`** at Depth 4 |
| JE-4b | Jet D4 | Once per day, a creature within 30 feet at or below half Hit Points must succeed at a Fortitude save against your class DC or take **void damage equal to twice your level**. | economy:granted-action · economy:charges · reach:filtered · check:save · effect:damage | `rig` | ✅ | Rig, live: *Carrion Harvest* on a target at **400/900** — the save failed and it took **34** (twice level 17); at **700/900**, **0**. **Fixed while driving:** pf2e never passes `hp-percent` to a roll against a creature, and a ladder formula is not resolved on an action's riders |

## ⚙️ Lead — *Null Weight* (lexicon §11)

**Essence:** Suppression · **Prefix:** `PB-`, numbered by Depth

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| PB-1a | Lead D1 | +1 circumstance bonus to saves against magic. | effect:bonus | `rig` | ✅ | Rig, live: Reflex carries **Lead +1 circumstance** |
| PB-1b | Lead D1 | Divinations of 3rd rank or lower cannot locate you. | effect:gm-note | `rig` | — | Nothing to automate: pf2e has no locating mechanic for divinations. The Note on the Will card tells the table (#91, Q4) |
| PB-2a | Lead D2 | Once per round, when a Mutation damages a creature, it takes **−1 status to its next save**. | when:damage-dealt · economy:once-per-round · effect:penalty · ending:spent | `rig` | ✅ | Rig, live: damage put *Null Weight* on the target, and its Will save carries **−1 status** |
| PB-3a | Lead D3 | Creatures within 10 feet take **−1 status to spell attack rolls and spell DCs**. | area:aura/pf2e · effect:penalty | `rig` | ✅ | Rig, live: a pf2e **Aura**, 10 feet — the adjacent creature carries *Null Weight Aura* (−1 status to spell attack rolls and spell DCs); one 40 feet away does not. Every creature but the Assimilator, allies too. Control: Lead 2, no aura (#91, Q5) |
| PB-4a | Lead D4 | Once per encounter, as a two-action activity, **suppress magical effects in a 15-foot emanation for 1 round** (counteract each; rank = half your level). | economy:charges · reach:area/emanation · check:counteract · effect:suppress · ending:duration | `rig` | ✅ | Rig, live: *Null Field* (once per encounter; a second use in one was **refused**) counteracts each magical effect caught **at once** — no card — and one it beats is **parked for the round** by the rider engine's Suppression, not deleted. Was: a card to click per effect, and a win *ended* the effect where the clause says suppress (#91, Q6) |

## ⚙️ Manganese — *Rot Touch* (lexicon §11)

**Essence:** Corrosion · **Prefix:** `MN-`, numbered by Depth

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| MN-1a | Manganese D1 | Your Strikes deal **1 persistent acid** on a critical hit. | when:strike-made · check:attack · effect:persistent | | ✅ | Live: the critical carries **1 persistent acid** |
| MN-2a | Manganese D2 | A creature you damage has **all its resistances reduced by 2** until the end of its next turn. | when:damage-dealt · ending:next-turn | `rig` | ✅ | Rig, live: a Manganese Strike put *Corroded* on the target, and **nobody's** next 20 fire met resistance 10 as **8** (12 taken) — every source, as the clause says |
| MN-3a | Manganese D3 | Reduced by **5**. | scaling:from-rank | | ✅ | Covered by the same drive at Depth 4: the reduction is by Depth, 2 / 5 / 10 |
| MN-3b | Manganese D3 | Objects you Strike take a cumulative **−1 item penalty** (to a maximum of −3) until Repaired. | | `rig` | — | Nothing to automate: in pf2e an object is rarely Struck, and the clause does not say what the −1 applies to — its Hardness, or rolls made with it. The Note on the damage card tells the table (#91, Q7) |
| MN-4a | Manganese D4 | Reduced by **10**. | scaling:from-rank | `rig` | ✅ | Rig, live: at Depth 4 resistance 10 was reduced to **0** — 20 of 20 taken |
| MN-4b | Manganese D4 | A creature that ends its turn adjacent to you takes **1d6 persistent acid**. | when:turn-end · effect:persistent | `rig` | ✅ | Rig, live, in an encounter: the adjacent target ends its turn and takes **1d6 persistent acid**. Any creature but the Assimilator, allies too. Control: Manganese 3, none (#91, Q8) |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 21 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 4 |
| **Total** | **25** |

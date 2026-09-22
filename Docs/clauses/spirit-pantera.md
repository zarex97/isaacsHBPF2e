# Clauses — 🐆 Pantera

*Spirit tracker. Every independently-failable declaration the guide makes about Pantera, one row each.
Source: `Docs/soulbound-guide-v1.md` v1.4 §7B (Pantera) and §9.2 (Desgarrón).*

**Lineage:** Hollow · **Ladder:** Resurrección → Segunda Etapa · **Tracker issue:** #64

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

*How a clause is driven — the rig, the traps it sets and what a ✅ owes — is
`Docs/tools/live-verification.md`. It is the one copy; this file records results, not method.*

*Pantera's own shape.* The first Hollow tracker, and the lineage's ladder is different: **Resurrección →
Segunda Etapa**, not Shikai → Bankai. Its form grants **unarmed attacks** rather than altering a spirit
weapon, which is the one place the class's `ItemAlteration` machinery has nothing to hold. Two of its
clauses are about **stacking** — *"this stacks with Sonido"*, and a second +10 on top of the first — and
pf2e collapses two bonuses of the same type, so the type is the clause.

---

## Resurrección (1st) — guide §7B Pantera

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-38a | Resurrección Form | You gain two **claw** unarmed attacks: **1d8 slashing**, **agile**, **finesse**, in the brawling group | | ✅ | Live: `Pantera — Claws` is an **unarmed** weapon in the **brawling** group, **1d8 slashing**, **agile**, **finesse** — the d8 read off the control with Refined Release stripped. pf2e models a matched pair as one Strike entry used twice, which `agile` is what prices; two identical entries would add nothing |
| S-38b | Resurrección Form | Your Speed increases by **10 feet** (this stacks with Sonido) | | ✅ | Live: Speed **40** with the form, **30** without. The modifiers read `Sonido untyped 5` and `Pantera untyped 10` and **both** count — *“this stacks with Sonido”* holds because neither is typed, which is the whole of the clause |

## Release Technique — Garra de la Pantera (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-39a | Garra de la Pantera | **30-foot cone**, basic Reflex, **2d6** piercing damage | | ✅ | Cast live at 9th: the card reads **Range 30 feet; Area 30-foot cone**, **basic Reflex**, **2d6 piercing** |
| S-39b | Garra de la Pantera | the area is littered with shards and becomes **difficult terrain** for enemies until the start of your next turn | `test-riders` pins which terrains are enemies-only | ✅ | **Fixed.** The lingering declared `difficultTerrain` and no `affects`, so the shards slowed the caster's own party — the same finding as Senbonzakura's S-02b, whose machinery already existed. Live after the fix: the Region carries `isaacs-hb-pf2e.enemyMovementCost`, and it answers **`difficulty`** for the enemy, **`[]`** for a party ally and **`[]`** for the caster |
| S-39c | Garra de la Pantera | **Release Technique — Garra de la Pantera** [two-actions] | | ✅ | Same card: **2** actions, one Reiatsu Point spent (pool 2 → 1) |
| S-39d | Garra de la Pantera | **Heightened (+1)** +1d6 | | ✅ | Live at 9th, rank 5: the damage rolled **`6d6 piercing`** — 2d6 and four heightening steps |

## Refined (9th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-40a | Refined | Your claws' damage die increases to **1d10** | | ✅ | Live, both ways: the claws are **d10** while Refined Release is held and **d8** with the feat stripped. **SB-40** recorded this as never landing; it lands |
| S-40b | Refined | after using Garra de la Pantera you may **Step** as a free action | | ✅ | Live: casting Garra posted *“Refined Release: you may Step as a free action.”* SB-40's second half |

## Segunda Etapa (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-41a | Segunda Etapa | Your Speed increases by another **10 feet** | | ☐ | |
| S-41b | Segunda Etapa | your claws gain **deadly d10** | | ☐ | |
| S-41c | Segunda Etapa | Once per round when you critically hit with a claw, you may immediately make an additional claw Strike against the same target at your current multiple attack penalty | | ☐ | |
| S-42a | Segunda Etapa | **Garra de la Pantera**'s cone increases to **60 feet** | | ☐ | |
| S-42b | Segunda Etapa | creatures that critically fail against it take **2d6 persistent bleed** damage from embedded shards | | ☐ | |

## Severing Art — Desgarrón (guide §9.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-17a | Desgarrón | **60-foot cone**, basic Reflex, **slashing** | | ☐ | |
| R-17b | Desgarrón | Creatures that fail take **4d6 persistent bleed** | | ☐ | |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 7 |
| ✅ | 8 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **15** |

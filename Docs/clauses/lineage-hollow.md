# Clauses — the Hollow Lineage

*Lineage tracker. Every independently-failable declaration the guide makes about what **every**
Arrancar has, whatever Spirit they chose. Source: `Docs/soulbound-guide-v1.md` v1.4 §5.2 and §6.4.*

**Tier:** lineage · **Tracker issue:** #79

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

*The middle tier.* `class.md` asks what is true of a Soulbound who has chosen nothing; the fifteen
`spirit-*.md` ask what one Spirit does. This file is the layer between them: what a Hollow gets for being a Hollow, before any Resurrección is named. It is the attrition Lineage, and every row here is a number that has to hold for twenty levels rather than fire once.

---

## The Lineage itself (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| H-01 | §5.2 | **Granted skill:** Athletics. **Release ladder:** Resurrección → Segunda Etapa. | `test-soulbound` pins the skill and both rungs | ✅ | Live on all five Hollow in the rig: **Athletics trained** at 1st, from an `ActiveEffectLike` on the Lineage rather than a grant that could be lost. The ladder is `Resurrección → Segunda Etapa`, which is the Spirit trackers' subject — what is class-wide is that the Lineage grants it, and it does |

## Hierro and Sonido (1st) — guide §5.2

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| H-02 | §5.2 | **Hierro** ("iron skin") — Your compressed reiryoku hardens your skin. You gain **resistance to | `test-soulbound` pins the formula | ✅ | Live at five levels: **physical 1** at 1st, **4** at 9th, **6** at 13th, **7** at 15th, **10** at 20th. `max(1, floor(level/2))` — and the `max(1, …)` is load-bearing exactly once, at 1st level, where half of 1 is 0 and the clause says the minimum is 1. Read across five Hollow standing at 1st, 9th, 13th, 15th and 20th rather than by levelling one through twenty, which reopens every `ChoiceSet` the class ever asked. |
| H-03 | §5.2 | physical damage equal to half your level (minimum 1)**. |  | ✅ | The same five readings: half level, floored, never below 1, and it is **physical** — the whole category rather than a list of three types, which is what makes it broader than `Thermal Nimbus` at half the rate |
| H-04 | §5.2 | **Sonido** ("sound") — You gain a **+5-foot bonus** to all your Speeds. At 11th level this | `test-soulbound` pins the step | ✅ | Live: land Speed **25 → 30** at 1st and at 9th, **25 → 35** at 13th and above. The step is at 11th exactly, as `ternary(gte(level,11),10,5)` |
| H-05 | §5.2 | increases to +10 feet. |  | ✅ | The +10 half, read at 13th, 15th and 20th: every one of them is 35 from a base of 25 |
| H-06 | §5.2 | Untyped rather than status: a status bonus to Speed is displayed by | `test-soulbound` pins the modifier type | ✅ | **The parenthetical is a bug report, and it holds.** Live, the speed breakdown reads `25-Foot Land Speed, Sonido +5` and the modifier's type is **`untyped`** — pf2e displays a *status* bonus to Speed in the breakdown and then does not add it, so the number on the sheet would have been 25 with a +5 printed beside it. Untyped also leaves Pantera's own bonus free to stack, which a second status bonus could not |

## Cero and Bala (1st) — guide §5.2, §6.4

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| H-07 | §5.2 | You know exactly | `test-soulbound` pins the pair | ✅ | Live on all five: the kidō list is **exactly `[Bala, Cero]`** — not one more, not one fewer, at 1st and at 20th alike |
| H-08 | §5.2 | **two** kidō and they are always these: **Bala** (your free cantrip) and **Cero**. You cannot learn |  | ✅ | The same reading: Bala is the free cantrip (`focusPoints: 0`) and Cero the one costed art (`focusPoints: 1`). No Hollow in the rig has ever had a third |
| H-09 | §5.2 | others, and no feat grants you more — `Additional Kidō` is closed to you. | `test-soulbound` pins the Soul Reaper gate | ✅ | **Driven as K-07, and it was a real gap.** `Additional Kidō` named *“Soul Reaper lineage”* in `system.prerequisites`, which pf2e displays and never tests. Its ChoiceSet already refused to offer a Hollow's own arts, so Cero could not be taken twice — but Sōkatsui could, and the ceiling of two is the whole reason this Lineage gets Hierro and Regeneración instead. Live after: a Hollow handed the feat gets **no prompt and no kidō** |
| K-20 | §6.4 | Range 60 ft., one creature. **Ranged spell attack**, **1d4 + key attribute** force damage, doubled on a critical hit. Bala has the **agile** trait for the purpose of your multiple attack penalty (−4/−8 rather than −5/−10). | `test-soulbound` pins the agile penalty | ✅ | Live at 9th (kidō rank 5), all four halves: **60 feet**, a **ranged spell attack** against AC, damage reading **`3d4 Force + Strength`** — 1d4 and two H(+2) steps, with the key attribute — and the multiple attack penalty stepping **−4 then −8** across three shots, labelled `Bala (agile)`. That penalty is canon's *“twenty times the rate”* made mechanical, and it is the reason Bala is an attack roll where Shō is a save. Free, as a cantrip |
| K-21 | §6.4 | **60-foot line**, basic Reflex, **2d6** force damage. | `test-soulbound` pins the line and the ladder | ✅ | Live at rank 5: **2 actions, a 60-foot line at 60 feet, basic Reflex, 6d6 Force** — 2d6 and four H(+1) steps — and it spent **1 Reiatsu Point**. The line is longer than Shakkahō's burst because Cero is a Hollow's only costed art: breadth traded for reach |

## Regeneración (5th) and Segunda Piel (15th) — guide §5.2

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| H-10 | §5.2 | High-speed regeneration. You gain **fast healing 2**. This increases to | `test-soulbound` pins the three tiers | ✅ | Live: **no fast healing at 1st** — Regeneración is a 5th-level grant and the predicate says so — and **2** at 9th |
| H-11 | §5.2 | **fast healing 4** at 11th level and **fast healing 6** at 17th. |  | ✅ | Live at the two boundaries above: **4** at 13th and **6** at 20th, from one nested ternary rather than three predicated rules |
| H-12 | §5.2 | It is deactivated while you have the dying condition, and suppressed until the end of your next |  | ✅ | Live on the same 9th-level Hollow, three readings in a row: fast healing **2** while healthy, **none** the instant the `dying` condition landed, and **2** again once it was removed. It is a predicate on the rule rather than a deletion, so nothing has to remember to put it back |
| H-13 | §5.2 | turn whenever you take spirit damage or damage from a holy or vitality effect. | `test-soulbound` pins the suppressor list and the trait/type split | ✅ | Live at 9th, four blows: **5 spirit** suppressed it, **5 vitality** suppressed it, **5 slashing carrying the `holy` trait** suppressed it, and **5 plain slashing** did not. The trait half is the one that is easy to get wrong — the remaster made `holy` a **trait**, not a damage type, so `5[holy]` parses as untyped and a type check for it can never match. Both halves are asked separately, and both answer |
| H-14 | §5.2 | Hierro's resistance applies to **spirit** damage as well as physical, and | `test-soulbound` pins the second Resistance | ✅ | Live at the boundary: **spirit resistance is absent at 13th** and reads **7 at 15th**, **10 at 20th** — the same `max(1, floor(level/2))` as Hierro's, on a second rule that the 15th-level feature brings with it |
| H-15 | §5.2 | Regeneración is no longer suppressed by damage from holy or vitality effects (spirit damage still | `test-soulbound` pins the narrowed list | ✅ | Live at 15th, the same three blows that suppressed a 9th-level Hollow: **vitality no longer suppresses**, a **holy** hit no longer suppresses, and **spirit still does**. Exactly the clause, parenthetical included — and the reason the parenthetical exists is that spirit damage is what the other two Lineages exist to deal |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 17 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **17** |

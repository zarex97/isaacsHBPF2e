# Clauses — the Soul Reaper Lineage

*Lineage tracker. Every independently-failable declaration the guide makes about what **every**
Shinigami has, whatever Spirit they chose. Source: `Docs/soulbound-guide-v1.md` v1.4 §5.1 and §8.4.*

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
`spirit-*.md` ask what one Spirit does. This file is the layer between them: what a Soul Reaper gets for being a Soul Reaper, before any zanpakutō is named. It is the breadth Lineage, and the only one that *chooses* anything.

---

## The Lineage itself (guide §5.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SR-01 | §5.1 | **Granted skill:** Society. **Release ladder:** Shikai → Bankai. | `test-soulbound` pins the skill | ✅ | Live on every Soul Reaper in the rig: **Society trained** at 1st, from an `ActiveEffectLike` on the Lineage. `Shikai → Bankai` is each zanpakutō's own tracker; what is Lineage-wide is that this is the ladder it grants |

## Kidō Adept (1st) — guide §5.1

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SR-02 | §5.1 | You learn **two** kidō of your choice at 1st level, and one additional kidō at | `test-soulbound` pins the six grants and their predicates | ✅ | Live: `Kidō Adept` grants **six** `Kidō Learned` choices — two unpredicated, and one each behind `{gte: [self:level, 5 / 9 / 13 / 17]}`. The two at 1st are named *(1st)* and *(2nd)* for first and second rather than for levels, which is the only thing about them that reads oddly |
| SR-03 | §5.1 | 5th, 9th, 13th, and 17th level — **six chosen kidō** in total, on top of your free cantrip **Shō**. |  | ✅ | Live at three levels: **6 kidō at 13th** (five chosen plus Shō), **7 at 17th** and **7 at 20th** (six chosen plus Shō) — and the cantrip is granted outright rather than chosen, so it never eats one of the six. *(A 2nd-level fixture in the rig carries grants from 5th and 9th; that actor was levelled down during an earlier sweep and pf2e does not take a `reevaluateOnUpdate` grant back off. Its owned rules match the pack exactly, which is what says the content is right and the fixture is not.)* |
| SR-04 | §5.1 | You are the only Lineage that *chooses*: a Hollow and a Quincy each get exactly **two fixed** kidō | `test-soulbound` pins the gate | ✅ | The claim is proven from the other two sides: a Hollow's list is **exactly `[Bala, Cero]`** and a Quincy's **exactly `[Heizen, Gritz]`**, at 1st and at 20th alike, and `Additional Kidō` is now predicated on `feature:soul-reaper` — so the Lineage that chooses is the only one that can, which is what K-07, H-09 and Q-12 each drove from their own end |

## Zanjutsu (5th) and Zanjutsu Mastery (15th) — guide §5.1

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SR-05 | §5.1 | You gain the **Zanjutsu** feat |  | ✅ | Live at the boundary: the `Zanjutsu` feature is **absent at 4th** and present at 13th and 17th. It publishes `soulbound:zanjutsu-access`, and a later audit of every roll option in the content found **nothing reads it** — the six §8.4 feats name "Zanjutsu" in `system.prerequisites`, which pf2e prints and never tests. That is pf2e's own behaviour for every feat in the system, not this class's, and the guardrail the guide does make load-bearing — the kidō ceiling — is enforced (K-07). What is real here is that the feature arrives at 5th and grants a technique |
| SR-06 | §5.1 | family (§8.4) and **one Zanjutsu technique** of your choice for free. |  | ✅ | Live: one technique, granted free by a `ChoiceSet` filtered to `item:tag:sb-tier-zanjutsu` **and rank 2 or lower** — so a 5th-level Soul Reaper picks from the family's entry rank rather than from its 8th-rank capstone. Both fixtures came out holding exactly one, `Sōkotsu` |
| SR-07 | §5.1 | Zanjutsu techniques are | `test-soulbound` pins the trait on all six | ✅ | Live, read off the pack: all **six** Zanjutsu carry the **`reiatsu`** trait — `Sōkotsu`, `Ikkotsu`, `Nadegiri`, `Shitonegaeshi`, `Hitotsume: Nadegiri` and `Zanjutsu: Kendō` — alongside `concentrate` and `focus`. That trait is what `Release.beforeCast` reads to refuse one from a sealed weapon |
| SR-08 | §5.1 | Strike-based reiatsu effects |  | ✅ | Live: every one of the six is built around a Strike. Two **make** them — `Sōkotsu` and `Nadegiri` carry `strikes` riders on `action-used` — and three hang off one, with riders on `strike-resolved`. *(`Zanjutsu: Kendō` is the exception and a finding of its own: `rules: []` and no riders, so its "ignores all resistances and immunities, or treats the target's AC as 2 lower" does nothing yet. It is a §8.4 feat-tier Technique, so it belongs to the `F-` wave rather than to this clause, which is about what a Zanjutsu **is**.)* |
| SR-09 | §5.1 | Your Zanjutsu techniques' damage dice increase by one step (d6→d8, | `test-soulbound` pins the step, the cap and what is left alone | ✅ | **Fixed; the capstone was one unread string.** `Zanjutsu Mastery` shipped with a single `RollOption` publishing `soulbound:zanjutsu-mastery` and **nothing in the module or the content read it** — both halves of a 15th-level Lineage capstone did nothing at all. This one could not have been a rule element even in principle: pf2e's `damage-dice-faces` handler declares `itemType: choices: ["weapon"]`, and a Zanjutsu technique is a **spell**. Live after, at the boundary: `Sōkotsu` reads **1d6 at 13th and 14th** and **1d8 at 17th and 20th** |
| SR-10 | §5.1 | d8→d10). |  | ✅ | The same pass takes d8 to d10 and stops at d12, which is where pf2e's ladder ends. The number of dice never moves — `2d6` becomes `2d8` — and a formula that is not plain dice is left exactly as it is rather than guessed at. Declared on the feature as `techniqueDieSteps` rather than named in code, so a later feature that steps a family of Techniques says so the same way |
| SR-11 | §5.1 | Once per round, when you critically hit with your spirit weapon, you regain 1 Reiatsu Point; | `test-soulbound` pins the rider | ✅ | **Fixed with the same field `Unsealed` needed.** Live at 17th: a critical hit with the spirit weapon moved the pool **1 → 2**, and a second critical hit in the same round moved it **2 → 2**. `pool` could only ever spend until `gain` existed — a refund written as a negative `spend` falls straight through that function's own guard and does nothing |
| SR-12 | §5.1 | this ignores Rising Pressure's per-encounter cap. |  | ✅ | Driven with Rising Pressure's ledger deliberately stamped as **fully spent for the encounter**, so a refund that respected the cap would have given nothing: the point came back anyway. Written straight to the pool rather than routed through Rising Pressure, which is what ignoring the cap has to mean |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 12 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **12** |

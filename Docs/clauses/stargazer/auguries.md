# Clauses — the Stargazer's Auguries

*Augury tracker. Every independently-failable declaration the guide makes about the sixteen Auguries,
one row each. Source: `Docs/stargazer-guide-v3.md` §5.1 (the rules line every Augury shares), §5.2 (the
list) and §5.3 (which sign grants which).*

**Tier:** auguries · **Tracker issue:** #106

## How a row is marked

| Mark | Meaning |
| :-- | :-- |
| ☐ | Not yet driven |
| ✅ | Driven live; the clause happened by itself |
| ⚠️ | Driven live; partially happens — the gap is named in **Evidence** |
| ❌ | Driven live; does not happen |
| 🔧 | Was ❌ or ⚠️, a fix has landed, awaiting re-drive |
| — | Nothing to automate (pure roleplaying / GM ruling) |

**Clause** is a verbatim fragment of the guide (`Docs/stargazer-guide-v3.md`). `build/check-clauses.mjs` asserts it still is one, so a
paraphrase here or an edit to the source fails the build. **Static check** names the assertion that
guards it; **Evidence** names what proved it happened at the table.

*How a clause is driven — the rig, the traps it sets and what a ✅ owes — is
`Docs/tools/live-verification.md`. It is the one copy; this file records results, not method.*

*Nothing is implemented yet.* Every row starts ☐, and the Stargazer is being built against these
rows rather than checked after the fact — a clause is done when it is ✅, not when its JSON exists.

*The Auguries' own shape.* Sixteen focus spells, and most of them are ordinary pf2e spell content — but
four things about them are not. **Heightening widens them**: ten of the sixteen gain targets as they
auto-heighten, so a row like "(7th) 4 allies" is a target cap that must actually move at the rank
boundary, not a sentence in the description. **Two are reactions that intercept an outcome** — *The Hour
Is Not Come* replaces a drop to 0 Hit Points, and *Shell of Hours* carries a once-only reprieve — which
is the shape pf2e resists most. **Four carry `fortune` or `misfortune`**, which must be real traits so
the printed cancel-out rule applies to them. And the **Augury of the Day** is not learned at all: it is
granted and revoked by the sky, keyed off the day's sign, so §5.3's table is twelve grants that must
land on the right morning and leave again on the next.

*Settled in v3.1* (#103): **R14** *Perfect Ledger* lasts until the end of your next turn, so it reaches
allies (`OM-09`); **R16** *Fixed Point* stands as written (`OM-10`); **R17** *Coiling Doubt*'s stupefied
lasts its minute (`OM-11g`) and *Alms of Fate* loses the `fortune` trait (`OM-13a`).

**IDs are `OM-<nn><letter>`**, one number per Augury in the guide's order — `OM-00` is the rules line
they all share, `OM-17` is §5.3's mapping — and a letter per clause. A sentence of pure fiction — *"You
show each of them the hour of its own death"* — and the italic anchors and design notes are not clauses
and have no row.

---

## Every Augury (guide §5.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-00a | §5.1 | All Auguries: `prediction`, `focus`, occult | `test-stargazer` pins it | ✅ | Live: every Augury filed itself into the occult **Star Chart** entry; traits `focus`, `prediction` and the class trait are pinned and validated |
| OM-00b | §5.1 | rank = **half your level rounded up** | `test-stargazer` pins it | ✅ | Live: all nine known Auguries read **rank 10** on a 19th-level Stargazer |
| OM-00c | §5.1 | DC = Stargazer DC. |  | ✅ | Live (#105 SG-08/SG-23b): the Star Chart's DC is the Stargazer DC at every level, and every Augury is cast from it |

## Death Foretold (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-01a | §5.2 Death Foretold | ***Death Foretold*** ✦✦ (concentrate, emotion, fear, illusion, mental, prediction, visual) |  | ☐ |  |
| OM-01b | §5.2 Death Foretold | **Targets** up to 5 creatures within 30 feet · **Saving Throw** Will |  | ☐ |  |
| OM-01c | §5.2 Death Foretold | **Critical Success** Unaffected. |  | ☐ |  |
| OM-01d | §5.2 Death Foretold | **Success** Frightened 1. |  | ☐ |  |
| OM-01e | §5.2 Death Foretold | **Failure** Frightened 2. |  | ☐ |  |
| OM-01f | §5.2 Death Foretold | **Critical Failure** Frightened 3, **stunned 1**, and fleeing for 1 round. |  | ☐ |  |
| OM-01g | §5.2 Death Foretold | **Heightened (4th)** A creature that fails also takes **2d6 mental damage**, doubled on a critical failure. |  | ☐ |  |
| OM-01h | §5.2 Death Foretold | **(+2)** +2d6. |  | ☐ |  |

## The Hour Is Not Come (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-02a | §5.2 The Hour Is Not Come | ***The Hour Is Not Come*** ✦ **[reaction]** (concentrate, healing, prediction) |  | ☐ |  |
| OM-02b | §5.2 The Hour Is Not Come | **Trigger** You or an ally within 30 feet is reduced to 0 Hit Points. |  | ☐ |  |
| OM-02c | §5.2 The Hour Is Not Come | The target is reduced to **1 Hit Point** instead |  | ☐ |  |
| OM-02d | §5.2 The Hour Is Not Come | gains **temporary Hit Points equal to your level** |  | ☐ |  |
| OM-02e | §5.2 The Hour Is Not Come | does not gain the wounded condition from this instance. |  | ☐ |  |
| OM-02f | §5.2 The Hour Is Not Come | A creature cannot benefit from this Augury again for 10 minutes. |  | ☐ |  |
| OM-02g | §5.2 The Hour Is Not Come | **Heightened (5th)** The target also regains **2d8** Hit Points. |  | ☐ |  |
| OM-02h | §5.2 The Hour Is Not Come | **(+2)** +2d8. |  | ☐ |  |

## Guiding Star (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-03a | §5.2 Guiding Star | ***Guiding Star*** ✦✦ (concentrate, prediction) | `test-stargazer` pins it | ✅ | Live: two actions, `concentrate` and `prediction`; the cast spent **one Focus Point** (2 → 1) |
| OM-03b | §5.2 Guiding Star | **Targets** 2 allies within 60 feet · **Duration** until the start of your next turn | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: the two targeted allies each got the effect, lasting to the start of Altair's next turn; untargeted Far got nothing |
| OM-03c | §5.2 Guiding Star | Each gains a **+1 status bonus to attack rolls, damage rolls, Perception checks and skill checks**. | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: attack, damage, Perception and skill modifiers each +2 (the 10th-rank value); the ally's Athletics roll carried *Guiding Star +2 status* |
| OM-03d | §5.2 Guiding Star | **Heightened (4th)** 3 allies. |  | ☐ |  |
| OM-03e | §5.2 Guiding Star | **(7th)** 4 allies. |  | ☐ |  |
| OM-03f | §5.2 Guiding Star | **(10th)** 5 allies, and the bonus is **+2**. | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: the bonus was **+2** on all four |

## First Blood (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-04a | §5.2 First Blood | ***First Blood*** ✦✦ (concentrate, prediction) |  | ☐ |  |
| OM-04b | §5.2 First Blood | **Targets** up to 5 allies within 30 feet · cast during exploration |  | ☐ |  |
| OM-04c | §5.2 First Blood | The next time each rolls initiative within the hour, it gains a **+2 status bonus** to that roll |  | ☐ |  |
| OM-04d | §5.2 First Blood | is **not off-guard** during the first round |  | ☐ |  |
| OM-04e | §5.2 First Blood | its **first Strike of the encounter that hits deals an extra 1d6 spirit damage**. |  | ☐ |  |
| OM-04f | §5.2 First Blood | **Heightened (+2)** +1d6. |  | ☐ |  |

## Iron Auspice (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-05a | §5.2 Iron Auspice | ***Iron Auspice*** ✦✦ (concentrate, prediction) | `test-stargazer` pins it | ✅ | Live: two actions, `concentrate` and `prediction` |
| OM-05b | §5.2 Iron Auspice | **Targets** 2 allies within 30 feet · **Duration** 1 minute | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: one minute, on the targeted ally only; Far nothing |
| OM-05c | §5.2 Iron Auspice | +2 status bonus to Fortitude saves, to Athletics checks to Shove, Trip and Grapple, and to checks to resist forced movement. | `test-stargazer` pins it | ⚠️ | Live, cast by Altair (19th) from the Star Chart at rank 10: Fortitude **+2** and Athletics to Shove **+2**; plain Athletics nothing. **Gap:** resisting forced movement is by hand — pf2e has no roll for it |
| OM-05d | §5.2 Iron Auspice | Each target gains **temporary Hit Points equal to three times your level** | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: **57** temporary Hit Points — three times 19 |
| OM-05e | §5.2 Iron Auspice | **once** during the duration treats a critical failure on a Fortitude save as a failure. |  | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: a forced natural 1 on a Fortitude save against DC 40 — unadjusted critical failure — came out a **failure**, and the reprieve was gone; the next was a critical failure |
| OM-05f | §5.2 Iron Auspice | **Heightened (+2)** +1 ally. |  | ☐ |  |

## Two Roads (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-06a | §5.2 Two Roads | ***Two Roads*** ✦ (concentrate, fortune, prediction) | `test-stargazer` pins it | ✅ | Live: one action, with `fortune` |
| OM-06b | §5.2 Two Roads | **Targets** 2 allies within 30 feet | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: on the ally and Deneb |
| OM-06c | §5.2 Two Roads | Before the end of your next turn, the first **skill check** each attempts is rolled **twice**; each takes the higher result. | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: Deneb's first skill check rolled **`2d20kh`** and the effect was spent |
| OM-06d | §5.2 Two Roads | **Heightened (5th)** 3 allies, and it applies to **saving throws** as well. | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: the ally's first saving throw rolled **`2d20kh`** and spent it; the next save rolled `1d20` |
| OM-06e | §5.2 Two Roads | **(9th)** 4 allies. |  | ☐ |  |

## Shell of Hours (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-07a | §5.2 Shell of Hours | ***Shell of Hours*** ✦✦ (concentrate, healing, prediction) | `test-stargazer` pins it | ✅ | Live: two actions, with `healing` |
| OM-07b | §5.2 Shell of Hours | **Targets** 2 allies within 30 feet · **Duration** 1 minute | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: one minute, on the targeted creature |
| OM-07c | §5.2 Shell of Hours | Each regains **2d8 Hit Points** immediately | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: Deneb at 1 of 104 regained **45** from **`10d8`** — 2d8 plus 2d8 for each of four other-rank steps |
| OM-07d | §5.2 Shell of Hours | gains a +2 status bonus to saves against disease and poison and to recovery checks. | `test-stargazer` pins it | ⚠️ | The saves against disease and poison carry the +2 rule (pinned), not rolled live. **Gap:** recovery checks — pf2e's is a flat check, which takes no modifier |
| OM-07e | §5.2 Shell of Hours | **Once** during the duration, the first time a target would be reduced to 0 Hit Points it is reduced to **1 Hit Point** instead and the Augury ends for that target. |  | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: a hit for 66 left Deneb at **1 Hit Point** with no dying condition, and the Augury was gone; the next lethal hit took Deneb to 0 |
| OM-07f | §5.2 Shell of Hours | **Heightened (+2)** +2d8 and +1 ally. | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: the heal was `10d8` at rank 10. The +1 ally per step is pinned |

## Crown of Fire (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-08a | §5.2 Crown of Fire | ***Crown of Fire*** ✦✦ (concentrate, prediction) | `test-stargazer` pins it | ✅ | Live: two actions, `concentrate` and `prediction` |
| OM-08b | §5.2 Crown of Fire | **Targets** 2 allies within 30 feet · **Duration** 1 minute | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: one minute, on the targeted ally |
| OM-08c | §5.2 Crown of Fire | +2 status bonus to Intimidation and Performance. | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: Intimidation and Performance **+2**; Deception nothing |
| OM-08d | §5.2 Crown of Fire | Each target can **Demoralize at 60 feet** with no auditory or visual requirement and no penalty for a shared-language failure. |  | ⚠️ | Written on the effect for the table. **Gap:** pf2e does not enforce Demoralize's range or its auditory and language requirements, so there is nothing for a rule element to lift |
| OM-08e | §5.2 Crown of Fire | Once per round, when a target critically succeeds at any check, one ally within 30 feet of it gains a **+1 status bonus** to their next roll. |  | ☐ |  |
| OM-08f | §5.2 Crown of Fire | **Heightened (+2)** +1 ally. |  | ☐ |  |

## Perfect Ledger (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-09a | §5.2 Perfect Ledger | ***Perfect Ledger*** ✦ (concentrate, prediction) |  | ☐ |  |
| OM-09b | §5.2 Perfect Ledger | **Targets** you and up to 2 allies within 30 feet |  | ☐ |  |
| OM-09c | §5.2 Perfect Ledger | Each target's next **Recall Knowledge** before the end of your next turn is a **free action** |  | ☐ |  |
| OM-09d | §5.2 Perfect Ledger | gains a +2 circumstance bonus |  | ☐ |  |
| OM-09e | §5.2 Perfect Ledger | on a success reveals one additional piece of information. |  | ☐ |  |
| OM-09f | §5.2 Perfect Ledger | On a critical success it also reveals the creature's **lowest saving throw** and all of its **weaknesses**. |  | ☐ |  |
| OM-09g | §5.2 Perfect Ledger | **Heightened (5th)** Every Recall Knowledge each target makes until the end of your next turn is a free action. |  | ☐ |  |

## Fixed Point (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-10a | §5.2 Fixed Point | ***Fixed Point*** ✦✦✦ (concentrate, prediction) |  | ☐ |  |
| OM-10b | §5.2 Fixed Point | **Area** 30-foot emanation · **Targets** up to 6 creatures you choose |  | ☐ |  |
| OM-10c | §5.2 Fixed Point | Name attack rolls, saving throws, or skill checks. |  | ☐ |  |
| OM-10d | §5.2 Fixed Point | Until the end of your next turn, the **first roll of that type** made by each chosen creature is treated as a **10** on the die, before modifiers. |  | ☐ |  |
| OM-10e | §5.2 Fixed Point | **Heightened (6th)** Name two roll types. |  | ☐ |  |

## Coiling Doubt (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-11a | §5.2 Coiling Doubt | ***Coiling Doubt*** ✦✦ (concentrate, misfortune, prediction) |  | ☐ |  |
| OM-11b | §5.2 Coiling Doubt | **Targets** up to 3 creatures within 30 feet · **Saving Throw** Will |  | ☐ |  |
| OM-11c | §5.2 Coiling Doubt | **Critical Success** Unaffected. |  | ☐ |  |
| OM-11d | §5.2 Coiling Doubt | **Success** The next attack roll or skill check the target attempts is rolled twice, taking the lower. |  | ☐ |  |
| OM-11e | §5.2 Coiling Doubt | **Failure** As success, but the first attack roll or skill check each round for **3 rounds**. |  | ☐ |  |
| OM-11f | §5.2 Coiling Doubt | **Critical Failure** As failure for **1 minute** |  | ☐ |  |
| OM-11g | §5.2 Coiling Doubt | the target is **stupefied 2** for the same minute. |  | ☐ |  |

## Hunted by the Sky (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-12a | §5.2 Hunted by the Sky | ***Hunted by the Sky*** ✦✦ (concentrate, prediction) |  | ☐ |  |
| OM-12b | §5.2 Hunted by the Sky | **Targets** 1 creature within 60 feet · **Duration** 1 minute |  | ☐ |  |
| OM-12c | §5.2 Hunted by the Sky | The target cannot be concealed or hidden from you. |  | ☐ |  |
| OM-12d | §5.2 Hunted by the Sky | You and your allies gain a +1 circumstance bonus to Seek and to Perception checks to find it |  | ☐ |  |
| OM-12e | §5.2 Hunted by the Sky | the **first attack made against it each round** gains a +1 circumstance bonus. |  | ☐ |  |
| OM-12f | §5.2 Hunted by the Sky | Your **Snarl** against it is **−3**, or **−4** once you have *Surer Thread*. |  | ☐ |  |
| OM-12g | §5.2 Hunted by the Sky | **Heightened (6th)** 2 creatures. |  | ☐ |  |

## Alms of Fate (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-13a | §5.2 Alms of Fate | ***Alms of Fate*** ✦ (concentrate, prediction) |  | ☐ |  |
| OM-13b | §5.2 Alms of Fate | **Targets** 2 allies within 30 feet |  | ☐ |  |
| OM-13c | §5.2 Alms of Fate | On each target's next damaging effect before the end of your next turn, they **reroll all 1s and 2s** on the damage dice and must keep the new results. |  | ☐ |  |
| OM-13d | §5.2 Alms of Fate | **Heightened (5th)** 3 allies. |  | ☐ |  |
| OM-13e | §5.2 Alms of Fate | **(9th)** Each target also **maximises one damage die** of their choice. |  | ☐ |  |

## Poured Knowing (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-14a | §5.2 Poured Knowing | ***Poured Knowing*** ✦✦ (concentrate, prediction) | `test-stargazer` pins it | ✅ | Live: two actions, `concentrate` and `prediction` |
| OM-14b | §5.2 Poured Knowing | **Targets** 2 allies within 30 feet · **Duration** 1 minute | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: one minute, on the targeted ally |
| OM-14c | §5.2 Poured Knowing | +2 status bonus to Arcana, Nature, Occultism, Religion and Society. | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: Arcana, Nature, Occultism, Religion and Society each **+2**; Crafting nothing |
| OM-14d | §5.2 Poured Knowing | Each target's **counteract checks** during the duration use your Stargazer DC and proficiency rank if higher than their own |  | ☐ |  |
| OM-14e | §5.2 Poured Knowing | count their counteract rank as **1 higher**. |  | ☐ |  |
| OM-14f | §5.2 Poured Knowing | **Heightened (+2)** +1 ally. |  | ☐ |  |

## Deep Dream (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-15a | §5.2 Deep Dream | ***Deep Dream*** ✦✦ (concentrate, prediction) | `test-stargazer` pins it | ✅ | Live: two actions, `concentrate` and `prediction` |
| OM-15b | §5.2 Deep Dream | **Targets** 2 allies within 30 feet · **Duration** 1 minute | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: one minute, on the targeted ally |
| OM-15c | §5.2 Deep Dream | +2 status bonus to Will saves and to Perception checks to disbelieve illusions. | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: Will **+2**, Perception against an illusion **+2**; plain Perception nothing |
| OM-15d | §5.2 Deep Dream | **Once** during the duration, a critical failure on a Will save becomes a failure. |  | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: a forced natural 1 on a Will save against DC 40 came out a **failure** and the reprieve was spent; the next was a critical failure |
| OM-15e | §5.2 Deep Dream | While the Augury lasts, a target is never off-guard merely for being unaware of a creature at the start of an encounter. |  | — | pf2e does not make a creature off-guard for being unaware at the start of an encounter, so there is nothing to lift |
| OM-15f | §5.2 Deep Dream | **Heightened (+2)** +1 ally. |  | ☐ |  |

## Borrowed Second (guide §5.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-16a | §5.2 Borrowed Second | ***Borrowed Second*** ✦✦ (concentrate, prediction) | `test-stargazer` pins it | ✅ | Live: two actions, `concentrate` and `prediction` |
| OM-16b | §5.2 Borrowed Second | **Targets** you and/or 1 willing ally within 30 feet | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: on Altair and the ally at once |
| OM-16c | §5.2 Borrowed Second | Each target immediately **Steps** or **Strides up to its Speed** as a free action |  | — | The Step or Stride is the target's own movement on the board; nothing to automate |
| OM-16d | §5.2 Borrowed Second | gains a +1 circumstance bonus to AC until the start of your next turn. | `test-stargazer` pins it | ✅ | Live, cast by Altair (19th) from the Star Chart at rank 10: **+1** circumstance to AC on Altair and on the ally; Far nothing |
| OM-16e | §5.2 Borrowed Second | **Heightened (5th)** 3 targets. |  | ☐ |  |
| OM-16f | §5.2 Borrowed Second | **(9th)** 5 targets. |  | ☐ |  |

## Which sign grants which (guide §5.3)

*One row per sign: the clause is the Augury that sign's Augury of the Day must grant. The grant itself —
added at the Night Vigil, gone at the next — is Night Vigil's, in the class tracker.*

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| OM-17a | §5.3 ♈ Aries | *First Blood* |  | ☐ |  |
| OM-17b | §5.3 ♉ Taurus | *Iron Auspice* | `test-stargazer` pins it | ✅ | Live: a Taurus Vigil gave Lyra *Iron Auspice*, filed into the Star Chart |
| OM-17c | §5.3 ♊ Gemini | *Two Roads* | `test-stargazer` pins it | ✅ | Live: the next night, Gemini, took *Iron Auspice* away and gave *Two Roads* |
| OM-17d | §5.3 ♋ Cancer | *Shell of Hours* |  | ☐ |  |
| OM-17e | §5.3 ♌ Leo | *Crown of Fire* |  | ☐ |  |
| OM-17f | §5.3 ♍ Virgo | *Perfect Ledger* |  | ☐ |  |
| OM-17g | §5.3 ♎ Libra | *Fixed Point* |  | ☐ |  |
| OM-17h | §5.3 ♏ Scorpio | *Coiling Doubt* |  | ☐ |  |
| OM-17i | §5.3 ♐ Sagittarius | *Hunted by the Sky* |  | ☐ |  |
| OM-17j | §5.3 ♑ Capricorn | *Alms of Fate* |  | ☐ |  |
| OM-17k | §5.3 ♒ Aquarius | *Poured Knowing* |  | ☐ |  |
| OM-17l | §5.3 ♓ Pisces | *Deep Dream* |  | ☐ |  |
| OM-17m | §5.3 ✦ Starless | *none — see Night Vigil* |  | ✅ | Live: a Starless Vigil at 5th granted nothing and offered no picker |
| OM-17n | §5.3 | Four Auguries (*Guiding Star*, *Borrowed Second*, *Death Foretold*, *The Hour Is Not Come*) belong to no sign and can only be learned permanently | `test-stargazer` pins it | ✅ | Live: the Starless picker at 13th offered **12** — the four with no sign are not among them |
| OM-17o | §5.3 | Nothing stops you learning an Augury the sky will also sometimes hand you |  | ✅ | Live: Altair, who knows *Iron Auspice*, rested on a Taurus day — the card said *"you already know it"* and there was still one copy |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 75 |
| ✅ | 38 |
| ⚠️ | 3 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 2 |
| **Total** | **118** |

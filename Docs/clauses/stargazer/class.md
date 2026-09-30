# Clauses — the Stargazer class

*Class tracker. Every independently-failable declaration the guide makes about what **every**
Stargazer has, whichever Path they walk. Source: `Docs/stargazer-guide-v3.md` §1.3 and §2.2 (the
profile), §3 (advancement), §4 (class features) and §10 (the rewind tiers).*

**Tier:** class · **Tracker issue:** #105

## How a row is marked

| Mark | Meaning |
| :-- | :-- |
| ☐ | Not yet driven |
| ✅ | Driven live; the clause happened by itself |
| ⚠️ | Driven live; partially happens — the gap is named in **Evidence** |
| ❌ | Driven live; does not happen |
| 🔧 | Was ❌ or ⚠️, a fix has landed, awaiting re-drive |
| — | Nothing to automate (pure roleplaying / GM ruling) |

**Clause** is a verbatim fragment of the guide (`Docs/stargazer-guide-v3.md`). `build/check-clauses.mjs`
asserts it still is one, so a paraphrase here or an edit to the guide fails the build. **Static check**
names the assertion that guards it; **Evidence** names what proved it happened at the table.

*How a clause is driven — the rig, the traps it sets and what a ✅ owes — is
`Docs/tools/live-verification.md`. It is the one copy; this file records results, not method.*

*Nothing is implemented yet.* Every row starts ☐, and the Stargazer is being built against these rows
rather than checked after the fact — a clause is done when it is ✅, not when its JSON exists.

*The class tier's own shape.* Two halves. The first is **numbers that must move at the right level** —
Perception to Legendary at 13th on a class that casts, Will to Legendary at 17th, and a Stargazer DC
that is a spell DC with **no spell slots behind it**, only a focus pool and five cantrips. Those fail
silently in a way no card announces. The second is the **engine**, and it has one hard part: three
features — *Fortune's Thread*, *Chart the Course* and *Speak the Portent* — act on another creature's
d20 **before it is rolled**, and Foundry resolves a roll the instant it is clicked. Whatever seam that
needs is the class's architecture proof, the way Red Substrates were the Assimilator's. The rest of the
engine reads the Sky that already ships: *Night Vigil* reads the queue, and *Forewarned* and
*Foreordained* soften a day per actor, which `SkyTracker.aspectFor` already does for *Shelter of the
Cloth*.

*Rows waiting on a ruling.* The rulings issue holds what the guide leaves undecided. Item **R5** (what
§11.3 and §11.7 say not to automate — the rewinds, the Portent's die, Chart the Course's free Thread)
decides whether `SG-35`, `SG-41`, `SG-45` and `SG-46` are built or end `—`. **R2** is `SG-34d` against
the Weaver's *Doubled Strand*. **R8** is the Exalted odds `SG-27` reads. **R12** is `SG-26b`: whether a
chart indoors is a Vigil or *Clouded Sky*. **R13** is `SG-33f`: Aid is a circumstance bonus too.

**IDs are `SG-<nn><letter>`**, one number per feature in guide order, a letter per clause. The
Auguries, the Paths, the feats and the Sky have trackers of their own beside this file.

---

## Profile and proficiencies (guide §1.3, §2.2, §3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SG-01 | §3 | **Key ability** Wisdom |  | ☐ |  |
| SG-02 | §3 | **HP** 8 + Con modifier per level |  | ☐ |  |
| SG-03 | §3 | **Initial proficiencies (1st):** Perception **Expert** |  | ☐ |  |
| SG-04 | §3 | Fortitude Trained · Reflex Trained · Will **Expert** |  | ☐ |  |
| SG-05 | §3 | Occultism and Astronomy Lore plus 4 others Trained |  | ☐ |  |
| SG-06 | §3 | unarmed and simple weapons Trained |  | ☐ |  |
| SG-07 | §3 | unarmoured defence and light armour Trained |  | ☐ |  |
| SG-08 | §3 | **Stargazer DC Trained** (Wisdom) |  | ☐ |  |
| SG-09 | §3 7th | **Expert Stargazer** (Stargazer DC expert) |  | ☐ |  |
| SG-10 | §3 7th | **Vigilant Senses** (Perception master) |  | ☐ |  |
| SG-11 | §1.3 | Fortitude Expert at 9 |  | ☐ |  |
| SG-12 | §3 11th | **Resolve** (Will master) |  | ☐ |  |
| SG-13 | §2.2 | Unarmed T@1, Simple T@1, Expert @11 |  | ☐ |  |
| SG-14 | §3 13th | **Incredible Senses** (Perception legendary) |  | ☐ |  |
| SG-15 | §1.3 | Reflex Expert at 13 |  | ☐ |  |
| SG-16 | §2.2 | Unarmored T@1, Light T@1, Expert @13 |  | ☐ |  |
| SG-17 | §3 15th | **Master Stargazer** (Stargazer DC master) |  | ☐ |  |
| SG-18 | §3 17th | **Greater Resolve** (Will legendary) |  | ☐ |  |
| SG-19 | §3 19th | **Legendary Stargazer** (Stargazer DC legendary) |  | ☐ |  |
| SG-20 | §9.8 | no weapon specialization, ever |  | ☐ |  |
| SG-21 | §7 | Stargazer feats come at 1, 2, 4, 6, 8, 10, 12, 14, 16, 18 and 20. |  | ☐ |  |
| SG-22 | §6 | Each grants an ability at **1st (50)**, **5th (30)**, **13th (70)** and **17th (70)** |  | ☐ |  |

## Star Chart (guide §4.1, §3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SG-23a | §4.1 | You gain a focus pool of **1 Focus Point** and the **Auguries** you learn from §5. |  | ☐ |  |
| SG-23b | §4.1 | their rank is always half your level rounded up, and they use your **Stargazer DC** and your Wisdom modifier for spell attack rolls and DCs. |  | ☐ |  |
| SG-23c | §4.1 | You **Refocus** by reading the sky, or your chart, for 10 minutes. |  | ☐ |  |
| SG-24a | §4.1 | You also know **5 occult cantrips**, chosen when you take the class, cast at will at a rank of half your level rounded up. |  | ☐ |  |
| SG-24b | §4.1 | You can change one cantrip during your daily preparations. |  | ☐ |  |
| SG-25 | §3 | Nine Auguries known, at 1, 5, 7, 9, 11, 13, 15, 17 and 19. |  | ☐ |  |

## Night Vigil (guide §4.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SG-26a | §4.2 | During your daily preparations, spend 10 minutes observing the sky. |  | ☐ |  |
| SG-26b | §4.2 | (Indoors, underground, or under cloud, you read your chart instead — see *Clouded Sky*.) |  | ☐ |  |
| SG-27 | §4.2 | **Certainty.** You learn today's sign *and* its aspect exactly. No check, no DC, no ambiguity. |  | ☐ |  |
| SG-28a | §4.2 | **The Forecast.** You learn the sign and aspect of the **next three days**. |  | ☐ |  |
| SG-28b | §4.2 | this answer does not change if you ask again — and neither does it change for the person you sell it to. |  | ☐ |  |
| SG-29a | §4.2 | **Augury of the Day.** You add the ascendant sign's Augury (§5.3) to your repertoire until your next daily preparations, **in addition** to the Auguries you know permanently. |  | ☐ |  |
| SG-29b | §4.2 | On a **Starless** sky you gain no Augury of the Day — but nothing is written, so you may roll your Portent twice and keep either result. |  | ☐ |  |
| SG-30a | §4.2 | **Forewarned.** You may spend a further 10 minutes briefing up to five allies. |  | ☐ |  |
| SG-30b | §4.2 | You and each ally who listens reduce the day's negative aspect by one step for the rest of the day: **Malefic → Retrograde**, **Retrograde → no effect**. |  | ☐ |  |
| SG-30c | §4.2 | Positive aspects are unchanged; you cannot improve a good sky, only survive a bad one. |  | ☐ |  |
| SG-31 | §4.2 | **GM override.** The GM may declare the day's sign and aspect instead of rolling, whenever the story wants it. |  | ☐ |  |
| SG-32 | §4.2 | **Clouded Sky.** If you cannot complete a Night Vigil you learn nothing, gain no Augury of the Day, get no forecast, and cannot use Forewarned. |  | ☐ |  |

## Fortune's Thread (guide §4.3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SG-33a | §4.3 | **Fortune's Thread** ⤾ **[reaction]** (concentrate, prediction) |  | ☐ |  |
| SG-33b | §4.3 | **Trigger** A creature within 30 feet that you can see is about to roll an attack roll, a saving throw, a skill check, or a Perception check. |  | ☐ |  |
| SG-33c | §4.3 | **Guide** — the triggering creature gains a **+1 circumstance bonus** to the roll. |  | ☐ |  |
| SG-33d | §4.3 | **Snarl** — the triggering creature takes a **−1 circumstance penalty** to the roll. |  | ☐ |  |
| SG-33e | §4.3 | Snarl can only be applied to an **attack roll, skill check, or Perception check**, never a saving throw. |  | ☐ |  |
| SG-33f | §4.3 | It stacks with *Courageous Anthem*, *Bless*, *Heroism* and Aid |  | ☐ |  |

## Chart the Course (guide §4.4)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SG-34a | §4.4 | **Chart the Course** ✦ **[one action]** (concentrate, prediction) |  | ☐ |  |
| SG-34b | §4.4 | Name one creature within 60 feet that you can see — **two creatures from 11th level**. |  | ☐ |  |
| SG-34c | §4.4 | Until the start of your next turn, the first time a named creature rolls a d20, you may use **Fortune's Thread** on that roll **without spending your reaction**. |  | ☐ |  |
| SG-34d | §4.4 | If you named two creatures you may do this once for each of them. |  | ☐ |  |
| SG-34e | §4.4 | You can have only one Chart the Course active at a time. |  | ☐ |  |

## Portent (guide §4.5)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SG-35a | §4.5 | When you complete a Night Vigil, roll a d20 and record the result. This is your **Portent**, and you know its value. |  | ☐ |  |
| SG-35b | §4.5 | **Speak the Portent** ✦ **[free action]** (prediction) |  | ☐ |  |
| SG-35c | §4.5 | **Frequency** once per day |  | ☐ |  |
| SG-35d | §4.5 | **Trigger** A creature within 60 feet that you can see is about to roll a d20 for an attack roll, a saving throw, or a skill check. |  | ☐ |  |
| SG-35e | §4.5 | The creature does not roll. Its d20 result **is** your recorded Portent, and the roll resolves normally from there. The Portent is spent. |  | ☐ |  |
| SG-35f | §4.5 | A Portent of 20 counts as a natural 20 and a Portent of 1 as a natural 1 |  | ☐ |  |
| SG-35g | §4.5 | Speak the Portent cannot be used on a roll already altered by a fortune or misfortune effect, and does not itself have those traits. |  | ☐ |  |
| SG-35h | §4.5 | A new Night Vigil overwrites an unspent Portent. |  | ☐ |  |

## Astronomy Lore (guide §4.6)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SG-36a | §4.6 | Your proficiency increases to **Expert at 3rd**, **Master at 7th** and **Legendary at 15th** |  | ☐ |  |
| SG-36b | §4.6 | you gain an extra skill feat at each of those levels, which must apply to Astronomy Lore or Occultism. |  | ☐ |  |
| SG-36c | §4.6 | Astronomy Lore covers celestial events, calendars, navigation by star, prophecy, and — at the GM's discretion — Recall Knowledge about *anything that has been foretold*. |  | ☐ |  |

## Widen the Sky (guide §4.7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SG-37a | §4.7 | Fortune's Thread's range increases to **60 feet** |  | ☐ |  |
| SG-37b | §4.7 | when you use it you may affect **two creatures** with the same reaction, in **any combination** — two Guides, two Snarls, or one of each. |  | ☐ |  |
| SG-37c | §4.7 | Both must be within range and you must be able to see both. |  | ☐ |  |
| SG-37d | §4.7 | It is still a single reaction, and Snarl's restriction to attack rolls, skill checks and Perception still applies. |  | ☐ |  |

## The Last Thing You See (guide §4.8)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SG-38a | §4.8 | **The Last Thing You See** ⤾ **[reaction]** (concentrate, emotion, fear, illusion, mental, prediction, visual) |  | ☐ |  |
| SG-38b | §4.8 | **Trigger** A creature within 30 feet that you can see deals damage to you. |  | ☐ |  |
| SG-38c | §4.8 | It attempts a Will save against your Stargazer DC. |  | ☐ |  |
| SG-38d | §4.8 | **Critical Success** It is unaffected and is temporarily immune for 10 minutes. |  | ☐ |  |
| SG-38e | §4.8 | **Success** Frightened 1. |  | ☐ |  |
| SG-38f | §4.8 | **Failure** Frightened 2. |  | ☐ |  |
| SG-38g | §4.8 | **Critical Failure** Frightened 3 and **stunned 1**. |  | ☐ |  |

## Second Star and Surer Thread (guide §4.9, §4.10)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SG-39 | §4.9 | Your focus pool increases to **2 Focus Points**. |  | ☐ |  |
| SG-40 | §4.10 | Fortune's Thread's bonus and penalty increase to **±2**. |  | ☐ |  |

## Unmake the Moment (guide §4.11)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SG-41a | §4.11 | **Unmake the Moment** ✦ **[free action]** (prediction) |  | ☐ |  |
| SG-41b | §4.11 | **Frequency** once per day (recharges on your next Night Vigil) |  | ☐ |  |
| SG-41c | §4.11 | **Trigger** Your turn begins. |  | ☐ |  |
| SG-41d | §4.11 | Time rewinds to the **start of your last turn**. |  | ☐ |  |
| SG-41e | §4.11 | Everything done since then by every creature is undone: damage dealt, conditions applied, spells cast, movement made, resources spent, reactions used. |  | ☐ |  |
| SG-41f | §4.11 | Creatures reduced to 0 Hit Points return to the Hit Points they had. |  | ☐ |  |
| SG-41g | §4.11 | Everyone except you loses all memory of the unwound round. |  | ☐ |  |
| SG-41h | §4.11 | you may spend 1 action on your turn to shout a warning, granting one ally a **+2 circumstance bonus** to their next roll this round. |  | ☐ |  |
| SG-41i | §4.11 | You are **stunned 1** and **drained 1** when the loop resolves. |  | ☐ |  |
| SG-41j | §4.11 | Initiative order does not change. |  | ☐ |  |
| SG-41k | §4.11 | Enemies act again as the GM chooses — they are not obliged to repeat what they did, and they do not remember it either. |  | ☐ |  |

## Constellation Mastery (guide §4.12)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SG-42a | §4.12 | During your Night Vigil you may swap today's **aspect** with the aspect of any of the next three days in your forecast. |  | ☐ |  |
| SG-42b | §4.12 | The two days exchange aspects; the signs do not move. |  | ☐ |  |
| SG-42c | §4.12 | the day you traded away is still coming. |  | ☐ |  |
| SG-42d | §4.12 | You and the allies you brief treat a negative aspect as **Benefic** instead of merely reducing it: **Retrograde → Benefic**, **Malefic → Benefic**. |  | ☐ |  |
| SG-42e | §4.12 | Exalted and Benefic days are unchanged |  | ☐ |  |
| SG-42f | §4.12 | **Starless.** On a Starless sky you may choose any sign's Augury as your Augury of the Day. |  | ☐ |  |

## Twin Fates and Threefold Thread (guide §4.13, §4.14)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SG-43a | §4.13 | Once per 10 minutes, when you use Fortune's Thread, you may instead make it a true **fortune** or **misfortune** effect for **up to two of its targets** |  | ☐ |  |
| SG-43b | §4.13 | each rolls twice and takes the higher result (Guide) or the lower result (Snarl). |  | ☐ |  |
| SG-43c | §4.13 | This replaces the bonus or penalty for those targets, and Snarl's restriction to attack rolls, skill checks and Perception still applies. |  | ☐ |  |
| SG-43d | §4.13 | If a fortune effect and a misfortune effect would apply to the same roll, the two cancel each other out. |  | ☐ |  |
| SG-44a | §4.14 | Fortune's Thread affects **three creatures** with a single reaction, in any combination of Guide and Snarl. |  | ☐ |  |
| SG-44b | §4.14 | *Twin Fates* still affects two. |  | ☐ |  |

## The rewind, Tiers 1 and 3 (guide §10.1, §10.3)

*Tier 2 is Unmake the Moment, above.*

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SG-45a | §10.1 The Dream | The Stargazer's Night Vigil produces **a vision the player does not get to interpret**. |  | ☐ |  |
| SG-45b | §10.1 The Dream | **The players keep every piece of information they learned** |  | ☐ |  |
| SG-45c | §10.1 The Dream | **Frequency:** once per adventure or arc, maximum, and only when the GM initiates. |  | ☐ |  |
| SG-46a | §10.3 | **Rewrite the Ending** ✦ **[free action]** (prediction) |  | ☐ |  |
| SG-46b | §10.3 | **Frequency** once per week |  | ☐ |  |
| SG-46c | §10.3 | **Trigger** You or an ally within 60 feet dies, or the party is defeated or captured. |  | ☐ |  |
| SG-46d | §10.3 | Time unwinds to the **moment initiative was rolled** for this encounter. |  | ☐ |  |
| SG-46e | §10.3 | All damage, conditions, deaths, expended spells, expended items and expended resources since that moment are restored, for every creature. |  | ☐ |  |
| SG-46f | §10.3 | each ally who was in the erased timeline gains a **+2 circumstance bonus to their initiative roll and to their first d20 roll** of the re-run encounter |  | ☐ |  |
| SG-46g | §10.3 | Your Star Chart goes dark. You are **drained 2** and **doomed 1** |  | ☐ |  |
| SG-46h | §10.3 | you lose Night Vigil, Fortune's Thread, Chart the Course, Portent, and all Auguries and Focus Points, until you complete a **full 8-hour Night Vigil under open sky**. |  | ☐ |  |
| SG-46i | §10.3 | Neither condition can be reduced before then by any means. |  | ☐ |  |
| SG-46j | §10.3 | You cannot use Rewrite the Ending again for 7 days regardless. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 111 |
| ✅ | 0 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **111** |

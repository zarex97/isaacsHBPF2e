# Clauses — Stargazer feats

*Feat tracker. Every class feat's independently-failable sentences, one row each. Source:
`Docs/stargazer-guide-v3.md` §7.*

**Tier:** feats · **Tracker issue:** #108

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

*The feats' own shape.* Most are ordinary pf2e feat content. Four families are not. The first
**modify a class feature and need a hook into it**: *Twin Portent*, *Second Portent* and *Fixed Sky*
all change how many Portents are recorded and spoken, so they owe the Portent a count it reads rather
than a number it assumes; and *Two Warnings* is a **second reaction restricted to three abilities**,
which pf2e has no shape for. The second **read the sky beyond today** — *Reckoning of Days*,
*Doubled Reading*, *Two Skies*, *Private Sign* — and v3.1 settled what they read: a history of past
days, the seven-day queue and no further, and a second aspect pre-rolled into each queue entry. The
third are **the rewind feats** — *Echo of the Unmade*, *The Long Vigil*, *Unbroken Chain*, *The Sky
Answers* — which hang off rewinds v3.1 builds rather than leaves to the table. The fourth are **GM
rulings** — *Cold Read*, *Cartographer of Endings* — and are likely `—`.

*Settled in v3.1* (#103): **R3** *Cascade* grants *Twin Fates* early (`SF-26`); **R4** *Omen of
Blades* is 2 plus 2 per rank (`SF-12b`); **R7** the sky reads above; **R11** three renames — *Second
Chance at Fate*, *Reckoning of Days*, *Private Sign*; **R15** *Fixed Sky* fixes one Portent and
*Foretold Escape* takes only attack rolls (`SF-34`, `SF-39`); and R17's smaller fixes to *Fate's
Favourite*, *Long Now* and *Star-Marked Enemy*.

**IDs are `SF-<nn><letter>`**, one number per feat in the guide's order, a letter per clause. A
sentence of pure fiction or design commentary — *"You might want it to succeed."*, *"You saw this."*
— is not a clause and has no row.

---

## 1st level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-01 | §7 Astrological Sign | Once per day, when you record your Portent, you may treat its value as any number within **3** of what you rolled. |  | ☐ |  |
| SF-02a | §7 Sky Reader | Your Night Vigil takes **1 minute** instead of 10 |  | ☐ |  |
| SF-02b | §7 Sky Reader | and Forewarned takes 1 minute instead of 10. |  | ☐ |  |
| SF-03a | §7 Companion of the Watch | You gain a familiar. |  | ☐ |  |
| SF-03b | §7 Companion of the Watch | It has the `celestial` trait |  | ☐ |  |
| SF-03c | §7 Companion of the Watch | and you gain one extra familiar ability, which must be an ability that gathers or carries information. |  | ☐ |  |
| SF-04a | §7 Cold Read | You can attempt a Deception check to invent a prophecy convincingly. |  | ☐ |  |
| SF-04b | §7 Cold Read | The GM rolls a secret Astronomy Lore check for you at the same time |  | ☐ |  |
| SF-04c | §7 Cold Read | on a critical success, you were **accidentally right**, and the GM should treat what you said as true. |  | ☐ |  |
| SF-05a | §7 Star-Touched Cantrip | You learn one additional occult cantrip |  | ☐ |  |
| SF-05b | §7 Star-Touched Cantrip | and may swap it during daily preparations. |  | ☐ |  |

## 2nd level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-06a | §7 Reckoning of Days | You can attempt an Astronomy Lore check to determine the sky of **yesterday** |  | ☐ |  |
| SF-06b | §7 Reckoning of Days | or of a day more than three days out, as far as the end of the seven-day queue, at the DCs in §8.4. |  | ☐ |  |
| SF-07a | §7 Twin Portent | Roll **two** d20s at your Night Vigil and record both as separate Portents. |  | ☐ |  |
| SF-07b | §7 Twin Portent | You must spend both before your next Vigil or lose them |  | ☐ |  |
| SF-07c | §7 Twin Portent | and *Speak the Portent*'s frequency becomes twice per day. |  | ☐ |  |
| SF-08a | §7 Thread of Warning | Fortune's Thread can trigger on an **initiative roll** |  | ☐ |  |
| SF-08b | §7 Thread of Warning | even though positions are not yet set and you may not be able to see the roller. |  | ☐ |  |
| SF-09 | §7 Augury Adept | You learn one additional Augury. |  | ☐ |  |
| SF-10 | §7 Patient Watcher | When you Refocus, you may also change one of your known Auguries. |  | ☐ |  |

## 4th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-11 | §7 Read the Room | Once per encounter, Sense Motive as a **free action**. |  | ☐ |  |
| SF-12a | §7 Omen of Blades | When you **Snarl** an attack roll and the attack still hits, you may spend 1 Focus Point to reduce the damage |  | ☐ |  |
| SF-12b | §7 Omen of Blades | by **2 plus 2 per your Stargazer DC proficiency rank** (so 4 at Trained, 6 at Expert, 8 at Master, 10 at Legendary). |  | ☐ |  |
| SF-13a | §7 Widened Chart | *Chart the Course* has a range of 120 feet |  | ☐ |  |
| SF-13b | §7 Widened Chart | and no longer requires you to see the creature, only to know where it is. |  | ☐ |  |
| SF-14a | §7 Borrowed Eyes | You can perform a Night Vigil through the senses of your familiar or a willing ally under an open sky |  | ☐ |  |
| SF-14b | §7 Borrowed Eyes | as long as you are within 1 mile of them. |  | ☐ |  |

## 6th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-15a | §7 Second Chance at Fate | Once per day, when a creature within 30 feet critically fails a check, you may have it reroll and use the new result. |  | ☐ |  |
| SF-15b | §7 Second Chance at Fate | This is a fortune effect. You might want it to succeed. |  | ☐ |  |
| SF-16a | §7 Sky Anchor | You can perform a Night Vigil with no sky at all. |  | ☐ |  |
| SF-16b | §7 Sky Anchor | *Clouded Sky* never applies to you. |  | ☐ |  |
| SF-17a | §7 Prophecy's Weight | You can **Demoralize** using Astronomy Lore |  | ☐ |  |
| SF-17b | §7 Prophecy's Weight | at 60 feet, with no auditory or visual requirement. |  | ☐ |  |
| SF-18 | §7 Long Thread | Fortune's Thread's range increases by 30 feet. |  | ☐ |  |

## 8th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-19 | §7 Conjunction | Your focus pool increases to **3 Focus Points**, the game's maximum. |  | ☐ |  |
| SF-20a | §7 Second Portent | You may *Speak the Portent* twice per day. |  | ☐ |  |
| SF-20b | §7 Second Portent | If you also have *Twin Portent*, you may speak three times, and you record three Portents. |  | ☐ |  |
| SF-21 | §7 Doubled Reading | Once per day you may take the **better** of two Auguries of the Day by reading both today's sign and tomorrow's. |  | ☐ |  |

## 10th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-22 | §7 Fate's Favourite | Once per day, treat one d20 roll **you** make as a **natural 20**. |  | ☐ |  |
| SF-23a | §7 Wide Vigil | Forewarned has no limit on the number of allies you may brief |  | ☐ |  |
| SF-23b | §7 Wide Vigil | and briefing takes 1 minute. |  | ☐ |  |
| SF-24 | §7 Unspent Thread | If you have not used your reaction by the start of your turn, your first *Chart the Course* that turn is a **free action**. |  | ☐ |  |
| SF-25a | §7 Two Warnings | You gain a **second reaction** each round |  | ☐ |  |
| SF-25b | §7 Two Warnings | usable only for **Fortune's Thread**, ***The Last Thing You See***, or ***The Hour Is Not Come***. |  | ☐ |  |

## 12th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-26a | §7 Cascade | You gain *Twin Fates* (§4.13) now, affecting **one** of its targets. |  | ☐ |  |
| SF-26b | §7 Cascade | From 15th level, when the class feature arrives, *Twin Fates* affects up to **three** of its targets instead of two. |  | ☐ |  |
| SF-27a | §7 Long Now | Your Auguries whose **Duration** line reads 1 minute last **10 minutes**. |  | ☐ |  |
| SF-27b | §7 Long Now | A duration inside a degree of success, such as *Coiling Doubt*'s critical failure, does not change. |  | ☐ |  |
| SF-28a | §7 Prophesied Ally | Choose one ally during your Night Vigil. |  | ☐ |  |
| SF-28b | §7 Prophesied Ally | Fortune's Thread used on that ally does not consume your reaction, once per round. |  | ☐ |  |

## 14th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-29a | §7 Inevitable | Once per day, ⤾ reaction, when a creature critically succeeds at a check against you, it gets a success instead. |  | ☐ |  |
| SF-29b | §7 Inevitable | This is a misfortune effect. |  | ☐ |  |
| SF-30a | §7 Star-Marked Enemy | Choose one creature you can see. |  | ☐ |  |
| SF-30b | §7 Star-Marked Enemy | Until your next daily preparations, *Coiling Doubt* and *Snarl* against it do not require line of sight, only knowledge of its location. |  | ☐ |  |
| SF-30c | §7 Star-Marked Enemy | For Snarl, this replaces Fortune's Thread's requirement that you can see the creature. |  | ☐ |  |
| SF-31a | §7 Echo of the Unmade | When you use *Unmake the Moment*, you may also grant **one ally** the memory of the erased round. |  | ☐ |  |
| SF-31b | §7 Echo of the Unmade | They keep it; everyone else does not. |  | ☐ |  |

## 16th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-32a | §7 Private Sign | Add a **fourteenth sign** to the wheel: your own. |  | ☐ |  |
| SF-32b | §7 Private Sign | Choose **one Augury** from §5.2 for it to grant and **one existing sign's domain** for it to govern |  | ☐ |  |
| SF-32c | §7 Private Sign | It rises only over you, on days the sky is Starless, and uses the standard aspect scaling. |  | ☐ |  |
| SF-32d | §7 Private Sign | Its aspect is rolled in advance with the day, as part of the seven-day queue. |  | ☐ |  |
| SF-33 | §7 Written in Advance | Spend 10 minutes. The next skill check you attempt within the hour is an automatic **success** (not a critical success). |  | ☐ |  |
| SF-34a | §7 Foretold Escape | Once per day, when an **attack roll** against you would deal damage that reduces you to 0 Hit Points, you may *Speak the Portent* on that attack roll even though it has already been rolled |  | ☐ |  |
| SF-34b | §7 Foretold Escape | even if your Portent is spent, and even if a fortune or misfortune effect altered it — using a value of 1. |  | ☐ |  |
| SF-34c | §7 Foretold Escape | It cannot be used on your own saving throw, or on damage no attack roll dealt. |  | ☐ |  |

## 18th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-35a | §7 Two Skies | During your Night Vigil, read the sky **twice**. |  | ☐ |  |
| SF-35b | §7 Two Skies | Both signs are ascendant for you and the allies you brief: you gain both Auguries of the Day |  | ☐ |  |
| SF-35c | §7 Two Skies | The second sign and its aspect are rolled in advance with the day, as part of the seven-day queue. |  | ☐ |  |
| SF-36 | §7 The Long Vigil | *Rewrite the Ending*'s cooldown drops to **3 days** if you have not used it at all during the current adventure. |  | ☐ |  |
| SF-37a | §7 Unbroken Chain | *Unmake the Moment* recharges on a 10-minute rest rather than on your Night Vigil |  | ☐ |  |
| SF-37b | §7 Unbroken Chain | but no more than once per hour. |  | ☐ |  |

## 20th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-38a | §7 Cartographer of Endings | Once per day, ask the GM **one yes-or-no question about the next 24 hours**. |  | ☐ |  |
| SF-38b | §7 Cartographer of Endings | The answer is true. |  | ☐ |  |
| SF-39a | §7 Fixed Sky | One of your Portents is always a **20**, and you may speak that one only **once per week**. |  | ☐ |  |
| SF-39b | §7 Fixed Sky | Any other Portents you record, from *Twin Portent* or *Second Portent*, are still rolled and spoken daily. |  | ☐ |  |
| SF-40a | §7 The Sky Answers | Once per day, when you would use *Rewrite the Ending*, you may instead use *Unmake the Moment* without spending its frequency |  | ☐ |  |
| SF-40b | §7 The Sky Answers | and *Rewrite the Ending* is not expended. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 77 |
| ✅ | 0 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **77** |

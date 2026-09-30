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
| SF-02a | §7 Sky Reader | Your Night Vigil takes **1 minute** instead of 10 |  | ✅ | Live, Altair (19th): his Vigil card read *(1 minute)*; Mira's and Deneb's, without the feat, *(10 minutes)* |
| SF-02b | §7 Sky Reader | and Forewarned takes 1 minute instead of 10. |  | ✅ | Live, Altair (19th): his Forewarned said *The briefing took 1 minute*; Mira's took 10 |
| SF-03a | §7 Companion of the Watch | You gain a familiar. |  | ✅ | Live, the Chassis (6th): taking the feat made *ZZ Stargazer Chassis's Watcher*, a familiar whose master is the Chassis. Mira, without it, has none |
| SF-03b | §7 Companion of the Watch | It has the `celestial` trait |  | ⚠️ | Live: the familiar carries `self:trait:celestial`, and a creature aiming at it reads `target:trait:celestial`. **Gap:** pf2e 8's familiar has no trait field (an `ActorTraits` rule on it is ignored), so the trait is a roll option, not a trait on the sheet |
| SF-03c | §7 Companion of the Watch | and you gain one extra familiar ability, which must be an ability that gathers or carries information. | `test-stargazer` pins it | ✅ | Live: the Chassis's familiar abilities went 0 → 1; which ability it is stays the player's choice |
| SF-04a | §7 Cold Read | You can attempt a Deception check to invent a prophecy convincingly. |  | ✅ | Live, Altair (19th): posting Cold Read rolled his Deception in the open |
| SF-04b | §7 Cold Read | The GM rolls a secret Astronomy Lore check for you at the same time |  | ✅ | Live, Altair (19th): beside it, a secret Astronomy Lore check against his level's DC (39), whispered to the GM only. **Fixed while driving:** a `rollMode` alone was posted in the open; it now carries the `secret` trait |
| SF-04c | §7 Cold Read | on a critical success, you were **accidentally right**, and the GM should treat what you said as true. |  | ✅ | Live, Altair (19th): a critical success whispered the GM *accidentally right — treat what they said as true*; a failure whispered nothing |
| SF-05a | §7 Star-Touched Cantrip | You learn one additional occult cantrip | `test-stargazer` pins it | ✅ | Live, the Chassis: the prompt offered 35 occult cantrips and *Guidance* was filed in the Star Chart. **Fixed while driving:** pf2e gives a spell no tradition roll option, so the list is written out |
| SF-05b | §7 Star-Touched Cantrip | and may swap it during daily preparations. |  | ✅ | Live, Mira: the Vigil card's *Star-Touched Cantrip: swap it* re-asked, and *Light* became *Message*, in the same feat slot and the Star Chart. **Fixed while driving:** a copy of the owned feat kept its answer and asked nothing |

## 2nd level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-06a | §7 Reckoning of Days | You can attempt an Astronomy Lore check to determine the sky of **yesterday** |  | ☐ |  |
| SF-06b | §7 Reckoning of Days | or of a day more than three days out, as far as the end of the seven-day queue, at the DCs in §8.4. |  | ☐ |  |
| SF-07a | §7 Twin Portent | Roll **two** d20s at your Night Vigil and record both as separate Portents. |  | ☐ |  |
| SF-07b | §7 Twin Portent | You must spend both before your next Vigil or lose them |  | ☐ |  |
| SF-07c | §7 Twin Portent | and *Speak the Portent*'s frequency becomes twice per day. |  | ☐ |  |
| SF-08a | §7 Thread of Warning | Fortune's Thread can trigger on an **initiative roll** | `test-stargazer` pins it | ✅ | Live, Altair (19th): the Thread picker offered *its next initiative roll*; ZZ Ally's initiative took **Guide +2** and spent it |
| SF-08b | §7 Thread of Warning | even though positions are not yet set and you may not be able to see the roller. |  | ✅ | Live, Altair (19th): ZZ Ally was 105 feet away, past his 90 — armed on initiative; the same Thread on a skill check was refused ("beyond 90 feet") |
| SF-09 | §7 Augury Adept | You learn one additional Augury. | `test-stargazer` pins it | ✅ | Live, the Chassis: the prompt offered the 15 Auguries and granted *Two Roads* into the Star Chart |
| SF-10 | §7 Patient Watcher | When you Refocus, you may also change one of your known Auguries. |  | ✅ | Live, Altair (19th): posting Patient Watcher swapped *Two Roads* for *Death Foretold* — granted by the same *Augury (7th)*, in the same entry, its selection moved — and a Refocus then offered the swap back. Mira's Refocus offered nothing. **Fixed while driving:** the ChoiceSet's own `selection` is what pf2e reads |

## 4th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-11 | §7 Read the Room | Once per encounter, Sense Motive as a **free action**. |  | ✅ | Live, Deneb (13th, in combat): posting Read the Room rolled Sense Motive (secret); a second use in the same encounter was refused |
| SF-12a | §7 Omen of Blades | When you **Snarl** an attack roll and the attack still hits, you may spend 1 Focus Point to reduce the damage |  | ✅ | Live, Altair (19th): the foe's Snarled Claw hit Deneb and offered *Omen of Blades*; spending it took his Focus 2 → 1. An unSnarled hit offered nothing |
| SF-12b | §7 Omen of Blades | by **2 plus 2 per your Stargazer DC proficiency rank** (so 4 at Trained, 6 at Expert, 8 at Master, 10 at Legendary). | `test-stargazer` pins it | ✅ | Live, Altair (19th), Legendary: a 15-point hit dealt **5** and the resistance went with it; the next 15 dealt 15 |
| SF-13a | §7 Widened Chart | *Chart the Course* has a range of 120 feet | `test-stargazer` pins it | ✅ | Live, Altair (19th): Chart the Course armed ZZ Ally at 105 feet; Deneb's, without it, was refused at 90 ("beyond 60") |
| SF-13b | §7 Widened Chart | and no longer requires you to see the creature, only to know where it is. |  | — | The module never asks whether you can see a Thread's target (#116), so there is no sight requirement to lift |
| SF-14a | §7 Borrowed Eyes | You can perform a Night Vigil through the senses of your familiar or a willing ally under an open sky |  | ☐ |  |
| SF-14b | §7 Borrowed Eyes | as long as you are within 1 mile of them. |  | ☐ |  |

## 6th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-15a | §7 Second Chance at Fate | Once per day, when a creature within 30 feet critically fails a check, you may have it reroll and use the new result. | `test-stargazer` pins it | ✅ | Live, Altair (19th): the foe's critical failure 10 feet away offered the button; the reroll replaced it and the frequency went 1 → 0, and the next critical failure offered nothing. ZZ Ally's, 105 feet away, offered nothing |
| SF-15b | §7 Second Chance at Fate | This is a fortune effect. You might want it to succeed. | `test-stargazer` pins it | ✅ | A roll a fortune effect already touched is refused (pinned); Sentence Passed's reroll guard refuses it too |
| SF-16a | §7 Sky Anchor | You can perform a Night Vigil with no sky at all. |  | ✅ | Live, Altair (19th): under a clouded sky his Vigil read the day and the forecast |
| SF-16b | §7 Sky Anchor | *Clouded Sky* never applies to you. |  | ✅ | Live: the same night Mira got *Clouded Sky* and nothing else |
| SF-17a | §7 Prophecy's Weight | You can **Demoralize** using Astronomy Lore |  | ✅ | Live, Altair (19th): Prophecy's Weight rolled Demoralize as **Astronomy Lore**, `1d20 + 27` |
| SF-17b | §7 Prophecy's Weight | at 60 feet, with no auditory or visual requirement. |  | ✅ | Live, Altair (19th): no auditory trait and no Unintelligible −4 — The Announcement's stage, read by the same roll option |
| SF-18 | §7 Long Thread | Fortune's Thread's range increases by 30 feet. | `test-stargazer` pins it | ✅ | Live, Altair (19th): his Thread reached 90 feet (Widen the Sky's 60 plus 30) and refused 105 |

## 8th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-19 | §7 Conjunction | Your focus pool increases to **3 Focus Points**, the game's maximum. | `test-stargazer` pins it | ✅ | Live, Altair (19th): focus max **3**; Deneb, without it, 2 |
| SF-20a | §7 Second Portent | You may *Speak the Portent* twice per day. |  | ☐ |  |
| SF-20b | §7 Second Portent | If you also have *Twin Portent*, you may speak three times, and you record three Portents. |  | ☐ |  |
| SF-21 | §7 Doubled Reading | Once per day you may take the **better** of two Auguries of the Day by reading both today's sign and tomorrow's. |  | ☐ |  |

## 10th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-22 | §7 Fate's Favourite | Once per day, treat one d20 roll **you** make as a **natural 20**. | `test-stargazer` pins it | ✅ | Live, Altair (19th): posting it armed *Effect: Fate's Favourite* (frequency 1 → 0); his next Reflex save was `20 + 23`, a natural 20 (43 vs DC 40: a critical success), and the one after rolled a die. A second use that day was refused. **Fixed while driving:** `SubstituteRoll` takes one selector string; it is `all` |
| SF-23a | §7 Wide Vigil | Forewarned has no limit on the number of allies you may brief |  | ✅ | Live, Deneb (13th, in combat): her card offered *brief any number of allies*, and eight were briefed; Mira's offered *up to 5* |
| SF-23b | §7 Wide Vigil | and briefing takes 1 minute. |  | ✅ | Live, Deneb (13th, in combat): *The briefing took 1 minute* |
| SF-24 | §7 Unspent Thread | If you have not used your reaction by the start of your turn, your first *Chart the Course* that turn is a **free action**. |  | ✅ | Live, Deneb (13th, in combat): a turn that began with a Thread still pending said nothing; the next, with her reaction unused, whispered *Unspent Thread*, and her first Chart the Course said *A free action* — the second did not |
| SF-25a | §7 Two Warnings | You gain a **second reaction** each round | `test-stargazer` pins it | ✅ | Live, Deneb (13th, in combat): two Threads went pending in one round and a third was refused ("no reaction left") |
| SF-25b | §7 Two Warnings | usable only for **Fortune's Thread**, ***The Last Thing You See***, or ***The Hour Is Not Come***. |  | ✅ | The module counts reactions only for Fortune's Thread, The Last Thing You See and The Hour Is Not Come, so the second reaction can go nowhere else |

## 12th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-26a | §7 Cascade | You gain *Twin Fates* (§4.13) now, affecting **one** of its targets. | `test-stargazer` pins it | ✅ | Live, Deneb (13th, in combat), without the class feature: Twin Fates on one of two targets armed; on both it was refused ("up to one") |
| SF-26b | §7 Cascade | From 15th level, when the class feature arrives, *Twin Fates* affects up to **three** of its targets instead of two. | `test-stargazer` pins it | ✅ | Live, Altair (19th), with the class feature: Twin Fates on three of four armed; on all four it was refused ("up to three") |
| SF-27a | §7 Long Now | Your Auguries whose **Duration** line reads 1 minute last **10 minutes**. |  | ☐ |  |
| SF-27b | §7 Long Now | A duration inside a degree of success, such as *Coiling Doubt*'s critical failure, does not change. |  | ☐ |  |
| SF-28a | §7 Prophesied Ally | Choose one ally during your Night Vigil. |  | ✅ | Live, Deneb (13th, in combat): the Vigil card's *Prophesied Ally* chose ZZ SG Ally |
| SF-28b | §7 Prophesied Ally | Fortune's Thread used on that ally does not consume your reaction, once per round. |  | ✅ | Live, Deneb (13th, in combat): a Thread on that ally alone said *No reaction: the Prophesied Ally* and left nothing pending; the next that round cost a reaction, as did one on Mira |

## 14th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-29a | §7 Inevitable | Once per day, ⤾ reaction, when a creature critically succeeds at a check against you, it gets a success instead. | `test-stargazer` pins it | ✅ | Live, Altair (19th): the foe's critical success against him offered *Inevitable*; using it made the card a **success** and the frequency 1 → 0; the next critical success that day offered nothing |
| SF-29b | §7 Inevitable | This is a misfortune effect. | `test-stargazer` pins it | ✅ | The feat carries `misfortune` (pinned) |
| SF-30a | §7 Star-Marked Enemy | Choose one creature you can see. |  | ✅ | Live, Altair (19th): with two targets it asked for one; with the foe targeted it marked the foe; marking Mira took the foe's mark off |
| SF-30b | §7 Star-Marked Enemy | Until your next daily preparations, *Coiling Doubt* and *Snarl* against it do not require line of sight, only knowledge of its location. |  | ⚠️ | Live, Altair (19th): the mark lasted until his next Vigil, which removed it. **Gap:** nothing asks for line of sight yet (#116), so the mark has nothing to lift |
| SF-30c | §7 Star-Marked Enemy | For Snarl, this replaces Fortune's Thread's requirement that you can see the creature. |  | — | As SF-30b: Fortune's Thread's "that you can see" is not checked (#116) |
| SF-31a | §7 Echo of the Unmade | When you use *Unmake the Moment*, you may also grant **one ally** the memory of the erased round. |  | ☐ |  |
| SF-31b | §7 Echo of the Unmade | They keep it; everyone else does not. |  | ☐ |  |

## 16th level (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SF-32a | §7 Private Sign | Add a **fourteenth sign** to the wheel: your own. |  | ☐ |  |
| SF-32b | §7 Private Sign | Choose **one Augury** from §5.2 for it to grant and **one existing sign's domain** for it to govern |  | ☐ |  |
| SF-32c | §7 Private Sign | It rises only over you, on days the sky is Starless, and uses the standard aspect scaling. |  | ☐ |  |
| SF-32d | §7 Private Sign | Its aspect is rolled in advance with the day, as part of the seven-day queue. |  | ☐ |  |
| SF-33 | §7 Written in Advance | Spend 10 minutes. The next skill check you attempt within the hour is an automatic **success** (not a critical success). | `test-stargazer` pins it | ✅ | Live, Altair (19th): posting it armed *Effect: Written in Advance*; his next Athletics — a natural 1 against DC 40 — read **success**, and the one after failed as it should. A natural 20 against DC 10 read success, not critical success |
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
| SF-38a | §7 Cartographer of Endings | Once per day, ask the GM **one yes-or-no question about the next 24 hours**. |  | — | The question and its answer are the table's; the feat carries its once-per-day frequency |
| SF-38b | §7 Cartographer of Endings | The answer is true. |  | — | The answer is the GM's |
| SF-39a | §7 Fixed Sky | One of your Portents is always a **20**, and you may speak that one only **once per week**. |  | ☐ |  |
| SF-39b | §7 Fixed Sky | Any other Portents you record, from *Twin Portent* or *Second Portent*, are still rolled and spoken daily. |  | ☐ |  |
| SF-40a | §7 The Sky Answers | Once per day, when you would use *Rewrite the Ending*, you may instead use *Unmake the Moment* without spending its frequency |  | ☐ |  |
| SF-40b | §7 The Sky Answers | and *Rewrite the Ending* is not expended. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 32 |
| ✅ | 39 |
| ⚠️ | 2 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 4 |
| **Total** | **77** |

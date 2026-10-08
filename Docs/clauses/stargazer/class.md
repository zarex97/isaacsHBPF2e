# Clauses — the Stargazer class

*Class tracker. Every independently-failable declaration the guide makes about what **every**
Stargazer has, whichever Path they walk. Source: `Docs/stargazer-guide-v3.md` §1.3 and §2.2 (the
profile), §3 (advancement), §4 (class features), §10 (the rewind tiers) and §11 (the build rulings v3.1 added).*

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

*Settled in v3.1* (#103). **R5** builds the rewinds, the Portent's die and Chart the Course's free
Thread, so `SG-35`, `SG-41` and `SG-46` are built and only *The Dream* (`SG-45`) is expected to end `—`;
how they behave is the *Build rulings* section at the foot, and ADR-0004. **R12** makes a chart indoors
*Clouded Sky*, marked by the GM (`SG-26b`, `SG-32b`). **R13** takes Aid out of the stacking list
(`SG-33f`, `SG-33g`).

**IDs are `SG-<nn><letter>`**, one number per feature in guide order, a letter per clause. The
Auguries, the Paths, the feats and the Sky have trackers of their own beside this file.

---

## Profile and proficiencies (guide §1.3, §2.2, §3)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SG-01 | §3 | **Key ability** Wisdom | effect:class-profile | `test-stargazer` pins it | ✅ | Live: the class item's key attribute reads **`wis`**, and the Stargazer DC at 1st is **14** — 10 + trained 3 + Wis +1 |
| SG-02 | §3 | **HP** 8 + Con modifier per level | effect:class-profile · scaling:from-level | `test-stargazer` pins it | ✅ | Live: **8 / 16 / 24 … 160** Hit Points at levels 1, 2, 3 … 20 on a character with no ancestry and Con +0 — eight per level, flat |
| SG-03 | §3 | **Initial proficiencies (1st):** Perception **Expert** | effect:class-profile | `test-stargazer` pins it | ✅ | Live: Perception rank **2** at 1st |
| SG-04 | §3 | Fortitude Trained · Reflex Trained · Will **Expert** | effect:class-profile | `test-stargazer` pins it | ✅ | Live: Fortitude **1**, Reflex **1**, Will **2** at 1st |
| SG-05 | §3 | Occultism and Astronomy Lore plus 4 others Trained | effect:class-profile | `test-stargazer` pins it | ✅ | Live at 1st: Occultism rank **1** and Astronomy Lore rank **1**. **Fixed while driving:** the Lore sat in the class's grant list and never arrived — a class grants feats and nothing else — so it rides on Star Chart's `GrantItem`, as the Soulbound's Spirit Lore does. The four further skills are the class item's `trainedSkills.additional: 4`, which pf2e offers at creation |
| SG-06 | §3 | unarmed and simple weapons Trained | effect:class-profile | `test-stargazer` pins it | ✅ | Live at 1st: simple **1**, unarmed **1**, martial **0** |
| SG-07 | §3 | unarmoured defence and light armour Trained | effect:class-profile | `test-stargazer` pins it | ✅ | Live at 1st: unarmored **1**, light **1**, medium **0** |
| SG-08 | §3 | **Stargazer DC Trained** (Wisdom) | effect:class-profile · check:class-dc | `test-stargazer` pins it | ✅ | Live at 1st: a **Stargazer** class DC exists, rank **1**, DC **14**, and the **Star Chart** entry — occult, focus, `proficiency.slug: stargazer` — reads the same **14**. One entry, never two |
| SG-09 | §3 7th | **Expert Stargazer** (Stargazer DC expert) | effect:class-profile · scaling:from-level | `test-stargazer` pins it | ✅ | Live at the boundary: Stargazer DC rank **1 at 6th** (DC 19), **2 at 7th** (DC 22); spellcasting rank rises with it; the Star Chart DC matches at every level |
| SG-10 | §3 7th | **Vigilant Senses** (Perception master) | effect:class-profile · scaling:from-level | `test-stargazer` pins it | ✅ | Live at the boundary: Perception **2 at 6th**, **3 at 7th** |
| SG-11 | §1.3 | Fortitude Expert at 9 | effect:class-profile · scaling:from-level | `test-stargazer` pins it | ✅ | Live at the boundary: Fortitude **1 at 8th**, **2 at 9th** |
| SG-12 | §3 11th | **Resolve** (Will master) | effect:class-profile · scaling:from-level | `test-stargazer` pins it | ✅ | Live at the boundary: Will **2 at 10th**, **3 at 11th** |
| SG-13 | §2.2 | Unarmed T@1, Simple T@1, Expert @11 | effect:class-profile · scaling:from-level | `test-stargazer` pins it | ✅ | Live at the boundary: simple and unarmed **1 at 10th**, **2 at 11th**; martial **0** at 20th |
| SG-14 | §3 13th | **Incredible Senses** (Perception legendary) | effect:class-profile · scaling:from-level | `test-stargazer` pins it | ✅ | Live at the boundary: Perception **3 at 12th**, **4 at 13th** |
| SG-15 | §1.3 | Reflex Expert at 13 | effect:class-profile · scaling:from-level | `test-stargazer` pins it | ✅ | Live at the boundary: Reflex **1 at 12th**, **2 at 13th** |
| SG-16 | §2.2 | Unarmored T@1, Light T@1, Expert @13 | effect:class-profile · scaling:from-level | `test-stargazer` pins it | ✅ | Live at the boundary: light and unarmored **1 at 12th**, **2 at 13th**; medium **0** at 20th. pf2e's own *Armor Expertise* would raise medium and heavy too, so the class's is its own |
| SG-17 | §3 15th | **Master Stargazer** (Stargazer DC master) | effect:class-profile · scaling:from-level | `test-stargazer` pins it | ✅ | Live at the boundary: Stargazer DC rank **2 at 14th** (DC 29), **3 at 15th** (DC 32) |
| SG-18 | §3 17th | **Greater Resolve** (Will legendary) | effect:class-profile · scaling:from-level | `test-stargazer` pins it | ✅ | Live at the boundary: Will **3 at 16th**, **4 at 17th**. pf2e's own *Greater Resolve* also improves a critical failure; the class's raises the rank only, as the guide says |
| SG-19 | §3 19th | **Legendary Stargazer** (Stargazer DC legendary) | effect:class-profile · scaling:from-level | `test-stargazer` pins it | ✅ | Live at the boundary: Stargazer DC rank **3 at 18th** (DC 35), **4 at 19th** (DC 38) |
| SG-20 | §9.8 | no weapon specialization, ever | effect:class-profile | `test-stargazer` pins it | ✅ | Live at 20th, simple weapons expert: a club Strike's damage is **`1d6 bludgeoning`** — no specialization bonus, and no specialization feature was ever granted |
| SG-21 | §7 | Stargazer feats come at 1, 2, 4, 6, 8, 10, 12, 14, 16, 18 and 20. | effect:class-profile · scaling:from-level | `test-stargazer` pins it | ✅ | Live at 6th: class feat slots at **1, 2, 4, 6** |
| SG-22 | §6 | Each grants an ability at **1st (50)**, **5th (30)**, **13th (70)** and **17th (70)** | scaling:from-level · effect:feature-granted | `test-stargazer` pins it | ✅ | Live: the Chassis (6th) chose *The Herald* from the Stargazer's Path prompt and got Herald's Omen and The Announcement; at 13th Sentence Passed arrived, at 17th Foregone Conclusion, and back at 6th both went. Altair, Vega, Deneb and Mira took the other three |

## Star Chart (guide §4.1, §3)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SG-23a | §4.1 | You gain a focus pool of **1 Focus Point** and the **Auguries** you learn from §5. | economy:charges · effect:feature-granted | `test-stargazer` pins it | ✅ | Live: focus pool **1** at 1st (cap 1); a stored 1 holds and a stored 0 holds. **Fixed while driving:** pf2e clamps the value to its own derived maximum — 0 with no Auguries — before the pool is pinned to its cap, so a stored 1 read back 0; the pin now re-reads the source. The Soulbound has the same bug: #114 |
| SG-23b | §4.1 | their rank is always half your level rounded up, and they use your **Stargazer DC** and your Wisdom modifier for spell attack rolls and DCs. | scaling:from-level · check:class-dc | `test-stargazer` pins it | ✅ | Live: the Star Chart's DC is the Stargazer DC at every level and its attribute Wis; the nine known Auguries read **rank 10** at 19th |
| SG-23c | §4.1 | You **Refocus** by reading the sky, or your chart, for 10 minutes. | effect:resource-regained | | ✅ | Live: Mira at 0 of 2 posted Refocus three times — 1, then 2, then still 2. **Built this pass:** pf2e's Refocus is text only and restored nothing |
| SG-24a | §4.1 | You also know **5 occult cantrips**, chosen when you take the class, cast at will at a rank of half your level rounded up. | scaling:from-level · effect:feature-granted | | ✅ | Live at 6th: pf2e's *Daze* added to the Star Chart is filed there as a cantrip at rank **3** (half of 6, rounded up), and casting it left the focus pool at **0 → 0** — at will |
| SG-24b | §4.1 | You can change one cantrip during your daily preparations. | effect:feature-granted · when:preparations | | ✅ | Live: the Vigil card's *Change one cantrip* offered Mira's own Daze (not the Star-Touched Message) and learned Light in its place, in the Star Chart; a second change at the same Vigil was refused. **Built this pass** |
| SG-25 | §3 | Nine Auguries known, at 1, 5, 7, 9, 11, 13, 15, 17 and 19. | scaling:from-level · effect:feature-granted | `test-stargazer` pins it | ✅ | Live: nine prompts — one at 1st, eight on the way to 19th — each offering the Auguries; each choice was filed into the Star Chart. The pool stayed **2**, not nine |

## Night Vigil (guide §4.2)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SG-26a | §4.2 | During your daily preparations, spend 10 minutes observing the sky. | when:preparations | | ✅ | Live: *Rest for the Night* ran the Vigil by itself and whispered the card to the Stargazer's owner (one recipient) |
| SG-26b | §4.2 | (Indoors, underground or under cloud there is no sky to observe, and your chart is not a substitute — see *Clouded Sky*.) | economy:requires | | ✅ | Live: with the GM's *clouded tonight* set, the Vigil said *Clouded Sky* — the chart is not a substitute. Ruling R12 |
| SG-27 | §4.2 | **Certainty.** You learn today's sign *and* its aspect exactly. No check, no DC, no ambiguity. | effect:info · effect:calendar | | ✅ | Live: the GM set Taurus, Malefic; the card read **Today: ♉ Taurus, Malefic** |
| SG-28a | §4.2 | **The Forecast.** You learn the sign and aspect of the **next three days**. | effect:info · effect:calendar | `test-stargazer` pins it | ✅ | Live: the card listed days 228–230 — **Starless, Malefic · Capricorn, Malefic · Virgo, Quiet** — exactly the tracker's queue |
| SG-28b | §4.2 | this answer does not change if you ask again — and neither does it change for the person you sell it to. | effect:info · effect:calendar | | ✅ | Live: a second rest produced the identical forecast, because it reads the pre-rolled queue |
| SG-29a | §4.2 | **Augury of the Day.** You add the ascendant sign's Augury (§5.3) to your repertoire until your next daily preparations, **in addition** to the Auguries you know permanently. | ending:preparations · effect:feature-granted · when:preparations | | ✅ | Live: a Taurus Vigil added *Iron Auspice* to Lyra's Star Chart, flagged as the day's; the next Vigil took it away; a clouded one granted nothing |
| SG-29b | §4.2 | On a **Starless** sky you gain no Augury of the Day — but nothing is written, so you may roll your Portent twice and keep either result. | check:roll-twice | | ✅ | Live: on a Starless day the card offered two Portents, **18** and **3**, and clicking *Keep 3* recorded 3. No Augury of the Day is granted on Starless (none exist yet either — phase 4) |
| SG-30a | §4.2 | **Forewarned.** You may spend a further 10 minutes briefing up to five allies. | reach:up-to-n · reach:allies | `test-stargazer` pins it | ✅ | Live: the card's *Forewarned* button opened the ally picker; checking the ally and confirming briefed Lyra and the ally. Five is the limit (pinned); a second briefing the same day is refused |
| SG-30b | §4.2 | You and each ally who listens reduce the day's negative aspect by one step for the rest of the day: **Malefic → Retrograde**, **Retrograde → no effect**. | reach:allies · ending:preparations · effect:severity-step | | ✅ | Live, clear of any Saint's Shelter: on a Malefic day Lyra and the briefed ally wore **Sky: Retrograde** while unbriefed Far wore **Sky: Malefic**; on a Retrograde day the two wore nothing and Far wore Retrograde; the next day it had lapsed |
| SG-30c | §4.2 | Positive aspects are unchanged; you cannot improve a good sky, only survive a bad one. | effect:severity-step | | ✅ | Live: on Exalted and Benefic days the briefed and the control wore the same effect |
| SG-31 | §4.2 | **GM override.** The GM may declare the day's sign and aspect instead of rolling, whenever the story wants it. | effect:calendar | | ✅ | Live: the GM set the day's sign and aspect from the tracker, and every creature's Sky effect followed |
| SG-32a | §4.2 | **Clouded Sky.** If you cannot complete a Night Vigil you learn nothing, gain no Augury of the Day, get no forecast, and cannot use Forewarned. | economy:requires | | ✅ | Live: the clouded Vigil's card said so, carried no forecast and no buttons, and the Portent stayed **7** — none was rolled |
| SG-32b | §4.2 | The GM marks a clouded night on the Sky tracker, for the whole world, one night at a time. | effect:calendar | | ✅ | Live: the tracker window's button set *Clouded tonight*; advancing the day cleared it |

## Fortune's Thread (guide §4.3)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SG-33a | §4.3 | **Fortune's Thread** ⤾ **[reaction]** (concentrate, prediction) | economy:reaction | | ✅ | Live: a reaction on the sheet with `concentrate` and `prediction`; posting it opened the picker — Guide or Snarl per targeted creature, the roll kind, and Twin Fates at 15th |
| SG-33b | §4.3 | **Trigger** A creature within 30 feet that you can see is about to roll an attack roll, a saving throw, a skill check, or a Perception check. | when:check-rolled · economy:reaction · reach:single | `test-stargazer` pins it | ✅ | Live: armed in advance on the creature (ADR-0004) and spent by its next matching roll; 90 feet refused against 60; immunity to `prediction` refused. **Fixed (#116):** a sight check stands beside range and immunity. Live, Altair: a Guide on Deneb behind a sight-blocking wall was refused (*out of sight*), and with the wall gone armed; refused on Deneb invisible, on Deneb hidden, and with Altair blinded; Mira, in plain view, armed |
| SG-33c | §4.3 | **Guide** — the triggering creature gains a **+1 circumstance bonus** to the roll. | effect:bonus · ending:spent | `test-stargazer` pins it | ✅ | Live at 17th: an ally's skill check took **Guide +2** (circumstance) and the effect was gone after it; the control roll straight after was bare `1d20`. +1 below 9th is pinned statically |
| SG-33d | §4.3 | **Snarl** — the triggering creature takes a **−1 circumstance penalty** to the roll. | effect:penalty · ending:spent | `test-stargazer` pins it | ✅ | Live at 17th: the foe's skill check rolled **`1d20 - 2`** and the Snarl was spent |
| SG-33e | §4.3 | Snarl can only be applied to an **attack roll, skill check, or Perception check**, never a saving throw. | when:check-rolled · effect:penalty | `test-stargazer` pins it | ✅ | Live: a Snarl armed on the foe was **not** applied to its Will save (`1d20 + 8`, still armed) and fired on its next skill check; arming a Snarl on saving throws is refused outright |
| SG-33f | §4.3 | It stacks with *Courageous Anthem*, *Bless* and *Heroism*, which are status bonuses | effect:bonus | | ✅ | Live: Deneb's Strike under Bless and a Guide took both — *Bless +1 status* and *Guide +2 circumstance* |
| SG-33g | §4.3 | It does **not** stack with Aid, which is a circumstance bonus too; the higher of the two applies. | effect:bonus | | ✅ | Live: an ally holding Aid (+1 circumstance) and a Guide (+2) rolled `1d20 + 2` — **Aid off, Guide on**; the higher circumstance bonus applies |

## Chart the Course (guide §4.4)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SG-34a | §4.4 | **Chart the Course** ✦ **[one action]** (concentrate, prediction) | when:cast | | ✅ | Live: a one-action item with `concentrate` and `prediction`; Chart's Threads armed with the reaction already spent |
| SG-34b | §4.4 | Name one creature within 60 feet that you can see — **two creatures from 11th level**. | reach:up-to-n · scaling:from-level | `test-stargazer` pins it | ✅ | Live at 17th: two creatures named, 20 and 10 feet away. One below 11th and 60 feet are pinned statically |
| SG-34c | §4.4 | Until the start of your next turn, the first time a named creature rolls a d20, you may use **Fortune's Thread** on that roll **without spending your reaction**. | when:check-rolled · economy:granted-action · ending:next-turn · ending:spent | `test-stargazer` pins it | ✅ | Live: with the reaction already spent, the ally's first d20 took **Guide +2** and the reaction count did not move |
| SG-34d | §4.4 | If you named two creatures you may do this once for each of them. | economy:granted-action · economy:once-per-target | | ✅ | Live: two named creatures, one free Thread each — the foe's was spent on its first d20, the ally's on its own |
| SG-34e | §4.4 | You can have only one Chart the Course active at a time. | ending:replaces-previous | | ✅ | Live: a second Chart the Course removed the first one's Thread from the ally and armed its own on the foe |

## Portent (guide §4.5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SG-35a | §4.5 | When you complete a Night Vigil, roll a d20 and record the result. This is your **Portent**, and you know its value. | when:preparations | | ✅ | Live: *Rest for the Night* recorded a Portent of **6** and posted it as a GM roll to the Stargazer |
| SG-35b | §4.5 | **Speak the Portent** ✦ **[free action]** (prediction) | when:cast | | ✅ | Live: a free action with `prediction` on the sheet; speaking it armed the Portent on the targeted creature |
| SG-35c | §4.5 | **Frequency** once per day | economy:frequency | `test-stargazer` pins it | ✅ | Live: Mira, with one Portent, spoke it once; after it was spent, posting Portent again opened no picker |
| SG-35d | §4.5 | **Trigger** A creature within 60 feet that you can see is about to roll a d20 for an attack roll, a saving throw, or a skill check. | when:check-rolled · reach:single | `test-stargazer` pins it | ✅ | Live: spoken over a skill check 20 feet away, with the same range and immunity refusals as a Thread. **Fixed (#116):** refused on Deneb invisible (*you cannot see it*), and spoken on her once visible |
| SG-35e | §4.5 | The creature does not roll. Its d20 result **is** your recorded Portent, and the roll resolves normally from there. The Portent is spent. | when:check-rolled · ending:spent · check:die-replaced | `test-stargazer` pins it | ✅ | Live: the foe's skill check was the constant **`14`** — no die — and the Portent was spent; the control roll straight after was `1d20` |
| SG-35f | §4.5 | A Portent of 20 counts as a natural 20 and a Portent of 1 as a natural 1 | check:die-replaced | `test-stargazer` pins it | ✅ | Live: a Portent of 20 on a Will save of +14 against DC 34 was a **critical success** (34 is a success; the natural 20 raises it). Phase 0 drove the natural 1 |
| SG-35g | §4.5 | Speak the Portent cannot be used on a roll already altered by a fortune or misfortune effect, and does not itself have those traits. | check:fortune | `test-stargazer` pins the guard | ⚠️ | Live (phase 0): a Portent beside a fortune roll-twice rolled `2d20kh` and stayed armed. **Gap:** pf2e's `SubstituteRoll` must carry `fortune` or `misfortune`, so the roll does have the trait |
| SG-35h | §4.5 | A new Night Vigil overwrites an unspent Portent. | ending:replaces-previous · when:preparations | | ✅ | Live: a second rest replaced the unspent Portent of **6** with **14** |

## Astronomy Lore (guide §4.6)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SG-36a | §4.6 | Your proficiency increases to **Expert at 3rd**, **Master at 7th** and **Legendary at 15th** | effect:class-profile · effect:proficiency · scaling:from-level | `test-stargazer` pins it | ✅ | Live: Astronomy Lore **1 at 2nd**, **2 at 3rd**, **3 at 7th**, **4 at 15th**; levelled back down to 6th it reads **2**. pf2e reads a Lore's rank off the lore item, which no rule element reaches, so the core-skill features carry the rank as a flag and `stargazer/star-chart.mjs` keeps the item at the highest one present |
| SG-36b | §4.6 | you gain an extra skill feat at each of those levels, which must apply to Astronomy Lore or Occultism. | effect:class-profile · scaling:from-level | `test-stargazer` pins it | ⚠️ | Live at 6th: skill feat slots at **2, 3, 4, 6** — the extra at 3rd is there (and at 7th and 15th by the same list). **Gap:** nothing limits it to Astronomy Lore or Occultism |
| SG-36c | §4.6 | Astronomy Lore covers celestial events, calendars, navigation by star, prophecy, and — at the GM's discretion — Recall Knowledge about *anything that has been foretold*. | | | — | The GM's discretion, by the guide's own words; nothing to automate |

## Widen the Sky (guide §4.7)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SG-37a | §4.7 | Fortune's Thread's range increases to **60 feet** | scaling:from-level · effect:range | `test-stargazer` pins it | ✅ | Live at 17th: creatures at 10 and 20 feet armed; one at **90** refused *"beyond 60 feet"* |
| SG-37b | §4.7 | when you use it you may affect **two creatures** with the same reaction, in **any combination** — two Guides, two Snarls, or one of each. | reach:up-to-n · economy:reaction · scaling:from-level | `test-stargazer` pins it | ✅ | Live: one reaction armed **Guide on the ally and Snarl on the foe**; the foe's skill check spent the reaction, and the ally's Perception check took its Guide afterwards without spending another |
| SG-37c | §4.7 | Both must be within range and you must be able to see both. | reach:up-to-n | `test-stargazer` pins it | ✅ | Live: both must be within range, and both must be seen. **Fixed (#116):** a sight check stands beside range and immunity. Live, Altair: a Guide on Deneb behind a sight-blocking wall was refused (*out of sight*), and with the wall gone armed; refused on Deneb invisible, on Deneb hidden, and with Altair blinded; Mira, in plain view, armed |
| SG-37d | §4.7 | It is still a single reaction, and Snarl's restriction to attack rolls, skill checks and Perception still applies. | economy:reaction | `test-stargazer` pins it | ✅ | Live: two creatures, one reaction; a new arm with it spent was refused *"no reaction left this round"*; Snarl still never reached the foe's save |

## The Last Thing You See (guide §4.8)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SG-38a | §4.8 | **The Last Thing You See** ⤾ **[reaction]** (concentrate, emotion, fear, illusion, mental, prediction, visual) | economy:reaction | | ✅ | Live: a reaction with `concentrate, emotion, fear, illusion, mental, prediction, visual`, offered as a whispered button when it triggers (ADR-0004) |
| SG-38b | §4.8 | **Trigger** A creature within 30 feet that you can see deals damage to you. | when:damage-taken · reach:attacker · economy:reaction | | ✅ | Live: a hit from 20 feet posted the button, from 90 did not, and with the reaction spent none. **Fixed (#116):** the same hit from a hidden foe, or from behind a wall, posted nothing; the visible foe's posted the button |
| SG-38c | §4.8 | It attempts a Will save against your Stargazer DC. | check:save · check:class-dc | | ✅ | Live: the foe rolled Will against **DC 34** — Vega's Stargazer DC at 17th |
| SG-38d | §4.8 | **Critical Success** It is unaffected and is temporarily immune for 10 minutes. | check:save · ending:immunity-after | | ✅ | Live: a critical success (Portent 20, Will +14) gave no condition and an immunity effect; using it again posted *"unaffected"* and rolled no save |
| SG-38e | §4.8 | **Success** Frightened 1. | check:save · effect:condition | | ✅ | Live: success (`19 + 15` = 34) → **frightened 1** |
| SG-38f | §4.8 | **Failure** Frightened 2. | check:save · effect:condition | | ✅ | Live: failure (`10 + 20` = 30) → **frightened 2** |
| SG-38g | §4.8 | **Critical Failure** Frightened 3 and **stunned 1**. | check:save · effect:condition | | ✅ | Live: a rolled 23 against DC 34, a critical failure → **frightened 3** and **stunned 1** |

## Second Star and Surer Thread (guide §4.9, §4.10)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SG-39 | §4.9 | Your focus pool increases to **2 Focus Points**. | economy:charges · scaling:from-level | `test-stargazer` pins it | ✅ | Live at the boundary: focus pool **1 at 6th**, **2 at 7th**, and a stored 2 holds at 7th; levelled back to 6th it is **1** again |
| SG-40 | §4.10 | Fortune's Thread's bonus and penalty increase to **±2**. | effect:bonus · effect:penalty · scaling:from-level | `test-stargazer` pins it | ✅ | Live at 17th: Guide **+2** and Snarl **−2**. The 8th/9th boundary is pinned statically |

## Unmake the Moment (guide §4.11)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SG-41a | §4.11 | **Unmake the Moment** ✦ **[free action]** (prediction) | when:cast | `test-stargazer` pins it | ✅ | A free action with `prediction`, granted at 11th |
| SG-41b | §4.11 | **Frequency** once per day (recharges on your next Night Vigil) | economy:frequency · when:preparations | `test-stargazer` pins it | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): after Altair's one use, his next turn offered nothing; Mira's Night Vigil put her count from 2 back to 0 |
| SG-41c | §4.11 | **Trigger** Your turn begins. | when:turn-start | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): the card came to Altair's whispers as his round-2 turn began; posting the feature off his turn was refused ("only as your turn begins") |
| SG-41d | §4.11 | Time rewinds to the **start of your last turn**. | effect:rewind | `test-stargazer` pins it | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): from round 2 back to round 1, Altair's turn |
| SG-41e | §4.11 | Everything done since then by every creature is undone: damage dealt, conditions applied, spells cast, movement made, resources spent, reactions used. | effect:rewind | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): Mira's 20 damage and frightened 2 were gone, the foe stood where it had and lost the effect it gained, the token summoned in the round was deleted, and the clock went back six seconds |
| SG-41f | §4.11 | Creatures reduced to 0 Hit Points return to the Hit Points they had. | effect:rewind | | ✅ | Live: Mira, dead at 0 with dying 4, came back at 84 — what she had at the start of the turn rewound to |
| SG-41g | §4.11 | Everyone except you loses all memory of the unwound round. | | | — | Memory is the table's; the card says who remembers (and *Echo of the Unmade* whispers the one ally who does) |
| SG-41h | §4.11 | you may spend 1 action on your turn to shout a warning, granting one ally a **+2 circumstance bonus** to their next roll this round. | economy:granted-action · effect:bonus · ending:spent | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): *Shout a warning* put +2 circumstance on SG Ally's next roll, which took it and spent it |
| SG-41i | §4.11 | You are **stunned 1** and **drained 1** when the loop resolves. | effect:condition | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): Altair **stunned 1** and **drained 1** after the restore |
| SG-41j | §4.11 | Initiative order does not change. | effect:rewind | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): the order stayed Altair, foe, Mira, SG Ally, with the same initiatives |
| SG-41k | §4.11 | Enemies act again as the GM chooses — they are not obliged to repeat what they did, and they do not remember it either. | | | — | What enemies do in the replay is the GM's |

## Constellation Mastery (guide §4.12)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SG-42a | §4.12 | During your Night Vigil you may swap today's **aspect** with the aspect of any of the next three days in your forecast. | when:preparations · effect:calendar | | ✅ | Live at 13th: the card offered the next three days; trading with tomorrow made today **Malefic** and tomorrow **Retrograde**. A second trade the same Vigil did nothing |
| SG-42b | §4.12 | The two days exchange aspects; the signs do not move. | effect:calendar | | ✅ | Live: Taurus stayed today's sign and Starless tomorrow's — only the aspects moved |
| SG-42c | §4.12 | the day you traded away is still coming. | effect:calendar | | ✅ | Live: the Retrograde traded away sat on tomorrow's queue entry, still coming |
| SG-42d | §4.12 | You and the allies you brief treat a negative aspect as **Benefic** instead of merely reducing it: **Retrograde → Benefic**, **Malefic → Benefic**. | reach:allies · effect:severity-step | `test-stargazer` pins it | ✅ | Live at 13th, a Retrograde day: Deneb and the briefed ally wore **Sky: Benefic**, unbriefed Far **Sky: Retrograde** |
| SG-42e | §4.12 | Exalted and Benefic days are unchanged | effect:severity-step | | ✅ | Live: Exalted and Benefic days are not softened — `aspectFor` returns them untouched, and the briefed creatures wore the same effect as the control |
| SG-42f | §4.12 | **Starless.** On a Starless sky you may choose any sign's Augury as your Augury of the Day. | check:caster-choice · effect:feature-granted | | ✅ | Live at 13th: a Starless Vigil's card offered all twelve sign Auguries; clicking *Deep Dream* granted it as the Augury of the Day |

## Twin Fates and Threefold Thread (guide §4.13, §4.14)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SG-43a | §4.13 | Once per 10 minutes, when you use Fortune's Thread, you may instead make it a true **fortune** or **misfortune** effect for **up to two of its targets** | check:roll-twice · reach:up-to-n · economy:frequency | `test-stargazer` pins it | ✅ | Live: Twin Fates on two of a Thread's targets; used again inside 10 minutes, refused |
| SG-43b | §4.13 | each rolls twice and takes the higher result (Guide) or the lower result (Snarl). | check:roll-twice | `test-stargazer` pins it | ✅ | Live: the ally's Reflex save rolled **`2d20kh`**, the foe's skill check **`2d20kl`** |
| SG-43c | §4.13 | This replaces the bonus or penalty for those targets, and Snarl's restriction to attack rolls, skill checks and Perception still applies. | check:roll-twice | `test-stargazer` pins it | ✅ | Live: the Twin Fates rolls carried no ±2 — it replaces the bonus — and the foe's save under a Twin Fates Snarl rolled `1d20 + 8`, untouched |
| SG-43d | §4.13 | If a fortune effect and a misfortune effect would apply to the same roll, the two cancel each other out. | check:roll-twice · check:fortune | | ✅ | Live: a Twin Fates Guide (keep higher) on the foe while under Coiling Doubt (keep lower) rolled `1d20`; the Twin Fates Guide alone, `2d20kh` |
| SG-44a | §4.14 | Fortune's Thread affects **three creatures** with a single reaction, in any combination of Guide and Snarl. | reach:up-to-n · economy:reaction · scaling:from-level | `test-stargazer` pins it | ✅ | Live at 17th: three creatures — the ally, the foe and the Stargazer — armed on one reaction (one pending); four were refused |
| SG-44b | §4.14 | *Twin Fates* still affects two. | check:roll-twice · reach:up-to-n | | ✅ | Live: Vega at 17th (Threefold Thread and Twin Fates, no Cascade) was refused Twin Fates on three of her Thread's targets and allowed it on two; the third took a plain Guide |

## The rewind, Tiers 1 and 3 (guide §10.1, §10.3)

*Tier 2 is Unmake the Moment, above.*

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SG-45a | §10.1 The Dream | The Stargazer's Night Vigil produces **a vision the player does not get to interpret**. | | | — | The Dream is a GM technique by ruling R5; the handbook's *The rewind, in three tiers* tells the GM how to run it |
| SG-45b | §10.1 The Dream | **The players keep every piece of information they learned** | | | — | As SG-45a: what the players keep is the table's |
| SG-45c | §10.1 The Dream | **Frequency:** once per adventure or arc, maximum, and only when the GM initiates. | | | — | As SG-45a: only the GM starts it |
| SG-46a | §10.3 | **Rewrite the Ending** ✦ **[free action]** (prediction) | when:cast | `test-stargazer` pins it | ✅ | A free action with `prediction`, granted at 19th |
| SG-46b | §10.3 | **Frequency** once per week | economy:frequency | `test-stargazer` pins it | ✅ | Live: after a use on day 227 it was not ready again until day 234 (seven dawns) |
| SG-46c | §10.3 | **Trigger** You or an ally within 60 feet dies, or the party is defeated or captured. | when:dying | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): posting it asked the GM, in a GM-only whisper, whether someone died or the party fell |
| SG-46d | §10.3 | Time unwinds to the **moment initiative was rolled** for this encounter. | effect:rewind | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): confirmed, the encounter went back to before round 1 and every initiative was cleared to be rolled again |
| SG-46e | §10.3 | All damage, conditions, deaths, expended spells, expended items and expended resources since that moment are restored, for every creature. | effect:rewind | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): Mira, dead (0 Hit Points, dying 4), stood at 104 with no dying |
| SG-46f | §10.3 | each ally who was in the erased timeline gains a **+2 circumstance bonus to their initiative roll and to their first d20 roll** of the re-run encounter | when:check-rolled · effect:bonus · ending:spent · reach:allies | `test-stargazer` pins it | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): Altair, Mira and SG Ally took *Remembered Initiative* and *Remembered Ending*, the foe neither; Mira's initiative took +2, her next check +2, the one after nothing. **Fixed while driving:** initiative is a Perception check and spent the first-d20 bonus too; it is now kept off initiative by `check:type:initiative` |
| SG-46g | §10.3 | Your Star Chart goes dark. You are **drained 2** and **doomed 1** | effect:condition | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): Altair **drained 2**, **doomed 1**, and *Effect: Star Chart Dark* |
| SG-46h | §10.3 | you lose Night Vigil, Fortune's Thread, Chart the Course, Portent, and all Auguries and Focus Points, until you complete a **full 8-hour Night Vigil under open sky**. | effect:forbid · ending:preparations | `test-stargazer` pins it | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): his focus fell to 0 of 0; Fortune's Thread, Chart the Course and Portent each refused with no picker; his Night Vigil read nothing and rolled no Portent |
| SG-46i | §10.3 | Neither condition can be reduced before then by any means. | effect:condition-floor | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): reducing drained and removing doomed were both refused while the chart was dark; once relit, drained went 2 → 1 |
| SG-46j | §10.3 | You cannot use Rewrite the Ending again for 7 days regardless. | economy:charges | `test-stargazer` pins it | ✅ | Live: not ready on day 227 or 230, ready on 234 |

## Build rulings (guide §11.2, §11.3, §11.7)

*Written in v3.1 from #103's rulings R5 and the grilling that followed: how the pre-roll features and the
rewinds behave at the table. ADR-0004 is the reasoning behind the arming model.*

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SG-47a | §11.2 | One reaction arms up to as many creatures as the Thread can affect; the rest stay armed after the first fires. | economy:reaction · reach:up-to-n · ending:spent | `test-stargazer` pins it | ✅ | Live: two creatures armed on one reaction; the first roll moved *spent* from 0 to 1, the second fired afterwards and it stayed 1 |
| SG-47b | §11.2 | An armed Thread expires at the start of your next turn, and you cannot arm one with no reaction left | ending:next-turn · economy:reaction | | ✅ | Live: with the reaction spent, arming was refused; at Vega's next turn the count was back to 0, and a Guide armed then left unrolled for a round was gone at the turn after, costing nothing |
| SG-47c | §11.2 | *Two Warnings* allows a second, and *Chart the Course*'s free Threads cost none. | economy:reaction · economy:granted-action · economy:extra-action | | ✅ | Live (phase 6a, #125): Deneb with *Two Warnings* armed two Threads in one round and a third was refused, and Chart the Course's Threads armed with the reaction spent and cost none |
| SG-47d | §11.3 | Its free Fortune's Thread is **armed on the named creature at no reaction cost**, and spent by that creature's first d20. | economy:granted-action · when:check-rolled · ending:spent | `test-stargazer` pins it | ✅ | Live: the foe's first d20 after Chart was a save; its Snarl could not apply and was spent anyway |
| SG-47e | §11.3 | it never expires until it is spoken or a new Vigil overwrites it. | ending:spent · ending:replaces-previous | | ✅ | Live: Mira's Portent armed on SG Ally was still there two days of world time later; speaking it again moved it to the foe; armed and unspoken, the next Vigil took it back |
| SG-47f | §11.3 | the die is replaced before the roll resolves | when:check-rolled · check:die-replaced | `test-stargazer` pins it | ✅ | Live: the Portent's roll formula is the constant — `14`, `19 + 15` — not a die |
| SG-47g | §11.3 | When the trigger happens, the Stargazer's player is offered a button on a chat card, and the effect is applied after the fact | economy:reaction | | ✅ | Live: The Last Thing You See was offered as a button after the damage landed, and its save and conditions were applied after the fact |
| SG-48a | §11.7 | **Night Vigil** runs by itself at *Rest for the Night* | when:preparations | | ✅ | Live: the Vigil ran at *Rest for the Night* with no other action |
| SG-48b | §11.7 | *Forewarned* is a button on that card, where the player picks the allies briefed. | reach:up-to-n · reach:allies | | ✅ | Live: the button on the Vigil card opened the picker, and the briefing landed |
| SG-48c | §11.7 | the full actor — Hit Points, conditions, effects, resources, item uses — plus token positions and the combat tracker's turn. | effect:rewind | | ✅ | Live: each Stargazer's turn start (every turn, with The Long Way Round) snapshots every combatant's actor, every token and the turn. Kept in the GM client's memory: a reload forgets them, and the rewinds then say there is nothing to go back to |
| SG-48d | §11.7 | Using it restores the previous snapshot, deletes tokens and actors created since, leaves the chat log alone, and then applies stunned 1 and drained 1. | effect:condition · effect:rewind | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): the summoned token was deleted, the chat log kept every message, and stunned 1 and drained 1 came after. **Fixed while driving:** Foundry writes `parent` into the options it is given, and one shared options object sent an actor update to the scene |
| SG-48e | §11.7 | The Stargazer's player presses it; the restore runs on the GM's client without a confirmation | effect:rewind | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): Altair's player presses the card's button; the GM's client restores it with no confirmation |
| SG-48f | §11.7 | **Rewrite the Ending** snapshots the same state when initiative is rolled. | effect:rewind | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): starting the encounter took the snapshot Rewrite restored |
| SG-48g | §11.7 | The Stargazer's player presses it and the **GM confirms** | effect:gm-note | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): nothing happened until the GM confirmed |
| SG-48h | §11.7 | Drained 2 and doomed 1 are locked against reduction, and the lost features are disabled until a Vigil marked as the full eight hours under open sky. | effect:condition-floor · effect:forbid · ending:preparations | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): the locked conditions refused reduction; the dark Vigil card carried the GM's *this was the full eight hours under open sky* button, which relit the chart (focus back to 3) and ran the Vigil |
| SG-48i | §11.7 | **Weeks** are counted in the Sky's dawns (§8.2). | effect:calendar | `test-stargazer` pins it | ✅ | Rewrite's week is counted in the Sky's days |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 121 |
| ⚠️ | 2 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 6 |
| **Total** | **129** |

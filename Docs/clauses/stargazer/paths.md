# Clauses — the Stargazer's Paths

*Path tracker. Every independently-failable sentence of the four Stargazer's Paths, one row each.
Source: `Docs/stargazer-guide-v3.md` §6.*

**Tier:** paths · **Tracker issue:** #107

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

*The Paths' own shape.* Each Path is a subclass: one choice at 1st — a pf2e `ChoiceSet` on the class —
that grants its later abilities at 5th, 13th and 17th by level, the way the Soulbound's Lineage grants
its rungs. Most rows modify a class feature rather than standing alone, so a Path row cannot pass until
the feature it modifies does: Fortune's Thread, Chart the Course, Night Vigil's forecast, *Unmake the
Moment*. Four things are hard. The Herald's **persistent mental on a Snarled critical failure** needs
Snarl to leave a mark on the roll it touched, so a later outcome can find it. *Sentence Passed* treats
**every natural 20 as a natural 10** and **locks out fortune effects** for a minute — a die rewrite and
a refusal, not a modifier. The Ephemeris **reads beyond the forecast** — seven days, and any past day —
which the seven-day queue holds only half of. And the Broken Thread **modifies *Unmake the Moment***,
so its rows are exactly as automatable as the rewind itself is.

*Settled in v3.1* (#103): **R1** *Skein of Fates* adds one Thread target (`WV-03`); **R2** *Doubled
Strand* names three from 11th, with a free Thread for each (`WV-02`); **R5** the rewinds are built, so
`BT-03` and `BT-04` are too; **R7** the Sky keeps a history, so *The Almanac*'s past days (`EP-02b`)
have something to read; **R11** the Herald's 1st is renamed *Herald's Omen*.

**IDs are `WV-`, `HR-`, `EP-` and `BT-<nn><letter>`** — Weaver, Herald, Ephemeris, Broken Thread —
numbered `01`–`04` by the Path's 1st-, 5th-, 13th- and 17th-level ability, with a letter per clause.

---

## The Weaver (guide §6.1)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| WV-01a | §6.1 Knotted Thread | When you **Guide** an ally with Fortune's Thread, they also gain a **+1 circumstance bonus to AC** | effect:bonus · economy:reaction | `test-stargazer` pins it | ✅ | Live, Altair (19th, Weaver): Deneb's Perception spent Chart the Course's Guide and she took *Effect: Knotted Thread*; the foe's Claw at her read **AC 27 → 28**. Control: Mira's Snarl spent on hers gave nothing |
| WV-01b | §6.1 Knotted Thread | against the next attack made against them before the start of your next turn. | when:strike-received · ending:spent · ending:next-turn | | ✅ | Live, Altair (19th, Weaver): that one attack took the knot away (AC back to 27); what is left goes at the start of Altair's turn with the Threads |
| WV-02a | §6.1 Doubled Strand | *Chart the Course* names **two** creatures instead of one, and **three** from 11th level. | reach:up-to-n | `test-stargazer` pins it | ✅ | Live, Altair (19th, Weaver): Chart the Course armed three at once; a fourth target was refused ("at most 3"). Two below 11th is pinned |
| WV-02b | §6.1 Doubled Strand | You may use its free Fortune's Thread once for each of them. | economy:granted-action | | ✅ | Live, Altair (19th, Weaver): each of the three got its own free Thread, and none of them cost a reaction |
| WV-03a | §6.1 Skein of Fates | Fortune's Thread affects **one additional creature** with a single reaction — three from 13th, and four once *Threefold Thread* arrives at 17th. | reach:up-to-n · economy:reaction | `test-stargazer` pins it | ✅ | Live, Altair (19th, Weaver), with Threefold Thread: one Fortune's Thread armed **four** (three Guides, one Snarl) on one pending reaction; a fifth was refused. Three at 13th is pinned |
| WV-03b | §6.1 Skein of Fates | The extra target does not extend *Twin Fates* or *Tapestry*. | reach:up-to-n | | ✅ | Live, Altair (19th, Weaver): Twin Fates on three of the Thread's targets was refused ("up to two"); Tapestry ignores the count, below |
| WV-04a | §6.1 Tapestry | Once per 10 minutes, Fortune's Thread affects **every ally within 60 feet** (Guide) or **every enemy within 60 feet** (Snarl). | economy:charges · reach:area/emanation · reach:allies · reach:enemies | | ✅ | Live, Altair (19th, Weaver): *Guide every ally* armed Deneb, Lyra, Mira, Far, SG Ally and Vega (5–60 ft); ZZ Ally at 105 ft and the foe got nothing. Ten minutes later *Snarl every enemy* armed the foe alone. Within ten minutes the picker skipped straight to the ordinary Thread |
| WV-04b | §6.1 Tapestry | One reaction, one choice, everyone. | economy:reaction · check:caster-choice | | ✅ | Live, Altair (19th, Weaver): the six Guides were one pending reaction |

## The Herald (guide §6.2)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| HR-01a | §6.2 Herald's Omen | You learn ***Coiling Doubt*** | | `test-stargazer` pins it | ✅ | Live: choosing The Herald put *Coiling Doubt* in the Chassis's (6th) spellcasting, granted by Herald's Omen |
| HR-01b | §6.2 Herald's Omen | it does not count against your Auguries known. | | | ✅ | Live: the Coiling Doubt is Herald's Omen's grant, not an *Augury (Nth)* choice, so no known slot pays for it |
| HR-01c | §6.2 Herald's Omen | once per round, when a creature critically fails a roll you affected with **Snarl**, it takes **persistent mental damage equal to your Wisdom modifier**. | when:check-rolled · economy:once-per-round · effect:persistent | `test-stargazer` pins it | ✅ | Live, Vega (17th, Herald), Wis +1: the foe's Snarled Athletics critical failure → **1 persistent mental**; a second Snarled critical failure that round → nothing; the next round without a Snarl → nothing; the next with one → again. A Twin Fates Snarl (`2d20kl`) counted too |
| HR-02a | §6.2 The Announcement | You can **Demoralize** using Astronomy Lore instead of Intimidation | | | ✅ | Live, Vega (17th, Herald): The Announcement rolled Demoralize as an **Astronomy Lore** check, `1d20 + 25`; her Intimidation is +0 |
| HR-02b | §6.2 The Announcement | at a range of 60 feet | | | — | pf2e does not bound Demoralize's 30 feet, so there is nothing to widen; the check is the GM's |
| HR-02c | §6.2 The Announcement | with no auditory or visual requirement | economy:requires | `test-stargazer` pins it | ✅ | Live, Vega (17th, Herald): no auditory trait on the roll and no **Unintelligible −4**; a plain Demoralize at the same foe kept both (control). **Fixed while driving:** pf2e re-tests modifiers against the roll options, so the stage lifts the option, not the modifier |
| HR-03a | §6.2 Sentence Passed | ✦✦ (concentrate, misfortune, prediction), once per 10 minutes, 1 creature within 60 feet, Will save against your Stargazer DC. | when:cast · reach:single · check:save · economy:charges | `test-stargazer` pins it | ✅ | Live, Vega: two actions with `concentrate, misfortune, prediction`, a Will save against her DC. **Fixed (#123):** the sheet's Use posted it and rolled the save (1 → 0); a second Use at 0 posted nothing and rolled nothing (*no uses left*), and neither did posting it to chat; ten minutes later it worked again |
| HR-03b | §6.2 Sentence Passed | **Failure** For 1 minute the target treats every natural 20 as a natural 10 | check:save · when:check-rolled · ending:duration | | ✅ | Live, Vega (17th, Herald): a failed save → *Effect: Sentence Passed* for 1 minute; a success → nothing. Sentenced, the foe's natural 20 on Athletics read **10** (DC 5: a success, not a critical success); Deneb's natural 20 stayed 20. **Fixed while driving:** the card now shows the new total |
| HR-03c | §6.2 Sentence Passed | and cannot benefit from fortune effects. | check:save · check:roll-twice | | ✅ | Live, Vega (17th, Herald): with a keep-higher fortune effect the sentenced foe rolled `1d20`, Deneb `2d20kh`; a reroll of the foe's check was refused, Deneb's went through. **Fixed while driving:** pf2e 8 spells it `keep-higher` |
| HR-03d | §6.2 Sentence Passed | **Critical Failure** As failure, and it is **doomed 1**. | check:save · effect:condition | `test-stargazer` pins it | ✅ | Live, Vega (17th, Herald): a critical failure → the effect and **doomed 1** |
| HR-04 | §6.2 Foregone Conclusion | Once per round, when you **Snarl** an attack roll and the attack misses, the attacker is **off-guard** until the end of its turn. | economy:once-per-round · when:strike-received · reach:attacker · effect:condition · ending:next-turn | | ✅ | Live, Vega (17th, Herald): the foe's Snarled Claw missed → *Foregone Conclusion*, granting **off-guard**, to the end of the turn; a second Snarled miss that round → nothing; a Snarled hit next round → nothing |

## The Ephemeris (guide §6.3)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| EP-01a | §6.3 Perfect Recall | You can **Recall Knowledge using Astronomy Lore** in place of any other Knowledge skill, at a −2 circumstance penalty | effect:penalty | `test-stargazer` pins it | ✅ | Live, Deneb (13th, Ephemeris), lowered to 5th: with *In place of another Knowledge skill* on, Recall Knowledge with Astronomy Lore took **Perfect Recall −2**; off, nothing |
| EP-01b | §6.3 Perfect Recall | the penalty goes away at 7th level when Astronomy Lore reaches Master. | effect:penalty | `test-stargazer` pins it | ✅ | Live, Deneb (13th, Ephemeris): at 13th the same toggle took nothing |
| EP-01c | §6.3 Perfect Recall | Your **first Recall Knowledge against any creature each combat is a free action**. | | | — | A free action is the player's accounting; pf2e does not enforce action costs on a Recall Knowledge |
| EP-02a | §6.3 The Almanac | Night Vigil's forecast reaches **seven days** instead of three | effect:info | | ✅ | Live, Deneb (13th, Ephemeris): her Vigil card forecast **seven** days; Altair's, without The Almanac, three |
| EP-02b | §6.3 The Almanac | you may determine what the sky was on any past day you were alive for. | effect:info | | ✅ | Live, Deneb (13th, Ephemeris): the Vigil card's *The Almanac* button read day 226 as *Sagittarius, Malefic* from the tracker's history; day 100, which it does not hold, went to the GM. Altair's card had no button |
| EP-03a | §6.3 Written Down | When you critically succeed at a Recall Knowledge check, you and all allies who can hear you gain a **+1 circumstance bonus to all d20 rolls against that creature type** for 1 minute. | when:check-rolled · reach:allies · effect:bonus · ending:duration | | ✅ | Live, Deneb (13th, Ephemeris): a critical success on Recall Knowledge at an undead foe → *Written Down: Undead* on her and every ally within 60 feet (ZZ Ally at 90, Aries at 145: nothing); her Strike at it took **+1**, and nothing once it was no longer undead. A plain success wrote nothing. **Fixed while driving:** "who can hear you" is read as 60 feet — unbounded, it briefed the whole test scene |
| EP-03b | §6.3 Written Down | You may also use Fortune's Thread on a Recall Knowledge check **after the roll but before the GM answers**. | when:check-rolled · economy:reaction | `test-stargazer` pins it | ✅ | Live, Deneb (13th, Ephemeris): after a Recall Knowledge of 30 against DC 31 she was offered *Guide +2 / Snarl −2*; Guide made it **32, a success**, and spent her reaction. With none left, the next Recall Knowledge offered nothing |
| EP-04a | §6.3 Every Sky Ever Read | Once per hour, ask the GM one yes-or-no question about the next hour. | economy:charges · effect:gm-note | `test-stargazer` pins it | ✅ | Live (#123), Deneb: the sheet's Use posted it once; a second Use at 0 posted nothing; an hour later it posted again |
| EP-04b | §6.3 Every Sky Ever Read | The answer is **true**. | | | — | The answer is the GM's |
| EP-04c | §6.3 Every Sky Ever Read | If the GM genuinely has not decided, the answer is "not yet written," and the use is not spent. | | | — | Whether the GM has decided is the GM's; they hand the use back on the sheet |

## The Broken Thread (guide §6.4)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| BT-01a | §6.4 Deja Vu | ✦ **[free action]**, once per 10 minutes. | economy:charges | | ✅ | Live, Mira (13th, Broken Thread): once used, a failure within ten minutes offered nothing; ten minutes on, it offered again |
| BT-01b | §6.4 Deja Vu | **Trigger** You fail, but do not critically fail, a check. **Effect** Reroll it. | when:check-rolled | | ✅ | Live, Mira (13th, Broken Thread): her failed Athletics offered *Deja Vu*; the click rerolled it (the old card went, the new one marked a reroll). A critical failure offered nothing |
| BT-01c | §6.4 Deja Vu | This is a fortune effect. | | `test-stargazer` pins it | ✅ | Live, Mira (13th, Broken Thread): a failure already rolled with a keep-higher fortune effect offered nothing; the sentenced creature's refusal is HR-03c |
| BT-02 | §6.4 Second Sight | *Deja Vu* can instead trigger on a failed check by an ally within 30 feet that you can see. | when:check-rolled · reach:allies | `test-stargazer` pins it | ✅ | Live, Mira (13th, Broken Thread): Deneb, 10 feet away, failing offered Mira the button and the GM rerolled Deneb's check; ZZ Ally at 95 feet and the enemy foe at 15 were offered nothing |
| BT-03a | §6.4 Unmade Again | *Unmake the Moment* can be used **twice per day** | economy:charges | `test-stargazer` pins it | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): Mira used Unmake twice in a day; a third turn offered nothing |
| BT-03b | §6.4 Unmade Again | and you are no longer **drained 1** when it resolves. | effect:condition | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): neither use left her drained |
| BT-03c | §6.4 Unmade Again | You are still stunned 1. | effect:condition | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): stunned 1 each time |
| BT-04a | §6.4 The Long Way Round | *Unmake the Moment* may rewind to the start of **any creature's** last turn, not only your own — declare which as you use it. | check:caster-choice | `test-stargazer` pins it | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): her card offered every combatant's last turn; choosing the foe's went back to the start of its round-2 turn, undoing the 30 damage Altair took in it. **Fixed while driving:** a rewound turn replaced its own snapshot, and pf2e's once-per-round turn start is put back with the combatant's flags |
| BT-04b | §6.4 The Long Way Round | once per week, you may use *Unmake the Moment* **while dead**, if you died during the round it would undo. | economy:charges | | ✅ | Live, a fresh encounter (Altair 30, the foe 20, Mira 10, SG Ally 5): dead on the foe's turn, posting Unmake offered *The Long Way Round* and brought her back to her last turn at 84; a second death that week was refused. Altair, without it, was refused while dead |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 34 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 4 |
| **Total** | **38** |

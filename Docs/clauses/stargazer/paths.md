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

Four rulings block rows here (see the rulings issue (#103)). **R1** — *Skein of Fates* (`WV-03`) does nothing
in v3: §4.7 *Widen the Sky* already allows two Guides or two Snarls. **R2** — *Doubled Strand*'s "only
once" (`WV-02b`) contradicts §4.4 *Chart the Course*'s "once for each of them" from 11th. **R5** — what
to automate: `BT-03` and `BT-04` inherit whatever is ruled for the rewinds. **R7** — reads beyond the
seven-day queue: *The Almanac*'s past days (`EP-02b`).

**IDs are `WV-`, `HR-`, `EP-` and `BT-<nn><letter>`** — Weaver, Herald, Ephemeris, Broken Thread —
numbered `01`–`04` by the Path's 1st-, 5th-, 13th- and 17th-level ability, with a letter per clause.

---

## The Weaver (guide §6.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| WV-01a | §6.1 Knotted Thread | When you **Guide** an ally with Fortune's Thread, they also gain a **+1 circumstance bonus to AC** |  | ☐ |  |
| WV-01b | §6.1 Knotted Thread | against the next attack made against them before the start of your next turn. |  | ☐ |  |
| WV-02a | §6.1 Doubled Strand | *Chart the Course* names **two** creatures instead of one. |  | ☐ |  |
| WV-02b | §6.1 Doubled Strand | The free Fortune's Thread it grants may be used on either of them, but only once. |  | ☐ |  |
| WV-03 | §6.1 Skein of Fates | When you use Fortune's Thread you may apply **Guide to two allies** or **Snarl to two enemies**, instead of the one-and-one that *Widen the Sky* allows. |  | ☐ |  |
| WV-04a | §6.1 Tapestry | Once per 10 minutes, Fortune's Thread affects **every ally within 60 feet** (Guide) or **every enemy within 60 feet** (Snarl). |  | ☐ |  |
| WV-04b | §6.1 Tapestry | One reaction, one choice, everyone. |  | ☐ |  |

## The Herald (guide §6.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| HR-01a | §6.2 Ill Omen | You learn ***Coiling Doubt*** |  | ☐ |  |
| HR-01b | §6.2 Ill Omen | it does not count against your Auguries known. |  | ☐ |  |
| HR-01c | §6.2 Ill Omen | once per round, when a creature critically fails a roll you affected with **Snarl**, it takes **persistent mental damage equal to your Wisdom modifier**. |  | ☐ |  |
| HR-02a | §6.2 The Announcement | You can **Demoralize** using Astronomy Lore instead of Intimidation |  | ☐ |  |
| HR-02b | §6.2 The Announcement | at a range of 60 feet |  | ☐ |  |
| HR-02c | §6.2 The Announcement | with no auditory or visual requirement |  | ☐ |  |
| HR-03a | §6.2 Sentence Passed | ✦✦ (concentrate, misfortune, prediction), once per 10 minutes, 1 creature within 60 feet, Will save against your Stargazer DC. |  | ☐ |  |
| HR-03b | §6.2 Sentence Passed | **Failure** For 1 minute the target treats every natural 20 as a natural 10 |  | ☐ |  |
| HR-03c | §6.2 Sentence Passed | and cannot benefit from fortune effects. |  | ☐ |  |
| HR-03d | §6.2 Sentence Passed | **Critical Failure** As failure, and it is **doomed 1**. |  | ☐ |  |
| HR-04 | §6.2 Foregone Conclusion | Once per round, when you **Snarl** an attack roll and the attack misses, the attacker is **off-guard** until the end of its turn. |  | ☐ |  |

## The Ephemeris (guide §6.3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| EP-01a | §6.3 Perfect Recall | You can **Recall Knowledge using Astronomy Lore** in place of any other Knowledge skill, at a −2 circumstance penalty |  | ☐ |  |
| EP-01b | §6.3 Perfect Recall | the penalty goes away at 7th level when Astronomy Lore reaches Master. |  | ☐ |  |
| EP-01c | §6.3 Perfect Recall | Your **first Recall Knowledge against any creature each combat is a free action**. |  | ☐ |  |
| EP-02a | §6.3 The Almanac | Night Vigil's forecast reaches **seven days** instead of three |  | ☐ |  |
| EP-02b | §6.3 The Almanac | you may determine what the sky was on any past day you were alive for. |  | ☐ |  |
| EP-03a | §6.3 Written Down | When you critically succeed at a Recall Knowledge check, you and all allies who can hear you gain a **+1 circumstance bonus to all d20 rolls against that creature type** for 1 minute. |  | ☐ |  |
| EP-03b | §6.3 Written Down | You may also use Fortune's Thread on a Recall Knowledge check **after the roll but before the GM answers**. |  | ☐ |  |
| EP-04a | §6.3 Every Sky Ever Read | Once per hour, ask the GM one yes-or-no question about the next hour. |  | ☐ |  |
| EP-04b | §6.3 Every Sky Ever Read | The answer is **true**. |  | ☐ |  |
| EP-04c | §6.3 Every Sky Ever Read | If the GM genuinely has not decided, the answer is "not yet written," and the use is not spent. |  | ☐ |  |

## The Broken Thread (guide §6.4)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| BT-01a | §6.4 Deja Vu | ✦ **[free action]**, once per 10 minutes. |  | ☐ |  |
| BT-01b | §6.4 Deja Vu | **Trigger** You fail, but do not critically fail, a check. **Effect** Reroll it. |  | ☐ |  |
| BT-01c | §6.4 Deja Vu | This is a fortune effect. |  | ☐ |  |
| BT-02 | §6.4 Second Sight | *Deja Vu* can instead trigger on a failed check by an ally within 30 feet that you can see. |  | ☐ |  |
| BT-03a | §6.4 Unmade Again | *Unmake the Moment* can be used **twice per day** |  | ☐ |  |
| BT-03b | §6.4 Unmade Again | and you are no longer **drained 1** when it resolves. |  | ☐ |  |
| BT-03c | §6.4 Unmade Again | You are still stunned 1. |  | ☐ |  |
| BT-04a | §6.4 The Long Way Round | *Unmake the Moment* may rewind to the start of **any creature's** last turn, not only your own — declare which as you use it. |  | ☐ |  |
| BT-04b | §6.4 The Long Way Round | once per week, you may use *Unmake the Moment* **while dead**, if you died during the round it would undo. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 37 |
| ✅ | 0 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **37** |

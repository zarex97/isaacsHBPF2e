# Clauses — the Sky, as the Stargazer reads it

*Sky tracker. Every independently-failable declaration the Stargazer's guide makes about the Sky
itself — the daily loop, the aspects, the domains, who is told and what the Saint gets. Source:
`Docs/stargazer-guide-v3.md` §8.2–§8.6, and §11.4 for the weights.*

**Tier:** sky · **Tracker issue:** #109

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

*The terrain ships; the Stargazer's reading of it does not.* Every row still starts ☐, because none
has been driven against **this** guide's words — a clause is done when it is ✅, not because the code
it names already exists.

*The Sky's own shape.* The Sky is **terrain**, not a class feature (ADR-0001,
`Docs/adr/0001-the-sky-is-terrain.md`), and much of it **already ships**: `scripts/sky/tracker.mjs`
keeps the seven-day queue, rolls the sign and aspect, and applies the four `Sky: Benefic`,
`Sky: Retrograde`, `Sky: Malefic` and `Sky: Exalted` effects from `content/saint-effects/sky-aspect/`
to every character and every NPC tagged `sky-tracked` in the active scene (#30); `aspectFor` already
enforces *Unfailing Cosmo*. So this tracker is mostly a **drive of existing code** against the
Stargazer guide's words, not a build — and where the two disagree, the row says so. The build half is
what v3.1 added (#103): **R6** blanks the four shipped effects to `The Sky` whenever a player owns a
Stargazer and whispers the day when `announceSky` is off (`SK-27`, `SK-29`); **R7** gives the tracker
a history (`SK-02b`); Libra's die rules, which exist nowhere yet, get their scope (`SK-22e`); and a
scheduled Zenith is marked so *Trade the Day* can refuse it (`SK-33b`).

**IDs are `SK-<nn><letter>`**, numbered in the guide's order. Commentary on what the reweighting
*means* — how often the sky is hostile, what that does to Forewarned — is not a clause and has no row;
the weights themselves are.

---

## The loop (guide §8.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SK-01 | §8.2 | Each dawn the GM advances the day. |  | ☐ |  |
| SK-02a | §8.2 | The next pre-rolled entry becomes today, and a new day is rolled onto the end of the queue. |  | ☐ |  |
| SK-02b | §8.2 | The day that ends is kept in the Sky's **history**, so a past sky can be read as well as a future one. |  | ☐ |  |
| SK-02c | §8.2 | every "once per week" in this guide is seven dawns of it. |  | ☐ |  |
| SK-03 | §8.2 | thirteen skies, **equally likely**, 1 in 13 each |  | ☐ |  |
| SK-04 | §11.4 | the `ASPECTS` weights are now **20 / 30 / 30 / 10 / 10** (Quiet, Benefic, Retrograde, Malefic, Exalted) |  | ☐ |  |
| SK-05a | §8.2 Quiet | The sky is unremarkable. Nothing happens. |  | ☐ |  |
| SK-05b | §8.2 Benefic | The sky is kind. **+1** to the sign's domain. |  | ☐ |  |
| SK-05c | §8.2 Retrograde | The sky drags. **−1** to the sign's domain. |  | ☐ |  |
| SK-05d | §8.2 Malefic | The sky is hostile. **−2** to the sign's domain. |  | ☐ |  |
| SK-05e | §8.2 Exalted | A Zenith. **+2** to the domain. |  | ☐ |  |
| SK-06a | §8.2 | All bonuses and penalties are **circumstance**, so they never stack with themselves |  | ☐ |  |
| SK-06b | §8.2 | only one sign is ever up. |  | ☐ |  |
| SK-07 | §8.2 | The worst a character can be is −2 in one narrow domain |  | ☐ |  |
| SK-08 | §8.2 | `scheduleZenith` is untouched, so pinning a Zenith to a specific session still works |  | ☐ |  |

## The domains (guide §8.3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SK-09 | §8.3 ♈ Aries | Initiative rolls, and the first Strike you make in each encounter |  | ☐ |  |
| SK-10 | §8.3 ♉ Taurus | Fortitude saves; Athletics to Shove, Trip and Grapple, and to resist forced movement |  | ☐ |  |
| SK-11 | §8.3 ♊ Gemini | Deception and Diplomacy |  | ☐ |  |
| SK-12 | §8.3 ♋ Cancer | Medicine checks, recovery checks, and Fortitude saves against disease and poison |  | ☐ |  |
| SK-13 | §8.3 ♌ Leo | Intimidation and Performance |  | ☐ |  |
| SK-14 | §8.3 ♍ Virgo | Crafting, Recall Knowledge with any skill, and Perception to Search |  | ☐ |  |
| SK-15 | §8.3 ♎ Libra | *No modifier — see below* |  | ☐ |  |
| SK-16 | §8.3 ♏ Scorpio | Stealth and Thievery |  | ☐ |  |
| SK-17 | §8.3 ♐ Sagittarius | Ranged attack rolls; Survival, including Sense Direction and Subsist |  | ☐ |  |
| SK-18 | §8.3 ♑ Capricorn | Athletics to Climb, Jump and Swim |  | ☐ |  |
| SK-19 | §8.3 ♒ Aquarius | Arcana, Nature, Occultism, Religion, Society, and counteract checks |  | ☐ |  |
| SK-20 | §8.3 ♓ Pisces | Will saves; Perception against illusions and to disbelieve |  | ☐ |  |
| SK-21 | §8.3 ✦ Starless | Nothing. Nothing is written. |  | ☐ |  |
| SK-22a | §8.3 Libra | **Benefic** Once per day, the first natural 1 you roll counts as a 10. |  | ☐ |  |
| SK-22b | §8.3 Libra | **Exalted** As Benefic, but once per hour. |  | ☐ |  |
| SK-22c | §8.3 Libra | **Retrograde** Once per day, the first natural 20 you roll counts as a 10. |  | ☐ |  |
| SK-22d | §8.3 Libra | **Malefic** As Retrograde, but once per hour. |  | ☐ |  |
| SK-22e | §11.5 | they apply automatically, once per actor per day — per hour on Exalted and Malefic days — to attack rolls, saving throws, skill checks and Perception checks, never to flat checks. |  | ☐ |  |
| SK-23 | §8.3 | The flat ±1/±2 on a stated domain is the whole system, and it is enough. |  | ☐ |  |

## Who knows (guide §8.4)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SK-24 | §8.4 | **It affects everyone.** PCs, NPCs, the ogre in the cave, the duke's tax collector. |  | ☐ |  |
| SK-25 | §8.4 | In practice, track it for PCs and named NPCs only; −1 on a mook is noise. |  | ☐ |  |
| SK-26 | §8.4 | The module ships `announceSky: true`, which posts the day's sign and aspect to chat. |  | ☐ |  |
| SK-27a | §8.4 | Set `announceSky: false` and whisper the Stargazer's player instead. |  | ☐ |  |
| SK-27b | §8.4 | With the setting off, the module whispers the day's sign and aspect to every player who owns a Stargazer rather than to nobody. |  | ☐ |  |
| SK-28 | §8.4 | **In person:** apply the modifier out loud and unexplained. |  | ☐ |  |
| SK-29a | §8.4 | **In a VTT:** the effect is named `The Sky` with an empty description and a generic icon |  | ☐ |  |
| SK-29b | §8.4 | Players see that something is on them. They do not see what. |  | ☐ |  |
| SK-29c | §8.4 | The module does this by itself whenever a player owns a Stargazer character anywhere in the world: the four aspect effects are renamed, emptied and given one shared icon as they are applied. |  | ☐ |  |
| SK-30a | §8.4 | Ten minutes under an open sky and an **Astronomy Lore** or **Occultism** check, as a Recall Knowledge action |  | ☐ |  |
| SK-30b | §8.4 | against the region's level-based **Hard** DC. |  | ☐ |  |
| SK-30c | §8.4 | On an Exalted or Malefic day, reduce the DC by 5 |  | ☐ |  |
| SK-31a | §8.4 Critical Success | You learn the sign **and** the aspect. |  | ☐ |  |
| SK-31b | §8.4 Success | You learn the sign only. |  | ☐ |  |
| SK-31c | §8.4 Failure | Nothing. |  | ☐ |  |
| SK-31d | §8.4 Critical Failure | You learn a **wrong sign**, confidently. |  | ☐ |  |

## Interaction with the Saint (guide §8.6)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SK-32a | §8.6 | **Unfailing Cosmo** makes a Saint immune to Retrograde and Malefic aspects entirely, enforced in `tracker.mjs` rather than remembered. |  | ☐ |  |
| SK-32b | §8.6 | **Forewarned does nothing for a Saint.** |  | ☐ |  |
| SK-33a | §8.6 | It cannot move a **scheduled Zenith**, because that is the GM's arc-climax button and not a thing the sky rolled. |  | ✅ | Live: Leo pinned Exalted two days out by the GM; *Trade the Day* for that day was refused — *a scheduled Zenith is the GM's, not the sky's* |
| SK-33b | §11.5 | a scheduled Zenith is marked as scheduled so *Trade the Day* can refuse to move it |  | ✅ | Live: the pinned queue entry carries `scheduled: true`, and a rolled day does not |
| SK-34 | §8.6 | A Stargazer can tell a Saint **exactly when their Cloth will be lit**, three days out, from 1st level. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 53 |
| ✅ | 2 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **55** |

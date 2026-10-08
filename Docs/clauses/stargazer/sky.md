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

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SK-01 | §8.2 | Each dawn the GM advances the day. | | | ✅ | Live: the GM's *advanceDay* moved day 227 to 228 |
| SK-02a | §8.2 | The next pre-rolled entry becomes today, and a new day is rolled onto the end of the queue. | | | ✅ | Live: day 228 took the first queued entry (Starless, Malefic) and the queue was topped back up to 7 |
| SK-02b | §8.2 | The day that ends is kept in the Sky's **history**, so a past sky can be read as well as a future one. | effect:info | | ✅ | Live: after the advance, `recall(227)` returned day 227's sign and aspect. Kept to 400 days |
| SK-02c | §8.2 | every "once per week" in this guide is seven dawns of it. | economy:charges | `test-stargazer` pins it | ✅ | Live: Rewrite the Ending was not ready again on day 230 and ready on 234; Fixed Sky's Portent, spoken on day 227, was marked spoken for the week — both counted in the Sky's days |
| SK-03 | §8.2 | thirteen skies, **equally likely**, 1 in 13 each | | | ✅ | Live: 26,000 `rollSign` calls — every sign between **7.3% and 8.0%** (1 in 13 is 7.7%) |
| SK-04 | §11.4 | the `ASPECTS` weights are now **20 / 30 / 30 / 10 / 10** (Quiet, Benefic, Retrograde, Malefic, Exalted) | | | ✅ | Live: 20,000 `rollAspect` calls — Quiet **19.8**, Benefic **30.5**, Retrograde **29.6**, Malefic **10.1**, Exalted **10.0** per cent |
| SK-05a | §8.2 Quiet | The sky is unremarkable. Nothing happens. | | | ✅ | Live: a Quiet Taurus day put nothing on the ally's Fortitude |
| SK-05b | §8.2 Benefic | The sky is kind. **+1** to the sign's domain. | effect:bonus | | ✅ | Live: Benefic Taurus — Fortitude **+1** |
| SK-05c | §8.2 Retrograde | The sky drags. **−1** to the sign's domain. | effect:penalty | | ✅ | Live: Retrograde Taurus — Fortitude **−1** |
| SK-05d | §8.2 Malefic | The sky is hostile. **−2** to the sign's domain. | effect:penalty | | ✅ | Live: Malefic Taurus — Fortitude **−2** |
| SK-05e | §8.2 Exalted | A Zenith. **+2** to the domain. | effect:bonus | | ✅ | Live: Exalted Taurus — Fortitude **+2** |
| SK-06a | §8.2 | All bonuses and penalties are **circumstance**, so they never stack with themselves | effect:bonus · effect:penalty | | ✅ | Live: every Sky modifier read off the rolls was type **circumstance**; with Aid present only the higher applied (#105, SG-33g) |
| SK-06b | §8.2 | only one sign is ever up. | ending:replaces-previous | | ✅ | Live: the ally wore exactly one terrain effect at a time, stamped with today's sign. **Fixed while driving:** an effect kept because its *name* still matched carried the previous day's sign — Taurus → Gemini → Leo, all Benefic, and it still read `sky:sign:taurus`. It is now kept only when its sign matches |
| SK-07 | §8.2 | The worst a character can be is −2 in one narrow domain | effect:penalty | | ✅ | Live: the worst reading in the whole sweep was **−2**, Malefic, in one domain |
| SK-08 | §8.2 | `scheduleZenith` is untouched, so pinning a Zenith to a specific session still works | | | ✅ | Live: `scheduleZenith("leo", 3)` pinned Leo, Exalted, three days out, marked scheduled |

## The domains (guide §8.3)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SK-09 | §8.3 ♈ Aries | Initiative rolls, and the first Strike you make in each encounter | when:strike-made · effect:bonus · effect:penalty | | ✅ | Live: Aries Exalted — initiative **+1** (Benefic run) and the first Strike of an encounter **+2**; the second Strike nothing; a new encounter's first Strike **+2** again; a Strike out of combat nothing |
| SK-10 | §8.3 ♉ Taurus | Fortitude saves; Athletics to Shove, Trip and Grapple, and to resist forced movement | effect:bonus · effect:penalty | | ⚠️ | Live, a Benefic day, on the unsheltered ally: Fortitude **+1**, Athletics to Trip and to Shove **+1**, plain Athletics nothing. **Gap:** resisting forced movement is by hand — pf2e has no roll for it |
| SK-11 | §8.3 ♊ Gemini | Deception and Diplomacy | effect:bonus · effect:penalty | | ✅ | Live, a Benefic day, on the unsheltered ally: Deception and Diplomacy **+1**; Stealth (control) nothing |
| SK-12 | §8.3 ♋ Cancer | Medicine checks, recovery checks, and Fortitude saves against disease and poison | effect:bonus · effect:penalty | | ⚠️ | Live, a Benefic day, on the unsheltered ally: Medicine **+1**, Fortitude against poison and against disease **+1**, plain Fortitude nothing. **Gap:** recovery checks are by hand — pf2e's is a flat check, which takes no modifier |
| SK-13 | §8.3 ♌ Leo | Intimidation and Performance | effect:bonus · effect:penalty | | ✅ | Live, a Benefic day, on the unsheltered ally: Intimidation and Performance **+1**; Deception (control) nothing |
| SK-14 | §8.3 ♍ Virgo | Crafting, Recall Knowledge with any skill, and Perception to Search | effect:bonus · effect:penalty | | ✅ | Live, a Benefic day, on the unsheltered ally: Crafting **+1**, Arcana to Recall Knowledge **+1**, Perception to Seek **+1**; plain Arcana and plain Perception nothing |
| SK-15 | §8.3 ♎ Libra | *No modifier — see below* | | | ✅ | Live: under Libra, Athletics and Will carried no Sky modifier — the die is Libra's domain |
| SK-16 | §8.3 ♏ Scorpio | Stealth and Thievery | effect:bonus · effect:penalty | | ✅ | Live, a Benefic day, on the unsheltered ally: Stealth and Thievery **+1** |
| SK-17 | §8.3 ♐ Sagittarius | Ranged attack rolls; Survival, including Sense Direction and Subsist | effect:bonus · effect:penalty | | ✅ | Live, a Benefic day, on the unsheltered ally: Survival **+1**; on a Malefic day a javelin Strike (ranged) **−2** and a club Strike (melee) nothing |
| SK-18 | §8.3 ♑ Capricorn | Athletics to Climb, Jump and Swim | effect:bonus · effect:penalty | | ✅ | Live, a Benefic day, on the unsheltered ally: Athletics to Climb and to Swim **+1**; plain Athletics nothing |
| SK-19 | §8.3 ♒ Aquarius | Arcana, Nature, Occultism, Religion, Society, and counteract checks | effect:bonus · effect:penalty · check:counteract | `test-stargazer` pins it | ⚠️ | Live, a Benefic day, on the unsheltered ally: Arcana, Nature, Occultism, Religion and Society **+1**. **Gap:** the counteract-check rule is written and pinned but no counteract check was rolled live |
| SK-20 | §8.3 ♓ Pisces | Will saves; Perception against illusions and to disbelieve | effect:bonus · effect:penalty | | ✅ | Live, a Benefic day, on the unsheltered ally: Will **+1**, Perception against an illusion **+1**, plain Perception nothing |
| SK-21 | §8.3 ✦ Starless | Nothing. Nothing is written. | | | ✅ | Live: a Starless day put nothing on Fortitude, Will or Athletics |
| SK-22a | §8.3 Libra | **Benefic** Once per day, the first natural 1 you roll counts as a 10. | when:check-rolled · economy:charges | `test-stargazer` pins it | ✅ | Live, the d20 forced: a Libra Benefic day turned the first natural 1 into a **10** (failure against DC 15, rewritten on the card); three saves at once — only the first; a natural 20 untouched; the next sky day, a natural 1 counted again |
| SK-22b | §8.3 Libra | **Exalted** As Benefic, but once per hour. | when:check-rolled · economy:charges | `test-stargazer` pins it | ✅ | Live: Libra Exalted — the first natural 1 each hour counted as a 10; a second in the same hour did not; an hour later it did |
| SK-22c | §8.3 Libra | **Retrograde** Once per day, the first natural 20 you roll counts as a 10. | when:check-rolled · economy:charges | `test-stargazer` pins it | ✅ | Live: Libra Retrograde — the first natural 20 counted as a **10**; three saves at once — only the first; a natural 1 untouched |
| SK-22d | §8.3 Libra | **Malefic** As Retrograde, but once per hour. | when:check-rolled · economy:charges | `test-stargazer` pins it | ✅ | Live: Libra Malefic — a natural 20 counted as a 10; hourly, the same clock as Exalted |
| SK-22e | §11.5 | they apply automatically, once per actor per day — per hour on Exalted and Malefic days — to attack rolls, saving throws, skill checks and Perception checks, never to flat checks. | when:check-rolled · economy:charges | `test-stargazer` pins it | ✅ | Live: rewritten on skill checks, saves and Perception; a **flat check** with a natural 1 on a Libra Benefic day was left alone; under Taurus a natural 1 was left alone. **Fixed while driving:** saves rolled together read the flag before its write landed and spent the allowance twice; it is now recorded in memory the moment it is used |
| SK-23 | §8.3 | The flat ±1/±2 on a stated domain is the whole system, and it is enough. | effect:bonus · effect:penalty | `test-stargazer` pins it | ✅ | Static: the four terrain effects carry nothing but ±N circumstance `FlatModifier`s on the domains; Libra and Aries are the two scripted exceptions, both driven |

## Who knows (guide §8.4)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SK-24 | §8.4 | **It affects everyone.** PCs, NPCs, the ogre in the cave, the duke's tax collector. | effect:bonus · effect:penalty | | ✅ | Live: every character with a token in the scene wore the day's effect — the ally, Lyra, Deneb, Far |
| SK-25 | §8.4 | In practice, track it for PCs and named NPCs only; −1 on a mook is noise. | reach:filtered | | ✅ | Live: an untagged NPC wore nothing; tagged `sky-tracked` it wore the day's effect; untagged again, it came off |
| SK-26 | §8.4 | The module ships `announceSky: true`, which posts the day's sign and aspect to chat. | effect:info | | ✅ | Live: with the setting on, the announcement posted publicly (no whisper) |
| SK-27a | §8.4 | Set `announceSky: false` and whisper the Stargazer's player instead. | effect:info | | ✅ | Live: with the setting off, the announcement was whispered — see SK-27b |
| SK-27b | §8.4 | With the setting off, the module whispers the day's sign and aspect to every player who owns a Stargazer rather than to nobody. | effect:info | | ✅ | Live: announceSky off, a player owning a Stargazer → the day whispered to that player alone; no such player → nothing posted |
| SK-28 | §8.4 | **In person:** apply the modifier out loud and unexplained. | | | — | A table habit, not a rule; nothing to automate |
| SK-29a | §8.4 | **In a VTT:** the effect is named `The Sky` with an empty description and a generic icon | | | ✅ | Live: with a player owning a Stargazer, every creature's aspect effect was **The Sky**, description empty, one shared icon; the rule inside still applied (Taurus −1) |
| SK-29b | §8.4 | Players see that something is on them. They do not see what. | | | ✅ | Live: the blanked effect names no aspect and no sign; only its flag, for the module, remembers which it is |
| SK-29c | §8.4 | The module does this by itself whenever a player owns a Stargazer character anywhere in the world: the four aspect effects are renamed, emptied and given one shared icon as they are applied. | | | ✅ | Live: the moment the player's ownership was removed and the sky re-applied, the effect was **Sky: Retrograde** again with its own icon — the control |
| SK-30a | §8.4 | Ten minutes under an open sky and an **Astronomy Lore** or **Occultism** check, as a Recall Knowledge action | effect:info | `test-stargazer` pins it | ✅ | Live: the *Read the Sky* macro rolled SG Ally's Occultism as a secret Recall Knowledge; Mira was offered Astronomy Lore or Occultism. **Built this pass.** The ten minutes are the table's |
| SK-30b | §8.4 | against the region's level-based **Hard** DC. | | `test-stargazer` pins it | ✅ | Live: DC 17 at region level 1 — the Hard DC (15 + 2) |
| SK-30c | §8.4 | On an Exalted or Malefic day, reduce the DC by 5 | | `test-stargazer` pins it | ✅ | Live: on a Malefic day, DC 12 |
| SK-31a | §8.4 Critical Success | You learn the sign **and** the aspect. | effect:info | `test-stargazer` pins it | ✅ | Live: a critical success whispered *Capricorn, Benefic* |
| SK-31b | §8.4 Success | You learn the sign only. | effect:info | `test-stargazer` pins it | ✅ | Live: a success whispered *Capricorn rules it; not whether that is good news* |
| SK-31c | §8.4 Failure | Nothing. | effect:info | `test-stargazer` pins it | ✅ | Live: a failure whispered *the sky will not say* |
| SK-31d | §8.4 Critical Failure | You learn a **wrong sign**, confidently. | effect:info | `test-stargazer` pins it | ✅ | Live: a critical failure whispered *Aries rules it*, in the words of a success. A clouded sky refused to roll at all |

## Interaction with the Saint (guide §8.6)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SK-32a | §8.6 | **Unfailing Cosmo** makes a Saint immune to Retrograde and Malefic aspects entirely, enforced in `tracker.mjs` rather than remembered. | reach:filtered | | ✅ | Live: the Saint *Aquarius* (Unfailing Cosmo) wore no terrain on Malefic and Retrograde days and **Sky: Benefic** on a Benefic day; unsheltered fixtures wore Malefic the same day |
| SK-32b | §8.6 | **Forewarned does nothing for a Saint.** | reach:filtered | | ✅ | Live: Forewarned on that Saint changed nothing — it already wore none |
| SK-33a | §8.6 | It cannot move a **scheduled Zenith**, because that is the GM's arc-climax button and not a thing the sky rolled. | | | ✅ | Live: Leo pinned Exalted two days out by the GM; *Trade the Day* for that day was refused — *a scheduled Zenith is the GM's, not the sky's* |
| SK-33b | §11.5 | a scheduled Zenith is marked as scheduled so *Trade the Day* can refuse to move it | | | ✅ | Live: the pinned queue entry carries `scheduled: true`, and a rolled day does not |
| SK-34 | §8.6 | A Stargazer can tell a Saint **exactly when their Cloth will be lit**, three days out, from 1st level. | effect:info | | ✅ | Live: the Vigil's forecast names each of the next three days' signs (#105 SG-28a) — Capricorn, Malefic on day 229 — so a Capricorn Saint's lit day is read off it |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 51 |
| ⚠️ | 3 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 1 |
| **Total** | **55** |

# Clauses — the Saint's Cloths

*Cloth tracker. Every Cloth's Passive and both of its boons, one independently-failable sentence a row.
Source: `Docs/saint-gold-cloth-guide-v4.md` §5. Libra's Passive and boons are its whole chapter and live in
`libra.md`; every Cloth's four Techniques are `techniques.md`.*

**Tier:** Cloths · **Tracker issue:** #143

## How a row is marked

| Mark | Meaning |
| :-- | :-- |
| ☐ | Not yet driven |
| ✅ | Driven live; the clause happened by itself |
| ⚠️ | Driven live; partially happens — the gap is named in **Evidence** |
| ❌ | Driven live; does not happen |
| 🔧 | Was ❌ or ⚠️, a fix has landed, awaiting re-drive |
| — | Nothing to automate (pure roleplaying / GM ruling) |

**Clause** is a verbatim fragment of the guide (`Docs/saint-gold-cloth-guide-v4.md`), backslash escapes and
all. `build/check-clauses.mjs` asserts it still is one. **Static check** names the content and code that
implement the clause, or says nothing does; **Evidence** names what proved it happened at the table.

*How a clause is driven — the rig, the traps it sets and what a ✅ owes — is
`Docs/tools/live-verification.md`. It is the one copy; this file records results, not method.*

*Where the boons live.* A Cloth's Passive is its feature in `content/saint-class-features/cloths/`. Its
boons are the day's effect — `Sky: Ascendant (<Sign>)` and `Sky: Zenith (<Sign>)` in
`content/saint-effects/sky-ascendant/` and `sky-zenith/` — which `scripts/sky/tracker.mjs` puts on the
Saint whose Cloth matches the day, and which grant the boon's own actions (`content/saint-class-features/actions/`)
for that day only. A Zenith effect carries `sky:ascendant` as well, so *"as Ascendant"* is the Ascendant
rules written again, not inherited; each such row's static check says which of them were.

*Two boons were driven live* (#71, `5a06920`), because they ride `damage-applied`, an event that had never
fired: Cancer's killing touch, and Aquarius's cold. Everything else is ☐.

**IDs are `CL-<nn><letter>`**: three numbers per Cloth — its Passive, its Ascendant Boon, its Zenith Boon —
in the guide's order, and Capricorn a fourth for its second Passive. Libra's would be `CL-19`–`CL-21` and
are skipped. A boon's name and its `[OFFENSE]`-style tag are not clauses.

---

## ♈ Aries (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| CL-01a | Aries Passive | Trained in Crafting. | reach:self | `content/saint-class-features/cloths/aries-the-wall.json` `ActiveEffectLike` crafting rank 1 | ☐ | |
| CL-01b | Aries Passive | You can Repair any Cloth, armor, or shield in 10 minutes with no check and no repair kit, restoring 10 × your level Hit Points. | reach:object · effect:heal | Nothing | ☐ | |
| CL-01c | Aries Passive | A Cloth you repair is fully restored regardless of how it was destroyed. | | Nothing | — | A Cloth's destruction is not modelled (the cracking is left manual, `SC-20f`), so there is no state to restore |
| CL-02a | Aries Ascendant | \+2 status to AC and all saves. | effect:bonus · reach:self | `content/saint-effects/sky-ascendant/sky-ascendant-aries.json` `FlatModifier` +2 status on `ac` and `saving-throw` | ☐ | |
| CL-02b | Aries Ascendant | Reaction (1/round): when a creature within 60 ft makes a ranged or spell attack, or targets an ally with a spell | economy:reaction · economy:once-per-round | `content/saint-class-features/actions/star-guard.json`, a reaction with frequency 1/round, granted by the boon. Nothing detects the trigger | ☐ | |
| CL-02c | Aries Ascendant | the effect is sent nowhere (expended, no result). | effect:intercept | Nothing: the card records the use, and no hook can void an attack or spell in motion (the same limit `sever.json` names) | ☐ | |
| CL-02d | Aries Ascendant | You also gain Dimension Step ✦ (teleport 60 feet). | economy:granted-action · effect:teleport · reach:self | `content/saint-class-features/actions/dimension-step.json`, a 1-action card granted by the boon; nothing moves the token | ☐ | |
| CL-03a | Aries Zenith | plus the reaction has no frequency limit | economy:reaction | `sky-zenith-aries.json` grants the same `star-guard.json`, whose frequency stays 1/round. **As authored this fails** | ☐ | |
| CL-03b | Aries Zenith | once per minute you may target a creature with it (60 ft, Fort save, critical failure teleports it 1 mile; incapacitation). | economy:reaction · reach:single · check:save · effect:teleport | `content/saint-class-features/actions/star-guard-exile.json`: reaction, frequency 1/minute, `incapacitation`, one target within 60 feet, a Fortitude save at the Cosmo DC, `teleport` 5,280 feet on a critical failure | ☐ | |

## ♉ Taurus (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| CL-04a | Taurus Passive | You can't be moved against your will by any creature or effect of your size or smaller. | effect:resistance · reach:self | `taurus-the-horn.json` emits `saint:bulwark`; `scripts/riders-extensions.mjs` refuses this module's own forced moves from a mover of the Saint's size or smaller. A pf2e Shove is not refused | ☐ | |
| CL-04b | Taurus Passive | \+2 circumstance bonus to Athletics and to your DC against Shove, Trip, Grapple, and Disarm. | effect:bonus · reach:self | `taurus-the-horn.json` `FlatModifier` +2 on `athletics` (unconditional) and on `fortitude-dc` / `reflex-dc` predicated on the four actions | ☐ | |
| CL-05a | Taurus Ascendant | Unarmed Strikes gain \+1 damage die | effect:strike-damage | `sky-ascendant-taurus.json` `DamageDice` on `unarmed-damage` | ☐ | |
| CL-05b | Taurus Ascendant | and force a Fortitude save (failure \= pushed 10 feet and knocked prone) | when:strike-made · check:attack-then-save · effect:forced-move/push · effect:condition | `sky-ascendant-taurus.json` `strike-resolved` rider on an unarmed hit: a Fortitude save at the Cosmo DC, then prone and a 10-foot `teleport` push on a failure | ☐ | |
| CL-05c | Taurus Ascendant | you count as one size larger whenever that benefits you. | effect:size | A `Note` on Athletics only | ☐ | |
| CL-06a | Taurus Zenith | as Ascendant with \+2 damage dice total | effect:strike-damage | `sky-zenith-taurus.json` `DamageDice` 2 on unarmed; the Fortitude rider is repeated | ☐ | |
| CL-06b | Taurus Zenith | temporary Hit Points equal to your level at the start of each turn | effect:temp-hp · when:turn-start | `sky-zenith-taurus.json` `TempHP` `@actor.level`, `onCreate` and `onTurnStart` | ☐ | |
| CL-06c | Taurus Zenith | Great Horn costs no Focus Point once per round. | economy:once-per-round · economy:charges | `taurus-the-horn.json` `freeCast` predicated only `sky:zenith`, on the Cloth's 1/round frequency. **The predicate names no Technique**, so any Technique, not only *Great Horn*, is paid for | ☐ | |

## ♊ Gemini (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| CL-07a | Gemini Passive | Trained in Deception. | reach:self | `gemini-the-other-dimension.json` `ActiveEffectLike` deception rank 1 | ☐ | |
| CL-07b | Gemini Passive | You have two aspects, Light and Shadow, and swap between them as a free action once per hour. | economy:granted-action · economy:charges | `content/saint-class-features/actions/swap-aspect.json`: free, frequency 1/hour, a `toggle` rider cycling `gemini-aspect` light ↔ shadow | ☐ | |
| CL-07c | Gemini Passive | In Shadow, Another Dimension instead becomes a 1-target confuse effect (Will save, confused 1 round on a failure). | check:save · effect:condition · ending:duration · reach:single | `another-dimension.json`: the banish riders are predicated `not gemini-aspect:shadow`, and a confused rider for 1 round (failure and critical failure) is predicated on it | ☐ | |
| CL-07d | Gemini Passive | Your appearance, voice, and aura change completely; you have two identities that nothing short of true seeing connects. | | Nothing | — | Deliberately left to the table (`9c7bbcc`, backlog group 6: Gemini's two identities) — a disguise, not a rule |
| CL-08a | Gemini Ascendant | Cast your 1st Technique without spending a Focus Point once per round | economy:once-per-round · economy:charges | `gemini-the-other-dimension.json` `freeCast` predicated `sky:ascendant` and `item:tag:technique-slot-1`, on the Cloth's 1/round frequency; `scripts/economy/free-cast.mjs` | ☐ | |
| CL-08b | Gemini Ascendant | Galaxian Explosion's burst increases by 20 feet. | reach:area/burst | `sky-ascendant-gemini.json` `ItemAlteration` +20 on `galaxian-explosion` | ☐ | |
| CL-09a | Gemini Zenith | plus a duplicate of you appears each turn in an adjacent square: your statistics, acting on your initiative | effect:summon · when:turn-start | `sky-zenith-gemini.json` `duplicate` flag; `scripts/economy/duplicate.mjs` spawns a token of the Saint in a free adjacent square at their turn start, with no combatant of its own | ☐ | |
| CL-09b | Gemini Zenith | with 2 actions, Strike and Stride only (no Techniques, no Focus Points, no skill actions) | effect:forbid · reach:minion | `duplicate.mjs` empties the duplicate's focus pool and the cast wrapper refuses it; *Strike and Stride only* and the two actions are a note | ☐ | |
| CL-09c | Gemini Zenith | one at a time, vanishing at the start of your next turn. | ending:next-turn · reach:minion | `duplicate.mjs` deletes the old duplicate before making the new one | ☐ | |

## ♋ Cancer (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| CL-10a | Cancer Passive | You can see and speak with spirits, ghosts, and the recently dead. | effect:sense | Nothing | ☐ | |
| CL-10b | Cancer Passive | You automatically know the current Hit Point category (healthy / hurt / near death / dying) of every creature within 30 feet. | effect:info · reach:area/emanation · when:turn-start | `cancer-the-yellow-spring.json` `readout` rider at the Saint's turn start, range 30 | ☐ | |
| CL-10c | Cancer Passive | Trained in Medicine. | reach:self | `cancer-the-yellow-spring.json` `ActiveEffectLike` medicine rank 1 | ☐ | |
| CL-11a | Cancer Ascendant | Any creature you reduce to 0 Hit Points dies (no save). | when:damage-dealt · effect:death | `content/saint-class-features/actions/the-yellow-spring-opens.json` `damage-applied` rider predicated `rider:target:hp-zero`, granted by the boon | ✅ | Live (#71, `5a06920`): *"D6 is reduced to 0 Hit Points — the Yellow Spring takes it — it dies, with no save."* No control was recorded beside it |
| CL-11b | Cancer Ascendant | Once per round as a free action, a creature within 30 ft at half Hit Points or fewer must save (Fortitude) or take 8d6 void and be slowed 1 | economy:once-per-round · reach:filtered · check:save · effect:damage | `the-yellow-spring-opens.json`: free, frequency 1/round, an `action-used` save rider predicated `rider:target:hp-half-or-less` — 8d6 void and slowed 1 for a round on a failure. It has no area config, so the 30 feet is not measured | ☐ | |
| CL-11c | Cancer Ascendant | You always know the direction to the nearest planar boundary. | | Nothing | — | A planar boundary is the GM's map, not the board's |
| CL-12 | Cancer Zenith | Once per Zenith day, 30-ft emanation: every enemy at half Hit Points or fewer must save (Fortitude) or die (incapacitation). | reach:area/emanation · reach:filtered · check:save · effect:death | `content/saint-class-features/actions/the-yellow-spring-is-here.json`: 3 actions, `incapacitation`, frequency 1/day recharged per Zenith day, a 30-foot emanation of enemies, a Fortitude save predicated `hp-half-or-less`, death on a failure | ☐ | |

## ♌ Leo (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| CL-13a | Leo Passive | You are immune to the frightened condition and to fear effects. | effect:resistance · reach:self | `leo-the-lightning.json` `Immunity` frightened and fear-effects | ☐ | |
| CL-13b | Leo Passive | Trained in Intimidation, with a \+1 circumstance bonus to Demoralize. | effect:bonus · reach:self | `leo-the-lightning.json` intimidation rank 1, `FlatModifier` +1 predicated `action:demoralize` | ☐ | |
| CL-14a | Leo Ascendant | Your fists gain agile and \+1d6 electricity | effect:trait-gained · effect:strike-damage | `sky-ascendant-leo.json` `AdjustStrike` agile and `DamageDice` on unarmed | ☐ | |
| CL-14b | Leo Ascendant | you gain a Haste-style extra action each turn (Strike or Stride only). | effect:condition | `sky-ascendant-leo.json` `GrantItem` of pf2e's quickened condition; *Strike or Stride only* is the condition's own note | ☐ | |
| CL-15a | Leo Zenith | as Ascendant with \+3d6 electricity | effect:strike-damage | `sky-zenith-leo.json` `DamageDice` and `AdjustStrike` agile | ☐ | |
| CL-15b | Leo Zenith | and you are quickened 1 in addition to the Haste action — two extra actions on a Zenith day. | effect:condition · when:turn-start | `sky-zenith-leo.json` grants quickened, and a `turn-start` rider refreshes `Effect: Lightning Plasma (Second Action)` — a `Note` of the second action, which pf2e's single quickened cannot count | ☐ | |

## ♍ Virgo (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| CL-16a | Virgo Passive | As a single action (concentrate) you may close your eyes. | economy:granted-action · reach:self | `content/saint-class-features/actions/om.json`: 1 action, concentrate, an `action-used` rider placing `Effect: Om` once on the Saint | ☐ | |
| CL-16b | Virgo Passive | While your eyes are closed you are blinded — fully, with all that entails | effect:condition · reach:self | `effect-om.json` `GrantItem` of pf2e's blinded, predicated `not om:eyes-open` | ☐ | |
| CL-16c | Virgo Passive | but you gain one Om stack at the end of each of your turns, to a maximum of 5. | economy:charges · when:turn-end | `scripts/roll-rewrites/om.mjs` raises the badge on `pf2e.endTurn`, to 5 (7 on an Ascendant day). The badge's minimum is 1, so the eyes close holding a stack before any turn has ended | ☐ | |
| CL-16d | Virgo Passive | you gain a \+1 status bonus per stack to your Technique DCs and to unarmed Strike damage | effect:bonus · effect:strike-damage | `effect-om.json` `FlatModifier` status `@item.badge.value` on `unarmed-damage` and on `saint` / `spell-dc`, while the eyes are closed | ☐ | |
| CL-16e | Virgo Passive | and from 7th level your Sixth Sense functions as a precise sense out to 30 feet, letting you fight blind. | effect:sense | `effect-om.json` `Sense` lifesense, precise, 30 feet, predicated `self:level ≥ 7` | ☐ | |
| CL-16f | Virgo Passive | Opening your eyes is a free action, usable at any time. | economy:granted-action | `content/saint-class-features/actions/open-your-eyes.json`: free, a `toggle` rider setting `om:eyes-open` | ☐ | |
| CL-16g | Virgo Passive | All stacks are spent and reset to 0 | economy:charges · ending:spent | `scripts/roll-rewrites/om.mjs` spends the stacks on the first damage roll that benefits, and `pf2e.endTurn` clears what is left | ☐ | |
| CL-16h | Virgo Passive | the next Technique you cast or unarmed Strike you make before the end of that turn is empowered: \+2 damage dice per stack spent | effect:strike-damage · effect:damage · ending:spent | `effect-om.json` `DamageDice` on `unarmed-damage` and `spell-damage` predicated `om:eyes-open`; `om.mjs` makes it the next roll only | ☐ | |
| CL-16i | Virgo Passive | if it allows a saving throw, a −1 circumstance penalty per 2 stacks spent to that save. | effect:penalty · check:save | `effect-om.json` raises the Saint's `spell-dc` by `floor(stacks / 2)`, circumstance — the DC moves rather than the save | ☐ | |
| CL-16j | Virgo Passive | Your eyes open automatically, spending nothing, if you are knocked unconscious. | ending:with-condition | `scripts/roll-rewrites/om.mjs` opens the eyes without spending when the Saint goes unconscious | ☐ | |
| CL-17a | Virgo Ascendant | Each unarmed hit forces a Will save or the target loses a sense, cumulatively (blind → deaf → smell/taste → touch: −4 to attacks, can't Grapple). | when:strike-made · check:attack-then-save · effect:condition-climbs | `sky-ascendant-virgo.json` `strike-resolved` rider: a Will save at the Cosmo DC, then the next sense down the ladder — blinded, deafened, `Effect: Sense Lost (Smell and Taste)`, `Effect: Sense Lost (Touch)` (−4 to attack rolls). *Can't Grapple* is the effect's text | ☐ | |
| CL-17b | Virgo Ascendant | Removed only by restoration or a full rest. | ending:preparations | The conditions are applied without a duration and the two Sense Lost effects are unlimited; nothing removes them at a rest | ☐ | |
| CL-17c | Virgo Ascendant | Your maximum Om stacks increase to 7. | economy:charges | `scripts/roll-rewrites/om.mjs` `ceilingFor` is 7 under `sky:ascendant`; the badge is authored with room for seven | ☐ | |
| CL-18a | Virgo Zenith | plus once per minute ✦✦✦, 60-ft emanation, Will save (incapacitation) or lose all five senses for 1 minute | reach:area/emanation · check:save · effect:condition · ending:duration | `content/saint-class-features/actions/six-realms-unmade.json`: 3 actions, frequency 1/minute, `incapacitation`, a 60-foot emanation of enemies; on a failure blinded, deafened and both Sense Lost effects for 1 minute | ☐ | |
| CL-18b | Virgo Zenith | critical failure lasts until restoration. | ending:permanent | `six-realms-unmade.json` applies the same four with no duration on a critical failure | ☐ | |

## ♏ Scorpio (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| CL-22a | Scorpio Passive | Track needles on each creature separately; they reset when the creature takes a full rest or when the encounter ends. | economy:charges · ending:duration | `content/saint-effects/riders/effect-scarlet-needle.json`: a counter badge on the creature, lasting the encounter | ☐ | |
| CL-22b | Scorpio Passive | Whenever you hit a creature with an unarmed Strike, you may spend a free action to add one needle (maximum 15). | economy:granted-action · economy:charges | `content/saint-class-features/actions/place-a-scarlet-needle.json`: free, a `stack` rider of the needle effect. Nothing asks for the hit first | ☐ | |
| CL-22c | Scorpio Passive | At 5 needles the creature is enfeebled 1; at 10, blinded; at 14, stunned 2 and its Strikes lose all runes. | effect:condition-climbs · effect:condition | `effect-scarlet-needle.json` `counterThresholds`: enfeebled 1 at 5, blinded at 10, stunned 2 and `Effect: Runes Severed` at 14, each once as the count crosses it | ☐ | |
| CL-23a | Scorpio Ascendant | Needles land on any attack, hit or miss. | when:strike-made · economy:charges | `sky-ascendant-scorpio.json` `strike-resolved` rider with no outcome filter, stacking a needle — on the Saint's Strikes; a spell attack is not a Strike | ☐ | |
| CL-23b | Scorpio Ascendant | Each needle deals 1d6 persistent bleed, stacking, capped at 10 needles of bleed. | effect:persistent | `sky-ascendant-scorpio.json` `persistent-damage` 1d6 bleed per needle, `max: 10` | ☐ | |
| CL-23c | Scorpio Ascendant | At 8 needles the target must save (Fortitude, incapacitation) or die. | check:save · effect:death | `sky-ascendant-scorpio.json` a Fortitude save at the Cosmo DC and death on a failure, predicated on 8 needles. A rider cannot carry the incapacitation trait | ☐ | |
| CL-24a | Scorpio Zenith | Antares triggers at 5 needles | check:save · effect:death | `sky-zenith-scorpio.json` repeats the rules with the death save at 5 needles | ☐ | |
| CL-24b | Scorpio Zenith | and your allies' hits apply needles too. | reach:allies · when:strike-made | `sky-zenith-scorpio.json` gives every ally `Effect: The Scorpion's Blessing` (once), whose `strike-resolved` rider stacks a needle on a hit | ☐ | |

## ♐ Sagittarius (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| CL-25a | Sagittarius Passive | Your Cloth includes a bow that uses your unarmed proficiency and can never be disarmed or destroyed. | effect:strikes-granted | Nothing: there is no bow item | ☐ | |
| CL-25b | Sagittarius Passive | \+2 circumstance bonus to Perception to notice things beyond 100 feet. | effect:bonus | `sagittarius-the-arrow.json` a `bow-distant` toggle and a `FlatModifier` +2 on Perception predicated on it | ☐ | |
| CL-25c | Sagittarius Passive | Your Speed increases by 10 feet. | effect:speed | `sagittarius-the-arrow.json` `BaseSpeed` land `speed + 10` | ☐ | |
| CL-26a | Sagittarius Ascendant | Gain a fly Speed equal to your Speed. | effect:speed | `sky-ascendant-sagittarius.json` `BaseSpeed` fly | ☐ | |
| CL-26b | Sagittarius Ascendant | Golden Arrow's increment becomes 1 mile | reach:single | Nothing changes *Golden Arrow*'s range | ☐ | |
| CL-26c | Sagittarius Ascendant | ignores all cover, concealment, and the hidden and undetected conditions | effect:reveal | Nothing | ☐ | |
| CL-26d | Sagittarius Ascendant | and can hit any creature whose location you can name without line of sight. | reach:single | Nothing | ☐ | |
| CL-27 | Sagittarius Zenith | plus once per minute Golden Arrow reaches any named creature within a mile through any barrier short of a planar boundary and deals \+8 dice. | reach:single · effect:damage | `content/saint-class-features/actions/golden-arrow-named-shot.json`: 2 actions, frequency 1/minute, one enemy within 5,280 feet with no line of effect needed, damage *Golden Arrow*'s plus 8d6 force — applied with no attack roll | ☐ | |

## ♑ Capricorn (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| CL-28a | Capricorn Passive | Your unarmed Strikes gain the versatile S and deadly d8 traits. | effect:trait-gained | `capricorn-excalibur.json` `AdjustStrike` versatile-s and deadly-d8 | ☐ | |
| CL-28b | Capricorn Passive | Trained in Athletics. | reach:self | `capricorn-excalibur.json` athletics rank 1 — which every Saint already has | ☐ | |
| CL-29a | Capricorn Passive | Your critical hits with unarmed Strikes sever — the target permanently loses the use of one limb, natural attack, or sense of your choice until it receives regenerate. | when:strike-made · check:caster-choice · ending:permanent | `capricorn-excalibur.json` `strike-resolved` rider on an unarmed critical hit: a choice of `Effect: Severed (Limb)`, `(Natural Attack)` or `(Sense)`, unlimited | ☐ | |
| CL-29b | Capricorn Passive | You also gain the sword group critical specialization with all your Strikes. | when:strike-made · effect:condition | `capricorn-excalibur.json` `CriticalSpecialization` predicated `item:category:unarmed` — the fist only, not *all your Strikes* | ☐ | |
| CL-30a | Capricorn Ascendant | Your unarmed Strikes ignore all resistances, physical immunities, and Hardness | effect:strike-damage | `sky-ascendant-capricorn.json` `bypass` flag: Hardness ignored, physical immunity ignored, every resistance, on unarmed Strikes | ☐ | |
| CL-30b | Capricorn Ascendant | and gain \+1 damage die. | effect:strike-damage | `sky-ascendant-capricorn.json` `DamageDice` on unarmed | ☐ | |
| CL-30c | Capricorn Ascendant | You may Strike incorporeal creatures and force effects; a critical hit destroys a force effect. | effect:destroy · reach:object | A `Note` on unarmed damage | ☐ | |
| CL-31 | Capricorn Zenith | plus ⤾ (reaction, once per turn per creature): a creature attacks you or a spell effect enters your space → you sever it (no effect). | economy:reaction · effect:intercept | `content/saint-class-features/actions/sever.json`: a reaction, frequency 1/turn flat rather than per creature. Nothing voids the attack — the card says so | ☐ | |

## ♒ Aquarius (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| CL-32a | Aquarius Passive | Cold resistance equal to your level | effect:resistance · reach:self | `aquarius-absolute-zero.json` `Resistance` cold `@actor.level` | ☐ | |
| CL-32b | Aquarius Passive | immune to the effects of severe cold environments | | Nothing | — | pf2e has no environment to be immune to; the table rules on weather |
| CL-32c | Aquarius Passive | \+1 status bonus to Will saves against emotion effects. | effect:bonus | `aquarius-absolute-zero.json` `FlatModifier` +1 status on Will predicated `item:trait:emotion` | ☐ | |
| CL-32d | Aquarius Passive | Trained in Occultism or Arcana (your choice). | reach:self · check:caster-choice | `aquarius-absolute-zero.json` a `ChoiceSet` and the chosen rank | ☐ | |
| CL-33a | Aquarius Ascendant | Cold damage from you forces a Fortitude save or slowed 1 | when:damage-dealt · check:save · effect:condition | `sky-ascendant-aquarius.json` `damage-applied` rider predicated on cold damage: a Fortitude save at the Cosmo DC, slowed 1 on a failure | ✅ | Live (#71, `5a06920`): 12d8 cold landed, the Fortitude save rolled itself, and the failure took **Slowed 1**. No control was recorded beside it |
| CL-33b | Aquarius Ascendant | cumulative to slowed 4 \= petrified in ice | effect:condition-climbs | `sky-ascendant-aquarius.json`: slowed climbs to `max: 4`, and a failure at slowed 3 or more petrifies instead | ☐ | |
| CL-33c | Aquarius Ascendant | (shatterable: any critical hit destroys it permanently) | effect:death | Nothing | ☐ | |
| CL-33d | Aquarius Ascendant | Your cold damage ignores cold resistance and treats cold immunity as cold resistance 10 | effect:damage | `sky-ascendant-aquarius.json` `bypass` on cold damage: cold resistance ignored, cold immunity downgraded to resistance 10 | ☐ | |
| CL-34a | Aquarius Zenith | Once per minute ✦✦✦, 60-ft line, 16d6 cold, basic Fortitude | reach:area/line · check:basic-save · effect:damage | `content/saint-class-features/actions/aurora-execution.json`: 3 actions, frequency 1/minute, a 60-foot line, a Fortitude save whose riders deal 16d6 only on a failure or critical failure — **no half on a success and no double on a critical failure**, so not a basic save as authored | ☐ | It fired live once, in a loop, before `bdc6e29` stopped an ability triggering itself; that was never a pass |
| CL-34b | Aquarius Zenith | critical failure \= frozen solid (petrified, shatterable), incapacitation. | check:save · effect:condition | `aurora-execution.json` petrified on a critical failure; `incapacitation` on the action | ☐ | |

## ♓ Pisces (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| CL-35a | Pisces Passive | You are immune to poison. | effect:resistance · reach:self | `pisces-the-roses.json` `Immunity` poison | ☐ | |
| CL-35b | Pisces Passive | Any creature that touches you or hits you with an unarmed or non-reach melee attack takes 1d6 poison damage. | when:strike-received · reach:attacker · effect:damage | `pisces-the-roses.json` `strike-received` rider, 1d6 poison on a hit by any melee or unarmed Strike — a reach weapon is not excluded (the rider's own note says so), and a touch is not seen | ☐ | |
| CL-36a | Pisces Ascendant | 10-ft emanation: at the end of each of your turns, enemies inside must save (Fortitude) or take 4d6 poison and become enfeebled 1 (cumulative to 4), cap 4 creatures | when:turn-end · reach:area/emanation · check:save · effect:condition-climbs | `sky-ascendant-pisces.json` `turn-end` rider over a 10-foot emanation of enemies, at most 4: a Fortitude save, 4d6 poison and enfeebled +1 to `max: 4` on a failure | ☐ | |
| CL-36b | Pisces Ascendant | requires you to have acted hostilely that turn. | economy:requires | Not checked — the rider's note says it cannot tell | ☐ | |
| CL-36c | Pisces Ascendant | The emanation persists even while you are unconscious. | area:aura/pf2e | The effect and its rider take no notice of the Saint's consciousness | ☐ | |
| CL-37a | Pisces Zenith | as Ascendant with a 15-ft emanation and 8d6 poison per turn | reach:area/emanation · effect:damage | `sky-zenith-pisces.json` the same rider over 15 feet at 8d6 | ☐ | |
| CL-37b | Pisces Zenith | plus Bloody Rose once per minute ✦✦ (incapacitation, death): 60 ft, one creature, Fortitude; failure 10d6 and enfeebled 2, critical failure dies. | reach:single · check:save · effect:damage · effect:death | `content/saint-class-features/actions/bloody-rose.json`: 2 actions, frequency 1/minute, `incapacitation` and `death`; a Fortitude save — 10d6 poison and enfeebled 2 on a failure, death on a critical failure. No area config, so the 60 feet is not measured | ☐ | |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 89 |
| ✅ | 2 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 4 |
| **Total** | **95** |

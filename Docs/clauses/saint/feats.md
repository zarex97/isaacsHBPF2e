# Clauses — Saint feats

*Feat tracker. Every class feat's independently-failable sentences, one row each. Source:
`saint-feat-compendium.md` at the repository root — guide v4 has no feats chapter, and the compendium is
where the feats are written out in full.*

**Tier:** feats · **Tracker issue:** #143

## How a row is marked

| Mark | Meaning |
| :-- | :-- |
| ☐ | Not yet driven |
| ✅ | Driven live; the clause happened by itself |
| ⚠️ | Driven live; partially happens — the gap is named in **Evidence** |
| ❌ | Driven live; does not happen |
| 🔧 | Was ❌ or ⚠️, a fix has landed, awaiting re-drive |
| — | Nothing to automate (pure roleplaying / GM ruling) |

**Clause** is a verbatim fragment of the compendium (`saint-feat-compendium.md`), backslash escapes and all.
`build/check-clauses.mjs` asserts it still is one. **Static check** names the content and code that implement
the clause, or says nothing does; **Evidence** names what proved it happened at the table.

*How a clause is driven — the rig, the traps it sets and what a ✅ owes — is
`Docs/tools/live-verification.md`. It is the one copy; this file records results, not method.*

*The feats' own shape.* Each feat is an item in `content/saint-feats/level-<n>/`. Many carry their numbers
as rule elements — a speed, a toggle and its bonus, a damage type — and many more are a card with a
frequency and nothing behind it: *Rise*, *Twin Cosmo*, *Second Ascension*, *Speed of Light*, *Entrust Your
Cosmo*, *Dissolve*. The two that promise a heightening step (*Cosmo Legend*, and *Cosmo Overflow* on a lit
day) emit a roll option nothing reads, the same gap as Cloth Attunement (`class.md` `SC-30a`). Nothing here
has been driven live.

*Three feats have no rows.* *Golden Cosmo* (10th), *The Thirteenth* (18th) and *Two Skies* (18th) are named in
the compendium's appendix and nowhere else; their items were written from that one line, and each says so.
With no source text there is nothing to quote, so they wait for the compendium to write them. (*Two Skies*
also shares its slug with the Stargazer's 18th-level feat, which `scripts/sky/tracker.mjs` `readsTwoSkies`
reads by slug.) The appendix's *Prophecy's Weight* has neither text nor item.

**IDs are `FT-<nn><letter>`**, one number per feat in the compendium's order, a letter per clause. A feat's
flavour line and its balance notes are not clauses.

---

## 1st level

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| FT-01a | Cosmo Sense | Attempt a check to Recall Knowledge about a creature within 60 feet, using your key ability instead of the relevant skill. | reach:single · effect:info | `content/saint-feats/level-1/cosmo-sense.json`, a 1-action card. Nothing rolls | ☐ | |
| FT-01b | Cosmo Sense | On a success you learn its level relative to yours (higher, equal, or lower) and its single highest and lowest saving throws | effect:info | Nothing | ☐ | |
| FT-01c | Cosmo Sense | on a critical success you also learn its current focus/spell resources or that it has none. | effect:info | Nothing | ☐ | |
| FT-01d | Cosmo Sense | it works through disguise and illusion, reading the cosmo beneath. | effect:reveal | Nothing | ☐ | |
| FT-02a | Pandora Box | When you dismiss your Cloth, you may send it to a pocket of folded space instead of collapsing it into a box or your body. | | Nothing | — | Deliberately left to the table (`9c7bbcc`, backlog group 6: Pandora Box): where a dismissed Cloth waits has no mechanical effect |
| FT-02b | Pandora Box | As an activity taking 10 minutes, you may summon it to your current location from anywhere on the same plane | | Nothing | — | Travel and distance are the table's; the same backlog entry |
| FT-02c | Pandora Box | your Cloth can act as a courier | | Nothing | — | A courier across the map is the GM's story; the same backlog entry |
| FT-03a | Saint's Vow | Choose one ally when you make your daily preparations; this is the target of your Vow until your next preparations. | reach:allies · ending:preparations | Nothing records the ally. `content/saint-feats/level-1/saints-vow.json` has a `saints-vow` toggle | ☐ | |
| FT-03b | Saint's Vow | You gain a \+1 circumstance bonus to attack rolls against any creature that has damaged, or attempted to inflict a condition on, the target of your Vow since the end of your last turn. | effect:bonus · economy:requires | `saints-vow.json` `FlatModifier` +1 circumstance on attacks predicated on the toggle, which the player sets | ☐ | |
| FT-03c | Saint's Vow | once per round when the target of your Vow would be reduced to 0 Hit Points while you are within 30 feet, you may use a reaction to Stride up to your Speed toward them | when:dying · economy:reaction · economy:once-per-round | `content/saint-class-features/actions/vows-answer.json`, a reaction card **with no frequency field** — its text says once per round. Nothing detects the trigger | ☐ | |
| FT-03d | Saint's Vow | if this brings them within your reach, they instead remain at 1 Hit Point (this benefit can aid a given ally only once per hour). | effect:stabilize · economy:once-per-target | Nothing | ☐ | |
| FT-03e | Saint's Vow | Breaking a Vow deliberately — abandoning the person you swore to protect — costs you the use of this feat until you complete a full day of atonement. | | Nothing | — | Whether a Vow was broken is the GM's ruling |
| FT-04a | Fists of the Constellation | Choose one damage type dealt by your Cloth's Signature Technique | check:caster-choice · effect:damage-type | `content/saint-feats/level-1/fists-of-the-constellation.json` `ChoiceSet` of force, electricity, cold, void or poison — not filtered by the Cloth, and missing the Signatures' slashing, bludgeoning and bleed | ☐ | |
| FT-04b | Fists of the Constellation | Your unarmed Strikes deal that damage type instead of bludgeoning | effect:damage-type | `fists-of-the-constellation.json` `ItemAlteration` `damage-type` on unarmed | ☐ | |
| FT-04c | Fists of the Constellation | and they count as your Signature Technique's element for the purpose of your own feats and boons that reference it. | effect:trait-gained | Nothing | ☐ | |
| FT-04d | Fists of the Constellation | Once per round, when you critically hit with an unarmed Strike, the target also takes persistent damage of that type equal to your number of weapon damage dice | when:strike-made · effect:persistent · economy:once-per-round | Nothing | ☐ | |
| FT-04e | Fists of the Constellation | Special If your Cloth's Signature Technique deals no damage (Gemini, Virgo), you instead choose force | effect:damage-type | Force is among the choices for everyone | ☐ | |
| FT-04f | Fists of the Constellation | (Virgo: on a critical hit, the target is dazzled 1 round; Gemini: on a critical hit, the target is off-guard to you until the end of your next turn). | when:strike-made · effect:condition | Nothing | ☐ | |

## 2nd level

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| FT-05a | Heated-Up Cosmo | Once per day, you may Refocus as a single action instead of over 10 minutes. | economy:granted-action · economy:charges | `content/saint-feats/level-2/heated-up-cosmo.json`, a 1-action card with frequency 1/day; it restores no Focus Point | ☐ | |
| FT-05b | Heated-Up Cosmo | any creature with a Sixth Sense–equivalent ability immediately knows your location. | | Nothing | — | What another creature learns is the GM's to say |
| FT-06a | Cloth Bond | Choose one Technique you know. | check:caster-choice | Nothing: `content/saint-feats/level-2/cloth-bond.json` has no rules | ☐ | |
| FT-06b | Cloth Bond | The fundamental and property runes on your Cloth (potency, striking, and any property runes) also apply to that Technique's spell attack rolls and damage | effect:weapon-runes | Nothing | ☐ | |
| FT-06c | Cloth Bond | If the Technique makes a spell attack, it now adds your Cloth's potency bonus to that attack roll | effect:bonus · check:attack | Nothing | ☐ | |
| FT-06d | Cloth Bond | You may retrain this feat to choose a different Technique whenever you gain a level. | | Nothing | — | Retraining is pf2e's and the table's |

## 4th level

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| FT-07a | Rise | Frequency once per day Trigger You are reduced to 0 Hit Points but not killed outright. | when:damage-taken · economy:reaction · economy:charges | `content/saint-feats/level-4/rise.json`, a reaction with frequency 1/day. It declares no `refuseDeath`, so `scripts/refuse-death.mjs` never sees it | ☐ | |
| FT-07b | Rise | You remain conscious with 1 Hit Point instead of falling. | effect:stabilize | Nothing; `Effect: Rise` is linked from the card and has no rules | ☐ | |
| FT-07c | Rise | You are wounded 1 (or increase your wounded value by 1\) | effect:condition | Nothing | ☐ | |
| FT-07d | Rise | if the same hit would deal enough to kill you outright (Hit Points below the negative of your maximum), Rise does not save you. | reach:filtered | Nothing | ☐ | |
| FT-08a | Second Cloth Technique | Learn one Signature Technique from a Cloth other than your own. | check:caster-choice | Nothing grants it: `content/saint-feats/level-4/second-cloth-technique.json` has no rules | ☐ | |
| FT-08b | Second Cloth Technique | Its rank is one lower than your usual Technique rank (minimum rank 1), and it uses your Cosmo DC and focus pool normally. | scaling:from-rank | `scripts/cosmo.mjs` files any `cosmo` spell into the Cosmo entry, so a Technique dragged on uses the Cosmo DC and pool; nothing lowers its rank | ☐ | |
| FT-08c | Second Cloth Technique | You cannot select a Cloth's L11 Cloth Ability this way — only its Signature Technique. | economy:requires | Nothing | ☐ | |

## 6th level

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| FT-09a | Speed of Sound | Your Speed increases by 10 feet. | effect:speed | `content/saint-feats/level-6/speed-of-sound.json` `FlatModifier` +10 status on `land-speed` | ☐ | |
| FT-09b | Speed of Sound | On any day your Cloth's constellation is ascendant (or Exalted), this bonus increases to \+20 feet | effect:speed | `speed-of-sound.json` `FlatModifier` +20 status predicated `sky:ascendant` | ☐ | |
| FT-09c | Speed of Sound | and you ignore difficult terrain that isn't magical. | effect:terrain | Nothing | ☐ | |
| FT-10a | Burning Cosmo | You can Demoralize using your key ability modifier in place of Intimidation | check:maneuver | Nothing: `content/saint-feats/level-6/burning-cosmo.json` has no rules | ☐ | |
| FT-10b | Burning Cosmo | you may target any creature within 60 feet that can see you, ignoring the normal 30-foot range and the shared-language requirement | reach:single | Nothing | ☐ | |
| FT-10c | Burning Cosmo | On a critical success, the target is frightened 2 instead of frightened 2/1 | effect:condition | Nothing | ☐ | |
| FT-10d | Burning Cosmo | if it is of a lower level than you it cannot reduce its frightened value below 1 while it remains within 60 feet of you | effect:condition-floor · ending:out-of-range | Nothing | ☐ | |
| FT-10e | Burning Cosmo | Special On any day your Cloth's constellation is ascendant, your cosmo is bright enough that you may Demoralize all enemies in a 30-foot emanation with a single action, rolling once against each. | reach:area/emanation · reach:enemies | Nothing | ☐ | |

## 8th level

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| FT-11a | Twin Cosmo | Frequency once per day Trigger An enemy takes an action that would trigger a reaction you could make, or an ally within 30 feet is reduced to 0 Hit Points. | economy:reaction · economy:charges | `content/saint-feats/level-8/twin-cosmo.json`, a reaction with frequency 1/day. Nothing detects the trigger | ☐ | |
| FT-11b | Twin Cosmo | Effect You cast one Technique you know that has a casting time of 2 actions or fewer, as a reaction. | economy:reaction | Nothing casts: the Technique is cast from the sheet as usual | ☐ | |
| FT-11c | Twin Cosmo | If the Technique normally costs a Focus Point, it still does. | economy:charges | pf2e's own cast spends it | ☐ | |
| FT-12a | Read the Constellation | Frequency once per week During your daily preparations, you learn whether your Cloth's constellation will be ascendant on any of the next three days, and if so, which day and whether it will be Exalted. | effect:info | `content/saint-feats/level-8/read-the-constellation.json`, frequency 1/week; nothing reads the sky's queue for it | ☐ | |
| FT-12b | Read the Constellation | You still learn nothing about the other twelve signs. | | Nothing | — | A limit on what is told, and nothing is told |

## 10th level

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| FT-13a | Cosmo Overflow | Frequency once per hour You cast a Technique you know of 2 actions or fewer without spending a Focus Point. | economy:charges · economy:granted-action | `content/saint-feats/level-10/cosmo-overflow.json`, a 2-action card with frequency 1/hour and **no `freeCast` flag** — `scripts/economy/free-cast.mjs` never pays for the cast | ☐ | |
| FT-13b | Cosmo Overflow | On any day your Cloth's constellation is ascendant (or Exalted), the frequency increases to once per 10 minutes | economy:charges | Nothing | ☐ | |
| FT-13c | Cosmo Overflow | and the Technique cast this way is treated as one rank higher (to a maximum of your normal maximum rank). | scaling:dice-per-rank | Nothing | ☐ | |
| FT-14a | Cosmo Legend | Your Techniques' rank is equal to half your level rounded up as normal, plus 1 (to a maximum of rank 10). | scaling:dice-per-rank | `content/saint-feats/level-10/cosmo-legend.json` emits `saint:cosmo-legend`, and **nothing reads it** — no Technique rule and no step provider | ☐ | |
| FT-14b | Cosmo Legend | This applies to every Technique you know, including Cloth Abilities and boon-granted techniques. | scaling:dice-per-rank | The same | ☐ | |

## 12th level

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| FT-15a | Second Ascension | Frequency three times per week Effect For 1 minute, treat the day as though your Cloth's constellation were ascendant, gaining your Ascendant Boon. | economy:charges · ending:duration | `content/saint-feats/level-12/second-ascension.json`, frequency 3/week; `Effect: Second Ascension` (`sky:ascendant`, 1 minute) is linked from the card, not applied, and the boon's own items are not granted | ☐ | |
| FT-15b | Second Ascension | If your sign is already ascendant (but not Exalted), you may instead spend this to treat the day as Exalted for 1 minute, gaining your Zenith Boon. | ending:duration | Nothing | ☐ | |
| FT-15c | Second Ascension | You cannot use Second Ascension and Seventh Sense's Burn Your Cosmo on the same turn. | economy:requires | Nothing | ☐ | |
| FT-16a | Cloth Resonance | Choose two benefits from the list below; you gain both. | check:caster-choice | `content/saint-feats/level-12/cloth-resonance.json`, two `ChoiceSet` rules; nothing reads the answers | ☐ | |
| FT-16b | Cloth Resonance | Reactive Cloth — Your Cloth's AC bonus applies even in the brief instants you are flat-footed by surprise; you are never off-guard during the first round of combat while you wear it. | effect:resistance | Nothing | ☐ | |
| FT-16c | Cloth Resonance | Runic Echo — The property runes on your Cloth (not just fundamental) also apply to one Technique of your choice | effect:weapon-runes | Nothing | ☐ | |
| FT-16d | Cloth Resonance | Self-Mending — When your Cloth would crack (you drop to 0 HP), it does not; instead you gain temporary Hit Points equal to your level. This can occur once per encounter. | when:damage-taken · effect:temp-hp | Nothing | ☐ | |
| FT-16e | Cloth Resonance | Cosmo Conduit — Once per day, when you Refocus, you regain 2 Focus Points instead of 1 | economy:charges | Nothing | ☐ | |
| FT-16f | Cloth Resonance | Special On any day your Cloth's constellation is ascendant, you gain the benefit of all four options for that day. | economy:requires | Nothing | ☐ | |

## 14th level

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| FT-17a | Rising Cosmo | You gain a rising bonus that starts at 0 and increases by 1 each time you are critically hit, reduced to half your Hit Points or lower for the first time, or reduced to 0 Hit Points (to a maximum bonus of \+3). | when:damage-taken · economy:charges | `content/saint-feats/level-14/rising-cosmo.json` grants `Effect: Rising Cosmo`, a counter badge of 1–3 the player moves by hand; it starts at +1, and nothing counts the hits | ☐ | |
| FT-17b | Rising Cosmo | The rising bonus resets to 0 at the end of the encounter or after a 10-minute rest. | ending:duration | Nothing: the effect is unlimited | ☐ | |
| FT-17c | Rising Cosmo | While your rising bonus is at least \+1, you gain that value as a status bonus to your unarmed Strike damage and to the DCs of your Techniques. | effect:bonus · effect:strike-damage | `effect-rising-cosmo.json` `FlatModifier` `@item.badge.value` on `unarmed-damage`; **no rule raises the Technique DCs** | ☐ | |
| FT-17d | Rising Cosmo | While it is at least \+2, you also gain a \+1 status bonus to attack rolls and saving throws. | effect:bonus | `effect-rising-cosmo.json` `FlatModifier` +1 status predicated on the badge ≥ 2 | ☐ | |
| FT-17e | Rising Cosmo | While it is at \+3, once per round you may Step or Stride 5 feet as a free action when you take damage | when:damage-taken · economy:granted-action · economy:once-per-round | Nothing | ☐ | |
| FT-17f | Rising Cosmo | Special On any day your Cloth's constellation is ascendant (or Exalted), your rising bonus starts each encounter at \+1 rather than 0 | economy:charges | Nothing — and the badge starts at +1 every day | ☐ | |
| FT-18a | Speed of Light | Frequency once per day Effect You are quickened 1 for 1 minute. | effect:condition · ending:duration · economy:charges | `content/saint-feats/level-14/speed-of-light.json`, frequency 1/day; `Effect: Speed of Light` is linked from the card and **has no rules**, so it grants no quickened | ☐ | |
| FT-18b | Speed of Light | You can use the extra action each round only to Strike, Stride, or Step. | economy:granted-action | A note on the card | ☐ | |
| FT-18c | Speed of Light | While quickened this way, you also don't trigger reactions that are based on your movement | reach:self | Nothing | ☐ | |

## 16th level

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| FT-19a | Zenith Reach | You may use Seventh Sense's Burn Your Cosmo action twice per day instead of once. | economy:charges | Nothing: `content/saint-feats/level-16/zenith-reach.json` has no rules, and *Burn Your Cosmo*'s frequency stays 1/day | ☐ | |
| FT-19b | Zenith Reach | Additionally, when you use it, its duration increases from 1 minute to 1 minute per Focus Point you currently have (so up to 3 minutes). | ending:duration | Nothing | ☐ | |
| FT-20a | Atomic Dissolution | Your unarmed Strikes ignore an object's Hardness entirely | effect:strike-damage · reach:object | `content/saint-feats/level-16/atomic-dissolution.json` `bypass` `hardness: ignore` — with no predicate, so on every damage the Saint deals, not only unarmed | ☐ | |
| FT-20b | Atomic Dissolution | you can damage and destroy objects and structures of any material with your bare hands, including those normally immune to nonmagical damage. | effect:destroy · reach:object | Nothing beyond the Hardness bypass | ☐ | |
| FT-20c | Atomic Dissolution | Your unarmed Strikes and Techniques treat any creature's resistance to your damage as 5 lower | effect:damage | The same `bypass`, `resistance: { max: 5 }` — the library lowers each resistance by 5 for the one application (`bedd1c1`) | ☐ | |
| FT-20d | Atomic Dissolution | You can attempt to affect a creature or object that is incorporeal, gaseous, liquid, or otherwise diffuse | effect:trait-gained | Nothing | ☐ | |
| FT-20e | Atomic Dissolution | and such creatures do not gain their usual resistance to physical attacks against you. | effect:damage | Nothing | ☐ | |
| FT-20f | Atomic Dissolution | Dissolve ✦✦ (two actions, concentrate) — Frequency once per 10 minutes Touch one object of up to 10 Bulk that is not attended by a creature, or a 10-foot cube of a structure. It is destroyed | reach:object · effect:destroy · economy:charges | `atomic-dissolution.json` grants `content/saint-class-features/actions/dissolve.json`: 2 actions, frequency 1 per 10 minutes, a card. Nothing is destroyed | ☐ | |
| FT-20g | Atomic Dissolution | against a creature's attended object the creature may attempt a Reflex save against your Cosmo DC to pull it clear. | check:save · reach:object | Nothing | ☐ | |
| FT-20h | Atomic Dissolution | Special On any day your Cloth's constellation is ascendant (or Exalted), Dissolve has no frequency limit, and its size limit increases to 40 Bulk or a 20-foot cube. | economy:charges | Nothing: the frequency is fixed | ☐ | |

## 18th level

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| FT-21a | Entrust Your Cosmo | Entrust Your Cosmo ✦✦ (two actions) Frequency once per hour Target one willing ally you can touch, or within 30 feet if your Cloth's constellation is ascendant | reach:single · reach:allies · economy:charges | `content/saint-feats/level-18/entrust-your-cosmo.json`, a 2-action card with frequency 1/hour. Nothing measures the range | ☐ | |
| FT-21b | Entrust Your Cosmo | Spend any number of Focus Points; the target gains the following benefits for 1 minute, scaling with the number spent | economy:charges · ending:duration | Nothing spends a point; the three `Effect: Entrust Your Cosmo (1/2/3 Focus)` items (1 minute) are referenced by nothing | ☐ | |
| FT-21c | Entrust Your Cosmo | A \+1 status bonus to attack rolls, saving throws, and skill checks, and temporary Hit Points equal to your level. | effect:bonus · effect:temp-hp | `effect-entrust-your-cosmo-1-focus.json` `FlatModifier` +1 status; **no temporary Hit Points** | ☐ | |
| FT-21d | Entrust Your Cosmo | As above, and their Strikes count as magical and deal \+1d6 damage of your Cloth's element. | effect:strike-damage · effect:trait-gained | `effect-entrust-your-cosmo-2-focus.json` adds `DamageDice` on Strikes; nothing makes them magical | ☐ | |
| FT-21e | Entrust Your Cosmo | As above, and they become quickened 1 (Strike, Stride, or Step only), and they can see and act normally through any darkness, invisibility, or concealment for the duration. | effect:condition · effect:sense | `effect-entrust-your-cosmo-3-focus.json` has the bonus and the dice only: no quickened, no sense | ☐ | |
| FT-21f | Entrust Your Cosmo | While the duration lasts you are enfeebled 1 and cannot Refocus | effect:condition · reach:self | Nothing | ☐ | |
| FT-21g | Entrust Your Cosmo | If you use Entrust Your Cosmo while you are dying, or as a free action triggered by being reduced to 0 Hit Points, you may spend all remaining Focus Points at once and treat the result as though you had spent 3, regardless of how many you actually had. | when:damage-taken · economy:charges | Nothing | ☐ | |
| FT-21h | Entrust Your Cosmo | The duration becomes 10 minutes, and the target also gains a \+2 status bonus to all damage rolls. | effect:bonus · ending:duration | Nothing | ☐ | |
| FT-21i | Entrust Your Cosmo | You immediately become dying 3 | effect:condition · effect:backlash | Nothing | ☐ | |
| FT-21j | Entrust Your Cosmo | Special A creature can benefit from Entrust Your Cosmo only once per hour, no matter how many Saints offer it. | economy:once-per-target | Nothing | ☐ | |
| FT-22a | Not by the same Attack | The first time each day a given creature deals damage to you with a specific attack, spell, or effect, note it. | when:damage-taken · effect:info | Nothing records an adaptation | ☐ | |
| FT-22b | Not by the same Attack | Every subsequent time that same effect from any source targets you, you gain a \+2 circumstance bonus to your AC and saving throw against it | effect:bonus · economy:requires | `content/saint-feats/level-18/not-by-the-same-attack.json` an `adapted` toggle and a `FlatModifier` +2 circumstance on AC and saves predicated on it, set by hand | ☐ | |
| FT-22c | Not by the same Attack | and you gain resistance equal to your level to its damage. | effect:resistance | Nothing | ☐ | |
| FT-22d | Not by the same Attack | You track adaptations for up to five distinct effects at once; if a sixth would be added, the oldest is forgotten. | economy:charges · ending:replaces-previous | Nothing | ☐ | |
| FT-22e | Not by the same Attack | Once per round, when you would be damaged by an effect you have already adapted to, you may use a reaction to heighten your adaptation | economy:reaction · economy:once-per-round · when:damage-taken | `content/saint-class-features/actions/adapt.json`, a reaction card **with no frequency field** — its text says once per round | ☐ | |
| FT-22f | Not by the same Attack | until the start of your next turn, your resistance to that effect increases to twice your level, and if the effect required a save, you improve your degree of success by one step. | effect:resistance · check:degree-shift · ending:next-turn | Nothing | ☐ | |
| FT-22g | Not by the same Attack | Special On any day your Cloth's constellation is ascendant (or Exalted), your cosmo reads faster than experience: you adapt to an effect the first time it damages you | economy:requires | Nothing | ☐ | |
| FT-22h | Not by the same Attack | The GM adjudicates what counts as "the same" attack; reskinned or fundamentally altered versions do not. | | Nothing | — | The feat hands this judgement to the GM in its own words |

## 20th level

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| FT-23a | Athena Exclamation | Requirements You are within 30 feet of at least two other creatures who have this feat | economy:requires | Nothing: `content/saint-feats/level-20/athena-exclamation.json` is a 3-action card | ☐ | |
| FT-23b | Athena Exclamation | Choose a point within 100 feet. Every creature in a 60-foot burst around that point takes 30d6 force damage (basic Reflex save against the highest Cosmo DC among the three casters). | reach:area/burst · check:basic-save · effect:damage | Nothing: no area and no damage | ☐ | |
| FT-23c | Athena Exclamation | Creatures that critically fail are also knocked prone and deafened for 1 minute. | effect:condition · ending:duration | Nothing | ☐ | |
| FT-23d | Athena Exclamation | The terrain in the area is permanently obliterated | | Nothing | — | The map is the GM's |
| FT-23e | Athena Exclamation | Each participant is drained 2 afterward, recoverable only by a full day's rest under an open sky. | effect:condition · effect:backlash | Nothing | ☐ | |
| FT-24a | Beyond the Eighth | Its duration increases from 1 minute to 10 minutes (or until the encounter ends). | ending:duration | Nothing: `content/saint-feats/level-20/beyond-the-eighth.json` has no rules | ☐ | |
| FT-24b | Beyond the Eighth | once per round you may Stride through any barrier as though it were not there (you briefly step into the space between life and death), provided you begin and end in an open space. | effect:speed · economy:once-per-round | Nothing | ☐ | |
| FT-24c | Beyond the Eighth | When Arayashiki ends and you would die, you may instead choose to return changed: you drop to dying 3 rather than dying, and your Cloth shatters, but you are not beyond restoration. | effect:stabilize | Nothing | ☐ | |
| FT-24d | Beyond the Eighth | You can benefit from this reprieve only once | economy:charges | Nothing | ☐ | |
| FT-25a | Constellation of One | Your Ascendant Boon becomes permanent. It is active every day, regardless of the sky. | ending:permanent | `content/saint-feats/level-20/constellation-of-one.json` emits `sky:ascendant` every day, which lights the Techniques' two steps and the boons that read the option — but the Cloth's `Sky: Ascendant` effect, which carries most boons, is not granted | ☐ | |
| FT-25b | Constellation of One | On days your constellation is genuinely ascendant you gain your Zenith Boon instead | ending:duration | Nothing: the tracker still gives the Ascendant effect on an ascendant day | ☐ | |
| FT-25c | Constellation of One | Any character who wears your Gold Cloth after you — an NPC successor, another player's character, a character in a future campaign at this table — gains the buff of your star. | | Nothing | — | A legacy across campaigns is the table's record, as the feat itself says |
| FT-25d | Constellation of One | Your name is legible in the sky to anyone with Astronomy Lore. | | Nothing | — | Fiction for the table |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 97 |
| ✅ | 0 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 11 |
| **Total** | **108** |

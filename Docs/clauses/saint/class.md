# Clauses — the Saint class

*Class tracker. Every independently-failable declaration the guide makes about what **every** Saint
has, whatever Cloth they wear. Source: `Docs/saint-gold-cloth-guide-v4.md` §1 (design foundations, where
they make a rule), §3 (advancement) and §4 (core features), and §7 where a GM note is a rule.*

**Tier:** class · **Tracker issue:** #143

## How a row is marked

| Mark | Meaning |
| :-- | :-- |
| ☐ | Not yet driven |
| ✅ | Driven live; the clause happened by itself |
| ⚠️ | Driven live; partially happens — the gap is named in **Evidence** |
| ❌ | Driven live; does not happen |
| 🔧 | Was ❌ or ⚠️, a fix has landed, awaiting re-drive |
| — | Nothing to automate (pure roleplaying / GM ruling) |

**Clause** is a verbatim fragment of the guide (`Docs/saint-gold-cloth-guide-v4.md`). `build/check-clauses.mjs`
asserts it still is one, so a paraphrase here or an edit to the guide fails the build. The guide escapes its
plus and equals signs (`\+`, `\=`), and the clauses keep the backslash because the check compares raw text.
**Static check** names the content and code that implement the clause — or says nothing does — and
**Evidence** names what proved it happened at the table.

*How a clause is driven — the rig, the traps it sets and what a ✅ owes — is
`Docs/tools/live-verification.md`. It is the one copy; this file records results, not method.*

*The Saint was automated before it had a tracker.* Everything here was built from the guide and the
Interactive Checklist (`Docs/Saint_Class_Interactive_Checklist (1).html`), which keeps its marks in a
browser's local storage and so records no result. So nearly every row starts ☐ whatever its JSON says. The
few that are not were driven live for other reasons and recorded elsewhere: the Sky as terrain (#30,
`08917aa`; the Stargazer's `Docs/clauses/stargazer/sky.md`), Arayashiki's refusal of death (#32, `9d0703a`),
a scheduled Zenith (#31, `74b5b8c`), and the riders on `damage-applied` (#71, `5a06920`).

*The class tier's own shape.* Two halves. **Numbers that must move at the right level** — a Cosmo DC
that steps at 9th and 17th, a focus pool that reaches 3 at 13th — fail silently, and two of them read
wrong in the JSON today (`SC-15`, `SC-19`). And **the Sky's hand on the Saint**: an Ascendant or Zenith day
puts a boon effect on the sheet and heightens every Technique by two or four steps, which is the class's
whole curve.

**IDs are `SC-<nn><letter>`**, one number per feature in the guide's order, a letter per clause. The
Cloths' passives and boons are `cloths.md` (`CL-`), the forty-eight Techniques `techniques.md` (`TQ-`),
Libra's arsenal `libra.md` (`LB-`) and the feats `feats.md` (`FT-`). Design commentary — the point ledger
of §2, the benchmarks of §1.3, §1.4's argument against slots — makes no rule and has no row.

---

## Profile and Techniques (guide §1)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SC-01 | §1.3 | Spines: single-target spell attack \+2d6 per step; area basic save \+1d8 per step. | scaling:dice-per-rank · effect:damage | Each Technique's `system.heightening` (interval 1): `+2d6` on Golden Arrow, `+1d8` on Diamond Dust, Great Horn and the other area Techniques | ☐ | |
| SC-02 | §1.3 | Spell attacks get no potency runes — a Technique's attack bonus is 2 lower than your Strike. | check:attack | `scripts/cosmo.mjs` files every Technique in a Cosmo entry whose `proficiency.slug` is `saint`, so its attack is the Cosmo statistic with no item bonus | ☐ | |
| SC-03 | §1.5 | Martial. 10 HP, full attack investment, Class DC (Cosmo DC), no spell slots. | effect:class-profile | `content/saint-class/saint.json` (`hp: 10`, `spellcasting: 0`) | ☐ | |
| SC-04 | §1.5 | Key ability Strength or Dexterity. | effect:class-profile | `content/saint-class/saint.json` `keyAbility: [str, dex]`; the Cosmo entry follows the choice (`Cosmo.attributeFor`) | ☐ | |
| SC-05 | §1.5 | Unarmed-only (Libra excepted). | effect:class-profile | `content/saint-class/saint.json` trains `unarmed` and no weapon category; Libra's `MartialProficiency` (`libra.md` `LB-01`) | ☐ | |

## Advancement and proficiencies (guide §3)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SC-06a | §3 | Perception Trained | effect:class-profile | `content/saint-class/saint.json` `perception: 1` | ☐ | |
| SC-06b | §3 | Fort & Reflex Expert, Will Trained | effect:class-profile | `content/saint-class/saint.json` `savingThrows` 2 / 2 / 1 | ☐ | |
| SC-06c | §3 | Athletics \+ 3 others Trained | effect:class-profile | `content/saint-class/saint.json` `trainedSkills`: athletics, 3 additional | ☐ | |
| SC-06d | §3 | Unarmed Trained (no weapons) | effect:class-profile | `content/saint-class/saint.json` `attacks.unarmed: 1`, simple and martial 0 | ☐ | |
| SC-06e | §3 | Unarmored/Light/Medium armor Trained | effect:class-profile | `content/saint-class/saint.json` `defenses` unarmored, light, medium 1; heavy 0 | ☐ | |
| SC-06f | §3 | Cosmo DC Trained. | effect:class-profile · check:class-dc | pf2e's class DC for the `saint` class trait | ☐ | |
| SC-07 | §3 | HP: 10 \+ Con per level. | effect:class-profile · scaling:from-level | `content/saint-class/saint.json` `hp: 10` | ☐ | |
| SC-08 | §3 | Fist: 1d6 brawling, agile finesse | effect:strikes-granted | `content/saint-class-features/core/cosmo-strike.json` `Strike` rule | ☐ | |
| SC-09 | §3 | Saint feat, skill feat | effect:class-profile | `content/saint-class/saint.json` `classFeatLevels` 1, 2, 4 … 20 | ☐ | |
| SC-10 | §3 | Iron Will (Will Expert) | effect:class-profile · scaling:from-level | pf2e's *Iron Will*, granted at 3rd by `content/saint-class/saint.json` | ☐ | |
| SC-11 | §3 | second granted skill | reach:self · check:caster-choice · effect:class-profile | `content/saint-class-features/core/sky-reading.json` at 5th: a `ChoiceSet` and the rank | ☐ | |
| SC-12a | §3 | 2nd Technique, Saint feat, skill feat | effect:class-profile · scaling:from-level · effect:feature-granted | Every Cloth's `GrantItem` of its second Technique, predicated `self:level ≥ 6`; `second-technique.json` is a marker with no rules | ☐ | |
| SC-12b | §3 | 3rd Technique (Cloth Ability) | scaling:from-level · effect:feature-granted | Every Cloth's `GrantItem` predicated `self:level ≥ 11` | ☐ | |
| SC-12c | §3 | 4th Technique | scaling:from-level · effect:feature-granted | Every Cloth's `GrantItem` predicated `self:level ≥ 16` | ☐ | |
| SC-13 | §3 | Alertness (Perception Expert) | effect:class-profile · scaling:from-level | pf2e's *Alertness*, granted at 7th | ☐ | |
| SC-14 | §3 | Weapon Specialization | effect:class-profile | pf2e's *Weapon Specialization*, granted at 7th | ☐ | |
| SC-15 | §3 | Cosmo Expertise (Cosmo DC Expert) | effect:class-profile · scaling:from-level | `content/saint-class-features/core/cosmo-expertise.json` `subfeatures.proficiencies.saint.rank` is **3** — master, not expert. **As authored this fails** | ☐ | |
| SC-16 | §3 | Juggernaut (Fortitude Master) | effect:class-profile · scaling:from-level | pf2e's *Juggernaut*, granted at 9th | ☐ | |
| SC-17a | §3 | Cloth Mastery (Unarmed Master) | effect:class-profile · scaling:from-level | `content/saint-class-features/core/cloth-mastery.json` `subfeatures.proficiencies.unarmed.rank: 3` | ☐ | |
| SC-17b | §3 | Armor Expertise (Cloth Expert) | effect:class-profile · scaling:from-level | `content/saint-class-features/core/armor-expertise.json` rank 2 for unarmored, light and medium | ☐ | |
| SC-18a | §3 | Greater Weapon Specialization | effect:class-profile · scaling:from-level | pf2e's *Greater Weapon Specialization*, granted at 15th | ☐ | |
| SC-18b | §3 | Evasion (Reflex Master) | effect:class-profile · scaling:from-level | pf2e's *Evasion*, granted at 15th | ☐ | |
| SC-19 | §3 | Cosmo Mastery (Cosmo DC Master) | effect:class-profile · scaling:from-level | `content/saint-class-features/core/cosmo-mastery.json` `subfeatures.proficiencies.saint.rank` is **4** — legendary, not master. **As authored this fails** | ☐ | |

## The Cloth (guide §4)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SC-20a | §4 The Cloth | Medium armor (+4 AC, Dex cap \+1, check −2, Str 16) | effect:item-granted | `content/saint-class/gold-cloth.json`: medium, `acBonus 4`, `dexCap 1`, `checkPenalty −2`, `strength 3` | ☐ | |
| SC-20b | §4 The Cloth | summon or dismiss as one Interact action | economy:granted-action | `content/saint-class-features/actions/summon-or-dismiss-cloth.json`, a 1-action card. Nothing equips or stows the armor | ☐ | |
| SC-20c | §4 The Cloth | cannot be removed without being destroyed | | Nothing in pf2e takes armor off a creature | — | Nothing to enforce: no effect at the table removes armor, so the clause is the table's |
| SC-20d | §4 The Cloth | takes armor runes | effect:item-granted | pf2e's own rune slots on `gold-cloth.json` | ☐ | |
| SC-20e | §4 The Cloth | free at 1st level | effect:item-granted | `content/saint-class-features/core/the-cloth.json` `GrantItem` of the Gold Cloth; no price | ☐ | |
| SC-20f | §4 The Cloth | Cracks if you reach 0 HP (self-repairs in 24 hours, or instantly via an Aries Saint). | | Nothing | — | Deliberately left manual (`9c7bbcc`, backlog group 6: the Cloth cracking), and the guide gives a cracked Cloth no mechanical effect to apply |
| SC-20g | §4 The Cloth | Determines your four Techniques, Cloth Passive, boons, and the one sign you can feel. | check:caster-choice · effect:feature-granted | `the-cloth.json` `ChoiceSet` grants the Cloth feature, which grants its Techniques by level; `scripts/sky/tracker.mjs` `clothOf` reads the `cloth-<sign>` tag for the boons | ☐ | |

## Cosmo and Cosmo Strike (guide §4)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SC-21a | §4 Cosmo | Focus pool of 1 (2 at 7th, 3 at 13th). | economy:charges · scaling:from-level | `cosmo.json`, `second-cosmo.json`, `third-cosmo.json` each an `ActiveEffectLike` +1 on `system.resources.focus.max`. **Risk:** pf2e 8 derives the max from focus spells known (`Docs/tools/foundry-traps.md`) — which would give 2 at 6th and 3 at 11th, when the Techniques arrive. Unverified | ☐ | |
| SC-21b | §4 Cosmo | Techniques are focus spells with the cosmo trait, using your Cosmo DC and key ability. | check:save · check:attack · check:class-dc | `scripts/cosmo.mjs` creates the Cosmo entry (`proficiency.slug: saint`) and files every `cosmo` spell into it | ☐ | |
| SC-21c | §4 Cosmo | They have no rank; they heighten every 2 levels. | scaling:from-level | Each Technique is a focus spell of base rank 1, 3, 6 or 8 with interval heightening; pf2e auto-heightens focus spells to half the level rounded up | ☐ | |
| SC-21d | §4 Cosmo | Refocus by burning Cosmo for 10 minutes. | effect:resource-regained | pf2e's own Refocus | ☐ | |
| SC-22a | §4 Cosmo Strike | Unarmed Strikes are magical | effect:trait-gained | `content/saint-class-features/core/cosmo-strike.json` `ItemAlteration` adds `magical` to unarmed | ☐ | |
| SC-22b | §4 Cosmo Strike | gain \+1 damage per weapon damage die | effect:strike-damage | `cosmo-strike.json` `FlatModifier` on `unarmed-damage`, circumstance, `@weapon.system.damage.dice` | ☐ | |
| SC-22c | §4 Cosmo Strike | At 5th you gain unarmed Expert and brawling critical specialization. | effect:class-profile · scaling:from-level | `expert-cosmo-strike.json` (unarmed rank 2) at 5th; `cosmo-strike.json` `CriticalSpecialization` predicated `self:level ≥ 5` | ☐ | |

## The sky (guide §4)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SC-23a | §4 Ascendant Constellation | You always know when your own sign is ascendant and its aspect; nothing of the other twelve. | effect:info · effect:calendar | `scripts/sky/tracker.mjs` puts `Sky: Ascendant (<Sign>)` or `Sky: Zenith (<Sign>)` on the Saint whose Cloth matches the day; nothing tells a Saint of another day | ☐ | |
| SC-23b | §4 Ascendant Constellation | Ascendant (any aspect): your Ascendant Boon all day | ending:duration | `tracker.mjs` `wantedFor`: the Cloth's `Sky: Ascendant` effect from `content/saint-effects/sky-ascendant/`, 1 day | ☐ | |
| SC-23c | §4 Ascendant Constellation | Techniques heighten as though you were 4 levels higher | scaling:dice-per-rank · scaling:area-per-rank · scaling:counts-higher | A `DamageDice` rule of two steps on every damaging Technique, predicated `sky:ascendant`; `scripts/sky/steps.mjs` registers the same two steps for areas, ranges and riders | ☐ | |
| SC-23d | §4 Ascendant Constellation | Exalted: your Zenith Boon instead | ending:duration | `tracker.mjs` `wantedFor` picks `Sky: Zenith` when the aspect is `exalted` | ☐ | |
| SC-23e | §4 Ascendant Constellation | Techniques heighten as though 8 levels higher. | scaling:dice-per-rank · scaling:area-per-rank · scaling:counts-higher | The four-step `DamageDice` rule predicated `sky:zenith`; `scripts/sky/steps.mjs` tests the Zenith first | ☐ | |
| SC-24 | §4 Ascendant Constellation | Odds: Ascendant 1/13 (7.69%); Zenith 1/130 (0.77%). | reach:self · effect:calendar | `scripts/sky/signs.mjs` — thirteen equal signs and an Exalted weight of 10 in 100 | ✅ | Live, recorded as the Stargazer's `SK-03` and `SK-04`: 26,000 `rollSign` calls put every sign between 7.3% and 8.0%; 20,000 `rollAspect` calls put Exalted at 10.0% — 1 in 13 × 1 in 10 is the 1 in 130 |
| SC-25 | §4 Ascendant Constellation | The GM can still schedule a Zenith | effect:gm-note · effect:calendar | `tracker.mjs` `scheduleZenith` / `scheduleAspect`, and the tracker window's **Schedule Day** | ✅ | Live (#31, `74b5b8c`): a pinned day kept the queue's other axis; `scheduleZenith` produced an Exalted day and refused Starless — the control. Again as the Stargazer's `SK-08`: `scheduleZenith("leo", 3)` pinned Leo, Exalted, three days out |
| SC-26a | §4 Unfailing Cosmo | You never suffer the sky's Retrograde or Malefic aspects | effect:resistance | `unfailing-cosmo.json` emits `saint:unfailing-cosmo`; `tracker.mjs` `aspectFor` returns `none` for it | ✅ | Live, the Stargazer's `SK-32a`: the Saint *Aquarius* wore no terrain on Malefic and Retrograde days, and the unsheltered fixtures beside them wore Malefic the same day — the control. First seen in #30 (`08917aa`): a Malefic Scorpio day took a Soulbound's Stealth to −2 while the Saint beside them took nothing |
| SC-26b | §4 Unfailing Cosmo | or riders. Ever. | | Nothing | — | The sky's riders were cut in the Stargazer guide v3 §8 (*"v1's riders are cut"*); they are GM colour now, so there is nothing to be spared |
| SC-27a | §4 Shelter of the Cloth | Allies within 30 ft treat the day's aspect as one step milder. | reach:allies · area:aura/pf2e · effect:severity-step | `shelter-of-the-cloth.json` carries an `Aura`; `tracker.mjs` `isSheltered` measures 30 feet and `aspectFor` steps Malefic → Retrograde → none. Only the negative half is softened | ✅ | Live, by accident and then by control (`10155cf`, recorded in `Docs/tools/live-verification.md`): the Stargazer's unbriefed control fixture, standing beside a Saint, read one step milder exactly as the briefed creatures did; moved clear of any Saint's Shelter it read Malefic. #30 had already shown `isSheltered` false at range |
| SC-27b | §4 Shelter of the Cloth | Stacks with a Stargazer's Forewarned. | reach:allies · area:aura/pf2e · effect:severity-step | `tracker.mjs` `aspectFor` deliberately takes **the milder of the two**, never two steps (*"Softenings do not stack"*). **As built this fails**; whether the guide or the code should move is a decision | ☐ | |

## The senses (guide §4)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SC-28a | §4 Sixth Sense | Imprecise sense, 60 ft, detects everything with a Cosmo. | effect:sense | `sixth-sense.json` `Sense` lifesense, imprecise, 60 feet (and the subfeature). Lifesense is pf2e's nearest sense; it misses constructs, which a Cosmo may not | ☐ | |
| SC-28b | §4 Sixth Sense | Never off-guard to undetected or hidden creatures | effect:resistance | A `Note` only: pf2e applies that off-guard from the attacker's side and no rule element refuses it | ☐ | |
| SC-28c | §4 Sixth Sense | can't be flanked by anything you sense. | effect:resistance | `sixth-sense.json` `ActiveEffectLike` `system.attributes.flanking.flankable: false` — by anything, sensed or not | ☐ | |
| SC-29a | §4 Seventh Sense | Burn Your Cosmo ✦ (free, 1/day, requires your sign ascendant) | economy:granted-action · economy:requires | `seventh-sense.json` grants `burn-your-cosmo.json`, a free action, frequency 1/day. The requirement is prose: nothing checks the sky | ☐ | |
| SC-29b | §4 Seventh Sense | treat today as Exalted — Zenith Boon for 1 minute | ending:duration · reach:self | `effect-burn-your-cosmo.json` emits `sky:zenith` for 1 minute, linked from the card and not applied by it; the Zenith boon's own items (`Sky: Zenith (<Sign>)`) are not granted — the card says to apply them by hand | ☐ | |
| SC-29c | §4 Seventh Sense | (or, if already Exalted, extend it to allies within 30 ft). | reach:allies · reach:area/emanation | Nothing | ☐ | |
| SC-29d | §4 Seventh Sense | Passive: Strikes ignore resistances and bypass all material weaknesses and immunities | effect:ignore-resistance | `seventh-sense.json`: `AdjustStrike` for every precious material, and a `bypass` flag (resistance all, immunity all) predicated on unarmed Strikes — so a Libra weapon's Strike does not get it | ☐ | |
| SC-29e | §4 Seventh Sense | strike incorporeal creatures normally | effect:trait-gained | `seventh-sense.json` `AdjustStrike` ghost touch | ☐ | |
| SC-29f | §4 Seventh Sense | auto-know the location of anything that damaged you in the last minute. | effect:info · when:damage-taken | Nothing | ☐ | |

## Cloth Attunement and the Eighth Sense (guide §4)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SC-30a | §4 Cloth Attunement | All your Techniques gain one additional heightening step (as though you were 2 levels higher) | scaling:dice-per-rank · scaling:counts-higher | `cloth-attunement.json` emits `saint:cloth-attunement`, and **nothing reads it**: no Technique carries a rule on it and `scripts/sky/steps.mjs` counts only the sky. The item's own text says the step is automated as bonus dice; it is not | ☐ | |
| SC-30b | §4 Cloth Attunement | once per day you may cast a Technique of 2 actions or fewer without spending a Focus Point. | economy:frequency · economy:cost-waived | `attuned-casting.json` (`freeCast`, predicated 1 or 2 actions, frequency 1/day) and `scripts/economy/free-cast.mjs`, which casts with `consume: false` | ☐ | |
| SC-31a | §4 Eighth Sense | ✦ (free, 1/day). Trigger Reduced to 0 HP or killed. | when:damage-taken · effect:stabilize · economy:charges | `arayashiki.json` declares `refuseDeath` (cost 0, the item's own frequency); `scripts/refuse-death.mjs` rewrites the incoming hit points in `preUpdateActor` | ✅ | Live (#32, `9d0703a`): ZZ Taurus Knight taken from 200 HP to 0 stood at 1, spent the day's use, and kept every Focus Point. The control: a second blow the same day was not caught |
| SC-31b | §4 Eighth Sense | You keep acting for 1 minute or until the encounter ends | ending:duration · ending:encounter | `effect-arayashiki.json` lasts 1 minute but is only linked from the card; the declaration names no effect, so nothing applies it | ☐ | |
| SC-31c | §4 Eighth Sense | can't drop below 1 HP | effect:stabilize | `scripts/refuse-death.mjs` keeps the hit points at 1 on the triggering blow; nothing holds them there for the minute | ✅ | Live (#32, `9d0703a`): the Knight stood at **1** after a 200-point blow. Only the triggering blow was measured |
| SC-31d | §4 Eighth Sense | immune to death, dying, unconscious, and paralyzed | effect:resistance | `effect-arayashiki.json` `Immunity` to death effects, unconscious and paralyzed — dying is missing — and only once the effect is applied by hand | ☐ | |
| SC-31e | §4 Eighth Sense | ignore wounded and drained. | effect:resistance | Nothing | ☐ | |
| SC-31f | §4 Eighth Sense | When it ends you're dying 3 and the Cloth shatters. | effect:condition · effect:backlash | Nothing | ☐ | |
| SC-31g | §4 Eighth Sense | If the trigger killed you, you die when the minute ends | effect:death | Nothing | ☐ | |
| SC-31h | §4 Eighth Sense | You may end it early to be dying 1 with an intact Cloth. | ending:dismiss · effect:condition | Nothing | ☐ | |

## GM notes that are rules (guide §7 and the appendix)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| SC-32 | Appendix | Removal/death effects carry INCAPACITATION. | effect:death · check:degree-shift | The `incapacitation` trait on Another Dimension, Rikudō Rinne, Sekishiki Tenryū Ha, Antares, Freezing Coffin, Royal Funeral, The Yellow Spring Is Here, Aurora Execution, Bloody Rose, Star Guard: Exile and Six Realms Unmade. Scorpio's 8-needle death save is a rider on an effect, which cannot carry a trait | ☐ | |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 64 |
| ✅ | 6 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 3 |
| **Total** | **73** |

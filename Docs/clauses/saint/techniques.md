# Clauses — the Saint's Techniques

*Technique tracker. All forty-eight Techniques, four per Cloth, one independently-failable sentence a row.
Source: `Docs/saint-gold-cloth-guide-v4.md` §5, each Cloth's *Techniques*; §6 is their index.*

**Tier:** Techniques · **Tracker issue:** #143

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

*What every Technique shares* is in `class.md`: it is a focus spell in the Cosmo entry (`SC-21b`), it
heightens on pf2e's own schedule (`SC-21c`), and a lit sky adds two or four steps of dice through a
`DamageDice` rule on the Technique itself (`SC-23c`, `SC-23e`). Each Technique lives in
`content/saint-techniques/<slot>/<slug>.json`; its area, its riders and its heightening beyond damage are
module flags read by the automation library. Its Cloth grants it at 1st, 6th, 11th or 16th level.

*Two things recur and are worth knowing before reading a row.* A **non-basic save** puts the Technique's
damage on its card, applied by hand at every degree; where the guide gives damage to one degree only, that
is the table's to apply, and the row says so. And **a Strike a Technique makes** is the automation's
`strikes` rider: it rolls the Saint's real Strike at a chosen penalty, and nothing writes *"counts as three
attacks for your MAP afterward"* back.

*One Technique was driven live*: *Sekishiki Kisōen*'s soul consumed (#71, `5a06920`). Everything else is ☐.

**IDs are `TQ-<nn><letter>`**, one number per Technique in §6's order — Aries `TQ-01`–`04`, Taurus `05`–`08`,
Gemini `09`–`12`, Cancer `13`–`16`, Leo `17`–`20`, Virgo `21`–`24`, Libra `25`–`28`, Scorpio `29`–`32`,
Sagittarius `33`–`36`, Capricorn `37`–`40`, Aquarius `41`–`44`, Pisces `45`–`48` — and a letter per clause.
The italic line of fiction under a Technique's name is not a clause.

---

## ♈ Aries (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| TQ-01a | Crystal Wall | Create a 15-ft-long, 10-ft-high barrier of solidified cosmo | when:cast · area:wall · effect:barrier | `slot-1-signature/crystal-wall.json` aims a 15-foot line within 30 feet; `scripts/targeting/wall.mjs` builds a `Wall` document along it and a hazard actor for its hit points | ☐ | |
| TQ-01b | Crystal Wall | AC 10, Hardness \= your level, HP \= 4 × your level. | effect:barrier | `crystal-wall.json` `wall`: `ac: 10`, `hardnessPerLevel: 1`, `hpPerLevel: 4` | ☐ | |
| TQ-01c | Crystal Wall | It blocks line of effect. | effect:cover | The `Wall` document; torn down with the hazard when it is destroyed | ☐ | |
| TQ-01d | Crystal Wall | Heightening (+2) Length \+5 feet; Hardness and HP scale with level automatically. | scaling:area-per-rank | `crystal-wall.json` `areaTargeting.heightening.length: 5` | ☐ | |
| TQ-02a | Starlight Extinction | 30 ft, one creature or unattended object of up to 20 Bulk. Will save. | when:cast · reach:single · reach:object · check:save | `slot-2/starlight-extinction.json`: range 30 feet, pf2e's own target, a Will save | ☐ | |
| TQ-02b | Starlight Extinction | Failure Teleported 60 feet in a direction you choose, arriving in the nearest open space. | check:save · effect:teleport | `starlight-extinction.json` `teleport` 60 on a failure | ☐ | |
| TQ-02c | Starlight Extinction | Critical Failure Teleported 250 feet, lands prone, takes 3d6 force. | check:save · effect:teleport · effect:condition · effect:damage | `teleport` 250 and prone on a critical failure; the 3d6 force is the card's damage, applied by hand at any degree | ☐ | |
| TQ-02d | Starlight Extinction | Heightening (+2) \+1d6, and failure distance \+30 feet. | scaling:dice-per-rank · effect:teleport | The damage heightens 1d6 a step; **the 60-foot distance does not grow** | ☐ | |
| TQ-03a | Crystal Net | 20-ft burst within 60 ft, Reflex save. | when:cast · reach:area/burst · check:save | `slot-3-cloth-ability/crystal-net.json`: a 20-foot burst, range 60 | ☐ | |
| TQ-03b | Crystal Net | Failure Immobilized 1 minute (Escape DC \= your Cosmo DC). | check:save · effect:hold/condition · ending:duration | Immobilized for 1 minute on a failure. The rider carries no `escapeDc`, so **no Escape action is granted** — the Escape DC is a note | ☐ | |
| TQ-03c | Crystal Net | Critical Failure As failure, plus 6d8 force. | check:save · effect:damage | Immobilized on a critical failure too; the 6d8 is the card's damage, applied by hand | ☐ | |
| TQ-03d | Crystal Net | Success Restrained until the end of its next turn. | check:save · effect:condition · ending:next-turn | Restrained for 1 round, expiring at a turn's end | ☐ | |
| TQ-03e | Crystal Net | A creature that Escapes shatters its portion of the net. | | Nothing | — | The net has no board presence beyond each creature's own hold, and escaping ends that hold |
| TQ-03f | Crystal Net | Heightening (+2) \+1d8, burst \+5 feet. | scaling:dice-per-rank · scaling:area-per-rank | `heightening`: damage 1d8, `area: 5` (pf2e's own interval area) | ☐ | |
| TQ-04a | Stardust Revolution | 30-ft burst within 120 ft, 8d8 force, basic Reflex | when:cast · reach:area/burst · check:basic-save · effect:damage | `slot-4-ultimate/stardust-revolution.json` | ☐ | |
| TQ-04b | Stardust Revolution | creatures that critically fail are stunned 1 and knocked prone. | check:basic-save · effect:condition | Stunned 1 and prone on a critical failure | ☐ | |
| TQ-04c | Stardust Revolution | Heightening (+2) \+1d8. | scaling:dice-per-rank · effect:damage | `heightening` 1d8 | ☐ | |

## ♉ Taurus (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| TQ-05a | Great Horn | 30-ft cone, 1d8 bludgeoning, basic Fortitude | when:cast · reach:area/cone · check:basic-save · effect:damage | `slot-1-signature/great-horn.json` | ☐ | |
| TQ-05b | Great Horn | on a failure the target is pushed 15 feet and knocked prone. | check:basic-save · effect:forced-move/push · effect:condition | Prone and a 15-foot `teleport` push on a failure or critical failure | ☐ | |
| TQ-05c | Great Horn | Heightening (+2) \+1d8. | scaling:dice-per-rank · effect:damage | `heightening` 1d8 | ☐ | |
| TQ-06a | Pleiades Nova | Make five ranged unarmed Strikes against any creatures within 60 feet | when:cast · reach:up-to-n · check:attack | `slot-2/pleiades-nova.json`: a 60-foot emanation of enemies, up to 5; a `strikes` rider, one unarmed Strike each | ☐ | |
| TQ-06b | Pleiades Nova | each dealing 1d6 force plus your key ability modifier. | effect:damage-type · effect:strike-damage | `Effect: Pleiades Nova` turns the fist's damage to force and adds its heightening dice | ☐ | |
| TQ-06c | Pleiades Nova | The multiple attack penalty doesn't increase during this activity | economy:attack-penalty | Every Strike rolls at no penalty | ☐ | |
| TQ-06d | Pleiades Nova | but each Strike after the first takes a cumulative −1 (the light scatters). | effect:penalty | `Effect: Pleiades Nova` `FlatModifier` −1 … −6 by the Strike's index | ☐ | |
| TQ-06e | Pleiades Nova | Counts as three attacks for your MAP afterward. | economy:attack-penalty | A note only | ☐ | |
| TQ-06f | Pleiades Nova | Heightening (+2) each Strike \+1d6 | scaling:dice-per-rank · effect:strike-damage | `Effect: Pleiades Nova` `DamageDice` count = the cast's steps | ☐ | |
| TQ-06g | Pleiades Nova | at 12th and 18th level, add one Strike (to seven). | scaling:targets-per-rank · scaling:from-rank | `areaTargeting.heightening.at` 12 and 18: `maxTargets` +1 | ☐ | |
| TQ-07a | Titan's Stance | ⤾ (reaction, cosmo) Trigger An ally within 15 feet would be hit by an attack or targeted by a damaging effect. | economy:reaction · when:strike-received | `slot-3-cloth-ability/titans-stance.json` is cast like any Technique; nothing detects the trigger | ☐ | |
| TQ-07b | Titan's Stance | Effect You interpose and become the target instead | effect:intercept | Nothing retargets an attack in motion | ☐ | |
| TQ-07c | Titan's Stance | you take the damage reduced by 10 \+ (2 × your level) | effect:resistance · reach:self | `Effect: Titan's Stance` on the Saint for 1 round: `Resistance` all-damage `10 + 2 × level` | ☐ | |
| TQ-07d | Titan's Stance | and cannot be moved from your square by that effect. | effect:resistance · reach:self | The same effect emits `saint:immovable`; `scripts/riders-extensions.mjs` refuses this module's forced moves | ☐ | |
| TQ-07e | Titan's Stance | at 15th and 19th level you may use this one additional time per round. | economy:reaction · scaling:from-rank | Nothing | ☐ | |
| TQ-08a | Titan's Break | 60-ft line. 8d8 bludgeoning, basic Fortitude. | when:cast · reach:area/line · check:basic-save · effect:damage | `slot-4-ultimate/titans-break-the-golden-horn.json` | ☐ | |
| TQ-08b | Titan's Break | Failure \= pushed to the end of the line and knocked prone. | check:basic-save · effect:forced-move/push · effect:condition | Prone and a `teleport` to 60 feet from the caster on a failure or critical failure | ☐ | |
| TQ-08c | Titan's Break | Critical failure \= an additional 4d8 and stunned 2 | check:basic-save · effect:damage · effect:condition | A 4d8 `damage` rider (1d8 a step) and stunned 2 on a critical failure | ☐ | |
| TQ-08d | Titan's Break | Any wall, door, or structure in the line with Hardness less than 20 is destroyed — the horn does not go around things. | effect:destroy · reach:object | Nothing | ☐ | |
| TQ-08e | Titan's Break | Heightening (+2) \+1d8, and the critical-failure bonus \+1d8. | scaling:dice-per-rank · effect:damage | `heightening` 1d8; the rider's `perStep` 1d8 | ☐ | |

## ♊ Gemini (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| TQ-09a | Another Dimension | (cosmo, incapacitation, teleportation) 60 ft, one creature, Will save. | when:cast · reach:single · check:save | `slot-1-signature/another-dimension.json`: one target within 60 feet, `incapacitation`, a Will save | ☐ | |
| TQ-09b | Another Dimension | Failure Banished into folded space for 1 minute, returning to the same square. | effect:banish · ending:duration | A `banish` rider for 1 minute on a failure (not in Shadow, `CL-07c`) | ☐ | |
| TQ-09c | Another Dimension | Critical Failure 10 minutes. | effect:banish · ending:duration | `banish` for 10 minutes on a critical failure | ☐ | |
| TQ-09d | Another Dimension | Heightening (+2) range \+10 feet; at 12th and 16th level, \+1 target. | scaling:targets-per-rank · scaling:from-rank | `areaTargeting.heightening`: range +10 a step, `maxTargets` +1 at 12th and 16th | ☐ | |
| TQ-10a | Astral Projection | Project your consciousness into an astral body anywhere within 200 feet that you can see or have visited. | when:cast · effect:summon | `slot-2/astral-projection.json` aims a point within 200 feet; `scripts/astral.mjs` places the astral body, a token of the Saint, there | ☐ | |
| TQ-10b | Astral Projection | For up to 10 minutes you perceive and speak through it. | ending:duration · ending:sustained | `astral` flag `minutes: 10`; `Effect: Astral Projection`, sustained; the body is the effect's shadow and goes with it | ☐ | |
| TQ-10c | Astral Projection | It is invisible to creatures without Sixth Sense or see invisibility | effect:unobserved | `astral.mjs` grants the body pf2e's invisible | ☐ | |
| TQ-10d | Astral Projection | cannot be damaged or physically interacted with, and cannot attack | effect:resistance | `Effect: Astral Body`: `Resistance` all-damage 9999 and `saint:immovable`. *Cannot attack* is not enforced | ☐ | |
| TQ-10e | Astral Projection | but you may cast mental Techniques through it, using its position as the origin. | area:from-target | `astral.mjs` `originTokenFor` answers the astral token for a Technique with the mental trait | ☐ | |
| TQ-10f | Astral Projection | Your body is unconscious and off-guard | effect:condition · reach:self | `astral.mjs` grants the Saint's own body unconscious and off-guard | ☐ | |
| TQ-10g | Astral Projection | damage to it ends the effect and leaves you stunned 1 | when:damage-taken · effect:condition | `astral.mjs` notices the body's hit points drop, ends the projection and stuns the Saint 1 | ☐ | |
| TQ-10h | Astral Projection | Heightening (+2) \+200 feet and \+5 minutes. | scaling:dice-per-rank | `areaTargeting.heightening.range: 200`, `astral.minutesPerStep: 5` | ☐ | |
| TQ-11a | Galaxian Explosion | 60-ft burst within 120 ft, 6d8 force, basic Reflex | when:cast · reach:area/burst · check:basic-save · effect:damage | `slot-3-cloth-ability/galaxian-explosion.json` | ☐ | |
| TQ-11b | Galaxian Explosion | the area becomes difficult terrain for 1 minute as space folds. | area:lingering · effect:terrain · ending:duration | `lingering`: `difficultTerrain: 2` for 1 minute | ☐ | |
| TQ-11c | Galaxian Explosion | Heightening (+2) \+1d8. | scaling:dice-per-rank · effect:damage | `heightening` 1d8 | ☐ | |
| TQ-12a | Mavros Eruption Clast | 30-ft burst within 60 ft. 8d8 fire, basic Reflex. | when:cast · reach:area/burst · check:basic-save · effect:damage | `slot-4-ultimate/mavros-eruption-clast.json` | ☐ | |
| TQ-12b | Mavros Eruption Clast | The area burns for 1 minute: entering or ending a turn there deals 4d6 persistent fire. | area:lingering · when:on-entering · when:turn-end · effect:persistent | `lingering` for 1 minute on `tokenMoveIn` and `tokenTurnEnd`: 4d6 persistent fire | ☐ | |
| TQ-12c | Mavros Eruption Clast | Critical failure \= blinded 1 minute | check:basic-save · effect:condition · ending:duration | Blinded for 1 minute on a critical failure | ☐ | |
| TQ-12d | Mavros Eruption Clast | Heightening (+2) \+1d8 initial, \+1d6 persistent. | scaling:dice-per-rank · effect:persistent | `heightening` 1d8; the lingering damage's `perStep` 1d6 | ☐ | |

## ♋ Cancer (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| TQ-13a | Sekishiki Meikai Ha | 30 ft, one creature, basic Will. 1d8 void | when:cast · reach:single · check:basic-save · effect:damage | `slot-1-signature/sekishiki-meikai-ha.json` | ☐ | |
| TQ-13b | Sekishiki Meikai Ha | on a failure the target is also drained 1 | check:basic-save · effect:condition | Drained 1 on a failure | ☐ | |
| TQ-13c | Sekishiki Meikai Ha | on a critical failure drained 2 and slowed 1 | check:basic-save · effect:condition | Drained 2 and slowed 1 on a critical failure — the slowed has no duration | ☐ | |
| TQ-13d | Sekishiki Meikai Ha | Heightening (+2) \+1d8. | scaling:dice-per-rank · effect:damage | `heightening` 1d8 | ☐ | |
| TQ-14a | Sekishiki Kisōen | 15-ft burst within 60 ft of cold blue flame. 3d8 void, basic Will. | when:cast · reach:area/burst · check:basic-save · effect:damage | `slot-2/sekishiki-kisoen.json` | ☐ | |
| TQ-14b | Sekishiki Kisōen | The flames feed: for each creature that fails its save, you regain 3 Hit Points (maximum equal to your level per casting). | effect:heal · reach:self | A `heal` rider on the Saint for each failure, `value: 3`, `maxPerCast: origin.level` | ☐ | |
| TQ-14c | Sekishiki Kisōen | A creature reduced to 0 Hit Points by this Technique has its soul consumed | when:damage-dealt · reach:filtered · ending:permanent | A `damage-applied` rider predicated `rider:target:hp-zero` places `Effect: Soul Consumed` (unlimited) | ✅ | Live (#71, `5a06920`): `Effect: Soul Consumed` on the creature the blue flames took to 0. No control was recorded beside it |
| TQ-14d | Sekishiki Kisōen | and cannot be raised by any effect below resurrect. | | Nothing | — | Raising the dead is the table's; the marker is there for the GM to read |
| TQ-14e | Sekishiki Kisōen | Heightening (+2) \+1d8, and healing per failure \+2. | scaling:dice-per-rank · effect:heal | `heightening` 1d8; the heal's `perStep: 2` | ☐ | |
| TQ-15a | Sekishiki Konsō Ha | 30-ft burst within 60 ft. 6d8 void, basic Fortitude. | when:cast · reach:area/burst · check:basic-save · effect:damage | `slot-3-cloth-ability/sekishiki-konso-ha.json` | ☐ | |
| TQ-15b | Sekishiki Konsō Ha | \+1d8 for every creature that has died in this area within the last hour (maximum \+5d8). | effect:damage | `scripts/deaths.mjs` records where creatures reach 0 HP and writes the count into the caster's `soulDice`, read by a `DamageDice` rule | ☐ | |
| TQ-15c | Sekishiki Konsō Ha | Undead and spirits in the area take an additional 2d8 and are slowed 1 on a failure. | reach:filtered · effect:damage · effect:condition | Riders predicated on `undead` or `spirit`: 2d8 more void (halved, doubled by degree) and slowed 1 on a failure | ☐ | |
| TQ-15d | Sekishiki Konsō Ha | Heightening (+2) \+1d8. | scaling:dice-per-rank · effect:damage | `heightening` 1d8 | ☐ | |
| TQ-16a | Sekishiki Tenryū Ha | 60-ft cone, Fortitude save. | when:cast · reach:area/cone · check:save | `slot-4-ultimate/sekishiki-tenryu-ha.json`, `incapacitation` | ☐ | |
| TQ-16b | Sekishiki Tenryū Ha | Failure 8d8 void damage and dragged 30 feet toward the mouth. | check:save · effect:damage · effect:forced-move/pull | `damage` 8d8 void on a failure or critical failure; a 30-foot `teleport` toward the caster | ☐ | |
| TQ-16c | Sekishiki Tenryū Ha | Critical Failure As failure, and if the creature is at half Hit Points or fewer it dies, its soul carried away. | check:save · effect:death · reach:filtered | A `death` rider with `hpFraction: 0.5` on a critical failure | ☐ | |
| TQ-16d | Sekishiki Tenryū Ha | Success Half damage. | check:save · effect:damage | `damage` at `multiplier: 0.5` on a success | ☐ | |
| TQ-16e | Sekishiki Tenryū Ha | Heightening (+2) \+1d8. | scaling:dice-per-rank · effect:damage | The rider's `perStep` 1d8 | ☐ | |

## ♌ Leo (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| TQ-17a | Lightning Bolt | 60-ft line, 1d12 electricity, basic Reflex. | when:cast · reach:area/line · check:basic-save · effect:damage | `slot-1-signature/lightning-bolt.json` | ☐ | |
| TQ-17b | Lightning Bolt | Heightening (+2) \+1d12. | scaling:dice-per-rank · effect:damage | `heightening` 1d12 | ☐ | |
| TQ-18a | Lightning Crown | Choose up to three 5-ft squares within 60 feet; a pillar erupts from each. | when:cast · reach:area/square · area:several | `slot-2/lightning-crown.json`: `areas: 3`, each a 15-foot square (the pillar and the squares beside it), range 60 | ☐ | |
| TQ-18b | Lightning Crown | A creature in or adjacent to a pillar takes 3d8 electricity, basic Reflex | check:basic-save · effect:damage | The card's basic Reflex | ☐ | |
| TQ-18c | Lightning Crown | (a creature caught by two or more rolls once and takes damage once, but suffers a −2 circumstance penalty to that save) | effect:damage-rolled-once · effect:penalty | `overlap`: from 2 areas, −2 to the Reflex save | ☐ | |
| TQ-18d | Lightning Crown | Critical failure \= knocked prone. | check:basic-save · effect:condition | Prone on a critical failure | ☐ | |
| TQ-18e | Lightning Crown | Pillars persist 1 round, shedding bright light and blocking line of sight through their squares. | area:lingering · effect:light · ending:duration | `lingering` for 1 round, `blocksSight`, a light of 20/40 feet | ☐ | |
| TQ-18f | Lightning Crown | Heightening (+2) \+1d8; at 10th, 14th, and 18th level add one pillar. | scaling:dice-per-rank · scaling:from-rank · area:several | `heightening` 1d8; `areaTargeting.heightening.at` 10, 14, 18: `areas` +1 | ☐ | |
| TQ-19a | Lightning Plasma | Make 3 unarmed Strikes against any creatures within 30 feet at no multiple attack penalty increase. | when:cast · reach:up-to-n · check:attack · economy:attack-penalty | `slot-3-cloth-ability/lightning-plasma.json`: a 30-foot emanation of enemies, up to 3; a `strikes` rider at no penalty | ☐ | |
| TQ-19b | Lightning Plasma | Counts as three attacks for your MAP afterward. | economy:attack-penalty | A note only | ☐ | |
| TQ-19c | Lightning Plasma | Heightening (+2) at 17th level, add one Strike. | scaling:targets-per-rank · scaling:from-rank | `areaTargeting.heightening.at` 17: `maxTargets` +1 | ☐ | |
| TQ-20a | Photon Burst | A 120-ft line, or a 30-ft burst within 120 ft (choose as you cast). | when:cast · area:shape-choice · reach:area/line · reach:area/burst | `slot-4-ultimate/photon-burst.json` `areaTargetingShapes`: the line or the burst | ☐ | |
| TQ-20b | Photon Burst | 16d6 force, basic Reflex. | check:basic-save · effect:damage | The card | ☐ | |
| TQ-20c | Photon Burst | This damage is not reduced by cover | effect:cover | Nothing: pf2e's cover bonus to the Reflex save still applies | ☐ | |
| TQ-20d | Photon Burst | and it ignores concealment, resistance to force, and any effect that would slow or intercept it | effect:damage | `bypass` of force resistance, predicated on the Technique. Concealment never gates a save; nothing stops an interception | ☐ | |
| TQ-20e | Photon Burst | Critical failure \= blinded 1 minute and dazzled until restoration. | check:basic-save · effect:condition · ending:duration · ending:permanent | Blinded for 1 minute and dazzled with no duration, on a critical failure | ☐ | |
| TQ-20f | Photon Burst | Heightening (+2) \+2d6. | scaling:dice-per-rank · effect:damage | `heightening` 2d6 | ☐ | |

## ♍ Virgo (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| TQ-21a | Tenbu Hōrin | (cosmo, mental) 30 ft, one creature, Will save. | when:cast · reach:single · check:save | `slot-1-signature/tenbu-horin.json`: one target within 30 feet | ☐ | |
| TQ-21b | Tenbu Hōrin | Failure It loses one sense of your choice (blinded, deafened, or unable to smell/taste) for 1 minute. | check:caster-choice · effect:condition · ending:duration | A `choice` rider on a failure — blinded, deafened, or `Effect: Sense Lost (Smell and Taste)` — for 1 minute | ☐ | |
| TQ-21c | Tenbu Hōrin | Critical Failure Two senses. | check:caster-choice · effect:condition | Two choices on a critical failure | ☐ | |
| TQ-21d | Tenbu Hōrin | Heightening (+2) range \+10 feet; at 12th and 16th level, \+1 target. | scaling:targets-per-rank · scaling:from-rank | `areaTargeting.heightening`: range +10 a step, `maxTargets` +1 at 12th and 16th | ☐ | |
| TQ-22a | Tenpōrin'in | 30-ft emanation, 1 minute, sustained. | when:cast · reach:area/emanation · reach:allies · ending:sustained | `slot-2/tenporinin.json`: a 30-foot emanation of allies and the Saint, sustained up to 1 minute | ☐ | |
| TQ-22b | Tenpōrin'in | You and allies in the area gain a \+1 status bonus to Will saves and to saves against mental effects | effect:bonus | `Effect: Tenpōrin'in` for 1 minute on everyone the cast caught — it does not follow the area or the Sustain | ☐ | |
| TQ-22c | Tenpōrin'in | and are immune to fascinated and frightened. | effect:resistance | `Effect: Tenpōrin'in` `Immunity` fascinated and frightened | ☐ | |
| TQ-22d | Tenpōrin'in | When you cast this, you may counteract one mental effect currently affecting a creature in the area, using your Cosmo DC. | check:counteract | A `counteract` rider, mental traits, offered to the Saint | ☐ | |
| TQ-22e | Tenpōrin'in | Heightening (+2) emanation \+5 feet | scaling:area-per-rank | `heightening.area: 5` | ☐ | |
| TQ-22f | Tenpōrin'in | at 12th level the bonus becomes \+2 and immunity extends to confused; at 18th, \+3. | scaling:from-rank · effect:bonus · effect:resistance | Substitutions at 12th and 18th; the confused immunity's predicate opens at 12th | ☐ | |
| TQ-23a | Tenma Kōfuku | 30-ft cone, 6d8 force, basic Will save | when:cast · reach:area/cone · check:basic-save · effect:damage | `slot-3-cloth-ability/tenma-kofuku.json` | ☐ | |
| TQ-23b | Tenma Kōfuku | Failure \= stunned 1 | check:basic-save · effect:condition | Stunned 1 on a failure | ☐ | |
| TQ-23c | Tenma Kōfuku | critical failure \= stunned 3 and cannot use reactions for 1 minute. | check:basic-save · effect:condition · effect:forbid · ending:duration | Stunned 3, and `Effect: Reactions Denied` for 1 minute — a `Note`; pf2e cannot refuse a reaction | ☐ | |
| TQ-23d | Tenma Kōfuku | Heightening (+2) \+1d8. | scaling:dice-per-rank · effect:damage | `heightening` 1d8 | ☐ | |
| TQ-23e | Tenma Kōfuku | Special If you release this in the same turn that you open your eyes (spending Om stacks), the cone becomes a 60-ft emanation centred on you. | area:shape-choice · reach:area/emanation · economy:requires | `alternateArea`: a 60-foot emanation predicated `om:eyes-open` | ☐ | |
| TQ-24a | Rikudō Rinne | 60 ft, one creature, Will save. | when:cast · reach:single · check:save | `slot-4-ultimate/rikudo-rinne.json`: one enemy within 60 feet | ☐ | |
| TQ-24b | Rikudō Rinne | Failure Its soul is cast into one of the six realms for 1 minute: it is stunned for the duration, its body standing empty. | check:save · effect:condition · ending:duration | Stunned 3 (capped at 3) for 1 minute on a failure — a stunned value, which spends itself on actions, rather than stunned for the duration | ☐ | |
| TQ-24c | Rikudō Rinne | Critical Failure 10 minutes, and on return it is enfeebled 2 and stupefied 2 for an hour | check:save · effect:condition · ending:duration | Stunned 3 for 10 minutes; enfeebled 2 and stupefied 2 for an hour — applied at once, not on return | ☐ | |
| TQ-24d | Rikudō Rinne | Success Stunned 1 | check:save · effect:condition | Stunned 1 on a success | ☐ | |
| TQ-24e | Rikudō Rinne | Heightening (+2) at 20th level, you may target two creatures. | scaling:targets-per-rank · scaling:from-rank | `areaTargeting.heightening.at` 20: `maxTargets` +1 | ☐ | |

## ♎ Libra (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| TQ-25a | Rozan Shō Ryū Ha | A 10-ft-radius, 30-ft-tall cylinder centred on you. 1d10 bludgeoning, basic Reflex | when:cast · reach:area/emanation · check:basic-save · effect:damage | `slot-1-signature/rozan-sho-ryu-ha.json`: a 10-foot cylinder anchored on the Saint, affecting all | ☐ | |
| TQ-25b | Rozan Shō Ryū Ha | creatures that critically fail are launched 30 feet upward. | effect:elevation/lift · effect:damage | Prone and 15 bludgeoning (the fall) on a critical failure; nothing changes elevation | ☐ | |
| TQ-25c | Rozan Shō Ryū Ha | Heightening (+2) \+1d10. | scaling:dice-per-rank · effect:damage | `heightening` 1d10 | ☐ | |
| TQ-26a | The Twelve Arms | Distribute up to five Arms (matched pairs) to allies within 30 feet; you keep at least one. | when:cast · reach:allies · reach:up-to-n · check:caster-choice | `slot-2/the-twelve-arms.json`: a 30-foot emanation of allies (not the Saint), up to 5, each a `choice` of the six Arms | ☐ | |
| TQ-26b | The Twelve Arms | For 3 rounds, each ally wielding an Arm uses your weapon proficiency with it | reach:allies · ending:duration | The lent-Arm effect (`content/saint-effects/lent-arms/`) for 3 rounds, its `MartialProficiency` written with the Saint's unarmed rank at hand-out | ☐ | |
| TQ-26c | The Twelve Arms | receives its full Arms Advance for your level | effect:weapon-runes | The lent effect's potency and dice substituted from `origin.libra.potency` and `origin.libra.dice` | ☐ | |
| TQ-26d | The Twelve Arms | and gains that Arm's Art (including its Greater and Perfect upgrades). | economy:granted-action · scaling:from-rank | The lent effect grants the pair and its Art, and a `libra:lent-tier:*` option at the Saint's 8th and 14th; `riders-extensions.mjs` puts the pair in the ally's hands | ☐ | |
| TQ-26e | The Twelve Arms | The weapons cannot be dropped involuntarily | effect:resistance | Nothing | ☐ | |
| TQ-26f | The Twelve Arms | and return to your Cloth when the duration ends. | ending:duration | `scripts/libra.mjs` sweeps an expired lent effect at a turn's start or end; its granted weapons go with it | ☐ | |
| TQ-26g | The Twelve Arms | Heightening (+2) \+1 round and \+10 feet. | scaling:dice-per-rank | Duration `base 3, perStep 1, max 15`; range +10 a step | ☐ | |
| TQ-26h | The Twelve Arms | A 20th-level Saint on an Exalted day with Cloth Attunement reaches 12 heightening steps — 15 rounds, the hard maximum. | scaling:dice-per-rank · ending:duration | The cap of 15 is written; but Cloth Attunement's step is read by nothing (`SC-30a`), so a 20th-level Saint reaches 14 rounds on an Exalted day | ☐ | |
| TQ-27a | Rozan Ryū Hi Shō | Fly up to 60 feet in a straight line and make one unarmed Strike or Libra weapon Strike at any point during the movement | when:cast · reach:single · check:attack | `slot-3-cloth-ability/rozan-ryu-hi-sho.json`: one enemy within 60 feet, a `strikes` rider with whatever Libra weapon is held, or the fist. The Saint's token does not move | ☐ | |
| TQ-27b | Rozan Ryū Hi Shō | dealing \+6d8 damage on a hit. | effect:strike-damage | `Effect: Rozan Ryū Hi Shō` `DamageDice`, 6 and one a step | ☐ | |
| TQ-27c | Rozan Ryū Hi Shō | This movement doesn't trigger reactions. | reach:self | Nothing moves, so nothing is spared | ☐ | |
| TQ-27d | Rozan Ryū Hi Shō | On a hit you may continue to the end of your movement; on a miss you stop adjacent to the target. | effect:gm-note | `onHit` and `onMiss` prompts | ☐ | |
| TQ-27e | Rozan Ryū Hi Shō | On a critical hit, the target is carried with you to the end of your flight and knocked prone. | effect:forced-move/push · effect:condition | On a critical success a `teleport` to 5 feet from the caster, and prone | ☐ | |
| TQ-27f | Rozan Ryū Hi Shō | Heightening (+2) \+1d8 and \+10 feet of flight. | scaling:dice-per-rank | The effect's dice `perStep` 1; range +10 a step | ☐ | |
| TQ-28a | Athena's Arsenal: Overdrive | Make six Strikes distributed as you choose among creatures within 60 feet, one with a weapon from each of the six Arms | when:cast · reach:up-to-n · check:attack | `slot-4-ultimate/athenas-arsenal-overdrive.json`: a 60-foot emanation of enemies, up to 6; a `strikes` rider naming one weapon of each Arm | ☐ | |
| TQ-28b | Athena's Arsenal: Overdrive | each dealing that weapon's damage \+2d8. | effect:strike-damage | `Effect: Athena's Arsenal (Overdrive)` `DamageDice` 2 and one a step on Libra weapons | ☐ | |
| TQ-28c | Athena's Arsenal: Overdrive | Each Strike counts as the second weapon of its pair, so the twin bonus always applies | effect:strike-damage | The same effect adds the twin bonus itself: `FlatModifier` circumstance `@weapon.system.damage.dice` | ☐ | |
| TQ-28d | Athena's Arsenal: Overdrive | and each applies its Arm's Art wherever that Art's trigger is met. | when:strike-made | Nothing: each Art is used by hand | ☐ | |
| TQ-28e | Athena's Arsenal: Overdrive | The multiple attack penalty does not apply to any of these Strikes; the activity counts as three attacks for your MAP afterward. | economy:attack-penalty | The Strikes roll at no penalty; the count afterward is a note | ☐ | |
| TQ-28f | Athena's Arsenal: Overdrive | For 1 minute afterward the twelve weapons circle you: \+2 circumstance bonus to AC | effect:bonus · reach:self · ending:duration | `Effect: Athena's Arsenal` on the Saint for 1 minute: `FlatModifier` +2 circumstance AC | ☐ | |
| TQ-28g | Athena's Arsenal: Overdrive | and any creature that ends its turn adjacent to you takes 2d8 slashing. | area:aura/pf2e · when:turn-end · effect:damage | The same effect's `Aura` and an `aura-tick` rider: 2d8 slashing | ☐ | |
| TQ-28h | Athena's Arsenal: Overdrive | Heightening (+2) \+1d8 per Strike. | scaling:dice-per-rank · effect:strike-damage | The Overdrive effect's dice `perStep` 1 | ☐ | |

## ♏ Scorpio (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| TQ-29a | Scarlet Needle | ✦ (cosmo) 30 ft, one creature, Fortitude save. | when:cast · reach:single · check:save | `slot-1-signature/scarlet-needle.json`: one enemy within 30 feet | ☐ | |
| TQ-29b | Scarlet Needle | Failure It gains one needle and takes 1d6 persistent bleed. | check:save · economy:charges · effect:persistent | A needle stacked on a failure or critical failure; the 1d6 bleed is the card's persistent damage, applied by hand | ☐ | |
| TQ-29c | Scarlet Needle | Critical Failure As failure, plus it is off-guard for 1 round. | check:save · effect:condition · ending:duration | Off-guard for 1 round on a critical failure | ☐ | |
| TQ-29d | Scarlet Needle | Heightening (+2) \+1d6 persistent bleed. | scaling:dice-per-rank · effect:persistent | `heightening` 1d6 | ☐ | |
| TQ-30a | Crimson Mirage | 30 ft, one creature with at least 1 needle, Will save. | when:cast · reach:filtered · check:save | `slot-2/crimson-mirage.json`: one enemy within 30 feet, predicated on 1 or more needles | ☐ | |
| TQ-30b | Crimson Mirage | Failure For 1 minute it is dazzled, treats all other creatures as concealed | check:save · effect:condition · effect:concealment · ending:duration | `Effect: Crimson Mirage` for 1 minute on a failure or critical failure: dazzled, and the concealment as a `Note` | ☐ | |
| TQ-30c | Crimson Mirage | and takes 1d6 mental damage per needle it currently has at the end of each of its turns. | when:turn-end · effect:damage | The effect's `turn-end` rider: 1d6 mental per needle | ☐ | |
| TQ-30d | Crimson Mirage | Critical Failure As failure, and it is confused for 1 round as the mirage overtakes it entirely. | check:save · effect:condition · ending:duration | Confused for 1 round on a critical failure | ☐ | |
| TQ-30e | Crimson Mirage | Heightening (+2) at 10th, 14th, and 18th level, the per-needle damage increases by 1d6. | scaling:from-rank · effect:damage | The rider's formula substituted at 10th, 14th and 18th | ☐ | |
| TQ-31a | Crimson Flurry | Make four unarmed Strikes against any creatures within 30 feet at no multiple attack penalty increase. | when:cast · reach:up-to-n · check:attack · economy:attack-penalty | `slot-3-cloth-ability/crimson-flurry.json`: a 30-foot emanation of enemies, up to 4; a `strikes` rider at no penalty | ☐ | |
| TQ-31b | Crimson Flurry | Each Strike that hits applies one needle in addition to its normal effect | when:strike-made · economy:charges | `onHit`: a needle | ☐ | |
| TQ-31c | Crimson Flurry | on any day your constellation is ascendant, Strikes that miss apply a needle too. | when:strike-made · economy:charges | `onMiss`: a needle, predicated `sky:ascendant` and `sky:sign:scorpio` | ☐ | |
| TQ-31d | Crimson Flurry | Counts as three attacks for your MAP afterward. | economy:attack-penalty | A note only | ☐ | |
| TQ-31e | Crimson Flurry | Heightening (+2) at 15th and 19th level, \+1 Strike. | scaling:targets-per-rank · scaling:from-rank | `areaTargeting.heightening.at` 15 and 19: `maxTargets` +1 | ☐ | |
| TQ-32a | Antares | 30 ft, one creature with at least 5 needles, Fortitude save. | when:cast · reach:filtered · check:save | `slot-4-ultimate/antares.json`: one enemy within 30 feet, predicated on 5 or more needles; `incapacitation` | ☐ | |
| TQ-32b | Antares | Failure 16d6 damage and paralyzed 1 round. | check:save · effect:damage · effect:condition · ending:duration | Paralyzed for 1 round on a failure; the 16d6 piercing is the card's damage, applied by hand | ☐ | |
| TQ-32c | Antares | Critical Failure It dies | check:save · effect:death | A `death` rider on a critical failure | ☐ | |
| TQ-32d | Antares | Heightening (+2) \+2d6. | scaling:dice-per-rank · effect:damage | `heightening` 2d6 | ☐ | |

## ♐ Sagittarius (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| TQ-33a | Golden Arrow | A spell attack with a 500-ft range increment | when:cast · check:attack · reach:single | `slot-1-signature/golden-arrow.json`: a spell attack, range 500 feet — a range, not an increment | ☐ | |
| TQ-33b | Golden Arrow | ignoring cover and concealment. | effect:reveal · effect:cover | Nothing | ☐ | |
| TQ-33c | Golden Arrow | 2d6 force damage. | effect:damage | The card | ☐ | |
| TQ-33d | Golden Arrow | Heightening (+2) \+2d6. | scaling:dice-per-rank · effect:damage | `heightening` 2d6 | ☐ | |
| TQ-34a | Chiron's Light Impulse | 30 ft, one ally (or yourself), 1 minute. | when:cast · reach:single · reach:allies · ending:duration | `slot-2/chirons-light-impulse.json`: range 30, an `action-used` rider placing `Effect: Chiron's Light Impulse` for 1 minute | ☐ | |
| TQ-34b | Chiron's Light Impulse | The target is wreathed in golden light: \+1 status bonus to attack rolls | effect:bonus | The effect's `FlatModifier` +1 status on attack rolls | ☐ | |
| TQ-34c | Chiron's Light Impulse | their attacks deal an extra 1d6 force | effect:strike-damage | The effect's `DamageDice` on Strike and spell damage | ☐ | |
| TQ-34d | Chiron's Light Impulse | and they gain a fly Speed of 20 feet. | effect:speed | The effect's `BaseSpeed` fly 20 | ☐ | |
| TQ-34e | Chiron's Light Impulse | Once during the duration, as a free action, the target may treat one attack roll or saving throw as though they had rolled a 10. | when:check-rolled · economy:charges | The effect's `SubstituteRoll` 10 on attack rolls and on saving throws — offered on every roll; nothing spends it | ☐ | |
| TQ-34f | Chiron's Light Impulse | Heightening (+2) \+1d6; at 14th level the fly Speed equals the target's Speed. | scaling:dice-per-rank · scaling:from-rank · effect:speed | Substitutions: the dice a step, the fly Speed from 14th | ☐ | |
| TQ-35a | Infinity Break | A line of any length up to one mile in a direction you choose. 12d6 force, basic Reflex. | when:cast · reach:area/line · check:basic-save · effect:damage | `slot-3-cloth-ability/infinity-break.json`: a 5,280-foot line — always the full mile, never shorter | ☐ | |
| TQ-35b | Infinity Break | The arrow passes through walls, structures, cover, and any barrier with Hardness less than 20 | reach:area/line | `areaTargeting.requireLineOfEffect: false` — through every wall, whatever its Hardness | ☐ | |
| TQ-35c | Infinity Break | destroying a 5-ft section of each as it goes. | effect:destroy · reach:object | Nothing | ☐ | |
| TQ-35d | Infinity Break | You do not need line of sight — only a direction and the conviction that something is there. | reach:area/line | `requireLineOfEffect: false` | ☐ | |
| TQ-35e | Infinity Break | Heightening (+2) \+2d6. | scaling:dice-per-rank · effect:damage | `heightening` 2d6 | ☐ | |
| TQ-36a | Aiolos's Wings | For 10 minutes you gain a fly Speed equal to twice your Speed | when:cast · effect:speed · reach:self · ending:duration | `slot-4-ultimate/aioloss-wings.json` places `Effect: Aiolos's Wings` on the Saint: `BaseSpeed` fly ×2, 10 minutes | ☐ | |
| TQ-36b | Aiolos's Wings | you can Fly at full speed while attacking without penalty | | Nothing | — | pf2e puts no penalty on attacking in flight, so there is nothing to lift |
| TQ-36c | Aiolos's Wings | and Golden Arrow becomes a 1-action Technique costing no Focus Point. | economy:granted-action | Nothing: no `freeCast` and no action change on *Golden Arrow* | ☐ | |
| TQ-36d | Aiolos's Wings | You may also share flight with up to five allies within 30 feet, each gaining a fly Speed equal to their Speed for the duration. | reach:allies · reach:up-to-n · effect:speed | A 30-foot emanation of allies, up to 5: `Effect: Aiolos's Wings (Shared)`, fly equal to Speed, 10 minutes | ☐ | |
| TQ-36e | Aiolos's Wings | Heightening (+2) \+5 minutes. | scaling:dice-per-rank · ending:duration | Nothing: both effects are a fixed 10 minutes | ☐ | |

## ♑ Capricorn (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| TQ-37a | Excalibur | Until the end of your turn, your unarmed Strikes deal slashing damage | when:cast · effect:damage-type · ending:duration | `slot-1-signature/excalibur.json` places `Effect: Excalibur` on the Saint until the turn's end: `ItemAlteration` slashing on unarmed | ☐ | |
| TQ-37b | Excalibur | gain deadly d10 | effect:trait-gained | The effect's `AdjustStrike` deadly-d10 | ☐ | |
| TQ-37c | Excalibur | and ignore Hardness. | effect:strike-damage | Nothing: `Effect: Excalibur` carries no `bypass` (the Double Excalibur effect does) | ☐ | |
| TQ-37d | Excalibur | Heightening (+2) at 10th level the deadly die becomes d12; at 14th and 18th, add \+1d6 slashing. | scaling:from-rank · effect:trait-gained · effect:strike-damage | Substitutions: deadly-d12 from 10th, a `DamageDice` count of 1 at 14th and 2 at 18th | ☐ | |
| TQ-38a | Jumping Stone | Stride up to twice your Speed, ignoring difficult terrain and crossing gaps up to 20 feet as though on solid ground. | effect:speed · reach:self | Nothing moves the Saint | ☐ | |
| TQ-38b | Jumping Stone | At any point during the movement, make one unarmed Strike dealing \+3d8 slashing | check:attack · effect:strike-damage | `slot-2/jumping-stone.json` is a **spell attack** dealing 3d8 slashing, not an unarmed Strike with 3d8 added — the fist's own damage is missing | ☐ | |
| TQ-38c | Jumping Stone | if you moved at least 20 feet before the Strike, treat the target's AC as 2 lower. | effect:bonus · economy:requires | A `jumping-stone:moved-20` toggle and a `FlatModifier` +2 to the attack on it | ☐ | |
| TQ-38d | Jumping Stone | This movement doesn't trigger reactions. | reach:self | Nothing moves, so nothing is spared | ☐ | |
| TQ-38e | Jumping Stone | Heightening (+2) \+1d8. | scaling:dice-per-rank · effect:damage | `heightening` 1d8 | ☐ | |
| TQ-39a | Double Excalibur | Make two unarmed Strikes against a single creature within reach. | when:cast · reach:single · check:attack | `slot-3-cloth-ability/double-excalibur.json`: one enemy within 5 feet, a `strikes` rider of 2 | ☐ | |
| TQ-39b | Double Excalibur | Both are made at your full attack modifier with no multiple attack penalty | economy:attack-penalty | Both roll at no penalty | ☐ | |
| TQ-39c | Double Excalibur | both gain deadly d12 | effect:trait-gained | `Effect: Double Excalibur` `AdjustStrike` adds deadly d8, d10 **and** d12 | ☐ | |
| TQ-39d | Double Excalibur | and both ignore Hardness, resistance, and immunity to physical damage. | effect:strike-damage | The effect's `bypass`: Hardness, every resistance, physical immunity, on unarmed | ☐ | |
| TQ-39e | Double Excalibur | If both hit, the target attempts a Fortitude save against your Cosmo DC; on a failure it is severed (as The Sharpest Sword). | check:attack-then-save · check:caster-choice · ending:permanent | `onAllHit`: the severing `choice` directly — **no Fortitude save is rolled** | ☐ | |
| TQ-39f | Double Excalibur | Counts as two attacks for your MAP afterward. | economy:attack-penalty | A note only | ☐ | |
| TQ-39g | Double Excalibur | Heightening (+2) each Strike \+1d8 slashing. | scaling:dice-per-rank · effect:strike-damage | The effect's `DamageDice` count = the cast's steps | ☐ | |
| TQ-40a | Excalibur: The Sword That Cuts Everything | 60-ft line. 16d6 slashing, basic Reflex. | when:cast · reach:area/line · check:basic-save · effect:damage | `slot-4-ultimate/excalibur-the-sword-that-cuts-everything.json` | ☐ | |
| TQ-40b | Excalibur: The Sword That Cuts Everything | This damage ignores all Hardness, all resistances, and all immunities to physical damage | effect:damage | `bypass`: Hardness, every resistance, physical immunity | ☐ | |
| TQ-40c | Excalibur: The Sword That Cuts Everything | and treats force effects (wall of force, forcecage) as objects with Hardness 0 | reach:object · effect:destroy | The Hardness bypass reaches an object only if the object is damaged at all; nothing targets a force effect | ☐ | |
| TQ-40d | Excalibur: The Sword That Cuts Everything | Creatures that critically fail are severed, no save. | check:caster-choice · ending:permanent | The severing `choice` on a critical failure | ☐ | |
| TQ-40e | Excalibur: The Sword That Cuts Everything | Any structure, wall, or terrain feature in the line is cut cleanly through. | effect:destroy · reach:object | `requireLineOfEffect: false` lets the line pass; nothing is cut | ☐ | |
| TQ-40f | Excalibur: The Sword That Cuts Everything | Heightening (+2) \+2d6. | scaling:dice-per-rank · effect:damage | `heightening` 2d6 | ☐ | |

## ♒ Aquarius (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| TQ-41a | Diamond Dust | 30-ft cone, 1d8 cold, basic Fortitude | when:cast · reach:area/cone · check:basic-save · effect:damage | `slot-1-signature/diamond-dust.json` | ☐ | |
| TQ-41b | Diamond Dust | on a failure the target is slowed 1 for 1 round. | check:basic-save · effect:condition · ending:duration | Slowed 1 for 1 round on a failure or critical failure | ☐ | |
| TQ-41c | Diamond Dust | Heightening (+2) \+1d8. | scaling:dice-per-rank · effect:damage | `heightening` 1d8 | ☐ | |
| TQ-42a | Koliço | 60 ft, one creature, Reflex save. | when:cast · reach:single · check:save | `slot-2/kolico.json`: range 60, pf2e's own target | ☐ | |
| TQ-42b | Koliço | Failure 3d8 cold and immobilized for 1 minute | check:save · effect:damage · effect:hold/hazard · ending:duration | An `encasement` (immobilized) on a failure or critical failure — held until escaped or broken, with no minute; the 3d8 is the card's damage, applied by hand | ☐ | |
| TQ-42c | Koliço | (Escape DC \= your Cosmo DC; the rings have Hardness 8, HP 30, and shatter if destroyed) | effect:hold/hazard | The encasement: `escapeDc: cosmo`, Hardness 8, 30 HP | ☐ | |
| TQ-42d | Koliço | Critical Failure As failure, and also restrained. | check:save · effect:condition | Restrained for 1 minute on a critical failure | ☐ | |
| TQ-42e | Koliço | Success Half damage and slowed 1 for 1 round. | check:save · effect:damage · effect:condition | Slowed 1 for 1 round on a success; the half damage is the card's, by hand | ☐ | |
| TQ-42f | Koliço | Heightening (+2) \+1d8; the rings' Hardness \+2 and HP \+10. | scaling:dice-per-rank · effect:hold/hazard | `heightening` 1d8; the encasement's `hardnessPerStep: 2`, `hpPerStep: 10` | ☐ | |
| TQ-43a | Freezing Shield | A dome of frozen air, 20-ft radius, centred on you, lasting 1 minute. | when:cast · area:aura/pf2e · ending:duration | `slot-3-cloth-ability/freezing-shield.json` places `Effect: Freezing Shield` on the Saint for 1 minute, with a 20-foot `Aura` | ☐ | |
| TQ-43b | Freezing Shield | You and allies inside gain cold resistance 15 | reach:allies · effect:resistance | The effect's `Resistance` cold 15 — on the Saint's own effect | ☐ | |
| TQ-43c | Freezing Shield | and a \+2 circumstance bonus to AC against ranged attacks. | effect:bonus | The effect's `FlatModifier` +2 circumstance AC predicated `item:trait:ranged` | ☐ | |
| TQ-43d | Freezing Shield | Any creature hostile to you that enters the dome or ends its turn inside takes 6d8 cold (basic Fortitude), and is slowed 1 on a failure. | when:on-entering · when:turn-end · check:basic-save · effect:condition | An `aura-tick` save rider: 6d8 cold and slowed 1 for a round **only on a failure or critical failure** — not a basic save as authored | ☐ | |
| TQ-43e | Freezing Shield | Ranged attacks and spell attacks crossing into the dome from outside take a −4 circumstance penalty. | effect:penalty · area:aura/pf2e | Nothing | ☐ | |
| TQ-43f | Freezing Shield | Heightening (+2) \+1d8, resistance \+5, radius \+5 feet. | scaling:dice-per-rank · scaling:area-per-rank | Substitutions per step: the aura's radius, the rider's dice, the resistance | ☐ | |
| TQ-44a | Freezing Coffin | 30 ft, one creature, Fortitude save. | when:cast · reach:single · check:save | `slot-4-ultimate/freezing-coffin.json`: range 30, pf2e's own target; `incapacitation` | ☐ | |
| TQ-44b | Freezing Coffin | Failure 16d6 cold and slowed 2 for 1 minute. | check:save · effect:damage · effect:condition · ending:duration | Slowed 2 for 1 minute on a failure; the 16d6 is the card's damage, by hand | ☐ | |
| TQ-44c | Freezing Coffin | Critical Failure Entombed in unmelting ice indefinitely: the creature is petrified, does not age, and does not need to breathe. | check:save · effect:hold/hazard · effect:condition · ending:permanent | An `encasement` *the Coffin* granting petrified, on a critical failure | ☐ | |
| TQ-44d | Freezing Coffin | The coffin has Hardness 30 and HP 120 | effect:hold/hazard | The encasement's Hardness 30, 120 HP | ☐ | |
| TQ-44e | Freezing Coffin | it ends only by being destroyed, by dispel magic (counteract rank 8), by a cold effect exceeding your own, or by your choice. | ending:dismiss · check:counteract | Destroying the encasement ends it; the rest is its note | ☐ | |
| TQ-44f | Freezing Coffin | Heightening (+2) \+2d6. | scaling:dice-per-rank · effect:damage | `heightening` 2d6 | ☐ | |

## ♓ Pisces (guide §5)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| TQ-45a | Piranha Rose | 30 ft, up to three creatures. | when:cast · reach:up-to-n | `slot-1-signature/piranha-rose.json`: a 30-foot emanation of enemies, up to 3 | ☐ | |
| TQ-45b | Piranha Rose | Each takes 1d8 slashing and 1d6 persistent bleed, basic Reflex | check:basic-save · effect:damage · effect:persistent | The card's basic Reflex for the slashing; a `persistent-damage` bleed rider | ☐ | |
| TQ-45c | Piranha Rose | (a success negates the persistent damage) | check:basic-save · effect:persistent | The bleed rider fires only on a failure or critical failure | ☐ | |
| TQ-45d | Piranha Rose | Heightening (+2) \+1d8; at 9th, 13th, and 17th level, \+1d6 persistent. | scaling:dice-per-rank · scaling:from-rank · effect:persistent | `heightening` 1d8; the bleed formula 2d6, 3d6, 4d6 at 9th, 13th, 17th | ☐ | |
| TQ-46a | Royal Demon Rose | A 20-ft burst within 60 ft fills with drifting white petals for 1 minute. | when:cast · reach:area/burst · area:lingering · ending:duration | `slot-2/royal-demon-rose.json`: a 20-foot burst, range 60, `lingering` for 1 minute | ☐ | |
| TQ-46b | Royal Demon Rose | Any creature that starts its turn in the area attempts a Fortitude save. | when:turn-start · check:save | `lingering.events: tokenTurnStart`, a Fortitude save at the Cosmo DC | ☐ | |
| TQ-46c | Royal Demon Rose | Failure 3d8 poison and enfeebled 1 | check:save · effect:damage · effect:condition | 3d8 poison (1d8 a step) and enfeebled 1 — not stacked — on a failure or critical failure | ☐ | |
| TQ-46d | Royal Demon Rose | Critical Failure As failure, plus stupefied 2 for 1 minute | check:save · effect:condition · ending:duration | Stupefied 2 for 1 minute on a critical failure | ☐ | |
| TQ-46e | Royal Demon Rose | Creatures with no sense of smell are unaffected. | reach:filtered | Nothing exempts them | ☐ | |
| TQ-46f | Royal Demon Rose | Heightening (+2) \+1d8. | scaling:dice-per-rank · effect:damage | The lingering formula's `perStep` 1d8 | ☐ | |
| TQ-47a | Crimson Fog | 40-ft burst within 60 ft. 6d8 piercing, basic Reflex | when:cast · reach:area/burst · check:basic-save · effect:damage | `slot-3-cloth-ability/crimson-fog.json` | ☐ | |
| TQ-47b | Crimson Fog | on a failure the target also takes 3d6 persistent bleed. | effect:persistent | A second damage part on the card, 3d6 persistent bleed — subject to the basic save at every degree rather than a failure only | ☐ | |
| TQ-47c | Crimson Fog | The area fills with crimson petals for 1 minute: it is difficult terrain | area:lingering · effect:terrain · ending:duration | `lingering`: `difficultTerrain: 2` for 1 minute | ☐ | |
| TQ-47d | Crimson Fog | and creatures inside are concealed from anyone outside and vice versa. | effect:concealment | Nothing | ☐ | |
| TQ-47e | Crimson Fog | You and your allies ignore both effects — you know where the roses are. | reach:enemies · effect:terrain | Nothing: the terrain is difficult for everyone | ☐ | |
| TQ-47f | Crimson Fog | Heightening (+2) \+1d8 and \+1d6 persistent. | scaling:dice-per-rank · effect:persistent | `heightening` 1d8 and 1d6 | ☐ | |
| TQ-48a | Royal Funeral | 60 ft, one creature. A single black rose crosses the distance. Fortitude save. | when:cast · reach:single · check:save | `slot-4-ultimate/royal-funeral.json`: range 60, pf2e's own target; `incapacitation`, `death` | ☐ | |
| TQ-48b | Royal Funeral | Failure 16d6 poison, enfeebled 2, and drained 2 | check:save · effect:damage · effect:condition | `damage` 16d6 poison, enfeebled 2 and drained 2 on a failure | ☐ | |
| TQ-48c | Royal Funeral | Critical Failure The rose reaches the heart and the target dies | check:save · effect:death | A `death` rider on a critical failure (the 16d6 rider fires there too) | ☐ | |
| TQ-48d | Royal Funeral | Success Half damage and enfeebled 1 | check:save · effect:damage · effect:condition | `damage` at `multiplier: 0.5` and enfeebled 1 on a success | ☐ | |
| TQ-48e | Royal Funeral | Heightening (+2) \+2d6. | scaling:dice-per-rank · effect:damage | The damage riders' `perStep` 2d6 | ☐ | |
| TQ-48f | Royal Funeral | Special From the rose's colour you know the target's exact current Hit Points, from the moment you cast until the end of the encounter. | effect:info · ending:duration | `Effect: Rose-Marked` (the encounter) on the Saint, its `turn-start` `readout` of the tracked target | ☐ | |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 235 |
| ✅ | 1 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 3 |
| **Total** | **239** |

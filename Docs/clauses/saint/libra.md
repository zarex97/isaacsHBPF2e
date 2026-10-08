# Clauses — Libra, the Weapons

*Libra tracker. The one Gold Cloth that carries weapons: its Passive, the six Arms, the Arms Advance, the six
Arts at their three tiers, and both boons. Source: `Docs/saint-gold-cloth-guide-v4.md` §5 ♎ Libra. Libra's
four Techniques are with the others in `techniques.md` (`TQ-25`–`TQ-28`).*

**Tier:** Libra · **Tracker issue:** #143

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

*Libra's own shape.* pf2e models a weapon, not an arsenal, so most of this is `scripts/libra.mjs`: summoning
an Arm equips the matched pair and sets the rest down (`equipArm`), the sky decides how many pairs the hands
may hold, a Shield re-forms when an Arm is called, and *The Crossing*'s halved healing is corrected after
the fact. The Arms Advance is three `ItemAlteration` rules on the Cloth with level brackets. The Arts are
granted whole at 1st level, so each tier is a predicate on level — or, for an ally holding a lent Arm, on
`libra:lent-tier:*` (`TQ-26`). *The Arts' triggers are not detected*: each Art is an action the player uses
when its trigger happens.

Nothing here has been driven live. The *Measured against the item table* section is costing, not rules,
and has no rows.

**IDs are `LB-<nn><letter>`**: `LB-01`–`LB-04` the Passive, `LB-05`–`LB-10` the six Arms, `LB-11`–`LB-19`
the Arms Advance by level, `LB-20`–`LB-25` the Arts in the guide's order, `LB-26`–`LB-27` the boons.

---

## The Cloth of Arms (guide §5 ♎ Passive)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| LB-01a | Libra Passive | You are trained in martial weapons | effect:proficiency | `content/saint-class-features/cloths/libra-the-weapons.json` `MartialProficiency` *The Cloth of Arms* over `item:category:martial` | ☐ | |
| LB-01b | Libra Passive | and they advance with your unarmed proficiency automatically. | effect:proficiency | The same rule, `sameAs: unarmed` | ☐ | |
| LB-01c | Libra Passive | Cosmo Strike applies to Libra weapons — they are magical and gain \+1 damage per weapon damage die, exactly as your fists do. | effect:strike-damage · reach:weapon | Every Libra weapon carries `magical`; `libra-the-weapons.json` `FlatModifier` `@weapon.system.damage.dice` on `strike-damage` for `item:tag:libra-weapon` — **untyped**, where the fist's is circumstance | ☐ | |
| LB-02a | Libra Passive | Your Cloth holds six Arms, and every Arm is a matched pair — twelve weapons in total | effect:strikes-granted | `libra-the-weapons.json` grants the twelve items of `content/saint-class-features/libra-weapons/` | ☐ | |
| LB-02b | Libra Passive | Summoning or dismissing an Arm is a free action, and it always arrives as both weapons at once, one in each hand. | economy:granted-action · reach:weapon | `content/saint-class-features/actions/summon-an-arm.json`: free, a `choice` of the six Arms (or dismiss all) → `equip` → `scripts/libra.mjs` `equipArm` holds both halves and sets the other Arms down | ☐ | |
| LB-02c | Libra Passive | every Libra weapon has the twin trait | effect:trait-gained | `twin` on the ten weapons; `libra-the-weapons.json` `ItemAlteration` adds it to the Shields' integrated attack | ☐ | |
| LB-02d | Libra Passive | so the second Strike you make each turn with the other half of a matched pair adds a circumstance bonus to damage equal to its number of damage dice. | effect:strike-damage | pf2e's own `twin` trait | ☐ | |
| LB-03a | Libra Passive | Libra weapons can never be disarmed, sundered, or destroyed | reach:weapon · effect:resistance · effect:item-granted | Nothing | ☐ | |
| LB-03b | Libra Passive | and they accept weapon runes normally | effect:item-granted | pf2e's own rune slots on the weapons | ☐ | |
| LB-03c | Libra Passive | use the better of a granted tier and an etched rune; property runes always apply | effect:weapon-runes · effect:item-granted | The Advance's potency and striking `ItemAlteration` rules use `mode: upgrade`, so an etched rune above the tier stands | ☐ | |
| LB-04a | Libra Passive | While you are wielding a matched pair, you gain that Arm's Art | economy:requires · reach:weapon | `libra-the-weapons.json` grants all six Arts at 1st level whatever is held; only *The Turning Guard*'s parry is predicated on its Arm (`libra:arm:tonfa`) | ☐ | |
| LB-04b | Libra Passive | You gain the benefit of only one Arm's Art at a time (the Ascendant boon lifts this). | economy:requires | `equipArm` holds one pair at a time; the Arts themselves are not gated | ☐ | |

## The Six Arms (guide §5 ♎ table)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| LB-05 | Twin Swords | agile, finesse, magical, twin, versatile P | effect:strikes-granted | `libra-twin-sword-right.json` / `-left.json`: 1d8 slashing, sword group, these traits | ☐ | |
| LB-06 | Tridents | magical, reach, thrown 30 ft, twin, versatile S | effect:strikes-granted | `libra-trident-right.json` / `-left.json`: 1d10 piercing, spear group, `thrown-30` | ☐ | |
| LB-07 | Nunchaku | agile, backswing, finesse, magical, trip, twin | effect:strikes-granted | `libra-nunchaku-right.json` / `-left.json`: 1d6 bludgeoning, flail group | ☐ | |
| LB-08 | Shields | magical, shove, twin, versatile S | effect:strikes-granted · effect:shield | `libra-shield-right.json` / `-left.json`: shields with an integrated 1d6 bludgeoning attack; `shove`, `twin`, `versatile-s` added by the Cloth's `ItemAlteration` | ☐ | |
| LB-09 | Sanjiegun | disarm, magical, reach, sweep, trip, twin | effect:strikes-granted | `libra-sanjiegun-right.json` / `-left.json`: 1d8 bludgeoning, flail group | ☐ | |
| LB-10 | Tonfa | agile, finesse, magical, parry, twin | effect:strikes-granted | `libra-tonfa-right.json` / `-left.json`: 1d6 bludgeoning, club group | ☐ | |

## The Arms Advance (guide §5 ♎)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| LB-11 | Arms Advance 1st | magical, \+1 weapon potency, Cosmo Strike's \+1 per die, each Arm's Lesser Art | effect:weapon-runes · scaling:from-level | `libra-the-weapons.json` *The Arms Advance (potency)* `ItemAlteration` `runes-potency`, bracket 1–5 → 1; the Arts granted at 1st | ☐ | |
| LB-12 | Arms Advance 4th | striking (2 damage dice) | effect:weapon-runes · scaling:from-level | *The Arms Advance (striking)* `runes-striking`, bracket 4–9 → 1 | ☐ | |
| LB-13 | Arms Advance 6th | \+2 weapon potency | effect:weapon-runes · scaling:from-level | potency bracket 6–11 → 2 | ☐ | |
| LB-14 | Arms Advance 8th | each Arm's Greater Art | scaling:from-level | Each Art's Greater rule predicated `self:level ≥ 8` (or `libra:lent-tier:greater`); *The Whirling Circle (Greater)* granted from 8th | ☐ | |
| LB-15 | Arms Advance 10th | greater striking (3 damage dice) | effect:weapon-runes · scaling:from-level | striking bracket 10–15 → 2 | ☐ | |
| LB-16 | Arms Advance 12th | \+3 weapon potency | effect:weapon-runes · scaling:from-level | potency bracket 12+ → 3 | ☐ | |
| LB-17 | Arms Advance 14th | each Arm's Perfect Art | scaling:from-level | Each Art's Perfect rule predicated `self:level ≥ 14` (or `libra:lent-tier:perfect`) | ☐ | |
| LB-18 | Arms Advance 16th | major striking (4 damage dice) | effect:weapon-runes · scaling:from-level | striking bracket 16+ → 3 | ☐ | |
| LB-19a | Arms Advance 19th | a fifth damage die, past the game's cap | effect:weapon-runes · scaling:from-level | *Athena's Temper (a fifth die)* `ItemAlteration` `damage-dice-number` 5, `self:level ≥ 19` | ☐ | |
| LB-19b | Arms Advance 19th | and one property rune of your choice on each Arm, re-chosen each morning | effect:weapon-runes · check:caster-choice · ending:preparations · scaling:from-level | `content/saint-class-features/actions/athenas-temper.json` (from 19th): free, frequency once per 24 hours, a `choice` of property runes → `Effect: Athena's Temper` (`AdjustStrike`, 1 day) | ☐ | |

## The Arts (guide §5 ♎)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| LB-20a | The Crossing | ✦ free action, once per turn. Trigger You hit the same creature with both Twin Swords this turn. | economy:granted-action · economy:once-per-round · when:strike-made | `content/saint-class-features/libra-arts/the-crossing.json`: free, frequency 1/round. The two hits are not checked | ☐ | |
| LB-20b | The Crossing | The target takes persistent bleed equal to your weapons' number of damage dice in d6s (2d6 at striking, 5d6 at Athena's Temper) | effect:persistent | `the-crossing.json` `persistent-damage` bleed `origin.libra.bleed` — `scripts/libra.mjs` `crossingBleed`, the Arm's dice in d6s | ☐ | |
| LB-20c | The Crossing | and is off-guard until the end of your next turn. | effect:condition · ending:next-turn | `the-crossing.json` off-guard for 1 round, expiring at a turn's end | ☐ | |
| LB-20d | The Crossing Greater | Greater (8th) The Twin Swords also gain deadly d8. | effect:trait-gained · scaling:from-level | `the-crossing.json` `ItemAlteration` on the Twin Swords, `self:level ≥ 8` or lent Greater | ☐ | |
| LB-20e | The Crossing Perfect | Perfect (14th) The deadly die becomes d10 | effect:trait-gained · scaling:from-level | `the-crossing.json` `ItemAlteration`, `self:level ≥ 14` or lent Perfect | ☐ | |
| LB-20f | The Crossing Perfect | the bleed dice become d8s | effect:persistent · scaling:from-rank | `scripts/libra.mjs` `crossingBleed` uses d8 from the Saint's 14th level — not for an ally holding a lent Perfect Arm | ☐ | |
| LB-20g | The Crossing Perfect | and a creature bleeding from The Crossing receives only half the Hit Points from any healing. | effect:heal-blocked | `the-crossing.json` (Perfect) adds `Effect: Bleeding from The Crossing`; `scripts/libra.mjs` `halveHealing` takes half of each heal back after it lands and says so in chat | ☐ | |
| LB-21a | Setting the Tide | ⤾ reaction, once per round. Trigger A creature within your reach uses a move action, or leaves a square within your reach. | economy:reaction · economy:once-per-round · when:on-moving | `content/saint-class-features/libra-arts/setting-the-tide.json`: reaction, frequency 1/round. The movement is not detected | ☐ | |
| LB-21b | Setting the Tide | Effect Strike it with a trident. | check:attack · reach:weapon · effect:strikes-made | `setting-the-tide.json` `strikes` rider: one Strike with `libra-trident-right` at one enemy within 10 feet | ☐ | |
| LB-21c | Setting the Tide | On a hit its movement immediately ends | effect:gm-note | An `onHit` prompt | ☐ | |
| LB-21d | Setting the Tide | on a critical hit it is also pushed 10 feet and knocked prone. | effect:forced-move/push · effect:condition | `onHit` on a critical success: a 10-foot `teleport` away and prone | ☐ | |
| LB-21e | Setting the Tide Greater | Greater (8th) Your reach with the Tridents becomes 15 feet | reach:weapon · scaling:from-level | `setting-the-tide.json` `ItemAlteration` `reach-15` on the Tridents, and the area's range +5 at 8th | ☐ | |
| LB-21f | Setting the Tide Greater | and the Art also triggers on a manipulate action; on a critical hit, that action is disrupted. | effect:gm-note · scaling:from-rank | A critical-hit prompt from 8th (or lent Greater) | ☐ | |
| LB-21g | Setting the Tide Perfect | Perfect (14th) You gain one additional reaction each round, usable only for Setting the Tide. | economy:reaction · scaling:from-level · economy:extra-action | `setting-the-tide.json` `ItemAlteration` raises its own frequency to 2 at 14th | ☐ | |
| LB-22a | Rebound Rhythm | ✦ free action, once per turn. Trigger You hit a creature with a Nunchaku Strike. | economy:granted-action · economy:once-per-round · when:strike-made | `content/saint-class-features/libra-arts/rebound-rhythm.json`: free, frequency 1/round. The hit is not checked | ☐ | |
| LB-22b | Rebound Rhythm | Make a Strike with the other Nunchaku against that creature or one adjacent to it. | check:attack · reach:weapon · effect:strikes-made | `rebound-rhythm.json` `strikes` rider: one Strike with `libra-nunchaku-left` at one enemy within 10 feet | ☐ | |
| LB-22c | Rebound Rhythm | This Strike is made at your current multiple attack penalty and increases it normally | economy:attack-penalty | `mapIndex` base 1 — a fixed second-attack penalty, not the *current* one | ☐ | |
| LB-22d | Rebound Rhythm | and it always receives the twin bonus. | effect:strike-damage | pf2e's `twin`, which needs the other Nunchaku to have struck first this turn | ☐ | |
| LB-22e | Rebound Rhythm Greater | Greater (8th) The free Strike no longer increases your multiple attack penalty (it still counts toward it afterward). | economy:attack-penalty · scaling:from-level | `mapIndex` 0 from 8th; nothing records the count afterward | ☐ | |
| LB-22f | Rebound Rhythm Perfect | Perfect (14th) The Art also triggers on a miss. | when:strike-made · scaling:from-level | Nothing distinguishes: the trigger is never checked, at any tier | ☐ | |
| LB-23a | The Twin Bulwark | While wielding both Shields you may Raise a Shield as a free action once per round | effect:shield · economy:granted-action · economy:once-per-round · economy:action-cost | `content/saint-class-features/libra-arts/the-twin-bulwark.json`: free, frequency 1/round, applies pf2e's Raised Shield effect to the Saint | ☐ | |
| LB-23b | The Twin Bulwark | and you can Shield Block as a reaction even without the feat. | effect:shield · economy:reaction | `the-twin-bulwark.json` `GrantItem` of pf2e's Shield Block | ☐ | |
| LB-23c | The Twin Bulwark | Each Shield has Hardness equal to your level, HP equal to 8 × your level, and BT half that | effect:shield · scaling:from-level | `the-twin-bulwark.json` `ItemAlteration` Hardness `@actor.level` and HP `8 × level` on the Shields; `restoreShields` tops the current HP up on a level change | ☐ | |
| LB-23d | The Twin Bulwark | a Shield reduced to 0 HP is not destroyed but returns to the Cloth and can be re-summoned after 1 minute. | effect:shield | `scripts/libra.mjs` `equipArm` → `restoreShields` re-forms a Shield whenever an Arm is summoned — with no minute's wait | ☐ | |
| LB-23e | The Twin Bulwark Greater | Greater (8th) You may Shield Block twice per round (the second use costs no reaction), and may use it for an adjacent ally. | effect:shield · effect:intercept · scaling:from-level | Nothing | ☐ | |
| LB-23f | The Twin Bulwark Perfect | Perfect (14th) You may Shield Block for any ally within 15 feet | effect:intercept · scaling:from-level | Nothing | ☐ | |
| LB-23g | The Twin Bulwark Perfect | and whenever a Block reduces the damage to 0 the attacker takes your Shield's damage dice in bludgeoning. | reach:attacker · effect:damage | `content/saint-class-features/libra-arts/the-twin-bulwark-riposte.json` (from 14th or lent Perfect): a free action used by hand, `origin.libra.dice` d6 bludgeoning at one enemy | ☐ | |
| LB-24a | The Whirling Circle | ✦✦✦ activity, once per round. Make one Sanjiegun Strike against each enemy within your reach. | reach:area/emanation · reach:enemies · check:attack · effect:strikes-made | `content/saint-class-features/libra-arts/the-whirling-circle.json`: 3 actions, frequency 1/round, a 10-foot emanation of enemies, a `strikes` rider with `libra-sanjiegun-right` at each | ☐ | |
| LB-24b | The Whirling Circle | Each attack counts toward your multiple attack penalty, but the penalty doesn't increase until you have made all of them. | economy:attack-penalty | Every Strike rolls at no penalty; nothing writes the count afterward | ☐ | |
| LB-24c | The Whirling Circle Greater | Greater (8th) The activity costs ✦✦ instead, and your reach during the whirl increases by 5 feet. | reach:area/emanation · scaling:from-level | `the-whirling-circle-greater.json` replaces it from 8th: 2 actions, a 15-foot emanation | ☐ | |
| LB-24d | The Whirling Circle Perfect | Perfect (14th) Every creature you hit must attempt a Reflex save against your Cosmo DC or be knocked prone | check:attack-then-save · effect:condition · scaling:from-level · check:class-dc | `onHit` on a success from 14th: a Reflex save at the Cosmo DC, prone on a failure | ☐ | |
| LB-24e | The Whirling Circle Perfect | those you critically hit fall prone with no save. | effect:condition · scaling:from-rank | `onHit` on a critical success from 14th: prone | ☐ | |
| LB-25a | The Turning Guard | While wielding both Tonfa you gain the parry bonus (\+1 circumstance to AC) with no action spent. | effect:bonus · economy:requires · economy:action-cost | `content/saint-class-features/libra-arts/the-turning-guard.json` `FlatModifier` +1 circumstance AC predicated `libra:arm:tonfa` — the Tonfa's own roll option, present whether or not they are held | ☐ | |
| LB-25b | The Turning Guard | ⤾ reaction, once per round: Trigger A melee attack against you critically fails. | economy:reaction · economy:once-per-round · when:strike-received | `the-turning-guard.json`: reaction, frequency 1/round. The critical failure is not detected | ☐ | |
| LB-25c | The Turning Guard | Effect Strike the attacker with a Tonfa; this Strike does not increase your multiple attack penalty. | check:attack · reach:attacker · economy:attack-penalty · effect:strikes-made | `the-turning-guard.json` `strikes` rider: one Strike with `libra-tonfa-right`, at no penalty, at one enemy within 10 feet | ☐ | |
| LB-25d | The Turning Guard Greater | Greater (8th) The reaction triggers on any miss | when:strike-received · scaling:from-level | Nothing distinguishes: the trigger is never checked | ☐ | |
| LB-25e | The Turning Guard Greater | and the parry bonus becomes \+2 and also applies to Reflex saves. | effect:bonus · scaling:from-rank | `the-turning-guard.json` `FlatModifier` +2 circumstance on AC and Reflex from 8th (or lent Greater) | ☐ | |
| LB-25f | The Turning Guard Perfect | Perfect (14th) You gain one additional reaction each round, usable only for The Turning Guard. | economy:reaction · scaling:from-level · economy:extra-action | `the-turning-guard.json` `ItemAlteration` raises its own frequency to 2 at 14th | ☐ | |

## Boons (guide §5 ♎)

| ID | Guide | Clause | Patterns | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| LB-26a | Libra Ascendant | You may wield one weapon from each of two different Arms at once and gain both their Arts | reach:weapon · economy:requires | `scripts/libra.mjs` `equipArm` under `sky:ascendant`: one half of the Arm called and one half of one Arm already held | ☐ | |
| LB-26b | Libra Ascendant | the two count as a matched pair for the twin trait. | effect:strike-damage | Nothing: pf2e's `twin` looks for the same weapon | ☐ | |
| LB-26c | Libra Ascendant | Your Arms Advance counts as one tier higher in both potency and striking (maximum \+4 and five damage dice). | effect:weapon-runes · scaling:counts-higher | `content/saint-effects/sky-ascendant/sky-ascendant-libra.json` two `ItemAlteration` rules on `item:tag:libra-weapon` | ☐ | |
| LB-26d | Libra Ascendant | \+2 status bonus to all saves | effect:bonus | `sky-ascendant-libra.json` `FlatModifier` +2 status on `saving-throw` | ☐ | |
| LB-26e | Libra Ascendant | the first natural 1 you roll each hour counts as a 10 | when:check-rolled · check:die-replaced | `libra-the-weapons.json` `balance` flag predicated `sky:ascendant`, spending the Cloth's 1/hour frequency; `scripts/roll-rewrites/balance.mjs` rewrites the landed die and relabels the degree | ☐ | |
| LB-27a | Libra Zenith | as Ascendant, except you wield all six Arms at once — the Cloth holds what your hands cannot — gaining every Art simultaneously. | reach:weapon | `equipArm` under `sky:zenith` holds every Arm called and sets nothing down | ☐ | |
| LB-27b | Libra Zenith | In addition, Rozan Hyaku Ryū Ha once per round ✦✦✦: 60-ft line, 12d10, basic Reflex | reach:area/line · check:basic-save · effect:damage · economy:once-per-round | `content/saint-class-features/actions/rozan-hyaku-ry-ha.json`: 3 actions, frequency 1/round, a 60-foot line, a Reflex save whose riders deal 12d10 only on a failure or critical failure — **no half on a success and no double on a critical failure**, so not a basic save as authored | ☐ | |
| LB-27c | Libra Zenith | critical failure \= prone and stunned 2 | check:save · effect:condition | `rozan-hyaku-ry-ha.json` prone and stunned 2 on a critical failure | ☐ | |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 74 |
| ✅ | 0 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **74** |

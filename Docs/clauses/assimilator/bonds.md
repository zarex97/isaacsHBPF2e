# Clauses — the thirty Bonds

*Bond tracker. Every named Bond's effect, one row per independently-failable sentence. Source:
`Docs/homebrewing/carapace-material-lexicon-v3.md` §14.1.*

**Tier:** Bonds · **Tracker issue:** #95

## How a row is marked

| Mark | Meaning |
| :-- | :-- |
| ☐ | Not yet driven |
| ✅ | Driven live; the clause happened by itself |
| ⚠️ | Driven live; partially happens — the gap is named in **Evidence** |
| ❌ | Driven live; does not happen |
| 🔧 | Was ❌ or ⚠️, a fix has landed, awaiting re-drive |
| — | Nothing to automate (pure roleplaying / GM ruling) |

**Clause** is a verbatim fragment of the lexicon (`Docs/homebrewing/carapace-material-lexicon-v3.md`). `build/check-clauses.mjs` asserts it still is one, so a
paraphrase here or an edit to the source fails the build. **Static check** names the assertion that
guards it; **Evidence** names what proved it happened at the table.

*How a clause is driven — the rig, the traps it sets and what a ✅ owes — is
`Docs/tools/live-verification.md`. It is the one copy; this file records results, not method.*

*How they are built (Phase 5).* The engine decides which slotted Bonds are in force — both Substrates at 2+, or Electrum standing in — and writes one roll option each, `assimilator:bond:<slug>`. Sheet effects are rules on the Bond keyed off it; event effects are `scripts/assimilator/bonds.mjs`, keyed off the same option.

*The Bonds' own shape.* A Bond is gated on **two** Substrates at Depth 2 or higher and on a Bond slot,
so every row here owes three drives, not one: the effect arrives when both are deep enough and the Bond is
slotted, it is **suppressed** the moment either drops below Depth 2, and it comes back when the Substrate is
fed again. The slot rules themselves — how many, when, and changing one at daily preparations — are the
class tracker's (`A-47`–`A-50`).

**IDs are `B-<nn><letter>`**, numbered in the lexicon's order. The Guide column names the pair.

---

## The named Bonds (lexicon §14.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| B-01 | Molten Carapace (Ruby + Iron) | Your Carapace's Hardness increases by 5, and a creature that hits you with a melee unarmed or reach attack takes fire damage equal to half your level. | `rig`, `test-assimilator` | ✅ | The sweep (`B-all`) drove all thirty in force at Depth 2, suppressed with either at 1, and back when fed. Rig, live: a melee unarmed Claw hit the Assimilator and the attacker took **8** fire (half of level 17); Hardness +5 on the Living Plate. The retaliation now keys off the engine's Bond option |
| B-02a | Conduction (Ruby + Copper) | Your fire damage counts as **fire and electricity**, using whichever resistance is lower. | `rig` | ✅ | Rig, live: 10 fire against fire resistance 10 took **10** (electricity's 0 is lower); with electricity 5, **5** |
| B-02b | Conduction (Ruby + Copper) | Creatures in metal armour take +2 per damage die from it. | `rig` | ✅ | Rig, live: one fire die against a creature in **chain mail** took **3** instead of 1. The +2 lands after resistances; metal armour is chain, plate or composite |
| B-03a | Solar Core (Ruby + Gold) | Once per encounter as a two-action activity, ignite: for 1 minute your fire damage increases by one die size and you shed bright light 60 feet. | `rig` | ✅ | Rig, live, in an encounter: *Ignite the Solar Core* (granted by the Bond) lit the Assimilator (bright **60**), Ruby's d4 became **1d6 fire**, and a second ignition that encounter was **refused** |
| B-03b | Solar Core (Ruby + Gold) | You take 1d6 fire at the start of each of your turns. | `rig` | ✅ | Rig, live: at the start of its turn the ignited Assimilator took **1d6 fire** ("burns for 1") |
| B-04 | Living Flame (Ruby + Emerald) | While you are taking persistent fire damage, or dealing it to anyone, your fast healing increases by 5. | `rig` | ✅ | Rig, live: fast healing **2** (Emerald) became **2 + 5** while its persistent fire burned the target, and back to **2** when it ended. Taking persistent fire itself sets the same option; not driven separately |
| B-05a | Blackfire (Ruby + Onyx) | Your fire damage becomes **void and fire**, and sheds *darkness* rather than light. | `rig` | ✅ | Rig, live: 10 fire against fire resistance 10 took **10** (void's 0 is lower); the token's light is **darkness** in place of Ruby's |
| B-05b | Blackfire (Ruby + Onyx) | When it kills a creature, you regain Hit Points equal to your level. | `rig` | ✅ | Rig, live: a fire kill healed the Assimilator **17** (its level) |
| B-06 | Exsanguinary (Garnet + Jet) | Persistent bleed you inflict also heals you for the same amount each time it ticks. | `rig` | ✅ | Rig, live: the target's bleed, stamped as the Assimilator's, ticked and healed it **exactly what it dealt**. pf2e does not record who inflicted persistent damage, so the module stamps it when it lands |
| B-07 | Second Heart (Garnet + Emerald) | Once per day, when you would die, you don't — you drop to 1 Hit Point and are stunned 1 as the second heart takes over. | `rig` | ✅ | Rig, live: dying 4 left the Assimilator at **1** Hit Point, **stunned**, not dying; once a day |
| B-08 | Siege Frame (Iron + Steel) | You ignore an object's Hardness up to 10, and forced movement you cause increases by an additional 10 feet. | `rig` | ✅ | Rig, live: a hazard with Hardness 15 took **15** of 20 (Hardness ignored up to 10). Through the Push card after a real Shove, Siege Frame's creature travelled **20 feet** on a critical success (15 on a success) — the Shove's 10 (5) and **10 more**; without the Bond, the Shove's own (#85, Q6) |
| B-09 | Lightning Lash (Copper + Cobalt) | Your ranged Arcane Channel Strike conducts: it chains to a second creature within 15 feet of the first for half damage. | `rig` | ✅ | Rig, live: 10 from the Arcane Channel — the creature beside the target took **5** |
| B-10a | Crowned Fortune (Topaz + Citrine) | Once per encounter, declare a Strike **imperial** before rolling. | `rig` | ✅ | Rig, live, in an encounter: *Imperial Strike* (granted) declared it; a second declaration that encounter was **refused** |
| B-10b | Crowned Fortune (Topaz + Citrine) | On a success it counts as a critical success. | `rig` | ✅ | Rig, live: an unadjusted **success** came out a **critical success**, and the declaration was spent |
| B-11 | Transmutation (Gold + Electrum) | Gilded Core may name a Substrate of your **second** Instinct, and Alloyed Instinct's half-value clause becomes three-quarters (round up). | `rig`, `test-assimilator` | ✅ | Rig, live: Gold primary, Red as Electrum's second clause — scale **0.75**, Ruby 4 gives **3** (three-quarters, rounded up). The first half needs nothing: Gilded Core already names any other bound Substrate, of either Instinct |
| B-12 | Chimera (Electrum + Nickel) | You hold one additional Aberration, and it may be drawn from the Depth-4 rider list of **either** of your Instincts. | `rig` | ✅ | Rig, live: Nickel 2 holds **three** Aberrations (two + one). **Ruled (#95, lexicon v3.4):** the Depth-4 rider list is Nickel Depth 4's "instead" — the extra Aberration may instead be a bound Substrate of either Instinct's colour counting as Depth 4, chosen in the Gullet. Live: with the Red Instinct, **Ruby 3 counts as 4** and **two** Aberrations are held. Control: Electrum (Gold, not an Instinct's colour) raises nothing and three are held. Not on a broken plate |
| B-13 | Quicksilver Gait (Carnelian + Mercury) | You may Stride through creatures' spaces as though they were difficult terrain, and cannot be caught flat-footed by movement-triggered reactions. |  | — | Nothing to automate: Foundry does not stop a token moving through a creature's space, and whether a movement-triggered reaction catches you off-guard is the table's |
| B-14 | Storm Battery (Amber + Cobalt) | Your Reservoir stores charges from your **own** ranged Strikes, and spending 3 charges lets Arcane Channel target every creature in a 15-foot cone. | `rig` | ✅ | Rig, live: its own Arcane Channel Strike stored **1 charge of cold**; *Storm Channel* is granted. Driven by hand through the extension (#95): with **3 charges**, the 15-foot cone aimed with the real pointer made **one Arcane Channel Strike against each** of the two creatures in it, and the Reservoir went **3 to 0**. Control: with **1 charge** the same cone made **no Strike**, kept the charge, and said *Discharge needs 3 charges*. The page ran at 80% zoom, so the pointer was aimed from the canvas's own transform |
| B-15 | Hammerform (Bronze + Iron) | Your unarmed Strikes gain the **fatal d10** trait when you have Stridden at least 10 feet this turn. | `rig` | ✅ | Rig, live: the Carapace Strike has **fatal d10** after a 10-foot Stride and not without |
| B-16 | Cold Reading (Sapphire + Lapis Lazuli) | Your Studied creature is also **slowed 1** the first time you damage it each round, with no save. | `rig` | ✅ | Rig, live: damaging the Studied target left it **slowed 1**; a second hit that round did not again |
| B-17 | Rime Flow (Sapphire + Mercury) | Your Liquid Form damage reduction also freezes the attacker: it takes cold damage equal to the amount reduced. | `rig` | ✅ | Rig, live: Pass Through turned **15** of 20 (Mercury's own resistance took 5 first) and the attacker took **15 cold** |
| B-18 | Blind Hunter (Tin + Onyx) | Inside your own magical darkness, your tremorsense becomes **precise** and enemies within it are off-guard to you. | `rig` | ✅ | Rig, live: under Shadow Mantle — **precise tremorsense 30**, and the target 5 feet away was marked and **off-guard** (DC −2). **Fixed while driving:** pf2e has no distance option when it gathers ephemeral effects, so "within it" is an Aura on the darkness that marks the enemies inside |
| B-19 | Mindstorm (Amethyst + Quartz) | A creature that fails a save against one of your Mutations is **stupefied 1** and its next spell requires a DC 5 flat check. | `rig` | ✅ | Rig, live: failing Amethyst's save left the target with *Mindstorm* and **stupefied 1**. The creature's next spell rolls the **DC 5 flat check** on its card (#95) and a failure says the spell is disrupted; the second spell rolls **none**, the Note is spent, and stupefied 1 stays. **Ruling:** the clause gives no duration, so it lasts until the end of the creature's next turn |
| B-20 | Ascension (Platinum + Aluminium) | Your fly Speed increases by 20 feet and you may hover. | `rig` | — | Rig, live: fly Speed **+20**. Hovering: nothing to enforce, since pf2e does not make a flier fall for not spending an action to Fly (#95, Q3) |
| B-21 | Runaway Growth (Nickel + Emerald) | Your Aberrations re-roll automatically whenever you drop below half Hit Points, and doing so restores Hit Points equal to twice your level. | `rig` | ✅ | Rig, live: dropping below half re-rolled the Aberrations and gave back **34** (twice level 17) |
| B-22 | Chitin Bloom (Emerald + Chromium) | Your fast healing also repairs your Carapace, and your Hardness increases by your fast healing value. | `rig` | ✅ | Rig, live, in an encounter: fast healing 2 — Hardness **+2**, and the plate knit **2** at the start of its turn |
| B-23 | Immune System (Jade + Zinc) | Shifting Tissue may name **poison, disease or a single spell school** as well as an energy type. | `rig` | ✅ | Rig, live: the Gullet offers **poison** and Zinc 2 resists it **5**. **Ruled (#95, lexicon v3.4):** disease is **+2 circumstance to saves against disease** (live: +2 on a disease save, none on another, and Zinc adds no resistance); a spell school is one **tradition** (live: arcane named, **resistance 5 to arcane**). All four traditions and disease are offered |
| B-24 | Null Shroud (Onyx + Lead) | Your magical darkness suppresses magical effects inside it (counteract rank = half your level) and cannot itself be counteracted below 6th rank. | `rig` | ✅ | Rig, live: Shadow Mantle puts its darkness on (*Effect: Shadow Mantle*) and posts the **counteract** card for the magic inside. Under Null Shroud the darkness carries a **counteract floor of 6** (#95): a rank-5 counteract is refused **without a roll**, and a rank-9 one rolls. Control: without Null Shroud, no floor, and the rank-5 counteract rolls. Every module counteract goes through the one floor check; pf2e's own Dispel Magic automates nothing and stays the table's |
| B-25 | Rot (Jet + Manganese) | Persistent acid you inflict also reduces the target's resistances by an additional 5 while it lasts. | `rig` | ✅ | Rig, live: while its persistent acid burned the target, someone else's 10 fire against resistance 10 took **5** |
| B-26 | Adamant Shell (Diamond + Steel) | Your Hardness bonuses stack fully rather than taking the higher, and you cannot be **off-guard** from flanking. | `rig`, `test-assimilator` | ✅ | Rig, live: `flanking.offGuardable` is **false**, and Diamond's +5 and Steel's +5 Hardness **stack** to 10 |
| B-27 | Cleansing Light (Pearl + Magnesium) | Your Flare Core also ends one condition of value 1 on every ally inside the emanation. | `rig` | ✅ | Rig, live: the ally in the Flare lost **frightened 1**. With several value-1 conditions the card offers each |
| B-28 | Living Armour (Hematite + Moonstone) | Reactive Evolution triggers off damage taken by an **ally** within 15 feet as well as yourself. | `rig` | ✅ | Rig, live: an ally 10 feet away took fire and the owner was offered **Reactive Evolution**; the reaction is still the player's to take |
| B-29 | Reaper's Edge (Silver + Jet) | Your void damage ignores the resistances and immunities of incorporeal undead entirely. | `rig` | ✅ | Rig, live: 10 void into an incorporeal undead with void immunity and resistance 10 took **10**. **Fixed while driving:** undead have pf2e's void healing, which keeps void out entirely; it is lifted for this Bond's blow |
| B-30 | Impossible Body (Diamond + Mercury) | You are simultaneously rigid and fluid: keep your Hardness while amorphous, and Liquid Form's reaction has no per-round limit. | `rig` | ✅ | Rig, live: Pass Through's limit is **99** a round. Amorphous never removes Hardness here, so it is already kept |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 32 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 2 |
| **Total** | **34** |

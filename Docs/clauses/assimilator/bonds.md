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

*Nothing is implemented yet.* Every row starts ☐, and the Assimilator is being built against these
rows rather than checked after the fact — a clause is done when it is ✅, not when its JSON exists.

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
| B-01 | Molten Carapace (Ruby + Iron) | Your Carapace's Hardness increases by 5, and a creature that hits you with a melee unarmed or reach attack takes fire damage equal to half your level. |  | ☐ |  |
| B-02a | Conduction (Ruby + Copper) | Your fire damage counts as **fire and electricity**, using whichever resistance is lower. |  | ☐ |  |
| B-02b | Conduction (Ruby + Copper) | Creatures in metal armour take +2 per damage die from it. |  | ☐ |  |
| B-03a | Solar Core (Ruby + Gold) | Once per encounter as a two-action activity, ignite: for 1 minute your fire damage increases by one die size and you shed bright light 60 feet. |  | ☐ |  |
| B-03b | Solar Core (Ruby + Gold) | You take 1d6 fire at the start of each of your turns. |  | ☐ |  |
| B-04 | Living Flame (Ruby + Emerald) | While you are taking persistent fire damage, or dealing it to anyone, your fast healing increases by 5. |  | ☐ |  |
| B-05a | Blackfire (Ruby + Onyx) | Your fire damage becomes **void and fire**, and sheds *darkness* rather than light. |  | ☐ |  |
| B-05b | Blackfire (Ruby + Onyx) | When it kills a creature, you regain Hit Points equal to your level. |  | ☐ |  |
| B-06 | Exsanguinary (Garnet + Jet) | Persistent bleed you inflict also heals you for the same amount each time it ticks. |  | ☐ |  |
| B-07 | Second Heart (Garnet + Emerald) | Once per day, when you would die, you don't — you drop to 1 Hit Point and are stunned 1 as the second heart takes over. |  | ☐ |  |
| B-08 | Siege Frame (Iron + Steel) | You ignore an object's Hardness up to 10, and forced movement you cause increases by an additional 10 feet. |  | ☐ |  |
| B-09 | Lightning Lash (Copper + Cobalt) | Your ranged Arcane Channel Strike conducts: it chains to a second creature within 15 feet of the first for half damage. |  | ☐ |  |
| B-10a | Crowned Fortune (Topaz + Citrine) | Once per encounter, declare a Strike **imperial** before rolling. |  | ☐ |  |
| B-10b | Crowned Fortune (Topaz + Citrine) | On a success it counts as a critical success. |  | ☐ |  |
| B-11 | Transmutation (Gold + Electrum) | Gilded Core may name a Substrate of your **second** Instinct, and Alloyed Instinct's half-value clause becomes three-quarters (round up). |  | ☐ |  |
| B-12 | Chimera (Electrum + Nickel) | You hold one additional Aberration, and it may be drawn from the Depth-4 rider list of **either** of your Instincts. |  | ☐ |  |
| B-13 | Quicksilver Gait (Carnelian + Mercury) | You may Stride through creatures' spaces as though they were difficult terrain, and cannot be caught flat-footed by movement-triggered reactions. |  | ☐ |  |
| B-14 | Storm Battery (Amber + Cobalt) | Your Reservoir stores charges from your **own** ranged Strikes, and spending 3 charges lets Arcane Channel target every creature in a 15-foot cone. |  | ☐ |  |
| B-15 | Hammerform (Bronze + Iron) | Your unarmed Strikes gain the **fatal d10** trait when you have Stridden at least 10 feet this turn. |  | ☐ |  |
| B-16 | Cold Reading (Sapphire + Lapis Lazuli) | Your Studied creature is also **slowed 1** the first time you damage it each round, with no save. |  | ☐ |  |
| B-17 | Rime Flow (Sapphire + Mercury) | Your Liquid Form damage reduction also freezes the attacker: it takes cold damage equal to the amount reduced. |  | ☐ |  |
| B-18 | Blind Hunter (Tin + Onyx) | Inside your own magical darkness, your tremorsense becomes **precise** and enemies within it are off-guard to you. |  | ☐ |  |
| B-19 | Mindstorm (Amethyst + Quartz) | A creature that fails a save against one of your Mutations is **stupefied 1** and its next spell requires a DC 5 flat check. |  | ☐ |  |
| B-20 | Ascension (Platinum + Aluminium) | Your fly Speed increases by 20 feet and you may hover. |  | ☐ |  |
| B-21 | Runaway Growth (Nickel + Emerald) | Your Aberrations re-roll automatically whenever you drop below half Hit Points, and doing so restores Hit Points equal to twice your level. |  | ☐ |  |
| B-22 | Chitin Bloom (Emerald + Chromium) | Your fast healing also repairs your Carapace, and your Hardness increases by your fast healing value. |  | ☐ |  |
| B-23 | Immune System (Jade + Zinc) | Shifting Tissue may name **poison, disease or a single spell school** as well as an energy type. |  | ☐ |  |
| B-24 | Null Shroud (Onyx + Lead) | Your magical darkness suppresses magical effects inside it (counteract rank = half your level) and cannot itself be counteracted below 6th rank. |  | ☐ |  |
| B-25 | Rot (Jet + Manganese) | Persistent acid you inflict also reduces the target's resistances by an additional 5 while it lasts. |  | ☐ |  |
| B-26 | Adamant Shell (Diamond + Steel) | Your Hardness bonuses stack fully rather than taking the higher, and you cannot be **off-guard** from flanking. |  | ☐ |  |
| B-27 | Cleansing Light (Pearl + Magnesium) | Your Flare Core also ends one condition of value 1 on every ally inside the emanation. |  | ☐ |  |
| B-28 | Living Armour (Hematite + Moonstone) | Reactive Evolution triggers off damage taken by an **ally** within 15 feet as well as yourself. |  | ☐ |  |
| B-29 | Reaper's Edge (Silver + Jet) | Your void damage ignores the resistances and immunities of incorporeal undead entirely. |  | ☐ |  |
| B-30 | Impossible Body (Diamond + Mercury) | You are simultaneously rigid and fluid: keep your Hardness while amorphous, and Liquid Form's reaction has no per-round limit. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 34 |
| ✅ | 0 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **34** |

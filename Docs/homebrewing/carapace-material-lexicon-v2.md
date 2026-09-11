# The Carapace — Material Lexicon, **Version 2**

### *The symbiont class · the Nine Veins · seventy-two materials that exist only for this class*

*Step one of the new class: the complete colour-coded list of **metals** and **gems** the symbiont
feeds on. Nine colours, four tiers, **two separate slot tracks** — thirty-six metals and thirty-six
gems, none of which exist anywhere else in Pathfinder.*

**What changed from v1.** v1 sorted PF2e's *existing* precious materials and gemstones into nine
colours. That's out. Everything in this document is **new and exclusive to the Carapace** — adamantine,
djezet, orichalcum, rubies and sapphires are untouched and keep doing exactly what the core books say
they do. v1 also had one undifferentiated pool of slots; v2 splits the build into a **metal track** and
a **gem track** that do genuinely different jobs.

**What is still anchored to system data.** The *numbers* are, even though the materials aren't:
item-level and Price bands sampled from `packs/pf2e/equipment` (275 level-1 items, 278 level-10 items,
etc.), the damage-type list from `src/scripts/config/damage.ts`, and the property-rune curve for every
damage rider. Nothing here invents a new number shape — only new things to hang the numbers on.

> **Working title.** The class is **the Carapace**, and so is the symbiont — the Saint's *"the Cloth"*
> convention. Alternates on the table: **the Reliquary**, **the Hoard**, **the Lode**, **the Gild**.
> Renaming is free now and expensive later.

---

## 1 — Where these come from

Something enormous and mineral died in the deep places of the world, a long time before anyone was
counting. It did not rot. It **separated**. What had been its blood ran down into the stone and cooled
into metal; what had been its senses hardened and became gem. There are nine kinds of each, because
there were nine things it had been able to feel.

Smiths hate this stuff. It fouls a crucible, it eats tools, it won't hold an edge or take a rune, and an
assayer who finds it in an otherwise good seam writes the seam off. It has no market, no price list,
and no legitimate use.

Your Carapace disagrees. These are the **Nine Veins**, and they are the only thing it will eat.

**Why this framing matters mechanically.** The Veins sit outside the economy on purpose. They aren't
shop inventory, they can't be Crafted by anyone who isn't already a Carapace, and their nominal Prices
in §4 are for GMs who want a black market — not a default. A Carapace's power should come from what
the *campaign* put in front of them, which makes the class's progression a GM-facing adventure lever
instead of a shopping trip. §4.3 makes sure that never becomes a trap.

---

## 2 — Reading the names

The names aren't arbitrary — the tier is in the word, and that's deliberate, so a player can read a
treasure list without a lookup table.

| Tier | Metals end in | Gems end in | What it is |
| :-: | :-- | :-- | :-- |
| **I** | **‑slag** | **‑glass** | Raw, crumbling, impure. Scraped off something else. |
| **II** | **‑ore** | **‑tear** | Refined enough to be a lump. A single clean drop. |
| **III** | **‑iron, ‑steel, ‑brass, ‑silver** | **‑lith** | Properly worked. A cut stone. |
| **IV** | **‑heart** | **‑star** | The centre of the vein. There is not much of it. |

Each colour has **four roots**, one per tier, and each root produces both the metal and the gem of that
tier. *Cinderslag* and *Cinderglass* came out of the same hole.

---

## 3 — Two tracks: the Frame and the Facets

This is the change you asked for, and it's load-bearing.

### 3.1 What each track does

| | **Metals — the Frame** | **Gems — the Facets** |
| :-- | :-- | :-- |
| **What it is** | The body of the Carapace. Plate, spine, weight. | The eyes of the Carapace. Set into the plate, lit from behind. |
| **What it governs** | **Defence and physicality** — resistance, Hardness, Speed, Bulk, saves, senses | **Offence and effects** — damage type, damage dice, riders, conditions, actives |
| **Feel** | Slow. What you *are*. | Bright. What you *do*. |

A metal never gives you a damage type. A gem never gives you Hardness. Keeping the two tracks
mechanically disjoint is what stops "more slots" from just meaning "more of the same".

### 3.2 Slots

Separate, and they do not interchange.

| Level | 1 | 3 | 5 | 8 | 11 | 14 | 17 | 20 |
| :-- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **Frame slots** (metal) | 1 | 1 | 2 | 2 | 3 | 3 | 4 | 4 |
| **Facet slots** (gem) | 1 | 2 | 2 | 3 | 3 | 4 | 4 | 5 |
| **Total** | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |

Gems outnumber metals at every level past 1st. That's on purpose: the gem track is where variety and
per-encounter texture live, and the metal track is a small number of heavy, defining commitments.

**Feeding** is a 10-minute activity; the material is **consumed** and fills a slot of its own track.
During daily preparations you may **shed** any bound material to free its slot — it is destroyed, not
recovered.

### 3.3 Frame, Focus, and Resonance

Three derived values, recalculated at daily preparations.

- **Frame** = the colour you hold most **metals** of. Grants that colour's **Plating** (defence).
- **Focus** = the colour you hold most **gems** of. Grants that colour's **Edge** (offence).
- **Resonance** = when your Frame and your Focus are the **same colour**, you gain that colour's named
  **Resonance** ability.

Ties in either track are broken by you, freely, each morning.

**This is the whole build-tension of the class.** A split Carapace — Black Frame, Orange Focus — is
tough in one direction and dangerous in another, covering more of the board. A **resonant** Carapace
is narrower and gets a signature ability nobody else gets. Neither is correct; both should be viable,
and the nine Resonances in §5 are priced to be worth roughly what breadth is worth.

### 3.4 The rule that keeps every entry alive

> **Tier sets the numbers. The material sets the trick.**

Your Plating and Edge numbers come from the **highest-tier** bound material of that colour in that
track. Every *other* bound material still gives its **Grain** (metals) or **Glint** (gems) in full,
regardless of tier.

So a 17th-level Carapace with *Mawheart* (IV) in the Frame still has a live reason to keep *Sootslag*
(I) in a second slot — the slag's Grain never stopped working, and it was never paying for the
resistance number anyway. Same principle as the Saint's Techniques never becoming dead weight.

---

## 4 — The tier ladder

### 4.1 The tiers

| Tier | Name | Item level | Nominal Price | Earliest | Where it's found |
| :-: | :-- | :-: | :-: | :-: | :-- |
| **I** | **Trace** | 1 | 4 gp | 1st | Tailings, spoil heaps, the wrong end of any mine. Free, if you're willing to dig in a slag pile. |
| **II** | **Seam** | 4 | 30 gp | 3rd | A worked seam that a legitimate operation abandoned. |
| **III** | **Lode** | 10 | 200 gp | 10th | A true lode. Somebody is guarding it, or something is living in it. |
| **IV** | **Heart / Star** | 16 | 2,000 gp | 16th | One per vein. Taking it ends the vein. |

Those Prices sit at or below the **25th percentile** of real PF2e items at the same level (level 1
p25 = 3 gp, level 4 p25 = 16 gp, level 10 p25 = 185 gp, level 16 p25 = 1,800 gp). That's correct for
a contaminant nobody wants — cheap for its level *if* you can find a buyer, and you usually can't.

### 4.2 What a tier buys

**Frame — Plating** (from your highest-tier bound metal of your Frame colour):

| Tier | Resistance, Frame colour | Resistance, off-Frame colours | Carapace Hardness |
| :-: | :-: | :-: | :-: |
| **I** | 2 | 1 | — |
| **II** | 5 | 2 | +2 |
| **III** | 8 | 4 | +5 |
| **IV** | 12 | 6 | +8 |

**Facet — Edge** (from your highest-tier bound gem of your Focus colour):

| Tier | Carapace Strikes |
| :-: | :-- |
| **I** | May deal the Focus colour's damage type instead of their normal type |
| **II** | **+1d4** of the Focus type |
| **III** | **+1d6** of the Focus type |
| **IV** | **+1d6** of the Focus type, **plus the colour's Greater rider** |

Read against the property-rune curve this is honest and slightly behind it: *flaming* is +1d6 at item
level 8, *greater flaming* is +1d6 plus 2d10 persistent at level 15. Tier III lands at 10th and Tier
IV's rider at 16th. The Carapace is unarmed and will never have rune slots, so paying two levels of
lateness for a rune-equivalent is roughly the right trade.

**The number most likely to move** is off-Frame resistance. At 16th a 4-metal Carapace could be sitting
on 12 / 6 / 6 / 6 across four damage types, always on. If that reads too broad in play, the first lever
is capping off-Frame resistance at a flat 3 regardless of tier. Flagged for the ledger pass.

### 4.3 The Vein provides

**The class grants one free material, of the highest tier you qualify for, every time a slot opens.**
Frame slot opens at 5th → you get a Tier II metal of your choice. Facet slot opens at 14th → a Tier III
gem of your choice.

This is not generosity, it's insulation. A class whose core numbers come out of the treasure pile is a
class that breaks the first time a GM forgets, or runs a low-magic campaign, or the party votes to sell
the funny rock. The free grants are the **floor**; everything found in play is **variety**, not power.
Same structural job as a Champion being handed their armour.

---

## 5 — The Nine Veins

| | Colour | Frame does | Focus does | Resistance | Resonance |
| :-- | :-- | :-- | :-- | :-- | :-- |
| 🔴 | **Red — the Forge** | runs hot, shrugs off burning | fire, persistent bleed | fire | **Bellows** |
| 🟠 | **Orange — the Conduit** | earths what hits it | electricity | electricity | **Circuit** |
| 🟡 | **Gold — the Crown** | refuses to die on schedule | vitality, spirit | void | **The Hour Held** |
| 🟢 | **Green — the Bloom** | knits itself back together | poison | poison | **Overgrowth** |
| 🔵 | **Blue — the Deep** | does not move and will not be moved | cold | cold | **Standstill** |
| 🟣 | **Purple — the Threshold** | is not reliably where you hit it | mental, force | mental | **Elsewhere** |
| ⚫ | **Black — the Maw** | is harder than the thing hitting it | void, slashing | void | **Unmaking** |
| ⚪ | **White — the Reliquary** | stands in front of other people | spirit, vitality | spirit | **Vigil** |
| ⬜ | **Gray — the Anvil** | is simply, stubbornly solid | *none — physical* | all physical¹ | **Trueform** |

¹ Gray resists bludgeoning, piercing and slashing at **half** the tier value each, rounded down, since
it covers three types instead of one.

---

## 6 — 🔴 RED — *the Forge*

> Runs hot. Gets hotter. The vein that does its best work in the fourth round.

**Focus damage:** fire; persistent bleed · **Frame resistance:** fire
**Greater rider (Facet IV):** on a critical hit, **2d10 persistent fire**, and the target's fire
resistance counts as 5 lower for 1 round.
**Resonance — Bellows:** the longer it burns, the hotter it gets. On each of your turns during an
encounter, your Carapace Strikes deal **+1 fire damage, cumulative**, to a maximum equal to your level.
Resets when the encounter ends.

### Metals — the Frame

| Tier | Name | Appearance | Grain *(always on)* |
| :-: | :-- | :-- | :-- |
| I | **Cinderslag** | Porous red clinker, warm to the touch, never quite cool | You are unharmed by severe heat environmental effects and need no protection to sleep in the cold. |
| II | **Emberore** | Dull red ingot with a bright core visible through hairline cracks | When you take fire damage, your Carapace Strikes deal +2 fire damage until the end of your next turn. |
| III | **Pyriron** | Black iron whose seams glow orange under strain | Your Carapace sheds bright light in a 20-foot radius whenever you have taken damage this encounter. You cannot suppress it. |
| IV | **Forgeheart** | A fist-sized coal that has been burning, alone, for an unknown number of centuries | Fire damage you take is reduced by your Frame resistance **twice** — once as resistance, once again before it applies. Immunity to being made clumsy by heat or exhaustion from forced march. |

### Gems — the Facets

| Tier | Name | Appearance | Glint |
| :-: | :-- | :-- | :-- |
| I | **Cinderglass** | Cloudy red glass full of trapped ash | Your persistent fire damage uses a **DC 13** flat check to end instead of DC 15. |
| II | **Embertear** | A single orange drop that pulses like something breathing | Once per hour, as a free action when you hit, add **1d4 persistent fire** to the damage. |
| III | **Pyrelith** | A cut stone with a visible flame inside that moves against the wind | Fire damage you deal ignores the first **5** points of fire resistance. |
| IV | **Forgestar** | Matte black outside, and if you look at it directly for too long you stop wanting to | Your persistent fire damage uses a **DC 10** flat check. When a creature dies while taking persistent fire damage from you, you gain temporary Hit Points equal to your level. |

---

## 7 — 🟠 ORANGE — *the Conduit*

> Doesn't hit harder. Hits on someone else's turn.

**Focus damage:** electricity · **Frame resistance:** electricity
**Greater rider (Facet IV):** on a hit, the electricity damage **arcs** to one other creature within
15 feet of the target, dealing half.
**Resonance — Circuit:** once per round, when you deal electricity damage to a creature, you gain a
reaction, usable until the end of that creature's next turn, which you may use **only** to make a
Carapace Strike against it when it Strides, Casts a Spell, or makes a ranged attack.

### Metals — the Frame

| Tier | Name | Appearance | Grain *(always on)* |
| :-: | :-- | :-- | :-- |
| I | **Sparkslag** | Grey-orange grit that stings the fingers and jumps to metal | +1 item bonus to saves against electricity effects. |
| II | **Arcore** | Copper-bright, and it hums at a pitch just under hearing | When you are hit by a melee attack, the attacker takes **1 electricity damage** (2 at 8th, 3 at 14th). |
| III | **Stormbrass** | Warm orange alloy threaded with branching white lines, like a healed scar | Once per round, when an adjacent creature takes an action that triggers reactions, you may **Step** as a free action. |
| IV | **Thunderheart** | A knot of metal that has been struck by lightning so often it has learned to expect it | The first time each round you are targeted by an attack or effect from more than 30 feet away, you may **Step** as a free action before it resolves. Electricity damage never causes you to be stunned or paralysed. |

### Gems — the Facets

| Tier | Name | Appearance | Glint |
| :-: | :-- | :-- | :-- |
| I | **Sparkglass** | Fogged orange glass that crackles audibly when handled | +5 feet Speed on any turn in which you have already made an attack. |
| II | **Arctear** | A drop of clear orange with a thread of white suspended dead centre | Once per hour, when you hit a creature standing in water or wearing metal armour, deal **+1d6 electricity**. |
| III | **Stormlith** | Cut so the internal filament reaches corner to corner | Electricity damage you deal ignores the first **5** points of electricity resistance. |
| IV | **Thunderstar** | It is not clear whether the light inside is stored or being generated | Your electricity damage arcs to a second creature within 15 feet for half damage, **and** that creature can't use reactions until the end of its next turn. |

---

## 8 — 🟡 GOLD — *the Crown*

> The vein that buys time. Yours, and occasionally somebody else's.

**Focus damage:** vitality; spirit · **Frame resistance:** void
**Greater rider (Facet IV):** against an undead or a creature with void healing, the vitality damage is
**doubled**; against anything else, **you** gain temporary Hit Points equal to your level.
**Resonance — The Hour Held:** once per day, at the start of your turn, gain **one extra action**,
which you may use only to Strike, Stride, or Step.

### Metals — the Frame

| Tier | Name | Appearance | Grain *(always on)* |
| :-: | :-- | :-- | :-- |
| I | **Gildslag** | Worthless yellow dross that fools every assayer once | You always know the approximate market value of any metal you touch, and can tell gilt from solid at a glance. |
| II | **Sunore** | Heavy, warm, and faintly too bright to look at in daylight | +1 item bonus to saves against death effects and effects that would make you drained. |
| III | **Hourbrass** | Yellow metal marked with fine concentric rings, like a felled tree, that do not match its age | Once per day, when you roll initiative, roll twice and take the higher result. |
| IV | **Crownheart** | A nugget that is very slightly, measurably heavier every morning than it was the night before | If your Carapace is destroyed, it **reassembles itself completely after 24 hours** at no cost. Once per day, when reduced to 0 Hit Points, you are instead reduced to 1. |

### Gems — the Facets

| Tier | Name | Appearance | Glint |
| :-: | :-- | :-- | :-- |
| I | **Gildglass** | Yellow glass with real gold leaf trapped unevenly inside | +1 item bonus to Diplomacy to Make an Impression, and to Society to Recall Knowledge about coinage, trade or heraldry. |
| II | **Suntear** | A clear gold drop that casts a shadow in the wrong direction | Once per hour, when you hit an undead, it takes **+1d6 vitality** and can't use reactions until the end of its turn. |
| III | **Hourlith** | Cut with one facet more than the geometry should permit | When you Strike a creature that has not yet acted this encounter, deal **+2 damage per weapon damage die**. |
| IV | **Crownstar** | It is warm. It has always been warm. Nobody has established why | Once per day, as a free action when an ally within 30 feet is reduced to 0 Hit Points, they are instead reduced to 1 and may **Step**. |

---

## 9 — 🟢 GREEN — *the Bloom*

> Venom and regrowth. The vein that wins by still being there.

**Focus damage:** poison · **Frame resistance:** poison
**Greater rider (Facet IV):** on a hit, the target must succeed at a Fortitude save against your class
DC or be **sickened 1** (sickened 2 on a critical failure).
**Resonance — Overgrowth:** you gain **fast healing equal to twice the number of bound Green
materials** (metals and gems both count). While any creature within 30 feet is sickened, double it.

### Metals — the Frame

| Tier | Name | Appearance | Grain *(always on)* |
| :-: | :-- | :-- | :-- |
| I | **Verdslag** | Chalky green residue that smells strongly of nothing at all | +1 item bonus to saves against poison, and you can hold your breath twice as long. |
| II | **Blightore** | Grey-green metal that kills grass under it within a day | When you are affected by a poison or disease, reduce its stage by 1 the first time you fail a save against it each day. |
| III | **Thorniron** | Green-black, and it grows small barbs that have to be filed off weekly | When a creature hits you with a melee unarmed attack or a melee attack while adjacent, it takes **1d4 poison damage**. |
| IV | **Bloomheart** | It is a seed. It has never germinated. It is still trying | You are immune to disease, and you no longer need to eat. Each time you make your daily preparations, reduce the stage of any affliction on you by 2. |

### Gems — the Facets

| Tier | Name | Appearance | Glint |
| :-: | :-- | :-- | :-- |
| I | **Verdglass** | Milky green, unpleasantly slick, never dries | When you regain Hit Points from any source, regain **1** additional (2 at 10th, 3 at 16th). |
| II | **Blighttear** | A green drop that will not mix with water, oil, blood, or anything else | Once per hour, when you hit a creature, it takes **1d6 persistent poison**. |
| III | **Thornlith** | Cut, but it keeps growing points back along the girdle | Poison damage you deal ignores the first **5** points of poison resistance, and creatures **immune** to poison instead take half. |
| IV | **Bloomstar** | Six arms, and every year there is one more | A creature that a Carapace Strike of yours brings to 0 Hit Points, or that dies within 30 feet of you, restores **Hit Points equal to your level** to you. |

---

## 10 — 🔵 BLUE — *the Deep*

> Cold, and the tyranny of standing still. Blue is the control vein, so Blue gets the fewest dice.

**Focus damage:** cold · **Frame resistance:** cold
**Greater rider (Facet IV):** on a critical hit, the target is **slowed 1** until the end of its next
turn. No save.
**Resonance — Standstill:** your square and every square adjacent to you is **difficult terrain for
your enemies**. You ignore it, and you cannot be moved against your will by any forced movement that
doesn't come from a creature at least two sizes larger than you.

### Metals — the Frame

| Tier | Name | Appearance | Grain *(always on)* |
| :-: | :-- | :-- | :-- |
| I | **Rimeslag** | Blue-grey crumbles with frost on them regardless of the weather | You are unharmed by severe cold environmental effects, and never slip on ice. |
| II | **Frostore** | Pale blue metal that sweats and then freezes its own sweat | +2 circumstance bonus to Athletics and Acrobatics DCs to Shove, Trip, Grapple, or Reposition **you**. |
| III | **Tideiron** | Deep blue, and its surface moves very slightly, in a rhythm | You gain a **swim Speed** equal to half your land Speed, and can breathe underwater. |
| IV | **Glacierheart** | Ice, except it is a metal, and it is not melting, and it is not going to | You are permanently immune to being **slowed** by cold effects, and the first time each round you would be moved against your will, reduce the distance by 15 feet. |

### Gems — the Facets

| Tier | Name | Appearance | Glint |
| :-: | :-- | :-- | :-- |
| I | **Rimeglass** | Frosted blue, and it fogs in warm rooms | Creatures you deal cold damage to are **off-guard** to your next attack against them this turn. |
| II | **Frosttear** | A single blue drop, permanently at the exact moment before it falls | Once per hour, when you hit a creature, reduce its Speeds by **10 feet** until the end of its next turn. |
| III | **Tidelith** | Cut so that light entering it arrives somewhere else, later | Cold damage you deal ignores the first **5** points of cold resistance. |
| IV | **Glacierstar** | Recovered from a depth at which there is no light to explain what it is reflecting | Creatures you damage with cold have their Speeds reduced by **10 feet** until the end of their next turn, and creatures already slowed take **+2 cold damage per weapon damage die** from you. |

---

## 11 — 🟣 PURPLE — *the Threshold*

> Not reliably where you hit it. Hits the thing inside the armour rather than the armour.

**Focus damage:** mental; force · **Frame resistance:** mental
**Greater rider (Facet IV):** on a hit, you may **Step** 5 feet as a free action; on a critical hit, you
may instead **teleport** up to 15 feet to a space you can see.
**Resonance — Elsewhere:** once per round you may **teleport up to 30 feet** as a single action, to a
space you can see. You may bring one willing adjacent creature with you.

### Metals — the Frame

| Tier | Name | Appearance | Grain *(always on)* |
| :-: | :-- | :-- | :-- |
| I | **Duskslag** | Grey-violet, and casts a shadow slightly larger than it is | +1 item bonus to Deception to Create a Diversion, and to Stealth in dim light. |
| II | **Veilore** | Purple-black metal that is difficult to focus your eyes on directly | +1 item bonus to Will saves against emotion effects. |
| III | **Riftsilver** | White-violet, with a hairline seam that is not a crack and does not close | Your Carapace's Bulk counts as 1 lower, and you ignore the first 1 Bulk of everything else you carry. Squeezing costs you no extra movement. |
| IV | **Gateheart** | Hold it up and there is a view through it. It is not a view of the other side | You are permanently unaffected by difficult terrain of any kind, and once per day you may cast a 30-foot **dimension-door-equivalent** teleport as a two-action activity. |

### Gems — the Facets

| Tier | Name | Appearance | Glint |
| :-: | :-- | :-- | :-- |
| I | **Duskglass** | Clouded violet, and reflections in it arrive about a quarter second late | You always know which direction is north and how far you are from where you woke up. |
| II | **Veiltear** | A drop of purple that is only there in peripheral vision | Once per hour, when you hit a creature, it takes **1d6 mental** and is **stupefied 1** until the end of its next turn. |
| III | **Riftlith** | The cut does not match the stone; nobody agrees on how many facets it has | Mental damage you deal ignores the first **5** points of mental resistance, and creatures **immune** to mental damage instead take half. |
| IV | **Gatestar** | It is not in your hand. It has never been in your hand. You can feel it in your hand | Once per round, when you damage a creature, you may **swap places** with it if it is your size or smaller and within 30 feet. It may attempt a Will save against your class DC to prevent this. |

---

## 12 — ⚫ BLACK — *the Maw*

> Harder than the thing hitting it, and sharper than the thing it hits.

**Focus damage:** void; slashing · **Frame resistance:** void
**Greater rider (Facet IV):** your Carapace Strikes gain the **knife-group critical specialization
effect**, and on a critical hit the target takes **2d10 persistent bleed**.
**Resonance — Unmaking:** your Carapace Strikes ignore an object's **Hardness up to 20**, and treat a
creature's **physical and void resistances as 10 lower**. An object you reduce to 0 Hit Points cannot
be Repaired — only replaced.

### Metals — the Frame

| Tier | Name | Appearance | Grain *(always on)* |
| :-: | :-- | :-- | :-- |
| I | **Sootslag** | Black flakes that mark everything and wash out of nothing | +1 item bonus to Stealth in dim light or darkness. |
| II | **Shadeore** | Matte black, no sheen at any angle, no matter how it is polished | You gain **darkvision** if you don't already have it; if you do, you ignore the concealed condition from magical darkness of 1st rank or lower. |
| III | **Voidsteel** | Black metal with a mirror edge that does not reflect the person holding it | Your Carapace Strikes may deal **slashing** damage instead of bludgeoning, and you ignore an object's Hardness up to **10** when you Strike it. |
| IV | **Mawheart** | It is heavier than its volume permits and it is very slightly warm on one face | Your Carapace's Hardness increases by an additional **5** beyond the Plating table, and the first time each day your Carapace would be destroyed, it isn't — it is reduced to 1 Hit Point instead. |

### Gems — the Facets

| Tier | Name | Appearance | Glint |
| :-: | :-- | :-- | :-- |
| I | **Sootglass** | Black glass, and the bubbles inside are moving, slowly | +1 item bonus to Will saves against void effects. |
| II | **Shadetear** | A black drop with no highlight on it at any angle | Once per hour, when you hit a creature, it takes **1d6 void** and you gain that many temporary Hit Points. |
| III | **Voidlith** | Cut, and the facets are visible only as absences | Void damage you deal ignores the first **5** points of void resistance, and your Strikes count as **magical** for overcoming resistances. |
| IV | **Mawstar** | Light goes in. There is no reason to believe it comes out | Creatures you critically hit take **2d10 persistent bleed**, and a creature already taking persistent damage from you takes **+2 void damage per weapon damage die** from your Strikes. |

---

## 13 — ⚪ WHITE — *the Reliquary*

> Stands in front of other people. The only vein whose big rider points at an ally.

**Focus damage:** spirit; vitality · **Frame resistance:** spirit
**Greater rider (Facet IV):** on a hit, one ally within 30 feet gains temporary Hit Points equal to
**half your level**, lasting 1 minute.
**Resonance — Vigil:** once per round, when an ally within 15 feet would take damage, you may take it
instead as a reaction. You have **resistance equal to your level** against damage taken this way.

### Metals — the Frame

| Tier | Name | Appearance | Grain *(always on)* |
| :-: | :-- | :-- | :-- |
| I | **Chalkslag** | Soft white crumbles that leave a line on anything | +1 item bonus to saves against effects that would make you frightened, and you can't be made fleeing by a non-magical source. |
| II | **Dawnore** | White metal with a warm edge to the colour, as if lit from off to one side | Allies within 15 feet gain a +1 item bonus to saves against fear. |
| III | **Halosilver** | It is very slightly self-luminous and this cannot be polished out | You are permanently under the effect of **see invisibility** with respect to creatures within 30 feet. |
| IV | **Vigilheart** | Perfectly white, perfectly smooth, and warm in exactly the shape of a hand that is not yours | Your Carapace's Hardness increases by an additional **5** beyond the Plating table, and once per day you may reduce the damage from one effect by an amount equal to your level. |

### Gems — the Facets

| Tier | Name | Appearance | Glint |
| :-: | :-- | :-- | :-- |
| I | **Chalkglass** | White, opaque, faintly gritty; more mineral than glass | +1 item bonus to Medicine, and you may Administer First Aid as a single action. |
| II | **Dawntear** | A white drop that holds a small amount of light overnight | Once per hour, as a free action, grant an ally within 30 feet temporary Hit Points equal to your level for 1 minute. |
| III | **Halolith** | Cut, and there is a ring of light around it that is not a reflection | Spirit damage you deal ignores the first **5** points of spirit resistance, and your Strikes affect incorporeal creatures as though they were **ghost touch**. |
| IV | **Vigilstar** | Nobody has been able to determine which way up it goes | Once per day, as a reaction when an ally within 30 feet would be reduced to 0 Hit Points, they are instead reduced to 1 and gain temporary Hit Points equal to your level. |

---

## 14 — ⬜ GRAY / SILVER — *the Anvil*

> No element. No trick. The Strike itself, sharper. Every roster of nine needs one.

**Focus damage:** *none — physical* · **Frame resistance:** bludgeoning, piercing and slashing, each at
**half** the tier value (round down)
**Greater rider (Facet IV):** your Carapace Strikes gain **one additional damage die** of their own type.
**Resonance — Trueform:** your Carapace Strikes bypass **all** physical resistances entirely, and
trigger any weakness a creature has to a precious material of any kind.

**Gray's Edge is different from every other colour**, because it has no damage type to convert to.
Instead of the §4.2 Facet table, Gray uses this one:

| Tier | Gray's Edge |
| :-: | :-- |
| **I** | Your Carapace Strikes count as **silver** and as **cold iron**. |
| **II** | **+1 circumstance damage per weapon damage die** you roll. |
| **III** | Treat a creature's **physical resistances as 5 lower**. |
| **IV** | **+1 damage die** on your Carapace Strikes, and physical resistances count as **10 lower**. |

### Metals — the Frame

| Tier | Name | Appearance | Grain *(always on)* |
| :-: | :-- | :-- | :-- |
| I | **Gritslag** | Grey. Heavy. Entirely uninteresting | +1 item bonus to Crafting, and your Carapace does not corrode, tarnish, or rust. |
| II | **Keenore** | Grey metal that takes and holds an edge it was not given | Your Carapace Strikes count as **silver** for weaknesses and resistances, independent of your Focus. |
| III | **Truesteel** | It looks exactly like good steel. It is not good steel | Your Carapace Strikes count as **cold iron**, independent of your Focus, and you gain a +1 circumstance bonus to saves against spells. |
| IV | **Anvilheart** | A grey lump that has been hit more times than anything else you will ever hold | Reduce all physical damage you take by **2** before any other reduction, and you can never be made **off-guard** by being flanked. |

### Gems — the Facets

| Tier | Name | Appearance | Glint |
| :-: | :-- | :-- | :-- |
| I | **Gritglass** | Grey, cloudy, and full of something that might be sand | +1 item bonus to Athletics to Grapple, Shove or Trip. |
| II | **Keentear** | A grey drop that has flattened into a lens with a sharp rim | Once per hour, when you hit a creature, treat its physical resistances as **10 lower** for that Strike. |
| III | **Truelith** | A perfectly cut, perfectly clear stone with no colour whatsoever | Your Carapace Strikes gain **deadly d8**. |
| IV | **Anvilstar** | It has no facets. It was never cut. It has always been this shape | Your Carapace Strikes gain **one additional damage die**, and on a critical hit you may make the target **off-guard** until the end of your next turn instead of applying a critical specialization effect. |

---

## 15 — Open questions

Five, and they're yours rather than mine.

**1. Is the Carapace unarmed?** I've assumed yes throughout — the armour *is* the weapon, like the
Saint. If it's meant to hold a weapon instead, the Facet track needs re-pointing, because half its
entries currently modify "Carapace Strikes."

**2. Do the Veins stack across colours in the Frame?** Right now **yes** — every bound metal gives its
Grain, so a four-metal Carapace at 17th has four Grains running at once. That's the intended feel
(you are visibly a pile of things you ate), but it's also four always-on riders and it's the most
likely place for the ledger to say no. The alternative is that only your Frame colour's metals give
Grains, which is cleaner to cost and much less fun.

**3. Should Resonance scale, or be binary?** Currently binary: Frame colour == Focus colour, you get
the ability, full stop. A scaling version — Resonance strength keyed to *how many* of your nine slots
are that colour — would reward the fanatic over the merely-committed, but adds a counting step every
morning.

**4. Should there be off-colour Resonances?** Specific *pairs* (Black Frame + White Focus; Red Frame +
Blue Focus) could have named effects of their own. That's 36 more entries and it is absolutely the
kind of thing that eats a design budget, so I'd say **no for now** and revisit if the class feels thin
after the feat list exists.

**5. Ten colours?** Green is currently doing venom *and* regrowth, and Gold is doing radiance *and*
time. Both would split cleanly. Nine is a good number and I'd leave it — but Gold's time material
(Hourbrass, Hourlith, Crownheart's 24-hour reassembly) is arguably its own thing.

---

## 16 — What's next

This document is the food. The class still needs:

1. **The chassis** — Hit Points, proficiencies, key attribute, and what a Carapace Strike actually is.
2. **The 2100-point BCS ledger**, costing the Frame track, the Facet track, Resonance, and the §4.2
   tier tables against `BCS 1.4`. Every number above is provisional until that pass.
3. **Cast techniques** — per-colour ability ladders, in the shape the Saint's Cloth Techniques and the
   Breath Slayer's Forms already use.
4. **The feat list**, 1st–20th.
5. **The automation plan** — the Frame and Facet tracks map cleanly onto the module's existing effect
   machinery: each bound material is an Effect item carrying its Grain or Glint as rule elements, and
   Frame / Focus / Resonance are a recalculation on daily preparations.

Answer §15.1 (unarmed or not) and §15.2 (do Grains stack), tell me whether the class keeps the name
**Carapace**, and I'll take it to the chassis and the ledger next.

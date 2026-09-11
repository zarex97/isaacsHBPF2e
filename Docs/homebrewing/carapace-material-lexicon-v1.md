# The Carapace — Material Lexicon, **Version 1**

### *The symbiont class · what it eats, and what it becomes*

*This document is **step one** of the new class: the colour-coded list of metals and gems the symbiont
feeds on, the tier ladder that rates them, and the nine colour identities they resolve into. It is
deliberately **not** the full class — there is no advancement table, no feat list, and no 2100-point
BCS ledger here yet. Those come next, and they will be built on top of this list.*

**Anchored to live system data** from `pf2e_fork`:
`src/module/item/physical/materials.ts` (every precious material's grade, item level, Price and
rarity), `static/lang/en.json` → `PF2E.PreciousMaterial*Description` (every material's canon colour
and property), `packs/pf2e/equipment/*.json` (every gemstone's canon Price), and
`src/scripts/config/damage.ts` (the fifteen damage types the colours are allowed to key off).
Every metal and every gem named below is a real thing that already exists in the system — nothing
here is invented, only sorted.

> **Working title.** The class is called **the Carapace** throughout, and so is the symbiont itself —
> same convention as the Saint's *"the Cloth"* and the Soulbound's *"the Spirit Weapon"*. If you'd
> rather it were **the Reliquary**, **the Hoard**, **the Lode** or **the Gild**, say so and I'll do a
> global rename before anything else is written; the mechanics below don't depend on the name.

---

## 1 — The pitch, in one paragraph

Something found you, and it is still hungry. It lies over your skin as plate, and it does not grow by
levelling — it grows by **eating**. Feed it copper and it learns to carry lightning. Feed it a ruby
and it learns to burn. Feed it adamantine and it learns that most things are softer than it is. Your
build is not a list of choices you made at character creation; it is a **stomach**, and the contents
are visible on you. Two Carapaces of the same level can look and fight nothing alike, because one was
raised on a merchant's gemstones and the other on scavenged sky-iron.

The design consequence that matters: **the class's power budget is spent on material, not on
features.** A Carapace who hoards gold is measurably stronger than one who doesn't, which means the
gem and metal table *is* the class, and the numbers below have to be as carefully priced as any feat.

---

## 2 — How feeding works (the minimum frame the list needs)

The full mechanic gets its own section in the class guide. This is the part you need to read the
tables.

### 2.1 The Lattice

The Carapace holds a fixed number of materials at once, called **Lattice slots**.

| Level | 1 | 4 | 8 | 12 | 16 | 20 |
| :-- | :-: | :-: | :-: | :-: | :-: | :-: |
| **Lattice slots** | 2 | 3 | 4 | 5 | 6 | 7 |

**Feeding** is a 10-minute activity. The material is **consumed** and occupies a slot. During your
daily preparations you may **shed** any bound material to free its slot — the material is destroyed,
not recovered. So swapping your build costs *gold*, not time, and the gem table is a deliberate,
permanent money sink. (PF2e's wealth-by-level makes a 5 gp gem trivial at 5th and a 500 gp gem a
real decision at 16th, which is exactly the pressure curve this wants.)

### 2.2 The Cast

Count your bound materials by colour. The colour you hold **most** of is your **Cast**. Ties are
broken by you, freely, at daily preparations — so a 4-slot Carapace holding 2 Red and 2 Blue is a
genuinely bi-modal character who picks their mode each morning.

- **Every** bound material gives its **Trait** — a small always-on rider, listed per entry below.
- **Only your Cast** gives an **offensive** package. This is the balance valve that stops the class
  from being a pile of every element at once: you can *hold* nine colours, but you only ever *hit*
  with one.
- Passive **resistance** from a bound material is full value if it's your Cast colour, and **half
  (round down)** if it isn't.

### 2.3 The tier ladder

Four tiers, and they are not invented — they are read straight off PF2e's own gemstone Prices and
precious-material item levels.

| Tier | Name | Gems (canon Price) | Metals | Earliest level | Why that level |
| :-: | :-- | :-- | :-- | :-: | :-- |
| **I** | **Slag** | 5 sp – 25 sp | mundane trade metal (copper, iron, steel, brass, lead, tin, pewter) | 1 | Scrap and coin metal. Free. |
| **II** | **Vein** | 5 gp – 50 gp | **low-grade** precious material | 3 | Low-grade silver / cold iron are item level **2**, 40 gp. |
| **III** | **Core** | 100 gp | **standard-grade** precious material | 10 | Standard-grade materials are item level **10–12**. |
| **IV** | **Heart** | 500 gp | **high-grade** precious material | 16 | High-grade materials are item level **16–18**. |

**The grade rule.** Where a colour has no gem at a given tier, a **larger or finer specimen of the
same species counts one tier up**. PF2e already does this itself — *Diamond, small* (100 gp) versus
*Diamond, large* (500 gp); *Ruby, small* versus *Ruby, large*; *Pearl, irregular freshwater* (5 sp)
versus *Pearl, saltwater* (5 gp) versus *Pearl, black* (50 gp). So an **imperial amethyst** is simply
an amethyst at Tier III, priced at 100 gp, and no colour is ever short of food.

### 2.4 What a tier buys

Proposed numbers. **These are the ones that need the BCS ledger pass** — they are sane against the
system's own curves, but they have not been costed yet.

| Tier | Cast offence (Carapace Strikes) | Resistance (Cast colour) | Resistance (off-Cast) |
| :-: | :-- | :-: | :-: |
| **I** | Strikes may deal the Cast's damage type instead of their normal type | 2 | 1 |
| **II** | **+1d4** of the Cast type | 5 | 2 |
| **III** | **+1d6** of the Cast type | 8 | 4 |
| **IV** | **+1d6** of the Cast type, **plus the colour's Greater rider** | 12 | 6 |

Read against the property-rune curve this is honest: a *flaming* rune is +1d6 fire at item level 8,
and *greater flaming* is +1d6 plus 2d10 persistent at level 15. Tier III's +1d6 lands at 10th and
Tier IV's rider at 16th — both slightly **behind** the rune they imitate, which is correct, because
the Carapace is unarmed and pays for this with the rune slots it will never have.

Resistance is the number most likely to move. 12 in your Cast type at 16th is in line with the
Barbarian's *Raging Resistance* (3 + Con, so 8–9, but conditional) and with monster resistances at
that level — but it is **always on**, and the off-Cast half-values mean a 6-slot Carapace could be
sitting on five resistances at once. If that proves too broad in play, the first lever to pull is
capping off-Cast resistance at a flat 3 regardless of tier.

---

## 3 — The nine colours

Each colour is a **damage identity**, a **defensive identity**, and a **verb**. The verb matters
most: it's what the colour *does* that no other colour does, and it's what keeps nine colours from
collapsing into "pick your favourite element".

| Colour | Name | Damage | Resists | The verb |
| :-- | :-- | :-- | :-- | :-- |
| 🔴 **Red** | **the Forge** | fire, bleed | fire | **Burn** — persistent damage, and damage that grows the longer a fight runs |
| 🟠 **Orange** | **the Conduit** | electricity | electricity | **Arc** — damage that jumps, and reactions that fire off other people's actions |
| 🟡 **Yellow/Gold** | **the Crown** | vitality, spirit | void | **Gild** — healing, and stolen time |
| 🟢 **Green** | **the Bloom** | poison | poison | **Root** — afflictions that stage up, fast healing, and the one anti-magic line |
| 🔵 **Blue** | **the Deep** | cold | cold | **Still** — slowed, immobilised, and moving through water like it isn't there |
| 🟣 **Purple** | **the Threshold** | mental, force | mental | **Step** — teleportation, and hitting a mind directly |
| ⚫ **Black** | **the Maw** | void, slashing | void | **Sunder** — ignore Hardness, ignore resistance, and go unseen |
| ⚪ **White** | **the Reliquary** | spirit, vitality | spirit | **Ward** — Hardness on yourself, shields on allies, and seeing what's hidden |
| ⚪ **Gray/Silver** | **the Anvil** | *none — physical* | physical (all three) | **Sharpen** — no element at all; the Strike itself gets better |

**Gray is the deliberate odd one out.** It grants no energy type. Its whole offering is that your
fists start counting as silver, as cold iron, as adamantine — bypassing the resistances and hitting
the weaknesses that every other colour has to route around. It is the colour for a player who does
not want a gimmick, and every roster of nine needs one.

---

## 4 — 🔴 RED — *the Forge*

> Heat, blood, and the thing that gets angrier the longer you let it live.

**Damage:** fire; persistent bleed · **Resists:** fire
**Greater rider (Tier IV):** on a critical hit, **2d10 persistent fire**, and the target's fire
resistance is treated as 5 lower for 1 round.

| Tier | Entry | Canon anchor | Trait (always on) |
| :-: | :-- | :-- | :-- |
| **I** | **Bog iron / rust-scale** | mundane, pennies | Your Carapace visibly rusts and reddens. +1 item bonus to Intimidation to Demoralize. |
| **I** | **Spinel, red** | 25 sp | Once per day, autostabilise at dying 1 instead of rolling. |
| **II** | **Garnet** | 5 gp | While you have persistent bleed damage, +5 ft. Speed. |
| **II** | **Sisterstone (Scarlet)** | orange-red ore, low grade | Your Strikes count as good-aligned for undead. Paired with its Dusk half (Orange), both exude spirit energy — see §13. |
| **III** | **Ruby, small** | 100 gp | Fire damage you deal ignores the first 5 points of fire resistance. |
| **III** | **Djezet** *(rare)* | rust-red "quickiron", standard grade, item level **12**, 1,800 gp | Djezet is reactive to magic: when you are targeted by a spell, your Carapace glows with scarlet striations and your next Strike before the end of your next turn deals +1d6 fire. |
| **IV** | **Ruby, large** | 500 gp | Your persistent fire damage uses a DC 10 flat check to end instead of DC 15. |
| **IV** | **Djezet, high grade** *(rare)* | item level **18**, 22,000 gp | As above, and the bonus Strike damage becomes 2d6. |

**Design note.** Red is the *attrition* colour, which is why every entry pushes persistent damage and
lowering the flat check rather than raw dice. A class that reliably lands persistent fire and makes
it hard to put out is doing something the Fighter cannot, without out-damaging them on the spike.

---

## 5 — 🟠 ORANGE — *the Conduit*

> Copper, amber, and the oldest joke in the periodic table: the Greek for amber is **elektron**.

**Damage:** electricity · **Resists:** electricity
**Greater rider (Tier IV):** on a hit, the electricity damage **arcs** to one other creature within
15 feet of the target, dealing half.

| Tier | Entry | Canon anchor | Trait (always on) |
| :-: | :-- | :-- | :-- |
| **I** | **Copper** | mundane trade metal | +1 item bonus to saves against electricity effects. |
| **I** | **Bronze / brass** | mundane alloy | Your Carapace rings when struck. +1 item bonus to Perception to notice creatures you can hear. |
| **I** | **Carnelian** | 25 sp | Once per hour, when you Ready an action, you may Step 5 feet as part of readying it. |
| **I** | **Citrine** | 25 sp | +1 item bonus to Diplomacy to Make an Impression. |
| **II** | **Amber** | 5 gp | *Elektron.* When a creature within reach touches you or you are hit by a melee unarmed attack, it takes 1 electricity damage. Scales to 2 at 8th, 3 at 14th. |
| **II** | **Zircon** | 25 sp / finer specimens at 5 gp | +5 ft. Speed when you Stride in a straight line and end at least 20 feet from where you started. |
| **II** | **Sisterstone (Dusk)** | pale orange ore, low grade | The Dusk half of the pair. See §13. |
| **III** | **Fire opal** *(opal, grade rule)* | opal is 50 gp; a fire opal is the Tier III specimen at 100 gp | Your electricity damage ignores the first 5 points of electricity resistance. |
| **IV** | **Orichalcum-copper alloy** *(rare)* | orichalcum is a **dull coppery** skymetal, high grade only, item level **18**, 22,500 gp | Orange's only Tier IV metal, and it is shared with Gold — see §6. Here it grants: once per day, when you are critically hit, take the damage as a failure instead. (Orichalcum repairs itself; so do you.) |

**Design note.** Orange is the *reaction* colour. Everything it gives keys off someone else acting —
touching you, hitting you, moving. It is the colour that makes an enemy's turn worse, which is a
distinct role from Red making their next three turns worse.

---

## 6 — 🟡 YELLOW / GOLD — *the Crown*

> The metal colour. Gold, electrum, orichalcum — Gold is deliberately thin on gems and thick on
> metals, because that is what it is.

**Damage:** vitality; spirit · **Resists:** void
**Greater rider (Tier IV):** on a hit against an undead or a creature with void healing, the vitality
damage is doubled; on a hit against anything else, you gain temporary Hit Points equal to your level.

| Tier | Entry | Canon anchor | Trait (always on) |
| :-: | :-- | :-- | :-- |
| **I** | **Brass** | mundane alloy | +1 item bonus to Society to Recall Knowledge about trade, coinage or heraldry. |
| **I** | **Electrum** | mundane gold-silver alloy | You always know the approximate market value of precious metal you touch. |
| **II** | **Chrysoberyl** | 5 gp | +1 item bonus to Perception against invisible and concealed creatures. (Its evil-eye reputation, taken literally.) |
| **II** | **Topaz** | 50 gp | Once per day, reroll a failed save against a death or void effect. |
| **II** | **Gold** | mundane, but 50 gp buys a usable mass | Your Carapace is unmistakably, indefensibly gilded. +1 item bonus to Intimidation, −1 circumstance penalty to Stealth in daylight. Yes, that penalty is on purpose. |
| **III** | **Grisantian pelt** *(rare)* | gold, shines in sunlight; **immune to fire**; Hardness doubled vs. piercing and slashing | Not a metal, and the Carapace eats it anyway. Fire resistance 5 in addition to your Cast resistance, and it does not halve when off-Cast. |
| **IV** | **Orichalcum** *(rare)* | the most valuable skymetal; **time-bending**; high grade only, item level **18**, 22,500 gp | **The best single thing in the lexicon.** Once per day, take an extra action at the start of your turn, which you may use only to Strike, Stride or Step. If your Carapace is destroyed, it reassembles itself after 24 hours at no cost. |

**Design note.** Gold is the *support* colour and the *action-economy* colour, and Orichalcum is
intentionally the single most valuable entry in this document — it should be the thing a Carapace
player spends the whole campaign chasing. Its 22,500 gp Price at item level 18 is the system's own
statement about how much that is worth; the class should not undercut it.

---

## 7 — 🟢 GREEN — *the Bloom*

> Venom, growth, and the one line in the lexicon that eats magic.

**Damage:** poison · **Resists:** poison
**Greater rider (Tier IV):** on a hit, the target must succeed at a Fortitude save against your class
DC or be **sickened 1** (sickened 2 on a critical failure).

| Tier | Entry | Canon anchor | Trait (always on) |
| :-: | :-- | :-- | :-- |
| **I** | **Malachite** | 5 sp | +1 item bonus to Nature. |
| **I** | **Verdigris copper** | mundane, patinated | +1 item bonus to saves against poison. |
| **I** | **Peridot** | 25 sp | You can hold your breath for twice as long. |
| **I** | **Spinel, green** | 25 sp | +1 item bonus to Fortitude saves against disease. |
| **II** | **Jade** | 5 gp | When you regain Hit Points from any source, regain 1 additional. Scales to 2 at 10th, 3 at 16th. |
| **III** | **Emerald** | 100 gp | **Fast Healing 2**, active only when you have not taken damage since the end of your last turn. |
| **III** | **Abysium** *(rare)* | blue-green, **eerie green luminescence**, poisonous; standard grade, item level **12**, 2,000 gp | Your Carapace sheds dim light in a 10-foot radius and you cannot suppress it. Creatures that end their turn adjacent to you take 1 poison damage (a poison effect). The light is not optional — abysium is a liability as much as a weapon, and it should read that way. |
| **III** | **Noqual** *(rare)* | pale green, crystalline, **resists magic**; standard grade, item level **12**, 1,600 gp | +1 circumstance bonus to saves against spells and magical effects. The lexicon's only anti-magic entry, and the one thing Green offers that has nothing to do with poison. |
| **IV** | **Abysium, high grade** *(rare)* | item level **18**, 24,000 gp | As above; the adjacency damage becomes 1d6 poison, and creatures that start their turn within 10 feet must save or be sickened 1. |
| **IV** | **Noqual, high grade** *(rare)* | item level **18**, 24,000 gp | The circumstance bonus becomes +2, and once per day you may treat a critical failure on a save against a spell as a failure. |

**Design note.** Green is the only colour carrying two incompatible identities — *venom* and
*anti-magic* — and I've left it that way on purpose rather than inventing a tenth colour. Both are
pale green in canon (abysium is "blue-green with an eerie green luminescence"; noqual is "the
pale-green material"), and a Green Carapace choosing between the poison line and the noqual line is a
real, legible build decision inside a single colour. If you'd rather Noqual moved to Gray/Silver
alongside Sovereign Steel — which is literally an alloy of noqual and cold iron — that's a one-line
change and it's defensible; see §13.

---

## 8 — 🔵 BLUE — *the Deep*

> Cold, water, and the tyranny of standing still.

**Damage:** cold · **Resists:** cold
**Greater rider (Tier IV):** on a critical hit, the target is **slowed 1** until the end of its next
turn (no save).

| Tier | Entry | Canon anchor | Trait (always on) |
| :-: | :-- | :-- | :-- |
| **I** | **Turquoise** | 5 sp | +1 item bonus to Survival. |
| **I** | **Lapis lazuli** | 5 sp | +1 item bonus to Occultism. |
| **I** | **Cobalt ore** | mundane | You are unharmed by severe cold environmental effects. |
| **II** | **Spinel, deep blue** | 5 gp | You gain a swim Speed equal to half your land Speed. |
| **II** | **Aquamarine** | 50 gp | You can breathe underwater. |
| **III** | **Sapphire** | 100 gp | Your cold damage ignores the first 5 points of cold resistance. |
| **III** | **Siccatite (cold)** *(rare)* | silvery ore that is **freezing cold**; standard grade, item level **11**, 1,400 gp | A creature that touches you or hits you with an unarmed melee attack takes 1 cold damage per round of contact. Moisture freezes on your Carapace: difficult terrain forms in your square if you end your turn in water or rain. Siccatite is **dual-listed with Gray** — see §12. |
| **IV** | **Star sapphire** | 500 gp | Creatures you damage with cold have their Speeds reduced by 10 feet until the end of their next turn. |
| **IV** | **Siccatite (cold), high grade** *(rare)* | item level **17**, 15,000 gp | The contact damage becomes 1d6 cold, and your Cast cold damage applies to the Strike even when Blue is not your Cast. |

**Design note.** Blue is the *control* colour. Slowed and Speed reduction are among the most valuable
things in PF2e's action economy, so Blue is deliberately the colour with the **weakest raw damage
riders** — none of its entries add dice, they all add tempo denial.

---

## 9 — 🟣 PURPLE — *the Threshold*

> Amethyst, duskwood, warpglass. The colour of being somewhere else, and of hitting the thing
> inside the armour rather than the armour.

**Damage:** mental; force · **Resists:** mental
**Greater rider (Tier IV):** on a hit, you may **Step** 5 feet as a free action; on a critical hit,
you may instead teleport up to 15 feet to a space you can see.

| Tier | Entry | Canon anchor | Trait (always on) |
| :-: | :-- | :-- | :-- |
| **I** | **Niello / tarnished silver** | mundane, purple-black patina | +1 item bonus to Deception to Create a Diversion. |
| **II** | **Amethyst** | 5 gp | +1 item bonus to Will saves against emotion effects. |
| **II** | **Tourmaline** | 5 gp | You know which direction is north, and you know how far you are from where you began the day. |
| **II** | **Duskwood** *(uncommon)* | "dark as ebony but with a **slight purple tint**"; standard grade, item level **11**, 1,400 gp | Duskwood reduces Bulk. Your Carapace's Bulk counts as 1 lower, and you ignore the first 1 Bulk of anything you carry. |
| **III** | **Imperial amethyst** *(grade rule)* | amethyst at Tier III, 100 gp | Your mental damage ignores the first 5 points of mental resistance. Creatures immune to mental damage instead take half. |
| **III** | **Dreamweb** *(rare)* | the webs of the Weaver of Webs; grants poison resistance on light armour | Poison resistance 3, and you need only 4 hours of rest for a full night's sleep — but you dream of somewhere that is not here, every night, without exception. |
| **IV** | **Warpglass** *(rare)* | raw quintessence of the **Maelstrom**; opalescent, unstable, "changes its appearance to random striations of other metals and stone"; high grade, item level **17**, 13,500 gp | **Your Carapace stops having a fixed colour.** Once per day at daily preparations, choose any colour in this lexicon; until your next preparations, warpglass counts as a Tier IV material of that colour for determining your Cast. The wildcard, and correctly the rarest thing here after orichalcum. |

**Design note.** Purple is the *mobility and mind* colour, and Warpglass is its capstone precisely
because warpglass in canon has no fixed identity. A Purple Carapace at 17th who feeds it warpglass is
buying the right to be a different class every morning — which is the single most on-theme thing this
lexicon can offer, and should be priced like it.

---

## 10 — ⚫ BLACK — *the Maw*

> Adamantine and obsidian. The hardest thing known and the sharpest thing known, and neither of them
> is subtle.

**Damage:** void; slashing · **Resists:** void
**Greater rider (Tier IV):** your Carapace Strikes gain the **critical specialization effect** of the
knife group, and on a critical hit the target takes 2d10 persistent bleed.

| Tier | Entry | Canon anchor | Trait (always on) |
| :-: | :-- | :-- | :-- |
| **I** | **Obsidian** | 5 sp | Your Carapace Strikes can deal slashing damage instead of bludgeoning. |
| **I** | **Jet** | mundane black lignite | +1 item bonus to Stealth in dim light or darkness. |
| **I** | **Onyx** | 25 sp | +1 item bonus to Will saves against void effects. |
| **II** | **Pearl, black** | 50 gp | You gain darkvision if you don't already have it; if you do, you can see through magical darkness of 1st rank or lower. |
| **III** | **Adamantine** *(uncommon)* | "**shiny, black**… one of the hardest metals known"; standard grade, item level **11**, 1,400 gp | Your unarmed Strikes count as adamantine, and you **ignore an object's Hardness up to 10** when you Strike it. Your Carapace's own Hardness increases by 5. |
| **III** | **Sloughstone** *(rare)* | Verex-That-Was's shed flesh; unpleasant to process, +4 to the Craft DC | Your Strikes deal +1d6 void damage to aberrations and to creatures that have been transformed against their will. Nobody likes that you have this. |
| **IV** | **Black diamond (carbonado)** *(grade rule)* | a diamond at Tier IV, 500 gp | Your void damage ignores the first 10 points of void resistance, and creatures immune to void instead take half. |
| **IV** | **Adamantine, high grade** *(uncommon)* | item level **17**, 13,500 gp | Ignore Hardness up to 20; Carapace Hardness increases by 10; and your Strikes treat a creature's physical resistances as 5 lower. |

**Design note.** Black is the *nothing stops this* colour, and its Tier III/IV adamantine entries are
the ones a party will actually plan around — ignoring Hardness is a structural ability, not a damage
bump. Note that Black does **not** get an "ignore resistance" bonus on top of Gray's; if you want
both, you have to split your Lattice between them, and then neither is your Cast at full value.

---

## 11 — ⚪ WHITE — *the Reliquary*

> Diamond, pearl, moonstone, dawnsilver. The colour that protects, and the colour that sees.

**Damage:** spirit; vitality · **Resists:** spirit
**Greater rider (Tier IV):** on a hit, one ally within 30 feet gains temporary Hit Points equal to
half your level, which last 1 minute.

| Tier | Entry | Canon anchor | Trait (always on) |
| :-: | :-- | :-- | :-- |
| **I** | **Pearl, irregular freshwater** | 5 sp | +1 item bonus to Medicine. |
| **I** | **Moonstone** | 25 sp | +1 item bonus to Perception to Seek for hidden or undetected creatures. |
| **I** | **Alabaster** | mundane stone | +1 item bonus to saves against effects that would make you frightened. |
| **II** | **Pearl, saltwater** | 5 gp | When you Administer First Aid, you may do so as a single action instead of two. |
| **II** | **Opal** | 50 gp | Once per day, when an ally within 30 feet is reduced to 0 Hit Points, they are instead reduced to 1. |
| **III** | **Diamond, small** | 100 gp | Your Carapace's Hardness increases by 3, and you are permanently under the effect of *see invisibility* for creatures within 30 feet. |
| **III** | **Dawnsilver** *(uncommon)* | "the same sheen as silver but a **slightly lighter hue**"; counts as silver; reduces Bulk; standard grade, item level **11**, 1,400 gp | Your Strikes count as silver. Your Carapace's Bulk counts as 1 lower. Note: dawnsilver is White rather than Gray on purpose — see §12. |
| **IV** | **Diamond, large** | 500 gp | Hardness increases by 8 instead of 3, and once per day you may reduce the damage from one effect by an amount equal to your level. |
| **IV** | **Keep stone** *(rare)* | adamantine smelted with lead; "**more closely resembles marble than metal**"; disrupts magic — raw keep stone forces a **DC 5 flat check** or the spell is lost; high grade only, item level **18**, 22,500 gp | Any spell or magical effect that targets **you specifically** must succeed at a DC 5 flat check or be lost. This is a brutally good defensive ability and it is priced at 22,500 gp and 18th level for exactly that reason. |

**Design note.** White is the *defence and party-support* colour, and it is the only colour whose
Greater rider points at an ally rather than an enemy. Keep stone's flat check is the single most
contentious number in this document — it is canon for raw keep stone as an object, and extending it
to the wearer is a genuine extrapolation. Flag it for the ledger pass; if it's too strong, the fix is
to make it once per round rather than always.

---

## 12 — ⚪ GRAY / SILVER — *the Anvil*

> No element. No gimmick. The Strike itself, sharper.

**Damage:** *none — physical only* · **Resists:** bludgeoning, piercing, slashing (at half the tier
value each, since it's three types)
**Greater rider (Tier IV):** your Carapace Strikes gain **one additional damage die** of their own
type — for an unarmed Carapace Strike, one more of whatever it already rolls.

**Gray's offensive package is different from every other colour**, because it has no energy type to
convert to. Instead:

| Tier | Cast offence for Gray |
| :-: | :-- |
| **I** | Your Strikes count as **silver** and as **cold iron**. |
| **II** | **+1 circumstance bonus to damage** per die (i.e. the *striking*-adjacent effect: +1 per damage die you roll). |
| **III** | Treat a creature's **physical resistances as 5 lower**. |
| **IV** | **+1 damage die** on your Carapace Strikes, and physical resistances count as 10 lower. |

| Tier | Entry | Canon anchor | Trait (always on) |
| :-: | :-- | :-- | :-- |
| **I** | **Steel** | mundane | +1 item bonus to Crafting. |
| **I** | **Hematite** | 5 sp | +1 item bonus to Athletics to Grapple or Shove. |
| **I** | **Lead / pewter** | mundane | You are not detected by divinations of 3rd rank or lower that would locate you by name. |
| **I** | **Tin** | mundane | Your Carapace does not corrode. You are immune to the rusting effects of *rust*-type attacks. |
| **II** | **Silver, low grade** | item level **2**, 40 gp | Your Strikes count as silver, independent of Cast. |
| **II** | **Cold iron, low grade** | item level **2**, 40 gp | Your Strikes count as cold iron, independent of Cast. |
| **II** | **Quicksilver (mercury)** | mundane, dangerous | +1 item bonus to Reflex saves; −1 item penalty to Will saves. A real trade, on purpose. |
| **III** | **Silver / Cold iron, standard grade** | item level **10–11**, 880–1,400 gp | As above, and your Strikes treat silver and cold-iron weaknesses as 5 higher. |
| **III** | **Inubrix** *(rare)* | "**pale, malleable**"; partially **passes through iron and steel**; standard grade, item level **11**, 1,400 gp | Your Strikes ignore any circumstance bonus to AC a creature gains from metal armour or a metal shield. Inubrix is "barely sturdier than lead": your Carapace's Hardness is reduced by 3. |
| **III** | **Siccatite (hot)** *(rare)* | "**silvery ore**… scalding hot"; standard grade, item level **11**, 1,400 gp | A creature that touches you takes 1 fire damage per round of contact, and flammable objects you touch may ignite. Dual-listed with Blue (cold siccatite) — one ore, two temperatures, canon is explicit that metallurgists disagree about why. |
| **III** | **Sovereign steel** *(rare)* | Kevoth-Kul's alloy of **cold iron and noqual**; +4 circumstance bonus on the item's saves against magic; standard grade | +1 circumstance bonus to saves against magic, and your Strikes count as cold iron. Shields of sovereign steel do not exist because the Black Sovereign banned them; your Carapace is not a shield, and the smiths of Starfall would like you to stop asking. |
| **IV** | **Silver / Cold iron, high grade** | item level **16–17**, 9,000–13,500 gp | As Tier III, and weaknesses count as 10 higher. |
| **IV** | **Sovereign steel, high grade** *(rare)* | item level **17** | The circumstance bonus becomes +2, and once per day you may reroll a failed save against a spell. |

**Design note — why dawnsilver is White and silver is Gray.** They are close in canon (dawnsilver
"has the same sheen as silver but a slightly lighter hue", and counts as silver for weaknesses), and
it would be defensible to put both in Gray. I split them because Gray's identity is *bane metals and
raw physicality*, while dawnsilver's canon flavour is dawn, lightness, and effectiveness against
devils and lycanthropes — that's White's territory. The practical consequence is good for the class:
a player who wants the silver keyword can get it from either colour, which means Gray isn't mandatory
for anyone fighting werewolves.

---

## 13 — Loose ends, on purpose

Four things in this lexicon are deliberately unresolved, because they're your call, not mine.

**1. Sisterstone is a *pair*, and the lexicon splits it across two colours.** Canon: dusk sisterstone
is pale orange, scarlet sisterstone is orange-red, and "when near an object made of the other type of
sisterstone, they both begin exuding spiritual energy that repels undead." A Carapace holding **both**
should get something no other combination gives — I'd propose: *your Carapace emanates a 10-foot aura;
undead entering it must succeed at a Will save against your class DC or be unable to willingly move
closer to you for 1 round.* This is the lexicon's only **combination** effect, and it's the proof of
concept for a whole category of them if you want that.

**2. Noqual's home colour.** It's canon pale green, which is why it's in Green. But sovereign steel is
literally an alloy of **noqual and cold iron**, and cold iron is Gray — so the anti-magic line is
currently split across two colours for no player-facing reason. Moving noqual to Gray makes Gray the
clean "anti-magic and anti-resistance" colour and leaves Green purely venomous. I lean towards moving
it; I left it in Green because "pale green" is what the book says.

**3. Non-metal, non-gem materials.** The Carapace as pitched eats *metals and gems*, but PF2e's
material list also contains **duskwood** and **peachwood** (woods), **dragonhide** and **grisantian
pelt** (hides), and **dreamweb** (silk). I've folded four of them in — duskwood to Purple, grisantian
pelt to Gold, dreamweb to Purple — because their colours and properties were too good to waste. If
you want the class strictly mineral, those four entries come out and Purple loses its Tier II metal
entirely. **Dragonhide** I've left out completely: it's "immune to one damage type, depending on the
type of dragon", which is a *whole subsystem* and deserves either its own feat line or nothing.

**4. Peachwood** is unassigned. Canon: "a particularly auburn tinge under direct sunlight", and it
bypasses a portion of undead physical resistance. Auburn puts it in Orange or Red, but its mechanical
identity is anti-undead, which is Gold's and White's. I'd put it in **Orange** on colour and let the
anti-undead rider be the reason someone splashes Orange — but it is genuinely arbitrary and you
should just pick.

---

## 14 — What's next

This document is the food. The class still needs:

1. **The chassis** — Hit Points, proficiencies, key attribute, and what a "Carapace Strike" actually
   is (my assumption throughout: unarmed, like the Saint, since the whole conceit is that the armour
   *is* the weapon).
2. **The 2100-point BCS ledger**, costing the Lattice, the Cast, and the tier table above against
   `BCS 1.4`. Every number in §2.4 is provisional until that pass happens.
3. **Cast techniques** — the per-colour ability ladders that make each Cast play differently, in the
   shape the Saint's Cloth Techniques and the Breath Slayer's Forms already use.
4. **The feat list**, 1st–20th.
5. **The automation plan** — the Lattice is a good fit for the module's existing effect machinery;
   a bound material is an Effect item with rule elements, and the Cast is a recalculation on daily
   preparations.

Tell me which of the four loose ends in §13 you want closed, and whether the class keeps the name
**Carapace**, and I'll take it to the chassis and the ledger next.

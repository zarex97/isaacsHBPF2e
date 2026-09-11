# The Assimilator — Material Lexicon, **Version 3**

### *The symbiont class · Substrate · Essence · Mutation*

> **An alternative to v2, not a replacement.** v2 and v3 solve the same problem two different ways and
> both are on the table. v2 invented 72 materials that exist only for this class and used colour as a
> *sorting* label. **v3 uses 36 real, recognisable materials and makes colour a mechanical layer of its
> own.** §14 compares them honestly so you can pick. Delete the loser when you've decided.

**The structural rule this whole document is built on:**

> **Colour determines the symbiont's fundamental instinct.**
> **Substrate determines the specific mutation that instinct produces.**

Two Red characters are both aggressive. A **Ruby** build and an **Iron** build are not the same class.

**Anchored to system data** from `pf2e_fork`: damage types from `src/scripts/config/damage.ts`, the
property-rune curve for every damage rider, resistance benchmarks from `packs/pf2e/class-features`
(*Raging Resistance* = 3 + Con at 9th), and item-level Price bands sampled from
`packs/pf2e/equipment`.

---

## 1 — Three layers of vocabulary

The class does not call everything "materials." It has three words and they mean different things.

| Layer | What it is | Examples |
| :-- | :-- | :-- |
| **Substrate** | The physical substance consumed | Ruby · Iron · Gold · Emerald |
| **Essence** | What that substance *represents* | Flame · Brutality · Amplification · Regeneration |
| **Mutation** | What the symbiont actually grows | Furnace Veins · Dense Frame · Gilded Core · Knitting Flesh |

> *"My symbiont has assimilated the **Ruby** and **Iron** Substrates, giving it the **Flame** and
> **Brutality** Essences, which manifested as **Molten Fangs**."*

Three more terms carry the mechanics:

- **Depth** — how much of one Substrate you've fed it. 1 to 4. Power.
- **Instinct** — the colour you've invested the most Mass in. Identity.
- **Bond** — a named ability produced by two specific Substrates held together. Character.

---

## 2 — The nine Instincts

| | Colour | Instinct | Mechanical direction |
| :-- | :-- | :-- | :-- |
| 🔴 | **Red** | **Consume / Destroy** | Damage, brutality, fire, bleeding |
| 🟡 | **Gold** | **Amplify / Dominate** | Buffs, power, criticals, auras |
| 🟠 | **Orange** | **Move / React** | Speed, mobility, reactions, electricity |
| 🔵 | **Blue** | **Adapt / Understand** | Control, perception, cold, intellect |
| 🟣 | **Purple** | **Mutate / Transcend** | Magic, mutation, strange abilities |
| 🟢 | **Green** | **Grow / Reproduce** | Regeneration, poison, biological growth |
| ⚫ | **Black** | **Consume / Corrupt** | Draining, darkness, debuffs, entropy |
| ⚪ | **White** | **Preserve / Purify** | Defence, healing, cleansing |
| ⚙️ | **Gray** | **Harden / Integrate** | Armour, physical adaptation, suppression |

**Red and Black are both consumption, and that's the point.** Red consumes to **destroy** — it turns
what it eats into heat and gets rid of it. Black consumes to **assimilate** — it keeps what it eats
and adds it to itself. Two different evolutionary answers to the same appetite, and they should never
feel like the same build.

### 2.1 The Instinct clauses — where colour stops being a label

Your Instinct is the colour you have invested the most total **Mass** in (§3.2), counting metals and
gems together. It applies **one clause to every Mutation you have**, including Mutations from other
colours. This is the mechanism that makes "Ruby accessed through a different Instinct manifests
differently" true rather than merely stated.

| Instinct | Clause — applies to all your Mutations |
| :-- | :-- |
| 🔴 **Red** | *Everything you grow is a weapon.* When a Mutation deals damage, it deals **+1 damage per Depth** of its Substrate. Against a creature that has already lost Hit Points this encounter, **double** that bonus. |
| 🟡 **Gold** | *One thing, made imperial.* At daily preparations choose one bound Substrate; it counts as **one Depth higher** for its numeric effects (never above your level's Depth cap). When you critically hit, you may apply the **Depth 4 rider** of that Substrate even if you haven't reached Depth 4. |
| 🟠 **Orange** | *Nothing you grow is still.* The first time each round you Stride, Step, or use a reaction, your next Mutation this round deals **+1d4** of its own damage type. You gain **+5 feet Speed** per bound Orange Substrate. |
| 🔵 **Blue** | *It learns the thing before it kills it.* Study a creature (one action, Perception or a relevant Recall Knowledge). Until the encounter ends, your Mutations treat that creature's resistances as **5 lower** and you gain **+1 circumstance to AC** against it. One creature at a time. |
| 🟣 **Purple** | *It does not stay the same shape twice.* Your Mutations count as **magical**. At daily preparations, one Substrate of your choice manifests **one Depth higher** — and one other, randomly determined, manifests **one Depth lower**. You never quite know what you woke up as. |
| 🟢 **Green** | *Every wound is material.* When a Mutation deals damage, gain **temporary Hit Points equal to its Substrate's Depth**. You have **fast healing equal to the number of bound Green Substrates**. |
| ⚫ **Black** | *It takes what it touches.* When a Mutation damages a creature, that creature takes a **−1 status penalty** to a check or DC of your choice until the end of its next turn, and **you gain a +1 status bonus to the same thing**. What it loses, you get. |
| ⚪ **White** | *It will not let you die.* When a Mutation deals damage, one ally within 30 feet gains **temporary Hit Points equal to its Depth**. Once per day, end one condition on yourself or an ally as a free action. |
| ⚙️ **Gray** | *The host and the thing agree.* Your Carapace's **Hardness increases by the total Depth of your bound metals**. When you use a Mutation, gain **resistance equal to its Depth** to all physical damage until the start of your next turn. |

**Worked example — the same Substrate under two Instincts.** *Ruby, Depth 3.* Base: +1d6 fire, and
fire resistance counts 5 lower.
- Under **Red**: +1d6 fire, **+3 damage**, **+6** against anything already bloodied. Ruby is a furnace.
- Under **Green**: +1d6 fire, and **3 temporary Hit Points every time it burns something**. Ruby is a
  metabolism.
- Under **Black**: +1d6 fire, and every burn imposes **−1** on a save of your choosing while **you**
  get +1 to the matching thing. Ruby is an act of theft.

Same gem. Three different creatures.

---

## 3 — Feeding, slots and Depth

### 3.1 Two tracks

Metals and gems occupy **separate pools** and never compete for the same space. Metals tend to rewrite
the **body** (structure, resistance, senses, movement); gems tend to rewrite the **output** (damage,
riders, actives). The lists in §5 hold to that split, with deliberate exceptions where a Substrate's
real-world identity demands one (Hematite is a gem that builds body; Cobalt is a metal that shoots).

### 3.2 Mass — the wide-or-deep dial

Instead of counting slots, each track has a pool of **Mass**. A Substrate at **Depth N costs N Mass**.

| Level | 1 | 3 | 5 | 8 | 11 | 14 | 17 | 20 |
| :-- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **Gem Mass** | 1 | 2 | 3 | 5 | 7 | 9 | 11 | 13 |
| **Metal Mass** | 1 | 1 | 2 | 4 | 5 | 7 | 8 | 10 |
| **Depth cap** | 1 | 1 | 2 | 2 | 3 | 3 | 4 | 4 |

So a 20th-level Assimilator has 13 Gem Mass: three gems at Depth 4 and one at Depth 1, or thirteen gems
at Depth 1, or anything between. **Wide or deep is the build question**, and it's asked twice — once
for each track.

Gems outnumber metals throughout. Gems are where variety lives; metals are heavier, fewer, and more
defining.

### 3.3 Feeding and shedding

**Feeding** is a 10-minute activity. The Substrate is **consumed**. Feeding a Substrate you already
hold raises its Depth by 1 (paying the extra Mass); feeding a new one starts it at Depth 1.

At daily preparations you may **shed** any Substrate or reduce any Depth, freeing that Mass. What you
shed is destroyed, not recovered. So rebuilding costs *material*, which is the whole pitch: your build
is a stomach, and changing it means eating something else.

### 3.4 What a Depth is worth

The general ladder. Individual Substrates in §5 use it or state their own.

| Depth | Offensive Substrates | Defensive Substrates | Unlocked at |
| :-: | :-- | :-: | :-: |
| **1** | Strikes may deal the Substrate's damage type | Resistance **2** | 1st |
| **2** | **+1d4** of that type | Resistance **5** | 5th |
| **3** | **+1d6** of that type | Resistance **8** | 11th |
| **4** | **+1d6**, plus the Substrate's capstone rider | Resistance **12** | 17th |

Honest against the rune curve and slightly behind it: *flaming* is +1d6 at item level 8, *greater
flaming* is +1d6 plus 2d10 persistent at 15. Depth 3 lands at 11th and Depth 4's rider at 17th. The
Assimilator is unarmed and will never own a rune, so paying two or three levels of lateness for a
rune-equivalent is roughly the right trade.

### 3.5 Bonds

**Bond slots: 1 at 4th, then 8th, 12th, 16th, 20th — five total.** A Bond requires **both** its
Substrates at **Depth 2 or higher**. Bonds are listed in §13, with a recipe for building new ones.
A Bond should be worth roughly a class feat; that's the budget.

---

## 4 — Reading the entries

Each Substrate gives its **Essence**, the **Mutation** it grows, what the symbiont looks like when it
does, and a four-step Depth ladder. Depth 1 is always available; the rest unlock on the §3.2 cap.

---

## 5 — 🔴 RED · *Consume / Destroy*

> It turns what it eats into heat and throws it away. Red does not keep anything.

### 💎 Ruby — Essence: **Flame**
*Glowing red veins; cracks of internal fire that open wider as the fight goes on.*
**Mutation — Furnace Veins.**

| D | |
| :-: | :-- |
| 1 | Your Carapace Strikes may deal **fire** instead of their normal damage type. You shed dim light in a 10-foot radius and cannot suppress it. |
| 2 | **+1d4 fire.** On a critical hit, **1d4 persistent fire**. |
| 3 | **+1d6 fire.** Fire damage you deal treats fire resistance as **5 lower**. |
| 4 | **+1d6 fire.** On a critical hit, **2d10 persistent fire**, and the target's space burns — a creature ending its turn there takes 1d6 fire. |

### 💎 Garnet — Essence: **Blood**
*Pulsating crimson flesh; blood-like tendrils that reach toward open wounds.*
**Mutation — Crimson Tendrils.**

| D | |
| :-: | :-- |
| 1 | Your Strikes deal **1 persistent bleed** on a critical hit. You may Treat Wounds on yourself. |
| 2 | **+1d4** damage against any creature that has already lost Hit Points this encounter. Critical hits deal **1d6 persistent bleed**. |
| 3 | At the start of your turn, gain **temporary Hit Points equal to half your level** if any creature within 30 feet is taking persistent bleed. |
| 4 | Creatures taking persistent bleed from you take **+2 damage per weapon damage die** from your Strikes. Once per day, drain a dying creature within 30 feet: it dies, you regain Hit Points equal to your level. |

### ⚙️ Iron — Essence: **Brutality**
*Black-red plates growing up through the skin; the limbs get heavier and longer.*
**Mutation — Dense Frame.**

| D | |
| :-: | :-- |
| 1 | +1 item bonus to Athletics. Your unarmed Strikes deal **+1 bludgeoning**. |
| 2 | +2 circumstance bonus to Athletics checks to Shove, Trip or Grapple a creature you have already damaged this encounter. |
| 3 | Your unarmed Strikes gain the **shove** trait, and forced movement you cause increases by **5 feet**. |
| 4 | **+1 damage die** on your unarmed Strikes. A creature you Shove into a wall, hazard or another creature takes bludgeoning damage equal to your level. |

### ⚙️ Copper — Essence: **Heat / Conduction**
*Copper filaments running everywhere under the plate, visibly glowing when it works.*
**Mutation — Conductive Filament.**

| D | |
| :-: | :-- |
| 1 | When a Mutation of yours deals energy damage, the target takes **1 more of that type** at the start of its next turn. |
| 2 | When you take fire or electricity damage, your next Strike before the end of your next turn deals **+1d4** of that type. |
| 3 | Energy damage from your Mutations **conducts**: one creature adjacent to the target takes **2** of that type. |
| 4 | The conduction becomes **half** the energy damage, and reaches any creature touching the same metal object, water, or surface as the target. |

---

## 6 — 🟡 GOLD · *Amplify / Dominate*

> Imperial. Gold does not do things; it makes the other things bigger.

### 💎 Topaz — Essence: **Power**
*The plate thickens into something ceremonial. It looks worn rather than grown.*
**Mutation — Regal Aspect.**

| D | |
| :-: | :-- |
| 1 | +1 item bonus to Intimidation. Your critical hits deal **+2 damage**. |
| 2 | Your unarmed Strikes gain the **critical specialization effect** of the brawling group. |
| 3 | A creature you critically hit is **frightened 1**. |
| 4 | When you critically hit, apply the **Depth 4 rider of one other bound Substrate** to that Strike, whether or not it is at Depth 4. |

### 💎 Citrine — Essence: **Fortune**
*A faint gold shimmer that arrives half a second before anything good happens.*
**Mutation — Gilded Chance.**

| D | |
| :-: | :-- |
| 1 | Once per day, reroll one failed check and take the second result. |
| 2 | Twice per day. The reroll gains a **+2 circumstance bonus**. |
| 3 | Once per encounter, when an enemy within 30 feet critically succeeds at a save against you, it gets a success instead. |
| 4 | Once per day, after seeing the result, **change one d20 roll made within 30 feet by 5** in either direction — yours, an ally's, or an enemy's. |

### ⚙️ Gold — Essence: **Amplification**
*Everything already there gets brighter and slower and more certain of itself.*
**Mutation — Gilded Core.** *Gold does not give you an ability. It makes another Substrate more.*

| D | |
| :-: | :-- |
| 1 | At daily preparations, choose one other bound Substrate. It counts as **one Depth higher** for its numeric effects. This can never exceed your level's Depth cap. |
| 2 | The chosen Substrate also gains the **rider** of that higher Depth, not only the numbers. |
| 3 | Choose **two** Substrates instead of one. |
| 4 | Once per day, as a free action, one chosen Substrate manifests at **Depth 4** for 1 minute regardless of its real Depth. *Apotheosis.* |

### ⚙️ Electrum — Essence: **Resonance**
*Two metals that never fully mixed, and a symbiont that never fully decided.*
**Mutation — Alloyed Instinct.** *The strangest thing in the lexicon, and probably the best.*

| D | |
| :-: | :-- |
| 1 | Choose a second colour. You count as having that Instinct **for the purposes of Bonds only**. |
| 2 | Electrum may stand in for **either Substrate** of any one Bond you know. |
| 3 | You gain your second colour's **Instinct clause** as well — but both clauses operate at **half value** (round down, minimum 1). |
| 4 | Both Instinct clauses operate at **full value**. You are two organisms sharing a host, and they do not always want the same thing. |

---

## 7 — 🟠 ORANGE · *Move / React*

> Hyperactive. Orange's damage is mediocre and its turn order is not.

### 💎 Carnelian — Essence: **Momentum**
*Spurs and vanes that unfold backward when you run and fold flat when you stop.*
**Mutation — Kinetic Spurs.**

| D | |
| :-: | :-- |
| 1 | **+5 feet Speed.** |
| 2 | If you moved at least 10 feet this turn before attacking, your Strike deals **+1d4**. |
| 3 | **+10 feet Speed**, and the bonus becomes **+1d6**. |
| 4 | Once per round, after a Strike, **Stride up to half your Speed** as a free action. |

### 💎 Amber — Essence: **Stored Energy**
*A translucent sac at the sternum that fills visibly and drains visibly.*
**Mutation — Reservoir.**

| D | |
| :-: | :-- |
| 1 | When you take energy damage, store **1 charge** (max 3). Spend 1 as a free action to add **1d4** of that type to a Strike. |
| 2 | Max **5 charges**. Spending 2 adds **1d6 + 2** instead. |
| 3 | You also store a charge whenever you **deal** energy damage, once per round. |
| 4 | Spend 3 charges as a two-action activity: a **30-foot line**, **6d6** of the stored type, basic Reflex against your class DC. |

### ⚙️ Bronze — Essence: **Momentum / Combat**
*Utilitarian, scarred, and it keeps re-forming the parts that break.*
**Mutation — Battle Frame.**

| D | |
| :-: | :-- |
| 1 | You are trained in improvised weapons as martial weapons, and take no penalty for using them. |
| 2 | If you Stride at least 10 feet, your next Strike this turn gains a **+1 circumstance bonus to hit**. |
| 3 | Once per round, make a Strike and then a Shove, Trip or Grapple as a **single action**. |
| 4 | On a critical hit, immediately **Stride up to half your Speed** toward a different enemy as a free action. |

### ⚙️ Mercury — Essence: **Fluidity**
*Silver liquid moving constantly beneath translucent skin. The limbs are not fixed in number.*
**Mutation — Liquid Form.** *This is where the biology starts being alien rather than armoured.*

| D | |
| :-: | :-- |
| 1 | You Squeeze at full Speed and are not off-guard while squeezing. |
| 2 | **Resistance 5** to bludgeoning, piercing and slashing. |
| 3 | Once per round, as a reaction when you are hit, **reduce the damage by your level** as the blow passes through you. |
| 4 | You move through gaps as small as an inch. Once per day, become **amorphous** for 1 minute: immune to precision damage, and critical hits against you deal normal damage. |

---

## 8 — 🔵 BLUE · *Adapt / Understand*

> Cold, intelligent, observant. Blue kills things it has already finished reading.

### 💎 Sapphire — Essence: **Ice / Focus**
*Faceted blue growth along the spine and jaw; the breath fogs indoors.*
**Mutation — Glacial Lattice.**

| D | |
| :-: | :-- |
| 1 | Your Strikes may deal **cold**. +1 item bonus to saves against effects that would break your concentration. |
| 2 | **+1d4 cold.** Critical hits reduce the target's Speeds by **5 feet** until the end of its next turn. |
| 3 | **+1d6 cold.** Critical hits make the target **slowed 1** until the end of its next turn. |
| 4 | **+1d6 cold.** Any creature you damage with cold must succeed at a Fortitude save against your class DC or be **slowed 1** until the end of its next turn. |

### 💎 Lapis Lazuli — Essence: **Knowledge**
*A ring of small dark lenses around the skull, which track independently.*
**Mutation — Reading Eye.**

| D | |
| :-: | :-- |
| 1 | Once per round, **Recall Knowledge** about a creature you can see as a free action. |
| 2 | When you succeed at Recall Knowledge about a creature, allies gain **+1 circumstance to attacks** against it for 1 round. |
| 3 | You automatically learn one **resistance, weakness or immunity** of any creature you damage. |
| 4 | Once per encounter, name a creature's **strongest save**; for 1 minute your Mutations target its **weakest** instead. |

### ⚙️ Cobalt — Essence: **Energy / Conductivity**
*A lash of blue-white energy that is not attached to anything and comes back anyway.*
**Mutation — Arcane Channel.** *Blue's ranged option, and the only Substrate that makes the Assimilator a ranged class.*

| D | |
| :-: | :-- |
| 1 | You gain a **30-foot ranged unarmed Strike** dealing **1d6** damage of your Instinct's type. |
| 2 | Range **60 feet**; damage **2d6**. |
| 3 | Your Mutations' energy damage counts as **magical**; +1 circumstance bonus to counteract checks. |
| 4 | Range **120 feet**; damage **4d6**; once per round it may target **two** creatures. |

### ⚙️ Tin — Essence: **Sensitivity**
*Fine hairs, pits and antennae across the plate. It is deeply unsettling to watch them move.*
**Mutation — Sensory Bloom.** *Not "another metal that grants resistance."*

| D | |
| :-: | :-- |
| 1 | **Imprecise tremorsense 30 feet.** |
| 2 | You detect the presence of magic within 30 feet as an **imprecise sense**. |
| 3 | Tremorsense **60 feet**. Invisible creatures within 30 feet are **concealed** to you rather than undetected. |
| 4 | **Precise tremorsense 30 feet.** You can track any creature that passed within 30 feet of you in the last 24 hours with a +2 circumstance bonus. |

---

## 9 — 🟣 PURPLE · *Mutate / Transcend*

> The alien colour. Purple is the one that stops looking like armour.

### 💎 Amethyst — Essence: **Psychic**
*Violet spines across the crown, and other people's dreams start including you.*
**Mutation — Thought-Spines.**

| D | |
| :-: | :-- |
| 1 | **Telepathy 30 feet** with willing creatures with whom you share a language. |
| 2 | Your Strikes may deal **mental**; **+1d4 mental**. |
| 3 | **+1d6 mental.** On a critical hit the target is **stupefied 1** until the end of its next turn. |
| 4 | **+1d6 mental.** Once per round, a creature you damage must succeed at a Will save against your class DC or be **confused** until the end of its next turn. |

### 💎 Quartz — Essence: **Arcane Resonance**
*Clear prisms growing through the plate at angles that don't match the body underneath.*
**Mutation — Prism Node.**

| D | |
| :-: | :-- |
| 1 | +1 circumstance bonus to saves against magic, and you know when a spell is cast within 30 feet. |
| 2 | Once per day, **counteract** one magical effect (counteract rank = half your level; modifier = your class DC − 10). |
| 3 | When you counteract an effect, or a spell fails against you, your next Strike deals **+2d6 force**. |
| 4 | Twice per day counteract. Once per day, **reflect** a spell that targets only you back at its caster (Will save against your class DC negates). |

### ⚙️ Platinum — Essence: **Transcendence**
*It stops being a colour and starts being a quality of light. Extremely rare.*
**Mutation — Ascendant Plate.**

| D | |
| :-: | :-- |
| 1 | +1 circumstance bonus to saves against magic. |
| 2 | **Resistance 5** to your Instinct's damage type. You no longer need to breathe. |
| 3 | Once per day, gain a **fly Speed equal to half your land Speed** for 1 minute. |
| 4 | Permanent **fly Speed equal to your land Speed**. You cannot be slowed by magical effects. |

### ⚙️ Nickel — Essence: **Mutation**
*You do not know what it will be tomorrow. Neither does it.*
**Mutation — Unstable Growth.** *The evolution lottery.*

At daily preparations, gain one **Aberration** — roll or choose:
**(1) A limb** — an additional unarmed Strike, agile, 1d6 of a physical type. **(2) An organ** — one
sense: darkvision, scent (imprecise 30 ft), or low-light plus +2 Perception. **(3) A mode** — a climb
or swim Speed equal to half your land Speed. **(4) A plate** — Hardness +3 and a −5-foot Speed penalty.
**(5) A gland** — once per encounter, a 15-foot cone dealing 2d6 of your Instinct's type, basic Reflex.
**(6) A maw** — your jaws gain the **deadly d8** trait.

| D | |
| :-: | :-- |
| 1 | One Aberration. |
| 2 | **Two** Aberrations. |
| 3 | Once per encounter, as a single action, **re-roll all your Aberrations**. |
| 4 | **Three** Aberrations, and one of them may instead be the **Depth 4 rider of any other Purple Substrate**. |

---

## 10 — 🟢 GREEN · *Grow / Reproduce*

> The most biological branch. Green does not win fights; it is still there afterwards.

### 💎 Emerald — Essence: **Regeneration**
*Open seams that close while you watch, leaving pale green scar tissue that also closes.*
**Mutation — Knitting Flesh.**

| D | |
| :-: | :-- |
| 1 | **Fast healing 1** while you have at least 1 Hit Point and are below your maximum. |
| 2 | **Fast healing 2.** Once per day, regrow a severed part over 1 hour. |
| 3 | **Fast healing 5.** You stabilize automatically when dying. |
| 4 | **Fast healing 10.** Once per day, when reduced to 0 Hit Points, be reduced to 1 instead and gain fast healing 15 for 1 minute. |

### 💎 Jade — Essence: **Vitality**
*Dense, cool, and very slightly translucent. It is thicker over the organs.*
**Mutation — Deep Root.**

| D | |
| :-: | :-- |
| 1 | +1 item bonus to Fortitude saves. |
| 2 | **Resistance 5** to poison. You are immune to disease. |
| 3 | Once per day, when you roll a success on a Fortitude save, get a **critical success** instead. |
| 4 | Once per **round** instead of once per day. You cannot be **drained** or **enfeebled**. |

### ⚙️ Zinc — Essence: **Biological Adaptation**
*The surface changes texture depending on what last hurt it, and does not change back.*
**Mutation — Shifting Tissue.**

| D | |
| :-: | :-- |
| 1 | At daily preparations, choose one energy damage type. Gain **resistance 2** to it. |
| 2 | **Resistance 5.** Change the chosen type as a single action, once per day. |
| 3 | **Resistance 8.** Once per round, as a reaction when you take energy damage, change the chosen type **to that type** — after learning the type, before damage applies. |
| 4 | **Resistance 12.** The reaction is unlimited, and you keep resistance to the previously chosen type as well. |

### ⚙️ Chromium — Essence: **Armour / Regeneration**
*A hard, bright, corrosion-proof lacquer over everything. It buffs out.*
**Mutation — Lacquer Shell.**

| D | |
| :-: | :-- |
| 1 | Carapace **Hardness +2**. **Resistance 2** to acid. |
| 2 | **Hardness +5**, **resistance 5** to acid. Your Carapace repairs 1 Hit Point per hour on its own. |
| 3 | **Hardness +8**, **resistance 8** to acid. You are immune to rust, corrosion and effects that damage your items with acid. |
| 4 | **Hardness +12**, **resistance 12** to acid. Once per encounter, when your Carapace's Hardness would be reduced or bypassed, it isn't. |

---

## 11 — ⚫ BLACK · *Consume / Corrupt*

> Venom territory. Black keeps everything it eats, and it is always eating.

### 💎 Onyx — Essence: **Darkness**
*The plate stops returning light. Edges become genuinely hard to locate.*
**Mutation — Shadow Mantle.**

| D | |
| :-: | :-- |
| 1 | **Darkvision.** +1 item bonus to Stealth in dim light or darkness. |
| 2 | Once per day, create a 20-foot emanation of **magical darkness** for 1 minute. You see through it normally. |
| 3 | In dim light or darkness you may **Hide and Sneak without cover or concealment**, and gain +1 circumstance to AC. |
| 4 | Once per round, as a single action, **teleport between two areas of darkness** within 60 feet. |

### 💎 Jet — Essence: **Death**
*Fossilised organic matter — which is what the symbiont is doing to you, slowly.*
**Mutation — Carrion Bloom.**

| D | |
| :-: | :-- |
| 1 | Your Strikes may deal **void**. +1 item bonus to saves against death effects. |
| 2 | **+1d4 void.** Gain **2 temporary Hit Points** when you reduce a creature to 0 Hit Points. |
| 3 | **+1d6 void.** A creature you kill cannot be returned to life by magic below 6th rank. |
| 4 | **+1d6 void.** Once per day, a creature within 30 feet at or below half Hit Points must succeed at a Fortitude save against your class DC or take **void damage equal to twice your level**. |

### ⚙️ Lead — Essence: **Suppression**
*Heavy, dull, and magic stops working properly in the room. This is the anti-magic Substrate.*
**Mutation — Null Weight.**

| D | |
| :-: | :-- |
| 1 | +1 circumstance bonus to saves against magic. Divinations of 3rd rank or lower cannot locate you. |
| 2 | Once per round, when a Mutation damages a creature, it takes **−1 status to its next save**. |
| 3 | Creatures within 10 feet take **−1 status to spell attack rolls and spell DCs**. |
| 4 | Once per encounter, as a two-action activity, **suppress magical effects in a 15-foot emanation for 1 round** (counteract each; rank = half your level). |

### ⚙️ Manganese — Essence: **Corrosion**
*A dark violet-black bloom that leaves pitting on everything it has touched.*
**Mutation — Rot Touch.** *The "eat away at you" playstyle.*

| D | |
| :-: | :-- |
| 1 | Your Strikes deal **1 persistent acid** on a critical hit. |
| 2 | A creature you damage has **all its resistances reduced by 2** until the end of its next turn. |
| 3 | Reduced by **5**. Objects you Strike take a cumulative **−1 item penalty** (to a maximum of −3) until Repaired. |
| 4 | Reduced by **10**. A creature that ends its turn adjacent to you takes **1d6 persistent acid**. |

---

## 12 — ⚪ WHITE · *Preserve / Purify*

> The symbiont that wants to keep its host alive, with or without the host's cooperation.

### 💎 Diamond — Essence: **Hardness**
*Colourless, flawless, and it does not deform. Neither do you, now.*
**Mutation — Adamant Skin.**

| D | |
| :-: | :-- |
| 1 | Carapace **Hardness +2**. |
| 2 | **Hardness +5.** Reduce persistent damage you take by 2. |
| 3 | **Hardness +8.** Once per encounter, a critical hit against you deals **normal damage** instead. |
| 4 | **Hardness +12.** Once per **round** instead of once per encounter. |

### 💎 Pearl — Essence: **Purification**
*Layers, laid down over an irritant. You are the irritant.*
**Mutation — Clear Tide.**

| D | |
| :-: | :-- |
| 1 | +1 item bonus to saves against poison and disease. Once per day, reduce one condition's value by 1. |
| 2 | Once per encounter, as a single action, **end one condition of value 1** on yourself or an adjacent ally. |
| 3 | Range **30 feet**, and it may instead reduce one **affliction's stage** by 1. |
| 4 | **Twice** per encounter, and it may instead **counteract** one spell effect of 4th rank or lower. |

### ⚙️ Aluminium — Essence: **Lightness**
*Almost nothing. The plate is there and it weighs less than the clothes underneath.*
**Mutation — Hollow Frame.** *White's unexpected mobility branch.*

| D | |
| :-: | :-- |
| 1 | Your Carapace has **no Bulk** and imposes no penalties. **+5 feet Speed**. |
| 2 | **+10 feet Speed.** You take no damage from falls of less than 30 feet. |
| 3 | You Leap twice as far. Once per day, **Fly 30 feet** as a single action. |
| 4 | Permanent **fly Speed 20 feet**. You may end your turn in midair without falling. |

### ⚙️ Magnesium — Essence: **Radiance**
*It burns white and it does not care what it is burning.*
**Mutation — Flare Core.**
*My substitution. You had Silver in both White and Gray and preferred it in Gray — §15.1 explains.*

| D | |
| :-: | :-- |
| 1 | You shed **bright light in a 20-foot radius** at will. +1 item bonus to saves against blindness and dazzle. |
| 2 | Once per encounter, as a single action: creatures in a **15-foot emanation** must succeed at a Fortitude save against your class DC or be **dazzled** for 1 round. |
| 3 | On a failed save they are **blinded** for 1 round instead. The flare deals **fire damage equal to your level** to creatures with light sensitivity or light blindness. |
| 4 | The emanation becomes **30 feet** and **counteracts magical darkness**. Once per day, it instead heals each ally within it for your level. |

---

## 13 — ⚙️ GRAY / SILVER · *Harden / Integrate*

> The "perfect the host" colour. Gray is not trying to become something else.

### 💎 Hematite — Essence: **Blood / Iron**
*Iron-grey, blood-red when scratched. The bridge between Red, Green and Gray.*
**Mutation — Ferrous Blood.**

| D | |
| :-: | :-- |
| 1 | +1 item bonus to Athletics. You are immune to **persistent bleed**. |
| 2 | Gain **temporary Hit Points equal to your level** at the start of each encounter. |
| 3 | +2 status bonus to Fortitude saves. You cannot be **drained**. |
| 4 | Once per day, when you are reduced to 0 Hit Points, immediately stand with **Hit Points equal to your level**. |

### 💎 Moonstone — Essence: **Adaptation**
*Pale, and the sheen inside moves to whichever side was last struck.*
**Mutation — Reactive Evolution.**

| D | |
| :-: | :-- |
| 1 | Once per encounter, as a reaction after taking damage of a type, gain **resistance 2** to that type for 1 minute. |
| 2 | **Resistance 5**, twice per encounter. |
| 3 | **Resistance 8**, it lasts until the encounter ends, and you may hold **two** types at once. |
| 4 | **Resistance 12**, unlimited uses, **three** types at once. The first time each encounter you would take damage of a type you already resist, you take **none**. |

### ⚙️ Steel — Essence: **Structure**
*Straightforward. Nothing about this is strange and that is its whole appeal.*
**Mutation — True Plate.**

| D | |
| :-: | :-- |
| 1 | Carapace **Hardness +2**. Your unarmed Strikes' damage die increases one step. |
| 2 | **Hardness +5.** |
| 3 | **Hardness +8.** Your unarmed Strikes gain the **versatile P** and **versatile S** traits. |
| 4 | **Hardness +12.** **+1 damage die** on your unarmed Strikes. |

### ⚙️ Silver — Essence: **Suppression / Supernatural Integration**
*White is purity. Gray is the thing you actually use on a werewolf.* *Moved here from White, per your note.*
**Mutation — Argent Edge.**

| D | |
| :-: | :-- |
| 1 | Your Strikes count as **silver**. |
| 2 | **+1d4** damage against aberrations, fiends, undead and spirits. |
| 3 | **+1d6** instead. Your Strikes affect incorporeal creatures as though they had the **ghost touch** rune. |
| 4 | **+1d6.** A supernatural creature you critically hit cannot use **reactions or innate spells** until the end of its next turn. |

---

## 14 — Bonds · where the class becomes its own thing

A Bond is what happens when two Substrates are held deep enough, long enough, that the symbiont stops
treating them as separate. It is **not** "both effects at once" — it's a third thing.

**Rules.** A Bond requires both its Substrates at **Depth 2 or higher**. You know a number of Bonds
equal to your Bond slots (**1 at 4th, then 8th, 12th, 16th, 20th**). Shedding either Substrate below
Depth 2 suppresses the Bond until you feed it back. A Bond is budgeted at roughly **one class feat**.

### 14.1 The named Bonds

The thirty below are the starter set — enough to make most builds feel deliberate, few enough to cost
properly.

| Bond | Substrates | Effect |
| :-- | :-- | :-- |
| **Molten Carapace** | Ruby + Iron | Your Carapace's Hardness increases by 5, and a creature that hits you with a melee unarmed or reach attack takes fire damage equal to half your level. |
| **Conduction** | Ruby + Copper | Your fire damage counts as **fire and electricity**, using whichever resistance is lower. Creatures in metal armour take +2 per damage die from it. |
| **Solar Core** | Ruby + Gold | Once per encounter as a two-action activity, ignite: for 1 minute your fire damage increases by one die size and you shed bright light 60 feet. You take 1d6 fire at the start of each of your turns. |
| **Living Flame** | Ruby + Emerald | While you are taking persistent fire damage, or dealing it to anyone, your fast healing increases by 5. You burn what you are, and it grows back. |
| **Blackfire** | Ruby + Onyx | Your fire damage becomes **void and fire**, and sheds *darkness* rather than light. When it kills a creature, you regain Hit Points equal to your level. |
| **Exsanguinary** | Garnet + Jet | Persistent bleed you inflict also heals you for the same amount each time it ticks. |
| **Second Heart** | Garnet + Emerald | Once per day, when you would die, you don't — you drop to 1 Hit Point and are stunned 1 as the second heart takes over. |
| **Siege Frame** | Iron + Steel | You ignore an object's Hardness up to 10, and forced movement you cause increases by an additional 10 feet. |
| **Lightning Lash** | Copper + Cobalt | Your ranged Arcane Channel Strike conducts: it chains to a second creature within 15 feet of the first for half damage. |
| **Crowned Fortune** | Topaz + Citrine | Once per encounter, declare a Strike **imperial** before rolling. On a success it counts as a critical success. |
| **Transmutation** | Gold + Electrum | Gilded Core may name a Substrate of your **second** Instinct, and Alloyed Instinct's half-value clause becomes three-quarters (round up). |
| **Chimera** | Electrum + Nickel | You hold one additional Aberration, and it may be drawn from the Depth-4 rider list of **either** of your Instincts. |
| **Quicksilver Gait** | Carnelian + Mercury | You may Stride through creatures' spaces as though they were difficult terrain, and cannot be caught flat-footed by movement-triggered reactions. |
| **Storm Battery** | Amber + Cobalt | Your Reservoir stores charges from your **own** ranged Strikes, and spending 3 charges lets Arcane Channel target every creature in a 15-foot cone. |
| **Hammerform** | Bronze + Iron | Your unarmed Strikes gain the **fatal d10** trait when you have Stridden at least 10 feet this turn. |
| **Cold Reading** | Sapphire + Lapis Lazuli | Your Studied creature is also **slowed 1** the first time you damage it each round, with no save. |
| **Rime Flow** | Sapphire + Mercury | Your Liquid Form damage reduction also freezes the attacker: it takes cold damage equal to the amount reduced. |
| **Blind Hunter** | Tin + Onyx | Inside your own magical darkness, your tremorsense becomes **precise** and enemies within it are off-guard to you. |
| **Mindstorm** | Amethyst + Quartz | A creature that fails a save against one of your Mutations is **stupefied 1** and its next spell requires a DC 5 flat check. |
| **Ascension** | Platinum + Aluminium | Your fly Speed increases by 20 feet and you may hover. Falling is something that happens to other people. |
| **Runaway Growth** | Nickel + Emerald | Your Aberrations re-roll automatically whenever you drop below half Hit Points, and doing so restores Hit Points equal to twice your level. |
| **Chitin Bloom** | Emerald + Chromium | Your fast healing also repairs your Carapace, and your Hardness increases by your fast healing value. |
| **Immune System** | Jade + Zinc | Shifting Tissue may name **poison, disease or a single spell school** as well as an energy type. |
| **Null Shroud** | Onyx + Lead | Your magical darkness suppresses magical effects inside it (counteract rank = half your level) and cannot itself be counteracted below 6th rank. |
| **Rot** | Jet + Manganese | Persistent acid you inflict also reduces the target's resistances by an additional 5 while it lasts. |
| **Adamant Shell** | Diamond + Steel | Your Hardness bonuses stack fully rather than taking the higher, and you cannot be **off-guard** from flanking. |
| **Cleansing Light** | Pearl + Magnesium | Your Flare Core also ends one condition of value 1 on every ally inside the emanation. |
| **Living Armour** | Hematite + Moonstone | Reactive Evolution triggers off damage taken by an **ally** within 15 feet as well as yourself. |
| **Reaper's Edge** | Silver + Jet | Your void damage ignores the resistances and immunities of incorporeal undead entirely. |
| **Impossible Body** | Diamond + Mercury | You are simultaneously rigid and fluid: keep your Hardness while amorphous, and Liquid Form's reaction has no per-round limit. |

### 14.2 Building a Bond that isn't on the list

The list will not be enough — that's fine, it's meant to grow. The recipe:

1. **Name both Essences, not the Substrates.** *Flame + Brutality*, not *Ruby + Iron*. The Bond comes
   out of what they mean.
2. **Pick exactly one shape**, from the four that the thirty above all use:
   - **Fusion** — one Mutation's damage or effect changes type to include the other's.
   - **Trigger swap** — one Mutation now fires off the other's trigger.
   - **New activity** — a single once-per-encounter action only the pair can do.
   - **Aura** — a persistent, small, always-on emanation.
3. **Budget it at one class feat** of the level where both Substrates could first reach Depth 2 (5th,
   in practice, unless you gate it higher).
4. **Give it a name the player wants to say out loud.** *Blackfire* is doing real work that
   *Ruby-Onyx Synergy* is not.

> **Don't write all 630.** Eighteen gems and eighteen metals make 630 possible pairs, and a complete
> matrix is a trap — it's a year of work, most of it dead, and it makes the interesting Bonds harder
> to find. Thirty good ones plus a recipe is a better system than 630 mediocre ones.

---

## 15 — Rulings this document had to make

### 15.1 Silver was in two colours

You listed Silver under White *and* under Gray, and said Gray was probably better. **I moved it to
Gray** and gave White **Magnesium** (Essence: Radiance) in its place — a metal that burns white,
purifies by light, and gives White a flare/blind/cleanse branch it didn't otherwise have. White is now
purity; Gray is the thing you actually bring to a werewolf.

### 15.2 The count is 36, not 18

Your heading said "18 Core Materials" but the list ran four per colour, and your closing line said 36
(18 gems + 18 metals). **36 is what's here**, and it's the right number — 2 gems + 2 metals per colour
is exactly the density where every Substrate can have a strong identity.

### 15.3 The names collide with real Pathfinder items

This is the one that needs a ruling rather than a shrug. **Ruby, Garnet, Emerald, Jade, Amber,
Amethyst, Topaz, Citrine, Carnelian, Onyx, Jet, Moonstone, Hematite, Lapis Lazuli, Diamond and Pearl
are all already items in `packs/pf2e/equipment`**, priced from 5 sp to 500 gp. Silver and Cold Iron are
already precious materials. A player *will* ask whether the 100 gp ruby they just looted is food.

**The ruling: yes, but only so far.**

| Depth | What it takes |
| :-: | :-- |
| **1–2** | An **ordinary specimen**. The looted ruby works. So does a copper ingot, a steel bar, a pearl off a necklace. Buy it, loot it, prise it out of a statue. |
| **3–4** | A **quickened specimen** — one that grew somewhere the mundane world doesn't reach: inside a creature, along a leyline, at a planar breach, in the ground under something that died badly. These are never shop inventory. |

That gives the class cheap, fun, shoppable progression at low levels, keeps the high end firmly in the
GM's gift, and means the treasure table and the class table never fight. **The class also hands you one
free Substrate every time your Mass increases**, so a forgetful GM or a low-magic campaign can never
leave an Assimilator below its own chassis. Found material is *variety*; the free grants are the *floor*.

Nothing in this document changes what an ordinary ruby, or silver, or cold iron **does** for anybody
else. Feeding one to a symbiont is a new use, not a new rule for the item.

### 15.4 Five of these metals didn't exist yet

Worth knowing before this reaches a table. **Aluminium** wasn't isolated until 1825, **chromium** 1797,
**manganese** 1774, **nickel** 1751, **cobalt** 1735 — and **platinum** only reached Europe around 1735,
though it was worked in South America long before. As *refined metals* they are anachronisms in most
fantasy settings.

The fix is free and better flavour anyway: **name them by their ore**, which is what a pre-industrial
world would actually call them.

| Substrate | Period name | What it actually is |
| :-- | :-- | :-- |
| Aluminium | **Alum** | Alum has been mined and traded since antiquity. |
| Chromium | **Crocoite** · "Siberian red lead" | A brilliant orange-red lead chromate. |
| Manganese | **Pyrolusite** · "glassmaker's soap" | Used to decolour glass for millennia. |
| Nickel | **Kupfernickel** · "the goblin's copper" | Literally named for a mischievous spirit that spoiled copper ore. Perfect for the mutation lottery. |
| Cobalt | **Smalt** · "kobold ore" | Also named after a spirit, also for ruining a smelt. |
| Platinum | **Platina** · "little silver" | Dismissed by Spanish miners as unripe silver. |

**Kupfernickel and smalt are both named after malicious underground spirits that ruin honest ore.**
That is free worldbuilding for a class about a thing that lives in you and changes what you are, and
I'd take it — put the period name first and the modern one in parentheses.

---

## 16 — v2 or v3

They are genuinely different designs. This is the honest comparison.

| | **v2 — the Nine Veins** | **v3 — Substrate / Essence / Mutation** |
| :-- | :-- | :-- |
| **Materials** | 72 invented, exclusive to the class | 36 real and recognisable |
| **Colour is** | a sorting label on the shelf | a mechanical layer that rewrites every Mutation |
| **Growth** | feed a higher-tier material | feed **more of the same** material (Depth) |
| **Build question** | which colours, which tiers | wide or deep, twice — and which two things to Bond |
| **Strength** | zero collision with existing content; names teach their own tier | the two-layer rule genuinely delivers "same gem, different creature" |
| **Weakness** | colour does no mechanical work; 72 names to learn | collides with 16 existing item names (§15.3); heavier rules load |
| **Feels like** | a character wearing elemental armour | an alien organism being rewritten by its diet |

**My recommendation is v3**, for one reason: the Instinct clauses in §2.1 mean nine colours × thirty-six
Substrates is a genuinely large space built from a small number of rules, and v2's colours were doing
nothing that a tag couldn't do. v2's *naming* system is better than v3's and its exclusivity is
cleaner — if you want both, the merge is obvious: **keep v3's architecture entirely and rename the 36
Substrates to invented ones.** You would lose the instant recognition of "Ruby", which is worth more
than it sounds.

---

## 17 — Open questions

1. **Is the Assimilator unarmed?** Assumed yes throughout — the symbiont *is* the weapon. If it holds a
   weapon instead, roughly a third of the Depth ladders need re-pointing.
2. **Can Instinct change mid-adventure?** It's currently recalculated at daily preparations, which
   means an Assimilator who sheds material can flip Instinct overnight. Cheap and flexible, or should
   flipping cost something?
3. **Electrum at Depth 4 gives two full Instinct clauses.** That is the strongest thing in the
   document and I put it at 17th on purpose — but it may want to be a capstone feat rather than a
   Substrate anyone can just feed.
4. **Emerald's fast healing 10 at Depth 4** is in troll territory. Defensible for a 17th-level class
   feature that costs 4 of 13 Gem Mass, but it's the first number the ledger should interrogate.
5. **Do gems and metals really need separate Mass pools**, now that Depth exists? A single pool would
   be simpler and would let a player go all-in on metals. The two pools guarantee everyone has both,
   which is probably worth the extra table row — but it is a real choice.

---

## 18 — What's next

1. **The chassis** — Hit Points, proficiencies, key attribute, what a Carapace Strike is.
2. **The 2100-point BCS ledger** against `BCS 1.4`, costing Mass, Depth, the nine Instinct clauses and
   the Bond slots. Every number above is provisional until then; §17.3 and §17.4 first.
3. **The feat list**, 1st–20th — and Bonds may want to *be* the feat list rather than sit beside it.
4. **The automation plan** — Substrates map cleanly onto the module's effect machinery: each bound
   Substrate is an Effect item carrying its Depth ladder as rule elements, Instinct is a recalculation
   at daily preparations, and a Bond is an Effect with two prerequisites.
5. **Rare, legendary, monster and boss Substrates** — the 36 are the base system, and the architecture
   has room. A dragon's heart is a Substrate. So is whatever the party pulls out of the thing in the
   vault.

Tell me **v2 or v3** (or the merge in §16), answer §17.1, and I'll take it to the chassis and the ledger.

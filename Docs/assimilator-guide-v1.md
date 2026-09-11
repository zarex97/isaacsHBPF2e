# The Assimilator — PF2e Class Guide, **Version 1**

### *The symbiont · Substrate · Essence · Mutation*

*The complete class: chassis, the 2100-point ledger, advancement table, every core feature, the nine
Instincts, the Bond rules, and forty-five class feats from 1st to 20th. The thirty-six Substrates and
the thirty named Bonds live in its companion volume,
**`Docs/homebrewing/assimilator-material-lexicon-v3.md`** — that document is this class's Chapter 5 and
is not duplicated here. Costed on the same **2100-point** budget as **The Saint** (guide v4), **The
Breath Slayer** (v4.2) and **Soulbound** (v1.3).*

**Sources folded in:** **BCS 1.4** (`Docs/homebrewing/BCS 1.4 (current) _ Balanced Core System.xlsx`)
for every point value in §2 — Trained 10, Expert 50, Master 110, Legendary 190, HP 10/point, skill
increase 5, crit spec 50, weapon spec 70, greater weapon spec 150. Live pf2e data from `pf2e_fork` for
every mechanical anchor: the Monk's chassis (`packs/pf2e/classes/monk.json` — HP 10, Trained
Perception, three Expert saves, **Expert unarmored defence at 1st**, no armour proficiencies) as the
model for an unarmoured class, and the Barbarian's for a bruiser's saves.

**Names.** The class is the **Assimilator**. The symbiont it wears is the **Carapace**, and keeps that
name throughout — *Carapace Strike*, *Carapace Block*, *the Carapace breaking*. One word for the
character, another for the thing on them, the way the Saint has *the Cloth*.

**Decisions taken since the lexicon.** You confirmed the Assimilator is **unarmed**, so §4.1 makes the
Carapace Strike the only weapon the class has and §4.2 makes the symbiont itself the armour. Per your
instruction, **only the chassis is BCS-costed** — proficiencies, key attribute and Hit Points in §2.1,
and the class features they pay for in §2.2. **The feats in §8 are not individually priced**, as with
any PF2e class feat list.

---

## 1 — Design foundations

### 1.1 The pitch

Something alive is wearing you, and it grows by eating. Not by levelling — by **eating**. Feed it a
ruby and it learns to burn. Feed it iron and the limbs get heavier and longer. Feed it nickel and you
do not know what you will have on Tuesday, and neither does it.

Your build is not a list of choices made at character creation. It is a **stomach**, and its contents
are visible on you.

### 1.2 Profile and key attribute

| | |
| :-- | :-- |
| **Key attribute** | Strength **or** Dexterity |
| **Hit Points** | **10** + Constitution modifier per level |
| **Perception** | Trained |
| **Saves** | Fortitude **Expert**, Reflex Expert, Will Expert |
| **Attacks** | Unarmed Trained. **No weapon proficiency of any kind.** |
| **Defences** | Unarmoured **Expert**. **No armour proficiency of any kind** — you cannot wear armour over a living thing. |
| **Class DC** | The **Assimilator DC**, Trained, keyed to your key attribute |
| **Skills** | Athletics, plus 3 + Int |
| **Profile** | Martial — Brute |

**Constitution is this class's most important secondary attribute** and the guide will not pretend
otherwise. Hit Points at 10/level, Fortitude as the save that matters, and an Assimilator that breaks when
it runs out of Hit Points all point the same way. Strength or Dexterity to hit; Constitution to
survive the thing you are wearing.

### 1.3 Four dials, each simple

The class's whole rules load is four numbers, and every one of them answers a question a player can
hold in their head.

| Dial | What it decides | Where it comes from |
| :-- | :-- | :-- |
| **Substrate** | *What* the Mutation is | The 36 in the lexicon |
| **Depth** | *How strong* it is (1–4) | Feeding more of the same thing |
| **Instinct** | *How it behaves* | The colour you've invested most Mass in |
| **Bond** | *What two of them do together* | Five slots, 4th through 20th |

### 1.4 Every Instinct clause keys off Depth, and that is not an accident

Read §5 and you will find that almost every Instinct clause scales on the **Depth** of the Substrate
producing the Mutation — Red's bonus damage, Green's temporary Hit Points, Gray's Hardness, White's
ally shield, Black's stolen bonus. That means the Depth-cap increases at **5th, 11th and 17th** are
simultaneously the Substrate ladder's level-ups *and* the Instinct's, and the class needs **no second
scaling table**. Two of v3's nine clauses didn't obey this; §5.2 amends them so all nine do.

### 1.5 The design curve

- **1st–4th.** One gem, one metal, Depth 1. You are a martial with a gimmick and a damage type. The
  class is at its plainest here and that's correct — the engine hasn't been fed yet.
- **5th–10th.** Depth 2, your first Bonds. The build starts to have a shape somebody else could
  recognise across a room.
- **11th–16th.** Depth 3. Mutations begin doing things other classes cannot do at all — Mercury's
  damage reduction, Lead's spell penalty aura, Tin's precise tremorsense.
- **17th–20th.** Depth 4, and every capstone rider comes online at once. This is the spike, and it is
  deliberately late: an Assimilator is the slowest-blooming martial in the book and is paid for it at the
  top.

### 1.6 What the class deliberately cannot do

Honesty about the floor matters more than the ceiling.

- **No weapons, ever.** No runes on a sword, no reach weapon, no bow. One Strike, and feats to shape it.
- **No armour.** Your AC is Dexterity plus proficiency plus the runes you etch into your own plate.
- **No spell slots, no focus pool.** A handful of Substrates grant once-per-day or per-encounter
  actives; none of them is a spell list.
- **A build that costs money to change.** Shedding destroys the Substrate. An Assimilator who wants to be
  something else next month pays for it in material.
- **An Assimilator that can break.** §4.3. When it does, everything at Depth 3 or higher switches off
  until it's repaired. No other martial has a failure state like this, and it is the price of the
  Hardness.

---

## 2 — The point ledger (2100 exactly)

### 2.1 Chassis — 1260

| Line | Value | Pts |
| :-- | :-- | --: |
| HP | 10 | 100 |
| Class feat @1 | — | 10 |
| Assimilator DC | T@1 / E@9 / M@17 | 170 |
| Perception | T@1 / E@7 | 60 |
| Fortitude | T@1 / E@1 / M@9 | 170 |
| Reflex | T@1 / E@1 | 60 |
| Will | T@1 / E@1 | 60 |
| Attack (unarmed) | T@1 / E@5 / M@13 | 170 |
| Crit Spec @7 | brawling | 50 |
| Weapon Specialization @9 | | 70 |
| Greater Weapon Specialization @17 | | 150 |
| Defence | Unarmoured T@1 / E@1 / M@13 — **no armour categories at all** | 170 |
| Skills | 3 initial + 1 granted (Athletics) | 20 |
| **Subtotal** | | **1260** |

**Why this shape.** The Monk is the anchor: HP 10, Trained Perception, Expert unarmoured defence at
1st, and not one point spent on armour categories. The Assimilator spends nothing on light, medium or
heavy armour because it physically cannot use them — that's **60 points the Saint had to spend and
this class doesn't**, and it's where the Substrate engine gets funded. Three Expert saves at 1st with
Master Fortitude at 9th is the Barbarian's shape with the Monk's unarmoured line on top.

**The class buys its toughness with Substrates, not with proficiency.** That is the single most
important sentence in this ledger. Diamond, Steel, Chromium, Mercury and Moonstone are where a
Carapace's defence actually lives; the chassis only buys the right to stand in the front rank.

### 2.2 Features — 840

| Lvl | Feature | Pts |
| :-- | :-- | --: |
| 1 | **Instinct** (subclass) | 50 |
| 1 | **The Carapace** — Carapace Strike + Living Plate + Carapace Block | 30 |
| 1 | **Assimilation** — Mass, Depth 1, the Feed and Shed activities | 30 |
| 3 | **Mass** (+1 Gem) | 10 |
| 4 | **First Bond** | 50 |
| 5 | **Second Skin** — Depth cap 2, Mass +1/+1 | 110 |
| 7 | **Symbiotic Reflex** | 50 |
| 8 | **Second Bond**, Mass +2/+2 | 30 |
| 11 | **Third Skin** — Depth cap 3, Mass +2/+1 | 110 |
| 12 | **Third Bond**, Mass +2/+2 | 30 |
| 14 | **Mass** (+2/+2) | 10 |
| 15 | **Alien Physiology** | 50 |
| 16 | **Fourth Bond**, Mass +2/+1 | 30 |
| 17 | **Fourth Skin** — Depth cap 4, Mass +2/+1 | 110 |
| 19 | **Apotheosis** | 110 |
| 20 | **Fifth Bond**, Mass +2/+2 | 30 |
| **Subtotal** | | **840** |

### **TOTAL 1260 + 840 = 2100** ✅

### 2.3 Where the compression is, said out loud

**520 of the 840 feature points** — Instinct (50), Assimilation (30) and the four Skins (440) — buy
one thing: the Substrate engine. That is more concentration than any of the three sibling classes
carries, and it is the honest place to look first if the class plays too strong or too weak.

A Skin at 110 points is doing a great deal of work: it raises the Depth cap for **every** Substrate you
hold, raises Mass in both tracks, and — because every Instinct clause keys off Depth (§1.4) — levels
up your Instinct at the same time. Three effects for a Master-proficiency price. The defence is that
the Assimilator has no focus pool, no spell slots, no weapon proficiency and no armour proficiency, and
those four absences are worth roughly what the Skins cost. If playtest says otherwise, the first lever
is moving the Depth-4 cap from 17th to 19th, which costs the class its whole top-end spike and is
therefore a real correction rather than a nudge.

---

## 3 — Advancement table

| Lvl | Features |
| :-- | :-- |
| 1 | Ancestry & background, initial proficiencies, **Instinct**, **The Carapace**, **Assimilation**, Assimilator feat |
| 2 | Assimilator feat, skill feat |
| 3 | **Growth** (Mass +1 Gem), general feat, skill increase |
| 4 | **First Bond**, Assimilator feat, skill feat |
| 5 | Attribute boosts, ancestry feat, **Second Skin** (Depth cap 2, Mass +1/+1), **Carapace Expertise** (Unarmed Expert), skill increase |
| 6 | Assimilator feat, skill feat |
| 7 | **Symbiotic Reflex**, **Alertness** (Perception Expert), **Living Weapon** (brawling crit spec), skill increase |
| 8 | **Second Bond** (Mass +2/+2), Assimilator feat, skill feat |
| 9 | **Assimilation Expertise** (Assimilator DC Expert), **Juggernaut** (Fortitude Master), **Weapon Specialization**, ancestry feat, skill increase |
| 10 | Attribute boosts, Assimilator feat, skill feat |
| 11 | **Third Skin** (Depth cap 3, Mass +2/+1), general feat, skill increase |
| 12 | **Third Bond** (Mass +2/+2), Assimilator feat, skill feat |
| 13 | **Carapace Mastery** (Unarmed Master), **Shell Mastery** (Unarmoured Master), ancestry feat, skill increase |
| 14 | **Growth** (Mass +2/+2), Assimilator feat, skill feat |
| 15 | Attribute boosts, **Alien Physiology**, general feat, skill increase |
| 16 | **Fourth Bond** (Mass +2/+1), Assimilator feat, skill feat |
| 17 | **Fourth Skin** (Depth cap 4, Mass +2/+1), **Assimilation Mastery** (Assimilator DC Master), **Greater Weapon Specialization**, ancestry feat, skill increase |
| 18 | Assimilator feat, skill feat |
| 19 | **Apotheosis**, general feat, skill increase |
| 20 | Attribute boosts, **Fifth Bond** (Mass +2/+2), Assimilator feat, skill feat |

**Initial proficiencies:** Perception Trained · Fortitude, Reflex and Will Expert · Athletics + 3 + Int
others Trained · **Unarmed Trained, no weapons** · **Unarmoured Expert, no armour** · Assimilator DC
Trained. **HP** 10 + Con per level.

### 3.1 Mass and Depth by level

The two tables an Assimilator player actually keeps open.

| Level | 1 | 3 | 5 | 8 | 11 | 14 | 17 | 20 |
| :-- | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
| **Gem Mass** | 1 | 2 | 3 | 5 | 7 | 9 | 11 | 13 |
| **Metal Mass** | 1 | 1 | 2 | 4 | 5 | 7 | 8 | 10 |
| **Depth cap** | 1 | 1 | 2 | 2 | 3 | 3 | 4 | 4 |

A Substrate at **Depth N costs N Mass**. At 20th, 13 Gem Mass is three gems at Depth 4 and one at
Depth 1 — or thirteen gems at Depth 1, or anything between. **Wide or deep, asked once per track.**

---

## 4 — Core class features

### 4.1 The Carapace (1st) — *Carapace Strike*

Your unarmed attack is the class. There is no second option and no upgrade path through equipment.

> **Carapace Strike** — unarmed, **1d8 bludgeoning**, **brawling** group, traits: `unarmed`.

It is not agile and it is not finesse; it is a heavy thing at the end of a heavier arm. Two 1st-level
feats change that if you want them to (*Grasping Plates* makes it 1d6 agile finesse; *Reach of the
Thing* gives it reach on demand), and several Substrates reshape it further — Steel raises its die,
Black's Voidsteel makes it slashing, Gray's Anvilstar adds a die.

**Handwraps of Mighty Blows work normally**, and you should buy them. The class grants no free
fundamental runes. This is deliberate: a class that hands out its own potency and striking runes has
to be costed as though it were carrying a weapon's whole item budget, and every number in §2 assumes
you are not.

### 4.2 The Carapace (1st) — *Living Plate*

The symbiont is your armour and cannot be removed.

- It functions as **explorer's clothing that is alive**: AC item bonus +0, Dex cap +5, no check
  penalty, no Speed penalty, Bulk —.
- **It accepts armour potency, resilient and property runes**, etched by feeding rather than by a
  smith. Buy them on the normal schedule.
- **You cannot wear other armour.** Attempting it suppresses Living Plate, every Mutation, and your
  Instinct until you take it off. The symbiont does not share.

Again the reason is economy: keeping the Carapace inside pf2e's fundamental-rune track means the
class's AC and saves land exactly where every other martial's do, and the Substrates are pure
addition rather than a parallel progression nobody can compare.

### 4.3 The Carapace (1st) — *Carapace Block*, and the failure state

Your plate has **Hardness**, and Hardness means it can break.

| | |
| :-- | :-- |
| **Hardness** | **2**, plus every bonus from your bound Substrates (Diamond, Steel, Chromium, Gray's Instinct) |
| **Hit Points** | **10 + 5 per level** |
| **Broken Threshold** | Half its Hit Points |

> **Carapace Block** 🜲 **Reaction** — *Trigger:* you take physical damage. *Effect:* reduce the damage
> by your Carapace's Hardness. The Carapace takes that much damage.

**While broken**, you lose Living Plate's rune benefits, and **every Mutation at Depth 3 or higher
switches off** until the Carapace is repaired. Repair is the Repair activity against its own Hardness,
or one hour of Feeding it any Substrate you don't bind.

This is the only genuine failure state in any of the four classes, and it exists because Hardness is a
very strong defence in pf2e and something has to be able to take it away. An Assimilator who blocks
everything will break, and a broken Carapace at 17th loses its Depth 4 riders — which is to say, most
of what it is.

### 4.4 Assimilation (1st)

You gain **Mass** in two separate pools (§3.1) and the two activities that manage them.

> **Feed** ◆◆◆◆ *(10 minutes)* — Consume one Substrate you are holding. If you already hold it, its
> **Depth increases by 1**; otherwise it enters your Lattice at **Depth 1**. Either way it costs Mass
> equal to its new Depth, and the physical Substrate is destroyed.

> **Shed** — During your daily preparations only. Remove any Substrate, or reduce any Substrate's
> Depth, freeing that Mass. What you shed is destroyed, not recovered.

**Depth 1–2 takes an ordinary specimen** — a looted ruby, a copper ingot, a pearl off a necklace. Buy
it, loot it, prise it out of a statue. **Depth 3–4 takes a quickened specimen**, one that grew
somewhere the mundane world doesn't reach. Those are never shop inventory. §10 is the GM's half of
this.

**The Vein provides.** Every time your Mass increases, you gain **one free Substrate** of any kind you
qualify for. A Carapace's chassis is never hostage to the treasure pile; found material is variety,
the free grants are the floor.

### 4.5 Instinct (1st) — *the subclass*

Your **Instinct** is the colour you have invested the most total Mass in, counting both tracks. It
grants that colour's **Instinct clause** (§5), which applies to **every Mutation you have**, including
Mutations of other colours. Ties are broken by you, freely, at daily preparations.

Instinct is recalculated at daily preparations and costs nothing to change — an Assimilator who sheds
material can be a different creature in the morning. That is intentional. The cost of changing
Instinct is the **material you destroyed to do it**, and that is a real enough price.

### 4.6 The Skins (5th, 11th, 17th)

**Second Skin (5th)**, **Third Skin (11th)**, **Fourth Skin (17th)** each raise your **Depth cap** by
one — to 2, 3 and 4 — and raise Mass in both tracks per §3.1.

Because every Instinct clause keys off Depth, a Skin is three things at once: deeper Substrates, more
of them, and a stronger Instinct. It is the class's only advancement event and it happens three times.

### 4.7 Symbiotic Reflex (7th)

> 🜲 **Reaction** — *Trigger:* a creature you can see damages you. *Effect:* choose one —
> **(a)** gain resistance equal to **twice your highest Depth** against that damage, or
> **(b)** if the triggering creature is within your reach, make a **Carapace Strike** against it.
> Once per round, and it does not stack with Carapace Block against the same damage.

The thing that is wearing you has opinions about being hit, and at 7th level it stops waiting for
permission.

### 4.8 Alien Physiology (15th)

You are no longer entirely a person.

- You need neither food, drink nor air, and you are **immune to disease**.
- You are **immune to the drained condition**, and to any effect that would alter your physical form
  against your will (petrification, polymorph, and the like) — the symbiont is already using that
  space.
- You can be healed by **Repair** as well as by anything that heals a creature.
- You no longer have a discernible anatomy: you are **immune to precision damage** and to critical
  specialization effects of the knife and pick groups.

### 4.9 Apotheosis (19th)

The host and the thing stop being two things.

- Your **Mass increases by 3** in each track.
- Once per day, as a **free action**, every bound Substrate manifests at your **Depth cap** for 1
  minute, regardless of the Mass you actually paid.
- Your Carapace can no longer be broken by physical damage alone; only an effect that would destroy an
  object outright can do it.

---

## 5 — The nine Instincts

### 5.1 The clauses

Your Instinct clause applies to **every Mutation you have**, whatever its colour. This is the
mechanism that makes "Ruby under a different Instinct is a different creature" true rather than
merely stated.

| Instinct | Clause |
| :-- | :-- |
| 🔴 **Red — Consume / Destroy** | When a Mutation deals damage, it deals **+1 damage per Depth** of its Substrate. Against a creature that has already lost Hit Points this encounter, **double** that bonus. |
| 🟡 **Gold — Amplify / Dominate** | At daily preparations choose one bound Substrate; it counts as **one Depth higher** for its numeric effects, never above your Depth cap. When you critically hit, you may apply that Substrate's **Depth 4 rider** even if it isn't at Depth 4. |
| 🟠 **Orange — Move / React** | The first time each round you Stride, Step or use a reaction, your next Mutation this round deals **+1d4** of its own damage type. **+5 feet Speed** per bound Orange Substrate. |
| 🔵 **Blue — Adapt / Understand** | **Study** a creature (one action). Until the encounter ends, your Mutations treat its resistances as **lower by twice your highest Depth**, and you gain **+1 circumstance to AC** against it. One creature at a time. |
| 🟣 **Purple — Mutate / Transcend** | Your Mutations count as **magical**. At daily preparations one Substrate of your choice manifests **one Depth higher**, and one other, randomly determined, manifests **one Depth lower**. |
| 🟢 **Green — Grow / Reproduce** | When a Mutation deals damage, gain **temporary Hit Points equal to its Depth**. **Fast healing equal to the number of bound Green Substrates.** |
| ⚫ **Black — Consume / Corrupt** | When a Mutation damages a creature, it takes a **−1 status penalty** to one check or DC of your choice until the end of its next turn, and **you gain +1 status to the same thing**. At Depth 3+ the penalty and bonus become **−2 / +2**. |
| ⚪ **White — Preserve / Purify** | When a Mutation deals damage, one ally within 30 feet gains **temporary Hit Points equal to its Depth**. **A number of times per day equal to your highest Depth**, end one condition on yourself or an ally as a free action. |
| ⚙️ **Gray — Harden / Integrate** | Your Carapace's **Hardness increases by the total Depth of your bound metals**. When you use a Mutation, gain **resistance equal to its Depth** to all physical damage until the start of your next turn. |

### 5.2 Two amendments to lexicon v3

Blue's and White's clauses did not key off Depth, which broke the rule §1.4 depends on. Both are fixed
above and the lexicon should be amended to match:

- **Blue** — *"resistances 5 lower"* becomes **"lower by twice your highest Depth"** (4 → 8 across the
  Depth ladder, so slightly stronger late and weaker early, which is the correct shape).
- **White** — *"once per day"* becomes **"a number of times per day equal to your highest Depth."**
- **Black** gains an explicit Depth step (−2 / +2 at Depth 3+), because a flat ±1 at 17th was the one
  clause that would have stopped mattering.

### 5.3 The same Substrate, three Instincts

*Ruby at Depth 3.* Base: **+1d6 fire**, and fire resistance counts 5 lower.

- Under **Red** — +1d6 fire, **+3 damage**, **+6** against anything already bloodied. A furnace.
- Under **Green** — +1d6 fire, and **3 temporary Hit Points every time it burns**. A metabolism.
- Under **Black** — +1d6 fire, and every burn imposes **−2** on a save of your choosing while you gain
  **+2** to the matching thing. An act of theft.

Same gem. Three creatures.

---

## 6 — The Substrates

**The thirty-six Substrates are the companion volume**, `Docs/homebrewing/assimilator-material-lexicon-v3.md`
§5–13. Eighteen gems, eighteen metals, two of each per colour, each with an Essence, an appearance and
a four-step Depth ladder. They are not reprinted here; that document is this class's Chapter 5 and the
two are maintained together.

What this guide adds to them:

1. **The two amendments in §5.2**, which change Blue's and White's clauses and give Black a Depth step.
2. **Depth caps are the gate**, not level — a Substrate's Depth 4 entry is unreachable before 17th
   because the cap is, so the lexicon's per-entry level notes are redundant and should be deleted.
3. **Electrum at Depth 4** (two full Instinct clauses) is the strongest single entry in the lexicon
   and lands at 17th like everything else at Depth 4. I have left it as a Substrate rather than
   promoting it to a feat, because 4 of 11 Gem Mass is a real price and an Assimilator who pays it has
   given up two Depth-2 gems to do so. It stays on the watch list.
4. **Emerald's fast healing 10 at Depth 4** is troll-tier and also costs 4 Mass at 17th. Same verdict,
   same watch list.

---

## 7 — Bonds

A Bond is what happens when two Substrates are held deep enough, long enough, that the symbiont stops
treating them as separate things. It is **not** both effects at once — it is a third thing.

- You gain Bond slots at **4th, 8th, 12th, 16th and 20th** — five in total.
- A Bond requires **both** its Substrates at **Depth 2 or higher**. Dropping either below Depth 2
  suppresses the Bond until you feed it back; it is not lost.
- You choose a Bond when you gain the slot and may change it at daily preparations, provided the new
  Bond's requirements are met.
- **The thirty named Bonds are in the lexicon, §14.1**, with a recipe in §14.2 for building more.

Bonds are deliberately **not** the feat list. A feat is something you learn; a Bond is something that
happens to you because of what you ate, and it should not compete with feats for the same slot.

**Budget for a new Bond: one class feat**, at the level where both Substrates could first reach Depth
2 — 5th, in practice, unless the GM gates it higher.

---

## 8 — Assimilator feats

Forty-five feats across the eleven class-feat levels — five at 1st, four at each level after. Per your instruction these are **not**
individually BCS-costed — a class feat is priced by its level like any other PF2e class feat, and the
2100-point budget in §2 already paid 10 points for the 1st-level feat slot that opens the list.

A feat that raises **Mass** is the most valuable thing on most of these lists, and that's correct: Mass
is this class's currency and spending a feat on it should always be a live option.

### 8.1 — 1st level

**Second Stomach** · Your Gem Mass increases by **1**.

**Iron Gullet** · Your Metal Mass increases by **1**.

**Grasping Plates** · You grow a second Strike form. **Talons** — unarmed, **1d6 slashing**, brawling
group, traits `agile`, `finesse`, `unarmed`. You may use either it or your Carapace Strike freely.

**Reach of the Thing** · **Free action**, once per round, before a Strike: that Carapace Strike gains
**reach 10 feet**. Something extends that was not there a moment ago.

**Taste for It** · You can identify any Substrate by touch. When you deal damage to a creature, you may
**Recall Knowledge** about it as a free action once per encounter, with a **+2 circumstance bonus**.

### 8.2 — 2nd level

**Devour** · ◆ *(Interact)* Consume an object of light Bulk or less that you are holding. Gain
**temporary Hit Points equal to your level**, lasting 1 minute. Once per 10 minutes. The object is
gone; be careful whose it was.

**Plated Guard** · ◆ You thicken. Gain a **+2 circumstance bonus to AC** until the start of your next
turn. You cannot use **Carapace Block** while it lasts — the plate is busy.

**Spit** · ◆ A **ranged unarmed Strike**, range 20 feet, **1d6** damage of your Instinct's type (or
bludgeoning if your Instinct has none). It uses your Carapace Strike's attack bonus and counts toward
your multiple attack penalty.

**Sympathetic Growth** · Once per day, ◆ *(touch)*: an ally gains **one resistance you have, at half
value**, for 10 minutes. A piece of the thing goes with them, and it comes back.

### 8.3 — 4th level

**Deep Feeding** · Once per day you may **Feed** as a 1-minute activity instead of 10 minutes. Useful
exactly once per dungeon, and that once matters.

**Additional Bond** · *Prerequisite: at least one Bond.* You gain **one additional Bond slot**.

**Wall of Me** · ◆◆, once per encounter. Extrude a 10-foot line of Carapace in your space or adjacent
to it. It provides **standard cover**, has **Hardness equal to your level** and **Hit Points equal to
five times your level**, and lasts 1 minute or until destroyed. While it stands, your own Carapace's
Hardness is reduced by 2.

**Barbed Growth** · A creature that **critically fails** a melee Strike against you takes damage equal
to **twice your highest Depth**, of your Instinct's damage type.

### 8.4 — 6th level

**Deep Vein** · *Prerequisite: a Substrate at your Depth cap.* One Substrate of your choice may exceed
your **Depth cap by 1**, to a maximum of Depth 4. You still pay its Mass.

**Twin Maw** · ◆◆ Make two Carapace Strikes against the same creature. Both count toward your multiple
attack penalty as normal, and if both hit, **combine their damage before applying resistance**.

**Digest** · Once per day, ◆◆◆ *(1 minute)*: reduce the stage of one affliction affecting you by **2**.
The symbiont did not consult you about this.

**Instinctive Surge** · **Free action**, once per encounter: until the end of your turn, your **Instinct
clause treats every Substrate as one Depth higher**.

### 8.5 — 8th level

**Mass Growth** · Your Gem Mass and Metal Mass each increase by **1**.

**Shed Skin** · 🜲 **Reaction** — *Trigger:* you gain a condition of value 2 or lower. *Effect:* end it.
Your Carapace takes damage equal to **five times the condition's value**.

**Burrower** · *Prerequisite: a metal Substrate at Depth 2 or higher.* You gain a **burrow Speed of 15
feet** through earth, sand and loose stone.

**Bonded Deep** · One Bond you know functions with its Substrates at **Depth 1** instead of Depth 2.

### 8.6 — 10th level

**Two Instincts** · You gain a **second Instinct clause** of your choice. Both operate at **half value**
(round down, minimum 1). *This does not stack with Electrum's Alloyed Instinct — take the better.*

**Rampart** · Once per round, when an adjacent ally takes physical damage, they gain **resistance equal
to half your Carapace's Hardness** (maximum 5) against it.

**Consume the Fallen** · ◆◆◆ *(1 minute, over a corpse)*: gain **temporary Hit Points equal to twice
your level**, and until your next daily preparations one bound Substrate counts as **one Depth higher**
(never above your cap). Once per day.

**Greater Bond** · Choose one Bond you know. Its numeric values increase by **half again**, rounded up.

### 8.7 — 12th level

**Greater Mass Growth** · Your Gem Mass and Metal Mass each increase by **2**.

**Living Fortress** · If you did not move on your last turn, your Carapace's **Hardness doubles** until
you do.

**Harvest** · Once per day, ◆◆◆ *(10 minutes, over the remains of a creature of your level or
lower)*: gain **one of its resistances, senses, or movement modes** until your next daily preparations.
Not its spells and not its Strikes.

**Perfect Adaptation** · You gain **Moonstone's Reactive Evolution at Depth 2** without binding
Moonstone. If you already hold Moonstone, treat it as **one Depth higher** for this Mutation only.

### 8.8 — 14th level

**Apex Predator** · When you critically hit with a Mutation, apply that Substrate's **Depth 4 rider**,
whether or not it is at Depth 4. *Does not stack with Gold's Instinct clause — take the better.*

**Regurgitate** · **Free action**, once per day: **Shed** one Substrate and immediately **Feed** a
Substrate you are carrying, at Depth 1. The whole thing takes no time and is extremely unpleasant to
watch.

**Unbreakable Shell** · Once per day, when your Carapace would be reduced below its **Broken
Threshold**, it is instead reduced to exactly that threshold.

**Chimeric Frame** · You gain **two of Nickel's Aberrations** without binding Nickel, re-rolled or
re-chosen at each daily preparations.

### 8.9 — 16th level

**Legendary Mass** · Your Gem Mass and Metal Mass each increase by **3**.

**Instinct Fusion** · *Prerequisite: Two Instincts, or Electrum at Depth 3.* Both of your Instinct
clauses operate at **full value**. You are two organisms sharing a host and they do not always agree.

**Living Weapon** · Your Carapace Strike and Talons each gain **one additional damage die**.

**Second Hunger** · **Free action**, once per encounter: gain **2 Mass** in one track for 1 minute,
which you must spend immediately to deepen a bound Substrate. When it ends, that Substrate returns to
its real Depth.

### 8.10 — 18th level

**Fifth Depth** · One Substrate may reach **Depth 5**, costing 5 Mass. Its Depth 4 rider applies
**twice** where that is meaningful, and all of its numeric values increase by **half again**.

**Total Harvest** · *Prerequisite: Harvest.* One ability taken with **Harvest** becomes
**permanent**. You may replace it by using Harvest on something better.

**Devouring Plate** · When you reduce a creature to 0 Hit Points with a Carapace Strike, you may
**Feed** on it as a free action: gain a **temporary Substrate of any kind at Depth 2** until your next
daily preparations, costing no Mass.

**Shared Symbiosis** · Once per day, ◆◆ *(touch)*: a willing ally gains one of your **Mutations at
Depth 1** for 10 minutes. They also gain a small piece of the thing's opinions.

### 8.11 — 20th level

**Perfect Organism** · **Every bound Substrate counts as being at your Depth cap**, regardless of the
Mass you actually paid for it. Mass now buys only *breadth*; depth is free.

**Omnivore** · You have **two Instincts at full value**, and your Gem Mass and Metal Mass **merge into
a single pool** of their combined size. Gems and metals no longer compete for separate space — the
distinction stops meaning anything to you.

**The Thing That Wears You** · Once per day, ◆◆◆: the Carapace separates for 1 minute. It acts on your
initiative − 5 with your Strikes, your Mutations and your Carapace DC, and it has your Hit Points as
its own. While it is away you are unarmoured, unmutated, and a person again. You had forgotten.

**Eat the World** · Once per day, ◆◆◆ *(1 minute)*: consume a magic item of level equal to or lower
than your own. Until your next daily preparations you gain **one of its abilities** and **4 temporary
Mass** in either track. The item is destroyed and nobody is getting it back.

---

## 9 — Three Assimilators at 11th level

The same class, the same level, and three characters a table would never confuse.

### 9.1 The Furnace — Red Instinct, near-pure

**Gems (7 Mass):** Ruby 3, Garnet 3, Carnelian 1
**Metals (5 Mass):** Iron 3, Copper 2
**Instinct:** Red (11 of 12 Mass). **Bonds:** *Molten Carapace* (Ruby + Iron), *Conduction* (Ruby + Copper)

+1d6 fire on every Strike, **+3** from Red and **+6** against anything already bloodied, fire that
counts as electricity too, and a plate that burns anything that touches it. Garnet at Depth 3 hands
back temporary Hit Points every round the bleed is ticking. It is a chainsaw and it is not subtle.
Weak to anything with fire immunity and nothing to say to a flying enemy.

### 9.2 The Wall — Gray Instinct, White and Green splashed

**Gems (7):** Diamond 3, Moonstone 3, Hematite 1
**Metals (5):** Steel 3, Chromium 2
**Instinct:** Gray (7 of 12 — Diamond is White and Chromium is Green). **Bonds:** *Adamant Shell* (Diamond + Steel), *Living Armour* (Hematite + Moonstone)

Hardness 2 + 8 (Diamond) + 8 (Steel) + 5 (Chromium) + 5 (Gray's total metal Depth) = **28**, doubled
to 56 with *Living Fortress* if it doesn't move, and stacking fully thanks to *Adamant Shell*. A
critical hit becomes a normal hit once per encounter. Moonstone means the second round against any
damage type is better than the first. Damage output is the worst in the class, and Gray's Edge —
counting as silver and cold iron, resistances 5 lower — is the only reason it isn't embarrassing.

### 9.3 The Thing In The Dark — Black Instinct, Purple second

**Gems (7):** Onyx 3, Amethyst 3, Jet 1
**Metals (5):** Lead 3, Nickel 2
**Instinct:** Black (7 of 12). **Bonds:** *Null Shroud* (Onyx + Lead), and it wants *Blind Hunter* — which it cannot have, because that needs Tin.

Fights inside its own darkness, sees through it, teleports between patches of it, and every hit it
lands puts −2 on a save of its choosing while handing itself +2 on the matching roll. Lead's aura
gives every caster within 10 feet −1 to spell DCs, and *Null Shroud* makes the darkness itself
suppress magic. Nickel means two Aberrations a day, so it may have wings on Thursday. It is a debuff
engine wearing a person.

**The lesson from the third build**: a Bond you can't meet is a real cost, and the build above has to
choose between *Blind Hunter*'s thematic perfection and spending a gem on Tin it would rather spend on
Jet. That tension is the class working as intended.

---

## 10 — GM notes

### 10.1 Substrates are your lever, and that is the point

A Carapace's power comes out of your hands more directly than any other class's. Three rules make that
safe:

1. **Depth 1–2 is shoppable.** Ordinary rubies, copper ingots and pearls are 5 sp to 500 gp items that
   already exist in the game. Let players buy them. Low-level Assimilators should feel like they can feed
   the thing on scrap, because they can.
2. **Depth 3–4 is yours.** A quickened specimen grew somewhere impossible — inside a creature, on a
   leyline, at a planar breach, under something that died badly. These are adventure hooks with a
   price tag attached, and an Assimilator player will chase them the way a Saint chases a Zenith.
3. **The Vein provides.** Every Mass increase grants a free Substrate, so an Assimilator is never below its
   own chassis because you forgot. What you hand out changes what the character *is*, not how strong
   it is. That distinction is the whole safety margin.

### 10.2 The Carapace breaking is a scene, not a punishment

A broken Carapace at 17th loses every Depth 3+ Mutation. That's severe, and it should be — but it also
means the plate is a resource the player spends, and the moment it cracks is a story beat. Do not
target it out of spite; do let a boss with adamantine claws be genuinely frightening.

### 10.3 What an Assimilator looks like at your table

It is loud. A Red Assimilator lights the room and can't stop. A Green one drips. A Black one is hard to
look directly at. **Ask the player to describe the plate every time they feed it something**, because
the class's whole premise is that the build is visible, and an Assimilator nobody can see is an Assimilator
playing a different game.

### 10.4 Feeding in downtime

Feed is 10 minutes, which means an Assimilator rebuilds between encounters if it has material. That's
intended: the constraint is **material**, not time. If your campaign has long stretches with no
shopping, be more generous with Depth 1–2 specimens rather than shortening the activity.

---

## 11 — Where this stands

**Answered since the lexicon.** The Assimilator is **unarmed** (§4.1), the symbiont is the armour (§4.2),
the chassis is costed (§2), Instinct recalculates freely at daily preparations (§4.5), and Bonds are
their own slots rather than feats (§7).

**Still on the watch list**, and the ledger's §2.3 says why each is there:

1. **A Skin at 110 points** buys three effects. First lever if the class is too strong: move the
   Depth-4 cap from 17th to 19th.
2. **Electrum at Depth 4** — two full Instinct clauses, for 4 of 11 Gem Mass at 17th.
3. **Emerald at Depth 4** — fast healing 10, same price, same level.
4. **Carapace Hardness stacking.** The Wall build in §9.2 reaches **28** at 11th and 56 standing still.
   Shield Hardness at that level is around 10. The saving grace is that every point of it is spent
   Mass and the Carapace takes the damage it blocks — but this is the number most likely to need a
   cap, and a cap of **half your level + 10** would be the obvious one.
5. **Living Plate accepting armour runes.** It keeps the class inside pf2e's fundamental-rune economy,
   which is right, but it does mean an Assimilator buys both handwraps and armour runes on the normal
   schedule. Check that the item budget actually stretches.

**What comes next** is the automation programme:
`Docs/homebrewing/assimilator-automation-programme.md`.

# The Breath Slayer — PF2e Class Guide, **Version 5.0**

### *Kimetsu no Yaiba · 鬼滅の刃 · the Combo Rework*

*A complete rebuild of the class around **sequence** instead of **resources**. Breath Points are gone.
Each Breathing Style is now a **wheel of nine Forms** plus a Secret or Forbidden Form, and what a Form
does depends on **which Form you used before it**. The class's damage lives in a single escalating
counter, the **Breath Count**, and its decision lives in choosing which Form rides it.*

**Six styles are written in full here:** Water, Flame, Thunder, Wind, Stone, Moon — the original five
plus the deliberately-wrong one. Love, Serpent, Sound, Flower and Mist are **not in this version**; §11
says what porting them requires.

**Supersedes:** guide v4.2 (`breath-slayer-guide-v4.md`). **Built from:**
`breath-slayer-v5-combo-brainstorm.md` rev. 2. **Costed against** BCS 1.4, same 2100-point budget as v4
and as The Saint.

---

## 1 — What changed, and why

### 1.1 The problem with v4

v4 was correctly costed and internally consistent. It was also a monk with a katana: a martial Strike
routine, a 3-point focus pool buying three named techniques an encounter, and a precision rider. Nothing
in it required the player to think about *order*.

### 1.2 The v5 pitch

> A Breath Slayer's power is not in any single Form. It is in the **join** between two Forms.

Every Form sits at a numbered position on your style's wheel. When you use a Form, compare its position
to **the last Form you used**. Step forward the right distance and the breath carries — you gain a
**Breath Count**, and the Form picks up an extra effect. Step the wrong way and the breath breaks: you
lose the chain and the Form comes out blunt.

The Breath Count is the whole economy. It escalates, it buys back actions, and it gates your Secret
Form. Once per round you **nominate** one Form to carry the Count — and that nomination, made before you
roll, is the class's signature decision.

### 1.3 The five structural changes

| | v4 | v5 |
| :---- | :---- | :---- |
| **Resource** | 3 Breath Points per encounter | **None.** Position on the wheel is the resource. |
| **Forms known** | 5 (2 chassis + 3 feats) | **10** (6 chassis + 2 feats) |
| **What a Form is** | A focus spell: has a rank, auto-heightens, costs a point | **A martial action.** No rank, no heightening, no cost. |
| **Where damage scales** | 55 separate heightening lines | **Three axes only:** weapon dice, `Concentrated Breathing`, the Breath Count |
| **Throttle** | The point pool | **MAP** (most Forms contain a Strike) and **`flourish`** (every area Form) |

### 1.4 Forms are not focus spells any more — read this before you read a Form

This is the single most important consequence of removing the pool, and it re-anchors every number in
§8.

A focus spell is priced as *something you do three times a fight*. An action you can take every turn,
several times, forever, is priced like a **fighter feat**. So:

| v4 anchored Forms against | v5 anchors Forms against |
| :---- | :---- |
| `Inner Upheaval`, `Qi Blast` (monk, 1 FP) | `Knockdown`, `Combat Grab`, `Power Attack` (fighter) |
| `Pulverizing Wake` (ranger 9, 1 FP) | `Flurry of Blows`; `Furious Strikes` |
| `All Shall End in Flames` (kineticist 18) | `Sever Four Dragonfly Wings` (exemplar: free, at-will) |

**The practical effect: a Form's own printed damage is small and does not scale.** v4's First Forms
carried **+5d6** at level 20. v5's carry **+1d6 or +2d6, flat, forever**, and most carry no extra damage
at all — they carry a *condition*. At level 20 a nichirin Strike already deals roughly **49** on its own
(4d8 major striking + ability + weapon specialization + `Concentrated Breathing` +16); a Form's job is
to bend the battlefield, and the **Crest** (§4.4) is where Form damage lives.

> **Say this at the table once.** Your Forms are manoeuvres, not spells. They are small on purpose. The
> big number is the Crest, you get one a round, and you have to have earned it.

---

## 2 — Profile, key ability, and the floor

Martial. **10 HP**, full attack investment, class DC (**Slayer DC**), no spell slots. Key ability
**Strength or Dexterity** (Stone recommends Strength). Weapon-based: you buy potency, striking and
property runes for your nichirin blade exactly as any other martial does.

**`Concentrated Breathing` is unchanged from v4 and must stay unchanged.** A build-up class needs its
floor *more* than a spike class does, because round one at Breath Count 0 still has to feel like a
slayer. While you are in a Breathing Stance and wielding a nichirin blade, your Strikes deal
**+2 precision damage per weapon damage die**, rising to **+3 at 9th** and **+4 at 17th** — **+8 / +12 /
+16** at four weapon dice, unconditionally.

---

## 3 — Keywords used throughout this document

**A blade's worth.** Several Forms deal *a blade's worth* of damage to an area or to a second creature.
That means: roll your nichirin blade's damage **once** — weapon damage dice, runes, your ability
modifier and weapon specialization — and apply that total. It does **not** include
`Concentrated Breathing` (precision damage does not apply to areas), and it is **never doubled**.

> This is the mechanism that lets area Forms scale without a heightening line: a striking rune upgrades
> every area Form you know. At level 20 a blade's worth is roughly **33**.

**Nichirin Strike.** A Strike with your nichirin blade. Every Form that calls for one requires you to be
wielding it and to be in your style's Breathing Stance.

**`slayer`.** The trait on every Form. Forms are **actions**, not spells: they have no rank, they do not
heighten, they cannot be counteracted, and they are not affected by anything that targets spells. Where
a Form calls for a saving throw, the DC is your **Slayer DC**.

**Breathing Stance.** A 1-action stance you enter while wielding a nichirin blade. It ends as any stance
ends. Every Form and nearly every feat requires you to be in one, so entering one is the first action of
most fights until 12th level (`Stance Savant`) or 19th (`Constant Total Concentration`).

---

## 4 — The system: the Wheel, the Count, and the Crest

### 4.1 The Wheel

Each Breathing Style has **nine numbered Forms** arranged in a circle, plus a **Secret Form** (or
**Forbidden Form**) that sits off the wheel.

The nine positions exist whether or not you know the Form standing at each one. **Transitions are
measured by position, not by which Forms you happen to have learned.**

**Forms come in three tiers of three, and the tiers are interleaved around the wheel:**

| Tier | Positions | Learned at |
| :---- | :---- | :---- |
| **Tier I** | **1, 4, 7** | 1st level (`Breath Cadence`, chassis) |
| **Tier II** | **2, 5, 8** | 5th level (`Second Breath`, chassis) |
| **Tier III** | **3, 6, 9** | 8th level (`Third Tier`, class feat) |
| **Secret / Forbidden** | off-wheel | 20th level (`Hidden Form`, class feat) |

> **Why interleaved, and not 1–2–3 / 4–5–6 / 7–8–9.** Because a 1st-level slayer knowing only Forms 1, 2
> and 3 could chain 1→2→3 and then *have* to break — the ladder would dead-end in its first three steps.
> Positions 1, 4, 7 are **three steps apart**, so they close a perfect triangle: 1 → 4 → 7 → 1 → 4 →
> forever. Every style in §8 is built so that this triangle flows (with **+3**, or for Moon, with **+6**).
> A 1st-level Breath Slayer has a complete, sustainable, three-Form loop on day one, and every later tier
> adds finer steps inside it rather than replacing it.

> **The triangle is one-way, and that constrains Tier I design.** Each tier's three positions are joined by
> exactly **three** edges — 1 → 4 → 7 → 1 for five of the six styles, and 1 → 7 → 4 → 1 for Moon. There is
> no alternative route: 1 → 7 is a step of +6, which Flows only for Moon. So a Tier I Form you cannot use
> **on demand** strands a 1st-level slayer who has nothing else to reach for.
>
> Hence the invariant every style in §8 obeys: **no Tier I Form is a reaction, and no Tier I Form carries a
> Requirement clause.** Every style's reaction Form sits at Tier II or Tier III, where there are eight other
> positions to route around it. Check this first when porting a style (§11).

### 4.2 Transitions

When you use a Form, count **forward** around the wheel from the last Form you used to this one. Forward
only, wrapping at 9 → 1, which always gives a number from **0 to 8**.

| Step | Transition | What happens |
| :---- | :---- | :---- |
| in your style's **Flowing** set | **Flowing** | Breath Count **+1**, and the Form gains its tier's **Cadence rider** (§4.3). |
| in your style's **Reaching** set | **Reaching** | Breath Count **+1**. **No** Cadence rider, and the Form takes a **−2 status penalty** to its attack roll, or its save DC is reduced by 2. |
| anything else | **Broken** | Breath Count **resets to 1**. No Cadence rider, a **−2 status penalty** as above, **and the Form loses its own printed rider** — it resolves as a bare Strike, or as bare area damage. |
| **0** (the same Form twice running) | **Stalled** | Nothing. No advance, no rider, no penalty. Legal, and sometimes correct. |

**Opening the chain.** The **first Form you use in an encounter** has no predecessor, so it is always
**Flowing**: Breath Count becomes 1 and it gains its Cadence rider.

> **The three example readings, on Water** (Flowing +1/+2/+3, Reaching +4/+5):
> *7 → 9* is **+2**, Flowing. *7 → 2* is **+4**, Reaching. *7 → 5* is **+7**, Broken.
> Note the last one: going "back" two positions is a forward step of seven. There is no backward
> movement on a wheel — only long steps, and long steps break the breath.

**Reactions chain too.** A Form with a reaction trigger is compared to the last Form you used and
advances the Count exactly like any other, even though it happens on somebody else's turn. This is one of
the best things a Breath Slayer can do with a reaction and it is deliberate.

### 4.3 Cadence riders

A **Flowing** transition adds a bonus effect determined by the **tier of the Form you just used**. Each
style defines three, once, in §8 — so you learn three extra lines per style rather than nine.

| Using a… | grants |
| :---- | :---- |
| **Tier I** Form, Flowing | the style's **small** rider — usually a step, a cut, a flat point of pressure |
| **Tier II** Form, Flowing | the style's **medium** rider — usually a condition on the target |
| **Tier III** Form, Flowing | the style's **large** rider — usually a condition on you, or a lasting one on them |

Cadence riders are the reason a deep-tier Form is worth reaching for even when its own effect is
situational, and they are where most of a style's *feel* lives. Read a style's three Cadence riders
before you read its nine Forms.

### 4.4 The Breath Count and the Crest

**The Breath Count** is a single number from **0 to 9**. It is the only thing you write down. It rises by
1 on each Flowing or Reaching transition and resets to 1 on a Break.

> **The Crest** ✦ **Once per round**, before you roll, declare that one Form you are about to use
> **carries the Crest**. That Form deals **+1d6 damage per point of your Breath Count**, of the Form's
> damage type. At Breath Count **4** it also gains a **+1 status bonus** to its attack roll or its save
> DC; at **7**, **+2**.
>
> "Once per round" resets at the start of your turn, so a reaction Form on an enemy's turn can carry the
> Crest if you have not spent it.

**This once-per-round cap is the class's central balance lever, and it is also its central decision.**
You may use as many Forms in a turn as your actions allow — three 1-action Forms is a normal
high-level turn — but only one of them rides the wave. Choosing *which* is most of the skill in playing
this class: the accurate one, the area one, or the one that sets up next round.

**Your Breath Count cap rises on the chassis:**

| Level | Cap | From |
| :---- | :---- | :---- |
| 1 | **2** | `Breath Cadence` |
| 5 | **4** | `Second Breath` |
| 9 | **6** | `Nichirin Resonance` |
| 13 | **9** | `Demon Slayer Mark` |

### 4.5 Depth buys actions

| Breath Count | Effect |
| :---- | :---- |
| **3 or higher** | The Form carrying your Crest costs **1 fewer action** (minimum 1). |
| **6 or higher** | **Reaching** transitions no longer take the −2 penalty, **and** they grant the Cadence rider as though they were Flowing. |
| **9** | The Crest's extra dice are **d8s** instead of d6s. |

The first row matters more than it looks. A 2-action area Form nominated at Count 3+ becomes a 1-action
area Form, so a deep turn can be *three* Forms where a shallow turn was two. The class accelerates as
the fight goes on, which is both the correct feel and the reason the deep rungs of the wheel are
reachable inside four rounds at all.

### 4.6 What resets the chain

Deliberately stingy. A build-up class whose build-up is easy to lose is a miserable class.

| Event | Breath Count |
| :---- | :---- |
| A Form of yours **misses**, or an enemy succeeds at its save | **Unchanged.** No advance, no reset. You held the breath. |
| A **Broken** transition | **Reset to 1** |
| You end a turn having used **no Form at all** | **−1** (not to 0) |
| You **leave your Breathing Stance** | **0** |
| You become **stunned, paralysed, or unconscious** | **0** |
| The **encounter ends** | **0** — until 12th level (`Total Concentration`) |

Note what is *not* on that list: missing. A chain that broke on a miss would make the class
feast-or-famine and unplayable at low levels, where your attack bonus is worst and your cap is 2.

### 4.7 The Secret Form

Every style's tenth Form is its Secret Form (Moon's is a **Forbidden** Form). It replaces v4's
"Frequency once per 10 minutes" with an earned gate:

> **`flourish`** · **Requirement** Your Breath Count is **7 or higher**.
> **Effect** […] · **Your Breath Count then drops to 0.**

This is strictly better than a timer. It is earned rather than granted; it can happen twice in a long
fight if you played well; it cannot happen at all if you have been sloppy; and because it zeroes your
Count, firing it early costs you the rest of the fight's escalation. That trade is the whole point.

Every Secret Form also carries a **self-cost** — a real, lasting condition. Those are inherited from v4
and they are good.

> **The Forbidden use.** You may use your Secret Form with a Breath Count **below 7**. It works, but you
> take its self-cost **twice**, and you are **off-guard until the end of your next turn**. This is the
> only place in v5 where the punishment is a condition rather than a lost reward — because this is the
> only place where using the Form is a *sin* rather than a *mistake*.

### 4.8 The loop, in nine lines

```
Enter your stance.                                    (1 action; free from 19th)
Use Forms. Compare each to the LAST Form you used, stepping FORWARD on your wheel:
    FLOWING   → Count +1, Form gains its tier's Cadence rider
    REACHING  → Count +1, no rider, -2 to its attack or DC
    BROKEN    → Count resets to 1, -2, and the Form loses its own rider
    STALLED   → nothing
ONCE PER ROUND, before rolling, give one Form the CREST: +1d6 per point of Count,
    +1 to its attack/DC at Count 4, +2 at Count 7, d8s at Count 9.
At Count 3 the Crested Form costs 1 less action. At Count 6, Reaching is free.
At Count 7 you may use your Secret Form. It drops you to 0.
```

### 4.9 Why there is no "reverse heightening"

The brainstorm proposed punishing a skipped step by dropping the Form's spell rank. That mechanism died
with the decision in §1.4: **Forms have no rank any more**, so there is nothing to lower. Its replacement
is the third row of §4.2 — a Broken Form **loses its own printed rider** and takes **−2**. That is a
large penalty expressed in the Form's own terms, it needs no arithmetic, and it automates cleanly.

Rank-based reverse heightening survives in exactly one place, where the fiction wants it: the Forbidden
use of a Secret Form (§4.7), which is the one Form in each style that still has a rank.

---

## 5 — The point ledger (2100 exactly)

*Costed against **BCS 1.4**, same sheet and same conventions as v4 §2. The chassis is **unchanged from
v4** — it was correct, and none of v5's changes touch proficiency. The 690-point feature block is
**re-spent**, not re-sized.*

### Chassis — 1410 (identical to v4)

| Line | Value | Pts |
| :---- | :---- | :---- |
| HP | 10 | 100 |
| ClassFeatL01 | — | 10 |
| InitialSkills | Acrobatics *or* Athletics + 3 others | 20 |
| SubclassSkills | Breathing Style granted skill | 5 |
| GrantedSkills | Slayer's Vigil (L5) | 5 |
| ClassDC (**Slayer DC**) | T@1 / E@9 / M@17 | 170 |
| Perception | T@1 / E@1 / M@7 | 170 |
| FortitudeSave | T@1 / E@1 / M@9 | 170 |
| ReflexSave | T@1 / E@1 / M@7 | 170 |
| WillSave | T@1 / E@3 | 60 |
| Attack — Unarmed / Simple | T@1 each | 20 |
| Attack — Martial | T@1 / E@5 / M@13 | 170 |
| WeaponCS@5 / WS@7 / GWS@15 | — | 270 |
| Defense — Unarmored | T@1 | 10 |
| Defense — Light | T@1 / E@13 | 60 |
| **Subtotal** | | **1410** |

### Features — 690 (re-spent)

| Lvl | Feature | Pts | Change from v4 |
| :---- | :---- | ---: | :---- |
| 1 | **Breathing Style** (stance · style rider · wheel topology · 3 Cadence riders) | 50 | = |
| 1 | **Concentrated Breathing** | 110 | = |
| 1 | **Breath Cadence** (the Count · the Crest · **Tier I: 3 Forms**) | 40 | **+30** — was `Focused Breathing` at 10 |
| 1 | **Sun-Forged Nichirin** | 10 | = |
| 5 | **Second Breath** (**Tier II: 3 Forms** · cap → 4) | 40 | = |
| 9 | **Nichirin Resonance** (material bypass · cap → 6) | 50 | **−30** — the "Reaching is free" clause moved to the Count-6 threshold, which is free |
| 11 | **Transparent World Glimpse** | 70 | = |
| 12 | **Total Concentration** | 30 | = |
| 13 | **Demon Slayer Mark** (cap → 9 · the Mark) | 110 | = |
| 15 | **Breath of Instinct** | 30 | = |
| 19 | **Constant Total Concentration** | 150 | = |
| **Subtotal** | | **690** | |

### **TOTAL 1410 + 690 = 2100** ✅

The re-spend is two lines and they cancel: the engine that replaces the focus pool is worth more than the
pool was (10 → 40), and `Nichirin Resonance` gives back exactly as much (80 → 50) because the clause it
was carrying now lives on a Breath Count threshold, which costs nothing. **Every other line is
unchanged from v4**, including the two features v4 wrote from scratch.

> **Feats remain outside the 2100**, exactly as in v4 and as for every published class.

---

## 6 — Advancement table

| Lvl | Features |
| :---- | :---- |
| 1 | Ancestry & background, initial proficiencies, **Breathing Style**, **Concentrated Breathing**, **Breath Cadence** (Tier I: Forms 1/4/7 · Count cap 2), **Sun-Forged Nichirin**, Breath Slayer feat |
| 2 | Breath Slayer feat, skill feat |
| 3 | **Slayer's Resolve** (Will Expert), general feat, skill increase |
| 4 | Breath Slayer feat, skill feat |
| 5 | Ability boosts, ancestry feat, **Blade Expertise**, **Second Breath** (Tier II: Forms 2/5/8 · **Count cap 4**), **Slayer's Vigil**, skill increase |
| 6 | Breath Slayer feat, skill feat |
| 7 | **Evasion** (Reflex Master), **Slayer's Alertness** (Perception Master), **Weapon Specialization**, skill increase |
| 8 | Breath Slayer feat *(**Third Tier** lives here)*, skill feat |
| 9 | **Breath Expertise** (Slayer DC Expert), **Juggernaut** (Fort Master), **Nichirin Resonance** (**Count cap 6**), ancestry feat, skill increase |
| 10 | Ability boosts, Breath Slayer feat, skill feat |
| 11 | **Transparent World Glimpse**, general feat, skill increase |
| 12 | **Total Concentration**, Breath Slayer feat, skill feat |
| 13 | **Blade Mastery**, **Uniform Expertise**, **Demon Slayer Mark** (**Count cap 9**), ancestry feat, skill increase |
| 14 | Breath Slayer feat, skill feat |
| 15 | Ability boosts, **Breath of Instinct**, **Greater Weapon Specialization**, general feat, skill increase |
| 16 | Breath Slayer feat, skill feat |
| 17 | **Breath Mastery** (Slayer DC Master), ancestry feat, skill increase |
| 18 | Breath Slayer feat, skill feat |
| 19 | **Constant Total Concentration**, general feat, skill increase |
| 20 | Ability boosts, Breath Slayer feat *(**Hidden Form** lives here)*, skill feat |

**Initial proficiencies:** Perception **Expert** · Fortitude **Expert**, Reflex **Expert**, Will Trained ·
Acrobatics *or* Athletics + 3 others Trained, **plus your Breathing Style's granted skill** · Unarmed,
simple and martial weapons Trained · Unarmoured and light armour Trained · **Slayer DC** Trained.
**HP** 10 + Con per level. **Key ability** Strength or Dexterity.

> **Three things to say at session zero.** (1) **Perception is Expert at 1st** — you win initiative and
> you are the party's eyes. (2) **Will never rises past Expert.** A Breath Slayer is a body, not a mind.
> (3) **Your Breath Count cap is 2 until 5th level.** Low-level play is the three-Form triangle and
> `Concentrated Breathing`; the wheel does not open up until the middle of the game, and that is
> deliberate.

---

## 7 — Core features

### Breathing Style (L1) — *subclass*

Choose one of the six styles in §8. It grants you, permanently:

- a **granted skill**;
- a **Breathing Stance** (1 action, `stance`, requires a nichirin blade);
- a **style rider**, passive while you are in that stance;
- your **wheel topology** — which steps Flow, which Reach, and any style-specific clause;
- three **Cadence riders**, one per tier;
- the ten **Forms** you will learn across the game.

Every style is a **sidegrade**. Choosing one over another never changes the total.

### Breath Cadence (L1)

You learn your style's **Tier I Forms** — positions **1, 4 and 7** on its wheel — and you gain the
**Breath Count** and the **Crest** (§4.4). Your Breath Count cap is **2**.

> At 1st level this is three Forms that loop forever and a once-a-round +2d6 at best. That is the
> intended shape: the class starts as a martial with a good toolkit, and becomes a combo class at 5th.

### Sun-Forged Nichirin (L1)

You carry a nichirin blade forged from scarlet crimson ore. It takes your colour the first time you hold
it. The blade is **magical**; it cannot be permanently destroyed (a Corps swordsmith reforges or replaces
it in your next week of downtime, free, runes intact); and any weapon a Form or feat calls a "nichirin
blade" means this one. You buy its runes yourself.

### Slayer's Resolve (L3) · Blade Expertise (L5) · Evasion, Slayer's Alertness & Weapon Specialization (L7) · Breath Expertise & Juggernaut (L9) · Blade Mastery & Uniform Expertise (L13) · Greater Weapon Specialization (L15) · Breath Mastery (L17)

Unchanged from v4 §4. Will → Expert at 3; weapons → Expert and blade critical specialization at 5;
Reflex and Perception → Master, weapon specialization, and Evasion at 7; Slayer DC → Expert and Fortitude
→ Master at 9; weapons → Master and armour → Expert at 13; greater weapon specialization at 15; Slayer DC
→ Master at 17.

### Second Breath (L5)

You learn your style's **Tier II Forms** — positions **2, 5 and 8**. Your Breath Count cap rises to **4**.

> This is the level the class turns on. Six Forms on the wheel means you finally have *choices* of step
> length: the 1/4/7 triangle is still there, but now 1 → 2 is a single step and 7 → 2 is a reach.

### Nichirin Resonance (L9)

Your blade answers your breathing. Your nichirin Strikes and Forms **ignore resistances to physical
damage** that are not resistance to adamantine, and they **count as cold iron and silver** for all
purposes. Your Breath Count cap rises to **6**.

### Transparent World Glimpse (L11)

Carried over from v4 §4 unchanged. While in a Breathing Stance: **imprecise blood sense** out to 30 feet,
detecting every creature with blood or equivalent circulatory fluid regardless of light, cover,
concealment, invisibility, or the hidden and undetected conditions (not constructs, oozes, or most
undead); once per round when you Strike a creature within 30 feet you may **read its flow**, so that the
Strike ignores concealment, needs no flat check against a hidden target, and the target's **circumstance
bonuses to AC do not apply**; and you always know whether a creature within 30 feet is living, undead, a
fiend or a construct.

### Total Concentration (L12)

*Replaces v4's full-pool Refocus, which has nothing left to refill.*

- Your chain **no longer resets when an encounter ends.** Your Breath Count persists for **1 minute**
  after combat, and carries into a new encounter that starts within that minute.
- Out of combat, you may **breathe for 1 minute** to raise your Breath Count by **1**, up to a maximum of
  half your cap, rounded down. You may repeat this. Ten minutes of settled breathing before a door you
  know you are about to kick in is the pre-fight breath, and it is supposed to feel like one.

### Demon Slayer Mark (L13)

Your Breath Count cap rises to **9**. In addition:

> **Free action** · **Frequency** once per 10 minutes · **Trigger** You are at half Hit Points or fewer,
> or a creature critically hits you, while you are in a Breathing Stance.
>
> The mark surfaces across your skin in your style's colour and burns there for **1 minute**. While it
> burns: you gain a **+10-foot status bonus** to all your Speeds, and **every transition you make counts
> as Flowing** — no step breaks your breath, and every Form you use gains its tier's Cadence rider.
>
> While the mark is active, your Demon Slayer Mark counts as **active** for any Form, feat or effect that
> reads it.

> **What changed from v4 and why.** v4's Mark offered *Godspeed* or *Ignition* ("your next Form costs no
> Breath Point"). Ignition is meaningless now, so the Mark grants Godspeed **and** the thing that matters
> most in v5: a minute in which you cannot break the chain. For a marked slayer the wheel stops existing
> and every Form is the right Form — which is exactly what the Mark looks like in the source material.
>
> **Say this at the table.** In the source a marked slayer burns their lifespan and dies at twenty-five.
> Nothing here enforces that and nothing should, but it is why the Mark is a once-per-10-minutes emergency
> and not a stance you live in. GMs who want the price on the page can rule that each *day* on which the
> Mark is used costs a year off the end.

### Breath of Instinct (L15)

**Free action** · **Frequency** once per minute · **Trigger** You use a Form.
That Form's transition is treated as **Flowing** regardless of the step. The get-out-of-a-Break card — the one time a round you can cut across
the wheel because the fight demanded it.

### Constant Total Concentration (L19)

*常中 — the breathing that never stops, waking or sleeping.*

- You are **permanently in a Breathing Stance** you know. You never spend an action to enter one; you
  choose which during your daily preparations and may change it during any ten minutes of rest. **Nothing
  can force you out of a stance**, and you remain in it while unconscious.
- You are **immune to the fatigued condition**, you no longer need to breathe, and you cannot be
  suffocated or drowned.
- You **begin every encounter at Breath Count 3** — which means you begin every encounter with the
  Crest's action discount already live.

> *Pricing:* 150, below the 190 that BCS's Champion pays for `Hero's Defiance` and the Saint pays for
> `Eighth Sense`. Those cheat death; this refuses to stop.

---

## 8 — The Six Breathing Styles

*Each entry gives the granted skill, the damage type, the **wheel topology**, the stance, the style rider,
the three **Cadence riders**, all nine Forms by wheel position, and the Secret or Forbidden Form.*

**Read the topology table first.** It is the style. Two styles with identical Forms and different
topologies play completely differently, and the topology is a single line you will memorise in one
session.

| Style | Skill | Damage | Flowing on | The shape of a turn |
| :---- | :---- | :---- | :---- | :---- |
| **Water** | Acrobatics | slashing | +1 +2 +3 | The baseline. Short, fluid steps; nothing is far away. |
| **Flame** | Intimidation | fire | **+3 +4 +5** | Inverted. Flame must **leap** — short steps are the strain. |
| **Thunder** | Athletics | electricity | **+3 only, advancing 2** | Three rhythms, and you commit to one. No forgiveness, fastest ramp, lowest ceiling. |
| **Wind** | Survival | slashing | **+3 +5 +7** | Gusts. Skipping is correct, and +7 doubles back. |
| **Stone** | Athletics | bludgeoning | +1 +2 +3 | Water's arc, but **a Break halves the Count instead of resetting it.** The mountain does not fall over. |
| **Moon** † | Intimidation | slashing | **even steps** | The same triangle as everyone else, walked backwards. Flows into two steps that break every other style. |

† *Moon is Kokushibo's style. It suits villains, Upper-Moon-hunter campaigns, or a player on a
dark-lineage arc.*

---

### WATER BREATHING

**Granted skill** Acrobatics · **Damage type** slashing

| | |
| :---- | :---- |
| **Flowing** | **+1, +2, +3** |
| **Reaching** | **+4, +5** |
| **Broken** | +6, +7, +8 |

*Water is the baseline against which every other topology is measured, and the most forgiving wheel in
the book: of eight possible steps, five of them advance your breath. Nothing on a Water wheel is far
away.*

**Stance — Flowing Form** *(1 action)*
While in this stance you gain a **+1 circumstance bonus to AC** until the start of your next turn if you
Stepped, Strode, Swam or Flew on your turn.

**Style rider — Flowing Advance**
The first time each round you Strike a creature after Striding or Stepping that turn, the Strike deals
**+1 precision damage per weapon damage die**.

**Cadence riders**

| Flowing with a… | grants |
| :---- | :---- |
| **Tier I** Form | You **Step 5 feet** as a free action. |
| **Tier II** Form | The target is **off-guard to you** until the end of your next turn. |
| **Tier III** Form | You gain a **+2 circumstance bonus to AC** until the start of your next turn. |

**The Forms**
**1 · Water Surface Slash** — *Tier I · 1 action*
Make a nichirin Strike dealing **+1d6 slashing**. If you Strode or Stepped at least 10 feet this turn
before the Strike, it deals **+2d6** instead.

**2 · Drop Ripple Thrust** — *Tier II · 1 action*
Step 10 feet; this movement doesn't trigger reactions. Then make a nichirin Strike.

**3 · Splashing Water Flow** — *Tier III · 1 action*
Step, make a nichirin Strike that ignores the target's lesser cover, then Step again.

**4 · Blessed Rain After the Drought** — *Tier I · 1 action*
Make a nichirin Strike with a **+1 status bonus** to the attack roll. On a hit, you and one willing ally
within 30 feet each gain **temporary Hit Points equal to your level** for 1 minute.

**5 · Striking Tide** — *Tier II · **reaction***
**Trigger** You take damage from a physical Strike while in the Water stance.
Reduce the triggering damage by **2 + your level**. If the attacker is within your reach, make a nichirin
Strike against it at your current multiple attack penalty.

**6 · Whirlpool** — *Tier III · 2 actions · `flourish`*
A **10-foot emanation** of churning blades. Each creature in the area takes **a blade's worth of
slashing** with a basic Reflex save. On a **failure** a creature is **pulled 5 feet toward you** (this
movement doesn't trigger your reactions); on a **critical failure** it also **can't Step** until the end
of its next turn.

**7 · Waterfall Basin** — *Tier I · 1 action*
A descending vertical cut. Make a nichirin Strike with a **+1 status bonus**. On a hit the target is
**pushed 5 feet**; on a critical hit it is pushed 10 feet and knocked **prone**.

**8 · Flowing Dance** — *Tier II · 2 actions · `flourish`*
Make **two nichirin Strikes** against the same creature; your multiple attack penalty increases as
normal. You may **Step** between them.

**9 · Constant Flux** — *Tier III · 2 actions · `flourish`*
Make a nichirin Strike dealing **+2d6 slashing**. Then, until the end of your next turn, **the next Form
you use treats its transition as Flowing** regardless of the step.

> Water's Tier III answer to its own premise: the style that flows anywhere eventually stops needing the
> wheel at all. Pairs viciously with a deep-tier reach you'd otherwise never take.

**SECRET FORM — Eleventh Form: Dead Calm** — *2 actions · `flourish`*
**Requirement** Your Breath Count is **7 or higher**. *(Giyu Tomioka's personal creation.)*
**Duration** Until the start of your next turn.

You stop moving entirely. You gain a **+2 status bonus to AC and to Reflex saves** and **5 Stillness
counters**. You can take no actions other than *Still Water* while the form lasts; taking any other action
ends it. Unspent counters are lost when the duration ends. **Your Breath Count then drops to 0.**

> **Still Water** ✦ *(free action; it does not use your reaction, and you may take it any number of times)*
> **Trigger** A creature's melee Strike targets you, and you have at least 1 Stillness counter.
> **Effect** Spend any number of remaining counters, resolved once the Strike's outcome is known:
> - **It hits or critically hits you.** Each counter spent reduces the damage by **a blade's worth**. If
>   the total exceeds the damage, the **excess is dealt to the attacker** as slashing damage.
> - **It misses or critically misses you.** Each counter spent is an immediate **riposte nichirin Strike**
>   against the attacker at a flat **−2** penalty. These ripostes **neither use nor increase your multiple
>   attack penalty**, and each hit makes the target **off-guard to you** until the end of your next turn.

**Self-cost** When Dead Calm ends you are **off-guard until the end of your next turn** — the stillness
has to break.

> *Still water answers whatever touches it, in kind. A counter is always worth exactly one swing; what
> changes is whether the swing has to roll to land.*

---

### FLAME BREATHING

**Granted skill** Intimidation · **Damage type** fire

| | |
| :---- | :---- |
| **Flowing** | **+3, +4, +5** |
| **Reaching** | **+1, +2** |
| **Broken** | +6, +7, +8 |

*Flame's topology is **inverted**: the long steps carry and the short ones strain. A fire that does not
jump goes out, so a Flame slayer who creeps one position at a time is fighting their own style. This is
the hardest wheel in the book to play and the most satisfying when it lands, because the Forms you most
want to follow with are never the ones standing next to you.*

**Stance — Burning Advance** *(1 action)*
The **first Strike each round** you hit with while in this stance deals **persistent fire damage equal to
1 per weapon damage die** (2 per die at 8th level, **3 per die at 15th**).
*(Persistent fire of the same value doesn't stack — the highest applies.)*

**Style rider — Kindled Wound**
The first time each round that a creature takes persistent fire damage from you, it is **off-guard to
you** until the end of your next turn.

**Cadence riders**

| Flowing with a… | grants |
| :---- | :---- |
| **Tier I** Form | The target takes **1d4 persistent fire**. |
| **Tier II** Form | The target is **frightened 1**. |
| **Tier III** Form | Until the end of your next turn, persistent fire on the target **can't be ended by the usual flat check** — it must be smothered with an Interact action, doused, or hit with cold damage. |

**The Forms**
**1 · Unknowing Fire** — *Tier I · 1 action*
Make a nichirin Strike with a **+1 status bonus** to the attack roll, dealing **+1d6 fire**. On a hit the
target takes **1d4 persistent fire**; on a critical hit it takes **double** that persistent fire and is
**off-guard until that persistent damage ends**.

**2 · Rising Scorching Sun** — *Tier II · 2 actions*
Stride up to half your Speed — this movement may be vertical and doesn't trigger reactions — then make a
nichirin Strike with a **+1 status bonus**. The target is **off-guard against this Strike if it is taking
persistent fire damage**. On a critical hit it is pushed **10 feet** and knocked **prone**.

**3 · Blazing Universe** — *Tier III · 2 actions · `flourish`*
A **15-foot cone** of rolling flame. Each creature takes **a blade's worth of fire** with a basic Reflex
save. On a **failure** a creature takes **2d6 persistent fire**; on a **critical failure**, **4d6
persistent fire** and it is **dazzled** until that fire ends.

**4 · Flame Tiger** — *Tier I · 2 actions · `flourish`*
Make **two nichirin Strikes** against the same creature; your multiple attack penalty increases as
normal. **If both hit**, the target takes **2d6 persistent fire** and becomes **frightened 2**, and it
can't reduce that frightened condition below 1 while the persistent fire lasts.

**5 · Blooming Flame Undulation** — *Tier II · **reaction***
**Trigger** You are targeted by a Strike, or you are caught in a damaging area effect.
A vortex of flame erupts around you. You gain **resistance 3 + half your level** against the triggering
damage, and each creature adjacent to you takes **1d6 fire** with a basic Reflex save.

**6 · Flame Whirl** — *Tier III · 2 actions · `flourish`*
A **10-foot emanation** of whirling fire. Each creature takes **a blade's worth of fire** with a basic
Reflex save. You may then **Stride up to half your Speed**; this movement doesn't trigger reactions.

**7 · Scorching Crescent** — *Tier I · 1 action*
Make a nichirin Strike. On a hit, each creature **adjacent to the target** takes fire damage equal to
**your number of weapon damage dice**.

**8 · Ember Pursuit** — *Tier II · 1 action*
**Requirement** A creature within 30 feet is taking persistent fire damage.
Stride up to half your Speed toward that creature — this movement doesn't trigger its reactions — then
make a nichirin Strike against it.

**9 · Sunset Blaze** — *Tier III · 2 actions*
Make a nichirin Strike with a **+2 status bonus** to the attack roll. On a hit, any **persistent fire the
target is taking doubles**. On a critical hit it also **can't use reactions** until that fire ends.

**SECRET FORM — Ninth Form: Rengoku** — *3 actions · `flourish`*
**Requirement** Your Breath Count is **7 or higher**. *(The Rengoku family's inherited esoterica.)*

Stride up to **double your Speed** in a straight line; this movement doesn't trigger reactions and you may
move through enemies' spaces. Each creature adjacent to any point of your path takes **a blade's worth of
fire plus 4d6 fire** with a basic Reflex save; a creature that **fails** is knocked **prone**, and one
that **critically fails** also takes **4d6 persistent fire**.

End the movement with a nichirin Strike gaining a **+2 status bonus** to the attack roll. On a hit the
target takes **4d6 persistent fire**; on a critical hit that persistent fire **cannot be ended by the
usual flat check** — the creature must spend an Interact action to smother it, be doused, or take cold
damage. **Your Breath Count then drops to 0.**

**Self-cost** The technique burns its wielder. You take **fire damage equal to your level** (ignoring your
own immunities and resistances to fire) and are **slowed 1** on your next turn.

---

### THUNDER BREATHING

**Granted skill** Athletics · **Damage type** electricity

| | |
| :---- | :---- |
| **Flowing** | **+3 only — and a Flowing transition advances your Breath Count by 2, not 1** |
| **Reaching** | **none** |
| **Broken** | **+1, +2, +4, +5, +6, +7, +8** |
| **Special** | Your Breath Count cap is **7**, whatever your level. At Breath Count **7**, your Crest dice are **d8s**. |

*A +3 step has exactly three orbits on a nine-position wheel — **1→4→7**, **2→5→8**, and **3→6→9** — and
those are the only lines Thunder has. A Thunder slayer picks a rhythm and rides it. Changing orbits always
breaks the breath; there is no Reaching, no partial credit, and no forgiveness at all.*

*In exchange it is the fastest ramp in the class. Three Forms in a turn is **+6 Breath Count**, so
Thunder can be at its ceiling by the end of its first real turn — and its ceiling is lower than everyone
else's. This is Zenitsu: one rhythm, absolute, and it arrives before you have finished looking.*

> **Thunder's three orbits are exactly its three tiers.** A +3 step never leaves the set it started in, so
> the orbits are **{1, 4, 7} = Tier I**, **{2, 5, 8} = Tier II** and **{3, 6, 9} = Tier III**. A Thunder
> slayer therefore chooses their rhythm by choosing a *tier* — and since a Flowing transition grants that
> tier's Cadence rider, **a Thunder slayer's Cadence rider is fixed for as long as they stay in rhythm.**
> Run Tier I and you Step 10 feet every Form; run Tier III and you are rolling a Fortitude stun every Form,
> and crossing between them costs you the entire chain. No other style in this book has this property.
>
> Note also that Thunder's Count advances in **twos** from an opening of 1, so it is **only ever odd**: 1, 3,
> 5, 7. It hits the Count-3 action discount exactly, clears the Count-4 and Count-6 thresholds at 5 and 7,
> and never lands on an even number at all.

> **A consequence worth noting.** Thunder's cap of 7 is exactly the Secret Form's requirement, so
> `Honoikazuchi no Kami` can only ever be used at a **perfect** Breath Count. It is the only style that
> must be at its absolute peak to use its Secret Form, and that is correct.

**Stance — Lightning Posture** *(1 action)*
You gain a **+5-foot status bonus to all your Speeds**, and **the first time each round you Stride, that
movement doesn't trigger reactions**.

**Style rider — Godspeed**
If you have moved at least **20 feet** this turn, the first Strike you make that turn makes its target
**off-guard to you until the end of your turn** on a hit.

**Cadence riders**

| Flowing with a… | grants |
| :---- | :---- |
| **Tier I** Form | You **Step 10 feet** as a free action. |
| **Tier II** Form | The target takes a **−10-foot status penalty to all its Speeds** until the end of your next turn. |
| **Tier III** Form | The target must succeed at a **Fortitude save** against your Slayer DC or be **stunned 1** (**incapacitation**). |

**The Forms**

**1 · Thunderclap and Flash** — *Tier I · 1 action*
Stride up to your Speed in a straight line. This movement doesn't trigger reactions and you are
**concealed** while moving. Then make a nichirin Strike.

**2 · Rice Spirit** — *Tier II · 2 actions · `flourish`*
Five arced slashes in a **15-foot cone**. Each creature takes **a blade's worth of electricity** with a
basic Reflex save. A creature that **fails** can't use reactions until the end of its next turn.

**3 · Thunder Swarm** — *Tier III · 2 actions · `flourish`*
Make a nichirin Strike against each of up to **three different creatures** within your reach, each dealing
**+1d6 electricity**; your multiple attack penalty increases as normal between them.

**4 · Distant Thunder** — *Tier I · 1 action*
Throw an arc of lightning off the blade's edge. Make a nichirin Strike against a creature within **30
feet**, ignoring any range penalty. The Strike deals **electricity** instead of its normal damage type.

**5 · Heat Lightning** — *Tier II · 1 action*
An upward cut faster than the eye. Make a nichirin Strike. On a hit the target **can't use reactions**
until the end of its next turn; on a critical hit it is also **stunned 1** (**incapacitation**).

**6 · Rumble and Flash** — *Tier III · 2 actions · `flourish`*
A **30-foot line**. Each creature takes **a blade's worth of electricity** with a basic Reflex save; on a
**critical failure** a creature is also **stunned 1** (**incapacitation**). You may instead split this
into **three 30-foot lines** that may overlap, each dealing **half** a blade's worth; a creature in two or
more lines rolls one save at a **−2 circumstance penalty** and takes the damage twice at most.

**7 · Sixfold** — *Tier I · 2 actions · `flourish`*
Thunderclap and Flash, doubled. Stride up to your Speed in a straight line and Strike, then do it again;
your multiple attack penalty increases as normal. Neither movement triggers reactions.

**8 · Eightfold** — *Tier II · 2 actions · `flourish`*
Stride up to **double your Speed** in a straight line; this movement doesn't trigger reactions and you may
move through enemies' spaces. Make a nichirin Strike against each of up to **two creatures** whose space
you pass through or move adjacent to; your multiple attack penalty increases as normal.

**9 · Godspeed** — *Tier III · 2 actions · `flourish`*
Stride up to **triple your Speed**; this movement doesn't trigger reactions and you may move through
enemies' spaces. Then make one nichirin Strike with a **+2 status bonus** to the attack roll. On a hit the
target is **stunned 1** (**incapacitation**).

**SECRET FORM — Seventh Form: Honoikazuchi no Kami** — *3 actions · `flourish`*
**Requirement** Your Breath Count is **7** (its maximum). *(Zenitsu Agatsuma's own form — the god of
thunder, drawn once.)*

Move up to **100 feet** in a straight line. This movement ignores difficult terrain, doesn't trigger
reactions, and can pass through creatures' spaces. A dragon of lightning trails you: each creature
adjacent to any point of your path takes **a blade's worth of electricity plus 4d6 electricity** with a
basic Reflex save, and one that critically fails is **stunned 1** (**incapacitation**).

End with a nichirin Strike gaining a **+2 status bonus** to the attack roll and dealing **+6d6
electricity** on a hit. On a hit, the target must also attempt a **Fortitude save** against your Slayer
DC: on a failure it is **stunned 1**, on a critical failure **stunned 2** (**incapacitation**).
**Your Breath Count then drops to 0.**

**Self-cost** Your legs give out. You are **slowed 1 for 1 minute**.

---

### WIND BREATHING

**Granted skill** Survival · **Damage type** slashing

| | |
| :---- | :---- |
| **Flowing** | **+3, +5, +7** |
| **Reaching** | **+1** |
| **Broken** | +2, +4, +6, +8 |

*Wind flows on **odd long steps** and strains on the short one — a gust that creeps is not a gust. Note
what **+7** means on a wheel: it is the same two positions you would call "back two," reached the only way
a wheel allows. Wind is the only style in this version that **flows by doubling back**, and a Wind slayer
learns to read 9 → 7 → 5 → 3 → 1 as forward motion, because on their wheel it is.*

**Stance — Cyclone Guard** *(1 action)*
Your nichirin Strikes gain the **sweep** trait (+1 circumstance bonus to attack rolls against a target
other than the last creature you attacked this turn), and you gain a **+1 circumstance bonus to Reflex
saves**.

**Style rider — Windborne Reach**
Your Forms' cones and emanations are **5 feet larger**, and any creature that **critically fails** a save
against one of your Forms is **pushed 5 feet**.

**Cadence riders**

| Flowing with a… | grants |
| :---- | :---- |
| **Tier I** Form | The target is **pushed 5 feet**. |
| **Tier II** Form | The target takes a **−10-foot status penalty to all Speeds** and **can't Step**, until the end of your next turn. |
| **Tier III** Form | You may **Fly up to half your Speed** as a free action; if you end that movement in the air you don't fall until the end of your next turn. |

**The Forms**
**1 · Dust Whirlwind Cutter** — *Tier I · 1 action · `flourish`*
A **15-foot cone** (20 feet with your rider) of cutting wind. Each creature takes **half a blade's worth of
slashing** with a basic Reflex save; a creature that critically fails is knocked **prone**.

**2 · Claws-Purifying Wind** — *Tier II · 2 actions*
Four descending air-claws. Make a nichirin Strike. On a hit the target takes a **−10-foot status penalty**
to all Speeds and **can't Step** until the end of your next turn; on a critical hit it is **immobilized**
until the end of its next turn and must Escape against your Slayer DC to move sooner.

**3 · Clean Storm Wind Tree** — *Tier III · **reaction***
**Trigger** You take damage from a Strike or from a physical effect.
A whirling guard of blades. You gain **resistance 3 + half your level** against the triggering damage, and
each creature adjacent to you takes **1d6 slashing** with a basic Reflex save; one that fails is **pushed
5 feet**.

**4 · Cold Mountain Wind** — *Tier I · 1 action*
Make a nichirin Strike. On a hit the target is **pushed 10 feet**, and you may **Step** into any space it
left.

**5 · Rising Dust Storm** — *Tier II · 2 actions · `flourish`*
A **10-foot emanation** (15 feet with your rider) of rising slashes. Each creature takes **a blade's worth
of slashing** with a basic Reflex save, and the area becomes **difficult terrain** until the start of your
next turn. A creature that **fails** is knocked **prone**. **Flying creatures** roll at a **−2 circumstance
penalty** and, on a failure, are knocked out of the air and fall.

**6 · Black Wind, Mountain Mist** — *Tier III · 2 actions · `flourish`*
Stride up to half your Speed — this movement doesn't trigger reactions — then cut a **30-foot line** along
your path. Each creature in the line takes **a blade's worth of slashing** with a basic Reflex save; one
that fails is **off-guard until the start of your next turn**.

**7 · Gale, Sudden Gusts** — *Tier I · 1 action*
Make a nichirin Strike and Stride up to half your Speed, in either order. Neither triggers reactions.

**8 · Primary Gale Slash** — *Tier II · 2 actions · `flourish`*
Make **two nichirin Strikes** against the same creature; your multiple attack penalty increases as normal.
**If both hit**, the target is **pushed 10 feet** and knocked **prone**.

**9 · Tempest's Eye** — *Tier III · 2 actions*
Make a nichirin Strike with a **+2 status bonus** to the attack roll. On a hit the target is **pushed 15
feet**, and each creature whose space it passes through, or that it ends adjacent to, takes **half a
blade's worth of slashing** with a basic Reflex save.

> Wind's Tier III single-target Form does not try to out-damage anybody. It turns the enemy into the
> projectile.

**SECRET FORM — Ninth Form: Idaten Typhoon** — *3 actions · `flourish`*
**Requirement** Your Breath Count is **7 or higher**.

Backflip-leap up to **double your Speed** in any direction; you have a fly Speed for this movement and
must land at the end of it. Each creature adjacent to any point of your path takes **a blade's worth of
slashing plus 4d6 slashing** with a basic Reflex save. A creature that **fails** is **pushed 10 feet**;
one that **critically fails** is knocked **prone** and **can't Stand** until the end of its next turn.

At any point during the movement, make one nichirin Strike with a **+2 status bonus** to the attack roll,
dealing **+4d6 slashing** on a hit. **Your Breath Count then drops to 0.**

**Self-cost** The violent rotation leaves you reeling. You are **dazzled and off-guard until the end of
your next turn**.

---

### STONE BREATHING

**Granted skill** Athletics · **Damage type** bludgeoning
**Key ability** Strength is recommended; a Stone slayer may choose Strength in place of the class default.

| | |
| :---- | :---- |
| **Flowing** | **+1, +2, +3** |
| **Reaching** | **+4, +5** |
| **Broken** | +6, +7, +8 |
| **Special** | A **Broken** transition **halves your Breath Count, rounded down**, instead of resetting it to 1. |

*Stone shares Water's arc and answers a break differently. Every other style that loses its breath starts
again from one; Stone keeps half of whatever it had. At Breath Count 8 a catastrophic misstep leaves you at
4 — which is more than most styles reach at all. **This is the style to hand a player who does not want to
think about the wheel**, and it is not a weaker choice for it: it is simply the one that forgives.*

**Stance — Immovable Guard** *(1 action)*
You gain a **+1 circumstance bonus to Fortitude saves**. If you have not left your space since the end of
your last turn, you also gain **resistance to bludgeoning damage equal to half your level** (minimum 1)
and a **+2 circumstance bonus** to your Fortitude DC against Shove, Trip, Grapple and Reposition, and to
saves against forced movement.

**Style rider — Mountain's Answer**
Once per round, when a creature within your reach hits you with a melee Strike, it takes **bludgeoning
damage equal to your number of weapon damage dice**.

**Cadence riders**

| Flowing with a… | grants |
| :---- | :---- |
| **Tier I** Form | You **Shove the target 5 feet** with no check and no multiple attack penalty increase. |
| **Tier II** Form | The target is **off-guard to all creatures** until the start of your next turn. |
| **Tier III** Form | You gain **resistance to all physical damage equal to half your level** until the start of your next turn. |

**The Forms**

**1 · Serpentinite Bipolar** — *Tier I · 1 action*
Make a nichirin Strike with a **+1 status bonus** to the attack roll, dealing **+1d6 bludgeoning**. On a
hit you **Shove the target 5 feet** with no check and no multiple attack penalty increase; on a critical
hit you Shove it **10 feet** and it is knocked **prone**.

**2 · Upper Smash** — *Tier II · 1 action*
**Requirement** The target is **larger than you**, **prone**, **grabbed**, **restrained**, or has already
taken damage from you this combat.
Drive the blade upward. Make a nichirin Strike dealing **+2d6 bludgeoning**. On a hit the target is
**off-guard to all creatures** until the start of your next turn; on a critical hit it is also knocked
**prone**.

**3 · Volcanic Rock, Rapid Conquest** — *Tier III · 2 actions · `flourish`*
A **15-foot cone** of shattered earth. Each creature takes **a blade's worth of bludgeoning** with a basic
**Fortitude** save — note the defence; Stone hits the save most area effects miss. The area becomes
**difficult terrain** until the start of your next turn. A creature that **fails** is knocked **prone**;
one that **critically fails** is **immobilized** beneath the rubble until it Escapes against your Slayer
DC.

**4 · Stone Skin** — *Tier I · 1 action · **Duration** 1 minute*
Your skin takes on the density of rock. You gain **resistance to all physical damage except adamantine
equal to half your level** (minimum 2), and you **cannot be knocked prone or forcibly moved** by anything
other than a creature two or more sizes larger than you.

**5 · Stonefall Crush** — *Tier II · 2 actions*
Make a nichirin Strike with a **+1 status bonus** to the attack roll. On a hit the target is knocked
**prone** and takes a **−10-foot status penalty** to all Speeds until the end of your next turn.

**6 · Iron Mountain Hold** — *Tier III · **reaction***
**Trigger** A creature within your reach Strikes you, or attempts to Shove, Trip, Grapple or Reposition
you.
You set your weight against it. Against a forced-movement or positioning attempt you **automatically
critically succeed** at the defence; against a Strike you gain **resistance 5 + half your level** to its
damage. Either way, the creature takes **half a blade's worth of bludgeoning**.

**7 · Quaking Tread** — *Tier I · 1 action*
Stride up to half your Speed, ignoring difficult terrain, then make a nichirin Strike. On a hit the target
**can't Step** until the end of its next turn.

**8 · Tectonic Grind** — *Tier II · 2 actions · `flourish`*
Make **two nichirin Strikes** against the same creature; your multiple attack penalty increases as normal.
**If both hit**, the target is **grabbed** and must Escape against your Slayer DC.

**9 · Bedrock Sunder** — *Tier III · 2 actions · `flourish`*
Split the ground in a **10-foot emanation**. Each creature takes **a blade's worth of bludgeoning** with a
basic **Fortitude** save; one that fails is knocked **prone**. The ground in the area becomes **difficult
terrain until the encounter ends**.

**SECRET FORM — Fifth Form: Arcs of Justice** — *3 actions · `flourish`*
**Requirement** Your Breath Count is **7 or higher**.

Make **four nichirin Strikes**, divided among creatures within your reach as you choose; your multiple
attack penalty increases as normal after each. Each deals **+2d6 bludgeoning** on a hit, and each hit lets
you either **pull the target 5 feet toward you** or knock it **prone** — your choice, no check, no
multiple attack penalty increase.

Until the start of your next turn you gain **resistance 15 to all damage**, you **cannot be forcibly
moved**, and you automatically **critically succeed** at saves and DCs against being knocked prone.
**Your Breath Count then drops to 0.**

**Self-cost** The rooted stance holds you. Your **Speeds are 0 until the end of your next turn**.

---

### MOON BREATHING †

*Kokushibo's style. Deliberately the most aggressive in the book, and it pays for that in self-costs.*

**Granted skill** Intimidation · **Damage type** slashing (chaotic crescent blades)

| | |
| :---- | :---- |
| **Flowing** | **+2, +4, +6, +8 — every even step** |
| **Reaching** | **none** |
| **Broken** | +1, +3, +5, +7 — every odd step |
| **Special** | A **Broken** Moon Form **keeps its own printed rider.** It still loses the Cadence rider, still takes the −2, and still resets your Count to 1. |

*Moon is the inversion, and it is the most interesting wheel in the book for one reason: **+8 is the same
as "back one," and +6 is the same as "back three."** Those are the two steps that break every other style
in this document, and they are the two Moon lives on. A Moon slayer's natural line runs **9 → 7 → 5 → 3 →
1 → 8 → 6 …** — the wheel read anticlockwise, which is forward motion only on this wheel.*

*Its Tier I triangle is the same three Forms as everyone else's — **1, 4, 7** — traversed by **+6**
instead of +3, which is to say **walked in the opposite direction**: 1 → 7 → 4 → 1. Kokushibo's breathing
is the same breathing as his brother's, running backwards. That is the whole character in one line of
topology.*

*Having no Reaching set at all means **half of Moon's possible steps are catastrophic**, and that is why a
Broken Moon Form keeps its teeth: Moon breaks often, and breaks softly on the Form itself while paying
in full on the Count.*

**Stance — Crescent Chaos** *(1 action)*
Once per round, when you roll damage for a Form, you may **reroll one damage die** and take the higher
result.

**Style rider — Borrowed Light**
*The moon makes no light of its own. What it takes from something brighter, it hands down to everything
standing underneath it.*

The first time each round that you hit a creature with a nichirin Strike or a Form, it becomes
**moonlit** until the end of your next turn. While a creature is moonlit:

- It is **not concealed** from you or from any ally within 30 feet of it, and it **can't be hidden or
  undetected** from them.
- The first Strike each round that an ally **in a Breathing Stance** makes against it deals **+1 precision
  damage per weapon damage die**. If that ally's own style rider would also apply, use the higher — they
  don't stack.
- When you **critically hit** it, erratic crescents splash **one enemy adjacent to it** for slashing damage
  equal to your **number of weapon damage dice**.

**Lend the light.** Once per round as a free action, choose one willing ally within 30 feet. Until the end
of your next turn they count as being **in a Breathing Stance** — for the second bullet above, and for
nothing else.

**Cadence riders**

| Flowing with a… | grants |
| :---- | :---- |
| **Tier I** Form | The target takes **1d6 persistent bleed**. |
| **Tier II** Form | The target is **off-guard until the start of your next turn**. |
| **Tier III** Form | The target takes **2d6 persistent bleed**, and until the end of your next turn that bleed **can't be ended by the usual flat check**. |

**The Forms**
**1 · Dark Moon, Evening Palace** — *Tier I · 1 action*
Make a nichirin Strike with a **+1 status bonus** to the attack roll, dealing **+1d6 slashing**. On a hit,
crescents linger: the first time the target moves before the start of your next turn, it takes slashing
damage equal to **twice your number of weapon damage dice**. On a critical hit it also **can't Step** until
the end of its next turn.

**2 · Pearl Flowers, Moongazing** — *Tier II · 2 actions · `flourish`*
A crescent volley in a **15-foot cone**. Each creature takes **a blade's worth of slashing** with a basic
Reflex save. A creature that **fails** takes **2d6 persistent bleed**; one that **critically fails** takes
**4d6 persistent bleed** and is **off-guard until the start of your next turn**.

**3 · Loathsome Moon, Chains** — *Tier III · 2 actions · `flourish`*
Two enormous linked crescents sweep out in a **30-foot line**. Each creature takes **a blade's worth of
slashing** with a basic Reflex save. A creature that **fails** is **off-guard until the start of your next
turn**; one that **critically fails** is **grabbed by the chains** and must Escape against your Slayer DC
to move.

**4 · Moon-Dragon Ringtail** — *Tier I · 1 action*
Make a nichirin Strike. On a hit, each creature **adjacent to the target** takes slashing damage equal to
**your number of weapon damage dice**.

**5 · Mirror of Misfortune, Moonlit** — *Tier II · **reaction***
**Trigger** A creature you can see within 30 feet hits you with a Strike.
The wound reflects. That creature takes slashing damage equal to **twice your number of weapon damage
dice** and becomes **moonlit** until the end of your next turn.

**6 · Perpetual Night, Lonely Moon** — *Tier III · 2 actions*
Make a nichirin Strike with a **+2 status bonus** to the attack roll. On a hit the target takes **2d6
persistent bleed** and becomes **moonlit**; on a critical hit, every creature within 15 feet of it also
becomes **moonlit**.

**7 · Moon Spirit Calamity** — *Tier I · 2 actions · `flourish`*
Rising crescents fill a **20-foot cone**. Each creature takes **a blade's worth of slashing** with a basic
Reflex save; one that **fails** is knocked **prone**, and one that **critically fails** also takes **2d6
persistent bleed**. The area stays **filled with spinning crescents** until the start of your next turn:
any creature that ends its turn inside, or moves through it, takes **half a blade's worth of slashing**.

**8 · Waning Moonswaths** — *Tier II · 2 actions · `flourish`*
Make **two nichirin Strikes** against the same creature; your multiple attack penalty increases as normal.
A single hit inflicts **1d6 persistent bleed**; **if both hit**, **3d6 persistent bleed** instead.

**9 · Catastrophe, Tenman Crescent Moon** — *Tier III · 2 actions · `flourish`*
Choose a **10-foot emanation** or a **30-foot line**. Each creature in the area takes **a blade's worth of
slashing** with a basic Reflex save; one that **fails** takes **2d6 persistent bleed**, and one that
**critically fails** is knocked **prone**.

**FORBIDDEN FORM — Sixteenth Form: Moonbow, Half Moon** † — *3 actions · `flourish`*
**Requirement** Your Breath Count is **7 or higher**.

A cascade of half-moon blades rains down in a **40-foot cone**. Each creature takes **a blade's worth of
slashing plus 6d6 slashing** with a basic Reflex save. A creature that **fails** takes **4d6 persistent
bleed**; one that **critically fails** is also knocked **prone**, and its bleed **cannot be ended by the
usual flat check** — it requires magical healing, or an Interact action from an adjacent creature, to
stanch.

Any creature that **begins its next turn in the area** takes **6d6 slashing** as the crescents keep
spinning. **Your Breath Count then drops to 0.**

**Self-cost (forbidden)** The technique feeds on your vitality. You become **drained 1** — **drained 2** if
any creature was reduced to 0 Hit Points by the cone — and this drain **cannot be removed until you rest
for 10 minutes**.

---

## 9 — Class feats

*Feats sit **outside** the 2100-point budget, exactly as in v4 and as for every published class. An anchor
is cited where the level needs defending.*

### 9.1 The acquisition ladder

| Source | Lvl | Grants |
| :---- | :---- | :---- |
| **Chassis: Breath Cadence** | 1 | Tier I — wheel positions **1, 4, 7** |
| **Chassis: Second Breath** | 5 | Tier II — wheel positions **2, 5, 8** |
| **Feat: Third Tier** | 8 | Tier III — wheel positions **3, 6, 9** |
| **Feat: Hidden Form** | 20 | Your **Secret** or **Forbidden** Form |

**Two feats for ten Forms.** v4 spent three feats to reach five. Granting Forms in tiers of three is what
makes a ten-Form wheel affordable, and it is the reason the wheel is a playable object rather than a
shopping list.

### 9.2 The feat list

#### Level 1

**Slayer's Conditioning** — *Anchor: Fleet.*
+5-foot status bonus to Speed while in a Breathing Stance and wearing no heavier than light armour.

**Demon Lore** — *Anchor: Monster Hunter (ranger 1).*
Trained in Demon Lore. When you Recall Knowledge about a fiend or undead, a success also reveals one
weakness or resistance; a critical success also reveals its lowest save.

**Water-Wheel Footwork** — *Anchor: Nimble Dodge (rogue 1).*
**Reaction**, **Trigger** a creature targets you with an attack and you can see it. Gain a +2 circumstance
bonus to AC against that attack. If you are in a Breathing Stance you may also Step afterward.

**Measured Breath** — *Anchor: Cat Fall-tier utility.*
When you roll initiative while in a Breathing Stance, your Breath Count becomes **1** instead of 0. You
have been breathing since before anyone drew.

#### Level 2

**Kamae** ✦ — **the prediction line starts here.**
**Free action**, **Trigger** you use a Form. Name a **tier**, or a **three-position arc** of your wheel
("anything from 4 to 6"). Until the end of your next turn you are *set*.
- **Fulfilled** — the matching Form automatically **carries the Crest** (this still spends your once-per-round
  Crest), it **counts as two links** of Breath Count instead of one, and it costs **1 fewer action**
  (minimum 1).
- **Not fulfilled** — no benefit, and that Form's transition is treated as **Reaching** even if it would
  have Flowed.

> **Release** ✦ **free action.** Cancel a Kamae you are holding before it resolves: no benefit, no penalty.
> This exists so that a dead target, a Stride out of reach or a stun is never the reason a player stops
> using the mechanic. *Kamae must never leave you worse off than not calling at all.*

**Unbroken Step** — *Anchor: Nimble Roll-tier.*
The first time each round you Step, it doesn't trigger reactions, and a Form you use in the same turn
treats a **Broken** transition as **Reaching**. Once per encounter.

**Battle Breathing** — *Anchor: Rapid Response-tier.*
You may enter a Breathing Stance as a **free action** at the start of your first turn of an encounter.

**Form Study** — *Anchor: Multitalented-tier versatility.*
Learn one additional Form of a tier you already have access to, from **any** style in §8, and place it on
your own wheel at the position it occupies in its home style. If that position is already occupied, you
may use either Form there; they share the position for transition purposes.

#### Level 4

**Flowing Stance Shift** — *Prerequisite for the secondary ladder.*
Choose a second Breathing Style. You gain its **stance** and its **granted skill**, but not its style rider
and not its Forms. You may change stances once per round as a free action.

**Deep Cut** — *Anchor: Power Attack (fighter 1), two levels up for being unconditional.*
Your Crest's extra dice are **d8s** when your Breath Count is **6** or higher, rather than only at 9.

**Two Moves Ahead** — *Anchor: Devise a Stratagem's information-first design.*
When you enter a Breathing Stance, or at the start of your turn, name one Form. Until the end of that turn,
you know whether using it would Flow, Reach or Break **and** what its Cadence rider would be. For new
players of a style whose topology they haven't memorised, this is a training-wheels feat and it is meant to
be retrained away.

**Slayer's Vigil Extended** — *Skill-feat-adjacent.*
Your Corps standing extends to any allied holding. Additionally, become trained in one additional skill and
gain a +1 circumstance bonus to Diplomacy with Corps members and their families.

#### Level 6

**Read the Thread** — *Prerequisite: Kamae.*
Your Kamae may name an **exact Form** rather than a tier or arc. When an exact call is fulfilled, it counts
as **three links** instead of two, and the Form gains a **+2 status bonus** to its attack roll or its save
DC.

**Borrowed Form** — *Prerequisite: Flowing Stance Shift.*
You gain your secondary style's **Tier I Forms** (positions 1, 4, 7) and its **style rider** while in its
stance. Your secondary style's topology applies while in its stance.

**Tide-Turner** — *Anchor: Opportune Riposte-tier.*
When a creature critically fails an attack roll against you while you are in a Breathing Stance, you may
use a Tier I or Tier II Form that takes 1 action as a **reaction** against it. This Form's transition is
measured and advances your Count normally.

**Crescent Reading** — *Anchor: Sixth Sense-tier.*
You gain a +2 circumstance bonus to Perception checks to Seek, and creatures you have hit this encounter
cannot become undetected by you while you remain in a Breathing Stance.

#### Level 8

**Third Tier** — *The ladder feat.*
You learn your primary style's **Tier III Forms** — positions **3, 6 and 9**.

**Unshakeable Core** — *Anchor: Bloody Blades-tier patch.*
You gain a +2 status bonus to saves against fear, and you can never be more than frightened 1 while in a
Breathing Stance. *(The class's Will ceiling is Expert and this does not fix it — it patches one hole.)*

**Adopted Cadence** — *Prerequisite: Borrowed Form.*
Your secondary style's **Cadence riders** apply to its Forms, and you may switch stances **without**
resetting your Breath Count, provided the Form you use immediately after the switch would Flow on the new
style's topology.

**Breathless Pursuit** — *Anchor: Sudden Leap (fighter 8).*
Once per round, after a creature within 30 feet Strides, Steps or is forcibly moved away from you, you may
Stride up to half your Speed toward it as a free action.

#### Level 10

**Double Kamae** — *Prerequisite: Kamae.*
You may hold **two** Kamae at once and fulfil either. Fulfilling one discards the other with no penalty.

**Adopted Form** — *Prerequisite: Borrowed Form; Third Tier.*
You gain your secondary style's **Tier II Forms** (positions 2, 5, 8).

**Deepening Breath** — *Anchor: a +1-to-a-core-number feat at 10.*
Your Breath Count cap increases by **1**, to a maximum of 9. *(Thunder's cap of 7 is a style clause, not
your cap, so this feat does not raise it — and neither `Deepening Breath` nor `Deep Cut` does anything for a
Thunder slayer, whose Count is only ever odd and who already reaches d8s at 7. Thunder's feat is `Cut the
Corner`, which gives it the Reaching set it otherwise does not have.)*

**Cut the Corner** — *Anchor: Flexible Flanker-tier.*
One step of your choice moves from your style's **Broken** set to its **Reaching** set, permanently. Choose
when you take this feat.

#### Level 12

**Stance Savant** — *Anchor: Stance Savant (fighter/monk 12), verbatim.*
You enter a Breathing Stance as a free action at the start of your first turn of an encounter, and
**nothing short of unconsciousness removes you from it**.

**Fused Breathing** — *Prerequisite: Adopted Cadence.*
Your chain survives a stance change outright, provided the Form you leave on and the Form you arrive on
**share a wheel position** or **share a damage type**. This is the Hinokami pivot, and it is the best reason
to run two styles.

**Ninefold Study** — *Prerequisite: Third Tier.*
Learn two additional Forms from any style in §8, at any tier you have access to, placed as `Form Study`
places them.

**The Long Breath** — *Anchor: Meditative Focus-tier, at the same level.*
When you would lose Breath Count because a turn ended with no Form used, you lose none. The chain waits.

#### Level 14

**Kamae of the Unopened Eye** — *Prerequisite: Read the Thread.*
When you fulfil a Kamae, you may also make one nichirin Strike as a **free action**. This Strike does not
increase your multiple attack penalty.

**Transparent World** — *Prerequisite: Transparent World Glimpse.*
Your blood sense becomes **precise** out to 30 feet and functions whether or not you are in a stance. The
"read its flow" clause applies to **every** Strike you make rather than once per round, and you always know
a creature's approximate remaining Hit Points as a proportion of its maximum.

**Assimilated Form** — *Prerequisite: Adopted Form.*
You gain your secondary style's **Tier III Forms** (positions 3, 6, 9). **No slayer ever learns a second
Secret Form.**

**Crest of Two Waves** — *Anchor: a capstone-adjacent action-economy feat.*
When the Form carrying your Crest is an area Form, you may halve the Crest's extra dice and apply them to
**every** creature in the area rather than only the primary target.

#### Level 16

**Feint the Form** — *Prerequisite: Read the Thread.* **The class thesis.**
If your Kamae is **not** fulfilled, but between your call and your next Form an enemy spent a Reaction,
Raised a Shield, Stepped away, or otherwise visibly responded to the Form you named, then: the transition
you actually make is treated as **Flowing**, and that enemy is **off-guard to you** until the end of your
next turn.

> You were never going to use that Form. You wanted them to think you were. This feat is the reason the
> prediction mechanic is a *build* and not a gamble.

**Perfect Cadence** — *Anchor: a +1-step-on-a-core-number feat at 16.*
Your **Reaching** steps count as **Flowing** in all respects, at any Breath Count. Your style's Broken set
is unchanged.

**Unbreaking Wheel** — *Anchor: Stone's style clause, generalised, eight levels later.*
A **Broken** transition halves your Breath Count rounded down instead of resetting it to 1, and the Form
keeps its own printed rider. *(A Stone slayer who takes this keeps the rider as well, which is the upgrade.)*

**Wide Breath** — *Anchor: Wide Sweep-tier.*
Your Forms' cones, lines and emanations are **5 feet larger**. *(Wind's rider and this feat stack.)*

#### Level 18

**Awakened Mark** — *Prerequisite: Demon Slayer Mark.*
Your Mark's frequency becomes **once per minute**, its duration becomes **2 minutes**, and while it burns
your Breath Count **cannot drop below 4** for any reason.

**Ceaseless Breath** — *Anchor: a 18th-level sustain feat.*
At the start of each of your turns, if your Breath Count is below your cap, it increases by **1**. You are
always climbing, even on a turn spent Striding.

**Hundred-Form Mind** — *Prerequisite: Ninefold Study.*
Learn every Form of every tier you have access to from **one** additional style in §8. You do not gain its
stance, rider or topology; you place its Forms on your own wheel as `Form Study` does.

#### Level 20

**Hidden Form** — *The ladder feat.*
You learn your primary style's **Secret** or **Forbidden Form** (§4.7).

**Twin Crest** — **Frequency** once per minute.
You give the Crest to a **second** Form in the same round.

> Gated at once per minute on purpose. The once-per-round Crest is the single lever holding this class's
> damage inside a martial budget (§10.2), and a feat that removes it permanently would not be a feat, it
> would be a different class. Once a minute, at 20th level, is a capstone.

**Final Breath** — *Anchor: a 20th-level defiance capstone.*
**Frequency** once per day. **Trigger** you are reduced to 0 Hit Points while in a Breathing Stance. You
remain at 1 Hit Point, your Breath Count becomes **your cap**, and you may immediately use your Secret Form
as a **free action**, ignoring its requirement but not its self-cost.

---

## 10 — The audit

v4's audit checked **monotonicity** — that First ≤ Second ≤ Third ≤ Fourth < Final at rank 10. That
question is gone with the ladder: Forms no longer have ranks, do not heighten, and are not ordered by
power. Three different questions replace it.

### 10.1 The per-turn curve — does the class start below a martial and end above it?

**Reference build:** 20th-level Water slayer, katana, +3 major striking, key ability +7, Master attacks
(+36), greater weapon specialization +6, `Concentrated Breathing` +16. **A nichirin Strike is 47 damage.**
Three 1-action Forms in a turn, Crest on the first.

| Breath Count | Crest | Crested Form | Expected damage that turn |
| ---: | :---- | ---: | ---: |
| **0** | — | 47 | **≈ 59** |
| **3** | +3d6 (10.5) | 57.5 | **≈ 66** |
| **6** | +6d6 (21.0) | 68 | **≈ 74** |
| **9** | +9d8 (40.5) | 87.5 | **≈ 87** |

*(Expected values use 0.70 / 0.40 / 0.15 damage multipliers for the three MAP steps against AC 45,
including critical hits.)*

A 20th-level fighter making three plain Strikes with the same weapon and no feats expects **≈ 53**. So:

- **At Breath Count 0 the slayer is a fighter with slightly worse accuracy and a precision rider that
  pays for it.** That is the floor, and it is why `Concentrated Breathing` must not be touched.
- **At maximum Count the slayer is ~60% above its own floor** — once per round, after nine links, and only
  on the one Form it nominated.
- **The curve is monotone in the Count, not in the Form.** That is the shape v5 wants, and it is
  checkable in one table rather than eleven.

### 10.2 The Crest budget — is the total inside v4's?

v4's entire Form budget was **90–110 points of Form damage per four-round fight** (three Forms at 25–45).
v5's equivalent is the Crest, spent once per round. Round 1 assumes one action spent entering the stance,
so two Forms; rounds 2–4 assume three.

| Style | Count per Flowing step | Cap | R1 | R2 | R3 | R4 | **4-round Crest total** |
| :---- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| **Water** / Flame / Wind / Stone / Moon | +1 | 9 | 7.0 | 17.5 | 28.0 | 40.5 | **93** |
| **Thunder** | **+2** | **7** | 10.5 | 31.5 | 31.5 | 31.5 | **105** |

**Both land inside v4's budget**, which is the result this rework needed. Note the shapes differ even
though the totals nearly match: Water climbs and peaks on the last round of a long fight, Thunder is at
its ceiling by round 2 and stays there. Thunder's ~13% higher total is paid for by having **no Reaching
set at all** — a single mis-stepped Form resets it to 1, and getting back to 7 costs a full turn.

> **The corollary worth stating plainly:** in a fight that ends in two rounds, the Breath Slayer is a
> martial with a good toolkit and nothing more. The class is explicitly bad at short fights and explicitly
> excellent in long ones. Tell a player this before they build one.

### 10.3 The cost of a Break — is the punishment real but survivable?

| | Water / Flame / Wind / Moon | **Stone** |
| :---- | :---- | :---- |
| Count before the Break | 8 | 8 |
| Count after | **1** | **4** |
| Flowing transitions to recover | 7 (≈ 2½ turns) | 4 (≈ 1½ turns) |
| Crest damage lost over the next two rounds | **≈ 45** | ≈ 20 |

A Break costs roughly **half a round of total damage output, twice over.** That is a large penalty that
never reads as a penalty: you are not given a condition, you are not told to subtract anything, you simply
find that the wave you were riding is gone. Which is the correct way to punish a player in PF2e.

Moon breaks most often (four of eight steps) and is compensated by keeping the Form's own rider. Stone
breaks as rarely as Water and recovers in half the time — it is the forgiving end of the spread, and
`Unbreaking Wheel` (feat 16) sells Stone's clause to everyone else four levels after Stone stops needing it.

### 10.4 What the throttles are actually doing

| Throttle | Stops |
| :---- | :---- |
| **Once-per-round Crest** | Three Crested Forms in a turn — the multiplication that would have put this class at ~280 points of rider damage per fight |
| **MAP** | 1-action Strike Form spam. Seven of Water's nine Forms contain a Strike, so the third Form in a turn is at −10 and expects 15% of its damage |
| **`flourish`** | Three area Forms in a turn. Every cone, line and emanation in §8 carries it |
| **The wheel itself** | Using your single best Form every round — you cannot, because **+0 is Stalled** |
| **Count caps on the chassis** | The whole system arriving at 1st level. Cap 2 until 5th means low-level play is three Forms and a precision rider |

Note that **none of these are new rules.** MAP and `flourish` are system-standard; the Crest cap and the
wheel are the class's two mechanics. There is no resource to track, no recharge to remember, and no
frequency clause anywhere in §8 except on the six Secret Forms, which use a Breath Count requirement
instead.

---

## 11 — Porting the remaining five styles

**Not in this version:** Sound, Flower, Mist, Love, Serpent. Porting each one needs exactly four things.

1. **A topology.** One line: the Flowing set, the Reaching set, and any style clause. It must contain
   **+3 or +6**, or the Tier I triangle (positions 1/4/7) cannot close and the style is unplayable at
   1st level. Candidate topologies held back from v4's identities:
   - **Sound** — Flowing +1 … +4, but the **Count caps at 6 and the Crest pays +2 dice per point.** Fast
     burn, low ceiling, highest per-Crest number in the book.
   - **Flower** — Flowing +1 … +3; **completing a full lap of the wheel in one chain pays out once per
     encounter.** The counter-duellist's long game.
   - **Mist** — Flowing +1 … +3, and **Reaching never takes the −2 and always grants the Cadence rider.**
     Mist has no edges; it is the most forgiving topology and the natural beginner style alongside Stone.
   - **Love** — Flowing +1 … +3, and **each Flowing transition also pays an ally** (Love's outward-facing
     rider, routed through the chain).
   - **Serpent** — Flowing **+1 and +8 only.** The snake coils both ways: the narrowest wheel, but
     bidirectional, and it loops 9 → 1 instantly. Brutal, and the best fit for `Read the Thread`.
2. **Three Cadence riders**, one per tier. Small / medium / large. This is where most of the style's feel
   lives and it is three lines, not nine.
3. **Nine Forms** at positions 1–9, with **Tier I at 1/4/7** — and Tier I must be playable as a **directed
   loop** on day one (§4.1), so: **no reaction Form and no Requirement clause at positions 1, 4 or 7**, at
   most one `flourish` among the three, and at least two of them single Strikes costing 1 action.
4. **A Secret Form** with a Breath Count 7 requirement, a `flourish`, a Count reset to 0, and a lasting
   self-cost. v4's Final Forms port almost unchanged; replace every "Frequency once per 10 minutes" with
   the requirement and replace flat area dice with **a blade's worth**.

**The rescale rule for porting a v4 Form:** strip its heightening line, drop its printed dice to **1d6 or
2d6 flat** (or to **a blade's worth** if it is an area Form), and keep every condition and every movement
clause exactly as written. v4's conditions were its best work and they survive intact; only its numbers
were built for a resource economy that no longer exists.

---

## 12 — GM and playtest notes

### 12.1 The watch list

| Watch | Why | If it breaks |
| :---- | :---- | :---- |
| **`Twin Crest` (feat 20)** | It removes the once-per-round cap, which is the entire balance lever | Raise the frequency to once per 10 minutes, or cut the feat |
| **Thunder's +2 ramp** | It reaches its ceiling by round 2, which is the whole point, but it means Thunder is the best style in a three-round fight by a wide margin | Drop the cap to 6, or make the +2 apply only below Count 4 |
| **`Perfect Cadence` (feat 16)** | Turning Reaching into Flowing erases three-eighths of the wheel for Water and Stone | Restrict it to one named step, like `Cut the Corner` |
| **`Ceaseless Breath` (feat 18)** | Free Count every turn decouples the Count from playing well | Limit to once per encounter, or require that you used no Form that turn |
| **Moon's rider-on-Break clause** | Combined with persistent bleed Cadence riders, a Moon slayer who never cares about breaking may out-damage one who does | Remove the clause and give Moon a Reaching set of +1 instead |
| **Reaction Forms advancing the chain** | It is strong, it is intended, and it means four Forms in a round is reachable | Nothing — but know that it is why every style here has exactly one reaction Form and no more |

### 12.2 Running the table

- **Ask for the Breath Count out loud at the start of each of the slayer's turns.** One number, one word.
  It keeps everyone synchronised and it takes two seconds.
- **The Crest is declared before the roll, out loud.** "This one rides the wave." If a player forgets to
  declare and then wants it after seeing the die, the answer is no — that is the mechanic.
- **Print the wheel.** A nine-position circle with the Flowing arc shaded and the Forms labelled is the
  single highest-value prop for this class. All six wheels in §8 are the same diagram with a different arc
  shaded and different names, so one template serves the whole class.
- **Do not let a rule depend on two Forms back.** Only the last Form is history. If a player asks whether
  something three Forms ago matters, the answer is always no.
- **A new player should be handed Stone or (once ported) Mist.** Both forgive a misread wheel. Hand Flame
  or Moon to someone who wants to think.

### 12.3 Two things this version deliberately does not do

**It does not write the Form's damage as the Form's point.** If a player complains that Water Surface
Slash only adds 1d6 at 20th level, the answer is that it adds 1d6 *and a position on the wheel*, and the
wheel is worth 40 points of Crest. Forms are priced as fighter feats (§1.4) because they are used like
fighter feats.

**It does not let the chain break on a miss.** This is the most-requested "realism" change and it must be
refused. At 1st level, with cap 2 and the worst attack bonus you will ever have, a chain that breaks on a
miss means the class does not function. Misses cost you the *advance*, never the *chain*.

---

## Appendix — the system in one block

```
CHASSIS 1410 + FEATURES 690 = 2100            (BCS 1.4; feats outside the budget)
Chassis identical to v4. Feature block re-spent: Breath Cadence 10 -> 40,
Nichirin Resonance 80 -> 50. Everything else unchanged.

FORMS ARE MARTIAL ACTIONS, not focus spells. No rank. No heightening. No cost.
Trait: slayer. Saves use your Slayer DC. Priced against fighter feats.
A BLADE'S WORTH = your weapon damage rolled once: dice, runes, ability, weapon spec.
                  NOT Concentrated Breathing. Never doubled. (~33 at level 20.)

THE WHEEL  9 positions + a Secret Form off-wheel.
           Tier I = 1, 4, 7 (level 1)   Tier II = 2, 5, 8 (level 5)
           Tier III = 3, 6, 9 (feat 8)  Secret = off-wheel (feat 20)
           Tiers interleave so 1 -> 4 -> 7 -> 1 closes on +3 (+6 for Moon):
           a 1st-level slayer has a sustainable three-Form loop on day one.

TRANSITION Step FORWARD from the last Form used, wrapping, giving 0-8.
           FLOWING  -> Count +1, Form gains its tier's Cadence rider
           REACHING -> Count +1, no rider, -2 to its attack or DC
           BROKEN   -> Count resets to 1, -2, and the Form loses its own rider
           STALLED  -> nothing (this is the anti-spam rule)
           First Form of an encounter is always Flowing.
           Reaction Forms chain normally.

THE CREST  Once per round, declared before the roll: +1d6 per point of Count.
           +1 to its attack/DC at Count 4, +2 at 7, dice become d8s at 9.
           Count 3+: the Crested Form costs 1 fewer action (min 1).
           Count 6+: Reaching takes no penalty and grants the rider.
           Count 7+: the Secret Form is available. It drops you to 0.

COUNT CAP  2 @ L1 -> 4 @ L5 -> 6 @ L9 -> 9 @ L13.   (Thunder: 7, always.)
RESETS     Break -> 1. No Form used in a turn -> -1. Leaving the stance,
           stunned/paralysed/unconscious, encounter end (until L12) -> 0.
           A MISS NEVER BREAKS THE CHAIN.

THROTTLES  the once-per-round Crest  (the real lever)
           MAP                        (most Forms contain a Strike)
           flourish                   (every area Form)
           +0 is Stalled              (you cannot spam your best Form)
           the chassis Count caps     (the system arrives at 5th, not 1st)

FLOOR      Concentrated Breathing, unchanged: +2/+3/+4 precision per weapon die,
           unconditional. At Count 0 the class is still a martial. This is load-bearing.

TOPOLOGIES Water   Flowing +1 +2 +3      Reaching +4 +5
           Flame   Flowing +3 +4 +5      Reaching +1 +2      (it must leap)
           Thunder Flowing +3 only, +2 Count, cap 7, d8 at 7, no Reaching
           Wind    Flowing +3 +5 +7      Reaching +1         (+7 doubles back)
           Stone   Flowing +1 +2 +3      Reaching +4 +5      Break halves, not resets
           Moon    Flowing even steps    no Reaching         Broken keeps the rider
```

---

*Breath Slayer, guide v5.0 — the combo rework. Six styles written in full; five await the four-step port
in §11. Costed against BCS 1.4 on the same 2100-point budget as v4 and as The Saint. Supersedes
`breath-slayer-guide-v4.md`; built from `breath-slayer-v5-combo-brainstorm.md` rev. 2.*

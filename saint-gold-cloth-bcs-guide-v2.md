# The Saint — PF2e Class Guide, **Version 2**

### *Los Caballeros del Zodiaco · 聖闘士 · Gold Cloth edition*

*A ground-up revision incorporating everything the stress-tests and web-benchmarking found. Every Technique now runs on a per-level rank spine; every boon follows the ×1.30 / ×2.00 sky curve; every death effect carries incapacitation. Plugs into **The Sky** framework (Stargazer guide, Part 6). Final budget: **exactly 2100 points.***

**What changed from v1** — read this if you have the old guide: fist is now 1d6 (the −15% normal-day floor); Techniques are defined by base-rank formulas that auto-heighten, not fixed numbers; the twelve Cloths are re-tuned to the 0.85/1.30/2.00 curve; five "or die" boons gained the incapacitation trait; Pisces' aura shrank from 30 ft to 10 ft; Leo's Plasma dropped from 5 Strikes to 3; Gemini's duplicate is Strike-only; Unfailing Cosmo and Shelter of the Cloth were re-priced (freeing 50 points spent on Cosmo Strike and a utility skill). The class stays a martial focus-user — **not** a spell-slot caster; the reasoning is in §1.4.

---

## 1 — Design foundations

### 1.1 The pitch

A Gold Saint stands in the attack, wearing gold, and punches a god. Eleven days out of thirteen they're an excellent-but-not-dominant martial (a utility striker in the Investigator's weight class). On the thirteenth — the day their own constellation rises — the Cloth burns and they become something else. On one day in 260, the sky exalts them and they are briefly unstoppable.

### 1.2 The three-tier curve (the spine of the whole class)

Everything is tuned to this, relative to a same-level class performing normally:

| Sky state | Saint is | Multiplier | Frequency |
| :---- | :---- | :---- | :---- |
| **Normal day** | \~15% weaker | ×0.85 | \~11/13 days |
| **Ascendant** (their sign rises) | \~30% stronger | ×1.30 | 1/13 days |
| **Zenith** (their sign rises *Exalted*) | \~100% stronger | ×2.00 | 1/260 days |

Two levers carry it. The **−15% floor** lives in the shared Strike line (fist is 1d6, no flurry). The **\+30%/+100%** lives in Techniques and boons, multiplied by the sky. For offensive Cloths the multiplier is paid in dice; for defensive/control Cloths it's paid in *scope* (bigger auras, more removal, longer range) — which is why their flat DPR line is correct, not broken.

### 1.3 The rank spine (automatic level escalation)

Focus spells auto-heighten at **rank \= ⌈level ÷ 2⌉**. Every damage Technique is written as a base \+ per-rank formula on one of two spines, then the sky multiplier stacks on top:

- **Single-target attack spine (Fire Ray):** base 2d6, **\+2d6 per rank** → `2×rank d6`  
- **Area save spine (Cry of Destruction):** base 1d8, **\+1d8 per rank** → `1×rank d8`

| Level | Rank | Single-target | Area |
| :---- | :---- | :---- | :---- |
| 1 | 1 | 2d6 | 1d8 |
| 5 | 3 | 6d6 | 3d8 |
| 9 | 5 | 10d6 | 5d8 |
| **11** | **6** | **12d6** | **6d8** |
| 15 | 8 | 16d6 | 8d8 |
| 19 | 10 | 20d6 | 10d8 |

You never write a level-specific number into a Cloth. You write its spine and base rank, and ⌈level/2⌉ does the rest — exactly like a slotted spell, without the slots.

**Sky multiplier on a Technique:** normal ×1.00, Ascendant ×1.30 (round to nearest die), Zenith ×2.00. A benchmark 6d8 area at level 11 becomes 8d8 Ascendant / 12d8 Zenith.

### 1.4 Why focus spells, not spell slots

Because slots would cost \~650 BCS points the martial chassis can't spare (a Gold Saint with Wizard HP isn't a Gold Saint); because a spendable nova resource fights the daily-state boon curve (players would hoard slots for the Ascendant day, flattening it); and because "my power is my own inner Cosmo, the sky only wakes it" is thematically a focus fantasy, not a prepared-magic one. The rank spine (§1.3) gives you slot-grade escalation without any of that. Full reasoning lives in the tuning-framework companion doc.

### 1.5 Profile & key ability

Martial. 10 HP, saves at 400, full attack investment, Class DC (the **Cosmo DC**), no spell slots. Key ability **Strength or Dexterity** (choose at 1st); the Cosmo DC uses it. Unarmed-only (Libra excepted) — design-guide-legal (line 631\) and it saves the 20 points that funded the Cloth.

---

## 2 — The point ledger (2100 exactly)

### Chassis — 1280

| Line | Value | Pts |
| :---- | :---- | :---- |
| HP | 10 | 100 |
| Class feat @1 | — | 10 |
| Cosmo DC | T@1 / E@9 / M@17 | 170 |
| Perception | T@1 / E@7 | 60 |
| Fortitude | T@1 / E@1 / M@9 | 170 |
| Reflex | T@1 / E@1 / M@15 | 170 |
| Will | T@1 / E@3 | 60 |
| Attack (unarmed) | T@1 / E@5 / M@13 | 170 |
| — Critical Specialization @5 · Weapon Spec @7 · Greater @15 |  | 50 \+ 70 \+ 150 |
| Defense | Unarmored/Light/Medium T@1, Expert@13 | 80 |
| Skills | 3 initial \+ 1 granted (Athletics) | 20 |
| **Subtotal** |  | **1280** |

### Features — 820

| Lvl | Feature | Pts |
| :---- | :---- | :---- |
| 1 | The Cloth (subclass) | 50 |
| 1 | Cosmo (focus pool \+ Signature Technique) | 10 |
| 1 | Ascendant Constellation | 110 |
| 1 | Cosmo Strike (Strikes are magical, \+1 per weapon die) | 30 |
| 1 | Unfailing Cosmo *(re-priced 30→10)* | 10 |
| 1 | Shelter of the Cloth *(re-priced 50→20)* | 20 |
| 3 | Technique gained | 10 |
| 5 | Technique gained | 10 |
| 5 | Second granted skill / Sky-reading utility | 20 |
| 7 | Sixth Sense | 50 |
| 7 | Second Cosmo (2nd Focus Point) | 30 |
| 9 | Technique gained | 10 |
| 11 | Cloth Ability (subclass) | 110 |
| 13 | Technique gained | 10 |
| 15 | Seventh Sense | 110 |
| 15 | Third Cosmo (3rd Focus Point) | 30 |
| 17 | Technique gained | 10 |
| 19 | Eighth Sense (Arayashiki) | 190 |
| **Subtotal** |  | **820** |

### **TOTAL 1280 \+ 820 \= 2100** ✅

*Re-pricing note:* the benchmarking found Unfailing Cosmo (immunity to a −1/−2 on \<5% of days) was worth \~10 not 30, and Shelter \~20 not 50\. The freed 50 bought **Cosmo Strike** (30, the unarmed-only class's Handwraps fix, now built in) and a **second granted skill/utility** (20). Net zero; the class is strictly better-defined.

---

## 3 — Advancement table

| Lvl | Features |
| :---- | :---- |
| 1 | Ancestry & background, initial proficiencies, **The Cloth**, **Cosmo**, **Ascendant Constellation**, **Cosmo Strike**, **Unfailing Cosmo**, **Shelter of the Cloth**, Saint feat |
| 2 | Saint feat, skill feat |
| 3 | **Iron Will** (Will E), Technique, general feat, skill increase |
| 4 | Saint feat, skill feat |
| 5 | Ability boosts, ancestry feat, **Cosmo Strike** (Unarmed E \+ crit spec), Technique, skill increase |
| 6 | Saint feat, skill feat |
| 7 | **Sixth Sense**, **Second Cosmo**, **Alertness** (Perc E), **Weapon Specialization**, skill increase |
| 8 | Saint feat, skill feat |
| 9 | **Cosmo Expertise** (Cosmo DC E), **Juggernaut** (Fort M), Technique, ancestry feat, skill increase |
| 10 | Ability boosts, Saint feat, skill feat |
| 11 | **Cloth Ability**, general feat, skill increase |
| 12 | Saint feat, skill feat |
| 13 | **Cloth Mastery** (Unarmed M), **Armor Expertise** (Cloth E), Technique, ancestry feat, skill increase |
| 14 | Saint feat, skill feat |
| 15 | Ability boosts, **Seventh Sense**, **Third Cosmo**, **Greater Weapon Specialization**, **Evasion** (Refl M), general feat, skill increase |
| 16 | Saint feat, skill feat |
| 17 | **Cosmo Mastery** (Cosmo DC M), Technique, ancestry feat, skill increase |
| 18 | Saint feat, skill feat |
| 19 | **Eighth Sense (Arayashiki)**, general feat, skill increase |
| 20 | Ability boosts, Saint feat, skill feat |

**Initial proficiencies:** Perception Trained · Fort & Reflex Expert, Will Trained · Athletics \+ 3 others Trained · Unarmed Trained (no weapons) · Unarmored/Light/Medium armor Trained · Cosmo DC Trained (key ability). **HP:** 10 \+ Con per level. **Fist:** 1d6 brawling, agile finesse (via Cosmo Strike: magical, \+1 per die).

---

## 4 — Core features

### The Cloth (L1)

Bonded to one Gold Cloth (§6). Medium armor (+4 AC, Dex cap \+1, check −2, Str 16), but: summon/dismiss as one Interact action; cannot be removed without being destroyed; takes armor runes; free at level 1\. If you drop to 0 HP the Cloth cracks (self-repairs in 24 h, or instantly via an Aries Saint). Determines your Signature Technique, Cloth Passive, L11 Cloth Ability, and the one sign you can feel.

### Cosmo (L1)

Focus pool of 1 (2 at 7, 3 at 15). Techniques are focus spells with the **cosmo** trait, using your Cosmo DC and key ability; rank \= ⌈level/2⌉. Refocus by burning Cosmo for 10 minutes.

### Cosmo Strike (L1)

Your unarmed Strikes are **magical** and gain **\+1 damage per weapon damage die** (this is the built-in Handwraps fix for an unarmed-only class — do not also require Handwraps). At L5 you gain unarmed Expert and the brawling critical specialization.

### Ascendant Constellation (L1) — the reason the class exists

You always know when your own sign is ascendant and its aspect; you know nothing of the other twelve. When the day's sign is your Cloth's:

- **Ascendant (any aspect):** your **Ascendant Boon** for the whole day (×1.30 tier).  
- **Exalted:** your **Zenith Boon** instead (×2.00 tier), whole day.

The sky's *position* wakes the Cloth; its *energy* only decides Ascendant vs Zenith. A Saint stands untouched in a Malefic sky while everyone around them suffers — that's the image, and Unfailing Cosmo guarantees it.

> **Odds:** Ascendant 1/13 (7.69%); Zenith 1/260 (0.385%). **The GM schedules Zeniths** — write "Leo, Exalted" on the card before the arc climax. Seventh Sense (L15) lets the Saint force one on a day their sign is up. A Stargazer with Constellation Mastery can reroll the aspect hunting for the 5%.

### Unfailing Cosmo (L1)

You never suffer the sky's Retrograde or Malefic aspects or their riders. Ever. You still gain Ascendant/Exalted benefits.

### Shelter of the Cloth (L1)

Allies within 30 ft treat the day's aspect as one step milder (Malefic→Retrograde, Retrograde→none). Passive. Stacks with a Stargazer's Forewarned → a party with both is immune to the sky.

### Sixth Sense (L7)

Imprecise sense, 60 ft, detects everything with a Cosmo/life force. Never off-guard to undetected/hidden creatures; can't be flanked by anything you sense.

### Seventh Sense (L15)

**Burn Your Cosmo** ✦ (free, 1/day, requires your sign ascendant today): treat today as **Exalted** — your Zenith Boon activates for 1 minute (or, if already Exalted, extends it to allies within 30 ft for 1 minute). **Passive:** unarmed Strikes ignore resistances and bypass all material weaknesses/immunities; strike incorporeal creatures normally; auto-know the location of anything that damaged you in the last minute.

### Eighth Sense — Arayashiki (L19, 190 pts)

✦ (free, 1/day). **Trigger:** reduced to 0 HP or killed. **Effect:** you keep acting for 1 minute or until the encounter ends; can't drop below 1 HP; immune to death, dying, unconscious, paralyzed; ignore wounded/drained. When it ends you're dying 3 and the Cloth shatters (1 week / instant Aries repair). If the trigger killed you, you die when the minute ends, beyond all but *wish*\-tier return. You may end it early to be merely dying 1 with an intact Cloth.

---

## 5 — How to read a Cloth entry

Each Cloth lists: **Signature Technique** (spine \+ base rank → auto-heightens), **Cloth Passive** (always-on), **Ascendant Boon** (×1.30), **Zenith Boon** (×2.00), and **L11 Cloth Ability** (a Technique gated to focus rank 6). Damage shown is at **level 11 (rank 6\)** for reference; the spine gives every other level. All "remove from the fight" effects carry **incapacitation** (against a creature above level 12 at L11, its save is one degree better — the same gate Paizo puts on *Massacre* and *Flesh to Stone*).

Every Cloth's boon is tagged **\[OFFENSE\]**, **\[DEFENSE\]**, **\[CONTROL\]**, or **\[UTILITY\]** so players know whether to expect a damage spike or a different kind of power. Only OFFENSE Cloths move the DPR needle — by design.

---

## 6 — The Twelve Gold Cloths

### ♈ Aries — the Wall · *\[DEFENSE\]*

- **Signature — *Crystal Wall*** ✦✦ (cosmo). Create a 15-ft-long, 10-ft-high barrier: AC 10, Hardness \= level, HP \= 4×level; blocks line of effect. *(Benchmarked to Blade Barrier, rank 4 — HP scales with level, no reflection at base.)*  
- **Passive — Cloth Mending.** Trained in Crafting; Repair any Cloth/armor/shield in 10 min, no check, restoring 10×level HP; a Cloth you repair is fully restored regardless of how it broke.  
- **Ascendant Boon \[DEFENSE\]** — *Starlight Extinction.* \+2 status to AC and **all saves**. Reaction (1/round): when a creature within 60 ft makes a ranged/spell attack or targets an ally with a spell, **send the effect nowhere** (expended, no result). *(The reflect/negate reaction — benchmarked above Deflect Arrow — lives here, where 7.7% uptime pays for it.)*  
- **Zenith Boon \[DEFENSE\]** — as Ascendant, plus the reaction has **no frequency limit**, and once/minute you may target a *creature* with it (60 ft, Fort vs Cosmo DC, crit-fail teleports it 1 mile; **incapacitation**).  
- **L11 — *Stardust Revolution*** ✦✦✦. Area save spine, 3-action: **8d8 force** (r6), 30-ft burst, basic Reflex; crit-fail stunned 1\. Ascendant 10d8 / Zenith 16d8.

### ♉ Taurus — the Horn · *\[OFFENSE, minor\]*

- **Signature — *Great Horn*** ✦✦. Area save spine: **6d8 bludg** (r6), 30-ft cone, basic Fort; fail \= pushed 15 ft \+ prone. Ascendant 8d8 / Zenith 12d8.  
- **Passive — Bulwark.** Can't be moved by anything your size or smaller; \+2 circ to Athletics and to your DC vs Shove/Trip/Grapple/Disarm.  
- **Ascendant Boon \[OFFENSE\]** — *The Great Horn.* Unarmed Strikes gain **\+1 damage die** and force a Fort save (fail \= pushed 10 ft \+ prone); you count as one size larger when beneficial.  
- **Zenith Boon \[OFFENSE\]** — as Ascendant, **\+2 damage dice** total, temp HP \= level at the start of each turn, and *Great Horn* costs no Focus Point once/round.  
- **L11 — Titan's Stance** ⤾ (reaction). An adjacent ally would be hit → you become the target and take the damage reduced by 10 \+ level x 2\.

### ♊ Gemini — the Other Dimension · *\[CONTROL\]*

- **Signature — *Another Dimension*** ✦✦ (incapacitation, teleportation). 60 ft, 1 creature, Will. Fail \= banished 1 min (returns to same square); crit-fail 10 min. *(= Banishment, rank 5; available when focus rank ≥5 \= level 9.)*  
- **Passive — Two Faces.** Trained in Deception; swap Light/Shadow as a free action 1/hour. In Shadow your Signature becomes *Genrō Maō Ken* (below, downgraded to 1-target confuse). Two full identities, un-linkable short of *true seeing*.  
- **Ascendant Boon \[OFFENSE\]** — *Galaxian Explosion.* Cast your Signature without a Focus Point 1/round; gain **Galaxian Explosion** ✦✦✦: area spine **10d6 force** burst (r6), 60-ft burst within 120 ft, basic Reflex, area becomes difficult terrain 1 min. Ascendant 13d6 / Zenith 20d6.  
- **Zenith Boon \[OFFENSE\]** — as Ascendant, plus a **duplicate** of you appears each turn in an adjacent square: your statistics, acts on your initiative with **2 actions, Strike and Stride only** (no Techniques, Focus Points, or skill actions), one at a time, vanishes at your next turn. *(Deliberately not a second full character — the fix from benchmarking.)*  
- **L11 — *Genrō Maō Ken*** ✦✦✦ (mental, incapacitation). 60 ft, 1 creature, Will. Fail \= dominated 1 min; crit-fail 10 min with no damage-break save. *(= Dominate, rank 6 — legal at exactly L11.)*

### ♋ Cancer — the Yellow Spring · *\[OFFENSE \+ removal\]*

- **Signature — *Sekishiki Meikaiha*** ✦✦ (void). Single-target save (8d6 spine at r6, one step under the attack spine because saves are reliable): **8d6 void**, basic Will; fail also drained 1, crit-fail drained 2 \+ slowed 1\. Ascendant 10d6 / Zenith 16d6.  
- **Passive — The Boundary.** See/speak with spirits and the recently dead; auto-know the HP category of every creature within 30 ft; trained in Medicine.  
- **Ascendant Boon \[OFFENSE\]** — *The Yellow Spring Opens.* Any creature you reduce to 0 HP dies (no save). Once/round (free action) a creature within 30 ft at ≤half HP must save (Fort) or take **8d6 void** and be slowed 1\. You always know the direction to the nearest planar boundary.  
- **Zenith Boon \[removal\]** — *The Yellow Spring is Here.* **Once per Zenith day**, 30-ft emanation: every enemy at ≤half HP must save (Fort vs Cosmo DC) or **die** (**incapacitation**). *(Re-scoped from "every round, 60 ft, no cap" — that beat rank-9 Massacre. Now a once-a-day rank-9-equivalent nova.)*  
- **L11 — *Meikai Ha*** ✦✦✦ (teleportation). You \+ one creature failing a Will save go to the underworld's edge 1 min; nothing follows; if it's dead when the duration ends, only you return.

### ♌ Leo — the Lightning · *\[OFFENSE, the striker\]*

- **Signature — *Lightning Bolt*** ✦✦ (electricity). Area spine, d12 variant: **5d12** (r6) 60-ft line, basic Reflex. Ascendant \~7d12 / Zenith 10d12.  
- **Passive — Pride of the Lion.** Immune to frightened and fear; trained in Intimidation, \+1 circ to Demoralize.  
- **Ascendant Boon \[OFFENSE\]** — *Lightning Plasma.* Fists gain **agile** and **\+1d6 electricity**, and you gain a **Haste-style extra action** each turn (Strike or Stride only). *(Benchmarked to Haste, rank 3 — legal.)*  
- **Zenith Boon \[OFFENSE\]** — as Ascendant, **\+3d6 electricity**, and you are **quickened 1** (Strike/Stride) *in addition* to the Haste action — two extra actions on a Zenith day.  
- **L11 — *Lightning Plasma*** ✦✦✦. Make **3 unarmed Strikes** against creatures within 30 ft at **no MAP increase**; counts as 3 attacks for MAP afterward. *(Cut from 5 Strikes — the v1 version was a Fighter capstone at \+53% over a Monk before any boon.)*

### ♍ Virgo — Nearest to God · *\[CONTROL\]*

- **Signature — *Tenbu Hōrin*** ✦✦ (mental). 30 ft, 1 creature, Will; fail \= lose one sense 1 min (blinded/deafened/etc.), crit-fail two. *(= Blindness-tier, rank 3–4.)*  
- **Passive — Stillness.** Refocus in 1 min; \+1 status to Will; \+1 status to AC while you haven't moved since your last turn.  
- **Ascendant Boon \[CONTROL\]** — *Six Paths of Transmigration.* Each unarmed hit forces a Will save or the target **loses a sense**, cumulatively (blind → deaf → smell/taste → touch: −4 attacks, can't Grapple). Removed only by *restoration* or a full rest.  
- **Zenith Boon \[CONTROL\]** — *Rikudō Rinne.* Once/minute ✦✦✦, 60-ft emanation, Will save (**incapacitation**) or lose **all five senses** 1 min; crit-fail until *restoration*. A senseless creature is blinded, deafened, off-guard, −4 everything.  
- **L11 — *Tenbu Hōrin*** ✦✦✦ (mental). 30-ft emanation, sustained 1 min; each turn's end every enemy saves or loses a sense.

### ♎ Libra — the Weapons · *\[OFFENSE \+ DEFENSE\]*

- **Signature — *Rozan Rising Dragon*** ✦✦. Area spine, d10 cylinder: **6d10** (r6), 10-ft-radius/30-ft-tall cylinder on you, basic Reflex; crit-fail launched 30 ft up. Ascendant 8d10 / Zenith 12d10.  
- **Passive — The Cloth of Arms.** *The only Cloth with weapons.* **Trained in martial weapons** (rides your unarmed progression free, per BCS rule 516). Six weapon pairs (swords, tridents, nunchaku, shields, sanjiegun, tonfa), summoned/dismissed as a free action, never disarmed/destroyed, take runes.  
- **Ascendant Boon \[OFFENSE/DEFENSE\]** — *The Balance.* Wield any two Libra weapons regardless of hands; your Libra weapons count as **\+1 fundamental rune tier** (max game cap); \+2 status to all saves; benefit from Libra's own sky-domain (first natural 1/hour counts as 10).  
- **Zenith Boon \[OFFENSE/DEFENSE\]** — as Ascendant, plus ***Rozan Hyaku Ryū Ha*** once/round ✦✦✦: **12d10** 60-ft line, basic Reflex, crit-fail prone \+ stunned 2\.  
- **L11 — The Twelve Arms** ✦✦. Hand Libra weapons to allies within 30 ft; for 1 min each uses **your** weapon proficiency and your runes.

### ♏ Scorpio — the Needle · *\[OFFENSE, ramp\]*

- **Signature — *Scarlet Needle*** ✦ (1 action). 30 ft, Fort; fail \= 1 needle \+ persistent bleed (starts at 1d6, scales with the ramp). *(1-action persistent applier — fair because it compounds.)*  
- **Passive — Fifteen Needles.** Track needles per creature (reset on rest/encounter end). On an unarmed hit, free action to add a needle (max 15). 5 \= enfeebled 1; 10 \= blinded; 14 \= stunned 2 \+ Strikes lose runes.  
- **Ascendant Boon \[OFFENSE\]** — *Antares.* Needles land on **any attack, hit *or* miss** (this fixes the boss problem — you no longer need to connect). Each needle \= **1d6 persistent bleed**, stacking, **capped at 10 needles** of bleed. At **8 needles** the target must save (Fort, **incapacitation**) or **die**. *(Antares dropped from 15→8; the death trigger is now incap-gated like Finger of Death.)*  
- **Zenith Boon \[OFFENSE\]** — as Ascendant, Antares triggers at **5 needles**, and needles apply on your allies' hits too (you orchestrate the swarm).  
- **L11 — *Antares*** ✦✦ (incapacitation). 30 ft, target with ≥5 needles, Fort; fail \= 12d6 \+ paralyzed 1 round, crit-fail dies. *(= Finger of Death tier, rank 7, gated.)*

### ♐ Sagittarius — the Arrow · *\[OFFENSE \+ UTILITY\]*

- **Signature — *Golden Arrow*** ✦✦. Single-target attack spine: **12d6 force** (r6), **spell attack \+20** (no runes — stated), **500-ft range increment**, ignores cover/concealment. Ascendant 16d6 / Zenith 24d6. *(Raised from 3d10 to the Fire Ray benchmark; the range is the price, not lost damage.)*  
- **Passive — The Bow.** A bow using your unarmed proficiency, never disarmed/destroyed; \+2 circ to Perception past 100 ft; Speed \+10 ft.  
- **Ascendant Boon \[UTILITY\]** — *Atomic Thunderbolt.* Gain a **fly Speed** \= Speed; Golden Arrow's increment becomes **1 mile**, ignores all cover/concealment and hidden/undetected, and can hit any creature whose location you can name (no line of sight); its damage rises one step on the spine.  
- **Zenith Boon \[UTILITY\]** — as Ascendant, plus once/minute Golden Arrow reaches **any named creature within a mile through any barrier short of a planar boundary** and deals **\+8 dice**.  
- **L11 — Aiolos's Wings.** Permanent fly Speed \= Speed; extend to a touched ally 10 min, 1/hour.

### ♑ Capricorn — Excalibur · *\[OFFENSE, conditional\]*

- **Signature — *Excalibur*** ✦ (1 action, self-buff). Until end of turn your unarmed Strikes deal **slashing**, gain **deadly d10**, and **ignore Hardness**. *(1-action buff — fair, cheap.)*  
- **Passive — The Sword Arm.** Unarmed Strikes gain **versatile S** and **deadly d8**; trained in Athletics.  
- **Ascendant Boon \[OFFENSE, conditional\]** — *Excalibur Cuts Everything.* Unarmed Strikes **ignore all resistances, physical immunities, and Hardness**, and gain **\+1 damage die** (so the boon is never a total no-op vs a resistance-less target — the fix from benchmarking). Crit-hit may **sever** a limb/sense/natural attack (until *regenerate*). May Strike incorporeal creatures and force effects; a crit destroys a force effect.  
    
  > **GM note, print this:** Capricorn is a *key, not a hammer* — its value swings from \+0% (no-resistance boss) to \+170% (resist-10). On the day Capricorn rises, ask your GM what's behind the wall.  
    
- **Zenith Boon \[OFFENSE, conditional\]** — as Ascendant, plus ⤾ (reaction, once/turn/creature): a creature attacks you or a spell enters your space → you **sever it** (no effect).  
- **L11 — Jumping Stone.** Crit-hits sever even outside the boon; gain the sword-group critical specialization.

### ♒ Aquarius — Absolute Zero · *\[OFFENSE \+ removal\]*

- **Signature — *Diamond Dust*** ✦✦ (cold). Area spine: **6d8 cold** (r6), 30-ft cone, basic Fort; fail \= slowed 1\. Ascendant 8d8 / Zenith 12d8. *(Raised from 4d6.)*  
- **Passive — Cold Blood.** Cold resistance \= level; immune to severe cold; \+1 status to Will vs emotion; trained in Occultism or Arcana.  
- **Ascendant Boon \[OFFENSE/removal\]** — *Freezing Coffin.* Cold damage from you forces a Fort save or **slowed 1**, cumulative to slowed 4 \= **petrified in ice** (shatterable: any crit destroys it). Your cold ignores cold resistance, treats cold immunity as resistance 10\. *(The slowed→petrified track \= Flesh to Stone, rank 6 — legal at L11.)*  
- **Zenith Boon \[removal\]** — *Aurora Execution.* Once/minute ✦✦✦, 60-ft line, **16d6 cold** (area spine ×2), basic Fort; crit-fail **frozen solid** (petrified, shatterable), **incapacitation**.  
- **L11 — *Freezing Coffin*** ✦✦✦ (cold, incapacitation). 30 ft, Fort; crit-fail \= indefinite petrify (ends via *dispel* rank 8, shattering the ice at Hardness 20/HP 80, or your choice).

### ♓ Pisces — the Roses · *\[OFFENSE, aura\]*

- **Signature — *Piranha Rose*** ✦ (1 action). 30 ft, up to 3 creatures: **2d8 \+ 1d6 persistent bleed** each (basic Reflex negates persistent), scaling on the area spine. Ascendant/Zenith raise the dice per the multiplier.  
- **Passive — Royal Demon Rose.** Immune to poison; any creature that touches you or hits you in melee takes 1d6 poison.  
- **Ascendant Boon \[OFFENSE\]** — *The Royal Demon Rose Garden.* **10-ft emanation** (matched to Incendiary Aura, down from 30 ft): each turn's end, enemies in it save (Fort) or take **4d6 poison** \+ enfeebled 1 (cumulative to 4), **cap 4 creatures**; requires you to have acted hostilely that turn. Persists while you're unconscious. *(The 30-ft version was 9× a real aura's footprint and drove the \+106% playtest result.)*  
- **Zenith Boon \[OFFENSE\]** — as Ascendant, **15-ft emanation, 8d6 poison/turn**, plus ***Bloody Rose*** once/minute ✦✦ (**incapacitation**, death): 60 ft, 1 creature, Fort; fail 10d6 \+ enfeebled 2, crit-fail **dies**.  
- **L11 — Crimson Thorn Garden** ✦✦✦. 30-ft burst within 60 ft becomes rose garden 10 min: difficult terrain \+ 4d6 persistent poison to any creature ending its turn there; you and allies ignore the terrain.

---

## 7 — The curve, verified

At level 11, offensive-Cloth medians against the benchmark (Monk with focus \= 10.3 DPR boss / 31.2 mob):

|  | Target | Framework delivers |
| :---- | :---- | :---- |
| **Normal day** (1d6 fist floor) | −15% | \~−15% ✅ |
| **Ascendant** (×1.30 Techniques) | \+30% | \~+30% ✅ |
| **Zenith** (×2.00 Techniques) | \+100% | \~+100% ✅ |

Defensive/control/utility Cloths (Aries, Virgo, Libra\*, Sagittarius, Capricorn†, Aquarius, Cancer‡) sit at the −15% floor on DPR and pay their ×1.30/×2.00 in scope. That's intended — they win fights by removal, defense, or utility, not by the damage meter. \*Libra's DPR does rise \~15% on its day via the rune-tier bump (it uses weapons). †Capricorn's swings 0–170% by target. ‡Cancer is offense on a normal Ascendant, removal on Zenith.

---

## 8 — Saint feats (starting list)

Feats are unpriced in BCS; be generous. **L1:** Cosmo Sense · Pandora Box \[Needs development\]  · Saint's Vow \[Needs development\] · Fists of the Constellation (Signature → force) \[Needs development\]. **L2:** Heated up Cosmo (once per day, Refocus as a single action) · Cloth Bond (Cloth runes also apply to a chosen Technique). **L4:**  Rise (0 HP → 1 HP once/day). **L6:** Speed of Sound (Speed \+10ft when your sign is ascendant) · Prophecy's Weight (Demoralize via Astronomy Lore, 60 ft) \[Needs development\] **L8:** Twin Cosmo (a Technique as a reaction 1/day) · Read the Constellation (learn if your *sign* will come up in the next 3 days, 1/week). **L10:** Golden Cosmo (boon fires at half effect on days your *adjacent* sign rises). **L12:** Second Ascension (3/week, treat any day as your sign ascendant for 1 min) · Cosmo Legend (Techniques use level, not half). **L14:** Speed of Light (quickened 1 for 1 min, 1/day). **L16:** Zenith Reach (Seventh Sense twice/day) · Constellation of One \[Needs development\]. **L18:** The Thirteenth (on a Starless Sky your sign is treated ascendant) · Two Skies \[Needs development\]. **L20:** Athena Exclamation (three Saints, 3-action, 100 ft, 60-ft burst, 30d6, basic Reflex, permanent crater — a war crime in the Sanctuary) · Beyond the Eighth\[Needs development\]

---

## 9 — Playtest & GM notes

- **The −15% floor is a feature.** Set it at session zero: *"You're a Gold Saint every day; the sky tells the world which day is yours."* A player expecting Aiolia every session wants a Fighter, not a Saint.  
- **Schedule Zeniths.** 1-in-260 means they never happen by chance. The GM writes "your sign, Exalted" before the arc climax. That scene is the whole class.  
- **Incapacitation is load-bearing** — never drop it from Cancer/Scorpio/Virgo-all-senses/Aquarius/Pisces death effects, or they cheese bosses.  
- **Cosmo Strike replaces Handwraps.** Don't double-tax an unarmed class.  
- **Capricorn needs the GM to seed resistant enemies** on its day or the boon is a shrug. Tell the player this is by design (it's a key).  
- **The Magus still solo-clears the mob encounter** (785 dmg / 780 HP). Your homebrew's job is to beat a Monk, not a Magus.  
- **Two Saints, same Cloth** shouldn't happen — one Gold Cloth per sign; the second is a rival, a campaign.

---

## Appendix — the spine, in one block

focus rank \= ceil(level / 2\)

Single-target attack Technique:   2 × rank  d6   (Fire Ray spine)

Area basic-save Technique:        1 × rank  d8   (Cry of Destruction spine)

d10/d12 variants trade die count 1:1 down a step (a "6d8 area" may be printed 5d12 line / 6d10 cylinder)

Sky multiplier (Techniques & boon dice):  normal ×1.00  ·  Ascendant ×1.30  ·  Zenith ×2.00

Normal-day floor (chassis Strikes):       fist 1d6, \+1/die via Cosmo Strike, no flurry  →  \~−15% vs Monk

Removal/death boons carry INCAPACITATION (target level \> 2×rank → save one degree better)

BCS TOTAL: chassis 1280 \+ features 820 \= 2100  

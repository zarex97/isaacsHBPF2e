# The Breath Slayer — PF2e Class Guide, **Version 4.2**

### *Kimetsu no Yaiba · 鬼滅の刃 · Demon Slayer Corps edition*

*The complete, self-contained class. Chassis, ledger, advancement table, every core feature, all
**eleven** Breathing Styles with their full Form ladders, and the complete feat compendium — no
cross-referencing. Companion to **The Saint** (Gold Cloth guide v4) and costed on the same
**2100-point** budget.*

**Sources folded in:** `breath-slayer-class-feats-v4.md` (v4.1) · `breathing-forms-compendium-v4.md`
(v4.2) · `breath-slayer-balance-analysis.md` · `breath-slayer-v4-changelog.md`. Where those documents
left a feature *named but never written* — **Demon Slayer Mark** and **Transparent World Glimpse** —
this guide writes it, and says so.

**Changes in v4.2:** Water's Final Form **Dead Calm** is rebuilt as a pool of five **Stillness
counters** spendable either as damage reduction that spills onto the attacker or as MAP-free
ripostes, at 2 actions instead of 1. Moon's style rider **Erratic Crescents** is replaced by
**Borrowed Light**, which pays out to allies rather than to its holder. Nothing else changed, and the
2100-point ledger is untouched — both are inside the 50-point subclass line or the feat-20 slot.

---

## 1 — Design foundations

### 1.1 The pitch

A Breath Slayer is a human being with a sword. No spells, no bloodline, no god. What they have is a
breathing form drilled until the lungs oxygenate muscle past what a body should survive, and a blade
forged from ore that sat in sunlight for a year. Eleven styles descend from the same root; each is a
different answer to the same question, which is *how do you kill something that heals faster than you
can cut it.*

Mechanically: a full martial Strike routine, a **3-point focus pool** that buys three named
techniques an encounter, and an unconditional precision rider so that a slayer with an empty pool is
still a slayer.

### 1.2 Profile & key ability

Martial. **10 HP**, full attack investment, class DC (**Slayer DC**), no spell slots. Key ability
**Strength or Dexterity**. Weapon-based, not unarmed — a Breath Slayer buys potency and striking runes
for their nichirin blade exactly as any other martial does.

### 1.3 Forms, Breath Points, and heightening

**Forms** are focus spells with the **slayer** trait. They use your **Slayer DC** and key ability, have
**no rank**, and are **automatically heightened to half your level rounded up**, exactly like every
other focus spell in the game.

**Every Form costs 1 Breath Point.** There is no 2-point or 3-point focus spell anywhere in PF2e and
`Refocus` restores exactly 1 point per 10 minutes, so v3's 2-FP Fourth Forms and 3-FP Final Forms were
once-per-adventuring-day abilities wearing a per-encounter costume. The throttles are elsewhere:

| Throttle | Applies to |
| :---- | :---- |
| The 3-point pool itself | Every Form — **3 Forms per encounter, maximum** |
| **Frequency: once per 10 minutes** | Final/Forbidden Forms only |
| **Self-cost** (a real, lasting condition) | Final/Forbidden Forms only |
| **Requirement** clauses | Individual Forms that punch above their tier |

**Base rank by tier:** First Form = 1 · Second Form = 2 · Third Form = 4 · Fourth Form = 6 ·
Final Form = 10. A Form acquired above its base rank is simply already heightened.

### 1.4 The design curve

All values at rank 10 / level 20, all costing 1 Breath Point.

| Form shape | Actions | Rank-10 target | Standard ladder | Anchor |
| :---- | :---- | :---- | :---- | :---- |
| Single Strike + rider | 1 | **+5d6** (17.5) + status bonus | `1d6` @ r1, **H(+2) +1d6** | `Inner Upheaval` +3d6 — ours is higher because it never doubles on Flurry |
| Strike + movement/debuff | 2 | **+7d6** (24.5) | `3d6` @ r2, **H(+2) +1d6** | `Pulverizing Wake`'s Strike component (+3d8) |
| Two Strikes, one target | 2 | **+5d6 each** (35.0) | `1d6` @ r2, **H(+2) +1d6** | two full Strikes already carry most of the value |
| 15-ft cone, **1 action** | 1 | **11d6** (38.5) | `2d6` @ r1, **H(+1) +1d6** | `Qi Blast` at 1 action = 9d6 |
| 15-ft cone / 10-ft emanation | 2 | **13d6** (45.5) | `5d6` @ r2 *or* `9d6` @ r6, **H(+1) +1d6** | `Pulverizing Wake` cone = 11d8 (49.5) |
| 30-ft line / 15-ft burst | 2 | **11d6** (38.5) | `5d6` @ r4, **H(+1) +1d6** | area-for-damage trade |
| Reaction (defensive) | R | resistance formula + **5d6** (17.5) | `2d6` @ r4, **H(+2) +1d6** | `Thermal Nimbus` = resistance equal to level |
| **Fourth Form** (feat 12) | 2 | **13d6** area (45.5) **plus a hard condition** | `9d6` @ r6, **H(+1) +1d6** | `Pulverizing Wake` — a *ranger level-9* focus spell |
| **Final Form** (feat 20) | 1–3 | **13d6+ area**, or **4 Strikes**, or a **1-minute omnibuff** | flat @ r10 | `All Shall End in Flames` · `Impossible Flurry` · `Sever Four Dragonfly Wings` |

**Monotonicity holds in all eleven styles at rank 10:** First ≤ Second ≤ Third ≤ Fourth < Final. The
audit is §6. As written, v3 satisfied that inequality in *zero* of its nine styles.

### 1.5 Balance is not only damage

Where v3 reached for a bigger die, v4 reaches for one of these instead. Each has a live system anchor:

| Lever | Anchor in the packs |
| :---- | :---- |
| Condition on a **failed basic save** | `Tempest Surge` (clumsy 2, at rank **1**), `Blazing Wave` (prone on crit fail) |
| **Immobilized / grabbed** until Escape vs. your class DC | `Hell of 1,000,000 Needles` (kineticist 18) |
| **Off-guard** generation feeding your own precision rider | `Stumbling Stance` (monk 1), rogue `Debilitating Strike` |
| **Slowed / stunned** carrying the incapacitation trait | `Glacial Heart` (witch), `Medusa's Wrath` (monk) |
| **Requirement** gates instead of a bigger cost | `Upper Smash`'s size clause, `Vicious Swing`'s two-hand clause |
| **Free-action** riders (Step, Hide, Stride) | `Qi Center` (monk 18), rogue `Nimble Roll` |
| **MAP-neutral** extra attacks | `Sever Four Dragonfly Wings` (exemplar, free, at-will) |
| **Resistance = level** | `Thermal Nimbus` (kineticist **4**) |
| **Reaction denial** and Speed penalties | `Wave of Despair`, `Clinging Ice` |
| **Persistent damage that resists the flat check** | `Bloody Debilitation`-tier riders, escalated at capstone |

### 1.6 The floor

`Concentrated Breathing` is the reason this class works. A Breath Slayer with an empty pool is still
adding **+8 / +12 / +16** per Strike at four weapon dice. Without it, a slayer who has spent three
Forms is a fighter with fewer feats. Say this at the table: **the pool is the spike, the rider is the
floor.**

---

## 2 — The point ledger (2100 exactly)

*Costed against **BCS 1.4** (`Docs/homebrewing/BCS 1.4 (current) _ Balanced Core System.xlsx`).
Proficiency values from its `PROFICIENCYVALUES` tab: **Trained 10 · Expert 50 · Master 110 ·
Legendary 190 · HP 10 · initial skill 5 · WeaponCS 50 · WeaponWS 70 · WeaponGWS 150**. Weapon and
armour groups follow the sheet's convention — the **highest** group pays the Expert/Master steps,
every additional group costs a flat 10.*

### Chassis — 1410

| Line | Value | Pts |
| :---- | :---- | :---- |
| HP | 10 | 100 |
| ClassFeatL01 | — | 10 |
| InitialSkills | Acrobatics *or* Athletics + 3 others | 20 |
| SubclassSkills | Breathing Style granted skill | 5 |
| GrantedSkills | Slayer's Vigil (2nd granted skill, L5) | 5 |
| ClassDC (**Slayer DC**) | T@1 / E@9 / M@17 | 170 |
| Perception | T@1 / E@1 / M@7 | 170 |
| FortitudeSave | T@1 / E@1 / M@9 | 170 |
| ReflexSave | T@1 / E@1 / M@7 | 170 |
| WillSave | T@1 / E@3 | 60 |
| Attack — Unarmed | T@1 | 10 |
| Attack — Simple | T@1 | 10 |
| Attack — Martial | T@1 / E@5 / M@13 | 170 |
| WeaponCS@5 / WS@7 / GWS@15 | — | 50 + 70 + 150 |
| Defense — Unarmored | T@1 | 10 |
| Defense — Light | T@1 / E@13 | 60 |
| **Subtotal** | | **1410** |

> **Note on `GrantedSkills`.** Moved out of the feature block and onto the chassis, where BCS puts it
> (the Champion's row reads `InitialSkills 10 · SubclassSkills 5 · GrantedSkills 5`). There is no
> `ArmorAS` line: armour specialization only functions in medium or heavy armour, which this class
> never wears.

### Features — 690

| Lvl | Feature | Pts |
| :---- | :---- | :---- |
| 1 | **Breathing Style** (subclass: stance + style rider) | 50 |
| 1 | **Concentrated Breathing** | 110 |
| 1 | **Focused Breathing** (Breath pool + First Form) | 10 |
| 1 | **Sun-Forged Nichirin** | 10 |
| 5 | **Second Breath** (2nd Breath Point + Second Form) | 40 |
| 9 | **Nichirin Resonance** (3rd Breath Point + spirit/material) | 80 |
| 11 | **Transparent World Glimpse** | 70 |
| 12 | **Total Concentration** | 30 |
| 13 | **Demon Slayer Mark** | 110 |
| 15 | **Breath of Instinct** | 30 |
| 19 | **Constant Total Concentration** | 150 |
| **Subtotal** | | **690** |

### **TOTAL 1410 + 690 = 2100** ✅

**How the feature prices were set.** BCS allows arbitrary values — the Champion's own sheet carries
`Divine Smite 90` and `Exalt 110` — so these are anchored to your Saint ledger and to BCS's Champion
row rather than snapped to the proficiency tiers.

| Feature | Anchor | Pts |
| :---- | :---- | :---- |
| Breathing Style | Saint's `The Cloth` = 50; BCS Champion's `Champion's Reaction` = 50. The compendium already budgets the style rider at 30 (Exemplary Finisher); the stance is the other 20 | 50 |
| Concentrated Breathing | The class's `Sneak Attack`. Unconditional, scaling +2/+3/+4 per die. Well above `Cosmo Strike` (30, +1/die) and `Divine Ally` (30); sits at Saint `Ascendant Constellation` tier | 110 |
| Focused Breathing | Saint: `Cosmo (focus pool + Signature Technique) = 10`; BCS `FocusSpell1 = 10` | 10 |
| Sun-Forged Nichirin | BCS Champion's `ShieldBlockL01` = 10 — the level-1 small-extra slot | 10 |
| Second Breath | Saint: 2nd Technique 10 + `Second Cosmo` (2nd focus point) 30 | 40 |
| Nichirin Resonance | 3rd focus point 30 (Saint `Third Cosmo`) + resistance/material bypass 50 (Saint `Sixth Sense` tier) | 80 |
| Transparent World Glimpse | Above `Sixth Sense` (50): precise rather than imprecise, and it strips circumstance bonuses to AC | 70 |
| Total Concentration | Saint `Cloth Attunement` (30); `Meditative Focus` sits at monk 12, the same level | 30 |
| Demon Slayer Mark | Saint `Exalt` (110) and `Seventh Sense` (110) tier — a once-per-10-minutes, 1-minute power state | 110 |
| Breath of Instinct | `Cloth Attunement`-tier free-cast rider (30); `Qi Center` is monk 18 and this is 15 | 30 |
| Constant Total Concentration | The level-19 capstone. Saint's `Eighth Sense` and Champion's `Hero's Defiance` are both 190; this is deliberately below them — it defies fatigue, not death | 150 |

---

### 2.1 Reconciliation against the values you submitted — **read this**

The chassis you supplied totals **1705**, which leaves **395** for features. What is missing from it
costs **695** — the 690-point feature block above, plus the 5-point `GrantedSkills` line the
submitted chassis does not carry. **The submitted ledger is over budget by exactly 300.**

| Line | Submitted | Pts |
| :---- | :---- | :---- |
| HP 10/level | — | 100 |
| Class feat @1 | — | 10 |
| Initial trained skills ×4 (incl. granted) | — | 20 |
| Subclass granted skill | — | 5 |
| ClassFeatL01-style extras | — | 0 |
| Class DC | T1 → E9 → M17 | 170 |
| Perception | E1 → M7 | 170 |
| Fortitude | E1 → M9 | 170 |
| Reflex | E1 → M7 → **L15** | **360** |
| Will | T1 → E3 | 60 |
| Attacks (unarmed + simple + martial) | T1 each; E5; M13 | 190 |
| Weapon CS@5 + WS@7 + GWS@15 | — | 270 |
| Armor (unarmored + light) | T1 each; E13; **M19** | **180** |
| **Submitted chassis total** | | **1705** |
| Remaining for features | 2100 − 1705 | **395** |
| Cost of the features + the missing `GrantedSkills` line | §2 above | **690 + 5 = 695** |
| **Overrun** | | **−300** |

**Why it overruns: the chassis buys two BCS profiles at once.** Against the sheet's own
`CLASSPROFILES` tab:

| Line | **Martial** (fighter/champion) | **Martial-Skilled** (rogue) | **Submitted** | Taken from |
| :---- | :---- | :---- | :---- | :---- |
| HP | **10** | 8 | **10** | Martial |
| Perception | Expert @11 | Expert @1 / Master @7 / Legendary @13 | Expert @1 / Master @7 | Martial-Skilled |
| Fortitude | Expert @1 / **Master @9** | Expert @9 | Expert @1 / Master @9 | Martial |
| Reflex | Expert @9 | Expert @1 / Master @7 / **Legendary @13** | Expert @1 / Master @7 / **Legendary @15** | Martial-Skilled |
| Will | Expert @3 | Expert @3 | Expert @3 | both |
| Weapon | Expert @5 / Master @13 | Expert @5 / Master @13 | Expert @5 / Master @13 | both |
| Armor | Medium, Expert @13 / Master @19 | Light, Expert @13 / Master @19 | Light, Expert @13 / Master @19 | both |
| Class DC | Expert @9 / Master @17 | Expert @9 / Master @17 | Expert @9 / Master @17 | both |

BCS's own note on Martial-Skilled is that it drops to **8 HP and Expert-only Fortitude** precisely in
order to afford Legendary Perception and Reflex. The submitted chassis takes Martial's HP *and*
Martial's Fortitude *and* Martial-Skilled's Perception and Reflex. Take both halves and you are 300
over — which is exactly what happened.

**The two cuts made in this guide:**

| Line | Submitted | Here | Δ | Reason |
| :---- | :---- | :---- | :---- | :---- |
| **Reflex** | E1 → M7 → **L15** = 360 | E1 → M7 = 170 | **−190** | Legendary in a save is the most expensive single line in BCS — more than the level-19 capstone. Master Reflex at **7th** already runs four levels ahead of the Saint. Bites from 15th. |
| **Armor** | T1, E13, **M19** = 180 | T1, E13 = 70 | **−110** | A slayer wears a school uniform. The class's AC lives in stance riders — Water's *Flowing Form*, Flower's *Honorable Shadow Plum*, Serpent's *Kaburamaru's Reading* — not in proficiency. Bites from 19th. |
| | | | **−300** | exactly the overrun |

These are the cheapest 300 points *in play*: both land at 15th level or later, and neither touches
Perception, Fortitude, HP, weapons, or the class DC. The other clean 300s, if you prefer them:

- **Fortitude Master (110) + Reflex Legendary (190)** — keeps armour Master@19 and gives the pure
  rogue save shape, but −2 Fort from 9th onward is the harshest of the three in actual play.
- **Perception Master (110) + Reflex Legendary (190)** — cheapest on paper, worst at the table: it
  costs initiative on a class whose whole opening move is entering a stance first.
- **Keep the chassis and cut 300 of features** — in practice the level-19 capstone (150),
  `Transparent World Glimpse` (70) and 80 off `Concentrated Breathing`. Not recommended; those are
  the class.

### 2.2 What was missing from the submitted list

1. **No subclass line.** The Saint charges **50** for The Cloth and BCS's Champion charges **50** for
   `Champion's Reaction`. The submitted table priced only the Breathing Style's *granted skill* (5)
   and nothing for the **stance** or the **style rider** — which `breathing-forms-compendium-v4.md` §0.6 already
   budgets at **30 pts**. Added at **50**.
2. **No feature lines at all.** Every chassis feature in `breath-slayer-class-feats-v4.md` §1.1 —
   `Concentrated Breathing`, `Focused Breathing`, `Second Breath`, `Nichirin Resonance`,
   `Total Concentration`, `Breath of Instinct` — was unpriced. That is the 395-vs-695 gap.
3. **Two features named but never written anywhere.** `breath-slayer-v4-changelog.md` §8 flags this: **Demon Slayer
   Mark** and **Transparent World Glimpse (L11)** are referenced as prerequisites and upgrade targets
   by `Awakened Mark` (feat 18), `Transparent World` (feat 14) and Love's *Marked Wildclaw*
   (feat 12), but no text for either existed in the repository. **Both are written in §4 of this
   guide, and both are new.** Read them before you sign off on the ledger.
4. **No level-19 chassis feature.** Every PF2e class has one; BCS's Champion spends **190** there
   (`Hero's Defiance`) and the Saint spends 190 (Eighth Sense). Filled with **Constant Total
   Concentration** (150).
5. **No level for the Demon Slayer Mark.** Love's *Marked Wildclaw* is a **feat-12** Form gated on
   the Mark being active. The Mark is placed at **13** here — the nearest legal chassis slot. If you
   want the Form live the moment it is bought, swap the Mark to **11** and `Transparent World
   Glimpse` to **13**; the ledger is unaffected.
6. **`ClassFeatL01-style extras — 0`.** This is BCS's `ShieldBlockL01` slot — the 10-point "one small
   extra thing at level 1" line the Champion uses for Shield Block. It is **not** 0 here: the class
   spends it on **Sun-Forged Nichirin**.
7. **No `GrantedSkills` line.** BCS separates `InitialSkills` / `SubclassSkills` / `GrantedSkills`.
   You had the first two; the third (5) buys the level-5 second granted skill.
8. **Will stops at Expert @3 and never advances.** That matches both BCS martial profiles and the
   Saint, so it is correct — but it is the class's one real hole, and `Unshakeable Core` (feat 8)
   only patches fear. Flag it to any player planning to fight casters.
9. **No `ArmorAS` line — correctly.** BCS prices Armor Specialization at 50 and the Champion buys it
   at 7th, but it only functions in medium or heavy armour. Omitted on purpose, not by oversight.
10. **Key ability was unstated.** It is **Strength or Dexterity**. Stone and Love recommend Strength;
    Serpent's stance grants finesse, which makes Dexterity fully viable there.

---

## 3 — Advancement table

| Lvl | Features |
| :---- | :---- |
| 1 | Ancestry & background, initial proficiencies, **Breathing Style**, **Concentrated Breathing**, **Focused Breathing** (+First Form, 1 Breath Point), **Sun-Forged Nichirin**, Breath Slayer feat |
| 2 | Breath Slayer feat, skill feat |
| 3 | **Slayer's Resolve** (Will Expert), general feat, skill increase |
| 4 | Breath Slayer feat, skill feat |
| 5 | Ability boosts, ancestry feat, **Blade Expertise** (Attacks Expert + sword crit specialization), **Second Breath** (+Second Form, 2nd Breath Point), **Slayer's Vigil** (second granted skill), skill increase |
| 6 | Breath Slayer feat, skill feat |
| 7 | **Evasion** (Reflex Master), **Slayer's Alertness** (Perception Master), **Weapon Specialization**, skill increase |
| 8 | Breath Slayer feat, skill feat |
| 9 | **Breath Expertise** (Slayer DC Expert), **Juggernaut** (Fortitude Master), **Nichirin Resonance** (3rd Breath Point), ancestry feat, skill increase |
| 10 | Ability boosts, Breath Slayer feat, skill feat |
| 11 | **Transparent World Glimpse**, general feat, skill increase |
| 12 | **Total Concentration**, Breath Slayer feat, skill feat |
| 13 | **Blade Mastery** (Attacks Master), **Uniform Expertise** (Unarmored & Light Expert), **Demon Slayer Mark**, ancestry feat, skill increase |
| 14 | Breath Slayer feat, skill feat |
| 15 | Ability boosts, **Breath of Instinct**, **Greater Weapon Specialization**, general feat, skill increase |
| 16 | Breath Slayer feat, skill feat |
| 17 | **Breath Mastery** (Slayer DC Master), ancestry feat, skill increase |
| 18 | Breath Slayer feat, skill feat |
| 19 | **Constant Total Concentration**, general feat, skill increase |
| 20 | Ability boosts, Breath Slayer feat, skill feat |

**Initial proficiencies:** Perception **Expert** · Fortitude **Expert**, Reflex **Expert**, Will
Trained · Acrobatics *or* Athletics (your choice) + 3 others Trained, **plus your Breathing Style's
granted skill** · Unarmed, simple and martial weapons Trained · Unarmored and light armour Trained ·
**Slayer DC** Trained.
**HP:** 10 + Con per level. **Key ability:** Strength or Dexterity.
**Nichirin blade:** any martial sword-group weapon (a *katana* by default; a *whip* for Love, a
*kukri* or *shortsword* for Serpent) forged from scarlet crimson ore.

> **Two things to say at session zero.** (1) **Perception is Expert at 1st** — unusual, and it is the
> class's signature; you win initiative and you are the party's eyes. (2) **Will never rises past
> Expert.** A Breath Slayer is a body, not a mind. `Unshakeable Core` (feat 8) covers fear and
> nothing else.

---

## 4 — Core features

### Breathing Style (L1) — *subclass*

Choose one of the eleven Breathing Styles in §5. It gives you, permanently:

- a **granted skill** (you become trained in it);
- a **stance**, a 1-action action with the stance trait that you can enter while wielding a nichirin
  blade;
- a **style rider**, a passive that functions only while you are in that stance;
- the **Form ladder** you will learn from — First and Second Form from the chassis, Third, Fourth and
  Final Form from feats.

A **Breathing Stance** ends when any stance would: you fall unconscious, you enter another stance, or
the encounter ends. Nearly every feature and feat in this class checks *"while you are in a Breathing
Stance,"* so entering one is the first action of most fights until 12th level (`Stance Savant`) or
19th (`Constant Total Concentration`).

### Concentrated Breathing (L1)

*This is the class's floor. Read it before you read anything else.*

While you are in a Breathing Stance and wielding a nichirin blade, your Strikes deal **+2 precision
damage per weapon damage die**. This increases to **+3 at 9th level** and **+4 at 17th level**.

> At four weapon damage dice that is **+8 / +12 / +16** on every Strike, with no resource spent and
> no condition to set up. A Breath Slayer whose pool is empty is still a Breath Slayer.
> *Anchors:* `Sneak Attack` (1d6 → 4d6 at 17, but gated on off-guard), `Rage` (+2 → +18 at 15),
> `Precise Strike` (+2 → +6 at 17, gated on Panache).

### Focused Breathing (L1)

You gain a focus pool of **1 Breath Point** and learn your Breathing Style's **First Form**.

**Breath Points** are Focus Points with a different name. Forms are focus spells with the **slayer**
trait: they cost **1 Breath Point**, use your **Slayer DC** and key ability, have no rank, and are
automatically heightened to half your level rounded up. You **Refocus** by settling your breathing for
10 minutes, which restores 1 Breath Point (all of them from 12th level — see *Total Concentration*).

Your pool grows on the chassis and nowhere else: **1 at 1st, 2 at 5th, 3 at 9th.** No feat in this
class grants Breath Points. Three Forms per encounter is the hard ceiling, however many Forms you know.

### Sun-Forged Nichirin (L1)

You carry a nichirin blade, forged from scarlet crimson iron sand and ore quarried from a mountain
that stands in sunlight all year. It takes your colour the first time you hold it.

- Your nichirin blade is **magical**.
- It cannot be permanently destroyed. If it is broken or lost, a Corps swordsmith reforges or replaces
  it during your next week of downtime, at no cost, with all its runes intact.
- Any weapon a feat or Form calls a "nichirin blade" means this one. If you wield a different weapon,
  Forms and stance riders do not function.

> You buy potency, striking and property runes for it exactly as any other martial does. Unlike the
> Saint, this class is **not** pre-paid for its weapon — do not double up.

### Slayer's Resolve (L3)

Your proficiency rank for Will saves increases to expert.

### Blade Expertise (L5)

Your proficiency ranks for unarmed attacks, simple weapons and martial weapons increase to expert, and
you gain the **critical specialization effect** of your nichirin blade's weapon group.

### Second Breath (L5)

You learn your Breathing Style's **Second Form**, and your focus pool increases to **2 Breath Points**.

### Slayer's Vigil (L5)

You become trained in one additional skill of your choice from Acrobatics, Athletics, Deception,
Diplomacy, Intimidation, Medicine, Stealth and Survival. You also carry Corps standing: at any Demon
Slayer Corps estate, waystation or Butterfly Mansion you can claim lodging, food, ordinary equipment
repair and a night's medical attention without payment or a check.

### Evasion / Slayer's Alertness / Weapon Specialization (L7)

Your proficiency ranks for **Reflex saves** and for **Perception** increase to master. When you roll a
success on a Reflex save, you get a critical success instead. You also gain **Weapon Specialization**:
+2 damage with weapons and unarmed attacks in which you are an expert, +3 if master, +4 if legendary.

### Breath Expertise / Juggernaut (L9)

Your proficiency rank for your **Slayer DC** increases to expert, and your proficiency rank for
**Fortitude saves** increases to master. When you roll a success on a Fortitude save, you get a
critical success instead.

### Nichirin Resonance (L9)

Your focus pool increases to **3 Breath Points** — its permanent maximum. Your breathing has also
worked itself into the steel:

- Your nichirin Strikes and your Forms may deal **spirit** damage instead of their normal damage type,
  chosen each time you Strike or use a Form.
- They **ignore physical resistance up to half your level**.
- Your nichirin blade counts as **cold iron and silver** against all creatures.

> This absorbs the old feat-10 *Crimson Blade* wholesale. Every Form in the book deals slashing, fire,
> electricity or sonic — all commonly resisted at high level — and a demon-slayer whose blade does not
> answer that is a design hole. *Anchors:* `Inner Upheaval`'s free choice of damage type at monk 1,
> `Overwhelming Breath` (monk 12), `Overwhelming Spellstrike` (magus 12).

### Transparent World Glimpse (L11)

> ✦ **NEW in this guide.** Named as an upgrade target by `Transparent World` (feat 14) but never
> written anywhere. This is its text.

You have begun to see the body beneath the skin — the muscle under the tension, the blood under the
muscle, the bone under the blood. While you are in a Breathing Stance:

- You gain **imprecise blood sense** out to **30 feet**. You automatically detect the presence and
  location of every creature within that range that has blood or an equivalent circulatory fluid,
  regardless of light, cover, concealment, invisibility, or the hidden and undetected conditions. It
  does not detect constructs, oozes, or most undead.
- Once per round, when you Strike a creature within 30 feet, you may **read its flow**: that Strike
  ignores the target's concealment and needs no flat check against a hidden target, and the target's
  **circumstance bonuses to AC do not apply** against it.
- You always know whether a creature within 30 feet is living, undead, a fiend, or a construct.

> *Pricing:* above the Saint's `Sixth Sense` (50) — that is an imprecise sense with an off-guard
> rider; this adds an AC-stripping Strike rider. Deliberately **not** full concealment negation: that
> is `Transparent World`, the level-14 feat, which turns this on continuously and adds HP reading.

### Total Concentration (L12)

When you Refocus, you regain **all** of your Breath Points instead of 1.

> *Anchor:* `Meditative Focus` is **monk 12**, verbatim, and `Bloodline Focus` (**sorcerer 12**) is
> the same effect at the same level. v3 placed this at feat 18, six levels behind two other classes,
> on the class whose entire identity is its focus pool.

### Blade Mastery / Uniform Expertise (L13)

Your proficiency ranks for unarmed attacks, simple weapons and martial weapons increase to master. Your
proficiency ranks in unarmoured defence and light armour increase to expert.

### Demon Slayer Mark (L13)

> ✦ **NEW in this guide.** Named as a prerequisite by `Awakened Mark` (feat 18) and as a gate by
> Love's *Marked Wildclaw* (feat 12), but never written anywhere. This is its text.

**Free action** · **Frequency** once per 10 minutes · **Trigger** You are at half Hit Points or fewer,
or a creature critically hits you, while you are in a Breathing Stance.

The mark surfaces across your skin in your style's colour and burns there for **1 minute**. Choose one
benefit when you activate it:

- **Godspeed** — you gain a **+10-foot status bonus** to all your Speeds; or
- **Ignition** — the **first Form you use** during the duration costs no Breath Point. This cannot be
  a Final or Forbidden Form.

While the mark is active, your Demon Slayer Mark counts as **active** for any Form, feat or effect
that reads it.

> **Say this at the table.** In the source material a marked slayer burns through their own lifespan
> and dies at twenty-five. Nothing here enforces that, and nothing should — but it is the reason the
> Mark is a once-per-10-minutes emergency and not a stance you live in. GMs who want the price on the
> page can rule that each *day* on which the Mark is used costs a year off the end.
>
> *Pricing:* 110 — Saint `Exalt` and `Seventh Sense` tier, a once-per-10-minutes power state with a
> real trigger. `Awakened Mark` (feat 18) later grants **both** benefits at once and adds +1 to your
> Forms' status bonuses.

### Breath of Instinct (L15)

**Frequency** once per minute. You use a Form that takes 1 action without spending a Breath Point.

> *Anchor:* `Qi Center` (monk 18) — a free 1-action stance qi spell once per minute. Ours is three
> levels earlier and restricted to 1-action Forms, which are the small ones.

### Greater Weapon Specialization (L15)

Your damage from weapon specialization increases to +4 with expert proficiency, +6 with master, and +8
with legendary.

### Breath Mastery (L17)

Your proficiency rank for your **Slayer DC** increases to master.

### Constant Total Concentration (L19)

*常中 — the breathing that never stops, waking or sleeping.*

- You are **permanently in a Breathing Stance** you know. You never spend an action to enter one; you
  choose which stance you are in when you make your daily preparations and may change it during any
  ten minutes of rest. **Nothing can force you out of a stance**, and you remain in it while
  unconscious.
- You are **immune to the fatigued condition**, you no longer need to breathe, and you cannot be
  suffocated or drowned.
- When you roll initiative, you **regain 1 Breath Point**, up to your maximum.

> *Pricing:* 150, below the 190 that BCS's Champion pays for `Hero's Defiance` and the Saint pays for
> `Eighth Sense`. Those two cheat death; this one refuses to stop. It also quietly retires
> `Stance Savant` (feat 12) and `Battle Trance` (feat 10) for anyone who took them — normal for a
> capstone, and worth telling a level-19 player they may retrain.

---

## 5 — The Eleven Breathing Styles

*Each entry gives the granted skill, the damage type, the stance, the style rider, all four Forms in
full, and the Final or Forbidden Form. Every Form costs **1 Breath Point**. Tags read
`chassis 1` · `chassis 5` · `feat 8` · `feat 12` · `feat 20`, which is where on the ladder that Form
is acquired.*

**Style riders are budgeted at 30 points each** (Exemplary Finisher anchor) and stances at 20, inside
the single 50-point `Breathing Style` line of the ledger. Every style is a **sidegrade**: choosing one
over another never changes the total.

| Style | Granted skill | Damage | Shape |
| :---- | :---- | :---- | :---- |
| **Water** | Acrobatics | slashing | mobile duellist; the baseline every other style is measured against |
| **Flame** | Intimidation | fire | persistent damage that feeds its own off-guard loop |
| **Thunder** | Athletics | electricity | charge-and-nova; the biggest single-target spike in the class |
| **Wind** | Survival | slashing | area coverage; the best 1-action Form in the book |
| **Stone** | Athletics | bludgeoning | bulwark and forced movement; **Strength recommended** |
| **Sound** | Stealth | sonic | Fortitude-targeting areas and the best anti-caster rider |
| **Flower** | Medicine | slashing | counter-duellist; manufactures off-guard for the whole party |
| **Mist** | Stealth | slashing | concealment control; fights inside its own weather |
| **Moon** † | Intimidation | slashing | the most aggressive style, and the only one whose rider gives its damage away |
| **Love** | Diplomacy | slashing | the only outward-facing rider; **Strength recommended** |
| **Serpent** | Deception | slashing | single-target, many Strikes, **no area Form at all** |

† *Moon is Kokushibo's style. It suits villains, Upper-Moon-hunter campaigns, or a player on a
dark-lineage arc.*

---
## 5.1 — The original five styles

*The five styles the class shipped with. Water is the baseline; every number in §1.4 was calibrated
against it.*

### WATER BREATHING

**Granted skill:** Acrobatics. **Damage type:** slashing.

**Stance — Flowing Form** *(1 action to enter)*
While in this stance you gain a **+1 circumstance bonus to AC** until the start of your next turn if
you Stepped, Strode, Swam, or Flew on your turn.
*(Anchor: `Crane Stance` (monk **1**) grants an **unconditional** +1 circumstance bonus to AC, at the
price of restricting you to crane wing unarmed attacks. Ours is gated on movement instead, and puts
no restriction on your weapon.)*
> ⚠ *Correction to the design brief: `Mobile Shot Stance` is **fighter 8** and concerns ranged
> reactions, not AC — it isn't the right comparison for this stance. `Crane Stance` is.*

**Style rider — Flowing Advance**
The first time each round you Strike a creature after Striding or Stepping that turn, the Strike
deals **+1 precision damage per weapon damage die**.
*(Anchor: Exemplary Finisher tier, 30 pts — identical value to Flower's rider, gated on movement
rather than on off-guard.)*

**First Form: Water Surface Slash** — *chassis 1* · 1 BP · **1 action** · base rank 1
Make a nichirin Strike with a **+1 status bonus** to the attack roll. On a hit it deals **+1d6
slashing**. If you Strode or Stepped at least 10 feet this turn before the Strike, these extra dice
are **d8s** instead of d6s. **H(+2):** +1 die.
> *Rank 10: +5d6 (17.5), or +5d8 (22.5) after moving.*

**Second Form: Water Wheel** — *chassis 5* · 1 BP · **2 actions**, flourish · base rank 2
Stride up to your Speed without triggering reactions and make one nichirin Strike at any point during
the movement, dealing **+3d6 slashing**. If you moved at least 10 feet before the Strike, the target
is **off-guard to you until the end of your next turn**. **H(+2):** +1d6.
> *Rank 10: +7d6 (24.5) plus off-guard.*

**Fourth Form: Striking Tide** — *feat 8* · 1 BP · **reaction** · base rank 4
**Trigger:** You take damage from a physical Strike while in the Water stance.
Reduce the triggering damage by **2 + your level**. If the attacker is within your reach, make a
nichirin Strike against it at your current multiple attack penalty, dealing **+2d6 slashing**; on a
hit, the attacker is **off-guard to you until the end of your next turn**. **H(+2):** +1d6.
> *Rank 10: damage reduced by 22, riposte carries +5d6 (17.5).*

**Sixth Form: Whirlpool** — *feat 12* · 1 BP · **2 actions** · base rank 6
A **10-foot emanation** of churning blades. Each creature in the area takes **9d6 slashing** with a
basic Reflex save. On a **failure** a creature is **pulled 5 feet toward you** (this movement doesn't
trigger reactions from you); on a **critical failure** it is also **off-guard until the start of your
next turn** and **can't Step** until the end of its next turn. Swimming or submerged creatures take a
**−2 circumstance penalty** to the save. **H(+1):** +1d6.
> *Rank 10: 13d6 (45.5) in a 10-ft emanation, plus a pull, off-guard, and a Step lock.
> v3 charged 2 BP for 10d6 in a **5-foot** emanation.*

**FINAL FORM — Eleventh Form: Dead Calm** — *feat 20* · 1 BP · **2 actions** · **Frequency once per 10 minutes**
*(Giyu Tomioka's personal creation.)*
**Duration:** until the start of your next turn.

You settle into perfect stillness and stop moving at all. You gain a **+2 status bonus to AC and to
Reflex saves** and **5 Stillness counters**. You can take no actions other than *Still Water*, below,
while the form lasts; if you take any other action, Dead Calm ends immediately. Any counters you have
not spent are lost when the duration ends.

> **Still Water** ✦ *(free action; it does not use your reaction, and you can take it any number of
> times while Dead Calm lasts)*
> **Trigger:** A creature's melee Strike targets you, and you have at least 1 Stillness counter.
> **Effect:** Spend any number of your remaining counters. Each counter spent is **one blade's worth
> of return**. Resolve them once the triggering Strike's outcome is known:
>
> - **The Strike hits or critically hits you.** Roll your nichirin blade's damage once for each
>   counter spent — weapon dice, runes and your ability modifier, **not** `Concentrated Breathing`,
>   and never doubled. **Reduce the triggering damage by that total.** If the total exceeds the
>   damage, the **excess is dealt to the attacker** as slashing damage from your blade.
> - **The Strike misses or critically misses you.** Each counter spent is instead an immediate
>   **riposte nichirin Strike** against the attacker at a flat **−2** penalty. These ripostes
>   **neither use nor increase your multiple attack penalty**, and each one that hits makes its
>   target **off-guard to you until the end of your next turn**.

**Self-cost:** when Dead Calm ends, you are **off-guard until the end of your next turn** — the
stillness has to break.
> *Still water answers whatever touches it, in kind. A counter is always worth exactly one swing;
> what changes is whether the swing has to roll to land. Against a blow that connects it is
> guaranteed, but it has to eat the blow first and it carries no precision damage. Against a blow
> that misses, all of it goes forward at full weight — and every swing rolls.*
>
> *Anchor: `Impossible Flurry` (ranger 18) is six Strikes at full MAP progression, free, at-will and
> single-target. Five swings' worth, once per 10 minutes, for a Breath Point and **your entire turn**,
> and only if something attacks you in melee, sits under it. **The 2-action cost is the balance
> lever** — v4 charged 1 action for at most four conditional ripostes; v4.2 charges two for five
> counters you can spend either way, so opening with Dead Calm means you have done nothing else that
> round.*

---

### FLAME BREATHING

**Granted skill:** Intimidation. **Damage type:** fire.

**Stance — Burning Advance** *(1 action to enter)*
The **first Strike each round** that you hit with while in this stance deals **persistent fire damage
equal to 1 per weapon damage die** (2 per die at 8th level, **3 per die at 15th level**).
*(Persistent damage repeats, so it is deliberately priced below the class's precision rider: 12
persistent fire at level 20 with major striking, against Concentrated Breathing's +16 per Strike.
Persistent damage of the same type does not stack — the highest value applies.)*

**Style rider — Kindled Wound**
The first time each round that a creature takes persistent fire damage from you, it is **off-guard to
you until the end of your next turn**.
*(Anchor: Exemplary Finisher, 30 pts. A self-feeding loop — your stance sets the fire, the fire opens
the guard, the guard turns on your precision rider.)*

**First Form: Unknowing Fire** — *chassis 1* · 1 BP · **1 action** · base rank 1
Nichirin Strike with a **+1 status bonus** to the roll, dealing **+1d6 fire**. On a hit the target
takes **1d4 persistent fire**; on a **critical hit** it takes **double that persistent fire** and is
**off-guard until that persistent damage ends**. **H(+2):** +1d6 fire and +1d4 persistent fire.
> *Rank 10: +5d6 (17.5) and 5d4 persistent (12.5) — 10d4 (25.0) on a crit.*

**Second Form: Rising Scorching Sun** — *chassis 5* · 1 BP · **2 actions** · base rank 2
Stride up to half your Speed (this movement may be vertical and doesn't trigger reactions), then make
a nichirin Strike with a **+1 status bonus**, dealing **+3d6 fire**. The target is **off-guard
against this Strike if it is taking persistent fire damage**. On a critical hit it is pushed
**10 feet** and knocked **prone**. **H(+2):** +1d6.
> *Rank 10: +7d6 (24.5), self-supplied off-guard, crit knockback, and 25 feet of vertical mobility.*

**Fourth Form: Blooming Flame Undulation** — *feat 8* · 1 BP · **reaction** · base rank 4
**Trigger:** You are targeted by a Strike, or you are caught in a damaging area effect.
A vortex of flame erupts around you: you gain **resistance 5 + your level** against the triggering
damage, and each creature adjacent to you takes **2d6 fire** with a basic Reflex save. A creature
that critically fails is **off-guard to you until the end of your next turn**. **H(+2):** +1d6.
> *Rank 10: resistance 25 against the trigger, 5d6 (17.5) to everything adjacent.*

**Fifth Form: Flame Tiger** — *feat 12* · 1 BP · **2 actions**, flourish · base rank 6
Make **two nichirin Strikes** against the same creature (the second takes your multiple attack
penalty as normal). Each hit deals **+2d6 fire**. **If both Strikes hit**, the target takes **2d6
persistent fire** and becomes **frightened 2**; it cannot reduce that frightened condition below 1
while the persistent fire lasts. **H(+2):** +1d6 per Strike.
> *Rank 10: +4d6 (14.0) per Strike on top of two full Strikes, plus persistent fire and a locked
> frightened 2 — Flame's Intimidation identity expressed as a debuff rather than a bigger die.*

**FINAL FORM — Ninth Form: Rengoku** † — *feat 20* · 1 BP · **3 actions**, flourish · **Frequency once per 10 minutes**
*(The Rengoku family's inherited esoterica.)*

Stride up to **double your Speed** in a straight line; this movement doesn't trigger reactions and
you may move through enemies' spaces. Each creature adjacent to any point of your path takes **13d6
fire** with a basic Reflex save; a creature that **fails** is knocked **prone**, and one that
**critically fails** also takes **4d6 persistent fire**.

End the movement with a nichirin Strike gaining a **+2 status bonus** to the attack roll. On a hit
the target takes **4d6 persistent fire**; on a **critical hit** that persistent fire **cannot be
ended by the usual flat check** — the creature must spend an Interact action to smother it, be
doused, or take cold damage.

**Self-cost:** the technique burns its wielder. You take **fire damage equal to your level** (this
damage ignores your immunities and resistances to fire) and are **slowed 1** on your next turn.
> *Rank 10: 13d6 (45.5) along a 120-foot line, plus a +2 Strike, plus unquenchable fire.
> Anchor: `All Shall End in Flames` — 13d6 in a 30-ft burst, kineticist 18, **free and at-will**.*

---

### THUNDER BREATHING

**Granted skill:** Athletics. **Damage type:** electricity.

**Stance — Lightning Posture** *(1 action to enter)*
While in this stance you gain the action below, and **the first time each round you Stride, that
movement doesn't trigger reactions**.

> **Thunderclap Charge** ✦✦ *(flourish, open, slayer)*
> Stride twice, then make a nichirin Strike. If you don't have a Speed, you can't use this action.

*(Anchor: `Sudden Charge`, a level-1 fighter/barbarian feat — granted here as a stance benefit rather
than a feat, plus `Mobility`-tier reaction avoidance once per round.)*

**Style rider — Godspeed**
If you have moved at least **20 feet** this turn, the first Strike you make that turn makes its
target **off-guard to you until the end of your turn** on a hit.
*(Anchor: Exemplary Finisher, 30 pts — `Guard Break` as a rider, gated on real movement. It sets up
your own follow-up Strike and your precision rider instead of adding damage directly.)*

**First Form: Thunderclap and Flash** — *chassis 1* · 1 BP · **2 actions**, flourish · base rank 1
Stride up to **double your Speed** in a straight line. This movement doesn't trigger reactions and
you are **concealed** while moving. Make a nichirin Strike at the end, dealing **+2d6 electricity**
if you moved at least 20 feet. On a hit, the target **can't use reactions until the end of your
turn** — you were faster than its reflexes. **H(+2):** +1d6.
> *Rank 10: +6d6 (21.0) plus 100+ feet of safe movement plus reaction denial.*

**Second Form: Rice Spirit** — *chassis 5* · 1 BP · **2 actions**, flourish · base rank 2
Five arced slashes in a **15-foot cone**: **3d12 electricity** with a basic Reflex save. A creature
that **fails** can't use reactions until the end of its next turn; one that **critically fails** is
also **off-guard until the start of your next turn**. **H(+2):** +1d12.
> *Rank 10: 7d12 (45.5).*
>
> ⚠ **Rescaled from v3.** v3's `2d12` base with `H(+1) +1d12` reached **10d12 (65.0)** at level 20 —
> above `Tempest Surge`, which is a *single-target* rank-1 druid focus spell, but delivered in a
> cone, and above every Final Form in the book. The d12 identity is preserved; the ladder now lands
> on the 2-action cone curve. See `breath-slayer-v4-changelog.md` for why this deviates from the analysis's
> "leave it as the benchmark."

**Fifth Form: Heat Lightning** — *feat 8* · 1 BP · **1 action** · base rank 4
An upward Strike faster than the eye: nichirin Strike dealing **+3d6 electricity**. On a hit the
target takes a **−10-foot status penalty to all its Speeds** and **can't use reactions**, both until
the end of its next turn. On a **critical hit** it is **stunned 1** (**incapacitation**).
**H(+2):** +1d6.
> *Rank 10: +6d6 (21.0) on one action, plus reaction denial and a Speed penalty with no save.*

**Sixth Form: Rumble and Flash** — *feat 12* · 1 BP · **2 actions** · base rank 6
Three **30-foot lines** originating from you; they may overlap. Each deals **3d6 electricity** with a
basic Reflex save. A creature caught in two or more lines rolls **one** save at a **−2 circumstance
penalty** but takes the damage **once for each line it stands in, to a maximum of two**; on a
**critical failure** it is also **stunned 1** (**incapacitation**). **H(+1):** +1d6 per line.
> *Rank 10: 7d6 (24.5) per line across roughly 18 squares — **49.0** for anything you catch in the
> crossfire, with the stun rider there. v3 charged 3 actions and 2 BP for less than half of this.*

**FINAL FORM — Seventh Form: Honoikazuchi no Kami** — *feat 20* · 1 BP · **3 actions**, flourish · **Frequency once per 10 minutes**
*(Zenitsu Agatsuma's self-created form — the god of thunder, drawn once.)*

Move up to **100 feet** in a straight line. This movement ignores difficult terrain, doesn't trigger
reactions, and can pass through creatures' spaces. A dragon of lightning trails you: each creature
adjacent to any point of your path takes **4d12 electricity** with a basic Reflex save, and one that
critically fails is **stunned 1** (**incapacitation**).

End with a nichirin Strike gaining a **+2 status bonus** to the attack roll and dealing **+6d12
electricity** on a hit. On a hit, the target must also attempt a **Fortitude save** against your
class DC: on a failure it is **stunned 1**, on a critical failure **stunned 2**
(**incapacitation**).

**Self-cost:** your legs give out. You are **slowed 1 for 1 minute**.
> *Rank 10: 4d12 (26.0) down a 100-foot path, plus a +2 Strike carrying 6d12 (39.0) and a stun —
> roughly 106 on the primary target. The nova the class never had.*

---

### WIND BREATHING

**Granted skill:** Survival. **Damage type:** slashing.

**Stance — Cyclone Guard** *(1 action to enter)*
Your nichirin Strikes gain the **sweep** trait (+1 circumstance bonus to attack rolls against a
target other than the last creature you attacked this turn), and you gain a **+1 circumstance bonus
to Reflex saves**.
*(Anchor: a weapon trait granted by a stance, the way `Wolf Stance` (monk 1) grants the **trip**
trait while flanking and `Mountain Stance` (monk 1) grants AC.)*

**Style rider — Windborne Reach**
Your Forms' cones and emanations are **5 feet larger**, and any creature that **critically fails** a
save against one of your Forms is **pushed 5 feet**.
*(Anchor: Exemplary Finisher, 30 pts — an area-identity rider with no damage attached. Wind's
contribution is board coverage.)*

**First Form: Dust Whirlwind Cutter** — *chassis 1* · 1 BP · **1 action** · base rank 1
A **15-foot cone** (20 feet with your rider) of cutting wind: **2d6 slashing** with a basic Reflex
save. A creature that critically fails is knocked **prone**. **H(+1):** +1d6.
> *Rank 10: 11d6 (38.5) in a 20-ft cone **for one action**. This is deliberately the strongest
> 1-action Form in the book — Wind trades single-target output for it. Anchor: `Qi Blast` at one
> action is 9d6 in a 15-ft cone.*

**Second Form: Claws-Purifying Wind** — *chassis 5* · 1 BP · **2 actions**, flourish · base rank 2
Four descending air-claws: make a nichirin Strike dealing **+3d6 slashing**. On a hit the target
takes a **−10-foot status penalty to all its Speeds** until the end of your next turn and **can't
Step**; on a **critical hit** it is also **immobilized until the end of its next turn** — pinned by
the claws, and it can Escape against your class DC. **H(+2):** +1d6.
> *Rank 10: +7d6 (24.5) and a hard mobility lock. Wind's single-target form pays in control.*

**Third Form: Clean Storm Wind Tree** — *feat 8* · 1 BP · **reaction** · base rank 4
**Trigger:** You take damage from a Strike or a physical effect.
A whirling guard of blades: you gain **resistance 5 + half your level** against the triggering
damage, and each creature adjacent to you takes **2d6 slashing** with a basic Reflex save. A creature
that fails is **pushed 5 feet** (10 feet on a critical failure, with your rider). **H(+2):** +1d6.
> *Rank 10: resistance 15 against the trigger, 5d6 (17.5) and forced movement all around you.*

**Fourth Form: Rising Dust Storm** — *feat 12* · 1 BP · **2 actions** · base rank 6
A **10-foot emanation** (15 feet with your rider) of rising slashes: **9d6 slashing** with a basic
Reflex save. The area becomes **difficult terrain** until the start of your next turn. A creature
that **fails** is knocked **prone**. **Flying creatures roll at a −2 circumstance penalty and, on a
failure, are knocked out of the air and fall.** **H(+1):** +1d6.
> *Rank 10: 13d6 (45.5), difficult terrain, prone, and the only reliable anti-flyer tool a martial
> gets without a bow.*

**FINAL FORM — Ninth Form: Idaten Typhoon** — *feat 20* · 1 BP · **3 actions**, flourish · **Frequency once per 10 minutes**

Backflip-leap up to **double your Speed** in any direction; you have a fly Speed for this movement
and must land at the end of it. Each creature adjacent to any point of your path takes **13d6
slashing** with a basic Reflex save. A creature that **fails** is **pushed 10 feet**; one that
**critically fails** is knocked **prone** and **can't Stand until the end of its next turn**.

At any point during the movement, make one nichirin Strike with a **+2 status bonus** to the attack
roll, dealing **+4d6 slashing** on a hit.

**Self-cost:** the violent rotation leaves you reeling — you are **dazzled and off-guard until the
end of your next turn**.
> *Rank 10: 13d6 (45.5) along a path whose shape you choose, plus a +2 Strike, plus a knockdown that
> sticks for a round.*

---

### STONE BREATHING

**Granted skill:** Athletics.
**Key ability:** Strength is the recommended key ability for this style; a Stone slayer may choose
Strength in place of the class's default key ability.
**Damage type:** bludgeoning.

**Stance — Immovable Guard** *(1 action to enter)*
You gain a **+1 circumstance bonus to Fortitude saves**. If you have not left your space since the
end of your last turn, you also gain **resistance to bludgeoning damage equal to half your level
(minimum 1)** and a **+2 circumstance bonus to your Fortitude DC** against Shove, Trip, Grapple and
Reposition, and to saves against forced movement.
*(Anchor: `Mountain Stance` (monk 1) trades mobility for defence the same way. `Thermal Nimbus`
(kineticist **4**) grants resistance equal to your **full** level, at will, to one damage type — half
level to one physical type, gated on standing still, sits well under it.)*

**Style rider — Mountain's Answer**
Once per round, when a creature within your reach hits you with a melee Strike, it takes
**bludgeoning damage equal to your number of weapon damage dice**.
*(Anchor: Exemplary Finisher, 30 pts — a `Thermal Nimbus`-lite retaliation that gives the bulwark
style an offensive floor.)*

**First Form: Serpentinite Bipolar** — *chassis 1* · 1 BP · **1 action** · base rank 1
Nichirin Strike with a **+1 status bonus** to the roll, dealing **+1d6 bludgeoning**. On a hit you
**Shove the target 5 feet** with no check and no MAP increase; on a **critical hit** you Shove it
**10 feet** and it is knocked **prone**. **H(+2):** +1d6.
> *Rank 10: +5d6 (17.5) plus free, check-less forced movement every turn.*

**Second Form: Upper Smash** — *chassis 5* · 1 BP · **1 action** · base rank 2
**Requirement:** The target is **larger than you**, **prone**, **grabbed**, **restrained**, or has
already taken damage from you this combat.

Drive the blade upward: nichirin Strike dealing **+3d6 bludgeoning**. On a hit the target is
**off-guard to all creatures until the start of your next turn**; on a **critical hit** it is also
knocked **prone**. **H(+2):** +1d6.
> *Rank 10: +7d6 (24.5) on **one action**, plus party-wide off-guard. The requirement is the price —
> this is the conditional-usability lever standing in for a bigger cost.*
>
> ⚠ **v3 gave this form no heightening line at all**, leaving it a 7.0-damage focus spell at level 20.

**Third Form: Stone Skin** — *feat 8* · 1 BP · **1 action** · **Duration 1 minute** · base rank 4
Your skin takes on the density of rock. You gain **resistance to all physical damage (except
adamantine) equal to half your level (minimum 2)**, and you **cannot be knocked prone or forcibly
moved** by anything other than a creature two or more sizes larger than you.
*(No heightening line: the resistance scales off your level directly.)*
> *Level 20: resistance 10 to bludgeoning, piercing and slashing for a minute, plus effective
> immunity to ordinary knockdown. v3's `resistance 2, H(+4) +2` reached **resistance 4** at level 20,
> against `Thermal Nimbus`'s resistance 20 at will from level 4.*

**Fourth Form: Volcanic Rock, Rapid Conquest** — *feat 12* · 1 BP · **2 actions** · base rank 6
A **15-foot cone** of shattered earth: **9d6 bludgeoning** with a **basic Fortitude** save — note the
defence; Stone hits the save most area effects miss. The area becomes **difficult terrain** until the
start of your next turn. A creature that **fails** is knocked **prone**; one that **critically fails**
is **immobilized** beneath the rubble until it Escapes (DC = your class DC). **H(+1):** +1d6.
> *Rank 10: 13d6 (45.5) against Fortitude, plus terrain, prone, and a hard immobilize.
> Anchor for the immobilize: `Hell of 1,000,000 Needles` (kineticist 18).*

**FINAL FORM — Fifth Form: Arcs of Justice** — *feat 20* · 1 BP · **3 actions**, flourish · **Frequency once per 10 minutes**

Make **four nichirin Strikes**, divided among creatures within your reach as you choose. Your
multiple attack penalty increases as normal after each Strike. Each Strike deals **+2d8 bludgeoning**
on a hit, and each hit lets you either **pull the target 5 feet toward you** or knock it **prone**
(your choice, no check, no MAP increase).

Until the start of your next turn you gain **resistance 15 to all damage**, you **cannot be forcibly
moved**, and you automatically **critically succeed** at saves and DCs against being knocked prone.

**Self-cost:** the rooted stance holds you. Your **Speeds are 0 until the end of your next turn**.
> *Anchor: `Impossible Flurry` (ranger 18) is **six** Strikes at full MAP progression, free and
> at-will. Four Strikes plus a fortress round, once per 10 minutes for 1 BP, sits under it — and
> Speed 0 is a real cost on a form that wants you in the middle of the enemy line.*

---

## 5.2 — The four expanded styles

*(From the 5e module. Each is a full subclass: granted skill + stance + 30-pt style rider + 4 forms +
Final Form. Sidegrades, so the BCS ledger is unchanged.)*

### SOUND BREATHING ⚠

*Only three Sound forms are canon (First, Fourth, Fifth); the ⚠ forms are adapted from the 5e
module's inventions.*

**Granted skill:** Stealth (shinobi training). **Damage type:** sonic.

**Stance — Resonant Tempo** *(1 action to enter)*
You gain a **+1 circumstance bonus to Feint** checks and can **Feint creatures within 15 feet** using
the ring of your blades rather than a visible motion.

**Style rider — Ringing Ears**
When a creature critically fails a save against one of your Forms, or when you critically hit with
one, it is **deafened until the end of your next turn** and is **off-guard to you while deafened this
way**. *(Anchor: Exemplary Finisher, 30 pts.)*

**First Form: Roar** — *chassis 1* · 1 BP · **1 action** · base rank 1
Strike with a thunderous impact: **+1 status bonus** to the roll, **+1d6 sonic**. On a hit the target
**can't use reactions until the end of your turn**; on a **critical hit** it is pushed **10 feet**.
**H(+2):** +1d6.
> *Rank 10: +5d6 (17.5) and reaction denial on every hit.*

**⚠ Second Form: Bang** — *chassis 5* · 1 BP · **2 actions** · base rank 2
Slam both blades together: a **10-foot emanation** of concussive sound dealing **2d8 sonic** with a
basic **Fortitude** save. A creature that **fails** can't use reactions until the end of its next
turn; one that **critically fails** is **deafened for 1 minute**. **H(+1):** +1d8.
> *Rank 10: 10d8 (45.0) against Fortitude, in an emanation.*

**⚠ Third Form: Smoke** — *feat 8* · 1 BP · **2 actions** · base rank 4
Detonate a shinobi charge: a **10-foot burst within 30 feet** dealing **5d6 sonic** with a basic
Reflex save. The area fills with **concealing smoke** until the start of your next turn. A creature
that **fails** is **dazzled** while it remains in the smoke; one that **critically fails** is
**blinded until the end of its next turn**. **H(+1):** +1d6.
> *Rank 10: 11d6 (38.5) delivered at 30 feet of range, plus a flashbang. The ranged delivery is why
> this sits below the 13d6 curve.*

**Fourth Form: Constant Resounding Slashes** — *feat 12* · 1 BP · **2 actions**, flourish · base rank 6
Make **two nichirin Strikes** against the same creature (MAP applies to the second). Each hit deals
**+2d6 sonic**. **If both Strikes hit**, the ringing shatters its concentration: it is **stupefied 2**
until the end of your next turn and must succeed at a Fortitude save against your class DC or be
**slowed 1** until the end of its next turn. **H(+2):** +1d6 per Strike.
> *Rank 10: +4d6 (14.0) per Strike, plus the best anti-caster rider in the book.*

**FINAL FORM — Fifth Form: String Performance** — *feat 20* · 1 BP · **3 actions**, flourish · **Frequency once per 10 minutes**

A whirling, music-scored massacre. Stride up to your Speed without triggering reactions, then make
one nichirin Strike each against up to **four creatures** adjacent to any point of your path (your
multiple attack penalty increases as normal after each). Each Strike deals **+4d6 sonic** on a hit.

Each creature you hit must succeed at a **Fortitude save** against your class DC or be **deafened for
1 minute** and **stunned 1**; on a critical failure, **stunned 2** (**incapacitation**).

When the movement ends the chord resolves: each creature you hit takes another **4d6 sonic**, no save.

**Self-cost:** the score demands everything. You are **deafened for 1 minute** and **enfeebled 2
until the end of your next turn**.
> *Four Strikes across four bodies with a stun rider, plus a closing chord.
> Anchors: `Impossible Flurry` (6 Strikes, free) and `Sever Four Dragonfly Wings` (4 Strikes, free,
> exemplar).*

---

### FLOWER BREATHING

*Canon provides Second, Fourth, Fifth, Sixth and a literal Final Form — a perfect fit.*

**Granted skill:** Medicine (Butterfly Mansion training).
**Damage type:** slashing (precision-flavoured).

**Stance — Graceful Bloom** *(1 action to enter)*
You gain a **+1 circumstance bonus to initiative rolls and to Seek**.

**Style rider — Blossom's Eye**
The first time each round you Strike a creature that is **off-guard to you**, you deal **+1 precision
damage per weapon damage die**. *(Anchor: `Precise Strike`-lite at Exemplary Finisher value, 30 pts.)*

**Second Form: Honorable Shadow Plum** — *chassis 1* · 1 BP · **reaction**
**Trigger:** You are targeted by a melee Strike while in the Flower stance.
Whirling defensive slashes: you gain a **+2 circumstance bonus to AC** against the triggering attack.
If the attack **misses**, the attacker is **off-guard to you**, and your next Strike against it before
the end of your next turn gains a **+1 circumstance bonus** to the attack roll.
> *A canon defensive form as the entry point — Flower plays as the counter-duelist. No damage line;
> its value is the reaction and the off-guard that turns on Blossom's Eye.*

**Fourth Form: Crimson Hanagoromo** — *chassis 5* · 1 BP · **1 action** · base rank 2
A single curving slash from an angle the eye can't follow: nichirin Strike with a **+1 status bonus**
dealing **+3d6 slashing**. The target is **off-guard against this Strike** if it has already attacked
you this combat. **H(+2):** +1d6.
> *Rank 10: +7d6 (24.5) on one action, with self-supplied off-guard that turns on Blossom's Eye.
> v3's version reached +2d6 (7.0) at level 20.*

**Fifth Form: Peonies of Futility** — *feat 8* · 1 BP · **2 actions**, flourish · base rank 4
Nine blossoming arcs compressed into **two nichirin Strikes** against the same creature (MAP applies
to the second). Each hit deals **+2d6 slashing**. If either Strike **critically hits**, the target
takes **2d8 persistent bleed**. **If both Strikes hit**, the target is **off-guard to you until the
end of your next turn** and takes a **−2 circumstance penalty** to flat checks to end persistent
bleed you caused. **H(+2):** +1d6 per Strike.
> *Rank 10: +5d6 (17.5) per Strike, with a bleed that is genuinely hard to shake.*

**Sixth Form: Whirling Peach** — *feat 12* · 1 BP · **2 actions** · base rank 6
Spin past your enemies: Stride up to your Speed, moving through or around creatures' reach without
triggering their reactions. Make one nichirin Strike each against up to **two creatures** you moved
past (MAP applies after the first), each with a **+1 status bonus** to the roll and **+2d6 slashing**.
Each creature you **hit** is **off-guard to all creatures until the start of your next turn**.
**H(+2):** +1d6 per Strike.
> *Rank 10: +4d6 (14.0) per Strike across two targets, plus party-wide off-guard on both — the best
> setup action a Flower slayer can hand the rogue and the fighter.*

**FINAL FORM — Equinoctial Vermilion Eye** † — *feat 20* · 1 BP · **1 action** · **Frequency once per 10 minutes** · **Duration 1 minute**
*(Canon's named Final Form — the forbidden vision technique.)*

Your kinetic vision sharpens to the edge of human limits:
- **+2 status bonus to AC, to Reflex saves, and to attack rolls.**
- You **ignore concealment entirely**, and invisible creatures are merely **hidden** to you.
- Enemies are **off-guard to you on your first Strike against them each round**.
- Once per round you may **Step as a free action**.

**Self-cost (forbidden):** when the duration ends you are **blinded until you Refocus**, and then
**dazzled for 1 hour**. The **second and each later use in the same day** instead blinds you for
**24 hours**. Canonically this technique costs its user their eyesight; GMs should feel free to
enforce permanent consequences for habitual use, and should not hand out casual blindness removal.
> *The analysis called this "the only Final Form that is actually a capstone." Its power is unchanged;
> it now costs 1 BP instead of 3. The blindness is the price, and it has to be the only one.*

---

### MIST BREATHING

*All seven Mist forms are canon; four selected, plus Muichiro's personal Seventh as the Final Form.*

**Granted skill:** Stealth. **Damage type:** slashing (obscuring flavour).

**Stance — Veiled Sky** *(1 action to enter)*
You **don't take the flat check penalty** for targeting concealed creatures, and you can **Hide while
concealed only by your own Forms' effects**.

**Style rider — One-Way Fog**
Areas of mist, smoke, or obscurement created by your Forms grant concealment **to** you but never
**against** you. *(Anchor: Exemplary Finisher, 30 pts.)*

**First Form: Low Clouds, Distant Haze** — *chassis 1* · 1 BP · **1 action** · base rank 1
Nichirin Strike with a **+1 status bonus**, dealing **+1d6 slashing**. On a hit a curl of mist clings
to the target and it is **dazzled until the start of your next turn**; on a **critical hit** it is
**blinded until the end of its next turn**. **H(+2):** +1d6.
> *Rank 10: +5d6 (17.5) and a no-save dazzle on every hit.*

**Second Form: Eight-Layered Mist** — *chassis 5* · 1 BP · **2 actions**, flourish · base rank 2
Two layered Strikes against the same creature (MAP applies to the second), each dealing **+1d6
slashing**. The **second Strike** ignores the target's **circumstance bonuses to AC** and any
**concealment** it has — it can't read the layers. **H(+2):** +1d6 per Strike.
> *Rank 10: +5d6 (17.5) per Strike, and a guaranteed answer to Raise a Shield and to concealment.*

**Fifth Form: Sea of Clouds and Haze** — *feat 8* · 1 BP · **2 actions** · base rank 4
Blanket a **15-foot burst within 30 feet** in mist until the start of your next turn. Creatures in
the area when it forms take **5d6 slashing** with a basic Reflex save, and any creature that ends its
turn inside takes **4d6 slashing** (no save). Creatures inside are **concealed from each other** and
take a **−2 circumstance penalty to Seek**; by your rider, none of this applies against you.
**H(+1):** +1d6.
> *Rank 10: 11d6 (38.5) on entry plus a persistent 4d6 zone, delivered at 30 feet of range.*

**Sixth Form: Lunar Dispersing Mist** — *feat 12* · 1 BP · **2 actions** · base rank 6
A retreating spray of slashes. Make one nichirin Strike each against up to **two creatures within
your reach** (MAP applies after the first), each dealing **+2d6 slashing**. Each creature you **hit**
is **dazzled and can't Seek** until the end of its next turn.

Then Stride up to half your Speed without triggering reactions. Until the start of your next turn you
are **concealed**, and you are **hidden from every creature you hit with this Form** until it
succeeds at a Seek against you. **H(+2):** +1d6 per Strike.
> *Rank 10: +4d6 (14.0) per Strike across two targets, a full disengage, and hidden status — which
> feeds Mist's own off-guard economy on your next turn.*
>
> ⚠ **v3's version was the single worst ability in the document**: 2 Focus Points and 2 actions for
> two Strikes with **zero bonus damage, no heightening line**, and two Steps.

**FINAL FORM — Seventh Form: Obscuring Clouds** — *feat 20* · 1 BP · **2 actions** · **Frequency once per 10 minutes** · **Duration 1 minute**
*(Muichiro Tokito's personal creation.)*

Dense mist erupts in a **20-foot emanation that moves with you**. While it lasts:
- Every creature inside is **concealed**, and creatures outside cannot see into it at all — those
  inside are **hidden** to them.
- **No creature is ever concealed from you**, and you see through the mist as though it were not
  there.
- Enemies inside take a **−2 circumstance penalty to attack rolls and to Perception checks**.
- You gain a **+2 circumstance bonus to AC** against attacks made by creatures inside the cloud.
- The **first Strike you make each round** against a creature inside treats it as **off-guard**.
- Once per round, after you Strike, you can **Step or Hide as a free action**.

**Self-cost:** sustaining a cloud that size drains you — when it ends, you are **fatigued**.
> *No damage line, by design: this is a one-minute battlefield-control capstone that an entire party
> fights inside. The self-cost is deliberately the mildest in the book because the Form's output is
> entirely positional.*

---

### MOON BREATHING †

*Kokushibo's style. GMs: it suits villains, Upper-Moon-hunter campaigns, or a player with a
dark-lineage arc — it is deliberately the most aggressive style, and it pays for that in self-costs.*

**Granted skill:** Intimidation. **Damage type:** slashing (chaotic crescent blades).

**Stance — Crescent Chaos** *(1 action to enter)*
Once per round, when you roll damage for a Form, you may **reroll one damage die** and take the
higher result.

**Style rider — Borrowed Light**
*The moon makes no light of its own. What it takes from something brighter, it hands down to
everything standing underneath it.*

The first time each round that you hit a creature with a nichirin Strike or a Form, it becomes
**moonlit** until the end of your next turn — pale crescents cling to it and will not go out.

While a creature is moonlit:
- It is **not concealed** from you or from any ally within 30 feet of it, and it **can't be hidden or
  undetected** from them.
- The first Strike each round that an ally **in a Breathing Stance** makes against it deals **+1
  precision damage per weapon damage die**. If that ally's own style rider would also apply to that
  Strike, use the higher of the two — they don't stack.
- When you **critically hit** it, erratic crescents splash **one enemy adjacent to it** for slashing
  damage equal to your **number of weapon damage dice**.

**Lend the light.** Once per round as a free action, choose one willing ally within 30 feet. Until
the end of your next turn they count as being **in a Breathing Stance** — for the second bullet
above, and for nothing else.
*(Anchor: Exemplary Finisher tier, 30 pts. The precision clause is Flower's `Blossom's Eye` handed to
somebody else, and it is the only rider in the book that gives its holder **no direct damage at all** —
which is the point. It sits strictly under Love's `Beloved of the Corps`, which hands an ally +1 to
**attack rolls and** damage and needs no hit to set it up. The lending clause is what keeps the rider
live in a party with no second slayer; without it, Moon's identity would be dead at most tables. The
old `Erratic Crescents` splash survives as the third bullet, so nothing was lost to pay for this.)*

**First Form: Dark Moon, Evening Palace** — *chassis 1* · 1 BP · **1 action** · base rank 1
Nichirin Strike with a **+1 status bonus**, dealing **+1d6 slashing**. On a hit, crescents linger: the
first time the target moves before the start of your next turn, it takes slashing damage equal to
**twice your number of weapon damage dice**. On a **critical hit** it also **can't Step** until the
end of its next turn. **H(+2):** +1d6.
> *Rank 10: +5d6 (17.5) plus a movement tax that punishes disengaging.*

**Second Form: Pearl Flowers, Moongazing** — *chassis 5* · 1 BP · **2 actions** · base rank 2
A ranged crescent volley in a **15-foot cone**: **5d6 slashing** with a basic Reflex save. A creature
that **fails** takes **2d6 persistent bleed**; one that **critically fails** takes **4d6 persistent
bleed** and is **off-guard until the start of your next turn**. **H(+1):** +1d6.
> *Rank 10: 13d6 (45.5) plus bleed.*

**Third Form: Loathsome Moon, Chains** — *feat 8* · 1 BP · **2 actions** · base rank 4
Two enormous linked crescents sweep out in a **30-foot line**: **5d6 slashing** with a basic Reflex
save. A creature that **fails** is **off-guard until the start of your next turn**; one that
**critically fails** is **grabbed by the chains** and must Escape (DC = your class DC) to move.
**H(+1):** +1d6.
> *Rank 10: 11d6 (38.5) down a 30-foot line, with a hard lock on the worst-off targets.*

**Fifth Form: Moon Spirit Calamity** — *feat 12* · 1 BP · **2 actions** · base rank 6
Countless rising crescents fill a **20-foot cone**: **9d6 slashing** with a basic Reflex save. A
creature that **fails** is knocked **prone**; one that **critically fails** also takes **2d6
persistent bleed**. The area stays **filled with spinning crescents** until the start of your next
turn: any creature that ends its turn inside, or that moves through it, takes **4d6 slashing**.
**H(+1):** +1d6.
> *Rank 10: 13d6 (45.5) in a bigger cone than Pearl Flowers, plus prone, plus a lingering 4d6 zone.*

**FORBIDDEN FORM — Sixteenth Form: Moonbow, Half Moon** † — *feat 20* · 1 BP · **3 actions**, flourish · **Frequency once per 10 minutes**

A cascade of half-moon blades rains down in a **40-foot cone**: **16d6 slashing** with a basic Reflex
save. A creature that **fails** takes **4d6 persistent bleed**; one that **critically fails** is also
knocked **prone**, and its bleed **cannot be ended by the usual flat check** — it requires magical
healing, or an Interact action from an adjacent creature, to stanch.

Any creature that **begins its next turn in the area** takes **6d6 slashing** as the lingering
crescents keep spinning.

**Self-cost (forbidden):** the technique feeds on your vitality. You become **drained 1** — **drained
2** if any creature was reduced to 0 Hit Points by the cone — and this drain **cannot be removed until
you Refocus**.
> *Rank 10: 56.0 in a 40-foot cone, with unstoppable bleed and a lingering second tick.
> Anchor: `Dragon Breath` — 19d6 (66.5) in a 30-ft cone, sorcerer, 1 FP, **no self-cost at all**.
> A martial capstone at 56.0 once per 10 minutes, paid for in drained, sits correctly beneath it.*

---

## 5.3 — The two derived styles

*Added in v4.1. Unlike the four expanded styles, these two are **canon Hashira styles**, and the wiki
states each one's parent outright: **Love Breathing is directly derived from Flame Breathing**
(Mitsuri Kanroji reshaped what Kyojuro Rengoku taught her, mid-battle, against Hairo's wolves), and
**Serpent Breathing is derived from Water Breathing** (Obanai Iguro's own creation). Same
construction as every other subclass: granted skill + stance + 30-pt style rider + 4 forms + Final
Form. Sidegrades, so the BCS ledger is unchanged.*

*Both ladders are built **entirely from canon forms** — nothing here is invented except one clearly
labelled optional sidebar. Form text and Japanese names are taken from the Kimetsu no Yaiba Wiki
articles for each style; where a popular secondary source contradicts the wiki, the wiki wins and the
discrepancy is flagged.*

### LOVE BREATHING

*Mitsuri Kanroji's personal creation — the only Breathing Style whose creation is shown on the page.
Canon lists six forms and demonstrates five (First, Second, Third, Fifth, Sixth); **the Fourth Form
was never revealed**. Those five demonstrated forms are exactly a full ladder, so the Fourth is
simply skipped, the way Water skips its Third and Fifth.*

**Granted skill:** Diplomacy — the only style that grants it. *(If your table prefers the technical
read over the character read, Acrobatics is equally defensible: the wiki describes Love Breathing as
"gymnastic and movement-oriented," built on superhuman flexibility, dexterity and agility.)*
**Key ability:** Strength is recommended, as with Stone. Canonically the style works **only** for
Mitsuri, because it runs on a body with eight times normal muscle density; in this class, treat it as
a lineage that a slayer can be conditioned into, or, if you want the canon reading, as a style the GM
gates behind an unusual heritage.
**Damage type:** slashing. Its slashes throw **pink and green sparks** and leave **pink lines**
tracing the path of every cut.

**Stance — Whipcord Blade** *(1 action to enter)*
Love Breathing is at its best with a whip-like katana — a blade ground so thin and tempered so soft
that it flexes like a ribbon of steel. While in this stance your nichirin Strikes gain the **reach**,
**disarm**, and **trip** traits.
*(Anchor: the `whip`'s own trait line, minus its damage penalty. The `reach` trait puts a Medium
slayer at 10 feet — exactly a reach weapon, a choice open to any character at level 1 — so this
stance saves you a weapon slot and adds two traits rather than granting the game anything new.)*

**Style rider — Beloved of the Corps**
The first time each round that you hit a creature, choose one ally within 30 feet who can see or hear
you. Until the start of your next turn, that ally gains a **+1 circumstance bonus to attack rolls and
damage rolls against that creature**.
*(Anchor: Exemplary Finisher, 30 pts. Strictly under `Bless`, which gives a +1 status bonus to attack
rolls to **every** ally in a growing emanation and needs no hit to trigger. This is the only style
rider in the book that points outward, and it is the reason to bring a Love slayer.)*

**First Form: Shivers of First Love** — *chassis 1* · 1 BP · **1 action** · base rank 1
*(Ichi no kata: Hatsukoi no Wananaki — "the user dashes forward and performs a single slash that
winds through the target, hitting multiple areas with one slice.")*
Stride up to half your Speed, then make a nichirin Strike with a **+1 status bonus** to the attack
roll, dealing **+1d6 slashing**. The blade winds as it travels: **this Strike ignores lesser and
standard cover**. On a **critical hit** the target is **off-guard until the end of your next turn**.
**H(+2):** +1d6.
> *Rank 10: +5d6 (17.5), with a half-Speed approach folded into one action. Cover negation is unique
> to this Form in the whole compendium — a single slice that "hits multiple areas" is a cut the
> target's shield and the pillar it's behind can't both stop.*

**Second Form: Love Pangs** — *chassis 5* · 1 BP · **2 actions**, flourish · base rank 2
*(Ni no kata: Ōnō Meguru Koi — "a singular, long-winding swing, akin to a whipping motion, that cuts
the target at multiple angles.")*
One swing, folded back on itself. Make **two nichirin Strikes** against the **same creature** (your
multiple attack penalty applies to the second), each dealing **+1d6 slashing**. **If both Strikes
hit**, the crossing cuts won't close: the target takes **2d8 persistent bleed**. **H(+2):** +1d6 per
Strike.
> *Rank 10: +5d6 (17.5) per Strike, 35.0 in bonus damage on top of two full Strikes, plus bleed.*
>
> ⚠ *Secondary sources describe this form as "attacking the area around her," defensively. The wiki
> is explicit that it is one long swing cutting **the target** from multiple angles, so it is built
> single-target here.*

**Third Form: Catlove Shower** — *feat 8* · 1 BP · **2 actions** · base rank 4
*(San no kata: Koi Neko Shigure — "the user leaps into the air and performs multiple arched slashes
in quick succession." `Shigure` is a passing autumn shower; the slashes come down like rain.)*
Leap up to your Speed (you have a fly Speed for this movement and must land at the end of it), then
rain arcing slashes into a **15-foot burst within 30 feet**: **5d6 slashing** with a basic Reflex
save. A creature that **critically fails** is knocked **prone**.
**Flying creatures take a −2 circumstance penalty to the save and, on a failure, fall.**
**H(+1):** +1d6.
> *Rank 10: 11d6 (38.5) at 30 feet of range, plus a full-Speed leap. The ranged delivery is why this
> sits below the 13d6 area curve.*

**Fifth Form: Swaying Love, Wildclaw** — *feat 12* · 1 BP · **2 actions** · base rank 6
*(Go no kata: Yurameku Renjō — Midarezume. "The user leaps into the air before performing a
somersault and releasing dozens of rapid, winding slashes **from afar** that essentially form a
tornado of slashes.")*
Somersault backward and unspool the blade. A **20-foot burst within 60 feet** fills with a whirling
column of slashes: **9d6 slashing** with a basic Reflex save. A creature that **fails** is **pulled
10 feet toward the centre** of the burst; one that **critically fails** is also knocked **prone** and
**off-guard until the start of your next turn**. **H(+1):** +1d6.

> **Marked Wildclaw.** While your **Demon Slayer Mark** is active, the tornado tightens into a drill:
> the damage increases by **4d6**, and a creature that **fails** its save is **immobilized** until it
> Escapes (DC = your class DC) instead of being pulled.
> *(Canon hook: the wiki notes this technique "was shown to have an even more powerful drill-like
> attack when boosted with a Demon Slayer Mark." It is also the compendium's cleanest
> conditional-usability gate — a Form that reads your own chassis state instead of costing more.)*

> *Rank 10: 13d6 (45.5) in a 20-ft burst at 60 feet of range — the longest reach of any Form in the
> book — or 17d6 (59.5) with an immobilize while Marked.*

**FINAL FORM — Sixth Form: Cat-Legged Winds of Love** — *feat 20* · 1 BP · **3 actions**, flourish · **Frequency once per 10 minutes**
*(Roku no kata: Neko Ashi Koi Kaze. "The user fully extends their sword to perform an arcing slash
before retracting it and extending it once more, done in quick succession to form a **layer of
slashes**." Her highest and last named form.)*

Extend, retract, extend, until the air around you is layered with steel. Make **four nichirin
Strikes**, divided as you choose among creatures **within 15 feet** of you — you may strike the same
creature more than once. Your multiple attack penalty increases as normal after each Strike. Each
Strike deals **+4d6 slashing** on a hit.

Any creature **hit two or more times** is wrapped in the layers: it is **restrained** until it
Escapes (DC = your class DC) and takes **4d6 persistent bleed**.

And every ally within 30 feet is lifted by the sight of it: each gains **temporary Hit Points equal
to your level** and a **+1 status bonus to attack rolls** until the start of your next turn.

**Self-cost:** nothing human survives its own strength at that pitch. Your muscles tear — you are
**enfeebled 2 until you Refocus**.
> *Anchor: `Impossible Flurry` (ranger 18) is six Strikes at −0/−5/−10 for three actions, **free,
> at-will, single-target, no self-cost**. Four Strikes at 15 feet of reach with a restrain, a bleed,
> and a party-wide buff, once per 10 minutes for 1 BP, sits under it. Enfeebled 2 on a Strength
> martial until the next Refocus is the heaviest ongoing self-cost in the book after Vermilion Eye's
> blindness.*

> ### ⚠ Optional: the missing Fourth Form
> Canon lists six forms and shows five. If your table wants the gap filled rather than skipped, this
> is the house form — the "red string of fate" is the register Mitsuri's named techniques sit in, and
> the franchise's own *Shivers of First Love, **Entwined*** (縛, "bind") shows wrapping is already in
> Love Breathing's vocabulary. Take it **in place of** Swaying Love, Wildclaw at feat 12, not
> alongside it.
>
> **⚠ Fourth Form: Entwined Hearts, Crimson Thread** — *feat 12* · 1 BP · **2 actions** · base rank 6
> The whip lashes out in loops and draws taut between them. Choose up to **three creatures within 15
> feet**; each takes **9d6 slashing** with a basic Reflex save. A creature that **fails** is
> **grabbed** by the coils (Escape DC = your class DC); one that **critically fails** is
> **restrained** instead. While **two or more** creatures are bound this way they are all
> **off-guard**, and whenever one of them takes damage from you, **one other bound creature of your
> choice takes slashing damage equal to your number of weapon damage dice** — the thread pulls taut.
> **H(+1):** +1d6.
> *Rank 10: 13d6 (45.5) across three targets, plus a multi-target bind and a damage-chaining rider.*

---

### SERPENT BREATHING

*Obanai Iguro's own creation, derived from Water Breathing. **All five canon forms are used** — no
inventions were needed anywhere in this style. Serpent is the compendium's one style with **no area
Form at all**: it is the single-target, many-Strikes style, the class's answer to a Flurry ranger.*

**Granted skill:** Deception. The wiki is explicit: Serpent's attacks "are not direct and constantly
meander which can ultimately strike anywhere, which can **fool opponents and catch them off guard**."
**Damage type:** slashing. Its users visualise **white serpents** accompanying them as the techniques
land.

**Stance — Winding Posture** *(1 action to enter)*
Obanai's nichirin is a heavily modified blade shaped along a snake's body — closer to an Indonesian
kris, or an old-Japanese **dakōken** (蛇行剣, "snake-walking sword"), than to a katana. While in this
stance your nichirin Strikes gain the **agile** and **finesse** traits: your multiple attack penalty
with them is **−4/−8**, and you may use Dexterity for their attack rolls.
*(Anchor: the `kukri`'s trait line, which is what a wavy short blade is in this system. Agile weapons
are open to everyone at level 1; what this stance grants is agile **without** the smaller damage die
— the trade being that Serpent has no area Forms anywhere in its ladder.)*

**Style rider — Kaburamaru's Reading**
A white serpent rides at your throat and reads your enemies before they move. The **first time each
round that a creature targets you with an attack roll**, you gain a **+2 circumstance bonus to AC**
against it.
*(Canon: "Obanai, having always been partially blind in his right eye, performed Serpent Breathing
with the help of his snake Kaburamaru. Kaburamaru possesses a unique ability which allows him to read
and predict a target's attacks and then relay that information to Obanai."*
*Anchor: Exemplary Finisher, 30 pts. `Nimble Dodge` (rogue 1) is exactly this bonus — but it costs
your reaction and you choose when to spend it. This costs no reaction and fires automatically, but
only on the first attack of each round, so it can never be saved for the one that matters.)*

**First Form: Winding Serpent Slash** — *chassis 1* · 1 BP · **1 action** · base rank 1
*(Ichi no kata: Idagiri — "a singular frontal horizontal slash aimed at their target in a winding
motion.")*
**Step**, then make a nichirin Strike dealing **+1d6 slashing**. The blade takes a path nobody can
read: if you Stepped or Strode this turn before the Strike, **the target is off-guard against it**.
**H(+2):** +1d6.
> *Rank 10: +5d6 (17.5). The free Step satisfies the Form's own condition, so the off-guard is
> reliable — and it turns on Concentrated Breathing with no flanking partner. Water's First Form gates
> bigger dice on movement; Serpent gates the guard itself.*

**Second Form: Venom Fangs of the Narrow Head** — *chassis 5* · 1 BP · **2 actions** · base rank 2
*(Ni no kata: Kyōzu no Dokuga — "the user dashes behind their opponent at blinding speed and aims to
swiftly slice off their head from behind horizontally.")*
Stride up to your Speed; this movement doesn't trigger reactions and you may pass through enemies'
spaces. You must end adjacent to a creature. Make a nichirin Strike against it dealing **+3d6
slashing**; **the target is off-guard against this Strike** — you are behind it before it turns. On a
**critical hit** the fang finds something vital: it is **enfeebled 2 until the end of your next
turn**. **H(+2):** +1d6.
> *Rank 10: +7d6 (24.5), guaranteed off-guard, full-Speed repositioning, and a crit rider that guts
> the target's own offence rather than adding a die.*

**Third Form: Coil Choke** — *feat 8* · 1 BP · **2 actions**, flourish · base rank 4
*(San no kata: Toguro Jime — "the user circles around their opponent while using their sword to slice
them from all directions." `Toguro` is a snake's coil.)*
Stride up to your Speed, circling a single creature without triggering its reactions; you must end
adjacent to it. Make **two nichirin Strikes** against it (your multiple attack penalty applies to the
second — **−4**, from your stance). Each hit deals **+2d6 slashing**. **If both Strikes hit**, the
coils close: the target is **grabbed** (Escape DC = your class DC) and **off-guard until it Escapes**.
**H(+2):** +1d6 per Strike.
> *Rank 10: +5d6 (17.5) per Strike, plus a grab a martial otherwise has to buy with an Athletics
> action and a MAP increase.*

**Fourth Form: Twin-Headed Reptile** — *feat 12* · 1 BP · **2 actions**, flourish · base rank 6
*(Shi no kata: Keija Sōsei — literally "twin-born neck serpents." "The user leaps forward and
performs a horizontal slash that slices through the target," visualised as a **two-headed snake**.)*
Leap up to your Speed (you have a fly Speed for this movement and must land), then release the twin
heads: make one nichirin Strike each against **two different creatures** within your reach at any
point along the leap (your multiple attack penalty applies to the second — **−4**). Each hit deals
**+3d6 slashing**.
Each creature you hit must succeed at a **Fortitude save** against your class DC or be **stunned 1**
(**incapacitation**).
**Any creature reduced to 0 Hit Points by this Form is beheaded.** It dies immediately, and effects
that would let it regenerate, reconstitute, or return to life at 0 Hit Points do not function.
**H(+2):** +1d6 per Strike.
> *Rank 10: +5d6 (17.5) per Strike across two bodies, plus a stun on each.*
> *The two Strikes are the polycephaly the wiki describes; the name means "neck," and beheading is
> the only thing that reliably kills a demon. Mechanically the clause is nearly free against ordinary
> monsters — they die at 0 anyway — and decisive against exactly what this class exists to hunt.
> Anchor: `All Shall End in Flames` (kineticist 18) kills outright anything it drops to 0.*

**FINAL FORM — Fifth Form: Slithering Serpent** — *feat 20* · 1 BP · **3 actions**, flourish · **Frequency once per 10 minutes**
*(Go no kata: En'en Chōda. "The user charges forth in a twisting and winding motion, curving their
sword in multiple directions to slice one or multiple targets with multiple slashes. This technique
is **capable of decapitating several enemies at once**." In the final battle Obanai fought on after
Muzan took his eyes, reading the field through Kaburamaru alone; that is what this Form is.)*

Close your eyes and give yourself to the serpent's path. Move up to **double your Speed** along any
route you choose — it need not be straight. This movement doesn't trigger reactions and can pass
through creatures' spaces.

Make one nichirin Strike against **each creature** whose space you passed through or moved adjacent
to, to a maximum of **five Strikes**. Your multiple attack penalty increases as normal after each
(**−4/−8**, from your stance). Each Strike deals **+4d6 slashing**.

**Any creature reduced to 0 Hit Points by this Form is beheaded**, exactly as Twin-Headed Reptile.

Throughout, you fight blind and it costs you nothing: for the duration you **ignore concealment**, you
can **target hidden and undetected creatures with no flat check**, and you **cannot be made
off-guard**.

**Self-cost:** senses pushed that far come back raw. You are **blinded until the end of your next
turn**, and then **dazzled for 1 minute**.
> *Five Strikes at −0/−4/−8/−8/−8 across up to 200 feet of weaving movement, each beheading whatever
> it drops. Anchor: `Impossible Flurry` (ranger 18) is **six** Strikes at −0/−5/−10 for three actions,
> **free, at-will, no self-cost, and single-target**. Ours reaches five separate bodies and ends them
> permanently, so it pays a Breath Point, a frequency, and a round of blindness.*

---
## 6 — Rank-10 audit: the monotonicity check

All values at **level 20 / rank 10**, all costing **1 Breath Point**. "Strike" means a full nichirin
Strike lands on top of the listed bonus.

| Style | First | Second | Third | Fourth | Final (1/10 min) | Monotonic? |
|---|---|---|---|---|---|---|
| **Water** | Strike +5d6 / +5d8 (17.5–22.5) | Stride + Strike +7d6 (24.5), off-guard | reaction: −22 damage, riposte +5d6 | 13d6 (45.5) emanation, pull + Step-lock | 5 counters: damage reduction that spills onto the attacker, **or** 5 MAP-free Strikes | ✅ |
| **Flame** | Strike +5d6 + 5d4 persist (30.0)\* | Stride + Strike +7d6 (24.5), off-guard | reaction: res 25, 5d6 all-round | 2 Strikes +4d6 ea. + locked frightened 2 | 13d6 line + Strike + unquenchable fire | ✅ |
| **Thunder** | charge + Strike +6d6 (21.0) | 7d12 cone (45.5) | Strike +6d6 (21.0), Speed −10, stun on crit | 3 lines × 7d6 (24.5–49.0) + stun | 4d12 path + Strike +6d12 + stun 2 | ✅ |
| **Wind** | 11d6 cone (38.5), **1 action** | Strike +7d6 (24.5) + immobilize on crit | reaction: res 15, 5d6 all-round | 13d6 (45.5) emanation, anti-fly, prone | 13d6 path + Strike +4d6 + prone-lock | ✅ |
| **Stone** | Strike +5d6 + free Shove | Strike +7d6, **1 action** (gated), party off-guard | res 10 all physical, 1 minute | 13d6 (45.5) **Fort** cone + immobilize | 4 Strikes +2d8 ea. + res 15 fortress | ✅ |
| **Sound** | Strike +5d6 + reaction denial | 10d8 (45.0) **Fort** emanation | 11d6 (38.5) burst @30 ft + blind | 2 Strikes +4d6 ea. + stupefied 2 + slow | 4 Strikes +4d6 ea. + stun + 4d6 chord | ✅ |
| **Flower** | reaction: +2 AC, off-guard, +1 atk | Strike +7d6 (24.5), conditional off-guard | 2 Strikes +5d6 ea. + sticky bleed | 2 Strikes +4d6 ea., party off-guard ×2 | +2 AC/Ref/atk 1 min, free off-guard | ✅ |
| **Mist** | Strike +5d6 + dazzled | 2 Strikes +5d6 ea., ignores circ AC | 11d6 (38.5) + 4d6 zone @30 ft | 2 Strikes +4d6 ea. + disengage + hidden | 20-ft mobile cloud, 1 min, −2 enemy atk | ✅ |
| **Moon** | Strike +5d6 + movement tax | 13d6 (45.5) cone + bleed | 11d6 (38.5) line + grabbed | 13d6 (45.5) cone + prone + 4d6 zone | 16d6 (56.0) 40-ft cone + 6d6 lingering | ✅ |
| **Love** | Stride + Strike +5d6, ignores cover | 2 Strikes +5d6 ea. (35.0) + bleed | 11d6 (38.5) burst @30 ft + leap, anti-air | 13d6 (45.5) burst **@60 ft**; 17d6 + immobilize while Marked | 4 Strikes +4d6 ea. + restrain + party temp HP | ✅ |
| **Serpent** | Step + Strike +5d6, self off-guard | Stride + Strike +7d6 (24.5), off-guard, crit enfeebled 2 | 2 Strikes +5d6 ea. (35.0) + grabbed | 2 targets, +5d6 ea. + stun + **behead** | 5 Strikes +4d6 ea. + behead + blind-fighting | ✅ |

\* *Flame's First Form out-damages its Second on raw numbers because of the persistent fire. The
Second Form buys 25 feet of vertical movement, self-supplied off-guard, and a crit knockdown, and
persistent damage of the same type doesn't stack — so the two are not additive, and the Second Form
is the better action in any fight lasting more than one round.*

**External sanity check, rank 10, all at 1 Focus Point:**

| Comparison | Them | Best Breath Slayer answer |
|---|---|---|
| Best 2-action area | `Dragon Breath` **66.5** (sorcerer, 30-ft cone) | Rice Spirit / Pearl Flowers / Moon Spirit **45.5** |
| Best martial-with-focus area | `Pulverizing Wake` Strike +3d8 **and** 11d8 = **49.5** (ranger **9**) | Fourth Forms **45.5** + a hard condition |
| Best 1-action area | `Qi Blast` **31.5** (monk 1, 15-ft cone) | Dust Whirlwind Cutter **38.5** in a 20-ft cone |
| Best 1-action Strike rider | `Inner Upheaval` **+3d6**, doubled by Flurry | First Forms **+5d6**, single Strike |
| At-will AoE floor | `Blazing Wave` **42.0 every round** (kineticist **4**) | 3 Forms per encounter + Concentrated Breathing |
| Capstone | `Impossible Flurry` **6 Strikes, free, at-will** (ranger 18) | Arcs of Justice **4 Strikes**, 1 BP, 1/10 min, Speed 0 |

The class now lands where a martial-with-a-focus-pool should: **above the monk's per-cast numbers,
below the full casters', and permanently behind the kineticist on sustained output** — which is the
correct shape, because the Breath Slayer also has a full martial's Strike routine and, from level 1,
a per-Strike damage rider the kineticist does not get.

---


## 7 — Class feats

*Design rules: an anchor is cited for every feat (±2 levels), and **feats sit outside the BCS 2100
budget** — the 2100 in §2 buys the chassis and the class features only, exactly as it does for every
published class.*

**What v4 changed.** Breath Point pool growth moved entirely onto the chassis, so **no feat grants
pool**. Five feats were deleted outright because the chassis now does their job:

| Old feat | Fate |
| :---- | :---- |
| Feat 1 **Focused Breathing** | → chassis 1 |
| Feat 4 **Second Form** | → chassis 5 |
| Feat 8 **Rapid Concentration** | **Deleted.** Obsoleted by `Total Concentration` at 12; its `Battle Breathing` alternative survives as a standalone feat 8 |
| Feat 10 **Mark Precursor: Crimson Blade** | → absorbed into chassis 9 (`Nichirin Resonance`) |
| Feat 18 **Perfect Slayer's Focus** | → chassis 12 (`Total Concentration`) |

**The feat tax, before and after:**

| Build | v3 slots spent on the Form ladder | v4 slots |
| :---- | :---- | :---- |
| Single-style | 5 (feats 1 / 4 / 8 / 12 / 20) | **3** (feats 8 / 12 / 20) |
| Full multi-style | 10 of ~11 | **8 of 11** |

---
### 7.1 The Form ladders

#### Primary ladder

| Source | Lvl | Grants | Pool |
|---|---|---|---|
| **Chassis: Focused Breathing** | 1 | Primary style's **First Form** | 1 |
| **Chassis: Second Breath** | 5 | Primary's **Second Form** | 2 |
| **Chassis: Nichirin Resonance** | 9 | — | 3 (cap) |
| **Feat: Third Form** | 8 | Primary's third listed form | — |
| **Feat: Fourth Form** | 12 | Primary's fourth listed form | — |
| **Feat: Hidden Form** | 20 | Primary's **Final/Forbidden Form** | — |

#### Secondary ladder *(requires Flowing Stance Shift, feat 4)*

| Feat | Lvl | Grants | Prerequisite |
|---|---|---|---|
| **Borrowed Form** | 6 | Secondary style's **First + Second Form** | Flowing Stance Shift |
| **Adopted Form** | 10 | Secondary's third form | Borrowed Form; primary **Third Form** |
| **Assimilated Form** | 14 | Secondary's fourth form | Adopted Form; primary **Fourth Form** |

*Borrowed Form grants two forms because a single low-rank form at level 6 underpays the slot (anchor:
`Multifarious Muse`-style versatility feats), and because both of those rungs are now free on the
primary ladder anyway. The primary-ladder prerequisites still enforce "your true style leads."*
**No slayer ever learns a second Final Form**, and no feat on this ladder grants pool.


### 7.2 The feat list

#### Level 1

**Slayer's Conditioning** — *Anchor: Fleet*
+5-foot status bonus to Speed while in a Breathing Stance and wearing no heavier than light armor.

**Demon Lore** — *Anchor: Monster Hunter (ranger 1)*
Trained in Demon Lore (or Fiend/Undead Lore, GM's call). When you Recall Knowledge about a fiend or
undead, a success also reveals one weakness or resistance; a critical success also reveals its lowest
save.

**Water-Wheel Footwork** — *Anchor: Nimble Dodge (rogue 1)*
**Reaction.** *Trigger:* You are targeted by a melee attack while in a stance. You gain a +2
circumstance bonus to AC against the triggering attack.

**Deep Breath** — *Anchor: small recovery utility, feat 1 tier*
**Frequency** once per 10 minutes. 1 action: gain temporary Hit Points equal to half your level
(minimum 1) for 1 minute, and attempt an assisted flat check (DC 10) to end one source of persistent
bleed on yourself.

**Flowing Step** — ✦ NEW — *Anchor: a once-per-round 5-foot upgrade; strictly below `Nimble Roll` (rogue 8)*
Once per round while in a Breathing Stance, your Step covers **10 feet** instead of 5.
*(Fills the slot vacated by Focused Breathing. Every Breathing Style rewards footwork; this is the
cheapest way to buy into that at level 1 without touching damage.)*

---

#### Level 2

**Nichirin Draw** — *Anchor: Quick Draw (rogue/ranger 2)*
Draw your nichirin blade and Strike as a single action. If you were hidden or undetected by the
target, the Strike deals +1d6 precision damage (once per combat).

**Slayer's Senses** — *Anchor: sense feats, investigator/rogue 2 tier*
Choose smell or hearing. **Smell:** imprecise scent, 30 feet. **Hearing:** within 15 feet, dim-light
concealment doesn't apply against you. You can take this feat twice (second time at 6th level) for
both.

**Guard Break** — *Anchor: Snagging Strike (fighter 1), taxed one level for stance synergy*
While in a stance, make a Strike; on a hit the target is off-guard against the next attack made
against it before the start of your next turn.

**Twin-Blade Discipline** — ✦ MOVED from feat 6, flourish removed — *Anchor: Double Slice (fighter 1)*
**Requirement:** You are wielding a nichirin blade in each hand and are in a stance.
2 actions: Strike once with each blade. Both Strikes use your current multiple attack penalty, then
your MAP increases as though you had made one Strike.
> *v3 charged **five levels** of tax over `Double Slice` and then bolted a flourish tag on top, which
> blocked it from combining with any other flourish. One level of tax for the stance synergy is
> enough; the flourish tag is gone.*

---

#### Level 4

**Flowing Stance Shift** — *Anchor: versatility feats; strictly weaker than Stance Savant (monk 12)*
Learn a second Breathing Style's **stance only** — no style rider, no granted skill. This opens the
secondary Form ladder (Borrowed / Adopted / Assimilated Form at 6 / 10 / 14). Entering any stance
costs 1 action as normal.

**Breath-Enforced Blade** — *Anchor: Ki Strike's damage-type flexibility*
While in a stance, your nichirin Strikes can deal your style's damage type instead of the weapon's,
chosen per Strike. With a secondary stance active, use that style's type.
*(Note: chassis **Nichirin Resonance** at 9th level supersedes this for most purposes by adding
spirit. This feat is the level-4 down payment.)*

**Anticipate Lunge** — *Anchor: `Stand Still` (monk 4). Note that fighters and champions get
`Reactive Strike` — a broader trigger, and it doesn't count toward MAP — at **level 1**.*
**Reaction.** *Trigger:* A creature within your reach Strides, Steps, or Flies away from you while
you're in a stance. Make a nichirin Strike against it.

**Cutting Gale** — ✦ MOVED from feat 8 — *Anchor: Swipe (fighter/barbarian **4**)*
2 actions, flourish. Make one nichirin Strike against each of two adjacent enemies. Your multiple
attack penalty increases only after both Strikes resolve.
> *v3 claimed "heavily discounted `Whirlwind` (fighter 14)." The real anchor is `Swipe` at level 4 —
> and Cutting Gale is already better than Swipe, because it rolls two attacks instead of one. Sitting
> it at 8 made it four levels late for something strictly stronger than a level-4 feat.
> The `Whirlwind Strike` version now exists properly, at 14, as **Whirling Gale**.*

---

#### Level 6

**Borrowed Form** — *(secondary ladder; see §7.1)*

**Flowing Water Counter** — ✦ TRIGGER NARROWED — *Anchor: Dueling Riposte (fighter 8)*
**Reaction.** *Trigger:* A melee Strike against you **critically fails** while you're in a stance.
Step, then Strike the triggering creature at your current multiple attack penalty.
> *v3 triggered on **fail or critical fail**, two levels earlier than `Dueling Riposte`, and threw in
> a free Step. This was the one place the document was over-generous. The wider trigger now costs a
> feat of its own — **Perfected Water Counter**, level 12.*

**Twin-Blade Discipline** *(if not taken at 2)* — see Level 2.

**Scent of Blood** — *Anchor: Blind-Fight (fighter 8), discounted for narrow scope*
**Prerequisite:** Slayer's Senses (smell). Creatures below half Hit Points within your scent range
are automatically detected unless they mask their scent.

**Ragged Breath** — ✦ NEW — *Anchor: `Retributive Focus` (champion 18), `Surging Focus` (cleric 8), `Linked Focus` (wizard 4)*
**Frequency** once per day. **Requirement:** You have **0 Breath Points** and are in a Breathing
Stance. 1 action: draw a shuddering breath and regain **1 Breath Point**.
> *Every "regain 1 Focus Point" feat in the game is **once per day**, from wizard 4 through champion
> 18 — and `Retributive Focus` carries the same empty-pool requirement this feat does. Level 6 with
> a once-per-day frequency sits inside that band. Fills the slot Twin-Blade Discipline vacated, and
> answers the balance analysis's finding that the class's sustained floor collapses to zero the moment
> the pool is dry.*

---

#### Level 8

**Third Form** — *(primary ladder)*
Learn your primary style's third listed form.

**Battle Breathing** — *Anchor: focus-economy feats at the 8–12 tier*
You gain a +1 circumstance bonus to the attack roll or DC of the **first Form you use in each
combat**.
> *v3's `Rapid Concentration` (2 points back on Refocus) is deleted — chassis **Total Concentration**
> at 12 returns the whole pool, so a partial-recovery feat at 8 is a trap that stops mattering four
> levels later.*

**Cutting Gale** *(if not taken at 4)* — see Level 4.

**Unshakeable Core** — *Anchor: save-rider feats at 8*
A success on a Will save against a fear effect is a critical success instead. While in any Breathing
Stance, allies within 10 feet gain a +1 circumstance bonus to saves against fear.

**Suffocating Pressure** — ✦ NEW — *Anchor: `Demoralize` / `Intimidating Glare`, upgraded to class DC*
**Frequency** once per round. 1 action (concentrate, emotion, fear, mental). While in a Breathing
Stance, choose one creature within 30 feet that can see you. It attempts a Will save against your
class DC.
- **Failure** It is frightened 1.
- **Critical Failure** It is frightened 2 and can't reduce its frightened value below 1 until the end
  of your next turn.

If the creature was **already frightened** when you used this action, it is also **off-guard to you**
until the end of your next turn, regardless of its save.
> *A pure-condition feat: no damage, and it feeds Concentrated Breathing and the Flower/Thunder
> riders by manufacturing off-guard without a flanking partner.*

---

#### Level 10

**Adopted Form** — *(secondary ladder)*

**Total Concentration: Battle Trance** — *Anchor: focus-economy, monk 10–12*
**Frequency** once per day. When you roll initiative, regain 1 Breath Point (up to your maximum).

**Read the Opening** — *Anchor: Devise-a-Stratagem-adjacent economy*
1 action. Choose one enemy you can see. Your next nichirin Strike against it this turn gains a +1
circumstance bonus to the attack roll (+2 if you have hit it with a Form this combat).

**Twin-Blade Cascade** — ✦ NEW — *Anchor: the analysis's own "leave it at 6 and let it make three Strikes"*
**Prerequisite:** Twin-Blade Discipline.
Twin-Blade Discipline becomes **3 actions** and makes **three** Strikes, alternating blades. All three
use your current multiple attack penalty, then your MAP increases as though you had made one Strike.
> *`Impossible Flurry` (ranger 18) is six Strikes for three actions, free and at-will. Three Strikes
> at flat MAP for three actions, gated behind a feat, sits comfortably at 10.*

---

#### Level 12

**Fourth Form** — *(primary ladder)*
Learn your primary style's fourth listed form.

**Stance Savant** — *Anchor: `Reflexive Stance` (monk 12) — identical effect, identical level*
**Trigger:** You roll initiative. Enter a Breathing Stance you know.
> *v3 cited "Stance Savant (monk 12)". No feat by that name exists in the Remaster; the feat that
> does exactly this, at exactly this level, is `Reflexive Stance`. The homebrew name is kept.*

**Persistent Ember** — *Anchor: Bloody Debilitation-tier persistent riders*
**Prerequisite:** Flame, Thunder, or Moon style (primary or secondary). Your Forms' persistent damage
dice increase one step, and a creature taking your style's persistent damage at the start of its turn
is off-guard to you until the end of your next turn.
> *Ruling for v4: this increases the **die size** of persistent damage from Forms. It does **not**
> apply a second time to the Flame stance's flat per-die persistent fire.*

**Resonant Opening** — *Anchor: debuff-extension feats at 10–12*
**Prerequisite:** Sound, Flower, Mist, or **Serpent** style (primary or secondary). When one of your
Forms makes a creature off-guard, dazzled, or deafened, that condition lasts 1 additional round. Once
per creature per combat.
> *v4.1 adds Serpent, whose entire ladder is built on manufactured off-guard — First Form supplies it
> on a Step, Second Form supplies it outright, Coil Choke supplies it until the target Escapes.
> Love is deliberately **not** on this list: its rider points at your allies, so its natural feat
> partners are `Unshakeable Core` (8) and `Selfless Guard` (16) instead.*

**Perfected Water Counter** — ✦ NEW — *Anchor: `Dueling Riposte` (fighter 8) widened four levels later*
**Prerequisite:** Flowing Water Counter.
Flowing Water Counter's trigger widens to **any melee Strike against you that fails or critically
fails**, and the riposte Strike does not increase your multiple attack penalty.

---

#### Level 14

**Assimilated Form** — *(secondary ladder)*

**Transparent World** — *Anchor: Blind-Fight fully online + an info rider; upgrades the L11 chassis feature*
Your Transparent World Glimpse works continuously while you're in a stance: you ignore concealment
entirely, and invisible creatures are merely hidden to you. Once per round, when you hit a creature,
you learn its remaining HP category (healthy / bloodied / near death).

**Two-Style Flow** — *Anchor: strictly weaker `Fuse Stance` (monk 20) precursor*
**Prerequisite:** Flowing Stance Shift. Once per round, swap between your two known stances as a free
action.

**Whirling Gale** — ✦ NEW — *Anchor: `Whirlwind Strike` (fighter/barbarian **14**), exact parity*
**Prerequisite:** Cutting Gale.
3 actions, flourish. Make one nichirin Strike against **each enemy within your reach**. Your multiple
attack penalty increases only after all the Strikes resolve.
> *This is what v3's Cutting Gale claimed to be. It now exists, at the level `Whirlwind Strike`
> actually sits.*

> ⚠ **Slot congestion note (carried over from v3):** the full multi-style build wants Assimilated
> Form *and* Two-Style Flow at 14 and can only take one. This is deliberate — the dual-style path is
> supposed to cost something — but flag it to your players at level 4, when they commit.

---

#### Level 16

**Selfless Guard** — *Anchor: champion-reaction / Bodyguard tier at 14–16*
**Reaction.** **Frequency** once per 10 minutes. *Trigger:* An ally within your Speed is targeted by
an attack you can see. Stride to the ally; if you end your movement adjacent to them, you become the
target of the attack instead.

**Breath of Endurance** — *Anchor: physical-perfection tier (monk 16)*
You age slowly, need only 4 hours of sleep, and gain a +2 circumstance bonus to Fortitude saves
against fatigued and drained effects. At half Hit Points or lower, you gain resistance to bleed
damage equal to half your level.
> *Ruling: Final/Forbidden Form self-costs are **unavoidable** and unaffected by this feat. That
> includes Moonbow's drained, Rengoku's fire damage, and Equinoctial Vermilion Eye's blindness.*

**Slayer's Reprisal** — ✦ NEW — *Anchor: `Furious Vengeance` (barbarian **16**), exact level parity*
**Reaction.** **Frequency** once per 10 minutes. *Trigger:* An ally within 30 feet is reduced to 0
Hit Points, or a creature within your reach critically hits you, while you're in a Breathing Stance.
**Effect:** Use a Form you know that takes 1 or 2 actions, spending a Breath Point as normal. You
can't use a Final/Forbidden Form this way.
> *`Furious Vengeance` is free, at-will, and unlimited, but triggers only on a critical hit against
> you and only yields one Strike. Ours has the broader trigger and yields a whole Form, so it pays
> with a Breath Point and a once-per-10-minutes frequency.*

---

#### Level 18

**Awakened Mark** — *Anchor: Exalt-tier chassis upgrade*
**Prerequisite:** Demon Slayer Mark. At half Hit Points or lower your Mark manifests: you gain
**both** Mark benefits (+10-foot status bonus to Speed **and** the once-per-day free Form), and your
Forms' status bonuses increase by 1.
> *Updated for v4: the free-Form benefit now costs nothing rather than "2 FP," since no Form costs 2
> points any more. It still cannot be applied to a Final/Forbidden Form.*

**Unbroken Cadence** — ✦ NEW — *Anchor: `Impossible Flurry` (ranger 18) sets the level-18 ceiling*
You can use **two actions with the flourish trait** in the same turn instead of one. You still can't
use the same Form twice in a turn.
> *Powerful, and correctly priced: every flourish Form still costs a Breath Point, so the pool caps
> what this can do to three Forms in an encounter.*

**Breath of the Departed** — ✦ NEW — *Anchor: level-18 last-stand effects; genre-defining*
**Frequency** once per day. **Trigger:** You are reduced to 0 Hit Points while in a Breathing Stance.
**Effect:** Before you fall unconscious, use a Form you know that takes 1, 2, or 3 actions. You spend
a Breath Point if you have one; **if you have none, you use the Form anyway**. Then the triggering
effect resolves as normal.
> *This is the only place in the class where a Form fires on an empty pool, and it costs a feat at
> 18, a once-per-day frequency, and being at 0 HP.*

---

#### Level 20

**Hidden Form** — *(the capstone; see your style's Final/Forbidden Form in §5)*
**Prerequisite:** Fourth Form. Learn your primary style's **Final/Forbidden Form** (1 Breath Point,
once per 10 minutes, with its style's self-cost).

**Breath of the First** — *Anchor: Fuse Stance (monk 20)*
**Prerequisite:** Two-Style Flow. Merge your two stances into a single named stance of your creation
with both stances' benefits and both styles' damage types. You count as being in both styles' stances
for Forms and feat prerequisites.

---

### 7.3 Complete feat table

| Lvl | Feats available |
|---|---|
| 1 | Slayer's Conditioning, Demon Lore, Water-Wheel Footwork, Deep Breath, **Flowing Step** ✦ |
| 2 | Nichirin Draw, Slayer's Senses, Guard Break, **Twin-Blade Discipline** ↓ |
| 4 | Flowing Stance Shift, Breath-Enforced Blade, Anticipate Lunge, **Cutting Gale** ↓ |
| 6 | *Borrowed Form*, Flowing Water Counter ⚖, Scent of Blood, **Ragged Breath** ✦ |
| 8 | **Third Form**, Battle Breathing, Unshakeable Core, **Suffocating Pressure** ✦ |
| 10 | *Adopted Form*, Battle Trance, Read the Opening, **Twin-Blade Cascade** ✦ |
| 12 | **Fourth Form**, Stance Savant, Persistent Ember, Resonant Opening, **Perfected Water Counter** ✦ |
| 14 | *Assimilated Form*, Transparent World, Two-Style Flow, **Whirling Gale** ✦ |
| 16 | Selfless Guard, Breath of Endurance, **Slayer's Reprisal** ✦ |
| 18 | Awakened Mark, **Unbroken Cadence** ✦, **Breath of the Departed** ✦ |
| 20 | **Hidden Form**, Breath of the First |

**Bold** = primary Form ladder · *Italic* = secondary (multi-style) ladder · ✦ new in v4 ·
↓ moved down a tier in v4 · ⚖ rebalanced in v4.

**Deleted in v4:** Focused Breathing (→ chassis 1), Second Form (→ chassis 5), Rapid Concentration
(obsolete), Mark Precursor: Crimson Blade (→ chassis 9), Perfect Slayer's Focus (→ chassis 12).


## 8 — Playtest & GM notes

### 8.1 Feats — audit summary

- **The feat tax is fixed.** A single-style slayer now spends **3** of 11 feat slots on the Form
  ladder instead of 5, and the class is playable out of the box without a pre-committed build. This
  brings the Breath Slayer into line with your own Saint ledger, where six Techniques are chassis
  features and every feat slot stays free.
- **The class has a floor.** `Concentrated Breathing` means a Breath Slayer with an empty pool is
  still contributing +8/+12/+16 per Strike at 4 weapon dice, instead of contributing nothing. That
  was the single largest gap against the five high-DPR builds.
- **Focus economy matches the monk.** Full-pool Refocus at 12 (`Meditative Focus` parity, not six
  levels late), a `Qi Center` analogue at 15, and an in-combat emergency point at feat 6.
- **Resistance is answered on the chassis, at 9.** Every style's damage type — slashing, fire,
  electricity, sonic — is commonly resisted at high level. Spirit damage on demand solves it in one
  line, fits the demon-slaying fantasy exactly, and costs no feat.
- **Level 20 is still a genuine choice** between the two capstone fantasies: your style's ultimate
  technique (**Hidden Form**) or transcendent dual-style mastery (**Breath of the First**). A slayer
  cannot have both.
- **The full multi-style build** now costs **8 of 11 slots** (down from 10): Flowing Stance Shift +
  Borrowed + Adopted + Assimilated + primary Third + primary Fourth + Two-Style Flow + Breath of the
  First. It still forgoes the Final Form, and it still collides with itself at 14 — deliberately.
- **Secondary Form feats still grant no pool**, and neither does anything else outside the chassis,
  so per-encounter output is hard-capped at **3 Forms** regardless of how many forms are known.

### 8.3 Feats — playtest watch list

1. **Unbroken Cadence** (18) — two flourishes per turn is the biggest action-economy swing in the
   class. It is pool-limited, but watch it alongside `Awakened Mark`'s free Form.
2. **Suffocating Pressure** (8) — off-guard on demand against an already-frightened target is a
   strong enabler for `Concentrated Breathing` and the Flower/Thunder riders. If it trivialises
   flanking at your table, restrict the off-guard clause to once per creature per combat.
3. **Ragged Breath** (6) and **Battle Trance** (10) are both once-per-day single-point recoveries and
   stack cleanly. A slayer with both, plus chassis Total Concentration at 12, has a lot of pool
   economy for a martial — verify at your table that the ceiling is "5 Forms in the hard fight of the
   day," not "5 Forms every fight."
4. **Twin-Blade Cascade** (10) — three Strikes at flat MAP for three actions. Compare against a
   Flurry ranger's turn at the same level before ruling on it.
5. **The level-14 collision** between `Assimilated Form` and `Two-Style Flow`. If your table finds it
   punishing rather than interesting, the cleanest fix is moving `Two-Style Flow` to 16.
### 8.2 Forms — playtest watch list

1. **Equinoctial Vermilion Eye** — a 1-minute +2-status omnibuff is still the strongest single effect
   in the class. The blindness has to bite; if your table has easy blindness removal, add "this
   blindness can't be removed by effects of a rank lower than 8."
2. **Dead Calm's Stillness counters** — five, spendable either way, once per 10 minutes for two
   actions. Two things to watch. First, the **hit** mode needs no attack roll, so against a boss with
   one big Strike a slayer can dump all five and turn the whole blow into damage on the attacker;
   that is intended, but check it against your own boss maths before level 20. Second, at tables that
   run many-weak-enemy encounters the **miss** mode is five MAP-free Strikes inside a single enemy
   round — if that dominates, cut the counters to four rather than touching either mode.
3. **Moon's Borrowed Light** — the first style rider that pays out to somebody else. In a party with
   one Breath Slayer it is one ally's Strike per round at +1 precision per die, which is fine. In a
   Corps campaign with three or four slayers it fires for **all of them**, and the concealment clause
   fires for the whole party at once. If that outruns your table the fix is to drop *Lend the light*,
   not the precision value — the rider is supposed to be strongest exactly where the flavour says it
   should be.
4. **Wind's Dust Whirlwind Cutter** at 11d6 for one action is the deliberate outlier. If it dominates
   play, the fix is `1d6` base with `H(+1) +1d6` (10d6 / 35.0), not a cone-size cut.
5. **Moonbow's unstoppable bleed** and **Rengoku's unquenchable fire** are intentionally hard to
   remove. Watch them against solo bosses, where 4d6 persistent for the rest of the fight is worth
   far more than its printed average.
6. **Volcanic Rock's immobilize** on a basic **Fortitude** save is the best control in the book, on
   the defence fewest monsters dump. If it over-performs, restrict the immobilize to critical
   failures by creatures of your level or lower.
7. **Flame's stance persistent damage** interacting with `Persistent Ember` (feat 12) — check at your
   table that the die-step increase and the stance's flat scaling aren't being applied twice.
8. **Serpent's beheading clause** (Twin-Headed Reptile, Slithering Serpent). Against ordinary
   monsters it changes nothing. Against a regenerating boss, a troll, or anything with a
   return-at-0-HP ability it is decisive — which is the point, but confirm your GM is happy for a
   feat-12 Form to be the party's hard answer to regeneration.
9. **Love's Marked Wildclaw** at 17d6 (59.5) plus an immobilize. It is gated on the Demon Slayer Mark
   being active, which is a chassis state, not a resource — so at the levels where the Mark is
   reliably on, treat 59.5 as the real number, not the exception. If that outruns your table, drop
   the Marked bonus to +2d6.
10. **Beloved of the Corps** — one of the two outward-facing style riders, alongside Moon's
   `Borrowed Light`. Watch it beside a Flurry ranger or a Ruffian rogue, where +1 to attack and
   damage is multiplied across three or four Strikes a round rather than one. A party carrying
   **both** a Love slayer and a Moon slayer stacks +1 attack / +1 damage with +1 precision per die
   on the same ally Strike; that is legal, and it is the strongest support line the class can build.
11. **Serpent has no area Form at all.** That is deliberate, but it means a Serpent slayer contributes
    nothing to a many-weak-enemy encounter beyond ordinary Strikes. Confirm the player knows this
    before they commit at level 1; the fix, if they want one, is Flowing Stance Shift into Wind.

### 8.4 GM notes for this guide

- **The pool is the spike, the rider is the floor.** Three Forms per encounter, forever, at every
  level. If a player is disappointed by that, point at `Concentrated Breathing`: their empty-pool
  turn is still +8/+12/+16 per Strike.
- **Everything checks "in a Breathing Stance."** Entering a stance is the first action of the first
  turn until 12th level (`Stance Savant`) and stops mattering at 19th
  (`Constant Total Concentration`). A GM who opens fights with the party split or surprised is
  taxing this class harder than any other; do that on purpose or not at all.
- **Will is the hole.** Expert at 3rd and never again. Dominate, confusion and fear land on this
  class. That is the price of Master Perception at 7th and Master Reflex at 7th.
- **Spirit damage from 9th is not optional flavour.** It is the answer to a genre where everything
  the class fights resists physical damage. Do not house-rule it away without replacing it.
- **The Demon Slayer Mark is an emergency, not a mode.** Once per 10 minutes, on a real trigger.
  If your table wants the canonical price — a marked slayer dies at twenty-five — put it on the
  calendar, not in the stat block.
- **Two Final Forms is never legal.** `Hidden Form` (feat 20) is your *primary* style's Final Form,
  and the secondary ladder ends at Fourth Form by design. A slayer picks one capstone fantasy:
  their style's ultimate technique, or transcendent dual-style mastery (`Breath of the First`).
- **Style choice is a sidegrade, not a power choice** — with two documented exceptions to warn
  players about at level 1: **Serpent has no area Form anywhere in its ladder**, and **Wind's
  1-action First Form is the deliberate outlier** at 11d6.
- **Moon and Love recommend different key abilities.** Stone and Love read better with Strength;
  Serpent's stance grants finesse and plays as a Dexterity style.

---

## Appendix — the system in one block

```
CHASSIS 1410 + FEATURES 690 = 2100   (BCS 1.4; feats are outside the budget)

PROFILE: Martial HP + Martial Fortitude + Martial-Skilled Perception/Reflex,
         with Reflex stopping at Master and armour stopping at Expert to pay for it.

Forms have NO RANK. They auto-heighten to half your level, rounded up.
Every Form costs exactly 1 BREATH POINT. Pool: 1 @ L1 · 2 @ L5 · 3 @ L9. Cap 3, forever.

Base rank by tier:  First 1 · Second 2 · Third 4 · Fourth 6 · Final 10
Acquired at:        chassis 1 · chassis 5 · feat 8 · feat 12 · feat 20

Throttles:  the 3-point pool (every Form)
            frequency 1/10 min  (Final Forms only)
            a lasting self-cost (Final Forms only)
            requirement clauses (individual Forms above their tier)

Rank-10 targets:  1-action Strike rider  +5d6      2-action Strike rider  +7d6
                  two Strikes            +5d6 ea.  1-action cone          11d6
                  2-action cone/emanation 13d6     line / burst           11d6
                  Fourth Form            13d6 + a hard condition
                  Final Form             13d6+ area, or 4 Strikes, or a 1-min omnibuff

Floor:  Concentrated Breathing +2/die (L1) → +3 (L9) → +4 (L17), unconditional.
Focus:  full-pool Refocus at L12. Free 1-action Form 1/min at L15. +1 BP on initiative at L19.
Saves:  Fort M@9 · Ref M@7 · Will E@3 and never again.
Class DC (Slayer DC): T@1 / E@9 / M@17.
```

---

*Breath Slayer, guide v4 — assembled from Breath Slayer Class Feats v4.1, Breathing Forms Compendium
v4.1, the balance analysis and the v4 changelog, and costed against BCS 1.4. Companion to The Saint,
Gold Cloth guide v4.*

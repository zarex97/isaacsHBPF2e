# Soulbound — PF2e Class Guide, **Version 1.4**

### *Bleach · ブリーチ · Shinigami / Arrancar / Quincy edition*

*The complete, self-contained class. One chassis, **three Lineages** (Soul Reaper, Hollow, Quincy),
**fifteen** canon-grounded Spirits with their full release ladders, the Kidō list, and the feat
compendium — no cross-referencing. Companion to **The Saint** (Gold Cloth guide v4) and
**The Breath Slayer** (guide v4.2), and costed on the same **2100-point** budget.*

**Sources folded in:** the `soul-reaper-class.md` prototype supplied by the repository owner;
**BCS 1.4** (`Docs/homebrewing/BCS 1.4 (current) _ Balanced Core System.xlsx`) for every point value;
live PF2e system data from `pf2e_fork/packs/pf2e` for every mechanical anchor; and the Bleach primary
wiki for every named technique. Where the prototype left a decision open — its §12, "Open Questions
For You" — this guide makes the call and says which way it went, in **§13**.

**What changed in v1.4:**

*This is the first version written **after** the class was built and played in Foundry. Every change
below came from the implementation disagreeing with the text, and the module now matches this document
exactly. The full account, with what was found and how, is in
`Docs/soulbound-automation-programme.md`.*

1. **§3.2's feat levels are one list, not two.** The table printed "soul reaper feat" on the even
   levels beside "soulbound feat" at 1/10/20 — prototype naming from before the rename in v1.1. There
   are **eleven class feats**: levels 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20.
2. **§4.1's Great Blade is "two-handed" in the usage line, not as a trait.** Pathfinder has no
   `two-handed` trait; a weapon that is only ever two-handed says so in how it is held, exactly as the
   greatsword does. The statistics are unchanged: **1d10 slashing, sweep**.
3. **§4.1's Voice in the Blade names what it covers.** "Effects that would control you, possess you, or
   force you to release your weapon" is not a category Pathfinder models. The bonus applies to
   **possession** and **mental** effects, and to anything the GM tags as such. Same +1, stated honestly.
4. **§3.1's Spirit Lore is a Lore skill you are trained in, granted with Spirit Sense.** A class cannot
   train a Lore in Pathfinder's data model — only a background can — so it arrives as part of the
   1st-level spiritual package. No change to what you have.
5. **§4.2's pool is set by your level, full stop.** Pathfinder normally derives a focus pool from how
   many focus effects you know. That rule would leave a **Hollow**, who knows exactly one costed kidō
   forever, on a pool of one at 11th level. The pool is 1 / 2 at 5th / 3 at 11th regardless of what you
   know. *If anyone "corrects" this back, the Hollow and the Quincy lose two thirds of their resource.*
6. **§5.2's Sonido is a flat bonus, not a status bonus.** A status bonus to Speed is displayed by
   Foundry and never added to the total. The five feet — ten from 11th — are unchanged; only the bonus
   type differs, and it now actually applies.
7. **§7B's Pantera stacks with Sonido because the two are different bonus types.** Two bonuses sharing
   a name are treated as one, so a Hollow Pantera was losing five feet. At 1st level a Pantera has
   **40 feet** of Speed: 25 base, +5 Sonido, +10 Pantera.
8. **§6.4's Bala is agile for multiple-attack-penalty purposes, and nothing else.** `agile` is a weapon
   property Pathfinder reads off weapons; on a spell attack it would be decoration. The −4/−8 is real
   and unchanged.
9. **Refined benefits that widen an area apply at 9th level, not per rank.** A focus effect heightens
   by rank, and "at 9th level" is not a rank step. Senbonzakura's emanation still goes from 15 to 20
   feet, Ennetsu Jigoku's likewise; they are simply granted by **Refined Release** rather than by the
   Technique's own heightening line.
10. **§9's Waning table is arithmetic:** dice = **22 − 2 × the round of Severance**, rounds 1–7, and the
    Art **cannot be used** in rounds 8–10. Unchanged from v1.3 — stated as a formula because that is how
    it is implemented, and because flattening it later should be a one-line change.

**Nothing about the class's balance changed in v1.4.** Every number in this document is the number in
v1.3; what changed is how four of them are *expressed*, and the admission that two of them were never
reaching the table at all.

**What changed in v1.3:**

1. **`Second Release` (6) is cut.** It paid you a Reiatsu Point to undo something you would never
   voluntarily do: Release has no downside and lasts the whole encounter, so nobody re-seals by
   choice. Its only real uses were re-triggering **Kyōka Suigetsu**'s hypnosis — one Spirit out of
   fifteen — and refunding a point after a Quincy's `Seal the Art` lapsed. Dead for fourteen
   subclasses and a hidden combo for one is the worst distribution a feat can have. Its anchor was
   wrong too: it cited `Stance Savant` and *stance-swapping economy*, when §4.7 says outright that
   **Release is not a stance**. Replaced by **`Reactive Strike`**, which fills a genuine hole — the
   class had no way at all to punish a creature moving, casting, or shooting in its reach.
2. **`Inner World` (8) is cut.** Faster retraining is a GM permission, not a class feat: no combat
   value, and most tables never invoke it. Replaced by **`Rising Tide`**, which ties the class's
   signature engine to its real weakness — a 10-HP light-armour frontliner — and pays out every
   round of every fight.

**What changed in v1.2:**

1. **`Ittō Kasō` was broken and is fixed.** Its entry listed only a *self-cost* and no effect on
   enemies, which made the one Severing Art that charges you half your Hit Points also the only one
   with no rider — strictly the worst ending in the class, for the highest price. It now deals the
   Waning dice **+2d6** (the only Art that beats the table), **ignores resistance and immunity to
   fire**, **blocks healing and suppresses regeneration for 1 minute**, and **cremates** anything it
   drops. The self-cost is broken out under the table so it can't be mistaken for the enemy effect
   again (§9.1).
2. **`Two Souls, One Edge` is cut and replaced by the `Borrowed Nature` family (§8.6).** Carrying two
   zanpakutō spirits has no canon basis; being **two peoples at once** has six. Borrowed Nature (6),
   Deeper Crossing (12), and Second Nature (18) let any Lineage dip into another — a Soul Reaper
   wearing a Hollow's mask is a **Visored**, a Hollow taking Shinigami power is what an **Arrancar**
   already is, a Quincy carrying either has Ichigo's own bloodline behind it. Each direction is
   listed with its canon precedent, and the borrowed version is always **half** the native rate.

**What changed in v1.1:**

1. **The class is now called *Soulbound*.** "Soul Reaper" was doing two jobs — the class and one of
   its three Lineages — and now does only the second. The file is renamed to match.
2. **Every Lineage has kidō.** A Hollow gets **Bala** (cantrip) and **Cero**; a Quincy gets
   **Heizen** (cantrip) and **Gritz**, both canon Gintō. Two each, fixed and native, where a Soul
   Reaper still gets six *chosen*. The old `Bala`, `Cero` and `Gintō Flask` feats are gone — they
   were always kidō wearing a feat's coat — and are replaced by upgrades to them (§8).
3. **The release ladder is renamed and now has four rungs, not three.** 13th level is **Full
   Release** (Bankai / Segunda Etapa / Vollständig). **Final Release** is new, at 20th, and is the
   *Saigo no Getsuga Tenshō* tier — available to all fifteen Spirits, not just Ichigo's.
4. **§9 is entirely new.** Final Release grants **Severance**, a 10-round state identical for every
   Spirit, plus one **Severing Art** unique to each — which ends the state when used and **decays
   every round**, from 20d6 in round 1 to 8d6 in round 7, and cannot be used at all after that.
5. **Canon corrections:** Bazz-B's technique is **Burner Finger**, not "Burning Finger"; Haschwalth's
   weapon is **Freund Schild**; nine canon ultimates moved to where canon actually puts them (§9.4).

**What changed from the prototype:**

1. **Hollow-kin and Quincy are folded into the class, not split off.** The prototype made
   Resurrección a "variant subclass" and recommended Quincy be built as a **separate class**
   (prototype §11). Both are now **Lineages** on a shared chassis, which is what you asked for. §5
   explains what each Lineage buys and what it pays for it.
2. **The subclass axis is now two axes**: **Lineage** (what you *are*) and **Spirit** (what your
   power *is*). Fifteen Spirits, five per Lineage, each built from the canon character's actual
   named techniques rather than a genre-generic effect.
3. **Everything is costed.** The prototype carried no point ledger at all. §2 is the 2100-point
   reconciliation, and it required real cuts — they are listed and explained, not hidden.
4. **Every number has a live anchor.** The prototype's numbers were plausible but unsourced. Every
   die, area, and duration below is calibrated against a named item in `packs/pf2e`.

---

## 1 — Design foundations

### 1.1 The pitch

Three peoples fight the same war with the same physics and opposite manners.

A **Soul Reaper** carries their own soul as a sword, and it argues with them. A **Hollow** ate its
own heart and wears the hole; its power is sealed *inside* it rather than carried. A **Quincy** owns
no soul-weapon at all — they reach into the air, take the spirit particles that are already there,
and make a bow out of them.

The mechanical claim this class makes is that these are **the same phenomenon pointed in three
directions**, and PF2e has room for exactly one chassis under all three. What differs is not the
engine — it is what each Lineage buys with the same allowance:

| | **Soul Reaper** | **Hollow** | **Quincy** |
| :---- | :---- | :---- | :---- |
| Buys | **Kidō breadth** (6 known) + the **Zanjutsu** technique family | **Hierro** (resistance), **Regeneración** (fast healing), **Sonido** (speed) | **Reishi weapon** (ranged), **Blut** (toggle), **Sealing** (counteract) |
| Pays | No resistance, no fast healing, baseline Speed | **2 fixed kidō** (Cero, Bala), no Zanjutsu | **2 fixed kidō** (Heizen, Gritz), no Zanjutsu |
| Release ladder | Shikai → **Bankai** | Resurrección → **Segunda Etapa** | Schrift → **Vollständig** |
| Plays as | The generalist: a duelist with answers | The bruiser: walks in and does not leave | The controller: denies the enemy their own tricks |

### 1.2 Profile & key attribute

Martial. **10 HP**, full attack investment, class DC (**Reiatsu DC**), no spell slots and no spell
list. Key attribute **Strength or Dexterity**.

> **On the prototype's open question #1 (Charisma-keyed).** Declined, and here is the reason rather
> than a preference. A Charisma-keyed frontliner already exists twice (Champion, Thaumaturge), and
> keying a class's *weapon Strikes* off Charisma requires either a Thaumaturge-style
> `Implement's Empowerment` clause or an outright break in PF2e's attack math. The genre argument is
> real — your force of self **is** your power — but it is served better by the fact that **Reiatsu
> DC** governs every release state, every kidō, and Bankai's fear aura. Your presence already scales
> off the class, just not off Charisma.

### 1.3 Reiatsu, and the one genuinely new mechanic

**Reiatsu Points** behave like focus points: a pool, refilled by daily preparations and by
**Steady the Breath** (the Refocus activity). Techniques and kidō are focus effects with the
**reiatsu** trait; they use your **Reiatsu DC** and key attribute, have **no rank**, and are
**automatically heightened to half your level rounded up**, exactly like every other focus spell.

What is new is how the pool refills:

> **Rising Pressure.** Once per round, the first time you either deal damage to an enemy with your
> spirit weapon or take damage from an enemy, you regain 1 Reiatsu Point. You can't exceed your
> maximum pool, and **over the course of a single encounter you can't regain more points this way
> than your maximum pool size.**

Every other focus user in PF2e spends down a pool that cannot be replenished until they get ten
quiet minutes. This one refills *by fighting*, on a hard per-encounter ceiling. In practice a
1st-level reaper gets **2** techniques per fight, a 5th-level reaper **4**, and an 11th-level reaper
**6** — and none of them on round one.

**The per-encounter cap is load-bearing.** Without it, a long fight is an infinite pool. It is the
first lever in §10.

### 1.4 Every technique costs 1 Reiatsu Point

There is no 2-point or 3-point focus spell anywhere in PF2e, and `Refocus` restores exactly 1 point
per 10 minutes. A 2-point technique is a once-per-day ability wearing a per-encounter costume. The
throttles live elsewhere:

| Throttle | Applies to |
| :---- | :---- |
| The pool itself (1 → 2 @ 5 → 3 @ 11) | Every technique |
| **Rising Pressure's per-encounter cap** | The refill, not the spend |
| **Frequency: once per round** | Release Techniques while in a Full Release |
| **Frequency: once per day** | Full Release (Bankai / Segunda Etapa / Vollständig) |
| **Self-cost** (a real, lasting condition) | Full Release, and the 20th-level capstone |
| **Requirement** clauses | Individual techniques that punch above their tier |

### 1.5 The design curve

This is the **same curve as the Breath Slayer v4.2**, deliberately, so that two homebrew classes in
one repository cannot drift apart. All values at rank 10 / level 20, all costing 1 Reiatsu Point.

| Technique shape | Actions | Rank-10 target | Standard ladder | Anchor in `packs/pf2e` |
| :---- | :---- | :---- | :---- | :---- |
| Single Strike + rider | 1 | **+5d6** (17.5) | `1d6` @ r1, **H(+2) +1d6** | `Inner Upheaval` +3d6 (monk) |
| Strike + movement/debuff | 2 | **+7d6** (24.5) | `3d6` @ r2, **H(+2) +1d6** | `Pulverizing Wake` Strike component |
| Two Strikes, one target | 2 | **+5d6 each** (35.0) | `1d6` @ r2, **H(+2) +1d6** | two full Strikes carry most of the value |
| 15-ft cone, **1 action** | 1 | **11d6** (38.5) | `2d6` @ r1, **H(+1) +1d6** | `Qi Blast` at 1 action = 9d6 |
| 15-ft cone / 10-ft emanation | 2 | **13d6** (45.5) | `5d6` @ r2, **H(+1) +1d6** | `Pulverizing Wake` cone = 11d8 (49.5) |
| 30-ft line / 15-ft burst | 2 | **11d6** (38.5) | `5d6` @ r4, **H(+1) +1d6** | area-for-damage trade |
| Ranged single target (spell attack) | 2 | **13d6** (45.5) | `3d6` @ r1, **H(+1) +1d6** | `Glacial Heart` 10d6 @ r5 (witch) |
| Reaction (defensive) | R | resistance formula + **5d6** | `2d6` @ r4, **H(+2) +1d6** | `Thermal Nimbus` = resistance equal to level |
| **Full Release** state (L13) | 2 | a 1-minute power state, not a number | — | `Path to Perfection` tier, BCS 110 |
| **Capstone** (L19–20) | 1–3 | **13d6+ area**, or **4 Strikes**, or a 1-minute omnibuff | flat @ r10 | `Sever Four Dragonfly Wings` · `Hero's Defiance` |

**Base rank by tier:** Release Technique = 1 · Refined upgrade = 5 · Full Release technique = 7 ·
Capstone = 10. A technique acquired above its base rank is simply already heightened.

### 1.6 Balance is not only damage

Where the prototype reached for a bigger die, this guide reaches for one of these. Each has a live
system anchor, and every one of them is used somewhere in §7.

| Lever | Anchor in the packs |
| :---- | :---- |
| Condition on a **failed basic save** | `Tempest Surge` (clumsy 2 at rank **1**) |
| **Immobilized / grabbed** vs. Escape at your class DC | `Hell of 1,000,000 Needles` (kineticist 18) |
| **Off-guard** generation | `Stumbling Stance` (monk 1) |
| **Slowed / stunned** with the incapacitation trait | `Glacial Heart` (witch), `Medusa's Wrath` (monk) |
| **Resistance = level** | `Thermal Nimbus` (kineticist **4**) |
| **Fast healing = half level**, off while dying | `Sanguine Mastery` (necromancer **12**) |
| **Fast healing 20** as a 20th-level capstone | `Golden Body` (monk 20) |
| **MAP-neutral** extra Strikes | `Sever Four Dragonfly Wings` (exemplar) |
| **Blocking healing / regeneration** | `Red-Gold Mortality` (exemplar **2**) |
| **Counteract** an ongoing effect | the core counteract rules; `Dispel Magic` |
| **Free-action** riders (Step, Stride, Hide) | `Qi Center` (monk 18), rogue `Nimble Roll` |
| **Persistent damage** that resists the flat check | `Bloody Debilitation` tier |

### 1.7 The floor

A Soulbound with an empty pool must still be a functioning martial. The floor is deliberately
**not** a damage rider — this class already has three Lineage floors that do the job:

- **Soul Reaper:** the largest kidō list, and **Shō** costs nothing.
- **Hollow:** Hierro and Regeneración are passive and never run out, and **Bala** costs nothing.
- **Quincy:** Blut is a free action once per round, and **Heizen** costs nothing.

All three therefore have a free, repeatable ranged option from 1st level with an empty pool. That is
the actual floor, and it is the same floor for everyone.

Say this at the table: **the pool is the spike, the Lineage is the floor.**

---

## 2 — The point ledger (2100 exactly)

*Costed against **BCS 1.4** (`Docs/homebrewing/BCS 1.4 (current) _ Balanced Core System.xlsx`).
Proficiency values from its `PROFICIENCYVALUES` tab: **Trained 10 · Expert 50 · Master 110 ·
Legendary 190 · HP 10 · SkillIncrease 5 · WeaponCS 50 · WeaponWS 70 · WeaponGWS 150**. Weapon and
armour groups follow the sheet's convention — the **highest** group pays the Expert/Master steps,
every additional group costs a flat 10.*

### Chassis — 1300

| Line | Value | Pts |
| :---- | :---- | :---- |
| HP | 10 | 100 |
| ClassFeatL01 | — | 10 |
| InitialSkills | Religion + 3 others | 20 |
| SubclassSkills | Lineage granted skill | 5 |
| GrantedSkills | Spirit Lore | 5 |
| ClassDC (**Reiatsu DC**) | T@1 / E@9 / M@17 | 170 |
| Perception | T@1 / E@5 | 60 |
| FortitudeSave | T@1 / E@1 / M@11 | 170 |
| ReflexSave | T@1 / E@1 / M@15 | 170 |
| WillSave | T@1 / E@3 | 60 |
| Attack — Unarmed | T@1 | 10 |
| Attack — Simple | T@1 | 10 |
| Attack — Martial | T@1 / E@5 / M@13 | 170 |
| WeaponCS@5 / WS@7 / GWS@15 | — | 50 + 70 + 150 |
| Defense — Unarmored | T@1 | 10 |
| Defense — Light | T@1 / E@13 | 60 |
| **Subtotal** | | **1300** |

> **No `ArmorAS` line.** Armour specialization only functions in medium or heavy armour, which this
> class never wears — the same reasoning the Breath Slayer ledger uses.

### Features — 800

| Lvl | Feature | Pts |
| :---- | :---- | :---- |
| 1 | **Reiatsu** (pool + Steady the Breath) | 10 |
| 1 | **Rising Pressure** (in-combat refill) | 70 |
| 1 | **Spirit Weapon** | 30 |
| 1 | **Lineage** (Soul Reaper / Hollow / Quincy) | 50 |
| 1 | **Released Form** (Spirit subclass + Release Technique) | 50 |
| 1 | **Spirit Sense** | 10 |
| 1 | **Konsō** | 10 |
| 3 | **Flash Step** | 30 |
| 3 | **Departed Flesh** | 10 |
| 5 | **Deepening Reserve** (2nd point) | 30 |
| 5 | **Lineage Feature** | 50 |
| 9 | **Refined Release** | 70 |
| 11 | **Deepening Reserve** (3rd point) | 30 |
| 11 | **Greater Flash Step** | 30 |
| 13 | **Full Release** (Bankai / Segunda Etapa / Vollständig) | 110 |
| 15 | **Lineage Mastery** | 30 |
| 17 | **Perfected Full Release** | 70 |
| 19 | **Unsealed** (capstone) | 110 |
| **Subtotal** | | **800** |

### **TOTAL 1300 + 800 = 2100** ✅

> **v1.1 changes nothing in this ledger.** Renaming the class, giving Hollows and Quincy two kidō
> each, and adding Final Release at 20th are all cost-neutral: the kidō sit inside the already-priced
> `Lineage` (50) and `Lineage Feature` (50) lines, and **Final Release is a 20th-level class feat**,
> which BCS prices through the standard feat progression rather than as a chassis or feature line —
> exactly as the feat it replaces was. The 13th-level line is the same 110 it always was; only its
> name changed, from *Final Release* to **Full Release**.

### 2.1 How the feature prices were set

BCS allows arbitrary values — the Champion's own sheet carries `Divine Smite 90` and `Exalt 110`, and
the Monk's carries `Action: Flurry of Blows 90` — so these are anchored to named lines on the
`CLASSDATA` tab and to the two companion ledgers in this repository, not snapped to proficiency
tiers.

| Feature | Anchor | Pts |
| :---- | :---- | :---- |
| Reiatsu | BCS `FocusSpell1 = 10`; Saint `Cosmo` = 10; Slayer `Focused Breathing` = 10 | 10 |
| **Rising Pressure** | Below Monk's `Action: Flurry of Blows` (**90**) and at Monk's `Metal Strikes` (**70**). It adds no action and no die — it raises resource *throughput* on a hard per-encounter ceiling. See §11.1; this is the single most likely line to need a re-cost | 70 |
| Spirit Weapon | Champion `Divine Ally` = 30; Magus `Action: Arcane Cascade` = 30. Free rune transfer, ghost touch, and unbreakability, but no numbers | 30 |
| Lineage | Saint `The Cloth` = 50; BCS Champion `Champion's Reaction` = 50; Slayer `Breathing Style` = 50 | 50 |
| Released Form | The second subclass axis, priced identically to the first. Grants the Release action, a permanent form change, and one Release Technique | 50 |
| Spirit Sense | BCS Champion `ShieldBlockL01` = 10 — the level-1 small-extra slot | 10 |
| Konsō | Same slot; a pure exploration-mode activity with no combat value | 10 |
| Flash Step | Monk `Incredible Movement` = **30**, and this is strictly narrower (once per round, no passive Speed) | 30 |
| Departed Flesh | Level-1-extra tier, taken at 3 | 10 |
| Deepening Reserve ×2 | Saint `Second Cosmo` / `Third Cosmo` = 30 each | 30 + 30 |
| Lineage Feature (L5) | The Lineage's real payload — Zanjutsu access, Regeneración, or Sealing. Priced at `The Cloth` tier again because it is a second subclass grant | 50 |
| Refined Release | Slayer `Transparent World Glimpse` = 70; Monk `Metal Strikes` = 70 | 70 |
| Greater Flash Step | `Incredible Movement` tier; a defensive rider on an existing action | 30 |
| **Full Release** | Monk `Path to Perfection` = **110**; Saint `Exalt` = 110; Slayer `Demon Slayer Mark` = 110. A once-per-day, 1-minute power state | 110 |
| Lineage Mastery | Saint `Cloth Attunement` = 30 — a scaling bump to something you already have | 30 |
| Perfected Full Release | `Metal Strikes` / `Refined Release` tier: duration up, drawback off | 70 |
| **Unsealed** (L19) | Magus `Double Spellstrike` (L19) = **110**. Deliberately below Monk `Perfected Form` (190) and Saint `Eighth Sense` (190) — it doubles a daily use, it does not defy death | 110 |

### 2.2 Reconciliation against the prototype — **read this**

The prototype (`soul-reaper-class.md`) carried no ledger, but §2 and §3 of it fully specify a
chassis. Priced against BCS 1.4, here is exactly what it asked for:

| Line | Prototype | Pts |
| :---- | :---- | :---- |
| HP | 10 | 100 |
| ClassFeatL01 | — | 10 |
| InitialSkills | Religion + 3 others | 20 |
| GrantedSkills | Spirit Lore | 5 |
| Perception | T@1 / **E@1** | 60 |
| Fortitude | T@1 / E@11 *(fortitude expertise)* | 60 |
| Reflex | T@1 / E@1 / **M@17** *(reflex mastery)* | 170 |
| Will | T@1 / E@1 / **M@9** *(unbroken self)* | 170 |
| ClassDC | T@1 / E@7 / M@15 / **L@19** *(legendary pressure)* | **360** |
| Attacks — unarmed, simple | T@1 each | 20 |
| Attack — martial | T@1 / E@5 / M@13 | 170 |
| WeaponWS@7 + GWS@15 | — | 220 |
| Defense — unarmoured + light | T@1 / E@7 / M@13 *(spirit weave, spirit weave mastery)* | 180 |
| **Prototype chassis total** | | **1545** |
| Feature block (§2 above) | | **800** |
| **Prototype total** | | **2345** |
| **Overrun against the 2100 budget** | | **−245** |

**The prototype is over budget by exactly 245 points**, and it is over for one identifiable reason:
it buys **two Legendary-adjacent lines** — a Legendary class DC and a Master Will — that BCS's own
`CLASSPROFILES` tab does not give to any 10-HP martial. Legendary class DC belongs to the `Caster`
and `Caster-Specialist` profiles; every martial profile in the sheet stops at `DCMaster L17`.

**The two cuts made in this guide, and the two additions:**

| Line | Prototype | Here | Δ | Reason |
| :---- | :---- | :---- | :---- | :---- |
| **Class DC** | T1→E7→M15→**L19** = 360 | T1→E9→M17 = 170 | **−190** | Legendary is the single most expensive line in BCS — more than the level-19 capstone costs. No martial profile in the sheet has it. Bites from 19th. |
| **Will** | T1→E1→**M9** = 170 | T1→E3 = 60 | **−110** | Painful and **correct for the genre**. The defining Soul Reaper failure is that the entire Gotei 13 loses to one illusion. Aizen works *because* Will is this class's soft save. `Voice in the Blade` (§4.1) hands back a +1 circumstance bonus against exactly the domination effects that should not land. Bites from 9th. |
| **WeaponCS@5** | *(absent)* | crit specialization @5 | **+50** | The prototype granted `weapon expertise` at 5th but never bought critical specialization. Every martial in BCS has it; adding it is a correction, not a buff. |
| **SubclassSkills** | *(absent)* | Lineage skill | **+5** | The prototype had no Lineage axis to grant a skill from. |
| | **1545** | **1300** | **−245** | exactly the overrun |

`1545 − 190 − 110 + 50 + 5 = 1300` ✅

**What the freed points bought.** The 245 points do not go back into the chassis. They pay for the
three lines the prototype had no equivalent of at all — `Lineage` (50), `Lineage Feature` (50), and
`Lineage Mastery` (30), totalling **130** — plus the `Released Form` line rising from an unpriced
subclass grant to a full 50. **That 130 is the entire cost of folding Hollows and Quincy into the
class instead of splitting them off**, which is the thing you asked for, and it was paid for by the
class DC and Will cuts above rather than by taking anything off the table that the prototype's
combat maths depended on.

**Two alternative 245s, if you would rather keep Legendary class DC or Master Will:**

- **Reflex Master (110) + Perception Expert delayed and Fortitude Master cut (110) + skills (25)** —
  keeps the prototype's saves intact but produces a class that is Expert in two saves at 20th level.
  Not recommended.
- **Cut 245 of features** — in practice `Unsealed` (110), `Perfected Full Release` (70), and
  `Lineage Mastery` (30) plus 35 more. This preserves the prototype's chassis exactly and guts levels
  15–19. Also not recommended; those are the class.

---

## 3 — Chassis

### 3.1 Initial proficiencies (1st level)

**Perception:** Trained *(Expert at 5th — Spirit Sense, not proficiency, does the 1st-level genre work)*

**Saving Throws:** **Expert** in Fortitude · **Expert** in Reflex · Trained in Will
*(Fortitude Master at 11th; Reflex Master at 15th; Will stops at Expert — see §2.2)*

**Skills:** Trained in **Religion**; trained in **Spirit Lore** (souls, the afterlife, haunts, and
hollow-things); trained in your **Lineage skill** (Soul Reaper → Society · Hollow → Athletics ·
Quincy → Crafting); trained in 3 + Int modifier additional skills

**Attacks:** Trained in simple weapons, martial weapons, unarmed attacks, and your spirit weapon

**Defenses:** Trained in light armour and unarmoured defense

**Class DC:** Trained in **Reiatsu DC**

> **On the prototype's open question #2 (armour).** Held at light. Medium armour is the single
> clearest line between this class and Champion/Guardian, and the Hollow Lineage already buys
> physical resistance — stacking medium armour on top of Hierro produces a 10-HP class with a
> Guardian's damage profile.

### 3.2 Class features by level

| Level | Class Features |
| :---- | :---- |
| 1 | Ancestry and background, attribute boosts, initial proficiencies, **spirit weapon**, **reiatsu**, **Rising Pressure**, **lineage**, **released form**, **spirit sense**, **konsō**, soulbound feat |
| 2 | Soulbound feat, skill feat |
| 3 | **Flash Step**, **departed flesh**, **iron will** (Will expert), general feat, skill increase |
| 4 | Soulbound feat, skill feat |
| 5 | Ancestry feat, attribute boosts, **deepening reserve** (pool 2), **lineage feature**, **alertness** (Perception expert), **weapon expertise** (martial expert, crit specialization), skill increase |
| 6 | Soulbound feat, skill feat |
| 7 | **Weapon specialization**, general feat, skill increase |
| 8 | Soulbound feat, skill feat |
| 9 | Ancestry feat, **refined release**, **reiatsu expertise** (Reiatsu DC expert), skill increase |
| 10 | Attribute boosts, soulbound feat, skill feat |
| 11 | **Deepening reserve** (pool 3), **greater Flash Step**, **juggernaut** (Fortitude master), general feat, skill increase |
| 12 | Soulbound feat, skill feat |
| 13 | Ancestry feat, **FULL RELEASE**, **weapon mastery** (martial master), **spirit weave** (light/unarmoured expert), skill increase |
| 14 | Soulbound feat, skill feat |
| 15 | Attribute boosts, **lineage mastery**, **evasion** (Reflex master), greater weapon specialization, general feat, skill increase |
| 16 | Soulbound feat, skill feat |
| 17 | Ancestry feat, **perfected final release**, **reiatsu mastery** (Reiatsu DC master), skill increase |
| 18 | Soulbound feat, skill feat |
| 19 | **Unsealed** (capstone), general feat, skill increase |
| 20 | Attribute boosts, soulbound feat, skill feat |

---

## 4 — Core class features

### 4.1 Spirit Weapon (1st)

Your power has a shape. What that shape *is* depends on your Lineage — a Soul Reaper's zanpakutō is
their own soul with an edge on it, a Hollow's is the fragment of mask that sealed their power inside
their body, a Quincy's is a bow condensed out of the air — but the rules are identical.

Choose one sealed profile:

| Profile | Damage | Traits |
| :---- | :---- | :---- |
| **Blade** | 1d8 slashing | versatile P, two-hand d10 |
| **Great Blade** | 1d10 slashing | two-handed *(held in two hands; PF2e has no such trait)*, sweep |
| **Paired Blades** | 1d6 slashing (each) | agile, finesse, twin |
| **Spirit Bow** *(Quincy only)* | 1d8 piercing | propulsive, range increment 60 ft., reload 0 |

Your spirit weapon is a martial weapon and always counts as one you're proficient with, regardless
of its released form.

**Bonded.** You can manifest or dismiss it as a free action once per round. Dismissed, it cannot be
taken from you. If it leaves your hands you can Interact to call it back from up to 30 feet away. It
cannot be permanently destroyed while you live; if broken, it re-forms after 10 minutes of rest.

**Soul-Etched.** During your daily preparations you can transfer weapon runes into or out of your
spirit weapon for free, with no cost and no Crafting check.
*Anchor: `Handwraps of Mighty Blows` exist for exactly this reason — a class with a signature weapon should not be rune-taxed.*

**Spirit-Cutting.** Your spirit weapon's Strikes can deal **spirit** damage instead of their normal
damage type, and affect incorporeal creatures as though the weapon had the *ghost touch* rune.

**Voice in the Blade.** You gain a **+1 circumstance bonus** to saves against effects that would
control you, possess you, or force you to release your weapon — in play, **possession** and
**mental** effects, plus anything your GM names as one. Your spirit weapon cannot be Stolen
or permanently Disarmed.
*This is the hand-back for Will stopping at Expert (§2.2). A circumstance bonus, not status — it stacks with nothing your party is already handing out.*

> **A Quincy's "Voice."** A Quincy has no spirit inside the bow, so the bonus instead reflects the
> Quincy discipline of never letting go of your own reishi. Same number, different sentence.

### 4.2 Reiatsu and Rising Pressure (1st)

You have a **reiatsu pool**: maximum 1 point, increasing to 2 at 5th level and 3 at 11th. Refill it
during daily preparations, or by spending 10 minutes on **Steady the Breath** (the Refocus activity —
you meditate, or you argue with your sword, or you eat something).

> **Rising Pressure**
> Once per round, the first time you either deal damage to an enemy with your spirit weapon or take
> damage from an enemy, you regain 1 Reiatsu Point. You can't exceed your maximum pool, and over the
> course of a single encounter you can't regain more points this way than your maximum pool size.

| Level | Pool | Max per encounter | Effective techniques per fight |
| :---- | :---- | :---- | :---- |
| 1–4 | 1 | +1 | **2** |
| 5–10 | 2 | +2 | **4** |
| 11–20 | 3 | +3 | **6** |

*Compare: a Monk with `Ki Strike` and two ki spells gets **3** per fight, refilled only by Refocus. A Witch with a 3-point hex pool gets **3**. This class gets **6** at 11th — which is why the cap is not optional and why the techniques themselves sit at focus-spell values, not spell-slot values.*

### 4.3 Spirit Sense (1st)

You automatically sense the presence and approximate strength of undead, haunts, spirits, and
incorporeal creatures within **60 feet**, even through thin barriers, without learning their exact
location — they are **hidden** to you rather than undetected. You can see and target incorporeal
creatures normally.

*Anchor: this is an imprecise sense with a restricted target list, which is why it costs the level-1-extra slot (10) rather than the `Sixth Sense` tier (50) the Saint pays for a general one. Compare `Thoughtsense` (occult, rank 4) and the Slayer's `Transparent World Glimpse` (70, precise, strips circumstance AC bonuses).*

### 4.4 Konsō — Soul Burial (1st)

**Konsō** is a 10-minute exploration activity. Choose a haunt, spirit, or incorporeal undead of your
level or lower that is not currently hostile (or has been reduced below half HP and is willing,
restrained, or bound). Attempt a Religion or Spirit Lore check against its DC.

- **Critical Success** — The soul departs peacefully. A haunt is permanently neutralized; an undead
  is destroyed without violence. You learn one significant fact about its unfinished business.
- **Success** — As critical success, but you learn nothing.
- **Failure** — The rite fails; retry after 1 hour.
- **Critical Failure** — The soul recoils, becomes hostile, and gains a +1 status bonus to attacks
  against you for 1 minute.

> **A Hollow's Konsō** is not a burial — it is an offer to *eat* the soul cleanly rather than let it
> degrade. Same check, same outcomes, considerably worse optics. A **Quincy's** is simply
> annihilation, which is the historical reason Soul Reapers and Quincy went to war: a Quincy who
> destroys souls instead of circulating them breaks the balance between the worlds. Consider making
> this a real table conversation rather than a reskin.

### 4.5 Flash Step (3rd) — *Shunpo · Sonido · Hirenkyaku*

> **Flash Step** [one-action] (move, reiatsu)
> **Frequency** once per round
> You step between one instant and the next. Stride up to your Speed. This movement doesn't trigger
> reactions.

**Greater Flash Step (11th).** You leave an afterimage: until the start of your next turn, the first
attack made against you each round requires the attacker to succeed at a **DC 5 flat check** or the
attack misses.

*Anchor: Monk's `Incredible Movement` (L3, +10 ft. passive, BCS 30) — this trades the passive bonus for a once-per-round reaction-free Stride, which is closer to `Nimble Roll`/`Sudden Charge` in effect. The 11th-level flat check is `Blur`'s DC 5 (rank-2 spell), granted 8 levels late and only against the first attack each round.*

### 4.6 Departed Flesh (3rd)

You're immune to disease, you don't need to eat or drink, and when you roll a success on a save
against a poison effect you get a critical success instead. You still need to rest.

*Anchor: the "success becomes critical success" clause is `Resolve`/`Juggernaut` shaped, restricted to a single effect category. Level-1-extra tier.*

### 4.7 Released Form (1st), Refined Release (9th)

Choose a **Spirit** from §7. It grants:

- **Release** [one-action] (auditory, concentrate, reiatsu) — You speak your release command. Your
  spirit weapon assumes its released form for the rest of the encounter. **The first Release each
  encounter is free**; releasing again after re-sealing costs 1 Reiatsu Point. You can't Release
  while your spirit weapon is dismissed.
- A **Released Form** — permanent changes to your weapon's statistics and traits while released.
- A **Release Technique** — a signature effect costing 1 Reiatsu Point, usable only while released.

Release is *not* a stance and doesn't conflict with stance actions. It lasts the whole encounter.

> **Release should stay free and permanent-per-encounter.** If it costs a point, everyone Releases on
> round one anyway and feels taxed. The interesting decision is what you do *after* releasing.

**Refined Release (9th).** Your Release Technique gains its **Refined** benefit, listed per Spirit.
Base rank of the Refined effect is 5.

### 4.8 Full Release (13th) — *Bankai · Segunda Etapa · Vollständig*

> **FULL RELEASE** [two-actions] (auditory, concentrate, reiatsu)
> **Frequency** once per day · **Requirements** Your spirit weapon is in its released form and you
> have at least 1 Reiatsu Point
>
> For **1 minute**:
> - Your spirit weapon's damage die increases by one step.
> - You gain your Spirit's **Full Release** ability (§7).
> - Your Release Technique costs no Reiatsu Points, but you can use it only once per round.
> - You emit a **15-foot emanation** of crushing spiritual pressure. An enemy that ends its turn in
>   the emanation must succeed at a Will save against your Reiatsu DC or become **frightened 1**
>   (frightened 2 on a critical failure). A creature that succeeds is temporarily immune for
>   10 minutes.
>
> When it ends you become **fatigued** until you rest for 10 minutes, and you can't use Full Release
> again today.

**Perfected Full Release (17th):** duration 2 minutes, no fatigue, emanation increases to 20 feet.

**Unsealed (19th, capstone):** You can use Full Release **twice per day**. While in a Full Release
you're immune to fear effects, and the first time each round you critically hit with your spirit
weapon you regain 1 Reiatsu Point — **this ignores Rising Pressure's per-encounter cap**.

*Anchor: the state itself is `Path to Perfection` tier (BCS 110). The fear emanation is deliberately weaker than `Frightful Presence`-style monster auras — it is once per creature per 10 minutes, ends-of-turn only, and frightened 1. The die-step increase is the same lever `Deific Weapon` uses. The 19th-level capstone is priced at Magus `Double Spellstrike` (110), not Monk `Perfected Form` (190), because doubling a daily use is a smaller promise than immunity to death.*

### 4.9 Lineage Mastery (15th)

Each Lineage's 15th-level upgrade is listed in §5. All three are scaling bumps to something you
already have, priced at Saint `Cloth Attunement` (30) — none of them adds a new action.

---

## 5 — The three Lineages

Chosen at 1st level. Grants a skill and a 1st-level package (50 pts), a 5th-level feature (50 pts),
and a 15th-level mastery (30 pts).

### 5.1 ⚔ Soul Reaper (Shinigami) — *breadth*

**Granted skill:** Society. **Release ladder:** Shikai → Bankai.

**Kidō Adept (1st).** You learn **two** kidō of your choice at 1st level, and one additional kidō at
5th, 9th, 13th, and 17th level — **six chosen kidō** in total, on top of your free cantrip **Shō**.
You are the only Lineage that *chooses*: a Hollow and a Quincy each get exactly **two fixed** kidō
native to what they are (§6.4, §6.5).

*Anchor: six known focus effects is the top of the range PF2e permits without a spell list — a Witch knows 1 hex + feats, a Cleric with `Domain Initiate` chains to 2–3. The Slayer's guardrail #5 caps kidō at 6–8 by 20th; this is the Lineage that actually reaches it, and only this one.*

**Zanjutsu (5th).** The sword arts, drilled rather than intuited. You gain the **Zanjutsu** feat
family (§8.4) and **one Zanjutsu technique** of your choice for free. Zanjutsu techniques are
Strike-based reiatsu effects — the "powerful martial techniques" half of the Lineage.

*Anchor: this is structurally the Breath Slayer's Form ladder bolted onto one Lineage. A free technique plus access is `Path to Perfection` shaped but narrower, hence 50 rather than 110.*

**Zanjutsu Mastery (15th).** Your Zanjutsu techniques' damage dice increase by one step (d6→d8,
d8→d10). Once per round, when you critically hit with your spirit weapon, you regain 1 Reiatsu Point;
this ignores Rising Pressure's per-encounter cap.

---

### 5.2 🦴 Hollow (Arrancar) — *attrition*

**Granted skill:** Athletics. **Release ladder:** Resurrección → Segunda Etapa.

**Hierro and Sonido (1st).**
- **Hierro** ("iron skin") — Your compressed reiryoku hardens your skin. You gain **resistance to
  physical damage equal to half your level (minimum 1)**.
- **Sonido** ("sound") — You gain a **+5-foot bonus** to all your Speeds. At 11th level this
  increases to +10 feet. *(Untyped rather than status: a status bonus to Speed is displayed by
  Foundry and never added, and Pantera needs a different type to stack with it.)*

*Anchors: `Thermal Nimbus` (kineticist **4**) grants resistance **equal to your level** to one energy type. Hierro is broader (all physical) at **half** that rate, and arrives at 1st on a class with light armour and 10 HP. `Raging Resistance` (barbarian 9) gives 3 + Con to two types while raging. Sonido is below Monk `Incredible Movement` (+10 ft. at 3rd, BCS 30) at 1st and equal to it at 11th.*

**Cero and Bala (1st).** A Hollow's demon arts are not learned, they are *anatomy*. You know exactly
**two** kidō and they are always these: **Bala** (your free cantrip) and **Cero**. You cannot learn
others, and no feat grants you more — `Additional Kidō` is closed to you. Full text in §6.4.

**Regeneración (5th).** High-speed regeneration. You gain **fast healing 2**. This increases to
**fast healing 4** at 11th level and **fast healing 6** at 17th.

**It is deactivated while you have the dying condition, and suppressed until the end of your next
turn whenever you take spirit damage or damage from a holy or vitality effect.**

*Anchor: `Sanguine Mastery` (necromancer **12**) grants fast healing **equal to half your level** (6 at 12th, 10 at 20th), deactivated while dying. This is roughly **half** that value, arrives seven levels earlier, and carries a second off-switch that the entire rest of this class — spirit damage — turns off on demand. That last clause is the point: Soul Reapers and Quincy exist to shut this down, and both can, from 1st level.*

**Segunda Piel (15th).** Hierro's resistance applies to **spirit** damage as well as physical, and
Regeneración is no longer suppressed by damage from holy or vitality effects (spirit damage still
suppresses it).

---

### 5.3 🏹 Quincy — *denial*

**Granted skill:** Crafting. **Release ladder:** Schrift → Vollständig.

**Heilig Bogen and Blut (1st).**
- **Heilig Bogen** ("holy bow") — You may choose the **Spirit Bow** profile for your spirit weapon
  (§4.1). Your bow needs no ammunition; you condense arrows out of ambient reishi. In an area with
  little or no ambient spiritual energy (GM's call — a dead-magic zone, a sealed vault), your bow's
  damage die decreases by one step.
- **Blut** [free-action] (reiatsu) — **Frequency** once per round. Choose **Vene** or **Arterie**.
  The choice lasts until the start of your next turn. **You cannot have both** — canon is explicit
  that Blut Vene and Blut Arterie run on two different reishi systems and cannot be used at once.
  - **Blut Vene** (defensive) — You gain **resistance to physical damage equal to half your level
    (minimum 1)**.
  - **Blut Arterie** (offensive) — Your Strikes with your spirit weapon **ignore resistances to
    physical damage and to spirit damage**, and treat the target's cover as one step less.

*Anchors: Vene is Hierro's number, gated behind an action and an exclusive choice, so it is strictly worse than the Hollow's and correctly so. Arterie deliberately grants **no bonus to attack, damage, or DC** — it is a resistance-bypass, which is the `Cut the Cord`/`ghost touch` lever, plus the cover clause from `Pale Lightning`. This is the answer to "how does a Quincy shoot through Hierro" without touching PF2e's attack math.*

**Heizen and Gritz (1st).** A Quincy's demon arts are **Gintō** — small silver tubes of liquefied
reiryoku, uncorked and spoken over, which is exactly what Kidō is to a Soul Reaper and exactly how
canon frames them. You know **two** and they are always these: **Heizen** (your free cantrip) and
**Gritz**. You cannot learn others, and `Additional Kidō` is closed to you. Full text in §6.5.
*(The third canon Gintō, **Sprenger**, is not a kidō — it needs five Seele Schneider planted in a
pentacle, and it appears where canon puts it: at Uryū Ishida's Final Release, §9.)*

**Sealing (5th).** The Quincy talent that started a war: they do not out-fight a Soul Reaper, they
**switch them off**.

> **Seal the Art** [two-actions] (concentrate, reiatsu) · **Cost** 1 Reiatsu Point
> **Range** 30 feet, one creature
> Attempt to **counteract** one ongoing magical effect, stance, aura, or release state affecting the
> target. Your counteract check is your Reiatsu DC's proficiency and key attribute; your counteract
> rank is **half your level rounded up**.
> A **release state** — Shikai, Bankai, Resurrección, Segunda Etapa, Vollständig, a Barbarian's Rage,
> a Magus's Arcane Cascade, or any comparable ongoing self-buff — is not ended outright but
> **suppressed until the end of the target's next turn**, and the target can't re-enter it during
> that time.

*Anchors: the core counteract rules and `Dispel Magic`. Counteract rank = half level rounded up is the standard focus-spell heightening line, so a 10th-level Quincy counteracts at rank 5 — enough for most ongoing buffs, not enough for a 9th-rank spell. Suppression-rather-than-ending for release states is `Slow`-shaped rather than `Dispel`-shaped, so a 13th-level Bankai is not deleted by a 5th-level action. This is the canon Quincy Medallion, made survivable.*

**Sklaverei (15th).** Absolute subordination of reishi. When you successfully counteract with
**Seal the Art**, you regain 1 Reiatsu Point (ignoring Rising Pressure's per-encounter cap), and the
target is **off-guard** until the end of its next turn. On a critical success against a release
state, the suppression lasts 1 minute instead.

---

## 6 — Kidō, the Demon Arts

Kidō are **not spells**. They use your Reiatsu DC, they can't be counteracted as spells, and you
can't heighten them with slots. They auto-heighten to **half your level rounded up**, like focus
spells. Every kidō has the **kidō** and **reiatsu** traits plus one of **destruction** (Hadō),
**binding** (Bakudō), or **mending** (Kaidō).

**Every Lineage has kidō. They differ in how many, and in whether you choose them.**

| Lineage | Free cantrip | Costed kidō | Chosen or fixed? |
| :---- | :---- | :---- | :---- |
| **Soul Reaper** | **Shō** | **six**, at 1st (×2), 5th, 9th, 13th, 17th | **Chosen** from §6.1–6.3 |
| **Hollow** | **Bala** | **one** — **Cero** | **Fixed** (§6.4) |
| **Quincy** | **Heizen** | **one** — **Gritz** | **Fixed** (§6.5) |

Your free cantrip costs no Reiatsu Point and is available from 1st level. Every costed kidō costs
**1 Reiatsu Point**. A Hollow or a Quincy cannot take `Additional Kidō`; their arts are what they
physically are, not a curriculum.

> **Canon numbering is preserved** where it exists. The number is flavour; the mechanics are the
> point. Rename freely.

### 6.1 Way of Destruction — Hadō

| Kidō | Act. | Effect | Base rank / heightening | PF2e anchor |
| :---- | :---- | :---- | :---- | :---- |
| **#1 Shō — Thrust** *(cantrip)* | 1 | 30 ft., one creature, basic Reflex. **1d4 + key attribute** force damage; on a critical failure also pushed 5 ft. | r1, **H(+2) +1d4** | `Force Bolt` (wizard, 1d4+1, H+2) — this adds the attribute mod because it is the class's only free action-economy filler |
| **#4 Byakurai — Pale Lightning** | 1 | 60 ft., one creature. Spell attack roll. **2d6** electricity, doubled on a crit. Ignores lesser cover. | r1, **H(+1) +1d6** | `Fire Ray` (cleric, 2d6, H+1, 2 actions) — ours is **1 action** and 60 ft., so it stops at 2d6 where `Hurtling Stone` (2d6 at 1 action) sits |
| **#31 Shakkahō — Crimson Bloom** | 2 | 60 ft., **10-ft burst**, basic Reflex. **2d6** fire. | r1, **H(+1) +1d6** | `Crushing Ground` (2d6, H+1, 2 actions); area trade against `Cry of Destruction` (1d8 cone) |
| **#33 Sōkatsui — Sundering Wave** | 2 | **30-ft line**, basic Reflex. **2d4** spirit; creatures that fail are pushed 10 ft. | r1, **H(+1) +1d4** | `Spray of Stars` (2d4 cone, H+1). The push is the reason the die is d4 not d6 |
| **#73 Sōren Sōkatsui — Twin Wave** *(9th)* | 2 | **60-ft line**, basic Reflex. **7d6** spirit; on a failure, 1d6 persistent fire. | r5, **H(+1) +1d6** | `Chthonian Wrath` (rank 5, 60-ft cone, 4d6+4d6). Canon: "twice the power of the basic variant" |
| **#90 Kurohitsugi — Black Coffin** *(15th)* | 2 | 60 ft., **10-ft burst**, basic Reflex. **9d6** void; creatures that critically fail are **immobilized** until the end of their next turn (Escape vs. Reiatsu DC). | r8, **H(+1) +1d6** | `Accelerated Decomposition` (rank 6, 9d6 void). The immobilize is `Hell of 1,000,000 Needles`-shaped |

### 6.2 Way of Binding — Bakudō

| Kidō | Act. | Effect | Base rank | PF2e anchor |
| :---- | :---- | :---- | :---- | :---- |
| **#1 Sai — Restrain** | 1 | 30 ft., one creature, Reflex. **Failure** immobilized 1 round (Escape vs. Reiatsu DC). **Crit failure** immobilized 1 minute, new save at the end of each of its turns. | r1 | `Tanglefoot` (cantrip) escalated to focus tier; `Web` |
| **#4 Hainawa — Crawling Rope** | 1 | 30 ft., one creature, Reflex. **Failure** the target takes a −10-ft. status penalty to Speeds for 1 round and can't Step. **Crit failure** as failure, and it's **off-guard** for that round. | r1 | `Clinging Ice` (witch cantrip: 1d4 cold + −5 ft.); `Stumbling Stance` for the off-guard |
| **#61 Rikujōkōrō — Six Rods** *(7th)* | 2 | 30 ft., one creature, Fortitude. **Failure** immobilized and unable to use manipulate actions for 1 round. **Crit failure** 2 rounds. | r4 | `Paralyze` (rank 3) without the incapacitation trait, so it stops at "no manipulate actions" rather than paralysed |
| **#81 Danku — Splitting Void** | R | **Trigger** You or an ally within 15 ft. would take damage from a ranged attack, a spell, or an area effect. **Effect** The target gains **resistance equal to your level** to the triggering damage. | r1 | `Thermal Nimbus` (kineticist **4**) is resistance = level, *passive and for a whole aura*. This is one instance, one trigger, one target |
| **#99 Kin — Silence the Chain** *(9th)* | 2 | 30 ft., one creature, Will. **Failure** **stupefied 2** for 1 minute; can't cast spells or use kidō for 1 round. **Crit failure** stupefied 3, can't cast for 2 rounds. | r5 | `Silence` (rank 2) plus `Feeblemind`-lite; stupefied 2 is `Tempest Surge`'s clumsy 2 at a higher rank |

### 6.3 Way of Mending — Kaidō

| Kidō | Act. | Effect | Base rank | PF2e anchor |
| :---- | :---- | :---- | :---- | :---- |
| **Kaidō — Mend the Weave** | 2 | Touch, one willing creature. Restore **5 HP per half your level (rounded up)**, minimum 5. At 9th level, also remove one of clumsy, enfeebled, or stupefied. | r1 | Deliberately below `Heal` and below `Lay on Hands` (which is 6 HP/rank at **1 action**). This is a 2-action touch heal on a martial with no healing proficiency |

> **This is meant to be mediocre.** You are not the party's healer, and the class does not pretend
> otherwise. Kaidō exists so a lone Soul Reaper can stabilize a dying ally, not so the party can skip
> a Cleric.

### 6.4 Hollow arts — **Cero and Bala**

Canon is unusually precise about the relationship between these two: a Bala is weaker than a Cero but
can be fired at roughly **twenty times the rate**. That is a cantrip and a focus effect, described in
the source material before anyone tried to stat it.

| Kidō | Act. | Effect | Base rank / heightening | PF2e anchor |
| :---- | :---- | :---- | :---- | :---- |
| **Bala** *(cantrip)* | 1 | Range 60 ft., one creature. **Ranged spell attack**, **1d4 + key attribute** force damage, doubled on a critical hit. Bala has the **agile** trait for the purpose of your multiple attack penalty (−4/−8 rather than −5/−10). | r1, **H(+2) +1d4** | `Force Bolt` for the damage; the agile clause is canon's "twenty times the rate" and the reason this is an attack roll where Shō is a save |
| **Cero** | 2 | **60-foot line**, basic Reflex, **2d6** force damage. | r1, **H(+1) +1d6** | The standard area ladder (11d6 at rank 10). The line is longer than Shakkahō's burst because Cero is a Hollow's **only** costed kidō — breadth traded for reach |

*Why a Hollow gets two and not three: the Lineage already buys Hierro, Regeneración, and Sonido (§5.2). Cero and Bala are the whole demon-arts budget, and they are flat, reliable, and never situational — which is the Hollow's design in one sentence.*

### 6.5 Quincy arts — **Gintō**

Gintō are silver tubes of liquefied reiryoku that a Quincy uncorks and speaks over. Canon treats them
as the Quincy's direct counterpart to Kidō, with German names in place of numbered Japanese ones, so
they slot into this section with no adaptation needed.

| Kidō | Act. | Effect | Base rank / heightening | PF2e anchor |
| :---- | :---- | :---- | :---- | :---- |
| **Heizen** *(cantrip)* | 1 | A flat rectangular pane of light. **15-foot line**, basic Reflex, **1d6** force damage. Canon: it slices through what it crosses. | r1, **H(+2) +1d6** | 5d6 in a 15-ft line at rank 10, against `Electric Arc`'s 5d4 + mod to two targets. An area cantrip, so no attribute modifier |
| **Gritz** | 2 | Range 30 ft., one creature, Reflex save. A man-sized pentacle closes over the target. **Failure** immobilized for 1 round (Escape vs. your Reiatsu DC). **Critical Failure** **restrained** for 1 minute; the target can attempt a new save at the end of each of its turns. | r1 | `Sai` (§6.2) with **restrained** rather than immobilized on a critical failure — one step better because it is the Quincy's only costed kidō. `Web`/`Paralyze` territory without the incapacitation trait |

*Why these two: they are **general Quincy techniques**, not Schrift-specific — any Quincy can carry Gintō, where "The Heat" or "The Thunderbolt" belongs to exactly one person. That makes them the only honest candidates for a Lineage-wide grant.*

### 6.6 Why kidō must not become a spell list

The moment a Soul Reaper can solve arbitrary problems with magic, it is a Magus with better hit
points and no spell slots to spend. The caps that keep this from happening:

1. **Known kidō are capped by Lineage** — 6 chosen for a Soul Reaper, exactly **1 costed and fixed**
   for a Hollow or a Quincy, plus each Lineage's free cantrip. `Additional Kidō` (§8) can be taken
   three times and is **Soul Reaper only**, so the **hard ceiling is 9 at 20th level** for a Soul
   Reaper who spends three class feats on it, and that character has given up three Zanjutsu
   techniques to do it. A Hollow or Quincy can never exceed two.
2. **There is no utility kidō in the list.** No flight, no invisibility, no teleport, no divination,
   no *Comprehend Language*. Every entry above is damage, control, a shield, or a small heal.
3. **Kidō use the class DC**, so they scale with the chassis and stop at Master (17th), never
   Legendary.

---

## 7 — The fifteen Spirits (subclasses)

Each entry gives: what it is, the **Released Form**, the **Release Technique** (1st, base rank 1),
the **Refined** upgrade (9th, base rank 5), and the **Full Release** (13th, base rank 7 for any
technique it adds).

**Standard ladders used throughout** (from §1.5):

| Shape | Printed | Value at rank 10 |
| :---- | :---- | :---- |
| Area, 2 actions | `2d6` @ r1, **H(+1) +1d6** | 11d6 (38.5) |
| Ranged single target, spell attack, 2 actions | `3d6` @ r1, **H(+1) +1d6** | 12d6 (42.0) |
| Strike + rider, 2 actions | `+1d6` @ r1, **H(+2) +1d6** | +5d6 (17.5) |
| Reaction | resistance + `2d6` @ r1, **H(+2) +1d6** | resistance + 5d6 |
| Full Release technique | `5d6` @ r7, **H(+1) +1d6** | 8d6 (28.0) *on top of the state* |

> **A note on canon fidelity.** Every technique name below is the character's actual named technique.
> Where canon gives a character **no** ability at a tier — Aizen has no Bankai, Grimmjow has no
> Segunda Etapa — this guide says so in the entry and marks the mechanic **[extrapolated]**. It does
> not quietly invent one and present it as canon.

---

### 7A — Soul Reaper Spirits (Shikai → Bankai)

#### ❁ Senbonzakura — *Thousand Cherry Blossoms* · **Byakuya Kuchiki**
**Release: "Scatter."** *A blade that refuses to be one blade. Aristocratic, precise, and utterly without mercy.*

**Shikai Form.** Your blade disintegrates into a slow cloud of petal-fine blades. Your Strikes gain
**reach 15 feet** and lose the two-hand and twin traits; your hands are empty. Your Strikes are
**not** affected by cover between you and the target — the blades simply go around it.

**Release Technique — Senbonzakura** [two-actions] · **15-foot emanation**, basic Reflex, **2d6**
slashing. The area is **difficult terrain** for enemies until the start of your next turn.
**Heightened (+1)** +1d6.
*Anchor: `Crushing Ground` (2d6, H+1, 2 actions, rank 1). The difficult terrain is `Grease`-tier and costs the d8 the raw damage would otherwise get.*

**Refined (9th).** The emanation increases to **20 feet**, and creatures that critically fail are
**off-guard** until the start of your next turn.

**Bankai — Senbonzakura Kageyoshi** *(Vibrant Display of a Thousand Cherry Blossoms)*. Two rows of a
thousand blades rise from the ground and scatter. You gain a second **20-foot emanation** centred on
a point within 60 feet. At the start of each of your turns, each enemy in **either** emanation takes
**5d6** slashing damage (basic Reflex). You can **Sustain** once per round to move the second
emanation up to 30 feet, or to switch modes:

- **Gokei** *(Total Scene)* — the blades amass into a sphere around one creature and implode. The
  second emanation shrinks to a **10-foot burst** centred on one enemy; that enemy takes **double**
  the damage and cannot benefit from cover or concealment against it.
- **Senkei** *(Slaughterscape)* — you abandon defence entirely. The blades condense into a thousand
  swords forming a 20-foot cage around you and one enemy. Neither of you can leave; your Strikes
  against that enemy ignore all resistances, and you may make one extra Strike each round at your
  current multiple attack penalty. **You lose Senbonzakura's reach and cover-ignoring**, and enemies
  outside the cage cannot be targeted by you.

*Anchors: 5d6 at rank 7 auto-heightening to 8d6 sits under `Impaling Briars` (druid rank 8, 10d6, emanation 100 ft.) and over `Shroud of Flame` (3d6 emanation, rank 3). Senkei's extra Strike is `Sever Four Dragonfly Wings`-shaped but costs your reach and your ability to hit anyone else — canon says Senkei "abandons the defensive attributes to focus entirely on offense."*

---

#### 🌑 Zangetsu — *Slaying Moon* · **Ichigo Kurosaki**
**Release: none.** *Zangetsu is never sealed. Canon Ichigo carries a released blade at all times.*

**Shikai Form.** An oversized cleaver with no guard and no proper hilt. Your spirit weapon's damage
die increases by one step and it gains **two-handed d12** if it did not already have a two-handed
trait. **Your first Release each encounter is free and requires no action** — you begin every
encounter already released.

**Release Technique — Getsuga Tenshō** [two-actions] *(Moon Fang Heaven-Piercer)* · **30-foot line**,
basic Reflex, **2d6** spirit damage. **Heightened (+1)** +1d6.
*Anchor: same ladder as Senbonzakura, traded from emanation to line for reach — the `Asterism` (cleric rank 4, line 30) shape.*

**Refined (9th) — Kuroi Getsuga** *(Black Moon Fang)*. The line increases to **60 feet**, the damage
**ignores resistances to spirit damage**, and creatures that critically fail take 1d6 persistent
spirit damage.

**Bankai — Tensa Zangetsu** *(Heaven Chain Slaying Moon)*. Canon compresses rather than expands:
everything Ichigo has is forced into a smaller, blacker blade. Your spirit weapon's damage die does
**not** increase (overriding Full Release's normal die-step). Instead:

- You gain a **+10-foot status bonus** to all Speeds, and **Flash Step's frequency becomes twice per
  round**.
- Getsuga Tenshō becomes **1 action**, and its line is 60 feet (90 with Refined).
- The first time each round you hit with your spirit weapon, you may **Step** as a free action.

*Anchor: `Qi Blast` is a 1-action 15-ft cone at 2d6/H+1 (monk rank 3); a 1-action 60-ft line at the same ladder is a wider area for the same dice, which is why this Bankai gives up its damage-die step to pay for it. The doubled Flash Step is `Flurry of Blows`-shaped action compression — the reason Tensa Zangetsu is the "speed" Bankai and not the "damage" one.*

---

#### ❄ Hyōrinmaru — *Ice Ring* · **Tōshirō Hitsugaya**
**Release: "Reign over the frosted heavens."** *The strongest ice zanpakutō. A patient dragon that thinks in centuries and is annoyed by your hurry.*

**Shikai Form.** A crescent blade on a chain, trailing an ice dragon. Your damage type becomes
**cold** (you may still choose spirit). On a critical hit, the target takes a **−5-foot status
penalty** to its Speeds until the end of your next turn.

**Release Technique — Ryūsenka** [two-actions] *(Hail Flower Dragon)* · Make a Strike with your
spirit weapon. On a hit it deals an additional **1d6** cold damage, and the target must succeed at a
Fortitude save or be **immobilized** in ice until the end of its next turn (Escape vs. your Reiatsu
DC). On a critical hit the ice shatters: the target instead takes an additional 2d6 cold and is
**off-guard** until the end of its next turn. **Heightened (+2)** +1d6.
*Anchor: the Strike-plus-rider ladder (+5d6 at rank 10). The immobilize is `Hell of 1,000,000 Needles`-shaped, gated behind landing a Strike **and** a failed save.*

**Refined (9th) — Guncho Tsurara** *(Icicle Volley)*. Ryūsenka can instead be made as a **ranged**
Strike against a target within 60 feet, hurling the blade on its chain; it returns to your hand
immediately.

**Bankai — Daiguren Hyōrinmaru** *(Grand Crimson Lotus Ice Ring)*. Ice sheathes you as wings, claws,
and a tail. You gain a **fly Speed** equal to your Speed and **cold resistance equal to your level**.

Three **four-petaled ice flowers** hang in the air behind you. They are not a timer on the Bankai —
canon is explicit that they mark how long until Daiguren Hyōrinmaru **matures**. Each is a charge.
**Once per round you may spend one petal-flower** to use one of:

- **Sennen Hyōrō** *(Thousand-Year Ice Prison)* — Four walls of ice erupt in a **20-foot burst**
  within 60 feet and close inward. Each enemy in the area attempts a Reflex save; on a failure it
  takes **5d6** cold damage and is **immobilized** until the end of its next turn; on a critical
  failure it is **restrained** for 1 minute instead (Escape vs. your Reiatsu DC).
  **Heightened (+1)** +1d6.
- **Hyōryū Senbi** *(Ice Dragon Whirling Tail)* — Swinging the blade in a line, you throw a crescent
  of overflowing ice. **60-foot line**, basic Reflex, **5d6** cold damage; creatures that fail are
  **slowed 1** until the end of their next turn. **Heightened (+1)** +1d6.
- **Zanhyō Ningyō** *(Remnant Ice Doll)* — [reaction] **Trigger** you are hit by an attack. **Effect**
  A doll of ice takes the blow. Reduce the damage by an amount equal to **twice your level**; the
  doll shatters.

**Perfected Bankai (17th)** restores one spent petal-flower at the start of each of your turns.

*Anchors: fly Speed at 13th is `Fly` (rank 4) granted late on a martial. Resistance = level is `Thermal Nimbus`. The three-charge structure is `Ikon`-shaped resource budgeting, and it is why this Bankai has no passive per-round damage where Senbonzakura Kageyoshi does — it front-loads into three big, chosen moments instead.*

---

#### 🜂 Ryūjin Jakka — *Flowing Blade-like Flame* · **Genryūsai Shigekuni Yamamoto**
**Release: "Reduce all creation to ash."** *The oldest and strongest fire zanpakutō in Soul Society. It does not burn things down so much as decide they are finished.*

**Shikai Form.** The blade sheathes itself in flame. Your damage type becomes **fire** (you may still
choose spirit) and your spirit weapon gains **deadly d8**. You gain **fire resistance equal to half
your level**.

**Release Technique — Ennetsu Jigoku** [two-actions] *(Scorching Heat Hell)* · **15-foot emanation**,
basic Reflex, **2d6** fire; creatures that fail also take **1d4 persistent fire**.
**Heightened (+1)** +1d6 and +1 persistent die at every other increment.
*Anchor: `Shroud of Flame` (sorcerer rank 3, 3d6 fire, 10-ft emanation, persistent fire on a failure). Ours enters at rank 1 with a smaller die.*

**Refined (9th).** The emanation increases to **20 feet**, and the ground within it becomes
**difficult terrain** from burning debris until the end of your next turn.

**Bankai — Zanka no Tachi** *(Longsword of the Remnant Flame)*. Canon inverts every expectation: the
Bankai does not release more fire, it **pulls all of it into the blade**. The sword blackens and
looks burnt out. Everything around you dries and cracks — this Bankai is not free to hold.

Your spirit weapon's damage die increases by **two** steps instead of one. You lose your fire
resistance while it is active. At the start of each of your turns, each creature **other than you**
within 30 feet — allies included — takes **1d6** fire damage from ambient heat, with no save.

Once per round you may **Sustain** to select one cardinal aspect, which lasts until you select
another:

| Aspect | Effect |
| :---- | :---- |
| **Higashi: Kyokujitsujin** *(East, Rising Sun Blade)* | Your Strikes ignore all resistances and immunities, and a creature damaged by your spirit weapon **can't regain Hit Points** and its regeneration and fast healing are suppressed until the end of your next turn. |
| **Nishi: Zanjitsu Gokui** *(West, Setting Sun Ultimate Form)* | You are wreathed in heat. You gain **fire immunity** and **resistance to all damage equal to half your level**; a creature that damages you with an unarmed attack, a melee weapon, or a Grapple takes **4d6** fire damage. |
| **Minami: Kaka Jūmanokushi Daisōjin** *(South, Great Funeral Pyre of 1,500,000)* | The ash of everything your flames have killed rises in a **20-foot emanation**. Enemies that end their turn in it must succeed at a Reflex save or be **grabbed** by ash-figures (Escape vs. your Reiatsu DC). The figures take no actions and are not creatures. |
| **Kita: Tenchi Kaijin** *(North, Heaven and Earth End in Ashes)* | [two-actions, once per round] A **60-foot line** of flame, basic Reflex, **5d6** fire. This damage **cannot be reduced by resistance to fire, by Blut Vene, or by Hierro**. **Heightened (+1)** +1d6. |

*Anchors: Higashi is `Red-Gold Mortality` (exemplar **2**) escalated to an automatic effect at 13th. Nishi is `Thermal Nimbus` plus a `Fire Shield` retributive rider (rank 4 spell, 2d6 → ours is 4d6 at 13th). Minami deliberately produces **no creatures** — the class has no minions, so the ash grabs and does nothing else. Kita's resistance-piercing is the canon note that "not even Blut Vene can block this attack," and it is the only unresistable damage in the class. The friendly-fire clause is the price.*

**Design note.** This is the most complex Bankai in the class and the only one that damages your own
party. That is deliberate and canon — Yamamoto's Bankai is a liability to everyone standing near it.
If your table dislikes friendly fire, the cleanest fix is to exempt allies and reduce the die steps
from two to one.

---

#### 🌘 Kyōka Suigetsu — *Mirror Flower, Water Moon* · **Sōsuke Aizen**
**Release: "Shatter."** *A spirit of perfect deception. It does not lie to your enemies. It lies to their senses, and it lies constantly.*

**Shikai Form — Kanzen Saimin** *(Complete Hypnosis)*. Canon's condition is precise and this
implements it literally: **the target must have seen your Shikai release**, and thereafter they are
in your hypnosis every time you release. The blind are immune.

When you Release, and when a creature that can see first observes you while released, that creature
must succeed at a **Will save** against your Reiatsu DC or be **hypnotized** for 1 minute. While
hypnotized, you control what that creature perceives about form, shape, mass, feel, and smell — in
rules terms:

- The creature perceives you **5 feet from where you actually stand**. Attacks against you from it
  require a **DC 5 flat check**.
- You are **hidden** from it whenever you are not adjacent to it, without needing to Hide.
- A creature that **critically succeeds** on its save is immune for 24 hours. A creature that
  succeeds is immune for 10 minutes. A creature that **critically fails** is hypnotized for 1 hour
  and, once per encounter thereafter, is automatically hypnotized when you Release — this is the
  "seen it once, falls to it forever" clause.
- A creature that **cannot see** is unaffected entirely.

**Release Technique — Shikake** [two-actions] *(The Setup)* · Range 30 feet, one creature, Will save.
**Failure** the target treats one creature of your choice within its reach as if it were you, and
treats you as an ally, until the end of its next turn. **Critical Failure** as failure, for 2 rounds.
This is an illusion, mental, and visual effect.
*Anchor: `Illusory Creature`/`Mislead` territory compressed to a focus effect with a 1-round duration. The "treats you as an ally" clause is `Charm`-shaped, which is why it is Will-based, mental, and breaks the moment the illusion is contradicted by the GM's judgement.*

**Refined (9th).** The flat check from your Shikai form increases to **DC 6**, and Shikake's failure
effect also makes the target **off-guard** to the misidentified creature.

**Full Release — Kanzen Saimin: Sōten Kisshun** ***[extrapolated]***

> **Canon gives Aizen no Bankai.** He never releases one, never names one, and the story treats
> Kyōka Suigetsu's Shikai as already being the strongest ability in the setting — that is the point
> of the character. This entry is therefore **invented**, and it is built as an *extension of the
> Shikai* rather than a new form, which is the only honest way to do it.

All enemies within **60 feet** who can see you must attempt the Shikai save, **including those who
previously succeeded or became immune**. Hitting you no longer ends the effect; only a critical hit
does. Once per round you may **Sustain** to force one hypnotized creature to attempt a Will save; on
a failure it is **confused** until the end of its turn.

*Anchor: `Confusion` (rank 4) as a sustained, single-target, save-every-round effect at 13th level is well behind the rank-4 spell's area version. The re-save clause is the real power, and it is why this Full Release grants no damage, no resistance, no Speed, and no die-step beyond the base.*

---

### 7B — Hollow Spirits (Resurrección → Segunda Etapa)

A Hollow's power is not carried, it is **sealed inside them**; the "sword" is the fragment of mask
that holds it shut. Resurrección uses the same action, cost, and duration rules as Release (§4.7).

---

#### 🐆 Pantera — *Panther* · **Grimmjow Jaegerjaquez**
**Release: "Grind."** *A predator that has never once been bored. Speed, claws, and appetite.*

**Resurrección Form.** Your mask-fragment dissolves into white armour, claws, and a whip of a tail.
You gain two **claw** unarmed attacks: **1d8 slashing**, **agile**, **finesse**, in the brawling
group. Your Speed increases by **10 feet** (this stacks with Sonido).

**Release Technique — Garra de la Pantera** [two-actions] *(Claw of the Panther)* · You fire
crystalline darts from your elbow. **30-foot cone**, basic Reflex, **2d6** piercing damage; the area
is littered with shards and becomes **difficult terrain** for enemies until the start of your next
turn. **Heightened (+1)** +1d6.
*Anchor: `Spray of Stars`/`Fungal Exhalation` cone shape on the standard area ladder. Canon fires "up to five" darts; the cone abstracts them.*

**Refined (9th).** Your claws' damage die increases to **1d10**, and after using Garra de la Pantera
you may **Step** as a free action.

**Segunda Etapa — Desgarrón** ***[extrapolated form, canon technique]***

> **Canon gives Grimmjow no Segunda Etapa** — Ulquiorra is explicitly the only Espada who reached
> one. The *technique* below is canon (Desgarrón is Grimmjow's self-declared strongest attack); the
> **second released form** is invented, and is deliberately the least transformative of the five
> Hollow entries for that reason.

Your Speed increases by another **10 feet**, and your claws gain **deadly d10**. Once per round when
you critically hit with a claw, you may immediately make an additional claw Strike against the same
target at your current multiple attack penalty.

Additionally, **Garra de la Pantera**'s cone increases to **60 feet**, and creatures that critically
fail against it take **2d6 persistent bleed** damage from embedded shards.

*Anchor: a shape upgrade rather than a new action, because Grimmjow's actual strongest attack — **Desgarrón**, which canon has him name as such — is placed at his Final Release (§9.2) instead. The prototype's `Rending Barrage` (three Strikes for two actions, each escalating MAP) was the most aggressive line in that document and does not survive into this version at all.*

---

#### 🦇 Murciélago — *Bat* · **Ulquiorra Cifer**
**Release: "Enclose."** *Emptiness given form. Cold, precise, and genuinely curious about what a heart is.*

**Resurrección Form.** Black membranous wings, a tattered coat of energy, and green tear-tracks. You
gain a **fly Speed** equal to your Speed. Your spirit weapon becomes **Luz de la Luna** *(Light of the
Moon)*, a javelin of hardened green energy: **1d10 piercing**, versatile S, **reach**, and it re-forms
in your hand instantly if thrown or dropped.

**Release Technique — Cero Oscuras** [two-actions] *(Dark Hollow Flash)* · Range 90 feet, one
creature. Make a **ranged spell attack** using your Reiatsu DC's proficiency and key attribute.
**3d6** spirit damage, doubled on a critical hit. **Heightened (+1)** +1d6.
*Anchor: the ranged single-target ladder (12d6 at rank 10), sitting between `Glacial Heart` (witch rank 5, 10d6) and `Elemental Blast` (sorcerer rank 5, 8d6). A spell attack roll rather than a save is what buys the higher die count.*

**Refined (9th).** On a critical hit, the target is **off-guard** until the start of your next turn,
and Cero Oscuras gains a **5-foot burst** at the target's location dealing half damage to other
creatures in it (basic Reflex).

**Segunda Etapa** *(Second Stage)*. **The only canon Segunda Etapa in the series.** Your remaining
humanity sheds: black fur, a long whip-like tail, horns, and the mask gone entirely.

- Your fly Speed increases by **20 feet**.
- You gain **resistance to all damage except spirit equal to half your level**.
- **High-Speed Regeneration.** Your Regeneración fast healing **doubles**, and it now restores lost
  limbs. (Canon: it regenerates everything except organs and the brain — a GM ruling more than a
  rule.)
- You gain **Lanza del Relámpago**:

> **Lanza del Relámpago** [two-actions] *(Lance of the Lightning)* · **Frequency** once per round
> You forge a javelin of crackling green lightning and throw it. Range 120 feet. Make a ranged spell
> attack against one creature; on a hit it takes **5d6** electricity damage (doubled on a critical
> hit). Whether or not you hit, the lance detonates in a **15-foot burst** at that point: **5d6**
> fire damage, basic Reflex. **Heightened (+1)** +1d6 to both.

*Anchor: a rank-7 entry attack-plus-area at 5d6/5d6 heightening to 8d6/8d6 sits under `Chthonian Wrath` (sorcerer rank 5, 4d6+4d6 in a 60-ft cone) once the area is cut to a 15-ft burst, and the doubled fast healing lands at `Sanguine Mastery`'s half-your-level — the number the Hollow Lineage was held below at 5th (§5.2) precisely so this could reach it at 13th.*

---

#### 👑 Arrogante — *Arrogance* · **Baraggan Louisenbairn**
**Release: "Rot."** *The God-King of Hueco Mundo. His aspect of death is aging, and he is in no hurry, because nothing that lives can outlast him.*

**Resurrección Form.** Your flesh sloughs away and you stand as a crowned skeleton in a dark cloak.
Your spirit weapon becomes **Gran Caída** *(Great Fall)*, a vast double axe: **1d12 slashing**,
two-handed, **sweep**, **forceful**. You become immune to disease, poison, and the **doomed**
condition's worsening (you can still gain doomed, but it never increases past 1).

**Release Technique — Respira** [two-actions] *(Breath of Death)* · A black miasma spills from you in
a **15-foot emanation**, basic Fortitude, **2d6** void damage. Creatures that fail are **enfeebled 1**
for 1 minute as they age; on a critical failure, **enfeebled 2** and **clumsy 1** instead.
The miasma lingers: until the start of your next turn, an enemy that enters or ends its turn in the
area takes **1d6** void damage (no save). **Heightened (+1)** +1d6 and +1d6 to the lingering damage
at every other increment.
*Anchor: `Tempest Surge` (druid rank 1) applies **clumsy 2** on a failed basic save at rank 1, which is the precedent that a rank-1 focus effect may carry a real condition. Void damage plus enfeebled is `Touch of Undeath` shaped. The lingering area is `Shroud of Flame`'s persistence moved into the terrain.*

**Refined (9th).** Respira's emanation increases to **20 feet**, and objects and unattended structures
in the area are **broken** (already-broken objects are destroyed). A creature that critically fails
also can't regain Hit Points until the end of its next turn.

**Segunda Etapa — Respira Absoluta** ***[extrapolated form, canon principle]***

> **Canon gives Baraggan no Segunda Etapa**; his Resurrección is already treated as the end state.
> The form below extrapolates from what canon *does* establish: Respira ages **everything** it
> touches, including attacks aimed at him and the ground he stands on, and Baraggan can control its
> speed.

Respira becomes permanent and free. You emit a **20-foot emanation** of aging miasma for as long as
the Segunda Etapa lasts. Enemies that end their turn in it take **3d6** void damage (basic Fortitude)
and are **enfeebled 1** for 1 round on a failure.

Additionally, **your decay consumes what is aimed at you**: when a creature within the emanation
targets you with an attack or a spell, it must succeed at a **DC 5 flat check** or the attack or
spell ages to nothing before it lands and has no effect. A creature that succeeds is temporarily
immune to this flat check for 1 minute.

*Anchor: the flat check is `Blur`'s DC 5 with a temporary-immunity clause bolted on so it cannot lock down a single attacker all fight. The permanent emanation at 3d6 is below `Diamond Dust` (cleric rank 4, 2d6 in a 15-ft emanation, aura) once you account for it arriving at 13th rather than 7th.*

---

#### 🐺 Los Lobos — *The Wolves* · **Coyote Starrk**
**Release: "Kick about."** *The loneliest Espada. His power was never sealed in a sword — it was sealed in another person, because he could not bear to be alone with it.*

**Resurrección Form.** Your spirit weapon splits into **two ornate pistols**. Each is a ranged
weapon: **1d6 piercing**, **agile**, **range increment 60 feet**, **reload 0**, and they need no
ammunition. You may wield and fire both. You also gain a grey wolf-pelt coat and bandolier; your
Speed increases by 5 feet.

> **On the second voice.** Canon's Los Lobos is two beings sharing one power. The pistols speak. This
> is a **roleplaying** fact, not a familiar and not a minion — the second voice takes no actions and
> has no statistics, exactly as the prototype ruled for the zanpakutō spirit.

**Release Technique — Cero Metralleta** [two-actions] *(Machine-Gun Hollow Flash)* · You fire an
uncountable barrage from both pistols. **60-foot cone**, basic Reflex, **2d6** force damage. You may
instead shape it as a **120-foot line**. Canon has Starrk claim he can fire a thousand at once.
**Heightened (+1)** +1d6.
*Anchor: the standard area ladder with an unusually large area, paid for by the pistols' small damage die (1d6 agile) — this Spirit has the weakest basic Strike of the fifteen and the largest technique area.*

**Refined (9th).** You may **Sustain** Cero Metralleta at the start of your next turn to fire it again
in a different direction without spending a Reiatsu Point; canon notes he can change its direction
mid-fire.

**Segunda Etapa — Colmillo** *(Fang)* ***[extrapolated form, canon technique]***

> **Canon gives Starrk no Segunda Etapa.** The wolves themselves are canon — Starrk divides his soul
> and the fragments attack and detonate.

You divide your soul. **Eight spirit wolves** appear in unoccupied squares within 30 feet. They are
**not creatures**: they have no statistics, take no actions, cannot be attacked, and do not flank.
They are a resource you spend.

> **Colmillo** [one-action] · **Requirements** at least one wolf remains
> Expend any number of wolves. Each wolf you expend moves to a point within 60 feet and detonates in
> a **10-foot burst**: **3d6** force damage, basic Reflex. A creature in more than one burst takes
> damage only from the highest. **Heightened (+1)** +1d6.

At the start of each of your turns, you regain 1 wolf (to a maximum of eight).

*Anchor: this is the closest the class comes to minions and it deliberately stops short — no statistics, no actions, no flanking, so it never touches the Summoner's or Necromancer's design space. Mechanically it is a **charge pool** like Hyōrinmaru's petal-flowers, spendable at one action for area damage. Eight charges at 3d6 in a 10-ft burst compares to `Whirling Flames` (oracle rank 3, 5d6 in a 5-ft burst) once you account for the one-action cost and the ability to stack bursts on separated targets.*

---

#### 🦈 Tiburón — *Shark* · **Tier Harribel**
**Release: "Destroy."** *A spirit that measures everything against the ocean and finds it wanting. Sacrifice, not slaughter.*

**Resurrección Form.** Water erupts around you and you step out of it. Your spirit weapon becomes a
broad hollow-edged blade shaped like a shark's tooth: **1d12 slashing**, two-handed, **sweep**. You
gain a **swim Speed** equal to your Speed, you can breathe water, and you can create water freely
from the gill-slits along the blade.

**Release Technique — La Gota** [two-actions] *(The Drop)* · **30-foot cone**,
basic Reflex, **2d6** slashing damage from a blade of compressed water; creatures that fail are
pushed **10 feet** away from you. **Heightened (+1)** +1d6.
*Anchor: `Pulverizing Cascade` (rank 3, 5d6 in a 10-ft burst, water) scaled back to a rank-1 entry, plus the forced movement `Sundering Wave` pays a die size for.*

**Refined (9th) — Cascada** *(Waterfall)*. The cone increases to **40 feet**, creatures that
critically fail fall **prone**, and the area becomes **difficult terrain** from standing water until
the start of your next turn.

**Segunda Etapa — Hirviendo** *(Boiling)* ***[extrapolated form, canon technique]***

> **Canon gives Harribel no Segunda Etapa.** Hirviendo is canon — she boils away all water around her,
> including ice.

Water rises around you in a **20-foot emanation**, difficult terrain for enemies. Once per round when
you hit with your spirit weapon you may push the target 5 feet. La Gota may be used as a **60-foot
line** instead of a cone.

You also gain:

> **Trident** [two-actions] · **Frequency** once per round
> You infuse the blade and fire a high-force slash in a series of three. Make **three** ranged Strikes
> with your spirit weapon against one creature within 60 feet, each at your current multiple attack
> penalty; **the penalty does not increase until all three are made**.

And **Hirviendo** [free-action], once per round: you boil the water around you. All water and ice
within your emanation — including that created by other creatures, and including effects with the
water or cold trait that create terrain — is destroyed, and each enemy in the emanation takes **2d6**
fire damage.

*Anchor: `Trident` is `Sever Four Dragonfly Wings` restricted to a single target and to three Strikes, which is a strictly worse version of a level-9-equivalent exemplar action, granted at 13th. Hirviendo is terrain denial with a small damage rider — the counterpart to the Quincy's `Seal the Art`, aimed at battlefield control effects rather than at buffs.*

---

### 7C — Quincy Spirits (Schrift → Vollständig)

A Quincy has no spirit in their weapon. What they have is a **Schrift** — a single letter of the
alphabet, granted by their king, that names the one thing they are. Your Schrift replaces the
Released Form; **Vollständig** *(Complete)* replaces the Full Release.

> **On the choice of five.** Yhwach is excluded by request. The five below are the most consistently
> fan-ranked Quincy in the series and, more usefully, the five whose Schrift produce **five
> mechanically distinct** classes of effect: a reflector, a blaster, a redistributor, a mobile
> striker, and a wall. **Alternates**, if you want different names on the same chassis:
> **Askin Nakk Le Vaar (D: The Deathdealing)** — lethal-dose manipulation, a poison/condition
> controller; **Lille Barro (X: The X-Axis)** — pierces all cover and barriers, an anti-defence
> sniper; **Bambietta Basterbine (E: The Explode)** — delayed-detonation area control.

---

#### 🅰 Antithesis — *A* · **Uryū Ishida**
*The last Quincy of the old line, and the only one who chose his letter's meaning himself. Antithesis reverses two events that have already happened.*

**Schrift Form.** Your Heilig Bogen takes its full shape — a broad blue bow of light. Your spirit
weapon gains the **Spirit Bow** profile if it did not have it, its damage die increases by one step,
and its range increment increases to **100 feet**. You also gain **Seele Schneider** *(Soul Cutter)*:
your bow may be used as a melee weapon, **1d8 slashing**, **finesse**, whose vibrating reishi edge
means its Strikes **ignore resistance to slashing damage**.

**Release Technique — Antithesis** [reaction] · **Trigger** You or an ally within 30 feet takes
damage from a creature you can see. **Effect** You reverse the two events. The triggering creature
takes **2d6** spirit damage, and the target of the trigger gains **resistance equal to your level**
against the triggering damage. **Heightened (+2)** +1d6.
*Anchor: the reaction ladder from §1.5 — resistance = level (`Thermal Nimbus`) plus 2d6 at rank 1 rising to 5d6 at rank 10. This is `Splitting Void` (Bakudō #81) with the damage reflected instead of absorbed, which is exactly what Antithesis does in canon.*

**Refined (9th) — Licht Regen** *(Light Rain)*. You additionally gain:

> **Licht Regen** [two-actions] · A volley of arrows blackens the sky. **30-foot cone**, basic Reflex,
> **6d6** piercing damage. Creatures that critically fail are **off-guard** until the start of your
> next turn. **Heightened (+1)** +1d6.

*Base rank 5, so this enters at 6d6 and reaches 9d6 at rank 10 — under the standard area ladder's 11d6, because it comes as an addition to an existing Release Technique rather than replacing it.*

**Vollständig — Quincy: Letzt Stil** *(Last Form)* ***[canon, with its canon cost]***

Unlike every other Vollständig, Letzt Stil is not a wings-and-halo transformation — it is the old
Quincy technique of **removing the limiter** on your own bow. A blue quiver of pure reiryoku forms at
your right shoulder and drinks the ambient reishi.

- Your spirit weapon's damage die increases by **two** steps instead of one.
- Your Strikes ignore all **resistances** to physical and spirit damage, and treat cover as one step
  less (as Blut Arterie, and it stacks with choosing Vene, meaning **you may run Vene and this
  simultaneously** — the one exception in the class to Blut's exclusivity).
- **Licht Regen** becomes a **60-foot cone**, and once per round you may use it without spending a
  Reiatsu Point.

**The cost is canon and it is real.** When Letzt Stil ends, you lose access to **your Schrift Form,
your Release Technique, Licht Regen, Vollständig, and your entire reiatsu pool** until you complete
**24 hours of rest**. You keep your weapon, your proficiencies, and your feats.

*Anchor: a free 60-ft cone once per round at 9d6 rank-10 is `Dragon Breath` (sorcerer rank 3, 5d6 cone) scaled to a 13th-level state. The drawback is canon and it is the reason this Vollständig grants two die steps where every other grants one. Canon's fifth Gintō, **Sprenger**, is placed where it belongs: Uryū's Final Release (§9.3).*

---

#### 🔥 The Heat — *H* · **Bazz-B**
*Loud, disloyal, and the best pure offensive Schrift in the Wandenreich. He controls heat by counting on his fingers.*

**Schrift Form.** Your reishi runs hot. Your spirit weapon's damage type becomes **fire** (you may
still choose spirit), it gains **deadly d8**, and you gain **fire resistance equal to half your
level**. Canon's escalation is literal — **Burner Finger One** through **Five** — so:

**Release Technique — Burner Finger** [two-actions] · Choose a number of fingers from one to five.
Each choice is a different effect, and each costs the same single Reiatsu Point:

| Fingers | Effect |
| :---- | :---- |
| **One** | Range 60 ft., one creature. Ranged spell attack, **3d6** fire, doubled on a crit. **H(+1)** +1d6 |
| **Two** | Range 60 ft., two creatures. As **One**, but **2d6** each against two targets. **H(+1)** +1d6 |
| **Three** | **30-foot line**, basic Reflex, **2d6** fire. **H(+1)** +1d6 |
| **Four** | A blade of fire with an elongated crossguard forms around your hand and you slash. **15-foot emanation**, basic Reflex, **2d6** fire; creatures that fail take 1d4 persistent fire. **H(+1)** +1d6 |
| **Five** | **30-foot cone**, basic Reflex, **2d6** fire; the ground becomes difficult terrain until the start of your next turn. **H(+1)** +1d6 |

*Anchor: this is one technique with five shapes, each independently on a standard ladder from §1.5 — the "One" line is the ranged single-target ladder, the rest are the area ladder. No option is better than another at every moment, which is the whole design; compare a Kineticist choosing an impulse's shape.*

**Refined (9th) — Deeper Burn.** All five options gain their next increment early (treat your
rank as one higher for Burner Finger only), and **Five** additionally leaves the difficult terrain
burning until the end of your next turn, dealing 2d6 fire to a creature that enters or ends its turn
there.

**Vollständig — Deus Ex Machina** *(canon: "The Heat" at full output)*. Wings and a halo of blue
reishi. You gain a **fly Speed** equal to your Speed, **fire immunity**, and:

- Burner Finger's **Five** option becomes a **60-foot cone**.
- Once per round, when you damage a creature with fire, it takes **2d6 persistent fire** damage; the
  flat check to end it is DC 20 rather than DC 15.

*Anchor: the persistent-damage-with-a-worse-flat-check lever is the `Bloody Debilitation` tier the Slayer guide cites, applied to fire. Fire immunity at 13th is the same grant Ryūjin Jakka's Nishi aspect makes.*

---

#### ⚖ The Balance — *B* · **Jugram Haschwalth**
*Yhwach's second, and the coldest ability in the series: he does not stop misfortune, he moves it onto someone else.*

**Schrift Form.** Your spirit weapon becomes **Freund Schild** *(Substitute Shield)*, canon's name
for Haschwalth's spirit weapon — he fights with a blade, not a bow: **1d8 slashing**, versatile P, **parry**. You gain a
**+1 circumstance bonus to AC** while you have at least 1 Reiatsu Point remaining.

*This is the one flat numeric bonus in the class, it is a **circumstance** bonus so it collides with cover and with `Raise a Shield`, and it switches off the moment you spend your pool — which, given Rising Pressure, is most of the fight. It exists because The Balance is a defensive Schrift and the alternative was giving it resistance that three other Spirits already have.*

**Release Technique — The Balance** [reaction] · **Trigger** You take damage from a creature or effect
you can perceive. **Effect** You redistribute the harm. Reduce the damage you take by **twice your
level**, then choose one enemy within 60 feet: it takes **2d6** spirit damage, and until the end of
its next turn it takes a **−1 status penalty** to saving throws. **Heightened (+2)** +1d6.
*Anchor: the reaction ladder again, with the resistance expressed as flat reduction (`Zanhyō Ningyō` uses the same twice-your-level figure) plus a debuff instead of a straight reflect. Canon: damage he takes is negated, and the one who dealt it suffers for having landed it.*

**Refined (9th).** The Balance's status penalty applies to **AC and saving throws**, and if the
triggering damage would have reduced you to 0 Hit Points, you instead remain at 1 Hit Point. This
last clause functions once per day.

**Vollständig — The Balance, at Night.** Canon's Haschwalth holds Yhwach's power while his king
sleeps. Wings of white light, a halo, and a sword in each hand.

- Your Release Technique's damage reduction increases to **three times your level**.
- Once per round, when an **ally** within 60 feet would take damage, you may redirect that damage to
  yourself; you then apply your Release Technique's reduction to it as a free action without
  spending your reaction. You may do this even while your reaction is spent.
- **Sight of the Balance:** at the start of each of your turns, choose one enemy within 60 feet. Until
  the start of your next turn, that creature's fortune and misfortune are yours to allot — it takes a
  **−2 status penalty** to its next saving throw, and the next ally who attacks it gains a
  **+1 status bonus** to that attack roll.

*Anchor: the ally-redirect is `Shield Other`/Champion's-reaction shaped — a Champion reduces damage to an ally by 2 + level at 1st, so redirecting-then-reducing at 13th is comfortably inside precedent. The status bonus to an ally's attack is `Bless`-tier at +1 and single-target.*

---

#### ⚡ The Thunderbolt — *T* · **Candice Catnipp**
*The most aggressive Schrift in the Sternritter. She does not aim; she becomes the lightning and arrives.*

**Schrift Form.** Your spirit weapon becomes a **sword of arcing electricity**: **1d8 slashing**,
versatile P, and its damage type becomes **electricity** (you may still choose spirit). You gain
**electricity resistance equal to half your level**, and your Flash Step becomes an
**electricity-flavoured teleport** — it ignores difficult terrain and you may pass through
creatures' spaces, though you can't end there.

**Release Technique — Galvano Blast** [two-actions] · **60-foot line**, basic Reflex, **2d6**
electricity damage. Creatures that fail are **stunned 1**; creatures that critically fail are
**stunned 2**. **Heightened (+1)** +1d6.

> **This carries the incapacitation trait.** Stunned on a failed basic save at rank 1 is above the
> curve without it — compare `Glacial Heart` (witch rank 5) and `Medusa's Wrath` (monk), both of
> which are incapacitation. Against a creature of higher level than you it will usually do nothing
> but damage, and that is the intended shape.

**Refined (9th) — Galvano Javelin.** You may instead throw a javelin of lightning: range 90 feet, one
creature, ranged spell attack, **6d6** electricity doubled on a crit, and the target is **stunned 1**
on a hit (incapacitation). Base rank 5, **Heightened (+1)** +1d6.

**Vollständig — Thunderbolt Form.** Your hair becomes lightning and your wings arc
white. You gain a **fly Speed** equal to your Speed and **electricity immunity**, and:

- You emit a **10-foot emanation** of live current. A creature that ends its turn in it takes **3d6**
  electricity damage (basic Reflex).
- Once per round when you hit with your spirit weapon, arcs jump: one other creature within 15 feet
  of the target takes **3d6** electricity damage (basic Reflex).

*Anchor: `Thermal Nimbus` (kineticist 4) does half-your-level damage to anything entering its aura at **level 4**; 3d6 at 13th in a 10-ft emanation is comfortably inside that precedent. The chain-arc is `Chain Lightning` compressed to a single extra target.*

---

#### 🗿 The Miracle — *M* · **Gerard Valkyrie**
*The Heart of the Soul King. Break him and he does not weaken — he gets bigger. The only way to beat The Miracle is to stop hitting it.*

**Schrift Form.** You take up an enormous sword and shield of white reishi. Your spirit weapon
becomes **1d12 slashing**, two-handed, **forceful**, **shove**. Your maximum Hit Points increase by
your level, and you gain a **+1 circumstance bonus to saves against effects that would reduce your
Hit Points to 0**.

**Release Technique — The Miracle** [free-action] · **Trigger** You take damage from an enemy.
**Frequency** once per round. **Effect** Damage is a promise of growth.

Gain **2 Miracle points** (to a maximum of 10). While you have 1 or more Miracle points you gain
**resistance to all damage equal to the number of Miracle points you have**. You may spend any
number of Miracle points as a free action at the start of your turn; for each point spent, until the
end of your turn your spirit weapon's Strikes deal **+1d6** damage of its type.

Miracle points are lost when the encounter ends.

*This is the one Release Technique in the class that is a **free action** and costs a Reiatsu Point only the first time each encounter; after that it is free, because a Schrift that charges you to be hit is not The Miracle.*

*Anchor: resistance capped at 10 sits at `Thermal Nimbus`'s resistance-equal-to-level for a 10th-level character and is reached only by being hit five times. The damage conversion is the `Rage`/`Panache` shape — a spendable combat resource that converts defence into offence, and it is capped by the same pool.*

**Refined (9th) — Blitz of the Hero.** Your maximum Miracle points increase to **15**. When you spend
Miracle points, you also gain a **+5-foot status bonus** to Speeds per point spent, to a maximum of
+20 feet, until the end of your turn.

**Vollständig — Bailar de Valquiria / The Miracle Made Flesh.** Golden wings, a mane of light, and a
body that reassembles itself.

- You gain **fast healing equal to your current Miracle points**.
- When you are reduced to 0 Hit Points while you have at least 5 Miracle points, you instead remain
  at **1 Hit Point**, lose 5 Miracle points, and your spirit weapon's damage die increases by one
  step for the rest of the encounter. This can occur any number of times as long as you have the
  points to pay for it.
- Miracle points are no longer capped, but you still gain only 2 per round.

*Anchor: this is the class's only true "does not die" ability and it is the reason **Unsealed** (§4.8) was priced at 110 rather than 190 — `Hero's Defiance` (champion rank 10, BCS 190) is a free-action full stop on death; this one is paid for in a resource the enemy controls, since it only accrues when you are being hit, and each save costs half your maximum pool.*

---

## 8 — Soulbound feats

A full class wants ~60 feats. This is a spine of **44**, enough to build a character at every level
without gaps. Feats marked **[SR]**, **[H]**, or **[Q]** require that Lineage.

### 8.1 First level

| Feat | Effect | PF2e anchor |
| :---- | :---- | :---- |
| **Additional Kidō** **[SR]** | Learn one more kidō. **Special** take up to three times. | `Domain Initiate` / `Basic Witchcraft` |
| **Sheathed Draw** | When you roll initiative, manifest your spirit weapon and Release as a single free action. | `Quick Draw` (rogue/ranger 1) |
| **Reader of Threads** | Recall Knowledge about spirits, haunts, and undead using Spirit Lore as a free action once per round; learn one extra piece of information on a success. | `Dubious Knowledge` + `Thaumaturge's Investigation` |
| **Zanjutsu Footwork** | When you critically hit with your spirit weapon, Step as a free action. | `Nimble Dodge`-tier; `Qi Center`'s free Step at monk 18, restricted to crits here |
| **Pesquisa** **[H]** | Spirit Sense's range increases to 120 feet and you learn each detected creature's approximate level relative to yours. | `Detect Magic`-shaped; canon Arrancar ability |
| **Hirenkyaku Drill** **[Q]** | You may use Flash Step at 1st level instead of 3rd, but only once per encounter until 3rd level. | Front-loads the class's answer to guardrail #4 (§11) |
| **Twin Fang** | While your spirit weapon has the twin or agile trait, your second Strike each round with it reduces your multiple attack penalty by 1. | `Twin Feint`; `Agile Grace` (swashbuckler 7) — this is weaker and earlier |

### 8.2 Second and fourth level

| Lvl | Feat | Effect | PF2e anchor |
| :---- | :---- | :---- | :---- |
| 2 | **Pressure Flare** [one-action] | Enemies within 15 feet must succeed at a Will save vs. your Reiatsu DC or be **frightened 1**. Once per encounter, no Reiatsu cost. | `Intimidating Glare` + `Dread Aura`; frightened 1 in a small emanation is `Demoralize` without the Intimidation check |
| 2 | **Guard the Threshold** [reaction] | When an ally within 15 feet takes damage from an undead, spirit, or incorporeal creature, reduce that damage by **2 + your level**. | Champion's reaction, exactly — but restricted to three creature types |
| 2 | **Kidō Focus** | When you use a kidō, spend 1 additional action to give the target a **−1 circumstance penalty** to its save. | `Spellshape` feats; `Conrasu Spell` tier |
| 2 | **Rapid Bala** **[H]** | When you use **Bala**, you may spend 1 additional action to use it again against the same or a different creature. Both uses apply and increase your multiple attack penalty as normal. | `Double Shot` (ranger 4) at 2nd on a cantrip with an agile penalty |
| 2 | **Gintō Reserve** **[Q]** | You prepare **3 Gintō** during daily preparations. Each may be spent as a free action to use **Gritz** without spending a Reiatsu Point. Unspent Gintō are lost at your next preparations. | `Alchemical Formula`-shaped daily consumables; BCS `AlchemicalFormula = 5` |
| 4 | **Shunpo Strike** [two-actions] | Flash Step, then Strike. Doesn't count against Flash Step's frequency. | `Sudden Charge` (fighter/barbarian 1) at 2 actions with no reaction-triggering |
| 4 | **Reiatsu Barrier** [reaction] | Spend 1 Reiatsu Point when you're hit to gain **resistance equal to your level** against that damage. | `Thermal Nimbus` as a one-shot reaction; Bakudō #81's number |
| 4 | **Chain Anchor** | When you critically hit a creature with your spirit weapon, it can't Step away from you until the end of its next turn. | `Attack of Opportunity` design space, approached from the other side |
| 4 | **Deep Breath** | You regain 2 Reiatsu Points instead of 1 the first time you use Steady the Breath each day. | `Meditative Wellspring` (monk 12) — much weaker, much earlier |
| 4 | **Cero Doble** **[H]** | **Cero** may be shaped as a **30-foot cone** instead of a 60-foot line, and creatures that critically fail against it are pushed **10 feet** away from you. | `Dragon Breath` (sorcerer rank 3) shape-swap; the push is `Sundering Wave`'s |

### 8.3 Sixth through twelfth level

| Lvl | Feat | Effect | PF2e anchor |
| :---- | :---- | :---- | :---- |
| 6 | **Kidō Combination** [free-action] | Immediately after using a destruction kidō, use a binding kidō against the same target for 1 fewer Reiatsu Point (minimum 0). Once per encounter. | `Spellstrike`-adjacent action compression, once per encounter |
| 6 | **Reactive Strike** | You gain the **Reactive Strike** reaction: when a creature within your reach uses a manipulate or move action, makes a ranged attack, or leaves a square during a move action, make a melee Strike against it; a critical hit disrupts a manipulate action. *(A reaper who stands still is the most dangerous thing on the field.)* | `Reactive Strike` is a **shared class feat at level 6** (`packs/pf2e/feats/class/shared-class-feats/level-6/`) — the same level Barbarian and Champion get it. Granted under its published name so the existing compendium item automates as-is |
| 6 | **Cut the Cord** | Your spirit weapon's Strikes ignore the first **5 points** of resistance to spirit damage. | `Cut from the Air`-tier; the exemplar's resistance-bypass ikons |
| 6 | **Borrowed Nature** | You take on a second Lineage's nature, partially and with effort. Full rules in **§8.6**. | `Hollow Mask` archetype (prototype §11); barbarian `Rage`; monk `Path to Perfection` |
| 6 | **Blut Discipline** **[Q]** | You may switch which Blut you have active as a **free action** twice per round instead of once. | Pure action economy on an existing free action |
| 6 | **Descorrer** **[H]** | Once per hour, open a Garganta: you and up to 5 allies teleport up to 500 feet to a location you can see or have visited. | `Dimension Door` (rank 4) as a once-per-hour class feat at 6th, range-limited to line of sight |
| 8 | **Rising Tide** | The first time each round that **Rising Pressure** grants you a Reiatsu Point, you also gain **temporary Hit Points equal to half your level** (minimum 2). They last until the start of your next turn and don't stack with themselves. | `Renewed Vigor` (barbarian **8**) grants temp HP equal to half your level **+ Con** for **one action**, rising to **level + Con** if you attacked that turn. This grants strictly less, for **no** action, and only after an enemy has connected with you or you with them |
| 8 | **Pressure Crush** [two-actions] | Spend 1 Reiatsu Point. Enemies in a **20-foot emanation** attempt a Fortitude save; on a failure they're **clumsy 1** and take a −5-ft. status penalty to Speeds for 1 minute. | `Tempest Surge`'s clumsy applied as an area debuff, no damage attached |
| 8 | **Zanjutsu: Hakuda** **[SR]** | You gain a **1d6 fist** unarmed attack with **agile**, **finesse**, **nonlethal**, and you may make one unarmed Strike as part of any Zanjutsu technique. | `Powerful Fist` (monk, BCS 10) plus a rider |
| 10 | **Perfected Technique** | Once per encounter, use your Release Technique without spending a Reiatsu Point. | `Free Casting`-tier; Slayer `Breath of Instinct` (BCS 30) at 15th — this is narrower and earlier |
| 10 | **Ghost Step** | Flash Step lets you move through creatures' spaces (you can't end there) and ignores difficult terrain. | `Wall Run`/`Water Step` (monk); `Ghostly Transformation` |
| 10 | **Reishi Mastery** **[Q]** | **Seal the Art**'s counteract rank increases by 1, and it costs no Reiatsu Point on a critical success. | Counteract-rank bumps are `Dispelling Slice`-shaped |
| 12 | **Soul Sever** | When you reduce a creature to 0 HP with your spirit weapon, immediately perform a Konsō on it as a free action with no check, permanently preventing it from rising as undead. | `Blade of Justice`'s finisher space; a narrative effect with no combat number |
| 12 | **Kidō Mastery** | Your destruction kidō deal an additional die of damage of their damage type. | `Reach Spell`/`Widen Spell` tier applied as a flat die; `Kineticist's Gate` bumps |
| 12 | **Segunda Piel Temprana** **[H]** | Hierro's resistance applies to **spirit** damage for 1 round each time you are critically hit. | An early, conditional taste of the 15th-level Lineage Mastery |
| 12 | **Deeper Crossing** | **Prerequisite** Borrowed Nature. The borrowed Aspect deepens and you can wear it twice per encounter. **§8.6**. | `Second Path to Perfection` (monk 11) |

### 8.4 Zanjutsu techniques **[SR]** — the Soul Reaper martial family

Available from 5th level via the **Zanjutsu** Lineage feature (§5.1); one is free, more can be taken
as class feats at the listed level. Each costs **1 Reiatsu Point**, uses the Strike ladders from
§1.5, and requires your spirit weapon to be Released.

| Lvl | Technique | Act. | Effect | Base rank |
| :---- | :---- | :---- | :---- | :---- |
| 5 | **Sōkotsu** *(Double Bone)* | 2 | Make **two** Strikes against one creature; the second doesn't increase your MAP. On a hit each deals **+1d6**. **H(+2)** +1d6 | 2 |
| 5 | **Hitotsume: Nadegiri** *(First: Clean Sweep)* | 2 | Stride up to your Speed, then make one Strike dealing **+1d6**; if the Strike hits, the target is **off-guard** until the end of your turn. **H(+2)** +1d6 | 2 |
| 8 | **Shitonegaeshi** *(Cushion Overturn)* | 1 | Make a Strike dealing **+1d6**; on a hit, you may Step as a free action, and the target can't Step until the end of its next turn. **H(+2)** +1d6 | 4 |
| 10 | **Nadegiri** *(Clean Sweep)* | 2 | Make one Strike against **each** enemy in your reach, each at your current MAP; the penalty doesn't increase until all Strikes are made. | 6 |
| 12 | **Ikkotsu** *(Single Bone)* | 2 | Make one Strike dealing **+4d6**; on a critical hit the target is **stunned 1** (incapacitation). **H(+1)** +1d6 | 6 |
| 14 | **Zanjutsu: Kendō** | 2 | Make one Strike. Before rolling, choose: it ignores all resistances and immunities to its damage type, **or** it treats the target's AC as 2 lower. On a hit, **+5d6**. **H(+1)** +1d6 | 8 |

*Anchors: `Sōkotsu` is `Flurry of Blows` with a die rider, gated behind a focus point. `Nadegiri` is `Whirlwind Strike` (fighter 10) at the same level. `Ikkotsu` is `Vicious Swing`'s big-single-hit shape with the stun carrying incapacitation. `Zanjutsu: Kendō`'s AC clause is `Certain Strike`/`Precise Debilitations` territory and is capped at −2 so it cannot combine with flanking and a status penalty to erase a boss's defence.*

### 8.5 Fourteenth through twentieth level

| Lvl | Feat | Effect | PF2e anchor |
| :---- | :---- | :---- | :---- |
| 14 | **Instant Full Release** | Full Release takes 1 action instead of 2. | `Quickened Casting`; `Instant Opening` |
| 14 | **Twin Pressure** | While in a Full Release, the emanation's Will save also applies to enemies that **enter** it, not only those that end their turn in it. | `Thermal Nimbus`'s trigger, exactly |
| 14 | **Vollständig Endurance** **[Q]** | When your Vollständig ends you are not fatigued, and you may spend 1 Reiatsu Point to extend it by 1 round, up to three times. | `Sustained` duration extension; a partial early `Perfected Full Release` |
| 16 | **Unbroken Chain** | When you would be reduced to 0 HP while released, spend 1 Reiatsu Point to remain at 1 HP instead. Once per day. | `Hero's Defiance` (champion rank 10) at a fraction of the effect and a Reiatsu cost |
| 16 | **Reiatsu Flood** | Your Rising Pressure per-encounter cap increases by 1. | The single most dangerous feat in the class — see §11.1 |
| 18 | **Beyond the Blade** | Your Release Technique's damage dice increase by two steps (d6→d10, d8→d12). | `Greater Weapon Specialization` shape applied to a focus effect |
| 18 | **Second Nature** | **Prerequisite** Deeper Crossing. The borrowed Aspect stops being something you put on and becomes something you are. **§8.6**. | `Third Path to Perfection` (monk 15, BCS 190) — this is later and grants strictly less |
| 20 | **Final Release** [three-actions] | **Frequency** once per week. You sever the bond that names you. Full rules in **§9** — it is large enough to need its own section. | `Hero's Defiance`; `Impossible Flurry`; `All Shall End in Flames` |

> **Final Release** is the class's 20th-level capstone and the only thing in this document that can
> permanently cost you the class. It has fifteen different endings, one per Spirit. **§9** is its
> section.

*Naming note: `Final Release` is the umbrella term. Your character never calls it that — a Soul Reaper
calls it by their Spirit's own name for it, and canon's own example is Ichigo's **Saigo no Getsuga
Tenshō**, which is §9.1's entry.*

### 8.6 Borrowed Nature — the cross-Lineage family

*Replaces v1.1's `Two Souls, One Edge`, which granted a second Spirit's Released Form. That feat was
cut: **nobody in canon carries two zanpakutō spirits**, and the rules problem matched the canon
problem — two Released Forms on one sheet is a stacking puzzle nobody costed. What canon *does* have,
constantly, is people who are **two peoples at once**.*

#### Why this is the canon-correct version of that feat

Every one of the six directions has a name in the source material:

| You are… | You borrow… | Canon precedent |
| :---- | :---- | :---- |
| **Soul Reaper** | **Hollow** | **The Visored.** Shinji, Kensei, Hiyori, Ichigo — Soul Reapers with a Hollow inside, who wear a mask for a limited time and hear something arguing with them while it is on. This is the archetypal case and the one the mechanics are built from. |
| **Soul Reaper** | **Quincy** | **The Kurosaki line.** Isshin is a Shinigami, Masaki a Quincy; their son is both, and it is treated as a birthright rather than an experiment. |
| **Hollow** | **Soul Reaper** | **What an Arrancar literally is** — a Hollow that tore off its own mask and gained Shinigami power, zanpakutō and all. For this Lineage the feat is less "borrowing" than finishing. |
| **Hollow** | **Quincy** | Arrancar who take ambient reishi instead of devouring souls, and the Hollows the Wandenreich conscripted and rebuilt. |
| **Quincy** | **Soul Reaper** | **Ichigo, and Kanae Katagiri.** Quincy bloodlines carrying Shinigami power are common enough in canon to have caused a war about it. |
| **Quincy** | **Hollow** | **Sklaverei** — the Quincy art of subordinating Hollow reishi to your own, and the Sternritter who took Hollow power to survive Auswählen. |

#### The feats

> **BORROWED NATURE** (feat 6)
> Choose a Lineage other than your own. **This choice is permanent.** You learn that Lineage's free
> cantrip kidō — **Shō**, **Bala**, or **Heizen** — and it costs you no Reiatsu Point, exactly as it
> would for someone born to it.
>
> You also gain:
>
> > **Don the Other Face** [one-action] (concentrate, reiatsu)
> > **Cost** 1 Reiatsu Point · **Frequency** once per encounter
> > For **1 minute** you gain your borrowed Lineage's **Aspect**, below. While it is on, you take a
> > **−1 status penalty to Will saves** — what you are wearing is not yours, and it argues.

**The three Aspects.** Each is the borrowed Lineage's signature at **half** its native rate, which is
the whole design: a dip is visibly weaker than the real thing, and never catches up to it.

| Aspect | While the Face is on |
| :---- | :---- |
| **Soul Reaper's Discipline** | You learn **one** kidō of your choice from §6.1–6.3 permanently, usable at its normal cost. While the Face is on, **every kidō you know costs no Reiatsu Point.** |
| **Hollow's Mask** | You gain **temporary Hit Points equal to your level**, **resistance to physical damage equal to a quarter of your level** (minimum 1), and a **+5-foot status bonus** to all your Speeds. |
| **Quincy's Discipline** | You gain **Blut** as a free action once per round (§5.3), except that **Blut Vene** grants resistance equal to a **quarter** of your level rather than half. Your ranged Strikes ignore the target's cover. |

> **DEEPER CROSSING** (feat 12) · **Prerequisite** Borrowed Nature
> Don the Other Face **twice per encounter**, and your Aspect deepens:
>
> - **Soul Reaper's Discipline** — you learn a **second** kidō, and while the Face is on your
>   **destruction** kidō deal one additional die of damage.
> - **Hollow's Mask** — temporary Hit Points equal to **twice your level**, resistance equal to
>   **half** your level, and the Speed bonus increases to **+10 feet**.
> - **Quincy's Discipline** — Blut Vene's resistance becomes **half** your level, and once per
>   encounter while the Face is on you may use **Seal the Art** (§5.3), even though you are not a
>   Quincy.

> **SECOND NATURE** (feat 18) · **Prerequisite** Deeper Crossing
> The mask stops being something you put on. Your **Borrowed Nature** Aspect — the 6th-level version,
> not the 12th — is **always active**: no action, no Reiatsu Point, no duration, and **no Will
> penalty**. Donning the Other Face still upgrades you to the **Deeper Crossing** numbers for 1
> minute, twice per encounter.
>
> *Canon: this is the exact difference between a Visored who has to summon the mask and one who no
> longer needs to.*

#### Costing and anchors

| Element | Anchor in `packs/pf2e` | Read |
| :---- | :---- | :---- |
| Temporary HP = level, 1/encounter @ 6 | Barbarian `Rage` — temp HP = **level + Con**, **at-will**, from **1st** | Far under |
| Temp HP = 2 × level @ 12 | `Rage` again, plus 12 levels | Comparable, still once or twice per encounter |
| Resistance = ¼ level @ 6 → ½ level @ 12 | `Thermal Nimbus` (kineticist **4**) = resistance **equal to level** | A quarter, then half, of the anchor — and half of what the Hollow Lineage itself gets |
| Free kidō for 1 minute | `Perfected Technique` (§8, 10th) frees **one** Release Technique once per encounter | Narrower per use, wider in scope, six levels earlier |
| Blut on a non-Quincy | The Quincy Lineage's own 1st-level grant | Explicitly halved so it cannot match the native version |
| −1 status penalty to Will | The prototype's `Hollow Mask` archetype drawback, kept | The canon "it argues with you" clause, and the reason this is safe at 6th |
| Second Nature @ 18 | Monk `Third Path to Perfection` (15th, BCS **190**) | Three levels later and strictly less: it makes an existing 6th-level effect passive |

**What it deliberately does not do.** No borrowed **Release**, **Release Technique**, **Full
Release**, or **Severing Art**; no second Spirit; no access to the borrowed Lineage's 5th- or
15th-level features except the one metered use of `Seal the Art` at 12th. You get the *texture* of
the other people, never their ladder. A Visored is a Soul Reaper wearing a Hollow's face, not a
Hollow.

---

## 9 — Final Release

*The 20th-level capstone. One feat, one shared state, and **fifteen different endings** — one per
Spirit. Canon's model is Ichigo's **Saigo no Getsuga Tenshō**: a form that grants enormous general
power, contains exactly one irreversible attack, and takes your powers when it is done.*

### 9.0 The feat, the state, and the ending

> **FINAL RELEASE** [three-actions] (auditory, concentrate, reiatsu)
> **Frequency** once per week · **Requirements** You are 20th level and your spirit weapon is in its
> released form
>
> You stop carrying your power and *become* it. You enter **Severance** for **10 rounds**.

**Severance — the general state.** Identical for all fifteen Spirits, all three Lineages:

- Your spirit weapon's Strikes deal an additional **4d6 spirit** damage.
- You are **immune to fear and death effects**, and to the **frightened** and **doomed** conditions.
- **Reiatsu stops mattering.** You have no pool and need none: your Release Technique and every kidō
  you know cost **nothing** and have **no frequency limit**.
- You gain your Spirit's **Full Release** ability and its 20-foot pressure emanation, without
  spending your daily Full Release and without the fatigue.
- Your Speed increases by **20 feet**, and Flash Step's frequency becomes **twice per round**.

**The ending — your Spirit's Severing Art.** Somewhere inside those ten rounds you get exactly one
irreversible attack, unique to your Spirit (§9.1–9.3). Using it is **[two-actions]**, costs nothing,
and **immediately ends Severance** whether you want it to or not.

> ### Waning
> The Severing Art is at its strongest the instant you enter Severance and decays every round after.
> Its damage depends only on **which round of Severance you use it in**:
>
> | Round of Severance | Dice | Average |
> | :---- | :---- | :---- |
> | **1st** | **20d6** | 70.0 |
> | **2nd** | 18d6 | 63.0 |
> | **3rd** | 16d6 | 56.0 |
> | **4th** | 14d6 | 49.0 |
> | **5th** | 12d6 | 42.0 |
> | **6th** | 10d6 | 35.0 |
> | **7th** | **8d6** | 28.0 |
> | **8th, 9th, 10th** | — | **cannot be used** |
>
> *(Dice = 22 − 2 × the round number.)* After the 7th round the Art has decayed past the point of
> being worth the action, and the rules simply say so rather than letting you throw away your one
> shot for 6d6.

**When Severance ends** — by the Art, or by the clock running out at the end of the 10th round — you
lose access to your **Released Form**, your **Release Technique**, your **Full Release**, and your
**entire reiatsu pool** until you complete **a week of downtime** rebuilding what you severed. You
keep your Hit Points, proficiencies, skills, Lineage features, and every other feat.

### 9.0.1 Why it is shaped this way

The user-facing tension is the point: **the longer you survive in Severance, the more the general
state has given you, and the less your ending is worth.** Round one is 70 damage and none of the
buff. Round seven is 28 damage and six rounds of a 4d6 rider, doubled Flash Step, and free kidō.
There is no dominant line, which is what makes it a decision instead of a script.

| Anchor in `packs/pf2e` | Value | Read |
| :---- | :---- | :---- |
| `Unfolding Wind Crash` (monk, rank **9**) | 18d6 single target | A Severing Art matches it in round **2** |
| `Arcane Explosion` (wizard, rank **9**) | 16d6, 30-ft emanation | Matched in round **3** |
| `Cataclysm` (rank **10** spell) | ~19d6 across types, 60-ft burst | Round **1** is comparable, once per **week** |
| `Impossible Flurry` (fighter 20) | 6 Strikes, free action, at-will | The slot this feat competes for |
| `All Shall End in Flames` (kineticist 20) | 13d6, repeatable | The other one |
| `Hero's Defiance` (champion, rank 10, BCS **190**) | free-action death denial | Deliberately *not* what this is — Severance grants no survivability beyond fear/death immunity |

**The decay is the balance lever, not the damage.** A once-per-week 20d6 that also demands you spend
it in round one — before Rising Pressure has given you anything and before you know how the fight is
going — is not obviously better than a round-five 12d6 thrown at a target you have already read. If
playtesting shows everyone fires on round one anyway, the fix is to flatten the table (start at 16d6,
−1d6 per round), not to cut the ceiling.

### 9.1 Severing Arts — Soul Reaper Spirits

All are **[two-actions]**, cost nothing, use the Waning table for damage, and end Severance.

| Spirit | Severing Art | Shape & damage type | Rider |
| :---- | :---- | :---- | :---- |
| **Senbonzakura** | **Shūkei: Hakuteiken** *(Endscape: White Imperial Sword)* ✅ | Every blade condenses into a single white sword; wings and a vertical halo open behind you. **One creature within reach.** Make a Strike; on a hit it takes the Waning dice as **slashing**. | Ignores **all** resistances and immunities. On a hit the target can't regain Hit Points, and its regeneration and fast healing are suppressed, for 1 minute. |
| **Zangetsu** | **Mugetsu** *(Moonless Sky)* ✅ | A blade of black reiatsu pours from your arm. **60-foot cone**, basic Reflex, **spirit**. | Ignores **all** resistances and immunities to spirit damage. **This is the pattern the whole section is built from:** canon's *Saigo no Getsuga Tenshō* is the **state** (here, Severance) and *Mugetsu* is the **one attack inside it**. Every other Spirit gets the same two-part shape. |
| **Hyōrinmaru** | **Hyōten Hyakkasō** *(Frozen Heavens Hundred Flower Funeral)* ✅ | Snow falls and ice flowers bloom on everything it touches. **30-foot emanation**, basic Fortitude, **cold**. | Creatures that fail are **restrained** in a pillar of ice (Escape vs. your Reiatsu DC) and take **4d6 persistent cold** that allows **no flat check** to end while restrained. Canon: the target's life ends when the hundredth petal falls. |
| **Ryūjin Jakka** | **Ittō Kasō** *(Single Blade Cremation)* ✅ | A pillar of red fire in the shape of a katana's tip erupts from the ground. **20-foot burst** within 60 feet, basic Reflex, **fire** — and it deals the Waning dice **+2d6**, the only Art in the class that beats the table. | The fire **ignores resistance and immunity to fire**. Creatures that fail **can't regain Hit Points for 1 minute**, and their regeneration and fast healing are suppressed for that minute. A creature reduced to 0 Hit Points by Ittō Kasō is **cremated** — returning it to life requires a 10th-rank effect. **This Art also costs you: see below.** |
| **Kyōka Suigetsu** | **Kanzen Saimin: Owari** *(Complete Hypnosis: The End)* ⚠️ | The hypnosis stops being a lie about your position and becomes a lie about everything. **60-foot emanation**, basic Will, **mental**. | Creatures that fail are **confused** for 1 minute. On a critical failure the creature perceives its own allies as you for that minute and cannot be shaken loose by damage. ⚠️ **Extrapolated** — Aizen has no canon Final Release, for the same reason he has no canon Bankai. |

> **Ittō Kasō's self-cost.** Alone among the fifteen, Ittō Kasō charges its user, because canon
> insists: it is a **forbidden** technique that uses the caster's own body as the catalyst, Aizen
> calls it the *spell of sacrifice*, and Yamamoto loses his left arm casting it.
>
> **When you use Ittō Kasō, you take damage equal to half your current Hit Points.** This damage
> cannot be prevented, reduced, resisted, or redirected, and it is applied after the Art resolves.
>
> That is *why* it is the biggest number in the section (+2d6 over the Waning table) and carries the
> hardest rider (unresistable, anti-healing, and it destroys the body). A self-cost that bought
> nothing would just make Ryūjin Jakka the worst Spirit to take to 20th level; a self-cost has to buy
> the best ending in the class, or it should not exist.

### 9.2 Severing Arts — Hollow Spirits

| Spirit | Severing Art | Shape & damage type | Rider |
| :---- | :---- | :---- | :---- |
| **Pantera** | **Desgarrón** *(Panther King's Claw)* ✅ | Your claws extend into ten blades of condensed reishi and you throw all of them. **60-foot cone**, basic Reflex, **slashing**. | Creatures that fail take **4d6 persistent bleed**. Canon has Grimmjow name this his strongest attack, which is why it sits here rather than in his Segunda Etapa. |
| **Murciélago** | **Cero Oscuras: Ceniza** *(Dark Hollow Flash: Ash)* ⚠️ | A black cero fired point-blank down a corridor of nothing. **120-foot line**, basic Reflex, **spirit**. | A creature reduced to 0 Hit Points by this crumbles to ash; returning it to life requires a 10th-rank effect. ⚠️ **Extrapolated name**; the ash is canon — it is how Ulquiorra himself ends. |
| **Arrogante** | **La Hora Final** *(The Final Hour)* ⚠️ | Respira stops being a breath and becomes a verdict. **30-foot emanation**, basic Fortitude, **void**. | Creatures that fail are **enfeebled 3** for 1 minute and **drained 1** for 24 hours as decades leave them. ⚠️ **Extrapolated**; the aging is Baraggan's canon aspect of death. |
| **Los Lobos** | **Aullido** *(Howl)* ⚠️ | Every wolf you have left converges on one point and goes off together. **40-foot burst** within 120 feet, basic Reflex, **force**. | **Requirements** at least one wolf remains. You expend **all** remaining wolves and regain none for the rest of the encounter. If you had **five or more**, creatures that critically fail are also knocked **prone** and **stunned 1**. ⚠️ **Extrapolated**; the soul-splitting wolves are canon. |
| **Tiburón** | **Ola Azul** *(Blue Wave)* ✅ | Reiryoku gathers in the hollow of the blade and leaves it as a single wave. **60-foot line**, basic Reflex, **slashing**. | Creatures that fail are pushed **30 feet** directly away from you and knocked **prone**. Creatures that critically fail are pushed 60 feet instead. |

### 9.3 Severing Arts — Quincy Spirits

| Spirit | Severing Art | Shape & damage type | Rider |
| :---- | :---- | :---- | :---- |
| **Antithesis** | **Sprenger** ✅ | Five Seele Schneider planted in a pentacle, and the Gintō poured over them. **20-foot burst** within 60 feet, basic Reflex, **force**. | Creatures that critically fail are **restrained** by lines of light for 1 minute (Escape vs. your Reiatsu DC). Canon's fifth and largest Gintō, and the reason Uryū's Vollständig (§7C) does not carry it. |
| **The Heat** | **Burning Full Fingers** ✅ | Fire on all five fingertips at once, released as a spiralling torrent. **60-foot cone**, basic Reflex, **fire**. | Creatures that fail take **4d6 persistent fire** whose flat check to end is **DC 20** rather than DC 15. Canon's own name for Bazz-B's strongest technique. |
| **The Balance** | **The Reckoning** ⚠️ | Every misfortune you have held back for other people, handed to one person at once. **One creature within 60 feet**, basic Fortitude, **spirit**. | Ignores **all** resistances and immunities. The target is **doomed 1**. If you have used your Release Technique at least three times this encounter, it is **doomed 2** instead. ⚠️ **Extrapolated**; the redistribution of fortune is Haschwalth's canon Schrift. |
| **The Thunderbolt** | **Electrocution** ✅ | You stop directing the lightning and simply become the storm. **30-foot emanation**, basic Reflex, **electricity**. | Creatures that fail are **stunned 2** (**incapacitation**). Canon's name for Candice's strongest technique. |
| **The Miracle** | **Apotheosis** ⚠️ | Every wound taken all fight arrives at once as growth. **30-foot emanation**, basic Fortitude, **force**. | You gain temporary Hit Points equal to **twice your level**. At the start of your next turn the emanation detonates a second time for **half** the Waning dice. ⚠️ **Extrapolated**; growing stronger from damage is Gerard's canon Schrift. |

### 9.4 What is canon and what is not

**Nine of the fifteen** Severing Arts are the character's actual canon technique, named as such in
the source: **Shūkei: Hakuteiken**, **Mugetsu**, **Hyōten Hyakkasō**, **Ittō Kasō**, **Desgarrón**,
**Ola Azul**, **Sprenger**, **Burning Full Fingers**, and **Electrocution**.

**The remaining six** are marked ⚠️ and are extrapolations, each built on a principle canon *does*
establish: Aizen's hypnosis, Ulquiorra's ash, Baraggan's aging, Starrk's wolves, Haschwalth's
redistribution of fortune, and Gerard's growth from damage. None is presented as something the manga
contains.

**Ittō Kasō is the only one with a self-cost**, and it is paid for: it is the only Art that exceeds
the Waning table (+2d6) and the only one whose damage ignores resistance *and* immunity *and* blocks
healing *and* destroys the body. Every other Spirit pays the same price and no more — a week without
your powers.

---

## 10 — Head-to-head audit against published PF2e

*This is the section the brief asked for: every mechanic in this class placed next to a **named**
published feature, with the level it appears at and what it costs there.*

### 10.1 Chassis vs. the published martials

| Line | **Soulbound** | Monk | Magus | Rogue | Champion |
| :---- | :---- | :---- | :---- | :---- | :---- |
| HP | **10** | 10 | 8 | 8 | 10 |
| Perception | E@5 | E@5 | E@9 | E@1 → M@7 → L@13 | E@11 |
| Fortitude | E@1 → **M@11** | E@1 → M@7 | E@1 → M@15 | E@9 | E@1 → M@9 |
| Reflex | E@1 → **M@15** | E@1 → M@7 | E@5 | E@1 → M@7 → L@13 | E@9 |
| Will | **E@3, stops** | E@1 → M@7 | E@1 → M@9 | E@3 | E@3 |
| Class/Spell DC | T@1 → E@9 → M@17 | same | same | — | same |
| Weapons | Martial E@5 → M@13 | Unarmed/Simple E@5 → M@13 | Martial E@5 → M@13 | same | same |
| Armour | Light E@13 | Unarmoured E@1 → M@11 → L@17 | Medium E@11 → M@17 | Light E@13 → M@19 | Heavy E@13 → M@19 |
| **BCS total** | **2100** | 2100 | 2100 | 2100 | 2100 |

**The read:** this is a Monk's save shape with the Master steps pushed four to eight levels later,
Will capped at Expert, and the saved points spent on Lineage. It is the *only* 10-HP class in the
comparison whose Will stops at Expert, which is the deliberate genre concession discussed in §2.2.

### 10.2 Class mechanics vs. their nearest published relative

| This class | Published relative | Level there | Verdict |
| :---- | :---- | :---- | :---- |
| **Rising Pressure** (focus refills in combat, capped per encounter) | **Nothing.** Panache (swashbuckler 1) is the closest renewable in-combat resource; Focus normally refills only via Refocus | 1 | **Genuinely new.** This is the class's reason to exist and its biggest balance risk (§11.1) |
| **Release** → **Full Release** (one-way ladder) | Monk/Magus stances (swap freely); Exemplar ikon rotation; Oracle cursebound (escalates into penalties only) | 1 / 13 | New shape. Costs more at each step, pays out in **new actions**, not flat numbers |
| **Spirit weapon** (bonded, rune-free, ghost touch) | `Handwraps of Mighty Blows`; Champion `Divine Ally`; Exemplar weapon ikon | 1 / 3 / 1 | Inside precedent; the rune-transfer clause is a tax removal, not a power grant |
| **Flash Step** | Monk `Incredible Movement` (+10 ft. passive) | 3 | Trades passive Speed for a once-per-round reaction-free Stride |
| **Greater Flash Step** DC 5 flat check | `Blur` (rank 2 spell) | 11 | Rank-2 effect granted at 11th, first attack each round only |
| **Hierro** (physical resistance = half level) | `Thermal Nimbus` (resistance = **level**, one energy type) | Kineticist **4** | Broader type coverage at **half** the rate; 3 levels earlier |
| **Regeneración** (fast healing 2/4/6) | `Sanguine Mastery` (fast healing = **half level**) | Necromancer **12** | Roughly half the value, 7 levels earlier, with a second off-switch |
| **Blut Arterie** (resistance bypass, cover −1) | `ghost touch`; `Cut from the Air`; `Pale Lightning`'s cover clause | — | Grants **no** bonus to attack, damage, or DC — by design |
| **Seal the Art** (counteract a release state) | `Dispel Magic` (rank 2); the counteract rules | — | Suppresses rather than ends; counteract rank = half level, the standard focus line |
| **Full Release** fear emanation | `Frightful Presence` (monster ability); `Dread Aura` | — | Weaker: frightened 1, ends-of-turn only, 10-minute immunity on a success |
| **Unsealed** (2× Full Release/day) | Magus `Double Spellstrike` (BCS 110) | 19 | Same price, same slot |
| **Borrowed Nature** (§8.6) | Barbarian `Rage` (temp HP = level + Con, at-will, 1st); `Thermal Nimbus` (resistance = level, 4th) | 6 / 12 / 18 | A quarter then half of both anchors, once or twice per encounter, with a Will penalty |
| **Final Release / Severance** (§9) | `Impossible Flurry` (fighter 20); `All Shall End in Flames` (kineticist 20) | 20 | Same slot. Both anchors are **repeatable**; this is **once per week** and costs the class for a week |
| **Severing Art**, round 1 | `Cataclysm` (rank **10** spell); `Unfolding Wind Crash` (monk rank 9, 18d6) | — | 20d6 once per week vs. 18d6 from a focus pool that refills every 10 minutes |
| **Severing Art**, round 7 | `Arcane Explosion` (wizard rank 9, 16d6) | — | 8d6 — **half** the rank-9 comparator. The decay is the cost of waiting |
| **Konsō** | `Talking Corpse`; `Ritual: Atone`; a GM-facing haunt resolution | — | Exploration-only; no combat value; can end an encounter, which is the point |

### 10.3 Kidō vs. published focus spells and spells

| Kidō | Value at rank 10 | Nearest published | Its value | Verdict |
| :---- | :---- | :---- | :---- | :---- |
| **Shō** (cantrip, 1 action) | 6d4 + mod (~18) | `Force Bolt` (wizard, 1 action) | 6d4+6 (21) | **Under** — and Shō has a save, where Force Bolt is automatic |
| **Byakurai** (1 action, spell attack, 60 ft.) | 11d6 (38.5) | `Hurtling Stone` (cleric, 1 action, 2d6 H+1) | 11d6 (38.5) | **Exactly at anchor** |
| **Shakkahō** (2 actions, 10-ft burst) | 11d6 (38.5) | `Crushing Ground` (2d6 H+1, 2 actions) | 11d6 | **Exactly at anchor** |
| **Sōkatsui** (2 actions, 30-ft line + push) | 11d4 (27.5) | `Spray of Stars` (oracle, 2d4 cone H+1) | 11d4 | **At anchor**, push paid for with the die size |
| **Sōren Sōkatsui** (2 actions, 60-ft line) | 12d6 (42.0) | `Chthonian Wrath` (sorcerer r5, 60-ft cone) | 8d6+8d6 (56) | **Under** the rank-5 comparator |
| **Kurohitsugi** (2 actions, 10-ft burst, immobilize) | 11d6 (38.5) | `Accelerated Decomposition` (r6, 9d6 H+1) | 13d6 (45.5) | **Under** |
| **Danku** (reaction, resistance = level) | resistance = level | `Thermal Nimbus` (kineticist 4) | resistance = level, **whole aura, passive** | **Far under** — one trigger, one instance |
| **Kin** (2 actions, can't cast 1 round) | stupefied 2, 1 min | `Silence` (r2); `Feeblemind` (r6) | — | Between them; no incapacitation trait because the lockout is only 1 round |
| **Kaidō** (2 actions, touch) | 50 HP at 20th | `Lay on Hands` (champion, **1 action**) | 6 HP/rank, ~60 at r10 | **Under**, and costs twice the actions |

### 10.4 Release Techniques and Full Releases vs. published focus spells

All values at **rank 10 / level 20**, all costing **1 Reiatsu Point**.

| Spirit | Release Technique @ r10 | Full Release adds @ r10 | Nearest published anchor |
| :---- | :---- | :---- | :---- |
| **Senbonzakura** | 11d6, 20-ft emanation + difficult terrain | 8d6 **recurring** in two 20-ft emanations | `Impaling Briars` (druid r8, 10d6, sustained) |
| **Zangetsu** | 11d6, 60-ft line, ignores spirit resistance | 1-action Getsuga + doubled Flash Step | `Qi Blast` (monk r3, 1-action cone); `Flurry of Blows` |
| **Hyōrinmaru** | Strike +5d6, immobilize | 3 charges: 11d6 burst / 2d6 persistent aura / 2×level reduction | `Glacial Heart` (witch r5, 10d6+); ikon charge economy |
| **Ryūjin Jakka** | 11d6 + persistent, 20-ft emanation | 4 aspects incl. 11d6 unresistable line | `Shroud of Flame` (r3); `Fire Shield` (r4); `Red-Gold Mortality` (exemplar 2) |
| **Kyōka Suigetsu** | Illusion, 2 rounds, no damage | Re-save all, sustained confusion | `Confusion` (r4); `Mislead` (r6) |
| **Pantera** | 11d6, 30-ft cone + difficult terrain | Desgarrón: 1 roll vs. 4 targets, +8d6 | `Sever Four Dragonfly Wings` (exemplar) |
| **Murciélago** | 12d6 spell attack, 90 ft. | Lanza: 8d6 attack + 8d6 burst | `Chthonian Wrath` (r5, 4d6+4d6) |
| **Arrogante** | 11d6 + enfeebled + lingering area | Permanent 3d6 aura + DC 5 flat check | `Diamond Dust` (cleric r4, aura); `Blur` (r2) |
| **Los Lobos** | 11d6, 60-ft cone / 120-ft line | 8 wolves × 8d6 10-ft bursts, 1 action each | `Whirling Flames` (oracle r3, 5d6 burst) |
| **Tiburón** | 11d6, 40-ft cone + prone | Trident (3 Strikes, MAP-flat) + Hirviendo | `Sever Four Dragonfly Wings`, restricted |
| **Antithesis** | Reaction: resistance = level + **6d6** | Sprenger 12d6 burst + restrained, 1/day | `Grasping Grave` (sorcerer r5, 6d6 burst) |
| **The Heat** | 11d6 in five selectable shapes | 60-ft cone + DC 20 persistent fire | Kineticist impulse-shape choice |
| **The Balance** | Reaction: reduce 2×level + **6d6** + debuff | 3×level, ally redirect, allot fortune | Champion's reaction (2+level at **1st**) |
| **The Thunderbolt** | 11d6, 60-ft line + stunned *(incap.)* | Fly, immunity, 3d6 aura + 3d6 chain | `Glacial Heart`; `Thermal Nimbus` |
| **The Miracle** | Free action; resistance ≤10, converts to +1d6/pt | Fast healing = points; death save ×N | `Rage`/`Panache`; `Hero's Defiance` (r10) |

> **Two reactions run 1d6 hot.** `Antithesis` and `The Balance` enter at rank 1 on an **H(+2)** ladder
> and therefore reach **6d6** at rank 10, where §1.5's reaction line targets 5d6. This is deliberate
> and it is the one place the curve is knowingly exceeded: for both Spirits the reaction **is** the
> Release Technique — it is the whole subclass, not one of five Forms — and neither carries an
> offensive area option. If you would rather hold the line exactly, move both to base rank 4.

### 10.5 Monotonicity audit

The inequality every tier must satisfy: **Release Technique ≤ Full Release output**, at rank 10.

| Spirit | Release Tech. | Full Release adds | In Full Release you get | Monotonic? |
| :---- | :---- | :---- | :---- | :---- |
| All fifteen | X | Y | **X (now free, 1×/round) + Y + die step + fear aura** | ✅ |

Because Full Release makes the Release Technique **cost nothing**, total per-round output in a Full
Release is always strictly greater than outside it, in every one of the fifteen Spirits, with no
exceptions and no per-Spirit arithmetic needed. This is a structural guarantee rather than a
coincidence, and it is the main reason the Full Release was written as a *state* that frees the
existing technique rather than as a bigger technique that replaces it.

*(The Breath Slayer v4 audit had to check this style-by-style because its Final Forms replaced rather than freed. This chassis avoids that class of bug entirely.)*

---

## 11 — Balance guardrails and playtest watch-list

These are the levers to pull, in the order to pull them. Referred to elsewhere as §11.1, §11.2, and so on.

1. **Rising Pressure's per-encounter cap is load-bearing.** Without it, a long fight is an infinite
   pool. If the class still feels rich, reduce the cap to **half your pool maximum, rounded up** (so
   +2 at 11th, not +3). **Do not** print `Reiatsu Flood` (§8.5) at your table until you have played
   at least to 11th level without it.
2. **Release stays free and permanent-per-encounter.** If it costs a point, everyone Releases on
   round one anyway and feels taxed.
3. **No flat numeric bonuses in release states.** The only one in the entire class is The Balance's
   **+1 circumstance bonus to AC**, which is a circumstance bonus (so it collides with cover) and
   switches off the moment your pool empties. Keep it that way — PF2e's math has no room.
4. **Watch Hierro + Blut Vene + light armour.** Half-your-level physical resistance on a 10-HP class
   is the second-most-likely thing to need a cut. If a Hollow is unkillable at your table, the fix is
   **resistance equal to one-third your level** before it is anything else.
5. **Watch Ryūjin Jakka's Nishi aspect.** Fire immunity, resistance to *all* damage equal to half
   your level, and a 4d6 retributive rider is the single strongest defensive state in the class. It
   is balanced by the friendly-fire clause; if your table removes that clause, cut the resistance.
6. **Kidō must not become a spell list.** Hard ceiling 9 by 20th, Soul Reaper Lineage only, and only
   for a character who spent three class feats on it. There is no utility kidō in §6 and there should
   not be one.
7. **Final Release's Waning table is the whole balance of §9.** If your table finds everyone firing
   their Severing Art on round one, flatten the curve rather than cutting the ceiling — start at
   **16d6** and drop **1d6** per round, which makes rounds 1–7 far closer in value. If instead nobody
   ever fires it before round seven, the general state is too good: cut Severance's Speed bonus and
   the doubled Flash Step.
8. **`Borrowed Nature` (§8.6) is the feat most likely to produce a combination nobody costed.** Watch
   two stacks specifically: a **Hollow** who borrows Quincy gets Hierro *and* Blut Vene, and a
   **Quincy** who borrows Hollow gets Blut Vene *and* the Mask. Both are physical resistance from two
   sources. **They do not stack — resistances to the same damage type never do in PF2e, you take the
   highest** — so the real effect is redundancy rather than a doubled number, which is exactly why
   the borrowed rate is a quarter and then half. If a table plays it as stacking, that is the bug.
   The other watch item is `Second Nature` (18) making the Mask's temporary Hit Points permanent:
   they refresh only when you Don the Other Face, not every round.
9. **The class is intentionally weak on round one.** If players complain about that, the design is
   working. If they complain at **3rd level** that they have nothing to do, that is a real problem —
   grant `Hirenkyaku Drill`'s effect to everyone and move one bonus kidō to 3rd.
10. **Konsō is a narrative superpower.** It can defuse whole encounters. That is intended, but tell
   your GM in advance so they can build around it.
11. **Aizen's Kyōka Suigetsu is the subclass most likely to break a table socially, not
    mechanically.** An always-on illusion on every enemy that can see you is a lot of GM bookkeeping,
    and "you cannot trust what the GM describes" is a table-consent question, not a balance question.
    Ask first.

---

## 12 — Variant rules and table options

**Early Full Release (campaigns ending at 10–12).** Move Full Release to **11th** and Refined
Release to **7th**. Cut Perfected Full Release. Front-loaded, ladder intact.

**Full Release as a story unlock.** Arguably better for the source material: Bankai is not granted
by level at all. It is granted by the GM when the character completes a personal arc with their
Spirit — the class table just reads "Full Release (see GM)." In canon, achieving Bankai normally
takes ten years and materialising your own zanpakutō spirit to beat it into submission; Ichigo does
it in three days and it nearly kills him. Suggested gate: **no earlier than 11th**.

**The Sealed Campaign.** Remove Full Release entirely, cap the pool at 2, run levels 1–10. The class
works fine as a Shikai-only chassis.

**Cross-Lineage characters.** As of v1.2 this is no longer a variant — it is the **`Borrowed Nature`**
feat family at 6th, 12th, and 18th (**§8.6**), and it covers all six directions with a canon
precedent for each. A Visored is a Soul Reaper who took Borrowed Nature (Hollow). The prototype's
`Hollow Mask` archetype (§11 of *that* document) is superseded by it and should not be used
alongside it.

**If you want a *full* second Lineage** rather than a dip, that is a GM-granted rarity, not a feat:
give the character the second Lineage's 1st-level package and nothing above it, and charge them a
class feat at 6th, 12th, and 18th for it. That is strictly more than `Borrowed Nature` gives and
should be treated as a story reward, not a build option.

**Dual zanpakutō.** There is no feat for this and deliberately isn't one — **no character in canon
carries two zanpakutō spirits**, and two Released Forms on one sheet is a stacking puzzle this
document does not want to cost. If your table wants it anyway, treat it as a rare GM-granted variant
replacing your Spirit with two half-Spirits: **both Released Forms, only one Release Technique, and
Full Release works with only one of them.** Never both Full Releases, and never two Severing Arts.

---

## 13 — The prototype's open questions, answered

| # | Question | Answer | Where |
| :---- | :---- | :---- | :---- |
| 1 | Charisma-keyed instead of Str/Dex? | **No.** Kept Str/Dex. Reiatsu DC already makes your force of self scale without breaking attack math | §1.2 |
| 2 | Bump armour to medium? | **No.** Light. Medium is the line against Champion/Guardian, and Hierro already buys defence | §3.1 |
| 3 | Raise the baseline kidō count? | **No** — made it a **Lineage** decision instead, exactly as the prototype suggested. Soul Reaper gets **6 chosen**; a Hollow gets **Cero and Bala** and a Quincy **Heizen and Gritz**, fixed and native, so every Lineage has demon arts but only one has a *list* | §5.1, §6.4–6.5 |
| 4 | Nine subclasses is a lot to balance | Now **fifteen**, which is more, but they sit on **five shared ladders** (§7 preamble) rather than fifteen bespoke curves. For a first playtest, run **Senbonzakura, Hyōrinmaru, Murciélago, The Heat, The Balance** — that is control, damage, ranged, shape-choice, and defence across all three Lineages | §7 |
| — | Should Quincy be a separate class? *(prototype §11)* | **No**, per your instruction. The cost of folding them in was 130 points, paid for by cutting Legendary class DC and Master Will | §2.2 |
| — | Should Hollow-kin be "the same sheet"? *(prototype §6b)* | **Partly.** They now differ by a real Lineage package, not just by flavour — which is what makes the three sit at one table without one of them being a reskin | §5 |

---

## 14 — How it plays

**Key Attribute:** Strength or Dexterity · **HP:** 10 · **Source:** Homebrew (Rare)

**How it plays.** You open sealed and unremarkable: a lightly armoured duelist with a d8 weapon and a
single Reiatsu Point. Your first action is usually Release, which costs nothing and locks your weapon
into its released form for the rest of the encounter. From there the fight escalates on a schedule you
control. **Rising Pressure** hands you a point the first time each round you land a hit or take one,
so the longer and bloodier the fight, the more often you fire — up to a hard per-encounter ceiling.
Round one you are a mediocre fighter. Round four you are the reason the encounter ended.

Which *kind* of round-four you are is your Lineage. A **Soul Reaper** has the widest answer set —
six kidō and a family of sword techniques, and the flexibility to pick the right one. A **Hollow**
does not out-think you, it out-lasts you: physical resistance from 1st level, fast healing from 5th,
and a Speed nobody else on the field has. A **Quincy** turns the enemy's own escalation off — `Seal
the Art` suppresses a Bankai, a Rage, or an Arcane Cascade for a round, and `Blut` toggles between
being hard to hurt and being impossible to resist.

At 13th level, **Full Release** turns one fight per day into a one-minute window where your technique
is free, your damage die is bigger, and your presence frightens things — paid for with fatigue
afterward. Outside combat you are the party's spirit specialist: you sense the dead through walls, you
hit incorporeal things without special gear, and **Konsō** lets you end a haunting by talking a soul
into leaving instead of fighting it.

At 20th level, **Final Release** is the ending. One feat, once per week, and it takes the class from
you for a week afterwards. It grants **Severance** — ten rounds in which reiatsu stops mattering
entirely, your kidō and your Release Technique are free and unlimited, and your Strikes carry an
extra 4d6 — and exactly one **Severing Art**, your Spirit's own last technique, which ends Severance
the moment you use it. The Art is worth **20d6 in round one and 8d6 in round seven**, and nothing at
all after that, so the whole capstone is a single question asked under pressure: *is this the moment,
or can I afford to keep swinging?*

**What makes it different.** Two mechanics are genuinely new. First, **focus points that refill inside
a fight, but only by fighting** — every other focus user in PF2e spends down a pool that cannot be
replenished until they get ten quiet minutes. That inverts the usual caster tempo: this class's best
turn is never its first. Second, the **one-way escalation ladder**. Monk and Magus stances swap
freely; Exemplar rotates a spark between three ikons; Oracle escalates but only into penalties. Sealed
→ Released → Full Release goes one direction, costs more at each step, and pays out in **new
actions** rather than flat numbers, which keeps it inside PF2e's math.

Everything else is deliberately restrained so those two things stand out: no minions (Necromancer's
and Summoner's territory — Los Lobos' wolves have no statistics and take no actions on purpose), no
spell attached to a Strike (Magus's), no spell slots at all, mediocre healing, and no armour past
light.

**Adjacency note.** Watch two things. Rising Pressure plus a long grindy fight is the class's best case
and needs the per-encounter cap enforced, or the reaper fires every round. And Full Release at 13th is
late for a campaign that ends at 10 — see §11.

---

## 15 — Sources

**Balance framework:** `Docs/homebrewing/BCS 1.4 (current) _ Balanced Core System.xlsx` —
`PROFICIENCYVALUES`, `CLASSPROFILES`, `CLASSDATA`, and `CLASSTOTALS` tabs. Every point value in §2 is
read directly from that workbook.

**Mechanical anchors:** the live PF2e system data in `pf2e_fork/packs/pf2e` — `spells/focus`,
`feats/class`, `actions/class`, and `class-features`. Every named anchor in §10 is an item in those
packs.

**Companion documents in this repository:** `Docs/breath-slayer-guide-v4.md` (same 2100-point budget,
same design curve), `Docs/saint-gold-cloth-guide-v4.md`, and
`Docs/homebrewing/breathing-forms-compendium-v4.md`.

**Canon research** — Bleach primary wiki and supporting references, consulted for every named
technique in §7:

- [Byakuya Kuchiki](https://bleach.fandom.com/wiki/Byakuya_Kuchiki) · [Senkei](https://bleach.fandom.com/wiki/Senkei) · [Shūkei: Hakuteiken](https://bleach.fandom.com/wiki/Sh%C5%ABkei:_Hakuteiken)
- [Getsuga Tenshō](https://bleach.fandom.com/wiki/Getsuga_Tensh%C5%8D) · [Saigo no Getsuga Tenshō](https://bleach.fandom.com/wiki/Saigo_no_Getsuga_Tensh%C5%8D)
- [Hyōten Hyakkasō](https://bleach.fandom.com/wiki/Hy%C5%8Dten_Hyakkas%C5%8D) · [Toshiro Hitsugaya's Zanpakutō explained](https://www.cbr.com/bleach-toshiro-hitsugaya-zanpakuto-explained/)
- [Genryūsai Shigekuni Yamamoto](https://bleach.fandom.com/wiki/Genry%C5%ABsai_Shigekuni_Yamamoto) · [Zanka no Tachi, Higashi: Kyokujitsujin](https://bleach.fandom.com/wiki/Zanka_no_Tachi,_Higashi:_Kyokujitsujin) · [Zanka no Tachi, Kita: Tenchi Kaijin](https://bleach.fandom.com/wiki/Zanka_no_Tachi,_Kita:_Tenchi_Kaijin)
- [Sōsuke Aizen](https://bleach.fandom.com/wiki/Sousuke_Aizen) · [Kanzen Saimin](https://bleach.fandom.com/wiki/Kanzen_Saimin)
- [Grimmjow Jaegerjaquez](https://bleach.fandom.com/wiki/Grimmjow_Jaegerjaquez) · [Garra de la Pantera](https://bleach.fandom.com/wiki/Garra_de_la_Pantera)
- [Ulquiorra Cifer](https://bleach.fandom.com/wiki/Ulquiorra_Cifer) · [Lanza del Relámpago](https://bleach.fandom.com/wiki/Lanza_del_Rel%C3%A1mpago)
- [Baraggan Louisenbairn](https://vsbattles.fandom.com/wiki/Baraggan_Louisenbairn)
- [Coyote Starrk](https://bleach.fandom.com/wiki/Coyote_Starrk) · [Lilynette Gingerbuck](https://bleach.fandom.com/wiki/Lilynette_Gingerbuck)
- [Tier Harribel](https://all-fiction-battles.fandom.com/wiki/Tier_Harribel) · [Tia Harribel powers & abilities](https://b-ua.fandom.com/wiki/Tia_Harribel/Powers_%26_Abilities)
- [Quincy](https://bleach.fandom.com/wiki/Quincy) · [Schrift](https://bleach.fandom.com/wiki/Schrift) · [Quincy: Letzt Stil](https://bleach.fandom.com/wiki/Quincy:_Letzt_Stil) · [Seele Schneider](https://bleach.fandom.com/wiki/Seele_Schneider)
- [Uryū Ishida](https://bleach.fandom.com/wiki/Ury%C5%AB_Ishida) · [Bazz-B](https://bleach.fandom.com/wiki/Bazz-B) · [Gerard Valkyrie](https://bleach.fandom.com/wiki/Gerard_Valkyrie) · [Lille Barro](https://bleach.fandom.com/wiki/Lille_Barro)
- [Arrancar](https://bleach.fandom.com/wiki/Arrancar) · [Every Sternritter Schrift power, ranked](https://gamerant.com/bleach-every-quincy-sternritter-schrift-power/) · [Bleach Top 10 Quincy, ranked](https://www.cbr.com/best-bleach-quincy/)

**Added for v1.1** — Lineage kidō and the Severing Arts:

- [Category: Quincy Techniques](https://bleach.fandom.com/wiki/Category:Quincy_Techniques) — Gintō, **Heizen**, **Gritz**, **Wolke**, **Sprenger**
- [Ittō Kasō](https://bleach.fandom.com/wiki/Itt%C5%8D_Kas%C5%8D) — the "spell of sacrifice"; Yamamoto loses his left arm to it
- [Burning Full Fingers](https://bleach.fandom.com/wiki/Burning_Full_Fingers) · [Burner Finger 1](https://bleach.fandom.com/wiki/Burner_Finger_1) · [Burner Finger 4](https://bleach.fandom.com/wiki/Burner_Finger_4)
- [Hyōryū Senbi](https://bleach.fandom.com/wiki/Hy%C5%8Dry%C5%AB_Senbi) · [Ryūsenka](https://bleach.fandom.com/wiki/Ry%C5%ABsenka)
- [Electrocution](https://bleach.fandom.com/wiki/Electrocution) — Candice Catnipp's strongest technique
- [Jugram Haschwalth](https://villains.fandom.com/wiki/Jugram_Haschwalth) — **Freund Schild**, his spirit weapon
- [Quincy: Vollständig](https://bleach.fandom.com/wiki/Quincy:_Vollst%C3%A4ndig)


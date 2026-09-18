# The Stargazer — PF2e Class Guide, **Version 3**

### *The diviner, the luck-handler, and the one who has already seen how this ends*

*The complete, self-contained class. One chassis, **four Paths**, sixteen Auguries, the full feat
spine, and the three tiers of the rewind. Companion to **The Saint** (Gold Cloth guide v4), **The
Soulbound** (guide v1.4) and **The Breath Slayer** (guide v5).*

> ### This class is deliberately over budget: **2860 points, not 2100.**
>
> v3 was commissioned as a **buff**, and the owner's instruction was explicit: *"I don't care if it
> exceeds the budget."* So it does, by **+760**. The BCS total is still computed and reported
> throughout — not as a constraint but as a **measuring stick**, because "how far above the curve, and
> in which subtotals" is a far more useful thing to know than "legal / illegal." The overage is
> itemised in **§2.4** and the dials are in **§2.5**.
>
> Every other class in this module totals 2100. This one is **36% above** it, and §9 is the honest
> account of what that buys and where it lands against the Bard.

**Sources folded in:** the v1 draft supplied by the repository owner (`006b1f2b-stargazer-bcs-guide1.md`);
**BCS 1.4** (`Docs/homebrewing/BCS 1.4 (current) _ Balanced Core System.xlsx`) for every point value,
read out of the sheet rather than quoted from memory; live PF2e system data from `pf2e_fork/packs/pf2e`
for every mechanical anchor; and **this module's own shipped Sky implementation**
(`scripts/sky/signs.mjs`, `scripts/sky/tracker.mjs`) for §8, which the v1 draft predates and contradicts.

---

## 0A — What changed in v3

v3 is a commissioned buff, not a correction. Four things were asked for. All four are in, and the
budget consequences are in §2.4–2.5 rather than hidden in a reshuffle.

1. **Perception now matches the Investigator exactly** — Trained and Expert at 1st, **Master at 7th,
   Legendary at 13th**. That is 360 points, up from 170. It also takes the class **off the
   Caster-Specialist profile**: Legendary Perception belongs to the Ranger, the Investigator and the
   Gunslinger, and no caster of any kind has it. §2.3 flags it rather than pretending otherwise. It
   is, to be fair, the single most thematically defensible thing to break the profile for — this
   class *looks at things* for a living.
2. **Will escalates to Legendary at 17th again**, as v1 had it: Expert at 1st, Master at 11th,
   Legendary at 17th. 360 points, up from 170. BCS line 69 still says the Bard's version is likely an
   error; v3 copies it knowingly. Combined with Legendary Perception it makes the Stargazer very close
   to unbreakable by mental effects from 17th on, which is the correct end state for a seer.
3. **Two self-defence options**, because 8 HP and Reflex Trained until 13th was never survivable:
   - ***Death Foretold*** (§5.2) — an Augury available from **1st level**. You show a creature the
     hour of its own death. Will save; frightened 1/2, and **frightened 3 and stunned 1** on a
     critical failure. It heightens to **five creatures**, which is exactly how *fear* heightens.
   - ***The Last Thing You See*** (§4.8) — a **reaction at 5th level**, triggered when something
     damages you, applying the same fear ladder to whatever hit you. This is the class's first
     genuine "stop touching me" button.
   - *Borrowed Second* now targets **you** as well as an ally, which turns it into an escape.
4. **Everything reaches more targets.** Fortune's Thread goes **1 → 2 creatures at 5th → 3 at 17th**;
   *Chart the Course* names **two** creatures from 11th; *Twin Fates* affects **two**; and **ten of
   the sixteen Auguries gained multi-target heightening**, which is free on the ledger because
   heightening is what a focus spell is supposed to do (§5.1).

**Net effect on power:** large, and concentrated at two places — 5th level, where the class stops being
a liability in melee range, and 13th–17th, where the luck engine reaches **Courageous Anthem parity**
on throughput while keeping the entire information half of the class. §9 is rewritten around that and
no longer says "it is not a Bard," because from 5th on that is no longer true in the way it was.

---

## 0B — What changed in v2, and why

v1 was a good class pitch with a ledger that did not survive contact with the spreadsheet. Nine things
changed. Six are corrections; three are design.

### The corrections

1. **`divination` is not a Remaster trait.** v1 tagged every feature and Augury `divination`. The
   Remaster deleted the school traits. The trait this class actually wants is **`prediction`**, which
   exists, is carried by *foresight*, *read fate*, *it is written*, *read omens* and *inevitable
   disaster* (15 spells in `packs/pf2e/spells`), and which **this module already uses** — the Saint's
   8th-level *Read the Constellation* is tagged `["prediction", "saint"]`. Every Augury and feature
   below is retagged. This also means **creatures immune to `prediction` exist**, which is a real
   limit on the class and is now stated in the text rather than discovered at the table.
2. **`temporal` is not a trait either** — zero hits in the spell packs. The rewinds use `prediction`
   and are flagged as homebrew where they need more.
3. **The benchmark table in v1's Part 9 was wrong in every row.** It guessed "Investigator ~500,
   Bard ~200, Wizard ~600" for bespoke class features. The real figures, read out of `CLASSDATA`,
   are **Investigator 180, Bard −160, Wizard 90**. §2.6 prints the real table for all 23 classes.
   The correction cuts both ways and is the reason v2 exists — see below.
4. **v1's feature prices were roughly double the published rate.** v1 charged 110 for Fortune's
   Thread. The sheet charges **70 for Courageous Anthem** (party-wide, at-will, +1 status to attack
   *and* damage) and **50 for Champion's Reaction**. v1 charged 110 for Night Vigil; the sheet charges
   **50 for Implement's Empowerment** and **30 for Devise a Stratagem**. Repriced against real
   line-items, v1's feature list costs about **760**, not 1020 — meaning v1 was not "high-risk", it
   was **260 points underspent**, and it was underspent on the one thing it most needed.
5. **Focus spells are not flat 10.** They are, mostly — Champion, Druid, Sorcerer, Magus and Oracle
   all pay 10 for a granted focus spell — but the Bard pays **50 and 70** for Counter Performance and
   Inspire Courage, and the Psychic pays **10 / 50 / 90** for its three psi cantrips. So 10 per Augury
   is only legal if the Auguries stay modest. §5 states that as a design rule and holds to it.
6. **§8's Sky contradicted the Sky this module already ships.** Four hard conflicts, listed in §8.1.
   The shipped code wins; the guide is rewritten around it.

### The design changes

7. **The class now has something to do on its turn.** This is the whole point of v2. v1 bought a
   reaction, a daily ritual, and a once-per-day die — and nothing a Stargazer could spend an action
   on. At 5th level its turn was "Stride, Recall Knowledge, and hope somebody rolls something."
   Two features fix it: **cantrips** (§2.2) and **Chart the Course** (§4.4).
8. **The one-round rewind is a class feature at 11th, not a subclass capstone.** v1 put *Unmake the
   Moment* on the Broken Thread path, which handed the class's headline fantasy — the thing the
   original pitch was actually about — to one player out of four who might pick it. Every Stargazer
   now gets it.
9. **Legendary Will is gone, and it paid for the casting line.** BCS line 69 says outright that the
   Bard's Legendary Will "is likely an error" and "should not be used as an example." Dropping it
   saves **190**, which is exactly the difference between a Class DC ladder (170) and a full Spell DC
   ladder (360). The trade is point-neutral, moves the saves onto the Caster-Specialist profile
   *exactly*, and buys five free cantrips on the way. §2.2.

**Net effect on power (as of v2):** the class was meaningfully stronger than v1 in rounds 2 and 3 of a
fight, very slightly weaker at 17th+ (no Legendary Will), and identical on the ledger at 2100. v2's
conclusion was "it is still not a Bard." **v3 overturns both halves of that** — the ledger and the
conclusion — and §0A above is what changed.

---

## 1 — Design foundations

### 1.1 The pitch

Four load-bearing pillars, from the original concept:

| The idea | Mechanical translation |
|---|---|
| Sees the future by watching the stars | A daily forecast, and an information economy built on it |
| A daily constellation with good and bad effects | The **Sky** (§8) — a world subsystem this module already ships |
| A manipulator of luck: helps allies, sabotages enemies | An at-will **reaction** moving any d20 by ±1, then ±2 |
| Aborts a bad ending by going back | A three-tier rewind: vision → one round → whole encounter |
| "Not very combat-oriented, like an Investigator" | Low attack investment, no weapon specialization, budget in utility |

### 1.2 The structural problem v1 had

PF2e is a three-action game, and every published class answers the question *"what do I do with my
three actions when nothing special is happening?"* Fighters Strike. Bards spend one action on
Courageous Anthem and two on a spell. Investigators Devise a Stratagem and Strike. Kineticists
Channel Elements and throw an impulse.

v1's Stargazer answered: nothing. Its entire budget went to a **reaction** (Fortune's Thread), a
**daily ritual** (Night Vigil), a **once-per-day die** (Portent) and **1–2 focus points per ten
minutes**. On round two of any fight, with the focus point spent, a v1 Stargazer had no class-relevant
action available. It had 8 HP, simple weapons at Trained, and no weapon specialization, so Striking
was not a real answer either.

That is not a balance problem in the "too strong" direction. It is a class that costs 2100 points and
is boring to hold. The ledger correction in §0 item 4 gave back the 260 points to fix it.

### 1.3 The three decisions that define the build

**Cantrips, no spell slots.** Five occult cantrips, known, cast at will. Slots would cost the ~740 the
Bard pays and eat the class whole. Cantrips cost **nothing** — BCS line 140: *"Each casting class,
even bounded, gets 5 free learned cantrips."* What they do cost is the DC line, because BCS line 25 is
explicit: *"If the class has any spell slots or cantrip slots, then it should have a Spell DC."* So
the Stargazer pays the full caster ladder, 360, and Legendary Will pays for it.

This is not unprecedented. **The Kineticist pays 360 for its DC with zero spell slots and zero learned
spells** — it is the only other class in the sheet shaped this way, and it is the Stargazer's closest
structural relative.

**The key ability is Wisdom.** BCS line 70 encourages exactly this: *"custom classes with Con, Dex, or
Wis as their key ability, as it may be thematically appropriate."* Wisdom keeps the class off the
Investigator's Intelligence turf and makes Perception — a rank the class cares about — key-driven.
*If you prefer Intelligence* (astronomy as mathematics rather than as patience), swap the granted
Occultism for Arcana; the ledger is unchanged.

**The profile is Caster-Specialist everywhere except its two senses.** 8 HP, light armour to Expert
at 13, simple weapons to Expert at 11, Fortitude Expert at 9, Reflex Expert at 13 — every one of those
is the Caster-Specialist recommendation exactly, and v3 does not touch them.

The two deliberate breaks are **Perception** and **Will**, both raised in v3 at the owner's direction:

- **Perception to Legendary at 13th**, matching the Investigator line for line. **No caster of any
  kind has Legendary Perception** — it belongs to the Ranger, the Investigator and the Gunslinger, and
  BCS line 36 caps the Caster-Specialist at Expert at 11. This is off-profile and stays off-profile;
  it is not defended by the sheet, it is defended by the concept.
- **Will to Legendary at 17th**, the Bard's line, which BCS line 69 flags as probably an error. Copied
  knowingly.

Everything else about the chassis is orthodox. The class is a Caster-Specialist that can see and
cannot be talked to.

---

## 2 — The point ledger (2860, and why)

### 2.1 The values used

Read out of `PROFICIENCYVALUES` on 2026-09-17, not from memory:

| Item | Cost | | Item | Cost |
|---|---|---|---|---|
| Trained / Expert / Master / Legendary | 10 / 50 / 110 / 190 | | HP (per point) | 10 |
| Skill increase / Skill feat | 5 / 5 | | Cantrip learned / slot | 5 / 5 |
| Spell learned / Spell slot | 10 / 10 | | 10th-rank slot | 190 |
| Weapon CS / WS / GWS | 50 / 70 / 150 | | Armor Specialization | 50 |

Plus two rules that do real work below: **line 140** (5 free cantrips for a casting class) and
**line 137** (Core Skill: Trained at 1, Expert at 3, Master at 7, Legendary at 15, 5 points each
increase, plus a skill feat at each).

### 2.2 Chassis — 1460

| Line | Value | Points |
|---|---|---|
| HP | 8 | 80 |
| Class feat at 1st | TRUE | 10 |
| **Spell DC** ("Stargazer DC") | T@1 / E@7 / M@15 / L@19 | 10 + 50 + 110 + 190 = **360** |
| **Perception** | T@1 / E@1 / M@7 / **L@13** | 10 + 50 + 110 + 190 = **360** |
| Fortitude | T@1 / E@9 | 10 + 50 = 60 |
| Reflex | T@1 / E@13 | 10 + 50 = 60 |
| Will | T@1 / E@1 / M@11 / **L@17** | 10 + 50 + 110 + 190 = 360 |
| **Saves total** | | **480** |
| **Attack** | Unarmed T@1, Simple T@1, Expert @11 | 10 + 10 + 50 = **70** |
| **Defense** | Unarmored T@1, Light T@1, Expert @13 | 10 + 10 + 50 = **70** |
| Weapon Specialization | *none* | 0 |
| Cantrips | 5 learned, repertoire | **0** (line 140) |
| Spell slots | *none* | 0 |
| Skills | 4 initial increases (20) + 2 granted (10) | **30** |
| Shield Block | FALSE | 0 |
| **CHASSIS** | | **1460** |

Legality, checked line by line against the design-guide sheet:

- **Line 18** — Caster-Specialist Spell DC is a *set* progression, T1/E7/M15/L19. Taken exactly. ✅
- **Line 25** — cantrip slots require a Spell DC. Taken. ✅
- **Line 24** — casters should get Legendary Spell DC unless Martial-Casters. Taken. ✅
- **Line 36** — Caster-Specialist Perception caps at Expert at 11. **Broken on purpose: Master at 7,
  Legendary at 13, the Investigator's line.** ❌ *by request, §0A item 1*
- **Line 64** — at least one save starts Expert (Will), at least one starts Trained (Fort, Reflex). ✅
- **Line 65** — saves starting Trained must reach Expert and may not reach Master. Fort E@9,
  Reflex E@13. ✅
- **Line 66** — a save starting Expert must reach Master, earliest 7th. Will M@11. ✅
- **Line 67** — Legendary in a save must be at least 3 feature steps after Master. M@11 → L@17. ✅
- **Line 69** — Bard's Legendary Will is likely an error and should not be copied. **Copied anyway.**
  ❌ *by request, §0A item 2*
- **Lines 55–57** — Caster-Specialist recommendations are Fort E@9, Reflex E@13, Will M@11. Fortitude
  and Reflex taken exactly; Will continues past the recommendation to Legendary. ⚠
- **Line 92 / 116** — Caster-Specialist recommendation is Light armour E@13 and Simple weapons E@11.
  Both taken. ✅
- **Line 100** — Trained in Unarmored minimum. ✅
- **Line 135** — 4 additional + 2 granted = 6 initial trained skills, above the 4 floor. ✅
- **Line 134** — initial skills are the tuning knob, set last. Used in §2.7. ✅

### 2.3 Features — 1400

| Level | Feature | Points | Anchor in the sheet |
|---|---|---|---|
| 1 | **Star Chart** (focus pool, Auguries) | 10 | Champion's *Lay on Hands* grant, 10 |
| 1 | First Augury | 30 | §5.1 — repriced from 10 in v3 |
| 1 | **Fortune's Thread** | 70 | *Inspire Courage* 70; *Champion's Reaction* 50 |
| 1 | **Chart the Course** (names 2 creatures from 11th) | 70 | *Implement's Empowerment* 50, +20 for the second name |
| 1 | **Night Vigil** | 50 | *Counter Performance* 50 |
| 1 | **Portent** | 30 | *Devise a Stratagem* 30 |
| 1 | **Stargazer's Path** (initial) | 50 | Thaumaturge *Initiate Benefit* 50 |
| 3 | **Astronomy Lore** — Core Skill (3 × 5) + 3 core skill feats (3 × 5) | 30 | line 137 |
| 5 | Path ability | 30 | *Divine Ally* 30 |
| 5 | **Widen the Sky** (2 creatures, any combination) | 50 | *Clarity of Focus* 50 |
| 5 | **The Last Thing You See** | 70 | *Champion's Reaction* 50; *Inspire Courage* 70 |
| 5 | Augury | 30 | §5.1 |
| 7 | **Second Star** (2nd Focus Point) | 30 | judgment call — §2.8 |
| 7 | Augury | 30 | §5.1 |
| 9 | **Surer Thread** (±1 → ±2) | 10 | *Investigator Expertise* 10 |
| 9 | Augury | 30 | §5.1 |
| 11 | **Unmake the Moment** | 110 | *Exalt* 110; *Reflow Elements* 110 |
| 11 | Augury | 30 | §5.1 |
| 13 | **Constellation Mastery** | 50 | *Clarity of Focus* 50 |
| 13 | Path ability | 70 | *Implement Paragon* 70 |
| 13 | Augury | 30 | §5.1 |
| 15 | **Twin Fates** (2 creatures) | 70 | |
| 15 | Augury | 30 | §5.1 |
| 17 | **Threefold Thread** (Fortune's Thread reaches 3) | 70 | *Implement Paragon* 70 |
| 17 | Path ability | 70 | *Implement Paragon* 70 |
| 17 | Augury | 30 | §5.1 |
| 19 | **Rewrite the Ending** | 190 | ***Hero's Defiance* 190** — verified, not assumed |
| 19 | Augury | 30 | §5.1 |
| | **FEATURES** | **1400** | |

Per-level: 310 + 30 + 180 + 60 + 40 + 140 + 150 + 100 + 170 + 220 = **1400**.

### **TOTAL: 1460 + 1400 = 2860**

Broken out the way `CLASSTOTALS` groups it: **class abilities 900**, **subclass abilities 220**,
**focus spells 280**.

### 2.4 The overage, itemised

| Change | Cost |
|---|---|
| Perception 170 → 360 (Investigator line, Legendary at 13) | **+190** |
| Will 170 → 360 (Legendary at 17) | **+190** |
| *The Last Thing You See* — the self-defence reaction | **+70** |
| *Threefold Thread* — Fortune's Thread reaches three | **+70** |
| *Widen the Sky* repriced (two creatures, any combination, not one-and-one) | **+20** |
| *Chart the Course* repriced (names two creatures from 11th) | **+20** |
| *Twin Fates* repriced (two creatures) | **+20** |
| **Auguries repriced 10 → 30 each**, nine known | **+180** |
| Multi-target heightening on every Augury | **0** — §5.1 |
| ***Death Foretold***, ***The Hour Is Not Come***, self-targeting *Borrowed Second* | **0** — they join a pool now paid for at the higher rate |
| | **+760** |

Half the overage is the two proficiency lines. The other half is the kit: **+200** of new and repriced
features, plus **+180** of Augury repricing — which is not extra power *on top of* §5.2 but the honest
bill **for** it.

**What 2860 means at the table.** It is **36% above** every published class. That is not "dual-class
strong" — the sheet's own `DualClass Calculator` puts a dual-class character at roughly double — but
it is comfortably *a single class with a free archetype already paid for, and then some*.

Expect a Stargazer to pull clearly ahead of the party's other support at four points:

| Level | What lands | Why it shows |
|---|---|---|
| **1** | *Death Foretold* | A 1st-level focus spell that frightens **five** creatures. Nothing else at 1st does that. |
| **5** | *The Last Thing You See* + two-target Threads | The class stops being a liability inside 30 feet. |
| **13** | Legendary Perception | It acts first in every encounter and finds everything. |
| **17** | Legendary Will + *Threefold Thread* | Effectively unbreakable mentally, moving three d20s a round for free. |

If the rest of your table is published-class PCs, tell them the number. If the rest of your table is
this module's other homebrew — the Saint, the Soulbound, the Breath Slayer, all at 2100 — **the
Stargazer is now the strongest character in the party**, and that should be a decision rather than a
discovery in session twelve.

### 2.5 The dials, if you ever want them

Budget is not a constraint here, so this is not a menu of trims — it is a map of where the power
actually sits, in case something misbehaves in play. Pull from the top.

| Dial | Worth | What removing it costs you |
|---|---|---|
| ***The Hour Is Not Come*** | 30 | The strongest single Augury: a reactive *"you were not going to die today."* **Watch this one first.** |
| *Threefold Thread* (17th) | 70 | Fortune's Thread stops at two creatures. The biggest late-game cut available. |
| *Guiding Star*'s 10th-rank tier | 0 | +2 to five allies is *Courageous Anthem* and then some. Cap it at +1 and it is merely excellent. |
| *Coiling Doubt*'s 1-minute critical failure | 0 | Three creatures rolling twice-take-lower for a minute ends boss fights. Cap the crit failure at 3 rounds as well. |
| *Death Foretold*'s crit-failure line | 0 | Frightened 3 **and** stunned 1 **and** fleeing is three riders on one outcome. Drop fleeing first. |
| Malefic's sky weight (§8.2) | 0 | Move 10 of it to Quiet if the world feels oppressive. Costs the class nothing. |
| Perception Legendary → Master@7 | 190 | Undoes half of §0A item 1. |
| Will Legendary → Master@11 | 190 | Undoes §0A item 2. |

The one thing **not** to cut is the Spell DC line. Dropping to a Class DC saves 190 and takes the five
cantrips with it, re-creating the dead-turn problem v2 existed to fix (§1.2) — and v3's Auguries, fear
effects and *The Last Thing You See* all key off that DC, so it is worth considerably *more* now than
it was.

### 2.6 Where 1120 of bespoke spending actually sits

This is the table v1 got wrong. Class abilities + subclass abilities, read out of `CLASSDATA`:

| Class | Bespoke | | Class | Bespoke | | Class | Bespoke |
|---|---|---|---|---|---|---|---|
| **Stargazer (v3)** | **1120** | | Swashbuckler | 380 | | Sorcerer | 190 |
| Summoner | 1040 | | Barbarian | 370 | | Investigator | 180 |
| Monk | 800 | | Fighter | 310 | | Witch | 170 |
| Alchemist | 760 | | Gunslinger | 210 | | Oracle | 130 |
| Inventor | 730 | | Magus | 190 | | Psychic | 130 |
| Kineticist | 660 | | Ranger | 190 | | Rogue | 110 |
| Champion | 470 | | Cleric (either) | 20 | | Bard | −160 |
| Thaumaturge | 410 | | Druid | 20 | | Wizard | 90 |

The pattern is not "good classes spend little." It is **classes that buy spell slots have nothing
left, and classes that don't buy slots spend it all on bespoke features.** Cleric spends 20 because
it spent 1000 on casting. Summoner spends 1040 because its eidolon *is* the class.

The Stargazer buys no slots, so a large bespoke figure is the expected shape. At **1120** it is now
the highest in the game, just past the Summoner's 1040 — but note that the Summoner reaches 1040 while
*also* buying 90 points of casting, and the Stargazer's extra 200 over v2 is the v3 kit (§2.4). The
number is defensible in shape and high in magnitude. What it does **not** defend is the
*distribution* — see §9.

### 2.7 The tuning knob

Initial skills were set last, per line 134. Four additional increases plus Occultism and Astronomy
Lore lands the total on 2100 with nothing left over. If a later change needs 5 points, the fifth
initial skill increase is where it comes from; if it needs to free 5, the fourth is where it goes.

### 2.8 The three judgment calls

Flag these if you post the build for review. Each has a stated fallback that keeps the total at 2100.

1. **Five free cantrips on a class with no spell slots.** Line 140 grants 5 free cantrips to "each
   casting class, even bounded." A class with cantrips and *no slots at all* is not something the
   sheet anticipated. If your table rules that the Stargazer must pay, 5 learned cantrips cost
   **25**. Take it from **Portent (30)** and put the spare 5 into a fifth initial skill increase
   (line 134, exactly what it is for). The class loses its weakest 1st-level feature and stays legal.
2. **Second Focus Point = 30.** The sheet does not price focus points at all. The nearest listed
   analogue is *"Signature or Unlimited Signature slots costs 30 points"* (line 142). If your table
   prices it at 10, the freed 20 buys two more Auguries.
3. **Unmake the Moment = 110.** Priced against *Exalt* (110) and *Reflow Elements* (110). It is a
   once-per-day, one-round, whole-table rewind with a stated cost, and it is the most likely feature
   in this document to need a second look after play. §10.2 gives the restriction that makes it
   tractable; if it still misbehaves, cut it to once per *encounter-day* and refund nothing — the
   frequency is the balance lever, not the price.

---

## 3 — Class advancement

**Key ability** Wisdom · **HP** 8 + Con modifier per level

**Initial proficiencies (1st):** Perception **Expert** · Fortitude Trained · Reflex Trained · Will
**Expert** · Occultism and Astronomy Lore plus 4 others Trained · unarmed and simple weapons Trained ·
unarmoured defence and light armour Trained · **Stargazer DC Trained** (Wisdom) · 5 occult cantrips.

| Lvl | Features |
|---|---|
| 1 | Ancestry and background, initial proficiencies, **Star Chart** (+1st Augury), **Night Vigil**, **Fortune's Thread**, **Chart the Course**, **Portent**, **Stargazer's Path**, Stargazer feat |
| 2 | Stargazer feat, skill feat |
| 3 | **Astronomy Lore** (Core Skill: Expert) + core skill feat, general feat, skill increase |
| 4 | Stargazer feat, skill feat |
| 5 | Ability boosts, ancestry feat, **Widen the Sky**, **The Last Thing You See**, **Path ability**, new Augury, skill increase |
| 6 | Stargazer feat, skill feat |
| 7 | **Expert Stargazer** (Stargazer DC expert), **Vigilant Senses** (Perception master), **Second Star**, Astronomy Lore → **Master** + core skill feat, new Augury, general feat, skill increase |
| 8 | Stargazer feat, skill feat |
| 9 | **Surer Thread**, **Great Fortitude**, new Augury, ancestry feat, skill increase |
| 10 | Ability boosts, Stargazer feat, skill feat |
| 11 | **Unmake the Moment**, **Resolve** (Will master), **Weapon Expertise**, new Augury, general feat, skill increase |
| 12 | Stargazer feat, skill feat |
| 13 | **Constellation Mastery**, **Incredible Senses** (Perception legendary), **Path ability**, **Lightning Reflexes**, **Armor Expertise**, new Augury, ancestry feat, skill increase |
| 14 | Stargazer feat, skill feat |
| 15 | Ability boosts, **Master Stargazer** (Stargazer DC master), **Twin Fates**, Astronomy Lore → **Legendary** + core skill feat, new Augury, general feat, skill increase |
| 16 | Stargazer feat, skill feat |
| 17 | **Threefold Thread**, **Greater Resolve** (Will legendary), **Path ability**, new Augury, ancestry feat, skill increase |
| 18 | Stargazer feat, skill feat |
| 19 | **Legendary Stargazer** (Stargazer DC legendary), **Rewrite the Ending**, new Augury, general feat, skill increase |
| 20 | Ability boosts, Stargazer feat, skill feat |

Nine Auguries known, at 1, 5, 7, 9, 11, 13, 15, 17 and 19.

---

## 4 — Class features

### 4.1 Star Chart (1st)

You carry an astrolabe, a star-map, a tattoo, or a memorised sky. You gain a focus pool of **1 Focus
Point** and the **Auguries** you learn from §5. Auguries are focus spells with the `prediction` trait;
their rank is always half your level rounded up, and they use your **Stargazer DC** and your Wisdom
modifier for spell attack rolls and DCs. You **Refocus** by reading the sky, or your chart, for 10
minutes.

You also know **5 occult cantrips**, chosen when you take the class, cast at will at a rank of half
your level rounded up. These are ordinary occult cantrips from the standard list — this class is a
reader, not an inventor. The thematically obvious picks are *guidance*, *daze*, *telekinetic
projectile*, *shield*, *message*, *read aura*, *detect magic* and *forbidding ward*; take what you
like. You can change one cantrip during your daily preparations.

> **Why cantrips at all.** Because this class needs an action to spend. See §1.2. *Telekinetic
> projectile* is not the Stargazer's identity; it is the thing a Stargazer does on round three when
> the focus point is gone, so that the identity gets to exist at all.

### 4.2 Night Vigil (1st)

The Sky turns without you (§8). One of thirteen skies is up each day, its aspect is Quiet, Benefic,
Retrograde, Malefic or — when the GM decides the story wants one — Exalted. Almost nobody can tell
which.

During your daily preparations, spend 10 minutes observing the sky. (Indoors, underground, or under
cloud, you read your chart instead — see *Clouded Sky*.) You gain three things:

1. **Certainty.** You learn today's sign *and* its aspect exactly. No check, no DC, no ambiguity.
2. **The Forecast.** You learn the sign and aspect of the **next three days**. The sky is fixed
   before anyone looks at it, so this answer does not change if you ask again — and neither does it
   change for the person you sell it to. *(This reads the module's existing 7-day queue; see §11.)*
3. **Augury of the Day.** You add the ascendant sign's Augury (§5.3) to your repertoire until your
   next daily preparations, **in addition** to the Auguries you know permanently. On a **Starless**
   sky you gain no Augury of the Day — but nothing is written, so you may roll your Portent twice and
   keep either result.

**Forewarned.** You may spend a further 10 minutes briefing up to five allies. You and each ally who
listens reduce the day's negative aspect by one step for the rest of the day: **Malefic →
Retrograde**, **Retrograde → no effect**. Positive aspects are unchanged; you cannot improve a good
sky, only survive a bad one.

*Forewarned is this class's party function, and after v3's reweighting it is live on **40% of days**
(§8.2) — 30% Malefic and 10% Retrograde. On those days the party simply does not have a bad day, and
will not know what that was worth until the session you are not there. Thirty percent of all days are
Malefic, which is the **−2** tier, so this is not a rounding error: it is the single largest thing the
class does for four other people.

**GM override.** The GM may declare the day's sign and aspect instead of rolling, whenever the story
wants it. That is the feature, not a cheat — it is the omen-telegraphing tool the class exists to
serve.

**Clouded Sky.** If you cannot complete a Night Vigil you learn nothing, gain no Augury of the Day,
get no forecast, and cannot use Forewarned. You are as blind as everybody else and the sky does not
care. The 6th-level feat *Sky Anchor* removes this.

### 4.3 Fortune's Thread (1st)

> **Fortune's Thread** ⤾ **[reaction]** (concentrate, prediction)
> **Trigger** A creature within 30 feet that you can see is about to roll an attack roll, a saving
> throw, a skill check, or a Perception check.
> **Effect** Choose one:
> - **Guide** — the triggering creature gains a **+1 circumstance bonus** to the roll.
> - **Snarl** — the triggering creature takes a **−1 circumstance penalty** to the roll. Snarl can
>   only be applied to an **attack roll, skill check, or Perception check**, never a saving throw.
>
> At 9th level (*Surer Thread*) the bonus and penalty increase to **±2**.

**Why circumstance.** It stacks with *Courageous Anthem*, *Bless*, *Heroism* and Aid, so the Stargazer
never steps on the party Bard. It is small, it is every round, it is at range, it costs no daily
resource, and it lands on whichever roll matters most — which is what "manipulator of luck" should
feel like. And ±1/±2 does not distort PF2e's tight math the way a reroll would.

**Why Snarl cannot touch saving throws.** An at-will, no-resource, no-check −2 to a boss's saving
throw would be the strongest single piece of caster support in the game, and nothing printed does it:
*Bane* is −1 status to **attack rolls only**, costs two actions, is sustained, and allows a Will save
to resist. *Ill Omen*, the closest analogue, explicitly covers *"an attack roll or skill check"* and
nothing else. Snarl matches Ill Omen's scope. **Guide is unrestricted** and does apply to your allies'
saving throws — helping your own side survive is a smaller effect than making the enemy fail, because
your side has four members and the boss has one.

*If your table wants Snarl on saves anyway:* cap it at −1 forever and drop *Surer Thread*. Do not run
it at −2.

**The trigger is legal PF2e.** Aid triggers on *"an ally is about to use an action that requires a
skill check or attack roll."* Same shape. It does mean the GM has to announce rolls before making
them; see §12.2.

### 4.4 Chart the Course (1st)

> **Chart the Course** ✦ **[one action]** (concentrate, prediction)
> **Effect** Name one creature within 60 feet that you can see — **two creatures from 11th level**.
> Until the start of your next turn, the first time a named creature rolls a d20, you may use
> **Fortune's Thread** on that roll **without spending your reaction**. If you named two creatures you
> may do this once for each of them. You can have only one Chart the Course active at a time.

This is the action the class was missing. It converts your turn into your identity rather than into a
Strike you are bad at: spend one action, and the round has two Threads in it instead of one.

It is deliberately *worse* than Courageous Anthem — one action for ±1 on one roll, against one action
for +1 to attack and damage for the whole party — and that is the correct relationship. What it buys
that Anthem cannot is **choice**: you pick the roll after you see what it is for.

### 4.5 Portent (1st)

When you complete a Night Vigil, roll a d20 and record the result. This is your **Portent**, and you
know its value.

> **Speak the Portent** ✦ **[free action]** (prediction)
> **Frequency** once per day
> **Trigger** A creature within 60 feet that you can see is about to roll a d20 for an attack roll, a
> saving throw, or a skill check.
> **Effect** The creature does not roll. Its d20 result **is** your recorded Portent, and the roll
> resolves normally from there. The Portent is spent.
>
> A Portent of 20 counts as a natural 20 and a Portent of 1 as a natural 1, because it was one — you
> rolled it at dawn. Speak the Portent cannot be used on a roll already altered by a fortune or
> misfortune effect, and does not itself have those traits.

A new Night Vigil overwrites an unspent Portent. Tell your player that once.

**What it is actually worth.** The median Portent is a 10 or 11, which is worth very little. Roughly a
third of days give you a 15+ or a 6−, which is when this feature is a real resource: a near-certain
success handed to whoever needs it, or a near-certain failure handed to something making a save. It is
a once-per-day die you get to *aim*, not a once-per-day nuke, and on the days it is a 9 the right play
is to spend it early on something trivial and stop thinking about it. The 2nd-level feat *Twin
Portent* exists because of this.

### 4.6 Astronomy Lore (3rd) — Core Skill

Astronomy Lore is your core granted skill (BCS line 137). Your proficiency increases to **Expert at
3rd**, **Master at 7th** and **Legendary at 15th**, and you gain an extra skill feat at each of those
levels, which must apply to Astronomy Lore or Occultism.

Astronomy Lore covers celestial events, calendars, navigation by star, prophecy, and — at the GM's
discretion — Recall Knowledge about *anything that has been foretold*.

### 4.7 Widen the Sky (5th)

Fortune's Thread's range increases to **60 feet**, and when you use it you may affect **two creatures**
with the same reaction, in **any combination** — two Guides, two Snarls, or one of each. Both must be
within range and you must be able to see both. It is still a single reaction, and Snarl's restriction
to attack rolls, skill checks and Perception still applies.

*(v2 allowed only one Guide and one Snarl, which meant the buff half was dead whenever there was no
enemy roll to spoil. Two of the same is what makes this a real widening.)*

### 4.8 The Last Thing You See (5th)

> **The Last Thing You See** ⤾ **[reaction]** (concentrate, emotion, fear, illusion, mental,
> prediction, visual)
> **Trigger** A creature within 30 feet that you can see deals damage to you.
> **Effect** You show it the hour of its own death — not a threat, a **date**. It attempts a Will save
> against your Stargazer DC.
>
> **Critical Success** It is unaffected and is temporarily immune for 10 minutes.
> **Success** Frightened 1.
> **Failure** Frightened 2.
> **Critical Failure** Frightened 3 and **stunned 1**.

This is the class's first genuine "stop touching me" button, and it exists because 8 Hit Points, light
armour and Reflex Trained until 13th is not a survivable combination without one. Frightened is a
status penalty to **every check and DC** the creature has, so a failure here is worth more than a
Snarl and it lasts past your next turn.

**It competes with Fortune's Thread, and that is the design.** You have one reaction. Every round you
choose between bending somebody else's luck and making the thing that just hit you regret it. That
tension is the same one a Champion lives with, and it is the main brake on how much v3's buffs
actually stack in a single round.

*If you want it to stop competing:* the 10th-level feat **Two Warnings** grants a second reaction each
round, usable only for Fortune's Thread, this, and *The Hour Is Not Come*.

**Before 5th level**, the self-defence answer is the ***Death Foretold*** Augury (§5.2), which is
available from 1st, costs a Focus Point, and puts the same ladder on up to five creatures at once.

### 4.9 Second Star (7th)

Your focus pool increases to **2 Focus Points**. (The third, as for every published class, comes from
a class feat — *Conjunction*, 8th.)

### 4.10 Surer Thread (9th)

Fortune's Thread's bonus and penalty increase to **±2**.

### 4.11 Unmake the Moment (11th)

> **Unmake the Moment** ✦ **[free action]** (prediction)
> **Frequency** once per day (recharges on your next Night Vigil)
> **Trigger** Your turn begins.
> **Effect** Time rewinds to the **start of your last turn**. Everything done since then by every
> creature is undone: damage dealt, conditions applied, spells cast, movement made, resources spent,
> reactions used. Creatures reduced to 0 Hit Points return to the Hit Points they had. Everyone except
> you loses all memory of the unwound round. You keep it, and you may spend 1 action on your turn to
> shout a warning, granting one ally a **+2 circumstance bonus** to their next roll this round.
>
> You are **stunned 1** and **drained 1** when the loop resolves. Initiative order does not change.
> Enemies act again as the GM chooses — they are not obliged to repeat what they did, and they do not
> remember it either.

**The restriction that makes this playable** is the trigger. It is *your turn begins*, not *an ally
dies*. The rewind window is therefore always the previous round, always known in advance, and always
resolves on a clean initiative boundary. Without that, this feature is an argument.

**It is not a death-save.** If your ally dies on the enemy's turn and your turn is next, it works. If
your ally dies immediately after your turn, you wait a full round to undo it and everything else in
that round comes back too, including the enemy's crit on you. Deciding whether that trade is worth it
is the whole feature.

### 4.12 Constellation Mastery (13th)

You no longer read the sky. You argue with it.

- **Trade the Day.** During your Night Vigil you may swap today's **aspect** with the aspect of any of
  the next three days in your forecast. The two days exchange aspects; the signs do not move. You are
  not rewriting the future — the sky is fixed and you know it — you are **moving your place in it**, and
  the day you traded away is still coming.
- **Forewarned becomes Foreordained.** You and the allies you brief treat a negative aspect as
  **Benefic** instead of merely reducing it: **Retrograde → Benefic**, **Malefic → Benefic**. Your
  party's sky is never bad again. Exalted and Benefic days are unchanged; the sky is already being
  generous and does not enjoy being pushed.
- **Starless.** On a Starless sky you may choose any sign's Augury as your Augury of the Day.

> **Design note.** v1 had this feature *reroll* the day's aspect. That fights the shipped
> implementation, which pre-rolls seven days precisely so that *"the future is fixed before anybody
> looks at it"* (`tracker.mjs`) and a diviner cannot re-ask for a better answer. Trade the Day gets
> the same power at the table without breaking that invariant, and it is a better story.

### 4.13 Twin Fates (15th)

Once per 10 minutes, when you use Fortune's Thread, you may instead make it a true **fortune** or
**misfortune** effect for **up to two of its targets**: each rolls twice and takes the higher result
(Guide) or the lower result (Snarl). This replaces the bonus or penalty for those targets, and Snarl's
restriction to attack rolls, skill checks and Perception still applies.

Remember the stacking rule as printed: *"If a fortune effect and a misfortune effect would apply to
the same roll, the two cancel each other out."* Using Twin Fates on a roll an enemy has already made
misfortunate does nothing for either of you.

### 4.14 Threefold Thread (17th)

Fortune's Thread affects **three creatures** with a single reaction, in any combination of Guide and
Snarl. *Twin Fates* still affects two.

At this point the class's core reaction is, once per round and for no action, moving three separate
d20s by two each, chosen after you know what every one of them is for. §9.3 works out what that is
worth against the Bard, and the answer is "about the same, and aimed."

### 4.15 Rewrite the Ending (19th)

See §10.3. It gets its own section.

---

## 5 — The Auguries

### 5.1 How strong an Augury is allowed to be

v2 capped Auguries at 10 points each and wrote them as "single-target, one-round-to-one-minute
nudges." **That cap is gone in v3, and the reason is structural, not generosity.**

An Augury is not a spell you choose when you need it. Nine of them you know permanently, but the
tenth — the **Augury of the Day** — is handed to you by a d13 you do not control, and you find out
which one at dawn. A grant you cannot plan around has to be worth having on the day it lands, or the
whole Augury-of-the-Day mechanic is a daily reminder that the sky does not care about your build.
*Perfect Ledger* being a small Recall Knowledge trick is fine when you chose it. It is a wasted day
when it is all Virgo gave you.

So the new ceiling is the honest one:

> **An Augury should be as strong as a good focus spell of its rank.** The benchmarks are *Lay on
> Hands*, *Inspire Courage*, *Dirge of Doom* and *Moonbeam* — focus spells that are routinely
> *better* than a slot spell of the same rank, because that is what focus spells are. An Augury may
> buff several allies, may deal damage, may heal, and may impose real conditions.

**Priced at 30 each**, up from 10 — between the Bard's *Counter Performance* (50) and the sheet's
common granted-focus-spell rate (10), and matching the middle rung of the Psychic's 10 / 50 / 90
ladder. Nine known Auguries is **270**, up from 90; that is +180 of the v3 overage (§2.4).

**Multi-target heightening is free** and always was. A focus spell heightens automatically with your
level, and widening is the normal way spells scale — *fear* itself goes from one creature to five at
rank 3. Reaching more targets is not a separate purchase.

All Auguries: `prediction`, `focus`, occult; rank = **half your level rounded up**; DC = Stargazer DC.
"Heightened (+2)" steps therefore land every 4 character levels.

### 5.2 The list

Sixteen. You know **nine** permanently by 19th level and are handed a tenth most mornings.

---

***Death Foretold*** ✦✦ (concentrate, emotion, fear, illusion, mental, prediction, visual)
**Targets** up to 5 creatures within 30 feet · **Saving Throw** Will
You show each of them the hour of its own death, in detail, with the date.
**Critical Success** Unaffected. **Success** Frightened 1. **Failure** Frightened 2.
**Critical Failure** Frightened 3, **stunned 1**, and fleeing for 1 round.
**Heightened (4th)** A creature that fails also takes **2d6 mental damage**, doubled on a critical
failure. **(+2)** +2d6.
*Anchor:* *fear*, which reaches 5 creatures at rank 3 with the same frightened ladder. This trades
*fear*'s crit-failure fleeing for stunned 1 **and** keeps fleeing, and adds damage from rank 4 — which
is roughly where a focus spell should sit against a rank-1 slot spell heightened to the same rank.
**This is the class's answer to being touched, and it is available at 1st level.**

***The Hour Is Not Come*** ✦ **[reaction]** (concentrate, healing, prediction)
**Trigger** You or an ally within 30 feet is reduced to 0 Hit Points.
**Effect** It was not going to happen today. The target is reduced to **1 Hit Point** instead, gains
**temporary Hit Points equal to your level**, and does not gain the wounded condition from this
instance. A creature cannot benefit from this Augury again for 10 minutes.
**Heightened (5th)** The target also regains **2d8** Hit Points. **(+2)** +2d8.
*The single most valuable thing on this list, and the one to watch in play. It is a reaction, so it
competes with Fortune's Thread and* The Last Thing You See*, and it costs a Focus Point — the class
has two of those until 8th level.*

***Guiding Star*** ✦✦ (concentrate, prediction)
**Targets** 2 allies within 60 feet · **Duration** until the start of your next turn
Each gains a **+1 status bonus to attack rolls, damage rolls, Perception checks and skill checks**.
**Heightened (4th)** 3 allies. **(7th)** 4 allies. **(10th)** 5 allies, and the bonus is **+2**.
*This is deliberately* Courageous Anthem *with a target cap and a Focus Point attached, and from 10th
it is better than Courageous Anthem for four rounds a day. It is the flagship and it is priced as one.*

***First Blood*** ✦✦ (concentrate, prediction)
**Targets** up to 5 allies within 30 feet · cast during exploration
The next time each rolls initiative within the hour, it gains a **+2 status bonus** to that roll, is
**not off-guard** during the first round, and its **first Strike of the encounter that hits deals an
extra 1d6 spirit damage**.
**Heightened (+2)** +1d6.
*Anchor:* the initiative half of *foresight* (rank 9), spread across the party for one encounter.

***Iron Auspice*** ✦✦ (concentrate, prediction)
**Targets** 2 allies within 30 feet · **Duration** 1 minute
+2 status bonus to Fortitude saves, to Athletics checks to Shove, Trip and Grapple, and to checks to
resist forced movement. Each target gains **temporary Hit Points equal to three times your level**,
and **once** during the duration treats a critical failure on a Fortitude save as a failure.
**Heightened (+2)** +1 ally.

***Two Roads*** ✦ (concentrate, fortune, prediction)
**Targets** 2 allies within 30 feet
Before the end of your next turn, the first **skill check** each attempts is rolled **twice**; each
takes the higher result.
**Heightened (5th)** 3 allies, and it applies to **saving throws** as well. **(9th)** 4 allies.

***Shell of Hours*** ✦✦ (concentrate, healing, prediction)
**Targets** 2 allies within 30 feet · **Duration** 1 minute
Each regains **2d8 Hit Points** immediately and gains a +2 status bonus to saves against disease and
poison and to recovery checks. **Once** during the duration, the first time a target would be reduced
to 0 Hit Points it is reduced to **1 Hit Point** instead and the Augury ends for that target.
**Heightened (+2)** +2d8 and +1 ally.
*The class's only real healing, and it is deliberately behind* Lay on Hands *on raw output — 10d8 at
rank 10 against Lay on Hands' 60 — because it hits two targets and carries the reprieve.*

***Crown of Fire*** ✦✦ (concentrate, prediction)
**Targets** 2 allies within 30 feet · **Duration** 1 minute
+2 status bonus to Intimidation and Performance. Each target can **Demoralize at 60 feet** with no
auditory or visual requirement and no penalty for a shared-language failure. Once per round, when a
target critically succeeds at any check, one ally within 30 feet of it gains a **+1 status bonus** to
their next roll.
**Heightened (+2)** +1 ally.

***Perfect Ledger*** ✦ (concentrate, prediction)
**Targets** you and up to 2 allies within 30 feet
Each target's next **Recall Knowledge** this turn is a **free action**, gains a +2 circumstance bonus,
and on a success reveals one additional piece of information. On a critical success it also reveals the
creature's **lowest saving throw** and all of its **weaknesses**.
**Heightened (5th)** Every Recall Knowledge each target makes this turn is a free action.

***Fixed Point*** ✦✦✦ (concentrate, prediction)
**Area** 30-foot emanation · **Targets** up to 6 creatures you choose
Name attack rolls, saving throws, or skill checks. Until the end of your next turn, the **first roll
of that type** made by each chosen creature is treated as a **10** on the die, before modifiers.
**Heightened (6th)** Name two roll types.
*Still the strangest button on the sheet, and still the one whose correct use requires knowing whether
your party is ahead of the curve or behind it. Naming saving throws and pointing it at four enemies is
not always the right answer.*

***Coiling Doubt*** ✦✦ (concentrate, misfortune, prediction)
**Targets** up to 3 creatures within 30 feet · **Saving Throw** Will
**Critical Success** Unaffected. **Success** The next attack roll or skill check the target attempts
is rolled twice, taking the lower. **Failure** As success, but the first attack roll or skill check
each round for **3 rounds**. **Critical Failure** As failure for **1 minute**, and the target is
**stupefied 2**.
*Anchor:* *ill omen*, whose critical failure is exactly "every time during the duration, roll twice
take the worse," on one target. This spreads it across three and adds the stupefied rider.

***Hunted by the Sky*** ✦✦ (concentrate, prediction)
**Targets** 1 creature within 60 feet · **Duration** 1 minute
The target cannot be concealed or hidden from you. You and your allies gain a +1 circumstance bonus to
Seek and to Perception checks to find it, and the **first attack made against it each round** gains a
+1 circumstance bonus. Your **Snarl** against it is **−3**, or **−4** once you have *Surer Thread*.
**Heightened (6th)** 2 creatures.

***Alms of Fate*** ✦ (concentrate, fortune, prediction)
**Targets** 2 allies within 30 feet
On each target's next damaging effect before the end of your next turn, they **reroll all 1s and 2s**
on the damage dice and must keep the new results.
**Heightened (5th)** 3 allies. **(9th)** Each target also **maximises one damage die** of their choice.

***Poured Knowing*** ✦✦ (concentrate, prediction)
**Targets** 2 allies within 30 feet · **Duration** 1 minute
+2 status bonus to Arcana, Nature, Occultism, Religion and Society. Each target's **counteract checks**
during the duration use your Stargazer DC and proficiency rank if higher than their own, and count
their counteract rank as **1 higher**.
**Heightened (+2)** +1 ally.

***Deep Dream*** ✦✦ (concentrate, prediction)
**Targets** 2 allies within 30 feet · **Duration** 1 minute
+2 status bonus to Will saves and to Perception checks to disbelieve illusions. **Once** during the
duration, a critical failure on a Will save becomes a failure. While the Augury lasts, a target is
never off-guard merely for being unaware of a creature at the start of an encounter.
**Heightened (+2)** +1 ally.

***Borrowed Second*** ✦✦ (concentrate, prediction)
**Targets** you and/or 1 willing ally within 30 feet
Each target immediately **Steps** or **Strides up to its Speed** as a free action and gains a +1
circumstance bonus to AC until the start of your next turn.
**Heightened (5th)** 3 targets. **(9th)** 5 targets.
*Targeting yourself is new in v3, and it is the class's escape action.*

---

### 5.3 Which sign grants which

Twelve signs, twelve Auguries. Four Auguries (*Guiding Star*, *Borrowed Second*, *Death Foretold*,
*The Hour Is Not Come*) belong to no sign and can only be learned permanently — the two self-defence
options among them, deliberately, so that surviving is never something the sky has to hand you.

| Sign | Augury of the Day | | Sign | Augury of the Day |
|---|---|---|---|---|
| ♈ Aries | *First Blood* | | ♎ Libra | *Fixed Point* |
| ♉ Taurus | *Iron Auspice* | | ♏ Scorpio | *Coiling Doubt* |
| ♊ Gemini | *Two Roads* | | ♐ Sagittarius | *Hunted by the Sky* |
| ♋ Cancer | *Shell of Hours* | | ♑ Capricorn | *Alms of Fate* |
| ♌ Leo | *Crown of Fire* | | ♒ Aquarius | *Poured Knowing* |
| ♍ Virgo | *Perfect Ledger* | | ♓ Pisces | *Deep Dream* |
| | | | ✦ Starless | *none — see Night Vigil* |

Nothing stops you learning an Augury the sky will also sometimes hand you; on those days you have a
spare Focus Point's worth of nothing, which is the price of a guarantee.

---

## 6 — Stargazer's Paths

Four Paths. Each grants an ability at **1st (50)**, **5th (30)**, **13th (70)** and **17th (70)** —
220 points, the same as the Kineticist's subclass line. Every Path costs the same, so they are freely
interchangeable within the budget.

### 6.1 The Weaver — *fate is a fabric, and I have hands*

- **1st — Knotted Thread (50).** When you **Guide** an ally with Fortune's Thread, they also gain a
  **+1 circumstance bonus to AC** against the next attack made against them before the start of your
  next turn.
- **5th — Doubled Strand (30).** *Chart the Course* names **two** creatures instead of one. The free
  Fortune's Thread it grants may be used on either of them, but only once.
- **13th — Skein of Fates (70).** When you use Fortune's Thread you may apply **Guide to two allies**
  or **Snarl to two enemies**, instead of the one-and-one that *Widen the Sky* allows.
- **17th — Tapestry (70).** Once per 10 minutes, Fortune's Thread affects **every ally within 60 feet**
  (Guide) or **every enemy within 60 feet** (Snarl). One reaction, one choice, everyone.

### 6.2 The Herald — *I do not curse them. I announce what is coming*

- **1st — Ill Omen (50).** You learn ***Coiling Doubt***, and it does not count against your Auguries
  known. In addition, once per round, when a creature critically fails a roll you affected with
  **Snarl**, it takes **persistent mental damage equal to your Wisdom modifier**.
- **5th — The Announcement (30).** You can **Demoralize** using Astronomy Lore instead of Intimidation,
  at a range of 60 feet, with no auditory or visual requirement — you are not shouting, you are
  reading out a date.
- **13th — Sentence Passed (70).** ✦✦ (concentrate, misfortune, prediction), once per 10 minutes,
  1 creature within 60 feet, Will save against your Stargazer DC. **Failure** For 1 minute the target
  treats every natural 20 as a natural 10 and cannot benefit from fortune effects. **Critical Failure**
  As failure, and it is **doomed 1**.
- **17th — Foregone Conclusion (70).** Once per round, when you **Snarl** an attack roll and the attack
  misses, the attacker is **off-guard** until the end of its turn.

### 6.3 The Ephemeris — *I have read every sky. Ask me anything*

- **1st — Perfect Recall (50).** You can **Recall Knowledge using Astronomy Lore** in place of any other
  Knowledge skill, at a −2 circumstance penalty; the penalty goes away at 7th level when Astronomy Lore
  reaches Master. Your **first Recall Knowledge against any creature each combat is a free action**.
- **5th — The Almanac (30).** Night Vigil's forecast reaches **seven days** instead of three, and you may
  determine what the sky was on any past day you were alive for.
- **13th — Written Down (70).** When you critically succeed at a Recall Knowledge check, you and all
  allies who can hear you gain a **+1 circumstance bonus to all d20 rolls against that creature type**
  for 1 minute. You may also use Fortune's Thread on a Recall Knowledge check **after the roll but
  before the GM answers**.
- **17th — Every Sky Ever Read (70).** Once per hour, ask the GM one yes-or-no question about the next
  hour. The answer is **true**. (If the GM genuinely has not decided, the answer is "not yet written,"
  and the use is not spent.)

### 6.4 The Broken Thread — *I have already lost you once*

The original pitch's Path. Note that *Unmake the Moment* is **not** here any more — every Stargazer
gets the one-round rewind at 11th (§4.11). This Path is what happens when you do it better than
everyone else.

- **1st — Deja Vu (50).** ✦ **[free action]**, once per 10 minutes. **Trigger** You fail, but do not
  critically fail, a check. **Effect** Reroll it. This is a fortune effect.
- **5th — Second Sight (30).** *Deja Vu* can instead trigger on a failed check by an ally within 30 feet
  that you can see.
- **13th — Unmade Again (70).** *Unmake the Moment* can be used **twice per day**, and you are no longer
  **drained 1** when it resolves. You are still stunned 1.
- **17th — The Long Way Round (70).** *Unmake the Moment* may rewind to the start of **any creature's**
  last turn, not only your own — declare which as you use it. In addition, once per week, you may use
  *Unmake the Moment* **while dead**, if you died during the round it would undo.

---

## 7 — Class feats

Feats are not budgeted by the BCS — only *having* a class feat at 1st level is, and that is paid. So
this list can afford to be broad, and it should be: this class lives on breadth. Stargazer feats come
at 1, 2, 4, 6, 8, 10, 12, 14, 16, 18 and 20.

### 1st level

- **Astrological Sign** — Once per day, when you record your Portent, you may treat its value as any
  number within **3** of what you rolled.
- **Sky Reader** — Your Night Vigil takes **1 minute** instead of 10, and Forewarned takes 1 minute
  instead of 10.
- **Companion of the Watch** — You gain a familiar. It has the `celestial` trait and you gain one extra
  familiar ability, which must be an ability that gathers or carries information.
- **Cold Read** — You can attempt a Deception check to invent a prophecy convincingly. The GM rolls a
  secret Astronomy Lore check for you at the same time; on a critical success, you were **accidentally
  right**, and the GM should treat what you said as true.
- **Star-Touched Cantrip** — You learn one additional occult cantrip, and may swap it during daily
  preparations.

### 2nd level

- **Almanac** — You can attempt an Astronomy Lore check to determine the sky of **yesterday** or of a
  day more than three days out, at the DCs in §8.5.
- **Twin Portent** — Roll **two** d20s at your Night Vigil and record both as separate Portents. You
  must spend both before your next Vigil or lose them, and *Speak the Portent*'s frequency becomes
  twice per day.
- **Thread of Warning** — Fortune's Thread can trigger on an **initiative roll**, even though positions
  are not yet set and you may not be able to see the roller.
- **Augury Adept** — You learn one additional Augury.
- **Patient Watcher** — When you Refocus, you may also change one of your known Auguries.

### 4th level

- **Read the Room** — Once per encounter, Sense Motive as a **free action**.
- **Omen of Blades** — When you **Snarl** an attack roll and the attack still hits, you may spend 1
  Focus Point to reduce the damage by **2 per your Stargazer DC proficiency rank** (so 4 at Trained,
  6 at Expert, 8 at Master, 10 at Legendary).
- **Widened Chart** — *Chart the Course* has a range of 120 feet and no longer requires you to see the
  creature, only to know where it is.
- **Borrowed Eyes** — You can perform a Night Vigil through the senses of your familiar or a willing
  ally under an open sky, as long as you are within 1 mile of them.

### 6th level

- **Retrograde** — Once per day, when a creature within 30 feet critically fails a check, you may have
  it reroll. You might want it to succeed.
- **Sky Anchor** — You can perform a Night Vigil with no sky at all. *Clouded Sky* never applies to you.
- **Prophecy's Weight** — You can **Demoralize** using Astronomy Lore, at 60 feet, with no auditory or
  visual requirement. *(The Herald gets this at 5th; this feat exists for everyone else.)*
- **Long Thread** — Fortune's Thread's range increases by 30 feet.

### 8th level

- **Conjunction** — Your focus pool increases to **3 Focus Points**, the game's maximum.
- **Second Portent** — You may *Speak the Portent* twice per day. If you also have *Twin Portent*, you
  may speak three times, and you record three Portents.
- **Doubled Reading** — Once per day you may take the **better** of two Auguries of the Day by reading
  both today's sign and tomorrow's.

### 10th level

- **Fate's Favourite** — Once per day, treat one d20 roll **you** make as a 20. You saw this.
- **Wide Vigil** — Forewarned has no limit on the number of allies you may brief, and briefing takes 1
  minute.
- **Unspent Thread** — If you have not used your reaction by the start of your turn, your first *Chart
  the Course* that turn is a **free action**.
- **Two Warnings** — You gain a **second reaction** each round, usable only for **Fortune's Thread**,
  ***The Last Thing You See***, or ***The Hour Is Not Come***. This is the feat that resolves the
  class's central action-economy squeeze (§9.4), and it is deliberately a 10th-level purchase rather
  than a class feature.

### 12th level

- **Cascade** — When you use *Twin Fates*, apply the same effect to a **second** creature.
- **Long Now** — Your Auguries with a duration of 1 minute last **10 minutes**.
- **Prophesied Ally** — Choose one ally during your Night Vigil. Fortune's Thread used on that ally
  does not consume your reaction, once per round.

### 14th level

- **Inevitable** — Once per day, ⤾ reaction, when a creature critically succeeds at a check against
  you, it gets a success instead. This is a misfortune effect.
- **Star-Marked Enemy** — Choose one creature you can see. Until your next daily preparations, *Coiling
  Doubt* and *Snarl* against it do not require line of sight, only knowledge of its location.
- **Echo of the Unmade** — When you use *Unmake the Moment*, you may also grant **one ally** the memory
  of the erased round. They keep it; everyone else does not.

### 16th level

- **Constellation of One** — Work with your GM to add a **fourteenth sign** to the wheel: your own. It
  rises only over you, uses the standard aspect scaling, and you roll its aspect separately on days
  the sky is Starless. Design it together; it should grant an Augury you would not otherwise take.
- **Written in Advance** — Spend 10 minutes. The next skill check you attempt within the hour is an
  automatic **success** (not a critical success). You already did this.
- **Foretold Escape** — Once per day, when you would take damage that reduces you to 0 Hit Points, you
  may *Speak the Portent* on the triggering roll even if it has already been rolled and even if your
  Portent is spent — using a value of 1.

### 18th level

- **Two Skies** — During your Night Vigil, read the sky **twice**. Both signs are ascendant for you and
  the allies you brief: you gain both Auguries of the Day, and the second sign's aspect is rolled
  separately. *(This is the Stargazer's answer to the Saint's 18th-level* The Thirteenth*, and the two
  interact: on a Starless sky a Saint with that feat is lit, and a Stargazer with this one still reads
  a second sky over it.)*
- **The Long Vigil** — *Rewrite the Ending*'s cooldown drops to **3 days** if you have not used it at
  all during the current adventure.
- **Unbroken Chain** — *Unmake the Moment* recharges on a 10-minute rest rather than on your Night
  Vigil, but no more than once per hour.

### 20th level

- **Cartographer of Endings** — Once per day, ask the GM **one yes-or-no question about the next 24
  hours**. The answer is true.
- **Fixed Sky** — Your Portent is always a **20**. You may only speak it **once per week**.
- **The Sky Answers** — Once per day, when you would use *Rewrite the Ending*, you may instead use
  *Unmake the Moment* without spending its frequency, and *Rewrite the Ending* is not expended.

---

## 8 — The Sky

*Zero class points. It is terrain, not a class benefit — it applies to the ogre too.*

**This subsystem already exists in this module.** `scripts/sky/signs.mjs` and
`scripts/sky/tracker.mjs` ship it, the Saint is built on it, and there is a tracker window, a macro,
and a module API. §8 is written to the code, not the other way round.

### 8.1 What v1 got wrong about it

Four hard conflicts, all resolved in the code's favour:

1. **The aspect names.** v1 used *Ascendant / Exalted / Retrograde / Malefic*. The code uses
   **`none` (Quiet) / `benefic` / `retrograde` / `malefic` / `exalted`**. Worse, v1's "Ascendant"
   collides head-on with the Saint's use of the word: in the Saint guide and in the shipped effect
   items (`Sky: Ascendant (Leo)`), *ascendant* means **your sign is up**, which is a different axis
   entirely. **v1's "Ascendant" aspect is renamed Benefic throughout.**
2. **The odds.** v1 gave every day an aspect on a flat 45 / 5 / 45 / 5 d100 split. The code used
   weights, and v3 **changes those weights** — see §8.2 and the note below.
3. **Exalted used to be unrollable.** `signs.mjs` set its weight to **0** on purpose. **v3 changes
   that too**, and it is the one edit in this document that reaches into an already-played class.
   See §8.2.
4. **The future is fixed.** The tracker pre-rolls **seven days** and stores them, so that the Saint's
   *Read the Constellation* has an answer that cannot be re-asked for a better one. v1's Constellation
   Mastery rerolled the day's aspect, which breaks that. Replaced by **Trade the Day** (§4.12).

A fifth, softer conflict: the module **announces the sky publicly in chat by default**
(`announceSky`, default `true`), and v1 insisted the sky must be secret. §8.4 resolves it.

### 8.2 The loop, and v3's reweighting

Each dawn the GM advances the day. The next pre-rolled entry becomes today, and a new day is rolled
onto the end of the queue.

**The sign** — thirteen skies, **equally likely**, 1 in 13 each:

| ♈ Aries | ♉ Taurus | ♊ Gemini | ♋ Cancer | ♌ Leo | ♍ Virgo | ♎ Libra |
|---|---|---|---|---|---|---|
| ♏ **Scorpio** | ♐ **Sagittarius** | ♑ **Capricorn** | ♒ **Aquarius** | ♓ **Pisces** | ✦ **Starless** | |

**The aspect** — rolled by weight. **These weights changed in v3**, at the module owner's direction,
and `scripts/sky/signs.mjs` has been updated to match:

| Aspect | v2 weight | **v3 weight** | Meaning |
|---|---|---|---|
| **Quiet** (`none`) | 50 | **20** | The sky is unremarkable. Nothing happens. |
| **Benefic** | 20 | **30** | The sky is kind. **+1** to the sign's domain. |
| **Retrograde** | 15 | **10** | The sky drags. **−1** to the sign's domain. |
| **Malefic** | 15 | **30** | The sky is hostile. **−2** to the sign's domain. |
| **Exalted** | 0 | **10** | A Zenith. **+2** to the domain. |

All bonuses and penalties are **circumstance**, so they never stack with themselves and only one sign
is ever up. The worst a character can be is −2 in one narrow domain, which is inside PF2e's tolerance.

**What the reweighting does.** The sky was quiet half the time and is now quiet one day in five. It is
**hostile 40% of days** (30 Malefic + 10 Retrograde) and **kind 40%** (30 Benefic + 10 Exalted). Two
consequences follow:

- **Forewarned matters far more.** v2's Night Vigil bought a party-wide mitigation that was worth
  nothing on 70% of days. It is now live on **40%** of them, and the 30% that are *Malefic* are the
  −2 tier, which is the one worth being warned about. This is the largest indirect buff in v3 and it
  did not cost a point.
- **Malefic at 30% is a lot of −2.** A specific sign now comes up hostile about **2.3% of days each**,
  but *some* sign is hostile 40% of the time, and every creature in the world is inside it. If your
  table finds the sky oppressive, Malefic is the dial — move 10 points of its weight to Quiet before
  touching anything else.

> ### ⚠ The Exalted change reaches the Saint
>
> Exalted was weight **0** on purpose: `signs.mjs` said *"a Zenith is scheduled, not rolled — 1 in 260
> means it would otherwise never actually happen at the table."* At weight **10**, a Zenith can now
> happen by chance. For a **Saint**, whose own sign rises 1 day in 13, an unscheduled Zenith now lands
> roughly **once every 130 days of game time** instead of never — and a Zenith is the day a Gold Saint
> is *"~100% stronger"* (Saint guide v4 §1.2).
>
> That is a real buff to an already-implemented, already-played class, delivered as a side effect of a
> Stargazer change. It is probably fine — 1 in 130 days is still rare — but it should be a decision.
> **`scheduleZenith` is untouched**, so pinning a Zenith to a specific session still works and is still
> the right way to run an arc climax; you should not want the boss fight's timing decided by a d10.

### 8.3 The domains

What each sign touches when its aspect is live. Deliberately uniform so it runs from memory.

| Sign | Domain |
|---|---|
| ♈ **Aries** | Initiative rolls, and the first Strike you make in each encounter |
| ♉ **Taurus** | Fortitude saves; Athletics to Shove, Trip and Grapple, and to resist forced movement |
| ♊ **Gemini** | Deception and Diplomacy |
| ♋ **Cancer** | Medicine checks, recovery checks, and Fortitude saves against disease and poison |
| ♌ **Leo** | Intimidation and Performance |
| ♍ **Virgo** | Crafting, Recall Knowledge with any skill, and Perception to Search |
| ♎ **Libra** | *No modifier — see below* |
| ♏ **Scorpio** | Stealth and Thievery |
| ♐ **Sagittarius** | Ranged attack rolls; Survival, including Sense Direction and Subsist |
| ♑ **Capricorn** | Athletics to Climb, Jump and Swim |
| ♒ **Aquarius** | Arcana, Nature, Occultism, Religion, Society, and counteract checks |
| ♓ **Pisces** | Will saves; Perception against illusions and to disbelieve |
| ✦ **Starless** | Nothing. Nothing is written. |

**Libra is the exception**, because its domain *is* the die:

- **Benefic** Once per day, the first natural 1 you roll counts as a 10.
- **Exalted** As Benefic, but once per hour.
- **Retrograde** Once per day, the first natural 20 you roll counts as a 10.
- **Malefic** As Retrograde, but once per hour.

Libra is the sign your players will identify first, and that is fine. Libra is the tutorial.

> **v1's riders are cut.** v1 gave each sign an extra effect on Exalted and Malefic days — *"the GM
> lies"*, *"the party gains a Hero Point"*, *"your spell comes out the wrong colour"*. Those are not
> PF2e-shaped: Hero Points are a metagame currency the GM already controls, and an instruction to the
> GM to lie about Recall Knowledge is a table agreement, not a rule. The flat ±1/±2 on a stated domain
> is the whole system, and it is enough. If you want the riders, run them as GM colour on Exalted and
> Malefic days and do not write them down.

### 8.4 Who knows

**It affects everyone.** PCs, NPCs, the ogre in the cave, the duke's tax collector. That property is
what makes the whole thing safe to bolt onto a campaign: a Retrograde day is not a party nerf, it is
**weather**. In practice, track it for PCs and named NPCs only; −1 on a mook is noise.

**Whether anyone is told is a setting.** The module ships `announceSky: true`, which posts the day's
sign and aspect to chat. That is the right default for a table running the **Saint**, because a Saint
needs to know their Cloth is lit.

**With a Stargazer in the party, turn it off.** Set `announceSky: false` and whisper the Stargazer's
player instead. The class's 50-point Night Vigil is *certainty*, and certainty is worth nothing if it
is posted in chat for free. Then:

- **In person:** apply the modifier out loud and unexplained. *"That's a 17… minus one. 16. Miss."*
  Say nothing else.
- **In a VTT:** the effect is named `The Sky` with an empty description and a generic icon (§11).
  Players see that something is on them. They do not see what.
- **Let them get it wrong for months.** The folklore the players invent is the point.

**For everyone else — reading the sky without the class.** Ten minutes under an open sky and an
**Astronomy Lore** or **Occultism** check, as a Recall Knowledge action, against the region's
level-based **Hard** DC. On an Exalted or Malefic day, reduce the DC by 5; a great sky is obvious to
anyone who looks up.

| Outcome | Result |
|---|---|
| **Critical Success** | You learn the sign **and** the aspect. |
| **Success** | You learn the sign only. You know Scorpio rules today; not whether that is good news. |
| **Failure** | Nothing. |
| **Critical Failure** | You learn a **wrong sign**, confidently. |

**That check is what the Stargazer's 50 points actually buy the right to skip** — plus three days of
forecast, plus the ability to blunt the bad half for five people. The sky costs the class nothing;
*knowing* it is the class.

**Information is a commodity.** In a city with an observatory or a temple the day's sign is often
posted; the aspect rarely is, because reading energy is much harder than reading position. On a ship,
in the Darklands, on the frontier, nobody knows anything. Almanacs, hedge-astrologers and rival
Stargazers are all plot hooks, and a Stargazer walking into a frontier town is walking in with
something to sell.

### 8.5 How this class compares to the two sky feats already in the module

| | Sees | When | Range |
|---|---|---|---|
| **Saint — *Read the Constellation*** (8th, 1/week) | own sign only, whether it will be ascendant and whether Exalted | next 3 days | — |
| **Saint — *The Thirteenth*** (18th) | knows a Starless sky is coming | 1 day | — |
| **Stargazer — Night Vigil** (1st) | **every sign, every aspect, exactly** | **today + next 3 days, every day** | — |
| **Stargazer — *The Almanac*** (Ephemeris, 5th) | as above | **next 7 days, plus the past** | — |

A Saint spends an 8th-level feat and a weekly use to learn one thirteenth of what a 1st-level
Stargazer learns every morning for free. That gap is intentional and it is the class's whole case for
existing. It is also the reason a party with a Stargazer should not also be relying on the Saint's
feat — tell the Saint's player before they spend the feat.

### 8.6 Interaction with the Saint

- **Unfailing Cosmo** makes a Saint immune to Retrograde and Malefic aspects entirely, enforced in
  `tracker.mjs` rather than remembered. **Forewarned does nothing for a Saint.** If your party has
  both, the Stargazer's party function covers everyone *except* the one character who least needs it.
- **Trade the Day** (13th) moves aspects between days in the queue. It cannot move a **scheduled
  Zenith**, because that is the GM's arc-climax button and not a thing the sky rolled. Say so at the
  table before it comes up.
- A Stargazer can tell a Saint **exactly when their Cloth will be lit**, three days out, from 1st
  level. That is a genuinely large favour and it is the best cross-class hook in this module.

---

## 9 — Measured against PF2e's support classes

v2's version of this section concluded "it is not a Bard." **After v3 that is no longer true**, and
this section is rewritten rather than patched. The class is now above the published curve by design
(§2.4); what follows is where it lands, not whether it is legal.

### 9.1 The subtotal comparison

Read out of `CLASSDATA`. These are the real numbers, not estimates.

| Subtotal | **Stargazer v3** | *(v2)* | Bard | Cloistered Cleric | Oracle | Investigator | Thaumaturge | Kineticist |
|---|---|---|---|---|---|---|---|---|
| DC | **360** | 360 | 360 | 360 | 360 | 170 | 170 | 360 |
| Perception | **360** | *170* | 170 | 60 | 60 | 360 | 170 | 60 |
| Saves | **480** | *290* | 480 | 290 | 480 | 590 | 590 | 590 |
| Skills | **30** | 30 | 30 | 20 | 25 | 120 | 70 | 20 |
| Attack | **70** | 70 | 200 | 200 | 140 | 410 | 410 | 140 |
| Defense | **70** | 70 | 70 | 60 | 70 | 180 | 190 | 180 |
| Spell slots | **0** | 0 | 460 | 460 | 460 | 0 | 0 | 0 |
| Learned spells | **0** | 0 | 280 | 540 | 270 | 0 | 0 | 0 |
| Focus spells | **280** | *100* | 120 | 0 | 20 | 0 | 0 | 0 |
| Class abilities | **900** | *700* | −160 | 20 | 40 | 160 | 70 | 440 |
| Subclass abilities | **220** | 220 | 0 | 0 | 90 | 20 | 340 | 220 |
| HP + 1st feat | **90** | 90 | 90 | 90 | 80 | 90 | 90 | 90 |
| **TOTAL** | **2860** | *2100* | 2100 | 2100 | 2100 | 2100 | 2100 | 2100 |

Three lines are now the highest or equal-highest in the game:

- **Perception 360**, tied with the Investigator, the Ranger and the Gunslinger — and the only caster
  of any description to have it.
- **Focus spells 280**, the highest in the sheet, ahead of the Psychic's 150 and the Bard's 120. That
  is the §5.1 repricing, and it is the correct place for this class's spending: no slots, so the focus
  list *is* the spell list.
- **Class abilities 900**, second only to nothing — the Kineticist's 440 is the nearest published
  figure.

**Attack 70 is still half the sheet's floor**, and still the point: no published class pays less than
140. The Stargazer remains the worst weapon user in Pathfinder.

### 9.2 What ±1 and ±2 are actually worth

A martial with a +12 attack bonus swinging at AC 20 hits on an 8 (65%) and crits on an 18 (15%).
In units of average damage **D**:

| | Hit | Crit | Expected damage |
|---|---|---|---|
| Baseline | 50% | 15% | **0.80 D** |
| **Guide (+1)** | 50% | 20% | **0.90 D** — **+12.5%** |
| **Surer Thread (+2)** | 50% | 25% | **1.00 D** — **+25%** |

A +1 is worth double what it looks like, because in PF2e it moves the *critical* threshold as well as
the hit threshold. **Snarl** is the mirror: −2 on an incoming attack is about **−25%** expected damage
from it.

### 9.3 Support output per round — and where v3 crosses the Bard

| Class | Action cost | What the party gets, every round, at will |
|---|---|---|
| **Bard** — Courageous Anthem | 1 action | +1 status to attack **and damage** rolls and saves vs fear, **every ally in 60 ft** |
| **Cleric** — Bless | 2 actions, then 1 to sustain | +1 status to attack rolls in a growing emanation; plus the healing font |
| **Commander** — a tactic | 1 action | a squadmate gains a **reaction** to Strike, Stride or manoeuvre |
| **Champion** — the reaction | 1 reaction | damage reduction and a retaliation on one incoming attack |
| **Stargazer 1–4** | 0 actions | ±1 on **one** chosen d20 |
| **Stargazer 5–16** | 0 actions | ±1/±2 on **two** chosen d20s, any combination |
| **Stargazer 17+** | 0 actions | **±2 on three** chosen d20s |
| **Stargazer** — + Chart the Course | 1 action | one or two **more**, on creatures named in advance |

**The 17th-level line is the one that matters.** Three rolls at ±2 is three lots of §9.2's 25%, or
**0.75 attacks' worth of expected damage swing per round, for no action**. Courageous Anthem across a
four-person party touching six attacks at +1 is **0.75 attacks' worth**, plus roughly +1 damage per
hit.

So at 17th the Stargazer's reaction is **approximately Courageous Anthem's throughput, minus the
damage rider, plus three things Anthem cannot do**: it costs no action, it is chosen *after* you know
what each roll is for, and any of the three can be pointed at an enemy instead. At 5th–16th it is
roughly two thirds of Anthem. At 1st–4th it is a sixth.

That is the honest shape of the buff: **the class crosses from "excellent second support" to "peer of
the Bard on the buff line" at 5th, and to "ahead of it on the luck line" at 17th** — while keeping
Legendary Perception, Legendary Will, Legendary Astronomy Lore, the daily forecast and both rewinds,
none of which the Bard has any version of.

### 9.4 What it still does not have

This has not changed and it is what keeps the class from being simply better than a Bard:

- **No spell slots.** No *heroism*, no *haste*, no *slow*, no *fly*, no *revivify*, no battlefield
  control, no answer to a problem that is not a d20 roll. This is the big one and it is 740 points of
  Bard the Stargazer will never have.
- **Healing is two Auguries deep.** *Shell of Hours* and *The Hour Is Not Come* are real now, but they
  are Focus Points — two per encounter until 8th level, three after — against a Cleric's font. A
  Stargazer is not a healer; it is a class that can occasionally refuse one death.
- **No damage** beyond a cantrip, and the worst attack progression in the game.
- **One reaction.** Fortune's Thread, *The Last Thing You See* and *The Hour Is Not Come* all want it,
  every round. §4.8 — this is the main structural brake on how much of v3 actually stacks in a single
  round, and it is why the class did not need a further nerf elsewhere.

### 9.5 The verdict, stated plainly

**The Stargazer is now a first-rank support and the best information class in the game, and it is
above the published power curve.** Against the specific benchmarks:

| | Verdict |
|---|---|
| vs **Bard** | Comparable on the buff line from 5th and ahead of it from 17th; far behind on versatility, because 740 points of spell slots answer problems that ±2 cannot. Wins outright on information, action economy and debuffing. **v2 said "not a replacement." v3 is a replacement — for the buffing half of a Bard's job, not the spellcasting half.** |
| vs **Cleric** | Still not comparable. The font is the most valuable durability feature in the game and two healing Auguries are not it. |
| vs **Commander** | The Stargazer is now ahead. A tactic grants an ally a reaction — worth more than a single ±2 — but the Commander gets one tactic per action, and the Stargazer gets three ±2s per *reaction* plus the entire out-of-combat half. |
| vs **Investigator** | No contest any more. The Stargazer matches its Perception exactly, beats it on out-of-combat information, and vastly outperforms it as a support. The Investigator keeps in-combat weapon damage and nothing else. |
| vs **Thaumaturge / Kineticist** | Still far more durable than the Stargazer (590 saves against 480) and still able to fight. The Stargazer has overtaken both on utility. |

**It can still not be a party's only support**, for the reasons in §9.4 — but a party of Fighter /
Rogue / Cleric / Stargazer is now comfortably stronger than the same party with a Bard in the slot,
and you should expect that to show.

### 9.6 The part no table measures

Balance conversations about this class keep landing on ±2 and missing the actual power, which is **a
1st-level character who knows, every morning and for free, what the next three days hold.**

v3 made that worse in a way the ledger does not see: the sky reweighting (§8.2) means 40% of days now
carry a live negative aspect instead of 30%, and 30% of days are the −2 tier. Night Vigil's Forewarned
was priced at 50 when it was live on three days in ten. It is now live on four, and the bad days are
worse. **It was not repriced.** If anything in this class is underpriced, it is this, and it is the
one number only play can settle.

### 9.7 Where to look first if it misbehaves

1. ***The Hour Is Not Come***. A reactive *"no, they do not die"* on a Focus Point is the strongest
   single thing v3 added. It competes for the reaction, which is the only reason it is not
   unambiguously too much.
2. ***Death Foretold*** **at 1st level.** Five creatures, Will save, frightened 2 on a failure, and
   frightened 3 + stunned 1 + fleeing on a critical failure. Against a 1st-level encounter that is
   often simply the whole fight. Watch levels 1–3 specifically; it settles down as enemies' Will saves
   scale.
3. ***Coiling Doubt***'s critical failure — three creatures, twice-take-lower, one minute, stupefied 2.
4. **Threefold Thread plus Twin Fates plus the Herald's *Sentence Passed*.** At 17th a Herald can strip
   a boss's fortune effects and natural 20s while Snarling it at −2 every round and *Hunted by the Sky*
   pushes that to −4. That is −4 on a boss's every attack, at will. It is the single largest stack in
   the class.
5. **Snarl against a crit-fishing enemy**, as in v2. The lever is still to cap Snarl at −1.

### 9.8 Where it is weak, on purpose

- **8 HP, light armour, and Reflex Trained until 13th.** The Stargazer still dies to area damage —
  v3 bought defences against *being attacked and being talked to*, not against fireballs. Legendary
  Will and Legendary Perception do nothing about a Reflex save.
- **It cannot fight.** 70 points of attack, no weapon specialization, ever.
- **One reaction, three things that want it.** §9.4.
- **It depends entirely on the GM announcing rolls before making them.** §12.2. A GM who rolls fast
  behind a screen turns most of this class off.

## 10 — The rewind, in three tiers

The feature the original pitch was really about, and the one that can quietly ruin a table. The
problem is not power — it is that **a rewind invalidates play that already happened**, and PF2e's
encounter maths assumes spent resources are gone. So it is three separate things, at three scopes.

### 10.1 Tier 1 — *The Dream* (0 points, available from 1st level)

The scene from the original pitch: the party makes a choice, it goes wrong, people die, everything is
lost — and then the Stargazer wakes up and it was a doomed timeline.

**Do not make this a player-facing button.** It is a **GM technique** with the Stargazer's permission:

1. The Stargazer's Night Vigil produces **a vision the player does not get to interpret**. The GM
   narrates an image — a broken bridge, a mask, a name, a colour. Write it down.
2. When the party is about to do something the GM knows is catastrophic, the GM runs the bad timeline
   **for real**. Twenty minutes, an hour, a whole session, whatever the moment deserves. Play it
   straight. Let them die.
3. The Stargazer wakes at their Vigil. It is undone. **The players keep every piece of information
   they learned** — the name, the trap, the resistances, who betrayed them.

Costed at **0** because it grants no mechanical benefit the BCS can price. The party gets
*information*, which is the class's identity, and the GM controls the frequency entirely.

**Frequency:** once per adventure or arc, maximum, and only when the GM initiates. If a player can
invoke it, they will ask *"is this a bad ending?"* at every fork, and you have built a save-scummer.

### 10.2 Tier 2 — *Unmake the Moment* (110 points, 11th level, every Path)

The one-round rewind. Full text in §4.11. Three notes:

- **The trigger is the whole design.** *Your turn begins.* The window is always the previous round,
  always known, always a clean initiative boundary. Every other trigger turns this into a negotiation.
- **It is once per day and it costs you stunned 1 and drained 1.** Losing your next turn and a point
  of Constitution-derived everything is a real price, and it is the reason this does not get used
  casually.
- **v1 put this on a subclass.** It is a class feature now, because the class's headline fantasy
  should not be a build choice one player in four makes.

### 10.3 Tier 3 — *Rewrite the Ending* (190 points, 19th level)

The full encounter rewind. Priced at **190 — verified as the exact cost of *Hero's Defiance***, the
Champion's 19th-level feature, which is the ceiling the sheet allows for a single feature.

> **Rewrite the Ending** ✦ **[free action]** (prediction)
> **Frequency** once per week
> **Trigger** You or an ally within 60 feet dies, or the party is defeated or captured.
> **Effect** Time unwinds to the **moment initiative was rolled** for this encounter. All damage,
> conditions, deaths, expended spells, expended items and expended resources since that moment are
> restored, for every creature. The encounter has not happened.
>
> **You alone remember it.** As part of this free action you may share what you saw: each ally who was
> in the erased timeline gains a **+2 circumstance bonus to their initiative roll and to their first
> d20 roll** of the re-run encounter, and the party has full knowledge of everything it learned —
> tactics, resistances, the ambush, the trap in the floor.
>
> **The cost.** Your Star Chart goes dark. You are **drained 2** and **doomed 1**, and you lose Night
> Vigil, Fortune's Thread, Chart the Course, Portent, and all Auguries and Focus Points, until you
> complete a **full 8-hour Night Vigil under open sky**. Neither condition can be reduced before then
> by any means. You cannot use Rewrite the Ending again for 7 days regardless.

**Why once per week.** At once per day this is an undo button on every hard encounter in the game and
the adventure path's attrition model stops existing. At once per week, with an eight-hour open-sky
recovery a dungeon cannot easily provide, it is a rare "the story does not end here" moment — which is
what was actually asked for.

**Running it:**

- Screenshot the VTT board and everyone's sheet at initiative. That is the restore point.
- Do not re-run the enemies' identical dice. Re-run the *encounter*. It will go differently.
- It is a **plot device with a stat block**. Tell the table it exists before session one.

### 10.4 If 19th level is too late for your campaign

Most PF2e games end around 10 to 12. Two honest options:

1. **Run Tiers 1 and 2 and never take Tier 3.** In a level 1–12 campaign, the wake-from-the-dream
   scene is the thing you actually want and it costs nothing, and *Unmake the Moment* at 11th is its
   mechanical version. This is the recommendation, and it is why v2 made *Unmake the Moment* a
   class feature rather than a Broken Thread ability: at 11th level every Stargazer now reaches the
   rewind, instead of only the one player in four who picked that Path.
2. **Move Tier 3 down and pay for it.** To put *Rewrite the Ending* at 13th you must find 190 points
   at 13th. Concretely: drop **Twin Fates** (50), **Constellation Mastery** (50), **Second Star** (30),
   **Widen the Sky** (30), and **three Auguries** (30). The class stays at 2100 and becomes a
   one-trick time-rewinder with no luck engine worth the name. **Not recommended** — it guts the
   identity the class was asked for.

---

## 11 — Building it in Foundry

This module already ships the hard half. What follows is what is left.

### 11.1 The class item

`content/stargazer-class/stargazer.json`, mirroring the Saint's and the Soulbound's shape:

```jsonc
"system": {
    "hp": 8,
    "keyAbility": { "value": ["wis"] },
    "perception": 2,                                  // expert
    "savingThrows": { "fortitude": 1, "reflex": 1, "will": 2 },
    "attacks":  { "simple": 1, "unarmed": 1, "martial": 0, "advanced": 0 },
    "defenses": { "unarmored": 1, "light": 1, "medium": 0, "heavy": 0 },
    "trainedSkills": { "value": ["occultism"], "additional": 4, "custom": "Astronomy Lore" },
    "spellcasting": 1
}
```

Two notes from the other two classes' build logs, which apply here unchanged:

- **A class cannot train a Lore in Pathfinder's data model** — only a background can. Astronomy Lore
  arrives the way the Soulbound's Spirit Lore does: granted as part of the 1st-level package via
  the class feature's own rule elements, not via `trainedSkills`. The `custom` field above is
  documentation, not mechanism.
- **The focus pool must be set by level, not by how many focus effects you know.** pf2e's default
  derives the pool from granted focus spells; that is fine here because Auguries are granted at nine
  levels, but *Second Star* (7th) and *Conjunction* (8th feat) should set the maximum explicitly, the
  same way the Soulbound's pool does.

### 11.2 Fortune's Thread

The awkward one, and the reason this class needs more automation work than the Saint did.

- Build the reaction as an **action item** with a `ChoiceSet` for Guide versus Snarl, which applies one
  of **two effect items** to the *target* — the cross-actor path `scripts/riders/relay.mjs` already
  solves for the Saint.
- Each effect is a single `flat-modifier` with `type: "circumstance"`, `value: 1` or `-1`, and
  `selector: ["attack", "saving-throw", "skill-check", "perception"]` for Guide,
  `["attack", "skill-check", "perception"]` for Snarl — **the selector list is where §4.3's
  restriction is enforced**, so get it right there and nowhere else.
- `duration: { value: 0, unit: "rounds" }` so it self-clears at the end of the turn it was applied in.
- The ±2 upgrade at 9th is a second `flat-modifier` on the *Stargazer*, or simpler, a
  `value: "ternary(gte(@actor.level,9),2,1)"` on the effect. Prefer the latter; one item, no
  suppression logic.
- **The `prediction` trait matters mechanically.** Creatures with `immunity: prediction` exist in the
  bestiary. Put the trait on the action and let pf2e's IWR do the rest — `src/module/actor/data/iwr.ts`
  already handles it.

### 11.3 Chart the Course and Portent

- **Chart the Course** is a flag plus an effect on the named creature; the "free Fortune's Thread"
  is bookkeeping the player does, not something worth automating. A chat card naming the creature and
  expiring at the start of your next turn is enough.
- **Portent** is a macro and a flag — `actor.setFlag("world", "portent", value)` — applied by hand.
  Replacing a d20 result programmatically fights pf2e's dice pipeline and is not worth it. The Saint's
  `scripts/outcomes/` helpers see the die after the fact, which is the wrong side of the roll for this.
  Roll it at daily preparations, whisper it, and let the player say when.

### 11.4 The Sky — what v3 already changed in code

**Done in this change, not left as a note:**

- `scripts/sky/signs.mjs` — the `ASPECTS` weights are now **20 / 30 / 10 / 30 / 10** (Quiet, Benefic,
  Retrograde, Malefic, Exalted), per §8.2. The comment explaining why `exalted` was 0 has been replaced
  with one explaining what changed and **that it reaches the Saint**.
- `README.md` — the *Schedule Zenith* bullet said `Exalted` had "a roll weight of **zero**." It no
  longer does, and the bullet now says so while still recommending scheduling for an arc climax.

Nothing else in `scripts/sky/` needed to change: `rollAspect()` already normalises over the weight
total, so reweighting is a data edit, and `scheduleZenith` is untouched.

### 11.5 The Sky, the part that still does not exist

`scripts/sky/` currently applies effects **only to Saints**, and only `Sky: Ascendant` / `Sky: Zenith`
when a Saint's own Cloth is up (`tracker.mjs → applyTo`). §8.3's domain modifiers are **not
implemented for anyone**. Building them means:

1. **Four effect items per sign**, named identically — `The Sky` — with an empty description and one
   shared generic icon, carrying one `flat-modifier` scoped to that sign's domain selectors. Aries
   Benefic is `selector: ["initiative"], type: "circumstance", value: 1`. That is **48 items**
   (12 signs × 4 aspects); Starless has none and Quiet has none.
2. **A second application path in `tracker.mjs`** that applies the day's sign/aspect effect to *every*
   character, not just Saints — gated behind a new world setting, because a table running only the
   Saint should not suddenly acquire 48 new effects.
3. **Keeping `Unfailing Cosmo` working.** The existing rule — Saints never receive Retrograde or
   Malefic — has to survive the new path. The check already lives in `applyTo`; the new path must
   share it rather than reimplement it.
4. **Respecting `announceSky`.** §8.4 wants it off with a Stargazer at the table. The setting exists;
   add a whisper-to-the-Stargazer branch rather than a second setting.

Estimated work: the 48 effect items are mechanical and can be generated from a table; the tracker
change is small. This is the single largest implementation item in the class and it should be its own
phase, the way the Soulbound's lineages were. **v3's reweighting makes it more urgent, not less:** the
sky is now live on four days in five instead of one in two, so a subsystem that applies nothing is
wrong four times as often.

### 11.6 Auguries

Spell items with `traits: ["prediction", "focus", "occult"]`, `category: "focus"`, and standard
focus-spell auto-heightening. The Augury of the Day is a compendium lookup keyed off
`SkyTracker.state.sign` — a one-line mapping from §5.3 — granted and revoked on the
`isaacs-hb-pf2e.skyChanged` hook, which `tracker.mjs` already fires.

### 11.7 What not to automate

- **Rewrite the Ending.** It is a screenshot and a conversation.
- **Unmake the Moment.** Same, at a smaller scale. Undoing a round of state in Foundry is not a
  feature, it is a bug generator. The GM narrates the rewind; players re-set their own sheets.
- **Night Vigil's forecast.** `api.sky.forecast(3)` already returns it. Whisper the output. Done.

---

## 12 — Playtest checklist

In order of how likely each is to bite.

1. **Fortune's Thread eats the table's clock.** Every d20 in the game now prompts *"wait — reaction?"*
   Mitigation: the player declares a **standing policy** at the start of each combat — *"I Snarl the
   first attack against Kesh each round"* — and deviates deliberately, out loud. Make this a rule at
   your table, not a suggestion.
2. **The GM has to announce rolls before making them.** Fortune's Thread triggers *before* the roll.
   A GM who rolls fast behind a screen turns the class off entirely. This is the same problem Aid,
   Counter Performance and the Champion's reaction already have, so most tables handle it — but
   confirm it before session one, because this class is 70 points into that assumption.
3. **The GM forgets the sky.** The number one failure mode of the whole framework: it is invisible by
   design, so nothing at the table reminds you. Use the tracker's Advance Day button as part of your
   morning routine. If you skip a day, do not retcon it — the sky was cloudy.
4. **The sky is now loud.** After v3's reweighting only one day in five is Quiet and 30% are Malefic,
   so the players will notice unexplained penalties much sooner than v2's spread intended. That is the
   point — but it also means the folklore forms faster, and a table that liked the sky being subtle
   should move 10 weight from Malefic to Quiet (§8.2) rather than abandoning the subsystem.
5. **Portent is a 20 and the player hoards it for four sessions.** Fine, and the best part of the
   class. Just remind them once that a new Vigil overwrites it.
6. **8 HP plus light armour plus Reflex Trained until 13th means the Stargazer dies to fireballs.**
   Intentional; verify the player knows. §9.8 has the free re-slot if it is brutal.
7. **Rewrite the Ending never comes up, because 19th level.** Expected. Run Tier 1 constantly instead.
8. **Nobody notices the class is a support.** Because its output is a number on somebody else's
   sheet. Have the Bard's player and the Stargazer's player both track "rolls I changed the outcome
   of" for three sessions. It is the only way either of them will believe the other is contributing.

---

## 13 — Open questions

The decisions this guide made where it could reasonably have gone the other way. Flag these if you
take the build to review, and revisit them after play.

1. **Cantrips at all.** They solve §1.2, and they cost nothing on the ledger — but they make the
   Stargazer read as "a caster" in a way the original pitch did not. The alternative was a second
   bespoke at-will class action, which would have cost 50–110 and needed balancing from scratch.
   Cantrips use content that is already balanced. If cantrips feel wrong at your table, the fallback
   is in §2.8 item 1 and it is clean.
2. **Legendary Will and Legendary Perception together.** v2 dropped Legendary Will on BCS line 69's
   advice; v3 restored it *and* added Legendary Perception, which no caster has. From 17th the class
   is very close to immune to anything targeting its mind or its senses. That is the correct end state
   for a seer and it is two profile breaks in the same direction — if the class ever feels
   untouchable rather than perceptive, this pair is why.
3. **Snarl not applying to saving throws.** §4.3 argues this at length. It is the change most likely
   to be unpopular with the player and most likely to be correct.
4. **Whether Night Vigil is worth 50 or 500.** §9.6. Unanswerable on paper, and v3's reweighting
   raised it again without repricing it: Forewarned went from live on 30% of days to 40%, and the
   hostile half got heavier. If anything in this class is quietly underpriced, it is this.
5. **The Sky's domain modifiers for every creature in the world** are 48 unbuilt effect items and a
   tracker change (§11.4). Until they exist, §8.3 is a paper subsystem and Forewarned has nothing to
   forewarn against. **This is the gap between this document and a playable class**, and it should be
   the first phase of implementation, not the last.
6. **The Exalted reweighting reaches the Saint** (§8.2). A Zenith can now happen by chance, roughly
   once per 130 days of game time, where `signs.mjs` previously guaranteed it never would. This is the
   only change in v3 that alters an already-played class, and it was a side effect of a Stargazer
   request rather than a Saint decision. Worth a look from the Saint's side.
7. **Whether Auguries at 30 points are now too good rather than too weak.** §5.1 raised the ceiling
   because a random daily grant has to be worth having. *Death Foretold* at 1st level and *The Hour Is
   Not Come* are the two most likely to have overshot; §9.7 says what to watch.
8. **Whether the single reaction is enough of a brake.** Three abilities now compete for it, and §9.4
   leans on that competition as the reason v3's buffs do not simply stack. If *Two Warnings* (10th)
   turns out to be mandatory rather than optional, the brake was load-bearing and the feat should
   probably not exist.
9. **Trade the Day versus rerolling the aspect.** v1 rerolled; the shipped queue says the future is
   fixed. Trade the Day respects the code. If you would rather the diviner be able to genuinely
   change the weather, that is a different class thesis and it needs the queue design revisited too.

---

## Summary card

> **Stargazer** — Key ability WIS · 8 HP · Stargazer DC (spell DC, **Legendary at 19**) · 5 occult
> cantrips, **no spell slots** · 16 Auguries, 9 known · Perception Expert → Master@7 → **Legendary@13**
> (the Investigator line) · Will Expert → Master@11 → **Legendary@17** · simple weapons and light
> armour, both Expert, no weapon specialization, ever · 6 initial skills · Astronomy Lore as Core Skill
> to Legendary
>
> **Identity:** an at-will ±2 on **three** d20s within 60 feet that costs no action (Fortune's Thread) ·
> a prophesied d20 you can force onto anyone (Portent) · a 1st-level focus spell that shows five
> creatures the hour of their own death (*Death Foretold*) · the only creature alive who knows which
> sign is up, what it means, and what the next three days hold (Night Vigil) · a one-round rewind at
> 11th · and, eventually, the right to declare that the ending you saw does not count.
>
> **Role:** first-rank support and the best information class in the game. Still no spell slots, still
> almost no healing, still cannot fight. Bring a Cleric.
>
> **BCS total: 2860** — chassis 1460, features 1400. **36% above the 2100 budget, on purpose** (§2.4).

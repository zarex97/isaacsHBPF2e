# The Stargazer — PF2e Class Guide, **Version 2**

### *The diviner, the luck-handler, and the one who has already seen how this ends*

*The complete, self-contained class. One chassis, **four Paths**, fourteen Auguries, the full feat
spine, and the three tiers of the rewind. Companion to **The Saint** (Gold Cloth guide v4), **The
Soulbound** (guide v1.4) and **The Breath Slayer** (guide v5), and costed on the same **2100-point**
budget.*

**Sources folded in:** the v1 draft supplied by the repository owner (`006b1f2b-stargazer-bcs-guide1.md`);
**BCS 1.4** (`Docs/homebrewing/BCS 1.4 (current) _ Balanced Core System.xlsx`) for every point value,
read out of the sheet rather than quoted from memory; live PF2e system data from `pf2e_fork/packs/pf2e`
for every mechanical anchor; and **this module's own shipped Sky implementation**
(`scripts/sky/signs.mjs`, `scripts/sky/tracker.mjs`) for §8, which the v1 draft predates and contradicts.

---

## 0 — What changed from v1, and why

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
   are **Investigator 180, Bard −160, Wizard 90**. §2.4 prints the real table for all 23 classes.
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

**Net effect on power:** the class is meaningfully stronger than v1 in rounds 2 and 3 of a fight, very
slightly weaker at 17th+ (no Legendary Will), and identical on the ledger. It is still not a Bard.
§9 is the honest accounting of that.

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

**The profile is Caster-Specialist, and for once it is exact.** 8 HP, light armour to Expert at 13,
simple weapons to Expert at 11, Fortitude Expert at 9, Reflex Expert at 13, Will Master at 11,
Perception Master at 11. Every one of those is the Caster-Specialist recommendation or its only
published data point. v1 deviated on two lines (Perception Master at 7, Will Legendary at 17); v2
deviates on none.

---

## 2 — The point ledger (2100 exactly)

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

### 2.2 Chassis — 1080

| Line | Value | Points |
|---|---|---|
| HP | 8 | 80 |
| Class feat at 1st | TRUE | 10 |
| **Spell DC** ("Stargazer DC") | T@1 / E@7 / M@15 / L@19 | 10 + 50 + 110 + 190 = **360** |
| **Perception** | T@1 / E@1 / M@11 | 10 + 50 + 110 = **170** |
| Fortitude | T@1 / E@9 | 10 + 50 = 60 |
| Reflex | T@1 / E@13 | 10 + 50 = 60 |
| Will | T@1 / E@1 / M@11 | 10 + 50 + 110 = 170 |
| **Saves total** | | **290** |
| **Attack** | Unarmed T@1, Simple T@1, Expert @11 | 10 + 10 + 50 = **70** |
| **Defense** | Unarmored T@1, Light T@1, Expert @13 | 10 + 10 + 50 = **70** |
| Weapon Specialization | *none* | 0 |
| Cantrips | 5 learned, repertoire | **0** (line 140) |
| Spell slots | *none* | 0 |
| Skills | 4 initial increases (20) + 2 granted (10) | **30** |
| Shield Block | FALSE | 0 |
| **CHASSIS** | | **1080** |

Legality, checked line by line against the design-guide sheet:

- **Line 18** — Caster-Specialist Spell DC is a *set* progression, T1/E7/M15/L19. Taken exactly. ✅
- **Line 25** — cantrip slots require a Spell DC. Taken. ✅
- **Line 24** — casters should get Legendary Spell DC unless Martial-Casters. Taken. ✅
- **Line 36** — Caster-Specialist Perception: Master at 11 is the published data point. Taken. ✅
  (v1's Master at 7 was outside the profile.)
- **Line 64** — at least one save starts Expert (Will), at least one starts Trained (Fort, Reflex). ✅
- **Line 65** — saves starting Trained must reach Expert and may not reach Master. Fort E@9,
  Reflex E@13. ✅
- **Line 66** — a save starting Expert must reach Master, earliest 7th. Will M@11. ✅
- **Line 69** — Bard's Legendary Will is likely an error and should not be copied. Not copied. ✅
- **Lines 55–57** — Caster-Specialist recommendations are Fort E@9, Reflex E@13, Will M@11. All three
  taken exactly. ✅
- **Line 92 / 116** — Caster-Specialist recommendation is Light armour E@13 and Simple weapons E@11.
  Both taken. ✅
- **Line 100** — Trained in Unarmored minimum. ✅
- **Line 135** — 4 additional + 2 granted = 6 initial trained skills, above the 4 floor. ✅
- **Line 134** — initial skills are the tuning knob, set last. Used in §2.5. ✅

### 2.3 Features — 1020

| Level | Feature | Points | Anchor in the sheet |
|---|---|---|---|
| 1 | **Star Chart** (focus pool, Auguries) | 10 | Champion's *Lay on Hands* grant, 10 |
| 1 | First Augury | 10 | granted focus spell, 10 |
| 1 | **Fortune's Thread** | 70 | *Inspire Courage* 70; *Champion's Reaction* 50 |
| 1 | **Chart the Course** | 50 | *Implement's Empowerment* 50; *Clarity of Focus* 50 |
| 1 | **Night Vigil** | 50 | *Counter Performance* 50 |
| 1 | **Portent** | 30 | *Devise a Stratagem* 30 |
| 1 | **Stargazer's Path** (initial) | 50 | Thaumaturge *Initiate Benefit* 50 |
| 3 | **Astronomy Lore** — Core Skill (3 × 5) + 3 core skill feats (3 × 5) | 30 | line 137 |
| 5 | Path ability | 30 | *Divine Ally* 30 |
| 5 | **Widen the Sky** | 30 | *Divine Ally* 30 |
| 5 | Augury | 10 | |
| 7 | **Second Star** (2nd Focus Point) | 30 | judgment call — §2.6 |
| 7 | Augury | 10 | |
| 9 | **Surer Thread** (±1 → ±2) | 10 | *Investigator Expertise* 10 |
| 9 | Augury | 10 | |
| 11 | **Unmake the Moment** | 110 | *Exalt* 110; *Reflow Elements* 110 |
| 11 | Augury | 10 | |
| 13 | **Constellation Mastery** | 50 | *Clarity of Focus* 50 |
| 13 | Path ability | 70 | *Implement Paragon* 70 |
| 13 | Augury | 10 | |
| 15 | **Twin Fates** | 50 | |
| 15 | Augury | 10 | |
| 17 | Path ability | 70 | *Implement Paragon* 70 |
| 17 | Augury | 10 | |
| 19 | **Rewrite the Ending** | 190 | ***Hero's Defiance* 190** — verified, not assumed |
| 19 | Augury | 10 | |
| | **FEATURES** | **1020** | |

Per-level: 270 + 30 + 70 + 40 + 20 + 120 + 130 + 60 + 80 + 200 = **1020**.

### **TOTAL: 1080 + 1020 = 2100** ✅

Broken out the way `CLASSTOTALS` groups it: **class abilities 700**, **subclass abilities 220**,
**focus spells 100**.

### 2.4 Where 920 of bespoke spending actually sits

This is the table v1 got wrong. Class abilities + subclass abilities, read out of `CLASSDATA`:

| Class | Bespoke | | Class | Bespoke | | Class | Bespoke |
|---|---|---|---|---|---|---|---|
| Summoner | 1040 | | Swashbuckler | 380 | | Sorcerer | 190 |
| **Stargazer** | **920** | | Barbarian | 370 | | Investigator | 180 |
| Monk | 800 | | Fighter | 310 | | Witch | 170 |
| Alchemist | 760 | | Gunslinger | 210 | | Oracle | 130 |
| Inventor | 730 | | Magus | 190 | | Psychic | 130 |
| Kineticist | 660 | | Ranger | 190 | | Rogue | 110 |
| Champion | 470 | | Cleric (either) | 20 | | Bard | −160 |
| Thaumaturge | 410 | | Druid | 20 | | Wizard | 90 |

The pattern is not "good classes spend little." It is **classes that buy spell slots have nothing
left, and classes that don't buy slots spend it all on bespoke features.** Cleric spends 20 because
it spent 1000 on casting. Summoner spends 1040 because its eidolon *is* the class.

The Stargazer buys no slots, so 920 is the expected shape, and it sits between Alchemist and Monk.
That is the defence of the number. What the number does **not** defend is the *distribution* — see §9.

### 2.5 The tuning knob

Initial skills were set last, per line 134. Four additional increases plus Occultism and Astronomy
Lore lands the total on 2100 with nothing left over. If a later change needs 5 points, the fifth
initial skill increase is where it comes from; if it needs to free 5, the fourth is where it goes.

### 2.6 The three judgment calls

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
| 5 | Ability boosts, ancestry feat, **Widen the Sky**, **Path ability**, new Augury, skill increase |
| 6 | Stargazer feat, skill feat |
| 7 | **Expert Stargazer** (Stargazer DC expert), **Second Star**, Astronomy Lore → **Master** + core skill feat, new Augury, general feat, skill increase |
| 8 | Stargazer feat, skill feat |
| 9 | **Surer Thread**, **Great Fortitude**, new Augury, ancestry feat, skill increase |
| 10 | Ability boosts, Stargazer feat, skill feat |
| 11 | **Unmake the Moment**, **Resolve** (Will master), **Vigilant Senses** (Perception master), **Weapon Expertise**, new Augury, general feat, skill increase |
| 12 | Stargazer feat, skill feat |
| 13 | **Constellation Mastery**, **Path ability**, **Lightning Reflexes**, **Armor Expertise**, new Augury, ancestry feat, skill increase |
| 14 | Stargazer feat, skill feat |
| 15 | Ability boosts, **Master Stargazer** (Stargazer DC master), **Twin Fates**, Astronomy Lore → **Legendary** + core skill feat, new Augury, general feat, skill increase |
| 16 | Stargazer feat, skill feat |
| 17 | **Path ability**, new Augury, ancestry feat, skill increase |
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

*Forewarned is this class's party function, and it is worth nothing on 70% of days.* Half of all days
are Quiet and a fifth are Benefic (§8.2). On the 30% of days that are Retrograde or Malefic, the
party simply does not have a bad day, and will not know what that was worth until the session you are
not there.

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
> **Effect** Name one creature within 60 feet that you can see. Until the start of your next turn,
> the first time that creature rolls a d20, you may use **Fortune's Thread** on that roll **without
> spending your reaction**. You can have only one Chart the Course active at a time.

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
with the same reaction: one Guide and one Snarl. Both must be within range and you must be able to see
both. It is still a single reaction, and Snarl's restriction to attack rolls, skill checks and
Perception still applies.

### 4.8 Second Star (7th)

Your focus pool increases to **2 Focus Points**. (The third, as for every published class, comes from
a class feat — *Conjunction*, 8th.)

### 4.9 Surer Thread (9th)

Fortune's Thread's bonus and penalty increase to **±2**.

### 4.10 Unmake the Moment (11th)

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

### 4.11 Constellation Mastery (13th)

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

### 4.12 Twin Fates (15th)

Once per 10 minutes, when you use Fortune's Thread, you may instead make it a true **fortune** or
**misfortune** effect: the target rolls twice and takes the higher result (Guide) or the lower result
(Snarl). This replaces the bonus or penalty for that use, and Snarl's restriction to attack rolls,
skill checks and Perception still applies.

Remember the stacking rule as printed: *"If a fortune effect and a misfortune effect would apply to
the same roll, the two cancel each other out."* Using Twin Fates on a roll an enemy has already made
misfortunate does nothing for either of you.

### 4.13 Rewrite the Ending (19th)

See §10.3. It gets its own section.

---

## 5 — The Auguries

### 5.1 The rule that keeps them at 10 points each

The sheet prices a granted focus spell at **10** for Champion, Druid, Sorcerer, Magus and Oracle — and
at **50 and 70** for the Bard's, and **10 / 50 / 90** for the Psychic's. The difference is power. So:

> **No Augury may be worth more than 10 points.** Concretely, that means an Augury may not be a
> party-wide buff (*Inspire Courage*, 70), may not substitute your check for everyone's saving throw
> (*Counter Performance*, 50), and may not deal damage on the scale of an attack cantrip. An Augury
> is a single-target, one-round-to-one-minute nudge. If a design idea is stronger than that, it is a
> class feat or a Path ability, not an Augury.

Every entry below was written to that ceiling, and the two that pushed against it (*Hunted by the
Sky*, *Shell of Hours*) are flagged in place.

All Auguries: `prediction`, `focus`, occult; rank = half your level rounded up; DC = Stargazer DC.

### 5.2 The list

***First Blood*** ✦✦ (concentrate, prediction) — 1 ally within 30 feet, or yourself.
Cast during exploration. The next time the target rolls initiative within the hour, they gain a **+2
status bonus** to that roll and are **not off-guard** during the first round of the encounter.
**Heightened (5th)** 2 allies. **(9th)** 4 allies.
*Anchor:* the initiative half of *foresight* (rank 9, +2 status to initiative, not off-guard when
flanked), for one encounter instead of an hour, on one target.

***Iron Auspice*** ✦✦ (concentrate, prediction) — 1 ally within 30 feet, 1 minute.
+1 status bonus to Fortitude saves, to Athletics checks to Shove, Trip and Grapple, and to checks to
resist forced movement. The target also gains **temporary Hit Points equal to twice your level**,
which last for the duration.

***Two Roads*** ✦ (concentrate, fortune, prediction) — 1 ally within 30 feet.
Before the end of your next turn, the first skill check the target attempts is rolled **twice**; they
take the higher result.

***Shell of Hours*** ✦✦ (concentrate, healing, prediction) — 1 ally within 30 feet, 1 minute.
+2 status bonus to saves against disease and poison and to recovery checks. **Once** during the
duration, the first time the target would be reduced to 0 Hit Points, they are reduced to **1 Hit
Point** instead and the Augury ends.
*Flagged:* the death-cheat is the strongest thing on this list. It is once per casting, costs a focus
point, and does nothing about the next hit. If it plays too strong, delete the temporary reprieve and
raise the save bonus to +2 against all Fortitude saves.

***Crown of Fire*** ✦✦ (concentrate, prediction) — 1 ally within 30 feet, 1 minute.
+2 status bonus to Intimidation and Performance checks. The target can **Demoralize at 60 feet**, and
does not take the usual penalty for a target that does not share a language.

***Perfect Ledger*** ✦ (concentrate, prediction) — yourself or 1 ally within 30 feet.
The target's next **Recall Knowledge** this turn is a **free action** and gains a +2 circumstance
bonus. On a success, they learn one additional piece of information beyond what the GM would normally
give.

***Fixed Point*** ✦✦✦ (concentrate, prediction) — 30-foot emanation, up to 4 creatures you choose.
Name attack rolls, saving throws, or skill checks. Until the end of your next turn, the **first roll of
that type** made by each chosen creature is treated as a **10** on the die, before modifiers.
*Yes, this is strange. It is a prophecy class; strange is the point.* It is also the most interesting
button on the sheet, because it is the only one whose correct use requires knowing whether your party
is behind or ahead of the curve.

***Coiling Doubt*** ✦✦ (concentrate, misfortune, prediction) — 1 creature within 30 feet, Will save.
**Failure** The first time the target attempts an **attack roll or skill check** before the end of
your next turn, it rolls twice and takes the lower result. **Critical Failure** As failure, and it is
stupefied 1 for 1 round.
*Anchor:* *Ill Omen* (rank 1, two actions, same scope, same misfortune shape).

***Hunted by the Sky*** ✦✦ (concentrate, prediction) — 1 creature within 60 feet, 1 minute.
The target cannot be concealed or hidden from you. You and allies who can see you gain a +1 circumstance
bonus to Seek and to Perception checks to find it, and your **Snarl** against it is **−2** (−3 once you
have *Surer Thread*).
*Flagged:* v1 let Snarl against this target ignore the reaction cost, which doubled the class's core
engine for a minute for one focus point. Cut. The deeper penalty is the replacement.

***Alms of Fate*** ✦ (concentrate, fortune, prediction) — 1 ally within 30 feet.
On the target's next damaging effect before the end of your next turn, they **reroll all 1s** on the
damage dice and must keep the new results.

***Poured Knowing*** ✦✦ (concentrate, prediction) — 1 ally within 30 feet, 1 minute.
The target's next **counteract check** during the duration uses your Stargazer DC and proficiency rank
if they are higher than their own, and treats its counteract rank as **1 higher**.

***Deep Dream*** ✦✦ (concentrate, prediction) — 1 ally within 30 feet, 1 minute.
+1 status bonus to Will saves and to Perception checks to disbelieve illusions. **Once** during the
duration, if the target critically fails a Will save, they get a failure instead.

***Guiding Star*** ✦✦ (concentrate, prediction) — 1 ally within 60 feet, until the start of your next
turn.
+1 status bonus to attack rolls, Perception checks and skill checks. **Heightened (5th)** 2 allies.
**(9th)** 3 allies.
*This is single-target Courageous Anthem with a wider scope and a focus point attached, which is the
most an Augury may be. It is the closest the class comes to being a Bard, and it costs a resource the
Bard does not spend.*

***Borrowed Second*** ✦✦ (concentrate, prediction) — 1 willing ally within 30 feet.
The target immediately **Steps** or **Strides up to half their Speed** as a free action, and gains a
+1 circumstance bonus to AC until the start of your next turn.

### 5.3 Which sign grants which

The twelve signs each hand you one Augury for the day. There is deliberately no separate list of
twelve more spells: nineteen bespoke focus spells is not a class, it is a compendium, and every one of
them would need balancing. Two Auguries (*Guiding Star*, *Borrowed Second*) belong to no sign and are
only ever learned permanently.

| Sign | Augury of the Day | | Sign | Augury of the Day |
|---|---|---|---|---|
| ♈ Aries | *First Blood* | | ♎ Libra | *Fixed Point* |
| ♉ Taurus | *Iron Auspice* | | ♏ Scorpio | *Coiling Doubt* |
| ♊ Gemini | *Two Roads* | | ♐ Sagittarius | *Hunted by the Sky* |
| ♋ Cancer | *Shell of Hours* | | ♑ Capricorn | *Alms of Fate* |
| ♌ Leo | *Crown of Fire* | | ♒ Aquarius | *Poured Knowing* |
| ♍ Virgo | *Perfect Ledger* | | ♓ Pisces | *Deep Dream* |
| | | | ✦ Starless | *none — see Night Vigil* |

You know **9** Auguries permanently, chosen freely from all fourteen, and gain a tenth on most days
from the sky. Nothing stops you learning an Augury you will also sometimes be handed; on those days
you simply have a spare.

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
gets the one-round rewind at 11th (§4.10). This Path is what happens when you do it better than
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
2. **The odds.** v1 gave every day an aspect: 45 / 5 / 45 / 5 on a d100, with no neutral result. The
   code weights them **Quiet 50, Benefic 20, Retrograde 15, Malefic 15, Exalted 0**. Half of all days
   are quiet. This matters for the class: Forewarned is worth nothing on 70% of days (§4.2).
3. **Exalted is never rolled.** `signs.mjs` sets its weight to **0** on purpose, with the comment:
   *"a Zenith is scheduled, not rolled — 1 in 260 means it would otherwise never actually happen at
   the table, and that scene is the whole class."* v1's 4.6%-per-day Exalted is gone.
4. **The future is fixed.** The tracker pre-rolls **seven days** and stores them, so that the Saint's
   *Read the Constellation* has an answer that cannot be re-asked for a better one. v1's Constellation
   Mastery rerolled the day's aspect, which breaks that. Replaced by **Trade the Day** (§4.11).

A fifth, softer conflict: the module **announces the sky publicly in chat by default**
(`announceSky`, default `true`), and v1 insisted the sky must be secret. §8.4 resolves it.

### 8.2 The loop, as shipped

Each dawn the GM advances the day. The next pre-rolled entry becomes today, and a new day is rolled
onto the end of the queue.

**The sign** — thirteen skies, **equally likely**, 1 in 13 each:

| ♈ Aries | ♉ Taurus | ♊ Gemini | ♋ Cancer | ♌ Leo | ♍ Virgo | ♎ Libra |
|---|---|---|---|---|---|---|
| ♏ **Scorpio** | ♐ **Sagittarius** | ♑ **Capricorn** | ♒ **Aquarius** | ♓ **Pisces** | ✦ **Starless** | |

**The aspect** — rolled by weight:

| Aspect | Weight | Chance | Meaning |
|---|---|---|---|
| **Quiet** (`none`) | 50 | **50%** | The sky is unremarkable. Nothing happens. |
| **Benefic** | 20 | **20%** | The sky is kind. **+1** to the sign's domain. |
| **Retrograde** | 15 | **15%** | The sky drags. **−1** to the sign's domain. |
| **Malefic** | 15 | **15%** | The sky is hostile. **−2** to the sign's domain. |
| **Exalted** | 0 | **scheduled only** | A Zenith. **+2** to the domain. The GM pins it. |

All bonuses and penalties are **circumstance**, so they never stack with themselves and only one sign
is ever up. The worst a character can be is −2 in one narrow domain, which is inside PF2e's tolerance.

Resulting day-to-day feel: **a specific sign with a live aspect comes up about 3.8% of the time** —
roughly one day a month per sign. That is rare enough that "the Scorpio day" is a thing people
remember, and common enough that the system is not decoration.

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

## 9 — Balanced against PF2e's support classes

The grand total being 2100 proves nothing. Every class in the sheet totals 2100, including the ones
nobody plays. This section is the part the spreadsheet cannot do.

### 9.1 The subtotal comparison

Read out of `CLASSDATA`. These are the real numbers, not estimates.

| Subtotal | **Stargazer** | Bard | Cloistered Cleric | Oracle | Investigator | Thaumaturge | Kineticist |
|---|---|---|---|---|---|---|---|
| DC | **360** | 360 | 360 | 360 | 170 | 170 | 360 |
| Perception | **170** | 170 | 60 | 60 | 360 | 170 | 60 |
| Saves | **290** | 480 | 290 | 480 | 590 | 590 | 590 |
| Skills | **30** | 30 | 20 | 25 | 120 | 70 | 20 |
| Attack | **70** | 200 | 200 | 140 | 410 | 410 | 140 |
| Defense | **70** | 70 | 60 | 70 | 180 | 190 | 180 |
| Spell slots | **0** | 460 | 460 | 460 | 0 | 0 | 0 |
| Learned spells | **0** | 280 | 540 | 270 | 0 | 0 | 0 |
| Focus spells | **100** | 120 | 0 | 20 | 0 | 0 | 0 |
| Class abilities | **700** | −160 | 20 | 40 | 160 | 70 | 440 |
| Subclass abilities | **220** | 0 | 0 | 90 | 20 | 340 | 220 |
| HP + 1st feat | **90** | 90 | 90 | 80 | 90 | 90 | 90 |

**Where the Stargazer is the outlier:**

- **Attack 70 is half the lowest figure in the sheet.** No published class pays less than **140**
  (Wizard, Druid, Oracle, Psychic, Summoner and Kineticist are all tied there); Bard and Cleric pay
  200. The Stargazer buys simple weapons to Expert at 11 and stops — no critical specialization, no weapon specialization, ever. It is the worst weapon user in
  Pathfinder and that is deliberate.
- **Saves 290** is exactly the figure paid by the Cloistered Cleric, Druid, Wizard, Witch and
  Sorcerer — the straight-caster save line. It is 190 below the Bard and Oracle, which is exactly
  the Legendary Will that paid for the casting line (§0 item 9).
- **Class + subclass abilities 920** is the second-highest in the game after the Summoner's 1040.
  That is what a class with no spell slots looks like; §2.4 has the full distribution.

### 9.2 What +1 is actually worth

A concrete case, because "+1 doesn't sound like much" and it is not true.

A martial with a +12 attack bonus swinging at AC 20 hits on an 8 (65%) and crits on an 18 (15%).
In units of average damage **D**:

| | Hit | Crit | Expected damage |
|---|---|---|---|
| Baseline | 50% | 15% | **0.80 D** |
| **Guide (+1)** | 50% | 20% | **0.90 D** — **+12.5%** |
| **Surer Thread (+2)** | 50% | 25% | **1.00 D** — **+25%** |

The bonus is worth double what it looks like, because in PF2e a +1 moves the *critical* threshold as
well as the hit threshold. **Snarl** is the mirror: −1 on an incoming attack is about **−12.5%**
expected damage on that attack, −25% at 9th level, which is squarely in Champion-reaction territory.

That is for **one roll**. Hold that number.

### 9.3 Support output per round

| Class | Action cost | What the party gets, every round, at will |
|---|---|---|
| **Bard** — Courageous Anthem | 1 action | +1 status to attack rolls **and damage rolls** and saves vs fear, **every ally in 60 ft** |
| **Cleric** — Bless | 2 actions, then 1 to sustain | +1 status to attack rolls in a growing emanation; plus the healing font, which is the real feature |
| **Commander** — a tactic | 1 action | a squadmate gains a **reaction** to Strike, Stride, or manoeuvre; plus a passive +1 status Will vs fear banner |
| **Champion** — the reaction | 1 reaction | damage reduction and a retaliation on **one** incoming attack |
| **Stargazer** — Fortune's Thread | **0 actions (reaction)** | **±1 / ±2 circumstance on one chosen d20** |
| **Stargazer** — + Chart the Course | 1 action | a **second** ±1 / ±2, on a roll you named in advance |

Put §9.2's number through that table. A four-person party makes six or seven d20 rolls a round that a
Bard's Anthem touches, plus every damage roll. The Stargazer touches **one**, or two if it spends an
action.

**So Courageous Anthem is roughly six to eight times the raw throughput of Fortune's Thread, and the
Bard also has 740 points of spell slots the Stargazer does not have.** That is the honest headline,
and it is the right answer: this class was never going to out-support the Bard, and if the ledger had
said it did, the ledger would have been wrong.

### 9.4 What the Stargazer has that they don't

Four things, and they are the case for the class:

1. **It costs no action.** Every other line in that table spends the supporter's turn. Fortune's
   Thread spends a reaction the Stargazer had no other use for. On a round where the Bard sings, the
   Bard has two actions left; the Stargazer has three, and a Thread.
2. **It is aimed after the fact.** Courageous Anthem is committed at the start of the round and
   spreads itself across whatever happens. Fortune's Thread is spent *after you know what the roll is
   for*. A +1 on the boss's recovery check, or on the Rogue's one chance to Disable the trap, or on
   the save that decides whether the party's Fighter spends the fight confused, is worth far more than
   a +1 averaged across six attacks. This is the class's real edge and it is not visible in a
   throughput table.
3. **It stacks with all of them.** Circumstance bonuses do not collide with the status bonuses that
   Bard, Cleric and Commander hand out. A party with a Bard **and** a Stargazer is genuinely additive.
   *(One exception worth knowing: Fortune's Thread does* not *stack with **Aid**, because Aid is also
   a circumstance bonus. Take the higher. If somebody in your party Aids regularly, Guide is dead
   weight on that roll — Snarl an enemy instead.)*
4. **It can point at the enemy.** Nothing in the printed support list debuffs at will with no resource
   and no save. *Bane* needs two actions, a sustain, and a Will save to land −1 on attack rolls only.
   Snarl is −1 with no save at 1st level. This is the single strongest thing on the sheet and it is
   why Snarl cannot touch saving throws (§4.3).

And then there is the whole out-of-combat half of the class, which does not appear in any of these
tables: a daily forecast, a 1st-level information monopoly, Legendary Astronomy Lore by 15th, and two
rewinds. §9.6.

### 9.5 The verdict, stated plainly

**The Stargazer is a secondary support and an information class. It cannot be a party's only
support.** It has:

- **no healing** of any kind (the closest thing is *Shell of Hours*, once per casting, and it heals
  nobody);
- **no spell slots**, so no *heroism*, no *haste*, no *slow*, no battlefield control, no revivification;
- **no party-wide buff** at any level except the Weaver's 17th-level *Tapestry*, once per 10 minutes;
- **no damage** beyond a cantrip, and the worst attack progression in the game.

A party of Fighter / Rogue / Wizard / Stargazer will be fine. A party of Fighter / Rogue / Fighter /
Stargazer will have no way to heal between fights and will find that out at about 5th level. Say this
during session zero; it is a class property, not a trap.

**Against the specific benchmark classes:**

| | Verdict |
|---|---|
| vs **Bard** | Strictly less support throughput, strictly less versatility, no slots. Wins on information, on action economy, and on being able to debuff. **Not a replacement. An excellent second.** |
| vs **Cleric** | Not comparable. The Cleric's font is the most valuable single class feature in the game for party durability and the Stargazer has no answer to it. |
| vs **Commander** | Closest in feel — both hand out small numerical edges from range at low action cost. The Commander gives **actions** (a reaction to Strike), which is worth more than ±1. The Stargazer gives **certainty**, which the Commander has none of. Roughly even in combat; the Stargazer wins the other 23 hours. |
| vs **Investigator** | The direct rival for the "information, low combat" niche, and the Stargazer wins it decisively out of combat — Legendary Astronomy Lore, daily forecast, *Perfect Recall*. The Investigator wins in combat by a mile: Devise a Stratagem, Master weapons, Greater Weapon Specialization, 410 points of attack to the Stargazer's 70. |
| vs **Thaumaturge / Kineticist** | The structural relatives — no slots, everything in bespoke features. Both are far more durable (590 saves to the Stargazer's 290) and both can actually fight. The Stargazer trades all of that for reach and foresight. |

### 9.6 The part no table measures

Balance conversations about this class will keep landing on ±1 and missing the actual power, which is
**a 1st-level character who knows, every single morning, and for free, what the next three days hold.**

In a published adventure path that is mostly colour. In a campaign with a GM who uses it, it is the
strongest thing in this document — stronger than the rewind, because it is every day and it never
runs out. The class is priced as if that were worth 50 points. It might be worth 50 points or it might
be worth the whole budget, entirely depending on whether your GM answers questions.

**The BCS cannot price this and neither can I.** It is the one number in this guide that only play can
settle, and it is why §12 exists.

### 9.7 Where it might still be too strong

Watch these four, in order of likelihood:

1. **Snarl against a crit-fishing enemy.** A −2 circumstance penalty applied every round to the one
   attack that matters, for free, forever, is a lot of mitigation across a twenty-level campaign.
   The lever if it misbehaves: cap Snarl at −1 and leave Guide at ±2.
2. **The Weaver's *Tapestry* (17th).** Every ally in 60 feet, one reaction, once per 10 minutes. That
   is a full Courageous Anthem in a reaction. It is priced at 70 and probably wants to be 110. If you
   are running a Weaver past 17th, watch it first.
3. **Fortune's Thread plus Twin Fates plus the Herald's *Sentence Passed*.** The Herald can strip a
   creature's fortune effects and its natural 20s for a minute while Snarling it every round. Against
   a single boss, that stacks into real lockdown. It is a 13th-level feature doing 13th-level things,
   but check it.
4. ***Unmake the Moment*** at 11th, if the table lets the trigger drift. The moment it becomes "when
   an ally dies" rather than "your turn begins," it stops being a feature and becomes a veto. §4.10.

### 9.8 Where it is weak, on purpose

- **8 HP, light armour, and Reflex Trained until 13th.** The Stargazer dies to area damage. This is
  the Caster-Specialist chassis working as designed, but the player should know it before level 4.
  The cheapest in-budget fix if it is brutal at your table: swap Reflex Expert to 9th and Fortitude
  Expert to 13th. It costs nothing — it is the same 60 points, re-slotted.
- **It cannot fight.** 70 points of attack. At 11th level a Stargazer's Strike is Expert with no
  weapon specialization: roughly four points of attack bonus and four points of damage behind the
  party's Rogue. Cantrips are the answer, and they are the *only* answer.
- **It depends entirely on the GM announcing rolls before making them.** See §12.2. A GM who rolls
  fast behind a screen turns this class off.

---

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

The one-round rewind. Full text in §4.10. Three notes:

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

### 11.4 The Sky, the part that does not exist yet

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
phase, the way the Soulbound's lineages were.

### 11.5 Auguries

Spell items with `traits: ["prediction", "focus", "occult"]`, `category: "focus"`, and standard
focus-spell auto-heightening. The Augury of the Day is a compendium lookup keyed off
`SkyTracker.state.sign` — a one-line mapping from §5.3 — granted and revoked on the
`isaacs-hb-pf2e.skyChanged` hook, which `tracker.mjs` already fires.

### 11.6 What not to automate

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
4. **Half of all days are Quiet and the player feels the class is off.** This is correct (§8.2) and it
   is worth saying out loud at session one, because a Stargazer whose first four sessions are Quiet
   will conclude the sky does not exist. Consider seeding a live aspect early.
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
   is in §2.6 item 1 and it is clean.
2. **Losing Legendary Will.** It is the single most-noticed nerf from v1 and it lands at 17th, which
   most campaigns never see. It is also the most BCS-defensible thing in the document (line 69).
3. **Snarl not applying to saving throws.** §4.3 argues this at length. It is the change most likely
   to be unpopular with the player and most likely to be correct.
4. **Whether Night Vigil is worth 50 or 500.** §9.6. Unanswerable on paper.
5. **The Sky's domain modifiers for every creature in the world** are 48 unbuilt effect items and a
   tracker change (§11.4). Until they exist, §8.3 is a paper subsystem and Forewarned has nothing to
   forewarn against. **This is the gap between this document and a playable class**, and it should be
   the first phase of implementation, not the last.
6. **Trade the Day versus rerolling the aspect.** v1 rerolled; the shipped queue says the future is
   fixed. Trade the Day respects the code. If you would rather the diviner be able to genuinely
   change the weather, that is a different class thesis and it needs the queue design revisited too.

---

## Summary card

> **Stargazer** — Key ability WIS · 8 HP · Stargazer DC (spell DC, Legendary at 19) · 5 occult
> cantrips, **no spell slots** · Auguries (focus spells) · Perception Expert → Master@11 · Will
> Expert → Master@11 · simple weapons and light armour, both Expert, no weapon specialization ·
> 6 initial skills · Astronomy Lore as Core Skill to Legendary
>
> **Identity:** an at-will ±1/±2 on any d20 within 60 feet that costs no action (Fortune's Thread) ·
> a prophesied d20 you can force onto anyone (Portent) · the only creature alive who knows which sign
> is up, what it means, and what the next three days hold (Night Vigil) · a one-round rewind at 11th ·
> and, eventually, the right to declare that the ending you saw does not count.
>
> **Role:** secondary support and information. Not a Bard. Not a healer. Bring one of those too.
>
> **BCS total: 2100 / 2100** — chassis 1080, features 1020.

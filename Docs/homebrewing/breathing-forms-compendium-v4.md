# Breathing Forms Compendium v4 — Re-costed, Re-scaled, Complete
### Replaces v3. Nine Breathing Styles, each with a **granted skill + stance + style rider + 4 forms + 1 Final/Forbidden Form**.

> **This revision implements `Docs/breath-slayer-balance-analysis.md` §7.1 and §7.2, plus the
> non-damage levers requested alongside it.** Every number below is calibrated against live PF2e
> system data (`pf2e-14-dev/packs/pf2e`), not against v3's printed values. See
> `breath-slayer-v4-changelog.md` for the recommendation-by-recommendation audit.

---

## 0. What changed from v3 (read this first)

### 0.1 Every Form costs **1 Breath Point**

There is no 2-point or 3-point focus spell anywhere in PF2e, and `Refocus` restores exactly 1 point
per 10 minutes. The 2-FP Fourth Forms and 3-FP Final Forms turned the class's signature abilities
into once-per-adventuring-day effects wearing a per-encounter costume.

**All Forms now cost 1 Breath Point.** The throttles are:

| Throttle | Applies to |
|---|---|
| The 3-point pool itself | Every Form — 3 Forms per encounter, maximum |
| **Frequency: once per 10 minutes** | Final/Forbidden Forms only |
| **Self-cost** (a real, lasting condition) | Final/Forbidden Forms only |
| **Requirement** clauses | Individual Forms that punch above their tier |

Fourth Forms carry **no** frequency limit. Three Forms per encounter is already below what an at-will
AoE class puts out (kineticist `Blazing Wave`: 42.0 *every round*, from **level 4**); adding a
per-encounter cap on top of the pool would charge twice for the same thing.

### 0.2 Automatic heightening is now actually applied

> "Focus spells are automatically heightened to half your level rounded up, much like cantrips."

v3 wrote the printed dice as though they were the *level-20* value. They were the **entry-rank**
value, and the heightening lines then had to carry them all the way to rank 10 — so where the lines
were `H(+4)` or missing, the form flatlined. Every Form below states an explicit **base rank** and a
heightening line chosen so its **rank-10 value** is the design target.

**Base rank by tier:** First Form = 1 · Second Form = 2 · Third Form = 4 · Fourth Form = 6 ·
Final Form = 10. (A Form acquired above its base rank is simply already heightened.)

### 0.3 The design curve

All values at rank 10 / level 20, all costing 1 Breath Point.

| Form shape | Actions | Rank-10 target | Standard ladder | Anchor |
|---|---|---|---|---|
| Single Strike + rider | 1 | **+5d6** (17.5) + status bonus | `1d6` @ r1, **H(+2) +1d6** | `Inner Upheaval` +3d6 — ours is higher because it never doubles on Flurry |
| Strike + movement/debuff | 2 | **+7d6** (24.5) | `3d6` @ r2, **H(+2) +1d6** | `Pulverizing Wake`'s Strike component (+3d8) |
| Two Strikes, one target | 2 | **+5d6 each** (35.0) | `1d6` @ r2, **H(+2) +1d6** | two full Strikes already carry most of the value |
| 15-ft cone, **1 action** | 1 | **11d6** (38.5) | `2d6` @ r1, **H(+1) +1d6** | `Qi Blast` at 1 action = 9d6 |
| 15-ft cone / 10-ft emanation | 2 | **13d6** (45.5) | `5d6` @ r2 *or* `9d6` @ r6, **H(+1) +1d6** | `Pulverizing Wake` cone = 11d8 (49.5) |
| 30-ft line / 15-ft burst | 2 | **11d6** (38.5) | `5d6` @ r4, **H(+1) +1d6** | area-for-damage trade |
| Reaction (defensive) | R | resistance formula + **5d6** (17.5) | `2d6` @ r4, **H(+2) +1d6** | `Thermal Nimbus` = resistance equal to level |
| **Fourth Form** (feat 12) | 2 | **13d6** area (45.5) **plus a hard condition** | `9d6` @ r6, **H(+1) +1d6** | `Pulverizing Wake` — a *ranger level-9* focus spell |
| **Final Form** (feat 20) | 1–3 | **13d6+ area**, or **4 Strikes**, or a **1-minute omnibuff** | flat @ r10 | `All Shall End in Flames` (13d6, free, at-will) · `Impossible Flurry` (6 Strikes, free) · `Sever Four Dragonfly Wings` |

**Monotonicity now holds in all nine styles at rank 10:** First ≤ Second ≤ Third ≤ Fourth < Final.
The audit table is §11. As written, v3 satisfied that inequality in *zero* of nine styles.

### 0.4 Balance is not only damage

Where v3 reached for a bigger die, v4 reaches for one of these instead. Each has a live system anchor:

| Lever | Anchor in the packs |
|---|---|
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

### 0.5 Two Forms are now chassis features, not feats

First Form is granted at **level 1** and Second Form at **level 5** as chassis features, with the
Breath Point pool growing on the chassis at **1 / 5 / 9**. See `breath-slayer-class-feats-v4.md` §1.
The Form ladder below is unchanged in content — only who pays for the first two rungs has changed.
Form entries are tagged *chassis 1*, *chassis 5*, *feat 8*, *feat 12*, *feat 20*.

### 0.6 Unchanged rules

Uncommon + slayer traits · Class DC as spell DC · stance + nichirin blade required · incapacitation
on hard control · subclass riders budgeted at 30 pts (Exemplary Finisher anchor), so the **BCS 2100
ledger is untouched**.

---

# THE ORIGINAL FIVE STYLES

*(v3 referred these blocks out to the class guide and never reproduced them. They are written out in
full here, so the compendium is self-contained.)*

## WATER BREATHING

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

**FINAL FORM — Eleventh Form: Dead Calm** — *feat 20* · 1 BP · **1 action** · **Frequency once per 10 minutes**
*(Giyu Tomioka's personal creation.)*
**Duration:** until the start of your next turn.

You enter perfect stillness. You gain a **+2 status bonus to AC and to Reflex saves**, and **every
melee Strike that misses you** (to a maximum of four) triggers an immediate riposte nichirin Strike
against the attacker. **These ripostes are made at a flat −2 penalty; they neither use nor increase
your multiple attack penalty.** Each riposte that hits also makes its target **off-guard to you until
the end of your next turn**.

You can take no actions other than these ripostes while the form lasts; if you take any other action,
Dead Calm ends immediately.

**Self-cost:** when Dead Calm ends, you are **off-guard until the end of your next turn** — the
stillness has to break.
> *Anchor: `Impossible Flurry` (ranger 18) is six Strikes at full MAP progression, free and at-will.
> Four MAP-free Strikes, conditional on enemies missing you, once per 10 minutes, sits under it.*

---

## FLAME BREATHING

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

## THUNDER BREATHING

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
> on the 2-action cone curve. See the changelog for why this deviates from analysis §7.2's
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

## WIND BREATHING

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

## STONE BREATHING

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

# THE FOUR EXPANDED STYLES

*(From the 5e module. Each is a full subclass: granted skill + stance + 30-pt style rider + 4 forms +
Final Form. Sidegrades, so the BCS ledger is unchanged.)*

## SOUND BREATHING ⚠

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

## FLOWER BREATHING

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

## MIST BREATHING

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

## MOON BREATHING †

*Kokushibo's style. GMs: it suits villains, Upper-Moon-hunter campaigns, or a player with a
dark-lineage arc — it is deliberately the most aggressive style, and it pays for that in self-costs.*

**Granted skill:** Intimidation. **Damage type:** slashing (chaotic crescent blades).

**Stance — Crescent Chaos** *(1 action to enter)*
Once per round, when you roll damage for a Form, you may **reroll one damage die** and take the
higher result.

**Style rider — Erratic Crescents**
On a **critical hit** with a Form, erratic crescent blades splash **one enemy adjacent to your
target** for slashing damage equal to your **number of weapon damage dice**.
*(Anchor: 30 pts, crit-gated splash.)*

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

# 11. Rank-10 audit — the monotonicity check

All values at **level 20 / rank 10**, all costing **1 Breath Point**. "Strike" means a full nichirin
Strike lands on top of the listed bonus.

| Style | First | Second | Third | Fourth | Final (1/10 min) | Monotonic? |
|---|---|---|---|---|---|---|
| **Water** | Strike +5d6 / +5d8 (17.5–22.5) | Stride + Strike +7d6 (24.5), off-guard | reaction: −22 damage, riposte +5d6 | 13d6 (45.5) emanation, pull + Step-lock | ≤4 MAP-free Strikes, +2 AC/Ref | ✅ |
| **Flame** | Strike +5d6 + 5d4 persist (30.0)\* | Stride + Strike +7d6 (24.5), off-guard | reaction: res 25, 5d6 all-round | 2 Strikes +4d6 ea. + locked frightened 2 | 13d6 line + Strike + unquenchable fire | ✅ |
| **Thunder** | charge + Strike +6d6 (21.0) | 7d12 cone (45.5) | Strike +6d6 (21.0), Speed −10, stun on crit | 3 lines × 7d6 (24.5–49.0) + stun | 4d12 path + Strike +6d12 + stun 2 | ✅ |
| **Wind** | 11d6 cone (38.5), **1 action** | Strike +7d6 (24.5) + immobilize on crit | reaction: res 15, 5d6 all-round | 13d6 (45.5) emanation, anti-fly, prone | 13d6 path + Strike +4d6 + prone-lock | ✅ |
| **Stone** | Strike +5d6 + free Shove | Strike +7d6, **1 action** (gated), party off-guard | res 10 all physical, 1 minute | 13d6 (45.5) **Fort** cone + immobilize | 4 Strikes +2d8 ea. + res 15 fortress | ✅ |
| **Sound** | Strike +5d6 + reaction denial | 10d8 (45.0) **Fort** emanation | 11d6 (38.5) burst @30 ft + blind | 2 Strikes +4d6 ea. + stupefied 2 + slow | 4 Strikes +4d6 ea. + stun + 4d6 chord | ✅ |
| **Flower** | reaction: +2 AC, off-guard, +1 atk | Strike +7d6 (24.5), conditional off-guard | 2 Strikes +5d6 ea. + sticky bleed | 2 Strikes +4d6 ea., party off-guard ×2 | +2 AC/Ref/atk 1 min, free off-guard | ✅ |
| **Mist** | Strike +5d6 + dazzled | 2 Strikes +5d6 ea., ignores circ AC | 11d6 (38.5) + 4d6 zone @30 ft | 2 Strikes +4d6 ea. + disengage + hidden | 20-ft mobile cloud, 1 min, −2 enemy atk | ✅ |
| **Moon** | Strike +5d6 + movement tax | 13d6 (45.5) cone + bleed | 11d6 (38.5) line + grabbed | 13d6 (45.5) cone + prone + 4d6 zone | 16d6 (56.0) 40-ft cone + 6d6 lingering | ✅ |

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

## 12. Playtest watch list

1. **Equinoctial Vermilion Eye** — a 1-minute +2-status omnibuff is still the strongest single effect
   in the class. The blindness has to bite; if your table has easy blindness removal, add "this
   blindness can't be removed by effects of a rank lower than 8."
2. **Dead Calm's MAP-free ripostes** — capped at four, and only against misses. At tables that run
   many-weak-enemy encounters, consider capping at three.
3. **Wind's Dust Whirlwind Cutter** at 11d6 for one action is the deliberate outlier. If it dominates
   play, the fix is `1d6` base with `H(+1) +1d6` (10d6 / 35.0), not a cone-size cut.
4. **Moonbow's unstoppable bleed** and **Rengoku's unquenchable fire** are intentionally hard to
   remove. Watch them against solo bosses, where 4d6 persistent for the rest of the fight is worth
   far more than its printed average.
5. **Volcanic Rock's immobilize** on a basic **Fortitude** save is the best control in the book, on
   the defence fewest monsters dump. If it over-performs, restrict the immobilize to critical
   failures by creatures of your level or lower.
6. **Flame's stance persistent damage** interacting with `Persistent Ember` (feat 12) — check at your
   table that the die-step increase and the stance's flat scaling aren't being applied twice.

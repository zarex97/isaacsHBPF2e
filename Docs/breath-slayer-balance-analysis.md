# Breath Slayer — Balance Analysis vs. PF2e Remaster

*Analysis of **Breathing Forms Compendium v3** and **Breath Slayer Class Feats v3**, anchored against
the live PF2e system data in `pf2e_fork/packs/pf2e` (Player Core 1/2, GM Core, Rage of Elements,
War of Immortals, Battlecry) and against the two reference build documents
(`PF2E_Level20_AoE_Beast_Builds` and `Five_HighDPR_Pathfinder_2e_Remaster_Builds`).*

Every number below is read out of the compendium JSON in the fork, not from memory.

---

## 0. Verdict

**Yes — underpowered, but the diagnosis matters more than the verdict.** The class is not
uniformly weak; it is *incoherently* costed. Three structural faults, in order of severity:

1. **The 2-FP and 3-FP Form costs break a hard rule of PF2e.** No focus spell in the game costs
   more than 1 Focus Point, and `Refocus` restores exactly 1 point per 10 minutes.
2. **Automatic heightening was never applied when the forms were written**, so the Fourth Forms
   (feat 12) are numerically *worse* than the Second Forms (feat 4) in **eight of nine styles**.
3. **The anchors cited in the docs are mostly the wrong feats**, and in every case the anchor is
   cited at a level or cost that does not match the real item.

Fix those three and the class lands roughly where a martial-with-focus-pool should be. Nothing
here requires new mechanics — only re-costing and re-scaling.

---

## 1. The two rules the design violates

### 1.1 Focus spells cost exactly 1 Focus Point

There is no 2-point or 3-point focus spell anywhere in PF2e. Confirmed in system text:

> "…costs 1 Focus Point to cast a focus spell, and you start with a focus pool of 1 Focus Point"
> — `packs/pf2e/paizo-pregens/**`

And recovery, from `actions/exploration/refocus.json`:

> "You spend 10 minutes performing deeds to restore your magical connection. **This restores 1
> Focus Point** to your focus pool."

Consequences for the Breath Slayer as written:

| Cost | What it actually means at the table |
|---|---|
| Fourth Form @ 2 FP | Two-thirds of the entire pool. You get **one** per encounter and nothing else, or three First Forms. |
| Final Form @ 3 FP | The whole pool, **and 30 minutes of downtime to refill it**. In a dungeon day with three fights back to back, the level-20 capstone fires **once, in one of the three fights**. |

That last line is the real problem. The Final Form isn't "the dramatic climax of a fight by
design" — it's a once-per-adventuring-day ability wearing a per-encounter costume. Compare the
things it's supposedly anchored to: `Impossible Flurry` (ranger 18) and `Whirlwind Strike` (14)
are **at-will, every turn, forever**; `Touch of Death` (monk 16 feat) costs **1 FP**.

**Fix:** every Form costs 1 FP. Use *frequency* ("once per encounter"), *action count*, and
*requirements* as the throttle instead. This is exactly how Paizo gates strong focus effects.

### 1.2 Focus spells auto-heighten to half your level, rounded up

> "Focus spells are automatically heightened to half your level rounded up, much like cantrips"

The v3 docs state this convention ("automatic heightening by spell rank") but the forms were
written as if the printed dice were the *level-20* value. They're not — they're the value at the
form's **entry rank**, and the heightening lines then have to carry them all the way to rank 10.
Where those lines are slow (`H(+4)`) or missing entirely, the form flatlines.

---

## 2. The heightening audit — every Form at level 20 (rank 10)

Base rank = `ceil(feat level / 2)`, so Feat 1 → rank 1, Feat 4 → rank 2, Feat 8 → rank 4,
Feat 12 → rank 6, Feat 20 → rank 10. Averages in parentheses.

### 2.1 The core failure: the ladder runs backwards

| Style | Feat 4 form (1 FP) | Feat 12 form (**2 FP**) | Verdict |
|---|---|---|---|
| Water | Water Wheel — Stride+Strike, +2d6 (7.0) | Whirlpool — 10d6 (35.0), **5-ft emanation** | area is 8 squares; 2× cost |
| Flame | Rising Scorching Sun — Strike +3d6 (10.5) | Flame Tiger — 2 Strikes, +3d6 (10.5) **each** | ~1.5× output for 2× cost |
| **Thunder** | Rice Spirit — 15-ft cone **10d12 (65.0)** | Rumble & Flash — 3 lines × 6d6 (21.0) | **Feat 4 is 3× the Feat 12 form** |
| **Wind** | Claws-Purifying — Strike +6d6 (21.0) | Rising Dust Storm — 8d6 (28.0), 10-ft eman. | First Form (11d6/38.5, **1 action, 1 FP**) beats both |
| Stone | Upper Smash — +2d6, **no heightening line at all** | Volcanic Rock — 9d6 (31.5) | Upper Smash is a 7.0-damage focus spell at level 20 |
| **Sound** | Bang — 10-ft eman. **10d8 (45.0)** | Constant Resounding — 2 Strikes, +3d6 (10.5) ea. | **Feat 4 is 2× the Feat 12 form at half cost** |
| **Flower** | Crimson Hanagoromo — Strike +2d6 (7.0) | Whirling Peach — Stride+Strike +4d6 (14.0) | Feat 8 Peonies (2 Strikes ×3d6, **1 FP**) beats Feat 12 Flame Tiger outright |
| **Mist** | Eight-Layered — 2 Strikes, +4d6 (14.0) ea. | Lunar Dispersing — 2 Strikes, **+0 damage** | see below |
| **Moon** | Pearl Flowers — 15-ft cone **10d6 (35.0)** | Moon Spirit Calamity — 15-ft cone 9d6 (31.5) | Feat 12 does **less damage in the same area for 2× cost** |

**Mist's Lunar Dispersing Mist is the single worst ability in the document.** At feat 12 it costs
**2 Focus Points and 2 actions** to make two Strikes with **zero bonus damage and no heightening
entry**, plus two Steps and concealment. Two Strikes for two actions is what every character in
the game does for free. You are paying two-thirds of your daily-ish resource pool for "Step twice."

**Stone's Stone Skin** is the other flatline: `resistance 2, H(+4) +2` → **resistance 4 to physical
at level 20**, for a focus point and an action. `Thermal Nimbus` (kineticist **level 4** feat) grants
**resistance equal to your level** — 20 — *at will, permanently, to you and your allies*, plus
automatic damage to anything that starts its turn near you.

### 2.2 The Final Forms don't clear their own mid-tier forms

| Final Form | Cost | Output @ 20 | Beaten by |
|---|---|---|---|
| Moonbow, Half Moon | 3 FP + drained 1 | 30-ft cone **9d6 (31.5)** + 2d6 persist | its own **Feat 8** Loathsome Moon Chains (9d6, **1 FP**) |
| Rengoku | 3 FP + **20 self-damage** + slowed 1 | line 8d6 (28.0) + 1 Strike | Wind's **Feat 1** First Form (11d6/38.5, 1 action) |
| Idaten Typhoon | 3 FP + dazzled | path 8d6 (28.0) + 1 Strike | same |
| String Performance | 3 FP + deafened 1 min + enfeebled 1 | 3 Strikes, +2d6 (7.0) each | Sound's **Feat 4** Bang (45.0, 1 FP) |
| Honoikazuchi no Kami | 3 FP + slowed 1 for 1 min + style lockout | Strike +3d12 (19.5), path 2d12 (13.0) | Thunder's **Feat 4** Rice Spirit (65.0, 1 FP) |
| Arcs of Justice | 3 FP + Speed 0 | 3 Strikes, no bonus damage | — |
| Obscuring Clouds | 3 FP + fatigued | concealment, no damage | — |
| Dead Calm | 3 FP + off-guard after | +2 AC, ≤4 ripostes | — |
| Equinoctial Vermilion Eye | 3 FP + blindness | +2 status AC/Ref/attack, 1 min | **the only Final Form that is actually a capstone** |

A level-20 capstone that is out-damaged by the same character's level-4 feat, at three times the
cost, plus a condition, is not "budgeted at the Quivering Palm tier." It is a trap option.

### 2.3 The one overtuned form

**Rice Spirit** (Thunder, Feat 4) — 15-ft cone, `2d12` base, `H(+1) +1d12` → **10d12 (65.0)** at
level 20 for 1 FP. That is more damage than `Tempest Surge` (druid focus, 10d12 at rank 10) in a
*cone* rather than single-target, and more than every Final Form in the book combined with its own
self-cost. It is the only form using d12s on a per-rank ladder. Either it is the correct benchmark
and everything else is wrong, or it's a typo for d6. Given §3 below, I think **it's close to
correct and the rest of the book is under.**

---

## 3. Where the real bar sits (all values at rank 10 / level 20, all costing **1 FP**)

Read out of `packs/pf2e/spells/focus/`:

| Focus spell | Class / level gained | Actions | Rank-10 output |
|---|---|---|---|
| **Dragon Breath** | Sorcerer, ~L1 bloodline | 2 | **19d6 (66.5)**, 30-ft cone |
| **Powerful Inhalation** | Druid Storm, L1 | 2 | **19d6 (66.5)**, 10-ft emanation + control |
| **Pulverizing Cascade** | Druid Wave, L1 | 2 | **19d6 (66.5)**, 10-ft burst @120 ft |
| **Pulverizing Wake** | Ranger, L9 | 2 | Strike **+3d8** *and* a 15-ft cone of **11d8 (49.5)** |
| **Tempest Surge** | Druid Storm, L1 | 2 | **10d12 (65.0)** single target + clumsy 2 |
| **Qi Blast** | Monk, L1 (Qi Spells) | 1/2/3 | **9d6 (31.5)** in a 15-ft cone **for one action** |
| **Inner Upheaval** | Monk, L1 | 1 | +1 status, **+3d6** — *and it applies to Flurry of Blows (two Strikes), and you choose force / spirit / vitality / void* |
| **Touch of Death** | Monk, L16 feat | 2 | Strike, then **200 damage or instant death** |

And the at-will, **zero-resource** martial techniques the class is competing with:

| Ability | Source | Cost | Output |
|---|---|---|---|
| **Vicious Swing** | Fighter **level 1** | free, at-will | Strike, **+3 weapon dice at L18** (+3d12 on a greatpick) |
| **Blazing Wave** | Kineticist **level 4** | free, at-will | 30-ft cone, `floor((L−4)/2)+4`d6 → **12d6 (42.0)** every round |
| **Thermal Nimbus** | Kineticist **level 4** | free, stance | resistance **20**, auto-damage aura |
| **Whirlwind Strike** | Fighter/Barb **14** | free, at-will | Strike **every** enemy in reach |
| **Sever Four Dragonfly Wings** | Exemplar ikon | free, at-will | up to **4 Strikes**, 3 actions |
| **Burn out of Time** | Exemplar **18** | free, at-will | Strike **+3d8 +3d8**, plus a kill rider |
| **Impossible Flurry** | Ranger **18** | free, at-will | **6 Strikes** |
| **All Shall End in Flames** | Kineticist **18** | free, at-will | **13d6 (45.5)**, 30-ft burst *or* emanation |
| **Hell of 1,000,000 Needles** | Kineticist **18** | free, at-will | **17d6 (59.5)** in a 30-ft cube, immobilize |

**The single cleanest indictment:** a sorcerer's `Dragon Breath` — a *first-level* bloodline focus
spell, 1 Focus Point, 2 actions — deals **19d6 (66.5)** in a 30-foot cone at level 20. That is more
than **every Breathing Form in the compendium except Rice Spirit**, including all nine Final Forms,
at one-third the cost and with no self-inflicted condition.

---

## 4. Against the two reference build documents

### 4.1 vs. the AoE "Beast" builds

| Metric | Level-20 Breath Slayer | Beast builds |
|---|---|---|
| Best single AoE | Rice Spirit, 65.0 in a 15-ft cone | Kineticist `Hell of 1,000,000 Needles` 59.5 in a 30-ft **cube**, or `All Shall End in Flames` 45.5 in a 30-ft burst |
| Uses per encounter | **3** total across all forms | **unlimited** |
| Uses per adventuring day | ~3 + 1 per 10 min of downtime | unlimited |
| Sustained AoE floor | 0 once the pool is dry | Kineticist: `Blazing Wave` 42.0 every round, plus `Thermal Nimbus` ticking |
| Nova ceiling | Rice Spirit ×3 = 195 spread over a fight | Sorcerer `Falling Stars` (rank 9): **7d10 + 16d6 across four 40-ft bursts** |

A Fire Kineticist matches the Breath Slayer's **entire per-encounter output** in roughly two rounds
and then keeps going for the rest of the adventuring day. That's the gap.

*Two corrections to that document while I'm here:* **Meteor Swarm does not exist in the Remaster** —
there is no rank-10 Meteor Swarm in the packs; the rank-10 blast is `Cataclysm` (6 × 3d10 in a 60-ft
burst) and the better nova is rank-9 `Falling Stars`. And the Kineticist feat levels are off:
`Flying Flame` and `Scorching Column` are **level 1**, `Thermal Nimbus` and `Blazing Wave` are
**level 4** — the build is stronger and earlier than the doc suggests.

### 4.2 vs. the five high-DPR builds

| Build | Their engine | Breath Slayer's answer |
|---|---|---|
| **Fighter** | `Vicious Swing` at **level 1**: +3 weapon dice at 18, at-will, +Legendary proficiency | First Form: +3d6 for **1 FP**, three times a fight, and no proficiency lead |
| **Giant Barbarian** | +18 Rage damage on oversized dice, **every Strike, all day** | Style riders are +1 precision per die (Flower, once/round) ≈ +4 |
| **Flurry Ranger** | MAP −1/−2 → 3–4 near-full-bonus Strikes/turn, forever | `Twin-Blade Discipline` at **feat 6** = `Double Slice` (**fighter 1**) with a flourish tag bolted on |
| **Ruffian Rogue** | 4d6 Sneak Attack on **every** qualifying Strike | no equivalent per-Strike rider |
| **Starlit Span Magus** | crit-doubled Spellstrike, 150–250 burst | no nova at all; best burst is 65 |

The Breath Slayer's Forms are priced like **cantrips with a resource cost**. Against these five,
its per-round contribution when the pool is dry is that of a plain martial with no class feature.

### 4.3 The comparison that hurts most: the Monk

The Monk is the same chassis — martial, focus pool, stances, named techniques — and it wins at
every single rung:

| Level | Monk | Breath Slayer |
|---|---|---|
| 1 | `Inner Upheaval`: 1 action, 1 FP, +1 status, +1d6→3d6, **applies to Flurry of Blows (two Strikes)**, damage type chosen from force/spirit/vitality/void (bypasses the common resistances) | First Form: identical numbers, **one** Strike, one fixed damage type |
| 1 | `Qi Blast`: **1 action** for a 15-ft cone, scaling to 9d6; 3 actions for a **60-ft cone** | Second Forms are 2 actions for a 15-ft cone |
| **12** | `Meditative Focus`: **"When you Refocus, you regain all your Focus Points instead of 1."** | `Perfect Slayer's Focus` does this at **level 18** |
| 16 | `Touch of Death` (1 FP): 200 damage or instant death | — |
| 18 | `Qi Center`: cast a 1-action stance qi spell **free**, once per minute | — |
| 20 | `Impossible Technique`: reroll an enemy's hit or a failed save | `Hidden Form`: 3 FP + a self-inflicted condition |

Note also that the docs cite *"Meditative Wellspring (monk 18)"* as the anchor for
`Perfect Slayer's Focus`. **That feat does not exist.** The real feat is `Meditative Focus`, and
it is at **level 12**. The class whose entire identity is its focus pool gets full recovery
**six levels later than the monk**.

---

## 5. Anchor audit — claimed vs. actual

| Feat | Claimed anchor | Reality in the packs | Net |
|---|---|---|---|
| `Twin-Blade Discipline` (6) | "Double Slice (fighter 1), gated to 6" | `Double Slice` **is** two Strikes at current MAP. Identical text, **five levels later**, plus a flourish tag that blocks other flourishes | ✗ strictly worse |
| `Cutting Gale` (8) | "heavily discounted Whirlwind (fighter 14)" | The real anchor is `Swipe` (**level 4**, 2 actions, 2 adjacent enemies). Cutting Gale rolls two attacks instead of one, which is better — but it's **4 levels late** | ✗ mistargeted |
| `Perfect Slayer's Focus` (18) | "Meditative Wellspring (monk 18)" | Feat doesn't exist. `Meditative Focus` is **monk 12** | ✗ 6 levels late |
| `Rapid Concentration` (8) | "focus-economy feats (monk 8–12 tier)" | Monk 12 gets **full** recovery; this gets 2 points conditionally at 8 | ~ fair-ish, obsoleted by the above |
| `Anticipate Lunge` (4) | "Stand Still (monk 4)" | Correct — `Stand Still` is monk 4. Note `Reactive Strike` is **fighter 1** | ✓ |
| `Water-Wheel Footwork` (1) | "Nimble Dodge (rogue 1)" | Correct | ✓ |
| `Guard Break` (2) | "Snagging Strike (fighter 1), taxed one level" | Correct, and `Snagging Strike` requires a free hand while Guard Break doesn't | ✓ slightly generous |
| `Flowing Water Counter` (6) | "Riposte-family feats at 6–8" | `Dueling Riposte` (fighter 8) triggers **only on a critical failure**; this triggers on **fail or crit fail**, at level 6, with a free Step | ⚠ **overtuned** — the one place the doc is generous |
| Final Forms | "Quivering Palm (monk 16) / Impossible Flurry (ranger 18) tier" | `Quivering Palm` is now `Medusa's Wrath` / `Touch of Death` — monk 16 feat, **1 FP**. `Impossible Flurry` — ranger 18, **free, at-will, 6 Strikes, no self-cost** | ✗ the anchors cost 1 FP or nothing; the Final Forms cost 3 FP **plus** a condition |

---

## 6. The structural issue nobody costed: the feat tax

The Breath Slayer spends **five class feats** (1 / 4 / 8 / 12 / 20) to acquire the five abilities
that *are the class*. Compare your own Saint class ledger in
`saint-gold-cloth-bcs-guide-v2.md`:

> `1 | Cosmo (focus pool + Signature Technique) | 10` · `3 | Technique gained | 10` ·
> `5 | Technique gained | 10` · `9 | Technique gained | 10` · `13 | Technique gained | 10` ·
> `17 | Technique gained | 10`

The Saint receives **six Techniques as chassis features for 60 BCS points** and keeps all eleven
class feat slots free. The Breath Slayer spends 5 of ~11 feat slots on the same thing. Two classes
in the same module, both claiming a 2100-point budget, priced on completely different assumptions.

That's not a rounding error — it's the difference between "I have a build" and "my build *is* the
class features everyone else gets free."

---

## 7. Recommended fixes

Ordered by impact-per-edit. None of these require new subsystems.

### 7.1 Costs — do this first
- **Every Form costs 1 Focus Point.** Delete all 2-FP and 3-FP costs.
- Throttle the big forms with **frequency** instead: Fourth Forms *once per encounter*; Final Forms
  *once per 10 minutes*. This is Paizo's own idiom and it survives the three-fight adventuring day.
- **Pick one tax for Final Forms, not three.** Right now they cost a feat slot + the whole pool +
  a lasting condition. Keep the feat and the self-cost (it's the genre fantasy and it's good
  flavor); drop the pool cost to 1.

### 7.2 Scaling — the standard curve
Set every form's heightening so its **rank-10 value** is the design target, then back-solve the
base dice. Proposed targets, calibrated on `Dragon Breath` (66.5) and `Pulverizing Wake` (49.5):

| Form shape | Actions | Rank-10 target | Heightening to use |
|---|---|---|---|
| Single Strike + rider | 1 | **+5d6** (17.5) plus the +1 status | `H(+2) +1d6` — *not* `H(+4)`; monk's `H(+4)` is paid for by Flurry doubling it |
| 15-ft cone / 10-ft emanation | 2 | **~13d6 (45.5)** | base `4d6` at rank 2, `H(+1) +1d6` |
| 30-ft cone / 20-ft burst | 2–3 | **~11d6 (38.5)** | base `2d6` at rank 1, `H(+1) +1d6` |
| Two Strikes, same target | 2 | **+4d6 each** (28.0 total) | base `1d6` at rank 4, `H(+1) +1d6` |
| Fourth Form (feat 12) | 2 | Strike **+3d8** *and* a 15-ft cone at **11d8** | copy `Pulverizing Wake` wholesale; it's a *ranger level-9* focus spell |
| Final Form (feat 20) | 3 | **13d6 in a 30-ft area**, or **4 Strikes**, or a 1-minute omnibuff | `All Shall End in Flames` / `Sever Four Dragonfly Wings` / `Equinoctial Vermilion Eye` |

Then run the monotonicity check: **First ≤ Second ≤ Third ≤ Fourth < Final**, per style, at rank 10.
As written, that inequality holds in exactly zero of nine styles.

Specific must-fixes:
- **`Upper Smash` has no heightening line at all** — add one.
- **`Lunar Dispersing Mist` has no damage at all** — it needs a rider, not just utility, at feat 12.
- **`Stone Skin`** resistance 4 at level 20 → make it `resistance 2 + half level` (matching your own
  reaction forms' formula), or copy `Thermal Nimbus` and give resistance = level in a stance.
- **`Rice Spirit`** is the outlier at 65.0. Once the rest of the book comes up to the curve it stops
  being an outlier — leave it, and use it as the benchmark rather than nerfing it.

### 7.3 Chassis changes
- **Grant the First Form and Second Form as chassis features** (levels 1 and 5), matching the Saint's
  "Technique gained" line. That frees two feat slots and makes the class playable without a
  pre-committed build.
- **Move full-pool Refocus to level 12** (`Meditative Focus` parity) and repurpose the level-18 slot.
  Add a chassis line at ~L14–16 mirroring `Qi Center`: *once per minute, use a 1-action Form without
  spending a Breath Point.*
- **Make resistance-bypass a chassis feature at ~L9**, not the level-10 `Crimson Blade` feat. Every
  form deals slashing, fire, electricity or sonic — all commonly resisted at high level. Compare
  `Overwhelming Spellstrike` (magus 12), `Overwhelming Breath` (monk 12), and monk `Inner Upheaval`'s
  free choice of force/spirit/vitality/void. Alternatively: let Forms deal **spirit** damage at the
  slayer's option — it fits demon-slaying thematically and solves the resistance problem in one line.
- **Add a per-Strike rider to the stance**, so the class has a floor when the pool is dry. Right now
  a Breath Slayer out of Breath Points is a martial with no class feature. Anchor: `Sneak Attack`
  (4d6 at 17), `Rage` (+18 at 15), `Precise Strike` (+6/+6d6 at 17). Even a modest
  "+2 per weapon damage die while in a stance" would fix the floor.

### 7.4 Feat-level corrections
- `Twin-Blade Discipline` → move to **level 2** (it is `Double Slice`, a level-1 fighter feat) and
  drop the flourish tag, or leave it at 6 and let it make **three** Strikes.
- `Cutting Gale` → move to **level 4** (`Swipe` parity), or leave at 8 and let it hit **all** adjacent
  enemies (a discounted `Whirlwind Strike`, which is what the doc claims it is).
- `Flowing Water Counter` → this one is *stronger* than `Dueling Riposte` (fighter 8) at level 6.
  Either move it to 8 or narrow the trigger to critical failures.

---

## 8. One-line summary

The Breath Slayer's Forms are priced like slot spells, scaled like cantrips, and gated like a
daily resource — three cost models stacked on the same ability. Charge **1 Focus Point** like every
other focus spell in the game, rebuild the dice so the **rank-10** value (not the printed value) is
the design target, hand the first two Forms to the chassis the way the Saint class does, and give
the stance a per-Strike rider so the class has a floor. That's a full-power PF2e martial without
adding a single new mechanic.

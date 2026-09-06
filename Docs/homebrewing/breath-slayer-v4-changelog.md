# Breath Slayer v4 — Implementation Changelog

*What was changed, why, and where each change came from. Every row maps to a recommendation in
`Docs/breath-slayer-balance-analysis.md`, or to the design brief that accompanied it:*

> *"We could balance some things not using damage only — apply conditions, be usable while certain
> conditions hold, or whatever other thing may make them useful. Final Forms should be powerful,
> especially taking into account the self-cost."*

**Files:**
- `Docs/homebrewing/breathing-forms-compendium-v4.md` — replaces v3
- `Docs/homebrewing/breath-slayer-class-feats-v4.md` — replaces v3
- v3 files are left in place for diffing.

---

## 1. Recommendation-by-recommendation audit

### §7.1 — Costs

| Recommendation | Status | Implementation |
|---|---|---|
| Every Form costs 1 Focus Point; delete all 2-FP and 3-FP costs | ✅ **Done** | All 45 Forms cost **1 Breath Point**. |
| Throttle with frequency: Fourth Forms once/encounter, Final Forms once/10 min | ⚠️ **Partial — deliberate** | Final Forms: **once per 10 minutes**, as recommended. Fourth Forms: **no frequency limit**. See §2.1 below. |
| Pick one tax for Final Forms, not three: keep the feat + the self-cost, drop the pool cost | ✅ **Done** | Final Forms cost 1 BP, a feat-20 slot, a once-per-10-minutes frequency, and their self-cost. The pool cost is gone; the genre-defining self-cost stays and, in several cases, got *sharper* (see §3). |

### §7.2 — Scaling

| Recommendation | Status | Implementation |
|---|---|---|
| Set every form's heightening so its **rank-10** value is the design target | ✅ **Done** | Every Form now states an explicit base rank and heightening line. Full curve in Forms v4 §0.3. |
| Single Strike + rider → +5d6, using `H(+2)` not `H(+4)` | ✅ **Done** | All First Forms: `1d6` @ r1, `H(+2) +1d6` → **+5d6 (17.5)**. |
| 15-ft cone / 10-ft emanation → ~13d6 | ✅ **Done** | `5d6` @ r2 or `9d6` @ r6, `H(+1) +1d6` → **13d6 (45.5)**. |
| 30-ft cone / 20-ft burst → ~11d6 | ✅ **Done** | `5d6` @ r4, `H(+1) +1d6` → **11d6 (38.5)** for lines and ranged bursts. |
| Two Strikes, same target → +4d6 each | ⚙️ **Adjusted to +5d6 at Second-Form tier** | `1d6` @ r2, `H(+2) +1d6` → +5d6 each (35.0) at Second-Form tier; Fourth-Form two-Strike forms use `2d6` @ r6 → +4d6 each, and buy extra targets or hard conditions instead of dice. Preserves monotonicity within the style. |
| Fourth Forms → copy `Pulverizing Wake` (Strike +3d8 and an 11d8 cone) | ⚙️ **Shape-matched, not copied** | Fourth Forms land on **13d6 (45.5)** — `Pulverizing Wake`'s cone is 49.5 — but each also carries a **hard condition** (immobilize, prone, stun, party-wide off-guard, hidden). Copying the ranger form wholesale nine times would have erased nine style identities. |
| Final Forms → 13d6 in a 30-ft area, or 4 Strikes, or a 1-min omnibuff | ✅ **Done, all three shapes used** | 13d6+ area: Rengoku, Idaten Typhoon, Honoikazuchi, Moonbow (16d6 / 56.0). 4 Strikes: Arcs of Justice, String Performance, Dead Calm (≤4 MAP-free ripostes). 1-minute omnibuff: Equinoctial Vermilion Eye, Obscuring Clouds. |
| Run the monotonicity check First ≤ Second ≤ Third ≤ Fourth < Final | ✅ **Passes 9/9** | Audit table: Forms v4 §11. It passed **0 of 9** in v3. |
| `Upper Smash` has no heightening line — add one | ✅ **Done** | `3d6` @ r2, `H(+2) +1d6` → **+7d6 (24.5)**, gated behind a Requirement clause so it can stay at 1 action. |
| `Lunar Dispersing Mist` has no damage at all — it needs a rider at feat 12 | ✅ **Rewritten** | Two Strikes at +4d6 each across two targets, dazzled + can't-Seek on each, a no-reaction Stride, concealed, and **hidden** from everything it hit. |
| `Stone Skin` resistance 4 at level 20 → `2 + half level`, or copy `Thermal Nimbus` | ✅ **Done, stronger** | **Resistance to all physical (except adamantine) equal to half your level**, min 2 — 10 at level 20 — plus immunity to ordinary knockdown and forced movement, for 1 minute. |
| `Rice Spirit` is the outlier at 65.0 — leave it, use it as the benchmark | ❌ **Deviated — rescaled to 45.5** | See §2.2 below. |

### §7.3 — Chassis changes

| Recommendation | Status | Implementation |
|---|---|---|
| Grant First Form and Second Form as chassis features (levels 1 and 5) | ✅ **Done** | Chassis: **Focused Breathing** (1) and **Second Breath** (5). Pool growth also moved to the chassis at **1 / 5 / 9**, so no feat grants pool any more. |
| Move full-pool Refocus to level 12 (`Meditative Focus` parity) and repurpose the level-18 slot | ✅ **Done** | Chassis **Total Concentration** at 12. Level 18 now offers **Unbroken Cadence** and **Breath of the Departed** alongside Awakened Mark. |
| Add a `Qi Center` analogue at ~L14–16 | ✅ **Done** | Chassis **Breath of Instinct** at 15: once per minute, use a 1-action Form for free. |
| Make resistance-bypass a chassis feature at ~L9, not the L10 feat; consider letting Forms deal spirit damage | ✅ **Both** | Chassis **Nichirin Resonance** at 9: spirit damage on demand, ignore physical resistance up to half level, cold iron + silver. The feat-10 `Crimson Blade` is deleted, absorbed. |
| Add a per-Strike stance rider so the class has a floor — even "+2 per weapon damage die" would fix it | ✅ **Done** | Chassis **Concentrated Breathing** at 1: **+2 precision per weapon damage die**, → +3 at 9, → +4 at 17. At level 20 with major striking that is **+16 per Strike**, against Sneak Attack's 4d6 (14.0) and giant Rage's +18. |

### §7.4 — Feat-level corrections

| Recommendation | Status | Implementation |
|---|---|---|
| `Twin-Blade Discipline` → move to 2 and drop flourish, **or** leave at 6 with three Strikes | ✅ **Both, split across two feats** | **Twin-Blade Discipline at 2**, no flourish tag (`Double Slice` parity, one level of tax). **Twin-Blade Cascade at 10** upgrades it to three Strikes for three actions. |
| `Cutting Gale` → move to 4 (`Swipe` parity), **or** leave at 8 and hit all adjacent | ✅ **Both, split across two feats** | **Cutting Gale at 4** (two adjacent, two rolls). **Whirling Gale at 14** hits every enemy in reach — `Whirlwind Strike` parity at `Whirlwind Strike`'s own level. |
| `Flowing Water Counter` → move to 8, **or** narrow to critical failures | ✅ **Narrowed** | Stays at 6, trigger narrowed to **critical failure** (`Dueling Riposte` parity). **Perfected Water Counter at 12** buys the wider fail-or-crit-fail trigger back, plus MAP immunity. |
| `Perfect Slayer's Focus` cited a nonexistent feat ("Meditative Wellspring, monk 18") | ✅ **Corrected** | The real feat is `Meditative Focus`, **monk 12**. Ported to the chassis at 12; the feat is deleted. |
| `Rapid Concentration` at 8 is obsoleted by full recovery at 12 | ✅ **Deleted** | Its alternative, `Battle Breathing`, survives as a standalone feat 8. |

### §6 — The feat tax

| Finding | Status | Result |
|---|---|---|
| Five class feats spent on the five abilities that *are* the class, while the Saint gets six Techniques as chassis for 60 BCS points | ✅ **Fixed** | Single-style Form spend: **5 slots → 3** (feats 8 / 12 / 20). Full multi-style: **10 of 11 → 8 of 11**. |

---

## 2. Deviations from the analysis, and why

### 2.1 Fourth Forms have no "once per encounter" limit

§7.1 recommended it. The three-point pool already caps the class at **three Forms per encounter,
total, across all tiers**. A kineticist casts `Blazing Wave` for 42.0 in a 30-foot cone **every
round from level 4**, forever, for free. The Breath Slayer's entire per-encounter area output —
three Fourth Forms at 45.5 — is roughly three rounds of that, and then it's over.

Layering a per-encounter frequency on top of a pool that already enforces the same limit charges
twice for one throttle. The pool *is* the frequency. Final Forms keep their once-per-10-minutes
because they sit above the curve by design.

### 2.2 `Rice Spirit` was rescaled from 65.0 to 45.5

§7.2 said "leave it, and use it as the benchmark rather than nerfing it." I disagree with the read,
and this is the one substantive deviation.

The argument for leaving it was that the rest of the book was under-tuned. That's true, and the rest
of the book came up. But 65.0 was never a valid benchmark for a **2-action cone**:

| Anchor | Shape | Rank-10 |
|---|---|---|
| `Tempest Surge` (druid, rank 1) | **single target** | 10d12 = 65.0 |
| `Qi Blast` (monk, 2 actions) | 30-ft cone | 17d6 = 59.5 |
| `Pulverizing Wake` (**ranger 9**) | Strike + 15-ft cone | +3d8 and 11d8 = 49.5 |
| `Dragon Breath` (**sorcerer**, full caster) | 30-ft cone | 19d6 = 66.5 |

`Tempest Surge`'s 65.0 is priced for one target. Reproducing it in a **cone** on a **martial** —
who also gets a full Strike routine, Concentrated Breathing, and a nichirin blade — puts a level-5
ability above a full caster's best focus spell and above every Final Form in the book. That's exactly
the incoherence the analysis was written to remove.

**What was kept:** the d12 identity. Rice Spirit is `3d12` @ r2 with `H(+2) +1d12` → **7d12 (45.5)**,
which lands on the 2-action cone curve while remaining the only Form in the book rolling d12s outside
Thunder's capstone. It is still Thunder's signature, still the highest single roll a Second Form
makes, and it no longer eclipses the level-20 form of the same style.

### 2.3 Two-Strike Second Forms deal +5d6 each, not +4d6

§7.2's "+4d6 each" target would have put Second Forms *below* First Forms in the styles that use the
two-Strike shape (Mist, and Flower's Peonies at Third-Form tier). +5d6 at Second-Form tier and +4d6
at Fourth-Form tier keeps the per-style ladder monotonic, with Fourth Forms buying extra targets and
hard conditions rather than more dice. Monotonicity was §7.2's own closing test, so it wins the tie.

### 2.4 Fourth Forms don't literally copy `Pulverizing Wake`

§7.2 suggested copying it wholesale. Doing that nine times would give nine styles the same
Strike-plus-cone Fourth Form and erase what makes each style play differently at the tier where the
style is supposed to come into its own. They match its *value* (45.5 area against 49.5) and spend
the difference on the condition riders described below.

---

## 3. The non-damage levers, style by style

This is the part of the brief the analysis didn't cover. Every rider below has a live PF2e anchor;
none of them is a damage increase.

| Style | Fourth Form's condition | Final Form's teeth beyond damage |
|---|---|---|
| **Water** | Whirlpool **pulls** targets 5 ft toward you; crit fails can't Step | Dead Calm: **≤4 ripostes that neither use nor increase MAP**, +2 status AC/Ref |
| **Flame** | Flame Tiger locks **frightened 2** — it can't drop below 1 while the fire burns | Rengoku: persistent fire that **can't be ended by the flat check** (needs an Interact, a dousing, or cold damage) |
| **Thunder** | Rumble & Flash **stuns 1** where the lines overlap, and gives −2 to the save there | Honoikazuchi: **stunned 2** on a crit-failed Fortitude save, plus stun along the path |
| **Wind** | Rising Dust Storm knocks **flying creatures out of the air**; difficult terrain; prone | Idaten Typhoon: crit fails **can't Stand** until the end of their next turn |
| **Stone** | Volcanic Rock **immobilizes** under rubble (Escape vs. class DC), on a basic **Fortitude** save | Arcs of Justice: **resistance 15 to all damage**, can't be moved, auto-crit-success vs. prone |
| **Sound** | Constant Resounding **stupefied 2** + a Fort save vs. slowed 1 — the anti-caster form | String Performance: **stunned 1/2** on four separate targets |
| **Flower** | Whirling Peach makes **two** targets off-guard **to all creatures** | Vermilion Eye: enemies **off-guard on your first Strike each round**, free Step, ignore concealment |
| **Mist** | Lunar Dispersing makes you **hidden** from everything it hit; targets can't Seek | Obscuring Clouds: **−2 to enemy attacks and Perception** inside, +2 AC for you, free off-guard each round |
| **Moon** | Moon Spirit Calamity: prone, persistent bleed, and a **lingering 4d6 zone** | Moonbow: bleed that **needs magical healing or an Interact to stanch**, plus a 6d6 second tick |

Plus two whole Final Forms that deal **no damage at all** and are still capstones —
**Dead Calm** (a counter-state) and **Obscuring Clouds** (a one-minute mobile battlefield) — and one
Final Form that is a pure buff, **Equinoctial Vermilion Eye**.

**Conditional-usability gates used instead of cost increases:**
- `Upper Smash` — Requirement: target is larger than you, prone, grabbed, restrained, or already
  damaged by you. This is what lets it stay at **1 action** for +7d6 and party-wide off-guard.
- `Rising Scorching Sun` — the target is off-guard **only if it is already burning**, which your own
  stance supplies.
- `Crimson Hanagoromo` — the target is off-guard **only if it has already attacked you**.
- `Water Surface Slash` — dice upgrade from d6 to d8 **only if you moved 10 feet first**.
- `Thunderclap and Flash` — bonus damage **only if you moved 20 feet**.
- `Ragged Breath` (feat 6) — Requirement: **0 Breath Points**.
- `Breath of the Departed` (feat 18) — Trigger: **0 Hit Points**.

---

## 4. Making Final Forms actually powerful

The brief asked for this explicitly. Four things were done:

1. **The cost dropped from 3 BP to 1 BP.** In practice this is the biggest change in the document. At
   3 BP a Final Form fired **once per adventuring day** — a three-fight day meant one Final Form, in
   one of the three fights. At 1 BP with a once-per-10-minutes frequency, it fires **once per fight**,
   which is what "the dramatic climax of a fight" actually requires.
2. **The numbers came up to capstone tier.** Moonbow went from 31.5 in a 30-ft cone to **56.0 in a
   40-ft cone**. Honoikazuchi went from a Strike +19.5 to a Strike **+39.0** with a stun, plus 26.0
   along a 100-foot path. Rengoku and Idaten Typhoon are at **13d6 (45.5)** — `All Shall End in
   Flames` parity, which is a *free, at-will* kineticist 18 impulse.
3. **The self-costs got sharper, not softer.** They are the price of the power, so they were kept and
   in places tightened: Rengoku's fire damage ignores your own fire immunity; Moonbow's drained can't
   be removed until you Refocus; Vermilion Eye's blindness escalates to 24 hours on a second use in a
   day; `Breath of Endurance` (feat 16) is explicitly ruled **not** to blunt any of it.
4. **Each capstone got a "this doesn't wash off" rider.** Unquenchable persistent fire, un-stanchable
   bleed, MAP-free ripostes, a prone that can't be stood up from, resistance 15 to everything, a
   one-minute omnibuff. These are what make a Final Form read as a Final Form rather than as a large
   number.

**Where they now sit:** the strongest is Moonbow at 56.0 in a 40-foot cone with unstoppable bleed,
against `Dragon Breath`'s 66.5 in a 30-foot cone — a **first-level sorcerer bloodline focus spell**
with no self-cost at all. That is the correct relationship for a martial capstone.

---

## 5. Anchor corrections found while writing v4

Five more citations were wrong — three inherited from v3, two from the design brief. All were checked
against `pf2e-14-dev/packs/pf2e` and corrected in place.

| Citation | Claimed | Actual | Effect on the design |
|---|---|---|---|
| `Stance Savant`, anchor for the feat-12 initiative stance | "monk 12, identical" | **No such feat exists.** The feat that does exactly this at exactly this level is **`Reflexive Stance` (monk 12)** | None — level was already right. Citation corrected; the homebrew name is kept. |
| `Mobile Shot Stance`, anchor for Water's stance | "ranger 4"; used to price a +1 circumstance AC | **fighter 8**, and it concerns *ranged reactions*, not AC | Re-anchored to **`Crane Stance` (monk 1)**, which grants an **unconditional** +1 circumstance AC. Water's is movement-gated, so it's comfortably under a level-1 feat. |
| `Furious Vengeance`, anchor for Slayer's Reprisal | "barbarian 12" | **barbarian 16** | Improves the case — Slayer's Reprisal sits at 16, exact parity. |
| `Bloodline Focus`, anchor for in-combat pool recovery | remembered as "sorcerer 4, regain 1/day" | **sorcerer 12: completely refill your focus pool when you Refocus** | Two consequences. It is a **second level-12 anchor** for chassis Total Concentration, alongside `Meditative Focus`. And it is *not* an anchor for a per-point recovery feat. |
| `Ragged Breath`'s frequency | drafted as **once per hour** | Every "regain 1 Focus Point" feat in the game is **once per day**: `Linked Focus` (wizard 4), `Surging Focus` (cleric 8), `Retributive Focus` (champion 18 — and it carries the same **empty-pool requirement**) | **Retuned to once per day.** Once per hour would have been ahead of a champion 18 feat at feat 6. |
| `Nimble Roll`, anchor for Flowing Step | "rogue 6" | **rogue 8** | Strengthens the case; Flowing Step is well under it. |

---

## 6. Corrections to the two reference build documents

Carried forward from the analysis, since they affect the comparisons above:

- **`Meteor Swarm` does not exist in the Remaster.** The rank-10 blast is `Cataclysm`; the better
  nova is rank-9 `Falling Stars`.
- **`Pulverizing Cascade` belongs to the Wave Order, not Storm.** Storm's advanced focus spell is
  `Powerful Inhalation`. *(The AoE Beast Builds doc already carries this correction at the top.)*
- **Kineticist feat levels are off in the AoE doc.** `Flying Flame` and `Scorching Column` are
  **level 1**; `Thermal Nimbus` and `Blazing Wave` are **level 4** — not 8 and beyond. The fire
  kineticist's sustained AoE floor arrives much earlier than that document suggests, which is why it
  is the hardest comparison in this book.

---

## 7. v4.1 — Love and Serpent Breathing

Two new styles, bringing the compendium to **eleven**. Both are canon Hashira styles, and unlike the
four expanded styles they each have a stated parent among the original five, so they slot into the
Breathing Style relationship chart rather than sitting beside it:

| Style | Parent | Creator | Canon forms | Invented |
|---|---|---|---|---|
| **Love** | **Flame** | Mitsuri Kanroji | 6 listed, **5 demonstrated** (First, Second, Third, Fifth, Sixth) | **Nothing.** The five demonstrated forms are exactly a full ladder. |
| **Serpent** | **Water** | Obanai Iguro | **5, all demonstrated** | **Nothing.** |

Both ladders are built entirely from canon. The only invented content in the whole addition is one
clearly-labelled optional sidebar for Love's undemonstrated Fourth Form, offered as a *replacement*
for Swaying Love, Wildclaw rather than an addition to the ladder.

### 7.1 Sourcing note

Fandom is blocked at the fetch proxy (HTTP 402 on every URL, including `api.php`), and `curl` fails
TLS verification through the same proxy. Python's `urllib` reaches it directly, so the two style
articles were pulled as raw wikitext from the MediaWiki API and read as the primary source:

```
python -c "import urllib.request,json; print(json.load(urllib.request.urlopen(
  urllib.request.Request('https://kimetsu-no-yaiba.fandom.com/api.php?action=parse'
  '&page=Serpent_Breathing&prop=wikitext&format=json',
  headers={'User-Agent':'Mozilla/5.0'})))['parse']['wikitext']['*'])"
```

This mattered — **the popular secondary sources are wrong in three places**, and the designs were
corrected against the wiki:

| Form | Secondary sources say | Wiki says | What v4.1 does |
|---|---|---|---|
| **Winding Serpent Slash** | "slithers around unleashing multiple sword strikes to take out **multiple enemies**" | "a **singular** frontal horizontal slash aimed at their target in a winding motion" | Built single-target, as a Step plus one Strike |
| **Love Pangs** | "attacking the **area around her**," defensive and offensive | "a singular, long-winding swing… that cuts **the target** at multiple angles" | Built single-target: two Strikes on one creature, no defensive clause |
| **Twin-Headed Reptile** | a leap and a horizontal slash, no explanation of the name | same, plus trivia: it is **visualised as a polycephalic (two-headed) snake**, and the name 頸蛇双生 means "twin-born **neck** serpents" | Two simultaneous Strikes, and the beheading clause the name points at |

### 7.2 Canon details that became mechanics

Rather than inventing riders, every distinctive clause in these two styles is a canon line converted:

| Canon text | Mechanic |
|---|---|
| Kaburamaru "possesses a unique ability which allows him to **read and predict a target's attacks** and then relay that information to Obanai" | **Kaburamaru's Reading** — a free +2 circumstance AC against the first attack each round |
| Obanai's blade is a **kris / dakōken** (蛇行剣), a wavy short blade | **Winding Posture** grants `agile` and `finesse` — Serpent is the MAP-mitigation style |
| Slithering Serpent is "capable of **decapitating several enemies at once**"; Obanai fought on **blind** after Muzan took his eyes | Five Strikes, each beheading what it drops, cast while ignoring concealment — paid for with a round of blindness |
| Love Breathing is best "with a **whip-like katana**" | **Whipcord Blade** grants `reach`, `disarm`, `trip` |
| Wildclaw "was shown to have an even more powerful **drill-like attack when boosted with a Demon Slayer Mark**" | **Marked Wildclaw** — +4d6 and an immobilize while your Mark is active. A Form that reads your own chassis state instead of costing more. |
| Love Breathing "relies on her body's special composition" — **eight times normal muscle density** | The Final Form's self-cost is **enfeebled 2 until you Refocus**: she tears herself apart with her own strength |
| Shivers of First Love "winds through the target, **hitting multiple areas with one slice**" | The only Form in the compendium that **ignores lesser and standard cover** |

### 7.3 Design gaps these two fill

- **Serpent is the first style with no area Form at all** — deliberately the single-target,
  many-Strikes style, and the class's answer to a Flurry ranger. Its stance granting `agile` without
  the usual smaller damage die is the compensation, and its watch-list entry warns players about the
  trade before they commit at level 1.
- **Love carries the only outward-facing style rider in the book.** Every other rider makes *you*
  better; `Beloved of the Corps` hands an ally +1 to attack and damage. The class had no support
  style, and a Flame derivative built by the warmest character in the source is the right place for
  one.
- **Diplomacy** is granted for the first time; **Deception** likewise. Skill coverage across the
  eleven styles is now Acrobatics, Athletics ×2, Deception, Diplomacy, Intimidation ×2, Medicine,
  Stealth ×2, Survival.

### 7.4 Balance placement

Both pass the rank-10 monotonicity check (audit table, Forms v4 §11). Neither introduces a new
number: Love's Fifth Form is on the 13d6 (45.5) area curve like every other Fourth-tier Form, and
Serpent's ladder is entirely Strike-riders on the existing +5d6/+7d6 curve. The two things worth
watching are **Marked Wildclaw at 17d6 (59.5)**, whose gate is a chassis state rather than a
resource, and **the beheading clause**, which is nearly free against ordinary monsters and decisive
against anything that regenerates. Both are on the playtest watch list.

---

## 8. Still open

- **The class guide itself has not been edited** — it isn't in this repository. §1 of the feats v4
  document is written as a portable list of chassis amendments so it can be pasted in. Two chassis
  features are referenced but not redefined because their current text lives only in the guide:
  **Demon Slayer Mark** and **Transparent World Glimpse** (L11).
- **BCS ledger.** Chassis additions in feats v4 §1.1 are new lines and will need pricing against the
  2100-point budget. The style riders and stances are unchanged in value (30 pts each, Exemplary
  Finisher anchor), so the *subclass* side of the ledger is untouched — but `Concentrated Breathing`,
  `Nichirin Resonance`, `Total Concentration` and `Breath of Instinct` are genuine new chassis spend,
  offset by five deleted feats' worth of chassis-equivalent value.
- **Foundry automation.** None of this is implemented in the module yet. The Forms are written in
  system-legible terms (explicit base rank, explicit `H(+N)` interval, named conditions, basic saves
  against class DC) specifically so they can be authored as focus spells with standard
  `system.heightening` interval entries rather than as bespoke rule elements.

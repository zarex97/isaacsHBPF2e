# Breath Slayer v5 — Combo Rework: Brainstorm

*Working document. Nothing here is final. This is the argument-and-options pass that has to happen
before a plan, and it deliberately says which options I think are wrong and why.*

**Premise from the design brief:** v4 is a well-costed martial that does not bring a *new verb* to the
table. Its pitch — "3 focus spells and a precision rider" — is the monk's pitch with a katana.
v5's verb is **combo'ing**: sequence matters, build-up pays, and the class rewards a player who is
thinking two forms ahead.

---

## 0 — The three findings that should drive every other decision

Read these first. Most of the design space below collapses once you accept them.

### Finding 1 — A nine-link chain cannot complete in a Pathfinder fight

PF2e encounters run **3–5 rounds**. A martial gets 3 actions a turn and needs some of them for
Striding, Raising a Shield, Demoralizing, standing up, and drinking things.

If a Form costs 1–2 actions and the chain advances one link per Form, a realistic turn is **one Form**.
Four rounds is **four links**. A ladder whose payoff sits at link 9 pays out **never**, in every fight
that isn't a boss slog.

Three consequences, and they are not optional:

1. **The chain must pay at every link, not at the end.** Escalation has to be a curve you ride, not a
   door you unlock. If link 4 isn't already good, the design is dead on arrival.
2. **The chain must accelerate.** The reward for depth should partly be *action compression* — deep
   links cost fewer actions, so you fit more links per turn as the fight goes on. Round 1 you use one
   Form; round 4 you're firing two or three. That is exactly the shape of the source material, and it
   is the only mechanism that makes link 7+ reachable.
3. **The Secret/Forbidden Form gates at ~6, not 9.** Gate it where a real fight can actually get.

### Finding 2 — Removing the pool removes the *only* current throttle, and the numbers must halve

v4's entire damage budget is "3 Forms per encounter at 25–45 damage each" ≈ **90–110 points of Form
damage per fight**, on top of a full martial Strike routine and `Concentrated Breathing`.

Make Forms free and a 4-round fight produces 4–8 Forms. Keeping v4's per-Form numbers roughly
**doubles-to-triples** class damage. So either:

- every Form's printed numbers come down hard (roughly **halve** the base), with the **chain bonus
  buying the difference back at depth** — the late-chain Form ends up where a v4 Second Form is now,
  and the early-chain Form is deliberately small; **or**
- Forms stay big and something else throttles — one Form per turn, a per-encounter cap, a
  cooldown wheel. That's re-inventing the pool with extra steps.

I recommend the first. **The chain replaces the pool as the economy**: your resource is no longer
points, it's *position*. That is the actual new verb, and it's worth the rescaling work.

The corollary nobody enjoys: **every one of the ~55 existing Forms gets rewritten**, and you're adding
~55 more. See §6.

### Finding 3 — Approach 1.b as literally written is 792 table entries. It doesn't have to be.

"Each of 9 Forms has 5 favourable and 3 unfavourable successors" categorises **all eight** other Forms
for every Form. That's 72 ordered transitions per style × 11 styles = **792 authored relationships**,
none of which a table can hold in its head.

But look at the shape: 5 good + 3 bad + itself = 9. That is exactly a **wheel**. Number the Forms 1–9
and arrange them in a circle:

- moving **+1 to +5** around the wheel = favourable
- moving **−1 to −3** (i.e. +6 to +8) = unfavourable

One sentence reproduces all 792 entries, needs no table, and is trivially automatable. **1.b is not a
content problem, it's a notation problem.** This realisation is what makes the whole rework tractable,
and it's the basis of the approach I recommend below.

---

## 1 — Approach 1.a evaluated (steps / tiers)

**What it is:** 3 Forms in Step 1, 3 in Step 2, 3 in Step 3, Secret Form in Step 4. Use Step 1 → Step 2
→ Step 3 in order for a reward; skipping steps applies "reverse heightening."

### What's good about it

- **One universal rule, remembered instantly.** "Go up a step" is the whole system.
- **Steps are a natural acquisition unit.** A feat that grants *a whole step* (3 Forms) is a fair
  level-8 feat, which means 9 Forms cost you **fewer** feat slots than v4's 5 Forms cost now
  (§6.2). This is a genuinely large quality-of-life win and it's the best argument for 1.a.
- **Reverse heightening is mechanically elegant and native.** PF2e already scales everything by rank;
  "this Form functions at rank − 2 per step skipped, minimum rank 1" is one line, uses machinery the
  system already has, and automates cleanly.
- **Tier-wide combo riders scale the writing down.** You author *one* rider per step per style (11 × 3
  = 33) instead of one per Form.

### What's wrong with it

- **It's a track, not a choice.** Once you know the order, every turn's optimal play is "next step."
  There is no decision, only compliance. A combo system whose combo is fixed is a chore with extra
  vocabulary.
- **Nine Forms, three of which you always open with.** Steps 1a/1b/1c are interchangeable openers, so
  in practice you have one opener and eight dead options.
- **The chain terminates.** After Step 3 (or the Secret Form), what? Reset to Step 1 and grind again?
  In round 4 of 4, that's a dead turn.
- **It fights Finding 1 head-on.** A strict 3-step ladder plus a Secret Form is a 4-link chain minimum
  and a 10-link chain maximum, and only the short reading works.

**Verdict:** keep the tiers, but as **acquisition and rank-gating**, not as the combo rule.

---

## 2 — Approach 1.b evaluated (per-Form favourable/unfavourable successors)

**What it is:** each Form names 5 Forms it flows into well and 3 it flows into badly; the later in the
chain, the bigger the hit.

### What's good about it

- **It's an actual decision every turn.** Multiple legal good moves means you're picking, not obeying.
- **It's how the source material reads.** Nobody in *Kimetsu no Yaiba* runs 1→2→3→4; they read the
  situation and pick the form that answers it. The favourable-successor graph is a much better fiction
  model than a staircase.
- **It naturally supports style identity.** Water's wheel can be permissive (Water flows anywhere);
  Thunder's can be brutally narrow (Zenitsu knows one Form and it is the only Form).

### What's wrong with it

- **As literally specified: 792 relationships.** Unwritable and unplayable. (Solved by the wheel — §0.3.)
- **"The later in the chain, the more damage" needs a tracked number anyway** — so you end up with a
  count *and* a graph. Two subsystems where one might do.
- **Unfavourable transitions are a trap for new players.** Eight legal options, three of which quietly
  punish you, is exactly the kind of thing that makes someone's first session feel bad.

**Verdict:** the *idea* is right and the *notation* is wrong. Collapse it into a wheel.

---

## 3 — Recommended synthesis: **The Wheel + the Breath Count**

This is what I'd build. It takes 1.a's tiers, 1.b's graph, and the escalation both want, and makes them
one mechanic with **one number to track**.

### 3.1 The nine Forms sit on a wheel

Each style's Forms are numbered **1–9**, arranged in a circle, plus a **Secret/Forbidden Form** off
the wheel entirely.

| Transition | Name | Effect |
| :---- | :---- | :---- |
| **+1, +2, +3** | **Flowing** | The chain continues. Breath Count **+1**. |
| **+4, +5** | **Reaching** | The chain continues but strains. Breath Count **+1**, and the Form functions at **rank −2** (min 1). |
| **−1, −2, −3** (= +6/+7/+8) | **Broken** | The chain **resets to 1**. The Form functions at **rank −2 per link you fall back**, min rank 1. |
| **Same Form twice** | — | Not permitted in one chain. (This is the anti-spam rule, and it's free.) |

Because the wheel **wraps**, a chain never terminates: 7 → 9 → 3 → 5 → 8 is a legal, escalating chain
five links deep. **This solves 1.a's dead-end problem and 1.b's table problem in the same stroke.**

Note the wheel also delivers the brief's *"the later their position in the chain, the more damage"* —
but keyed to **chain depth**, not to the Form's printed number, which is the reading that actually
works at the table.

### 3.2 The Breath Count is the whole economy

**One tracked number, 0–9.** It starts at 0, goes up 1 per Flowing or Reaching Form, resets on a Break.

Every Form gains, on top of its printed effect:

> **+1 damage die per point of Breath Count** (d6s; d8s from 9th, d10s from 17th — pick one axis, not
> two), **and** its status bonuses increase by +1 at Count 4 and +2 at Count 7.

At Count 6 with d6s that's **+21 damage**, which lands a small Form squarely in v4 Second Form
territory. The base printed number can therefore be *tiny* — Finding 2 satisfied — and the class's
whole damage curve becomes a function of how well the player is chaining.

**Advance at most once per turn.** You may use more than one Form in a turn (and should, at depth), but
only the first advances the Count. This kills the "spam three 1-action Forms" degenerate line without
banning multi-Form turns.

### 3.3 Depth buys actions — the acceleration engine

This is the piece that makes Finding 1 survivable and it's the most PF2e-native reward available.

| Breath Count | Effect |
| :---- | :---- |
| 3+ | The **first** Form you use each turn costs **1 fewer action** (minimum 1). |
| 6+ | **Flowing** transitions no longer trigger reactions; Reaching no longer takes the rank penalty. |
| 9 | Your next Form is **automatically critical-success-tier** on its saving throw, or gains +4 to the attack roll. (Placeholder — this rung wants a real playtest.) |

A fight now has a shape: round 1 you spend two actions on a Form and one on positioning; round 4 you're
firing a 1-action Form and a 2-action Form off the same turn. The class *feels* like it's speeding up,
because it is.

### 3.4 What resets the chain

Be **stingy** here. A build-up class whose build-up is easy to lose is a bad time.

| Event | Chain? | Rationale |
| :---- | :---- | :---- |
| Your Form **misses** | **Survives.** No advance, no reset. "You held the breath." | Miss-resets make the class feast-or-famine and unplayable at low levels. |
| A **Broken** transition | **Resets to 1** | This is the punishment the brief asks for, and it's chosen, not inflicted. |
| You take a **turn with no Form** | **−1 Count** (not zero) | A soft decay. Preserves the option of a Stride-heavy turn. |
| You **leave your stance** | **Reset to 0** | Unless you have the cross-style feat line (§5.3). |
| **Encounter ends** | **Reset to 0** | Until L19 (§6.3). |
| You are **stunned / paralysed / unconscious** | Reset to 0 | Fair and dramatic. |

### 3.5 The Secret/Forbidden Form is the chain's payout

Replace v4's "Frequency once per 10 minutes" with an organic gate:

> **Requirement** Your Breath Count is **6 or higher**.
> **Effect** [the big thing]. **Your Breath Count then drops to 0.**

This is strictly better design than a timer: it's earned rather than granted, it can happen twice in a
long fight if you're brilliant, and it can't happen at all if you've been sloppy. Keep the v4
self-costs (Rengoku's self-damage, Dead Calm's off-guard) — they're good and they now stack with
losing the chain.

**Optional:** allow it below Count 6 as a **Forbidden** use — it works, at rank −2 per point you're
short, and you take the self-cost twice. The desperation button. Very on-genre.

---

## 4 — Point 2: the prediction mechanic (**Kamae**)

*構え — "the posture you take before the cut."* This is the most original idea in the brief and it's
the one I'd protect hardest in the design. PF2e has almost no **declaration** mechanics; the
Investigator's *Devise a Stratagem* is the nearest thing and it isn't close.

### 4.1 The shape

> **Kamae** ✦ **Free action** · **Trigger** You use a Form.
> Name a Form on your wheel. Until the end of your next turn you are *set* for that Form.
> - **If your next Form is the named one:** it costs **1 fewer action** (min 1) *and* counts as **two
>   links** for Breath Count.
> - **If it isn't:** you gain no benefit, and the transition is treated as **Reaching** even if it
>   would have been Flowing.

Note carefully what the failure case *is not*: it isn't a condition, it isn't damage, and it isn't a
reset. It's **a downgrade of a reward you hadn't earned yet**. This matters enormously.

### 4.2 The trap to avoid

**A prediction mechanic must never make you worse off than not predicting.** The enemy will die, move
out of reach, stun you, or turn out to be fire-immune — and none of that is the player's fault. If
Kamae's downside is a real penalty, the correct play becomes "never Kamae unless it's round 1 against a
brick," and the mechanic is dead.

Two safety valves, take at least one:

- **Release** ✦ free action: cancel a Kamae before it resolves for no benefit and no penalty.
- **Loose Kamae**: name a **tier or an arc of the wheel** ("any Form 4–6") instead of a single Form.
  Fulfilled far more often, pays slightly less. This is probably the correct *default*, with the
  exact-Form call as the high-risk high-reward feat upgrade.

### 4.3 Where it lives

Not on the chassis. Kamae is a **feat line** — that keeps it opt-in for players who don't want the
cognitive load, and it gives you an obvious upgrade ladder:

| Lvl | Feat | Effect |
| :---- | :---- | :---- |
| 2 | **Kamae** | The base action, Loose form only. |
| 6 | **Read the Thread** | Name an exact Form; the payout goes to **three links** and a +2 status bonus to the Form's attack/DC. |
| 10 | **Double Kamae** | Hold **two** Kamae at once; fulfil either. |
| 14 | **Kamae of the Unopened Eye** | Fulfilling a Kamae also lets you make one Strike as a free action. |
| 16 | **Feint the Form** | If your Kamae is *not* fulfilled and an enemy has reacted to it (a Reaction it spent, a Shield raised), the transition is Flowing anyway and the enemy is off-guard to you. Being wrong on purpose. |

That last one is the best feat on the list and it's the whole class thesis in one paragraph.

---

## 5 — Style identity becomes **wheel shape**

This is the payoff that makes the 11 styles actually distinct rather than a damage-type swap — and it
matches canon, where the styles genuinely have different Form counts (Water 11, Moon 16, Sun 12,
Thunder 6, Stone 5, Sound 5, Serpent 5, Love 6, Flower 7, Mist 7, Wind 9).

| Lever | Example |
| :---- | :---- |
| **Wheel size** | Thunder has a **5-Form** wheel: you loop it fast, Breath Count climbs quickly, but you have almost no menu. Moon has **11**: a huge menu, slower to loop, more chances to Break. |
| **Reach** | Water's wheel is **Flowing on +1 to +5** (water goes anywhere). Serpent is **Flowing on +1 only** — the snake commits. |
| **Break penalty** | Stone doesn't reset on a Break; it drops to half, rounded down. The mountain doesn't fall over. |
| **Count cap** | Sound caps at 6 but every Form gets +2 dice per link instead of +1. Fast burn. |
| **Wrap bonus** | Flower gains something extra the first time each encounter it completes a full lap of its wheel. |

That is **five orthogonal dials** for eleven styles, and it costs no additional point budget because
it's all inside the existing 50-point `Breathing Style` line as a sidegrade.

### 5.3 Cross-style chaining is free design space

v4's `Flowing Stance Shift` (feat 4) already allows a secondary style. With a wheel, a whole feat line
opens up: **the chain survives a stance change** if the Form you leave on and the Form you arrive on
share a number, or a tier, or a damage type. That's Tanjiro's Hinokami Kagura pivot and Kokushibo's
style-fusion, and it's the natural home for a 12th-to-16th level feat cluster.

---

## 6 — The costs of doing this, honestly

### 6.1 Content volume is the #1 risk

9 Forms + Secret × 11 styles = **110 Forms**. v4 has 55. **You are doubling the largest document in the
repo and rewriting the half that already exists** (Finding 2 forces a rescale on every existing Form).

Mitigations, in order of how much they save:

1. **Variable wheel size** (§5) — Thunder/Stone/Sound/Serpent at 5–6 Forms each isn't a compromise,
   it's *better and more canonical*. Realistic total lands nearer **85** than 110.
2. **Tier-wide combo riders** — author the "what a Flowing transition into this tier does" text once
   per tier per style: 33 blocks, not 110.
3. **Promote v4's existing riders.** Several v4 Forms are already tiered variations of each other
   (Water's Whirlpool vs. Water Wheel). Split them rather than inventing from zero.
4. **Ship 3 styles first.** Water (the baseline), Thunder (the short-wheel extreme), Moon (the
   long-wheel extreme). If the wheel works on those three it works on all eleven; if it doesn't, you've
   burned three styles' worth of writing and not eleven.

### 6.2 Feat tax goes *down*, which is a real win

| | v4 | v5 (tier grants) |
| :---- | :---- | :---- |
| Forms known at 20 | 5 | **~10** |
| Chassis grants | 2 (L1, L5) | 2 tiers = **6 Forms** (L1, L5) |
| Feats spent on Forms | **3** (8/12/20) | **2** (a tier at 8, the Secret at 20) |

Granting Forms in **tiers of three** is the single best structural argument for keeping 1.a's tiers.
It's more content for *fewer* feat slots.

### 6.3 The ledger: four chassis features lose their job

Removing Breath Points orphans **~160 points** of the 690-point feature block. Translations that keep
the budget intact and are, I think, straight upgrades:

| v4 feature | Pts | v5 replacement |
| :---- | ---: | :---- |
| **Focused Breathing** (pool + First Form) | 10 | **Breath Cadence** — the Count engine + Tier 1 (3 Forms). Probably needs to cost more; take it from below. |
| **Second Breath** (2nd point + Second Form) | 40 | **Second Breath** — Tier 2 (3 Forms) + your Count cap rises. |
| **Nichirin Resonance** (3rd point) | 80 | Keep the resistance/material bypass (50); spend the other 30 on **Reaching no longer costs rank**. |
| **Total Concentration** (full Refocus) | 30 | **Total Concentration** — your chain persists for **1 minute** after an encounter ends, and out of combat you may raise your Count by breathing for a minute. The pre-fight breath. |
| **Breath of Instinct** (free 1-action Form) | 30 | **Breath of Instinct** — 1/minute, a Form doesn't consume or break the chain regardless of transition. The "get out of a Break free" card. |
| **Constant Total Concentration** (L19) | 150 | Keep the permanent-stance clause; replace "+1 Breath Point on initiative" with **"you begin every encounter at Breath Count 3."** Straight translation, and it's a beautiful capstone. |
| **Demon Slayer Mark** (L13) | 110 | *Ignition* ("your next Form is free") is now meaningless. Replace with **"Forms cost 1 fewer action"** or **"every transition counts as Flowing."** The latter is more thematic and much stronger — price accordingly. |
| **Concentrated Breathing** | 110 | **Unchanged. Do not touch it.** It's the floor, and a build-up class needs its floor more than v4 did — round 1 at Count 0 has to still feel like a slayer. |

### 6.4 Table bookkeeping — be honest about it

A player now tracks: stance, **Breath Count**, their wheel, the last Form used, and possibly a held
Kamae. That is more than any published PF2e martial except maybe the Kineticist.

Non-negotiable mitigations:
- **One number.** Breath Count is the only thing written down. Everything else is derived.
- **A physical wheel.** Ship a one-page printable wheel per style. This is a *design deliverable*, not
  an afterthought — the wheel diagram is what makes the system legible.
- **The last Form used is the only history.** Never let a rule depend on two Forms back.

### 6.5 Automation is genuinely feasible here

The module already has the machinery: `scripts/riders/`, `scripts/outcomes/`, `scripts/economy/`, and
the Saint's Om-stack system (per the automation programme, §"Om spends for real") is *exactly* a
counter that accrues, buffs the next roll, and lapses. A Breath Count effect with a counter badge,
plus `counterThresholds` (which already exists), covers §3.2 and §3.3 almost directly.

The wheel is a **modular-arithmetic check on two Form IDs** — trivial. This is a strong point in favour
of the wheel over a hand-authored 792-edge table, which would be a data-entry project.

---

## 7 — The punishment dial

The brief asks for skipping to hurt. Three settings; I'd ship the middle one and let the GM notes
mention the others.

| Setting | Skipping a step / Breaking does… | Feel |
| :---- | :---- | :---- |
| **Carrot only** | Nothing. You just don't get the chain bonus. | Safest, most forgiving, least interesting. New-player-proof. |
| **★ Reverse heightening** *(recommended)* | The Form functions at **rank −2 per link fallen**, min 1, and the Count resets. | Uses native PF2e machinery, automates cleanly, is *large* without being a condition. The Form still works — it just works like a worse slayer used it. That is the right fiction. |
| **Punitive** | Reverse heightening **plus** you're off-guard until your next turn / the Form has the *manipulate* trait and can be Disrupted. | For Forbidden Forms **only**. Applying this to ordinary Breaks makes the class miserable. |

The distinction I'd hold: **Breaking the wheel is a mistake and costs you the chain; using a Forbidden
Form unready is a sin and hurts you.** Don't blur them.

---

## 8 — Open questions that actually change the design

These are the forks where I'd want your call before writing a plan.

1. **Can you use more than one Form per turn?** My recommendation: yes, but only the first advances the
   Count. The alternative ("one Form per turn, full stop") is simpler and much easier to balance, but it
   makes the acceleration engine (§3.3) impossible and caps the chain at ~4 forever.
2. **Does a *miss* break the chain?** I say no, emphatically. But "the chain only advances on a hit" is a
   defensible harder-edged variant that makes accuracy investment matter enormously.
3. **Nine Forms for every style, or variable wheels?** Variable is better design *and* less writing, but
   it makes the styles harder to compare and complicates the monotonicity audit (§6 of the guide) that
   v4 worked hard to establish.
4. **Is Kamae chassis or feat?** Feat keeps the class approachable and makes prediction a *build*. Chassis
   makes it the class's identity from level 1 — which is arguably the actual point of the rework.
5. **Do we keep the 2100-point BCS budget and the monotonicity audit?** They're the reason v4 is
   trustworthy. Keeping them means every wheel and every Form gets re-audited, which is a large chunk of
   the work — but abandoning them means v5 is a vibes document and v4 wasn't.

---

## 9 — Skeleton of what a v5 would look like, one screen

```
CORE LOOP
  Enter stance (1 action, or free from L19).
  Each turn, use a Form. Where it sits on your style's wheel vs. the last Form decides:
      +1..+3  FLOWING   → Breath Count +1
      +4..+5  REACHING  → Breath Count +1, this Form at rank −2
      −1..−3  BROKEN    → Breath Count resets to 1, this Form at rank −2 per link fallen
  Breath Count adds +1 damage die per point to every Form, and buys actions at 3 and 6.
  At Count 6 you may use the Secret/Forbidden Form. It resets you to 0.

THE THREE THINGS THAT MAKE IT A CLASS
  Concentrated Breathing  — the floor. +2/+3/+4 precision per weapon die, unconditional.  (unchanged)
  The Wheel               — the economy. Position replaces points.
  Kamae                   — the verb. Call your next Form; be paid for being right.

WHAT DIED
  Breath Points, Refocus, "Frequency once per 10 minutes", the 3-Forms-per-encounter ceiling.

WHAT SURVIVED
  The 2100 ledger (re-spent, not re-sized). Concentrated Breathing. The Demon Slayer Mark
  (new benefits). Every Form's *flavour* — but not one of their numbers.
```

---

## 10 — My recommendation in one paragraph

Build **the wheel**, not the staircase. Take 1.a's tiers and use them only for *acquisition* (a feat
grants three Forms at once — this is a strict improvement on v4's feat tax) and for *rank gating*. Take
1.b's favourable/unfavourable graph and express it as **+1..+5 good, −1..−3 bad, wrapping**, which
reproduces every relationship the brief asks for in one sentence, needs no table, and automates in ten
lines. Track exactly **one number**, the Breath Count, and make it do all three jobs: escalating damage,
buying actions back, and gating the Secret Form. Put the prediction mechanic (**Kamae**) on a feat line,
make its failure case a *smaller reward* rather than a punishment, and let the level-16 feat pay you for
being deliberately wrong. Keep `Concentrated Breathing` untouched, because a build-up class needs a
floor more than a spike class does. And prototype on **three styles** before committing to eleven,
because §6.1 is the risk that actually kills this rework.

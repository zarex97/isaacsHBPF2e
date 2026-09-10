# Breath Slayer v5 — Combo Rework: Brainstorm

**Revision 2** — the four structural forks are now decided (§1). This revision reworks everything the
decisions touched, and it retracts one rule from revision 1 that the decisions proved incoherent.

*Working document. Still not a plan.*

**Premise from the design brief:** v4 is a well-costed martial that does not bring a *new verb* to the
table. Its pitch — "3 focus spells and a precision rider" — is the monk's pitch with a katana.
v5's verb is **combo'ing**: sequence matters, build-up pays, and the class rewards a player who is
thinking two forms ahead.

---

## 1 — Decisions taken

| Fork | Decision | Consequence |
| :---- | :---- | :---- |
| **Forms per turn** | **Unlimited — action economy is the only limit** | The largest consequence in the document. Forms stop being focus spells and become **martial actions**. See §2.4 and §4.3. |
| **Wheel size** | **Uniform 9 + Secret, all eleven styles** | 110 Forms. Style identity has to move from wheel *size* to wheel *topology* — §6. |
| **Kamae** | **Feat line from level 2** | The wheel alone carries the chassis. §5. |
| **Budget** | **Design first, cost it later** | The 2100 total stays a target; §7.3 keeps a running tally so the retrofit isn't brutal. |

---

## 2 — The four findings that drive everything else

### Finding 1 — A nine-link chain barely fits a Pathfinder fight, and only because of the decision above

PF2e encounters run **3–5 rounds**. Under revision 1's "one advance per turn," four rounds was four
links, and links 5–9 were decoration.

The **unlimited-Forms** decision fixes this outright. Three 1-action Forms in a turn is three links, so
Count 9 is reachable by **the end of round 3**. The nine-link wheel is now a real object rather than an
aspiration.

It fixes it *too well*, which is Finding 3.

### Finding 2 — Removing the pool removes the only throttle, and the numbers must come down hard

v4's damage budget is "3 Forms per encounter at 25–45 each" ≈ **90–110 points of Form damage per fight**,
on top of a full martial Strike routine and `Concentrated Breathing`.

Free Forms plus unlimited Forms per turn means a 4-round fight can produce **8–12 Forms**. At v4's
per-Form numbers that is not a buff, it is a different game.

**The chain replaces the pool as the economy: your resource is position, not points.** That is the new
verb and it is worth the work. But it means every printed number on all ~55 existing Forms comes down,
and §2.4 says how far.

### Finding 3 — Unlimited Forms *and* a per-Form chain bonus multiply, and the product is absurd

This is the one number worth doing on the page. Take the revision-1 rule (+1 damage die per point of
Breath Count, applied to every Form) with the unlimited-Forms decision:

| Round | Count reached (3 Forms/turn) | Chain bonus per Form | Chain damage that turn |
| :---- | ---: | ---: | ---: |
| 1 | 3 | +3d6 (10.5) | ~31 |
| 2 | 6 | +6d6 (21.0) | ~63 |
| 3 | 9 | +9d6 (31.5) | ~94 |
| 4 | 9 (cap) | +9d6 (31.5) | ~94 |

**≈280 points of chain bonus in four rounds, before a single Form's own printed damage.** Triple v4's
entire Form budget, from the rider alone.

The two multipliers cannot both be uncapped. Pick one:

| Option | Rule | Verdict |
| :---- | :---- | :---- |
| **★ Cap the payout** | Forms are unlimited and each one advances the Count, but **the chain bonus is spent once per turn, on a Form you nominate before rolling.** | **Recommended.** Fully honours the decision — you may still use three Forms — and it converts the cap into the best decision point in the class: *which* Form rides the wave. It also pairs perfectly with Kamae. Four-round total: ~74 points of chain bonus, i.e. *under* v4's Form budget, with the rest coming from the extra Forms' own riders. |
| **Cap the advance** | Every Form carries the full chain bonus, but the Count rises **once per turn**. | This is the option you rejected. Listed only so the tradeoff is visible: it caps the chain at ~4 links in a real fight and makes links 5–9 decoration again. |
| **Flatten the curve** | +1 die per **two** points of Count (max +4d6 or +5d6), applied to every Form. | Workable, and the simplest to explain. But a +4d6 ceiling makes the difference between Count 2 and Count 9 feel like nothing, which defeats the point of building up. |

I would ship **Cap the payout**. It is the only one of the three that keeps *both* halves of what you
asked for: many Forms per turn, and a build-up that visibly matters.

### Finding 4 — The wheel makes 1.b free, and this stands

"Each of 9 Forms has 5 favourable and 3 unfavourable successors" categorises **all eight** other Forms
for every Form: 72 ordered transitions per style × 11 styles = **792 authored relationships**, none of
which a table can hold in its head.

But 5 good + 3 bad + itself = 9. That is a **wheel**. Number the Forms 1–9 in a circle:

- **+1 to +5** around the wheel = favourable
- **−1 to −3** (i.e. +6 to +8) = unfavourable

One sentence reproduces all 792 entries, needs no table, and is a modular-arithmetic check on two Form
IDs to automate. **1.b was never a content problem; it was a notation problem.**

### 2.4 — What "unlimited Forms" really did: Forms are no longer focus spells

This deserves its own heading because it re-anchors the entire compendium.

A focus spell is priced as *a thing you do three times a fight*. An action you can take every turn,
several times, forever, is priced completely differently — and PF2e has a large, well-tested library of
exactly that. **Forms should be costed against martial class actions, not against focus spells.**

| Old anchor class | New anchor class |
| :---- | :---- |
| `Inner Upheaval` (monk, 1 FP) | Fighter `Knockdown`, `Combat Grab`, `Power Attack` |
| `Pulverizing Wake` (ranger 9, 1 FP) | Monk `Flurry of Blows`; Barbarian `Furious Strikes` |
| `All Shall End in Flames` (kineticist 18) | Swashbuckler finishers; Exemplar `Sever Four Dragonfly Wings` (free, at-will, MAP-neutral) |

Concretely, at level 20:

- an ordinary nichirin Strike is already ≈ **49 damage** (4d8 major striking + ability + weapon
  specialization + `Concentrated Breathing` +16);
- a **1-action Strike Form at Count 0** should therefore be ≈ **a Strike plus about +1d6 and a
  condition** — not v4's **+5d6**;
- a **2-action Form** should be worth about two Strikes;
- the Count is what carries it from there: nominated, at Count 9, that same 1-action Form is a Strike
  **+10d6**, which is where a v4 Second Form sits today.

**The base numbers roughly quarter. The chain buys it back, but only once a turn and only if you've
earned it.** That is the rescale job, stated honestly.

### 2.5 — The throttles are MAP and `flourish`, and they're both already in the system

The happy consequence of Forms-as-martial-actions is that PF2e already throttles martial actions, so
you don't have to invent anything:

- **Strike-based Forms take and increase MAP.** Three Forms in a turn is 0 / −5 / −10, exactly like
  three Strikes. Spam is self-punishing without a single new rule. **Design implication: the large
  majority of the 110 Forms should contain a Strike.**
- **Area Forms ignore MAP, so they need the other throttle.** Three 13d6 cones in one turn is ~136 AoE
  damage and it must be impossible. The fix is a keyword the system already has and several v4 Forms
  already carry: **`flourish` — once per turn.** Put it on every area Form, every multi-Strike Form,
  and the Secret Form.

That gives the shape: **unlimited small Strike Forms, one big Form per turn.** Which is both balanced
and a fair description of how the source material actually looks.

---

## 3 — Approaches 1.a and 1.b, evaluated

Kept from revision 1 because the reasoning still decides where each idea lands.

### 1.a — steps / tiers

**Good:** one universal rule, remembered instantly. Steps are a natural **acquisition** unit — a feat
granting *a whole step of three Forms* is fair at level 8, which is how 9 Forms end up costing **fewer**
feat slots than v4's 5 Forms cost now (§7.2). Reverse heightening is elegant and native — PF2e scales
everything by rank already. And tier-wide combo riders cut the writing from 110 blocks to 33.

**Bad:** it's a track, not a choice — once you know the order, every turn's optimal play is "next step,"
which is compliance rather than decision. Steps 1a/1b/1c are interchangeable openers, so you have one
real opener and eight dead options. And the chain terminates: after Step 3 there is nowhere to go.

**Verdict:** keep the tiers for **acquisition and rank-gating**. Don't make them the combo rule.

### 1.b — per-Form favourable/unfavourable successors

**Good:** an actual decision every turn, and a much better fiction model — nobody in *Kimetsu no Yaiba*
runs 1→2→3→4, they read the situation and pick the Form that answers it. It also gives every style a
topology to differ on, which is now the *only* place style identity can live (§6).

**Bad:** 792 relationships as literally specified. Unwritable, unplayable, and a data-entry project to
automate. Also, "the later in the chain, the more damage" needs a tracked number anyway, so you'd have a
count *and* a graph.

**Verdict:** the idea is right, the notation is wrong. Collapse it into the wheel, where the count *is*
the depth and the graph *is* one sentence.

---

## 4 — The system: **the Wheel and the Breath Count**

### 4.1 The nine Forms sit on a wheel

Each style's Forms are numbered **1–9** in a circle, plus a **Secret/Forbidden Form** off the wheel.
Compare the Form you're using to the **last Form you used**:

| Transition | Name | Effect |
| :---- | :---- | :---- |
| **+1, +2, +3** | **Flowing** | Breath Count **+1**. |
| **+4, +5** | **Reaching** | Breath Count **+1**, and the Form functions at **rank −2** (min 1). |
| **−1, −2, −3** (= +6/+7/+8) | **Broken** | Breath Count **resets to 1**, and the Form functions at **rank −2 per link fallen** (min 1). |
| **+0** (the same Form twice running) | **Stalled** | Legal, but no advance and no chain payout. |

Because the wheel **wraps**, a chain never terminates: 7 → 9 → 3 → 5 → 8 is a legal, escalating chain
five links deep. That solves 1.a's dead end and 1.b's table in one stroke — and it delivers the brief's
*"the later their position in the chain, the more damage"* keyed to **chain depth** rather than to the
Form's printed number, which is the reading that actually works at a table.

> **⚠ Retraction from revision 1.** Revision 1 said *"you may not use the same Form twice in one chain."*
> With a wrapping wheel and a chain that never resets, that rule forbids you from ever using Form 1
> again — it is incoherent. It also isn't needed: the wheel already punishes going backward, and MAP
> already punishes spam (§2.5). Replaced with **Stalled** above, which is the minimum viable
> anti-repeat rule: using the same Form twice running is allowed, it just pays nothing.

### 4.2 The Breath Count is the whole economy

**One tracked number, 0–9.** Up 1 per Flowing or Reaching Form; reset to 1 on a Break.

> **The chain payout.** Once per turn, on **one Form you nominate before rolling**, that Form deals
> **+1 damage die per point of Breath Count** (d6s; d8s from 9th, d10s from 17th), and its status
> bonuses increase by **+1 at Count 4** and **+2 at Count 7**.

Nominating is the class's signature decision: you have three Forms this turn and one wave to ride, so
you're choosing between riding it on the accurate Form, the area Form, or the one that sets up next turn.
It is also exactly what Kamae (§5) plugs into.

### 4.3 Depth buys actions

Less structurally necessary than it was in revision 1 — unlimited Forms already solved the pacing
problem — but still the most PF2e-native reward available, and now it's about *quality* of turn rather
than reachability:

| Breath Count | Effect |
| :---- | :---- |
| 3+ | Your **nominated** Form costs **1 fewer action** (minimum 1). |
| 6+ | Flowing transitions no longer trigger reactions; **Reaching** no longer takes the rank penalty. |
| 9 | Your nominated Form gains **+4 status to the attack roll**, or its basic save is treated as one degree worse. *(Placeholder — this rung wants playtesting.)* |

Note the interaction: **Count 3 turns a 2-action nominated Form into a 1-action Form**, so a deep chain
turn can be *three* Forms where a shallow one was two. The acceleration survives, routed through the
nomination.

### 4.4 What resets the chain

Be **stingy**. A build-up class whose build-up is easy to lose is a bad time.

| Event | Chain? | Rationale |
| :---- | :---- | :---- |
| Your Form **misses** | **Survives.** No advance, no reset. "You held the breath." | Miss-resets make the class feast-or-famine and unplayable at low levels. |
| A **Broken** transition | **Reset to 1** | The punishment the brief asks for — and it's chosen, not inflicted. |
| A **turn with no Form at all** | **−1 Count** | Soft decay. Preserves the Stride-heavy turn as an option. |
| You **leave your stance** | Reset to 0 | Unless you have the cross-style feat line (§6.2). |
| **Encounter ends** | Reset to 0 | Until L19 (§7.3). |
| **Stunned / paralysed / unconscious** | Reset to 0 | Fair, and dramatic. |

### 4.5 The Secret/Forbidden Form is the chain's payout

Replace v4's "Frequency once per 10 minutes" with an organic gate:

> **`flourish`** · **Requirement** Your Breath Count is **6 or higher**.
> **Effect** [the big thing]. **Your Breath Count then drops to 0.**

Strictly better than a timer: earned rather than granted, twice in a long fight if you're brilliant,
never if you've been sloppy. Keep v4's self-costs (Rengoku's self-damage, Dead Calm's off-guard) — they
now stack with losing the chain, which is the right weight.

With unlimited Forms, note the gate is reachable at the **end of round 2**. If that's too early, raise
it to 8, or require that no transition in the current chain was Broken — *"nine clean cuts."*

**Optional — the Forbidden use.** Allow it below Count 6: it works at **rank −2 per point you're short**
and you take the self-cost **twice**. The desperation button, and very on-genre.

---

## 5 — Kamae: the prediction mechanic

*構え — "the posture you take before the cut."* The most original idea in the brief and the one I'd
protect hardest. PF2e has almost no **declaration** mechanics; the Investigator's *Devise a Stratagem* is
the nearest thing and it isn't close.

Confirmed as a **feat line from level 2**, which is the right call: the wheel plus nomination is already
a full class, and this keeps prediction an opt-in *build* rather than a tax on everyone.

### 5.1 The shape

> **Kamae** ✦ **Free action** · **Trigger** You use a Form.
> Name a Form on your wheel. Until the end of your next turn you are *set* for that Form.
> - **Fulfilled:** it is **automatically your nominated Form** for that turn, it counts as **two links**
>   of Breath Count, and it costs 1 fewer action (min 1).
> - **Not fulfilled:** no benefit, and the transition is treated as **Reaching** even if it would have
>   been Flowing.

Counting as **two links** is what makes Kamae worth a feat under the nomination cap: the prediction build
climbs the Count at double speed, so it reaches the deep rungs a round earlier than a slayer who's just
improvising. That's a real mechanical identity, not a damage bump.

### 5.2 The trap to avoid

**A prediction mechanic must never leave you worse off than not predicting.** The enemy will die, move
out of reach, stun you, or turn out immune — none of that is the player's fault. If Kamae's downside is a
real penalty, the correct play becomes "never Kamae," and the mechanic is dead.

Take at least one safety valve:

- **Release** ✦ free action: cancel a Kamae before it resolves, no benefit and no penalty.
- **Loose Kamae:** name a **tier**, or an **arc of the wheel** ("any Form 4–6"), instead of one Form.
  Fulfilled far more often, pays slightly less. Probably the right *default*, with the exact call as the
  high-risk upgrade.

### 5.3 The ladder

| Lvl | Feat | Effect |
| :---- | :---- | :---- |
| 2 | **Kamae** | The base action, Loose only. |
| 6 | **Read the Thread** | Name an exact Form; payout rises to **three links** plus +2 status to the Form's attack or DC. |
| 10 | **Double Kamae** | Hold **two** Kamae at once; fulfil either. |
| 14 | **Kamae of the Unopened Eye** | Fulfilling a Kamae also grants one Strike as a free action. |
| 16 | **Feint the Form** | If your Kamae is **not** fulfilled but an enemy spent a Reaction or raised a Shield in response to it, the transition is Flowing anyway and that enemy is **off-guard** to you. |

**Feint the Form** is the best feat on the list and the whole class thesis in one paragraph: being wrong
on purpose, and being paid for it.

---

## 6 — Style identity, now that all eleven wheels are the same size

Uniform 9 + Secret removes the wheel-*size* dial that revision 1 leaned on (Thunder-as-5, Moon-as-11).
Identity has to come from **wheel topology** instead — *which* transitions are favourable, not how many
Forms there are. That turns out to be richer, and it costs **zero** additional writing: it's one line in
each style's header.

| Style | Flowing on | The idea |
| :---- | :---- | :---- |
| **Water** | +1 … +5 | The baseline. Water goes anywhere; nothing Reaches, only Breaks. |
| **Flame** | +1, +2, **+5** | Rewards the big leap. The others are Reaching. |
| **Thunder** | **+1 only — and it advances 2** | Zenitsu: one Form, perfected, unbelievably fast. Narrowest wheel, steepest climb. |
| **Wind** | odd steps (+1, +3, +5, +7) | Gusts. Skipping is the *correct* play. |
| **Stone** | +1 … +3; **a Break halves the Count instead of resetting** | The mountain doesn't fall over. |
| **Sound** | +1 … +4; **Count caps at 6, but +2 dice per point** | Fast burn, low ceiling. |
| **Flower** | +1 … +3; **completing a full lap pays out once per encounter** | The counter-duellist's long game. |
| **Mist** | +1 … +3; **Reaching never takes the rank penalty** | Mist has no edges. The forgiving style. |
| **Moon** | even steps (+2, +4, +6, +8) | Crescents. **+8 is −1**, so Moon flows into what Breaks everyone else — Kokushibo's geometry is wrong on purpose. |
| **Love** | +1 … +3; **each Flowing transition also pays an ally** | Love's outward-facing rider, expressed through the chain. |
| **Serpent** | **+1 and +8 (−1) only** | The snake coils both ways. Narrow, bidirectional, and it loops 9→1 instantly. |

Eleven genuinely different classes of turn, out of eleven single-line rules. Moon and Wind in particular
are *different games*, not different damage types — which is the thing the rework set out to fix.

### 6.2 Cross-style chaining is free design space

v4's `Flowing Stance Shift` (feat 4) already permits a secondary style. With a wheel, a whole feat line
opens: **the chain survives a stance change** when the Form you leave on and the Form you arrive on share
a number, a tier, or a damage type. That's Tanjiro's Hinokami Kagura pivot and Kokushibo's style-fusion,
and it's the natural home for a 12th-to-16th-level cluster.

---

## 7 — The costs, honestly

### 7.1 Content volume is the #1 risk, and the uniform-wheel decision raised it

**110 Forms.** v4 has 55. You are doubling the largest document in the repo *and* rewriting the half that
exists, because §2.4 forces a rescale on every Form that's already written. With wheel-size variation off
the table, the mitigations that remain are:

1. **Tier-wide riders, not per-Form riders.** Author "what a Flowing transition into this tier does" once
   per tier per style: **33 blocks, not 110.** This is now the single largest saving available.
2. **A fixed Form template.** Every Form is: action cost · Strike-or-area · one printed rider · tier.
   §2.4's rescale means the printed numbers are small and formulaic — most Forms are three lines, not the
   twelve that v4's Dead Calm runs to. Uniform wheels make a **template** viable in a way variable ones
   wouldn't have.
3. **Split v4's existing Forms rather than inventing.** Several v4 Forms are already tiered variants of
   each other (Water Wheel vs. Whirlpool). Nine slots absorb v4's five plus their obvious siblings.
4. **Prototype three styles first: Water, Thunder, Moon.** The baseline, the narrowest wheel, and the
   deliberately-wrong wheel. If the system works on those three it works on all eleven; if it doesn't,
   you've burned three styles' writing and not eleven. **This is the recommendation I'd hold hardest.**

### 7.2 Feat tax goes *down*, which is a real win

| | v4 | v5 (tier grants) |
| :---- | :---- | :---- |
| Forms known at 20 | 5 | **10** |
| Chassis grants | 2 Forms (L1, L5) | **2 tiers = 6 Forms** (L1, L5) |
| Feats spent on Forms | **3** (8 / 12 / 20) | **2** (a tier at 8, the Secret at 20) |

Granting Forms in **tiers of three** is the best structural argument for keeping 1.a's tiers, and it's
the answer to "110 Forms is too many to learn": you don't learn them one at a time.

### 7.3 The ledger — deferred, but keep the tally

"Design first, cost it later" is fine. The one guardrail: keep this table current as the design moves, so
the retrofit is arithmetic rather than archaeology. Removing Breath Points orphans **~160 points** of
v4's 690-point feature block.

| v4 feature | Pts | v5 replacement | Note |
| :---- | ---: | :---- | :---- |
| **Focused Breathing** (pool + First Form) | 10 | **Breath Cadence** — the Count engine + Tier 1 (3 Forms) | Underpriced now; it's the class engine. Take from below. |
| **Second Breath** (2nd point + Second Form) | 40 | Tier 2 (3 Forms) + the Count cap rises | ≈ neutral |
| **Nichirin Resonance** (3rd point) | 80 | Keep resistance/material bypass (50); spend 30 on **Reaching costs no rank** | ≈ neutral |
| **Total Concentration** (full Refocus) | 30 | Chain **persists 1 minute** past an encounter; out of combat, breathe for a minute to raise the Count | The pre-fight breath |
| **Breath of Instinct** (free 1-action Form) | 30 | 1/min, a Form neither consumes nor Breaks the chain | The get-out-of-a-Break card |
| **Demon Slayer Mark** (L13) | 110 | *Ignition* ("your next Form is free") is now meaningless → **every transition counts as Flowing** for 1 minute | Much stronger than what it replaces; price up |
| **Constant Total Concentration** (L19) | 150 | Keep the permanent stance; "+1 Breath Point on initiative" → **"you begin every encounter at Breath Count 3"** | Straight translation, beautiful capstone |
| **Concentrated Breathing** | 110 | **Unchanged. Do not touch it.** | A build-up class needs its floor *more* than v4 did — round 1 at Count 0 must still feel like a slayer |

### 7.4 Bookkeeping — the real cost of the unlimited-Forms decision

A player now tracks: stance, **Breath Count**, the wheel, the last Form used, a possible Kamae — and with
three Forms a turn, **three transitions to adjudicate per turn** instead of one. That is more than any
published PF2e martial except perhaps the Kineticist.

Non-negotiable mitigations:

- **One number written down.** Breath Count. Everything else is derived or on the card.
- **A printable wheel, one page per style.** This is a **design deliverable**, not an afterthought — the
  diagram is what makes the system legible, and with uniform 9-Form wheels it's the *same diagram*
  eleven times with different labels and a different favourable arc shaded. Uniformity pays for itself
  here.
- **Only the last Form is history.** Never let a rule depend on two Forms back.
- **Nomination is announced, once, out loud.** "This one rides the wave." It's one sentence a turn and it
  keeps the table synchronised.

### 7.5 Automation is genuinely feasible

The module already has the machinery: `scripts/riders/`, `scripts/outcomes/`, `scripts/economy/`, and the
Saint's Om-stack system (automation programme, §"Om spends for real") is *exactly* a counter that
accrues, buffs a nominated roll, and lapses. A Breath Count effect with a counter badge plus the existing
`counterThresholds` flag covers §4.2 and §4.3 nearly directly.

The wheel is **modular arithmetic on two Form IDs** — ten lines. Which is the whole argument for the
wheel over a hand-authored 792-edge table.

---

## 8 — The punishment dial

The brief asks for skipping to hurt. I'd ship the middle setting and put the others in the GM notes.

| Setting | A skip / Break does… | Feel |
| :---- | :---- | :---- |
| **Carrot only** | Nothing; you just don't get the chain bonus. | Safest, most forgiving, least interesting. |
| **★ Reverse heightening** | **Rank −2 per link fallen** (min 1), and the Count resets. | Native PF2e machinery, clean to automate, *large* without being a condition. The Form still works — it just works like a worse slayer used it. Right fiction. |
| **Punitive** | Reverse heightening **plus** off-guard until your next turn, or the Form gains `manipulate` and can be Disrupted. | **Forbidden Forms only.** Applied to ordinary Breaks it makes the class miserable. |

Hold this distinction: **Breaking the wheel is a mistake and costs you the chain; using a Forbidden Form
unready is a sin and hurts you.** Don't blur them.

---

## 9 — The system on one screen

```
CORE LOOP
  Enter stance (1 action; free from L19).
  Use as many Forms as your actions allow. Each is compared to the LAST Form used,
  on your style's 9-Form wheel:
      FLOWING   (style-specific arc, e.g. +1..+3)  → Breath Count +1
      REACHING  (the wider arc, e.g. +4..+5)       → Breath Count +1, this Form at rank -2
      BROKEN    (-1..-3)                           → Count resets to 1, rank -2 per link fallen
      STALLED   (+0)                               → nothing
  ONCE PER TURN, nominate one Form before rolling. It gets +1 damage die per point of
  Breath Count, and +1/+2 to its status bonuses at Count 4/7.
  At Count 3 the nominated Form costs 1 fewer action. At Count 6, Reaching is free.
  At Count 6 you may use the Secret/Forbidden Form; it resets you to 0.

THROTTLES  (all pre-existing PF2e machinery, no new rules)
  MAP           — most Forms contain a Strike, so 3 Forms/turn is 0 / -5 / -10.
  flourish      — every area Form, multi-Strike Form, and the Secret Form. One big Form per turn.
  the nomination — the chain pays once a turn, however many Forms you use.

THE THREE THINGS THAT MAKE IT A CLASS
  Concentrated Breathing — the floor.   +2/+3/+4 precision per weapon die, unconditional. (unchanged)
  The Wheel              — the economy. Position replaces points.
  Kamae (feat, L2)       — the verb.    Call your next Form; be paid for being right.

WHAT DIED
  Breath Points. Refocus. "Frequency once per 10 minutes." The 3-Forms-per-encounter ceiling.
  Forms as focus spells — they are martial actions now, and priced like fighter feats.

WHAT SURVIVED
  Concentrated Breathing. The Demon Slayer Mark (new benefits). The 2100 target (deferred).
  Every Form's flavour — and not one of their numbers.
```

---

## 10 — Recommendation in one paragraph

Build **the wheel**, not the staircase. Keep 1.a's tiers only for *acquisition* — a feat grants three
Forms at once, which is how 10 known Forms costs fewer slots than v4's 5 — and for rank gating. Express
1.b as **+1..+5 favourable, −1..−3 unfavourable, wrapping**, which reproduces all 792 relationships in
one sentence and automates in ten lines, and let each style differ by *which arc is favourable* rather
than by wheel size (§6 — this is where the eleven styles finally stop being damage-type reskins). Track
exactly one number. Then accept what unlimited Forms actually costs: **Forms are martial actions now, not
focus spells** — reprice them against fighter feats, put a Strike in most of them so MAP does the
throttling, put `flourish` on every area Form so one nova a turn is the ceiling, and **pay the chain
bonus once per turn on a Form you nominate**, which is both the balance lever and the best decision in
the class. Put Kamae on a feat line where it pays in *links* rather than damage, and make its failure
case a smaller reward rather than a punishment. Leave `Concentrated Breathing` alone. And prototype
**Water, Thunder, and Moon** before committing to eleven, because §7.1 is still the risk that kills this.

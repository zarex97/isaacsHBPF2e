# Soulbound Phase 5 — Quincy Spirits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The five Quincy Spirits with their full ladders — Antithesis, The Heat, The Balance, The Thunderbolt and The Miracle.

**Architecture:** No new machinery. Spell overlays carry Burner Finger's five fingers, `charges.mjs` carries Gerard's Miracle points, the `reaction` type carries Antithesis and The Balance, and Blut's authored `soulbound:blut-both` exception — written in Phase 2 so this file would never learn Uryū's name — is finally switched on by Letzt Stil.

**Tech Stack:** As Phase 4.

**Spec:** `Docs/superpowers/specs/2026-09-12-soulbound-design.md` (§5 phase 5); content from guide §7C.

## Global Constraints

All previous phases' constraints hold. The ones this phase will trip over:

- **Two `FlatModifier`s that share a label share a slug, and pf2e dedupes by slug.** One scaling rule, never a pair. Phase 4 learned this the hard way with Sonido.
- **A status bonus on the `speed` selector never reaches the total.** Use untyped there.
- **A Refined area widening is an `area-size` ItemAlteration on `Refined Release`**, not heightening.
- **`damage-dice-faces` steps once per `upgrade` with no value**; two steps is two rules.
- **Every Spirit carries** `soulbound-spirit`, `soulbound-spirit-<slug>` and `soulbound-lineage-quincy`.
- **Incapacitation is load-bearing** on Galvano Blast and Galvano Javelin — guide §7C says so explicitly, and the validator should be taught to check it.

---

### Task 1: Antithesis and The Thunderbolt

**Antithesis** (Uryū Ishida), guide §7C:

| Rung | Content |
| :-- | :-- |
| Schrift Form | Your bow takes its full shape: the spirit weapon gains the **Spirit Bow** profile if it lacked it, its damage die increases by one step, and its range increment increases to **100 feet**. You also gain **Seele Schneider**: the bow may be used as a melee weapon, **1d8 slashing**, **finesse**, whose Strikes **ignore resistance to slashing** |
| Release Technique | **Antithesis** [reaction] · **Trigger** you or an ally within 30 feet takes damage from a creature you can see. **Effect** the triggering creature takes **2d6 spirit**, and the target of the trigger gains **resistance equal to your level** against the triggering damage. **H(+2)** +1d6 |
| Refined (9th) | You additionally gain **Licht Regen** [2 actions] · 30-foot cone, basic Reflex, **6d6 piercing**; critical failures are **off-guard** until the start of your next turn. Base rank **5**, **H(+1)** +1d6 |
| Vollständig | **Quincy: Letzt Stil** — damage die **+2 steps**; Strikes ignore all resistances to physical and spirit damage and treat cover as one step less, **and this stacks with Blut Vene** — the one exception in the class; Licht Regen becomes a **60-foot cone**, usable once per round for free |

> **The cost is canon and real.** When Letzt Stil ends you lose your Schrift Form, your Release Technique, Licht Regen, Vollständig, and your **entire reiatsu pool** until you complete **24 hours of rest**. You keep your weapon, your proficiencies and your feats.

**The Thunderbolt** (Candice Catnipp):

| Rung | Content |
| :-- | :-- |
| Schrift Form | Spirit weapon becomes a sword of arcing electricity: **1d8 slashing**, versatile P, damage type **electricity**. **Electricity resistance equal to half your level.** Flash Step becomes an electricity-flavoured teleport: it ignores difficult terrain and you may pass through creatures' spaces, though you can't end there |
| Release Technique | **Galvano Blast** [2 actions] · 60-foot line, basic Reflex, **2d6 electricity**. Failures are **stunned 1**; critical failures **stunned 2**. **This carries the incapacitation trait.** **H(+1)** +1d6 |
| Refined (9th) | **Galvano Javelin** — 90 feet, one creature, ranged spell attack, **6d6 electricity** doubled on a critical hit, and **stunned 1** on a hit (incapacitation). Base rank **5**, **H(+1)** +1d6 |
| Vollständig | **Thunderbolt Form** — **fly Speed** equal to your Speed, **electricity immunity**, a **10-foot emanation** of live current dealing **3d6 electricity** (basic Reflex) to a creature that ends its turn in it, and once per round when you hit with your spirit weapon one other creature within 15 feet of the target takes **3d6 electricity** (basic Reflex) |

- [ ] **Steps:** author both; add a validator rule that Galvano Blast and Galvano Javelin carry `incapacitation`; tests; validate; commit.

---

### Task 2: The Heat and The Balance

**The Heat** (Bazz-B). One Release Technique with **five shapes**, each on its own standard ladder — spell overlays, the shape Cero Metralleta already proved.

| Fingers | Effect |
| :-- | :-- |
| **One** | 60 ft, one creature, ranged spell attack, **3d6 fire**, doubled on a crit |
| **Two** | 60 ft, **two** creatures, **2d6** each |
| **Three** | **30-foot line**, basic Reflex, **2d6 fire** |
| **Four** | **15-foot emanation**, basic Reflex, **2d6 fire**; failures take **1d4 persistent fire** |
| **Five** | **30-foot cone**, basic Reflex, **2d6 fire**; the ground becomes **difficult terrain** until the start of your next turn |

All five **H(+1)** +1d6. Schrift Form: damage type **fire**, **deadly d8**, **fire resistance equal to half your level**. Refined (9th) — **Deeper Burn**: treat your rank as one higher for Burner Finger only, and **Five** leaves burning terrain until the end of your next turn dealing 2d6 fire to a creature that enters or ends its turn there. Vollständig — **Deus Ex Machina**: **fly Speed**, **fire immunity**, **Five** becomes a 60-foot cone, and once per round when you damage a creature with fire it takes **2d6 persistent fire** whose flat check is **DC 20** rather than 15.

**The Balance** (Jugram Haschwalth):

| Rung | Content |
| :-- | :-- |
| Schrift Form | Spirit weapon becomes **Freund Schild**: **1d8 slashing**, versatile P, **parry**. You gain a **+1 circumstance bonus to AC** while you have at least 1 Reiatsu Point |
| Release Technique | **The Balance** [reaction] · **Trigger** you take damage from a creature or effect you can perceive. **Effect** reduce the damage by **twice your level**, then choose one enemy within 60 feet: it takes **2d6 spirit** and a **−1 status penalty to saving throws** until the end of its next turn. **H(+2)** +1d6 |
| Refined (9th) | The penalty applies to **AC and saving throws**, and if the triggering damage would have reduced you to 0 Hit Points you instead remain at **1 Hit Point**. That last clause functions **once per day** |
| Vollständig | **The Balance, at Night** — the reduction becomes **three times your level**; once per round you may redirect an ally's damage to yourself and apply the reduction as a free action without spending your reaction, even while it is spent; and **Sight of the Balance**: at the start of each of your turns choose one enemy within 60 feet — it takes a **−2 status penalty** to its next save, and the next ally to attack it gains a **+1 status bonus** to that attack roll |

> The AC bonus is the class's one flat numeric bonus, and it is a **circumstance** bonus on purpose so it collides with cover and Raise a Shield. It switches off the moment the pool is spent — which, given Rising Pressure, is most of a fight.

- [ ] **Steps:** author both; tests; validate; commit. Watch the AC bonus's predicate: "while you have at least 1 Reiatsu Point" must read the pool, not a roll option that is never set.

---

### Task 3: The Miracle

Gerard Valkyrie. Miracle points are `charges.mjs` with a different refresh rule.

| Rung | Content |
| :-- | :-- |
| Schrift Form | An enormous sword and shield of white reishi: **1d12 slashing**, two-handed, **forceful**, **shove**. Your maximum Hit Points increase by your level, and you gain a **+1 circumstance bonus** to saves against effects that would reduce your Hit Points to 0 |
| Release Technique | **The Miracle** [free-action] · **Trigger** you take damage from an enemy · **Frequency** once per round. Gain **2 Miracle points** (maximum 10). While you have 1 or more you gain **resistance to all damage equal to the number of Miracle points you have**. You may spend any number as a free action at the start of your turn; for each point spent, until the end of your turn your Strikes deal **+1d6** damage of their type. Points are lost when the encounter ends |
| Refined (9th) | **Blitz of the Hero** — maximum **15** points, and spending also grants a **+5-foot status bonus** to Speeds per point spent, to a maximum of +20, until the end of your turn |
| Vollständig | **Bailar de Valquiria** — **fast healing equal to your current Miracle points**; when reduced to 0 Hit Points while you have at least 5, you instead remain at **1 Hit Point**, lose 5 points, and your spirit weapon's damage die increases by one step for the rest of the encounter (any number of times); Miracle points are **no longer capped**, but you still gain only 2 per round |

> This is the class's only true "does not die" ability, and it is paid for in a resource the *enemy* controls: it only accrues while you are being hit, and each save costs half your maximum pool.

- [ ] **Steps:** the resistance scales with the badge's current value — check whether a `Resistance` value can read an effect's own badge, and if it cannot, say so and drive it from `charges.mjs` instead. The Speed bonus must be **untyped** (Phase 4's lesson) and a **single** scaling rule (Phase 4's other lesson).

---

### Task 4: Live verification

- [ ] Run all five Quincy Spirits at 1st through the rig.
- [ ] Confirm Letzt Stil switches on `soulbound:blut-both` and that Blut then permits Vene alongside it — the exception Phase 2 authored blind.
- [ ] Spend and accrue Miracle points; confirm the cap moves 10 → 15 with Refined and that resistance tracks the count.
- [ ] Confirm Galvano Blast carries incapacitation.
- [ ] Update the programme document and commit.

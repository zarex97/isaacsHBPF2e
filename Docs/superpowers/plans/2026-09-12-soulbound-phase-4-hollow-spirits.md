# Soulbound Phase 4 — Hollow Spirits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The five Hollow Spirits with their full ladders — Pantera, Murciélago, Arrogante, Los Lobos and Tiburón.

**Architecture:** No new machinery. Every mechanism this phase needs already exists: `charges.mjs` for Los Lobos' wolves, `flat-check` for Arrogante's decay, `reaction` where a Spirit wants one, the lingering-area flag for standing water and miasma, and `bypass` for resistance-piercing. The one genuinely new content shape is a **replaced spirit weapon** — four of these five Spirits swap the weapon rather than altering it — plus Pantera's pair of claw unarmed attacks.

**Tech Stack:** As Phase 3.

**Spec:** `Docs/superpowers/specs/2026-09-12-soulbound-design.md` (§5 phase 4); content from guide §7B.

## Global Constraints

All previous phases' constraints hold. The ones this phase leans on:

- **Base ranks by rung**: Release Technique **1**, Full Release technique **7**. Refined is a benefit applied by `Refined Release`, not a separate document, unless it is a genuinely new action.
- **A Refined area widening is an `area-size` ItemAlteration on `Refined Release`**, never `heightening.at`. Established in Phase 3.
- **`damage-dice-faces` steps once per `upgrade`, no value.** A value needs `override`.
- **`bypass` is an array of entries.**
- **Every Spirit carries** `soulbound-spirit`, `soulbound-spirit-<slug>` and `soulbound-lineage-hollow`.
- **Check every rule element's real spelling before authoring it.** Murciélago's "resistance to all damage except spirit" in particular: confirm whether pf2e's `Resistance` takes an `exceptions` field before inventing one.
- **Guide §5.2's Regeneración is a Lineage feature, not a Spirit one.** Murciélago's Segunda Etapa *doubles* it; it must alter the existing rule rather than declaring a second one.

---

### Task 1: Pantera and Murciélago

**Pantera**, guide §7B:

| Rung | Content |
| :-- | :-- |
| Resurrección | Two **claw** unarmed attacks: **1d8 slashing**, agile, finesse, brawling group. Speed **+10 feet** (stacks with Sonido) |
| Release Technique | **Garra de la Pantera** [2 actions] · 30-foot cone, basic Reflex, **2d6 piercing**; the area becomes **difficult terrain** for enemies until the start of your next turn. **H(+1)** +1d6 |
| Refined (9th) | Claws' damage die → **1d10**; after using Garra de la Pantera you may **Step** as a free action |
| Segunda Etapa | Speed **+10** more; claws gain **deadly d10**. Once per round when you critically hit with a claw, make an additional claw Strike at your current MAP. Garra's cone → **60 feet**, and critical failures take **2d6 persistent bleed** |

> Canon gives Grimmjow no Segunda Etapa — Ulquiorra is explicitly the only Espada who reached one. The *technique* Desgarrón is canon and is placed at his Final Release in Phase 6; this form is invented and is deliberately the least transformative of the five.

**Murciélago**, guide §7B:

| Rung | Content |
| :-- | :-- |
| Resurrección | **Fly Speed** equal to your Speed. Spirit weapon becomes **Luz de la Luna**: **1d10 piercing**, versatile S, **reach**, re-forms in your hand instantly if thrown or dropped |
| Release Technique | **Cero Oscuras** [2 actions] · 90 feet, one creature, **ranged spell attack**, **3d6 spirit**, doubled on a critical hit. **H(+1)** +1d6 |
| Refined (9th) | On a critical hit the target is **off-guard** until the start of your next turn, and Cero Oscuras gains a **5-foot burst** at the target's location dealing half damage to other creatures (basic Reflex) |
| Segunda Etapa | **The only canon Segunda Etapa in the series.** Fly Speed **+20**; **resistance to all damage except spirit equal to half your level**; Regeneración's fast healing **doubles** and restores lost limbs; you gain **Lanza del Relámpago** |

**Lanza del Relámpago** [2 actions] · **Frequency** once per round · range 120 feet. Ranged spell attack; on a hit **5d6 electricity** (doubled on a critical hit). Whether or not you hit, it detonates in a **15-foot burst** at that point for **5d6 fire**, basic Reflex. **H(+1)** +1d6 to both.

- [ ] **Step 1:** confirm how pf2e expresses "resistance to all damage except X" — read the `Resistance` rule element's schema for an `exceptions` field. **If there is none, say so and author the honest approximation**, recording it for guide v1.4 rather than shipping a rule that silently resists everything.
- [ ] **Step 2:** write both Spirits, their weapons and effects.
- [ ] **Step 3:** tests, validate, commit.

---

### Task 2: Arrogante and Tiburón

**Arrogante**, guide §7B:

| Rung | Content |
| :-- | :-- |
| Resurrección | Spirit weapon becomes **Gran Caída**: **1d12 slashing**, two-handed, sweep, forceful. Immune to **disease** and **poison**, and the doomed condition never rises above 1 |
| Release Technique | **Respira** [2 actions] · 15-foot emanation, basic Fortitude, **2d6 void**. Failure: **enfeebled 1** for 1 minute. Critical failure: **enfeebled 2** and **clumsy 1**. The miasma lingers: until the start of your next turn, an enemy that enters or ends its turn in the area takes **1d6 void** with no save. **H(+1)** +1d6, and +1d6 lingering at every other increment |
| Refined (9th) | Emanation → **20 feet**; objects and unattended structures in the area are **broken**; a creature that critically fails also can't regain Hit Points until the end of its next turn |
| Segunda Etapa | **Respira Absoluta** — the emanation becomes permanent and free at **20 feet**. Enemies that end their turn in it take **3d6 void** (basic Fortitude) and are **enfeebled 1** for 1 round on a failure. A creature within the emanation that targets you with an attack or a spell must succeed at a **DC 5 flat check** or it ages to nothing; a creature that succeeds is temporarily immune for 1 minute |

**Tiburón**, guide §7B:

| Rung | Content |
| :-- | :-- |
| Resurrección | Spirit weapon becomes a broad hollow-edged blade: **1d12 slashing**, two-handed, sweep. **Swim Speed** equal to your Speed, you can breathe water, and you can create water freely |
| Release Technique | **La Gota** [2 actions] · 30-foot cone, basic Reflex, **2d6 slashing**; creatures that fail are **pushed 10 feet** away. **H(+1)** +1d6 |
| Refined (9th) | **Cascada** — cone → **40 feet**, critical failures fall **prone**, and the area becomes **difficult terrain** from standing water |
| Segunda Etapa | **Hirviendo** — a **20-foot emanation** of water, difficult terrain for enemies. Once per round when you hit with your spirit weapon you may push the target 5 feet. La Gota may be used as a **60-foot line**. You also gain **Trident** and **Hirviendo** |

**Trident** [2 actions] · **Frequency** once per round. Make **three** ranged Strikes with your spirit weapon against one creature within 60 feet, each at your current multiple attack penalty; **the penalty does not increase until all three are made.** → the existing `strikes` apply type, which already does exactly this for Pleiades Nova.

**Hirviendo** [free-action], once per round: all water and ice within your emanation — including that created by other creatures, and effects with the water or cold trait that create terrain — is destroyed, and each enemy in the emanation takes **2d6 fire**.

- [ ] **Steps:** as Task 1. Arrogante's flat check uses the `flat-check` type; Trident uses `strikes`.

---

### Task 3: Los Lobos

| Rung | Content |
| :-- | :-- |
| Resurrección | Spirit weapon splits into **two ornate pistols**: **1d6 piercing**, agile, range increment **60 feet**, reload 0, no ammunition. You may wield and fire both. Speed **+5 feet** |
| Release Technique | **Cero Metralleta** [2 actions] · **60-foot cone**, basic Reflex, **2d6 force**. You may instead shape it as a **120-foot line**. **H(+1)** +1d6 |
| Refined (9th) | You may **Sustain** at the start of your next turn to fire it again in a different direction without spending a Reiatsu Point |
| Segunda Etapa | **Colmillo** — **eight spirit wolves** appear in unoccupied squares within 30 feet |

The wolves are **not creatures**: no statistics, no actions, cannot be attacked, do not flank. They are a resource — `charges.mjs`, the mechanism Hyōrinmaru's petal-flowers already proved.

**Colmillo** [1 action] · **Requirements** at least one wolf remains. Expend any number of wolves; each moves to a point within 60 feet and detonates in a **10-foot burst** for **3d6 force**, basic Reflex. A creature in more than one burst takes damage only from the highest. **H(+1)** +1d6. At the start of each of your turns you regain 1 wolf, to a maximum of eight.

- [ ] **Step 1:** the cone-or-line choice is a **spell variant** (`system.overlays`), the shape the spec named for Burner Finger. If overlays turn out not to express it, author it as the description plus a GM note and record the limitation — do not fake it with a second document pretending to be the same spell.
- [ ] **Step 2:** the "damage only from the highest burst" clause is the existing `overlap` flag, which Lightning Crown already uses for stacked areas. Read it before inventing anything.
- [ ] **Step 3:** tests, validate, commit.

---

### Task 4: Live verification

- [ ] Run all five Hollow Spirits at 1st through the rig.
- [ ] Take one to 13th and confirm its Segunda Etapa lands.
- [ ] Spend Los Lobos' wolves down and confirm the per-turn regain.
- [ ] Confirm Hierro still applies alongside a Spirit's own resistances, and that Murciélago's Segunda Etapa doubles Regeneración rather than adding a second fast healing.
- [ ] Update the programme document and commit.

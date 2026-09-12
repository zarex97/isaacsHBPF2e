# Soulbound Phase 3 — Soul Reaper Spirits Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The Spirit axis, and the five Soul Reaper Spirits with their full four-rung ladders — Senbonzakura, Zangetsu, Hyōrinmaru, Ryūjin Jakka and Kyōka Suigetsu.

**Architecture:** Spirit is a third `ChoiceSet`, filtered by the Lineage already chosen. Each Spirit item grants a Released Form, a Release Technique and a Full Release, level-gated with the `gte: self:level` pattern. Two mechanisms are built here because two later phases reuse them: a **mode switch** (Senbonzakura's Gokei/Senkei, Zanka no Tachi's four aspects, later Burner Finger's five fingers) and a **charge pool** (Hyōrinmaru's petal-flowers, later Los Lobos' wolves and Gerard's Miracle points).

**Tech Stack:** As Phase 2.

**Spec:** `Docs/superpowers/specs/2026-09-12-soulbound-design.md` (§2.4, §5 phase 3)

## Global Constraints

Phase 1 and 2's constraints all still apply. Restating the ones this phase will trip over:

- **Base ranks are fixed by rung** (guide §7 preamble): Release Technique **1**, Refined **5**, Full Release technique **7**. The validator enforces it via the `sb-tier-*` tag.
- **`itemType` on every ChoiceSet** that wants anything but a feat.
- **A ChoiceSet resolves once**, at the creation of the item carrying it. Anything gained later is its own feature, granted with `reevaluateOnUpdate`.
- **No foreign `Compendium.pf2e.*` reference** unless it is in `build/lib/pf2e-uuids.json`.
- **Before authoring any rule element or predicate, check its real spelling** against `pf2e-14-dev`. Four of this programme's bugs so far were plausible spellings that were never true.
- **A Spirit's ladder is 4 rungs**: Released Form (1), Release Technique (1), Refined (9), Full Release (13). The Severing Art is Phase 6's and is NOT authored here.
- **Every Spirit document carries `soulbound-spirit` and `soulbound-spirit-<slug>`** otherTags, plus `soulbound-lineage-soul-reaper` so the Lineage filter can find it.

---

### Task 1: The Spirit axis

**Files:**
- Create: `content/soulbound-class-features/core/spirit.json`
- Modify: `content/soulbound-class-features/core/released-form.json`, `build/lib/validate-lib.mjs`, `build/test-soulbound.mjs`

**Interfaces:**
- Produces: a `Spirit` ChoiceSet at level 1 whose filter is `item:tag:soulbound-spirit` **plus the chosen Lineage's tag**, so a Hollow is never offered Hyōrinmaru.

- [ ] **Step 1: Prove the chained filter resolves, before five Spirits depend on it**

This is the risk the design named in §3.1. A ChoiceSet filter is a predicate, and it must be able to read the Lineage selection made by a *different* feature.

Write a throwaway probe in the live world: a feature with a ChoiceSet filtering on `item:tag:soulbound-spirit` and an injected `{item|flags.system.rulesSelections.lineage}`, on an actor that has already chosen a Lineage. Confirm the prompt offers only that Lineage's Spirits.

**If the injection does not resolve across features**, fall back to what the spec already names: three per-Lineage Spirit features (`Spirit (Soul Reaper)`, etc.), each granted by its own Lineage item and filtering on that Lineage's tag alone. More documents, identical player experience. Record which path was taken in the commit.

- [ ] **Step 2: Write the failing test**

```js
const spiritFeature = featureDoc("spirit");
const spiritChoice = spiritFeature.system.rules.find((r) => r.key === "ChoiceSet");
check(
    "Spirit is chosen at 1st level from the tagged Spirits, filtered by Lineage",
    [spiritFeature.system.level.value, spiritChoice?.flag, spiritChoice?.choices?.itemType],
    [1, "spirit", "feat"],
);
check(
    "and the filter narrows by the Lineage already chosen — a Hollow is never offered Hyōrinmaru",
    JSON.stringify(spiritChoice.choices.filter).includes("soulbound-lineage-"),
    true,
);
```

- [ ] **Step 3: Author it, run, and commit**

`Released Form` grants `Spirit`; the class item already grants `Released Form`.

---

### Task 2: Senbonzakura — and the mode switch

Byakuya Kuchiki. Guide §7A. Establishes the emanation Release Technique and the **mode switch** that Zanka no Tachi and Burner Finger reuse.

**Files:**
- Create: `content/soulbound-class-features/spirits/senbonzakura.json`, `senbonzakura-shikai.json`, `senbonzakura-bankai.json`
- Create: `content/soulbound-techniques/senbonzakura.json`
- Create: `content/soulbound-effects/effect-senbonzakura-shikai.json`, `effect-senbonzakura-kageyoshi.json`, `effect-gokei.json`, `effect-senkei.json`
- Create: `scripts/soulbound/modes.mjs`
- Modify: `scripts/isaacs-hb.mjs`, `build/test-soulbound.mjs`

**The numbers, from guide §7A:**

| Rung | Content |
| :-- | :-- |
| Shikai Form | Strikes gain **reach 15 feet**, lose two-hand and twin; Strikes are **not affected by cover** between you and the target |
| Release Technique | **Senbonzakura** [2 actions] · 15-foot emanation, basic Reflex, **2d6 slashing**; the area is **difficult terrain** for enemies until the start of your next turn. **H(+1)** +1d6 |
| Refined (9th) | Emanation → **20 feet**; creatures that critically fail are **off-guard** until the start of your next turn |
| Full Release (13th) | **Senbonzakura Kageyoshi** — a second **20-foot emanation** centred within 60 feet. At the start of each of your turns, each enemy in **either** emanation takes **5d6** slashing (basic Reflex). **Sustain** once per round to move the second emanation up to 30 feet, or to switch mode |

Modes:

- **Gokei** — the second emanation shrinks to a **10-foot burst** on one enemy; that enemy takes **double** damage and cannot benefit from cover or concealment against it.
- **Senkei** — a 20-foot cage around you and one enemy; neither can leave; your Strikes against that enemy **ignore all resistances**; one extra Strike each round at your current MAP. **You lose Senbonzakura's reach and cover-ignoring**, and cannot target enemies outside the cage.

- [ ] **Step 1: Write `scripts/soulbound/modes.mjs`**

One named mode at a time, chosen from a card, applied as an effect and removed when another is picked. The decision half is pure and tested:

```js
/**
 * A mode switch: one of N named states, exactly one at a time.
 *
 * Three abilities want this and they want it identically — Senbonzakura Kageyoshi's Gokei and Senkei,
 * Zanka no Tachi's four cardinal aspects, and Burner Finger's five fingers. Each is "Sustain to change
 * which one you are in", and the only thing that differs is the list.
 *
 * Modelled on Blut, which is the same shape with two options and a free action instead of a Sustain.
 */
export function nextMode({ current, wanted, available }) {
    if (!available.includes(wanted)) return current;
    return wanted;
}
```

plus `Modes.set(actor, family, mode)` applying the effect named for that mode and removing its siblings, and `Modes.active(actor, family)`.

- [ ] **Step 2: Write the failing tests, then the content**

The Bankai's per-turn damage is a `turn-start` area rider, the shape the Full Release pressure emanation already uses. The Senkei extra Strike is the existing `strikes` apply type. Gokei's "double damage" is a `multiplier` on a damage rider — **check `validateRider` for the spelling before authoring**.

- [ ] **Step 3: Validate, test, commit**

---

### Task 3: Hyōrinmaru — and the charge pool

Tōshirō Hitsugaya. Establishes the **charge pool** that Los Lobos' wolves and Gerard's Miracle points reuse.

**Files:**
- Create: the Spirit, Shikai, Bankai features; `content/soulbound-techniques/ryusenka.json`, `sennen-hyoro.json`, `hyoryu-senbi.json`, `zanhyo-ningyo.json`; the effects
- Create: `scripts/soulbound/charges.mjs`
- Modify: `scripts/isaacs-hb.mjs`, `build/test-soulbound.mjs`

**The numbers, from guide §7A:**

| Rung | Content |
| :-- | :-- |
| Shikai | Damage type becomes **cold** (spirit still available). On a critical hit, the target takes a **−5-foot status penalty** to Speeds until the end of your next turn |
| Release Technique | **Ryūsenka** [2 actions] · Strike; on a hit **+1d6 cold** and a Fortitude save or **immobilized** until the end of its next turn (Escape vs Reiatsu DC). On a critical hit: **+2d6 cold** and **off-guard** instead. **H(+2)** +1d6 |
| Refined (9th) | **Guncho Tsurara** — Ryūsenka may be made as a **ranged** Strike within 60 feet; the blade returns immediately |
| Full Release (13th) | **Daiguren Hyōrinmaru** — **fly Speed** equal to your Speed, **cold resistance equal to your level**, and **three petal-flowers**. Spend one per round for Sennen Hyōrō, Hyōryū Senbi or Zanhyō Ningyō |
| Perfected (17th) | Restore one spent petal-flower at the start of each of your turns |

The three petal abilities:

- **Sennen Hyōrō** — 20-foot burst within 60 feet, Reflex. Failure: **5d6 cold** and immobilized until the end of its next turn. Critical failure: **restrained** for 1 minute instead (Escape vs Reiatsu DC). **H(+1)** +1d6.
- **Hyōryū Senbi** — 60-foot line, basic Reflex, **5d6 cold**; creatures that fail are **slowed 1** until the end of their next turn. **H(+1)** +1d6.
- **Zanhyō Ningyō** — [reaction] when you are hit by an attack: reduce the damage by **twice your level**; the doll shatters.

- [ ] **Step 1: Write `scripts/soulbound/charges.mjs`**

The pure arithmetic first — this is the part three Spirits share and the part that silently goes wrong:

```js
/**
 * A charge pool: N of something, spent and regained on a schedule.
 *
 * Hyōrinmaru's three petal-flowers, Los Lobos' eight wolves and Gerard's Miracle points are the same
 * mechanism with different numbers and different refresh rules. Kept pure so "how many do I have" is
 * never a question about Foundry.
 */
export function afterSpend({ held, spending, perRound, spentThisRound }) { … }
export function afterRefresh({ held, max, regain }) { … }
```

Charges live in an effect's **counter badge**, which is what the rider engine's `effect` apply type with `stack: true` already walks up and down — read `applyEffect` before inventing storage.

- [ ] **Step 2: Content, tests, commit**

Zanhyō Ningyō is a **reaction**, so it uses the `reaction` apply type built in Phase 2. Its damage reduction is `twice your level` — check whether a `Resistance` rule with a formula on a one-round effect is the right expression, or whether the reaction should apply a flat reduction.

---

### Task 4: Zangetsu

Ichigo Kurosaki. The simplest ladder, and the one that tests "always released".

| Rung | Content |
| :-- | :-- |
| Release | **None.** Zangetsu is never sealed: the first Release each encounter is free **and requires no action** |
| Shikai | Damage die **+1 step**; gains **two-handed d12** if it had no two-handed trait |
| Release Technique | **Getsuga Tenshō** [2 actions] · 30-foot line, basic Reflex, **2d6 spirit**. **H(+1)** +1d6 |
| Refined (9th) | **Kuroi Getsuga** — line → **60 feet**, ignores resistance to spirit, critical failure takes **1d6 persistent spirit** |
| Full Release (13th) | **Tensa Zangetsu** — damage die does **not** increase (overriding Full Release's normal step). Instead: **+10-foot status** to all Speeds, Flash Step's frequency becomes **twice per round**, Getsuga Tenshō becomes **1 action** with a 60-foot line (90 with Refined), and the first time each round you hit with your spirit weapon you may **Step** as a free action |

- [ ] **Steps:** the die-step override is an `ItemAlteration`; Flash Step's doubled frequency is another. Both must be checked against the real `ItemAlteration` properties — `frequency-max` was used in Phase 1 for Unsealed and is the proven spelling.

---

### Task 5: Ryūjin Jakka

Yamamoto. Reuses Task 2's mode switch for its four cardinal aspects, and is the only thing in the class that damages your own party.

| Rung | Content |
| :-- | :-- |
| Shikai | Damage type **fire**, gains **deadly d8**, **fire resistance equal to half your level** |
| Release Technique | **Ennetsu Jigoku** [2 actions] · 15-foot emanation, basic Reflex, **2d6 fire**; creatures that fail also take **1d4 persistent fire**. **H(+1)** +1d6, and +1 persistent die at every other increment |
| Refined (9th) | Emanation → **20 feet**; the ground in it becomes **difficult terrain** until the end of your next turn |
| Full Release (13th) | **Zanka no Tachi** — damage die **+2 steps**; you **lose** your fire resistance; at the start of each of your turns every creature other than you within 30 feet, **allies included**, takes **1d6 fire** with no save. Sustain once per round to select one aspect |

The four aspects are in guide §7A and are authored verbatim. **Kita's damage cannot be reduced by fire resistance, Blut Vene or Hierro** — that is the only unresistable damage in the class, and it goes through `scripts/riders/bypass.mjs`.

> **The friendly fire is deliberate and canon.** Guide §7A names the table-side fix (exempt allies, one die step instead of two); it goes in the handbook as a variant, never in the default content.

---

### Task 6: Kyōka Suigetsu — and the hypnosis register

Aizen. The one Spirit whose effect is keyed to an event in the observer's past, which no rule element can express.

**Files:**
- Create: `scripts/soulbound/hypnosis.mjs` plus the Spirit's documents
- Modify: `scripts/isaacs-hb.mjs`, `build/test-soulbound.mjs`

The register holds, per observer: whether they have seen a Shikai release, what they rolled, and which immunity window they are in — **10 minutes** on a success, **24 hours** on a critical success, **permanent victim** on a critical failure (hypnotized for 1 hour, and once per encounter thereafter automatically hypnotized when you Release). A creature that cannot see is unaffected entirely.

The displaced image is a **DC 5 flat check** (DC 6 with Refined) — the `flat-check` apply type from Phase 2.

- [ ] **Steps:** pure register logic tested without Foundry (`windowFor(outcome)` → `{ immuneFor, hypnotizedFor }`), then the content.

---

### Task 7: Live verification

- [ ] **Step 1:** extend the rig with a `spirit` dimension and per-Spirit assertions at 1 / 9 / 13 / 17.
- [ ] **Step 2:** run all five Soul Reaper Spirits 1→20.
- [ ] **Step 3:** cast each Release Technique and confirm dice, area, save and riders; confirm the reiatsu pool is now non-zero from 1st level, since a Release Technique is a costed focus effect.
- [ ] **Step 4:** spend all three of Hyōrinmaru's petal-flowers and confirm the fourth is refused; confirm Perfected restores one per turn.
- [ ] **Step 5:** switch Senbonzakura Kageyoshi between Gokei and Senkei and confirm exactly one is ever active.
- [ ] **Step 6:** update `Docs/soulbound-automation-programme.md` with a Phase 3 section and commit.

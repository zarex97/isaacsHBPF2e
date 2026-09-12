# Soulbound Phase 6 — Feats and Final Release Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The class feat spine, the Zanjutsu family, Borrowed Nature at three tiers, Severance with its Waning decay and fifteen Severing Arts, the handbook journal, and guide v1.4 — closing the two items earlier phases left open.

**Architecture:** One new module, `severance.mjs`, for the Waning table and the power-loss state. Everything else reuses what exists: `charges.mjs`, `modes.mjs`, the `reaction` and `flat-check` types, `bypass`, `strikes`, and the `counteract` type that Seal the Art's suppression will finally extend.

**Tech Stack:** As Phase 5.

**Spec:** `Docs/superpowers/specs/2026-09-12-soulbound-design.md` (§5 phase 6); content from guide §8 and §9.

## Global Constraints

Everything learned so far, restated because this phase touches all of it:

- **One scaling `FlatModifier`, never a pair sharing a label** — pf2e dedupes by slug, and a label is a slug.
- **Untyped, not status, on the `speed` selector.**
- **`damage-dice-faces` steps once per `upgrade`, no value.**
- **`bypass` is an array.** `@`-paths resolve; JavaScript does not.
- **A Refined widening is an `area-size` alteration on the feature that grants it.**
- **A tag is an instruction.** A mechanism that obeys its data will faithfully carry out a mistake in the data — check what a tag *causes* before adding it.
- **A deferred fix needs a deferred assertion.**
- **Class feats carry the `soulbound` trait and `category: "class"`**; the validator already enforces it.
- **Lineage-gated feats must carry a real prerequisite**, and `Additional Kidō` must be refused to Hollow and Quincy — guide §6.6 calls that the hard ceiling.

---

### Task 1: The feat spine, levels 1–4

Guide §8.1 and §8.2. Seventeen feats.

**1st:** Additional Kidō **[SR]** · Sheathed Draw · Reader of Threads · Zanjutsu Footwork · Pesquisa **[H]** · Hirenkyaku Drill **[Q]** · Twin Fang

**2nd:** Pressure Flare · Guard the Threshold · Kidō Focus · Rapid Bala **[H]** · Gintō Reserve **[Q]**

**4th:** Shunpo Strike · Reiatsu Barrier · Chain Anchor · Deep Breath · Cero Doble **[H]**

- [ ] **Step 1:** add a validator rule that a `[SR]`/`[H]`/`[Q]` feat carries a prerequisite naming its Lineage, and that `Additional Kidō` names Soul Reaper.
- [ ] **Step 2:** author; `Guard the Threshold` and `Reiatsu Barrier` are reactions and use the Phase 2 type.
- [ ] **Step 3:** tests, validate, commit.

---

### Task 2: The feat spine, levels 6–20, and Zanjutsu

Guide §8.3, §8.4 and §8.5.

**6th:** Kidō Combination · Reactive Strike · Cut the Cord · Borrowed Nature · Blut Discipline **[Q]** · Descorrer **[H]**
**8th:** Rising Tide · Pressure Crush · Zanjutsu: Hakuda **[SR]**
**10th:** Perfected Technique · Ghost Step · Reishi Mastery **[Q]**
**12th:** Soul Sever · Kidō Mastery · Segunda Piel Temprana **[H]** · Deeper Crossing
**14th:** Instant Full Release · Twin Pressure · Vollständig Endurance **[Q]**
**16th:** Unbroken Chain · Reiatsu Flood
**18th:** Beyond the Blade · Second Nature
**20th:** Final Release

> **Reactive Strike is granted under its published pf2e name**, so the existing compendium item automates as-is. It goes in `build/lib/pf2e-uuids.json` like every other foreign reference.

**Zanjutsu techniques** (§8.4), Soul Reaper only, each costing 1 Reiatsu Point and requiring a released weapon:

| Lvl | Technique | Act. | Effect | Rank |
| --: | :-- | --: | :-- | --: |
| 5 | **Sōkotsu** | 2 | Two Strikes against one creature; the second doesn't increase MAP. Each hit deals **+1d6**. **H(+2)** +1d6 | 2 |
| 5 | **Hitotsume: Nadegiri** | 2 | Stride, then one Strike dealing **+1d6**; on a hit the target is **off-guard** until the end of your turn. **H(+2)** +1d6 | 2 |
| 8 | **Shitonegaeshi** | 1 | A Strike dealing **+1d6**; on a hit you may Step as a free action and the target can't Step until the end of its next turn. **H(+2)** +1d6 | 4 |
| 10 | **Nadegiri** | 2 | One Strike against **each** enemy in your reach, all at your current MAP; the penalty doesn't increase until all are made | 6 |
| 12 | **Ikkotsu** | 2 | One Strike dealing **+4d6**; on a critical hit the target is **stunned 1** (incapacitation). **H(+1)** +1d6 | 6 |
| 14 | **Zanjutsu: Kendō** | 2 | One Strike. Before rolling, choose: it ignores all resistances and immunities to its damage type, **or** it treats the target's AC as 2 lower. On a hit, **+5d6**. **H(+1)** +1d6 | 8 |

`Nadegiri` and `Sōkotsu` use the `strikes` type; `Zanjutsu: Kendō`'s either/or is a **mode switch** or two spell variants — pick whichever expresses "choose before rolling" honestly, and say which.

- [ ] **Steps:** author; the `Zanjutsu` Lineage feature grants one free choice from this family, closing the placeholder Phase 2 left; tests; validate; commit.

---

### Task 3: Borrowed Nature

Guide §8.6. Three feats and three Aspects at two tiers each.

> **BORROWED NATURE** (6) — choose a Lineage other than your own; **permanent**. You learn that Lineage's free cantrip kidō and it costs you nothing. You gain **Don the Other Face** [1 action] (concentrate, reiatsu), **Cost** 1 Reiatsu Point, **Frequency** once per encounter: for 1 minute you gain the borrowed Lineage's **Aspect**, and take a **−1 status penalty to Will saves** while it is on.

| Aspect | 6th-level | 12th-level (Deeper Crossing) |
| :-- | :-- | :-- |
| **Soul Reaper's Discipline** | Learn **one** kidō permanently, usable at normal cost. While the Face is on, **every kidō you know costs no Reiatsu Point** | A **second** kidō, and destruction kidō deal one additional die |
| **Hollow's Mask** | Temporary HP equal to your level, **resistance to physical equal to a quarter of your level** (min 1), **+5-foot** status bonus to Speeds | Temp HP **twice** your level, resistance **half** your level, **+10 feet** |
| **Quincy's Discipline** | **Blut** as a free action once per round, except Vene grants resistance equal to a **quarter** of your level. Your ranged Strikes ignore the target's cover | Vene's resistance becomes **half** your level, and once per encounter you may use **Seal the Art** |

**SECOND NATURE** (18) — your **6th-level** Aspect is always active: no action, no point, no duration, **no Will penalty**. Donning the Other Face still upgrades you to the Deeper Crossing numbers twice per encounter.

- [ ] **Steps:** the Speed bonuses are untyped and single scaling rules. The borrowed cantrip is a `ChoiceSet` over the three free cantrips, on its own feature so it is asked once.

---

### Task 4: Severance, the Waning table, and fifteen Severing Arts

Guide §9. `scripts/soulbound/severance.mjs`.

**FINAL RELEASE** [3 actions] (auditory, concentrate, reiatsu) · **Frequency** once per week · **Requirements** 20th level and a released spirit weapon. You enter **Severance** for **10 rounds**.

Severance, identical for all fifteen: Strikes deal an additional **4d6 spirit**; you are **immune to fear and death effects** and to **frightened** and **doomed**; your Release Technique and every kidō cost **nothing** and have **no frequency**; you gain your Spirit's **Full Release** ability and its 20-foot pressure emanation without spending your daily use and without the fatigue; your Speed increases by **20 feet** and Flash Step's frequency becomes twice per round.

**The Waning table** — dice = `22 − 2 × round`, usable rounds 1–7, **refused** at 8–10:

| Round | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8–10 |
| :-- | --: | --: | --: | --: | --: | --: | --: | :-- |
| Dice | 20d6 | 18d6 | 16d6 | 14d6 | 12d6 | 10d6 | 8d6 | cannot be used |

Using a Severing Art **ends Severance**, whether you want it to or not. When Severance ends by either route you lose your Released Form, your Release Technique, your Full Release and your entire reiatsu pool until **a week of downtime**.

The fifteen Arts are guide §9.1–9.3, authored verbatim. **Ittō Kasō is the only one with a self-cost** — you take damage equal to half your current Hit Points, unpreventable — and the only one that exceeds the table (+2d6).

- [ ] **Step 1:** `waningDice(round)` pure and exported; a table of all ten cases in the tests.
- [ ] **Step 2:** the power-loss state, reusing the shape Letzt Stil's already proved.
- [ ] **Step 3:** the fifteen Arts. Six are marked ⚠️ extrapolated in the guide and must say so in their own text.
- [ ] **Step 4:** tests, validate, commit.

---

### Task 5: The two open items

- [ ] **Seal the Art's suppression.** Guide §5.3: a counteracted *release state* is suppressed until the end of the target's next turn and cannot be re-entered, rather than ended. Add a `suppress` option to the counteract payload rather than a second apply type, and pin it.
- [ ] **Zanjutsu's placeholder.** Phase 2's `Zanjutsu` feature grants access and a roll option; it now grants one free technique from the family (Task 2).

---

### Task 6: The handbook, guide v1.4, and live verification

- [ ] **Step 1:** `content/soulbound-journals/handbook.json` — the Reiatsu engine, the release ladder, the Waning table, the kidō ceilings, and the GM notes, including Ryūjin Jakka's friendly-fire variant.
- [ ] **Step 2:** **guide v1.4** — write every correction the programme has accumulated into `Docs/soulbound-guide-v1.md`, with a "What changed in v1.4" section naming each. The guide and the module must not disagree.
- [ ] **Step 3:** live pass — a 20th-level character per Lineage; fire a Severing Art at rounds 1, 4 and 7 and confirm 20d6 / 14d6 / 8d6; confirm round 8 is refused; confirm the power-loss state lands.
- [ ] **Step 4:** update the programme, commit, and open the PR.

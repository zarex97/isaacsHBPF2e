# Clauses — 🌑 Zangetsu

*Spirit tracker. Every independently-failable declaration the guide makes about Zangetsu, one row each.
Source: `Docs/soulbound-guide-v1.md` v1.4 §7A (Zangetsu) and §9.1 (Mugetsu).*

**Lineage:** Soul Reaper · **Ladder:** Shikai → Bankai · **Tracker issue:** #57

## How a row is marked

| Mark | Meaning |
| :-- | :-- |
| ☐ | Not yet driven |
| ✅ | Driven live; the clause happened by itself |
| ⚠️ | Driven live; partially happens — the gap is named in **Evidence** |
| ❌ | Driven live; does not happen |
| 🔧 | Was ❌ or ⚠️, a fix has landed, awaiting re-drive |
| — | Nothing to automate (pure roleplaying / GM ruling) |

**Clause** is a verbatim fragment of the guide. `build/check-clauses.mjs` asserts it still is one, so a
paraphrase here or an edit to the guide fails the build. **Static check** names the assertion that guards
it; **Evidence** names what proved it happened at the table.

*How a clause is driven — the rig, the traps it sets and what a ✅ owes — is
`Docs/tools/live-verification.md`. It is the one copy; this file records results, not method.*

*Zangetsu's own shape.* This is the one Spirit with **no seal**, and the Bankai is the one that takes a
benefit away rather than adding one. Both are places where the general machinery is being asked to run
backwards, so both are worth driving rather than reading.

---

## Shikai (1st) — guide §7A Zangetsu

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-08a | Release | Zangetsu is never sealed | `test-soulbound` asserts the `RollOption` | ✅ | Live: the actor was stripped to **sealed** — no form effect, ledger cleared — and starting the encounter put it straight back into released form. `Zangetsu — Shikai` emits `soulbound:release:never-sealed` and `Release`'s `combatStart` hook reads it off the sheet rather than naming Ichigo in code |
| S-08b | Shikai Form | Your spirit weapon's damage die increases by one step | | ✅ | Live, both spirit-weapon profiles: without the form the Blade is **d8** and Paired Blades **d6**; with it, **d10** and **d8** |
| S-08c | Shikai Form | it gains **two-handed d12** if it did not already have a two-handed trait | `test-soulbound` asserts the predicate | ✅ | **Coded.** The form only stepped the die; the two-handed clause was prose. An `ItemAlteration` now adds `two-hand-d12`, predicated `{not: item:trait:two-hand}` — pf2e emits that bare option alongside `two-hand-d10`, so one predicate covers every size. Live: **Paired Blades** (no two-hand) gained **`two-hand-d12`**; the **Blade** (already `two-hand-d10`) did not, and only its die step carried it to d12 |
| S-08d | Shikai Form | **Your first Release each encounter is free and requires no action** | | ✅ | Live: pool **2 → 2** across the free Release, and the ledger came out `{releases: 1}` — the encounter's free Release is what was spent. It fires on `combatStart`, outside the action economy, so no action is spent either |
| S-08e | Shikai Form | you begin every encounter already released | | ✅ | Same drive as S-08d: round 1 began with `Effect: Released` + `Effect: Zangetsu — Shikai` already on, and the weapon already reading d10 / `two-hand-d12` |

## Release Technique — Getsuga Tenshō (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-09a | Getsuga Tenshō | **30-foot line**, basic Reflex, **2d6** spirit damage | | ✅ | Cast live from a 2nd-level Zangetsu: the card reads **Area 30-foot line**, **basic Reflex**, and the damage rolled **`2d6 spirit`** |
| S-09b | Getsuga Tenshō | **Release Technique — Getsuga Tenshō** [two-actions] | | ✅ | Same card: **2** actions, one Reiatsu Point spent (pool 1 → 0) |
| S-09c | Getsuga Tenshō | **Heightened (+1)** +1d6 | | ✅ | Live at 14th, rank 7: the same technique rolled **`8d6 spirit`** — 2d6 and six heightening steps |

## Refined (9th) — Kuroi Getsuga

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-10a | Kuroi Getsuga | The line increases to **60 feet** | | ✅ | Live with **Refined Release**: the card reads **Area 60-foot line** where the 2nd-level caster's read 30 |
| S-10b | Kuroi Getsuga | the damage **ignores resistances to spirit damage** | | ✅ | Live against a dummy with **resistance spirit 10** beside an identical dummy with none: Refined dealt **32 and 32**. Control, cast by the 2nd-level Zangetsu who has no Refined: 10 rolled, **0 taken** |
| S-10c | Kuroi Getsuga | creatures that critically fail take 1d6 persistent spirit damage | | ✅ | Live on a forced critical failure: the target came out carrying **Persistent Damage (1d6 spirit)**. Control, same crit fail from the caster without Refined: **no persistent damage** |

## Bankai — Tensa Zangetsu (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-11a | Tensa Zangetsu | Your spirit weapon's damage die does **not** increase (overriding Full Release's normal die-step) | `test-soulbound` asserts the opt-out | ✅ | Live, with the Shikai form lifted so only Full Release's own step was in play: **Full Release alone → d10**, **Full Release + Tensa Zangetsu → d8**. `soulbound:full-release:no-die-step` is what makes the difference |
| S-11b | Tensa Zangetsu | You gain a **+10-foot status bonus** to all Speeds | | ✅ | Live: land Speed **25 → 35**, and the modifier reads **`Tensa Zangetsu status 10`** |
| S-11c | Tensa Zangetsu | **Flash Step's frequency becomes twice per round** | `test-soulbound` asserts `frequency-max` 2 | ✅ | Live: `Flash Step`'s `frequency.max` **1 → 2** |
| S-12a | Tensa Zangetsu | Getsuga Tenshō becomes **1 action** | `test-soulbound` asserts the slug the build writes | ✅ | Live: Getsuga Tenshō's cast time **2 → 1** the moment Tensa Zangetsu arrived |
| S-12b | Tensa Zangetsu | its line is 60 feet (90 with Refined) | | ✅ | Live on a Refined caster: area **60 → 90**. The effect carries both alterations, split on `feature:refined-release`, so an unrefined Bankai gets 60 |
| S-13 | Tensa Zangetsu | The first time each round you hit with your spirit weapon, you may **Step** as a free action | `test-riders` asserts the gate | ✅ | **Coded.** It was a prompt with no gate, and its own JSON said so — *“pf2e has no per-round gate on a rider”* — so it fired on every hit. Riders now take an optional `oncePerRound`, spent against a `combat.id:round` stamp on the creature whose allowance it is. Live: **3 hits in round 1 → 1 prompt**, then **2 hits in round 2 → 1 prompt** |

## Severing Art — Mugetsu (guide §9.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-12a | Mugetsu | **60-foot cone**, basic Reflex, **spirit** | | ✅ | Cast live in Severance round 1: the card reads **Area 60-foot cone**, **basic Reflex DC 37**, and the damage rolled **`20d6 spirit`** — the Waning table's first row |
| R-12b | Mugetsu | Ignores **all** resistances and immunities to spirit damage | `test-riders` asserts both halves | ✅ | **Coded, and it was broken twice over.** Live against three dummies — resistance spirit 10, immunity to spirit, and neither — all three took the full **70**. The same roll before the fix gave **68 / 0 / 78** |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 19 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **19** |

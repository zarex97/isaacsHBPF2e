# Clauses — ⚡ The Thunderbolt

*Spirit tracker. Every independently-failable declaration the guide makes about The Thunderbolt, one row
each. Source: `Docs/soulbound-guide-v1.md` v1.4 §7C (The Thunderbolt) and §9.3 (Electrocution).*

**Lineage:** Quincy · **Ladder:** Schrift → Vollständig · **Tracker issue:** #75

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

*The Thunderbolt's own shape.* The only Spirit that **replaces a movement action** rather than adding to
it — Flash Step becomes a teleport with two exemptions, which is a clause that fails by looking
identical to the thing it replaced. Its Refined rung is the class's only **“instead”**: a second form of
the same Technique, at a different base rank, chosen at cast time rather than added beside it. And its
Vollständig is the only rung carrying **two** automatic damage sources at once — an aura that ticks on a
creature's own turn end, and a once-a-round arc that jumps off a Strike — neither of which the caster
ever presses a button for.

---

## Schrift Form (1st) — guide §7C The Thunderbolt

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-75a | Schrift Form | Your spirit weapon becomes a **sword of arcing electricity**: **1d8 slashing**, versatile P |  | ✅ | Live: the Schrift grants **The Thunderbolt — Arcing Sword**, **1d8** with **versatile-p**, and it appears as its own Strike. The sealed **Blade** stays beside it rather than being replaced — the same grant-not-transform shape Antithesis' bow uses, and the one the release ladder can take back cleanly |
| S-75b | Schrift Form | its damage type becomes **electricity** (you may still choose spirit) | `test-riders` pins the trait on the sword | ✅ | **Fixed; the parenthetical was not true.** The sword's damage type is **electricity**, which always worked — but *“(you may still choose spirit)”* needs the `versatile-spirit` trait, and this Spirit's own sword never got the one the four sealed profiles were given. Live after: the Strike offers **electricity / piercing / spirit** |
| S-75c | Schrift Form | You gain **electricity resistance equal to half your level** |  | ✅ | Live at 13th: **electricity 6** — `max(1, floor(level/2))`, half the level |
| S-75d | Schrift Form | your Flash Step becomes an **electricity-flavoured teleport** — it ignores difficult terrain and you may pass through creatures' spaces, though you can't end there |  | ⚠️ | **The table is told; the two exemptions are not enforced.** The Schrift published `soulbound:thunderbolt:flash-step-teleport` and **nothing read it** — the same shape `refuse-death` shipped with. Flash Step's own card now carries an addendum saying it is an electricity-flavoured teleport that ignores difficult terrain and may pass through creatures' spaces; live, the feat's description came back with **one addendum, titled The Thunderbolt**, and only while the form is held. The exemptions themselves have no rule element in pf2e — no per-action waiver of a movement cost, and nothing that lets one creature enter another's space — so they stay a reading the card now makes at the moment it is needed |

## Release Technique — Galvano Blast (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-76a | Galvano Blast | **Release Technique — Galvano Blast** [two-actions] · **60-foot line**, basic Reflex, **2d6** electricity damage |  | ✅ | Live: the card reads **Area 60-foot line**, **Defense basic Reflex**, 2 actions, and the damage rolled electricity |
| S-76b | Galvano Blast | Creatures that fail are **stunned 1**; creatures that critically fail are **stunned 2** |  | ✅ | Live, both rungs on the same card: a **failure** applied **Stunned 1** and a **critical failure** applied **Stunned 2** |
| S-76c | Galvano Blast | **Heightened (+1)** +1d6 |  | ✅ | Live at rank 7 against a base rank of 1: **8d6** — 2d6 and six increments at **(+1)** |
| S-76d | Galvano Blast | This carries the incapacitation trait. | `test-soulbound` pins the trait on all three | ✅ | Live: the card's traits read **incapacitation** beside electricity. It is on Galvano Javelin and Electrocution too, which is what the guide's own note asks for |

## Refined (9th) — Galvano Javelin

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-77a | Galvano Javelin | You may instead throw a javelin of lightning: range 90 feet, one creature, ranged spell attack, **6d6** electricity doubled on a crit |  | ✅ | Live at rank 7: the card reads **Range 90 feet; Targets 1 creature** with the **attack** trait and offers the three MAP attack buttons — a ranged spell attack — and the damage rolled **8d6 electricity** from a base rank of 5. “Doubled on a crit” is pf2e's own ×2 apply button, the system-wide answer recorded under Murciélago's S-44b |
| S-77b | Galvano Javelin | the target is **stunned 1** on a hit (incapacitation) |  | ✅ | Live on a hit: **Stunned 1** on the target, from a `strike-resolved` rider on the javelin itself. The **attack** trait is what keeps that rider off every other Strike its owner makes — `scopedAway`, the half of #53 that was already fixed |
| S-77c | Galvano Javelin | Base rank 5, **Heightened (+1)** +1d6. |  | ✅ | Live: **base rank 5** on the item and **8d6** at rank 7 — two increments at **(+1)** |

## Vollständig — Thunderbolt Form (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-78a | Thunderbolt Form | You gain a **fly Speed** equal to your Speed |  | ✅ | Live at the Vollständig: **fly 25** against a land Speed of **25** |
| S-78b | Thunderbolt Form | **electricity immunity** |  | ✅ | Live: **electricity** immunity arrives with the form (the disease immunity beside it is the Quincy chassis's own) |
| S-78c | Thunderbolt Form | You emit a **10-foot emanation** of live current. A creature that ends its turn in it takes **3d6** electricity damage (basic Reflex). | `test-riders` pins the aura and its tick together | ✅ | **Fixed; it was a different ability.** *“A creature that **ends its turn** in it”* is the creature's own turn end, and pf2e's `Aura` rule element does the geometry and never the timing. It shipped as a `turn-end` rider with a 10-foot area — which fires on the **Quincy's** turn end and fans out from there, paying out even when nobody has stood in the current. It is a real `Aura` plus an `aura-tick` rider now, which `Sources.onAuraTurn` drives from the encounter. Live: D1 ended its turn **10 feet** away, rolled a **Reflex** save against DC 28, critically failed, and took **`3d6 * 2 electricity`** — the basic-save ladder, doubled |
| S-78d | Thunderbolt Form | Once per round when you hit with your spirit weapon, arcs jump: one other creature within 15 feet of the target takes **3d6** electricity damage (basic Reflex). | `test-riders` pins the reach, the centre and the once-a-round gate | ✅ | **Fixed; it was a note to the GM.** The arc shipped as a `prompt` — a card quoting the numbers and applying none of them. *“One **other** creature within 15 feet of **the target**”* is a choice measured from the creature struck, which nothing in the module could express until `apply.type: "pick"` learned `from: "target"`. Live on a critical hit: the card offered exactly the one dummy standing **5 feet** from the one struck — not the struck creature, and not the four enemies within 15 feet of the *Quincy* — and clicking it rolled a **basic Reflex** save against DC 28 and dealt **`3d6 * 0.5 electricity`** on the success. A second critical hit the same round offered nothing, with one claim in the ledger |

## Severing Art — Electrocution (guide §9.3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-25a | Electrocution | **30-foot emanation**, basic Reflex, **electricity**. |  | ✅ | Cast live in Severance: the card reads **Area 30-foot emanation**, **Defense basic Reflex**, and the damage rolled **`20d6 electricity`** |
| R-25b | Electrocution | Creatures that fail are **stunned 2** (**incapacitation**). |  | ✅ | Live on a forced critical failure: **Stunned 2**, with **incapacitation** on the card |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 16 |
| ⚠️ | 1 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **17** |

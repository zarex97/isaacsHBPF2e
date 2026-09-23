# Clauses — 🅰 Antithesis

*Spirit tracker. Every independently-failable declaration the guide makes about Antithesis, one row each.
Source: `Docs/soulbound-guide-v1.md` v1.4 §7C (Antithesis) and §9.3 (Sprenger).*

**Lineage:** Quincy · **Ladder:** Schrift → Vollständig · **Tracker issue:** #69

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

*Antithesis' own shape.* The **first Quincy**, and the lineage's ladder is different again: **Schrift →
Vollständig**, with no spirit in the weapon at all. Its Release Technique is the class's only
**reaction**, and the only one that hands out *resistance to the damage that triggered it* — a number
that has to be known before the thing it resists has finished happening. Its Vollständig is the only rung
in the class with a **real cost**: when Letzt Stil ends the character loses four things and their whole
pool for a day, which is a clause that fails by being forgotten rather than by being wrong.

---

## Schrift Form (1st) — guide §7C Antithesis

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-62a | Schrift Form | Your spirit weapon gains the **Spirit Bow** profile if it did not have it |  | ✅ | Live, both ways: sealed, the character carries the **Blade** profile and nothing else; Releasing grants **Spirit Weapon (Spirit Bow)** beside it. The grant is `allowDuplicate: false`, which is what *"if it did not have it"* means for a Quincy who chose the bow at 1st level |
| S-62b | Schrift Form | its damage die increases by one step |  | ✅ | Live: the bow is **1d10** in the Schrift against a base of **1d8**. pf2e allows exactly one `damage-dice-faces` upgrade per weapon, and this is the one that takes it — which is the whole of why S-65a needed a different mechanism |
| S-62c | Schrift Form | its range increment increases to **100 feet** |  | ✅ | Live: the bow's range increment reads **100**, against the 60 the sealed profile ships. The override is predicated on `item:ranged`, so it reaches the bow and leaves the Blade alone |
| S-62d | Schrift Form | You also gain **Seele Schneider** *(Soul Cutter)*: your bow may be used as a melee weapon, **1d8 slashing**, **finesse** |  | ✅ | Live: **Seele Schneider** arrives with the form — **1d8 slashing**, **finesse** — and appears as its own Strike beside the bow and the Blade |
| S-62e | Schrift Form | whose vibrating reishi edge means its Strikes **ignore resistance to slashing damage** |  | ✅ | Live against a dummy carrying **resistance 1000 to slashing**: Seele Schneider's 9 landed in **full**, and the Blade's 13 — also slashing, from the same character in the same form — was stopped **dead**, 400 → 400. The bypass is predicated on the Seele Schneider tag, and the control is the weapon beside it |

## Release Technique — Antithesis (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-63a | Antithesis | **Release Technique — Antithesis** [reaction] |  | ✅ | Live: a whispered reaction card, *"Something has just landed. Reverse it?"*, with one button and an explicit *"Ignoring this card declines the reaction; nothing is spent."* |
| S-63b | Antithesis | **Trigger** You or an ally within 30 feet takes damage from a creature you can see |  | ⚠️ | **Half of the trigger.** *"**You** … take damage"* works: being hit offers the reaction, verified live. *"…or an ally within 30 feet"* does not, and cannot as written — `damage-received` is the **defender's own** event, so when an ally is hit the rider engine looks at the *ally's* items, and the Quincy's Technique is not among them. Reaching it needs an event that offers a reaction to somebody other than the creature the damage landed on, which the module has no shape for. *"From a creature you can see"* is unchecked too, as every perception clause in this campaign has been |
| S-63c | Antithesis | The triggering creature takes **2d6** spirit damage | `test-riders` asserts the event and where each half lands | ✅ | **Fixed, and it never fired at all.** The rider was keyed to **`damage-applied`** — *"damage from **this actor's item** landed on a target"*, the attacker's event — so being hit offered nothing. Live on `damage-applied`: a dummy hit the Quincy for 20 and no card appeared. It is `damage-received` now, and the 2d6 is marked `trigger: true` so it lands on the creature that struck: **`Antithesis — D1`, `2d6 + 2d6 spirit`, D1 400 → 387**, with the Quincy's own Hit Points untouched by it |
| S-63d | Antithesis | the target of the trigger gains **resistance equal to your level** against the triggering damage |  | ✅ | **Fixed with it.** A reaction rider must be `self` — the card is offered to the ability's owner, and `validate` insists on it — so everything nested inside landed on the Quincy, including the 2d6. `trigger: true` sends one entry to the other end of the event and leaves the rest where they were. Live: **`Effect: Antithesis — Reversed`** on the Quincy, reading **`all-damage 9`** at 9th level |
| S-63e | Antithesis | **Heightened (+2)** +1d6 | `test-riders` asserts the interval | ✅ | **Fixed.** The nested damage grew **every** rank where the guide says every other: at rank 5 it rolled `2d6 + 4d6`. `perStepInterval: 2` is the field Ennetsu Jigoku and Respira already use. Live: **`2d6 + 2d6`** — base 1, four increments, two dice |

## Refined (9th) — Licht Regen

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-64a | Licht Regen | **Licht Regen** [two-actions] |  | ✅ | Live: the card reads **2** actions |
| S-64b | Licht Regen | **30-foot cone**, basic Reflex, **6d6** piercing damage |  | ✅ | Live at 9th, base rank 5: the card reads **Area 30-foot cone**, **Defense basic Reflex**, and the damage rolled **`6d6 piercing`** |
| S-64c | Licht Regen | Creatures that critically fail are **off-guard** until the start of your next turn |  | ✅ | Live on a forced critical failure: **`Licht Regen: Off-Guard`** and pf2e's `off-guard` condition |
| S-64d | Licht Regen | **Heightened (+1)** +1d6 |  | ✅ | Live at rank 7 — two increments above the base rank 5 — **`8d6 piercing`** |

## Vollständig — Quincy: Letzt Stil (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-65a | Letzt Stil | Your spirit weapon's damage die increases by **two** steps instead of one | `test-soulbound` pins the second step to `extraDieSteps` | ✅ | **Fixed; it was worth nothing.** Written as **two** `ItemAlteration` upgrades, which reads exactly like *"two steps instead of one"* and is worth zero: pf2e's handler latches on `damageFacesUpgraded` and the **Schrift's own** upgrade had already taken it. Live before: the bow was **1d10** at the Vollständig, identical to the Schrift. The module solved this for Zanka no Tachi and wrote the reason down; Letzt Stil never got it. Live after: **1d12** at the Vollständig against **1d10** at the Schrift, and Seele Schneider correctly left at 1d8 — it is not the spirit weapon |
| S-65b | Letzt Stil | Your Strikes ignore all **resistances** to physical and spirit damage, and treat cover as one step less |  | ⚠️ | **The resistance half is proved; the cover half was not driven.** Live against **resistance 1000 to slashing**: the Blade dealt **0** of 13 at the Schrift and **15** in full at the Vollständig — the same weapon, the same wall, the form the only difference. The bow's piercing lands too. *"Treat cover as one step less"* is an `EphemeralEffect` granting **Effect: Cover Pierced** on `strike-attack-roll`, which is the right pf2e shape, but staging cover on a target to measure it was not done |
| S-65c | Letzt Stil | you may run Vene and this simultaneously |  | ✅ | Live, both ways: at the **Schrift**, setting Blut Vene and then Blut Arterie leaves **Arterie alone** — the exclusivity guide §5.3 states. At the **Vollständig**, **both stand together**. The exception is authored rather than coded: `Effect: Quincy: Letzt Stil` publishes `soulbound:blut-both` and `Blut.allowsBoth` reads it, so the module never learns Uryū's name |
| S-65d | Letzt Stil | **Licht Regen** becomes a **60-foot cone** |  | ✅ | Live, both ways: Licht Regen's area is **60-foot cone** at the Vollständig and **30** at the Refined rung, and the card reads it back |
| S-65e | Letzt Stil | once per round you may use it without spending a Reiatsu Point | `test-riders` asserts the allowance is on the feat, which keeps a frequency | ✅ | **Fixed; it was never available.** The `freeCast` flag sat on the **effect**, and pf2e's effect data model has no `frequency` field — the authored `1/round` was dropped on load, so `FreeCast.find` read 0 remaining and paid for nothing, ever. Moved to the **feat**, which pf2e both keeps a frequency for and refills each round, predicated on being in the form. Live, all three cells: the first cast is **free** (3 → 3) and says so, the second **pays** (3 → 2), and the allowance shows spent |

## Letzt Stil — the cost

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-66a | Letzt Stil | When Letzt Stil ends, you lose access to **your Schrift Form, your Release Technique, Licht Regen, Vollständig, and your entire reiatsu pool** until you complete **24 hours of rest** | `test-soulbound` asserts the form declares what it costs | ✅ | **Coded; the cost did not exist.** `Release.release` has refused on `soulbound:letzt-stil-spent` since the ladder was built, and **nothing in the module ever published that option** — the pool came out of the form untouched and the Schrift went straight back on. `Effect: Letzt Stil — Spent` was in the content all along, applied by nobody. A form now declares `endsWith`, and leaving it pays. Live: pool **2 → 0**, cap **3 → 0**, state **sealed** rather than one rung down, the bow and Seele Schneider gone with the Schrift, and a second Release refused — *"has spent Letzt Stil: no Schrift Form until 24 hours of rest"* |
| S-66b | Letzt Stil | You keep your weapon, your proficiencies, and your feats |  | ✅ | Live, in the same run: the **Blade** stayed, back at its base **1d8**; the feat count was **32 before and 32 after**; and the class DC's proficiency rank read **2** on both sides. The cost takes the form, not the character |

## Severing Art — Sprenger (guide §9.3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-22a | Sprenger | **20-foot burst** within 60 feet, basic Reflex, **force** |  | ✅ | Cast live in Severance round 1 at 20th: the card reads **Range 60 feet; Area 20-foot burst**, **Defense basic Reflex**, 2 actions, the damage rolled **`20d6 force`**, and *"Sprenger ends Severance"* followed it |
| R-22b | Sprenger | Creatures that critically fail are **restrained** by lines of light for 1 minute (Escape vs. your Reiatsu DC) |  | ✅ | Live on a forced critical failure: **`Sprenger: Restrained`, 1 minute**, granting pf2e's own `restrained` condition. The Escape DC travels with it as the module's `escapeDc` rather than as prose |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 21 |
| ⚠️ | 2 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **23** |

# Clauses — 🦇 Murciélago

*Spirit tracker. Every independently-failable declaration the guide makes about Murciélago, one row
each. Source: `Docs/soulbound-guide-v1.md` v1.4 §7B (Murciélago) and §9.2 (Cero Oscuras: Ceniza).*

**Lineage:** Hollow · **Ladder:** Resurrección → Segunda Etapa · **Tracker issue:** #65

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

*Murciélago's own shape.* **The only canon Segunda Etapa in the series**, and the guide says so — where
Pantera's second form was invented and deliberately slight, this one is the reason the rung exists. It is
also the class's only **ranged spell attack** Spirit: Cero Oscuras rolls to hit rather than calling for a
save, which is what buys its higher die count, and every clause downstream of that inherits a critical
hit's doubling. Two clauses reach into machinery owned by somebody else — the Hollow Lineage's
Regeneración, and the spirit weapon's whole profile being *replaced* rather than altered.

---

## Resurrección (1st) — guide §7B Murciélago

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-43a | Resurrección Form | You gain a **fly Speed** equal to your Speed |  | ✅ | Live: the form gives **fly 35** against a land Speed of **35**, and the control run with the Spirit sealed has no fly Speed at all. The rule reads `@actor.system.movement.speeds.land.value`, so it is the Speed rather than a number that happens to match it |
| S-43b | Resurrección Form | a javelin of hardened green energy: **1d10 piercing**, versatile S, **reach** |  | ✅ | Live on Releasing: the Blade is stowed and **Luz de la Luna** is in hand — **1d10 piercing**, **versatile-s**, **reach**. The spirit weapon is *replaced* rather than altered, which is the one Spirit in the class that does it that way |
| S-43c | Resurrección Form | it re-forms in your hand instantly if thrown or dropped |  | — | Foundry has no event for a weapon leaving a hand: nothing fires when an item is dropped, and Luz has no **thrown** trait to be thrown with — it is a reach javelin. What the clause removes is a cost the table was never going to pay, so it is printed on the item and the GM never has to rule on it |

## Release Technique — Cero Oscuras (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-44a | Cero Oscuras | Range 90 feet, one creature. Make a **ranged spell attack** using your Reiatsu DC's proficiency and key attribute |  | ✅ | Live at 15th: the card reads **Range 90 feet; Targets 1 creature; Defense AC**, with the **Attack** trait, and the roll posted as *Soulbound Spell Attack* against the target's AC using the Reiatsu DC's statistic |
| S-44b | Cero Oscuras | **3d6** spirit damage, doubled on a critical hit |  | ✅ | Live: the attack read **Critical Hit**, and the ×2 apply button took D1 from **120 → 52** on a 34-point roll — the doubling, exactly. pf2e never rolls a spell attack's critical damage itself: `spell/document.ts` sets `outcome: isAttack ? "success" : null` with a *we'll need to support other outcomes later* beside it, for every attack-roll spell in the system. The doubling is the damage card's own **×2**, which is where pf2e puts it |
| S-44c | Cero Oscuras | **Release Technique — Cero Oscuras** [two-actions] |  | ✅ | Same card: **2** actions, Focus 8 |
| S-44d | Cero Oscuras | **Heightened (+1)** +1d6 |  | ✅ | Live at 15th, rank 8: the damage rolled **`3d6 + 7d6`** — 3d6 and seven heightening steps |

## Refined (9th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-45a | Refined | On a critical hit, the target is **off-guard** until the start of your next turn |  | ✅ | Live: a critical hit left the target carrying **`Cero Oscuras: Off-Guard`**, and the plain hit in the control run left nothing. The rider is predicated on `feature:refined-release` |
| S-45b | Refined | Cero Oscuras gains a **5-foot burst** at the target's location dealing half damage to other creatures in it (basic Reflex) | `test-riders` asserts the splash's shape and the composed ladder | ✅ | **Fixed twice.** The splash reached nobody: a 5-foot burst centred on the target's *centre point* is a circle one square in radius drawn from the middle of one square, so it covered the creature it is defined to exclude and stopped exactly on the centre of every neighbour. An area anchored on a creature is now measured from that creature's **space**, the way pf2e means *within 5 feet*. Then the damage was wrong: `basicLadder` **overwrote** the author's `multiplier: 0.5` instead of composing with it, so the splash dealt the cero in full. Live after both: D2 adjacent critically failed for **`3d6 + 7d6`** — half, doubled — D3 diagonally adjacent failed for **`(3d6 + 7d6) * 0.5`**, D4 at 10 feet and D6 far away were not asked, and D1 — the creature it splashed off — took nothing |

## Segunda Etapa (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-46a | Segunda Etapa | Your fly Speed increases by **20 feet** |  | ✅ | Live entering Segunda: fly **35 → 55**, the modifier reading `Segunda Etapa status 20` |
| S-46b | Segunda Etapa | You gain **resistance to all damage except spirit equal to half your level** |  | ✅ | Live at 15th: **resistance 7 to all damage except spirit** — `max(1, floor(@actor.level/2))` — and the control with Segunda stripped has none |
| S-46c | Segunda Etapa | Your Regeneración fast healing **doubles** |  | ✅ | Live, both ways: Regeneración healed **8** at Segunda against **4** without it. The doubling is a second `FastHealing` rule split on `soulbound:murcielago:high-speed-regeneration`, so the Lineage's own fast healing is what doubles rather than a number written twice |
| S-46d | Segunda Etapa | it now restores lost limbs |  | — | pf2e has no lost limb to restore — the Saint's own severed-limb machinery is a *Capricorn* rider, and nothing in the Hollow lineage ever takes one. The clause is printed on the feature so the table can read it |

## Segunda Etapa — Lanza del Relámpago

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-47a | Lanza del Relámpago | **Lanza del Relámpago** [two-actions] |  | ✅ | Live: the card reads **2** actions, Focus 8 |
| S-47b | Lanza del Relámpago | **Frequency** once per round | `test-riders` asserts every spell frequency the module now enforces | ✅ | **Fixed.** It was decoration. pf2e spends a frequency in `createUseActionMessage`, which runs only for an **ability or feat**, and refills it in `Actor#recharge`, whose loop is `[itemTypes.action, itemTypes.feat]` — a spell is in neither, so both halves skipped it. Cast twice in one round, Lanza posted two cards and left the counter at 1. Live after the fix: the first cast spends it (**1 → 0**), the second is refused with *“has no uses left (once per round)”* and posts nothing, the enemy's turn leaves it at **0**, and the caster's own turn start hands it back to **1**. Five spells in the content said *Frequency* and none of them meant it |
| S-47c | Lanza del Relámpago | You forge a javelin of crackling green lightning and throw it. Range 120 feet. |  | ✅ | Same card: **Range 120 feet; Targets 1 creature; Defense AC** |
| S-47f | Lanza del Relámpago | attack against one creature; on a hit it takes **5d6** electricity damage |  | ✅ | Live at rank 8: the damage rolled **`6d6 electricity`** against one target, off the spell attack |
| S-47d | Lanza del Relámpago | Whether or not you hit, the lance detonates in a **15-foot burst** at that point: **5d6** | `test-riders` pins the detonation to the target's location | ✅ | **Fixed.** The detonation was a `self` rider with no area: casting Lanza dealt **13 fire to the caster**, with no save, and the burst never happened. It is a target-anchored 15-foot burst with a basic Reflex save now, on `strike-resolved` with no outcomes — *“whether or not you hit”* is exactly what an outcome-free strike rider means. Live: **D1 (the target), D2, D3 and D4** all rolled Reflex against **DC 30** and took `(5d6 + 1d6) * 2` on a critical failure, D5 and D6 further off were not asked, and the caster took nothing. An ally standing in it was caught too, which is what an indiscriminate detonation owes |
| S-47e | Lanza del Relámpago | **Heightened (+1)** +1d6 to both |  | ✅ | Live at rank 8 — one heightening step above the base rank 7 — **both** halves read six dice: `6d6 electricity` on the lance and `5d6 + 1d6` on the burst |

## Severing Art — Cero Oscuras: Ceniza (guide §9.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-18a | Cero Oscuras: Ceniza | **120-foot line**, basic Reflex, **spirit** |  | ✅ | Cast live in Severance round 1 at 20th: the card reads **Range 120 feet; Area 120-foot line**, **Defense basic Reflex**, 2 actions, and the damage rolled **`20d6 spirit`**. *“Cero Oscuras: Ceniza ends Severance”* followed it. The line catches what stands in it and nothing beside it — aimed down the diagonal it took **D1 and D3**, and left **D2 and D4** one square off it alone |
| R-18b | Cero Oscuras: Ceniza | A creature reduced to 0 Hit Points by this crumbles to ash; returning it to life requires a 10th-rank effect |  | — | The same answer as Ittō Kasō's R-14e, and for the same reason: pf2e has no notion of a body that cannot be raised, and the rank of the effect needed to undo it is a question for whoever casts it. The clause is printed on the card |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 18 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 3 |
| **Total** | **21** |

# Clauses — 🜂 Ryūjin Jakka

*Spirit tracker. Every independently-failable declaration the guide makes about Ryūjin Jakka, one row
each. Source: `Docs/soulbound-guide-v1.md` v1.4 §7A (Ryūjin Jakka) and §9.1 (Ittō Kasō).*

**Lineage:** Soul Reaper · **Ladder:** Shikai → Bankai · **Tracker issue:** #59

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

*Harness notes, carried from the three trackers before this one.* Drive through the Claude Chrome
extension, and calibrate its pointer first: its coordinates are the **screenshot's**, not the page's —
multiply a CSS position by `screenshotWidth / window.innerWidth`. `canvas.regions.placeRegion` listens on
`canvas.stage` for `pointerdown`, so a synthetic `PointerEvent` dispatched at `canvas.app.view` commits a
placement where the extension's own click does not. Cast from a **party**-aligned actor or an `enemies`
area catches nobody. Token position and disposition writes are silently reverted in this world;
`system.details.alliance` on the actor is not. `save-rolled` riders come from `pf2e-toolbelt.rollSave`,
which fires only from a target row on the chat card. `Region#testPoint` takes **one** argument,
`{x, y, elevation}`. A Foundry flag key containing a dot is a **path**, not a key. Owned items are copies
taken at grant time, so a content flag added today does not reach a character granted yesterday.

*Ryūjin Jakka's own shape.* The most complex Bankai in the class, the only one that damages its own
party, and the only Spirit whose Severing Art costs its user Hit Points. Four of its clauses are about
something being **taken away** — fire resistance, healing, the protection of resistance — which is the
direction pf2e is least willing to go.

---

## Shikai (1st) — guide §7A Ryūjin Jakka

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-23a | Shikai Form | Your damage type becomes **fire** (you may still choose spirit) | | ✅ | Live: without the form the Great Blade deals **slashing**; with it, **fire**, and `versatile-spirit` survives, so spirit is still selectable |
| S-23b | Shikai Form | your spirit weapon gains **deadly d8** | | ✅ | Live: traits go `sweep, versatile-spirit` → `sweep, versatile-spirit, **deadly-d8**` |
| S-23c | Shikai Form | You gain **fire resistance equal to half your level** | | ✅ | Live at 13th: resistances go `[]` → **`fire 6`** |

## Release Technique — Ennetsu Jigoku (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-24a | Ennetsu Jigoku | **15-foot emanation**, basic Reflex, **2d6** fire | | ✅ | Cast live from a 2nd-level Ryūjin Jakka: the card reads **Area 15-foot emanation**, **basic Reflex**, and the damage rolled **`2d6 fire`**. The emanation auto-targeted the dummies at 5 and 15 feet and left the one at 25 |
| S-24b | Ennetsu Jigoku | creatures that fail also take **1d4 persistent fire** | | ✅ | Live on a forced failure: the target came out carrying **Persistent Damage (1d4 fire)** |
| S-24c | Ennetsu Jigoku | **Release Technique — Ennetsu Jigoku** [two-actions] | | ✅ | Same card: **2** actions, one Reiatsu Point spent (pool 1 → 0) |
| S-24d | Ennetsu Jigoku | **Heightened (+1)** +1d6 and +1 persistent die at every other increment | `test-riders` asserts the interval | ✅ | **Coded.** The headline dice heightened and the persistent die never did — `applyPersistent` read `perCounter` and not `perStep`, so a flag the content had carried all along was never opened. Riders now honour `perStep` here too, with `perStepInterval` for the guide's *“every other increment”*. Live at rank 7: **`8d6`** and **`4d4 persistent fire`**, against **`2d6`** and **`1d4`** at rank 1 |

## Refined (9th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-25a | Refined | The emanation increases to **20 feet** | | ✅ | Live with **Refined Release**: the card reads **Area 20-foot emanation** where the 2nd-level caster's read 15 |
| S-25b | Refined | the ground within it becomes **difficult terrain** from burning debris until the end of your next turn | | ✅ | Live: casting raised a Region *Ennetsu Jigoku — embers* carrying `modifyMovementCost` at **2** on every movement action, and it vanished on its own once world time passed its one-round expiry |

## Bankai — Zanka no Tachi (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-26a | Zanka no Tachi | Your spirit weapon's damage die increases by **two** steps instead of one | `test-soulbound` asserts one rule plus the declaration | ✅ | **Coded, and it was never a content bug.** pf2e's `damage-dice-faces` handler latches — `if (item.flags.pf2e.damageFacesUpgraded) return` — so a second `upgrade` is a no-op whether it sits on the same effect or another. `override` takes a literal 4/6/8/10/12 and the Bankai is generic across seven weapon profiles. The Bankai now keeps one honest `upgrade` and declares `extraDieSteps`, taken after pf2e has finished. Live from the shipped pack: **Paired Blades d6 → d10**, Great Blade d10 → d12 (capped) |
| S-26b | Zanka no Tachi | You lose your fire resistance while it is active | | ✅ | Live: resistances go **`fire 6` → `[]`** the moment Zanka no Tachi arrives. The Shikai's `Resistance` is predicated `{not: self:effect:zanka-no-tachi}` |
| S-26c | Zanka no Tachi | each creature **other than you** within 30 feet — allies included — takes **1d6** fire damage from ambient heat, with no save | | ✅ | Live at the caster's turn start: the two **party allies** at 10 feet took fire, as did the enemies at 5 and 15, and the **caster took nothing**. No save was rolled |
| S-26d | Zanka no Tachi | Once per round you may **Sustain** to select one cardinal aspect, which lasts until you select another | | ✅ | Live: `Zanka no Tachi — Sustain` is a **1-action** item with pf2e `frequency` **1 per round**, and its card offers Higashi, Nishi, Minami and Kita. Selecting Nishi removed Higashi — one at a time, until another is chosen |

## Aspect — Higashi: Kyokujitsujin

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-27a | Higashi | Your Strikes ignore all resistances and immunities | | ✅ | Live against a target **immune to fire**: with Higashi it lost the full **8**; with the aspect dropped, the same Strike for 12 left it on **0** |
| S-27b | Higashi | a creature damaged by your spirit weapon **can't regain Hit Points** and its regeneration and fast healing are suppressed until the end of your next turn | | ✅ | **Coded.** The aspect carried a bypass and a roll option and nothing that stopped healing. It now applies *Effect: Wound That Will Not Close* on a hit with the spirit weapon, at **1 round / turn-end** — the guide's *“until the end of your next turn”*. Live: the wounded target regained **0** from a 15-point heal and **15** once the wound was gone |

## Aspect — Nishi: Zanjitsu Gokui

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-28a | Nishi | You gain **fire immunity** | | ✅ | Live: immunities gain **`fire`** while Nishi is up |
| S-28b | Nishi | **resistance to all damage equal to half your level** | | ✅ | Live at 13th: resistances read **`all-damage 6`** |
| S-28c | Nishi | a creature that damages you with an unarmed attack, a melee weapon, or a Grapple takes **4d6** fire damage | | ✅ | **Fixed.** The rider named no `outcomes`, so the heat answered **misses** too — driven live, a Fist that missed by 1 still took 9 fire. Gated on a hit now. Live across six Strikes: three critical misses and two misses drew nothing, the one hit drew **12** |

## Aspect — Minami: Kaka Jūmanokushi Daisōjin

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-29a | Minami | The ash of everything your flames have killed rises in a **20-foot emanation** | | ✅ | Live: `Effect: Minami` registers a pf2e `Aura` of **radius 20** and it is drawn on the caster's token |
| S-29b | Minami | Enemies that end their turn in it must succeed at a Reflex save or be **grabbed** by ash-figures (Escape vs. your Reiatsu DC) | `test-riders` asserts the routing | ✅ | **Coded.** It was a `turn-end` **area** rider, which sweeps whoever stands there when the *caster's* turn ends. Promoted to a pf2e `Aura` — and then to a tick the module times itself, because pf2e reads an aura's `events` list exactly once, to default `removeOnExit`, and grants on contact thereafter. Live: **D1 ended its own turn** in the ash and rolled **Reflex DC 27**, critically failed, and came away **Grabbed**. The caster's turn ending drew no save, and a **party ally** standing 10 feet inside ended its own turn and drew none either |
| S-29c | Minami | The figures take no actions and are not creatures | | — | Nothing is created. The figures are prose in the effect's description, which is exactly what *“take no actions and are not creatures”* asks for |

## Aspect — Kita: Tenchi Kaijin

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-30a | Kita | A **60-foot line** of flame, basic Reflex, **5d6** fire | | ✅ | Cast live: the card reads **Area 60-foot line**, **basic Reflex**, and the damage rolled **`5d6 fire`** at its base rank of 7 |
| S-30b | Kita | This damage **cannot be reduced by resistance to fire, by Blut Vene, or by Hierro** | | ✅ | Live against a dummy with **resistance fire 10**, beside an identical dummy with none: both took the full **22**. Blut Vene and Hierro are both `Resistance` of type **physical**, and the bypass names `fire` and `physical` together, so all three are covered by one declaration |
| S-30c | Kita | [two-actions, once per round] | | ✅ | Live: the technique is **2 actions** and carries pf2e's own `frequency` at **1 per round** |

## Severing Art — Ittō Kasō (guide §9.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-14a | Ittō Kasō | **20-foot burst** within 60 feet, basic Reflex, **fire** | | ✅ | Cast live in Severance round 1: the card reads **Range 60 feet; Area 20-foot burst**, **basic Reflex DC 37**, 2 actions |
| R-14b | Ittō Kasō | it deals the Waning dice **+2d6**, the only Art in the class that beats the table | `test-soulbound` asserts the formula | ✅ | **Fixed.** The content said `20d6` and `applyWaning` only preserves a `+NdN` that is already in the formula, so the promised extra never existed. It is `20d6 + 2d6` now. Live at round 1: **`22d6 fire`** |
| R-14c | Ittō Kasō | The fire **ignores resistance and immunity to fire** | | ✅ | Live against three dummies — resistance fire 10, immunity to fire, and neither — all three took the identical total |
| R-14d | Ittō Kasō | Creatures that fail **can't regain Hit Points for 1 minute**, and their regeneration and fast healing are suppressed for that minute | | ✅ | **Unblocked.** Using an Art ends Severance, and Severance is what granted it, so the card lost its item and with it every per-target save button the rider listens to — there was no way to roll the save at all. The Art is now detached from its grant before Severance ends. Live: three save rows on the card, and a critical failure left the target carrying *Effect: Wound That Will Not Close* for **1 minute** |
| R-14e | Ittō Kasō | A creature reduced to 0 Hit Points by Ittō Kasō is **cremated** — returning it to life requires a 10th-rank effect | | — | pf2e has no notion of a body that cannot be raised, and the rank of the effect needed to undo it is a question for whoever casts it. The clause is printed on the card |
| R-15a | Ittō Kasō — self-cost | When you use Ittō Kasō, you take damage equal to half your current Hit Points | | ✅ | Live: the caster went **200 → 100**, exactly half of current Hit Points, and the card named it *(unpreventable)* |
| R-15b | Ittō Kasō — self-cost | cannot be prevented, reduced, resisted, or redirected, and it is applied after the Art resolves | | ✅ | Live with **`all-damage 50`** resistance and fire immunity on the caster: 160 → 80, the full half. The rider applies with `skipIWR` and `final`, and fires on `action-used`, so it lands after the Art's own card |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 29 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 2 |
| **Total** | **31** |

# Clauses — ❁ Senbonzakura

*Spirit tracker. Every independently-failable declaration the guide makes about Senbonzakura, one row
each. Source: `Docs/soulbound-guide-v1.md` v1.4 §7A (Senbonzakura) and §9.1 (Shūkei: Hakuteiken).*

**Lineage:** Soul Reaper · **Ladder:** Shikai → Bankai · **Tracker issue:** #56

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

*Harness notes, learned on Hyōrinmaru.* Drive through the Claude Chrome extension: real pointer input is
what `canvas.regions.placeRegion` accepts. Cast from a **party**-aligned actor or an `enemies` area
catches nobody. `canvas.pan` returns immediately where `canvas.animatePan` times out the script channel.
Token disposition writes are silently reverted in this world; `system.details.alliance` on the actor is
not. A heightening clause needs a caster above 14th — clone one rather than editing a level in place.

---

## Shikai (1st) — guide §7A Senbonzakura

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-01a | Shikai Form | Your Strikes gain **reach 15 feet** | | ✅ | Live in released Shikai: the spirit weapon carries `reach-15`, and it is absent while sealed. **SB-6** closed this when the release ladder started running |
| S-01b | Shikai Form | lose the two-hand and twin traits | | ✅ | Live: the Blade profile carries `two-hand-d10` in content and the Shikai form removes it — traits read `versatile-p, versatile-spirit, reach-15`. The `twin` removal is authored but unreachable on a Blade spirit |
| S-01c | Shikai Form | your hands are empty | | ✅ | Live: sealed reads `handsHeld 1` / `handsFree 1`; Shikai reads `handsHeld 0` / `handsFree 2` with `carryType` still `held`, so the Strike survives. `ItemAlteration` has no property for this, so the form declares `freesHands` and `SpiritWeapon.reconcile` reads it |
| S-01d | Shikai Form | Your Strikes are **not** affected by cover between you and the target | | ✅ | **Coded.** pf2e puts cover on the defender and gives an attacker no way to suppress it, so the correction is made where both sides meet — `Check.roll` takes the target's cover bonus back out of the DC. Live vs. a target in greater cover: **DC 20 → 18**, stamped `soulbound:ignored-cover:2` |

## Release Technique — Senbonzakura (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-02a | Senbonzakura | **15-foot emanation**, basic Reflex, **2d6** slashing | | ✅ | Cast live: emanation, basic Reflex, slashing (ported from S-02) |
| S-02b | Senbonzakura | The area is **difficult terrain** for enemies until the start of your next turn | | ✅ | **Coded.** Foundry's `modifyMovementCost` has no notion of who is walking, so the behavior is subclassed: `_getTerrainEffects` is handed the moving token and returns nothing for the caster's own side. Live in the petal Region: the enemy got `difficulty: 2`, the ally and the caster **`[]`** |
| S-02c | Senbonzakura | **Heightened (+1)** +1d6 | | ✅ | Live at rank 10: 11d6 slashing, the guide's own target (ported from S-02) |

## Refined (9th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-03a | Refined | The emanation increases to **20 feet** | | ✅ | 20-ft emanation via `alternateArea` on `feature:refined-release` (**SB-28**, ported from S-03) |
| S-03b | Refined | creatures that critically fail are **off-guard** until the start of your next turn | | ✅ | Live: D2 critically failed the Reflex save from the card and gained **off-guard**, on a generated effect whose duration reads `rounds 1, expiry turn-start` — the start of your next turn, as the guide says |

## Bankai — Senbonzakura Kageyoshi (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-04a | Bankai | You gain a second **20-foot emanation** centred on a point within 60 feet | | ✅ | Live: the second emanation places and moves within 60 ft (ported from S-04) |
| S-04b | Bankai | At the start of each of your turns, each enemy in **either** emanation takes **5d6** slashing damage | | ✅ | Live on a clean combat: with the second sent 90 feet away, the enemy beside the caster **and** the two at the far end were each caught once (ported from S-04) |
| S-04c | Bankai | basic Reflex | | ✅ | Ported from S-04 |
| S-05a | Bankai | You can **Sustain** once per round to move the second emanation up to 30 feet | | ✅ | The Sustain offers *Send them*, placing or moving the second emanation within 60 ft (ported from S-05) |
| S-05b | Bankai | or to switch modes | | ✅ | The same Sustain offers Gokei, Senkei and Neither (ported from S-05) |

## Bankai modes (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-06a | Gokei | The second emanation shrinks to a **10-foot burst** centred on one enemy | | ✅ | Live: Gokei reshapes the second area rather than adding a third (ported from S-06) |
| S-06b | Gokei | that enemy takes **double** the damage | | ✅ | Live: `5d6 × 2 = 36` and `× 2 = 26` on the two at the anchor, and nobody else (ported from S-06) |
| S-06c | Gokei | cannot benefit from cover or concealment against it | | ✅ | **Coded.** Cover also grants its bonus to **Reflex** against `area-effect`, so it was helping against the one thing the clause forbids. The same `Check.roll` seam raises the save DC by that bonus instead. Live: **DC 20 → 22** on a covered target's Reflex save. Concealment needs no code here: it is a flat check against *attack rolls*, and Gokei is a basic Reflex save, so there is nothing for it to cancel |
| S-07a | Senkei | The blades condense into a thousand swords forming a 20-foot cage around you and one enemy | | ✅ | Live: Senkei raises a Region named *Effect: Senkei — 20-foot cage* on the caster, and switching to Gokei takes it back down |
| S-07b | Senkei | Neither of you can leave | | — | Arrives as a turn-start prompt; not a number pf2e can enforce (ported from S-07) |
| S-07c | Senkei | your Strikes against that enemy ignore all resistances | | ✅ | A `bypass` makes your Strikes ignore all resistances (ported from S-07) |
| S-07d | Senkei | you may make one extra Strike each round at your current multiple attack penalty | | — | Offered as a prompt; pf2e cannot grant an extra Strike (ported from S-07) |
| S-07e | Senkei | **You lose Senbonzakura's reach and cover-ignoring** | | ✅ | Senkei takes `reach-15` back off the spirit weapon (ported from S-07) |
| S-07f | Senkei | enemies outside the cage cannot be targeted by you | | ✅ | **Coded.** A `targetToken` hook drops a target that falls outside the cage Region and says why. Live with the cage up: targeting *D1* inside **held**, targeting *Piscis* outside was released with *“Piscis is outside Effect: Senkei — 20-foot cage”*. The cage must enclose its own bearer before a refusal is trusted, so a Region that cannot answer fails open |

## Severing Art — Shūkei: Hakuteiken (guide §9.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-11a | Shūkei: Hakuteiken | **One creature within reach.** | | ✅ | Shape and Strike were right when driven (ported from R-11) |
| R-11b | Shūkei: Hakuteiken | Make a Strike; on a hit it takes the Waning dice as **slashing** | | ✅ | Ported from R-11 |
| R-11c | Shūkei: Hakuteiken | Ignores **all** resistances and immunities | | ✅ | The ignore-all bypass was right when driven (ported from R-11) |
| R-11d | Shūkei: Hakuteiken | On a hit the target can't regain Hit Points | | ✅ | Live on *Phantom Knight*: a clean heal gave back 10, and the same heal while wounded gave back **0** |
| R-11e | Shūkei: Hakuteiken | its regeneration and fast healing are suppressed, for 1 minute | | ✅ | Live on *ZZ Test — Arrogante*: the Regeneración `FastHealing` predicate reads true clean, **false** while wounded, true again once the wound is gone |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 26 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 2 |
| **Total** | **28** |

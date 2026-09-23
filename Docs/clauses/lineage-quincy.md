# Clauses — the Quincy Lineage

*Lineage tracker. Every independently-failable declaration the guide makes about what **every**
Quincy has, whatever Spirit they chose. Source: `Docs/soulbound-guide-v1.md` v1.4 §5.3 and §6.5.*

**Tier:** lineage · **Tracker issue:** #79

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

*The middle tier.* `class.md` asks what is true of a Soulbound who has chosen nothing; the fifteen
`spirit-*.md` ask what one Spirit does. This file is the layer between them: what a Quincy gets for being a Quincy, before any Schrift is named. It is the denial Lineage: almost every row is something taken away from somebody else.

---

## The Lineage itself (guide §5.3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Q-01 | §5.3 | **Granted skill:** Crafting. **Release ladder:** Schrift → Vollständig. | `test-soulbound` pins the skill | ✅ | Live on every Quincy in the rig: **Crafting trained** at 1st, from an `ActiveEffectLike` on the Lineage. The `Schrift → Vollständig` ladder is each Schrift's own tracker; what is Lineage-wide is that this is the ladder it grants |

## Heilig Bogen and Blut (1st) — guide §5.3

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Q-02 | §5.3 | You may choose the **Spirit Bow** profile for your spirit weapon |  | ✅ | Live: a Quincy's sheet carries **`Spirit Weapon (Spirit Bow)`** — `d8 piercing, propulsive, reload 0` — as one of the four profiles the 1st-level ChoiceSet offers. *May* choose, not must: the same Quincy could have taken the Blade, and one in the rig has |
| Q-03 | §5.3 | Your bow needs no ammunition; you condense arrows out of ambient reishi. |  | ✅ | Live: the bow reads **`reload 0`** and carries no ammunition slot at all — `selectedAmmoId` is null and pf2e asks for none. A pf2e bow that needed arrows would refuse the Strike without them; this one never asks, which is what condensing them out of ambient reishi looks like on a sheet |
| Q-04 | §5.3 | your bow's |  | — | **The guide hands this to the GM in its own sentence** — *“(GM's call — a dead-magic zone, a sealed vault)”* — and Foundry has no notion of ambient spiritual energy to read. The clause is on the feature's description, on the sheet, where a GM who has declared such a zone will find it. Nothing here is automatable without inventing the zone first, which is a scene the table builds rather than a rule the class carries |
| Q-05 | §5.3 | damage die decreases by one step. |  | — | The other half of the same sentence, and the same answer: a die step conditional on a judgement nothing in the system makes |
| Q-06 | §5.3 | **Frequency** once per round. Choose **Vene** or **Arterie**. | `test-soulbound` pins the action and the frequency | ✅ | Live: **Blut is a free action** carrying `frequency 1/round`, which pf2e counts and recharges, and using it opens a dialog offering exactly **Vene** and **Arterie**. It is a dialog rather than a setting because the choice is made at the moment you act |
| Q-07 | §5.3 | The choice lasts until the start of your next turn. **You cannot have both** |  | ✅ | **Both halves, live.** The effect that lands reads `1 round, expiry turn-start` — *“until the start of your next turn”* on the nose. And choosing **Arterie while Vene stood took Vene off**: the sheet went from `Effect: Blut Vene` with `physical: 10` to `Effect: Blut Arterie` with no resistances at all. Canon is explicit that the two run on different reishi systems, and the sheet cannot hold both |
| Q-08 | §5.3 | **Blut Vene** (defensive) — You gain **resistance to physical damage equal to half your level | `test-soulbound` pins the formula | ✅ | Live at 20th: Blut Vene gave **resistance physical 10** — half level, the same number as Hierro's, which is the point. Hierro is free and permanent; this costs an action and forecloses Arterie, so it is strictly the worse deal and correctly so |
| Q-09 | §5.3 | **Blut Arterie** (offensive) — Your Strikes with your spirit weapon **ignore resistances to | `test-soulbound` pins the bypass | ✅ | **The clause the whole Lineage is built around, and it holds.** Live, the same Quincy's Strike against a dummy carrying **resistance 1000 to physical and to spirit**: **0 damage without Blut**, and **11 in full with Blut Arterie**. The bypass is a module flag on the effect rather than a modifier, exactly so that it grants no bonus to attack, damage or DC — it is how a Quincy shoots through Hierro without touching Pathfinder's attack math |
| Q-10 | §5.3 | physical damage and to spirit damage**, and treat the target's cover as one step less. | `test-soulbound` pins all three steps | ✅ | Live: Arterie carries an `EphemeralEffect` onto the **target's** attack-roll context — `Effect: Cover Pierced` — whose three `AdjustModifier` rules subtract **2 from greater cover, 1 from standard, 1 from lesser**. One step each time: greater becomes standard, standard becomes lesser, lesser becomes none. Cover lives on the defender, so a clause about the attacker ignoring it can only be said from the defender's side |

## Heizen and Gritz (1st) — guide §5.3, §6.5

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Q-11 | §5.3 | You know **two** and they are always these: **Heizen** (your free cantrip) and | `test-soulbound` pins the pair | ✅ | Live on every Quincy in the rig: the kidō list is **exactly `[Heizen, Gritz]`** — Heizen free as a cantrip, Gritz at 1 Reiatsu Point |
| Q-12 | §5.3 | **Gritz**. You cannot learn others, and `Additional Kidō` is closed to you. | `test-soulbound` pins the Soul Reaper gate | ✅ | The closure is the same one K-07 drove and the same one that was broken: `Additional Kidō` named *“Soul Reaper lineage”* in `prerequisites`, which pf2e prints and never tests. Its ChoiceSet already refused to offer Heizen or Gritz to anyone else, so a Quincy could not take Gritz twice — but Sōkatsui was open. Predicated on `feature:soul-reaper` now, and live a non-Soul-Reaper handed the feat gets no prompt and no kidō |
| K-22 | §6.5 | A flat rectangular pane of light. **15-foot line**, basic Reflex, **1d6** force damage. | `test-soulbound` pins the line and the ladder | ✅ | Live at 20th (kidō rank 10): **1 action, a 15-foot line at 15 feet, basic Reflex, 5d6 Force** — 1d6 and four H(+2) steps, and no attribute modifier, because it is an area cantrip. Exactly the guide's anchor: 5d6 in a 15-foot line at rank 10, against `Electric Arc`'s 5d4 to two targets |
| K-23 | §6.5 | Range 30 ft., one creature, Reflex save. A man-sized pentacle closes over the target. **Failure** immobilized for 1 round (Escape vs. your Reiatsu DC). **Critical Failure** **restrained** for 1 minute; the target can attempt a new save at the end of each of its turns. | `test-soulbound` pins both outcomes | ✅ | Live: **30 feet, a non-basic Reflex save, 1 Reiatsu Point**, and the critical failure left D1 **restrained** with an `Escape Gritz` action at the Reiatsu DC beside it. Restrained rather than Sai's immobilized — one step better, which is what being a Quincy's only costed art buys |

## Sealing (5th) and Sklaverei (15th) — guide §5.3

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| Q-13 | §5.3 | **Seal the Art** [two-actions] (concentrate, reiatsu) · **Cost** 1 Reiatsu Point | `test-soulbound` pins the action and the price | ✅ | Live: **2 actions**, `concentrate` and `reiatsu`, and the pool moved **1 → 0** for one use. The point is taken **after the roll rather than on the cast**, which is what lets `Reishi Mastery` make a critical success free — a price charged at cast time could not be given back without a refund path |
| Q-14 | §5.3 | **Range** 30 feet, one creature |  | ⚠️ | **Stated and not enforced, in step with pf2e.** The card reads *“Range 30 feet, one creature”*, and the counteract offers a button for every effect on every creature the player targeted, at whatever distance. pf2e enforces the range of nothing — not a spell, not a Strike — so a range check here would be the only one in the system and would refuse things the table had already agreed to. What is enforced is *one creature*: the card asks which single ongoing effect, and switches off exactly that |
| Q-15 | §5.3 | Attempt to **counteract** one ongoing magical effect, stance, aura, or release state affecting the |  | ✅ | Live: the card listed every ongoing effect on the target and switched off exactly the one chosen. The reach is what pf2e's own counteract rules say — a critical success reaches three ranks above yours, a success one, a failure only below — and the effect's rank is read off its own level |
| Q-16 | §5.3 | Your counteract check is your Reiatsu DC's proficiency and key attribute; your counteract |  | ✅ | Live at 20th: the counteract check rolled in the domains **`class, soulbound, str-based, soulbound-check`** with **Master +26** and **Strength +1** — the Reiatsu DC's own proficiency and key attribute, because it *is* the Reiatsu DC's statistic rather than a copy of its numbers |
| Q-17 | §5.3 | rank is **half your level rounded up**. |  | ✅ | Live at 20th, read off a deliberate failure so the number would print: *“rank 40 against a counteract rank of **10**”* — half of twenty, rounded up. Seal the Art is an action and carries no rank of its own, which is exactly why the level is what it falls back to |
| Q-18 | §5.3 | is not ended outright but | `test-soulbound` pins what may be parked | ✅ | **Fixed; it suppressed nothing at all.** The counteract wrote `effect.update({ disabled: true })`, and **a pf2e Effect item has no `disabled` field** — the one it does have, `system.expired`, is derived from `remainingDuration` on every preparation. Driven live before: a Quincy spent a point, the card announced that a 17th-level Shikai was switched off, and all three of its rule elements were still live on the actor a moment later. The rules are **moved aside** now — parked in a flag with the module's own riders beside them, because the rider engine reads those directly and pf2e knows nothing about them. Live after: the Shikai is still on the sheet, not deleted, with **0 rules and 0 live rules on the actor** |
| Q-19 | §5.3 | **suppressed until the end of the target's next turn**, and the target can't re-enter it during | `test-soulbound` pins the block | ✅ | **Both halves, and the second needed two attempts.** The window closes on its own: live, the moment the target's next turn ended, the Shikai came back with its three rules and its rider intact. The re-entry block failed at first — the target **re-sealed**, which takes the release-state effect off the sheet, and with it went the only record that anything was suppressed, so the very next Release went straight through. Washing off a seal by re-sealing is precisely what this clause exists to stop, so the window is stamped on the **actor**. Live after: Release refused while sealed, refused again after re-sealing, and allowed once the turn had ended. *(A rig note: pf2e skips its own end-of-turn work when a combatant has already ended a turn this round — `roundOfLastTurnEnd` — so a window will not close on a turn the rig jumped back to.)* |
| Q-20 | §5.3 | When you successfully counteract with |  | ✅ | Live: the refund, the off-guard and the minute all turn on the same roll's outcome, read once where the counteract resolves rather than three times in three places |
| Q-21 | §5.3 | **Seal the Art**, you regain 1 Reiatsu Point (ignoring Rising Pressure's per-encounter cap), and the |  | ✅ | Live at 20th with Rising Pressure's ledger deliberately stamped as **fully spent for the encounter**: the pool went **1 → 1** across a successful Seal the Art — one point paid for the action and one handed straight back. Written to the pool rather than routed through Rising Pressure, which is what *“ignoring the per-encounter cap”* has to mean |
| Q-22 | §5.3 | target is **off-guard** until the end of its next turn. On a critical success against a release |  | ✅ | **Fixed; it never came off.** `increaseCondition` applies a condition with **no duration**, so a Quincy with Sklaverei left every target they ever sealed permanently off-guard. It is carried by a timed effect now — `Seal the Art: Off-Guard`, `1 round, expiry turn-end` — which is how every other durational condition in the module is applied. Live: the condition is on the target and the carrier says when it goes |
| Q-23 | §5.3 | state, the suppression lasts 1 minute instead. |  | ✅ | **Fixed; there was no critical branch at all.** Every suppression was stamped `end-of-next-turn` whatever the roll. Live after, on a critical success: the seal reads `until: <world time>` rather than a turn count — a minute is not a number of turns, so it is counted on the clock — and the card now says **“suppressed for 1 minute”** instead of naming a turn that is not the window |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 22 |
| ⚠️ | 1 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 2 |
| **Total** | **25** |

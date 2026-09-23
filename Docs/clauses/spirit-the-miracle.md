# Clauses — 🗿 The Miracle

*Spirit tracker. Every independently-failable declaration the guide makes about The Miracle, one row
each. Source: `Docs/soulbound-guide-v1.md` v1.4 §7C (The Miracle) and §9.3 (Apotheosis).*

**Lineage:** Quincy · **Ladder:** Schrift → Vollständig · **Tracker issue:** #76

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

*The Miracle's own shape.* The **last of the fifteen**, and the only one built on a resource **the enemy
controls**: Miracle points accrue by being hit, so every number in the Spirit — a resistance, a die of
damage, a Speed bonus, a fast healing rate, and the price of refusing to die — reads off one counter that
the Quincy cannot fill on their own. Its Release Technique is the class's only **free action**, and the
only one that costs a Reiatsu Point once an encounter rather than once a use. And its Vollständig is the
class's only **repeatable** refusal to die: not once a day, but as many times as the pool can pay for,
with the weapon growing a die step each time.

---

## Schrift Form (1st) — guide §7C The Miracle

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-79a | Schrift Form | Your spirit weapon becomes **1d12 slashing**, two-handed, **forceful**, **shove** |  | ✅ | Live: the Schrift grants **The Miracle — Sword and Shield**, **1d12 slashing**, **forceful**, **shove**, and `held-in-two-hands` — which is how pf2e says “two-handed”, as a usage rather than a trait |
| S-79b | Schrift Form | Your maximum Hit Points increase by your level |  | ✅ | Live, both ways, on the same character in the same minute: maximum Hit Points **143** in the Schrift and **130** sealed. The difference is **13**, the level |
| S-79c | Schrift Form | you gain a **+1 circumstance bonus to saves against effects that would reduce your Hit Points to 0** |  | ✅ | Live: the bonus hangs on a **toggle** — *“The Miracle: this effect would reduce me to 0 HP”* — because no rule element can see the future of a save. Switched on, Fortitude reads **19** against **18**, carrying **The Miracle +1 (circumstance)**; switched off, nothing |

## Release Technique — The Miracle (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-80a | The Miracle | **Release Technique — The Miracle** [free-action] · **Trigger** You take damage from an enemy. | `test-riders` pins the event and the free action | ✅ | **Fixed twice.** It was on `damage-applied`, the attacker's event, and was never offered once — recorded under #71 and repaired there. What was still wrong is what the card **said**: the guide's only [free-action] Release Technique announced itself as a reaction. Live: the card reads **`The Miracle — Growth — free action`** |
| S-80b | The Miracle | **Frequency** once per round. |  | ✅ | **Fixed; the frequency was decoration.** `offerReaction` *reads* `system.frequency.value` and nothing ever decrements it, so the only thing stopping a second offer in one round was a **sixty-second** de-duplication window — and a round at a real table routinely takes longer than a minute. It carries `oncePerRound` now, the ledger the rest of the class uses. Live: a second blow in the same round offered **nothing**, with the round stamped in `riderRounds` |
| S-80c | The Miracle | Gain **2 Miracle points** (to a maximum of 10). |  | ✅ | Live: taking the reaction raised **`Effect: Miracle Points`** by **2** |
| S-80d | The Miracle | While you have 1 or more Miracle points you gain **resistance to all damage equal to the number of Miracle points you have**. |  | ✅ | Live: **`all-damage 2`** at two points and **4** at four — the `Resistance` rule reads `@item.badge.value`, so the number is the counter rather than a copy of it |
| S-80e | The Miracle | You may spend any number of Miracle points as a free action at the start of your turn; for each point spent, until the end of your turn your spirit weapon's Strikes deal **+1d6** damage of its type. | `test-riders` pins the five options and what each buys | ✅ | **Fixed; it was a note to the GM.** The spend shipped as a `prompt` — a card quoting the numbers and applying none of them. It is a `choice` now, one button per point, and **each option is predicated on the points being there**: live with four points, the card offered *Spend 1* through *Spend 4* and **not** *Spend 5*. Clicking *Spend 3* took the counter **4 → 1** and the next Strike rolled **`1d12 + 3d6 + 4 slashing`** — three dice, on the spirit weapon, in its own damage type |
| S-80f | The Miracle | Miracle points are lost when the encounter ends. |  | ✅ | `Effect: Miracle Points` lasts **1 minute**, which is the shape the class already uses for *“lost when the encounter ends”* — ten rounds is an encounter, and pf2e expires it without a sweep of its own. The same proxy carries The Balance's fortune tally |
| S-80g | The Miracle | costs a Reiatsu Point only the first time each encounter; after that it is free | `test-riders` pins the price and its encounter ledger | ✅ | **Fixed; nothing charged it.** Every other price in the class is taken by pf2e when a Technique is **cast**, and this Technique is a reaction — reactions are never cast, so the pool was never touched. A rider may name a `pool` price now, with `oncePerEncounter`. Live across two rounds: the first use took the pool **3 → 2** and stamped the encounter, and the next round's use was offered and **cost nothing** (2 → 2) while still granting its points |

## Refined (9th) — Blitz of the Hero

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-81a | Blitz of the Hero | Your maximum Miracle points increase to **15**. |  | ✅ | Live at the three rungs: the counter's maximum reads **10** as authored, **15** with Refined Release held, and **999** at the Vollständig. Two `ItemAlteration`s predicated against each other, so exactly one can apply |
| S-81b | Blitz of the Hero | When you spend Miracle points, you also gain a **+5-foot status bonus** to Speeds per point spent, to a maximum of +20 feet, until the end of your turn. |  | ✅ | Live in the same click that proved S-80e: spending three points gave **+15 feet**, land Speed **25 → 40**, as a **status** bonus. The +20 ceiling is on the option rather than in a rule — *Spend 5* is labelled and baked at +20, because the cap is on the bonus and not on the spending |

## Vollständig — Bailar de Valquiria (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-82a | Bailar de Valquiria | You gain **fast healing equal to your current Miracle points**. |  | ✅ | Live at the Vollständig with seven points held, on the Quincy's own turn start: *“Received fast healing Miracle Points”*, rolling **7**. pf2e's `FastHealing` writes nothing to the sheet — it acts at turn start and posts the roll — so this is the only place the clause can be read back |
| S-82b | Bailar de Valquiria | When you are reduced to 0 Hit Points while you have at least 5 Miracle points, you instead remain at **1 Hit Point**, lose 5 Miracle points |  | ✅ | Live at **5 Hit Points against 19 damage**: stood at **1 Hit Point**, not dying, and the counter went **7 → 2**. The five points are the price, taken from the badge rather than from the pool |
| S-82c | Bailar de Valquiria | your spirit weapon's damage die increases by one step for the rest of the encounter | `test-soulbound` counts it among the forms that give a die step | ⚠️ | **The tally accrues; the step has nowhere to go.** Each refusal now adds one to **`Effect: The Miracle — Grown`** — live, badge **1** after the first and **2** after the second — and `die-steps.mjs` reads that badge, so the steps are real and cumulative. But The Miracle's own sword **starts at 1d12**, which is pf2e's largest weapon die: `nextDie` caps there, and the weapon read **1d12** after two refusals. The machinery is right and this Spirit is the one weapon in the class it cannot show on |
| S-82d | Bailar de Valquiria | This can occur any number of times as long as you have the points to pay for it. |  | ✅ | Live, both ways: with **2** points left the refusal could not be paid for and the Quincy went to **0**; topped up to **6** it fired again — 1 Hit Point, counter **6 → 1**, tally **2**. No frequency anywhere, which is what *“any number of times”* means |
| S-82e | Bailar de Valquiria | Miracle points are no longer capped, but you still gain only 2 per round. |  | ✅ | Live: the counter's maximum reads **999** at the Vollständig against 15 at Refined. *“Still gain only 2 per round”* is the Release Technique's own `oncePerRound` (S-80b), so the two halves are one sentence enforced in two places |

## Severing Art — Apotheosis (guide §9.3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-26a | Apotheosis | **30-foot emanation**, basic Fortitude, **force**. |  | ✅ | Cast live in Severance: the card reads **Area 30-foot emanation**, **Defense basic Fortitude**, and the damage rolled **`20d6 force`** |
| R-26b | Apotheosis | You gain temporary Hit Points equal to **twice your level**. |  | ✅ | Live at 13th: temporary Hit Points **0 → 26**, twice the level |
| R-26c | Apotheosis | At the start of your next turn the emanation detonates a second time for **half** the Waning dice. | `test-riders` pins the substitution that captures the dice | ✅ | **Fixed, and it was a timing bug.** The second detonation asked for `origin.severance.dice` when it fired — *“the Waning dice as they stand now”* — and by the start of the next turn there is no Severance left to ask: using a Severing Art ends it, so the table read **0** and the formula fell through to its literal fallback. Driven live before: the second blast rolled **1d6** where the first had rolled 20d6. The dice are baked into the effect at cast time now. Live after: **`20d6 * 0.5 force`** on a failure, `* 0.25` on a success and the full `20d6` on a critical failure — half the Waning dice, with the basic ladder on top |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 19 |
| ⚠️ | 1 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **20** |

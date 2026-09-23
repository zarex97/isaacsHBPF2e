# Clauses — ⚖ The Balance

*Spirit tracker. Every independently-failable declaration the guide makes about The Balance, one row
each. Source: `Docs/soulbound-guide-v1.md` v1.4 §7C (The Balance) and §9.3 (The Reckoning).*

**Lineage:** Quincy · **Ladder:** Schrift → Vollständig · **Tracker issue:** #73

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

*The Balance's own shape.* The class's **only flat numeric bonus**, and the guide says so in as many
words — a +1 circumstance bonus to AC that **switches off the moment the pool is spent**, which is a
clause that fails by being permanently on. Its Release Technique is the second of the class's two
reactions, and the only one that does three things at once: reduce what landed, hurt somebody else, and
leave a penalty behind. Its Refined rung adds a **once per day** stand-at-1-Hit-Point, a frequency the
class uses nowhere else. And its Vollständig is the only rung in the class that **moves damage from one
creature to another** — an ally's harm redirected onto the Quincy, reduced, and paid for with neither a
reaction nor an action.

---

## Schrift Form (1st) — guide §7C The Balance

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-71a | Schrift Form | Your spirit weapon becomes **Freund Schild** *(Substitute Shield)* |  | ✅ | Live, both ways: sealed, the character carries the **Blade** and nothing else; Releasing grants **Freund Schild** beside it, and sealing takes it away again — 0 → 1 → 0 → 1 over two full cycles. (Three orphaned copies were found on the fixture from earlier sessions, each with `grantedBy: null`; a clean cycle does not produce them, so they are an artefact of an effect deleted without its cascade rather than of the grant) |
| S-71b | Schrift Form | **1d8 slashing**, versatile P, **parry** |  | ✅ | Live: the profile reads **1d8 slashing** with **parry** and **versatile-p** — the guide's three, and the versatile P that makes it Haschwalth's blade rather than a shield |
| S-71c | Schrift Form | You gain a **+1 circumstance bonus to AC** while you have at least 1 Reiatsu Point remaining | `test-riders` pins the published option and what predicates on it | ✅ | **Fixed; it was never on.** The bonus was predicated on `{gte: ["self:resource:focus:value", 1]}`, and **pf2e publishes no roll option for a resource at all** — `getRollOptions()` had nothing matching `self:resource:` on a character holding three points, so the one flat numeric bonus in the class could never apply. The effect now publishes `soulbound:reiatsu-remaining` from a resolvable `gte(@actor.system.resources.focus.value,1)` and the modifier predicates on that. Live, both ways: **AC 27** with three points, carrying **The Balance +1**, and **AC 26** at zero with the modifier gone and the option withdrawn |

## Release Technique — The Balance (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-72a | The Balance | **Release Technique — The Balance** [reaction] |  | ✅ | Live: a whispered reaction card, *"You have been hurt. Move the misfortune onto someone else?"*, offered to the Quincy alone |
| S-72b | The Balance | **Trigger** You take damage from a creature or effect you can perceive | `test-riders` asserts the event, and the `damage-applied` roster records the move | ✅ | **Fixed, and it had never been offered once.** The rider was keyed to **`damage-applied`** — *"damage from **this actor's** item landed on a target"*, the attacker's event — so being hit consulted the attacker's items and never the Quincy's. Driven live before the fix: an NPC hit the Balance for **18** and no card appeared. It is `damage-received` now, the same repair Antithesis' S-63c needed and the second Spirit to need it. *"From a creature or effect you can perceive"* is unchecked, as every perception clause in this campaign has been |
| S-72c | The Balance | Reduce the damage you take by **twice your level** |  | ✅ | **Fixed; there was no reduction at all.** The reaction handed out a saves penalty and nothing else — nothing in the content reduced the damage the Quincy took. `Effect: The Balance — Redistributed` is the reduction, shaped like Antithesis' *Reversed*. Live at 13th: **`all-damage 26`**, twice the level, on the Quincy the instant the reaction is taken |
| S-72d | The Balance | then choose one enemy within 60 feet: it takes **2d6** spirit damage | `test-riders` pins the picker's range and what it hands out | ✅ | **Fixed: the choice exists now.** The damage always landed — live, **`2d6 + 3d6 spirit`, 16** on the creature that struck. What was missing was *“choose one enemy within 60 feet”*: `trigger: true` can only reach the creature at the other end of the event, and `apply.type: "choice"` posts buttons for **authored** options rather than for creatures. `apply.type: "pick"` reads the board when the card is posted, the way the counteract card does, and the chosen token travels on the button. The triggering creature remains the common answer and is now a choice rather than the only one |
| S-72e | The Balance | until the end of its next turn it takes a **−1 status penalty** to saving throws |  | ✅ | Live on the creature that struck: **`Effect: The Balance — Held`**, a **−1 status penalty** reaching Fortitude, Reflex and Will, for **1 round** — *"until the end of its next turn"* |
| S-72f | The Balance | **Heightened (+2)** +1d6 | `test-riders` asserts the interval | ✅ | Live at rank 7 against a base rank of 1: **`2d6 + 3d6`** — six ranks up, three increments at **(+2)**, three dice. `perStepInterval: 2` is the field Antithesis and Ennetsu Jigoku already use |

## Refined (9th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-73a | Refined | The Balance's status penalty applies to **AC and saving throws** |  | ✅ | Live with Refined Release held: the effect handed to the struck creature is **`Effect: The Balance — Held (Refined)`**, and its modifiers read **The Balance −1** on **AC** as well as on Will. The two variants are predicated against each other on `feature:refined-release`, so exactly one can be chosen |
| S-73b | Refined | if the triggering damage would have reduced you to 0 Hit Points, you instead remain at 1 Hit Point | `test-riders` pins the declaration and its predicate | ✅ | **Fixed; the clause did not exist.** `refuse-death.mjs` has been general since *Bailar de Valquiria* — its own docstring names The Balance as one of the three cases it was generalised for — and **nothing ever gave The Balance the flag**. A declaration may now carry a `predicate`, which is what this clause needs: Refined is a class feat rather than a rung with an item of its own, so the price lives on the Spirit's form feature and names the rung it belongs to. Live at 5 Hit Points against 13 damage: the Quincy stood at **1 Hit Point**, not dying |
| S-73c | Refined | This last clause functions once per day |  | ✅ | Live, in the same run: the form feature's frequency went **1 → 0** with the refusal, and the very next identical blow took the Quincy to **0** — the allowance spent, the second death not refused |

## Vollständig — The Balance, at Night (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-74a | At Night | Your Release Technique's damage reduction increases to **three times your level** |  | ✅ | Live, both ways, on the same character: **`all-damage 39`** at the Vollständig against **26** at the Schrift — three times the level against twice. The two are one effect with two `Resistance` rules predicated against `soulbound:the-balance:at-night`, which the Vollständig effect already published and nothing had read |
| S-74b | At Night | Once per round, when an **ally** within 60 feet would take damage, you may redirect that damage to yourself | `test-riders` pins the reach, the once-a-round gate and the order inside | ✅ | **Fixed with S-63b, and it needed one thing more.** The reach is the new `ally-damaged` event; the *amount* needed `event.damage.total`, because `describeDamage` published only `rider:damage:dealt` — a flag — and a redirect has to know **how much**. Live at the Vollständig: an NPC hit the Quincy's ally for **18**, the Quincy was offered the card, and taking it gave the ally its **18 Hit Points back** (62 → 80). Two bugs were found and fixed driving this: the hit points were read off a **contextual clone** pf2e builds for the apply button, so `landed` was 0 for every character; and a message-less event shared one de-duplication key, so every offer after the first was swallowed for a minute |
| S-74c | At Night | you then apply your Release Technique's reduction to it as a free action without spending your reaction |  | ✅ | Live in the same run: **`Effect: The Balance — Redistributed`** goes on the Quincy **before** the harm is moved onto them — the order inside the rider is load-bearing — and the 18 was absorbed whole by **resistance 60**, three times level 20, leaving them at **100 → 100**. The reduction is the same effect the Release Technique uses, so the clause's *“apply your Release Technique's reduction to it”* is literally that rather than a second number |
| S-74d | At Night | You may do this even while your reaction is spent |  | ✅ | Live: the card is headed **“Effect: The Balance, at Night — free action”**, not “reaction”. A reaction rider may now declare `freeAction`, which is the honest half of this clause; the other half is honest by accident — the module has never tracked a *spent* reaction, so nothing was stopping it. What `looksAbleToReact` actually gates on is being able to act at all (unconscious, paralyzed, petrified, stunned), which is the right gate for a free action too |
| S-74e | Sight of the Balance | **Sight of the Balance:** at the start of each of your turns, choose one enemy within 60 feet | `test-riders` pins the picker and both effects it hands out | ✅ | **Fixed; this is what the picker was built for.** It fires at the **start of a turn**, so there is no trigger to point at and `trigger: true` — the module's only other way to reach a creature that is not the rider's target — has nothing to reach for. Live: the Quincy's turn began and a whispered card offered every enemy within 60 feet by name (*D1, D2, D3, D4, ZZ Victim, Ghoul Soldier*) |
| S-74f | Sight of the Balance | Until the start of your next turn, that creature's fortune and misfortune are yours to allot — it takes a **−2 status penalty** to its next saving throw |  | ✅ | Live on the creature chosen from that card: **`Effect: Sight of the Balance`**, reading **The Balance −2 (status)** on D3's Will. `removeAfterRoll` is what makes it *“its **next** saving throw”* rather than a round of them |
| S-74g | Sight of the Balance | the next ally who attacks it gains a **+1 status bonus** to that attack roll |  | ⚠️ | **The bonus reaches the allies; it is not tied to the creature.** Live in the same click: **`Effect: Allotted Fortune`** landed on the **ally** — not on the enemy and not on the Quincy — reading **+1 (status)** on their Strike, and `removeAfterRoll` makes it one attack. What it cannot say is *“the next ally who attacks **it**”*: a pf2e effect has no way to be about one specific creature without baking that creature's signature into a predicate at hand-out time, which the module can do (`substitutions`) but does not here. So the ally gets their +1 on whatever they attack next. Fixing this half found the other one: a pick's nested riders now resolve their own targets, which is why the ally's bonus is not on the enemy — before that both halves landed on the creature the clause is aimed *against* |

## Severing Art — The Reckoning (guide §9.3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-24a | The Reckoning | **One creature within 60 feet**, basic Fortitude, **spirit**. |  | ✅ | Cast live in Severance at 20th: the card reads **Range 60 feet; Targets 1 creature**, **Defense basic Fortitude**, and the damage rolled **`20d6 spirit`** |
| R-24b | The Reckoning | Ignores **all** resistances and immunities. The target is **doomed 1**. |  | ✅ | Both halves live. **Ignores all resistances and immunities:** against a dummy carrying **immunity to spirit** *and* **resistance 1000 to all damage**, every point of the **51** landed — 400 → 349. **Doomed 1:** on a forced critical failure, pf2e's own `doomed` condition at **1**, with the fortune tally standing at two |
| R-24c | The Reckoning | If you have used your Release Technique at least three times this encounter, it is **doomed 2** instead. | `test-riders` asserts the two doomed riders and their predicates | ✅ | **Fixed; the clause was not written.** The Reckoning carried one doomed rider and nothing counted uses of the Release Technique. The reaction now adds one to **`Effect: The Balance — Fortune Held`**, a counter badge lasting a minute — the shape *Effect: Miracle Points* already uses for *"lost when the encounter ends"* — and pf2e publishes a numeric badge as `self:effect:<slug>:<value>`, so the clause is a predicate rather than a second Technique. Live on the same card and the same critical failure: **Doomed 1** at a tally of **2**, **Doomed 2** at a tally of **3** |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 21 |
| ⚠️ | 1 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **22** |

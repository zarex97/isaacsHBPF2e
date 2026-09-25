# Clauses — the nine Instincts

*Instinct tracker. The nine Instinct clauses, one row per independently-failable sentence. Source:
`Docs/assimilator-guide-v1.md` §5.1 — **the guide's table, not the lexicon's**: §5.2 amends Blue, White
and Black so that every clause keys off Depth, and the lexicon's §2.1 still carries the old wording.*

**Tier:** Instincts · **Tracker issue:** #94

## How a row is marked

| Mark | Meaning |
| :-- | :-- |
| ☐ | Not yet driven |
| ✅ | Driven live; the clause happened by itself |
| ⚠️ | Driven live; partially happens — the gap is named in **Evidence** |
| ❌ | Driven live; does not happen |
| 🔧 | Was ❌ or ⚠️, a fix has landed, awaiting re-drive |
| — | Nothing to automate (pure roleplaying / GM ruling) |

**Clause** is a verbatim fragment of the guide (`Docs/assimilator-guide-v1.md`). `build/check-clauses.mjs` asserts it still is one, so a
paraphrase here or an edit to the source fails the build. **Static check** names the assertion that
guards it; **Evidence** names what proved it happened at the table.

*How a clause is driven — the rig, the traps it sets and what a ✅ owes — is
`Docs/tools/live-verification.md`. It is the one copy; this file records results, not method.*

*Nothing is implemented yet.* Every row starts ☐, and the Assimilator is being built against these
rows rather than checked after the fact — a clause is done when it is ✅, not when its JSON exists.

*The Instincts' own shape.* An Instinct clause applies to **every Mutation you have**, whatever its colour,
so none of these can be driven with one Substrate: each wants a Mutation of another colour under it, to prove
the clause follows the Instinct rather than the gem. The programme's §5 sorts them into four shapes —
damage-roll addition (Red, Orange), on-damage side effect (Green, White, Black), rule-element only (Gray,
Purple), a granted action (Blue, Gold) — and every "per Depth" here is a **provenance** question: which
Substrate produced this damage, and at what Depth.

How the Instinct is **derived** — most Mass, ties broken freely, recalculated at daily preparations — is
the class tracker's (`A-43`–`A-46`). This file is what each one does once it is yours.

**IDs are `I-<n><letter>`**, numbered in the guide's order: 1 Red, 2 Gold, 3 Orange, 4 Blue, 5 Purple,
6 Green, 7 Black, 8 White, 9 Gray.

---

## The damage type (guide §4.5)

`I-0` is true of all nine, so it is numbered 0. Cobalt, Platinum, Nickel's gland and *Spit* read it.

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| I-0 | §4.5 | Your Instinct also sets **your Instinct's damage type**, which any rule asking for it uses: Red **fire**, Gold **force**, Orange **electricity**, Blue **cold**, Purple **mental**, Green **poison**, Black **void**, White **vitality**, Gray **bludgeoning**. |  | ☐ |  |

## The clauses (guide §5.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| I-1a | Red | When a Mutation deals damage, it deals **+1 damage per Depth** of its Substrate. | `test-assimilator` pins it | ⚠️ | Live: the breakdown reads **Red Instinct +1** with Iron at 1, **+4** with Ruby 2 and Iron 2 (Ruby at Depth 1 adds no damage and does not count), **+7** with Ruby 3, Iron 1, Garnet 3. **The gap:** the bonus is the sum of the Depths of every Mutation that *can* add damage to the Strike, so Garnet's 3 counted against a creature its die did not fire on. Exact per-roll provenance would need a damage-roll hook pf2e does not offer |
| I-1b | Red | Against a creature that has already lost Hit Points this encounter, **double** that bonus. |  | ✅ | Live, the same Strike at the same target twice: **+1** before it lost Hit Points in the encounter, **+1 more** — *Red Instinct (already bloodied)* — after. **Fixed while driving:** the mark was written as `damaged-this-encounter`, which a target's options never carry (pf2e keeps only `self:` keys), and it also caught creatures outside the fight; it is now `self:damaged-this-encounter` and only on combatants |
| I-2a | Gold | At daily preparations choose one bound Substrate; it counts as **one Depth higher** for its numeric effects, never above your Depth cap. |  | ☐ |  |
| I-2b | Gold | When you critically hit, you may apply that Substrate's **Depth 4 rider** even if it isn't at Depth 4. |  | ☐ |  |
| I-3a | Orange | The first time each round you Stride, Step or use a reaction, your next Mutation this round deals **+1d4** of its own damage type. |  | ☐ |  |
| I-3b | Orange | **+5 feet Speed** per bound Orange Substrate. |  | ☐ |  |
| I-4a | Blue | **Study** a creature (one action). |  | ☐ |  |
| I-4b | Blue | Until the encounter ends, your Mutations treat its resistances as **lower by twice your highest Depth**, and you gain **+1 circumstance to AC** against it. |  | ☐ |  |
| I-4c | Blue | One creature at a time. |  | ☐ |  |
| I-5a | Purple | Your Mutations count as **magical**. |  | ☐ |  |
| I-5b | Purple | At daily preparations one Substrate of your choice manifests **one Depth higher**, and one other, randomly determined, manifests **one Depth lower**. |  | ☐ |  |
| I-6a | Green | When a Mutation deals damage, gain **temporary Hit Points equal to its Depth**. |  | ☐ |  |
| I-6b | Green | **Fast healing equal to the number of bound Green Substrates.** |  | ☐ |  |
| I-7a | Black | When a Mutation damages a creature, it takes a **−1 status penalty** to one check or DC of your choice until the end of its next turn, and **you gain +1 status to the same thing**. |  | ☐ |  |
| I-7b | Black | At Depth 3+ the penalty and bonus become **−2 / +2**. |  | ☐ |  |
| I-8a | White | When a Mutation deals damage, one ally within 30 feet gains **temporary Hit Points equal to its Depth**. |  | ☐ |  |
| I-8b | White | **A number of times per day equal to your highest Depth**, end one condition on yourself or an ally as a free action. |  | ☐ |  |
| I-9a | Gray | Your Carapace's **Hardness increases by the total Depth of your bound metals**. |  | ☐ |  |
| I-9b | Gray | When you use a Mutation, gain **resistance equal to its Depth** to all physical damage until the start of your next turn. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 18 |
| ✅ | 1 |
| ⚠️ | 1 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **20** |

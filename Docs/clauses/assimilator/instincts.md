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

*How they are built (Phase 4).* Each Instinct is an effect, `Instinct: <Colour>`, whose rules read numbers the
engine works out (`derived.iv`) at full or — under Electrum Depth 3 — half value. What happens *on an event* is
`scripts/assimilator/instincts.mjs`. "A Mutation" and "its Depth" are read off the damage roll itself: every
Substrate damage die and modifier is slugged `substrate-<slug>`, and the roll records which ones fired. The clauses
that say "of your choice" (Black's check, White's ally, Purify's condition) are cards and a picker the player answers.

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
| I-0 | §4.5 | Your Instinct also sets **your Instinct's damage type**, which any rule asking for it uses: Red **fire**, Gold **force**, Orange **electricity**, Blue **cold**, Purple **mental**, Green **poison**, Black **void**, White **vitality**, Gray **bludgeoning**. | `rig`, `test-assimilator` | ✅ | Rig, live: Ruby, Sapphire, Onyx and Pearl builds set the Instinct's type to **fire, cold, void, vitality**. The Gland under Red dealt **fire** (NI-1f). Electrum's second colour never sets it: the `assimilator:instinct:<colour>` option is written by the engine for the primary alone |

## The clauses (guide §5.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| I-1a | Red | When a Mutation deals damage, it deals **+1 damage per Depth** of its Substrate. | `rig`, `test-assimilator` | ✅ | Rig, live: Ruby 3 + Iron 2 + Garnet 2 against a creature that is not dying — the roll's Red Instinct modifiers sum to **5**; Garnet's die did not fire, so neither did its bonus. Silver at 2 against an undead fiend (both of its rules fire) still counts **once**: 5. **Fixed:** the bonus was one sum of every Mutation that *could* add damage; it is now one modifier per Substrate damage rule, gated by that rule's own predicate, so it fires exactly when the Mutation does |
| I-1b | Red | Against a creature that has already lost Hit Points this encounter, **double** that bonus. | `rig` | ✅ | Rig, live, in an encounter: **5** before the target had lost Hit Points, **10** after (re-driven after the per-Substrate rewrite) |
| I-2a | Gold | At daily preparations choose one bound Substrate; it counts as **one Depth higher** for its numeric effects, never above your Depth cap. | `rig`, `test-assimilator` | ✅ | Rig, live: Ruby 1 chosen under Gold manifests at **2**; Ruby 4 chosen at the Depth cap stays **4**. Chosen in the Gullet at daily preparations. **Fixed while driving:** the first rebuild derived the Depths before the Instinct had settled, so the raise waited a rebuild; it re-derives once it settles |
| I-2b | Gold | When you critically hit, you may apply that Substrate's **Depth 4 rider** even if it isn't at Depth 4. | `rig` | ⚠️ | Rig, live: a critical hit under Gold with Sapphire chosen posts a card quoting **Sapphire's Depth 4 row** (the slow). Applying it is the table's — a Depth 4 rider is written against Depth 4 and is not re-run by the module |
| I-3a | Orange | The first time each round you Stride, Step or use a reaction, your next Mutation this round deals **+1d4** of its own damage type. | `rig`, `test-assimilator` | ✅ | Rig, live, in an encounter: the first Stride primed *Kinetic Surge*; a second Stride that round did not; the next Strike carried **1d4 fire** (Ruby's type — the deepest damaging Mutation's) and spent it. A reaction primes it the same way. Resolved: "its own damage type" on a Strike carrying several Mutations is the deepest one's |
| I-3b | Orange | **+5 feet Speed** per bound Orange Substrate. | `rig`, `test-assimilator` | ✅ | Rig, live: two bound Orange Substrates — the land Speed breakdown reads **Orange Instinct +10** beside Carnelian's own bonus |
| I-4a | Blue | **Study** a creature (one action). | `rig` | ✅ | Rig, live: *Study* (granted by the Blue Instinct) on the target put **Effect: Studied** on it, until the encounter ends |
| I-4b | Blue | Until the encounter ends, your Mutations treat its resistances as **lower by twice your highest Depth**, and you gain **+1 circumstance to AC** against it. | `rig`, `test-assimilator` | ✅ | Rig, live: the same Strike against physical resistance 10, Studied and not — the Studied application took exactly what resistance **4** allows (10 lower by twice Sapphire 3). The creature's attack against the Assimilator met **AC +1**: pf2e never shows a defender's AC the attacker's options, so the Studied creature carries the bonus to its target as an EphemeralEffect |
| I-4c | Blue | One creature at a time. | `rig` | ✅ | Rig, live: Studying the bystander took Studied off the target |
| I-5a | Purple | Your Mutations count as **magical**. | `rig` | ✅ | Rig, live: the Carapace Strike's weapon traits include **magical**. **Fixed while driving:** `AdjustStrike` on `traits` changes the Strike action's traits; the weapon's are `weapon-traits` |
| I-5b | Purple | At daily preparations one Substrate of your choice manifests **one Depth higher**, and one other, randomly determined, manifests **one Depth lower**. | `rig`, `test-assimilator` | ✅ | Rig, live: Ruby 1 chosen manifests at **2**; Iron, rolled, at **0** — it does not manifest today. Thirty rolls picked among the others and never the raised one. The roll is made when the choice is first set and again each morning. **Ruling:** the clause names no cap, so the raise may pass the Depth cap (never above 4); a Depth 1 Substrate lowered does not manifest that day |
| I-6a | Green | When a Mutation deals damage, gain **temporary Hit Points equal to its Depth**. | `rig`, `test-assimilator` | ✅ | Rig, live: a Strike with Ruby 2 in it gave the Assimilator **2** temporary Hit Points (Emerald, adding no damage, counts for nothing) |
| I-6b | Green | **Fast healing equal to the number of bound Green Substrates.** | `rig`, `test-assimilator` | ✅ | Rig, live, in an encounter: two bound Green Substrates — pf2e posted *Received fast healing — Green* for **2** at the start of the Assimilator's turn, as it does for any fast healing |
| I-7a | Black | When a Mutation damages a creature, it takes a **−1 status penalty** to one check or DC of your choice until the end of its next turn, and **you gain +1 status to the same thing**. | `rig` | ✅ | Rig, live: after a Strike with Ruby 2, the card's **Will** button (clicked) gave the target **−1** status to Will and the Assimilator **+1**, until the end of the target's next turn |
| I-7b | Black | At Depth 3+ the penalty and bonus become **−2 / +2**. | `rig` | ✅ | Rig, live: Ruby 3 dealt it — **AC**, chosen on the card: **−2 / +2** |
| I-8a | White | When a Mutation deals damage, one ally within 30 feet gains **temporary Hit Points equal to its Depth**. | `rig` | ✅ | Rig, live: the one ally within 30 feet gained **2** temporary Hit Points. With several allies the card offers each, and the player picks |
| I-8b | White | **A number of times per day equal to your highest Depth**, end one condition on yourself or an ally as a free action. | `rig`, `test-assimilator` | ✅ | Rig, live: *Purify* (granted by the White Instinct) holds **3** uses a day at highest Depth 3; used with no target, the condition picker ended **frightened** on the Assimilator and **2** uses were left |
| I-9a | Gray | Your Carapace's **Hardness increases by the total Depth of your bound metals**. | `rig`, `test-assimilator` | ✅ | Rig, live: Steel 3 + Iron 2 — the Living Plate's Hardness is **5** above its own and the Substrates' bonus |
| I-9b | Gray | When you use a Mutation, gain **resistance equal to its Depth** to all physical damage until the start of your next turn. | `rig` | ✅ | Rig, live: rolling a Strike with Ruby 2 in it gave *Integrated Plating* at **2**, and the next 10 slashing took **8**. A Mutation's own action gives its Substrate's Depth |

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

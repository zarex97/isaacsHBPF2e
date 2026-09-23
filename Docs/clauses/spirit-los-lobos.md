# Clauses — 🐺 Los Lobos

*Spirit tracker. Every independently-failable declaration the guide makes about Los Lobos, one row each.
Source: `Docs/soulbound-guide-v1.md` v1.4 §7B (Los Lobos) and §9.2 (Aullido).*

**Lineage:** Hollow · **Ladder:** Resurrección → Segunda Etapa · **Tracker issue:** #67

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

*Los Lobos' own shape.* The only **ranged** spirit weapon in the class, and the only one that is a
**pair** — two pistols wielded and fired together, where every other Spirit holds one thing. Its Segunda
Etapa is the class's nearest approach to minions and deliberately stops short of them: eight wolves that
are *not creatures*, spent from a pool rather than commanded, with a per-turn refill and a Severing Art
that cashes every one of them in at once. Two clauses are about what the wolves **are not**, which is the
hardest kind of promise to keep at a table and the easiest to break by accident.

---

## Resurrección (1st) — guide §7B Los Lobos

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-52a | Resurrección Form | Each is a ranged weapon: **1d6 piercing**, **agile**, **range increment 60 feet**, **reload 0**, and they need no ammunition | `test-soulbound` pins the built-in ammunition on both ranged spirit weapons | ✅ | **Fixed, and it was the worst fault of the Spirit: the pistols could not be fired at all.** `baseItem: flintlock-pistol` makes pf2e demand ammunition — *"No ammunition is assigned to Los Lobos — Pistols"*, no roll, no chat message, nothing. `system.ammo.builtIn` is pf2e's own field for a weapon that carries its own, and it is what *"they need no ammunition"* means. Live after the fix: **1d6 piercing**, **agile**, **range 60**, **Reload 0**, and two Ranged Strikes landed where two had been refused. **The Quincy's Spirit Bow had the identical fault** and is fixed with it — every Quincy in the world was holding a bow that could not shoot |
| S-52b | Resurrección Form | You may wield and fire both |  | ✅ | Live: two Strikes in one turn off the one entry, at **+13** then **+9 (MAP −4)** — the agile penalty, which is what a matched pair is priced by. One entry is the house model and the guide's own §6 table confirms it deliberately: Paired Blades are given the **twin** trait there and the pistols are not, so nothing is owed beyond firing both. The residue is hands: one item is held in one hand, so `handsFree` reads **1** where a character wielding two pistols has none |
| S-52c | Resurrección Form | your Speed increases by 5 feet |  | ✅ | Live, both ways: Speed **30 → 35** with the form, and the breakdown reads `Sonido untyped 5` + `Los Lobos status 5`, both counting. Worth recording against the automation note on *Hierro and Sonido*, which says a **status** bonus on the Speed selector *"is listed in Foundry's breakdown but contributes nothing to the total"* — in pf2e 8.4.1 it plainly does, and Sonido is authored untyped for a reason that has expired |

## Release Technique — Cero Metralleta (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-53a | Cero Metralleta | **Release Technique — Cero Metralleta** [two-actions] |  | ✅ | Live: the card reads **2** actions, Focus 5 |
| S-53b | Cero Metralleta | **60-foot cone**, basic Reflex, **2d6** force damage |  | ✅ | Same card: **Range 60 feet; Area 60-foot cone**, **Defense basic Reflex**; the damage rolled **`6d6 force`** at rank 5, which is 2d6 and four increments |
| S-53c | Cero Metralleta | You may instead shape it as a **120-foot line** | `test-soulbound` pins the line shape to the variant that carries it | ✅ | **Fixed.** The choice was offered — *"Cero Metralleta can be released as either shape. Which is it?"* — and the Region really was a 120-foot line, but the **chat card still read `Area 60-foot cone`**, because the answer never reached pf2e. The content already shipped the variant and nothing loaded it. Live after the fix: the card reads **Cero Metralleta (line) — Range 120 feet; Area 120-foot line**, and the cone still reads as the cone |
| S-53d | Cero Metralleta | **Heightened (+1)** +1d6 |  | ✅ | Live at rank 5: **`6d6 force`** — 2d6 and four increments |

## Refined (9th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-54a | Refined | You may **Sustain** Cero Metralleta at the start of your next turn to fire it again in a different direction without spending a Reiatsu Point | `test-riders` asserts the free shot is gated on the Sustain | ✅ | **Fixed.** The allowance was not tied to the Sustain at all: the *first* Cero Metralleta of an encounter was free, once every round, forever — Refined removed the Technique's cost rather than buying a second shot. Using the Sustain now leaves `Effect: Cero Metralleta — Sustained` until the end of your turn, and that is what the free cast is predicated on. Live, both cells: without it the cast **paid** (2 → 1) and said nothing; after it the cast was **free** (1 → 1) and announced *"Cero Metralleta — Sustain paid for Cero Metralleta — no Focus Point spent"*. The marker lasting one turn is the once-per-round gate, and 2 actions + 1 action leaves no room for a second free shot |

## Segunda Etapa — Colmillo (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-55a | Colmillo | **Eight spirit wolves** appear in unoccupied squares within 30 feet | `test-soulbound` pins the pool at eight | ✅ | Live on entering the Segunda Etapa: `Effect: Colmillo` arrives carrying a counter badge of **8 / 8**. *"In unoccupied squares within 30 feet"* is not modelled and does not need to be — the guide's own anchor note calls them **a charge pool**, and where they stand is a sentence for the table |
| S-55b | Colmillo | They are **not creatures**: they have no statistics, take no actions, cannot be attacked, and do not flank |  | ✅ | Live: there is no wolf token on the scene and no wolf actor in the world — the eight are a number on a badge. Nothing to attack, nothing to flank with, no statistics to give them, and no way to give them an action. The clause is kept by there being nothing there |
| S-55c | Colmillo | **Colmillo** [one-action] · **Requirements** at least one wolf remains |  | ✅ | Live: the card reads **1** action and prints *"Requirements at least one wolf remains"*, and the pool is what the cast now spends from — with none left, `Charges` refuses it out loud rather than casting and quietly not charging |
| S-55d | Colmillo | Each wolf you expend moves to a point within 60 feet and detonates in a **10-foot burst**: **3d6** force damage, basic Reflex | `test-soulbound` asserts the spend and that the burst count comes from it | ✅ | **Fixed, and it was inert.** Neither Colmillo nor Aullido declared a spend, so the pool filled to eight and never emptied: Colmillo was an unlimited one-action 3d6 burst. It was also capped at **one** area where the guide says *"**each** wolf you expend … detonates"*. One question now decides both — *"How many do you spend? 8 left."* — and the answer is the number of bursts aimed and the number of wolves paid. Live: chose **3**, aimed three 10-foot bursts, pool **8 → 5** |
| S-55e | Colmillo | A creature in more than one burst takes damage only from the highest |  | ✅ | Live: D1 stood inside two of the three bursts and was targeted **once**. Three areas aimed in one cast are caught as one set, so a creature in more than one takes one lot of damage — which is the clause, kept by the shape of the cast rather than by the `overlap` rule beside it |
| S-55f | Colmillo | At the start of each of your turns, you regain 1 wolf (to a maximum of eight) | `test-soulbound` pins the refill to one a turn, unconditionally | ✅ | Live, with the control: the pool went **5 → 6** at the start of the Los Lobos' own turn, stayed at **6** through the enemy's whole turn, and went **6 → 7** at the start of the next own turn. One a turn, on your turn, to a maximum of eight |

## Severing Art — Aullido (guide §9.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-20a | Aullido | **40-foot burst** within 120 feet, basic Reflex, **force** |  | ✅ | Cast live in Severance round 1 at 20th: the card reads **Range 120 feet; Area 40-foot burst**, **Defense basic Reflex**, 2 actions, the aimed Region measures 800px — 40 feet — the damage rolled **`20d6 force`**, and *"Aullido ends Severance"* followed it |
| R-20b | Aullido | **Requirements** at least one wolf remains. You expend **all** remaining wolves and regain none for the rest of the encounter | `test-soulbound` asserts Aullido expends all of them | ✅ | **Fixed with the same finding as S-55d.** Live, watching the badge as the cast resolved: **6 → 0**, every remaining wolf. *"Regain none for the rest of the encounter"* is kept by the ladder rather than by a second rule — Aullido ends Severance, ending Severance takes the Released Form, and the refill lives on `Effect: Colmillo`, which goes with it |
| R-20c | Aullido | If you had **five or more**, creatures that critically fail are also knocked **prone** and **stunned 1** |  | ⚠️ | **Half of it happens.** Live on a forced critical failure: the target was knocked **prone** and **stunned 1**. But *"if you had five or more"* gates nothing — Aullido expends every wolf **as it is cast**, and the riders fire when a save is rolled, by which time the pool is empty and there is no count left to ask about. Writing a predicate for it would have named a roll option nothing publishes, which is worse than over-firing, so the riders are left open and the content says why. Reaching it needs the spent count carried through the cast, which the rider engine has no seam for |

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

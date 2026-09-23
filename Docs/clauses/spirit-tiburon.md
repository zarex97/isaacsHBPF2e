# Clauses — 🦈 Tiburón

*Spirit tracker. Every independently-failable declaration the guide makes about Tiburón, one row each.
Source: `Docs/soulbound-guide-v1.md` v1.4 §7B (Tiburón) and §9.2 (Ola Azul).*

**Lineage:** Hollow · **Ladder:** Resurrección → Segunda Etapa · **Tracker issue:** #68

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

*Tiburón's own shape.* The **last Hollow Spirit**, and the one that pushes people around: three of its
clauses are forced movement and a fourth is terrain. Its Segunda Etapa is the only rung in the class that
*takes something away* rather than adding it — Hirviendo destroys water and ice, including somebody
else's — and **Trident** is the only Technique in the class that makes several Strikes at a penalty that
deliberately does not climb, which is a thing pf2e's multiple attack penalty is built to do automatically.

---

## Resurrección (1st) — guide §7B Tiburón

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-56a | Resurrección Form | Your spirit weapon becomes a broad hollow-edged blade shaped like a shark's tooth: **1d12 slashing**, two-handed, **sweep** |  | ✅ | Live, both ways: Releasing stows the Blade and puts **Tiburón — Hollow-Edged Blade** in hand — **1d12 slashing**, **sweep**, `held-in-two-hands`, `handsFree` **0** — and sealing takes it away and returns the Blade to one hand. The two hands are the fix that landed with Arrogante's Gran Caída; this is the second of the four two-handed profiles it was written for |
| S-56b | Resurrección Form | You gain a **swim Speed** equal to your Speed |  | ✅ | Live, both ways: swim **absent → 35**, against a land Speed of 35. The rule reads `@actor.system.movement.speeds.land.value`, so it is the Speed rather than a number that happens to match it |
| S-56c | Resurrección Form | you can breathe water |  | — | pf2e automates no drowning and has no *"breathes water"* field — it has a glossary entry, on the **amphibious** creature trait, which its own text defines as breathing in water and in air. It was not said at all: no rule, no roll option, and the effect's description did not mention it either. It now adds that trait and prints the sentence, which is as far as pf2e will carry it; whether there is water is the GM's to say |
| S-56d | Resurrección Form | you can create water freely from the gill-slits along the blade |  | — | Pure roleplaying, and the guide's own anchor treats it that way. Printed on the form beside the water-breathing, where it was not before |

## Release Technique — La Gota (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-57a | La Gota | **Release Technique — La Gota** [two-actions] |  | ✅ | Live: the card reads **2** actions, Focus 7, with the **Water** trait |
| S-57b | La Gota | **30-foot cone**, basic Reflex, **2d6** slashing damage from a blade of compressed water |  | ✅ | Same card with Refined Release stripped: **Range 30 feet; Area 30-foot cone**, **Defense basic Reflex**; the damage rolled **`8d6 slashing`** at rank 7 — 2d6 and six increments |
| S-57c | La Gota | creatures that fail are pushed **10 feet** away from you |  | ✅ | Live and measured: the caster stood at (20,22), D1 at (20,20) failed the save and ended at (20,18) — **two squares, ten feet, directly away**. Done again on the next cast, 18 → 16 |
| S-57d | La Gota | **Heightened (+1)** +1d6 |  | ✅ | Live at rank 7: **`8d6 slashing`** — 2d6 and six increments |

## Refined (9th) — Cascada

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-58a | Cascada | The cone increases to **40 feet** |  | ✅ | Live, both ways: the aimed cone measures **800px — 40 feet** with Refined Release held and **600px — 30 feet** with the feat stripped, and the card reads **Area 40-foot cone** to match |
| S-58b | Cascada | creatures that critically fail fall **prone** |  | ✅ | Live, both ways: a forced critical failure with Refined held left the target **prone**; the identical critical failure with the feat stripped left it standing |
| S-58c | Cascada | the area becomes **difficult terrain** from standing water until the start of your next turn |  | ✅ | Live: the cast lays down a **`Cascada — standing water`** Region carrying `modifyMovementCost`, and no Region at all on the casts made with Refined stripped. It slows everyone, which is right — the guide names no side here, unlike Senbonzakura's petals or Garra's shards |

## Segunda Etapa — Hirviendo (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-59a | Hirviendo | Water rises around you in a **20-foot emanation**, difficult terrain for enemies | `test-soulbound` pins the terrain aura on the form | ✅ | **Fixed; there was nothing there at all.** `Effect: Hirviendo` had `rules: []` — no water, no emanation, no terrain, only a form that said so. Neither existing answer fit: a `Lingering` area is placed by a cast and expires, and `Modes.raiseArea` has the right lifecycle but deliberately carries no behavior. `TerrainAura` is the two put together plus the thing neither needed — a Region is a static shape and this one has to **follow you**. Live: a **20-foot** Region (400px) that answers **`difficulty 2`** for the enemy, **`[]`** for a party ally and **`[]`** for the caster, and whose centre moved (20,22) → (21,23) when the Tiburón did |
| S-59b | Hirviendo | Once per round when you hit with your spirit weapon you may push the target 5 feet | `test-riders` asserts the gate | ✅ | **Fixed.** The prompt had no per-round gate, so it arrived on every hit. It takes `oncePerRound` now, the same gate Tensa Zangetsu's free Step and Pantera's extra claw Strike use. Live: **3 hits in round 1 → 1 prompt**, then **2 hits in round 2 → 1 prompt**, reading *“Hirviendo: once per round, when you hit with your spirit weapon you may push the target 5 feet.”* |
| S-59c | Hirviendo | La Gota may be used as a **60-foot line** instead of a cone | `test-soulbound` pins the three shapes and their predicates | ✅ | **Fixed.** The word is **may**, and it was a replacement: written as an `alternateArea`, the line simply won at the Segunda Etapa and the cone could no longer be cast at all. A shape choice may carry a predicate now, and the list is filtered before it is offered — one survivor is not a question, which is how the two cone sizes stay a size. Live at Segunda the prompt offers **40-foot cone** or **60-foot line**, the 30-foot cone correctly filtered out, and picking the cone puts an 800px cone back on the cursor |

## Segunda Etapa — Trident

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-60a | Trident | **Trident** [two-actions] · **Frequency** once per round |  | ✅ | Live: the card reads **2** actions, **Range 60 feet; Targets 1 creature**, **Frequency once per round** — and the frequency is now spent, **1 → 0**, by the `SpellFrequency` gate added with Los Lobos. pf2e never spends a spell's frequency on its own |
| S-60b | Trident | Make **three** ranged Strikes with your spirit weapon against one creature within 60 feet, each at your current multiple attack penalty | `test-riders` asserts the rider names the spirit weapon | ✅ | **Fixed.** The rider named no weapon, so it fell back to `unarmed` and a released Tiburón **punched the target three times**. Naming the profile would not have worked either — `findStrike` compares slugs, and this one is `tibur-n-hollow-edged-blade` with the accent dropped, the same `sluggify` trap as SB-16. `"strike": "spirit-weapon"` matches by the tag every spirit weapon carries, released form first. Live: three Strikes with **Tiburón — Hollow-Edged Blade**. The residue is the word *ranged*: they post as **Melee** Strikes, because pf2e has no way to make one Technique's Strike ranged without altering the weapon |
| S-60c | Trident | the penalty does not increase until all three are made |  | ✅ | Live: all three Strikes rolled at modifier **+20**, identical — the penalty does not climb. `variants[0]` is the no-MAP variant, which is what the clause needs and what the volley machinery already used |

## Segunda Etapa — Hirviendo, the free action

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-61a | Hirviendo | And **Hirviendo** [free-action], once per round: you boil the water around you |  | ✅ | Live: the card reads **F** — a free action — **Area 20-foot emanation**, **Frequency once per round**, with the **Fire** trait, and the frequency spent **1 → 0** |
| S-61b | Hirviendo | All water and ice within your emanation — including that created by other creatures, and including effects with the water or cold trait that create terrain — is destroyed |  | ❌ | **Nothing is destroyed.** Live: the Tiburón's own `Effect: Hirviendo — 20-foot water` Region was still standing after boiling, and so was everything else on the board. The Technique has an area, a save and damage and no notion of terrain at all. It is reachable — every water or ice area in the module is a Region the module itself created and can find by its own flags — but it needs a rider that deletes Regions, which no `apply` type does, and a rule for which of somebody else's areas count. Left honest rather than half-built |
| S-61c | Hirviendo | each enemy in the emanation takes **2d6** fire damage |  | ✅ | Live: **`2d6 fire`**, flat — Boil's base rank is 7, the rung it arrives at, and the guide gives it no Heightened line |

## Severing Art — Ola Azul (guide §9.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-21a | Ola Azul | **60-foot line**, basic Reflex, **slashing** |  | ✅ | Cast live in Severance round 1 at 20th: the card reads **Range 60 feet; Area 60-foot line**, **Defense basic Reflex**, 2 actions, the aimed Region measures 1200px — 60 feet — the damage rolled **`20d6 slashing`**, and *“Ola Azul ends Severance”* followed it |
| R-21b | Ola Azul | Creatures that fail are pushed **30 feet** directly away from you and knocked **prone** |  | ⚠️ | **The machinery is proved; this exact cell is not.** A **success** moved the target nowhere and applied nothing, and a **critical failure** moved it 60 feet and knocked it prone — so the push, its direction, its arithmetic and the prone rider all work, and the two riders are authored identically apart from the distance and the outcome they name. But a plain **failure** was never rolled: the target's Reflex had to be tuned into a nine-point band under a DC of 37 while standing on a 60-foot line, and four attempts put the line somewhere else. Recorded as not driven rather than inferred from its neighbour |
| R-21c | Ola Azul | Creatures that critically fail are pushed 60 feet instead |  | ✅ | Live and measured: a critical failure moved the target from (34,22) to (46,21) — **twelve squares, sixty feet, directly away** from the caster at (21,23) — and left it **prone**. The control is the success above, which moved nobody |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 19 |
| ⚠️ | 1 |
| ❌ | 1 |
| 🔧 | 0 |
| — | 2 |
| **Total** | **23** |

# Clauses — 🌘 Kyōka Suigetsu

*Spirit tracker. Every independently-failable declaration the guide makes about Kyōka Suigetsu, one row
each. Source: `Docs/soulbound-guide-v1.md` v1.4 §7A (Kyōka Suigetsu) and §9.1 (Kanzen Saimin: Owari).*

**Lineage:** Soul Reaper · **Ladder:** Shikai → Full Release · **Tracker issue:** #62

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

*Kyōka Suigetsu's own shape.* The only Spirit keyed to an event in somebody else's **past** — *"the
target must have seen your Shikai release"* — which no rule element can express, so the module keeps a
register instead. It is also the only one whose Full Release is openly **invented**: canon gives Aizen
no Bankai, and the guide says so in a block quote rather than pretending otherwise. Half its clauses
are about what a creature *perceives*, which is the furthest thing from a number pf2e can hold.

---

## Shikai (1st) — Kanzen Saimin

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-32a | Kanzen Saimin | the target must have seen your Shikai release | | ✅ | Live: Releasing fired the sweep by itself — six Will saves posted against the Reiatsu DC, and the blind dummy was never asked. Seeing you release is what the sweep tests, and `hypnosis.mjs` keeps the register because no rule element can hold a memory |
| S-32b | Kanzen Saimin | A creature that **cannot see** is unaffected entirely | `test-soulbound` asserts `shouldRoll` | ✅ | Live: the blinded dummy came back **`blind`** from every sweep — no roll, no entry in the register, nothing remembered |
| S-32c | Kanzen Saimin | that creature must succeed at a **Will save** against your Reiatsu DC or be **hypnotized** for 1 minute | | ✅ | Live on Release: a Will save against **DC 27**, and the dummy that failed came away with **`Effect: Hypnotized`, 1 minute** |

## Shikai — the lie

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-33a | Kanzen Saimin | The creature perceives you **5 feet from where you actually stand** | | — | Perception, and pf2e holds no such thing. Where the creature *believes* you are standing is a sentence for the GM; the mechanical consequence of it is S-33b, which is automated. Printed on the effect so the table can read it |
| S-33b | Kanzen Saimin | Attacks against you from it require a **DC 5 flat check** | | ✅ | Live: every Strike the hypnotized dummy made against the caster rolled *“Mirror Flower, Water Moon — on a failure the attack finds nothing”* **against DC 6**, and one of four failed |
| S-33c | Kanzen Saimin | You are **hidden** from it whenever you are not adjacent to it, without needing to Hide | | — | Hidden is a real pf2e condition and this is not one. *“Hidden **from it**”* is per-observer, and a pf2e condition is global — applying it would hide the caster from the whole board. Printed on the effect instead |

## Shikai — the save ladder

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-34a | Kanzen Saimin | A creature that **critically succeeds** on its save is immune for 24 hours | `test-soulbound` asserts `windowFor` | ✅ | Live: the dummy that critically succeeded came back **`immuneFor 86400s`** — 24 hours — and the next sweep returned **`immune`** for it without rolling |
| S-34b | Kanzen Saimin | A creature that succeeds is immune for 10 minutes | | ✅ | Live: the dummy that succeeded came back **`immuneFor 600s`** — 10 minutes — and the next sweep returned **`immune`** |
| S-34c | Kanzen Saimin | A creature that **critically fails** is hypnotized for 1 hour | | ✅ | Live: the dummy that critically failed came away with **`Effect: Hypnotized`, 1 hour** |
| S-34d | Kanzen Saimin | once per encounter thereafter, is automatically hypnotized when you Release | | ✅ | Live: the critical failure was recorded **`permanentVictim: true`**, and the next sweep returned **`auto`** for it — hypnotized again for an hour with **no roll** |

## Release Technique — Shikake (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-35a | Shikake | **Release Technique — Shikake** [two-actions] | | ✅ | Live: the card reads **2** actions |
| S-35b | Shikake | Range 30 feet, one creature, Will save | | ✅ | Same card: **Range 30 feet; Targets 1 creature; Defense Will** |
| S-35c | Shikake | the target treats one creature of your choice within its reach as if it were you, and treats you as an ally, until the end of its next turn | | ✅ | Live on a failure: the target came away with **`Effect: Shikake`, 1 round / turn-end** — *“until the end of its next turn”*. Which creature it mistakes for you is the GM's to point at; the effect prints the sentence |
| S-35d | Shikake | **Critical Failure** as failure, for 2 rounds | | ⚠️ | **Not driven — harness wall.** pf2e-toolbelt auto-rolls the save for a single-target Technique at cast time, and in this world that path returned a **natural 20 eight times running** while `d2.getStatistic("will").roll()` rolled honestly beside it. A natural 20 upgrades one step, so a critical failure is unreachable through it. The rider is authored and its sibling fires; only the degree could not be produced |
| S-35e | Shikake | This is an illusion, mental, and visual effect | | ✅ | Live: the card's traits read **Illusion**, **Mental** and **Visual** alongside concentrate, focus, manipulate, reiatsu and soulbound |

## Refined (9th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-36a | Refined | The flat check from your Shikai form increases to **DC 6** | | ✅ | Live, both ways: the flat check is **DC 6** while Refined Release is held and **DC 5** with the feat stripped. The DC is stamped onto the effect as it is created, because the effect lives on the observer where no predicate can see the hypnotist's features |
| S-36b | Refined | Shikake's failure effect also makes the target **off-guard** to the misidentified creature | | ✅ | Live: the same failure that applied `Effect: Shikake` also applied **`Shikake: Off-Guard`, 1 round**. The rider is predicated on `feature:refined-release` |

## Full Release — Kanzen Saimin: Sōten Kisshun (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-37a | Sōten Kisshun | All enemies within **60 feet** who can see you must attempt the Shikai save, **including those who previously succeeded or became immune** | | ✅ | Live: entering Full Release re-asked **three dummies who were all inside an immunity window**, one of whom failed this time and was hypnotized. The permanent victim was auto-hypnotized without a roll, and the dummy at **135 feet was not asked** — the 60-foot range holds |
| S-37b | Sōten Kisshun | Hitting you no longer ends the effect; only a critical hit does | | ☐ | |
| S-37c | Sōten Kisshun | Once per round you may **Sustain** to force one hypnotized creature to attempt a Will save; on a failure it is **confused** until the end of its turn | | ☐ | |

## Severing Art — Kanzen Saimin: Owari (guide §9.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-16a | Kanzen Saimin: Owari | **60-foot emanation**, basic Will, **mental** | | ☐ | |
| R-16b | Kanzen Saimin: Owari | Creatures that fail are **confused** for 1 minute | | ☐ | |
| R-16c | Kanzen Saimin: Owari | On a critical failure the creature perceives its own allies as you for that minute and cannot be shaken loose by damage | | ☐ | |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 5 |
| ✅ | 15 |
| ⚠️ | 1 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 2 |
| **Total** | **23** |

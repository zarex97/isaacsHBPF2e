# Clauses — the Soulbound class

*Class tracker. Every independently-failable declaration the guide makes about what **every**
Soulbound has, whatever their Lineage and whatever Spirit they chose. Source:
`Docs/soulbound-guide-v1.md` v1.4 §1–§4 (chassis and core features), §6 (kidō), §8 (feats) and
§9.0 (Final Release).*

**Tier:** class · **Tracker issue:** #79

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

*The class tier's own shape.* Fifteen Spirit trackers ask what one Spirit does; this one asks what is
true of a Soulbound who has not chosen anything yet. Most of it is **numbers that must move at the right
level** — a proficiency that steps at 11th and not at 10th, a pool that reaches 3 and stops — and those
fail silently in a way no card ever announces. The rest is the machinery every Spirit rests on: the
release ladder, the pool, and the one genuinely new mechanic in the class.

**The prefixes are the old checklist's**, deliberately. Forty-five SB findings and every evidence note in
`Docs/soulbound-verification-checklist.md` cite `C-`, `K-`, `F-` and `X-` numbers; renumbering would break
every one of those citations to buy nothing.

| Prefix | Covers | Guide |
| :-- | :-- | :-- |
| `C-` | chassis and core class features | §1–§4 |
| `K-` | kidō that every Soulbound may learn | §6.1–§6.3, §6.6 |
| `F-` | Soulbound feats open to any Lineage | §8 |
| `X-` | Final Release and Severance | §9.0 |

Lineage-specific rows — Hierro, Bala, Gintō, Zanjutsu — live in `lineage-*.md` beside this file, because
they are true of one Lineage rather than of the class.

---

## Chassis (guide §1.2, §3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| C-01 | §1.2 | Martial. **10 HP**, full attack investment, class DC (**Reiatsu DC**), no spell slots and no spell list. | `test-soulbound` pins the class's hit points | ✅ | Live across ten levels: **10 / 20 / 50 / 90 / 120 / 130 / 140 / 150 / 170 / 200** at levels 1, 2, 5, 9, 12, 13, 14, 15, 17 and 20 — ten per level, flat, with the Constitution modifier on top |
| C-02 | §3.1 | **Perception:** Trained *(Expert at 5th |  | ✅ | Live at the boundary: Perception rank **1 at 4th** and **2 at 5th**, and still 2 at 20th. Read off Soulbound actors standing at each level rather than by levelling one through twenty: the class grants a kidō choice at 1st, 2nd, 5th, 9th, 13th and 17th, and a `ChoiceSet` prompt blocks the update that opened it — a sweep wedged twice on *Kidō Learned*. Where no actor existed at a boundary the level was stepped **down** into, which grants nothing and so prompts for nothing. |
| C-03 | §3.1 | Fortitude Master at 11th |  | ✅ | Live at the boundary: Fortitude **Expert from 1st**, rank **2 at 10th** and **3 at 11th**. The step is exactly where the guide puts it, not at 10 and not at 12 |
| C-04 | §3.1 | Reflex Master at 15th |  | ✅ | Live at the boundary: Reflex **Expert from 1st**, rank **2 at 14th** and **3 at 15th** |
| C-05 | §3.1 | Will stops at Expert |  | ✅ | Live, all three halves: Will rank **1 at 2nd**, **2 at 3rd**, and **still 2 at 20th**. The one save in the class that never reaches Master, which §2.2 calls the deliberate genre concession |
| C-06 | §3.1 | **Class DC:** Trained in **Reiatsu DC** |  | ✅ | Live at both boundaries: Reiatsu DC rank **1 at 8th**, **2 at 9th**, **2 at 16th**, **3 at 17th** — and **never 4**, read at 20th. Trained, Expert, Master, stop |
| C-07 | §3.1 | **Attacks:** Trained in simple weapons, martial weapons, unarmed attacks, and your spirit weapon |  | ✅ | Live: simple, martial and unarmed all **Trained at 1st**, all **rank 2 at 5th** against 1 at 4th, and all **rank 3 at 13th** against 2 at 12th. The three advance together, which is what the point ledger buys and why SB-10 was withdrawn |
| C-08 | §3.2 | **weapon expertise** (martial expert, crit specialization) | `test-soulbound` pins the rule on the feature | ✅ | **Fixed; it was prose.** *Weapon Expertise* promised critical specialization in its description and carried **no rules at all**, so pf2e built no synthetic and nothing downstream could see it — the option comes from a `CriticalSpecialization` rule element, and with no rule there is no option. Live after, on a critical hit at 17th: the damage card reads **`2 * (1d8 + 6)`** and carries the note **`PF2E.Actor.Creature.CriticalSpecialization`**, resolved for the Blade's own `sword` group. A first attempt predicated the rule on the weapon's proficiency rank and matched nothing — a weapon publishes no `item:proficiency:rank` option — which is why it is unpredicated, as pf2e's own class features are |
| C-09 | §3.2 | **Weapon specialization** |  | ✅ | Live at 17th on a character whose **Strength modifier is 0**, so the whole bonus is the feature: the Blade's damage reads **`1d8 + 6`**. Six is Weapon Specialization's **+3 at Master** doubled by **Greater Weapon Specialization at 15th** — the ladder the rules spell as a `FlatModifier` of 2 with `AdjustModifier`s to 3 and 4 |
| C-10 | §3.1 | **Defenses:** Trained in light armour and unarmoured defense |  | ✅ | Live at the boundary: light and unarmoured both rank **1 at 12th** and **2 at 13th** — and **medium reads 0 at every level from 1 to 20**, which is the line §3.1's own note says holds this class apart from Champion and Guardian |
| C-11 | §3.1 | Trained in **Religion**; trained in **Spirit Lore** |  | ✅ | Live on a Soul Reaper: **religion**, **spirit-lore** and **society** all trained at 1st — Religion, the granted Spirit Lore, and the Lineage skill the guide assigns to a Soul Reaper. The other two Lineages' skills are their own rows, in `lineage-*.md` |
| C-12 | §1.2 | Key attribute **Strength or Dexterity**. |  | ✅ | Live: the class item's key attribute reads **`["str", "dex"]`**, and the fixture has chosen **str**. Both are offered; neither is forced |

## Spirit Weapon (guide §4.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| C-13 | §4.1 | Choose one sealed profile | `test-soulbound` pins all four profiles | ✅ | Live, read off the pack rather than off one character's choice — all four exist with exactly the guide's line: **Blade 1d8 slashing, versatile-p, two-hand-d10**; **Great Blade 1d10 slashing, sweep, held-in-two-hands**; **Paired Blades 1d6 slashing, agile, finesse, twin**; **Spirit Bow 1d8 piercing, propulsive, range 60, reload 0**. All four are `category: martial`, and the ChoiceSet on *Spirit Weapon* offers them |
| C-14 | §4.1 | Your spirit weapon is a martial weapon and always counts as one you're proficient with, regardless of its released form. |  | ✅ | Live: every sealed profile and seven of the eight **released** forms read `category: martial` — Freund Schild, the Arcing Sword, Gran Caída, Luz de la Luna, the Hollow-Edged Blade, the Sword and Shield, the Pistols. **Pantera's claws are `unarmed`**, and that is the guide's own exception rather than a slip: §7B says *“You gain two **claw** unarmed attacks”*. The promise the clause actually makes still holds for them, because the class trains unarmed alongside martial and steps both together — C-07 |
| C-15 | §4.1 | **Bonded.** You can manifest or dismiss it as a free action once per round. Dismissed, it cannot be taken from you. If it leaves your hands you can Interact to call it back from up to 30 feet away. |  | ⚠️ | **The frequency is enforced; the rest is text.** Live: *Manifest or Dismiss Spirit Weapon* is an action carrying `frequency 1/round`, which pf2e counts and refills, and its card states the other three halves — that a dismissed weapon cannot be taken, that an Interact recalls it from 30 feet, and that a broken one re-forms after 10 minutes. None of those three is a thing Foundry models: there is no rule element for “cannot be taken from you”, and Interact-to-recall is a table action rather than a state. They are a reading the card makes at the moment they are needed |
| C-16 | §4.1 | **Soul-Etched.** During your daily preparations you can transfer weapon runes into or out of your spirit weapon for free, with no cost and no Crafting check. |  | ⚠️ | **Nothing to enforce, and nothing that says so on the sheet.** Soul-Etched is a paragraph of *Spirit Weapon* rather than an item of its own, and pf2e lets a character move runes between their own weapons during daily preparations anyway — there is no cost or Crafting check to waive, so there is no rule that could express the waiver. What the clause buys at the table is the **permission**, and the permission is written where the player reads it |
| C-17 | §4.1 | **Spirit-Cutting.** Your spirit weapon's Strikes can deal **spirit** damage instead of their normal damage type, and affect incorporeal creatures as though the weapon had the *ghost touch* rune. | `test-riders` pins the rule and the four profiles' trait | ✅ | Driven under #52, on this class feature rather than on a Spirit: against a dummy carrying **resistance 1000 to all damage with a ghost-touch exception**, the same character's **fist dealt 0** (80 → 80) and the **spirit weapon's 9 landed in full** (80 → 71) — the rune the only difference. The damage-type half is the `versatile-spirit` trait on all four profiles: the Strike offers **fire / piercing / spirit** in a form that overrides its damage type |
| C-18 | §4.1 | **Voice in the Blade.** You gain a **+1 circumstance bonus** to saves against effects that would control you, possess you, or force you to release your weapon |  | ✅ | Live at 17th, the same save rolled twice: Will reads **+20** plain and **+21** against an effect carrying the **mental** trait — the +1 appears only when the trait is there, and it is a **circumstance** bonus, which is what §2.2 says buys back Will stopping at Expert. *“Cannot be Stolen or permanently Disarmed”* has no rule element in pf2e and stays a reading of the card |

## Reiatsu and Rising Pressure (guide §4.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| C-19 | §4.2 | You have a **reiatsu pool**: maximum 1 point, increasing to 2 at 5th level and 3 at 11th. |  | ✅ | Live at all four boundaries: pool maximum **1 at 4th**, **2 at 5th**, **2 at 10th**, **3 at 11th** — and 3 at every level after. The steps are exactly where the guide puts them |
| C-20 | §4.2 | Refill it during daily preparations, or by spending 10 minutes on **Steady the Breath** |  | ✅ | Live: **Steady the Breath** is a real action on the sheet, granted by *Reiatsu*, reading *“Ten minutes restores 1 Reiatsu Point”* — and the pool is a pf2e **focus pool** (`Reiatsu`, tradition `focus`), so pf2e's own Refocus is what restores it. Found while driving: **16 of the 41 Soulbound actors in the rig do not carry the action**, because they were built before the grant was added and hold a stale owned copy of *Reiatsu*. A fixture artefact, not a content one — every actor built since has it |
| C-21 | §4.2 | Once per round, the first time you either deal damage to an enemy with your spirit weapon or take damage from an enemy, you regain 1 Reiatsu Point. | `test-soulbound` pins `grantFor`'s four gates | ✅ | Live in an encounter at 17th: a Strike with the spirit weapon that dealt damage moved the pool **0 → 1**, and the ledger stamped `{round: 11, gained: 1}` |
| C-22 | §1.4 | Every technique costs 1 Reiatsu Point |  | ✅ | Live, in the same round: a second Strike that dealt damage paid **nothing** — the pool stayed at 1 and `gained` stayed at 1 |
| C-23 | §4.2 | You can't exceed your maximum pool |  | ✅ | Live with a **fresh ledger** so the encounter cap could not be the gate: at a pool of 3 out of 3, a Strike that dealt damage granted nothing **and left `gained` at 0**. The ceiling refuses without spending the encounter's allowance, which is the right reading of two limits that could otherwise eat each other |
| C-24 | §4.2 | over the course of a single encounter you can't regain more points this way than your maximum pool size |  | ✅ | **The clause §1.3 calls load-bearing, and it holds.** Live across four rounds: the pool climbed 0 → 1 → 2 → 3 on one grant a round, and then in the fourth round — with the pool **deliberately spent back down to 1**, so there was room — the trigger granted **nothing**, because the encounter had already paid out 3. Without it the pool refills every round and the whole economy is decoration |
| C-25 | §4.2 | Max per encounter |  | ✅ | The table's own number, live: at a maximum pool of **3** the encounter paid out exactly **3** and then stopped. And a new encounter starts the count again — a ledger reading `{round: 99, gained: 3}` came back `{round: null, gained: 0}` on `combatStart`, which is what makes *“per encounter”* mean anything at a table that plays more than one fight |

## Spirit Sense, Konsō, Flash Step, Departed Flesh (guide §4.3–§4.6)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| C-26 | §4.3 | You automatically sense the presence and approximate strength of undead, haunts, spirits, and incorporeal creatures within **60 feet**, even through thin barriers, without learning their exact location — they are **hidden** to you rather than undetected. |  | ✅ | Live: the character's senses read **`spiritsense: imprecise @ 60`** — an **imprecise** sense at exactly 60 feet, which is pf2e's own word for *“hidden to you rather than undetected”*. The restricted target list and the thin barriers are the sense's description; what is modelled is the acuity and the range, which are the two halves that change how a creature is found |
| C-27 | §4.4 | **Konsō** is a 10-minute exploration activity. |  | ☐ |  |
| C-28 | §4.5 | **Frequency** once per round You step between one instant and the next. Stride up to your Speed. This movement doesn't trigger reactions. |  | ☐ |  |
| C-29 | §4.5 | **Greater Flash Step (11th).** You leave an afterimage: until the start of your next turn, the first attack made against you each round requires the attacker to succeed at a **DC 5 flat check** or the attack misses. |  | ☐ |  |
| C-30 | §4.6 | You're immune to disease, you don't need to eat or drink, and when you roll a success on a save against a poison effect you get a critical success instead. |  | ✅ | Live: **immunity to disease**, and an `AdjustDegreeOfSuccess` on **Fortitude** predicated on `item:trait:poison` turning a **success into a critical success**. Not needing to eat or drink has nothing to model and is the card's to say |

## The release ladder (guide §4.7–§4.9)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| C-31 | §4.7 | **The first Release each encounter is free**; releasing again after re-sealing costs 1 Reiatsu Point. You can't Release while your spirit weapon is dismissed. |  | ☐ |  |
| C-32 | §4.7 | **Refined Release (9th).** Your Release Technique gains its **Refined** benefit, listed per Spirit. Base rank of the Refined effect is 5. |  | ☐ |  |
| C-33 | §4.8 | **Frequency** once per day · **Requirements** Your spirit weapon is in its released form and you have at least 1 Reiatsu Point |  | ☐ |  |
| C-34 | §4.8 | Your spirit weapon's damage die increases by one step. |  | ☐ |  |
| C-35 | §4.8 | Your Release Technique costs no Reiatsu Points, but you can use it only once per round. |  | ☐ |  |
| C-36 | §4.8 | You emit a **15-foot emanation** of crushing spiritual pressure. An enemy that ends its turn in the emanation must succeed at a Will save against your Reiatsu DC or become **frightened 1** (frightened 2 on a critical failure). |  | ☐ |  |
| C-37 | §4.8 | When it ends you become **fatigued** until you rest for 10 minutes, and you can't use Full Release again today. |  | ☐ |  |
| C-38 | §4.8 | **Perfected Full Release (17th):** duration 2 minutes, no fatigue, emanation increases to 20 feet. |  | ☐ |  |
| C-39 | §4.8 | You can use Full Release **twice per day**. While in a Full Release you're immune to fear effects, and the first time each round you critically hit with your spirit weapon you regain 1 Reiatsu Point |  | ☐ |  |
| C-40 | §4.9 | All three are scaling bumps to something you already have |  | ☐ |  |

---

## Still to write

`K-` (kidō, §6), `F-` (feats, §8) and `X-` (Final Release and Severance, §9.0) belong in this file and
are not in it yet. They are the next waves; the counts below are the rows that exist.

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 13 |
| ✅ | 25 |
| ⚠️ | 2 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **40** |

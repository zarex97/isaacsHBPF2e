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
| C-15 | §4.1 | **Bonded.** You can manifest or dismiss it as a free action once per round. Dismissed, it cannot be taken from you. If it leaves your hands you can Interact to call it back from up to 30 feet away. |  | ⚠️ | **Half of it is state now; the rest is text.** Live: *Manifest or Dismiss Spirit Weapon* is a free action carrying `frequency 1/round`, which pf2e counts and recharges — and it is routed somewhere at last. It toggles a real dismissed state: the weapon is stowed, `weaponOf` answers `null`, and C-31's *"you can't Release while your spirit weapon is dismissed"* has something to refuse. What stays a reading of the card is the other two halves — there is no rule element for *"cannot be taken from you"*, and Interact-to-recall from 30 feet is a table action rather than a state |
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
| C-27 | §4.4 | **Konsō** is a 10-minute exploration activity. |  | ✅ | Live: **Konsō is listed under Exploration on the character sheet**, which is pf2e's own reading of the `exploration` trait — `sheet.ts` files every action carrying it there and nowhere else — and it carries `concentrate` beside it. The **10 minutes** is description text, because pf2e has no duration field on an exploration activity: what the system models is that it is one |
| C-28 | §4.5 | **Frequency** once per round You step between one instant and the next. Stride up to your Speed. This movement doesn't trigger reactions. | `test-soulbound` pins the frequency | ✅ | Live, through the sheet's own **use** button: Flash Step's `frequency` reads **1 → 0** on one use, and pf2e recharges it at the round change. Driving it by `toMessage()` instead spends nothing — pf2e decrements only in `createUseActionMessage`, which is the sheet's path and not the API's. A trap for the rig, not a gap in the class |
| C-29 | §4.5 | **Greater Flash Step (11th).** You leave an afterimage: until the start of your next turn, the first attack made against you each round requires the attacker to succeed at a **DC 5 flat check** or the attack misses. | `test-soulbound` pins the gate, the DC and where it is worn | ✅ | **Fixed; it fired on every attack.** Live before: D1 threw two Fists at a released Soulbound in one round and the afterimage offered its DC 5 flat check on **both** — the clause's whole shape is *“the first attack … each round”*, and the rider had nothing that could count. `oncePerRound` is the gate `Tensa Zangetsu` already needed; this rider simply never asked for it. Live after, three attacks in one round: **1 offer, then 0, then 0**. The effect itself arrives from Flash Step and only on a character carrying the 11th-level feature |
| C-30 | §4.6 | You're immune to disease, you don't need to eat or drink, and when you roll a success on a save against a poison effect you get a critical success instead. |  | ✅ | Live: **immunity to disease**, and an `AdjustDegreeOfSuccess` on **Fortitude** predicated on `item:trait:poison` turning a **success into a critical success**. Not needing to eat or drink has nothing to model and is the card's to say |

## The release ladder (guide §4.7–§4.9)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| C-31 | §4.7 | **The first Release each encounter is free**; releasing again after re-sealing costs 1 Reiatsu Point. You can't Release while your spirit weapon is dismissed. |  | ✅ | **Fixed; one third of it was a comment.** Live, all three halves: the first Release of an encounter left the pool at **3 of 3** and stamped `releases: 1`; after re-sealing, the second moved it **3 → 2** and stamped `releases: 2`; with the pool at 0 a third was **refused**. The dismissed clause refused nothing, because *dismissed was not a state* — `Manifest or Dismiss Spirit Weapon` was a card routed nowhere, while `release()` carried a comment promising it checked. It is a flag now, the action toggles it, and live a dismissed weapon reads `weaponOf → null` and **refuses the Release**; manifesting again lets it through and puts the blade back in hand |
| C-32 | §4.7 | **Refined Release (9th).** Your Release Technique gains its **Refined** benefit, listed per Spirit. Base rank of the Refined effect is 5. |  | ✅ | **Fixed, and the fix was not in the Technique.** Live: *Refined Release* is on the sheet at 9th on all three Lineages — and a **20th**-level Soul Reaper with it cast Senbonzakura into a **15-foot** emanation. The feature widens an area with an `ItemAlteration` predicated on `item:tag:sb-refined-area-20`, and the owned copy of the spell predated the tag, so the predicate matched nothing and said nothing. `Release.repair` refreshed flags, icons and stateless rules and never `otherTags`; it does now, as a union read off `_source`. Live after: **15 → 20 feet**, and the sweep brought **194 stale items across 53 actors** into line |
| C-33 | §4.8 | **Frequency** once per day · **Requirements** Your spirit weapon is in its released form and you have at least 1 Reiatsu Point |  | ✅ | **Fixed; pf2e counts this and does not enforce it.** Requirements first, and both hold live: a **sealed** weapon refuses, and a pool below 1 refuses. The frequency is the half that was decoration — `createUseActionMessage` decrements `frequency.value`, stops at zero, and **posts the card anyway**, so a 13th-level Soulbound whose one use was spent clicked again and entered a second Full Release. Driven live, exactly that happened. The count is kept on the actor now, reading `max` off the feat so `Unsealed` raises it without knowing: live at 13th, **#1 allowed, #2 refused** |
| C-34 | §4.8 | Your spirit weapon's damage die increases by one step. | `test-soulbound` pins the alteration and its predicate | ✅ | Live at 20th: the spirit weapon's damage die read **d8 before the Full Release and d10 during it** — one step, on the weapon the ItemAlteration names by tag rather than by which of the four profiles was chosen at 1st level |
| C-35 | §4.8 | Your Release Technique costs no Reiatsu Points, but you can use it only once per round. | `test-soulbound` pins the allowance | ✅ | Live, both halves, in one round: the Release Technique cost **0 Focus Points** and the `Unbound Technique` allowance moved **1 → 0**, the card saying so; the **second** cast in the same round was **refused** — *“Senbonzakura is once per round while you are in a Full Release, and it has been used”*. The allowance is an `action` because pf2e recharges only actions and feats, and it arrives with the Full Release rather than with the 13th level |
| C-36 | §4.8 | You emit a **15-foot emanation** of crushing spiritual pressure. An enemy that ends its turn in the emanation must succeed at a Will save against your Reiatsu DC or become **frightened 1** (frightened 2 on a critical failure). | `test-soulbound` pins the save's four degrees | ✅ | Live: D1 ended its turn 5 feet from a Soulbound in a Full Release, rolled a **Will save against DC 37 — the Reiatsu DC, not a spell DC** — critically failed, and came out **frightened 2**. The emanation is a pf2e `Aura` carrying `emotion`, `fear` and `mental`, and the `aura-tick` rider is what turns the geometry into a timed save, because pf2e's `Aura` rule element decides who is inside and never when |
| C-37 | §4.8 | When it ends you become **fatigued** until you rest for 10 minutes, and you can't use Full Release again today. | `test-soulbound` pins the shape at 13th | ✅ | Live at 13th: the effect read **1 minute** with a **15-foot** aura, and when it ended the character was **fatigued** and the state fell back to `released`. The second half — *“you can't use Full Release again today”* — is the frequency C-33 records, and it refuses now |
| C-38 | §4.8 | **Perfected Full Release (17th):** duration 2 minutes, no fatigue, emanation increases to 20 feet. | `test-soulbound` pins all three tiers of `fullReleaseShape` | ✅ | Live at 17th and 20th: **2 minutes**, aura **20 feet**, and **no fatigue** when it ended — against 1 minute, 15 feet and fatigued on the same rig at 13th. The duration is an ordinary field; the emanation is not, so it is stamped onto the effect as it is created, from the one pure function the static tests assert against |
| C-39 | §4.8 | You can use Full Release **twice per day**. While in a Full Release you're immune to fear effects, and the first time each round you critically hit with your spirit weapon you regain 1 Reiatsu Point | `test-soulbound` pins all three halves | ✅ | **Fixed; two of the three were prose.** The `ItemAlteration` raising the frequency to 2 was real and works — live at 20th, **#1 and #2 allowed, #3 refused**. The other two existed nowhere. *Fear immunity* is an `Immunity` rule now, predicated on the feature and living on the effect so it lasts exactly as long as the Full Release does: live, immunities read `["disease"]` sealed and `["disease", "fear-effects", "fire"]` in the Full Release — **`fear-effects`, not `fear`**, which the validator caught before it shipped, because pf2e drops an immunity type it does not know without a word. The *refund* needed a new thing: `pool` could only ever spend, and a refund written as a negative `spend` falls straight through its own guard and does nothing at all. `gain` is its own field for exactly that reason. Live: a critical hit with the spirit weapon moved the pool **1 → 2**, a second crit the same round **2 → 2**, and the next round **2 → 3** |
| C-40 | §4.9 | All three are scaling bumps to something you already have |  | ✅ | Live on a 20th-level character of each Lineage: **Zanjutsu Mastery** (Soul Reaper), **Segunda Piel** (Hollow) and **Sklaverei** (Quincy) all stand at 15th, and all three are **passive** — *“none of them adds a new action”*, which is the clause's own claim and the one a 15th-level upgrade most often breaks. What each of them does is a row in its own `lineage-*.md` |

---

## Still to write

`K-` (kidō, §6), `F-` (feats, §8) and `X-` (Final Release and Severance, §9.0) belong in this file and
are not in it yet. They are the next waves; the counts below are the rows that exist.

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 38 |
| ⚠️ | 2 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **40** |

# Clauses — the Assimilator class

*Class tracker. Every independently-failable declaration the guide makes about what **every**
Assimilator has, whatever they have eaten. Source: `Docs/assimilator-guide-v1.md` §1.2 (profile), §3
(advancement), §4 (core class features), §6 (the guide's additions to the lexicon) and §7 (the Bond
rules).*

**Tier:** class · **Tracker issue:** #84

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

*Nothing is implemented yet.* Every row starts ☐, and the Assimilator is being built against these
rows rather than checked after the fact — a clause is done when it is ✅, not when its JSON exists.

*The class tier's own shape.* Two halves. The first is **numbers that must move at the right level** —
a proficiency that steps at 13th and not 12th, a Mass pool that grows at 3rd by one gem and no metal —
and those fail silently in a way no card announces. The second is the **engine every Substrate rests
on**: the Carapace as an object with Hardness and a broken state, Feed and Shed, the Depth cap, the
derived Instinct, and the Bond slots. Nothing in the nine colour trackers can pass until this half does.

**IDs are `A-<nn><letter>`.** Substrates, Instincts, Bonds and feats have trackers of their own beside
this file.

---

## Profile and proficiencies (guide §1.2, §3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| A-01 | §1.2 | Strength **or** Dexterity |  | ☐ |  |
| A-02 | §3 | **HP** 10 + Con per level. | `test-assimilator` pins it | ✅ | Live: **10 / 40 / 50 / 200** Hit Points at levels 1, 4, 5 and 20 on a character with no ancestry and Constitution +0 — ten per level, flat |
| A-03 | §3 | **Initial proficiencies:** Perception Trained | `test-assimilator` pins it | ✅ | Live: Perception rank **1** at 1st |
| A-04 | §3 | **Alertness** (Perception Expert) |  | ✅ | Live at the boundary: Perception **1 at 6th**, **2 at 7th**, still 2 at 20th |
| A-05 | §3 | Fortitude, Reflex and Will Expert | `test-assimilator` pins it | ✅ | Live: Fortitude, Reflex and Will all rank **2** at 1st; Reflex and Will **still 2 at 20th** |
| A-06 | §3 | **Juggernaut** (Fortitude Master) |  | ✅ | Live at the boundary: Fortitude **2 at 8th**, **3 at 9th**. pf2e's own *Juggernaut* is granted, as the Soulbound's is, so it also turns a Fortitude success into a critical success — more than the ledger's 170 points buy; the Soulbound set the precedent |
| A-07 | §1.2 | Athletics, plus 3 + Int |  | ☐ |  |
| A-08 | §1.2 | Unarmed Trained. **No weapon proficiency of any kind.** | `test-assimilator` pins it | ✅ | Live at 1st: unarmed **1**, simple **0**, martial **0**, and the sheet offers exactly **one** Strike, the Carapace Strike |
| A-09 | §3 | **Carapace Expertise** (Unarmed Expert) |  | ✅ | Live at the boundary: unarmed **1 at 4th**, **2 at 5th**; the Strike's attack went **+3 → +9** from 1st to 5th |
| A-10 | §3 | **Carapace Mastery** (Unarmed Master) |  | ✅ | Live at the boundary: unarmed **2 at 12th**, **3 at 13th**, and **3 at 20th** — never legendary |
| A-11 | §1.2 | Unarmoured **Expert**. **No armour proficiency of any kind** | `test-assimilator` pins it | ✅ | Live at 1st: unarmoured **2**, light **0**, AC **15** — 10 + Expert (4 + 1) with the plate's +0 |
| A-12 | §3 | **Shell Mastery** (Unarmoured Master) |  | ✅ | Live at the boundary: unarmoured **2 at 12th**, **3 at 13th**, 3 at 20th |
| A-13 | §1.2 | The **Assimilator DC**, Trained, keyed to your key attribute | `test-assimilator` pins it | ✅ | Live at 1st: an **Assimilator** class DC exists, rank **1**, **DC 13** (10 + 3 trained + key +0). The `assimilator` trait registered in `module.json` is what makes pf2e build it |
| A-14 | §3 | **Assimilation Expertise** (Assimilator DC Expert) |  | ✅ | Live at the boundary: Assimilator DC **1 at 8th**, **2 at 9th** |
| A-15 | §3 | **Assimilation Mastery** (Assimilator DC Master) |  | ✅ | Live at the boundary: **2 at 16th**, **3 at 17th**, and **3 at 20th** — never 4 |
| A-16 | §3 | **Living Weapon** (brawling crit spec) |  | ✅ | Live at the boundary: the brawling `CriticalSpecialization` synthetic is **absent at 6th** and **present at 7th**. Read off the synthetic, not a critical hit's card |
| A-17 | §3 | **Juggernaut** (Fortitude Master), **Weapon Specialization** |  | ✅ | Live at the boundary: the Strike's damage **`2d8` at 8th → `2d8 + 2` at 9th** (Expert), and **+3 at 13th** (Master) |
| A-18 | §3 | **Greater Weapon Specialization** |  | ✅ | Live at the boundary: **`2d8 + 3` at 16th → `2d8 + 6` at 17th** — Weapon Specialization's Master +3 doubled |

## The Carapace Strike (guide §4.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| A-19 | §4.1 | **Carapace Strike** — unarmed, **1d8 bludgeoning**, **brawling** group, traits: `unarmed`. | `test-assimilator` pins it | ✅ | Live: the sheet offers **one** Strike, **Carapace Strike**, **d8 bludgeoning**, group **brawling**. **Fixed while driving:** `fist: true` forces pf2e's label to "Fist" and leaves the basic d4 unarmed attack beside it; a named unarmed Strike with `replaceBasicUnarmed` gives the guide's "no second option" |
| A-20 | §4.1 | It is not agile and it is not finesse | `test-assimilator` pins it | ✅ | Live: traits **`["unarmed"]`** — not agile, not finesse, not nonlethal |
| A-21 | §4.1 | **Handwraps of Mighty Blows work normally** |  | ✅ | Live at 5th, handwraps *+1 striking* worn and invested: the Strike went **+9 → +10** and **1d8 → 2d8**. The control is the reading before they were put on |
| A-22 | §4.1 | The class grants no free fundamental runes. |  | ✅ | Live: without handwraps the Strike is **1d8** at +9 at 5th — no potency, no striking from the class |

## Living Plate (guide §4.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| A-23 | §4.2 | The symbiont is your armour and cannot be removed. |  | ✅ | Live: an update stowing the plate is **refused** — it read `worn` after, with a notification. **Deleting** it is not refused: that is how pf2e removes granted items when the class goes, and blocking it would break that |
| A-24 | §4.2 | It functions as **explorer's clothing that is alive**: AC item bonus +0, Dex cap +5, no check penalty, no Speed penalty, Bulk —. | `test-assimilator` pins it | ✅ | Live at 1st: AC **15** with the plate worn — exactly unarmoured Expert with a +0 item bonus. Dex cap and the zero penalties are pinned statically |
| A-25 | §4.2 | **It accepts armour potency, resilient and property runes** |  | ✅ | Live at 5th: a **+1 potency** rune on the plate took AC **19 → 20**. Like any magic armour it must be invested; the plate is now granted invested |
| A-26a | §4.2 | **You cannot wear other armour.** |  | ⚠️ | Live: other armour **can** be worn — through the sheet's own path (`changeCarryType`) leather went on and pf2e unslotted the plate. That is the guide's *"Attempting it"*, so the next row carries the consequence; nothing refuses the attempt itself |
| A-26b | §4.2 | Attempting it suppresses Living Plate, every Mutation, and your Instinct until you take it off. |  | ⚠️ | Live: with leather worn the plate is **unslotted** (its rune gone, AC **20 → 11**) and **`assimilator:suppressed`** is emitted; taking it off restores AC 20 and clears the option. Mutations and the Instinct do not exist until Phase 2, so the half of the clause that suppresses them waits on them predicating on that option |

## Carapace Block and the broken state (guide §4.3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| A-27a | §4.3 | **2**, plus the **highest** Hardness bonus among your bound Substrates (Diamond, Steel, Chromium), plus Gray's Instinct. | `test-assimilator` pins it | ⚠️ | Live: the plate's Hardness reads **2**. The *highest Substrate bonus* half waits on Substrates (Phase 2) |
| A-27b | §4.3 | Substrate bonuses do not add together unless a Bond says so (*Adamant Shell*). |  | ☐ |  |
| A-28 | §4.3 | **10 + 5 per level** | `test-assimilator` pins it | ✅ | Live: the plate's maximum reads **15 / 30 / 35 / … / 95 / 110** at 1st, 4th, 5th, 17th and 20th. A level keeps the plate's damage rather than repairing it: **12/15 at 1st → 32/35 at 5th** |
| A-29 | §4.3 | Half its Hit Points |  | ✅ | Live: Broken Threshold **7** on a 15-point plate and **17** on a 35-point one — pf2e derives it as half when the `hp-max` alteration writes the maximum |
| A-30 | §4.3 | **Carapace Block** 🜲 **Reaction** — *Trigger:* you take physical damage. | `test-assimilator` pins it | ✅ | Live at 5th: armed, **20 fire** was taken in full (**20**), the plate untouched, and the block **stayed armed**. It fires on physical damage only |
| A-31 | §4.3 | *Effect:* reduce the damage by your Carapace's Hardness. | `test-assimilator` pins it | ✅ | Live at 5th, the same 20 bludgeoning twice: **unarmed → 20 taken**, **armed → 18 taken**. The block is taken on the damage bus off the damage *after* IWR, by shadowing `calculateHealthDelta` for one application |
| A-32 | §4.3 | The Carapace takes that much damage. | `test-assimilator` pins it | ✅ | Live: the plate went **35 → 33** — it takes what it blocked, not what got past it (pf2e's Shield Block does the latter, which is why the plate is not a shield). The armed effect was spent and a card names the amount |
| A-33 | §4.3 | **While broken**, you lose Living Plate's rune benefits |  | ⚠️ | Live: broken, the plate's potency is overridden to **0** and AC fell **20 → 19**; repaired, **20** again. Resilient is overridden the same way. **Property runes are not removed** — pf2e has no alteration for them |
| A-34 | §4.3 | **every Mutation at Depth 3 or higher switches off** until the Carapace is repaired |  | ⚠️ | Live: at **16/35** (threshold 17) *Effect: Carapace Broken* went on and **`carapace:intact` disappeared**; repaired to 35 the effect came off and the option returned. No Mutation exists yet to be switched off, and every Depth 3–4 rule is held by the validator to require the option |
| A-35 | §4.3 | Repair is the Repair activity against its own Hardness, or one hour of Feeding it any Substrate you don't bind. |  | ☐ |  |

## Assimilation — Mass, Feed and Shed (guide §4.4, §3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| A-36 | §4.4 | You gain **Mass** in two separate pools (§3.1) and the two activities that manage them. |  | ☐ |  |
| A-37 | §3.1 | A Substrate at **Depth N costs N Mass**. |  | ☐ |  |
| A-38a | §4.4 | **Feed** ◆◆◆◆ *(10 minutes)* — Consume one Substrate you are holding. |  | ☐ |  |
| A-38b | §4.4 | If you already hold it, its **Depth increases by 1**; otherwise it enters your Lattice at **Depth 1**. |  | ☐ |  |
| A-38c | §4.4 | Either way it costs Mass equal to its new Depth, and the physical Substrate is destroyed. |  | ☐ |  |
| A-39a | §4.4 | **Shed** — During your daily preparations only. |  | ☐ |  |
| A-39b | §4.4 | Remove any Substrate, or reduce any Substrate's Depth, freeing that Mass. |  | ☐ |  |
| A-39c | §4.4 | What you shed is destroyed, not recovered. |  | ☐ |  |
| A-40a | §4.4 | **Depth 1–2 takes an ordinary specimen** |  | ☐ |  |
| A-40b | §4.4 | **Depth 3–4 takes a quickened specimen** |  | ☐ |  |
| A-41 | §4.4 | Every time your Mass increases, you gain **one free Substrate** of any kind you qualify for. |  | ☐ |  |
| A-42a | §3 | **Growth** (Mass +1 Gem) |  | ☐ |  |
| A-42b | §3 | **Second Bond** (Mass +2/+2) |  | ☐ |  |
| A-42c | §3 | **Growth** (Mass +2/+2) |  | ☐ |  |
| A-42d | §3 | **Fifth Bond** (Mass +2/+2) |  | ☐ |  |

## Instinct (guide §4.5)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| A-43 | §4.5 | Your **Instinct** is the colour you have invested the most total Mass in, counting both tracks. |  | ☐ |  |
| A-44 | §4.5 | It grants that colour's **Instinct clause** (§5), which applies to **every Mutation you have**, including Mutations of other colours. |  | ☐ |  |
| A-45 | §4.5 | Ties are broken by you, freely, at daily preparations. |  | ☐ |  |
| A-46 | §4.5 | Instinct is recalculated at daily preparations and costs nothing to change |  | ☐ |  |

## Bond slots (guide §7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| A-47 | §7 | You gain Bond slots at **4th, 8th, 12th, 16th and 20th** — five in total. |  | ☐ |  |
| A-48 | §7 | A Bond requires **both** its Substrates at **Depth 2 or higher**. |  | ☐ |  |
| A-49 | §7 | Dropping either below Depth 2 suppresses the Bond until you feed it back; it is not lost. |  | ☐ |  |
| A-50 | §7 | You choose a Bond when you gain the slot and may change it at daily preparations, provided the new Bond's requirements are met. |  | ☐ |  |

## The Skins and the Depth cap (guide §4.6, §6)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| A-51a | §3 | **Second Skin** (Depth cap 2, Mass +1/+1) |  | ☐ |  |
| A-51b | §3 | **Third Skin** (Depth cap 3, Mass +2/+1) |  | ☐ |  |
| A-51c | §3 | **Fourth Skin** (Depth cap 4, Mass +2/+1) |  | ☐ |  |
| A-52 | §6 | **Depth caps are the gate**, not level — a Substrate's Depth 4 entry is unreachable before 17th because the cap is |  | ☐ |  |

## Symbiotic Reflex (guide §4.7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| A-53 | §4.7 | 🜲 **Reaction** — *Trigger:* a creature you can see damages you. |  | ☐ |  |
| A-54a | §4.7 | **(a)** gain resistance equal to **twice your highest Depth** against that damage |  | ☐ |  |
| A-54b | §4.7 | **(b)** if the triggering creature is within your reach, make a **Carapace Strike** against it. |  | ☐ |  |
| A-55 | §4.7 | Once per round, and it does not stack with Carapace Block against the same damage. |  | ☐ |  |

## Alien Physiology (guide §4.8)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| A-56 | §4.8 | You need neither food, drink nor air, and you are **immune to disease**. |  | ⚠️ | Live: **immune to disease** at 15th, **not at 14th**. Needing no food, drink or air is text |
| A-57 | §4.8 | You are **immune to the drained condition** |  | ✅ | Live: **immune to drained** at 15th, not at 14th |
| A-58 | §4.8 | and to any effect that would alter your physical form against your will (petrification, polymorph, and the like) |  | ⚠️ | Live: **immune to petrified and polymorph** at 15th, not at 14th — but unconditionally, where the guide says *against your will*: a willing polymorph is refused too |
| A-59 | §4.8 | You can be healed by **Repair** as well as by anything that heals a creature. |  | ☐ |  |
| A-60 | §4.8 | you are **immune to precision damage** and to critical specialization effects of the knife and pick groups. |  | ⚠️ | Live: **immune to precision** at 15th, not at 14th. Immunity to the knife and pick groups' critical specialization is text — pf2e has no immunity for it |

## Apotheosis (guide §4.9)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| A-61 | §4.9 | Your **Mass increases by 3** in each track. |  | ☐ |  |
| A-62 | §4.9 | Once per day, as a **free action**, every bound Substrate manifests at your **Depth cap** for 1 minute, regardless of the Mass you actually paid. |  | ☐ |  |
| A-63 | §4.9 | Your Carapace can no longer be broken by physical damage alone; only an effect that would destroy an object outright can do it. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 39 |
| ✅ | 29 |
| ⚠️ | 8 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **76** |

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
| A-02 | §3 | **HP** 10 + Con per level. |  | ☐ |  |
| A-03 | §3 | **Initial proficiencies:** Perception Trained |  | ☐ |  |
| A-04 | §3 | **Alertness** (Perception Expert) |  | ☐ |  |
| A-05 | §3 | Fortitude, Reflex and Will Expert |  | ☐ |  |
| A-06 | §3 | **Juggernaut** (Fortitude Master) |  | ☐ |  |
| A-07 | §1.2 | Athletics, plus 3 + Int |  | ☐ |  |
| A-08 | §1.2 | Unarmed Trained. **No weapon proficiency of any kind.** |  | ☐ |  |
| A-09 | §3 | **Carapace Expertise** (Unarmed Expert) |  | ☐ |  |
| A-10 | §3 | **Carapace Mastery** (Unarmed Master) |  | ☐ |  |
| A-11 | §1.2 | Unarmoured **Expert**. **No armour proficiency of any kind** |  | ☐ |  |
| A-12 | §3 | **Shell Mastery** (Unarmoured Master) |  | ☐ |  |
| A-13 | §1.2 | The **Assimilator DC**, Trained, keyed to your key attribute |  | ☐ |  |
| A-14 | §3 | **Assimilation Expertise** (Assimilator DC Expert) |  | ☐ |  |
| A-15 | §3 | **Assimilation Mastery** (Assimilator DC Master) |  | ☐ |  |
| A-16 | §3 | **Living Weapon** (brawling crit spec) |  | ☐ |  |
| A-17 | §3 | **Juggernaut** (Fortitude Master), **Weapon Specialization** |  | ☐ |  |
| A-18 | §3 | **Greater Weapon Specialization** |  | ☐ |  |

## The Carapace Strike (guide §4.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| A-19 | §4.1 | **Carapace Strike** — unarmed, **1d8 bludgeoning**, **brawling** group, traits: `unarmed`. |  | ☐ |  |
| A-20 | §4.1 | It is not agile and it is not finesse |  | ☐ |  |
| A-21 | §4.1 | **Handwraps of Mighty Blows work normally** |  | ☐ |  |
| A-22 | §4.1 | The class grants no free fundamental runes. |  | ☐ |  |

## Living Plate (guide §4.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| A-23 | §4.2 | The symbiont is your armour and cannot be removed. |  | ☐ |  |
| A-24 | §4.2 | It functions as **explorer's clothing that is alive**: AC item bonus +0, Dex cap +5, no check penalty, no Speed penalty, Bulk —. |  | ☐ |  |
| A-25 | §4.2 | **It accepts armour potency, resilient and property runes** |  | ☐ |  |
| A-26a | §4.2 | **You cannot wear other armour.** |  | ☐ |  |
| A-26b | §4.2 | Attempting it suppresses Living Plate, every Mutation, and your Instinct until you take it off. |  | ☐ |  |

## Carapace Block and the broken state (guide §4.3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| A-27a | §4.3 | **2**, plus the **highest** Hardness bonus among your bound Substrates (Diamond, Steel, Chromium), plus Gray's Instinct. |  | ☐ |  |
| A-27b | §4.3 | Substrate bonuses do not add together unless a Bond says so (*Adamant Shell*). |  | ☐ |  |
| A-28 | §4.3 | **10 + 5 per level** |  | ☐ |  |
| A-29 | §4.3 | Half its Hit Points |  | ☐ |  |
| A-30 | §4.3 | **Carapace Block** 🜲 **Reaction** — *Trigger:* you take physical damage. |  | ☐ |  |
| A-31 | §4.3 | *Effect:* reduce the damage by your Carapace's Hardness. |  | ☐ |  |
| A-32 | §4.3 | The Carapace takes that much damage. |  | ☐ |  |
| A-33 | §4.3 | **While broken**, you lose Living Plate's rune benefits |  | ☐ |  |
| A-34 | §4.3 | **every Mutation at Depth 3 or higher switches off** until the Carapace is repaired |  | ☐ |  |
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
| A-56 | §4.8 | You need neither food, drink nor air, and you are **immune to disease**. |  | ☐ |  |
| A-57 | §4.8 | You are **immune to the drained condition** |  | ☐ |  |
| A-58 | §4.8 | and to any effect that would alter your physical form against your will (petrification, polymorph, and the like) |  | ☐ |  |
| A-59 | §4.8 | You can be healed by **Repair** as well as by anything that heals a creature. |  | ☐ |  |
| A-60 | §4.8 | you are **immune to precision damage** and to critical specialization effects of the knife and pick groups. |  | ☐ |  |

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
| ☐ | 76 |
| ✅ | 0 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **76** |

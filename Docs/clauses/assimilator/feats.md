# Clauses — Assimilator feats

*Feat tracker. Every class feat's independently-failable sentences, one row each. Source:
`Docs/assimilator-guide-v1.md` §8.*

**Tier:** feats · **Tracker issue:** #96

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

*The feats' own shape.* Most are ordinary pf2e feat content. Three families are not: the **Mass**
feats (`AF-01`, `AF-02`, `AF-18`, `AF-26`, `AF-34`) must move the same pools the Gullet spends and
never write them on their own; the **non-stacking pairs** the guide declares — *Two Instincts* with
Electrum, *Apex Predator* with Gold — each owe a predicate that refuses the second; and *The Thing That
Wears You* is a summon, which the programme schedules as though it were three feats.

**IDs are `AF-<nn><letter>`**, numbered in the guide's order. A sentence of pure fiction — *"You had
forgotten."* — is not a clause and has no row.

---

## 1st level (guide §8.1)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-01 | §8.1 Second Stomach | Your Gem Mass increases by **1**. |  | ☐ |  |
| AF-02 | §8.1 Iron Gullet | Your Metal Mass increases by **1**. |  | ☐ |  |
| AF-03a | §8.1 Grasping Plates | You grow a second Strike form. |  | ☐ |  |
| AF-03b | §8.1 Grasping Plates | **Talons** — unarmed, **1d6 slashing**, brawling group, traits `agile`, `finesse`, `unarmed`. |  | ☐ |  |
| AF-03c | §8.1 Grasping Plates | You may use either it or your Carapace Strike freely. |  | ☐ |  |
| AF-04 | §8.1 Reach of the Thing | **Free action**, once per round, before a Strike: that Carapace Strike gains **reach 10 feet**. |  | ☐ |  |
| AF-05a | §8.1 Taste for It | You can identify any Substrate by touch. |  | ☐ |  |
| AF-05b | §8.1 Taste for It | When you deal damage to a creature, you may **Recall Knowledge** about it as a free action once per encounter, with a **+2 circumstance bonus**. |  | ☐ |  |

## 2nd level (guide §8.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-06a | §8.2 Devour | ◆ *(Interact)* Consume an object of light Bulk or less that you are holding. |  | ☐ |  |
| AF-06b | §8.2 Devour | Gain **temporary Hit Points equal to your level**, lasting 1 minute. |  | ☐ |  |
| AF-06c | §8.2 Devour | Once per 10 minutes. |  | ☐ |  |
| AF-07a | §8.2 Plated Guard | ◆ You thicken. Gain a **+2 circumstance bonus to AC** until the start of your next turn. |  | ☐ |  |
| AF-07b | §8.2 Plated Guard | You cannot use **Carapace Block** while it lasts — the plate is busy. |  | ☐ |  |
| AF-08a | §8.2 Spit | ◆ A **ranged unarmed Strike**, range 20 feet, **1d6** damage of your Instinct's type. |  | ☐ |  |
| AF-08b | §8.2 Spit | It uses your Carapace Strike's attack bonus and counts toward your multiple attack penalty. |  | ☐ |  |
| AF-09 | §8.2 Sympathetic Growth | Once per day, ◆ *(touch)*: an ally gains **one resistance you have, at half value**, for 10 minutes. |  | ☐ |  |

## 4th level (guide §8.3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-10 | §8.3 Deep Feeding | Once per day you may **Feed** as a 1-minute activity instead of 10 minutes. |  | ☐ |  |
| AF-11a | §8.3 Additional Bond | *Prerequisite: at least one Bond.* |  | ☐ |  |
| AF-11b | §8.3 Additional Bond | You gain **one additional Bond slot**. |  | ☐ |  |
| AF-12a | §8.3 Wall of Me | ◆◆, once per encounter. Extrude a 10-foot line of Carapace in your space or adjacent to it. |  | ☐ |  |
| AF-12b | §8.3 Wall of Me | It provides **standard cover**, has **Hardness equal to your level** and **Hit Points equal to five times your level**, and lasts 1 minute or until destroyed. |  | ☐ |  |
| AF-12c | §8.3 Wall of Me | While it stands, your own Carapace's Hardness is reduced by 2. |  | ☐ |  |
| AF-13 | §8.3 Barbed Growth | A creature that **critically fails** a melee Strike against you takes damage equal to **twice your highest Depth**, of your Instinct's damage type. |  | ☐ |  |

## 6th level (guide §8.4)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-14a | §8.4 Deep Vein | *Prerequisite: a Substrate at your Depth cap.* |  | ☐ |  |
| AF-14b | §8.4 Deep Vein | One Substrate of your choice may exceed your **Depth cap by 1**, to a maximum of Depth 4. |  | ☐ |  |
| AF-14c | §8.4 Deep Vein | You still pay its Mass. |  | ☐ |  |
| AF-15a | §8.4 Twin Maw | ◆◆ Make two Carapace Strikes against the same creature. |  | ☐ |  |
| AF-15b | §8.4 Twin Maw | Both count toward your multiple attack penalty as normal, and if both hit, **combine their damage before applying resistance**. |  | ☐ |  |
| AF-16 | §8.4 Digest | Once per day, ◆◆◆ *(1 minute)*: reduce the stage of one affliction affecting you by **2**. |  | ☐ |  |
| AF-17 | §8.4 Instinctive Surge | **Free action**, once per encounter: until the end of your turn, your **Instinct clause treats every Substrate as one Depth higher**. |  | ☐ |  |

## 8th level (guide §8.5)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-18 | §8.5 Mass Growth | Your Gem Mass and Metal Mass each increase by **1**. |  | ☐ |  |
| AF-19a | §8.5 Shed Skin | 🜲 **Reaction** — *Trigger:* you gain a condition of value 2 or lower. *Effect:* end it. |  | ☐ |  |
| AF-19b | §8.5 Shed Skin | Your Carapace takes damage equal to **five times the condition's value**. |  | ☐ |  |
| AF-20a | §8.5 Burrower | *Prerequisite: a metal Substrate at Depth 2 or higher.* |  | ☐ |  |
| AF-20b | §8.5 Burrower | You gain a **burrow Speed of 15 feet** through earth, sand and loose stone. |  | ☐ |  |
| AF-21 | §8.5 Bonded Deep | One Bond you know functions with its Substrates at **Depth 1** instead of Depth 2. |  | ☐ |  |

## 10th level (guide §8.6)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-22a | §8.6 Two Instincts | You gain a **second Instinct clause** of your choice. |  | ☐ |  |
| AF-22b | §8.6 Two Instincts | Both operate at **half value** (round down, minimum 1). |  | ☐ |  |
| AF-22c | §8.6 Two Instincts | *This does not stack with Electrum's Alloyed Instinct — take the better.* |  | ☐ |  |
| AF-23 | §8.6 Rampart | Once per round, when an adjacent ally takes physical damage, they gain **resistance equal to half your Carapace's Hardness** (maximum 5) against it. |  | ☐ |  |
| AF-24a | §8.6 Consume the Fallen | ◆◆◆ *(1 minute, over a corpse)*: gain **temporary Hit Points equal to twice your level**, and until your next daily preparations one bound Substrate counts as **one Depth higher** (never above your cap). |  | ☐ |  |
| AF-24b | §8.6 Consume the Fallen | Once per day. |  | ☐ |  |
| AF-25a | §8.6 Greater Bond | Choose one Bond you know. |  | ☐ |  |
| AF-25b | §8.6 Greater Bond | Its numeric values increase by **half again**, rounded up. |  | ☐ |  |

## 12th level (guide §8.7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-26 | §8.7 Greater Mass Growth | Your Gem Mass and Metal Mass each increase by **2**. |  | ☐ |  |
| AF-27 | §8.7 Living Fortress | If you did not move on your last turn, your Carapace's **Hardness doubles** until you do. |  | ☐ |  |
| AF-28a | §8.7 Assimilate | Once per day, ◆◆◆ *(10 minutes, over the remains of a creature of your level or lower)*: gain **one of its resistances, senses, or movement modes** until your next daily preparations. |  | ☐ |  |
| AF-28b | §8.7 Assimilate | Not its spells and not its Strikes. |  | ☐ |  |
| AF-29a | §8.7 Perfect Adaptation | You gain **Moonstone's Reactive Evolution at Depth 2** without binding Moonstone. |  | ☐ |  |
| AF-29b | §8.7 Perfect Adaptation | If you already hold Moonstone, treat it as **one Depth higher** for this Mutation only. |  | ☐ |  |

## 14th level (guide §8.8)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-30a | §8.8 Apex Predator | When you critically hit with a Mutation, apply that Substrate's **Depth 4 rider**, whether or not it is at Depth 4. |  | ☐ |  |
| AF-30b | §8.8 Apex Predator | *Does not stack with Gold's Instinct clause — take the better.* |  | ☐ |  |
| AF-31 | §8.8 Regurgitate | **Free action**, once per day: **Shed** one Substrate and immediately **Feed** a Substrate you are carrying, at Depth 1. |  | ☐ |  |
| AF-32 | §8.8 Unbreakable Shell | Once per day, when your Carapace would be reduced below its **Broken Threshold**, it is instead reduced to exactly that threshold. |  | ☐ |  |
| AF-33 | §8.8 Chimeric Frame | You gain **two of Nickel's Aberrations** without binding Nickel, re-rolled or re-chosen at each daily preparations. |  | ☐ |  |

## 16th level (guide §8.9)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-34 | §8.9 Legendary Mass | Your Gem Mass and Metal Mass each increase by **3**. |  | ☐ |  |
| AF-35a | §8.9 Instinct Fusion | *Prerequisite: Two Instincts, or Electrum at Depth 3.* |  | ☐ |  |
| AF-35b | §8.9 Instinct Fusion | Both of your Instinct clauses operate at **full value**. |  | ☐ |  |
| AF-36 | §8.9 Living Weapon | Your Carapace Strike and Talons each gain **one additional damage die**. |  | ☐ |  |
| AF-37a | §8.9 Second Hunger | **Free action**, once per encounter: gain **2 Mass** in one track for 1 minute, which you must spend immediately to deepen a bound Substrate. |  | ☐ |  |
| AF-37b | §8.9 Second Hunger | When it ends, that Substrate returns to its real Depth. |  | ☐ |  |

## 18th level (guide §8.10)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-38a | §8.10 Fifth Depth | One Substrate may reach **Depth 5**, costing 5 Mass. |  | ☐ |  |
| AF-38b | §8.10 Fifth Depth | Its Depth 4 rider applies **twice** where that is meaningful, and all of its numeric values increase by **half again**. |  | ☐ |  |
| AF-39a | §8.10 Total Assimilation | *Prerequisite: Assimilate.* |  | ☐ |  |
| AF-39b | §8.10 Total Assimilation | One ability taken with **Assimilate** becomes **permanent**. |  | ☐ |  |
| AF-39c | §8.10 Total Assimilation | You may replace it by using Assimilate on something better. |  | ☐ |  |
| AF-40 | §8.10 Devouring Plate | When you reduce a creature to 0 Hit Points with a Carapace Strike, you may **Feed** on it as a free action: gain a **temporary Substrate of any kind at Depth 2** until your next daily preparations, costing no Mass. |  | ☐ |  |
| AF-41 | §8.10 Shared Symbiosis | Once per day, ◆◆ *(touch)*: a willing ally gains one of your **Mutations at Depth 1** for 10 minutes. |  | ☐ |  |

## 20th level (guide §8.11)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-42 | §8.11 Perfect Organism | **Every bound Substrate counts as being at your Depth cap**, regardless of the Mass you actually paid for it. |  | ☐ |  |
| AF-43a | §8.11 Omnivore | You have **two Instincts at full value**, and your Gem Mass and Metal Mass **merge into a single pool** of their combined size. |  | ☐ |  |
| AF-43b | §8.11 Omnivore | Gems and metals no longer compete for separate space — the distinction stops meaning anything to you. |  | ☐ |  |
| AF-44a | §8.11 The Thing That Wears You | Once per day, ◆◆◆: the Carapace separates for 1 minute. |  | ☐ |  |
| AF-44b | §8.11 The Thing That Wears You | It acts on your initiative − 5 with your Strikes, your Mutations and your Assimilator DC, and it has your Hit Points as its own. |  | ☐ |  |
| AF-44c | §8.11 The Thing That Wears You | While it is away you are unarmoured, unmutated, and a person again. |  | ☐ |  |
| AF-45a | §8.11 Eat the World | Once per day, ◆◆◆ *(1 minute)*: consume a magic item of level equal to or lower than your own. |  | ☐ |  |
| AF-45b | §8.11 Eat the World | Until your next daily preparations you gain **one of its abilities** and **4 temporary Mass** in either track. |  | ☐ |  |
| AF-45c | §8.11 Eat the World | The item is destroyed and nobody is getting it back. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 77 |
| ✅ | 0 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **77** |

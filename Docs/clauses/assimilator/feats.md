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

*How they are built (Phase 6).* Feats that are a number or a rule carry it on their own item; the Mass feats and Additional Bond are `grants` the engine sums; the feats that move Depths, caps and Instinct clauses are read by the engine; the rest — pickers, prompts and reactions — are `scripts/assimilator/feats.mjs`.

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
| AF-01 | §8.1 Second Stomach | Your Gem Mass increases by **1**. | `rig` | ✅ | Rig, live: Gem Mass **11 → 12** at 17th; the Gullet spends the same pool |
| AF-02 | §8.1 Iron Gullet | Your Metal Mass increases by **1**. | `rig` | ✅ | Rig, live: Metal Mass **8 → 9** |
| AF-03a | §8.1 Grasping Plates | You grow a second Strike form. | `rig` | ✅ | Rig, live: *Talons* beside the Carapace Strike on the sheet |
| AF-03b | §8.1 Grasping Plates | **Talons** — unarmed, **1d6 slashing**, brawling group, traits `agile`, `finesse`, `unarmed`. | `rig` | ✅ | Rig, live: Talons — **1d6 slashing**, brawling, **agile, finesse, unarmed** (Ruby adds versatile fire to both, as it does every unarmed Strike) |
| AF-03c | §8.1 Grasping Plates | You may use either it or your Carapace Strike freely. | `rig` | ✅ | Rig, live: both Strikes are on the sheet at once, each rollable (AF-36 rolls both) |
| AF-04 | §8.1 Reach of the Thing | **Free action**, once per round, before a Strike: that Carapace Strike gains **reach 10 feet**. | `rig` | ✅ | Rig, live: the free action gave the Carapace Strike **reach** (10 feet for a Medium creature) and the Strike's attack roll spent it; once per round. **Fixed while driving:** pf2e has no `reach-10` trait |
| AF-05a | §8.1 Taste for It | You can identify any Substrate by touch. |  | — | Nothing to automate: identifying a Substrate by touch is the table's |
| AF-05b | §8.1 Taste for It | When you deal damage to a creature, you may **Recall Knowledge** about it as a free action once per encounter, with a **+2 circumstance bonus**. | `rig` | ✅ | Rig, live, in an encounter: the first damage put *Taste for It* (+2 circumstance to Recall Knowledge) on the Assimilator with a whisper; the second that encounter did not |

## 2nd level (guide §8.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-06a | §8.2 Devour | ◆ *(Interact)* Consume an object of light Bulk or less that you are holding. | `rig` | ✅ | Rig, live: the picker offered the held Chalk (light Bulk) and one was eaten |
| AF-06b | §8.2 Devour | Gain **temporary Hit Points equal to your level**, lasting 1 minute. | `rig` | ✅ | Rig, live: **17** temporary Hit Points (level 17), with *Effect: Devour* for the minute; they end with it |
| AF-06c | §8.2 Devour | Once per 10 minutes. | `rig` | ✅ | Rig, live: the feat's Frequency is **once per 10 minutes**, and the use spent it (0 left) |
| AF-07a | §8.2 Plated Guard | ◆ You thicken. Gain a **+2 circumstance bonus to AC** until the start of your next turn. | `rig` | ✅ | Rig, live: AC **+2** until the start of the next turn |
| AF-07b | §8.2 Plated Guard | You cannot use **Carapace Block** while it lasts — the plate is busy. | `rig` | ✅ | Rig, live: Carapace Block's card was **refused** while Plated Guard lasted |
| AF-08a | §8.2 Spit | ◆ A **ranged unarmed Strike**, range 20 feet, **1d6** damage of your Instinct's type. | `rig` | ✅ | Rig, live: *Spit* — ranged, increment **20**, **1d6 cold** under the Blue Instinct |
| AF-08b | §8.2 Spit | It uses your Carapace Strike's attack bonus and counts toward your multiple attack penalty. | `rig` | ✅ | Rig, live: Spit's attack modifier equals the Carapace Strike's — a modifier swaps the ranged Strike's Dexterity for the Carapace's Strength. The multiple attack penalty is pf2e's own |
| AF-09 | §8.2 Sympathetic Growth | Once per day, ◆ *(touch)*: an ally gains **one resistance you have, at half value**, for 10 minutes. | `rig` | ✅ | Rig, live: the targeted ally gained **fire 2** from the Assimilator's fire 5, for 10 minutes; once a day |

## 4th level (guide §8.3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-10 | §8.3 Deep Feeding | Once per day you may **Feed** as a 1-minute activity instead of 10 minutes. |  | — | Nothing to automate: Feed's duration is exploration time, which the module does not track (Feed is refused in an encounter either way) |
| AF-11a | §8.3 Additional Bond | *Prerequisite: at least one Bond.* | `validate` | ✅ | The feat carries the prerequisite "at least one Bond"; pf2e shows prerequisites and leaves them to the table, as for every feat |
| AF-11b | §8.3 Additional Bond | You gain **one additional Bond slot**. | `rig` | ✅ | Rig, live: Bond slots **4 → 5** at 17th |
| AF-12a | §8.3 Wall of Me | ◆◆, once per encounter. Extrude a 10-foot line of Carapace in your space or adjacent to it. | `rig` | ⚠️ | Rig, live, in an encounter: the wall was raised, and a second use that encounter was **refused**. **The gap:** it is placed east of the Assimilator; moving it to the square you want is the table's |
| AF-12b | §8.3 Wall of Me | It provides **standard cover**, has **Hardness equal to your level** and **Hit Points equal to five times your level**, and lasts 1 minute or until destroyed. | `rig` | ⚠️ | Rig, live: the wall has **Hardness 17** and **85** Hit Points, and was removed when its minute ended. **The gap:** pf2e does not compute cover from a token, so its standard cover is the table's |
| AF-12c | §8.3 Wall of Me | While it stands, your own Carapace's Hardness is reduced by 2. | `rig` | ✅ | Rig, live: the Living Plate's Hardness was **2 lower** while the wall stood |
| AF-13 | §8.3 Barbed Growth | A creature that **critically fails** a melee Strike against you takes damage equal to **twice your highest Depth**, of your Instinct's damage type. | `rig` | ✅ | Rig, live: the Claw critically failed against the Assimilator and its bearer took **6** fire (twice Ruby 3, the Red Instinct's type) |

## 6th level (guide §8.4)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-14a | §8.4 Deep Vein | *Prerequisite: a Substrate at your Depth cap.* | `validate` | ✅ | The feat carries the prerequisite "a Substrate at your Depth cap" |
| AF-14b | §8.4 Deep Vein | One Substrate of your choice may exceed your **Depth cap by 1**, to a maximum of Depth 4. | `rig`, `test-assimilator` | ✅ | Rig, live: at 5th (Depth cap 2) Ruby chosen reaches **3**; unchosen, **2**. Feed allows the step |
| AF-14c | §8.4 Deep Vein | You still pay its Mass. | `rig`, `test-assimilator` | ✅ | Rig, live: its **3** Gem Mass is still spent |
| AF-15a | §8.4 Twin Maw | ◆◆ Make two Carapace Strikes against the same creature. | `rig` | ✅ | Rig, live: *Twin Maw* made **two** Carapace Strikes against the **one** targeted creature |
| AF-15b | §8.4 Twin Maw | Both count toward your multiple attack penalty as normal, and if both hit, **combine their damage before applying resistance**. | `rig` | ⚠️ | Both Strikes count toward the multiple attack penalty (pf2e's own). **The gap:** their damage is applied separately; combining it before resistance is the table's |
| AF-16 | §8.4 Digest | Once per day, ◆◆◆ *(1 minute)*: reduce the stage of one affliction affecting you by **2**. | `rig` | ⚠️ | Rig, live: the picker offered a poison at stage 3 and left it at **1**; once a day. **The gap:** production pf2e has no affliction items, so an affliction is read as a poison, disease or curse effect whose counter badge is its stage |
| AF-17 | §8.4 Instinctive Surge | **Free action**, once per encounter: until the end of your turn, your **Instinct clause treats every Substrate as one Depth higher**. | `rig`, `test-assimilator` | ✅ | Rig, live, in an encounter: Ruby 3 counted as **4** for the Red clause until the end of the turn; a second use that encounter was refused |

## 8th level (guide §8.5)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-18 | §8.5 Mass Growth | Your Gem Mass and Metal Mass each increase by **1**. | `rig` | ✅ | Rig, live: Gem **12**, Metal **9** |
| AF-19a | §8.5 Shed Skin | 🜲 **Reaction** — *Trigger:* you gain a condition of value 2 or lower. *Effect:* end it. | `rig` | ✅ | Rig, live: frightened 2 arrived and the owner was offered *Shed Skin*; the button ended it |
| AF-19b | §8.5 Shed Skin | Your Carapace takes damage equal to **five times the condition's value**. | `rig` | ✅ | Rig, live: the Carapace took **10** (five times 2) |
| AF-20a | §8.5 Burrower | *Prerequisite: a metal Substrate at Depth 2 or higher.* | `rig` | ✅ | Rig, live: with Iron at 1 there is **no** burrow Speed — the prerequisite is the rule's predicate |
| AF-20b | §8.5 Burrower | You gain a **burrow Speed of 15 feet** through earth, sand and loose stone. | `rig` | ✅ | Rig, live: Iron at 2 — burrow **15** |
| AF-21 | §8.5 Bonded Deep | One Bond you know functions with its Substrates at **Depth 1** instead of Depth 2. | `rig`, `test-assimilator` | ✅ | Rig, live: Molten Carapace in force with **Ruby 1 + Iron 1** when Bonded Deep names it |

## 10th level (guide §8.6)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-22a | §8.6 Two Instincts | You gain a **second Instinct clause** of your choice. | `rig`, `test-assimilator` | ✅ | Rig, live: *Instinct: Green* beside *Instinct: Red*, chosen in the Gullet |
| AF-22b | §8.6 Two Instincts | Both operate at **half value** (round down, minimum 1). | `rig`, `test-assimilator` | ✅ | Rig, live: scale **0.5** |
| AF-22c | §8.6 Two Instincts | *This does not stack with Electrum's Alloyed Instinct — take the better.* | `rig`, `test-assimilator` | ✅ | Rig, live: with Electrum 4 as Blue too, **Blue at full** and not Green — one second clause, the better. The validator requires the feat to declare the pair; `test-assimilator` pins the choice |
| AF-23 | §8.6 Rampart | Once per round, when an adjacent ally takes physical damage, they gain **resistance equal to half your Carapace's Hardness** (maximum 5) against it. | `rig` | ✅ | Rig, live, in an encounter: the adjacent ally's 10 slashing took **5** (half the plate's Hardness, max 5); the second blow that round took 10. Applied after resistances |
| AF-24a | §8.6 Consume the Fallen | ◆◆◆ *(1 minute, over a corpse)*: gain **temporary Hit Points equal to twice your level**, and until your next daily preparations one bound Substrate counts as **one Depth higher** (never above your cap). | `rig` | ✅ | Rig, live: **34** temporary Hit Points and Ruby **2 → 3** until the next preparations ("over a corpse" is the table's) |
| AF-24b | §8.6 Consume the Fallen | Once per day. | `validate` | ✅ | The feat's Frequency is once a day; pf2e spends a Frequency on use (driven for Devour, AF-06c) |
| AF-25a | §8.6 Greater Bond | Choose one Bond you know. | `rig` | ✅ | Rig, live: chosen in the Gullet among the Bonds you know |
| AF-25b | §8.6 Greater Bond | Its numeric values increase by **half again**, rounded up. | `rig` | ⚠️ | Rig, live: Molten Carapace's +5 Hardness became **8** and its 8 fire **12**. Scaled likewise: Conduction's +2 per die, Living Flame's +5, Blackfire's heal, Siege Frame's 10, Lightning Lash's half, Ascension's +20, Runaway Growth's 2× level, Chitin Bloom's Hardness, Rot's 5. **The gap:** the counts and sizes that are not a value — Storm Battery's 3 charges and cone, Mindstorm's DC 5, Cold Reading's slowed 1 — are unchanged |

## 12th level (guide §8.7)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-26 | §8.7 Greater Mass Growth | Your Gem Mass and Metal Mass each increase by **2**. | `rig` | ✅ | Rig, live: Gem **13**, Metal **10** |
| AF-27 | §8.7 Living Fortress | If you did not move on your last turn, your Carapace's **Hardness doubles** until you do. | `rig` | ✅ | Rig, live, in an encounter: a turn without moving **doubled** the plate's Hardness; moving ended it. **Fixed while driving:** the doubling applied before the Substrates' additions; it applies last |
| AF-28a | §8.7 Assimilate | Once per day, ◆◆◆ *(10 minutes, over the remains of a creature of your level or lower)*: gain **one of its resistances, senses, or movement modes** until your next daily preparations. | `rig` | ✅ | Rig, live: over the level-10 target, the picker offered its resistances, senses and movement modes; **cold 5** was taken until the next preparations |
| AF-28b | §8.7 Assimilate | Not its spells and not its Strikes. | `rig` | ✅ | Rig, live: no Strike and no spell was offered |
| AF-29a | §8.7 Perfect Adaptation | You gain **Moonstone's Reactive Evolution at Depth 2** without binding Moonstone. | `rig` | ✅ | Rig, live: *Reactive Evolution* granted without Moonstone, at Depth 2's limits |
| AF-29b | §8.7 Perfect Adaptation | If you already hold Moonstone, treat it as **one Depth higher** for this Mutation only. |  | ⚠️ | Implemented (Moonstone counts one higher for Reactive Evolution's limits alone); not driven separately |

## 14th level (guide §8.8)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-30a | §8.8 Apex Predator | When you critically hit with a Mutation, apply that Substrate's **Depth 4 rider**, whether or not it is at Depth 4. | `rig` | ✅ | Rig, live: a critical hit posted the **Depth 4 rows** of Ruby and Sapphire, the Mutations on the Strike. Applying them is on the card |
| AF-30b | §8.8 Apex Predator | *Does not stack with Gold's Instinct clause — take the better.* | `rig` | ✅ | Rig, live: with Gold's Instinct too, **one** card (Apex Predator's), not both |
| AF-31 | §8.8 Regurgitate | **Free action**, once per day: **Shed** one Substrate and immediately **Feed** a Substrate you are carrying, at Depth 1. | `rig` | ✅ | Rig, live: Ruby shed and a carried Copper Ingot fed in at **Depth 1**, at once |
| AF-32 | §8.8 Unbreakable Shell | Once per day, when your Carapace would be reduced below its **Broken Threshold**, it is instead reduced to exactly that threshold. | `rig` | ✅ | Rig, live: a Block that would break the plate left it at **exactly its Broken Threshold**; once a day |
| AF-33 | §8.8 Chimeric Frame | You gain **two of Nickel's Aberrations** without binding Nickel, re-rolled or re-chosen at each daily preparations. | `rig` | ✅ | Rig, live: **two** Aberrations with no Nickel bound, chosen or rolled in the Gullet |

## 16th level (guide §8.9)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-34 | §8.9 Legendary Mass | Your Gem Mass and Metal Mass each increase by **3**. | `rig` | ✅ | Rig, live: Gem **14**, Metal **11** |
| AF-35a | §8.9 Instinct Fusion | *Prerequisite: Two Instincts, or Electrum at Depth 3.* | `validate` | ✅ | The feat carries the prerequisite "Two Instincts, or Electrum at Depth 3" |
| AF-35b | §8.9 Instinct Fusion | Both of your Instinct clauses operate at **full value**. | `rig`, `test-assimilator` | ✅ | Rig, live: with Two Instincts, scale **1** |
| AF-36 | §8.9 Living Weapon | Your Carapace Strike and Talons each gain **one additional damage die**. | `rig` | ✅ | Rig, live: the Carapace Strike rolls **2d8**, Talons **2d6**. **Fixed while driving:** the class already has a feature slugged `living-weapon`; the feat is `living-weapon-feat` |
| AF-37a | §8.9 Second Hunger | **Free action**, once per encounter: gain **2 Mass** in one track for 1 minute, which you must spend immediately to deepen a bound Substrate. | `rig` | ✅ | Rig, live: Ruby **2 → 4** for the minute; once per encounter |
| AF-37b | §8.9 Second Hunger | When it ends, that Substrate returns to its real Depth. | `rig` | ✅ | Rig, live: when it ended, **2** again. **Fixed while driving:** its choice was stored under the key that marks a Substrate effect, and the rebuild deleted it as a stray |

## 18th level (guide §8.10)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-38a | §8.10 Fifth Depth | One Substrate may reach **Depth 5**, costing 5 Mass. | `rig` | ✅ | Rig, live: Ruby at **Depth 5**, **5** Mass |
| AF-38b | §8.10 Fifth Depth | Its Depth 4 rider applies **twice** where that is meaningful, and all of its numeric values increase by **half again**. |  | ⚠️ | **The gap:** "its Depth 4 rider applies twice" and "numeric values half again" are not automated; a Depth 5 Substrate reads every Depth 4 rule (its badge is 5) |
| AF-39a | §8.10 Total Assimilation | *Prerequisite: Assimilate.* | `validate` | ✅ | The feat carries the prerequisite "Assimilate" |
| AF-39b | §8.10 Total Assimilation | One ability taken with **Assimilate** becomes **permanent**. | `rig` | ✅ | Rig, live: acid 5 made permanent **survived** Rest for the Night |
| AF-39c | §8.10 Total Assimilation | You may replace it by using Assimilate on something better. |  | ⚠️ | Implemented (a new permanent pick replaces the old one); not driven separately |
| AF-40 | §8.10 Devouring Plate | When you reduce a creature to 0 Hit Points with a Carapace Strike, you may **Feed** on it as a free action: gain a **temporary Substrate of any kind at Depth 2** until your next daily preparations, costing no Mass. | `rig` | ✅ | Rig, live: a kill with the Carapace Strike offered *Feed on it*; Jade came in at **Depth 2** for the day, costing **no Mass** |
| AF-41 | §8.10 Shared Symbiosis | Once per day, ◆◆ *(touch)*: a willing ally gains one of your **Mutations at Depth 1** for 10 minutes. | `rig` | ✅ | Rig, live: the targeted ally gained *Substrate: Ruby* at **Depth 1** for **10 minutes** |

## 20th level (guide §8.11)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AF-42 | §8.11 Perfect Organism | **Every bound Substrate counts as being at your Depth cap**, regardless of the Mass you actually paid for it. | `rig`, `test-assimilator` | ✅ | Rig, live: Ruby paid 1 and Iron paid 2 both manifest at **4**; Mass spent is still **1** |
| AF-43a | §8.11 Omnivore | You have **two Instincts at full value**, and your Gem Mass and Metal Mass **merge into a single pool** of their combined size. | `rig`, `test-assimilator` | ✅ | Rig, live: one pool (a 12th Gem Mass spent from the Metal side), and two Instincts at **full** |
| AF-43b | §8.11 Omnivore | Gems and metals no longer compete for separate space — the distinction stops meaning anything to you. | `rig`, `test-assimilator` | ✅ | Covered by the same drive |
| AF-44a | §8.11 The Thing That Wears You | Once per day, ◆◆◆: the Carapace separates for 1 minute. | `rig` | ✅ | Rig, live, in an encounter: the Thing separated for 1 minute and was removed when it ended |
| AF-44b | §8.11 The Thing That Wears You | It acts on your initiative − 5 with your Strikes, your Mutations and your Assimilator DC, and it has your Hit Points as its own. | `rig` | ⚠️ | Rig, live: its Hit Points are the Assimilator's, it acts at **initiative −5**, with the Carapace Strike. **The gap:** it carries the Strike, not the Mutations or the Assimilator DC |
| AF-44c | §8.11 The Thing That Wears You | While it is away you are unarmoured, unmutated, and a person again. | `rig` | ✅ | Rig, live: the Assimilator was **suppressed** (every Mutation off) and the plate's AC and Hardness **0** |
| AF-45a | §8.11 Eat the World | Once per day, ◆◆◆ *(1 minute)*: consume a magic item of level equal to or lower than your own. | `rig` | ✅ | Rig, live: the picker offered magic items of level 17 or lower; the potion was consumed |
| AF-45b | §8.11 Eat the World | Until your next daily preparations you gain **one of its abilities** and **4 temporary Mass** in either track. | `rig` | ⚠️ | Rig, live: **+4 Gem Mass** until the next preparations (and no Vein grant for it). **The gap:** "one of its abilities" is the table's |
| AF-45c | §8.11 Eat the World | The item is destroyed and nobody is getting it back. | `rig` | ✅ | Rig, live: the item is **deleted** |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 65 |
| ⚠️ | 10 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 2 |
| **Total** | **77** |

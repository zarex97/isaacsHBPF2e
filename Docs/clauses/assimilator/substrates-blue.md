# Clauses — 🔵 Blue Substrates

*Substrate tracker. Every independently-failable declaration the lexicon makes about the four 🔵 Blue
Substrates (Adapt / Understand), one row each. Source: `Docs/homebrewing/carapace-material-lexicon-v3.md` §8 —
the guide's §6 makes the lexicon its Chapter 5 and does not reprint it.*

**Tier:** Substrates · **Colour:** 🔵 Blue · **Tracker issue:** #88

## How a row is marked

| Mark | Meaning |
| :-- | :-- |
| ☐ | Not yet driven |
| ✅ | Driven live; the clause happened by itself |
| ⚠️ | Driven live; partially happens — the gap is named in **Evidence** |
| ❌ | Driven live; does not happen |
| 🔧 | Was ❌ or ⚠️, a fix has landed, awaiting re-drive |
| — | Nothing to automate (pure roleplaying / GM ruling) |

**Clause** is a verbatim fragment of the lexicon (`Docs/homebrewing/carapace-material-lexicon-v3.md`). `build/check-clauses.mjs` asserts it still is one, so a
paraphrase here or an edit to the source fails the build. **Static check** names the assertion that
guards it; **Evidence** names what proved it happened at the table.

*How a clause is driven — the rig, the traps it sets and what a ✅ owes — is
`Docs/tools/live-verification.md`. It is the one copy; this file records results, not method.*

*Nothing is implemented yet.* Every row starts ☐, and the Assimilator is being built against these
rows rather than checked after the fact — a clause is done when it is ✅, not when its JSON exists.

*🔵 Blue's own shape.* **Senses, knowledge, and the class's only ranged Strike.** Cobalt's Arcane Channel is the one Substrate that adds a Strike rather than altering the Carapace Strike, and Tin's tremorsense is the first sense that has to change precision with Depth.

**IDs are `<Substrate>-<Depth><letter>`** — `SA-` Sapphire, `LA-` Lapis Lazuli, `CO-` Cobalt, `SN-` Tin. The number *is* the Depth, so `RU-3b` is the second
clause of Ruby's Depth 3. Every Depth 3 and Depth 4 row also owes the broken-Carapace check: the rider
stops while the Carapace is broken and comes back when it is repaired (class tracker, `A-34`).

---

## 💎 Sapphire — *Glacial Lattice* (lexicon §8)

**Essence:** Ice / Focus · **Prefix:** `SA-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SA-1a | Sapphire D1 | Your Strikes may deal **cold**. |  | ✅ | Live: the Carapace Strike gained **versatile-cold** |
| SA-1b | Sapphire D1 | +1 item bonus to saves against effects that would break your concentration. | `rig` | — | Nothing to automate: pf2e has no concentration mechanic, so no save says it would break your concentration. The Note on the Will card tells the table (#88, Q1) |
| SA-2a | Sapphire D2 | **+1d4 cold.** |  | ✅ | Live: **`+ 1d4 cold`** at Depth 2 |
| SA-2b | Sapphire D2 | Critical hits reduce the target's Speeds by **5 feet** until the end of its next turn. | `rig` | ✅ | Rig, live: a critical at Depth 2 put *Effect: Glacial Chill* (all Speeds −5 until the end of its next turn) on the target — a rider now, not a Note |
| SA-3a | Sapphire D3 | **+1d6 cold.** | `rig` | ✅ | Rig, live: **`+ 1d6 cold`** at Depth 3 and no d4 |
| SA-3b | Sapphire D3 | Critical hits make the target **slowed 1** until the end of its next turn. | `rig` | ✅ | Rig, live: a critical at Depth 3 left the target **slowed 1**; the same critical at Depth 2 did not |
| SA-4a | Sapphire D4 | **+1d6 cold.** |  | ✅ | Live: **1d6 cold** at Depth 4 — Arcane Channel read `5d6` cold (4d6 + Sapphire's 1d6) |
| SA-4b | Sapphire D4 | Any creature you damage with cold must succeed at a Fortitude save against your class DC or be **slowed 1** until the end of its next turn. | `rig` | ✅ | Rig, live: a hit at Depth 4 on a target with Fortitude −40 — the save failed and it was **slowed** |

## 💎 Lapis Lazuli — *Reading Eye* (lexicon §8)

**Essence:** Knowledge · **Prefix:** `LA-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| LA-1a | Lapis Lazuli D1 | Once per round, **Recall Knowledge** about a creature you can see as a free action. |  | ✅ | Live: *Reading Eye* granted, **free**, **1/round** |
| LA-2a | Lapis Lazuli D2 | When you succeed at Recall Knowledge about a creature, allies gain **+1 circumstance to attacks** against it for 1 round. | `rig` | ✅ | Rig, live: pf2e's own Recall Knowledge, a success — every ally on the scene (the Assimilator's alliance, not the Assimilator) gets *Lapis Insight*, +1 circumstance to Strikes and spell attacks against **that creature's signature**, for 1 round; the Assimilator gets none. Control: a failure gives nothing. pf2e gives no alliance roll option, so the bonus goes to the allies rather than onto the creature; pf2e's Recall Knowledge records no target, so the roller's own targeted token names it (#88, Q2) |
| LA-3a | Lapis Lazuli D3 | You automatically learn one **resistance, weakness or immunity** of any creature you damage. | `rig` | ✅ | Rig, live: damaging a creature with cold resistance 5 whispered its owner **"resistance cold 5"**, once |
| LA-4a | Lapis Lazuli D4 | Once per encounter, name a creature's **strongest save**; for 1 minute your Mutations target its **weakest** instead. | `rig` | ✅ | Rig, live: *Lay Bare* (granted at Depth 4, once per encounter) marks the creature — Fortitude 30, Reflex 10, Will 5 — strongest **fortitude**, weakest **will**; Magnesium's Flare, which asks for Fortitude, then rolls **Will**. Control: not laid bare, Fortitude. The swap is in the rider engine's save step, only for a Mutation of the Assimilator that laid it bare (#88, Q3) |

## ⚙️ Cobalt — *Arcane Channel* (lexicon §8)

**Essence:** Energy / Conductivity · **Prefix:** `CO-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| CO-1a | Cobalt D1 | You gain a **30-foot ranged unarmed Strike** dealing **1d6** damage of your Instinct's type. |  | ✅ | Live: **Arcane Channel** appears as a ranged unarmed Strike |
| CO-2a | Cobalt D2 | Range **60 feet**; damage **2d6**. |  | ✅ | Live at Depth 2: range **60**, **2d6**, in the Instinct's type — **cold** for a Blue Instinct. **Fixed while driving:** the damage type was read before the rebuild settled the Instinct, so the first rebuild dealt bludgeoning |
| CO-3a | Cobalt D3 | Your Mutations' energy damage counts as **magical**; +1 circumstance bonus to counteract checks. | `rig` | ✅ | Rig, live: Arcane Channel gains **magical** at Depth 3. **+1 circumstance** rides the module's counteract rolls and sits in pf2e's `counteract-check` domain with its predicate holding; not on another roll. Control: Cobalt 2, none. Quartz's *Prism Counteract* is text and does not see it (#88, Q4) |
| CO-4a | Cobalt D4 | Range **120 feet**; damage **4d6**; once per round it may target **two** creatures. | `rig` | ✅ | Rig, live: range **120**, **4d6**. *Forked Channel* (granted at Depth 4, once per round) makes an **Arcane Channel at each** of two targets; with one target, one. Through the rider engine's `strikes` (#88, Q5) |

## ⚙️ Tin — *Sensory Bloom* (lexicon §8)

**Essence:** Sensitivity · **Prefix:** `SN-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SN-1a | Tin D1 | **Imprecise tremorsense 30 feet.** |  | ✅ | Pinned by the rule; live at Depth 3 the sheet read imprecise tremorsense 60, the next rung |
| SN-2a | Tin D2 | You detect the presence of magic within 30 feet as an **imprecise sense**. | `rig` | — | Nothing to automate: pf2e has no magic sense for a rule element to grant, and a detection mode for "carries magic" would miss magical objects and areas. The Note on the Perception card tells the table (#88, Q6) |
| SN-3a | Tin D3 | Tremorsense **60 feet**. |  | ✅ | Live: **tremorsense, imprecise, 60** |
| SN-3b | Tin D3 | Invisible creatures within 30 feet are **concealed** to you rather than undetected. | `rig` | ✅ | Rig, live, on a scene with rules-based vision: Tin 3 grants pf2e's **see-invisibility**, and its Foundry detection is held to **30 feet** — pf2e hands it an unlimited range, so the module clamps it when Tin is its source. Control: Tin 2 has none (#88, Q7) |
| SN-4a | Tin D4 | **Precise tremorsense 30 feet.** |  | ✅ | Live: **tremorsense, precise, 30** |
| SN-4b | Tin D4 | You can track any creature that passed within 30 feet of you in the last 24 hours |  | — | Nothing to automate: whether a creature passed near you in the last day is fiction the table keeps. Split from SN-4b (#88, Q8) |
| SN-4c | Tin D4 | with a +2 circumstance bonus. | `rig` | ✅ | Rig, live: Survival carries **+2 circumstance** predicated on tracking (`action:track`) |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 20 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 3 |
| **Total** | **23** |

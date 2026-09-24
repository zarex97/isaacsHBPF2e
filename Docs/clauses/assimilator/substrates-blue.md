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
| SA-1a | Sapphire D1 | Your Strikes may deal **cold**. |  | ☐ |  |
| SA-1b | Sapphire D1 | +1 item bonus to saves against effects that would break your concentration. |  | ☐ |  |
| SA-2a | Sapphire D2 | **+1d4 cold.** |  | ☐ |  |
| SA-2b | Sapphire D2 | Critical hits reduce the target's Speeds by **5 feet** until the end of its next turn. |  | ☐ |  |
| SA-3a | Sapphire D3 | **+1d6 cold.** |  | ☐ |  |
| SA-3b | Sapphire D3 | Critical hits make the target **slowed 1** until the end of its next turn. |  | ☐ |  |
| SA-4a | Sapphire D4 | **+1d6 cold.** |  | ☐ |  |
| SA-4b | Sapphire D4 | Any creature you damage with cold must succeed at a Fortitude save against your class DC or be **slowed 1** until the end of its next turn. |  | ☐ |  |

## 💎 Lapis Lazuli — *Reading Eye* (lexicon §8)

**Essence:** Knowledge · **Prefix:** `LA-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| LA-1a | Lapis Lazuli D1 | Once per round, **Recall Knowledge** about a creature you can see as a free action. |  | ☐ |  |
| LA-2a | Lapis Lazuli D2 | When you succeed at Recall Knowledge about a creature, allies gain **+1 circumstance to attacks** against it for 1 round. |  | ☐ |  |
| LA-3a | Lapis Lazuli D3 | You automatically learn one **resistance, weakness or immunity** of any creature you damage. |  | ☐ |  |
| LA-4a | Lapis Lazuli D4 | Once per encounter, name a creature's **strongest save**; for 1 minute your Mutations target its **weakest** instead. |  | ☐ |  |

## ⚙️ Cobalt — *Arcane Channel* (lexicon §8)

**Essence:** Energy / Conductivity · **Prefix:** `CO-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| CO-1a | Cobalt D1 | You gain a **30-foot ranged unarmed Strike** dealing **1d6** damage of your Instinct's type. |  | ☐ |  |
| CO-2a | Cobalt D2 | Range **60 feet**; damage **2d6**. |  | ☐ |  |
| CO-3a | Cobalt D3 | Your Mutations' energy damage counts as **magical**; +1 circumstance bonus to counteract checks. |  | ☐ |  |
| CO-4a | Cobalt D4 | Range **120 feet**; damage **4d6**; once per round it may target **two** creatures. |  | ☐ |  |

## ⚙️ Tin — *Sensory Bloom* (lexicon §8)

**Essence:** Sensitivity · **Prefix:** `SN-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| SN-1a | Tin D1 | **Imprecise tremorsense 30 feet.** |  | ☐ |  |
| SN-2a | Tin D2 | You detect the presence of magic within 30 feet as an **imprecise sense**. |  | ☐ |  |
| SN-3a | Tin D3 | Tremorsense **60 feet**. |  | ☐ |  |
| SN-3b | Tin D3 | Invisible creatures within 30 feet are **concealed** to you rather than undetected. |  | ☐ |  |
| SN-4a | Tin D4 | **Precise tremorsense 30 feet.** |  | ☐ |  |
| SN-4b | Tin D4 | You can track any creature that passed within 30 feet of you in the last 24 hours with a +2 circumstance bonus. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 22 |
| ✅ | 0 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **22** |

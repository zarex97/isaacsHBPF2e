# Clauses — 🟣 Purple Substrates

*Substrate tracker. Every independently-failable declaration the lexicon makes about the four 🟣 Purple
Substrates (Mutate / Transcend), one row each. Source: `Docs/homebrewing/carapace-material-lexicon-v3.md` §9 —
the guide's §6 makes the lexicon its Chapter 5 and does not reprint it.*

**Tier:** Substrates · **Colour:** 🟣 Purple · **Tracker issue:** #89

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

*🟣 Purple's own shape.* **The lottery.** Nickel's Aberrations are rolled or chosen at daily preparations, and Quartz counteracts. Both put a daily decision into the flag model, and the Aberration table is six clauses of its own.

**IDs are `<Substrate>-<Depth><letter>`** — `AT-` Amethyst, `QZ-` Quartz, `PT-` Platinum, `NI-` Nickel. The number *is* the Depth, so `RU-3b` is the second
clause of Ruby's Depth 3. Every Depth 3 and Depth 4 row also owes the broken-Carapace check: the rider
stops while the Carapace is broken and comes back when it is repaired (class tracker, `A-34`).

---

## 💎 Amethyst — *Thought-Spines* (lexicon §9)

**Essence:** Psychic · **Prefix:** `AT-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AT-1a | Amethyst D1 | **Telepathy 30 feet** with willing creatures with whom you share a language. |  | ☐ |  |
| AT-2a | Amethyst D2 | Your Strikes may deal **mental**; **+1d4 mental**. |  | ☐ |  |
| AT-3a | Amethyst D3 | **+1d6 mental.** |  | ☐ |  |
| AT-3b | Amethyst D3 | On a critical hit the target is **stupefied 1** until the end of its next turn. |  | ☐ |  |
| AT-4a | Amethyst D4 | **+1d6 mental.** |  | ☐ |  |
| AT-4b | Amethyst D4 | Once per round, a creature you damage must succeed at a Will save against your class DC or be **confused** until the end of its next turn. |  | ☐ |  |

## 💎 Quartz — *Prism Node* (lexicon §9)

**Essence:** Arcane Resonance · **Prefix:** `QZ-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| QZ-1a | Quartz D1 | +1 circumstance bonus to saves against magic, and you know when a spell is cast within 30 feet. |  | ☐ |  |
| QZ-2a | Quartz D2 | Once per day, **counteract** one magical effect (counteract rank = half your level; modifier = your class DC − 10). |  | ☐ |  |
| QZ-3a | Quartz D3 | When you counteract an effect, or a spell fails against you, your next Strike deals **+2d6 force**. |  | ☐ |  |
| QZ-4a | Quartz D4 | Twice per day counteract. |  | ☐ |  |
| QZ-4b | Quartz D4 | Once per day, **reflect** a spell that targets only you back at its caster (Will save against your class DC negates). |  | ☐ |  |

## ⚙️ Platinum — *Ascendant Plate* (lexicon §9)

**Essence:** Transcendence · **Prefix:** `PT-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| PT-1a | Platinum D1 | +1 circumstance bonus to saves against magic. |  | ☐ |  |
| PT-2a | Platinum D2 | **Resistance 5** to your Instinct's damage type. |  | ☐ |  |
| PT-2b | Platinum D2 | You no longer need to breathe. |  | ☐ |  |
| PT-3a | Platinum D3 | Once per day, gain a **fly Speed equal to half your land Speed** for 1 minute. |  | ☐ |  |
| PT-4a | Platinum D4 | Permanent **fly Speed equal to your land Speed**. |  | ☐ |  |
| PT-4b | Platinum D4 | You cannot be slowed by magical effects. |  | ☐ |  |

## ⚙️ Nickel — *Unstable Growth* (lexicon §9)

**Essence:** Mutation · **Prefix:** `NI-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| NI-1a | Aberrations | At daily preparations, gain one **Aberration** |  | ☐ |  |
| NI-1b | Aberrations | **(1) A limb** — an additional unarmed Strike, agile, 1d6 of a physical type. |  | ☐ |  |
| NI-1c | Aberrations | **(2) An organ** — one sense: darkvision, scent (imprecise 30 ft), or low-light plus +2 Perception. |  | ☐ |  |
| NI-1d | Aberrations | **(3) A mode** — a climb or swim Speed equal to half your land Speed. |  | ☐ |  |
| NI-1e | Aberrations | **(4) A plate** — Hardness +3 and a −5-foot Speed penalty. |  | ☐ |  |
| NI-1f | Aberrations | **(5) A gland** — once per encounter, a 15-foot cone dealing 2d6 of your Instinct's type, basic Reflex. |  | ☐ |  |
| NI-1g | Aberrations | **(6) A maw** — your jaws gain the **deadly d8** trait. |  | ☐ |  |
| NI-1h | Nickel D1 | One Aberration. |  | ☐ |  |
| NI-2a | Nickel D2 | **Two** Aberrations. |  | ☐ |  |
| NI-3a | Nickel D3 | Once per encounter, as a single action, **re-roll all your Aberrations**. |  | ☐ |  |
| NI-4a | Nickel D4 | **Three** Aberrations, and one of them may instead be the **Depth 4 rider of any other Purple Substrate**. |  | ☐ |  |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 28 |
| ✅ | 0 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **28** |

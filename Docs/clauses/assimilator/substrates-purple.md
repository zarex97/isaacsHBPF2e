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
| AT-1a | Amethyst D1 | **Telepathy 30 feet** with willing creatures with whom you share a language. | `rig` | ⚠️ | Rig: the Note *Amethyst (Depth 1)* appears on the Perception card. Text the table applies — nothing enforces it |
| AT-2a | Amethyst D2 | Your Strikes may deal **mental**; **+1d4 mental**. |  | ✅ | Live: **versatile-mental** and **`+ 1d4 mental`** |
| AT-3a | Amethyst D3 | **+1d6 mental.** | `rig` | ✅ | Rig, live: **`+ 1d6 mental`**, no d4 |
| AT-3b | Amethyst D3 | On a critical hit the target is **stupefied 1** until the end of its next turn. | `rig` | ✅ | Rig, live: a critical at Depth 3 left the target **stupefied 1** |
| AT-4a | Amethyst D4 | **+1d6 mental.** | `rig` | ✅ | Rig, live: **`+ 1d6 mental`** at Depth 4 |
| AT-4b | Amethyst D4 | Once per round, a creature you damage must succeed at a Will save against your class DC or be **confused** until the end of its next turn. | `rig` | ✅ | Rig, live: a hit at Depth 4 on Will −40 — the save failed and the target was **confused** |

## 💎 Quartz — *Prism Node* (lexicon §9)

**Essence:** Arcane Resonance · **Prefix:** `QZ-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| QZ-1a | Quartz D1 | +1 circumstance bonus to saves against magic, and you know when a spell is cast within 30 feet. |  | ⚠️ | Live: **+1 circumstance** to saves, predicated on a magical or spell source; not rolled against a spell. Knowing a spell is cast nearby is text |
| QZ-2a | Quartz D2 | Once per day, **counteract** one magical effect (counteract rank = half your level; modifier = your class DC − 10). | `rig` | ✅ | Rig, live: *Prism Counteract* granted at Depth 2, **1/day** |
| QZ-3a | Quartz D3 | When you counteract an effect, or a spell fails against you, your next Strike deals **+2d6 force**. | `rig` | ⚠️ | Rig: the Note *Quartz (Depth 3)* appears on the Perception card. Text the table applies — nothing enforces it |
| QZ-4a | Quartz D4 | Twice per day counteract. |  | ✅ | Live: *Prism Counteract* reads **max 2 per day** at Depth 4 |
| QZ-4b | Quartz D4 | Once per day, **reflect** a spell that targets only you back at its caster (Will save against your class DC negates). | `rig` | ⚠️ | Rig: the Note *Quartz (Depth 4)* appears on the Will save card. Text the table applies — nothing enforces it |

## ⚙️ Platinum — *Ascendant Plate* (lexicon §9)

**Essence:** Transcendence · **Prefix:** `PT-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| PT-1a | Platinum D1 | +1 circumstance bonus to saves against magic. | `rig` | ✅ | Rig, live: Will carries **Platinum +1 circumstance**, predicated on a magical or spell source |
| PT-2a | Platinum D2 | **Resistance 5** to your Instinct's damage type. |  | ✅ | Live: **mental 5** with a Purple Instinct — the Instinct's damage type, injected into the rule |
| PT-2b | Platinum D2 | You no longer need to breathe. |  | — | Nothing to automate: pf2e does not model breathing |
| PT-3a | Platinum D3 | Once per day, gain a **fly Speed equal to half your land Speed** for 1 minute. | `rig` | ✅ | Rig, live: *Ascendant Flight* granted at Depth 3, **1/day** |
| PT-4a | Platinum D4 | Permanent **fly Speed equal to your land Speed**. |  | ✅ | Live: fly Speed **20**, equal to the land Speed (25 less the Plate Aberration's 5) |
| PT-4b | Platinum D4 | You cannot be slowed by magical effects. | `rig` | ⚠️ | Rig: the Note *Platinum (Depth 4)* appears on the Will save card. Text the table applies — nothing enforces it |

## ⚙️ Nickel — *Unstable Growth* (lexicon §9)

**Essence:** Mutation · **Prefix:** `NI-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| NI-1a | Aberrations | At daily preparations, gain one **Aberration** |  | ✅ | Live: the chosen Aberrations became effects on the sheet — *A Limb*, *A Plate*, *A Maw* |
| NI-1b | Aberrations | **(1) A limb** — an additional unarmed Strike, agile, 1d6 of a physical type. |  | ⚠️ | Live: an **Aberrant Limb** Strike, agile, 1d6, versatile P and S. *"A physical type"* is bludgeoning with versatile P/S |
| NI-1c | Aberrations | **(2) An organ** — one sense: darkvision, scent (imprecise 30 ft), or low-light plus +2 Perception. | `rig` | ⚠️ | Rig, live: *An Organ* gives **darkvision**. Scent and low-light are not offered |
| NI-1d | Aberrations | **(3) A mode** — a climb or swim Speed equal to half your land Speed. | `rig` | ⚠️ | Rig, live: *A Mode* gives a climb Speed of **12** (half of 25). Swim is not offered |
| NI-1e | Aberrations | **(4) A plate** — Hardness +3 and a −5-foot Speed penalty. |  | ✅ | Live: Hardness **2 → 5** (the Plate's +3 as a Substrate bonus) and land Speed **25 → 20** |
| NI-1f | Aberrations | **(5) A gland** — once per encounter, a 15-foot cone dealing 2d6 of your Instinct's type, basic Reflex. | Claude-in-Chrome | ✅ | Live, aimed with the real pointer (click the apex, point, click): the 15-foot cone caught both creatures east of the Assimilator; each critically failed Reflex and took **`2d6 * 2 fire`** — fire from the Red Instinct. **Fixed while driving:** the damage also carried `multiplier: 0.5`, which the basic ladder composes with, so a critical failure dealt the dice once; the validator now refuses it. Its once-per-encounter use is gated with the Flare's |
| NI-1g | Aberrations | **(6) A maw** — your jaws gain the **deadly d8** trait. |  | ⚠️ | Live: **deadly-d8** — on every unarmed Strike, since the Carapace has no separate jaws |
| NI-1h | Nickel D1 | One Aberration. | `rig` | ✅ | Rig, live: at Depth 1, three chosen, **one** Aberration held |
| NI-2a | Nickel D2 | **Two** Aberrations. | `rig` | ✅ | Rig, live: at Depth 2, **two** held |
| NI-3a | Nickel D3 | Once per encounter, as a single action, **re-roll all your Aberrations**. | `rig` | ✅ | Rig, live: the re-roll was **refused at Depth 2** and at Depth 3 rolled **two** fresh Aberrations |
| NI-4a | Nickel D4 | **Three** Aberrations, and one of them may instead be the **Depth 4 rider of any other Purple Substrate**. |  | ⚠️ | Live: **three** Aberrations held at Depth 4. The Purple Depth 4 rider in place of one is a Note |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 17 |
| ⚠️ | 10 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 1 |
| **Total** | **28** |

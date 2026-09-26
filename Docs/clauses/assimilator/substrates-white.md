# Clauses — ⚪ White Substrates

*Substrate tracker. Every independently-failable declaration the lexicon makes about the four ⚪ White
Substrates (Preserve / Purify), one row each. Source: `Docs/homebrewing/carapace-material-lexicon-v3.md` §12 —
the guide's §6 makes the lexicon its Chapter 5 and does not reprint it.*

**Tier:** Substrates · **Colour:** ⚪ White · **Tracker issue:** #92

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

*⚪ White's own shape.* **Hardness and conditions.** Diamond is the first gem that writes to the Carapace, Pearl and Magnesium end conditions on other people, and Aluminium makes the class fly.

**IDs are `<Substrate>-<Depth><letter>`** — `DI-` Diamond, `PE-` Pearl, `AL-` Aluminium, `MG-` Magnesium. The number *is* the Depth, so `RU-3b` is the second
clause of Ruby's Depth 3. Every Depth 3 and Depth 4 row also owes the broken-Carapace check: the rider
stops while the Carapace is broken and comes back when it is repaired (class tracker, `A-34`).

---

## 💎 Diamond — *Adamant Skin* (lexicon §12)

**Essence:** Hardness · **Prefix:** `DI-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| DI-1a | Diamond D1 | Carapace **Hardness +2**. | `rig` | ✅ | Rig, live: Hardness **4** |
| DI-2a | Diamond D2 | **Hardness +5.** | `rig` | ✅ | Rig, live: Hardness **7** |
| DI-2b | Diamond D2 | Reduce persistent damage you take by 2. | `rig` | ✅ | Rig, live: a persistent tick of 10 took **8**; 10 plain fire took **10**. **Fixed while driving:** the check read the roll's instances, but a persistent tick arrives with the condition as its item |
| DI-3a | Diamond D3 | **Hardness +8.** |  | ✅ | Live: Diamond 3 (+8) with Steel 1 (+2) — Hardness **10**, the highest bonus and not the sum |
| DI-3b | Diamond D3 | Once per encounter, a critical hit against you deals **normal damage** instead. | `rig` | ✅ | Rig, live: the first critical of 40 took **20**; the second, in the same encounter, **40** |
| DI-4a | Diamond D4 | **Hardness +12.** |  | ✅ | Live: Hardness **14** at Depth 4 |
| DI-4b | Diamond D4 | Once per **round** instead of once per encounter. | `rig` | ✅ | Rig, live, in an encounter: two criticals of 40 in one round took **20** then **40**; the next round's took **20** again |

## 💎 Pearl — *Clear Tide* (lexicon §12)

**Essence:** Purification · **Prefix:** `PE-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| PE-1a | Pearl D1 | +1 item bonus to saves against poison and disease. | `rig` | ✅ | Rig, live: Fortitude carries **Pearl +1 item**, predicated on poison or disease |
| PE-1b | Pearl D1 | Once per day, reduce one condition's value by 1. |  | ✅ | Live: *Clear Tide* granted, free, 1/day |
| PE-2a | Pearl D2 | Once per encounter, as a single action, **end one condition of value 1** on yourself or an adjacent ally. | `rig` | ✅ | Rig, live: *Cleansing Tide* opened the condition picker offering **only value-1 conditions** (frightened 1, not clumsy 2); picking it ended frightened. In an encounter a second use was refused. **Fixed while driving:** "once per encounter" was printed and not enforced |
| PE-3a | Pearl D3 | Range **30 feet**, and it may instead reduce one **affliction's stage** by 1. | `rig` | ⚠️ | Rig: the Note *Pearl (Depth 3)* appears on the Perception card. Text the table applies — nothing enforces it |
| PE-4a | Pearl D4 | **Twice** per encounter, and it may instead **counteract** one spell effect of 4th rank or lower. | `rig` | ⚠️ | Rig: the Note *Pearl (Depth 4)* appears on the Perception card. Text the table applies — nothing enforces it |

## ⚙️ Aluminium — *Hollow Frame* (lexicon §12)

**Essence:** Lightness · **Prefix:** `AL-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| AL-1a | Aluminium D1 | Your Carapace has **no Bulk** and imposes no penalties. | `rig` | ✅ | Rig, live: the plate's Bulk reads **0** |
| AL-1b | Aluminium D1 | **+5 feet Speed**. |  | ✅ | Live: land Speed **30** |
| AL-2a | Aluminium D2 | **+10 feet Speed.** |  | ✅ | Live: land Speed **35** at Depth 2+ |
| AL-2b | Aluminium D2 | You take no damage from falls of less than 30 feet. | `rig` | ⚠️ | Rig: the Note *Aluminium (Depth 2)* appears on the Perception card. Text the table applies — nothing enforces it |
| AL-3a | Aluminium D3 | You Leap twice as far. | `rig` | ⚠️ | Rig: the Note *Aluminium (Depth 3)* appears on the Athletics card. Text the table applies — nothing enforces it |
| AL-3b | Aluminium D3 | Once per day, **Fly 30 feet** as a single action. | `rig` | ✅ | Rig, live: *Hollow Flight* granted, **1/day** |
| AL-4a | Aluminium D4 | Permanent **fly Speed 20 feet**. |  | ✅ | Live: **fly 20** at Depth 4 |
| AL-4b | Aluminium D4 | You may end your turn in midair without falling. |  | — | Nothing to automate: hovering is the table's |

## ⚙️ Magnesium — *Flare Core* (lexicon §12)

**Essence:** Radiance · **Prefix:** `MG-`, numbered by Depth

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| MG-1a | Magnesium D1 | You shed **bright light in a 20-foot radius** at will. | `rig` | ✅ | Rig, live: the token's light reads **bright 20** |
| MG-1b | Magnesium D1 | +1 item bonus to saves against blindness and dazzle. | `rig` | ✅ | Rig, live: Fortitude carries **Magnesium +1 item**, predicated on a visual effect |
| MG-2a | Magnesium D2 | Once per encounter, as a single action: creatures in a **15-foot emanation** must succeed at a Fortitude save against your class DC or be **dazzled** for 1 round. | `rig` | ✅ | Rig, live: *Flare*'s emanation — the failed save left the target **dazzled**, not blinded. In an encounter a second Flare was **refused**. **Fixed while driving:** its riders were marked `self`, so the first Flare dazzled the Assimilator. **Fixed while driving:** "once per encounter" was printed and nothing enforced it — pf2e's Frequency has no encounter interval. The use card is now refused once the encounter's uses are spent |
| MG-3a | Magnesium D3 | On a failed save they are **blinded** for 1 round instead. | `rig` | ✅ | Rig, live: at Depth 3 the failed save left the target **blinded**, not dazzled |
| MG-3b | Magnesium D3 | The flare deals **fire damage equal to your level** to creatures with light sensitivity or light blindness. | `rig` | ✅ | Rig, live: a target with a *Light Blindness* ability took **17** fire (level 17). **Fixed while driving:** light sensitivity is an ability, not a trait, so pf2e emits nothing for it; the riders now read `rider:target:light-sensitive` off the stat block |
| MG-4a | Magnesium D4 | The emanation becomes **30 feet** and **counteracts magical darkness**. | `rig` | ✅ | Rig, live: at Depth 4 a creature **25 feet** away was blinded, and the darkness counteract card was posted. **Fixed while driving:** the area stayed 15 feet (a Note said 30); it is an `alternateArea` on Depth 4 now. And the Flare's second blinding of a creature did nothing — a condition taken off by hand left its timer behind, and the rider only refreshed the hollow timer |
| MG-4b | Magnesium D4 | Once per day, it instead heals each ally within it for your level. | `rig` | ✅ | Rig, live: *Healing Flare* (granted at Depth 4) healed an ally 25 feet away **17** and spent its **1/day**. It shares the Flare's encounter use — it is that Flare, "instead" |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 22 |
| ⚠️ | 4 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 1 |
| **Total** | **27** |

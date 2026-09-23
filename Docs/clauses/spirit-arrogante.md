# Clauses — 👑 Arrogante

*Spirit tracker. Every independently-failable declaration the guide makes about Arrogante, one row
each. Source: `Docs/soulbound-guide-v1.md` v1.4 §7B (Arrogante) and §9.2 (La Hora Final).*

**Lineage:** Hollow · **Ladder:** Resurrección → Segunda Etapa · **Tracker issue:** #66

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

*Arrogante's own shape.* The Spirit that does the most of its work **while nobody is acting**. Respira is
an emanation that lingers after the cast, its Segunda Etapa is a permanent aura rather than a Technique,
and its signature defence is a flat check somebody else rolls on their own turn — three different pieces
of machinery that all fire outside the caster's own actions. It is also the only Spirit that reaches for
**objects** (Refined breaks them) and the only one that caps a condition rather than granting or removing
it: *doomed* may arrive but may never grow.

---

## Resurrección (1st) — guide §7B Arrogante

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-48a | Resurrección Form | Your spirit weapon becomes **Gran Caída** *(Great Fall)*, a vast double axe: **1d12 slashing**, two-handed, **sweep**, **forceful** |  | ✅ | Live, both ways: Releasing stows the Blade and puts **Gran Caída** in hand — **1d12 slashing**, **sweep**, **forceful**, `held-in-two-hands` — and sealing takes it away again and returns the Blade to the hand. **Fixed:** the axe was held in **one** hand, because `SpiritWeapon.reconcile` wrote `handsHeld: 1` for every spirit weapon in play. It reads the weapon's own usage now: the axe is held in **two** and `handsFree` reads **0** where it read 1 |
| S-48b | Resurrección Form | You become immune to disease, poison, and the **doomed** condition's worsening |  | ✅ | Live: **poison** immunity arrives with the form and goes with it. **Disease** does not move — the Hollow lineage's *Departed Flesh* already grants it, so the Resurrección's `Immunity disease` rule is satisfied by something else and its control cannot fail. The clause holds at the table; half of it is not this feature's doing |
| S-48c | Resurrección Form | you can still gain doomed, but it never increases past 1 |  | ✅ | Live, both ways: `doomed.max` is **1** in the form and **4** with it stripped, against a `dying.max` of 4 throughout. pf2e assigns `doomed.max = dying.max` *after* every rule element runs, so this is the module's `attributeCaps` flag rather than an `ActiveEffectLike`, and the control is what proves the cap is doing it |

## Release Technique — Respira (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-49a | Respira | **Release Technique — Respira** [two-actions] |  | ✅ | Live: the card reads **2** actions |
| S-49b | Respira | a **15-foot emanation**, basic Fortitude, **2d6** void damage |  | ✅ | Same card: **Area 15-foot emanation**, **Defense basic Fortitude**, and the text **2d6 void**. Driven with Refined Release stripped, because Refined is what moves the area to 20 feet |
| S-49c | Respira | Creatures that fail are **enfeebled 1** for 1 minute as they age |  | ✅ | Live: three of the four caught dummies failed the DC 24 basic Fortitude save and each came away with **Enfeebled 1**, 1 minute; the fourth succeeded and got nothing |
| S-49d | Respira | on a critical failure, **enfeebled 2** and **clumsy 1** instead |  | ✅ | Live on a forced critical failure: **Enfeebled 2** and **Clumsy 1**, and *not* enfeebled 1 — the plain-failure rider stayed out of it |
| S-49e | Respira | until the start of your next turn, an enemy that enters or ends its turn in the area takes **1d6** void damage (no save) | `test-riders` pins which lingering areas are enemies-only and which tick flat | ✅ | **Fixed three times over.** `affects` was read for difficult terrain and nowhere else, so a patch of ground that dealt damage dealt it to everybody: the caster, at the centre of their own emanation, ended their turn in their own miasma. It applied **persistent** damage — the default for a lingering tick — where the guide says a one-off *"(no save)"*. And it grew every heightening step. Live after the fix, one round of turns: the **caster** takes nothing, the **party ally** standing in it takes nothing, **D1** takes a flat **`3d6 void`** at its own turn end (120 → 110) and carries no persistent-damage condition |
| S-49f | Respira | **Heightened (+1)** +1d6 and +1d6 to the lingering damage at every other increment | `test-riders` asserts the interval | ✅ | Live at rank 5 — four increments — the Technique rolled **`6d6 void`** and the miasma was stamped **`3d6`**: 2d6 + 4 on the cast, 1d6 + ⌊4/2⌋ on the ground. It was `5d6` before, because `scaledDamage` had no notion of an interval; `perStepInterval` is the same field the rider machinery already honoured for Ennetsu Jigoku |

## Refined (9th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-50a | Refined | Respira's emanation increases to **20 feet** |  | ✅ | Live, both ways: the card reads **Area 20-foot emanation** with Refined Release held and **15-foot** with the feat stripped, and the Region laid down measures 400px — 20 feet — against 300px without |
| S-50b | Refined | objects and unattended structures in the area are **broken** (already-broken objects are destroyed) |  | — | pf2e has no unattended object an area can reach: an object is a `loot` actor or scenery, neither of which is caught by area targeting or takes damage from it, and Hardness is applied by hand when the table decides to attack a thing. The clause is printed on the card, where it was read live: *"objects and unattended structures in the area are broken (already-broken objects are destroyed)"* |
| S-50c | Refined | A creature that critically fails also can't regain Hit Points until the end of its next turn |  | ✅ | Live, both ways: the same forced critical failure that gave enfeebled 2 and clumsy 1 also applied **`Effect: Respira — Cannot Heal`**, 1 round / turn-end — *"until the end of its next turn"* — with Refined Release held, and **nothing** with it stripped |

## Segunda Etapa — Respira Absoluta (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-51a | Respira Absoluta | Respira becomes permanent and free |  | ✅ | Live: entering the Segunda Etapa puts a permanent 20-foot aura on the board that costs nothing per tick, against the 9th-level control where Respira has to be cast, costs a Reiatsu Point and leaves ground that expires after one round |
| S-51b | Respira Absoluta | You emit a **20-foot emanation** of aging miasma for as long as the Segunda Etapa lasts |  | ✅ | Live: the `Aura` rule is **radius 20** and its markers arrive on every enemy inside; when `Effect: Full Release` lapsed the aura went with it and the markers came off the same instant. It lasts exactly as long as the form does |
| S-51c | Respira Absoluta | Enemies that end their turn in it take **3d6** void damage (basic Fortitude) | `test-riders` pins the tick to `aura-tick`, and the basic ladder on it | ✅ | **Fixed.** It was a `turn-end` **self** rider with an area, so it swept everyone standing there at the **caster's** turn end — the right creatures at the wrong moment — and its nested damage carried no `basic`, so a save changed nothing. It is an `Aura` granting pf2e's own tick now, and the save is basic. Live, one full round: the **caster's** turn end does nothing, **D1** at *its own* turn end rolls Fortitude DC 37, critically fails and takes **`3d6 * 2 void`**, the **party ally** inside is not asked, and **D5** outside the 20 feet is not asked |
| S-51d | Respira Absoluta | are **enfeebled 1** for 1 round on a failure |  | ✅ | Live on that same failure: **Enfeebled 1**, 1 round. The dummy outside the aura came away with nothing |
| S-51e | Respira Absoluta | when a creature within the emanation targets you with an attack or a spell, it must succeed at a **DC 5 flat check** or the attack or spell ages to nothing before it lands and has no effect | `test-riders` asserts the rider is gated on standing in the miasma | ⚠️ | **Fixed, with one residue.** The flat check fired for **any** attacker anywhere — a dummy 70 feet away rolled it — because nothing tested *"within the emanation"*. The aura now grants `Effect: Respira — In the Miasma` on entering and takes it back on leaving, and the rider is predicated on it. Live, all three cells: **D1 adjacent** rolls the DC 5 check, **D5 at 70 feet** does not, and a **spell attack** from inside rolls it too — `strike-received` sees any attack roll, spell or weapon. **The residue:** a spell that calls for a *save* and never rolls an attack is not an attack roll and cannot reach this, and *"ages to nothing before it lands"* is the table applying the roll — pf2e has no rule element that negates an attack, and its own concealment flat check lives inside the check pipeline where a module cannot put one. Same answer as Kyōka Suigetsu's S-33b |
| S-51f | Respira Absoluta | A creature that succeeds is temporarily immune to this flat check for 1 minute | `test-riders` asserts the marker is applied on a success | ✅ | **Coded.** There was no immunity at all, and the rider was written `self: true`, which lands it on the Arrogante — so the predicate described the Arrogante rather than their attacker, and the marker would have gone on the wrong sheet. Live: the first attack from inside rolls the check, succeeds and leaves **`Effect: Steeled Against Respira`**, 1 minute, **on the attacker**; that creature's next attack draws no check at all |

## Severing Art — La Hora Final (guide §9.2)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-19a | La Hora Final | **30-foot emanation**, basic Fortitude, **void** |  | ✅ | Cast live in Severance round 1 at 20th: the card reads **Area 30-foot emanation**, **Defense basic Fortitude**, 2 actions, the damage rolled **`20d6 void`**, and *"La Hora Final ends Severance"* followed it |
| R-19b | La Hora Final | Creatures that fail are **enfeebled 3** for 1 minute and **drained 1** for 24 hours |  | ✅ | Live: three dummies failed and each came away with **Enfeebled 3**, 1 minute, and **Drained 1**, 24 hours; the one that succeeded came away with neither |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 18 |
| ⚠️ | 1 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 1 |
| **Total** | **20** |

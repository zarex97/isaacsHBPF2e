# Clauses — 🔥 The Heat

*Spirit tracker. Every independently-failable declaration the guide makes about The Heat, one row each.
Source: `Docs/soulbound-guide-v1.md` v1.4 §7C (The Heat) and §9.3 (Burning Full Fingers).*

**Lineage:** Quincy · **Ladder:** Schrift → Vollständig · **Tracker issue:** #70

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

*The Heat's own shape.* **One Technique with five shapes**, which nothing else in the class attempts: a
single Release Technique whose cost never changes and whose effect is chosen at cast time from a table of
five, running from a ranged spell attack to a cone that sets the ground alight. Its Refined rung does not
add an option but **buys every one of them an increment early**, which is a discount on a ladder rather
than a new sentence — the hardest kind of clause to see working. And it is the only Spirit whose
Vollständig changes one row of that table and leaves the other four alone.

---

## Schrift Form (1st) — guide §7C The Heat

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-67a | Schrift Form | Your spirit weapon's damage type becomes **fire** (you may still choose spirit) |  | ✅ | Live, both ways: the spirit weapon's damage type is **slashing** sealed and **fire** in the Schrift. *"(you may still choose spirit)"* is the `versatile-spirit` trait the sealed Blade ships with — the Strike offers **fire / piercing / spirit**, with fire selected. This fixture's Blade was a legacy copy missing that trait; the pack's has it |
| S-67b | Schrift Form | it gains **deadly d8** |  | ✅ | Live: the weapon's traits gain **deadly-d8** with the form and lose it without |
| S-67c | Schrift Form | you gain **fire resistance equal to half your level** |  | ✅ | Live at 9th, both ways: **fire 4** — `max(1, floor(level/2))` — and no resistance at all when sealed |

## Release Technique — Burner Finger (1st)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-68a | Burner Finger | **Release Technique — Burner Finger** [two-actions] |  | ✅ | Live: the card reads **2** actions, Focus 5 |
| S-68b | Burner Finger | Choose a number of fingers from one to five. Each choice is a different effect, and each costs the same single Reiatsu Point |  | ✅ | Live: the base card carries four **Select Other Variant** buttons — *Burner Finger Two, Three, Four, Five* — each showing **2** actions, and each is the same one-Reiatsu-Point Technique. The five are pf2e spell overlays on a single spell, which is what *"each choice is a different effect"* needs and what nothing else in the class uses |
| S-68c | Burner Finger — One | Range 60 ft., one creature. Ranged spell attack, **3d6** fire, doubled on a crit |  | ✅ | Live: the base card reads **Range 60 feet; Targets 1 creature; Defense AC** with the **attack** trait — a ranged spell attack — and the damage is **3d6** at base. "Doubled on a crit" is pf2e's own ×2 apply button, the system-wide answer recorded under Murciélago's S-44b |
| S-68d | Burner Finger — Two | Range 60 ft., two creatures. As **One**, but **2d6** each against two targets |  | ✅ | Live: *Burner Finger Two* reads **Range 60 feet; Targets 2 creatures; Defense AC**, **2d6** at base — 9d6 at rank 7 with Deeper Burn |
| S-68e | Burner Finger — Three | **30-foot line**, basic Reflex, **2d6** fire |  | ✅ | **Fixed with S-68f, and the card was driven.** Cast by hand — area targeting off, the target picked — *Burner Finger Three* posts its own card: **Area 30-foot line**, **Defense basic Reflex**, and **12d6 fire** at rank 10 (2d6 + nine increments + Deeper Burn). Its save rolls from the card too, **critical failure** on a sunk Reflex. Nothing lands on that failure and nothing should — Three carries no riders; the 1d4 persistent fire is Four's, and S-68f is where it is proved |
| S-68f | Burner Finger — Four | **15-foot emanation**, basic Reflex, **2d6** fire; creatures that fail take 1d4 persistent fire | `test-riders` drives the second save road, origin, target and both guards | ✅ | **Fixed; saves had exactly one road and a variant is not on it.** Live before: *Burner Finger Four* read **Area 15-foot emanation**, **Defense basic Reflex**, rolled its fire — and its **1d4 persistent fire** could not be made to happen by any route. `Sources.register` heard saves only through `pf2e-toolbelt.rollSave`, and the Target Helper renders its per-target rows on a spell's own card and **not on a variant's**. pf2e's own **Save** button rolled perfectly well and told the module nothing. `Sources.onSaveMessage` is the second road: a `saving-throw` message, its origin read off the roll's own context. Live after: D3 **critically failed** Burner Finger Four's Reflex save and took **`Persistent Damage (1d4 fire)`**, with the receipt on the save message. The two roads cannot double-apply — the Target Helper rolls with `createMessage: false`, so it creates no message for the new one to see. **No `itemUuid` travels with the request:** a variant's uuid is the *base* spell's, so the GM side would have collected Burner Finger One's riders; `ChatMessagePF2e#item` rebuilds the variant from the same flags, and `resolveContext` now counts a message as the origin's when the **roll's origin** names them, not only when they spoke it |
| S-68g | Burner Finger — Five | **30-foot cone**, basic Reflex, **2d6** fire; the ground becomes difficult terrain until the start of your next turn | `test-soulbound` pins the five shapes and their defences | ✅ | Live: *Burner Finger Five* previews a cone of **600px — 30 feet**, the card reads **Area 30-foot cone**, and the cast lays down a **`Burner Finger Five — … ground`** Region carrying `modifyMovementCost`. **Fixed while driving it:** the three area options inherited the base's **attack** trait, and pf2e derives `defense.passive = AC` from that trait — so Three, Four and Five each announced *"Defense AC and basic Reflex"* and counted as attack spells. They drop the trait now; Two keeps it, because Two really is an attack |

## Refined (9th) — Deeper Burn

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-69a | Deeper Burn | All five options gain their next increment early (treat your rank as one higher for Burner Finger only) |  | ✅ | Live, both ways, on the same character in the same minute: **8d6** with Refined Release held and **7d6** with the feat stripped, at rank 5 against a 3d6 base. Every one of the five options is on a +1d6-per-rank ladder, so one flat extra die *is* "treat your rank as one higher" — the implementation reads like a shortcut and is exact |
| S-69b | Deeper Burn | **Five** additionally leaves the difficult terrain burning until the end of your next turn, dealing 2d6 fire to a creature that enters or ends its turn there |  | ✅ | Live with Refined held: the Region laid down is **`Burner Finger Five — burning ground`**, carrying both `modifyMovementCost` and the lingering behaviour with **2d6 fire**, for **2 rounds** — *"until the end of your next turn"*. Without Refined the content lays `— scorched ground` instead, terrain only; the two are predicated against each other so exactly one can appear |

## Vollständig — Deus Ex Machina (13th)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| S-70a | Deus Ex Machina | You gain a **fly Speed** equal to your Speed |  | ✅ | Live at 13th: **fly 25** against a land Speed of **25** |
| S-70b | Deus Ex Machina | **fire immunity** |  | ✅ | Live: **fire** immunity arrives with the Vollständig (the disease immunity beside it is the Quincy chassis's own) |
| S-70c | Deus Ex Machina | Burner Finger's **Five** option becomes a **60-foot cone** |  | ✅ | Live, both ways: Burner Finger Five previews a cone of **1200px — 60 feet** at the Vollständig and **600px — 30 feet** at the Schrift. The override is an `alternateArea` predicated on `self:effect:deus-ex-machina`, resolved when the area is built rather than baked into the spell |
| S-70d | Deus Ex Machina | Once per round, when you damage a creature with fire, it takes **2d6 persistent fire** damage; the flat check to end it is DC 20 rather than DC 15 | `test-riders` pins where a `"prototype"` wrap lands | ✅ | **Fixed, and the cause was not in this Spirit — it was two bugs deep, and `damage-applied` had never fired for anything.** (1) `wrap.mjs`'s `"prototype"` strategy climbed to the **first** prototype owning the method, and pf2e's `CharacterPF2e` declares its own `applyDamage` — so the patch landed on the character class alone and **NPCs were never wrapped**, the exact failure the strategy exists to prevent. It climbs to the **last** declaring prototype now. (2) `Sources.onDamage` measured what landed against the **captured** actor, and an unlinked token's synthetic actor is rebuilt on update, so `before - after` was always **0** and the attacker's half — gated on `landed > 0` — was never sent. It reads `actor.token?.actor` now. Live after: a **40-point fire hit** on a dummy, and **`Persistent Damage (2d6 DC20)`**, flat check **DC 20** — the harder check the clause names. *"Once per round"* proved beside it: a second fire hit in the same round took its 40 and **no second condition**, the ledger showing one claim for the round. **Nine riders across the Saint and the Soulbound sit on that event** — Soul Sever, Danku, The Balance's reaction, The Miracle's Growth among them — and none of them had ever fired |

## Severing Art — Burning Full Fingers (guide §9.3)

| ID | Guide | Clause | Static check | Status | Evidence |
| :-- | :-- | :-- | :-- | :-- | :-- |
| R-23a | Burning Full Fingers | **60-foot cone**, basic Reflex, **fire** |  | ✅ | Cast live in Severance round 1 at 20th: the card reads **Range 60 feet; Area 60-foot cone**, **Defense basic Reflex**, 2 actions, the damage rolled **`20d6 fire`**, and *"Burning Full Fingers ends Severance"* followed it. It is also the control for S-68f — a base spell, and its save row rendered at once |
| R-23b | Burning Full Fingers | Creatures that fail take **4d6 persistent fire** whose flat check to end is **DC 20** rather than DC 15 |  | ✅ | Live on a forced critical failure: **`4d6` persistent **fire**, flat check **DC 20**** — the harder check the clause names, read straight off the condition |

---

## Counts

| Status | Count |
| :-- | --: |
| ☐ | 0 |
| ✅ | 18 |
| ⚠️ | 0 |
| ❌ | 0 |
| 🔧 | 0 |
| — | 0 |
| **Total** | **18** |

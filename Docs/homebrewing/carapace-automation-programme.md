# The Carapace — Automation Programme

### *How the class gets built in this module, in what order, and which parts will fight back*

*A forward-looking build plan, not a bug retrospective. Its sibling
`Docs/full-automation-programme.md` is the Saint's record of what broke and why; this is the Carapace's
record of what we intend to do before we do it, so that the five genuinely hard problems are named
while they are still cheap.*

**Companion documents:** `Docs/carapace-guide-v1.md` (the class) and
`Docs/homebrewing/carapace-material-lexicon-v3.md` (the thirty-six Substrates and thirty Bonds).

---

## 1 — The shape of the problem

The Saint is a class of **fixed content**: twelve Cloths, forty-eight Techniques, and a tracker that
picks one of thirteen skies. Every Technique is a document that exists before the game starts.

The Carapace is not that. It is a class of **derived state**:

- Thirty-six Substrates × four Depths = **144 distinct rule-sets**, of which a character holds six to
  nine at a time.
- Nine **Instinct clauses**, each of which modifies **every Mutation the character has**, including
  ones from other colours.
- Thirty **Bonds**, each gated on two Substrates simultaneously being at Depth 2 or higher.
- Two **Mass** budgets, a **Depth cap**, and a **Carapace** object with Hardness, Hit Points and a
  broken state that switches off a third of the character.

Nothing about this is exotic for pf2e's rule elements individually. The difficulty is entirely in
**provenance and recalculation**: an Instinct clause has to know *which* Substrate produced a given
instance of damage and at *what* Depth, and the whole derived picture has to be rebuilt whenever
anything is fed, shed, or broken.

Get the data model right in §4 and the other 143 rule-sets are data entry. Get it wrong and every
Instinct clause is a bespoke script.

---

## 2 — What already exists, and what it gives us

This module is not a blank page. The Saint's machinery covers more of the Carapace than it looks.

| We need | Already in the repo | What it gives us |
| :-- | :-- | :-- |
| "Treat resistance as N lower" — **Ruby D3, Sapphire D3, Manganese D2–4, Blue's Instinct, Gray's Edge, Keentear, Silver, Black's Unmaking** | `scripts/riders/bypass.mjs` → `shadowTarget(actor, { reduction, hardness })` | The single biggest reuse in the programme. Its own docstring records *why* `DamageAlteration` and `roll.options.bypass` cannot do partial reduction — `applyIWR` drops an ignored resistance whole rather than reading `IgnoredResistance.max`. The Carapace needs partial reduction in **eight** places and the answer is already written and already debugged. |
| Ignoring Hardness — **Iron D4, Voidsteel, Siege Frame, Black's Unmaking** | same file, `hardness: "ignore"` | `actor.hardness` is a prototype getter, so an own property shadows it and `delete` restores it. Already proven. |
| A safe place to wrap system methods | `scripts/lib/wrap.mjs` | The registry that turns "two features wrapped the same method" into a named error instead of a dead `setup` hook. **Read §3.1 before wrapping anything.** |
| Predicate options about a target's live state | `scripts/lib/roll-options.mjs` | `targetingOptions()` and the `rider:` family. Blue's **Study** and every "against a creature that has already lost Hit Points" clause (Red, Garnet) need exactly this. |
| Emanations, lines, cones, walls, lingering areas | `scripts/targeting/` | **Magnesium's** flare, **Lead's** suppression emanation, **Amber's** 30-foot line, **Onyx's** darkness, **Wall of Me**. Scene Regions, aiming, and the "everything inside becomes your target" flow are done. |
| Applying conditions on a failed save without clicking sheets | `scripts/riders/apply.mjs` | **Sapphire's** slowed, **Amethyst's** confused, **Green's** sickened, **Topaz's** frightened, **Magnesium's** dazzled/blinded. |
| A GM window with settings, a macro fallback and an API | `scripts/sky/tracker-app.mjs`, and the `module.api` block at the end of `scripts/isaacs-hb.mjs` | The pattern for **the Gullet** (§8). Including the lesson in that file's comment — the API is registered outside the `start()` isolation so a broken window never makes the class unplayable. |
| Per-feature crash isolation | `start()` in `scripts/isaacs-hb.mjs` | Every Carapace feature registers through it. One feature failing costs one feature. |
| Content → pack build with validation | `build/build-packs.mjs`, `build/validate.mjs`, `build/lib/pack.mjs` | Add pack definitions to `module.json`, add folders under `content/`, and the pipeline already compiles, validates and stages. |

**Estimated reuse: roughly 60% of the hard engineering is already written.** What is genuinely new is
the derived-state layer in §4 and the Instinct dispatch in §5.

---

## 3 — Three architectural decisions to take before any content is written

### 3.1 `applyDamage` is already claimed — refactor it into a bus

`scripts/riders/sources.mjs:223` claims
`CONFIG.PF2E.Actor.documentClasses.character.prototype.applyDamage` in `wrap.mjs`'s registry, using the
`"prototype"` strategy deliberately — the method is declared once on the shared base and libWrapper
would only patch the one subclass it was handed, leaving NPCs unwrapped.

The Carapace needs that same wrap for **Carapace Block**, **Gray's physical resistance**, **Green's
temporary Hit Points on damage dealt**, **White's ally shield** and **Black's steal**. A second claim
on the same path is refused by design — that refusal *is* the bug `wrap.mjs` was written to prevent.

> **Decision.** Extract the wrap into **`scripts/lib/damage-bus.mjs`**, which owns the single claim and
> exposes `DamageBus.register(stage, priority, fn)`. `riders/sources.mjs` becomes its first consumer
> and keeps its current behaviour; the Carapace registers its own stages behind it. Do this **before**
> Phase 1, while `sources.mjs` is the only caller and the refactor is twenty lines.

Doing it later means doing it with two callers and a release in between.

### 3.2 The Carapace is a shield item, not a bespoke Hardness system

Living Plate needs Hardness, Hit Points, a Broken Threshold, and a damage-reduction reaction. pf2e
already has an object with exactly those four properties and a full UI for them: a **shield**.

> **Decision.** Model the Carapace as a **shield item** that is permanently equipped and cannot be
> dropped, plus an **armour item** (explorer's-clothing statistics) that carries the runes. Hardness,
> HP, BT, the broken state and the damage maths are then the system's, not ours. **Carapace Block** is
> Shield Block with the "must be Raised" requirement removed — one predicate change, applied through
> the damage bus from §3.1.

The alternative — shadowing `actor.hardness` the way `bypass.mjs` does — works for a moment's effect
but not for a persistent pool with its own Hit Points that the player must be able to see and Repair.

**Known cost:** two items appear in inventory that the player cannot remove, and the shield's "Raise a
Shield" action has to be suppressed so nobody tries. Both are cosmetic. Take them.

### 3.3 Depth is a badge, not four items

144 items — Ruby I, Ruby II, Ruby III, Ruby IV — is the obvious wrong answer. It makes Feeding a
delete-and-create, breaks any effect that referenced the old item, and turns "what does this character
have" into an archaeology problem.

> **Decision.** One item per Substrate, thirty-six in total. Depth lives in
> `system.badge.value`, and **all four Depth tiers live in that one item's `system.rules`**, each
> predicated on a roll option. Feeding is a badge increment.

---

## 4 — The data model

Everything downstream depends on this section being right.

### 4.1 Roll options are the interface

A single **`RollOption`** rule element on the **Assimilation** class feature emits the whole derived
picture, rebuilt on every change:

```
carapace:substrate:ruby            # bound at all
carapace:substrate:ruby:1          # one option per Depth step reached,
carapace:substrate:ruby:2          #   so predicates never need `gte`
carapace:substrate:ruby:3
carapace:colour:red:6              # total Mass invested in red, per step
carapace:instinct:red              # the derived Instinct
carapace:depth-cap:3
carapace:mass:gem:7
carapace:mass:metal:5
carapace:bond:molten-carapace
carapace:intact                    # absent while the Carapace is broken
carapace:highest-depth:3
```

**Why one option per step rather than one option plus a `gte` predicate.** Predicates written as
`carapace:substrate:ruby:3` are readable in pf2e's own predicate editor by any GM who has ever written
one, and they survive a player poking at the sheet. `gte` against a flag works too, and is harder to
debug at two in the morning.

**`carapace:intact` is deliberately a positive option that disappears**, not a negative one that
appears. Every Depth 3 and Depth 4 rule predicates on it, so the broken state is expressed as *"these
rules require the plate to be whole"* rather than as a scattering of `not` clauses that a later edit
can forget.

### 4.2 Actor flags are the source of truth

```js
flags["isaacs-hb-pf2e"].carapace = {
    gems:    { ruby: 3, garnet: 3, carnelian: 1 },
    metals:  { iron: 3, copper: 2 },
    bonds:   ["molten-carapace", "conduction"],
    instinct: "red",              // derived, cached, recomputed at daily preparations
    choices: {                     // per-Instinct daily decisions
        gold: "ruby",              // Gold's chosen Substrate
        purple: { up: "amethyst", down: "nickel" },
        zinc: "fire",              // Shifting Tissue's chosen type
        nickel: ["limb", "mode"],  // the Aberrations rolled this morning
    },
}
```

The Effect items on the actor are a **projection** of this, not the record. One function,
`rebuild(actor)`, reads the flag and reconciles items, badges and roll options. Every other piece of
the Carapace calls it and nothing else writes derived state. This is the single most important rule in
the programme: the Saint's worst bugs — *Two Cosmo entries on every Saint*, in
`full-automation-programme.md` §4.5 — were all two writers disagreeing about derived state.

### 4.3 Every Mutation's damage is tagged with its provenance

Red's clause is *"+1 damage per Depth **of its Substrate**"*. That is a provenance question, and
untagged modifiers cannot answer it.

> **Rule, enforced by `build/validate.mjs`:** every `DamageDice` and `FlatModifier` rule element in a
> Substrate item **must** carry `slug: "carapace-<substrate>"` and
> `flags["isaacs-hb-pf2e"].carapace = { substrate, depth }`.

The Instinct dispatch in §5 then reads the modifier list rather than guessing. A validator check is
cheap now and saves a class of silent no-op that, per the Saint's §4, is the kind this module keeps
finding late.

---

## 5 — The nine Instinct clauses

These are the only genuinely bespoke scripting in the class. Eight of the nine reduce to one of four
shapes.

| Shape | Instincts | Implementation |
| :-- | :-- | :-- |
| **Damage-roll addition, provenance-aware** | Red, Orange | Hook the damage roll; read tagged modifiers from §4.3; add per-Depth. Red's doubling reads `target:damaged-this-encounter` from `roll-options.mjs`. |
| **On-damage side effect** | Green (temp HP), White (ally temp HP), Black (status ±) | A damage-bus stage (§3.1) that fires after application. |
| **Rule-element only, no script** | Gray (Hardness from metal Depth), Purple (magical trait + the daily ±1 Depth) | Pure `FlatModifier` / `ItemAlteration`, recomputed by `rebuild()`. |
| **A granted action** | Blue (Study), Gold (daily choice) | An action item plus an Effect; Blue's uses `shadowTarget()` from §2. |

**Gold's clause is the awkward one.** *"It counts as one Depth higher"* means re-running the badge
projection for one Substrate with a `+1`, which `rebuild()` already does if the daily choice lives in
the flag (§4.2) — so Gold is data, not code. *"Apply that Substrate's Depth 4 rider on a critical
hit"* is the harder half: it requires the Depth 4 rules to be evaluable out of order. Implement it by
giving every Depth 4 rider a **second copy** predicated on
`carapace:gold-crit` — a roll option set for the duration of one damage roll. Ugly, explicit, and it
works without a rules engine of our own.

---

## 6 — Content layout

Mirroring the Saint's existing `content/` convention exactly.

```
content/
  carapace-class/                     carapace.json                       1 document
  carapace-class-features/
    core/                             the-carapace, living-plate, assimilation,
                                      carapace-block, symbiotic-reflex,
                                      alien-physiology, apotheosis, the four Skins,
                                      the proficiency bumps                ~18
    instincts/                        red, gold, orange, blue, purple,
                                      green, black, white, gray             9
    actions/                          feed, shed, study, carapace-block      4
  carapace-substrates/
    gems/                             ruby … moonstone                     18
    metals/                           iron … silver                        18
  carapace-bonds/                     molten-carapace … impossible-body     30
  carapace-feats/
    level-1/ … level-20/                                                   45
  carapace-effects/
    mutations/                        one per Substrate, the projection     36
    riders/                           sickened, slowed, dazzled, confused…  ~12
    states/                           broken, studied, instinctive-surge…    ~8
  carapace-macros/                    open-the-gullet                        1
  carapace-journals/                  the handbook                           1
```

Total: **≈ 200 documents.** The Saint already ships **227** across seven packs, so this is a known
quantity for the existing build pipeline rather than a new order of magnitude.

**`module.json`** gains **eight** pack definitions — the Saint's seven with `techniques` replaced by
`substrates` and `bonds`: `carapace-class`, `carapace-class-features`, `carapace-substrates`,
`carapace-bonds`, `carapace-feats`, `carapace-effects`, `carapace-macros`, `carapace-journals`. Follow
the existing block exactly, including `ownership: { PLAYER: "OBSERVER", ASSISTANT: "OWNER" }`.

**The module's `id`, `title` and `description` all say "The Saint" today.** Adding a second class means
retitling to something like *"Isaac's Homebrew (PF2e)"* with both classes in the description. The `id`
must **not** change — that breaks every existing world's module reference.

---

## 7 — Rule-element patterns

Three patterns cover most of the 144 rule-sets. All follow the style already in
`content/saint-class-features/core/cosmo-strike.json`.

### 7.1 The Carapace Strike (on `the-carapace.json`)

```json
[
  { "key": "Strike", "fist": true, "label": "Carapace Strike",
    "img": "icons/creatures/claws/claw-talons-glowing-orange.webp" },
  { "key": "ItemAlteration", "mode": "override", "property": "damage-dice-faces",
    "value": 8, "itemId": "xxxxxxFISTxxxxxx" },
  { "key": "ItemAlteration", "mode": "override", "property": "damage-type",
    "value": "bludgeoning", "itemId": "xxxxxxFISTxxxxxx" }
]
```

`fist: true` and the `xxxxxxFISTxxxxxx` sentinel are the system's own convention and are what
`cosmo-strike.json` already uses. Do not invent a new one.

### 7.2 A Substrate's Depth ladder (on `ruby.json`)

One item, four predicated tiers, provenance tags per §4.3.

```json
[
  { "key": "ItemAlteration", "mode": "add", "property": "traits", "value": "fire",
    "itemType": "weapon", "predicate": ["item:category:unarmed", "carapace:substrate:ruby:1"] },

  { "key": "DamageDice", "selector": "unarmed-damage", "slug": "carapace-ruby",
    "damageType": "fire", "diceNumber": 1, "dieSize": "d4",
    "predicate": ["carapace:substrate:ruby:2", { "not": "carapace:substrate:ruby:3" }],
    "flags": { "isaacs-hb-pf2e": { "carapace": { "substrate": "ruby", "depth": 2 } } } },

  { "key": "DamageDice", "selector": "unarmed-damage", "slug": "carapace-ruby",
    "damageType": "fire", "diceNumber": 1, "dieSize": "d6",
    "predicate": ["carapace:substrate:ruby:3", "carapace:intact"],
    "flags": { "isaacs-hb-pf2e": { "carapace": { "substrate": "ruby", "depth": 3 } } } }
]
```

Note `carapace:intact` appearing from Depth 3 (§4.1) and the `not` clause that stops Depth 2 and Depth
3 stacking.

**Depth 3's resistance reduction is not a rule element.** It routes through `shadowTarget()` and is
declared as a module flag on the item, in the shape
`content/saint-feats/level-16/atomic-dissolution.json` already uses:

```json
"flags": { "isaacs-hb-pf2e": { "bypass": [
  { "resistance": { "max": 5, "types": ["fire"] } }
] } }
```

`types: "all"` and `hardness: "ignore"` are the other two settings that file exercises — between them
they cover Ruby, Sapphire, Manganese, Gray's Edge and Black's Unmaking without one new line of engine
code.

### 7.3 A Bond

```json
{ "key": "RollOption", "domain": "all", "option": "carapace:bond:molten-carapace",
  "predicate": ["carapace:substrate:ruby:2", "carapace:substrate:iron:2",
                "carapace:bond-slotted:molten-carapace"] }
```

Bond content then predicates on `carapace:bond:molten-carapace`, and suppression when a Substrate
drops below Depth 2 is automatic — no cleanup code, which is the failure mode
`full-automation-programme.md` §4.1 calls "the rider leak".

---

## 8 — The Gullet

A player-facing `ApplicationV2` window, built on the Sky Tracker's pattern
(`scripts/sky/tracker-app.mjs`) and registered the same way.

**It shows:** Gem Mass and Metal Mass spent/total, every bound Substrate with its Depth as a stepper,
the derived Instinct with the colour totals that produced it, Bond slots with their met/unmet
requirements, the Carapace's Hardness / HP / BT with a broken indicator, and the daily choices from
§4.2 (Gold's Substrate, Purple's up-and-down, Zinc's type, Nickel's Aberrations).

**It does:** Feed, Shed, roll Nickel's Aberrations, set the daily choices, and force a `rebuild()`.

**Non-negotiables, both learned from the Sky Tracker:**

1. **Everything the window can do must also be on `module.api`**, registered *outside* the `start()`
   isolation, so a Foundry update that breaks the window leaves the class playable from a macro. The
   comment at the end of `scripts/isaacs-hb.mjs` says exactly this and it was written after it
   mattered.
2. **It only ever touches items it created itself**, keyed by a module flag. Anything a GM dragged
   onto the sheet by hand is untouched. The Sky Tracker's guarantee, and it is why people trust it.

A **macro** in `content/carapace-macros/` opens it, mirroring `set-todays-sky.json`.

---

## 9 — Build, validation and CI

The pipeline needs no structural change — `build/build-packs.mjs` walks whatever is in `module.json`.
What it needs is **new checks in `build/validate.mjs`**, because the Carapace's failure modes are
silent ones:

1. **Provenance tags** — every `DamageDice`/`FlatModifier` in `carapace-substrates/` carries the
   `slug` and `flags` from §4.3. Without this, Red and Orange silently under-count.
2. **Depth coverage** — every Substrate item declares rules for all four Depths, and every predicate
   references a Depth that exists.
3. **`carapace:intact`** — every Depth 3 and Depth 4 rule carries it. A missing one means a broken
   Carapace keeps a rider it shouldn't.
4. **Bond closure** — every Bond names two Substrates that exist, and every Substrate appears in at
   least one Bond. *(Both already hold for the lexicon as written; the check keeps them holding.)*
5. **Non-stacking pairs** — the guide declares four: *Two Instincts* vs Electrum, *Apex Predator* vs
   Gold, Symbiotic Reflex vs Carapace Block, Perfect Adaptation vs Moonstone. Each needs a predicate
   that enforces it, and the validator should assert the predicate exists.

`.github/workflows/release.yml` needs no change beyond the packs being listed.

---

## 10 — Phases

Each phase ends in something playable. Nothing is merged on the promise of a later phase.

### Phase 0 — Foundations *(no content)*
Refactor `applyDamage` into `scripts/lib/damage-bus.mjs` (§3.1). Add the pack definitions and content
folders. Retitle the module, keeping the `id`. Add the five validator checks from §9 as failing stubs.
**Done when:** the existing Saint test suite still passes and the empty Carapace packs build.

### Phase 1 — The chassis
The class item, the Carapace Strike, Living Plate, the shield-item modelling and Carapace Block, the
proficiency bumps, and the advancement table's non-Substrate entries.
**Done when:** a 1st-level Carapace can be created from the compendium, Strikes for 1d8 with correct
attack and damage modifiers, has the right AC and saves, and can Block.

### Phase 2 — One colour, end to end
`rebuild()`, the flag model (§4.2), the roll-option emitter (§4.1), the Gullet, and **Red only** — four
Substrates, the Red Instinct clause, two Bonds.
**Done when:** a Carapace can Feed a ruby, see Furnace Veins on the sheet, deal fire, hit Depth 2, gain
Red's bonus damage with the correct provenance, form *Molten Carapace*, and lose the Depth 3 rider when
the plate breaks. **This is the phase that proves the architecture.** If §4 is wrong, it is wrong here,
with four Substrates written instead of thirty-six.

### Phase 3 — The remaining thirty-two Substrates
Data entry against the Phase 2 patterns, one colour per pass, each walked end to end the way
`full-automation-programme.md` §6 walks each Cloth.
**Done when:** every Substrate has been seen to fire at all four Depths in a live world.

### Phase 4 — The eight remaining Instinct clauses
Per §5. Blue and Gold last, being the two with real code.
**Done when:** the same Substrate visibly behaves differently under three Instincts — the §5.3 test in
the class guide, run as an actual table test.

### Phase 5 — The thirty Bonds
Mostly predicates (§7.3). Expect four or five to need script; *Impossible Body*, *Null Shroud*,
*Chimera* and *Transmutation* are the likely ones.

### Phase 6 — The forty-five feats
Ordinary pf2e feat content. The Mass-granting feats are one-line `RollOption` changes; *The Thing That
Wears You* is a summon and should be scheduled as though it were three feats.

### Phase 7 — The handbook and polish
The journal, the icons, and the pass over the forty-one-broken-image-paths class of problem that
`full-automation-programme.md` §7.6 records for the Saint. Budget for it; that pass always costs more
than it looks.

---

## 11 — How we verify

The house standard, unchanged: **a feature is not done until it has been seen to work in a live
world.** Rule elements that parse are not rule elements that fire — §4.8 of the Saint's programme found
*four abilities that could not be cast at all*, every one of which validated cleanly.

For each Substrate, the walk is:

1. Feed it at Depth 1. The Mutation appears; the roll option is present; the Gullet's Mass agrees with
   the flag.
2. Take it to Depth 2, 3, 4. Each tier fires and the previous one stops.
3. Make a Strike. The damage breakdown in chat **names the Substrate** — that is what the provenance
   tag in §4.3 buys, and it is also how we check it.
4. Break the Carapace. Depth 3 and 4 stop. Repair it. They come back.
5. Change Instinct. The same Substrate produces different numbers, and the chat breakdown says why.

Steps 3 and 5 are the ones worth insisting on. They are the class's whole premise, and they are the two
that a validator cannot check.

---

## 12 — What will go wrong

Five predictions, so they are on the record before they cost a release.

1. **Two writers for derived state.** The Gullet writes, a rule element writes, and they disagree. This
   is the Saint's *Two Cosmo entries* bug with a new name. §4.2's "`rebuild()` and nothing else" is the
   whole defence, and it will be violated the first time somebody adds a feature in a hurry.
2. **Provenance lost in a damage roll.** Red's clause silently adds nothing because a modifier lost its
   tag somewhere between the rule element and the roll. It will look like the clause is working —
   damage is still going up, from the dice — which is exactly why §9's validator check exists.
3. **Hardness stacking.** §11.4 of the class guide already flags 28 Hardness at 11th level. The
   automation will make it real and visible, and the number will be wrong before the rules are.
4. **Gold's Depth 4 crit rider.** §5 calls the solution ugly on purpose. It is the piece most likely to
   need rewriting once the other eight clauses exist and the shape of the dispatch is clearer.
5. **The Substrate name collision.** `carapace-substrates` will contain items called *Ruby*, *Emerald*
   and *Diamond*, and `packs/pf2e/equipment` already contains treasure by those names. Compendium
   search will return both. Prefix every Substrate's item `name` — *"Substrate: Ruby"* — or accept that
   every GM will drag the wrong one onto a sheet exactly once.

---

## 13 — Estimate

| Phase | Content | Engineering |
| :-- | --: | :-- |
| 0 Foundations | — | The damage bus, packs, validator stubs |
| 1 Chassis | ~20 docs | Shield modelling, Block |
| 2 Red, end to end | ~10 docs | `rebuild()`, roll options, the Gullet — **the bulk of the new code** |
| 3 Substrates × 32 | ~70 docs | Data entry, plus `shadowTarget` wiring |
| 4 Instincts × 8 | ~10 docs | Blue and Gold are real code; six are rule elements |
| 5 Bonds × 30 | ~30 docs | Four or five need script |
| 6 Feats × 45 | ~45 docs | One summon |
| 7 Handbook | ~15 docs | Icons, the image-path pass |

**Phase 2 is the whole risk.** Everything after it is repetition of a proven pattern, and everything
before it is plumbing. Build Red completely — Substrates, Instinct, Bonds, the broken state, the
Gullet — and walk it in a live world before writing a thirty-seventh line of Substrate JSON.

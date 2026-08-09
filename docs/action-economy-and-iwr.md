# Automating §2, §3, and the three parked Zeniths

*Design note. Nothing here is built yet.*

Backlog [§2 (action economy)](../README.md#2-action-economy-the-system-does-not-model) and
[§3 (IWR bypass)](../README.md#3-iwr-bypass-beyond-what-the-damage-system-exposes), plus the three Zenith
activities §1 parked as "activities you choose to use, not riders": **Virgo — Zenith**, **Cancer — Zenith**,
**Aquarius — Zenith**.

Ten rows. Eight are fully automatable, and most of them are smaller than the backlog makes them look.
Two are not, and both are argued out at the end rather than waved at.

## Three findings that shrink the work

**1. `roll.options.bypass` already exists.** The backlog says *"`DamageAlteration` has no property for
'ignore the target's resistance'"*. That is true of the rule element and false of the damage roll. pf2e's
`DamageRoll` carries a `DamageIRBypassData` (`src/module/system/damage/types.ts`), and `applyIWR` reads it
on every application (`src/module/system/damage/iwr.ts:13`):

```ts
interface DamageIRBypassData {
    immunity:   { ignore: ImmunityType[]; downgrade: DowngradedImmunity[]; redirect: ImmunityRedirect[] };
    resistance: { ignore: IgnoredResistance[]; redirect: ResistanceRedirect[] };
}
interface DowngradedImmunity { type: ImmunityType; resistence: number }  // sic
interface IgnoredResistance  { type: ResistanceType; max: number }       // max may be Infinity
```

Every row of §3 maps onto that structure exactly — including *"cold immunity counts as resistance 10"*,
which is `immunity.downgrade`, and *"treat resistance as 5 lower"*, which is `resistance.ignore` with
`max: 5`. Property runes are the only thing that populates it today (`damage/weapon.ts:212`); nothing stops
us adding to it.

**2. pf2e already tracks and resets frequencies.** `system.frequency = { max, per, value }` accepts
`turn`, `round`, `PT1M`, `day` and more, the system decrements it when an action is posted
(`chat-message/helpers.ts:26`), and `Actor#recharge` refills it on turn change, round change and rest
(`encounter/document.ts:266`, `encounter/combatant.ts:271`, `rest-for-the-night.ts:117`). A "once per
round" allowance needs no bookkeeping of ours at all.

**3. Both methods we need are already wrapped.** `SpellcastingEntryPF2e#cast` carries the focus-point
refunds; `ActorPF2e#applyDamage` carries the IWR bypass. Area targeting wraps the first, the rider sources
wrap the second. Neither row needs a new interception point.

---

# §3 — IWR bypass

All four rows. One declarative flag, read in the `applyDamage` wrapper that already exists.

## The flag

```jsonc
"flags": { "isaacs-hb-pf2e": { "bypass": [
    { "predicate": [{ "or": ["item:category:unarmed", "item:trait:unarmed"] }],
      "resistance": { "types": "all", "max": null },          // null means Infinity
      "immunity":   { "types": ["physical"], "mode": "ignore" },
      "hardness":   "ignore" },

    { "predicate": ["damage:type:cold"],
      "resistance": { "types": ["cold"], "max": null },
      "immunity":   { "types": ["cold"], "mode": "downgrade", "resistance": 10 } },

    { "resistance": { "types": "all", "max": 5 } }             // Atomic Dissolution
]}}
```

Same shape as riders and for the same reasons: authored on whatever the rule belongs to, predicate-tested,
checked by `npm run validate` against pf2e's own damage-type and immunity-type lists so a typo fails the
build rather than becoming a boon that quietly does nothing.

## How it is applied

In `scripts/riders/sources.mjs`, before calling through to the original `applyDamage`:

1. Collect `bypass` entries from the origin actor's items — the same scan `collectRiders` does.
2. Test each `predicate` against the damage roll's own options plus the `rider:*` options.
3. Deep-clone `params.damage.options.bypass`, merge the matching entries into it, and set it back.
   Cloning matters: a `DamageRoll` can be applied to several targets, and mutating the shared options would
   leak one target's bypass onto the next.
4. Call through. pf2e's own `applyIWR` does the rest, so weaknesses, redirects, immunity-to-critical-hits
   and the damage breakdown in chat all keep working — which is the whole reason to use its channel rather
   than recompute IWR ourselves.

`"types": "all"` expands to every `ResistanceType` pf2e knows, resolved at apply time from
`CONFIG.PF2E.resistanceTypes`, so a system update that adds a damage type does not silently leave a hole in
"ignore all resistances".

| Row | Expressed as |
| :-- | :-- |
| Seventh Sense, Capricorn boon | `resistance: all/∞` + `immunity: physical/ignore` + `hardness: ignore` |
| Aquarius — Ascendant | `resistance: cold/∞` + `immunity: cold → downgrade 10` |
| *Atomic Dissolution* | `resistance: all/max 5` |
| Capricorn — Techniques (Hardness) | `hardness: "ignore"` |

## Hardness

Hardness is not part of `bypass`: `applyDamage` reads `this.hardness` directly
(`actor/base.ts:1170`). Since we are already inside the wrapper, shadow it for the duration of the call
with an own property and remove it in a `finally`:

```js
Object.defineProperty(actor, "hardness", { value: 0, configurable: true });
try { return await original.call(actor, params); }
finally { delete actor.hardness; }
```

`hardness` is a prototype getter, so an own property shadows it cleanly and deleting restores the getter.
The window is one synchronous call plus its awaits, and nothing else reads hardness in that window.

## Risks worth writing down

- **`roll.options.bypass` is internal.** It is not a documented module API and could be renamed. Mitigation:
  feature-detect its presence once at `setup`, log a single clear warning and disable the feature if it has
  moved, rather than silently applying nothing. The pf2e version it was read against goes in a comment, the
  way `pf2e-traits.json` records the version its trait list came from.
- **`applyDamage` is sometimes called with a plain number** (`final: true` skips IWR entirely). There is no
  roll to attach a bypass to; skip, since IWR is not being applied anyway.

---

# §2 — Action economy

## Focus-point refunds — automatable

*Gemini's boon*, *Taurus' Zenith*, *Cloth Attunement* and *Attuned Casting* all say some version of
"cast this without spending a Focus Point, once per round / once per day".

`SpellcastingEntryPF2e#cast(spell, options)` takes `consume`, and passes it to the `consume()` that spends
the point. The wrapper that already runs there for area targeting can set it:

```jsonc
"flags": { "isaacs-hb-pf2e": { "freeCast": {
    "predicate": ["item:tag:technique-slot-1"],   // which Techniques qualify
    "label": "Galaxian Cosmo"
}}}
```

The allowance is the item's own `system.frequency`, so *Gemini — the Other Dimension* carries
`{ max: 1, per: "round" }` and pf2e refills it. On a qualifying cast with `frequency.value > 0`: force
`consume: false`, decrement the frequency, and post a line saying which boon paid for it.

One judgement call: a player may want to *save* the free cast. Default to spending it automatically and
saying so in chat — the common case is that they want it — with a client setting to ask first instead.
Automatic-and-announced beats a dialog on every cast.

## Gemini — Zenith: the duplicate — automatable

*"A duplicate of you appears in an adjacent space at the start of each of your turns. It has your
statistics, acts on your initiative with 2 actions and can only Strike and Stride, and vanishes at the start
of your next turn. One at a time."*

The rider engine already has a `turn-start` event. On the Saint's turn start:

1. Delete any duplicate this module made for that Saint — that is the "vanishes at the start of your next
   turn" and the "one at a time" clause in the same step.
2. Pick an unoccupied adjacent square. If every neighbour is occupied, whisper the GM and stop rather than
   stacking tokens.
3. `actor.getTokenDocument({ x, y, actorLink: false, name: "<name> (Duplicate)" })`, create it on the scene,
   and put an **Effect: Gemini Duplicate** on the token actor carrying the restrictions as a Note.
4. Do **not** add a combatant — the guide says it acts on the Saint's initiative, so a second turn in the
   tracker would be wrong.

Two of the restrictions can be genuinely enforced rather than noted, because we already own the choke
points: the `cast` wrapper refuses to cast for an actor carrying the duplicate flag ("no Techniques, no
Focus Points"), and the duplicate's focus pool is zeroed on creation. "Strike and Stride only" stays a Note,
because Foundry does not gate movement or skill actions.

## Libra — *The Twelve Arms* — automatable, with a content dependency

*"Each ally holding one uses your weapon proficiency with it."*

pf2e has exactly the rule element for this: `MartialProficiency`
(`src/module/rules/rule-element/martial-proficiency.ts`) takes `kind: "attack"`, a `definition` predicate
matching the weapons it governs, and a `value` of 1–4. Applied to the *ally*, it makes those weapons use
that rank.

The Saint's rank has to be baked in at hand-out time, because a `ResolvableValueField` on the ally's effect
resolves `@actor` against the ally, not against the Saint. That wants one small extension to the rider
engine — a `substitutions` map filled from the origin before the effect is created:

```jsonc
{ "apply": { "type": "effect",
             "uuid": "Compendium.…Item.Effect: The Twelve Arms",
             "substitutions": { "system.rules.0.value": "origin.statistic.saint.rank" } } }
```

Two things to know before starting:

- **The twelve Libra weapons do not exist as items.** They are prose in the Cloth. `definition` needs
  something to match, so this row starts with authoring twelve weapon items with a shared
  `otherTags: ["cloth-libra"]`. That is the bulk of the work, and it is content, not code.
- **`MartialProficiency` declares `validActorTypes = ["character"]`.** An NPC ally gets nothing. Detect it
  at apply time and whisper the GM instead of failing silently.

## Leo — Zenith: the second extra action — **stays manual**

This is the one row that cannot be automated, and the reason is worth stating precisely, because it is not
the reason the backlog gives.

**pf2e does not model action economy at all.** There is no per-turn action pool anywhere in the system.
`system.actions.value` on an ability item is the cost glyph printed on the card, not a budget; nothing
decrements anything; `quickened` is a condition with a rules note and no mechanical effect. So the gap is
not that the *second* extra action is untracked — the first one is not tracked either, and neither are the
base three.

Options considered:

- **Build an action tracker.** Count actions per turn from chat messages and show a pool. Rejected: it
  would only see actions that get posted to chat. A Stride, a reaction, an Interact, a Technique used from
  the sheet without a card — all invisible. A tracker that is wrong half the time is worse than no tracker,
  because people believe it. It is also a whole general-purpose system feature riding in a homebrew content
  module, which is where it would rot.
- **A second condition.** There is no `quickened 2`, and inventing one would collide with any module that
  reads `quickened`.
- **An `ItemAlteration` on `quickened`.** The condition has no field for how many actions it grants,
  because nothing consumes such a field.

**What ships instead:** the `quickened` condition is applied as it is today, and a `turn-start` rider
whispers the Saint *"Leo Zenith: two extra actions this turn — Strike or Stride only."* The real gap here
is remembering, not counting, and a reminder that fires reliably closes it. This is recorded as a
deliberate non-goal in §6 rather than left in §2 as an outstanding objective.

## Capricorn — "force effects as Hardness 0" — **stays manual**

The Hardness half is automated above. The force-effect half is not, because *wall of force* and *forcecage*
are not damageable entities in Foundry: walls have no hit points and no actor, and a `forcecage` is a
template or a drawing. There is nothing whose Hardness could be set to 0.

Options considered:

- **Represent force effects as hazard actors.** They would then have HP and Hardness, and the existing
  bypass would work on them unchanged. Rejected as *automation*: it requires the GM to place a hazard actor
  every time a force effect appears, which is a table convention rather than something the module does.
  Worth writing into the Cloth's text as the recommended way to run it — if the GM does place one, this
  needs no extra code, which is the best outcome available.
- **Wall manipulation.** Deleting or unblocking a wall when a Capricorn Technique crosses it is possible,
  but "which wall, and was it really a force effect" has no data behind it. A module guessing which walls
  to delete is a good way to destroy someone's map.

---

# The three parked Zeniths

§1 parked these as "activities you choose to use, not riders on something else". That was right, and it is
also why they are now easy: an activity is an **item**, and every mechanism an item needs already exists.

Each becomes a real action item in `saint-class-features`, granted by its Zenith effect with `GrantItem`,
carrying `system.frequency`, an `areaTargeting` flag, and riders. Nothing new is needed in the engine.

| | Virgo — Zenith | Cancer — Zenith | Aquarius — Zenith |
| :-- | :-- | :-- | :-- |
| Cost | 3 actions | 3 actions | 3 actions |
| Frequency | `{ max: 1, per: "PT1M" }` | `{ max: 1, per: "day" }` | `{ max: 1, per: "PT1M" }` |
| Area | 60-ft emanation | 30-ft emanation | 60-ft line |
| Targets | `affects: "all"` | `affects: "enemies"`, predicate `rider:target:hp-half-or-less` | `affects: "all"` |
| Save | Will vs Cosmo DC | Fortitude vs Cosmo DC | basic Fortitude |
| On failure | Blinded, deafened, and both Sense Lost effects — all five senses, 1 minute | Death | 16d6 cold |
| On critical failure | The same, until *restoration* | Death | Petrified, shatterable |

The `incapacitation` trait goes on all three items, and pf2e adjusts the degree of success for it by itself
once the trait is on a real item — which is a small argument for making them items beyond this plan.

Two of these need one new thing each:

- **Cancer's death effect.** Everything else in this module treats outright death as a prompt, because it
  is a campaign decision. A once-per-day Zenith capstone that says *"or die"* deserves better than a
  whisper, but automatically killing a player character is not something a module should do on its own.
  Proposal: `apply.type: "death"`, which sets the target to 0 HP — pf2e turns that into dying for a player
  character automatically — gated by a world setting **Automate death effects**, defaulting to *NPCs only*.
  Player-owned targets fall back to the existing prompt. That automates the case that is nearly always
  meant and refuses the one that would end someone's character without them being asked.
- **Aquarius' "shatterable" petrification.** `petrified` is a condition and applies cleanly; "which any
  critical hit shatters" is a `strike-resolved` rider on the same effect, predicated on
  `rider:target:condition:petrified`, that prompts the GM. Shattering destroys the creature, so it is a
  death effect and takes the same setting.

---

# Order of work

1. **§3 in full.** One flag, one merge into `bypass`, one hardness shadow, validator coverage. Self-
   contained, and the highest ratio of rows closed to code written.
2. **Focus-point refunds.** Small, and it reuses the `cast` wrapper as-is.
3. **The three Zeniths.** Content plus `apply.type: "death"` and the setting that guards it.
4. **The Gemini duplicate.** Token creation, the `cast` refusal, cleanup on the next turn.
5. **The Twelve Arms.** Twelve weapon items first, then the effect and the `substitutions` extension.
6. **The Leo reminder**, and moving both non-goals into §6 with their reasons.

Steps 1–3 close seven of the ten rows. Step 6 is the honest bookkeeping that stops the backlog claiming
work that is never going to happen.

## How to know it worked

The existing harness extends to most of this without Foundry. `npm run test:riders` already drives shipped
content through the real selection logic; the same approach covers:

- **bypass merging** — a table of `(entries, damage options) → merged bypass`, asserted against
  hand-computed expectations, including `"types": "all"` expansion and two entries merging without either
  clobbering the other.
- **freeCast** — given a frequency value and a predicate, does the wrapper spend the point or the allowance.
- **the Zenith riders** — the sense ladder already has coverage; Virgo's Zenith applies all four at once,
  which is the opposite case and worth pinning.

What still needs a running world: the `bypass` handshake with `applyIWR` (the damage breakdown in chat is
the proof), hardness shadowing, and token creation for the duplicate.

---

Every API named here was read from the pf2e 8.4 source and the Foundry v14 type definitions in the
`pf2e_fork` checkout, at the paths given. Nothing here has been built.

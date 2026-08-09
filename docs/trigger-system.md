# Triggers: closing the last three rows of §1

*Design note. **Built** — see `scripts/riders/` and README §"Riders". Two things were decided differently
once the code met the system; both are marked **[changed]** below.*

[Automation backlog §1](../README.md#1-cross-actor-effects--solved-except-where-it-should-not-be) had three
rows marked manual: **choice riders**, **strike-based riders**, and **passive and aura riders**. They did
not need three new listeners. They needed the one already there, generalised.

## The finding

The obvious move is an event bus: an effect declares an event it listens for, a condition to test, and
something to do. That is the right shape — and it is worth knowing before building it that **Foundry v14
already implemented it**, and pf2e shipped a narrow declarative version years ago.

- **Region Behaviors** (v14) are a data model plus event handlers, driven by an event vocabulary of
  `tokenEnter`, `tokenExit`, `tokenMoveIn` / `tokenMoveOut` / `tokenMoveWithin`, `tokenTurnStart` /
  `tokenTurnEnd`, `tokenRoundStart` / `tokenRoundEnd`. A module registers new behaviour types through
  `CONFIG.RegionBehavior.dataModels`, which is the same door pf2e uses for its own difficult-terrain
  behaviour (`src/scripts/hooks/load.ts`). Anything movement-triggered is already built.
- **pf2e's Aura rule element** is a condition-and-effect pair with a fixed event set. It takes
  `affects: "allies" | "enemies" | "all"`, `events: ["enter", "turn-start", "turn-end"]`, a `predicate`,
  item `alterations`, `removeOnExit`, and a `save: { type, dc }` to resist it
  (`src/module/rules/rule-element/aura.ts`).

So the conclusion is not "build an engine". It is **stop writing one bespoke listener per feature**. There
are already two — the `pf2e-toolbelt.rollSave` listener in `scripts/riders/` and the `cast` wrapper in
`scripts/targeting/`. Three more would be a tangle. One normalised event bus, sitting on the platform's own
machinery wherever that machinery already fits, is the shape to move to.

## What is actually observable

Every event this module could want is reachable today, and most cost nothing. The work is not *getting* the
events — it is normalising them into one shape a Technique can be written against.

| Event | Source | Cost |
| :-- | :-- | :-- |
| Move start / end | Region events `tokenPreMove`, `tokenMove`, `tokenMoveIn` / `Out` / `Within` | A custom behaviour type |
| Turn start / end | `pf2e.startTurn` / `pf2e.endTurn`; also `tokenTurnStart` / `tokenTurnEnd` | Free |
| Round start / end | `tokenRoundStart` / `tokenRoundEnd`; `updateCombat` | Free |
| Combat started | `combatStart` | Free |
| Successful attack | `createChatMessage` where `flags.pf2e.context.type === "attack-roll"` — carries `outcome` and `target` | Free |
| Damage received | `ActorPF2e#applyDamage({ damage, token, item, outcome, rollOptions })` | Wrap, as `cast` is wrapped |
| Reduced to 0 HP | Derived: HP crossing zero inside the same wrap | Free once wrapped |
| Action or spell used | `createChatMessage` with an item; toolbelt's *Actionable* macros | Free |
| Effect applied / expired | `createItem` / `deleteItem` on effect and condition items | Free |
| Anything bespoke | `Hooks.callAll("isaacs-hb.<event>")` from our own code | Free |

The one that matters most is `applyDamage`: it carries the originating `item`, the `outcome` and the
`rollOptions`, so damage can be attributed to the Technique that caused it. That single wrap is what makes
"cold damage from *this* Saint" and "anything *you* reduce to 0 HP" expressible at all.

## The pipeline

Four stages. The last two already exist and do not change — this widens the front door, it does not rewrite
the house.

```
sources ──▶ match ──▶ relay ──▶ apply
   │          │         │         │
   │          │         │         └─ existing condition/effect/prompt handlers, plus receipts for undo
   │          │         └─────────── existing GM relay; payload names the event, never the effect
   │          └───────────────────── triggers on the origin item whose `event` fits, filtered by `predicate`
   └──────────────────────────────── each hook normalised to { event, origin, target, outcome, item, context }
```

Riders become one event rather than a separate feature. `{ "event": "save-rolled", "outcomes": [...] }` is
what every existing rider already means, so the migration is mechanical: default a missing `event` to
`save-rolled` and none of the 26 Techniques has to be touched.

The relay keeps its current property — the payload names an event, a target and an outcome, and the GM
re-reads what to apply off the item. A client still cannot ask for an effect the Technique does not have,
and that stays true however many event sources are added.

## Choice riders

*Tenbu Hōrin* takes a sense of the Saint's choosing; *The Sharpest Sword* severs a limb, a sense, or a
natural attack. The condition is automatable — only the pick is not, and the pick belongs to the caster,
who may not be the person who rolled the save.

Add `apply.type: "choice"`, whose options each carry an ordinary rider payload:

```jsonc
{
    "outcomes": ["failure"],
    "apply": {
        "type": "choice",
        "prompt": "Which sense?",
        "options": [
            { "label": "Sight",   "apply": { "type": "condition", "slug": "blinded" } },
            { "label": "Hearing", "apply": { "type": "condition", "slug": "deafened" } },
            { "label": "Smell and taste",
              "apply": { "type": "effect", "uuid": "Compendium.isaacs-hb-pf2e.saint-effects.Item.Effect: Sense Lost" } }
        ]
    },
    "duration": { "unit": "minutes", "value": 1 }
}
```

The GM executor posts a card whispered to the caster instead of applying; clicking a button relays the
chosen index back and the GM applies that option. A chat card rather than a modal dialog on purpose: it
survives a reload, and it cannot be missed while someone is looking at their sheet. No new permissions and
no new transport — the relay already runs in both directions.

## Strike-based riders

The attack-roll chat message already carries `context.outcome` and `context.target`. That is the
`strike-resolved` event. Three shapes fall out of it, and only the first is new work:

- **Direct.** *Rozan Ryū Hi Shō* knocks prone on a critical hit. Match the outcome, apply the condition —
  identical to a save rider with a different event name.
- **Save-gated.** Virgo's Six Paths demands a Will save *per unarmed hit*. **[changed]** The plan was to
  post a check prompt and let toolbelt turn it into a target row, so the existing `save-rolled` listener
  would pick it up. What shipped instead is an `apply.type: "save"` that rolls the target's save directly
  against the Saint's Cosmo DC and carries its own nested riders. The round trip through a chat message
  turned out to need the prompt's riders to live on the prompt's item, which nothing owns; rolling in place
  is fewer moving parts, needs no second message, and does not depend on toolbelt for the strike path.
- **Counter-scaled.** Scorpio's Ascendant bleed is 1d6 *per needle*. The needle count is already on the
  target as a counter badge, put there by the rider engine. Read the badge, multiply, apply persistent
  damage.

The save-gated shape is why this row is worth doing first: the strike event never needs its own way to
resolve, adjudicate or undo anything. It emits a save and gets out of the way.

## Passive and aura riders

Split this row in two, because half of it needs no code at all.

**Use pf2e's Aura rule element for what it covers.** **[changed]** It covers less than it looked like from
the schema: an Aura rule element applies an *effect* to whoever is inside, and Pisces' garden deals 4d6
poison, which is not an effect. So the garden shipped as a `turn-end` rider with an `area`, reusing the
containment and alliance filtering already written for cast-time area targeting. The Aura rule element
remains the right tool for an aura that only grants or imposes an effect, and nothing here forecloses it.

**Use `damage-applied` for the cumulative tracks.** Aquarius' Ascendant — cold damage stacking slowed until
petrified at slowed 4 — is two declarative triggers rather than one clever one:

```jsonc
{ "event": "damage-applied",
  "predicate": ["damage:type:cold"],
  "apply": { "type": "condition", "slug": "slowed", "value": 1 } },

{ "event": "damage-applied",
  "predicate": ["damage:type:cold", "target:condition:slowed:4"],
  "apply": { "type": "condition", "slug": "petrified" } }
```

Escalation falls out of predicates for free. Cancer's "anything you reduce to 0 HP dies" is the same event
with an HP test.

**Use a Region Behavior for anything movement-triggered.** Register one type through
`CONFIG.RegionBehavior.dataModels` and Foundry does the geometry, the enter/exit bookkeeping and the turn
events itself.

## Order of work

1. **Generalise riders into triggers.** Add `event` to the rider schema, defaulting to `save-rolled`, and
   move matching into one module. No behaviour changes, no content changes, and `npm run validate` keeps
   passing — which is the point: prove the refactor is inert before anything new rides on it.
2. **`strike-resolved`, and choice riders.** One listener on attack-roll messages, one new `apply` type, one
   whispered card with buttons. *Closes two backlog rows.*
3. **`damage-applied`.** Wrap `ActorPF2e#applyDamage` the way `cast` is wrapped. Gives cumulative tracks and
   death-at-zero attribution together. *Closes Aquarius and Cancer.*
4. **Aura content pass.** Author Pisces' aura and *Freezing Shield* with the Aura rule element, and extend
   `validate-lib.mjs` to check `events` and `affects` the way it checks rider outcomes today. *Closes the
   aura half of the row.*
5. **Region behaviour, and the escape hatch.** Only if a Technique actually needs movement triggers. Add
   `apply.type: "macro"` at the same time, for the genuinely bespoke.

## Two arguments against, recorded

**Macros should be the escape hatch, not the road.** This repository's safety model is that a mistake fails
`npm run validate` rather than becoming a Technique that quietly does nothing at the table — which is why
the rider schema is checked field by field. A macro cannot be checked that way. It also needs the
`MACRO_SCRIPT` permission, which players do not have by default, and it is far harder to review in a diff
than a line of JSON. Declarative first; `type: "macro"` for the handful that genuinely need it. For macros
on spells *today*, toolbelt's *Actionable* tool already does exactly that and intercepts casting for you.

**Two things get worse with more events.** Every trigger still needs a GM online, for the same reason
riders do, so the "no GM" notice has to stay honest as the number of moments that depend on it grows. And
the receipt model that makes a rerolled save undo cleanly was written for one event — a strike that fires
twice, or a damage application re-run after an undo, needs the same treatment. That is much easier to build
in now than to retrofit across five sources.

## What shipped

Phases 1–4 are done. The `event` field defaults to `save-rolled`, so no Technique written before this
needed touching. Sources for `strike-resolved`, `strike-received`, `damage-applied`, `turn-start` and
`turn-end` are in `scripts/riders/sources.mjs`; the apply types grew `choice`, `save`, `damage` and
`persistent-damage`.

Phase 5 — a custom Region Behavior for movement triggers, and `apply.type: "macro"` — was not built.
Nothing in the Cloths needs either yet, and the argument against macros as the road rather than the escape
hatch still stands.

The escalation ladders are covered by `npm run test:riders`, which drives the shipped content through the
real selection logic with a stubbed predicate engine. That is the part most likely to be silently wrong and
the only part testable without Foundry.

---

Every API named here was read from the pf2e 8.4 source and the Foundry v14 type definitions in the
`pf2e_fork` checkout. The ladders are tested; nothing else has been exercised in a running world.

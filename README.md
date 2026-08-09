# Isaac's Homebrew (PF2e): The Saint

A Foundry VTT module for the **Pathfinder Second Edition** system that adds **The Saint** — a martial
focus-user whose power answers to the sky.

> *A Gold Saint stands in the attack, wearing gold, and punches a god.*

Eleven days out of thirteen a Saint is an excellent-but-not-dominant martial. On the thirteenth — the day
their own constellation rises — the Cloth burns. On one day in 260 the sky exalts them, and for that day they
are very nearly unstoppable.

| | |
| :-- | :-- |
| **Foundry** | v14 (14.361 – 14.364) |
| **System** | `pf2e` 8.3.0+ |
| **Install** | `https://github.com/zarex97/isaacsHBPF2e/releases/latest/download/module.json` |

## What's in it

- **The Saint class** — 10 HP, unarmed-only, Class DC ("the Cosmo DC") keyed to Strength or Dexterity, no
  spell slots.
- **Twelve Gold Cloths** as selectable subclasses, each with a Cloth Passive, its own four-Technique ladder,
  an Ascendant Boon, and a Zenith Boon.
- **48 Techniques** — four per Cloth, gained at levels 1, 6, 11, and 16. Techniques have no rank; each
  heightens once per 2 character levels above the one it was gained at, and all four converge on 20d6 / 10d8
  by 20th level, so an early Technique never becomes dead weight.
- **28 class feats** from 1st to 20th, including *Athena Exclamation* and the legacy capstone
  *Constellation of One*.
- **A sky tracker** — a GM window that holds the day's constellation and aspect, applies the right boon to
  every Saint, announces the day in chat, and lets you schedule a Zenith for the arc climax. On an Ascendant
  day Techniques heighten as though you were **+4 levels**; on a Zenith, **+8**.
- **A handbook** journal covering the tuning curve, the heightening ladder, and the GM notes that make
  the class work.
- **Area targeting** — a Technique with an area puts that area on the board as a Scene Region, you aim it,
  and everything inside it that the Technique is allowed to hit becomes your target. No more clicking eight
  tokens before a 60-foot burst.
- **Riders applied automatically** — a target that fails its save gets the slowed, stunned, blinded or
  drained the Technique says it gets, on its own sheet, without anyone clicking a condition on.
- **Boons that reach past the rules** — free casts spent from their own frequency, Gemini's duplicate token,
  and resistance, immunity and Hardness bypassed through pf2e's own damage channel.

## Using the sky tracker

Open it from the star button beside the token tools, from module settings, or from the **Set Today's Sky**
macro in the module's macro pack.

- **Set sign and aspect** — the day's sky. Twelve constellations plus *Starless*, the thirteenth sky.
- **Advance Day** — takes the next pre-rolled day. The next seven days are rolled in advance and fixed, so
  the *Read the Constellation* feat has an answer that can't be re-rolled for a better one.
- **Schedule Zenith** — pin an Exalted day. `Exalted` has a roll weight of **zero**: one day in 260 never
  happens by chance, so the only path to a Zenith is you deciding on one.
- **Re-apply** — force a refresh if you edited a Cloth or added a Saint mid-session.

The tracker only ever touches effects it applied itself, so anything you dragged onto a sheet by hand is
safe. It never applies Malefic or Retrograde riders to a Saint at all — that's *Unfailing Cosmo*, enforced
rather than remembered.

Everything the window does is also on the module API, so the class stays playable if a Foundry update ever
breaks the UI:

```js
const api = game.modules.get("isaacs-hb-pf2e").api;
await api.sky.set({ sign: "leo", aspect: "none" });
await api.sky.scheduleZenith("leo", 3);
console.log(api.sky.forecast(3));
```

## Targeting an area

Cast a Technique that has an area and the area appears on the cursor as a Foundry Region. Move it, roll the
mouse wheel to rotate a cone or a line, left-click to set it down, or press Esc to call the whole thing off
— **a cast you back out of costs no Focus Point**, because the placement happens before the point is spent.

Once it lands, the Region catches every token whose space overlaps it, applies the Technique's own targeting
rule, and shows you the result:

- *Caught in the area* — checked and about to be targeted. Uncheck anyone you did not mean.
- *Inside, but not targeted* — with the reason: `not an ally`, `no line of effect`, `already dead`,
  `over the limit of 5`. A target going missing is never a mystery.

Confirm and the Region disappears, those tokens are your targets, and the Technique casts normally.

Areas that originate from you — *Tenpōrin'in*, *Freezing Shield*, and the Techniques whose target line reads
"creatures within 30 feet" — skip the placement step entirely; there is only one place they can go.

The rule each Technique uses is authored in its own file, in the same vocabulary as pf2e's Aura rule element:

```jsonc
"flags": { "isaacs-hb-pf2e": { "areaTargeting": {
    "affects": "allies",       // "all" | "allies" | "enemies"
    "includesSelf": true,      // the caster is in their own emanation
    "maxTargets": 5,           // "up to five allies" — the extras start unchecked
    "requireLineOfEffect": false,                         // for the ones that go through walls
    "predicate": [{ "not": "target:trait:construct" }],   // any pf2e predicate
    "area": { "type": "emanation", "value": 30 }          // only when system.area is absent
} } }
```

Whether the area is aimed or centred on you is not authored — it follows from the shape, because an
emanation has only one place it can be.

`npm run validate` checks every field of it, because a typo here has no runtime symptom other than the
Technique quietly going back to manual targeting.

Two settings and one key:

- **Place areas as Regions when casting** (world) — the master switch.
- **Area targeting applies to** (world) — the Saint's Techniques only, or every spell with an area.
- **Review targets before casting** (per player) — off targets everything caught and casts immediately.
- Hold **Control** while casting to target by hand this once, the same key `pf2e-toolbelt` uses to skip its
  own template popup.

*Lightning Crown* is deliberately left out: "up to three 5-foot squares within 60 feet" is three areas, not
one, and a single Region cannot express it.

## Riders

A rider is what happens to a target *besides* damage. When a save is rolled, a Strike lands, damage is
applied, or a turn ends, the conditions the Technique or the Cloth inflicts are applied to the right
creature, on its own sheet, without anyone clicking a condition on. *Diamond Dust* slows what fails,
*Scarlet Needle* adds a needle to the counter, Virgo's Six Paths takes one sense per hit, and Pisces'
garden poisons whatever is still standing next to it at the end of the turn.

Riders are authored on whatever the rule belongs to — a Technique, a Cloth, a sky effect:

```jsonc
"riders": [
    { "event": "strike-resolved",
      "outcomes": ["success", "criticalSuccess"],
      "predicate": [{ "or": ["item:category:unarmed", "item:trait:unarmed"] }],
      "apply": { "type": "save", "statistic": "will", "dc": "cosmo", "riders": [
          { "outcomes": ["failure", "criticalFailure"],
            "predicate": [{ "not": "rider:target:condition:blinded" }],
            "apply": { "type": "condition", "slug": "blinded" } }
      ]}}
]
```

### Events

| `event` | Fires when | Whose riders are read |
| :-- | :-- | :-- |
| `save-rolled` *(default)* | A target rolls its save from a chat card | The Technique, and the caster's items |
| `strike-resolved` | This actor's Strike resolves | The attacker's items |
| `strike-received` | A Strike resolves against this actor | The defender's items |
| `action-used` | An action or spell is posted to chat | The item posted, against the targets you confirmed |
| `damage-applied` | Damage from this actor's item lands | The origin's items |
| `turn-start`, `turn-end` | This actor's turn begins or ends | This actor's items |

A rider with no `event` means `save-rolled`, so every Technique written before events existed still means
what it meant. A rider with no `outcomes` fires on any outcome — which is what "needles land on any attack
you make, hit or miss" needs.

### What a rider can do

- **condition** with a `duration` becomes a generated effect granting that condition, the way pf2e ships
  its own timed conditions — so it expires on its own instead of sitting on the sheet until someone
  notices. Without a duration it is a plain condition for the table to clear. `max` caps a cumulative one.
- **effect** applies an authored item from the packs. `stack: true` walks a counter badge up instead of
  adding a second icon, which is how Scorpio's needles are counted.
- **save** makes the target roll against the Saint's Cosmo DC and carries its own riders, chosen by the
  result. This is how "a Will save per unarmed hit" works when there is no chat card to hang buttons on.
- **choice** whispers the caster a card of buttons and applies the one they pick. Which sense *Tenbu Hōrin*
  takes and which limb *The Sharpest Sword* severs are decisions, and they belong to the caster — who is
  often not whoever rolled.
- **damage** rolls real damage, so immunities and resistances still apply, and posts it to chat.
- **persistent-damage** applies a bleed or a burn. `perCounter` scales it by a counter the target already
  carries, which is what makes Scorpio's "1d6 per needle" a single growing wound rather than fifteen.
- **prompt** whispers the GM. Forced movement and outright death live here: automating half of a rider and
  being honest about the other half beats guessing which 15 feet.

### Areas

A `turn-start` or `turn-end` rider can carry an `area`, and then it fans out from the Saint's own token
instead of landing on one creature. Pisces' rose garden is a 10-foot emanation that catches up to four
enemies; it reuses the same containment and alliance filtering as cast-time area targeting, so "enemies
within 10 feet" means the same thing in both places.

### Asking about the target

Predicates can use the system's own `target:*` options, plus a `rider:*` vocabulary generated by this
module for the questions an escalating rider needs to ask:

| Option | True when |
| :-- | :-- |
| `rider:target:condition:<slug>` | The target has that condition |
| `rider:target:condition:<slug>:<n>` / `:<n>+` | …at exactly, or at least, that value |
| `rider:target:effect:<slug>` | The target carries that effect |
| `rider:target:effect:<slug>:<n>` / `:<n>+` | …with a counter badge at exactly, or at least, that |
| `rider:target:hp-zero`, `rider:target:hp-half-or-less` | Health, after the damage landed |
| `rider:damage:type:<type>` | The damage that fired this rider included that type |

Every predicate is tested against a snapshot taken **before** anything is applied. That is what makes an
escalation ladder advance exactly one step: Virgo's four sense-loss riders each require the step before it,
and only one of them can match a given hit. `npm run test:riders` drives those ladders against the shipped
content, so an edit that breaks the ordering fails the build.

Rerolls are handled: changing the degree of success removes the riders applied for the old one and applies
the new set, and only ever removes what this module created — including winding a counter badge back down.

This needs a **GM online**, because a player cannot write to a monster's sheet. If none is, the caster is
told what would have been applied. Turn the whole thing off with **Apply Technique riders automatically**.

### With pf2e-toolbelt

Both halves pair with [`pf2e-toolbelt`](https://github.com/reonZ/pf2e-toolbelt)'s **Target Helper**, which
is listed as a recommended module. Targets selected here arrive on the chat card as its per-target rows, so
each one rolls its own save from the card — and each of those rolls is what the riders key off. The Region
is flagged `pf2e-toolbelt.targetHelper.skip` on the way past, so the toolbelt's own template popup does not
ask the same question a second time.

## Development

```bash
npm install
npm run build      # content/**.json -> LevelDB packs in packs/
npm run validate   # traits, rule-element keys, and the guide's invariants
npm test           # validate + build + round-trip check
```

`content/**.json` is the source of truth — one document per file, readable and diffable. `packs/` holds the
built LevelDB and is gitignored. Symlink the repo root into your Foundry `Data/modules/` directory and it
works as a module in place.

A few things the build does that are worth knowing about:

- **IDs are derived, not random.** Each document's ID is a hash of its pack and slug, so rebuilding unchanged
  content produces an identical pack and existing worlds keep their links.
- **UUIDs are authored by name and resolved to IDs at build time.** The pf2e system does not resolve
  `Compendium.<pack>.Item.<Name>` at runtime — its own build does the same conversion. An unresolvable
  reference fails the build rather than shipping a grant that silently does nothing.
- **`npm run validate` checks traits and rule-element keys** against a snapshot of pf2e 8.3.0
  (`build/lib/pf2e-traits.json`), which catches typos that would otherwise only show up as a rule quietly not
  firing. It also enforces the class guide's invariants: every Technique's base rank matches its slot, every
  damaging Technique carries its Ascendant and Zenith heightening dice, and the removal/death Techniques
  carry `incapacitation`.
- **`npm run check:roundtrip`** reads the built LevelDB back and compares it to the source, so a lossy write
  fails CI instead of shipping.

To author in Foundry's UI instead and pull changes back:

```bash
npm run extract -- --overwrite
```

## Automation backlog

Built from **class guide v4**. Almost everything is automated; what follows is every remaining gap, grouped
by *why* it resists automation, because the workaround for each group is likely to be the same. Treat these
as objectives.

### 1. Cross-actor effects — solved, except where it should not be

**This was the largest group, and it is now automated.** A rule element still cannot reach another actor's
sheet — that has not changed and will not. What changed is that the rider no longer comes from a rule
element: `scripts/riders/` watches saves, Strikes, damage and turn boundaries, works out what each event
earns, and has a GM apply it to the right creature.

| Where | Now |
| :-- | :-- |
| Every damaging Technique | 26 Techniques carry riders keyed to the degree of success |
| Taurus — boon and *Great Horn* | Prone is applied; the push is whispered |
| Virgo — Six Paths (Ascendant) | A Will save per unarmed hit, and one sense lost per failure, in order |
| Scorpio — needles | Needles land on any attack; enfeebled at 5, blinded at 10, stunned 2 at 14 |
| Scorpio — Ascendant | 1d6 persistent bleed per needle, capped at 10; the death save fires at 8 |
| Aquarius — Ascendant | Cold damage forces a Fortitude save, stacking slowed, petrified at slowed 4 |
| Pisces — passive and aura | The roses answer melee hits; the garden ticks at the end of your turn |
| Capricorn — *The Sharpest Sword* | A critical hit asks you which limb, sense or natural attack is severed |
| Cancer — Ascendant | Reducing a creature to 0 HP is detected and whispered |

What is still manual is manual on purpose:

| Where | Why |
| :-- | :-- |
| Forced movement — pushed, dragged, launched, teleported | *Which* 15 feet depends on walls, allies and facing. Whispered to the GM rather than guessed |
| Outright death — Antares, *Royal Funeral*, Cancer's Ascendant | A campaign decision, not a condition. The module tells you the moment has arrived and stops there |
| Virgo — Zenith, Cancer — Zenith, Aquarius — Zenith | These are activities you choose to use, not riders on something else. They belong in §2 |

The design behind it, and what it deliberately does not do, is in
[`docs/trigger-system.md`](docs/trigger-system.md).

Three caveats worth knowing before trusting it:

- **A GM must be online.** A player cannot write to a monster's sheet. With no GM, the caster is told what
  would have been applied instead of it silently not happening.
- **Area riders need the origin's scene to be the one the GM is viewing.** Pisces' garden is resolved on
  the GM's client against the canvas; if they are looking at another scene, the tick is skipped with a
  console warning rather than resolved against the wrong map.
- **Reach is invisible to the roses.** Pisces' passive says "unarmed or non-reach melee attack"; the rider
  fires on any melee hit. Reach is not in the attack message.

### 2. Action economy — solved, except the one thing pf2e does not model

| Where | Now |
| :-- | :-- |
| Gemini — boon, Taurus — Zenith | The free cast is spent from the boon's own `system.frequency`, which pf2e recharges each round |
| Cloth Attunement, *Attuned Casting* | Same mechanism, once per day |
| Gemini — Zenith | A duplicate token appears adjacent at the start of your turn and is swept at the start of the next; it has no Focus Points and cannot cast |
| Libra — *The Twelve Arms* | The six Libra weapon pairs exist as items, and an ally lent one gets pf2e's `MartialProficiency` at **your** rank |
| Virgo, Cancer, Aquarius, Libra — Zenith activities | Real activities with a frequency, an area they aim, and riders on the result |

**Leo — Zenith stays a reminder, and always will.** pf2e models no action economy at all: there is no
per-turn pool anywhere in the system, `system.actions.value` is the cost glyph rather than a budget, and
`quickened` is a condition with a note. The second extra action is not under-automated — *the first one is
not tracked either, nor the base three*. A tracker built from chat messages was considered and rejected: it
would miss every Stride, reaction and Interact, and a tracker that is wrong half the time is worse than
none, because people believe it. What ships instead is a turn-start whisper, because the real gap is
remembering rather than counting. This has moved to §6.

### 3. IWR bypass — solved

The backlog said this needed a hook that recomputes IWR. It did not: `DamageAlteration` has no property for
it, but the damage **roll** does. `roll.options.bypass` carries `resistance.ignore`, `immunity.ignore` and
`immunity.downgrade`, and `applyIWR` reads it on every application. Merging into pf2e's own channel keeps
weaknesses, redirects and the chat breakdown working.

| Where | Now |
| :-- | :-- |
| Seventh Sense | Ignores resistance and all material immunities on unarmed Strikes |
| Capricorn boon, Capricorn Techniques | Ignores resistance, physical immunity and Hardness |
| Aquarius — Ascendant | Cold ignores cold resistance; cold immunity becomes resistance 10 |
| *Atomic Dissolution* | Resistance treated as 5 lower, and an object's Hardness ignored |

Two things `bypass` cannot express, handled by shadowing the target for the length of one application:

- **Hardness**, which `applyDamage` reads straight off the actor.
- **Partial reduction.** `IgnoredResistance` has a `max` whose doc comment promises "ignore up to a
  maximum", but `applyIWR` only reads it as a display value — an ignored resistance is dropped whole. So
  *Atomic Dissolution*'s "5 lower" lowers the target's resistances instead, and `npm run test:riders`
  pins the distinction, because the two look identical in the JSON.

**Capricorn's "force effects as Hardness 0" stays manual.** *Wall of force* and *forcecage* are not
damageable entities in Foundry — walls have no hit points and no actor, so there is nothing whose Hardness
could be set. Representing a force effect as a hazard actor works and needs no code at all, since the
bypass above then applies to it unchanged; that is written into the Cloth as how to run it. This has moved
to §6.

### 4. Things that must see the die or the outcome

| Where | What is manual |
| :-- | :-- |
| Libra — The Balance | "The first natural 1 you roll each hour counts as a 10." `SubstituteRoll` resolves *before* the die is known, so it cannot be made conditional on rolling a 1 |
| Virgo — Om | Which roll consumes the empowerment. The numbers are automated; nothing enforces that it applies to only one roll |
| Everything with a per-hour or per-Zenith-day frequency | PF2e tracks per-round/turn/day cleanly; longer and bespoke periods are on the honour system |

**A plan for all three** is in [`docs/heightening-and-outcomes.md`](docs/heightening-and-outcomes.md).
*The Balance* rewrites the card after the roll, because `SubstituteRoll` picks its value before the die is
known; Om consumes its empowerment on the first roll that benefits; and per-hour frequencies recharge off
Foundry's core `updateWorldTime` hook, which needs no calendar module at all — pf2e's own World Clock
already drives it.

### 5. Non-damage heightening riders

Per-step **damage** and **area** growth are both automated (`heightening.damage`, `heightening.area`).
What is left has no field in the spell schema:

- Extra **targets** at specific levels (Gemini, Virgo, Aries)
- Longer **range** per step (Gemini, Virgo, Aries, Libra)
- Additional **Strikes** or **pillars** per step (Taurus, Leo, Scorpio, Sagittarius)
- Wall **length** (Aries' *Crystal Wall* — a wall, not an area)

**No `ItemAlteration` reaches these.** Its handlers cover `area-size` and weapon ranges but not a spell's
range or a target count, because pf2e models neither — so all four rows live in this module's own
`areaTargeting` config, which already owns `maxTargets` and the area shape and only has to become
rank-aware. See [`docs/heightening-and-outcomes.md`](docs/heightening-and-outcomes.md), which also brings
*Lightning Crown* back: `canvas.regions.placeRegions` aims several areas in sequence.

### 6. Deliberately not automated

Not gaps — these are judgement calls that should stay with the table.

- **The Gold Cloth cracking** at 0 HP and its 24-hour repair
- **Pandora Box** couriering an object across a plane
- **Gemini's two identities**, and what *true seeing* reveals
- **Cancer's** speaking with spirits; **Sagittarius'** naming a target he cannot see
- **Constellation of One**, which is a legacy feat about the campaign ending
- **Leo's extra actions.** pf2e models no action economy, so there is no pool to add to. A turn-start
  whisper says how many extra actions you have; counting them is the table's job, as it is for every other
  character in the system
- **Force effects as Hardness 0.** Foundry has no damageable force effect to apply it to. Place a hazard
  actor for the *wall of force* and Capricorn's Hardness bypass will work on it with no further help

## Compromises already made

- **Techniques have no rank in v4**, but pf2e spells must. Each is a focus spell whose base rank is half its
  gain level rounded up (1, 3, 6, 8). Exact for the 1st and 3rd slots, and all four converge correctly at
  20th; the **2nd and 4th run one heightening step ahead** between odd levels, because pf2e anchors focus
  rank to odd levels while the guide anchors to the gain level.
- **Double Excalibur** scales from a base of zero in the guide, and a pf2e spell needs a base formula to
  scale from — so its base is `1d1`, a flat 1 point, constant at every level and sky state.
- **Om's save penalty** is applied as an equal bonus to your Technique DC. Same number, and the DC is the
  side Foundry actually rolls.

## Credits

The Saint is homebrew by Isaac. Icons are existing Foundry VTT and PF2e system art. Licensed MIT.

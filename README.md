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

## Riders on a failed save

Once targets exist, the other half follows: when a target rolls its save from the chat card, the conditions
the Technique inflicts on that outcome are applied to it. *Diamond Dust* slows what fails, *Tenma Kōfuku*
stuns 1 on a failure and 3 on a critical failure, *Scarlet Needle* adds a needle to the counter on the
target's sheet.

A rider is authored on the Technique next to its targeting rule:

```jsonc
"riders": [
    { "outcomes": ["failure", "criticalFailure"],
      "apply": { "type": "condition", "slug": "slowed", "value": 1 },
      "duration": { "unit": "rounds", "value": 1 } },

    { "outcomes": ["failure"],
      "apply": { "type": "effect", "uuid": "Compendium.…Item.Effect: Scarlet Needle", "stack": true } },

    { "outcomes": ["failure"],
      "apply": { "type": "prompt", "text": "Pushed 15 feet away from the Saint." } }
]
```

- **condition** with a `duration` becomes a generated effect granting that condition, the way pf2e ships its
  own timed conditions — so it expires on its own instead of sitting on the sheet until someone notices.
  Without a duration it is applied as a plain condition for the table to clear.
- **effect** applies an authored item from the packs. `stack: true` walks a counter badge up instead of
  adding a second icon, which is how Scorpio's needles are counted.
- **prompt** whispers the GM. Forced movement, death and "choose a sense" live here: automating half of a
  rider and being honest about the other half beats guessing which 15 feet.

Rerolls are handled: changing the degree of success removes the riders applied for the old one and applies
the new set, and only ever removes what this module created.

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

### 1. Cross-actor effects — mostly solved

**This was the largest group, and the save-driven half of it is now automated.** A rule element still
cannot reach another actor's sheet — that has not changed and will not. What changed is that the rider no
longer has to come from a rule element: `scripts/riders/` listens for `pf2e-toolbelt.rollSave`, works out
which riders that degree of success earns, and has a GM apply them to the target.

Twenty-six Techniques now carry riders. A condition with a duration is wrapped in a generated effect the way
pf2e wraps its own timed conditions, so *slowed 1 for 1 round* expires on its own. A reroll that changes the
degree of success takes the old riders back off and applies the new ones — and only ever removes what this
module put there.

Requires **pf2e-toolbelt**'s Target Helper, and a GM online. With no GM, the caster is told what would have
been applied rather than being left to assume it was.

What remains manual, and why:

| Where | What is manual | Why |
| :-- | :-- | :-- |
| Forced movement | Pushed 15 ft, dragged 30 ft, launched 30 ft up, teleported 60/250 ft | *Which* 15 feet depends on walls, allies and facing. Whispered to the GM instead of guessed |
| Outright death | Antares, *Royal Funeral*, Cancer's Ascendant, *Sekishiki Tenryū Ha* on a crit | A campaign decision, not a condition |
| Choice riders | *Tenbu Hōrin*'s sense loss, *The Sharpest Sword*'s severing | The Saint chooses which sense or limb |
| Strike-based riders | Virgo's Six Paths, Scorpio's Ascendant bleed, *Rozan Ryū Hi Shō* on a crit | These key off a Strike's outcome, not a save; the engine is save-driven |
| Passive and aura riders | Pisces' reactive poison, Aquarius' cumulative slowed → petrified | These fire on the *target's* turn, with no message to hang off |

**The remaining gap** is a strike-outcome equivalent of the save hook — `pf2e.damageRoll` plus the target's
degree of success — which would close the Strike-based row. The aura rows want a real Aura rule element with
`affects`, which pf2e already has; they are a content job rather than a scripting one.

### 2. Action economy the system does not model

| Where | What is manual |
| :-- | :-- |
| Leo — Zenith | The *second* extra action. `quickened` is binary; it only ever grants one |
| Gemini — boon, Taurus — Zenith | "Cast this Technique without spending a Focus Point once per round" |
| Cloth Attunement, *Attuned Casting* | The once-per-day free cast — the action exists, the refund does not |
| Gemini — Zenith | The duplicate. It is a second actor, not a modifier |
| Libra — *The Twelve Arms* | Allies using **your** proficiency with a loaned weapon |

**A workaround would need** either a chat hook that refunds a Focus Point after a flagged cast, or a
pre-roll dialog. The duplicate probably wants a real ephemeral actor created by script.

### 3. IWR bypass beyond what the damage system exposes

`AdjustStrike` handles precious materials and property runes, and those *are* automated. Arbitrary bypass is
not exposed.

| Where | What is manual |
| :-- | :-- |
| Seventh Sense, Capricorn boon | Blanket "ignore all resistances" |
| Aquarius — Ascendant | Cold ignores cold resistance; cold immunity counts as resistance 10 |
| Atomic Dissolution | Treat resistance as 5 lower |
| Capricorn — Techniques | Ignoring Hardness, and treating force effects as Hardness 0 |

**A workaround would need** a damage-application hook that recomputes IWR with our overrides, since
`DamageAlteration` has no property for "ignore the target's resistance".

### 4. Things that must see the die or the outcome

| Where | What is manual |
| :-- | :-- |
| Libra — The Balance | "The first natural 1 you roll each hour counts as a 10." `SubstituteRoll` resolves *before* the die is known, so it cannot be made conditional on rolling a 1 |
| Virgo — Om | Which roll consumes the empowerment. The numbers are automated; nothing enforces that it applies to only one roll |
| Everything with a per-hour or per-Zenith-day frequency | PF2e tracks per-round/turn/day cleanly; longer and bespoke periods are on the honour system |

**A workaround would need** a `preCreateChatMessage` / post-roll hook that inspects the result and rewrites
or consumes.

### 5. Non-damage heightening riders

Per-step **damage** and **area** growth are both automated (`heightening.damage`, `heightening.area`).
What is left has no field in the spell schema:

- Extra **targets** at specific levels (Gemini, Virgo, Aries)
- Longer **range** per step (Gemini, Virgo, Aries, Libra)
- Additional **Strikes** or **pillars** per step (Taurus, Leo, Scorpio, Sagittarius)
- Wall **length** (Aries' *Crystal Wall* — a wall, not an area)

**A workaround would need** an `ItemAlteration` applied per heightening step, or accepting a text note.

### 6. Deliberately not automated

Not gaps — these are judgement calls that should stay with the table.

- **The Gold Cloth cracking** at 0 HP and its 24-hour repair
- **Pandora Box** couriering an object across a plane
- **Gemini's two identities**, and what *true seeing* reveals
- **Cancer's** speaking with spirits; **Sagittarius'** naming a target he cannot see
- **Constellation of One**, which is a legacy feat about the campaign ending

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

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

### 1. Cross-actor effects — a rule element can only write to its own actor

This is the largest group by far. A rule element lives on the Saint's sheet and cannot reach into a target's
sheet to apply a condition. PF2e does not automate this for official content either — a failed save against
*blindness* still needs someone to click the condition on.

| Where | What is manual |
| :-- | :-- |
| Every damaging Technique | The on-failure riders: drained, slowed, stunned, blinded, immobilized, restrained, prone, forced movement |
| Taurus — boon and *Great Horn* | Fortitude save, then pushed 10/15 ft and knocked prone |
| Virgo — Six Paths (Ascendant) | Will save per unarmed hit, cumulative sense loss |
| Virgo — Zenith | Loss of all five senses in a 60-ft emanation |
| Scorpio — needles | Enfeebled 1 at 5, blinded at 10, stunned 2 and runes suppressed at 14 |
| Scorpio — Ascendant | 1d6 persistent bleed per needle; death at 8 needles |
| Cancer — Ascendant | Anything you reduce to 0 HP dies |
| Aquarius — Ascendant | Cold damage → cumulative slowed → petrified at slowed 4 |
| Pisces — passive and aura | Reactive 1d6 poison; 4d6/8d6 and enfeebled at end of turn |
| Capricorn — The Sharpest Sword | Severing a limb, sense, or natural attack on a critical hit |

**A workaround would need** a module-side hook that reads the damage/save chat message and applies
conditions to the targeted tokens — i.e. the same territory as PF2e Workbench or Automated Animations. That
is a scripting job in `scripts/`, not a rule-element job.

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

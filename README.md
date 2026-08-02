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

## Known gaps

Built from **class guide v4**. A few things are rules text rather than automation, because PF2e has no hook
for them:

- **Blanket "ignore all resistances"** (Seventh Sense, Capricorn's boon). Material bypass and incorporeality
  *are* automated; the general clause is a roll note on the damage.
- **Scorpio's per-creature needle counts.** The sheet resource tracks the current target and roll-option
  toggles flag the 5 / 10 / 14 thresholds; several creatures at once need pen and paper.
- **Virgo's Om** is a badged effect you apply and increment. The **blinded** condition is automated — the
  effect grants it in memory for as long as your eyes are closed — but *spending* the stacks is manual: the
  empowerment lands on one roll and depends on a count no rule element can read once the effect is gone.
- **Gemini's Zenith duplicate.** Copy the token, give it two actions of Strike and Stride only, delete it at
  the top of the next turn.
- **The non-damage half of a heightening step** — extra targets, longer range, wider bursts. The sky's extra
  *dice* are automated per Technique; the rest is in each Technique's text.

One place where PF2e's model and the guide's cannot both be satisfied exactly:

- **Techniques have no rank in v4**, but pf2e spells must. Each Technique is a focus spell whose base rank is
  half its gain level rounded up (1, 3, 6, 8). This reproduces the guide exactly for the 1st and 3rd slots
  and converges correctly at 20th for all four; the **2nd and 4th slots run one heightening step ahead**
  between odd levels, because pf2e anchors focus rank to odd levels while the guide anchors to the gain
  level. The alternative was printing the wrong number at the level the Technique is gained.

*Double Excalibur* scales from a base of zero in the guide, and a pf2e spell needs a base formula to scale
from — so its base is `1d1`, a flat 1 point. That is a constant +1 per Strike at every level and sky state,
and it buys full automation of both the heightening steps and the sky's bonus dice.

## Credits

The Saint is homebrew by Isaac. Icons are existing Foundry VTT and PF2e system art. Licensed MIT.

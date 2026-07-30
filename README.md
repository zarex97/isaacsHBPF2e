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
- **Twelve Gold Cloths** as selectable subclasses, each with a Cloth Passive, a Signature Technique, an
  Ascendant Boon, a Zenith Boon, and an 11th-level Cloth Ability.
- **28 Techniques** as focus spells that auto-heighten on a rank spine, so damage scales from the heightening
  interval rather than from numbers hardcoded per level.
- **28 class feats** from 1st to 20th, including *Athena Exclamation* and the legacy capstone
  *Constellation of One*.
- **A sky tracker** — a GM window that holds the day's constellation and aspect, applies the right boon to
  every Saint, announces the day in chat, and lets you schedule a Zenith for the arc climax.
- **A handbook** journal covering the tuning curve, the rank spine, and the GM notes that make the class work.

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
  firing. It also enforces two invariants from the class guide: every damaging Technique scales on the rank
  spine, and the removal/death Techniques carry `incapacitation`.
- **`npm run check:roundtrip`** reads the built LevelDB back and compares it to the source, so a lossy write
  fails CI instead of shipping.

To author in Foundry's UI instead and pull changes back:

```bash
npm run extract -- --overwrite
```

## Known gaps

Three things are rules text rather than automation, because PF2e has no hook for them:

- **Blanket "ignore all resistances"** (Seventh Sense, Capricorn's boon). Material bypass and incorporeality
  *are* automated; the general clause is a roll note on the damage.
- **Scorpio's per-creature needle counts.** The sheet resource tracks the current target and roll-option
  toggles flag the 5 / 10 / 14 thresholds; several creatures at once need pen and paper.
- **Gemini's Zenith duplicate.** Copy the token, give it two actions of Strike and Stride only, delete it at
  the top of the next turn.

One number is also worth a decision: Leo's *Lightning Bolt* reads 6d12 at rank 6 where the class guide prints
5d12. The spine (+1 die per rank) and that printed number can't both hold for a d12 variant, and the guide's
own appendix makes the spine the governing rule — so the spine won. See the Handbook journal for the
alternative.

## Credits

The Saint is homebrew by Isaac. Icons are existing Foundry VTT and PF2e system art. Licensed MIT.

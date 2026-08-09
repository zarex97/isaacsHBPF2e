# Automating §4 and §5

*Design note. Nothing here is built yet.*

[§4 (things that must see the die)](../README.md#4-things-that-must-see-the-die-or-the-outcome) and
[§5 (non-damage heightening riders)](../README.md#5-non-damage-heightening-riders) are what remain of the
backlog. Seven rows: **six are automatable**, and the seventh is a non-goal argued at the end rather than
left as an objective nobody will meet.

## Four findings

**1. No calendar module is needed.** `updateWorldTime(total, diff)` is a **core Foundry hook** — it fires
whenever world time moves, whoever moved it. pf2e already listens to it
(`src/scripts/hooks/update-world-time.ts`) and ships its own **World Clock**, so hour advancement works out
of the box with nothing installed. [Seasons & Stars](https://foundryvtt.com/packages/seasons-and-stars) —
the maintained v13+ successor to Simple Calendar — is a far nicer way to advance time and worth
recommending, but as a convenience, never a dependency. Anything that calls `game.time.advance()` drives
this equally well.

**2. The per-hour gap is real, and it is pf2e's.** `Actor#recharge` accepts only
`duration: "turn" | "round" | "day"` (`actor/base.ts:2085`). An item with `frequency.per: "PT1H"` is
therefore never refilled except by a full night's rest, where `Duration.fromISO(per) <= PT8H` sweeps it up
with everything else. That is the actual bug behind "longer periods are on the honour system" — not a
missing concept, an unimplemented interval.

**3. `DegreeOfSuccess` takes a `RollBrief`.** Its constructor accepts `{ dieValue, modifier }` as well as a
`Rolled<CheckRoll>` (`system/degree-of-success.ts:29`) — exactly the shape needed to recompute a degree
after changing a die. The class is **not** exposed on `game.pf2e`, so the band comparison has to be
re-implemented; it is about thirty lines and entirely testable offline.

**4. `ItemAlteration` cannot reach §5's fields.** The handler list
(`rule-element/item-alteration/handlers.ts`) has `area-size`, `range-increment`, `range-max`,
`frequency-max`, `frequency-per` and `damage-dice-number` — and nothing for a spell's range or a target
count, because pf2e models neither. §5 therefore belongs in **our** `areaTargeting` config, which already
owns `maxTargets` and the area shape.

---

# §4 — Things that must see the die

## Libra — *The Balance*

*"The first natural 1 you roll each hour counts as a 10."* `SubstituteRoll` fixes its value before the die
is known, so it cannot express this. The message is rewritten after the roll instead.

On `preCreateChatMessage`, for a check roll from an actor carrying an armed *The Balance*:

1. Read the d20 term. If it is not a natural 1, do nothing — almost every roll is untouched, which is what
   makes this cheap enough to sit on a hook that fires constantly.
2. Set the die to 10 and recompute the total.
3. Recompute the degree from `{ dieValue: 10, modifier: totalModifier }`, the DC in
   `flags.pf2e.context.dc`, and `context.dosAdjustments`. The natural-1 step-down no longer applies,
   because the die is no longer a 1.
4. Write back `roll.options.degreeOfSuccess`, `flags.pf2e.context.outcome` and the rendered degree label.
5. Consume the hourly allowance, and tag the card with what paid for it.

New `scripts/outcomes/balance.mjs`, plus `scripts/lib/degree.mjs` holding the band comparison so the test
harness can import it.

**The risk, stated plainly.** This is the only place in the module that re-implements a piece of pf2e
rather than calling it. Mitigations: the comparison is pure and driven by a table of
`(die, modifier, dc, adjustments) → degree` cases pinned to pf2e's own boundaries; the version it was read
against goes in a comment, as `pf2e-traits.json` already does for traits; and a check with no DC in its
context is skipped, because without a DC there is no degree to get wrong.

*Rejected — pre-rolling the die and feeding it in as a `SubstituteRoll`.* pf2e would then compute
everything and nothing could drift. But a substitution replaces the dice expression with a literal
(`check.ts:153`), so **no d20 is ever rolled**: no dice animation, no Dice So Nice, on every check while
the boon is armed. Too high a price on all rolls to fix one in twenty.

*Rejected — `Check.rerollFromMessage`.* It clones the **old roll** and re-evaluates it (`check.ts:463`)
rather than re-running `Check.roll`, so it never consults `rollSubstitutions`. A forced 10 cannot be
injected that way.

## Virgo — Om

The numbers are automated already; what is missing is that the empowerment applies to *one* roll. The
`om:eyes-open` toggle stays on until somebody flips it back, so every later roll is empowered too.

`scripts/outcomes/om.mjs` consumes it on the first roll that actually benefits: the first damage roll or
Technique cast carrying `om:eyes-open` from that actor sets the Om badge to 0 and turns the toggle off.
Both seams exist — the module wraps `cast` and watches `pf2e.damageRoll`.

"Before the end of this turn" is the other half, and needs no new machinery: a `turn-end` rider on the Om
effect clears any unspent empowerment.

## Per-hour and per-Zenith-day frequencies

Two intervals, one small module — `scripts/economy/recharge.mjs`:

- **Per hour, per ten minutes, per minute.** Listen to `updateWorldTime`, accumulate elapsed seconds, and
  refill `frequency.value` on any item whose ISO interval has now fully passed. This is what
  `Actor#recharge` would do if its `duration` union included them.
- **Per Zenith day.** `SkyTracker.advanceDay()` is the only thing that can define one, so the refill hangs
  off the day change. The interval lives in our flag rather than `system.frequency.per`, whose choices pf2e
  validates. *The Yellow Spring Is Here* is the first customer: it currently says `per: "day"`, which is
  close but resets on a rest rather than when the sky turns over.

Only the active GM performs a refill, the rule every timed thing in this module follows.

---

# §5 — Non-damage heightening

`system.heightening` carries `damage` and `area` and nothing else. Everything §5 asks for is already
expressible in our own config — it only has to become rank-aware:

```jsonc
"areaTargeting": {
    "affects": "enemies",
    "maxTargets": 3,
    "range": 30,
    "area": { "type": "emanation", "value": 30 },
    "heightening": {
        "interval": 1,          // per step, matching system.heightening.interval
        "maxTargets": 1,        // +1 creature per step        (Gemini, Virgo, Aries)
        "range": 10,            // +10 feet per step           (Gemini, Virgo, Aries, Libra)
        "areas": 1,             // +1 placement per step       (Leo's pillars)
        "length": 5             // +5 feet of wall per step    (Aries' Crystal Wall)
    }
}
```

`configFor` already receives the heightened variant — `variantFor` in `scripts/targeting/index.mjs` loads
it so a heightened burst is the right size — so the cast rank is in hand. The step count is
`(castRank - baseRank) / interval`, exactly how pf2e computes its own damage and area growth.

| Row | How |
| :-- | :-- |
| Extra targets per step | `heightening.maxTargets` raises the cap the review dialog already enforces |
| Longer range per step | `heightening.range`, enforced during placement — below |
| Additional pillars per step | `heightening.areas`, placed in sequence with `canvas.regions.placeRegions`, which exists for exactly this |
| Wall length per step | `heightening.length`, feeding the Crystal Wall builder below |

**Lightning Crown comes back.** "Up to three 5-foot squares within 60 feet" was excluded from area
targeting because one Region cannot express three areas. `placeRegions` places a list one after another, so
it can — and `heightening.areas` grows the count. The README's exclusion note goes.

## Range as a real constraint

The module has never checked range. It will: a placement whose origin-to-centre distance exceeds the
Technique's range is rejected, naming both the distance and the limit. Because this holds the table to a
rule it was not being held to before, it ships with a world setting **Enforce Technique range** (default
on) and a GM override on the rejection — a measured distance is not always the distance the table means.
Measurement uses pf2e's own `token.distanceTo`, so it agrees with everything else in the system.

## Aries — *Crystal Wall*

A barrier 15 feet long and 10 high that blocks line of effect, with AC 10, Hardness equal to your level and
Hit Points equal to four times your level — and it lengthens per step. Both halves automate:

- **The barrier** is Foundry `Wall` documents, placed along the confirmed line with movement and sight
  restricted, so line of effect is genuinely blocked rather than described.
- **The hit points** are a small hazard actor at the wall's midpoint carrying the AC, Hardness and HP from
  the caster's level. Damaging it is then ordinary pf2e — and Capricorn's Hardness bypass, built in §3,
  works on it with no extra code. At 0 HP a `damage-applied` rider deletes the hazard and the segments
  together.

New `scripts/targeting/wall.mjs`. This is the only part of the plan that writes scene geometry, so it is
gated behind the same active-GM rule as everything else, and every document it creates carries a module
flag — nothing is deleted that this module did not place.

---

# What stays manual, and why

**How many Strikes a player actually makes.** *Pleiades Nova* is five Strikes and six at higher levels,
*Crimson Flurry* four, *Athena's Arsenal* six. The plan automates the number the card shows and the target
cap the review dialog enforces, but nothing stops somebody rolling a seventh.

That is a non-goal rather than a gap. pf2e does not track how many Strikes anyone makes during *any*
activity — Flurry of Blows, Double Slice and Twin Takedown are all on the same honour system, for the same
reason there is no action pool to spend from. Options considered:

- **Count Strike messages during the activity.** Rejected for the reason the Leo action tracker was
  rejected: a Strike made from the sheet without posting to chat is invisible, so the count would be wrong
  often enough to mislead, and a wrong counter is worse than none.
- **Generate N single-use Strike items per cast.** Mechanically workable and horrible to use — six items
  appearing and vanishing on the sheet every time somebody casts.

The number is a permission, not a restriction the system has anywhere to store.

---

# Order of work

1. **Frequencies.** The `updateWorldTime` recharge and the Zenith-day interval. Smallest, and it makes
   every "once per minute" activity added in the last change actually recharge.
2. **Om.** Two listeners on seams that already exist.
3. **§5 heightening.** The config block, the step maths, multi-area placement, and the range constraint.
4. **The Balance.** Last of the code, because it is the only re-implementation and deserves to land alone
   where it can be reviewed as one thing.
5. **Crystal Wall.** Walls, hazard, and the cleanup rider.
6. **README.** Rewrite §4 and §5, delete the *Lightning Crown* exclusion, add the Strike-count non-goal to
   §6, and note Seasons & Stars as recommended-not-required.

# How to know it worked

`npm test` stays green throughout, and the offline harness grows:

- **Degree of success** — a table of `(die, modifier, dc, adjustments) → degree` covering both band
  boundaries, the ±10 crit bands and a `dosAdjustments` entry. This is the drift-prone code, so it gets the
  most cases.
- **Heightening maths** — `(baseRank, castRank, interval, heightening) → { maxTargets, range, areas }`,
  driven by the shipped content, so a Technique whose growth is wrong fails the build.
- **Frequency elapse** — `(per, secondsElapsed, accumulated) → refill?`, including that a partial hour does
  not refill and two half-hours do.
- **Validator** — every new field rejected when malformed, proven by breaking each one, as with `bypass`
  and `riders`.

In a running world: place *Lightning Crown*'s three areas and confirm each is aimed separately; place an
area beyond range and confirm the rejection names the distance; roll a natural 1 as a Libra Saint with the
boon armed and confirm the card reads 10 with the right degree, and that the second natural 1 that hour
does not; open Om's eyes, make one Strike, and confirm the empowerment is gone for the next; advance the
World Clock an hour and confirm a per-minute activity has recharged.

---

Every API named here was read from the pf2e 8.4 source and the Foundry v14 type definitions in the
`pf2e_fork` checkout, at the paths given. Nothing here has been built.

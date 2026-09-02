# The Full Automation Programme

*Status document — what has been done to the Saint, what is being done, and what "done" means.*
*Last updated 1 September 2026 (Pisces pass), against module v99.0.0 (working tree), Foundry 14.364, pf2e 8.4.1.*

---

## 1. What this document is for

This module implements a homebrew Pathfinder 2e class — **the Saint** — with twelve Gold Cloths, four
Techniques each, a sky that decides whose day it is, and a class guide (v4) that describes all of it in
prose. The prose is the specification. The module is the implementation. This document records how far
apart those two have been, how far apart they still are, and what closing the gap involves.

The goal is stated plainly so it can be tested against: **every sentence in the class guide should happen
by itself at the table.** Not "should be trackable", not "should be reminded about" — should happen. That
includes the parts that earlier design decisions deliberately left to the GM. Those decisions have been
reversed; see §5.

---

## 2. Where this began

Between 11 and 15 August 2026 the class was played and tested against an interactive checklist
(`Docs/Saint_Class_Interactive_Checklist (1).html`), producing 55 numbered reports — one per Cloth
passive, Technique, Ascendant Boon and Zenith Boon that misbehaved. Those reports were the first
systematic evidence that the implementation and the guide disagreed.

They were analysed in `Docs/El Taller de Mu.html`, a repair report that grouped the 55 symptoms into 11
root causes, closed 29 of them, and left 26 open in four categories: needing a design decision, needing
data from the table, never written, or working as intended. That document was careful and mostly right,
and it was honest about its own limits. Its Part V says so directly: none of its four test stages runs
Foundry, so it could verify logic and content shape but could say nothing about whether a rule element
actually fired at a table.

That gap is what the current phase of work exists to close. Everything since has been verified in a
running world (`pf`), with the module served straight from the working tree through a filesystem junction
so that a code change is live on the next reload rather than on the next release.

---

## 3. The architecture, briefly

Four subsystems carry almost all of the automation. Understanding them is enough to read the rest of this
document.

**The rider engine** (`scripts/riders/`) closes a gap in pf2e itself: the system rolls a saving throw and
stops. It does not apply the "on a failure, the target is slowed 1" half. A rider is a small object on an
item saying *when* (`event`), *on what result* (`outcomes`), *under what condition* (`predicate`) and
*what happens* (`apply`). There are seven events — `save-rolled`, `strike-resolved`, `strike-received`,
`action-used`, `damage-applied`, `turn-start`, `turn-end` — and fourteen apply types: a condition, a
compendium effect, direct damage, persistent damage, a nested save, a death, a choice card, a
**teleport**, a **volley of Strikes**, a **banishment**, a **heal**, a **readout**, a **toggle**, and a
prompt (being eliminated, §5).

Several carry extras worth knowing. A `teleport` takes a `distance` in feet and reads it either as a
delta or, with `measure: "from-origin"`, as a destination — which is what "pushed to the end of the line"
means. A `damage` rider takes `perStep`, the growth it gains per heightening step, because a rider sits
outside `system.damage` and pf2e will never scale it otherwise; and a `multiplier`, for the Techniques
whose own success/failure ladder pf2e declines to apply (§4.9). A `death` takes `hpFraction`, a threshold
read *after* the pass's damage has landed rather than from the snapshot before it. A `banish` takes a
duration and nothing else, because where a creature goes is nowhere.

Two subsystems sit beside the engine and are addressed by content flags rather than riders, because both
belong to a patch of ground rather than to an actor: **lingering areas** (`scripts/targeting/lingering.mjs`),
which keep the aimed Region on the board with difficult terrain or burning damage and an expiry, and the
**death register** (`scripts/deaths.mjs`), which writes down where and when creatures died so that a
Technique can ask the ground about its past.

Applications flow Source → Relay → Collect → Select → Apply. The relay exists because a player owns their
Saint and nothing else, so the work is handed to the active GM. Selection tests every predicate against a
snapshot of the world taken *before* anything is applied, which is what makes escalation ladders advance
exactly one step per hit instead of all at once. Every application leaves a **receipt** on the chat
message listing what it created and what counters it moved, so a hero point that turns a critical failure
into a success can take the consequences back off.

**The sky** (`scripts/sky/`) tracks which constellation is ascendant. A Saint whose Cloth matches wears a
`Sky: Ascendant (Sign)` effect for the day, or `Sky: Zenith (Sign)` on the rare exalted day. Those effects
emit roll options (`sky:ascendant`, `sky:zenith`, `sky:sign:aries`) that content predicates read, add
damage dice, and carry riders of their own.

**Area targeting** (`scripts/targeting/`) exists because pf2e models neither a target count nor a spell's
range as a manipulable number. A Technique with an area is put on the board as a Scene Region, aimed,
reviewed against who it caught, and only then cast — so backing out of a placement costs nothing.

**The economy** (`scripts/economy/`) handles free casts, the Gemini duplicate, and frequency recharges.

---

## 4. What has been fixed, and why each one hid

Verification found that the repair report was substantially correct, but not wholly, and that two large
defects lay underneath it that nobody had reached. Ordered by blast radius:

### 4.1 The rider leak (report's RC-1) — confirmed genuinely fixed

Every save collected riders from *every* item on the Saint, not just the Technique that forced it. Since
56 of 57 save riders carry no predicate — and shouldn't need one — each save handed out everything.
Casting *Scarlet Needle* also applied *Crimson Mirage*'s dazzled and *Antares*' death whisper. Casting
*Sekishiki Konsō Ha* also applied *Meikai Ha*'s drained and a second slowed, which is why a creature came
out slowed 2 instead of slowed 1: it was literally 1 + 1.

Verified live by running the collection twice against real actors, once as it ships and once reproducing
the old behaviour. The old column reproduces the original bug reports word for word. It also showed
something the report had only guessed at: *Great Horn* was colliding with *Titan's Break*, which explains
report `taurus-t1`.

### 4.2 Durationed conditions granted nothing — found here, biggest single defect

This is the one that matters most, because it was invisible in every way a person would normally check.

A condition with a duration cannot be a bare condition — pf2e conditions have no duration of their own —
so the module creates an effect that *grants* one, with a `GrantItem` rule pointing at pf2e's condition
item. The address came from `ConditionManager.getCondition(slug).uuid`. That call returns a **temporary**
instance built from the compendium rather than a stored document, and a temporary document's `uuid` is
`null`. The address lives on `sourceId`.

So the rule was `{ key: "GrantItem", uuid: null }`. It validated. It created an effect with the correct
name and the correct duration. It granted nothing. A creature caught in *Crystal Net* wore an item saying
"Crystal Net: Immobilized" and was not immobilized.

It hid because it only affected riders carrying a `duration`. A rider without one takes a different path
(`increaseCondition`) and never builds a grant at all — so 36 riders worked correctly while 20 did
nothing, in the same session, on the same sheets. The 20 span twelve Techniques across eight Cloths:
*Crystal Net*'s restrained and immobilized, *Scarlet Needle*'s off-guard, *Antares*' paralyzed, *Crimson
Mirage*'s dazzled and confused, *Photon Burst*'s blinded, *Another Dimension*'s confused, *Mavros Eruption
Clast*'s blinded, *Rikudō Rinne*'s enfeebled and stupefied, *Six Realms Unmade*'s blinded and deafened,
*Royal Demon Rose*'s stupefied, *Koliço*'s three, *Diamond Dust*'s slowed, *Freezing Coffin*'s slowed, and
*The Yellow Spring Opens*' slowed.

Fixed by resolving through `sourceId` first. Verified live: `hasCondition("restrained")` went from `false`
to `true` on the same card.

### 4.3 Pisces' roses never drew blood (RC-6) — half-fixed by the report, finished here

The report correctly diagnosed a predicate that could never match, and correctly fixed it. But the roses
still did nothing at the table, because of a second, independent defect it never reached: for
`strike-received` the source swaps origin and target, and sent the attacker's **Actor** uuid where the
apply path needs a **Token**. `fromUuid` returned an Actor, `target?.actor` was `undefined`, and the whole
application returned silently — no error, no warning, nothing in chat. `strike-resolved` was unaffected
because that slot gets a real token, which is why Capricorn's severing worked in the same session.

Proven by a three-way bisection and fixed by reading `message.token?.uuid` first. Re-tested with eight
live strikes: every hit fires, every miss does not, and a critical fires both the roses and the severing
card.

### 4.4 Attuned Casting could never fire (RC-9)

Its predicate asked for `item:time:1` / `item:time:2`. pf2e emits no time-based roll option at all. The
real option is `item:cast:actions:N`. The other two free-cast reports in the same group turned out not to
be bugs — both predicates were correct and had simply been tested on a day when the sky belonged to
somebody else.

### 4.5 Two Cosmo entries on every Saint — found here

`Cosmo.ensureEntry` checked for an entry, found none, and created one — with an `await` between the check
and the create. The `createItem` hook fires for the class *and* for every Technique granted alongside it,
in the same batch, so two callers both saw no entry and both made one. Every Saint ever created had two
identical focus spellcasting entries.

Fixed by parking the in-flight promise so the second caller awaits the first one's entry. Verified: a
brand-new knight now gets exactly one. The fourteen existing Saints were repaired in place, with the
spells filed under the duplicate refiled rather than orphaned.

### 4.6 Three places the repair report was wrong

- **Libra's weapons.** The report says no `weapon` documents exist and estimates an afternoon to write
  twelve. All six pairs exist — Twin Swords, Tridents, Nunchaku, Shields, Sanjiegun, Tonfa — fully
  statted, at the report's own stated base commit. The real gap is one line of scope: `Summon Libra
  Weapon` has `rules: []`, and the Cloth grants the summon action and four Techniques but never a weapon.
- **The Crystal Wall.** The report suspected a rounding error in the wall geometry. There is none; the
  ladder is exactly linear from 3 cells at rank 1 to 12 at rank 10. The reported 4-cell wall is precisely
  a rank-2 cast, and the scene still contained walls of 3, 4 and 12 cells to prove it.
- **The Aiolos formula** it quotes is not the one that ships.

### 4.7 Bugs the checklist never caught, found while walking the Cloths

None of these appear in the 55 reports, because each is invisible unless you go looking at the numbers.

- **Cosmo Strike never worked.** Its `ItemAlteration` was `mode: "upgrade"` with `value: 6`; pf2e accepts
  a value only with `override`, and threw a validation error on every actor preparation. So the class's
  central promise — *"your fist deals 1d6"* — never applied, and **every Saint's fist was a d4**.
- **Titan's Break dealt half as much again as it should.** Its critical-failure-only 4d8 was authored as a
  second `system.damage` part, and pf2e rolls every part unconditionally, so all ten creatures in the line
  took 12d8 instead of 8d8. Worse, it carried **four** `DamageDice` rules on one selector, two of them
  duplicates, so a lit sky counted twice. The extra damage is now a `criticalFailure` rider with `perStep`.
- **Invalid IWR types.** Leo was immune to `"fear"` and Arayashiki to `"death"` and `"dying"`. The real
  names are `fear-effects` and `death-effects`; there is no `dying` immunity at all. Each failed silently.
- **43 of 107 image paths did not exist.** Six were scrambled forms of real files and are fixed; 37 remain
  and render blank.

Each now has a validator that fails the build, and each validator was checked against the original broken
value first. `build/lib/pf2e-iwr.json` holds pf2e's immunity/weakness/resistance dictionaries, snapshotted
from a running 8.3.0, the same way the traits snapshot works.

### 4.8 Four abilities that could not be cast at all — found in the Gemini pass

`configFor` read `area.type` without a guard. An ability reaching it may legitimately have no area: "one
creature within 60 feet" is a target count and a range, which is precisely the case the module's own
`checkExistingTargets` exists to handle. The `TypeError` went straight out of the `cast` wrapper, so
*Another Dimension*, *Tenbu Hōrin*, *Rikudō Rinne* and *Star Guard: Exile* threw instead of casting —
every time, for anyone.

It survived two full Cloth passes because Aries and Taurus have no Technique of that shape: every one of
theirs carries a real area. Gemini's signature is the first, and it failed on the first attempt to cast it.
One character fixed it. A test now runs every flagged document in the content through the real `configFor`,
and fails naming each ability that throws.

### 4.9 Two more silent no-ops in the same family

Both were found by walking Gemini and Cancer, and both are the same shape as §4.2 — a call that looks right,
returns nothing, and reports nothing.

- **`flatMap` on a document collection.** Foundry's `EmbeddedCollection` is a Map with a few array methods
  bolted onto it, and `flatMap` is not among them. The Gemini duplicate called it while looking for a free
  adjacent square, so it threw on every turn start of a Gemini Saint on a Zenith day — the one day the
  duplicate exists to appear on. It has therefore never appeared. A test now sweeps the scripts for
  array-only methods called on a collection.
- **`toggleStatusEffect` is an Actor method in Foundry 14, not a TokenDocument one.** `applyDeath` asked the
  token, found no function, and skipped in silence, so a creature the Yellow Spring took stood at 0 hit
  points with no mark on it at all.

A third, narrower one: **a script may not hold a compendium uuid by name.** The build rewrites a *content*
uuid from the authored name to the packed id, which is why `@UUID[…Item.Effect: X]` in JSON resolves at the
table; code gets no such pass, and `fromUuid` on a name-shaped compendium uuid returns null without a word.
*Astral Projection* shipped with two of them and did nothing whatsoever. Effects are now looked up through
the pack index, and a test refuses any name-shaped uuid in `scripts/`.

### 4.10 Range was never enforced for an area

`config.range` came only from the module's own targeting flag, and no area Technique in the content sets it
there — all of them state their reach in `system.range`, where pf2e keeps it. So "a 60-foot burst **within
120 feet**" placed the burst and never checked the 120 feet, for any Cloth. It now falls back to the spell's
own range, which every one of them states. This is a module-wide change rather than a Gemini one: it turns
the existing `enforceRange` setting on for some twenty Techniques that were never subject to it, and a
breach is a confirmation dialog rather than a refusal, as it already was elsewhere.

A related observation, recorded rather than fixed: *Rozan Shō Ryū Ha* is "a 10-ft-radius, 30-ft-tall cylinder
**centred on you**", but only an emanation is treated as self-centred, so it is aimed freely. That is a
Libra defect for Libra's own pass.

---

## 5. The policy change: nothing stays a whisper

The original design drew a line: automate the half that is a condition, whisper the half that is a
decision. *Being pushed 15 feet and knocked prone* is two things — prone is a condition, the push is a
choice about which 15 feet, which depends on walls and allies and where everyone is standing. The
reasoning was good, and it is recorded in the code.

That line has been withdrawn. The instruction now is that **everything the guide describes should happen
automatically**, including forced movement, banishment, conditional death and action-economy grants. The
practical argument is simple: in play, the whisper was the one thing that did not happen. It was read
once and forgotten, and the Technique's headline effect quietly went missing.

The direction problem is solved by taking the geometry that is already on the table. A creature sent away
travels along the line from the caster to itself. That is the reading nobody argues with, it needs no
input, and where the map runs out the module says so rather than pretending.

---

## 6. Where the class stands now

202 content documents in seven packs: 48 Techniques, 62 feats, 60 effects, 22 actions, 6 weapons, one
class, one Cloth armor. 310 automated rider checks run without Foundry; validation, build and a round-trip
check run on every change.

### 6.1 Verified end to end in a live world

The whole of **Aries**, **Taurus**, **Gemini**, **Cancer**, **Leo**, **Virgo**, **Scorpio**,
**Sagittarius**, **Capricorn**, **Aquarius** and **Pisces** — every Technique cast for real, at six
character levels from 1 to 20, with every heightening value checked against the guide.

### 6.2 The Aries ladder, as a worked example

Focus Techniques auto-heighten to `ceil(level / 2)`. Each Technique has a different base rank, so each
takes a different number of steps, which is where an off-by-one would hide. All twenty-four values are
correct: the wall grows 15 → 60 feet across levels 1 to 20; *Starlight Extinction* 3d6 → 10d6 off base
rank 3; *Crystal Net* 6d8 → 10d8 with its burst 20 → 40 feet; *Stardust Revolution* 8d8 → 10d8 with its
burst correctly fixed at 30, because its area growth is authored as zero.

### 6.3 The three most recent fixes

**Star Guard now has a frequency.** It shipped with `rules: []` and no frequency block despite the text
saying "once per round". It now carries that limit, and the Zenith's grant raises the cap so its "no
frequency limit" is real. The Zenith's separate clause — once per minute, target a creature within 60
feet, Fortitude against the Cosmo DC, critical failure teleports it a mile — is now its own granted
action, `Star Guard: Exile`, with its own once-per-minute counter, because pf2e tracks one frequency per
item and these are two different allowances.

**The sky now heightens everything, not just dice.** Every Boon says "your Techniques heighten as though
you were 4 levels higher" — 8 on a Zenith. That was implemented only as damage dice, so on the one day of
the year a Saint's wall should be longest, it was its ordinary length. Four levels is two heightening
steps and eight is four; those steps are now added to every number that grows. Verified: Aries' wall goes
60 → 70 → 80 feet across no sky, Ascendant and Zenith, and *Crystal Net*'s burst goes 40 → 50 → 60, while
*Stardust*'s correctly does not move.

**A `teleport` apply type.** The first piece of the no-whispers programme. It moves the token along the
caster-to-target line, clamps to the scene, snaps to the grid, moves without animation because a teleport
blinks, records the previous position in the receipt so a reroll walks the creature back, and reports the
distance actually travelled. *Starlight Extinction* now genuinely teleports on a failure and a critical
failure — and applies the prone that its own card promised and no rider had ever delivered.

### 6.4 Taurus, the second Cloth walked end to end

The ladder is exact at all six checkpoints. *Great Horn* 1d8 → 10d8 with its cone fixed at 30; *Pleiades
Nova* 1d6 → 8d6 off base rank 3, its target cap stepping 5 → 6 → 7 at the authored 12th and 18th levels;
*Titan's Break* 8d8 → 10d8 with its line fixed at 60. Everything the Bull does now happens by itself:

- **Great Horn** knocks prone and pushes the full 15 feet. Verified: a creature 10 feet away ended 25.
- **Titan's Break** knocks prone, stuns 2, deals its conditional extra damage — and pushes *to the end of
  the line*, not by a flat distance. Verified: a creature 20 feet along a 60-foot line travelled 40 and
  stopped at 60.
- **Both skies** turn an unarmed hit into a Fortitude save that knocks prone and pushes 10. Verified from
  a real critical hit through the nested save to the movement.
- **Bulwark** is now mechanical rather than a note. A creature of the Saint's size or smaller simply
  cannot move them — the teleport refuses and says so — while a larger one still can. Verified both ways.
  Its +2 to the DCs against Shove, Trip, Grapple and Disarm applies too: 34 plain, 36 when shoved.
- **Titan's Stance** had no rules at all. It now applies an effect granting resistance `10 + 2 × level`
  to all damage and marking the Saint immovable. Verified at 20th: `all-damage 50`.
- **The Zenith's temporary Hit Points** refresh at the start of each turn, which the guide asks for and
  a bare `TempHP` rule does not do. One field: `events: { onTurnStart: true }`.

*Pleiades Nova* completes it: the volley built for §7.2 rolls five Strikes with a growing penalty and
no multiple attack penalty, verified live. **Taurus is finished** — with one correction made during the Leo
pass: the volley was making one Strike per confirmed target, which the five-target test that verified it
here could not distinguish from making five Strikes because the Technique says so. See §6.7.

### 6.5 Gemini, the third Cloth walked end to end

The ladder is exact at all six checkpoints. *Another Dimension*'s range climbs 60 → 150 feet and its target
count steps 1 → 2 → 3 at the authored 12th and 16th levels; *Astral Projection* reaches 200 → 1600 feet and
lasts 10 → 45 minutes; *Galaxian Explosion* 6d8 → 10d8 with its burst fixed at 60; *Mavros Eruption Clast*
8d8 → 10d8 with its burst fixed at 30. Everything the Twins do now happens by itself:

- **Two Faces is a toggle the action flips.** *Swap Aspect* used to end with "remember to flip the Two Faces
  toggle on the Cloth feature", which is a whisper wearing a different hat — an action whose whole content
  was a request that you do the thing yourself. Using it now cycles Light → Shadow → Light and announces
  which face the Saint is wearing. It also shipped with no `frequency` at all despite saying "once per
  hour", the same defect *Star Guard* had; it now carries one. The interval is `PT1H`, because pf2e has no
  `hour` — and nothing was checking, so a made-up interval would have been stored, displayed blank, and
  never recharged. Every item's frequency is now validated, not just a free cast's.
- **Another Dimension banishes for real.** Both durations were prompts, which meant a two-action Technique
  with an incapacitation trait did *nothing at all* unless a GM read the whisper. The creature now leaves
  the board and comes back a minute later — ten on a critical failure — in the square it left, with the same
  token id, its damage, and its conditions intact. In Shadow it confuses instead, and neither half fires in
  the other's aspect.
- **Astral Projection exists.** It was eight sentences of prose and `rules: []`. Casting it now places an
  astral body where the caster aims, invisible and unhittable, with no Focus Points and no Techniques; the
  Saint's own body is unconscious and off-guard for the heightened duration; **mental** Techniques measure
  their range and line of effect from the body while everything else measures from the Saint; and damage to
  the body dissolves the projection and leaves them stunned 1.
- **Galaxian Explosion folds space.** The area stays on the board for a minute as real difficult terrain —
  measured live at cost 50 for 25 feet of movement, against 25 outside it.
- **Mavros leaves the ground burning.** Entering it or ending a turn there applies 4d6 persistent fire,
  growing to 6d6 at 20th. That damage used to be a second `system.damage` part, which pf2e rolls
  unconditionally — the *Titan's Break* defect again, and it had the blast dealing the area's fire to
  everyone it caught.
- **The Ascendant Boon pays for the Signature Technique** once per round, and adds 20 feet to Galaxian's
  burst on top of the sky's two heightening steps: 80 feet and 12d8 on an Ascendant day, 14d8 on a Zenith.
- **The Zenith duplicate appears.** See §4.9 for why it never had.

### 6.6 Cancer, the fourth

The ladder is exact at all six checkpoints: *Sekishiki Meikai Ha* 1d8 → 10d8; *Kisōen* 3d8 → 10d8 with its
15-foot burst; *Konsō Ha* 6d8 → 10d8 with its 30-foot burst; *Tenryū Ha* 8d8 → 10d8 in a 60-foot cone.

- **The Boundary reports itself.** "You automatically know the current Hit Point category of every creature
  within 30 feet" is knowledge, and there is no rule element for knowledge. At the start of the Saint's turn
  a card now lists every creature in range as healthy, hurt, near death or dying, addressed to the Saint's
  own players and the GM — theirs to know, not the table's.
- **The blue flames feed.** "For each creature that fails its save, you regain 3 Hit Points, to a maximum
  equal to your level per casting" is per *failure* and lands on the *caster*, which is an unusual enough
  pair that it exposed a bug in the engine (§8). At 20th it is 17 Hit Points a soul, and the second soul
  gives 3 before the ceiling stops it. A creature the flames reduce to 0 is marked soul-consumed.
- **Konsō Ha asks the ground about its past.** "+1d8 for every creature that has died in this area within the
  last hour, maximum +5d8" needed a register, because a dead NPC's token is usually gone by then. Verified:
  10d8 on clean ground, 13d8 over three graves, 15d8 over eight, and 10d8 again an hour later. Undead and
  spirits take their additional 2d8, laddered 1d8 / 2d8 / 4d8 by degree of success.
- **Tenryū Ha drags and takes.** A failure pulls the creature 30 feet toward the mouth; a critical failure
  does the same and kills it if the damage leaves it at half Hit Points or fewer. Its damage ladder is now
  the Technique's own — see §7.5.
- **The Ascendant Boon kills.** "Any creature you reduce to 0 Hit Points dies" now fires at the moment hit
  points reach zero and marks the body. It lives on the action *both* skies grant rather than on the
  Ascendant effect, because the Zenith effect carries no riders of its own and the clause therefore did not
  exist on the one day the boon is strongest.
- **The Zenith takes the room.** A 30-foot emanation, enemies only, every one of them at half Hit Points or
  fewer rolling Fortitude against the Cosmo DC or dying. Verified with four creatures: the two that were
  hurt died, the healthy one in the area did not, and the hurt one outside it was untouched.

### 6.7 Leo, Virgo and Scorpio, the fifth through seventh

The ladder is exact at every checkpoint on all three. Leo: *Lightning Bolt* 1d12 → 10d12; *Lightning Crown*
3d8 → 10d8 with three pillars growing to six at 10th/14th/18th; *Lightning Plasma* three Strikes growing to
four at 17th; *Photon Burst* 16d6 → 20d6. Virgo: *Tenbu Hōrin* range 30 → 120 feet with a second target at
12th and a third at 16th; *Tenpōrin'in* emanation 30 → 65 feet with its bonus and immunity ladder read at
the caster's own level; *Tenma Kōfuku* 6d8 → 10d8; *Rikudō Rinne* gaining a second target at 20th. Scorpio:
*Scarlet Needle* 1d6 → 10d6 persistent bleed; *Crimson Mirage*'s per-needle die 1d6 → 4d6 at 10th/14th/18th;
*Crimson Flurry* four Strikes growing to six at 15th/19th; *Antares* 16d6 → 20d6. Everything each Cloth does
now happens by itself:

- **Lightning Crown's pillars are real.** "Shedding bright light and blocking line of sight through their
  squares" was prose; each placement now stands as a Scene Region carrying a `Wall` (sight- and
  light-blocking, not movement-blocking — a pillar is something to walk through and regret) and an
  `AmbientLight`, swept away together when the round ends. "A creature caught by two or more rolls once and
  takes damage once, but suffers a −2 circumstance penalty to that save" is a new `overlap` mechanism: the
  placements are counted while they still exist, and the penalty lands as a one-round effect before the
  save is ever rolled. Verified with four pillars over six creatures: two- and three-way overlaps both
  produced the penalty, the save's own breakdown showed it enabled, and the pillars, their walls and their
  light all vanished on schedule.
- **Lightning Plasma and Crimson Flurry make their own number of Strikes.** Both read "make N unarmed
  Strikes against any creatures within reach" and both were making one Strike per confirmed target — Leo's
  and Scorpio's versions of the exact defect §7.2 already named in Taurus, found because *Pleiades Nova*
  turned out to have shipped with it too (§7.2 below). A volley now asks its own Technique how many Strikes
  it makes and deals them out round-robin, so one enemy in reach of *Crimson Flurry* takes all four.
  *Crimson Flurry*'s "Strikes that miss apply a needle too, on an Ascendant day" is a predicated follow-up
  on the miss half of each Strike, checked against the sky rather than the Technique's own outcome.
- **Photon Burst is two shapes, chosen at cast time.** "A 120-foot line, or a 30-foot burst within 120 feet
  (choose as you cast)" needed somewhere to ask, so area targeting now supports offering a choice of shape
  before the caster aims. It also ignores resistance to force — "this damage is not reduced by cover, and
  it ignores concealment, resistance to force" — through the `bypass` machinery Capricorn already proved.
- **Om spends for real.** The whole mechanism — gain a stack at turn end, spend on the next roll, lapse
  unspent — was built and believed working from the Aries-era report, and it was not: the spend hook read a
  field (`roll.options.rollerRollOptions`) that does not exist on the `DamageRoll` this pf2e version hands
  a `pf2e.damageRoll` listener, so `om:eyes-open` was never seen and the empowerment stayed armed for the
  rest of the turn, silently, with no error anywhere. Rewritten to read the same message-based facts every
  other event source in the module already uses. Verified: four stacks close to blinded, four turn-ends
  climb the badge to four, opening the eyes lifts the blindness immediately and arms `9d6 + 5` on the next
  unarmed Strike (`+8` dice for 4 stacks, `+2` circumstance to the DC), and the roll that spends it deletes
  the effect and posts "4 stacks spent" — the second roll of the turn is back to `1d6 + 5`.
- **A receipt-key collision, found by the first Technique to have this shape.** *Tenpōrin'in* is a
  self-only counteract offer sitting beside an ordinary buff whose area `includesSelf` — so the caster's own
  token is `payload.targetUuid` for two different relay requests, one for each rider set. Both produced the
  identical receipt key, so the counteract card's receipt made the very next request — the caster's own
  buff — look like a re-application of something already applied, and it was silently declined. The Saint
  got the counteract offer and never their own aura. No Cloth walked before Virgo combined a `self` rider
  with an `includesSelf` buff on the same item, which is why this is the first time it could hide. Fixed by
  folding the request's self/targeted wave into the key; 245 rider checks now cover both this and the
  Sekishiki Kisōen shape the key already had to serve.
- **Tenpōrin'in counteracts a mental effect on an ally, chosen from the board.** "You may counteract one
  mental effect currently affecting a creature in the area, using your Cosmo DC" is a new `counteract`
  apply type: a card lists every effect and condition in the area carrying the named trait, one button
  each, and clicking rolls pf2e's own counteract math against the effect's level. The aura buff the
  Technique grants was itself authored with the `mental` trait, which meant re-casting it while an earlier
  casting's buff still stood on an ally offered to counteract that ally's own aura — found live, fixed by
  taking the trait off a buff that was never meant to be countered.
- **Tenma Kōfuku changes shape when the eyes are open.** "If you release this in the same turn that you
  open your eyes, the cone becomes a 60-foot emanation centred on you" is a new `alternateArea`: a
  predicated area that area targeting checks before falling back to the authored one, tested here against
  the `om:eyes-open` roll option. Verified both ways from the same Technique.
- **Rikudō Rinne's soul leaves the body on the field.** "It is stunned for the duration, its body standing
  empty" was two riders' worth of prompt. This was planned as a banishment (§7.1) and turned out not to be
  one: the guide is explicit the body never leaves the board, so a locked `stunned 3` for the duration —
  every action, every turn — is the correct reading, not folding the token away and back. A critical
  failure adds enfeebled 2 and stupefied 2 "on its return," both applied at the moment of the failure since
  nothing distinguishes "later" from "now" for a duration that is already running.
- **Scorpio's needle thresholds live in one place.** Fifteen needles, five ways to place one — the
  Technique, the free action, *Crimson Flurry*'s volley, and both skies — used to each carry, or lack, their
  own copy of "at 5, enfeebled; at 10, blinded; at 14, stunned and runes stripped." They are one list on
  **Effect: Scarlet Needle** now, next to the badge they read, so every source that walks the badge up gets
  them for free and none of them can disagree with another. New `counterThresholds` flag, `once`-per-crossing
  semantics proven in `build/test-riders.mjs` by walking a needle from 1 to 15 and checking each threshold
  fires on the exact needle that crosses it and never again.
- **A second bug in the same shape as Virgo's, found in Scorpio.** The Ascendant Boon's bleed
  ("1d6 persistent per needle") and its death check ("at 8 needles, Fortitude or die") both count the needle
  a *different* rider in the same pass has just placed. Selected against the snapshot — the rule every other
  rider follows, for good reason — the first needle drew no blood at all and the death fired on the ninth
  needle instead of the eighth: found by placing needles one at a time and watching the numbers lag by
  exactly one. A new `live` flag marks a rider as chosen against the pass's own result rather than the world
  before it, used only here and proven not to touch Virgo's four-step sense ladder, which still must never
  be live.
- **The needle bleed and Crimson Mirage's damage now scale off the badge they read.** `damage` and
  `persistent-damage` riders gained `perCounter`, reading the needle count off the target the moment the
  damage is dealt — capped at ten for the Ascendant bleed, uncapped and heightening at three named levels
  for the Mirage. Verified: needle 1 through 10 produced `1d6` through `10d6` bleed exactly, and a turn-end
  tick on a creature with three needles at 20th dealt `12d6` mental.
- **Leo's Zenith grants a second extra action that actually comes back.** "Two extra actions each turn" is
  the Haste-style quickened condition, which pf2e understands, plus a second allowance pf2e has no pool for.
  A new `refresh` flag on an effect rider resets a counter badge to full at the start of every turn instead
  of granting a fresh copy of the effect; verified across two simulated turn-starts, spending the counter to
  zero and watching it come back to one.

### 6.8 Sagittarius, Capricorn and Aquarius, the eighth through tenth

The ladder is exact at every checkpoint on all three. Sagittarius: *Golden Arrow* 2d6 → 20d6; *Infinity
Break* 12d6 → 20d6 down a mile-long line; *Chiron's Light Impulse*'s bonus force 1d6 → 8d6, its fly Speed
reaching the target's own from 14th. Capricorn: *Excalibur*'s deadly die stepping to d12 at 10th and its
bonus slashing arriving at 14th and 18th; *Jumping Stone* 3d8 → 10d8; *Double Excalibur* and *Excalibur: The
Sword That Cuts Everything* both landing their full ladders. Aquarius: *Diamond Dust* 1d8 → 10d8; *Koliço*
3d8 → 10d8 with its rings' Hardness and Hit Points climbing alongside; *Freezing Shield* 6d8 → 10d8 with its
radius growing 20 → 40 feet and its resistance 15 → 35. Everything each Cloth does now happens by itself:

- **Chiron's Light Impulse exists.** It shipped as eight sentences and `rules: []` — no flags at all, so
  casting it rolled a damage link that buffed nobody and did nothing else. It is now a granted buff: +1
  status to attack rolls, growing extra force damage on every attack, a fly Speed of 20 feet reaching the
  target's own at 14th, and — via pf2e's own `SubstituteRoll` rule element, offered as a fortune option the
  player ticks on the roll itself — "treat one attack roll or saving throw as though you had rolled a 10,"
  spent the moment it is used. Verified at 20th: a Strike carries the +1 and the fortune option, and its
  damage breakdown shows the growing extra die.
- **A real off-by-one, caught by the ladder itself and then chased through a false lead.** The extra force
  damage is "an extra 1d6… +1d6 a step," which starts at 1 die, not 0 — the opposite of *Pleiades Nova*'s
  own bonus, which starts at 0 and is exactly why `origin.item.steps` was written to return a bare step
  count in the first place. Substituting that bare count directly gave 7 dice at 7 steps instead of 8. A new
  growth form — `{ base, perStep }`, resolved by the same arithmetic `Mavros Eruption Clast`'s lingering fire
  already used for a formula outside `system.damage` — replaces every bare `origin.item.steps` diceNumber
  substitution and is now the correct way to say "starts at N, not zero." *This is also the fix that cost
  the most time to land*: rebuilding the pack after the first attempt still showed the old number, because
  the test knight's own granted copy of the Technique — not the pack, not the running scripts — was the
  stale thing. Every content-only fix in this pass needed the actor rebuilt from nothing to actually take
  effect at the table, which this document has said before and is worth saying again.
- **Golden Arrow's Zenith reach tracks Golden Arrow, not itself.** "Golden Arrow's damage, plus an
  additional 8 dice" is granted as its own action, `Golden Arrow: Named Shot`, because a Zenith capstone
  that ignores line of effect through any barrier is not a spell attack this module can force through
  pf2e's own targeting — it is a straight, unmissable hit. The action itself carries no rank of its own, so
  `perStep` growth — which reads *this* item's rank — silently doubled the sky's bonus: a flat "10d6" meant
  to already be Golden Arrow's Zenith total was scaled a second time by the Zenith's own four steps, giving
  38 dice where 28 was correct. A new resolvable, `origin.technique.<name>.damage`, looks up Golden Arrow by
  name on the origin actor and computes *its own* current total — rank and sky both — with the flat 8 dice
  added afterward, once, never scaling again. Verified at 20th: no sky, `10d6 + 8d6`; Zenith, `28d6 + 8d6`
  — the base tracking Golden Arrow's own 9 rank steps and 4 Zenith steps exactly, the 8 unmoving either way.
  Range and detection past a target on the current scene are what the mechanism can reach; naming a
  creature nobody has placed anywhere is recorded as a limit, not built around.
- **A choice nested inside a volley could be posted but never taken.** *Double Excalibur*'s "if both hit,
  Fortitude or severed" needed a way to ask "did every Strike in this volley land," which no rider shape
  had — a new `onAllHit` follow-up on `strikes`, fired once against whichever target the volley was aimed
  at, only when every Strike hit. The card it posts is a `choice`, exactly like *The Sharpest Sword*'s own
  crit-sever — except every choice card the content had wrapped one built until now sat at the *top level*
  of an item's riders, and `applyChoice`'s re-lookup — a bare array index, because a relay payload should
  never carry the rider itself — could only ever re-find a top-level rider. The card posted correctly, since
  posting is handed the rider directly; clicking it silently found the outer `strikes` rider instead and did
  nothing. A rider's address is a path now — `riderAt(item, [0, "onAllHit", 0])` — general enough to reach
  into a `save`'s own nested riders or a volley's `onHit`/`onMiss` the same way, with a bare number still
  meaning exactly what it always did. A second bug sat behind the first and only showed once the address was
  fixed: the choice card's `targetUuid` was read from the *outer* context — the volley's own `self` pass,
  which belongs to the caster — so the sever, once findable, landed on the Saint instead of the creature two
  Strikes had just hit. `target`/`actor` now travel with the choice entry from the moment it is queued rather
  than being re-read from whichever context happens to be present when the card is finally posted. Verified
  live: two hits, a failed save, and *Effect: Severed (Limb)* on the creature — not on the Saint, who kept
  nothing but the flight buff already on their sheet.
- **Koliço's rings and Freezing Coffin's ice are real objects now, not sentences about them.** "The rings
  have Hardness 8, HP 30, and shatter if destroyed" described something that existed nowhere Foundry could
  find it — nothing could ever attack it, and nothing ever shattered. A new `encasement` rider raises a real
  hazard, sized and positioned on the captive, and grants a custom Escape action where the guide states a DC
  neither `immobilized` nor `petrified` carries natively; destroying the hazard — by damage, or by the
  Escape check succeeding — clears the conditions it caused and removes itself. Koliço's rings grow with the
  Technique, `+2` Hardness and `+10` Hit Points a step, computed the same way a rider's damage grows outside
  `system.damage`; the coffin does not, matching the guide's own silence on it heightening. Escape is
  Athletics against the Cosmo DC — the guide never names a skill, and this is the nearest reading of
  physically breaking a shell. Verified live: rings raised at Hardness 22 / 100 HP at 20th (8 + 2×7,
  30 + 10×7), a failed Escape leaves the creature exactly as caught, and reducing either hazard to 0 frees
  its captive, deletes the Escape action, and removes the hazard from the board — the coffin, correctly,
  grants no Escape at all, since a petrified creature cannot act to attempt one.
- **Freezing Shield's dome finally ticks.** pf2e's own `Aura` rule element does the geometry — it already
  grants a named effect to anyone who enters or ends a turn inside — but its schema's own `save` field is
  discarded the moment the aura is built, so "6d8 cold, basic Fortitude" was never going to come out of it
  unassisted. A new event, `aura-tick`, and a generic, content-free marker — `Effect: Aura Tick` — turn every
  grant of that marker into a rider application: the module reads which of the Saint's own effects is
  carrying the tick, applies it, and deletes the marker so pf2e is free to grant it again next turn. One
  real bug turned up finding this: `Actor#getActiveTokens` hands back the `TokenDocument` itself, not a
  canvas placeable, and reading `.document.uuid` off it threw an error nothing caught — the marker was
  granted, read, and quietly deleted, and the tick it was supposed to carry never left the client. A second,
  smaller one followed once the first was fixed: a condition applied by a repeating event with no message to
  key a receipt on had no way to tell "already standing" from "apply again," so three ticks in a row left
  three copies of *Freezing Shield: Slowed 1* on the same creature. A durationed condition grant now checks
  for a standing one from the same rider first and refreshes its clock instead of creating another. Verified
  live through pf2e's own movement-triggered check, not a synthetic call: dragging a creature into a 40-foot
  dome dealt `10d8` cold, applied one `slowed 1`, and ticking the same creature three times running left
  exactly one copy of it.
- **The Sharpest Sword fires itself.** Every critical unarmed hit used to be a `Note` on the Cloth and
  nothing else — the automation the rest of Capricorn already had never reached its own passive. It is now a
  `strike-resolved` rider offering the same sever choice *Double Excalibur* and *Excalibur: The Sword That
  Cuts Everything* already use, so a critical hit anywhere in a fight, not just inside a named Technique,
  costs the target a limb, a sense or a natural attack.
- **Excalibur's own ladder was missing outright.** "At 10th level the deadly die becomes d12; at 14th and
  18th, +1d6 slashing" had nowhere to live — the granted effect carried a fixed deadly-d10 and nothing else,
  at any level. Fixed the same way Virgo's caster-level ladders are: a level-keyed substitution on the deadly
  trait itself (`deadly-d10` until 10th, `deadly-d12` after) and a `DamageDice` rule whose count follows the
  same two thresholds. Verified across the checkpoints above.
- **Excalibur cuts everyone but its own Saint.** Every day of the class's existence, unarmed Strikes were a
  flat d10 deadly die, and the class guide's headline promise — a Sword Saint's blade sharpening as they
  grow — never once moved. Recorded here rather than folded silently into the ladder line above, because it
  is the same shape of defect as Cosmo Strike's original d4 fist: invisible unless someone sat down and
  asked what the number was *supposed* to be at 15th level, and not before.
- **Sever's frequency is real; what it undoes stays the table's.** "Once per turn per creature" is two
  limits, and pf2e's own frequency tracking only expresses one — `Sever` is capped once per turn, flat,
  which is the closest an item-level counter can state honestly. The reaction firing on its trigger and
  actually voiding an attack or a spell already in motion is the same limit Titan's Stance's retargeting
  already recorded: Foundry has no hook that lets a third party take over as the target of, or cancel, a
  resolution already under way. The action exists, is limited, and is granted; what "no effect" undoes is
  left to the table, in the open, next to the other place this document already says so.
- **Jumping Stone gets a real, if partial, answer.** "If you moved at least 20 feet before the Strike, treat
  the target's AC as 2 lower" needs to know how far a Stride travelled before an attack that is part of the
  same activity — a fact this module has no way to read back from a movement already taken. A toggle on the
  Technique itself, set by the player before they roll, turns the +2 circumstance bonus into a real modifier
  rather than a line to remember; the difficult-terrain and 20-foot-gap clauses of the same sentence remain
  the table's to adjudicate, for the same reason.

### 6.9 Pisces, the eleventh

The ladder is exact at every checkpoint: *Piranha Rose* 1d8 → 10d8 slashing, its persistent bleed on a
separate named-level ladder of its own, 1d6 → 4d6 at 9th/13th/17th; *Royal Demon Rose* 3d8 growing 1d8 a
step, its own ground tick now paying that growth once at cast time; *Crimson Fog* 6d8 → 10d8 alongside its
own persistent bleed 3d6 → 5d6; *Royal Funeral* 16d6 → 24d6 under Ascendant.
Pisces turned out to be the smallest Cloth by Technique count and the largest by how much of it was never
actually running — three of its four Techniques had a load-bearing clause that either fired once instead of
every turn, or never fired at all. Everything below is now built and verified live, not synthetically:

- **Piranha Rose's persistent bleed used pf2e's basic-save halving, which is not what "negates" means.**
  The guide reads "A successful save negates the persistent damage" — a special case, called out because it
  is *not* what a basic save ordinarily does. A basic save halves every damage instance in `system.damage`
  on a success, including a persistent one, and halving a persistent condition does not remove it — it
  leaves a smaller bleed still ticking every round. The persistent part is off the spell entirely now and
  lives as a `persistent-damage` rider on `failure`/`criticalFailure` alone, so a success genuinely negates
  it rather than merely shrinking it. Its "+1d6 at 9th, 13th and 17th level" ladder is a named-level
  threshold, not a per-heightening-step one — the same distinction Virgo's caster-level ladders already
  needed — so `persistent-damage` (and `damage`) riders gained the ability to take the same `{ base, at }`
  object a substitution already could, resolved through the same `resolveFromOrigin`. Verified live: a
  success left the dummy with no persistent-damage condition at all; a failure at 20th applied exactly
  `4d6` bleed.
- **Royal Demon Rose's own tick had never once fired.** "Any creature that starts its turn in the area must
  attempt a Fortitude save" is the entire Technique — there is no separate cast-time effect — and nothing in
  the content asked pf2e to re-roll a save every turn for a burst that persists a full minute, because
  pf2e does not do that on its own. The two condition riders that existed sat on `save-rolled`, an event a
  Technique with no cast-time save can never earn; the 3d8 damage the guide states had no rider applying it
  at all, on any outcome, ever. This needed a real capability the lingering-area machinery did not have:
  Gemini's difficult terrain and Cancer's burning ground both apply a flat, unconditional effect on entry or
  turn-end, and Pisces needed a *save* with its own outcome ladder run from a patch of ground instead of an
  actor's sheet. `applySave`'s body is now the exported `runSave(spec, context)`, and `Lingering`'s Region
  behavior gained a second branch: when the ground's payload carries a `save` instead of a flat `damage`, it
  rolls that save directly against the creature standing on it and dispatches nested `damage`/`condition`
  riders exactly as a Technique's own save rider would, including the level ladder above scaled once at cast
  time via a new `scaledSave` (the same `growByStep` arithmetic `scaledDamage` already used for Mavros'
  burning ground, generalised to reach into a save's own nested formula). The event is `tokenTurnStart`
  alone, matching "starts its turn," not the enter-or-end pairing the burning-ground Techniques use. A guard
  — flat enfeebled 1 rather than a stack per failed turn — keeps the condition from climbing indefinitely
  over the full minute, the same shape the Ascendant Boon already needed for its own identical wording, on
  the reading that "enfeebled 1" repeated is the same fact restated, not fifteen new facts. Verified live
  through four repeated turn-starts against a real actor: independent `3d8` poison rolls landed each time,
  enfeebled held at 1 across every one of them rather than climbing, and stupefied 2 arrived on the run that
  rolled a critical failure and stayed at 2 on the next rather than refreshing to a second copy. Grown
  separately: a `steps: 2` construction of the same Region produced `5d8` — the formula's own heightening
  ladder, paid once at the moment the ground was set down, exactly like the ground it stands beside.
- **A real bug found only by calling the new code, not by reading it.** The first draft of the save-tick
  branch built a name-and-uuid stand-in for `context.item`, on the reasoning that a patch of ground has no
  real item on anyone's sheet the way an aura-tick's marker does. `statistic.roll()` disagreed: somewhere in
  its own pipeline pf2e calls `.isOfType` on whatever `item` it was handed, which a plain object does not
  have, and the save died before it ever rolled — silently, since nothing awaited the region-event handler
  that called it. `payload.itemUuid` is already the *owned* Technique's own uuid — written into the ground
  at the moment it is aimed, in `Lingering.createOne` — so the fix is to resolve the real item with
  `fromUuid` rather than describe it. See §8.
- **Crimson Fog's difficult terrain is real now; its mutual concealment is a recorded limitation, not a
  silent one.** "The area fills with crimson petals for 1 minute: it is difficult terrain" is the same
  `lingering.difficultTerrain` flag Galaxian Explosion already proved, and nothing new was needed to build
  it — verified by constructing the Region directly and reading back a real `modifyMovementCost` behavior
  at cost 2. "Creatures inside are concealed from anyone outside and vice versa, you and your allies ignore
  both" is a different shape of problem: pf2e's concealed condition is a fact about one creature, not a fact
  about a *pair* of creatures on opposite sides of a boundary, and nothing in the engine — Region events,
  roll options, or otherwise — currently expresses "concealed from X but not from Y, depending on where X
  and Y each stand." Building it honestly would mean hooking the attack-roll pipeline itself to test both
  combatants' positions against the region and against the caster's alliance list on every roll, which is a
  new subsystem rather than a rider. It stays manual, called out here rather than assumed fixed alongside
  the terrain it shares a sentence with.
- **Royal Funeral's critical failure was a whisper for a class capstone that says "the target dies."** The
  same conversion three other Cloths already proved — `type: "death"` in place of a `prompt` — closes it the
  same way Scorpio's *Antares* and Cancer's *Sekishiki Tenryū Ha* did.
- **Royal Funeral's damage was never scaled by degree of success at all**, on either outcome — a defect
  §7.5 already named and left for this pass. `defense.save.basic: false` means pf2e rolls the damage and
  stops; nothing was applying it on a failure, and nothing was halving it on a success, so every casting
  either did the full 16d6-plus-heightening to everyone regardless of their save or, since no rider existed
  before this pass at all, nothing whatsoever. Fixed the way *Sekishiki Tenryū Ha* already was: the damage
  comes off the spell (`system.damage: {}`), the sky's own `DamageDice` rules come off with it, and two
  `damage` riders carry the ladder — half on a success (`multiplier: 0.5`), full on a failure or a critical
  failure — each growing `2d6` a heightening step through the same `perStep` a bare `system.damage` will
  never scale on its own. Verified live: the exact roll formulas pf2e produced were
  `(16d6 + 8d6) * 0.5 poison` on a success and `16d6 + 8d6 poison` on a failure, the `+8d6` being four
  heightening steps — two from the character's own rank, two more from the Ascendant sky lit at the time —
  landing once, not twice.
- **Royal Funeral's "Special" — knowing the target's exact Hit Points until the encounter ends — did not
  exist.** Cancer's *readout* apply type already solved "tell the Saint something true," but only as a
  range scan naming everyone nearby; this is one named creature, watched continuously, which needed the
  readout to be told *who* rather than *how far*. The save rider that fires on every outcome (unconditional,
  since the guide's Special does not depend on the roll) now grants a new **Effect: Rose-Marked** onto the
  caster, `duration: { unit: "encounter" }` so it clears itself the moment the fight does, carrying the
  marked creature's own token uuid in its flags. That uuid has to survive the same `self`-rider context
  swap Cancer's healing needed watching for once already (§6.6) — the token a `self` rider lands on becomes
  the caster's own the moment `targetsFor` resolves it, which is correct for where the effect is granted and
  wrong for who it is about, so `applyToTarget` now carries the event's original target forward as
  `eventTarget` alongside the swapped one, read once at grant time and never again. The marker's own
  `turn-start` rider re-reads the same creature at the start of every one of the Saint's turns for the rest
  of the encounter. Verified live: the grant posted "D1 is at 120 / 120 Hit Points" the instant Royal Funeral
  was cast; after damaging the dummy to 77 outside the rider entirely, the very next simulated turn-start
  correctly reported "D1 is at 77 / 120 Hit Points" — the same creature, read fresh, not a stale snapshot.
- ***Bloody Rose* did not exist as an ability — it was eight sentences of description and an empty
  `rules: []`, granted by the Zenith Boon and doing nothing when used.** Built on the exact pattern *Aurora
  Execution* already proved for a granted action with a save: `frequency: { max: 1, per: "PT1M" }`, an
  `action-used` rider rolling Fortitude against the Cosmo DC, a `failure` branch for the 10d6 poison and
  enfeebled 2, and a `criticalFailure` branch that is a real `death` rider, matching the same three-Cloth
  precedent Royal Funeral's own critical failure just joined. Verified live under a Zenith sky: granted only
  then, not under an Ascendant one; a failed save dealt 31 poison damage and enfeebled 2; a critical failure
  killed outright.
- **The Cloth passive's touch/melee poison predicate still does not exclude reach weapons.** The guide says
  "an unarmed or non-reach melee attack"; the predicate catches every melee attack, reach included, with an
  in-line note from an earlier pass already owning the gap — "Reach weapons should not trigger this; the
  roses cannot tell." A rider predicate has no roll option distinguishing a reach weapon from an ordinary
  one to test against, the same category of limit Crimson Fog's concealment hit above. Left as recorded
  rather than re-litigated, since nothing changed to make it answerable this pass.
- **The Ascendant and Zenith Boons themselves needed no fix** — their own per-turn emanation (10 feet,
  4d6 poison and enfeebled 1 to a cap of 4, on the Zenith 15 feet and 8d6) was already built as a
  `turn-end` rider carrying its own `area`, the same shape Freezing Shield's dome proved in the
  Sagittarius/Capricorn/Aquarius pass. Re-verified live here for completeness rather than found broken:
  a real `turn-end` firing dealt poison damage and enfeebled 1 to a dummy standing in the emanation.

**Pisces is finished.**

---

## 7. What remains

### 7.1 One whisper still to convert

Down from twelve: Scorpio's death (both thresholds), Leo's action economy, Scorpio's rune-stripping, and
Virgo's reaction denial and *Crimson Mirage* concealment are done — see §6.7. Two more closed in the
Sagittarius/Capricorn/Aquarius pass without ever touching the banishment register at all: *Rikudō Rinne*
keeps the body on the board, so a locked stun reads it correctly, and *Freezing Coffin*'s ice is the same
shape — an attackable object sitting right where the creature stood, not a trip off the map — which is what
the new `encasement` machinery is for (§6.8). Both original categorisations were wrong in the same
direction, and both are corrected here rather than left standing. What is left is one Cloth's forced
movement, not walked yet:

- **Forced movement** — Libra's 30-foot launch. The `teleport` type handles it; the launch is *vertical*,
  which a top-down grid cannot express, so it should probably become a 30-foot displacement plus prone on
  landing.

Pisces' *Royal Funeral* — the other entry this section used to carry — is now converted; see §6.9. The
`death` type is proven on four Cloths as of this pass. The banishment register itself — built for *Another
Dimension*, meant to take a token off the board and put an identical one back — has found no second user in
four Cloths since. It stays built, on the chance a later Cloth needs exactly that and not an encasement.

### 7.2 The seven Techniques modelled as spell damage — route (b) chosen and built

*Pleiades Nova*, *Lightning Plasma*, *Crimson Flurry*, *Jumping Stone*, *Double Excalibur*, *Rozan Ryū Hi
Shō* and *Chiron's Light Impulse* say "make N unarmed Strikes" but are authored with a damage block and no
defence, which pf2e reads as one spell attack roll followed by one damage roll. Hence three separate
symptoms from one cause: only one attack happens, heightening scales the roll rather than each Strike, and
there is no multiple attack penalty to manage.

This is a design decision, not a defect, and it is now **the only thing standing between Taurus and a
finished Cloth** — so it needs deciding rather than deferring. Walking *Pleiades Nova* produced the
concrete constraints:

- pf2e's `AttackRollParams` accepts `target` and `options` but **no `modifiers`**, so the "cumulative −1
  per Strike" cannot be passed to the roll. It has to come from predicated `FlatModifier`s on a temporary
  effect, with the module passing a roll option (`pleiades-nova:2`, `:3`, …) per Strike.
- Rolling from `variants[0]` every time gives "your multiple attack penalty does not increase" for free.
- "Ranged unarmed Strike" is not expressible as an item alteration; the damage type is (*Effect:
  Excalibur* already overrides one), but melee→ranged is not. The 60-foot reach is already enforced by
  the Technique's own area targeting, so this is cosmetic rather than mechanical.
- "The activity counts as three attacks for your multiple attack penalty" is **not trackable at all** —
  pf2e does not count attacks per turn; the player chooses the variant. This stays a note whichever route
  is taken.
- Architecturally, a `strikes` rider must run **once for the whole cast** and iterate every target, but
  the relay currently sends the GM one request per target. It needs the payload to carry the target list.

**Route (b) was chosen and is built.** A `strikes` apply type now rolls the volley, and *Pleiades Nova* is
the first Technique through it. One cast produces one Strike per confirmed target, each following through
to its own damage or critical roll without a second click.

```
Strike 1  →  no penalty      MAP index 0
Strike 2  →  −1              MAP index 0
Strike 3  →  −2              MAP index 0
Strike 4  →  −3              MAP index 0
Strike 5  →  −4              MAP index 0
damage    →  11d6 + 1 force  (2 × on a critical)
```

That 11d6 is the whole heightening chain agreeing at once: 1d6 from the fist, +7 for the rank steps from
base 3 to 10, +2 for an Ascendant sky, and +1 from the Bull's own "your unarmed Strikes gain +1 damage
die". Nothing in that sum is written in *Pleiades Nova*; it falls out of the parts.

Three details were forced by pf2e rather than chosen:

- The penalty ladder lives on a short-lived `Effect: Pleiades Nova` as six `FlatModifier`s, each predicated
  on a roll option the volley emits per Strike, because `AttackRollParams` will not accept a modifier.
- The damage growth is written into that effect by **substitution** at cast time —
  `origin.item.steps`, a new resolvable that counts rank steps and the sky together.
- Substitutions are now authored as a **list** of `{ path, value }`, never an object keyed by path.
  Foundry expands dotted *keys* into nested objects the first time an item is written to an actor, so the
  old form silently stopped matching the moment a Technique was refreshed onto a sheet. *The Twelve Arms*
  used the same shape and was migrated with it.

Three of the remaining six are now built: *Lightning Plasma* and *Crimson Flurry* went through the same
route in the Leo and Scorpio passes (§6.7), and both needed the same correction *Pleiades Nova* did — a
`count` naming the Technique's own number of Strikes, since the volley otherwise makes one per confirmed
target rather than the number the Technique states. *Jumping Stone*, *Double Excalibur* and *Rozan Ryū Hi
Shō* are a content change each rather than a design question. "Counts as three attacks for your multiple
attack penalty afterward" stays in the text: pf2e does not count a turn's attacks, so nothing can enforce
it.

### 7.3 Written as prose only

Libra's weapon summoning (the weapons exist; the summon action does not work), *Tenpōrin'in*'s immunities,
*Golden Arrow*'s missing area block, and Sagittarius' Zenith range. Of these, Libra is now known to be much
smaller than previously estimated.

Five have come off this list. *Titan's Stance* went in the Taurus pass; *Astral Projection*, *Galaxian
Explosion*'s difficult terrain, *Mavros*' burning ground and *Sekishiki Kisōen*'s healing went in this one.

### 7.3b Titan's Stance, honestly

Its reduction and its immovability are automated (§6.4), but "you interpose yourself and **become the
target instead**" is not, and cannot be: Foundry has no hook that lets a third party take over as the
target of an attack already declared. The GM still retargets. Everything numeric that follows from that
retarget now happens by itself. This is the one place in Taurus where the guide says something the engine
cannot do, and it is recorded here rather than quietly dropped.

### 7.4 One Cloth to re-verify

Aries, Taurus, Gemini, Cancer, Leo, Virgo, Scorpio, Sagittarius, Capricorn, Aquarius and Pisces have been
walked end to end. Libra has not, and the method — build a knight from nothing, level it 1 → 4 → 8 → 12 →
16 → 20, cast everything, check every number against the guide — is still the template. It is also, on the
evidence of §4.8, §4.9, §6.7, §6.8 and §6.9, the only thing that finds this class of defect: three abilities
that could not be cast at all, a Zenith Boon that had never once fired, a volley making one Strike per
confirmed target instead of its own count, a receipt-key collision that ate the caster's own buff, a choice
card whose address only a top-level rider could answer, a token method that hands back a document rather
than a placeable, and — in Pisces — an entire Technique whose defining clause had no mechanism able to fire
it at all, all survived earlier passes because no Cloth walked before them had a Technique of the right
shape.

### 7.5 Eight Techniques whose save ladder pf2e will not apply

pf2e scales damage by degree of success only for a **basic** save, and pf2e-toolbelt gates its automatic
per-target application on the same flag. Eight Techniques remaining in the content pair a *non-basic* save
with a damage block, which means the roll is made and the applying is left to somebody's judgement.

One states "Success: half damage" and is still open: *Koliço* (Aquarius). *Sekishiki Tenryū Ha* (Cancer)
and *Royal Funeral* (Pisces, §6.9) are both fixed now and are the pattern for it: the damage block comes off
the spell, and the ladder is written as riders — half on a success, full on a failure, full again on a
critical failure, because the guide says "as failure" (or, for Royal Funeral, states the same total for
both) and a basic save would double it. The halving is expressed as a multiplier on the total
(`(10d8) * 0.5`) rather than as half the dice, which would be a different distribution.

The trade is one shared roll for a roll per target. That is worth it here: it is the only way to get a
ladder pf2e does not model, and the module already rolls per target for conditional damage elsewhere.

The remaining six have no success clause at all, which is a different question — their damage should
probably reach only the creatures that failed — and belongs to each Cloth's own pass.

### 7.6 Forty-one broken image paths

Re-counted against the running server rather than the filesystem: 41 of 102 distinct icon paths in the packs
return 404. Four of them belonged to Gemini and Cancer and are fixed, so seven documents now show an icon
that exists. The rest render blank and are a cosmetic backlog awaiting a decision on how to source
replacements.

---

## 8. How we verify

Four automated stages run on every change: `validate` checks that each document has the shape pf2e
expects and that the guide's invariants hold; `test:riders` exercises rider selection against the real
content without Foundry; `build` compiles to LevelDB; `check:roundtrip` confirms compiling and extracting
returns byte-identical JSON. None of them runs Foundry, so none of them can prove behaviour — that is the
lesson of §4.2, where every stage was green while twenty riders did nothing.

So each fix is also exercised in a live world, and where a bug is found the test written for it is checked
against the *old* code first, to confirm it fails. The condition-grant tests fail 2 of 132 against the
original; the Attuned Casting tests fail 3 with `got []`.

Traps worth recording, all of which have cost time:

- **Actors hold copies.** A Technique dragged onto a sheet is independent of the pack. Content fixes do
  not reach existing characters until items are refreshed, so a "still broken" result means nothing until
  they are.
- **Compare source data, not prepared data.** A `JSON.stringify` comparison of prepared items reports
  hundreds of false differences and, if acted on, strips flags the sky tracker relies on.
- **NPC tokens are unlinked.** Effects land on the token's actor, not the base actor.
- **`TokenDocument#x` follows the animation.** Read it while a token is sliding and every downstream
  number is wrong. Use `_source`.
- **The build needs the world at Setup**, because Foundry holds a lock on every pack of the active world.
- **Never replace `system.rules` wholesale on an owned item.** pf2e writes a `flag` onto each `GrantItem`
  rule *at grant time*; it does not exist in the pack source. Wiping it makes pf2e recompute the flag,
  append a number to the `itemGrants` key, and never match `grantedId` again — which spams
  *"X already has Y, so it has not been added again"* on **every actor update, forever**. Repairing it
  means rebuilding `flags.pf2e.itemGrants` from `flags.pf2e.grantedBy` on each child.
- **Foundry's `update` merges objects.** Setting `system.damage` to a version with fewer parts leaves the
  old ones behind; the stale key has to be deleted explicitly with `system.damage.-=1`.
- **A `ChoiceSet` blocks a level-up.** *Sky-Reading* prompts at 5th, so any scripted levelling needs a
  resolver watching for open prompts, or it hangs.
- **A receipt is keyed on two targets, not one.** The key used to name only the creature a rider landed on,
  which is fine until a `self` rider rides a per-target event: *Sekishiki Kisōen* heals the caster once per
  creature that fails, and every failure after the first wrote the same key with the same outcome and was
  dropped as a re-application. The Saint healed once no matter how many souls the flames took. The key now
  names the event's target as well as the rider's.
- **`heightening` steps are a fact about the cast, not about the flag.** They used to be reported as zero
  whenever a Technique carried no flag-level heightening block, which *Mavros* does not — its damage and
  area are pf2e's business. The fire it leaves on the ground is not, and sat at 4d6 from 16th to 20th.
- **A behavior's `defineSchema()` is only safe during initialisation.** pf2e's difficult-terrain model
  filters movement actions on two fields being undefined, and by the time a Technique is cast Foundry has
  filled both in on every action — so the list comes back empty and the method throws on it. Read the built
  `schema` instead.
- **`measureMovementPath` does not apply terrain by itself.** The cost only reflects difficult terrain once
  the path has been through `createTerrainMovementPath`, which is what the ruler does when a player drags.
  Measuring the raw waypoints shows the plain distance and makes a working region look broken.
- **An unlinked token is not a snapshot.** Foundry re-derives its actor from the *live* base actor on every
  preparation, so the astral body slumped the moment the Saint it was copied from fell unconscious. Removing
  the items from the token's own actor records the removal in its delta; grants nest, so the walk has to
  follow `flags.pf2e.itemGrants` down more than one level.
- **`Actor#getActiveTokens` returns `TokenDocument`s, not placeables.** There is no `.document` to go one
  step further through — reading `.document.uuid` off the result throws, and nothing near it was wrapped in
  a `try`/`catch` to say so. Found chasing why a granted aura marker was read and deleted correctly but the
  tick it was supposed to carry never reached the relay: the failure was silent because it threw inside an
  `async` hook handler with no caller awaiting it, which Foundry logs nowhere a person is looking.
- **pf2e's `Aura` rule element discards its own `save` field at build time.** The schema accepts
  `effects[].save: { type, dc }`, which reads like exactly the hook a Cloth's persistent dome needs — and
  `#processEffects` sets it to `null` on every entry before the aura is ever registered. The rule can grant
  a named effect on entry or turn-end; it cannot roll a save or deal damage, ever, no matter how the schema
  is filled in. Reaching a save from an aura tick has to go through the module's own event, not the rule's.
- **A repeatable rider needs its own dedup when there is no message to key one on.** The receipt system
  guards every other event, keyed on the chat message a cast or a Strike produced — but `aura-tick` has no
  message, by design, since the damage genuinely should re-roll every time a creature stands in a lit dome.
  A *durationed condition* riding the same event does not want that: without its own check, three ticks
  left three copies of the same one-round `slowed`. A condition grant now looks for a standing one from the
  same rider before creating a second.
- **A rider's address is not always a bare number.** `applyChoice` re-finds the rider a button belongs to by
  address rather than trusting the client to send it, which is the right call — but every choice card ever
  authored happened to sit at an item's top level, so a flat array index was never wrong until one didn't.
  A choice nested inside a `strikes` rider's `onAllHit` posted correctly, because posting is handed the
  rider directly, and clicking it silently re-found the *outer* rider instead, because the address had
  nowhere to say "and then two steps further in."
- **A basic save halves *every* damage instance, including a persistent one, and halving a persistent
  condition is not the same as negating it.** "Success negates the persistent damage" reads like ordinary
  basic-save prose and is not: an ordinary basic save would leave a smaller bleed still ticking, not none at
  all. The persistent part has to come off `system.damage` and become a rider gated to failure and worse,
  the same move already made for a *non-basic* save's damage (§7.5) but for a different reason — here pf2e's
  own scaling is the thing being avoided, not its absence.
- **A stand-in `item` for a function that ends in `statistic.roll()` is not safe, even when nothing in the
  module's own code reads more than its name and uuid.** pf2e's own roll pipeline calls `.isOfType` on
  whatever `item` it is handed, and a plain object does not have one — the call throws before the save is
  ever rolled, silently, because nothing awaits the region-event handler that made it. The fix is always to
  resolve the real Item Foundry already knows about (`fromUuid` on an owned item's own uuid) rather than
  describe a shape that merely looks like one; a name and a uuid are enough for *this* module's own code and
  not enough for the system's.

---

## 9. What "done" looks like

The class guide is the specification, so the definition of done is mechanical: for each of the twelve
Cloths, a Saint built from nothing and levelled to 20 can cast every Technique, receive every Boon, and
see every sentence of the guide happen at the table without the GM applying anything by hand. No prompts
remain in the content. Every number the guide states — damage, area, range, duration, frequency,
threshold — matches what the sheet and the chat card produce, at every rank and under all three skies.

Eleven Cloths are now finished to that standard end to end, with nothing outstanding: **Aries**, **Taurus**,
**Gemini**, **Cancer**, **Leo**, **Virgo**, **Scorpio**, **Sagittarius**, **Capricorn**, **Aquarius** and
**Pisces**. One is left, Libra, verified in pieces rather than end to end. One whisper remains, down from
twenty-two, and it is a rider away — the machinery it needs (forced movement) is the one piece already built
and proven that has not yet found a second user.

Five things this pass changed about how the work is understood. The first is that a Cloth pass is still
finding defects that stop an ability working *at all* — four abilities that threw on every cast, a Zenith
Boon that had never once fired, a volley making the wrong number of Strikes, a Cloth passive that had never
once fired despite sitting on the sheet since level 1, a granted action that was eight sentences of
description and nothing else, a Technique whose entire defining clause ("any creature that starts its turn
in the area") had no mechanism in the engine able to fire it at all — and finding them only because a Cloth
of a new shape was walked. The second is that the honest unit of automation is not the Technique but the
sentence: *Astral
Projection* was one item with eight sentences in it, and closing it took a token, an effect, a conditional
origin and a hit-point watcher. The third is that pf2e's own automation has edges the guide walks straight
over, and a non-basic save is one of them; where it stops, the module now carries the ladder itself. The
fourth is that the rider engine itself can still hide a bug for six Cloths and only show it on the seventh:
Virgo's *Tenpōrin'in* was the first Technique to combine a `self` rider with an ordinary buff that also
lands on the caster, and that combination alone exposed a receipt-key collision that had been sitting in
`apply.mjs` since the engine's first draft. Sagittarius through Aquarius did it twice more — a choice card
nested inside a volley's own follow-up was the first of its shape in ten Cloths, and needed both a new
addressing scheme and a second, independent fix to the target it posted to; a persistent aura's own tick was
the first event with nothing to hang a receipt on, and needed its own dedup before a single dome stopped
leaving three copies of the same one-round condition on whatever it caught. Nothing about walking the Cloths
in order could have found any of these sooner; only a Technique of the right shape could, and each shape
showed up exactly once. The fifth, new here, is procedural rather than architectural: a content-only fix —
no script touched — did not reach the table until the test knight itself was deleted and rebuilt from
nothing, twice, before that was believed. "Actors hold copies" has been written down in this document since
the Aries pass; this pass is the one that spent real time re-learning it live rather than trusting the note.

The method is proven, the structural defects that were silently undermining everything else are fixed,
and each Cloth now costs a predictable pass rather than an investigation. The rest is work.

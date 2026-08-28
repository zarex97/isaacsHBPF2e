# The Full Automation Programme

*Status document — what has been done to the Saint, what is being done, and what "done" means.*
*Last updated 28 August 2026 (Taurus pass), against module v99.0.0 (working tree), Foundry 14.364, pf2e 8.3.0.*

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
`action-used`, `damage-applied`, `turn-start`, `turn-end` — and ten apply types: a condition, a
compendium effect, direct damage, persistent damage, a nested save, a death, a choice card, a
**teleport**, a **volley of Strikes**, and a prompt (being eliminated, §5).

Two of those carry extras worth knowing. A `teleport` takes a `distance` in feet and reads it either as a
delta or, with `measure: "from-origin"`, as a destination — which is what "pushed to the end of the line"
means. A `damage` rider takes `perStep`, the growth it gains per heightening step, because a rider sits
outside `system.damage` and pf2e will never scale it otherwise.

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

187 content documents in seven packs: 48 Techniques, 61 feats, 46 effects, 22 actions, 6 weapons, one
class, one Cloth armor. 146 automated checks run without Foundry; validation, build and a round-trip check
run on every change.

### 6.1 Verified end to end in a live world

Capricorn's *Excalibur* (self-rider, strike alterations, duration), Sagittarius' *Aiolos's Wings* (split
self/ally flight, target cap), Leo's demoralize bonus, Virgo's Om counter and its two ceilings, Scorpio's
needle counter and cap, Pisces' roses, and the whole of **Aries** and **Taurus** — every Technique cast
for real, at six character levels from 1 to 20, with every heightening value checked against the guide.

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
no multiple attack penalty, verified live. **Taurus is finished.**

---

## 7. What remains

### 7.1 Eighteen whispers still to convert

Down from twenty-two: Taurus' four are done. Grouped by the machinery each needs:

- **Forced movement** — Libra's 30-foot launch and Cancer's 30-foot drag. Both are now one-line changes
  using the `teleport` type: the drag is `direction: "toward"`, and the launch is vertical, which a
  top-down grid cannot express, so it should probably become a 30-foot displacement plus prone on landing.
- **Death** — Scorpio's *Antares* and both needle thresholds, Pisces' *Royal Funeral*, Cancer's
  conditional death and the Yellow Spring's. A `death` apply type already exists, together with an
  `automateDeath` setting whose default treats monsters and player characters differently. Mostly a matter
  of moving these from prompts onto that type.
- **Banishment and removal from play** — Gemini's *Another Dimension* (1 and 10 minutes), Aquarius'
  *Freezing Coffin*, Virgo's *Rikudō Rinne* (1 and 10 minutes). These need a new mechanism: take the token
  off the board and put it back where it was when the duration ends.
- **Action economy** — Leo's Zenith granting two extra actions. Needs investigation of what pf2e can
  express here.
- **Item alteration** — Scorpio's fourteenth needle stripping a creature's runes.
- **Miscellaneous** — Virgo's reaction denial, Scorpio's *Crimson Mirage* concealment.

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

The remaining six Techniques in this group are now a content change each rather than a design question.
"Counts as three attacks for your multiple attack penalty afterward" stays in the text: pf2e does not
count a turn's attacks, so nothing can enforce it.

### 7.3 Written as prose only

Libra's weapon summoning (the weapons exist; the summon action does not work), *Astral Projection*,
*Galaxian Explosion*'s difficult terrain, *Titan's Stance*, *Tenpōrin'in*'s immunities, *Sekishiki
Kisōen*'s healing, *Golden Arrow*'s missing area block, and Sagittarius' Zenith range. Of these, Libra is
now known to be much smaller than previously estimated.

### 7.3b Titan's Stance, honestly

Its reduction and its immovability are automated (§6.4), but "you interpose yourself and **become the
target instead**" is not, and cannot be: Foundry has no hook that lets a third party take over as the
target of an attack already declared. The GM still retargets. Everything numeric that follows from that
retarget now happens by itself. This is the one place in Taurus where the guide says something the engine
cannot do, and it is recorded here rather than quietly dropped.

### 7.4 Ten Cloths to re-verify

Aries and Taurus have been walked end to end. The condition-grant defect of §4.2 reached ten others, and
none has been re-checked at a table since it was fixed. That is the largest remaining verification task,
and the method — build a knight from nothing, level it 1 → 4 → 8 → 12 → 16 → 20, cast everything, check
every number against the guide — is the template.

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

---

## 9. What "done" looks like

The class guide is the specification, so the definition of done is mechanical: for each of the twelve
Cloths, a Saint built from nothing and levelled to 20 can cast every Technique, receive every Boon, and
see every sentence of the guide happen at the table without the GM applying anything by hand. No prompts
remain in the content. Every number the guide states — damage, area, range, duration, frequency,
threshold — matches what the sheet and the chat card produce, at every rank and under all three skies.

Two Cloths are now finished to that standard end to end, with nothing outstanding: **Aries** and
**Taurus**. Pieces of six others are verified. Eighteen whispers remain, down from twenty-two, and the
RC-4 group is no longer a design question — six Techniques of content work follow the pattern *Pleiades
Nova* now sets.

The method is proven, the structural defects that were silently undermining everything else are fixed,
and each Cloth now costs a predictable pass rather than an investigation. The rest is work.

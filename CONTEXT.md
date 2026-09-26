# Isaac's Homebrew (PF2e)

Two homebrew classes for the Pathfinder 2e system on Foundry VTT — **The Saint** and
**The Soulbound** — and the shared machinery that automates them. Three further classes
(the Stargazer, the Breath Slayer, the Assimilator) exist only as guides in `Docs/` and ship
no content; terms below describe what is built.

## Language

### The Sky

The Sky is **terrain**: a property of the world, not a benefit of any class. It applies to
every creature, the ogre included.

**Sky**:
The world's current day-state — one Sign and one Aspect, plus the days rolled ahead of it.
_Avoid_: using "the sky" as shorthand for the Aspect alone.

**Sign**:
Which constellation is up today. Thirteen exist; twelve have a Cloth and *Starless* has none.

**Aspect**:
The day's energy, orthogonal to the Sign — Quiet, Benefic, Retrograde, Malefic or Exalted.
_Avoid_: aspect as a Soulbound term (that is Lineage); aspect as a Zanka no Tachi term (those are modes).

**Domain**:
The checks a Sign touches while its Aspect is live — Aries initiative, Taurus Fortitude saves and
Athletics, Pisces Will saves. Libra's domain is the die itself rather than a list of checks, and
Starless has none.

**Ascendant**:
A Saint whose Cloth's Sign is today's Sign. A state of a *Saint*, never a value of the Aspect.

**Zenith**:
An Ascendant Saint on a day whose Aspect is Exalted. The strictly better tier.

### The Saint

**Cloth**:
Which of the twelve constellation subclasses a Saint carries.
_Avoid_: Gold Cloth (prose only — the code and the glossary say Cloth).

**Cosmo**:
The Saint's focus tradition: the spellcasting entry, the trait its Techniques carry, and the
class DC they are checked against.

**Severed**:
The condition family Capricorn's Excalibur inflicts — a severed limb, sense or natural attack.
_Avoid_: Severance (a Soulbound state, unrelated).

**Libra's Balance**:
Libra's Cloth ability, which rewrites the first natural 1 rolled each hour.
_Avoid_: "The Balance" unqualified — that is a Soulbound Spirit sharing none of its code.

### The Soulbound

**Reiatsu**:
The Soulbound's focus tradition — entry, trait and class DC. The Soulbound counterpart of Cosmo.

**Lineage**:
What a Soulbound *is*: Soul Reaper, Hollow or Quincy.
_Avoid_: aspect. The roll option `soulbound:aspect:` is a legacy wire spelling, not the term.

**Spirit**:
The named subclass within a Lineage, supplying that character's Released Form, Release
Technique, Refined Release and Full Release.

**Spirit Weapon**:
The weapon a Soulbound's Spirit takes physical form as.
_Avoid_: Zanpakutō (Soul Reaper flavour for the same thing, not a distinct mechanic).

**Release state**:
Which rung of its ladder a Soulbound's Spirit currently sits at: *sealed*, *released*,
*full* or *severance*. Strictly linear — each rung is entered from the one below it.

**Released Form**:
What a Spirit's weapon becomes at the *released* rung, and the statistics that replace the
sealed Spirit Weapon while it lasts.

**Released Form Technique**:
The single signature effect a Spirit supplies alongside its Released Form.
_Avoid_: Release Technique (collides on both words — "Release" is also a state, a rung and an activity).

**Full Release**:
The *full* rung, reached from *released*.
_Avoid_: Bankai, Segunda Etapa, Vollständig — per-Lineage flavour names for the same rung.

**Severance**:
The terminal rung: a ten-round transformation a Soulbound *may reach* from Full Release.
It costs a 20th-level feat, so most characters never have a fourth state even though every
Spirit defines one.
_Avoid_: Final Release (the feat that grants it); Severed (an unrelated Saint condition family).

**Final Release**:
The 20th-level feat that grants Severance. A character never calls it this; they use their
Spirit's own name for it.

**Kidō**:
The Soulbound's demon arts — Hadō, Bakudō and Kaidō. Explicitly not spells.

**Blut**:
The Quincy defence, in its Vene and Arterie forms. Exactly one is active at a time.

**Severing Art**:
The one irreversible attack, unique to each Spirit, that ends Severance when used.

### Authoring vocabulary

**Counter**:
A badge on an effect that counts. Every Charge is a Counter; not every Counter is a Charge
— Scorpio's needles only count.

**Charge**:
A resource an item spends and refreshes on its own schedule, implemented as a Counter.
_Avoid_: charge pool. Pool means the focus pool and nothing else.

**Pool**:
The focus pool — pf2e's own resource, which both Cosmo and Reiatsu spend from.
_Avoid_: using pool for charges, counters or frequency allowances.

**Refuse Death**:
A feature's ability to keep its bearer alive through what would otherwise kill them. One
concept carried as a content flag, not a per-class branch: the Saint's *Eighth Sense —
Arayashiki* and the Soulbound's *Unbroken Chain* are two names for one mechanism.

**Rider**:
Any declarative consequence the module fires from an event — damage, a condition, a prompt,
a teleport, a readout. Authored as data on the item, never as a script.
_Avoid_: defining a rider as "non-damage" or "target-only"; it is neither.

**Event**:
The moment a rider is matched against — a strike resolving, an aura ticking, a save landing.
_Avoid_: trigger (docs-only synonym; the code says event).

**Technique**:
A focus spell belonging to either class — a Saint Technique carries the `cosmo` trait, a
Soulbound one carries `reiatsu`. One concept, two traits; they share the cast pipeline,
area targeting and the rider engine.

**Outcome**:
A degree of success — critical success, success, failure or critical failure. The filter a
rider is written against.
_Avoid_: outcome as a name for roll-rewriting features such as Om or Libra's Balance.

### Verification

**Clause**:
One independently-failable declaration a class guide makes — one thing that can pass or fail
at the table on its own. "Your damage type becomes cold" is a clause; the sentence it comes
from carries two more. Quoted verbatim wherever it is tracked, never paraphrased.
_Avoid_: clause as a name for a guide paragraph or a checklist row; both usually hold several.

**Clause tracker**:
The file in `Docs/clauses/` holding one tier's clauses and the state of each, paired
one-to-one with a GitHub issue of the same scope. Nineteen exist: one for the class, one per
Lineage, one per Spirit.
_Avoid_: checklist — that is the retired row-per-feature file and its findings log.

**Control**:
The paired negative case run beside a clause: the same measurement with the cause removed,
showing the effect gone. Evidence without one is compatible with the mechanism under test doing
nothing at all — a guard that refuses everyone reads exactly like a guard that works.
_Avoid_: control as a synonym for a second observation; it is specifically the one that should fail.

**Drive**:
To make a clause happen in the live world and watch what the table sees, as opposed to reading
the JSON and concluding it would. Takes a clause as its object. Driving a Spirit is shorthand for
driving each of its clauses — a Spirit is not a thing that can pass or fail.
_Avoid_: drive as a synonym for test or run; a unit test is not a drive, and neither is a rig check.

**Finding**:
One root cause, named `SB-<n>`, however many clauses it breaks. The unit a bug issue is
filed against.
_Avoid_: filing one issue per failing clause; a single finding has broken forty-seven at once.

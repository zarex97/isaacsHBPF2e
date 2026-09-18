# The Sky is terrain, not a Saint benefit

The Sky — a Sign and an Aspect per day — shipped as a Saint subsystem: `SkyTracker.applyToAll`
iterates `saints()`, filtered on `class.slug === "saint"`, and the only sky effect items that exist
are the twelve Ascendant and twelve Zenith ones. We have decided the Sky is **terrain**: a property
of the world that applies to every creature, the ogre included. Saints are not the only ones who
feel it; they are the ones whose Cloth wakes to it.

## Considered options

**The Saint's subsystem.** What the code already was, and what was recommended when this was
grilled: it needs no new content, and it keeps the Stargazer — an unbuilt class — from reaching into
a shipped class's code. Rejected because it makes `Shelter of the Cloth` ("allies treat the day's
aspect as one step milder") permanently dead content: it mitigates something that, for everyone but
a Saint, has no mechanical existence.

**Terrain in fiction, Saint-only in mechanics.** The honest status quo. Rejected because it is a
description rather than a decision, and it leaves the contradiction in place for the next reader to
rediscover.

## Consequences

- Benefic, Retrograde and Malefic effect items must be authored. None exist today.
- `applyToAll` loses its `saints()` filter and applies **per token in the active scene**, not per
  actor in the world. A world with hundreds of actors, most of them monsters in unopened folders,
  should not carry sky effects on all of them.
- `Shelter of the Cloth` becomes meaningful and stands unchanged.
- The `exalted` reweighting from weight 0 to 10 is retained, but its justification changes. It was
  made "for the Stargazer (guide v3 §8.2)" — a class with no content in this repo. Under this
  decision it stands on its own terms instead: a sky that is Quiet half the time is a subsystem
  nobody at the table notices. A Zenith is consequently 1 in 130 days for a given Saint, not 1 in
  260, and the GM's ability to schedule one is now a convenience rather than the only path to it.

## Amendment — who the Sky lands on

This ADR said sky effects apply **per token in the active scene**. Triaging #30 surfaced
`Docs/stargazer-guide-v3.md` §8.4, which is more specific: *"It affects everyone… In practice, track
it for PCs and named NPCs only; −1 on a mook is noise."*

Scene scope includes mooks, and Foundry has no mechanical marker for a "named" NPC. So the scope is:
applied automatically to `character`-type actors, with NPCs opting in through an `otherTags` entry —
the same idiom `clothOf` already uses to find a Saint's Cloth by tag rather than by a rule-element
selection.

The rest of this ADR stands. Recorded as an amendment rather than edited into the text above, so a
reader who followed the original scope can see that it changed, and why.

A second point settled in the same triage, which this ADR did not anticipate: **Exalted owes everyone
a domain modifier too.** It previously existed only as the Saint's Zenith trigger, so there are
**four** aspect families to author, not three. A Saint on their own Exalted day receives the Zenith
boon **and** the +2 domain modifier — they stack, at the module owner's direction, against a
recommendation that they should not.

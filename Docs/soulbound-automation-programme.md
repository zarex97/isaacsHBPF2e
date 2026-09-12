# The Soulbound Automation Programme

*Status document — what has been built of the Soulbound, what has been verified at a table, and what
"done" means.*
*Last updated 12 September 2026, against module v99.0.0 (working tree), Foundry 14.364, pf2e 8.4.1.*

---

## 1. What this document is for

`Docs/soulbound-guide-v1.md` (v1.3) is the specification: three Lineages, fifteen Spirits with
four-rung release ladders, sixteen kidō, forty-four feats, and a capstone that takes your powers when
it is done. This document records how much of that prose currently happens by itself at the table.

The standard is the one the Saint's programme already sets: **every sentence in the class guide
should happen by itself.** Not "should be trackable", not "should be reminded about" — should happen.

The design is in `Docs/superpowers/specs/2026-09-12-soulbound-design.md`; each phase's task-by-task
plan is in `Docs/superpowers/plans/`.

---

## 2. Where it sits

Six phases, each gated on `npm test` plus a live pass in world `pf` before the next begins.

| # | Phase | State |
| :-- | :-- | :-- |
| 1 | Chassis | **Done, verified live** |
| 2 | Lineages and kidō | **Done, verified live** |
| 3 | Soul Reaper Spirits | **Done, verified live** |
| 4 | Hollow Spirits | **Done, verified live** |
| 5 | Quincy Spirits | Not started |
| 6 | Feats and Final Release | Not started |

**Counts after Phase 4:** 391 documents across 16 packs (164 of them Soulbound), 310 rider checks, 267
Soulbound checks, round-trip clean.

---

## 3. Phase 1 — the chassis

The class item and its advancement, the spirit weapon, the Reiatsu pool, Rising Pressure, Spirit
Sense, Konsō, Flash Step, Departed Flesh, and the release ladder with no Spirit attached.

### 3.1 Verified live

A Soulbound was built in world `pf` and levelled through **1 / 5 / 9 / 11 / 13 / 17 / 20**, asserting
at each checkpoint: **32 checks, all passing.**

At 20th level: Perception expert, Fortitude and Reflex master, Will expert, **Reiatsu DC master —
not legendary**, simple/martial/unarmed master, light armour and unarmoured expert, exactly one
Reiatsu spellcasting entry, the chosen spirit-weapon profile on the sheet, and the reiatsu ceiling at
3.

Rising Pressure was then driven through a real encounter, and all four of its gates hold:

| Situation | Result |
| :-- | :-- |
| First damage taken in a round | +1 Reiatsu Point |
| Second damage in the same round | nothing |
| Damage while the pool is full | nothing |
| Damage after the per-encounter ceiling is spent | nothing |

The last row is the one guide §1.3 calls load-bearing, and the only one a reader of the JSON cannot
check.

### 3.2 Three bugs found by running it

None of these had a symptom that testing the JSON could have produced.

**The spirit-weapon ChoiceSet offered nothing.** pf2e's `queryCompendium` defaults `itemType` to
`"feat"`, and the four profiles are `weapon` documents, so the filter searched the wrong documents
and opened a prompt with no buttons. An empty ChoiceSet blocks every `await` behind it forever, and
from a scripted driver that reads as a protocol timeout rather than as a dialog. Fixed with
`itemType: "weapon"`. The rig now closes an empty ChoiceSet and reports *why*, so the next one costs
seconds rather than an hour.

**The reiatsu pool could never have worked.** pf2e ships
`Migration889RemoveFocusMaxIncreases`, which strips every `ActiveEffectLike` rule targeting
`system.resources.focus.max` — except for four allow-listed slugs, which are precisely the pf2e class
features whose pattern had been copied. In pf2e 8.x a focus pool's size is **derived**: `+1` per
non-cantrip focus effect known, then clamped to `cap`. The three pool features therefore set **`cap`**
(1 / 2 / 3 by level, on ascending priority), which is the lever the migration leaves open.

> **Superseded in Phase 2 — see §4.2.** This conclusion was half right. `cap` is indeed the lever the
> migration leaves open, but pf2e's derivation counts the focus effects you know, and a Hollow knows
> exactly one costed kidō forever. Setting `cap` alone left the Hollow and the Quincy on a pool of 1
> at 11th level where the guide says 3.

**Rising Pressure never fired.** `updateActor` runs *after* the update is applied, so `actor._source`
already holds the new hit points and the question "was this damage?" was always answered "no". The
old value exists only during `preUpdateActor`, so that is where the question is asked now; the grant
still waits for `updateActor`, because it writes to the same document.

### 3.3 One bug found in the Saint

Building the Soulbound exposed a long-standing fault in the Saint that nobody had noticed.

**Every `Compendium.pf2e.*` reference in the content was dead.** The build rewrites name-based UUIDs
to ids for *this module's* packs only; a foreign pack's names were shipped exactly as written, and
pf2e does not resolve a name-shaped compendium UUID at runtime — `fromUuid` returns `null`, silently,
and the grant does nothing.

The effect on a live 20th-level Saint, confirmed across the 24 in world `pf`:

| Missing | Cost |
| :-- | :-- |
| Alertness | Perception never rises above trained |
| Iron Will | Will never rises above trained |
| Juggernaut | Fortitude never rises to master |
| Evasion | Reflex never rises to master |
| Weapon Specialization | no specialization damage |
| Greater Weapon Specialization | no greater specialization damage |
| *Refocus* (on `Cosmo`) | the Refocus activity was never granted |

`build/lib/pf2e-uuids.json` now snapshots those ids — the same pattern the repo already uses for
`pf2e-traits.json` and `pf2e-iwr.json` — and the build resolves foreign names through it, failing
loudly on an unknown one instead of shipping a dead grant. A build-time test walks the content and
refuses any `Compendium.pf2e.*` name the snapshot does not know.

**This repairs new characters, not existing ones.** A grant is resolved once, at the moment it lands
on a sheet. The 24 Saints already in world `pf` keep the items they were built with; they need
re-levelling, or a repair pass, to pick up the six features. That pass has not been written.

### 3.4 Deliberately incomplete

**Greater Flash Step's DC 5 flat check.** Guide §4.5 says the first attack against you each round
"requires the attacker to succeed at a DC 5 flat check or the attack misses". Pathfinder settles an
attack's outcome before a module can see it, so cancelling a hit afterwards is not something a rule
element or a rider can do — it needs the attack interrupted on the way in. The effect says so in its
own text, and Phase 2's reaction machinery is what closes it. This is the only item in Phase 1 that
does not fully happen by itself.

---

## 4. Phase 2 — the Lineages and the kidō

The Lineage axis and its three branches, all sixteen kidō, Blut, Seal the Art, and the reaction
machinery Phase 1 left a hole for.

### 4.1 Verified live

Three characters — one per Lineage — built in world `pf` and levelled through **1 / 5 / 9 / 11**:
**27/27, 28/28 and 26/26**, no failures and no stuck prompts.

The kidō ceilings of guide §6.6 hold at the table: a Soul Reaper's chosen kidō grow 2 → 3 → 4 across
1st, 5th and 9th, while a Hollow holds Bala and Cero and a Quincy holds Heizen and Gritz, with no way
to add to either.

**Cero cast from a Hollow at 11th level** is the proof the whole kidō design rests on:

| | |
| :-- | :-- |
| Rank | **6** — half the character's level rounded up, as a focus effect should |
| DC | **26**, identical to that character's Reiatsu DC |
| Cost | one Reiatsu Point, spent |
| Card | posted, with Cero as its origin item |

That the entry's DC and the Reiatsu DC are the same number is the load-bearing part: it means
`proficiency.slug = "soulbound"` resolves through the class DC rather than through a spellcasting
proficiency the class does not have.

Area targeting now covers reiatsu effects too — casting Cero with placement enabled put its 60-foot
line on the cursor, which is Phase 1's `isTechnique` change working on live content for the first
time.

### 4.2 The pool: Phase 1's fix was half wrong

Phase 1 concluded that a Soulbound's pool should be expressed as `focus.cap`, because pf2e's
`Migration889RemoveFocusMaxIncreases` strips any rule writing `focus.max`. That much was right. What
was wrong was believing `cap` alone was enough.

pf2e **derives** the pool: `+1` per non-cantrip focus spell known, then clamped to `cap`. For most
classes that is the same thing, because knowing more focus spells is how their pool grows. It is not
the same thing here — and the first character tested was a Soul Reaper, who knows four costed kidō at
11th and so landed on the right pool **by accident**.

A Hollow knows exactly one costed kidō and always will; guide §1.7 is explicit that Bala and Cero are
the whole demon-arts budget. At 11th level the Hollow and the Quincy both sat on a pool of **1** where
the guide says **3**, and no amount of content could have fixed it.

A Soulbound's maximum is now its ceiling, set in a `prepareDerivedData` wrap. Two details the first
version of that wrap got wrong:

- Actors are prepared during `setupGame`, **before** the `setup` hook installs the wrap. A sweep at
  `ready` re-prepares every Soulbound; without it the pool is correct all session *except* immediately
  after a reload, which is the most confusing possible version of the bug.
- `npm run test:riders` pins the exact set of wrapped methods, which caught the new wrap and forced a
  written reason for it.

Verified at 11th: all three Lineages read **0/3**, and the Saint reads 1/3, still deriving its pool
the ordinary way.

### 4.3 Silent no-ops caught before they shipped

Each of these validated, built, and would have done nothing.

- **Bala's `agile`.** Guide §6.4 gives it agile for multiple-attack-penalty purposes. `agile` lives in
  pf2e's `actionTraits`, so the validator accepted it on a spell — but pf2e reads `agile` off a
  **weapon** when computing a Strike's MAP and never looks for it on a spell attack. It is now a
  `MultipleAttackPenalty` rule element, which actually says the number.
- **Regeneración's dying clause**, written `self:condition:dying:0`. pf2e emits
  `self:condition:dying` with no value suffix, so the predicate was never true and the fast healing
  would have been permanently **off** — at a table, indistinguishable from the feature not existing.
- **Kidō Adept's six ChoiceSets.** A `ChoiceSet` resolves once, when the item carrying it is created;
  a `predicate` decides whether it applies at all rather than making it ask again later, and
  `reevaluateOnUpdate` is a `GrantItem` property. Six level-gated ChoiceSets on one feature asked all
  six questions at 1st level and never asked the later four, leaving a Soul Reaper on two kidō
  forever. Each pickup is now its own small feature, granted at its level.
- **Rikujōkōrō's immobilize**, first written as a `GrantItem` of a pf2e condition from inside an
  effect. The uuid guard refused the foreign reference; the condition is now its own rider.

### 4.4 Machinery added

- **`reaction`**, a rider apply type. It lives in `scripts/riders/` rather than `scripts/soulbound/` —
  a deviation from the plan and the right one, since nothing about it is Soulbound-specific and the
  Saint's own reaction Techniques could move onto it unchanged. It mirrors the choice and counteract
  cards down to the trust boundary: the card carries an address, never rider data, so the GM re-reads
  what the ability does and a stale client cannot fire a reaction edited out of the compendium. **The
  offer never blocks** — declining is spelled "ignore the card", because a timer that auto-spent a
  reaction would be worse than not offering, and a modal would stall whoever's turn it is.
- **`flat-check`**, added because it was nearly authored as though it already existed. Three things
  promise "succeed at a DC N flat check or the effect fails" — Greater Flash Step, Kyōka Suigetsu,
  Arrogante — and pf2e offers a module no way to demand one.
- **`lore` as an item type**, because a class cannot train a Lore: `trainedSkills` on a class carries
  only `value` and `additional`, and the `lore` array exists on backgrounds alone.

### 4.5 Phase 1's open item, closed

**Greater Flash Step's DC 5 flat check** is now offered as a reaction at the moment it is owed. pf2e
has still settled the attack roll by then, so a failed check is announced rather than silently
rewriting the hit — but the check happens, in public, without anyone having to remember it. The
effect's own text says exactly that.

### 4.6 Still open

- **Seal the Art's suppression.** Guide §5.3 says a counteracted *release state* is suppressed until
  the end of the target's next turn rather than ended, and that the target cannot re-enter it
  meanwhile. The counteract itself works; the suppression is not yet distinguished, so a counteracted
  release state is removed rather than paused. It lands with the release ladder's final pass, and the
  item's own text says so.
- **Zanjutsu** grants access and a roll option; the technique family itself is Phase 6's, with the
  feats.

---

## 5. Phase 3 — the Soul Reaper Spirits

The Spirit axis, and the five Soul Reaper Spirits with their full ladders: Senbonzakura, Zangetsu,
Hyōrinmaru, Ryūjin Jakka and Kyōka Suigetsu.

### 5.1 Verified live

All five built in world `pf` and checked at 1st level: **20/20 each**, no failures, no stuck prompts.
Hyōrinmaru was then taken to 13th, where **Daiguren Hyōrinmaru** landed with all three petal
techniques — Sennen Hyōrō, Hyōryū Senbi and Zanhyō Ningyō — a fly Speed of 25 and cold resistance 13,
its level.

**The reiatsu pool is non-zero from 1st level for the first time.** Phase 1 predicted this and
couldn't show it: a Release Technique is a costed focus effect, so the moment Spirits existed the pool
stopped reading 0. Senbonzakura then cast at 1st for one point, at rank 1, as a 15-foot emanation for
2d6, leaving its difficult terrain behind.

**The charge pool holds**, with a properly-activated combat:

| Step | Result |
| :-- | :-- |
| Three petal-flowers at the start | 3 |
| Spend one | allowed, 2 left |
| Spend again the same round | **refused** — "already spent this round" |
| Next round, spend | allowed, 1 left |
| Perfected's refresh | back to 3 |
| Over-refresh | clamps at the maximum |

**The mode switch keeps exactly one mode standing.** Gokei, then Senkei replacing it, then a mode the
family does not have refused without disturbing what stood, then cleared to none.

### 5.2 The Spirit axis took its fallback, and the probe is why that was cheap

The design named a chained ChoiceSet filter as the preferred shape and a per-Lineage split as its
fallback, and Task 1 Step 1 was "prove it before five Spirits depend on it". Good thing: a ChoiceSet
stores its selection as a **UUID, not a tag**, so no predicate can join "this Spirit's Lineage" to
"the Lineage you chose". There is no filter that expresses it.

Three per-Lineage choosers instead — `Spirit (Soul Reaper)`, `Spirit (Hollow)`, `Spirit (Quincy)` —
each granted by its own Lineage. Two extra documents, identical at the table, and structurally
incapable of offering a Hollow a zanpakutō. Discovering this after five Spirits were built would have
been a rework of every one.

### 5.3 Authoring corrections the validator caught

- **"The emanation increases to 20 feet at 9th level" is not heightening.** A focus effect heightens
  per *rank*, and `heightening.at` grows only targets, areas, range and length. pf2e's own `area-size`
  ItemAlteration is the lever, and it belongs on **Refined Release** — the feature that grants the
  benefit. That is now the pattern for every Spirit's Refined widening.
- **`bypass` is an array of entries**, in the shape Excalibur already proves.
- **`damage-dice-faces` steps once per `upgrade` and refuses a value** unless the mode is `override`.
  Two steps is two rules — which also says Zanka no Tachi's "two steps instead of one" out loud.
- **`area-size` with a target size needs `override`**, not `upgrade`.

### 5.4 Machinery added

- **`modes.mjs`** — one of N named states, exactly one at a time. Senbonzakura Kageyoshi's Gokei and
  Senkei today; Zanka no Tachi's four cardinal aspects in the same phase; Burner Finger's five fingers
  in Phase 5. `nextMode()` is pure, because two aspects of Zanka no Tachi standing at once is a
  resistance and an immunity the character should not have, with nothing on the sheet to say so.
- **`charges.mjs`** — N of something, spent and regained on a schedule. Storage is an effect's
  **counter badge**, because that is already how this module counts things: Scorpio's needles, Om's
  stacks, and the rider engine's own `stack: true`. The per-round limit is the half that fails
  quietly — three petals with no per-round check is three times the damage the Bankai is costed for.
- **`hypnosis.mjs`** — the one register in the class, because Kyōka Suigetsu is keyed to an event in
  the *observer's* past and no rule element can express a memory. It lives on the Soulbound, outlives
  the encounter and travels between scenes, because canon's clause is about what a creature has seen.

### 5.5 Deliberate, and staying that way

**Ryūjin Jakka's Bankai damages your own party.** Guide §7A is explicit and canon agrees — Yamamoto's
Bankai is a liability to everyone standing near it. Saying so in the targeting (`affects: "all"`,
`includesSelf: false`) is what makes it actually happen rather than sit in prose. The variant for
tables that dislike it — exempt allies, one die step instead of two — is written into the feature's own
text, never into the default content.

**Kyōka Suigetsu's Bankai is invented**, at length, in its own text. Canon gives Aizen none, and the
honest place to say so is on the item somebody reads at the table rather than in a design document.

### 5.6 A test-rig lesson worth keeping

`game.combat` is the combat of the **viewed scene**, and a stale combat left over from an earlier test
is what the charge ledger reads. A spend that should have been allowed came back refused, and the pool
was innocent. Delete old combats before testing anything that keys on the round.

The rig's prompt resolver is also now installable independently of `run()`. It used to be installed
per run and cleared in a `finally` — correct when `run()` finishes, wrong when a scripted driver's
protocol call times out, because the abandoned promise means the `finally` never fires and the next
prompt blocks every subsequent await.

---

## 6. Phase 4 — the Hollow Spirits

Pantera, Murciélago, Arrogante, Los Lobos and Tiburón, each with its full ladder.

### 6.1 Verified live

All five built in world `pf` and checked at 1st level: **20/20 each**, no failures, no stuck prompts.
Each Spirit's replaced weapon arrives with the right statistics — Luz de la Luna at 1d10 piercing,
Gran Caída at 1d12, the pistols at 1d6 with a 60-foot increment, Tiburón's tooth at 1d12 — and
Murciélago's fly Speed and Tiburón's swim Speed both read 25, matching their land Speed.

### 6.2 Sonido had never worked, and the live pass is the only thing that could have shown it

Pantera's Speed came out at 35 where guide §7B says 40. Chasing it turned up something worse: a
**Tiburón — a Hollow with no Speed bonus of its own — read 25**, with "Sonido +5" sitting in Foundry's
breakdown and contributing nothing to the total. The Hollow Lineage's Speed bonus had been inert since
Phase 2, on every Hollow, and both the JSON and the breakdown looked correct.

Two causes, found in order:

1. **A status bonus on the `speed` selector is listed but not counted**, while an untyped one on the
   same selector applies. Sonido is written as a status bonus in the guide; it is authored untyped so
   the five feet actually reach the table, and the feature's own text says why.
2. **Two `FlatModifier`s sharing a label share a slug, and pf2e dedupes modifiers by slug.** Sonido was
   two rules — `+5` below 11th and `+10` from 11th — both labelled "Sonido", so one silently replaced
   the other. It is now one rule whose value scales:
   `ternary(gte(@actor.level,11),10,5)`.

After both, Pantera reads **40**: 25 base, +5 Sonido, +10 Pantera. That is guide §7B's "this stacks
with Sonido", and it had never once been true.

> **A lesson with teeth.** Both bugs produced content that validated, built, and *displayed correctly
> in the breakdown*. Nothing short of reading the final number on a sheet would have caught either.

### 6.3 Both open questions the plan named turned out to be answerable

The plan said to check rather than assume, and both checks came back yes:

- **pf2e's `Resistance` takes an `exceptions` list**, so Murciélago's "resistance to all damage except
  spirit" is exactly expressible. High-Speed Regeneration deliberately does **not** declare a second
  `FastHealing`: two rules would be two separate heals at the start of the turn, which is not what
  "doubles" means.
- **Spell overlays express Cero Metralleta's cone-or-line** as one spell with two shapes, which is what
  they are for.

### 6.4 Validator catches

- **An `action-used` rider may not carry an area**, because it lands on the targets the caster
  confirmed. Lanza del Relámpago's 15-foot burst is therefore the cast's own area, rather than a second
  answer to "who is in it".
- **A `strikes` rider needs a slug `option`** naming its per-Strike roll options. Trident now reuses the
  machinery Pleiades Nova proved.

### 6.5 Still open

**A released form's weapon sits beside the sealed profile rather than replacing it.** Guide §7 says the
spirit weapon "becomes" Luz de la Luna or Gran Caída; Foundry has no notion of one document becoming
another, so the released form grants its own weapon and both are on the sheet, equipped. A
`reconcile` pass in `weapon.mjs` stows the sealed profile whenever a replacement is present — written,
committed, and **not yet taking effect at the table**. Until it does, the table uses the released
weapon and ignores the sealed one. It is cosmetic rather than numeric: every statistic on the released
weapon is correct.

**Canon honesty.** Four of these five Segunda Etapas are invented — Ulquiorra is explicitly the only
Espada who reached one — and each says so at the top of its own text, not in a design document.

---

## 7. Corrections owed to the guide

To be written into `Docs/soulbound-guide-v1.md` as **v1.4** in Phase 6, so the guide and the module
never disagree.

1. **§3.2's feat levels.** The table prints "soul reaper feat" on the even levels beside "soulbound
   feat" at 1/10/20. That is prototype naming from before the class was renamed in v1.1. There is one
   class feat list of eleven: levels 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20.
2. **§4.1's Great Blade.** "1d10 slashing, two-handed, sweep" — pf2e has no `two-handed` trait. A
   weapon that is only ever two-handed says so in `usage`, exactly as pf2e's own greatsword does.
3. **§4.1's Voice in the Blade.** "Saves against effects that would control you, possess you, or force
   you to release your weapon" is not a category Pathfinder models. The automated subset is
   `possession` and `mental` effects plus a GM tag, and the item's text says as much rather than
   promising more than it delivers.
4. **§4.2's pool.** The guide describes a pool of 1/2/3 by level, and that is exactly what it is —
   but Pathfinder derives a focus pool from the effects you know, which would have left a Hollow on a
   pool of 1 forever. The module sets the pool from the level instead. Worth a sentence in the guide
   so nobody "fixes" it back.
5. **§6.4's Bala.** "Agile for the purpose of your multiple attack penalty" is a rule element, not the
   agile trait: Pathfinder reads agile off weapons and ignores it on a spell.
6. **§3.1's Spirit Lore.** A class cannot train a Lore in Pathfinder's data model, so it is granted as
   a Lore item by the 1st-level spiritual package. Same effect, different sentence.
7. **§5.2's Sonido.** Written as a status bonus. A status bonus on the Speed selector is listed in
   Foundry's breakdown but never reaches the total, so it is authored untyped. The number is the
   guide's; only the bonus type differs.
8. **§7A's Refined area widenings.** "The emanation increases to 20 feet at 9th level" is not
   heightening — a focus effect heightens per rank. Every such widening is applied by Refined Release.
9. **§7B's Pantera.** "This stacks with Sonido" only works if the two bonuses are different types and
   carry different labels; pf2e dedupes modifiers by slug, and a label is a slug.

---

## 8. Environment notes

Three things cost real time in this phase and are worth not re-learning.

- **Foundry halts below 1024×768.** A debug Chrome opened at 929px wide left `CONFIG.PF2E` and
  `game.pf2e` undefined and `CONFIG.Actor.documentClass` as core `Actor` — the system never
  initialised. It looks exactly like a module breaking the system. Size the window first.
- **The pack LevelDB is locked while a world is open.** `game.shutDown()` releases it; a POST of
  `{action:"shutdown"}` to `/game` does not.
- **`scripts/**` is served live, `content/**` is not.** Anything under `scripts/` is picked up on F5;
  a content change needs shutdown, `npm run build`, and a relaunch. The test rig was moved out of the
  macro and into `scripts/soulbound/rig.mjs` for exactly this reason — iterating it as a packed macro
  cost a full shutdown-rebuild-relaunch cycle every time.

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

The design is in `Docs/superpowers/specs/2026-09-12-soulbound-design.md`; Phase 1's task-by-task plan
is in `Docs/superpowers/plans/2026-09-12-soulbound-phase-1-chassis.md`.

---

## 2. Where it sits

Six phases, each gated on `npm test` plus a live pass in world `pf` before the next begins.

| # | Phase | State |
| :-- | :-- | :-- |
| 1 | Chassis | **Done, verified live** |
| 2 | Lineages and kidō | Not started |
| 3 | Soul Reaper Spirits | Not started |
| 4 | Hollow Spirits | Not started |
| 5 | Quincy Spirits | Not started |
| 6 | Feats and Final Release | Not started |

**Counts after Phase 1:** 259 documents across 16 packs (32 of them Soulbound), 310 rider checks, 77
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

> **A consequence worth stating plainly.** Until a Spirit grants a Release Technique in Phase 3, a
> Soulbound knows no focus effects and the pool reads **0**. That is correct rather than broken, and
> the class features say so in their own text.

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

## 4. Corrections owed to the guide

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
4. **§4.2's pool.** The guide describes a pool of 1/2/3 by level. In Foundry that is a **ceiling**,
   and the pool's actual size is the number of focus effects known, up to it. The two agree from the
   moment a Spirit is chosen; before that the pool reads 0.

---

## 5. Environment notes

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

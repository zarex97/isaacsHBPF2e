# Soulbound — implementation design

*Spec for building the Soulbound class into `isaacs-hb-pf2e`, the Foundry VTT module that already
carries the Saint. Written 12 September 2026 against module v99.0.0 (working tree), Foundry 14.364,
pf2e 8.4.1.*

---

## 1. Goal and source of truth

`Docs/soulbound-guide-v1.md` (v1.3, 1998 lines) is the specification. This document says how it
becomes a module.

The success criterion is the one the Saint's programme already states: **every sentence in the class
guide should happen by itself at the table.** Not trackable, not reminded about — should happen.
That standard is taken from `Docs/full-automation-programme.md` §1 and from the standing directive
that nothing is to remain a GM whisper. Forced movement, outright death, and the power-loss states
are therefore work items from the start, not deferred judgement calls.

Where implementation reveals text the guide under-specifies, the decision is made here, implemented,
and written back into `Docs/soulbound-guide-v1.md` as **v1.4** with a "What changed in v1.4" section
naming every call — the pattern v1.1 through v1.3 already use. The guide and the module must never
disagree; that disagreement is what `Docs/El Taller de Mu.html` was written to repair, and it cost
55 numbered reports.

### 1.1 Decisions taken before writing this document

| Question | Decision |
| :-- | :-- |
| Reiatsu pool | Reuse pf2e's focus pool through a focus `spellcastingEntry`, exactly as the Saint's Cosmo does |
| Delivery | One branch, one PR, six phases, each gated on `npm test` plus a live pass in world `pf` |
| Live verification | Fifteen scripted characters, one per Spirit, levelled 1→20 through checkpoints |
| Packaging | Nine new `soulbound-*` packs in their own pack folder; module retitled to cover two classes |
| Spec gaps | Decide, implement, write back as guide v1.4 |

---

## 2. Architecture

### 2.1 The choice: extend in place

Three approaches were weighed.

**A — extend the existing engine in place.** The rider engine and area targeting are already almost
class-agnostic: `scripts/riders/sources.mjs` reads riders off any item on any sheet, and
`scripts/targeting/` takes its area from a per-item flag. A grep for Saint coupling in the shared
subsystems returns four sites and no more:

- `scripts/riders/apply.mjs:890,913` — a nested save defaults its statistic to `"saint"`.
- `scripts/riders/apply.mjs:1484` — `dc: "cosmo"` resolves through `getStatistic("saint")`.
- `scripts/targeting/config.mjs:160` — `isTechnique` gates on the `cosmo` trait.

**B — parallel implementation.** A sealed `scripts/soulbound/` duplicating the patterns. No
regression risk to the Saint; two rider engines that drift, and every fix made twice.

**C — extract a core library first.** Refactor `riders/` and `targeting/` into `scripts/core/`.
Cleanest end state, but a large refactor with real regression risk before a line of Soulbound
exists.

**A is chosen.** The four coupling sites become "the origin's class DC" and "`cosmo` or `reiatsu`",
with the old spellings still accepted so no Saint content changes. The Saint's 146 rider checks are
the regression net; they must stay green at every phase gate.

### 2.2 Reused unchanged

| Subsystem | What Soulbound needs it for |
| :-- | :-- |
| `scripts/riders/` | 7 events, 21 apply types, predicate snapshots, receipts and undo. Carries nearly every rider in the guide |
| `scripts/targeting/` | Region placement, aim and re-aim, line of effect, target caps, heightening of range/targets/areas/length |
| `scripts/targeting/lingering.mjs` | Respira's miasma, Senbonzakura's difficult terrain, Ryūjin Jakka's ash, Tiburón's standing water, Burner Finger Five's burning ground |
| `scripts/cast-pipeline.mjs` | Wraps `spellcastingEntry.cast` and an activity's `toMessage` |
| `scripts/riders/bypass.mjs` | Blut Arterie, Cut the Cord, Higashi, Kita, Letzt Stil, and every "ignores all resistances and immunities" Severing Art |
| `scripts/economy/recharge.mjs` | Per-round, per-hour and per-day frequencies |
| `scripts/economy/free-cast.mjs` | Full Release's free Release Technique, Perfected Technique, Letzt Stil's free Licht Regen, Severance's free everything |
| `scripts/deaths.mjs` | Ittō Kasō's cremation, Cero Oscuras: Ceniza's ash, Soul Sever |
| `scripts/lib/` | `degree.mjs`, `roll-options.mjs`, `wrap.mjs` |

### 2.3 Untouched Saint-only code

`sky/`, `cosmo.mjs`, `outcomes/om.mjs`, `outcomes/balance.mjs`, `economy/duplicate.mjs`,
`riders/libra.mjs`, `riders/encasement.mjs`, `targeting/wall.mjs`, `astral.mjs`.

### 2.4 New — `scripts/soulbound/`

Eight modules. Each is registered through the same `start(feature, fn)` isolation wrapper
`scripts/isaacs-hb.mjs` already uses, so one failing feature costs one feature.

**`reiatsu.mjs`** — the pool.

Creates one focus `spellcastingEntry` named "Reiatsu" with `system.proficiency.slug = "soulbound"`,
so its DC and attack resolve through `actor.getStatistic("soulbound")` — the Reiatsu DC — rather
than through a spellcasting proficiency the class does not have. This mirrors `cosmo.mjs` including
its in-flight-promise guard: the entry-creation race that gave every Saint two Cosmo entries will
not be re-introduced.

Rising Pressure is a hook on damage dealt with the spirit weapon and damage taken from an enemy:
once per round, +1 focus point, against a per-encounter ledger held in an actor flag and reset on
combat start. Four things bend it and all four are authored, not special-cased in code: `Reiatsu
Flood` raises the cap by 1, Zanjutsu Mastery and Sklaverei grant points that ignore the cap,
`Rising Tide` attaches temporary Hit Points to the grant, and `Deep Breath` doubles the first
Steady the Breath each day.

**`release.mjs`** — the four-rung state machine.

Sealed → Released (rest of encounter) → Full Release (1 minute, 2 at 17th) → Severance (10 rounds).
Owns the weapon die-step alterations, the pressure emanation and its 10-minute temporary immunity,
the free-cast frequencies each rung grants, the fatigue on exit, "the first Release each encounter
is free", `Sheathed Draw`, and Zangetsu's never-sealed clause.

**`weapon.mjs`** — the spirit weapon.

Four sealed profiles chosen by `ChoiceSet`, granted as a real weapon item. Bonded (manifest or
dismiss as a free action once per round, recall by Interact within 30 feet), Soul-Etched (rune
transfer during daily preparations), Spirit-Cutting (a damage-type toggle plus *ghost touch*), and
the per-Spirit released-form alterations — several of which replace the weapon outright rather than
altering it.

**`charges.mjs`** — one charge pool, three skins.

Hyōrinmaru's three petal-flowers (spend one per round; Perfected Bankai restores one per turn), Los
Lobos' eight wolves (regain one per turn; Aullido expends all), and Gerard's Miracle points (gain 2
per round, cap 10 → 15 at Refined → uncapped at Vollständig, resistance equal to current, spendable
for +1d6 each). Built once because the three differ only in their numbers and their refresh rule.

**`blut.mjs`** — the Quincy toggle.

Vene and Arterie as mutually exclusive free-action effects, once per round, twice with `Blut
Discipline`. Letzt Stil is the single authored exception that allows Vene and its own Arterie-like
clause simultaneously — expressed as a predicate on the exclusivity check, not as a code branch.

**`severance.mjs`** — the ending.

Severance carries a round counter. A Severing Art reads it and rolls `22 − 2 × round` d6, is refused
after round 7, and ends Severance on use whether or not the user wants it to. When Severance ends by
either route, the power-loss state is applied as a real effect that suppresses the Released Form,
the Release Technique, the Full Release and the pool, with a recovery path of a week of downtime.
Letzt Stil's 24-hour version is the same mechanism with a different duration.

**`hypnosis.mjs`** — Kyōka Suigetsu.

A per-observer register: who has seen a Shikai release, what they rolled, and which immunity window
they are in (10 minutes on a success, 24 hours on a critical success, permanent victim on a critical
failure). Needed because the effect is keyed to an event in the observer's past, which no rule
element can express.

**`reactions.mjs`** — the one piece with no Saint precedent.

Eight abilities trigger on someone else's action: Antithesis, The Balance, Zanhyō Ningyō, Danku,
Reiatsu Barrier, Guard the Threshold, Unbroken Chain, The Miracle. The rider engine's
`strike-received` and `damage-applied` events already detect the trigger; what is missing is
offering the reaction to its owner and applying it only if taken. This adds a `reaction` apply type
beside the existing `choice`, whispering a one-button card to the owner with a timeout that declines
by default so an unattended client never stalls a turn.

### 2.5 Three spec facts that shrink the work

- **Burner Finger's five fingers and Cero Metralleta's cone-or-line are pf2e spell variants**
  (`system.overlays`), not separate items.
- **Senbonzakura's Gokei/Senkei and Zanka no Tachi's four cardinal aspects are the same
  "Sustain to switch mode" mechanism**, authored once and reused.
- **`counteract` already exists as a rider apply type** (`apply.mjs:853`), so Seal the Art needs
  content, not code.

---

## 3. Content

### 3.1 The subclass axis

The Saint's pattern is a `ChoiceSet` filtering on `item:tag:saint-cloth` followed by a `GrantItem`
of the selection. Soulbound needs that twice and chained: **Lineage** filtering on
`item:tag:soulbound-lineage`, then **Spirit** filtering on `item:tag:soulbound-spirit` *and* the
Lineage already chosen, so a Hollow is never offered Hyōrinmaru.

**Risk, resolved in phase 1:** whether pf2e resolves an injected earlier selection
(`{item|flags.system.rulesSelections.lineage}`) inside a ChoiceSet filter predicate. This is
verified before fifteen Spirits depend on it. **Fallback:** three separate Spirit features, one per
Lineage, each granted by its Lineage item — more documents, same player experience.

### 3.2 Packs

Nine, in their own pack folder.

| Pack | Holds | Est. |
| :-- | :-- | --: |
| `soulbound-class` | The class item | 1 |
| `soulbound-equipment` | 4 sealed profiles, ~12 released-form weapons, Seele Schneider, the Hakuda fist | ~18 |
| `soulbound-class-features` | Chassis ~24, Lineages ~14, Spirit containers + Released Forms + Full Releases 45, per-Spirit activities ~30, shared actions ~15 | ~128 |
| `soulbound-techniques` | 15 Release Techniques, ~12 Full Release techniques, 15 Severing Arts, 6 Zanjutsu, Licht Regen, Galvano Javelin | ~50 |
| `soulbound-kido` | 6 Hadō, 5 Bakudō, 1 Kaidō, Bala + Cero, Heizen + Gritz | 16 |
| `soulbound-feats` | §8's spine of 44 | 44 |
| `soulbound-effects` | Released forms, full releases, Severance and its Waning counter, Blut, Hierro, Regeneración, hypnosis, three charge pools, Borrowed Nature aspects, pressure immunity, two power-loss states | ~75 |
| `soulbound-journals` | Handbook | 1 |
| `soulbound-macros` | Test rig, Spirit picker, GM tools | ~4 |

**~337 documents**, against the Saint's 187. The phasing exists because of that number.

`module.json` gains the nine pack declarations and a second `packFolders` entry, and its `title` and
`description` change from naming the Saint alone to naming the module's two classes. The `id`
(`isaacs-hb-pf2e`) does not change, because changing it would orphan every existing world's items.

### 3.3 Refined upgrades do not get their own items

"Refined (9th)" modifies an existing Release Technique. Where the change is numeric (a larger
emanation, a better flat check) it is an `ItemAlteration` carried by the `Refined Release` class
feature. Where it adds an option to the same action (Guncho Tsurara's ranged variant, Cero
Metralleta's re-fire) it is a spell variant unlocked by predicate. Only **Licht Regen** and
**Galvano Javelin**, which are genuinely new actions, become separate documents. This keeps each
Technique's text in one place and saves roughly thirteen items.

### 3.4 Naming

The Saint already ships a Libra Technique named *The Balance* and a `scripts/outcomes/balance.mjs`.
Haschwalth's Spirit is also *The Balance*. Every Soulbound document carries a `soulbound-` prefixed
`otherTag`, Soulbound slugs are namespaced (`sb-the-balance`), and no new script file is named
`balance.mjs`.

### 3.5 Homebrew traits

Registered in `module.json` alongside the Saint's: class trait `soulbound`; spell traits `reiatsu`,
`kido`, `destruction`, `binding`, `mending`; feat trait `lineage`. Every one is checked against
`build/lib/pf2e-traits.json` before being declared new — the `twin` weapon trait in particular may
already exist in pf2e 8.4.1 and must not be shadowed.

---

## 4. Validation and the test rig

### 4.1 Build-time invariants

`build/lib/validate-lib.mjs` already enforces the Saint's guide invariants, including an
advancement-table check comparing the class item's grant levels against guide §3. Soulbound gets a
parallel set. These are chosen because each has **no runtime symptom** — the rule quietly does
nothing, or heightens wrong for twenty levels.

- Base rank matches tier: Release Technique 1, Refined 5, Full Release technique 7, Severing Art 10.
- The Waning table is arithmetic, not a list: dice = `22 − 2 × round`, rounds 1–7, refused 8–10.
- Incapacitation present where §7 and §8 require it: Galvano Blast, Galvano Javelin, Ikkotsu,
  Electrocution.
- Every Spirit has exactly four rungs, and its ladder vocabulary matches its Lineage (a Hollow
  Spirit may not carry `shikai`).
- Lineage-gated feats carry a real prerequisite, and `Additional Kidō` is refused to Hollow and
  Quincy — guide §6.6 calls this the hard ceiling.
- Kidō ceiling: 9 for a Soul Reaper who spends three feats, 2 for anyone else.
- Advancement table against guide §3.2.

`npm run test:riders` grows with the new ladders. `check:roundtrip` needs no change.

**When each rule lands.** The Soulbound validator is scaffolded in phase 1 with the rules that guard
phase 1's content (class slug, HP, key attribute, advancement table). Every later rule is added in
the phase whose content it guards — the four-rung Spirit check with the first Spirit, the Waning
table with the first Severing Art. A validator written before the content it checks passes
vacuously, which is worse than not having it, because the build then reports green for a rule that
has never once run.

### 4.2 The live rig

A macro in `soulbound-macros` builds a character for a named Spirit and levels it through
**1 / 5 / 9 / 11 / 13 / 17 / 20**, asserting at each checkpoint. Two facts from prior live sessions
are built in from the first run rather than rediscovered:

- A `PickAThingPrompt` **blocks scripted levelling** and surfaces as an MCP timeout rather than as a
  dialog. The rig installs an interval resolver that scans `foundry.applications.instances`, sets
  `app.selection` from `app.choices` and closes it — and never default-picks a Spirit, because a
  wrong default silently tests the wrong subclass.
- A test actor created as GM defaults to `alliance: "opposition"`, which makes every
  `affects: "enemies"` area catch nothing and silently clear hand-set targets. The rig sets
  `system.details.alliance = "party"` before casting anything.

At each checkpoint it casts every technique, kidō and feat then available and checks dice, area,
riders and heightening. Run across all fifteen Spirits it emits one pass/fail table per Spirit.

### 4.3 Live environment

Foundry serves world `pf`; the module is served from the working tree through a filesystem junction,
so a `scripts/**` change is live on F5 and a `content/**` change needs a return to Setup and a
rebuild. Debugging is driven through the **chrome-devtools MCP** against a dedicated debug Chrome on
port 9222, launched with
`"C:\Program Files\Google\Chrome\Application\chrome.exe" --remote-debugging-port=9222 --user-data-dir="%TEMP%\chrome-foundry-debug"`,
browsing to `http://localhost:30000`. `http://127.0.0.1:9222/json/version` is checked before
assuming the browser is attachable. The GM user in `pf` has no password.

Three standing constraints: the pack LevelDB is **locked while a world is open**, so a rebuild needs
`game.shutDown()` first; `evaluate_script` has a **60-second protocol timeout**, so anything that
opens a dialog fails as a timeout rather than reporting the dialog; and `TokenDocument#x` returns the
**animated** position in Foundry v14, so any distance arithmetic reads `_source.x`.

---

## 5. Phasing

One branch, `claude/soulbound`; one PR at the end. Each phase ends with `npm test` green — the
Saint's checks included — and a live pass in world `pf`, before the next begins.

| # | Phase | Contains | Gate |
| :-- | :-- | :-- | :-- |
| 1 | Chassis | Class item, advancement, spirit weapon and 4 profiles, Reiatsu entry, Rising Pressure, Spirit Sense, Konsō, Flash Step, Departed Flesh, the release state machine with no Spirit attached, the new validators, the shared-code generalisations of §2.1 | A Soulbound levels 1→20 with correct proficiencies; Rising Pressure refills once per round and stops at the cap; the Saint is unchanged |
| 2 | Lineages and kidō | 3 Lineages and their 11 features, all 16 kidō, Blut, Seal the Art, Hierro, Regeneración, **`reactions.mjs`** | One character per Lineage; every kidō cast and its ladder checked; Danku proves the reaction offer |
| 3 | Soul Reaper Spirits | Senbonzakura, Zangetsu, Hyōrinmaru, Ryūjin Jakka, Kyōka Suigetsu | 5 scripted characters, 1→20 |
| 4 | Hollow Spirits | Pantera, Murciélago, Arrogante, Los Lobos, Tiburón | 5 scripted characters, 1→20 |
| 5 | Quincy Spirits | Antithesis, The Heat, The Balance, The Thunderbolt, The Miracle | 5 scripted characters, 1→20 |
| 6 | Feats and Final Release | 44 feats, Borrowed Nature's three Aspects at two tiers, Severance, 15 Severing Arts, the Waning decay, the power-loss states, handbook journal, guide v1.4 | All 15 at 20th fire their Art at rounds 1, 4 and 7 for 20d6 / 14d6 / 8d6 |

**Why the Soul Reapers are third and not last.** They carry the two mechanisms every later phase
reuses: Senbonzakura's Gokei/Senkei mode switch, which Zanka no Tachi's four aspects and Burner
Finger's five fingers reuse, and Hyōrinmaru's petal-flowers, which Los Lobos' wolves and Gerard's
Miracle points reuse. Proving those on five characters is the difference between fixing a pattern
once and fixing it fifteen times.

**Why `reactions.mjs` is in phase 2.** It is the only new machinery with no Saint precedent. Danku
is the first thing that needs it and the cheapest thing to lose. If a whispered reaction card fights
the system, that is better learned with one kidō riding on it than in phase 5 with Antithesis, The
Balance and The Miracle all waiting on the same mechanism.

---

## 6. Risks

| Risk | Mitigation |
| :-- | :-- |
| Chained ChoiceSet does not resolve an earlier selection in a filter predicate | Proven in phase 1 before any Spirit exists; fallback is three per-Lineage Spirit features |
| The reaction offer stalls a turn on an unattended client | The card times out and declines by default; the trigger is already detected, so declining loses nothing but the reaction |
| Generalising `apply.mjs` and `targeting/config.mjs` regresses the Saint | Old spellings (`"saint"`, `"cosmo"`) stay accepted; the Saint's 146 rider checks gate every phase |
| Fifteen scripted level-ups is a very long live session | The rig is one macro parameterised by Spirit; phases 3–5 run five at a time, not fifteen |
| 337 documents is more than one pass can hold | Phase gates; each phase's content is complete and verified before the next begins |
| Ryūjin Jakka's Bankai damages allies | Authored as written. Guide §7A already names the table-side fix (exempt allies, one die step instead of two); it goes in the handbook as a variant, not in the default content |

---

## 7. Out of scope

- The Breath Slayer (`Docs/breath-slayer-guide-v4.md`, `-v5.md`) and the Carapace
  (`Docs/carapace-guide-v1.md`) remain docs-only. This work does not start them, and does not
  refactor shared code in anticipation of them.
- No extraction of `scripts/core/`. Approach C is recorded in §2.1 as the thing to do if a third
  class is ever built on the same engine.
- The Saint's own open items in `Docs/full-automation-programme.md` are not touched.

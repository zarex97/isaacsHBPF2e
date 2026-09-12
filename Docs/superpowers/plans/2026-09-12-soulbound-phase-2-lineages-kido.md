# Soulbound Phase 2 — Lineages and Kidō Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** The three Lineages with their 1st-, 5th- and 15th-level features, all sixteen kidō, the Blut toggle, Seal the Art, and the reaction machinery that Phase 1 left a hole for.

**Architecture:** Lineage is a second `ChoiceSet` axis on the class, granting one of three Lineage items; each Lineage item grants its own features and kidō with level-gated `GrantItem` rules. Kidō are `spell` documents in their own pack, tagged `sb-tier-kido`; the three free cantrips carry pf2e's `cantrip` trait, which is what makes them cost no Reiatsu **and** keeps them out of the derived pool size. The one genuinely new subsystem is `scripts/soulbound/reactions.mjs`, which turns an already-detected rider event into an offer the owner can accept.

**Tech Stack:** Node 22 ESM, the repo's `check()` harness, `@foundryvtt/foundryvtt-cli`, Foundry 14.364, pf2e 8.4.1, chrome-devtools MCP on port 9222.

**Spec:** `Docs/superpowers/specs/2026-09-12-soulbound-design.md` (§2.4, §5 phase 2)

## Global Constraints

Everything in Phase 1's Global Constraints still applies. Added for this phase:

- **The guide is the specification.** `Docs/soulbound-guide-v1.md` §5 (Lineages) and §6 (kidō). Corrections are logged for v1.4, never made silently.
- **Kidō are not spells.** They carry `kido` + `reiatsu` + `focus`, plus exactly one of `destruction` / `binding` / `mending`, and the `sb-tier-kido` otherTag. They use the Reiatsu DC and auto-heighten to half level.
- **The three free cantrips — Shō, Bala, Heizen — carry pf2e's `cantrip` trait.** That is load-bearing twice over: a cantrip costs no focus point, and `prepareActorData` only counts **non-cantrip** focus spells toward the pool's size. Marking them otherwise would both charge for them and inflate the pool.
- **Kidō ceilings (guide §6.6).** Soul Reaper: 6 chosen (1st ×2, 5th, 9th, 13th, 17th) plus Shō. Hollow: Bala + Cero, fixed. Quincy: Heizen + Gritz, fixed. `Additional Kidō` is Soul Reaper only and is Phase 6's.
- **A spell attack is `defense: null` plus the `attack` trait**, as pf2e's own `Fire Ray` and `Hurtling Stone` do it. A save effect carries `defense.save` instead.
- **Level-gated grants use** `GrantItem` with `"predicate": [{"gte": ["self:level", N]}]` and `"reevaluateOnUpdate": true` — the pattern the Saint's Cloths already use.
- **Every foreign `Compendium.pf2e.*` reference must be in `build/lib/pf2e-uuids.json`**, or the build fails. Never author one by name and hope.
- **Damage types** must be in pf2e's dictionary: `spirit` and `void` are real in 8.4.1; check anything else against `build/lib/pf2e-traits.json` before authoring.

---

### Task 1: The Lineage axis and the three Lineage items

**Files:**
- Create: `content/soulbound-class-features/core/lineage.json`
- Create: `content/soulbound-class-features/lineages/soul-reaper.json`, `hollow.json`, `quincy.json`
- Modify: `content/soulbound-class/soulbound.json`, `build/lib/validate-lib.mjs`, `build/test-soulbound.mjs`

**Interfaces:**
- Consumes: the class item (Phase 1).
- Produces: three `feat` items tagged `item:tag:soulbound-lineage` plus `soulbound-lineage-<slug>`; a `Lineage` class feature at level 1 whose ChoiceSet flag is `lineage`. Later tasks predicate on `self:feature:soul-reaper` / `hollow` / `quincy`.

- [ ] **Step 1: Write the failing test**

Append to `build/test-soulbound.mjs`, above `report(...)`:

```js
/* ---------------------------------------------------------------------------------------------- */
/*  The Lineage axis                                                                                */
/* ---------------------------------------------------------------------------------------------- */

function lineageDoc(name) {
    return contentDoc(`soulbound-class-features/lineages/${name}.json`);
}

const lineageFeature = featureDoc("lineage");
const lineageChoice = lineageFeature.system.rules.find((r) => r.key === "ChoiceSet");
check(
    "Lineage is chosen at 1st level from the tagged Lineage items",
    [lineageFeature.system.level.value, lineageChoice?.flag, lineageChoice?.choices?.filter],
    [1, "lineage", ["item:tag:soulbound-lineage"]],
);
check(
    "and the choice is granted",
    lineageFeature.system.rules.some((r) => r.key === "GrantItem" && r.uuid === "{item|flags.system.rulesSelections.lineage}"),
    true,
);

for (const [file, skill] of [["soul-reaper", "society"], ["hollow", "athletics"], ["quincy", "crafting"]]) {
    const doc = lineageDoc(file);
    check(`${file} is tagged for the ChoiceSet`, (doc.system.traits.otherTags ?? []).includes("soulbound-lineage"), true);
    check(`${file} grants its Lineage skill (guide §5)`, doc.system.subfeatures?.proficiencies?.[skill]?.rank, 1);
}
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node build/test-soulbound.mjs
```

Expected: FAIL — `ENOENT ... core/lineage.json`.

- [ ] **Step 3: Write the Lineage class feature**

`content/soulbound-class-features/core/lineage.json`, a level-1 `classfeature` whose rules are:

```json
        "rules": [
            {
                "adjustName": false,
                "choices": { "filter": ["item:tag:soulbound-lineage"] },
                "flag": "lineage",
                "key": "ChoiceSet",
                "prompt": "What are you?"
            },
            { "key": "GrantItem", "uuid": "{item|flags.system.rulesSelections.lineage}" }
        ],
```

`choices.itemType` is **omitted on purpose** here: the Lineage items are `feat` documents, and `queryCompendium` defaults to `"feat"`. Phase 1's spirit-weapon ChoiceSet needed `itemType: "weapon"` precisely because weapons are not the default — do not cargo-cult it onto this one.

Its description carries guide §5's comparison table (what each Lineage buys, what it pays, its release ladder, how it plays).

- [ ] **Step 4: Write the three Lineage items**

Each is a `feat` with `category: "classfeature"`, `level: {value: 1}`, `traits.value: ["soulbound"]`, and `traits.otherTags: ["soulbound-lineage", "soulbound-lineage-<slug>"]`. Each carries its granted skill as a subfeature and grants its own features by level:

| File | Name | Skill | Grants |
| :-- | :-- | :-- | :-- |
| `soul-reaper.json` | Soul Reaper | `society` | Kidō Adept (1), Zanjutsu (5), Zanjutsu Mastery (15) |
| `hollow.json` | Hollow | `athletics` | Hierro and Sonido (1), Cero and Bala (1), Regeneración (5), Segunda Piel (15) |
| `quincy.json` | Quincy | `crafting` | Heilig Bogen and Blut (1), Heizen and Gritz (1), Sealing (5), Sklaverei (15) |

The skill is a subfeature, exactly as Phase 1's proficiency features do it:

```json
        "subfeatures": { "proficiencies": { "society": { "attribute": null, "rank": 1 } } },
```

Level-gated grants use the Saint's Cloth pattern:

```json
            {
                "key": "GrantItem",
                "predicate": [{ "gte": ["self:level", 5] }],
                "reevaluateOnUpdate": true,
                "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Regeneración"
            },
```

**Grant only what Tasks 2–4 actually create.** A `GrantItem` whose target does not exist fails the build, which is the correct behaviour and the reason this task's Lineage items are written *after* their features in practice — write the features first, or add the grants in the task that creates them.

- [ ] **Step 5: Add `Lineage` to the class item and the advancement table**

In `content/soulbound-class/soulbound.json`'s `system.items`:

```json
            "linea": { "img": "icons/magic/symbols/runes-triangle-blue.webp", "level": 1, "name": "Lineage", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Lineage" },
```

and in `build/lib/validate-lib.mjs`'s `SOULBOUND_ADVANCEMENT`, add `"Lineage"` to level 1 and `"Lineage Feature"` is **not** added — guide §3.2 lists "lineage feature" at 5 and "lineage mastery" at 15, but those are granted by the Lineage item rather than by the class, so the class-level table cannot see them. Add instead to level 1 only:

```js
    1: ["Spirit Weapon", "Reiatsu", "Rising Pressure", "Released Form", "Spirit Sense", "Konsō", "Lineage"],
```

- [ ] **Step 6: Run validate and the tests**

```bash
npm run validate && node build/test-soulbound.mjs
```

Expected: both green.

- [ ] **Step 7: Commit**

```bash
git add content build
git commit -m "The Lineage axis: Soul Reaper, Hollow, Quincy

A second ChoiceSet on the class, granting one of three Lineage items,
each of which grants its own features by level with the same
gte-self:level pattern the Saint's Cloths use.

No itemType on this ChoiceSet on purpose: the Lineage items are feats and
queryCompendium already defaults to feat. The spirit weapon needed
itemType only because weapons are not the default.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 2: The Hadō — six kidō of destruction

**Files:**
- Create: `content/soulbound-kido/_folders.json`
- Create: `content/soulbound-kido/hado/sho.json`, `byakurai.json`, `shakkaho.json`, `sokatsui.json`, `soren-sokatsui.json`, `kurohitsugi.json`
- Modify: `build/test-soulbound.mjs`

**Interfaces:**
- Consumes: the `kido` / `destruction` traits (Phase 1), `sb-tier-kido` (Phase 1's validator).
- Produces: six `spell` documents. Task 5 grants them through Kidō Adept's ChoiceSet.

**The table, from guide §6.1.** Every row is authored exactly as printed; where the guide and pf2e disagree on how to *express* something, the expression changes and the numbers do not.

| File | Name | Act. | Rank | Shape / defense | Damage | Heightening |
| :-- | :-- | --: | --: | :-- | :-- | :-- |
| `sho.json` | Shō — Thrust | 1 | 1 | 30 ft, 1 creature, basic Reflex | `1d4` force **+ key attribute** | `+1d4` per 2 |
| `byakurai.json` | Byakurai — Pale Lightning | 1 | 1 | 60 ft, 1 creature, **spell attack** | `2d6` electricity | `+1d6` per 1 |
| `shakkaho.json` | Shakkahō — Crimson Bloom | 2 | 1 | 10-ft burst within 60 ft, basic Reflex | `2d6` fire | `+1d6` per 1 |
| `sokatsui.json` | Sōkatsui — Sundering Wave | 2 | 1 | 30-ft line, basic Reflex | `2d4` spirit | `+1d4` per 1 |
| `soren-sokatsui.json` | Sōren Sōkatsui — Twin Wave | 2 | 5 | 60-ft line, basic Reflex | `7d6` spirit | `+1d6` per 1 |
| `kurohitsugi.json` | Kurohitsugi — Black Coffin | 2 | 8 | 10-ft burst within 60 ft, basic Reflex | `9d6` void | `+1d6` per 1 |

- [ ] **Step 1: Write the failing test**

```js
/* ---------------------------------------------------------------------------------------------- */
/*  Kidō                                                                                            */
/* ---------------------------------------------------------------------------------------------- */

function kidoDoc(way, name) {
    return contentDoc(`soulbound-kido/${way}/${name}.json`);
}

const sho = kidoDoc("hado", "sho");
check(
    "Shō is a cantrip, so it costs no Reiatsu and does not inflate the pool (guide §6)",
    [sho.system.traits.value.includes("cantrip"), sho.system.level.value],
    [true, 1],
);
check("Shō adds the key attribute, being the class's only free filler", sho.system.damage["0"].applyMod, true);

const byakurai = kidoDoc("hado", "byakurai");
check(
    "Byakurai is a spell attack — defense null plus the attack trait, as pf2e's own Fire Ray does it",
    [byakurai.system.defense, byakurai.system.traits.value.includes("attack")],
    [null, true],
);
check("Byakurai is 1 action at 60 feet (guide §6.1)", [byakurai.system.time.value, byakurai.system.range.value], ["1", "60 feet"]);

const kurohitsugi = kidoDoc("hado", "kurohitsugi");
check("Kurohitsugi enters at rank 8 with 9d6 void (guide §6.1)", [kurohitsugi.system.level.value, kurohitsugi.system.damage["0"].formula, kurohitsugi.system.damage["0"].type], [8, "9d6", "void"]);

for (const name of ["sho", "byakurai", "shakkaho", "sokatsui", "soren-sokatsui", "kurohitsugi"]) {
    const doc = kidoDoc("hado", name);
    const traits = doc.system.traits.value;
    check(`${name}: carries kidō, reiatsu, focus and destruction`, [
        traits.includes("kido"), traits.includes("reiatsu"), traits.includes("focus"), traits.includes("destruction"),
    ], [true, true, true, true]);
    check(`${name}: declares its tier`, (doc.system.traits.otherTags ?? []).includes("sb-tier-kido"), true);
}
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node build/test-soulbound.mjs
```

Expected: FAIL — `ENOENT ... soulbound-kido/hado/sho.json`.

- [ ] **Step 3: Write the folders file**

`content/soulbound-kido/_folders.json`:

```json
[
    { "name": "Way of Destruction (Hadō)", "sorting": "m", "type": "Item" },
    { "name": "Way of Binding (Bakudō)", "sorting": "m", "type": "Item" },
    { "name": "Way of Mending (Kaidō)", "sorting": "m", "type": "Item" },
    { "name": "Hollow Arts", "sorting": "m", "type": "Item" },
    { "name": "Quincy Arts (Gintō)", "sorting": "m", "type": "Item" }
]
```

- [ ] **Step 4: Write the six Hadō**

Use Phase 1's Python authoring approach for consistency. Every document follows `content/saint-techniques/slot-1-signature/diamond-dust.json`'s shape, with these differences: `traits.value` is `["focus", "kido", "reiatsu", "soulbound", "destruction", …element…]`, `otherTags` is `["sb-tier-kido", "soulbound-kido-hado"]`, and `publication.title` is `"Isaac's Homebrew: The Soulbound"`.

A save kidō:

```json
        "defense": { "save": { "basic": true, "statistic": "reflex" } },
        "damage": { "0": { "applyMod": false, "category": null, "formula": "2d6", "kinds": ["damage"], "materials": [], "type": "fire" } },
        "heightening": { "area": 0, "damage": { "0": "1d6" }, "interval": 1, "type": "interval" },
```

An attack kidō (Byakurai) instead has `"defense": null` and `"attack"` in `traits.value`.

**Shō is the one with `applyMod: true`** — guide §6.1 says "1d4 + key attribute", and the anchor note explains why: it is the class's only free action-economy filler.

**Sōkatsui's push** ("creatures that fail are pushed 10 feet") is a rider, authored in the flags block the rider engine reads, using the `teleport` apply type that already exists:

```json
    "flags": { "isaacs-hb-pf2e": { "riders": [
        { "outcomes": ["failure", "criticalFailure"],
          "apply": { "type": "teleport", "distance": 10, "direction": "away" } }
    ] } },
```

**Kurohitsugi's immobilize** on a critical failure uses the `condition` apply type with an `escapeDc`:

```json
    "flags": { "isaacs-hb-pf2e": { "riders": [
        { "outcomes": ["criticalFailure"],
          "duration": { "unit": "rounds", "value": 1 },
          "apply": { "type": "condition", "slug": "immobilized", "escapeDc": "reiatsu" } }
    ] } },
```

**Sōren Sōkatsui's persistent fire** on a failure:

```json
        { "outcomes": ["failure", "criticalFailure"],
          "apply": { "type": "persistent-damage", "formula": "1d6", "damageType": "fire" } }
```

Verify each rider shape against `build/lib/validate-lib.mjs`'s `validateRider` before running the build — `teleport` requires `distance`, and `direction` must be one of the values that validator accepts. If `"away"` is not accepted, read the validator and use the spelling it names.

- [ ] **Step 5: Run the tests and validate**

```bash
node build/test-soulbound.mjs && npm run validate
```

Expected: both green. A rider with the wrong shape fails validation by name and line — fix the content, not the validator.

- [ ] **Step 6: Commit**

```bash
git add content build
git commit -m "The Hado: six kido of destruction

Guide §6.1, authored as spells with the kido/reiatsu/destruction traits.
Sho, Bala and Heizen carry pf2e's cantrip trait, which is load-bearing
twice: a cantrip costs no focus point, and prepareActorData counts only
NON-cantrip focus spells toward the pool's size.

Byakurai is a spell attack the way pf2e's own Fire Ray is one — defense
null plus the attack trait, not a defense block.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 3: The Bakudō and the Kaidō

**Files:**
- Create: `content/soulbound-kido/bakudo/sai.json`, `hainawa.json`, `rikujokoro.json`, `danku.json`, `kin.json`
- Create: `content/soulbound-kido/kaido/kaido.json`
- Modify: `build/test-soulbound.mjs`

**Interfaces:**
- Consumes: the `binding` and `mending` traits.
- Produces: six `spell` documents. **Danku is deliberately written last of the five**, because it is a reaction and Task 6 is what makes a reaction work.

**The table, from guide §6.2 and §6.3.**

| File | Name | Act. | Rank | Effect |
| :-- | :-- | --: | --: | :-- |
| `sai.json` | Sai — Restrain | 1 | 1 | 30 ft, 1 creature, Reflex. Failure: immobilized 1 round (Escape vs Reiatsu DC). Crit failure: immobilized 1 minute, new save at end of each turn |
| `hainawa.json` | Hainawa — Crawling Rope | 1 | 1 | 30 ft, 1 creature, Reflex. Failure: −10-ft status penalty to Speeds 1 round, can't Step. Crit failure: as failure and off-guard |
| `rikujokoro.json` | Rikujōkōrō — Six Rods | 2 | 4 | 30 ft, 1 creature, Fortitude. Failure: immobilized and no manipulate actions 1 round. Crit failure: 2 rounds |
| `danku.json` | Danku — Splitting Void | R | 1 | **Reaction.** Trigger: you or an ally within 15 ft would take damage from a ranged attack, a spell, or an area effect. Effect: that target gains resistance equal to your level to the triggering damage |
| `kin.json` | Kin — Silence the Chain | 2 | 5 | 30 ft, 1 creature, Will. Failure: stupefied 2 for 1 minute, can't cast for 1 round. Crit failure: stupefied 3, can't cast for 2 rounds |
| `kaido.json` | Kaidō — Mend the Weave | 2 | 1 | Touch, 1 willing creature. Restore **5 HP per half your level, rounded up**, minimum 5. At 9th, also remove one of clumsy, enfeebled, or stupefied |

- [ ] **Step 1: Write the failing test**

```js
const sai = kidoDoc("bakudo", "sai");
check(
    "Sai immobilizes on a failure and escalates on a critical failure (guide §6.2)",
    sai.flags["isaacs-hb-pf2e"].riders.map((r) => [r.outcomes, r.apply.slug]),
    [[["failure"], "immobilized"], [["criticalFailure"], "immobilized"]],
);
check("Sai's escape is against the Reiatsu DC", sai.flags["isaacs-hb-pf2e"].riders[0].apply.escapeDc, "reiatsu");

const danku = kidoDoc("bakudo", "danku");
check("Danku is a reaction (guide §6.2)", [danku.system.time.value, danku.system.traits.value.includes("binding")], ["reaction", true]);

const kaido = kidoDoc("kaido", "kaido");
check("Kaidō is the mending way and heals rather than harms", [kaido.system.traits.value.includes("mending"), Object.keys(kaido.system.damage).length], [true, 0]);
check("Kaidō is two actions at touch range (guide §6.3)", [kaido.system.time.value, kaido.system.range.value], ["2", "touch"]);
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node build/test-soulbound.mjs
```

Expected: FAIL — `ENOENT ... bakudo/sai.json`.

- [ ] **Step 3: Write the five Bakudō and the Kaidō**

Binding kidō carry `["focus", "kido", "reiatsu", "soulbound", "binding"]` and `otherTags: ["sb-tier-kido", "soulbound-kido-bakudo"]`; the Kaidō carries `mending` and `soulbound-kido-kaido`, plus `healing` and `vitality` if those traits exist in the snapshot.

The conditions are riders keyed on outcome, in the same flags block as Task 2. `Kaidō`'s healing uses the `heal` apply type that already exists — read its validation in `validate-lib.mjs` for the field names, and express "5 HP per half your level rounded up" with the `perStep` or formula field that validator accepts. **If the existing `heal` rider cannot express a level-scaling formula, say so and author the flat minimum with the scaling in the description, rather than inventing a field the engine will ignore.**

`Danku` is written with its rider present but **not yet functional** — Task 6 supplies the machinery. Its description must say so plainly, the way Phase 1's Greater Flash Step does.

- [ ] **Step 4: Run tests and validate, then commit**

```bash
node build/test-soulbound.mjs && npm run validate
git add content build
git commit -m "The Bakudo and the Kaido: binding and mending

Guide §6.2-§6.3. Conditions are outcome-keyed riders; escapes are against
the Reiatsu DC through the `reiatsu` spelling the engine gained in
d2758cd.

Danku ships inert: it is a reaction, and reactions have no machinery
until Task 6. Its own text says so rather than implying it works.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 4: The Hollow and Quincy arts

**Files:**
- Create: `content/soulbound-kido/hollow/bala.json`, `cero.json`
- Create: `content/soulbound-kido/quincy/heizen.json`, `gritz.json`
- Modify: `build/test-soulbound.mjs`

**Interfaces:**
- Produces: four `spell` documents, granted **unconditionally** by the Hollow and Quincy Lineage items (Task 1) rather than chosen.

| File | Name | Act. | Rank | Effect | Heightening |
| :-- | :-- | --: | --: | :-- | :-- |
| `bala.json` | Bala | 1 | 1 | **Cantrip.** 60 ft, 1 creature, **spell attack**, `1d4` + key attribute force. Has **agile** for MAP purposes | `+1d4` per 2 |
| `cero.json` | Cero | 2 | 1 | 60-ft line, basic Reflex, `2d6` force | `+1d6` per 1 |
| `heizen.json` | Heizen | 1 | 1 | **Cantrip.** 15-ft line, basic Reflex, `1d6` force. No attribute modifier — it is an area cantrip | `+1d6` per 2 |
| `gritz.json` | Gritz | 2 | 1 | 30 ft, 1 creature, Reflex. Failure: immobilized 1 round. Crit failure: **restrained** 1 minute, new save each turn | — |

- [ ] **Step 1: Write the failing test**

```js
const bala = kidoDoc("hollow", "bala");
check(
    "Bala is a cantrip spell attack that adds the key attribute (guide §6.4)",
    [bala.system.traits.value.includes("cantrip"), bala.system.defense, bala.system.damage["0"].applyMod],
    [true, null, true],
);
check("Bala carries agile, which is canon's 'twenty times the rate'", bala.system.traits.value.includes("agile"), true);

const heizen = kidoDoc("quincy", "heizen");
check(
    "Heizen is an area cantrip and so adds no attribute modifier (guide §6.5)",
    [heizen.system.traits.value.includes("cantrip"), heizen.system.damage["0"].applyMod, heizen.system.area],
    [true, false, { type: "line", value: 15 }],
);

const gritz = kidoDoc("quincy", "gritz");
check(
    "Gritz restrains on a critical failure — one step better than Sai, being the Quincy's only costed kidō",
    gritz.flags["isaacs-hb-pf2e"].riders.find((r) => r.outcomes.includes("criticalFailure")).apply.slug,
    "restrained",
);
```

- [ ] **Step 2: Run it, write the four documents, re-run**

```bash
node build/test-soulbound.mjs
```

`agile` is a **weapon** trait in pf2e and may not be legal on a spell. Check `build/lib/pf2e-traits.json` first. If it is not legal on a spell, **do not force it**: express the reduced multiple attack penalty with a `MultipleAttackPenalty` rule element on the spell (that key is in `RULE_KEYS`), and record the expression change for guide v1.4 — the number does not change, only how it is said.

- [ ] **Step 3: Validate and commit**

```bash
npm run validate && node build/test-soulbound.mjs
git add content build
git commit -m "Cero, Bala, Heizen and Gritz: the fixed arts

Guide §6.4-§6.5. A Hollow and a Quincy do not choose their demon arts —
they are anatomy — so these are granted unconditionally by the Lineage
rather than through Kido Adept's ChoiceSet.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 5: Lineage features — Soul Reaper and Hollow

**Files:**
- Create: `content/soulbound-class-features/lineages/kido-adept.json`, `zanjutsu.json`, `zanjutsu-mastery.json`
- Create: `content/soulbound-class-features/lineages/hierro-and-sonido.json`, `cero-and-bala.json`, `regeneracion.json`, `segunda-piel.json`
- Modify: `content/soulbound-class-features/lineages/soul-reaper.json`, `hollow.json`, `build/test-soulbound.mjs`

**Interfaces:**
- Produces: seven features. `Kidō Adept` is the chooser; `Hierro` and `Regeneración` are pure rule elements.

- [ ] **Step 1: Write the failing test**

```js
const hierro = contentDoc("soulbound-class-features/lineages/hierro-and-sonido.json");
const resistance = hierro.system.rules.find((r) => r.key === "Resistance");
check(
    "Hierro is physical resistance at half level, minimum 1 (guide §5.2)",
    [resistance?.type, resistance?.value],
    ["physical", "max(1,floor(@actor.level/2))"],
);
const speed = hierro.system.rules.find((r) => r.key === "BaseSpeed" || r.key === "FlatModifier");
check("Sonido is a status bonus to Speed", speed !== undefined, true);

const regen = contentDoc("soulbound-class-features/lineages/regeneracion.json");
check(
    "Regeneración is fast healing 2, rising at 11th and 17th (guide §5.2)",
    regen.system.rules.filter((r) => r.key === "FastHealing").length >= 1,
    true,
);
check(
    "and it is deactivated while dying",
    JSON.stringify(regen.system.rules).includes("dying"),
    true,
);
```

- [ ] **Step 2: Run it, then author**

`Hierro` uses pf2e's `Resistance` rule element with a formula value — the Saint's Aquarius Cloth already does `{"key": "Resistance", "type": "cold", "value": "@actor.level"}`, so the shape is proven; only the formula changes. **Verify `physical` is an accepted resistance type in `build/lib/pf2e-iwr.json`** before authoring; the validator checks it.

`Sonido` is +5 ft status to all Speeds, +10 at 11th. Check whether `BaseSpeed` or a `FlatModifier` on the `speed` selector is the right key by reading pf2e's own `Incredible Movement`, and follow that.

`Regeneración` uses `FastHealing`, predicated so it is off while dying and suppressed by spirit / holy / vitality damage. The suppression is an event the rider engine can see (`damage-applied`); if it cannot be expressed as a predicate on `FastHealing` alone, author the base healing as the rule element and the suppression as a rider that applies a short-lived "suppressed" effect, and say which in the commit.

`Kidō Adept` grants two kidō at 1st and one each at 5/9/13/17 through five `ChoiceSet` + `GrantItem` pairs, each gated by `{"gte": ["self:level", N]}` with `reevaluateOnUpdate: true`, filtering on `item:tag:sb-tier-kido` with **`itemType: "spell"`** — the lesson from Phase 1's weapon ChoiceSet.

`Zanjutsu` (5th) is Phase 6's feat family; here it grants only the roll option and says the family arrives with the feats. Say so in its text rather than implying a missing grant.

- [ ] **Step 3: Validate, test, commit**

```bash
npm run validate && node build/test-soulbound.mjs
git add content build
git commit -m "Soul Reaper and Hollow: breadth and attrition

Kido Adept chooses six kido across 1/5/9/13/17 with itemType spell on
every ChoiceSet — the lesson from the spirit weapon, which matched
nothing because queryCompendium defaults to feat.

Hierro is pf2e's Resistance rule element on a formula, the shape the
Saint's Aquarius Cloth already proves.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 6: The reaction machinery, and Blut

**Files:**
- Create: `scripts/soulbound/reactions.mjs`, `scripts/soulbound/blut.mjs`
- Create: `content/soulbound-class-features/lineages/heilig-bogen-and-blut.json`, `sealing.json`, `sklaverei.json`
- Create: `content/soulbound-effects/effect-blut-vene.json`, `effect-blut-arterie.json`
- Modify: `scripts/isaacs-hb.mjs`, `scripts/riders/apply.mjs`, `build/lib/validate-lib.mjs`, `build/test-soulbound.mjs`
- Modify: `content/soulbound-effects/effect-greater-flash-step.json` (Phase 1's open item)

**Interfaces:**
- Consumes: the rider engine's `strike-received` and `damage-applied` events.
- Produces:
  - A new `reaction` rider apply type, registered in `RIDER_TYPES`
  - `Reactions.offer(context, payload): Promise<boolean>`
  - `Blut.active(actor): "vene" | "arterie" | null`, `Blut.set(actor, which): Promise<void>`

- [ ] **Step 1: Write the failing test for the decision logic**

The offer's *decision* is pure and must be tested without Foundry: whether a given actor may take a reaction now.

```js
const { canOffer } = await import("../scripts/soulbound/reactions.mjs");

const base = { hasReaction: true, alreadyOffered: false, ownerOnline: true, frequencyLeft: 1 };
check("an owner with a reaction available is offered it", canOffer(base), true);
check("a reaction already spent this round is not offered", canOffer({ ...base, hasReaction: false }), false);
check("the same trigger is never offered twice", canOffer({ ...base, alreadyOffered: true }), false);
check("an exhausted frequency is not offered", canOffer({ ...base, frequencyLeft: 0 }), false);
check("with nobody at the keyboard, nothing is offered", canOffer({ ...base, ownerOnline: false }), false);
```

- [ ] **Step 2: Run it to verify it fails**

```bash
node build/test-soulbound.mjs
```

Expected: FAIL — `Cannot find module '../scripts/soulbound/reactions.mjs'`.

- [ ] **Step 3: Write `scripts/soulbound/reactions.mjs`**

The module's job is narrow and should stay narrow: the rider engine already detects the trigger and knows the context; this offers it and applies the chosen branch.

```js
/**
 * Reactions: turning a detected trigger into an offer.
 *
 * Eight abilities in this class fire on someone ELSE's action — Antithesis, The Balance, Zanhyō
 * Ningyō, Danku, Reiatsu Barrier, Guard the Threshold, Unbroken Chain, The Miracle. The rider engine
 * already sees the trigger through `strike-received` and `damage-applied`; what is missing is asking
 * the owner whether they want to spend their reaction, and doing nothing if they do not.
 *
 * The card times out and DECLINES, because an unattended client must never stall someone else's turn.
 * That is the whole reason this is an offer rather than an automatic application: a reaction the player
 * did not choose to spend is worse than one they were never offered.
 */
export function canOffer({ hasReaction, alreadyOffered, ownerOnline, frequencyLeft }) {
    if (!ownerOnline) return false;
    if (!hasReaction) return false;
    if (alreadyOffered) return false;
    return frequencyLeft > 0;
}
```

plus the Foundry half: a whispered card with one button, a timeout that resolves `false`, and application of `payload.riders` on acceptance through the engine's existing `applyOne`.

- [ ] **Step 4: Register the `reaction` apply type**

In `build/lib/validate-lib.mjs`, add `"reaction"` to `RIDER_TYPES` and a validation branch requiring `apply.riders` to be a non-empty array and the rider to be `self`. In `scripts/riders/apply.mjs`, add the `case "reaction":` dispatch to `Reactions.offer`.

- [ ] **Step 5: Close Phase 1's open item**

Give `content/soulbound-effects/effect-greater-flash-step.json` a real rider now that one can exist: a `strike-received` reaction offering the DC 5 flat check before damage applies. Remove the "not yet automated" paragraph from its description and from `Docs/soulbound-automation-programme.md` §3.4.

**If it turns out the attack's outcome still cannot be changed from this event**, leave the paragraph, say so in the commit, and move the item to a permanent "deliberately not automated" list with the reason — do not quietly leave a promise the content does not keep.

- [ ] **Step 6: Write Blut**

`Blut.set` applies one of two effects and removes the other; `once per round` is a `frequency` on the free action, `twice` with `Blut Discipline` (Phase 6) through an `ItemAlteration`. The Letzt Stil exception (Phase 5) is a predicate on the exclusivity check, not a code branch — write the check so that exception is expressible without editing this file later.

- [ ] **Step 7: Validate, test, commit**

```bash
npm test
git add scripts content build Docs
git commit -m "Reactions: the machinery Phase 1 left a hole for, and Blut

A new `reaction` rider apply type. The engine already detected the
trigger; what was missing was asking the owner whether to spend their
reaction. The card times out and DECLINES, because an unattended client
must never stall someone else's turn.

Danku becomes real, and Greater Flash Step's DC 5 flat check is offered
before damage applies rather than reported after.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 7: Seal the Art and the Quincy's 15th

**Files:**
- Create: `content/soulbound-class-features/lineages/seal-the-art.json`
- Modify: `content/soulbound-class-features/lineages/sealing.json`, `sklaverei.json`, `build/test-soulbound.mjs`

**Interfaces:**
- Consumes: the `counteract` rider apply type that already exists (`apply.mjs:853`), which since d2758cd defaults its statistic to the origin's own class.

- [ ] **Step 1: Write the failing test**

```js
const seal = contentDoc("soulbound-class-features/lineages/seal-the-art.json");
const rider = seal.flags["isaacs-hb-pf2e"].riders[0];
check(
    "Seal the Art counteracts on the Reiatsu DC at half level rounded up (guide §5.3)",
    [rider.apply.type, rider.event, seal.system.actions.value],
    ["counteract", "action-used", 2],
);
check("it is once per use and costs a Reiatsu Point", seal.system.traits.value.includes("reiatsu"), true);
```

- [ ] **Step 2: Author it**

A two-action activity with an `action-used` rider of type `counteract`. Read `applyCounteract` in `apply.mjs` for the exact payload fields — it already implements rank comparison against the effect's level. **The suppression-rather-than-ending clause for release states** (guide §5.3) is the part the existing type may not cover; if it does not, add a `suppress` option to the counteract payload rather than a second apply type, and pin it with a test.

- [ ] **Step 3: Validate, test, commit**

---

### Task 8: Live verification

- [ ] **Step 1: Build, relaunch, and extend the rig**

Add a Lineage dimension to `scripts/soulbound/rig.mjs`: `run({ lineage, profile, levels })`, choosing the named Lineage in the prompt resolver and asserting per Lineage at 1 / 5 / 11 / 15.

| Lineage | Assert |
| :-- | :-- |
| Soul Reaper | Society trained; Shō known at 1; two chosen kidō at 1; one more at each of 5/9/13/17 |
| Hollow | Athletics trained; physical resistance = half level; fast healing 2 at 5, 4 at 11, 6 at 17; Bala and Cero known and not chooseable |
| Quincy | Crafting trained; Blut Vene and Arterie mutually exclusive; Heizen and Gritz known; Seal the Art present at 5 |

- [ ] **Step 2: Run all three Lineages 1→20**

```js
for (const lineage of ["Soul Reaper", "Hollow", "Quincy"]) await api.rig.run({ lineage });
```

- [ ] **Step 3: Cast every kidō at the table**

Scripted assertions cannot prove a spell rolls. For each of the sixteen, cast it from a levelled character and confirm the dice, the area, the save statistic and any rider. **The reiatsu pool should now be non-zero** for the first time — a Soul Reaper at 1st with two kidō has a pool of 1 (capped), which is the first end-to-end proof that Phase 1's `cap` decision was right.

- [ ] **Step 4: Confirm the reaction offer**

Have an enemy attack a Quincy holding Danku, and confirm the card appears, that declining costs nothing, and that accepting applies resistance equal to level.

- [ ] **Step 5: Update the programme document and commit**

Add a Phase 2 section to `Docs/soulbound-automation-programme.md` recording what was verified, what was found, and any new corrections owed to guide v1.4.

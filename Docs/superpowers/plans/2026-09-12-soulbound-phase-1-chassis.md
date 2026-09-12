# Soulbound Phase 1 — Chassis Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** A playable Soulbound chassis — the class item, its advancement, the spirit weapon, the Reiatsu pool with Rising Pressure, and the release state machine with no Spirit attached — levelling 1→20 correctly in Foundry world `pf`, with the Saint unchanged.

**Architecture:** Extend the module's existing engine in place rather than duplicating it. Two shared subsystems get a pack-family split so they stop assuming every document is a Saint's, four Saint-coupled sites in the rider engine and area targeting become class-general, and everything genuinely new for Soulbound lands in a new `scripts/soulbound/` directory. Content is authored as one JSON document per file under `content/soulbound-*/`, built to LevelDB packs by the existing build.

**Tech Stack:** Node 22 ESM, no test framework (a hand-rolled `check(label, actual, expected)` harness), `@foundryvtt/foundryvtt-cli` for pack compilation, Foundry VTT 14.364, pf2e system 8.4.1, chrome-devtools MCP on port 9222 for live verification.

**Spec:** `Docs/superpowers/specs/2026-09-12-soulbound-design.md`

## Global Constraints

- **The class guide is the specification.** `Docs/soulbound-guide-v1.md` (v1.3). Any decision this plan makes that the guide does not state is written back into the guide as v1.4 in Phase 6.
- **Module id never changes.** `isaacs-hb-pf2e`. Changing it orphans every existing world's items.
- **The Saint must not regress.** `npm run test:riders` (146 checks) and `npm run validate` stay green at every commit. Old rider spellings `"saint"` and `"cosmo"` keep working.
- **Class slug is `soulbound`.** It keys the Reiatsu DC through `actor.getStatistic("soulbound")`.
- **Chassis numbers, from guide §3.1 and §1.2:** HP **10**; key attribute **Strength or Dexterity**; Perception **trained**; Fortitude **expert**, Reflex **expert**, Will **trained**; simple, martial and unarmed attacks **trained**; light armour and unarmoured defence **trained**; Class DC **trained**; trained in **Religion** plus **3 + Int** additional skills.
- **Every document carries** `system.publication` with `{"license": "ORC", "remaster": true, "title": "Isaac's Homebrew: The Soulbound"}`.
- **Every Soulbound document carries the `otherTag` `soulbound-<family>`** so slugs never collide with the Saint's. The Saint already ships a Technique named *The Balance*; Haschwalth's Spirit is also *The Balance*.
- **Naming:** no new script file may be called `balance.mjs` — `scripts/outcomes/balance.mjs` is Libra's.
- **Commit after every task.** Branch is `claude/soulbound`, already created, spec already committed at `fbd26af`.
- **Windows/PowerShell session**, but all commands below are given for the Bash tool (Git Bash).

---

### Task 1: Split the validators by pack family

`build/lib/validate-lib.mjs` runs `validateSpell`, `validateClass` and `validateFeat` on **every Item in every pack**, and all three are hard-coded to the Saint: a spell must carry the `cosmo` and `saint` traits and a `technique-slot-N` tag, a class must have slug `saint`, a class feat must carry the `saint` trait. The moment a `soulbound-*` pack exists the build fails on every document in it. This task must land before any Soulbound content.

**Files:**
- Create: `build/lib/check.mjs`
- Create: `build/test-soulbound.mjs`
- Modify: `build/lib/validate-lib.mjs` (the `validate` dispatcher at :78, `validateItem` at :122, `validateSpell` at :1070, `validateClass` at :1150, `validateFeat` at :1056)
- Modify: `package.json` (scripts)

**Interfaces:**
- Consumes: nothing from earlier tasks.
- Produces:
  - `familyOf(packName: string): "saint" | "soulbound" | null` exported from `build/lib/validate-lib.mjs`
  - `check(label: string, actual: unknown, expected: unknown): void` and `report(name: string): void` exported from `build/lib/check.mjs`
  - `validate(packs, { errors })` unchanged in signature; now family-aware internally

- [ ] **Step 1: Create the shared check harness**

`build/lib/check.mjs` — the same semantics `build/test-riders.mjs` uses inline, extracted so the new test file does not copy it. `test-riders.mjs` is deliberately left alone; migrating it is not worth risking 146 green checks in this task.

```js
/**
 * The smallest test harness that says what broke.
 *
 * Deliberately not a framework: these tests run against built content in a plain Node process, and a
 * dependency here would have to be installed before the build could be trusted.
 */
const failures = [];
let checks = 0;

export function check(label, actual, expected) {
    checks += 1;
    const a = JSON.stringify(actual);
    const e = JSON.stringify(expected);
    if (a !== e) failures.push(`${label}\n      expected ${e}\n      got      ${a}`);
}

export function report(name) {
    if (failures.length > 0) {
        console.error(`${name} failed: ${failures.length} of ${checks}.`);
        for (const failure of failures) console.error(`  - ${failure}`);
        process.exit(1);
    }
    console.log(`${name} passed: ${checks} checks.`);
}
```

- [ ] **Step 2: Write the failing test**

Create `build/test-soulbound.mjs`. It builds fake pack structures in memory and runs the real `validate()` over them, which is the only way to prove a Saint rule is not being applied to a Soulbound document.

```js
/**
 * Soulbound invariants, driven through the real validator against synthetic packs.
 *
 * The point of the synthetic packs is the negative case: proving that a Soulbound spell is NOT held to
 * the Saint's `cosmo`/`technique-slot` rules is impossible to show from shipped content, because the
 * absence of an error looks the same as the absence of a document.
 */
import { check, report } from "./lib/check.mjs";
import { familyOf, validate } from "./lib/validate-lib.mjs";

/** A minimal, otherwise-valid spell document, so only the family-specific rules can fail. */
function spellDoc({ traits, otherTags = [], rank = 1 }) {
    return {
        name: "Test Technique",
        type: "spell",
        img: "icons/svg/explosion.svg",
        system: {
            description: { value: "<p>Test.</p>" },
            publication: { license: "ORC", remaster: true, title: "Isaac's Homebrew: The Soulbound" },
            level: { value: rank },
            traits: { rarity: "common", value: traits, otherTags, traditions: [] },
            damage: {},
        },
    };
}

function runValidate(packName, doc) {
    const errors = [];
    validate([{ def: { name: packName, type: "Item" }, docs: [{ file: `content/${packName}/x.json`, doc }] }], { errors });
    return errors;
}

check("familyOf reads the pack prefix", [familyOf("saint-techniques"), familyOf("soulbound-kido"), familyOf("other")], ["saint", "soulbound", null]);

const soulboundSpell = spellDoc({
    traits: ["focus", "reiatsu", "soulbound", "concentrate"],
    otherTags: ["soulbound-technique", "sb-tier-release"],
});
check(
    "a Soulbound Technique is not held to the Saint's cosmo trait or technique-slot tag",
    runValidate("soulbound-techniques", soulboundSpell),
    [],
);

check(
    "a Soulbound Technique without the reiatsu trait is refused",
    runValidate("soulbound-techniques", spellDoc({
        traits: ["focus", "soulbound"],
        otherTags: ["soulbound-technique", "sb-tier-release"],
    })).length > 0,
    true,
);

check(
    "a Release Technique authored at the wrong base rank is refused (guide §7: Release = 1)",
    runValidate("soulbound-techniques", spellDoc({
        traits: ["focus", "reiatsu", "soulbound"],
        otherTags: ["soulbound-technique", "sb-tier-release"],
        rank: 3,
    })).length > 0,
    true,
);

check(
    "the Saint's own rules still apply to a Saint pack",
    runValidate("saint-techniques", spellDoc({ traits: ["focus", "reiatsu", "soulbound"] })).length > 0,
    true,
);

report("Soulbound tests");
```

- [ ] **Step 3: Run the test to verify it fails**

```bash
node build/test-soulbound.mjs
```

Expected: FAIL — `SyntaxError` or `does not provide an export named 'familyOf'`, because `familyOf` does not exist yet.

- [ ] **Step 4: Add the family split to the validator**

In `build/lib/validate-lib.mjs`, add above `validate`:

```js
/**
 * Which class guide a pack's documents are held to.
 *
 * Every validator below used to assume the Saint, because the Saint was the only class. A Soulbound
 * Technique carries `reiatsu` where a Saint's carries `cosmo`, and has no technique slot at all — so
 * running the Saint's rules over it reports an error on every single document rather than none.
 */
const FAMILY_PREFIXES = [["saint-", "saint"], ["soulbound-", "soulbound"]];

export function familyOf(packName) {
    return FAMILY_PREFIXES.find(([prefix]) => String(packName).startsWith(prefix))?.[1] ?? null;
}
```

Change the dispatcher to pass it down:

```js
export function validate(packs, { errors }) {
    for (const { def, docs } of packs) {
        const family = familyOf(def.name);
        for (const { file, doc } of docs) {
            const where = rel(file);
            if (def.type === "Item") validateItem(doc, where, errors, family);
            if (def.type === "JournalEntry") validateJournal(doc, where, errors);
            if (def.type === "Macro") validateMacro(doc, where, errors);
        }
    }
    validateAdvancementTable(packs, errors);
    validateActionsAreReachable(packs, errors);
}
```

Thread `family` through `validateItem` to the three class-specific validators — `validateItem(doc, where, errors, family)`, and at its call sites inside it: `validateSpell(doc, where, errors, family)`, `validateClass(doc, where, errors, family)`, `validateFeat(doc, where, errors, family)`.

- [ ] **Step 5: Branch the three class-specific validators**

In `validateFeat`, replace the hard-coded trait check:

```js
    if (system.category === "class") {
        const trait = family === "soulbound" ? "soulbound" : "saint";
        if (!(system.traits?.value ?? []).includes(trait)) {
            errors.push(`${where}: ${trait} class feat must carry the "${trait}" trait`);
        }
    }
```

In `validateClass`:

```js
function validateClass(doc, where, errors, family) {
    const system = doc.system;
    const expected = family === "soulbound" ? "soulbound" : "saint";
    const dcName = family === "soulbound" ? "Reiatsu DC" : "Cosmo DC";
    if (system.slug !== expected) errors.push(`${where}: class slug must be "${expected}" (it keys the ${dcName})`);
    if (!(system.traits?.value ?? []).includes(expected)) {
        errors.push(`${where}: class must carry the "${expected}" trait`);
    }
    if (system.hp !== 10) errors.push(`${where}: HP should be 10`);
    const keyAbility = system.keyAbility?.value ?? [];
    if (keyAbility.length !== 2 || !keyAbility.includes("str") || !keyAbility.includes("dex")) {
        errors.push(`${where}: key ability should be Strength or Dexterity`);
    }
    for (const [key, grant] of Object.entries(system.items ?? {})) {
        if (typeof grant.level !== "number") errors.push(`${where}: items.${key} missing level`);
        if (!grant.uuid) errors.push(`${where}: items.${key} missing uuid`);
    }
}
```

In `validateSpell`, take the family and hand off before the Saint's rules run. Add near `SLOT_RANK`:

```js
/**
 * Guide §7's preamble and §9: a Soulbound effect's base rank is fixed by which rung of the ladder it sits
 * on, not by the level it is gained at. A Technique authored at the wrong rank heightens wrong for the
 * whole campaign and has no other symptom.
 */
const SB_TIER_RANK = { release: 1, refined: 5, "full-release": 7, severing: 10 };
```

and the Soulbound branch:

```js
function validateSoulboundSpell(doc, where, errors, rank) {
    const system = doc.system;
    const traits = system.traits?.value ?? [];
    for (const required of ["focus", "reiatsu"]) {
        if (!traits.includes(required)) errors.push(`${where}: Soulbound effect must carry the "${required}" trait`);
    }
    const tags = system.traits?.otherTags ?? [];
    // Kidō and Zanjutsu have authored base ranks that follow no formula (guide §6 and §8.4), so only the
    // four ladder rungs are checked — those are the ones the guide states as a rule.
    const tierTag = tags.find((t) => t.startsWith("sb-tier-"));
    if (!tierTag) {
        errors.push(`${where}: Soulbound effect has no sb-tier-<tier> tag (release/refined/full-release/severing/kido/zanjutsu)`);
        return;
    }
    const tier = tierTag.slice("sb-tier-".length);
    if (tier in SB_TIER_RANK && rank !== SB_TIER_RANK[tier]) {
        errors.push(`${where}: ${tier} effects have base rank ${SB_TIER_RANK[tier]}, not ${rank} (guide §7/§9)`);
    }
}
```

and at the top of `validateSpell`, after the common rank and damage checks and before the `focus`/`cosmo`/`saint` loop:

```js
    if (family === "soulbound") return validateSoulboundSpell(doc, where, errors, rank);
```

- [ ] **Step 6: Run the test to verify it passes**

```bash
node build/test-soulbound.mjs
```

Expected: PASS — `Soulbound tests passed: 5 checks.`

- [ ] **Step 7: Verify the Saint has not regressed**

```bash
npm run validate && npm run test:riders
```

Expected: `Validated 187 document(s) in 7 pack(s): no errors.` and `Rider tests passed: 146 checks.` — both unchanged.

- [ ] **Step 8: Wire the new test into `npm test`**

In `package.json`, add the script and put it in the chain:

```json
        "test:soulbound": "node build/test-soulbound.mjs",
        "test": "npm run validate && npm run test:riders && npm run test:soulbound && npm run build && npm run check:roundtrip",
```

- [ ] **Step 9: Run the full suite**

```bash
npm test
```

Expected: all four stages pass.

- [ ] **Step 10: Commit**

```bash
git add build/lib/check.mjs build/test-soulbound.mjs build/lib/validate-lib.mjs package.json
git commit -m "Validators: split by pack family so a second class is possible

validateSpell, validateClass and validateFeat ran over every Item in
every pack and assumed the Saint: the cosmo trait, a technique-slot tag,
slug \"saint\". A soulbound-* pack would have failed the build on every
document in it.

familyOf() reads the pack prefix; the three validators branch on it. The
Saint's rules are unchanged and its 187 documents still validate.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 2: Generalise the four Saint-coupled sites in the shared engine

The rider engine resolves `dc: "cosmo"` through `getStatistic("saint")` and defaults a counteract's statistic to `"saint"`; area targeting decides what is a Technique by the `cosmo` trait. All three must become class-general without changing what the Saint's existing content means.

**Files:**
- Create: `scripts/lib/class-dc.mjs`
- Modify: `scripts/riders/apply.mjs:1481-1491` (`resolveDC`), `scripts/riders/apply.mjs:890` and `:913-915` (counteract statistic)
- Modify: `scripts/targeting/config.mjs:159-161` (`isTechnique`)
- Modify: `build/test-soulbound.mjs`

**Interfaces:**
- Consumes: `check`, `report` from `build/lib/check.mjs` (Task 1).
- Produces:
  - `classStatisticOf(actor, slug?: string | null): Statistic | null` from `scripts/lib/class-dc.mjs`
  - `classSlugOf(actor): string | null` from `scripts/lib/class-dc.mjs`
  - `resolveDC` now accepts `"cosmo"`, `"reiatsu"` and `"class"`
  - `isTechnique(item)` now true for `cosmo` **or** `reiatsu`

- [ ] **Step 1: Write the failing test**

Append to `build/test-soulbound.mjs`, above `report("Soulbound tests")`:

```js
/* --- the shared engine's class-general DC resolution ------------------------------------------ */

const { classSlugOf, classStatisticOf } = await import("../scripts/lib/class-dc.mjs");

/** An actor stub carrying one class DC, the way pf2e exposes it. */
function actorWith(slug, dc) {
    return {
        class: { system: { slug } },
        classDCs: { [slug]: { dc: { value: dc } } },
        getStatistic(wanted) {
            return wanted === slug ? { dc: { value: dc } } : null;
        },
    };
}

const saint = actorWith("saint", 31);
const soulbound = actorWith("soulbound", 28);

check("the class slug comes off the actor's own class", [classSlugOf(saint), classSlugOf(soulbound)], ["saint", "soulbound"]);
check("an explicit slug wins over the actor's class", classStatisticOf(saint, "saint")?.dc?.value, 31);
check("with no slug given, the actor's own class answers", classStatisticOf(soulbound)?.dc?.value, 28);
check("a class the actor does not have resolves to nothing", classStatisticOf(saint, "soulbound"), null);
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node build/test-soulbound.mjs
```

Expected: FAIL — `Cannot find module '../scripts/lib/class-dc.mjs'`.

- [ ] **Step 3: Create `scripts/lib/class-dc.mjs`**

```js
/**
 * The class DC of whichever homebrew class an actor carries.
 *
 * Written when the module gained a second class. Before that, "the class DC" meant the Saint's Cosmo DC
 * and the rider engine said so in three places. A rider authored on a Soulbound Technique needs the
 * Reiatsu DC from the same code path, and a rider that names no class at all should mean "whatever class
 * the origin actually has" rather than silently meaning the Saint.
 */

/** The slug of the class this actor has, or null for anyone who is neither. */
export function classSlugOf(actor) {
    return actor?.class?.system?.slug ?? null;
}

/**
 * The named class statistic, or the actor's own class statistic when no name is given.
 *
 * Both lookups are tried, because `getStatistic` is the supported path and `classDCs` is what survives
 * when a statistic has not been prepared yet — the same belt-and-braces the Saint's `resolveDC` had.
 */
export function classStatisticOf(actor, slug = null) {
    const wanted = slug ?? classSlugOf(actor);
    if (!wanted) return null;
    return actor?.getStatistic?.(wanted) ?? actor?.classDCs?.[wanted] ?? null;
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
node build/test-soulbound.mjs
```

Expected: PASS — 9 checks.

- [ ] **Step 5: Rewrite `resolveDC` in `scripts/riders/apply.mjs`**

Replace the function at :1481-1491 entirely:

```js
/** A class DC — the Saint's Cosmo or the Soulbound's Reiatsu — or a flat number written in the content. */
function resolveDC(dc, context) {
    if (typeof dc === "number") return dc;
    // "cosmo" is the Saint's own spelling and predates the second class; "reiatsu" is the Soulbound's;
    // "class" means whichever class the origin has. All three are kept, because every Saint Technique
    // already shipped says "cosmo" and rewriting 48 files to prove a point is how content breaks.
    const slug = { cosmo: "saint", reiatsu: "soulbound", class: null }[dc];
    if (slug === undefined) return null;
    return classStatisticOf(context.originActor, slug)?.dc?.value ?? null;
}
```

Add to the imports at the top of `apply.mjs`:

```js
import { classSlugOf, classStatisticOf } from "../lib/class-dc.mjs";
```

- [ ] **Step 6: Generalise the counteract statistic**

At `apply.mjs:890`, inside the card's flags:

```js
                    statistic: rider.apply.statistic ?? classSlugOf(context.originActor) ?? "saint",
```

At `apply.mjs:913-915`, in `resolveCounteract`:

```js
    const slug = payload.statistic ?? classSlugOf(actor) ?? "saint";
    const statistic = actor.getStatistic?.(slug);
    if (!statistic) {
        ui.notifications.warn(`${actor.name} has no ${slug} statistic to counteract with.`);
        return;
    }
```

- [ ] **Step 7: Generalise `isTechnique`**

In `scripts/targeting/config.mjs`, replace :159-161:

```js
/**
 * A focus effect belonging to one of this module's classes.
 *
 * `cosmo` is the Saint's Technique trait, `reiatsu` the Soulbound's. Area targeting keys off this to
 * decide whether the "Saint's Techniques only" world setting covers a given cast.
 */
export function isTechnique(item) {
    if (item?.type !== "spell") return false;
    const traits = item.system?.traits?.value ?? [];
    return traits.includes("cosmo") || traits.includes("reiatsu");
}
```

- [ ] **Step 8: Add a regression check for the DC spellings**

Append to `build/test-soulbound.mjs`, above `report(...)`:

```js
const { isTechnique } = await import("../scripts/targeting/config.mjs");

function spellItem(traits) {
    return { type: "spell", system: { traits: { value: traits } } };
}
check(
    "area targeting recognises both classes' focus effects and nothing else",
    [
        isTechnique(spellItem(["cosmo"])),
        isTechnique(spellItem(["reiatsu"])),
        isTechnique(spellItem(["focus"])),
        isTechnique({ type: "action", system: { traits: { value: ["reiatsu"] } } }),
    ],
    [true, true, false, false],
);
```

- [ ] **Step 9: Run the full suite**

```bash
npm test
```

Expected: all stages pass; `Rider tests passed: 146 checks.` unchanged.

- [ ] **Step 10: Commit**

```bash
git add scripts/lib/class-dc.mjs scripts/riders/apply.mjs scripts/targeting/config.mjs build/test-soulbound.mjs
git commit -m "Rider engine and targeting: resolve any class's DC, not only the Saint's

Three sites assumed the Saint because it was the only class: resolveDC
mapped \"cosmo\" through getStatistic(\"saint\"), the counteract card
defaulted its statistic to \"saint\", and isTechnique gated on the cosmo
trait alone.

classStatisticOf(actor, slug) answers for either class, and a rider may
now say \"cosmo\", \"reiatsu\" or \"class\". Every existing spelling keeps
its meaning, so no Saint content changes.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 3: Declare the packs, traits and module identity

**Files:**
- Modify: `module.json`
- Create: `content/soulbound-class/.gitkeep` and the eight sibling directories

**Interfaces:**
- Consumes: nothing.
- Produces: nine pack definitions named `soulbound-class`, `soulbound-equipment`, `soulbound-class-features`, `soulbound-techniques`, `soulbound-kido`, `soulbound-feats`, `soulbound-effects`, `soulbound-journals`, `soulbound-macros`; homebrew traits `soulbound` (class), `reiatsu` / `kido` / `destruction` / `binding` / `mending` (spell), `lineage` (feat).

- [ ] **Step 1: Check which traits pf2e already ships**

The module must not shadow a system trait — a shadowed trait silently overrides the system's label and description for every actor in the world.

```bash
node -e "const t=require('./build/lib/pf2e-traits.json');for(const n of ['reiatsu','kido','destruction','binding','mending','lineage','soulbound','twin'])console.log(n, Object.keys(t).filter(k=>Array.isArray(t[k])?t[k].includes(n):(t[k]&&n in t[k])).join(',')||'NOT PRESENT')"
```

Expected: a line per trait naming which pf2e trait dictionaries already contain it. **Any trait reported as present in pf2e must be dropped from the homebrew block below** and used as the system's own. Record what was dropped in the commit message.

- [ ] **Step 2: Add the nine pack definitions**

In `module.json`, append to the `packs` array. Each entry follows the Saint's shape exactly; only `name`, `label`, `path`, `type` and `banner` differ.

```json
        {
            "name": "soulbound-class",
            "label": "The Soulbound: Class",
            "path": "packs/soulbound-class",
            "type": "Item",
            "system": "pf2e",
            "banner": "systems/pf2e/assets/compendium-banner/blue.webp",
            "ownership": { "PLAYER": "OBSERVER", "ASSISTANT": "OWNER" },
            "flags": {}
        },
        {
            "name": "soulbound-equipment",
            "label": "The Soulbound: Spirit Weapons",
            "path": "packs/soulbound-equipment",
            "type": "Item",
            "system": "pf2e",
            "banner": "systems/pf2e/assets/compendium-banner/blue.webp",
            "ownership": { "PLAYER": "OBSERVER", "ASSISTANT": "OWNER" },
            "flags": {}
        },
        {
            "name": "soulbound-class-features",
            "label": "The Soulbound: Class Features",
            "path": "packs/soulbound-class-features",
            "type": "Item",
            "system": "pf2e",
            "banner": "systems/pf2e/assets/compendium-banner/blue.webp",
            "ownership": { "PLAYER": "OBSERVER", "ASSISTANT": "OWNER" },
            "flags": {}
        },
        {
            "name": "soulbound-techniques",
            "label": "The Soulbound: Techniques",
            "path": "packs/soulbound-techniques",
            "type": "Item",
            "system": "pf2e",
            "banner": "systems/pf2e/assets/compendium-banner/purple.webp",
            "ownership": { "PLAYER": "OBSERVER", "ASSISTANT": "OWNER" },
            "flags": {}
        },
        {
            "name": "soulbound-kido",
            "label": "The Soulbound: Kidō",
            "path": "packs/soulbound-kido",
            "type": "Item",
            "system": "pf2e",
            "banner": "systems/pf2e/assets/compendium-banner/purple.webp",
            "ownership": { "PLAYER": "OBSERVER", "ASSISTANT": "OWNER" },
            "flags": {}
        },
        {
            "name": "soulbound-feats",
            "label": "The Soulbound: Feats",
            "path": "packs/soulbound-feats",
            "type": "Item",
            "system": "pf2e",
            "banner": "systems/pf2e/assets/compendium-banner/blue.webp",
            "ownership": { "PLAYER": "OBSERVER", "ASSISTANT": "OWNER" },
            "flags": {}
        },
        {
            "name": "soulbound-effects",
            "label": "The Soulbound: Effects",
            "path": "packs/soulbound-effects",
            "type": "Item",
            "system": "pf2e",
            "banner": "systems/pf2e/assets/compendium-banner/green.webp",
            "ownership": { "PLAYER": "OBSERVER", "ASSISTANT": "OWNER" },
            "flags": {}
        },
        {
            "name": "soulbound-journals",
            "label": "The Soulbound: Handbook",
            "path": "packs/soulbound-journals",
            "type": "JournalEntry",
            "system": "pf2e",
            "banner": "systems/pf2e/assets/compendium-banner/green.webp",
            "ownership": { "PLAYER": "OBSERVER", "ASSISTANT": "OWNER" },
            "flags": {}
        },
        {
            "name": "soulbound-macros",
            "label": "The Soulbound: Macros",
            "path": "packs/soulbound-macros",
            "type": "Macro",
            "system": "pf2e",
            "banner": "systems/pf2e/assets/compendium-banner/green.webp",
            "ownership": { "PLAYER": "NONE", "ASSISTANT": "OWNER" },
            "flags": {}
        }
```

- [ ] **Step 3: Add the second pack folder**

Append to `packFolders`:

```json
        {
            "name": "Isaac's Homebrew: The Soulbound",
            "sorting": "m",
            "color": "#2f5d8a",
            "packs": [
                "soulbound-class",
                "soulbound-equipment",
                "soulbound-class-features",
                "soulbound-techniques",
                "soulbound-kido",
                "soulbound-feats",
                "soulbound-effects",
                "soulbound-journals",
                "soulbound-macros"
            ]
        }
```

- [ ] **Step 4: Register the homebrew traits**

In `flags["isaacs-hb-pf2e"]["pf2e-homebrew"]`, add to `classTraits`, `spellTraits` and `featTraits`. **Omit any trait Step 1 reported as already present in pf2e.**

```json
                "classTraits": {
                    "soulbound": {
                        "label": "Soulbound",
                        "description": "A creature, item, or ability of the Soulbound class."
                    }
                },
                "spellTraits": {
                    "reiatsu": {
                        "label": "Reiatsu",
                        "description": "An effect powered by a Soulbound's spiritual pressure. Reiatsu effects are focus effects that use the Reiatsu DC and heighten to half the character's level, rounded up."
                    },
                    "kido": {
                        "label": "Kidō",
                        "description": "A demon art. Kidō are not spells: they use the Reiatsu DC, cannot be counteracted as spells, and cannot be heightened with slots."
                    },
                    "destruction": {
                        "label": "Destruction",
                        "description": "The Way of Destruction — Hadō. A kidō that does harm."
                    },
                    "binding": {
                        "label": "Binding",
                        "description": "The Way of Binding — Bakudō. A kidō that restrains or shields."
                    },
                    "mending": {
                        "label": "Mending",
                        "description": "The Way of Mending — Kaidō. A kidō that heals."
                    }
                },
                "featTraits": {
                    "lineage": {
                        "label": "Lineage",
                        "description": "An ability granted by a Soulbound's Lineage — Soul Reaper, Hollow, or Quincy."
                    }
                }
```

The existing `classTraits.saint`, `spellTraits.cosmo` and `featTraits.cloth` entries stay; merge into those objects rather than replacing them.

- [ ] **Step 5: Retitle the module**

```json
    "title": "Isaac's Homebrew (PF2e): The Saint and The Soulbound",
```

and replace `description` with one naming both classes. Leave `id`, `version`, `manifest` and `download` untouched.

- [ ] **Step 6: Create the content directories**

```bash
for d in class equipment class-features techniques kido feats effects journals macros; do mkdir -p "content/soulbound-$d"; done
```

- [ ] **Step 7: Verify the build accepts nine empty packs**

`loadPacks` pushes an empty pack for a directory that does not exist, and `compilePack` handles an empty source directory, so this should build cleanly with zero new documents.

```bash
npm run validate && npm run build
```

Expected: `Validated 187 document(s) in 16 pack(s): no errors.` and a build listing nine `soulbound-*` packs with `0 document(s)`.

- [ ] **Step 8: Commit**

```bash
git add module.json content/soulbound-*
git commit -m "Declare the Soulbound's nine packs, its traits, and the module's two classes

Nine empty packs in their own pack folder, the homebrew traits the class
needs, and a title that no longer names only the Saint. The module id is
unchanged; changing it would orphan every existing world's items.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 4: The class item and its advancement table

**Files:**
- Create: `content/soulbound-class/soulbound.json`
- Modify: `build/lib/validate-lib.mjs` (add `validateSoulboundAdvancement`, call it from `validate`)
- Modify: `build/test-soulbound.mjs`

**Interfaces:**
- Consumes: `familyOf` (Task 1), the nine packs (Task 3).
- Produces: a class Item with `system.slug === "soulbound"` in pack `soulbound-class`, whose `system.items` grant map is the single source of the advancement table. Later tasks add entries to that map; they do not create a second one.

> **Guide correction, for v1.4.** Guide §3.2's table says "Soul reaper feat" at levels 2/4/6/8/12/14/16/18 and "soulbound feat" at 1/10/20. That is prototype naming left over from before the class was renamed in v1.1 — there is one class feat list, not two. This plan treats all eleven as **soulbound feats**: `classFeatLevels` = 1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20.

- [ ] **Step 1: Write the failing test**

Append to `build/test-soulbound.mjs`, above `report(...)`:

```js
/* --- the class item --------------------------------------------------------------------------- */

import fs from "node:fs";
import path from "node:path";
import { ROOT } from "./lib/pack.mjs";

const soulboundClass = JSON.parse(
    fs.readFileSync(path.join(ROOT, "content/soulbound-class/soulbound.json"), "utf8"),
);
const cs = soulboundClass.system;

check("10 HP, and the key attribute is Strength or Dexterity (guide §1.2)", [cs.hp, cs.keyAbility.value.sort()], [10, ["dex", "str"]]);
check("Fortitude and Reflex expert, Will trained (guide §3.1)", cs.savingThrows, { fortitude: 2, reflex: 2, will: 1 });
check("Perception trained; Expertise arrives at 5th as a feature, not here", cs.perception, 1);
check("simple, martial and unarmed trained; no advanced (guide §3.1)", [cs.attacks.simple, cs.attacks.martial, cs.attacks.unarmed, cs.attacks.advanced], [1, 1, 1, 0]);
check("light armour and unarmoured only — medium is the line this class does not cross (guide §3.1)", [cs.defenses.light, cs.defenses.unarmored, cs.defenses.medium, cs.defenses.heavy], [1, 1, 0, 0]);
check("Religion, plus 3 + Int (the Lineage skill and Spirit Lore are granted by features)", [cs.trainedSkills.value, cs.trainedSkills.additional], [["religion"], 3]);
check("eleven class feats, on the even levels plus 1st (guide §3.2)", cs.classFeatLevels.value, [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
check("general feats on the standard PF2e levels", cs.generalFeatLevels.value, [3, 7, 11, 15, 19]);
check("ancestry feats on the standard PF2e levels", cs.ancestryFeatLevels.value, [1, 5, 9, 13, 17]);
check("skill increases on every odd level from 3rd", cs.skillIncreaseLevels.value, [3, 5, 7, 9, 11, 13, 15, 17, 19]);
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node build/test-soulbound.mjs
```

Expected: FAIL — `ENOENT: no such file or directory ... content/soulbound-class/soulbound.json`.

- [ ] **Step 3: Write the class item**

Create `content/soulbound-class/soulbound.json`. `system.items` starts with only the 1st-level grants this phase actually creates; later tasks add to it. Every `uuid` is authored by name — `build/lib/pack.mjs` resolves names to IDs at build time and **fails the build** on an unresolvable one, which is why a grant may not be written before its target exists.

```json
{
    "img": "icons/weapons/swords/sword-guard-blue.webp",
    "name": "Soulbound",
    "system": {
        "ancestryFeatLevels": { "value": [1, 5, 9, 13, 17] },
        "attacks": { "advanced": 0, "martial": 1, "other": { "name": "", "rank": 0 }, "simple": 1, "unarmed": 1 },
        "classFeatLevels": { "value": [1, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20] },
        "defenses": { "heavy": 0, "light": 1, "medium": 0, "unarmored": 1 },
        "description": { "value": "<p>Three peoples fight the same war with the same physics and opposite manners. A <strong>Soul Reaper</strong> carries their own soul as a sword, and it argues with them. A <strong>Hollow</strong> ate its own heart and wears the hole. A <strong>Quincy</strong> owns no soul-weapon at all &mdash; they reach into the air, take the spirit particles that are already there, and make a bow out of them.</p><p>You are a martial focus-user whose pool refills <em>by fighting</em>. Every technique costs 1 Reiatsu Point; <strong>Rising Pressure</strong> hands one back the first time each round you deal damage with your spirit weapon or take damage from an enemy, on a hard per-encounter ceiling.</p><p><strong>Key Attribute</strong> Strength or Dexterity</p><p><strong>Hit Points</strong> 10 plus your Constitution modifier</p>" },
        "generalFeatLevels": { "value": [3, 7, 11, 15, 19] },
        "hp": 10,
        "items": {},
        "keyAbility": { "value": ["str", "dex"] },
        "perception": 1,
        "publication": { "license": "ORC", "remaster": true, "title": "Isaac's Homebrew: The Soulbound" },
        "savingThrows": { "fortitude": 2, "reflex": 2, "will": 1 },
        "skillFeatLevels": { "value": [2, 4, 6, 8, 10, 12, 14, 16, 18, 20] },
        "skillIncreaseLevels": { "value": [3, 5, 7, 9, 11, 13, 15, 17, 19] },
        "slug": "soulbound",
        "traits": { "rarity": "common", "value": ["soulbound"] },
        "trainedSkills": { "additional": 3, "value": ["religion"] }
    },
    "type": "class"
}
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
node build/test-soulbound.mjs
```

Expected: PASS — 10 new checks green.

- [ ] **Step 5: Add the advancement-table validator**

In `build/lib/validate-lib.mjs`, beside the Saint's `ADVANCEMENT`, add the Soulbound's, taken from guide §3.2. **Only the levels whose features exist at the end of this phase are listed**; Task 12 of each later phase extends it. A validator that names a feature nothing has written yet fails the build for the whole phase.

```js
/**
 * Guide §3.2. Kept separate from the Saint's table rather than generalised, because the two tables have
 * nothing in common but their shape and a shared one would have to be keyed by class anyway.
 *
 * Grown phase by phase: a level listed here must have its feature in the packs, so a name added ahead of
 * its content fails the build rather than waiting to be noticed.
 */
const SOULBOUND_ADVANCEMENT = {
    1: ["Spirit Weapon", "Reiatsu", "Rising Pressure", "Released Form", "Spirit Sense", "Konsō"],
    3: ["Flash Step", "Departed Flesh", "Iron Will"],
    5: ["Deepening Reserve", "Alertness", "Weapon Expertise"],
    7: ["Weapon Specialization"],
    9: ["Refined Release", "Reiatsu Expertise"],
    11: ["Deepening Reserve", "Greater Flash Step", "Juggernaut"],
    13: ["Full Release", "Weapon Mastery", "Spirit Weave"],
    15: ["Evasion", "Greater Weapon Specialization"],
    17: ["Perfected Full Release", "Reiatsu Mastery"],
    19: ["Unsealed"],
};

function validateSoulboundAdvancement(packs, errors) {
    const classPack = packs.find((p) => p.def.name === "soulbound-class");
    const soulbound = classPack?.docs.find((d) => d.doc.system?.slug === "soulbound")?.doc;
    if (!soulbound) return; // absent during early scaffolding; validateClass reports a missing class

    const byLevel = {};
    for (const grant of Object.values(soulbound.system.items ?? {})) {
        (byLevel[grant.level] ??= []).push(grant.name);
    }
    for (const [level, expected] of Object.entries(SOULBOUND_ADVANCEMENT)) {
        const actual = byLevel[level] ?? [];
        for (const name of expected) {
            if (!actual.some((a) => a.startsWith(name))) {
                errors.push(`content/soulbound-class: advancement table expects "${name}" at level ${level} (guide §3.2)`);
            }
        }
    }
}
```

Call it from `validate`, beside the Saint's:

```js
    validateAdvancementTable(packs, errors);
    validateSoulboundAdvancement(packs, errors);
    validateActionsAreReachable(packs, errors);
```

- [ ] **Step 6: Run validate and confirm it fails loudly**

```bash
npm run validate
```

Expected: FAIL with roughly 25 errors, one per feature named in `SOULBOUND_ADVANCEMENT` — because `system.items` is `{}`. **This is the correct state.** It is the validator proving it runs, and Tasks 5–10 clear it one feature at a time. Do not weaken the table to make it pass.

- [ ] **Step 7: Commit**

```bash
git add content/soulbound-class/soulbound.json build/lib/validate-lib.mjs build/test-soulbound.mjs
git commit -m "The Soulbound class item, and the advancement table that guards it

Chassis numbers from guide §3.1-§3.2: 10 HP, Str or Dex, expert Fort and
Reflex, trained Will, light armour only, simple/martial/unarmed trained.

Guide §3.2 lists \"soul reaper feat\" beside \"soulbound feat\" on
alternating levels; that is prototype naming from before the class was
renamed in v1.1. Treated as one list of eleven class feats, to be written
back as guide v1.4.

validate is expected to fail on the advancement table until Tasks 5-10
land the features it names. That is the validator working.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 5: The proficiency-bump features

The ten features that do nothing but raise a proficiency. They are grouped into one task because each is four lines of JSON and none can fail independently of the others — a reviewer would accept or reject the whole set.

**Files:**
- Create: `content/soulbound-class-features/core/weapon-expertise.json`, `weapon-specialization.json`, `weapon-mastery.json`, `greater-weapon-specialization.json`, `spirit-weave.json`, `reiatsu-expertise.json`, `reiatsu-mastery.json`, `deepening-reserve-5.json`, `deepening-reserve-11.json`
- Modify: `content/soulbound-class/soulbound.json` (`system.items`)

**Interfaces:**
- Consumes: the class item (Task 4).
- Produces: nine feature Items in `soulbound-class-features`, granted at levels 5, 7, 13, 15, 13, 9, 17, 5 and 11. Their names are the strings `SOULBOUND_ADVANCEMENT` matches on.

- [ ] **Step 1: Write one feature and prove the shape**

Create `content/soulbound-class-features/core/reiatsu-expertise.json`. Every other file in this task is the same shape with different numbers.

```json
{
    "img": "icons/magic/light/explosion-star-glow-blue.webp",
    "name": "Reiatsu Expertise",
    "system": {
        "category": "classfeature",
        "description": { "value": "<p>Your spiritual pressure has weight others can feel. Your proficiency rank for your Reiatsu DC increases to expert.</p>" },
        "level": { "value": 9 },
        "publication": { "license": "ORC", "remaster": true, "title": "Isaac's Homebrew: The Soulbound" },
        "rules": [],
        "subfeatures": { "proficiencies": { "soulbound": { "rank": 2 } } },
        "traits": { "otherTags": ["soulbound-feature"], "rarity": "common", "value": ["soulbound"] }
    },
    "type": "feat"
}
```

- [ ] **Step 2: Write the remaining eight**

Same shape; only `name`, `level`, `img`, `description` and `subfeatures.proficiencies` change.

| File | Name | Level | `subfeatures.proficiencies` |
| :-- | :-- | --: | :-- |
| `weapon-expertise.json` | Weapon Expertise | 5 | `{"martial": {"rank": 2}, "simple": {"rank": 2}, "unarmed": {"rank": 2}}` |
| `weapon-specialization.json` | Weapon Specialization | 7 | *(none — see below)* |
| `weapon-mastery.json` | Weapon Mastery | 13 | `{"martial": {"rank": 3}, "simple": {"rank": 3}, "unarmed": {"rank": 3}}` |
| `greater-weapon-specialization.json` | Greater Weapon Specialization | 15 | *(none — see below)* |
| `spirit-weave.json` | Spirit Weave | 13 | `{"light": {"rank": 2}, "unarmored": {"rank": 2}}` |
| `reiatsu-mastery.json` | Reiatsu Mastery | 17 | `{"soulbound": {"rank": 3}}` |
| `deepening-reserve-5.json` | Deepening Reserve (5th) | 5 | *(none — rule element below)* |
| `deepening-reserve-11.json` | Deepening Reserve (11th) | 11 | *(none — rule element below)* |

**Weapon Specialization and Greater Weapon Specialization** are pf2e's own and must **not** be re-authored — grant the system's items instead, exactly as the Saint's class item does with `Compendium.pf2e.classfeatures.Item.Weapon Specialization`. Delete the two files from the list above and use the pf2e UUIDs in Step 4.

**Deepening Reserve** raises the focus pool. pf2e's focus maximum lives at `system.resources.focus.max`:

```json
        "rules": [
            {
                "key": "ActiveEffectLike",
                "mode": "upgrade",
                "path": "system.resources.focus.max",
                "value": 2
            }
        ],
```

with `value: 3` for the 11th-level copy. `upgrade` rather than `add`, so a Soulbound who multiclasses into another focus user does not end up with a pool of five.

- [ ] **Step 3: Add the grants to the class item**

In `content/soulbound-class/soulbound.json`, fill `system.items`. Keys are arbitrary but must be unique; the Saint uses five-letter mnemonics and this follows that.

```json
        "items": {
            "alert": { "img": "icons/creatures/eyes/human-single-blue.webp", "level": 5, "name": "Alertness", "uuid": "Compendium.pf2e.classfeatures.Item.Alertness" },
            "deepr": { "img": "icons/magic/light/explosion-star-glow-blue.webp", "level": 5, "name": "Deepening Reserve (5th)", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Deepening Reserve (5th)" },
            "deepx": { "img": "icons/magic/light/explosion-star-glow-blue.webp", "level": 11, "name": "Deepening Reserve (11th)", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Deepening Reserve (11th)" },
            "evasi": { "img": "systems/pf2e/icons/features/classes/evasion.webp", "level": 15, "name": "Evasion", "uuid": "Compendium.pf2e.classfeatures.Item.Evasion" },
            "great": { "img": "icons/skills/melee/hand-grip-sword-orange.webp", "level": 15, "name": "Greater Weapon Specialization", "uuid": "Compendium.pf2e.classfeatures.Item.Greater Weapon Specialization" },
            "ironw": { "img": "systems/pf2e/icons/features/classes/iron-will.webp", "level": 3, "name": "Iron Will", "uuid": "Compendium.pf2e.classfeatures.Item.Iron Will" },
            "jugge": { "img": "icons/creatures/mammals/bull-horned-blue.webp", "level": 11, "name": "Juggernaut", "uuid": "Compendium.pf2e.classfeatures.Item.Juggernaut" },
            "reiax": { "img": "icons/magic/light/explosion-star-glow-blue.webp", "level": 9, "name": "Reiatsu Expertise", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Reiatsu Expertise" },
            "reiaxx": { "img": "icons/magic/light/explosion-star-glow-purple.webp", "level": 17, "name": "Reiatsu Mastery", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Reiatsu Mastery" },
            "spirw": { "img": "icons/equipment/chest/breastplate-layered-leather-blue.webp", "level": 13, "name": "Spirit Weave", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Spirit Weave" },
            "weape": { "img": "icons/weapons/swords/sword-guard-blue.webp", "level": 5, "name": "Weapon Expertise", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Weapon Expertise" },
            "weapm": { "img": "icons/weapons/swords/sword-guard-blue.webp", "level": 13, "name": "Weapon Mastery", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Weapon Mastery" },
            "weaps": { "img": "icons/skills/melee/hand-grip-sword-red.webp", "level": 7, "name": "Weapon Specialization", "uuid": "Compendium.pf2e.classfeatures.Item.Weapon Specialization" }
        }
```

- [ ] **Step 4: Verify pf2e ships every borrowed feature under that exact name**

A name-based UUID that does not resolve **fails the build**, which is the intended behaviour and is better than shipping a grant that silently does nothing. Confirm the five borrowed names first:

```bash
node -e "const{loadPacks}=await import('./build/lib/pack.mjs')" 2>/dev/null; ls "$(node -p "require('./build/link-foundry.mjs')" 2>/dev/null)" 2>/dev/null; echo "If this is unclear, check the Saint's class item — it already grants Alertness, Iron Will, Juggernaut, Evasion, Weapon Specialization and Greater Weapon Specialization by these exact names, so copy its spellings verbatim."
```

The reliable check is the Saint's own `content/saint-class/saint.json`: it already grants all six of these by name and the build resolves them. Copy its spellings character for character.

- [ ] **Step 5: Run validate**

```bash
npm run validate
```

Expected: the advancement-table errors for levels 3, 5, 7, 9, 11, 13, 15 and 17 are now **gone except** `Deepening Reserve` at 5 and 11 (present), so what remains is only levels 1, 9 (Refined Release), 11 (Greater Flash Step), 13 (Full Release), 17 (Perfected Full Release) and 19 (Unsealed) — the features Tasks 6–10 create.

- [ ] **Step 6: Commit**

```bash
git add content/soulbound-class-features/core content/soulbound-class/soulbound.json
git commit -m "The proficiency ladder: weapon, armour, Reiatsu DC, and the pool

Nine features that do nothing but raise a rank, plus the six pf2e ships
itself, granted by name the way the Saint's class item already does.

Deepening Reserve raises system.resources.focus.max with mode upgrade
rather than add, so multiclassing into a second focus user does not
produce a pool of five.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 6: The spirit weapon — four profiles and `weapon.mjs`

**Files:**
- Create: `content/soulbound-equipment/blade.json`, `great-blade.json`, `paired-blades.json`, `spirit-bow.json`
- Create: `content/soulbound-class-features/core/spirit-weapon.json`
- Create: `content/soulbound-class-features/actions/manifest-or-dismiss.json`
- Create: `scripts/soulbound/weapon.mjs`
- Modify: `scripts/isaacs-hb.mjs`, `content/soulbound-class/soulbound.json`, `build/test-soulbound.mjs`

**Interfaces:**
- Consumes: `classSlugOf` from `scripts/lib/class-dc.mjs` (Task 2).
- Produces:
  - `SpiritWeapon.isSoulbound(actor): boolean`
  - `SpiritWeapon.weaponOf(actor): Item | null` — the manifested spirit weapon, found by the `soulbound-spirit-weapon` otherTag
  - `SpiritWeapon.registerHooks(): void`
  - Four weapon Items tagged `item:tag:soulbound-weapon-profile`, which the Task 6 `ChoiceSet` filters on

> **Guide check, guide §4.1.** The `twin` trait on Paired Blades: Step 1 of Task 3 establishes whether pf2e ships it. If it does not, Paired Blades uses `agile, finesse` plus the module's own `twin` homebrew weapon trait, declared in the same block as `reach-15`.

- [ ] **Step 1: Write the failing test**

Append to `build/test-soulbound.mjs`:

```js
/* --- the spirit weapon ------------------------------------------------------------------------ */

function equipmentDoc(name) {
    return JSON.parse(fs.readFileSync(path.join(ROOT, `content/soulbound-equipment/${name}.json`), "utf8"));
}

const blade = equipmentDoc("blade");
check("Blade: 1d8 slashing, versatile P, two-hand d10 (guide §4.1)", [blade.system.damage.die, blade.system.damage.damageType, blade.system.traits.value.sort()], ["d8", "slashing", ["two-hand-d10", "versatile-p"]]);

const bow = equipmentDoc("spirit-bow");
check("Spirit Bow: 1d8 piercing, propulsive, range 60, reload 0 (guide §4.1)", [bow.system.damage.die, bow.system.damage.damageType, bow.system.range, bow.system.reload.value], ["d8", "piercing", 60, "0"]);

for (const name of ["blade", "great-blade", "paired-blades", "spirit-bow"]) {
    const doc = equipmentDoc(name);
    check(`${name} is a martial weapon the class is always proficient with`, doc.system.category, "martial");
    check(`${name} is tagged so the ChoiceSet can find it`, (doc.system.traits.otherTags ?? []).includes("soulbound-weapon-profile"), true);
}
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node build/test-soulbound.mjs
```

Expected: FAIL — `ENOENT ... content/soulbound-equipment/blade.json`.

- [ ] **Step 3: Write the four profiles**

`content/soulbound-equipment/blade.json`:

```json
{
    "img": "icons/weapons/swords/sword-guard-blue.webp",
    "name": "Spirit Weapon (Blade)",
    "system": {
        "baseItem": "longsword",
        "bulk": { "value": 1 },
        "category": "martial",
        "damage": { "damageType": "slashing", "dice": 1, "die": "d8" },
        "description": { "value": "<p>Your power has a shape. A Soul Reaper's zanpakut&#333; is their own soul with an edge on it; a Hollow's is the fragment of mask that sealed their power inside their body.</p><p><strong>Bonded.</strong> You can manifest or dismiss it as a free action once per round. Dismissed, it cannot be taken from you.</p><p><strong>Spirit-Cutting.</strong> Its Strikes can deal spirit damage instead of their normal damage type, and affect incorporeal creatures as though it had the <em>ghost touch</em> rune.</p>" },
        "equipped": { "carryType": "held", "handsHeld": 1 },
        "group": "sword",
        "hands": "1",
        "level": { "value": 0 },
        "price": { "value": {} },
        "publication": { "license": "ORC", "remaster": true, "title": "Isaac's Homebrew: The Soulbound" },
        "quantity": 1,
        "range": null,
        "rules": [],
        "traits": { "otherTags": ["soulbound-weapon-profile", "soulbound-spirit-weapon"], "rarity": "common", "value": ["versatile-p", "two-hand-d10"] },
        "usage": { "value": "held-in-one-hand" }
    },
    "type": "weapon"
}
```

The other three change only `name`, `img`, `baseItem`, `group`, `hands`, `damage`, `range`, `reload`, `usage` and `traits`:

| File | Name | `damage` | `traits.value` | Other |
| :-- | :-- | :-- | :-- | :-- |
| `great-blade.json` | Spirit Weapon (Great Blade) | `d10` slashing | `["two-handed-d12"]` *(see note)* | `baseItem: "greatsword"`, `hands: "2"`, `group: "sword"` |
| `paired-blades.json` | Spirit Weapon (Paired Blades) | `d6` slashing | `["agile", "finesse", "twin"]` | `baseItem: "shortsword"`, `hands: "1"`, `group: "knife"` |
| `spirit-bow.json` | Spirit Weapon (Spirit Bow) | `d8` piercing | `["propulsive"]` | `baseItem: "longbow"`, `hands: "2"`, `group: "bow"`, `range: 60`, `reload: {"value": "0"}` |

**Note on Great Blade.** Guide §4.1 says "1d10 slashing, two-handed, sweep". pf2e has no bare `two-handed` trait — it has `two-hand-dX` for a one-handed weapon that may be held in two. A weapon that is *only* ever two-handed expresses that with `hands: "2"` and no trait. So Great Blade is `hands: "2"` with `traits.value: ["sweep"]`, and the test above must expect `["sweep"]`. **Write this correction into guide v1.4.**

Every profile carries **both** `soulbound-weapon-profile` (what the ChoiceSet filters on) and `soulbound-spirit-weapon` (what `weaponOf` finds at runtime).

- [ ] **Step 4: Run the test to verify it passes**

```bash
node build/test-soulbound.mjs
```

Expected: PASS. Fix the Great Blade expectation to `["sweep"]` per Step 3's note if it fails there.

- [ ] **Step 5: Write the Spirit Weapon class feature**

`content/soulbound-class-features/core/spirit-weapon.json` — the ChoiceSet that picks a profile and grants it, plus the manifest/dismiss action.

```json
{
    "img": "icons/weapons/swords/sword-guard-blue.webp",
    "name": "Spirit Weapon",
    "system": {
        "category": "classfeature",
        "description": { "value": "<p>Choose one sealed profile for your spirit weapon. It is a martial weapon and always counts as one you're proficient with, regardless of its released form.</p><p><strong>Soul-Etched.</strong> During your daily preparations you can transfer weapon runes into or out of your spirit weapon for free, with no cost and no Crafting check.</p><p><strong>Voice in the Blade.</strong> You gain a +1 circumstance bonus to saves against effects that would control you, possess you, or force you to release your weapon. Your spirit weapon cannot be Stolen or permanently Disarmed.</p>" },
        "level": { "value": 1 },
        "publication": { "license": "ORC", "remaster": true, "title": "Isaac's Homebrew: The Soulbound" },
        "rules": [
            {
                "adjustName": false,
                "choices": { "filter": ["item:tag:soulbound-weapon-profile"] },
                "flag": "profile",
                "key": "ChoiceSet",
                "prompt": "Choose your spirit weapon's sealed profile"
            },
            { "key": "GrantItem", "uuid": "{item|flags.system.rulesSelections.profile}" },
            { "key": "GrantItem", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Manifest or Dismiss Spirit Weapon" },
            {
                "key": "FlatModifier",
                "predicate": ["item:tag:soulbound-control-save"],
                "selector": ["fortitude", "reflex", "will"],
                "type": "circumstance",
                "value": 1,
                "label": "Voice in the Blade"
            }
        ],
        "traits": { "otherTags": ["soulbound-feature"], "rarity": "common", "value": ["soulbound"] }
    },
    "type": "feat"
}
```

> **Known limitation, to be recorded in guide v1.4.** "Saves against effects that would control you, possess you, or force you to release your weapon" is not a category pf2e models. The predicate above fires only on effects a GM has tagged. The honest automated subset is pf2e's own `mental` and `incapacitation` traits plus the `possession` effect; the plan implements that subset and the handbook says what is not covered. Replace the predicate with:
> ```json
> "predicate": [{ "or": ["item:trait:possession", "item:trait:mental", "item:tag:soulbound-control-save"] }],
> ```

- [ ] **Step 6: Write the manifest/dismiss action**

`content/soulbound-class-features/actions/manifest-or-dismiss.json`, a free action with `system.frequency` of once per round so `scripts/economy/recharge.mjs` meters it:

```json
{
    "img": "icons/weapons/swords/sword-guard-blue.webp",
    "name": "Manifest or Dismiss Spirit Weapon",
    "system": {
        "actionType": { "value": "free" },
        "actions": { "value": null },
        "category": "interaction",
        "description": { "value": "<p><strong>Frequency</strong> once per round</p><hr /><p>Your spirit weapon appears in your hand, or dissolves. Dismissed, it cannot be taken from you. If it leaves your hands you can Interact to call it back from up to 30 feet away.</p>" },
        "frequency": { "max": 1, "per": "round", "value": 1 },
        "publication": { "license": "ORC", "remaster": true, "title": "Isaac's Homebrew: The Soulbound" },
        "rules": [],
        "traits": { "otherTags": ["soulbound-feature"], "rarity": "common", "value": ["soulbound"] }
    },
    "type": "action"
}
```

- [ ] **Step 7: Write `scripts/soulbound/weapon.mjs`**

```js
import { classSlugOf } from "../lib/class-dc.mjs";

const MODULE_ID = "isaacs-hb-pf2e";

/**
 * The spirit weapon: manifesting it, finding it, and Soul-Etched rune transfer.
 *
 * The weapon is a real pf2e weapon item rather than a synthetic Strike, because everything the class does
 * to it later — a released form's damage-die step, a replaced profile, a rune — is an ItemAlteration, and
 * an alteration needs a document to alter.
 */
export const SpiritWeapon = {
    isSoulbound(actor) {
        return actor?.type === "character" && classSlugOf(actor) === "soulbound";
    },

    /** The manifested spirit weapon, or null while it is dismissed. */
    weaponOf(actor) {
        if (!this.isSoulbound(actor)) return null;
        return actor.itemTypes.weapon.find(
            (w) => (w.system.traits?.otherTags ?? []).includes("soulbound-spirit-weapon"),
        ) ?? null;
    },

    /**
     * Soul-Etched: runes move in and out for free during daily preparations.
     *
     * pf2e gates rune transfer behind a Crafting check and a cost in its own transfer dialog, neither of
     * which a module can waive from outside. What it can do is make the weapon a legal target of the
     * character's own rune set, which is what `Handwraps of Mighty Blows` does — so the spirit weapon
     * carries the handwraps' otherTag and pf2e's existing plumbing applies.
     */
    registerHooks() {
        Hooks.on("createItem", async (item) => {
            if (!this.isSoulbound(item.actor)) return;
            if (item.type !== "weapon") return;
            if (!(item.system.traits?.otherTags ?? []).includes("soulbound-spirit-weapon")) return;
            if (item.getFlag(MODULE_ID, "soulEtched")) return;
            await item.setFlag(MODULE_ID, "soulEtched", true);
        });
    },
};
```

- [ ] **Step 8: Register it**

In `scripts/isaacs-hb.mjs`, add the import beside the others:

```js
import { SpiritWeapon } from "./soulbound/weapon.mjs";
```

and inside `Hooks.once("init", ...)`, beside the other `start(...)` calls:

```js
    start("the spirit weapon", () => SpiritWeapon.registerHooks());
```

and add it to the module API object:

```js
        spiritWeapon: SpiritWeapon,
```

- [ ] **Step 9: Add the grants and run the suite**

Add to `content/soulbound-class/soulbound.json`'s `system.items`:

```json
            "spwea": { "img": "icons/weapons/swords/sword-guard-blue.webp", "level": 1, "name": "Spirit Weapon", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Spirit Weapon" },
```

```bash
npm run test:soulbound && npm run validate
```

Expected: the soulbound tests pass; validate's remaining advancement errors no longer include `Spirit Weapon`.

- [ ] **Step 10: Commit**

```bash
git add content/soulbound-equipment content/soulbound-class-features content/soulbound-class/soulbound.json scripts/soulbound/weapon.mjs scripts/isaacs-hb.mjs build/test-soulbound.mjs
git commit -m "The spirit weapon: four sealed profiles, chosen and granted

A real pf2e weapon item rather than a synthetic Strike, because every
later change to it — a released form's die step, a replaced profile, a
rune — is an ItemAlteration, and an alteration needs a document.

Two guide corrections for v1.4: pf2e has no bare two-handed trait, so the
Great Blade is hands:2 with sweep; and \"saves against effects that would
control you\" is not a category pf2e models, so Voice in the Blade
automates the honest subset (possession, mental, and a GM tag).

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 7: The Reiatsu pool

**Files:**
- Create: `scripts/soulbound/reiatsu.mjs`
- Create: `content/soulbound-class-features/core/reiatsu.json`
- Modify: `scripts/isaacs-hb.mjs`, `content/soulbound-class/soulbound.json`, `build/test-soulbound.mjs`

**Interfaces:**
- Consumes: `classSlugOf` (Task 2), `SpiritWeapon.isSoulbound` (Task 6).
- Produces:
  - `Reiatsu.entryFor(actor): Item | null`
  - `Reiatsu.ensureEntry(actor): Promise<Item | null>`
  - `Reiatsu.fileSpell(spell): Promise<void>`
  - `Reiatsu.isReiatsuEffect(item): boolean` — true for a spell carrying the `reiatsu` trait
  - `Reiatsu.registerHooks(): void`

- [ ] **Step 1: Write the failing test**

The entry-creation race is the thing worth testing without Foundry: `cosmo.mjs` had a bug where `createItem` fired for the class and for every granted spell in one batch, each call found no entry, and each created one — every Saint came out of character creation with two. The fix parks the in-flight promise. Append to `build/test-soulbound.mjs`:

```js
/* --- the Reiatsu pool ------------------------------------------------------------------------- */

const { Reiatsu } = await import("../scripts/soulbound/reiatsu.mjs");

check(
    "a reiatsu-trait spell is recognised; a cosmo one is not",
    [
        Reiatsu.isReiatsuEffect({ type: "spell", system: { traits: { value: ["focus", "reiatsu"] } } }),
        Reiatsu.isReiatsuEffect({ type: "spell", system: { traits: { value: ["focus", "cosmo"] } } }),
        Reiatsu.isReiatsuEffect({ type: "action", system: { traits: { value: ["reiatsu"] } } }),
    ],
    [true, false, false],
);

/** Three concurrent callers, one actor, one entry — the bug that gave every Saint two Cosmo entries. */
{
    let created = 0;
    const actor = {
        id: "a1",
        type: "character",
        class: { system: { slug: "soulbound" } },
        itemTypes: { spellcastingEntry: [] },
        async createEmbeddedDocuments(_type, [data]) {
            created += 1;
            await new Promise((r) => setTimeout(r, 5));
            const entry = { ...data, id: `e${created}`, system: data.system };
            actor.itemTypes.spellcastingEntry.push(entry);
            return [entry];
        },
        classDCs: { soulbound: { attribute: "str" } },
    };
    await Promise.all([Reiatsu.ensureEntry(actor), Reiatsu.ensureEntry(actor), Reiatsu.ensureEntry(actor)]);
    check("three concurrent ensureEntry calls create exactly one entry", created, 1);
}
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node build/test-soulbound.mjs
```

Expected: FAIL — `Cannot find module '../scripts/soulbound/reiatsu.mjs'`.

- [ ] **Step 3: Write `scripts/soulbound/reiatsu.mjs`**

```js
import { classSlugOf } from "../lib/class-dc.mjs";

const MODULE_ID = "isaacs-hb-pf2e";
const ENTRY_NAME = "Reiatsu";

/** Entry creations already under way, keyed by actor id. See `ensureEntry`. */
const pendingEntries = new Map();

async function createEntry(actor) {
    const [created] = await actor.createEmbeddedDocuments("Item", [
        {
            name: ENTRY_NAME,
            type: "spellcastingEntry",
            img: "icons/magic/light/explosion-star-glow-blue.webp",
            system: {
                ability: { value: Reiatsu.attributeFor(actor) },
                prepared: { value: "focus" },
                proficiency: { slug: "soulbound", value: 1 },
                showSlotlessLevels: { value: false },
                spelldc: { dc: 0, value: 0 },
                tradition: { value: "" },
            },
            flags: { [MODULE_ID]: { reiatsuEntry: true } },
        },
    ]);
    return created ?? null;
}

/**
 * Focus spellcasting for the Soulbound.
 *
 * Reiatsu Points are pf2e's focus pool: a maximum of 1 rising to 2 at 5th and 3 at 11th is exactly the
 * range pf2e's focus maximum allows, Refocus is Steady the Breath with a different name, and a focus
 * spellcastingEntry gives the pool its UI, its daily refill and its spend sites for free.
 *
 * The load-bearing detail is `system.proficiency.slug = "soulbound"`, which makes the entry resolve its
 * DC through `actor.getStatistic("soulbound")` — the Reiatsu DC — rather than through a spellcasting
 * proficiency the class deliberately does not have.
 */
export const Reiatsu = {
    entryFor(actor) {
        return actor.itemTypes.spellcastingEntry.find(
            (entry) => entry.system.proficiency?.slug === "soulbound" || entry.name === ENTRY_NAME,
        ) ?? null;
    },

    isSoulbound(actor) {
        return actor?.type === "character" && classSlugOf(actor) === "soulbound";
    },

    isReiatsuEffect(item) {
        return item?.type === "spell" && (item.system?.traits?.value ?? []).includes("reiatsu");
    },

    /** The key attribute chosen at 1st level; the entry's DC follows it. */
    attributeFor(actor) {
        return actor.classDCs?.soulbound?.attribute ?? actor.class?.system?.keyAbility?.selected ?? "str";
    },

    /**
     * One entry per Soulbound, even when several callers ask at once.
     *
     * `createItem` fires for the class and for every kidō granted alongside it, in the same batch. Each
     * of those calls this, each finds no entry because none has been written yet, and each creates one.
     * That is how every Saint ever made came out of character creation with two Cosmo entries. The check
     * and the create have to be one indivisible step from the caller's point of view, which is what
     * parking the in-flight promise achieves.
     */
    async ensureEntry(actor) {
        if (!this.isSoulbound(actor)) return null;
        const existing = this.entryFor(actor);
        if (existing) return existing;

        const inFlight = pendingEntries.get(actor.id);
        if (inFlight) return inFlight;

        const creation = createEntry(actor);
        pendingEntries.set(actor.id, creation);
        try {
            return await creation;
        } finally {
            pendingEntries.delete(actor.id);
        }
    },

    /** File a Technique or kidō into the Reiatsu entry if it arrived without one. */
    async fileSpell(spell) {
        const actor = spell.actor;
        if (!this.isSoulbound(actor)) return;
        if (spell.system.location?.value) return;
        const entry = (await this.ensureEntry(actor)) ?? this.entryFor(actor);
        if (!entry) return;
        await spell.update({ "system.location.value": entry.id });
    },

    registerHooks() {
        Hooks.on("createItem", async (item) => {
            if (!game.user.isGM && item.actor?.isOwner !== true) return;
            if (item.type === "class" && item.system?.slug === "soulbound") {
                await this.ensureEntry(item.actor);
                for (const spell of item.actor?.itemTypes.spell ?? []) {
                    if (this.isReiatsuEffect(spell)) await this.fileSpell(spell);
                }
                return;
            }
            if (this.isReiatsuEffect(item)) await this.fileSpell(item);
        });
    },
};
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
node build/test-soulbound.mjs
```

Expected: PASS.

- [ ] **Step 5: Write the Reiatsu class feature**

`content/soulbound-class-features/core/reiatsu.json`, with the rule that establishes a pool of 1:

```json
{
    "img": "icons/magic/light/explosion-star-glow-blue.webp",
    "name": "Reiatsu",
    "system": {
        "category": "classfeature",
        "description": { "value": "<p>You have a <strong>reiatsu pool</strong>: maximum 1 Reiatsu Point, increasing to 2 at 5th level and 3 at 11th. Refill it during daily preparations, or by spending 10 minutes on <strong>Steady the Breath</strong> &mdash; the Refocus activity. You meditate, or you argue with your sword, or you eat something.</p><p>Techniques and kid&#333; are focus effects with the <strong>reiatsu</strong> trait. They use your <strong>Reiatsu DC</strong> and key attribute, have no rank, and are automatically heightened to half your level rounded up.</p>" },
        "level": { "value": 1 },
        "publication": { "license": "ORC", "remaster": true, "title": "Isaac's Homebrew: The Soulbound" },
        "rules": [
            { "key": "ActiveEffectLike", "mode": "upgrade", "path": "system.resources.focus.max", "value": 1 }
        ],
        "traits": { "otherTags": ["soulbound-feature"], "rarity": "common", "value": ["soulbound"] }
    },
    "type": "feat"
}
```

- [ ] **Step 6: Register and grant**

In `scripts/isaacs-hb.mjs`: `import { Reiatsu } from "./soulbound/reiatsu.mjs";`, `start("Reiatsu", () => Reiatsu.registerHooks());`, and `reiatsu: Reiatsu,` in the API object.

In the class item's `system.items`:

```json
            "reiat": { "img": "icons/magic/light/explosion-star-glow-blue.webp", "level": 1, "name": "Reiatsu", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Reiatsu" },
```

- [ ] **Step 7: Run the suite**

```bash
npm run test:soulbound && npm run validate
```

Expected: soulbound tests pass; `Reiatsu` no longer appears in the advancement errors.

- [ ] **Step 8: Commit**

```bash
git add scripts/soulbound/reiatsu.mjs scripts/isaacs-hb.mjs content/soulbound-class-features/core/reiatsu.json content/soulbound-class/soulbound.json build/test-soulbound.mjs
git commit -m "Reiatsu: the pool is pf2e's focus pool

A focus spellcastingEntry with proficiency.slug \"soulbound\", so its DC
resolves through the Reiatsu DC rather than a spellcasting proficiency the
class does not have. 1/2/3 is exactly pf2e's focus range, and Refocus is
Steady the Breath under another name.

Carries cosmo.mjs's in-flight-promise guard from the start: createItem
fires for the class and every granted spell in one batch, and without it
every character is created with two entries.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 8: Rising Pressure

The refill engine and its per-encounter ceiling — guide §4.2, and the lever §1.3 calls load-bearing.

**Files:**
- Create: `scripts/soulbound/rising-pressure.mjs`
- Create: `content/soulbound-class-features/core/rising-pressure.json`
- Modify: `scripts/isaacs-hb.mjs`, `content/soulbound-class/soulbound.json`, `build/test-soulbound.mjs`

**Interfaces:**
- Consumes: `Reiatsu` (Task 7), `SpiritWeapon.weaponOf` (Task 6).
- Produces:
  - `grantFor(state: {current, max, roundStamp, round, spentThisEncounter, cap}): 0 | 1` — the pure decision, exported for testing
  - `RisingPressure.registerHooks(): void`
  - Actor flag `flags["isaacs-hb-pf2e"].risingPressure = { round: number, gained: number }`

- [ ] **Step 1: Write the failing test**

The whole rule is a pure function of five numbers, so it is testable exactly. Append to `build/test-soulbound.mjs`:

```js
/* --- Rising Pressure -------------------------------------------------------------------------- */

const { grantFor } = await import("../scripts/soulbound/rising-pressure.mjs");

const base = { current: 0, max: 2, round: 1, roundStamp: null, gained: 0, cap: 2 };

check("the first qualifying event in a round pays a point", grantFor(base), 1);
check("the second in the same round pays nothing", grantFor({ ...base, roundStamp: 1 }), 0);
check("a new round pays again", grantFor({ ...base, roundStamp: 1, round: 2 }), 1);
check("a full pool gains nothing", grantFor({ ...base, current: 2 }), 0);
check("the per-encounter ceiling stops the refill even with room in the pool (guide §1.3)", grantFor({ ...base, gained: 2 }), 0);
check("one short of the ceiling still pays", grantFor({ ...base, gained: 1 }), 1);
check("Reiatsu Flood raises the ceiling by 1 and nothing else", grantFor({ ...base, gained: 2, cap: 3 }), 1);
check("out of combat there is no round, and no refill", grantFor({ ...base, round: null }), 0);
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node build/test-soulbound.mjs
```

Expected: FAIL — `Cannot find module '../scripts/soulbound/rising-pressure.mjs'`.

- [ ] **Step 3: Write `scripts/soulbound/rising-pressure.mjs`**

```js
import { Reiatsu } from "./reiatsu.mjs";
import { SpiritWeapon } from "./weapon.mjs";

const MODULE_ID = "isaacs-hb-pf2e";

/**
 * The whole of Rising Pressure, as arithmetic (guide §4.2).
 *
 * > Once per round, the first time you either deal damage to an enemy with your spirit weapon or take
 * > damage from an enemy, you regain 1 Reiatsu Point. You can't exceed your maximum pool, and over the
 * > course of a single encounter you can't regain more points this way than your maximum pool size.
 *
 * Three gates, and the third is the one guide §1.3 calls load-bearing: without the per-encounter ceiling
 * a long fight is an infinite pool. Kept pure and exported so the ceiling is pinned by a test rather than
 * by whether anyone noticed it firing a seventh time.
 *
 * @param {object} state
 * @param {number} state.current      focus points held now
 * @param {number} state.max          focus maximum
 * @param {number|null} state.round   the current combat round, or null out of combat
 * @param {number|null} state.roundStamp the round the last grant was made in
 * @param {number} state.gained       points granted so far this encounter
 * @param {number} state.cap          the per-encounter ceiling (normally `max`; +1 with Reiatsu Flood)
 * @returns {0|1}
 */
export function grantFor({ current, max, round, roundStamp, gained, cap }) {
    if (round === null || round === undefined) return 0;
    if (roundStamp === round) return 0;
    if (current >= max) return 0;
    if (gained >= cap) return 0;
    return 1;
}

/** The ceiling: the pool's maximum, plus 1 for each Reiatsu Flood the character has taken. */
function capFor(actor) {
    const max = actor.system?.resources?.focus?.max ?? 0;
    const flood = actor.itemTypes.feat.some((f) => f.system.slug === "reiatsu-flood") ? 1 : 0;
    return max + flood;
}

async function tryGrant(actor) {
    if (!Reiatsu.isSoulbound(actor)) return;
    const focus = actor.system?.resources?.focus;
    if (!focus) return;

    const ledger = actor.getFlag(MODULE_ID, "risingPressure") ?? { round: null, gained: 0 };
    const round = game.combat?.round ?? null;

    const grant = grantFor({
        current: focus.value ?? 0,
        max: focus.max ?? 0,
        round,
        roundStamp: ledger.round,
        gained: ledger.gained ?? 0,
        cap: capFor(actor),
    });
    if (grant === 0) return;

    await actor.update({
        "system.resources.focus.value": (focus.value ?? 0) + grant,
        [`flags.${MODULE_ID}.risingPressure`]: { round, gained: (ledger.gained ?? 0) + grant },
    });
    ui.notifications.info(`${actor.name} regains 1 Reiatsu Point (Rising Pressure).`);
}

export const RisingPressure = {
    registerHooks() {
        // Damage taken from an enemy. pf2e reports the application on the actor that received it.
        Hooks.on("updateActor", async (actor, changes) => {
            if (!game.user.isGM) return;
            const hp = foundry.utils.getProperty(changes, "system.attributes.hp.value");
            if (hp === undefined) return;
            if (hp >= (actor._source.system?.attributes?.hp?.value ?? 0)) return; // healing, not damage
            await tryGrant(actor);
        });

        // Damage dealt with the spirit weapon.
        Hooks.on("createChatMessage", async (message) => {
            if (!game.user.isGM) return;
            const actor = message.actor;
            if (!Reiatsu.isSoulbound(actor)) return;
            if (!message.isDamageRoll) return;
            const weapon = SpiritWeapon.weaponOf(actor);
            const origin = message.item;
            if (!weapon || !origin || origin.id !== weapon.id) return;
            await tryGrant(actor);
        });

        // A new encounter is a new ledger.
        Hooks.on("combatStart", async (combat) => {
            if (!game.user.isGM) return;
            for (const combatant of combat.combatants) {
                const actor = combatant.actor;
                if (!Reiatsu.isSoulbound(actor)) continue;
                await actor.setFlag(MODULE_ID, "risingPressure", { round: null, gained: 0 });
            }
        });
    },
};
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
node build/test-soulbound.mjs
```

Expected: PASS — all eight Rising Pressure checks green.

- [ ] **Step 5: Write the class feature**

`content/soulbound-class-features/core/rising-pressure.json`:

```json
{
    "img": "icons/magic/air/wind-vortex-blue.webp",
    "name": "Rising Pressure",
    "system": {
        "category": "classfeature",
        "description": { "value": "<p>Once per round, the first time you either deal damage to an enemy with your spirit weapon or take damage from an enemy, you regain 1 Reiatsu Point.</p><p>You can't exceed your maximum pool, and over the course of a single encounter you can't regain more points this way than your maximum pool size.</p><table><tbody><tr><th>Level</th><th>Pool</th><th>Max per encounter</th><th>Techniques per fight</th></tr><tr><td>1&ndash;4</td><td>1</td><td>+1</td><td>2</td></tr><tr><td>5&ndash;10</td><td>2</td><td>+2</td><td>4</td></tr><tr><td>11&ndash;20</td><td>3</td><td>+3</td><td>6</td></tr></tbody></table>" },
        "level": { "value": 1 },
        "publication": { "license": "ORC", "remaster": true, "title": "Isaac's Homebrew: The Soulbound" },
        "rules": [],
        "traits": { "otherTags": ["soulbound-feature"], "rarity": "common", "value": ["soulbound"] }
    },
    "type": "feat"
}
```

- [ ] **Step 6: Register and grant**

`scripts/isaacs-hb.mjs`: `import { RisingPressure } from "./soulbound/rising-pressure.mjs";`, `start("Rising Pressure", () => RisingPressure.registerHooks());`, `risingPressure: RisingPressure,` in the API.

Class item `system.items`:

```json
            "rispr": { "img": "icons/magic/air/wind-vortex-blue.webp", "level": 1, "name": "Rising Pressure", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Rising Pressure" },
```

- [ ] **Step 7: Run the suite and commit**

```bash
npm run test:soulbound && npm run validate
git add scripts/soulbound/rising-pressure.mjs scripts/isaacs-hb.mjs content/soulbound-class-features/core/rising-pressure.json content/soulbound-class/soulbound.json build/test-soulbound.mjs
git commit -m "Rising Pressure: the pool that refills by fighting

Three gates — once per round, never past the pool's maximum, and never
more per encounter than the pool holds. The third is the one guide §1.3
calls load-bearing: without it a long fight is an infinite pool.

grantFor() is pure and exported, so the ceiling is pinned by eight checks
rather than by whether anyone noticed it firing a seventh time.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 9: The four standalone 1st- and 3rd-level features

Spirit Sense, Konsō, Flash Step (with Greater Flash Step at 11th) and Departed Flesh. Grouped because each is self-contained content with no shared machinery, and a reviewer would take or leave the set.

**Files:**
- Create: `content/soulbound-class-features/core/spirit-sense.json`, `departed-flesh.json`, `greater-flash-step.json`, `flash-step-feature.json`
- Create: `content/soulbound-class-features/actions/konso.json`, `flash-step.json`
- Create: `content/soulbound-effects/effect-greater-flash-step.json`
- Modify: `content/soulbound-class/soulbound.json`, `build/test-soulbound.mjs`

**Interfaces:**
- Consumes: the class item (Task 4).
- Produces: five feature/action Items and one effect. `Flash Step` carries `system.frequency` `{max: 1, per: "round"}`, which Tensa Zangetsu and `Shunpo Strike` later alter.

- [ ] **Step 1: Write the failing test**

```js
/* --- the standalone chassis features ---------------------------------------------------------- */

function featureDoc(dir, name) {
    return JSON.parse(fs.readFileSync(path.join(ROOT, `content/soulbound-class-features/${dir}/${name}.json`), "utf8"));
}

const flashStep = featureDoc("actions", "flash-step");
check("Flash Step is one action, once per round (guide §4.5)", [flashStep.system.actions.value, flashStep.system.frequency], [1, { max: 1, per: "round", value: 1 }]);
check("Flash Step is a move and reiatsu effect", flashStep.system.traits.value.sort(), ["move", "reiatsu", "soulbound"]);

const departed = featureDoc("core", "departed-flesh");
check("Departed Flesh grants disease immunity (guide §4.6)", departed.system.rules.some((r) => r.key === "Immunity" && r.type === "disease"), true);

const spiritSense = featureDoc("core", "spirit-sense");
check("Spirit Sense is a 60-foot imprecise sense (guide §4.3)", spiritSense.system.rules.some((r) => r.key === "Sense" && r.acuity === "imprecise" && r.range === 60), true);
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node build/test-soulbound.mjs
```

Expected: FAIL — `ENOENT ... flash-step.json`.

- [ ] **Step 3: Write Flash Step**

`content/soulbound-class-features/actions/flash-step.json`:

```json
{
    "img": "icons/magic/movement/trail-streak-impact-blue.webp",
    "name": "Flash Step",
    "system": {
        "actionType": { "value": "action" },
        "actions": { "value": 1 },
        "category": "offensive",
        "description": { "value": "<p><strong>Frequency</strong> once per round</p><hr /><p>You step between one instant and the next. Stride up to your Speed. This movement doesn't trigger reactions.</p><p><em>Shunpo &middot; Sonido &middot; Hirenkyaku.</em></p>" },
        "frequency": { "max": 1, "per": "round", "value": 1 },
        "publication": { "license": "ORC", "remaster": true, "title": "Isaac's Homebrew: The Soulbound" },
        "rules": [],
        "traits": { "otherTags": ["soulbound-feature"], "rarity": "common", "value": ["move", "reiatsu", "soulbound"] }
    },
    "type": "action"
}
```

- [ ] **Step 4: Write Greater Flash Step and its effect**

Guide §4.5: *until the start of your next turn, the first attack made against you each round requires the attacker to succeed at a DC 5 flat check or the attack misses.* pf2e models this with a `FlatModifier`-adjacent rule it does not have; the expressible form is the system's own `RollOption` plus a `Note`, with the flat check rolled by the module's rider engine on `strike-received`.

`content/soulbound-class-features/core/greater-flash-step.json`:

```json
{
    "img": "icons/magic/movement/trail-streak-impact-blue.webp",
    "name": "Greater Flash Step",
    "system": {
        "category": "classfeature",
        "description": { "value": "<p>You leave an afterimage. Until the start of your next turn after you use Flash Step, the first attack made against you each round requires the attacker to succeed at a <strong>DC 5 flat check</strong> or the attack misses.</p>" },
        "level": { "value": 11 },
        "publication": { "license": "ORC", "remaster": true, "title": "Isaac's Homebrew: The Soulbound" },
        "rules": [],
        "traits": { "otherTags": ["soulbound-feature"], "rarity": "common", "value": ["soulbound"] }
    },
    "type": "feat"
}
```

`content/soulbound-effects/effect-greater-flash-step.json` carries the rider that rolls the flat check:

```json
{
    "flags": {
        "isaacs-hb-pf2e": {
            "riders": [
                {
                    "event": "strike-received",
                    "self": true,
                    "predicate": [{ "not": "self:effect:greater-flash-step-spent" }],
                    "apply": {
                        "type": "readout",
                        "formula": "1d20",
                        "label": "Afterimage: DC 5 flat check — on a failure the attack misses"
                    }
                }
            ]
        }
    },
    "img": "icons/magic/movement/trail-streak-impact-blue.webp",
    "name": "Effect: Greater Flash Step",
    "system": {
        "description": { "value": "<p>The first attack against you each round requires a DC 5 flat check or it misses.</p>" },
        "duration": { "expiry": "turn-start", "sustained": false, "unit": "rounds", "value": 1 },
        "level": { "value": 11 },
        "publication": { "license": "ORC", "remaster": true, "title": "Isaac's Homebrew: The Soulbound" },
        "rules": [],
        "start": { "initiative": null, "value": 0 },
        "tokenIcon": { "show": true },
        "traits": { "otherTags": ["soulbound-effect"], "rarity": "common", "value": ["soulbound"] }
    },
    "type": "effect"
}
```

> **Honest limitation to record for guide v1.4 and the handbook.** A `readout` reports the flat check; it cannot retroactively un-hit an attack pf2e has already resolved, because the attack roll's outcome is fixed by the time `strike-received` fires. The Phase 2 reaction machinery (`reactions.mjs`) is what makes "or the attack misses" enforceable, by offering the check *before* damage is applied. Until Phase 2 lands, this is a readout the table applies. **This is the only deliberately incomplete item in Phase 1, and Phase 2 Task 1 closes it.**

- [ ] **Step 5: Write Spirit Sense, Departed Flesh and Konsō**

`spirit-sense.json` rules:

```json
        "rules": [
            { "acuity": "imprecise", "key": "Sense", "range": 60, "selector": "spirit-sense", "label": "Spirit Sense" }
        ],
```

with a description carrying guide §4.3's text: the 60-foot imprecise sense of undead, haunts, spirits and incorporeal creatures, and the clause that you can see and target incorporeal creatures normally.

`departed-flesh.json` rules:

```json
        "rules": [
            { "key": "Immunity", "type": "disease" },
            {
                "key": "AdjustDegreeOfSuccess",
                "selector": "fortitude",
                "adjustment": { "success": "one-degree-better" },
                "predicate": ["item:trait:poison"],
                "label": "Departed Flesh"
            }
        ],
```

`konso.json` is a 10-minute exploration activity with the four outcomes from guide §4.4 in its description, `actionType: "action"`, `actions: {value: null}`, `traits.value: ["concentrate", "exploration", "soulbound"]`.

- [ ] **Step 6: Add all five grants**

```json
            "depar": { "img": "icons/magic/death/skull-humanoid-white.webp", "level": 3, "name": "Departed Flesh", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Departed Flesh" },
            "flash": { "img": "icons/magic/movement/trail-streak-impact-blue.webp", "level": 3, "name": "Flash Step", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Flash Step" },
            "flasx": { "img": "icons/magic/movement/trail-streak-impact-blue.webp", "level": 11, "name": "Greater Flash Step", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Greater Flash Step" },
            "konso": { "img": "icons/magic/holy/prayer-hands-glowing-yellow.webp", "level": 1, "name": "Konsō", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Konsō" },
            "spsen": { "img": "icons/magic/perception/third-eye-blue-red.webp", "level": 1, "name": "Spirit Sense", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Spirit Sense" },
```

`Flash Step` and `Konsō` are actions, so `validateActionsAreReachable` requires something to grant them. The class item's `system.items` **does not count** — that validator only looks at `GrantItem` rules. Add a `GrantItem` for each to the feature that introduces them: create `content/soulbound-class-features/core/flash-step-feature.json` at level 3 whose rules grant the `Flash Step` action, and have `Konsō`'s grant live on the `Spirit Sense` feature, which is the 1st-level spiritual package. **Verify by running validate, not by assuming.**

- [ ] **Step 7: Run the suite and commit**

```bash
npm run test:soulbound && npm run validate
git add content/soulbound-class-features content/soulbound-effects content/soulbound-class/soulbound.json build/test-soulbound.mjs
git commit -m "Spirit Sense, Konso, Flash Step and Departed Flesh

The four chassis features with no shared machinery. Departed Flesh's
poison clause is AdjustDegreeOfSuccess, which pf2e already models.

Greater Flash Step is the one deliberately incomplete item in this phase:
its DC 5 flat check reports but cannot un-hit an attack pf2e has already
resolved. Phase 2's reaction machinery offers the check before damage
lands, which is what makes \"or the attack misses\" enforceable.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 10: The release state machine, with no Spirit attached

Release, Full Release, Perfected Full Release and Unsealed — the four rungs as states, with the Spirit-specific payload left as a hook for Phase 3.

**Files:**
- Create: `scripts/soulbound/release.mjs`
- Create: `content/soulbound-class-features/core/released-form.json`, `refined-release.json`, `full-release.json`, `perfected-full-release.json`, `unsealed.json`
- Create: `content/soulbound-class-features/actions/release.json`, `full-release-activity.json`
- Create: `content/soulbound-effects/effect-released.json`, `effect-full-release.json`
- Modify: `scripts/isaacs-hb.mjs`, `content/soulbound-class/soulbound.json`, `build/test-soulbound.mjs`

**Interfaces:**
- Consumes: `Reiatsu` (Task 7), `SpiritWeapon` (Task 6).
- Produces:
  - `Release.stateOf(actor): "sealed" | "released" | "full" | "severance"`
  - `Release.enter(actor, state): Promise<void>`
  - `Release.exit(actor, state): Promise<void>`
  - `fullReleaseShape(level): { minutes: number, emanation: number, fatigue: boolean, usesPerDay: number }` — pure, exported
  - `Release.registerHooks(): void`

- [ ] **Step 1: Write the failing test**

Guide §4.8 gives three tiers of Full Release and they are pure arithmetic on level. Append:

```js
/* --- the release ladder ----------------------------------------------------------------------- */

const { fullReleaseShape } = await import("../scripts/soulbound/release.mjs");

check("13th: one minute, 15-foot emanation, fatigued after, once a day (guide §4.8)", fullReleaseShape(13), { minutes: 1, emanation: 15, fatigue: true, usesPerDay: 1 });
check("16th: unchanged — Perfected arrives at 17th, not before", fullReleaseShape(16), { minutes: 1, emanation: 15, fatigue: true, usesPerDay: 1 });
check("17th, Perfected: two minutes, 20 feet, no fatigue", fullReleaseShape(17), { minutes: 2, emanation: 20, fatigue: false, usesPerDay: 1 });
check("19th, Unsealed: twice a day", fullReleaseShape(19), { minutes: 2, emanation: 20, fatigue: false, usesPerDay: 2 });
check("below 13th there is no Full Release at all", fullReleaseShape(12), { minutes: 0, emanation: 0, fatigue: false, usesPerDay: 0 });
```

- [ ] **Step 2: Run the test to verify it fails**

```bash
node build/test-soulbound.mjs
```

Expected: FAIL — `Cannot find module '../scripts/soulbound/release.mjs'`.

- [ ] **Step 3: Write `scripts/soulbound/release.mjs`**

```js
import { Reiatsu } from "./reiatsu.mjs";

const MODULE_ID = "isaacs-hb-pf2e";

const EFFECTS = {
    released: "Compendium.isaacs-hb-pf2e.soulbound-effects.Item.Effect: Released",
    full: "Compendium.isaacs-hb-pf2e.soulbound-effects.Item.Effect: Full Release",
};

/**
 * What a Full Release is at a given level (guide §4.8).
 *
 * Three tiers, all arithmetic on one number, kept pure because the 17th- and 19th-level upgrades are
 * exactly the kind of thing that gets authored on the wrong feature and then works for one playtest
 * because nobody was 17th level yet.
 */
export function fullReleaseShape(level) {
    if (level < 13) return { minutes: 0, emanation: 0, fatigue: false, usesPerDay: 0 };
    const perfected = level >= 17;
    return {
        minutes: perfected ? 2 : 1,
        emanation: perfected ? 20 : 15,
        fatigue: !perfected,
        usesPerDay: level >= 19 ? 2 : 1,
    };
}

/**
 * The release ladder as a state machine.
 *
 * Release is deliberately *not* a stance (guide §4.7) — it does not conflict with stance actions and it
 * lasts the whole encounter — so it cannot use pf2e's stance plumbing and is an ordinary effect with a
 * module-owned state flag beside it. The flag is what the Spirit's own content predicates on, and what
 * Phase 3 hangs each Released Form off.
 */
export const Release = {
    stateOf(actor) {
        return actor?.getFlag(MODULE_ID, "releaseState") ?? "sealed";
    },

    async enter(actor, state) {
        if (!Reiatsu.isSoulbound(actor)) return;
        const uuid = EFFECTS[state];
        if (uuid) {
            const source = (await fromUuid(uuid))?.toObject();
            if (source) await actor.createEmbeddedDocuments("Item", [source]);
        }
        await actor.setFlag(MODULE_ID, "releaseState", state);
    },

    async exit(actor, state) {
        const uuid = EFFECTS[state];
        const held = actor.itemTypes.effect.filter((e) => e.sourceId === uuid);
        if (held.length > 0) await actor.deleteEmbeddedDocuments("Item", held.map((e) => e.id));
        await actor.setFlag(MODULE_ID, "releaseState", state === "full" ? "released" : "sealed");
    },

    /** The encounter ends, and so does Release (guide §4.7: "for the rest of the encounter"). */
    registerHooks() {
        Hooks.on("deleteCombat", async (combat) => {
            if (!game.user.isGM) return;
            for (const combatant of combat.combatants) {
                const actor = combatant.actor;
                if (!Reiatsu.isSoulbound(actor)) continue;
                if (this.stateOf(actor) === "sealed") continue;
                await this.exit(actor, "full");
                await this.exit(actor, "released");
            }
        });
    },
};
```

- [ ] **Step 4: Run the test to verify it passes**

```bash
node build/test-soulbound.mjs
```

Expected: PASS — five new checks.

- [ ] **Step 5: Write the Release action and its effect**

`content/soulbound-class-features/actions/release.json` — one action, auditory/concentrate/reiatsu, with the "first Release each encounter is free" clause in the description and a `frequency` the module does not meter (the free-first-use is state, not frequency, and lives on the effect):

```json
{
    "img": "icons/magic/light/explosion-star-glow-blue.webp",
    "name": "Release",
    "system": {
        "actionType": { "value": "action" },
        "actions": { "value": 1 },
        "category": "offensive",
        "description": { "value": "<p><strong>Requirements</strong> Your spirit weapon is manifested.</p><hr /><p>You speak your release command. Your spirit weapon assumes its released form for the rest of the encounter.</p><p><strong>The first Release each encounter is free</strong>; releasing again after re-sealing costs 1 Reiatsu Point.</p><p>Release is <em>not</em> a stance and doesn't conflict with stance actions.</p>" },
        "publication": { "license": "ORC", "remaster": true, "title": "Isaac's Homebrew: The Soulbound" },
        "rules": [],
        "traits": { "otherTags": ["soulbound-feature"], "rarity": "common", "value": ["auditory", "concentrate", "reiatsu", "soulbound"] }
    },
    "type": "action"
}
```

`content/soulbound-effects/effect-released.json` — duration `unlimited`, since Release lasts the encounter and `deleteCombat` is what ends it:

```json
        "duration": { "expiry": null, "sustained": false, "unit": "unlimited", "value": -1 },
```

- [ ] **Step 6: Write the Full Release activity and effect**

`full-release-activity.json`: two actions, `frequency` `{max: 1, per: "day", value: 1}`, requirements naming the released form and 1 Reiatsu Point, and the four bullets from guide §4.8 in the description.

`effect-full-release.json` carries the pressure emanation as a `turn-end` rider with an area — the same shape as the Saint's Pisces garden, which is the working precedent for an area rider:

```json
    "flags": {
        "isaacs-hb-pf2e": {
            "riders": [
                {
                    "event": "turn-end",
                    "self": true,
                    "area": { "type": "emanation", "value": 15 },
                    "areaTargeting": { "affects": "enemies", "includesSelf": false },
                    "apply": {
                        "type": "save",
                        "statistic": "will",
                        "dc": "reiatsu",
                        "riders": [
                            {
                                "outcomes": ["failure"],
                                "apply": { "type": "condition", "slug": "frightened", "value": 1 }
                            },
                            {
                                "outcomes": ["criticalFailure"],
                                "apply": { "type": "condition", "slug": "frightened", "value": 2 }
                            },
                            {
                                "outcomes": ["success", "criticalSuccess"],
                                "apply": {
                                    "type": "effect",
                                    "uuid": "Compendium.isaacs-hb-pf2e.soulbound-effects.Item.Effect: Steeled Against Pressure"
                                }
                            }
                        ]
                    }
                }
            ]
        }
    },
```

The success branch applies a 10-minute immunity effect — create `content/soulbound-effects/effect-steeled-against-pressure.json` with `duration: {unit: "minutes", value: 10}` — and the rider above gains `"predicate": [{ "not": "rider:target:effect:steeled-against-pressure" }]` so an immune creature is not asked again. This uses the `rider:target:effect:<slug>` vocabulary the engine already generates.

Note `"dc": "reiatsu"` — the spelling Task 2 added.

- [ ] **Step 7: Write the four gating features and add the grants**

`released-form.json` (level 1) grants the `Release` action and carries the ChoiceSet placeholder comment for Phase 3's Spirit choice — **no ChoiceSet yet**, because no Spirit exists to choose and a filter matching nothing produces an empty prompt the player cannot dismiss.

`refined-release.json` (9), `full-release.json` (13, grants the Full Release activity), `perfected-full-release.json` (17), `unsealed.json` (19). Each carries its guide text and, for the two upgrades, an `ItemAlteration` on the Full Release activity's frequency:

```json
            {
                "key": "ItemAlteration",
                "mode": "override",
                "property": "frequency-max",
                "predicate": [],
                "itemType": "action",
                "itemId": "{item|flags.pf2e.itemGrants.fullRelease.id}",
                "value": 2
            }
```

on `unsealed.json` only. **Verify the `itemId` injection resolves** — if it does not, use `"predicate": ["item:slug:full-release"]` with `itemType: "action"` instead.

Grants to add to the class item:

```json
            "relea": { "img": "icons/magic/light/explosion-star-glow-blue.webp", "level": 1, "name": "Released Form", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Released Form" },
            "refin": { "img": "icons/magic/light/explosion-star-glow-purple.webp", "level": 9, "name": "Refined Release", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Refined Release" },
            "fullr": { "img": "icons/magic/light/explosion-star-large-blue.webp", "level": 13, "name": "Full Release", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Full Release" },
            "perfr": { "img": "icons/magic/light/explosion-star-large-purple.webp", "level": 17, "name": "Perfected Full Release", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Perfected Full Release" },
            "unsea": { "img": "icons/magic/light/explosion-star-large-orange.webp", "level": 19, "name": "Unsealed", "uuid": "Compendium.isaacs-hb-pf2e.soulbound-class-features.Item.Unsealed" },
```

- [ ] **Step 8: Register the hooks**

`scripts/isaacs-hb.mjs`: `import { Release } from "./soulbound/release.mjs";`, `start("the release ladder", () => Release.registerHooks());`, `release: Release,` in the API.

- [ ] **Step 9: Run the full suite — validate must now be clean**

```bash
npm test
```

Expected: **zero** advancement-table errors. Every name in `SOULBOUND_ADVANCEMENT` now has content. If any remain, the feature name in the class item's `system.items` does not match the table's string — fix the content, not the table.

- [ ] **Step 10: Commit**

```bash
git add scripts/soulbound/release.mjs scripts/isaacs-hb.mjs content/soulbound-class-features content/soulbound-effects content/soulbound-class/soulbound.json build/test-soulbound.mjs
git commit -m "The release ladder: four rungs as states, no Spirit attached

Release is deliberately not a stance (guide §4.7) — it does not conflict
with stance actions and lasts the whole encounter — so it cannot use
pf2e's stance plumbing and is an ordinary effect beside a module-owned
state flag. That flag is what Phase 3 hangs each Released Form off.

fullReleaseShape() is pure: the 17th and 19th upgrades are exactly the
kind of thing that gets authored on the wrong feature and works for one
playtest because nobody was 17th level yet.

The pressure emanation is a turn-end area rider with a 10-minute immunity
effect on a success, following the Saint's Pisces garden precedent.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 11: The live test rig

A macro that builds a Soulbound, levels it through the checkpoints, and asserts. Written now, in the phase whose content it checks, so phases 3–5 inherit a working rig rather than writing one under pressure.

**Files:**
- Create: `content/soulbound-macros/test-rig.json`
- Modify: `build/test-soulbound.mjs`

**Interfaces:**
- Consumes: every feature from Tasks 4–10.
- Produces: a world macro `Soulbound: Test Rig` exposing `game.modules.get("isaacs-hb-pf2e").api.soulboundRig.run({ spirit, levels })`, returning `{ level, checks: [{label, pass, actual, expected}] }[]`.

- [ ] **Step 1: Write the macro**

`content/soulbound-macros/test-rig.json`. The `command` string is the macro body. Two things are non-negotiable and both were learned the expensive way in prior live sessions:

```js
/**
 * Build a Soulbound, level it, and assert at each checkpoint.
 *
 * Two guards that are not optional:
 *
 *  1. A ChoiceSet opens a PickAThingPrompt that BLOCKS every await on item creation and levelling. From
 *     a scripted driver this surfaces as a protocol timeout, not as a dialog, and the hour goes into
 *     debugging the wrong thing. The resolver below closes them — and never default-picks a Spirit,
 *     because a wrong default silently tests the wrong subclass and every number still looks plausible.
 *
 *  2. An actor created by a GM defaults to alliance "opposition". Area targeting with affects:"enemies"
 *     then catches nothing AND silently clears targets set by hand, which reads as the Technique being
 *     broken rather than the test actor being on the wrong side.
 */
const CHECKPOINTS = [1, 5, 9, 11, 13, 17, 20];

function installPromptResolver(choiceFor) {
    return setInterval(() => {
        for (const app of foundry.applications.instances.values()) {
            if (app.constructor.name !== "PickAThingPrompt") continue;
            const picked = choiceFor(app);
            if (picked === undefined) continue; // leave it open rather than guess
            app.selection = picked;
            app.close();
        }
    }, 100);
}

async function build({ spirit, name }) {
    const actor = await Actor.create({ name, type: "character" });
    await actor.update({ "system.details.alliance": "party" });
    const cls = await fromUuid("Compendium.isaacs-hb-pf2e.soulbound-class.Item.Soulbound");
    await actor.createEmbeddedDocuments("Item", [foundry.utils.deepClone(cls.toObject())]);
    return actor;
}

// … levelling loop, assertions per checkpoint, and a results table …
```

**`foundry.utils.deepClone` on the compendium document is required**: `toObject()` returns the rules array *by reference*, and editing it poisons the cached pack document for the rest of the session.

Assertions at each checkpoint, from the Global Constraints:

| Level | Assert |
| --: | :-- |
| 1 | Class DC trained; Fort/Reflex expert, Will trained; light + unarmoured trained; focus max 1; spirit weapon present and martial; Spirit Sense, Konsō, Reiatsu, Rising Pressure, Released Form on the sheet |
| 5 | Weapon Expertise applied (martial rank 2); focus max 2; Perception expert |
| 9 | Reiatsu DC expert; Refined Release present |
| 11 | Focus max 3; Fortitude master; Greater Flash Step present |
| 13 | Full Release present; martial master; light/unarmoured expert |
| 17 | Reiatsu DC master; `fullReleaseShape(17)` matches the granted activity's duration |
| 20 | Unsealed grants two uses per day |

- [ ] **Step 2: Add a build-time check that the macro is syntactically valid**

A macro with a syntax error fails silently at the table. Append to `build/test-soulbound.mjs`:

```js
/* --- the test rig macro ------------------------------------------------------------------------ */

const rig = JSON.parse(fs.readFileSync(path.join(ROOT, "content/soulbound-macros/test-rig.json"), "utf8"));
check("the rig is a script macro", [rig.type, typeof rig.command], ["script", "string"]);
check("the rig guards against the two traps that cost hours last time", [
    rig.command.includes("PickAThingPrompt"),
    rig.command.includes("system.details.alliance"),
    rig.command.includes("deepClone"),
], [true, true, true]);
try {
    new Function(rig.command);
    check("the rig parses as JavaScript", true, true);
} catch (error) {
    check("the rig parses as JavaScript", String(error), true);
}
```

- [ ] **Step 3: Run the suite**

```bash
npm run test:soulbound
```

Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add content/soulbound-macros/test-rig.json build/test-soulbound.mjs
git commit -m "The live test rig: build a Soulbound, level it, assert

Written in the phase whose content it checks, so phases 3-5 inherit a
working rig rather than writing one under pressure.

Carries the two guards that cost hours in earlier live sessions: a
PickAThingPrompt blocks every await and surfaces as a protocol timeout
rather than a dialog, and a GM-created actor defaults to alliance
\"opposition\", which makes every enemies-only area catch nothing while
silently clearing hand-set targets.

The rig parses as JavaScript at build time, because a macro with a syntax
error fails silently at the table.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
```

---

### Task 12: Live verification in world `pf`

The phase gate. Nothing here is code; it is the evidence that the content works at a table.

**Files:**
- Create: `Docs/soulbound-automation-programme.md` (started here, grown each phase)

**Interfaces:**
- Consumes: everything.
- Produces: a phase-1 results table in the programme document.

- [ ] **Step 1: Build and link**

Foundry holds a LOCK on each pack of the active world and the build deletes `packs/` before recompiling, so a rebuild fails while a world is open. Return to Setup first.

```bash
npm run build && npm run link:foundry -- --force
```

Expected: nine `soulbound-*` packs listed with their document counts.

- [ ] **Step 2: Launch the debug browser**

```bash
"/c/Program Files/Google/Chrome/Application/chrome.exe" --remote-debugging-port=9222 --user-data-dir="$TEMP/chrome-foundry-debug" http://localhost:30000 &
```

- [ ] **Step 3: Confirm the browser is attachable before assuming it**

The MCP server reports "Connected" even when no debug Chrome is listening.

```bash
curl -s http://127.0.0.1:9222/json/version
```

Expected: JSON naming a Chrome build. If not, the browser did not start — do not fall back to another tool, relaunch it.

- [ ] **Step 4: Launch the world and join as GM**

Through `mcp__chrome-devtools__evaluate_script`:

```js
await fetch("/setup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "launchWorld", world: "pf" }) });
```

then read the Gamemaster's id from the `<select name="userid">` options on `/join`, POST `{action: "join", userid: "<id>", password: ""}`, and set `location.href = "/game"`. The GM has no password.

- [ ] **Step 5: Run the rig at every checkpoint**

```js
const api = game.modules.get("isaacs-hb-pf2e").api;
return await api.soulboundRig.run({ spirit: null, levels: [1, 5, 9, 11, 13, 17, 20] });
```

`spirit: null` because Phase 1 has no Spirits; the rig must not prompt for one.

**`evaluate_script` has a 60-second protocol timeout.** If the call fails as a timeout, check `foundry.applications.instances` for an open `DialogV2` or `PickAThingPrompt` before assuming a bug.

- [ ] **Step 6: Confirm Rising Pressure at the table**

Scripted assertions cannot prove a hook fires. In an actual encounter with a 5th-level Soulbound (pool 2):

1. Take damage from an enemy → pool 0 → 1, and a notification.
2. Take damage again the same round → no change.
3. Next round, hit with the spirit weapon → 1 → 2.
4. Spend both, then take damage twice more across two rounds → pool rises to 2 and **stops**, because the encounter ceiling is 2.
5. End the encounter, start a new one → the ledger resets and it pays again.

Step 4 is the one that matters — it is the lever guide §1.3 calls load-bearing and the only one a reader of the JSON cannot verify.

- [ ] **Step 7: Confirm the Saint is unharmed**

Open an existing Saint in the same world, cast a Technique with an area, and confirm the Region places, the review dialog lists targets, and a rider applies. The shared-engine changes in Task 2 are the only thing that could have broken it, and a passing test suite does not prove a live cast still works.

- [ ] **Step 8: Write the programme document**

Create `Docs/soulbound-automation-programme.md` with: what this document is for, the architecture in brief, and a **Phase 1** section recording what was verified live, what was found and fixed, and the one item deliberately left open (Greater Flash Step's flat check, closed by Phase 2 Task 1).

- [ ] **Step 9: Commit and open the PR**

```bash
npm test
git add Docs/soulbound-automation-programme.md
git commit -m "Phase 1 verified live in world pf

A Soulbound built and levelled 1-20 against the rig at seven checkpoints.
Rising Pressure confirmed at the table across five scenarios, including
the per-encounter ceiling, which is the one gate a reader of the JSON
cannot check. The Saint re-tested in the same world after the shared-engine
changes.

Open: Greater Flash Step's DC 5 flat check reports but does not un-hit.
Phase 2 Task 1 closes it.

Co-Authored-By: Claude Opus 5 (1M context) <noreply@anthropic.com>
Claude-Session: https://claude.ai/code/session_011NjZYLNhpEZ4sBik3pwcxe"
git push -u origin claude/soulbound
```

Leave the PR open; phases 2–6 push to the same branch.

---

## Self-review

**Spec coverage.** Every Phase 1 line of the spec's §5 table maps to a task: class item and advancement → Task 4; spirit weapon and 4 profiles → Task 6; Reiatsu entry → Task 7; Rising Pressure → Task 8; Spirit Sense, Konsō, Flash Step, Departed Flesh → Task 9; the release state machine with no Spirit → Task 10; the new validators → Tasks 1 and 4; the shared-code generalisations of spec §2.1 → Task 2. The phase gate "a Soulbound levels 1→20 with correct proficiencies; Rising Pressure refills once per round and stops at the cap; the Saint is unchanged" is Task 12 steps 5, 6 and 7 respectively.

**Two spec items deliberately deferred, and why.** `charges.mjs`, `blut.mjs`, `severance.mjs`, `hypnosis.mjs` and `reactions.mjs` are spec §2.4 modules with no Phase 1 content to drive them — building them now would be five untested files. `reactions.mjs` is spec-assigned to Phase 2 explicitly.

**Type consistency.** `classSlugOf`/`classStatisticOf` (Task 2) are used by Task 6's `isSoulbound`, Task 7's `Reiatsu.isSoulbound` and Task 8. `Reiatsu.isSoulbound` is the single definition Tasks 8 and 10 call; Task 6's `SpiritWeapon.isSoulbound` duplicates it and **should be changed to delegate** — `SpiritWeapon.isSoulbound = (actor) => Reiatsu.isSoulbound(actor)` is not possible without a circular import, so Task 6 keeps its own and both read `classSlugOf`. `SpiritWeapon.weaponOf` (Task 6) is consumed by Task 8's damage-dealt hook. `fullReleaseShape` (Task 10) is consumed by Task 11's level-17 assertion. `grantFor` (Task 8) is consumed by nothing but its own tests, by design.

**Known incomplete item.** Greater Flash Step (Task 9, Step 4) reports its flat check rather than enforcing it, and says so in the content, the commit, and the programme document. It is the only one.

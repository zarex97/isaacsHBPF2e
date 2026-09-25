import { Engine } from "./engine.mjs";

/**
 * The Assimilator's test rig: build one character, bind Substrates, and read each clause off the sheet.
 *
 * Every check names the clause it proves, so a run is the tracker's evidence and a regression suite at once —
 * the Phase 3 drives were hand-typed and left nothing behind that could be run again. Checks are data: a
 * build (level, Substrates, choices), a reading, and the value the guide or the lexicon says it must be.
 *
 *   await game.modules.get("isaacs-hb-pf2e").api.assimilator.rig.run();            // everything
 *   await game.modules.get("isaacs-hb-pf2e").api.assimilator.rig.run({ only: /^SA-/ });
 *
 * The rig drives the engine directly (`bind`), not Feed: Feed's own rules are the class tracker's and are
 * checked there. It makes and deletes its own actors and tokens and touches nothing else.
 */

const NAME = "ZZ Rig — Assimilator";
const TARGET = "ZZ Rig — Target";
const BYSTANDER = "ZZ Rig — Bystander";

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/* -------------------------------------------------------------------------------------------- */
/*  Readings                                                                                     */
/* -------------------------------------------------------------------------------------------- */

const read = {
    resist: (a, type) => a.attributes.resistances.find((r) => r.type === type)?.value ?? 0,
    immune: (a, type) => a.attributes.immunities.some((i) => i.type === type),
    speed: (a, type = "land") => a.system.movement?.speeds?.[type]?.value ?? null,
    sense: (a, type) => {
        const s = a.perception.senses.find((x) => x.type === type);
        return s ? `${s.acuity}${s.range && s.range < 1000 ? ` ${s.range}` : ""}` : null;
    },
    mod: (statistic, slug) => statistic.modifiers.filter((m) => m.slug?.includes(slug)).map((m) => `${m.modifier} ${m.type}`),
    has: (a, slug) => a.items.some((i) => i.slug === slug),
    freq: (a, slug) => a.items.find((i) => i.slug === slug)?.system.frequency?.max ?? null,
    hardness: (a) => a.itemTypes.armor.find((i) => i.slug === "living-plate")?.hardness ?? null,
    strike: (a, label = "Carapace Strike") => a.system.actions.find((s) => s.label === label),
    fastHealing: (a) => a.rules.filter((r) => r.key === "FastHealing" && !r.ignored && r.test()).map((r) => r.resolveValue(r.value)),
    traits: (a, label) => read.strike(a, label)?.item.system.traits.value ?? [],
};

/**
 * The damage formula, from a roll actually made at the rig's target. `getFormula` builds the roll without the
 * target's options, so every rider that reads the target — Silver's dice against undead — was missing from it
 * and the first run failed three checks that were fine.
 */
async function formula(a, { crit = false, label } = {}) {
    const s = read.strike(a, label);
    if (!s) return null;
    await (crit ? s.critical({ skipDialog: true }) : s.damage({ skipDialog: true }));
    const found = game.messages.contents.at(-1)?.rolls[0]?.formula ?? null;
    // The damage roll's own hooks — spending what rode on the Strike — land a moment after it.
    await wait(900);
    return found;
}

/* -------------------------------------------------------------------------------------------- */
/*  The checks                                                                                   */
/* -------------------------------------------------------------------------------------------- */

/** `b`: the Substrates bound for the check; `lv`: the level; `c`: daily choices. */
const CHECKS = [
    // The class.
    { id: "A-01", lv: 1, b: {}, get: (a) => a.class.system.keyAbility.value, want: ["str", "dex"] },
    { id: "A-07", lv: 1, b: {}, get: (a) => [a.class.system.trainedSkills.value, a.class.system.trainedSkills.additional], want: [["athletics"], 3] },
    { id: "A-07", lv: 1, b: {}, get: (a) => a.skills.athletics.rank, want: 1 },

    // Red, the numbers not yet read.
    { id: "RU-1b", lv: 17, b: { ruby: 1 }, token: true, get: (a, ctx) => ctx.token.light.dim, want: 10 },

    // Blue.
    { id: "SA-3a", lv: 17, b: { sapphire: 3 }, get: (a) => formula(a), want: (f) => /\+ 1d6 cold/.test(f) && !/1d4 cold/.test(f) },
    { id: "SA-3b", lv: 17, b: { sapphire: 3 }, crit: true, get: (a, ctx) => ctx.targetConditions, want: (c) => c.includes("slowed:1") },
    { id: "SA-3b", lv: 17, b: { sapphire: 2 }, crit: true, get: (a, ctx) => ctx.targetConditions, want: (c) => !c.includes("slowed:1"), note: "control: Depth 2" },
    { id: "SN-1a", lv: 17, b: { tin: 1 }, get: (a) => read.sense(a, "tremorsense"), want: "imprecise 30" },

    // Purple.
    { id: "AT-3a", lv: 17, b: { amethyst: 3 }, get: (a) => formula(a), want: (f) => /\+ 1d6 mental/.test(f) && !/1d4/.test(f) },
    { id: "AT-3b", lv: 17, b: { amethyst: 3 }, crit: true, get: (a, ctx) => ctx.targetConditions, want: (c) => c.includes("stupefied:1") },
    { id: "AT-4a", lv: 17, b: { amethyst: 4 }, get: (a) => formula(a), want: (f) => /\+ 1d6 mental/.test(f) },
    { id: "PT-1a", lv: 17, b: { platinum: 1 }, get: (a) => read.mod(a.saves.will, "platinum"), want: ["1 circumstance"] },
    { id: "PT-3a", lv: 17, b: { platinum: 3 }, get: (a) => read.has(a, "ascendant-flight") && read.freq(a, "ascendant-flight"), want: 1 },
    { id: "QZ-2a", lv: 17, b: { quartz: 2 }, get: (a) => read.freq(a, "prism-counteract"), want: 1 },
    { id: "NI-1h", lv: 17, b: { nickel: 1 }, c: { nickel: ["limb", "organ", "maw"] }, get: (a) => a.itemTypes.effect.filter((e) => /^aberration-/.test(e.slug)).length, want: 1 },
    { id: "NI-2a", lv: 17, b: { nickel: 2 }, c: { nickel: ["limb", "organ", "maw"] }, get: (a) => a.itemTypes.effect.filter((e) => /^aberration-/.test(e.slug)).length, want: 2 },
    { id: "NI-1c", lv: 17, b: { nickel: 1 }, c: { nickel: ["organ"] }, get: (a) => read.sense(a, "darkvision"), want: (v) => v !== null },

    // Green.
    { id: "EM-1a", lv: 17, b: { emerald: 1 }, get: (a) => read.fastHealing(a), want: [1] },
    { id: "EM-2a", lv: 17, b: { emerald: 2 }, get: (a) => read.fastHealing(a), want: [2] },
    { id: "EM-3a", lv: 17, b: { emerald: 3 }, get: (a) => read.fastHealing(a), want: [5] },
    { id: "EM-4a", lv: 17, b: { emerald: 4 }, get: (a) => read.fastHealing(a), want: [10] },
    { id: "ZN-1b", lv: 17, b: { zinc: 1 }, c: { zinc: "fire" }, get: (a) => read.resist(a, "fire"), want: 2 },
    { id: "ZN-3a", lv: 17, b: { zinc: 3 }, c: { zinc: "fire" }, get: (a) => read.resist(a, "fire"), want: 8 },
    { id: "CR-2a", lv: 17, b: { chromium: 2 }, get: (a) => [read.hardness(a), read.resist(a, "acid")], want: [7, 5] },
    { id: "CR-3a", lv: 17, b: { chromium: 3 }, get: (a) => [read.hardness(a), read.resist(a, "acid")], want: [10, 8] },

    // Black.
    { id: "JE-1b", lv: 17, b: { jet: 1 }, get: (a) => read.mod(a.saves.fortitude, "jet"), want: ["1 item"] },
    { id: "JE-2a", lv: 17, b: { jet: 2 }, get: (a) => formula(a), want: (f) => /\+ 1d4 void/.test(f) },
    { id: "JE-4a", lv: 17, b: { jet: 4 }, get: (a) => formula(a), want: (f) => /\+ 1d6 void/.test(f) },
    { id: "PB-1a", lv: 17, b: { lead: 1 }, get: (a) => read.mod(a.saves.reflex, "lead"), want: ["1 circumstance"] },

    // White.
    { id: "DI-1a", lv: 17, b: { diamond: 1 }, get: (a) => read.hardness(a), want: 4 },
    { id: "DI-2a", lv: 17, b: { diamond: 2 }, get: (a) => read.hardness(a), want: 7 },
    { id: "PE-1a", lv: 17, b: { pearl: 1 }, get: (a) => read.mod(a.saves.fortitude, "pearl"), want: ["1 item"] },
    { id: "AL-1a", lv: 17, b: { aluminium: 1 }, get: (a) => a.itemTypes.armor.find((i) => i.slug === "living-plate").bulk.value, want: 0 },
    { id: "AL-3b", lv: 17, b: { aluminium: 3 }, get: (a) => read.freq(a, "hollow-flight"), want: 1 },
    { id: "MG-1a", lv: 17, b: { magnesium: 1 }, token: true, get: (a, ctx) => ctx.token.light.bright, want: 20 },
    { id: "MG-1b", lv: 17, b: { magnesium: 1 }, get: (a) => read.mod(a.saves.fortitude, "magnesium"), want: ["1 item"] },

    // Gray.
    { id: "ST-2a", lv: 17, b: { steel: 2 }, get: (a) => read.hardness(a), want: 7 },
    { id: "ST-3a", lv: 17, b: { steel: 3 }, get: (a) => read.hardness(a), want: 10 },
    { id: "MO-3a", lv: 17, b: { moonstone: 3 }, resolve: "fire", apply: "effect-reactive-evolution", get: (a) => read.resist(a, "fire"), want: 8 },
    { id: "MO-4a", lv: 17, b: { moonstone: 4 }, resolve: "fire", apply: "effect-reactive-evolution", get: (a) => read.resist(a, "fire"), want: 12 },
    { id: "AG-2a", lv: 17, b: { silver: 2 }, targetTraits: ["undead"], get: (a) => formula(a), want: (f) => /1d4/.test(f) },
    { id: "AG-2a", lv: 17, b: { silver: 2 }, targetTraits: ["humanoid"], get: (a) => formula(a), want: (f) => !/1d4/.test(f), note: "control: a humanoid" },
    { id: "AG-3a", lv: 17, b: { silver: 3 }, targetTraits: ["fiend"], get: (a) => formula(a), want: (f) => /1d6/.test(f) && !/1d4/.test(f) },
    { id: "AG-4a", lv: 17, b: { silver: 4 }, targetTraits: ["spirit"], get: (a) => formula(a), want: (f) => /1d6/.test(f) },
];

/* -------------------------------------------------------------------------------------------- */
/*  Scenarios: damage dealt and taken                                                            */
/* -------------------------------------------------------------------------------------------- */

const DamageRoll = () => CONFIG.Dice.rolls.find((c) => c.name === "DamageRoll");

/** Hit the target with `formula` as the Assimilator's Carapace Strike; return what the target lost. */
async function hitTarget(a, t, ctx, formula, { hp = 900 } = {}) {
    await t.update({ "system.attributes.hp.value": hp });
    const roll = await new (DamageRoll())(formula).evaluate();
    await t.applyDamage({ damage: roll, token: canvas.scene.tokens.get(ctx.targetTokenId), item: read.strike(a)?.item });
    await wait(700);
    return hp - game.actors.get(t.id).hitPoints.value;
}

/** Hit the Assimilator with `formula` from the target's claw (or nobody); return what it lost. */
async function hitSelf(a, t, ctx, formula, { from = true, outcome = null, hp = null } = {}) {
    const start = hp ?? a.hitPoints.max;
    await a.update({ "system.attributes.hp.value": start, "system.attributes.hp.temp": 0 });
    let claw = t.items.find((i) => i.name === "Claw");
    if (!claw && from) [claw] = await t.createEmbeddedDocuments("Item", [{ name: "Claw", type: "melee",
        system: { damageRolls: { a: { damage: "1d6", damageType: "slashing" } }, bonus: { value: 10 },
            traits: { value: ["unarmed"] } } }]);
    const roll = await new (DamageRoll())(formula).evaluate();
    await a.applyDamage({ damage: roll, token: canvas.scene.tokens.get(ctx.tokenId), item: from ? claw : null, outcome });
    await wait(900);
    return start - game.actors.get(a.id).hitPoints.value;
}

/** Roll the kind of check a Note sits on and say whether the Note came with it. */
async function noteShown(a, t, ctx, { roll, title }) {
    canvas.scene.tokens.get(ctx.targetTokenId).object?.setTarget(true, { user: game.user, releaseOthers: true });
    canvas.scene.tokens.get(ctx.tokenId).object?.control({ releaseOthers: true });
    const [kind, which] = roll.split(":");
    if (kind === "skill") await a.skills[which].roll({ skipDialog: true });
    else if (kind === "save") await a.saves[which].roll({ skipDialog: true });
    else if (kind === "perception") await a.perception.roll({ skipDialog: true });
    else if (kind === "attack") await read.strike(a).attack({ skipDialog: true });
    else if (kind === "damage") await read.strike(a).damage({ skipDialog: true });
    await wait(700);
    const m = game.messages.contents.at(-1);
    return `${m?.flavor ?? ""}${m?.content ?? ""}`.includes(title);
}

const NOTES = [
    ["IR-4b", { iron: 4 }, "skill:athletics", "Iron (Depth 4)"],
    ["CI-3a", { citrine: 3 }, "perception", "Citrine (Depth 3)"],
    ["BR-1a", { bronze: 1 }, "attack", "Bronze (Depth 1)"],
    ["BR-3a", { bronze: 3 }, "attack", "Bronze (Depth 3)"],
    ["HG-1a", { mercury: 1 }, "skill:acrobatics", "Mercury (Depth 1)"],
    ["SA-1b", { sapphire: 1 }, "save:will", "Sapphire (Depth 1)"],
    ["LA-2a", { "lapis-lazuli": 2 }, "skill:arcana", "Lapis Lazuli (Depth 2)"],
    ["LA-4a", { "lapis-lazuli": 4 }, "perception", "Lapis Lazuli (Depth 4)"],
    ["SN-2a", { tin: 2 }, "perception", "Tin (Depth 2)"],
    ["SN-3b", { tin: 3 }, "perception", "Tin (Depth 3)"],
    ["AT-1a", { amethyst: 1 }, "perception", "Amethyst (Depth 1)"],
    ["QZ-3a", { quartz: 3 }, "perception", "Quartz (Depth 3)"],
    ["QZ-4b", { quartz: 4 }, "save:will", "Quartz (Depth 4)"],
    ["PT-4b", { platinum: 4 }, "save:will", "Platinum (Depth 4)"],
    ["EM-2b", { emerald: 2 }, "perception", "Emerald (Depth 2)"],
    ["CR-2b", { chromium: 2 }, "perception", "Chromium (Depth 2)"],
    ["CR-3b", { chromium: 3 }, "save:reflex", "Chromium (Depth 3)"],
    ["CR-4b", { chromium: 4 }, "perception", "Chromium (Depth 4)"],
    ["JE-3b", { jet: 3 }, "damage", "Jet (Depth 3)"],
    ["PB-1b", { lead: 1 }, "save:will", "Lead (Depth 1)"],
    ["PB-3a", { lead: 3 }, "perception", "Lead (Depth 3)"],
    ["MN-3b", { manganese: 3 }, "damage", "Manganese (Depth 3)"],
    ["MN-4b", { manganese: 4 }, "damage", "Manganese (Depth 4)"],
    ["AL-2b", { aluminium: 2 }, "perception", "Aluminium (Depth 2)"],
    ["AL-3a", { aluminium: 3 }, "skill:athletics", "Aluminium (Depth 3)"],
    ["PE-3a", { pearl: 3 }, "perception", "Pearl (Depth 3)"],
    ["PE-4a", { pearl: 4 }, "perception", "Pearl (Depth 4)"],
    ["AG-4b", { silver: 4 }, "attack", "Silver (Depth 4)"],
    ["ZN-4b", { zinc: 4 }, "perception", "Zinc (Depth 4)"],
].map(([id, b, roll, title]) => ({ id, lv: 17, b, note: `Note: ${title}`, act: (a, t, ctx) => noteShown(a, t, ctx, { roll, title }), want: true }));

/** Run `fn` inside a started encounter holding the rig's creatures, and end it after — whatever happens. */
async function inCombat(ctx, fn) {
    const combat = await Combat.create({ scene: canvas.scene.id, active: true });
    await combat.createEmbeddedDocuments("Combatant", [ctx.tokenId, ctx.targetTokenId].map((tokenId) => ({
        tokenId, sceneId: canvas.scene.id, actorId: canvas.scene.tokens.get(tokenId).actorId })));
    // The Assimilator goes first, so a new round is a new turn for it.
    const mine = combat.combatants.find((c) => c.tokenId === ctx.tokenId);
    const theirs = combat.combatants.find((c) => c.tokenId === ctx.targetTokenId);
    await combat.setInitiative(mine.id, 30);
    await combat.setInitiative(theirs.id, 1);
    await combat.startCombat();
    await wait(600);
    try {
        return await fn(combat);
    } finally {
        await combat.delete();
    }
}

/** Move a rig token `dx` squares along the row from the Assimilator. */
async function place(ctx, tokenId, dx) {
    const me = canvas.scene.tokens.get(ctx.tokenId);
    await canvas.scene.tokens.get(tokenId).update({ x: me._source.x + dx * canvas.grid.size, y: me._source.y },
        { animate: false });
    await wait(300);
}

const effects = (actor, re) => actor.itemTypes.effect.filter((e) => re.test(e.slug)).map((e) => e.slug);

const SCENARIOS = [
    // The Instinct.
    { id: "A-45", lv: 17, b: { ruby: 1, sapphire: 1 }, act: async (a) => [a.flags["isaacs-hb-pf2e"].assimilator.instinct,
        (await Engine.breakTie(a, "blue")).ok && game.actors.get(a.id).flags["isaacs-hb-pf2e"].assimilator.instinct], want: [null, "blue"] },
    { id: "A-46", lv: 17, b: { ruby: 2 }, act: async (a) => {
        const first = a.flags["isaacs-hb-pf2e"].assimilator.instinct;
        const st = Engine.state(a); st.substrates = { sapphire: 2 }; await Engine.write(a, st); await Engine.rebuild(a);
        const midday = game.actors.get(a.id).flags["isaacs-hb-pf2e"].assimilator.instinct;
        await Engine.beginPreparations(game.actors.get(a.id));
        const prepared = game.actors.get(a.id).flags["isaacs-hb-pf2e"].assimilator.instinct;
        await Engine.endPreparations(game.actors.get(a.id));
        return [first, midday, prepared];
    }, want: ["red", "red", "blue"] },
    { id: "A-35", lv: 17, b: { ruby: 1 }, act: async (a) => {
        const plate = a.itemTypes.armor.find((i) => i.slug === "living-plate");
        await plate.update({ "system.hp.value": 5 });
        const [spec] = await a.createEmbeddedDocuments("Item", [{ name: "Copper Ingot", type: "treasure", system: { quantity: 1 } }]);
        const bound = await Engine.mend(a, (await a.createEmbeddedDocuments("Item", [{ name: "Ruby", type: "treasure" }]))[0].id);
        const r = await Engine.mend(game.actors.get(a.id), spec.id);
        const p = game.actors.get(a.id).itemTypes.armor.find((i) => i.slug === "living-plate");
        return [bound.ok, r.ok, p.hitPoints.value === p.hitPoints.max];
    }, want: [false, true, true], note: "a bound Substrate refused; an unbound one mends" },

    // Red, Black: what damage dealt does.
    { id: "JE-2b", lv: 17, b: { jet: 2 }, act: async (a, t, ctx) => {
        await a.update({ "system.attributes.hp.temp": 0 });
        await hitTarget(a, t, ctx, "10[bludgeoning]", { hp: 5 });
        return game.actors.get(a.id).attributes.hp.temp;
    }, want: 2 },
    { id: "MN-2a", lv: 17, b: { manganese: 2 }, act: async (a, t, ctx) => {
        await t.update({ "system.attributes.resistances": [{ type: "fire", value: 10 }] });
        for (const e of t.itemTypes.effect.filter((x) => x.slug === "effect-corroded")) await e.delete();
        const plain = await hitTarget(a, t, ctx, "20[fire]");
        const corroded = effects(game.actors.get(t.id), /corroded/).length;
        const roll = await new (DamageRoll())("20[fire]").evaluate();
        await game.actors.get(t.id).update({ "system.attributes.hp.value": 900 });
        await game.actors.get(t.id).applyDamage({ damage: roll, token: canvas.scene.tokens.get(ctx.targetTokenId) });
        await wait(700);
        const fromNobody = 900 - game.actors.get(t.id).hitPoints.value;
        await game.actors.get(t.id).update({ "system.attributes.resistances": [] });
        return [plain, corroded, fromNobody];
    }, want: [10, 1, 12], note: "the second 20 fire is nobody's — corrosion lowers resistance for every source" },
    { id: "MN-4a", lv: 17, b: { manganese: 4 }, act: async (a, t, ctx) => {
        await t.update({ "system.attributes.resistances": [{ type: "fire", value: 10 }] });
        for (const e of t.itemTypes.effect.filter((x) => x.slug === "effect-corroded")) await e.delete();
        await hitTarget(a, t, ctx, "20[fire]");
        const roll = await new (DamageRoll())("20[fire]").evaluate();
        await game.actors.get(t.id).update({ "system.attributes.hp.value": 900 });
        await game.actors.get(t.id).applyDamage({ damage: roll, token: canvas.scene.tokens.get(ctx.targetTokenId) });
        await wait(700);
        await game.actors.get(t.id).update({ "system.attributes.resistances": [] });
        return 900 - game.actors.get(t.id).hitPoints.value;
    }, want: 20, note: "resistance 10 reduced by 10" },
    { id: "PB-2a", lv: 17, b: { lead: 2 }, act: async (a, t, ctx) => {
        for (const e of t.itemTypes.effect.filter((x) => x.slug === "effect-null-weight")) await e.delete();
        await hitTarget(a, t, ctx, "5[bludgeoning]");
        const tt = game.actors.get(t.id);
        return [effects(tt, /null-weight/).length, tt.saves.will.modifiers.some((m) => m.slug === "null-weight" && m.modifier === -1)];
    }, want: [1, true] },
    { id: "CU-1a", lv: 17, b: { copper: 1 }, act: async (a, t, ctx) => {
        await t.update({ "flags.isaacs-hb-pf2e.assimilator.-=conducted": null });
        await hitTarget(a, t, ctx, "5[fire]");
        return game.actors.get(t.id).flags["isaacs-hb-pf2e"]?.assimilator?.conducted?.type ?? null;
    }, want: "fire", note: "the point is queued for the target's next turn start" },
    { id: "CU-3a", lv: 17, b: { copper: 3 }, act: async (a, t, ctx) => {
        const by = game.actors.get(ctx.bystanderId);
        await by.update({ "system.attributes.hp.value": 100 });
        await hitTarget(a, t, ctx, "5[electricity]");
        await wait(600);
        return 100 - game.actors.get(by.id).hitPoints.value;
    }, want: 2 },
    { id: "LA-3a", lv: 17, b: { "lapis-lazuli": 3 }, act: async (a, t, ctx) => {
        await t.update({ "system.attributes.resistances": [{ type: "cold", value: 5 }] });
        await a.update({ "flags.isaacs-hb-pf2e.assimilator.-=learned": null });
        await hitTarget(a, t, ctx, "5[bludgeoning]");
        await game.actors.get(t.id).update({ "system.attributes.resistances": [] });
        return game.messages.contents.at(-1)?.content?.includes("resistance cold 5") ?? false;
    }, want: true },

    // Orange, Red, Green, Gray, White: what damage taken does.
    { id: "AM-1a", lv: 17, b: { amber: 1 }, act: async (a, t, ctx) => {
        await Engine.write(a, Engine.state(a));
        await game.modules.get("isaacs-hb-pf2e").api.assimilator.damage.setReservoir(a, 0, null);
        await hitSelf(game.actors.get(a.id), t, ctx, "5[cold]");
        return game.actors.get(a.id).flags["isaacs-hb-pf2e"].assimilator.reservoir;
    }, want: { charges: 1, type: "cold" } },
    { id: "AM-1b", lv: 17, b: { amber: 1 }, act: async (a, t, ctx) => {
        await game.modules.get("isaacs-hb-pf2e").api.assimilator.damage.setReservoir(a, 3, "cold");
        await game.modules.get("isaacs-hb-pf2e").api.assimilator.damage.draw(game.actors.get(a.id));
        const f = await formula(game.actors.get(a.id));
        return [game.actors.get(a.id).flags["isaacs-hb-pf2e"].assimilator.reservoir.charges, /1d4 cold/.test(f),
            effects(game.actors.get(a.id), /reservoir-primed/).length];
    }, want: [2, true, 0], note: "the damage roll spends the primed effect" },
    { id: "AM-2b", lv: 17, b: { amber: 2 }, act: async (a) => {
        await game.modules.get("isaacs-hb-pf2e").api.assimilator.damage.setReservoir(a, 2, "fire");
        await game.modules.get("isaacs-hb-pf2e").api.assimilator.damage.draw(game.actors.get(a.id));
        return [game.actors.get(a.id).flags["isaacs-hb-pf2e"].assimilator.reservoir.charges, await formula(game.actors.get(a.id))];
    }, want: (v) => v[0] === 0 && /1d6 \+ 2 fire|\(1d6 \+ 2\) fire/.test(v[1]) },
    { id: "AM-2a", lv: 17, b: { amber: 2 }, act: async (a, t, ctx) => {
        await game.modules.get("isaacs-hb-pf2e").api.assimilator.damage.setReservoir(a, 5, "fire");
        await hitSelf(game.actors.get(a.id), t, ctx, "5[fire]");
        return game.actors.get(a.id).flags["isaacs-hb-pf2e"].assimilator.reservoir.charges;
    }, want: 5 },
    { id: "AM-3a", lv: 17, b: { amber: 3 }, act: async (a, t, ctx) => {
        await game.modules.get("isaacs-hb-pf2e").api.assimilator.damage.setReservoir(a, 0, null);
        await hitTarget(a, t, ctx, "5[fire]");
        return game.actors.get(a.id).flags["isaacs-hb-pf2e"].assimilator.reservoir.charges;
    }, want: 1 },
    { id: "CU-2a", lv: 17, b: { copper: 2 }, act: async (a, t, ctx) => {
        await hitSelf(a, t, ctx, "5[fire]");
        const f = await formula(game.actors.get(a.id));
        return [/1d4 fire/.test(f), effects(game.actors.get(a.id), /conductive-charge/).length];
    }, want: [true, 0] },
    { id: "DI-2b", lv: 17, b: { diamond: 2 }, act: async (a, t, ctx) => {
        // A persistent tick: pf2e applies the condition's roll with the condition as the item.
        const src = game.pf2e.ConditionManager.getCondition("persistent-damage").toObject();
        src.system.persistent = { formula: "10", damageType: "fire", dc: 15 };
        const [cond] = await a.createEmbeddedDocuments("Item", [src]);
        await a.update({ "system.attributes.hp.value": a.hitPoints.max });
        const start = game.actors.get(a.id).hitPoints.value;
        const roll = await new (DamageRoll())("10[fire]").evaluate();
        await game.actors.get(a.id).applyDamage({ damage: roll, token: canvas.scene.tokens.get(ctx.tokenId), item: game.actors.get(a.id).items.get(cond.id) });
        await wait(800);
        const tick = start - game.actors.get(a.id).hitPoints.value;
        await game.actors.get(a.id).items.get(cond.id)?.delete();
        return [tick, await hitSelf(game.actors.get(a.id), t, ctx, "10[fire]", { from: false })];
    }, want: [8, 10] },
    { id: "DI-3b", lv: 17, b: { diamond: 3 }, act: async (a, t, ctx) => {
        await a.update({ "flags.isaacs-hb-pf2e.assimilator.-=used": null });
        return [await hitSelf(a, t, ctx, "40[bludgeoning]", { outcome: "criticalSuccess" }),
            await hitSelf(game.actors.get(a.id), t, ctx, "40[bludgeoning]", { outcome: "criticalSuccess" })];
    }, want: [20, 40], note: "halved once, then spent for the encounter" },
    { id: "EM-3b", lv: 17, b: { emerald: 3 }, act: async (a) => {
        await a.increaseCondition("dying", { value: 1 });
        await wait(800);
        return game.actors.get(a.id).itemTypes.condition.some((c) => c.slug === "dying");
    }, want: false },
    { id: "HE-4a", lv: 17, b: { hematite: 4 }, act: async (a, t, ctx) => {
        await a.update({ "flags.isaacs-hb-pf2e.assimilator.-=used": null });
        await hitSelf(a, t, ctx, "500[bludgeoning]", { hp: 30 });
        return game.actors.get(a.id).hitPoints.value;
    }, want: 17 },
    { id: "EM-4b", lv: 17, b: { emerald: 4 }, act: async (a, t, ctx) => {
        await a.update({ "flags.isaacs-hb-pf2e.assimilator.-=used": null });
        for (const e of a.itemTypes.effect.filter((x) => x.slug === "effect-knitting-surge")) await e.delete();
        await hitSelf(a, t, ctx, "500[bludgeoning]", { hp: 30 });
        const b = game.actors.get(a.id);
        return [b.hitPoints.value, effects(b, /knitting-surge/).length];
    }, want: [1, 1] },
    { id: "MO-4b", lv: 17, b: { moonstone: 4 }, apply: "effect-reactive-evolution", resolve: "fire", act: async (a, t, ctx) => {
        await a.update({ "flags.isaacs-hb-pf2e.assimilator.-=used": null });
        return [await hitSelf(a, t, ctx, "30[fire]"), await hitSelf(game.actors.get(a.id), t, ctx, "30[fire]")];
    }, want: [0, 18], note: "none the first time; resistance 12 after" },
    { id: "ZN-3b", lv: 17, b: { zinc: 3 }, c: { zinc: "fire" }, act: async (a, t, ctx) => {
        await a.update({ "flags.isaacs-hb-pf2e.assimilator.-=used": null });
        const took = await hitSelf(a, t, ctx, "20[cold]");
        return [took, game.actors.get(a.id).flags["isaacs-hb-pf2e"].assimilator.choices.zinc];
    }, want: [12, "cold"] },
    { id: "ZN-4b", lv: 17, b: { zinc: 4 }, c: { zinc: "fire" }, act: async (a, t, ctx) => {
        await hitSelf(a, t, ctx, "20[cold]");
        const b = game.actors.get(a.id);
        return [read.resist(b, "cold"), b.flags["isaacs-hb-pf2e"].assimilator.choices.zincPrevious];
    }, want: [12, "fire"] },

    // Senses, skills and the dark.
    { id: "SN-4b", lv: 17, b: { tin: 4 }, act: async (a) => read.mod(a.skills.survival, "tin"), want: ["2 circumstance"] },
    { id: "ON-3a", lv: 17, b: { onyx: 3 }, act: async (a) => {
        await a.update({ "flags.pf2e.rollOptions.all.self:in-dim-light-or-darkness": true });
        const lit = game.actors.get(a.id).armorClass.modifiers.find((m) => m.slug?.includes("onyx"))?.enabled ?? false;
        await game.actors.get(a.id).update({ "flags.pf2e.rollOptions.all.-=self:in-dim-light-or-darkness": null });
        const bright = game.actors.get(a.id).armorClass.modifiers.find((m) => m.slug?.includes("onyx"))?.enabled ?? false;
        return [lit, bright];
    }, want: [true, false] },

    // Area actions: an emanation is centred on the user, so it needs no aiming — only the review accepted.
    { id: "MG-2a", lv: 17, b: { magnesium: 2 }, act: async (a, t, ctx) => {
        await t.update({ "system.saves.fortitude.value": -40, "system.details.alliance": "opposition" });
        canvas.scene.tokens.get(ctx.tokenId).object?.control({ releaseOthers: true });
        await AssimilatorRig.useWithArea(a.items.find((i) => i.slug === "flare"));
        const got = game.actors.get(t.id).itemTypes.condition.map((c) => c.slug);
        return [got.includes("dazzled"), got.includes("blinded")];
    }, want: [true, false] },
    { id: "MG-3a", lv: 17, b: { magnesium: 3 }, act: async (a, t, ctx) => {
        await t.update({ "system.saves.fortitude.value": -40, "system.details.alliance": "opposition" });
        canvas.scene.tokens.get(ctx.tokenId).object?.control({ releaseOthers: true });
        await AssimilatorRig.useWithArea(a.items.find((i) => i.slug === "flare"));
        const got = game.actors.get(t.id).itemTypes.condition.map((c) => c.slug);
        return [got.includes("dazzled"), got.includes("blinded")];
    }, want: [false, true] },

    // Choices a card offers at the moment they arise.
    { id: "CA-4a", lv: 17, b: { carnelian: 4 }, act: async (a, t, ctx) => {
        canvas.scene.tokens.get(ctx.targetTokenId).object?.setTarget(true, { user: game.user, releaseOthers: true });
        canvas.scene.tokens.get(ctx.tokenId).object?.control({ releaseOthers: true });
        await read.strike(a)?.attack({ skipDialog: true });
        await wait(2000);
        return game.messages.contents.slice(-4).some((m) => m.content?.includes("Kinetic Spurs"));
    }, want: true },
    { id: "BR-4a", lv: 17, b: { bronze: 4 }, act: async (a, t, ctx) => {
        canvas.scene.tokens.get(ctx.targetTokenId).object?.setTarget(true, { user: game.user, releaseOthers: true });
        canvas.scene.tokens.get(ctx.tokenId).object?.control({ releaseOthers: true });
        await read.strike(a)?.attack({ skipDialog: true });
        await wait(2000);
        return game.messages.contents.slice(-4).some((m) => m.content?.includes("Battle Frame"));
    }, want: true, note: "AC 1: every Strike is a critical" },

    // Jet's harvest: a creature at or below half its Hit Points.
    { id: "JE-4b", lv: 17, b: { jet: 4 }, act: async (a, t, ctx) => {
        await t.update({ "system.attributes.hp.value": 400, "system.saves.fortitude.value": -40 });
        canvas.scene.tokens.get(ctx.targetTokenId).object?.setTarget(true, { user: game.user, releaseOthers: true });
        canvas.scene.tokens.get(ctx.tokenId).object?.control({ releaseOthers: true });
        await a.items.find((i) => i.slug === "carrion-harvest")?.toMessage();
        await wait(3000);
        return 400 - game.actors.get(t.id).hitPoints.value;
    }, want: 34, note: "twice level 17, on a failed save" },

    // Save riders on a hit.
    { id: "SA-4b", lv: 17, b: { sapphire: 4 }, act: async (a, t, ctx) => {
        await t.update({ "system.saves.fortitude.value": -40 });
        for (const c of t.itemTypes.condition) await c.delete();
        canvas.scene.tokens.get(ctx.targetTokenId).object?.setTarget(true, { user: game.user, releaseOthers: true });
        canvas.scene.tokens.get(ctx.tokenId).object?.control({ releaseOthers: true });
        await read.strike(a).attack({ skipDialog: true });
        await wait(2500);
        return game.actors.get(t.id).itemTypes.condition.map((c) => c.slug).includes("slowed");
    }, want: true },
    { id: "AT-4b", lv: 17, b: { amethyst: 4 }, act: async (a, t, ctx) => {
        await t.update({ "system.saves.will.value": -40 });
        for (const c of t.itemTypes.condition) await c.delete();
        canvas.scene.tokens.get(ctx.targetTokenId).object?.setTarget(true, { user: game.user, releaseOthers: true });
        canvas.scene.tokens.get(ctx.tokenId).object?.control({ releaseOthers: true });
        await read.strike(a).attack({ skipDialog: true });
        await wait(2500);
        return game.actors.get(t.id).itemTypes.condition.map((c) => c.slug).includes("confused");
    }, want: true },
    { id: "SA-2b", lv: 17, b: { sapphire: 2 }, act: async (a, t, ctx) => {
        for (const e of t.itemTypes.effect) await e.delete();
        canvas.scene.tokens.get(ctx.targetTokenId).object?.setTarget(true, { user: game.user, releaseOthers: true });
        canvas.scene.tokens.get(ctx.tokenId).object?.control({ releaseOthers: true });
        await read.strike(a).attack({ skipDialog: true });
        await wait(2500);
        return effects(game.actors.get(t.id), /glacial-chill/).length;
    }, want: 1 },
    { id: "CU-4a", lv: 17, b: { copper: 4 }, act: async (a, t, ctx) => {
        const by = game.actors.get(ctx.bystanderId);
        await by.update({ "system.attributes.hp.value": 100 });
        await hitTarget(a, t, ctx, "10[electricity]");
        await wait(600);
        return 100 - game.actors.get(by.id).hitPoints.value;
    }, want: 5, note: "half the energy damage, to the creature beside the target" },
    { id: "NI-1d", lv: 17, b: { nickel: 1 }, c: { nickel: ["mode"] }, act: async (a) => read.speed(a, "climb"), want: 12 },
    { id: "NI-3a", lv: 17, b: { nickel: 2 }, c: { nickel: ["limb", "organ"] }, act: async (a) => {
        const refused = (await Engine.rollAberrations(a, { reroll: true })).ok;
        const st = Engine.state(a); st.substrates = { nickel: 3 }; await Engine.write(a, st); await Engine.rebuild(a);
        const r = await Engine.rollAberrations(game.actors.get(a.id), { reroll: true });
        return [refused, r.ok, r.picked?.length];
    }, want: [false, true, 2] },
    { id: "ZN-2b", lv: 17, b: { zinc: 2 }, c: { zinc: "fire" }, act: async (a) => {
        const before = (await Engine.choose(a, "zinc", "cold")).ok;
        await a.items.find((i) => i.slug === "shift-tissue")?.toMessage();
        await wait(1500);
        const after = (await Engine.choose(game.actors.get(a.id), "zinc", "cold")).ok;
        for (const app of foundry.applications.instances.values()) if (app.id?.startsWith("isaacs-hb-gullet")) await app.close();
        return [before, after, read.resist(game.actors.get(a.id), "cold")];
    }, want: [false, true, 5] },
    { id: "JA-3a", lv: 17, b: { jade: 3 }, act: async (a) => {
        await a.update({ "flags.pf2e.rollOptions.all.-=self:jade-spent": null });
        // Roll until an unadjusted success turns up; its degree and the spend are the reading.
        for (let i = 0; i < 12; i++) {
            const mod = game.actors.get(a.id).saves.fortitude.mod;
            await game.actors.get(a.id).saves.fortitude.roll({ skipDialog: true, dc: { value: mod + 11 } });
            await wait(600);
            const ctxt = game.messages.contents.at(-1)?.flags?.pf2e?.context;
            if (ctxt?.unadjustedOutcome === "success") {
                return [ctxt.outcome, !!game.actors.get(a.id).flags.pf2e?.rollOptions?.all?.["self:jade-spent"]];
            }
        }
        return "no success rolled";
    }, want: ["criticalSuccess", true] },
    { id: "PB-4a", lv: 17, b: { lead: 4 }, act: async (a, t, ctx) => {
        canvas.scene.tokens.get(ctx.tokenId).object?.control({ releaseOthers: true });
        await AssimilatorRig.useWithArea(a.items.find((i) => i.slug === "null-field"));
        return game.messages.contents.slice(-3).some((m) => /counteract/i.test(m.content ?? ""));
    }, want: true, note: "the counteract card is offered for the creatures in the emanation" },
    { id: "B-01", lv: 17, b: { ruby: 2, iron: 2 }, bonds: ["molten-carapace"], act: async (a, t, ctx) => {
        await t.update({ "system.attributes.hp.value": 900 });
        await hitSelf(a, t, ctx, "5[slashing]");
        return 900 - game.actors.get(t.id).hitPoints.value;
    }, want: 8, note: "the Claw is a melee attack; half of level 17" },

    // Once per round: two in one round, then a new round.
    { id: "DI-4b", lv: 17, b: { diamond: 4 }, act: async (a, t, ctx) => {
        await a.update({ "flags.isaacs-hb-pf2e.assimilator.-=used": null });
        return inCombat(ctx, async (combat) => {
            const first = await hitSelf(game.actors.get(a.id), t, ctx, "40[bludgeoning]", { outcome: "criticalSuccess" });
            const second = await hitSelf(game.actors.get(a.id), t, ctx, "40[bludgeoning]", { outcome: "criticalSuccess" });
            await combat.nextRound();
            await wait(600);
            const third = await hitSelf(game.actors.get(a.id), t, ctx, "40[bludgeoning]", { outcome: "criticalSuccess" });
            return [first, second, third];
        });
    }, want: [20, 40, 20], note: "halved, spent for the round, halved again in the next" },
    { id: "JA-4a", lv: 17, b: { jade: 4 }, act: async (a, t, ctx) => {
        await a.update({ "flags.pf2e.rollOptions.all.-=self:jade-spent": null });
        return inCombat(ctx, async (combat) => {
            let outcome = "no success rolled";
            for (let i = 0; i < 12; i++) {
                const mod = game.actors.get(a.id).saves.fortitude.mod;
                await game.actors.get(a.id).saves.fortitude.roll({ skipDialog: true, dc: { value: mod + 11 } });
                await wait(600);
                const c = game.messages.contents.at(-1)?.flags?.pf2e?.context;
                if (c?.unadjustedOutcome === "success") { outcome = c.outcome; break; }
            }
            const spentNow = !!game.actors.get(a.id).flags.pf2e?.rollOptions?.all?.["self:jade-spent"];
            await combat.nextRound();
            await wait(1200);
            const spentNext = !!game.actors.get(a.id).flags.pf2e?.rollOptions?.all?.["self:jade-spent"];
            return [outcome, spentNow, spentNext];
        });
    }, want: ["criticalSuccess", true, false], note: "spent on the upgrade, back at the start of its next turn" },

    // Magnesium's harder light.
    { id: "MG-3b", lv: 17, b: { magnesium: 3 }, act: async (a, t, ctx) => {
        await t.update({ "system.saves.fortitude.value": -40, "system.details.alliance": "opposition",
            "system.attributes.hp.value": 900 });
        await t.createEmbeddedDocuments("Item", [{ name: "Light Blindness", type: "action",
            system: { actionType: { value: "passive" }, category: "defensive" } }]);
        canvas.scene.tokens.get(ctx.tokenId).object?.control({ releaseOthers: true });
        await AssimilatorRig.useWithArea(a.items.find((i) => i.slug === "flare"));
        const hurt = 900 - game.actors.get(t.id).hitPoints.value;
        await t.deleteEmbeddedDocuments("Item", t.items.filter((i) => i.name === "Light Blindness").map((i) => i.id));
        return hurt;
    }, want: 17, note: "a creature with Light Blindness takes fire equal to the level" },
    { id: "MG-4a", lv: 17, b: { magnesium: 4 }, act: async (a, t, ctx) => {
        const by = game.actors.get(ctx.bystanderId);
        await by.update({ "system.saves.fortitude.value": -40, "system.details.alliance": "opposition" });
        for (const c of by.itemTypes.condition) await c.delete();
        await place(ctx, ctx.bystanderTokenId, 5);
        // Straight after a Depth 3 check the badge is still moving; the area is read from it.
        for (let i = 0; i < 20 && !game.actors.get(a.id).getRollOptions().includes("self:effect:substrate-magnesium:4"); i++) await wait(150);
        canvas.scene.tokens.get(ctx.tokenId).object?.control({ releaseOthers: true });
        await AssimilatorRig.useWithArea(game.actors.get(a.id).items.find((i) => i.slug === "flare"));
        const blinded = game.actors.get(by.id).itemTypes.condition.some((c) => c.slug === "blinded");
        const counteract = game.messages.contents.slice(-4).some((m) => /counteract/i.test(m.content ?? ""));
        await place(ctx, ctx.bystanderTokenId, 2);
        return [blinded, counteract];
    }, want: [true, true], note: "a creature 25 feet away is caught, and the darkness counteract is offered" },
    { id: "MG-4b", lv: 17, b: { magnesium: 4 }, act: async (a, t, ctx) => {
        const by = game.actors.get(ctx.bystanderId);
        await by.update({ "system.details.alliance": "party", "system.attributes.hp.value": 50 });
        await place(ctx, ctx.bystanderTokenId, 5);
        canvas.scene.tokens.get(ctx.tokenId).object?.control({ releaseOthers: true });
        const item = a.items.find((i) => i.slug === "healing-flare");
        await AssimilatorRig.useWithArea(item);
        const healed = game.actors.get(by.id).hitPoints.value - 50;
        const left = a.items.get(item?.id)?.system?.frequency?.value;
        await by.update({ "system.details.alliance": "opposition" });
        await place(ctx, ctx.bystanderTokenId, 2);
        return [healed, left];
    }, want: [17, 0], note: "an ally 25 feet away heals for the level; the day's use is spent" },
    { id: "ON-4a", lv: 17, b: { onyx: 4 }, act: async (a) => {
        const step = a.items.find((i) => i.slug === "shadow-step");
        return [!!step, step?.system?.frequency?.max, step?.system?.frequency?.per, step?.system?.actions?.value];
    }, want: [true, 1, "round", 1] },

    // "Once per encounter": the card is refused once the encounter's uses are spent; outside one, never.
    ...[["MG-2a", { magnesium: 2 }, "flare", 1], ["PB-4a", { lead: 4 }, "null-field", 1],
        ["PE-2a", { pearl: 2 }, "cleansing-tide", 1], ["PE-4a", { pearl: 4 }, "cleansing-tide", 2]]
        .map(([id, b, slug, max]) => ({ id, lv: 17, b, note: `${slug}: ${max} per encounter`, act: async (a, t, ctx) => {
            await a.update({ [`flags.isaacs-hb-pf2e.assimilator.-=encounterUses`]: null });
            const cards = () => game.messages.filter((m) => m.flags?.pf2e?.origin?.uuid?.endsWith?.(a.items.find((i) => i.slug === slug)?.id ?? "-")
                && !m.flags?.pf2e?.context).length;
            const before = cards();
            await inCombat(ctx, async () => {
                canvas.scene.tokens.get(ctx.tokenId).object?.control({ releaseOthers: true });
                for (let i = 0; i <= max; i++) await AssimilatorRig.useWithArea(game.actors.get(a.id).items.find((x) => x.slug === slug));
            });
            return cards() - before;
        }, want: max })),

    // Garnet's drain: a dying creature.
    { id: "GA-4b", lv: 17, b: { garnet: 4 }, act: async (a, t, ctx) => {
        await t.update({ "system.attributes.hp.value": 0 });
        await t.increaseCondition("dying", { value: 1 });
        await a.update({ "system.attributes.hp.value": 50 });
        canvas.scene.tokens.get(ctx.targetTokenId).object?.setTarget(true, { user: game.user, releaseOthers: true });
        await a.items.find((i) => i.slug === "exsanguinate")?.toMessage();
        await wait(2500);
        const tt = game.actors.get(t.id);
        const dead = tt.itemTypes.condition.some((c) => c.slug === "dying" && c.value >= 4) || tt.isDead;
        for (const c of tt.itemTypes.condition) await c.delete();
        return [dead, game.actors.get(a.id).hitPoints.value];
    }, want: [true, 67] },
];

/* -------------------------------------------------------------------------------------------- */

export const AssimilatorRig = {
    SCENARIOS,
    NOTES,
    CHECKS,

    async run({ only = null } = {}) {
        const results = [];
        const ctx = await AssimilatorRig.setup();
        try {
            for (const check of [...CHECKS, ...SCENARIOS, ...NOTES].filter((c) => !only || only.test(c.id))) {
                results.push(await AssimilatorRig.one(check, ctx));
            }
        } finally {
            await AssimilatorRig.teardown(ctx);
        }
        const failed = results.filter((r) => !r.pass);
        console.table(results);
        return { total: results.length, failed, results };
    },

    async setup() {
        for (const a of game.actors.filter((x) => [NAME, TARGET, BYSTANDER].includes(x.name))) await a.delete();
        const cls = (await game.packs.get("isaacs-hb-pf2e.assimilator-class").getDocuments())[0];
        const actor = await Actor.create({ name: NAME, type: "character", prototypeToken: { actorLink: true },
            system: { details: { level: { value: 1 }, alliance: "party" } } });
        await actor.createEmbeddedDocuments("Item", [cls.toObject()]);
        const target = await Actor.create({ name: TARGET, type: "npc", prototypeToken: { actorLink: true },
            system: { attributes: { hp: { value: 900, max: 900 }, ac: { value: 1 } }, traits: { value: ["humanoid"] } } });
        const size = canvas.grid.size;
        const [ox, oy] = AssimilatorRig.emptySpot();
        const [token] = await canvas.scene.createEmbeddedDocuments("Token", [(await actor.getTokenDocument({ x: size * ox, y: size * oy })).toObject()]);
        const [targetToken] = await canvas.scene.createEmbeddedDocuments("Token", [(await target.getTokenDocument({ x: size * (ox + 1), y: size * oy })).toObject()]);
        // A bystander beside the target, for what arcs or spreads from it.
        const bystander = await Actor.create({ name: BYSTANDER, type: "npc", prototypeToken: { actorLink: true },
            system: { attributes: { hp: { value: 100, max: 100 }, ac: { value: 10 } } } });
        const [byToken] = await canvas.scene.createEmbeddedDocuments("Token", [(await bystander.getTokenDocument({ x: size * (ox + 2), y: size * oy })).toObject()]);
        return { actorId: actor.id, targetId: target.id, tokenId: token.id, targetTokenId: targetToken.id,
            bystanderId: bystander.id, bystanderTokenId: byToken.id };
    },

    /**
     * A block of the scene with no token within six squares, so an emanation catches only the rig's own
     * creatures. The first rig put its tokens on a fixed square beside the world's own fixtures, and a Flare
     * caught a Soulbound NPC that answered with a reaction.
     */
    emptySpot() {
        const g = canvas.grid.size;
        const taken = canvas.scene.tokens.filter((t) => !t.name.startsWith("ZZ Rig"))
            .map((t) => [Math.round(t.x / g), Math.round(t.y / g)]);
        const W = Math.floor(canvas.scene.width / g);
        const H = Math.floor(canvas.scene.height / g);
        for (let y = H - 8; y > 2; y--) {
            for (let x = W - 14; x > 2; x--) {
                if (!taken.some(([tx, ty]) => tx >= x - 6 && tx <= x + 9 && ty >= y - 6 && ty <= y + 6)) return [x, y];
            }
        }
        return [W - 6, H - 4];
    },

    /** Use an action and accept its area's "Confirm targets" review, which blocks the use until answered. */
    async useWithArea(item) {
        // The sheet's use button, not `toMessage`: only this path spends the action's Frequency.
        const use = game.pf2e.rollItemMacro(item.uuid);
        for (let i = 0; i < 40; i++) {
            await wait(250);
            const button = document.querySelector('button[data-action="confirm"]');
            if (button) { button.click(); break; }
        }
        await use;
        await wait(2500);
    },

    async teardown(ctx) {
        const names = [NAME, TARGET, BYSTANDER];
        await canvas.scene.deleteEmbeddedDocuments("Token", [ctx.tokenId, ctx.targetTokenId, ctx.bystanderTokenId]
            .filter((id) => id && canvas.scene.tokens.get(id)));
        const messages = game.messages.filter((m) => names.includes(m.speaker?.alias) || names.some((n) => m.content?.includes(n)));
        await ChatMessage.deleteDocuments(messages.map((m) => m.id));
        for (const a of game.actors.filter((x) => names.includes(x.name))) await a.delete();
    },

    async one(check, ctx) {
        const actor = () => game.actors.get(ctx.actorId);
        const target = () => game.actors.get(ctx.targetId);
        if (actor().level !== check.lv) {
            await actor().update({ "system.details.level.value": check.lv });
            await wait(400);
        }
        const state = Engine.state(actor());
        state.substrates = check.b;
        state.choices = check.c ?? {};
        state.instinct = null;
        state.bonds = check.bonds ?? [];
        await Engine.write(actor(), state);
        await Engine.rebuild(actor());
        // Roll options are re-derived on the next preparation; give the badge a beat to reach them.
        await wait(300);
        for (const e of actor().itemTypes.effect.filter((x) => x.slug === check.apply)) await e.delete();
        if (check.apply) {
            const src = (await game.packs.get("isaacs-hb-pf2e.assimilator-effects").getDocuments())
                .find((d) => d.slug === check.apply).toObject();
            if (check.resolve) src.system.rules.find((r) => r.key === "ChoiceSet").selection = check.resolve;
            await actor().createEmbeddedDocuments("Item", [src]);
        }
        await target().update({ "system.traits.value": check.targetTraits ?? ["humanoid"] });
        for (const c of target().itemTypes.condition) await c.delete();
        const targetToken = canvas.scene.tokens.get(ctx.targetTokenId);
        targetToken.object?.setTarget(true, { user: game.user, releaseOthers: true });

        const local = { token: canvas.scene.tokens.get(ctx.tokenId), targetConditions: [] };
        if (check.crit) {
            canvas.scene.tokens.get(ctx.tokenId).object?.control({ releaseOthers: true });
            await read.strike(actor())?.attack({ skipDialog: true });
            // A condition rider goes through the relay; in a full run 1.2 s was sometimes not enough.
            await wait(2500);
            local.targetConditions = target().itemTypes.condition.map((c) => `${c.slug}:${c.value ?? ""}`.replace(/:$/, ""));
        }

        let actual;
        try {
            actual = check.act ? await check.act(actor(), target(), ctx) : await check.get(actor(), local);
        } catch (error) {
            actual = `threw: ${error.message}`;
        }
        const pass = typeof check.want === "function" ? !!check.want(actual) : JSON.stringify(actual) === JSON.stringify(check.want);
        return { id: check.id, note: check.note ?? "", pass, actual: JSON.stringify(actual),
            want: typeof check.want === "function" ? check.want.toString().slice(0, 60) : JSON.stringify(check.want) };
    },
};

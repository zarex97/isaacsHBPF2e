import { shadowTarget } from "../riders/bypass.mjs";
import { DamageBus } from "../lib/damage-bus.mjs";
import { DAMAGE as PRIORITY } from "../stage-priorities.mjs";
import { encounterOf } from "../lib/encounter-damage.mjs";
import { MODULE_ID } from "../sky/signs.mjs";
import { classSlugOf } from "../lib/class-dc.mjs";

/**
 * The Mutations that answer damage — dealt by an Assimilator, or taken by one.
 *
 * Each of these was a Note in Phase 3: a sentence on the right roll that the table had to act on. They are all
 * decided by the damage itself — its type, whether it was persistent or a critical, whether it put a creature
 * at 0 — which exists only inside `applyDamage`, so they are stages on the damage bus. A Substrate's Depth is
 * read off the creature's roll options exactly as its rules read it, and a Depth 3+ Mutation needs the plate
 * whole, as every rule does.
 */

const ENERGY = new Set(["acid", "cold", "electricity", "fire", "sonic", "force", "vitality", "void"]);
const KEY = "assimilator";

/**
 * Guide §4.2: other armour worn over the plate *"suppresses Living Plate, every Mutation, and your Instinct until
 * you take it off."* The Carapace sets this option whenever the plate is out of its slot, and every scripted
 * Mutation, Instinct and plate reaction asks it before acting — the rule elements carry it as a predicate.
 */
export const SUPPRESSED = "assimilator:suppressed";

export function suppressed(actor) {
    return !!actor?.getRollOptions?.().includes(SUPPRESSED);
}

/** The effective Depth of a bound Substrate on this creature, 0 if unbound or switched off by a broken plate. */
export function depthOf(actor, slug) {
    if (!actor?.getRollOptions) return 0;
    const options = actor.getRollOptions();
    if (options.includes(SUPPRESSED)) return 0;
    const m = options.map((o) => new RegExp(`^self:effect:substrate-${slug}:(\\d+)$`).exec(o)).find(Boolean);
    const depth = m ? Number(m[1]) : 0;
    return depth >= 3 && !options.includes("carapace:intact") ? 0 : depth;
}

/** Damage types in a roll, with their totals. */
export function byType(damage) {
    const out = {};
    for (const i of damage?.instances ?? []) out[i.type] = (out[i.type] ?? 0) + (Number(i.total) || 0);
    return out;
}

function liveActor(actor, params) {
    const passed = params?.token?.document ?? params?.token ?? null;
    return passed?.actor ?? actor.token?.actor ?? (actor.id ? game.actors?.get(actor.id) : null) ?? actor;
}

function isWriter() {
    return game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM;
}

async function effect(slug) {
    const docs = await game.packs.get(`${MODULE_ID}.assimilator-effects`)?.getDocuments();
    return docs?.find((d) => d.slug === slug) ?? null;
}

async function say(actor, html) {
    await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<p>${html}</p>` });
}

/** A once-per-day / encounter / round allowance, kept on the actor and keyed to what it is per. */
function stampFor(per, actor) {
    if (per === "day") return actor.flags?.[MODULE_ID]?.[KEY]?.day ?? 0;
    const combat = encounterOf(actor);
    if (!combat) return per === "encounter" ? "no-encounter" : "no-round";
    return per === "encounter" ? combat.id : `${combat.id}:${combat.round}`;
}
function spent(actor, key, per) {
    return actor.flags?.[MODULE_ID]?.[KEY]?.used?.[key] === stampFor(per, actor);
}
async function spend(actor, key, per) {
    await actor.update({ [`flags.${MODULE_ID}.${KEY}.used.${key}`]: stampFor(per, actor) });
}

/** The persistent-damage conditions an Assimilator had before a knife's critical landed, keyed by the actor. */
const knifeWatch = new WeakMap();

/**
 * A knife's or pick's critical specialization in damage an Alien Physiology Assimilator is taking, or null.
 * `pick` is the flat amount; `soleBleed` says the knife's die is the only bleed in the roll.
 */
function critSpecOf(actor, params) {
    const damage = params?.damage;
    if (!damage || typeof damage === "number" || params.outcome !== "criticalSuccess") return null;
    if (!actor.itemTypes?.feat?.some((f) => f.slug === "alien-physiology")) return null;
    const weapon = params.item;
    const group = weapon?.group ?? weapon?.system?.group ?? null;
    if (group !== "knife" && group !== "pick") return null;
    const parts = damage.options?.damage?.damage;
    if (!parts) return null;
    const live = [...(parts.dice ?? []), ...(parts.modifiers ?? [])].filter((p) => p?.enabled !== false && p?.critical !== false);
    const spec = live.filter((p) => p.slug === "critical-specialization");
    if (!spec.length) return null;
    if (group === "pick") return { group, pick: spec.reduce((n, p) => n + (Number(p.modifier ?? p.value) || 0), 0) };
    const bleedElsewhere = live.some((p) => p.slug !== "critical-specialization" && p.damageType === "bleed")
        || parts.base?.some?.((b) => b.damageType === "bleed");
    return { group, soleBleed: !bleedElsewhere };
}

export const AssimilatorDamage = {
    registerHooks() {
        DamageBus.before("the Assimilator's passive defences", PRIORITY.carapaceBlock + 1,
            (actor, params) => AssimilatorDamage.defend(actor, params));
        DamageBus.before("Manganese's corrosion", PRIORITY.bypass + 1, (actor) => AssimilatorDamage.corroded(actor));
        DamageBus.before("Alien Physiology", PRIORITY.carapaceBlock + 2,
            (actor, params) => AssimilatorDamage.noAnatomy(actor, params));
        DamageBus.after("Alien Physiology's bleed", PRIORITY.carapaceBlock + 2,
            (actor, params) => AssimilatorDamage.noAnatomyAfter(actor, params));
        DamageBus.after("Mutations that answer damage dealt", PRIORITY.riders + 2,
            (actor, params, before) => AssimilatorDamage.dealt(actor, params, before));
        DamageBus.after("Mutations that answer damage taken", PRIORITY.riders + 3,
            (actor, params, before) => AssimilatorDamage.taken(actor, params, before));

        // Emerald Depth 3: "You stabilize automatically when dying."
        Hooks.on("createItem", (item) => {
            if (item.slug === "dying" && isWriter() && depthOf(item.actor, "emerald") >= 3) {
                item.actor.decreaseCondition("dying", { forceRemove: true });
                say(item.actor, `<strong>Knitting Flesh</strong>: ${item.actor.name} stabilizes on their own.`);
            }
        });
        // Manganese Depth 4: "A creature that ends its turn adjacent to you takes 1d6 persistent acid" (#91).
        Hooks.on("pf2e.endTurn", (combatant) => {
            if (isWriter()) AssimilatorDamage.rot(combatant).catch((e) => console.error("Isaac's Homebrew | Manganese", e));
        });
        // Copper Depth 1: the extra point lands at the start of the target's next turn.
        Hooks.on("pf2e.startTurn", (combatant) => {
            if (isWriter()) AssimilatorDamage.conduct(combatant).catch((e) => console.error("Isaac's Homebrew | Copper", e));
        });
        // A new day resets the once-per-day allowances.
        Hooks.on("pf2e.restForTheNight", (actor) => {
            if (isWriter()) actor.update({ [`flags.${MODULE_ID}.${KEY}.day`]: (actor.flags?.[MODULE_ID]?.[KEY]?.day ?? 0) + 1 });
        });
    },

    /**
     * Before damage lands on an Assimilator: Diamond takes 2 off persistent damage and turns a critical into a
     * normal hit (once per encounter, per round at Depth 4); Moonstone Depth 4 takes none of the first damage
     * each encounter of a type already resisted. All three shape the post-IWR figure, so each shadows
     * `calculateHealthDelta` on top of whatever the Carapace stage already put there.
     */
    defend(actor, params) {
        const damage = params?.damage;
        if (!damage || typeof damage === "number") return undefined;
        const diamond = depthOf(actor, "diamond");
        const moonstone = depthOf(actor, "moonstone");
        const zinc = depthOf(actor, "zinc");
        if (!diamond && moonstone < 4 && zinc < 3) return undefined;

        // A persistent *tick* is applied from the persistent-damage condition's own roll, with the condition as
        // its item. (Applying a roll that *carries* a persistent instance only creates the condition; it deals
        // nothing then, so reducing it there would reduce nothing.)
        const persistent = params.item?.type === "condition" && params.item.slug === "persistent-damage";
        const critical = params.outcome === "criticalSuccess";
        const types = Object.keys(byType(damage));
        const resisted = actor.itemTypes.effect.filter((e) => e.slug === "effect-reactive-evolution")
            .map((e) => e.flags?.pf2e?.rulesSelections?.type).filter(Boolean);
        const plans = [];
        if (diamond >= 2 && persistent) plans.push({ why: "Adamant Skin (persistent)", apply: (d) => Math.max(0, d - 2) });
        const critPer = diamond >= 4 ? "round" : "encounter";
        if (diamond >= 3 && critical && !spent(actor, "diamond-crit", critPer)) {
            plans.push({ why: "Adamant Skin (critical)", spend: ["diamond-crit", critPer], apply: (d) => Math.floor(d / 2) });
        }
        if (moonstone >= 4 && types.length && types.every((t) => resisted.includes(t)) && !spent(actor, "moonstone-null", "encounter")) {
            plans.push({ why: "Reactive Evolution", spend: ["moonstone-null", "encounter"], apply: () => 0 });
        }
        // Zinc Depth 3-4: energy of another type than the chosen one — the reaction changes the type "after
        // learning the type, before damage applies", so this damage already meets the new resistance. Once per
        // round at 3; unlimited at 4, which also keeps the old type resisted.
        const chosen = actor.flags?.[MODULE_ID]?.[KEY]?.choices?.zinc;
        const energy = types.filter((t) => ["acid", "cold", "electricity", "fire", "sonic", "force", "vitality", "void"].includes(t));
        const fresh = energy.find((t) => t !== chosen && t !== actor.flags?.[MODULE_ID]?.[KEY]?.choices?.zincPrevious);
        if (zinc >= 3 && fresh && (zinc >= 4 || !spent(actor, "zinc-react", "round"))) {
            const value = { 3: 8, 4: 12 }[Math.min(zinc, 4)];
            const portion = byType(damage)[fresh] ?? 0;
            plans.push({ why: `Shifting Tissue (now ${fresh})`, spend: zinc >= 4 ? null : ["zinc-react", "round"],
                apply: (d) => Math.max(0, d - Math.min(value, portion)),
                after: async (live) => live.update({
                    [`flags.${MODULE_ID}.${KEY}.choices.zinc`]: fresh,
                    ...(zinc >= 4 ? { [`flags.${MODULE_ID}.${KEY}.choices.zincPrevious`]: chosen } : {}),
                }) });
        }
        if (!plans.length) return undefined;

        const shadowed = Object.prototype.hasOwnProperty.call(actor, "calculateHealthDelta");
        const original = actor.calculateHealthDelta;
        const notes = [];
        actor.calculateHealthDelta = function (args) {
            let delta = args.delta;
            if (delta > 0) {
                for (const plan of plans) {
                    const next = plan.apply(delta);
                    if (next !== delta) {
                        notes.push(`${plan.why}: ${delta - next}`);
                        if (plan.spend) spend(liveActor(actor, params), ...plan.spend);
                        if (plan.after) plan.after(liveActor(actor, params));
                    }
                    delta = next;
                }
            }
            return original.call(this, { ...args, delta });
        };
        return () => {
            if (shadowed) actor.calculateHealthDelta = original;
            else delete actor.calculateHealthDelta;
            if (notes.length) say(liveActor(actor, params), `<strong>${notes.join("; ")}</strong> turned.`);
        };
    },

    /**
     * Alien Physiology (guide §4.8): *"immune … to critical specialization effects of the knife and pick groups."*
     *
     * pf2e builds both into the damage roll under the slug `critical-specialization`. The **pick**'s is a flat
     * `2 × dice` folded into the weapon's own instance, so it cannot be lifted out of the roll: it comes off the
     * post-IWR figure here instead, which is exact unless a resistance or weakness to that instance's type moved
     * the total first. The **knife**'s is 1d6 persistent bleed, its own instance, which only ever *creates* a
     * persistent-damage condition; the after stage removes the one it created — and only when it was the roll's
     * sole bleed, since a bleed from anything else is not the symbiont's to refuse.
     */
    noAnatomy(actor, params) {
        const found = critSpecOf(actor, params);
        if (!found) return undefined;
        if (found.group === "knife") {
            const bleeds = (actor.itemTypes?.condition ?? []).filter((c) => c.slug === "persistent-damage")
                .map((c) => c.id);
            if (found.soleBleed) knifeWatch.set(actor, new Set(bleeds));
            return undefined;
        }
        const amount = found.pick;
        if (!(amount > 0)) return undefined;
        const shadowed = Object.prototype.hasOwnProperty.call(actor, "calculateHealthDelta");
        const original = actor.calculateHealthDelta;
        let turned = 0;
        actor.calculateHealthDelta = function (args) {
            turned = args.delta > 0 ? Math.min(args.delta, amount) : 0;
            return original.call(this, { ...args, delta: args.delta - turned });
        };
        return () => {
            if (shadowed) actor.calculateHealthDelta = original;
            else delete actor.calculateHealthDelta;
            if (turned) say(liveActor(actor, params), `<strong>Alien Physiology</strong>: there is nowhere for the pick to `
                + `find; its critical specialization's <strong>${turned}</strong> does not land.`);
        };
    },

    async noAnatomyAfter(actor, params) {
        const had = knifeWatch.get(actor);
        if (!had) return;
        knifeWatch.delete(actor);
        const live = liveActor(actor, params);
        const fresh = live.itemTypes.condition.filter((c) => c.slug === "persistent-damage" && !had.has(c.id)
            && c.system.persistent?.damageType === "bleed");
        if (!fresh.length) return;
        await live.deleteEmbeddedDocuments("Item", fresh.map((c) => c.id));
        await say(live, "<strong>Alien Physiology</strong>: there is no artery to open; the knife's critical "
            + "specialization bleed does not take.");
    },

    /** Manganese's corrosion lowers every resistance the creature has, against anyone's damage, while it lasts. */
    corroded(actor) {
        const effects = actor.itemTypes?.effect?.filter((e) => e.slug === "effect-corroded") ?? [];
        const reduction = Math.max(0, ...effects.map((e) => Number(e.flags?.[MODULE_ID]?.[KEY]?.corrosion) || 0));
        return reduction > 0 ? shadowTarget(actor, { reduction }) : undefined;
    },

    /** After an Assimilator's damage lands on a creature. */
    async dealt(actor, params, before) {
        const origin = params?.item?.actor;
        if (!origin || origin === actor || !isWriter()) return;
        const target = liveActor(actor, params);
        const after = target.hitPoints?.value ?? before;
        if (after >= before) return;
        const types = byType(params.damage);
        const energy = Object.keys(types).filter((t) => ENERGY.has(t));
        const originActor = game.actors.get(origin.id) ?? origin;

        // Jet Depth 3: "A creature you kill cannot be returned to life by magic below 6th rank" — pf2e has no resurrection to
        // block, so the corpse carries the mark where the table will see it (#91).
        if (after === 0 && depthOf(originActor, "jet") >= 3 && !target.itemTypes.effect.some((e) => e.slug === "effect-carrion-marked")) {
            const doc = await effect("effect-carrion-marked");
            if (doc) await target.createEmbeddedDocuments("Item", [doc.toObject()]);
        }
        // Jet Depth 2: "Gain 2 temporary Hit Points when you reduce a creature to 0 Hit Points."
        if (after === 0 && depthOf(originActor, "jet") >= 2 && (originActor.attributes.hp.temp ?? 0) < 2) {
            await originActor.update({ "system.attributes.hp.temp": 2 });
            await say(originActor, `<strong>Carrion Bloom</strong>: ${originActor.name} gains 2 temporary Hit Points.`);
        }
        // Manganese Depth 2-4: every resistance of the creature, 2 / 5 / 10 lower until the end of its next turn.
        const manganese = depthOf(originActor, "manganese");
        if (manganese >= 2) {
            const amount = { 2: 2, 3: 5, 4: 10 }[Math.min(manganese, 4)];
            await AssimilatorDamage.mark(target, "effect-corroded", { corrosion: amount }, `Corroded (${amount})`);
        }
        // Lead Depth 2: once per round, -1 status to its next save.
        if (depthOf(originActor, "lead") >= 2 && !spent(originActor, "lead", "round")) {
            await spend(originActor, "lead", "round");
            await AssimilatorDamage.mark(target, "effect-null-weight");
        }
        // Copper: energy damage from a Mutation conducts.
        const copper = depthOf(originActor, "copper");
        if (copper >= 1 && energy.length) {
            const type = energy[0];
            await target.update({ [`flags.${MODULE_ID}.${KEY}.conducted`]: { type, from: originActor.uuid } });
            if (copper >= 3) await AssimilatorDamage.arc(target, originActor, type, copper >= 4 ? Math.floor(types[type] / 2) : 2);
        }
        // Amber Depth 3: dealing energy damage stores a charge, once per round.
        if (depthOf(originActor, "amber") >= 3 && energy.length && !spent(originActor, "amber-deal", "round")) {
            await spend(originActor, "amber-deal", "round");
            await AssimilatorDamage.charge(originActor, energy[0]);
        }
        // Lapis Lazuli Depth 3: learn one resistance, weakness or immunity of the creature damaged.
        if (depthOf(originActor, "lapis-lazuli") >= 3) await AssimilatorDamage.reveal(originActor, target);
        // Ruby Depth 4: "On a critical hit … the target's space burns — a creature ending its turn there takes 1d6 fire."
        const strike = ["weapon", "melee"].includes(params.item?.type);
        if (params.outcome === "criticalSuccess" && strike && depthOf(originActor, "ruby") >= 4) {
            await AssimilatorDamage.burnSpace(params?.token?.document ?? params?.token ?? target.getActiveTokens?.(true, true)?.[0],
                originActor);
        }
    },

    /**
     * The target's space set burning: a lingering area — the module's own, as Mavros Eruption Clast leaves — on the
     * squares the token stands on, for 1 minute (#85). It burns whoever ends a turn in it, not the creature that
     * was hit: the ground stays where the blow landed.
     */
    async burnSpace(token, origin) {
        const doc = token?.document ?? token;
        if (!doc?.parent || !canvas?.scene || doc.parent.id !== canvas.scene.id) return null;
        // Loaded here, not at the top: the lingering module defines a Foundry class as it loads, and this file is
        // also imported by the Node tests.
        const { BEHAVIOR_TYPE: LINGERING_BEHAVIOR, FLAG: LINGERING } = await import("../targeting/lingering.mjs");
        const size = canvas.grid.size;
        const [region] = await canvas.scene.createEmbeddedDocuments("Region", [{
            name: "Ruby — burning ground",
            color: "#d9480f",
            visibility: CONST.REGION_VISIBILITY.ALWAYS,
            shapes: [{ type: "rectangle", x: doc._source.x, y: doc._source.y,
                width: (doc.width ?? 1) * size, height: (doc.height ?? 1) * size, rotation: 0, hole: false }],
            behaviors: [{ type: LINGERING_BEHAVIOR, name: "Ruby — burning ground",
                system: { events: [CONST.REGION_EVENTS.TOKEN_TURN_END] } }],
            flags: {
                [MODULE_ID]: {
                    [LINGERING]: {
                        expiresAt: game.time.worldTime + 60, name: "Ruby — burning ground",
                        itemUuid: null, originUuid: origin.uuid,
                        damage: { formula: "1d6", type: "fire", persistent: false },
                        save: null, affects: null, lightIds: [], wallIds: [],
                    },
                },
                pf2e: { areaShape: "burst" },
            },
        }]);
        if (region) await say(origin, `<strong>Furnace Veins</strong>: the ground under ${doc.name} catches; anyone ending a turn there takes 1d6 fire.`);
        return region ?? null;
    },

    /** After damage lands on an Assimilator. */
    async taken(actor, params, before) {
        const live = liveActor(actor, params);
        if (!isWriter() || classSlugOf(live) !== "assimilator") return;
        const after = live.hitPoints?.value ?? before;
        const types = byType(params?.damage);
        const energy = Object.keys(types).filter((t) => ENERGY.has(t));

        // Molten Carapace (Ruby + Iron): the melee unarmed or reach attacker burns for half your level.
        const weapon = params?.item;
        const attacker = weapon?.actor;
        // In force as the engine reckons it: slotted, and Ruby and Iron at 2+ (or Electrum standing in).
        const moltenOn = live.getRollOptions().includes("assimilator:bond:molten-carapace") && !suppressed(live);
        const traits = weapon?.system?.traits?.value ?? [];
        const meleeUnarmedOrReach = weapon && (weapon.isMelee ?? weapon.system?.range == null)
            && (traits.includes("unarmed") || traits.some((t) => t.startsWith("reach")) || weapon.category === "unarmed");
        if (after < before && moltenOn && attacker && attacker !== live && meleeUnarmedOrReach) {
            // Greater Bond: half again on the chosen Bond's numbers.
            const amount = Math.ceil(Math.floor(live.level / 2) * (live.flags?.[MODULE_ID]?.[KEY]?.derived?.gb?.molten_carapace ?? 1));
            const token = attacker.getActiveTokens?.(true, true)[0];
            const roll = await new (CONFIG.Dice.rolls.find((c) => c.name === "DamageRoll"))(`${amount}[fire]`).evaluate();
            await attacker.applyDamage({ damage: roll, token });
            await say(live, `<strong>Molten Carapace</strong>: ${attacker.name} burns for ${amount}.`);
        }

        // Amber Depth 1: taking energy damage stores a charge.
        if (after < before && depthOf(live, "amber") >= 1 && energy.length) await AssimilatorDamage.charge(live, energy[0]);
        // Copper Depth 2: fire or electricity damage charges the next Strike.
        const charged = energy.find((t) => t === "fire" || t === "electricity");
        if (after < before && depthOf(live, "copper") >= 2 && charged) {
            await AssimilatorDamage.mark(live, `effect-conductive-charge-${charged}`);
        }
        // At 0 Hit Points: Hematite Depth 4 stands you up at your level; failing that, Emerald Depth 4 keeps you at 1.
        if (before > 0 && after === 0) {
            if (depthOf(live, "hematite") >= 4 && !spent(live, "hematite", "day")) {
                await spend(live, "hematite", "day");
                await live.update({ "system.attributes.hp.value": live.level });
                await live.decreaseCondition?.("dying", { forceRemove: true });
                await live.decreaseCondition?.("unconscious", { forceRemove: true });
                await say(live, `<strong>Ferrous Blood</strong>: ${live.name} stands at ${live.level} Hit Points.`);
            } else if (depthOf(live, "emerald") >= 4 && !spent(live, "emerald", "day")) {
                await spend(live, "emerald", "day");
                await live.update({ "system.attributes.hp.value": 1 });
                await live.decreaseCondition?.("dying", { forceRemove: true });
                await live.decreaseCondition?.("unconscious", { forceRemove: true });
                await AssimilatorDamage.mark(live, "effect-knitting-surge");
                await say(live, `<strong>Knitting Flesh</strong>: ${live.name} is reduced to 1 instead, and knits fast.`);
            }
        }
    },

    /** Put an effect from the pack on a creature, replacing its own earlier copy. */
    async mark(actor, slug, flags = null, rename = null) {
        const doc = await effect(slug);
        if (!doc || !actor) return;
        const source = foundry.utils.deepClone(doc.toObject());
        if (flags) foundry.utils.setProperty(source, `flags.${MODULE_ID}.${KEY}`, { ...flags });
        if (rename) source.name = `Effect: ${rename}`;
        const old = actor.itemTypes.effect.filter((e) => e.slug === slug).map((e) => e.id);
        if (old.length) await actor.deleteEmbeddedDocuments("Item", old);
        await actor.createEmbeddedDocuments("Item", [source]);
    },

    /** Amber: add a charge of a type to the Reservoir, up to its maximum. */
    async charge(actor, type) {
        const max = depthOf(actor, "amber") >= 2 ? 5 : 3;
        const state = actor.flags?.[MODULE_ID]?.[KEY]?.reservoir ?? { charges: 0, type: null };
        await AssimilatorDamage.setReservoir(actor, Math.min(max, (state.charges ?? 0) + 1), type);
        await say(actor, `<strong>Reservoir</strong>: ${Math.min(max, (state.charges ?? 0) + 1)}/${max} charges of ${type}.`);
    },

    /**
     * Write the Reservoir. The count is also a roll option, `self:reservoir-charges:<n>`, so *Discharge*'s riders
     * can refuse to fire on fewer than 3 with pf2e's own `gte` — and the stored type is `…:reservoir:<type>`.
     */
    async setReservoir(actor, charges, type) {
        const before = actor.flags?.[MODULE_ID]?.[KEY]?.reservoir?.charges ?? 0;
        const update = { [`flags.${MODULE_ID}.${KEY}.reservoir`]: { charges, type } };
        if (before !== charges) update[`flags.pf2e.rollOptions.all.-=self:reservoir-charges:${before}`] = null;
        if (charges > 0) update[`flags.pf2e.rollOptions.all.self:reservoir-charges:${charges}`] = true;
        await actor.update(update);
    },

    /** Draw on the Reservoir: 1 charge for +1d4, or at Amber Depth 2 with 2 to spare, 2 for +1d6 + 2. */
    async draw(actor) {
        if (suppressed(actor)) return say(actor, "<strong>Reservoir</strong>: the symbiont is suppressed.");
        const state = actor.flags?.[MODULE_ID]?.[KEY]?.reservoir ?? { charges: 0 };
        if (!state.charges) return say(actor, "<strong>Reservoir</strong>: empty.");
        const big = depthOf(actor, "amber") >= 2 && state.charges >= 2;
        const doc = await effect("effect-reservoir-primed");
        const source = foundry.utils.deepClone(doc.toObject());
        foundry.utils.setProperty(source, `flags.${MODULE_ID}.${KEY}`, { die: big ? "d6" : "d4", bonus: big ? 2 : 0, type: state.type });
        await actor.createEmbeddedDocuments("Item", [source]);
        await AssimilatorDamage.setReservoir(actor, state.charges - (big ? 2 : 1), state.type);
    },

    /** Discharge: the riders fire on the use; the cost is taken once they have. */
    async discharge(actor) {
        if (suppressed(actor)) return say(actor, "<strong>Discharge</strong>: the symbiont is suppressed.");
        const state = actor.flags?.[MODULE_ID]?.[KEY]?.reservoir ?? { charges: 0 };
        if (state.charges < 3) return say(actor, "<strong>Discharge</strong> needs 3 charges; the Reservoir has "
            + `${state.charges}.`);
        await AssimilatorDamage.setReservoir(actor, state.charges - 3, state.type);
    },

    /** Manganese Depth 4: whoever ends a turn beside a Manganese 4 Assimilator — any creature, allies too — rots. */
    async rot(combatant) {
        const token = combatant?.token?.object;
        const actor = combatant?.actor;
        if (!token || !actor) return 0;
        const { inflictPersistent } = await import("../riders/apply.mjs");
        let hit = 0;
        for (const other of canvas.tokens.placeables) {
            const source = other.actor;
            if (!source || source.id === actor.id || classSlugOf(source) !== "assimilator" || depthOf(source, "manganese") < 4) continue;
            if (canvas.grid.measurePath([token.center, other.center]).distance > 5) continue;
            await inflictPersistent(actor, { formula: "1d6", damageType: "acid", dc: 15 });
            await say(source, `<strong>Rot Touch</strong>: ${actor.name} ends its turn beside ${source.name} — 1d6 persistent acid.`);
            hit++;
        }
        return hit;
    },

    /** Copper Depth 3-4: the damage arcs to a creature adjacent to the target. */
    async arc(target, origin, type, amount) {
        const from = target.getActiveTokens?.(true, true)[0]?.object ?? null;
        if (!from || amount <= 0) return;
        const originToken = origin.getActiveTokens?.(true, true)[0]?.id;
        const next = canvas.tokens.placeables.find((t) => t !== from && t.document.id !== originToken && t.actor
            && canvas.grid.measurePath([from.center, t.center]).distance <= 5);
        if (!next) return;
        const DamageRoll = CONFIG.Dice.rolls.find((c) => c.name === "DamageRoll");
        const roll = await new DamageRoll(`${amount}[${type}]`).evaluate();
        await next.actor.applyDamage({ damage: roll, token: next.document });
        await say(origin, `<strong>Conduction</strong>: ${amount} ${type} arcs to ${next.name}.`);
    },

    /** Copper Depth 1: the point conducted into a creature lands at the start of its next turn. */
    async conduct(combatant) {
        const actor = combatant?.actor;
        const pending = actor?.flags?.[MODULE_ID]?.[KEY]?.conducted;
        if (!pending) return;
        await actor.update({ [`flags.${MODULE_ID}.${KEY}.-=conducted`]: null });
        const DamageRoll = CONFIG.Dice.rolls.find((c) => c.name === "DamageRoll");
        const roll = await new DamageRoll(`1[${pending.type}]`).evaluate();
        await actor.applyDamage({ damage: roll, token: combatant.token });
    },

    /** Lapis Lazuli Depth 3: whisper the owner one resistance, weakness or immunity they have not been told. */
    async reveal(origin, target) {
        const known = new Set(origin.flags?.[MODULE_ID]?.[KEY]?.learned?.[target.id] ?? []);
        const iwr = [
            ...target.attributes.resistances.map((r) => `resistance ${r.type} ${r.value}`),
            ...target.attributes.weaknesses.map((w) => `weakness ${w.type} ${w.value}`),
            ...target.attributes.immunities.map((i) => `immunity ${i.type}`),
        ];
        const next = iwr.find((x) => !known.has(x));
        if (!next) return;
        known.add(next);
        await origin.update({ [`flags.${MODULE_ID}.${KEY}.learned.${target.id}`]: [...known] });
        const owners = game.users.filter((u) => origin.testUserPermission(u, "OWNER")).map((u) => u.id);
        await ChatMessage.create({ whisper: owners, speaker: ChatMessage.getSpeaker({ actor: origin }),
            content: `<p><strong>Reading Eye</strong>: ${target.name} has <strong>${next}</strong>.</p>` });
    },
};

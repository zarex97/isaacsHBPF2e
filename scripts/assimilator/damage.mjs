import { shadowTarget } from "../riders/bypass.mjs";
import { DamageBus, PRIORITY } from "../lib/damage-bus.mjs";
import { encounterOf } from "../lib/encounter-damage.mjs";
import { MODULE_ID } from "../sky/signs.mjs";

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

/** The effective Depth of a bound Substrate on this creature, 0 if unbound or switched off by a broken plate. */
export function depthOf(actor, slug) {
    if (!actor?.getRollOptions) return 0;
    const options = actor.getRollOptions();
    if (options.includes("assimilator:suppressed")) return 0;
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

export const AssimilatorDamage = {
    registerHooks() {
        DamageBus.before("the Assimilator's passive defences", PRIORITY.carapaceBlock + 1,
            (actor, params) => AssimilatorDamage.defend(actor, params));
        DamageBus.before("Manganese's corrosion", PRIORITY.bypass + 1, (actor) => AssimilatorDamage.corroded(actor));
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
    },

    /** After damage lands on an Assimilator. */
    async taken(actor, params, before) {
        const live = liveActor(actor, params);
        if (!isWriter() || !live?.class || live.class.slug !== "assimilator") return;
        const after = live.hitPoints?.value ?? before;
        const types = byType(params?.damage);
        const energy = Object.keys(types).filter((t) => ENERGY.has(t));

        // Molten Carapace (Ruby + Iron): the melee unarmed or reach attacker burns for half your level.
        const weapon = params?.item;
        const attacker = weapon?.actor;
        // In force as the engine reckons it: slotted, and Ruby and Iron at 2+ (or Electrum standing in).
        const moltenOn = live.getRollOptions().includes("assimilator:bond:molten-carapace");
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
        const state = actor.flags?.[MODULE_ID]?.[KEY]?.reservoir ?? { charges: 0 };
        if (state.charges < 3) return say(actor, "<strong>Discharge</strong> needs 3 charges; the Reservoir has "
            + `${state.charges}.`);
        await AssimilatorDamage.setReservoir(actor, state.charges - 3, state.type);
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

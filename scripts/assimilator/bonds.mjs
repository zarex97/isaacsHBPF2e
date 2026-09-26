import { DamageBus, PRIORITY } from "../lib/damage-bus.mjs";
import { encounterOf } from "../lib/encounter-damage.mjs";
import { shadowTarget } from "../riders/bypass.mjs";
import { Relay } from "../riders/relay.mjs";
import { MODULE_ID } from "../sky/signs.mjs";
import { AssimilatorDamage, byType, depthOf } from "./damage.mjs";
import { bondOption, Engine } from "./engine.mjs";

/**
 * The Bonds that happen on an event (lexicon §14.1).
 *
 * A Bond is in force when the engine says so — slotted, both Substrates at Depth 2 or higher, or Electrum standing
 * in — and the engine writes that as one roll option, `assimilator:bond:<slug>`. The Bonds that are a number on the
 * sheet are rules on the Bond's effect keyed off it; the rest are here, keyed off the same option, so a Bond whose
 * Substrate is shed stops in both places at once.
 */

const KEY = "assimilator";
const METAL_ARMOUR = ["chain", "plate", "composite"];
const STAMP = "persistentFrom";

function isWriter() {
    return game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM;
}

/** Is this Bond in force on this creature? */
export function bondActive(actor, slug) {
    const options = actor?.getRollOptions?.() ?? [];
    return options.includes(bondOption(slug)) && !options.includes("assimilator:suppressed");
}

function live(actor) {
    return actor?.id ? game.actors.get(actor.id) ?? actor : actor;
}

async function say(actor, html, extra = {}) {
    return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<p>${html}</p>`, ...extra });
}

async function heal(actor, amount) {
    const hp = actor.attributes.hp;
    const next = Math.min(hp.max, hp.value + amount);
    if (next > hp.value) await actor.update({ "system.attributes.hp.value": next });
    return next - hp.value;
}

function DamageRoll() {
    return CONFIG.Dice.rolls.find((c) => c.name === "DamageRoll");
}

function resistance(actor, type) {
    return actor.attributes?.resistances?.find((r) => r.type === type)?.value ?? 0;
}

function immune(actor, type) {
    return !!actor.attributes?.immunities?.some((i) => i.type === type);
}

/**
 * "Counts as fire and electricity, using whichever resistance is lower": the fire meets the lower of the two. An
 * immunity to fire is the highest resistance there is, so fire goes through a creature that is not immune to the other.
 */
function dualType(actor, type, other) {
    if (immune(actor, other)) return null;
    if (immune(actor, type)) return shadowTarget(actor, { immunities: [type] });
    const excess = resistance(actor, type) - resistance(actor, other);
    return excess > 0 ? shadowTarget(actor, { reduction: excess, types: [type] }) : null;
}

/** Add to a piece of damage after resistances — Conduction's "+2 per damage die" against metal armour. */
function addDamage(actor, amount, why, notes) {
    if (!(amount > 0)) return null;
    const shadowed = Object.prototype.hasOwnProperty.call(actor, "calculateHealthDelta");
    const original = actor.calculateHealthDelta;
    actor.calculateHealthDelta = function (args) {
        if (args.delta > 0) notes.push(`${why} +${amount}`);
        return original.call(this, { ...args, delta: args.delta > 0 ? args.delta + amount : args.delta });
    };
    return () => {
        if (shadowed) actor.calculateHealthDelta = original;
        else delete actor.calculateHealthDelta;
    };
}

function fireDice(damage) {
    return (damage?.instances ?? []).filter((i) => i.type === "fire" && !i.persistent)
        .reduce((sum, i) => sum + (i.dice ?? []).reduce((n, d) => n + (Number(d.number) || 0), 0), 0);
}

function wearsMetal(actor) {
    return (actor.itemTypes?.armor ?? []).some((a) => a.isEquipped && METAL_ARMOUR.includes(a.group));
}

function isObject(actor) {
    return ["hazard", "vehicle"].includes(actor.type) || !!actor.traits?.has?.("object");
}

/** The Assimilator whose Mutation left this persistent damage, stamped on the condition when it landed. */
function persistentOrigin(condition) {
    const uuid = condition?.flags?.[MODULE_ID]?.[STAMP];
    return uuid ? fromUuidSync(uuid) : null;
}

function roundKey(actor) {
    const combat = encounterOf(actor);
    return combat?.started ? `${combat.id}:${combat.round}` : null;
}

export const Bonds = {
    bondActive,

    registerHooks() {
        Relay.register?.("assimilatorBondEnd", (payload) => Bonds.endCondition(payload));
        DamageBus.before("the Bonds that shape damage", PRIORITY.bypass + 3, (actor, params) => Bonds.shape(actor, params));
        DamageBus.after("the Bonds that answer damage", PRIORITY.riders + 5,
            (actor, params, before) => Bonds.answer(actor, params, before));

        Hooks.on("pf2e.startTurn", (combatant) => {
            if (isWriter()) Bonds.startTurn(combatant?.actor).catch((e) => console.error("Isaac's Homebrew | Bonds", e));
        });
        Hooks.on("createChatMessage", (message) => {
            if (isWriter()) Bonds.onMessage(message).catch((e) => console.error("Isaac's Homebrew | Bonds", e));
        });
        // Second Heart: dying reaching the value that kills.
        const dying = (item) => {
            if (isWriter() && item.slug === "dying") Bonds.secondHeart(item).catch((e) => console.error("Isaac's Homebrew | Second Heart", e));
        };
        Hooks.on("createItem", dying);
        Hooks.on("updateItem", dying);
        // Living Flame: persistent fire coming or going, on anyone.
        const burning = (item) => {
            if (isWriter() && item.slug === "persistent-damage") Bonds.refreshLivingFlame();
        };
        Hooks.on("createItem", burning);
        Hooks.on("updateItem", burning);
        Hooks.on("deleteItem", burning);
        // Rime Flow: the Carapace says when Liquid Form (Pass Through) turned a blow.
        Hooks.on("isaacsHb.assimilatorReduced", (actor, info) => {
            if (isWriter()) Bonds.rimeFlow(actor, info).catch((e) => console.error("Isaac's Homebrew | Rime Flow", e));
        });
        Hooks.on("renderChatMessageHTML", (message, html) => Bonds.bindCard(message, html));
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  Before damage lands                                                                     */
    /* ---------------------------------------------------------------------------------------- */

    shape(actor, params) {
        const damage = params?.damage;
        if (!damage || typeof damage === "number") return undefined;
        const types = Object.keys(byType(damage));
        const undo = [];
        const notes = [];

        // Rot (Jet + Manganese): persistent acid from the Assimilator lowers every resistance by another 5, while it lasts.
        const rotting = (actor.itemTypes?.condition ?? []).some((c) => c.slug === "persistent-damage"
            && c.system?.persistent?.damageType === "acid" && bondActive(persistentOrigin(c), "rot"));
        if (rotting) undo.push(shadowTarget(actor, { reduction: 5 }));

        const origin = params?.item?.actor;
        if (origin && origin.id !== actor.id) {
            if (types.includes("fire") && bondActive(origin, "conduction")) {
                undo.push(dualType(actor, "fire", "electricity"));
                if (wearsMetal(actor)) undo.push(addDamage(actor, 2 * fireDice(damage), "Conduction", notes));
            }
            if (types.includes("fire") && bondActive(origin, "blackfire")) undo.push(dualType(actor, "fire", "void"));
            // Siege Frame: "You ignore an object's Hardness up to 10."
            if (bondActive(origin, "siege-frame") && isObject(actor) && actor.hardness > 0) {
                undo.push(shadowTarget(actor, { hardness: 10 }));
            }
            // Reaper's Edge: void ignores an incorporeal undead's resistances and immunities entirely.
            const traits = actor.system?.traits?.value ?? [];
            if (types.includes("void") && bondActive(origin, "reapers-edge") && traits.includes("undead")
                && traits.includes("incorporeal")) {
                undo.push(shadowTarget(actor, { reduction: Number.MAX_SAFE_INTEGER, types: ["void"], immunities: ["void"] }));
                // An undead's void healing is what keeps void out entirely (`isAffectedBy` asks it); for this blow it does not.
                const hp = actor.system?.attributes?.hp;
                if (hp?.negativeHealing) {
                    hp.negativeHealing = false;
                    undo.push(() => { hp.negativeHealing = true; });
                }
            }
        }
        const done = undo.filter(Boolean);
        if (!done.length) return undefined;
        return () => {
            for (const restore of done.reverse()) restore();
            if (notes.length) say(live(origin) ?? actor, `<strong>${notes.join("; ")}</strong> against ${actor.name}.`);
        };
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  After damage lands                                                                      */
    /* ---------------------------------------------------------------------------------------- */

    async answer(actor, params, before) {
        if (!isWriter()) return;
        const target = live(params?.token?.actor ?? actor);
        const after = target.hitPoints?.value ?? before;
        const lost = Math.max(0, before - after);
        const types = byType(params?.damage);
        const originItem = params?.item;
        const origin = originItem?.actor ? live(originItem.actor) : null;

        // Exsanguinary (Garnet + Jet): a bleed tick heals whoever inflicted it, by what it dealt.
        if (originItem?.type === "condition" && originItem.slug === "persistent-damage" && lost > 0) {
            const from = persistentOrigin(originItem);
            if (originItem.system?.persistent?.damageType === "bleed" && bondActive(from, "exsanguinary")) {
                const healed = await heal(live(from), lost);
                if (healed) await say(from, `<strong>Exsanguinary</strong>: ${from.name} drinks ${healed} from ${target.name}'s bleeding.`);
            }
        }

        // What the Assimilator's damage did to someone else.
        if (origin && origin.id !== target.id && origin.class?.slug === "assimilator") {
            await Bonds.stampPersistent(target, origin);
            // Blackfire: "When it kills a creature, you regain Hit Points equal to your level."
            if (types.fire && bondActive(origin, "blackfire") && before > 0 && after === 0) {
                const healed = await heal(origin, origin.level);
                if (healed) await say(origin, `<strong>Blackfire</strong>: ${origin.name} regains ${healed} Hit Points.`);
            }
            if (originItem?.slug === "arcane-channel" && lost > 0) {
                const type = Object.keys(types)[0];
                // Storm Battery: your own ranged Strikes charge the Reservoir.
                if (bondActive(origin, "storm-battery") && type && !params?.lashed) await AssimilatorDamage.charge(origin, type);
                // Lightning Lash: it chains to a second creature within 15 feet of the first, for half damage.
                if (bondActive(origin, "lightning-lash") && !params?.lashed) await Bonds.lash(origin, target, params, type);
            }
            // Cold Reading: your Studied creature is slowed 1 the first time you damage it each round.
            if (lost > 0 && bondActive(origin, "cold-reading")
                && target.itemTypes.effect.some((e) => e.slug === "effect-studied")) {
                const key = roundKey(origin) ?? "no-round";
                const used = origin.flags?.[MODULE_ID]?.[KEY]?.used?.coldReading?.[target.id];
                if (used !== key) {
                    await origin.update({ [`flags.${MODULE_ID}.${KEY}.used.coldReading.${target.id}`]: key });
                    await AssimilatorDamage.mark(target, "effect-cold-reading");
                }
            }
        }

        // What happened to an Assimilator.
        if (target.class?.slug === "assimilator" && lost > 0) await Bonds.runawayGrowth(target, before, after);
        // Living Armour: an ally within 15 feet took damage — Reactive Evolution may answer.
        if (lost > 0) await Bonds.livingArmour(target, types);
    },

    /** Mark the persistent damage an Assimilator just left on a creature as theirs. */
    async stampPersistent(target, origin) {
        const unmarked = target.itemTypes.condition.filter((c) => c.slug === "persistent-damage" && !c.flags?.[MODULE_ID]?.[STAMP]);
        if (!unmarked.length) return;
        await target.updateEmbeddedDocuments("Item", unmarked.map((c) => ({ _id: c.id, [`flags.${MODULE_ID}.${STAMP}`]: origin.uuid })));
    },

    async lash(origin, target, params, type) {
        const from = target.getActiveTokens?.(true, true)?.[0]?.object ?? target.getActiveTokens?.()?.[0];
        if (!from) return;
        const originToken = origin.getActiveTokens?.(true, true)?.[0]?.id;
        const next = canvas.tokens.placeables.find((t) => t.actor && t !== from && t.document.id !== originToken
            && t.actor.id !== target.id && canvas.grid.measurePath([from.center, t.center]).distance <= 15);
        const half = Math.floor((Number(params?.damage?.total) || 0) / 2);
        if (!next || half <= 0) return;
        const roll = await new (DamageRoll())(`${half}[${type}]`).evaluate();
        await next.actor.applyDamage({ damage: roll, token: next.document, item: params.item, lashed: true });
        await say(origin, `<strong>Lightning Lash</strong>: the Arcane Channel chains to ${next.name} for ${half}.`);
    },

    async runawayGrowth(actor, before, after) {
        const half = actor.hitPoints.max / 2;
        if (!(before >= half && after < half) || !bondActive(actor, "runaway-growth")) return;
        await Engine.rollAberrations(actor, { reroll: true, forced: true });
        const healed = await heal(live(actor), 2 * actor.level);
        await say(actor, `<strong>Runaway Growth</strong>: ${actor.name}'s Aberrations re-roll, and they regain ${healed} Hit Points.`);
    },

    async livingArmour(damaged, types) {
        const at = damaged.getActiveTokens?.(true, true)?.[0]?.object ?? damaged.getActiveTokens?.()?.[0];
        if (!at) return;
        for (const token of canvas.tokens.placeables) {
            const a = token.actor;
            if (!a || a.id === damaged.id || !bondActive(a, "living-armour") || !damaged.isAllyOf?.(a)) continue;
            if (canvas.grid.measurePath([token.center, at.center]).distance > 15) continue;
            const owners = game.users.filter((u) => a.testUserPermission(u, "OWNER")).map((u) => u.id);
            await ChatMessage.create({ whisper: owners, speaker: ChatMessage.getSpeaker({ actor: a }),
                flags: { [MODULE_ID]: { livingArmour: { ally: damaged.uuid, types: Object.keys(types) } } },
                content: `<p><strong>Living Armour</strong>: ${damaged.name} took ${Object.keys(types).join(", ") || "damage"} `
                    + `within 15 feet — ${a.name}'s <strong>Reactive Evolution</strong> may answer it.</p>` });
        }
    },

    /** Rime Flow (Sapphire + Mercury): Liquid Form's reduction also freezes the attacker for what it turned. */
    async rimeFlow(actor, { by, amount, attacker }) {
        if (by !== "Pass Through" || !(amount > 0) || !attacker || !bondActive(actor, "rime-flow")) return;
        const token = attacker.getActiveTokens?.(true, true)?.[0];
        const roll = await new (DamageRoll())(`${amount}[cold]`).evaluate();
        await attacker.applyDamage({ damage: roll, token });
        await say(actor, `<strong>Rime Flow</strong>: ${attacker.name} freezes for ${amount}.`);
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  Turns, messages, dying                                                                  */
    /* ---------------------------------------------------------------------------------------- */

    async startTurn(actor) {
        if (!actor || actor.class?.slug !== "assimilator") return;
        // Solar Core: "You take 1d6 fire at the start of each of your turns."
        if (bondActive(actor, "solar-core") && actor.itemTypes.effect.some((e) => e.slug === "effect-solar-core")) {
            const roll = await new (DamageRoll())("1d6[fire]").evaluate();
            await actor.applyDamage({ damage: roll, token: actor.getActiveTokens?.(true, true)?.[0] });
            await say(actor, `<strong>Solar Core</strong>: ${actor.name} burns for ${roll.total}.`);
        }
        // Chitin Bloom: "Your fast healing also repairs your Carapace."
        const fastHealing = actor.flags?.[MODULE_ID]?.[KEY]?.derived?.fastHealing ?? 0;
        const plate = actor.itemTypes.armor.find((a) => a.slug === "living-plate");
        if (bondActive(actor, "chitin-bloom") && fastHealing > 0 && plate && plate.hitPoints.value < plate.hitPoints.max) {
            const next = Math.min(plate.hitPoints.max, plate.hitPoints.value + fastHealing);
            await plate.update({ "system.hp.value": next });
            await say(actor, `<strong>Chitin Bloom</strong>: the Carapace knits ${next - plate.hitPoints.value}.`);
        }
    },

    async onMessage(message) {
        const actor = message.actor;
        const context = message.flags?.pf2e?.context;
        const item = message.item;
        // Crowned Fortune: the imperial Strike is spent by the attack it was declared for.
        if (actor && context?.type === "attack-roll") {
            const imperial = actor.itemTypes.effect.filter((e) => e.slug === "effect-imperial");
            if (imperial.length) await actor.deleteEmbeddedDocuments("Item", imperial.map((e) => e.id));
        }
        // Mindstorm: a creature that fails a save against the Assimilator's Mutation.
        if (actor && context?.type === "saving-throw" && ["failure", "criticalFailure"].includes(context.outcome)) {
            const origin = context.origin?.actor ? fromUuidSync(context.origin.actor) : null;
            if (origin && origin.id !== actor.id && bondActive(origin, "mindstorm")) {
                await AssimilatorDamage.mark(actor, "effect-mindstorm");
                await say(origin, `<strong>Mindstorm</strong>: ${actor.name} is stupefied 1, and its next spell needs a DC 5 flat check.`);
            }
        }
        // Cleansing Light: the Flare also ends one condition of value 1 on every ally inside it.
        if (actor && !context && ["flare", "healing-flare"].includes(item?.slug) && bondActive(actor, "cleansing-light")) {
            await Bonds.cleansingLight(actor, item);
        }
        // Storm Battery: the cone was paid for with three charges.
        if (actor && !context && item?.slug === "storm-channel" && bondActive(actor, "storm-battery")) {
            setTimeout(() => AssimilatorDamage.discharge(actor), 1500);
        }
    },

    async cleansingLight(actor, item) {
        const from = actor.getActiveTokens?.(true, true)?.[0]?.object;
        if (!from) return;
        const radius = item.slug === "healing-flare" || (depthOf(actor, "magnesium") >= 4) ? 30 : 15;
        for (const token of canvas.tokens.placeables) {
            const ally = token.actor;
            if (!ally || ally.id === actor.id || !ally.isAllyOf?.(actor)) continue;
            if (canvas.grid.measurePath([from.center, token.center]).distance > radius) continue;
            const ones = ally.itemTypes.condition.filter((c) => c.active !== false && c.value === 1);
            if (ones.length === 1) {
                await ally.decreaseCondition(ones[0].slug, { forceRemove: true });
                await say(actor, `<strong>Cleansing Light</strong>: ${ally.name} is no longer ${ones[0].name}.`);
            } else if (ones.length > 1) {
                const buttons = ones.map((c) => `<button type="button" data-action="isaacs-hb-assim-end" `
                    + `data-actor="${ally.uuid}" data-condition="${c.id}">${c.name}</button>`).join("");
                await say(actor, `<strong>Cleansing Light</strong>: end one condition on ${ally.name}.</p><p>${buttons}`,
                    { flags: { [MODULE_ID]: { bondEnd: { origin: actor.uuid, item: item.uuid, ally: ally.uuid,
                        options: ones.map((c) => c.id) } } } });
            }
        }
    },

    bindCard(message, html) {
        const card = message?.flags?.[MODULE_ID]?.bondEnd;
        if (!card || !html?.querySelectorAll || html.dataset?.isaacsHbBondBound) return;
        html.dataset.isaacsHbBondBound = "1";
        const buttons = [...html.querySelectorAll(`[data-action="isaacs-hb-assim-end"]`)];
        const origin = fromUuidSync(card.origin);
        for (const button of buttons) {
            if (card.used || !origin?.isOwner) button.disabled = true;
            button.addEventListener("click", async () => {
                for (const b of buttons) b.disabled = true;
                await Relay.request({ action: "assimilatorBondEnd", messageId: message.id, conditionId: button.dataset.condition });
            });
        }
    },

    async endCondition({ messageId, conditionId }) {
        const message = game.messages.get(messageId);
        const card = message?.flags?.[MODULE_ID]?.bondEnd;
        if (!card || card.used || !card.options?.includes(conditionId)) return;
        await message.update({ [`flags.${MODULE_ID}.bondEnd.used`]: conditionId });
        const ally = await fromUuid(card.ally);
        const condition = ally?.items?.get(conditionId);
        if (!condition) return;
        await ally.decreaseCondition(condition.slug, { forceRemove: true });
        await say(await fromUuid(card.origin), `<strong>Cleansing Light</strong>: ${ally.name} is no longer ${condition.name}.`);
    },

    /** Second Heart (Garnet + Emerald): once per day, when you would die, you don't. */
    async secondHeart(item) {
        const actor = item.actor;
        if (!actor || actor.class?.slug !== "assimilator" || !bondActive(actor, "second-heart")) return;
        const max = actor.attributes?.dying?.max ?? 4;
        if ((item.value ?? 0) < max) return;
        const day = actor.flags?.[MODULE_ID]?.[KEY]?.day ?? 0;
        if (actor.flags?.[MODULE_ID]?.[KEY]?.used?.secondHeart === day) return;
        await actor.update({ [`flags.${MODULE_ID}.${KEY}.used.secondHeart`]: day, "system.attributes.hp.value": 1 });
        await actor.decreaseCondition("dying", { forceRemove: true });
        await actor.decreaseCondition("unconscious", { forceRemove: true });
        if (actor.statuses?.has("dead")) await actor.toggleStatusEffect("dead", { active: false });
        await actor.increaseCondition("stunned", { value: 1 });
        await say(actor, `<strong>Second Heart</strong>: ${actor.name} does not die — 1 Hit Point, stunned 1, as the second heart takes over.`);
    },

    /** Living Flame (Ruby + Emerald): burning, or burning someone, is an option its fast healing reads. */
    async refreshLivingFlame() {
        const OPTION = "assimilator:living-flame";
        const fires = canvas.tokens?.placeables?.flatMap((t) => (t.actor?.itemTypes?.condition ?? [])
            .filter((c) => c.slug === "persistent-damage" && c.system?.persistent?.damageType === "fire")
            .map((c) => ({ bearer: t.actor, from: persistentOrigin(c) }))) ?? [];
        for (const token of canvas.tokens?.placeables ?? []) {
            const a = token.actor;
            if (!a || a.class?.slug !== "assimilator") continue;
            const burning = bondActive(a, "living-flame")
                && fires.some((f) => f.bearer.id === a.id || f.from?.id === a.id);
            const has = !!a.flags?.pf2e?.rollOptions?.all?.[OPTION];
            if (burning && !has) await a.update({ [`flags.pf2e.rollOptions.all.${OPTION}`]: true });
            if (!burning && has) await a.update({ [`flags.pf2e.rollOptions.all.-=${OPTION}`]: null });
        }
    },
};

import { DamageBus, PRIORITY } from "../lib/damage-bus.mjs";
import { encounterOf } from "../lib/encounter-damage.mjs";
import { Relay } from "../riders/relay.mjs";
import { MODULE_ID } from "../sky/signs.mjs";
import { AssimilatorDamage, byType, depthOf } from "./damage.mjs";
import { Engine } from "./engine.mjs";

/**
 * The Assimilator feats that happen on an event or ask the player something (guide §8).
 *
 * The feats that are a number or a rule live on the feat's own item; the ones that move the engine's pools and caps
 * are read by the engine. This file is the rest. A feat that asks — which item to Devour, which resistance to share —
 * asks on the owner's own client, and anything written to another creature goes through the relay to the GM.
 */

const KEY = "assimilator";
const PHYSICAL = new Set(["bludgeoning", "piercing", "slashing"]);
const STILL = "assimilator:still";
const MOVED = "assimilator:moved-this-turn";

function isWriter() {
    return game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM;
}

const has = (actor, slug) => Engine.hasFeat(actor, slug);
const live = (actor) => (actor?.id ? game.actors.get(actor.id) ?? actor : actor);
const DamageRoll = () => CONFIG.Dice.rolls.find((c) => c.name === "DamageRoll");
const record = (actor) => actor?.flags?.[MODULE_ID]?.[KEY] ?? {};
const tokenOf = (actor) => actor?.getActiveTokens?.(true, true)?.[0] ?? null;

async function say(actor, html, extra = {}) {
    return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), content: `<p>${html}</p>`, ...extra });
}

function whisperTo(actor) {
    return game.users.filter((u) => actor.testUserPermission(u, "OWNER")).map((u) => u.id);
}

/** Once per encounter / round / day, stamped on the actor. */
function stamp(actor, per) {
    if (per === "day") return record(actor).day ?? 0;
    const combat = encounterOf(actor);
    if (!combat?.started) return null;
    return per === "encounter" ? combat.id : `${combat.id}:${combat.round}`;
}
function spent(actor, key, per) {
    const s = stamp(actor, per);
    return s !== null && record(actor).used?.[key] === s;
}
async function spend(actor, key, per) {
    const s = stamp(actor, per);
    if (s !== null) await actor.update({ [`flags.${MODULE_ID}.${KEY}.used.${key}`]: s });
}

async function effectDoc(slug) {
    const docs = await game.packs.get(`${MODULE_ID}.assimilator-effects`)?.getDocuments();
    return docs?.find((d) => d.slug === slug) ?? null;
}

/** A plain effect built here, for what a picker decided (the resistance shared, the sense assimilated). */
function customEffect(name, img, rules, duration, flags = {}) {
    return {
        name, img, type: "effect",
        system: { rules, duration: duration ?? { expiry: null, sustained: false, unit: "unlimited", value: -1 },
            description: { value: `<p>${name}.</p>` }, tokenIcon: { show: true }, slug: null },
        flags: { [MODULE_ID]: { [KEY]: flags } },
    };
}

/** Ask the owner to pick one of `options` ({ value, label }); resolves to the value, or null. */
async function pick(title, prompt, options) {
    if (!options.length) {
        ui.notifications.info(`${title}: nothing to choose from.`);
        return null;
    }
    const { DialogV2 } = foundry.applications.api;
    return DialogV2.wait({
        window: { title }, content: `<p>${prompt}</p>`, rejectClose: false,
        buttons: options.map((o) => ({ action: String(o.value), label: o.label })),
    });
}

export const Feats = {
    registerHooks() {
        Relay.register?.("assimilatorFeat", (payload) => Feats.onRelay(payload));
        DamageBus.before("Rampart", PRIORITY.carapaceBlock + 2, (actor, params) => Feats.rampart(actor, params));
        DamageBus.after("the feats that answer damage", PRIORITY.riders + 6,
            (actor, params, before) => Feats.answer(actor, params, before));

        // A use: refuse what cannot happen before the card posts, then act.
        Hooks.on("preCreateChatMessage", (message, data) => Feats.gate(data));
        Hooks.on("createChatMessage", (message, _o, userId) => {
            if (isWriter()) Feats.onMessage(message).catch((e) => console.error("Isaac's Homebrew | feats", e));
            if (userId === game.user.id) Feats.onOwnUse(message).catch((e) => console.error("Isaac's Homebrew | feats", e));
        });
        // Shed Skin: a condition of value 2 or lower arrives.
        const gained = (item) => {
            if (isWriter() && item.type === "condition") Feats.shedSkin(item).catch((e) => console.error("Isaac's Homebrew | Shed Skin", e));
        };
        Hooks.on("createItem", gained);
        // Living Fortress: moving, and the end of a turn without moving.
        Hooks.on("updateToken", (token, change) => {
            if (isWriter() && ("x" in change || "y" in change)) Feats.moved(token.actor);
        });
        Hooks.on("pf2e.endTurn", (combatant) => {
            if (isWriter()) Feats.endTurn(combatant?.actor).catch((e) => console.error("Isaac's Homebrew | Living Fortress", e));
        });
        // Wall of Me: when its minute ends, the wall goes.
        Hooks.on("deleteItem", (item) => {
            // Devour's temporary Hit Points last 1 minute.
            if (isWriter() && item.slug === "effect-devour" && item.actor
                && (item.actor.attributes.hp.temp ?? 0) <= item.actor.level) item.actor.update({ "system.attributes.hp.temp": 0 });
            if (isWriter() && item.slug === "effect-wall-of-me") Feats.wallDown(item).catch((e) => console.error("Isaac's Homebrew | Wall of Me", e));
            if (isWriter() && item.slug === "effect-worn-no-longer") Feats.thingReturns(item).catch((e) => console.error("Isaac's Homebrew | The Thing", e));
        });
        // The day's borrowings end at preparations: Assimilate's (unless made permanent), Eat the World's Mass.
        Hooks.on("pf2e.restForTheNight", (actor) => {
            if (isWriter()) Feats.newDay(actor).catch((e) => console.error("Isaac's Homebrew | feats", e));
        });
        Hooks.on("renderChatMessageHTML", (message, html) => Feats.bindCard(message, html));
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  Refusals                                                                                */
    /* ---------------------------------------------------------------------------------------- */

    gate(data) {
        const uuid = data?.flags?.pf2e?.origin?.uuid;
        if (!uuid || data?.flags?.pf2e?.context) return undefined;
        const item = fromUuidSync(uuid);
        const actor = item?.actor;
        if (!actor) return undefined;
        // Plated Guard: "You cannot use Carapace Block while it lasts — the plate is busy."
        if (item.slug === "carapace-block" && actor.itemTypes.effect.some((e) => e.slug === "effect-plated-guard")) {
            ui.notifications.warn("Plated Guard: the plate is busy — no Carapace Block while it lasts.");
            return false;
        }
        // Wall of Me: once per encounter.
        if (["wall-of-me", "second-hunger", "instinctive-surge"].includes(item.slug) && spent(actor, item.slug, "encounter")) {
            ui.notifications.warn(`${item.name}: already used this encounter.`);
            return false;
        }
        if (["wall-of-me", "second-hunger", "instinctive-surge"].includes(item.slug)) spend(actor, item.slug, "encounter");
        return undefined;
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  Damage                                                                                  */
    /* ---------------------------------------------------------------------------------------- */

    /** Rampart: once per round, an adjacent ally's physical damage meets resistance equal to half the plate's Hardness. */
    rampart(actor, params) {
        const damage = params?.damage;
        if (!damage || typeof damage === "number") return undefined;
        const physical = Object.entries(byType(damage)).filter(([t]) => PHYSICAL.has(t)).reduce((s, [, v]) => s + v, 0);
        if (!physical) return undefined;
        const at = tokenOf(actor)?.object ?? tokenOf(actor);
        if (!at?.center) return undefined;
        const guard = canvas.tokens.placeables.find((t) => t.actor && t.actor.id !== actor.id && has(t.actor, "rampart")
            && actor.isAllyOf?.(t.actor) && !spent(t.actor, "rampart", "round")
            && canvas.grid.measurePath([t.center, at.center]).distance <= 5);
        if (!guard) return undefined;
        const plate = guard.actor.itemTypes.armor.find((a) => a.slug === "living-plate");
        const resist = Math.min(5, Math.floor((plate?.hardness ?? 0) / 2));
        if (resist <= 0) return undefined;
        const shadowed = Object.prototype.hasOwnProperty.call(actor, "calculateHealthDelta");
        const original = actor.calculateHealthDelta;
        let turned = 0;
        actor.calculateHealthDelta = function (args) {
            turned = args.delta > 0 ? Math.min(resist, physical, args.delta) : 0;
            return original.call(this, { ...args, delta: args.delta - turned });
        };
        return () => {
            if (shadowed) actor.calculateHealthDelta = original;
            else delete actor.calculateHealthDelta;
            if (turned > 0) {
                spend(live(guard.actor), "rampart", "round");
                say(guard.actor, `<strong>Rampart</strong>: ${guard.actor.name}'s plate turns ${turned} from ${actor.name}.`);
            }
        };
    },

    async answer(actor, params, before) {
        if (!isWriter()) return;
        const target = live(params?.token?.actor ?? actor);
        const after = target.hitPoints?.value ?? before;
        const origin = params?.item?.actor ? live(params.item.actor) : null;
        if (!origin || origin.id === target.id || origin.class?.slug !== "assimilator" || !(after < before)) return;
        // Taste for It: the first time each encounter, Recall Knowledge about it as a free action, +2 circumstance.
        if (has(origin, "taste-for-it") && !spent(origin, "taste-for-it", "encounter")) {
            await spend(origin, "taste-for-it", "encounter");
            await AssimilatorDamage.mark(origin, "effect-taste-for-it");
            await say(origin, `<strong>Taste for It</strong>: ${origin.name} may Recall Knowledge about ${target.name} as a free `
                + "action, with a +2 circumstance bonus.", { whisper: whisperTo(origin) });
        }
        // Devouring Plate: a kill with the Carapace Strike may be Fed on, for a temporary Substrate at Depth 2.
        if (after === 0 && before > 0 && params.item?.slug === "carapace-strike" && has(origin, "devouring-plate")) {
            await say(origin, `<strong>Devouring Plate</strong>: ${origin.name} may Feed on ${target.name} as a free action.</p>`
                + `<p><button type="button" data-action="isaacs-hb-feat" data-kind="devouring">Feed on it</button>`,
            { whisper: whisperTo(origin), flags: { [MODULE_ID]: { featCard: { kind: "devouring", origin: origin.uuid } } } });
        }
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  Messages                                                                                */
    /* ---------------------------------------------------------------------------------------- */

    async onMessage(message) {
        const actor = message.actor;
        const context = message.flags?.pf2e?.context;
        if (!actor) return;
        // Reach of the Thing: the Strike it was declared for spends it.
        if (context?.type === "attack-roll") {
            const reach = actor.itemTypes.effect.filter((e) => e.slug === "effect-reach-of-the-thing");
            if (reach.length) await actor.deleteEmbeddedDocuments("Item", reach.map((e) => e.id));
            const taste = actor.itemTypes.effect.filter((e) => e.slug === "effect-taste-for-it");
            if (taste.length && context.options?.includes("action:recall-knowledge")) await actor.deleteEmbeddedDocuments("Item", taste.map((e) => e.id));
        }
        // Barbed Growth: a creature that critically fails a melee Strike against the Assimilator.
        if (context?.type === "attack-roll" && context.outcome === "criticalFailure") {
            const targetUuid = context.target?.actor;
            const defender = targetUuid ? fromUuidSync(targetUuid) : null;
            const melee = context.options?.includes("item:melee") || !context.options?.some((o) => o.startsWith("item:ranged"));
            if (defender && defender.id !== actor.id && has(defender, "barbed-growth") && melee) {
                const amount = 2 * (record(defender).derived?.highestDepth ?? 0);
                const type = record(defender).derived?.instinctType ?? "bludgeoning";
                if (amount > 0) {
                    const roll = await new (DamageRoll())(`${amount}[${type}]`).evaluate();
                    await actor.applyDamage({ damage: roll, token: tokenOf(actor) });
                    await say(defender, `<strong>Barbed Growth</strong>: ${actor.name} takes ${amount} ${type}.`);
                }
            }
        }
        // Apex Predator: a critical hit with a Mutation — its Depth 4 rider applies. Gold's Instinct offers the same
        // thing; "take the better" is one card, naming every Mutation that could apply it.
        if (context?.type === "attack-roll" && context.outcome === "criticalSuccess" && has(actor, "apex-predator")) {
            await Feats.apex(actor);
        }
    },

    async apex(actor) {
        const catalogue = await Engine.catalogue();
        const effective = record(actor).derived?.effective ?? {};
        const rows = [];
        for (const [slug, depth] of Object.entries(effective)) {
            const entry = catalogue[slug];
            if (entry?.damageFrom === null || entry?.damageFrom === undefined || depth < entry.damageFrom) continue;
            const row = /<tr><td>4<\/td><td>(.*?)<\/td><\/tr>/s.exec(entry.doc?.system?.description?.value ?? "")?.[1];
            if (row) rows.push(`<li><strong>${entry.name.replace(/^Substrate:\s*/, "")}</strong>: ${row}</li>`);
        }
        if (rows.length) {
            await say(actor, `<strong>Apex Predator</strong>: a critical hit with a Mutation — apply its Depth 4 rider:</p><ul>${rows.join("")}</ul><p>`);
        }
    },

    /** The owner's client: the feats that ask something when used. */
    async onOwnUse(message) {
        const item = message.item;
        const actor = item?.actor;
        if (!actor || message.flags?.pf2e?.context) return;
        const run = {
            "devour": () => Feats.devour(actor),
            "sympathetic-growth": () => Feats.sympathetic(actor),
            "wall-of-me": () => Feats.wallOfMe(actor),
            "digest": () => Feats.digest(actor),
            "consume-the-fallen": () => Feats.consumeTheFallen(actor),
            "assimilate": () => Feats.assimilate(actor),
            "regurgitate": () => Feats.regurgitate(actor),
            "second-hunger": () => Feats.secondHunger(actor),
            "shared-symbiosis": () => Feats.sharedSymbiosis(actor),
            "the-thing-that-wears-you": () => Feats.theThing(actor),
            "eat-the-world": () => Feats.eatTheWorld(actor),
        }[item.slug];
        if (run) await run();
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  The feats that ask                                                                      */
    /* ---------------------------------------------------------------------------------------- */

    /** Devour: consume a held object of light Bulk or less; temporary Hit Points equal to your level for 1 minute. */
    async devour(actor) {
        const held = actor.items.filter((i) => i.isOfType?.("physical") && i.isHeld && (i.bulk?.value ?? 0) < 1);
        const choice = await pick("Devour", "Consume an object of light Bulk or less that you are holding.",
            held.map((i) => ({ value: i.id, label: i.name })));
        if (!choice) return;
        const item = actor.items.get(choice);
        if ((item.quantity ?? 1) > 1) await item.update({ "system.quantity": item.quantity - 1 });
        else await item.delete();
        if ((actor.attributes.hp.temp ?? 0) < actor.level) await actor.update({ "system.attributes.hp.temp": actor.level });
        await AssimilatorDamage.mark(actor, "effect-devour");
        await say(actor, `<strong>Devour</strong>: ${actor.name} eats the ${item.name} — ${actor.level} temporary Hit Points for a minute.`);
    },

    /** Sympathetic Growth: an ally gains one of your resistances at half value for 10 minutes. */
    async sympathetic(actor) {
        const ally = [...game.user.targets][0]?.actor;
        if (!ally || ally.id === actor.id) return ui.notifications.warn("Sympathetic Growth: target the ally you touch.");
        const choice = await pick("Sympathetic Growth", `Share one resistance with ${ally.name}, at half value.`,
            actor.attributes.resistances.filter((r) => r.value >= 2).map((r) => ({ value: r.type, label: `${r.type} ${r.value}` })));
        if (!choice) return;
        const value = Math.floor(actor.attributes.resistances.find((r) => r.type === choice).value / 2);
        await Relay.request({ action: "assimilatorFeat", kind: "effect", target: ally.uuid, origin: actor.uuid,
            effect: customEffect(`Sympathetic Growth (${choice} ${value})`, "icons/magic/life/heart-area-circle-red-green.webp",
                [{ key: "Resistance", type: choice, value }], { expiry: "turn-start", sustained: false, unit: "minutes", value: 10 }) });
    },

    /** Wall of Me: a 10-foot line of Carapace — Hardness your level, 5× level Hit Points, 1 minute; the plate −2 Hardness. */
    async wallOfMe(actor) {
        await Relay.request({ action: "assimilatorFeat", kind: "wall", origin: actor.uuid });
    },

    async raiseWall(origin) {
        const at = tokenOf(origin);
        if (!at) return;
        const size = canvas.grid.size;
        const [wall] = await Actor.create([{ name: `Wall of Me (${origin.name})`, type: "hazard", img: "icons/environment/settlement/city-wall.webp",
            system: { attributes: { hp: { value: 5 * origin.level, max: 5 * origin.level }, hardness: origin.level } },
            flags: { [MODULE_ID]: { [KEY]: { wallOf: origin.uuid } } } }]);
        const doc = (await wall.getTokenDocument({ x: at.x + size, y: at.y, width: 2, height: 1 })).toObject();
        const [token] = await canvas.scene.createEmbeddedDocuments("Token", [doc]);
        await AssimilatorDamage.mark(origin, "effect-wall-of-me", { wall: { actor: wall.id, token: token.id } });
        await origin.update({ "flags.pf2e.rollOptions.all.assimilator:wall-standing": true });
        await say(origin, `<strong>Wall of Me</strong>: Hardness ${origin.level}, ${5 * origin.level} Hit Points, for 1 minute.`);
    },

    async wallDown(effect) {
        const actor = effect.actor;
        const wall = effect.flags?.[MODULE_ID]?.[KEY]?.wall;
        if (wall?.token && canvas.scene.tokens.get(wall.token)) await canvas.scene.deleteEmbeddedDocuments("Token", [wall.token]);
        if (wall?.actor) await game.actors.get(wall.actor)?.delete();
        if (actor) await actor.update({ "flags.pf2e.rollOptions.all.-=assimilator:wall-standing": null });
    },

    /** Digest: reduce the stage of one affliction affecting you by 2. */
    async digest(actor) {
        // Production pf2e has no affliction items: an affliction is an effect (poison, disease, curse) whose counter
        // badge is its stage.
        const AFFLICTION = ["poison", "disease", "curse"];
        const afflictions = actor.itemTypes.effect.filter((e) => e.system.badge?.type === "counter"
            && (e.system.traits?.value ?? []).some((t) => AFFLICTION.includes(t)));
        const choice = await pick("Digest", "Reduce the stage of one affliction by 2.",
            afflictions.map((a) => ({ value: a.id, label: `${a.name} (stage ${a.system.badge.value})` })));
        if (!choice) return;
        const affliction = actor.items.get(choice);
        const stage = (affliction.system.badge.value ?? 1) - 2;
        if (stage < 1) await affliction.delete();
        else await affliction.update({ "system.badge.value": stage });
        await say(actor, `<strong>Digest</strong>: ${affliction.name} ${stage < 1 ? "is gone" : `drops to stage ${stage}`}.`);
    },

    /** Consume the Fallen: 2× level temporary Hit Points, and one bound Substrate one Depth higher until preparations. */
    async consumeTheFallen(actor) {
        const state = Engine.state(actor);
        const catalogue = await Engine.catalogue();
        const choice = await pick("Consume the Fallen", "One bound Substrate counts as one Depth higher until your next daily preparations.",
            Object.keys(state.substrates).map((s) => ({ value: s, label: catalogue[s]?.name ?? s })));
        if (!choice) return;
        state.choices.fallen = choice;
        await Engine.write(actor, state);
        await Engine.rebuild(actor);
        const temp = 2 * actor.level;
        if ((actor.attributes.hp.temp ?? 0) < temp) await actor.update({ "system.attributes.hp.temp": temp });
        await say(actor, `<strong>Consume the Fallen</strong>: ${temp} temporary Hit Points; ${catalogue[choice]?.name ?? choice} one Depth higher.`);
    },

    /** Assimilate: one resistance, sense or movement mode of a creature of your level or lower, until preparations. */
    async assimilate(actor) {
        const source = [...game.user.targets][0]?.actor;
        if (!source || source.id === actor.id) return ui.notifications.warn("Assimilate: target the remains.");
        if ((source.level ?? 0) > actor.level) return ui.notifications.warn(`Assimilate: ${source.name} is above your level.`);
        const options = [
            ...source.attributes.resistances.map((r) => ({ value: `resistance:${r.type}:${r.value}`, label: `Resistance ${r.type} ${r.value}` })),
            ...(source.system.perception?.senses ?? []).map((s) => ({ value: `sense:${s.type}:${s.acuity ?? "precise"}:${s.range ?? ""}`,
                label: `${s.label ?? s.type}${s.range ? ` ${s.range} ft` : ""}` })),
            ...Object.entries(source.system.movement?.speeds ?? {}).filter(([k, v]) => k !== "land" && (v?.value ?? 0) > 0)
                .map(([k, v]) => ({ value: `speed:${k}:${v.value}`, label: `${k} Speed ${v.value}` })),
        ];
        const choice = await pick("Assimilate", `Take one of ${source.name}'s resistances, senses or movement modes.`, options);
        if (!choice) return;
        const permanent = has(actor, "total-assimilation")
            ? (await pick("Total Assimilation", "Make it permanent? (It replaces the one you made permanent before.)",
                [{ value: "yes", label: "Permanent" }, { value: "no", label: "Until preparations" }])) === "yes"
            : false;
        const [kind, type, a, b] = choice.split(":");
        const rule = kind === "resistance" ? { key: "Resistance", type, value: Number(a) }
            : kind === "sense" ? { key: "Sense", selector: type, acuity: a, ...(b ? { range: Number(b) } : {}) }
                : { key: "BaseSpeed", selector: type, value: Number(a) };
        if (permanent) {
            const old = actor.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.[KEY]?.assimilated === "permanent");
            if (old.length) await actor.deleteEmbeddedDocuments("Item", old.map((e) => e.id));
        }
        await actor.createEmbeddedDocuments("Item", [customEffect(`Assimilated: ${choice.split(":").slice(0, 2).join(" ")}`,
            "icons/magic/life/cross-worn-green.webp", [rule], null, { assimilated: permanent ? "permanent" : "day" })]);
        await say(actor, `<strong>Assimilate</strong>: ${actor.name} takes ${source.name}'s ${choice.split(":").slice(0, 2).join(" ")}`
            + `${permanent ? ", permanently" : " until its next daily preparations"}.`);
    },

    /** Regurgitate: Shed one Substrate and immediately Feed one you are carrying, at Depth 1. */
    async regurgitate(actor) {
        const state = Engine.state(actor);
        const catalogue = await Engine.catalogue();
        const out = await pick("Regurgitate", "Shed which Substrate?",
            Object.keys(state.substrates).map((s) => ({ value: s, label: catalogue[s]?.name ?? s })));
        if (!out) return;
        const carried = [];
        for (const slug of Object.keys(catalogue)) {
            if (slug in state.substrates && slug !== out) continue;
            for (const s of await Engine.specimensFor(actor, slug)) carried.push({ value: `${slug}:${s.id}`, label: `${catalogue[slug].name} — ${s.name}` });
        }
        const inn = await pick("Regurgitate", "Feed which Substrate you are carrying, at Depth 1?", carried);
        if (!inn) return;
        const [slug, itemId] = inn.split(":");
        delete state.substrates[out];
        state.substrates[slug] = 1;
        const item = actor.items.get(itemId);
        if ((item?.quantity ?? 1) > 1) await item.update({ "system.quantity": item.quantity - 1 });
        else await item?.delete();
        await Engine.write(actor, state);
        await Engine.rebuild(actor);
        await say(actor, `<strong>Regurgitate</strong>: ${catalogue[out]?.name ?? out} out, ${catalogue[slug]?.name ?? slug} in at Depth 1.`);
    },

    /** Second Hunger: 2 Mass for 1 minute, spent at once to deepen a bound Substrate. */
    async secondHunger(actor) {
        const state = Engine.state(actor);
        const catalogue = await Engine.catalogue();
        const choice = await pick("Second Hunger", "Deepen which bound Substrate (2 Mass, 1 minute)?",
            Object.keys(state.substrates).map((s) => ({ value: s, label: catalogue[s]?.name ?? s })));
        if (!choice) return;
        // Not `substrate`: that key is what marks a Substrate's own effect, and the rebuild deletes a stray one.
        await AssimilatorDamage.mark(actor, "effect-second-hunger", { hungerFor: choice });
        await say(actor, `<strong>Second Hunger</strong>: ${catalogue[choice]?.name ?? choice} deepens for a minute.`);
    },

    /** Shared Symbiosis: a willing ally gains one of your Mutations at Depth 1 for 10 minutes. */
    async sharedSymbiosis(actor) {
        const ally = [...game.user.targets][0]?.actor;
        if (!ally || ally.id === actor.id) return ui.notifications.warn("Shared Symbiosis: target the ally you touch.");
        const catalogue = await Engine.catalogue();
        const choice = await pick("Shared Symbiosis", `Give ${ally.name} which Mutation, at Depth 1?`,
            Object.keys(Engine.state(actor).substrates).map((s) => ({ value: s, label: catalogue[s]?.name ?? s })));
        if (!choice) return;
        const source = foundry.utils.deepClone(catalogue[choice].doc.toObject());
        source.system.badge = { type: "counter", value: 1 };
        source.system.duration = { expiry: "turn-start", sustained: false, unit: "minutes", value: 10 };
        foundry.utils.setProperty(source, `flags.${MODULE_ID}.${KEY}.shared`, actor.uuid);
        await Relay.request({ action: "assimilatorFeat", kind: "effect", target: ally.uuid, origin: actor.uuid, effect: source });
    },

    /** The Thing That Wears You: the Carapace separates for 1 minute and fights beside you. */
    async theThing(actor) {
        await Relay.request({ action: "assimilatorFeat", kind: "thing", origin: actor.uuid });
    },

    async separate(origin) {
        const at = tokenOf(origin);
        const strike = origin.system.actions.find((s) => s.label === "Carapace Strike");
        const damage = strike?.item?.system?.damage;
        const [thing] = await Actor.create([{ name: `The Thing That Wears ${origin.name}`, type: "npc",
            img: "icons/creatures/abilities/mouth-teeth-long-red.webp",
            system: { details: { level: { value: origin.level } }, attributes: {
                hp: { value: origin.hitPoints.value, max: origin.hitPoints.max }, ac: { value: origin.armorClass.value } },
            saves: { fortitude: { value: origin.saves.fortitude.mod }, reflex: { value: origin.saves.reflex.mod },
                will: { value: origin.saves.will.mod } }, perception: { mod: origin.perception.mod } },
            flags: { [MODULE_ID]: { [KEY]: { thingOf: origin.uuid } } } }]);
        await thing.createEmbeddedDocuments("Item", [{ name: "Carapace Strike", type: "melee", system: {
            bonus: { value: strike?.totalModifier ?? 0 }, traits: { value: ["unarmed"] },
            damageRolls: { a: { damage: `${damage?.dice ?? 1}${damage?.die ?? "d8"}+${origin.abilities.str.mod}`, damageType: damage?.damageType ?? "bludgeoning" } } } }]);
        const [token] = await canvas.scene.createEmbeddedDocuments("Token", [(await thing.getTokenDocument({
            x: (at?.x ?? 0) + canvas.grid.size, y: at?.y ?? 0 })).toObject()]);
        const combat = encounterOf(origin);
        const mine = combat?.combatants.find((c) => c.actorId === origin.id);
        if (combat && mine) {
            const [c] = await combat.createEmbeddedDocuments("Combatant", [{ tokenId: token.id, sceneId: canvas.scene.id, actorId: thing.id }]);
            await combat.setInitiative(c.id, (mine.initiative ?? 0) - 5);
        }
        await AssimilatorDamage.mark(origin, "effect-worn-no-longer", { thing: { actor: thing.id, token: token.id } });
        await say(origin, `<strong>The Thing That Wears You</strong>: the Carapace separates. ${origin.name} is a person again.`);
    },

    async thingReturns(effect) {
        const thing = effect.flags?.[MODULE_ID]?.[KEY]?.thing;
        if (thing?.token && canvas.scene.tokens.get(thing.token)) await canvas.scene.deleteEmbeddedDocuments("Token", [thing.token]);
        if (thing?.actor) await game.actors.get(thing.actor)?.delete();
    },

    /** Eat the World: consume a magic item of your level or lower — one of its abilities, and 4 temporary Mass. */
    async eatTheWorld(actor) {
        const magic = actor.items.filter((i) => i.isOfType?.("physical") && i.isMagical && (i.level ?? 0) <= actor.level);
        const choice = await pick("Eat the World", "Consume which magic item?", magic.map((i) => ({ value: i.id, label: `${i.name} (level ${i.level})` })));
        if (!choice) return;
        const track = await pick("Eat the World", "4 temporary Mass in which track?", [{ value: "gem", label: "Gem" }, { value: "metal", label: "Metal" }]);
        if (!track) return;
        const item = actor.items.get(choice);
        const name = item.name;
        await item.delete();
        await actor.createEmbeddedDocuments("Item", [customEffect(`Eat the World: ${name}`, "icons/magic/unholy/orb-hands-pink.webp", [],
            null, { grants: { [track]: 4, temporary: true }, eaten: name })]);
        await say(actor, `<strong>Eat the World</strong>: the ${name} is gone. 4 ${track} Mass until the next daily preparations; `
            + "one of its abilities is the Assimilator's until then.");
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  Shed Skin, Living Fortress, Unbreakable Shell, the day                                  */
    /* ---------------------------------------------------------------------------------------- */

    async shedSkin(condition) {
        const actor = condition.actor;
        const value = condition.value;
        if (!actor || !has(actor, "shed-skin") || typeof value !== "number" || value > 2) return;
        await say(actor, `<strong>Shed Skin</strong>: ${actor.name} may end ${condition.name}; the Carapace takes ${5 * value}.</p>`
            + `<p><button type="button" data-action="isaacs-hb-feat" data-kind="shed">Shed it</button>`,
        { whisper: whisperTo(actor), flags: { [MODULE_ID]: { featCard: { kind: "shed", origin: actor.uuid, condition: condition.id } } } });
    },

    async moved(actor) {
        if (!actor || !has(actor, "living-fortress")) return;
        const toggles = actor.flags?.pf2e?.rollOptions?.all ?? {};
        const update = {};
        if (toggles[STILL]) update[`flags.pf2e.rollOptions.all.-=${STILL}`] = null;
        if (!toggles[MOVED]) update[`flags.pf2e.rollOptions.all.${MOVED}`] = true;
        if (Object.keys(update).length) await actor.update(update);
    },

    async endTurn(actor) {
        if (!actor || !has(actor, "living-fortress")) return;
        const moved = !!actor.flags?.pf2e?.rollOptions?.all?.[MOVED];
        await actor.update({
            [`flags.pf2e.rollOptions.all.-=${MOVED}`]: null,
            ...(moved ? {} : { [`flags.pf2e.rollOptions.all.${STILL}`]: true }),
        });
    },

    async newDay(actor) {
        const expiring = actor.itemTypes.effect.filter((e) => ["day"].includes(e.flags?.[MODULE_ID]?.[KEY]?.assimilated)
            || e.flags?.[MODULE_ID]?.[KEY]?.eaten);
        if (expiring.length) await actor.deleteEmbeddedDocuments("Item", expiring.map((e) => e.id));
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  Cards and the relay                                                                     */
    /* ---------------------------------------------------------------------------------------- */

    bindCard(message, html) {
        const card = message?.flags?.[MODULE_ID]?.featCard;
        if (!card || !html?.querySelectorAll || html.dataset?.isaacsHbFeatBound) return;
        html.dataset.isaacsHbFeatBound = "1";
        const origin = fromUuidSync(card.origin);
        for (const button of html.querySelectorAll(`[data-action="isaacs-hb-feat"]`)) {
            if (card.used || !origin?.isOwner) button.disabled = true;
            button.addEventListener("click", async () => {
                button.disabled = true;
                if (card.kind === "devouring") return Feats.devouringPlate(message, origin);
                return Relay.request({ action: "assimilatorFeat", kind: card.kind, messageId: message.id });
            });
        }
    },

    /** Devouring Plate: pick any Substrate — a temporary one at Depth 2 until the next preparations, costing no Mass. */
    async devouringPlate(message, actor) {
        const catalogue = await Engine.catalogue();
        const choice = await pick("Devouring Plate", "Gain which Substrate at Depth 2 until your next daily preparations?",
            Object.entries(catalogue).map(([s, e]) => ({ value: s, label: e.name })));
        if (!choice) return;
        await message.update({ [`flags.${MODULE_ID}.featCard.used`]: choice });
        const state = Engine.state(actor);
        state.temporary[choice] = 2;
        await Engine.write(actor, state);
        await Engine.rebuild(actor);
        await say(actor, `<strong>Devouring Plate</strong>: ${catalogue[choice].name} at Depth 2 until the next daily preparations.`);
    },

    async onRelay(payload) {
        if (payload.kind === "effect") {
            const target = await fromUuid(payload.target);
            const actor = target?.actor ?? target;
            if (actor) await actor.createEmbeddedDocuments("Item", [payload.effect]);
            const origin = await fromUuid(payload.origin);
            await say(origin, `<strong>${payload.effect.name.replace(/^Substrate:\s*/, "")}</strong> goes with ${actor?.name}.`);
            return;
        }
        if (payload.kind === "wall") return Feats.raiseWall(await fromUuid(payload.origin));
        if (payload.kind === "thing") return Feats.separate(await fromUuid(payload.origin));
        if (payload.kind === "shed") {
            const message = game.messages.get(payload.messageId);
            const card = message?.flags?.[MODULE_ID]?.featCard;
            if (!card || card.used) return;
            await message.update({ [`flags.${MODULE_ID}.featCard.used`]: true });
            const actor = await fromUuid(card.origin);
            const condition = actor?.items.get(card.condition);
            if (!condition) return;
            const value = condition.value ?? 0;
            await actor.decreaseCondition(condition.slug, { forceRemove: true });
            const plate = actor.itemTypes.armor.find((a) => a.slug === "living-plate");
            if (plate) await plate.update({ "system.hp.value": Math.max(0, plate.hitPoints.value - 5 * value) });
            await say(actor, `<strong>Shed Skin</strong>: ${condition.name} ends; the Carapace takes ${5 * value}.`);
        }
    },
};

export { depthOf };

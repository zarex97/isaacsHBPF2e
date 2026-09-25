import { MODULE_ID } from "../sky/signs.mjs";

/**
 * The Assimilator's engine: what the character has eaten, and everything that follows from it.
 *
 * **The actor flag is the record; items are its projection.** `flags["isaacs-hb-pf2e"].assimilator` holds
 * what was *paid* — each Substrate's Depth, the Bonds slotted, the Instinct fixed at the last daily
 * preparations, the Vein grants spent. Every Substrate, the Instinct and each Bond is an **effect** on the
 * actor whose presence, and whose counter badge, `rebuild()` derives from that record. Nothing else writes
 * them. That is the automation programme's single most important rule (§4.2): the Saint's worst bugs were
 * two writers disagreeing about derived state.
 *
 * **A Substrate is an effect with its Depth on the badge.** pf2e emits `self:effect:<slug>:<badge>` for a
 * counter badge, so a Depth ladder is plain predicates — `{ gte: ["self:effect:substrate-ruby", 3] }` —
 * and the build is visible in the effects panel, which is the guide's whole premise (§10.3). The badge is
 * the **effective** Depth, which is where Gold's "counts as one higher" and Apotheosis will act; the flag
 * keeps the paid one.
 *
 * **Mass, the Depth cap and Bond slots come from the features that grant them.** Each such feature carries
 * `flags["isaacs-hb-pf2e"].assimilator.grants = { gem, metal, depthCap, bondSlots }` and the engine sums
 * what the character owns — so a Mass feat later is one flag, not a code change, and the numbers can never
 * disagree with the sheet.
 */

const KEY = "assimilator";
const PACKS = {
    substrates: `${MODULE_ID}.assimilator-substrates`,
    bonds: `${MODULE_ID}.assimilator-bonds`,
    effects: `${MODULE_ID}.assimilator-effects`,
};
export const COLOURS = ["red", "gold", "orange", "blue", "purple", "green", "black", "white", "gray"];
export const SUBSTRATE_PREFIX = "substrate-";

/* -------------------------------------------------------------------------------------------- */
/*  Pure rules — no Foundry, so the tests can hold them                                         */
/* -------------------------------------------------------------------------------------------- */

/** Sum every `grants` block the character owns. The Depth cap is the highest granted, not a sum. */
export function grantsOf(blocks) {
    const out = { gem: 0, metal: 0, depthCap: 0, bondSlots: 0, sources: 0 };
    for (const g of blocks) {
        if (!g) continue;
        out.gem += g.gem ?? 0;
        out.metal += g.metal ?? 0;
        out.bondSlots += g.bondSlots ?? 0;
        out.depthCap = Math.max(out.depthCap, g.depthCap ?? 0);
        // "Every time your Mass increases, you gain one free Substrate" — one per feature that raises it.
        if ((g.gem ?? 0) > 0 || (g.metal ?? 0) > 0) out.sources += 1;
    }
    return out;
}

/** Mass spent in each track: a Substrate at Depth N costs N (guide §3.1). */
export function spentOf(paid, catalogue) {
    const spent = { gem: 0, metal: 0 };
    for (const [slug, depth] of Object.entries(paid)) {
        const kind = catalogue[slug]?.kind;
        if (kind) spent[kind] += depth;
    }
    return spent;
}

/**
 * The Depth at which a Substrate first adds damage to a Strike: the shallowest provenance-tagged damage rule
 * that fires on every hit. A critical-only rider is not "a Mutation dealing damage" on the hits that matter.
 */
export function damageFrom(rules = []) {
    const depths = rules
        .filter((r) => (r.key === "DamageDice" || r.key === "FlatModifier") && !r.critical
            && [r.selector].flat().some((s) => String(s).endsWith("damage")))
        .map((r) => r.flags?.[MODULE_ID]?.[KEY]?.depth)
        .filter(Number.isInteger);
    return depths.length ? Math.min(...depths) : null;
}

/**
 * Red's clause is "+1 damage per Depth **of its Substrate**" for each Mutation that deals damage. So the
 * bonus is the sum, over every Substrate whose Mutation is adding damage at its current Depth, of that Depth.
 */
export function mutationDepth(effective, catalogue) {
    let sum = 0;
    for (const [slug, depth] of Object.entries(effective)) {
        const from = catalogue[slug]?.damageFrom;
        if (from !== null && from !== undefined && depth >= from) sum += depth;
    }
    return sum;
}

/** Total Mass per colour, both tracks together — what the Instinct is read from (guide §4.5). */
export function colourTotals(paid, catalogue) {
    const totals = Object.fromEntries(COLOURS.map((c) => [c, 0]));
    for (const [slug, depth] of Object.entries(paid)) {
        const colour = catalogue[slug]?.colour;
        if (colour) totals[colour] += depth;
    }
    return totals;
}

/**
 * The Instinct: the colour with the most Mass. A tie is the player's to break (guide §4.5) — if their
 * choice is among the tied colours it wins, otherwise the tie stands unbroken and there is no Instinct
 * until they choose, rather than one picked for them by list order.
 */
export function instinctOf(totals, tiebreak = null) {
    const best = Math.max(0, ...Object.values(totals));
    if (best === 0) return { instinct: null, tied: [] };
    const tied = COLOURS.filter((c) => totals[c] === best);
    if (tied.length === 1) return { instinct: tied[0], tied };
    return { instinct: tied.includes(tiebreak) ? tiebreak : null, tied };
}

/**
 * May this Substrate be fed now? Returns `{ ok, reason, depth }`.
 *
 * Depth rises by one; the cost is the Mass of the **new** Depth in total, so the step itself costs one more
 * in its track. The cap is the level's; a specimen for Depth 3–4 must be quickened (guide §4.4).
 */
export function feedCheck({ slug, paid, catalogue, grants, specimen }) {
    const entry = catalogue[slug];
    if (!entry) return { ok: false, reason: `There is no Substrate called "${slug}".` };
    const depth = (paid[slug] ?? 0) + 1;
    if (depth > grants.depthCap) {
        return { ok: false, reason: `${entry.name} would reach Depth ${depth}; your Depth cap is ${grants.depthCap}.` };
    }
    const spent = spentOf(paid, catalogue)[entry.kind];
    const pool = grants[entry.kind];
    if (spent + 1 > pool) {
        return { ok: false, reason: `Not enough ${entry.kind} Mass: ${spent} of ${pool} spent, and Depth ${depth} costs one more.` };
    }
    if (depth >= 3 && specimen !== "quickened") {
        return { ok: false, reason: `Depth ${depth} takes a quickened specimen — one that grew somewhere the mundane world doesn't reach.` };
    }
    if (!specimen) return { ok: false, reason: `Feeding ${entry.name} takes a specimen of it, or a grant from the Vein.` };
    return { ok: true, depth };
}

/* -------------------------------------------------------------------------------------------- */
/*  The engine                                                                                  */
/* -------------------------------------------------------------------------------------------- */

let catalogueCache = null;

/** One writer per actor at a time: rebuilds queue behind each other rather than interleaving. */
const queues = new WeakMap();

function isWriter() {
    return game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM;
}

export const Engine = {
    isAssimilator(actor) {
        return actor?.class?.slug === "assimilator";
    },

    state(actor) {
        const s = foundry.utils.deepClone(actor?.flags?.[MODULE_ID]?.[KEY] ?? {});
        s.substrates ??= {};
        s.bonds ??= [];
        s.veinUsed ??= 0;
        s.instinct ??= null;
        s.tiebreak ??= null;
        s.preparing ??= false;
        return s;
    },

    /** The Substrates the packs define, keyed by slug: `{ name, colour, kind, uuid }`. */
    async catalogue() {
        if (catalogueCache) return catalogueCache;
        const docs = (await game.packs.get(PACKS.substrates)?.getDocuments()) ?? [];
        catalogueCache = {};
        for (const doc of docs) {
            const s = doc.flags?.[MODULE_ID]?.[KEY]?.substrate;
            if (s?.slug) {
                catalogueCache[s.slug] = { ...s, name: doc.name, uuid: doc.uuid, doc, damageFrom: damageFrom(doc.system.rules) };
            }
        }
        return catalogueCache;
    },

    async bondCatalogue() {
        const docs = (await game.packs.get(PACKS.bonds)?.getDocuments()) ?? [];
        const out = {};
        for (const doc of docs) {
            const b = doc.flags?.[MODULE_ID]?.[KEY]?.bond;
            if (b?.substrates) out[doc.system.slug ?? doc.slug] = { ...b, name: doc.name, uuid: doc.uuid, doc };
        }
        return out;
    },

    grants(actor) {
        return grantsOf(actor.items.contents.map((i) => i.flags?.[MODULE_ID]?.[KEY]?.grants));
    },

    /** Everything the Gullet shows and the rules read, computed from the record and the owned features. */
    async derive(actor, state = Engine.state(actor)) {
        const catalogue = await Engine.catalogue();
        const grants = Engine.grants(actor);
        const effective = Engine.effectiveDepths(actor, state, grants);
        const totals = colourTotals(state.substrates, catalogue);
        return {
            mass: { gem: grants.gem, metal: grants.metal },
            spent: spentOf(state.substrates, catalogue),
            depthCap: grants.depthCap,
            bondSlots: grants.bondSlots,
            vein: Math.max(0, grants.sources - state.veinUsed),
            colours: totals,
            effective,
            highestDepth: Math.max(0, ...Object.values(effective)),
            // A broken Carapace switches every Mutation at Depth 3+ off, so it deals no damage to count.
            mutationDepth: mutationDepth(Engine.workingDepths(actor, effective), catalogue),
            pending: instinctOf(totals, state.tiebreak),
        };
    },

    /**
     * The Depth each Substrate actually manifests at: what was paid, held to the cap. Apotheosis lifts every
     * bound Substrate to the cap while its effect lasts (guide §4.9).
     */
    effectiveDepths(actor, state, grants) {
        const apotheosis = actor.itemTypes?.effect?.some((e) => e.slug === "effect-apotheosis");
        const out = {};
        for (const [slug, paid] of Object.entries(state.substrates)) {
            if (paid <= 0) continue;
            out[slug] = apotheosis ? grants.depthCap : Math.min(paid, grants.depthCap);
        }
        return out;
    },

    /** The Mutations actually working: all of them, less every one at Depth 3+ while the plate is broken. */
    workingDepths(actor, effective) {
        const broken = actor.itemTypes?.effect?.some((e) => e.slug === "effect-carapace-broken");
        if (!broken) return effective;
        return Object.fromEntries(Object.entries(effective).filter(([, depth]) => depth < 3));
    },

    async write(actor, state) {
        await actor.update({ [`flags.${MODULE_ID}.${KEY}`]: state }, { assimilatorEngine: true });
    },

    /** Queue a rebuild. Safe to call from any hook; only the writer client does anything. */
    rebuild(actor) {
        if (!actor || !isWriter() || !Engine.isAssimilator(actor)) return Promise.resolve();
        const previous = queues.get(actor) ?? Promise.resolve();
        const next = previous.then(() => Engine._rebuild(actor)).catch((error) =>
            console.error(`Isaac's Homebrew | the Assimilator could not rebuild ${actor.name}`, error));
        queues.set(actor, next);
        return next;
    },

    async _rebuild(actor) {
        const state = Engine.state(actor);
        const catalogue = await Engine.catalogue();
        const derived = await Engine.derive(actor, state);

        // The first time anything is bound, the Instinct is read at once rather than waiting a night;
        // after that it moves only at daily preparations.
        if (state.instinct === null && derived.pending.instinct) state.instinct = derived.pending.instinct;
        if (state.preparing) state.instinct = derived.pending.instinct;

        const creates = [];
        const updates = [];
        const deletes = [];

        // Substrates.
        const owned = actor.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.[KEY]?.substrate);
        for (const [slug, depth] of Object.entries(derived.effective)) {
            const have = owned.find((e) => e.flags[MODULE_ID][KEY].substrate.slug === slug);
            if (!have) {
                const source = foundry.utils.deepClone(catalogue[slug].doc.toObject());
                source.system.badge = { ...(source.system.badge ?? {}), type: "counter", value: depth };
                creates.push(source);
            } else if (have.system.badge?.value !== depth) {
                updates.push({ _id: have.id, "system.badge.value": depth });
            }
        }
        for (const e of owned) if (!(e.flags[MODULE_ID][KEY].substrate.slug in derived.effective)) deletes.push(e.id);

        // The Instinct: exactly one effect, the recorded colour's.
        const instincts = actor.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.[KEY]?.instinct);
        const wanted = state.instinct;
        for (const e of instincts) if (e.flags[MODULE_ID][KEY].instinct !== wanted) deletes.push(e.id);
        if (wanted && !instincts.some((e) => e.flags[MODULE_ID][KEY].instinct === wanted)) {
            const doc = (await game.packs.get(PACKS.effects)?.getDocuments())
                ?.find((d) => d.flags?.[MODULE_ID]?.[KEY]?.instinct === wanted);
            if (doc) creates.push(doc.toObject());
        }

        // Bonds: the slotted ones, as many as there are slots. Suppression below Depth 2 is each Bond's own
        // predicate, so a Bond whose Substrate is shed stays slotted and simply stops (guide §7).
        const slotted = state.bonds.slice(0, derived.bondSlots);
        const bondEffects = actor.itemTypes.effect.filter((e) => e.flags?.[MODULE_ID]?.[KEY]?.bond);
        const bondCatalogue = slotted.length || bondEffects.length ? await Engine.bondCatalogue() : {};
        for (const e of bondEffects) if (!slotted.includes(e.slug)) deletes.push(e.id);
        for (const slug of slotted) {
            if (!bondEffects.some((e) => e.slug === slug) && bondCatalogue[slug]) creates.push(bondCatalogue[slug].doc.toObject());
        }

        if (deletes.length) await actor.deleteEmbeddedDocuments("Item", [...new Set(deletes)]);
        if (updates.length) await actor.updateEmbeddedDocuments("Item", updates);
        if (creates.length) await actor.createEmbeddedDocuments("Item", creates);

        const derivedFlag = {
            mass: derived.mass, spent: derived.spent, depthCap: derived.depthCap, bondSlots: derived.bondSlots,
            vein: derived.vein, highestDepth: derived.highestDepth, mutationDepth: derived.mutationDepth,
            colours: derived.colours, effective: derived.effective,
        };
        const before = actor.flags?.[MODULE_ID]?.[KEY] ?? {};
        if (JSON.stringify(before.derived) !== JSON.stringify(derivedFlag) || before.instinct !== state.instinct) {
            await Engine.write(actor, { ...state, derived: derivedFlag });
        }
    },

    /* ---------------------------------------------------------------------------------------- */
    /*  What a player does                                                                      */
    /* ---------------------------------------------------------------------------------------- */

    /**
     * Specimens the character is carrying, for one Substrate.
     *
     * An **ordinary** specimen is anything whose name is the Substrate's own, or its period name — the
     * looted ruby, the copper ingot (lexicon §15.3–15.4). A **quickened** one is marked by the GM with
     * `flags["isaacs-hb-pf2e"].assimilator.specimen = { substrate, quickened: true }`, because what grew at a
     * planar breach is the GM's to say.
     */
    async specimensFor(actor, slug) {
        const entry = (await Engine.catalogue())[slug];
        if (!entry) return [];
        const names = [entry.specimenNames ?? [], entry.name.replace(/^Substrate:\s*/, "")].flat()
            .map((n) => n.toLowerCase());
        return actor.items.filter((item) => {
            if (!item.isOfType?.("physical")) return false;
            const marked = item.flags?.[MODULE_ID]?.[KEY]?.specimen;
            if (marked) return marked.substrate === slug;
            return names.some((n) => new RegExp(`\\b${n}\\b`, "i").test(item.name));
        }).map((item) => ({
            id: item.id, name: item.name, quantity: item.quantity ?? 1,
            quickened: !!item.flags?.[MODULE_ID]?.[KEY]?.specimen?.quickened,
        }));
    },

    /**
     * Feed ◆◆◆◆ (10 minutes): consume a specimen, or spend a grant from the Vein, and raise a Substrate's
     * Depth by one. Refused in an encounter — ten minutes do not fit in one.
     */
    async feed(actor, slug, { itemId = null, vein = false } = {}) {
        const state = Engine.state(actor);
        const catalogue = await Engine.catalogue();
        if (game.combat?.started && game.combat.combatants.some((c) => c.actor?.id === actor.id)) {
            return Engine._refuse("Feeding takes 10 minutes; it cannot be done in an encounter.");
        }

        let specimen = null;
        let item = null;
        if (itemId) {
            item = actor.items.get(itemId);
            const found = (await Engine.specimensFor(actor, slug)).find((s) => s.id === itemId);
            if (!found) return Engine._refuse(`${item?.name ?? "That"} is not a specimen of ${catalogue[slug]?.name ?? slug}.`);
            specimen = found.quickened ? "quickened" : "ordinary";
        } else if (vein) {
            const derived = await Engine.derive(actor, state);
            if (derived.vein <= 0) return Engine._refuse("The Vein has nothing left to give until your Mass next grows.");
            specimen = "ordinary";
        }

        const check = feedCheck({ slug, paid: state.substrates, catalogue, grants: Engine.grants(actor), specimen });
        if (!check.ok) return Engine._refuse(check.reason);

        if (item) {
            if ((item.quantity ?? 1) > 1) await item.update({ "system.quantity": item.quantity - 1 });
            else await item.delete();
        }
        if (vein && !item) state.veinUsed += 1;
        state.substrates[slug] = check.depth;
        await Engine.write(actor, state);
        await Engine.rebuild(actor);
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            flags: { [MODULE_ID]: { assimilatorFeed: { slug, depth: check.depth } } },
            content: `<p><strong>Feed</strong>: ${actor.name} consumes ${item ? item.name : "a grant from the Vein"}. `
                + `<strong>${catalogue[slug].name}</strong> is now at <strong>Depth ${check.depth}</strong>.</p>`,
        });
        return { ok: true, depth: check.depth };
    },

    /** Shed — during daily preparations only. Lower a Substrate's Depth (to 0 removes it); it is destroyed. */
    async shed(actor, slug, toDepth = 0) {
        const state = Engine.state(actor);
        if (!state.preparing) return Engine._refuse("You may shed only during your daily preparations.");
        const current = state.substrates[slug] ?? 0;
        if (toDepth >= current || toDepth < 0) return Engine._refuse("Shedding lowers a Depth; it cannot raise one.");
        if (toDepth === 0) delete state.substrates[slug];
        else state.substrates[slug] = toDepth;
        await Engine.write(actor, state);
        await Engine.rebuild(actor);
        return { ok: true };
    },

    /** Break an Instinct tie — freely, but only at daily preparations (guide §4.5). */
    async breakTie(actor, colour) {
        const state = Engine.state(actor);
        if (!state.preparing && state.instinct !== null) {
            return Engine._refuse("Ties are broken at daily preparations.");
        }
        state.tiebreak = colour;
        await Engine.write(actor, state);
        await Engine.rebuild(actor);
        return { ok: true };
    },

    /**
     * Slot a Bond. A new slot is filled when gained; a filled one changes only at daily preparations, and
     * only to a Bond whose requirements are met (guide §7).
     */
    async setBond(actor, index, slug) {
        const state = Engine.state(actor);
        const derived = await Engine.derive(actor, state);
        if (index >= derived.bondSlots) return Engine._refuse("You have no Bond slot there yet.");
        const replacing = !!state.bonds[index];
        if (replacing && !state.preparing) return Engine._refuse("A Bond changes only at daily preparations.");
        if (slug) {
            const bond = (await Engine.bondCatalogue())[slug];
            if (!bond) return Engine._refuse(`There is no Bond called "${slug}".`);
            const unmet = bond.substrates.filter((s) => (derived.effective[s] ?? 0) < 2);
            if (unmet.length) return Engine._refuse(`${bond.name} needs ${unmet.join(" and ")} at Depth 2 or higher.`);
            if (state.bonds.includes(slug)) return Engine._refuse(`${bond.name} is already slotted.`);
        }
        state.bonds[index] = slug ?? null;
        state.bonds = state.bonds.filter(Boolean);
        await Engine.write(actor, state);
        await Engine.rebuild(actor);
        return { ok: true };
    },

    /** Daily preparations open with Rest for the Night and close when the owner says so, or combat starts. */
    async beginPreparations(actor) {
        const state = Engine.state(actor);
        if (state.preparing) return;
        state.preparing = true;
        await Engine.write(actor, state);
        await Engine.rebuild(actor);
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            whisper: game.users.filter((u) => actor.testUserPermission(u, "OWNER")).map((u) => u.id),
            content: `<p><strong>Daily preparations.</strong> ${actor.name} may Shed, break an Instinct tie and change `
                + `Bonds in the Gullet until they finish preparing.</p>`,
        });
    },

    async endPreparations(actor) {
        const state = Engine.state(actor);
        if (!state.preparing) return;
        await Engine.rebuild(actor);
        const settled = Engine.state(actor);
        settled.preparing = false;
        await Engine.write(actor, settled);
    },

    _refuse(reason) {
        ui.notifications?.warn(reason);
        return { ok: false, reason };
    },

    registerHooks() {
        Hooks.on("pf2e.restForTheNight", (actor) => {
            if (Engine.isAssimilator(actor) && isWriter()) Engine.beginPreparations(actor);
        });
        Hooks.on("combatStart", (combat) => {
            if (!isWriter()) return;
            for (const c of combat.combatants) if (Engine.state(c.actor).preparing) Engine.endPreparations(c.actor);
        });
        // The record changed, a level changed, or a feature that grants Mass came or went.
        Hooks.on("updateActor", (actor, change, options) => {
            if (options?.assimilatorEngine) return;
            if (change?.system?.details?.level || change?.flags?.[MODULE_ID]?.[KEY]) Engine.rebuild(actor);
        });
        const itemChanged = (item) => {
            const flag = item.flags?.[MODULE_ID]?.[KEY];
            const moves = ["effect-apotheosis", "effect-carapace-broken"].includes(item.slug);
            if (flag?.grants || moves || item.type === "class") Engine.rebuild(item.actor);
        };
        Hooks.on("createItem", itemChanged);
        Hooks.on("deleteItem", itemChanged);
    },
};

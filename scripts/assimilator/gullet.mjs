import { MODULE_ID } from "../sky/signs.mjs";
import { COLOURS, Engine } from "./engine.mjs";

const { ApplicationV2, HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * The Gullet: what an Assimilator has eaten, and the one place to eat or shed more.
 *
 * Every button here calls `Engine`, which is also on `module.api.assimilator`, so a Foundry update that breaks
 * this window leaves the class playable from a macro (programme §8). The window never writes an item itself;
 * `Engine.rebuild()` does, and only to items it made.
 */
export class GulletApp extends HandlebarsApplicationMixin(ApplicationV2) {
    static DEFAULT_OPTIONS = {
        classes: ["isaacs-hb-pf2e", "gullet"],
        position: { width: 520, height: "auto" },
        window: { title: "The Gullet", icon: "fa-solid fa-dna", resizable: true },
        actions: {
            feed: GulletApp.#onFeed,
            shed: GulletApp.#onShed,
            setBond: GulletApp.#onSetBond,
            breakTie: GulletApp.#onBreakTie,
            beginPrep: GulletApp.#onBeginPrep,
            endPrep: GulletApp.#onEndPrep,
            rebuild: GulletApp.#onRebuild,
        },
    };

    static PARTS = { main: { template: `modules/${MODULE_ID}/templates/gullet.hbs` } };

    /** One window per actor. */
    static open(actor) {
        if (!actor) return null;
        const id = `isaacs-hb-gullet-${actor.id}`;
        const existing = foundry.applications.instances.get(id);
        if (existing) return existing.render({ force: true });
        return new GulletApp({ id, actor }).render({ force: true });
    }

    constructor(options) {
        super(options);
        this.actor = options.actor;
        this.onChange = (doc) => {
            if (doc === this.actor || doc?.parent === this.actor) this.render();
        };
        for (const hook of ["updateActor", "createItem", "deleteItem", "updateItem"]) Hooks.on(hook, this.onChange);
    }

    async close(options) {
        for (const hook of ["updateActor", "createItem", "deleteItem", "updateItem"]) Hooks.off(hook, this.onChange);
        return super.close(options);
    }

    get title() {
        return `The Gullet — ${this.actor.name}`;
    }

    async _prepareContext() {
        const actor = this.actor;
        const state = Engine.state(actor);
        const catalogue = await Engine.catalogue();
        const bonds = await Engine.bondCatalogue();
        const derived = await Engine.derive(actor, state);
        const owner = actor.isOwner;

        const bound = Object.entries(state.substrates).map(([slug, paid]) => ({
            slug, paid, name: catalogue[slug]?.name ?? slug, colour: catalogue[slug]?.colour, kind: catalogue[slug]?.kind,
            effective: derived.effective[slug] ?? 0, lower: Array.from({ length: paid }, (_, i) => i),
        })).sort((a, b) => COLOURS.indexOf(a.colour) - COLOURS.indexOf(b.colour));

        const feedable = await Promise.all(Object.entries(catalogue).map(async ([slug, entry]) => ({
            slug, name: entry.name, colour: entry.colour, kind: entry.kind, paid: state.substrates[slug] ?? 0,
            specimens: await Engine.specimensFor(actor, slug),
        })));

        const slots = Array.from({ length: derived.bondSlots }, (_, index) => {
            const current = state.bonds[index] ?? null;
            return {
                index, current, currentName: current ? bonds[current]?.name ?? current : null,
                locked: !!current && !state.preparing,
                choices: Object.entries(bonds).map(([slug, b]) => ({
                    slug, name: b.name, pair: b.substrates.join(" + "),
                    met: b.substrates.every((s) => (derived.effective[s] ?? 0) >= 2),
                    selected: slug === current,
                })),
            };
        });

        return {
            owner, isGM: game.user.isGM, preparing: state.preparing,
            mass: derived.mass, spent: derived.spent, depthCap: derived.depthCap, vein: derived.vein,
            instinct: state.instinct, pending: derived.pending, colours: derived.colours,
            tied: derived.pending.tied.length > 1 ? derived.pending.tied : [],
            bound, feedable, slots,
        };
    }

    static async #onFeed(_event, target) {
        const form = target.closest("[data-feed]");
        const slug = form.querySelector("[name=substrate]").value;
        const source = form.querySelector("[name=source]").value;
        await Engine.feed(this.actor, slug, source === "vein" ? { vein: true } : { itemId: source });
    }

    static async #onShed(_event, target) {
        await Engine.shed(this.actor, target.dataset.slug, Number(target.dataset.to));
    }

    static async #onSetBond(_event, target) {
        const select = target.closest("[data-slot]").querySelector("select");
        await Engine.setBond(this.actor, Number(target.dataset.index), select.value || null);
    }

    static async #onBreakTie(_event, target) {
        await Engine.breakTie(this.actor, target.dataset.colour);
    }

    static async #onBeginPrep() {
        await Engine.beginPreparations(this.actor);
    }

    static async #onEndPrep() {
        await Engine.endPreparations(this.actor);
    }

    static async #onRebuild() {
        await Engine.rebuild(this.actor);
    }

    /** Refresh the specimen list when the Substrate changes. */
    _onRender(context, options) {
        super._onRender?.(context, options);
        const form = this.element.querySelector("[data-feed]");
        if (!form) return;
        const substrate = form.querySelector("[name=substrate]");
        const source = form.querySelector("[name=source]");
        const fill = () => {
            const entry = context.feedable.find((f) => f.slug === substrate.value);
            source.innerHTML = "";
            for (const s of entry?.specimens ?? []) {
                source.append(new Option(`${s.name}${s.quantity > 1 ? ` ×${s.quantity}` : ""}${s.quickened ? " (quickened)" : ""}`, s.id));
            }
            if (context.vein > 0) source.append(new Option(`A grant from the Vein (${context.vein} left)`, "vein"));
        };
        substrate.addEventListener("change", fill);
        fill();
    }
}

/** Using Feed or Shed opens the Gullet for whoever used it. */
export function registerGulletHooks() {
    Hooks.on("createChatMessage", (message, _options, userId) => {
        if (userId !== game.user.id) return;
        const item = message.item;
        if (!item?.flags?.[MODULE_ID]?.assimilator?.opensGullet || !message.actor?.isOwner) return;
        GulletApp.open(message.actor);
    });
}

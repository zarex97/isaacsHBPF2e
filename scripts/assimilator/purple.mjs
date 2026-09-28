import { MODULE_ID } from "../sky/signs.mjs";
import { depthOf } from "./damage.mjs";
import { classSlugOf, classStatisticOf } from "../lib/class-dc.mjs";

/**
 * Quartz's scripted clauses (#89) — the ones that answer something happening rather than sit on a roll.
 *
 * - **Depth 1** — *"you know when a spell is cast within 30 feet"*: a spell's card posting from a caster within 30
 *   feet of a Quartz Assimilator whispers its owners.
 * - **Depth 3** — *"when you counteract an effect, or a spell fails against you, your next Strike deals +2d6
 *   force"*: a module counteract that succeeds, a save against a spell that succeeds, or a spell attack against the
 *   Assimilator that misses gives *Quartz Charge*, spent by the next Strike's damage.
 * - **Depth 4** — *Prism Reflection*: once a day, the caster rolls Will against the Assimilator's class DC; the card
 *   says reflected or negated. Carrying the spell to the caster stays the table's.
 */

const CHARGE = "effect-quartz-charge";
const EFFECTS = "isaacs-hb-pf2e.assimilator-effects";
const WON = new Set(["success", "criticalSuccess"]);
const MISSED = new Set(["failure", "criticalFailure"]);

function isWriter() {
    return game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM;
}

function isAssimilator(actor) {
    return classSlugOf(actor) === "assimilator";
}

function owners(actor) {
    return game.users.filter((u) => actor.testUserPermission(u, "OWNER")).map((u) => u.id);
}

function fromSpell(options) {
    return options.some((o) => o === "item:type:spell" || o === "origin:item:type:spell");
}

export const Purple = {
    registerHooks() {
        Hooks.on("createChatMessage", (message) => {
            if (!isWriter()) return;
            Purple.sensed(message).catch((e) => console.error("Isaac's Homebrew | Quartz", e));
            Purple.failedAgainst(message).catch((e) => console.error("Isaac's Homebrew | Quartz", e));
        });
        Hooks.on("isaacsHb.counteracted", (actor, { counteracted }) => {
            if (isWriter() && counteracted) Purple.charge(actor).catch((e) => console.error("Isaac's Homebrew | Quartz", e));
        });
        // Platinum Depth 4: a slowed landing asks the GM whether it was magical.
        Hooks.on("createItem", (item) => {
            if (isWriter() && item.type === "condition" && item.slug === "slowed") Purple.askSlowed(item).catch((e) => console.error("Isaac's Homebrew | Platinum", e));
        });
        Hooks.on("renderChatMessageHTML", (message, html) => Purple.bindSlowed(message, html));
        Hooks.on("createChatMessage", (message, _o, userId) => {
            if (userId !== game.user.id || message.item?.slug !== "prism-reflection" || message.flags?.pf2e?.context) return;
            Purple.reflect(message.actor).catch((e) => console.error("Isaac's Homebrew | Prism Reflection", e));
        });
    },

    /**
     * Platinum Depth 4 — *"You cannot be slowed by magical effects"* (#89). pf2e's own *Slow* applies a plain slowed
     * condition from a link on its card, carrying no word of the spell, so whether this one is magical is the GM's
     * knowledge. The GM is whispered a card; one click removes it.
     */
    async askSlowed(condition) {
        const actor = condition.actor;
        if (!isAssimilator(actor) || depthOf(actor, "platinum") < 4) return null;
        const gms = game.users.filter((u) => u.isGM).map((u) => u.id);
        return ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), whisper: gms,
            flags: { [MODULE_ID]: { platinumSlowed: { actor: actor.uuid, condition: condition.id } } },
            content: `<p><strong>Platinum</strong>: ${actor.name} cannot be slowed by magical effects. Was this slowed magical?</p>`
                + `<button type="button" data-action="isaacs-hb-platinum">Magical — remove it</button>` });
    },

    bindSlowed(message, html) {
        const card = message?.flags?.[MODULE_ID]?.platinumSlowed;
        if (!card || !html?.querySelector || html.dataset?.isaacsHbPlatinumBound) return;
        html.dataset.isaacsHbPlatinumBound = "1";
        const button = html.querySelector(`[data-action="isaacs-hb-platinum"]`);
        if (!button) return;
        if (card.done || !game.user.isGM) button.disabled = true;
        button.addEventListener("click", async () => {
            button.disabled = true;
            const actor = await fromUuid(card.actor);
            const condition = actor?.items?.get(card.condition);
            if (condition) await condition.delete();
            await message.update({ [`flags.${MODULE_ID}.platinumSlowed.done`]: true });
            await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }),
                content: `<p><strong>Platinum</strong>: the magic finds nothing to slow — ${actor?.name} is not slowed.</p>` });
        });
    },

    /** Quartz Depth 1: a spell cast within 30 feet. */
    async sensed(message) {
        if (!message.item?.isOfType?.("spell") || message.flags?.pf2e?.context) return 0;
        const caster = message.actor;
        const from = message.token?.object ?? caster?.getActiveTokens?.(true, false)?.[0];
        if (!from) return 0;
        let told = 0;
        for (const token of canvas.tokens.placeables) {
            const actor = token.actor;
            if (!isAssimilator(actor) || actor.id === caster?.id || depthOf(actor, "quartz") < 1) continue;
            if (canvas.grid.measurePath([from.center, token.center]).distance > 30) continue;
            await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }), whisper: owners(actor),
                flags: { [MODULE_ID]: { quartzSensed: { caster: caster?.uuid ?? null, spell: message.item.uuid } } },
                content: `<p><strong>Quartz</strong>: ${actor.name} senses a spell cast — <strong>${message.item.name}</strong>, by ${caster?.name ?? "someone"}.</p>` });
            told++;
        }
        return told;
    },

    /** Quartz Depth 3: a save against a spell succeeds, or a spell attack against the Assimilator misses. */
    async failedAgainst(message) {
        const context = message.flags?.pf2e?.context;
        const options = context?.options ?? [];
        if (context?.type === "saving-throw" && WON.has(context.outcome) && fromSpell(options)) {
            return Purple.charge(message.actor);
        }
        if (context?.type === "attack-roll" && MISSED.has(context.outcome)
            && (fromSpell(options) || (context.domains ?? []).includes("spell-attack-roll"))) {
            const target = context.target?.actor ? fromUuidSync(context.target.actor) : null;
            return Purple.charge(target);
        }
        return null;
    },

    async charge(actor) {
        if (!isAssimilator(actor) || depthOf(actor, "quartz") < 3) return null;
        if (actor.itemTypes.effect.some((e) => e.slug === CHARGE)) return null;
        const doc = ((await game.packs.get(EFFECTS)?.getDocuments()) ?? []).find((d) => d.slug === CHARGE);
        if (!doc) return null;
        const [made] = await actor.createEmbeddedDocuments("Item", [doc.toObject()]);
        return made ?? null;
    },

    /** Quartz Depth 4, *Prism Reflection*: the caster's Will against the class DC, once a day. */
    async reflect(actor) {
        const caster = [...game.user.targets][0]?.actor ?? null;
        if (!actor || !caster || caster.id === actor.id) {
            ui.notifications.warn("Prism Reflection: target the caster first.");
            return null;
        }
        const day = actor.flags?.[MODULE_ID]?.assimilator?.day ?? 0;
        if (actor.flags?.[MODULE_ID]?.assimilator?.used?.prismReflection === day) {
            ui.notifications.warn("Prism Reflection: already used today.");
            return null;
        }
        await actor.update({ [`flags.${MODULE_ID}.assimilator.used.prismReflection`]: day });
        const dc = classStatisticOf(actor)?.dc?.value ?? actor.classDC?.dc?.value;
        const roll = await caster.saves.will.roll({ dc: { value: dc }, origin: actor, skipDialog: true });
        const outcome = roll?.degreeOfSuccess >= 2 ? "negated" : "reflected";
        await ChatMessage.create({ speaker: ChatMessage.getSpeaker({ actor }),
            flags: { [MODULE_ID]: { prismReflection: { caster: caster.uuid, outcome } } },
            content: `<p><strong>Prism Reflection</strong>: ${outcome === "reflected"
                ? `the spell is <strong>reflected</strong> back at ${caster.name}.`
                : `${caster.name}'s Will holds — the reflection is <strong>negated</strong>.`}</p>` });
        return outcome;
    },
};

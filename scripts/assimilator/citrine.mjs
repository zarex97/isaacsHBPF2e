import { Relay } from "../riders/relay.mjs";
import { MODULE_ID } from "../sky/signs.mjs";
import { depthOf } from "./damage.mjs";

/**
 * Citrine — *Gilded Chance* (lexicon §6), its two clauses that were text (#86).
 *
 * **Depth 1-2** — *"reroll one failed check and take the second result … The reroll gains a +2 circumstance
 * bonus."* Using the action rerolls the Assimilator's most recent failed check through pf2e's own reroll, keeping the
 * new result. pf2e announces the reroll with `pf2e.preReroll` before the new roll is evaluated, and it reads the
 * degree of success off that roll's total afterwards, so a `+2` term added there is counted.
 *
 * **Depth 3** — *"once per encounter, when an enemy within 30 feet critically succeeds at a save against you, it gets
 * a success instead."* The saving throw's card is rewritten before it posts, as *The Balance* rewrites a natural 1:
 * the outcome, the roll's recorded degree and the card's result line. The encounter's use is recorded on the
 * Assimilator by the GM, through the relay, since the save is usually a GM's roll against a player's creature.
 */

const SPENT = "assimilatorCitrineSave";
const FAILED = new Set(["failure", "criticalFailure"]);

/** The reroll in flight: pf2e's hook carries no message, so the reroll we asked for is remembered for its duration. */
let pending = null;

function encounterOf(actor) {
    return game.combats?.find((c) => c.started && c.combatants.some((x) => x.actor?.id === actor?.id)) ?? null;
}

function tokenOf(actor) {
    return actor?.getActiveTokens?.(true, false)?.[0] ?? null;
}

export const Citrine = {
    registerHooks() {
        Hooks.on("createChatMessage", (message, _o, userId) => {
            if (userId !== game.user.id || message.item?.slug !== "gilded-chance" || message.flags?.pf2e?.context) return;
            Citrine.gildedChance(message.actor).catch((e) => console.error("Isaac's Homebrew | Gilded Chance", e));
        });
        Hooks.on("pf2e.preReroll", (_old, roll) => Citrine.gild(roll));
        Hooks.on("preCreateChatMessage", (message) => {
            try {
                Citrine.fortune(message);
            } catch (error) {
                console.error("Isaac's Homebrew | Citrine could not rewrite a save", error);
            }
            return true;
        });
        Relay.register?.(SPENT, (payload) => Citrine.spend(payload));
    },

    /** The Assimilator's most recent failed check, not yet rerolled. */
    lastFailed(actor) {
        return game.messages.contents.slice(-30).reverse().find((m) => m.actor?.id === actor?.id && m.isRoll
            && FAILED.has(m.flags?.pf2e?.context?.outcome) && !m.flags?.pf2e?.context?.isReroll
            && !(m.flags?.pf2e?.context?.options ?? []).includes("check:reroll")) ?? null;
    },

    async gildedChance(actor) {
        const failed = Citrine.lastFailed(actor);
        if (!failed) {
            ui.notifications.warn("Gilded Chance: there is no failed check of yours to reroll.");
            return null;
        }
        pending = { bonus: depthOf(actor, "citrine") >= 2 ? 2 : 0 };
        try {
            await game.pf2e.Check.rerollFromMessage(failed, { keep: "new" });
        } finally {
            pending = null;
        }
        return failed.id;
    },

    /** Citrine Depth 2: the reroll's +2, as a term pf2e's degree of success then counts. */
    gild(roll) {
        if (!pending?.bonus || !roll?.terms) return;
        const { OperatorTerm, NumericTerm } = foundry.dice.terms;
        roll.terms.push(new OperatorTerm({ operator: "+" }), new NumericTerm({ number: pending.bonus, options: { flavor: "Gilded Chance" } }));
        roll.resetFormula?.();
        pending.bonus = 0;
    },

    /** Citrine Depth 3: an enemy's critical success on a save against you, within 30 feet, becomes a success. */
    fortune(message) {
        const context = message.flags?.pf2e?.context;
        if (context?.type !== "saving-throw" || context.outcome !== "criticalSuccess") return;
        const origin = context.origin?.actor ? fromUuidSync(context.origin.actor) : null;
        const saver = message.actor;
        if (!origin || !saver || depthOf(origin, "citrine") < 3 || !saver.isEnemyOf?.(origin)) return;
        const from = tokenOf(origin);
        const to = message.token?.object ?? tokenOf(saver);
        if (!from || !to || canvas.grid.measurePath([from.center, to.center]).distance > 30) return;
        const combat = encounterOf(origin);
        if (combat && origin.flags?.[MODULE_ID]?.assimilator?.used?.citrineSave === combat.id) return;

        const roll = message.rolls?.[0];
        if (!roll) return;
        const data = roll.toJSON();
        data.options = { ...(data.options ?? {}), degreeOfSuccess: 2 };
        message.updateSource({
            rolls: [JSON.stringify(data)],
            flavor: relabel(message.flavor ?? ""),
            "flags.pf2e.context.outcome": "success",
            [`flags.${MODULE_ID}.citrine`]: { from: origin.uuid },
        });
        if (combat) Relay.request({ action: SPENT, origin: origin.uuid, combat: combat.id });
    },

    async spend({ origin, combat }) {
        const actor = await fromUuid(origin);
        if (!actor) return;
        await actor.update({ [`flags.${MODULE_ID}.assimilator.used.citrineSave`]: combat });
    },
};

/** The card's result line, turned to a success, with the reason beneath it. */
function relabel(flavor) {
    const label = game.i18n?.localize?.("PF2E.Check.Result.Degree.Check.success") ?? "Success";
    const note = `<div class="isaacs-hb-citrine">Citrine: a critical success turned to a success — once this encounter.</div>`;
    try {
        const root = document.createElement("div");
        root.innerHTML = flavor;
        const element = root.querySelector(".result.degree-of-success");
        if (!element) return flavor + note;
        element.classList.remove("criticalSuccess", "critical-success");
        element.classList.add("success");
        element.innerHTML = `<span class="success">${label}</span>`;
        return root.innerHTML + note;
    } catch {
        return flavor + note;
    }
}

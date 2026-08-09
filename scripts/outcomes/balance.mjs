import { DEGREES, degreeOf } from "../lib/degree.mjs";
import { testPredicate } from "../lib/roll-options.mjs";
import { MODULE_ID } from "../sky/signs.mjs";

export const FLAG = "balance";

/**
 * Libra's *The Balance*: "the first natural 1 you roll each hour counts as a 10."
 *
 * `SubstituteRoll` cannot express this. It picks its value *before* the die is known — the substitution
 * replaces the dice expression with a literal (`check.ts:153`) — so a rule that only applies once you have
 * seen a 1 has nowhere to hang. `Check.rerollFromMessage` cannot either: it clones the old roll and
 * re-evaluates it (`check.ts:463`) rather than re-running the check, so it never consults substitutions.
 *
 * What is left is to change the die after it has landed, which is what happens here. The hook fires on
 * every chat message, so the first test is the cheapest one available: nineteen rolls in twenty are a
 * `return` on the die value alone.
 */
export const Balance = {
    registerHooks() {
        Hooks.on("preCreateChatMessage", (message) => Balance.onPreCreate(message));
    },

    onPreCreate(message) {
        try {
            return Balance.rewrite(message);
        } catch (error) {
            console.error("Isaac's Homebrew | The Balance could not rewrite a roll", error);
            return true; // never block a message over this
        }
    },

    rewrite(message) {
        if (!game.settings.get(MODULE_ID, "riders")) return true;

        const roll = message.rolls?.at(0);
        const die = roll?.dice?.find((d) => d.faces === 20);
        if (die?.total !== 1) return true;

        const context = message.flags?.pf2e?.context;
        const dc = context?.dc?.value;
        // Without a DC there is no degree of success to get wrong, and no reason to spend the allowance on
        // a roll whose result nobody is comparing to anything.
        if (!Number.isInteger(dc)) return true;

        const actor = message.actor;
        const source = Balance.armedItemOn(actor, message);
        if (!source) return true;

        const modifier = Number(roll.options?.totalModifier ?? roll.total - 1) || 0;
        const degree = degreeOf({
            dieValue: 10,
            modifier,
            dc,
            adjustments: context.dosAdjustments ?? null,
        });

        const rollData = roll.toJSON();
        setDieResult(rollData, 10);
        rollData.total = degree.total;
        rollData.options = { ...(rollData.options ?? {}), degreeOfSuccess: degree.value };

        message.updateSource({
            rolls: [JSON.stringify(rollData)],
            flavor: relabel(message.flavor ?? "", degree, source.name),
            [`flags.pf2e.context.outcome`]: degree.key,
            [`flags.pf2e.context.unadjustedOutcome`]: degree.unadjustedKey,
            [`flags.${MODULE_ID}.${FLAG}`]: { spent: true, from: source.uuid },
        });

        // The allowance is the item's own frequency, so the hourly recharge in `economy/recharge.mjs`
        // refills it with no further bookkeeping.
        Balance.consume(source);
        return true;
    },

    /** The item granting the boon, if it has a use left and this check qualifies. */
    armedItemOn(actor, message) {
        if (!actor) return null;
        const options = new Set([
            ...(message.flags?.pf2e?.context?.options ?? []),
            ...(actor.getRollOptions?.() ?? []),
        ]);

        for (const item of actor.items) {
            const flag = item.flags?.[MODULE_ID]?.[FLAG];
            if (!flag) continue;
            if ((item.system?.frequency?.value ?? 0) <= 0) continue;
            if (!testPredicate(flag.predicate, options)) continue;
            return item;
        }
        return null;
    },

    async consume(item) {
        const remaining = (item.system?.frequency?.value ?? 1) - 1;
        await item.update({ "system.frequency.value": Math.max(0, remaining) });
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: item.actor }),
            content:
                `<p><strong>${item.name}</strong>: a natural 1 counted as a 10. `
                + `${remaining > 0 ? `${remaining} left this hour.` : "None left this hour."}</p>`,
        });
    },
};

/** Set the d20's recorded result, so the card shows the die it is now claiming to be. */
function setDieResult(rollData, value) {
    for (const term of rollData.terms ?? []) {
        if (term.faces !== 20 || !Array.isArray(term.results)) continue;
        for (const result of term.results) {
            if (result.active !== false) result.result = value;
        }
    }
}

/**
 * Swap the degree pf2e already rendered into the flavour.
 *
 * The flavour is built inside `Check.roll` before this hook ever runs, and the renderer is private, so the
 * label is edited in place: `templates/chat/check/target-dc-result.hbs` puts it in `.result.degree-of-success`.
 * If that element is not there — a check with no target DC block, or a template that has moved — a plain
 * line is appended instead. The numbers in the flags are right either way; this only governs what is read
 * at a glance, and a visibly stale label would be worse than an ugly extra sentence.
 */
function relabel(flavor, degree, sourceName) {
    const label = _degreeLabel(degree.key);
    const note = `<div class="isaacs-hb-balance">${sourceName}: natural 1 counted as a 10 — ${label}.</div>`;

    try {
        const root = document.createElement("div");
        root.innerHTML = flavor;
        const element = root.querySelector(".result.degree-of-success");
        if (!element) return flavor + note;

        for (const key of DEGREES) element.classList.remove(key, key.replace(/([A-Z])/g, "-$1").toLowerCase());
        element.classList.add(degree.key);
        element.innerHTML = `<span class="${degree.key}">${label}</span>`;
        return root.innerHTML + note;
    } catch {
        return flavor + note;
    }
}

function _degreeLabel(key) {
    const localized = game.i18n?.localize?.(`PF2E.Check.Result.Degree.Check.${key}`);
    return localized && !localized.startsWith("PF2E.") ? localized : key;
}

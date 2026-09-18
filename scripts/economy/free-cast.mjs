import { testPredicate } from "../lib/roll-options.mjs";
import { MODULE_ID } from "../sky/signs.mjs";

export const FLAG = "freeCast";

/**
 * "Cast this Technique without spending a Focus Point, once per round."
 *
 * Gemini's boon and Taurus' Zenith say it per round; Cloth Attunement and *Attuned Casting* say it per day.
 * All four are the same mechanism, and both halves of it already exist:
 *
 *  - `SpellcastingEntryPF2e#cast(spell, options)` takes `consume`, and hands it to the `consume()` that
 *    spends the point. Setting it to false is the refund.
 *  - The allowance is the granting item's own `system.frequency`. pf2e decrements and *recharges* those
 *    itself — `Actor#recharge` runs on turn change, round change and rest — so there is no bookkeeping
 *    here beyond spending one.
 *
 * Which is why the backlog's "a chat hook that refunds a Focus Point after a flagged cast" is not needed:
 * the point never has to be spent in the first place.
 */
export const FreeCast = {
    registerSettings() {
        game.settings.register(MODULE_ID, "freeCastPrompt", {
            name: "Ask before spending a free cast",
            hint: "A boon that lets you cast without spending a Focus Point is used automatically and "
                + "announced in chat. Turn this on to be asked first, so you can save it.",
            scope: "client",
            config: true,
            type: Boolean,
            default: false,
        });
    },

    /**
     * Mutates `options` in place — the wrapper hands the same object to the system.
     *
     * Called from `scripts/cast-pipeline.mjs`, after the area has been aimed: backing out of a placement
     * must not spend the allowance on a cast that never happened.
     */
    async beforeCast(spell, options) {
        if (options.consume === false) return; // already free by some other route
        const actor = spell?.actor;
        if (!actor || spell.system?.cast?.focusPoints === 0) return;

        const allowance = FreeCast.find(spell);
        if (!allowance) return;

        if (game.settings.get(MODULE_ID, "freeCastPrompt")) {
            const spend = await foundry.applications.api.DialogV2.confirm({
                window: { title: "Free cast" },
                content:
                    `<p><strong>${allowance.item.name}</strong> can pay for ${spell.name} without a Focus `
                    + `Point.${allowance.unlimited ? "" : ` ${allowance.remaining} left.`}</p><p>Use it?</p>`,
                rejectClose: false,
            });
            if (!spend) return;
        }

        options.consume = false;
        if (!allowance.unlimited) {
            await allowance.item.update({ "system.frequency.value": allowance.remaining - 1 });
        }
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content:
                `<p><strong>${allowance.item.name}</strong> paid for ${spell.name} — no Focus Point spent.`
                + `${allowance.unlimited ? "" : ` ${allowance.remaining - 1} left.`}</p>`,
        });
    },

    /** The first item on the caster that will pay for this spell and still has a use left. */
    find(spell) {
        const options = new Set([
            ...(spell.getRollOptions?.("item") ?? []),
            ...(spell.actor?.getRollOptions?.() ?? []),
        ]);

        for (const item of spell.actor?.items ?? []) {
            const flag = item.flags?.[MODULE_ID]?.[FLAG];
            if (!flag) continue;
            if (!testPredicate(flag.predicate, options)) continue;
            // An allowance with no ceiling at all. Severance says "your Release Technique and every kidō
            // you know cost nothing and have **no frequency limit**" (guide §9, R-04) — there is no
            // counter to decrement, and the frequency check would otherwise refuse an item that has no
            // frequency to read, which is every effect that is not itself a once-per-day feat.
            if (flag.unlimited) return { item, remaining: Infinity, unlimited: true };
            const remaining = item.system?.frequency?.value ?? 0;
            if (remaining <= 0) continue;
            return { item, remaining };
        }
        return null;
    },
};

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

    install() {
        const path = "CONFIG.PF2E.Item.documentClasses.spellcastingEntry.prototype.cast";
        const proto = CONFIG.PF2E?.Item?.documentClasses?.spellcastingEntry?.prototype;
        if (!proto?.cast) {
            console.warn(`Isaac's Homebrew | could not find ${path}; free casts are off.`);
            return;
        }

        if (globalThis.libWrapper?.register) {
            libWrapper.register(
                MODULE_ID,
                path,
                async function (wrapped, spell, options = {}) {
                    await FreeCast.beforeCast(spell, options);
                    return wrapped(spell, options);
                },
                "WRAPPER",
            );
            return;
        }

        const original = proto.cast;
        proto.cast = async function (spell, options = {}) {
            await FreeCast.beforeCast(spell, options);
            return original.call(this, spell, options);
        };
    },

    /** Mutates `options` in place — the wrapper hands the same object to the system. */
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
                    + `Point. ${allowance.remaining} left.</p><p>Use it?</p>`,
                rejectClose: false,
            });
            if (!spend) return;
        }

        options.consume = false;
        await allowance.item.update({ "system.frequency.value": allowance.remaining - 1 });
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content:
                `<p><strong>${allowance.item.name}</strong> paid for ${spell.name} — no Focus Point spent. `
                + `${allowance.remaining - 1} left.</p>`,
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
            const remaining = item.system?.frequency?.value ?? 0;
            if (remaining <= 0) continue;
            if (!testPredicate(flag.predicate, options)) continue;
            return { item, remaining };
        }
        return null;
    },
};

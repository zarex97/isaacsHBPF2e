import { MODULE_ID } from "../sky/signs.mjs";

const FLAG = "suppression";
/**
 * The re-entry block lives on the **actor**, not on the effect it came from.
 *
 * Driven live, and the first shape of this failed: the target re-sealed — which takes the release-state
 * effect off the sheet — and with the effect went the only record that anything had been suppressed, so
 * the very next Release went through. Re-sealing to wash off a seal is precisely the loophole that
 * "can't re-enter it during that time" exists to close.
 */
const SEAL = "sealedUntil";

/**
 * Switching an ongoing effect **off** without deleting it.
 *
 * > A **release state** — Shikai, Bankai, Resurrección, Segunda Etapa, Vollständig, a Barbarian's Rage,
 * > a Magus's Arcane Cascade, or any comparable ongoing self-buff — is not ended outright but
 * > **suppressed until the end of the target's next turn**, and the target can't re-enter it during
 * > that time. — guide §5.3
 *
 * That clause is the Quincy's whole reason for existing, and it did nothing at all. The counteract path
 * wrote `effect.update({ disabled: true })`, and **a pf2e Effect item has no `disabled` field** — the
 * flag it does have, `system.expired`, is derived from `remainingDuration` in `prepareBaseData` and is
 * overwritten on every preparation. Driven live: a Quincy spent a Reiatsu Point, the card announced that
 * a 17th-level Shikai was suppressed, and all three of its rule elements were still live on the actor a
 * moment later. The one thing Seal the Art is for was a sentence in chat.
 *
 * So the rules are **moved aside** rather than flagged: stashed in a module flag and put back when the
 * window closes. Two things have to move, not one — pf2e's `system.rules`, and the module's own
 * `flags.isaacs-hb-pf2e.riders`, which the rider engine reads directly and which pf2e knows nothing
 * about. A Shikai whose rules were parked but whose riders still fired would be suppressed on the sheet
 * and awake at the table.
 *
 * Safe to park, and for exactly the reason `rulesAreSafeToRefresh` gives: a release-state effect's rules
 * are plain synthetics. A `GrantItem` or a `ChoiceSet` carries state **inside** the rules array, so this
 * refuses to touch an effect holding either — better to leave a clause unenforced than to strand a grant.
 */
export const Suppression = {
    /** Is this effect currently parked? */
    isSuppressed(effect) {
        return !!effect?.getFlag?.(MODULE_ID, FLAG);
    },

    /** Anything on this actor currently parked. */
    suppressedOn(actor) {
        return (actor?.itemTypes?.effect ?? []).filter((e) => this.isSuppressed(e));
    },

    /**
     * May this effect's rules be parked and put back unchanged?
     *
     * Exported reasoning rather than an inline check because the answer is the whole safety argument.
     */
    canSuppress(effect) {
        const rules = effect?._source?.system?.rules ?? [];
        return !rules.some((rule) => rule?.key === "GrantItem" || rule?.key === "ChoiceSet");
    },

    /**
     * Take the effect out of play.
     *
     * `minutes` is Sklaverei's critical success — "the suppression lasts 1 minute instead" — and is
     * measured on the world clock, because a minute is not a number of turns. Everything else runs to
     * the end of the target's next turn and is counted by `pf2e.endTurn`.
     *
     * **Whose turn it is now decides the count.** Suppressed during somebody else's turn, the target's
     * next turn is the one that has not happened yet, so one end-of-turn closes the window. Suppressed
     * during the *target's own* turn, this turn is not the next one — the one after it is — so two do.
     */
    async suppress(effect, { minutes = 0 } = {}) {
        if (!effect || this.isSuppressed(effect) || !this.canSuppress(effect)) return false;

        const source = effect.toObject();
        const actor = effect.actor;
        const theirTurn = game.combat?.combatant?.actor?.id === actor?.id;
        const stash = {
            rules: source.system?.rules ?? [],
            riders: source.flags?.[MODULE_ID]?.riders ?? null,
            until: minutes > 0 ? game.time.worldTime + minutes * 60 : null,
            turns: minutes > 0 ? null : (theirTurn ? 2 : 1),
        };

        await effect.update({
            "system.rules": [],
            [`flags.${MODULE_ID}.riders`]: null,
            [`flags.${MODULE_ID}.${FLAG}`]: stash,
        });
        // The same window, kept where taking the effect off cannot erase it.
        if (actor) await actor.setFlag(MODULE_ID, SEAL, { until: stash.until, turns: stash.turns });
        return true;
    },

    /** Put it back exactly as it was. */
    async restore(effect) {
        const stash = effect?.getFlag?.(MODULE_ID, FLAG);
        if (!stash) return false;
        await effect.update({
            "system.rules": stash.rules ?? [],
            [`flags.${MODULE_ID}.riders`]: stash.riders ?? null,
            [`flags.${MODULE_ID}.-=${FLAG}`]: null,
        });
        if (this.suppressedOn(effect.actor).length === 0) await this.unblock(effect.actor);
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor: effect.actor }),
            content: `<p><strong>${effect.name}</strong> comes back.</p>`,
        });
        return true;
    },

    /**
     * "The target can't re-enter it during that time."
     *
     * Asked of the whole actor rather than of one effect name: a Soulbound whose Shikai is parked may not
     * climb the ladder again while it is, which is what re-entering would be.
     */
    blocked(actor) {
        return !!actor?.getFlag?.(MODULE_ID, SEAL);
    },

    /** The window has closed: the art may be re-entered again. */
    async unblock(actor) {
        if (actor?.getFlag?.(MODULE_ID, SEAL)) await actor.unsetFlag(MODULE_ID, SEAL);
    },

    registerHooks() {
        /** The end of a turn is what the ordinary window is measured in. */
        Hooks.on("pf2e.endTurn", async (combatant) => {
            if (game.users.activeGM?.id !== game.user.id) return;
            const actor = combatant?.actor;
            for (const effect of this.suppressedOn(actor)) {
                const stash = effect.getFlag(MODULE_ID, FLAG);
                if (stash?.until) continue;               // a minute is counted on the clock, not here
                const left = (stash?.turns ?? 1) - 1;
                if (left > 0) await effect.setFlag(MODULE_ID, FLAG, { ...stash, turns: left });
                else await this.restore(effect);
            }
            // Counted even when the effect it came from has been taken off in the meantime: re-sealing
            // must not wash off a seal.
            const seal = actor?.getFlag?.(MODULE_ID, SEAL);
            if (seal && !seal.until) {
                const left = (seal.turns ?? 1) - 1;
                if (left > 0) await actor.setFlag(MODULE_ID, SEAL, { ...seal, turns: left });
                else await this.unblock(actor);
            }
        });

        /** And Sklaverei's minute is counted on the world clock. */
        Hooks.on("updateWorldTime", async () => {
            if (game.users.activeGM?.id !== game.user.id) return;
            for (const actor of game.actors ?? []) {
                for (const effect of this.suppressedOn(actor)) {
                    const until = effect.getFlag(MODULE_ID, FLAG)?.until;
                    if (typeof until === "number" && game.time.worldTime >= until) {
                        await this.restore(effect);
                    }
                }
                const seal = actor?.getFlag?.(MODULE_ID, SEAL);
                if (typeof seal?.until === "number" && game.time.worldTime >= seal.until) {
                    await this.unblock(actor);
                }
            }
        });
    },
};

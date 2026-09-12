import { Reiatsu } from "./reiatsu.mjs";

const MODULE_ID = "isaacs-hb-pf2e";
const EFFECTS_PACK = `${MODULE_ID}.soulbound-effects`;

/**
 * Kyōka Suigetsu's Complete Hypnosis.
 *
 * Every other ability in this class can be asked about the present: what you are holding, which mode you
 * are in, how many charges are left. This one is keyed to an event in the **observer's past** — "the
 * target must have seen your Shikai release, and thereafter they are in your hypnosis every time you
 * release" — and no rule element can express a memory. So the module keeps one.
 *
 * The register lives on the Soulbound, not on each observer: it is the Soulbound's hypnosis, it should
 * travel with them between scenes, and a creature that is deleted and re-placed should not quietly
 * forget. Keyed by actor UUID, with the window that observer is currently inside.
 */

/**
 * What one save buys the creature that rolled it (guide §7A).
 *
 * | Outcome | Then |
 * | critical success | immune for 24 hours |
 * | success | immune for 10 minutes |
 * | failure | hypnotized for 1 minute |
 * | critical failure | hypnotized for 1 hour, and automatically hypnotized once per encounter thereafter |
 *
 * Kept pure because the escalation is the whole design and it is invisible in the JSON: "seen it once,
 * falls to it forever" is one branch of four, and getting it wrong makes Aizen either harmless or
 * unbeatable with nothing in between.
 */
export function windowFor(outcome) {
    switch (outcome) {
        case "criticalSuccess":
            return { immuneFor: { unit: "hours", value: 24 }, hypnotizedFor: null, permanentVictim: false };
        case "success":
            return { immuneFor: { unit: "minutes", value: 10 }, hypnotizedFor: null, permanentVictim: false };
        case "failure":
            return { immuneFor: null, hypnotizedFor: { unit: "minutes", value: 1 }, permanentVictim: false };
        case "criticalFailure":
            return { immuneFor: null, hypnotizedFor: { unit: "hours", value: 1 }, permanentVictim: true };
        default:
            return { immuneFor: null, hypnotizedFor: null, permanentVictim: false };
    }
}

/**
 * Must this observer roll at all?
 *
 * Three reasons not to: they cannot see (canon's own exemption, and the reason the blind are Aizen's
 * blind spot), they are inside an immunity window, or they are already hypnotized. A permanent victim is
 * the exception that skips the roll in the other direction — they simply fall again.
 */
export function shouldRoll({ canSee, immuneUntil, now, alreadyHypnotized, permanentVictim }) {
    if (!canSee) return { roll: false, autoHypnotize: false };
    if (permanentVictim) return { roll: false, autoHypnotize: true };
    if (alreadyHypnotized) return { roll: false, autoHypnotize: false };
    if (immuneUntil !== null && immuneUntil !== undefined && now < immuneUntil) {
        return { roll: false, autoHypnotize: false };
    }
    return { roll: true, autoHypnotize: false };
}

export const Hypnosis = {
    register(actor) {
        return actor?.getFlag(MODULE_ID, "hypnosis") ?? {};
    },

    /** What this Soulbound knows about one observer. */
    entryFor(actor, observerUuid) {
        return this.register(actor)[observerUuid] ?? {
            immuneUntil: null, permanentVictim: false, lastOutcome: null,
        };
    },

    async remember(actor, observerUuid, outcome) {
        if (!Reiatsu.isSoulbound(actor)) return;
        const result = windowFor(outcome);
        const now = game.time.worldTime;
        const seconds = result.immuneFor
            ? (result.immuneFor.unit === "hours" ? 3600 : 60) * result.immuneFor.value
            : 0;

        const entry = {
            immuneUntil: result.immuneFor ? now + seconds : null,
            permanentVictim: this.entryFor(actor, observerUuid).permanentVictim || result.permanentVictim,
            lastOutcome: outcome,
        };
        await actor.setFlag(MODULE_ID, `hypnosis.${observerUuid.replaceAll(".", "_")}`, entry);
        return entry;
    },

    /** The register is a memory, not a state: it survives the encounter on purpose. */
    async forget(actor) {
        await actor.unsetFlag(MODULE_ID, "hypnosis");
    },

    async packedEffect(name) {
        const pack = game.packs.get(EFFECTS_PACK);
        const entry = pack ? (await pack.getIndex()).find((e) => e.name === name) : null;
        if (!entry) {
            console.warn(`Isaac's Homebrew | ${EFFECTS_PACK} has no "${name}"`);
            return null;
        }
        return pack.getDocument(entry._id);
    },
};

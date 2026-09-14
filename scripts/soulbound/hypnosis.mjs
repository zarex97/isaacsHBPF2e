import { Reiatsu } from "./reiatsu.mjs";

const MODULE_ID = "isaacs-hb-pf2e";
const EFFECTS_PACK = `${MODULE_ID}.soulbound-effects`;
const EFFECT = "Effect: Hypnotized";

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
    /**
     * Roll the hypnosis for every creature that can see you — guide §7A.
     *
     * > When you Release, and when a creature that can see first observes you while released, that
     * > creature must succeed at a **Will save** against your Reiatsu DC or be **hypnotized** for
     * > 1 minute.
     *
     * This is the fourth machine in the class that was written, tested and never called. The register
     * above could remember an observer's window since Phase 3; nothing ever asked it to.
     *
     * Three decisions worth stating, because none of them is in the JSON:
     *
     *  - **Enemies only.** The guide's Shikai clause says "a creature", and its Full Release clause says
     *    "all enemies within 60 feet". Hypnotising your own party is canon Aizen and unplayable at a
     *    table, so both follow the Full Release's word — and SB-19's ruling that this class does not
     *    catch its own side.
     *  - **The flat check's DC is stamped on at creation.** Refined Release raises it from 5 to 6, and
     *    the effect lives on the *observer*, where no predicate can see the hypnotist's features. Same
     *    answer as `applyFullReleaseShape`: adjust the source as it is created.
     *  - **A creature with no sight never rolls.** `shouldRoll` already says so; this supplies the
     *    answer from pf2e's own senses rather than assuming everything can see.
     */
    async sweep(actor, { range = null, includeImmune = false } = {}) {
        if (!Reiatsu.isSoulbound(actor)) return [];
        const statistic = actor.getStatistic?.("soulbound");
        const dc = statistic?.dc?.value;
        const origin = actor.getActiveTokens(true, true).at(0);
        if (!dc || !origin) return [];

        const refined = (actor.getRollOptions?.() ?? []).includes("feature:refined-release");
        const now = game.time.worldTime;
        const results = [];

        for (const token of canvas.tokens?.placeables ?? []) {
            const observer = token.actor;
            if (!observer || token.document.id === origin.id) continue;
            if (observer.alliance === actor.alliance) continue;
            if (range !== null && canvas.grid.measurePath(
                [{ x: origin.object.center.x, y: origin.object.center.y },
                 { x: token.center.x, y: token.center.y }]).distance > range) continue;

            const uuid = observer.uuid;
            const entry = this.entryFor(actor, uuid);
            const canSee = !observer.hasCondition?.("blinded");
            const decision = shouldRoll({
                canSee,
                immuneUntil: includeImmune ? null : entry.immuneUntil,
                now,
                alreadyHypnotized: observer.itemTypes.effect.some((e) => e.name === EFFECT),
                permanentVictim: entry.permanentVictim,
            });

            if (decision.autoHypnotize) {
                await this.hypnotize(observer, { refined, seconds: 3600 });
                results.push({ observer: observer.name, outcome: "auto" });
                continue;
            }
            if (!decision.roll) {
                results.push({ observer: observer.name, outcome: canSee ? "immune" : "blind" });
                continue;
            }

            const roll = await observer.getStatistic("will")?.roll({
                dc: { value: dc }, skipDialog: true, origin: actor,
                extraRollOptions: [`${MODULE_ID}:kanzen-saimin`],
            });
            const outcome = ["criticalFailure", "failure", "success", "criticalSuccess"][roll?.degreeOfSuccess ?? -1];
            if (!outcome) continue;
            await this.remember(actor, uuid, outcome);
            if (outcome === "failure") await this.hypnotize(observer, { refined, seconds: 60 });
            if (outcome === "criticalFailure") await this.hypnotize(observer, { refined, seconds: 3600 });
            results.push({ observer: observer.name, outcome });
        }
        return results;
    },

    /** Put the mirror on one observer, with the flat check the hypnotist's Refined Release sets. */
    async hypnotize(observer, { refined = false, seconds = 60 } = {}) {
        const doc = await this.packedEffect(EFFECT);
        if (!doc) return null;
        const source = foundry.utils.deepClone(doc.toObject());
        source.system.duration = seconds >= 3600
            ? { ...source.system.duration, unit: "hours", value: Math.round(seconds / 3600) }
            : { ...source.system.duration, unit: "minutes", value: Math.max(1, Math.round(seconds / 60)) };
        for (const rider of source.flags?.[MODULE_ID]?.riders ?? []) {
            if (rider.apply?.type === "flat-check") rider.apply.dc = refined ? 6 : 5;
        }
        const [created] = await observer.createEmbeddedDocuments("Item", [source]);
        return created ?? null;
    },

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

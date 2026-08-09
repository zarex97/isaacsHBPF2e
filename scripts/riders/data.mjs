import { MODULE_ID } from "../sky/signs.mjs";

export const OUTCOMES = ["criticalSuccess", "success", "failure", "criticalFailure"];

export const OUTCOME_LABELS = {
    criticalSuccess: "critical success",
    success: "success",
    failure: "failure",
    criticalFailure: "critical failure",
};

/**
 * The events a rider can key off.
 *
 * `save-rolled` is the original and stays the default, so the 26 Techniques written before this existed
 * mean exactly what they meant before. The rest were added to close the last three rows of backlog §1.
 */
export const EVENTS = [
    "save-rolled", // a target rolled its save against a Technique
    "strike-resolved", // this actor's Strike resolved against a target
    "strike-received", // a Strike resolved against this actor
    "action-used", // this actor posted an action or ability to chat
    "damage-applied", // damage from this actor's item landed on a target
    "turn-end", // this actor's turn ended
    "turn-start", // this actor's turn began
];

export const DEFAULT_EVENT = "save-rolled";

/** The Technique a message came from. Damage messages carry the spell too, which is where saves land. */
export function itemFor(message) {
    return message?.item ?? null;
}

/** Every rider declared on an item, or an empty list. */
export function ridersOn(item) {
    const riders = item?.flags?.[MODULE_ID]?.riders;
    return Array.isArray(riders) ? riders : [];
}

export function eventOf(rider) {
    return rider?.event ?? DEFAULT_EVENT;
}

/**
 * Gather every rider for an event, from every item that could be carrying one.
 *
 * A save rider lives on the Technique that forced the save, so the message's item is the obvious source.
 * A strike rider does not: `message.item` for a Strike is the fist or the weapon, while "each time you hit
 * with an unarmed Strike…" is written on a Cloth's Ascendant effect. So the actor's own items are searched
 * too, and the predicate is what narrows it back down to the right Strikes.
 *
 * Returns `[{ item, rider, index }]` — the index is needed later to name one rider back to the GM without
 * sending the rider itself.
 */
export function collectRiders({ event, item, actor }) {
    const found = [];
    const seen = new Set();
    const sources = [];
    for (const candidate of [item, ...(actor?.items ?? [])]) {
        if (!candidate || seen.has(candidate.id)) continue;
        seen.add(candidate.id);
        sources.push(candidate);
    }

    for (const source of sources) {
        ridersOn(source).forEach((rider, index) => {
            if (eventOf(rider) === event) found.push({ item: source, rider, index });
        });
    }
    return found;
}

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

/**
 * The message contexts that mean "an ability was used", as opposed to "a die was rolled about one".
 *
 * An ability card carries no context at all (`ItemPF2e#toMessage` sets only `flags.pf2e.origin`); a spell
 * with a save carries `spell-cast`; a self-applied effect carries `self-effect`. Everything else in pf2e's
 * context union — `saving-throw`, `attack-roll`, `damage-roll`, `damage-taken`, `area-fire` — is the result
 * of a roll.
 */
const USE_CONTEXTS = new Set([undefined, null, "spell-cast", "self-effect"]);

/**
 * Was this message an ability being *used*?
 *
 * This is a loop guard, and it is load-bearing. pf2e stamps `flags.pf2e.origin` — the item — onto every
 * check it rolls (`check.ts`, `origin: item?.getOriginData()`), and `ChatMessagePF2e#item` reads it back.
 * So a save that a rider *itself* forced produces a message whose `item` is the very ability that forced
 * it. Treating that as another use of the ability makes the ability re-trigger itself: Aurora Execution
 * forces a Fortitude save, the save's message looks like Aurora Execution being used, which forces another
 * save, forever — rolling 16d6 at the target each time round.
 *
 * An allow-list rather than a deny-list, so a context type added by a future pf2e release fails to a missed
 * rider rather than back to that loop. The roll check is the same invariant from the other side: a card has
 * no dice attached, every roll result does.
 */
export function isAbilityUse(message) {
    if (!message) return false;
    if (message.rolls?.length) return false;
    return USE_CONTEXTS.has(message.flags?.pf2e?.context?.type);
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
 * Events whose rider can only be on the item the event is about.
 *
 * "When this ability is used" names one ability. Searching the rest of the actor's sheet for it means a
 * Saint holding two Zenith activities fires both from one — two Fortitude saves and 16d6 twice for a single
 * use — because neither rider has a predicate to tell them apart, and neither should need one.
 *
 * The other events genuinely do need the wider search, which is why this is a list rather than a rule: a
 * Strike's `message.item` is the fist or the weapon, while "each time you hit with an unarmed Strike…" is
 * written on a Cloth's Ascendant effect, and only the predicate can narrow that back down.
 */
const ITEM_SCOPED_EVENTS = new Set(["action-used"]);

/**
 * Gather every rider for an event, from every item that could be carrying one.
 *
 * A save rider lives on the Technique that forced the save, so the message's item is the obvious source.
 * A strike rider does not — see `ITEM_SCOPED_EVENTS` above for which events search wider and why.
 *
 * Returns `[{ item, rider, index }]` — the index is needed later to name one rider back to the GM without
 * sending the rider itself.
 */
export function collectRiders({ event, item, actor }) {
    const found = [];
    const seen = new Set();
    const sources = [];
    const candidates = ITEM_SCOPED_EVENTS.has(event) ? [item] : [item, ...(actor?.items ?? [])];
    for (const candidate of candidates) {
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

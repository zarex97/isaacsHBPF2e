import { MODULE_ID } from "../sky/signs.mjs";

export const OUTCOMES = ["criticalSuccess", "success", "failure", "criticalFailure"];

export const OUTCOME_LABELS = {
    criticalSuccess: "critical success",
    success: "success",
    failure: "failure",
    criticalFailure: "critical failure",
};

/** The Technique a message came from. Damage messages carry the spell too, which is where saves land. */
export function itemFor(message) {
    return message?.item ?? null;
}

/** Every rider declared on an item, or an empty list. */
export function ridersOn(item) {
    const riders = item?.flags?.[MODULE_ID]?.riders;
    return Array.isArray(riders) ? riders : [];
}

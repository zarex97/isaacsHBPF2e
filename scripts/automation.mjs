/**
 * The one door from this module into Isaac's PF2e Automation.
 *
 * Area targeting, the single-wrap pipelines and the allowance fixes live in their own module,
 * `isaacs-pf2e-automation` (`../isaacs-pf2e-automation`, contract in its `Docs/api.md`). Nothing else in
 * this module reaches it: everything goes through `automation()`, which reads the API that module publishes
 * at its `init`. The names exported below are lazy — each looks the API up when it is used rather than when
 * this file loads, which is before any module's `init` — so call sites read as they did when the code lived
 * beside them.
 */
export const AUTOMATION_ID = "isaacs-pf2e-automation";

let api = null;

export function automation() {
    if (api) return api;
    const published = globalThis.game?.modules?.get(AUTOMATION_ID)?.api;
    if (!published) {
        throw new Error(
            `Isaac's Homebrew | ${AUTOMATION_ID} is not active, or has not finished its init — this module requires it.`,
        );
    }
    return (api = published);
}

/** For the offline tests: hand the facades the automation's API, built from its own sources. */
export function setAutomation(value) {
    api = value;
}

/** An object whose every property is read off the API when it is used, methods bound to their owner. */
function facade(read) {
    return new Proxy(
        {},
        {
            get(_target, prop) {
                const owner = read(automation());
                const value = owner?.[prop];
                return typeof value === "function" ? value.bind(owner) : value;
            },
        },
    );
}

// The pipelines and the automation's own objects.
export const AreaTargeting = facade((a) => a.targeting);
export const CastPipeline = facade((a) => a.castPipeline);
export const DamageBus = facade((a) => a.damageBus);
export const CheckPipeline = facade((a) => a.checkPipeline);
export const ActorPreparation = facade((a) => a.actorPreparation);
export const DetectionModes = facade((a) => a.detectionModes);
export const RerollPipeline = facade((a) => a.rerollPipeline);
export const Recharge = facade((a) => a.recharge);
export const SpellFrequency = facade((a) => a.spellFrequency);
export const FrequencyGuard = facade((a) => a.frequencyGuard);
export const EncounterDamage = facade((a) => a.encounter.EncounterDamage);
export const DEGREES = facade((a) => a.degree.DEGREES);

// Functions, looked up at call time.
export const testPredicate = (...args) => automation().rollOptions.testPredicate(...args);
export const targetingOptions = (...args) => automation().rollOptions.targetingOptions(...args);
export const riderOptions = (...args) => automation().rollOptions.riderOptions(...args);
export const describeActor = (...args) => automation().rollOptions.describeActor(...args);
export const describeDamage = (...args) => automation().rollOptions.describeDamage(...args);
export const degreeOf = (...args) => automation().degree.degreeOf(...args);
export const encounterOf = (...args) => automation().encounter.encounterOf(...args);

export const placeArea = (...args) => automation().areas.placeArea(...args);
export const discardArea = (...args) => automation().areas.discardArea(...args);
export const originOf = (...args) => automation().areas.originOf(...args);
export const shapeFromArea = (...args) => automation().areas.shapeFromArea(...args);
export const catchTokens = (...args) => automation().areas.catchTokens(...args);
export const configFor = (...args) => automation().areas.configFor(...args);

export const registerStepProvider = (...args) => automation().heightening.registerStepProvider(...args);
export const bonusStepsFrom = (...args) => automation().heightening.bonusStepsFrom(...args);
export const effectiveLevel = (...args) => automation().heightening.effectiveLevel(...args);
export const stepsFor = (...args) => automation().heightening.stepsFor(...args);
export const applyHeightening = (...args) => automation().heightening.applyHeightening(...args);
export const applyThresholds = (...args) => automation().heightening.applyThresholds(...args);
export const thresholdsCrossed = (...args) => automation().heightening.thresholdsCrossed(...args);
export const valueAtLevel = (...args) => automation().heightening.valueAtLevel(...args);

export const registerFlagScope = (...args) => automation().flags.registerFlagScope(...args);

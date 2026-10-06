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
function facade(read, source = automation) {
    return new Proxy(
        {},
        {
            get(_target, prop) {
                const owner = read(source());
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

/* ---- The rider engine ----------------------------------------------------------------------------- */

/**
 * The rider engine, lingering areas, overlap and enemies-only terrain moved into the automation in its
 * 1.1.0. Their names stay grouped here, read off the same API as everything above.
 */
export const ridersApi = automation;

export const Riders = facade((r) => r.riders, ridersApi);
export const RiderExtensions = facade((r) => r.riderExtensions, ridersApi);
export const Relay = facade((r) => r.relay, ridersApi);
export const RiderPriority = facade((r) => r.riderPriority, ridersApi);
export const Banish = facade((r) => r.banish, ridersApi);
export const Encasement = facade((r) => r.encasement, ridersApi);
export const Escape = facade((r) => r.escape, ridersApi);
export const StrikeTechnique = facade((r) => r.strikeTechnique, ridersApi);
export const SharedAllowance = facade((r) => r.sharedAllowance, ridersApi);
export const Lingering = facade((r) => r.lingering, ridersApi);
export const LingeringData = facade((r) => r.lingeringData, ridersApi);
export const Overlap = facade((r) => r.overlap, ridersApi);
export const Bypass = facade((r) => r.bypass, ridersApi);

export const shadowTarget = (...args) => ridersApi().bypass.shadowTarget(...args);
export const registerRollBypass = (...args) => ridersApi().bypass.registerRollBypass(...args);
export const inflictPersistent = (...args) => ridersApi().riderApply.inflictPersistent(...args);
export const resolveCounteract = (...args) => ridersApi().riderApply.resolveCounteract(...args);
export const conditionUuidOf = (...args) => ridersApi().riderApply.conditionUuidOf(...args);
export const isAbilityUse = (...args) => ridersApi().riderData.isAbilityUse(...args);
export const registerEnemyTerrain = (...args) => ridersApi().enemyTerrain.register(...args);
export const registerOriginFlag = (...args) => ridersApi().enemyTerrain.registerOriginFlag(...args);

import { CheckPipeline } from "../lib/check-pipeline.mjs";
import { CHECK as PRIORITY } from "../stage-priorities.mjs";
import { degreeOf } from "../lib/degree.mjs";
import { relabel, setDieResult } from "../roll-rewrites/balance.mjs";
import { MODULE_ID } from "./signs.mjs";
import { SkyTracker } from "./tracker.mjs";

/**
 * The two domains the four terrain effects cannot carry as rule elements (Stargazer guide §8.3, §11.5).
 *
 * **Libra's domain is the die.** Benefic: once per day, the first natural 1 you roll counts as a 10;
 * Exalted, the same once per hour. Retrograde: once per day, the first natural 20 counts as a 10; Malefic,
 * once per hour. Ruled automatic (R6/§11.5), on attack rolls, saving throws, skill checks and Perception —
 * never flat checks. A rule that fires only once the die is seen cannot be a `SubstituteRoll`, so the die is
 * rewritten after it lands, with the helpers the Saint's *The Balance* already uses.
 *
 * **Aries touches the first Strike you make in each encounter.** No roll option says "first", so a stage on
 * the check pipeline adds the day's circumstance modifier to a creature's first Strike in a combat and
 * remembers the combat.
 *
 * Both read the aspect a creature actually **wears** — after Unfailing Cosmo, Shelter and Forewarned have
 * softened it — so a softened day is softened here too.
 */

const VALUE = { benefic: 1, exalted: 2, retrograde: -1, malefic: -2 };
const HOURLY = new Set(["exalted", "malefic"]);
const LIBRA_TYPES = new Set(["attack-roll", "saving-throw", "skill-check", "perception-check", "initiative"]);

/**
 * Libra uses recorded the moment they happen, by actor id. The flag is written too, but a flag write is a
 * round-trip, and a second roll in the same instant — an area's saves — read the flag before it landed and
 * took the allowance twice (driven). This one is synchronous; the flag is what survives a reload.
 */
const libraSpent = new Map();

/**
 * The terrain aspect this creature is wearing for `sign` today, or null.
 *
 * By the sign stamped on the effect, not the day's: *Two Skies* puts a second sign up over a Stargazer's
 * party and a *Private Sign* raises one on a Starless day, so "is Libra up for this creature" is a question
 * about what it wears.
 */
export function wornAspect(actor, sign) {
    for (const effect of actor?.itemTypes?.effect ?? []) {
        if (!effect.getFlag?.(MODULE_ID, "skyEffect")) continue;
        if (sign && effect.getFlag(MODULE_ID, "skySign") !== sign) continue;
        const match = /^Sky: (Benefic|Retrograde|Malefic|Exalted)$/.exec(SkyTracker.skyName(effect));
        if (match) return match[1].toLowerCase();
    }
    return null;
}

/**
 * Whether Libra's allowance is still unspent for this aspect. `used` is `{ day, hour }` of the last use:
 * a daily aspect is spent for the sky's day, an hourly one for the world's hour.
 */
export function libraReady(aspect, used, { day, hour }) {
    if (!used) return true;
    if (HOURLY.has(aspect)) return !(used.day === day && used.hour === hour);
    return used.day !== day;
}

function rewriteLibra(message) {
    const context = message.flags?.pf2e?.context;
    if (!LIBRA_TYPES.has(context?.type)) return;
    const actor = message.actor;
    const aspect = wornAspect(actor, "libra");
    if (!aspect) return;

    const roll = message.rolls?.at(0);
    const die = roll?.dice?.find((d) => d.faces === 20);
    const want = aspect === "benefic" || aspect === "exalted" ? 1 : 20;
    if (die?.total !== want) return;

    const now = { day: SkyTracker.state.day, hour: Math.floor(game.time.worldTime / 3600) };
    const used = libraSpent.get(actor.id) ?? actor.getFlag(MODULE_ID, "libraUsed");
    if (!libraReady(aspect, used, now)) return;
    libraSpent.set(actor.id, now);

    const modifier = Number(roll.total) - want;
    const rollData = roll.toJSON();
    setDieResult(rollData, 10);
    const dc = context.dc?.value;
    const what = `The Sky (Libra): a natural ${want} counted as a 10`;
    if (Number.isInteger(dc)) {
        const degree = degreeOf({ dieValue: 10, modifier, dc, adjustments: context.dosAdjustments ?? null });
        rollData.total = degree.total;
        rollData.options = { ...(rollData.options ?? {}), degreeOfSuccess: degree.value };
        message.updateSource({
            rolls: [JSON.stringify(rollData)],
            flavor: relabel(message.flavor ?? "", degree, what),
            "flags.pf2e.context.outcome": degree.key,
            "flags.pf2e.context.unadjustedOutcome": degree.unadjustedKey,
        });
    } else {
        rollData.total = 10 + modifier;
        message.updateSource({ rolls: [JSON.stringify(rollData)], flavor: `${message.flavor ?? ""}<div class="isaacs-hb-balance">${what}.</div>` });
    }
    actor.setFlag(MODULE_ID, "libraUsed", now).catch((e) => console.error("Isaac's Homebrew | Libra", e));
}

/** Aries: the day's modifier on a creature's first Strike in an encounter. */
function ariesFirstStrike(check, context) {
    if (context?.type !== "attack-roll") return;
    const domains = context.domains ?? [];
    if (!domains.includes("strike-attack-roll")) return;
    const actor = context.actor;
    const aspect = wornAspect(actor, "aries");
    if (!aspect) return;
    // The encounter being fought: the viewed one when it holds this creature, else any it is in.
    const holds = (c) => c?.started && c.combatants.some((x) => x.actorId === actor.id);
    const combat = holds(game.combat) ? game.combat : game.combats?.find(holds);
    if (!combat || actor.getFlag(MODULE_ID, "ariesStruck") === combat.id) return;
    check.push(new game.pf2e.Modifier({
        slug: "sky-aries-first-strike", label: "The Sky (Aries)", modifier: VALUE[aspect], type: "circumstance",
    }));
    actor.setFlag(MODULE_ID, "ariesStruck", combat.id).catch((e) => console.error("Isaac's Homebrew | Aries", e));
}

export const TerrainRolls = {
    registerHooks() {
        Hooks.on("preCreateChatMessage", (message) => {
            try {
                rewriteLibra(message);
            } catch (error) {
                console.error("Isaac's Homebrew | Libra could not rewrite a roll", error);
            }
            return true;
        });
        // Once the flag write lands (or the flag is cleared), the flag is the record again.
        Hooks.on("updateActor", (actor, change) => {
            const flags = change?.flags?.[MODULE_ID];
            if (flags && ("libraUsed" in flags || "-=libraUsed" in flags)) libraSpent.delete(actor.id);
        });
        CheckPipeline.before("Aries's first Strike (Stargazer guide §8.3)", PRIORITY.ariesFirstStrike, ariesFirstStrike);
    },
};

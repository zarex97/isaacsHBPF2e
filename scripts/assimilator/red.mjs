/**
 * Red's scripted riders — the parts of a Red Substrate that happen on a clock rather than on a roll.
 *
 * Garnet, Depth 3: *"At the start of your turn, gain temporary Hit Points equal to half your level if any
 * creature within 30 feet is taking persistent bleed."* pf2e has no rule element that looks at other creatures,
 * so this reads the scene at `pf2e.startTurn`.
 */

function isWriter() {
    return game.users?.activeGM ? game.users.activeGM.isSelf : game.user.isGM;
}

function bleeding(actor) {
    return actor?.itemTypes?.condition?.some((c) => c.slug === "persistent-damage"
        && c.system.persistent?.damageType === "bleed") ?? false;
}

export const Red = {
    registerHooks() {
        Hooks.on("pf2e.startTurn", (combatant) => {
            if (isWriter()) Red.crimsonTendrils(combatant).catch((e) =>
                console.error("Isaac's Homebrew | Garnet's tendrils failed", e));
        });
    },

    /** Garnet Depth 3. Returns the temporary Hit Points granted, or 0. */
    async crimsonTendrils(combatant) {
        const actor = combatant?.actor;
        const token = combatant?.token?.object;
        if (!actor || !token) return 0;
        const options = new Set(actor.getRollOptions());
        const garnet = [...options].map((o) => /^self:effect:substrate-garnet:(\d+)$/.exec(o)).find(Boolean);
        if (!garnet || Number(garnet[1]) < 3 || !options.has("carapace:intact")) return 0;

        const near = canvas.tokens.placeables.some((other) => other !== token && bleeding(other.actor)
            && canvas.grid.measurePath([token.center, other.center]).distance <= 30);
        if (!near) return 0;

        const amount = Math.floor(actor.level / 2);
        if ((actor.attributes.hp.temp ?? 0) >= amount) return 0;
        await actor.update({ "system.attributes.hp.temp": amount });
        await ChatMessage.create({
            speaker: ChatMessage.getSpeaker({ actor }),
            content: `<p><strong>Crimson Tendrils</strong>: blood within reach feeds ${actor.name} &mdash; `
                + `<strong>${amount}</strong> temporary Hit Points.</p>`,
        });
        return amount;
    },
};

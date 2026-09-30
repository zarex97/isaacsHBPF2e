# The Stargazer's pre-roll features are armed, not prompted

Three Stargazer features act on another creature's d20 **before it is rolled**: *Fortune's Thread*
(*"a creature … is about to roll"*), the free Thread *Chart the Course* grants, and *Speak the Portent*
(*"the creature does not roll"*). Foundry has no such moment — a roll resolves the instant it is clicked.
We have decided these features are **armed in advance**: the Stargazer's player sets a pending effect on
a creature and a kind of roll — *"Guide Kesh's next attack"*, *"Portent on the ogre's next save"* — and
the next matching roll takes it. The reaction, or the Portent, is spent when it fires.

## Considered options

**Prompt on every roll.** Every d20 by a creature in range pauses and asks the Stargazer's player. The
most faithful to *"about to roll"*, and rejected for that fidelity's price: every roll at the table
waits on one player, which is guide §12.1's *"Fortune's Thread eats the table's clock"* made mandatory.

**Only the GM's rolls get a step.** The GM's roll dialog asks *"Stargazer?"* and players arm their own.
Rejected because it splits one feature into two mechanisms depending on who owns the roll.

**Leave it to the table.** Guide v3's own §11.3 answer for the Portent and the free Thread. Rejected by
ruling R5 in #103: the class is being fully implemented, and the arming seam makes both nearly free.

## Rules that follow

- **One reaction arms up to as many creatures as the Thread can affect** (*Widen the Sky*, *Threefold
  Thread*, *Skein of Fates*). It is spent when the first armed roll fires; the others stay armed.
- **An armed Thread expires at the start of the Stargazer's next turn**, when the reaction returns. A
  Thread cannot be armed with no reaction left. *Two Warnings* allows a second; *Chart the Course*'s free
  Threads cost none.
- **An armed Portent never expires** until it is spoken or a new Night Vigil overwrites it.
- **Reactions that come after the event are not armed.** *The Hour Is Not Come*, *The Last Thing You
  See*, *Deja Vu*, *Inevitable* and *Second Chance at Fate* trigger on something that has already
  happened, so they are a button on a chat card, offered when the trigger happens and applied after the
  fact.

## Consequences

- **The Stargazer chooses before the roll, not after seeing what it is for.** Guide §4.4 sells *Chart
  the Course* on choosing *"the roll after you see what it is for"*. Arming trades that away for a table
  that never waits. The standing policy §12.1 already recommends — *"I Snarl the first attack against
  Kesh each round"* — is what arming is.
- **The pre-roll seam is phase 0's spike (#104).** The armed effect has to land on the roll before it
  resolves — a circumstance modifier for a Thread, a replaced die for the Portent — which the Saint's
  `scripts/roll-rewrites/` helpers cannot do, because they see the die after the fact.
- **Snarl's saving-throw restriction is enforced at arming time**, by the roll kinds offered, as well as
  by the modifier's selectors.

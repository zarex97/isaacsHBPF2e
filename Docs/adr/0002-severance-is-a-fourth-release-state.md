# Severance is a fourth release state

`releaseState` is set in one place and only ever to `sealed`, `released` or `full`; Severance lives
apart, as a `severanceBegan` flag on an effect rather than a state on the actor. We have decided the
release ladder is **four states, strictly linear** — `sealed → released → full → severance` — with
each rung entered from the one below it. The ladder models Sealed, Shikai, Bankai and Final Getsuga
Tenshō, adapted across all three Lineages.

## Consequences

- Severance is entered from **Full Release**, not from Released. `content/soulbound-feats/final-release.json`
  currently requires only that "your spirit weapon is in its released form", which would permit
  skipping Bankai; that requirement is wrong and must be rewritten.
- The naming stays three-way and should not be collapsed: **Final Release** is the 20th-level feat,
  **Severance** is the state it grants, and the **Severing Art** is the one irreversible attack that
  ends it. The feat's own flavour — "your character never calls it Final Release" — only works while
  the feat and the state have different names.
- Severance is feat-gated at 20th level and once per week, so most characters never reach a fourth
  state even though every Spirit defines one. The glossary says a Soulbound *may reach* Severance; it
  does not say a Spirit *has* four states.
- `release.mjs`'s `FALLBACK` map and the docstring at `release.mjs:156` both predate this and
  disagree with it in different directions. `module.json` advertises "four-rung release ladders",
  which is now true of the states but was previously counting something else.

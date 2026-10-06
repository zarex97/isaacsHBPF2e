/**
 * The rider engine's own module id.
 *
 * Everything under `scripts/automation/` is on its way into Isaac's PF2e Automation (phase 2 of the split).
 * Until it moves, it still runs inside this module, so the id is still this one's — receipts, ledgers, the
 * socket channel and the Region types keep working unchanged — but nothing in here reads it from the
 * homebrew's own constant any more.
 */
export const LIB_ID = "isaacs-hb-pf2e";

# isaacsHBPF2e

## Agent skills

### Issue tracker

Issues live as GitHub issues in `zarex97/isaacsHBPF2e`, via the `gh` CLI. See `Docs/agents/issue-tracker.md`.

### Triage labels

The five canonical roles, each label string equal to its name. See `Docs/agents/triage-labels.md`.

### Domain docs

Single-context: one `CONTEXT.md` plus `Docs/adr/` at the repo root. See `Docs/agents/domain.md`.

## Working method

### Refresh the graph before reading code

Run `node .gitnexus/run.cjs analyze --index-only` **at the start of a session**, before the first
`impact`, `context` or `query`, and again whenever a tool reports the index stale. It is a few seconds
incrementally. An index left behind answers about code that no longer exists — a blast radius was once
reported from an index twenty-seven commits back — and a stale answer is worse than no answer, because
it looks like one.

Then the generated rules below: `impact` before editing, `detect_changes` before committing. Use them
to say what a change reaches, and to say plainly whether anything that worked has stopped working.

### Verifying a clause

Driven live, in world `pf`, through the **Claude-in-Chrome extension** on the profile signed in as
`zarexlibertad@gmail.com` — not a browser a script started, which has no extension in it. The rig, the
traps and what a ✅ owes are in `Docs/tools/live-verification.md`; the reasoning behind the driver is
`Docs/adr/0003-live-verification-runs-through-the-browser-extension.md`.

<!-- gitnexus:start -->
# GitNexus — Code Intelligence

This project is indexed by GitNexus as **isaacsHBPF2e** (3132 symbols, 6461 relationships, 209 execution flows).

> Index stale? Run `node .gitnexus/run.cjs analyze --index-only` from the project root — it auto-selects an available runner. No `.gitnexus/run.cjs` yet? Bootstrap with `npx`, `bunx`, or `pnpm dlx` — e.g. `bunx gitnexus@latest analyze` (npm 11 npx crash; #1939).

## Always Do

- **MUST run impact before editing.** Use `impact({target: "symbolName", direction: "upstream"})` or `node .gitnexus/run.cjs impact "symbolName" --direction upstream --repo .`; report callers, processes, and risk. Never substitute grep for graph analysis.
- **MUST analyze graph changes before committing.** Use `detect_changes({scope: "all"})` (MCP) or `node .gitnexus/run.cjs detect-changes --scope all --repo .` (CLI fallback). `partial: true` or `truncated: true` is not a clean check — a zero means unseen, not unaffected; re-run it. For regression review: `detect_changes({scope: "compare", base_ref: "main"})` or `node .gitnexus/run.cjs detect-changes --scope compare --base-ref "main" --repo .`.
- MUST warn on HIGH/CRITICAL `risk` pre-edit; never use `riskSharedAxes` to waive a HIGH/CRITICAL `risk` warning. Compare File/symbol: MCP File omits axes; Graph-RAG expands File.
- **MUST treat `risk: UNKNOWN` as unresolved, not as low.** An empty caller set is not evidence the symbol is unused — it can also mean the callers are not resolvable by the index (plain-object property access, dynamic dispatch, cross-language calls). `impact` pairs `UNKNOWN` with a `riskNote` saying so. Confirm with a text search before treating the symbol as safe to change or delete; do not proceed on the strength of a zero.
- **MUST use `query({search_query: "concept"})` for concepts/flows, `context({name: "symbolName"})` for a named symbol, or `impact` for blast radius, on read-only callers, dependencies, imports, or execution flow.** Graph first; text search only for empty/`UNKNOWN`/literals.
- For security review, `explain({target: "fileOrSymbol"})` lists taint findings (source→sink flows; needs `analyze --pdg`).

## Never Do

- NEVER edit a function, class, or method before MCP/CLI impact analysis.
- NEVER ignore HIGH or CRITICAL risk warnings from impact analysis, and never read `UNKNOWN` as an all-clear — it means the walk could not answer, which is the one verdict that requires confirming by other means.
- NEVER rename symbols with find-and-replace — use `rename` which understands the call graph.
- NEVER commit before MCP/CLI graph change analysis.

## Resources

| Resource | Use for |
| --- | --- |
| `gitnexus://repo/isaacsHBPF2e/context` | Codebase overview, check index freshness |
| `gitnexus://repo/isaacsHBPF2e/clusters` | All functional areas |
| `gitnexus://repo/isaacsHBPF2e/processes` | All execution flows |
| `gitnexus://repo/isaacsHBPF2e/process/{name}` | Step-by-step execution trace |

## CLI

| Task | Read this skill file |
| --- | --- |
| Understand architecture / "How does X work?" | `.claude/skills/gitnexus-exploring/SKILL.md` |
| Blast radius / "What breaks if I change X?" | `.claude/skills/gitnexus-impact-analysis/SKILL.md` |
| Trace bugs / "Why is X failing?" | `.claude/skills/gitnexus-debugging/SKILL.md` |
| Rename / extract / split / refactor | `.claude/skills/gitnexus-refactoring/SKILL.md` |
| Tools, resources, schema reference | `.claude/skills/gitnexus-guide/SKILL.md` |
| Index, status, clean, wiki CLI commands | `.claude/skills/gitnexus-cli/SKILL.md` |

<!-- gitnexus:end -->

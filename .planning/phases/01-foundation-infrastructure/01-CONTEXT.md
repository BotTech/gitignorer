# Phase 1: Foundation & Infrastructure - Context

**Gathered:** 2026-04-20
**Status:** Ready for planning

<domain>
## Phase Boundary

Build the core CLI framework that runs in three modes (interactive, non-interactive, agent) with proper validation, I/O separation, and structured output. This is the scaffold — commands like `generate`, `scan`, `list` get their real implementations in later phases. Phase 1 delivers the framework they all plug into.
</domain>

<decisions>
## Implementation Decisions

### Module layout & entry point
- **D-01:** `src/` uses named modules from REQUIREMENTS.md (`cli/`, `parsers/`, `schema/`, `services/`, `formatters/`) plus a `commands/` directory for per-command handler files
- **D-02:** Full layout:
  ```
  src/
    cli/        # Commander setup, TTY detection, mode switching
    commands/   # Per-command handlers (generate.ts, scan.ts, list.ts, etc.)
    parsers/    # Input parsing (JSON stdin, flags → typed objects)
    schema/     # Zod schema definitions for all I/O
    services/   # Business logic (stubs in Phase 1, implementations later)
    formatters/ # Output formatting (human-readable, JSON, NDJSON)
  ```
- **D-03:** Separate entry points: `src/bin.ts` for CLI binary (#!/usr/bin/env node), `src/index.ts` for library exports (programmatic API)

### Command registration pattern
- **D-04:** All 8 commands stubbed now (help, generate, scan, list, search, update, examples, schema). Later-phase commands get stub handlers that print "Not yet implemented"
- **D-05:** Each command in `src/commands/` exports a factory function that returns a configured Commander command object
- **D-06:** Common flags (`--output`, `--input`, `--yes`, `--dry-run`) defined once in a shared module and applied to commands that accept them. Per-command flags defined in the command file

### I/O & mode switching
- **D-07:** Mode resolved once at startup as an enum (INTERACTIVE, NON_INTERACTIVE, AGENT) from TTY state + flags. Commands receive the resolved mode
- **D-08:** Three modes behave as follows:

  | | Interactive (TTY) | Non-interactive (TTY + --yes) | Non-interactive (piped) | Agent |
  |---|---|---|---|---|
  | **UI** | clack prompts + spinners + logs | clack logs/spinners, no prompts | clack (plain fallback), no prompts | No UI, JSON only |
  | **stdout** | nothing (writes file) | nothing (writes file) | nothing (writes file) | JSON result |
  | **stderr** | clack-styled messages | clack-styled messages | clack-styled messages | JSON errors |
  | **Progress** | clack spinner | clack spinner | clack plain fallback | ndjson stream events |
  | **Errors** | clack log.error | clack log.error | clack plain fallback | JSON to stderr |

- **D-09:** `@clack/prompts` used for ALL human-facing output in interactive and non-interactive modes. Clack auto-degrades to plain text when no TTY — single API handles both cases
- **D-10:** Agent mode: `--output json` produces single JSON result at end. `--output ndjson` streams progress events + final result. Errors always JSON to stderr regardless of output format

### Validation & error strategy
- **D-11:** Zod schemas organized by domain in `src/schema/`: `input.ts` (flags, JSON payloads), `output.ts` (response shapes), `errors.ts` (error types + codes). Per-command schemas can extend these
- **D-12:** Each command handler validates its own input using Zod schemas — no middleware validation layer
- **D-13:** Custom error classes (`ValidationError`, `GitError`, `FsError`, `BusinessError`) each carry their exit code (1, 2, 3, 4). A top-level catch in the CLI entry maps errors to the right exit code + formatted output. Commands throw typed errors, the framework handles display

### Claude's Discretion
- Exact file names within each module directory
- How the shared flag module is structured (object, function, etc.)
- Internal structure of the mode resolver
- How clack is configured for no-TTY fallback
- Error class hierarchy details (base class, etc.)
</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Project requirements
- `.planning/REQUIREMENTS.md` — Full v1 requirements with traceability; Phase 1 covers CLI-01..07, INPUT-01..06, OUTPUT-01..08, SAFE-01, SAFE-02, STRUCT-01..03
- `.planning/ROADMAP.md` § Phase 1 — Phase goal, success criteria, and requirement mapping
- `.planning/PROJECT.md` — Core value, constraints, key decisions, technology stack

### Technology decisions
- `CLAUDE.md` — Technology stack table with versions and rationale, naming conventions, constraints
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- None — greenfield project, no existing source code

### Established Patterns
- None yet — Phase 1 establishes the patterns for all subsequent phases

### Integration Points
- All future phases plug into the command framework, mode resolver, and formatter layer built here
</code_context>

<specifics>
## Specific Ideas

- Interactive and non-interactive modes should feel uniform — both use clack UI, the only difference is prompts vs auto-accept defaults
- Agent mode is deliberately unstyled: JSON in, JSON out, no human-readable text on either channel
- "Not yet implemented" stubs make the full CLI surface visible from day one, helping users discover what's coming
</specifics>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope
</deferred>

---

*Phase: 01-foundation-infrastructure*
*Context gathered: 2026-04-20*

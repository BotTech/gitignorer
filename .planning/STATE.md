# Project State

## Project Reference

**Gitignorer** — An agent-first CLI tool that generates intelligent `.gitignore` files by auto-detecting technologies from repository content, intelligently merging with existing ignore rules, and keeping ignore rules up-to-date with evolving technology ecosystems.

**Core Value**: Generate and maintain the right `.gitignore` for your project automatically — detect tech stack, merge intelligently with existing rules, keep templates current with upstream updates, and support both interactive and programmatic usage.

**Current Focus**: Phase 2 - Template Management (Git clone, cache management, and template operations)

## Current Position

**Phase**: Phase 2 - Template Management
**Plan**: TBD
**Status**: Not started
**Progress**: ▱▱▱ 0%

## Performance Metrics

- **Phases Completed**: 1/4
- **Plans Completed**: 4/12
- **Requirements Mapped**: 65/65 (100%)
- **V1 Requirements Complete**: 23/65 (35%)

## Accumulated Context

### Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Three execution modes | Interactive (default), Non-Interactive (--yes), Agent (--input json) | Implemented via TTY detection + flags |
| Git clone via simple-git | No API rate limits, public repo access | Hard fail on errors |
| Cache via env-paths | Cross-platform, XDG compliant | Stores templates in standard location |
| Smart merge with markers | Preserves custom rules during updates | Template markers identify rule sources |
| Separated I/O channels | stdout for data, stderr for messages | Never mix channels |
| Schema-driven validation | Zod schemas define all I/O | Single source of truth |
| Named modules only | Avoids generic utils/ | cache/, git/, scanner/, merger/ |

### Technical Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **CLI Framework**: Commander.js ^13.0.0
- **Interactive UI**: @clack/prompts ^0.9.0
- **Git Operations**: simple-git ^3.27.0
- **Cache Storage**: env-paths ^4.0.0
- **Fuzzy Search**: fuse.js ^8.0.0
- **Validation**: zod ^4.0.0
- **Streaming**: ndjson ^3.0.0
- **Bundler**: tsdown ^1.0.0

### Constraints

- Agent-first design (all commands support JSON input/output)
- Async I/O throughout (non-blocking for pipe compatibility)
- TTY detection for mode switching
- Hard fail on clone errors
- Named modules only (no utils/)
- Safety: validate all inputs, reject dangerous patterns

## Verification Debt
*Tests from previous phases that could not be verified and should be validated in future phases*

### Phase 1 Deferred Tests
*Cannot test until commands are implemented with actual functionality*

- **Mode Resolution (Agent Mode)** - CLI switches to AGENT mode when --input json flag provided
  - Status: Deferred to Phase 2 (when `list` command implemented)
  - Test: Run command with `--input json` and verify structured input/output behavior

- **Structured Output (JSON/NDJSON)** - Commands support --output json and --output ndjson flags
  - Status: Deferred to Phase 2
  - Test: Run `list --output json` and verify valid JSON output to stdout

- **Input Validation** - Reject dangerous patterns (path traversal, control chars, query injection)
  - Status: Deferred to Phase 2
  - Test: Try `list "../../../etc"` and verify ValidationError thrown

- **Piped JSON Input** - CLI accepts JSON input via stdin without blocking
  - Status: Deferred to Phase 2
  - Test: Pipe JSON payload to command and verify it processes correctly

- **stdout/stderr Separation** - Data to stdout, messages to stderr
  - Status: Deferred to Phase 2
  - Test: Run command and observe channels are not mixed

- **Dry Run Flag** - Commands support --dry-run flag for preview
  - Status: Deferred to Phase 2+
  - Test: Run with `--dry-run` and verify preview shown, no changes made

- **Yes Flag** - Commands support --yes flag to skip confirmations
  - Status: Deferred to Phase 2+
  - Test: Run with `--yes` and verify no interactive prompts

## Session Continuity

**Last Session**: 2026-04-24 - Phase 1 execution complete
**Current Session**: 2026-04-24 - Phase 1 complete, ready to plan Phase 2

**Next Action**: `/gsd-plan-phase 2` to create Phase 2 plans

---
*State initialized: 2026-04-19*

# Phase 1: Foundation & Infrastructure - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-20
**Phase:** 01-foundation-infrastructure
**Areas discussed:** Module layout & entry point, Command registration pattern, I/O & mode switching, Validation & error strategy

---

## Module Layout & Entry Point

| Option | Description | Selected |
|--------|-------------|----------|
| Named modules + commands/ | src/cli/, src/parsers/, src/schema/, src/services/, src/formatters/, src/commands/ | ✓ |
| Strict named modules only | Commands live inside cli/ alongside Commander registration | |
| Hybrid (core + commands) | src/core/, src/commands/, src/shared/ | |

**User's choice:** Named modules + commands/ — aligns with REQUIREMENTS.md STRUCT-03 plus a commands directory for per-command handlers. Initially considered hybrid but rejected adding core/ and shared/ as unnecessary deviation.

**Notes:** User wanted to preserve the named modules from requirements exactly, with commands/ as an addition rather than a replacement structure.

| Option | Description | Selected |
|--------|-------------|----------|
| Separate bin.ts + index.ts | bin.ts for CLI entry, index.ts for library exports | ✓ |
| Single index.ts | Detects main module, handles both CLI and library | |

**User's choice:** Separate entry points — clean separation between importable library and CLI binary.

---

## Command Registration Pattern

| Option | Description | Selected |
|--------|-------------|----------|
| Stub all 8 commands now | Full CLI surface visible from day one, later phases fill in implementations | ✓ |
| Phase 1 commands only | Only register help, examples, schema | |

**User's choice:** Stub all 8 commands — makes the full CLI discoverable immediately.

| Option | Description | Selected |
|--------|-------------|----------|
| Factory functions | Each command file exports a function returning a configured Commander command | ✓ |
| Descriptor objects + registrar | Commands export plain objects, central registrar builds Commander commands | |

**User's choice:** Factory functions — clean separation, easy to test.

| Option | Description | Selected |
|--------|-------------|----------|
| Shared common flags | --output, --input, --yes, --dry-run defined once, applied to multiple commands | ✓ |
| Per-command flag definitions | Every command defines all its own flags independently | |

**User's choice:** Shared common flags — avoids duplication across commands.

---

## I/O & Mode Switching

| Option | Description | Selected |
|--------|-------------|----------|
| Startup mode resolution | Mode enum resolved once at startup from TTY + flags, commands receive it | ✓ |
| Ad-hoc per-feature checks | Each behavior checks its own condition (isTTY, has --yes, etc.) | |

**User's choice:** Startup mode resolution — single resolution point, easy to reason about.

| Option | Description | Selected |
|--------|-------------|----------|
| Clack with graceful fallback | Use clack API throughout, let it degrade to plain text when no TTY | ✓ |
| Plain text when no TTY | Switch to plain stderr lines when no TTY detected | |
| Silent on success (no TTY) | No output unless error, exit code tells the story | |

**User's choice:** Clack with graceful fallback — single API handles both TTY and no-TTY cases. User raised that spinners won't render without TTY, leading to this decision.

| Option | Description | Selected |
|--------|-------------|----------|
| JSON = single result, NDJSON = stream | --output json is one blob at end, --output ndjson streams progress events | ✓ |
| Always single result | NDJSON only for large data sets, not for progress | |

**User's choice:** JSON for single results, NDJSON for streaming — gives agents flexibility to choose based on their needs.

**Notes:** User emphasized that interactive and non-interactive should feel uniform — both use clack UI throughout. Agent mode is deliberately JSON-only on both channels. Interactive errors should maintain clack styling rather than dropping to plain text.

---

## Validation & Error Strategy

| Option | Description | Selected |
|--------|-------------|----------|
| Domain-based schema files | src/schema/input.ts, output.ts, errors.ts — organized by concern | ✓ |
| Per-command schema files | One file per command with that command's input/output schemas | |
| Single schema file | All schemas in one file | |

**User's choice:** Domain-based schema files — clean, discoverable organization.

| Option | Description | Selected |
|--------|-------------|----------|
| Per-command validation | Each command handler validates its own input using Zod schemas | ✓ |
| Middleware validation layer | Shared layer validates before commands run | |

**User's choice:** Per-command validation — simpler, each command owns its validation.

| Option | Description | Selected |
|--------|-------------|----------|
| Custom error classes + top-level catch | Typed errors with exit codes, framework handles display | ✓ |
| Result objects, no throwing | Commands return { ok, data, error }, caller checks | |

**User's choice:** Custom error classes with top-level catch — commands throw typed errors, the framework maps them to exit codes and formatted output.

---

## Claude's Discretion

- Exact file names within module directories
- Shared flag module internal structure
- Mode resolver implementation details
- Clack no-TTY configuration
- Error class hierarchy details

## Deferred Ideas

None — discussion stayed within phase scope

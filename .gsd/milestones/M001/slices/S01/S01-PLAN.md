# S01: Foundation Infrastructure

**Goal:** Establish core CLI infrastructure with mode detection, error handling, and project configuration.
**Demo:** Establish core CLI infrastructure with mode detection, error handling, and project configuration.

## Must-Haves


## Tasks

- [x] **T01: 01-foundation-infrastructure 01**
  - Establish core CLI infrastructure with mode detection, error handling, and project configuration.

Purpose: This plan creates the foundational infrastructure that enables three-mode execution (interactive/non-interactive/agent) with proper error handling and exit codes. All subsequent commands depend on this foundation.

Output: Working CLI binary that can be invoked, detects execution mode including non-TTY/piped input (per CLI-05), handles errors with structured exit codes, and supports non-blocking I/O.
- [x] **T02: 01-foundation-infrastructure 02**
  - Implement validation layer, custom error classes, and input parsers with security refinements.

Purpose: This plan creates the schema validation foundation that all commands use to validate inputs. Custom error classes enable structured error output with proper exit codes. Input parsers handle JSON from stdin and flag values.

Output: Zod schemas for all I/O, custom error classes with exit codes 1-4, async stdin parser, flag parser with validation.
- [x] **T03: 01-foundation-infrastructure 03**
  - Implement Commander.js program, all 8 command factories (per D-04), and library exports.

Purpose: This plan completes the CLI framework by wiring together all components. All 8 commands are registered with stub implementations per D-04, common flags are applied, and the program can be invoked and tested.

Output: Fully functional CLI framework with 8 stub commands (help, generate, scan, list, search, update, examples, schema), proper I/O separation, and programmatic API exports.
- [x] **T04: 01-foundation-infrastructure 04**
  - Create output formatters and wire them to commands for three-mode output support.

Purpose: This plan creates the formatter layer that enables human-readable, JSON, and NDJSON output per CONTEXT.md decisions D-08, D-09, D-10. Formatters are imported and used by command factories to replace console.log stubs.

Output: Four formatter modules (human, json, ndjson, dry-run) with exports, commands updated to import and use formatters instead of console.log.

## Files Likely Touched

- `package.json`
- `tsconfig.json`
- `src/cli/mode.ts`
- `src/cli/error-handler.ts`
- `src/bin.ts`
- `src/schema/input.ts`
- `src/schema/output.ts`
- `src/schema/errors.ts`
- `src/parsers/stdin.ts`
- `src/parsers/flags.ts`
- `src/cli/program.ts`
- `src/cli/flags.ts`
- `src/commands/generate.ts`
- `src/commands/scan.ts`
- `src/commands/list.ts`
- `src/commands/search.ts`
- `src/commands/update.ts`
- `src/commands/examples.ts`
- `src/commands/schema.ts`
- `src/commands/help.ts`
- `src/index.ts`
- `src/formatters/human.ts`
- `src/formatters/json.ts`
- `src/formatters/ndjson.ts`
- `src/formatters/dry-run.ts`
- `src/commands/generate.ts`
- `src/commands/scan.ts`
- `src/commands/list.ts`
- `src/commands/search.ts`
- `src/commands/update.ts`

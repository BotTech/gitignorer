# T03: 01-foundation-infrastructure 03

**Slice:** S01 — **Milestone:** M001

## Description

Implement Commander.js program, all 8 command factories (per D-04), and library exports.

Purpose: This plan completes the CLI framework by wiring together all components. All 8 commands are registered with stub implementations per D-04, common flags are applied, and the program can be invoked and tested.

Output: Fully functional CLI framework with 8 stub commands (help, generate, scan, list, search, update, examples, schema), proper I/O separation, and programmatic API exports.

## Must-Haves

- [ ] "User can invoke `gitignorer help` or `gitignorer --help` and see usage information"
- [ ] "CLI detects TTY and automatically switches between interactive/non-interactive modes"
- [ ] "User can run commands with `--input json` for structured input and `--output json|ndjson|stdout` for structured output"
- [ ] "Data writes to stdout and messages write to stderr (channels never mixed)"
- [ ] "All 8 commands registered with stub implementations (per D-04: help, generate, scan, list, search, update, examples, schema)"

## Files

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

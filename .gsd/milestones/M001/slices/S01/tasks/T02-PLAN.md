# T02: 01-foundation-infrastructure 02

**Slice:** S01 — **Milestone:** M001

## Description

Implement validation layer, custom error classes, and input parsers with security refinements.

Purpose: This plan creates the schema validation foundation that all commands use to validate inputs. Custom error classes enable structured error output with proper exit codes. Input parsers handle JSON from stdin and flag values.

Output: Zod schemas for all I/O, custom error classes with exit codes 1-4, async stdin parser, flag parser with validation.

## Must-Haves

- [ ] "Invalid inputs are rejected with clear error messages before execution"
- [ ] "Dangerous patterns (path traversal, control chars, query injection) are blocked with specific error messages"
- [ ] "CLI accepts `--input json` flag for structured JSON input"
- [ ] "CLI accepts JSON payload via stdin without hanging"
- [ ] "CLI accepts `--output json|ndjson|stdout` flags for output format control"

## Files

- `src/schema/input.ts`
- `src/schema/output.ts`
- `src/schema/errors.ts`
- `src/parsers/stdin.ts`
- `src/parsers/flags.ts`

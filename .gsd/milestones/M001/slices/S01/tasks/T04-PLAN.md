# T04: 01-foundation-infrastructure 04

**Slice:** S01 — **Milestone:** M001

## Description

Create output formatters and wire them to commands for three-mode output support.

Purpose: This plan creates the formatter layer that enables human-readable, JSON, and NDJSON output per CONTEXT.md decisions D-08, D-09, D-10. Formatters are imported and used by command factories to replace console.log stubs.

Output: Four formatter modules (human, json, ndjson, dry-run) with exports, commands updated to import and use formatters instead of console.log.

## Must-Haves

- [ ] "Commands use formatters for output instead of console.log"
- [ ] "Human formatter uses @clack/prompts for styled output"
- [ ] "JSON formatters provide structured data for agent mode"
- [ ] "NDJSON formatter streams progress events"
- [ ] "Dry-run formatter shows preview without writing"

## Files

- `src/formatters/human.ts`
- `src/formatters/json.ts`
- `src/formatters/ndjson.ts`
- `src/formatters/dry-run.ts`
- `src/commands/generate.ts`
- `src/commands/scan.ts`
- `src/commands/list.ts`
- `src/commands/search.ts`
- `src/commands/update.ts`

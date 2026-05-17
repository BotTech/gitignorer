# T01: 01-foundation-infrastructure 01

**Slice:** S01 — **Milestone:** M001

## Description

Establish core CLI infrastructure with mode detection, error handling, and project configuration.

Purpose: This plan creates the foundational infrastructure that enables three-mode execution (interactive/non-interactive/agent) with proper error handling and exit codes. All subsequent commands depend on this foundation.

Output: Working CLI binary that can be invoked, detects execution mode including non-TTY/piped input (per CLI-05), handles errors with structured exit codes, and supports non-blocking I/O.

## Must-Haves

- [ ] "User can invoke CLI with `gitignorer` command"
- [ ] "CLI detects TTY and automatically switches between interactive/non-interactive modes"
- [ ] "CLI detects non-TTY (piped input) and disables interactivity (per CLI-05)"
- [ ] "CLI supports agent mode via `--input json` flag"
- [ ] "All I/O operations are non-blocking for pipe compatibility"
- [ ] "CLI includes exit codes: 1 (validation), 2 (git), 3 (fs), 4 (business logic)"

## Files

- `package.json`
- `tsconfig.json`
- `src/cli/mode.ts`
- `src/cli/error-handler.ts`
- `src/bin.ts`

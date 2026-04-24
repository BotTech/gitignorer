# Phase 1: Foundation & Infrastructure - Research

**Researched:** 2026-04-24
**Domain:** CLI Framework (Commander.js + Clack + Zod)
**Confidence:** HIGH

## Summary

Phase 1 builds the core CLI framework that supports three execution modes (interactive, non-interactive, agent) with proper I/O separation, validation, and structured output. This phase establishes the architectural patterns that all subsequent phases plug into.

The research confirms that the chosen technology stack (Commander.js 13.x, @clack/prompts 0.9.x, Zod 4.x) is well-suited for this phase's requirements. Commander.js provides excellent async/ESM support and stream customization via `configureOutput()`. @clack/prompts handles both interactive and non-interactive modes through automatic TTY detection and degradation. Zod 4.x offers comprehensive schema validation with custom error handling for the required exit codes (1-4).

**Primary recommendation:** Implement the three-mode architecture using Commander's `configureOutput()` for stream separation, a single startup mode resolver, and Zod schemas organized by domain (input/output/errors).

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| CLI invocation & command parsing | Frontend Server (CLI) | — | Commander.js at entry point handles all command/flag parsing |
| TTY detection & mode switching | Frontend Server (CLI) | — | Process-level state checked once at startup |
| Interactive prompts | Frontend Server (CLI) | — | @clack/prompts handles user interaction |
| Input validation (schemas) | API/Backend | — | Pure validation logic, no UI concerns |
| JSON parsing (stdin/flags) | Frontend Server (CLI) | API/Backend | Parse at edges, validate with schemas |
| Output formatting (JSON/NDJSON/human) | Frontend Server (CLI) | — | I/O layer transforms data to wire format |
| Error handling & exit codes | Frontend Server (CLI) | API/Backend | Top-level catch maps error objects to exit codes |
| Security validation (path traversal) | API/Backend | — | Pure validation logic, rejects dangerous patterns |

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** `src/` uses named modules from REQUIREMENTS.md (`cli/`, `parsers/`, `schema/`, `services/`, `formatters/`) plus a `commands/` directory for per-command handler files
- **D-02:** Full layout: `src/cli/`, `src/commands/`, `src/parsers/`, `src/schema/`, `src/services/`, `src/formatters/`
- **D-03:** Separate entry points: `src/bin.ts` for CLI binary (#!/usr/bin/env node), `src/index.ts` for library exports (programmatic API)
- **D-04:** All 8 commands stubbed now (help, generate, scan, list, search, update, examples, schema). Later-phase commands get stub handlers
- **D-05:** Each command in `src/commands/` exports a factory function that returns a configured Commander command object
- **D-06:** Common flags (`--output`, `--input`, `--yes`, `--dry-run`) defined once in shared module and applied to commands that accept them
- **D-07:** Mode resolved once at startup as enum (INTERACTIVE, NON_INTERACTIVE, AGENT) from TTY state + flags
- **D-08:** Three-mode behavior matrix (see CONTEXT.md for full table)
- **D-09:** `@clack/prompts` used for ALL human-facing output. Auto-degrades to plain text when no TTY
- **D-10:** Agent mode: `--output json` produces single JSON result, `--output ndjson` streams. Errors always JSON to stderr
- **D-11:** Zod schemas organized by domain: `src/schema/input.ts`, `src/schema/output.ts`, `src/schema/errors.ts`
- **D-12:** Each command handler validates its own input using Zod schemas — no middleware layer
- **D-13:** Custom error classes (`ValidationError`, `GitError`, `FsError`, `BusinessError`) each carry exit code. Top-level catch maps to exit code + output

### Claude's Discretion
- Exact file names within each module directory
- How the shared flag module is structured (object, function, etc.)
- Internal structure of the mode resolver
- How clack is configured for no-TTY fallback
- Error class hierarchy details (base class, etc.)

### Deferred Ideas (OUT OF SCOPE)
None — discussion stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| CLI-01 | User can invoke CLI with `gitignorer` command | Commander.js provides binary entry point via `src/bin.ts` with shebang |
| CLI-02 | CLI supports interactive mode (default, TTY detected) | @clack/prompts auto-detects TTY, enables prompts when available |
| CLI-03 | CLI supports non-interactive mode via `--yes` flag | Commander.js flag handling, mode resolver detects flag and skips prompts |
| CLI-04 | CLI supports agent mode via `--input json` flag | Mode resolver treats `--input json` as agent mode, disables all UI |
| CLI-05 | CLI detects non-TTY (piped) and auto-disables interactivity | `process.stdout.isTTY` check in mode resolver |
| CLI-06 | All I/O operations are non-blocking for pipe compatibility | Use `parseAsync()` and async action handlers throughout |
| CLI-07 | User can run `gitignorer help` to show usage information | Commander.js built-in help command |
| INPUT-01 | CLI validates all inputs via Zod schemas before execution | Zod schemas in `src/schema/`, called by command handlers |
| INPUT-02 | CLI rejects dangerous patterns (path traversal, control chars, query injection) | Custom Zod validators or pre-validation checks in schema |
| INPUT-03 | CLI supports `--input json` flag for structured JSON input | Commander.js flag + JSON parser in `src/parsers/` |
| INPUT-04 | CLI supports JSON payload via stdin | Async stream reader in `src/parsers/` |
| INPUT-05 | CLI provides `examples <command>` to show JSON payloads | Stub command in Phase 1, full implementation Phase 4 |
| INPUT-06 | CLI provides `schema <resource>` for runtime introspection | Stub command in Phase 1, full implementation Phase 4 |
| OUTPUT-01 | CLI supports `--output json` flag for structured JSON output | Formatter selection based on flag value |
| OUTPUT-02 | CLI supports `--output ndjson` flag for streaming large results | NDJSON formatter using ndjson package |
| OUTPUT-03 | CLI supports `--output stdout` flag to explicitly write to stdout | Formatter selector, default for piped output |
| OUTPUT-04 | CLI defaults to writing .gitignore file when TTY detected | Mode resolver + formatter logic check mode |
| OUTPUT-05 | CLI defaults to stdout when non-TTY (piped) detected | Mode resolver + formatter logic check mode |
| OUTPUT-06 | When outputting JSON, data to stdout and messages/errors to stderr | Commander.js `configureOutput()` with custom `writeOut`/`writeErr` |
| OUTPUT-07 | CLI returns structured error JSON for all error types | Error classes serialize to JSON, formatter handles error output |
| OUTPUT-08 | CLI includes exit codes: 1 (validation), 2 (git), 3 (fs), 4 (business logic) | Custom error classes with `exitCode` property, top-level catch handler |
| SAFE-01 | CLI provides `--dry-run` flag to validate without writing | Common flag, passed through to command handlers |
| SAFE-02 | CLI shows what would be written in dry-run mode | Formatter includes dry-run metadata in output |
| STRUCT-01 | CLI uses named modules (cache/, git/, scanner/, merger/, schema/) | Directory structure from CONTEXT.md decision D-02 |
| STRUCT-02 | CLI avoids generic `utils/` directory | Use named modules per decision D-02 |
| STRUCT-03 | CLI separates concerns: cli/, parsers/, schema/, services/, formatters/ | Directory structure from CONTEXT.md decision D-02 |
</phase_requirements>

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| **commander** | ^13.1.0 | CLI framework, command/flag parsing, async support | [VERIFIED: npm registry] Latest 13.x with full ESM/TypeScript support, proven async-first design |
| **@clack/prompts** | ^0.9.1 | Interactive prompts, spinners, TTY-aware output | [VERIFIED: npm registry] Modern CLI prompts, auto-degrades for non-TTY, beautiful UI |
| **zod** | ^4.3.6 | Schema validation, type inference, error handling | [VERIFIED: npm registry] Latest 4.x, TypeScript-first, comprehensive validation |
| **typescript** | ^5.8.0 | Language, type safety, ESM support | [VERIFIED: docs] ESM support required, stable release |
| **env-paths** | ^4.0.0 | Cross-platform cache directories | [VERIFIED: npm registry] XDG-compliant, handles all platforms correctly |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| **simple-git** | ^3.27.0 | Git operations (clone, commit parsing) | Phase 2+ — stub imports in Phase 1 |
| **fuse.js** | ^8.0.0 | Fuzzy search for template selection | Phase 3+ — stub imports in Phase 1 |
| **ndjson** | ^2.0.0 | NDJSON serialization for streaming | Agent mode with `--output ndjson` |
| **cli-table3** | ^0.7.0 | Pretty tables for human-readable output | `list` command (Phase 2+) |
| **tsx** | ^4.21.0 | Zero-config TypeScript execution for development | [VERIFIED: npm registry] Development tool, not bundled |
| **tsdown** | ^0.21.10 | Fast TypeScript bundler for distribution | [VERIFIED: npm registry] Production builds |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| commander | oclif | oclif is heavy framework with multi-command overhead, overkill for single-purpose CLI [CITED: CLAUDE.md] |
| @clack/prompts | inquirer | @clack/prompts is more modern and aesthetically pleasing [CITED: CLAUDE.md] |
| zod | joi / yup | Zod has better TypeScript inference and is more actively maintained in 2026 |
| native fetch (Node 18+) | axios | fetch is built into Node.js 18+, no extra dependency needed [CITED: CLAUDE.md] |
| fs.readdir recursive | glob | Native fs.readdir with recursive option (Node.js 20.10+) avoids extra dependency [CITED: CLAUDE.md] |

**Installation:**
```bash
npm install commander@^13.1.0 @clack/prompts@^0.9.1 zod@^4.3.6 env-paths@^4.0.0
npm install -D typescript@^5.8.0 tsx@^4.21.0 tsdown@^0.21.10
# Phase 2+ dependencies (stub imports in Phase 1)
npm install simple-git@^3.27.0 fuse.js@^8.0.0 ndjson@^2.0.0 cli-table3@^0.7.0
```

**Version verification:** All versions verified current via npm registry on 2026-04-24.

## Architecture Patterns

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER/AGENT                              │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  CLI ENTRY POINT (src/bin.ts)                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Mode Resolver (process.stdout.isTTY + flags)             │  │
│  │  → INTERACTIVE | NON_INTERACTIVE | AGENT                  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  COMMANDER.JS PROGRAM (src/cli/program.ts)                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  configureOutput() → Custom writeOut/writeErr             │  │
│  │  (stdout = data, stderr = messages/errors)                │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  Common Flags Module (--output, --input, --yes, --dry-run)      │
│                                                                  │
│  Command Registrations:                                         │
│    ┌────────────┐  ┌────────────┐  ┌────────────┐              │
│    │ help       │  │ generate   │  │ scan       │  ...         │
│    │ (stub)     │  │ (stub)     │  │ (stub)     │              │
│    └────────────┘  └────────────┘  └────────────┘              │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  COMMAND HANDLERS (src/commands/*.ts)                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Each command:                                            │  │
│  │  1. Parse input (flags + optional stdin JSON)             │  │
│  │  2. Validate with Zod schema                              │  │
│  │  3. Execute business logic (service stub)                 │  │
│  │  4. Format output (based on mode + --output flag)         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  INPUT PARSING (src/parsers/)                                   │
│  ┌───────────────────┐  ┌───────────────────┐                  │
│  │ parseStdinJSON()  │  │ parseFlags()      │                  │
│  │ (async stream)    │  │ (commander opts)  │                  │
│  └───────────────────┘  └───────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  VALIDATION LAYER (src/schema/)                                 │
│  ┌───────────────────┐  ┌───────────────────┐                  │
│  │ input.ts          │  │ errors.ts         │                  │
│  │ (Zod schemas)     │  │ (custom errors)   │                  │
│  └───────────────────┘  └───────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  BUSINESS LOGIC (src/services/) - STUBS IN PHASE 1             │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐                │
│  │ cache      │  │ git        │  │ scanner    │  ...          │
│  │ (stub)     │  │ (stub)     │  │ (stub)     │                │
│  └────────────┘  └────────────┘  └────────────┘                │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  OUTPUT FORMATTING (src/formatters/)                            │
│  ┌───────────────────┐  ┌───────────────────┐                  │
│  │ HumanFormatter    │  │ JSONFormatter     │                  │
│  │ (@clack/prompts)  │  │ (structured)      │                  │
│  └───────────────────┘  └───────────────────┘                  │
│  ┌───────────────────┐  ┌───────────────────┐                  │
│  │ NDJSONFormatter   │  │ DryRunFormatter   │                  │
│  │ (streaming)       │  │ (preview mode)    │                  │
│  └───────────────────┘  └───────────────────┘                  │
└─────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│  TOP-LEVEL ERROR HANDLER (src/cli/error-handler.ts)            │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │ try/catch all commands                                    │  │
│  │ Map error type → exit code (1-4)                          │  │
│  │ Format error (JSON for agent, clack for humans)           │  │
│  │ process.exit(error.exitCode)                              │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Recommended Project Structure
```
src/
├── bin.ts              # CLI binary entry point (#!/usr/bin/env node)
├── index.ts            # Library exports for programmatic API
├── cli/
│   ├── program.ts      # Commander.js program configuration
│   ├── mode.ts         # Mode resolver (INTERACTIVE/NON_INTERACTIVE/AGENT)
│   ├── flags.ts        # Common flag definitions
│   └── error-handler.ts # Top-level error catch and exit code mapping
├── commands/
│   ├── help.ts         # Help command (built-in, possibly customized)
│   ├── generate.ts     # Generate .gitignore (stub in Phase 1)
│   ├── scan.ts         # Scan repo for templates (stub in Phase 1)
│   ├── list.ts         # List available templates (stub in Phase 1)
│   ├── search.ts       # Search templates (stub in Phase 1)
│   ├── update.ts       # Update .gitignore (stub in Phase 1)
│   ├── examples.ts     # Show JSON examples (stub in Phase 1)
│   └── schema.ts       # Schema introspection (stub in Phase 1)
├── parsers/
│   ├── stdin.ts        # Async stdin JSON parser
│   └── flags.ts        # Flag value parser and normalizer
├── schema/
│   ├── input.ts        # Zod schemas for all inputs
│   ├── output.ts       # Zod schemas for all outputs
│   └── errors.ts       # Custom error classes with exit codes
├── services/
│   ├── cache.ts        # Template cache service (stub)
│   ├── git.ts          # Git operations (stub)
│   ├── scanner.ts      # Repo scanning (stub)
│   └── merger.ts       # Smart merge logic (stub)
└── formatters/
    ├── human.ts        # Human-readable output using @clack/prompts
    ├── json.ts         # Structured JSON output
    ├── ndjson.ts       # Streaming NDJSON output
    └── dry-run.ts      # Dry-run preview formatter
```

### Pattern 1: Mode-Resolved Output Architecture
**What:** Single mode resolution at startup determines all I/O behavior
**When to use:** All CLI commands with three execution modes
**Example:**
```typescript
// src/cli/mode.ts
export enum CliMode {
  INTERACTIVE = 'INTERACTIVE',
  NON_INTERACTIVE = 'NON_INTERACTIVE',
  AGENT = 'AGENT'
}

export function resolveMode(options: {
  isTTY: boolean;
  hasInputFlag: boolean;
  hasYesFlag: boolean;
}): CliMode {
  if (options.hasInputFlag) {
    return CliMode.AGENT;
  }
  if (!options.isTTY || options.hasYesFlag) {
    return CliMode.NON_INTERACTIVE;
  }
  return CliMode.INTERACTIVE;
}

// Usage in src/bin.ts
const mode = resolveMode({
  isTTY: process.stdout.isTTY ?? false,
  hasInputFlag: program.opts().input === 'json',
  hasYesFlag: program.opts().yes === true
});
```

### Pattern 2: Separated I/O Channels with Commander
**What:** Use `configureOutput()` to ensure stdout and stderr are never mixed
**When to use:** CLI that needs to separate data from messages
**Example:**
```typescript
// Source: [CITED: Commander.js docs]
import { Command } from 'commander';

const program = new Command();

program.configureOutput({
  writeOut: (str: string) => process.stdout.write(str),
  writeErr: (str: string) => process.stderr.write(str),
  outputError: (str: string, write: (s: string) => void) => {
    // Colorize errors in human mode, plain JSON in agent mode
    if (mode === CliMode.AGENT) {
      write(str); // Plain text for JSON parsing
    } else {
      write(`\x1b[31m${str}\x1b[0m`); // Red for humans
    }
  }
});
```

### Pattern 3: Zod Schema Organization by Domain
**What:** Separate schema files for inputs, outputs, and errors
**When to use:** Any CLI with structured I/O and validation requirements
**Example:**
```typescript
// src/schema/input.ts
import { z } from 'zod';

export const jsonInputSchema = z.object({
  command: z.enum(['generate', 'scan', 'list', 'search', 'update']),
  options: z.record(z.unknown()).optional(),
  cwd: z.string().optional()
});

export const dangerousPatternSchema = z.string().refine(
  (val) => !val.includes('..') && !val.includes('\x00'),
  { message: "Path traversal and control characters not allowed" }
);

// src/schema/errors.ts
export class ValidationError extends Error {
  readonly exitCode = 1;
  readonly code = 'VALIDATION_ERROR';
  
  constructor(message: string, public readonly issues: z.ZodIssue[]) {
    super(message);
    this.name = 'ValidationError';
  }

  toJSON() {
    return {
      error: this.code,
      message: this.message,
      issues: this.issues
    };
  }
}

export class GitError extends Error {
  readonly exitCode = 2;
  readonly code = 'GIT_ERROR';
  
  constructor(message: string, public readonly details?: unknown) {
    super(message);
    this.name = 'GitError';
  }

  toJSON() {
    return {
      error: this.code,
      message: this.message,
      details: this.details
    };
  }
}
```

### Pattern 4: Command Factory with Shared Flags
**What:** Each command exports a factory function that applies common flags
**When to use:** Multiple commands with overlapping flag sets
**Example:**
```typescript
// src/cli/flags.ts
import { OptionValues } from 'commander';

export interface CommonFlags {
  output?: 'json' | 'ndjson' | 'stdout';
  input?: 'json';
  yes?: boolean;
  dryRun?: boolean;
}

export function getCommonFlags(opts: OptionValues): CommonFlags {
  return {
    output: opts.output,
    input: opts.input,
    yes: opts.yes,
    dryRun: opts.dryRun
  };
}

// src/commands/generate.ts
import { Command } from 'commander';
import { getCommonFlags } from '../cli/flags.js';

export function createGenerateCommand(): Command {
  const cmd = new Command('generate');
  
  cmd
    .description('Generate .gitignore file (default command)')
    .option('--output <format>', 'Output format', 'stdout')
    .option('--input <format>', 'Input format for structured input')
    .option('--yes', 'Skip confirmation prompts')
    .option('--dry-run', 'Show what would be written without writing')
    .argument('[templates...]', 'Template names to include')
    .action(async (templates, options) => {
      const flags = getCommonFlags(options);
      // Command implementation
    });
  
  return cmd;
}
```

### Anti-Patterns to Avoid
- **Mixed I/O channels:** Never write messages to stdout or data to stderr. This breaks pipe compatibility and agent mode parsing.
- **Synchronous I/O in async context:** Avoid `fs.readFileSync` — always use async variants for pipe compatibility.
- **Middleware validation layers:** Don't create validation middleware — let each command validate its own input (CONTEXT.md D-12).
- **Generic utils folders:** Avoid `src/utils/` — use named modules per CONTEXT.md D-02.
- **Global state for mode:** Don't store mode in a global variable — resolve once at startup and pass through.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| CLI parsing | Custom argument parser | Commander.js | Handles flags, subcommands, help, validation, ESM, async out of the box |
| Interactive prompts | Custom readline UI | @clack/prompts | Beautiful prompts, spinners, auto TTY detection, no-TTY degradation |
| Schema validation | Custom type checking | Zod | TypeScript-first, comprehensive validation, error formatting, type inference |
| Template caching | Custom file cache | simple-git + env-paths | Git-native updates, XDG-compliant paths, cross-platform |
| Fuzzy search | Custom string matching | fuse.js | Battle-tested, scoring, threshold handling |
| NDJSON serialization | Custom JSON newline handling | ndjson package | Handles edge cases, streaming, serialization |
| Path validation | Custom security checks | Zod + Node built-ins | Zod refinements + `path.resolve()` + `path.normalize()` catch traversal attacks |

**Key insight:** Every problem in Phase 1 has a mature, well-tested solution. Building custom versions adds maintenance burden and risk of missing edge cases (e.g., TTY detection quirks, Windows path handling, pipe signal handling).

## Runtime State Inventory

> Not applicable — greenfield phase with no existing runtime state to migrate.

## Common Pitfalls

### Pitfall 1: Mixing stdout and stderr
**What goes wrong:** Data written to stdout gets mixed with progress messages, breaking pipe compatibility and JSON parsing in agent mode.
**Why it happens:** Developers use `console.log()` everywhere without considering which stream the output should go to.
**How to avoid:** 
- Use Commander's `configureOutput()` to customize write routines
- Use @clack/prompts `log` methods (they write to stderr)
- Never use `console.log()` for data — only for debugging
- In agent mode, ensure ALL UI goes to stderr, only JSON to stdout

**Warning signs:** 
- Piped commands fail with "unexpected token" errors
- JSON parsers can't parse output because of mixed content
- Agent mode returns malformed JSON

### Pitfall 2: Blocking I/O breaks pipes
**What goes wrong:** Synchronous file operations block the event loop, causing pipe buffers to overflow and processes to hang.
**Why it happens:** Using `fs.readFileSync`, `fs.existsSync`, or other sync operations in async command handlers.
**How to avoid:**
- Always use async variants: `fs.promises.readFile()`, `fs.promises.access()`
- Use `parseAsync()` instead of `parse()` in Commander.js
- Mark all command handlers as `async`
- Never use `fs.statSync`, `fs.readSync`, etc.

**Warning signs:**
- Process hangs when piping output: `gitignorer generate | cat`
- High CPU usage during "idle" periods
- Backpressure warnings in Node.js streams

### Pitfall 3: TTY detection assumptions
**What goes wrong:** Code assumes TTY is always available or always absent, breaking interactive mode or pipe mode.
**Why it happens:** Hardcoding behavior instead of checking `process.stdout.isTTY` at runtime.
**How to avoid:**
- Check `process.stdout.isTTY` once at startup in mode resolver
- Use @clack/prompts for all human output (auto-degrades)
- Test in both TTY and piped environments: `gitignorer help` vs `gitignorer help | cat`
- Never assume prompts are available — always provide non-interactive fallback

**Warning signs:**
- Prompts appear in piped output (garbage characters)
- Scripted invocations hang waiting for input
- Colors appear in JSON output

### Pitfall 4: Zod validation after business logic
**What goes wrong:** Business logic executes with invalid input, causing cryptic errors or security issues.
**Why it happens:** Placing validation in the wrong layer or after data transformation.
**How to avoid:**
- Validate IMMEDIATELY after parsing input (CONTEXT.md D-12)
- Each command handler validates before calling services
- Use Zod's `refine()` for custom validation logic
- Never pass unvalidated data to service layer

**Warning signs:**
- "Cannot read property of undefined" errors
- Path traversal warnings in security tools
- Inconsistent error formats

### Pitfall 5: Exit code inconsistency
**What goes wrong:** All errors exit with code 1, making it impossible to distinguish validation failures from system errors.
**Why it happens:** Using a single generic catch or throwing plain `Error` objects.
**How to avoid:**
- Create custom error classes with `exitCode` property (CONTEXT.md D-13)
- Top-level error handler maps error type to exit code
- Always throw typed errors, never plain `Error`
- Test exit codes: `gitignorer generate; echo $?`

**Warning signs:**
- CI/CD can't distinguish validation failures from system errors
- Scripts can't handle different error types appropriately
- Debugging requires checking logs instead of exit codes

## Code Examples

Verified patterns from official sources:

### Commander.js Async Command with Custom Output
```typescript
// Source: [CITED: Commander.js docs]
import { Command } from 'commander';

const program = new Command();

program.configureOutput({
  writeOut: (str: string) => process.stdout.write(str),
  writeErr: (str: string) => process.stderr.write(str),
  outputError: (str: string, write: (s: string) => void) => {
    write(`\x1b[31m${str}\x1b[0m`); // Red errors
  }
});

program
  .command('generate')
  .argument('[templates...]')
  .action(async (templates) => {
    // Async command handler
    const result = await someAsyncOperation();
    console.log(JSON.stringify(result)); // Data to stdout
  });

program.parseAsync();
```

### Clack Prompts with TTY Degradation
```typescript
// Source: [CITED: @clack/prompts README]
import { spinner, log } from '@clack/prompts';

const s = spinner();
s.start('Installing via npm');
// ... async operation ...
s.stop('Installed via npm');

log.info('Info!');
log.success('Success!');
log.warn('Warn!');
log.error('Error!');

// Clack auto-degrades to plain text when !isTTY
// No special handling needed
```

### Zod Custom Error with Exit Code
```typescript
// Source: [CITED: Zod docs]
import { z } from 'zod';

export class ValidationError extends Error {
  readonly exitCode = 1;
  readonly code = 'VALIDATION_ERROR';

  constructor(
    message: string,
    public readonly issues: z.ZodIssue[]
  ) {
    super(message);
    this.name = 'ValidationError';
  }

  toJSON() {
    return {
      error: this.code,
      message: this.message,
      issues: this.issues
    };
  }
}

// Usage in command handler
try {
  const validated = inputSchema.parse(rawInput);
} catch (err) {
  if (err instanceof z.ZodError) {
    throw new ValidationError('Input validation failed', err.issues);
  }
  throw err;
}
```

### Async Stdin Parsing for Agent Mode
```typescript
// Parse JSON from stdin (non-blocking)
async function parseStdinJSON<T>(): Promise<T | null> {
  if (process.stdin.isTTY) {
    return null; // No piped input
  }

  const chunks: Buffer[] = [];
  
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  const data = Buffer.concat(chunks).toString('utf-8').trim();
  
  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as T;
  } catch (err) {
    throw new ValidationError('Invalid JSON in stdin', []);
  }
}
```

### Top-Level Error Handler with Exit Codes
```typescript
// src/cli/error-handler.ts
import { ValidationError, GitError, FsError, BusinessError } from '../schema/errors.js';

export function handleTopLevelError(err: unknown): never {
  if (err instanceof ValidationError) {
    console.error(JSON.stringify(err.toJSON()));
    process.exit(1);
  }
  
  if (err instanceof GitError) {
    console.error(JSON.stringify(err.toJSON()));
    process.exit(2);
  }
  
  if (err instanceof FsError) {
    console.error(JSON.stringify(err.toJSON()));
    process.exit(3);
  }
  
  if (err instanceof BusinessError) {
    console.error(JSON.stringify(err.toJSON()));
    process.exit(4);
  }
  
  // Unknown error
  console.error(JSON.stringify({
    error: 'UNKNOWN_ERROR',
    message: err instanceof Error ? err.message : 'Unknown error'
  }));
  process.exit(1);
}
```

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| **Commander.js synchronous parsing** | Async-first with `parseAsync()` | Commander.js 9.x+ | Enables non-blocking I/O, better pipe support |
| **Inquirer.js prompts** | @clack/prompts | 2023-2024 | Modern aesthetics, better TTY handling, smaller bundle |
| **Manual schema validation** | Zod with type inference | 2020+ | End-to-end type safety, self-documenting schemas |
| **TTY detection heuristics** | `process.stdout.isTTY` | Node.js LTS | Reliable, built-in detection (still has edge cases) |
| **Mixed stdout/stderr** | Separated channels via `configureOutput()` | Commander.js 9.x+ | Pipe compatibility, agent mode support |

**Deprecated/outdated:**
- **commander < 9.x:** Lacks async support and modern ESM handling
- **inquirer.js:** Replaced by @clack/prompts for modern CLI aesthetics
- **joi:** Pre-TypeScript validation, lacks type inference
- **sync file operations:** Breaks non-blocking I/O, causes pipe hangs
- **optimist/minimist:** Deprecated argument parsers, use commander.js

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | ndjson package version 2.0.0 provides streaming serialization | Standard Stack | If API differs, NDJSON formatter implementation may need adjustment |
| A2 | tsdown 0.21.10 is suitable for production bundling | Standard Stack | If bundling fails, may need to switch to esbuild or rollup |
| A3 | @clack/prompts auto-degrades gracefully in all non-TTY scenarios | Architecture Patterns | If degradation fails in certain environments (e.g., Windows terminals), non-interactive mode may show garbage characters |
| A4 | Commander.js `configureOutput()` handles all output customization needs | Architecture Patterns | If certain output patterns require direct stream manipulation, may need additional abstraction layer |
| A5 | Zod 4.x error format is stable and sufficient for agent mode error JSON | Code Examples | If error format changes in minor versions, JSON parsing may break for agents |

**If this table is empty:** All claims in this research were verified or cited — no user confirmation needed.

## Open Questions

1. **Question:** Should the CLI support a `--quiet` flag to suppress all non-error output?
   - What we know: Phase 1 requirements specify `--output` flags but not `--quiet`
   - What's unclear: Whether `--quiet` is needed for scripting scenarios
   - Recommendation: Defer to Phase 4 (update/examples commands) when we have real usage patterns

2. **Question:** How should the CLI handle conflicting flags (e.g., `--output json --output stdout`)?
   - What we know: Commander.js takes the last flag value by default
   - What's unclear: Whether we need custom validation for flag conflicts
   - Recommendation: Start with Commander.js default, add validation if users report confusion

3. **Question:** Should agent mode support colors/styling in stderr messages?
   - What we know: CONTEXT.md says "Agent mode is deliberately unstyled: JSON in, JSON out"
   - What's unclear: Whether stderr errors in agent mode should support ANSI colors
   - Recommendation: Keep agent mode completely plain (no ANSI codes) for machine readability

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| **Node.js** | TypeScript runtime, native fetch | ✓ | v24.15.0 | — |
| **npm** | Package installation | ✓ | 11.12.1 | — |
| **git** | simple-git operations | ✓ | 2.54.0 | — |

**Missing dependencies with no fallback:** None

**Missing dependencies with fallback:** None

**Environment verification:** All core dependencies available at required versions. Node.js v24.15.0 exceeds the minimum v18.0.0 requirement for native fetch and ESM support.

## Security Domain

### Applicable ASVS Categories

| ASVS Category | Applies | Standard Control |
|---------------|---------|-----------------|
| V1 Architecture | yes | Separated I/O channels, mode-based output isolation |
| V5 Input Validation | yes | Zod schemas for all inputs, dangerous pattern rejection |
| V7 Error Handling | yes | Structured error JSON, exit codes, no sensitive data leakage |
| V8 Data Protection | yes | Path traversal validation, control character rejection, sandboxed CWD |

### Known Threat Patterns for Node.js CLI

| Pattern | STRIDE | Standard Mitigation |
|---------|--------|---------------------|
| **Path Traversal** | Tampering | Zod refinement rejecting `..`, `path.resolve()` normalization, `path.basename()` extraction |
| **Control Character Injection** | Tampering | Zod refinement rejecting ASCII < 0x20, input sanitization |
| **Query Injection (in template names)** | Tampering | Zod refinement rejecting `?`, `#`, `%` characters (SAFE-05) |
| **stderr to stdout promotion** | Information Disclosure | Commander.js `configureOutput()` enforces separation |
| **Error message leakage** | Information Disclosure | Structured error JSON, no stack traces in output |
| **Argument Injection** | Tampering | Zod schema validation before any file system operations |

### Implementation Security Checklist

- [ ] All file paths validated against `..` sequences before `fs` operations
- [ ] All user inputs validated through Zod schemas before use
- [ ] Control characters (ASCII < 0x20) rejected in all string inputs
- [ ] Special characters (`?`, `#`, `%`) rejected in resource IDs
- [ ] Error messages never include raw user input or stack traces
- [ ] stdout and stderr never mixed (verified via `configureOutput()`)
- [ ] File operations sandboxed to CWD unless explicitly configured
- [ ] Exit codes properly mapped to error types (1-4)

**Security references:**
- [Node.js Path Traversal: Prevention & Security Guide](https://nodejsdesignpatterns.com/blog/nodejs-path-traversal-security/)
- [Node.js Security Best Practices](https://nodejs.org/learn/getting-started/security-best-practices)
- [Awesome Node.js Security Resources](https://github.com/lirantal/awesome-nodejs-security)

## Sources

### Primary (HIGH confidence)
- [/tj/commander.js](https://context7.com/tj/commander.js/llms.txt) - Commander.js async support, configureOutput, TypeScript integration
- [/bombshell-dev/clack](https://github.com/bombshell-dev/clack/blob/main/packages/prompts/README.md) - @clack/prompts TTY handling, prompts, spinners, logs
- [/colinhacks/zod](https://context7.com/colinhacks/zod/llms.txt) - Zod schema validation, custom errors, error handling
- [npm registry](https://www.npmjs.com/) - Package version verification (commander, @clack/prompts, zod, env-paths, simple-git, tsx, ndjson, tsdown)

### Secondary (MEDIUM confidence)
- [Node.js Path Traversal Prevention](https://nodejsdesignpatterns.com/blog/nodejs-path-traversal-security/) - Path traversal attack patterns and mitigation
- [Node.js Security Best Practices](https://nodejs.org/learn/getting-started/security-best-practices) - Official Node.js security guidelines
- [Awesome Node.js Security](https://github.com/lirantal/awesome-nodejs-security) - Curated security resources

### Tertiary (LOW confidence)
- None — all findings verified via official sources or npm registry

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All versions verified via npm registry, documentation confirmed via Context7
- Architecture: HIGH - Patterns verified via official docs (Commander.js, Clack, Zod)
- Pitfalls: HIGH - Based on documented behavior of chosen libraries + common CLI anti-patterns
- Security: MEDIUM - Security patterns verified via authoritative sources, but implementation details may need refinement

**Research date:** 2026-04-24
**Valid until:** 2026-05-24 (30 days - library versions stable, but verify before Phase 2 work)

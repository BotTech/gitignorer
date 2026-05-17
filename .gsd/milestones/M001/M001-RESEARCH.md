# Research Summary

## Overview

Research conducted for **Gitignorer** — an agent-first CLI tool that generates intelligent `.gitignore` files by auto-detecting technologies from repository content. The CLI serves both humans (interactive mode with @clack/prompts) and AI agents (structured JSON input/output).

**Key Finding:** Agent-first CLI design requires three distinct execution modes:
1. **Interactive** (default) — @clack/prompts for fuzzy search template selection
2. **Non-Interactive** — `--yes` flag, skip prompts, use detection only
3. **Agent** — `--input json` flag, structured JSON input/output, non-TTY detection

---

## Stack

### Core Dependencies

| Component | Library | Version | Rationale |
|-----------|---------|---------|-----------|
| CLI Framework | Commander.js | ^13.0.0 | Async-first, excellent flag/JSON parsing |
| Interactive UI | @clack/prompts | ^0.9.0 | Modern prompts, fuzzy search integration |
| Git Operations | simple-git | ^3.27.0 | Clone public repo, no API rate limits |
| Cache Storage | env-paths | ^4.0.0 | Cross-platform cache (XDG compliant) |
| Fuzzy Search | fuse.js | ^8.0.0 | Lightweight template search |
| Validation | zod | ^4.0.0 | Runtime schemas, TypeScript types |
| Streaming | ndjson | ^3.0.0 | NDJSON for large results |
| Bundler | tsdown | ^1.0.0 | Fast TypeScript bundler |

### Key Stack Decisions

1. **Git Clone Strategy** — Clone github/gitignore with simple-git, hard fail on errors
2. **Async I/O Foundation** — All operations use `fs/promises`, never block
3. **Dual Input Parser** — Separate Flag Parser (human) and JSON Parser (agent)
4. **Layered Output** — stdout for data, stderr for messages (never mix)
5. **Schema-Driven Validation** — Zod schemas define all I/O, single source of truth

### What NOT to Use

- **octokit** — Not using GitHub API, cloning public repo instead
- **cheerio** — Not scraping HTML, direct file access via git
- **oclif** — Overhead for single-purpose CLI
- **utils/** — Prefer named modules (cache/, git/, scanner/)

---

## Features

### Table Stakes (Agent-First CLI Features)

| Feature | Priority | Complexity |
|---------|----------|------------|
| `--output json` | P0 | LOW |
| `--output ndjson` | P0 | MEDIUM |
| `--output stdout` | P0 | LOW |
| `--input json` (aliased as `--json`) | P0 | LOW |
| stdin JSON support | P0 | MEDIUM |
| `--dry-run` flag | P0 | LOW |
| Non-TTY detection | P0 | LOW |
| `examples <cmd>` | P0 | MEDIUM |
| `schema <resource>` | P1 | HIGH |

### Differentiators

| Feature | Complexity | Status |
|---------|------------|--------|
| Auto-detection (repo scanning) | HIGH | In scope |
| Smart merge (preserve custom rules) | HIGH | In scope |
| Auto-update (git log checks) | MEDIUM | In scope |
| Platform defaults (opt-out) | LOW | In scope |
| Cache management (offline-capable) | MEDIUM | In scope |

### Anti-Features

- Web UI, MCP server, global config, custom templates, template editing, authentication

### Command Structure

```
gitignorer [command] [options]

Commands:
  generate    Generate .gitignore (default)
  scan        Scan repo for matching templates
  search      Search templates (fuzzy)
  list        List all templates
  examples    Show JSON payloads for agents
  schema      Show JSON schemas
  update      Update cached templates

Options:
  --input <format>     Input: json (shorthand: --json)
  --output <format>    Output: text, json, ndjson, stdout
  --dry-run            Validate without writing
  --yes, -y            Skip prompts (non-interactive)
  --no-platform        Skip OS templates
  --platform <os>      Explicit platform selection
```

### Output Behavior

| Condition | Destination |
|-----------|-------------|
| Default (TTY) | .gitignore file |
| Piped (non-TTY) | stdout |
| `--output stdout` | stdout (explicit) |
| `--output json` | stdout (JSON) |

---

## Architecture

### Component Specification

| Component | Responsibilities |
|-----------|-----------------|
| Entry Points | Command routing, help, version |
| Flag Parser | Human-facing flags, defaults |
| JSON Parser | Agent JSON input, validation |
| Schema Module | Zod validation, sanitization |
| Interactive Layer | @clack/prompts UI loop |
| Command Layer | Logic execution, dry-run gate |
| Git Service | Clone, pull via simple-git |
| Cache Service | Storage via env-paths |
| Scanner Service | File system traversal |
| Merger Service | Smart merge logic |
| Output Formatter | JSON/NDTEXT streaming |

### Data Flow

**Human (Interactive):**
Entry → Parse → Mode Check → Interactive Loop → Validate → Execute → Format → Return

**Human (Non-Interactive):**
Entry → Parse → Validate → Execute → Format → Return

**Agent (JSON):**
Entry → Parse JSON → Validate (Zod) → Execute (auto-confirm) → Format JSON → Return

### Directory Structure

```
src/
├── cli/                    # Entry points
├── parsers/                # Flag + JSON parsers
├── schema/                 # Zod schemas, validation
├── interactive/            # @clack/prompts wrapper
├── services/               # Git, cache, scanner, merger
├── formatters/             # Text + JSON output
└── types/                  # TypeScript types
```

### Key Patterns

1. **Parser Pattern** — Dual input routes converge on Schema Module with mode detection
2. **Formatter Pattern** — Routes to stdout/.gitignore based on TTY + flags
3. **Service Layer** — Business logic isolated, testable independent of CLI
4. **Validation Pipeline** — Input validation before side effects
5. **Interactive Loop** — @clack/prompts wraps execution when interactive

---

## Pitfalls

### Critical Pitfalls (Agent-First CLIs)

| Pitfall | Phase | Priority | Prevention |
|---------|-------|----------|------------|
| Blocking I/O | 1 | CRITICAL | Async everywhere |
| Mixed Output | 1 | CRITICAL | Separate stdout/stderr |
| Missing Validation | 1 | CRITICAL | Schema module |
| No Dry-Run | 1 | CRITICAL | --dry-run flag |
| Interactive Leaks | 1 | CRITICAL | TTY detection |
| Breaking .gitignore | 3 | CRITICAL | Smart merge |
| Clone Failures | 2 | CRITICAL | Hard fail |

### Gitignorer-Specific Pitfalls

| Pitfall | Phase | Priority | Prevention |
|---------|-------|----------|------------|
| Template Staleness | 5 | HIGH | Auto-update via git log |
| Incorrect Detection | 3 | HIGH | Confidence scoring |
| Output Confusion | 1 | HIGH | TTY detection + override |
| Platform Detection | 3 | MEDIUM | Opt-out flag |

### Security Posture

> "The agent is not a trusted operator."

Build CLI like a web API:
- Reject `../`, `?`, `#`, `%XX`, control chars explicitly
- Agents confuse path segments and URL structure differently than humans
- Validate and sanitize ALL inputs before execution

---

## Implementation Priority

1. **Phase 1** - Core CLI Infrastructure
   - Entry points, flag/JSON parsers, schema module
   - Output formatter (text + JSON), TTY detection
   - `--dry-run`, `--output json` flags

2. **Phase 2** - Template Management
   - Git clone (simple-git), cache (env-paths)
   - Hard fail on clone errors

3. **Phase 3** - Core Features
   - Repo scanning (scan command), interactive selection
   - Search command (fuzzy search), platform defaults

4. **Phase 4** - Agent Experience
   - `examples` command, `schema` command
   - NDJSON streaming, stdin JSON support

5. **Phase 5** - Polish
   - Auto-update checks, progress indicators
   - Error handling edge cases

---

## Key Takeaways

1. **Three execution modes** — Interactive, Non-Interactive, Agent (detected via TTY + flags)
2. **Git clone not API** — simple-git clones public repo, hard fails on errors
3. **Separate channels** — stdout for data, stderr for messages, never mix
4. **Schema-driven** — Zod validates all I/O, single source of truth
5. **Smart merge critical** — Preserve custom rules, use template markers
6. **Named modules** — Avoid generic `utils/`, prefer `cache/`, `git/`, `scanner/`

# Architecture Research

## Component Specification

| Component | Input | Output | Responsibilities |
|-----------|-------|--------|------------------|
| **Entry Points** | CLI args, subcommands | Parsed route | Command routing, help text, version |
| **Flag Parser** | Command flags | Parsed key-values | Human-facing convenience flags, defaults |
| **JSON Parser** | `--input json`, stdin | Structured payload | Raw API payload input for agents, validation |
| **Schema Module** | Parsed input | Sanitized data | Zod validation, hardening (path traversal, control chars) |
| **Interactive Layer** | User prompts | User selections | @clack/prompts UI loop, fuzzy search |
| **Command Layer** | Validated data | Business result | Logic execution, dry-run gate, error handling |
| **Git Service** | Repo URL | Template files | Clone, pull, update detection via simple-git |
| **Cache Service** | Templates | Cached templates | Storage via env-paths, version tracking |
| **Scanner Service** | Directory path | Detected patterns | File system traversal, pattern matching |
| **Merger Service** | Templates + existing | Merged .gitignore | Smart merge, cleanup, template markers |
| **Output Formatter** | Result | JSON/NDTEXT | Structured output, streaming pagination |

## Data Flow Sequence

### Human (Interactive) Flow
1. **Entry** — Receive command with flags
2. **Parse** — Route through Flag Parser
3. **Check Mode** — Is TTY? Is `--yes` set?
4. **Interactive Loop** — @clack/prompts for selections (if interactive)
5. **Validate** — Schema module validates all inputs
6. **Execute** — Command Layer runs logic with dry-run check
7. **Format** — Output Formatter structures as colored text
8. **Return** — Send to terminal (or .gitignore file)

### Human (Non-Interactive) Flow
1. **Entry** — Receive command with flags + `--yes`
2. **Parse** — Route through Flag Parser
3. **Validate** — Schema module validates all inputs
4. **Execute** — Command Layer runs logic with dry-run check
5. **Format** — Output Formatter structures as plain text
6. **Return** — Send to terminal (or .gitignore file)

### Agent (JSON) Flow
1. **Entry** — Receive JSON payload via stdin or `--input json`
2. **Parse** — JSON Parser validates and extracts
3. **Validate** — Schema module validates against Zod schemas
4. **Execute** — Command Layer runs logic (auto-confirm, skip prompts)
5. **Format** — Output Formatter structures as JSON/NDJSON
6. **Return** — Send to stdout (data) and stderr (errors)

## Data Flow Requirements

- **Async everywhere** — Support piped input/output, never block
- **Streaming paths** — Do not buffer large responses, emit NDJSON per item
- **Early validation** — Check inputs before any git operations or file writes
- **Separate channels** — stdout for data, stderr for messages/logs

## Build Order (Component Dependencies)

1. **Foundation** — Entry Points, Flag Parser, JSON Parser
2. **Schema** — Zod schemas, validation logic
3. **Output** — Output Formatter (text + JSON + NDJSON)
4. **Services** — Git Service, Cache Service
5. **Interactive** — Interactive Layer (@clack/prompts integration)
6. **Business Logic** — Scanner Service, Merger Service
7. **Commands** — Command Layer (wire everything together)

## Directory Structure

```
src/
├── cli/                    # Entry points
│   ├── index.ts           # Main CLI entry
│   ├── commands/          # Command implementations
│   └── flags.ts           # Flag definitions
├── parsers/               # Input parsing
│   ├── flag-parser.ts     # Human-facing flags
│   └── json-parser.ts     # Agent JSON input
├── schema/                # Zod schemas & validation
│   ├── input.schema.ts    # Input validation
│   ├── output.schema.ts   # Output schemas
│   └── validator.ts       # Validation logic
├── interactive/           # Interactive UI layer
│   ├── prompts.ts         # @clack/prompts wrapper
│   └── fuzzy-search.ts    # Fuse.js integration
├── services/              # Business logic
│   ├── git.service.ts     # simple-git wrapper
│   ├── cache.service.ts   # Cache operations
│   ├── scanner.service.ts # Repo scanning
│   └── merger.service.ts  # .gitignore merging
├── formatters/            # Output formatting
│   ├── text.formatter.ts  # Human-readable
│   └── json.formatter.ts  # JSON/NDJSON
└── types/                 # TypeScript types (from Zod)
    └── index.ts
```

## Key Architectural Patterns

### 1. Parser Pattern (Dual Input + Mode Detection)
Separate Flag Parser and JSON Parser converge on Schema Module, with mode detection.

```
CLI Args → Flag Parser ──┐
                         ├──→ Mode Detection ───┐
JSON/Stdin → JSON Parser ┘                     │
                                              ├──→ Schema Module → Command Layer
                                    ┌──────────┘
                                    ↓
                            (isTTY && !--yes) ?
                            Interactive Loop : Skip
```

### 2. Formatter Pattern (Dual Output + Destination)
Command Layer outputs to Formatter, which routes to Text/JSON and File/Stdout.

```
Command Layer → Output Formatter ──┬──→ stdout (JSON/Text)
                                   └──→ .gitignore (default, TTY only)
```

**Destination Logic:**
- `process.stdout.isTTY` → Write to .gitignore
- `!process.stdout.isTTY` → Write to stdout
- `--output stdout` → Write to stdout (explicit)
- `--output json` → Write JSON to stdout

### 3. Service Layer Pattern
Business logic isolated in services, testable independent of CLI.

```
Command Layer → Git Service → simple-git (clone/pull)
                    ↓
                 Cache Service → env-paths (storage)
                    ↓
              Scanner Service → fs (file traversal)
                    ↓
               Merger Service → template merge logic
```

### 4. Validation Pipeline
Input validation happens before any side effects (git ops, file writes).

```
Input → Validate (Zod) → Sanitize → Execute → Format → Output
```

### 5. Interactive Loop Pattern
Interactive layer wraps command execution with @clack/prompts.

```
Command → Check Mode → (Interactive?) → @clack/prompts → User Input → Execute
                              ↓
                         (Non-Interactive?) → Skip → Execute
```

## Interactivity in Architecture

### Mode Detection

```typescript
const isInteractive = process.stdout.isTTY && !options.yes;
const isAgentMode = options.input === 'json' || !process.stdout.isTTY;
```

### Interactive Flow

1. **Pre-check** — Detect interactive mode
2. **Prompt Loop** — @clack/prompts for selections
   - Template selection (multi-select with fuzzy search)
   - Platform confirmation
   - Output confirmation
3. **Execute** — Run with user selections
4. **Post-check** — Show results, offer re-run

### Non-Interactive Flow

1. **Pre-check** — Detect `--yes` or non-TTY
2. **Auto-detect** — Scan repo, suggest templates
3. **Execute** — Run without prompts
4. **Output** — JSON or text result

## Error Handling Strategy

| Error Type | Human Output | Agent Output | Exit Code |
|------------|--------------|--------------|-----------|
| Validation | Colored error message | JSON with error field | 1 |
| Git Clone | Retry message + hard fail | JSON with error details | 2 |
| File System | Permission/path error | JSON with error details | 3 |
| Business Logic | Clear explanation | JSON with context | 4 |

All errors include:
- Error code (machine-readable)
- Message (human-readable)
- Context (what went wrong)
- Suggestion (how to fix, if applicable)

## Named Modules Preference

Generic `utils/` is avoided. Named modules for discoverability:

- `cache/` not `utils/cache.ts`
- `git/` not `utils/git.ts`
- `scanner/` not `utils/scanner.ts`
- `merger/` not `utils/merger.ts`
- `schema/` not `handlers/` or `validators/`

# Stack Research

## Framework Selection

| Component | Library | Version | Confidence | Rationale |
|-----------|---------|---------|------------|-----------|
| **CLI Framework** | Commander.js | ^13.0.0 | High | Proven, async-first, excellent flag parsing, JSON input support |
| **Interactive UI** | @clack/prompts | ^0.9.0 | High | Modern, beautiful prompts, built-in progress spinners |
| **Git Operations** | simple-git | ^3.27.0 | High | Clone github/gitignore repo, parse commits for updates |
| **Cache Storage** | env-paths | ^4.0.0 | High | Cross-platform cache directories (XDG compliant) |
| **Fuzzy Search** | fuse.js | ^8.0.0 | High | Lightweight fuzzy search for template selection |
| **Output Formatting** | cli-table3 | ^0.7.0 | Medium | Pretty tables for human-readable output |
| **Streaming** | ndjson | ^3.0.0 | High | NDJSON serialization for streaming output |
| **Validation** | zod | ^4.0.0 | High | Runtime schema validation for JSON input/output |
| **TypeScript** | typescript | ^5.8.0 | High | Language requirement, ESM support |
| **Build Tool** | tsx | ^4.20.0 | High | Zero-config TypeScript execution for development |
| **Bundler** | tsdown | ^1.0.0 | High | Fast TypeScript bundler for distribution |

## What NOT to Use (and Why)

| Option | Avoid Because |
|--------|---------------|
| **octokit** | Not using GitHub API — cloning public repo with simple-git |
| **cheerio** | Not scraping HTML — cloning repo gives direct file access |
| **oclif** | Heavy framework, multi-command overhead, overkill for single-purpose CLI |
| **Inquirer.js** | @clack/prompts is more modern and aesthetically pleasing |
| **axios** | fetch is built into Node.js 18+, no extra dependency needed |
| **glob** | Use native fs.readdir with recursive option (Node.js 20.10+) |
| **utils/** | Generic utils folder — prefer named modules for discoverability |

## Key Stack Decisions

### Interactive Mode Layer
**Choice:** Three distinct execution modes — Interactive (default), Non-Interactive (flags), Agent (JSON).
**Why:** Humans need prompting (@clack/prompts), agents need structured JSON, scripts need flags.
**Confidence:** High

**Modes:**
1. **Interactive** (default) — @clack/prompts for template selection, fuzzy search
2. **Non-Interactive** — `--yes` flag, skip prompts, use detection only
3. **Agent** — `--input json` flag, structured JSON input/output

### Git Clone Strategy
**Choice:** Clone github/gitignore to local cache using simple-git.
**Why:** Direct file access, no API rate limits, can detect updates via git log.
**Confidence:** High
**Failure:** Hard fail if clone fails — cache corruption, network issues require manual intervention

### Async I/O Foundation
**Choice:** All I/O operations use native Node.js `fs/promises` and async iterators.
**Why:** Pipe compatibility is non-negotiable for agent-first CLIs. Blocking operations break agent workflows.
**Confidence:** High

### Dual Input Parser
**Choice:** Separate Flag Parser (human) and JSON Parser (agent) routes.
**Why:** Humans expect `--flag value`; agents expect structured JSON payloads. Don't mix.
**Confidence:** High

### Layered Output
**Choice:** Separate stdout (data) and stderr (messages) channels.
**Why:** Agents parse stdout for JSON; humans read stderr for progress. Mixed channels break agents.
**Confidence:** High

### Schema-Driven Validation
**Choice:** Zod schemas define all JSON input/output, double as runtime validation and TypeScript types.
**Why:** Single source of truth, runtime type safety, auto-generates `schema` command output.
**Confidence:** High

## Dependencies Summary

```json
{
  "dependencies": {
    "@clack/prompts": "^0.9.0",
    "commander": "^13.0.0",
    "env-paths": "^4.0.0",
    "fuse.js": "^8.0.0",
    "ndjson": "^3.0.0",
    "simple-git": "^3.27.0",
    "zod": "^4.0.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "tsdown": "^1.0.0",
    "tsx": "^4.20.0",
    "typescript": "^5.8.0"
  }
}
```

## Directory Naming Convention

Named modules over generic utils:

```
src/
├── cache/          # Cache operations
├── git/            # Git operations (simple-git wrapper)
├── scanner/        # Repository scanning
├── merger/         # .gitignore merging logic
└── schema/         # Zod schemas and validation
```

## Version Verification Notes

- All versions target 2026 releases (latest verified via official docs)
- Commander.js 13.x provides best TypeScript/ESM support
- @clack/prompts 0.9.x actively maintained, native ESM
- env-paths 4.x stable, handles all platforms correctly
- simple-git 3.27.x mature, well-tested
- zod 4.0.x latest major version

# Features Research

## Table Stakes (Agent-First CLI Features)

These features are **expected** in any agent-first CLI. Without them, agents cannot effectively use the tool.

| Feature | Why Required | Priority | Complexity |
|---------|--------------|----------|------------|
| `--output json` | Agents need structured, parseable output | P0 | LOW |
| `--output ndjson` | Streaming for large results, pipe-friendly | P0 | MEDIUM |
| `--output stdout` | Explicitly output to stdout instead of file | P0 | LOW |
| Structured error JSON | Errors must be parseable by agents | P0 | LOW |
| `--dry-run` flag | Validate before acting (file writes are mutating) | P0 | LOW |
| `--input json` | Raw JSON payload input for agents (aliased as `--json`) | P0 | LOW |
| stdin JSON support | Piped JSON payloads for chaining | P0 | MEDIUM |
| Non-TTY detection | Auto-enable JSON mode when piped | P0 | LOW |
| `examples <cmd>` | CLI self-documents payloads for agents | P0 | MEDIUM |
| `schema <resource>` | Runtime introspection for generated code/types | P1 | HIGH |

## Differentiators (Competitive Advantages)

These features distinguish Gitignorer from existing `.gitignore` tools.

| Feature | Value | Complexity | Status |
|---------|-------|------------|--------|
| **Auto-detection** | Scans repo for patterns and suggests templates automatically | HIGH | In scope |
| **Smart merge** | Preserves custom rules, cleanup duplicates, template markers | HIGH | In scope |
| **Auto-update** | Checks git repo for updates, prompts user | MEDIUM | In scope |
| **Platform defaults** | Suggests OS templates (Windows/macOS/Linux) by default | LOW | In scope |
| **Cache management** | Local caching with env-paths, offline-capable | MEDIUM | In scope |
| **Interactive mode** | Beautiful prompts with fuzzy search (@clack/prompts) | MEDIUM | In scope |

## Anti-Features (Deliberately NOT Building)

| Feature | Avoid Because |
|---------|---------------|
| **Web UI** | CLI-only, both terminal and scriptable. Web interface is out of scope. |
| **Custom templates** | Uses only github/gitignore templates. Users create custom rules via negation. |
| **Global config** | Per-project configuration via flags only. No `$HOME/.gitignorerc`. |
| **Template editing** | Users should use negation rules instead of editing templates directly. |
| **Git integration** | Writes files, doesn't modify git config or `.git/info/exclude`. |
| **Authentication** | Public git clone only, no auth required. |
| **MCP server** | Modern agents use bash tools and invoke CLI directly with agent-first I/O. |

## Context Window Discipline

Agents pay per token and lose reasoning capacity with every irrelevant field.

**Why it matters:**
- Large template lists consume context
- Detection results can be verbose
- Humans scroll; agents pay for every byte

**Required mechanisms:**
- **Minimal output** — Only send what's requested
- **NDJSON streaming** — One JSON object per item for large lists
- **Explicit guidance** — Docs encourage `--fields`-style filtering where applicable

## Agent Integration Pattern

Modern agents use bash tools to invoke CLIs directly:

```
Agent → Bash Tool → gitignorer --input json --output json
```

**Requirements for agents:**
- Structured JSON input (not just flags)
- Structured JSON output (not colored text)
- No interactive prompts (use `--yes` or non-TTY detection)
- Clear error codes and messages
- Self-documenting via `examples` command

## Command Structure

```
gitignorer [command] [options]

Commands:
  generate    Generate .gitignore file (default)
  scan        Scan repository for matching templates (auto-detect)
  search      Search available templates (fuzzy search)
  list        List all available templates
  examples    Show example JSON payloads for agents
  schema      Show JSON schema for resources
  update      Update cached templates from git repo

Options:
  --input <format>      Input format: json (shorthand: --json)
  --output <format>     Output format: text, json, ndjson, stdout
  --dry-run             Validate without writing
  --yes, -y             Skip all prompts (non-interactive)
  --no-platform         Skip platform-specific templates
  --platform <os>       Explicit platform selection

Input Methods:
  --input json          Read JSON from flag value
  --input json --file   Read JSON from file
  echo '...' \| gitignorer --input json  # Read from stdin
```

## Output Behavior

| Condition | Output Destination |
|-----------|-------------------|
| Default (TTY) | .gitignore file |
| Piped (non-TTY) | stdout (JSON/text) |
| `--output stdout` | stdout (explicit) |
| `--output json` | stdout (JSON format) |
| `--output ndjson` | stdout (NDJSON streaming) |

**Detection:** Use `process.stdout.isTTY` to detect pipe vs terminal.

## Implementation Priority

1. **Phase 1** - Core CLI Infrastructure
   - Entry points, flag parsing, JSON parser
   - Schema module with Zod validation
   - Output formatter (text + JSON)
   - `--dry-run` flag
   - `--output json` flag
   - Non-TTY detection

2. **Phase 2** - Template Management
   - Git clone with simple-git
   - Cache management (env-paths)
   - Update detection (git log)
   - Hard fail on clone errors

3. **Phase 3** - Core Features
   - Repo scanning / auto-detection (scan command)
   - Interactive template selection (@clack/prompts)
   - Search command with fuzzy search
   - Platform defaults with opt-out

4. **Phase 4** - Agent Experience
   - `examples` command
   - `schema` command
   - NDJSON streaming
   - stdin JSON support

5. **Phase 5** - Polish
   - Auto-update checks
   - Progress indicators
   - Error handling edge cases

# Pitfalls Research

## Critical Pitfalls for Agent-First CLIs

### Pitfall 1: Blocking I/O

**What goes wrong:** CLI blocks on stdin/stdout, breaks pipes.
**Why it happens:** Synchronous I/O is easier to implement.
**How to avoid:** Use async I/O throughout. Do not block.
**Warning signs:** "Pipe breaks when output is large," "Can't chain commands"
**Phase to address:** Phase 1 (Core CLI Infrastructure)

**Prevention:**
- Use `fs/promises` for all file operations
- Use async iterators for streaming
- Never use `fs.readFileSync`, `fs.readSync`

### Pitfall 2: Mixed Output Formats

**What goes wrong:** Agents can't parse when JSON and prose mix.
**Why it happens:** Adding progress messages to JSON output.
**How to avoid:** Separate channels: stdout for data, stderr for messages.
**Warning signs:** "Agents fail on partial output," "JSON parsing errors"
**Phase to address:** Phase 1 (Output Layer)

**Prevention:**
- stdout is ONLY for JSON data (or text output)
- stderr is ONLY for messages, logs, errors
- Never interleave
- Use `console.info()` for stderr, `console.log()` for stdout

### Pitfall 3: Missing Input Validation

**What goes wrong:** Agents inject dangerous inputs (path traversal, query params).
**Why it happens:** Assuming human typing patterns, not agent generation patterns.
**How to avoid:** Reject `../`, `?`, `#`, `%XX`, control chars explicitly.
**Warning signs:** "Strange resource ID errors," "Files created outside expected dirs"
**Phase to address:** Phase 1 (Schema Module)

**Prevention:**
- **`validate_safe_output_dir`** — Canonicalizes and sandboxes all output to CWD
- **`reject_control_chars`** — Rejects anything below ASCII 0x20 (invisible chars)
- **`validate_resource_name`** — Rejects `?`, `#`, `%` in resource IDs (prevents query injection)
- **`encode_path_segment`** — Percent-encodes at HTTP layer (handles special chars)

**Security Posture:**
> "The agent is not a trusted operator."

Build your CLI like a web API — don't trust user input. Agents hallucinate differently than humans typo:
- Humans rarely typo `../../.ssh` — agents confuse path segments
- Humans almost never pre-encode URLs — agents routinely double-encode (`%2e%2e` for `..`)
- Humans don't embed `?fields=name` in IDs — agents confuse URL structure

### Pitfall 4: No Dry-Run for Mutating Operations

**What goes wrong:** Agents execute without validating, cause production incidents.
**Why it happens:** Treating dry-run as optional feature.
**How to avoid:** Require --dry-run for ALL mutating operations in docs and examples.
**Warning signs:** "Accidental deletions," "Production rollbacks"
**Phase to address:** Phase 1 (Command Layer - CRITICAL for Gitignorer)

**Prevention:**
- `--dry-run` flag on all write operations
- Show what would be written without writing
- Agents should validate with dry-run first, then execute
- Document this pattern in `examples generate`

### Pitfall 5: Breaking Existing .gitignore

**What goes wrong:** Overwriting user's custom .gitignore rules.
**Why it happens:** Simple file replacement, not smart merging.
**How to avoid:** Parse existing .gitignore, preserve custom rules, add new templates with markers.
**Warning signs:** "My custom rules disappeared," "Template updates wiped my changes"
**Phase to address:** Phase 3 (Smart Merge - CRITICAL for Gitignorer)

**Prevention:**
- Parse existing .gitignore before writing
- Identify custom rules vs template rules (via markers)
- Preserve custom rules at bottom
- Use comment markers: `### START: Python ###` and `### END: Python ###`
- Cleanup duplicates intelligently (not exact match)

### Pitfall 6: Clone Failures

**What goes wrong:** CLI can't function without successful git clone.
**Why it happens:** Network issues, DNS failures, repo unavailable.
**How to avoid:** Hard fail with clear error message. Don't silently use stale cache.
**Warning signs:** "Using stale templates," "Update check silent"
**Phase to address:** Phase 2 (Git Service - CRITICAL)

**Prevention:**
- Clone must succeed on first run
- Check cache on subsequent runs
- If clone fails, hard fail with actionable error
- Don't fallback to stale cache silently
- Provide `update` command for manual refresh

### Pitfall 7: Incorrect Platform Detection

**What goes wrong:** Suggesting wrong OS templates (e.g., suggesting macOS rules on Linux).
**Why it happens:** Using `process.platform` without confirmation.
**How to avoid:** Detect platform, but allow opt-out via `--no-platform` flag.
**Warning signs:** "Why are there macOS rules on my Linux server?"
**Phase to address:** Phase 3 (Platform Defaults - MEDIUM priority)

**Prevention:**
- Detect platform via `process.platform`
- Suggest but don't auto-add platform templates
- Provide `--no-platform` flag to disable
- Allow explicit platform selection: `--platform windows,linux`

### Pitfall 8: Interactive Mode Leaks

**What goes wrong:** Agent invocations trigger interactive prompts, hanging forever.
**Why it happens:** Missing non-TTY detection or `--yes` flag logic.
**How to avoid:** Auto-detect TTY, require `--yes` for non-interactive mode.
**Warning signs:** "Agent hangs," "Script waits for input"
**Phase to address:** Phase 1 (Entry Points - CRITICAL)

**Prevention:**
- Check `process.stdout.isTTY` for mode detection
- Non-TTY = non-interactive automatically
- `--yes` flag explicitly disables prompts
- JSON input mode = non-interactive automatically

## Gitignorer-Specific Pitfalls

### Pitfall: Template Staleness

**What goes wrong:** Using outdated gitignore templates that don't cover new file patterns.
**Why it happens:** Never updating cached templates.
**How to avoid:** Check git log for updates, prompt user when available.
**Phase to address:** Phase 5 (Auto-Update)

**Prevention:**
- Check git log for latest commit
- Compare to cached version
- Prompt user: "New templates available. Update? [Y/n]"
- Support `gitignorer update` command

### Pitfall: Incorrect Pattern Matching

**What goes wrong:** Auto-detection suggests wrong templates (e.g., suggesting Python for a project with just `*.pyc` files in a subdirectory).
**Why it happens:** Naive glob matching without context.
**How to avoid:** Weighted scoring, require confidence threshold, allow user correction.
**Phase to address:** Phase 3 (Scanner Service - HIGH priority)

**Prevention:**
- Scan file tree, count matches per template
- Require minimum confidence before suggesting
- Show confidence scores in interactive mode
- Allow user to override detection

### Pitfall: Output Destination Confusion

**What goes wrong:** Writing to .gitignore when piped, or writing to stdout when file expected.
**Why it happens:** Incorrect TTY detection, missing `--output stdout` option.
**How to avoid:** Clear detection logic, explicit override option.
**Phase to address:** Phase 1 (Output Layer)

**Prevention:**
- Use `process.stdout.isTTY` for detection
- `--output stdout` to explicitly override
- `--output json` for JSON to stdout
- Default: TTY → .gitignore, non-TTY → stdout

## Pitfall Summary Table

| Pitfall | Phase | Priority | Prevention |
|---------|-------|----------|------------|
| Blocking I/O | 1 | CRITICAL | Async everywhere |
| Mixed Output | 1 | CRITICAL | Separate stdout/stderr |
| Missing Validation | 1 | CRITICAL | Schema module |
| No Dry-Run | 1 | CRITICAL | --dry-run flag |
| Interactive Leaks | 1 | CRITICAL | TTY detection |
| Breaking .gitignore | 3 | CRITICAL | Smart merge |
| Clone Failures | 2 | CRITICAL | Hard fail |
| Output Confusion | 1 | HIGH | TTY detection + override |
| Platform Detection | 3 | MEDIUM | Opt-out flag |
| Template Staleness | 5 | HIGH | Auto-update |
| Incorrect Detection | 3 | HIGH | Confidence scoring |
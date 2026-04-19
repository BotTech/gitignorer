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

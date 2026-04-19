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

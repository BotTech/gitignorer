# Gitignorer

## What This Is

An agent-first CLI tool that generates intelligent `.gitignore` files by auto-detecting technologies from repository content, intelligently merging with existing ignore rules, and keeping ignore rules up-to-date with evolving technology ecosystems. Serves both humans and AI agents with structured output.

## Core Value

Generate and maintain the right `.gitignore` for your project automatically — detect tech stack, merge intelligently with existing rules, keep templates current with upstream updates, and support both interactive and programmatic usage.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] **REPO-SCAN**: Scan repository to detect which templates are needed based on existing file patterns
- [ ] **INTERACTIVE-SELECT**: Fuzzy search interface for additional template selection
- [ ] **PLATFORM-DEFAULTS**: Suggest Windows, macOS, Linux by default with opt-out flag
- [ ] **SMART-MERGE**: Concatenate templates with comment markers, preserve existing custom rules at bottom
- [ ] **CLEANUP-RULES**: Remove existing rules covered by templates (sophisticated matching, not exact match)
- [ ] **CACHED-TEMPLATES**: Cache templates locally using env-paths or xdg-basedir
- [ ] **AUTO-UPDATE**: Auto-check for template updates and prompt user to keep rules current with evolving tech
- [ ] **CONFIGURABLE-OUTPUT**: `--output` flag for custom destination path
- [ ] **JSON-OUTPUT**: All commands support `--output json` for agent use
- [ ] **JSON-INPUT**: Support raw JSON payload input via `--json` flag or stdin for agents
- [ ] **NDJSON-STREAMING**: Streaming output for large results
- [ ] **EXAMPLES-CMD**: `gitignorer examples <command>` provides example JSON payloads
- [ ] **SCHEMA-CMD**: `gitignorer schema <resource>` for runtime introspection
- [ ] **DRY-RUN**: `--dry-run` flag to validate before writing
- [ ] **LIST-CMD**: Interactive list command to discover available templates
- [ ] **NON-INTERACTIVE**: Auto-scan with auto-approve or separate detection-only command
- [ ] **ASYNC-IO**: Non-blocking I/O throughout for pipe compatibility

### Out of Scope

- **Web-based interface** — CLI only, both terminal and scriptable
- **Custom template creation** — Uses only github/gitignore templates
- **Template editing** — Users should use negation rules instead
- **Global configuration** — Per-project configuration via flags only

## Context

- **Source**: github/gitignore repository is the canonical source for templates
- **Inspiration**: Existing tools like `gi` lack intelligent merging, auto-detection, and automatic updates
- **Target users**: Developers working in multiple languages/frameworks who switch projects frequently and want ignore rules that stay current
- **Agent-first design**: CLI must serve both human interactive use and AI agent automation

## Constraints

- **Language**: TypeScript
- **Runtime**: Node.js
- **Interactive UI**: Must use @clack/prompts for interactive prompts
- **Cache location**: Must use env-paths or xdg-basedir for local cache
- **Agent compatibility**: All commands must support structured JSON input/output
- **Async I/O**: All operations must be non-blocking for pipe compatibility
- **Security**: Input validation for path traversal, query injection, control chars

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Binary name: `gitignorer` | Package: @bottech/gitignorer | — Pending |
| Template markers with header/footer | Users can identify which templates contributed which rules | — Pending |
| Custom rules always at bottom | Preserves user additions during template updates | — Pending |
| Sophisticated pattern cleanup | Not exact string matching — needs semantic understanding of ignore patterns | — Pending |
| Platform defaults selected by default | Most devs need OS-specific ignores, but provide opt-out flag | — Pending |
| Auto-check for template updates | Keeps ignore rules current with evolving technology ecosystems | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd-transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd-complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2025-04-19 after initialization*

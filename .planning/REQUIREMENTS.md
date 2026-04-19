# Requirements

## v1 Requirements

### CLI Infrastructure

- [ ] **CLI-01**: User can invoke CLI with `gitignorer` command
- [ ] **CLI-02**: CLI supports interactive mode (default, TTY detected)
- [ ] **CLI-03**: CLI supports non-interactive mode via `--yes` flag
- [ ] **CLI-04**: CLI supports agent mode via `--input json` flag
- [ ] **CLI-05**: CLI detects non-TTY (piped) and auto-disables interactivity
- [ ] **CLI-06**: All I/O operations are non-blocking for pipe compatibility
- [ ] **CLI-07**: User can run `gitignorer help` to show usage information

### Input Handling

- [ ] **INPUT-01**: CLI validates all inputs via Zod schemas before execution
- [ ] **INPUT-02**: CLI rejects dangerous patterns (path traversal, control chars, query injection)
- [ ] **INPUT-03**: CLI supports `--input json` flag for structured JSON input (shorthand: `--json`)
- [ ] **INPUT-04**: CLI supports JSON payload via stdin
- [ ] **INPUT-05**: CLI provides `examples <command>` to show JSON payloads
- [ ] **INPUT-06**: CLI provides `schema <resource>` for runtime introspection

### Output Handling

- [ ] **OUTPUT-01**: CLI supports `--output json` flag for structured JSON output
- [ ] **OUTPUT-02**: CLI supports `--output ndjson` flag for streaming large results
- [ ] **OUTPUT-03**: CLI supports `--output stdout` flag to explicitly write to stdout
- [ ] **OUTPUT-04**: CLI defaults to writing .gitignore file when TTY detected
- [ ] **OUTPUT-05**: CLI defaults to stdout when non-TTY (piped) detected
- [ ] **OUTPUT-06**: When outputting JSON (`--output json` or agent mode), CLI writes JSON data to stdout and messages/errors to stderr (channels never mixed)
- [ ] **OUTPUT-07**: CLI returns structured error JSON for all error types
- [ ] **OUTPUT-08**: CLI includes exit codes: 1 (validation), 2 (git), 3 (fs), 4 (business logic)

### Core Commands

- [ ] **CMD-01**: User can run `gitignorer generate` to create .gitignore (default command)
- [ ] **CMD-02**: User can run `gitignorer scan` to detect matching templates
- [ ] **CMD-03**: User can run `gitignorer search <query>` to search templates
- [ ] **CMD-04**: User can run `gitignorer list` to discover all available templates
- [ ] **CMD-05**: User can run `gitignorer update` to regenerate .gitignore with latest templates
- [ ] **CMD-06**: User can run `gitignorer examples <command>` for JSON examples
- [ ] **CMD-07**: User can run `gitignorer schema <resource>` for schema introspection

### Template Management

- [ ] **TMPL-01**: CLI clones github/gitignore repository to local cache via simple-git
- [ ] **TMPL-02**: CLI hard fails on clone errors with actionable error message
- [ ] **TMPL-03**: CLI stores templates in cross-platform cache via env-paths
- [ ] **TMPL-04**: CLI supports `--offline` flag to skip network operations and use only cached templates
- [ ] **TMPL-05**: CLI checks cache before network operations
- [ ] **TMPL-06**: CLI updates cache as a side effect when commands use templates (no separate update command needed)

### Auto-Detection

- [ ] **DETECT-01**: CLI supports `--scan` flag to enable automatic repository scanning
- [ ] **DETECT-02**: CLI supports `--no-scan` flag to disable automatic repository scanning
- [ ] **DETECT-03**: When scanning is enabled, CLI scans repository for file patterns matching known templates
- [ ] **DETECT-04**: CLI uses weighted scoring and confidence threshold for suggestions
- [ ] **DETECT-05**: CLI shows confidence scores in interactive mode
- [ ] **DETECT-06**: CLI allows user to override auto-detection suggestions

### Interactive Selection

- [ ] **INTERACT-01**: CLI provides fuzzy search interface via @clack/prompts
- [ ] **INTERACT-02**: CLI supports multi-select for template selection
- [ ] **INTERACT-03**: CLI suggests platform templates (Windows, macOS, Linux) by default
- [ ] **INTERACT-04**: CLI supports `--no-defaults` flag to opt-out of default template suggestions
- [ ] **INTERACT-05**: CLI supports `--exclude <templates>` flag to exclude specific templates from defaults or scanning

### Composability

- [ ] **COMPOSE-01**: CLI supports combining full range of features: add named templates, exclude defaults, enable/disable scanning, and interactivity all in a single invocation
- [ ] **COMPOSE-02**: Templates are specified by name (e.g., `gitignorer Python Node`), no special `--platform` flag needed
- [ ] **COMPOSE-03**: Exclusions work on both default templates and scanned templates

### Smart Merge

- [ ] **MERGE-01**: CLI parses existing .gitignore before writing
- [ ] **MERGE-02**: CLI identifies custom rules vs template rules via comment markers
- [ ] **MERGE-03**: CLI preserves custom rules AND custom comments at bottom of file
- [ ] **MERGE-04**: CLI adds templates with `### START: <Template> ###` and `### END: <Template> ###` markers
- [ ] **MERGE-05**: CLI includes header comment listing all included templates
- [ ] **MERGE-06**: CLI includes end marker and instructions to add custom rules at bottom
- [ ] **MERGE-07**: CLI removes existing rules covered by templates (sophisticated matching, not exact)
- [ ] **MERGE-08**: CLI preserves user negation rules (e.g., `!important.log`)

### Safety

- [ ] **SAFE-01**: CLI provides `--dry-run` flag to validate without writing
- [ ] **SAFE-02**: CLI shows what would be written in dry-run mode
- [ ] **SAFE-03**: CLI validates safe output directory (sandboxed to CWD)
- [ ] **SAFE-04**: CLI rejects control characters (ASCII below 0x20)
- [ ] **SAFE-05**: CLI rejects `?`, `#`, `%` in resource IDs (query injection prevention)

### Update

- [ ] **UPDATE-01**: User can run `gitignorer update` to regenerate .gitignore with latest templates
- [ ] **UPDATE-02**: Update command re-scans repository and regenerates .gitignore
- [ ] **UPDATE-03**: Update command updates template cache as a side effect
- [ ] **UPDATE-04**: Update command operates non-destructively (preserves custom rules/comments)

### Project Structure

- [ ] **STRUCT-01**: CLI uses named modules (cache/, git/, scanner/, merger/, schema/)
- [ ] **STRUCT-02**: CLI avoids generic `utils/` directory
- [ ] **STRUCT-03**: CLI separates concerns: cli/, parsers/, schema/, services/, formatters/

## v2 Requirements (Deferred)

- [ ] **V2-01**: MCP server for typed JSON-RPC interface over stdio
- [ ] **V2-02**: Response sanitization layer for prompt injection defense
- [ ] **V2-03**: Live schema resolution from discovery documents
- [ ] **V2-04**: `--fields` flag to limit response size for context window protection

## Out of Scope

- **Web UI** — CLI only, both terminal and scriptable. Web interface is out of scope.
- **Custom Templates** — Uses only github/gitignore templates. Users create custom rules via negation.
- **Global Configuration** — Per-project configuration via flags only. No `$HOME/.gitignorerc`.
- **Template Editing** — Users should use negation rules instead of editing templates directly.
- **Git Integration** — Writes files, doesn't modify git config or `.git/info/exclude`.
- **Authentication** — Public git clone only, no auth required.
- **MCP Server** — Modern agents use bash tools and invoke CLI directly with agent-first I/O.

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| CLI-01 | Phase 1 | Pending |
| CLI-02 | Phase 1 | Pending |
| CLI-03 | Phase 1 | Pending |
| CLI-04 | Phase 1 | Pending |
| CLI-05 | Phase 1 | Pending |
| CLI-06 | Phase 1 | Pending |
| CLI-07 | Phase 1 | Pending |
| INPUT-01 | Phase 1 | Pending |
| INPUT-02 | Phase 1 | Pending |
| INPUT-03 | Phase 1 | Pending |
| INPUT-04 | Phase 1 | Pending |
| INPUT-05 | Phase 1 | Pending |
| INPUT-06 | Phase 1 | Pending |
| OUTPUT-01 | Phase 1 | Pending |
| OUTPUT-02 | Phase 1 | Pending |
| OUTPUT-03 | Phase 1 | Pending |
| OUTPUT-04 | Phase 1 | Pending |
| OUTPUT-05 | Phase 1 | Pending |
| OUTPUT-06 | Phase 1 | Pending |
| OUTPUT-07 | Phase 1 | Pending |
| OUTPUT-08 | Phase 1 | Pending |
| SAFE-01 | Phase 1 | Pending |
| SAFE-02 | Phase 1 | Pending |
| SAFE-03 | Phase 2 | Pending |
| SAFE-04 | Phase 2 | Pending |
| SAFE-05 | Phase 2 | Pending |
| STRUCT-01 | Phase 1 | Pending |
| STRUCT-02 | Phase 1 | Pending |
| STRUCT-03 | Phase 1 | Pending |
| TMPL-01 | Phase 2 | Pending |
| TMPL-02 | Phase 2 | Pending |
| TMPL-03 | Phase 2 | Pending |
| TMPL-04 | Phase 2 | Pending |
| TMPL-05 | Phase 2 | Pending |
| TMPL-06 | Phase 2 | Pending |
| CMD-04 | Phase 2 | Pending |
| CMD-01 | Phase 3 | Pending |
| CMD-02 | Phase 3 | Pending |
| CMD-03 | Phase 3 | Pending |
| DETECT-01 | Phase 3 | Pending |
| DETECT-02 | Phase 3 | Pending |
| DETECT-03 | Phase 3 | Pending |
| DETECT-04 | Phase 3 | Pending |
| DETECT-05 | Phase 3 | Pending |
| DETECT-06 | Phase 3 | Pending |
| INTERACT-01 | Phase 3 | Pending |
| INTERACT-02 | Phase 3 | Pending |
| INTERACT-03 | Phase 3 | Pending |
| INTERACT-04 | Phase 3 | Pending |
| INTERACT-05 | Phase 3 | Pending |
| COMPOSE-01 | Phase 3 | Pending |
| COMPOSE-02 | Phase 3 | Pending |
| COMPOSE-03 | Phase 3 | Pending |
| MERGE-01 | Phase 3 | Pending |
| MERGE-02 | Phase 3 | Pending |
| MERGE-03 | Phase 3 | Pending |
| MERGE-04 | Phase 3 | Pending |
| MERGE-05 | Phase 3 | Pending |
| MERGE-06 | Phase 3 | Pending |
| MERGE-07 | Phase 3 | Pending |
| MERGE-08 | Phase 3 | Pending |
| CMD-05 | Phase 4 | Pending |
| CMD-06 | Phase 4 | Pending |
| CMD-07 | Phase 4 | Pending |
| UPDATE-01 | Phase 4 | Pending |
| UPDATE-02 | Phase 4 | Pending |
| UPDATE-03 | Phase 4 | Pending |
| UPDATE-04 | Phase 4 | Pending |

---
*Last updated: 2026-04-19 after roadmap creation*

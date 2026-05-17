# Requirements

## Active

### R001 — User can invoke CLI with `gitignorer` command

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: CLI-01

User can invoke CLI with `gitignorer` command

### R002 — CLI supports interactive mode (default, TTY detected)

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: CLI-02

CLI supports interactive mode (default, TTY detected)

### R003 — CLI supports non-interactive mode via `--yes` flag

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: CLI-03

CLI supports non-interactive mode via `--yes` flag

### R004 — CLI supports agent mode via `--input json` flag

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: CLI-04

CLI supports agent mode via `--input json` flag

### R005 — CLI detects non-TTY (piped) and auto-disables interactivity

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: CLI-05

CLI detects non-TTY (piped) and auto-disables interactivity

### R006 — All I/O operations are non-blocking for pipe compatibility

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: CLI-06

All I/O operations are non-blocking for pipe compatibility

### R007 — User can run `gitignorer help` to show usage information

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: CLI-07

User can run `gitignorer help` to show usage information

### R008 — CLI validates all inputs via Zod schemas before execution

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: INPUT-01

CLI validates all inputs via Zod schemas before execution

### R009 — CLI rejects dangerous patterns (path traversal, control chars, query injection)

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: INPUT-02

CLI rejects dangerous patterns (path traversal, control chars, query injection)

### R010 — CLI supports `--input json` flag for structured JSON input (shorthand: `--json`)

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: INPUT-03

CLI supports `--input json` flag for structured JSON input (shorthand: `--json`)

### R011 — CLI supports JSON payload via stdin

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: INPUT-04

CLI supports JSON payload via stdin

### R012 — CLI provides `examples <command>` to show JSON payloads

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: INPUT-05

CLI provides `examples <command>` to show JSON payloads

### R013 — CLI provides `schema <resource>` for runtime introspection

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: INPUT-06

CLI provides `schema <resource>` for runtime introspection

### R014 — CLI supports `--output json` flag for structured JSON output

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: OUTPUT-01

CLI supports `--output json` flag for structured JSON output

### R015 — CLI supports `--output ndjson` flag for streaming large results

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: OUTPUT-02

CLI supports `--output ndjson` flag for streaming large results

### R016 — CLI supports `--output stdout` flag to explicitly write to stdout

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: OUTPUT-03

CLI supports `--output stdout` flag to explicitly write to stdout

### R017 — CLI defaults to writing .gitignore file when TTY detected

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: OUTPUT-04

CLI defaults to writing .gitignore file when TTY detected

### R018 — CLI defaults to stdout when non-TTY (piped) detected

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: OUTPUT-05

CLI defaults to stdout when non-TTY (piped) detected

### R019 — When outputting JSON (`--output json` or agent mode), CLI writes JSON data to stdout and messages/errors to stderr (channels never mixed)

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: OUTPUT-06

When outputting JSON (`--output json` or agent mode), CLI writes JSON data to stdout and messages/errors to stderr (channels never mixed)

### R020 — CLI returns structured error JSON for all error types

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: OUTPUT-07

CLI returns structured error JSON for all error types

### R021 — CLI includes exit codes: 1 (validation), 2 (git), 3 (fs), 4 (business logic)

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: OUTPUT-08

CLI includes exit codes: 1 (validation), 2 (git), 3 (fs), 4 (business logic)

### R022 — User can run `gitignorer generate` to create .gitignore (default command)

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: CMD-01

User can run `gitignorer generate` to create .gitignore (default command)

### R023 — User can run `gitignorer scan` to detect matching templates

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: CMD-02

User can run `gitignorer scan` to detect matching templates

### R024 — User can run `gitignorer search <query>` to search templates

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: CMD-03

User can run `gitignorer search <query>` to search templates

### R025 — User can run `gitignorer list` to discover all available templates

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: CMD-04

User can run `gitignorer list` to discover all available templates

### R026 — User can run `gitignorer update` to regenerate .gitignore with latest templates

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: CMD-05

User can run `gitignorer update` to regenerate .gitignore with latest templates

### R027 — User can run `gitignorer examples <command>` for JSON examples

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: CMD-06

User can run `gitignorer examples <command>` for JSON examples

### R028 — User can run `gitignorer schema <resource>` for schema introspection

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: CMD-07

User can run `gitignorer schema <resource>` for schema introspection

### R029 — CLI clones github/gitignore repository to local cache via simple-git

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: TMPL-01

CLI clones github/gitignore repository to local cache via simple-git

### R030 — CLI hard fails on clone errors with actionable error message

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: TMPL-02

CLI hard fails on clone errors with actionable error message

### R031 — CLI stores templates in cross-platform cache via env-paths

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: TMPL-03

CLI stores templates in cross-platform cache via env-paths

### R032 — CLI supports `--offline` flag to skip network operations and use only cached templates

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: TMPL-04

CLI supports `--offline` flag to skip network operations and use only cached templates

### R033 — CLI checks cache before network operations

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: TMPL-05

CLI checks cache before network operations

### R034 — CLI updates cache as a side effect when commands use templates (no separate update command needed)

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: TMPL-06

CLI updates cache as a side effect when commands use templates (no separate update command needed)

### R035 — CLI supports `--scan` flag to enable automatic repository scanning

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: DETECT-01

CLI supports `--scan` flag to enable automatic repository scanning

### R036 — CLI supports `--no-scan` flag to disable automatic repository scanning

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: DETECT-02

CLI supports `--no-scan` flag to disable automatic repository scanning

### R037 — When scanning is enabled, CLI scans repository for file patterns matching known templates

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: DETECT-03

When scanning is enabled, CLI scans repository for file patterns matching known templates

### R038 — CLI uses weighted scoring and confidence threshold for suggestions

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: DETECT-04

CLI uses weighted scoring and confidence threshold for suggestions

### R039 — CLI shows confidence scores in interactive mode

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: DETECT-05

CLI shows confidence scores in interactive mode

### R040 — CLI allows user to override auto-detection suggestions

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: DETECT-06

CLI allows user to override auto-detection suggestions

### R041 — CLI provides fuzzy search interface via @clack/prompts

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: INTERACT-01

CLI provides fuzzy search interface via @clack/prompts

### R042 — CLI supports multi-select for template selection

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: INTERACT-02

CLI supports multi-select for template selection

### R043 — CLI suggests platform templates (Windows, macOS, Linux) by default

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: INTERACT-03

CLI suggests platform templates (Windows, macOS, Linux) by default

### R044 — CLI supports `--no-defaults` flag to opt-out of default template suggestions

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: INTERACT-04

CLI supports `--no-defaults` flag to opt-out of default template suggestions

### R045 — CLI supports `--exclude <templates>` flag to exclude specific templates from defaults or scanning

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: INTERACT-05

CLI supports `--exclude <templates>` flag to exclude specific templates from defaults or scanning

### R046 — CLI supports combining full range of features: add named templates, exclude defaults, enable/disable scanning, and interactivity all in a single invocation

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: COMPOSE-01

CLI supports combining full range of features: add named templates, exclude defaults, enable/disable scanning, and interactivity all in a single invocation

### R047 — Templates are specified by name (e.g., `gitignorer Python Node`), no special `--platform` flag needed

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: COMPOSE-02

Templates are specified by name (e.g., `gitignorer Python Node`), no special `--platform` flag needed

### R048 — Exclusions work on both default templates and scanned templates

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: COMPOSE-03

Exclusions work on both default templates and scanned templates

### R049 — CLI parses existing .gitignore before writing

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: MERGE-01

CLI parses existing .gitignore before writing

### R050 — CLI identifies custom rules vs template rules via comment markers

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: MERGE-02

CLI identifies custom rules vs template rules via comment markers

### R051 — CLI preserves custom rules AND custom comments at bottom of file

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: MERGE-03

CLI preserves custom rules AND custom comments at bottom of file

### R052 — CLI adds templates with `### START: <Template> ###` and `### END: <Template> ###` markers

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: MERGE-04

CLI adds templates with `### START: <Template> ###` and `### END: <Template> ###` markers

### R053 — CLI includes header comment listing all included templates

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: MERGE-05

CLI includes header comment listing all included templates

### R054 — CLI includes end marker and instructions to add custom rules at bottom

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: MERGE-06

CLI includes end marker and instructions to add custom rules at bottom

### R055 — CLI removes existing rules covered by templates (sophisticated matching, not exact)

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: MERGE-07

CLI removes existing rules covered by templates (sophisticated matching, not exact)

### R056 — CLI preserves user negation rules (e.g., `!important.log`)

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: MERGE-08

CLI preserves user negation rules (e.g., `!important.log`)

### R057 — CLI provides `--dry-run` flag to validate without writing

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: SAFE-01

CLI provides `--dry-run` flag to validate without writing

### R058 — CLI shows what would be written in dry-run mode

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: SAFE-02

CLI shows what would be written in dry-run mode

### R059 — CLI validates safe output directory (sandboxed to CWD)

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: SAFE-03

CLI validates safe output directory (sandboxed to CWD)

### R060 — CLI rejects control characters (ASCII below 0x20)

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: SAFE-04

CLI rejects control characters (ASCII below 0x20)

### R061 — CLI rejects `?`, `#`, `%` in resource IDs (query injection prevention)

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: SAFE-05

CLI rejects `?`, `#`, `%` in resource IDs (query injection prevention)

### R062 — User can run `gitignorer update` to regenerate .gitignore with latest templates

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: UPDATE-01

User can run `gitignorer update` to regenerate .gitignore with latest templates

### R063 — Update command re-scans repository and regenerates .gitignore

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: UPDATE-02

Update command re-scans repository and regenerates .gitignore

### R064 — Update command updates template cache as a side effect

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: UPDATE-03

Update command updates template cache as a side effect

### R065 — Update command operates non-destructively (preserves custom rules/comments)

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: UPDATE-04

Update command operates non-destructively (preserves custom rules/comments)

### R066 — CLI uses named modules (cache/, git/, scanner/, merger/, schema/)

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: STRUCT-01

CLI uses named modules (cache/, git/, scanner/, merger/, schema/)

### R067 — CLI avoids generic `utils/` directory

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: STRUCT-02

CLI avoids generic `utils/` directory

### R068 — CLI separates concerns: cli/, parsers/, schema/, services/, formatters/

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: STRUCT-03

CLI separates concerns: cli/, parsers/, schema/, services/, formatters/

### R069 — MCP server for typed JSON-RPC interface over stdio

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: V2-01

MCP server for typed JSON-RPC interface over stdio

### R070 — Response sanitization layer for prompt injection defense

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: V2-02

Response sanitization layer for prompt injection defense

### R071 — Live schema resolution from discovery documents

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: V2-03

Live schema resolution from discovery documents

### R072 — `--fields` flag to limit response size for context window protection

- Status: active
- Class: core-capability
- Source: inferred
- Primary Slice: none yet

Legacy ID: V2-04

`--fields` flag to limit response size for context window protection

## Validated

## Deferred

## Out of Scope

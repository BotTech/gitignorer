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

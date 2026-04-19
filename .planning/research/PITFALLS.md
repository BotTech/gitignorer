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

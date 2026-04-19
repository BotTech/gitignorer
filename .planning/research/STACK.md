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

<!-- GSD:project-start source:PROJECT.md -->
## Project

**Gitignorer**

An agent-first CLI tool that generates intelligent `.gitignore` files by auto-detecting technologies from repository content, intelligently merging with existing ignore rules, and keeping ignore rules up-to-date with evolving technology ecosystems. Serves both humans and AI agents with structured output.

**Core Value:** Generate and maintain the right `.gitignore` for your project automatically — detect tech stack, merge intelligently with existing rules, keep templates current with upstream updates, and support both interactive and programmatic usage.

### Constraints

- **Language**: TypeScript
- **Runtime**: Node.js
- **Interactive UI**: Must use @clack/prompts for interactive prompts
- **Cache location**: Must use env-paths or xdg-basedir for local cache
- **Agent compatibility**: All commands must support structured JSON input/output
- **Async I/O**: All operations must be non-blocking for pipe compatibility
- **Security**: Input validation for path traversal, query injection, control chars
<!-- GSD:project-end -->

<!-- GSD:stack-start source:research/STACK.md -->
## Technology Stack

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
### Git Clone Strategy
### Async I/O Foundation
### Dual Input Parser
### Layered Output
### Schema-Driven Validation
## Dependencies Summary
## Directory Naming Convention
## Version Verification Notes
- All versions target 2026 releases (latest verified via official docs)
- Commander.js 13.x provides best TypeScript/ESM support
- @clack/prompts 0.9.x actively maintained, native ESM
- env-paths 4.x stable, handles all platforms correctly
- simple-git 3.27.x mature, well-tested
- zod 4.0.x latest major version
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

Conventions not yet established. Will populate as patterns emerge during development.
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

Architecture not yet mapped. Follow existing patterns found in the codebase.
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

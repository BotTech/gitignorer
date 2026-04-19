# Roadmap

## Phases

- [ ] **Phase 1: Foundation & Infrastructure** - Core CLI framework with three execution modes, validation, and I/O handling
- [ ] **Phase 2: Template Management** - Git clone, cache management, and template operations
- [ ] **Phase 3: Core Features** - Auto-detection, interactive selection, and smart merge
- [ ] **Phase 4: Polish & Safety** - Update workflow, safety features, and error handling

## Phase Details

### Phase 1: Foundation & Infrastructure
**Goal**: CLI runs in three modes (interactive, non-interactive, agent) with proper validation, I/O separation, and structured output
**Depends on**: Nothing (first phase)
**Requirements**: CLI-01, CLI-02, CLI-03, CLI-04, CLI-05, CLI-06, CLI-07, INPUT-01, INPUT-02, INPUT-03, INPUT-04, INPUT-05, INPUT-06, OUTPUT-01, OUTPUT-02, OUTPUT-03, OUTPUT-04, OUTPUT-05, OUTPUT-06, OUTPUT-07, OUTPUT-08, SAFE-01, SAFE-02, STRUCT-01, STRUCT-02, STRUCT-03
**Success Criteria** (what must be TRUE):
  1. User can invoke `gitignorer help` and see usage information
  2. CLI detects TTY and automatically switches between interactive/non-interactive modes
  3. User can run commands with `--input json` for structured input and `--output json` for structured output
  4. All inputs are validated via Zod schemas and dangerous patterns are rejected
  5. Data writes to stdout and messages write to stderr (channels never mixed)
**Plans**: TBD

### Phase 2: Template Management
**Goal**: CLI clones, caches, and serves github/gitignore templates reliably
**Depends on**: Phase 1
**Requirements**: TMPL-01, TMPL-02, TMPL-03, TMPL-04, TMPL-05, TMPL-06, CMD-04, SAFE-03, SAFE-04, SAFE-05
**Success Criteria** (what must be TRUE):
  1. CLI clones github/gitignore repository to local cache via simple-git
  2. CLI hard fails on clone errors with actionable error messages
  3. CLI stores templates in cross-platform cache location via env-paths
  4. User can run `gitignorer list` to discover all available templates
  5. CLI validates safe output directory (sandboxed to CWD) and rejects control characters
**Plans**: TBD

### Phase 3: Core Features
**Goal**: Users can generate .gitignore files through auto-detection, interactive selection, or explicit template specification
**Depends on**: Phase 2
**Requirements**: CMD-01, CMD-02, CMD-03, DETECT-01, DETECT-02, DETECT-03, DETECT-04, DETECT-05, DETECT-06, INTERACT-01, INTERACT-02, INTERACT-03, INTERACT-04, INTERACT-05, COMPOSE-01, COMPOSE-02, COMPOSE-03, MERGE-01, MERGE-02, MERGE-03, MERGE-04, MERGE-05, MERGE-06, MERGE-07, MERGE-08
**Success Criteria** (what must be TRUE):
  1. User can run `gitignorer generate` to create .gitignore with auto-detected templates
  2. User can run `gitignorer scan` to detect matching templates without writing files
  3. User can run `gitignorer search <query>` to fuzzy search available templates
  4. CLI provides fuzzy search interface via @clack/prompts for interactive template selection
  5. CLI intelligently merges templates with existing .gitignore, preserving custom rules and comments
**Plans**: TBD

### Phase 4: Polish & Safety
**Goal**: CLI stays current with template updates and provides comprehensive update and safety features
**Depends on**: Phase 3
**Requirements**: CMD-05, CMD-06, CMD-07, UPDATE-01, UPDATE-02, UPDATE-03, UPDATE-04
**Success Criteria** (what must be TRUE):
  1. User can run `gitignorer update` to regenerate .gitignore with latest templates
  2. Update command re-scans repository and regenerates .gitignore non-destructively
  3. User can run `gitignorer examples <command>` to see example JSON payloads
  4. User can run `gitignorer schema <resource>` for runtime schema introspection
  5. All operations support `--dry-run` flag to validate before writing
**Plans**: TBD

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Infrastructure | 0/3 | Not started | - |
| 2. Template Management | 0/3 | Not started | - |
| 3. Core Features | 0/3 | Not started | - |
| 4. Polish & Safety | 0/3 | Not started | - |

---
*Created: 2026-04-19*

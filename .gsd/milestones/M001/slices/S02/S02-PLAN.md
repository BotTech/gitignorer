# S02: Template Management

**Goal:** Implement template management infrastructure — clone and cache github/gitignore repository via git service and cache service, enabling the update command to work.
**Demo:** unit tests prove Template Management works

## Must-Haves

- Unit tests prove Template Management works: git service can clone/pull templates, cache service manages cache directories and lists templates, update command successfully updates cached templates.

## Proof Level

- This slice proves: contract

## Integration Closure

Services are created and wired to update command. Core features (generate, scan, list, search) will consume these services in S03. Update command is the first real user-facing command with backend services.

## Verification

- Git operations surface GitError on failures (exit code 2). Cache operations surface FsError on permission failures (exit code 3). Update command provides clear success/error messages via formatters. No metrics/structured logging yet — that's a future enhancement.

## Tasks

- [x] **T01: Install simple-git and create git.service.ts** `est:45m`
  Install simple-git dependency and create git.service.ts with cloneTemplates(), pullUpdates(), and getTemplatePath() methods. Why: Template management requires git operations to clone github/gitignore repository and pull updates. Done when: Package includes simple-git, service is TypeScript-compilable, and all three methods exist with correct signatures and error handling.
  - Files: `package.json`, `src/services/git.service.ts`
  - Verify: npm run build && test -f dist/services/git.service.js && grep -q 'cloneTemplates\|pullUpdates\|getTemplatePath' src/services/git.service.ts

- [ ] **T02: Create cache.service.ts** `est:45m`
  Create cache.service.ts with getCacheDir(), ensureCacheDir(), and listTemplates() methods using env-paths (already in package.json from S01). Why: Cache service manages platform-specific cache directory and discovers available templates for list/search/generate commands. Done when: Service is TypeScript-compilable, methods exist, cache directory is created on demand, and templates are discovered from cache.
  - Files: `src/services/cache.service.ts`
  - Verify: npm run build && test -f dist/services/cache.service.js && grep -q 'getCacheDir\|ensureCacheDir\|listTemplates' src/services/cache.service.ts

- [ ] **T03: Wire services to update command** `est:30m`
  Wire git service and cache service into update command, replacing stub implementation with real functionality. Why: Update command needs to actually update cached templates from github/gitignore repository. Done when: update command uses git.service.ts to clone/pull and cache.service.ts for cache management, providing formatted success/error output.
  - Files: `src/commands/update.ts`
  - Verify: npm run build && grep -q 'import.*git\.service' src/commands/update.ts && grep -q 'import.*cache\.service' src/commands/update.ts && ! grep -q 'Not yet implemented' src/commands/update.ts

- [ ] **T04: Create unit tests for services** `est:1h`
  Create unit tests for git.service.ts and cache.service.ts using Node.js built-in test runner. Why: Tests prove both services work correctly and provide regression protection. Done when: Tests exist, pass, cover main operations (clone/pull, cache dir creation, template listing).
  - Files: `tests/services/git.service.test.ts`, `tests/services/cache.service.test.ts`, `package.json`
  - Verify: npm run build && node --test tests/services/*.test.ts

## Files Likely Touched

- package.json
- src/services/git.service.ts
- src/services/cache.service.ts
- src/commands/update.ts
- tests/services/git.service.test.ts
- tests/services/cache.service.test.ts

# Phase 1: Foundation & Infrastructure - Pattern Map

**Mapped:** 2026-04-22
**Files analyzed:** 28 (new files)
**Analogs found:** 0 / 28 (greenfield project)

## File Classification

| New/Modified File | Role | Data Flow | Closest Analog | Match Quality |
|-------------------|------|-----------|----------------|---------------|
| `src/bin.ts` | entry | request-response | None | greenfield |
| `src/index.ts` | entry | request-response | None | greenfield |
| `src/cli/program.ts` | config | request-response | None | greenfield |
| `src/cli/mode.ts` | utility | request-response | None | greenfield |
| `src/cli/flags.ts` | utility | request-response | None | greenfield |
| `src/cli/error-handler.ts` | middleware | event-driven | None | greenfield |
| `src/commands/help.ts` | controller | request-response | None | greenfield |
| `src/commands/generate.ts` | controller | request-response | None | greenfield |
| `src/commands/scan.ts` | controller | request-response | None | greenfield |
| `src/commands/list.ts` | controller | request-response | None | greenfield |
| `src/commands/search.ts` | controller | request-response | None | greenfield |
| `src/commands/update.ts` | controller | request-response | None | greenfield |
| `src/commands/examples.ts` | controller | request-response | None | greenfield |
| `src/commands/schema.ts` | controller | request-response | None | greenfield |
| `src/parsers/stdin.ts` | parser | streaming | None | greenfield |
| `src/parsers/flags.ts` | parser | request-response | None | greenfield |
| `src/schema/input.ts` | schema | request-response | None | greenfield |
| `src/schema/output.ts` | schema | request-response | None | greenfield |
| `src/schema/errors.ts` | schema | request-response | None | greenfield |
| `src/services/cache.ts` | service | CRUD | None | greenfield |
| `src/services/git.ts` | service | CRUD | None | greenfield |
| `src/services/scanner.ts` | service | CRUD | None | greenfield |
| `src/services/merger.ts` | service | CRUD | None | greenfield |
| `src/formatters/human.ts` | formatter | request-response | None | greenfield |
| `src/formatters/json.ts` | formatter | request-response | None | greenfield |
| `src/formatters/ndjson.ts` | formatter | streaming | None | greenfield |
| `src/formatters/dry-run.ts` | formatter | request-response | None | greenfield |
| `tsconfig.json` | config | - | None | greenfield |
| `package.json` | config | - | None | greenfield |

## Pattern Assignments

### `src/bin.ts` (entry, request-response)

**Analog:** None (greenfield) — Pattern from RESEARCH.md § Architecture Patterns

**CLI binary entry point pattern** (RESEARCH.md lines 231-235):
```typescript
#!/usr/bin/env node

import { program } from './cli/program.js';
import { resolveMode } from './cli/mode.js';
import { handleTopLevelError } from './cli/error-handler.js';

// Resolve mode once at startup
const mode = resolveMode({
  isTTY: process.stdout.isTTY ?? false,
  hasInputFlag: program.opts().input === 'json',
  hasYesFlag: program.opts().yes === true
});

// Parse and handle errors
program.parseAsync(process.argv).catch(handleTopLevelError);
```

**Key pattern points:**
- Shebang for executable binary
- ESM imports (use `.js` extensions)
- Single mode resolution at startup
- Async parsing for pipe compatibility
- Top-level error handling

---

### `src/index.ts` (entry, request-response)

**Analog:** None (greenfield) — Library export pattern

**Library export pattern:**
```typescript
// Programmatic API exports for library usage
export { generateGitignore } from './services/generator.js';
export { scanRepository } from './services/scanner.js';
export { listTemplates } from './services/cache.js';
export type { GenerateOptions, ScanResult, TemplateInfo } from './schema/output.js';
```

**Key pattern points:**
- Export high-level operations
- Export TypeScript types for consumers
- Keep API surface minimal and focused

---

### `src/cli/program.ts` (config, request-response)

**Analog:** None (greenfield) — Pattern from RESEARCH.md § Pattern 2

**Commander.js program configuration pattern** (RESEARCH.md lines 302-323):
```typescript
import { Command } from 'commander';
import { createHelpCommand } from '../commands/help.js';
import { createGenerateCommand } from '../commands/generate.js';
// ... other command imports

export function createProgram(): Command {
  const program = new Command();

  program
    .name('gitignorer')
    .description('Generate intelligent .gitignore files')
    .version('1.0.0');

  // Configure output to separate channels
  program.configureOutput({
    writeOut: (str: string) => process.stdout.write(str),
    writeErr: (str: string) => process.stderr.write(str),
    outputError: (str: string, write: (s: string) => void) => {
      write(`\x1b[31m${str}\x1b[0m`); // Red errors for humans
    }
  });

  // Register commands
  program.addCommand(createHelpCommand());
  program.addCommand(createGenerateCommand());
  // ... register other commands

  return program;
}
```

**Key pattern points:**
- Factory function returns configured Command
- `configureOutput()` separates stdout/stderr
- Red ANSI colors for errors (human mode)
- Each command is a factory function

---

### `src/cli/mode.ts` (utility, request-response)

**Analog:** None (greenfield) — Pattern from RESEARCH.md § Pattern 1

**Mode resolver pattern** (RESEARCH.md lines 268-299):
```typescript
export enum CliMode {
  INTERACTIVE = 'INTERACTIVE',
  NON_INTERACTIVE = 'NON_INTERACTIVE',
  AGENT = 'AGENT'
}

export interface ModeOptions {
  isTTY: boolean;
  hasInputFlag: boolean;
  hasYesFlag: boolean;
}

export function resolveMode(options: ModeOptions): CliMode {
  if (options.hasInputFlag) {
    return CliMode.AGENT;
  }
  if (!options.isTTY || options.hasYesFlag) {
    return CliMode.NON_INTERACTIVE;
  }
  return CliMode.INTERACTIVE;
}

export function isInteractiveMode(mode: CliMode): boolean {
  return mode === CliMode.INTERACTIVE;
}

export function isAgentMode(mode: CliMode): boolean {
  return mode === CliMode.AGENT;
}
```

**Key pattern points:**
- Enum for type safety
- Single function resolves mode based on flags/TTY
- Agent mode takes priority (hasInputFlag)
- Helper functions for mode checks

---

### `src/cli/flags.ts` (utility, request-response)

**Analog:** None (greenfield) — Pattern from RESEARCH.md § Pattern 4

**Common flags pattern** (RESEARCH.md lines 383-427):
```typescript
import { OptionValues } from 'commander';

export interface CommonFlags {
  output?: 'json' | 'ndjson' | 'stdout';
  input?: 'json';
  yes?: boolean;
  dryRun?: boolean;
}

export function getCommonFlags(opts: OptionValues): CommonFlags {
  return {
    output: opts.output,
    input: opts.input,
    yes: opts.yes,
    dryRun: opts.dryRun
  };
}

export function applyCommonFlags(
  command: Command,
  options: Partial<CommonFlags> = {}
): Command {
  if (options.output !== undefined) {
    command.option('--output <format>', 'Output format (json|ndjson|stdout)', options.output);
  }
  if (options.input !== undefined) {
    command.option('--input <format>', 'Input format (json)', options.input);
  }
  if (options.yes !== undefined) {
    command.option('--yes', 'Skip confirmation prompts', options.yes);
  }
  if (options.dryRun !== undefined) {
    command.option('--dry-run', 'Show what would be written without writing', options.dryRun);
  }
  return command;
}
```

**Key pattern points:**
- TypeScript interface for type safety
- `getCommonFlags()` extracts from Commander opts
- `applyCommonFlags()` applies to commands
- Reusable across all commands

---

### `src/cli/error-handler.ts` (middleware, event-driven)

**Analog:** None (greenfield) — Pattern from RESEARCH.md § Code Examples

**Top-level error handler pattern** (RESEARCH.md lines 641-674):
```typescript
import { ValidationError, GitError, FsError, BusinessError } from '../schema/errors.js';

export function handleTopLevelError(err: unknown): never {
  if (err instanceof ValidationError) {
    console.error(JSON.stringify(err.toJSON()));
    process.exit(1);
  }
  
  if (err instanceof GitError) {
    console.error(JSON.stringify(err.toJSON()));
    process.exit(2);
  }
  
  if (err instanceof FsError) {
    console.error(JSON.stringify(err.toJSON()));
    process.exit(3);
  }
  
  if (err instanceof BusinessError) {
    console.error(JSON.stringify(err.toJSON()));
    process.exit(4);
  }
  
  // Unknown error
  console.error(JSON.stringify({
    error: 'UNKNOWN_ERROR',
    message: err instanceof Error ? err.message : 'Unknown error'
  }));
  process.exit(1);
}
```

**Key pattern points:**
- Type narrowing with instanceof
- Each error type maps to exit code
- `toJSON()` for structured error output
- `never` return type (always exits)
- Fallback for unknown errors

---

### `src/commands/generate.ts` (controller, request-response)

**Analog:** None (greenfield) — Pattern from RESEARCH.md § Pattern 4

**Command factory pattern** (RESEARCH.md lines 401-427):
```typescript
import { Command } from 'commander';
import { getCommonFlags, applyCommonFlags } from '../cli/flags.js';
import { generateInputSchema } from '../schema/input.js';
import { ValidationError } from '../schema/errors.js';

export function createGenerateCommand(): Command {
  const cmd = new Command('generate');
  
  cmd
    .description('Generate .gitignore file (default command)')
    .option('--output <format>', 'Output format', 'stdout')
    .option('--input <format>', 'Input format for structured input')
    .option('--yes', 'Skip confirmation prompts')
    .option('--dry-run', 'Show what would be written without writing')
    .argument('[templates...]', 'Template names to include')
    .action(async (templates, options) => {
      try {
        // Extract common flags
        const flags = getCommonFlags(options);
        
        // Validate input
        const validated = generateInputSchema.parse({
          templates,
          ...flags
        });
        
        // Execute (stub in Phase 1)
        const result = await generateGitignore(validated);
        
        // Format output based on mode
        await formatOutput(result, flags.output);
      } catch (err) {
        if (err instanceof ValidationError) {
          throw err; // Re-throw typed errors
        }
        throw new ValidationError('Validation failed', []);
      }
    });
  
  return cmd;
}
```

**Key pattern points:**
- Factory function returns configured Command
- Async action handler
- Validate with Zod before business logic
- Throw typed errors for top-level handler
- Stub implementation in Phase 1

**Stub pattern for all commands** (Phase 1):
```typescript
// In command action handler
console.log('Not yet implemented');
process.exit(0);
```

---

### `src/commands/help.ts`, `src/commands/scan.ts`, etc. (controller, request-response)

**Analog:** None (greenfield) — Same pattern as `generate.ts`

**All command files follow the same structure:**
1. Import dependencies (Commander, flags, schemas, services)
2. Export `createCommandName()` factory function
3. Configure command (description, options, arguments)
4. Async action handler
5. Return configured Command

**Stub implementation pattern** (Phase 1 only):
```typescript
.action(async (options) => {
  console.log('Command not yet implemented');
  process.exit(0);
});
```

---

### `src/parsers/stdin.ts` (parser, streaming)

**Analog:** None (greenfield) — Pattern from RESEARCH.md § Code Examples

**Async stdin JSON parser pattern** (RESEARCH.md lines 613-639):
```typescript
import { ValidationError } from '../schema/errors.js';

export async function parseStdinJSON<T>(): Promise<T | null> {
  // No piped input
  if (process.stdin.isTTY) {
    return null;
  }

  const chunks: Buffer[] = [];
  
  // Non-blocking read
  for await (const chunk of process.stdin) {
    chunks.push(chunk);
  }

  const data = Buffer.concat(chunks).toString('utf-8').trim();
  
  if (!data) {
    return null;
  }

  try {
    return JSON.parse(data) as T;
  } catch (err) {
    throw new ValidationError('Invalid JSON in stdin', []);
  }
}
```

**Key pattern points:**
- Async iterator for non-blocking I/O
- Check `isTTY` first (no piped input)
- Buffer chunks, concatenate, trim
- Parse JSON with try/catch
- Throw typed ValidationError

---

### `src/parsers/flags.ts` (parser, request-response)

**Analog:** None (greenfield) — Flag value normalizer

**Flag parser pattern:**
```typescript
import { OptionValues } from 'commander';
import { ValidationError } from '../schema/errors.js';

export function parseOutputFlag(value: unknown): 'json' | 'ndjson' | 'stdout' {
  if (value === 'json' || value === 'ndjson' || value === 'stdout') {
    return value;
  }
  throw new ValidationError(
    `Invalid output format: ${value}. Must be json, ndjson, or stdout`,
    []
  );
}

export function parseInputFlag(value: unknown): 'json' | undefined {
  if (value === undefined || value === 'json') {
    return value;
  }
  throw new ValidationError(
    `Invalid input format: ${value}. Must be json`,
    []
  );
}
```

**Key pattern points:**
- Type guards for flag values
- Validate enum values
- Throw typed ValidationError
- Return typed values

---

### `src/schema/input.ts` (schema, request-response)

**Analog:** None (greenfield) — Pattern from RESEARCH.md § Pattern 3

**Zod input schema pattern** (RESEARCH.md lines 325-343):
```typescript
import { z } from 'zod';

export const jsonInputSchema = z.object({
  command: z.enum(['generate', 'scan', 'list', 'search', 'update']),
  options: z.record(z.unknown()).optional(),
  cwd: z.string().optional()
});

export const dangerousPatternSchema = z.string().refine(
  (val) => !val.includes('..') && !val.includes('\x00'),
  { message: "Path traversal and control characters not allowed" }
);

export const generateInputSchema = z.object({
  templates: z.array(z.string()).optional(),
  output: z.enum(['json', 'ndjson', 'stdout']).optional(),
  yes: z.boolean().optional(),
  dryRun: z.boolean().optional()
});

export const scanInputSchema = z.object({
  cwd: z.string().refine(
    (val) => !val.includes('..'),
    { message: "Path traversal not allowed" }
  ),
  output: z.enum(['json', 'ndjson', 'stdout']).optional()
});
```

**Key pattern points:**
- Organize by command (generateInputSchema, scanInputSchema, etc.)
- Use `z.enum()` for known values
- Use `refine()` for custom validation
- Security refinements (path traversal, control chars)
- Optional fields for flags

---

### `src/schema/output.ts` (schema, request-response)

**Analog:** None (greenfield) — Output shape schemas

**Output schema pattern:**
```typescript
import { z } from 'zod';

export const templateInfoSchema = z.object({
  name: z.string(),
  description: z.string(),
  lines: z.number()
});

export const scanResultSchema = z.object({
  detected: z.array(z.string()),
  suggested: z.array(z.string()),
  confidence: z.number()
});

export const generateResultSchema = z.object({
  templates: z.array(z.string()),
  content: z.string(),
  path: z.string(),
  dryRun: z.boolean().optional()
});

// Type exports
export type TemplateInfo = z.infer<typeof templateInfoSchema>;
export type ScanResult = z.infer<typeof scanResultSchema>;
export type GenerateResult = z.infer<typeof generateResultSchema>;
```

**Key pattern points:**
- Define schemas for all output shapes
- Export inferred TypeScript types
- Use for formatter type safety
- Phase 1: stub schemas, refine in later phases

---

### `src/schema/errors.ts` (schema, request-response)

**Analog:** None (greenfield) — Pattern from RESEARCH.md § Pattern 3

**Custom error classes pattern** (RESEARCH.md lines 344-380):
```typescript
import { z } from 'zod';

export class ValidationError extends Error {
  readonly exitCode = 1;
  readonly code = 'VALIDATION_ERROR';
  
  constructor(message: string, public readonly issues: z.ZodIssue[]) {
    super(message);
    this.name = 'ValidationError';
  }

  toJSON() {
    return {
      error: this.code,
      message: this.message,
      issues: this.issues
    };
  }
}

export class GitError extends Error {
  readonly exitCode = 2;
  readonly code = 'GIT_ERROR';
  
  constructor(message: string, public readonly details?: unknown) {
    super(message);
    this.name = 'GitError';
  }

  toJSON() {
    return {
      error: this.code,
      message: this.message,
      details: this.details
    };
  }
}

export class FsError extends Error {
  readonly exitCode = 3;
  readonly code = 'FS_ERROR';
  
  constructor(message: string, public readonly path?: string) {
    super(message);
    this.name = 'FsError';
  }

  toJSON() {
    return {
      error: this.code,
      message: this.message,
      path: this.path
    };
  }
}

export class BusinessError extends Error {
  readonly exitCode = 4;
  readonly code = 'BUSINESS_ERROR';
  
  constructor(message: string, public readonly context?: Record<string, unknown>) {
    super(message);
    this.name = 'BusinessError';
  }

  toJSON() {
    return {
      error: this.code,
      message: this.message,
      context: this.context
    };
  }
}
```

**Key pattern points:**
- Each error has `exitCode` property
- Each error has `code` string for JSON
- `toJSON()` method for structured output
- Additional context properties
- Type narrowing with instanceof

---

### `src/services/cache.ts`, `src/services/git.ts`, etc. (service, CRUD)

**Analog:** None (greenfield) — Service stub pattern

**Service stub pattern** (Phase 1):
```typescript
// Stub implementation with type signature
export async function getTemplates(): Promise<TemplateInfo[]> {
  // Phase 2: Implement actual logic
  throw new Error('Not yet implemented');
}

export async function updateCache(): Promise<void> {
  // Phase 2: Implement actual logic
  throw new Error('Not yet implemented');
}
```

**Key pattern points:**
- Define function signatures now
- Throw "Not yet implemented" in Phase 1
- Use proper TypeScript types
- Export for command imports

---

### `src/formatters/human.ts` (formatter, request-response)

**Analog:** None (greenfield) — Pattern from RESEARCH.md § Code Examples

**Human formatter pattern** (RESEARCH.md lines 557-574):
```typescript
import { spinner, log } from '@clack/prompts';

export async function formatHuman(result: unknown): Promise<void> {
  const s = spinner();
  
  s.start('Processing...');
  
  // Do formatting work
  await new Promise(resolve => setTimeout(resolve, 100));
  
  s.stop('Complete!');
  
  log.info('Additional information');
  log.success('Success message');
  log.warn('Warning message');
  log.error('Error message');
}
```

**Key pattern points:**
- Use @clack/prompts for all output
- Spinner for async operations
- log methods for different message types
- Auto-degrades to plain text when no TTY

---

### `src/formatters/json.ts` (formatter, request-response)

**Analog:** None (greenfield) — JSON formatter

**JSON formatter pattern:**
```typescript
export function formatJSON(data: unknown): string {
  return JSON.stringify(data, null, 2);
}

export function formatJSONCompact(data: unknown): string {
  return JSON.stringify(data);
}
```

**Key pattern points:**
- `JSON.stringify()` for output
- Pretty print by default
- Compact option for agent mode

---

### `src/formatters/ndjson.ts` (formatter, streaming)

**Analog:** None (greenfield) — NDJSON streaming formatter

**NDJSON formatter pattern:**
```typescript
import ndjson from 'ndjson';

export function formatNDJSON(data: unknown[]): NodeJS.ReadableStream {
  const stream = ndjson.serialize();
  
  for (const item of data) {
    stream.write(item);
  }
  
  stream.end();
  return stream;
}

export async function* streamNDJSON(
  data: AsyncIterable<unknown>
): AsyncGenerator<string, void, unknown> {
  for await (const item of data) {
    yield JSON.stringify(item) + '\n';
  }
}
```

**Key pattern points:**
- Use ndjson package for serialization
- One JSON object per line
- Async generator for streaming
- Newline separator

---

### `src/formatters/dry-run.ts` (formatter, request-response)

**Analog:** None (greenfield) — Dry-run formatter

**Dry-run formatter pattern:**
```typescript
export function formatDryRun(result: { content: string; path: string }): string {
  return `
[DRY RUN] Would write to: ${result.path}
----------------------------------------
${result.content}
----------------------------------------
`;
}

export function formatDryRunJSON(result: { content: string; path: string }) {
  return {
    dryRun: true,
    path: result.path,
    content: result.content,
    length: result.content.length
  };
}
```

**Key pattern points:**
- Show what would be written
- Include metadata (path, length)
- Human and JSON variants
- Clear visual separation

---

### `tsconfig.json` (config)

**Analog:** None (greenfield) — TypeScript configuration

**TypeScript config pattern** (from RESEARCH.md Standard Stack):
```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

**Key pattern points:**
- ES2022 for modern Node.js
- ESM modules (not CommonJS)
- Strict mode enabled
- Source maps for debugging
- Declaration files for library exports

---

### `package.json` (config)

**Analog:** None (greenfield) — Package configuration

**Package.json pattern** (from RESEARCH.md Standard Stack):
```json
{
  "name": "gitignore",
  "version": "1.0.0",
  "description": "Generate intelligent .gitignore files",
  "type": "module",
  "main": "./dist/index.js",
  "bin": {
    "gitignorer": "./dist/bin.js"
  },
  "exports": {
    ".": {
      "import": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsdown",
    "dev": "tsx src/bin.ts",
    "test": "echo \"Tests not yet implemented\""
  },
  "dependencies": {
    "commander": "^13.1.0",
    "@clack/prompts": "^0.9.1",
    "zod": "^4.3.6",
    "env-paths": "^4.0.0"
  },
  "devDependencies": {
    "typescript": "^5.8.0",
    "tsx": "^4.21.0",
    "tsdown": "^0.21.10"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

**Key pattern points:**
- `"type": "module"` for ESM
- Bin entry point for CLI
- Exports for library usage
- Engine requirement for Node.js 18+
- Scripts for build/dev

---

## Shared Patterns

### Authentication
**Not applicable** — CLI does not require authentication in Phase 1

---

### Error Handling
**Source:** RESEARCH.md § Code Examples (lines 641-674)
**Apply to:** All command handlers, error-handler.ts

```typescript
// Custom error classes with exit codes
export class ValidationError extends Error {
  readonly exitCode = 1;
  readonly code = 'VALIDATION_ERROR';
  toJSON() { /* ... */ }
}

// Top-level handler
export function handleTopLevelError(err: unknown): never {
  if (err instanceof ValidationError) {
    console.error(JSON.stringify(err.toJSON()));
    process.exit(1);
  }
  // ... other error types
}
```

---

### Input Validation
**Source:** RESEARCH.md § Pattern 3 (lines 325-343)
**Apply to:** All command handlers, schema/input.ts

```typescript
// Zod schema with refinements
export const dangerousPatternSchema = z.string().refine(
  (val) => !val.includes('..') && !val.includes('\x00'),
  { message: "Path traversal and control characters not allowed" }
);

// Usage in command handler
const validated = schema.parse(rawInput);
```

---

### Async I/O
**Source:** RESEARCH.md § Architecture Patterns
**Apply to:** All file operations, stdin parsing, service calls

```typescript
// Always use async variants
import fs from 'node:fs/promises';

// Async stdin reading
for await (const chunk of process.stdin) {
  chunks.push(chunk);
}

// Async command handler
.action(async (options) => {
  const result = await someAsyncOperation();
});
```

---

### Separated I/O Channels
**Source:** RESEARCH.md § Pattern 2 (lines 302-323)
**Apply to:** program.ts, all formatters

```typescript
// Commander.js output configuration
program.configureOutput({
  writeOut: (str: string) => process.stdout.write(str),  // Data
  writeErr: (str: string) => process.stderr.write(str),  // Messages
  outputError: (str: string, write: (s: string) => void) => {
    write(`\x1b[31m${str}\x1b[0m`); // Red errors
  }
});

// In formatters: data to stdout, messages to stderr
console.log(JSON.stringify(data)); // stdout
console.error('Progress message'); // stderr
```

---

### Mode Resolution
**Source:** RESEARCH.md § Pattern 1 (lines 268-299)
**Apply to:** bin.ts, mode.ts

```typescript
// Resolve once at startup
const mode = resolveMode({
  isTTY: process.stdout.isTTY ?? false,
  hasInputFlag: program.opts().input === 'json',
  hasYesFlag: program.opts().yes === true
});

// Pass mode to formatters
if (mode === CliMode.AGENT) {
  return formatJSON(result);
}
```

---

## No Analog Found

All files are new in this greenfield project. Patterns are derived from:

| Source | Confidence | Files Using Pattern |
|--------|------------|---------------------|
| RESEARCH.md § Architecture Patterns | HIGH | All core infrastructure files |
| RESEARCH.md § Code Examples | HIGH | Command handlers, parsers, formatters |
| RESEARCH.md § Standard Stack | HIGH | tsconfig.json, package.json |
| User's CLI skill (/Users/jason/.agents/skills/gsd-new-cli-project/SKILL.md) | HIGH | Agent-first design patterns |

**No existing codebase patterns to copy** — this phase establishes the foundational patterns for all subsequent phases.

---

## Metadata

**Analog search scope:** Greenfield project (no existing source code)
**Files scanned:** 0 (no existing TypeScript/JavaScript files in src/)
**Pattern extraction date:** 2026-04-22
**Pattern sources:** RESEARCH.md verified patterns, Commander.js docs, @clack/prompts docs, Zod docs, user's CLI skill

**Key differences from typical CLI projects:**
- Agent-first design (structured JSON input/output)
- Three-mode architecture (interactive/non-interactive/agent)
- No middleware validation (each command validates itself)
- Custom error classes with exit codes (1-4)
- Strict I/O channel separation (stdout=数据, stderr=messages)

/**
 * Library entry point for programmatic API.
 *
 * Per CONTEXT.md D-03: Separate entry points (bin.ts for CLI, index.ts for library).
 * In Phase 1, these are stub implementations. Real implementations come in later phases.
 */

/**
 * Generate a .gitignore file.
 *
 * @param options - Generation options
 * @returns Generation result
 * @throws Error - Not yet implemented
 */
export async function generateGitignore(options: unknown): Promise<unknown> {
  throw new Error('Not yet implemented');
}

/**
 * Scan repository for matching templates.
 *
 * @param cwd - Working directory (optional)
 * @returns Scan result
 * @throws Error - Not yet implemented
 */
export async function scanRepository(cwd?: string): Promise<unknown> {
  throw new Error('Not yet implemented');
}

/**
 * List all available templates.
 *
 * @returns List result
 * @throws Error - Not yet implemented
 */
export async function listTemplates(): Promise<unknown> {
  throw new Error('Not yet implemented');
}

// Export TypeScript types from schema/output.ts
export type {
  TemplateInfo,
  ScanResult,
  GenerateResult,
  ListResult,
  SearchResult,
  DryRunResult,
} from './schema/output.js';

// Export CLI mode enum from cli/mode.ts
export { CliMode } from './cli/mode.js';

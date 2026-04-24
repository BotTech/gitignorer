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
export declare function generateGitignore(options: unknown): Promise<unknown>;
/**
 * Scan repository for matching templates.
 *
 * @param cwd - Working directory (optional)
 * @returns Scan result
 * @throws Error - Not yet implemented
 */
export declare function scanRepository(cwd?: string): Promise<unknown>;
/**
 * List all available templates.
 *
 * @returns List result
 * @throws Error - Not yet implemented
 */
export declare function listTemplates(): Promise<unknown>;
export type { TemplateInfo, ScanResult, GenerateResult, ListResult, SearchResult, DryRunResult, } from './schema/output.js';
export { CliMode } from './cli/mode.js';
//# sourceMappingURL=index.d.ts.map
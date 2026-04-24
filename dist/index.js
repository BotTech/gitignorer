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
export async function generateGitignore(options) {
    throw new Error('Not yet implemented');
}
/**
 * Scan repository for matching templates.
 *
 * @param cwd - Working directory (optional)
 * @returns Scan result
 * @throws Error - Not yet implemented
 */
export async function scanRepository(cwd) {
    throw new Error('Not yet implemented');
}
/**
 * List all available templates.
 *
 * @returns List result
 * @throws Error - Not yet implemented
 */
export async function listTemplates() {
    throw new Error('Not yet implemented');
}
// Export CLI mode enum from cli/mode.ts
export { CliMode } from './cli/mode.js';
//# sourceMappingURL=index.js.map
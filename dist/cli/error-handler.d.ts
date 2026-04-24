/**
 * Top-level error handler for the CLI.
 *
 * Maps custom error types to structured JSON output and exit codes.
 * Exit codes: 1=validation, 2=git, 3=filesystem, 4=business logic.
 *
 * Note: Error classes are imported from schema/errors.ts (created in Plan 02).
 * This file sets up the handler structure first.
 */
/**
 * Handles top-level errors with proper exit codes.
 *
 * Uses instanceof type narrowing to map error types to exit codes:
 * - ValidationError: exit code 1
 * - GitError: exit code 2
 * - FsError: exit code 3
 * - BusinessError: exit code 4
 * - Unknown errors: exit code 1
 *
 * @param err - The error to handle
 * @returns Never (always exits process)
 */
export declare function handleTopLevelError(err: unknown): never;
//# sourceMappingURL=error-handler.d.ts.map
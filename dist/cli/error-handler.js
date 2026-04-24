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
export function handleTopLevelError(err) {
    // ValidationError: exit code 1
    if (isValidationError(err)) {
        console.error(JSON.stringify(err.toJSON()));
        process.exit(1);
    }
    // GitError: exit code 2
    if (isGitError(err)) {
        console.error(JSON.stringify(err.toJSON()));
        process.exit(2);
    }
    // FsError: exit code 3
    if (isFsError(err)) {
        console.error(JSON.stringify(err.toJSON()));
        process.exit(3);
    }
    // BusinessError: exit code 4
    if (isBusinessError(err)) {
        console.error(JSON.stringify(err.toJSON()));
        process.exit(4);
    }
    // Unknown error: exit code 1
    const unknownErr = {
        error: 'UNKNOWN_ERROR',
        message: err instanceof Error ? err.message : 'Unknown error',
    };
    console.error(JSON.stringify(unknownErr));
    process.exit(1);
}
/**
 * Type guard for ValidationError.
 * Works with duck typing since class is defined in Plan 02.
 */
function isValidationError(err) {
    return (err instanceof Error &&
        'exitCode' in err &&
        err.exitCode === 1 &&
        'code' in err &&
        err.code === 'VALIDATION_ERROR' &&
        'toJSON' in err);
}
/**
 * Type guard for GitError.
 */
function isGitError(err) {
    return (err instanceof Error &&
        'exitCode' in err &&
        err.exitCode === 2 &&
        'code' in err &&
        err.code === 'GIT_ERROR' &&
        'toJSON' in err);
}
/**
 * Type guard for FsError.
 */
function isFsError(err) {
    return (err instanceof Error &&
        'exitCode' in err &&
        err.exitCode === 3 &&
        'code' in err &&
        err.code === 'FS_ERROR' &&
        'toJSON' in err);
}
/**
 * Type guard for BusinessError.
 */
function isBusinessError(err) {
    return (err instanceof Error &&
        'exitCode' in err &&
        err.exitCode === 4 &&
        'code' in err &&
        err.code === 'BUSINESS_ERROR' &&
        'toJSON' in err);
}
//# sourceMappingURL=error-handler.js.map
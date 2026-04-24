/**
 * Custom error classes with structured output and exit codes.
 *
 * Exit codes:
 * - 1: ValidationError (input validation failures)
 * - 2: GitError (git operation failures)
 * - 3: FsError (filesystem operation failures)
 * - 4: BusinessError (business logic violations)
 */
import type { z } from 'zod';
/**
 * Validation error with Zod issues.
 */
export declare class ValidationError extends Error {
    readonly issues: z.ZodIssue[];
    readonly exitCode = 1;
    readonly code = "VALIDATION_ERROR";
    constructor(message: string, issues: z.ZodIssue[]);
    toJSON(): {
        error: string;
        message: string;
        issues: z.core.$ZodIssue[];
    };
}
/**
 * Git operation error.
 */
export declare class GitError extends Error {
    readonly details?: unknown | undefined;
    readonly exitCode = 2;
    readonly code = "GIT_ERROR";
    constructor(message: string, details?: unknown | undefined);
    toJSON(): {
        details?: {} | null | undefined;
        error: string;
        message: string;
    };
}
/**
 * Filesystem operation error.
 */
export declare class FsError extends Error {
    readonly path?: string | undefined;
    readonly exitCode = 3;
    readonly code = "FS_ERROR";
    constructor(message: string, path?: string | undefined);
    toJSON(): {
        path?: string | undefined;
        error: string;
        message: string;
    };
}
/**
 * Business logic error.
 */
export declare class BusinessError extends Error {
    readonly context?: Record<string, unknown> | undefined;
    readonly exitCode = 4;
    readonly code = "BUSINESS_ERROR";
    constructor(message: string, context?: Record<string, unknown> | undefined);
    toJSON(): {
        context?: Record<string, unknown> | undefined;
        error: string;
        message: string;
    };
}
//# sourceMappingURL=errors.d.ts.map
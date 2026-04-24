/**
 * Custom error classes with structured output and exit codes.
 *
 * Exit codes:
 * - 1: ValidationError (input validation failures)
 * - 2: GitError (git operation failures)
 * - 3: FsError (filesystem operation failures)
 * - 4: BusinessError (business logic violations)
 */
/**
 * Validation error with Zod issues.
 */
export class ValidationError extends Error {
    issues;
    exitCode = 1;
    code = 'VALIDATION_ERROR';
    constructor(message, issues) {
        super(message);
        this.issues = issues;
        this.name = 'ValidationError';
    }
    toJSON() {
        return {
            error: this.code,
            message: this.message,
            issues: this.issues,
        };
    }
}
/**
 * Git operation error.
 */
export class GitError extends Error {
    details;
    exitCode = 2;
    code = 'GIT_ERROR';
    constructor(message, details) {
        super(message);
        this.details = details;
        this.name = 'GitError';
    }
    toJSON() {
        return {
            error: this.code,
            message: this.message,
            ...(this.details !== undefined && { details: this.details }),
        };
    }
}
/**
 * Filesystem operation error.
 */
export class FsError extends Error {
    path;
    exitCode = 3;
    code = 'FS_ERROR';
    constructor(message, path) {
        super(message);
        this.path = path;
        this.name = 'FsError';
    }
    toJSON() {
        return {
            error: this.code,
            message: this.message,
            ...(this.path !== undefined && { path: this.path }),
        };
    }
}
/**
 * Business logic error.
 */
export class BusinessError extends Error {
    context;
    exitCode = 4;
    code = 'BUSINESS_ERROR';
    constructor(message, context) {
        super(message);
        this.context = context;
        this.name = 'BusinessError';
    }
    toJSON() {
        return {
            error: this.code,
            message: this.message,
            ...(this.context !== undefined && { context: this.context }),
        };
    }
}
//# sourceMappingURL=errors.js.map
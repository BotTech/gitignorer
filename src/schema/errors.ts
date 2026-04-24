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
export class ValidationError extends Error {
  readonly exitCode = 1;
  readonly code = 'VALIDATION_ERROR';

  constructor(
    message: string,
    public readonly issues: z.ZodIssue[],
  ) {
    super(message);
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
  readonly exitCode = 2;
  readonly code = 'GIT_ERROR';

  constructor(
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
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
  readonly exitCode = 3;
  readonly code = 'FS_ERROR';

  constructor(
    message: string,
    public readonly path?: string,
  ) {
    super(message);
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
  readonly exitCode = 4;
  readonly code = 'BUSINESS_ERROR';

  constructor(
    message: string,
    public readonly context?: Record<string, unknown>,
  ) {
    super(message);
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

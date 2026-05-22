/**
 * Human-readable output formatter using @clack/prompts.
 *
 * Per CONTEXT.md D-08: Human mode uses @clack/prompts for styled output.
 * Supports success, error, info, and warning messages with appropriate styling.
 */
import { GitError, FsError } from '../schema/errors.js';
/**
 * Formatter result types.
 */
export type FormatterResult = {
    type: 'success';
    message: string;
    details?: string;
} | {
    type: 'error';
    message: string;
    details?: string;
} | {
    type: 'info';
    message: string;
} | {
    type: 'warning';
    message: string;
};
/**
 * Formats output for human-readable display.
 *
 * Uses @clack/prompts styled log methods for appropriate feedback.
 *
 * @param result - The result to format
 */
export declare function formatHuman(result: FormatterResult): Promise<void>;
/**
 * Formats an error result from error classes.
 *
 * @param error - The error to format
 * @returns Formatter result with error type
 */
export declare function formatError(error: GitError | FsError): FormatterResult;
/**
 * Creates a spinner for async operations.
 *
 * @param message - The spinner message
 * @returns Clack spinner instance
 */
export declare function createSpinner(message: string): {
    start: (msg?: string) => void;
    stop: (msg?: string, code?: number) => void;
    message: (msg?: string) => void;
};
//# sourceMappingURL=human.d.ts.map
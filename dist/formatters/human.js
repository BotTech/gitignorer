/**
 * Human-readable output formatter using @clack/prompts.
 *
 * Per CONTEXT.md D-08: Human mode uses @clack/prompts for styled output.
 * Supports success, error, info, and warning messages with appropriate styling.
 */
import { log, spinner } from '@clack/prompts';
import { GitError } from '../schema/errors.js';
/**
 * Formats output for human-readable display.
 *
 * Uses @clack/prompts styled log methods for appropriate feedback.
 *
 * @param result - The result to format
 */
export async function formatHuman(result) {
    switch (result.type) {
        case 'success':
            log.success(result.message);
            if (result.details) {
                log.info(result.details);
            }
            break;
        case 'error':
            log.error(result.message);
            if (result.details) {
                log.info(result.details);
            }
            break;
        case 'info':
            log.info(result.message);
            break;
        case 'warning':
            log.warn(result.message);
            break;
    }
}
/**
 * Formats an error result from error classes.
 *
 * @param error - The error to format
 * @returns Formatter result with error type
 */
export function formatError(error) {
    return {
        type: 'error',
        message: error.message,
        details: error instanceof GitError
            ? String(error.details)
            : error.path
                ? `Path: ${error.path}`
                : undefined,
    };
}
/**
 * Creates a spinner for async operations.
 *
 * @param message - The spinner message
 * @returns Clack spinner instance
 */
export function createSpinner(message) {
    return spinner();
}
//# sourceMappingURL=human.js.map
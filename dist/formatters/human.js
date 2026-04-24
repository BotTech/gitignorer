/**
 * Human-readable output formatter using @clack/prompts.
 *
 * Per CONTEXT.md D-08: Human mode uses @clack/prompts for styled output.
 * In Phase 1, stub with simple message logging.
 */
import { log } from '@clack/prompts';
/**
 * Formats output for human-readable display.
 *
 * In Phase 1, stub with simple message logging.
 * In later phases, uses spinner for async operations and styled log methods.
 *
 * @param result - The result to format
 */
export async function formatHuman(result) {
    // Phase 1 stub: simple message logging
    log.info(`Result: ${JSON.stringify(result)}`);
}
//# sourceMappingURL=human.js.map
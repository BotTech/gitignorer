/**
 * Common flags module for CLI commands.
 *
 * Per CONTEXT.md D-06: Common flags defined once and reused.
 */
/**
 * Extracts common flags from Commander options.
 *
 * @param opts - Commander option values
 * @returns Common flags object
 */
export function getCommonFlags(opts) {
    return {
        output: opts.output,
        input: opts.input,
        yes: opts.yes,
        dryRun: opts.dryRun,
    };
}
/**
 * Applies common flags to a command.
 *
 * @param command - The Commander command
 * @param options - Optional flags to apply (partial CommonFlags)
 * @returns The modified command
 */
export function applyCommonFlags(command, options = {}) {
    if (options.output !== undefined) {
        command.option('--output <format>', 'Output format (json|ndjson|stdout)', options.output);
    }
    if (options.input !== undefined) {
        command.option('--input <format>', 'Input format (json)', options.input);
    }
    if (options.yes !== undefined) {
        command.option('--yes', 'Skip confirmation prompts', options.yes);
    }
    if (options.dryRun !== undefined) {
        command.option('--dry-run', 'Show what would be written without writing', options.dryRun);
    }
    return command;
}
//# sourceMappingURL=flags.js.map
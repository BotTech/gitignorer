/**
 * Search command factory.
 *
 * Per D-04: Search command with stub implementation.
 */
import { Command } from 'commander';
import { getCommonFlags, applyCommonFlags } from '../cli/flags.js';
import { searchInputSchema } from '../schema/input.js';
import { formatHuman } from '../formatters/human.js';
/**
 * Creates the search command.
 */
export function createSearchCommand() {
    const cmd = new Command('search');
    cmd.description('Search available templates');
    // Apply common flags with output option
    applyCommonFlags(cmd, { output: 'stdout' });
    // Add query argument
    cmd.argument('<query>', 'Search query');
    // Stub action handler
    cmd.action(async (query, options) => {
        const flags = getCommonFlags(options);
        searchInputSchema.parse({ query, ...flags });
        await formatHuman({ type: 'info', message: 'Not yet implemented' });
        process.exit(0);
    });
    return cmd;
}
//# sourceMappingURL=search.js.map
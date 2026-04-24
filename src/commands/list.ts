/**
 * List command factory.
 *
 * Per D-04: List command with stub implementation.
 */

import { Command } from 'commander';
import { getCommonFlags, applyCommonFlags } from '../cli/flags.js';
import { listInputSchema } from '../schema/input.js';

/**
 * Creates the list command.
 */
export function createListCommand(): Command {
  const cmd = new Command('list');
  cmd.description('List all available templates');

  // Apply common flags with output option
  applyCommonFlags(cmd, { output: 'stdout' as any });

  // Stub action handler
  cmd.action(async (options) => {
    const flags = getCommonFlags(options);
    listInputSchema.parse(flags);
    console.log('Not yet implemented');
    process.exit(0);
  });

  return cmd;
}

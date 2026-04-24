/**
 * Update command factory.
 *
 * Per D-04: Update command with stub implementation.
 */

import { Command } from 'commander';
import { getCommonFlags, applyCommonFlags } from '../cli/flags.js';

/**
 * Creates the update command.
 */
export function createUpdateCommand(): Command {
  const cmd = new Command('update');
  cmd.description('Update .gitignore with latest templates');

  // Apply common flags with output, yes, dryRun options
  applyCommonFlags(cmd, { output: 'stdout' as any, yes: true, dryRun: true });

  // Stub action handler
  cmd.action(async (options) => {
    const flags = getCommonFlags(options);
    console.log('Not yet implemented', flags);
    process.exit(0);
  });

  return cmd;
}

/**
 * Scan command factory.
 *
 * Per D-04: Scan command with stub implementation.
 */

import { Command } from 'commander';
import { getCommonFlags, applyCommonFlags } from '../cli/flags.js';
import { scanInputSchema } from '../schema/input.js';

/**
 * Creates the scan command.
 */
export function createScanCommand(): Command {
  const cmd = new Command('scan');
  cmd.description('Scan repository for matching templates');

  // Apply common flags with output option
  applyCommonFlags(cmd, { output: 'stdout' as any });

  // Add cwd option
  cmd.option('--cwd <path>', 'Working directory', process.cwd());

  // Stub action handler
  cmd.action(async (options) => {
    const flags = getCommonFlags(options);
    scanInputSchema.parse({ cwd: options.cwd, ...flags });
    console.log('Not yet implemented');
    process.exit(0);
  });

  return cmd;
}

/**
 * Examples command factory.
 *
 * Per D-04: Examples command with stub implementation.
 */

import { Command } from 'commander';
import { formatHuman } from '../formatters/human.js';

/**
 * Creates the examples command.
 */
export function createExamplesCommand(): Command {
  const cmd = new Command('examples');
  cmd.description('Show JSON examples for commands');

  // Add command argument
  cmd.argument('<command>', 'Command to show examples for');

  // Stub action handler
  cmd.action(async () => {
    await formatHuman({ message: 'Not yet implemented' });
    process.exit(0);
  });

  return cmd;
}

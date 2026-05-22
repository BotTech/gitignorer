/**
 * Schema command factory.
 *
 * Per D-04: Schema command with stub implementation.
 */

import { Command } from 'commander';
import { formatHuman } from '../formatters/human.js';

/**
 * Creates the schema command.
 */
export function createSchemaCommand(): Command {
  const cmd = new Command('schema');
  cmd.description('Show schema for resources');

  // Add resource argument
  cmd.argument('<resource>', 'Resource to show schema for');

  // Stub action handler
  cmd.action(async () => {
    await formatHuman({ type: 'info', message: 'Not yet implemented' });
    process.exit(0);
  });

  return cmd;
}

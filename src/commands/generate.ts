/**
 * Generate command factory.
 *
 * Per D-04: Generate command with stub implementation.
 */

import { Command } from 'commander';
import { getCommonFlags, applyCommonFlags } from '../cli/flags.js';
import { generateInputSchema } from '../schema/input.js';
import { formatHuman } from '../formatters/human.js';

/**
 * Creates the generate command.
 */
export function createGenerateCommand(): Command {
  const cmd = new Command('generate');
  cmd.description('Generate .gitignore file (default command)');

  // Apply common flags (enable without defaults for output/input)
  applyCommonFlags(cmd, { output: 'stdout' as any, input: 'json' as any, yes: true, dryRun: true });

  // Add templates argument
  cmd.argument('[templates...]', 'Template names to include');

  // Stub action handler
  cmd.action(async (templates, options) => {
    const flags = getCommonFlags(options);
    generateInputSchema.parse({ templates, ...flags });
    await formatHuman({ message: 'Not yet implemented' });
    process.exit(0);
  });

  return cmd;
}

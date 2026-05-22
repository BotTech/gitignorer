/**
 * Update command factory.
 *
 * Updates the local template cache from github/gitignore repository.
 */

import { Command } from 'commander';
import { GitService } from '../services/git.service.js';
import { CacheService } from '../services/cache.service.js';
import { GitError, FsError } from '../schema/errors.js';
import { getCommonFlags, applyCommonFlags, type CommonFlags } from '../cli/flags.js';
import { formatHuman, formatError, createSpinner } from '../formatters/human.js';

/**
 * Creates the update command.
 */
export function createUpdateCommand(): Command {
  const cmd = new Command('update');
  cmd.description('Update cached .gitignore templates from github/gitignore repository');

  // Apply common flags with output, yes, dryRun options
  applyCommonFlags(cmd, { output: 'stdout' as any, yes: true, dryRun: false });

  // Action handler
  cmd.action(async (options) => {
    const flags = getCommonFlags(options);
    const cacheService = new CacheService();
    const gitService = new GitService(cacheService.getCacheDir());

    try {
      // Ensure cache directory exists
      await formatHuman({ type: 'info', message: 'Ensuring cache directory...' });
      await cacheService.ensureCacheDir();

      const templatesPath = gitService.getTemplatePath();

      // Check if repository is already cloned
      try {
        await formatHuman({
          type: 'info',
          message: 'Checking for existing templates...',
        });

        // Try to pull updates
        const spin = createSpinner('Pulling latest templates...');
        spin.start();
        await gitService.pullUpdates();
        spin.stop('Pulled latest templates');

        await formatHuman({
          type: 'success',
          message: 'Templates updated successfully',
          details: `Cache location: ${templatesPath}`,
        });
      } catch (error) {
        // If pull fails, it's likely the repo isn't cloned yet
        if (error instanceof GitError) {
          await formatHuman({
            type: 'info',
            message: 'No existing templates found. Cloning repository...',
          });

          const spin = createSpinner('Cloning templates...');
          spin.start();
          await gitService.cloneTemplates();
          spin.stop('Cloned templates');

          await formatHuman({
            type: 'success',
            message: 'Templates cloned successfully',
            details: `Cache location: ${templatesPath}`,
          });
        } else {
          throw error;
        }
      }

      process.exit(0);
    } catch (error) {
      if (error instanceof GitError || error instanceof FsError) {
        await formatHuman(formatError(error));
        process.exit(error.exitCode);
      } else {
        await formatHuman({
          type: 'error',
          message: 'Unexpected error occurred',
          details: error instanceof Error ? error.message : String(error),
        });
        process.exit(1);
      }
    }
  });

  return cmd;
}
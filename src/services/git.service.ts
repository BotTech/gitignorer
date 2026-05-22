/**
 * Git service for cloning and updating the github/gitignore template repository.
 */

import simpleGit, { type SimpleGit, type SimpleGitOptions } from 'simple-git';
import path from 'node:path';
import { GitError } from '../schema/errors.js';

const TEMPLATE_REPO = 'https://github.com/github/gitignore.git';
const TEMPLATE_REPO_NAME = 'gitignore';

/**
 * Git service for template repository operations.
 */
export class GitService {
  private readonly git: SimpleGit;
  private readonly templatesPath: string;

  /**
   * Create a new git service instance.
   *
   * @param cachePath - The base cache directory path
   */
  constructor(cachePath: string) {
    const templatesDir = path.join(cachePath, 'templates');
    this.git = simpleGit(templatesDir);
    this.templatesPath = path.join(templatesDir, TEMPLATE_REPO_NAME);
  }

  /**
   * Clone the github/gitignore repository to the local cache.
   *
   * @throws {GitError} If the clone operation fails (exit code 2)
   */
  async cloneTemplates(): Promise<void> {
    const templatesDir = path.dirname(this.templatesPath);

    try {
      await this.git.clone(TEMPLATE_REPO, this.templatesPath, [
        '--depth',
        '1', // Shallow clone for faster download
      ]);
    } catch (error) {
      throw new GitError(
        `Failed to clone template repository from ${TEMPLATE_REPO}`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * Pull updates from the remote repository.
   *
   * @throws {GitError} If the pull operation fails (exit code 2)
   */
  async pullUpdates(): Promise<void> {
    try {
      await this.git.cwd({ path: this.templatesPath }).pull();
    } catch (error) {
      throw new GitError(
        `Failed to pull updates from ${TEMPLATE_REPO}`,
        error instanceof Error ? error.message : String(error),
      );
    }
  }

  /**
   * Get the local path to the cloned template repository.
   *
   * @returns The absolute path to the template repository directory
   */
  getTemplatePath(): string {
    return this.templatesPath;
  }
}
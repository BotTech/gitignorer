/**
 * Cache service for managing template cache directory and discovering available templates.
 */

import path from 'node:path';
import { promises as fs } from 'node:fs';
import envPaths from 'env-paths';
import { FsError } from '../schema/errors.js';

const APP_NAME = 'gitignore';

/**
 * Cache service for managing platform-specific cache directory and template discovery.
 */
export class CacheService {
  private readonly cacheDir: string;

  /**
   * Create a new cache service instance.
   */
  constructor() {
    const paths = envPaths(APP_NAME);
    this.cacheDir = paths.cache;
  }

  /**
   * Get the cache directory path.
   *
   * @returns The absolute path to the cache directory
   */
  getCacheDir(): string {
    return this.cacheDir;
  }

  /**
   * Ensure the cache directory exists, creating it if necessary.
   *
   * @throws {FsError} If directory creation fails due to permissions (exit code 3)
   */
  async ensureCacheDir(): Promise<void> {
    try {
      await fs.mkdir(this.cacheDir, { recursive: true });
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        if (error.code === 'EACCES' || error.code === 'EPERM') {
          throw new FsError(
            `Permission denied creating cache directory: ${this.cacheDir}`,
            this.cacheDir,
          );
        }
      }
      throw new FsError(
        `Failed to create cache directory: ${this.cacheDir}`,
        this.cacheDir,
      );
    }
  }

  /**
   * List available templates from the cache.
   *
   * Returns a list of template names (e.g., "Node.gitignore", "Python.gitignore").
   * Only files matching the pattern "*.gitignore" in the templates directory are included.
   *
   * @returns Array of template names
   * @throws {FsError} If reading the templates directory fails (exit code 3)
   */
  async listTemplates(): Promise<string[]> {
    const templatesDir = path.join(this.cacheDir, 'templates', 'gitignore');

    try {
      const entries = await fs.readdir(templatesDir, { withFileTypes: true });
      const templates = entries
        .filter((entry) => entry.isFile() && entry.name.endsWith('.gitignore'))
        .map((entry) => entry.name);

      return templates.sort();
    } catch (error) {
      if (error instanceof Error && 'code' in error) {
        if (error.code === 'ENOENT') {
          return []; // No templates cached yet
        }
        if (error.code === 'EACCES' || error.code === 'EPERM') {
          throw new FsError(
            `Permission denied reading templates directory: ${templatesDir}`,
            templatesDir,
          );
        }
      }
      throw new FsError(
        `Failed to read templates directory: ${templatesDir}`,
        templatesDir,
      );
    }
  }
}
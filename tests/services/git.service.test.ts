/**
 * Unit tests for GitService.
 *
 * Tests git operations for template repository management.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import path from 'node:path';
import { promises as fs } from 'node:fs';
import { GitService } from '../../dist/services/git.service.js';
import { GitError } from '../../dist/schema/errors.js';

const TEST_CACHE_DIR = path.join(process.cwd(), 'test-cache');

// Ensure test directory exists synchronously before tests load
import { mkdirSync } from 'node:fs';
mkdirSync(path.join(TEST_CACHE_DIR, 'templates'), { recursive: true });

describe('GitService', () => {
  describe('constructor', () => {
    it('should create a git service instance with cache path', () => {
      const service = new GitService(TEST_CACHE_DIR);
      assert.ok(service);
      assert.strictEqual(typeof service.cloneTemplates, 'function');
      assert.strictEqual(typeof service.pullUpdates, 'function');
      assert.strictEqual(typeof service.getTemplatePath, 'function');
    });

    it('should set template path correctly', () => {
      const service = new GitService(TEST_CACHE_DIR);
      const templatePath = service.getTemplatePath();
      assert.ok(templatePath);
      assert.ok(templatePath.endsWith(path.join('templates', 'gitignore')));
    });
  });

  describe('getTemplatePath', () => {
    it('should return absolute path to template repository', () => {
      const service = new GitService(TEST_CACHE_DIR);
      const templatePath = service.getTemplatePath();
      assert.ok(path.isAbsolute(templatePath));
      assert.ok(templatePath.includes('gitignore'));
    });

    it('should return consistent path for same service instance', () => {
      const service = new GitService(TEST_CACHE_DIR);
      const path1 = service.getTemplatePath();
      const path2 = service.getTemplatePath();
      assert.strictEqual(path1, path2);
    });

    it('should use cache path correctly', async () => {
      const customPath = path.join(TEST_CACHE_DIR, 'custom-cache');
      await fs.mkdir(path.join(customPath, 'templates'), { recursive: true });
      const service = new GitService(customPath);
      const templatePath = service.getTemplatePath();
      assert.ok(templatePath.startsWith(customPath));
      await fs.rm(customPath, { recursive: true, force: true });
    });
  });

  describe('cloneTemplates', () => {
    it('should handle clone errors gracefully', async () => {
      const service = new GitService(TEST_CACHE_DIR);

      try {
        await service.cloneTemplates();
        assert.ok(true);
      } catch (error) {
        if (error instanceof GitError) {
          assert.ok(error.message);
          assert.strictEqual(error.exitCode, 2);
        } else {
          throw error;
        }
      }
    });
  });

  describe('pullUpdates', () => {
    it('should handle pull errors gracefully', async () => {
      const service = new GitService(TEST_CACHE_DIR);

      try {
        await service.pullUpdates();
        assert.ok(true);
      } catch (error) {
        if (error instanceof GitError) {
          assert.ok(error.message);
          assert.strictEqual(error.exitCode, 2);
        } else {
          throw error;
        }
      }
    });
  });

  describe('error handling', () => {
    it('should have GitError with correct exit code', () => {
      const error = new GitError('test error');
      assert.strictEqual(error.exitCode, 2);
      assert.strictEqual(error.code, 'GIT_ERROR');
      assert.strictEqual(error.message, 'test error');
    });

    it('should serialize to JSON correctly', () => {
      const error = new GitError('test error', 'additional details');
      const json = error.toJSON();
      assert.strictEqual(json.error, 'GIT_ERROR');
      assert.strictEqual(json.message, 'test error');
      assert.strictEqual(json.details, 'additional details');
    });
  });
});
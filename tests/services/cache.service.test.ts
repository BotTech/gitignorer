/**
 * Unit tests for CacheService.
 *
 * Tests cache directory management and template discovery functionality.
 */

import { describe, it, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { promises as fs } from 'node:fs';
import path from 'node:path';
import { CacheService } from '../../dist/services/cache.service.js';

const TEST_CACHE_DIR = path.join(process.cwd(), 'test-cache');

describe('CacheService', () => {
  describe('constructor and getCacheDir', () => {
    it('should create a cache service instance', () => {
      const service = new CacheService();
      assert.ok(service);
      assert.strictEqual(typeof service.getCacheDir, 'function');
      assert.strictEqual(typeof service.ensureCacheDir, 'function');
      assert.strictEqual(typeof service.listTemplates, 'function');
    });

    it('should return a cache directory path', () => {
      const service = new CacheService();
      const cacheDir = service.getCacheDir();
      assert.ok(cacheDir);
      assert.strictEqual(typeof cacheDir, 'string');
      assert.ok(cacheDir.length > 0);
    });

    it('should return the same path for multiple instances', () => {
      const service1 = new CacheService();
      const service2 = new CacheService();
      assert.strictEqual(service1.getCacheDir(), service2.getCacheDir());
    });
  });

  describe('ensureCacheDir', () => {
    it('should create cache directory if it does not exist', async () => {
      const tempDir = path.join(TEST_CACHE_DIR, `new-${Date.now()}`);

      // Create service and manually set cache dir for testing
      const service = new CacheService();
      // Access the private property through type assertion
      (service as any).cacheDir = tempDir;

      await service.ensureCacheDir();

      const stats = await fs.stat(tempDir);
      assert.ok(stats.isDirectory());

      // Clean up
      await fs.rm(tempDir, { recursive: true, force: true });
    });

    it('should not fail if cache directory already exists', async () => {
      const tempDir = path.join(TEST_CACHE_DIR, `existing-${Date.now()}`);
      await fs.mkdir(tempDir, { recursive: true });

      const service = new CacheService();
      (service as any).cacheDir = tempDir;

      // Should not throw
      await service.ensureCacheDir();

      // Clean up
      await fs.rm(tempDir, { recursive: true, force: true });
    });
  });

  describe('listTemplates', () => {
    it('should return empty array when no templates directory exists', async () => {
      const tempDir = path.join(TEST_CACHE_DIR, `no-templates-${Date.now()}`);
      await fs.mkdir(tempDir, { recursive: true });

      const service = new CacheService();
      (service as any).cacheDir = tempDir;

      const templates = await service.listTemplates();
      assert.ok(Array.isArray(templates));
      assert.strictEqual(templates.length, 0);

      // Clean up
      await fs.rm(tempDir, { recursive: true, force: true });
    });

    it('should return list of .gitignore files from templates directory', async () => {
      const tempDir = path.join(TEST_CACHE_DIR, `with-templates-${Date.now()}`);
      const templatesDir = path.join(tempDir, 'templates', 'gitignore');
      await fs.mkdir(templatesDir, { recursive: true });

      // Create test template files
      await fs.writeFile(path.join(templatesDir, 'Node.gitignore'), '# Node');
      await fs.writeFile(path.join(templatesDir, 'Python.gitignore'), '# Python');
      await fs.writeFile(path.join(templatesDir, 'Go.gitignore'), '# Go');
      await fs.writeFile(path.join(templatesDir, 'README.md'), '# README'); // Should be filtered out

      const service = new CacheService();
      (service as any).cacheDir = tempDir;

      const templates = await service.listTemplates();
      assert.ok(Array.isArray(templates));
      assert.strictEqual(templates.length, 3);
      assert.ok(templates.includes('Node.gitignore'));
      assert.ok(templates.includes('Python.gitignore'));
      assert.ok(templates.includes('Go.gitignore'));
      assert.ok(!templates.includes('README.md'));

      // Should be sorted
      assert.strictEqual(templates[0], 'Go.gitignore');
      assert.strictEqual(templates[1], 'Node.gitignore');
      assert.strictEqual(templates[2], 'Python.gitignore');

      // Clean up
      await fs.rm(tempDir, { recursive: true, force: true });
    });

    it('should handle empty templates directory', async () => {
      const tempDir = path.join(TEST_CACHE_DIR, `empty-templates-${Date.now()}`);
      const templatesDir = path.join(tempDir, 'templates', 'gitignore');
      await fs.mkdir(templatesDir, { recursive: true });

      const service = new CacheService();
      (service as any).cacheDir = tempDir;

      const templates = await service.listTemplates();
      assert.ok(Array.isArray(templates));
      assert.strictEqual(templates.length, 0);

      // Clean up
      await fs.rm(tempDir, { recursive: true, force: true });
    });
  });
});
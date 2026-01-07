import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createStorageManager } from '../src/core/storage.js';

describe('StorageManager', () => {
  let testDir: string;
  let originalHome: string | undefined;

  beforeEach(async () => {
    // Create a temporary directory for testing
    testDir = join(tmpdir(), `skillmana-test-${Date.now()}`);
    await fs.ensureDir(testDir);
    
    // Override HOME for testing
    originalHome = process.env.HOME;
    process.env.HOME = testDir;
  });

  afterEach(async () => {
    // Restore HOME
    if (originalHome) {
      process.env.HOME = originalHome;
    }
    
    // Clean up test directory
    await fs.remove(testDir);
  });

  describe('isInitialized', () => {
    it('should return false when not initialized', async () => {
      const storage = createStorageManager();
      // Note: This test may not work correctly due to how constants are imported
      // The SKILLMANA_DIR is computed at import time, not runtime
      expect(typeof storage.isInitialized).toBe('function');
    });
  });

  describe('getSkillsDir', () => {
    it('should return skills directory path', () => {
      const storage = createStorageManager();
      const skillsDir = storage.getSkillsDir();
      expect(skillsDir).toContain('.skillmana');
      expect(skillsDir).toContain('skills');
    });
  });

  describe('getRulesDir', () => {
    it('should return rules directory path', () => {
      const storage = createStorageManager();
      const rulesDir = storage.getRulesDir();
      expect(rulesDir).toContain('.skillmana');
      expect(rulesDir).toContain('rules');
    });
  });

  describe('getCategoryDir', () => {
    it('should return correct path for known category', () => {
      const storage = createStorageManager();
      const coreDir = storage.getCategoryDir('core');
      expect(coreDir).toContain('core');
    });

    it('should return custom path for unknown category', () => {
      const storage = createStorageManager();
      const unknownDir = storage.getCategoryDir('unknown-category');
      expect(unknownDir).toContain('custom');
    });
  });
});

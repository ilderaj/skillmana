import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createConfigManager } from '../src/core/config.js';
import { DEFAULT_GLOBAL_CONFIG, DEFAULT_PROJECT_CONFIG } from '../src/utils/constants.js';

describe('ConfigManager', () => {
  let testDir: string;

  beforeEach(async () => {
    testDir = join(tmpdir(), `skillmana-config-test-${Date.now()}`);
    await fs.ensureDir(testDir);
  });

  afterEach(async () => {
    await fs.remove(testDir);
  });

  describe('Default Configs', () => {
    it('should have valid default global config', () => {
      expect(DEFAULT_GLOBAL_CONFIG).toBeDefined();
      expect(DEFAULT_GLOBAL_CONFIG.version).toBe('1.0.0');
      expect(DEFAULT_GLOBAL_CONFIG.preferences).toBeDefined();
      expect(DEFAULT_GLOBAL_CONFIG.preferences.defaultScope).toBe('global');
    });

    it('should have valid default project config', () => {
      expect(DEFAULT_PROJECT_CONFIG).toBeDefined();
      expect(DEFAULT_PROJECT_CONFIG.version).toBe('1.0.0');
      expect(DEFAULT_PROJECT_CONFIG.autoRouting).toBe(true);
      expect(DEFAULT_PROJECT_CONFIG.routingLevel).toBe('auto');
    });
  });

  describe('hasProjectConfig', () => {
    it('should return false when no config exists', async () => {
      const config = createConfigManager();
      const hasConfig = await config.hasProjectConfig(testDir);
      expect(hasConfig).toBe(false);
    });

    it('should return true after creating config', async () => {
      const config = createConfigManager();
      await config.createProjectConfig(testDir);
      const hasConfig = await config.hasProjectConfig(testDir);
      expect(hasConfig).toBe(true);
    });
  });

  describe('createProjectConfig', () => {
    it('should create project config with defaults', async () => {
      const config = createConfigManager();
      await config.createProjectConfig(testDir);
      
      const projectConfig = await config.getProjectConfig(testDir);
      expect(projectConfig).not.toBeNull();
      expect(projectConfig?.autoRouting).toBe(true);
    });

    it('should create project config with custom values', async () => {
      const config = createConfigManager();
      await config.createProjectConfig(testDir, {
        autoRouting: false,
        excludedSkills: ['skill-1'],
      });
      
      const projectConfig = await config.getProjectConfig(testDir);
      expect(projectConfig?.autoRouting).toBe(false);
      expect(projectConfig?.excludedSkills).toContain('skill-1');
    });
  });

  describe('setProjectConfig', () => {
    it('should update existing project config', async () => {
      const config = createConfigManager();
      await config.createProjectConfig(testDir);
      
      await config.setProjectConfig(testDir, {
        autoRouting: false,
      });
      
      const projectConfig = await config.getProjectConfig(testDir);
      expect(projectConfig?.autoRouting).toBe(false);
    });
  });
});

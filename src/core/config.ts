/**
 * Configuration Manager
 * 
 * Handles global and project-level configuration for SkillMana.
 */

import fs from 'fs-extra';
import { join } from 'node:path';
import {
  CONFIG_DIR,
  GLOBAL_CONFIG_FILE,
  CURSOR_DIR_NAME,
  PROJECT_CONFIG_FILE,
  DEFAULT_GLOBAL_CONFIG,
  DEFAULT_PROJECT_CONFIG,
} from '../utils/constants.js';
import type { GlobalConfig, ProjectConfig } from '../types/index.js';
import { logger } from '../utils/logger.js';

// ============================================================================
// Types
// ============================================================================

export interface ConfigManager {
  // Global config
  getGlobalConfig(): Promise<GlobalConfig>;
  setGlobalConfig(config: Partial<GlobalConfig>): Promise<void>;
  resetGlobalConfig(): Promise<void>;
  
  // Project config
  getProjectConfig(projectPath: string): Promise<ProjectConfig | null>;
  setProjectConfig(projectPath: string, config: Partial<ProjectConfig>): Promise<void>;
  hasProjectConfig(projectPath: string): Promise<boolean>;
  createProjectConfig(projectPath: string, config?: Partial<ProjectConfig>): Promise<void>;
}

// ============================================================================
// Implementation
// ============================================================================

class ConfigManagerImpl implements ConfigManager {
  private globalConfigPath: string;

  constructor() {
    this.globalConfigPath = join(CONFIG_DIR, GLOBAL_CONFIG_FILE);
  }

  /**
   * Get project config file path
   */
  private getProjectConfigPath(projectPath: string): string {
    return join(projectPath, CURSOR_DIR_NAME, PROJECT_CONFIG_FILE);
  }

  /**
   * Get global configuration
   */
  async getGlobalConfig(): Promise<GlobalConfig> {
    try {
      if (await fs.pathExists(this.globalConfigPath)) {
        const content = await fs.readFile(this.globalConfigPath, 'utf-8');
        const config = JSON.parse(content) as Partial<GlobalConfig>;
        // Merge with defaults to ensure all fields exist
        return {
          ...DEFAULT_GLOBAL_CONFIG,
          ...config,
          preferences: {
            ...DEFAULT_GLOBAL_CONFIG.preferences,
            ...config.preferences,
          },
        };
      }
    } catch (error) {
      logger.debug(`Error reading global config: ${error}`);
    }
    
    // Return defaults and save
    await this.setGlobalConfig(DEFAULT_GLOBAL_CONFIG);
    return DEFAULT_GLOBAL_CONFIG;
  }

  /**
   * Set global configuration
   */
  async setGlobalConfig(config: Partial<GlobalConfig>): Promise<void> {
    try {
      // Ensure config directory exists
      await fs.ensureDir(CONFIG_DIR);
      
      // Get current config and merge
      let currentConfig = DEFAULT_GLOBAL_CONFIG;
      if (await fs.pathExists(this.globalConfigPath)) {
        const content = await fs.readFile(this.globalConfigPath, 'utf-8');
        currentConfig = JSON.parse(content);
      }
      
      const newConfig: GlobalConfig = {
        ...currentConfig,
        ...config,
        preferences: {
          ...currentConfig.preferences,
          ...config.preferences,
        },
      };
      
      await fs.writeFile(
        this.globalConfigPath,
        JSON.stringify(newConfig, null, 2),
        'utf-8'
      );
      
      logger.debug('Global config saved');
    } catch (error) {
      logger.error(`Error saving global config: ${error}`);
      throw error;
    }
  }

  /**
   * Reset global configuration to defaults
   */
  async resetGlobalConfig(): Promise<void> {
    await this.setGlobalConfig(DEFAULT_GLOBAL_CONFIG);
    logger.debug('Global config reset to defaults');
  }

  /**
   * Check if project has SkillMana config
   */
  async hasProjectConfig(projectPath: string): Promise<boolean> {
    const configPath = this.getProjectConfigPath(projectPath);
    return fs.pathExists(configPath);
  }

  /**
   * Get project configuration
   */
  async getProjectConfig(projectPath: string): Promise<ProjectConfig | null> {
    const configPath = this.getProjectConfigPath(projectPath);
    
    try {
      if (await fs.pathExists(configPath)) {
        const content = await fs.readFile(configPath, 'utf-8');
        const config = JSON.parse(content) as Partial<ProjectConfig>;
        // Merge with defaults
        return {
          ...DEFAULT_PROJECT_CONFIG,
          ...config,
          preferences: {
            ...DEFAULT_PROJECT_CONFIG.preferences,
            ...config.preferences,
          },
        };
      }
    } catch (error) {
      logger.debug(`Error reading project config: ${error}`);
    }
    
    return null;
  }

  /**
   * Set project configuration
   */
  async setProjectConfig(projectPath: string, config: Partial<ProjectConfig>): Promise<void> {
    const configPath = this.getProjectConfigPath(projectPath);
    
    try {
      // Get current config
      let currentConfig = DEFAULT_PROJECT_CONFIG;
      if (await fs.pathExists(configPath)) {
        const content = await fs.readFile(configPath, 'utf-8');
        currentConfig = JSON.parse(content);
      }
      
      const newConfig: ProjectConfig = {
        ...currentConfig,
        ...config,
        preferences: {
          ...currentConfig.preferences,
          ...config.preferences,
        },
      };
      
      await fs.writeFile(
        configPath,
        JSON.stringify(newConfig, null, 2),
        'utf-8'
      );
      
      logger.debug(`Project config saved: ${configPath}`);
    } catch (error) {
      logger.error(`Error saving project config: ${error}`);
      throw error;
    }
  }

  /**
   * Create project configuration
   */
  async createProjectConfig(projectPath: string, config?: Partial<ProjectConfig>): Promise<void> {
    const cursorDir = join(projectPath, CURSOR_DIR_NAME);
    await fs.ensureDir(cursorDir);
    
    const projectConfig: ProjectConfig = {
      ...DEFAULT_PROJECT_CONFIG,
      ...config,
      preferences: {
        ...DEFAULT_PROJECT_CONFIG.preferences,
        ...config?.preferences,
      },
    };
    
    await this.setProjectConfig(projectPath, projectConfig);
  }
}

// ============================================================================
// Export
// ============================================================================

/**
 * Default config manager instance
 */
export const configManager = new ConfigManagerImpl();

/**
 * Create a new config manager instance
 */
export function createConfigManager(): ConfigManager {
  return new ConfigManagerImpl();
}

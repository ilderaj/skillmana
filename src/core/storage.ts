/**
 * Storage Manager
 * 
 * Handles directory structure and file system operations for SkillMana.
 */

import fs from 'fs-extra';
import { join } from 'node:path';
import {
  SKILLMANA_DIR,
  GLOBAL_SKILLS_DIR,
  GLOBAL_RULES_DIR,
  CONFIG_DIR,
  REGISTRY_DIR,
  CACHE_DIR,
  DEFAULT_CATEGORIES,
} from '../utils/constants.js';
import { logger } from '../utils/logger.js';

// ============================================================================
// Types
// ============================================================================

export interface StorageManager {
  initialize(): Promise<void>;
  isInitialized(): Promise<boolean>;
  ensureDirectories(): Promise<void>;
  getSkillsDir(): string;
  getRulesDir(): string;
  getConfigDir(): string;
  getRegistryDir(): string;
  getCacheDir(): string;
  getCategoryDir(categoryId: string): string;
  ensureCategoryDir(categoryId: string): Promise<void>;
}

// ============================================================================
// Implementation
// ============================================================================

class StorageManagerImpl implements StorageManager {
  /**
   * Check if SkillMana is initialized
   */
  async isInitialized(): Promise<boolean> {
    return fs.pathExists(SKILLMANA_DIR);
  }

  /**
   * Initialize SkillMana storage
   */
  async initialize(): Promise<void> {
    logger.debug('Initializing SkillMana storage...');
    
    // Create all directories
    await this.ensureDirectories();
    
    logger.debug('SkillMana storage initialized');
  }

  /**
   * Ensure all required directories exist
   */
  async ensureDirectories(): Promise<void> {
    // Main directories
    const directories = [
      SKILLMANA_DIR,
      GLOBAL_SKILLS_DIR,
      GLOBAL_RULES_DIR,
      CONFIG_DIR,
      REGISTRY_DIR,
      CACHE_DIR,
      join(CACHE_DIR, 'anthropic'),
    ];

    // Category directories
    for (const category of DEFAULT_CATEGORIES) {
      directories.push(join(GLOBAL_SKILLS_DIR, category.directory));
    }

    // Create all directories
    for (const dir of directories) {
      await fs.ensureDir(dir);
      logger.debug(`Ensured directory: ${dir}`);
    }
  }

  /**
   * Get skills directory path
   */
  getSkillsDir(): string {
    return GLOBAL_SKILLS_DIR;
  }

  /**
   * Get rules directory path
   */
  getRulesDir(): string {
    return GLOBAL_RULES_DIR;
  }

  /**
   * Get config directory path
   */
  getConfigDir(): string {
    return CONFIG_DIR;
  }

  /**
   * Get registry directory path
   */
  getRegistryDir(): string {
    return REGISTRY_DIR;
  }

  /**
   * Get cache directory path
   */
  getCacheDir(): string {
    return CACHE_DIR;
  }

  /**
   * Get category directory path
   */
  getCategoryDir(categoryId: string): string {
    const category = DEFAULT_CATEGORIES.find((c) => c.id === categoryId);
    if (!category) {
      // Default to custom if category not found
      return join(GLOBAL_SKILLS_DIR, 'custom');
    }
    return join(GLOBAL_SKILLS_DIR, category.directory);
  }

  /**
   * Ensure category directory exists
   */
  async ensureCategoryDir(categoryId: string): Promise<void> {
    const dir = this.getCategoryDir(categoryId);
    await fs.ensureDir(dir);
  }
}

// ============================================================================
// Export
// ============================================================================

/**
 * Default storage manager instance
 */
export const storage = new StorageManagerImpl();

/**
 * Create a new storage manager instance
 */
export function createStorageManager(): StorageManager {
  return new StorageManagerImpl();
}

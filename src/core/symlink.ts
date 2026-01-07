/**
 * Symlink Manager
 * 
 * Handles symlink operations for SkillMana.
 * Supports cross-platform symlink creation (macOS/Linux native, Windows junction).
 */

import fs from 'fs-extra';
import { join, dirname } from 'node:path';
import { platform } from 'node:os';
import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import {
  GLOBAL_SKILLS_DIR,
  GLOBAL_RULES_DIR,
  CURSOR_DIR_NAME,
} from '../utils/constants.js';
import { logger } from '../utils/logger.js';

const execAsync = promisify(exec);

// ============================================================================
// Types
// ============================================================================

export interface SymlinkStatus {
  exists: boolean;
  isSymlink: boolean;
  target?: string;
  valid: boolean;
}

export interface SymlinkManager {
  // Symlink operations
  createSymlink(target: string, linkPath: string): Promise<boolean>;
  removeSymlink(linkPath: string): Promise<boolean>;
  getSymlinkStatus(linkPath: string): Promise<SymlinkStatus>;
  
  // Project operations
  linkProjectSkills(projectPath: string): Promise<boolean>;
  linkProjectRules(projectPath: string): Promise<boolean>;
  unlinkProject(projectPath: string): Promise<boolean>;
  getProjectLinkStatus(projectPath: string): Promise<{
    skills: SymlinkStatus;
    rules: SymlinkStatus;
  }>;
  
  // Utilities
  isWindows(): boolean;
  ensureParentDir(path: string): Promise<void>;
}

// ============================================================================
// Implementation
// ============================================================================

class SymlinkManagerImpl implements SymlinkManager {
  /**
   * Check if running on Windows
   */
  isWindows(): boolean {
    return platform() === 'win32';
  }

  /**
   * Ensure parent directory exists
   */
  async ensureParentDir(path: string): Promise<void> {
    const parent = dirname(path);
    await fs.ensureDir(parent);
  }

  /**
   * Create a symlink
   */
  async createSymlink(target: string, linkPath: string): Promise<boolean> {
    try {
      // Ensure parent directory exists
      await this.ensureParentDir(linkPath);

      // Check if link already exists
      const status = await this.getSymlinkStatus(linkPath);
      if (status.exists) {
        if (status.isSymlink && status.target === target) {
          logger.debug(`Symlink already exists and points to correct target: ${linkPath}`);
          return true;
        }
        
        // Remove existing file/directory/symlink
        logger.debug(`Removing existing path: ${linkPath}`);
        await fs.remove(linkPath);
      }

      // Check if target exists
      if (!await fs.pathExists(target)) {
        logger.warn(`Target does not exist: ${target}`);
        // Create target directory if it doesn't exist
        await fs.ensureDir(target);
      }

      // Create symlink based on platform
      if (this.isWindows()) {
        // Use junction on Windows (doesn't require admin privileges)
        await execAsync(`mklink /J "${linkPath}" "${target}"`);
      } else {
        // Use native symlink on Unix
        await fs.symlink(target, linkPath, 'dir');
      }

      logger.debug(`Created symlink: ${linkPath} -> ${target}`);
      return true;
    } catch (error) {
      logger.error(`Failed to create symlink: ${error}`);
      return false;
    }
  }

  /**
   * Remove a symlink
   */
  async removeSymlink(linkPath: string): Promise<boolean> {
    try {
      const status = await this.getSymlinkStatus(linkPath);
      
      if (!status.exists) {
        logger.debug(`Path does not exist: ${linkPath}`);
        return true;
      }

      if (!status.isSymlink) {
        logger.warn(`Path is not a symlink: ${linkPath}`);
        return false;
      }

      // Remove the symlink
      await fs.remove(linkPath);
      logger.debug(`Removed symlink: ${linkPath}`);
      return true;
    } catch (error) {
      logger.error(`Failed to remove symlink: ${error}`);
      return false;
    }
  }

  /**
   * Get symlink status
   */
  async getSymlinkStatus(linkPath: string): Promise<SymlinkStatus> {
    try {
      const exists = await fs.pathExists(linkPath);
      
      if (!exists) {
        // Check if it's a broken symlink
        try {
          const lstats = await fs.lstat(linkPath);
          if (lstats.isSymbolicLink()) {
            const target = await fs.readlink(linkPath);
            return {
              exists: false,
              isSymlink: true,
              target,
              valid: false,
            };
          }
        } catch {
          // Path truly doesn't exist
        }
        
        return {
          exists: false,
          isSymlink: false,
          valid: false,
        };
      }

      const lstats = await fs.lstat(linkPath);
      const isSymlink = lstats.isSymbolicLink();

      if (isSymlink) {
        const target = await fs.readlink(linkPath);
        const targetExists = await fs.pathExists(target);
        
        return {
          exists: true,
          isSymlink: true,
          target,
          valid: targetExists,
        };
      }

      return {
        exists: true,
        isSymlink: false,
        valid: true,
      };
    } catch (error) {
      logger.debug(`Error checking symlink status: ${error}`);
      return {
        exists: false,
        isSymlink: false,
        valid: false,
      };
    }
  }

  /**
   * Link project skills directory
   */
  async linkProjectSkills(projectPath: string): Promise<boolean> {
    const linkPath = join(projectPath, CURSOR_DIR_NAME, 'skills');
    return this.createSymlink(GLOBAL_SKILLS_DIR, linkPath);
  }

  /**
   * Link project rules directory
   */
  async linkProjectRules(projectPath: string): Promise<boolean> {
    const linkPath = join(projectPath, CURSOR_DIR_NAME, 'rules');
    return this.createSymlink(GLOBAL_RULES_DIR, linkPath);
  }

  /**
   * Unlink project (remove symlinks)
   */
  async unlinkProject(projectPath: string): Promise<boolean> {
    const skillsLink = join(projectPath, CURSOR_DIR_NAME, 'skills');
    const rulesLink = join(projectPath, CURSOR_DIR_NAME, 'rules');

    const skillsRemoved = await this.removeSymlink(skillsLink);
    const rulesRemoved = await this.removeSymlink(rulesLink);

    return skillsRemoved && rulesRemoved;
  }

  /**
   * Get project link status
   */
  async getProjectLinkStatus(projectPath: string): Promise<{
    skills: SymlinkStatus;
    rules: SymlinkStatus;
  }> {
    const skillsLink = join(projectPath, CURSOR_DIR_NAME, 'skills');
    const rulesLink = join(projectPath, CURSOR_DIR_NAME, 'rules');

    const [skills, rules] = await Promise.all([
      this.getSymlinkStatus(skillsLink),
      this.getSymlinkStatus(rulesLink),
    ]);

    return { skills, rules };
  }
}

// ============================================================================
// Export
// ============================================================================

/**
 * Default symlink manager instance
 */
export const symlink = new SymlinkManagerImpl();

/**
 * Create a new symlink manager instance
 */
export function createSymlinkManager(): SymlinkManager {
  return new SymlinkManagerImpl();
}

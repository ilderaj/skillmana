/**
 * Skill Scanner
 * 
 * Scans directories to discover and index skills.
 */

import fs from 'fs-extra';
import { parser } from './parser.js';
import { registry } from './registry.js';
import { storage } from './storage.js';
import type { Skill } from '../types/index.js';
import { logger } from '../utils/logger.js';
import { DEFAULT_CATEGORIES, GLOBAL_SKILLS_DIR } from '../utils/constants.js';

// ============================================================================
// Types
// ============================================================================

export interface ScanResult {
  total: number;
  added: number;
  updated: number;
  removed: number;
  errors: number;
}

export interface SkillScanner {
  scanGlobalSkills(): Promise<Skill[]>;
  scanCategory(categoryId: string): Promise<Skill[]>;
  syncRegistry(): Promise<ScanResult>;
  scanAndAdd(dirPath: string): Promise<Skill[]>;
}

// ============================================================================
// Implementation
// ============================================================================

class SkillScannerImpl implements SkillScanner {
  /**
   * Scan all global skills
   */
  async scanGlobalSkills(): Promise<Skill[]> {
    const allSkills: Skill[] = [];

    // Ensure global directory exists
    if (!await fs.pathExists(GLOBAL_SKILLS_DIR)) {
      logger.debug('Global skills directory does not exist');
      return allSkills;
    }

    // Scan each category
    for (const category of DEFAULT_CATEGORIES) {
      const categorySkills = await this.scanCategory(category.id);
      allSkills.push(...categorySkills);
    }

    logger.debug(`Scanned ${allSkills.length} skills from global directory`);
    return allSkills;
  }

  /**
   * Scan skills in a specific category
   */
  async scanCategory(categoryId: string): Promise<Skill[]> {
    const categoryDir = storage.getCategoryDir(categoryId);
    
    if (!await fs.pathExists(categoryDir)) {
      logger.debug(`Category directory does not exist: ${categoryDir}`);
      return [];
    }

    const skills = await parser.parseDirectory(categoryDir);
    logger.debug(`Found ${skills.length} skills in category: ${categoryId}`);
    
    return skills;
  }

  /**
   * Scan a specific directory and add skills
   */
  async scanAndAdd(dirPath: string): Promise<Skill[]> {
    const skills = await parser.parseDirectory(dirPath);
    
    for (const skill of skills) {
      await registry.addSkill(skill);
    }

    return skills;
  }

  /**
   * Sync registry with file system
   */
  async syncRegistry(): Promise<ScanResult> {
    const result: ScanResult = {
      total: 0,
      added: 0,
      updated: 0,
      removed: 0,
      errors: 0,
    };

    try {
      // Get current registry
      const currentRegistry = await registry.getRegistry();
      const existingSkillIds = new Set(currentRegistry.skills.map((s) => s.id));

      // Scan all skills from file system
      const scannedSkills = await this.scanGlobalSkills();
      const scannedSkillIds = new Set(scannedSkills.map((s) => s.id));

      result.total = scannedSkills.length;

      // Add or update skills
      for (const skill of scannedSkills) {
        try {
          if (existingSkillIds.has(skill.id)) {
            // Update existing
            await registry.updateSkill(skill.id, skill);
            result.updated++;
          } else {
            // Add new
            await registry.addSkill(skill);
            result.added++;
          }
        } catch (error) {
          logger.debug(`Error processing skill ${skill.id}: ${error}`);
          result.errors++;
        }
      }

      // Remove skills that no longer exist
      for (const existingId of existingSkillIds) {
        if (!scannedSkillIds.has(existingId)) {
          try {
            await registry.removeSkill(existingId);
            result.removed++;
          } catch (error) {
            logger.debug(`Error removing skill ${existingId}: ${error}`);
            result.errors++;
          }
        }
      }

      logger.debug(`Registry sync complete: ${JSON.stringify(result)}`);
    } catch (error) {
      logger.error(`Error syncing registry: ${error}`);
      result.errors++;
    }

    return result;
  }
}

// ============================================================================
// Export
// ============================================================================

/**
 * Default scanner instance
 */
export const scanner = new SkillScannerImpl();

/**
 * Create a new scanner instance
 */
export function createScanner(): SkillScanner {
  return new SkillScannerImpl();
}

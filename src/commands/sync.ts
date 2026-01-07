/**
 * Sync Command
 * 
 * Sync skills from existing ~/.cursor-skills to ~/.skillmana/skills
 */

import fs from 'fs-extra';
import { join } from 'node:path';
import chalk from 'chalk';
import { storage, scanner, registry } from '../core/index.js';
import { logger } from '../utils/logger.js';
import { HOME_DIR, GLOBAL_SKILLS_DIR } from '../utils/constants.js';

// ============================================================================
// Constants
// ============================================================================

const LEGACY_SKILLS_DIR = join(HOME_DIR, '.cursor-skills');

// ============================================================================
// Implementation
// ============================================================================

/**
 * Copy directory recursively
 */
async function copySkillsDirectory(source: string, dest: string): Promise<number> {
  let count = 0;

  if (!await fs.pathExists(source)) {
    return count;
  }

  const entries = await fs.readdir(source, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = join(source, entry.name);
    const destPath = join(dest, entry.name);

    if (entry.isDirectory()) {
      // Skip certain directories
      if (entry.name.startsWith('.') || entry.name === 'node_modules') {
        continue;
      }

      await fs.ensureDir(destPath);
      count += await copySkillsDirectory(srcPath, destPath);
    } else if (entry.isFile()) {
      await fs.copy(srcPath, destPath, { overwrite: true });
      count++;
    }
  }

  return count;
}

/**
 * Execute sync command
 */
export async function syncCommand(): Promise<void> {
  logger.debug('Sync command called');

  try {
    // Initialize storage
    logger.startSpinner('Initializing storage...');
    await storage.initialize();
    logger.spinnerSuccess('Storage initialized');

    // Check for legacy skills directory
    const hasLegacy = await fs.pathExists(LEGACY_SKILLS_DIR);
    
    if (hasLegacy) {
      logger.startSpinner('Syncing from ~/.cursor-skills...');
      
      // Copy each category
      const categories = ['core', 'anthropic', 'product-management', 'ux-design', 
                         'testing-qa', 'stripe-payment', 'business-model', 
                         'mobile', 'optimization'];
      
      let totalFiles = 0;
      
      for (const category of categories) {
        const srcDir = join(LEGACY_SKILLS_DIR, category);
        const destDir = join(GLOBAL_SKILLS_DIR, category);
        
        if (await fs.pathExists(srcDir)) {
          const files = await copySkillsDirectory(srcDir, destDir);
          totalFiles += files;
          logger.debug(`Copied ${files} files from ${category}`);
        }
      }
      
      logger.spinnerSuccess(`Synced ${totalFiles} files from legacy directory`);
    } else {
      logger.info('No legacy ~/.cursor-skills directory found');
    }

    // Scan and update registry
    logger.startSpinner('Updating registry...');
    const result = await scanner.syncRegistry();
    logger.spinnerSuccess(`Registry updated: ${result.total} skills (${result.added} added, ${result.updated} updated)`);

    // Display summary
    console.log('');
    console.log(chalk.green.bold('✓ Sync complete'));
    console.log('');
    
    const skills = await registry.listSkills();
    if (skills.length > 0) {
      console.log(chalk.gray(`Total skills: ${skills.length}`));
      
      // Count by category
      const byCategory = skills.reduce((acc, s) => {
        acc[s.category] = (acc[s.category] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      
      for (const [cat, count] of Object.entries(byCategory)) {
        console.log(chalk.gray(`  ${cat}: ${count}`));
      }
    }
  } catch (error) {
    logger.stopSpinner();
    if (error instanceof Error) {
      logger.error(`Sync failed: ${error.message}`);
    } else {
      logger.error('Sync failed');
    }
  }
}

/**
 * Create sync command action
 */
export function createSyncAction() {
  return async () => {
    await syncCommand();
  };
}

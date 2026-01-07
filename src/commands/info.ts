/**
 * Info Command
 * 
 * Show detailed information about a skill.
 */

import chalk from 'chalk';
import { registry, scanner } from '../core/index.js';
import { logger } from '../utils/logger.js';
import type { Skill } from '../types/index.js';

// ============================================================================
// Implementation
// ============================================================================

/**
 * Display skill information
 */
function displaySkillInfo(skill: Skill): void {
  console.log('');
  console.log(chalk.bold.cyan(`📦 ${skill.name}`));
  console.log(chalk.gray('═'.repeat(50)));
  console.log('');

  // Basic info
  console.log(chalk.bold('Description:'));
  console.log(`  ${skill.description}`);
  console.log('');

  // Classification
  console.log(chalk.bold('Classification:'));
  console.log(`  ${chalk.gray('ID:')}        ${skill.id}`);
  console.log(`  ${chalk.gray('Category:')} ${skill.category}`);
  console.log(`  ${chalk.gray('Domain:')}   ${skill.domain}`);
  console.log(`  ${chalk.gray('Source:')}   ${skill.source}`);
  console.log(`  ${chalk.gray('Core:')}     ${skill.isCore ? chalk.cyan('Yes') : 'No'}`);
  console.log('');

  // Triggers
  console.log(chalk.bold('Triggers:'));
  if (skill.triggers.length > 0) {
    console.log(`  ${skill.triggers.join(', ')}`);
  } else {
    console.log(chalk.gray('  No triggers defined'));
  }
  console.log('');

  // Path
  console.log(chalk.bold('Location:'));
  console.log(`  ${skill.path}`);
  console.log('');

  // Metadata
  if (skill.metadata.version || skill.metadata.author || skill.metadata.license) {
    console.log(chalk.bold('Metadata:'));
    if (skill.metadata.version) {
      console.log(`  ${chalk.gray('Version:')} ${skill.metadata.version}`);
    }
    if (skill.metadata.author) {
      console.log(`  ${chalk.gray('Author:')}  ${skill.metadata.author}`);
    }
    if (skill.metadata.license) {
      console.log(`  ${chalk.gray('License:')} ${skill.metadata.license}`);
    }
    console.log('');
  }
}

/**
 * Execute info command
 */
export async function infoCommand(name: string): Promise<void> {
  logger.debug(`Info command for: ${name}`);

  try {
    // Sync registry first
    logger.startSpinner('Loading skill info...');
    await scanner.syncRegistry();

    // Try to find by ID first
    let skill = await registry.getSkill(name);

    // If not found, search by name
    if (!skill) {
      const skills = await registry.searchSkills(name);
      if (skills.length > 0) {
        // Find exact match or first result
        skill = skills.find((s) => s.name.toLowerCase() === name.toLowerCase()) || skills[0];
      }
    }

    logger.stopSpinner();

    if (!skill) {
      logger.error(`Skill not found: ${name}`);
      logger.info('Use "skillmana list" to see available skills.');
      return;
    }

    displaySkillInfo(skill);
  } catch (error) {
    logger.stopSpinner();
    if (error instanceof Error) {
      logger.error(`Failed to get skill info: ${error.message}`);
    } else {
      logger.error('Failed to get skill info');
    }
  }
}

/**
 * Create info command action
 */
export function createInfoAction() {
  return async (name: string) => {
    await infoCommand(name);
  };
}

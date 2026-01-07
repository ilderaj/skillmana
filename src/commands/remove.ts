/**
 * Remove Command
 * 
 * Remove a skill from the registry and optionally from disk.
 */

import fs from 'fs-extra';
import chalk from 'chalk';
import inquirer from 'inquirer';
import { registry, configManager } from '../core/index.js';
import { logger } from '../utils/logger.js';
import type { RemoveOptions } from '../types/index.js';

// ============================================================================
// Implementation
// ============================================================================

/**
 * Execute remove command
 */
export async function removeCommand(name: string, options: RemoveOptions): Promise<boolean> {
  logger.debug(`Remove command: name="${name}", options=${JSON.stringify(options)}`);

  try {
    // Find skill
    let skill: { id: string; name: string; path: string; source: string } | null = await registry.getSkill(name);

    // If not found by ID, search by name
    if (!skill) {
      const skills = await registry.searchSkills(name);
      skill = skills.find((s) => s.name.toLowerCase() === name.toLowerCase()) ?? null;
      
      if (!skill && skills.length > 0) {
        // Show matches and let user choose
        console.log(chalk.yellow(`Skill "${name}" not found exactly. Did you mean:`));
        skills.slice(0, 5).forEach((s, i) => {
          console.log(`  ${i + 1}. ${s.name} (${s.id})`);
        });
        return false;
      }
    }

    if (!skill) {
      logger.error(`Skill not found: ${name}`);
      return false;
    }

    // Determine action based on options
    if (options.local && !options.global) {
      // Add to project exclude list
      return await excludeFromProject(skill.id, options);
    }

    // Global removal
    return await removeGlobally(skill, options);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(`Failed to remove skill: ${error.message}`);
    } else {
      logger.error('Failed to remove skill');
    }
    return false;
  }
}

/**
 * Add skill to project exclude list
 */
async function excludeFromProject(skillId: string, _options: RemoveOptions): Promise<boolean> {
  const projectPath = process.cwd();
  const projectConfig = await configManager.getProjectConfig(projectPath);

  if (!projectConfig) {
    logger.error('No project configuration found. Run "skillmana init" first.');
    return false;
  }

  // Check if already excluded
  if (projectConfig.excludedSkills.includes(skillId)) {
    logger.warn(`Skill "${skillId}" is already excluded from this project.`);
    return true;
  }

  // Add to exclude list
  projectConfig.excludedSkills.push(skillId);
  await configManager.setProjectConfig(projectPath, projectConfig);

  logger.success(`Skill "${skillId}" excluded from this project.`);
  console.log(chalk.gray('The skill is still available globally.'));
  return true;
}

/**
 * Remove skill globally
 */
async function removeGlobally(skill: { id: string; name: string; path: string; source: string }, options: RemoveOptions): Promise<boolean> {
  // Confirm if not forced
  if (!options.force) {
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Are you sure you want to remove "${skill.name}" globally? This will delete the skill files.`,
        default: false,
      },
    ]);

    if (!confirm) {
      logger.info('Removal cancelled.');
      return false;
    }
  }

  // Warn about official skills
  if (skill.source === 'anthropic') {
    logger.warn('This is an official Anthropic skill. You can restore it with "skillmana update".');
  }

  // Remove from registry
  logger.startSpinner(`Removing skill: ${skill.name}...`);

  const removed = await registry.removeSkill(skill.id);
  if (!removed) {
    logger.spinnerFail('Failed to remove skill from registry');
    return false;
  }

  // Remove files
  try {
    if (await fs.pathExists(skill.path)) {
      await fs.remove(skill.path);
      logger.debug(`Removed directory: ${skill.path}`);
    }
  } catch (error) {
    logger.debug(`Error removing files: ${error}`);
    // Continue even if file removal fails
  }

  logger.spinnerSuccess(`Removed skill: ${skill.name}`);
  return true;
}

/**
 * Create remove command action
 */
export function createRemoveAction() {
  return async (name: string, options: {
    global?: boolean;
    local?: boolean;
    force?: boolean;
  }) => {
    const removeOptions: RemoveOptions = {
      global: options.global ?? !options.local,
      local: options.local ?? false,
      force: options.force ?? false,
    };
    
    await removeCommand(name, removeOptions);
  };
}

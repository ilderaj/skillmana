/**
 * List Command
 * 
 * List all available skills.
 */

import chalk from 'chalk';
import { registry, scanner } from '../core/index.js';
import { logger } from '../utils/logger.js';
import type { ListOptions, Skill, SkillSource } from '../types/index.js';

// ============================================================================
// Implementation
// ============================================================================

/**
 * Format skill for display
 */
function formatSkill(skill: Skill): string {
  const coreTag = skill.isCore ? chalk.cyan('[core]') : '';
  const sourceTag = skill.source === 'anthropic' ? chalk.magenta('[official]') : '';
  
  return `  ${chalk.bold(skill.name)} ${coreTag} ${sourceTag}
    ${chalk.gray(skill.description.slice(0, 80))}${skill.description.length > 80 ? '...' : ''}
    ${chalk.gray('Category:')} ${skill.category} ${chalk.gray('| Domain:')} ${skill.domain}`;
}

/**
 * Execute list command
 */
export async function listCommand(options: ListOptions): Promise<void> {
  logger.debug(`List command options: ${JSON.stringify(options)}`);

  try {
    // Sync registry first to get latest skills
    logger.startSpinner('Scanning skills...');
    await scanner.syncRegistry();
    logger.spinnerSuccess('Skills scanned');

    // Build filter
    const filter: {
      category?: string;
      source?: SkillSource;
      isCore?: boolean;
    } = {};

    if (options.category) {
      filter.category = options.category;
    }
    if (options.source) {
      filter.source = options.source;
    }
    if (options.core) {
      filter.isCore = true;
    }

    // Get skills
    const skills = await registry.listSkills(filter);

    if (skills.length === 0) {
      logger.info('No skills found matching the criteria.');
      return;
    }

    // Output
    if (options.json) {
      console.log(JSON.stringify(skills, null, 2));
      return;
    }

    // Group by category
    const grouped = skills.reduce((acc, skill) => {
      const cat = skill.category;
      if (!acc[cat]) {
        acc[cat] = [];
      }
      acc[cat].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);

    console.log('');
    console.log(chalk.bold(`📦 Skills (${skills.length} total)`));
    console.log('');

    for (const [category, categorySkills] of Object.entries(grouped)) {
      console.log(chalk.cyan.bold(`${category} (${categorySkills.length})`));
      console.log(chalk.gray('─'.repeat(40)));
      
      for (const skill of categorySkills) {
        console.log(formatSkill(skill));
        console.log('');
      }
    }
  } catch (error) {
    logger.stopSpinner();
    if (error instanceof Error) {
      logger.error(`Failed to list skills: ${error.message}`);
    } else {
      logger.error('Failed to list skills');
    }
  }
}

/**
 * Create list command action
 */
export function createListAction() {
  return async (options: {
    category?: string;
    source?: string;
    core?: boolean;
    json?: boolean;
  }) => {
    const listOptions: ListOptions = {
      category: options.category,
      source: options.source as SkillSource | undefined,
      core: options.core ?? false,
      json: options.json ?? false,
    };
    
    await listCommand(listOptions);
  };
}

/**
 * Search Command
 * 
 * Search for skills by query.
 */

import chalk from 'chalk';
import { registry, scanner } from '../core/index.js';
import { logger } from '../utils/logger.js';
import type { Skill } from '../types/index.js';

// ============================================================================
// Implementation
// ============================================================================

/**
 * Format skill for display
 */
function formatSkill(skill: Skill, query: string): string {
  const coreTag = skill.isCore ? chalk.cyan('[core]') : '';
  const sourceTag = skill.source === 'anthropic' ? chalk.magenta('[official]') : '';
  
  // Highlight query in name and description
  const highlightQuery = (text: string) => {
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, chalk.yellow.bold('$1'));
  };

  const name = highlightQuery(skill.name);
  const desc = highlightQuery(skill.description.slice(0, 100));

  return `  ${chalk.bold(name)} ${coreTag} ${sourceTag}
    ${chalk.gray(desc)}${skill.description.length > 100 ? '...' : ''}
    ${chalk.gray('Triggers:')} ${skill.triggers.slice(0, 5).join(', ')}`;
}

/**
 * Execute search command
 */
export async function searchCommand(query: string, options: { json?: boolean }): Promise<void> {
  logger.debug(`Search command: query="${query}", options=${JSON.stringify(options)}`);

  try {
    // Sync registry first
    logger.startSpinner('Searching skills...');
    await scanner.syncRegistry();

    // Search
    const skills = await registry.searchSkills(query);
    logger.spinnerSuccess(`Found ${skills.length} skills`);

    if (skills.length === 0) {
      logger.info(`No skills found matching "${query}"`);
      return;
    }

    // Output
    if (options.json) {
      console.log(JSON.stringify(skills, null, 2));
      return;
    }

    console.log('');
    console.log(chalk.bold(`🔍 Search results for "${query}" (${skills.length} found)`));
    console.log(chalk.gray('─'.repeat(50)));
    console.log('');

    for (const skill of skills) {
      console.log(formatSkill(skill, query));
      console.log('');
    }
  } catch (error) {
    logger.stopSpinner();
    if (error instanceof Error) {
      logger.error(`Search failed: ${error.message}`);
    } else {
      logger.error('Search failed');
    }
  }
}

/**
 * Create search command action
 */
export function createSearchAction() {
  return async (query: string, options: { json?: boolean }) => {
    await searchCommand(query, options);
  };
}

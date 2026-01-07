/**
 * Route Command
 * 
 * Configure auto-routing settings for skill selection.
 */

import chalk from 'chalk';
import boxen from 'boxen';
import { logger } from '../utils/logger.js';
import { router } from '../core/router.js';
import type { RoutingLevel } from '../types/index.js';

// ============================================================================
// Types
// ============================================================================

interface RouteOptions {
  enable?: boolean;
  disable?: boolean;
  level?: string;
  status?: boolean;
  test?: string;
}

// ============================================================================
// Implementation
// ============================================================================

/**
 * Show current routing status
 */
async function showStatus(): Promise<void> {
  const routerConfig = router.getConfig();

  const statusLines = [
    chalk.cyan('Auto-Routing Configuration'),
    '',
    `${chalk.gray('Level:')}    ${chalk.white(routerConfig.level)}`,
    `${chalk.gray('Max Skills:')} ${chalk.white(routerConfig.maxSkills)}`,
    `${chalk.gray('Prefer Core:')} ${routerConfig.preferCore ? chalk.green('Yes') : chalk.yellow('No')}`,
    '',
    chalk.gray('Level descriptions:'),
    `  ${chalk.cyan('core')}  - L1: Only core skills (minimal tokens)`,
    `  ${chalk.cyan('auto')}  - L2: Adaptive selection (default)`,
    `  ${chalk.cyan('full')}  - L3: Full skills (maximum capability)`,
  ];

  console.log('');
  console.log(boxen(statusLines.join('\n'), {
    padding: 1,
    borderColor: 'cyan',
    borderStyle: 'round',
  }));
  console.log('');
}

/**
 * Test routing with a query
 */
async function testRouting(query: string): Promise<void> {
  logger.info(`Testing routing for: "${query}"`);
  console.log('');

  const decision = await router.route({ query });

  console.log(chalk.cyan('Routing Decision:'));
  console.log('');
  console.log(`  ${chalk.gray('Intent:')}     ${chalk.white(decision.intent)}`);
  console.log(`  ${chalk.gray('Domain:')}     ${chalk.white(decision.domain)}`);
  console.log(`  ${chalk.gray('Complexity:')} ${chalk.white(decision.complexity)}`);
  console.log(`  ${chalk.gray('Load Level:')} ${chalk.white(decision.level)}`);
  console.log('');

  if (decision.selectedSkills.length > 0) {
    console.log(chalk.cyan('Selected Skills:'));
    for (const skill of decision.selectedSkills) {
      const relevanceBar = '█'.repeat(Math.round(skill.relevance * 10));
      const relevanceEmpty = '░'.repeat(10 - Math.round(skill.relevance * 10));
      console.log(`  ${chalk.yellow(skill.loadOrder)}. ${chalk.white(skill.name)}`);
      console.log(`     ${chalk.green(relevanceBar)}${chalk.gray(relevanceEmpty)} ${Math.round(skill.relevance * 100)}%`);
    }
  } else {
    console.log(chalk.yellow('  No matching skills found.'));
  }

  console.log('');
  console.log(chalk.gray(`Reason: ${decision.reason}`));
  console.log('');
}

/**
 * Create route action handler
 */
export function createRouteAction() {
  return async function routeAction(options: RouteOptions): Promise<void> {
    try {
      // Test query
      if (options.test) {
        await testRouting(options.test);
        return;
      }

      // Show status (default if no options)
      if (options.status || (!options.enable && !options.disable && !options.level)) {
        await showStatus();
        return;
      }

      // Enable routing
      if (options.enable) {
        // For now, enabling just means setting level to auto
        router.setLevel('auto');
        logger.success('Auto-routing enabled');
        logger.info('Use --level to customize (core, auto, full)');
        return;
      }

      // Disable routing
      if (options.disable) {
        // Disabling means setting to manual selection
        router.setLevel('full');
        logger.success('Auto-routing disabled (using full skills)');
        return;
      }

      // Set level
      if (options.level) {
        const validLevels: RoutingLevel[] = ['core', 'auto', 'full'];
        const level = options.level.toLowerCase() as RoutingLevel;

        if (!validLevels.includes(level)) {
          logger.error(`Invalid level: ${options.level}`);
          logger.info(`Valid levels: ${validLevels.join(', ')}`);
          return;
        }

        router.setLevel(level);
        logger.success(`Routing level set to: ${level}`);

        // Show what this means
        const descriptions: Record<RoutingLevel, string> = {
          core: 'Only core skills will be loaded (minimal tokens)',
          auto: 'Skills selected adaptively based on query complexity',
          full: 'Full skills loaded for maximum capability',
        };
        logger.info(descriptions[level]);
      }
    } catch (error) {
      logger.error(`Route command failed: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  };
}

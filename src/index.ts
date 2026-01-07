#!/usr/bin/env node

/**
 * SkillMana - Cursor Skills Manager
 * 
 * A local CLI tool for managing Cursor Skills
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { CLI_NAME, CLI_VERSION, CLI_DESCRIPTION } from './utils/constants.js';
import { logger } from './utils/logger.js';
import { createInitAction, createListAction, createSearchAction, createInfoAction, createSyncAction, createAddAction, createRemoveAction, createRouteAction, createUpdateAction, tuiCommand } from './commands/index.js';

// ============================================================================
// CLI Setup
// ============================================================================

const program = new Command();

program
  .name(CLI_NAME)
  .version(CLI_VERSION, '-v, --version', 'Display version number')
  .description(CLI_DESCRIPTION)
  .option('--verbose', 'Enable verbose output')
  .option('--no-color', 'Disable colored output')
  .hook('preAction', (thisCommand) => {
    const opts = thisCommand.opts();
    if (opts.verbose) {
      logger.setVerbose(true);
    }
    if (opts.color === false) {
      logger.setColor(false);
    }
  });

// ============================================================================
// Commands
// ============================================================================

// Init command
program
  .command('init')
  .description('Initialize SkillMana in the current project')
  .option('-f, --force', 'Force initialization even if already initialized')
  .option('--no-routing', 'Disable auto-routing by default')
  .action(createInitAction());

// Add command
program
  .command('add <source>')
  .description('Add a new skill (local path, URL, or GitHub user/repo)')
  .option('-g, --global', 'Add to global skills (default)', true)
  .option('-l, --local', 'Add to current project only')
  .option('-c, --category <category>', 'Specify category')
  .option('-f, --force', 'Force overwrite if exists')
  .action(createAddAction());

// Remove command
program
  .command('remove <name>')
  .alias('rm')
  .description('Remove a skill')
  .option('-g, --global', 'Remove from global skills (default)')
  .option('-l, --local', 'Remove from current project only (add to exclude list)')
  .option('-f, --force', 'Skip confirmation')
  .action(createRemoveAction());

// List command
program
  .command('list')
  .alias('ls')
  .description('List all skills')
  .option('-c, --category <category>', 'Filter by category')
  .option('-s, --source <source>', 'Filter by source (anthropic, community, custom)')
  .option('--core', 'Show only core skills')
  .option('--json', 'Output as JSON')
  .action(createListAction());

// Search command
program
  .command('search <query>')
  .description('Search for skills')
  .option('--json', 'Output as JSON')
  .action(createSearchAction());

// Info command
program
  .command('info <name>')
  .description('Show detailed information about a skill')
  .action(createInfoAction());

// Enable command
program
  .command('enable <name>')
  .description('Enable a skill in current project')
  .action(async (name) => {
    logger.info(`Enable command called for: ${name}`);
    // TODO: Implement enable command
    logger.warn('Enable command not yet implemented');
  });

// Disable command
program
  .command('disable <name>')
  .description('Disable a skill in current project')
  .action(async (name) => {
    logger.info(`Disable command called for: ${name}`);
    // TODO: Implement disable command
    logger.warn('Disable command not yet implemented');
  });

// Route command
program
  .command('route')
  .description('Configure auto-routing')
  .option('--enable', 'Enable auto-routing')
  .option('--disable', 'Disable auto-routing')
  .option('--level <level>', 'Set routing level (core, full, auto)')
  .option('--status', 'Show current routing status')
  .option('--test <query>', 'Test routing with a query')
  .action(createRouteAction());

// Update command
program
  .command('update [skill]')
  .description('Update Anthropic official skills')
  .option('-f, --force', 'Force update even if up to date')
  .option('-c, --check', 'Check for updates without installing')
  .option('-l, --list', 'List all available Anthropic skills')
  .action(createUpdateAction());

// Sync command
program
  .command('sync')
  .description('Sync skills from legacy ~/.cursor-skills directory')
  .action(createSyncAction());

// Doctor command
program
  .command('doctor')
  .description('Diagnose environment issues')
  .action(async () => {
    logger.info('Doctor command called');
    // TODO: Implement doctor command
    logger.warn('Doctor command not yet implemented');
  });

// TUI command
program.addCommand(tuiCommand);

// ============================================================================
// Error Handling
// ============================================================================

program.showHelpAfterError('(add --help for additional information)');

// Handle unknown commands
program.on('command:*', () => {
  logger.error(`Unknown command: ${program.args.join(' ')}`);
  logger.info(`Run '${CLI_NAME} --help' to see available commands.`);
  process.exit(1);
});

// ============================================================================
// Main
// ============================================================================

async function main(): Promise<void> {
  try {
    // Show welcome if no arguments
    if (process.argv.length === 2) {
      console.log('');
      console.log(chalk.cyan.bold(`  🎯 ${CLI_NAME} v${CLI_VERSION}`));
      console.log(chalk.gray(`  ${CLI_DESCRIPTION}`));
      console.log('');
      console.log(chalk.gray('  Run ') + chalk.cyan(`${CLI_NAME} --help`) + chalk.gray(' to see available commands.'));
      console.log(chalk.gray('  Run ') + chalk.cyan(`${CLI_NAME} init`) + chalk.gray(' to initialize in a project.'));
      console.log('');
      return;
    }

    await program.parseAsync(process.argv);
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error.message);
      if (process.env.DEBUG) {
        console.error(error.stack);
      }
    } else {
      logger.error('An unknown error occurred');
    }
    process.exit(1);
  }
}

main();

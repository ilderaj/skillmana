/**
 * Update Command
 * 
 * Updates Anthropic official skills from GitHub.
 */

import chalk from 'chalk';
import ora from 'ora';
import inquirer from 'inquirer';
import { logger } from '../utils/logger.js';
import { anthropicDownloader } from '../core/anthropic.js';
import type { DownloadResult, UpdateInfo } from '../core/anthropic.js';

// ============================================================================
// Types
// ============================================================================

interface UpdateOptions {
  force?: boolean;
  check?: boolean;
  list?: boolean;
  skill?: string;
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Display available skills list
 */
async function displaySkillsList(): Promise<void> {
  const spinner = ora('Fetching available skills...').start();
  
  try {
    const available = await anthropicDownloader.listAvailableSkills();
    const installed = await anthropicDownloader.getInstalledSkills();
    
    spinner.stop();
    
    console.log('');
    console.log(chalk.cyan.bold('📦 Available Anthropic Skills'));
    console.log('');
    
    for (const skill of available) {
      const isInstalled = installed.includes(skill);
      const status = isInstalled 
        ? chalk.green('✓ installed') 
        : chalk.gray('○ not installed');
      console.log(`  ${chalk.white(skill.padEnd(25))} ${status}`);
    }
    
    console.log('');
    console.log(chalk.gray(`Total: ${available.length} skills, ${installed.length} installed`));
    console.log('');
  } catch (error) {
    spinner.fail('Failed to fetch skills list');
    throw error;
  }
}

/**
 * Check for updates and display status
 */
async function checkForUpdates(): Promise<UpdateInfo[]> {
  const spinner = ora('Checking for updates...').start();
  
  try {
    const updates = await anthropicDownloader.checkForUpdates();
    spinner.stop();
    
    const newSkills = updates.filter(u => !u.isInstalled);
    const installedSkills = updates.filter(u => u.isInstalled);
    
    console.log('');
    console.log(chalk.cyan.bold('🔄 Anthropic Skills Status'));
    console.log('');
    
    // Display table
    console.log(chalk.gray('  ┌─────────────────────────┬───────────────┐'));
    console.log(chalk.gray('  │ ') + chalk.white('Skill'.padEnd(23)) + chalk.gray(' │ ') + chalk.white('Status'.padEnd(13)) + chalk.gray(' │'));
    console.log(chalk.gray('  ├─────────────────────────┼───────────────┤'));
    
    for (const update of updates) {
      const name = update.skillName.padEnd(23);
      let status: string;
      
      if (update.isInstalled) {
        status = chalk.green('✓ installed'.padEnd(13));
      } else {
        status = chalk.yellow('○ available'.padEnd(13));
      }
      
      console.log(chalk.gray('  │ ') + chalk.white(name) + chalk.gray(' │ ') + status + chalk.gray(' │'));
    }
    
    console.log(chalk.gray('  └─────────────────────────┴───────────────┘'));
    console.log('');
    
    if (newSkills.length > 0) {
      console.log(chalk.yellow(`  ${newSkills.length} new skills available to install`));
    }
    console.log(chalk.green(`  ${installedSkills.length} skills installed`));
    console.log('');
    
    return updates;
  } catch (error) {
    spinner.fail('Failed to check for updates');
    throw error;
  }
}

/**
 * Download and install skills
 */
async function installSkills(skillNames: string[], force: boolean): Promise<void> {
  const results: DownloadResult[] = [];
  
  console.log('');
  
  for (const skillName of skillNames) {
    const spinner = ora(`Downloading ${chalk.cyan(skillName)}...`).start();
    
    try {
      const result = await anthropicDownloader.downloadSkill(skillName, force);
      
      if (result.success) {
        if (result.isNew) {
          spinner.succeed(`Downloaded ${chalk.cyan(skillName)} ${chalk.green('(new)')}`);
        } else if (result.isUpdated) {
          spinner.succeed(`Updated ${chalk.cyan(skillName)}`);
        } else {
          spinner.info(`${chalk.cyan(skillName)} is up to date`);
        }
      } else {
        spinner.fail(`Failed to download ${chalk.cyan(skillName)}: ${result.error}`);
      }
      
      results.push(result);
    } catch (error) {
      spinner.fail(`Error downloading ${skillName}`);
      results.push({
        skillName,
        success: false,
        error: error instanceof Error ? error.message : String(error),
        isNew: false,
        isUpdated: false,
      });
    }
  }
  
  // Summary
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const newSkills = results.filter(r => r.isNew);
  const updated = results.filter(r => r.isUpdated);
  
  console.log('');
  
  if (successful.length > 0) {
    const parts: string[] = [];
    if (newSkills.length > 0) parts.push(`${newSkills.length} new`);
    if (updated.length > 0) parts.push(`${updated.length} updated`);
    
    if (parts.length > 0) {
      logger.success(`Successfully installed ${successful.length} skills (${parts.join(', ')})`);
    } else {
      logger.info(`${successful.length} skills already up to date`);
    }
  }
  
  if (failed.length > 0) {
    logger.warn(`${failed.length} skills failed to install`);
  }
  
  console.log('');
}

// ============================================================================
// Command
// ============================================================================

/**
 * Create update action handler
 */
export function createUpdateAction() {
  return async function updateAction(skillArg?: string, options?: UpdateOptions): Promise<void> {
    try {
      // Handle positional argument vs options
      const opts = options || {};
      const specificSkill = typeof skillArg === 'string' ? skillArg : undefined;
      
      // List available skills
      if (opts.list) {
        await displaySkillsList();
        return;
      }
      
      // Check only mode
      if (opts.check) {
        await checkForUpdates();
        return;
      }
      
      // Update specific skill
      if (specificSkill) {
        await installSkills([specificSkill], opts.force || false);
        return;
      }
      
      // Update all - check first
      const updates = await checkForUpdates();
      const notInstalled = updates.filter(u => !u.isInstalled);
      
      if (notInstalled.length === 0 && !opts.force) {
        logger.success('All Anthropic skills are installed!');
        console.log('');
        console.log(chalk.gray('Use --force to re-download all skills.'));
        console.log('');
        return;
      }
      
      // Determine what to install
      const toInstall = opts.force 
        ? updates.map(u => u.skillName)
        : notInstalled.map(u => u.skillName);
      
      if (toInstall.length === 0) {
        logger.info('Nothing to install.');
        return;
      }
      
      // Confirm unless force
      if (!opts.force) {
        const { proceed } = await inquirer.prompt<{ proceed: boolean }>([{
          type: 'confirm',
          name: 'proceed',
          message: `Install ${toInstall.length} skills?`,
          default: true,
        }]);
        
        if (!proceed) {
          logger.info('Update cancelled.');
          return;
        }
      }
      
      // Install
      await installSkills(toInstall, opts.force || false);
      
    } catch (error) {
      logger.error(`Update failed: ${error instanceof Error ? error.message : error}`);
      process.exit(1);
    }
  };
}

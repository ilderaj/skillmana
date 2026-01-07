/**
 * Init Command
 * 
 * Initialize SkillMana in the current project.
 */

import chalk from 'chalk';
import { storage, configManager, symlink } from '../core/index.js';
import { logger } from '../utils/logger.js';
import {
  CURSOR_DIR_NAME,
  GLOBAL_SKILLS_DIR,
  GLOBAL_RULES_DIR,
  CLI_NAME,
} from '../utils/constants.js';
import type { InitOptions } from '../types/index.js';

// ============================================================================
// Types
// ============================================================================

interface InitResult {
  success: boolean;
  projectPath: string;
  skillsLinked: boolean;
  rulesLinked: boolean;
  configCreated: boolean;
  message: string;
}

// ============================================================================
// Implementation
// ============================================================================

/**
 * Execute init command
 */
export async function initCommand(options: InitOptions): Promise<InitResult> {
  const projectPath = process.cwd();
  const result: InitResult = {
    success: false,
    projectPath,
    skillsLinked: false,
    rulesLinked: false,
    configCreated: false,
    message: '',
  };

  logger.debug(`Initializing SkillMana in: ${projectPath}`);
  logger.debug(`Options: ${JSON.stringify(options)}`);

  try {
    // Step 1: Check if already initialized
    const hasConfig = await configManager.hasProjectConfig(projectPath);
    if (hasConfig && !options.force) {
      const linkStatus = await symlink.getProjectLinkStatus(projectPath);
      
      if (linkStatus.skills.isSymlink && linkStatus.rules.isSymlink) {
        result.message = 'Project already initialized. Use --force to reinitialize.';
        logger.warn(result.message);
        return result;
      }
    }

    // Step 2: Initialize global storage if needed
    logger.startSpinner('Checking global installation...');
    
    if (!await storage.isInitialized()) {
      logger.spinnerWarn('Global storage not found, initializing...');
      await storage.initialize();
    }
    
    logger.spinnerSuccess('Global installation verified');

    // Step 3: Create .cursor directory
    logger.startSpinner(`Creating ${CURSOR_DIR_NAME} directory...`);
    
    // The symlink manager will create parent directories as needed
    logger.spinnerSuccess(`${CURSOR_DIR_NAME} directory ready`);

    // Step 4: Create symlinks
    logger.startSpinner('Linking skills (symlink)...');
    result.skillsLinked = await symlink.linkProjectSkills(projectPath);
    
    if (result.skillsLinked) {
      logger.spinnerSuccess('Skills linked');
    } else {
      logger.spinnerFail('Failed to link skills');
    }

    logger.startSpinner('Linking rules (symlink)...');
    result.rulesLinked = await symlink.linkProjectRules(projectPath);
    
    if (result.rulesLinked) {
      logger.spinnerSuccess('Rules linked');
    } else {
      logger.spinnerFail('Failed to link rules');
    }

    // Step 5: Create project config
    logger.startSpinner('Creating project config...');
    
    await configManager.createProjectConfig(projectPath, {
      autoRouting: options.noRouting ? false : true,
    });
    
    result.configCreated = true;
    logger.spinnerSuccess('Project config created');

    // Step 6: Display success message
    result.success = result.skillsLinked && result.rulesLinked && result.configCreated;
    
    if (result.success) {
      displaySuccessMessage(projectPath, options);
      result.message = 'SkillMana initialized successfully';
    } else {
      result.message = 'SkillMana initialization completed with warnings';
      logger.warn(result.message);
    }

    return result;
  } catch (error) {
    logger.stopSpinner();
    
    if (error instanceof Error) {
      result.message = `Initialization failed: ${error.message}`;
      logger.error(result.message);
    } else {
      result.message = 'Initialization failed with unknown error';
      logger.error(result.message);
    }
    
    return result;
  }
}

/**
 * Display success message
 */
function displaySuccessMessage(_projectPath: string, options: InitOptions): void {
  console.log('');
  console.log(chalk.green.bold('🎉 Done! SkillMana initialized.'));
  console.log('');
  console.log(chalk.gray('Structure:'));
  console.log(chalk.cyan(`  ${CURSOR_DIR_NAME}/`));
  console.log(chalk.gray(`  ├── skills -> ${GLOBAL_SKILLS_DIR}`));
  console.log(chalk.gray(`  ├── rules -> ${GLOBAL_RULES_DIR}`));
  console.log(chalk.gray(`  └── skillmana.json`));
  console.log('');
  console.log(chalk.gray('Configuration:'));
  console.log(`  Auto-routing: ${options.noRouting ? chalk.yellow('disabled') : chalk.green('enabled')}`);
  console.log('');
  
  if (!options.noRouting) {
    console.log(chalk.gray('To disable auto-routing:'));
    console.log(chalk.cyan(`  ${CLI_NAME} route --disable`));
    console.log('');
  }
}

/**
 * Create init command action
 */
export function createInitAction() {
  return async (options: { force?: boolean; routing?: boolean }) => {
    const initOptions: InitOptions = {
      force: options.force ?? false,
      noRouting: options.routing === false,
    };
    
    await initCommand(initOptions);
  };
}

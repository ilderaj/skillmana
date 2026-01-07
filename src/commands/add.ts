/**
 * Add Command
 * 
 * Add a new skill from various sources.
 */

import fs from 'fs-extra';
import { join, basename } from 'node:path';
import chalk from 'chalk';
import got from 'got';
import { storage, registry, parser } from '../core/index.js';
import { logger } from '../utils/logger.js';
import { GLOBAL_SKILLS_DIR, DEFAULT_CATEGORIES } from '../utils/constants.js';
import type { AddOptions } from '../types/index.js';

// ============================================================================
// Types
// ============================================================================

type SourceType = 'local' | 'url' | 'github';

interface ParsedSource {
  type: SourceType;
  path: string;
  name?: string;
}

// ============================================================================
// Implementation
// ============================================================================

/**
 * Parse source string to determine type
 */
function parseSource(source: string): ParsedSource {
  // Check if URL
  if (source.startsWith('http://') || source.startsWith('https://')) {
    return { type: 'url', path: source };
  }

  // Check if GitHub shorthand (user/repo or user/repo/path)
  if (source.match(/^[\w-]+\/[\w-]+/)) {
    return { type: 'github', path: source };
  }

  // Local path
  return { type: 'local', path: source };
}

/**
 * Determine category for skill
 */
function determineCategory(_skillName: string, options: AddOptions): string {
  if (options.category) {
    // Validate category
    const validCategory = DEFAULT_CATEGORIES.find(
      (c) => c.id === options.category || c.directory === options.category
    );
    if (validCategory) {
      return validCategory.id;
    }
    logger.warn(`Unknown category: ${options.category}, using 'custom'`);
  }
  return 'custom';
}

/**
 * Add skill from local path
 */
async function addFromLocal(source: string, options: AddOptions): Promise<boolean> {
  const sourcePath = source.startsWith('/') ? source : join(process.cwd(), source);

  if (!await fs.pathExists(sourcePath)) {
    logger.error(`Path not found: ${sourcePath}`);
    return false;
  }

  const stats = await fs.stat(sourcePath);
  const isDirectory = stats.isDirectory();

  // Determine skill name
  const skillName = basename(sourcePath).replace(/\.md$/, '');
  const category = determineCategory(skillName, options);
  const destDir = join(GLOBAL_SKILLS_DIR, storage.getCategoryDir(category).split('/').pop()!, skillName);

  // Check if exists
  if (await fs.pathExists(destDir) && !options.force) {
    logger.error(`Skill already exists: ${skillName}. Use --force to overwrite.`);
    return false;
  }

  // Copy skill
  logger.startSpinner(`Adding skill: ${skillName}...`);

  try {
    if (isDirectory) {
      await fs.copy(sourcePath, destDir, { overwrite: options.force });
    } else {
      // Single file - create directory and copy
      await fs.ensureDir(destDir);
      await fs.copy(sourcePath, join(destDir, 'SKILL.md'), { overwrite: options.force });
    }

    // Parse and register skill
    const skillFile = join(destDir, isDirectory ? 'SKILL.md' : 'SKILL.md');
    if (await fs.pathExists(skillFile)) {
      const skill = await parser.parseSkillFile(skillFile);
      if (skill) {
        await registry.addSkill(skill);
      }
    }

    logger.spinnerSuccess(`Added skill: ${skillName}`);
    console.log(chalk.gray(`  Location: ${destDir}`));
    return true;
  } catch (error) {
    logger.spinnerFail(`Failed to add skill: ${error}`);
    return false;
  }
}

/**
 * Add skill from URL
 */
async function addFromUrl(url: string, options: AddOptions): Promise<boolean> {
  logger.startSpinner(`Downloading skill from URL...`);

  try {
    const response = await got(url);
    const content = response.body;

    // Extract skill name from URL or content
    let skillName = basename(url).replace(/\.md$/, '');
    
    // Try to get name from frontmatter
    const frontmatter = parser.extractFrontmatter(content);
    if (frontmatter.name) {
      skillName = frontmatter.name;
    }

    const category = determineCategory(skillName, options);
    const destDir = join(GLOBAL_SKILLS_DIR, storage.getCategoryDir(category).split('/').pop()!, skillName);

    // Check if exists
    if (await fs.pathExists(destDir) && !options.force) {
      logger.spinnerFail(`Skill already exists: ${skillName}. Use --force to overwrite.`);
      return false;
    }

    // Save skill
    await fs.ensureDir(destDir);
    await fs.writeFile(join(destDir, 'SKILL.md'), content, 'utf-8');

    // Parse and register
    const skill = await parser.parseSkillFile(join(destDir, 'SKILL.md'));
    if (skill) {
      await registry.addSkill(skill);
    }

    logger.spinnerSuccess(`Added skill: ${skillName}`);
    console.log(chalk.gray(`  Location: ${destDir}`));
    return true;
  } catch (error) {
    logger.spinnerFail(`Failed to download skill: ${error}`);
    return false;
  }
}

/**
 * Add skill from GitHub
 */
async function addFromGitHub(source: string, options: AddOptions): Promise<boolean> {
  // Parse GitHub path: user/repo or user/repo/path/to/skill
  const parts = source.split('/');
  
  if (parts.length < 2) {
    logger.error('Invalid GitHub path. Use: user/repo or user/repo/path');
    return false;
  }

  const user = parts[0];
  const repo = parts[1];
  const path = parts.slice(2).join('/') || '';

  // Construct raw URL
  const branch = 'main'; // Could be made configurable
  const skillFileName = path.endsWith('.md') ? path : `${path}/SKILL.md`;
  const url = `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${skillFileName}`;

  logger.debug(`GitHub URL: ${url}`);
  return addFromUrl(url, options);
}

/**
 * Execute add command
 */
export async function addCommand(source: string, options: AddOptions): Promise<boolean> {
  logger.debug(`Add command: source="${source}", options=${JSON.stringify(options)}`);

  // Initialize storage
  await storage.initialize();

  // Parse source
  const parsed = parseSource(source);
  logger.debug(`Parsed source: ${JSON.stringify(parsed)}`);

  switch (parsed.type) {
    case 'local':
      return addFromLocal(parsed.path, options);
    case 'url':
      return addFromUrl(parsed.path, options);
    case 'github':
      return addFromGitHub(parsed.path, options);
    default:
      logger.error(`Unknown source type: ${parsed.type}`);
      return false;
  }
}

/**
 * Create add command action
 */
export function createAddAction() {
  return async (source: string, options: {
    global?: boolean;
    local?: boolean;
    category?: string;
    force?: boolean;
  }) => {
    const addOptions: AddOptions = {
      global: options.global ?? true,
      local: options.local ?? false,
      category: options.category,
      force: options.force ?? false,
    };
    
    await addCommand(source, addOptions);
  };
}

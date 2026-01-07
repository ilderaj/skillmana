/**
 * Anthropic Skills Downloader
 * 
 * Downloads and manages official Anthropic skills from GitHub.
 */

import fs from 'fs-extra';
import got from 'got';
import { join } from 'node:path';
import {
  ANTHROPIC_SKILLS,
  ANTHROPIC_SKILLS_RAW_URL,
  GLOBAL_SKILLS_DIR,
  CACHE_DIR,
} from '../utils/constants.js';
import { logger } from '../utils/logger.js';
import { registry } from './registry.js';
import { parser } from './parser.js';

// ============================================================================
// Types
// ============================================================================

export interface DownloadResult {
  skillName: string;
  success: boolean;
  path?: string;
  error?: string;
  isNew: boolean;
  isUpdated: boolean;
}

export interface UpdateInfo {
  skillName: string;
  currentVersion?: string;
  latestCommit?: string;
  isInstalled: boolean;
  hasUpdate: boolean;
}

export interface SkillContent {
  name: string;
  content: string;
  path: string;
}

export interface AnthropicDownloader {
  listAvailableSkills(): Promise<string[]>;
  downloadSkill(skillName: string, force?: boolean): Promise<DownloadResult>;
  downloadAll(force?: boolean): Promise<DownloadResult[]>;
  checkForUpdates(): Promise<UpdateInfo[]>;
  getInstalledSkills(): Promise<string[]>;
  isSkillInstalled(skillName: string): Promise<boolean>;
}

// ============================================================================
// Constants
// ============================================================================

const ANTHROPIC_SKILLS_DIR = join(GLOBAL_SKILLS_DIR, 'anthropic');
const CACHE_FILE = join(CACHE_DIR, 'anthropic', 'cache.json');
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours

interface CacheData {
  skills: string[];
  lastUpdated: string;
  skillsTimestamps: Record<string, string>;
}

// ============================================================================
// Implementation
// ============================================================================

class AnthropicDownloaderImpl implements AnthropicDownloader {
  private cache: CacheData | null = null;

  /**
   * List available Anthropic skills
   */
  async listAvailableSkills(): Promise<string[]> {
    // Return the static list from constants
    // In the future, this could fetch from GitHub API
    return [...ANTHROPIC_SKILLS];
  }

  /**
   * Check if a skill is installed
   */
  async isSkillInstalled(skillName: string): Promise<boolean> {
    const skillPath = join(ANTHROPIC_SKILLS_DIR, skillName);
    const skillFile = join(skillPath, 'SKILL.md');
    return fs.pathExists(skillFile);
  }

  /**
   * Get list of installed Anthropic skills
   */
  async getInstalledSkills(): Promise<string[]> {
    const installed: string[] = [];
    
    if (!await fs.pathExists(ANTHROPIC_SKILLS_DIR)) {
      return installed;
    }

    const entries = await fs.readdir(ANTHROPIC_SKILLS_DIR, { withFileTypes: true });
    
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const skillFile = join(ANTHROPIC_SKILLS_DIR, entry.name, 'SKILL.md');
        if (await fs.pathExists(skillFile)) {
          installed.push(entry.name);
        }
      }
    }

    return installed;
  }

  /**
   * Download a single skill
   */
  async downloadSkill(skillName: string, force = false): Promise<DownloadResult> {
    const skillPath = join(ANTHROPIC_SKILLS_DIR, skillName);
    const skillFile = join(skillPath, 'SKILL.md');

    try {
      // Check if skill exists in available list
      const available = await this.listAvailableSkills();
      if (!available.includes(skillName)) {
        return {
          skillName,
          success: false,
          error: `Unknown Anthropic skill: ${skillName}`,
          isNew: false,
          isUpdated: false,
        };
      }

      // Check if already installed
      const isInstalled = await fs.pathExists(skillFile);
      if (isInstalled && !force) {
        logger.debug(`Skill ${skillName} already installed, skipping`);
        return {
          skillName,
          success: true,
          path: skillPath,
          isNew: false,
          isUpdated: false,
        };
      }

      // Download skill content
      const url = `${ANTHROPIC_SKILLS_RAW_URL}/${skillName}/SKILL.md`;
      logger.debug(`Downloading from: ${url}`);

      const response = await got(url, {
        timeout: { request: 30000 },
        retry: { limit: 3 },
      });

      // Ensure directory exists
      await fs.ensureDir(skillPath);

      // Write skill file
      await fs.writeFile(skillFile, response.body, 'utf-8');

      // Parse and add to registry
      const skill = await parser.parseSkillFile(skillFile);
      if (skill) {
        skill.source = 'anthropic';
        skill.category = 'anthropic';
        await registry.addSkill(skill);
      }

      // Update cache
      await this.updateCache(skillName);

      logger.debug(`Downloaded skill: ${skillName}`);

      return {
        skillName,
        success: true,
        path: skillPath,
        isNew: !isInstalled,
        isUpdated: isInstalled,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      logger.debug(`Error downloading ${skillName}: ${errorMessage}`);

      return {
        skillName,
        success: false,
        error: errorMessage,
        isNew: false,
        isUpdated: false,
      };
    }
  }

  /**
   * Download all available skills
   */
  async downloadAll(force = false): Promise<DownloadResult[]> {
    const results: DownloadResult[] = [];
    const available = await this.listAvailableSkills();

    // Ensure anthropic directory exists
    await fs.ensureDir(ANTHROPIC_SKILLS_DIR);

    for (const skillName of available) {
      const result = await this.downloadSkill(skillName, force);
      results.push(result);
    }

    return results;
  }

  /**
   * Check for available updates
   */
  async checkForUpdates(): Promise<UpdateInfo[]> {
    const updates: UpdateInfo[] = [];
    const available = await this.listAvailableSkills();
    const installed = await this.getInstalledSkills();

    for (const skillName of available) {
      const isInstalled = installed.includes(skillName);

      updates.push({
        skillName,
        isInstalled,
        hasUpdate: !isInstalled, // For now, mark uninstalled as "update available"
      });
    }

    return updates;
  }

  /**
   * Load cache from file
   */
  private async loadCache(): Promise<CacheData | null> {
    if (this.cache) return this.cache;

    try {
      if (await fs.pathExists(CACHE_FILE)) {
        const content = await fs.readFile(CACHE_FILE, 'utf-8');
        this.cache = JSON.parse(content);

        // Check if cache is still valid
        const lastUpdated = new Date(this.cache!.lastUpdated).getTime();
        if (Date.now() - lastUpdated > CACHE_TTL) {
          this.cache = null;
        }
      }
    } catch {
      this.cache = null;
    }

    return this.cache;
  }

  /**
   * Update cache with new skill timestamp
   */
  private async updateCache(skillName: string): Promise<void> {
    const cache = await this.loadCache() || {
      skills: [...ANTHROPIC_SKILLS],
      lastUpdated: new Date().toISOString(),
      skillsTimestamps: {},
    };

    cache.skillsTimestamps[skillName] = new Date().toISOString();
    cache.lastUpdated = new Date().toISOString();

    await fs.ensureDir(join(CACHE_DIR, 'anthropic'));
    await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2), 'utf-8');

    this.cache = cache;
  }
}

// ============================================================================
// Export
// ============================================================================

/**
 * Default anthropic downloader instance
 */
export const anthropicDownloader = new AnthropicDownloaderImpl();

/**
 * Create a new downloader instance
 */
export function createAnthropicDownloader(): AnthropicDownloader {
  return new AnthropicDownloaderImpl();
}

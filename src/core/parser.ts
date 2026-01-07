/**
 * Skill Parser
 * 
 * Parses skill files and extracts metadata from frontmatter.
 */

import fs from 'fs-extra';
import { parse as parseYaml } from 'yaml';
import { basename, dirname, join } from 'node:path';
import type { Skill, SkillDomain, SkillSource } from '../types/index.js';
import { logger } from '../utils/logger.js';
import { DEFAULT_CATEGORIES } from '../utils/constants.js';

// ============================================================================
// Types
// ============================================================================

export interface SkillFrontmatter {
  name?: string;
  description?: string;
  license?: string;
  triggers?: string[];
  domain?: string;
  version?: string;
  author?: string;
}

export interface SkillParser {
  parseSkillFile(filePath: string): Promise<Skill | null>;
  parseDirectory(dirPath: string): Promise<Skill[]>;
  extractFrontmatter(content: string): SkillFrontmatter;
}

// ============================================================================
// Constants
// ============================================================================

const SKILL_FILE_NAMES = ['SKILL.md', 'skill.md', 'README.md', 'readme.md'];
const FRONTMATTER_REGEX = /^---\s*\n([\s\S]*?)\n---/;

// ============================================================================
// Implementation
// ============================================================================

class SkillParserImpl implements SkillParser {
  /**
   * Extract frontmatter from markdown content
   */
  extractFrontmatter(content: string): SkillFrontmatter {
    const match = content.match(FRONTMATTER_REGEX);
    
    if (!match) {
      return {};
    }

    try {
      const yaml = match[1];
      const parsed = parseYaml(yaml) as SkillFrontmatter;
      return parsed || {};
    } catch (error) {
      logger.debug(`Error parsing frontmatter: ${error}`);
      return {};
    }
  }

  /**
   * Determine skill domain from path or content
   */
  private determineDomain(path: string, frontmatter: SkillFrontmatter): SkillDomain {
    // Check frontmatter first
    if (frontmatter.domain) {
      const domain = frontmatter.domain.toLowerCase();
      const validDomains: SkillDomain[] = [
        'product', 'frontend', 'testing', 'payment', 'business',
        'mobile', 'optimization', 'document', 'creative', 'tools', 'other'
      ];
      if (validDomains.includes(domain as SkillDomain)) {
        return domain as SkillDomain;
      }
    }

    // Infer from path
    const pathLower = path.toLowerCase();
    
    if (pathLower.includes('product') || pathLower.includes('prd')) {
      return 'product';
    }
    if (pathLower.includes('frontend') || pathLower.includes('ux') || pathLower.includes('ui')) {
      return 'frontend';
    }
    if (pathLower.includes('test') || pathLower.includes('qa')) {
      return 'testing';
    }
    if (pathLower.includes('stripe') || pathLower.includes('payment')) {
      return 'payment';
    }
    if (pathLower.includes('business') || pathLower.includes('ddd')) {
      return 'business';
    }
    if (pathLower.includes('mobile') || pathLower.includes('ios') || pathLower.includes('macos')) {
      return 'mobile';
    }
    if (pathLower.includes('optim')) {
      return 'optimization';
    }
    if (pathLower.includes('doc') || pathLower.includes('xlsx') || pathLower.includes('pdf')) {
      return 'document';
    }
    if (pathLower.includes('canvas') || pathLower.includes('art') || pathLower.includes('design')) {
      return 'creative';
    }
    if (pathLower.includes('mcp') || pathLower.includes('tool')) {
      return 'tools';
    }

    return 'other';
  }

  /**
   * Determine skill source from path
   */
  private determineSource(path: string): SkillSource {
    const pathLower = path.toLowerCase();
    
    if (pathLower.includes('anthropic')) {
      return 'anthropic';
    }
    if (pathLower.includes('custom')) {
      return 'custom';
    }
    
    return 'community';
  }

  /**
   * Determine category from path
   */
  private determineCategory(path: string): string {
    for (const category of DEFAULT_CATEGORIES) {
      if (path.includes(category.directory)) {
        return category.id;
      }
    }
    return 'custom';
  }

  /**
   * Extract triggers from description and name
   */
  private extractTriggers(name: string, description: string, frontmatter: SkillFrontmatter): string[] {
    const triggers: Set<string> = new Set();

    // Add frontmatter triggers
    if (frontmatter.triggers && Array.isArray(frontmatter.triggers)) {
      frontmatter.triggers.forEach((t) => triggers.add(t.toLowerCase()));
    }

    // Add name parts
    const nameParts = name.split(/[-_\s]+/);
    nameParts.forEach((part) => {
      if (part.length > 2) {
        triggers.add(part.toLowerCase());
      }
    });

    // Extract keywords from description
    const keywords = ['react', 'next', 'vue', 'stripe', 'test', 'prd', 'api', 'ui', 'ux'];
    const descLower = description.toLowerCase();
    keywords.forEach((kw) => {
      if (descLower.includes(kw)) {
        triggers.add(kw);
      }
    });

    return Array.from(triggers);
  }

  /**
   * Parse a skill file
   */
  async parseSkillFile(filePath: string): Promise<Skill | null> {
    try {
      if (!await fs.pathExists(filePath)) {
        logger.debug(`Skill file not found: ${filePath}`);
        return null;
      }

      const content = await fs.readFile(filePath, 'utf-8');
      const frontmatter = this.extractFrontmatter(content);

      // Get skill directory name as fallback name
      const dirName = basename(dirname(filePath));
      const name = frontmatter.name || dirName;
      const id = name.toLowerCase().replace(/\s+/g, '-');

      // Extract description from frontmatter or first paragraph
      let description = frontmatter.description || '';
      if (!description) {
        // Try to extract first paragraph after frontmatter
        const contentWithoutFrontmatter = content.replace(FRONTMATTER_REGEX, '').trim();
        const firstParagraph = contentWithoutFrontmatter.split('\n\n')[0];
        description = firstParagraph.replace(/^#+\s*/, '').trim().slice(0, 200);
      }

      const skill: Skill = {
        id,
        name,
        description,
        category: this.determineCategory(filePath),
        path: dirname(filePath),
        isCore: filePath.includes('/core/') || name.includes('-core'),
        triggers: this.extractTriggers(name, description, frontmatter),
        domain: this.determineDomain(filePath, frontmatter),
        source: this.determineSource(filePath),
        metadata: {
          version: frontmatter.version,
          author: frontmatter.author,
          license: frontmatter.license,
        },
      };

      logger.debug(`Parsed skill: ${skill.id} from ${filePath}`);
      return skill;
    } catch (error) {
      logger.debug(`Error parsing skill file ${filePath}: ${error}`);
      return null;
    }
  }

  /**
   * Parse all skills in a directory
   */
  async parseDirectory(dirPath: string): Promise<Skill[]> {
    const skills: Skill[] = [];

    try {
      if (!await fs.pathExists(dirPath)) {
        logger.debug(`Directory not found: ${dirPath}`);
        return skills;
      }

      const entries = await fs.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        if (entry.isDirectory()) {
          // Check for skill file in subdirectory
          const subDir = join(dirPath, entry.name);
          
          for (const skillFileName of SKILL_FILE_NAMES) {
            const skillFilePath = join(subDir, skillFileName);
            if (await fs.pathExists(skillFilePath)) {
              const skill = await this.parseSkillFile(skillFilePath);
              if (skill) {
                skills.push(skill);
              }
              break; // Found skill file, move to next directory
            }
          }
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          // Check if it's a skill file directly in the directory
          const filePath = join(dirPath, entry.name);
          const skill = await this.parseSkillFile(filePath);
          if (skill) {
            skills.push(skill);
          }
        }
      }
    } catch (error) {
      logger.debug(`Error parsing directory ${dirPath}: ${error}`);
    }

    return skills;
  }
}

// ============================================================================
// Export
// ============================================================================

/**
 * Default parser instance
 */
export const parser = new SkillParserImpl();

/**
 * Create a new parser instance
 */
export function createParser(): SkillParser {
  return new SkillParserImpl();
}

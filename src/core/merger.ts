/**
 * Core Skills Merger
 * 
 * Merges multiple related skills into token-efficient core versions.
 */

import fs from 'fs-extra';
import { join } from 'node:path';
import type { Skill, SkillDomain } from '../types/index.js';
import { GLOBAL_SKILLS_DIR } from '../utils/constants.js';
import { logger } from '../utils/logger.js';

// ============================================================================
// Types
// ============================================================================

export interface MergeOptions {
  name: string;
  description?: string;
  maxTokens?: number;
  preserveSections?: string[];
}

export interface CoreSection {
  title: string;
  content: string;
  sourceSkill: string;
  importance: 'critical' | 'important' | 'optional';
}

export interface CoreSkill extends Skill {
  sourceSkills: string[];
  compressionRatio: number;
  tokenCount: number;
  sections: CoreSection[];
}

export interface MergeSuggestion {
  suggestedName: string;
  skills: string[];
  estimatedCompression: number;
  reason: string;
}

export interface CoreMerger {
  merge(skills: Skill[], options: MergeOptions): Promise<CoreSkill>;
  canMerge(skills: Skill[]): boolean;
  suggestMerges(skills: Skill[]): Promise<MergeSuggestion[]>;
  generateCoreFile(coreSkill: CoreSkill): Promise<string>;
  estimateTokens(content: string): number;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Section importance classifications
 */
const SECTION_IMPORTANCE: Record<string, 'critical' | 'important' | 'optional'> = {
  // Critical - Always include
  'principles': 'critical',
  'philosophy': 'critical',
  'core concepts': 'critical',
  'key rules': 'critical',
  'fundamentals': 'critical',
  'overview': 'critical',
  
  // Important - Include if space allows
  'best practices': 'important',
  'guidelines': 'important',
  'patterns': 'important',
  'workflow': 'important',
  'usage': 'important',
  'implementation': 'important',
  
  // Optional - Compress or omit
  'examples': 'optional',
  'detailed steps': 'optional',
  'troubleshooting': 'optional',
  'references': 'optional',
  'appendix': 'optional',
  'changelog': 'optional',
};

/**
 * Default max tokens for core skills
 */
const DEFAULT_MAX_TOKENS = 2000;

// ============================================================================
// Implementation
// ============================================================================

class CoreMergerImpl implements CoreMerger {
  /**
   * Estimate tokens from content (rough approximation)
   */
  estimateTokens(content: string): number {
    // Rough estimate: ~4 characters per token for English text
    return Math.ceil(content.length / 4);
  }

  /**
   * Check if skills can be merged
   */
  canMerge(skills: Skill[]): boolean {
    if (skills.length < 2) return false;

    // Check if all skills are in the same domain
    const domains = new Set(skills.map(s => s.domain));
    if (domains.size > 2) {
      logger.debug('Too many different domains to merge');
      return false;
    }

    // Check if already core skills
    if (skills.every(s => s.isCore)) {
      logger.debug('All skills are already core skills');
      return false;
    }

    return true;
  }

  /**
   * Merge multiple skills into a core skill
   */
  async merge(skills: Skill[], options: MergeOptions): Promise<CoreSkill> {
    if (!this.canMerge(skills)) {
      throw new Error('Skills cannot be merged');
    }

    const maxTokens = options.maxTokens || DEFAULT_MAX_TOKENS;
    const sections: CoreSection[] = [];
    let totalSourceTokens = 0;

    // Collect sections from all skills
    for (const skill of skills) {
      const skillSections = await this.extractSections(skill);
      sections.push(...skillSections);
      
      // Estimate source tokens
      const content = skillSections.map(s => s.content).join('\n');
      totalSourceTokens += this.estimateTokens(content);
    }

    // Sort sections by importance
    sections.sort((a, b) => {
      const importanceOrder = { critical: 0, important: 1, optional: 2 };
      return importanceOrder[a.importance] - importanceOrder[b.importance];
    });

    // Select sections to fit within token limit
    const selectedSections: CoreSection[] = [];
    let currentTokens = 0;

    for (const section of sections) {
      const sectionTokens = this.estimateTokens(section.content);
      
      // Always include critical sections
      if (section.importance === 'critical') {
        selectedSections.push(section);
        currentTokens += sectionTokens;
        continue;
      }

      // Include important/optional if space allows
      if (currentTokens + sectionTokens <= maxTokens) {
        selectedSections.push(section);
        currentTokens += sectionTokens;
      }
    }

    // Determine primary domain
    const domainCounts = new Map<SkillDomain, number>();
    for (const skill of skills) {
      domainCounts.set(skill.domain, (domainCounts.get(skill.domain) || 0) + 1);
    }
    let primaryDomain: SkillDomain = 'other';
    let maxCount = 0;
    for (const [domain, count] of domainCounts) {
      if (count > maxCount) {
        primaryDomain = domain;
        maxCount = count;
      }
    }

    // Collect all triggers
    const allTriggers = new Set<string>();
    for (const skill of skills) {
      skill.triggers.forEach(t => allTriggers.add(t));
    }

    // Calculate compression ratio
    const compressionRatio = totalSourceTokens > 0 
      ? 1 - (currentTokens / totalSourceTokens) 
      : 0;

    const coreSkill: CoreSkill = {
      id: options.name.toLowerCase().replace(/\s+/g, '-'),
      name: options.name,
      description: options.description || `Combined essential principles from ${skills.length} skills`,
      category: 'core',
      path: join(GLOBAL_SKILLS_DIR, 'core', options.name.toLowerCase().replace(/\s+/g, '-')),
      isCore: true,
      triggers: Array.from(allTriggers).slice(0, 15),
      domain: primaryDomain,
      source: 'custom',
      metadata: {
        version: '1.0.0',
        lastUpdated: new Date().toISOString(),
      },
      sourceSkills: skills.map(s => s.id),
      compressionRatio,
      tokenCount: currentTokens,
      sections: selectedSections,
    };

    return coreSkill;
  }

  /**
   * Suggest merge candidates from a list of skills
   */
  async suggestMerges(skills: Skill[]): Promise<MergeSuggestion[]> {
    const suggestions: MergeSuggestion[] = [];

    // Group skills by domain
    const byDomain = new Map<SkillDomain, Skill[]>();
    for (const skill of skills) {
      if (skill.isCore) continue; // Skip existing core skills
      
      const list = byDomain.get(skill.domain) || [];
      list.push(skill);
      byDomain.set(skill.domain, list);
    }

    // Suggest merges for domains with multiple skills
    for (const [domain, domainSkills] of byDomain) {
      if (domainSkills.length >= 2) {
        suggestions.push({
          suggestedName: `${domain}-core`,
          skills: domainSkills.map(s => s.id),
          estimatedCompression: 0.5, // Rough estimate
          reason: `Combine ${domainSkills.length} ${domain} skills into core version`,
        });
      }
    }

    // Sort by number of skills (more skills = better merge candidate)
    suggestions.sort((a, b) => b.skills.length - a.skills.length);

    return suggestions;
  }

  /**
   * Generate core skill markdown file
   */
  async generateCoreFile(coreSkill: CoreSkill): Promise<string> {
    const lines: string[] = [];

    // Frontmatter
    lines.push('---');
    lines.push(`name: ${coreSkill.name}`);
    lines.push(`description: ${coreSkill.description}`);
    lines.push(`domain: ${coreSkill.domain}`);
    lines.push('sourceSkills:');
    for (const sourceId of coreSkill.sourceSkills) {
      lines.push(`  - ${sourceId}`);
    }
    lines.push(`tokens: ~${coreSkill.tokenCount}`);
    lines.push(`compression: ${Math.round(coreSkill.compressionRatio * 100)}%`);
    lines.push('---');
    lines.push('');

    // Title
    lines.push(`# ${coreSkill.name}`);
    lines.push('');
    lines.push(`> Combined essential principles from: ${coreSkill.sourceSkills.join(', ')}`);
    lines.push('');

    // Quick Reference
    lines.push('## Quick Reference');
    lines.push('');
    lines.push(`- **Domain**: ${coreSkill.domain}`);
    lines.push(`- **Triggers**: ${coreSkill.triggers.slice(0, 5).join(', ')}`);
    lines.push(`- **Token Estimate**: ~${coreSkill.tokenCount}`);
    lines.push('');

    // Group sections by importance
    const criticalSections = coreSkill.sections.filter(s => s.importance === 'critical');
    const importantSections = coreSkill.sections.filter(s => s.importance === 'important');
    const optionalSections = coreSkill.sections.filter(s => s.importance === 'optional');

    // Core Principles (Critical)
    if (criticalSections.length > 0) {
      lines.push('## Core Principles');
      lines.push('');
      for (const section of criticalSections) {
        lines.push(`### ${section.title}`);
        lines.push(`_From: ${section.sourceSkill}_`);
        lines.push('');
        lines.push(section.content);
        lines.push('');
      }
    }

    // Key Patterns (Important)
    if (importantSections.length > 0) {
      lines.push('## Key Patterns');
      lines.push('');
      for (const section of importantSections) {
        lines.push(`### ${section.title}`);
        lines.push(`_From: ${section.sourceSkill}_`);
        lines.push('');
        lines.push(section.content);
        lines.push('');
      }
    }

    // Additional Notes (Optional)
    if (optionalSections.length > 0) {
      lines.push('## Additional Notes');
      lines.push('');
      for (const section of optionalSections) {
        lines.push(`### ${section.title}`);
        lines.push(`_From: ${section.sourceSkill}_`);
        lines.push('');
        // Truncate optional content if too long
        const truncated = section.content.length > 500 
          ? section.content.slice(0, 500) + '...'
          : section.content;
        lines.push(truncated);
        lines.push('');
      }
    }

    // Footer
    lines.push('---');
    lines.push(`*Expanded skills: ${coreSkill.sourceSkills.join(', ')}*`);
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Extract sections from a skill file
   */
  private async extractSections(skill: Skill): Promise<CoreSection[]> {
    const sections: CoreSection[] = [];

    try {
      // Find skill file
      const possibleFiles = ['SKILL.md', 'skill.md', 'README.md', 'readme.md'];
      let content = '';

      for (const filename of possibleFiles) {
        const filePath = join(skill.path, filename);
        if (await fs.pathExists(filePath)) {
          content = await fs.readFile(filePath, 'utf-8');
          break;
        }
      }

      if (!content) {
        logger.debug(`No skill file found for: ${skill.id}`);
        return sections;
      }

      // Remove frontmatter
      const contentWithoutFrontmatter = content.replace(/^---[\s\S]*?---\n?/, '');

      // Parse markdown sections
      const sectionRegex = /^#{1,3}\s+(.+)$/gm;
      const matches = [...contentWithoutFrontmatter.matchAll(sectionRegex)];

      for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const title = match[1].trim();
        const startIndex = match.index! + match[0].length;
        const endIndex = matches[i + 1]?.index || contentWithoutFrontmatter.length;
        const sectionContent = contentWithoutFrontmatter.slice(startIndex, endIndex).trim();

        // Determine importance
        let importance: 'critical' | 'important' | 'optional' = 'optional';
        const titleLower = title.toLowerCase();

        for (const [key, value] of Object.entries(SECTION_IMPORTANCE)) {
          if (titleLower.includes(key)) {
            importance = value;
            break;
          }
        }

        if (sectionContent.length > 50) { // Only include substantial sections
          sections.push({
            title,
            content: sectionContent,
            sourceSkill: skill.id,
            importance,
          });
        }
      }
    } catch (error) {
      logger.debug(`Error extracting sections from ${skill.id}: ${error}`);
    }

    return sections;
  }
}

// ============================================================================
// Export
// ============================================================================

/**
 * Default merger instance
 */
export const merger = new CoreMergerImpl();

/**
 * Create a new merger instance
 */
export function createMerger(): CoreMerger {
  return new CoreMergerImpl();
}

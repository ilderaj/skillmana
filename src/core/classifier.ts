/**
 * Skill Classifier
 * 
 * Automatically classifies skills based on content, metadata, and path.
 */

import type { Skill, SkillDomain, Category } from '../types/index.js';
import type { SkillFrontmatter } from './parser.js';
import { DEFAULT_CATEGORIES } from '../utils/constants.js';
import { logger } from '../utils/logger.js';

// ============================================================================
// Types
// ============================================================================

export interface ClassificationResult {
  skillId: string;
  originalCategory: string;
  suggestedCategory: string;
  confidence: number; // 0-1
  reasoning: string[];
  domain: SkillDomain;
  keywords: string[];
}

export interface CategorySuggestion {
  categoryId: string;
  confidence: number;
  matchedKeywords: string[];
}

export interface Classifier {
  classifySkill(skill: Skill): Promise<ClassificationResult>;
  classifyBatch(skills: Skill[]): Promise<ClassificationResult[]>;
  suggestCategory(content: string, metadata?: SkillFrontmatter): Promise<CategorySuggestion[]>;
  detectDomain(content: string, path: string): SkillDomain;
  extractKeywords(content: string): string[];
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Domain-specific keywords for classification
 */
export const DOMAIN_KEYWORDS: Record<SkillDomain, string[]> = {
  product: [
    'prd', 'product', 'requirement', 'user story', 'feature', 'roadmap',
    'sprint', 'backlog', 'epic', 'stakeholder', 'mvp', 'scope', 'priority'
  ],
  frontend: [
    'ui', 'ux', 'react', 'vue', 'angular', 'css', 'html', 'component',
    'frontend', 'design', 'layout', 'responsive', 'tailwind', 'sass',
    'nextjs', 'svelte', 'web', 'browser', 'dom', 'accessibility', 'a11y'
  ],
  testing: [
    'test', 'qa', 'e2e', 'tdd', 'coverage', 'jest', 'vitest', 'playwright',
    'cypress', 'unit', 'integration', 'mock', 'stub', 'assertion', 'spec'
  ],
  payment: [
    'stripe', 'payment', 'checkout', 'billing', 'subscription', 'invoice',
    'charge', 'refund', 'webhook', 'customer', 'price', 'plan', 'recurring'
  ],
  business: [
    'ddd', 'domain', 'architecture', 'business', 'model', 'entity',
    'aggregate', 'bounded context', 'ubiquitous language', 'clean architecture'
  ],
  mobile: [
    'ios', 'macos', 'swift', 'mobile', 'app', 'native', 'android', 'kotlin',
    'flutter', 'react native', 'swiftui', 'uikit', 'xcode', 'cocoapods'
  ],
  optimization: [
    'optimize', 'token', 'compress', 'efficiency', 'performance', 'cache',
    'lazy', 'bundle', 'minify', 'tree-shaking', 'speed', 'memory'
  ],
  document: [
    'doc', 'pdf', 'xlsx', 'pptx', 'docx', 'word', 'excel', 'powerpoint',
    'markdown', 'readme', 'guide', 'tutorial', 'documentation'
  ],
  creative: [
    'design', 'art', 'canvas', 'creative', 'visual', 'brand', 'logo',
    'illustration', 'graphic', 'color', 'typography', 'image', 'animation'
  ],
  tools: [
    'mcp', 'tool', 'cli', 'utility', 'helper', 'generator', 'script',
    'automation', 'workflow', 'plugin', 'extension', 'api', 'sdk'
  ],
  other: [],
};

/**
 * Category-specific keywords (extends DEFAULT_CATEGORIES)
 */
const CATEGORY_KEYWORDS: Record<string, string[]> = {};
DEFAULT_CATEGORIES.forEach(cat => {
  CATEGORY_KEYWORDS[cat.id] = cat.keywords;
});

// ============================================================================
// Implementation
// ============================================================================

class ClassifierImpl implements Classifier {
  /**
   * Classify a single skill
   */
  async classifySkill(skill: Skill): Promise<ClassificationResult> {
    const reasoning: string[] = [];
    const keywords = this.extractKeywords(`${skill.name} ${skill.description}`);
    
    // Detect domain
    const domain = this.detectDomain(`${skill.name} ${skill.description}`, skill.path);
    reasoning.push(`Domain detected: ${domain}`);
    
    // Get category suggestions
    const suggestions = await this.suggestCategory(
      `${skill.name} ${skill.description}`,
      { name: skill.name, description: skill.description, triggers: skill.triggers }
    );
    
    const topSuggestion = suggestions[0];
    if (topSuggestion) {
      reasoning.push(`Top category match: ${topSuggestion.categoryId} (${Math.round(topSuggestion.confidence * 100)}%)`);
      if (topSuggestion.matchedKeywords.length > 0) {
        reasoning.push(`Matched keywords: ${topSuggestion.matchedKeywords.join(', ')}`);
      }
    }

    // Check path-based signals
    const pathCategory = this.detectCategoryFromPath(skill.path);
    if (pathCategory) {
      reasoning.push(`Path suggests category: ${pathCategory}`);
    }

    // Determine final category
    const suggestedCategory = topSuggestion?.categoryId || pathCategory || 'custom';
    const confidence = topSuggestion?.confidence || 0.5;

    if (suggestedCategory !== skill.category) {
      reasoning.push(`Category change: ${skill.category} -> ${suggestedCategory}`);
    }

    return {
      skillId: skill.id,
      originalCategory: skill.category,
      suggestedCategory,
      confidence,
      reasoning,
      domain,
      keywords,
    };
  }

  /**
   * Classify multiple skills in batch
   */
  async classifyBatch(skills: Skill[]): Promise<ClassificationResult[]> {
    const results: ClassificationResult[] = [];
    
    for (const skill of skills) {
      const result = await this.classifySkill(skill);
      results.push(result);
    }
    
    return results;
  }

  /**
   * Suggest categories for content
   */
  async suggestCategory(content: string, metadata?: SkillFrontmatter): Promise<CategorySuggestion[]> {
    const suggestions: CategorySuggestion[] = [];
    const contentLower = content.toLowerCase();
    const allContent = metadata 
      ? `${contentLower} ${metadata.name || ''} ${metadata.description || ''} ${(metadata.triggers || []).join(' ')}`.toLowerCase()
      : contentLower;

    for (const category of DEFAULT_CATEGORIES) {
      const matchedKeywords: string[] = [];
      let score = 0;

      // Check category keywords
      for (const keyword of category.keywords) {
        if (allContent.includes(keyword.toLowerCase())) {
          matchedKeywords.push(keyword);
          score += 1;
        }
      }

      // Bonus for domain keyword matches
      const categoryKeywords = CATEGORY_KEYWORDS[category.id] || [];
      for (const keyword of categoryKeywords) {
        if (allContent.includes(keyword.toLowerCase()) && !matchedKeywords.includes(keyword)) {
          matchedKeywords.push(keyword);
          score += 0.5;
        }
      }

      // Calculate confidence
      const maxPossibleScore = category.keywords.length + (categoryKeywords.length * 0.5);
      const confidence = maxPossibleScore > 0 ? Math.min(score / maxPossibleScore, 1) : 0;

      if (matchedKeywords.length > 0) {
        suggestions.push({
          categoryId: category.id,
          confidence,
          matchedKeywords,
        });
      }
    }

    // Sort by confidence descending
    suggestions.sort((a, b) => b.confidence - a.confidence);

    return suggestions;
  }

  /**
   * Detect domain from content and path
   */
  detectDomain(content: string, path: string): SkillDomain {
    const combinedText = `${content} ${path}`.toLowerCase();
    const domainScores: Record<SkillDomain, number> = {
      product: 0,
      frontend: 0,
      testing: 0,
      payment: 0,
      business: 0,
      mobile: 0,
      optimization: 0,
      document: 0,
      creative: 0,
      tools: 0,
      other: 0,
    };

    // Score each domain
    for (const [domain, keywords] of Object.entries(DOMAIN_KEYWORDS)) {
      for (const keyword of keywords) {
        if (combinedText.includes(keyword.toLowerCase())) {
          domainScores[domain as SkillDomain] += 1;
        }
      }
    }

    // Find highest scoring domain
    let maxScore = 0;
    let detectedDomain: SkillDomain = 'other';

    for (const [domain, score] of Object.entries(domainScores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedDomain = domain as SkillDomain;
      }
    }

    return detectedDomain;
  }

  /**
   * Extract keywords from content
   */
  extractKeywords(content: string): string[] {
    const keywords = new Set<string>();
    const contentLower = content.toLowerCase();

    // Check all domain keywords
    for (const domainKeywords of Object.values(DOMAIN_KEYWORDS)) {
      for (const keyword of domainKeywords) {
        if (contentLower.includes(keyword.toLowerCase())) {
          keywords.add(keyword);
        }
      }
    }

    // Extract words that look like technical terms
    const words = contentLower.split(/\s+/);
    const technicalPatterns = [
      /^[a-z]+\.[a-z]+$/, // e.g., react.js
      /^[a-z]+-[a-z]+$/,  // e.g., user-story
      /^[a-z]+js$/,       // e.g., nextjs
    ];

    for (const word of words) {
      const cleanWord = word.replace(/[^a-z0-9-_.]/g, '');
      if (cleanWord.length > 2) {
        for (const pattern of technicalPatterns) {
          if (pattern.test(cleanWord)) {
            keywords.add(cleanWord);
            break;
          }
        }
      }
    }

    return Array.from(keywords).slice(0, 20); // Limit to 20 keywords
  }

  /**
   * Detect category from file path
   */
  private detectCategoryFromPath(path: string): string | null {
    const pathLower = path.toLowerCase();

    for (const category of DEFAULT_CATEGORIES) {
      if (pathLower.includes(`/${category.directory}/`) || pathLower.includes(`\\${category.directory}\\`)) {
        return category.id;
      }
    }

    // Special path patterns
    if (pathLower.includes('anthropic')) return 'anthropic';
    if (pathLower.includes('custom')) return 'custom';
    if (pathLower.includes('core')) return 'core';

    return null;
  }
}

// ============================================================================
// Export
// ============================================================================

/**
 * Default classifier instance
 */
export const classifier = new ClassifierImpl();

/**
 * Create a new classifier instance
 */
export function createClassifier(): Classifier {
  return new ClassifierImpl();
}

/**
 * Smart Router Engine
 * 
 * Intelligently routes user queries to appropriate skills based on intent and context.
 */

import type { Skill, SkillDomain, RoutingLevel, UserIntent, Complexity } from '../types/index.js';
import { registry } from './registry.js';
import { classifier } from './classifier.js';
import { logger } from '../utils/logger.js';

// ============================================================================
// Types
// ============================================================================

export type LoadLevel = 'L1' | 'L2' | 'L3';

export interface RouterInput {
  query: string;
  context?: {
    currentFile?: string;
    projectType?: string;
    recentSkills?: string[];
  };
  preferences?: {
    preferCore?: boolean;
    excludeSkills?: string[];
  };
}

export interface SelectedSkill {
  skillId: string;
  name: string;
  relevance: number;
  loadOrder: number;
}

export interface RoutingDecision {
  intent: UserIntent;
  domain: SkillDomain;
  complexity: Complexity;
  selectedSkills: SelectedSkill[];
  level: LoadLevel;
  reason: string;
}

export interface SkillRecommendation {
  skill: Skill;
  relevance: number;
  reason: string;
}

export interface RouterConfig {
  level: RoutingLevel;
  maxSkills: number;
  preferCore: boolean;
}

export interface Router {
  route(input: RouterInput): Promise<RoutingDecision>;
  getRecommendations(query: string, limit?: number): Promise<SkillRecommendation[]>;
  setLevel(level: RoutingLevel): void;
  getConfig(): RouterConfig;
  detectIntent(query: string): UserIntent;
  assessComplexity(query: string): Complexity;
}

// ============================================================================
// Constants
// ============================================================================

/**
 * Intent detection keywords
 */
export const INTENT_KEYWORDS: Record<UserIntent, string[]> = {
  BUILD: [
    'create', 'build', 'implement', 'add', 'new', 'develop', 'make', 'generate',
    'construct', 'establish', 'setup', 'initialize', 'scaffold', 'write'
  ],
  FIX: [
    'fix', 'bug', 'error', 'issue', 'debug', 'resolve', 'repair', 'patch',
    'correct', 'troubleshoot', 'diagnose', 'solve', 'broken', 'failing'
  ],
  TEST: [
    'test', 'spec', 'coverage', 'tdd', 'e2e', 'unit', 'integration', 'verify',
    'validate', 'assert', 'expect', 'mock', 'stub', 'fixture'
  ],
  DESIGN: [
    'design', 'ui', 'ux', 'layout', 'style', 'wireframe', 'mockup', 'prototype',
    'visual', 'interface', 'theme', 'responsive', 'accessibility'
  ],
  ANALYZE: [
    'analyze', 'review', 'audit', 'check', 'inspect', 'evaluate', 'assess',
    'examine', 'investigate', 'study', 'understand', 'explain', 'how does'
  ],
  DOCUMENT: [
    'document', 'doc', 'readme', 'guide', 'tutorial', 'explain', 'describe',
    'comment', 'annotate', 'write docs', 'documentation'
  ],
  OPTIMIZE: [
    'optimize', 'improve', 'performance', 'speed', 'efficiency', 'refactor',
    'enhance', 'faster', 'reduce', 'minimize', 'cache', 'compress'
  ],
};

/**
 * Complexity indicators
 */
const COMPLEXITY_INDICATORS = {
  simple: ['simple', 'quick', 'easy', 'basic', 'small', 'minor', 'single'],
  complex: [
    'complex', 'comprehensive', 'full', 'complete', 'entire', 'multiple',
    'integrate', 'architecture', 'system', 'refactor', 'migration', 'redesign'
  ],
};

/**
 * Load level skill limits
 */
const LEVEL_SKILL_LIMITS: Record<LoadLevel, number> = {
  L1: 1,
  L2: 3,
  L3: 5,
};

/**
 * Routing level to load level mapping
 */
const ROUTING_TO_LOAD: Record<RoutingLevel, LoadLevel> = {
  core: 'L1',
  auto: 'L2',
  full: 'L3',
};

// ============================================================================
// Implementation
// ============================================================================

class RouterImpl implements Router {
  private config: RouterConfig = {
    level: 'auto',
    maxSkills: 3,
    preferCore: true,
  };

  /**
   * Route a query to appropriate skills
   */
  async route(input: RouterInput): Promise<RoutingDecision> {
    const { query, context, preferences } = input;

    // Detect intent
    const intent = this.detectIntent(query);
    logger.debug(`Detected intent: ${intent}`);

    // Detect domain
    const domain = classifier.detectDomain(query, context?.currentFile || '');
    logger.debug(`Detected domain: ${domain}`);

    // Assess complexity
    const complexity = this.assessComplexity(query);
    logger.debug(`Assessed complexity: ${complexity}`);

    // Determine load level
    const level = this.determineLoadLevel(complexity);

    // Get skill recommendations
    const recommendations = await this.getRecommendations(query, LEVEL_SKILL_LIMITS[level]);

    // Filter by preferences
    let filteredRecommendations = recommendations;
    if (preferences?.excludeSkills?.length) {
      filteredRecommendations = recommendations.filter(
        r => !preferences.excludeSkills!.includes(r.skill.id)
      );
    }

    // Prefer core skills if configured
    if (this.config.preferCore || preferences?.preferCore) {
      filteredRecommendations.sort((a, b) => {
        if (a.skill.isCore && !b.skill.isCore) return -1;
        if (!a.skill.isCore && b.skill.isCore) return 1;
        return b.relevance - a.relevance;
      });
    }

    // Select skills based on load level
    const maxSkills = LEVEL_SKILL_LIMITS[level];
    const selectedSkills: SelectedSkill[] = filteredRecommendations
      .slice(0, maxSkills)
      .map((rec, index) => ({
        skillId: rec.skill.id,
        name: rec.skill.name,
        relevance: rec.relevance,
        loadOrder: index + 1,
      }));

    // Generate reason
    const reason = this.generateReason(intent, domain, selectedSkills);

    return {
      intent,
      domain,
      complexity,
      selectedSkills,
      level,
      reason,
    };
  }

  /**
   * Get skill recommendations for a query
   */
  async getRecommendations(query: string, limit = 5): Promise<SkillRecommendation[]> {
    const recommendations: SkillRecommendation[] = [];
    const queryLower = query.toLowerCase();

    // Get all skills
    const skills = await registry.listSkills();

    for (const skill of skills) {
      let relevance = 0;
      const reasons: string[] = [];

      // Check name match
      if (queryLower.includes(skill.name.toLowerCase())) {
        relevance += 0.4;
        reasons.push('Name match');
      }

      // Check trigger matches
      for (const trigger of skill.triggers) {
        if (queryLower.includes(trigger.toLowerCase())) {
          relevance += 0.2;
          reasons.push(`Trigger: ${trigger}`);
        }
      }

      // Check description match
      const descWords = skill.description.toLowerCase().split(/\s+/);
      const queryWords = queryLower.split(/\s+/);
      const matchingWords = queryWords.filter(qw => 
        descWords.some(dw => dw.includes(qw) || qw.includes(dw))
      );
      if (matchingWords.length > 0) {
        relevance += Math.min(matchingWords.length * 0.1, 0.3);
        reasons.push(`Keywords: ${matchingWords.slice(0, 3).join(', ')}`);
      }

      // Check domain match
      const queryDomain = classifier.detectDomain(query, '');
      if (skill.domain === queryDomain) {
        relevance += 0.2;
        reasons.push(`Domain: ${queryDomain}`);
      }

      // Boost core skills slightly
      if (skill.isCore) {
        relevance += 0.1;
        reasons.push('Core skill');
      }

      if (relevance > 0) {
        recommendations.push({
          skill,
          relevance: Math.min(relevance, 1),
          reason: reasons.join('; '),
        });
      }
    }

    // Sort by relevance and limit
    recommendations.sort((a, b) => b.relevance - a.relevance);
    return recommendations.slice(0, limit);
  }

  /**
   * Detect user intent from query
   */
  detectIntent(query: string): UserIntent {
    const queryLower = query.toLowerCase();
    const intentScores: Record<UserIntent, number> = {
      BUILD: 0,
      FIX: 0,
      TEST: 0,
      DESIGN: 0,
      ANALYZE: 0,
      DOCUMENT: 0,
      OPTIMIZE: 0,
    };

    for (const [intent, keywords] of Object.entries(INTENT_KEYWORDS)) {
      for (const keyword of keywords) {
        if (queryLower.includes(keyword)) {
          intentScores[intent as UserIntent] += 1;
        }
      }
    }

    // Find highest scoring intent
    let maxScore = 0;
    let detectedIntent: UserIntent = 'BUILD';

    for (const [intent, score] of Object.entries(intentScores)) {
      if (score > maxScore) {
        maxScore = score;
        detectedIntent = intent as UserIntent;
      }
    }

    // Default to BUILD if no clear intent
    return maxScore > 0 ? detectedIntent : 'BUILD';
  }

  /**
   * Assess query complexity
   */
  assessComplexity(query: string): Complexity {
    const queryLower = query.toLowerCase();

    // Check for complexity indicators
    let simpleScore = 0;
    let complexScore = 0;

    for (const word of COMPLEXITY_INDICATORS.simple) {
      if (queryLower.includes(word)) simpleScore++;
    }

    for (const word of COMPLEXITY_INDICATORS.complex) {
      if (queryLower.includes(word)) complexScore++;
    }

    // Also consider query length
    const wordCount = query.split(/\s+/).length;
    if (wordCount > 30) complexScore++;
    if (wordCount < 10) simpleScore++;

    // Determine complexity
    if (complexScore > simpleScore + 1) return 'COMPLEX';
    if (simpleScore > complexScore + 1) return 'SIMPLE';
    return 'MEDIUM';
  }

  /**
   * Set routing level
   */
  setLevel(level: RoutingLevel): void {
    this.config.level = level;
    this.config.maxSkills = LEVEL_SKILL_LIMITS[ROUTING_TO_LOAD[level]];
    logger.debug(`Router level set to: ${level}`);
  }

  /**
   * Get current configuration
   */
  getConfig(): RouterConfig {
    return { ...this.config };
  }

  /**
   * Determine load level based on complexity and config
   */
  private determineLoadLevel(complexity: Complexity): LoadLevel {
    const configLevel = ROUTING_TO_LOAD[this.config.level];

    // For 'auto' mode, adjust based on complexity
    if (this.config.level === 'auto') {
      switch (complexity) {
        case 'SIMPLE':
          return 'L1';
        case 'MEDIUM':
          return 'L2';
        case 'COMPLEX':
          return 'L3';
      }
    }

    return configLevel;
  }

  /**
   * Generate human-readable reason for routing decision
   */
  private generateReason(
    intent: UserIntent,
    domain: SkillDomain,
    selectedSkills: SelectedSkill[]
  ): string {
    const skillNames = selectedSkills.map(s => s.name).join(', ');
    const intentVerb = {
      BUILD: 'building',
      FIX: 'fixing',
      TEST: 'testing',
      DESIGN: 'designing',
      ANALYZE: 'analyzing',
      DOCUMENT: 'documenting',
      OPTIMIZE: 'optimizing',
    }[intent];

    if (selectedSkills.length === 0) {
      return `No specific skills found for ${intentVerb} in ${domain} domain.`;
    }

    return `Selected ${skillNames} for ${intentVerb} task in ${domain} domain.`;
  }
}

// ============================================================================
// Export
// ============================================================================

/**
 * Default router instance
 */
export const router = new RouterImpl();

/**
 * Create a new router instance
 */
export function createRouter(): Router {
  return new RouterImpl();
}

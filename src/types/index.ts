/**
 * SkillMana Type Definitions
 */

// ============================================================================
// Skill Types
// ============================================================================

/**
 * Skill source type
 */
export type SkillSource = 'anthropic' | 'community' | 'custom';

/**
 * Skill domain category
 */
export type SkillDomain = 
  | 'product'
  | 'frontend'
  | 'testing'
  | 'payment'
  | 'business'
  | 'mobile'
  | 'optimization'
  | 'document'
  | 'creative'
  | 'tools'
  | 'other';

/**
 * Skill metadata
 */
export interface SkillMetadata {
  version?: string;
  author?: string;
  license?: string;
  tokens?: number;
  lastUpdated?: string;
}

/**
 * Skill definition
 */
export interface Skill {
  id: string;
  name: string;
  description: string;
  category: string;
  path: string;
  isCore: boolean;
  triggers: string[];
  domain: SkillDomain;
  source: SkillSource;
  metadata: SkillMetadata;
}

// ============================================================================
// Category Types
// ============================================================================

/**
 * Category definition
 */
export interface Category {
  id: string;
  name: string;
  description: string;
  keywords: string[];
  priority: number;
  directory: string;
}

// ============================================================================
// Registry Types
// ============================================================================

/**
 * Skills registry
 */
export interface SkillRegistry {
  version: string;
  lastUpdated: string;
  skills: Skill[];
  categories: Category[];
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Routing level
 */
export type RoutingLevel = 'core' | 'full' | 'auto';

/**
 * Default scope for operations
 */
export type DefaultScope = 'global' | 'local';

/**
 * User preferences
 */
export interface UserPreferences {
  defaultScope: DefaultScope;
  verboseOutput: boolean;
  colorOutput: boolean;
}

/**
 * Global configuration
 */
export interface GlobalConfig {
  version: string;
  skillsPath: string;
  rulesPath: string;
  preferences: UserPreferences;
  lastSync?: string;
}

/**
 * Project-level configuration
 */
export interface ProjectConfig {
  version: string;
  autoRouting: boolean;
  routingLevel: RoutingLevel;
  excludedSkills: string[];
  customSkills: string[];
  preferences: Partial<UserPreferences>;
}

// ============================================================================
// Routing Types
// ============================================================================

/**
 * User intent classification
 */
export type UserIntent = 
  | 'BUILD'
  | 'FIX'
  | 'TEST'
  | 'DESIGN'
  | 'ANALYZE'
  | 'DOCUMENT'
  | 'OPTIMIZE';

/**
 * Task complexity level
 */
export type Complexity = 'SIMPLE' | 'MEDIUM' | 'COMPLEX';

/**
 * Skill loading level
 */
export type LoadLevel = 'L1' | 'L2' | 'L3';

/**
 * Routing decision result
 */
export interface RoutingDecision {
  intent: UserIntent;
  domain: SkillDomain;
  complexity: Complexity;
  selectedSkill: string;
  level: LoadLevel;
  reason: string;
}

// ============================================================================
// CLI Types
// ============================================================================

/**
 * Command options for add
 */
export interface AddOptions {
  global: boolean;
  local: boolean;
  category?: string;
  force: boolean;
}

/**
 * Command options for remove
 */
export interface RemoveOptions {
  global: boolean;
  local: boolean;
  force: boolean;
}

/**
 * Command options for init
 */
export interface InitOptions {
  force: boolean;
  noRouting: boolean;
}

/**
 * Command options for list
 */
export interface ListOptions {
  category?: string;
  source?: SkillSource;
  core: boolean;
  json: boolean;
}

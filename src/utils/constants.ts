/**
 * SkillMana Constants
 */

import { homedir } from 'node:os';
import { join } from 'node:path';

// ============================================================================
// Paths
// ============================================================================

/**
 * User home directory
 */
export const HOME_DIR = homedir();

/**
 * Global SkillMana directory
 */
export const SKILLMANA_DIR = join(HOME_DIR, '.skillmana');

/**
 * Global skills directory
 */
export const GLOBAL_SKILLS_DIR = join(SKILLMANA_DIR, 'skills');

/**
 * Global rules directory
 */
export const GLOBAL_RULES_DIR = join(SKILLMANA_DIR, 'rules');

/**
 * Global config directory
 */
export const CONFIG_DIR = join(SKILLMANA_DIR, 'config');

/**
 * Registry directory
 */
export const REGISTRY_DIR = join(SKILLMANA_DIR, 'registry');

/**
 * Cache directory
 */
export const CACHE_DIR = join(SKILLMANA_DIR, 'cache');

/**
 * Project cursor directory name
 */
export const CURSOR_DIR_NAME = '.cursor';

/**
 * Project config filename
 */
export const PROJECT_CONFIG_FILE = 'skillmana.json';

/**
 * Global config filename
 */
export const GLOBAL_CONFIG_FILE = 'settings.json';

/**
 * Registry filename
 */
export const REGISTRY_FILE = 'index.json';

// ============================================================================
// Skill Categories
// ============================================================================

/**
 * Default skill categories
 */
export const DEFAULT_CATEGORIES = [
  {
    id: 'core',
    name: 'Core Skills',
    description: 'Compressed, token-efficient versions combining multiple related skills',
    keywords: ['core', 'essential', 'basic'],
    priority: 1,
    directory: 'core',
  },
  {
    id: 'anthropic',
    name: 'Anthropic Official',
    description: 'Official skills from Anthropic',
    keywords: ['official', 'anthropic'],
    priority: 2,
    directory: 'anthropic',
  },
  {
    id: 'product-management',
    name: 'Product Management',
    description: 'PRD, requirements, user stories, prioritization',
    keywords: ['product', 'prd', 'requirement', 'user story', 'feature'],
    priority: 3,
    directory: 'product-management',
  },
  {
    id: 'ux-design',
    name: 'UX Design',
    description: 'UI/UX design, wireframes, accessibility',
    keywords: ['ux', 'ui', 'design', 'wireframe', 'accessibility'],
    priority: 4,
    directory: 'ux-design',
  },
  {
    id: 'testing-qa',
    name: 'Testing & QA',
    description: 'Test automation, QA, E2E, TDD',
    keywords: ['test', 'qa', 'e2e', 'tdd', 'coverage'],
    priority: 5,
    directory: 'testing-qa',
  },
  {
    id: 'stripe-payment',
    name: 'Stripe & Payment',
    description: 'Payment integration, Stripe API, billing',
    keywords: ['stripe', 'payment', 'checkout', 'billing', 'subscription'],
    priority: 6,
    directory: 'stripe-payment',
  },
  {
    id: 'business-model',
    name: 'Business Model',
    description: 'DDD, architecture, business analysis',
    keywords: ['business', 'ddd', 'architecture', 'analysis'],
    priority: 7,
    directory: 'business-model',
  },
  {
    id: 'mobile',
    name: 'Mobile & Native',
    description: 'iOS, macOS, Swift, native app development',
    keywords: ['mobile', 'ios', 'macos', 'swift', 'native'],
    priority: 8,
    directory: 'mobile',
  },
  {
    id: 'optimization',
    name: 'Optimization',
    description: 'Token optimization, context compression',
    keywords: ['optimize', 'token', 'compress', 'efficiency'],
    priority: 9,
    directory: 'optimization',
  },
  {
    id: 'custom',
    name: 'Custom Skills',
    description: 'User-defined custom skills',
    keywords: ['custom', 'user'],
    priority: 100,
    directory: 'custom',
  },
] as const;

// ============================================================================
// Anthropic Skills
// ============================================================================

/**
 * Anthropic skills GitHub repository
 */
export const ANTHROPIC_SKILLS_REPO = 'https://github.com/anthropics/skills';

/**
 * Anthropic skills raw content URL
 */
export const ANTHROPIC_SKILLS_RAW_URL = 'https://raw.githubusercontent.com/anthropics/skills/main';

/**
 * List of official Anthropic skills
 */
export const ANTHROPIC_SKILLS = [
  'algorithmic-art',
  'brand-guidelines',
  'canvas-design',
  'doc-coauthoring',
  'docx',
  'frontend-design',
  'internal-comms',
  'mcp-builder',
  'pdf',
  'pptx',
  'skill-creator',
  'slack-gif-creator',
  'theme-factory',
  'web-artifacts-builder',
  'webapp-testing',
  'xlsx',
] as const;

// ============================================================================
// CLI
// ============================================================================

/**
 * CLI name
 */
export const CLI_NAME = 'skillmana';

/**
 * CLI version (should match package.json)
 */
export const CLI_VERSION = '1.0.2';

/**
 * CLI description
 */
export const CLI_DESCRIPTION = 'A local CLI tool for managing Cursor Skills';

// ============================================================================
// Defaults
// ============================================================================

/**
 * Default global config
 */
export const DEFAULT_GLOBAL_CONFIG = {
  version: '1.0.0',
  skillsPath: GLOBAL_SKILLS_DIR,
  rulesPath: GLOBAL_RULES_DIR,
  preferences: {
    defaultScope: 'global' as const,
    verboseOutput: false,
    colorOutput: true,
  },
};

/**
 * Default project config
 */
export const DEFAULT_PROJECT_CONFIG = {
  version: '1.0.0',
  autoRouting: true,
  routingLevel: 'auto' as const,
  excludedSkills: [],
  customSkills: [],
  preferences: {},
};

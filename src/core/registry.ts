/**
 * Registry Manager
 * 
 * Handles skills registry operations for SkillMana.
 */

import fs from 'fs-extra';
import { join } from 'node:path';
import {
  REGISTRY_DIR,
  REGISTRY_FILE,
  DEFAULT_CATEGORIES,
} from '../utils/constants.js';
import type { Skill, SkillRegistry, Category } from '../types/index.js';
import { logger } from '../utils/logger.js';

// ============================================================================
// Types
// ============================================================================

export interface SkillFilter {
  category?: string;
  source?: 'anthropic' | 'community' | 'custom';
  domain?: string;
  isCore?: boolean;
}

export interface RegistryManager {
  // Registry operations
  getRegistry(): Promise<SkillRegistry>;
  saveRegistry(registry: SkillRegistry): Promise<void>;
  initializeRegistry(): Promise<void>;
  
  // Skill operations
  addSkill(skill: Skill): Promise<void>;
  removeSkill(skillId: string): Promise<boolean>;
  updateSkill(skillId: string, updates: Partial<Skill>): Promise<boolean>;
  getSkill(skillId: string): Promise<Skill | null>;
  
  // Query operations
  listSkills(filter?: SkillFilter): Promise<Skill[]>;
  searchSkills(query: string): Promise<Skill[]>;
  getSkillsByCategory(categoryId: string): Promise<Skill[]>;
  
  // Category operations
  getCategories(): Promise<Category[]>;
}

// ============================================================================
// Implementation
// ============================================================================

class RegistryManagerImpl implements RegistryManager {
  private registryPath: string;
  private cache: SkillRegistry | null = null;

  constructor() {
    this.registryPath = join(REGISTRY_DIR, REGISTRY_FILE);
  }

  /**
   * Create empty registry
   */
  private createEmptyRegistry(): SkillRegistry {
    return {
      version: '1.0.0',
      lastUpdated: new Date().toISOString(),
      skills: [],
      categories: [...DEFAULT_CATEGORIES],
    };
  }

  /**
   * Get registry from file or cache
   */
  async getRegistry(): Promise<SkillRegistry> {
    if (this.cache) {
      return this.cache;
    }

    try {
      if (await fs.pathExists(this.registryPath)) {
        const content = await fs.readFile(this.registryPath, 'utf-8');
        this.cache = JSON.parse(content);
        return this.cache!;
      }
    } catch (error) {
      logger.debug(`Error reading registry: ${error}`);
    }

    // Initialize if not exists
    await this.initializeRegistry();
    return this.cache!;
  }

  /**
   * Save registry to file
   */
  async saveRegistry(registry: SkillRegistry): Promise<void> {
    try {
      await fs.ensureDir(REGISTRY_DIR);
      
      registry.lastUpdated = new Date().toISOString();
      
      await fs.writeFile(
        this.registryPath,
        JSON.stringify(registry, null, 2),
        'utf-8'
      );
      
      this.cache = registry;
      logger.debug('Registry saved');
    } catch (error) {
      logger.error(`Error saving registry: ${error}`);
      throw error;
    }
  }

  /**
   * Initialize empty registry
   */
  async initializeRegistry(): Promise<void> {
    const registry = this.createEmptyRegistry();
    await this.saveRegistry(registry);
    logger.debug('Registry initialized');
  }

  /**
   * Add a skill to registry
   */
  async addSkill(skill: Skill): Promise<void> {
    const registry = await this.getRegistry();
    
    // Check if skill already exists
    const existingIndex = registry.skills.findIndex((s) => s.id === skill.id);
    if (existingIndex >= 0) {
      // Update existing
      registry.skills[existingIndex] = skill;
      logger.debug(`Updated existing skill: ${skill.id}`);
    } else {
      // Add new
      registry.skills.push(skill);
      logger.debug(`Added new skill: ${skill.id}`);
    }
    
    await this.saveRegistry(registry);
  }

  /**
   * Remove a skill from registry
   */
  async removeSkill(skillId: string): Promise<boolean> {
    const registry = await this.getRegistry();
    
    const initialLength = registry.skills.length;
    registry.skills = registry.skills.filter((s) => s.id !== skillId);
    
    if (registry.skills.length < initialLength) {
      await this.saveRegistry(registry);
      logger.debug(`Removed skill: ${skillId}`);
      return true;
    }
    
    return false;
  }

  /**
   * Update a skill in registry
   */
  async updateSkill(skillId: string, updates: Partial<Skill>): Promise<boolean> {
    const registry = await this.getRegistry();
    
    const skillIndex = registry.skills.findIndex((s) => s.id === skillId);
    if (skillIndex < 0) {
      return false;
    }
    
    registry.skills[skillIndex] = {
      ...registry.skills[skillIndex],
      ...updates,
      id: skillId, // Ensure ID is not changed
    };
    
    await this.saveRegistry(registry);
    logger.debug(`Updated skill: ${skillId}`);
    return true;
  }

  /**
   * Get a skill by ID
   */
  async getSkill(skillId: string): Promise<Skill | null> {
    const registry = await this.getRegistry();
    return registry.skills.find((s) => s.id === skillId) || null;
  }

  /**
   * List skills with optional filter
   */
  async listSkills(filter?: SkillFilter): Promise<Skill[]> {
    const registry = await this.getRegistry();
    let skills = [...registry.skills];
    
    if (filter) {
      if (filter.category) {
        skills = skills.filter((s) => s.category === filter.category);
      }
      if (filter.source) {
        skills = skills.filter((s) => s.source === filter.source);
      }
      if (filter.domain) {
        skills = skills.filter((s) => s.domain === filter.domain);
      }
      if (filter.isCore !== undefined) {
        skills = skills.filter((s) => s.isCore === filter.isCore);
      }
    }
    
    return skills;
  }

  /**
   * Search skills by query
   */
  async searchSkills(query: string): Promise<Skill[]> {
    const registry = await this.getRegistry();
    const lowerQuery = query.toLowerCase();
    
    return registry.skills.filter((skill) => {
      return (
        skill.name.toLowerCase().includes(lowerQuery) ||
        skill.description.toLowerCase().includes(lowerQuery) ||
        skill.triggers.some((t) => t.toLowerCase().includes(lowerQuery)) ||
        skill.category.toLowerCase().includes(lowerQuery) ||
        skill.domain.toLowerCase().includes(lowerQuery)
      );
    });
  }

  /**
   * Get skills by category
   */
  async getSkillsByCategory(categoryId: string): Promise<Skill[]> {
    return this.listSkills({ category: categoryId });
  }

  /**
   * Get all categories
   */
  async getCategories(): Promise<Category[]> {
    const registry = await this.getRegistry();
    return registry.categories;
  }
}

// ============================================================================
// Export
// ============================================================================

/**
 * Default registry manager instance
 */
export const registry = new RegistryManagerImpl();

/**
 * Create a new registry manager instance
 */
export function createRegistryManager(): RegistryManager {
  return new RegistryManagerImpl();
}

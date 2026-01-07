import { describe, it, expect } from 'vitest';
import type {
  Skill,
  Category,
  SkillRegistry,
  GlobalConfig,
  ProjectConfig,
  RoutingDecision,
} from '../src/types/index.js';

describe('Type Definitions', () => {
  describe('Skill', () => {
    it('should allow creating a valid skill object', () => {
      const skill: Skill = {
        id: 'test-skill',
        name: 'Test Skill',
        description: 'A test skill for validation',
        category: 'custom',
        path: '/path/to/skill',
        isCore: false,
        triggers: ['test', 'validate'],
        domain: 'testing',
        source: 'custom',
        metadata: {
          version: '1.0.0',
          author: 'Test Author',
        },
      };

      expect(skill.id).toBe('test-skill');
      expect(skill.isCore).toBe(false);
      expect(skill.domain).toBe('testing');
    });
  });

  describe('Category', () => {
    it('should allow creating a valid category object', () => {
      const category: Category = {
        id: 'test-category',
        name: 'Test Category',
        description: 'A test category',
        keywords: ['test', 'category'],
        priority: 10,
        directory: 'test-category',
      };

      expect(category.id).toBe('test-category');
      expect(category.priority).toBe(10);
    });
  });

  describe('SkillRegistry', () => {
    it('should allow creating a valid registry object', () => {
      const registry: SkillRegistry = {
        version: '1.0.0',
        lastUpdated: '2026-01-07',
        skills: [],
        categories: [],
      };

      expect(registry.version).toBe('1.0.0');
      expect(registry.skills).toEqual([]);
    });
  });

  describe('GlobalConfig', () => {
    it('should allow creating a valid global config', () => {
      const config: GlobalConfig = {
        version: '1.0.0',
        skillsPath: '/path/to/skills',
        rulesPath: '/path/to/rules',
        preferences: {
          defaultScope: 'global',
          verboseOutput: false,
          colorOutput: true,
        },
      };

      expect(config.preferences.defaultScope).toBe('global');
    });
  });

  describe('ProjectConfig', () => {
    it('should allow creating a valid project config', () => {
      const config: ProjectConfig = {
        version: '1.0.0',
        autoRouting: true,
        routingLevel: 'auto',
        excludedSkills: ['skill-to-exclude'],
        customSkills: ['custom-skill'],
        preferences: {},
      };

      expect(config.autoRouting).toBe(true);
      expect(config.excludedSkills).toContain('skill-to-exclude');
    });
  });

  describe('RoutingDecision', () => {
    it('should allow creating a valid routing decision', () => {
      const decision: RoutingDecision = {
        intent: 'BUILD',
        domain: 'frontend',
        complexity: 'MEDIUM',
        selectedSkill: 'frontend-core',
        level: 'L2',
        reason: 'User requested UI component',
      };

      expect(decision.intent).toBe('BUILD');
      expect(decision.level).toBe('L2');
    });
  });
});

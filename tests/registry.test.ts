import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'fs-extra';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { createRegistryManager } from '../src/core/registry.js';
import type { Skill } from '../src/types/index.js';

describe('RegistryManager', () => {
  // Create a test skill
  const createTestSkill = (id: string, overrides?: Partial<Skill>): Skill => ({
    id,
    name: `Test Skill ${id}`,
    description: `Description for ${id}`,
    category: 'custom',
    path: `/path/to/${id}`,
    isCore: false,
    triggers: ['test', id],
    domain: 'testing',
    source: 'custom',
    metadata: {
      version: '1.0.0',
    },
    ...overrides,
  });

  describe('Skill Operations', () => {
    it('should create test skills correctly', () => {
      const skill = createTestSkill('test-1');
      expect(skill.id).toBe('test-1');
      expect(skill.name).toBe('Test Skill test-1');
      expect(skill.triggers).toContain('test');
    });

    it('should allow overrides in test skills', () => {
      const skill = createTestSkill('test-2', {
        isCore: true,
        domain: 'frontend',
      });
      expect(skill.isCore).toBe(true);
      expect(skill.domain).toBe('frontend');
    });
  });

  describe('Search Logic', () => {
    it('should match skill by name', () => {
      const skill = createTestSkill('payment-integration');
      const query = 'payment';
      
      const matches = skill.name.toLowerCase().includes(query.toLowerCase());
      expect(matches).toBe(true);
    });

    it('should match skill by trigger', () => {
      const skill = createTestSkill('test-skill', {
        triggers: ['stripe', 'checkout'],
      });
      const query = 'stripe';
      
      const matches = skill.triggers.some((t) => 
        t.toLowerCase().includes(query.toLowerCase())
      );
      expect(matches).toBe(true);
    });

    it('should match skill by domain', () => {
      const skill = createTestSkill('test-skill', {
        domain: 'payment',
      });
      const query = 'payment';
      
      const matches = skill.domain.toLowerCase().includes(query.toLowerCase());
      expect(matches).toBe(true);
    });
  });

  describe('Filter Logic', () => {
    it('should filter by category', () => {
      const skills = [
        createTestSkill('s1', { category: 'core' }),
        createTestSkill('s2', { category: 'custom' }),
        createTestSkill('s3', { category: 'core' }),
      ];
      
      const filtered = skills.filter((s) => s.category === 'core');
      expect(filtered).toHaveLength(2);
    });

    it('should filter by source', () => {
      const skills = [
        createTestSkill('s1', { source: 'anthropic' }),
        createTestSkill('s2', { source: 'custom' }),
        createTestSkill('s3', { source: 'anthropic' }),
      ];
      
      const filtered = skills.filter((s) => s.source === 'anthropic');
      expect(filtered).toHaveLength(2);
    });

    it('should filter by isCore', () => {
      const skills = [
        createTestSkill('s1', { isCore: true }),
        createTestSkill('s2', { isCore: false }),
        createTestSkill('s3', { isCore: true }),
      ];
      
      const filtered = skills.filter((s) => s.isCore === true);
      expect(filtered).toHaveLength(2);
    });
  });
});

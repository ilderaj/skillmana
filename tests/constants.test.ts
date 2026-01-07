import { describe, it, expect } from 'vitest';
import {
  CLI_NAME,
  CLI_VERSION,
  SKILLMANA_DIR,
  GLOBAL_SKILLS_DIR,
  DEFAULT_CATEGORIES,
  ANTHROPIC_SKILLS,
} from '../src/utils/constants.js';

describe('Constants', () => {
  describe('CLI Constants', () => {
    it('should have correct CLI name', () => {
      expect(CLI_NAME).toBe('skillmana');
    });

    it('should have correct CLI version', () => {
      expect(CLI_VERSION).toBe('1.0.4');
    });
  });

  describe('Path Constants', () => {
    it('should have SKILLMANA_DIR in home directory', () => {
      expect(SKILLMANA_DIR).toContain('.skillmana');
    });

    it('should have GLOBAL_SKILLS_DIR under SKILLMANA_DIR', () => {
      expect(GLOBAL_SKILLS_DIR).toContain('.skillmana');
      expect(GLOBAL_SKILLS_DIR).toContain('skills');
    });
  });

  describe('Categories', () => {
    it('should have default categories defined', () => {
      expect(DEFAULT_CATEGORIES).toBeDefined();
      expect(DEFAULT_CATEGORIES.length).toBeGreaterThan(0);
    });

    it('should have core category', () => {
      const coreCategory = DEFAULT_CATEGORIES.find((c) => c.id === 'core');
      expect(coreCategory).toBeDefined();
      expect(coreCategory?.priority).toBe(1);
    });

    it('should have anthropic category', () => {
      const anthropicCategory = DEFAULT_CATEGORIES.find((c) => c.id === 'anthropic');
      expect(anthropicCategory).toBeDefined();
    });
  });

  describe('Anthropic Skills', () => {
    it('should have anthropic skills defined', () => {
      expect(ANTHROPIC_SKILLS).toBeDefined();
      expect(ANTHROPIC_SKILLS.length).toBeGreaterThan(0);
    });

    it('should include known skills', () => {
      expect(ANTHROPIC_SKILLS).toContain('frontend-design');
      expect(ANTHROPIC_SKILLS).toContain('mcp-builder');
      expect(ANTHROPIC_SKILLS).toContain('docx');
    });
  });
});

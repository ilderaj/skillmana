# Spec: E3-S3 Core Skills 归并

## Overview

**Story ID**: E3-S3  
**Spec Version**: 1.0  
**Created**: 2026-01-07

## Objective

实现 Core Skills 归并逻辑，将多个相关 Skills 压缩合并为 token 高效的核心版本。

---

## Technical Specification

### 1. Merger Interface

```typescript
interface CoreMerger {
  // 合并多个 skills 为 core skill
  merge(skills: Skill[], options?: MergeOptions): Promise<CoreSkill>;
  
  // 检查是否可以合并
  canMerge(skills: Skill[]): boolean;
  
  // 获取合并建议
  suggestMerges(skills: Skill[]): Promise<MergeSuggestion[]>;
  
  // 生成 core skill 文件
  generateCoreFile(coreSkill: CoreSkill): Promise<string>;
}
```

### 2. Types

```typescript
interface MergeOptions {
  name: string;
  description?: string;
  maxTokens?: number;
  preserveSections?: string[];
}

interface CoreSkill extends Skill {
  sourceSkills: string[];      // 源 skill IDs
  compressionRatio: number;    // 压缩率
  tokenCount: number;          // Token 数量估算
  sections: CoreSection[];
}

interface CoreSection {
  title: string;
  content: string;
  sourceSkill: string;
  importance: 'critical' | 'important' | 'optional';
}

interface MergeSuggestion {
  suggestedName: string;
  skills: string[];
  estimatedCompression: number;
  reason: string;
}
```

### 3. Merge Strategy

归并策略分为三个阶段：

#### Phase 1: 内容分析
- 解析每个 skill 的 markdown 结构
- 识别标题层级和关键章节
- 标记重复/相似内容

#### Phase 2: 内容选择
- 保留 critical 级别内容（原则、核心概念）
- 合并 important 级别内容（最佳实践）
- 压缩 optional 级别内容（示例、细节）

#### Phase 3: 内容生成
- 生成统一的 frontmatter
- 整合并去重内容
- 添加索引和导航

### 4. Section Importance Rules

```typescript
const SECTION_IMPORTANCE: Record<string, 'critical' | 'important' | 'optional'> = {
  // Critical - Always include
  'principles': 'critical',
  'philosophy': 'critical',
  'core concepts': 'critical',
  'key rules': 'critical',
  
  // Important - Include if space allows
  'best practices': 'important',
  'guidelines': 'important',
  'patterns': 'important',
  'workflow': 'important',
  
  // Optional - Compress or omit
  'examples': 'optional',
  'detailed steps': 'optional',
  'troubleshooting': 'optional',
  'references': 'optional',
};
```

### 5. Token Estimation

简单 token 估算：

```typescript
function estimateTokens(content: string): number {
  // 粗略估算：每4个字符约1个token
  return Math.ceil(content.length / 4);
}
```

### 6. Core Skill Template

```markdown
---
name: {domain}-core
description: Core principles for {domain} development
domain: {domain}
sourceSkills:
  - skill-1
  - skill-2
tokens: ~2000
---

# {Domain} Core

> Combined essential principles from: skill-1, skill-2

## Quick Reference

[Quick access to key concepts]

## Core Principles

[Most critical principles from all source skills]

## Key Patterns

[Essential patterns and workflows]

## Common Triggers

[When to apply these principles]

---
*Expanded skills: skill-1, skill-2*
```

---

## Implementation

### File: `src/core/merger.ts`

Core merger implementation.

### Command Integration

暂不添加独立命令，merger 由 route 命令和内部流程调用。

---

## Acceptance Criteria

### AC1: Merge Operation
- [ ] 能够合并多个 skills
- [ ] 生成格式正确的 core skill
- [ ] 压缩率 > 50%

### AC2: Content Preservation
- [ ] 保留所有 critical 内容
- [ ] 合并重复内容
- [ ] 保持可读性

### AC3: Token Optimization
- [ ] Token 估算准确
- [ ] 支持 maxTokens 限制

### AC4: Merge Suggestions
- [ ] 能够建议合并候选
- [ ] 按相关度排序

---

## Test Cases

### TC1: Basic Merge
```typescript
it('should merge two related skills', async () => {
  const skills = [
    createTestSkill({ name: 'react-hooks', domain: 'frontend' }),
    createTestSkill({ name: 'react-state', domain: 'frontend' }),
  ];
  
  const coreSkill = await merger.merge(skills, { name: 'react-core' });
  
  expect(coreSkill.name).toBe('react-core');
  expect(coreSkill.sourceSkills).toContain('react-hooks');
  expect(coreSkill.sourceSkills).toContain('react-state');
});
```

### TC2: Compression Ratio
```typescript
it('should achieve compression ratio > 50%', async () => {
  const skills = await loadTestSkills(['skill1', 'skill2', 'skill3']);
  const coreSkill = await merger.merge(skills, { name: 'test-core' });
  
  expect(coreSkill.compressionRatio).toBeGreaterThan(0.5);
});
```

### TC3: Merge Suggestions
```typescript
it('should suggest merge candidates', async () => {
  const allSkills = await registry.listSkills();
  const suggestions = await merger.suggestMerges(allSkills);
  
  expect(suggestions.length).toBeGreaterThan(0);
  suggestions.forEach(s => {
    expect(s.skills.length).toBeGreaterThanOrEqual(2);
  });
});
```

# Spec: E3-S1 分类器实现

## Overview

**Story ID**: E3-S1  
**Spec Version**: 1.0  
**Created**: 2026-01-07

## Objective

实现 Skills 自动分类器，根据文件内容、元数据和路径信息自动分类 Skills。

---

## Technical Specification

### 1. Classifier Interface

```typescript
interface Classifier {
  // 分类单个 Skill
  classifySkill(skill: Skill): Promise<ClassificationResult>;
  
  // 批量分类
  classifyBatch(skills: Skill[]): Promise<ClassificationResult[]>;
  
  // 重新分类所有 Skills
  reclassifyAll(): Promise<void>;
  
  // 获取分类建议
  suggestCategory(content: string, metadata?: SkillFrontmatter): Promise<CategorySuggestion[]>;
}
```

### 2. Classification Result

```typescript
interface ClassificationResult {
  skillId: string;
  originalCategory: string;
  suggestedCategory: string;
  confidence: number; // 0-1
  reasoning: string[];
  domain: SkillDomain;
  keywords: string[];
}

interface CategorySuggestion {
  categoryId: string;
  confidence: number;
  matchedKeywords: string[];
}
```

### 3. Classification Algorithm

分类器使用多因素加权评分：

1. **关键词匹配 (40%)**
   - 分析文件名、frontmatter、内容
   - 匹配 DEFAULT_CATEGORIES 中的 keywords

2. **路径分析 (30%)**
   - 分析文件路径中的目录名
   - 识别 anthropic、custom 等特殊目录

3. **内容语义分析 (20%)**
   - 分析 markdown 标题和描述
   - 识别技术术语和领域词汇

4. **元数据信号 (10%)**
   - frontmatter 中的 domain、triggers
   - 文件名模式匹配

### 4. Domain Mapping

```typescript
const DOMAIN_KEYWORDS: Record<SkillDomain, string[]> = {
  product: ['prd', 'product', 'requirement', 'user story', 'feature', 'roadmap', 'sprint'],
  frontend: ['ui', 'ux', 'react', 'vue', 'css', 'html', 'component', 'frontend', 'design'],
  testing: ['test', 'qa', 'e2e', 'tdd', 'coverage', 'jest', 'vitest', 'playwright'],
  payment: ['stripe', 'payment', 'checkout', 'billing', 'subscription', 'invoice'],
  business: ['ddd', 'domain', 'architecture', 'business', 'model', 'entity'],
  mobile: ['ios', 'macos', 'swift', 'mobile', 'app', 'native', 'android'],
  optimization: ['optimize', 'token', 'compress', 'efficiency', 'performance'],
  document: ['doc', 'pdf', 'xlsx', 'pptx', 'docx', 'word', 'excel'],
  creative: ['design', 'art', 'canvas', 'creative', 'visual', 'brand'],
  tools: ['mcp', 'tool', 'cli', 'utility', 'helper', 'generator'],
  other: [],
};
```

---

## Implementation

### File: `src/core/classifier.ts`

```typescript
/**
 * Skill Classifier
 * 
 * Automatically classifies skills based on content and metadata.
 */

export interface Classifier {
  classifySkill(skill: Skill): Promise<ClassificationResult>;
  classifyBatch(skills: Skill[]): Promise<ClassificationResult[]>;
  suggestCategory(content: string, metadata?: SkillFrontmatter): Promise<CategorySuggestion[]>;
}

export interface ClassificationResult {
  skillId: string;
  originalCategory: string;
  suggestedCategory: string;
  confidence: number;
  reasoning: string[];
  domain: SkillDomain;
  keywords: string[];
}

export interface CategorySuggestion {
  categoryId: string;
  confidence: number;
  matchedKeywords: string[];
}
```

---

## Acceptance Criteria

### AC1: Single Skill Classification
- [ ] 能够对单个 Skill 进行分类
- [ ] 返回置信度分数
- [ ] 提供分类推理说明

### AC2: Batch Classification
- [ ] 支持批量分类操作
- [ ] 性能良好（100 skills < 2s）

### AC3: Category Suggestion
- [ ] 为新内容提供类别建议
- [ ] 返回多个候选类别

### AC4: Domain Detection
- [ ] 正确识别技术领域
- [ ] 提取相关关键词

---

## Test Cases

### TC1: Classify Frontend Skill
```typescript
it('should classify React skill as frontend', async () => {
  const skill = createTestSkill({ 
    name: 'react-components',
    description: 'Best practices for building React UI components'
  });
  const result = await classifier.classifySkill(skill);
  expect(result.suggestedCategory).toBe('ux-design');
  expect(result.domain).toBe('frontend');
  expect(result.confidence).toBeGreaterThan(0.7);
});
```

### TC2: Classify Payment Skill
```typescript
it('should classify Stripe skill as payment', async () => {
  const skill = createTestSkill({ 
    name: 'stripe-checkout',
    description: 'Implementing Stripe Checkout for subscription billing'
  });
  const result = await classifier.classifySkill(skill);
  expect(result.suggestedCategory).toBe('stripe-payment');
  expect(result.domain).toBe('payment');
});
```

### TC3: Batch Classification
```typescript
it('should classify multiple skills efficiently', async () => {
  const skills = createTestSkills(50);
  const startTime = Date.now();
  const results = await classifier.classifyBatch(skills);
  const duration = Date.now() - startTime;
  
  expect(results.length).toBe(50);
  expect(duration).toBeLessThan(1000);
});
```

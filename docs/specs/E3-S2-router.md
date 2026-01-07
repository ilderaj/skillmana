# Spec: E3-S2 路由引擎实现

## Overview

**Story ID**: E3-S2  
**Spec Version**: 1.0  
**Created**: 2026-01-07

## Objective

实现智能路由引擎，根据用户意图和上下文自动选择合适的 Skills。

---

## Technical Specification

### 1. Router Interface

```typescript
interface Router {
  // 路由决策
  route(input: RouterInput): Promise<RoutingDecision>;
  
  // 获取推荐 Skills
  getRecommendations(context: RouterContext): Promise<SkillRecommendation[]>;
  
  // 设置路由级别
  setLevel(level: RoutingLevel): void;
  
  // 获取当前配置
  getConfig(): RouterConfig;
}
```

### 2. Router Types

```typescript
interface RouterInput {
  query: string;           // 用户查询/意图
  context?: {
    currentFile?: string;  // 当前文件
    projectType?: string;  // 项目类型
    recentSkills?: string[]; // 最近使用的 skills
  };
  preferences?: {
    preferCore?: boolean;  // 优先使用 core skills
    excludeSkills?: string[]; // 排除的 skills
  };
}

interface RoutingDecision {
  intent: UserIntent;
  domain: SkillDomain;
  complexity: Complexity;
  selectedSkills: SelectedSkill[];
  level: LoadLevel;
  reason: string;
}

interface SelectedSkill {
  skillId: string;
  relevance: number;
  loadOrder: number;
}

interface SkillRecommendation {
  skill: Skill;
  relevance: number;
  reason: string;
}

interface RouterConfig {
  level: RoutingLevel;
  maxSkills: number;
  preferCore: boolean;
}
```

### 3. Intent Detection

用户意图分类：

```typescript
type UserIntent = 
  | 'BUILD'      // 创建新功能
  | 'FIX'        // 修复 bug
  | 'TEST'       // 编写测试
  | 'DESIGN'     // UI/UX 设计
  | 'ANALYZE'    // 代码分析
  | 'DOCUMENT'   // 写文档
  | 'OPTIMIZE';  // 性能优化

const INTENT_KEYWORDS: Record<UserIntent, string[]> = {
  BUILD: ['create', 'build', 'implement', 'add', 'new', 'develop', 'make'],
  FIX: ['fix', 'bug', 'error', 'issue', 'debug', 'resolve', 'repair'],
  TEST: ['test', 'spec', 'coverage', 'tdd', 'e2e', 'unit', 'integration'],
  DESIGN: ['design', 'ui', 'ux', 'layout', 'style', 'wireframe', 'mockup'],
  ANALYZE: ['analyze', 'review', 'audit', 'check', 'inspect', 'evaluate'],
  DOCUMENT: ['document', 'doc', 'readme', 'guide', 'tutorial', 'explain'],
  OPTIMIZE: ['optimize', 'improve', 'performance', 'speed', 'efficiency'],
};
```

### 4. Complexity Assessment

```typescript
type Complexity = 'SIMPLE' | 'MEDIUM' | 'COMPLEX';

interface ComplexityFactors {
  queryLength: number;
  technicalTerms: number;
  multipleDomainsInvolved: boolean;
  estimatedScope: 'single-file' | 'multi-file' | 'multi-module';
}
```

### 5. Load Levels

```typescript
type LoadLevel = 'L1' | 'L2' | 'L3';

// L1: Core skills only (lowest token usage)
// L2: Core + relevant domain skills
// L3: Full skills (highest capability)

const LEVEL_SKILL_LIMITS: Record<LoadLevel, number> = {
  L1: 1,   // 只加载最相关的 1 个 core skill
  L2: 3,   // 加载最多 3 个 skills
  L3: 5,   // 加载最多 5 个完整 skills
};
```

### 6. Routing Algorithm

1. **Intent Detection**: 分析 query 确定用户意图
2. **Domain Matching**: 根据意图和上下文确定相关领域
3. **Complexity Assessment**: 评估任务复杂度
4. **Skill Selection**: 
   - L1: 选择最匹配的 core skill
   - L2: core + 2 个领域 skills
   - L3: 最多 5 个相关 skills
5. **Relevance Ranking**: 按相关度排序

---

## Implementation

### File: `src/core/router.ts`

路由引擎核心实现。

### File: `src/commands/route.ts`

route 命令实现，管理路由配置。

---

## Acceptance Criteria

### AC1: Intent Detection
- [ ] 正确识别 7 种用户意图
- [ ] 支持模糊匹配

### AC2: Domain Matching
- [ ] 根据意图匹配相关领域
- [ ] 考虑项目上下文

### AC3: Skill Selection
- [ ] 根据 level 限制选择数量
- [ ] 按相关度排序

### AC4: Route Command
- [ ] 实现 `skillmana route` 命令
- [ ] 支持 --enable/--disable/--level/--status

---

## Test Cases

### TC1: Build Intent Detection
```typescript
it('should detect BUILD intent', async () => {
  const result = await router.route({
    query: 'Create a new user registration form'
  });
  expect(result.intent).toBe('BUILD');
  expect(result.domain).toBe('frontend');
});
```

### TC2: Test Intent with Domain
```typescript
it('should route test query to testing skills', async () => {
  const result = await router.route({
    query: 'Write unit tests for the payment service'
  });
  expect(result.intent).toBe('TEST');
  expect(result.selectedSkills.length).toBeGreaterThan(0);
});
```

### TC3: L1 vs L3 Routing
```typescript
it('should select fewer skills at L1 level', async () => {
  router.setLevel('core');
  const l1Result = await router.route({ query: 'Build a dashboard' });
  
  router.setLevel('full');
  const l3Result = await router.route({ query: 'Build a dashboard' });
  
  expect(l1Result.selectedSkills.length).toBeLessThan(l3Result.selectedSkills.length);
});
```

---

## Route Command Usage

```bash
# 启用自动路由
skillmana route --enable

# 禁用自动路由
skillmana route --disable

# 设置路由级别
skillmana route --level core   # L1: 只用 core skills
skillmana route --level auto   # L2: 自动选择
skillmana route --level full   # L3: 使用完整 skills

# 查看当前状态
skillmana route --status
```

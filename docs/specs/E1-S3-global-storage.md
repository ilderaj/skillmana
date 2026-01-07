# Spec: E1-S3 全局存储结构实现

## Overview

**Story ID**: E1-S3  
**Spec Version**: 1.0  
**Created**: 2026-01-07

## Objective

实现全局存储目录结构 (`~/.skillmana/`)，包括配置管理、注册表管理和目录初始化。

---

## Technical Specification

### 1. Directory Structure

```
~/.skillmana/
├── skills/                      # Skills 仓库
│   ├── core/                    # 核心 Skills
│   ├── anthropic/               # 官方 Skills
│   ├── product-management/      # 产品管理
│   ├── ux-design/               # UX 设计
│   ├── testing-qa/              # 测试 QA
│   ├── stripe-payment/          # 支付
│   ├── business-model/          # 商业模式
│   ├── mobile/                  # 移动开发
│   ├── optimization/            # 优化
│   └── custom/                  # 自定义
├── rules/                       # 路由规则
│   ├── skill-router.md
│   ├── workflow-chains.md
│   └── skill-constitution.md
├── config/                      # 配置
│   └── settings.json            # 全局设置
├── registry/                    # 注册表
│   └── index.json               # Skills 索引
└── cache/                       # 缓存
    └── anthropic/               # 官方 Skills 缓存
```

### 2. Storage Manager API

```typescript
interface StorageManager {
  // Initialization
  initialize(): Promise<void>;
  isInitialized(): Promise<boolean>;
  
  // Directory operations
  ensureDirectories(): Promise<void>;
  getSkillsDir(): string;
  getRulesDir(): string;
  getConfigDir(): string;
  getRegistryDir(): string;
  getCacheDir(): string;
  
  // Category directories
  getCategoryDir(categoryId: string): string;
  ensureCategoryDir(categoryId: string): Promise<void>;
}
```

### 3. Config Manager API

```typescript
interface ConfigManager {
  // Global config
  getGlobalConfig(): Promise<GlobalConfig>;
  setGlobalConfig(config: Partial<GlobalConfig>): Promise<void>;
  resetGlobalConfig(): Promise<void>;
  
  // Project config
  getProjectConfig(projectPath: string): Promise<ProjectConfig | null>;
  setProjectConfig(projectPath: string, config: Partial<ProjectConfig>): Promise<void>;
  hasProjectConfig(projectPath: string): Promise<boolean>;
}
```

### 4. Registry Manager API

```typescript
interface RegistryManager {
  // Registry operations
  getRegistry(): Promise<SkillRegistry>;
  saveRegistry(registry: SkillRegistry): Promise<void>;
  
  // Skill operations
  addSkill(skill: Skill): Promise<void>;
  removeSkill(skillId: string): Promise<void>;
  updateSkill(skillId: string, updates: Partial<Skill>): Promise<void>;
  getSkill(skillId: string): Promise<Skill | null>;
  
  // Query operations
  listSkills(filter?: SkillFilter): Promise<Skill[]>;
  searchSkills(query: string): Promise<Skill[]>;
  getSkillsByCategory(categoryId: string): Promise<Skill[]>;
}
```

---

## Implementation

### File: `src/core/storage.ts`

Storage manager implementation for directory operations.

### File: `src/core/config.ts`

Configuration manager for global and project settings.

### File: `src/core/registry.ts`

Registry manager for skills index operations.

---

## Acceptance Criteria

### AC1: Directory Initialization
- [ ] All directories created on first run
- [ ] Correct permissions (0755 for directories)
- [ ] No errors on subsequent runs

### AC2: Config Management
- [ ] Global config created with defaults
- [ ] Config updates persist
- [ ] Invalid config handled gracefully

### AC3: Registry Management
- [ ] Empty registry created on init
- [ ] Skills can be added/removed
- [ ] Search works correctly

---

## Test Cases

### TC1: Storage Initialization
```typescript
it('should create all directories on init', async () => {
  await storage.initialize();
  expect(await fs.pathExists(SKILLMANA_DIR)).toBe(true);
  expect(await fs.pathExists(GLOBAL_SKILLS_DIR)).toBe(true);
});
```

### TC2: Config Operations
```typescript
it('should save and load config', async () => {
  await config.setGlobalConfig({ preferences: { verboseOutput: true } });
  const loaded = await config.getGlobalConfig();
  expect(loaded.preferences.verboseOutput).toBe(true);
});
```

### TC3: Registry Operations
```typescript
it('should add and retrieve skill', async () => {
  await registry.addSkill(testSkill);
  const skill = await registry.getSkill(testSkill.id);
  expect(skill).toEqual(testSkill);
});
```

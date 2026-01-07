# Spec: E4-S1 官方 Skills 下载器

## Overview

**Story ID**: E4-S1  
**Spec Version**: 1.0  
**Created**: 2026-01-07

## Objective

实现从 Anthropic 官方 GitHub 仓库下载 Skills 的下载器。

---

## Technical Specification

### 1. Anthropic Skills Repository

官方 Skills 仓库: `https://github.com/anthropics/skills`

目录结构：
```
skills/
├── algorithmic-art/
│   └── SKILL.md
├── frontend-design/
│   └── SKILL.md
├── webapp-testing/
│   └── SKILL.md
└── ...
```

### 2. Downloader Interface

```typescript
interface AnthropicDownloader {
  // 获取可用 skills 列表
  listAvailableSkills(): Promise<string[]>;
  
  // 下载单个 skill
  downloadSkill(skillName: string): Promise<DownloadResult>;
  
  // 下载所有 skills
  downloadAll(): Promise<DownloadResult[]>;
  
  // 检查更新
  checkForUpdates(): Promise<UpdateInfo[]>;
  
  // 获取 skill 元数据
  getSkillMetadata(skillName: string): Promise<SkillMetadata | null>;
}
```

### 3. Types

```typescript
interface DownloadResult {
  skillName: string;
  success: boolean;
  path?: string;
  error?: string;
  isNew: boolean;
  isUpdated: boolean;
}

interface UpdateInfo {
  skillName: string;
  currentVersion?: string;
  latestVersion: string;
  hasUpdate: boolean;
}
```

### 4. Download Strategy

1. **API First**: 使用 GitHub API 获取文件列表
2. **Raw Download**: 通过 raw.githubusercontent.com 下载文件
3. **Fallback**: 如果 API 限流，使用缓存列表

### 5. GitHub API Endpoints

```typescript
// 获取仓库内容
const API_BASE = 'https://api.github.com/repos/anthropics/skills/contents';

// 获取原始文件
const RAW_BASE = 'https://raw.githubusercontent.com/anthropics/skills/main';
```

### 6. Caching Strategy

- 缓存 skill 列表: `~/.skillmana/cache/anthropic/skills-list.json`
- 缓存更新时间戳: `~/.skillmana/cache/anthropic/last-check.json`
- 缓存有效期: 24 小时

---

## Implementation

### File: `src/core/anthropic.ts`

Anthropic downloader implementation.

---

## Acceptance Criteria

### AC1: List Skills
- [ ] 能够获取官方 skills 列表
- [ ] 支持缓存和离线查看

### AC2: Download Single
- [ ] 能够下载单个 skill
- [ ] 验证下载完整性

### AC3: Download All
- [ ] 能够批量下载所有 skills
- [ ] 显示进度

### AC4: Check Updates
- [ ] 检测已安装 skills 的更新
- [ ] 显示版本差异

---

## Test Cases

### TC1: List Available Skills
```typescript
it('should list all available Anthropic skills', async () => {
  const skills = await downloader.listAvailableSkills();
  expect(skills).toContain('frontend-design');
  expect(skills.length).toBeGreaterThan(10);
});
```

### TC2: Download Skill
```typescript
it('should download a skill successfully', async () => {
  const result = await downloader.downloadSkill('frontend-design');
  expect(result.success).toBe(true);
  expect(result.path).toBeDefined();
});
```

# Spec: E2-S1 Skills 注册表完善

## Overview

**Story ID**: E2-S1  
**Spec Version**: 1.0  
**Created**: 2026-01-07

## Objective

完善 Skills 注册表功能，支持从文件系统扫描和解析 Skills 元数据。

---

## Technical Specification

### 1. Skill Parser

解析 Skill 文件（SKILL.md 或 *.md）的 frontmatter 元数据。

```typescript
interface SkillParser {
  parseSkillFile(filePath: string): Promise<Skill | null>;
  parseDirectory(dirPath: string): Promise<Skill[]>;
  extractFrontmatter(content: string): Record<string, unknown>;
}
```

### 2. Frontmatter Format

```yaml
---
name: skill-name
description: Skill description
license: MIT
triggers:
  - trigger1
  - trigger2
domain: frontend
---
```

### 3. Skill Scanner

扫描目录结构，发现并解析所有 Skills。

```typescript
interface SkillScanner {
  scanGlobalSkills(): Promise<Skill[]>;
  scanCategory(categoryId: string): Promise<Skill[]>;
  syncRegistry(): Promise<void>;
}
```

---

## Acceptance Criteria

- [ ] 能够解析 SKILL.md frontmatter
- [ ] 能够扫描目录发现 Skills
- [ ] 能够同步注册表与文件系统
- [ ] 支持增量更新

---

## Implementation Files

- `src/core/parser.ts` - Skill 文件解析器
- `src/core/scanner.ts` - 目录扫描器

# SkillMana - Epics & Stories

> Cursor Skills 本地管理工具 - 开发计划

## Project Overview

**项目名称**: SkillMana  
**版本**: v1.0.0  
**开始日期**: 2026-01-07  
**目标**: 构建一个本地化的 Cursor Skills 管理 CLI 工具

---

## Epic 1: 项目基础架构

**Epic ID**: E1  
**优先级**: P0  
**状态**: ✅ Completed

### Story 1.1: 项目初始化与配置

**Story ID**: E1-S1  
**状态**: ✅ Completed  
**预估**: 4h

#### 描述
初始化 Node.js 项目，配置 TypeScript、ESLint、Prettier，建立基础项目结构。

#### 验收标准
- [x] package.json 配置完成，包含所有必要依赖
- [x] tsconfig.json 配置完成
- [x] 项目目录结构建立
- [x] 基础脚本可运行 (build, dev, test)

---

### Story 1.2: CLI 框架搭建

**Story ID**: E1-S2  
**状态**: ✅ Completed  
**预估**: 4h

#### 描述
使用 Commander.js 搭建 CLI 框架，实现基础命令结构。

#### 验收标准
- [x] CLI 入口点可执行
- [x] 帮助命令正常显示
- [x] 版本命令正常显示
- [x] 命令路由正确

---

### Story 1.3: 全局存储结构实现

**Story ID**: E1-S3  
**状态**: ✅ Completed  
**预估**: 4h

#### 描述
实现全局存储目录结构 (~/.skillmana/)，包括配置、注册表、缓存等。

#### 验收标准
- [x] 全局目录自动创建
- [x] 配置文件初始化
- [x] 注册表文件初始化
- [x] 目录权限正确

---

### Story 1.4: 软链接管理模块

**Story ID**: E1-S4  
**状态**: ✅ Completed  
**预估**: 3h

#### 描述
实现跨平台的软链接管理，支持 macOS、Linux 和 Windows。

#### 验收标准
- [x] macOS/Linux 软链接正常工作
- [x] Windows junction 支持
- [x] 链接状态检测
- [x] 链接修复功能

---

### Story 1.5: Init 命令实现

**Story ID**: E1-S5  
**状态**: ✅ Completed  
**预估**: 4h

#### 描述
实现 `skillmana init` 命令，初始化当前项目的 Skills 配置。

#### 验收标准
- [x] 创建 .cursor 目录
- [x] 创建软链接到全局 skills
- [x] 创建项目配置文件
- [x] 输出友好的初始化信息

---

## Epic 2: Skills 管理功能

**Epic ID**: E2  
**优先级**: P0  
**状态**: ✅ Completed

### Story 2.1: Skills 注册表

**Story ID**: E2-S1  
**状态**: ✅ Completed  
**预估**: 4h

#### 描述
实现 Skills 注册表，管理所有已安装的 Skills 元数据。

#### 验收标准
- [x] 注册表 CRUD 操作
- [x] Skills 元数据解析
- [x] 索引和搜索功能
- [x] 持久化存储

---

### Story 2.2: Add 命令

**Story ID**: E2-S2  
**状态**: ✅ Completed  
**预估**: 6h

#### 描述
实现 `skillmana add` 命令，支持从多种来源添加 Skills。

#### 验收标准
- [x] 支持本地文件添加
- [x] 支持 URL 添加
- [x] 支持 GitHub 仓库添加
- [x] 全局/项目级选择

---

### Story 2.3: Remove 命令

**Story ID**: E2-S3  
**状态**: ✅ Completed  
**预估**: 4h

#### 描述
实现 `skillmana remove` 命令，支持删除 Skills。

#### 验收标准
- [x] 全局删除
- [x] 项目级排除
- [x] 依赖检查
- [x] 确认提示

---

### Story 2.4: List/Search/Info 命令

**Story ID**: E2-S4  
**状态**: ✅ Completed  
**预估**: 6h

#### 描述
实现浏览和搜索 Skills 的命令。

#### 验收标准
- [x] 列表显示所有 Skills
- [x] 按类别筛选
- [x] 关键词搜索
- [x] 详情查看

---

## Epic 3: 自动分类与路由

**Epic ID**: E3  
**优先级**: P1  
**状态**: ✅ Completed

### Story 3.1: 分类器实现

**Story ID**: E3-S1  
**状态**: ✅ Completed  
**预估**: 6h

#### 描述
实现 Skills 自动分类器，根据内容和元数据分类。

#### 验收标准
- [x] 关键词匹配分类
- [x] 领域检测
- [x] 分类建议功能
- [x] 批量分类支持

#### 实现文件
- `src/core/classifier.ts`
- `docs/specs/E3-S1-classifier.md`

---

### Story 3.2: 路由引擎

**Story ID**: E3-S2  
**状态**: ✅ Completed  
**预估**: 8h

#### 描述
实现智能路由引擎，根据用户意图选择合适的 Skills。

#### 验收标准
- [x] 意图检测 (BUILD, FIX, TEST, etc.)
- [x] 复杂度评估
- [x] 多级加载支持 (L1/L2/L3)
- [x] route 命令实现

#### 实现文件
- `src/core/router.ts`
- `src/commands/route.ts`
- `docs/specs/E3-S2-router.md`

---

### Story 3.3: Core Skills 归并

**Story ID**: E3-S3  
**状态**: ✅ Completed  
**预估**: 4h

#### 描述
实现 Core Skills 归并逻辑，压缩多个相关 Skills。

#### 验收标准
- [x] 合并多个 skills 为 core
- [x] 内容重要性分级
- [x] Token 估算
- [x] 生成 core 文件

#### 实现文件
- `src/core/merger.ts`
- `docs/specs/E3-S3-core-merger.md`

---

## Epic 4: Anthropic 官方 Skills 集成

**Epic ID**: E4  
**优先级**: P1  
**状态**: ✅ Completed

### Story 4.1: 官方 Skills 下载器

**Story ID**: E4-S1  
**状态**: ✅ Completed  
**预估**: 4h

#### 描述
实现从 Anthropic GitHub 仓库下载 Skills。

#### 验收标准
- [x] 获取可用 skills 列表
- [x] 下载单个 skill
- [x] 批量下载所有
- [x] 缓存机制

#### 实现文件
- `src/core/anthropic.ts`
- `docs/specs/E4-S1-anthropic-downloader.md`

---

### Story 4.2: 自动安装与更新

**Story ID**: E4-S2  
**状态**: ✅ Completed  
**预估**: 4h

#### 描述
实现 `skillmana update` 命令，自动更新官方 Skills。

#### 验收标准
- [x] 检查更新状态
- [x] 下载并安装更新
- [x] --force 强制更新
- [x] --list 列出可用

#### 实现文件
- `src/commands/update.ts`
- `docs/specs/E4-S2-update-command.md`

---

## Epic 5: 发布与部署

**Epic ID**: E5  
**优先级**: P0  
**状态**: ✅ Completed

### Story 5.1: 文档与 README

**Story ID**: E5-S1  
**状态**: ✅ Completed  
**预估**: 4h

#### 描述
完善项目文档和 README。

#### 验收标准
- [x] README 完整
- [x] 命令文档
- [x] 示例代码
- [x] 路线图

---

### Story 5.2: GitHub 发布

**Story ID**: E5-S2  
**状态**: ✅ Completed  
**预估**: 2h

#### 描述
配置 GitHub 仓库和 release 流程。

#### 验收标准
- [x] GitHub Actions CI/CD
- [x] Release 自动化
- [x] CHANGELOG 生成

#### 实现文件
- `.github/workflows/ci.yml` - CI 配置
- `.github/workflows/release.yml` - 发布配置
- `CHANGELOG.md` - 变更日志
- `CONTRIBUTING.md` - 贡献指南

---

### Story 5.3: npm 发布

**Story ID**: E5-S3  
**状态**: ✅ Completed  
**预估**: 2h

#### 描述
发布到 npm registry。

#### 验收标准
- [x] npm publish 配置
- [x] 版本管理
- [x] 发布脚本

#### 实现文件
- `package.json` - npm 配置
- `.npmignore` - npm 忽略文件

---

## Progress Tracking

| Epic | Stories | Completed | Progress |
|------|---------|-----------|----------|
| E1: 基础架构 | 5 | 5 | 100% ✅ |
| E2: Skills 管理 | 4 | 4 | 100% ✅ |
| E3: 分类与路由 | 3 | 3 | 100% ✅ |
| E4: 官方集成 | 2 | 2 | 100% ✅ |
| E5: 发布部署 | 3 | 3 | 100% ✅ |
| **Total** | **17** | **17** | **100%** ✅ |

---

## Technical Specifications

所有技术规范文档位于 `docs/specs/` 目录：

- `E1-S1-project-init.md` - 项目初始化规范
- `E1-S3-global-storage.md` - 全局存储规范
- `E2-S1-skills-registry.md` - 注册表规范
- `E3-S1-classifier.md` - 分类器规范
- `E3-S2-router.md` - 路由引擎规范
- `E3-S3-core-merger.md` - Core 归并规范
- `E4-S1-anthropic-downloader.md` - Anthropic 下载器规范
- `E4-S2-update-command.md` - Update 命令规范

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-07 | 初始化 Epics & Stories 文档 |
| 2026-01-07 | 完成 Epic 1: 项目基础架构 (100%) |
| 2026-01-07 | 完成 Epic 2: Skills 管理功能 (100%) |
| 2026-01-07 | 完成 Epic 3: 自动分类与路由 (100%) |
| 2026-01-07 | 完成 Epic 4: Anthropic 官方集成 (100%) |
| 2026-01-07 | 完成 E5-S1: 文档与 README |
| 2026-01-07 | 完成 E5-S2: GitHub 发布准备 |
| 2026-01-07 | 完成 E5-S3: npm 发布准备 |
| 2026-01-07 | 🎉 项目 v1.0.0 完成! |

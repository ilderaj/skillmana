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
**状态**: 🚧 In Progress

### Story 1.1: 项目初始化与配置

**Story ID**: E1-S1  
**状态**: 🚧 In Progress  
**预估**: 4h

#### 描述
初始化 Node.js 项目，配置 TypeScript、ESLint、Prettier，建立基础项目结构。

#### 验收标准
- [ ] package.json 配置完成，包含所有必要依赖
- [ ] tsconfig.json 配置完成
- [ ] 项目目录结构建立
- [ ] 基础脚本可运行 (build, dev, test)

#### Tasks
- [x] Task 1.1.1: 创建 package.json
- [ ] Task 1.1.2: 配置 TypeScript
- [ ] Task 1.1.3: 建立目录结构
- [ ] Task 1.1.4: 配置构建脚本

---

### Story 1.2: CLI 框架搭建

**Story ID**: E1-S2  
**状态**: ⏳ Pending  
**预估**: 4h

#### 描述
使用 Commander.js 搭建 CLI 框架，实现基础命令结构。

#### 验收标准
- [ ] CLI 入口点可执行
- [ ] 帮助命令正常显示
- [ ] 版本命令正常显示
- [ ] 命令路由正确

#### Tasks
- [ ] Task 1.2.1: 安装 CLI 依赖
- [ ] Task 1.2.2: 创建 CLI 入口
- [ ] Task 1.2.3: 实现命令路由
- [ ] Task 1.2.4: 添加帮助和版本信息

---

### Story 1.3: 全局存储结构实现

**Story ID**: E1-S3  
**状态**: ⏳ Pending  
**预估**: 4h

#### 描述
实现全局存储目录结构 (~/.skillmana/)，包括配置、注册表、缓存等。

#### 验收标准
- [ ] 全局目录自动创建
- [ ] 配置文件初始化
- [ ] 注册表文件初始化
- [ ] 目录权限正确

#### Tasks
- [ ] Task 1.3.1: 设计存储结构
- [ ] Task 1.3.2: 实现目录创建
- [ ] Task 1.3.3: 实现配置管理
- [ ] Task 1.3.4: 实现注册表管理

---

### Story 1.4: 软链接管理模块

**Story ID**: E1-S4  
**状态**: ⏳ Pending  
**预估**: 3h

#### 描述
实现跨平台的软链接管理，支持 macOS、Linux 和 Windows。

#### 验收标准
- [ ] macOS/Linux 软链接正常工作
- [ ] Windows junction 支持
- [ ] 链接状态检测
- [ ] 链接修复功能

#### Tasks
- [ ] Task 1.4.1: 实现软链接创建
- [ ] Task 1.4.2: 实现链接检测
- [ ] Task 1.4.3: 实现链接修复
- [ ] Task 1.4.4: Windows 兼容处理

---

### Story 1.5: Init 命令实现

**Story ID**: E1-S5  
**状态**: ⏳ Pending  
**预估**: 4h

#### 描述
实现 `skillmana init` 命令，初始化当前项目的 Skills 配置。

#### 验收标准
- [ ] 创建 .cursor 目录
- [ ] 创建软链接到全局 skills
- [ ] 创建项目配置文件
- [ ] 输出友好的初始化信息

#### Tasks
- [ ] Task 1.5.1: 实现 init 命令
- [ ] Task 1.5.2: 项目检测逻辑
- [ ] Task 1.5.3: 配置文件生成
- [ ] Task 1.5.4: 用户反馈输出

---

## Epic 2: Skills 管理功能

**Epic ID**: E2  
**优先级**: P0  
**状态**: ⏳ Pending

### Story 2.1: Skills 注册表

**Story ID**: E2-S1  
**状态**: ⏳ Pending  
**预估**: 4h

#### 描述
实现 Skills 注册表，管理所有已安装的 Skills 元数据。

#### 验收标准
- [ ] 注册表 CRUD 操作
- [ ] Skills 元数据解析
- [ ] 索引和搜索功能
- [ ] 持久化存储

---

### Story 2.2: Add 命令

**Story ID**: E2-S2  
**状态**: ⏳ Pending  
**预估**: 6h

#### 描述
实现 `skillmana add` 命令，支持从多种来源添加 Skills。

#### 验收标准
- [ ] 支持本地文件添加
- [ ] 支持 URL 添加
- [ ] 支持 GitHub 仓库添加
- [ ] 全局/项目级选择

---

### Story 2.3: Remove 命令

**Story ID**: E2-S3  
**状态**: ⏳ Pending  
**预估**: 4h

#### 描述
实现 `skillmana remove` 命令，支持删除 Skills。

#### 验收标准
- [ ] 全局删除
- [ ] 项目级排除
- [ ] 依赖检查
- [ ] 确认提示

---

### Story 2.4: List/Search/Info 命令

**Story ID**: E2-S4  
**状态**: ⏳ Pending  
**预估**: 6h

#### 描述
实现浏览和搜索 Skills 的命令。

#### 验收标准
- [ ] 列表显示所有 Skills
- [ ] 按类别筛选
- [ ] 关键词搜索
- [ ] 详情查看

---

## Epic 3: 自动分类与路由

**Epic ID**: E3  
**优先级**: P1  
**状态**: ⏳ Pending

### Story 3.1: 分类器实现

**Story ID**: E3-S1  
**状态**: ⏳ Pending  
**预估**: 6h

#### 描述
实现 Skills 自动分类器，根据内容和元数据分类。

---

### Story 3.2: 路由引擎

**Story ID**: E3-S2  
**状态**: ⏳ Pending  
**预估**: 8h

#### 描述
实现智能路由引擎，根据用户意图选择合适的 Skills。

---

### Story 3.3: Core Skills 归并

**Story ID**: E3-S3  
**状态**: ⏳ Pending  
**预估**: 4h

#### 描述
实现 Core Skills 归并逻辑，压缩多个相关 Skills。

---

## Epic 4: Anthropic 官方 Skills 集成

**Epic ID**: E4  
**优先级**: P1  
**状态**: ⏳ Pending

### Story 4.1: 官方 Skills 下载器

**Story ID**: E4-S1  
**状态**: ⏳ Pending  
**预估**: 4h

---

### Story 4.2: 自动安装与更新

**Story ID**: E4-S2  
**状态**: ⏳ Pending  
**预估**: 4h

---

## Epic 5: 发布与部署

**Epic ID**: E5  
**优先级**: P0  
**状态**: ⏳ Pending

### Story 5.1: 文档与 README

**Story ID**: E5-S1  
**状态**: ⏳ Pending  
**预估**: 4h

---

### Story 5.2: GitHub 发布

**Story ID**: E5-S2  
**状态**: ⏳ Pending  
**预估**: 2h

---

### Story 5.3: npm 发布

**Story ID**: E5-S3  
**状态**: ⏳ Pending  
**预估**: 2h

---

## Progress Tracking

| Epic | Stories | Completed | Progress |
|------|---------|-----------|----------|
| E1: 基础架构 | 5 | 5 | 100% ✅ |
| E2: Skills 管理 | 4 | 4 | 100% ✅ |
| E3: 分类与路由 | 3 | 0 | 0% |
| E4: 官方集成 | 2 | 0 | 0% |
| E5: 发布部署 | 3 | 1 | 33% |
| **Total** | **17** | **10** | **59%** |

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-07 | 初始化 Epics & Stories 文档 |
| 2026-01-07 | 完成 Epic 1: 项目基础架构 (100%) |
| 2026-01-07 | 完成 Epic 2: Skills 管理功能 (100%) |
| 2026-01-07 | 实现核心命令: init, list, search, info, add, remove, sync |

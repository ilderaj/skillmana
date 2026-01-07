# SkillMana TUI - Epics & Stories

> 终端用户界面 (TUI) 开发计划

## Project Overview

**项目名称**: SkillMana TUI  
**版本**: v1.1.0  
**开始日期**: 2026-01-07  
**目标**: 为 SkillMana 添加交互式终端用户界面

---

## Epic 6: TUI 基础框架

**Epic ID**: E6  
**优先级**: P0  
**状态**: ✅ Completed

### Story 6.1: TUI 项目结构与依赖配置

**Story ID**: E6-S1  
**状态**: ✅ Completed  
**预估**: 3h

#### 描述
配置 Ink 框架及相关依赖，建立 TUI 模块的项目结构。

#### 任务清单
- [x] 安装 ink, react, ink-text-input, ink-select-input, ink-spinner 依赖
- [x] 创建 src/tui/ 目录结构
- [x] 配置 TypeScript 支持 JSX/TSX
- [x] 创建 TUI 入口文件 src/tui/index.tsx

#### 验收标准
- [x] 所有依赖正确安装并可导入
- [x] TSX 文件可正常编译
- [x] 基础 Ink 应用可启动运行

#### 技术规范
- 文档: `docs/specs/E6-S1-tui-setup.md`

---

### Story 6.2: TUI 命令入口实现

**Story ID**: E6-S2  
**状态**: ✅ Completed  
**预估**: 2h

#### 描述
实现 `skillmana tui` 命令入口，支持命令行参数。

#### 任务清单
- [x] 创建 src/commands/tui.ts 命令文件
- [x] 注册 tui 命令及别名 (ui, interactive)
- [x] 实现 --view 参数支持
- [x] 集成到 CLI 主入口

#### 验收标准
- [x] `skillmana tui` 命令可执行
- [x] `skillmana ui` 和 `skillmana interactive` 别名可用
- [x] `--view` 参数可指定初始视图

#### 技术规范
- 文档: `docs/specs/E6-S2-tui-command.md`

---

### Story 6.3: 状态管理实现

**Story ID**: E6-S3  
**状态**: ✅ Completed  
**预估**: 3h

#### 描述
使用 React Context + useReducer 实现 TUI 状态管理。

#### 任务清单
- [x] 定义 TUIState 接口
- [x] 实现 TUIContext 和 TUIProvider
- [x] 实现状态 reducer
- [x] 创建 useTUI hook

#### 验收标准
- [x] 状态类型定义完整
- [x] Context 可在组件间共享状态
- [x] 状态更新触发正确的重渲染

#### 技术规范
- 文档: `docs/specs/E6-S3-state-management.md`

---

### Story 6.4: 基础组件库

**Story ID**: E6-S4  
**状态**: ✅ Completed  
**预估**: 4h

#### 描述
实现可复用的基础 UI 组件。

#### 任务清单
- [x] 实现 Header 组件 (标题栏)
- [x] 实现 Footer 组件 (快捷键提示)
- [x] 实现 Box/Panel 组件 (带边框容器)
- [x] 实现 StatsBox 组件 (统计卡片)
- [x] 定义 theme 配色方案

#### 验收标准
- [x] 组件样式符合设计规范
- [x] 组件支持主题配置
- [x] 组件响应终端尺寸变化

#### 技术规范
- 文档: `docs/specs/E6-S4-base-components.md`

---

### Story 6.5: 键盘导航系统

**Story ID**: E6-S5  
**状态**: ✅ Completed  
**预估**: 4h

#### 描述
实现全局键盘事件处理和导航系统。

#### 任务清单
- [x] 创建 useKeyboard hook
- [x] 实现全局快捷键 (q, ?, Esc, Tab, 1-6)
- [x] 实现 Vim 风格导航 (h/j/k/l)
- [x] 实现焦点管理

#### 验收标准
- [x] 全局快捷键响应正确
- [x] 导航键在列表中正常工作
- [x] 焦点在面板间正确切换

#### 技术规范
- 文档: `docs/specs/E6-S5-keyboard-navigation.md`

---

## Epic 7: 核心视图实现

**Epic ID**: E7  
**优先级**: P0  
**状态**: ✅ Completed

### Story 7.1: Dashboard 仪表盘视图

**Story ID**: E7-S1  
**状态**: ✅ Completed  
**预估**: 4h

#### 描述
实现主入口仪表盘视图，显示系统概览和快捷操作。

#### 任务清单
- [x] 创建 Dashboard.tsx 视图组件
- [x] 实现统计卡片 (Skills 数量、类别统计)
- [x] 实现快捷操作区 (1-6 数字键)
- [x] 实现最近活动显示

#### 验收标准
- [x] 正确显示 Skills 统计数据
- [x] 数字键可跳转到对应功能
- [x] 界面布局符合设计稿

#### 技术规范
- 文档: `docs/specs/E7-S1-dashboard.md`

---

### Story 7.2: Skills Browser 列表视图

**Story ID**: E7-S2  
**状态**: ✅ Completed  
**预估**: 6h

#### 描述
实现 Skills 浏览器，支持列表显示和实时预览。

#### 任务清单
- [x] 创建 SkillsBrowser.tsx 视图组件
- [x] 实现 SkillList 列表组件
- [x] 实现 Preview 预览面板
- [x] 实现 FilterBar 筛选栏
- [x] 集成现有 registry 数据

#### 验收标准
- [x] 正确显示所有 Skills 列表
- [x] 选中项实时预览
- [x] 筛选器正常工作
- [x] 大列表滚动流畅

#### 技术规范
- 文档: `docs/specs/E7-S2-skills-browser.md`

---

### Story 7.3: Search 搜索视图

**Story ID**: E7-S3  
**状态**: ✅ Completed  
**预估**: 4h

#### 描述
实现实时搜索功能视图。

#### 任务清单
- [x] 创建 Search.tsx 视图组件
- [x] 实现 SearchInput 搜索输入组件
- [x] 实现实时过滤逻辑
- [x] 实现搜索结果高亮

#### 验收标准
- [x] 输入时即时过滤结果
- [x] 搜索名称、描述、触发词
- [x] 关键词高亮显示
- [x] 搜索响应 < 100ms

#### 技术规范
- 文档: `docs/specs/E7-S3-search.md`

---

### Story 7.4: Skill Detail 详情视图

**Story ID**: E7-S4  
**状态**: ✅ Completed  
**预估**: 3h

#### 描述
实现 Skill 详情展示视图。

#### 任务清单
- [x] 创建 SkillDetail.tsx 视图组件
- [x] 显示完整元数据信息
- [x] 显示触发词列表
- [x] 实现操作按钮 (启用/禁用/删除)

#### 验收标准
- [x] 显示所有 Skill 元数据
- [x] 操作按钮功能正常
- [x] Esc 返回上一级

#### 技术规范
- 文档: `docs/specs/E7-S4-skill-detail.md`

---

## Epic 8: 高级功能视图

**Epic ID**: E8  
**优先级**: P1  
**状态**: ✅ Completed

### Story 8.1: Routing Config 路由配置视图

**Story ID**: E8-S1  
**状态**: ✅ Completed  
**预估**: 5h

#### 描述
实现路由配置视图，支持可视化配置和测试。

#### 任务清单
- [x] 创建 RoutingConfig.tsx 视图组件
- [x] 实现路由级别选择 (core/auto/full)
- [x] 实现路由测试功能
- [x] 集成现有 router 模块

#### 验收标准
- [x] 可视化选择路由级别
- [x] 测试查询返回正确结果
- [x] 配置变更可保存

#### 技术规范
- 文档: `docs/specs/E8-S1-routing-config.md`

---

### Story 8.2: Update 更新视图

**Story ID**: E8-S2  
**状态**: ✅ Completed  
**预估**: 4h

#### 描述
实现官方 Skills 更新管理视图。

#### 任务清单
- [x] 创建 UpdateView.tsx 视图组件
- [x] 显示可用更新列表
- [x] 实现选择性更新
- [x] 实现进度显示

#### 验收标准
- [x] 正确显示更新状态
- [x] 可选择需要更新的 Skills
- [x] 进度条正确反映安装进度

#### 技术规范
- 文档: `docs/specs/E8-S2-update-view.md`

---

### Story 8.3: 确认对话框与帮助面板

**Story ID**: E8-S3  
**状态**: ✅ Completed  
**预估**: 3h

#### 描述
实现通用确认对话框和帮助面板组件。

#### 任务清单
- [x] 创建 ConfirmDialog.tsx 组件
- [x] 创建 HelpPanel.tsx 组件
- [x] 实现对话框遮罩层
- [x] 实现快捷键说明显示

#### 验收标准
- [x] 危险操作显示确认对话框
- [x] ? 键显示帮助面板
- [x] Esc 关闭弹窗

#### 技术规范
- 文档: `docs/specs/E8-S3-dialogs.md`

---

## Epic 9: 优化与完善

**Epic ID**: E9  
**优先级**: P1  
**状态**: ⏳ Pending

### Story 9.1: 性能优化

**Story ID**: E9-S1  
**状态**: ⏳ Pending  
**预估**: 3h

#### 描述
优化 TUI 性能，确保流畅的用户体验。

#### 任务清单
- [ ] 实现虚拟滚动 (大列表)
- [ ] 优化重渲染逻辑
- [ ] 缓存计算结果
- [ ] 性能指标测试

#### 验收标准
- [ ] 启动时间 < 500ms
- [ ] 100+ Skills 列表流畅滚动
- [ ] 无明显卡顿

#### 技术规范
- 文档: `docs/specs/E9-S1-performance.md`

---

### Story 9.2: 响应式布局

**Story ID**: E9-S2  
**状态**: ⏳ Pending  
**预估**: 3h

#### 描述
实现终端尺寸自适应布局。

#### 任务清单
- [ ] 检测终端尺寸变化
- [ ] 实现紧凑模式 (< 80 列)
- [ ] 实现宽屏模式 (> 120 列)
- [ ] 动态调整布局

#### 验收标准
- [ ] 不同终端尺寸正确显示
- [ ] 尺寸变化时平滑过渡
- [ ] 小尺寸隐藏次要信息

#### 技术规范
- 文档: `docs/specs/E9-S2-responsive.md`

---

### Story 9.3: 错误处理与用户提示

**Story ID**: E9-S3  
**状态**: ⏳ Pending  
**预估**: 2h

#### 描述
完善错误处理和用户友好提示。

#### 任务清单
- [ ] 统一错误显示样式
- [ ] 实现 Toast 通知
- [ ] 添加操作成功反馈
- [ ] 边界情况处理

#### 验收标准
- [ ] 错误信息清晰可理解
- [ ] 操作结果有即时反馈
- [ ] 无未处理异常

#### 技术规范
- 文档: `docs/specs/E9-S3-error-handling.md`

---

## Progress Tracking

| Epic | Stories | Completed | Progress |
|------|---------|-----------|----------|
| E6: TUI 基础框架 | 5 | 5 | 100% ✅ |
| E7: 核心视图 | 4 | 4 | 100% ✅ |
| E8: 高级功能 | 3 | 3 | 100% ✅ |
| E9: 优化完善 | 3 | 0 | 0% |
| **Total** | **15** | **12** | **80%** |

---

## 开发里程碑

| 里程碑 | 目标日期 | 交付物 | 状态 |
|--------|---------|--------|------|
| M1 | 第1周 | E6 完成: 基础框架 + Dashboard | ✅ |
| M2 | 第2周 | E7 完成: Skills 浏览 + 搜索 | ✅ |
| M3 | 第3周 | E8 + E9 完成: 完整功能 + 优化 | 🔄 80% |

---

## Technical Specifications

所有技术规范文档位于 `docs/specs/` 目录：

| 文档 | 描述 |
|------|------|
| `E6-S1-tui-setup.md` | TUI 项目结构规范 |
| `E6-S2-tui-command.md` | TUI 命令入口规范 |
| `E6-S3-state-management.md` | 状态管理规范 |
| `E6-S4-base-components.md` | 基础组件规范 |
| `E6-S5-keyboard-navigation.md` | 键盘导航规范 |
| `E7-S1-dashboard.md` | 仪表盘视图规范 |
| `E7-S2-skills-browser.md` | Skills 浏览器规范 |
| `E7-S3-search.md` | 搜索功能规范 |
| `E7-S4-skill-detail.md` | 详情视图规范 |
| `E8-S1-routing-config.md` | 路由配置规范 |
| `E8-S2-update-view.md` | 更新视图规范 |
| `E8-S3-dialogs.md` | 对话框组件规范 |
| `E9-S1-performance.md` | 性能优化规范 |
| `E9-S2-responsive.md` | 响应式布局规范 |
| `E9-S3-error-handling.md` | 错误处理规范 |

---

## 依赖关系

```
E6-S1 (项目结构)
  ├── E6-S2 (命令入口)
  ├── E6-S3 (状态管理)
  │     └── E7-* (所有视图)
  ├── E6-S4 (基础组件)
  │     └── E7-* (所有视图)
  └── E6-S5 (键盘导航)
        └── E7-* (所有视图)

E7-1 (Dashboard) ── 独立
E7-2 (Skills Browser) ── 依赖 E6-*
E7-3 (Search) ── 依赖 E7-2
E7-4 (Skill Detail) ── 依赖 E7-2

E8-1 (Routing Config) ── 依赖 E6-*
E8-2 (Update View) ── 依赖 E6-*
E8-3 (Dialogs) ── 依赖 E6-4

E9-* (优化) ── 依赖所有功能完成
```

---

## Changelog

| Date | Change |
|------|--------|
| 2026-01-07 | 创建 TUI Epics & Stories 文档 |
| 2026-01-07 | 完成 E6: TUI 基础框架 (100%) |
| 2026-01-07 | 完成 E7: 核心视图实现 (100%) |
| 2026-01-07 | 完成 E8: 高级功能视图 (100%) |

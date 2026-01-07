# SkillMana TUI - 产品需求文档 (PRD)

> 🖥️ 为 SkillMana 添加交互式终端用户界面 (TUI)

## 文档信息

| 字段 | 值 |
|------|-----|
| 版本 | 1.0.0 |
| 状态 | Draft |
| 创建日期 | 2026-01-07 |
| 作者 | SkillMana Team |

---

## 1. 概述

### 1.1 背景

SkillMana 目前是一个纯命令行工具，用户需要记住各种命令和参数才能操作。虽然 CLI 对于自动化和脚本化场景非常有效，但对于日常交互式使用，一个可视化的 TUI（终端用户界面）将大大提升用户体验。

### 1.2 目标

为 SkillMana 添加一个现代化的交互式 TUI 模式，让用户能够：

- 可视化浏览和管理所有 Skills
- 通过键盘快捷键快速操作
- 实时预览 Skill 详情
- 交互式配置路由设置
- 一键执行常用操作

### 1.3 非目标

- 不替代现有的 CLI 命令（TUI 是补充，不是替代）
- 不添加图形化 GUI（仅限终端内）
- 不支持鼠标操作（纯键盘驱动）

---

## 2. 用户需求

### 2.1 目标用户

- **主要用户**: 使用 Cursor IDE 的开发者
- **使用场景**: 管理本地 Skills、浏览可用 Skills、配置路由

### 2.2 用户痛点

1. **命令记忆负担**: 需要记住多个命令和参数
2. **信息展示有限**: CLI 输出信息分散，难以获得全局视图
3. **操作不直观**: 需要多次执行命令才能完成一个工作流
4. **缺乏实时反馈**: 操作结果需要重新执行命令查看

### 2.3 用户故事

| ID | 用户故事 | 优先级 |
|----|---------|-------|
| US1 | 作为用户，我想通过一个界面查看所有已安装的 Skills，以便快速了解可用资源 | P0 |
| US2 | 作为用户，我想通过搜索快速找到特定 Skill，以便节省时间 | P0 |
| US3 | 作为用户，我想预览 Skill 详情而不离开主界面，以便快速评估 | P0 |
| US4 | 作为用户，我想通过快捷键执行常用操作（启用/禁用/删除），以便提高效率 | P1 |
| US5 | 作为用户，我想可视化配置路由设置，以便更好地理解和调整 | P1 |
| US6 | 作为用户，我想看到系统状态概览（Skills 数量、路由配置等），以便了解当前状态 | P1 |
| US7 | 作为用户，我想在 TUI 中直接测试路由查询，以便验证配置效果 | P2 |
| US8 | 作为用户，我想批量操作多个 Skills，以便高效管理 | P2 |

---

## 3. 功能规格

### 3.1 入口命令

```bash
# 启动 TUI 模式
skillmana tui

# 或使用别名
skillmana ui
skillmana interactive

# 直接进入特定视图
skillmana tui --view skills    # 进入 Skills 列表
skillmana tui --view routing   # 进入路由配置
skillmana tui --view dashboard # 进入仪表盘
```

### 3.2 主要界面

#### 3.2.1 仪表盘视图 (Dashboard)

主入口界面，显示系统概览：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🎯 SkillMana v1.0.2                                      [q]uit [?]help   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  📊 Dashboard                                                               │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │ Total Skills    │  │ Anthropic       │  │ Custom          │             │
│  │      24         │  │      18         │  │      6          │             │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘             │
│                                                                             │
│  ┌─────────────────┐  ┌─────────────────┐                                  │
│  │ Core Skills     │  │ Routing Level   │                                  │
│  │       3         │  │     auto        │                                  │
│  └─────────────────┘  └─────────────────┘                                  │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Quick Actions:                                                             │
│                                                                             │
│  [1] 📦 Browse Skills     [2] 🔍 Search         [3] ⚙️  Routing Config      │
│  [4] 🔄 Update Official   [5] ➕ Add Skill      [6] 🏥 Doctor               │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Recent Activity:                                                           │
│  • frontend-design updated (2 hours ago)                                   │
│  • stripe-checkout installed (1 day ago)                                   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**功能说明**:
- 显示 Skills 统计信息
- 快捷键导航到各功能模块
- 显示最近活动记录

#### 3.2.2 Skills 列表视图 (Skills Browser)

浏览和管理所有 Skills：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📦 Skills Browser                            [/]search [Tab]filter [Esc]back│
├─────────────────────────────────────────────────────────────────────────────┤
│  Filter: All ▼    Category: All ▼    Source: All ▼                         │
├────────────────────────────────────────────┬────────────────────────────────┤
│  Skills (24)                               │  Preview                       │
│  ────────────────────────────────────────  │  ────────────────────────────  │
│  ▶ frontend-design         [official]     │  # frontend-design             │
│    webapp-testing          [official]     │                                │
│    stripe-checkout         [official]     │  Create distinctive,           │
│    mcp-builder             [official]     │  production-grade frontend     │
│    xlsx                    [official]     │  interfaces with high design   │
│    pdf                     [official]     │  quality.                      │
│    docx                    [official]     │                                │
│    pptx                    [official]     │  **Domain:** frontend          │
│    canvas-design           [official]     │  **Category:** anthropic       │
│    brand-guidelines        [official]     │  **Triggers:**                 │
│    skill-creator           [official]     │  - create UI                   │
│    my-custom-skill         [custom]       │  - build component             │
│                                            │  - design interface            │
│                                            │                                │
│                                            │  **Tokens:** ~2,500            │
├────────────────────────────────────────────┴────────────────────────────────┤
│  [Enter] View  [e] Enable/Disable  [d] Delete  [i] Info  [a] Add New       │
└─────────────────────────────────────────────────────────────────────────────┘
```

**功能说明**:
- 左侧：Skills 列表，支持滚动和选择
- 右侧：选中 Skill 的实时预览
- 顶部：筛选器（类别、来源、状态）
- 底部：操作快捷键

#### 3.2.3 搜索视图 (Search)

实时搜索 Skills：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🔍 Search Skills                                               [Esc]back   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Search: stripe█                                                            │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Results (3 matches):                                                       │
│                                                                             │
│  ▶ stripe-checkout                                             [official]  │
│    Handle Stripe payment integrations and checkout flows                   │
│    Triggers: stripe, payment, checkout                                     │
│                                                                             │
│    stripe-webhooks                                             [custom]    │
│    Process Stripe webhook events                                           │
│    Triggers: webhook, stripe events                                        │
│                                                                             │
│    stripe-connect                                              [custom]    │
│    Stripe Connect marketplace integration                                  │
│    Triggers: connect, marketplace, platform                                │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Enter] Select  [↑↓] Navigate  [Tab] Back to input                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

**功能说明**:
- 实时搜索（输入时即时过滤）
- 搜索名称、描述、触发词
- 高亮匹配关键词

#### 3.2.4 路由配置视图 (Routing Config)

配置智能路由设置：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  ⚙️  Routing Configuration                                       [Esc]back  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Current Settings:                                                          │
│  ─────────────────                                                          │
│                                                                             │
│  Routing Level:  [●] core   [○] auto   [○] full                            │
│                                                                             │
│  Level Descriptions:                                                        │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ core  │ L1: Only core skills - minimal tokens (max 1)                 │ │
│  │ auto  │ L2: Adaptive selection based on complexity (max 3) ← default  │ │
│  │ full  │ L3: Full skills for maximum capability (max 5)                │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Test Routing:                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │ Enter query: Build a React form with Stripe payment█                  │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  [Enter] Test Query  [←→] Change Level  [s] Save Changes                   │
└─────────────────────────────────────────────────────────────────────────────┘
```

**功能说明**:
- 可视化选择路由级别
- 实时测试路由查询
- 显示路由决策详情

#### 3.2.5 Skill 详情视图 (Skill Detail)

查看 Skill 完整信息：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  📄 Skill Details: frontend-design                               [Esc]back  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐ │
│  │  Name:        frontend-design                                         │ │
│  │  Source:      anthropic (official)                                    │ │
│  │  Category:    anthropic                                               │ │
│  │  Domain:      frontend                                                │ │
│  │  Is Core:     No                                                      │ │
│  │  Version:     1.0.0                                                   │ │
│  │  Tokens:      ~2,500                                                  │ │
│  │  Path:        ~/.skillmana/skills/anthropic/frontend-design           │ │
│  └───────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│  Description:                                                               │
│  ─────────────                                                              │
│  Create distinctive, production-grade frontend interfaces with high        │
│  design quality. Use this skill when the user asks to build web            │
│  components, pages, or applications.                                        │
│                                                                             │
│  Triggers:                                                                  │
│  ─────────                                                                  │
│  • create UI                • build component        • design interface    │
│  • frontend design          • web development        • React/Vue/Svelte    │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  [e] Enable/Disable  [d] Delete  [o] Open File  [c] Copy Path              │
└─────────────────────────────────────────────────────────────────────────────┘
```

#### 3.2.6 更新视图 (Update View)

管理官方 Skills 更新：

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  🔄 Anthropic Skills Update                                      [Esc]back  │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  Available Updates:                                                         │
│  ─────────────────                                                          │
│                                                                             │
│  [✓] frontend-design        v1.0.0 → v1.1.0                                │
│  [✓] webapp-testing         v1.0.0 → v1.0.1                                │
│  [ ] stripe-checkout        (up to date)                                   │
│  [ ] mcp-builder            (up to date)                                   │
│                                                                             │
│  New Skills Available:                                                      │
│  ─────────────────────                                                      │
│                                                                             │
│  [ ] svg-generator          Create SVG graphics                            │
│  [ ] api-documentation      Generate API docs                              │
│                                                                             │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│  Progress: ████████░░░░░░░░ 50% (2/4 skills updated)                       │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│  [Space] Toggle  [a] Select All  [Enter] Install Selected  [r] Refresh    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 键盘快捷键

#### 3.3.1 全局快捷键

| 快捷键 | 功能 |
|--------|------|
| `q` / `Ctrl+C` | 退出 TUI |
| `?` / `F1` | 显示帮助 |
| `Esc` | 返回上一级 / 关闭弹窗 |
| `Tab` | 切换面板 / 焦点 |
| `1-6` | 仪表盘快捷操作 |

#### 3.3.2 导航快捷键

| 快捷键 | 功能 |
|--------|------|
| `↑` / `k` | 向上移动 |
| `↓` / `j` | 向下移动 |
| `←` / `h` | 向左 / 折叠 |
| `→` / `l` | 向右 / 展开 |
| `g` | 跳转到顶部 |
| `G` | 跳转到底部 |
| `Page Up` | 上翻页 |
| `Page Down` | 下翻页 |

#### 3.3.3 操作快捷键

| 快捷键 | 功能 |
|--------|------|
| `Enter` | 确认 / 查看详情 |
| `/` | 开始搜索 |
| `e` | 启用 / 禁用 Skill |
| `d` | 删除 Skill |
| `a` | 添加新 Skill |
| `r` | 刷新列表 |
| `f` | 切换筛选器 |
| `Space` | 多选切换 |

### 3.4 交互流程

#### 3.4.1 启动流程

```
用户执行 skillmana tui
    │
    ▼
初始化 TUI 框架
    │
    ▼
加载配置和 Registry
    │
    ▼
渲染 Dashboard 视图
    │
    ▼
等待用户输入
```

#### 3.4.2 Skill 操作流程

```
用户在列表中选择 Skill
    │
    ├─── [Enter] ──→ 打开详情视图
    │
    ├─── [e] ─────→ 确认对话框 ──→ 执行启用/禁用
    │
    ├─── [d] ─────→ 确认对话框 ──→ 执行删除
    │
    └─── [i] ─────→ 显示快速信息弹窗
```

---

## 4. 技术规格

### 4.1 技术选型

| 组件 | 选择 | 理由 |
|------|------|------|
| TUI 框架 | **Ink** | React 式声明 UI，生态完善，TypeScript 支持好 |
| 布局组件 | **ink-box** | 提供 flexbox 布局能力 |
| 输入处理 | **ink-text-input** | 文本输入组件 |
| 列表选择 | **ink-select-input** | 选择列表组件 |
| 进度条 | **ink-spinner** / **ink-progress-bar** | 加载和进度显示 |

### 4.2 推荐依赖

```json
{
  "dependencies": {
    "ink": "^5.0.1",
    "ink-text-input": "^6.0.0",
    "ink-select-input": "^6.0.0",
    "ink-spinner": "^5.0.0",
    "ink-box": "^2.0.0",
    "react": "^18.2.0"
  }
}
```

### 4.3 架构设计

```
src/
├── tui/
│   ├── index.tsx              # TUI 入口
│   ├── App.tsx                # 主应用组件
│   ├── store/
│   │   ├── index.ts           # 状态管理
│   │   └── types.ts           # 状态类型
│   ├── hooks/
│   │   ├── useSkills.ts       # Skills 数据 hook
│   │   ├── useRouter.ts       # 路由配置 hook
│   │   ├── useNavigation.ts   # 导航状态 hook
│   │   └── useKeyboard.ts     # 键盘处理 hook
│   ├── views/
│   │   ├── Dashboard.tsx      # 仪表盘视图
│   │   ├── SkillsBrowser.tsx  # Skills 列表视图
│   │   ├── Search.tsx         # 搜索视图
│   │   ├── RoutingConfig.tsx  # 路由配置视图
│   │   ├── SkillDetail.tsx    # Skill 详情视图
│   │   └── UpdateView.tsx     # 更新视图
│   ├── components/
│   │   ├── Header.tsx         # 顶部导航栏
│   │   ├── Footer.tsx         # 底部快捷键提示
│   │   ├── SkillList.tsx      # Skills 列表组件
│   │   ├── SkillCard.tsx      # Skill 卡片组件
│   │   ├── Preview.tsx        # 预览面板
│   │   ├── FilterBar.tsx      # 筛选栏
│   │   ├── SearchInput.tsx    # 搜索输入框
│   │   ├── StatsBox.tsx       # 统计卡片
│   │   ├── ConfirmDialog.tsx  # 确认对话框
│   │   └── HelpPanel.tsx      # 帮助面板
│   └── utils/
│       ├── theme.ts           # 主题配置
│       └── formatting.ts      # 格式化工具
└── commands/
    └── tui.ts                 # TUI 命令入口
```

### 4.4 状态管理

使用 React Context + useReducer 模式：

```typescript
interface TUIState {
  // 当前视图
  currentView: 'dashboard' | 'skills' | 'search' | 'routing' | 'detail' | 'update';
  
  // Skills 数据
  skills: Skill[];
  selectedSkill: Skill | null;
  filter: SkillFilter;
  
  // 搜索状态
  searchQuery: string;
  searchResults: Skill[];
  
  // 路由配置
  routingLevel: RoutingLevel;
  
  // UI 状态
  isLoading: boolean;
  error: string | null;
  dialog: DialogState | null;
}
```

### 4.5 与现有代码集成

TUI 将复用现有的 core 模块：

```typescript
// TUI 使用现有核心功能
import { registry } from '../core/registry.js';
import { scanner } from '../core/scanner.js';
import { router } from '../core/router.js';
import { configManager } from '../core/config.js';
import { anthropicClient } from '../core/anthropic.js';
```

---

## 5. 用户体验设计

### 5.1 设计原则

1. **简洁高效**: 最少按键完成任务
2. **信息密度**: 充分利用终端空间
3. **即时反馈**: 操作结果即时可见
4. **容错性**: 危险操作需确认
5. **一致性**: 快捷键和交互模式统一

### 5.2 视觉设计

#### 5.2.1 配色方案

```typescript
const theme = {
  primary: 'cyan',      // 主色调 - 标题、选中项
  secondary: 'magenta', // 次要色 - 标签、徽章
  success: 'green',     // 成功状态
  warning: 'yellow',    // 警告状态
  error: 'red',         // 错误状态
  muted: 'gray',        // 次要文本
  border: 'gray',       // 边框
};
```

#### 5.2.2 图标使用

```
📦 Skills / 包
🔍 Search / 搜索
⚙️  Settings / 配置
🔄 Update / 更新
➕ Add / 添加
🗑️  Delete / 删除
✅ Enabled / 已启用
❌ Disabled / 已禁用
🏷️  Category / 类别
🎯 Target / 目标
📊 Statistics / 统计
```

### 5.3 响应式设计

TUI 需要适应不同终端尺寸：

| 宽度 | 布局 |
|------|------|
| < 80 | 紧凑模式：隐藏预览面板 |
| 80-120 | 标准模式：双栏布局 |
| > 120 | 宽屏模式：显示更多信息 |

---

## 6. 实现计划

### 6.1 开发阶段

#### Phase 1: 基础框架 (3-4 天)

- [ ] 设置 Ink 项目结构
- [ ] 实现基础组件 (Header, Footer, Box)
- [ ] 实现状态管理
- [ ] 实现 Dashboard 视图
- [ ] 集成现有 core 模块

#### Phase 2: 核心视图 (4-5 天)

- [ ] 实现 Skills Browser 视图
- [ ] 实现搜索功能
- [ ] 实现 Skill 详情视图
- [ ] 实现筛选功能

#### Phase 3: 高级功能 (3-4 天)

- [ ] 实现路由配置视图
- [ ] 实现更新视图
- [ ] 实现确认对话框
- [ ] 实现帮助面板

#### Phase 4: 优化和测试 (2-3 天)

- [ ] 性能优化
- [ ] 键盘导航优化
- [ ] 边界情况处理
- [ ] 错误处理和提示
- [ ] 文档更新

### 6.2 里程碑

| 里程碑 | 预计完成 | 交付物 |
|--------|---------|--------|
| M1 | 第1周 | 基础框架 + Dashboard |
| M2 | 第2周 | Skills 浏览 + 搜索 |
| M3 | 第3周 | 完整功能 + 测试 |

### 6.3 风险和缓解

| 风险 | 影响 | 缓解措施 |
|------|------|---------|
| Ink 性能问题 | 大列表渲染慢 | 实现虚拟滚动 |
| 终端兼容性 | 不同终端显示差异 | 测试主流终端，提供降级方案 |
| 键盘事件冲突 | 与某些终端快捷键冲突 | 提供自定义快捷键配置 |

---

## 7. 成功指标

### 7.1 功能指标

- [ ] 所有现有 CLI 功能都能在 TUI 中完成
- [ ] 平均操作步骤减少 50%
- [ ] 支持 100+ Skills 流畅浏览

### 7.2 性能指标

- [ ] 启动时间 < 500ms
- [ ] 列表滚动流畅 (> 30 FPS)
- [ ] 搜索响应 < 100ms

### 7.3 用户体验指标

- [ ] 新用户能在 5 分钟内上手
- [ ] 常用操作可在 3 次按键内完成

---

## 8. 附录

### 8.1 竞品参考

- **lazygit**: Git TUI 客户端，优秀的键盘导航
- **k9s**: Kubernetes TUI，出色的信息密度
- **btop**: 系统监控 TUI，美观的可视化

### 8.2 相关文档

- [Ink 文档](https://github.com/vadimdemedes/ink)
- [现有 CLI 命令参考](./README.md)
- [技术架构文档](./docs/specs/)

### 8.3 术语表

| 术语 | 定义 |
|------|------|
| TUI | Terminal User Interface，终端用户界面 |
| Skill | Cursor IDE 的功能扩展单元 |
| Core Skill | 压缩合并后的精简 Skill |
| Routing | 根据用户意图自动选择 Skill 的机制 |

---

## 变更日志

| 版本 | 日期 | 变更内容 |
|------|------|---------|
| 1.0.0 | 2026-01-07 | 初始版本 |

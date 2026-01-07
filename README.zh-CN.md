# SkillMana

> 🎯 一个本地化的 Cursor Skills 管理 CLI 工具

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![GitHub release](https://img.shields.io/github/v/release/ilderaj/skillmana)](https://github.com/ilderaj/skillmana/releases)

[English](./README.md) | 简体中文

SkillMana 帮助你高效地管理、分类和路由 Cursor Skills。它提供了一种集中化的方式来全局组织 skills，同时允许通过软链接进行项目级别的自定义配置。

## ✨ 特性

- **🌍 全局 Skills 管理**：在 `~/.skillmana/` 中集中管理所有 Cursor skills
- **🔗 项目初始化**：使用软链接初始化项目（无需重复复制）
- **📁 自动分类**：按领域自动分类 skills（产品、前端、测试等）
- **🧭 智能路由**：基于用户意图和上下文智能选择 skills
- **⚡ 核心 Skills**：压缩的、节省 token 的相关 skills 合集
- **🤖 Anthropic 集成**：同步和管理官方 Anthropic skills
- **🔍 搜索与发现**：通过名称、描述或触发词查找 skills

## 📦 安装

```bash
# 克隆仓库
git clone https://github.com/ilderaj/skillmana.git
cd skillmana

# 安装依赖
npm install

# 构建
npm run build

# 全局链接
npm link
```

安装完成后，你可以在任何地方使用 `skillmana` 命令。

## 🚀 快速开始

```bash
# 1. 安装官方 Anthropic skills
skillmana update

# 2. 同步已有的 skills（如果你有 ~/.cursor-skills 目录）
skillmana sync

# 3. 在你的项目中初始化 SkillMana
cd your-project
skillmana init

# 4. 列出所有可用的 skills
skillmana list

# 5. 搜索特定的 skills
skillmana search "stripe"

# 6. 获取某个 skill 的详细信息
skillmana info frontend-design
```

## 📋 命令

| 命令 | 描述 |
|------|------|
| `init` | 在当前项目中初始化 SkillMana（创建软链接） |
| `sync` | 从旧版 `~/.cursor-skills` 目录同步 skills |
| `add <source>` | 添加新 skill（本地路径、URL 或 GitHub user/repo） |
| `remove <name>` | 全局或从项目中移除 skill |
| `list` | 列出所有 skills（支持筛选选项） |
| `search <query>` | 通过名称、描述或触发词搜索 skills |
| `info <name>` | 显示 skill 的详细信息 |
| `enable <name>` | 在当前项目中启用 skill |
| `disable <name>` | 在当前项目中禁用 skill |
| `route` | 配置自动路由设置 |
| `update` | 更新 Anthropic 官方 skills |
| `tui` | 启动交互式终端界面（别名：`ui`、`interactive`） |
| `doctor` | 诊断环境问题 |

### 命令示例

```bash
# 仅列出核心 skills
skillmana list --core

# 按类别列出 skills
skillmana list --category anthropic

# 从本地路径添加 skill
skillmana add ./my-custom-skill

# 从 GitHub 添加 skill
skillmana add anthropics/skills/frontend-design

# 移除 skill（需确认）
skillmana remove my-skill

# 移除 skill（跳过确认）
skillmana remove my-skill --force

# 仅从当前项目排除 skill
skillmana remove my-skill --local

# 更新所有 Anthropic skills
skillmana update

# 检查更新但不安装
skillmana update --check

# 列出可用的 Anthropic skills
skillmana update --list

# 强制重新下载所有 skills
skillmana update --force

# 配置路由级别
skillmana route --level core    # L1: 仅核心 skills
skillmana route --level auto    # L2: 自适应（默认）
skillmana route --level full    # L3: 完整 skills

# 使用查询测试路由
skillmana route --test "Create a React component"

# 启动交互式 TUI
skillmana tui                   # 打开仪表盘
skillmana tui --view skills     # 打开 skills 浏览器
skillmana tui --view search     # 打开搜索视图
skillmana tui --view routing    # 打开路由配置
```

## 🧭 智能路由

SkillMana 包含一个智能路由引擎，可以根据你的查询自动选择最合适的 skills：

### 路由级别

| 级别 | 描述 | 最大 Skills 数 |
|------|------|----------------|
| `core` | 仅核心 skills - 最少 token | 1 |
| `auto` | 基于复杂度自适应选择 | 3 |
| `full` | 完整 skills 获取最大能力 | 5 |

### 意图检测

路由器会自动检测你的意图：

- **BUILD**：创建新功能（`create`、`build`、`implement`）
- **FIX**：修复 bug（`fix`、`debug`、`resolve`）
- **TEST**：编写测试（`test`、`spec`、`coverage`）
- **DESIGN**：UI/UX 工作（`design`、`layout`、`style`）
- **ANALYZE**：代码分析（`review`、`audit`、`check`）
- **DOCUMENT**：文档编写（`doc`、`readme`、`guide`）
- **OPTIMIZE**：性能优化（`optimize`、`improve`、`speed`）

### 使用方法

```bash
# 启用自动路由
skillmana route --enable

# 测试路由
skillmana route --test "Build a payment form with Stripe"
# 输出：
#   Intent: BUILD
#   Domain: payment
#   Selected: stripe-checkout, frontend-design

# 设置为仅核心模式
skillmana route --level core
```

## 📂 目录结构

```
~/.skillmana/                    # 全局根目录
├── skills/                      # Skills 仓库
│   ├── core/                    # 核心 skills（压缩版）
│   ├── anthropic/               # 官方 Anthropic skills
│   ├── product-management/      # 产品管理 skills
│   ├── ux-design/               # UX 设计 skills
│   ├── testing-qa/              # 测试/QA skills
│   ├── stripe-payment/          # 支付 skills
│   └── custom/                  # 用户自定义 skills
├── rules/                       # 路由规则
├── config/                      # 配置
│   └── settings.json
├── registry/                    # Skills 注册表
│   └── index.json
└── cache/                       # 缓存数据
    └── anthropic/

/your-project/.cursor/           # 项目配置
├── skills -> ~/.skillmana/skills   # 软链接到全局
├── rules -> ~/.skillmana/rules     # 软链接到全局
└── skillmana.json               # 项目特定配置
```

## ⚙️ 配置

### 全局配置 (`~/.skillmana/config/settings.json`)

```json
{
  "version": "1.0.0",
  "skillsPath": "~/.skillmana/skills",
  "rulesPath": "~/.skillmana/rules",
  "preferences": {
    "defaultScope": "global",
    "verboseOutput": false,
    "colorOutput": true
  }
}
```

### 项目配置 (`.cursor/skillmana.json`)

```json
{
  "version": "1.0.0",
  "autoRouting": true,
  "routingLevel": "auto",
  "excludedSkills": [],
  "customSkills": []
}
```

## 🤖 Anthropic Skills

SkillMana 可以自动下载和管理来自 [Anthropic Skills 仓库](https://github.com/anthropics/skills) 的官方 skills：

| Skill | 描述 |
|-------|------|
| `frontend-design` | 现代 UI/UX 设计模式 |
| `webapp-testing` | Web 应用测试 |
| `mcp-builder` | MCP 服务器开发 |
| `xlsx` | Excel 文件处理 |
| `pdf` | PDF 文档处理 |
| `docx` | Word 文档处理 |
| `pptx` | PowerPoint 演示文稿 |
| `canvas-design` | HTML Canvas 图形 |
| `brand-guidelines` | 品牌形象设计 |
| `skill-creator` | 创建自定义 skills |
| ...更多 | |

```bash
# 列出所有可用的 Anthropic skills
skillmana update --list

# 安装所有 skills
skillmana update

# 安装特定 skill
skillmana update frontend-design
```

## 🛠️ 开发

```bash
# 克隆仓库
git clone https://github.com/ilderaj/skillmana.git
cd skillmana

# 安装依赖
npm install

# 构建
npm run build

# 开发模式运行
npm run dev

# 运行测试
npm test

# 类型检查
npm run typecheck
```

## 🗺️ 路线图

### ✅ 已完成 (v1.0.x)

- [x] 核心 CLI 框架
- [x] 全局 skills 管理
- [x] 使用软链接的项目初始化
- [x] Skills 注册表和扫描
- [x] Add/Remove/List/Search/Info 命令
- [x] 从旧目录同步
- [x] 智能路由引擎
- [x] Skill 分类器
- [x] 核心 skills 合并器
- [x] Anthropic skills 自动更新
- [x] **交互式 TUI 模式** (v1.0.3) - `skillmana tui`
  - 带统计数据的仪表盘
  - 带预览的 Skills 浏览器
  - 实时搜索
  - 路由配置
  - 键盘导航（vim 风格）
- [x] **TUI 更新功能增强** (v1.0.4)
  - 修复 Anthropic skills 下载 URL
  - 带实时进度的交互式更新视图
  - 刷新/安装/强制重装快捷键

### 🚧 计划中 (v1.1.x - 性能与优化)

- [ ] **TUI 性能优化**
  - 大型 skill 列表的懒加载
  - 虚拟滚动以提升内存效率
  - 更快的 skill 索引和缓存
  - 减少启动时间
- [ ] 不同终端尺寸的响应式布局
- [ ] Skill 模板和脚手架
- [ ] 自定义扩展的插件系统

### 🎯 计划中 (v1.2.x - Skills 商店集成)

- [ ] **SkillsMP 商店集成** ([skillsmp.com](https://skillsmp.com/))
  - 浏览和搜索 49,000+ 社区 skills
  - 一键从商店安装 skill
  - Skill 评分、热度和质量指标
  - 按分类发现 skills
- [ ] **通过 URL 安装 Skills**
  - GitHub 仓库链接（`skillmana add https://github.com/user/repo`）
  - GitHub 原始文件链接
  - SkillsMP 直链（`skillmana add https://skillsmp.com/skills/skill-name`）
  - 支持私有仓库认证
- [ ] **依赖管理**
  - 在 SKILL.md 中声明 skill 依赖
  - 自动依赖解析和安装
  - 依赖冲突检测
  - 依赖树可视化

### 🌐 计划中 (v2.0.x - WebApp 及更多)

- [ ] **SkillMana WebApp**
  - 基于 Web 的 skill 管理仪表盘
  - 可视化 skill 编辑器和预览
  - 跨设备 skill 同步
  - 团队协作功能
- [ ] Skill 版本控制和回滚
- [ ] Skill 更新通知
- [ ] 个人 skill 库云同步
- [ ] 导出/导入 skill 集合
- [ ] 基于项目上下文的 AI 智能 skill 推荐

### 💡 未来构想

- [ ] Skill 分析和使用统计
- [ ] 社区 skill 分享和发布
- [ ] Skill 打包（将多个 skills 合并为一个）
- [ ] 多语言 skill 支持
- [ ] IDE 扩展（VS Code、JetBrains）
- [ ] Skill 测试框架

## 🤝 贡献

欢迎贡献！请随时提交 Pull Request。

1. Fork 这个仓库
2. 创建你的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交你的更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开一个 Pull Request

## 📄 许可证

MIT © [SkillMana Contributors](LICENSE)

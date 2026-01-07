# SkillMana

> 🎯 A local CLI tool for managing Cursor Skills

[![npm version](https://img.shields.io/npm/v/skillmana.svg)](https://www.npmjs.com/package/skillmana)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

SkillMana helps you manage, categorize, and route Cursor Skills efficiently. It provides a centralized way to organize skills globally while allowing project-specific customization through symlinks.

## ✨ Features

- **🌍 Global Skills Management**: Centrally manage all your Cursor skills in `~/.skillmana/`
- **🔗 Project Initialization**: Initialize projects with symlinks to global skills (no duplication)
- **📁 Auto-Categorization**: Automatically categorize skills by domain (product, frontend, testing, etc.)
- **🧭 Smart Routing**: Intelligent skill selection based on user intent and context
- **⚡ Core Skills**: Compressed, token-efficient versions of related skills
- **🤖 Anthropic Integration**: Sync and manage official Anthropic skills
- **🔍 Search & Discovery**: Find skills by name, description, or triggers

## 📦 Installation

```bash
# Using npm
npm install -g skillmana

# Using pnpm
pnpm add -g skillmana

# Using yarn
yarn global add skillmana
```

### From Source

```bash
git clone https://github.com/ilderaj/skillmana.git
cd skillmana
npm install
npm run build
npm link
```

## 🚀 Quick Start

```bash
# 1. Install official Anthropic skills
skillmana update

# 2. Sync existing skills from ~/.cursor-skills (if you have them)
skillmana sync

# 3. Initialize SkillMana in your project
cd your-project
skillmana init

# 4. List all available skills
skillmana list

# 5. Search for specific skills
skillmana search "stripe"

# 6. Get detailed info about a skill
skillmana info frontend-design
```

## 📋 Commands

| Command | Description |
|---------|-------------|
| `init` | Initialize SkillMana in the current project (creates symlinks) |
| `sync` | Sync skills from legacy `~/.cursor-skills` directory |
| `add <source>` | Add a new skill (local path, URL, or GitHub user/repo) |
| `remove <name>` | Remove a skill globally or from project |
| `list` | List all skills (with filtering options) |
| `search <query>` | Search for skills by name, description, or triggers |
| `info <name>` | Show detailed skill information |
| `enable <name>` | Enable a skill in current project |
| `disable <name>` | Disable a skill in current project |
| `route` | Configure auto-routing settings |
| `update` | Update Anthropic official skills |
| `doctor` | Diagnose environment issues |

### Command Examples

```bash
# List only core skills
skillmana list --core

# List skills by category
skillmana list --category anthropic

# Add skill from local path
skillmana add ./my-custom-skill

# Add skill from GitHub
skillmana add anthropics/skills/frontend-design

# Remove skill (with confirmation)
skillmana remove my-skill

# Remove skill without confirmation
skillmana remove my-skill --force

# Exclude skill from current project only
skillmana remove my-skill --local

# Update all Anthropic skills
skillmana update

# Check for updates without installing
skillmana update --check

# List available Anthropic skills
skillmana update --list

# Force re-download all skills
skillmana update --force

# Configure routing level
skillmana route --level core    # L1: Only core skills
skillmana route --level auto    # L2: Adaptive (default)
skillmana route --level full    # L3: Full skills

# Test routing with a query
skillmana route --test "Create a React component"
```

## 🧭 Smart Routing

SkillMana includes an intelligent routing engine that automatically selects the most appropriate skills based on your query:

### Routing Levels

| Level | Description | Max Skills |
|-------|-------------|------------|
| `core` | Only core skills - minimal tokens | 1 |
| `auto` | Adaptive selection based on complexity | 3 |
| `full` | Full skills for maximum capability | 5 |

### Intent Detection

The router automatically detects your intent:

- **BUILD**: Creating new features (`create`, `build`, `implement`)
- **FIX**: Bug fixing (`fix`, `debug`, `resolve`)
- **TEST**: Writing tests (`test`, `spec`, `coverage`)
- **DESIGN**: UI/UX work (`design`, `layout`, `style`)
- **ANALYZE**: Code analysis (`review`, `audit`, `check`)
- **DOCUMENT**: Documentation (`doc`, `readme`, `guide`)
- **OPTIMIZE**: Performance work (`optimize`, `improve`, `speed`)

### Usage

```bash
# Enable auto-routing
skillmana route --enable

# Test routing
skillmana route --test "Build a payment form with Stripe"
# Output:
#   Intent: BUILD
#   Domain: payment
#   Selected: stripe-checkout, frontend-design

# Set to core-only mode
skillmana route --level core
```

## 📂 Directory Structure

```
~/.skillmana/                    # Global root
├── skills/                      # Skills repository
│   ├── core/                    # Core skills (compressed)
│   ├── anthropic/               # Official Anthropic skills
│   ├── product-management/      # Product management skills
│   ├── ux-design/               # UX design skills
│   ├── testing-qa/              # Testing/QA skills
│   ├── stripe-payment/          # Payment skills
│   └── custom/                  # User custom skills
├── rules/                       # Routing rules
├── config/                      # Configuration
│   └── settings.json
├── registry/                    # Skills registry
│   └── index.json
└── cache/                       # Cache data
    └── anthropic/

/your-project/.cursor/           # Project configuration
├── skills -> ~/.skillmana/skills   # Symlink to global
├── rules -> ~/.skillmana/rules     # Symlink to global
└── skillmana.json               # Project-specific config
```

## ⚙️ Configuration

### Global Config (`~/.skillmana/config/settings.json`)

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

### Project Config (`.cursor/skillmana.json`)

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

SkillMana can automatically download and manage official skills from the [Anthropic Skills Repository](https://github.com/anthropics/skills):

| Skill | Description |
|-------|-------------|
| `frontend-design` | Modern UI/UX design patterns |
| `webapp-testing` | Web application testing |
| `mcp-builder` | MCP server development |
| `xlsx` | Excel file processing |
| `pdf` | PDF document handling |
| `docx` | Word document processing |
| `pptx` | PowerPoint presentations |
| `canvas-design` | HTML Canvas graphics |
| `brand-guidelines` | Brand identity design |
| `skill-creator` | Create custom skills |
| ...and more | |

```bash
# List all available Anthropic skills
skillmana update --list

# Install all skills
skillmana update

# Install specific skill
skillmana update frontend-design
```

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/ilderaj/skillmana.git
cd skillmana

# Install dependencies
npm install

# Build
npm run build

# Run in development mode
npm run dev

# Run tests
npm test

# Type check
npm run typecheck
```

## 🗺️ Roadmap

- [x] Core CLI framework
- [x] Global skills management
- [x] Project initialization with symlinks
- [x] Skills registry and scanning
- [x] Add/Remove/List/Search/Info commands
- [x] Sync from legacy directory
- [x] Smart routing engine
- [x] Skill classifier
- [x] Core skills merger
- [x] Anthropic skills auto-update
- [ ] Interactive TUI mode
- [ ] Skill templates
- [ ] Plugin system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT © [SkillMana Contributors](LICENSE)

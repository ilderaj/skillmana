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
git clone https://github.com/your-username/skillmana.git
cd skillmana
npm install
npm run build
npm link
```

## 🚀 Quick Start

```bash
# 1. Sync existing skills from ~/.cursor-skills (if you have them)
skillmana sync

# 2. Initialize SkillMana in your project
cd your-project
skillmana init

# 3. List all available skills
skillmana list

# 4. Search for specific skills
skillmana search "stripe"

# 5. Get detailed info about a skill
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
```

## Directory Structure

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
└── registry/                    # Skills registry

/your-project/.cursor/           # Project configuration
├── skills -> ~/.skillmana/skills   # Symlink to global
├── rules -> ~/.skillmana/rules     # Symlink to global
└── skillmana.json               # Project-specific config
```

## Configuration

### Global Config (`~/.skillmana/config/settings.json`)

```json
{
  "version": "1.0.0",
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

## Auto-Routing

SkillMana can automatically select the appropriate skill based on your task:

```bash
# Enable auto-routing
skillmana route --enable

# Set routing level
skillmana route --level core   # Use only core skills
skillmana route --level full   # Use full skills
skillmana route --level auto   # Auto-select (default)

# Disable auto-routing
skillmana route --disable
```

## 🛠️ Development

```bash
# Clone the repository
git clone https://github.com/your-username/skillmana.git
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
- [ ] Smart routing engine
- [ ] Anthropic skills auto-update
- [ ] Interactive TUI mode
- [ ] Skill templates

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT © [SkillMana Contributors](LICENSE)

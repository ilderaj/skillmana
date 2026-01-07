# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.4] - 2026-01-07

### Fixed

- **Anthropic Skills Download**: Fixed URL path for downloading official skills from GitHub (added `/skills` subdirectory)

### Added

- **TUI Update View**: Complete rewrite with actual update functionality
  - Auto-check for updates when entering update view
  - Keyboard shortcuts: `[r]` refresh, `[Enter]` install new, `[f]` force reinstall
  - Real-time installation progress display
  - Installed/available skills list with status indicators
- **useUpdate Hook**: New React hook for managing Anthropic skills updates in TUI

## [1.0.3] - 2026-01-07

### Added

- **Interactive TUI Mode** - `skillmana tui`
  - Dashboard with statistics (total skills, categories, routing level)
  - Skills browser with preview panel
  - Real-time fuzzy search
  - Routing configuration view
  - Update view for Anthropic skills
  - Vim-style keyboard navigation (j/k, g/G, /)
  - Help panel with keyboard shortcuts
  - Multiple view aliases: `ui`, `interactive`

## [1.0.2] - 2026-01-07

### Changed

- Remove npm publishing, use GitHub-only distribution
- Simplify installation to clone from GitHub
- Update release workflow for GitHub releases only

## [1.0.1] - 2026-01-07

### Added

- **Smart Routing Engine**
  - Automatic intent detection (BUILD, FIX, TEST, DESIGN, ANALYZE, DOCUMENT, OPTIMIZE)
  - Complexity assessment (SIMPLE, MEDIUM, COMPLEX)
  - Multi-level skill loading (L1/L2/L3)
  - `route` command for configuration and testing

- **Skill Classifier**
  - Domain-based classification (frontend, testing, payment, etc.)
  - Keyword extraction
  - Category suggestions with confidence scores

- **Core Skills Merger**
  - Merge related skills into token-efficient versions
  - Content importance classification (critical, important, optional)
  - Automatic compression

- **Anthropic Integration**
  - Download official Anthropic skills from GitHub
  - `update` command for installation and updates
  - Caching mechanism for offline access

- **CI/CD**
  - GitHub Actions for CI testing
  - Automated release workflow
  - CHANGELOG and CONTRIBUTING documentation

## [1.0.0] - 2026-01-07

### Added

- **Core CLI Framework**
  - Command-line interface using Commander.js
  - Colorful output with Chalk
  - Progress spinners with Ora
  - Interactive prompts with Inquirer

- **Global Skills Management**
  - Central storage in `~/.skillmana/`
  - Skills registry with metadata
  - Category-based organization
  - Persistent configuration

- **Project Initialization**
  - `skillmana init` command
  - Symlinks to global skills (no duplication)
  - Project-specific configuration

- **Skills Operations**
  - `add` - Add skills from local path, URL, or GitHub
  - `remove` - Remove skills globally or locally
  - `list` - List skills with filtering
  - `search` - Search by name, description, triggers
  - `info` - Detailed skill information
  - `sync` - Sync from legacy directory

- **Smart Routing Engine**
  - Automatic intent detection (BUILD, FIX, TEST, etc.)
  - Complexity assessment
  - Multi-level skill loading (L1/L2/L3)
  - `route` command for configuration

- **Skill Classifier**
  - Domain-based classification
  - Keyword extraction
  - Category suggestions

- **Core Skills Merger**
  - Merge related skills into token-efficient versions
  - Content importance classification
  - Automatic compression

- **Anthropic Integration**
  - Download official Anthropic skills
  - `update` command for installation/updates
  - Caching mechanism

### Changed

- N/A (initial release)

### Deprecated

- N/A (initial release)

### Removed

- N/A (initial release)

### Fixed

- N/A (initial release)

### Security

- N/A (initial release)

---

[Unreleased]: https://github.com/ilderaj/skillmana/compare/v1.0.4...HEAD
[1.0.4]: https://github.com/ilderaj/skillmana/compare/v1.0.3...v1.0.4
[1.0.3]: https://github.com/ilderaj/skillmana/compare/v1.0.2...v1.0.3
[1.0.2]: https://github.com/ilderaj/skillmana/compare/v1.0.1...v1.0.2
[1.0.1]: https://github.com/ilderaj/skillmana/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ilderaj/skillmana/releases/tag/v1.0.0

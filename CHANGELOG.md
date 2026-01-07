# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/ilderaj/skillmana/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/ilderaj/skillmana/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ilderaj/skillmana/releases/tag/v1.0.0

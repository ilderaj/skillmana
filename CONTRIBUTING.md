# Contributing to SkillMana

First off, thank you for considering contributing to SkillMana! It's people like you that make SkillMana such a great tool.

## Code of Conduct

This project and everyone participating in it is governed by our Code of Conduct. By participating, you are expected to uphold this code.

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the issue list as you might find out that you don't need to create one. When you are creating a bug report, please include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples to demonstrate the steps**
- **Describe the behavior you observed and what you expected**
- **Include your environment details** (OS, Node.js version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a step-by-step description of the suggested enhancement**
- **Provide specific examples to demonstrate the steps**
- **Describe the current behavior and the expected behavior**
- **Explain why this enhancement would be useful**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Development Setup

```bash
# Clone your fork
git clone https://github.com/your-username/skillmana.git
cd skillmana

# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run in development mode
npm run dev
```

## Project Structure

```
skillmana/
├── src/
│   ├── index.ts          # CLI entry point
│   ├── commands/         # Command implementations
│   │   ├── init.ts
│   │   ├── add.ts
│   │   ├── remove.ts
│   │   ├── list.ts
│   │   ├── search.ts
│   │   ├── info.ts
│   │   ├── sync.ts
│   │   ├── route.ts
│   │   └── update.ts
│   ├── core/             # Core logic
│   │   ├── storage.ts    # Storage management
│   │   ├── config.ts     # Configuration
│   │   ├── registry.ts   # Skills registry
│   │   ├── symlink.ts    # Symlink management
│   │   ├── parser.ts     # Skill file parser
│   │   ├── scanner.ts    # Directory scanner
│   │   ├── classifier.ts # Skill classifier
│   │   ├── router.ts     # Smart router
│   │   ├── merger.ts     # Core merger
│   │   └── anthropic.ts  # Anthropic integration
│   ├── types/            # TypeScript types
│   └── utils/            # Utilities
├── tests/                # Test files
├── docs/                 # Documentation
│   └── specs/            # Technical specifications
└── templates/            # Skill templates
```

## Coding Style

- Use TypeScript with strict mode
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

## Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` A new feature
- `fix:` A bug fix
- `docs:` Documentation only changes
- `style:` Changes that do not affect the meaning of the code
- `refactor:` A code change that neither fixes a bug nor adds a feature
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

Examples:
```
feat: add support for custom skill templates
fix: resolve symlink creation on Windows
docs: update README with new commands
```

## Testing

```bash
# Run all tests
npm test

# Run tests once
npm run test:run

# Run specific test file
npm test -- tests/storage.test.ts
```

## Documentation

- Update README.md for user-facing changes
- Update technical specs in `docs/specs/` for architectural changes
- Add inline comments for complex code
- Update CHANGELOG.md for notable changes

## Questions?

Feel free to open an issue with your question or reach out to the maintainers.

Thank you for contributing! 🎉

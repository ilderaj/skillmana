# Spec: E1-S1 项目初始化与配置

## Overview

**Story ID**: E1-S1  
**Spec Version**: 1.0  
**Created**: 2026-01-07

## Objective

初始化 SkillMana 项目，配置 TypeScript 开发环境，建立标准化的项目结构。

---

## Technical Specification

### 1. Package Configuration (package.json)

```json
{
  "name": "skillmana",
  "version": "1.0.0",
  "description": "A local CLI tool for managing Cursor Skills",
  "type": "module",
  "main": "dist/index.js",
  "bin": {
    "skillmana": "dist/index.js"
  },
  "scripts": {
    "build": "tsup src/index.ts --format esm --dts",
    "dev": "tsup src/index.ts --format esm --watch",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:run": "vitest run",
    "lint": "eslint src --ext .ts",
    "typecheck": "tsc --noEmit"
  },
  "keywords": ["cursor", "skills", "cli", "management"],
  "author": "",
  "license": "MIT",
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### 2. Dependencies

#### Production Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| commander | ^12.0.0 | CLI framework |
| inquirer | ^9.2.0 | Interactive prompts |
| chalk | ^5.3.0 | Terminal styling |
| ora | ^8.0.0 | Spinners |
| boxen | ^7.1.0 | Boxes in terminal |
| conf | ^12.0.0 | Configuration management |
| fs-extra | ^11.2.0 | Enhanced file operations |
| got | ^14.0.0 | HTTP client |
| glob | ^10.3.0 | File pattern matching |
| yaml | ^2.3.0 | YAML parsing |

#### Development Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| typescript | ^5.3.0 | TypeScript compiler |
| tsup | ^8.0.0 | TypeScript bundler |
| vitest | ^1.2.0 | Test framework |
| @types/node | ^20.0.0 | Node.js types |
| @types/fs-extra | ^11.0.0 | fs-extra types |
| @types/inquirer | ^9.0.0 | inquirer types |
| eslint | ^8.56.0 | Linter |
| @typescript-eslint/parser | ^6.0.0 | TS parser for ESLint |
| @typescript-eslint/eslint-plugin | ^6.0.0 | TS rules for ESLint |

### 3. TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "outDir": "dist",
    "rootDir": "src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

### 4. Project Directory Structure

```
skillmana/
├── src/
│   ├── index.ts                 # CLI 入口
│   ├── commands/                # 命令实现
│   │   └── .gitkeep
│   ├── core/                    # 核心逻辑
│   │   └── .gitkeep
│   ├── utils/                   # 工具函数
│   │   ├── logger.ts            # 日志工具
│   │   └── constants.ts         # 常量定义
│   └── types/                   # 类型定义
│       └── index.ts
├── tests/                       # 测试文件
│   └── .gitkeep
├── docs/                        # 文档
│   ├── epics-and-stories.md
│   └── specs/
├── templates/                   # 模板文件
│   └── .gitkeep
├── package.json
├── tsconfig.json
├── .gitignore
├── .eslintrc.json
└── README.md
```

---

## Acceptance Criteria

### AC1: Package Configuration
- [ ] package.json 包含所有必要字段
- [ ] 所有依赖版本明确指定
- [ ] scripts 可正常执行

### AC2: TypeScript Configuration
- [ ] tsconfig.json 配置正确
- [ ] 严格模式启用
- [ ] 编译输出到 dist 目录

### AC3: Directory Structure
- [ ] 所有目录已创建
- [ ] 占位文件存在
- [ ] 基础文件已创建

### AC4: Build Verification
- [ ] `npm run build` 成功
- [ ] `npm run typecheck` 通过
- [ ] 生成的 dist/index.js 可执行

---

## Test Cases

### TC1: Build Test
```bash
npm run build
# Expected: 成功构建，生成 dist/index.js
```

### TC2: TypeCheck Test
```bash
npm run typecheck
# Expected: 无类型错误
```

### TC3: Execution Test
```bash
node dist/index.js --version
# Expected: 输出版本号 1.0.0
```

---

## Implementation Notes

1. 使用 ESM 模块格式 (type: "module")
2. 使用 tsup 进行打包，支持 tree-shaking
3. chalk/ora/boxen 等包需要 ESM 版本
4. 入口文件需要 shebang: #!/usr/bin/env node

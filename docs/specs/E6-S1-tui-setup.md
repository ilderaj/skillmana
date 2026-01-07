# E6-S1: TUI 项目结构与依赖配置

## 概述

配置 Ink 框架及相关依赖，建立 TUI 模块的项目结构。

## 技术选型

### 核心依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| ink | ^5.0.1 | TUI 框架，基于 React |
| react | ^18.2.0 | UI 组件基础 |
| ink-text-input | ^6.0.0 | 文本输入组件 |
| ink-select-input | ^6.0.0 | 选择列表组件 |
| ink-spinner | ^5.0.0 | 加载动画组件 |

### 开发依赖

| 依赖 | 版本 | 用途 |
|------|------|------|
| @types/react | ^18.2.0 | React 类型定义 |

## 目录结构

```
src/
├── tui/
│   ├── index.tsx              # TUI 入口，render() 调用
│   ├── App.tsx                # 主应用组件
│   ├── store/
│   │   ├── index.ts           # 状态管理导出
│   │   ├── context.tsx        # TUIContext 定义
│   │   ├── reducer.ts         # 状态 reducer
│   │   └── types.ts           # 状态类型定义
│   ├── hooks/
│   │   ├── index.ts           # hooks 导出
│   │   ├── useSkills.ts       # Skills 数据 hook
│   │   ├── useRouter.ts       # 路由配置 hook
│   │   ├── useNavigation.ts   # 导航状态 hook
│   │   └── useKeyboard.ts     # 键盘处理 hook
│   ├── views/
│   │   ├── index.ts           # 视图导出
│   │   ├── Dashboard.tsx      # 仪表盘视图
│   │   ├── SkillsBrowser.tsx  # Skills 列表视图
│   │   ├── Search.tsx         # 搜索视图
│   │   ├── RoutingConfig.tsx  # 路由配置视图
│   │   ├── SkillDetail.tsx    # Skill 详情视图
│   │   └── UpdateView.tsx     # 更新视图
│   ├── components/
│   │   ├── index.ts           # 组件导出
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
│       ├── index.ts           # 工具导出
│       ├── theme.ts           # 主题配置
│       └── formatting.ts      # 格式化工具
└── commands/
    └── tui.ts                 # TUI 命令入口
```

## TypeScript 配置

### tsconfig.json 更新

```json
{
  "compilerOptions": {
    "jsx": "react-jsx",
    "jsxImportSource": "react"
  }
}
```

## 入口文件实现

### src/tui/index.tsx

```tsx
import React from 'react';
import { render } from 'ink';
import { App } from './App.js';

export interface TUIOptions {
  view?: 'dashboard' | 'skills' | 'routing' | 'search';
}

export async function startTUI(options: TUIOptions = {}): Promise<void> {
  const { waitUntilExit } = render(<App initialView={options.view} />);
  await waitUntilExit();
}
```

### src/tui/App.tsx

```tsx
import React from 'react';
import { Box, Text } from 'ink';
import { TUIProvider } from './store/context.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { Dashboard } from './views/Dashboard.js';

interface AppProps {
  initialView?: string;
}

export const App: React.FC<AppProps> = ({ initialView = 'dashboard' }) => {
  return (
    <TUIProvider initialView={initialView}>
      <Box flexDirection="column" height="100%">
        <Header />
        <Box flexGrow={1}>
          <Dashboard />
        </Box>
        <Footer />
      </Box>
    </TUIProvider>
  );
};
```

## 主题配置

### src/tui/utils/theme.ts

```typescript
export const theme = {
  colors: {
    primary: 'cyan',
    secondary: 'magenta',
    success: 'green',
    warning: 'yellow',
    error: 'red',
    muted: 'gray',
    border: 'gray',
  },
  icons: {
    skill: '📦',
    search: '🔍',
    settings: '⚙️',
    update: '🔄',
    add: '➕',
    delete: '🗑️',
    enabled: '✅',
    disabled: '❌',
    category: '🏷️',
    stats: '📊',
    dashboard: '🎯',
  },
};
```

## 验收标准

- [ ] `npm install` 后所有依赖正确安装
- [ ] `npm run build` 无 TypeScript 错误
- [ ] 创建的目录结构完整
- [ ] 入口文件可正确导入并调用

## 任务清单

1. 安装依赖
   ```bash
   npm install ink@^5.0.1 react@^18.2.0 ink-text-input@^6.0.0 ink-select-input@^6.0.0 ink-spinner@^5.0.0
   npm install -D @types/react@^18.2.0
   ```

2. 更新 tsconfig.json

3. 创建目录结构

4. 实现入口文件

5. 验证编译和运行

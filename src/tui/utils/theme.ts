/**
 * TUI Theme Configuration
 * 定义颜色方案和图标
 */

export const theme = {
  colors: {
    primary: 'cyan',
    secondary: 'magenta',
    success: 'green',
    warning: 'yellow',
    error: 'red',
    muted: 'gray',
    border: 'gray',
    text: 'white',
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
    doctor: '🏥',
    official: '🏛️',
    custom: '🔧',
    core: '⭐',
    arrow: '▶',
    check: '✓',
    cross: '✗',
  },
} as const;

export type ThemeColors = keyof typeof theme.colors;
export type ThemeIcons = keyof typeof theme.icons;

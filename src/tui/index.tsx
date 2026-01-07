/**
 * TUI Entry Point
 * TUI 入口文件
 */

import { render } from 'ink';
import { App } from './App.js';
import type { ViewType } from './store/types.js';

export interface TUIOptions {
  view?: ViewType;
}

/**
 * 启动 TUI
 */
export async function startTUI(options: TUIOptions = {}): Promise<void> {
  const { waitUntilExit } = render(
    <App initialView={options.view || 'dashboard'} />
  );
  await waitUntilExit();
}

// 导出类型和组件供外部使用
export type { ViewType };
export { App };

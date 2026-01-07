/**
 * TUI Command
 * skillmana tui - 启动交互式终端界面
 */

import { Command } from 'commander';
import { startTUI } from '../tui/index.js';
import type { ViewType } from '../tui/store/types.js';

export const tuiCommand = new Command('tui')
  .description('Launch interactive terminal UI')
  .alias('ui')
  .alias('interactive')
  .option('-v, --view <view>', 'Initial view (dashboard, skills, search, routing, update)', 'dashboard')
  .action(async (options) => {
    const validViews: ViewType[] = ['dashboard', 'skills', 'search', 'routing', 'update'];
    const view = validViews.includes(options.view) ? options.view as ViewType : 'dashboard';
    
    await startTUI({ view });
  });

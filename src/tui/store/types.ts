/**
 * TUI State Types
 * 状态管理类型定义
 */

import type { Skill } from '../../types/index.js';

/** Skill 入口类型（使用核心 Skill 类型） */
export type SkillEntry = Skill;

/** 可用视图 */
export type ViewType = 
  | 'dashboard' 
  | 'skills' 
  | 'search' 
  | 'routing' 
  | 'detail' 
  | 'update';

/** 路由级别 */
export type RoutingLevel = 'core' | 'auto' | 'full';

/** 筛选器配置 */
export interface SkillFilter {
  category: string | null;
  source: 'all' | 'official' | 'custom';
  status: 'all' | 'enabled' | 'disabled';
}

/** 对话框状态 */
export interface DialogState {
  type: 'confirm' | 'help' | 'info';
  title: string;
  message: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

/** TUI 状态 */
export interface TUIState {
  // 当前视图
  currentView: ViewType;
  previousView: ViewType | null;
  
  // Skills 数据
  skills: SkillEntry[];
  selectedSkillIndex: number;
  selectedSkill: SkillEntry | null;
  filter: SkillFilter;
  
  // 搜索状态
  searchQuery: string;
  searchResults: SkillEntry[];
  
  // 路由配置
  routingLevel: RoutingLevel;
  
  // UI 状态
  isLoading: boolean;
  error: string | null;
  dialog: DialogState | null;
  
  // 终端尺寸
  terminalWidth: number;
  terminalHeight: number;
}

/** Action 类型 */
export type TUIAction =
  | { type: 'SET_VIEW'; payload: ViewType }
  | { type: 'GO_BACK' }
  | { type: 'SET_SKILLS'; payload: SkillEntry[] }
  | { type: 'SELECT_SKILL'; payload: number }
  | { type: 'SET_FILTER'; payload: Partial<SkillFilter> }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_SEARCH_RESULTS'; payload: SkillEntry[] }
  | { type: 'SET_ROUTING_LEVEL'; payload: RoutingLevel }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SHOW_DIALOG'; payload: DialogState }
  | { type: 'HIDE_DIALOG' }
  | { type: 'SET_TERMINAL_SIZE'; payload: { width: number; height: number } };

/** 初始状态 */
export const initialState: TUIState = {
  currentView: 'dashboard',
  previousView: null,
  skills: [],
  selectedSkillIndex: 0,
  selectedSkill: null,
  filter: {
    category: null,
    source: 'all',
    status: 'all',
  },
  searchQuery: '',
  searchResults: [],
  routingLevel: 'auto',
  isLoading: false,
  error: null,
  dialog: null,
  terminalWidth: 80,
  terminalHeight: 24,
};

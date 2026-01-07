/**
 * TUI State Reducer
 * 状态更新逻辑
 */

import type { TUIState, TUIAction } from './types.js';

export function tuiReducer(state: TUIState, action: TUIAction): TUIState {
  switch (action.type) {
    case 'SET_VIEW':
      return {
        ...state,
        previousView: state.currentView,
        currentView: action.payload,
      };

    case 'GO_BACK':
      return {
        ...state,
        currentView: state.previousView || 'dashboard',
        previousView: null,
      };

    case 'SET_SKILLS':
      return {
        ...state,
        skills: action.payload,
        selectedSkill: action.payload[state.selectedSkillIndex] || null,
      };

    case 'SELECT_SKILL': {
      const index = Math.max(0, Math.min(action.payload, state.skills.length - 1));
      return {
        ...state,
        selectedSkillIndex: index,
        selectedSkill: state.skills[index] || null,
      };
    }

    case 'SET_FILTER':
      return {
        ...state,
        filter: { ...state.filter, ...action.payload },
      };

    case 'SET_SEARCH_QUERY':
      return {
        ...state,
        searchQuery: action.payload,
      };

    case 'SET_SEARCH_RESULTS':
      return {
        ...state,
        searchResults: action.payload,
      };

    case 'SET_ROUTING_LEVEL':
      return {
        ...state,
        routingLevel: action.payload,
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
      };

    case 'SHOW_DIALOG':
      return {
        ...state,
        dialog: action.payload,
      };

    case 'HIDE_DIALOG':
      return {
        ...state,
        dialog: null,
      };

    case 'SET_TERMINAL_SIZE':
      return {
        ...state,
        terminalWidth: action.payload.width,
        terminalHeight: action.payload.height,
      };

    default:
      return state;
  }
}

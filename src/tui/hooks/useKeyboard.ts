/**
 * useKeyboard Hook
 * 键盘事件处理
 */

import { useInput, useApp } from 'ink';
import { useNavigation } from './useNavigation.js';
import { useSkills } from './useSkills.js';
import { useTUI } from '../store/context.js';

export interface UseKeyboardOptions {
  enabled?: boolean;
}

export function useKeyboard(options: UseKeyboardOptions = {}): void {
  const { enabled = true } = options;
  const { exit } = useApp();
  const { state, dispatch } = useTUI();
  const { currentView, goBack, goToDashboard, goToSkills, goToSearch, goToRouting, goToUpdate } = useNavigation();
  const { selectNext, selectPrevious } = useSkills();

  useInput((input, key) => {
    if (!enabled) return;

    // 如果有对话框，只处理关闭
    if (state.dialog) {
      if (key.escape || input === 'n') {
        dispatch({ type: 'HIDE_DIALOG' });
        state.dialog.onCancel?.();
      } else if (key.return || input === 'y') {
        dispatch({ type: 'HIDE_DIALOG' });
        state.dialog.onConfirm?.();
      }
      return;
    }

    // 全局快捷键
    if (input === 'q' || (key.ctrl && input === 'c')) {
      exit();
      return;
    }

    if (input === '?') {
      dispatch({
        type: 'SHOW_DIALOG',
        payload: {
          type: 'help',
          title: 'Help',
          message: 'Keyboard shortcuts help',
        },
      });
      return;
    }

    if (key.escape) {
      if (currentView !== 'dashboard') {
        goBack();
      }
      return;
    }

    // 仪表盘数字快捷键
    if (currentView === 'dashboard') {
      switch (input) {
        case '1':
          goToSkills();
          break;
        case '2':
          goToSearch();
          break;
        case '3':
          goToRouting();
          break;
        case '4':
          goToUpdate();
          break;
      }
      return;
    }

    // 列表导航
    if (currentView === 'skills' || currentView === 'search') {
      if (key.downArrow || input === 'j') {
        selectNext();
      } else if (key.upArrow || input === 'k') {
        selectPrevious();
      } else if (input === 'g') {
        dispatch({ type: 'SELECT_SKILL', payload: 0 });
      } else if (input === 'G') {
        dispatch({ type: 'SELECT_SKILL', payload: state.skills.length - 1 });
      } else if (input === '/') {
        goToSearch();
      }
    }

    // Tab 切换
    if (key.tab) {
      if (currentView === 'dashboard') {
        goToSkills();
      } else if (currentView === 'skills') {
        goToRouting();
      } else if (currentView === 'routing') {
        goToUpdate();
      } else if (currentView === 'update') {
        goToDashboard();
      }
    }
  }, { isActive: enabled });
}

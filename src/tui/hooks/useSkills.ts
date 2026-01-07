/**
 * useSkills Hook
 * Skills 数据管理
 */

import { useEffect, useCallback } from 'react';
import { useTUI } from '../store/context.js';
import { registry } from '../../core/registry.js';
import type { SkillEntry } from '../store/types.js';

export interface UseSkillsReturn {
  skills: SkillEntry[];
  selectedSkill: SkillEntry | null;
  selectedIndex: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  selectSkill: (index: number) => void;
  selectNext: () => void;
  selectPrevious: () => void;
}

export function useSkills(): UseSkillsReturn {
  const { state, dispatch } = useTUI();

  const refresh = useCallback(async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });

    try {
      // 使用 registry.listSkills() 获取所有 skills
      const skills = await registry.listSkills();
      dispatch({ type: 'SET_SKILLS', payload: skills });
    } catch (error) {
      dispatch({ 
        type: 'SET_ERROR', 
        payload: error instanceof Error ? error.message : 'Failed to load skills' 
      });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [dispatch]);

  const selectSkill = useCallback((index: number) => {
    dispatch({ type: 'SELECT_SKILL', payload: index });
  }, [dispatch]);

  const selectNext = useCallback(() => {
    const nextIndex = Math.min(state.selectedSkillIndex + 1, state.skills.length - 1);
    dispatch({ type: 'SELECT_SKILL', payload: nextIndex });
  }, [dispatch, state.selectedSkillIndex, state.skills.length]);

  const selectPrevious = useCallback(() => {
    const prevIndex = Math.max(state.selectedSkillIndex - 1, 0);
    dispatch({ type: 'SELECT_SKILL', payload: prevIndex });
  }, [dispatch, state.selectedSkillIndex]);

  // 初始加载
  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    skills: state.skills,
    selectedSkill: state.selectedSkill,
    selectedIndex: state.selectedSkillIndex,
    isLoading: state.isLoading,
    error: state.error,
    refresh,
    selectSkill,
    selectNext,
    selectPrevious,
  };
}

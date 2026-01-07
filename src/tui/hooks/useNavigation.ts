/**
 * useNavigation Hook
 * 视图导航管理
 */

import { useCallback } from 'react';
import { useTUI } from '../store/context.js';
import type { ViewType } from '../store/types.js';

export interface UseNavigationReturn {
  currentView: ViewType;
  previousView: ViewType | null;
  navigateTo: (view: ViewType) => void;
  goBack: () => void;
  goToDashboard: () => void;
  goToSkills: () => void;
  goToSearch: () => void;
  goToRouting: () => void;
  goToUpdate: () => void;
  goToDetail: () => void;
}

export function useNavigation(): UseNavigationReturn {
  const { state, dispatch } = useTUI();

  const navigateTo = useCallback((view: ViewType) => {
    dispatch({ type: 'SET_VIEW', payload: view });
  }, [dispatch]);

  const goBack = useCallback(() => {
    dispatch({ type: 'GO_BACK' });
  }, [dispatch]);

  const goToDashboard = useCallback(() => {
    navigateTo('dashboard');
  }, [navigateTo]);

  const goToSkills = useCallback(() => {
    navigateTo('skills');
  }, [navigateTo]);

  const goToSearch = useCallback(() => {
    navigateTo('search');
  }, [navigateTo]);

  const goToRouting = useCallback(() => {
    navigateTo('routing');
  }, [navigateTo]);

  const goToUpdate = useCallback(() => {
    navigateTo('update');
  }, [navigateTo]);

  const goToDetail = useCallback(() => {
    navigateTo('detail');
  }, [navigateTo]);

  return {
    currentView: state.currentView,
    previousView: state.previousView,
    navigateTo,
    goBack,
    goToDashboard,
    goToSkills,
    goToSearch,
    goToRouting,
    goToUpdate,
    goToDetail,
  };
}

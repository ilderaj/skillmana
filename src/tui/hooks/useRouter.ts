/**
 * useRouter Hook
 * 路由配置管理
 */

import { useCallback } from 'react';
import { useTUI } from '../store/context.js';
import type { RoutingLevel } from '../store/types.js';
import { configManager } from '../../core/config.js';

export interface UseRouterReturn {
  routingLevel: RoutingLevel;
  setRoutingLevel: (level: RoutingLevel) => Promise<void>;
}

export function useRouter(): UseRouterReturn {
  const { state, dispatch } = useTUI();

  const setRoutingLevel = useCallback(async (level: RoutingLevel) => {
    try {
      await configManager.set('routingLevel', level);
      dispatch({ type: 'SET_ROUTING_LEVEL', payload: level });
    } catch (error) {
      dispatch({
        type: 'SET_ERROR',
        payload: error instanceof Error ? error.message : 'Failed to update routing level',
      });
    }
  }, [dispatch]);

  return {
    routingLevel: state.routingLevel,
    setRoutingLevel,
  };
}

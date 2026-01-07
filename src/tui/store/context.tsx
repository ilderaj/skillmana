/**
 * TUI Context Provider
 * React Context 状态管理
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useStdout } from 'ink';
import type { TUIState, TUIAction, ViewType } from './types.js';
import { initialState } from './types.js';
import { tuiReducer } from './reducer.js';

interface TUIContextValue {
  state: TUIState;
  dispatch: React.Dispatch<TUIAction>;
}

const TUIContext = createContext<TUIContextValue | null>(null);

interface TUIProviderProps {
  children: React.ReactNode;
  initialView?: string;
}

export const TUIProvider: React.FC<TUIProviderProps> = ({ 
  children, 
  initialView = 'dashboard' 
}) => {
  const { stdout } = useStdout();
  
  const [state, dispatch] = useReducer(tuiReducer, {
    ...initialState,
    currentView: initialView as ViewType,
  });

  // 监听终端尺寸变化
  useEffect(() => {
    const updateSize = () => {
      dispatch({
        type: 'SET_TERMINAL_SIZE',
        payload: {
          width: stdout?.columns || 80,
          height: stdout?.rows || 24,
        },
      });
    };

    updateSize();
    stdout?.on('resize', updateSize);

    return () => {
      stdout?.off('resize', updateSize);
    };
  }, [stdout]);

  return (
    <TUIContext.Provider value={{ state, dispatch }}>
      {children}
    </TUIContext.Provider>
  );
};

export function useTUI(): TUIContextValue {
  const context = useContext(TUIContext);
  if (!context) {
    throw new Error('useTUI must be used within a TUIProvider');
  }
  return context;
}

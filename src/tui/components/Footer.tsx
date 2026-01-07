/**
 * Footer Component
 * 底部快捷键提示
 */

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../utils/theme.js';
import { useTUI } from '../store/context.js';

interface ShortcutItem {
  key: string;
  label: string;
}

export const Footer: React.FC = () => {
  const { state } = useTUI();

  const getShortcuts = (): ShortcutItem[] => {
    switch (state.currentView) {
      case 'dashboard':
        return [
          { key: '1-4', label: 'Quick Actions' },
          { key: 'Tab', label: 'Navigate' },
          { key: '?', label: 'Help' },
        ];
      case 'skills':
        return [
          { key: '↑↓', label: 'Navigate' },
          { key: 'Enter', label: 'View' },
          { key: '/', label: 'Search' },
          { key: 'Esc', label: 'Back' },
        ];
      case 'search':
        return [
          { key: '↑↓', label: 'Navigate' },
          { key: 'Enter', label: 'Select' },
          { key: 'Esc', label: 'Back' },
        ];
      case 'routing':
        return [
          { key: '←→', label: 'Change Level' },
          { key: 'Enter', label: 'Test' },
          { key: 's', label: 'Save' },
          { key: 'Esc', label: 'Back' },
        ];
      case 'detail':
        return [
          { key: 'e', label: 'Enable/Disable' },
          { key: 'd', label: 'Delete' },
          { key: 'o', label: 'Open' },
          { key: 'Esc', label: 'Back' },
        ];
      case 'update':
        return [
          { key: 'Space', label: 'Toggle' },
          { key: 'a', label: 'Select All' },
          { key: 'Enter', label: 'Install' },
          { key: 'Esc', label: 'Back' },
        ];
      default:
        return [];
    }
  };

  const shortcuts = getShortcuts();

  return (
    <Box 
      borderStyle="single" 
      borderColor={theme.colors.border}
      paddingX={1}
    >
      {shortcuts.map((shortcut, index) => (
        <Box key={shortcut.key} marginRight={2}>
          <Text color={theme.colors.primary}>[{shortcut.key}]</Text>
          <Text color={theme.colors.muted}> {shortcut.label}</Text>
          {index < shortcuts.length - 1 && <Text color={theme.colors.border}> </Text>}
        </Box>
      ))}
    </Box>
  );
};

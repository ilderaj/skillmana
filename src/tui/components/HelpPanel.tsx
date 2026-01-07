/**
 * HelpPanel Component
 * 帮助面板
 */

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../utils/theme.js';

interface ShortcutGroup {
  title: string;
  shortcuts: Array<{ key: string; description: string }>;
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: 'Global',
    shortcuts: [
      { key: 'q / Ctrl+C', description: 'Quit' },
      { key: '?', description: 'Show help' },
      { key: 'Esc', description: 'Go back / Close' },
      { key: 'Tab', description: 'Switch panel' },
    ],
  },
  {
    title: 'Navigation',
    shortcuts: [
      { key: '↑ / k', description: 'Move up' },
      { key: '↓ / j', description: 'Move down' },
      { key: 'g', description: 'Go to top' },
      { key: 'G', description: 'Go to bottom' },
    ],
  },
  {
    title: 'Actions',
    shortcuts: [
      { key: 'Enter', description: 'Confirm / View details' },
      { key: '/', description: 'Search' },
      { key: 'e', description: 'Enable / Disable' },
      { key: 'd', description: 'Delete' },
      { key: 'r', description: 'Refresh' },
    ],
  },
  {
    title: 'Dashboard',
    shortcuts: [
      { key: '1', description: 'Browse Skills' },
      { key: '2', description: 'Search' },
      { key: '3', description: 'Routing Config' },
      { key: '4', description: 'Update Official' },
    ],
  },
];

export const HelpPanel: React.FC = () => {
  return (
    <Box
      flexDirection="column"
      borderStyle="double"
      borderColor={theme.colors.primary}
      paddingX={2}
      paddingY={1}
    >
      <Text color={theme.colors.primary} bold>
        {theme.icons.dashboard} SkillMana Help
      </Text>
      
      <Box marginTop={1} flexDirection="row" flexWrap="wrap">
        {SHORTCUT_GROUPS.map((group) => (
          <Box key={group.title} flexDirection="column" marginRight={4} marginBottom={1}>
            <Text color={theme.colors.secondary} bold underline>
              {group.title}
            </Text>
            {group.shortcuts.map((shortcut) => (
              <Box key={shortcut.key}>
                <Text color={theme.colors.primary}>
                  {shortcut.key.padEnd(12)}
                </Text>
                <Text color={theme.colors.muted}>{shortcut.description}</Text>
              </Box>
            ))}
          </Box>
        ))}
      </Box>
      
      <Box marginTop={1}>
        <Text color={theme.colors.muted}>
          Press [Esc] to close
        </Text>
      </Box>
    </Box>
  );
};

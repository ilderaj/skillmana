/**
 * Header Component
 * 顶部导航栏
 */

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../utils/theme.js';
import { useTUI } from '../store/context.js';

const VERSION = '1.0.2';

export const Header: React.FC = () => {
  const { state } = useTUI();
  
  const getViewTitle = () => {
    switch (state.currentView) {
      case 'dashboard':
        return `${theme.icons.dashboard} SkillMana v${VERSION}`;
      case 'skills':
        return `${theme.icons.skill} Skills Browser`;
      case 'search':
        return `${theme.icons.search} Search Skills`;
      case 'routing':
        return `${theme.icons.settings} Routing Configuration`;
      case 'detail':
        return `${theme.icons.skill} Skill Details`;
      case 'update':
        return `${theme.icons.update} Update Skills`;
      default:
        return 'SkillMana';
    }
  };

  return (
    <Box 
      borderStyle="single" 
      borderColor={theme.colors.primary}
      paddingX={1}
      justifyContent="space-between"
    >
      <Text color={theme.colors.primary} bold>
        {getViewTitle()}
      </Text>
      <Text color={theme.colors.muted}>
        [q]uit [?]help
      </Text>
    </Box>
  );
};

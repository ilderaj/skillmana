/**
 * SkillsBrowser View
 * Skills 浏览器视图
 */

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../utils/theme.js';
import { SkillList } from '../components/SkillList.js';
import { Preview } from '../components/Preview.js';
import { useTUI } from '../store/context.js';

export const SkillsBrowser: React.FC = () => {
  const { state } = useTUI();
  const { skills, selectedSkillIndex, selectedSkill, filter } = state;

  // 应用筛选
  const filteredSkills = skills.filter(skill => {
    if (filter.source === 'official' && skill.source !== 'anthropic') {
      return false;
    }
    if (filter.source === 'custom' && skill.source === 'anthropic') {
      return false;
    }
    if (filter.category && skill.category !== filter.category) {
      return false;
    }
    return true;
  });

  return (
    <Box flexDirection="column" paddingX={1}>
      {/* 筛选栏 */}
      <Box marginBottom={1}>
        <Text color={theme.colors.muted}>
          Filter: <Text color={theme.colors.primary}>{filter.source}</Text>
          {' | '}
          Category: <Text color={theme.colors.primary}>{filter.category || 'All'}</Text>
        </Text>
      </Box>
      
      {/* 主内容区 */}
      <Box flexDirection="row">
        {/* 左侧列表 */}
        <Box width="50%" borderStyle="single" borderColor={theme.colors.border} paddingX={1}>
          <SkillList 
            skills={filteredSkills}
            selectedIndex={selectedSkillIndex}
          />
        </Box>
        
        {/* 右侧预览 */}
        <Box width="50%" borderStyle="single" borderColor={theme.colors.border}>
          <Preview skill={selectedSkill} />
        </Box>
      </Box>
    </Box>
  );
};

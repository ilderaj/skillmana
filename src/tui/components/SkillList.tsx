/**
 * SkillList Component
 * Skills 列表
 */

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../utils/theme.js';
import { truncate } from '../utils/formatting.js';
import type { SkillEntry } from '../store/types.js';

interface SkillListProps {
  skills: SkillEntry[];
  selectedIndex: number;
  maxHeight?: number;
}

export const SkillList: React.FC<SkillListProps> = ({
  skills,
  selectedIndex,
  maxHeight = 15,
}) => {
  // 计算可见范围
  const halfHeight = Math.floor(maxHeight / 2);
  let startIndex = Math.max(0, selectedIndex - halfHeight);
  const endIndex = Math.min(skills.length, startIndex + maxHeight);
  
  if (endIndex - startIndex < maxHeight && skills.length >= maxHeight) {
    startIndex = Math.max(0, endIndex - maxHeight);
  }

  const visibleSkills = skills.slice(startIndex, endIndex);

  if (skills.length === 0) {
    return (
      <Box paddingY={1}>
        <Text color={theme.colors.muted}>No skills found</Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column">
      <Text color={theme.colors.muted} dimColor>
        Skills ({skills.length})
      </Text>
      <Text color={theme.colors.border}>{'─'.repeat(40)}</Text>
      {visibleSkills.map((skill, index) => {
        const actualIndex = startIndex + index;
        const isSelected = actualIndex === selectedIndex;
        const sourceLabel = skill.source === 'anthropic' ? 'official' : 'custom';

        return (
          <Box key={skill.name}>
            <Text color={isSelected ? theme.colors.primary : undefined}>
              {isSelected ? theme.icons.arrow : ' '} {truncate(skill.name, 25)}
            </Text>
            <Text color={theme.colors.muted}> [{sourceLabel}]</Text>
          </Box>
        );
      })}
      {skills.length > maxHeight && (
        <Text color={theme.colors.muted} dimColor>
          {startIndex > 0 ? '↑ more above ' : ''}
          {endIndex < skills.length ? '↓ more below' : ''}
        </Text>
      )}
    </Box>
  );
};

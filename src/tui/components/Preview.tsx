/**
 * Preview Component
 * Skill 预览面板
 */

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../utils/theme.js';
import { truncate } from '../utils/formatting.js';
import type { SkillEntry } from '../store/types.js';

interface PreviewProps {
  skill: SkillEntry | null;
}

export const Preview: React.FC<PreviewProps> = ({ skill }) => {
  if (!skill) {
    return (
      <Box flexDirection="column" paddingX={1}>
        <Text color={theme.colors.muted}>Preview</Text>
        <Text color={theme.colors.border}>{'─'.repeat(28)}</Text>
        <Text color={theme.colors.muted} dimColor>
          Select a skill to preview
        </Text>
      </Box>
    );
  }

  return (
    <Box flexDirection="column" paddingX={1}>
      <Text color={theme.colors.muted}>Preview</Text>
      <Text color={theme.colors.border}>{'─'.repeat(28)}</Text>
      
      <Text color={theme.colors.primary} bold>
        # {skill.name}
      </Text>
      
      <Box marginTop={1}>
        <Text color={theme.colors.muted}>
          {truncate(skill.description || 'No description', 100)}
        </Text>
      </Box>
      
      <Box marginTop={1} flexDirection="column">
        <Text>
          <Text bold>Domain: </Text>
          <Text color={theme.colors.secondary}>{skill.domain || 'general'}</Text>
        </Text>
        <Text>
          <Text bold>Category: </Text>
          <Text color={theme.colors.secondary}>{skill.category}</Text>
        </Text>
        {skill.triggers && skill.triggers.length > 0 && (
          <Box flexDirection="column">
            <Text bold>Triggers:</Text>
            {skill.triggers.slice(0, 3).map((trigger, i) => (
              <Text key={i} color={theme.colors.muted}>
                - {truncate(trigger, 20)}
              </Text>
            ))}
            {skill.triggers.length > 3 && (
              <Text color={theme.colors.muted} dimColor>
                ...and {skill.triggers.length - 3} more
              </Text>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
};

/**
 * UpdateView View
 * 更新管理视图
 */

import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { theme } from '../utils/theme.js';
import { useTUI } from '../store/context.js';

export const UpdateView: React.FC = () => {
  const { state } = useTUI();
  const { skills, isLoading } = state;

  const officialSkills = skills.filter(s => s.source === 'anthropic');

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Text bold>Available Updates:</Text>
      <Text color={theme.colors.border}>{'─'.repeat(16)}</Text>
      
      {isLoading ? (
        <Box marginTop={1}>
          <Text color={theme.colors.primary}>
            <Spinner type="dots" /> Checking for updates...
          </Text>
        </Box>
      ) : (
        <Box marginTop={1} flexDirection="column">
          {officialSkills.length === 0 ? (
            <Text color={theme.colors.muted}>
              No official skills installed. Run update to download.
            </Text>
          ) : (
            <>
              {officialSkills.slice(0, 10).map((skill) => (
                <Box key={skill.name}>
                  <Text color={theme.colors.muted}>[✓] </Text>
                  <Text>{skill.name}</Text>
                  <Text color={theme.colors.success}> (up to date)</Text>
                </Box>
              ))}
              {officialSkills.length > 10 && (
                <Text color={theme.colors.muted} dimColor>
                  ...and {officialSkills.length - 10} more
                </Text>
              )}
            </>
          )}
        </Box>
      )}
      
      {/* 分隔线 */}
      <Box marginTop={1}>
        <Text color={theme.colors.border}>
          {'─'.repeat(70)}
        </Text>
      </Box>
      
      {/* 新技能 */}
      <Box marginTop={1} flexDirection="column">
        <Text bold>New Skills Available:</Text>
        <Box marginTop={1}>
          <Text color={theme.colors.muted}>
            Press [r] to refresh and check for new skills
          </Text>
        </Box>
      </Box>
      
      {/* 操作说明 */}
      <Box marginTop={2} flexDirection="column">
        <Text color={theme.colors.muted}>
          [Space] Toggle selection  [a] Select all  [Enter] Install  [r] Refresh
        </Text>
      </Box>
    </Box>
  );
};

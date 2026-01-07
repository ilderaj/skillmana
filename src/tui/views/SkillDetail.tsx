/**
 * SkillDetail View
 * Skill 详情视图
 */

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../utils/theme.js';
import { useTUI } from '../store/context.js';

export const SkillDetail: React.FC = () => {
  const { state } = useTUI();
  const { selectedSkill: skill } = state;

  if (!skill) {
    return (
      <Box paddingX={2} paddingY={1}>
        <Text color={theme.colors.error}>No skill selected</Text>
      </Box>
    );
  }

  const sourceLabel = skill.source === 'anthropic' ? 'anthropic (official)' : skill.source;

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* 基本信息 */}
      <Box 
        flexDirection="column"
        borderStyle="single"
        borderColor={theme.colors.border}
        paddingX={2}
        paddingY={1}
      >
        <Box><Text bold>Name:        </Text><Text>{skill.name}</Text></Box>
        <Box><Text bold>Source:      </Text><Text color={theme.colors.secondary}>{sourceLabel}</Text></Box>
        <Box><Text bold>Category:    </Text><Text>{skill.category}</Text></Box>
        <Box><Text bold>Domain:      </Text><Text>{skill.domain || 'general'}</Text></Box>
        <Box><Text bold>Is Core:     </Text><Text>{skill.isCore ? 'Yes' : 'No'}</Text></Box>
        <Box><Text bold>Path:        </Text><Text color={theme.colors.muted}>{skill.path}</Text></Box>
      </Box>
      
      {/* 描述 */}
      <Box marginTop={1} flexDirection="column">
        <Text bold underline>Description:</Text>
        <Box marginTop={1}>
          <Text>{skill.description || 'No description available'}</Text>
        </Box>
      </Box>
      
      {/* 触发词 */}
      {skill.triggers && skill.triggers.length > 0 && (
        <Box marginTop={1} flexDirection="column">
          <Text bold underline>Triggers:</Text>
          <Box marginTop={1} flexWrap="wrap">
            {skill.triggers.map((trigger, index) => (
              <Box key={index} marginRight={2}>
                <Text color={theme.colors.muted}>• {trigger}</Text>
              </Box>
            ))}
          </Box>
        </Box>
      )}
      
      {/* 元数据 */}
      {skill.metadata && (
        <Box marginTop={1} flexDirection="column">
          <Text bold underline>Metadata:</Text>
          <Box marginTop={1} flexDirection="column">
            {skill.metadata.version && (
              <Text color={theme.colors.muted}>Version: {skill.metadata.version}</Text>
            )}
            {skill.metadata.author && (
              <Text color={theme.colors.muted}>Author: {skill.metadata.author}</Text>
            )}
            {skill.metadata.tokens && (
              <Text color={theme.colors.muted}>Tokens: ~{skill.metadata.tokens}</Text>
            )}
          </Box>
        </Box>
      )}
    </Box>
  );
};

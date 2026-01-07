/**
 * Dashboard View
 * 主入口仪表盘视图
 */

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../utils/theme.js';
import { StatsBox } from '../components/StatsBox.js';
import { useTUI } from '../store/context.js';

export const Dashboard: React.FC = () => {
  const { state } = useTUI();
  const { skills } = state;

  // 统计数据
  const totalSkills = skills.length;
  const officialSkills = skills.filter(s => s.source === 'anthropic').length;
  const customSkills = skills.filter(s => s.source !== 'anthropic').length;
  const coreSkills = skills.filter(s => s.isCore).length;

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Text color={theme.colors.primary} bold>
        {theme.icons.stats} Dashboard
      </Text>
      
      {/* 统计卡片 */}
      <Box marginTop={1} flexDirection="row" gap={1}>
        <StatsBox label="Total Skills" value={totalSkills} />
        <StatsBox label="Anthropic" value={officialSkills} color={theme.colors.success} />
        <StatsBox label="Custom" value={customSkills} color={theme.colors.secondary} />
      </Box>
      
      <Box marginTop={1} flexDirection="row" gap={1}>
        <StatsBox label="Core Skills" value={coreSkills} color={theme.colors.warning} />
        <StatsBox label="Routing Level" value={state.routingLevel} />
      </Box>
      
      {/* 分隔线 */}
      <Box marginTop={1}>
        <Text color={theme.colors.border}>
          {'─'.repeat(70)}
        </Text>
      </Box>
      
      {/* 快捷操作 */}
      <Box marginTop={1} flexDirection="column">
        <Text bold>Quick Actions:</Text>
        <Box marginTop={1} flexDirection="row" flexWrap="wrap">
          <Box width="33%">
            <Text color={theme.colors.primary}>[1]</Text>
            <Text> {theme.icons.skill} Browse Skills</Text>
          </Box>
          <Box width="33%">
            <Text color={theme.colors.primary}>[2]</Text>
            <Text> {theme.icons.search} Search</Text>
          </Box>
          <Box width="33%">
            <Text color={theme.colors.primary}>[3]</Text>
            <Text> {theme.icons.settings} Routing Config</Text>
          </Box>
        </Box>
        <Box marginTop={1} flexDirection="row" flexWrap="wrap">
          <Box width="33%">
            <Text color={theme.colors.primary}>[4]</Text>
            <Text> {theme.icons.update} Update Official</Text>
          </Box>
          <Box width="33%">
            <Text color={theme.colors.primary}>[5]</Text>
            <Text> {theme.icons.add} Add Skill</Text>
          </Box>
          <Box width="33%">
            <Text color={theme.colors.primary}>[6]</Text>
            <Text> {theme.icons.doctor} Doctor</Text>
          </Box>
        </Box>
      </Box>
      
      {/* 分隔线 */}
      <Box marginTop={1}>
        <Text color={theme.colors.border}>
          {'─'.repeat(70)}
        </Text>
      </Box>
      
      {/* 最近活动 */}
      <Box marginTop={1} flexDirection="column">
        <Text bold>Recent Activity:</Text>
        <Text color={theme.colors.muted}>
          • {totalSkills} skills available
        </Text>
        <Text color={theme.colors.muted}>
          • Ready to manage your Cursor skills
        </Text>
      </Box>
    </Box>
  );
};

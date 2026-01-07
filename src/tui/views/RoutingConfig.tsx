/**
 * RoutingConfig View
 * 路由配置视图
 */

import React, { useState } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { theme } from '../utils/theme.js';
import { useTUI } from '../store/context.js';
import type { RoutingLevel } from '../store/types.js';

const ROUTING_LEVELS: Array<{ level: RoutingLevel; description: string; max: number }> = [
  { level: 'core', description: 'Only core skills - minimal tokens', max: 1 },
  { level: 'auto', description: 'Adaptive selection based on complexity (default)', max: 3 },
  { level: 'full', description: 'Full skills for maximum capability', max: 5 },
];

export const RoutingConfig: React.FC = () => {
  const { state } = useTUI();
  const [testQuery, setTestQuery] = useState('');

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Text bold>Current Settings:</Text>
      <Text color={theme.colors.border}>{'─'.repeat(16)}</Text>
      
      {/* 路由级别选择 */}
      <Box marginTop={1} flexDirection="column">
        <Text>Routing Level:</Text>
        <Box marginTop={1} flexDirection="row">
          {ROUTING_LEVELS.map(({ level }) => (
            <Box key={level} marginRight={2}>
              <Text color={state.routingLevel === level ? theme.colors.primary : theme.colors.muted}>
                [{state.routingLevel === level ? '●' : '○'}] {level}
              </Text>
            </Box>
          ))}
        </Box>
      </Box>
      
      {/* 级别说明 */}
      <Box 
        marginTop={1} 
        flexDirection="column"
        borderStyle="single"
        borderColor={theme.colors.border}
        paddingX={1}
      >
        <Text bold>Level Descriptions:</Text>
        {ROUTING_LEVELS.map(({ level, description, max }) => (
          <Box key={level}>
            <Text color={state.routingLevel === level ? theme.colors.primary : undefined}>
              {level.padEnd(6)} │ L{ROUTING_LEVELS.findIndex(l => l.level === level) + 1}: {description} (max {max})
              {level === 'auto' ? ' ← default' : ''}
            </Text>
          </Box>
        ))}
      </Box>
      
      {/* 分隔线 */}
      <Box marginTop={1}>
        <Text color={theme.colors.border}>
          {'─'.repeat(70)}
        </Text>
      </Box>
      
      {/* 测试路由 */}
      <Box marginTop={1} flexDirection="column">
        <Text bold>Test Routing:</Text>
        <Box 
          marginTop={1}
          borderStyle="single"
          borderColor={theme.colors.border}
          paddingX={1}
        >
          <Text>Enter query: </Text>
          <TextInput
            value={testQuery}
            onChange={setTestQuery}
            placeholder="e.g., Build a React form with Stripe payment"
          />
        </Box>
        
        {testQuery && (
          <Box marginTop={1}>
            <Text color={theme.colors.muted}>
              Press [Enter] to test routing with this query
            </Text>
          </Box>
        )}
      </Box>
      
      {/* 快捷键说明 */}
      <Box marginTop={2}>
        <Text color={theme.colors.muted}>
          Use [←][→] or [1][2][3] to change level
        </Text>
      </Box>
    </Box>
  );
};

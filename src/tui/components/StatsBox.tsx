/**
 * StatsBox Component
 * 统计卡片
 */

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../utils/theme.js';

interface StatsBoxProps {
  label: string;
  value: string | number;
  color?: string;
  width?: number;
}

export const StatsBox: React.FC<StatsBoxProps> = ({
  label,
  value,
  color = theme.colors.primary,
  width = 17,
}) => {
  return (
    <Box 
      borderStyle="round" 
      borderColor={theme.colors.border}
      flexDirection="column"
      alignItems="center"
      paddingX={1}
      width={width}
    >
      <Text color={theme.colors.muted}>{label}</Text>
      <Text color={color} bold>
        {value}
      </Text>
    </Box>
  );
};

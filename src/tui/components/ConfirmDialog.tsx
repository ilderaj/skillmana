/**
 * ConfirmDialog Component
 * 确认对话框
 */

import React from 'react';
import { Box, Text } from 'ink';
import { theme } from '../utils/theme.js';

interface ConfirmDialogProps {
  title: string;
  message: string;
  type?: 'confirm' | 'help' | 'info';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  title,
  message,
  type = 'confirm',
}) => {
  return (
    <Box
      flexDirection="column"
      borderStyle="double"
      borderColor={type === 'confirm' ? theme.colors.warning : theme.colors.primary}
      paddingX={2}
      paddingY={1}
    >
      <Text color={theme.colors.primary} bold>
        {title}
      </Text>
      <Box marginTop={1}>
        <Text>{message}</Text>
      </Box>
      <Box marginTop={1}>
        {type === 'confirm' ? (
          <Text color={theme.colors.muted}>
            Press [y] to confirm, [n] or [Esc] to cancel
          </Text>
        ) : (
          <Text color={theme.colors.muted}>
            Press [Esc] to close
          </Text>
        )}
      </Box>
    </Box>
  );
};

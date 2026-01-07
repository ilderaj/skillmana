/**
 * UpdateView View
 * 更新管理视图
 */

import React, { useEffect } from 'react';
import { Box, Text, useInput } from 'ink';
import Spinner from 'ink-spinner';
import { theme } from '../utils/theme.js';
import { useUpdate } from '../hooks/useUpdate.js';

export const UpdateView: React.FC = () => {
  const {
    updates,
    isChecking,
    isInstalling,
    installProgress,
    installResults,
    error,
    checkForUpdates,
    installAll,
  } = useUpdate();

  // 初始化时检查更新
  useEffect(() => {
    checkForUpdates();
  }, [checkForUpdates]);

  // 键盘处理
  useInput((input, key) => {
    if (isChecking || isInstalling) return;

    if (input === 'r' || input === 'R') {
      checkForUpdates();
    } else if (key.return) {
      const notInstalled = updates.filter(u => !u.isInstalled);
      if (notInstalled.length > 0) {
        installAll(false);
      }
    } else if (input === 'f' || input === 'F') {
      installAll(true);
    }
  });

  const installed = updates.filter(u => u.isInstalled);
  const notInstalled = updates.filter(u => !u.isInstalled);
  const successResults = installResults.filter(r => r.success);
  const failedResults = installResults.filter(r => !r.success);

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      <Text bold>🔄 Anthropic Official Skills</Text>
      <Text color={theme.colors.border}>{'─'.repeat(40)}</Text>
      
      {/* 状态提示 */}
      {isChecking && (
        <Box marginTop={1}>
          <Text color={theme.colors.primary}>
            <Spinner type="dots" /> Checking for updates...
          </Text>
        </Box>
      )}

      {isInstalling && installProgress && (
        <Box marginTop={1}>
          <Text color={theme.colors.primary}>
            <Spinner type="dots" /> Installing {installProgress.skillName} ({installProgress.current}/{installProgress.total})...
          </Text>
        </Box>
      )}

      {error && (
        <Box marginTop={1}>
          <Text color={theme.colors.error}>✖ {error}</Text>
        </Box>
      )}

      {/* 安装结果 */}
      {installResults.length > 0 && !isInstalling && (
        <Box marginTop={1} flexDirection="column">
          {successResults.length > 0 && (
            <Text color={theme.colors.success}>
              ✓ {successResults.length} skills installed successfully
            </Text>
          )}
          {failedResults.length > 0 && (
            <Text color={theme.colors.error}>
              ✖ {failedResults.length} skills failed to install
            </Text>
          )}
        </Box>
      )}

      {/* 已安装列表 */}
      {!isChecking && (
        <Box marginTop={1} flexDirection="column">
          <Text bold color={theme.colors.success}>Installed ({installed.length}):</Text>
          <Box flexDirection="column" marginLeft={2}>
            {installed.length === 0 ? (
              <Text color={theme.colors.muted}>No official skills installed</Text>
            ) : (
              installed.slice(0, 8).map((skill) => (
                <Box key={skill.skillName}>
                  <Text color={theme.colors.success}>✓ </Text>
                  <Text>{skill.skillName}</Text>
                </Box>
              ))
            )}
            {installed.length > 8 && (
              <Text color={theme.colors.muted} dimColor>
                ...and {installed.length - 8} more
              </Text>
            )}
          </Box>
        </Box>
      )}

      {/* 未安装列表 */}
      {!isChecking && notInstalled.length > 0 && (
        <Box marginTop={1} flexDirection="column">
          <Text bold color={theme.colors.warning}>Available to Install ({notInstalled.length}):</Text>
          <Box flexDirection="column" marginLeft={2}>
            {notInstalled.slice(0, 8).map((skill) => (
              <Box key={skill.skillName}>
                <Text color={theme.colors.warning}>○ </Text>
                <Text>{skill.skillName}</Text>
              </Box>
            ))}
            {notInstalled.length > 8 && (
              <Text color={theme.colors.muted} dimColor>
                ...and {notInstalled.length - 8} more
              </Text>
            )}
          </Box>
        </Box>
      )}

      {/* 分隔线 */}
      <Box marginTop={1}>
        <Text color={theme.colors.border}>
          {'─'.repeat(70)}
        </Text>
      </Box>
      
      {/* 操作说明 */}
      <Box marginTop={1} flexDirection="column">
        <Text color={theme.colors.muted}>
          [r] Refresh   [Enter] Install new   [f] Force reinstall all   [Esc] Back
        </Text>
      </Box>
    </Box>
  );
};

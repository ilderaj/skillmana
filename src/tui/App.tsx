/**
 * TUI App Component
 * 主应用组件
 */

import React from 'react';
import { Box, Text } from 'ink';
import Spinner from 'ink-spinner';
import { TUIProvider, useTUI } from './store/context.js';
import { useKeyboard } from './hooks/useKeyboard.js';
import { useSkills } from './hooks/useSkills.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import { HelpPanel } from './components/HelpPanel.js';
import { ConfirmDialog } from './components/ConfirmDialog.js';
import { Dashboard } from './views/Dashboard.js';
import { SkillsBrowser } from './views/SkillsBrowser.js';
import { Search } from './views/Search.js';
import { RoutingConfig } from './views/RoutingConfig.js';
import { SkillDetail } from './views/SkillDetail.js';
import { UpdateView } from './views/UpdateView.js';
import type { ViewType } from './store/types.js';

interface AppContentProps {
  // 空接口，未来可扩展
}

const AppContent: React.FC<AppContentProps> = () => {
  const { state } = useTUI();
  
  // 加载 Skills 数据
  const { isLoading, error } = useSkills();
  
  // 启用键盘导航
  useKeyboard({ enabled: true });

  const renderView = () => {
    switch (state.currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'skills':
        return <SkillsBrowser />;
      case 'search':
        return <Search />;
      case 'routing':
        return <RoutingConfig />;
      case 'detail':
        return <SkillDetail />;
      case 'update':
        return <UpdateView />;
      default:
        return <Dashboard />;
    }
  };

  const renderDialog = () => {
    if (!state.dialog) return null;
    
    if (state.dialog.type === 'help') {
      return (
        <Box position="absolute" marginTop={2} marginLeft={2}>
          <HelpPanel />
        </Box>
      );
    }
    
    return (
      <Box position="absolute" marginTop={5} marginLeft={10}>
        <ConfirmDialog
          title={state.dialog.title}
          message={state.dialog.message}
          type={state.dialog.type}
        />
      </Box>
    );
  };

  // 显示加载状态
  if (isLoading && state.skills.length === 0) {
    return (
      <Box flexDirection="column" minHeight={20}>
        <Header />
        <Box flexGrow={1} justifyContent="center" alignItems="center">
          <Text color="cyan">
            <Spinner type="dots" /> Loading skills...
          </Text>
        </Box>
        <Footer />
      </Box>
    );
  }

  // 显示错误
  if (error) {
    return (
      <Box flexDirection="column" minHeight={20}>
        <Header />
        <Box flexGrow={1} justifyContent="center" alignItems="center">
          <Text color="red">Error: {error}</Text>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box flexDirection="column" minHeight={20}>
      <Header />
      <Box flexGrow={1} flexDirection="column">
        {renderView()}
      </Box>
      <Footer />
      {renderDialog()}
    </Box>
  );
};

interface AppProps {
  initialView?: ViewType;
}

export const App: React.FC<AppProps> = ({ initialView = 'dashboard' }) => {
  return (
    <TUIProvider initialView={initialView}>
      <AppContent />
    </TUIProvider>
  );
};

/**
 * Search View
 * 搜索视图
 */

import React, { useState, useEffect } from 'react';
import { Box, Text } from 'ink';
import TextInput from 'ink-text-input';
import { theme } from '../utils/theme.js';
import { truncate } from '../utils/formatting.js';
import { useTUI } from '../store/context.js';

export const Search: React.FC = () => {
  const { state, dispatch } = useTUI();
  const [query, setQuery] = useState(state.searchQuery);
  
  // 搜索逻辑
  useEffect(() => {
    dispatch({ type: 'SET_SEARCH_QUERY', payload: query });
    
    if (!query.trim()) {
      dispatch({ type: 'SET_SEARCH_RESULTS', payload: [] });
      return;
    }
    
    const lowerQuery = query.toLowerCase();
    const results = state.skills.filter(skill => {
      const nameMatch = skill.name.toLowerCase().includes(lowerQuery);
      const descMatch = skill.description?.toLowerCase().includes(lowerQuery);
      const triggerMatch = skill.triggers?.some(t => 
        t.toLowerCase().includes(lowerQuery)
      );
      return nameMatch || descMatch || triggerMatch;
    });
    
    dispatch({ type: 'SET_SEARCH_RESULTS', payload: results });
  }, [query, state.skills, dispatch]);

  const results = state.searchResults;

  return (
    <Box flexDirection="column" paddingX={2} paddingY={1}>
      {/* 搜索输入 */}
      <Box marginBottom={1}>
        <Text color={theme.colors.primary}>Search: </Text>
        <TextInput 
          value={query}
          onChange={setQuery}
          placeholder="Type to search..."
        />
      </Box>
      
      {/* 分隔线 */}
      <Text color={theme.colors.border}>
        {'─'.repeat(70)}
      </Text>
      
      {/* 搜索结果 */}
      <Box marginTop={1} flexDirection="column">
        <Text color={theme.colors.muted}>
          Results ({results.length} matches):
        </Text>
        
        {results.length === 0 && query.trim() && (
          <Box marginTop={1}>
            <Text color={theme.colors.muted} dimColor>
              No skills found matching "{query}"
            </Text>
          </Box>
        )}
        
        {results.slice(0, 10).map((skill, index) => {
          const isSelected = index === state.selectedSkillIndex;
          const sourceLabel = skill.source === 'anthropic' ? 'official' : 'custom';
          
          return (
            <Box 
              key={skill.name}
              flexDirection="column"
              marginTop={1}
              paddingLeft={1}
              borderStyle={isSelected ? 'single' : undefined}
              borderColor={isSelected ? theme.colors.primary : undefined}
            >
              <Box>
                <Text color={isSelected ? theme.colors.primary : undefined} bold>
                  {isSelected ? theme.icons.arrow : ' '} {skill.name}
                </Text>
                <Text color={theme.colors.muted}> [{sourceLabel}]</Text>
              </Box>
              <Text color={theme.colors.muted}>
                {truncate(skill.description || 'No description', 60)}
              </Text>
              {skill.triggers && skill.triggers.length > 0 && (
                <Text color={theme.colors.muted} dimColor>
                  Triggers: {skill.triggers.slice(0, 3).join(', ')}
                </Text>
              )}
            </Box>
          );
        })}
        
        {results.length > 10 && (
          <Box marginTop={1}>
            <Text color={theme.colors.muted} dimColor>
              ...and {results.length - 10} more results
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

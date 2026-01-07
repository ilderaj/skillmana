/**
 * useUpdate Hook
 * Anthropic Skills 更新管理
 */

import { useState, useCallback } from 'react';
import { useTUI } from '../store/context.js';
import { anthropicDownloader } from '../../core/anthropic.js';
import type { UpdateInfo, DownloadResult } from '../../core/anthropic.js';

export interface UseUpdateReturn {
  /** 可用更新列表 */
  updates: UpdateInfo[];
  /** 是否正在检查 */
  isChecking: boolean;
  /** 是否正在安装 */
  isInstalling: boolean;
  /** 当前安装进度 */
  installProgress: { current: number; total: number; skillName: string } | null;
  /** 安装结果 */
  installResults: DownloadResult[];
  /** 错误信息 */
  error: string | null;
  /** 检查更新 */
  checkForUpdates: () => Promise<void>;
  /** 安装所有未安装的 skills */
  installAll: (force?: boolean) => Promise<void>;
  /** 安装单个 skill */
  installSkill: (skillName: string, force?: boolean) => Promise<void>;
}

export function useUpdate(): UseUpdateReturn {
  const { dispatch } = useTUI();
  const [updates, setUpdates] = useState<UpdateInfo[]>([]);
  const [isChecking, setIsChecking] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);
  const [installProgress, setInstallProgress] = useState<{ current: number; total: number; skillName: string } | null>(null);
  const [installResults, setInstallResults] = useState<DownloadResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const checkForUpdates = useCallback(async () => {
    setIsChecking(true);
    setError(null);
    
    try {
      const updateInfo = await anthropicDownloader.checkForUpdates();
      setUpdates(updateInfo);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to check for updates';
      setError(message);
    } finally {
      setIsChecking(false);
    }
  }, []);

  const installSkill = useCallback(async (skillName: string, force = false) => {
    setIsInstalling(true);
    setError(null);
    setInstallProgress({ current: 1, total: 1, skillName });
    
    try {
      const result = await anthropicDownloader.downloadSkill(skillName, force);
      setInstallResults([result]);
      
      if (!result.success) {
        setError(result.error || 'Installation failed');
      } else {
        // 刷新 skills 列表
        dispatch({ type: 'SET_LOADING', payload: true });
        const { registry } = await import('../../core/registry.js');
        const skills = await registry.listSkills();
        dispatch({ type: 'SET_SKILLS', payload: skills });
        dispatch({ type: 'SET_LOADING', payload: false });
        
        // 更新状态
        await checkForUpdates();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Installation failed';
      setError(message);
    } finally {
      setIsInstalling(false);
      setInstallProgress(null);
    }
  }, [checkForUpdates, dispatch]);

  const installAll = useCallback(async (force = false) => {
    const toInstall = force 
      ? updates.map(u => u.skillName)
      : updates.filter(u => !u.isInstalled).map(u => u.skillName);
    
    if (toInstall.length === 0) {
      return;
    }

    setIsInstalling(true);
    setError(null);
    setInstallResults([]);
    
    const results: DownloadResult[] = [];
    
    try {
      for (let i = 0; i < toInstall.length; i++) {
        const skillName = toInstall[i];
        setInstallProgress({ current: i + 1, total: toInstall.length, skillName });
        
        const result = await anthropicDownloader.downloadSkill(skillName, force);
        results.push(result);
      }
      
      setInstallResults(results);
      
      // 检查是否有失败
      const failed = results.filter(r => !r.success);
      if (failed.length > 0) {
        setError(`${failed.length} of ${results.length} skills failed to install`);
      }
      
      // 刷新 skills 列表
      dispatch({ type: 'SET_LOADING', payload: true });
      const { registry } = await import('../../core/registry.js');
      const skills = await registry.listSkills();
      dispatch({ type: 'SET_SKILLS', payload: skills });
      dispatch({ type: 'SET_LOADING', payload: false });
      
      // 更新状态
      await checkForUpdates();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Installation failed';
      setError(message);
    } finally {
      setIsInstalling(false);
      setInstallProgress(null);
    }
  }, [updates, checkForUpdates, dispatch]);

  return {
    updates,
    isChecking,
    isInstalling,
    installProgress,
    installResults,
    error,
    checkForUpdates,
    installAll,
    installSkill,
  };
}

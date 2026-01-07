# Spec: E4-S2 自动安装与更新命令

## Overview

**Story ID**: E4-S2  
**Spec Version**: 1.0  
**Created**: 2026-01-07

## Objective

实现 `skillmana update` 命令，支持自动安装和更新 Anthropic 官方 Skills。

---

## Technical Specification

### 1. Update Command

```bash
# 更新所有官方 skills
skillmana update

# 强制更新（即使已是最新）
skillmana update --force

# 只检查更新，不下载
skillmana update --check

# 更新特定 skill
skillmana update frontend-design

# 列出可用的官方 skills
skillmana update --list
```

### 2. Command Options

```typescript
interface UpdateOptions {
  force?: boolean;      // 强制更新
  check?: boolean;      // 只检查
  list?: boolean;       // 列出可用
  verbose?: boolean;    // 详细输出
}
```

### 3. Update Flow

1. **Check for Updates**
   - 比较本地版本与远程版本
   - 显示需要更新的 skills

2. **User Confirmation**
   - 显示将要更新的 skills
   - 询问用户确认（除非 --force）

3. **Download & Install**
   - 下载新版本
   - 备份旧版本（可选）
   - 安装新版本

4. **Update Registry**
   - 更新 skills 注册表
   - 记录更新时间

### 4. Output Format

```
🔄 Checking for Anthropic skills updates...

  Available Updates:
  ┌─────────────────────┬──────────┬──────────┐
  │ Skill               │ Current  │ Latest   │
  ├─────────────────────┼──────────┼──────────┤
  │ frontend-design     │ 1.0.0    │ 1.1.0    │
  │ webapp-testing      │ --       │ 1.0.0    │ (new)
  │ mcp-builder         │ 1.0.0    │ 1.0.0    │ (up to date)
  └─────────────────────┴──────────┴──────────┘

  2 updates available, 1 new skill

? Proceed with update? (Y/n)

📥 Downloading frontend-design... done
📥 Downloading webapp-testing... done

✅ Successfully updated 2 skills
```

---

## Implementation

### File: `src/commands/update.ts`

Update command implementation.

---

## Acceptance Criteria

### AC1: Check Updates
- [ ] 显示可用更新列表
- [ ] 区分新增和更新

### AC2: Download Updates
- [ ] 下载并安装更新
- [ ] 显示进度

### AC3: Force Update
- [ ] --force 跳过确认
- [ ] 强制重新下载

### AC4: Error Handling
- [ ] 网络错误处理
- [ ] 部分更新失败处理

---

## Test Cases

### TC1: Check Updates
```typescript
it('should list available updates', async () => {
  const updates = await checkForUpdates();
  expect(updates).toBeDefined();
});
```

### TC2: Download Updates
```typescript
it('should download and install updates', async () => {
  const result = await updateSkills(['frontend-design']);
  expect(result.success).toBe(true);
});
```

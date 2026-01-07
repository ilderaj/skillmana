/**
 * TUI Formatting Utilities
 * 格式化工具函数
 */

/**
 * 截断文本到指定长度
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

/**
 * 左对齐填充
 */
export function padLeft(text: string, length: number, char = ' '): string {
  return text.padStart(length, char);
}

/**
 * 右对齐填充
 */
export function padRight(text: string, length: number, char = ' '): string {
  return text.padEnd(length, char);
}

/**
 * 居中对齐
 */
export function center(text: string, length: number, char = ' '): string {
  const padding = Math.max(0, length - text.length);
  const leftPad = Math.floor(padding / 2);
  const rightPad = padding - leftPad;
  return char.repeat(leftPad) + text + char.repeat(rightPad);
}

/**
 * 格式化时间为相对时间
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minutes ago`;
  if (diffHours < 24) return `${diffHours} hours ago`;
  if (diffDays < 7) return `${diffDays} days ago`;
  return date.toLocaleDateString();
}

/**
 * 格式化数字为带单位的字符串
 */
export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return num.toString();
}

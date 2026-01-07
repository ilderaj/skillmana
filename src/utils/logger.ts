/**
 * SkillMana Logger Utility
 */

import chalk from 'chalk';
import ora, { type Ora } from 'ora';
import boxen from 'boxen';

// ============================================================================
// Types
// ============================================================================

type LogLevel = 'info' | 'success' | 'warning' | 'error' | 'debug';

interface LoggerOptions {
  verbose?: boolean;
  color?: boolean;
}

// ============================================================================
// Logger Class
// ============================================================================

class Logger {
  private verbose: boolean;
  private color: boolean;
  private spinner: Ora | null = null;

  constructor(options: LoggerOptions = {}) {
    this.verbose = options.verbose ?? false;
    this.color = options.color ?? true;
  }

  /**
   * Set verbose mode
   */
  setVerbose(verbose: boolean): void {
    this.verbose = verbose;
  }

  /**
   * Set color mode
   */
  setColor(color: boolean): void {
    this.color = color;
  }

  /**
   * Format message with color
   */
  private format(message: string, level: LogLevel): string {
    if (!this.color) return message;

    switch (level) {
      case 'info':
        return chalk.blue(message);
      case 'success':
        return chalk.green(message);
      case 'warning':
        return chalk.yellow(message);
      case 'error':
        return chalk.red(message);
      case 'debug':
        return chalk.gray(message);
      default:
        return message;
    }
  }

  /**
   * Get prefix for log level
   */
  private getPrefix(level: LogLevel): string {
    if (!this.color) {
      switch (level) {
        case 'info':
          return 'ℹ';
        case 'success':
          return '✓';
        case 'warning':
          return '⚠';
        case 'error':
          return '✗';
        case 'debug':
          return '🔍';
        default:
          return '';
      }
    }

    switch (level) {
      case 'info':
        return chalk.blue('ℹ');
      case 'success':
        return chalk.green('✓');
      case 'warning':
        return chalk.yellow('⚠');
      case 'error':
        return chalk.red('✗');
      case 'debug':
        return chalk.gray('🔍');
      default:
        return '';
    }
  }

  /**
   * Log info message
   */
  info(message: string): void {
    console.log(`${this.getPrefix('info')} ${message}`);
  }

  /**
   * Log success message
   */
  success(message: string): void {
    console.log(`${this.getPrefix('success')} ${this.format(message, 'success')}`);
  }

  /**
   * Log warning message
   */
  warn(message: string): void {
    console.log(`${this.getPrefix('warning')} ${this.format(message, 'warning')}`);
  }

  /**
   * Log error message
   */
  error(message: string): void {
    console.error(`${this.getPrefix('error')} ${this.format(message, 'error')}`);
  }

  /**
   * Log debug message (only in verbose mode)
   */
  debug(message: string): void {
    if (this.verbose) {
      console.log(`${this.getPrefix('debug')} ${this.format(message, 'debug')}`);
    }
  }

  /**
   * Log plain message
   */
  log(message: string): void {
    console.log(message);
  }

  /**
   * Log empty line
   */
  newLine(): void {
    console.log('');
  }

  /**
   * Start a spinner
   */
  startSpinner(text: string): Ora {
    this.spinner = ora({
      text,
      color: 'cyan',
    }).start();
    return this.spinner;
  }

  /**
   * Stop spinner with success
   */
  spinnerSuccess(text?: string): void {
    if (this.spinner) {
      this.spinner.succeed(text);
      this.spinner = null;
    }
  }

  /**
   * Stop spinner with failure
   */
  spinnerFail(text?: string): void {
    if (this.spinner) {
      this.spinner.fail(text);
      this.spinner = null;
    }
  }

  /**
   * Stop spinner with warning
   */
  spinnerWarn(text?: string): void {
    if (this.spinner) {
      this.spinner.warn(text);
      this.spinner = null;
    }
  }

  /**
   * Stop spinner
   */
  stopSpinner(): void {
    if (this.spinner) {
      this.spinner.stop();
      this.spinner = null;
    }
  }

  /**
   * Display a box with content
   */
  box(content: string, title?: string): void {
    const options: boxen.Options = {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
    };

    if (title) {
      options.title = title;
      options.titleAlignment = 'center';
    }

    console.log(boxen(content, options));
  }

  /**
   * Display a header
   */
  header(text: string): void {
    const line = '─'.repeat(text.length + 4);
    console.log('');
    console.log(this.color ? chalk.cyan(line) : line);
    console.log(this.color ? chalk.cyan.bold(`  ${text}  `) : `  ${text}  `);
    console.log(this.color ? chalk.cyan(line) : line);
    console.log('');
  }

  /**
   * Display a list
   */
  list(items: string[], bullet = '•'): void {
    items.forEach((item) => {
      console.log(`  ${this.color ? chalk.cyan(bullet) : bullet} ${item}`);
    });
  }

  /**
   * Display a key-value pair
   */
  keyValue(key: string, value: string): void {
    const formattedKey = this.color ? chalk.gray(key + ':') : key + ':';
    console.log(`  ${formattedKey} ${value}`);
  }

  /**
   * Display a table
   */
  table(headers: string[], rows: string[][]): void {
    // Calculate column widths
    const colWidths = headers.map((h, i) => {
      const maxRowWidth = Math.max(...rows.map((r) => (r[i] || '').length));
      return Math.max(h.length, maxRowWidth);
    });

    // Print header
    const headerLine = headers
      .map((h, i) => h.padEnd(colWidths[i]))
      .join('  ');
    console.log(this.color ? chalk.bold(headerLine) : headerLine);

    // Print separator
    const separator = colWidths.map((w) => '─'.repeat(w)).join('──');
    console.log(this.color ? chalk.gray(separator) : separator);

    // Print rows
    rows.forEach((row) => {
      const line = row.map((cell, i) => (cell || '').padEnd(colWidths[i])).join('  ');
      console.log(line);
    });
  }
}

// ============================================================================
// Export
// ============================================================================

/**
 * Default logger instance
 */
export const logger = new Logger();

/**
 * Create a new logger instance
 */
export function createLogger(options?: LoggerOptions): Logger {
  return new Logger(options);
}

export { Logger };

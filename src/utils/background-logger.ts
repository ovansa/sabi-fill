// ==================== utils/background-logger.ts ====================

export class BackgroundLogger {
  private static readonly PREFIX = '[SharpFilla Background]';

  static info(message: string, ...args: unknown[]): void {
    console.log(`${this.PREFIX} ${message}`, ...args);
  }

  static error(message: string, error?: unknown): void {
    console.error(`${this.PREFIX} ${message}`, error);
  }

  static warn(message: string, ...args: unknown[]): void {
    console.warn(`${this.PREFIX} ${message}`, ...args);
  }

  static debug(message: string, ...args: unknown[]): void {
    console.debug(`${this.PREFIX} ${message}`, ...args);
  }
}

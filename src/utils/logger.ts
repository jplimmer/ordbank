/**
 * Supported log levels.
 */
type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'silent';

/**
 * Interface defining methods for a basic logger.
 */
interface Logger {
  trace: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  error: (message: string, ...args: unknown[]) => void;
  setLevel: (level: LogLevel) => void;
}

/**
 * A simple environment-aware logger that logs messages to the console with timestamps.
 * Logging can be filtered by severity using `setLevel()`.
 */
class SimpleLogger implements Logger {
  private static levels: Record<LogLevel, number> = {
    trace: 0,
    debug: 1,
    info: 2,
    warn: 3,
    error: 4,
    silent: 5,
  };

  private currentLevel: number;
  private environment: 'server' | 'client';

  constructor(level?: LogLevel) {
    // Detect environment
    this.environment = typeof window === 'undefined' ? 'server' : 'client';

    // Set default levels based on environment and NODE_ENV
    const defaultLevel = this.getDefaultLevel(level);
    this.currentLevel = SimpleLogger.levels[defaultLevel];
  }

  private getDefaultLevel(explicitLevel?: LogLevel): LogLevel {
    if (explicitLevel) return explicitLevel;

    const isProduction = process.env.NODE_ENV === 'production';

    if (this.environment === 'server') {
      return isProduction ? 'warn' : 'debug';
    } else {
      return isProduction ? 'error' : 'info';
    }
  }

  setLevel(level: LogLevel): void {
    if (!(level in SimpleLogger.levels)) {
      console.error(`Invalid log level: ${level}`);
    }
    this.currentLevel = SimpleLogger.levels[level];
  }

  private log(level: LogLevel, message: string, ...args: unknown[]): void {
    // Don't log if message level is below set log level
    if (SimpleLogger.levels[level] < this.currentLevel) {
      return;
    }

    // Format timestamp
    const timestamp =
      new Date().toLocaleTimeString('en-GB', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }) +
      '.' +
      String(new Date().getMilliseconds()).padStart(3, '0');

    const envPrefix = this.environment === 'server' ? 'SERVER' : 'CLIENT';
    const prefix = `[${envPrefix}] [${timestamp}] [${level.toUpperCase()}]`;

    // Use appropriate console method
    const method =
      level === 'error'
        ? 'error'
        : level === 'warn'
          ? 'warn'
          : level === 'info'
            ? 'info'
            : 'log';

    console[method](prefix, message, ...args);
  }

  // Public logging methods
  trace(message: string, ...args: unknown[]): void {
    this.log('trace', message, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    this.log('debug', message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log('info', message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log('warn', message, ...args);
  }

  error(message: string, ...args: unknown[]): void {
    this.log('error', message, ...args);
  }
}

// Create single shared instance of logger
// const level = 'debug';
// const logger = new SimpleLogger(level as LogLevel);

// Create separate logger instances for server and client
const serverLogger = new SimpleLogger();
const clientLogger = new SimpleLogger();

/**
 * Returns the shared instance of the logger depending on environment.
 */
export function getLogger(): Logger {
  //   return logger;
  return typeof window === 'undefined' ? serverLogger : clientLogger;
}

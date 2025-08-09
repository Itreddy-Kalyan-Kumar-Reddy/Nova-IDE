import { injectable } from 'inversify';
import { ILogger } from '../types/core.types';

/**
 * Logger service implementation
 * Provides structured logging with different levels
 */
@injectable()
export class Logger implements ILogger {
  private readonly context: string;

  constructor(context: string = 'Nova-IDE') {
    this.context = context;
  }

  debug(message: string, ...args: unknown[]): void {
    this.log('DEBUG', message, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    this.log('INFO', message, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    this.log('WARN', message, ...args);
  }

  error(message: string, error?: Error, ...args: unknown[]): void {
    if (error) {
      this.log('ERROR', message, error.message, error.stack, ...args);
    } else {
      this.log('ERROR', message, ...args);
    }
  }

  private log(level: string, message: string, ...args: unknown[]): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] [${this.context}] ${message}`;
    
    switch (level) {
      case 'DEBUG':
        console.debug(logMessage, ...args);
        break;
      case 'INFO':
        console.info(logMessage, ...args);
        break;
      case 'WARN':
        console.warn(logMessage, ...args);
        break;
      case 'ERROR':
        console.error(logMessage, ...args);
        break;
      default:
        console.log(logMessage, ...args);
    }
  }

  /**
   * Create a child logger with a specific context
   */
  createChild(context: string): Logger {
    return new Logger(`${this.context}:${context}`);
  }
}
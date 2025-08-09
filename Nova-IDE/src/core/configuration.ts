import { injectable, inject } from 'inversify';
import { promises as fs } from 'fs';
import { join } from 'path';
import { IConfigurationService, ILogger, IEventBus, TYPES } from '../types/core.types';

/**
 * Configuration service implementation
 * Manages application settings with persistence and change notifications
 */
@injectable()
export class ConfigurationService implements IConfigurationService {
  private config: Record<string, unknown> = {};
  private configPath: string;
  private initialized = false;

  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.EventBus) private eventBus: IEventBus
  ) {
    this.configPath = join(process.cwd(), 'config.json');
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await this.loadConfig();
      this.initialized = true;
      this.logger.info('Configuration service initialized');
    } catch (error) {
      this.logger.warn('Failed to load configuration, using defaults', error);
      this.config = this.getDefaultConfig();
      this.initialized = true;
    }
  }

  get<T>(key: string): T | undefined {
    return this.getNestedValue(this.config, key) as T | undefined;
  }

  async set<T>(key: string, value: T): Promise<void> {
    const oldValue = this.get(key);
    this.setNestedValue(this.config, key, value);
    
    try {
      await this.saveConfig();
      this.eventBus.emit('configuration.changed', { key, value, oldValue });
      this.logger.debug(`Configuration updated: ${key}`);
    } catch (error) {
      // Rollback on save failure
      if (oldValue !== undefined) {
        this.setNestedValue(this.config, key, oldValue);
      } else {
        this.deleteNestedValue(this.config, key);
      }
      this.logger.error('Failed to save configuration', error as Error);
      throw error;
    }
  }

  has(key: string): boolean {
    return this.getNestedValue(this.config, key) !== undefined;
  }

  getAll(): Record<string, unknown> {
    return { ...this.config };
  }

  private async loadConfig(): Promise<void> {
    try {
      const data = await fs.readFile(this.configPath, 'utf-8');
      this.config = JSON.parse(data);
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        this.config = this.getDefaultConfig();
        await this.saveConfig();
      } else {
        throw error;
      }
    }
  }

  private async saveConfig(): Promise<void> {
    const data = JSON.stringify(this.config, null, 2);
    await fs.writeFile(this.configPath, data, 'utf-8');
  }

  private getDefaultConfig(): Record<string, unknown> {
    return {
      ai: {
        defaultProvider: 'openrouter',
        providers: {
          openrouter: {
            apiKey: '',
            baseUrl: 'https://openrouter.ai/api/v1',
            defaultModel: 'deepseek/deepseek-coder'
          },
          ollama: {
            baseUrl: 'http://localhost:11434',
            defaultModel: 'codellama'
          }
        }
      },
      ui: {
        theme: 'dark',
        fontSize: 14,
        fontFamily: 'Monaco, Consolas, monospace'
      },
      workspace: {
        autoSave: true,
        autoSaveDelay: 1000
      },
      extensions: {
        autoUpdate: true,
        allowUnsigned: false
      }
    };
  }

  private getNestedValue(obj: Record<string, unknown>, key: string): unknown {
    const keys = key.split('.');
    let current = obj;
    
    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k] as Record<string, unknown>;
      } else {
        return undefined;
      }
    }
    
    return current;
  }

  private setNestedValue(obj: Record<string, unknown>, key: string, value: unknown): void {
    const keys = key.split('.');
    const lastKey = keys.pop()!;
    let current = obj;
    
    for (const k of keys) {
      if (!(k in current) || typeof current[k] !== 'object') {
        current[k] = {};
      }
      current = current[k] as Record<string, unknown>;
    }
    
    current[lastKey] = value;
  }

  private deleteNestedValue(obj: Record<string, unknown>, key: string): void {
    const keys = key.split('.');
    const lastKey = keys.pop()!;
    let current = obj;
    
    for (const k of keys) {
      if (!(k in current) || typeof current[k] !== 'object') {
        return;
      }
      current = current[k] as Record<string, unknown>;
    }
    
    delete current[lastKey];
  }
}
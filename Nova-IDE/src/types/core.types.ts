// Core system types and interfaces

export interface IService {
  readonly name: string;
  initialize(): Promise<void>;
  dispose(): Promise<void>;
}

export interface ILogger {
  debug(message: string, ...args: unknown[]): void;
  info(message: string, ...args: unknown[]): void;
  warn(message: string, ...args: unknown[]): void;
  error(message: string, error?: Error, ...args: unknown[]): void;
}

export interface IEventBus {
  emit<T = unknown>(event: string, data: T): void;
  on<T = unknown>(event: string, handler: (data: T) => void): void;
  off(event: string, handler: Function): void;
  once<T = unknown>(event: string, handler: (data: T) => void): void;
}

export interface IConfigurationService {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): Promise<void>;
  has(key: string): boolean;
  getAll(): Record<string, unknown>;
}

export interface IWorkspaceService {
  readonly workspacePath: string | undefined;
  openWorkspace(path: string): Promise<void>;
  closeWorkspace(): Promise<void>;
  getWorkspaceFiles(): Promise<string[]>;
  watchWorkspace(callback: (event: WorkspaceEvent) => void): void;
}

export interface WorkspaceEvent {
  type: 'file-added' | 'file-changed' | 'file-deleted' | 'folder-added' | 'folder-deleted';
  path: string;
  timestamp: Date;
}

export interface IDependencyContainer {
  register<T>(identifier: string | symbol, implementation: new (...args: any[]) => T): void;
  registerSingleton<T>(identifier: string | symbol, implementation: new (...args: any[]) => T): void;
  registerInstance<T>(identifier: string | symbol, instance: T): void;
  resolve<T>(identifier: string | symbol): T;
  isRegistered(identifier: string | symbol): boolean;
}

export const TYPES = {
  // Core services
  Logger: Symbol.for('Logger'),
  EventBus: Symbol.for('EventBus'),
  ConfigurationService: Symbol.for('ConfigurationService'),
  WorkspaceService: Symbol.for('WorkspaceService'),
  
  // AI services
  AIModelGateway: Symbol.for('AIModelGateway'),
  AgentOrchestrator: Symbol.for('AgentOrchestrator'),
  
  // UI services
  UIManager: Symbol.for('UIManager'),
  EditorService: Symbol.for('EditorService'),
  
  // Tool services
  ToolManager: Symbol.for('ToolManager'),
  ExtensionManager: Symbol.for('ExtensionManager'),
} as const;
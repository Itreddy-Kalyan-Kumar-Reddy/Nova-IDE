// Tool and extension system types

export interface ITool {
  readonly name: string;
  readonly description: string;
  readonly parameters: ToolParameters;
  execute(params: Record<string, unknown>): Promise<ToolResult>;
}

export interface ToolParameters {
  type: 'object';
  properties: Record<string, ParameterDefinition>;
  required?: string[];
}

export interface ParameterDefinition {
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  enum?: string[];
  default?: unknown;
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface IToolManager {
  registerTool(tool: ITool): void;
  unregisterTool(name: string): void;
  getTool(name: string): ITool | undefined;
  listTools(): ITool[];
  executeTool(name: string, params: Record<string, unknown>): Promise<ToolResult>;
}

export interface IExtension {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly description: string;
  readonly author: string;
  activate(context: ExtensionContext): Promise<void>;
  deactivate(): Promise<void>;
}

export interface ExtensionContext {
  extensionPath: string;
  globalState: ExtensionState;
  workspaceState: ExtensionState;
  subscriptions: Disposable[];
  registerCommand(command: string, handler: (...args: unknown[]) => unknown): void;
  registerTool(tool: ITool): void;
}

export interface ExtensionState {
  get<T>(key: string): T | undefined;
  set<T>(key: string, value: T): Promise<void>;
  keys(): readonly string[];
}

export interface Disposable {
  dispose(): void;
}

export interface IExtensionManager {
  loadExtension(path: string): Promise<void>;
  unloadExtension(id: string): Promise<void>;
  getExtension(id: string): IExtension | undefined;
  listExtensions(): IExtension[];
  isExtensionActive(id: string): boolean;
  activateExtension(id: string): Promise<void>;
  deactivateExtension(id: string): Promise<void>;
}

export interface ExtensionManifest {
  id: string;
  name: string;
  version: string;
  description: string;
  author: string;
  main: string;
  engines: {
    'nova-ide': string;
  };
  categories?: string[];
  keywords?: string[];
  contributes?: {
    commands?: CommandContribution[];
    tools?: ToolContribution[];
    themes?: ThemeContribution[];
  };
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
}

export interface CommandContribution {
  command: string;
  title: string;
  category?: string;
  icon?: string;
}

export interface ToolContribution {
  name: string;
  description: string;
  parameters: ToolParameters;
}

export interface ThemeContribution {
  id: string;
  label: string;
  path: string;
}
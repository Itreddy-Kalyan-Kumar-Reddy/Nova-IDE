// Agent system types and interfaces

export interface IAgent {
  readonly id: string;
  readonly name: string;
  readonly capabilities: AgentCapabilities;
  executeTask(task: Task): Promise<TaskResult>;
  getStatus(): AgentStatus;
}

export interface AgentCapabilities {
  canCode: boolean;
  canAnalyze: boolean;
  canDebug: boolean;
  canReview: boolean;
  canPlan: boolean;
  supportedLanguages: string[];
  maxComplexity: ComplexityLevel;
}

export interface Task {
  id: string;
  type: TaskType;
  description: string;
  context: TaskContext;
  priority: Priority;
  requirements: string[];
}

export interface TaskResult {
  success: boolean;
  output?: string;
  files?: string[];
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface TaskContext {
  workspacePath?: string;
  currentFile?: string;
  selectedText?: string;
  cursorPosition?: Position;
  openFiles?: string[];
  gitBranch?: string;
}

export interface Position {
  line: number;
  column: number;
}

export type TaskType = 
  | 'code-generation'
  | 'code-analysis'
  | 'debugging'
  | 'code-review'
  | 'refactoring'
  | 'testing'
  | 'documentation'
  | 'planning';

export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export type ComplexityLevel = 'simple' | 'moderate' | 'complex' | 'expert';

export type AgentStatus = 'idle' | 'thinking' | 'planning' | 'executing' | 'error';

export interface IAgentOrchestrator {
  createAgent(type: string, config: AgentConfig): Promise<IAgent>;
  executeTask(task: Task): Promise<TaskResult>;
  orchestrateMultipleAgents(task: ComplexTask): Promise<TaskResult>;
  getAvailableAgents(): IAgent[];
}

export interface AgentConfig {
  name: string;
  modelProvider: string;
  modelName: string;
  capabilities: Partial<AgentCapabilities>;
  systemPrompt?: string;
}

export interface ComplexTask extends Task {
  subtasks: SubTask[];
  orchestrationStrategy: 'sequential' | 'parallel' | 'hybrid';
}

export interface SubTask {
  id: string;
  description: string;
  dependencies: string[];
  assignedAgent?: string;
}
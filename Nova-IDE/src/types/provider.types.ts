// AI provider types and interfaces

export interface IAIProvider {
  readonly name: string;
  readonly type: ProviderType;
  readonly capabilities: ModelCapabilities;
  sendMessage(request: ModelRequest): Promise<ModelResponse>;
  streamMessage(request: ModelRequest): AsyncIterableIterator<ModelChunk>;
  listModels(): Promise<ModelInfo[]>;
  estimateCost(request: ModelRequest): Promise<number>;
}

export interface ModelRequest {
  messages: ChatMessage[];
  model?: string;
  temperature?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: ToolDefinition[];
  systemPrompt?: string;
}

export interface ModelResponse {
  content: string;
  usage: TokenUsage;
  model: string;
  finishReason: 'stop' | 'length' | 'tool_calls' | 'error';
  toolCalls?: ToolCall[];
}

export interface ModelChunk {
  content: string;
  delta: string;
  usage?: TokenUsage;
  finishReason?: 'stop' | 'length' | 'tool_calls' | 'error';
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant' | 'tool';
  content: string;
  name?: string;
  toolCallId?: string;
}

export interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}

export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  contextWindow: number;
  costPerToken: number;
  capabilities: ModelCapabilities;
  available: boolean;
}

export interface ModelCapabilities {
  supportsStreaming: boolean;
  supportsFunctionCalling: boolean;
  supportsVision: boolean;
  supportsCodeGeneration: boolean;
  supportsReasoning: boolean;
  maxTokens: number;
  contextWindow: number;
}

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
}

export type ProviderType = 
  | 'openrouter'
  | 'openai'
  | 'anthropic'
  | 'ollama'
  | 'custom';

export interface IAIModelGateway {
  registerProvider(provider: IAIProvider): void;
  getProvider(name: string): IAIProvider | undefined;
  listProviders(): IAIProvider[];
  selectOptimalModel(task: ModelSelectionCriteria): Promise<ModelSelection>;
  sendMessage(request: ModelRequest, providerName?: string): Promise<ModelResponse>;
  streamMessage(request: ModelRequest, providerName?: string): AsyncIterableIterator<ModelChunk>;
}

export interface ModelSelectionCriteria {
  taskType: string;
  complexity: 'simple' | 'moderate' | 'complex' | 'expert';
  budget?: number;
  preferredProviders?: string[];
  requiredCapabilities?: Partial<ModelCapabilities>;
}

export interface ModelSelection {
  provider: IAIProvider;
  model: ModelInfo;
  confidence: number;
  reasoning: string;
}
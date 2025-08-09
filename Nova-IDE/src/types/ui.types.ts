// UI system types and interfaces

export interface IUIManager {
  initialize(): Promise<void>;
  createWindow(config: WindowConfig): Promise<IWindow>;
  getActiveWindow(): IWindow | undefined;
  getAllWindows(): IWindow[];
  showNotification(notification: Notification): void;
}

export interface IWindow {
  readonly id: string;
  readonly title: string;
  show(): void;
  hide(): void;
  close(): void;
  focus(): void;
  setTitle(title: string): void;
  loadContent(content: string | URL): Promise<void>;
  executeScript(script: string): Promise<unknown>;
}

export interface WindowConfig {
  title: string;
  width: number;
  height: number;
  minWidth?: number;
  minHeight?: number;
  resizable?: boolean;
  frame?: boolean;
  webPreferences?: {
    nodeIntegration?: boolean;
    contextIsolation?: boolean;
    enableRemoteModule?: boolean;
  };
}

export interface Notification {
  title: string;
  body: string;
  type: 'info' | 'warning' | 'error' | 'success';
  duration?: number;
  actions?: NotificationAction[];
}

export interface NotificationAction {
  label: string;
  action: () => void;
}



export interface IEditorService {
  openFile(path: string): Promise<void>;
  closeFile(path: string): Promise<void>;
  getOpenFiles(): string[];
  getCurrentFile(): string | undefined;
  getFileContent(path: string): Promise<string>;
  setFileContent(path: string, content: string): Promise<void>;
  insertText(text: string, position?: import('./agent.types').Position): Promise<void>;
  replaceText(range: Range, text: string): Promise<void>;
  getSelectedText(): string | undefined;
  getCursorPosition(): import('./agent.types').Position;
  setCursorPosition(position: import('./agent.types').Position): void;
  onFileChanged(callback: (path: string, content: string) => void): void;
  onSelectionChanged(callback: (selection: Selection) => void): void;
}

export interface Range {
  start: import('./agent.types').Position;
  end: import('./agent.types').Position;
}

export interface Selection {
  range: Range;
  text: string;
}

export interface IPanel {
  readonly id: string;
  readonly title: string;
  readonly visible: boolean;
  show(): void;
  hide(): void;
  toggle(): void;
  setContent(content: string): void;
  getContent(): string;
}

export interface UIChatMessage {
  id: string;
  content: string;
  timestamp: Date;
  sender: 'user' | 'assistant';
  metadata?: Record<string, unknown>;
}

export interface IChatPanel extends IPanel {
  sendMessage(message: string): Promise<void>;
  addMessage(message: UIChatMessage, sender: 'user' | 'assistant'): void;
  clearHistory(): void;
  getHistory(): UIChatMessage[];
  onMessageSent(callback: (message: string) => void): void;
}

export interface IAgentVisualizationPanel extends IPanel {
  showAgentState(state: AgentVisualizationState): void;
  showReasoningLoop(loop: ReasoningLoop): void;
  highlightCurrentStep(step: string): void;
}

export interface AgentVisualizationState {
  agentId: string;
  status: string;
  currentThought?: string;
  currentPlan?: string[];
  currentAction?: string;
  lastObservation?: string;
}

export interface ReasoningLoop {
  steps: ReasoningStep[];
  currentStep: number;
  decisions: Decision[];
}

export interface ReasoningStep {
  type: 'think' | 'plan' | 'act' | 'observe' | 'reflect';
  content: string;
  timestamp: Date;
  duration?: number;
}

export interface Decision {
  question: string;
  options: string[];
  selected: string;
  reasoning: string;
}
import 'reflect-metadata';
import { DependencyContainer } from './container';
import { Logger } from './logger';
import { EventBus } from './event-bus';
import { ConfigurationService } from './configuration';
import { WorkspaceService } from './workspace';
import { 
  ILogger, 
  IEventBus, 
  IConfigurationService, 
  IWorkspaceService,
  TYPES 
} from '../types/core.types';

/**
 * Main application class that orchestrates all services
 * Handles initialization, dependency injection, and lifecycle management
 */
export class NovaIDEApplication {
  private container: DependencyContainer;
  private initialized = false;

  constructor() {
    this.container = new DependencyContainer();
    this.setupDependencies();
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    try {
      const logger = this.container.resolve<ILogger>(TYPES.Logger);
      logger.info('Initializing Nova-IDE application...');

      // Initialize core services in order
      await this.initializeConfigurationService();
      await this.initializeWorkspaceService();

      // TODO: Initialize other services as they are implemented
      // - AI Model Gateway
      // - Agent Orchestrator
      // - UI Manager
      // - Tool Manager
      // - Extension Manager

      this.initialized = true;
      logger.info('Nova-IDE application initialized successfully');

      // Emit application ready event
      const eventBus = this.container.resolve<IEventBus>(TYPES.EventBus);
      eventBus.emit('application.ready', {});

    } catch (error) {
      const logger = this.container.resolve<ILogger>(TYPES.Logger);
      logger.error('Failed to initialize Nova-IDE application', error as Error);
      throw error;
    }
  }

  async dispose(): Promise<void> {
    if (!this.initialized) {
      return;
    }

    try {
      const logger = this.container.resolve<ILogger>(TYPES.Logger);
      logger.info('Disposing Nova-IDE application...');

      // Dispose services in reverse order
      const workspaceService = this.container.resolve<IWorkspaceService>(TYPES.WorkspaceService);
      await workspaceService.closeWorkspace();

      // TODO: Dispose other services as they are implemented

      this.initialized = false;
      logger.info('Nova-IDE application disposed successfully');

    } catch (error) {
      const logger = this.container.resolve<ILogger>(TYPES.Logger);
      logger.error('Error during application disposal', error as Error);
    }
  }

  /**
   * Get the dependency container for advanced operations
   */
  getContainer(): DependencyContainer {
    return this.container;
  }

  /**
   * Check if the application is initialized
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  private setupDependencies(): void {
    // Register core services
    this.container.registerSingleton<ILogger>(TYPES.Logger, Logger);
    this.container.registerSingleton<IEventBus>(TYPES.EventBus, EventBus);
    this.container.registerSingleton<IConfigurationService>(TYPES.ConfigurationService, ConfigurationService);
    this.container.registerSingleton<IWorkspaceService>(TYPES.WorkspaceService, WorkspaceService);

    // TODO: Register other services as they are implemented
    // this.container.registerSingleton<IAIModelGateway>(TYPES.AIModelGateway, AIModelGateway);
    // this.container.registerSingleton<IAgentOrchestrator>(TYPES.AgentOrchestrator, AgentOrchestrator);
    // this.container.registerSingleton<IUIManager>(TYPES.UIManager, UIManager);
    // this.container.registerSingleton<IToolManager>(TYPES.ToolManager, ToolManager);
    // this.container.registerSingleton<IExtensionManager>(TYPES.ExtensionManager, ExtensionManager);
  }

  private async initializeConfigurationService(): Promise<void> {
    const configService = this.container.resolve<IConfigurationService>(TYPES.ConfigurationService);
    if ('initialize' in configService && typeof configService.initialize === 'function') {
      await configService.initialize();
    }
  }

  private async initializeWorkspaceService(): Promise<void> {
    // Workspace service doesn't need explicit initialization
    // It will be initialized when a workspace is opened
  }
}
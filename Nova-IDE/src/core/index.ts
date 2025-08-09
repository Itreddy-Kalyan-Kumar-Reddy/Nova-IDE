/**
 * Core module exports
 * Provides access to all core Nova-IDE components
 */

export { NovaIDEApplication } from './application';
export { DependencyContainer } from './container';
export { Logger } from './logger';
export { EventBus } from './event-bus';
export { ConfigurationService } from './configuration';
export { WorkspaceService } from './workspace';

// Re-export types for convenience
export * from '../types/core.types';
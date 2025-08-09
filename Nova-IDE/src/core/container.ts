import 'reflect-metadata';
import { Container } from 'inversify';
import { IDependencyContainer } from '../types/core.types';

/**
 * Dependency injection container implementation using Inversify
 * Provides service registration and resolution for the Nova-IDE application
 */
export class DependencyContainer implements IDependencyContainer {
  private container: Container;

  constructor() {
    this.container = new Container({
      defaultScope: 'Transient',
      autoBindInjectable: true,
      skipBaseClassChecks: true,
    });
  }

  /**
   * Register a transient service (new instance each time)
   */
  register<T>(identifier: string | symbol, implementation: new (...args: any[]) => T): void {
    this.container.bind<T>(identifier).to(implementation as any);
  }

  /**
   * Register a singleton service (same instance each time)
   */
  registerSingleton<T>(identifier: string | symbol, implementation: new (...args: any[]) => T): void {
    this.container.bind<T>(identifier).to(implementation as any).inSingletonScope();
  }

  /**
   * Register a specific instance
   */
  registerInstance<T>(identifier: string | symbol, instance: T): void {
    this.container.bind<T>(identifier).toConstantValue(instance);
  }

  /**
   * Resolve a service by identifier
   */
  resolve<T>(identifier: string | symbol): T {
    return this.container.get<T>(identifier);
  }

  /**
   * Check if a service is registered
   */
  isRegistered(identifier: string | symbol): boolean {
    return this.container.isBound(identifier);
  }

  /**
   * Get the underlying Inversify container for advanced operations
   */
  getContainer(): Container {
    return this.container;
  }

  /**
   * Create a child container for scoped services
   */
  createChild(): DependencyContainer {
    const child = new DependencyContainer();
    child.container.parent = this.container;
    return child;
  }

  /**
   * Unbind a service
   */
  unbind(identifier: string | symbol): void {
    if (this.container.isBound(identifier)) {
      this.container.unbind(identifier);
    }
  }

  /**
   * Clear all bindings
   */
  clear(): void {
    this.container.unbindAll();
  }
}
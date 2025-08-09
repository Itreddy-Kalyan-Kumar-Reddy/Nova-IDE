import { injectable } from 'inversify';
import { EventEmitter } from 'eventemitter3';
import { IEventBus } from '../types/core.types';

/**
 * Event bus implementation using EventEmitter3
 * Provides decoupled communication between services
 */
@injectable()
export class EventBus implements IEventBus {
  private emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  emit<T = unknown>(event: string, data: T): void {
    this.emitter.emit(event, data);
  }

  on<T = unknown>(event: string, handler: (data: T) => void): void {
    this.emitter.on(event, handler);
  }

  off(event: string, handler: (...args: any[]) => void): void {
    this.emitter.off(event, handler);
  }

  once<T = unknown>(event: string, handler: (data: T) => void): void {
    this.emitter.once(event, handler);
  }

  /**
   * Remove all listeners for a specific event
   */
  removeAllListeners(event?: string): void {
    this.emitter.removeAllListeners(event);
  }

  /**
   * Get the number of listeners for an event
   */
  listenerCount(event: string): number {
    return this.emitter.listenerCount(event);
  }

  /**
   * Get all event names that have listeners
   */
  eventNames(): string[] {
    return this.emitter.eventNames() as string[];
  }

  /**
   * Set the maximum number of listeners for an event
   */
  setMaxListeners(_n: number): void {
    // EventEmitter3 doesn't have setMaxListeners, but we can implement it
    // by storing the limit and checking it when adding listeners
    // For now, we'll just ignore this as EventEmitter3 doesn't have this limitation
  }
}
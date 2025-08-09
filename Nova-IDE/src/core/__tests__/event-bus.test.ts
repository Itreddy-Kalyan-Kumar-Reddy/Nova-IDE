import { EventBus } from '../event-bus';

describe('EventBus', () => {
  let eventBus: EventBus;

  beforeEach(() => {
    eventBus = new EventBus();
  });

  describe('emit and on', () => {
    it('should emit and receive events', () => {
      const handler = jest.fn();
      const testData = { message: 'test' };

      eventBus.on('test-event', handler);
      eventBus.emit('test-event', testData);

      expect(handler).toHaveBeenCalledWith(testData);
      expect(handler).toHaveBeenCalledTimes(1);
    });

    it('should handle multiple listeners for the same event', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      const testData = { message: 'test' };

      eventBus.on('test-event', handler1);
      eventBus.on('test-event', handler2);
      eventBus.emit('test-event', testData);

      expect(handler1).toHaveBeenCalledWith(testData);
      expect(handler2).toHaveBeenCalledWith(testData);
    });
  });

  describe('once', () => {
    it('should only trigger handler once', () => {
      const handler = jest.fn();
      const testData = { message: 'test' };

      eventBus.once('test-event', handler);
      eventBus.emit('test-event', testData);
      eventBus.emit('test-event', testData);

      expect(handler).toHaveBeenCalledWith(testData);
      expect(handler).toHaveBeenCalledTimes(1);
    });
  });

  describe('off', () => {
    it('should remove event listener', () => {
      const handler = jest.fn();
      const testData = { message: 'test' };

      eventBus.on('test-event', handler);
      eventBus.off('test-event', handler);
      eventBus.emit('test-event', testData);

      expect(handler).not.toHaveBeenCalled();
    });

    it('should only remove the specific handler', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      const testData = { message: 'test' };

      eventBus.on('test-event', handler1);
      eventBus.on('test-event', handler2);
      eventBus.off('test-event', handler1);
      eventBus.emit('test-event', testData);

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).toHaveBeenCalledWith(testData);
    });
  });

  describe('removeAllListeners', () => {
    it('should remove all listeners for a specific event', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      const testData = { message: 'test' };

      eventBus.on('test-event', handler1);
      eventBus.on('test-event', handler2);
      eventBus.on('other-event', handler1);

      eventBus.removeAllListeners('test-event');
      eventBus.emit('test-event', testData);
      eventBus.emit('other-event', testData);

      expect(handler1).toHaveBeenCalledTimes(1); // Only from other-event
      expect(handler2).not.toHaveBeenCalled();
    });

    it('should remove all listeners when no event specified', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      const testData = { message: 'test' };

      eventBus.on('test-event', handler1);
      eventBus.on('other-event', handler2);

      eventBus.removeAllListeners();
      eventBus.emit('test-event', testData);
      eventBus.emit('other-event', testData);

      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('listenerCount', () => {
    it('should return correct listener count', () => {
      const handler1 = jest.fn();
      const handler2 = jest.fn();

      expect(eventBus.listenerCount('test-event')).toBe(0);

      eventBus.on('test-event', handler1);
      expect(eventBus.listenerCount('test-event')).toBe(1);

      eventBus.on('test-event', handler2);
      expect(eventBus.listenerCount('test-event')).toBe(2);

      eventBus.off('test-event', handler1);
      expect(eventBus.listenerCount('test-event')).toBe(1);
    });
  });

  describe('eventNames', () => {
    it('should return array of event names with listeners', () => {
      const handler = jest.fn();

      expect(eventBus.eventNames()).toEqual([]);

      eventBus.on('event1', handler);
      eventBus.on('event2', handler);

      const eventNames = eventBus.eventNames();
      expect(eventNames).toContain('event1');
      expect(eventNames).toContain('event2');
      expect(eventNames).toHaveLength(2);
    });
  });

  describe('setMaxListeners', () => {
    it('should set maximum listeners without throwing', () => {
      expect(() => eventBus.setMaxListeners(20)).not.toThrow();
    });
  });
});
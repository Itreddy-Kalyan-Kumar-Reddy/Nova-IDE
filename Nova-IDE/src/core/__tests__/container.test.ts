import { DependencyContainer } from '../container';

describe('DependencyContainer', () => {
  let container: DependencyContainer;

  beforeEach(() => {
    container = new DependencyContainer();
  });

  afterEach(() => {
    container.clear();
  });

  describe('register', () => {
    it('should register a transient service', () => {
      class TestService {
        getValue(): string {
          return 'test';
        }
      }

      const identifier = Symbol('TestService');
      container.register(identifier, TestService);

      expect(container.isRegistered(identifier)).toBe(true);

      const instance1 = container.resolve<TestService>(identifier);
      const instance2 = container.resolve<TestService>(identifier);

      expect(instance1).toBeInstanceOf(TestService);
      expect(instance2).toBeInstanceOf(TestService);
      expect(instance1).not.toBe(instance2); // Different instances for transient
    });
  });

  describe('registerSingleton', () => {
    it('should register a singleton service', () => {
      class TestService {
        getValue(): string {
          return 'test';
        }
      }

      const identifier = Symbol('TestService');
      container.registerSingleton(identifier, TestService);

      expect(container.isRegistered(identifier)).toBe(true);

      const instance1 = container.resolve<TestService>(identifier);
      const instance2 = container.resolve<TestService>(identifier);

      expect(instance1).toBeInstanceOf(TestService);
      expect(instance2).toBeInstanceOf(TestService);
      expect(instance1).toBe(instance2); // Same instance for singleton
    });
  });

  describe('registerInstance', () => {
    it('should register a specific instance', () => {
      const testInstance = { getValue: () => 'test' };
      const identifier = Symbol('TestService');

      container.registerInstance(identifier, testInstance);

      expect(container.isRegistered(identifier)).toBe(true);

      const resolved = container.resolve(identifier);
      expect(resolved).toBe(testInstance);
    });
  });

  describe('resolve', () => {
    it('should throw error when resolving unregistered service', () => {
      const identifier = Symbol('UnregisteredService');

      expect(() => container.resolve(identifier)).toThrow();
    });
  });

  describe('createChild', () => {
    it('should create a child container with access to parent services', () => {
      class ParentService {
        getValue(): string {
          return 'parent';
        }
      }

      const parentIdentifier = Symbol('ParentService');
      container.registerSingleton(parentIdentifier, ParentService);

      const child = container.createChild();

      // Child should have access to parent services
      const parentInstance = child.resolve<ParentService>(parentIdentifier);
      expect(parentInstance).toBeInstanceOf(ParentService);
      expect(parentInstance.getValue()).toBe('parent');
    });
  });

  describe('unbind', () => {
    it('should unbind a registered service', () => {
      class TestService {}
      const identifier = Symbol('TestService');

      container.register(identifier, TestService);
      expect(container.isRegistered(identifier)).toBe(true);

      container.unbind(identifier);
      expect(container.isRegistered(identifier)).toBe(false);
    });

    it('should not throw when unbinding unregistered service', () => {
      const identifier = Symbol('UnregisteredService');
      expect(() => container.unbind(identifier)).not.toThrow();
    });
  });

  describe('clear', () => {
    it('should clear all bindings', () => {
      class TestService1 {}
      class TestService2 {}

      const id1 = Symbol('TestService1');
      const id2 = Symbol('TestService2');

      container.register(id1, TestService1);
      container.register(id2, TestService2);

      expect(container.isRegistered(id1)).toBe(true);
      expect(container.isRegistered(id2)).toBe(true);

      container.clear();

      expect(container.isRegistered(id1)).toBe(false);
      expect(container.isRegistered(id2)).toBe(false);
    });
  });
});
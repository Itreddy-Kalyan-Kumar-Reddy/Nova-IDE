import { Logger } from '../logger';

describe('Logger', () => {
  let logger: Logger;
  let consoleSpy: jest.SpyInstance;

  beforeEach(() => {
    logger = new Logger('TestContext');
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'debug').mockImplementation();
    jest.spyOn(console, 'info').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
    jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  describe('debug', () => {
    it('should log debug messages', () => {
      const debugSpy = jest.spyOn(console, 'debug');
      logger.debug('Test debug message', { data: 'test' });

      expect(debugSpy).toHaveBeenCalledWith(
        expect.stringContaining('[DEBUG] [TestContext] Test debug message'),
        { data: 'test' }
      );
    });
  });

  describe('info', () => {
    it('should log info messages', () => {
      const infoSpy = jest.spyOn(console, 'info');
      logger.info('Test info message');

      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] [TestContext] Test info message')
      );
    });
  });

  describe('warn', () => {
    it('should log warning messages', () => {
      const warnSpy = jest.spyOn(console, 'warn');
      logger.warn('Test warning message');

      expect(warnSpy).toHaveBeenCalledWith(
        expect.stringContaining('[WARN] [TestContext] Test warning message')
      );
    });
  });

  describe('error', () => {
    it('should log error messages without error object', () => {
      const errorSpy = jest.spyOn(console, 'error');
      logger.error('Test error message');

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] [TestContext] Test error message')
      );
    });

    it('should log error messages with error object', () => {
      const errorSpy = jest.spyOn(console, 'error');
      const error = new Error('Test error');
      logger.error('Test error message', error);

      expect(errorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[ERROR] [TestContext] Test error message'),
        'Test error',
        expect.any(String) // Stack trace
      );
    });
  });

  describe('createChild', () => {
    it('should create a child logger with nested context', () => {
      const childLogger = logger.createChild('ChildContext');
      const infoSpy = jest.spyOn(console, 'info');

      childLogger.info('Child message');

      expect(infoSpy).toHaveBeenCalledWith(
        expect.stringContaining('[INFO] [TestContext:ChildContext] Child message')
      );
    });
  });

  describe('log formatting', () => {
    it('should include timestamp in log messages', () => {
      const infoSpy = jest.spyOn(console, 'info');
      logger.info('Test message');

      const logCall = infoSpy.mock.calls[0]?.[0];
      expect(logCall).toMatch(/^\[\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\]/);
    });

    it('should include context in log messages', () => {
      const infoSpy = jest.spyOn(console, 'info');
      logger.info('Test message');

      const logCall = infoSpy.mock.calls[0]?.[0];
      expect(logCall).toContain('[TestContext]');
    });
  });
});
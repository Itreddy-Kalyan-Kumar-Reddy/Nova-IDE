/**
 * Jest test setup file
 * Configures the testing environment for Nova-IDE
 */

import 'reflect-metadata';

// Mock Electron APIs for testing
const mockElectron = {
  app: {
    whenReady: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    quit: jest.fn(),
    setAsDefaultProtocolClient: jest.fn(),
  },
  BrowserWindow: jest.fn().mockImplementation(() => ({
    loadFile: jest.fn().mockResolvedValue(undefined),
    on: jest.fn(),
    once: jest.fn(),
    show: jest.fn(),
    webContents: {
      openDevTools: jest.fn(),
    },
  })),
  ipcMain: {
    on: jest.fn(),
    handle: jest.fn(),
  },
  ipcRenderer: {
    invoke: jest.fn(),
    on: jest.fn(),
    send: jest.fn(),
  },
};

// Mock Node.js modules that might not be available in test environment
jest.mock('electron', () => mockElectron);

jest.mock('chokidar', () => ({
  watch: jest.fn().mockReturnValue({
    on: jest.fn(),
    close: jest.fn().mockResolvedValue(undefined),
  }),
}));

// Global test utilities
(global as any).createMockLogger = () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  createChild: jest.fn().mockReturnThis(),
});

(global as any).createMockEventBus = () => ({
  emit: jest.fn(),
  on: jest.fn(),
  off: jest.fn(),
  once: jest.fn(),
  removeAllListeners: jest.fn(),
  listenerCount: jest.fn().mockReturnValue(0),
  eventNames: jest.fn().mockReturnValue([]),
  setMaxListeners: jest.fn(),
});

// Suppress console output during tests unless explicitly needed
const originalConsole = { ...console };
beforeEach(() => {
  if (!process.env['VERBOSE_TESTS']) {
    console.log = jest.fn();
    console.info = jest.fn();
    console.warn = jest.fn();
    console.error = jest.fn();
    console.debug = jest.fn();
  }
});

afterEach(() => {
  if (!process.env['VERBOSE_TESTS']) {
    Object.assign(console, originalConsole);
  }
  jest.clearAllMocks();
});
import { contextBridge, ipcRenderer } from 'electron';

/**
 * Preload script for secure IPC communication between main and renderer processes
 * Exposes a limited API to the renderer while maintaining security
 */

// Define the API that will be exposed to the renderer
const novaAPI = {
  // Application lifecycle
  app: {
    getVersion: () => ipcRenderer.invoke('app:get-version'),
    quit: () => ipcRenderer.invoke('app:quit'),
  },

  // Window controls
  window: {
    minimize: () => ipcRenderer.invoke('window:minimize'),
    maximize: () => ipcRenderer.invoke('window:maximize'),
    close: () => ipcRenderer.invoke('window:close'),
    isMaximized: () => ipcRenderer.invoke('window:is-maximized'),
  },

  // File system operations
  fs: {
    readFile: (path: string) => ipcRenderer.invoke('fs:read-file', path),
    writeFile: (path: string, content: string) => ipcRenderer.invoke('fs:write-file', path, content),
    exists: (path: string) => ipcRenderer.invoke('fs:exists', path),
    readDir: (path: string) => ipcRenderer.invoke('fs:read-dir', path),
    createDir: (path: string) => ipcRenderer.invoke('fs:create-dir', path),
    delete: (path: string) => ipcRenderer.invoke('fs:delete', path),
  },

  // Workspace operations
  workspace: {
    open: (path: string) => ipcRenderer.invoke('workspace:open', path),
    close: () => ipcRenderer.invoke('workspace:close'),
    getFiles: () => ipcRenderer.invoke('workspace:get-files'),
    getCurrentPath: () => ipcRenderer.invoke('workspace:get-current-path'),
  },

  // AI operations
  ai: {
    sendMessage: (message: string, options?: any) => ipcRenderer.invoke('ai:send-message', message, options),
    streamMessage: (message: string, options?: any) => ipcRenderer.invoke('ai:stream-message', message, options),
    listModels: () => ipcRenderer.invoke('ai:list-models'),
    getProviders: () => ipcRenderer.invoke('ai:get-providers'),
  },

  // Configuration
  config: {
    get: (key: string) => ipcRenderer.invoke('config:get', key),
    set: (key: string, value: any) => ipcRenderer.invoke('config:set', key, value),
    getAll: () => ipcRenderer.invoke('config:get-all'),
  },

  // Event listeners
  on: (channel: string, callback: (...args: any[]) => void) => {
    // Whitelist of allowed channels
    const allowedChannels = [
      'workspace:file-changed',
      'workspace:file-added',
      'workspace:file-deleted',
      'ai:message-chunk',
      'ai:message-complete',
      'config:changed',
      'app:theme-changed',
    ];

    if (allowedChannels.includes(channel)) {
      ipcRenderer.on(channel, (_, ...args) => callback(...args));
    } else {
      console.warn(`Attempted to listen to unauthorized channel: ${channel}`);
    }
  },

  // Remove event listeners
  off: (channel: string, callback: (...args: any[]) => void) => {
    ipcRenderer.removeListener(channel, callback);
  },

  // One-time event listeners
  once: (channel: string, callback: (...args: any[]) => void) => {
    const allowedChannels = [
      'workspace:opened',
      'workspace:closed',
      'ai:model-loaded',
      'app:ready',
    ];

    if (allowedChannels.includes(channel)) {
      ipcRenderer.once(channel, (_, ...args) => callback(...args));
    } else {
      console.warn(`Attempted to listen to unauthorized channel: ${channel}`);
    }
  },

  // Utility functions
  utils: {
    openExternal: (url: string) => ipcRenderer.invoke('utils:open-external', url),
    showMessageBox: (options: any) => ipcRenderer.invoke('utils:show-message-box', options),
    showOpenDialog: (options: any) => ipcRenderer.invoke('utils:show-open-dialog', options),
    showSaveDialog: (options: any) => ipcRenderer.invoke('utils:show-save-dialog', options),
  },

  // Development utilities (only available in development)
  dev: process.env['NODE_ENV'] === 'development' ? {
    openDevTools: () => ipcRenderer.invoke('dev:open-dev-tools'),
    reload: () => ipcRenderer.invoke('dev:reload'),
    toggleDevTools: () => ipcRenderer.invoke('dev:toggle-dev-tools'),
  } : undefined,
};

// Expose the API to the renderer process
contextBridge.exposeInMainWorld('novaAPI', novaAPI);

// Type definitions for the exposed API (will be used by renderer)
export type NovaAPI = typeof novaAPI;

// Declare global interface for TypeScript
declare global {
  interface Window {
    novaAPI: NovaAPI;
  }
}
import { injectable, inject } from 'inversify';
import { promises as fs } from 'fs';
import { join, relative } from 'path';
import { watch, FSWatcher } from 'chokidar';
import { IWorkspaceService, ILogger, IEventBus, WorkspaceEvent, TYPES } from '../types/core.types';

/**
 * Workspace service implementation
 * Manages workspace operations and file watching
 */
@injectable()
export class WorkspaceService implements IWorkspaceService {
  private _workspacePath: string | undefined;
  private watcher: FSWatcher | undefined;
  private watchCallbacks: ((event: WorkspaceEvent) => void)[] = [];

  constructor(
    @inject(TYPES.Logger) private logger: ILogger,
    @inject(TYPES.EventBus) private eventBus: IEventBus
  ) {}

  get workspacePath(): string | undefined {
    return this._workspacePath;
  }

  async openWorkspace(path: string): Promise<void> {
    try {
      // Verify the path exists and is a directory
      const stats = await fs.stat(path);
      if (!stats.isDirectory()) {
        throw new Error(`Path is not a directory: ${path}`);
      }

      // Close existing workspace if any
      await this.closeWorkspace();

      this._workspacePath = path;
      await this.setupFileWatcher();

      this.eventBus.emit('workspace.opened', { path });
      this.logger.info(`Workspace opened: ${path}`);
    } catch (error) {
      this.logger.error('Failed to open workspace', error as Error);
      throw error;
    }
  }

  async closeWorkspace(): Promise<void> {
    if (!this._workspacePath) return;

    const oldPath = this._workspacePath;
    this._workspacePath = undefined;

    if (this.watcher) {
      await this.watcher.close();
      this.watcher = undefined;
    }

    this.eventBus.emit('workspace.closed', { path: oldPath });
    this.logger.info(`Workspace closed: ${oldPath}`);
  }

  async getWorkspaceFiles(): Promise<string[]> {
    if (!this._workspacePath) {
      return [];
    }

    try {
      const files: string[] = [];
      await this.collectFiles(this._workspacePath, files);
      return files.map(file => relative(this._workspacePath!, file));
    } catch (error) {
      this.logger.error('Failed to get workspace files', error as Error);
      return [];
    }
  }

  watchWorkspace(callback: (event: WorkspaceEvent) => void): void {
    this.watchCallbacks.push(callback);
  }

  private async collectFiles(dir: string, files: string[]): Promise<void> {
    const entries = await fs.readdir(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = join(dir, entry.name);

      // Skip hidden files and common ignore patterns
      if (entry.name.startsWith('.') || 
          entry.name === 'node_modules' || 
          entry.name === 'dist' || 
          entry.name === 'build') {
        continue;
      }

      if (entry.isDirectory()) {
        await this.collectFiles(fullPath, files);
      } else if (entry.isFile()) {
        files.push(fullPath);
      }
    }
  }

  private async setupFileWatcher(): Promise<void> {
    if (!this._workspacePath) return;

    this.watcher = watch(this._workspacePath, {
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/build/**',
        '**/.git/**',
        '**/.*'
      ],
      ignoreInitial: true,
      persistent: true,
      depth: 10
    });

    this.watcher.on('add', (path) => {
      this.handleFileEvent('file-added', path);
    });

    this.watcher.on('change', (path) => {
      this.handleFileEvent('file-changed', path);
    });

    this.watcher.on('unlink', (path) => {
      this.handleFileEvent('file-deleted', path);
    });

    this.watcher.on('addDir', (path) => {
      this.handleFileEvent('folder-added', path);
    });

    this.watcher.on('unlinkDir', (path) => {
      this.handleFileEvent('folder-deleted', path);
    });

    this.watcher.on('error', (error) => {
      this.logger.error('File watcher error', error);
    });

    this.logger.debug('File watcher initialized');
  }

  private handleFileEvent(type: WorkspaceEvent['type'], path: string): void {
    if (!this._workspacePath) return;

    const relativePath = relative(this._workspacePath, path);
    const event: WorkspaceEvent = {
      type,
      path: relativePath,
      timestamp: new Date()
    };

    // Notify all callbacks
    this.watchCallbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        this.logger.error('Error in workspace watch callback', error as Error);
      }
    });

    // Emit event on event bus
    this.eventBus.emit('workspace.file-event', event);
    this.logger.debug(`File event: ${type} - ${relativePath}`);
  }
}
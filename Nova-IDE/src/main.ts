import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { NovaIDEApplication } from '@core/application';

/**
 * Electron main process entry point
 * Initializes the Nova-IDE application
 */

let mainWindow: BrowserWindow | null = null;
let application: NovaIDEApplication | null = null;

async function createWindow(): Promise<void> {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 800,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: join(__dirname, 'preload.js')
    },
    titleBarStyle: 'hidden',
    show: false
  });

  // Load the renderer
  await mainWindow.loadFile(join(__dirname, 'index.html'));

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
    
    // Open DevTools in development
    if (process.env['NODE_ENV'] === 'development') {
      mainWindow?.webContents.openDevTools();
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

async function initializeApplication(): Promise<void> {
  try {
    application = new NovaIDEApplication();
    await application.initialize();
    console.log('Nova-IDE application initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Nova-IDE application:', error);
    app.quit();
  }
}

// App event handlers
app.whenReady().then(async () => {
  await initializeApplication();
  await createWindow();

  app.on('activate', async () => {
    // On macOS, re-create window when dock icon is clicked
    if (BrowserWindow.getAllWindows().length === 0) {
      await createWindow();
    }
  });
});

app.on('window-all-closed', async () => {
  // Clean up application
  if (application) {
    await application.dispose();
    application = null;
  }

  // On macOS, keep app running even when all windows are closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', async () => {
  // Clean up before quitting
  if (application) {
    await application.dispose();
  }
});

// Handle protocol for deep linking (future use)
app.setAsDefaultProtocolClient('nova-ide');

// Security: Prevent new window creation
app.on('web-contents-created', (_, contents) => {
  contents.setWindowOpenHandler(() => {
    return { action: 'deny' };
  });
});

// Handle certificate errors
app.on('certificate-error', (event, _webContents, url, _error, _certificate, callback) => {
  // In development, ignore certificate errors for localhost
  if (process.env['NODE_ENV'] === 'development' && url.startsWith('https://localhost')) {
    event.preventDefault();
    callback(true);
  } else {
    callback(false);
  }
});
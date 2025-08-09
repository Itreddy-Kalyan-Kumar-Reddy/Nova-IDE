/**
 * Renderer process entry point
 * Initializes the UI and handles user interactions
 */

import './styles/main.css';

// Initialize the renderer when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await initializeRenderer();
    console.log('Nova-IDE renderer initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Nova-IDE renderer:', error);
  }
});

async function initializeRenderer(): Promise<void> {
  // Create the main UI structure
  createMainLayout();
  
  // Initialize components
  await initializeEditor();
  await initializeChatPanel();
  await initializeAgentVisualization();
  
  // Set up event listeners
  setupEventListeners();
  
  // Load initial state
  await loadInitialState();
}

function createMainLayout(): void {
  const app = document.getElementById('app');
  if (!app) {
    throw new Error('App container not found');
  }

  app.innerHTML = `
    <div class="nova-ide">
      <div class="title-bar">
        <div class="title-bar-content">
          <span class="title">Nova IDE</span>
          <div class="title-bar-controls">
            <button class="control-button minimize">−</button>
            <button class="control-button maximize">□</button>
            <button class="control-button close">×</button>
          </div>
        </div>
      </div>
      
      <div class="main-container">
        <div class="sidebar">
          <div class="sidebar-section">
            <h3>Explorer</h3>
            <div id="file-explorer" class="file-explorer"></div>
          </div>
          
          <div class="sidebar-section">
            <h3>AI Agents</h3>
            <div id="agent-list" class="agent-list"></div>
          </div>
        </div>
        
        <div class="editor-container">
          <div class="editor-tabs">
            <div class="tab-bar" id="tab-bar"></div>
          </div>
          <div id="editor" class="editor"></div>
        </div>
        
        <div class="right-panel">
          <div class="panel-tabs">
            <button class="panel-tab active" data-panel="chat">Chat</button>
            <button class="panel-tab" data-panel="agent-viz">Agent</button>
            <button class="panel-tab" data-panel="tools">Tools</button>
          </div>
          
          <div class="panel-content">
            <div id="chat-panel" class="panel active">
              <div class="chat-messages" id="chat-messages"></div>
              <div class="chat-input-container">
                <textarea id="chat-input" placeholder="Ask Nova-IDE anything..."></textarea>
                <button id="send-button">Send</button>
              </div>
            </div>
            
            <div id="agent-viz-panel" class="panel">
              <div class="agent-status" id="agent-status"></div>
              <div class="reasoning-display" id="reasoning-display"></div>
            </div>
            
            <div id="tools-panel" class="panel">
              <div class="tool-list" id="tool-list"></div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="status-bar">
        <div class="status-left">
          <span id="workspace-status">No workspace</span>
        </div>
        <div class="status-right">
          <span id="ai-status">AI: Ready</span>
          <span id="cursor-position">Ln 1, Col 1</span>
        </div>
      </div>
    </div>
  `;
}

async function initializeEditor(): Promise<void> {
  // Monaco Editor will be initialized here in future tasks
  const editorContainer = document.getElementById('editor');
  if (editorContainer) {
    editorContainer.innerHTML = '<div class="editor-placeholder">Editor will be initialized in task 7.2</div>';
  }
}

async function initializeChatPanel(): Promise<void> {
  // Chat functionality will be implemented in future tasks
  const chatMessages = document.getElementById('chat-messages');
  if (chatMessages) {
    chatMessages.innerHTML = '<div class="welcome-message">Welcome to Nova-IDE! Chat functionality will be implemented in task 7.3</div>';
  }
}

async function initializeAgentVisualization(): Promise<void> {
  // Agent visualization will be implemented in future tasks
  const agentStatus = document.getElementById('agent-status');
  if (agentStatus) {
    agentStatus.innerHTML = '<div class="status-placeholder">Agent visualization will be implemented in task 7.3</div>';
  }
}

function setupEventListeners(): void {
  // Panel tab switching
  const panelTabs = document.querySelectorAll('.panel-tab');
  panelTabs.forEach(tab => {
    tab.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const panelName = target.dataset['panel'];
      if (panelName) {
        switchPanel(panelName);
      }
    });
  });

  // Window controls
  const minimizeBtn = document.querySelector('.control-button.minimize');
  const maximizeBtn = document.querySelector('.control-button.maximize');
  const closeBtn = document.querySelector('.control-button.close');

  minimizeBtn?.addEventListener('click', () => {
    // Will be implemented with IPC in future tasks
    console.log('Minimize clicked');
  });

  maximizeBtn?.addEventListener('click', () => {
    // Will be implemented with IPC in future tasks
    console.log('Maximize clicked');
  });

  closeBtn?.addEventListener('click', () => {
    // Will be implemented with IPC in future tasks
    console.log('Close clicked');
  });

  // Chat input
  const chatInput = document.getElementById('chat-input') as HTMLTextAreaElement;
  const sendButton = document.getElementById('send-button');

  chatInput?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  });

  sendButton?.addEventListener('click', sendChatMessage);
}

function switchPanel(panelName: string): void {
  // Remove active class from all tabs and panels
  document.querySelectorAll('.panel-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.panel').forEach(panel => panel.classList.remove('active'));

  // Add active class to selected tab and panel
  const selectedTab = document.querySelector(`[data-panel="${panelName}"]`);
  const selectedPanel = document.getElementById(`${panelName}-panel`);

  selectedTab?.classList.add('active');
  selectedPanel?.classList.add('active');
}

function sendChatMessage(): void {
  const chatInput = document.getElementById('chat-input') as HTMLTextAreaElement;
  const message = chatInput.value.trim();
  
  if (message) {
    // Add message to chat (placeholder implementation)
    const chatMessages = document.getElementById('chat-messages');
    if (chatMessages) {
      const messageElement = document.createElement('div');
      messageElement.className = 'chat-message user';
      messageElement.textContent = message;
      chatMessages.appendChild(messageElement);
      
      // Scroll to bottom
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Clear input
    chatInput.value = '';
    
    // TODO: Send message to AI service in future tasks
    console.log('Chat message:', message);
  }
}

async function loadInitialState(): Promise<void> {
  // Load any saved state or default configuration
  // This will be expanded in future tasks
  console.log('Loading initial state...');
}
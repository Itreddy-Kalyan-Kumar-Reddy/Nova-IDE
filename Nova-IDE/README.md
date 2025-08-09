# Nova-IDE

Nova-IDE is a next-generation AI-powered Integrated Development Environment that provides Claude 4.1-style agentic capabilities with support for multiple AI providers (cloud and local). The IDE features a sophisticated AI orchestration layer that acts as a senior developer assistant, capable of reasoning, planning, and executing complex development tasks through a dynamic tool ecosystem.

## Features

- **Universal AI Model Support**: Works with OpenRouter, local models (Ollama, LM Studio), and custom cloud deployments
- **Autopilot Mode**: Claude-style autonomous development assistance that works with any AI model
- **Multi-Agent Orchestration**: Coordinate multiple AI models for complex tasks
- **Cost Optimization**: Intelligent model selection prioritizing free/local models
- **Extension System**: Comprehensive plugin architecture with MCP integration
- **Advanced UI**: VS Code-inspired interface with AI-enhanced features

## Architecture

Nova-IDE is built on a modular architecture with the following core components:

- **Core Services**: Dependency injection, logging, configuration, workspace management
- **AI Model Gateway**: Universal abstraction for all AI providers
- **Agent Orchestrator**: Claude-style reasoning and task execution
- **UI Manager**: Electron-based interface with Monaco editor
- **Tool System**: MCP-compatible tool ecosystem
- **Extension Manager**: Plugin lifecycle and marketplace integration

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Nova-IDE
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start the development server:
```bash
npm run dev:electron
```

### Available Scripts

- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run dev` - Watch mode compilation
- `npm start` - Start the Electron app
- `npm run dev:electron` - Development mode with hot reload
- `npm test` - Run tests
- `npm run test:watch` - Run tests in watch mode
- `npm run lint` - Lint the codebase
- `npm run lint:fix` - Fix linting issues
- `npm run type-check` - TypeScript type checking

## Project Structure

```
src/
├── core/           # Core architecture components
│   ├── application.ts
│   ├── container.ts
│   ├── logger.ts
│   ├── event-bus.ts
│   ├── configuration.ts
│   └── workspace.ts
├── agents/         # AI agent implementations
├── providers/      # AI model provider implementations  
├── ui/            # User interface components
├── tools/         # Tool and extension system
├── types/         # TypeScript type definitions
├── main.ts        # Electron main process
├── renderer.ts    # Electron renderer process
└── index.html     # Main HTML template
```

## Configuration

Nova-IDE uses a JSON configuration file (`config.json`) for settings. Default configuration includes:

- AI provider settings (OpenRouter, Ollama, etc.)
- UI preferences (theme, font size)
- Workspace settings (auto-save, file watching)
- Extension settings (auto-update, security)

## Testing

The project uses Jest for testing with comprehensive coverage:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Roadmap

- [x] Core architecture and dependency injection
- [ ] AI model gateway implementation
- [ ] Agent orchestration system
- [ ] UI components and editor integration
- [ ] Tool ecosystem and MCP integration
- [ ] Extension marketplace
- [ ] Team collaboration features
- [ ] Advanced debugging and monitoring

## Support

For support, please open an issue on GitHub or contact the development team.
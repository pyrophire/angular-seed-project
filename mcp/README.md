# Angular MCP Server

This directory contains a Model Context Protocol (MCP) server exposing structured context from the Angular workspace for AI assistant tooling. Built using the official `@modelcontextprotocol/sdk`.

## Features
- Project info (projects in `angular.json`)
- List components & services (under `src/app` and any project directories)
- Extract basic route paths from `app.routes.ts` or `app-routing.module.ts` files
- Safe file read (bounded size, UTF-8)

## Setup

1. Install dependencies:
```bash
npm install
```

2. The MCP server is configured in `.vscode/mcp.json` and will start automatically with VS Code's MCP extension.

Alternatively, run manually:
```bash
npm run mcp
```

## MCP Tools

The server exposes the following tools via the Model Context Protocol:

| Tool Name                | Parameters             | Description                                  |
| ------------------------ | ---------------------- | -------------------------------------------- |
| `angular_projectInfo`    | none                   | Get Angular projects from `angular.json`     |
| `angular_listComponents` | `{ project?: string }` | List all component files in the workspace    |
| `angular_listServices`   | `{ project?: string }` | List all service files in the workspace      |
| `angular_listRoutes`     | `{ project?: string }` | Extract routes from routing configuration    |
| `angular_readFile`       | `{ path: string }`     | Read a file from the workspace (with limits) |

## Architecture

- **Protocol**: Model Context Protocol (MCP) over stdio
- **Transport**: `StdioServerTransport` from MCP SDK
- **Server**: Uses `@modelcontextprotocol/sdk/server`
- **Tool Registration**: Implements `ListToolsRequestSchema` and `CallToolRequestSchema`

## Notes

- Route extraction is heuristic (regex) and may not capture all dynamic lazy-loaded routes
- Large files (>200k chars) are truncated for safety
- Files are restricted to workspace directory for security
- Supports both standalone components architecture and legacy module-based routing
- Extend tools in `angular-mcp-server.ts` as needed

## Configuration

The server is configured in `.vscode/mcp.json`:

```json
{
    "servers": {
        "angular-workspace": {
            "command": "./mcp/run-mcp.sh",
            "args": []
        }
    }
}
```

The `run-mcp.sh` script ensures the correct Node.js version (via nvm) and runs the TypeScript server using `tsx`.

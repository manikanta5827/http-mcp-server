# Simple MCP Server (HTTP & Stdio)

A lightweight Model Context Protocol (MCP) server implementation built from scratch using [Bun](https://bun.com/). This project demonstrates how to build an MCP server without relying on heavy external SDKs, focusing on understanding the core protocol flow.

It supports both **HTTP** (SSE-like behavior via POST) and **Stdio** (Standard Input/Output) transports, making it versatile for testing with tools like `curl` or integrating with AI clients like Claude Desktop.

## 🌟 Key Features

- **From Scratch:** Built without the official MCP SDK to demonstrate how the protocol actually works under the hood.
- **Dual Transport:**
  - **HTTP:** Simple `POST` endpoint for easy testing.
  - **Stdio:** Standard input/output for integration with MCP clients (e.g., Claude Desktop, IDE extensions).
- **Fast:** Powered by Bun's native high-performance HTTP server.
- **Simple:** Minimal dependencies, clean architecture.

## 📁 Project Structure

```
.
├── index.ts           # HTTP Server entry point (Bun.serve)
├── index-stdio.ts     # Stdio Server entry point (Stdin/Stdout)
├── src/
│   ├── handler.ts     # Core Protocol Logic (Router)
│   ├── jsonrpc.ts     # JSON-RPC 2.0 Utilities
│   ├── types.ts       # TypeScript Interfaces
│   └── tools/
│       ├── functions.ts   # Actual Business Logic
│       └── tools.ts       # Tool Definitions & Registry
```

## 🚀 Quick Start

### 1. Prerequisites

Ensure you have [Bun](https://bun.com/) installed.

```bash
bun install
```

### 2. Running in HTTP Mode

This starts a web server listening on port 3000.

```bash
bun run index.ts
```

**Test with curl:**

```bash
# List tools
curl -X POST http://localhost:3000/mcp \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'

# Call the greeting tool
curl -X POST http://localhost:3000/mcp \
  -d '{"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"greeting_hello","arguments":{"username":"World"}}}'
```

### 3. Running in Stdio Mode

This mode listens to standard input and writes to standard output, suitable for piping or AI agent integration.

```bash
bun run index-stdio.ts
```

**Test manually:**
Type this JSON and press Enter:

```json
{ "jsonrpc": "2.0", "id": 1, "method": "tools/list" }
```

## 🧠 How It Works

The server follows a simple unidirectional flow:

1.  **Transport Layer (`index.ts` / `index-stdio.ts`):** Receives the raw message (HTTP body or Stdin line).
2.  **JSON Parsing:** Converts the string into a JSON object.
3.  **Protocol Handler (`src/handler.ts`):** Identifies the MCP method (e.g., `initialize`, `tools/call`).
4.  **Tool Registry (`src/tools/tools.ts`):** If a tool call is requested, looks up the corresponding function.
5.  **Execution (`src/tools/functions.ts`):** Runs the actual business logic.
6.  **Response (`src/jsonrpc.ts`):** Formats the result into a standardized JSON-RPC 2.0 response.

## 📚 File Breakdown

### Entry Points

- **`index.ts`**: Sets up a Bun HTTP server. It handles CORS, a health check (`/healthz`), and the main `/mcp` endpoint. It logs input/output to `temp.txt` for debugging.
- **`index-stdio.ts`**: Sets up a readline interface to listen to `stdin`. It's essential for local integrations where the client spawns the server process directly.

### Source (`src/`)

- **`src/handler.ts`**: The brain of the operation. It exports `handleMCPRequest` which switches on the request method:
  - `initialize`: Handshakes with the client.
  - `tools/list`: Returns the available tool definitions.
  - `tools/call`: Executes a specific tool.
- **`src/tools/tools.ts`**: The registry. It maps tool names (strings) to their executable functions and defines the Zod schemas for validation.
- **`src/tools/functions.ts`**: Pure functions containing the logic. For example, `getGreeting` simply returns a formatted string object.
- **`src/jsonrpc.ts`**: Helper factories to ensure all responses strictly follow the JSON-RPC 2.0 format (`{ jsonrpc: "2.0", result: ... }` or error objects).
- **`src/types.ts`**: TypeScript definitions for the requests and responses, ensuring type safety across the application.

## 🛠️ Available Tools

| Tool Name        | Description                 | Arguments           |
| ---------------- | --------------------------- | ------------------- |
| `greeting_hello` | Returns a greeting message. | `username` (string) |

### 1. Integrating with AI Clients (Claude Desktop, IDEs)

Most MCP-compliant clients (like Claude Desktop) communicate via **Stdio**.

**Configuration for a Local Stdio Server (Claude Desktop):**
Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "my-bun-server": {
      "command": "bun",
      "args": ["run", "/ABSOLUTE/PATH/TO/PROJECT/index-stdio.ts"]
    }
  }
}
```

_Note: Replace `/ABSOLUTE/PATH/TO/PROJECT` with your actual project path._

**Configuration for a Remote HTTP MCP Server (Claude Desktop via `mcp-remote`):**
If you have deployed your MCP server to a remote HTTP endpoint (e.g., a serverless function), you can use `mcp-remote` to bridge it to Claude Desktop.

Add this to your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "serverless_lambda_mcp_server": {
      "command": "npx",
      "args": ["mcp-remote", "http://localhost:3200/mcp"]
    }
  }
}
```

_Make sure `mcp-remote` is installed globally or accessible in your PATH._

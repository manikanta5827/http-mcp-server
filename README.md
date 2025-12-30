# Simple MCP Server

A minimal HTTP MCP Server example built with [Bun](https://bun.com/) to help you understand how MCP (Model Context Protocol) HTTP servers work.

This is a learning example with:

- **Simple structure** - Just 3 files
- **One tool** - Returns a static greeting message
- **No external APIs** - Pure MCP protocol demonstration
- **Easy to understand** - Clean, commented code

> **💡 Don't have Bun?** Install it from [https://bun.com/](https://bun.com/)

## 📁 Project Structure

```
src/
├── server.ts    # HTTP server entry point (Bun serve)
├── mcp.ts       # MCP protocol request handler
├── types.ts     # TypeScript type definitions for MCP protocol
├── jsonrpc.ts   # JSON-RPC helper functions (response, error creation)
├── registry.ts  # Tool registry (defines available tools and their handlers)
├── utils.ts     # Utility functions (e.g., Zod schema conversion)
└── tools.ts     # Tool implementations (e.g., getGreeting function)
```

## 🚀 Quick Start

1. **Install dependencies:**

   ```bash
   bun install
   ```

2. **Start the server:**

   ```bash
   bun run src/server.ts
   ```

   Server starts on port 3000 (or set `PORT` environment variable).

3. **Test it:**

   ```bash
   # Initialize connection
   curl -X POST http://localhost:3000/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{}}'

   # List available tools
   curl -X POST http://localhost:3000/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}'

   # Call the greeting tool
   curl -X POST http://localhost:3000/mcp \
     -H "Content-Type: application/json" \
     -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"greeting.hello","arguments":{}}}'
   ```

## 🛠️ Available Tools

| Tool             | Title          | Description                        | Input Schema                      |
| ---------------- | -------------- | ---------------------------------- | --------------------------------- |
| `greeting.hello` | Get a greeting | Returns a simple greeting message. | Empty object `{}` (no parameters) |

### Tool Response Format

When you call `greeting.hello`, it returns a JSON-RPC response with this structure:

```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\n  \"message\": \"Hello from MCP Server!\",\n  \"timestamp\": \"2024-01-01T12:00:00.000Z\",\n  \"server\": \"Bun MCP Server\"\n}"
      }
    ]
  }
}
```

The actual data inside the `text` field:

```json
{
  "message": "Hello from MCP Server!",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "server": "Bun MCP Server"
}
```

## 📝 How It Works

### File Breakdown

1. **`server.ts`** - HTTP server entry point
   - Starts Bun HTTP server on port 3000 (configurable via `PORT` env var)
   - Handles CORS preflight (OPTIONS requests)
   - Health check endpoint (`/healthz`)
   - Routes POST requests to `/mcp` to the MCP handler (`mcp.ts`)
   - Parses JSON-RPC requests and returns JSON-RPC responses, utilizing `jsonrpc.ts` for error responses.

2. **`mcp.ts`** - MCP protocol request handler
   - Implements `handleMCPRequest()` function.
   - Handles 3 MCP methods by delegating to the tool registry and using JSON-RPC helpers:
     - `initialize` - Returns server info and capabilities
     - `tools/list` - Returns list of available tools
     - `tools/call` - Executes a tool and returns result
   - Error handling (converts errors to JSON-RPC error responses via `jsonrpc.ts`).

3. **`types.ts`** - TypeScript type definitions
   - Defines core interfaces like `MCPRequest` and `MCPResponse`.

4. **`jsonrpc.ts`** - JSON-RPC helper functions
   - Provides functions to create standard JSON-RPC responses and error messages.

5. **`registry.ts`** - Tool registry
   - Defines the list of available tools (`tools` array) and their corresponding handlers (`allTools` map).
   - Handles Zod schema conversion for tool input definitions using `utils.ts`.

6. **`utils.ts`** - Utility functions
   - Contains helper functions such as `zodToMCPSchema` for converting Zod schemas to MCP-compatible JSON schemas.

7. **`tools.ts`** - Tool implementation
   - `getGreeting()` function - Returns static greeting data
   - Returns data in MCP content format: `{ content: [{ type: 'text', text: '...' }] }`


## 🔍 MCP Protocol Flow

1. **Initialize** - Client sends `initialize` request

   - Server responds with:
     - Protocol version: `2024-11-05`
     - Server info: `{ name: 'simple-mcp-server', version: '1.0.0' }`
     - Capabilities: `{ tools: { listChanged: true } }`

2. **List Tools** - Client sends `tools/list` request

   - Server responds with array of available tools and their schemas

3. **Call Tool** - Client sends `tools/call` request with tool name and arguments
   - Server executes the tool handler
   - Returns result in MCP content format
   - On error, returns JSON-RPC error response

## 🌐 Endpoints

| Route      | Method  | Purpose               | Response              |
| ---------- | ------- | --------------------- | --------------------- |
| `/mcp`     | POST    | MCP protocol endpoint | JSON-RPC response     |
| `/healthz` | GET     | Health check          | `200 OK` (plain text) |
| `/mcp`     | OPTIONS | CORS preflight        | `204 No Content`      |

All responses include `Access-Control-Allow-Origin: *` headers for browser compatibility.

## ⚙️ Configuration

| Variable | Default | Description      |
| -------- | ------- | ---------------- |
| `PORT`   | `3000`  | HTTP server port |

## 📦 Dependencies

- **Bun** - Runtime and HTTP server (`serve()` function)
- **Zod** - Schema validation for tool inputs (`z.object()`, `z.toJSONSchema()`)
- **@types/node** - TypeScript types for Node.js
- **@types/bun** - TypeScript types for Bun
- **TypeScript** - Type checking (peer dependency)

## 🎯 Learning Resources

This is a minimal example to understand MCP HTTP servers. To learn more:

- [MCP Specification](https://modelcontextprotocol.io/)
- [Bun Documentation](https://bun.com/docs)
- [Zod Documentation](https://zod.dev/)

## 🔧 Adding Your Own Tools

1. **Add tool function to `tools.ts`:**

   ```typescript
   export async function myTool(input?: any) {
     return {
       content: [
         {
           type: 'text',
           text: JSON.stringify({ result: 'your data' }, null, 2),
         },
       ],
     };
   }
   ```

2. **Register tool in `registry.ts`:**

   - Import your function: `import { myTool } from './tools.js';`
   - Add to the `tools` array with name, title, description, and inputSchema.
   - Add to the `allTools` Map: `['my.tool', myTool]`.

3. **Define input schema** (if your tool needs parameters):
   ```typescript
   const myToolSchema = z.object({
     param1: z.string(),
     param2: z.number().optional(),
   });
   ```

That's it! This simple structure makes it easy to understand and extend.

## 🐛 Error Handling

The server handles errors gracefully:

- **Parse errors** (`-32700`): Invalid JSON in request
- **Method not found** (`-32601`): Unknown MCP method or tool name
- **Internal error** (`-32603`): Tool execution errors

All errors are returned in JSON-RPC error format with appropriate error codes.

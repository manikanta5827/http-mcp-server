/**
 * MCP Protocol Handler
 *
 * Handles 3 types of MCP requests:
 * 1. initialize - Client connects
 * 2. tools/list - Client asks what tools are available
 * 3. tools/call - Client calls a tool
 */

import type { MCPRequest, MCPResponse } from './types.js';
import {
  createJSONRPCResponse,
  createJSONRPCError
} from './jsonrpc.js';
import { tools, allTools } from './registry.js';

const serverInfo = {
  name: 'simple-mcp-server',
  version: '1.0.0',
};

export async function handleMCPRequest(
  request: MCPRequest
): Promise<MCPResponse | null> {
  switch (request.method) {
    // Step 1: Client initializes connection
    case 'initialize':
      return createJSONRPCResponse(request.id!, {
        protocolVersion: '2024-11-05',
        capabilities: {
          tools: { listChanged: true },
        },
        serverInfo,
      });

    // Step 2: Client asks "What tools do you have?"
    case 'tools/list':
      return createJSONRPCResponse(request.id!, { tools });

    // Step 3: Client calls a tool
    case 'tools/call':
      const { name, arguments: args } = request.params;
      const handler = allTools.get(name);

      if (!handler) {
        return createJSONRPCError(
          request.id!,
          -32601,
          `Tool ${name} not found`
        );
      }

      try {
        // Execute the tool handler
        const result = await handler(args || {});

        // Format result in MCP content format if needed
        const formattedResult =
          typeof result === 'object' && result !== null && 'content' in result
            ? result
            : {
                content: [
                  {
                    type: 'text',
                    text: JSON.stringify(result, null, 2),
                  },
                ],
              };

        return createJSONRPCResponse(request.id!, formattedResult);
      } catch (error) {
console.error('Tool error:', error);
return createJSONRPCError(
  request.id || 'unknown',
  -32601,
  error instanceof Error ? error.message : 'Something went wrong'
);
      }

    default:
      return createJSONRPCError(
        request.id || 'unknown',
        -32601,
        `Method ${request.method} not found`
      );
  }
}

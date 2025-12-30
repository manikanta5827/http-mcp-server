import { serve } from 'bun';
import { handleMCPRequest } from './src/handler.ts';
import { createJSONRPCError } from './src/jsonrpc.ts';
import type { MCPRequest } from './src/types.ts';

const port = parseInt(process.env.PORT ?? '3000', 10);

serve({
  port,

  routes: {
    // CORS preflight for any path
    '/*': {
      OPTIONS: async () =>
        new Response(null, {
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
            'Access-Control-Allow-Headers': '*',
          },
        }),
    },

    // Health check (GET /healthz)
    '/healthz': {
      GET: () =>
        new Response('OK', {
          status: 200,
          headers: {
            'Content-Type': 'text/plain',
            'Access-Control-Allow-Origin': '*',
          },
        }),
    },

    // JSON-RPC MCP endpoint (POST /mcp)
    '/mcp': {
      POST: async (req) => {
        try {
          const body = (await req.json()) as MCPRequest;
          const response = await handleMCPRequest(body);

          console.log(JSON.stringify(response, null, 2));
          
          if (response) {
            return new Response(JSON.stringify(response), {
              headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
              },
            });
          }

          return new Response(null, {
            status: 204,
            headers: { 'Access-Control-Allow-Origin': '*' },
          });
        } catch (error) {
          console.error('Request processing error:', error);

          const errorResponse = createJSONRPCError(
            'unknown',
            -32700,
            error instanceof Error ? error.message : 'Parse error'
          );

          return new Response(JSON.stringify(errorResponse), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }
      },
    },
  },
  fetch(req) {
    return new Response('Not found', {
      status: 404,
      headers: { 'Access-Control-Allow-Origin': '*' },
    });
  },
});

console.log(`Simple MCP Server listening on port ${port}`);
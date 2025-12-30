import type { MCPResponse } from './types.js';

export function createJSONRPCResponse(id: number | string, result: any): MCPResponse {
  return {
    jsonrpc: '2.0',
    id,
    result,
  };
}

export function createJSONRPCError(
  id: number | string,
  code: number,
  message: string,
  data?: any
): MCPResponse {
  return {
    jsonrpc: '2.0',
    id,
    error: {
      code,
      message,
      ...(data && { data }),
    },
  };
}

export function createErrorResponse(id: number | string, error: Error): MCPResponse {
  return createJSONRPCError(id, -32603, error.message);
}

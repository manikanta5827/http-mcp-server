import type { MCPResponse } from './types';

export function createJSONRPCResponse(
  id: number | string,
  result: any
): MCPResponse {
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

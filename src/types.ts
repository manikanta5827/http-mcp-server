export interface MCPRequest {
  jsonrpc: string;
  id?: number | string;
  method: string;
  params?: any;
}

export interface MCPResponse {
  jsonrpc: string;
  id: number | string;
  result?: any;
  error?: {
    code: number;
    message: string;
    data?: any;
  };
}

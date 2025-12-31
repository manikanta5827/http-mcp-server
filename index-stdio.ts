import readline from 'node:readline';
import { handleMCPRequest } from './src/handler';

// Create line-based stdin reader
const rl = readline.createInterface({
  input: process.stdin,
  crlfDelay: Infinity,
});

// Read one JSON-RPC message per line
rl.on('line', async (line) => {
  if (!line.trim()) return;

  try {
    const request = JSON.parse(line);
    const response = await handleMCPRequest(request);

    if (response) {
      process.stdout.write(JSON.stringify(response) + '\n');
    }
  } catch (err) {
    const errorResponse = {
      jsonrpc: '2.0',
      id: null,
      error: {
        code: -32700,
        message: 'Parse error',
      },
    };
    process.stdout.write(JSON.stringify(errorResponse) + '\n');
  }
});

// Shutdown cleanly
process.on('SIGTERM', () => {
  console.error('MCP server shutting down');
  rl.close();
  process.exit(0);
});

/**
 * Tool Implementation
 *
 * This is where you write the actual logic for your tools.
 * Each tool function returns data in MCP format.
 */

export async function getGreeting({ username }: { username: string }) {
  // Return static data in MCP format
  return {
    message: `Hello ${username} from MCP Server!`,
    timestamp: new Date().toISOString(),
    server: 'Bun MCP Server',
  };
}

/**
 * Tool Implementation
 *
 * This is where you write the actual logic for your tools.
 * Each tool function returns data in MCP format.
 */

export async function getGreeting() {
  // Return static data in MCP format
  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify(
          {
            message: 'Hello from MCP Server!',
            timestamp: new Date().toISOString(),
            server: 'Bun MCP Server',
          },
          null,
          2
        ),
      },
    ],
  };
}

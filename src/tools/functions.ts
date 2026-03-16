/**
 * Tool Implementation
 *
 * This is where you write the actual logic for your tools.
 * Each tool function returns data in MCP format.
 */

export async function changeFanSpeed({
  speed,
}: {
  speed: number;
}): Promise<string> {
  // Return static data in MCP format
  return `Fan speed is changed to ${speed}..`;
}

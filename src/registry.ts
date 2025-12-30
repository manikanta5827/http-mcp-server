import { z } from 'zod';
import { getGreeting } from './tools.js';
import { zodToMCPSchema } from './utils.js';

export type ToolHandler = (args: any) => Promise<any>;

const greetingSchema = z.object({});

export const tools = [
  {
    name: 'greeting.hello',
    title: 'Get a greeting',
    description: 'Returns a simple greeting message.',
    inputSchema: zodToMCPSchema(greetingSchema),
  },
];

export const allTools = new Map<string, ToolHandler>([
  ['greeting.hello', getGreeting],
]);

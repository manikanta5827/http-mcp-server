import { z } from 'zod';
import { getGreeting } from './functions.ts';

export type ToolHandler = (args: any) => Promise<any>;


const greetingSchema = z.object({
  username: z.string(),
});

export const tools = [
  {
    name: 'greeting.hello',
    title: 'Get a greeting',
    description: 'Returns a simple greeting message.',
    inputSchema: z.toJSONSchema(greetingSchema, { io: 'input' }),
  },
];

export const allTools = new Map<string, ToolHandler>([
  ['greeting.hello', getGreeting],
]);

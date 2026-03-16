import { z } from 'zod';
import { changeFanSpeed } from './functions.ts';
type ToolHandler = (args: any) => Promise<any>;

const getChangeFanSpeedSchema = z.object({
  speed: z.number(),
});

export const tools = [
  {
    name: 'change_fan_speed',
    title: 'change speed of fan',
    description: 'change speed of fan Allowed values: 1,2,3,4,5',
    inputSchema: z.toJSONSchema(getChangeFanSpeedSchema, { io: 'input' }),
  },
];

export const allTools = new Map<string, ToolHandler>([
  ['change_fan_speed', changeFanSpeed],
]);

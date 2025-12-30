import { z } from 'zod';

// Convert Zod schema to JSON Schema for MCP
export function zodToMCPSchema(schema: z.ZodObject<any>) {
  const jsonSchema = z.toJSONSchema(schema) as any;
  if (jsonSchema.required && Array.isArray(jsonSchema.required)) {
    const shape = schema.shape;
    jsonSchema.required = jsonSchema.required.filter((fieldName: string) => {
      const field = shape[fieldName];
      return !field.isOptional() && field._def.defaultValue === undefined;
    });
    if (jsonSchema.required.length === 0) {
      delete jsonSchema.required;
    }
  }
  return jsonSchema;
}

import { z } from 'zod';

export const todoCreateSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, { message: 'Todo text is required' })
    .max(500, { message: 'Todo text must be 500 characters or less' }),
});

export const todoUpdateSchema = z.object({
  completed: z.boolean().optional(),
  text: z
    .string()
    .trim()
    .min(1, { message: 'Todo text cannot be empty or whitespace' })
    .max(500, { message: 'Todo text must be 500 characters or less' })
    .optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

export type TodoCreate = z.infer<typeof todoCreateSchema>;
export type TodoUpdate = z.infer<typeof todoUpdateSchema>;

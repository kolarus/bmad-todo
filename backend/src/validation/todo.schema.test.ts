import { describe, it, expect } from 'vitest';
import { todoCreateSchema, todoUpdateSchema } from './todo.schema';

describe('todoCreateSchema', () => {
  it('should pass for valid text', () => {
    expect(todoCreateSchema.safeParse({ text: 'Buy milk' }).success).toBe(true);
    expect(todoCreateSchema.safeParse({ text: 'a' }).success).toBe(true);
    expect(todoCreateSchema.safeParse({ text: 'a'.repeat(500) }).success).toBe(true);
  });

  it('should fail for empty string', () => {
    const result = todoCreateSchema.safeParse({ text: '' });
    expect(result.success).toBe(false);
  });

  it('should fail for whitespace-only string', () => {
    const result = todoCreateSchema.safeParse({ text: '   ' });
    expect(result.success).toBe(false);
  });

  it('should fail for text > 500 characters', () => {
    const result = todoCreateSchema.safeParse({ text: 'a'.repeat(501) });
    expect(result.success).toBe(false);
  });

  it('should trim whitespace from text', () => {
    const result = todoCreateSchema.safeParse({ text: '  Buy milk  ' });
    expect(result.success).toBe(true);
    if (result.success) expect(result.data.text).toBe('Buy milk');
  });
});

describe('todoUpdateSchema', () => {
  it('should pass for valid completed update', () => {
    expect(todoUpdateSchema.safeParse({ completed: true }).success).toBe(true);
    expect(todoUpdateSchema.safeParse({ completed: false }).success).toBe(true);
  });

  it('should pass for valid text + completed update', () => {
    expect(todoUpdateSchema.safeParse({ text: 'Updated text', completed: true }).success).toBe(true);
  });

  it('should fail for empty update object', () => {
    expect(todoUpdateSchema.safeParse({}).success).toBe(false);
  });
});

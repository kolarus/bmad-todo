import { describe, it, expect, vi, beforeEach } from 'vitest';
import { Prisma } from '@prisma/client';

// Mock prisma before importing service
vi.mock('../lib/prisma', () => ({
  prisma: {
    todo: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { prisma } from '../lib/prisma';
import { TodoService } from './todo.service';

const mockPrisma = prisma as unknown as {
  todo: {
    findMany: ReturnType<typeof vi.fn>;
    create: ReturnType<typeof vi.fn>;
    update: ReturnType<typeof vi.fn>;
    delete: ReturnType<typeof vi.fn>;
  };
};

const mockTodo = {
  id: 'test-id',
  text: 'Test todo',
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(() => {
    service = new TodoService();
    vi.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all todos ordered by createdAt desc', async () => {
      mockPrisma.todo.findMany.mockResolvedValue([mockTodo]);
      const result = await service.findAll();
      expect(result).toEqual([mockTodo]);
      expect(mockPrisma.todo.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('create', () => {
    it('should create a todo with provided text', async () => {
      mockPrisma.todo.create.mockResolvedValue(mockTodo);
      const result = await service.create({ text: 'Test todo' });
      expect(result).toEqual(mockTodo);
      expect(mockPrisma.todo.create).toHaveBeenCalledWith({
        data: { text: 'Test todo' },
      });
    });
  });

  describe('update', () => {
    it('should update a todo and return it', async () => {
      const updated = { ...mockTodo, completed: true };
      mockPrisma.todo.update.mockResolvedValue(updated);
      const result = await service.update('test-id', { completed: true });
      expect(result).toEqual(updated);
    });

    it('should return null when todo is not found (P2025)', async () => {
      mockPrisma.todo.update.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: '7.0.0',
        })
      );
      const result = await service.update('non-existent-id', { completed: true });
      expect(result).toBeNull();
    });

    it('should rethrow non-P2025 errors', async () => {
      mockPrisma.todo.update.mockRejectedValue(new Error('Connection failed'));
      await expect(service.update('id', { completed: true })).rejects.toThrow('Connection failed');
    });
  });

  describe('delete', () => {
    it('should delete a todo and return it', async () => {
      mockPrisma.todo.delete.mockResolvedValue(mockTodo);
      const result = await service.delete('test-id');
      expect(result).toEqual(mockTodo);
    });

    it('should return null when todo is not found (P2025)', async () => {
      mockPrisma.todo.delete.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError('Record not found', {
          code: 'P2025',
          clientVersion: '7.0.0',
        })
      );
      const result = await service.delete('non-existent-id');
      expect(result).toBeNull();
    });
  });
});

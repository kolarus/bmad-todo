import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import type { TodoCreate, TodoUpdate } from '../validation/todo.schema';

export class TodoService {
  async findAll() {
    return prisma.todo.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: TodoCreate) {
    return prisma.todo.create({
      data: { text: data.text },
    });
  }

  async update(id: string, data: TodoUpdate) {
    try {
      return await prisma.todo.update({
        where: { id },
        data,
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        return null;
      }
      throw e;
    }
  }

  async delete(id: string) {
    try {
      return await prisma.todo.delete({
        where: { id },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        return null;
      }
      throw e;
    }
  }
}

export const todoService = new TodoService();

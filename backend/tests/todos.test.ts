import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';
import { prisma } from '../src/lib/prisma';

describe('Todo API Integration Tests', () => {
  beforeAll(async () => {
    await prisma.todo.deleteMany();
  });

  afterAll(async () => {
    await prisma.todo.deleteMany();
    await prisma.$disconnect();
  });

  describe('GET /api/todos', () => {
    it('should return 200 with empty array initially', async () => {
      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('POST /api/todos', () => {
    it('should create a todo and return 201', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: 'Test todo' });
      expect(res.status).toBe(201);
      expect(res.body).toMatchObject({ text: 'Test todo', completed: false });
      expect(res.body.id).toBeDefined();
    });

    it('should return 400 for empty text', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: '' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 400 for whitespace-only text', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: '   ' });
      expect(res.status).toBe(400);
    });

    it('should return 400 for text > 500 characters', async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: 'a'.repeat(501) });
      expect(res.status).toBe(400);
    });
  });

  describe('PATCH /api/todos/:id', () => {
    let todoId: string;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: 'Todo for update' });
      todoId = res.body.id;
    });

    it('should update a todo and return 200', async () => {
      const res = await request(app)
        .patch(`/api/todos/${todoId}`)
        .send({ completed: true });
      expect(res.status).toBe(200);
      expect(res.body.completed).toBe(true);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app)
        .patch('/api/todos/non-existent-id')
        .send({ completed: true });
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('DELETE /api/todos/:id', () => {
    let todoId: string;

    beforeAll(async () => {
      const res = await request(app)
        .post('/api/todos')
        .send({ text: 'Todo for delete' });
      todoId = res.body.id;
    });

    it('should delete a todo and return 204', async () => {
      const res = await request(app).delete(`/api/todos/${todoId}`);
      expect(res.status).toBe(204);
    });

    it('should return 404 for non-existent todo', async () => {
      const res = await request(app).delete('/api/todos/non-existent-id');
      expect(res.status).toBe(404);
      expect(res.body.error.code).toBe('NOT_FOUND');
    });
  });

  describe('GET /api/todos (after creates)', () => {
    it('should return all created todos', async () => {
      const res = await request(app).get('/api/todos');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });
});

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/server';

describe('CORS Configuration', () => {
  describe('Allowed Origins', () => {
    it('should allow requests from allowed origin (localhost:3000)', async () => {
      const response = await request(app)
        .get('/api/health')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      // CORS header must reflect the allowed origin explicitly
      expect(response.headers['access-control-allow-origin']).toBe('http://localhost:3000');
    });

    it('should allow requests with no origin (server-to-server)', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.status).toBe('ok');
    });
  });

  describe('Unauthorized Origins', () => {
    it('should reject requests from unauthorized origins', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://unauthorized.com')
        .set('Access-Control-Request-Method', 'GET');

      // Header must be absent — unauthorized origins must not be reflected
      expect(response.headers['access-control-allow-origin']).toBeUndefined();
    });
  });

  describe('CORS Methods', () => {
    it('should support GET, POST, PATCH, DELETE methods', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST');

      const allowedMethods = response.headers['access-control-allow-methods'];
      expect(allowedMethods).toContain('GET');
      expect(allowedMethods).toContain('POST');
      expect(allowedMethods).toContain('PATCH');
      expect(allowedMethods).toContain('DELETE');
    });
  });

  describe('CORS Headers', () => {
    it('should allow Content-Type and Authorization headers', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Headers', 'Content-Type, Authorization');

      const allowedHeaders = response.headers['access-control-allow-headers'];
      expect(allowedHeaders).toContain('Content-Type');
      expect(allowedHeaders).toContain('Authorization');
    });

    it('should support credentials', async () => {
      const response = await request(app)
        .options('/api/health')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });
  });
});

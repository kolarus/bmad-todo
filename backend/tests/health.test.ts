import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../src/server';

describe('Health Check Endpoint', () => {
  it('should return 200 OK with status and timestamp', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
    expect(response.body).toHaveProperty('service', 'trainingnf-api');
    expect(new Date(response.body.timestamp).toString()).not.toBe('Invalid Date');
  });
});

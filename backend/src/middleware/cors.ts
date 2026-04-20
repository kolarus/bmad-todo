import cors from 'cors';
import { env } from '../config/env';

/**
 * CORS Configuration
 * 
 * Security: Only allows requests from the frontend origin.
 * Development: localhost:3000 (Next.js dev server)
 * Production: Will be updated via environment variable
 */

const allowedOrigins = env.ALLOWED_ORIGINS
  .split(',')
  .map((o) => o.trim());

export const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) {
      return callback(null, true);
    }
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

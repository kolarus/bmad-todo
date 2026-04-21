import express, { Request, Response } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { corsOptions } from './middleware/cors';
import { prisma } from './lib/prisma';
import todoRouter from './routes/todo.routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    environment: env.NODE_ENV,
    timestamp: new Date().toISOString(),
    service: 'trainingnf-api'
  });
});

// Database health check endpoint
app.get('/api/health/db', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Todo routes
app.use('/api/todos', todoRouter);

// Error handler (must be after all routes)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

// Start server only if not in test environment
if (env.NODE_ENV !== 'test') {
  app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
    console.log(`Health check: http://localhost:${env.PORT}/api/health`);
    console.log(`Database health: http://localhost:${env.PORT}/api/health/db`);
    console.log(`Environment: ${env.NODE_ENV}`);
    console.log(`Allowed origins: ${env.ALLOWED_ORIGINS}`);
  });
}

// Export app and prisma for testing
export default app;
export { prisma };

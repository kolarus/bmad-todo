import { defineConfig } from 'vitest/config';
import dotenv from 'dotenv';

// Load environment variables before tests run
dotenv.config();
process.env.NODE_ENV = 'test';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    globalSetup: './tests/global-setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/']
    }
  }
});

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30_000,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  fullyParallel: false,
  use: {
    baseURL: process.env.BASE_URL ?? 'http://localhost:3000',
    screenshot: 'only-on-failure',
    video: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  reporter: process.env.CI ? 'list' : [['html', { open: 'never' }], ['list']],
});

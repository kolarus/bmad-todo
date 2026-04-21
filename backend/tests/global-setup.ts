import { execSync } from 'child_process';

export async function setup() {
  const composeFile = new URL('../../docker-compose.yml', import.meta.url)
    .pathname;

  // Start postgres if not already running
  execSync(`docker compose -f ${composeFile} up -d postgres`, {
    stdio: 'pipe',
  });

  // Wait for healthy status (up to 30s)
  const maxAttempts = 15;
  for (let i = 0; i < maxAttempts; i++) {
    try {
      const status = execSync(
        `docker compose -f ${composeFile} ps postgres --format "{{.Status}}"`,
        { stdio: 'pipe' }
      )
        .toString()
        .trim();
      if (status.includes('healthy')) return;
    } catch {
      // container may not exist yet
    }
    await new Promise((r) => setTimeout(r, 2000));
  }

  throw new Error('Postgres container did not become healthy within 30s');
}

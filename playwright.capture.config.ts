import { defineConfig } from '@playwright/test'

// Explicit opt-in: creates demo media using isolated browser profiles.
export default defineConfig({
  testDir: './tests',
  testMatch: '**/demo-*-capture.spec.ts',
  timeout: 180_000,
  workers: 1,
  use: { baseURL: 'http://localhost:5194', browserName: 'chromium', headless: true },
  webServer: { command: 'npm run dev -- --port 5194 --strictPort', url: 'http://localhost:5194', reuseExistingServer: true },
})

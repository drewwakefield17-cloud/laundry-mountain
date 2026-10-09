import { defineConfig } from '@playwright/test'
export default defineConfig({
  testDir: './tests',
  // Recording recipes are explicit production tools, not regression checks.
  testIgnore: '**/demo-*-capture.spec.ts',
  timeout: 45_000,
  use: { baseURL: 'http://localhost:5173', browserName: 'chromium', headless: true },
  webServer: { command: 'npm run dev -- --port 5173', url: 'http://localhost:5173', reuseExistingServer: true },
})

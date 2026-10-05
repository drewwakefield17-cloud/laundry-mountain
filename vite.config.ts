import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import os from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
const cacheDir = process.platform === 'win32'
  ? path.join(os.tmpdir(), `laundry-mountain-vite-${createHash('sha256').update(process.cwd()).digest('hex').slice(0, 12)}`)
  : undefined
export default defineConfig({ root: process.cwd(), cacheDir, resolve: { preserveSymlinks: true }, plugins: [react()], test: { include: ['src/**/*.test.ts'] } })

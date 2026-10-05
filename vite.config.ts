import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { execFileSync } from 'node:child_process'

// Vite treats '#' in an absolute Windows path as a URL fragment.
// Use the existing 8.3 alias for this same checkout; no copying or renaming.
const root = process.platform === 'win32' && process.cwd().includes('#')
  ? execFileSync('cmd.exe', ['/d', '/c', 'for %I in (.) do @echo %~sI'], { encoding: 'utf8' }).trim()
  : process.cwd()
export default defineConfig({ root, server: { fs: { allow: [root, process.cwd()] } }, resolve: { preserveSymlinks: true }, plugins: [react()] })

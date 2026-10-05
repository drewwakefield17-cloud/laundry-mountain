import { execFileSync, spawnSync } from 'node:child_process'
import path from 'node:path'

const root = process.platform === 'win32' && process.cwd().includes('#')
  ? execFileSync('cmd.exe', ['/d', '/c', 'for %I in (.) do @echo %~sI'], { encoding: 'utf8' }).trim()
  : process.cwd()
const [tool, ...args] = process.argv.slice(2)
const entries = { vite: 'vite/bin/vite.js', vitest: 'vitest/vitest.mjs' }
if (!(tool in entries)) throw new Error('Unsupported tool')
const result = spawnSync(process.execPath, ['--preserve-symlinks', '--preserve-symlinks-main', path.join(root, 'node_modules', entries[tool]), ...args, '--config', path.join(root, 'vite.config.ts')], { cwd: root, stdio: 'inherit' })
if (result.error) throw result.error
process.exit(result.status ?? 1)

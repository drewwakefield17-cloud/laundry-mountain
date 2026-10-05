import { spawnSync } from 'node:child_process'
import path from 'node:path'
import os from 'node:os'
import { createHash } from 'node:crypto'
import { existsSync, realpathSync, symlinkSync } from 'node:fs'

let root = process.cwd()
// Windows '#' paths break tool module URLs; use a junction to the same files.
// Nothing is copied, moved or rewritten, including Git history.
if (process.platform === 'win32' && root.includes('#')) {
  const alias = path.join(os.tmpdir(), `laundry-mountain-${createHash('sha256').update(root).digest('hex').slice(0, 12)}`)
  if (!existsSync(alias)) symlinkSync(root, alias, 'junction')
  if (realpathSync.native(alias) !== realpathSync.native(root)) throw new Error('Runtime junction points to a different workspace')
  root = alias
}
const [tool, ...args] = process.argv.slice(2)
const entries = { vite: 'vite/bin/vite.js', vitest: 'vitest/vitest.mjs' }
if (!(tool in entries)) throw new Error('Unsupported tool')
const result = spawnSync(process.execPath, ['--preserve-symlinks', '--preserve-symlinks-main', path.join(root, 'node_modules', entries[tool]), ...args, '--config', path.join(root, 'vite.config.ts')], { cwd: root, stdio: 'inherit' })
if (result.error) throw result.error
process.exit(result.status ?? 1)

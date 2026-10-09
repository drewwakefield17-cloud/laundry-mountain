import { MOUNTAINS, type MountainId } from './mountains'

export function expeditionProgress(metres: number, mountainId: MountainId = 'ben-nevis') {
  const mountain = MOUNTAINS[mountainId]
  // Keep the ledger's metre value: normalising and multiplying it back can turn
  // 250 into 249.99999999997 and incorrectly show 251 m to the next checkpoint.
  const distance = Math.max(0, Math.min(mountain.elevation, Number.isFinite(metres) ? metres : 0))
  const current = mountain.checkpoints.filter(c => c.metres <= distance + .0001).at(-1)!
  const next = mountain.checkpoints.find(c => c.metres > distance + .0001)
  return { current, next, remaining: next ? Math.ceil(next.metres - distance) : 0, summit: !next }
}

import { MOUNTAINS, type MountainId } from './mountains'

/** Presentation along the foreground path; geographic position remains in routePosition. */
export function climbPresentation(metres: number, mountainId: MountainId = 'ben-nevis') {
  const safe = Math.min(MOUNTAINS[mountainId].elevation, Math.max(0, Number.isFinite(metres) ? metres : 0))
  const p = safe / MOUNTAINS[mountainId].elevation
  return { metres: safe, x: 27 + p * 52, y: 88 - p * 40, scale: 1 - p * .4 }
}

export function crossedCheckpoint(previous: number, next: number, mountainId: MountainId = 'ben-nevis') {
  return next > previous && MOUNTAINS[mountainId].checkpoints.some(c => c.metres > previous && c.metres <= next)
}

/** The close camera shows the current checkpoint approach, not all 1,345 m. */
export function climbLeg(metres: number, mountainId: MountainId = 'ben-nevis') {
  const mountain = MOUNTAINS[mountainId]
  const safe = climbPresentation(metres, mountainId).metres
  let end = mountain.checkpoints.find(c => c.metres > safe)?.metres ?? mountain.elevation
  let start = [...mountain.checkpoints].reverse().find(c => c.metres < end)?.metres ?? 0
  if (mountainId !== 'ben-nevis') {
    // Keep individual items visibly moving on longer expeditions. These are close
    // camera approaches, not additional checkpoints or earned rewards.
    const sections = Math.ceil((end - start) / 250)
    const length = (end - start) / sections
    const section = Math.min(sections - 1, Math.floor((safe - start) / length))
    start += section * length
    end = start + length
  }
  return { metres: safe, start, end, fraction: (safe - start) / (end - start) }
}

export function climbTravel(previous: number, next: number, mountainId: MountainId = 'ben-nevis') {
  const before = climbLeg(previous, mountainId), after = climbLeg(next, mountainId)
  const moving = after.metres > before.metres
  const checkpoint = moving && crossedCheckpoint(before.metres, after.metres, mountainId)
  const stageReset = moving && after.start !== before.start && after.fraction !== 1
  const to = checkpoint || stageReset ? 1 : after.fraction
  const duration = moving ? Math.max(600, Math.min(2400, Math.ceil((to - before.fraction) * 4) * 600)) : 0
  return { from: before.fraction, to, settled: after.fraction, duration, checkpoint, stageReset }
}

type SceneLayout = 'climb' | 'session' | 'landscape'
const approaches: Record<SceneLayout, ReadonlyArray<readonly [number, number]>> = {
  climb: [[41,79],[48,74],[56,69],[58,60],[60,54]],
  session: [[43,88],[51,84],[61,79],[64,73],[66,66]],
  landscape: [[50,84],[57,78],[64,72],[68,65],[71,58]],
}

export function climbSceneFrame(layout: SceneLayout, fraction: number) {
  const p = Math.max(0, Math.min(1, fraction))
  const path = approaches[layout]
  const index = Math.min(path.length - 2, Math.floor(p * (path.length - 1)))
  const t = p * (path.length - 1) - index
  const a = path[index], b = path[index + 1]
  return { x: a[0] + (b[0] - a[0]) * t, y: a[1] + (b[1] - a[1]) * t, scale: 1 - p * .48 }
}

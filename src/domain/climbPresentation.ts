import { BEN_NEVIS } from './config'

/** Presentation along the foreground path; geographic position remains in routePosition. */
export function climbPresentation(metres: number) {
  const safe = Math.min(BEN_NEVIS.elevation, Math.max(0, Number.isFinite(metres) ? metres : 0))
  const p = safe / BEN_NEVIS.elevation
  return { metres: safe, x: 27 + p * 52, y: 88 - p * 40, scale: 1 - p * .4 }
}

export function crossedCheckpoint(previous: number, next: number) {
  return next > previous && BEN_NEVIS.checkpoints.some(c => c.metres > previous && c.metres <= next)
}

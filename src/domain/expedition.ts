import { BEN_NEVIS } from './config'

export function routePosition(metres: number) {
  const route = BEN_NEVIS.route
  const progress = Math.max(0, Math.min(1, Number.isFinite(metres) ? metres / BEN_NEVIS.elevation : 0))
  const t = progress * (route.length - 1)
  const index = Math.min(route.length - 2, Math.floor(t)), fraction = t - index
  return { x: route[index][0] + (route[index + 1][0] - route[index][0]) * fraction,
    y: route[index][1] + (route[index + 1][1] - route[index][1]) * fraction, progress }
}

export function expeditionProgress(metres: number) {
  const position = routePosition(metres)
  const current = BEN_NEVIS.checkpoints.filter(c => c.metres <= position.progress * BEN_NEVIS.elevation + .0001).at(-1)!
  const next = BEN_NEVIS.checkpoints.find(c => c.metres > position.progress * BEN_NEVIS.elevation + .0001)
  return { current, next, remaining: next ? Math.ceil(next.metres - position.progress * BEN_NEVIS.elevation) : 0, summit: !next }
}

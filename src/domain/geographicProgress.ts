import { BEN_NEVIS } from './config'
import { BEN_NEVIS_TRAIL } from './terrain'

// Only the preserved geographic renderer needs the elevation mesh. The normal
// illustrated game and ledger must not download it to calculate progress.
export function routePosition(metres: number) {
  const route = BEN_NEVIS_TRAIL
  const progress = Math.max(0, Math.min(1, Number.isFinite(metres) ? metres / BEN_NEVIS.elevation : 0))
  const t = progress * (route.length - 1)
  const index = Math.min(route.length - 2, Math.floor(t)), fraction = t - index
  return { x: route[index][0] + (route[index + 1][0] - route[index][0]) * fraction,
    y: route[index][1] + (route[index + 1][1] - route[index][1]) * fraction, progress }
}

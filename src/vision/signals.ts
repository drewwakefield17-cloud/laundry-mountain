export type ZoneName = 'source' | 'work' | 'completed'
export const ZONE_NAMES: ZoneName[] = ['source', 'work', 'completed']
export interface Rect { x: number; y: number; w: number; h: number }
export type Zones = Record<ZoneName, Rect>
export const DEFAULT_ZONES: Zones = {
  source: { x: 0.03, y: 0.28, w: 0.26, h: 0.62 },
  work: { x: 0.34, y: 0.28, w: 0.32, h: 0.62 },
  completed: { x: 0.71, y: 0.28, w: 0.26, h: 0.62 },
}
export const VISION = {
  fps: 8, width: 160, height: 90, pixelDelta: 24,
  motionThreshold: 0.055, stableThreshold: 0.02, occupancyThreshold: 0.045,
  placementThreshold: 0.06, minimumWorkMs: 2200, minimumMotionMs: 700,
  stableMs: 1400, cooldownMs: 2500, cycleTimeoutMs: 90_000, maxOutsideMotion: 0.55,
}
export type VisionConfig = typeof VISION
export interface Signals {
  at: number
  motion: Record<ZoneName, number>
  occupancy: Record<ZoneName, number>
  outsideMotion: number
}

// Occupancy means visual difference from the calibrated empty surface, not semantic clothing recognition.
export function difference(a: Uint8ClampedArray, b: Uint8ClampedArray, rect: Rect, width: number, height: number, threshold: number) {
  let changed = 0, count = 0
  for (let y = Math.floor(rect.y * height); y < Math.min(height, Math.ceil((rect.y + rect.h) * height)); y++) {
    for (let x = Math.floor(rect.x * width); x < Math.min(width, Math.ceil((rect.x + rect.w) * width)); x++) {
      const i = (y * width + x) * 4
      const delta = (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2])) / 3
      if (delta > threshold) changed++
      count++
    }
  }
  return count ? changed / count : 0
}

export function extractSignals(frame: Uint8ClampedArray, previous: Uint8ClampedArray, baseline: Uint8ClampedArray, zones: Zones, at: number, config = VISION): Signals {
  const motion = {} as Signals['motion'], occupancy = {} as Signals['occupancy']
  for (const name of ZONE_NAMES) {
    motion[name] = difference(frame, previous, zones[name], config.width, config.height, config.pixelDelta)
    occupancy[name] = difference(frame, baseline, zones[name], config.width, config.height, config.pixelDelta)
  }
  // Top strip is deliberately outside the laundry regions: catches broad lighting/camera disturbances.
  const outsideMotion = difference(frame, previous, { x: 0, y: 0, w: 1, h: 0.18 }, config.width, config.height, config.pixelDelta)
  return { at, motion, occupancy, outsideMotion }
}

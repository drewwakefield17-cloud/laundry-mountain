import { describe, expect, it } from 'vitest'
import { BEN_NEVIS_GEOGRAPHY as geo, BEN_NEVIS_TRAIL, heightAt, projectWorld, scenePoint } from './terrain'

describe('Ben Nevis geography', () => {
  it('retains a plausible measured summit and low Glen Nevis start', () => {
    const [sx, sz] = geo.summit
    expect(heightAt(sx, sz)).toBeGreaterThan(1.29)
    expect(heightAt(sx, sz)).toBeLessThan(1.37)
    const [x, z] = geo.route[0]
    expect(heightAt(x, z)).toBeLessThan(0.08)
    expect(geo.heights).toHaveLength(geo.grid.size ** 2)
  })
  it('ends the game route at the mapped summit and retains the named lochan', () => {
    const summit = projectWorld(geo.summit[0], geo.summit[1])
    expect(BEN_NEVIS_TRAIL.at(-1)![0]).toBeCloseTo(summit.x, 5)
    expect(BEN_NEVIS_TRAIL.at(-1)![1]).toBeCloseTo(summit.y, 5)
    expect(geo.features.some((f) => f.kind === 'water' && f.name === 'Lochan Meall an t-Suidhe')).toBe(true)
  })
  it('preserves projected proportions through portrait and landscape resizing', () => {
    const a = projectWorld(-1, 0, 0.2),
      b = projectWorld(1, 1, 1.1)
    const ratios = [
      [390, 700],
      [844, 390],
      [260, 180]
    ].map(([w, h]) => {
      const p = scenePoint(a, w, h),
        q = scenePoint(b, w, h)
      return (q.y - p.y) / (q.x - p.x)
    })
    expect(ratios[1]).toBeCloseTo(ratios[0], 10)
    expect(ratios[2]).toBeCloseTo(ratios[0], 10)
  })
})

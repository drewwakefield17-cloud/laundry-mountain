import { describe, expect, it } from 'vitest'
import {
  BEN_NEVIS_GEOGRAPHY as geo,
  BEN_NEVIS_TRAIL,
  heightAt,
  projectWorld,
  scenePoint,
  landscapeCamera,
  overviewProjection
} from './terrain'

describe('Ben Nevis geography', () => {
  it('recomposes the same mapped route for wide and portrait without moving checkpoints', () => {
    for (const [w, h] of [[390, 772], [844, 326], [667, 311]]) {
      const view = overviewProjection(w, h)
      const first = view.point(view.project(...geo.route[0] as [number, number]))
      const summit = view.point(view.project(...geo.summit as [number, number]))
      expect(view.position(0)).toEqual(first)
      expect(view.position(1).x).toBeCloseTo(summit.x, 4)
      expect(view.position(1).y).toBeCloseTo(summit.y, 4)
      for (let i = 0; i <= 100; i++) {
        const p = view.position(i / 100)
        expect(p.x).toBeGreaterThan(40)
        expect(p.x).toBeLessThan(w - 40)
        expect(p.y).toBeGreaterThanOrEqual(64)
        expect(p.y).toBeLessThan(h - 100)
      }
      // A landscape journey must actually use the available horizontal space.
      if (view.wide) expect(Math.abs(summit.x - first.x)).toBeGreaterThan(w * .4)
    }
  })
  it('retains a plausible measured summit and low Glen Nevis start', () => {
    const [sx, sz] = geo.summit
    expect(heightAt(sx, sz)).toBeGreaterThan(1.29)
    expect(heightAt(sx, sz)).toBeLessThan(1.37)
    const [x, z] = geo.route[0]
    expect(heightAt(x, z)).toBeLessThan(0.08)
    expect(geo.heights).toHaveLength(geo.grid.size ** 2)
  })
  it('joins the refined cliffs to the wider terrain without height jumps', () => {
    for (let i = 0; i <= 20; i++) {
      const x = (i * 3.5) / 20,
        z = -1.5 + (i * 3.5) / 20
      for (const edge of [0, 3.5])
        expect(Math.abs(heightAt(edge - 1e-6, z) - heightAt(edge + 1e-6, z))).toBeLessThan(1e-4)
      for (const edge of [-1.5, 2])
        expect(Math.abs(heightAt(x, edge - 1e-6) - heightAt(x, edge + 1e-6))).toBeLessThan(1e-4)
    }
  })
  it('ends the game route at the mapped summit and retains the named lochan', () => {
    const summit = projectWorld(geo.summit[0], geo.summit[1])
    expect(BEN_NEVIS_TRAIL.at(-1)![0]).toBeCloseTo(summit.x, 5)
    expect(BEN_NEVIS_TRAIL.at(-1)![1]).toBeCloseTo(summit.y, 5)
    expect(
      geo.features.some((f) => f.kind === 'water' && f.name === 'Lochan Meall an t-Suidhe')
    ).toBe(true)
  })
  it('centres the scenic camera on its look target and preserves upward elevation', () => {
    const target = landscapeCamera.project(1.7, -0.65, 0.85)
    expect(target.x).toBeCloseTo(0.6, 8)
    expect(target.y).toBeCloseTo(0.5, 8)
    expect(landscapeCamera.project(1.7, -0.65, 1.3).y).toBeLessThan(target.y)
    expect(landscapeCamera.depth(1.7, -0.65, 0.85)).toBeGreaterThan(0)
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
  it('keeps the full mapped route clear of the phone header and view controls', () => {
    for (const [width, height] of [
      [390, 711],
      [844, 316],
      [320, 560]
    ]) {
      for (const [x, y] of BEN_NEVIS_TRAIL) {
        const p = scenePoint({ x, y }, width, height)
        expect(p.x).toBeGreaterThanOrEqual(width * 0.08 - 0.01)
        expect(p.x).toBeLessThanOrEqual(width * 0.92 + 0.01)
        expect(p.y).toBeGreaterThanOrEqual(Math.min(92, height * 0.25) - 0.01)
        expect(p.y).toBeLessThanOrEqual(height - Math.min(92, height * 0.25) + 0.01)
      }
    }
  })
})

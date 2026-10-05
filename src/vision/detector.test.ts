import { describe, expect, it } from 'vitest'
import { FoldingDetector } from './detector'
import type { Signals } from './signals'

function signal(at: number, motion: number[] = [0, 0, 0], work = 0): Signals {
  return { at, motion: { source: motion[0], work: motion[1], completed: motion[2] }, occupancy: { source: .5, work, completed: .2 }, outsideMotion: 0 }
}
function cycle(d: FoldingDetector, start: number) {
  let count = 0
  d.update(signal(start, [.2, 0, 0]), 0)
  d.update(signal(start + 125, [0, .2, 0], .4), 0)
  for (let t = 250; t <= 3000; t += 125) count += Number(d.update(signal(start + t, [0, .2, 0], .4), 0))
  d.update(signal(start + 3125, [0, .1, .2], .2), .2)
  for (let t = 3250; t <= 9000; t += 125) count += Number(d.update(signal(start + t), .2))
  return count
}
describe('folding temporal evidence', () => {
  it('counts one ordered cycle once, even with a persistent stack', () => expect(cycle(new FoldingDetector(), 1000)).toBe(1))
  it('rearms and counts a second cycle', () => {
    const d = new FoldingDetector()
    expect(cycle(d, 1000) + cycle(d, 12_000)).toBe(2)
  })
  it('rejects work-only waving and placement-only movement', () => {
    const d = new FoldingDetector()
    let count = 0
    for (let t = 1000; t < 121_000; t += 125) count += Number(d.update(signal(t, [0, .3, .3], .5), .5))
    expect(count).toBe(0)
  })
  it('rejects a fast source-to-destination transfer', () => {
    const d = new FoldingDetector()
    d.update(signal(1000, [.2, 0, 0]), 0)
    d.update(signal(1125, [0, .2, 0], .4), 0)
    expect(d.update(signal(1250, [0, 0, .2]), .2)).toBe(false)
    expect(d.stage).toBe('working')
  })
  it('rejects missing stable placement or uncleared workspace', () => {
    const d = new FoldingDetector()
    d.update(signal(1000, [.2, 0, 0]), 0)
    d.update(signal(1125, [0, .2, 0], .4), 0)
    for (let t = 1250; t < 5000; t += 125) d.update(signal(t, [0, .2, 0], .4), 0)
    d.update(signal(5000, [0, 0, .3], .4), .3)
    for (let t = 5125; t < 10_000; t += 125) expect(d.update(signal(t, [0, 0, 0], .4), .3)).toBe(false)
  })
  it('discards stale cycles after a camera gap', () => {
    const d = new FoldingDetector()
    d.update(signal(1000, [.2, 0, 0]), 0)
    d.update(signal(1125, [0, .2, 0], .4), 0)
    expect(d.update(signal(9000), .4)).toBe(false)
    expect(d.stage).toBe('ready')
  })
  it('rejects a broad lighting/camera disturbance', () => {
    const d = new FoldingDetector()
    const s = signal(1000, [.9, .9, .9], .9); s.outsideMotion = .9
    expect(d.update(s, .9)).toBe(false)
    expect(d.stage).toBe('ready')
  })
})

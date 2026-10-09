import { describe, it, expect } from 'vitest'
import { achievements, newlyEarned } from './achievements'
describe('achievement presentation uses actual progression', () => {
  it('does not award the first load for a merely active batch', () => {
    const earned = achievements({ loads: 0, best: 10, metres: 100 }).filter(b => b.earned).map(b => b.id)
    expect(earned).toEqual(['roll', 'climber'])
  })
  it('reveals each crossed threshold once and preserves the existing item rule', () => {
    const before = { loads: 0, best: 10, metres: 100 }, after = { loads: 0, best: 25, metres: 250 }
    expect(newlyEarned(before, after).map(b => b.id)).toEqual(['glen', 'steady'])
    expect(newlyEarned(after, after)).toEqual([])
    expect(newlyEarned(after, { ...after, loads: 1 }).map(b => b.id)).toEqual(['first'])
  })
})

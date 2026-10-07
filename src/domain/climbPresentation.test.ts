import { describe, expect, it } from 'vitest'
import { climbPresentation, crossedCheckpoint } from './climbPresentation'

describe('climb companion presentation', () => {
  it('restores the same position from saved metres and moves uphill as progress increases', () => {
    const before = climbPresentation(240), after = climbPresentation(250)
    expect(after.x).toBeGreaterThan(before.x)
    expect(after.y).toBeLessThan(before.y)
    expect(climbPresentation(JSON.parse('250'))).toEqual(after)
  })
  it('celebrates only a newly crossed milestone, never a reload or replay', () => {
    expect(crossedCheckpoint(240, 250)).toBe(true)
    expect(crossedCheckpoint(250, 250)).toBe(false)
    expect(crossedCheckpoint(250, 260)).toBe(false)
    expect(crossedCheckpoint(260, 240)).toBe(false)
    expect(crossedCheckpoint(1340, 1345)).toBe(true)
  })
  it('keeps invalid, negative and post-summit positions on the trail', () => {
    expect(climbPresentation(NaN)).toEqual(climbPresentation(0))
    expect(climbPresentation(-10)).toEqual(climbPresentation(0))
    expect(climbPresentation(2000)).toEqual(climbPresentation(1345))
  })
})

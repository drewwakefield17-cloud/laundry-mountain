import { describe, expect, it } from 'vitest'
import { climbPresentation, crossedCheckpoint, climbLeg, climbTravel, climbSceneFrame } from './climbPresentation'

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
  it('shows visible travel for an ordinary batch toward the next checkpoint', () => {
    const before = climbSceneFrame('session', climbLeg(10).fraction)
    const after = climbSceneFrame('session', climbLeg(110).fraction)
    // 390px phone, source scene 1122x1402: measure actual projected foot travel.
    const distance = Math.hypot((after.x-before.x)*3.9, (after.y-before.y)*1402/1122*3.9)
    expect(distance).toBeGreaterThan(50)
    expect(after.y).toBeLessThan(before.y)
    expect(after.scale).toBeLessThan(before.scale)
    expect(climbTravel(10,110).duration).toBeGreaterThanOrEqual(1200)
  })
  it('arrives at a crossed sock before staging the following approach', () => {
    expect(climbTravel(240,260)).toMatchObject({to:1, settled:.04, checkpoint:true})
    expect(climbLeg(250)).toMatchObject({start:250,end:500,fraction:0})
    expect(climbLeg(1345)).toMatchObject({end:1345,fraction:1})
    expect(climbTravel(1340,1345)).toMatchObject({to:1, settled:1, checkpoint:true})
  })
  it('does not walk again on reload, replay, or post-summit banking', () => {
    expect(climbTravel(100,100).duration).toBe(0)
    expect(climbTravel(1345,1500).duration).toBe(0)
    expect(climbLeg(100)).toEqual(climbLeg(JSON.parse('100')))
    expect(climbLeg(NaN)).toEqual(climbLeg(0))
  })
})

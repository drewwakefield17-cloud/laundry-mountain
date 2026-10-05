import { expect, it } from 'vitest'
import { expeditionProgress, routePosition } from './expedition'
it('restores route coordinates from saved metres and clamps the summit', () => {
  expect(routePosition(-10)).toEqual(routePosition(0))
  expect(routePosition(1500)).toEqual(routePosition(1345))
  const saved = JSON.parse(JSON.stringify({ metres: 712.5 }))
  expect(routePosition(saved.metres)).toEqual(routePosition(712.5))
  expect(routePosition(10).y).toBeLessThan(routePosition(0).y)
})
it('advances checkpoints exactly at their target, without a next checkpoint after the summit', () => {
  expect(expeditionProgress(249).remaining).toBe(1)
  expect(expeditionProgress(250).current.name).toBe('Into the glen')
  expect(expeditionProgress(250).next?.metres).toBe(500)
  expect(expeditionProgress(1345)).toMatchObject({ summit: true, remaining: 0, next: undefined })
})

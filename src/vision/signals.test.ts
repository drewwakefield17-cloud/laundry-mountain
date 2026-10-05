import { expect, it } from 'vitest'
import { difference } from './signals'
it('measures changed pixels in the selected region only', () => {
  const a = new Uint8ClampedArray(4 * 4 * 4), b = a.slice()
  for (let y = 0; y < 4; y++) for (let x = 0; x < 2; x++) for (let c = 0; c < 3; c++) b[(y * 4 + x) * 4 + c] = 100
  expect(difference(a, b, { x: 0, y: 0, w: .5, h: 1 }, 4, 4, 24)).toBe(1)
  expect(difference(a, b, { x: .5, y: 0, w: .5, h: 1 }, 4, 4, 24)).toBe(0)
})

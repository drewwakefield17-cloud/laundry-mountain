import { expect, it } from 'vitest'
import { testInstruction } from './FieldTestGuide'
const session = { active: false, elapsed: 0, count: 0 }
it('advances setup instructions without implying garment or empty-area recognition', () => {
  expect(testInstruction('camera', session).step).toBe(1)
  expect(testInstruction('framing', session).step).toBe(2)
  expect(testInstruction('calibrating', session).step).toBe(3)
  expect(testInstruction('ready', session).text).toContain('Check Fold here and Completed were empty')
})
it('uses physical item total rather than assuming automatic count equals accuracy', () => {
  expect(testInstruction('ready', { ...session, active: true, kind: 'folding', count: 20, stage: 'working' }).detail).toContain('finish after 20 physical items')
  expect(testInstruction('ready', { ...session, active: true, kind: 'folding', stage: 'cooldown' }).text).toContain('Wait for Ready')
})
it('guides the complete two-minute negative control and never describes detections as rewards', () => {
  for (const [elapsed, expected] of [[0, 'Pause'], [40, 'Wave'], [80, 'Rearrange'], [120, 'Finish test']] as const) {
    const instruction = testInstruction('ready', { ...session, active: true, kind: 'negative-control', elapsed, count: 1 })
    expect(instruction.text).toContain(expected)
    expect(instruction.detail).toContain('no metres awarded')
  }
})
it('instructs report saving and explicitly handles restore failure', () => {
  expect(testInstruction('ready', { ...session, reportKind: 'folding' }).step).toBe(5)
  expect(testInstruction('ready', { ...session, reportKind: 'negative-control', reportSeconds: 120 }).step).toBe(7)
  expect(testInstruction('ready', { ...session, reportKind: 'negative-control', reportSeconds: 10 }).title).toBe('Control stopped early')
  expect(testInstruction('camera', { ...session, returnCheck: 'failed', savedMetres: 10 }).title).toContain('did not match')
})

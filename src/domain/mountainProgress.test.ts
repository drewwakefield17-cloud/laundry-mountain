import { describe, expect, it } from 'vitest'
import { appendEvent, emptyLedger, parseLedger, summary } from './ledger'
import { manualBatch, reconcileManualSession, type Session } from './manualSession'
import { mountainProgress, nextUnfinishedMountain } from './mountainProgress'
import { expeditionProgress } from './expedition'
import { climbLeg, climbTravel, climbSceneFrame } from './climbPresentation'

describe('three-mountain progression', () => {
  it('keeps original saves intact and does not turn historical excess into new awards', () => {
    const old = appendEvent(emptyLedger(), manualBatch('legacy', 'old', 140, 'folding', 1))
    const snapshot = JSON.stringify(old)
    expect(mountainProgress(parseLedger(snapshot))).toMatchObject({
      'ben-nevis': { metres: 1345, summit: true, unlocked: true },
      fuji: { metres: 0, summit: false, unlocked: true },
      everest: { metres: 0, unlocked: false },
    })
    expect(JSON.stringify(old)).toBe(snapshot)
    expect(summary(old).lifetimeMetres).toBe(1400)
  })

  it('allocates a summit-crossing batch once, carries its excess, and survives save/reload', () => {
    let ledger = appendEvent(emptyLedger(), manualBatch('base', 's', 130, 'folding', 1, 'ben-nevis'))
    expect(mountainProgress(ledger).fuji.unlocked).toBe(false)
    const crossing = manualBatch('crossing', 's', 10, 'folding', 2, 'ben-nevis')
    ledger = appendEvent(ledger, crossing)
    ledger = appendEvent(ledger, crossing)
    const restored = parseLedger(JSON.stringify(ledger))
    expect(summary(restored)).toMatchObject({ items: 140, lifetimeMetres: 1400 })
    expect(mountainProgress(restored)).toMatchObject({
      'ben-nevis': { metres: 1345, summit: true }, fuji: { metres: 55, unlocked: true }, everest: { metres: 0, unlocked: false },
    })
    expect(nextUnfinishedMountain(restored, 'ben-nevis')).toBe('fuji')
  })

  it('uses each mountain’s checkpoints and elevation for movement and summit handoff', () => {
    expect(expeditionProgress(800, 'fuji')).toMatchObject({ current: { name: 'Out of the forest' }, remaining: 1000 })
    expect(expeditionProgress(6800, 'everest')).toMatchObject({ current: { name: 'On top of the washing' }, remaining: 2049 })
    expect(expeditionProgress(8849, 'everest').summit).toBe(true)
    expect(climbTravel(790, 810, 'fuji')).toMatchObject({ checkpoint: true, to: 1, settled: .04 })
    expect(climbLeg(5000, 'everest').fraction).toBeCloseTo((800 - 3 * (2600 / 11)) / (2600 / 11))
    expect(climbTravel(3776, 5000, 'fuji').duration).toBe(0)
  })

  it('keeps session counts tied to the ledger when a batch continues into another peak', () => {
    const ledger = appendEvent(emptyLedger(), manualBatch('a', 's', 500, 'ironing', 1, 'ben-nevis'))
    const session: Session = { id: 's', startedAt: 1, load: 'Laundry', mode: 'manual', mountainId: 'ben-nevis', status: 'active', items: 0, metres: 0, base: 0 }
    expect(reconcileManualSession(session, ledger)).toMatchObject({ items: 500, metres: 5000, mountainId: 'ben-nevis' })
    expect(mountainProgress(ledger).fuji.metres).toBe(3655)
  })

  it('keeps single-item travel visible on the longer mountains without inventing checkpoints', () => {
    for (const id of ['fuji', 'everest'] as const) {
      const travel = climbTravel(20, 30, id)
      const before = climbSceneFrame('session', travel.from)
      const after = climbSceneFrame('session', travel.to)
      expect(Math.hypot(after.x - before.x, after.y - before.y) * 390 / 100).toBeGreaterThan(4)
      expect(travel.checkpoint).toBe(false)
      expect(climbTravel(190, 210, 'fuji')).toMatchObject({ stageReset: true, checkpoint: false })
    }
  })

  it('preserves individual positions through Fuji → Everest and continues lifetime counting after all summits', () => {
    let ledger = appendEvent(emptyLedger(), manualBatch('ben', 's1', 135, 'folding', 1, 'ben-nevis'))
    ledger = appendEvent(ledger, manualBatch('fuji', 's2', 380, 'hanging', 2, 'fuji'))
    const peaks = mountainProgress(ledger)
    expect(peaks['ben-nevis'].metres).toBe(1345)
    expect(peaks.fuji).toMatchObject({ metres: 3776, summit: true })
    expect(peaks.everest).toMatchObject({ metres: 29, unlocked: true })
    expect(nextUnfinishedMountain(ledger, 'fuji')).toBe('everest')
    ledger = appendEvent(ledger, manualBatch('everest1', 's3', 500, 'folding', 3, 'everest'))
    ledger = appendEvent(ledger, manualBatch('everest2', 's3', 400, 'folding', 4, 'everest'))
    expect(mountainProgress(ledger).everest).toMatchObject({ metres: 8849, summit: true })
    expect(summary(ledger).lifetimeMetres).toBe(14150)
    expect(summary(ledger).items).toBe(1415)
  })

  it('rejects unknown expedition identifiers without replacing the saved ledger', () => {
    const bad = JSON.stringify({ version: 1, events: [{ ...manualBatch('a', 's', 1, 'folding', 1), mountainId: 'unknown' }] })
    expect(() => parseLedger(bad)).toThrow('Unknown saved mountain')
  })
})

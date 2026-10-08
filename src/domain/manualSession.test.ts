import { describe, expect, it } from 'vitest'
import { appendEvent, emptyLedger, parseLedger, summary } from './ledger'
import { manualBatch, reconcileManualSession, sessionSeconds, type Session } from './manualSession'

const session: Session = { id: 's', startedAt: 1000, mode: 'manual', load: 'Laundry', items: 0, metres: 0, base: 0, status: 'active' }
describe('manual session integrity', () => {
  it('banks batches once without pretending to establish momentum', () => {
    const batch = manualBatch('batch', 's', 25, 'folding', 2000)
    let ledger = appendEvent(emptyLedger(), batch)
    ledger = appendEvent(ledger, batch)
    ledger = appendEvent(ledger, manualBatch('next', 's', 3, 'hanging', 2100))
    expect(summary(parseLedger(JSON.stringify(ledger)))).toMatchObject({items:28,lifetimeMetres:280,best:0})
    expect(reconcileManualSession(session, ledger)).toMatchObject({items:28,metres:280,base:280})
  })
  it('rejects invalid batch counts instead of crediting ambiguous input', () => {
    for (const count of [-1, 0, 1.2, NaN, Infinity, 501]) {
      expect(() => manualBatch('b', 's', count, 'ironing', 2000)).toThrow()
      expect(() => parseLedger(JSON.stringify({version:1,events:[{id:'b',sessionId:'s',items:count,action:'folding',at:2000,source:'manual',evidence:'bad'}]}))).toThrow()
    }
  })
  it('retains existing camera rewards while manual batches reset cadence', () => {
    let ledger = emptyLedger()
    for (let i=0;i<5;i++) ledger=appendEvent(ledger,{id:`c${i}`,sessionId:'s',items:1,at:i*1000,source:'camera',action:'folding',evidence:'synthetic'})
    ledger=appendEvent(ledger,manualBatch('b','s',10,'ironing',5000))
    expect(summary(ledger)).toMatchObject({items:15,lifetimeMetres:151,best:5})
    expect(parseLedger(JSON.stringify(ledger)).events[0].source).toBe('camera')
  })
  it('excludes paused time and keeps finished timers fixed', () => {
    expect(sessionSeconds(session,11000)).toBe(10)
    expect(sessionSeconds({...session,pausedAt:11000},91000)).toBe(10)
    expect(sessionSeconds({...session,pausedMs:80000},101000)).toBe(20)
    expect(sessionSeconds({...session,pausedMs:80000,endedAt:101000},201000)).toBe(20)
  })
})

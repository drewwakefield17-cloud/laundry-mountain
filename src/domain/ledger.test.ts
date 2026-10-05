import { describe, expect, it } from 'vitest'
import { appendEvent, emptyLedger, parseLedger, summary } from './ledger'
import type { LaundryEvent } from './events'

const event = (i: number, at = i * 10_000, sessionId = 'one'): LaundryEvent => ({ id: String(i), at, sessionId, action: 'folding', source: 'camera', items: 1, evidence: 'test stream' })
describe('real-event ledger', () => {
  it('starts with no fabricated progress', () => expect(summary(emptyLedger()).lifetimeMetres).toBe(0))
  it('deduplicates retries and restores the same position', () => {
    const ledger = appendEvent(appendEvent(emptyLedger(), event(1)), event(1))
    expect(summary(parseLedger(JSON.stringify(ledger)))).toEqual(summary(ledger))
    expect(summary(ledger).mountainMetres).toBe(10)
  })
  it('applies momentum from the fifth item and resets on inactivity', () => {
    let ledger = emptyLedger()
    for (let i = 1; i <= 5; i++) ledger = appendEvent(ledger, event(i))
    expect(summary(ledger).lifetimeMetres).toBe(51)
    ledger = appendEvent(ledger, event(6, 200_000))
    expect(summary(ledger).lifetimeMetres).toBe(61)
  })
  it('resets momentum for a new session', () => {
    let ledger = emptyLedger()
    for (let i = 1; i <= 5; i++) ledger = appendEvent(ledger, event(i))
    expect(summary(appendEvent(ledger, event(6, 60_000, 'two'))).lifetimeMetres).toBe(61)
  })
  it('clamps mountain progress while lifetime keeps increasing', () => {
    let ledger = emptyLedger()
    for (let i = 0; i < 200; i++) ledger = appendEvent(ledger, event(i))
    expect(summary(ledger).percent).toBe(100)
    expect(summary(ledger).lifetimeMetres).toBeGreaterThan(1345)
  })
  it('does not silently replace corrupted data', () => {
    expect(() => parseLedger('{"version":1,"events":[{"id":"bad"}]}')).toThrow()
    expect(() => parseLedger('{')).toThrow()
  })
})

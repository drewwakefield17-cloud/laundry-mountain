import { BEN_NEVIS, GAME } from './config'
import type { LaundryEvent } from './events'
import { isMountainId } from './mountains'

export const STORAGE_KEY = 'laundry-mountain:phase1:v1'
export interface Ledger { version: 1; events: LaundryEvent[] }
export const emptyLedger = (): Ledger => ({ version: 1, events: [] })

export function appendEvent(ledger: Ledger, event: LaundryEvent): Ledger {
  if (ledger.events.some(e => e.id === event.id)) return ledger
  return { version: 1, events: [...ledger.events, event] }
}

export function summary(ledger: Ledger) {
  let items = 0, lifetimeMetres = 0, streak = 0, best = 0, last = 0, session = ''
  for (const e of ledger.events) {
    if (e.source === 'manual') {
      items += e.items
      lifetimeMetres += e.items * GAME.metresPerItem
      streak = 0; last = 0; session = ''
      continue // A batch count does not establish folding cadence or a speed bonus.
    }
    if (e.items < 0) { items = Math.max(0, items - 1); lifetimeMetres = Math.max(0, lifetimeMetres - GAME.metresPerItem); continue }
    if (e.sessionId !== session || e.at - last > GAME.momentumResetMs) streak = 0
    session = e.sessionId; last = e.at; streak++; items++; best = Math.max(best, streak)
    const multiplier = GAME.momentum.find(t => streak >= t.items)?.multiplier ?? 1
    lifetimeMetres += GAME.metresPerItem * multiplier
  }
  const mountainMetres = Math.min(BEN_NEVIS.elevation, lifetimeMetres)
  return { items, lifetimeMetres, mountainMetres, best, percent: mountainMetres / BEN_NEVIS.elevation * 100 }
}

export function parseLedger(raw: string | null): Ledger {
  if (raw === null) return emptyLedger()
  const data: unknown = JSON.parse(raw)
  if (!data || typeof data !== 'object' || !('version' in data) || data.version !== 1 || !('events' in data) || !Array.isArray(data.events)) throw new Error('Unsupported saved progress')
  for (const e of data.events) {
    if (e?.mountainId !== undefined && !isMountainId(e.mountainId)) throw new Error('Unknown saved mountain; your progress has not been overwritten')
    if (!e || typeof e.id !== 'string' || typeof e.sessionId !== 'string' || !Number.isFinite(e.at) || !['folding', 'hanging', 'ironing'].includes(e.action) || !['camera', 'correction', 'manual'].includes(e.source) || !(e.source === 'manual' ? Number.isInteger(e.items) && e.items > 0 && e.items <= 500 : [1, -1].includes(e.items)) || typeof e.evidence !== 'string') throw new Error('Saved progress could not be read; it has not been overwritten')
  }
  return data as Ledger
}

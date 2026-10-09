import { GAME } from './config'
import type { LaundryAction, LaundryEvent } from './events'
import type { Ledger } from './ledger'
import type { MountainId } from './mountains'

export interface Session {
  id: string
  startedAt: number
  endedAt?: number
  load: string
  goal?: number
  items: number
  metres: number
  base: number
  status: 'active' | 'finished'
  reason?: string
  mode?: 'manual'
  pausedAt?: number
  pausedMs?: number
  mountainId?: MountainId
}
export function sessionSeconds(s: Session, now: number) {
  return Math.max(0, Math.floor(((s.endedAt ?? s.pausedAt ?? now) - s.startedAt - (s.pausedMs ?? 0)) / 1000))
}
export function manualBatch(id: string, sessionId: string, items: number, action: LaundryAction, at: number, mountainId?: MountainId): LaundryEvent {
  if (!Number.isInteger(items) || items < 1 || items > 500) throw new Error('Enter a whole number from 1 to 500.')
  return { id, sessionId, items, action, at, source: 'manual', evidence: 'User-confirmed batch; not camera verified', ...(mountainId ? { mountainId } : {}) }
}
// The ledger is authoritative if the browser closes between the two storage writes.
export function reconcileManualSession(s: Session, ledger: Ledger): Session {
  if (s.mode !== 'manual') return s
  const items = ledger.events.filter(e => e.sessionId === s.id && e.source === 'manual').reduce((n, e) => n + e.items, 0)
  return { ...s, items, base: items * GAME.metresPerItem, metres: items * GAME.metresPerItem }
}

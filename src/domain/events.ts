import type { Zones } from '../vision/signals'
export type LaundryAction = 'folding' | 'hanging' | 'ironing'
export interface LaundryEvent {
  id: string
  sessionId: string
  at: number
  action: LaundryAction
  source: 'camera' | 'correction'
  items: 1 | -1
  evidence: string
}

export interface FieldRun {
  id: string
  startedAt: number
  endedAt?: number
  kind: 'folding' | 'negative-control'
  events: LaundryEvent[]
  diagnostics: { at: number; stage: string; motion: number[]; occupancy: number[]; outsideMotion: number }[]
  config: Record<string, number>
  zones: Zones
  frames: number
  processingMs: number
  notes: string
  userAgent: string
}

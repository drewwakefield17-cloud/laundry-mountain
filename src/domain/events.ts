import type { Zones } from '../vision/signals'
import type { MountainId } from './mountains'
export type LaundryAction = 'folding' | 'hanging' | 'ironing'
export interface LaundryEvent {
  id: string
  sessionId: string
  at: number
  action: LaundryAction
  source: 'camera' | 'correction' | 'manual'
  items: number // Camera: 1, correction: -1; manual: confirmed positive batch count.
  evidence: string
  mountainId?: MountainId // Absent on original Ben Nevis saves.
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

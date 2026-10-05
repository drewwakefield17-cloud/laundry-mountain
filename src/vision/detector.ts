import { VISION } from './signals'
import type { Signals, VisionConfig } from './signals'

export type Stage = 'ready' | 'source' | 'working' | 'placement' | 'cooldown'
export class FoldingDetector {
  stage: Stage = 'ready'
  reason = 'Take one item from the source pile'
  private started = 0
  private workStarted = 0
  private workMotionMs = 0
  private previousAt = 0
  private stableSince: number | null = null
  private cooldownUntil = 0
  private placed = false

  constructor(public config: VisionConfig = { ...VISION }) {}

  reset(reason = 'Take one item from the source pile') {
    this.stage = 'ready'; this.reason = reason; this.started = 0
    this.workStarted = 0; this.workMotionMs = 0; this.stableSince = null; this.placed = false; this.previousAt = 0
  }

  update(s: Signals, completedChange: number): boolean {
    const c = this.config
    const dt = this.previousAt ? Math.min(250, Math.max(0, s.at - this.previousAt)) : 0
    if (this.previousAt && s.at - this.previousAt > 1500) this.reset('Camera interrupted. Start a fresh item.')
    this.previousAt = s.at
    if (s.outsideMotion > c.maxOutsideMotion) { this.reset('Large scene change. Keep the phone and lighting steady.'); return false }
    if (this.stage === 'cooldown') {
      if (s.at >= this.cooldownUntil && Object.values(s.motion).every(v => v < c.stableThreshold)) this.reset()
      return false
    }
    if (this.stage !== 'ready' && s.at - this.started > c.cycleTimeoutMs) { this.reset('Cycle timed out. Start a fresh item.'); return false }
    if (this.stage === 'ready') {
      if (s.motion.source > c.motionThreshold) {
        this.stage = 'source'; this.started = s.at; this.reason = 'Source reached. Bring the item into the work area.'
      }
      return false
    }
    if (this.stage === 'source') {
      if (s.motion.work > c.motionThreshold && s.occupancy.work > c.occupancyThreshold) {
        this.stage = 'working'; this.workStarted = s.at; this.reason = 'Work area active. Fold the item.'
      }
      return false
    }
    if (this.stage === 'working') {
      if (s.motion.work > c.motionThreshold) this.workMotionMs += dt
      if (s.at - this.workStarted >= c.minimumWorkMs && this.workMotionMs >= c.minimumMotionMs && s.motion.completed > c.motionThreshold) {
        this.stage = 'placement'; this.placed = true; this.reason = 'Placement seen. Clear the work area and withdraw your hands.'
      }
      return false
    }
    if (this.stage === 'placement') {
      const stable = s.motion.completed < c.stableThreshold && s.motion.work < c.stableThreshold && s.motion.source < c.stableThreshold
      const cleared = s.occupancy.work < c.occupancyThreshold
      if (this.placed && stable && cleared && completedChange >= c.placementThreshold) {
        this.stableSince ??= s.at
        this.reason = 'Checking that the placed item stays still…'
        if (s.at - this.stableSince >= c.stableMs) {
          this.stage = 'cooldown'; this.cooldownUntil = s.at + c.cooldownMs; this.reason = 'Item counted. Wait for Ready before taking another.'
          return true
        }
      } else { this.stableSince = null; this.reason = cleared ? 'Waiting for a stable change in the completed area.' : 'Move the finished item out of the work area.' }
    }
    return false
  }
}

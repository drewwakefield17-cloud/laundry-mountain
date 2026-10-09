import { GAME } from './config'
import type { Ledger } from './ledger'
import { summary } from './ledger'
import { MOUNTAINS, MOUNTAIN_IDS, type MountainId } from './mountains'

export const ACTIVE_MOUNTAIN_KEY = 'laundry-mountain:active-mountain:v1'

/** Untagged, pre-expedition saves keep their original Ben Nevis position.
 * New events allocate overflow onwards, without mutating or duplicating the ledger.
 * Lifetime totals always remain the full earned amount, including after Everest.
 */
export function mountainProgress(ledger: Ledger) {
  const legacy = summary({ version: 1, events: ledger.events.filter(e => !e.mountainId) })
  const metres: Record<MountainId, number> = { 'ben-nevis': legacy.mountainMetres, fuji: 0, everest: 0 }
  for (const event of ledger.events) {
    if (!event.mountainId) continue
    let remaining = event.items * GAME.metresPerItem
    // Camera/correction prototypes retain their original ledger contract. Tagged
    // release events are manual; clamp corrections within their own expedition.
    if (remaining < 0) {
      metres[event.mountainId] = Math.max(0, metres[event.mountainId] + remaining)
      continue
    }
    for (const id of MOUNTAIN_IDS.slice(MOUNTAIN_IDS.indexOf(event.mountainId))) {
      const earned = Math.min(remaining, MOUNTAINS[id].elevation - metres[id])
      metres[id] += earned
      remaining -= earned
      if (remaining <= 0) break
    }
  }
  return Object.fromEntries(MOUNTAIN_IDS.map((id, index) => [id, {
    metres: metres[id],
    percent: metres[id] / MOUNTAINS[id].elevation * 100,
    summit: metres[id] >= MOUNTAINS[id].elevation,
    unlocked: index === 0 || metres[MOUNTAIN_IDS[index - 1]] >= MOUNTAINS[MOUNTAIN_IDS[index - 1]].elevation,
  }])) as Record<MountainId, { metres: number; percent: number; summit: boolean; unlocked: boolean }>
}

export function nextUnfinishedMountain(ledger: Ledger, from: MountainId): MountainId {
  const progress = mountainProgress(ledger)
  return MOUNTAIN_IDS.slice(MOUNTAIN_IDS.indexOf(from)).find(id => progress[id].unlocked && !progress[id].summit) ?? from
}

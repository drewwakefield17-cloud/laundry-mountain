import { BEN_NEVIS } from './config'
import { SCENIC_EXPEDITIONS } from './expeditionScenery'

export const MOUNTAIN_IDS = ['ben-nevis', 'fuji', 'everest'] as const
export type MountainId = typeof MOUNTAIN_IDS[number]
export interface MountainDefinition {
  id: MountainId
  name: string
  region: string
  elevation: number
  tagline: string
  checkpoints: ReadonlyArray<{ metres: number; name: string; description: string }>
}

export const MOUNTAINS: Record<MountainId, MountainDefinition> = {
  'ben-nevis': { ...BEN_NEVIS, tagline: 'Less pile. More peak.' },
  fuji: { ...SCENIC_EXPEDITIONS.fuji, id: 'fuji', checkpoints: [
    { metres: 0, name: 'At the trailhead', description: 'A fresh load. A new horizon.' },
    { metres: 800, name: 'Out of the forest', description: 'Small loads take you beyond the trees.' },
    { metres: 1800, name: 'Above the clouds', description: 'A little less laundry. A much bigger view.' },
    { metres: 2900, name: 'The final switchbacks', description: 'Keep going, one finished item at a time.' },
    { metres: 3776, name: 'Mount Fuji summit', description: 'Two mountains conquered. Everest is waiting.' },
  ] },
  everest: { ...SCENIC_EXPEDITIONS.everest, id: 'everest', checkpoints: [
    { metres: 0, name: 'Base camp', description: 'Even the biggest piles have a summit.' },
    { metres: 1800, name: 'Ice to meet you', description: 'A fresh start on the roof of the world.' },
    { metres: 4200, name: 'A whole new altitude', description: 'Your little daily wins are adding up.' },
    { metres: 6800, name: 'On top of the washing', description: 'The biggest peak is within reach.' },
    { metres: 8849, name: 'Everest summit', description: 'Three peaks. A mountain of real laundry.' },
  ] },
}

export function isMountainId(value: unknown): value is MountainId {
  return MOUNTAIN_IDS.includes(value as MountainId)
}

export function nextMountain(id: MountainId): MountainDefinition | undefined {
  const next = MOUNTAIN_IDS[MOUNTAIN_IDS.indexOf(id) + 1]
  return next ? MOUNTAINS[next] : undefined
}

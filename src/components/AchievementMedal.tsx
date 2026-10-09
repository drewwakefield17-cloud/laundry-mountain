import { ACHIEVEMENTS, type Achievement } from '../domain/achievements'

export function AchievementMedal({ badge, locked = false }: { badge: Achievement; locked?: boolean }) {
  const index = ACHIEVEMENTS.findIndex(item => item.id === badge.id)
  return <span className={`badge-medal ${locked ? 'medal-locked' : ''}`}>
    <span className="reference-medal" aria-hidden="true" style={{ backgroundPosition: `${index % 3 * 50}% ${Math.floor(index / 3) * 50}%` }} />
  </span>
}

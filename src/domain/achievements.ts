export const ACHIEVEMENTS = [
  { id: 'first', name: 'First Load', detail: 'Finish your first counted session', icon: 'basket', color: 'green', metric: 'loads', target: 1 },
  { id: 'roll', name: 'On a Roll', detail: 'Complete 5 items in one session', icon: 'flame', color: 'orange', metric: 'best', target: 5 },
  { id: 'climber', name: 'Mountain Climber', detail: 'Reach 100 Laundry Metres', icon: 'mountain', color: 'green', metric: 'metres', target: 100 },
  { id: 'legend', name: 'Load Legend', detail: 'Complete 10 counted sessions', icon: 'layers', color: 'green', metric: 'loads', target: 10 },
  { id: 'glen', name: 'Glen Explorer', detail: 'Reach the 250 m checkpoint', icon: 'trees', color: 'green', metric: 'metres', target: 250 },
  { id: 'halfway', name: 'Halfway Higher', detail: 'Reach 675 Laundry Metres', icon: 'signpost', color: 'green', metric: 'metres', target: 675 },
  { id: 'master', name: 'Laundry Master', detail: 'Complete 100 counted sessions', icon: 'crown', color: 'green', metric: 'loads', target: 100 },
  { id: 'steady', name: 'Steady Climber', detail: 'Complete 20 items in one session', icon: 'boot', color: 'green', metric: 'best', target: 20 },
  { id: 'summit', name: 'Summit Seeker', detail: 'Reach the Ben Nevis summit', icon: 'mountain', color: 'green', metric: 'metres', target: 1345 },
] as const
export type Achievement = typeof ACHIEVEMENTS[number]
export type AchievementTotals = { loads: number; best: number; metres: number }
export function achievements(totals: AchievementTotals) {
  return ACHIEVEMENTS.map(badge => ({ ...badge, earned: totals[badge.metric] >= badge.target }))
}
export function newlyEarned(before: AchievementTotals, after: AchievementTotals) {
  return ACHIEVEMENTS.filter(badge => before[badge.metric] < badge.target && after[badge.metric] >= badge.target)
}

// Short grid captions; the full requirements remain available in badge details.
export const achievementCaption: Record<Achievement['id'],string> = {
  first:'Your first session', roll:'5 items in one session', climber:'100 m climbed',
  legend:'10 sessions', glen:'Reach the glen', halfway:'Halfway to the summit',
  master:'100 sessions', steady:'20 items in one session', summit:'Reach the summit',
}

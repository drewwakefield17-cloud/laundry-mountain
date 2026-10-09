import { useEffect, useRef } from 'react'
import type { Achievement } from '../domain/achievements'
import { AchievementMedal } from './AchievementMedal'
import { ArrowRight } from './GameIcons'
import { TrailIcon, SockMarker } from './ScenicArtwork'
import { MOUNTAINS, nextMountain, type MountainId } from '../domain/mountains'

export type TrailRewardData = ({ kind: 'checkpoint'; name: string; banked: number; metres: number; summit?: boolean; carry?: number } | { kind: 'badge'; badge: Achievement }) & { mountainId?: MountainId }
export function TrailReward({ reward, onContinue }: { reward: TrailRewardData; onContinue: () => void }) {
  const modal = useRef<HTMLDialogElement>(null)
  useEffect(() => { const previous = document.activeElement as HTMLElement | null; modal.current?.showModal(); return () => { modal.current?.close(); previous?.focus() } }, [])
  const badge = reward.kind === 'badge'
  const mountainId = reward.mountainId ?? 'ben-nevis'
  const mountain = MOUNTAINS[mountainId]
  const onward = nextMountain(mountainId)
  return <dialog ref={modal} data-mountain={mountainId} className={`trail-reward ${badge ? 'reward-badge' : 'reward-checkpoint'}`} aria-labelledby="reward-title" onCancel={e => { e.preventDefault(); onContinue() }}>
    <div className="reward-landscape" aria-hidden="true" style={mountainId !== 'ben-nevis' ? { backgroundImage: `url('/art/playable-${mountainId}-climb.webp')` } : undefined} />
    {!badge && mountainId !== 'ben-nevis' && <SockMarker className="reward-marker" />}
    {badge && <><span className="reward-eyebrow">NEW BADGE</span><AchievementMedal badge={reward.badge} /><h1 id="reward-title">{reward.badge.name}</h1><p>{reward.badge.detail}.<br />Earned, one item at a time.</p></>}
    <div className="reward-companion"><img src="/art/coordinated-basket-cheer.webp" alt="Your basket celebrates, arms raised" /></div>
    <div className="reward-footer">
      {!badge && <><span className="reward-eyebrow">{reward.summit ? 'SUMMIT REACHED' : 'CHECKPOINT REACHED'}</span><h1 id="reward-title">{reward.name}!</h1><strong>+{reward.banked.toLocaleString()} m banked</strong><p>{reward.summit ? onward ? `${onward.name} unlocked. Your next adventure awaits.` : 'Three peaks conquered. Look how far you came.' : 'One less pile. One new view.'}</p>{!!reward.carry && <p className="reward-carry">{reward.carry.toLocaleString()} extra metres carried onto your next peaks.</p>}<div className="reward-progress"><TrailIcon kind="mountain" /><progress value={Math.min(reward.metres,mountain.elevation)} max={mountain.elevation} aria-label={`${mountain.name} progress`}/><b>{Math.min(reward.metres,mountain.elevation).toLocaleString()} / {mountain.elevation.toLocaleString()} m</b></div></>}
      <button className="primary game-cta" onClick={onContinue}>{badge ? 'Onwards & upwards' : 'Keep climbing'} <ArrowRight size={20}/></button>
      {badge && <small>Added to your badges.</small>}
    </div>
  </dialog>
}

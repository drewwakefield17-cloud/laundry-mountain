import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import { MountainScene } from './MountainScene'
import type { SceneryFinish } from './MountainScene'
import { BasketAvatar } from './BasketAvatar'
import { expeditionProgress } from '../domain/expedition'
import { climbPresentation, crossedCheckpoint } from '../domain/climbPresentation'
import './climb-scene.css'

export function ClimbScene({ metres, variant = 'climb', showProgress = false, sceneryFinish = 'illustrated' }: {
  metres: number; variant?: 'climb' | 'card' | 'dial' | 'welcome' | 'landing'; showProgress?: boolean; sceneryFinish?: SceneryFinish
}) {
  const position = climbPresentation(metres)
  const progress = expeditionProgress(position.metres)
  const nextPosition = climbPresentation(progress.next?.metres ?? position.metres)
  const previous = useRef(position.metres)
  const [motion, setMotion] = useState<'idle' | 'walking' | 'celebrating'>('idle')
  useEffect(() => {
    const before = previous.current
    previous.current = position.metres
    if (position.metres <= before) return
    setMotion(crossedCheckpoint(before, position.metres) ? 'celebrating' : 'walking')
    const timer = window.setTimeout(() => setMotion('idle'), 1800)
    return () => window.clearTimeout(timer)
  }, [position.metres])
  return <div className={`climb-scene climb-scene--${variant}`} data-metres={position.metres} data-motion={motion}>
    <MountainScene metres={position.metres} close={false} scenic finish={sceneryFinish} />
    <img className="climb-trail" src="/art/climb-trail.png" alt="" aria-hidden="true" draggable="false" />
    <div className="climb-sock" style={variant === 'climb' ? {
      left: `${nextPosition.x + 1}%`, top: `${nextPosition.y - 22}%`
    } : undefined} aria-hidden="true">
      <img src="/art/sock-checkpoint.png" alt="" draggable="false" />
    </div>
    <div className="climb-companion" style={{ '--trail-x': `${position.x}%`, '--trail-y': `${position.y}%`, '--trail-scale': position.scale } as CSSProperties}>
      <BasketAvatar moving={motion === 'walking'} celebrating={motion === 'celebrating'} />
    </div>
    {showProgress && <div className="climb-waypoint">
      <span>{progress.summit ? 'You made it!' : 'Next sock stop'}</span>
      <strong>{progress.next?.name ?? 'Ben Nevis summit'}</strong>
      <p>{progress.summit ? '1,345 Laundry Metres climbed' : `${progress.remaining.toLocaleString('en-GB')} Laundry Metres to go`}</p>
    </div>}
    <span className="sr-only">Your basket is at {Math.round(position.metres)} Laundry Metres on Ben Nevis.</span>
  </div>
}

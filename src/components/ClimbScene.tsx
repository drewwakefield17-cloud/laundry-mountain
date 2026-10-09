import { useEffect, useRef, useState } from 'react'
import type { SceneryFinish } from './MountainScene'
import { expeditionProgress } from '../domain/expedition'
import { climbPresentation, climbLeg, climbTravel, climbSceneFrame } from '../domain/climbPresentation'
import { MOUNTAINS, type MountainId } from '../domain/mountains'
import './climb-scene.css'

export function ClimbScene({ metres, mountainId = 'ben-nevis', variant = 'climb', showProgress = false }: {
  metres: number; mountainId?: MountainId; variant?: 'climb' | 'session' | 'card' | 'dial' | 'welcome' | 'landing'; showProgress?: boolean; sceneryFinish?: SceneryFinish
}) {
  const mountain = MOUNTAINS[mountainId]
  const position = climbPresentation(metres, mountainId)
  const progress = expeditionProgress(position.metres, mountainId)
  const leg = climbLeg(position.metres, mountainId)
  const [arrivingAtCheckpoint, setArrivingAtCheckpoint] = useState(false)
  const showMarker = arrivingAtCheckpoint || mountainId === 'ben-nevis' || progress.summit || Math.abs(leg.end - (progress.next?.metres ?? mountain.elevation)) < .001
  const previous = useRef(position.metres)
  const [fraction, setFraction] = useState(() => climbLeg(position.metres, mountainId).fraction)
  const rendered = useRef(fraction)
  const [changingCamera, setChangingCamera] = useState(false)
  const [motion, setMotion] = useState<'idle' | 'walking' | 'celebrating'>('idle')
  useEffect(() => {
    const before = previous.current
    previous.current = position.metres
    const travel = climbTravel(before, position.metres, mountainId)
    setArrivingAtCheckpoint(travel.checkpoint)
    const update = (p: number) => { rendered.current = p; setFraction(p) }
    setChangingCamera(false)
    if (!travel.duration || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      update(travel.settled)
      setMotion('idle')
      return
    }
    let frame = 0
    const timers: number[] = []
    const from = rendered.current
    const started = performance.now()
    setMotion('walking')
    const tick = (now: number) => {
      const t = Math.min(1, (now - started) / travel.duration)
      update(from + (travel.to - from) * t)
      if (t < 1) frame = requestAnimationFrame(tick)
      else setMotion(travel.checkpoint ? 'celebrating' : 'idle')
    }
    frame = requestAnimationFrame(tick)
    timers.push(window.setTimeout(() => setMotion('idle'), travel.duration + 700))
    if ((travel.checkpoint || travel.stageReset) && travel.settled !== 1) {
      // The reward opens at 3.3 s. Stage the next approach behind it, not mid-step.
      const resetAt = travel.checkpoint ? 3450 : travel.duration + 250
      timers.push(window.setTimeout(() => setChangingCamera(true), resetAt))
      timers.push(window.setTimeout(() => { update(travel.settled); setArrivingAtCheckpoint(false) }, resetAt + 200))
      timers.push(window.setTimeout(() => setChangingCamera(false), resetAt + 400))
    }
    return () => { cancelAnimationFrame(frame); timers.forEach(window.clearTimeout) }
  }, [position.metres, mountainId])
  return <div className={`climb-scene climb-scene--${variant}`} data-metres={position.metres} data-motion={motion} data-camera-changing={changingCamera}>
    {[false,true].map(wide => {
      const session=variant==='session'
      const pose=climbSceneFrame(wide ? 'landscape' : session ? 'session' : 'climb', fraction)
      const x=pose.x*(wide ? 15.36 : session ? 11.22 : 9.49)
      const y=pose.y*(wide ? 10.24 : session ? 14.02 : 16.58)
      const basketWidth=wide ? 480 : session ? 610 : 550
      const basketHeight=basketWidth*1120/1078
      const background = mountainId === 'ben-nevis'
        ? wide ? '/art/reference-climb-landscape.webp' : session ? '/art/reference-session-portrait.webp' : '/art/coordinated-ben-nevis-climb.webp'
        : `/art/playable-${mountainId}-${wide ? 'landscape' : session ? 'session' : 'climb'}.webp`
      return <svg key={String(wide)} className={`reference-climb-world ${wide ? 'world-landscape' : 'world-portrait'}`} viewBox={wide ? '0 0 1536 1024' : session ? '0 0 1122 1402' : '0 0 949 1658'} preserveAspectRatio="xMidYMid slice" role="img" aria-label={`Your basket walking the ${mountain.name} trail`}>
        <image href={background} width={wide ? 1536 : session ? 1122 : 949} height={wide ? 1024 : session ? 1402 : 1658} />
        {showMarker && <svg x={wide ? 1225 : session ? 855 : 625} y={wide ? 302 : session ? 601 : 555} width="130" height="282" viewBox="150 229 613 1329"><image href="/art/reference-sock-marker.webp" width="887" height="1774" /></svg>}
        <g className="travelling-basket" transform={`translate(${x} ${y}) scale(${pose.scale})`}>
          <g fill="#293623" opacity=".23">
            <ellipse className="stride-frame stride-a" cx={basketWidth*.17} cy={-130*basketWidth/1078} rx={basketWidth*.13} ry="11" />
            <ellipse className="stride-frame stride-b" cx={-basketWidth*.13} cy={-25*basketWidth/1078} rx={basketWidth*.13} ry="11" />
          </g>
          <svg className="scene-walker" x={-basketWidth/2} y={-basketHeight} width={basketWidth} height={basketHeight} viewBox="101 79 1078 1120"><image className="stride-frame stride-a" href="/art/reference-basket-uphill-a.webp" width="1254" height="1254" /><image className="stride-frame stride-b" href="/art/reference-basket-uphill-b-v2.webp" width="1254" height="1254" /></svg>
        </g>
      </svg>
    })}
    {showProgress && <div className="climb-waypoint">
      <span>{progress.summit ? 'You made it!' : 'Next sock stop'}</span>
      <strong>{progress.next?.name ?? `${mountain.name} summit`}</strong>
      <p>{progress.summit ? `${mountain.elevation.toLocaleString()} Laundry Metres climbed` : `${progress.remaining.toLocaleString('en-GB')} Laundry Metres to go`}</p>
    </div>}
    <span className="sr-only">Your basket is at {Math.round(position.metres)} Laundry Metres on {mountain.name}.</span>
  </div>
}

import { createId } from '../domain/id'
import { useEffect, useRef, useState } from 'react'
import type { LaundryAction } from '../domain/events'
import { GAME } from '../domain/config'
import { expeditionProgress } from '../domain/expedition'
import { sessionSeconds, type Session } from '../domain/manualSession'
import { MOUNTAINS, nextMountain } from '../domain/mountains'
import { ClimbScene } from './ClimbScene'
import { SockIcon, TrailIcon } from './ScenicArtwork'
import { Pause, Flag, Layers } from './GameIcons'
import { CameraIcon } from '@phosphor-icons/react/dist/csr/Camera'
import { CoatHangerIcon } from '@phosphor-icons/react/dist/csr/CoatHanger'
import './manual-session.css'

const time = (seconds: number) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
export function ManualSession({ session, metres, disabled, error, onBank, onPause, onFinish, onLeave }: {
  session: Session; metres: number; disabled: boolean; error: string
  onBank: (id: string, count: number, action: LaundryAction) => boolean
  onPause: () => void; onFinish: () => void; onLeave: () => void
}) {
  const [now, setNow] = useState(Date.now())
  const [batch, setBatch] = useState<string | null>(null)
  const [count, setCount] = useState('1')
  const [action, setAction] = useState<LaundryAction>('folding')
  const [photo, setPhoto] = useState('')
  const [photoError, setPhotoError] = useState('')
  const [notice, setNotice] = useState('')
  const modal = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement>(null)
  const committed = useRef(false)
  const mountainId = session.mountainId ?? 'ben-nevis'
  const mountain = MOUNTAINS[mountainId]
  const progress = expeditionProgress(metres, mountainId)
  const onward = nextMountain(mountainId)
  const quantity = Number(count)
  const valid = count.trim() !== '' && Number.isInteger(quantity) && quantity >= 1 && quantity <= 500
  useEffect(() => { const t = window.setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t) }, [])
  useEffect(() => {
    if (batch) modal.current?.showModal()
    else { modal.current?.close(); trigger.current?.focus() }
  }, [batch])
  useEffect(() => () => { if (photo) URL.revokeObjectURL(photo) }, [photo])
  function closeBatch() { setBatch(null); setPhoto(''); setPhotoError('') }
  function bank() {
    if (!batch || !valid || committed.current || disabled) return
    committed.current = true
    if (!onBank(batch, quantity, action)) { committed.current = false; return }
    const earned = quantity * GAME.metresPerItem
    const crossed = progress.next && metres + earned >= progress.next.metres
    setNotice(crossed ? `${progress.next!.name} reached! +${earned} Laundry Metres banked.` : `That's a load off. +${earned} Laundry Metres banked.`)
    closeBatch()
  }
  return <div className="manual-session">
    <section className="manual-trail" aria-label="Your live climb">
      <ClimbScene key={mountainId} mountainId={mountainId} metres={metres} variant="session" />
      <div className="manual-trail-heading"><small>{mountain.name.toUpperCase()} · YOUR LIVE CLIMB</small><h1>{session.pausedAt ? 'Take a breather.' : 'Less pile. More peak.'}</h1></div>
      <div className="manual-checkpoint"><SockIcon /><span><small>{progress.summit ? 'SUMMIT REACHED' : 'NEXT SOCK STOP'}</small><strong>{progress.next?.name ?? 'Top of the laundry world.'}</strong></span><b>{progress.remaining.toLocaleString()} m</b></div>
    </section>
    <section className="manual-controls" aria-label="Session controls">
      {error && !batch && <p className="error" role="alert">{error}</p>}
      <div className="manual-metrics"><div className="manual-clock"><span>{session.pausedAt ? 'Timer paused' : 'Time well spent'}</span><strong aria-label="Session timer">{time(sessionSeconds(session, now))}</strong><small>No rush. Every finished item counts.</small></div>
      <div className="manual-stats"><div><TrailIcon kind="items" /><strong>{session.items}</strong><span>items</span></div><div><TrailIcon kind="mountain" /><strong>+{session.metres} m</strong><span>climbed</span></div></div></div>
      <p className={`batch-notice ${notice ? 'has-notice' : ''}`} role="status">{notice}</p>
      {progress.summit && onward ? <button className="primary game-cta" disabled={disabled} onClick={onFinish}>Finish & explore {onward.name}</button> : <button ref={trigger} className="primary game-cta" disabled={disabled || !!session.pausedAt} onClick={() => { committed.current = false; setCount('1'); setBatch(createId()) }}>Bank this batch <span aria-hidden="true">↑</span></button>}
      <p className="manual-honesty">You confirm the count. {GAME.metresPerItem} m per item.</p>
      <div className="manual-secondary"><button onClick={onPause} disabled={disabled}><Pause weight="fill" size={18}/>{session.pausedAt ? 'Resume timer' : 'Pause timer'}</button><button onClick={onFinish} disabled={disabled}><Flag weight="fill" size={18}/>Finish session</button></div>
      <button className="text-button" onClick={onLeave}>Save for later</button>
    </section>
    <dialog ref={modal} className="batch-dialog" aria-labelledby="batch-title" onCancel={e => { e.preventDefault(); closeBatch() }}>
      <form key={batch} onSubmit={e => { e.preventDefault(); bank() }}>
        <button type="button" className="batch-close" aria-label="Cancel batch" onClick={closeBatch}>×</button>
        <span className="batch-eyebrow">A LITTLE LESS LAUNDRY</span><h2 id="batch-title">What have you conquered?</h2>
        {error && <p className="error" role="alert">{error}</p>}
        <p>Count the items you’ve finished since your last batch.</p>
        <fieldset className="batch-actions"><legend className="sr-only">Completed activity</legend>{(['folding', 'hanging', 'ironing'] as const).map(a => <label key={a}><input type="radio" name="activity" checked={action === a} onChange={() => setAction(a)} />{a === 'folding' ? <Layers size={28} /> : a === 'hanging' ? <CoatHangerIcon size={28}/> : <svg width="29" height="29" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3 24h26l-3-12H14c-5 0-9 5-11 12Z M27 24v3H3v-3 M12 8h12c2 0 2 2 2 4"/><path d="M13 16h8l1 5H9c1-3 2-5 4-5Z"/></svg>}{a === 'folding' ? 'Folded' : a === 'hanging' ? 'Hung up' : 'Ironed'}</label>)}</fieldset>
        <div className="batch-items-icon"><TrailIcon kind="items" /></div><label className="batch-count-label" htmlFor="batch-count">Completed items</label>
        <div className="batch-counter"><button type="button" aria-label="One fewer item" disabled={!valid || quantity <= 1} onClick={() => setCount(String(quantity - 1))}>−</button><input id="batch-count" type="number" inputMode="numeric" min="1" max="500" step="1" value={count} onChange={e => setCount(e.target.value)} aria-describedby="batch-count-help" /><button type="button" aria-label="One more item" disabled={!valid || quantity >= 500} onClick={() => setCount(String(quantity + 1))}>+</button></div>
        <p id="batch-count-help" className="batch-earnings">{valid ? `Your basket climbs ${quantity * GAME.metresPerItem} m.` : 'Enter a whole number from 1 to 500.'}</p>
        <details className="batch-photo"><summary><CameraIcon size={21}/>Add a photo (optional)<span aria-hidden="true">›</span></summary><p>A look at your handiwork. Photos stay on this screen and are discarded when you close it. Counting is manual for now.</p><input aria-label="Batch photo" type="file" accept="image/*" capture="environment" onChange={e => { const file = e.target.files?.[0]; if (!file) return; if (!file.type.startsWith('image/') || file.size > 20 * 1024 * 1024) { setPhotoError('Choose an image smaller than 20 MB. You can also continue without a photo.'); return }; setPhotoError(''); setPhoto(URL.createObjectURL(file)) }} />{photo && <img src={photo} alt="Your completed laundry batch" onError={() => { setPhoto(''); setPhotoError('This image cannot be previewed. Continue without a photo or choose another.') }} />}{photoError && <p role="alert">{photoError}</p>}</details>
        <button className="primary game-cta" type="submit" disabled={!valid || disabled}>Confirm & climb {valid ? `+${quantity * GAME.metresPerItem} m` : ''}</button>
        <p className="manual-honesty">Your count, your climb.</p>
      </form>
    </dialog>
  </div>
}

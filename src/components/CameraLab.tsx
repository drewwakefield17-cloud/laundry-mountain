import { useEffect, useRef, useState } from 'react'
import type { PointerEvent } from 'react'
import { Camera, Check, Move, RefreshCw, ShieldCheck } from 'lucide-react'
import { FoldingDetector } from '../vision/detector'
import { DEFAULT_ZONES, VISION, ZONE_NAMES, difference, extractSignals } from '../vision/signals'
import type { Rect, Signals, VisionConfig, ZoneName, Zones } from '../vision/signals'

export interface Observation { signals: Signals; stage: string; reason: string; change: number; processingMs: number }
export interface Calibration { zones: Zones; config: VisionConfig }
export function CameraLab({ active, onEvent, onObservation, onReady, onInterrupt }: {
  active: boolean; onEvent: (evidence: string) => void; onObservation: (o: Observation) => void
  onReady: (c: Calibration | null) => void; onInterrupt: (reason: string) => void
}) {
  const video = useRef<HTMLVideoElement>(null), stream = useRef<MediaStream | null>(null), requestId = useRef(0)
  const detector = useRef(new FoldingDetector())
  const baseline = useRef<Uint8ClampedArray | null>(null), previous = useRef<Uint8ClampedArray | null>(null), cycleFrame = useRef<Uint8ClampedArray | null>(null)
  const calibrationFrames = useRef<Uint8ClampedArray[]>([]), calibrating = useRef(false), lastVideoTime = useRef(-1)
  const callbacks = useRef({ active, onEvent, onObservation, onReady, onInterrupt })
  useEffect(() => { callbacks.current = { active, onEvent, onObservation, onReady, onInterrupt } }, [active, onEvent, onObservation, onReady, onInterrupt])
  const [camera, setCamera] = useState<'off' | 'requesting' | 'on'>('off'), [facing, setFacing] = useState<'user' | 'environment'>('user')
  const [error, setError] = useState(''), [zones, setZones] = useState<Zones>(DEFAULT_ZONES), [selected, setSelected] = useState<ZoneName>('work')
  const [editing, setEditing] = useState(false), [ready, setReady] = useState(false), [calibrationCount, setCalibrationCount] = useState(0)
  const [ratio, setRatio] = useState(16 / 9), [config, setConfig] = useState<VisionConfig>({ ...VISION })
  const drag = useRef<{ x: number; y: number } | null>(null)
  function invalidate() {
    baseline.current = null; previous.current = null; cycleFrame.current = null; calibrating.current = false
    detector.current.reset(); setReady(false); setCalibrationCount(0); callbacks.current.onReady(null)
  }
  function stopCamera() {
    requestId.current++; stream.current?.getTracks().forEach(t => t.stop()); stream.current = null
    setCamera('off'); invalidate()
  }
  async function startCamera(nextFacing = facing) {
    stopCamera(); setError(''); setCamera('requesting'); const request = ++requestId.current
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error('Open the HTTPS test URL in Safari or Chrome. Camera access is unavailable in this browser/context.')
      const s = await navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: { ideal: nextFacing }, width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 24, max: 30 } } })
      if (request !== requestId.current) { s.getTracks().forEach(t => t.stop()); return }
      stream.current = s
      s.getVideoTracks()[0].onended = () => { stopCamera(); setError('Camera ended. Enable it and recalibrate.'); callbacks.current.onInterrupt('Camera ended') }
      video.current!.srcObject = s; await video.current!.play()
      setRatio(video.current!.videoWidth / video.current!.videoHeight || 16 / 9); lastVideoTime.current = -1; setCamera('on')
    } catch (e) {
      if (request !== requestId.current) return
      stopCamera(); const message = e instanceof Error ? e.message : 'Camera unavailable'
      setError(/permission|denied/i.test(message) ? 'Camera permission was denied. Allow camera in your browser site settings, then retry.' : message)
    }
  }
  useEffect(() => () => { requestId.current++; stream.current?.getTracks().forEach(t => t.stop()) }, [])
  useEffect(() => {
    const visibility = () => { if (document.hidden) { stopCamera(); callbacks.current.onInterrupt('App left the foreground; test ended and progress saved') } }
    document.addEventListener('visibilitychange', visibility); return () => document.removeEventListener('visibilitychange', visibility)
  }, [])
  useEffect(() => { detector.current.reset(); cycleFrame.current = null }, [active])
  useEffect(() => {
    if (camera !== 'on') return
    const canvas = document.createElement('canvas'); canvas.width = config.width; canvas.height = config.height
    const ctx = canvas.getContext('2d', { willReadFrequently: true })!
    let failed = false
    const interval = window.setInterval(() => {
      const v = video.current
      if (failed || !v || v.readyState < 2 || v.currentTime === lastVideoTime.current || document.hidden) return
      lastVideoTime.current = v.currentTime
      try {
        const began = performance.now(); ctx.drawImage(v, 0, 0, config.width, config.height)
        const frame = ctx.getImageData(0, 0, config.width, config.height).data
        if (calibrating.current) {
          const prior = calibrationFrames.current.at(-1)
          if (prior && difference(frame, prior, { x: 0, y: 0, w: 1, h: 1 }, config.width, config.height, config.pixelDelta) > config.stableThreshold) { calibrationFrames.current = []; setCalibrationCount(1) }
          else { calibrationFrames.current.push(frame.slice()); setCalibrationCount(calibrationFrames.current.length) }
          if (calibrationFrames.current.length >= 16) {
            const average = frame.slice()
            for (let i = 0; i < average.length; i++) average[i] = calibrationFrames.current.reduce((sum, sample) => sum + sample[i], 0) / calibrationFrames.current.length
            baseline.current = average; previous.current = frame.slice(); cycleFrame.current = frame.slice()
            calibrating.current = false; calibrationFrames.current = []; detector.current = new FoldingDetector(config)
            setReady(true); callbacks.current.onReady({ zones, config })
          }
          return
        }
        if (!baseline.current || !previous.current) { previous.current = frame.slice(); return }
        const signals = extractSignals(frame, previous.current, baseline.current, zones, Date.now(), config)
        if (detector.current.stage === 'ready') cycleFrame.current = previous.current.slice()
        const change = difference(frame, cycleFrame.current ?? frame, zones.completed, config.width, config.height, config.pixelDelta)
        const accepted = callbacks.current.active && detector.current.update(signals, change)
        callbacks.current.onObservation({ signals, change, stage: detector.current.stage, reason: detector.current.reason, processingMs: performance.now() - began })
        if (accepted) callbacks.current.onEvent('source → sustained work → changed completed area → work cleared → stable placement')
        previous.current = frame.slice()
      } catch (e) { failed = true; invalidate(); setError(e instanceof Error ? e.message : 'Frame analysis stopped'); callbacks.current.onInterrupt('Frame processing failed') }
    }, 1000 / config.fps)
    return () => clearInterval(interval)
  }, [camera, config, zones])
  function position(e: PointerEvent<HTMLDivElement>) {
    const box = e.currentTarget.getBoundingClientRect()
    return { x: Math.max(0, Math.min(.95, (e.clientX - box.left) / box.width)), y: Math.max(.2, Math.min(.95, (e.clientY - box.top) / box.height)) }
  }
  function drawZone(e: PointerEvent<HTMLDivElement>) {
    if (!drag.current || !editing) return
    const p = position(e), origin = drag.current
    const r: Rect = { x: Math.min(origin.x, p.x), y: Math.min(origin.y, p.y), w: Math.max(.05, Math.abs(p.x - origin.x)), h: Math.max(.05, Math.abs(p.y - origin.y)) }
    setZones(current => ({ ...current, [selected]: r }))
  }
  const overlap = ZONE_NAMES.some((a, i) => ZONE_NAMES.slice(i + 1).some(b => {
    const x = zones[a], y = zones[b]; return x.x < y.x + y.w && x.x + x.w > y.x && x.y < y.y + y.h && x.y + x.h > y.y
  }))
  return <section className="camera-section">
    <div className="section-heading"><div><h2>Your folding workspace</h2><p>Camera frames stay on this device. No microphone.</p></div><ShieldCheck size={24} /></div>
    <div className={`camera-preview ${editing ? 'editing' : ''}`} style={{ aspectRatio: ratio }} onPointerDown={e => { if (editing) { e.currentTarget.setPointerCapture(e.pointerId); drag.current = position(e) } }} onPointerMove={drawZone} onPointerUp={e => { drawZone(e); drag.current = null }} onPointerCancel={() => { drag.current = null }}>
      <video ref={video} muted playsInline autoPlay aria-label="Unmirrored live camera preview" />
      {camera !== 'on' && <div className="camera-empty"><Camera size={36} /><strong>{camera === 'requesting' ? 'Allow camera access in your browser' : 'Your chore is the controller'}</strong><span>Turn on your front camera to set up the folding test.</span></div>}
      {camera === 'on' && ZONE_NAMES.map((name, i) => <div key={name} className={`zone zone-${name}`} style={{ left: `${zones[name].x * 100}%`, top: `${zones[name].y * 100}%`, width: `${zones[name].w * 100}%`, height: `${zones[name].h * 100}%` }}><span>{i + 1} · {name === 'source' ? 'Source pile' : name === 'work' ? 'Fold here' : 'Completed'}</span></div>)}
      {camera === 'on' && <span className="preview-label">Unmirrored · keep top strip still</span>}
    </div>
    {error && <p className="error" role="alert">{error}</p>}
    <div className="camera-actions">{camera !== 'on' ? <button className="primary" disabled={camera === 'requesting'} onClick={() => void startCamera()}><Camera size={18} /> Enable camera</button> : <>
      <button disabled={active} onClick={() => { invalidate(); setEditing(!editing) }}><Move size={16} /> {editing ? 'Finish zone setup' : 'Adjust zones'}</button>
      <button disabled={active || editing || overlap || (calibrationCount > 0 && !ready)} className={ready ? '' : 'primary'} onClick={() => { invalidate(); calibrationFrames.current = []; calibrating.current = true; setCalibrationCount(1) }}><RefreshCw size={16} /> {ready ? 'Recalibrate' : calibrationCount ? `Hold still… ${Math.min(100, Math.round(calibrationCount / 16 * 100))}%` : 'Calibrate empty work area'}</button>
      <button disabled={active} onClick={() => { const next = facing === 'user' ? 'environment' : 'user'; setFacing(next); void startCamera(next) }}>Switch camera</button>
      <button onClick={() => { stopCamera(); callbacks.current.onInterrupt('Camera turned off') }}>Camera off</button>
    </>}{camera === 'requesting' && <button onClick={stopCamera}>Cancel</button>}</div>
    {editing && <div className="zone-editor"><label>Zone to draw <select value={selected} onChange={e => setSelected(e.target.value as ZoneName)}>{ZONE_NAMES.map(n => <option key={n} value={n}>{n}</option>)}</select></label><p>Drag a rectangle in the preview. Keep zones separate and below the top strip.</p><button onClick={() => setZones(DEFAULT_ZONES)}>Reset zones</button></div>}
    {overlap && <p className="error">Zones overlap. Adjust them before calibrating.</p>}
    <p className="setup-note">{ready ? <><Check size={16} /> Calibration ready. Leave the phone in this position.</> : 'Before calibration: laundry in Source pile. Fold here and Completed empty, hands out of view.'}</p>
    <details className="advanced"><summary>Detection settings · field-test tools</summary><p>Changing settings requires recalibration. Values are experimental.</p>
      {([{ key: 'motionThreshold', label: 'Movement threshold', min: .02, max: .2, step: .005 }, { key: 'placementThreshold', label: 'Placement change threshold', min: .02, max: .3, step: .005 }, { key: 'occupancyThreshold', label: 'Work area clear threshold', min: .02, max: .2, step: .005 }, { key: 'minimumWorkMs', label: 'Minimum work time (ms)', min: 1000, max: 6000, step: 250 }, { key: 'stableMs', label: 'Stable placement time (ms)', min: 500, max: 3000, step: 100 }, { key: 'cooldownMs', label: 'Cooldown (ms)', min: 1000, max: 6000, step: 250 }, { key: 'cycleTimeoutMs', label: 'Cycle timeout (ms)', min: 30000, max: 180000, step: 10000 }] as const).map(s => <label key={s.key}>{s.label} <output>{config[s.key]}</output><input aria-label={s.label} type="range" disabled={active} min={s.min} max={s.max} step={s.step} value={config[s.key]} onChange={e => { invalidate(); setConfig(c => ({ ...c, [s.key]: Number(e.target.value) })) }} /></label>)}
    </details>
  </section>
}

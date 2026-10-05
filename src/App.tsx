import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Download, Flag, Mountain, Play, Square } from 'lucide-react'
import { CameraLab } from './components/CameraLab'
import type { Calibration, Observation } from './components/CameraLab'
import { MountainScene } from './components/MountainScene'
import { BEN_NEVIS } from './domain/config'
import { appendEvent, emptyLedger, parseLedger, STORAGE_KEY, summary } from './domain/ledger'
import type { FieldRun, LaundryEvent } from './domain/events'

const REPORT_KEY = 'laundry-mountain:field-report:v1'
const stageLabels: Record<string, string> = { ready: 'Ready for an item', source: 'Source reached', working: 'Folding in progress', placement: 'Checking placement', cooldown: 'Item counted · cooldown' }
export default function App() {
  const [storageError, setStorageError] = useState('')
  const [ledger, setLedger] = useState(() => { try { return parseLedger(localStorage.getItem(STORAGE_KEY)) } catch { return emptyLedger() } })
  const ledgerRef = useRef(ledger), storageBlocked = useRef(false)
  useEffect(() => { try { parseLedger(localStorage.getItem(STORAGE_KEY)) } catch (e) { storageBlocked.current = true; setStorageError(e instanceof Error ? e.message : 'Storage unavailable') } }, [])
  const [calibration, setCalibration] = useState<Calibration | null>(null), [active, setActive] = useState(false)
  const runRef = useRef<FieldRun | null>(null)
  const [report, setReport] = useState<FieldRun | null>(() => { try { const raw = localStorage.getItem(REPORT_KEY); return raw ? JSON.parse(raw) : null } catch { return null } })
  const [observation, setObservation] = useState<Observation | null>(null), [count, setCount] = useState(0), [clock, setClock] = useState(Date.now())
  const [message, setMessage] = useState(''), [close, setClose] = useState(false), [notes, setNotes] = useState(''), [burst, setBurst] = useState('')
  const stats = summary(ledger), lastDiagnostic = useRef(0)
  useEffect(() => { if (!active) return; const timer = setInterval(() => setClock(Date.now()), 1000); return () => clearInterval(timer) }, [active])
  useEffect(() => { if (!burst) return; const timer = setTimeout(() => setBurst(''), 2500); return () => clearTimeout(timer) }, [burst])
  const stop = useCallback((reason = 'Test finished. Results are ready below.') => {
    const run = runRef.current; if (!run) return
    run.endedAt = Date.now(); runRef.current = null; setReport({ ...run }); setActive(false); setMessage(reason)
    try { localStorage.setItem(REPORT_KEY, JSON.stringify(run)) } catch { setStorageError('Report could not be saved. Download it before leaving.') }
  }, [])
  function start(kind: FieldRun['kind']) {
    if (!calibration || storageBlocked.current) return
    const at = Date.now()
    runRef.current = { id: crypto.randomUUID(), startedAt: at, kind, events: [], diagnostics: [], config: { ...calibration.config }, frames: 0, processingMs: 0, notes: '', userAgent: navigator.userAgent }
    setReport(null); setNotes(''); setActive(true); setCount(0); setClock(at); setMessage(''); lastDiagnostic.current = 0
  }
  const acceptEvent = useCallback((evidence: string) => {
    const run = runRef.current; if (!run) return
    const event: LaundryEvent = { id: crypto.randomUUID(), sessionId: run.id, at: Date.now(), action: 'folding', source: 'camera', items: 1, evidence }
    run.events.push(event); setCount(run.events.length)
    if (run.kind === 'negative-control') { setBurst('False event logged'); return }
    const updated = appendEvent(ledgerRef.current, event)
    try {
      if (storageBlocked.current) throw new Error('Saved data is unreadable')
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated)); const before = summary(ledgerRef.current).lifetimeMetres
      ledgerRef.current = updated; setLedger(updated); setBurst(`+${summary(updated).lifetimeMetres - before} m`)
    } catch { storageBlocked.current = true; setStorageError('Progress could not be saved. Test stopped; download the report.'); stop('Storage failed; test ended.') }
  }, [stop])
  const observe = useCallback((o: Observation) => {
    setObservation(o); const run = runRef.current; if (!run) return
    run.frames++; run.processingMs += o.processingMs
    if (o.signals.at - lastDiagnostic.current >= 1000) {
      lastDiagnostic.current = o.signals.at
      if (run.diagnostics.length < 3600) run.diagnostics.push({ at: o.signals.at, stage: o.stage, motion: Object.values(o.signals.motion), occupancy: Object.values(o.signals.occupancy), outsideMotion: o.signals.outsideMotion })
    }
  }, [])
  const ready = useCallback((value: Calibration | null) => setCalibration(value), [])
  function download() {
    if (!report) return
    const data = { ...report, notes, calibration, progress: stats, status: 'physical results require human assessment', version: 1 }
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }))
    const a = document.createElement('a'); a.href = url; a.download = `laundry-mountain-${report.kind}-${report.id}.json`; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
  const elapsed = runRef.current ? Math.max(0, Math.floor((clock - runRef.current.startedAt) / 1000)) : 0
  return <>
    <header className="app-header"><a className="brand" href="/" aria-label="Laundry Mountain home"><Mountain size={33} strokeWidth={2.4} /><span>LAUNDRY<span>MOUNTAIN</span></span></a><span className="phase-label">Folding field test · Phase 1</span></header>
    <main><div className="intro"><div><h1>Small loads.<br />Higher ground.</h1><p>Fold real laundry. Watch your climb begin.</p></div><div className="test-status"><span className="status-dot" />Physical accuracy awaiting your phone test</div></div>
      {storageError && <p className="error" role="alert">{storageError}</p>}
      <div className="lab-layout"><div className="workspace-column"><CameraLab active={active} onEvent={acceptEvent} onObservation={observe} onReady={ready} onInterrupt={stop} />
        <section className="session-controls"><div className="section-heading"><div><h2>{active ? stageLabels[observation?.stage ?? 'ready'] : 'Make the first climb count'}</h2><p>{active ? observation?.reason ?? 'Take one item from the source pile.' : 'Calibrate your workspace, then start the 20-item folding test.'}</p></div></div>
          <div className="session-stats"><div><strong>{count}</strong><span>{runRef.current?.kind === 'negative-control' ? 'false events' : 'detected items'}</span></div><div><strong>{String(Math.floor(elapsed / 60)).padStart(2, '0')}:{String(elapsed % 60).padStart(2, '0')}</strong><span>test time</span></div><div><strong>{active && runRef.current ? (runRef.current.frames / Math.max(1, elapsed)).toFixed(1) : '—'}</strong><span>analysis fps</span></div></div>
          <div className="test-buttons">{active ? <button className="primary" onClick={() => stop()}><Square size={16} /> Finish test</button> : <><button className="primary" disabled={!calibration || !!storageError} onClick={() => start('folding')}><Play size={18} /> Start folding test</button><button disabled={!calibration || !!storageError} onClick={() => start('negative-control')}>Start negative control</button></>}</div>
          <p className="small-print">Negative-control events are logged as false events and never earn metres.</p>{message && <p role="status" className="notice">{message}</p>}
        </section></div>
        <aside className="climb-column"><section className="mountain-panel"><div className="mountain-title"><div><span className="muted-label">YOUR FIRST EXPEDITION</span><h2>Ben Nevis</h2><p>Scottish Highlands · 1,345 m</p></div><Flag size={22} /></div>
          <div className="scene-wrap"><MountainScene metres={stats.mountainMetres} close={close} />{burst && <span key={`${burst}-${count}`} className="metre-burst">{burst}</span>}<div className="scene-toggle"><button aria-pressed={!close} onClick={() => setClose(false)}>Full mountain</button><button aria-pressed={close} onClick={() => setClose(true)}>Climb view</button></div></div>
          <div className="progress-line"><strong>{stats.mountainMetres.toLocaleString()} m climbed</strong><span>{stats.percent.toFixed(1)}%</span></div><progress value={stats.mountainMetres} max={BEN_NEVIS.elevation} aria-label="Ben Nevis progress" /><p className="remaining">{Math.ceil(BEN_NEVIS.elevation - stats.mountainMetres).toLocaleString()} m to the summit <ArrowUpRight size={16} /></p>
          <div className="lifetime"><div><strong>{stats.lifetimeMetres.toLocaleString()} m</strong><span>Lifetime Laundry Metres</span></div><div><strong>{stats.items}</strong><span>Items processed</span></div></div><p className="small-print">Saved on this browser/device. Cloud sync follows the folding gate. Illustrative game route.</p>
        </section><section className="test-guide"><h3>A clear path to proof</h3><ol><li>Source pile on one side, empty folding area in the middle, empty completed area on the other.</li><li>Fold in the work zone. Place the item fully in Completed, withdraw your hands and wait for Ready.</li><li>20 items, then a separate 2-minute negative control. Target: 18/20, no duplicates, no false events.</li></ol></section></aside>
      </div>
      <details className="diagnostics"><summary>Live diagnostics · experimental folding detector</summary><p>This detector infers a processing cycle from movement and stable placement. It does not recognise garments or verify fold quality.</p><div className="diagnostic-grid">{(['source', 'work', 'completed'] as const).map(n => <div key={n}><strong>{n}</strong><span>Movement: {((observation?.signals.motion[n] ?? 0) * 100).toFixed(1)}%</span><span>Baseline change: {((observation?.signals.occupancy[n] ?? 0) * 100).toFixed(1)}%</span></div>)}<div><strong>Frame analysis</strong><span>{observation?.processingMs.toFixed(1) ?? '—'} ms / frame</span><span>Placement change: {((observation?.change ?? 0) * 100).toFixed(1)}%</span></div></div></details>
      {report && <section className="report"><div className="section-heading"><div><h2>{report.kind === 'folding' ? 'Folding test results' : 'Negative-control results'}</h2><p>{report.events.length} automatic events · {Math.round(((report.endedAt ?? report.startedAt) - report.startedAt) / 1000)} seconds · {report.frames} analysed frames</p></div><button onClick={download}><Download size={18} /> Download report</button></div><label>What happened physically?<textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Correct detections / 20, missed item numbers, duplicates, false events, phone/browser and lighting." /></label><p className="small-print">Match automatic events to the actual laundry actions to assess accuracy. Reports contain numbers and timestamps, never camera images.</p></section>}
    </main><footer>Real laundry. Higher ground.<span>Built during the event · no simulated player activity</span></footer>
  </>
}

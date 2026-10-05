import { useRef, useState } from 'react'
import { ArrowRight, Check, ChevronRight, Flag, Flame, Mountain, Shirt } from 'lucide-react'
import { BEN_NEVIS } from '../domain/config'
import { expeditionProgress } from '../domain/expedition'
import type { summary } from '../domain/ledger'
import { MountainScene } from './MountainScene'

export function Expedition({ stats, onOpenTest, hasReport, storageError }: {
  stats: ReturnType<typeof summary>; onOpenTest: () => void; hasReport: boolean; storageError: string
}) {
  const scene = useRef<HTMLElement>(null)
  const progress = expeditionProgress(stats.mountainMetres)
  const [close, setClose] = useState(false)
  const [selected, setSelected] = useState<number | null>(null)
  const checkpoint = BEN_NEVIS.checkpoints.find(c => c.metres === selected)
  return <div className="expedition-app">
    <header className="expedition-header"><a className="brand" href="/?view=expedition" aria-label="Laundry Mountain expedition"><Mountain size={33} /><span>LAUNDRY<span>MOUNTAIN</span></span></a><button onClick={onOpenTest}>Folding field test <ArrowRight size={16} /></button></header>
    <main className="expedition-main">
      <div className="expedition-intro"><div><p>Your expedition</p><h1>Small habits.<br />Higher horizons.</h1></div><p className="expedition-caption">A little laundry.<br />A little further up the mountain.</p></div>
      {storageError && <p className="error" role="alert">{storageError}</p>}
      <div className="expedition-layout">
        <section ref={scene} className="expedition-scene" aria-label="Your Ben Nevis expedition">
          <div className="expedition-scene-heading"><div><h2>Ben Nevis</h2><p>Scotland · Scottish Highlands</p></div><div className="summit-label"><Flag size={17} /><span>Summit<strong>1,345 m</strong></span></div></div>
          <MountainScene metres={stats.mountainMetres} close={close} focusMetres={selected ?? undefined} />
          {checkpoint && <div className="scene-inspection"><Flag size={16} /><span>Viewing {checkpoint.name}<small>{checkpoint.metres.toLocaleString()} Laundry Metres</small></span></div>}
          <div className="expedition-scene-footer"><div><span className="flag-dot" />Your flag · {stats.mountainMetres.toLocaleString()} m</div><div className="expedition-view-controls" aria-label="Mountain view"><button aria-pressed={!close} onClick={() => { setClose(false); setSelected(null) }}>Full mountain</button><button aria-pressed={close} onClick={() => { setClose(true); setSelected(null) }}>Climb view</button></div></div>
          <p className="scene-disclaimer">Illustrative game route. Checkpoints use Laundry Metres.</p>
        </section>
        <aside className="expedition-sidebar">
          <section className="expedition-progress" aria-label="Saved expedition progress"><p>Your climb so far</p><div className="expedition-metres"><strong>{stats.mountainMetres.toLocaleString()}</strong><span>m climbed</span></div><div className="expedition-percent"><span>Ben Nevis</span><strong>{stats.percent.toFixed(1)}%</strong></div><progress value={stats.mountainMetres} max={BEN_NEVIS.elevation} aria-label="Ben Nevis progress" /><p>{Math.ceil(BEN_NEVIS.elevation - stats.mountainMetres).toLocaleString()} m to the summit</p>
            <div className="next-checkpoint"><Flag size={21} /><div><span>{progress.summit ? 'Summit reached' : 'Next checkpoint'}</span><strong>{progress.next?.name ?? 'Ben Nevis summit'}</strong><p>{progress.summit ? 'Your saved position is at the summit.' : `${progress.remaining} Laundry Metres away`}</p></div></div>
            <button className="primary expedition-cta" onClick={onOpenTest}>Open folding test <ArrowRight size={18} /></button>
            <p className="expedition-save-note">Progress stays in this browser.</p>
          </section>
          <section className="expedition-gate"><div><span className="status-dot" /><h3>Camera validation pending</h3></div><p>The latest phone test counted no items. We can develop your expedition while detection is investigated.</p>{hasReport && <button onClick={onOpenTest}>Return to saved test <ChevronRight size={15} /></button>}</section>
        </aside>
      </div>
      <div className="expedition-stats" aria-label="Saved lifetime statistics"><div><Mountain size={23} /><strong>{stats.lifetimeMetres.toLocaleString()} m</strong><span>Lifetime Laundry Metres</span></div><div><Shirt size={23} /><strong>{stats.items}</strong><span>Camera-counted items</span></div><div><Flame size={23} /><strong>{stats.best}</strong><span>Best item momentum</span></div></div>
      <section className="checkpoint-section"><div className="checkpoint-heading"><div><h2>The route ahead</h2><p>Explore a checkpoint to look closer at the mountain.</p></div><button disabled={selected === null} onClick={() => { setSelected(null); setClose(true) }}>Back to your flag</button></div><div className="checkpoint-list">{BEN_NEVIS.checkpoints.map((c, i) => <button key={c.metres} aria-pressed={selected === c.metres} onClick={() => { setSelected(c.metres); setClose(true); scene.current?.scrollIntoView({ block: 'start' }) }} className={stats.mountainMetres >= c.metres ? 'checkpoint-reached' : ''}><span className="checkpoint-number">{stats.mountainMetres >= c.metres ? <Check size={17} /> : String(i + 1).padStart(2, '0')}</span><span><strong>{c.name}</strong><small>{c.metres.toLocaleString()} m</small></span><ChevronRight size={16} /></button>)}</div>
        {checkpoint && <div className="checkpoint-detail" role="status"><Flag size={20} /><div><strong>{checkpoint.name} · {checkpoint.metres.toLocaleString()} Laundry Metres</strong><p>{checkpoint.description}</p><small>Exploring this checkpoint. Your saved position is {stats.mountainMetres.toLocaleString()} m.</small></div></div>}
      </section>
    </main><footer className="expedition-footer">Real laundry. Higher ground.<span>One item at a time.</span></footer>
  </div>
}

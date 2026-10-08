import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flame,
  Sock,
  Home,
  Leaf,
  Mountain,
  Pause,
  Play,
  Timer,
  Layers,
  History,
  ShieldCheck,
  Basket,
  Star,
  Users,
  User,
  Plus,
  Bell,
  Lock,
  Crown,
  X
} from './GameIcons'
import { CameraLab } from './CameraLab'
import type { Calibration, Observation } from './CameraLab'
import { MountainScene } from './MountainScene'
import { ClimbScene } from './ClimbScene'
import { ManualSession } from './ManualSession'
import { manualBatch, reconcileManualSession, sessionSeconds, type Session } from '../domain/manualSession'
import { ScenicArtwork, TrailIcon } from './ScenicArtwork'
import { BasketAvatar } from './BasketAvatar'
import { EXPEDITIONS, TerrainPreview } from './TerrainPreview'
import { BEN_NEVIS, GAME } from '../domain/config'
import { expeditionProgress } from '../domain/expedition'
import { appendEvent, emptyLedger, parseLedger, STORAGE_KEY, summary } from '../domain/ledger'
import type { LaundryAction, LaundryEvent } from '../domain/events'
import './game.css'
import './reference-theme.css'
import './adventure-theme.css'
import './visual-refinement.css'

type Screen =
  | 'home'
  | 'session'
  | 'camera'
  | 'live'
  | 'results'
  | 'sessions'
  | 'mountain'
  | 'welcome'
  | 'profile'
  | 'community'
  | 'badges'
  | 'mountains'
const SESSION_KEY = 'laundry-mountain:game-sessions:v1'
const format = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 1 })
const time = (n: number) =>
  `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`
function initialScreen(): Screen {
  const requested = new URLSearchParams(location.search).get('view')
  const s = requested === 'setup' ? 'camera' : requested
  return [
    'home',
    'camera',
    'sessions',
    'mountain',
    'welcome',
    'profile',
    'community',
    'badges',
    'mountains'
  ].includes(s ?? '')
    ? (s as Screen)
    : 'home'
}
function readSessions(): Session[] {
  const raw = localStorage.getItem(SESSION_KEY)
  if (!raw) return []
  const v: unknown = JSON.parse(raw)
  if (
    !Array.isArray(v) ||
    v.some(
      (s) =>
        !s ||
        typeof s.id !== 'string' ||
        !Number.isFinite(s.startedAt) ||
        !Number.isFinite(s.items) ||
        !Number.isFinite(s.metres) ||
        !Number.isFinite(s.base) ||
        !['active', 'finished'].includes(s.status) ||
        (s.pausedAt !== undefined && !Number.isFinite(s.pausedAt)) ||
        (s.pausedMs !== undefined && (!Number.isFinite(s.pausedMs) || s.pausedMs < 0))
    )
  )
    throw new Error('Saved sessions could not be read. Existing data has been kept.')
  return v as Session[]
}
export function GameApp() {
  const [screen, setScreen] = useState<Screen>(initialScreen)
  const [error, setError] = useState(''),
    blocked = useRef(false)
  const [ledger, setLedger] = useState(() => {
    try {
      return parseLedger(localStorage.getItem(STORAGE_KEY))
    } catch {
      return emptyLedger()
    }
  })
  const ledgerRef = useRef(ledger)
  const [sessions, setSessions] = useState<Session[]>(() => {
      try {
        return readSessions().map(s => reconcileManualSession(s, ledger))
      } catch {
        return []
      }
    }),
    sessionsRef = useRef(sessions)
  const [current, setCurrent] = useState<Session | null>(null),
    run = useRef<Session | null>(null)
  const [calibration, setCalibration] = useState<Calibration | null>(null),
    [paused, setPaused] = useState(false)
  const [observation, setObservation] = useState<Observation | null>(null),
    [clock, setClock] = useState(Date.now()),
    [close, setClose] = useState(true)
  const [burst, setBurst] = useState('')
  const [profileName, setProfileName] = useState(() => {
    try {
      return localStorage.getItem('laundry-mountain:profile-name') || 'Climber'
    } catch {
      return 'Climber'
    }
  })
  const [nameDraft, setNameDraft] = useState(profileName),
    [profileMessage, setProfileMessage] = useState('')
  const [communityTab, setCommunityTab] = useState<'Global' | 'Friends' | 'You'>('Global')
  const [badgeTab, setBadgeTab] = useState<'All badges' | 'Earned' | 'Next up'>('All badges')
  const [mountainTab, setMountainTab] = useState<'All mountains' | 'Your progress'>('All mountains')
  const [dialog, setDialog] = useState<{
    title: string
    body: string
    mountainId?: string
  } | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  useEffect(() => {
    if (!dialog) return
    const modal = dialogRef.current,
      previous = document.activeElement as HTMLElement | null
    modal?.showModal()
    return () => {
      modal?.close()
      previous?.focus()
    }
  }, [dialog])
  useEffect(() => {
    try {
      parseLedger(localStorage.getItem(STORAGE_KEY))
      readSessions()
    } catch (e) {
      blocked.current = true
      setError(e instanceof Error ? e.message : 'Storage is unavailable. Progress cannot be saved.')
    }
  }, [])
  function navigate(next: Screen) {
    history.pushState(null, '', `/?view=${next}`)
    setScreen(next)
    window.scrollTo(0, 0)
  }
  const saveSession = useCallback((value: Session) => {
    const list = [value, ...sessionsRef.current.filter((s) => s.id !== value.id)]
    localStorage.setItem(SESSION_KEY, JSON.stringify(list))
    sessionsRef.current = list
    setSessions(list)
    setCurrent(value)
  }, [])
  function startManual() {
    if (blocked.current) return
    const existing = sessionsRef.current.find(s => s.mode === 'manual' && s.status === 'active')
    const s: Session = existing ? reconcileManualSession(existing, ledgerRef.current) : {
      id: crypto.randomUUID(), startedAt: Date.now(), mode: 'manual', load: 'Laundry',
      items: 0, metres: 0, base: 0, status: 'active'
    }
    try { saveSession(s); run.current = s; setClock(Date.now()); navigate('session') }
    catch { blocked.current = true; setError('Session could not be saved. Check that browser storage is enabled.') }
  }
  function pauseManual(leave = false) {
    const s = run.current
    if (!s || s.mode !== 'manual') return
    const now = Date.now()
    const updated = s.pausedAt && !leave ? { ...s, pausedAt: undefined, pausedMs: (s.pausedMs ?? 0) + now - s.pausedAt } : { ...s, pausedAt: s.pausedAt ?? now }
    try { saveSession(updated); run.current = updated; if (leave) { run.current = null; navigate('home') } }
    catch { blocked.current = true; setError('Your timer could not be saved. Previously banked items are safe.') }
  }
  function bankManual(id: string, count: number, action: LaundryAction) {
    const s = run.current
    if (!s || s.mode !== 'manual' || s.status !== 'active' || s.pausedAt || blocked.current) return false
    try {
      const saved = parseLedger(localStorage.getItem(STORAGE_KEY))
      const next = appendEvent(saved, manualBatch(id, s.id, count, action, Date.now()))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      ledgerRef.current = next; setLedger(next)
      const updated = reconcileManualSession(s, next)
      run.current = updated
      saveSession(updated)
      return true
    } catch {
      blocked.current = true
      setError('Saving was interrupted. Reopen the app to recover your last saved batch; do not add it again yet.')
      return false
    }
  }
  const finish = useCallback(
    (reason = 'Session finished') => {
      if (!run.current) return
      const value = {
        ...run.current,
        pausedMs: (run.current.pausedMs ?? 0) + (run.current.pausedAt ? Date.now() - run.current.pausedAt : 0),
        pausedAt: undefined,
        endedAt: Date.now(),
        status: 'finished' as const,
        reason
      }
      run.current = null
      try {
        saveSession(value)
      } catch {
        blocked.current = true
        setCurrent(value)
        setError('Session results could not be saved. Your last saved mountain position is preserved.')
      }
      setPaused(false)
      setScreen('results')
      history.replaceState(null, '', '/?view=results')
    },
    [saveSession]
  )
  useEffect(() => {
    const pop = () => {
      if (run.current?.mode === 'manual') { run.current = null; setScreen(initialScreen()) }
      else if (run.current) finish('Left the live session')
      else setScreen(initialScreen())
    }
    window.addEventListener('popstate', pop)
    return () => window.removeEventListener('popstate', pop)
  }, [finish])
  useEffect(() => {
    document.title = `Laundry Mountain · ${screen === 'home' ? 'Higher ground' : screen === 'live' ? 'Your live climb' : screen}`
  }, [screen])
  useEffect(() => {
    if (screen !== 'live') return
    const t = setInterval(() => setClock(Date.now()), 1000)
    return () => clearInterval(t)
  }, [screen])
  useEffect(() => {
    if (!burst) return
    const t = setTimeout(() => setBurst(''), 2200)
    return () => clearTimeout(t)
  }, [burst])
  const ready = useCallback((c: Calibration | null) => setCalibration(c), [])
  const observe = useCallback((o: Observation) => setObservation(o), [])
  const accept = useCallback(
    (evidence: string) => {
      const s = run.current
      if (!s || blocked.current) return
      const event: LaundryEvent = {
        id: crypto.randomUUID(),
        sessionId: s.id,
        at: Date.now(),
        action: 'folding',
        source: 'camera',
        items: 1,
        evidence
      }
      const next = appendEvent(ledgerRef.current, event),
        earned = summary(next).lifetimeMetres - summary(ledgerRef.current).lifetimeMetres
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        ledgerRef.current = next
        setLedger(next)
        const updated = {
          ...s,
          items: s.items + 1,
          base: s.base + GAME.metresPerItem,
          metres: s.metres + earned
        }
        run.current = updated
        saveSession(updated)
        setBurst(`+${format(earned)} m`)
      } catch {
        blocked.current = true
        setError('Storage failed. Session stopped at the last saved position.')
        finish('Storage failed')
      }
    },
    [finish, saveSession]
  )
  function start() {
    if (!calibration || blocked.current) return
    const s: Session = {
      id: crypto.randomUUID(),
      startedAt: Date.now(),
      load: 'Folding',
      items: 0,
      metres: 0,
      base: 0,
      status: 'active'
    }
    try {
      saveSession(s)
    } catch {
      blocked.current = true
      setError('Session could not be saved. Check that browser storage is enabled.')
      return
    }
    run.current = s
    setClock(s.startedAt)
    setPaused(false)
    navigate('live')
  }
  const stats = summary(ledger),
    progress = expeditionProgress(stats.mountainMetres)
  const completedLoads = sessions.filter((s) => s.status === 'finished' && s.items > 0).length
  const elapsed = current
    ? sessionSeconds(current, clock)
    : 0
  const sessionEvents = current ? ledger.events.filter((e) => e.sessionId === current.id) : []
  let streak = 0,
    last = 0
  for (const e of sessionEvents) {
    if (e.source === 'manual') continue
    streak = e.at - last > GAME.momentumResetMs ? 1 : streak + 1
    last = e.at
  }
  if (clock - last > GAME.momentumResetMs) streak = 0
  const multiplier = GAME.momentum.find((t) => streak >= t.items)?.multiplier ?? 1
  const badges = [
    {
      name: 'First Load',
      detail: 'Finish your first counted session',
      earned: completedLoads >= 1,
      Icon: Basket,
      color: 'green'
    },
    {
      name: 'On a Roll',
      detail: 'Count 5 items in one momentum streak',
      earned: stats.best >= 5,
      Icon: Flame,
      color: 'orange'
    },
    {
      name: 'Mountain Climber',
      detail: 'Reach 100 Laundry Metres',
      earned: stats.lifetimeMetres >= 100,
      Icon: Mountain,
      color: 'navy'
    },
    {
      name: 'Load Legend',
      detail: 'Complete 10 counted sessions',
      earned: completedLoads >= 10,
      Icon: Star,
      color: 'orange'
    },
    {
      name: 'Glen Explorer',
      detail: 'Reach the 250 m checkpoint',
      earned: stats.lifetimeMetres >= 250,
      Icon: Sock,
      color: 'green'
    },
    {
      name: 'Halfway Higher',
      detail: 'Reach 675 Laundry Metres',
      earned: stats.lifetimeMetres >= 675,
      Icon: Leaf,
      color: 'green'
    },
    {
      name: 'Laundry Master',
      detail: 'Complete 100 counted sessions',
      earned: completedLoads >= 100,
      Icon: Basket,
      color: 'navy'
    },
    {
      name: 'Steady Climber',
      detail: 'Count 20 items in one momentum streak',
      earned: stats.best >= 20,
      Icon: Layers,
      color: 'gold'
    },
    {
      name: 'Summit Seeker',
      detail: 'Reach the Ben Nevis summit',
      earned: stats.lifetimeMetres >= 1345,
      Icon: Crown,
      color: 'gold'
    }
  ]
  const earnedBadges = badges.filter((b) => b.earned).length
  // Fictional profiles for the approved asynchronous competition preview.
  // This data is never registered user activity or written to the real event ledger.
  const demoProfiles = [
    {
      id: 'demo-jamie',
      name: 'Jamie',
      metres: 968,
      avatar: '/art/demo-jamie.webp',
      is_demo: true as const
    },
    {
      id: 'demo-taylor',
      name: 'Taylor',
      metres: 377,
      avatar: '/art/demo-taylor.webp',
      is_demo: true as const
    },
    {
      id: 'demo-morgan',
      name: 'Morgan',
      metres: 323,
      avatar: '/art/demo-morgan.webp',
      is_demo: true as const
    },
    {
      id: 'demo-casey',
      name: 'Casey',
      metres: 242,
      avatar: '/art/demo-casey.webp',
      is_demo: true as const
    }
  ]
  const communityRows = [
    ...(communityTab === 'You' ? [] : communityTab === 'Friends' ? demoProfiles.slice(0, 2) : demoProfiles),
    {
      id: 'you',
      name: profileName,
      metres: stats.mountainMetres,
      avatar: '',
      is_demo: false
    }
  ].sort((a, b) => b.metres - a.metres)
  function scenic(mode: 'card' | 'mini' | 'map' | 'dial' | 'welcome' = 'card') {
    return (
      <div
        className={`game-scenic scenic-${mode}`}
        style={
          {
            '--session-progress': `${stats.percent * 3.6}deg`
          } as CSSProperties
        }
      >
        {mode === 'card' ? <ScenicArtwork /> : mode === 'welcome' ? <ScenicArtwork welcome /> : mode === 'mini' ? <ScenicArtwork companion={false} /> : mode === 'map' && !close ? <MountainScene
          metres={stats.mountainMetres}
          close={false}
          finish="natural"
          showLabel
          ghosts={demoProfiles.slice(0, 2)}
        /> : <ClimbScene metres={stats.mountainMetres}
          variant={mode === 'map' ? 'climb' : mode}
          sceneryFinish="illustrated"
          showProgress={mode === 'map'} />}
        {(mode === 'card' || mode === 'mini') && (
          <div className="scenic-title">
            <span>Current Mountain</span>
            <h2>Ben Nevis</h2>
            <p>
              <span className="difficulty-bars">
                <Mountain weight="fill" size={16} />
              </span>{' '}
              Your first expedition
            </p>
          </div>
        )}
        {mode === 'card' && (
          <div className="scenic-foot">
            <p>
              Less pile.
              <br />
              More peak.
            </p>
            <div
              className="progress-ring"
              style={{ '--progress': `${stats.percent * 3.6}deg` } as CSSProperties}
            >
              <strong>{format(stats.percent)}%</strong>
            </div>
          </div>
        )}
        {mode === 'dial' && (
          <div className="dial-time">
            <strong>{time(elapsed)}</strong>
            <span>{paused ? 'Session paused' : 'Time climbing'}</span>
          </div>
        )}
      </div>
    )
  }
  function saveProfile() {
    const name = nameDraft.trim().slice(0, 30) || 'Climber'
    try {
      localStorage.setItem('laundry-mountain:profile-name', name)
      setProfileName(name)
      setProfileMessage('Your name is saved on this phone.')
    } catch {
      setProfileMessage('Your name could not be saved. Check browser storage.')
    }
  }
  const title: Record<Screen, string> = {
    home: 'Home',
    session: 'Ben Nevis',
    camera: 'Camera Setup',
    live: 'Ben Nevis',
    results: 'Session Results',
    sessions: 'Session History',
    mountain: 'Ben Nevis',
    welcome: 'Welcome',
    profile: 'Your Profile',
    community: 'Community',
    badges: 'Achievements',
    mountains: 'Mountains'
  }
  const greeting =
    new Date().getHours() < 12
      ? 'Good morning,'
      : new Date().getHours() < 18
        ? 'Good afternoon,'
        : 'Good evening,'
  return (
    <div
      className={`game-shell screen-${screen} ${screen === 'live' || screen === 'camera' ? 'session-shell' : ''} ${screen === 'mountain' && !close ? 'overview-mode' : ''}`}
    >
      {screen !== 'welcome' && (
        <header className="game-header">
          {screen === 'home' ? (
            <>
              <button className="avatar-button" aria-label="Your profile" onClick={() => navigate('profile')}>
                <User weight="fill" />
              </button>
              <div className="greeting">
                <span>{greeting}</span>
                <h1>{profileName}!</h1>
              </div>
              <button
                className="icon-button bell-button"
                aria-label="Trail updates"
                onClick={() =>
                  setDialog({
                    title: 'Your next little win',
                    body: `${progress.next?.name ?? 'Ben Nevis summit'}${progress.next ? ` is ${format(progress.remaining)} Laundry Metres away.` : ' — you made it.'} Your accepted progress is saved on this phone.`
                  })
                }
              >
                <Bell size={24} />
                <i />
              </button>
            </>
          ) : (
            <>
              <button
                className="icon-button"
                aria-label="Back to home"
                onClick={() => (run.current?.mode === 'manual' ? pauseManual(true) : run.current ? finish('Returned home') : navigate('home'))}
              >
                <ArrowLeft size={22} />
              </button>
              <strong>{title[screen]}</strong>
              {screen === 'mountain' ? (
                <div className="summit-chip">
                  <Crown weight="fill" />
                  <span>
                    Summit<strong>1,345 m</strong>
                  </span>
                </div>
              ) : screen === 'live' ? (
                <span className="camera-live-dot">{paused ? 'Paused' : 'Front camera on'}</span>
              ) : (
                <span className="header-balance" />
              )}
            </>
          )}
        </header>
      )}
      {error && screen !== 'session' && (
        <p role="alert" className="error">
          {error}
        </p>
      )}
      <main className="game-main">
        {screen === 'welcome' && (
          <div className="welcome-content">
            {scenic('welcome')}
            <img
              className="welcome-logo"
              src="/brand/laundry-mountain-stacked.webp"
              alt="Laundry Mountain. Real laundry. Higher ground."
            />
            <div className="welcome-bottom">
              <h1>
                A mountain of laundry.
                <br />
                Meet your match.
              </h1>
              <p>Turn the never-ending pile into an uphill adventure.</p>
              <button className="primary game-cta" onClick={() => navigate('home')}>
                Get Started <ArrowRight size={20} />
              </button>
              <button className="text-button" onClick={() => navigate('home')}>
                Return to my saved progress
              </button>
            </div>
          </div>
        )}
        {screen === 'home' && (
          <>
            <button
              className="mountain-card-button"
              aria-label="Explore Ben Nevis"
              onClick={() => navigate('mountain')}
            >
              {scenic()}
            </button>
            <div className="game-stat-row home-stats">
              <button onClick={() => navigate('sessions')}>
                <TrailIcon kind="loads" />
                <strong>{completedLoads}</strong>
                <span>Loads</span>
              </button>
              <button onClick={() => navigate('mountain')}>
                <TrailIcon kind="mountain" />
                <strong>{format(stats.lifetimeMetres)} m</strong>
                <span>Climbed</span>
              </button>
              <button onClick={() => navigate('sessions')}>
                <TrailIcon kind="streak" />
                <strong>{stats.best}</strong>
                <span>Best streak</span>
              </button>
              <button onClick={() => navigate('badges')}>
                <TrailIcon kind="badge" />
                <strong>{earnedBadges}</strong>
                <span>Badges</span>
              </button>
            </div>
            <button className="primary game-cta start-session-cta" onClick={startManual}>
              <span className="play-disc">
                <Play weight="fill" size={17} />
              </span>
              {sessions.some(s => s.mode === 'manual' && s.status === 'active') ? 'Continue your session' : 'Start a Laundry Session'}
            </button>
            <button className="next-trail" onClick={() => navigate('mountain')}>
              <Sock weight="duotone" />
              <span>
                <small>NEXT ON YOUR TRAIL</small>
                <strong>{progress.next?.name ?? 'Summit reached'}</strong>
              </span>
              <span>
                {format(progress.remaining)} m<ArrowRight size={15} />
              </span>
            </button>
          </>
        )}
        {screen === 'session' && current && <ManualSession session={current} metres={stats.mountainMetres} disabled={blocked.current} error={error} onBank={bankManual} onPause={() => pauseManual()} onFinish={() => finish()} onLeave={() => pauseManual(true)} />}
        {(screen === 'camera' || screen === 'live') && (
          <div className={`game-session ${screen === 'live' ? 'is-live' : ''}`}>
            <div className="game-camera-column">
              {screen === 'camera' && (
                <div className="camera-intro">
                  <h1>Ready, set, fold.</h1>
                  <p>Fold at your pace. Finish whenever you like.</p>
                </div>
              )}
              <CameraLab
                active={screen === 'live'}
                paused={paused}
                presentation="game"
                onEvent={accept}
                onObservation={observe}
                onReady={ready}
                onInterrupt={finish}
                onStart={start}
                guideSession={{
                  active: screen === 'live',
                  elapsed,
                  count: current?.items ?? 0,
                  stage: observation?.stage
                }}
              />
              {screen === 'camera' && (
                <div className="phone-position">
                  <Mountain weight="fill" size={25} />
                  <p>
                    Phone in landscape, screen facing you. Start 1–1.5 m away and frame the folding area and
                    completed stack.
                  </p>
                </div>
              )}
              {screen === 'live' && (
                <p className="live-instruction" role="status">
                  {paused
                    ? 'Paused. Your place is saved. Resume before picking up your next item.'
                    : (observation?.reason ??
                      'Take one item from the pickup spot. Fold, place in Completed, then withdraw your hands.')}
                </p>
              )}
            </div>
            <section className="game-climb-column">
              <div className="live-heading">
                <h1>{paused ? 'Take a Breather' : 'Keep Going!'}</h1>
                <p>{paused ? 'Even mountains can wait.' : 'The pile goes down. You go up.'}</p>
              </div>
              {scenic('dial')}
              {burst && (
                <div className="game-burst" role="status">
                  {burst}
                </div>
              )}
              <div className="game-stat-row">
                <div>
                  <TrailIcon kind="loads" />
                  <strong>{current?.items ?? 0}</strong>
                  <span>Items Counted</span>
                </div>
                <div>
                  <TrailIcon kind="mountain" />
                  <strong>+{format(current?.metres ?? 0)} m</strong>
                  <span>Elevation Gained</span>
                </div>
                <div>
                  <TrailIcon kind="streak" />
                  <strong>×{multiplier.toFixed(2)}</strong>
                  <span>Momentum</span>
                </div>
              </div>
              {screen === 'live' && (
                <>
                  <div className="momentum-card">
                    <Flame weight="fill" />
                    <div className="goal-progress">
                      <span>{progress.next ? 'Next checkpoint' : 'Ben Nevis complete'}</span>
                      <strong>{progress.next ? `${format(progress.remaining)} m to go` : 'Summit reached'}</strong>
                      <progress
                        aria-label="Mountain progress"
                        max={BEN_NEVIS.elevation}
                        value={stats.mountainMetres}
                      />
                      <small>
                        {streak >= 5 ? 'Keep the momentum going!' : 'Five steady items starts your momentum.'}
                      </small>
                    </div>
                  </div>
                  <div className="game-live-buttons">
                    <button onClick={() => setPaused((p) => !p)}>
                      {paused ? <Play weight="fill" /> : <Pause weight="fill" />}
                      {paused ? 'Resume' : 'Pause'}
                    </button>
                    <button className="primary" onClick={() => finish()}>
                      Finish session <Check />
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
        )}
        {screen === 'results' && current && (
          <>
            <div className={`results-heading ${current.items ? 'has-progress' : ''}`}>
              {current.items > 0 && (
                <div className="celebration" aria-hidden="true">
                  {Array.from({ length: 24 }, (_, i) => (
                    <i
                      key={i}
                      style={
                        {
                          '--i': i,
                          '--x': `${(i * 37 + 11) % 100}%`,
                          '--y': `${(i * 29 + 7) % 100}%`,
                          '--r': `${i * 71}deg`
                        } as CSSProperties
                      }
                    />
                  ))}
                </div>
              )}
              <BasketAvatar />
              <h1>{current.items ? 'That’s a load off.' : 'Session Finished'}</h1>
              <p>{current.items ? `${format(current.items)} items ${current.mode === 'manual' ? 'banked' : 'folded'}. ${format(current.metres)} Laundry Metres earned.` : 'Your mountain will be here when you’re ready.'}</p>
              {current.mode === 'manual' && <p className="manual-honesty">Manually confirmed · 10 metres per item</p>}
            </div>
            <div className="game-stat-row result-stats">
              <div>
                <TrailIcon kind="mountain" />
                <strong>+{format(current.metres)} m</strong>
                <span>Elevation Gained</span>
              </div>
              <div>
                <TrailIcon kind="loads" />
                <strong>{current.items}</strong>
                <span>Items</span>
              </div>
              <div>
                <Timer weight="duotone" />
                <strong>{time(elapsed)}</strong>
                <span>Session Time</span>
              </div>
            </div>
            {current.items ? (
              <div className="reward-ribbon">
                <Flame weight="fill" />
                <p>
                  <strong>
                    {current.metres > current.base ? 'On a roll. On a climb.' : 'One less thing on the pile.'}
                  </strong>
                  <span>
                    {current.metres > current.base
                      ? `+${format(current.metres - current.base)} bonus Laundry Metres`
                      : 'Every completed item takes you higher.'}
                  </span>
                </p>
              </div>
            ) : (
              <div className="privacy-card zero-result">
                <Leaf weight="duotone" />
                <p>
                  <strong>{current.mode === 'manual' ? 'No batches banked this time.' : 'No items were detected.'}</strong>
                  <br />
                  Your saved position is unchanged.
                </p>
              </div>
            )}
            {current.items > 0 && <blockquote>Less laundry. More altitude.</blockquote>}
            <button className="primary game-cta" onClick={() => navigate('mountain')}>
              Back to my mountain <ArrowRight size={18} />
            </button>
            <button className="game-cta secondary" onClick={() => navigate('sessions')}>
              View session history
            </button>
            <details className="results-breakdown">
              <summary>Your climb breakdown</summary>
              <div className="breakdown">
                <p>
                  <span>Base metres</span>
                  <strong>{format(current.base)} m</strong>
                </p>
                <p>
                  <span>Momentum bonus</span>
                  <strong>+{format(current.metres - current.base)} m</strong>
                </p>
                <p>
                  <span>Total Laundry Metres</span>
                  <strong>{format(current.metres)} m</strong>
                </p>
                <p>Saved on this phone.</p>
              </div>
            </details>
            <a className="diagnostics-link" href="/?view=test">
              Open test diagnostics
            </a>
          </>
        )}
        {screen === 'mountain' && (
          <>
            <div className="map-scene">
              {scenic('map')}
              {!close && <div className="overview-next"><Sock weight="duotone" size={28} /><span><small>{progress.summit ? 'Expedition complete' : 'Next checkpoint'}</small><strong>{progress.next?.name ?? 'Summit reached'}</strong></span><b>{progress.summit ? '1,345 m' : `${format(progress.remaining)} m`}</b></div>}
              <div className="view-control">
                <button aria-pressed={!close} onClick={() => setClose(false)}>
                  Full mountain
                </button>
                <button aria-pressed={close} onClick={() => setClose(true)}>
                  Climb view
                </button>
              </div>
              <a className="terrain-credit" href="/terrain-credits.html" target="_blank" rel="noreferrer">
                Map data © OpenStreetMap · Terrain credits
              </a>
            </div>
            <details className="route-details">
              <summary aria-label="Your route checkpoints">Checkpoints</summary>
              <div className="mountain-progress">
                <div>
                  <strong>{format(stats.mountainMetres)} m climbed</strong>
                  <span>{format(1345 - stats.mountainMetres)} m to summit</span>
                </div>
                <progress aria-label="Ben Nevis progress" value={stats.mountainMetres} max={1345} />
              </div>

              <ol className="game-checkpoints">
                {BEN_NEVIS.checkpoints.map((c) => (
                  <li key={c.metres} className={stats.mountainMetres >= c.metres ? 'reached' : ''}>
                    <span>{stats.mountainMetres >= c.metres ? <Check /> : <Sock />}</span>
                    <div>
                      <strong>{c.name}</strong>
                      <p>{c.description}</p>
                    </div>
                    <small>{format(c.metres)} m</small>
                  </li>
                ))}
              </ol>
              <p>
                Real Ben Nevis terrain and Mountain Path. Checkpoints measure Laundry Metres, not hiking
                distance.
              </p>
            </details>
          </>
        )}
        {screen === 'mountains' && (
          <>
            <div className="segmented" aria-label="Mountain filter">
              {(['All mountains', 'Your progress'] as const).map((t) => (
                <button key={t} aria-pressed={mountainTab === t} onClick={() => setMountainTab(t)}>
                  {t}
                </button>
              ))}
            </div>
            <div className="expedition-cards">
              <button
                className="expedition-card current-expedition"
                aria-label="Explore Ben Nevis"
                onClick={() => navigate('mountain')}
              >
                <span className="expedition-thumbnail">{scenic('mini')}</span>
                <span className="expedition-name">
                  <strong>Ben Nevis</strong>
                  <small>
                    <Mountain weight="fill" /> Scottish Highlands
                  </small>
                  <span>1,345 m · Your first expedition</span>
                </span>
                <span
                  className="mini-progress-ring"
                  style={
                    {
                      '--progress': `${stats.percent * 3.6}deg`
                    } as CSSProperties
                  }
                >
                  <strong>{format(stats.percent)}%</strong>
                </span>
              </button>
              {mountainTab === 'All mountains' &&
                EXPEDITIONS.map((mountain, index) => (
                  <button
                    className="expedition-card"
                    key={mountain.id}
                    aria-label={`${mountain.name} Future expedition`}
                    onClick={() =>
                      setDialog({
                        title: mountain.name,
                        mountainId: mountain.id,
                        body: `${mountain.region} · ${format(mountain.elevation)} m. Complete ${index ? EXPEDITIONS[index - 1].name : 'Ben Nevis'} to reach this expedition. This terrain preview is ready to explore; playable progression arrives in a future update.`
                      })
                    }
                  >
                    <span className="expedition-thumbnail">
                      <TerrainPreview id={mountain.id} name={mountain.name} />
                    </span>
                    <span className="expedition-name">
                      <strong>{mountain.name}</strong>
                      <small>
                        <Mountain weight="fill" /> {mountain.difficulty}
                      </small>
                      <span>
                        {format(mountain.elevation)} m · {mountain.region}
                      </span>
                    </span>
                    <span className="expedition-lock">
                      <Lock weight="fill" />
                      <strong>Locked</strong>
                      <small>Future expedition</small>
                    </span>
                  </button>
                ))}
            </div>
            <p className="page-quote">“A cleaner home. A higher you.”</p>
          </>
        )}
        {screen === 'sessions' && (
          <>
            <div className="page-intro">
              <History weight="duotone" />
              <h1>Every load tells a story.</h1>
              <p>Proof that the laundry got you somewhere.</p>
            </div>
            {!sessions.length ? (
              <section className="history-empty">
                <BasketAvatar />
                <h2>Your first load is your first step.</h2>
                <p>A few folds today. A little further up the mountain. Your completed sessions will live here.</p>
                <button className="primary game-cta" onClick={startManual}>
                  Start your first session <ArrowRight size={16} />
                </button>
              </section>
            ) : (
              <div className="session-history">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
                      if (s.mode === 'manual' && s.status === 'active') { startManual(); return }
                      setCurrent(s)
                      setClock(s.endedAt ?? s.startedAt)
                      navigate('results')
                    }}
                  >
                    <span className="history-icon">
                      <Basket weight="duotone" />
                    </span>
                    <span>
                      <strong>
                        {s.load} · {s.items} items{s.mode === 'manual' ? ' · Manual' : ''}
                      </strong>
                      <small>
                        {new Date(s.startedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}{' '}
                        ·{' '}
                        {s.status === 'active'
                          ? s.mode === 'manual' ? 'Ready to continue' : 'Left before finishing'
                          : time(sessionSeconds(s, s.endedAt ?? s.startedAt))}
                      </small>
                    </span>
                    <strong>+{format(s.metres)} m</strong>
                    <ArrowRight size={17} />
                  </button>
                ))}
              </div>
            )}
            <p className="page-quote">One pile at a time. One peak at a time.</p>
          </>
        )}
        {screen === 'badges' && (
          <>
            <div className="segmented" aria-label="Badge filter">
              {(['All badges', 'Earned', 'Next up'] as const).map((t) => (
                <button key={t} aria-pressed={badgeTab === t} onClick={() => setBadgeTab(t)}>
                  {t}
                </button>
              ))}
            </div>
            <div className="badge-grid">
              {badges
                .filter((b) => (badgeTab === 'Earned' ? b.earned : badgeTab === 'Next up' ? !b.earned : true))
                .map(({ name, detail, earned, Icon, color }, index) => (
                  <button
                    className={`badge-card ${earned ? 'earned' : 'locked'} ${!earned && index > 5 ? 'distant-badge' : ''} badge-${color}`}
                    title={earned ? 'Earned' : 'Locked — view requirements'}
                    key={name}
                    onClick={() =>
                      setDialog({
                        title: name,
                        body: `${earned ? 'Earned! ' : ''}${detail}. ${earned ? 'Your accepted laundry progress earned this badge.' : 'Keep climbing to unlock this badge.'}`
                      })
                    }
                  >
                    <span className="badge-medal">
                      <img
                        className={`badge-enamel badge-enamel-${color}`}
                        src={`/art/badge-enamel-${color === 'orange' || color === 'gold' ? 'orange' : 'green'}.webp`}
                        alt=""
                        aria-hidden="true"
                      />
                      <Icon weight="fill" />
                    </span>
                    <strong>{name}</strong>
                    <small>{detail}</small>
                    {!earned && <Lock className="badge-lock" weight="fill" />}
                  </button>
                ))}
            </div>
            {badgeTab === 'Earned' && !earnedBadges && (
              <p className="empty-note">
                Your first badge is waiting at the end of your first counted session.
              </p>
            )}
            <p className="page-quote">
              “Small habits create
              <br />
              extraordinary places.”
            </p>
          </>
        )}
        {screen === 'community' && (
          <>
            <div className="segmented" aria-label="Community filter">
              {(['Global', 'Friends', 'You'] as const).map((t) => (
                <button key={t} aria-pressed={communityTab === t} onClick={() => setCommunityTab(t)}>
                  {t}
                </button>
              ))}
            </div>
            <p className="demo-notice">Demo community preview · profiles labelled Demo are fictional.</p>
            <div className="leaderboard">
              {communityRows.map((person, i) => (
                <button
                  key={person.id}
                  className={!person.is_demo ? 'your-row' : ''}
                  onClick={() =>
                    setDialog({
                      title: person.is_demo ? `${person.name} · Demo profile` : 'Your climb',
                      body: person.is_demo
                        ? 'This is fictional test data showing how asynchronous competition will look. This person is not a registered user.'
                        : `${format(stats.mountainMetres)} Laundry Metres earned on this phone. Live community accounts and syncing are not connected yet.`
                    })
                  }
                >
                  <span className="rank">
                    {i === 0 && person.metres > 0 ? <Crown weight="fill" /> : i + 1}
                  </span>
                  {person.avatar ? (
                    <img src={person.avatar} alt="" />
                  ) : (
                    <span className="avatar-small">
                      <User weight="duotone" />
                    </span>
                  )}
                  <span className="person-name">
                    <strong>
                      {person.is_demo ? person.name : 'You'}
                      {person.is_demo && <small>Demo</small>}
                    </strong>
                    <span>Ben Nevis</span>
                  </span>
                  <strong>{format((person.metres / 1345) * 100)}%</strong>
                </button>
              ))}
            </div>
            <div className="community-motto">
              <Users weight="duotone" />
              <p>
                <strong>Good company. Higher ground.</strong>
                <span>
                  Different piles.
                  <br />Same uphill ambition.
                </span>
              </p>
            </div>
            <p className="small-print">
              Preview only. Your progress is local; accounts and live competition are not connected.
            </p>
          </>
        )}
        {screen === 'profile' && (
          <>
            <div className="profile-hero">
              <div className="profile-landscape" aria-hidden="true"><ScenicArtwork companion={false} /></div>
              <span className="profile-avatar">
                <BasketAvatar />
              </span>
              <h1>{profileName}</h1>
              <p>Making a mountain out of the washing.</p>
            </div>
            <div className="profile-progress" aria-label="Your climbing progress">
              <button onClick={() => navigate('mountain')}><TrailIcon kind="mountain" /><span><strong>{format(stats.lifetimeMetres)} m</strong><small>Climbed so far</small></span><ArrowRight size={16}/></button>
              <button onClick={() => navigate('badges')}><TrailIcon kind="badge" /><span><strong>{earnedBadges}</strong><small>Badges earned</small></span><ArrowRight size={16}/></button>
            </div>
            <form
              className="profile-form"
              onSubmit={(e) => {
                e.preventDefault()
                saveProfile()
              }}
            >
              <label htmlFor="climber-name">Your climber name</label>
              <input
                id="climber-name"
                value={nameDraft}
                maxLength={30}
                onChange={(e) => setNameDraft(e.target.value)}
              />
              <button className="primary" type="submit">
                Save name
              </button>
              {profileMessage && <p role="status">{profileMessage}</p>}
            </form>
            <div className="profile-links">
              <button onClick={() => navigate('sessions')}>
                <History weight="duotone" />
                Session history
                <ArrowRight />
              </button>
              <button onClick={() => navigate('badges')}>
                <Star weight="duotone" />
                Achievements
                <span>
                  {earnedBadges} / {badges.length}
                </span>
                <ArrowRight />
              </button>
              <button onClick={() => navigate('welcome')}>
                <Mountain weight="duotone" />
                Welcome to Laundry Mountain
                <ArrowRight />
              </button>
            </div>
            <div className="privacy-card">
              <ShieldCheck weight="duotone" />
              <p>
                <strong>Saved right here.</strong>
                <br />
                Your name and progress stay in this browser. No account is needed.
              </p>
            </div>
          </>
        )}
        {!['live', 'session', 'welcome', 'mountain'].includes(screen) && (
          <p className="validation-note">
            <span />
            Camera validation pending · <a href="/?view=test">Folding test</a>
          </p>
        )}
      </main>
      {!['live', 'session', 'camera', 'welcome', 'results'].includes(screen) && (
        <nav className="game-nav" aria-label="Game navigation">
          {(
            [
              { s: 'home', label: 'Home', Icon: Home },
              { s: 'mountains', label: 'Mountains', Icon: Mountain },
              { s: 'camera', label: 'Add', Icon: Plus },
              { s: 'community', label: 'Community', Icon: Users },
              { s: 'profile', label: 'Profile', Icon: User }
            ] as const
          ).map(({ s, label, Icon }) => (
            <button
              key={s}
              className={s === 'camera' ? 'nav-add' : ''}
              aria-current={screen === s || (screen === 'mountain' && s === 'mountains') ? 'page' : undefined}
              onClick={() => s === 'camera' ? startManual() : navigate(s)}
            >
              <span>
                <Icon weight={s === 'camera' ? 'bold' : 'fill'} />
              </span>
              <small>{label}</small>
            </button>
          ))}
        </nav>
      )}
      {dialog && (
        <dialog
          ref={dialogRef}
          className="game-dialog"
          aria-labelledby="dialog-title"
          onKeyDown={(e) => {
            if (e.key === 'Tab') {
              const controls = e.currentTarget.querySelectorAll<HTMLButtonElement>('button'),
                first = controls[0],
                last = controls[controls.length - 1]
              if (e.shiftKey && document.activeElement === first) {
                e.preventDefault()
                last.focus()
              } else if (!e.shiftKey && document.activeElement === last) {
                e.preventDefault()
                first.focus()
              }
            }
          }}
          onCancel={() => setDialog(null)}
          onClick={(e) => {
            if (e.target === e.currentTarget) setDialog(null)
          }}
        >
          <div>
            <button className="icon-button" aria-label="Close" onClick={() => setDialog(null)}>
              <X />
            </button>
            <h2 id="dialog-title">{dialog.title}</h2>
            <p>{dialog.body}</p>
            {dialog.mountainId && (
              <div className="expedition-detail-preview">
                <TerrainPreview id={dialog.mountainId} name={dialog.title} />
                <small>Geographic terrain · illustrated seasonal colours</small>
              </div>
            )}
            <button className="primary game-cta" onClick={() => setDialog(null)}>
              Got it
            </button>
          </div>
        </dialog>
      )}
    </div>
  )
}

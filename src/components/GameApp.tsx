import { useCallback, useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Flame,
  Flag,
  Home,
  Hexagon,
  Leaf,
  Mountain,
  Pause,
  Play,
  Shirt,
  Timer,
  Layers,
  History,
  ShieldCheck,
  Bed,
  Dots,
  Activewear,
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
import { EXPEDITIONS, TerrainPreview } from './TerrainPreview'
import { BEN_NEVIS, GAME } from '../domain/config'
import { expeditionProgress } from '../domain/expedition'
import { appendEvent, emptyLedger, parseLedger, STORAGE_KEY, summary } from '../domain/ledger'
import type { LaundryEvent } from '../domain/events'
import './game.css'
import './reference-theme.css'

type Screen =
  | 'home'
  | 'setup'
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
interface Session {
  id: string
  startedAt: number
  endedAt?: number
  load: string
  goal: number
  items: number
  metres: number
  base: number
  status: 'active' | 'finished'
  reason?: string
}
const SESSION_KEY = 'laundry-mountain:game-sessions:v1'
const loads = [
  { name: 'Everyday', Icon: Shirt },
  { name: 'Delicates', Icon: Leaf },
  { name: 'Towels', Icon: Layers },
  { name: 'Bedding', Icon: Bed },
  { name: 'Activewear', Icon: Activewear },
  { name: 'Mixed load', Icon: Dots }
]
const format = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 1 })
const time = (n: number) =>
  `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`
function initialScreen(): Screen {
  const s = new URLSearchParams(location.search).get('view')
  return [
    'home',
    'setup',
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
        !['active', 'finished'].includes(s.status)
    )
  )
    throw new Error('Saved sessions could not be read. Existing data has been kept.')
  return v as Session[]
}
export function GameApp() {
  const [screen, setScreen] = useState<Screen>(initialScreen),
    [load, setLoad] = useState('Everyday'),
    [goal, setGoal] = useState(20)
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
        return readSessions()
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
    [close, setClose] = useState(false)
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
  const finish = useCallback(
    (reason = 'Session finished') => {
      if (!run.current) return
      const value = {
        ...run.current,
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
      if (run.current) finish('Left the live session')
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
      load,
      goal,
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
    ? Math.max(0, Math.floor(((current.endedAt ?? clock) - current.startedAt) / 1000))
    : 0
  const sessionEvents = current ? ledger.events.filter((e) => e.sessionId === current.id) : []
  let streak = 0,
    last = 0
  for (const e of sessionEvents) {
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
      Icon: Flag,
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
            '--session-progress': `${Math.min(1, (current?.items ?? 0) / (current?.goal || 20)) * 360}deg`
          } as CSSProperties
        }
      >
        <MountainScene
          metres={stats.mountainMetres}
          close={mode === 'map' ? close : false}
          showLabel={mode === 'map'}
          ghosts={mode === 'map' ? demoProfiles.slice(0, 3) : undefined}
        />
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
              Steady progress,
              <br />
              cleans brighter days.
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
    setup: 'Start a Session',
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
      className={`game-shell screen-${screen} ${screen === 'live' || screen === 'camera' ? 'session-shell' : ''}`}
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
                onClick={() => (run.current ? finish('Returned home') : navigate('home'))}
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
      {error && (
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
                Small loads.
                <br />
                Big progress.
              </h1>
              <p>Turn everyday laundry into your next adventure.</p>
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
                <Basket weight="duotone" />
                <strong>{completedLoads}</strong>
                <span>Loads</span>
              </button>
              <button onClick={() => navigate('mountain')}>
                <Mountain weight="fill" />
                <strong>{format(stats.lifetimeMetres)} m</strong>
                <span>Climbed</span>
              </button>
              <button onClick={() => navigate('sessions')}>
                <Flame weight="fill" />
                <strong>{stats.best}</strong>
                <span>Best streak</span>
              </button>
              <button onClick={() => navigate('badges')}>
                <Star weight="fill" />
                <strong>{earnedBadges}</strong>
                <span>Badges</span>
              </button>
            </div>
            <button className="primary game-cta start-session-cta" onClick={() => navigate('setup')}>
              <span className="play-disc">
                <Play weight="fill" size={17} />
              </span>
              Start a Laundry Session
            </button>
            <button className="next-trail" onClick={() => navigate('mountain')}>
              <Flag weight="duotone" />
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
        {screen === 'setup' && (
          <>
            <fieldset className="load-picker">
              <legend>What are you folding?</legend>
              <div>
                {loads.map(({ name, Icon }) => (
                  <button key={name} aria-pressed={load === name} onClick={() => setLoad(name)}>
                    <Icon size={40} weight="fill" />
                    <span>{name}</span>
                    {load === name && <Check className="choice-check" size={15} />}
                  </button>
                ))}
              </div>
            </fieldset>
            <fieldset className="goal-picker">
              <legend>Your load size</legend>
              <div>
                {[
                  { n: 10, label: 'Small' },
                  { n: 20, label: 'Medium' },
                  { n: 30, label: 'Large' }
                ].map(({ n, label }) => (
                  <button
                    key={n}
                    aria-label={`${n} items`}
                    aria-pressed={goal === n}
                    onClick={() => setGoal(n)}
                  >
                    <Basket size={n === 20 ? 35 : 31} weight="duotone" />
                    <strong>{label}</strong>
                    <span>~{n} items</span>
                  </button>
                ))}
              </div>
            </fieldset>
            <div className="session-plan">
              <Timer size={35} weight="duotone" />
              <div>
                <h2>A little time. A little higher.</h2>
                <p>Aim for {goal} items. Finish whenever you need.</p>
              </div>
            </div>
            <div className="privacy-card">
              <Leaf size={38} weight="duotone" />
              <p>
                <strong>Every load gets you higher.</strong>
                <br />
                Clean clothes. A higher you.
              </p>
            </div>
            <button className="primary game-cta" onClick={() => navigate('camera')}>
              Set up my camera <ArrowRight size={18} />
            </button>
            <p className="setup-privacy">
              <ShieldCheck size={15} />
              Camera processing stays on your phone.
            </p>
          </>
        )}
        {(screen === 'camera' || screen === 'live') && (
          <div className={`game-session ${screen === 'live' ? 'is-live' : ''}`}>
            <div className="game-camera-column">
              {screen === 'camera' && (
                <div className="camera-intro">
                  <h1>Get Ready to Climb!</h1>
                  <p>Frame your workspace. We’ll count as you fold.</p>
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
                <p>{paused ? 'Your mountain will wait.' : 'Fresh vibes on the way.'}</p>
              </div>
              {scenic('dial')}
              {burst && (
                <div className="game-burst" role="status">
                  {burst}
                </div>
              )}
              <div className="game-stat-row">
                <div>
                  <Basket weight="duotone" />
                  <strong>{current?.items ?? 0}</strong>
                  <span>Items Counted</span>
                </div>
                <div>
                  <Mountain weight="fill" />
                  <strong>+{format(current?.metres ?? 0)} m</strong>
                  <span>Elevation Gained</span>
                </div>
                <div>
                  <Flame weight="fill" />
                  <strong>×{multiplier.toFixed(2)}</strong>
                  <span>Momentum</span>
                </div>
              </div>
              {screen === 'live' && (
                <>
                  <div className="momentum-card">
                    <Flame weight="fill" />
                    <div className="goal-progress">
                      <span>{(current?.items ?? 0) >= goal ? 'Goal reached!' : 'One item closer'}</span>
                      <strong>
                        {current?.items ?? 0} / {goal}
                      </strong>
                      <progress
                        aria-label="Session item goal"
                        max={goal}
                        value={Math.min(goal, current?.items ?? 0)}
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
              <img src="/brand/laundry-mountain-stacked.webp" alt="Laundry Mountain" />
              <h1>{current.items ? 'Session Complete!' : 'Session Finished'}</h1>
              <p>{current.items ? 'Another load higher!' : 'A fresh start is always waiting.'}</p>
            </div>
            <div className="game-stat-row result-stats">
              <div>
                <Mountain weight="fill" />
                <strong>+{format(current.metres)} m</strong>
                <span>Elevation Gained</span>
              </div>
              <div>
                <Basket weight="duotone" />
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
                    {current.metres > current.base ? 'Momentum Boost!' : 'A brighter day starts here.'}
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
                  <strong>No items were detected.</strong>
                  <br />
                  Your saved position is unchanged. Your test results are still available.
                </p>
              </div>
            )}
            <blockquote>
              “Clean clothes. Brighter days.
              <br />
              You’re on your way!”
            </blockquote>
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
            <a className="diagnostics-link" href="/">
              Open test diagnostics
            </a>
          </>
        )}
        {screen === 'mountain' && (
          <>
            <div className="map-scene">
              {scenic('map')}
              <div className="map-tagline">
                <img src="/art/trail-sign.webp" alt="Cleaner clothes. Brighter days. Higher you." />
              </div>
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
              <summary>Your route checkpoints</summary>
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
                    <span>{stats.mountainMetres >= c.metres ? <Check /> : <Flag />}</span>
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
              <p>Your adventures, saved on this phone.</p>
            </div>
            {!sessions.length ? (
              <section className="history-empty">
                <Basket weight="duotone" />
                <h2>Your journey starts with one load.</h2>
                <p>Finish a session and its results will be waiting here.</p>
                <button className="primary game-cta" onClick={() => navigate('setup')}>
                  Start your first session <ArrowRight size={16} />
                </button>
              </section>
            ) : (
              <div className="session-history">
                {sessions.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => {
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
                        {s.load} · {s.items} items
                      </strong>
                      <small>
                        {new Date(s.startedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric'
                        })}{' '}
                        ·{' '}
                        {s.status === 'active'
                          ? 'Left before finishing'
                          : time(Math.max(0, Math.floor(((s.endedAt ?? s.startedAt) - s.startedAt) / 1000)))}
                      </small>
                    </span>
                    <strong>+{format(s.metres)} m</strong>
                    <ArrowRight size={17} />
                  </button>
                ))}
              </div>
            )}
            <p className="page-quote">Small habits create extraordinary places.</p>
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
                      <Hexagon className="badge-shape" weight="fill" />
                      <Hexagon className="badge-rim" weight="regular" />
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
                <strong>Together, we climb higher.</strong>
                <span>
                  Small habits. Cleaner homes.
                  <br />A brighter tomorrow.
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
              <span className="profile-avatar">
                <User weight="duotone" />
              </span>
              <h1>{profileName}</h1>
              <p>Your little habits. Your higher ground.</p>
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
        {!['live', 'welcome', 'mountain'].includes(screen) && (
          <p className="validation-note">
            <span />
            Camera validation pending · <a href="/">Folding test</a>
          </p>
        )}
      </main>
      {!['live', 'camera', 'welcome', 'results', 'setup'].includes(screen) && (
        <nav className="game-nav" aria-label="Game navigation">
          {(
            [
              { s: 'home', label: 'Home', Icon: Home },
              { s: 'mountains', label: 'Mountains', Icon: Mountain },
              { s: 'setup', label: 'Add', Icon: Plus },
              { s: 'community', label: 'Community', Icon: Users },
              { s: 'profile', label: 'Profile', Icon: User }
            ] as const
          ).map(({ s, label, Icon }) => (
            <button
              key={s}
              className={s === 'setup' ? 'nav-add' : ''}
              aria-current={screen === s || (screen === 'mountain' && s === 'mountains') ? 'page' : undefined}
              onClick={() => navigate(s)}
            >
              <span>
                <Icon weight={s === 'setup' ? 'bold' : 'fill'} />
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

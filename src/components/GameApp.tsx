import { createId } from '../domain/id'
import { Fragment, Suspense, lazy, useCallback, useEffect, useRef, useState } from 'react'
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
  Basket,
  Star,
  User,
  Plus,
  Bell,
  Lock,
  X
} from './GameIcons'
const CameraLab = lazy(() => import('./CameraLab').then(module => ({ default: module.CameraLab })))
import type { Calibration, Observation } from './CameraLab'
import { IllustratedMountainScene } from './IllustratedMountainScene'
import { ClimbScene } from './ClimbScene'
import { ManualSession } from './ManualSession'
import { manualBatch, reconcileManualSession, sessionSeconds, type Session } from '../domain/manualSession'
import { ScenicArtwork, TrailIcon, SockIcon, BadgeSymbol } from './ScenicArtwork'
import { BasketAvatar } from './BasketAvatar'
const TerrainPreview = lazy(() => import('./TerrainPreview').then(module => ({ default: module.TerrainPreview })))
import { MOUNTAINS, MOUNTAIN_IDS, isMountainId, nextMountain, type MountainId } from '../domain/mountains'
import { mountainProgress, nextUnfinishedMountain, ACTIVE_MOUNTAIN_KEY } from '../domain/mountainProgress'
import { MountainArtwork } from './MountainArtwork'
import { BEN_NEVIS, GAME } from '../domain/config'
import { expeditionProgress } from '../domain/expedition'
import { appendEvent, emptyLedger, parseLedger, STORAGE_KEY, summary } from '../domain/ledger'
import type { LaundryAction, LaundryEvent } from '../domain/events'
import { achievements, newlyEarned, achievementCaption } from '../domain/achievements'
import { AchievementMedal } from './AchievementMedal'
import { TrailReward, type TrailRewardData } from './TrailReward'
import { prepareTrailSound, playTrailReward } from './trailSound'
import { CloudIcon } from '@phosphor-icons/react/dist/csr/Cloud'
import { ChartBarIcon } from '@phosphor-icons/react/dist/csr/ChartBar'
import { SpeakerHighIcon } from '@phosphor-icons/react/dist/csr/SpeakerHigh'
import { SpeakerSlashIcon } from '@phosphor-icons/react/dist/csr/SpeakerSlash'
import './game.css'
import './reference-theme.css'
import './adventure-theme.css'
import './visual-refinement.css'
import './personal-adventure.css'
import './reference-match.css'
import './mountain-expeditions.css'

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
  | 'badges'
  | 'mountains'
const SESSION_KEY = 'laundry-mountain:game-sessions:v1'
const format = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 1 })
const time = (n: number) =>
  `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`
function initialScreen(): Screen {
  const requested = new URLSearchParams(location.search).get('view')
  const s = requested === 'setup' ? 'camera' : requested === 'community' ? 'home' : requested
  return [
    'home',
    'camera',
    'sessions',
    'mountain',
    'welcome',
    'profile',
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
        (s.mountainId !== undefined && !isMountainId(s.mountainId)) ||
        (s.pausedAt !== undefined && !Number.isFinite(s.pausedAt)) ||
        (s.pausedMs !== undefined && (!Number.isFinite(s.pausedMs) || s.pausedMs < 0))
    )
  )
    throw new Error('Saved sessions could not be read. Existing data has been kept.')
  return v as Session[]
}
export function GameApp() {
  const [screen, setScreen] = useState<Screen>(initialScreen)
  const [routeOpen, setRouteOpen] = useState(false)
  const mainPanel = useRef<HTMLElement>(null)
  useEffect(() => { if (mainPanel.current) mainPanel.current.scrollTop = 0 }, [screen])
  const [viewedId, setViewedId] = useState<MountainId | null>(() => { const id = new URLSearchParams(location.search).get('expedition'); return isMountainId(id) ? id : null })
  const [activeId, setActiveId] = useState<MountainId>(() => {
    try { const id = localStorage.getItem(ACTIVE_MOUNTAIN_KEY); return isMountainId(id) && mountainProgress(parseLedger(localStorage.getItem(STORAGE_KEY)))[id].unlocked ? id : 'ben-nevis' } catch { return 'ben-nevis' }
  })
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
    [close, setClose] = useState(!viewedId)
  const [burst, setBurst] = useState('')
  const [sound, setSound] = useState(() => { try { return localStorage.getItem('laundry-mountain:sound') === 'on' } catch { return false } })
  function toggleSound() { const next = !sound; setSound(next); if (next) prepareTrailSound(); try { localStorage.setItem('laundry-mountain:sound', next ? 'on' : 'off') } catch { /* Session preference still works. */ } }
  const [rewards, setRewards] = useState<TrailRewardData[]>([])
  const rewardTimer = useRef<number | undefined>(undefined)
  const pendingRewards = useRef<TrailRewardData[]>([])
  useEffect(() => { if (rewards[0] && sound) playTrailReward() }, [rewards, sound])
  useEffect(() => () => window.clearTimeout(rewardTimer.current), [])
  function badgeTotals(savedLedger = ledgerRef.current, savedSessions = sessionsRef.current) {
    const total = summary(savedLedger)
    return { loads: savedSessions.filter(s => s.status === 'finished' && s.items > 0).length,
      best: Math.max(total.best, 0, ...savedSessions.map(s => s.items)), metres: total.lifetimeMetres }
  }
  function reveal(queue: TrailRewardData[], delay = 0) {
    if (!queue.length) return
    window.clearTimeout(rewardTimer.current)
    pendingRewards.current.push(...queue)
    rewardTimer.current = window.setTimeout(() => { const pending = pendingRewards.current; pendingRewards.current = []; setRewards(previous => [...previous, ...pending]) }, delay)
  }
  const [profileName, setProfileName] = useState(() => {
    try {
      return localStorage.getItem('laundry-mountain:profile-name') || 'Climber'
    } catch {
      return 'Climber'
    }
  })
  const [nameDraft, setNameDraft] = useState(profileName),
    [profileMessage, setProfileMessage] = useState('')
  const [badgeTab, setBadgeTab] = useState<'All badges' | 'Earned' | 'Next up'>('All badges')
  const [dialog, setDialog] = useState<{
    title: string
    body: string
    mountainId?: string
    badgeIndex?: number
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
    setViewedId(null)
    history.pushState(null, '', `/?view=${next}`)
    setScreen(next)
    window.scrollTo(0, 0)
  }
  function exploreExpedition(id: MountainId) {
    navigate('mountain')
    setViewedId(id)
    setClose(false)
    history.replaceState(null, '', `/?view=mountain&expedition=${id}`)
  }
  function chooseMountain(id: MountainId) {
    if (blocked.current || !mountainProgress(ledgerRef.current)[id].unlocked) return false
    try { localStorage.setItem(ACTIVE_MOUNTAIN_KEY, id); setActiveId(id); return true }
    catch { setError('Your mountain selection could not be saved. Check browser storage.'); return false }
  }
  const saveSession = useCallback((value: Session) => {
    const list = [value, ...sessionsRef.current.filter((s) => s.id !== value.id)]
    localStorage.setItem(SESSION_KEY, JSON.stringify(list))
    sessionsRef.current = list
    setSessions(list)
    setCurrent(value)
  }, [])
  function startManual(requestedId: MountainId = activeId) {
    if (blocked.current) return
    if (sound) prepareTrailSound()
    if (!mountainProgress(ledgerRef.current)[requestedId].unlocked) return
    const existing = sessionsRef.current.find(s => s.mode === 'manual' && s.status === 'active' && (s.mountainId ?? 'ben-nevis') === requestedId)
    const targetId = existing ? requestedId : nextUnfinishedMountain(ledgerRef.current, requestedId)
    if (!chooseMountain(targetId)) return
    const s: Session = existing ? reconcileManualSession(existing, ledgerRef.current) : {
      id: createId(), startedAt: Date.now(), mode: 'manual', load: 'Laundry', mountainId: targetId,
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
      const before = badgeTotals()
      const saved = parseLedger(localStorage.getItem(STORAGE_KEY))
      if (saved.events.some(event => event.id === id)) return true
      const beforeProgress = mountainProgress(saved)
      const sessionMountain = s.mountainId ?? 'ben-nevis'
      if (!beforeProgress[sessionMountain].unlocked) return false
      const next = appendEvent(saved, manualBatch(id, s.id, count, action, Date.now(), sessionMountain))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      ledgerRef.current = next; setLedger(next)
      const updated = reconcileManualSession(s, next)
      run.current = updated
      saveSession(updated)
      const afterProgress = mountainProgress(next)
      const queue: TrailRewardData[] = []
      for (const mountainId of MOUNTAIN_IDS) {
        const mountain = MOUNTAINS[mountainId]
        const old = beforeProgress[mountainId].metres, after = afterProgress[mountainId].metres
        const reached = mountain.checkpoints.filter(c => c.metres > old && c.metres <= after)
        queue.push(...reached.map(c => ({ kind: 'checkpoint' as const, mountainId, name: c.name, banked: after - old, metres: after,
          summit: c.metres === mountain.elevation,
          carry: c.metres === mountain.elevation ? MOUNTAIN_IDS.slice(MOUNTAIN_IDS.indexOf(mountainId) + 1).reduce((sum, nextId) => sum + afterProgress[nextId].metres - beforeProgress[nextId].metres, 0) : 0 })))
      }
      queue.push(...newlyEarned(before, badgeTotals()).map(badge => ({ kind: 'badge' as const, badge, mountainId: sessionMountain })))
      reveal(queue, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 150 : 3300)
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
      const before = badgeTotals()
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
        reveal(newlyEarned(before, badgeTotals()).map(badge => ({ kind: 'badge', badge, mountainId: value.mountainId ?? 'ben-nevis' })), 350)
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
      const id = new URLSearchParams(location.search).get('expedition')
      setViewedId(isMountainId(id) ? id : null)
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
        id: createId(),
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
      id: createId(),
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
  const expeditions = mountainProgress(ledger)
  const mountainId = screen === 'camera' || screen === 'live' ? 'ben-nevis' : (screen === 'session' || screen === 'results') && current ? current.mountainId ?? 'ben-nevis' : screen === 'mountain' ? viewedId ?? activeId : activeId
  const mountain = MOUNTAINS[mountainId]
  const mountainState = expeditions[mountainId]
  const locked = !mountainState.unlocked
  const onward = nextMountain(mountainId)
  const stats = { ...summary(ledger), mountainMetres: mountainState.metres, percent: mountainState.percent }
  const progress = expeditionProgress(stats.mountainMetres, mountainId)
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
  const badges = achievements(badgeTotals())
  const earnedBadges = badges.filter((b) => b.earned).length
  const sessionBadges = current?.endedAt ? newlyEarned(
    badgeTotals({version:1,events:ledger.events.filter(e=>e.at<current.startedAt)},sessions.filter(s=>s.id!==current.id && s.startedAt<current.startedAt)),
    badgeTotals({version:1,events:ledger.events.filter(e=>e.at<=current.endedAt!)},sessions.filter(s=>s.startedAt<=current.startedAt))
  ) : []
  const sessionBadge = sessionBadges.at(-1)

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
        {mode === 'card' ? (mountainId === 'ben-nevis' ? <ScenicArtwork /> : <div className="scenic-artwork artwork-home"><img className="scenic-artwork-landscape" src={`/art/playable-${mountainId}-home.webp`} alt={`${mountain.name} and your basket on the mountain trail`} fetchPriority="high" /></div>) : mode === 'welcome' ? <ScenicArtwork welcome /> : mode === 'mini' ? (mountainId === 'ben-nevis' ? <ScenicArtwork companion={false} /> : <MountainArtwork mountainId={mountainId} />) : mode === 'map' && !close ? <IllustratedMountainScene mountainId={mountainId} locked={locked} metres={stats.mountainMetres} /> : <ClimbScene key={mountainId} mountainId={mountainId} metres={stats.mountainMetres}
          variant={mode === 'map' ? 'climb' : mode}
          sceneryFinish="illustrated"
          showProgress={false} />}
        {(mode === 'card' || mode === 'mini') && (
          <div className="scenic-title">
            <span>Current Mountain</span>
            <h2>{mountain.name}</h2>
            <p>
              <span className="difficulty-bars">
                <ChartBarIcon weight="fill" size={20} />
              </span>{' '}
              {mountain.region}
            </p>
          </div>
        )}
        {mode === 'card' && (
          <div className="scenic-foot">
            <p>
              Less pile. More peak.
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
    session: mountain.name,
    camera: 'Camera Setup',
    live: 'Ben Nevis',
    results: 'Session Results',
    sessions: 'Your trail journal',
    mountain: mountain.name,
    welcome: 'Welcome',
    profile: 'Your Profile',
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
    <div data-mountain={mountainId}
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
                    body: `${progress.next?.name ?? `${mountain.name} summit`}${progress.next ? ` is ${format(progress.remaining)} Laundry Metres away.` : ' — you made it.'} Your accepted progress is saved on this phone.`
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
                aria-label={screen === 'mountain' ? 'Back to mountains' : 'Back to home'}
                onClick={() => (screen === 'mountain' ? navigate('mountains') : run.current?.mode === 'manual' ? pauseManual(true) : run.current ? finish('Returned home') : navigate('home'))}
              >
                <ArrowLeft size={22} />
              </button>
              <strong>{title[screen]}{(screen === 'mountain' || screen === 'session') && <small className="mountain-region">{mountain.region}</small>}</strong>
              {screen === 'mountain' ? (
                <div className="summit-chip">
                  <TrailIcon kind="mountain" />
                  <span>
                    Summit<strong>{format(mountain.elevation)} m</strong>
                  </span>
                </div>
              ) : screen === 'session' ? (<button className="sound-button" aria-label={sound ? 'Mute sound' : 'Enable sound'} aria-pressed={sound} onClick={toggleSound}>{sound ? <SpeakerHighIcon weight="fill"/> : <SpeakerSlashIcon weight="fill"/>}</button>) : screen === 'live' ? (
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
      <main ref={mainPanel} className="game-main">
        {screen === 'welcome' && (
          <div className="welcome-content">
            {scenic('welcome')}
            <img
              className="welcome-logo"
              src="/brand/reference-logo.webp"
              alt="Laundry Mountain"
            />
            <p className="welcome-tagline">Real Laundry. Higher Ground.</p>
            <div className="welcome-bottom">
              <h1>
                Small loads.
                <br />
                Big progress.
              </h1>
              <p>Turn your mountain of laundry<br />into an adventure.</p>
              <button className="primary game-cta" onClick={() => navigate('home')}>
                Get Started <ArrowRight size={20} />
              </button>
              <button className="text-button" onClick={() => navigate('home')}>
                Return to my progress
              </button>
            </div>
          </div>
        )}
        {screen === 'home' && (
          <>
            <button
              className="mountain-card-button"
              aria-label={`Explore ${mountain.name}`}
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
                <strong className={stats.lifetimeMetres >= 10000 ? 'long-distance' : undefined}>{format(stats.lifetimeMetres)} m</strong>
                <span>Climbed</span>
              </button>
              <button onClick={() => navigate('sessions')}>
                <TrailIcon kind="items" />
                <strong>{stats.items}</strong>
                <span>Items done</span>
              </button>
              <button onClick={() => navigate('badges')}>
                <TrailIcon kind="badge" />
                <strong>{earnedBadges}</strong>
                <span>Badges</span>
              </button>
            </div>
            <button className="primary game-cta start-session-cta" onClick={() => startManual()}>
              <span className="play-disc">
                <Play weight="fill" size={17} />
              </span>
              {sessions.some(s => s.mode === 'manual' && s.status === 'active' && (s.mountainId ?? 'ben-nevis') === activeId) ? 'Continue your session' : progress.summit && onward ? `Start ${onward.name}` : 'Start a Laundry Session'}
            </button>
            <button className="next-trail" onClick={() => navigate('mountain')}>
              <SockIcon />
              <span>
                <small>Next sock stop</small>
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
              <Suspense fallback={<p role="status">Opening camera setup…</p>}><CameraLab
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
              /></Suspense>
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
              <div className="results-scenery">{mountainId === 'ben-nevis' ? <img src="/art/reference-results.webp" alt="Your basket celebrates with a boot on a rocky summit ledge" /> : <MountainArtwork mountainId={mountainId} pose="cheer" />}</div>
              <span className="results-eyebrow">SESSION COMPLETE</span>
              <h1>{current.items ? 'That’s a load off.' : 'Session Finished'}</h1>
              <p>{current.items ? `${format(current.items)} ${current.items === 1 ? 'item' : 'items'} ${current.mode === 'manual' ? 'banked' : 'folded'}. ${format(current.metres)} Laundry Metres earned.` : 'Your mountain will be here when you’re ready.'}</p>
              {current.mode === 'manual' && <p className="manual-honesty">Manually confirmed · 10 metres per item</p>}
            </div>
            <div className="game-stat-row result-stats">
              <div>
                <TrailIcon kind="mountain" />
                <strong>+{format(current.metres)} m</strong>
                <span>Climbed</span>
              </div>
              <div>
                <TrailIcon kind="items" />
                <strong>{current.items}</strong>
                <span>Items</span>
              </div>
              <div>
                <Timer weight="duotone" />
                <strong>{time(elapsed)}</strong>
                <span>Time</span>
              </div>
            </div>
            {current.items ? (
              <div className={`reward-ribbon ${sessionBadge ? 'earned-result' : ''}`}>
                {sessionBadge ? <AchievementMedal badge={sessionBadge}/> : <Flame weight="fill" />}
                <p>
                  <strong>
                    {sessionBadge?.name ?? (current.metres > current.base ? 'On a roll. On a climb.' : 'One less thing on the pile.')}
                  </strong>
                  <span>
                    {sessionBadge ? 'New on your trail — badge earned.' : current.metres > current.base
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
            {current.items > 0 && <div className="result-trail-progress"><TrailIcon kind="mountain" /><progress value={stats.mountainMetres} max={mountain.elevation} aria-label={`Current ${mountain.name} progress`} /><b>{format(stats.mountainMetres)} / {format(mountain.elevation)} m</b></div>}
            {progress.summit && <p className="expedition-complete-note">{onward ? `${mountain.name} conquered. ${onward.name} is unlocked!` : 'All three summits reached. Every load still counts.'}</p>}
            <button className="primary game-cta" onClick={() => { const id = progress.summit && onward ? onward.id : mountainId; if (chooseMountain(id)) exploreExpedition(id) }}>
              {progress.summit && onward ? `Explore ${onward.name}` : 'Back to my mountain'} <ArrowRight size={18} />
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
                {current.mode !== 'manual' && <p>
                  <span>Momentum bonus</span>
                  <strong>+{format(current.metres - current.base)} m</strong>
                </p>}
                <p>
                  <span>Total Laundry Metres</span>
                  <strong>{format(current.metres)} m</strong>
                </p>
                <p>Saved on this phone.</p>
              </div>
            </details>

          </>
        )}
        {screen === 'mountain' && (
          <>
            <div className="map-scene">
              {scenic('map')}
              <button className="overview-next" aria-label={!locked && mountainId !== activeId ? `Make ${mountain.name} my current climb` : progress.summit && onward ? `Explore ${onward.name}` : 'Your route checkpoints'} aria-expanded={!locked && mountainId !== activeId || progress.summit && onward ? undefined : routeOpen} onClick={() => {
                if (!locked && mountainId !== activeId) chooseMountain(mountainId)
                else if (progress.summit && onward) { if (chooseMountain(onward.id)) exploreExpedition(onward.id) }
                else setRouteOpen(value => !value)
              }}><SockIcon /><span><strong>{locked ? mountain.checkpoints[1].name : mountainId !== activeId ? `Climb ${mountain.name}` : progress.summit && onward ? `Next: ${onward.name}` : progress.next?.name ?? 'Summit reached'}</strong><small>{locked ? `Unlock after ${MOUNTAINS[MOUNTAIN_IDS[MOUNTAIN_IDS.indexOf(mountainId) - 1]].name}` : mountainId !== activeId ? 'Make this your current mountain' : progress.summit ? `${format(mountain.elevation)} m climbed` : `${format(progress.remaining)} m to go`}</small></span><ArrowRight size={23} /></button>
              <div className="view-control reference-view-control">
                <button className="primary" aria-label={close ? 'Climb view — switch to full mountain' : 'Full mountain view — switch to climb view'} onClick={() => setClose(!close)}><Mountain size={25}/>{close ? 'Climb view' : 'Full mountain view'}</button>
              </div>
              <a className="terrain-credit" href="/terrain-credits.html" target="_blank" rel="noreferrer">Illustrated game trail · Mountain credits</a>
            </div>
            <details className="route-details" open={routeOpen} onToggle={event => setRouteOpen(event.currentTarget.open)}>
              <summary aria-label="Your route checkpoints">Checkpoints</summary>
              <div className="mountain-progress"><div><strong>{format(stats.mountainMetres)} m climbed</strong><span>{format(mountain.elevation - stats.mountainMetres)} m to summit</span></div><progress aria-label={`${mountain.name} progress`} value={stats.mountainMetres} max={mountain.elevation} /></div>
              <ol className="game-checkpoints">{mountain.checkpoints.map(c => <li key={c.metres} className={!locked && stats.mountainMetres >= c.metres ? 'reached' : ''}><span>{!locked && stats.mountainMetres >= c.metres ? <Check /> : <Sock />}</span><div><strong>{c.name}</strong><p>{c.description}</p></div><small>{format(c.metres)} m</small></li>)}</ol>
              <p>A game trail inspired by {mountain.name}. Checkpoints measure Laundry Metres, not hiking distance.</p>
              <button className="secondary game-cta" onClick={() => setRouteOpen(false)}>Back to the view</button>
            </details>
          </>
        )}
        {screen === 'mountains' && (
          <>
            <div className="journey-intro">
              <img className="intro-companion-art" src="/art/coordinated-mountains-header.webp" alt="Your basket companion standing on a rocky ledge" />
              <h1>Mountains</h1><h2>Big peaks. Little victories.</h2>
              <p>From the Highlands to the Himalayas.</p>
            </div>
            <div className="expedition-cards">
              {MOUNTAIN_IDS.map(id => {
                const peak = MOUNTAINS[id], saved = expeditions[id]
                const label = saved.summit ? 'Summit reached' : id === activeId ? 'Your current climb' : saved.unlocked ? 'Ready to climb' : id === 'fuji' ? 'Next expedition' : 'The ultimate peak'
                return <button className={`expedition-card ${id === activeId ? 'current-expedition' : ''}`} key={id} aria-label={`Explore ${peak.name}${!saved.unlocked ? ' — locked' : ''}`} onClick={() => exploreExpedition(id)}>
                  <span className="expedition-thumbnail"><img className={`collection-landscape ${id === 'ben-nevis' ? 'ben-nevis-card-art' : ''}`} src={id === 'ben-nevis' ? '/art/coordinated-ben-nevis-map.webp' : `/art/coordinated-${id}-card.webp`} alt={`${peak.name} illustrated landscape`} /></span>
                  <span className="expedition-number"><span>{label}</span></span>
                  <span className="expedition-name"><strong>{peak.name}</strong><small><Mountain weight="fill" /> {peak.region}</small><span className="expedition-elevation"><span>{saved.unlocked && <><ChartBarIcon weight="fill" size={20}/>{format(saved.metres)} m</>}</span><b>{format(peak.elevation)} m</b></span></span>
                  {!saved.unlocked && <span className="expedition-lock"><Lock weight="fill" /></span>}
                  {saved.summit && <span className="expedition-completed"><Check weight="bold" size={27} /></span>}
                </button>
              })}
            </div>
          </>
        )}
        {screen === 'sessions' && (
          <>
            {!sessions.length ? (
              <section className="history-empty">
                <BasketAvatar />
                <h2>Your first load is your first step.</h2>
                <p>A few folds today. A little further up the mountain. Your completed sessions will live here.</p>
                <button className="primary game-cta" onClick={() => startManual()}>
                  Start your first session <ArrowRight size={16} />
                </button>
              </section>
            ) : (
              <><div className="history-panorama"><>{mountainId === 'ben-nevis' ? <img src="/art/reference-profile.webp" alt="Your basket resting on a Highland rock ledge" /> : <img src={`/art/playable-${mountainId}-profile.webp`} alt="Your basket resting on a mountain ledge" />}</><strong>{mountain.name}<span>{mountain.region}</span></strong></div><h2 className="history-headline">Look how far your laundry got you.</h2><div className="history-totals"><span><TrailIcon kind="items" /><b>{completedLoads}</b> sessions</span><span><TrailIcon kind="mountain" /><b>{format(stats.lifetimeMetres)} m</b> climbed</span></div><div className="session-history">
                {sessions.map((s,i) => (
                  <Fragment key={s.id}>
                  {(i===0 || new Date(s.startedAt).toDateString() !== new Date(sessions[i-1].startedAt).toDateString()) && <h3 className="history-day">{new Date(s.startedAt).toDateString() === new Date().toDateString() ? 'Today' : new Date(s.startedAt).toLocaleDateString(undefined,{day:'numeric',month:'long'})}</h3>}
                  <button
                    onClick={() => {
                      if (s.mode === 'manual' && s.status === 'active') { startManual(s.mountainId ?? 'ben-nevis'); return }
                      setCurrent(s)
                      setClock(s.endedAt ?? s.startedAt)
                      navigate('results')
                    }}
                  >
                    <span className="history-icon">
                      <TrailIcon kind="items" />
                    </span>
                    <span>
                      <strong>
                        {s.load === 'Laundry' ? (s.items >= 20 ? 'A load off your mind' : 'A little further up') : s.load}
                      </strong>
                      <small>
                        {MOUNTAINS[s.mountainId ?? 'ben-nevis'].name} · {s.items} {s.items === 1 ? 'item' : 'items'} · {new Date(s.startedAt).toLocaleDateString(undefined, {
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
                  </button></Fragment>
                ))}
              </div></>
            )}
            <p className="page-quote">Small loads add up.</p>
          </>
        )}
        {screen === 'badges' && (
          <>
            <div className="collection-intro"><span>Achievements</span><h1>Earn your stripes.</h1><p>{earnedBadges} of {badges.length} earned</p></div>
            <div className="segmented" aria-label="Badge filter">
              {(['All badges', 'Earned', 'Next up'] as const).map((t) => (
                <button key={t} aria-pressed={badgeTab === t} onClick={() => setBadgeTab(t)}>
                  {t === 'All badges' ? 'All' : t}
                </button>
              ))}
            </div>
            <div className="badge-grid">
              {badges
                .filter((b) => (badgeTab === 'Earned' ? b.earned : badgeTab === 'Next up' ? !b.earned : true))
                .map((badge, index) => { const { name, detail, earned, color } = badge; return (
                  <button
                    className={`badge-card ${earned ? 'earned' : 'locked'} ${!earned && index > 5 ? 'distant-badge' : ''} badge-${color}`}
                    title={earned ? 'Earned' : 'Locked — view requirements'}
                    key={name}
                    onClick={() =>
                      setDialog({
                        title: name,
                        badgeIndex: badges.findIndex(b => b.name === name),
                        body: `${earned ? 'Earned! ' : ''}${detail}. ${earned ? 'Your accepted laundry progress earned this badge.' : 'Keep climbing to unlock this badge.'}`
                      })
                    }
                  >
                    <AchievementMedal badge={badge} locked={!earned} />
                    <strong>{name}</strong>
                    <small>{achievementCaption[badge.id]}</small>
                    {!earned && <Lock className="badge-lock" weight="fill" />}
                  </button>
                )})}
            </div>
            {badgeTab === 'Earned' && !earnedBadges && (
              <p className="empty-note">
                Your first badge is waiting at the end of your first counted session.
              </p>
            )}
          </>
        )}
        {screen === 'profile' && (
          <>
            <div className="profile-hero">
              <div className="profile-landscape" aria-hidden="true">{mountainId === 'ben-nevis' ? <img src="/art/reference-profile.webp" alt="" /> : <img src={`/art/playable-${mountainId}-profile.webp`} alt="" />}</div>
              <h1>Your trail</h1><h2>{profileName}</h2><p>Your pace. Your peaks.</p>
            </div>
            <div className="profile-progress" aria-label="Your climbing progress">
              <button onClick={() => navigate('mountain')}><TrailIcon kind="mountain" /><span><strong className={stats.lifetimeMetres >= 10000 ? 'long-distance' : undefined}>{format(stats.lifetimeMetres)} m</strong><small>climbed</small></span><ArrowRight size={16}/></button>
              <button onClick={() => navigate('badges')}><TrailIcon kind="badge" /><span><strong>{earnedBadges}</strong><small>badges</small></span><ArrowRight size={16}/></button>
            </div>
            <button className="personal-trail-strip" onClick={() => exploreExpedition(mountainId)}><SockIcon /><span><strong>{progress.next?.name ?? `${mountain.name}, conquered.`}</strong><small>{progress.summit ? 'Summit reached' : `${format(progress.remaining)} m to go`}</small></span><ArrowRight size={22}/></button>
            <form
              className="profile-form"
              onSubmit={(e) => {
                e.preventDefault()
                saveProfile()
              }}
            >
              <label htmlFor="climber-name">Name</label>
              <input
                id="climber-name"
                value={nameDraft}
                maxLength={30}
                onChange={(e) => setNameDraft(e.target.value)}
              />
              <button className="primary" type="submit">
                Save
              </button>
              {profileMessage && <p role="status">{profileMessage}</p>}
            </form>
            <div className="profile-links">
              <button role="switch" aria-checked={sound} onClick={toggleSound}><SpeakerHighIcon weight="fill"/>Sound<span className={`sound-switch ${sound ? 'is-on' : ''}`}>{sound ? 'On' : 'Off'}</span></button>
              <button onClick={() => navigate('sessions')}>
                <History weight="duotone" />
                Session history
                <ArrowRight />
              </button>
              <button onClick={() => navigate('badges')}>
                <BadgeSymbol />
                Achievements
                <span>
                  {earnedBadges} / {badges.length}
                </span>
                <ArrowRight />
              </button>
            </div>
            <div className="privacy-card">
              <CloudIcon size={23}/><p>Saved in this browser.</p>
            </div>
          </>
        )}
      </main>
      {!['live', 'session', 'camera', 'welcome', 'results'].includes(screen) && (
        <nav className="game-nav" aria-label="Game navigation">
          {(
            [
              { s: 'home', label: 'Home', Icon: Home },
              { s: 'mountains', label: 'Mountains', Icon: Mountain },
              { s: 'camera', label: 'Start', Icon: Plus },
              { s: 'badges', label: 'Badges', Icon: Star },
              { s: 'profile', label: 'You', Icon: User }
            ] as const
          ).map(({ s, label, Icon }) => (
            <button
              key={s}
              className={s === 'camera' ? 'nav-add' : ''}
              aria-current={screen === s || (screen === 'mountain' && s === 'mountains') ? 'page' : undefined}
              onClick={() => s === 'camera' ? startManual(screen === 'mountain' && !locked ? mountainId : activeId) : navigate(s)}
            >
              <span>
                {s === 'badges' ? <BadgeSymbol /> : <Icon weight={s === 'camera' ? 'bold' : 'fill'} />}
              </span>
              <small>{label}</small>
            </button>
          ))}
        </nav>
      )}
      {rewards[0] && <TrailReward reward={rewards[0]} onContinue={() => setRewards(queue => queue.slice(1))} />}
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
            {dialog.badgeIndex !== undefined && <div className="dialog-badge"><AchievementMedal badge={badges[dialog.badgeIndex]} locked={!badges[dialog.badgeIndex].earned} /></div>}
            <h2 id="dialog-title">{dialog.title}</h2>
            <p>{dialog.body}</p>
            {dialog.mountainId && (
              <div className="expedition-detail-preview">
                <Suspense fallback={<p role="status">Loading terrain…</p>}><TerrainPreview id={dialog.mountainId} name={dialog.title} /></Suspense>
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

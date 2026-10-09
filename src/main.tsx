import { StrictMode, Suspense, lazy } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import './fonts.css'
const App = lazy(() => import('./App'))
const GameApp = lazy(() => import('./components/GameApp').then(module => ({ default: module.GameApp })))
const LandingPage = lazy(() => import('./components/LandingPage').then(module => ({ default: module.LandingPage })))

const gameView = ['home', 'session', 'setup', 'camera', 'live', 'results', 'sessions', 'mountain', 'welcome', 'profile', 'community', 'badges', 'mountains'].includes(new URLSearchParams(location.search).get('view') ?? '')

createRoot(document.getElementById('root')!).render(
  <StrictMode><Suspense fallback={<main className="route-loading" role="status">Opening your trail…</main>}>{gameView ? <GameApp /> : ['test', 'expedition'].includes(new URLSearchParams(location.search).get('view') ?? '') ? <App /> : <LandingPage />}</Suspense></StrictMode>,
)

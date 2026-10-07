import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App'
import { GameApp } from './components/GameApp'
import { LandingPage } from './components/LandingPage'

const gameView = ['home', 'setup', 'camera', 'live', 'results', 'sessions', 'mountain', 'welcome', 'profile', 'community', 'badges', 'mountains'].includes(new URLSearchParams(location.search).get('view') ?? '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>{gameView ? <GameApp /> : ['test', 'expedition'].includes(new URLSearchParams(location.search).get('view') ?? '') ? <App /> : <LandingPage />}</StrictMode>,
)

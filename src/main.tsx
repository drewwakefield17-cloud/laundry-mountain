import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './style.css'
import App from './App'
import { GameApp } from './components/GameApp'

const gameView = ['home', 'setup', 'camera', 'live', 'results', 'sessions', 'mountain'].includes(new URLSearchParams(location.search).get('view') ?? '')

createRoot(document.getElementById('root')!).render(
  <StrictMode>{gameView ? <GameApp /> : <App />}</StrictMode>,
)

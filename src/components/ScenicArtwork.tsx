import { Hexagon, Star } from './GameIcons'

/** Editorial artwork for the welcome and home surfaces, never the playable map. */
export function ScenicArtwork({ welcome = false, companion = true }: { welcome?: boolean; companion?: boolean }) {
  return <div className={`scenic-artwork ${welcome ? 'artwork-welcome' : 'artwork-home'}`}>
    <img className="scenic-artwork-landscape" src={welcome ? '/art/reference-welcome.webp' : companion ? '/art/reference-home.webp' : '/art/coordinated-home.webp'}
      alt="Illustrated Ben Nevis above the Highland glen" fetchPriority="high" />
  </div>
}

export function BadgeSymbol() {
  return <span className="nav-badge-symbol" aria-hidden="true"><Hexagon weight="fill" /><Star weight="fill" /></span>
}

export function SockMarker({ className = '' }: { className?: string }) {
  return <span className={`reference-sock-marker ${className}`} aria-hidden="true"><img src="/art/reference-sock-marker.webp" alt="" /></span>
}

export function TrailIcon({ kind }: { kind: 'loads' | 'mountain' | 'streak' | 'items' | 'badge' }) {
  return <span aria-hidden="true" className={`trail-icon trail-icon-${kind}`} />
}

export function SockIcon() {
  return <img className="sock-icon" src="/art/coordinated-sock-icon.webp" alt="" aria-hidden="true" />
}

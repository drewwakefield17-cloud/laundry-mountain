import { BasketAvatar } from './BasketAvatar'

/** Editorial artwork for the welcome and home surfaces, never the playable map. */
export function ScenicArtwork({ welcome = false }: { welcome?: boolean }) {
  return <div className={`scenic-artwork ${welcome ? 'artwork-welcome' : 'artwork-home'}`}>
    <img className="scenic-artwork-landscape" src={welcome ? '/art/ben-nevis-welcome-refined.webp' : '/art/ben-nevis-home-refined.webp'}
      alt="Illustrated Ben Nevis above the Highland glen" fetchPriority="high" />
    <div className="scenic-artwork-companion"><BasketAvatar /></div>
  </div>
}

export function TrailIcon({ kind }: { kind: 'loads' | 'mountain' | 'streak' | 'badge' }) {
  return <span aria-hidden="true" className={`trail-icon trail-icon-${kind}`} />
}

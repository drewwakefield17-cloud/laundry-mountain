import { MOUNTAINS, type MountainId } from '../domain/mountains'

/** Reuses the approved companion assets over each expedition's own scenery. */
export function MountainArtwork({ mountainId, pose = 'rest' }: { mountainId: MountainId; pose?: 'rest' | 'cheer' }) {
  return <div className={`mountain-artwork mountain-artwork--${pose}`}>
    <img className="mountain-artwork-background" src={pose === 'cheer' ? `/art/playable-${mountainId}-landscape.webp` : `/art/coordinated-${mountainId}-card.webp`} alt={`${MOUNTAINS[mountainId].name} illustrated landscape`} />
    <img className="mountain-artwork-companion" src={pose === 'rest' ? '/art/coordinated-basket-rest.webp' : '/art/coordinated-basket-cheer.webp'} alt="Your laundry basket companion" />
  </div>
}

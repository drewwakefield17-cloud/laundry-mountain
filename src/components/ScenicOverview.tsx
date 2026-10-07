import { MountainScene } from './MountainScene'
import './scenic-overview.css'

/** The earlier dimensional artwork, composed from its original transparent atlas. */
function DimensionalBasket() {
  const part = (crop: string, x: number, y: number, width: number, height: number, clipPath?: string) => {
    const [sx, sy, sw, sh] = crop.split(' ').map(Number)
    return <div className="overview-basket-part" style={{left: `${x / 4}%`, top: `${y / 4.8}%`, width: `${width / 4}%`, height: `${height / 4.8}%`}}>
      <div style={{width: '100%', height: '100%', overflow: 'hidden', position: 'relative', clipPath}}>
        <img src="/art/basket-home-parts.png" alt="" draggable="false" style={{position: 'absolute', maxWidth: 'none', width: `${1254 / sw * 100}%`, height: `${1254 / sh * 100}%`, left: `${-sx / sw * 100}%`, top: `${-sy / sh * 100}%`}} />
      </div>
    </div>
  }
  return <div className="overview-basket" role="img" aria-label="Your laundry basket companion">
    {part('865 717 365 366', 236, 337, 114, 114)}
    {part('410 717 380 366', 102, 366, 124, 119)}
    {part('993 199 233 399', 309, 215, 57, 98)}
    {part('486 186 492 481', 46, 15, 288, 282,
      'polygon(44% 0,85% 0,100% 20%,100% 66%,56% 70%,46% 100%,8% 100%,0 60%,0 43%,12% 27%,30% 10%)')}
    {part('5 188 512 431', 40, 130, 300, 253,
      'polygon(0 0,100% 0,100% 33%,91% 100%,0 100%)')}
    {part('486 186 492 481', 46, 15, 288, 282,
      'polygon(26% 42%,37% 39%,49% 42%,58% 51%,53% 63%,46% 62%,43% 78%,38% 91%,29% 99%,16% 99%,10% 93%,13% 80%,20% 61%,21% 49%)')}
    {part('70 718 236 367', 6, 234, 73, 114)}
  </div>
}

/** Overview scenery prioritises the real mountain; the animated climb stays separate. */
export function ScenicOverview({ metres = 0, companion = true }: { metres?: number; companion?: boolean }) {
  return <div className="scenic-overview">
    <MountainScene metres={metres} close={false} scenic finish="natural" />
    {companion && <img className="overview-ground" src="/art/climb-trail.png" alt="" aria-hidden="true" draggable="false" />}
    {companion && <DimensionalBasket />}
  </div>
}

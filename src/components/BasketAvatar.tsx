import './basket-avatar.css'

/** Independently rigged parts; all washing stays attached to the basket body. */
export function BasketAvatar({ moving = false, celebrating = false, className = '' }: {
  moving?: boolean; celebrating?: boolean; className?: string
}) {
  const part = (crop: string, x: number, y: number, width: number, height: number) => (
    <svg x={x} y={y} width={width} height={height} viewBox={crop} overflow="hidden">
      <image href="/art/basket-limbs.png" width="1254" height="1254" />
    </svg>
  )
  return <svg className={`basket-avatar ${moving ? 'is-walking' : ''} ${celebrating ? 'is-celebrating' : ''} ${className}`}
    viewBox="0 0 320 330" role="img" aria-label="Your walking laundry basket companion">
    <ellipse className="basket-shadow" cx="160" cy="303" rx="97" ry="12" fill="#102e35" opacity=".18" />
    <g className="basket-rig">
      <g className="basket-leg basket-leg-back">{part('793 710 347 405', 190, 227, 65, 76)}</g>
      <g className="basket-arm basket-arm-back">{part('813 132 267 407', 257, 137, 43, 83)}</g>
      <g className="basket-leg basket-leg-front">{part('130 699 406 441', 80, 225, 78, 85)}</g>
      <g className="basket-arm basket-arm-front">{part('192 127 242 425', 18, 139, 47, 89)}</g>
      <g className="basket-torso">
        <svg x="38" y="19" width="245" height="224" viewBox="73 134 1114 1018" overflow="hidden">
          <image href="/art/basket-body.png" width="1254" height="1254" />
        </svg>
      </g>
    </g>
  </svg>
}

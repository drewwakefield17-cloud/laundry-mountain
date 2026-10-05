import { BEN_NEVIS } from '../domain/config'
// Code-rendered terrain, cached independently from the player and route.
export function drawHighlands(ctx: CanvasRenderingContext2D, w: number, h: number) {
  const polygon = (points: number[][], fill: string | CanvasGradient) => {
    ctx.fillStyle = fill; ctx.beginPath()
    points.forEach(([x, y], i) => i ? ctx.lineTo(x * w, y * h) : ctx.moveTo(x * w, y * h))
    ctx.closePath(); ctx.fill()
  }
  const gradient = (top: string, bottom: string) => {
    const g = ctx.createLinearGradient(0, 0, w * .3, h); g.addColorStop(0, top); g.addColorStop(1, bottom); return g
  }
  ctx.fillStyle = gradient('#c9e1df', '#f3efe0'); ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < 10; i++) {
    const glow = ctx.createRadialGradient(w * (i / 8), h * (.09 + i % 3 * .05), 0, w * (i / 8), h * .14, w * .24)
    glow.addColorStop(0, '#ffffff80'); glow.addColorStop(1, '#ffffff00')
    ctx.fillStyle = glow; ctx.fillRect(0, 0, w, h * .5)
  }
  polygon([[-.1,.66],[.04,.48],[.12,.51],[.23,.33],[.35,.45],[.46,.31],[.6,.48],[.73,.34],[.83,.4],[.92,.32],[1.1,.5],[1.1,1],[-.1,1]], '#a5bcb5')
  polygon([[-.1,.8],[.05,.63],[.21,.48],[.3,.51],[.38,.45],[.5,.58],[.73,.49],[.84,.6],[1.1,.51],[1.1,1],[-.1,1]], '#849f93')
  const massif = [[-.05,1],[.06,.77],[.19,.62],[.27,.49],[.4,.36],[.49,.27],[.54,.23],[.6,.22],[.65,.235],[.7,.22],[.76,.32],[.84,.45],[.9,.65],[1.08,.93],[1.08,1]]
  polygon(massif, gradient(BEN_NEVIS.palette.rock, '#63734d'))
  polygon([[.54,.23],[.49,.36],[.41,.47],[.34,.68],[.16,1],[.43,1],[.54,.65],[.61,.48],[.65,.235],[.6,.22]], gradient('#abb1a0','#7c895e'))
  polygon([[.7,.22],[.65,.235],[.61,.48],[.63,.69],[.82,.97],[.94,.75],[.84,.45],[.76,.32]], gradient('#4b6461','#435549'))
  polygon([[.54,.23],[.6,.22],[.65,.235],[.7,.22],[.74,.29],[.66,.31],[.62,.28],[.57,.3],[.5,.3]], '#b4b7a8')
  ctx.save(); ctx.beginPath(); massif.forEach(([x,y],i)=>i?ctx.lineTo(x*w,y*h):ctx.moveTo(x*w,y*h)); ctx.closePath(); ctx.clip()
  let seed = 1703
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  for (let i = 0; i < 490; i++) {
    const x = random(), y = .24 + random() * .75, size = .006 + random() * .03
    polygon([[x,y],[x+size,y-size*.5],[x+size*1.8,y+size*.7]], i%3===0?'#d6d5b321':i%3===1?'#1c383224':'#7c806528')
  }
  for (let i=0;i<13;i++) {
    const x=.64+i*.011
    ctx.strokeStyle='#334c4560'; ctx.lineWidth=.7+i%3*.35; ctx.beginPath()
    ctx.moveTo(x*w,(.28+i%3*.01)*h); ctx.bezierCurveTo((x-.03)*w,.42*h,(x+.025)*w,.51*h,(x+.11)*w,.71*h); ctx.stroke()
  }
  ctx.restore()
  polygon([[-.1,.84],[.12,.73],[.28,.71],[.39,.77],[.55,.79],[.7,.83],[1.1,1],[-.1,1]], gradient('#79885b','#3c6144'))
  polygon([[-.1,.96],[.18,.85],[.27,.9],[.4,.88],[.55,.94],[1.1,1],[-.1,1]], '#557746')
  ctx.fillStyle='#81aba5'; ctx.beginPath(); ctx.ellipse(.355*w,.658*h,.052*w,.013*h,-.1,0,Math.PI*2); ctx.fill()
  ctx.strokeStyle='#c8d9bf'; ctx.lineWidth=1; ctx.beginPath(); ctx.ellipse(.355*w,.658*h,.05*w,.011*h,-.1,0,Math.PI); ctx.stroke()
  ctx.strokeStyle='#98c4b7'; ctx.lineWidth=Math.max(2,w*.008); ctx.beginPath(); ctx.moveTo(w*.8,h); ctx.bezierCurveTo(w*.68,h*.92,w*.5,h*.85,w*.43,h*.86); ctx.stroke()
  for (let i=0;i<62;i++) {
    const x=random()*w, y=(.91+random()*.09)*h, size=(.017+random()*.032)*h
    ctx.fillStyle=i%3===0?'#1a4439':'#285641'; ctx.beginPath(); ctx.moveTo(x,y-size); ctx.lineTo(x-size*.38,y); ctx.lineTo(x+size*.38,y); ctx.closePath(); ctx.fill()
    ctx.fillStyle='#344a34'; ctx.fillRect(x-1,y,2,size*.2)
  }
  const haze=ctx.createLinearGradient(0,h*.5,0,h*.79); haze.addColorStop(0,'#f5f5e700');haze.addColorStop(.55,'#e8eee419');haze.addColorStop(1,'#f5f5e700');ctx.fillStyle=haze;ctx.fillRect(0,h*.5,w,h*.3)
}

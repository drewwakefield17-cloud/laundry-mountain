// Layered Highland terrain is painted in Canvas; the summit, foliage and water
// remain code geometry, independent of the route and moving player marker.
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const hash = (x: number, y: number) => { const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453; return n - Math.floor(n) }
function noise(x: number, y: number) { const i = Math.floor(x), j = Math.floor(y), u = x - i, v = y - j, sx = u * u * (3 - 2 * u), sy = v * v * (3 - 2 * v); return mix(mix(hash(i,j),hash(i+1,j),sx),mix(hash(i,j+1),hash(i+1,j+1),sx),sy) }
function ridge(points: number[][], x: number) { const i = Math.max(0, points.findIndex(p => p[0] >= x) - 1); const a = points[i], b = points[Math.min(i + 1, points.length - 1)]; const t = Math.max(0, Math.min(1, (x - a[0]) / (b[0] - a[0]))); return mix(a[1], b[1], t*t*(3-2*t)) }
const massif = [[0,.73],[.08,.64],[.17,.58],[.24,.49],[.32,.42],[.39,.38],[.46,.31],[.52,.265],[.57,.24],[.62,.238],[.66,.246],[.70,.237],[.74,.28],[.80,.38],[.88,.48],[1,.66]]
export function drawHighlands(ctx: CanvasRenderingContext2D, w: number, h: number, rock?: HTMLImageElement) {
  let seed = 1248
  const random = () => { seed=(seed*16807)%2147483647; return seed/2147483647 }
  const gradient = ctx.createLinearGradient(0,0,0,h); gradient.addColorStop(0,'#c2e2e2'); gradient.addColorStop(.52,'#e5eee1'); gradient.addColorStop(1,'#f9f3dc'); ctx.fillStyle=gradient;ctx.fillRect(0,0,w,h)
  function cloud(x:number,y:number,s:number,opacity:number) { ctx.save();ctx.globalAlpha=opacity;const g=ctx.createRadialGradient(x,y,0,x,y,s);g.addColorStop(0,'#fffef7');g.addColorStop(.5,'#fffef7aa');g.addColorStop(1,'#fffef700');ctx.fillStyle=g;ctx.fillRect(x-s,y-s,s*2,s*2);ctx.restore() }
  for(let i=0;i<23;i++) cloud((random()*1.2-.1)*w,(.08+random()*.27)*h,w*(.055+random()*.09),.8)
  function terrain(points:number[][], color:number[], detail:number, offset:number) {
    const cw=Math.min(570,Math.ceil(w)),ch=Math.min(590,Math.ceil(h)),layer=document.createElement('canvas');layer.width=cw;layer.height=ch
    const cx=layer.getContext('2d')!, data=cx.createImageData(cw,ch)
    for(let x=0;x<cw;x++) {
      const u=x/cw, edge=ridge(points,u)+(noise(u*90+offset,offset)-.5)*.009
      for(let y=Math.floor(edge*ch);y<ch;y++) {
        const v=y/ch, a=noise(u*13+offset,v*11),b=noise(u*43+offset,v*47),c=noise(u*130+offset,v*128)
        const channels=Math.sin(u*46+v*16+a*6)*.5+.5
        const scree=Math.max(0,1-v/.8)*detail
        const shade=(a-.5)*38+(b-.5)*26+(c-.5)*18-(channels*channels)*detail*30
        const green=Math.max(0,(v-.46)*detail*2.4), idx=(y*cw+x)*4
        data.data[idx]=color[0]+shade-green*45
        data.data[idx+1]=color[1]+shade+green*12
        data.data[idx+2]=color[2]+shade-green*30
        if (scree>.1 && b>.59) {data.data[idx]+=scree*30;data.data[idx+1]+=scree*23;data.data[idx+2]+=scree*15}
        data.data[idx+3]=255
      }
    }
    cx.putImageData(data,0,0);ctx.drawImage(layer,0,0,w,h)
  }
  terrain([[0,.54],[.09,.44],[.18,.50],[.29,.35],[.4,.47],[.53,.38],[.63,.5],[.78,.34],[.90,.4],[1,.31]],[160,186,179],.15,31)
  cloud(.15*w,.49*h,.26*w,.35);cloud(.83*w,.45*h,.25*w,.4)
  terrain([[0,.66],[.12,.52],[.25,.62],[.36,.49],[.53,.63],[.68,.56],[.83,.63],[1,.52]],[123,154,139],.3,82)
  terrain(massif,[146,147,122],1,3)
  // Fine diffuse stone material enriches the code-painted rock faces.
  if(rock?.complete && rock.naturalWidth) {ctx.save();ctx.beginPath();massif.forEach(([x,y],i)=>i?ctx.lineTo(x*w,y*h):ctx.moveTo(x*w,y*h));ctx.lineTo(w,h*.76);ctx.lineTo(0,h*.76);ctx.closePath();ctx.clip();ctx.globalAlpha=.18;ctx.globalCompositeOperation='multiply';ctx.drawImage(rock,0,h*.23,w,h*.55);ctx.restore()}
  ctx.save();ctx.strokeStyle='#3f50403a';ctx.lineCap='round'
  for(let i=0;i<35;i++){const x=.5+random()*.27,y=ridge(massif,x)+.015;ctx.lineWidth=.5+random()*1.5;ctx.beginPath();ctx.moveTo(x*w,y*h);ctx.bezierCurveTo((x-.02)*w,(y+.05)*h,(x-.065)*w,(y+.1)*h,(x-.08)*w,(y+.21)*h);ctx.stroke()}ctx.restore()
  terrain([[0,.86],[.1,.77],[.2,.75],[.34,.8],[.49,.83],[.59,.9],[.72,.97],[1,1.03]],[106,135,76],.75,52)
  terrain([[0,1],[.14,.95],[.30,.96],[.47,.90],[.64,.85],[.76,.75],[.9,.71],[1,.68]],[94,129,74],.75,93)
  // A small Highland lochan with a reflective shore, tucked into the glen.
  ctx.save();ctx.translate(w*.354,h*.653);ctx.rotate(-.08);const lake=ctx.createLinearGradient(0,-h*.012,0,h*.018);lake.addColorStop(0,'#bbd8d0');lake.addColorStop(.5,'#63a8ad');lake.addColorStop(1,'#388587');ctx.fillStyle=lake;ctx.beginPath();ctx.ellipse(0,0,w*.055,h*.014,0,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#d5e4ce';ctx.lineWidth=1.5;ctx.beginPath();ctx.ellipse(0,0,w*.055,h*.014,0,Math.PI,Math.PI*2);ctx.stroke();ctx.restore()
  ctx.strokeStyle='#9acbc1';ctx.lineWidth=Math.max(2,w*.009);ctx.beginPath();ctx.moveTo(w*.71,h);ctx.bezierCurveTo(w*.51,h*.98,w*.58,h*.89,w*.4,h*.84);ctx.stroke()
  function pine(x:number,y:number,size:number,tone:number) {
    ctx.strokeStyle='#5e5a3b';ctx.lineWidth=Math.max(.5,size*.025);ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y-size);ctx.stroke()
    // Branch silhouettes, with asymmetric feathered edges instead of triangles.
    for(let k=0;k<15;k++){const t=k/15,by=y-size+size*t,bw=size*(.025+t*.30);ctx.strokeStyle=`rgb(${18+tone},${62+tone},${43+tone})`;ctx.lineWidth=Math.max(.6,size*.033);ctx.beginPath();ctx.moveTo(x,by-size*.025);ctx.lineTo(x-bw*(.8+random()*.3),by+size*.045);ctx.moveTo(x,by);ctx.lineTo(x+bw*(.8+random()*.3),by+size*.04);ctx.stroke();ctx.strokeStyle=`rgba(133,165,106,${.15+random()*.25})`;ctx.lineWidth=Math.max(.4,size*.012);ctx.beginPath();ctx.moveTo(x,by);ctx.lineTo(x-bw*.8,by+size*.025);ctx.stroke()}
  }
  const trees=Array.from({length:235},()=>{const x=random(), y=.84+random()*.18;return {x,y,s:(.016+random()*.04)*h}}).sort((a,b)=>a.y-b.y)
  trees.forEach(t=>{if(Math.abs(t.x-.16)>.048||t.y>.93)pine(t.x*w,t.y*h,t.s,Math.floor(random()*30))})
  for(let i=0;i<13;i++){const side=i%2,x=side?w*(.91+random()*.12):w*(random()*.1-.03);pine(x,h*(.85+random()*.2),h*(.15+random()*.18),Math.floor(random()*15))}
  for(let i=0;i<140;i++){const x=random()*w,y=(.97+random()*.06)*h;ctx.strokeStyle=i%3?'#a8b980':'#d8d5a0';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(x,y);ctx.quadraticCurveTo(x-3,y-4,x+2,y-(3+random()*12));ctx.stroke()}
  cloud(.26*w,.64*h,.17*w,.19);cloud(.81*w,.60*h,.16*w,.2)
}

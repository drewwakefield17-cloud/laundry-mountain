import { chromium } from '@playwright/test'
import { readFile,writeFile } from 'node:fs/promises'
import path from 'node:path'
const out=path.resolve('docs/design/review/three-peaks')
const files=['fuji-overview-phone','fuji-climb-phone','everest-overview-phone','everest-climb-phone','fuji-overview-landscape','everest-climb-landscape']
const labels=['Fuji · full mountain','Fuji · climb view','Everest · full mountain','Everest · climb view','Fuji · landscape','Everest · landscape']
const css='*{box-sizing:border-box}body{margin:0;padding:28px;background:#edf4f7;color:#12384a;font:15px system-ui}h1{margin:0 0 6px;font-size:25px}p{margin:0 0 22px;color:#506d78}.gallery{display:grid;grid-template-columns:repeat(4,1fr);gap:20px}figure{margin:0}figure.wide{grid-column:span 2}figcaption{font-weight:700;margin-bottom:8px}img{display:block;width:100%;border-radius:15px;box-shadow:0 3px 12px #102b431c}.note{margin-top:18px;font-size:12px}'
function html(src){return `<!doctype html><meta charset="utf-8"><title>Fuji & Everest · actual app review</title><style>${css}</style><h1>Three peaks. One adventure.</h1><p>Fuji and Everest · actual app captures · scenery previews, with gameplay progression still to connect.</p><main class="gallery">${files.map((f,i)=>`<figure class="${i>3?'wide':''}"><figcaption>${labels[i]}</figcaption><img src="${src[i]}"></figure>`).join('')}</main><p class="note">Ben Nevis and saved sessions preserved. Terrain, game trail, foreground and basket remain separate layers. No deployment.</p>`}
await writeFile(path.join(out,'index.html'),html(files.map(f=>f+'.png')))
const images=await Promise.all(files.map(async f=>'data:image/png;base64,'+(await readFile(path.join(out,f+'.png'))).toString('base64')))
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1440,height:1200},deviceScaleFactor:1})
await page.setContent(html(images));await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())))
await page.screenshot({path:path.join(out,'two-mountains.png'),fullPage:true});await browser.close()
console.log(path.join(out,'two-mountains.png'))

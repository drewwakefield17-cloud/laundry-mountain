import { chromium } from '@playwright/test'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
const dir=path.resolve('docs/design/review/personal-adventure')
const shots=[['Welcome','welcome-phone'],['Home','home-phone'],['Your three mountains','mountains-phone'],['Full mountain','overview-phone'],['Live climb · fixture','session-phone-fixture'],['Bank a batch · fixture','batch-phone-fixture'],['Session complete · fixture','results-phone-fixture'],['Achievements','badges-phone'],['Your profile','profile-phone'],['History · fixture','history-phone-fixture']]
const css=`*{box-sizing:border-box}body{margin:0;padding:32px;background:#edf3f4;color:#12394c;font:14px Arial,sans-serif}h1{font-size:30px;margin:0 0 9px;letter-spacing:-1px}p{margin:0 0 28px;max-width:1000px;line-height:1.5;color:#416271}main{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:24px 18px}figure{margin:0;min-width:0}figcaption{font-size:12px;font-weight:bold;margin-bottom:9px}img{display:block;width:100%;height:auto;border-radius:12px;box-shadow:0 4px 18px #10384914}footer{margin-top:28px;display:grid;grid-template-columns:1fr 1fr;gap:20px}footer h2{font-size:16px}a{color:inherit}@media(max-width:800px){main{grid-template-columns:repeat(2,1fr)}footer{grid-template-columns:1fr}}`
const render=async inline=>{
  const src=async name=>inline?`data:image/png;base64,${(await readFile(path.join(dir,`${name}.png`))).toString('base64')}`:`${name}.png`
  let cards='';for(const [label,name] of shots)cards+=`<figure><figcaption>${label}</figcaption><img src="${await src(name)}" alt="${label}"></figure>`
  return `<!doctype html><html lang="en"><meta charset="utf-8"><title>Laundry Mountain · personal adventure design review</title><style>${css}</style><body><h1>One basket. Three mountains. Your own adventure.</h1><p>Current implemented app · 8 October 2026. Ben Nevis, Mount Fuji and Everest. Community removed. Populated session screens use isolated manual-count fixtures; this is a visual review, not gameplay or AI acceptance. Fuji and Everest remain previews.</p><main>${cards}</main><footer><section><h2>Landscape · live session (fixture)</h2><img src="${await src('session-landscape-fixture')}" alt="Landscape session"></section><section><h2>Landscape · full mountain</h2><img src="${await src('overview-landscape')}" alt="Landscape mountain"></section></footer></body></html>`
}
await writeFile(path.join(dir,'index.html'),await render(false))
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1500,height:1100},deviceScaleFactor:1})
await page.setContent(await render(true));await page.evaluate(async()=>{await Promise.all([...document.images].map(i=>i.decode()))})
await page.screenshot({path:path.join(dir,'whole-app.png'),fullPage:true});await browser.close()
console.log(path.join(dir,'whole-app.png'))

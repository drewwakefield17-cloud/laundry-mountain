// Visual review only: isolated storage; no owner's session or progress is touched.
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
const out=path.resolve('docs/design/review/personal-adventure')
await mkdir(out,{recursive:true})
const browser=await chromium.launch()
const page=await browser.newPage({viewport:{width:390,height:844},deviceScaleFactor:1})
const errors=[], captures=[]
page.on('pageerror',e=>errors.push(e.message))
const capture=async name=>{
  await page.evaluate(async()=>{await document.fonts.ready; await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))})
  await page.waitForFunction(()=>[...document.querySelectorAll('.mountain-canvas')].filter(e=>e.clientWidth&&e.clientHeight).every(e=>e.dataset.terrainReady==='true'))
  await page.waitForFunction(()=>[...document.querySelectorAll('.terrain-preview')].filter(e=>e.clientWidth&&e.clientHeight).every(e=>e.dataset.terrainRenderMs))
  captures.push({name,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth)})
  await page.screenshot({path:path.join(out,`${name}.png`),fullPage:true})
}
for(const [name,width,height] of [['phone',390,844],['narrow',320,740],['landscape',844,390]]){
  await page.setViewportSize({width,height})
  for(const view of ['welcome','home','mountains','badges','profile','sessions']){
    await page.goto(`http://localhost:5173/?view=${view}`); await capture(`${view}-${name}`)
  }
  await page.goto('http://localhost:5173/?view=mountain')
  await capture(`climb-${name}`)
  await page.getByRole('button',{name:'Full mountain',exact:true}).click();await capture(`overview-${name}`)
}
// Clearly identified manual-count fixture, solely to render populated states.
await page.evaluate(()=>{
  localStorage.setItem('laundry-mountain:phase1:v1',JSON.stringify({version:1,events:[{id:'visual-batch',sessionId:'visual-session',at:Date.now(),action:'folding',source:'manual',items:12,evidence:'Isolated visual fixture'}]}))
  localStorage.setItem('laundry-mountain:game-sessions:v1',JSON.stringify([{id:'visual-session',startedAt:Date.now()-840000,mode:'manual',load:'Laundry',items:12,base:120,metres:120,status:'active'}]))
})
await page.setViewportSize({width:390,height:844})
await page.goto('http://localhost:5173/?view=home')
await page.getByRole('button',{name:'Continue your session',exact:true}).click()
await capture('session-phone-fixture')
await page.getByRole('button',{name:'Bank this batch'}).click()
await page.getByLabel('Completed items',{exact:true}).fill('6')
await capture('batch-phone-fixture')
await page.getByRole('button',{name:'Cancel batch'}).click()
await page.getByRole('button',{name:'Pause timer',exact:true}).click()
await capture('paused-phone-fixture')
await page.setViewportSize({width:844,height:390})
await capture('session-landscape-fixture')
await page.getByRole('button',{name:'Finish session',exact:true}).click()
await page.setViewportSize({width:390,height:844})
await capture('results-phone-fixture')
await page.getByRole('button',{name:'View session history'}).click()
await capture('history-phone-fixture')
await writeFile(path.join(out,'visual-evidence.json'),JSON.stringify({capturedAt:new Date().toISOString(),errors,captures,note:'Visual inspection only; populated states are synthetic. No gameplay/camera acceptance claimed.'},null,2))
await browser.close()
console.log(JSON.stringify({out,errors,overflow:captures.filter(c=>c.overflow)}))

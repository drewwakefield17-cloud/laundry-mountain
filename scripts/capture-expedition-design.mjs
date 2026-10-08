// Isolated visual checks. Does not modify the owner's browser or saved sessions.
import { chromium } from '@playwright/test'
import { mkdir,writeFile } from 'node:fs/promises'
import path from 'node:path'
const out=path.resolve('docs/design/review/three-peaks')
await mkdir(out,{recursive:true})
const browser=await chromium.launch()
const page=await browser.newPage({deviceScaleFactor:2})
const errors=[],captures=[]
page.on('pageerror',e=>errors.push(e.message))
page.on('response',r=>{if(r.status()>=400&&r.url().includes('localhost'))errors.push(`${r.status()} ${r.url()}`)})
for(const [shape,width,height] of [['phone',390,844],['landscape',844,390],['narrow',320,740]]) {
  await page.setViewportSize({width,height})
  for(const id of ['fuji','everest']) {
    await page.goto(`http://localhost:5173/?view=mountain&expedition=${id}`)
    for(const mode of ['overview','climb']) {
      if(mode==='climb')await page.getByRole('button',{name:'Climb view',exact:true}).click()
      await page.locator('.expedition-canvas[data-ready="true"]').waitFor()
      await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].map(i=>i.decode().catch(()=>{})))})
      await page.locator('.expedition-loading').waitFor({state:'hidden'})
      const name=`${id}-${mode}-${shape}`
      captures.push({name,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),renderMs:await page.locator('.expedition-canvas').getAttribute('data-render-ms')})
      await page.screenshot({path:path.join(out,`${name}.png`)})
    }
  }
}
await page.setViewportSize({width:390,height:844})
await page.goto('http://localhost:5173/?view=mountains')
await page.getByRole('button',{name:'Mount Fuji Future expedition',exact:true}).click()
await page.getByRole('button',{name:'Back to mountains',exact:true}).click()
await page.getByRole('button',{name:'Everest Future expedition',exact:true}).click()
await page.getByRole('button',{name:'Home',exact:true}).click()
const stored=await page.evaluate(()=>Object.keys(localStorage))
await writeFile(path.join(out,'evidence.json'),JSON.stringify({capturedAt:new Date().toISOString(),errors,captures,storageKeysAfterPreview:stored,note:'Visual preview routes only; no earned progress or gameplay acceptance.'},null,2))
await browser.close()
console.log(JSON.stringify({out,errors,overflow:captures.filter(c=>c.overflow),stored}))

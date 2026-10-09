import {test, expect, type Page} from '@playwright/test'
import fs from 'node:fs/promises'
import path from 'node:path'

// Film real UI operations in a separate, labelled demo browser. No owner save is used.
test('capture clean portrait edits with loaded scenery and visible taps', async({browser})=>{
 test.setTimeout(180000)
 const context=await browser.newContext({viewport:{width:430,height:860},deviceScaleFactor:1,recordVideo:{dir:path.resolve('trailer/out/polish-raw'),size:{width:430,height:860}}})
 await context.addInitScript(()=>{
  localStorage.setItem('laundry-mountain:demo-profile',JSON.stringify({is_demo:true,name:'Demo climber'}))
  localStorage.setItem('laundry-mountain:profile-name','Demo climber')
  document.addEventListener('pointerdown',event=>{
   const ring=document.createElement('div')
   ring.style.cssText=`position:fixed;left:${event.clientX-20}px;top:${event.clientY-20}px;width:40px;height:40px;border:3px solid #ffad32;border-radius:50%;box-shadow:0 0 0 3px #ffffffb0;z-index:99999;pointer-events:none`
   document.body.append(ring)
   ring.animate([{transform:'scale(.65)',opacity:1},{transform:'scale(1.6)',opacity:0}],{duration:500,fill:'forwards'})
   setTimeout(()=>ring.remove(),550)
  })
 })
 const start=Date.now();const page=await context.newPage();page.setDefaultTimeout(15000)
 const cues:Record<string,number>={}
 const mark=(key:string)=>{cues[key]=(Date.now()-start)/1000;console.log(key,cues[key])}
 const ready=async(p:Page)=>{
  await p.evaluate(async()=>{
   await document.fonts.ready
   const urls=[...document.querySelectorAll('img, svg image')].map(e=>e.getAttribute('src')??e.getAttribute('href')).filter(Boolean) as string[]
   await Promise.all([...new Set(urls)].map(src=>new Promise<void>((resolve,reject)=>{const img=new Image();img.onload=()=>resolve();img.onerror=()=>reject(new Error(src));img.src=src})))
  })
  await page.waitForTimeout(350)
 }
 const bank=async(n:number)=>{
  await page.getByRole('button',{name:'Bank this batch',exact:true}).click()
  await page.getByLabel('Completed items',{exact:true}).fill(String(n))
  await page.getByRole('button',{name:`Confirm & climb +${n*10} m`,exact:true}).click()
 }
 const drain=async(prefix:string)=>{
  await expect(page.locator('.trail-reward')).toBeVisible({timeout:12000})
  for(let i=0;i<20&&await page.locator('.trail-reward').count();i++){
   const title=await page.locator('#reward-title').innerText()
   const key=prefix+'-'+title.replace(/[^a-z0-9]+/gi,'-').toLowerCase()
   const feature=title.includes('Into the glen')||title.includes('Glen Explorer')||title.includes('Ben Nevis summit')||title.includes('Everest summit')
   if(feature){await ready(page);mark(key);await page.screenshot({path:path.resolve(`trailer/out/polish-${key}.png`)});await page.waitForTimeout(5000)}
   await page.locator('.trail-reward button').click();await page.waitForTimeout(120)
  }
 }
 await page.goto('http://127.0.0.1:5194/?view=home')
 await expect(page.getByRole('button',{name:'Start a Laundry Session',exact:true})).toBeVisible()
 // Warm the exact SVG resources before recording useful takes, retaining real markup.
 await page.evaluate(async()=>{
  const urls=['coordinated-ben-nevis-map','reference-basket-walk','reference-session-portrait','reference-basket-uphill-a','reference-basket-uphill-b-v2','reference-sock-marker']
  await Promise.all(urls.map(n=>new Promise<void>((resolve,reject)=>{const i=new Image();i.onload=()=>resolve();i.onerror=()=>reject(new Error(n));i.src=`/art/${n}.webp`})))
 })
 await ready(page);mark('start');await page.waitForTimeout(850)
 await page.getByRole('button',{name:'Start a Laundry Session',exact:true}).click()
 await ready(page);await page.waitForTimeout(950)
 mark('bank-tap');await page.getByRole('button',{name:'Bank this batch',exact:true}).click()
 await page.waitForTimeout(900);mark('start-end')
 await page.getByLabel('Completed items',{exact:true}).fill('25')
 await page.getByRole('button',{name:'Confirm & climb +250 m',exact:true}).click()
 await drain('first')
 await page.getByRole('button',{name:'Save for later',exact:true}).click()
 await page.getByRole('button',{name:'Explore Ben Nevis',exact:true}).click()
 await page.getByRole('button',{name:'Climb view — switch to full mountain',exact:true}).click()
 await ready(page);mark('trail');await page.screenshot({path:path.resolve('trailer/out/polish-trail.png')});await page.waitForTimeout(4500)
 await page.getByRole('button',{name:'Start',exact:true}).click()
 if(await page.getByRole('button',{name:'Resume timer',exact:true}).isVisible())await page.getByRole('button',{name:'Resume timer',exact:true}).click()
 await bank(110);await drain('ben')
 await page.getByRole('button',{name:'Finish & explore Mount Fuji',exact:true}).click();await page.waitForTimeout(1000)
 if(await page.locator('.trail-reward').count())await drain('finish')
 await page.getByRole('button',{name:'Explore Mount Fuji',exact:true}).click()
 await page.getByRole('button',{name:'Start',exact:true}).click();await ready(page)
 await bank(378);await drain('fuji')
 await page.getByRole('button',{name:'Finish & explore Everest',exact:true}).click();await page.waitForTimeout(1000)
 if(await page.locator('.trail-reward').count())await drain('finish-fuji')
 await page.getByRole('button',{name:'Explore Everest',exact:true}).click()
 await page.getByRole('button',{name:'Start',exact:true}).click();await ready(page)
 await bank(500);await drain('everest-first')
 await bank(385);await drain('everest')
 const video=page.video()!;await page.close();await video.saveAs(path.resolve('trailer/public/recordings/polish-portrait.webm'));await context.close()
 await fs.writeFile(path.resolve('trailer/public/recordings/polish-cues.json'),JSON.stringify(cues,null,2))
})

test('capture continuous landscape movement before each camera reset',async({browser})=>{
 test.setTimeout(100000)
 const context=await browser.newContext({viewport:{width:960,height:540},recordVideo:{dir:path.resolve('trailer/out/polish-raw'),size:{width:960,height:540}}})
 await context.addInitScript(()=>localStorage.setItem('laundry-mountain:demo-profile',JSON.stringify({is_demo:true,name:'Demo climber'})))
 const start=Date.now();const page=await context.newPage();const cues:Record<string,number>={}
 const bank=async(n:number,key?:string)=>{
  await page.getByRole('button',{name:'Bank this batch',exact:true}).click()
  await page.getByLabel('Completed items',{exact:true}).fill(String(n))
  await page.waitForTimeout(700)
  if(key)cues[key]=(Date.now()-start)/1000
  await page.getByRole('button',{name:`Confirm & climb +${n*10} m`,exact:true}).click()
 }
 const drain=async()=>{await page.waitForTimeout(3600);for(let i=0;i<20&&await page.locator('.trail-reward').count();i++){await page.locator('.trail-reward button').click();await page.waitForTimeout(120)}}
 const ready=async()=>{await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...new Set([...document.querySelectorAll('img,svg image')].map(i=>i.getAttribute('src')??i.getAttribute('href')).filter(Boolean))].map(src=>new Promise<void>((resolve,reject)=>{const i=new Image();i.onload=()=>resolve();i.onerror=reject;i.src=src!})))})}
 await page.goto('http://127.0.0.1:5194/?view=home');await page.getByRole('button',{name:'Start a Laundry Session',exact:true}).click();await ready()
 await bank(25,'ben');await drain()
 await bank(110);await drain()
 await page.getByRole('button',{name:'Finish & explore Mount Fuji',exact:true}).click();await page.waitForTimeout(1000)
 if(await page.locator('.trail-reward').count())await page.locator('.trail-reward button').click()
 await page.getByRole('button',{name:'Explore Mount Fuji',exact:true}).click();await page.getByRole('button',{name:'Start',exact:true}).click();await ready()
 await bank(20,'fuji');await page.waitForTimeout(3300)
 await bank(358);await drain()
 await page.getByRole('button',{name:'Finish & explore Everest',exact:true}).click();await page.waitForTimeout(1000)
 if(await page.locator('.trail-reward').count())await page.locator('.trail-reward button').click()
 await page.getByRole('button',{name:'Explore Everest',exact:true}).click();await page.getByRole('button',{name:'Start',exact:true}).click();await ready()
 await bank(20,'everest');await page.waitForTimeout(3000)
 const video=page.video()!;await page.close();await video.saveAs(path.resolve('trailer/public/recordings/polish-wide.webm'));await context.close()
 await fs.writeFile(path.resolve('trailer/public/recordings/polish-wide-cues.json'),JSON.stringify(cues,null,2))
})

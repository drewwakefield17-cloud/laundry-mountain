import {test,expect} from '@playwright/test'
import path from 'node:path'
import fs from 'node:fs/promises'

// These isolated demo profiles exercise real UI and ledger operations. They are
// illustrative manual batches, not claimed physical laundry/detector evidence.
test('record the complete product journey for the narrated visual demo',async({browser})=>{
 test.setTimeout(240_000)
 const cues:Record<string,number>={}
 const context=await browser.newContext({viewport:{width:430,height:860},deviceScaleFactor:1,recordVideo:{dir:path.resolve('trailer/out/story-raw'),size:{width:430,height:860}}})
 await context.addInitScript(()=>{localStorage.setItem('laundry-mountain:demo-profile',JSON.stringify({is_demo:true,name:'Demo climber'}));localStorage.setItem('laundry-mountain:profile-name','Demo climber')})
 const start=Date.now(); const page=await context.newPage()
 page.setDefaultTimeout(15000)
 const mark=(name:string)=>{cues[name]=(Date.now()-start)/1000;console.log(name,cues[name])}
 const hold=(ms=2300)=>page.waitForTimeout(ms)
 const bank=async(n:number)=>{await page.getByRole('button',{name:'Bank this batch',exact:true}).click();await page.getByLabel('Completed items',{exact:true}).fill(String(n));await page.getByRole('button',{name:`Confirm & climb +${n*10} m`,exact:true}).click()}
 const rewards=async(prefix:string)=>{
  await expect(page.locator('.trail-reward')).toBeVisible({timeout:12000})
  for(let i=0;i<16&&await page.locator('.trail-reward').count();i++){
   const title=await page.locator('#reward-title').innerText()
   const key=prefix+'-'+title.replace(/[^a-z0-9]+/gi,'-').toLowerCase()
   mark(key);await hold(title.includes('summit')?3000:1800)
   await page.locator('.trail-reward button').click();await page.waitForTimeout(150)
  }
 }
 await page.goto('http://127.0.0.1:5194/?view=home')
 await expect(page.getByRole('button',{name:'Start a Laundry Session',exact:true})).toBeVisible()
 await page.evaluate(()=>document.fonts.ready);await hold(2000);mark('home');await hold(2000)
 await page.getByRole('button',{name:'Start a Laundry Session',exact:true}).click();mark('start-session');await hold(1800)
 await bank(25);mark('first-walk');await rewards('first')
 await page.getByRole('button',{name:'Save for later',exact:true}).click()
 await page.getByRole('button',{name:'Explore Ben Nevis',exact:true}).click()
 await page.getByRole('button',{name:'Climb view — switch to full mountain',exact:true}).click()
 await expect(page.locator('.illustrated-overview')).toBeVisible();mark('ben-trail');await hold(3000)
 await page.getByRole('button',{name:'Start',exact:true}).click()
 if(await page.getByRole('button',{name:'Resume timer',exact:true}).isVisible())await page.getByRole('button',{name:'Resume timer',exact:true}).click()
 await bank(110);mark('ben-later-walk');await rewards('ben')
 await page.getByRole('button',{name:'Finish & explore Mount Fuji',exact:true}).click()
 await hold(900)
 if(await page.locator('.trail-reward').count())await rewards('finish')
 await page.getByRole('button',{name:'Explore Mount Fuji',exact:true}).click();mark('fuji-trail');await hold(3500)
 await page.getByRole('button',{name:'Start',exact:true}).click();mark('fuji-session');await hold(2200)
 await bank(378);mark('fuji-walk');await rewards('fuji')
 await page.getByRole('button',{name:'Finish & explore Everest',exact:true}).click()
 await hold(900)
 if(await page.locator('.trail-reward').count())await rewards('finish-fuji')
 await page.getByRole('button',{name:'Explore Everest',exact:true}).click();mark('everest-trail');await hold(3500)
 await page.getByRole('button',{name:'Start',exact:true}).click();mark('everest-session');await hold(2200)
 await bank(500);mark('everest-walk');await rewards('everest-first')
 await bank(385);mark('everest-final-walk');await rewards('everest')
 await page.getByRole('button',{name:'Finish session',exact:true}).click();await hold(800)
 if(await page.locator('.trail-reward').count())await rewards('final')
 mark('results');await hold(2500)
 const video=page.video()!;await page.close();await video.saveAs(path.resolve('trailer/public/recordings/story-portrait.webm'));await context.close()
 await fs.writeFile(path.resolve('trailer/public/recordings/story-cues.json'),JSON.stringify(cues,null,2))
})

test('record the same 25-item batch in the actual landscape layout',async({browser})=>{
 test.setTimeout(65000)
 const context=await browser.newContext({viewport:{width:960,height:540},recordVideo:{dir:path.resolve('trailer/out/story-raw'),size:{width:960,height:540}}})
 const start=Date.now();const page=await context.newPage();const cues:Record<string,number>={}
 const mark=(name:string)=>{cues[name]=(Date.now()-start)/1000}
 await page.goto('http://127.0.0.1:5194/?view=home')
 await page.getByRole('button',{name:'Start a Laundry Session',exact:true}).click()
 await expect(page.getByRole('button',{name:'Bank this batch',exact:true})).toBeVisible()
 await page.evaluate(()=>document.fonts.ready);await page.waitForTimeout(2000);mark('session');await page.waitForTimeout(2000)
 await page.getByRole('button',{name:'Bank this batch',exact:true}).click()
 await page.getByLabel('Completed items',{exact:true}).fill('25');mark('count');await page.waitForTimeout(2300)
 await page.getByRole('button',{name:'Confirm & climb +250 m',exact:true}).click();mark('walk')
 await expect(page.locator('.climb-scene')).toHaveAttribute('data-metres','250');await page.waitForTimeout(3200)
 const video=page.video()!;await page.close();await video.saveAs(path.resolve('trailer/public/recordings/story-wide.webm'));await context.close()
 await fs.writeFile(path.resolve('trailer/public/recordings/story-wide-cues.json'),JSON.stringify(cues,null,2))
})

test('record Fuji and Everest walking in landscape',async({browser})=>{
 test.setTimeout(100000)
 const context=await browser.newContext({viewport:{width:960,height:540},recordVideo:{dir:path.resolve('trailer/out/story-raw'),size:{width:960,height:540}}})
 const start=Date.now();const page=await context.newPage();page.setDefaultTimeout(12000)
 const cues:Record<string,number>={}
 const bank=async(n:number)=>{await page.getByRole('button',{name:'Bank this batch',exact:true}).click();await page.getByLabel('Completed items',{exact:true}).fill(String(n));await page.getByRole('button',{name:`Confirm & climb +${n*10} m`,exact:true}).click()}
 const drain=async()=>{await page.waitForTimeout(3600);for(let i=0;i<20&&await page.locator('.trail-reward').count();i++){await page.locator('.trail-reward button').click();await page.waitForTimeout(100)}}
 await page.goto('http://127.0.0.1:5194/?view=home');await page.getByRole('button',{name:'Start a Laundry Session',exact:true}).click()
 await bank(135);await drain()
 await page.getByRole('button',{name:'Finish & explore Mount Fuji',exact:true}).click();await page.waitForTimeout(800)
 if(await page.locator('.trail-reward').count())await page.locator('.trail-reward button').click()
 await page.getByRole('button',{name:'Explore Mount Fuji',exact:true}).click();await page.getByRole('button',{name:'Start',exact:true}).click();await page.waitForTimeout(1600)
 await bank(10);cues.fuji=(Date.now()-start)/1000;await page.waitForTimeout(3100)
 await bank(368);await drain()
 await page.getByRole('button',{name:'Finish & explore Everest',exact:true}).click();await page.waitForTimeout(900)
 if(await page.locator('.trail-reward').count())await page.locator('.trail-reward button').click()
 await page.getByRole('button',{name:'Explore Everest',exact:true}).click();await page.getByRole('button',{name:'Start',exact:true}).click();await page.waitForTimeout(1600)
 await bank(10);cues.everest=(Date.now()-start)/1000;await page.waitForTimeout(3100)
 const video=page.video()!;await page.close();await video.saveAs(path.resolve('trailer/public/recordings/story-mountains-wide.webm'));await context.close()
 await fs.writeFile(path.resolve('trailer/public/recordings/story-mountains-cues.json'),JSON.stringify(cues,null,2))
})

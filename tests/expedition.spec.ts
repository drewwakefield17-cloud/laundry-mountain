import { expect, test } from '@playwright/test'
import os from 'node:os'
import path from 'node:path'

test('exploring Ben Nevis changes only the view and preserves a saved test', async ({ page }) => {
  await page.addInitScript(() => {
    // Isolated test fixture, never shared/production player data.
    localStorage.setItem('laundry-mountain:field-report:v1', JSON.stringify({ id:'preserved-report', kind:'folding', startedAt:1000, endedAt:31000, events:[], diagnostics:[], frames:240, processingMs:480, config:{}, zones:{}, notes:'Failed physical report fixture', userAgent:'test-only browser' }))
  })
  const errors: string[]=[]; page.on('pageerror', e => errors.push(e.message))
  await page.setViewportSize({ width:390,height:844 }); await page.goto('/?view=expedition')
  await expect(page).toHaveTitle('Laundry Mountain · Your expedition')
  await expect(page.getByRole('heading', { name:'Ben Nevis',exact:true })).toBeVisible()
  await expect(page.getByText('Your flag · 0 m')).toBeVisible()
  const before=await page.evaluate(()=>localStorage.getItem('laundry-mountain:field-report:v1'))
  await page.getByRole('button',{ name:'03 Lochan lookout 500 m' }).click()
  await expect(page.getByRole('status')).toContainText('Your saved position is 0 m')
  await expect(page.getByRole('button',{name:'Climb view',exact:true})).toHaveAttribute('aria-pressed','true')
  await page.getByRole('button',{name:'Back to your flag'}).click()
  await expect(page.getByRole('button',{name:'Full mountain',exact:true})).toHaveAttribute('aria-pressed','false')
  expect(await page.evaluate(()=>localStorage.getItem('laundry-mountain:phase1:v1'))).toBeNull()
  expect(await page.evaluate(()=>localStorage.getItem('laundry-mountain:field-report:v1'))).toBe(before)
  await page.getByRole('button',{name:'Full mountain',exact:true}).click()
  await page.evaluate(()=>scrollTo(0,0))
  await page.screenshot({path:path.join(os.tmpdir(),'laundry-mountain-expedition-mobile.png'),fullPage:true})
  for(const viewport of [{width:1280,height:900},{width:844,height:390}]){
    await page.setViewportSize(viewport)
    expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true)
    await expect(page.getByRole('img',{name:/Your position: 0/})).toBeVisible()
  }
  await page.setViewportSize({width:1280,height:900});await page.evaluate(()=>scrollTo(0,0))
  await page.screenshot({path:path.join(os.tmpdir(),'laundry-mountain-expedition-desktop.png'),fullPage:true})
  await page.getByRole('button',{name:'Return to saved test'}).click()
  await page.getByRole('button',{name:'View results'}).click()
  await expect(page.getByRole('textbox',{name:'What happened physically?'})).toHaveValue('Failed physical report fixture')
  expect(errors).toEqual([])
})

test('expedition restores the same real-event ledger position after reload', async ({page})=>{
  await page.addInitScript(()=>localStorage.setItem('laundry-mountain:phase1:v1',JSON.stringify({version:1,events:[{id:'test-only-event',sessionId:'test-only-session',at:1000,action:'folding',source:'camera',items:1,evidence:'Synthetic software fixture'}]})))
  await page.goto('/?view=expedition');await expect(page.getByText('Your flag · 10 m')).toBeVisible()
  await page.getByRole('button',{name:'Climb view',exact:true}).click();await page.reload()
  await expect(page.getByText('Your flag · 10 m')).toBeVisible()
  await expect(page.getByText('240 Laundry Metres away')).toBeVisible()
})

test('leaving camera setup stops the lens and requires fresh calibration on return', async({page})=>{
  await page.addInitScript(()=>{
    const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=720
    const ctx=canvas.getContext('2d')!; const paint=()=>{ctx.fillStyle='#ddd';ctx.fillRect(0,0,1280,720)};paint();setInterval(paint,125)
    Object.defineProperty(navigator.mediaDevices,'getUserMedia',{value:async()=>{
      const stream=canvas.captureStream(30);Object.defineProperty(window,'testLens',{value:stream.getVideoTracks()[0],configurable:true});return stream
    }})
  })
  await page.goto('/');await page.getByRole('button',{name:'Enable camera'}).click()
  await page.getByRole('button',{name:'Calibrate empty work area'}).click()
  await expect(page.getByRole('button',{name:'Start folding test'})).toBeEnabled()
  await page.getByRole('button',{name:'Your expedition'}).click()
  expect(await page.evaluate(()=>(window as unknown as {testLens:MediaStreamTrack}).testLens.readyState)).toBe('ended')
  await page.getByRole('button',{name:'Open folding test'}).click()
  await expect(page.getByRole('button',{name:'Start folding test'})).toBeDisabled()
  await expect(page.getByRole('button',{name:'Enable camera'})).toBeVisible()
})

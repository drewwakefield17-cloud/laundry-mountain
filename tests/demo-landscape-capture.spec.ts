import {expect, test} from '@playwright/test'
import path from 'node:path'

// Isolated Playwright context, recorded through the real manual flow. Nothing is
// seeded into the owner's browser and no detector/physical evidence is claimed.
test.use({baseURL:'http://127.0.0.1:5194',viewport:{width:960,height:540},video:{mode:'on',size:{width:960,height:540}}})

test('record the actual landscape manual batch and earned reward', async ({page}) => {
  test.setTimeout(60_000)
  await page.goto('/?view=home')
  await page.getByRole('button',{name:'Start a Laundry Session',exact:true}).click()
  await expect(page.getByRole('button',{name:'Bank this batch',exact:true})).toBeVisible()
  await expect(page.locator('.climb-scene')).toHaveAttribute('data-metres','0')
  await page.evaluate(()=>document.fonts.ready)
  await page.waitForTimeout(1600)
  await page.getByRole('button',{name:'Bank this batch',exact:true}).click()
  await page.getByRole('spinbutton',{name:'Completed items',exact:true}).fill('20')
  await expect(page.getByRole('button',{name:'Confirm & climb +200 m',exact:true})).toBeEnabled()
  await page.waitForTimeout(1800)
  await page.getByRole('button',{name:'Confirm & climb +200 m',exact:true}).click()
  await expect(page.locator('.climb-scene')).toHaveAttribute('data-metres','200')
  await expect(page.locator('.climb-scene')).toHaveAttribute('data-motion','walking')
  await page.waitForTimeout(4200)
  await expect(page.getByRole('button',{name:'Onwards & upwards',exact:true})).toBeVisible()
  await page.waitForTimeout(2200)
  await page.screenshot({path:path.resolve('trailer/out/landscape-app-reward.png')})
  const video=page.video()
  await page.close()
  await video!.saveAs(path.resolve('trailer/public/recordings/landscape-app-demo.webm'))
})

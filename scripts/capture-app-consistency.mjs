// Visual evidence only. A separate browser leaves the owner's progress untouched.
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const out = path.resolve('docs/design/review/app-consistency')
await mkdir(out, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
const errors = [], overflows = []
page.on('pageerror', error => errors.push(error.message))
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
const capture = async name => {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map(img => img.decode().catch(() => {})))
  })
  if (await page.locator('.terrain-preview').count())
    await page.waitForFunction(() => [...document.querySelectorAll('.terrain-preview')].every(el => el.dataset.terrainRenderMs))
  overflows.push({ name, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth) })
  await page.screenshot({ path: path.join(out, `${name}.png`), fullPage: true })
}
for (const [size, width, height] of [['phone',390,844],['narrow',320,740],['landscape',844,390],['desktop',1100,900]]) {
  await page.setViewportSize({ width, height })
  for (const view of ['mountains','profile','sessions','community','badges']) {
    await page.goto(`http://localhost:5173/?view=${view}`)
    await capture(`${view}-${size}`)
  }
  await page.goto('http://localhost:5173/?view=setup')
  await capture(`camera-${size}`)
}
// Inspect the saved-results presentation with an explicitly synthetic session.
await page.setViewportSize({ width: 390, height: 844 })
await page.evaluate(() => localStorage.setItem('laundry-mountain:game-sessions:v1', JSON.stringify([{
  id:'visual-fixture', startedAt:1791417600000, endedAt:1791418500000,
  load:'Everyday', goal:20, items:12, metres:125, base:120, status:'finished',
  reason:'Isolated visual fixture; not a physical camera result'
}])))
await page.goto('http://localhost:5173/?view=sessions')
await capture('history-populated-fixture')
await page.getByRole('button', { name: /Everyday.*12 items/ }).click()
await capture('results-fixture')
await writeFile(path.join(out, 'browser-evidence.json'), JSON.stringify({ capturedAt:new Date().toISOString(), errors, overflows,
  state:'Isolated browser. Results/history fixture is synthetic; no physical accuracy claim.' },null,2))
await browser.close()
if (errors.length || overflows.some(entry => entry.overflow)) throw new Error(JSON.stringify({errors,overflows}))
console.log(`Saved app consistency evidence: ${out}`)

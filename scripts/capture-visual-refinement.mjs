// Isolated, zero-progress browser evidence. Never touches the shared browser data.
import { chromium } from '@playwright/test'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const out = path.resolve('docs/design/review/visual-refinement')
await mkdir(out, { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 })
const errors = []
page.on('pageerror', error => errors.push(error.message))
page.on('response', response => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`) })
const capture = async name => {
  await page.evaluate(async () => {
    await document.fonts.ready
    await Promise.all([...document.images].map(image => image.decode().catch(() => {})))
  })
  const canvas = page.locator('.mountain-canvas')
  if (await canvas.count()) await canvas.first().locator('xpath=self::*').waitFor()
  if (await canvas.count()) await page.waitForFunction(() => [...document.querySelectorAll('.mountain-canvas')].every(el => el.dataset.terrainReady === 'true'))
  await page.screenshot({ path: path.join(out, `${name}.png`) })
}
for (const view of ['welcome', 'home', 'setup', 'badges', 'community']) {
  await page.goto(`http://localhost:5173/?view=${view}`)
  await capture(view)
}
await page.goto('http://localhost:5173/?view=mountain')
await capture('climb')
await page.getByRole('button', { name: 'Full mountain', exact: true }).click()
await capture('overview-portrait')
await page.setViewportSize({ width: 844, height: 390 })
await capture('overview-landscape')
await page.setViewportSize({ width: 667, height: 375 })
await capture('overview-small-landscape')
await page.goto('http://localhost:5173/?view=welcome')
await capture('welcome-landscape')
await writeFile(path.join(out, 'browser-evidence.json'), JSON.stringify({
  capturedAt: new Date().toISOString(), errors, state: 'Isolated empty ledger; no physical camera test',
  viewports: ['390x844', '844x390', '667x375'],
  storage: await page.evaluate(() => localStorage.getItem('laundry-mountain:phase1:v1'))
}, null, 2))
// Separate synthetic ledgers verify marker composition at later positions. These
// are capture fixtures only, never evidence of camera accuracy or real progress.
await page.setViewportSize({ width: 390, height: 844 })
await page.emulateMedia({ reducedMotion: 'reduce' })
for (const items of [25, 135]) {
  await page.evaluate(count => localStorage.setItem('laundry-mountain:phase1:v1', JSON.stringify({
    version: 1, events: Array.from({ length: count }, (_, i) => ({
      id: `visual-fixture-${i}`, sessionId: `isolated-${i}`, at: i * 100000,
      action: 'folding', source: 'camera', items: 1, evidence: 'Isolated visual fixture'
    }))
  })), items)
  await page.goto('http://localhost:5173/?view=mountain')
  await page.getByRole('button', { name: 'Full mountain', exact: true }).click()
  await capture(items === 25 ? 'overview-250m-fixture' : 'overview-summit-fixture')
}
await browser.close()
if (errors.length) throw new Error(errors.join('\n'))
console.log(`Saved app screenshots to ${out}; no browser errors.`)

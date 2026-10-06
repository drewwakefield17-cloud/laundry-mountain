import { expect, test } from '@playwright/test'
import os from 'node:os'
import path from 'node:path'

test('game screens choose a load and goal, retain zero progress, and show genuine empty history', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/?view=home')
  await expect(page.getByRole('heading', { name: 'Your next climb starts here.' })).toBeVisible()
  await page.screenshot({ path: path.join(os.tmpdir(), 'laundry-mountain-game-home.png'), fullPage: true })
  await page.getByRole('button', { name: 'Start a laundry session' }).click()
  await page.getByRole('button', { name: 'Towels', exact: true }).click()
  await page.getByRole('button', { name: '30 items', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Towels', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await expect(page.getByRole('button', { name: '30 items', exact: true })).toHaveAttribute('aria-pressed', 'true')
  await page.screenshot({ path: path.join(os.tmpdir(), 'laundry-mountain-game-setup.png'), fullPage: true })
  await page.getByRole('button', { name: 'Sessions', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Your journey starts with one load.' })).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('laundry-mountain:phase1:v1'))).toBeNull()
  for (const view of ['home', 'mountain', 'sessions']) { await page.goto(`/?view=${view}`); expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true) }
})

for (const countItem of [false, true]) test(`real game camera pipeline saves ${countItem ? 'one synthetic event' : 'honest zero results'} without replacing the field report`, async ({ page }) => {
  // Isolated camera fixture, never installed in the shared browser or production app.
  await page.addInitScript(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1280; canvas.height = 720
    const ctx = canvas.getContext('2d')!; let state = 'empty', pulse = 0
    const paint = () => {
      ctx.fillStyle = '#ddd'; ctx.fillRect(0, 0, 1280, 720); ctx.fillStyle = '#666'; ctx.fillRect(50, 270, 240, 300)
      if (state === 'source') { ctx.fillStyle = pulse++ % 2 ? '#222' : '#999'; ctx.fillRect(50, 270, 240, 300) }
      if (state === 'work') { ctx.fillStyle = pulse++ % 2 ? '#224466' : '#773311'; ctx.fillRect(470, 290, 300, 250) }
      if (state === 'placed') { ctx.fillStyle = '#224466'; ctx.fillRect(930, 330, 240, 170) }
    }
    paint(); setInterval(paint, 125)
    Object.defineProperty(window, 'setGameTestFrame', { value: (v: string) => { state = v; paint() } })
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { value: async () => canvas.captureStream(30) })
  })
  await page.goto('/?view=home')
  await page.evaluate(() => localStorage.setItem('laundry-mountain:field-report:v1', 'field-report-must-be-preserved'))
  await page.getByRole('button', { name: 'Start a laundry session' }).click()
  await page.getByRole('button', { name: 'Set up my camera' }).click()
  await page.getByRole('button', { name: 'Enable camera' }).click()
  await page.getByRole('button', { name: 'Calibrate empty work area' }).click()
  await expect(page.getByRole('button', { name: 'Start folding now' })).toBeVisible({ timeout: 10_000 })
  await page.setViewportSize({ width: 844, height: 390 })
  await page.getByRole('button', { name: 'Start folding now' }).click()
  await page.screenshot({ path: path.join(os.tmpdir(), 'laundry-mountain-game-live-layout.png') })
  for (const selector of ['.game-camera .camera-preview', '.game-climb-column .mountain-canvas', '.game-live-buttons']) {
    const b = await page.locator(selector).boundingBox(); expect(b).not.toBeNull(); expect(b!.y).toBeGreaterThanOrEqual(0); expect(b!.y+b!.height, selector).toBeLessThanOrEqual(390)
  }
  await page.getByRole('button', { name: 'Pause', exact: true }).click()
  await page.evaluate(() => (window as unknown as { setGameTestFrame: (v: string) => void }).setGameTestFrame('source'))
  await page.waitForTimeout(1500)
  await expect(page.locator('.live-instruction')).toContainText('Paused')
  expect(await page.evaluate(() => localStorage.getItem('laundry-mountain:phase1:v1'))).toBeNull()
  await page.getByRole('button', { name: 'Resume', exact: true }).click()
  if (countItem) {
    await expect(page.locator('.live-instruction')).toContainText('Source reached')
    await page.evaluate(() => (window as unknown as { setGameTestFrame: (v: string) => void }).setGameTestFrame('work'))
    await expect(page.locator('.live-instruction')).toContainText('Work area active')
    await page.waitForTimeout(3500)
    await page.evaluate(() => (window as unknown as { setGameTestFrame: (v: string) => void }).setGameTestFrame('placed'))
    await expect(page.locator('.game-climb-column .game-stat-row')).toContainText('+10 m', { timeout: 10_000 })
  }
  await page.screenshot({ path: path.join(os.tmpdir(), `laundry-mountain-game-live-${countItem ? 'synthetic' : 'zero'}.png`) })
  await page.getByRole('button', { name: 'Finish session', exact: true }).click()
  await page.setViewportSize({ width: 390, height: 844 })
  if (!countItem) await expect(page.getByText('No items were detected.', { exact: true })).toBeVisible()
  await expect(page.locator('.result-stats')).toContainText(countItem ? '+10 m' : '+0 m')
  expect(await page.evaluate(() => localStorage.getItem('laundry-mountain:field-report:v1'))).toBe('field-report-must-be-preserved')
  await page.screenshot({ path: path.join(os.tmpdir(), `laundry-mountain-game-results-${countItem ? 'synthetic' : 'zero'}.png`), fullPage: true })
  await page.getByRole('button', { name: 'View session history', exact: true }).click(); await page.reload()
  await expect(page.locator('.session-history')).toContainText(countItem ? '+10 m' : '+0 m')
  await page.getByRole('button', { name: 'Home', exact: true }).click()
  await expect(page.locator('.game-stat-row')).toContainText(countItem ? '10 m' : '0 m')
})

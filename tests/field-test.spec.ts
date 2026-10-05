import { expect, test } from '@playwright/test'
import os from 'node:os'
import path from 'node:path'

test('portrait and landscape stay usable with real progress at zero', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport); await page.goto('/')
    await expect(page.getByRole('heading', { name: 'Your folding workspace' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Start folding test' })).toBeDisabled()
    await expect(page.getByText('0 m climbed', { exact: true })).toBeVisible()
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
    await page.getByRole('button', { name: 'Climb view', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Climb view', exact: true })).toHaveAttribute('aria-pressed', 'true')
  }
})

test('permission denial explains recovery without granting progress', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { value: () => Promise.reject(new DOMException('Permission denied', 'NotAllowedError')) })
  })
  await page.goto('/'); await page.getByRole('button', { name: 'Enable camera' }).click()
  await expect(page.getByRole('alert')).toContainText('permission was denied')
  await expect(page.getByRole('button', { name: 'Start folding test' })).toBeDisabled()
  await expect(page.getByText('0 m climbed', { exact: true })).toBeVisible()
})

test('moving workspace calibration times out and can be retried', async ({ page }) => {
  await page.addInitScript(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1280; canvas.height = 720
    const ctx = canvas.getContext('2d')!
    let moving = true, pulse = 0
    const paint = () => { ctx.fillStyle = moving && pulse++ % 2 ? '#111' : '#ddd'; ctx.fillRect(0, 0, 1280, 720) }
    paint(); setInterval(paint, 100)
    Object.defineProperty(window, 'stopTestMotion', { value: () => { moving = false; paint() } })
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { value: async () => canvas.captureStream(30) })
  })
  await page.goto('/'); await page.getByRole('button', { name: 'Enable camera' }).click()
  await page.getByRole('button', { name: 'Calibrate empty work area' }).click()
  await expect(page.getByRole('alert')).toContainText('Calibration could not finish', { timeout: 12_000 })
  await expect(page.getByRole('button', { name: 'Calibrate empty work area' })).toBeEnabled()
  await page.evaluate(() => (window as unknown as { stopTestMotion: () => void }).stopTestMotion())
  await page.getByRole('button', { name: 'Calibrate empty work area' }).click()
  await expect(page.getByRole('button', { name: 'Start folding test' })).toBeEnabled({ timeout: 10_000 })
})

for (const flipped of [false, true]) test(`synthetic camera cycle works with ${flipped ? 'flipped' : 'original'} view, moving source calibration and saved position`, async ({ page }) => {
  // Test-only pixels are injected through the camera API, never a production demo path.
  await page.addInitScript(() => {
    const canvas = document.createElement('canvas'); canvas.width = 1280; canvas.height = 720
    const ctx = canvas.getContext('2d')!
    let state = 'empty', pulse = 0, reverse = false
    const paint = () => {
      ctx.fillStyle = '#ddd'; ctx.fillRect(0, 0, 1280, 720)
      ctx.save(); if (reverse) { ctx.translate(1280, 0); ctx.scale(-1, 1) }
      ctx.fillStyle = '#666'; ctx.fillRect(50, 270, 240, 300)
      if (state === 'source') { ctx.fillStyle = pulse++ % 2 ? '#222' : '#999'; ctx.fillRect(50, 270, 240, 300) }
      if (state === 'work') { ctx.fillStyle = pulse++ % 2 ? '#224466' : '#773311'; ctx.fillRect(470, 290, 300, 250) }
      if (state === 'placed') { ctx.fillStyle = '#224466'; ctx.fillRect(930, 330, 240, 170) }
      ctx.restore()
    }
    paint(); setInterval(paint, 125)
    Object.defineProperty(window, 'setSyntheticFrame', { value: (value: string) => { state = value; paint() } })
    Object.defineProperty(window, 'setSyntheticOrientation', { value: (value: boolean) => { reverse = value; paint() } })
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { value: async () => canvas.captureStream(30) })
  })
  await page.goto('/'); await page.getByRole('button', { name: 'Enable camera' }).click()
  await expect(page.getByRole('button', { name: 'Calibrate empty work area' })).toBeEnabled()
  if (flipped) {
    await page.evaluate(() => (window as unknown as { setSyntheticOrientation: (value: boolean) => void }).setSyntheticOrientation(true))
    await page.getByRole('button', { name: 'Flip view', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Flip view', exact: true })).toHaveAttribute('aria-pressed', 'true')
  }
  // Movement in the pickup area must not block calibration of the two empty areas.
  await page.evaluate(() => (window as unknown as { setSyntheticFrame: (s: string) => void }).setSyntheticFrame('source'))
  await page.getByRole('button', { name: 'Calibrate empty work area' }).click()
  await expect(page.getByRole('button', { name: 'Start folding test' })).toBeEnabled({ timeout: 10_000 })
  if (flipped) {
    await page.setViewportSize({ width: 844, height: 390 })
    await page.evaluate(() => scrollTo(0, 0))
    await page.screenshot({ path: path.join(os.tmpdir(), 'laundry-mountain-setup-fix.png') })
  }
  await page.getByRole('button', { name: 'Start folding now' }).click()
  await page.evaluate(() => (window as unknown as { setSyntheticFrame: (s: string) => void }).setSyntheticFrame('source'))
  await expect(page.getByRole('heading', { name: 'Source reached', exact: true })).toBeVisible()
  await page.evaluate(() => (window as unknown as { setSyntheticFrame: (s: string) => void }).setSyntheticFrame('work'))
  await expect(page.getByRole('heading', { name: 'Folding in progress', exact: true })).toBeVisible()
  await page.waitForTimeout(3500)
  await page.evaluate(() => (window as unknown as { setSyntheticFrame: (s: string) => void }).setSyntheticFrame('placed'))
  await expect(page.getByText('10 m climbed', { exact: true })).toBeVisible({ timeout: 10_000 })
  await page.getByRole('button', { name: 'Finish test' }).click()
  await page.reload()
  await expect(page.getByText('10 m climbed', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Folding test results' })).toBeVisible()
})

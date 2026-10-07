import { expect, test } from '@playwright/test'
import os from 'node:os'
import path from 'node:path'

test('portrait and landscape stay usable with real progress at zero', async ({ page }) => {
  for (const viewport of [{ width: 390, height: 844 }, { width: 844, height: 390 }]) {
    await page.setViewportSize(viewport); await page.goto('/?view=test')
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
  await page.goto('/?view=test'); await page.getByRole('button', { name: 'Enable camera' }).click()
  await expect(page.getByRole('alert')).toContainText('permission was denied')
  await expect(page.getByRole('button', { name: 'Start folding test' })).toBeDisabled()
  await expect(page.getByText('0 m climbed', { exact: true })).toBeVisible()
})

test('front camera is required without retrying a rear camera', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { value: async (constraints: MediaStreamConstraints) => {
      Object.defineProperty(window, 'requestedCamera', { value: constraints, configurable: true })
      throw new DOMException('Requested lens unavailable', 'OverconstrainedError')
    } })
  })
  await page.goto('/?view=test'); await page.getByRole('button', { name: 'Enable camera' }).click()
  await expect(page.getByRole('alert')).toContainText('front camera could not be opened')
  expect(await page.evaluate(() => (window as unknown as { requestedCamera: MediaStreamConstraints }).requestedCamera.video)).toMatchObject({ facingMode: { exact: 'user' } })
  await expect(page.getByRole('button', { name: 'Use rear camera' })).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Start folding test' })).toBeDisabled()
})

test('an incorrectly selected rear camera is stopped before calibration', async ({ page }) => {
  await page.addInitScript(() => {
    const canvas = document.createElement('canvas'), stream = canvas.captureStream(30), track = stream.getVideoTracks()[0]
    Object.defineProperty(track, 'getSettings', { value: () => ({ facingMode: 'environment' }) })
    Object.defineProperty(window, 'testCameraTrack', { value: track })
    Object.defineProperty(navigator.mediaDevices, 'getUserMedia', { value: async () => stream })
  })
  await page.goto('/?view=test'); await page.getByRole('button', { name: 'Enable camera' }).click()
  await expect(page.getByRole('alert')).toContainText('requires the front camera')
  expect(await page.evaluate(() => (window as unknown as { testCameraTrack: MediaStreamTrack }).testCameraTrack.readyState)).toBe('ended')
  await expect(page.getByRole('button', { name: 'Start folding test' })).toBeDisabled()
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
  await page.goto('/?view=test'); await page.getByRole('button', { name: 'Enable camera' }).click()
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
  await page.goto('/?view=test'); await page.getByRole('button', { name: 'Enable camera' }).click()
  await expect(page.getByRole('button', { name: 'Calibrate empty work area' })).toBeEnabled()
  await expect(page.getByTestId('field-test-guide')).toContainText('Frame your workspace')
  await page.getByRole('button', { name: 'My workspace fits' }).click()
  await expect(page.getByTestId('field-test-guide')).toContainText('Clear the two working areas')
  if (flipped) {
    await page.evaluate(() => (window as unknown as { setSyntheticOrientation: (value: boolean) => void }).setSyntheticOrientation(true))
    await page.getByRole('button', { name: 'Flip view', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Flip view', exact: true })).toHaveAttribute('aria-pressed', 'true')
  }
  // Movement in the pickup area must not block calibration of the two empty areas.
  await page.evaluate(() => (window as unknown as { setSyntheticFrame: (s: string) => void }).setSyntheticFrame('source'))
  await page.getByRole('button', { name: 'Calibrate empty work area' }).click()
  await expect(page.getByRole('button', { name: 'Start folding test' })).toBeEnabled({ timeout: 10_000 })
  await expect(page.getByTestId('field-test-guide')).toContainText('You are ready to start')
  if (flipped) {
    await page.setViewportSize({ width: 844, height: 390 })
    await page.evaluate(() => scrollTo(0, 0))
    await page.screenshot({ path: path.join(os.tmpdir(), 'laundry-mountain-guided-test.png') })
  }
  await page.getByRole('button', { name: 'Start folding now' }).click()
  await expect(page.getByTestId('field-test-guide')).toContainText('Fold 20 real items')
  await page.evaluate(() => (window as unknown as { setSyntheticFrame: (s: string) => void }).setSyntheticFrame('source'))
  await expect(page.getByRole('heading', { name: 'Source reached', exact: true })).toBeVisible()
  await page.evaluate(() => (window as unknown as { setSyntheticFrame: (s: string) => void }).setSyntheticFrame('work'))
  await expect(page.getByRole('heading', { name: 'Folding in progress', exact: true })).toBeVisible()
  await page.waitForTimeout(3500)
  await page.evaluate(() => (window as unknown as { setSyntheticFrame: (s: string) => void }).setSyntheticFrame('placed'))
  await expect(page.getByText('10 m climbed', { exact: true })).toBeVisible({ timeout: 10_000 })
  if (flipped) {
    await page.evaluate(() => document.querySelector('.live-layout')?.scrollIntoView({ block: 'start' }))
    for (const selector of ['.camera-preview', '.mountain-canvas', '.progress-line']) {
      const bounds = await page.locator(selector).boundingBox()
      expect(bounds).not.toBeNull(); expect(bounds!.y).toBeGreaterThanOrEqual(0)
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(390)
    }
    const camera = await page.locator('.camera-preview').boundingBox(), mountain = await page.locator('.mountain-canvas').boundingBox()
    expect(camera!.x + camera!.width).toBeLessThan(mountain!.x)
    await page.screenshot({ path: path.join(os.tmpdir(), 'laundry-mountain-front-camera-live.png') })
  }
  await page.getByTestId('field-test-guide').getByRole('button', { name: 'Finish test' }).click()
  await expect(page.getByTestId('field-test-guide')).toContainText('Record the folding result')
  await page.getByRole('button', { name: 'View results' }).click()
  await expect(page.getByRole('textbox', { name: 'Summary to send back' })).toContainText('Automatic events: 1')
  await page.getByRole('textbox', { name: 'What happened physically?' }).fill('Synthetic software check: one event; physical accuracy not tested.')
  if (!flipped) {
    await page.reload()
    await expect(page.getByRole('textbox', { name: 'What happened physically?' })).toHaveValue('Synthetic software check: one event; physical accuracy not tested.')
    await expect(page.getByRole('textbox', { name: 'Summary to send back' })).toContainText('Stages observed:')
  }
  if (flipped) {
    await page.getByRole('button', { name: 'Begin two-minute control' }).click()
    await expect(page.getByTestId('field-test-guide')).toContainText('Pause with your hands')
    await page.getByTestId('field-test-guide').getByRole('button', { name: 'Finish test' }).click()
    await expect(page.getByTestId('field-test-guide')).toContainText('Control stopped early')
    await page.getByRole('button', { name: 'Check saved position' }).click()
    await expect(page.getByTestId('field-test-guide')).toContainText('Leave, return and check your position')
    await page.getByRole('button', { name: 'Reload and check' }).click()
    await expect(page.getByTestId('field-test-guide')).toContainText('Saved position restored')
  }
  await page.reload()
  await expect(page.getByText('10 m climbed', { exact: true })).toBeVisible()
  await expect(page.getByRole('heading', { name: flipped ? 'Negative-control results' : 'Folding test results' })).toBeVisible()
})


test('previously saved failed report is readable without camera and has a copy fallback', async ({ page }) => {
  // Isolated browser fixture only; no report is seeded into the real phone or shared app.
  await page.addInitScript(() => {
    localStorage.setItem('laundry-mountain:field-report:v1', JSON.stringify({
      id: 'synthetic-report-fixture', kind: 'folding', startedAt: 1000, endedAt: 31000,
      events: [], frames: 240, processingMs: 480,
      diagnostics: [{ at: 30000, stage: 'working', motion: [0, .2, 0], occupancy: [0, .2, 0], outsideMotion: 0 }],
      config: {}, zones: {}, notes: 'Synthetic report fixture; physical accuracy untested.', userAgent: 'Test-only browser',
    }))
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: async () => { throw new Error('Copy denied') } } })
  })
  await page.setViewportSize({ width: 390, height: 844 }); await page.goto('/?view=test')
  await page.getByRole('button', { name: 'View results' }).click()
  await expect(page.getByRole('heading', { name: 'Folding test results' })).toBeVisible()
  await expect(page.getByRole('textbox', { name: 'Summary to send back' })).toHaveValue(/Automatic events: 0[\s\S]*8.0 fps[\s\S]*Last recorded stage: working/)
  await page.getByRole('button', { name: 'Copy test summary' }).click()
  await expect(page.getByText('Copy was unavailable. Select the summary text below and copy it manually.')).toBeVisible()
  await page.getByRole('button', { name: 'View results' }).click()
  await page.screenshot({ path: path.join(os.tmpdir(), 'laundry-mountain-readable-report.png') })
})

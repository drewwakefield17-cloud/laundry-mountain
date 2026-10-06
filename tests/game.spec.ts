import { expect, test } from '@playwright/test'
import os from 'node:os'
import path from 'node:path'

test('the game route keeps navigation and view controls accessible when the phone rotates', async ({
  page
}) => {
  await page.goto('/?view=mountain')
  for (const viewport of [
    { width: 390, height: 786 },
    { width: 844, height: 390 },
    { width: 667, height: 375 }
  ]) {
    await page.setViewportSize(viewport)
    for (const selector of ['.game-nav', '.view-control', '.route-details summary']) {
      const bounds = await page.locator(selector).boundingBox()
      expect(bounds, selector).not.toBeNull()
      expect(bounds!.y, selector).toBeGreaterThanOrEqual(0)
      expect(bounds!.y + bounds!.height, selector).toBeLessThanOrEqual(viewport.height + 1)
    }
    await page.getByRole('button', { name: 'Climb view', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Climb view', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    await page.getByRole('button', { name: 'Full mountain', exact: true }).click()
    await expect(page.getByRole('button', { name: 'Full mountain', exact: true })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  }
  expect(await page.evaluate(() => localStorage.getItem('laundry-mountain:phase1:v1'))).toBeNull()
})

test('game screens choose a load and goal, retain zero progress, and show genuine empty history', async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?view=home')
  await expect(page.getByRole('heading', { name: 'Climber!' })).toBeVisible()
  await expect(page.locator('.mountain-canvas')).toHaveAttribute('data-terrain-ready', 'true')
  await page.screenshot({
    path: path.join(os.tmpdir(), 'laundry-mountain-game-home.png'),
    fullPage: true
  })
  await page.getByRole('button', { name: 'Start a Laundry Session' }).click()
  await page.getByRole('button', { name: 'Towels', exact: true }).click()
  await page.getByRole('button', { name: '30 items', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Towels', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  await expect(page.getByRole('button', { name: '30 items', exact: true })).toHaveAttribute(
    'aria-pressed',
    'true'
  )
  await page.screenshot({
    path: path.join(os.tmpdir(), 'laundry-mountain-game-setup.png'),
    fullPage: true
  })
  await page.getByRole('button', { name: 'Back to home', exact: true }).click()
  await page.getByRole('button', { name: '0 Loads', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Your journey starts with one load.' })
  ).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('laundry-mountain:phase1:v1'))).toBeNull()
  for (const view of ['home', 'mountain', 'sessions']) {
    await page.goto(`/?view=${view}`)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
})

for (const countItem of [false, true])
  test(`real game camera pipeline saves ${countItem ? 'one synthetic event' : 'honest zero results'} without replacing the field report`, async ({
    page
  }) => {
    // Isolated camera fixture, never installed in the shared browser or production app.
    await page.addInitScript(() => {
      const canvas = document.createElement('canvas')
      canvas.width = 1280
      canvas.height = 720
      const ctx = canvas.getContext('2d')!
      let state = 'empty',
        pulse = 0
      const paint = () => {
        ctx.fillStyle = '#ddd'
        ctx.fillRect(0, 0, 1280, 720)
        ctx.fillStyle = '#666'
        ctx.fillRect(50, 270, 240, 300)
        if (state === 'source') {
          ctx.fillStyle = pulse++ % 2 ? '#222' : '#999'
          ctx.fillRect(50, 270, 240, 300)
        }
        if (state === 'work') {
          ctx.fillStyle = pulse++ % 2 ? '#224466' : '#773311'
          ctx.fillRect(470, 290, 300, 250)
        }
        if (state === 'placed') {
          ctx.fillStyle = '#224466'
          ctx.fillRect(930, 330, 240, 170)
        }
      }
      paint()
      setInterval(paint, 125)
      Object.defineProperty(window, 'setGameTestFrame', {
        value: (v: string) => {
          state = v
          paint()
        }
      })
      Object.defineProperty(navigator.mediaDevices, 'getUserMedia', {
        value: async () => canvas.captureStream(30)
      })
    })
    await page.goto('/?view=home')
    await page.evaluate(() =>
      localStorage.setItem('laundry-mountain:field-report:v1', 'field-report-must-be-preserved')
    )
    await page.getByRole('button', { name: 'Start a Laundry Session' }).click()
    await page.getByRole('button', { name: 'Set up my camera' }).click()
    await page.getByRole('button', { name: 'Enable camera' }).click()
    await page.getByRole('button', { name: 'Calibrate empty work area' }).click()
    await expect(page.getByRole('button', { name: 'Start folding now' })).toBeVisible({
      timeout: 10_000
    })
    await page.setViewportSize({ width: 844, height: 390 })
    await page.getByRole('button', { name: 'Start folding now' }).click()
    await page.screenshot({
      path: path.join(os.tmpdir(), 'laundry-mountain-game-live-layout.png')
    })
    for (const selector of [
      '.game-camera .camera-preview',
      '.game-climb-column .mountain-canvas',
      '.game-live-buttons'
    ]) {
      const b = await page.locator(selector).boundingBox()
      expect(b).not.toBeNull()
      expect(b!.y).toBeGreaterThanOrEqual(0)
      expect(b!.y + b!.height, selector).toBeLessThanOrEqual(390)
    }
    await page.getByRole('button', { name: 'Pause', exact: true }).click()
    await page.evaluate(() =>
      (window as unknown as { setGameTestFrame: (v: string) => void }).setGameTestFrame('source')
    )
    await page.waitForTimeout(1500)
    await expect(page.locator('.live-instruction')).toContainText('Paused')
    expect(await page.evaluate(() => localStorage.getItem('laundry-mountain:phase1:v1'))).toBeNull()
    await page.getByRole('button', { name: 'Resume', exact: true }).click()
    if (countItem) {
      await expect(page.locator('.live-instruction')).toContainText('Source reached')
      await page.evaluate(() =>
        (window as unknown as { setGameTestFrame: (v: string) => void }).setGameTestFrame('work')
      )
      await expect(page.locator('.live-instruction')).toContainText('Work area active')
      await page.waitForTimeout(3500)
      await page.evaluate(() =>
        (window as unknown as { setGameTestFrame: (v: string) => void }).setGameTestFrame('placed')
      )
      await expect(page.locator('.game-climb-column .game-stat-row')).toContainText('+10 m', {
        timeout: 10_000
      })
    }
    await page.screenshot({
      path: path.join(
        os.tmpdir(),
        `laundry-mountain-game-live-${countItem ? 'synthetic' : 'zero'}.png`
      )
    })
    await page.setViewportSize({ width: 390, height: 786 })
    for (const selector of [
      '.game-camera .camera-preview',
      '.game-climb-column .mountain-canvas',
      '.game-live-buttons'
    ]) {
      const bounds = await page.locator(selector).boundingBox()
      expect(bounds!.y + bounds!.height, selector).toBeLessThanOrEqual(786)
    }
    await page.screenshot({
      path: path.join(
        os.tmpdir(),
        `laundry-mountain-game-live-portrait-${countItem ? 'synthetic' : 'zero'}.png`
      )
    })
    await page.getByRole('button', { name: 'Finish session', exact: true }).click()
    await page.setViewportSize({ width: 390, height: 844 })
    if (!countItem)
      await expect(page.getByText('No items were detected.', { exact: true })).toBeVisible()
    await expect(page.locator('.result-stats')).toContainText(countItem ? '+10 m' : '+0 m')
    expect(
      await page.evaluate(() => localStorage.getItem('laundry-mountain:field-report:v1'))
    ).toBe('field-report-must-be-preserved')
    await page.screenshot({
      path: path.join(
        os.tmpdir(),
        `laundry-mountain-game-results-${countItem ? 'synthetic' : 'zero'}.png`
      ),
      fullPage: true
    })
    await page.getByRole('button', { name: 'View session history', exact: true }).click()
    await page.reload()
    await expect(page.locator('.session-history')).toContainText(countItem ? '+10 m' : '+0 m')
    await page.getByRole('button', { name: 'Home', exact: true }).click()
    await expect(page.locator('.game-stat-row')).toContainText(countItem ? '10 m' : '0 m')
  })

test('profile, demo community, badge criteria and locked expeditions are honest and keyboard usable', async ({
  page
}) => {
  await page.setViewportSize({ width: 390, height: 786 })
  await page.goto('/?view=home')
  await page.getByRole('button', { name: 'Profile', exact: true }).click()
  await page.getByLabel('Your climber name').fill('Alex')
  await page.getByRole('button', { name: 'Save name' }).click()
  await expect(page.getByRole('status')).toContainText('saved on this phone')
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Alex', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Achievements 0 / 9', exact: true }).click()
  await expect(page.locator('.badge-card')).toHaveCount(9)
  await page
    .getByRole('button', {
      name: 'First Load Finish your first counted session'
    })
    .click()
  const dialog = page.getByRole('dialog')
  await expect(dialog).toBeVisible()
  await expect(dialog).toContainText('Keep climbing to unlock')
  await expect(dialog.getByRole('button', { name: 'Close', exact: true })).toBeFocused()
  await page.keyboard.press('Shift+Tab')
  await expect(dialog.getByRole('button', { name: 'Got it', exact: true })).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(dialog).not.toBeVisible()
  await expect(
    page.getByRole('button', {
      name: 'First Load Finish your first counted session'
    })
  ).toBeFocused()
  await page.getByRole('button', { name: 'Earned', exact: true }).click()
  await expect(page.locator('.badge-card')).toHaveCount(0)
  await page.getByRole('button', { name: 'Community', exact: true }).click()
  await expect(page.locator('.demo-notice')).toContainText('fictional')
  await expect(page.locator('.leaderboard>button')).toHaveCount(5)
  await page.getByRole('button', { name: 'Jamie Demo Ben Nevis 72%', exact: true }).click()
  await expect(dialog).toContainText('not a registered user')
  await dialog.getByRole('button', { name: 'Got it' }).click()
  await page.getByRole('button', { name: 'You', exact: true }).click()
  await expect(page.locator('.leaderboard>button')).toHaveCount(1)
  await expect(page.locator('.your-row')).toContainText('0%')
  await page.getByRole('button', { name: 'Mountains', exact: true }).click()
  await page.getByRole('button', { name: 'Everest Future expedition', exact: true }).click()
  await expect(dialog).toContainText('future update')
  await dialog.getByRole('button', { name: 'Got it' }).click()
  expect(await page.evaluate(() => localStorage.getItem('laundry-mountain:phase1:v1'))).toBeNull()
  await page.getByRole('button', { name: 'Home', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Alex!', exact: true })).toBeVisible()
  await page.setViewportSize({ width: 320, height: 640 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  await page.setViewportSize({ width: 768, height: 1024 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
})

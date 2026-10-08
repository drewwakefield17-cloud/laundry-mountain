import { expect, test } from '@playwright/test'
import os from 'node:os'
import path from 'node:path'

test('welcome keeps its entry controls usable on a small landscape phone', async ({ page }) => {
  await page.setViewportSize({ width: 667, height: 375 })
  await page.goto('/?view=welcome')
  for (const name of ['Get Started', 'Return to my saved progress']) {
    const button = page.getByRole('button', { name, exact: true })
    const bounds = await button.boundingBox()
    expect(bounds).not.toBeNull()
    expect(bounds!.y).toBeGreaterThanOrEqual(0)
    expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(375)
    expect(bounds!.height).toBeGreaterThanOrEqual(44)
  }
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(667)
  await page.getByRole('button', { name: 'Get Started', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Climber!' })).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('laundry-mountain:phase1:v1'))).toBeNull()
})

test('landing connects to onboarding and diagnostics without awarding progress', async ({ page }) => {
  const errors: string[] = []
  page.on('pageerror', e => errors.push(e.message))
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Your laundry. A little adventure.' })).toBeVisible()
  await expect(page.locator('.climb-scene')).toHaveAttribute('data-metres', '0')
  await page.getByText('Does the camera record or upload me?', { exact: true }).click()
  await expect(page.getByText('No. Frame analysis happens in your browser.', { exact: false })).toBeVisible()
  for (const viewport of [{ width: 320, height: 740 }, { width: 1440, height: 900 }]) {
    await page.setViewportSize(viewport)
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.screenshot({ path: path.join(os.tmpdir(), 'laundry-mountain-landing-hero.png') })
  await page.screenshot({ path: path.join(os.tmpdir(), 'laundry-mountain-landing-desktop.png'), fullPage: true })
  await page.getByRole('link', { name: 'Start your climb' }).click()
  await expect(page.getByRole('button', { name: 'Get Started' })).toBeVisible()
  await page.getByRole('button', { name: 'Get Started' }).click()
  await expect(page.getByRole('heading', { name: 'Climber!' })).toBeVisible()
  await page.goto('/?view=test')
  await expect(page.getByRole('heading', { name: 'Your folding workspace' })).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('laundry-mountain:phase1:v1'))).toBeNull()
  expect(errors).toEqual([])
})

test('saved progress restores the companion without replaying a celebration', async ({ page }) => {
  // Local isolated persistence fixture, never written to the shared development browser.
  await page.addInitScript(() => {
    const key = 'laundry-mountain:phase1:v1'
    if (!localStorage.getItem(key)) localStorage.setItem(key, JSON.stringify({ version: 1, events:
      Array.from({ length: 25 }, (_, i) => ({ id: `fixture-${i}`, sessionId: `isolated-${i}`, at: i * 100000, action: 'folding', source: 'camera', items: 1, evidence: 'isolated Playwright fixture' }))
    }))
  })
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.goto('/?view=home')
  await expect(page.locator('.scenic-artwork-landscape')).toBeVisible()
  await expect(page.getByRole('button', { name: '250 m Climbed', exact: true })).toBeVisible()
  await page.getByRole('button', { name: 'Explore Ben Nevis', exact: true }).click()
  await expect(page.locator('.mountain-canvas')).toHaveAttribute('data-scenery-finish', 'illustrated')
  await expect(page.locator('.climb-scene')).toHaveAttribute('data-metres', '250')
  await expect(page.locator('.climb-scene')).toHaveAttribute('data-motion', 'idle')
  await expect(page.getByText('Lochan lookout', { exact: true }).first()).toBeVisible()
  const position = await page.locator('.climb-companion').getAttribute('style')
  await page.reload()
  await expect(page.locator('.climb-companion')).toHaveAttribute('style', position!)
  await expect(page.locator('.basket-avatar')).not.toHaveClass(/is-celebrating/)
  await page.getByRole('button', { name: 'Full mountain', exact: true }).click()
  await expect(page.locator('.mountain-canvas')).toHaveAttribute('data-scenery-finish', 'natural')
  await expect(page.locator('.mountain-canvas')).toHaveAttribute('aria-label', /250/)
  await page.getByRole('button', { name: 'Climb view', exact: true }).click()
  await expect(page.locator('.mountain-canvas')).toHaveAttribute('data-scenery-finish', 'illustrated')
  await expect(page.locator('.climb-scene')).toHaveAttribute('data-metres', '250')
})

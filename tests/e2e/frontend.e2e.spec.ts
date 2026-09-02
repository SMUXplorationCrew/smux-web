import { expect, test } from '@playwright/test'

/**
 * Smoke coverage for the public site. These assert structure rather than copy, because
 * every word on these pages is editor-controlled and would otherwise break the suite
 * the first time someone rewrites a heading in the CMS.
 */

test.describe('Frontend', () => {
  test('home page renders with nav and footer', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/SMUX/)
    await expect(page.locator('h1').first()).toContainText('SMUXploration Crew')
    await expect(page.getByRole('navigation', { name: 'Main' }).first()).toBeVisible()
    await expect(page.locator('footer')).toBeVisible()
  })

  test('every public route responds', async ({ page }) => {
    for (const path of [
      '/clubs',
      '/events',
      '/calendar',
      '/gallery',
      '/about',
      '/join',
      '/contact',
    ]) {
      const response = await page.goto(`http://localhost:3000${path}`)
      expect(response?.status(), `${path} should not error`).toBeLessThan(400)
      await expect(page.locator('h1')).toBeVisible()
    }
  })

  test('resources is gated behind sign-in', async ({ page }) => {
    await page.goto('http://localhost:3000/resources')
    await expect(page.getByRole('link', { name: /sign in/i })).toBeVisible()
  })

  test('mobile nav opens and closes at 390px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3000')

    const toggle = page.getByRole('button', { name: 'Open menu' })
    await expect(toggle).toBeVisible()

    await toggle.click()
    const panel = page.getByRole('navigation', { name: 'Main' })
    await expect(panel).toBeVisible()

    await page.getByRole('button', { name: 'Close menu' }).click()
    await expect(page.getByRole('button', { name: 'Open menu' })).toBeVisible()
  })

  // Every route, at the three widths that matter: a small phone, a tablet, and a
  // laptop. Horizontal overflow is the failure that makes a site feel broken on a
  // phone, and it only ever shows up on the page that has a wide element on it.
  const ROUTES = [
    '/',
    '/clubs',
    '/clubs/trekking',
    '/events',
    '/calendar',
    '/gallery',
    '/about',
    '/join',
    '/contact',
    '/committee',
  ]

  for (const width of [390, 768, 1280]) {
    test(`no horizontal overflow at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 })

      for (const path of ROUTES) {
        await page.goto(`http://localhost:3000${path}`)
        const overflowBy = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        )
        expect(overflowBy, `${path} overflows by ${overflowBy}px`).toBeLessThanOrEqual(0)
      }
    })
  }

  test('tap targets on the mobile menu are at least 44px', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto('http://localhost:3000')
    await page.getByRole('button', { name: 'Open menu' }).click()

    const links = page.getByRole('navigation', { name: 'Main' }).getByRole('link')
    const count = await links.count()
    expect(count).toBeGreaterThan(0)

    for (let i = 0; i < count; i++) {
      const box = await links.nth(i).boundingBox()
      expect(box?.height ?? 0, `nav link ${i} is too small to tap`).toBeGreaterThanOrEqual(44)
    }
  })
})

import { expect, type Page, test } from '@playwright/test'
import { login } from '../helpers/login'
import { cleanupTestUser, seedTestUser, testUser } from '../helpers/seedUser'

/**
 * These tests share one page across the whole describe, so order matters and a failure
 * leaves the next test on an unknown screen. Serial mode makes that explicit and stops
 * the rest of the file once one fails, instead of reporting a cascade of confusing
 * secondary failures.
 */
test.describe.configure({ mode: 'serial' })

test.describe('Admin Panel', () => {
  let page: Page

  test.beforeAll(async ({ browser }) => {
    await seedTestUser()

    const context = await browser.newContext()
    page = await context.newPage()

    /**
     * Warm the admin bundle before logging in.
     *
     * The suite runs against `pnpm dev`, where Turbopack compiles a route on its first
     * request. `/admin` is by far the largest route in the app, and paying that cost
     * inside a login step — or inside the first assertion — is what made these tests
     * fail intermittently while the frontend specs loaded the server in parallel.
     * Doing it once here, with a generous budget, keeps the tests measuring the app
     * rather than the compiler.
     */
    await page.goto('http://localhost:3000/admin', {
      waitUntil: 'domcontentloaded',
      timeout: 120_000,
    })

    await login({ page, user: testUser })

    /**
     * Wait for the dashboard to actually render, not merely for the document to load.
     *
     * `domcontentloaded` above returns while the admin is still a shell — the panel is a
     * client-rendered app, so its navigation appears well after that. Warming only the
     * bundle left the first assertion racing the first paint, which is what made these
     * tests fail intermittently while the frontend specs shared the dev server.
     */
    await expect(page.locator('span[title="Dashboard"]').first()).toBeVisible({
      timeout: 120_000,
    })
  })

  // Compilation happens in beforeAll, but a cold machine can still be slow.
  test.setTimeout(60_000)

  test.afterAll(async () => {
    await cleanupTestUser()
  })

  test('can navigate to dashboard', async () => {
    await page.goto('http://localhost:3000/admin', { waitUntil: 'networkidle' })
    // Matched loosely on purpose: an exact-string URL assertion fails the moment
    // Payload appends a redirect or locale parameter. What matters is that we are on
    // the dashboard rather than bounced back to the login screen.
    await expect(page).not.toHaveURL(/\/admin\/login/)
    const dashboardArtifact = page.locator('span[title="Dashboard"]').first()
    await expect(dashboardArtifact).toBeVisible()
  })

  test('can navigate to list view', async () => {
    await page.goto('http://localhost:3000/admin/collections/users', {
      waitUntil: 'networkidle',
    })
    await expect(page).toHaveURL(/\/admin\/collections\/users/)
    const listViewArtifact = page.locator('h1', { hasText: 'Users' }).first()
    await expect(listViewArtifact).toBeVisible()
  })

  test('can navigate to edit view', async () => {
    await page.goto('http://localhost:3000/admin/collections/users/create', {
      waitUntil: 'networkidle',
    })
    await expect(page).toHaveURL(/\/admin\/collections\/users\/[a-zA-Z0-9-_]+/)
    const editViewArtifact = page.locator('input[name="email"]')
    await expect(editViewArtifact).toBeVisible()
  })
})

import { defineConfig, devices } from '@playwright/test'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
import 'dotenv/config'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests/e2e',
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /**
   * Retry everywhere, not only on CI.
   *
   * The suite runs against `pnpm dev`, which compiles each route on first request, so a
   * cold `/admin` can exceed the default expect timeout while other tests are loading
   * the server. One retry absorbs that without hiding a genuine failure, which would
   * fail on both attempts.
   */
  retries: process.env.CI ? 2 : 1,
  /**
   * One worker everywhere, not just on CI.
   *
   * The suite runs against `pnpm dev`, which compiles each route on first request in a
   * single process. Parallel workers make the frontend specs and the admin specs
   * compete for that compiler, and the admin panel — by far the heaviest route — loses:
   * its first assertion races its first paint and fails perhaps one run in four.
   * Serialising costs a little wall time and removes the contention entirely.
   */
  workers: 1,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /**
     * Pin the browser binary when PLAYWRIGHT_CHROMIUM_PATH is set.
     *
     * Playwright wants an exact build number and refuses any other; when that download
     * fails or is incomplete, an already-installed Chrome for Testing works fine for
     * these smoke tests. Unset, Playwright resolves its own browser as usual.
     */
    launchOptions: process.env.PLAYWRIGHT_CHROMIUM_PATH
      ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH }
      : {},

    /* Base URL to use in actions like `await page.goto('/')`. */
    // baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Dev-mode route compilation makes the default 5s too tight for admin views. */
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'], channel: 'chromium' },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    reuseExistingServer: true,
    url: 'http://localhost:3000',
  },
})

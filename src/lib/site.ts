/**
 * The site's own absolute URL.
 *
 * Sitemaps and social preview tags need absolute URLs, and a relative one silently
 * produces cards that never render. Vercel injects VERCEL_PROJECT_PRODUCTION_URL for the
 * stable production domain; SITE_URL overrides it when a custom domain arrives.
 */
export const siteUrl = (
  process.env.SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:3000')
).replace(/\/$/, '')

export const absolute = (path: string) => `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`

export const SITE_NAME = 'SMUX — SMUXploration Crew'
export const SITE_DESCRIPTION =
  'The outdoor and adventure CCA at Singapore Management University. Six clubs: diving, kayaking, trekking, biking, skating and XSeed.'

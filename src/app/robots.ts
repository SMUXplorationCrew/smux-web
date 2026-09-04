import type { MetadataRoute } from 'next'
import { absolute } from '@/lib/site'

/**
 * Deliberately at the app root, not inside the (frontend) route group.
 *
 * `sitemap.ts` registers fine from within the group, but `robots.ts` does not — it
 * builds without error and simply never produces a route, so /robots.txt 404s with
 * nothing in the log to explain it. Moving it up one level is the fix; moving it back
 * silently breaks it again.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // The admin panel and the members-only area have nothing to gain from indexing,
      // and /resources would leak document titles into search results.
      disallow: ['/admin', '/api/', '/resources'],
    },
    sitemap: absolute('/sitemap.xml'),
  }
}

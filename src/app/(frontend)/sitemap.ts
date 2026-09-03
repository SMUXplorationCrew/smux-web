import type { MetadataRoute } from 'next'
import { getClubs, getEvents, getPageBySlug } from '@/lib/payload'
import { absolute } from '@/lib/site'

/**
 * Built from the database rather than hardcoded, so a new club or event is discoverable
 * without anyone remembering to edit a list. /resources is deliberately absent: it is
 * members-only and must not be advertised.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [clubs, events] = await Promise.all([getClubs(), getEvents({ limit: 500 })])

  const staticPages = ['', '/clubs', '/events', '/calendar', '/gallery', '/committee']
  const editorial = ['/about', '/join', '/contact']

  const entries: MetadataRoute.Sitemap = [
    ...staticPages.map((p) => ({
      url: absolute(p || '/'),
      changeFrequency: 'weekly' as const,
      priority: p === '' ? 1 : 0.8,
    })),
    ...clubs.map((c) => ({
      url: absolute(`/clubs/${c.slug}`),
      lastModified: c.updatedAt ? new Date(c.updatedAt) : undefined,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    })),
    ...events.map((e) => ({
      url: absolute(`/events/${e.slug}`),
      lastModified: e.updatedAt ? new Date(e.updatedAt) : undefined,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
  ]

  // Editorial pages only exist in the sitemap once someone has actually written them.
  for (const slug of editorial) {
    const page = await getPageBySlug(slug.replace('/', ''))
    if (page) {
      entries.push({
        url: absolute(slug),
        lastModified: page.updatedAt ? new Date(page.updatedAt) : undefined,
        changeFrequency: 'monthly',
        priority: 0.7,
      })
    }
  }

  return entries
}

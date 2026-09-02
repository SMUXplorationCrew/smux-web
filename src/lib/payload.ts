import config from '@payload-config'
import { getPayload, type Where } from 'payload'
import { cache } from 'react'
import type { Album, Club, Event, Page, Person, SiteSetting } from '@/payload-types'

/**
 * Read helpers for the pre-rendered site. Everything here runs at build time via
 * `generateStaticParams` and page bodies — nothing fetches per request.
 *
 * `cache` dedupes within a single render pass, so a club page asking for its own club
 * and its events does not hit the database twice for the same rows.
 */

export const getPayloadClient = cache(async () => getPayload({ config }))

/**
 * Queries degrade to an empty result instead of throwing.
 *
 * The site is being built before its content exists, so a missing table or an
 * unreachable database should still produce a page with an honest empty state rather
 * than failing the build. Session 6 adds the build-time validation that turns genuinely
 * missing content back into a hard failure; until then this is deliberately forgiving,
 * and every fallback is logged rather than swallowed silently.
 */
const safely = async <T>(label: string, run: () => Promise<T>, fallback: T): Promise<T> => {
  try {
    return await run()
  } catch (error) {
    console.warn(`[payload] ${label} failed, falling back to empty:`, (error as Error)?.message)
    return fallback
  }
}

export const getClubs = cache(
  async (): Promise<Club[]> =>
    safely('getClubs', async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'clubs',
        limit: 20,
        depth: 1,
        sort: 'name',
      })
      return docs
    }, []),
)

export const getClubBySlug = cache(
  async (slug: string): Promise<Club | null> =>
    safely(
      `getClubBySlug(${slug})`,
      async () => {
        const payload = await getPayloadClient()
        const { docs } = await payload.find({
          collection: 'clubs',
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 2,
        })
        return docs[0] ?? null
      },
      null,
    ),
)

interface EventQuery {
  clubId?: number | string
  /** Only events that have not finished yet. */
  upcoming?: boolean
  limit?: number
}

export const getEvents = cache(
  async (query: EventQuery = {}): Promise<Event[]> =>
    safely('getEvents', async () => {
      const payload = await getPayloadClient()
      const where: Where = {}
      if (query.clubId) where.club = { equals: query.clubId }
      if (query.upcoming) where.startsAt = { greater_than_equal: new Date().toISOString() }

      const { docs } = await payload.find({
        collection: 'events',
        where,
        limit: query.limit ?? 100,
        depth: 2,
        sort: 'startsAt',
      })
      return docs
    }, []),
)

export const getEventBySlug = cache(
  async (slug: string): Promise<Event | null> =>
    safely(
      `getEventBySlug(${slug})`,
      async () => {
        const payload = await getPayloadClient()
        const { docs } = await payload.find({
          collection: 'events',
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 2,
        })
        return docs[0] ?? null
      },
      null,
    ),
)

export const getAlbums = cache(
  async (clubId?: number | string): Promise<Album[]> =>
    safely('getAlbums', async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'albums',
        where: clubId ? { club: { equals: clubId } } : {},
        limit: 50,
        depth: 2,
        sort: '-date',
      })
      return docs
    }, []),
)

export const getPeople = cache(
  async (clubId?: number | string): Promise<Person[]> =>
    safely('getPeople', async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'people',
        where: clubId ? { club: { equals: clubId } } : {},
        limit: 100,
        depth: 2,
        sort: 'name',
      })
      return docs
    }, []),
)

export const getPageBySlug = cache(
  async (slug: string): Promise<Page | null> =>
    safely(
      `getPageBySlug(${slug})`,
      async () => {
        const payload = await getPayloadClient()
        const { docs } = await payload.find({
          collection: 'pages',
          where: { slug: { equals: slug } },
          limit: 1,
          depth: 2,
        })
        return docs[0] ?? null
      },
      null,
    ),
)

export const getSiteSettings = cache(
  async (): Promise<SiteSetting | null> =>
    safely(
      'getSiteSettings',
      async () => {
        const payload = await getPayloadClient()
        return await payload.findGlobal({ slug: 'siteSettings', depth: 2 })
      },
      null,
    ),
)

import config from '@payload-config'
import { type CollectionSlug, type DataFromCollectionSlug, getPayload, type Where } from 'payload'
import { cache } from 'react'
import { currentAcademicYear } from '@/lib/event-time'

/** Request-level memoization only. Public callers always execute as anonymous. Errors propagate,
 * so failed regeneration cannot replace a good page with a successful empty response. */
export const getPayloadClient = cache(async () => getPayload({ config }))
const published = { _status: { equals: 'published' } }
export const publicDocuments = async <T extends CollectionSlug>(
  collection: T,
  where: Where = {},
  depth = 1,
  sort = '-updatedAt',
): Promise<DataFromCollectionSlug<T>[]> => {
  const payload = await getPayloadClient()
  const result: DataFromCollectionSlug<T>[] = []
  for (let page = 1; ; page++) {
    const data = await payload.find({
      collection,
      where,
      depth,
      sort,
      limit: 100,
      page,
      overrideAccess: false,
      user: undefined,
      draft: false,
    })
    result.push(...data.docs)
    if (!data.hasNextPage) break
  }
  return result
}
/**
 * The current address of a document that used to live at `slug`, or null.
 *
 * Renaming a published slug otherwise abandons every inbound link to the old one — a
 * printed poster, a Telegram message, a search result. `previousSlugs` is maintained by
 * a beforeChange hook in `enhance.ts`; the routes use this to answer the old address
 * with a permanent redirect instead of a 404.
 *
 * Depth 0: only the slug is needed, and populating relationships here would be wasted
 * work on a path that exists to redirect.
 */
export const canonicalSlugFor = cache(
  async (collection: CollectionSlug, slug: string): Promise<string | null> => {
    const docs = await publicDocuments(
      collection,
      { and: [published, { previousSlugs: { in: [slug] } }] },
      0,
    )
    const found = docs[0] as { slug?: string | null } | undefined
    return found?.slug ?? null
  },
)

/** Current slug plus every address that still redirects to it, for generateStaticParams. */
export const slugParams = (docs: { slug?: string | null; previousSlugs?: string[] | null }[]) =>
  docs.flatMap((doc) =>
    [doc.slug, ...(doc.previousSlugs ?? [])]
      .filter((s): s is string => Boolean(s))
      .map((slug) => ({ slug })),
  )

export const getClubs = cache(() => publicDocuments('clubs', published, 1, 'name'))
export const getClubBySlug = cache(
  async (slug: string) =>
    (await publicDocuments('clubs', { and: [published, { slug: { equals: slug } }] }, 2))[0] ??
    null,
)
export const getEvents = cache(
  async (query: { clubId?: number | string; upcoming?: boolean; limit?: number } = {}) => {
    const where: Where = {
      and: [
        published,
        { archived: { not_equals: true } },
        ...(query.clubId ? [{ club: { equals: query.clubId } }] : []),
      ],
    }
    // Keep the full event horizon. Browsers derive current lists from these static records.
    return publicDocuments('events', where, 1, 'startsAt')
  },
)
export const getEventBySlug = cache(
  async (slug: string) =>
    (await publicDocuments('events', { and: [published, { slug: { equals: slug } }] }, 2))[0] ??
    null,
)
export const getAlbums = cache((clubId?: number | string) =>
  publicDocuments('albums', clubId ? { club: { equals: clubId } } : {}, 2, '-date'),
)
export const getAlbum = cache(
  async (id: number) => (await publicDocuments('albums', { id: { equals: id } }, 2))[0] ?? null,
)
export const getSiteSettings = cache(async () => {
  const payload = await getPayloadClient()
  return payload.findGlobal({
    slug: 'siteSettings',
    depth: 2,
    overrideAccess: false,
    user: undefined,
  })
})
export const getPeople = cache(async (clubId?: number | string, ay?: string | null) => {
  const current =
    ay === undefined ? (await getSiteSettings()).currentAcademicYear || currentAcademicYear() : ay
  const filters: Where[] = [{ archived: { not_equals: true } }]
  if (clubId) filters.push({ club: { equals: clubId } })
  if (current) filters.push({ ay: { equals: current } })
  return publicDocuments('people', { and: filters }, 1, 'displayOrder')
})
export const getPageBySlug = cache(
  async (slug: string) =>
    (await publicDocuments('pages', { and: [published, { slug: { equals: slug } }] }, 2))[0] ??
    null,
)
export const getStories = cache(() => publicDocuments('stories', published, 1))
export const getStory = cache(
  async (slug: string) =>
    (await publicDocuments('stories', { and: [published, { slug: { equals: slug } }] }, 2))[0] ??
    null,
)
export const getCampaigns = cache(() => publicDocuments('campaigns', published, 1))
export const getCampaign = cache(
  async (slug: string) =>
    (await publicDocuments('campaigns', { and: [published, { slug: { equals: slug } }] }, 2))[0] ??
    null,
)
export const getBenefits = cache(() => publicDocuments('benefits', {}, 1))

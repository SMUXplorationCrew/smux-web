import { revalidatePath } from 'next/cache.js'
import { after } from 'next/server'
import type { PayloadRequest } from 'payload'

interface HookDoc {
  id?: number | string
  _status?: string | null
  slug?: string | null
  club?: number | string | { id?: number; slug?: string | null } | null
}
interface Args {
  doc: HookDoc
  previousDoc?: HookDoc
  req: PayloadRequest
}
/** A layout invalidation covers populated media/club relationships, old owners and metadata.
 * The six-club site favors correctness over maintaining an incomplete consumer list. */
export const publicationPaths = (
  collection: string,
  doc: HookDoc,
  previous?: HookDoc,
): string[] => {
  const paths = new Set([
    '/',
    '/clubs',
    '/events',
    '/calendar',
    '/gallery',
    '/committee',
    '/sitemap.xml',
    '/search',
    '/explore',
    '/join',
    '/recruitment',
    '/benefits',
  ])
  for (const item of [doc, previous]) {
    if (!item) continue
    if (item.slug && ['events', 'clubs', 'stories', 'campaigns'].includes(collection))
      paths.add(
        `/${collection === 'campaigns' ? 'recruitment' : collection}/${encodeURIComponent(item.slug)}`,
      )
    if (item.slug && collection === 'pages') paths.add(`/${item.slug}`)
    if (collection === 'albums' && item.id) paths.add(`/gallery/${item.id}`)
  }
  return [...paths]
}
export const publicationHook =
  (collection: string) =>
  async ({ doc, previousDoc, req }: Args) => {
    if (req.context?.skipPublication) return doc
    if (
      ['events', 'clubs', 'pages', 'stories', 'campaigns'].includes(collection) &&
      doc._status !== 'published' &&
      previousDoc?._status !== 'published'
    )
      return doc
    const paths = publicationPaths(collection, doc, previousDoc)
    try {
      revalidatePath('/', 'layout')
    } catch {
      /* CLI writes are picked up by the persistent publication queue. */
    }
    try {
      await req.payload.create({
        collection: 'publish-jobs',
        data: {
          paths,
          state: 'pending',
          attempts: 0,
          club: typeof doc.club === 'object' ? doc.club?.id : (doc.club as number) || undefined,
        },
        req,
        overrideAccess: true,
        context: { skipPublication: true },
      })
      try {
        after(async () => {
          const { processPublicationJobs } = await import('@/lib/jobs')
          await processPublicationJobs(req.payload)
        })
      } catch {
        /* CLI has no request lifecycle; jobs remain pending for the worker. */
      }
    } catch (error) {
      req.payload.logger.error({ msg: 'Could not enqueue publication refresh', err: error })
      throw error
    }
    return doc
  }
export const revalidateClub = publicationHook('clubs')
export const revalidateEvent = publicationHook('events')
export const revalidateAlbum = publicationHook('albums')
export const revalidatePage = publicationHook('pages')
export const revalidateSiteSettings = publicationHook('siteSettings')

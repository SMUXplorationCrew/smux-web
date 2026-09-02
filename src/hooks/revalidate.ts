import { revalidatePath } from 'next/cache.js'
import type { Payload } from 'payload'

/**
 * Every public page is pre-rendered, so nothing a club edits appears on the site until
 * its path is revalidated. These hooks are what keep that guarantee from reading as
 * "the CMS is broken".
 */

interface HookDoc {
  _status?: string | null
  slug?: string | null
  club?: number | string | { slug?: string | null } | null
}

interface HookArgs {
  doc: HookDoc
  previousDoc?: HookDoc
  req: { payload: Payload }
}

/**
 * `revalidatePath` only works inside a Next.js request context. The seed script and
 * the Payload CLI drive the same hooks from plain Node, where it throws — and a failed
 * revalidation must never abort the write that triggered it.
 */
const safeRevalidate = (path: string, type?: 'layout' | 'page'): void => {
  try {
    if (type) revalidatePath(path, type)
    else revalidatePath(path)
  } catch {
    // Outside a request context (seed, CLI). The next build renders it fresh anyway.
  }
}

/** Resolve a club slug whether the relationship came back populated or as a bare id. */
const clubSlug = async (club: HookDoc['club'], payload: Payload): Promise<string | null> => {
  if (club === null || club === undefined) return null
  if (typeof club === 'object') return club.slug ?? null

  try {
    const doc = await payload.findByID({ collection: 'clubs', id: club, depth: 0 })
    return (doc as { slug?: string })?.slug ?? null
  } catch {
    return null
  }
}

/**
 * Drafts fire afterChange on every autosave. Revalidating on those would both hammer
 * the cache while someone is mid-sentence and push unpublished copy onto the live site,
 * so only published documents count — plus the transition where something was just
 * unpublished, which must also disappear from the site.
 */
const shouldRevalidate = (doc: HookDoc, previousDoc?: HookDoc): boolean => {
  return doc?._status === 'published' || previousDoc?._status === 'published'
}

export const revalidateClub = async ({ doc, previousDoc }: HookArgs) => {
  if (!shouldRevalidate(doc, previousDoc)) return doc

  if (doc?.slug) safeRevalidate(`/clubs/${doc.slug}`)
  // A renamed slug leaves the old path cached behind it.
  if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
    safeRevalidate(`/clubs/${previousDoc.slug}`)
  }
  safeRevalidate('/')
  safeRevalidate('/events')

  return doc
}

export const revalidateEvent = async ({ doc, previousDoc, req }: HookArgs) => {
  if (!shouldRevalidate(doc, previousDoc)) return doc

  if (doc?.slug) safeRevalidate(`/events/${doc.slug}`)
  if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
    safeRevalidate(`/events/${previousDoc.slug}`)
  }
  safeRevalidate('/events')
  safeRevalidate('/calendar')
  safeRevalidate('/')

  // An event also surfaces in its club's "upcoming events" section.
  const slug = await clubSlug(doc?.club, req.payload)
  if (slug) safeRevalidate(`/clubs/${slug}`)

  return doc
}

/** Albums feed the gallery and the club page's past-trips strip. */
export const revalidateAlbum = async ({ doc, req }: HookArgs) => {
  safeRevalidate('/gallery')
  const slug = await clubSlug(doc?.club, req.payload)
  if (slug) safeRevalidate(`/clubs/${slug}`)
  return doc
}

/** Pages are addressed by slug: /about, /join, /contact. */
export const revalidatePage = async ({ doc, previousDoc }: HookArgs) => {
  if (doc?.slug) safeRevalidate(`/${doc.slug}`)
  if (previousDoc?.slug && previousDoc.slug !== doc?.slug) {
    safeRevalidate(`/${previousDoc.slug}`)
  }
  return doc
}

/** Site settings touch the header, footer and home page, so everything goes. */
export const revalidateSiteSettings = async ({ doc }: { doc: HookDoc }) => {
  safeRevalidate('/', 'layout')
  return doc
}

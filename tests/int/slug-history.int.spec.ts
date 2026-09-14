import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { canonicalSlugFor } from '@/lib/payload'
import config from '@/payload.config'

/**
 * Renaming a published slug must not abandon the old address.
 *
 * A club's event gets linked from a printed poster, a Telegram message and whatever
 * Google has indexed. Before this, editing the slug — which the CMS invites you to do —
 * turned every one of those into a 404 with no warning and no way to notice.
 *
 * Creates and removes its own `int-slug-` fixtures. Touches no real content.
 */

let payload: Payload
let clubId: number
let eventId: number | string

const ORIGINAL = 'int-slug-original'
const RENAMED = 'int-slug-renamed'
const THIRD = 'int-slug-third'

const cleanup = async () => {
  await payload.delete({ collection: 'events', where: { slug: { like: 'int-slug-' } } })
}

const read = async (id: number | string) =>
  payload.findByID({ collection: 'events', id, overrideAccess: true, depth: 0 })

beforeAll(async () => {
  payload = await getPayload({ config })
  await cleanup()

  const { docs } = await payload.find({
    collection: 'clubs',
    where: { slug: { equals: 'trekking' } },
    limit: 1,
    overrideAccess: true,
  })
  if (!docs[0]) throw new Error('No "trekking" club. Run `pnpm seed` first.')
  clubId = docs[0].id

  const created = await payload.create({
    collection: 'events',
    data: {
      title: 'Int slug history',
      slug: ORIGINAL,
      club: clubId,
      startsAt: '2026-12-09T00:00:00.000Z',
      _status: 'published',
    },
  })
  eventId = created.id
})

afterAll(async () => {
  await cleanup()
})

describe('slug history', () => {
  it('starts with no history', async () => {
    const event = await read(eventId)
    expect(event.previousSlugs ?? []).toEqual([])
  })

  it('records the old slug when renamed', async () => {
    await payload.update({
      collection: 'events',
      id: eventId,
      data: { slug: RENAMED },
      overrideAccess: true,
    })

    const event = await read(eventId)
    expect(event.slug).toBe(RENAMED)
    expect(event.previousSlugs).toContain(ORIGINAL)
  })

  it('resolves the old address to the current one', async () => {
    expect(await canonicalSlugFor('events', ORIGINAL)).toBe(RENAMED)
  })

  it('accumulates across several renames', async () => {
    await payload.update({
      collection: 'events',
      id: eventId,
      data: { slug: THIRD },
      overrideAccess: true,
    })

    const event = await read(eventId)
    expect(event.slug).toBe(THIRD)
    expect(event.previousSlugs).toEqual(expect.arrayContaining([ORIGINAL, RENAMED]))
  })

  it('never lists its own current slug, which would redirect to itself', async () => {
    // Renaming back to an address it previously used is the case that loops.
    await payload.update({
      collection: 'events',
      id: eventId,
      data: { slug: ORIGINAL },
      overrideAccess: true,
    })

    const event = await read(eventId)
    expect(event.slug).toBe(ORIGINAL)
    expect(event.previousSlugs).not.toContain(ORIGINAL)
    expect(event.previousSlugs).toContain(THIRD)
  })

  it('leaves an unrelated address unresolved', async () => {
    expect(await canonicalSlugFor('events', 'int-slug-never-existed')).toBeNull()
  })

  it('does not record anything when a save leaves the slug alone', async () => {
    const before = (await read(eventId)).previousSlugs ?? []
    await payload.update({
      collection: 'events',
      id: eventId,
      data: { location: 'unchanged slug' },
      overrideAccess: true,
    })
    expect((await read(eventId)).previousSlugs ?? []).toEqual(before)
  })
})

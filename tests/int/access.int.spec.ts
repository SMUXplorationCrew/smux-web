import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import config from '@/payload.config'

/**
 * The acceptance test for the whole access-control layer.
 *
 * `ownClub` returns a database query rather than a boolean, so the only way to know it
 * genuinely filters is to run real queries as real scoped users with `overrideAccess`
 * off. The unit tests prove the shape of the query; this proves Postgres honours it.
 *
 * Deliberately non-destructive. `clubs.slug` is a select restricted to the six real
 * clubs, so throwaway clubs cannot be created — an earlier version deleted and recreated
 * the real ones instead, which would have wiped seeded content along with every event,
 * album and photo pointing at them. This reads the existing clubs and only ever creates
 * and removes its own `int-test-` events and users.
 */

let payload: Payload
let divingId: number | string
let trekkingId: number | string
let trekkingEditor: Record<string, unknown>
let memberUser: Record<string, unknown>

const EMAILS = ['int-trekking@smux.test', 'int-member@smux.test']

const findClub = async (slug: string) => {
  const { docs } = await payload.find({
    collection: 'clubs',
    where: { slug: { equals: slug } },
    limit: 1,
    overrideAccess: true,
  })
  if (!docs[0]) {
    throw new Error(`No "${slug}" club found. Run \`pnpm seed\` before the integration tests.`)
  }
  return docs[0].id
}

const cleanup = async () => {
  await payload.delete({ collection: 'events', where: { slug: { like: 'int-test-' } } })
  await payload.delete({ collection: 'users', where: { email: { in: EMAILS } } })
}

beforeAll(async () => {
  payload = await getPayload({ config })
  await cleanup()

  divingId = await findClub('diving')
  trekkingId = await findClub('trekking')

  await payload.create({
    collection: 'events',
    data: {
      title: 'Int test diving event',
      slug: 'int-test-diving',
      club: divingId as number,
      startsAt: '2026-12-01T00:00:00.000Z',
      _status: 'published',
    },
  })
  await payload.create({
    collection: 'events',
    data: {
      title: 'Int test trekking event',
      slug: 'int-test-trekking',
      club: trekkingId as number,
      startsAt: '2026-12-02T00:00:00.000Z',
      _status: 'published',
    },
  })

  trekkingEditor = (await payload.create({
    collection: 'users',
    data: {
      email: 'int-trekking@smux.test',
      password: 'test1234',
      role: 'editor',
      club: trekkingId as number,
    },
  })) as unknown as Record<string, unknown>

  memberUser = (await payload.create({
    collection: 'users',
    data: { email: 'int-member@smux.test', password: 'test1234', role: 'member' },
  })) as unknown as Record<string, unknown>
})

afterAll(async () => {
  await cleanup()
})

const eventBySlug = async (slug: string) => {
  const { docs } = await payload.find({
    collection: 'events',
    where: { slug: { equals: slug } },
    overrideAccess: true,
  })
  return docs[0]
}

describe('club editor scoping', () => {
  it('cannot update another club’s event', async () => {
    const divingEvent = await eventBySlug('int-test-diving')

    await expect(
      payload.update({
        collection: 'events',
        id: divingEvent.id,
        data: { title: 'Hijacked' },
        user: trekkingEditor as never,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })

  it('can update its own club’s event', async () => {
    const own = await eventBySlug('int-test-trekking')

    const updated = await payload.update({
      collection: 'events',
      id: own.id,
      data: { location: 'Updated by the Trekking editor' },
      user: trekkingEditor as never,
      overrideAccess: false,
    })

    expect(updated.location).toBe('Updated by the Trekking editor')
  })

  it('has its own club forced onto anything it creates', async () => {
    // The beforeChange hook rewrites the club rather than rejecting, so a mis-filed
    // event is silently corrected. Assert the correction actually happens — otherwise
    // an editor could create an event they are then locked out of editing.
    const created = await payload.create({
      collection: 'events',
      data: {
        title: 'Int test cross-club attempt',
        slug: 'int-test-crossclub',
        club: divingId as number,
        startsAt: '2026-12-03T00:00:00.000Z',
        _status: 'published',
      },
      user: trekkingEditor as never,
      overrideAccess: false,
    })

    const clubId = typeof created.club === 'object' ? created.club?.id : created.club
    expect(clubId).toBe(trekkingId)
  })
})

describe('member role', () => {
  it('cannot update an event even though it is signed in', async () => {
    const own = await eventBySlug('int-test-trekking')

    await expect(
      payload.update({
        collection: 'events',
        id: own.id,
        data: { title: 'Member edit' },
        user: memberUser as never,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })

  it('can read resources, which anonymous visitors cannot', async () => {
    await expect(payload.find({ collection: 'resources', overrideAccess: false })).rejects.toThrow()

    const asMember = await payload.find({
      collection: 'resources',
      user: memberUser as never,
      overrideAccess: false,
    })
    expect(asMember.docs).toBeDefined()
  })
})

describe('anonymous reads', () => {
  it('sees published events but not drafts', async () => {
    const draft = await payload.create({
      collection: 'events',
      data: {
        title: 'Int test unpublished',
        slug: 'int-test-draft',
        club: trekkingId as number,
        startsAt: '2026-12-04T00:00:00.000Z',
        _status: 'draft',
      },
    })

    const { docs } = await payload.find({
      collection: 'events',
      overrideAccess: false,
      limit: 200,
    })

    const slugs = docs.map((d) => d.slug)
    expect(slugs).toContain('int-test-trekking')
    expect(slugs).not.toContain('int-test-draft')

    await payload.delete({ collection: 'events', id: draft.id })
  })
})

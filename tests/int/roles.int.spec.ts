import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import config from '@/payload.config'

/**
 * The seven-account role matrix, run as real scoped queries.
 *
 * `access.int.spec.ts` proves `ownClub` filters for one club. This proves it holds for
 * all six, in both directions — the case that matters during recruitment week is one
 * club's editor reaching another club's events, and a single-club test cannot see a
 * mistake that only shows up on the fifth club.
 *
 * Non-destructive, and deliberately so: it creates its own `int-role-` users and events
 * and removes them, and never writes to a club document or to the real sign-ins. The
 * seeded content it reads is the same content the live site serves.
 */

const CLUBS = ['diving', 'kayaking', 'trekking', 'biking', 'skating', 'xseed'] as const
type ClubSlug = (typeof CLUBS)[number]

const editorEmail = (slug: string) => `int-role-${slug}@smux.test`
const MC_EMAIL = 'int-role-mc@smux.test'
const INACTIVE_EMAIL = 'int-role-inactive@smux.test'
const EVENT_PREFIX = 'int-role-'

let payload: Payload
const clubId = {} as Record<ClubSlug, number>
const editor = {} as Record<ClubSlug, Record<string, unknown>>
const eventId = {} as Record<ClubSlug, number | string>
let mcUser: Record<string, unknown>
let inactiveEditor: Record<string, unknown>

const emails = [...CLUBS.map(editorEmail), MC_EMAIL, INACTIVE_EMAIL]

const cleanup = async () => {
  await payload.delete({ collection: 'events', where: { slug: { like: EVENT_PREFIX } } })
  await payload.delete({ collection: 'users', where: { email: { in: emails } } })
}

beforeAll(async () => {
  payload = await getPayload({ config })
  await cleanup()

  const { docs: clubs } = await payload.find({
    collection: 'clubs',
    limit: 100,
    overrideAccess: true,
  })
  for (const slug of CLUBS) {
    const found = clubs.find((c) => c.slug === slug)
    if (!found)
      throw new Error(`No "${slug}" club. Run \`pnpm seed\` before the integration tests.`)
    clubId[slug] = found.id
  }

  for (const slug of CLUBS) {
    editor[slug] = (await payload.create({
      collection: 'users',
      data: {
        email: editorEmail(slug),
        password: 'test1234',
        role: 'editor',
        club: clubId[slug],
      },
    })) as unknown as Record<string, unknown>

    const created = await payload.create({
      collection: 'events',
      data: {
        title: `Int role ${slug}`,
        slug: `${EVENT_PREFIX}${slug}`,
        club: clubId[slug],
        startsAt: '2026-12-01T00:00:00.000Z',
        _status: 'published',
      },
    })
    eventId[slug] = created.id
  }

  mcUser = (await payload.create({
    collection: 'users',
    data: { email: MC_EMAIL, password: 'test1234', role: 'mc' },
  })) as unknown as Record<string, unknown>

  inactiveEditor = (await payload.create({
    collection: 'users',
    data: {
      email: INACTIVE_EMAIL,
      password: 'test1234',
      role: 'editor',
      club: clubId.diving,
      active: false,
    },
  })) as unknown as Record<string, unknown>
})

afterAll(async () => {
  await cleanup()
})

describe('every club editor is confined to their own club', () => {
  for (const slug of CLUBS) {
    const others = CLUBS.filter((c) => c !== slug)

    it(`${slug}: can update its own event`, async () => {
      const updated = await payload.update({
        collection: 'events',
        id: eventId[slug],
        data: { location: `set by ${slug}` },
        user: editor[slug] as never,
        overrideAccess: false,
      })
      expect(updated.location).toBe(`set by ${slug}`)
    })

    it(`${slug}: cannot update any of the other five clubs’ events`, async () => {
      for (const other of others) {
        await expect(
          payload.update({
            collection: 'events',
            id: eventId[other],
            data: { title: `hijacked by ${slug}` },
            user: editor[slug] as never,
            overrideAccess: false,
          }),
          `${slug} must not be able to edit ${other}`,
        ).rejects.toThrow()
      }
    })

    it(`${slug}: has its own club forced onto an event it files elsewhere`, async () => {
      const target = others[0]
      const created = await payload.create({
        collection: 'events',
        data: {
          title: `Int role misfile ${slug}`,
          slug: `${EVENT_PREFIX}misfile-${slug}`,
          club: clubId[target],
          startsAt: '2026-12-05T00:00:00.000Z',
          _status: 'published',
        },
        user: editor[slug] as never,
        overrideAccess: false,
      })
      const assigned = typeof created.club === 'object' ? created.club?.id : created.club
      expect(assigned).toBe(clubId[slug])
    })

    it(`${slug}: cannot promote itself to mc`, async () => {
      // selfOrMc lets an editor edit its own record; field-level access is what stops
      // the escalation, and it strips the field rather than throwing.
      const updated = await payload.update({
        collection: 'users',
        id: (editor[slug] as { id: number }).id,
        data: { role: 'mc' },
        user: editor[slug] as never,
        overrideAccess: false,
      })
      expect(updated.role).toBe('editor')
    })

    it(`${slug}: cannot read the other accounts`, async () => {
      const { docs } = await payload.find({
        collection: 'users',
        user: editor[slug] as never,
        overrideAccess: false,
        limit: 200,
      })
      expect(docs.map((d) => d.email)).toEqual([editorEmail(slug)])
    })
  }
})

describe('main committee', () => {
  it('can update every club’s event', async () => {
    for (const slug of CLUBS) {
      const updated = await payload.update({
        collection: 'events',
        id: eventId[slug],
        data: { location: 'set by mc' },
        user: mcUser as never,
        overrideAccess: false,
      })
      expect(updated.location).toBe('set by mc')
    }
  })

  it('can read every account', async () => {
    const { docs } = await payload.find({
      collection: 'users',
      user: mcUser as never,
      overrideAccess: false,
      limit: 500,
    })
    for (const slug of CLUBS) expect(docs.map((d) => d.email)).toContain(editorEmail(slug))
  })
})

describe('deactivated accounts', () => {
  // `active` is checked inside every access function rather than only at login, so
  // deactivating someone has to stop them through the REST and Local APIs too — not
  // just hide the admin panel from them.
  it('cannot update their own club’s event', async () => {
    await expect(
      payload.update({
        collection: 'events',
        id: eventId.diving,
        data: { title: 'edited while deactivated' },
        user: inactiveEditor as never,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })

  it('cannot create content', async () => {
    await expect(
      payload.create({
        collection: 'events',
        data: {
          title: 'Int role deactivated create',
          slug: `${EVENT_PREFIX}deactivated`,
          club: clubId.diving,
          startsAt: '2026-12-06T00:00:00.000Z',
          _status: 'published',
        },
        user: inactiveEditor as never,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })

  it('cannot read user records, not even their own', async () => {
    // selfOrMc returns a flat false for a deactivated user rather than a self-scoped
    // query, so Payload refuses the operation outright instead of returning an empty
    // list. Asserting the throw pins that down: an empty result would also "pass" if
    // the rule were ever loosened to a query that happens to match nothing.
    await expect(
      payload.find({
        collection: 'users',
        user: inactiveEditor as never,
        overrideAccess: false,
        limit: 200,
      }),
    ).rejects.toThrow()
  })

  it('cannot read the members-only resources', async () => {
    await expect(
      payload.find({
        collection: 'resources',
        user: inactiveEditor as never,
        overrideAccess: false,
      }),
    ).rejects.toThrow()
  })
})

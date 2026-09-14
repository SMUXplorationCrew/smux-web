import { randomBytes } from 'node:crypto'
import { sql } from '@payloadcms/db-postgres'
import { revalidatePath } from 'next/cache'
import { createLocalReq, type Where } from 'payload'
import { resolveClubId } from '@/access'
import { type ImportRow, importEvents } from '@/lib/import-events'
import { processPublicationJobs } from '@/lib/jobs'
import { inspectLink } from '@/lib/network'
import {
  checkIn,
  createCheckInToken,
  hashToken,
  recordAudit,
  registration,
  scopedEvent,
} from '@/lib/operations'
import { getPayloadClient } from '@/lib/payload'
import { siteUrl } from '@/lib/site'
import { httpUrl } from '@/lib/url'
import type { Event } from '@/payload-types'

export const dynamic = 'force-dynamic'
const text = (value: unknown, max = 2000) =>
  typeof value === 'string' ? value.trim().slice(0, max) : ''
const singaporeInput = (value: unknown) => {
  const raw = text(value, 80)
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(raw) ? `${raw}:00+08:00` : raw
}
const id = (value: unknown) => {
  const n = Number(value)
  if (!Number.isSafeInteger(n) || n < 1) throw new Error('Invalid record ID.')
  return n
}
const response = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { 'Cache-Control': 'private, no-store' } })
export async function POST(request: Request) {
  try {
    if (request.headers.get('origin') !== new URL(request.url).origin)
      return response({ error: 'Request origin is not allowed.' }, 403)
    const raw = await request.text()
    if (raw.length > 1_000_000) return response({ error: 'Request too large.' }, 413)
    const data = JSON.parse(raw) as Record<string, unknown>
    const action = text(data.action, 50)
    const payload = await getPayloadClient()
    const auth = await payload.auth({ headers: request.headers })
    const user = auth.user?.active === false ? null : auth.user
    // Database-backed counters apply across serverless instances. IPs are hashed, never stored verbatim.
    const subject = user
      ? `user:${user.id}`
      : `ip:${request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'}`
    const key = hashToken(`${action}:${subject}:${Math.floor(Date.now() / 60000)}`)
    const limit =
      action === 'metric' ? 120 : action === 'contact' || action === 'accept-invite' ? 5 : 30
    const limited = await payload.db.pool.query(
      "INSERT INTO smux_rate_limits(key,count,expires_at) VALUES($1,1,now()+interval '2 minutes') ON CONFLICT(key) DO UPDATE SET count=smux_rate_limits.count+1 RETURNING count",
      [key],
    )
    if (limited.rows[0].count > limit)
      return response({ error: 'Too many requests. Try again in a minute.' }, 429)

    if (action === 'metric') {
      const kind = text(data.kind, 40),
        target = text(data.subject, 100)
      if (
        !['club-view', 'signup-click', 'calendar-add', 'campaign-view'].includes(kind) ||
        !/^[a-z0-9-]+$/.test(target)
      )
        throw new Error('Invalid metric.')
      const day = new Date().toISOString().slice(0, 10),
        metricKey = `${kind}:${target}:${day}`
      await payload.db.pool.query(
        'INSERT INTO metrics(kind,subject,day,count,key,created_at,updated_at) VALUES($1,$2,$3,1,$4,now(),now()) ON CONFLICT(key) DO UPDATE SET count=metrics.count+1,updated_at=now()',
        [kind, target, day, metricKey],
      )
      return response({ recorded: true })
    }
    if (action === 'contact') {
      if (data.website) return response({ received: true }) // honeypot
      const settings = await payload.findGlobal({ slug: 'siteSettings', overrideAccess: false })
      if (!settings.contactFormEnabled)
        return response({ error: 'Use a listed club contact instead.' }, 409)
      const email = text(data.email, 254),
        message = text(data.message, 4000),
        subject = text(data.subject, 120)
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || !subject)
        throw new Error('Enter an email, subject and message of at least 10 characters.')
      await payload.create({
        collection: 'contact-requests',
        data: { email, message, subject, club: data.club ? id(data.club) : null },
        overrideAccess: true,
      })
      return response({ received: true })
    }
    if (action === 'accept-invite') {
      const token = text(data.token, 200),
        password = text(data.password, 200),
        name = text(data.name, 100)
      if (password.length < 12 || !name)
        throw new Error('Enter your name and a password of at least 12 characters.')
      const transactionID = await payload.db.beginTransaction()
      if (!transactionID) throw new Error('Transaction unavailable.')
      const req = await createLocalReq({ context: { skipPublication: true } }, payload)
      req.transactionID = transactionID
      try {
        await (
          payload.db.sessions![transactionID].db as {
            execute: (query: ReturnType<typeof sql>) => Promise<unknown>
          }
        ).execute(sql`SELECT id FROM invitations WHERE token_hash=${hashToken(token)} FOR UPDATE`)
        const invitation = (
          await payload.find({
            collection: 'invitations',
            where: { tokenHash: { equals: hashToken(token) } },
            limit: 1,
            depth: 0,
            req,
            overrideAccess: true,
          })
        ).docs[0]
        if (!invitation || invitation.acceptedAt || Date.parse(invitation.expiresAt) <= Date.now())
          throw new Error('Invitation expired or already used.')
        await payload.create({
          collection: 'users',
          data: {
            email: invitation.email,
            password,
            name,
            role: invitation.role,
            club: invitation.club,
            active: true,
          },
          req,
          overrideAccess: true,
        })
        await payload.update({
          collection: 'invitations',
          id: invitation.id,
          data: { acceptedAt: new Date().toISOString() },
          req,
          overrideAccess: true,
        })
        await payload.db.commitTransaction(transactionID)
        return response({ accepted: true })
      } catch (error) {
        await payload.db.rollbackTransaction(transactionID)
        throw error
      }
    }
    if (!user) return response({ error: 'Sign in to continue.' }, 401)
    const club = resolveClubId(user.club)
    if (action === 'register' || action === 'cancel-registration') {
      const result = await registration(
        payload,
        user,
        id(data.eventId),
        action === 'register' ? 'register' : 'cancel',
      )
      revalidatePath('/', 'layout')
      return response(result)
    }
    if (action === 'my-registration') {
      const docs = await payload.find({
        collection: 'registrations',
        where: { and: [{ user: { equals: user.id } }, { event: { equals: id(data.eventId) } }] },
        user,
        overrideAccess: false,
        limit: 1,
        depth: 0,
      })
      return response({ registration: docs.docs[0] ?? null })
    }
    if (action === 'check-in-token')
      return response(await createCheckInToken(payload, user, id(data.eventId)))
    if (action === 'interest') {
      const eventId = data.eventId ? id(data.eventId) : null,
        clubId = data.clubId ? id(data.clubId) : null
      if (!eventId && !clubId) throw new Error('Choose an event or club.')
      if (data.active !== false && data.consent !== true)
        throw new Error('Consent is required for reminders.')
      if (eventId)
        await payload.findByID({ collection: 'events', id: eventId, overrideAccess: false })
      if (clubId) await payload.findByID({ collection: 'clubs', id: clubId, overrideAccess: false })
      const interestKey = `${user.id}:${eventId || ''}:${clubId || ''}`
      await payload.db.pool.query(
        `INSERT INTO interests(user_id,event_id,club_id,key,consented_at,active,created_at,updated_at) VALUES($1,$2,$3,$4,now(),$5,now(),now()) ON CONFLICT(key) DO UPDATE SET active=EXCLUDED.active,consented_at=CASE WHEN EXCLUDED.active THEN now() ELSE interests.consented_at END,updated_at=now()`,
        [user.id, eventId, clubId, interestKey, data.active !== false],
      )
      return response({ active: data.active !== false })
    }
    if (user.role !== 'mc' && user.role !== 'editor')
      return response({ error: 'Editor access required.' }, 403)
    if (user.role === 'editor' && !club)
      return response({ error: 'Your account needs a club assignment.' }, 403)
    if (action === 'check-in') return response(await checkIn(payload, user, text(data.token, 200)))
    if (action === 'preset') {
      const clubId = id(data.clubId)
      const doc = await payload.findByID({
        collection: 'clubs',
        id: clubId,
        user,
        overrideAccess: false,
        draft: true,
      })
      if (user.role !== 'mc' && resolveClubId(user.club) !== clubId)
        throw new Error('This club is outside your scope.')
      const titles: Record<string, string> = {
        beginner: 'Your first session',
        trip: 'Before the trip',
        recruitment: 'How to join',
      }
      const heading = titles[text(data.preset, 30)]
      if (!heading) throw new Error('Choose a preset.')
      await payload.update({
        collection: 'clubs',
        id: clubId,
        user,
        overrideAccess: false,
        data: {
          _status: 'draft',
          sections: [
            ...(doc.sections || []),
            {
              blockType: 'richText',
              heading,
              content: {
                root: {
                  type: 'root',
                  version: 1,
                  direction: 'ltr',
                  format: '',
                  indent: 0,
                  children: [
                    {
                      type: 'paragraph',
                      version: 1,
                      children: [
                        {
                          type: 'text',
                          version: 1,
                          text: 'Complete this section with verified eligibility, dates, costs, equipment and contact details.',
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
        },
      })
      return response({
        url: `/admin/collections/clubs/${clubId}`,
        message: 'Draft preset added. Complete and review before publishing.',
      })
    }
    if (action === 'create-event') {
      const eventData = {
        title: text(data.title, 160),
        slug: text(data.slug, 160),
        startsAt: singaporeInput(data.startsAt),
        endsAt: data.endsAt ? singaporeInput(data.endsAt) : null,
        signupUrl: httpUrl(text(data.signupUrl, 2000)),
        timeTbc: data.timeTbc === true,
        location: text(data.location, 500),
        cost: text(data.cost, 200),
        organizerContact: text(data.organizerContact, 200),
        club: user.role === 'editor' ? Number(club) : data.clubId ? id(data.clubId) : null,
        _status: 'draft' as const,
      }
      const event = await payload.create({
        collection: 'events',
        data: eventData,
        user,
        overrideAccess: false,
      })
      return response({ id: event.id, url: `/admin/collections/events/${event.id}` })
    }
    if (action === 'duplicate' || action === 'repeat') {
      const event = await scopedEvent(payload, user, id(data.eventId), true)
      const count = action === 'repeat' ? Math.min(26, Math.max(1, Number(data.count) || 1)) : 1
      const ids = []
      for (let n = 1; n <= count; n++) {
        const {
          id: _id,
          createdAt: _created,
          updatedAt: _updated,
          externalId: _external,
          ...copy
        } = event
        const shift = action === 'repeat' ? n * 7 * 86400000 : 0
        const next = await payload.create({
          collection: 'events',
          data: {
            ...copy,
            club: resolveClubId(event.club) as number | null,
            cover: typeof event.cover === 'object' ? event.cover?.id : event.cover,
            slug: `${event.slug}-${randomBytes(4).toString('hex')}`,
            title: event.title,
            startsAt: new Date(Date.parse(event.startsAt) + shift).toISOString(),
            endsAt: event.endsAt ? new Date(Date.parse(event.endsAt) + shift).toISOString() : null,
            signupUrl: null,
            signupOpens: null,
            signupCloses: null,
            spotsTaken: null,
            reviewState: 'draft',
            _status: 'draft',
            seriesId: action === 'repeat' ? event.seriesId || `series-${event.id}` : null,
          },
          user,
          overrideAccess: false,
        })
        ids.push(next.id)
      }
      await recordAudit(payload, user, action, club ? Number(club) : null, { ids })
      return response({
        ids,
        message: 'Drafts created. Review dates, links and capacity before publication.',
      })
    }
    if (action === 'import') {
      if (!Array.isArray(data.rows)) throw new Error('Supply event rows.')
      return response(
        await importEvents(
          payload,
          user,
          data.rows as ImportRow[],
          data.clubId ? id(data.clubId) : null,
          data.apply === true,
        ),
      )
    }
    if (action === 'archive' || action === 'submit-review' || action === 'approve') {
      const ids = Array.isArray(data.ids) ? data.ids.slice(0, 100).map(id) : [id(data.eventId)]
      if (action === 'approve' && user.role !== 'mc')
        return response({ error: 'Only MC can approve.' }, 403)
      const results = []
      for (const eventId of ids) {
        try {
          await scopedEvent(payload, user, eventId, true)
          await payload.update({
            collection: 'events',
            id: eventId,
            data:
              action === 'archive'
                ? { archived: true, _status: 'draft' }
                : action === 'approve'
                  ? { reviewState: 'approved', _status: 'published' }
                  : { reviewState: 'ready', _status: 'draft' },
            user,
            overrideAccess: false,
          })
          results.push({ id: eventId, ok: true })
        } catch (error) {
          results.push({
            id: eventId,
            ok: false,
            error: error instanceof Error ? error.message : 'Update failed',
          })
        }
      }
      return response({ results })
    }
    if (action === 'link-check') {
      const event = await scopedEvent(payload, user, id(data.eventId), true)
      if (!event.signupUrl) throw new Error('No registration link to check.')
      let result: { status: number; state: 'healthy' | 'review' | 'failed' }
      try {
        result = await inspectLink(event.signupUrl)
      } catch {
        result = { status: 0, state: 'review' }
      }
      await payload.create({
        collection: 'link-checks',
        data: {
          url: event.signupUrl,
          club: resolveClubId(event.club) as number | null,
          state: result.state,
          statusCode: result.status,
          checkedAt: new Date().toISOString(),
          note:
            result.state === 'review'
              ? 'Verify manually. Some form providers block automatic checks.'
              : '',
        },
        overrideAccess: true,
      })
      return response(result)
    }
    if (action === 'assist') {
      const input = text(data.text, 12000)
      if (!input) throw new Error('Enter text to review.')
      const sentences = input.split(/(?<=[.!?])\s+/).filter(Boolean)
      return response({
        summary: sentences.slice(0, 2).join(' '),
        wordCount: input.split(/\s+/).length,
        suggestions: [
          ...(sentences.some((s) => s.split(/\s+/).length > 30)
            ? ['Split sentences longer than 30 words.']
            : []),
          ...(/\[[^\]]+\]/.test(input)
            ? ['Replace or remove unconfirmed bracketed placeholders before publishing.']
            : []),
          'Verify dates, costs and contacts against the source.',
        ],
        mode: 'Local editorial helper. No text was sent to an external model.',
      })
    }
    if (action === 'media-usage') {
      const mediaId = id(data.mediaId)
      await payload.findByID({ collection: 'media', id: mediaId, user, overrideAccess: false })
      const matches = []
      for (const collection of [
        'clubs',
        'events',
        'albums',
        'people',
        'pages',
        'stories',
      ] as const) {
        const where: Where =
          collection === 'events'
            ? { cover: { equals: mediaId } }
            : collection === 'clubs'
              ? {
                  or: [
                    { hero: { equals: mediaId } },
                    { logo: { equals: mediaId } },
                    { gallery: { contains: mediaId } },
                  ],
                }
              : collection === 'albums'
                ? { photos: { contains: mediaId } }
                : collection === 'people'
                  ? { photo: { equals: mediaId } }
                  : collection === 'pages'
                    ? { heroImage: { equals: mediaId } }
                    : { cover: { equals: mediaId } }
        const docs = await payload.find({
          collection,
          where,
          depth: 0,
          limit: 100,
          user,
          overrideAccess: false,
        })
        for (const doc of docs.docs) matches.push({ collection, id: doc.id })
      }
      return response({
        matches,
        note: 'Direct references are listed. Also review rich-text and custom blocks before deleting.',
      })
    }
    if (user.role !== 'mc') return response({ error: 'Main committee access required.' }, 403)
    if (action === 'invite') {
      const email = text(data.email, 254).toLowerCase()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email.')
      const role = data.role === 'editor' ? 'editor' : 'member'
      const clubId = role === 'editor' ? id(data.clubId) : null
      const token = randomBytes(32).toString('hex')
      await payload.create({
        collection: 'invitations',
        data: {
          email,
          role,
          club: clubId,
          tokenHash: hashToken(token),
          expiresAt: new Date(Date.now() + 48 * 3600000).toISOString(),
        },
        overrideAccess: true,
      })
      await recordAudit(payload, user, 'invite', clubId, { role })
      return response({
        url: `${siteUrl}/invite#${token}`,
        message:
          'Invitation expires in 48 hours. Share this private link with the intended recipient.',
      })
    }
    if (action === 'refresh') return response({ jobs: await processPublicationJobs(payload) })
    if (action === 'handover') {
      const year = text(data.year, 7)
      if (!/^AY\d{2}\/\d{2}$/.test(year)) throw new Error('Use academic year format AY26/27.')
      if (data.activate === true) {
        if (data.reviewed !== true)
          throw new Error('Review committee names, roles and permissions first.')
        await payload.updateGlobal({
          slug: 'siteSettings',
          data: { currentAcademicYear: year },
          user,
          overrideAccess: false,
        })
        return response({ activeYear: year })
      }
      const previous = await payload.find({
        collection: 'people',
        where: { ay: { equals: text(data.fromYear, 7) } },
        limit: 200,
        depth: 0,
        user,
        overrideAccess: false,
      })
      const ids = []
      for (const person of previous.docs) {
        const existing = await payload.find({
          collection: 'people',
          where: {
            and: [
              { ay: { equals: year } },
              { name: { equals: person.name } },
              { role: { equals: person.role } },
            ],
          },
          limit: 1,
          overrideAccess: true,
        })
        if (existing.docs.length) continue
        const { _status, ...fields } = person as typeof person & { _status?: string }
        const { id: _id, createdAt: _c, updatedAt: _u, ...copy } = fields
        const created = await payload.create({
          collection: 'people',
          data: { ...copy, ay: year, archived: true },
          user,
          overrideAccess: false,
        })
        ids.push(created.id)
      }
      return response({
        ids,
        message:
          'Staged as archived records. Update names, roles and photos, then unarchive reviewed records before activating the year.',
      })
    }
    return response({ error: 'Unknown operation.' }, 400)
  } catch (error) {
    return response({ error: error instanceof Error ? error.message : 'Operation failed.' }, 400)
  }
}

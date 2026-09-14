import { createHash, randomBytes, timingSafeEqual } from 'node:crypto'
import type { Payload } from 'payload'
import { resolveClubId } from '@/access'
import { eventLifecycle } from '@/lib/event-time'
import { getSignupStatus } from '@/lib/signupState'
import type { Event, User } from '@/payload-types'

export const hashToken = (value: string) => createHash('sha256').update(value).digest('hex')
export const constantTimeEqual = (a: string, b: string) => {
  const x = Buffer.from(a),
    y = Buffer.from(b)
  return x.length === y.length && timingSafeEqual(x, y)
}
export const scopedEvent = async (payload: Payload, user: User, id: number, write = false) => {
  const event = await payload.findByID({ collection: 'events', id, user, overrideAccess: false })
  if (
    write &&
    user.role !== 'mc' &&
    (user.role !== 'editor' || resolveClubId(event.club) !== resolveClubId(user.club))
  )
    throw new Error('This event belongs to another club.')
  return event
}
export const recordAudit = async (
  payload: Payload,
  user: User,
  action: string,
  club: number | null,
  details: Record<string, unknown> = {},
) =>
  payload.create({
    collection: 'audit-log',
    data: { action, actor: user.id, club, details },
    overrideAccess: true,
  })

/** Capacity and waitlist transitions share the same event row lock. No overselling under concurrency. */
export async function registration(
  payload: Payload,
  user: User,
  id: number,
  action: 'register' | 'cancel',
) {
  const connection = await payload.db.pool.connect()
  try {
    await connection.query('BEGIN')
    const result = await connection.query('SELECT * FROM events WHERE id=$1 FOR UPDATE', [id])
    const row = result.rows[0]
    if (row?._status !== 'published' || row.registration_mode !== 'native')
      throw new Error('Registration is not available for this event.')
    const event: Partial<Event> = {
      startsAt: row.starts_at,
      endsAt: row.ends_at,
      timeTbc: row.time_tbc,
      cancelled: row.cancelled,
      signupOpens: row.signup_opens,
      signupCloses: row.signup_closes,
    }
    if (
      action === 'register' &&
      (eventLifecycle(event) === 'past' ||
        eventLifecycle(event) === 'cancelled' ||
        getSignupStatus(event).state !== 'open')
    )
      throw new Error('Registration is not open.')
    const reference = `event-${id}-user-${user.id}`
    const prior = (
      await connection.query('SELECT * FROM registrations WHERE reference=$1', [reference])
    ).rows[0]
    if (action === 'register' && prior && prior.status !== 'cancelled') {
      await connection.query('COMMIT')
      return { status: prior.status, reference }
    }
    if (action === 'cancel') {
      if (!prior) throw new Error('No registration to cancel.')
      await connection.query(
        "UPDATE registrations SET status='cancelled',checked_in_at=NULL,check_in_token_hash=NULL,updated_at=now() WHERE reference=$1",
        [reference],
      )
    } else {
      const {
        rows: [count],
      } = await connection.query(
        "SELECT count(*)::int AS n FROM registrations WHERE event_id=$1 AND status='registered'",
        [id],
      )
      const status = row.capacity == null || count.n < row.capacity ? 'registered' : 'waitlisted'
      await connection.query(
        `INSERT INTO registrations(reference,event_id,club_id,user_id,status,created_at,updated_at) VALUES($1,$2,$3,$4,$5,now(),now()) ON CONFLICT(reference) DO UPDATE SET status=EXCLUDED.status,updated_at=now()`,
        [reference, id, row.club_id, user.id, status],
      )
    }
    if (action === 'cancel' && prior?.status === 'registered' && !row.cancelled) {
      await connection.query(
        "UPDATE registrations SET status='registered',updated_at=now() WHERE id=(SELECT id FROM registrations WHERE event_id=$1 AND status='waitlisted' ORDER BY created_at,id LIMIT 1)",
        [id],
      )
    }
    await connection.query(
      "UPDATE events SET spots_taken=(SELECT count(*) FROM registrations WHERE event_id=$1 AND status='registered'),updated_at=now() WHERE id=$1",
      [id],
    )
    const state = (
      await connection.query('SELECT status FROM registrations WHERE reference=$1', [reference])
    ).rows[0]?.status
    await connection.query('COMMIT')
    return { reference, status: state }
  } catch (error) {
    await connection.query('ROLLBACK')
    throw error
  } finally {
    connection.release()
  }
}
export async function createCheckInToken(payload: Payload, user: User, eventId: number) {
  const result = await payload.find({
    collection: 'registrations',
    where: {
      and: [
        { event: { equals: eventId } },
        { user: { equals: user.id } },
        { status: { equals: 'registered' } },
      ],
    },
    user,
    overrideAccess: false,
    limit: 1,
  })
  const doc = result.docs[0]
  if (!doc) throw new Error('A confirmed registration is required.')
  const token = randomBytes(24).toString('hex')
  const expiresAt = new Date(Date.now() + 10 * 60000).toISOString()
  await payload.update({
    collection: 'registrations',
    id: doc.id,
    data: { checkInTokenHash: hashToken(token), checkInExpiresAt: expiresAt },
    overrideAccess: true,
  })
  return { token, expiresAt, registrationId: doc.id }
}
export async function checkIn(payload: Payload, user: User, token: string) {
  const found = await payload.find({
    collection: 'registrations',
    where: { checkInTokenHash: { equals: hashToken(token) } },
    overrideAccess: true,
    limit: 1,
    depth: 0,
  })
  const doc = found.docs[0]
  if (!doc?.checkInExpiresAt || Date.parse(doc.checkInExpiresAt) < Date.now())
    throw new Error('Check-in code expired or invalid.')
  await scopedEvent(payload, user, Number(doc.event), true)
  if (doc.status !== 'registered') throw new Error('Only confirmed registrations can check in.')
  const updated = await payload.db.pool.query(
    'UPDATE registrations SET checked_in_at=now(),check_in_token_hash=NULL,updated_at=now() WHERE id=$1 AND check_in_token_hash=$2 AND check_in_expires_at>now() RETURNING id',
    [doc.id, hashToken(token)],
  )
  if (!updated.rowCount) throw new Error('Code was already used.')
  return { checkedIn: true }
}

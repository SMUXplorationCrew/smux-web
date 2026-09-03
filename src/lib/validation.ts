/**
 * Field validation shared by the collections.
 *
 * These exist because the public site derives meaning from these values rather than
 * displaying them raw: a sign-up window that closes before it opens, or an event that
 * ends before it starts, produces a silently wrong label rather than an error. Catching
 * it at the point of entry is the only place it is cheap.
 */

/** Payload passes the whole document as `data` alongside the field's own value. */
interface EventLike {
  startsAt?: string | null
  endsAt?: string | null
  signupOpens?: string | null
  signupCloses?: string | null
  capacity?: number | null
  spotsTaken?: number | null
}

const at = (v: unknown): number | null => {
  if (typeof v !== 'string' || !v) return null
  const t = new Date(v).getTime()
  return Number.isNaN(t) ? null : t
}

export const validateEndsAt = (value: unknown, { data }: { data?: EventLike } = {}) => {
  const end = at(value)
  const start = at(data?.startsAt)
  if (end === null || start === null) return true
  return end >= start || 'The event cannot end before it starts.'
}

export const validateSignupCloses = (value: unknown, { data }: { data?: EventLike } = {}) => {
  const closes = at(value)
  const opens = at(data?.signupOpens)
  if (closes === null || opens === null) return true
  return closes >= opens || 'Sign-ups cannot close before they open.'
}

export const validateSpotsTaken = (value: unknown, { data }: { data?: EventLike } = {}) => {
  if (typeof value !== 'number') return true
  if (value < 0) return 'Places taken cannot be negative.'
  const capacity = data?.capacity
  if (typeof capacity !== 'number') return true
  return value <= capacity || `Places taken (${value}) cannot exceed the capacity of ${capacity}.`
}

/**
 * Placeholders are deliberate — unconfirmed facts stay in [BRACKETS] so they are
 * greppable rather than invented. But a published page should never show one, so
 * publishing is where they are caught.
 */
const PLACEHOLDER = /\[[^\]]*\]/

export const noPlaceholderWhenPublished = (
  value: unknown,
  { data, siblingData }: { data?: { _status?: string }; siblingData?: unknown } = {},
) => {
  if (data?._status !== 'published') return true
  if (typeof value !== 'string' || !PLACEHOLDER.test(value)) return true
  return 'Still contains a [placeholder]. Fill it in, or save as a draft instead of publishing.'
}

/**
 * Sign-up state is derived, never stored. There is deliberately no status field on
 * an event: a human forgetting to flip it is the failure this rule exists to prevent.
 *
 * Ordering matters. A full event reads as closed even while its window is open, and
 * a closed window wins over a not-yet-open one.
 */

export type SignupState = 'not-open' | 'open' | 'closed'

export interface SignupInput {
  signupOpens?: string | Date | null
  signupCloses?: string | Date | null
  capacity?: number | null
  /**
   * Places already taken. Sign-ups are handled off-site via `signupUrl`, so this is
   * only known if a club records it; when it is null, capacity cannot close an event.
   */
  spotsTaken?: number | null
}

export interface SignupStatus {
  state: SignupState
  label: string
}

/** Events are run in Singapore; formatting in the viewer's zone would shift the date. */
const SG_TIME_ZONE = 'Asia/Singapore'

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const

/**
 * Only the day and month *numbers* come from Intl; the abbreviation is ours.
 *
 * Every day-first English locale in current CLDR renders September as "Sept" (ICU 78
 * checked directly), and the one locale that says "Sep" — en-US — puts the month
 * first. The spec asks for "Opens 8 Sep", so the label is assembled by hand while
 * Intl still does the part that genuinely needs it: resolving which calendar day the
 * instant falls on in Singapore.
 */
const dayMonthParts = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'numeric',
  timeZone: SG_TIME_ZONE,
})

const dayMonth = {
  format: (date: Date): string => {
    const parts = dayMonthParts.formatToParts(date)
    // Numeric day + numeric month makes en-GB pad both to two digits, so the day is
    // read as a number to drop the leading zero: "8 Sep", not "08 Sep".
    const day = Number(parts.find((p) => p.type === 'day')?.value)
    const month = Number(parts.find((p) => p.type === 'month')?.value)
    if (Number.isNaN(day) || Number.isNaN(month)) return ''
    return `${day} ${MONTHS[month - 1] ?? ''}`.trim()
  },
}

const toDate = (value: string | Date | null | undefined): Date | null => {
  if (value === null || value === undefined) return null
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

/** "8 Sep" — the form the opens-soon label uses. */
export const formatOpensDate = (value: string | Date): string => {
  const date = toDate(value)
  return date ? dayMonth.format(date) : ''
}

const isFull = (capacity?: number | null, spotsTaken?: number | null): boolean => {
  if (capacity === null || capacity === undefined) return false
  if (spotsTaken === null || spotsTaken === undefined) return false
  return spotsTaken >= capacity
}

/**
 * `now` is injectable so the three boundaries can be tested without faking clocks.
 *
 * The closing edge is inclusive — at the exact `signupCloses` instant an event is
 * already closed, matching how a stated deadline is normally read. The opening edge
 * is inclusive the other way: at exactly `signupOpens`, sign-ups are open.
 */
export const getSignupStatus = (event: SignupInput, now: Date = new Date()): SignupStatus => {
  if (isFull(event.capacity, event.spotsTaken)) {
    return { state: 'closed', label: 'Sign-ups closed' }
  }

  const closes = toDate(event.signupCloses)
  if (closes && now.getTime() >= closes.getTime()) {
    return { state: 'closed', label: 'Sign-ups closed' }
  }

  const opens = toDate(event.signupOpens)
  if (opens && now.getTime() < opens.getTime()) {
    return { state: 'not-open', label: `Opens ${dayMonth.format(opens)}` }
  }

  // No opening date set means nothing is gating sign-ups yet.
  return { state: 'open', label: 'Sign up' }
}

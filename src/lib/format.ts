/**
 * Date presentation for the public site. Everything formats in Singapore time — an
 * event at 8pm SGT must not read as 12pm to a browser in another zone.
 *
 * These are display helpers only. Sign-up state lives in signupState.ts, which must
 * stay the single source of truth for whether an event is open.
 */

const SG = 'Asia/Singapore'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const parts = (value: string | Date, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-GB', { timeZone: SG, ...opts }).formatToParts(
    value instanceof Date ? value : new Date(value),
  )

const part = (list: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) =>
  list.find((p) => p.type === type)?.value ?? ''

const valid = (value: string | Date | null | undefined): Date | null => {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}

/**
 * Month abbreviations are written out rather than taken from Intl: current CLDR
 * renders September as "Sept" in every day-first English locale, and the house style
 * is "8 Sep". See the same note in signupState.ts.
 */
export const formatDay = (value: string | Date | null | undefined): string => {
  const d = valid(value)
  if (!d) return ''
  const p = parts(d, { day: 'numeric', month: 'numeric' })
  return `${Number(part(p, 'day'))} ${MONTHS[Number(part(p, 'month')) - 1] ?? ''}`
}

/** "Sat 12 Sep" — for cards, where the weekday helps someone plan. */
export const formatDayWithWeekday = (value: string | Date | null | undefined): string => {
  const d = valid(value)
  if (!d) return ''
  const p = parts(d, { weekday: 'short', day: 'numeric', month: 'numeric' })
  const weekday = part(p, 'weekday')
  return `${weekday} ${formatDay(d)}`
}

/** "8:30pm", or "8pm" on the hour. */
export const formatTime = (value: string | Date | null | undefined): string => {
  const d = valid(value)
  if (!d) return ''
  const p = parts(d, { hour: 'numeric', minute: '2-digit', hour12: true })
  const hour = part(p, 'hour')
  const minute = part(p, 'minute')
  const period = part(p, 'dayPeriod').toLowerCase().replace(/\s/g, '')
  return minute === '00' ? `${hour}${period}` : `${hour}:${minute}${period}`
}

/**
 * "Sat 12 Sep, 8am – 1pm", collapsing the date when both ends share one.
 *
 * With `timeTbc` the clock is omitted entirely — the committee calendar records dates
 * without times, and showing an invented "12am" would read as fact.
 */
export const formatEventWhen = (
  startsAt: string | Date | null | undefined,
  endsAt?: string | Date | null,
  timeTbc?: boolean | null,
): string => {
  const start = valid(startsAt)
  if (!start) return ''

  const end = valid(endsAt)
  const sameDay = end ? formatDay(start) === formatDay(end) : true

  if (timeTbc) {
    return !end || sameDay
      ? formatDayWithWeekday(start)
      : `${formatDayWithWeekday(start)} – ${formatDayWithWeekday(end)}`
  }

  const startLabel = `${formatDayWithWeekday(start)}, ${formatTime(start)}`
  if (!end) return startLabel

  return sameDay
    ? `${startLabel} – ${formatTime(end)}`
    : `${startLabel} – ${formatDayWithWeekday(end)}, ${formatTime(end)}`
}

/** Calendar-grid helpers: which SG calendar day an instant falls on. */
export const sgDateKey = (value: string | Date): string => {
  const p = parts(value, { day: '2-digit', month: '2-digit', year: 'numeric' })
  return `${part(p, 'year')}-${part(p, 'month')}-${part(p, 'day')}`
}

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export { DAYS as WEEKDAY_LABELS }

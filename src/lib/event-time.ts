import { sgDateKey } from '@/lib/format'

export interface EventTime {
  startsAt?: string | Date | null
  endsAt?: string | Date | null
  timeTbc?: boolean | null
  cancelled?: boolean | null
}
export const timestamp = (value: string | Date | null | undefined): number | null => {
  if (!value) return null
  const time = new Date(value).getTime()
  return Number.isFinite(time) ? time : null
}
export const nextDateKey = (key: string): string =>
  new Date(new Date(`${key}T00:00:00Z`).getTime() + 86400000).toISOString().slice(0, 10)

/** Midnight SGT at the end of the calendar day this instant falls on. */
const endOfSgDay = (value: string | Date): number =>
  new Date(`${nextDateKey(sgDateKey(value))}T00:00:00+08:00`).getTime()

export const eventEnd = (event: EventTime): number | null => {
  const { startsAt } = event
  if (!startsAt || timestamp(startsAt) === null) return null
  if (event.timeTbc) return endOfSgDay(event.endsAt || startsAt)
  // Unknown end: continue displaying the event for its local calendar day. Never invent a clock time.
  return timestamp(event.endsAt) ?? endOfSgDay(startsAt)
}
export const eventLifecycle = (
  event: EventTime,
  now = Date.now(),
): 'upcoming' | 'ongoing' | 'past' | 'cancelled' => {
  if (event.cancelled) return 'cancelled'
  const end = eventEnd(event)
  if (end !== null && now >= end) return 'past'
  const start =
    event.timeTbc && event.startsAt
      ? new Date(`${sgDateKey(event.startsAt)}T00:00:00+08:00`).getTime()
      : timestamp(event.startsAt)
  return start !== null && now >= start ? 'ongoing' : 'upcoming'
}
export const currentAcademicYear = (now = new Date()): string => {
  const [year, month] = sgDateKey(now).split('-').map(Number)
  const start = month >= 8 ? year : year - 1
  return `AY${String(start).slice(-2)}/${String(start + 1).slice(-2)}`
}

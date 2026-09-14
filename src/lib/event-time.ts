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

export const eventEnd = (event: EventTime): number | null => {
  const start = timestamp(event.startsAt)
  if (start === null) return null
  if (event.timeTbc)
    return new Date(
      `${nextDateKey(sgDateKey(event.endsAt || event.startsAt!))}T00:00:00+08:00`,
    ).getTime()
  // Unknown end: continue displaying the event for its local calendar day. Never invent a clock time.
  return (
    timestamp(event.endsAt) ??
    new Date(`${nextDateKey(sgDateKey(event.startsAt!))}T00:00:00+08:00`).getTime()
  )
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
